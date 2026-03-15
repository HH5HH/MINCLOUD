const BLONDIE_TIME_WORKSPACE_MESSAGE_TYPE = "underpar:blondie-time-workspace";
const BLONDIE_TIME_MESSAGE_TYPE = "underpar:blondie-time";
const BLONDIE_TIME_RUNTIME_STORAGE_KEY = "underpar_blondie_time_esm_state";
const BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY = "underpar_blondie_time_bt_launch";
const BLONDIE_TIME_PREFS_STORAGE_KEY = "underpar_blondie_time_esm_prefs";
const BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES = Object.freeze([2, 5, 10, 15]);
const ESM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const BLONDIE_TIME_LOGIC = globalThis.UnderParBlondieTimeLogic;
const UNDERPAR_BLONDIE_SHARE_PICKER = globalThis.UnderParBlondieSharePicker;
const DEFAULT_ADOBEPASS_ENVIRONMENT =
  globalThis.UnderParEnvironment?.getDefaultEnvironment?.() || {
    key: "release-production",
    label: "Production",
    route: "release-production",
    mgmtBase: "https://mgmt.auth.adobe.com",
    esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/",
  };
const FIXED_EXPORT_COLUMNS = Object.freeze([
  "Analysis Table",
  "Threshold Hits",
  "DATE",
  "AuthN Success",
  "AuthZ Success",
  "Avg AuthZ Latency",
]);
const BLONDIE_BUTTON_INACTIVE_MESSAGE =
  "No zip-zap without SLACKTIVATION. Please visit VAULT container on the UP Tab to feed your ZIP.KEY to UnderPAR";
const BLONDIE_BUTTON_SHARE_TARGETS_EMPTY_MESSAGE =
  "No pass-transition roster is cached yet. Re-SLACKTIVATE UnderPAR in the VAULT.";
const BLONDIE_BUTTON_SHARE_NOTE_EMPTY_MESSAGE = "Enter a Slack note before sending.";
const BLONDIE_TIME_CLOSE_GUARD_STORAGE_KEY = "underpar_blondie_time_bt_close_guard";
const BLONDIE_TIME_CLOSE_GUARD_MIN_LAPS = 3;
const BLONDIE_TIME_CLOSE_GUARD_PROMPT =
  "An active Blondie Time session is still running. Closing BT_WS will stop monitoring and auto-export the current session CSV.";

if (!BLONDIE_TIME_LOGIC?.analyzeRows) {
  throw new Error("UnderPAR Blondie Time logic runtime is unavailable.");
}
if (!UNDERPAR_BLONDIE_SHARE_PICKER?.createController || !UNDERPAR_BLONDIE_SHARE_PICKER?.normalizeTargets) {
  throw new Error("UnderPar Blondie share picker runtime is unavailable.");
}

const blondieSharePickerController = UNDERPAR_BLONDIE_SHARE_PICKER.createController({
  emptyTargetsMessage: BLONDIE_BUTTON_SHARE_TARGETS_EMPTY_MESSAGE,
  emptyNoteMessage: BLONDIE_BUTTON_SHARE_NOTE_EMPTY_MESSAGE,
  showHostStatus(message = "", type = "error") {
    setStatus(message, type);
  },
});

const state = {
  windowId: 0,
  tabId: 0,
  controllerOnline: false,
  controllerStateVersion: 0,
  controllerStateUpdatedAt: 0,
  adobePassEnvironment: { ...DEFAULT_ADOBEPASS_ENVIRONMENT },
  slackReady: false,
  slackUserId: "",
  slackUserName: "",
  slackShareTargets: [],
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  workspaceContextKey: "",
  cardsById: new Map(),
  batchRunning: false,
  lapRunning: false,
  runtimeState: null,
  thresholds: BLONDIE_TIME_LOGIC.normalizeThresholds(),
  sessionHistory: [],
  sessionStartedAt: 0,
  sessionStoppedAt: 0,
  sessionExporting: false,
  exportPanelOpen: false,
  lastStartOptions: null,
  activeBatchReason: "",
  launchConsumedAt: 0,
  timerPickerOpen: false,
  timerPendingMode: "self",
  timerCountdownRafId: 0,
  timerCountdownSecond: -1,
  timerLocalWarning: "",
  closeGuardPersistTimerId: 0,
  timerOutsidePointerHandler: null,
  timerOutsideKeyHandler: null,
};

const els = {
  root: document.getElementById("bt-workspace-root"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  cardsHost: document.getElementById("workspace-cards"),
  summaryStrip: document.getElementById("bt-summary-strip"),
  pageEnvBadge: document.getElementById("page-env-badge"),
  pageEnvBadgeValue: document.getElementById("page-env-badge-value"),
  timerButton: document.getElementById("workspace-blondie-time"),
  timerStopButton: document.getElementById("workspace-blondie-time-stop"),
  timerPicker: document.getElementById("workspace-blondie-time-picker"),
  monitorTitle: document.getElementById("bt-monitor-title"),
  monitorSubtitle: document.getElementById("bt-monitor-subtitle"),
  monitoringStopZone: document.getElementById("bt-monitoring-stop-zone"),
  monitoringStopButton: document.getElementById("bt-monitoring-stop-button"),
  thresholdMinAuthn: document.getElementById("bt-threshold-min-authn"),
  thresholdAuthn: document.getElementById("bt-threshold-authn"),
  thresholdAuthz: document.getElementById("bt-threshold-authz"),
  thresholdLatency: document.getElementById("bt-threshold-latency"),
  refreshButton: document.getElementById("bt-refresh-now"),
  sessionToggleButton: document.getElementById("bt-session-report-toggle"),
  sessionPanel: document.getElementById("bt-session-panel"),
  sessionPanelBody: document.getElementById("bt-session-panel-body"),
  exportButtons: Array.from(document.querySelectorAll(".bt-export-btn")),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function firstNonEmptyString(values = []) {
  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value ?? "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function cloneJson(value, fallback = null) {
  try {
    return value == null ? fallback : JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function normalizeTriggerMode(value = "") {
  return String(value || "").trim().toLowerCase() === "teammate" ? "teammate" : "self";
}

function cloneDeliveryTarget(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  return {
    mode: normalizeTriggerMode(value.mode || "self"),
    userId: String(value.userId || "").trim().toUpperCase(),
    userName: String(value.userName || "").trim(),
  };
}

function normalizeShareTargets(value = null) {
  return UNDERPAR_BLONDIE_SHARE_PICKER.normalizeTargets(value);
}

function hasShareTargets() {
  return Array.isArray(state.slackShareTargets) && state.slackShareTargets.length > 0;
}

function closeSharePicker() {
  blondieSharePickerController.close();
}

function openSharePicker(anchorButton, onSelect) {
  blondieSharePickerController.open({
    anchorButton,
    onSelect,
    selfUserId: state.slackUserId,
    targets: state.slackShareTargets,
  });
}

function getWorkspaceEnvironmentRegistry() {
  return globalThis.UnderParEnvironment || null;
}

function resolveWorkspaceAdobePassEnvironment(value = null) {
  const registry = getWorkspaceEnvironmentRegistry();
  if (registry?.getEnvironment) {
    return registry.getEnvironment(value || DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  }
  if (value && typeof value === "object") {
    return { ...value };
  }
  return { ...DEFAULT_ADOBEPASS_ENVIRONMENT };
}

function getEnvironmentKey(environment = null) {
  return String(resolveWorkspaceAdobePassEnvironment(environment)?.key || "").trim();
}

function renderWorkspaceEnvironmentBadge() {
  if (!els.pageEnvBadge || !els.pageEnvBadgeValue) {
    return;
  }
  const environment = resolveWorkspaceAdobePassEnvironment(state.adobePassEnvironment);
  const label = String(environment?.label || "").trim() || "Production";
  els.pageEnvBadgeValue.textContent = label;
  const title = [label, String(environment?.esmBase || environment?.mgmtBase || "").trim()].filter(Boolean).join("\n");
  els.pageEnvBadge.title = title;
  els.pageEnvBadge.setAttribute("aria-label", title || label);
}

function setStatus(message = "", type = "") {
  if (!els.status) {
    return;
  }
  els.status.textContent = String(message || "");
  els.status.className = `workspace-status${type ? ` ${type}` : ""}`;
}

function esmPartsToUtcMs(row) {
  const year = Number(row?.year ?? 1970);
  const month = Number(row?.month ?? 1);
  const day = Number(row?.day ?? 1);
  const hour = Number(row?.hour ?? 0);
  const minute = Number(row?.minute ?? 0);
  return (
    Date.UTC(
      Number.isFinite(year) ? year : 1970,
      Number.isFinite(month) ? month - 1 : 0,
      Number.isFinite(day) ? day : 1,
      Number.isFinite(hour) ? hour : 0,
      Number.isFinite(minute) ? minute : 0
    ) -
    ESM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000
  );
}

function buildEsmDateLabel(row) {
  if (!row || typeof row !== "object") {
    return "—";
  }
  const hasDateParts = ["year", "month", "day", "hour", "minute"].some((key) => row[key] != null);
  if (!hasDateParts) {
    return "—";
  }
  const date = new Date(esmPartsToUtcMs(row));
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("en-US", {
    timeZone: CLIENT_TIMEZONE,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function formatPercent(value) {
  return BLONDIE_TIME_LOGIC.formatPercent(value);
}

function formatLatency(value) {
  return BLONDIE_TIME_LOGIC.formatLatency(value);
}

function formatInteger(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Math.round(numeric).toLocaleString("en-US") : "0";
}

function formatTimestamp(value = 0) {
  const timestamp = Number(value || 0);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return "—";
  }
  return new Date(timestamp).toLocaleString("en-US", {
    timeZone: CLIENT_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function formatLegacyEsmWindowHeading(value = 0) {
  const timestamp = Number(value || 0);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return "Live interval";
  }
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BLONDIE_TIME_LOGIC?.LEGACY_ESM_QUERY_TIMEZONE || "America/Los_Angeles",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(timestamp));
}

function formatLegacyEsmWindowLabel(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return "—";
  }
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) {
    return text;
  }
  const [, year, month, day, hourValue, minute] = match;
  const hour24 = Number(hourValue);
  if (!Number.isFinite(hour24)) {
    return text;
  }
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${month}/${day}/${year}, ${hour12}:${minute} ${meridiem} PT`;
}

function getSessionWindow() {
  const firstLapPayload = state.sessionHistory.find((lap) => String(lap?.exportPayload?.requestWindowStart || "").trim())?.exportPayload || null;
  const lastLapPayload =
    [...state.sessionHistory].reverse().find((lap) => String(lap?.exportPayload?.requestWindowEnd || "").trim())?.exportPayload || null;
  const start = firstNonEmptyString([
    firstLapPayload?.requestWindowStart,
    BLONDIE_TIME_LOGIC?.formatLegacyEsmQueryTimestamp?.(state.sessionStartedAt || 0, BLONDIE_TIME_LOGIC.LEGACY_ESM_QUERY_TIMEZONE),
  ]);
  const end = firstNonEmptyString([
    state.sessionStoppedAt > 0
      ? BLONDIE_TIME_LOGIC?.formatLegacyEsmQueryTimestamp?.(state.sessionStoppedAt, BLONDIE_TIME_LOGIC.LEGACY_ESM_QUERY_TIMEZONE)
      : "",
    lastLapPayload?.requestWindowEnd,
  ]);
  return {
    start,
    end,
    startLabel: formatLegacyEsmWindowLabel(start),
    endLabel: formatLegacyEsmWindowLabel(end),
  };
}

function resolveCurrentLapRequestWindow(options = {}) {
  const intervalMinutes = Math.max(
    0,
    Number(options.intervalMinutes || state.lastStartOptions?.intervalMinutes || state.runtimeState?.intervalMinutes || 0)
  );
  const requestedAt = Math.max(0, Number(options.requestedAt || Date.now())) || Date.now();
  const requestWindow =
    intervalMinutes > 0 && BLONDIE_TIME_LOGIC?.computeLegacyEsmIntervalWindow
      ? BLONDIE_TIME_LOGIC.computeLegacyEsmIntervalWindow(intervalMinutes, {
          nowMs: requestedAt,
        })
      : null;
  return {
    intervalMinutes,
    requestedAt,
    requestWindow,
    headingLabel: formatLegacyEsmWindowHeading(requestWindow?.endMs || requestedAt),
  };
}

function normalizeRuntimeState(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  return {
    workspace: String(value?.workspace || "").trim().toLowerCase(),
    runId: String(value?.runId || "").trim(),
    running: value?.running === true,
    intervalMinutes: Math.max(0, Number(value?.intervalMinutes || 0)),
    intervalMs: Math.max(0, Number(value?.intervalMs || 0)),
    nextFireAt: Math.max(0, Number(value?.nextFireAt || 0)),
    startedAt: Math.max(0, Number(value?.startedAt || 0)),
    targetWindowId: Math.max(0, Number(value?.targetWindowId || 0)),
    targetTabId: Math.max(0, Number(value?.targetTabId || 0)),
    workspaceContextKey: String(value?.workspaceContextKey || "").trim(),
    programmerId: String(value?.programmerId || "").trim(),
    programmerName: String(value?.programmerName || "").trim(),
    triggerMode: String(value?.triggerMode || "self").trim().toLowerCase() === "teammate" ? "teammate" : "self",
    deliveryTarget:
      value?.deliveryTarget && typeof value.deliveryTarget === "object"
        ? {
            mode: String(value.deliveryTarget.mode || "").trim().toLowerCase() === "teammate" ? "teammate" : "self",
            userId: String(value.deliveryTarget.userId || "").trim().toUpperCase(),
            userName: String(value.deliveryTarget.userName || "").trim(),
          }
        : null,
    noteText: String(value?.noteText || ""),
    lastError: String(value?.lastError || "").trim(),
    lastStopReason: String(value?.lastStopReason || "").trim(),
    lastLapAt: Math.max(0, Number(value?.lastLapAt || 0)),
    lastDeliveredCount: Math.max(0, Number(value?.lastDeliveredCount || 0)),
    lapCount: Math.max(0, Number(value?.lapCount || 0)),
  };
}

function isRuntimeActiveHere(runtimeState = state.runtimeState) {
  const normalized = normalizeRuntimeState(runtimeState);
  if (!normalized?.running || normalized.workspace !== "bt") {
    return false;
  }
  const runtimeTabId = Number(normalized.targetTabId || 0);
  if (runtimeTabId > 0 && Number(state.tabId || 0) > 0) {
    return runtimeTabId === Number(state.tabId || 0);
  }
  const runtimeWindowId = Number(normalized.targetWindowId || 0);
  if (runtimeWindowId > 0 && Number(state.windowId || 0) > 0 && runtimeWindowId !== Number(state.windowId || 0)) {
    return false;
  }
  return true;
}

function getRemainingRuntimeMs(runtimeState = state.runtimeState) {
  const normalized = normalizeRuntimeState(runtimeState);
  if (!isRuntimeActiveHere(normalized)) {
    return 0;
  }
  return Math.max(0, Number(normalized.nextFireAt || 0) - Date.now());
}

function getEstablishedLapCount(runtimeState = state.runtimeState) {
  const normalized = normalizeRuntimeState(runtimeState);
  return Math.max(Math.max(0, Number(normalized?.lapCount || 0)), state.sessionHistory.length);
}

function shouldProtectActiveSessionOnClose(runtimeState = state.runtimeState) {
  return isRuntimeActiveHere(runtimeState) && getEstablishedLapCount(runtimeState) >= BLONDIE_TIME_CLOSE_GUARD_MIN_LAPS;
}

function buildCloseGuardSnapshot() {
  const runtimeState = normalizeRuntimeState(state.runtimeState);
  const cards = getOrderedCards().map((cardState) => buildCardPayload(cardState));
  const sessionWindow = getSessionWindow();
  const lapCount = getEstablishedLapCount(runtimeState);
  const activeRuntime = isRuntimeActiveHere(runtimeState);
  const startedAt = Math.max(0, Number(state.sessionStartedAt || runtimeState?.startedAt || 0));
  if (!activeRuntime && !lapCount && !startedAt && cards.length === 0) {
    return null;
  }
  return {
    schemaVersion: 1,
    workspace: "bt",
    capturedAt: Date.now(),
    windowId: Math.max(0, Number(state.windowId || runtimeState?.targetWindowId || 0)),
    tabId: Math.max(0, Number(state.tabId || runtimeState?.targetTabId || 0)),
    runId: String(runtimeState?.runId || "").trim(),
    workspaceContextKey: String(state.workspaceContextKey || runtimeState?.workspaceContextKey || "").trim(),
    programmerId: String(state.programmerId || runtimeState?.programmerId || "").trim(),
    programmerName: String(state.programmerName || runtimeState?.programmerName || "").trim(),
    activeRuntime,
    lapCount,
    sessionStartedAt: startedAt,
    sessionStoppedAt: Math.max(0, Number(state.sessionStoppedAt || 0)),
    sessionWindow: {
      start: String(sessionWindow.start || "").trim(),
      end: String(sessionWindow.end || "").trim(),
    },
    cards,
  };
}

async function writeCloseGuardSnapshot(snapshot = null) {
  try {
    if (snapshot && typeof snapshot === "object") {
      await chrome.storage.local.set({
        [BLONDIE_TIME_CLOSE_GUARD_STORAGE_KEY]: snapshot,
      });
      return;
    }
    await chrome.storage.local.remove(BLONDIE_TIME_CLOSE_GUARD_STORAGE_KEY);
  } catch {
    // Ignore close-guard persistence failures.
  }
}

function scheduleCloseGuardSnapshotPersist(options = {}) {
  if (state.closeGuardPersistTimerId) {
    window.clearTimeout(state.closeGuardPersistTimerId);
    state.closeGuardPersistTimerId = 0;
  }
  const persist = () => {
    state.closeGuardPersistTimerId = 0;
    void writeCloseGuardSnapshot(buildCloseGuardSnapshot());
  };
  if (options?.immediate === true) {
    persist();
    return;
  }
  state.closeGuardPersistTimerId = window.setTimeout(persist, 0);
}

function handleBeforeUnload(event) {
  if (!shouldProtectActiveSessionOnClose()) {
    return undefined;
  }
  scheduleCloseGuardSnapshotPersist({ immediate: true });
  event.preventDefault();
  event.returnValue = BLONDIE_TIME_CLOSE_GUARD_PROMPT;
  return BLONDIE_TIME_CLOSE_GUARD_PROMPT;
}

function formatCountdown(ms = 0) {
  const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTimerPendingMode() {
  return normalizeTriggerMode(state.timerPendingMode || state.lastStartOptions?.triggerMode || "self");
}

function getTimerPickerButtons() {
  return Array.from(els.timerPicker?.querySelectorAll(".workspace-blondie-time-chip") || []).filter(
    (button) => button instanceof HTMLButtonElement
  );
}

function syncTimerChipSelection() {
  const runtimeInterval = Number(state.runtimeState?.intervalMinutes || 0);
  const selectedMinutes = isRuntimeActiveHere()
    ? runtimeInterval
    : Number(state.lastStartOptions?.intervalMinutes || BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES[0]);
  getTimerPickerButtons().forEach((button) => {
    button.dataset.selected = Number(button.dataset.minutes || 0) === selectedMinutes ? "true" : "false";
  });
}

function stopTimerCountdownAnimation() {
  if (state.timerCountdownRafId) {
    window.cancelAnimationFrame(state.timerCountdownRafId);
    state.timerCountdownRafId = 0;
  }
  state.timerCountdownSecond = -1;
  if (els.timerButton) {
    els.timerButton.style.setProperty("--blondie-time-reveal-turn", "0turn");
  }
}

function getTimerStartDisabledReason() {
  if (getOrderedCards().length === 0) {
    return "Launch Blondie Time from the ESM Workspace with at least one report card.";
  }
  return "";
}

function getMonitoringStartBlockedReason(triggerMode = getTimerPendingMode()) {
  if (state.lapRunning) {
    return "Blondie Time is already evaluating a BT lap.";
  }
  if (state.batchRunning) {
    return "Wait for the current BT refresh to finish before starting Blondie Time.";
  }
  if (!state.controllerOnline) {
    return "Open the UnderPAR side panel to start Blondie Time.";
  }
  if (!state.slackReady) {
    return BLONDIE_BUTTON_INACTIVE_MESSAGE;
  }
  if (getOrderedCards().length === 0) {
    return "Launch Blondie Time from the ESM Workspace with at least one report card.";
  }
  if (normalizeTriggerMode(triggerMode) === "teammate" && !hasShareTargets()) {
    return BLONDIE_BUTTON_SHARE_TARGETS_EMPTY_MESSAGE;
  }
  return "";
}

function getTimerButtonTitle() {
  const runtimeState = normalizeRuntimeState(state.runtimeState);
  const runtimeActive = isRuntimeActiveHere(runtimeState);
  if (runtimeActive) {
    const countdown = formatCountdown(getRemainingRuntimeMs(runtimeState));
    const cadenceLabel = `${runtimeState.intervalMinutes} minute${runtimeState.intervalMinutes === 1 ? "" : "s"}`;
    const destinationLabel =
      runtimeState.triggerMode === "teammate"
        ? firstNonEmptyString([runtimeState.deliveryTarget?.userName, runtimeState.deliveryTarget?.userId, "teammate"])
        : "your Slack DM";
    return state.lapRunning
      ? `Blondie Time is firing the ${cadenceLabel} lap to ${destinationLabel}.`
      : `Blondie Time repeats every ${cadenceLabel} to ${destinationLabel}. ${countdown} until the next lap.`;
  }
  if (state.timerPickerOpen) {
    return getTimerPendingMode() === "teammate"
      ? "Choose an interval for pass-transition delivery. Escape cancels."
      : "Choose an interval for your Slack DM. Escape cancels.";
  }
  if (String(state.timerLocalWarning || "").trim()) {
    return String(state.timerLocalWarning || "").trim();
  }
  const disabledReason = getTimerStartDisabledReason();
  if (disabledReason) {
    return disabledReason;
  }
  if (!state.slackReady) {
    return BLONDIE_BUTTON_INACTIVE_MESSAGE;
  }
  return "Click opens the interval picker for your Slack DM. Shift-click opens it for pass-transition delivery.";
}

function getTimerButtonVisualState() {
  if (isRuntimeActiveHere()) {
    return state.lapRunning ? "slacktivated" : "active";
  }
  if (state.timerPickerOpen) {
    return "settime";
  }
  if (String(state.timerLocalWarning || "").trim()) {
    return "warn";
  }
  return state.slackReady ? "slacktivated" : "notslacktivated";
}

function removeTimerPickerDismissHandlers() {
  if (typeof state.timerOutsidePointerHandler === "function") {
    document.removeEventListener("pointerdown", state.timerOutsidePointerHandler, true);
  }
  if (typeof state.timerOutsideKeyHandler === "function") {
    document.removeEventListener("keydown", state.timerOutsideKeyHandler, true);
  }
  state.timerOutsidePointerHandler = null;
  state.timerOutsideKeyHandler = null;
}

function closeTimerPicker(options = {}) {
  if (!state.timerPickerOpen) {
    return;
  }
  state.timerPickerOpen = false;
  removeTimerPickerDismissHandlers();
  renderTimerControl();
  renderMonitorHeader();
  if (options?.restoreFocus !== false && els.timerButton instanceof HTMLButtonElement) {
    els.timerButton.focus({ preventScroll: true });
  }
}

function focusTimerPickerButton(minutes = 0) {
  const buttons = getTimerPickerButtons();
  if (buttons.length === 0) {
    return;
  }
  const preferred = buttons.find((button) => Number(button.dataset.minutes || 0) === Number(minutes || 0));
  (preferred || buttons[0]).focus({ preventScroll: true });
}

function openTimerPicker(mode = "self", options = {}) {
  if (!(els.timerButton instanceof HTMLButtonElement) || isRuntimeActiveHere()) {
    return;
  }
  closeSharePicker();
  state.timerPendingMode = normalizeTriggerMode(mode);
  state.timerLocalWarning = "";
  state.timerPickerOpen = true;
  removeTimerPickerDismissHandlers();
  state.timerOutsidePointerHandler = (event) => {
    if (els.timerPicker?.contains(event.target) || els.timerButton?.contains(event.target)) {
      return;
    }
    closeTimerPicker({ restoreFocus: false });
  };
  state.timerOutsideKeyHandler = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeTimerPicker();
    }
  };
  document.addEventListener("pointerdown", state.timerOutsidePointerHandler, true);
  document.addEventListener("keydown", state.timerOutsideKeyHandler, true);
  renderTimerControl();
  renderMonitorHeader();
  if (options?.focus !== false) {
    window.requestAnimationFrame(() => {
      focusTimerPickerButton(state.lastStartOptions?.intervalMinutes || BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES[0]);
    });
  }
}

function handleTimerPickerKeydown(event) {
  if (!state.timerPickerOpen) {
    return;
  }
  const buttons = getTimerPickerButtons();
  if (buttons.length === 0) {
    return;
  }
  const activeIndex = buttons.findIndex((button) => button === document.activeElement);
  if (event.key === "Escape") {
    event.preventDefault();
    closeTimerPicker();
    return;
  }
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    return;
  }
  event.preventDefault();
  const lastIndex = buttons.length - 1;
  let nextIndex = activeIndex >= 0 ? activeIndex : 0;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = nextIndex <= 0 ? lastIndex : nextIndex - 1;
  } else {
    nextIndex = nextIndex >= lastIndex ? 0 : nextIndex + 1;
  }
  buttons[nextIndex]?.focus({ preventScroll: true });
}

function renderTimerControl() {
  if (!(els.timerButton instanceof HTMLButtonElement)) {
    return;
  }
  const runtimeActive = isRuntimeActiveHere();
  const title = getTimerButtonTitle();
  const visualState = getTimerButtonVisualState();
  els.timerButton.dataset.blondieTimeState = visualState;
  els.timerButton.dataset.blondieTimeMode = getTimerPendingMode();
  els.timerButton.disabled = runtimeActive || Boolean(getTimerStartDisabledReason());
  els.timerButton.title = title;
  els.timerButton.setAttribute("aria-label", title);
  els.timerButton.setAttribute("aria-expanded", state.timerPickerOpen ? "true" : "false");
  if (els.timerPicker) {
    els.timerPicker.hidden = !state.timerPickerOpen;
  }
  if (els.timerStopButton) {
    els.timerStopButton.hidden = true;
    els.timerStopButton.disabled = true;
  }
  syncTimerChipSelection();
  if (!runtimeActive) {
    stopTimerCountdownAnimation();
  }
}

function renderMonitoringStopZone() {
  if (!els.monitoringStopZone || !(els.monitoringStopButton instanceof HTMLButtonElement)) {
    return;
  }
  const runtimeActive = isRuntimeActiveHere();
  const showSessionSummary = !runtimeActive && state.sessionStoppedAt > 0 && state.exportPanelOpen;
  const showStopButton = runtimeActive && !showSessionSummary;
  const hasVisibleContent = showStopButton || showSessionSummary;
  els.monitoringStopZone.hidden = !hasVisibleContent;
  els.monitoringStopZone.dataset.state = showSessionSummary ? "summary" : "stop";
  els.monitoringStopButton.hidden = !showStopButton;
  els.monitoringStopButton.disabled = !runtimeActive || state.lapRunning;
  els.monitoringStopButton.title = "Stop Blondie Time, reveal the session summary, and enable the BT PDF and CSV export.";
}

function updateTimerCountdownFrame() {
  const runtimeState = normalizeRuntimeState(state.runtimeState);
  if (!isRuntimeActiveHere(runtimeState) || !(els.timerButton instanceof HTMLButtonElement)) {
    stopTimerCountdownAnimation();
    renderTimerControl();
    renderMonitorHeader();
    return;
  }
  const remainingMs = getRemainingRuntimeMs(runtimeState);
  const intervalMs = Math.max(1, Number(runtimeState.intervalMs || runtimeState.intervalMinutes * 60 * 1000 || 1));
  const progress = Math.max(0, Math.min(1, remainingMs / intervalMs));
  els.timerButton.style.setProperty("--blondie-time-reveal-turn", `${(1 - progress).toFixed(4)}turn`);
  const nextSecond = Math.max(0, Math.ceil(remainingMs / 1000));
  if (nextSecond !== state.timerCountdownSecond) {
    state.timerCountdownSecond = nextSecond;
    renderTimerControl();
    renderMonitorHeader();
  }
  state.timerCountdownRafId = window.requestAnimationFrame(updateTimerCountdownFrame);
}

function syncTimerCountdownAnimation() {
  if (isRuntimeActiveHere()) {
    if (!state.timerCountdownRafId) {
      state.timerCountdownRafId = window.requestAnimationFrame(updateTimerCountdownFrame);
    }
    return;
  }
  stopTimerCountdownAnimation();
}

function renderMonitorHeader() {
  const runtimeActive = isRuntimeActiveHere();
  const currentLapCount = Math.max(0, Number(state.runtimeState?.lapCount || 0));
  const countdown = formatCountdown(getRemainingRuntimeMs());
  const destinationLabel =
    String(state.lastStartOptions?.triggerMode || "").trim() === "teammate"
      ? firstNonEmptyString([state.lastStartOptions?.deliveryTarget?.userName, state.lastStartOptions?.deliveryTarget?.userId, "your teammate"])
      : "your Slack DM";
  if (els.monitorTitle) {
    els.monitorTitle.textContent = runtimeActive
      ? `BT_WS live | ${countdown} to next lap`
      : state.timerPickerOpen
        ? "BT_WS ready | choose interval"
        : state.sessionStoppedAt > 0
          ? "BT_WS stopped | monitoring session ready"
          : state.lastStartOptions
            ? "BT_WS idle | ready to start"
            : "BT_WS idle";
  }
  if (els.monitorSubtitle) {
    els.monitorSubtitle.textContent = runtimeActive
      ? `Monitoring ${getOrderedCards().length} analysis table(s) every ${Number(state.runtimeState?.intervalMinutes || 0)} minute(s) to ${destinationLabel}. Lap ${Math.max(1, currentLapCount)}.`
      : state.timerPickerOpen
        ? "Pick an interval to run the first full BT lap now. The selected interval becomes the live session cadence."
        : state.sessionStoppedAt > 0
          ? `Monitoring stopped at ${formatTimestamp(state.sessionStoppedAt)}. The Monitoring Session summary now owns the BT PDF and CSV export.`
          : state.lastStartOptions
            ? "The ESM context is loaded in BT_WS. Click or shift-click the Blondie button to choose the monitoring interval."
            : "Launch Blondie Time from the ESM Workspace to begin live threshold monitoring.";
  }
  syncTimerCountdownAnimation();
  renderMonitoringStopZone();
}

function renderThresholdInputs() {
  if (els.thresholdMinAuthn) {
    els.thresholdMinAuthn.value = String(Math.round(Number(state.thresholds.minAuthnAttempts || 0)));
  }
  if (els.thresholdAuthn) {
    els.thresholdAuthn.value = String(Number(state.thresholds.authnSuccessMin || 0));
  }
  if (els.thresholdAuthz) {
    els.thresholdAuthz.value = String(Number(state.thresholds.authzSuccessMin || 0));
  }
  if (els.thresholdLatency) {
    els.thresholdLatency.value = String(Math.round(Number(state.thresholds.latencyMaxMs || 0)));
  }
}

function collectRowColumns(rows = []) {
  const output = [];
  const seen = new Set();
  const source = Array.isArray(rows) ? rows : [];
  source.forEach((row) => {
    if (!row || typeof row !== "object") {
      return;
    }
    Object.keys(row).forEach((key) => {
      if (!key || key.startsWith("__bt") || seen.has(key)) {
        return;
      }
      seen.add(key);
      output.push(key);
    });
  });
  return output;
}

function buildCardDisplayColumns(cardState) {
  const rows = Array.isArray(cardState?.rows) ? cardState.rows : [];
  const requestedColumns = Array.isArray(cardState?.columns) ? cardState.columns.map((value) => String(value || "").trim()).filter(Boolean) : [];
  const columnOrder = [...requestedColumns, ...collectRowColumns(rows)];
  const seen = new Set();
  return columnOrder.filter((column) => {
    const normalized = String(column || "").trim();
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return !["year", "month", "day", "hour", "minute"].includes(normalized);
  });
}

function getThresholdHitMarkup(hits = []) {
  const items = Array.isArray(hits) ? hits : [];
  if (items.length === 0) {
    return `<span class="bt-chip">No hits</span>`;
  }
  return `<div class="bt-table-hit-list">${items
    .map((hit) => {
      const modifier = hit?.key === "latency" ? " bt-hit-pill--latency" : "";
      return `<span class="bt-hit-pill${modifier}">${escapeHtml(hit?.label || "Hit")} ${escapeHtml(hit?.displayValue || "")}</span>`;
    })
    .join("")}</div>`;
}

function sortOffendingRows(rows = []) {
  return [...(Array.isArray(rows) ? rows : [])].sort((left, right) => {
    const leftHitCount = Array.isArray(left?.__btThresholdHits) ? left.__btThresholdHits.length : 0;
    const rightHitCount = Array.isArray(right?.__btThresholdHits) ? right.__btThresholdHits.length : 0;
    if (rightHitCount !== leftHitCount) {
      return rightHitCount - leftHitCount;
    }
    const leftLatency = Number(left?.__btMetrics?.avgLatencyMs || 0);
    const rightLatency = Number(right?.__btMetrics?.avgLatencyMs || 0);
    if (rightLatency !== leftLatency) {
      return rightLatency - leftLatency;
    }
    return buildEsmDateLabel(right).localeCompare(buildEsmDateLabel(left));
  });
}

function analyzeCard(cardState) {
  const analysis = BLONDIE_TIME_LOGIC.analyzeRows(cardState?.rows || [], state.thresholds);
  cardState.analysis = analysis;
  cardState.displayColumns = buildCardDisplayColumns(cardState);
  cardState.offendingRows = sortOffendingRows(analysis.offendingRows || []);
  return analysis;
}

function buildCardSummary(cardState) {
  const analysis = cardState?.analysis || analyzeCard(cardState);
  const summary = analysis.summary || {};
  return {
    title: firstNonEmptyString([cardState.displayNodeLabel, cardState.endpointUrl, cardState.cardId, "Analysis Table"]),
    subtitle: `Eligible rows ${formatInteger(summary.eligibleRows)} | Offending rows ${formatInteger(summary.offendingRows)} | Filtered low-volume rows ${formatInteger(summary.filteredLowVolumeCount)}`,
    lines: BLONDIE_TIME_LOGIC.toSummaryLines(analysis),
  };
}

function formatSnapshotNumber(value, digits = 2) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(digits) : "—";
}

function buildCurrentStateCards(summary = {}) {
  const snapshot =
    summary?.liveSnapshot && typeof summary.liveSnapshot === "object"
      ? summary.liveSnapshot
      : summary?.snapshot && typeof summary.snapshot === "object"
        ? summary.snapshot
        : {};
  const items = [
    {
      label: "AuthN Attempts",
      low: snapshot.authnAttempts?.low == null ? "—" : formatInteger(snapshot.authnAttempts.low),
      average: snapshot.authnAttempts?.average == null ? "—" : formatSnapshotNumber(snapshot.authnAttempts.average),
      high: snapshot.authnAttempts?.high == null ? "—" : formatInteger(snapshot.authnAttempts.high),
    },
    {
      label: "AuthN Success",
      low: formatPercent(snapshot.authnSuccessPercent?.low),
      average: formatPercent(snapshot.authnSuccessPercent?.average),
      high: formatPercent(snapshot.authnSuccessPercent?.high),
    },
    {
      label: "AuthZ Success",
      low: formatPercent(snapshot.authzSuccessPercent?.low),
      average: formatPercent(snapshot.authzSuccessPercent?.average),
      high: formatPercent(snapshot.authzSuccessPercent?.high),
    },
    {
      label: "Avg AuthZ Latency",
      low: formatLatency(snapshot.avgLatencyMs?.low),
      average: formatLatency(snapshot.avgLatencyMs?.average),
      high: formatLatency(snapshot.avgLatencyMs?.high),
    },
  ];
  return items
    .map(
      (item) => `
        <article class="bt-current-state-card">
          <p class="bt-current-state-label">${escapeHtml(item.label)}</p>
          <div class="bt-current-state-values">
            <span><strong>Low</strong> ${escapeHtml(item.low)}</span>
            <span><strong>Avg</strong> ${escapeHtml(item.average)}</span>
            <span><strong>High</strong> ${escapeHtml(item.high)}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function buildOverviewCards(analysis = null) {
  const summary = analysis?.summary || {};
  const items = [
    {
      label: "Raw Rows",
      value: formatInteger(analysis?.totalRows || 0),
      note: "Rows returned by the current mixed ESM query.",
    },
    {
      label: "Eligible",
      value: formatInteger(summary.eligibleRows || 0),
      note: "Rows that passed the minimum AuthN attempt gate.",
    },
    {
      label: "Threshold Hits",
      value: formatInteger(summary.offendingRows || 0),
      note: "Rows currently violating at least one BT rule.",
    },
    {
      label: "Clear Rows",
      value: formatInteger(summary.passedWithoutHits || 0),
      note: "Eligible rows that are currently within threshold.",
    },
  ];
  return items
    .map(
      (item) => `
        <article class="bt-analysis-metric-card">
          <p class="bt-analysis-metric-label">${escapeHtml(item.label)}</p>
          <p class="bt-analysis-metric-value">${escapeHtml(item.value)}</p>
          <p class="bt-analysis-metric-note">${escapeHtml(item.note)}</p>
        </article>
      `
    )
    .join("");
}

function buildThresholdStatusCards(analysis = null) {
  const summary = analysis?.summary || {};
  const snapshot =
    summary?.liveSnapshot && typeof summary.liveSnapshot === "object"
      ? summary.liveSnapshot
      : summary?.snapshot || {};
  const offendersByMetric = analysis?.offendersByMetric || {};
  const statuses = [
    {
      label: "Volume Gate",
      tone: Number(summary.filteredLowVolumeCount || 0) > 0 ? "neutral" : "ok",
      limit: `AuthN attempts >= ${formatInteger(state.thresholds.minAuthnAttempts)}`,
      count: `Filtered ${formatInteger(summary.filteredLowVolumeCount || 0)} | Eligible ${formatInteger(summary.eligibleRows || 0)}`,
      note: `Current low / avg / high ${snapshot.authnAttempts?.low == null ? "—" : formatInteger(snapshot.authnAttempts.low)} / ${
        snapshot.authnAttempts?.average == null ? "—" : formatSnapshotNumber(snapshot.authnAttempts.average)
      } / ${snapshot.authnAttempts?.high == null ? "—" : formatInteger(snapshot.authnAttempts.high)}`,
    },
    {
      label: "AuthN Success",
      tone: Number(offendersByMetric.authn || 0) > 0 ? "alert" : "ok",
      limit: `Floor ${Number(state.thresholds.authnSuccessMin || 0)}%`,
      count: `Triggered ${formatInteger(offendersByMetric.authn || 0)} | Current avg ${formatPercent(
        summary.liveAverageAuthnSuccessPercent ?? summary.averageAuthnSuccessPercent
      )}`,
      note: `Current low / avg / high ${formatPercent(snapshot.authnSuccessPercent?.low)} / ${formatPercent(
        snapshot.authnSuccessPercent?.average
      )} / ${formatPercent(snapshot.authnSuccessPercent?.high)}`,
    },
    {
      label: "AuthZ Success",
      tone: Number(offendersByMetric.authz || 0) > 0 ? "alert" : "ok",
      limit: `Floor ${Number(state.thresholds.authzSuccessMin || 0)}%`,
      count: `Triggered ${formatInteger(offendersByMetric.authz || 0)} | Current avg ${formatPercent(
        summary.liveAverageAuthzSuccessPercent ?? summary.averageAuthzSuccessPercent
      )}`,
      note: `Current low / avg / high ${formatPercent(snapshot.authzSuccessPercent?.low)} / ${formatPercent(
        snapshot.authzSuccessPercent?.average
      )} / ${formatPercent(snapshot.authzSuccessPercent?.high)}`,
    },
    {
      label: "Avg AuthZ Latency",
      tone: Number(offendersByMetric.latency || 0) > 0 ? "alert" : "ok",
      limit: `Ceiling ${formatInteger(state.thresholds.latencyMaxMs)} ms`,
      count: `Triggered ${formatInteger(offendersByMetric.latency || 0)} | Current avg ${formatLatency(
        summary.liveAverageLatencyMs ?? summary.averageLatencyMs
      )}`,
      note: `Current low / avg / high ${formatLatency(snapshot.avgLatencyMs?.low)} / ${formatLatency(
        snapshot.avgLatencyMs?.average
      )} / ${formatLatency(snapshot.avgLatencyMs?.high)}`,
    },
  ];
  return statuses
    .map(
      (item) => `
        <article class="bt-threshold-status-card bt-threshold-status-card--${escapeHtml(item.tone)}">
          <div class="bt-threshold-status-head">
            <p class="bt-threshold-status-label">${escapeHtml(item.label)}</p>
            <span class="bt-chip${item.tone === "alert" ? " bt-chip--alert" : ""}">${escapeHtml(item.tone === "alert" ? "Investigate" : item.tone === "neutral" ? "Observed" : "Healthy")}</span>
          </div>
          <p class="bt-threshold-status-limit">${escapeHtml(item.limit)}</p>
          <p class="bt-threshold-status-count">${escapeHtml(item.count)}</p>
          <p class="bt-threshold-status-note">${escapeHtml(item.note)}</p>
        </article>
      `
    )
    .join("");
}

function buildCardPayload(cardState) {
  return {
    cardId: String(cardState?.cardId || "").trim(),
    originCardKey: String(cardState?.originCardKey || "").trim(),
    endpointUrl: String(cardState?.endpointUrl || "").trim(),
    requestUrl: String(cardState?.requestUrl || "").trim(),
    zoomKey: String(cardState?.zoomKey || "").trim(),
    columns: Array.isArray(cardState?.columns) ? cardState.columns.slice() : [],
    displayNodeLabel: String(cardState?.displayNodeLabel || "").trim(),
    preserveQueryContext: cardState?.preserveQueryContext === true,
    presetLocalFilterBootstrapPending: cardState?.presetLocalFilterBootstrapPending === true,
    seedEndpointUrl: String(cardState?.seedEndpointUrl || "").trim(),
    seedRequestUrl: String(cardState?.seedRequestUrl || "").trim(),
    seedLocalColumnFilters: cloneJson(cardState?.seedLocalColumnFilters, {}),
    seedLocalColumnExclusions: cloneJson(cardState?.seedLocalColumnExclusions, {}),
    seedPresetLocalFilterBootstrapPending: cardState?.seedPresetLocalFilterBootstrapPending === true,
    localColumnFilters: cloneJson(cardState?.localColumnFilters, {}),
    localColumnExclusions: cloneJson(cardState?.localColumnExclusions, {}),
  };
}

function stripPinnedBtTimeWindowParams(urlValue = "") {
  if (BLONDIE_TIME_LOGIC?.stripPinnedEsmTimeWindowParams) {
    return BLONDIE_TIME_LOGIC.stripPinnedEsmTimeWindowParams(urlValue);
  }
  return String(urlValue || "").trim();
}

function normalizeCardPayload(input = null) {
  const source = input && typeof input === "object" ? input : null;
  if (!source) {
    return null;
  }
  const normalizedEndpointUrl = stripPinnedBtTimeWindowParams(source.endpointUrl || "");
  const normalizedRequestUrl = stripPinnedBtTimeWindowParams(source.requestUrl || normalizedEndpointUrl || "");
  const normalizedSeedEndpointUrl = stripPinnedBtTimeWindowParams(source.seedEndpointUrl || "");
  const normalizedSeedRequestUrl = stripPinnedBtTimeWindowParams(source.seedRequestUrl || "");
  const cardId = String(source.cardId || source.originCardKey || normalizedEndpointUrl || normalizedRequestUrl || "").trim();
  if (!cardId) {
    return null;
  }
  return {
    cardId,
    originCardKey: String(source.originCardKey || "").trim(),
    endpointUrl: normalizedEndpointUrl,
    requestUrl: normalizedRequestUrl || normalizedEndpointUrl,
    zoomKey: String(source.zoomKey || "").trim(),
    columns: Array.isArray(source.columns) ? source.columns.map((value) => String(value || "").trim()).filter(Boolean) : [],
    displayNodeLabel: String(source.displayNodeLabel || "").trim(),
    preserveQueryContext: source.preserveQueryContext === true,
    presetLocalFilterBootstrapPending: source.presetLocalFilterBootstrapPending === true,
    seedEndpointUrl: normalizedSeedEndpointUrl,
    seedRequestUrl: normalizedSeedRequestUrl,
    seedLocalColumnFilters: cloneJson(source.seedLocalColumnFilters, {}),
    seedLocalColumnExclusions: cloneJson(source.seedLocalColumnExclusions, {}),
    seedPresetLocalFilterBootstrapPending: source.seedPresetLocalFilterBootstrapPending === true,
    localColumnFilters: cloneJson(source.localColumnFilters, {}),
    localColumnExclusions: cloneJson(source.localColumnExclusions, {}),
    rows: Array.isArray(source.rows) ? source.rows.map((row) => ({ ...(row && typeof row === "object" ? row : {}) })) : [],
    lastModified: String(source.lastModified || "").trim(),
    running: false,
    analysis: null,
    displayColumns: [],
    offendingRows: [],
  };
}

function ensureCard(cardPayload = null) {
  const normalized = normalizeCardPayload(cardPayload);
  if (!normalized) {
    return null;
  }
  const existing = state.cardsById.get(normalized.cardId);
  if (existing) {
    Object.assign(existing, normalized);
    return existing;
  }
  state.cardsById.set(normalized.cardId, normalized);
  return normalized;
}

function getOrderedCards() {
  return Array.from(state.cardsById.values()).sort((left, right) =>
    firstNonEmptyString([left.displayNodeLabel, left.endpointUrl, left.cardId]).localeCompare(
      firstNonEmptyString([right.displayNodeLabel, right.endpointUrl, right.cardId])
    )
  );
}

function renderCard(cardState) {
  analyzeCard(cardState);
  const summary = buildCardSummary(cardState);
  const sendToEsmTitle = `Send ${summary.title} to ESM Workspace`;
  const footerLines = summary.lines
    .map((line) => `<div class="bt-footer-line">${escapeHtml(line)}</div>`)
    .join("");
  const overviewMarkup = buildOverviewCards(cardState.analysis);
  const currentStateMarkup = buildCurrentStateCards(cardState.analysis?.summary || {});
  const thresholdStatusMarkup = buildThresholdStatusCards(cardState.analysis);
  const hitCount = Math.max(0, Number(cardState.analysis?.summary?.offendingRows || 0));
  const analysisStatusMarkup =
    hitCount > 0
      ? `<p class="bt-card-status bt-card-status--alert">Investigation is needed. ${formatInteger(
          hitCount
        )} row(s) in the current interval are violating one or more BT thresholds. The attached Blondie CSV contains the raw ESM interval snapshot for drilldown.</p>`
      : `<p class="bt-card-status">No active threshold violations in the current eligible dataset. BT_WS is showing translated analysis only while the raw interval dataset remains available through the Blondie CSV attachment.</p>`;
  const article = document.createElement("article");
  article.className = "bt-analysis-card";
  article.dataset.cardId = String(cardState.cardId || "");
  article.innerHTML = `
    <div class="bt-analysis-card-head">
      <div>
        <h2 class="bt-analysis-card-title">
          <button
            class="bt-analysis-card-title-btn bt-send-to-esm-btn"
            type="button"
            data-card-id="${escapeHtml(cardState.cardId)}"
            title="${escapeHtml(sendToEsmTitle)}"
            aria-label="${escapeHtml(sendToEsmTitle)}"
          >
            ${escapeHtml(summary.title)}
          </button>
        </h2>
        <p class="bt-analysis-card-subtitle">${escapeHtml(summary.subtitle)}</p>
      </div>
      <div class="bt-analysis-card-actions">
        <span class="bt-chip${hitCount > 0 ? " bt-chip--alert" : ""}">${hitCount > 0 ? `${formatInteger(hitCount)} hits` : "No offenders"}</span>
      </div>
    </div>
    <div class="bt-analysis-body">
      <section class="bt-analysis-overview-grid" aria-label="Analysis overview">
        ${overviewMarkup}
      </section>
      ${analysisStatusMarkup}
      <section class="bt-analysis-section" aria-label="Current state of now">
        <div class="bt-analysis-section-head">
          <h3 class="bt-analysis-section-title">Current State of Now</h3>
          <p class="bt-analysis-section-copy">Current low, average, and high values for the BT monitored metrics in this interval.</p>
        </div>
        <div class="bt-current-state-grid">
          ${currentStateMarkup}
        </div>
      </section>
      <section class="bt-analysis-section" aria-label="Threshold results">
        <div class="bt-analysis-section-head">
          <h3 class="bt-analysis-section-title">Threshold Results</h3>
          <p class="bt-analysis-section-copy">Fully translated threshold outcomes for the current interval, without the raw ESM row table.</p>
        </div>
        <div class="bt-threshold-status-grid">
          ${thresholdStatusMarkup}
        </div>
      </section>
      <div class="bt-analysis-footer">
        <div class="bt-footer-grid">
          <div class="bt-footer-lines">${footerLines}</div>
          <div class="bt-analysis-card-actions">
            <span class="bt-chip">Last modified ${escapeHtml(cardState.lastModified || "real-time")}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return article;
}

function renderCards() {
  if (!els.cardsHost) {
    return;
  }
  const cards = getOrderedCards();
  els.cardsHost.innerHTML = "";
  if (cards.length === 0) {
    els.cardsHost.innerHTML = `
      <article class="bt-analysis-card">
        <div class="bt-analysis-card-head">
          <div>
            <h2 class="bt-analysis-card-title">No analysis tables loaded</h2>
            <p class="bt-analysis-card-subtitle">Use the ESM Workspace Blondie Time control to launch BT_WS with your current mixed-query report card context.</p>
          </div>
        </div>
      </article>
    `;
    return;
  }
  cards.forEach((cardState) => {
    els.cardsHost.appendChild(renderCard(cardState));
  });
}

function buildCurrentLapSummary() {
  const cards = getOrderedCards();
  const totals = {
    offendingRows: 0,
    eligibleRows: 0,
    authnHits: 0,
    authzHits: 0,
    latencyHits: 0,
  };
  cards.forEach((cardState) => {
    analyzeCard(cardState);
    totals.offendingRows += Math.max(0, Number(cardState.analysis?.summary?.offendingRows || 0));
    totals.eligibleRows += Math.max(0, Number(cardState.analysis?.summary?.eligibleRows || 0));
    totals.authnHits += Math.max(0, Number(cardState.analysis?.offendersByMetric?.authn || 0));
    totals.authzHits += Math.max(0, Number(cardState.analysis?.offendersByMetric?.authz || 0));
    totals.latencyHits += Math.max(0, Number(cardState.analysis?.offendersByMetric?.latency || 0));
  });
  return totals;
}

function renderSummaryStrip() {
  if (!els.summaryStrip) {
    return;
  }
  const cards = getOrderedCards();
  const current = buildCurrentLapSummary();
  const lapCount = Math.max(0, state.sessionHistory.length);
  const summaryCards = [
    {
      label: "Analysis Tables",
      value: formatInteger(cards.length),
      note: cards.length > 0 ? "Live mixed-query BT tables in this workspace." : "Waiting for ESM launch context.",
    },
    {
      label: "Eligible Rows",
      value: formatInteger(current.eligibleRows),
      note: `Rows that met the minimum AuthN attempt filter of ${formatInteger(state.thresholds.minAuthnAttempts)}.`,
    },
    {
      label: "Current Offenders",
      value: formatInteger(current.offendingRows),
      note: `${formatInteger(current.authnHits)} AuthN | ${formatInteger(current.authzHits)} AuthZ | ${formatInteger(current.latencyHits)} Latency`,
    },
    {
      label: "Session Laps",
      value: formatInteger(lapCount),
      note: lapCount > 0 ? `Monitoring started ${formatTimestamp(state.sessionStartedAt || 0)}.` : "No monitored laps captured yet.",
    },
  ];
  els.summaryStrip.innerHTML = summaryCards
    .map(
      (item) => `
        <article class="bt-summary-card">
          <p class="bt-summary-label">${escapeHtml(item.label)}</p>
          <p class="bt-summary-value">${escapeHtml(item.value)}</p>
          <p class="bt-summary-note">${escapeHtml(item.note)}</p>
        </article>
      `
    )
    .join("");
}

function updateControllerBanner() {
  const programmerLabel =
    state.programmerName && state.programmerId && state.programmerName.toLowerCase() !== state.programmerId.toLowerCase()
      ? `${state.programmerName} (${state.programmerId})`
      : state.programmerName || state.programmerId || "Selected Media Company";
  if (els.controllerState) {
    els.controllerState.textContent = `Blondie Time Workspace | ${programmerLabel}`;
  }
  if (els.filterState) {
    const requestorText = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
    const mvpdText = state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs";
    els.filterState.textContent = `REQ ${requestorText} | MVPD ${mvpdText}`;
  }
  renderWorkspaceEnvironmentBadge();
}

function buildCardExportHeaders(cardState) {
  const dynamicColumns = (Array.isArray(cardState?.displayColumns) ? cardState.displayColumns : []).filter(
    (column) => !["DATE", "Threshold Hits", "AuthN Success", "AuthZ Success", "Avg AuthZ Latency"].includes(column)
  );
  return FIXED_EXPORT_COLUMNS.concat(dynamicColumns);
}

function buildExportRowThresholdSummary(row = null) {
  const metrics = BLONDIE_TIME_LOGIC.computeRowMetrics(row);
  const authnAttempts = Number(metrics.authnAttempts || 0);
  if (authnAttempts < Number(state.thresholds.minAuthnAttempts || 0)) {
    return `Filtered low-volume (< ${formatInteger(state.thresholds.minAuthnAttempts)} AuthN attempts)`;
  }
  const hits = [];
  if (metrics.authnSuccessPercent != null && metrics.authnSuccessPercent < Number(state.thresholds.authnSuccessMin || 0)) {
    hits.push(`AuthN ${formatPercent(metrics.authnSuccessPercent)} < ${Number(state.thresholds.authnSuccessMin || 0)}%`);
  }
  if (metrics.authzSuccessPercent != null && metrics.authzSuccessPercent < Number(state.thresholds.authzSuccessMin || 0)) {
    hits.push(`AuthZ ${formatPercent(metrics.authzSuccessPercent)} < ${Number(state.thresholds.authzSuccessMin || 0)}%`);
  }
  if (metrics.avgLatencyMs != null && metrics.avgLatencyMs > Number(state.thresholds.latencyMaxMs || 0)) {
    hits.push(`Latency ${formatLatency(metrics.avgLatencyMs)} > ${formatInteger(state.thresholds.latencyMaxMs)} ms`);
  }
  return hits.join(" | ") || "No hits";
}

function buildCardExportRows(cardState) {
  const headers = buildCardExportHeaders(cardState);
  return (Array.isArray(cardState?.rows) ? cardState.rows : []).map((row) => {
    const metrics = BLONDIE_TIME_LOGIC.computeRowMetrics(row);
    const values = [
      firstNonEmptyString([cardState.displayNodeLabel, cardState.endpointUrl, cardState.cardId, "Analysis Table"]),
      buildExportRowThresholdSummary(row),
      buildEsmDateLabel(row),
      formatPercent(metrics.authnSuccessPercent),
      formatPercent(metrics.authzSuccessPercent),
      formatLatency(metrics.avgLatencyMs),
    ];
    headers.slice(FIXED_EXPORT_COLUMNS.length).forEach((column) => {
      values.push(row[column] == null ? "" : String(row[column]));
    });
    return values;
  });
}

function buildCardThresholdReportSummary(analysis = null) {
  return BLONDIE_TIME_LOGIC.toSlackSummaryLines(analysis).join("\n");
}

function buildCurrentLapExportPayload(options = {}) {
  const lapRequest = resolveCurrentLapRequestWindow(options);
  const cards = getOrderedCards();
  const unionDynamicColumns = [];
  const dynamicSeen = new Set();
  const reportItems = [];
  const rows = [];
  cards.forEach((cardState) => {
    analyzeCard(cardState);
    buildCardExportHeaders(cardState)
      .slice(FIXED_EXPORT_COLUMNS.length)
      .forEach((column) => {
        if (!dynamicSeen.has(column)) {
          dynamicSeen.add(column);
          unionDynamicColumns.push(column);
        }
      });
    reportItems.push({
      title: firstNonEmptyString([cardState.displayNodeLabel, cardState.endpointUrl, cardState.cardId, "Analysis Table"]),
      summary: buildCardThresholdReportSummary(cardState.analysis),
      requestUrl: String(cardState.requestUrl || cardState.endpointUrl || "").trim(),
      fetchedAt: lapRequest.requestedAt,
      rowCount: Math.max(0, Number(cardState.analysis?.summary?.offendingRows || 0)),
      ok: true,
    });
    buildCardExportRows(cardState).forEach((rowValues) => {
      const rowMap = new Map();
      buildCardExportHeaders(cardState).forEach((header, index) => {
        rowMap.set(header, rowValues[index] ?? "");
      });
      rows.push(FIXED_EXPORT_COLUMNS.concat(unionDynamicColumns).map((header) => rowMap.get(header) ?? ""));
    });
  });

  return {
    workspaceKey: "bt",
    workspaceLabel: "Blondie Time",
    datasetLabel: `${state.programmerName || state.programmerId || "Media Company"} ${lapRequest.headingLabel}`,
    displayNodeLabel: lapRequest.headingLabel,
    requestLabel: `BT_WS threshold scan (${getOrderedCards().length} analysis table${getOrderedCards().length === 1 ? "" : "s"})`,
    programmerId: String(state.programmerId || "").trim(),
    programmerName: String(state.programmerName || "").trim(),
    adobePassEnvironmentKey: String(getEnvironmentKey(state.adobePassEnvironment) || "").trim(),
    adobePassEnvironmentLabel: String(resolveWorkspaceAdobePassEnvironment(state.adobePassEnvironment)?.label || "").trim(),
    columns: FIXED_EXPORT_COLUMNS.concat(unionDynamicColumns),
    rows,
    rowCount: rows.length,
    reportItems,
    reportCount: reportItems.length,
    requestWindowStart: String(lapRequest.requestWindow?.start || "").trim(),
    requestWindowEnd: String(lapRequest.requestWindow?.end || "").trim(),
    responseReceivedAt: Date.now(),
    createdAt: lapRequest.requestedAt,
    messageOnly: rows.length === 0,
    skipCsvAttachment: rows.length === 0,
  };
}

function buildLapHistoryEntry(exportPayload = null) {
  const payload = exportPayload && typeof exportPayload === "object" ? exportPayload : buildCurrentLapExportPayload();
  const current = buildCurrentLapSummary();
  return {
    lapNumber: state.sessionHistory.length + 1,
    firedAt: Date.now(),
    intervalMinutes: Math.max(0, Number(state.lastStartOptions?.intervalMinutes || state.runtimeState?.intervalMinutes || 0)),
    offendingRows: current.offendingRows,
    eligibleRows: current.eligibleRows,
    authnHits: current.authnHits,
    authzHits: current.authzHits,
    latencyHits: current.latencyHits,
    exportPayload: cloneJson(payload, null),
    tableSummaries: getOrderedCards().map((cardState) => ({
      title: firstNonEmptyString([cardState.displayNodeLabel, cardState.endpointUrl, cardState.cardId]),
      summary: cloneJson(cardState.analysis?.summary, {}),
      offendingRows: Math.max(0, Number(cardState.analysis?.summary?.offendingRows || 0)),
    })),
  };
}

function appendLapHistory(entry = null) {
  const normalized = entry && typeof entry === "object" ? entry : null;
  if (!normalized) {
    return;
  }
  if (!state.sessionStartedAt) {
    state.sessionStartedAt = Number(normalized.firedAt || Date.now());
  }
  state.sessionStoppedAt = 0;
  state.sessionHistory.push(normalized);
  scheduleCloseGuardSnapshotPersist();
}

function getSessionFlattenedRows() {
  const unionDynamicColumns = [];
  const dynamicSeen = new Set();
  const rows = [];
  state.sessionHistory.forEach((lap) => {
    const payload = lap?.exportPayload;
    const payloadColumns = Array.isArray(payload?.columns) ? payload.columns.slice(FIXED_EXPORT_COLUMNS.length) : [];
    payloadColumns.forEach((column) => {
      if (!dynamicSeen.has(column)) {
        dynamicSeen.add(column);
        unionDynamicColumns.push(column);
      }
    });
  });
  const headers = ["Lap #", "Lap Fired At"].concat(FIXED_EXPORT_COLUMNS, unionDynamicColumns);
  state.sessionHistory.forEach((lap) => {
    const payload = lap?.exportPayload;
    const payloadHeaders = Array.isArray(payload?.columns) ? payload.columns : FIXED_EXPORT_COLUMNS;
    const payloadRows = Array.isArray(payload?.rows) ? payload.rows : [];
    if (payloadRows.length === 0) {
      rows.push([
        String(lap.lapNumber || ""),
        formatTimestamp(lap.firedAt || 0),
        String(payload?.displayNodeLabel || "Live interval"),
        "No offenders",
        "",
        "",
        "",
        "",
      ].concat(new Array(unionDynamicColumns.length).fill("")));
      return;
    }
    payloadRows.forEach((payloadRow) => {
      const map = new Map();
      payloadHeaders.forEach((header, index) => {
        map.set(header, payloadRow[index] ?? "");
      });
      rows.push(
        [String(lap.lapNumber || ""), formatTimestamp(lap.firedAt || 0)]
          .concat(FIXED_EXPORT_COLUMNS.map((header) => map.get(header) ?? ""))
          .concat(unionDynamicColumns.map((header) => map.get(header) ?? ""))
      );
    });
  });
  return { headers, rows };
}

function parseDisplayMetricValue(value = "") {
  const numeric = Number.parseFloat(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function getSessionPerformerLabel(rowMap = new Map()) {
  return firstNonEmptyString([
    rowMap.get("mvpd"),
    rowMap.get("requestor-id"),
    rowMap.get("channel"),
    rowMap.get("resource-id"),
    rowMap.get("Analysis Table"),
    "Unknown MVPD",
  ]);
}

function collectSessionPerformerSummaries() {
  const performers = new Map();
  state.sessionHistory.forEach((lap) => {
    const payload = lap?.exportPayload;
    const payloadHeaders = Array.isArray(payload?.columns) ? payload.columns : [];
    const payloadRows = Array.isArray(payload?.rows) ? payload.rows : [];
    payloadRows.forEach((payloadRow) => {
      const rowMap = new Map();
      payloadHeaders.forEach((header, index) => {
        rowMap.set(header, payloadRow[index] ?? "");
      });
      const label = getSessionPerformerLabel(rowMap);
      if (!performers.has(label)) {
        performers.set(label, {
          label,
          samples: 0,
          authnSum: 0,
          authnCount: 0,
          authzSum: 0,
          authzCount: 0,
          latencySum: 0,
          latencyCount: 0,
        });
      }
      const performer = performers.get(label);
      performer.samples += 1;
      const authn = parseDisplayMetricValue(rowMap.get("AuthN Success"));
      const authz = parseDisplayMetricValue(rowMap.get("AuthZ Success"));
      const latency = parseDisplayMetricValue(rowMap.get("Avg AuthZ Latency"));
      if (authn != null) {
        performer.authnSum += authn;
        performer.authnCount += 1;
      }
      if (authz != null) {
        performer.authzSum += authz;
        performer.authzCount += 1;
      }
      if (latency != null) {
        performer.latencySum += latency;
        performer.latencyCount += 1;
      }
    });
  });
  return Array.from(performers.values()).map((performer) => ({
    label: performer.label,
    samples: performer.samples,
    averageAuthn: performer.authnCount > 0 ? performer.authnSum / performer.authnCount : null,
    averageAuthz: performer.authzCount > 0 ? performer.authzSum / performer.authzCount : null,
    averageLatency: performer.latencyCount > 0 ? performer.latencySum / performer.latencyCount : null,
  }));
}

function pickSessionPerformer(performers = [], metricKey = "", direction = "max") {
  const source = Array.isArray(performers) ? performers : [];
  const sorted = source
    .filter((performer) => Number.isFinite(Number(performer?.[metricKey])))
    .sort((left, right) => {
      const leftValue = Number(left?.[metricKey] || 0);
      const rightValue = Number(right?.[metricKey] || 0);
      return direction === "min" ? leftValue - rightValue : rightValue - leftValue;
    });
  return sorted[0] || null;
}

function buildSessionSummaryModel() {
  const tableHitCounts = new Map();
  let capturedRows = 0;
  const performers = collectSessionPerformerSummaries();

  state.sessionHistory.forEach((lap) => {
    const payload = lap?.exportPayload;
    (Array.isArray(payload?.reportItems) ? payload.reportItems : []).forEach((item) => {
      const title = firstNonEmptyString([item?.title, "Analysis Table"]);
      if (Number(item?.rowCount || 0) > 0) {
        tableHitCounts.set(title, (tableHitCounts.get(title) || 0) + 1);
      }
    });
    capturedRows += Array.isArray(payload?.rows) ? payload.rows.length : 0;
  });

  const topTables = Array.from(tableHitCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);
  const sessionWindow = getSessionWindow();
  return {
    totalLaps: state.sessionHistory.length,
    startedAt: state.sessionStartedAt,
    stoppedAt: state.sessionStoppedAt,
    capturedRows,
    sessionWindow,
    topTables,
    bestAuthn: pickSessionPerformer(performers, "averageAuthn", "max"),
    bestAuthz: pickSessionPerformer(performers, "averageAuthz", "max"),
    lowestLatency: pickSessionPerformer(performers, "averageLatency", "min"),
    worstAuthn: pickSessionPerformer(performers, "averageAuthn", "min"),
    worstAuthz: pickSessionPerformer(performers, "averageAuthz", "min"),
    highestLatency: pickSessionPerformer(performers, "averageLatency", "max"),
  };
}

function formatSessionPerformerValue(performer = null, metricKey = "") {
  if (!performer || typeof performer !== "object") {
    return "—";
  }
  if (metricKey === "averageLatency") {
    return `${performer.label} (${formatLatency(performer.averageLatency)})`;
  }
  if (metricKey === "averageAuthn") {
    return `${performer.label} (${formatPercent(performer.averageAuthn)})`;
  }
  if (metricKey === "averageAuthz") {
    return `${performer.label} (${formatPercent(performer.averageAuthz)})`;
  }
  return performer.label || "—";
}

function buildSessionSummaryMarkup(model = null, options = {}) {
  const summaryModel = model && typeof model === "object" ? model : buildSessionSummaryModel();
  const topTableRows = (Array.isArray(summaryModel.topTables) ? summaryModel.topTables : [])
    .map(
      ([title, count]) => `
        <tr>
          <td>${escapeHtml(title)}</td>
          <td>${escapeHtml(formatInteger(count))}</td>
        </tr>
      `
    )
    .join("");
  const includeExportSection = options.includeExportSection !== false;
  const exportSectionMarkup = includeExportSection
    ? `
    <section class="bt-session-block bt-session-block--export-meta">
      <h3 class="bt-session-block-title">Export Report</h3>
      <p class="bt-card-empty">Export Report downloads the BT monitoring session PDF and the full-span CSV rerun from <strong>${escapeHtml(
        summaryModel.sessionWindow.startLabel
      )}</strong> through <strong>${escapeHtml(summaryModel.sessionWindow.endLabel)}</strong> for every analysis table in this workspace.</p>
    </section>
  `
    : "";
  return `
    <div class="bt-session-grid">
      <section class="bt-session-block">
        <h3 class="bt-session-block-title">Monitoring Span</h3>
        <ul class="bt-session-list">
          <li>Started: <strong>${escapeHtml(formatTimestamp(summaryModel.startedAt || 0))}</strong></li>
          <li>Stopped: <strong>${escapeHtml(formatTimestamp(summaryModel.stoppedAt || 0))}</strong></li>
          <li>Laps captured: <strong>${escapeHtml(formatInteger(summaryModel.totalLaps))}</strong></li>
          <li>Interval rows captured: <strong>${escapeHtml(formatInteger(summaryModel.capturedRows))}</strong></li>
          <li>Full ESM window: <strong>${escapeHtml(summaryModel.sessionWindow.startLabel)} to ${escapeHtml(summaryModel.sessionWindow.endLabel)}</strong></li>
        </ul>
      </section>
      <section class="bt-session-block">
        <h3 class="bt-session-block-title">Best Performers</h3>
        <ul class="bt-session-list">
          <li>Highest AuthN: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.bestAuthn, "averageAuthn"))}</strong></li>
          <li>Highest AuthZ: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.bestAuthz, "averageAuthz"))}</strong></li>
          <li>Lowest latency: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.lowestLatency, "averageLatency"))}</strong></li>
        </ul>
      </section>
      <section class="bt-session-block">
        <h3 class="bt-session-block-title">Worst Performers</h3>
        <ul class="bt-session-list">
          <li>Lowest AuthN: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.worstAuthn, "averageAuthn"))}</strong></li>
          <li>Lowest AuthZ: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.worstAuthz, "averageAuthz"))}</strong></li>
          <li>Highest latency: <strong>${escapeHtml(formatSessionPerformerValue(summaryModel.highestLatency, "averageLatency"))}</strong></li>
        </ul>
      </section>
    </div>
    <section class="bt-session-block">
      <h3 class="bt-session-block-title">Analysis Table Heat</h3>
      <table class="bt-session-table">
        <thead>
          <tr>
            <th>Analysis Table</th>
            <th>Hit laps</th>
          </tr>
        </thead>
        <tbody>
          ${topTableRows || `<tr><td colspan="2">No monitored laps captured yet.</td></tr>`}
        </tbody>
      </table>
    </section>
    ${exportSectionMarkup}
  `;
}

function renderSessionPanel() {
  if (!els.sessionPanel || !els.sessionPanelBody) {
    return;
  }
  const showSessionSummary = !isRuntimeActiveHere() && state.sessionStoppedAt > 0 && state.exportPanelOpen;
  els.sessionPanel.hidden = !showSessionSummary;
  if (!showSessionSummary) {
    els.sessionPanelBody.innerHTML = "";
    return;
  }
  const model = buildSessionSummaryModel();
  els.sessionPanelBody.innerHTML = buildSessionSummaryMarkup(model, { includeExportSection: true });
}

function renderSessionControls() {
  const hasSession = state.sessionHistory.length > 0 || state.sessionStoppedAt > 0;
  if (els.sessionToggleButton instanceof HTMLButtonElement) {
    els.sessionToggleButton.hidden = true;
    els.sessionToggleButton.disabled = true;
  }
  const sessionWindow = getSessionWindow();
  const canExportReport = hasSession && Boolean(sessionWindow.start) && Boolean(sessionWindow.end);
  els.exportButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const exportFormat = String(button.getAttribute("data-export-format") || "").trim().toLowerCase();
    const isReport = exportFormat === "report";
    button.hidden = !isReport;
    button.disabled = !isReport || !canExportReport || state.sessionExporting;
    button.title = isReport
      ? state.sessionExporting
        ? "Building the BT monitoring session PDF and full-session CSV..."
        : "Download the BT monitoring session PDF and the full-session ESM CSV."
      : "";
    const label = button.querySelector(".spectrum-Button-label");
    if (label) {
      label.textContent = state.sessionExporting && isReport ? "Building Report..." : "Export Report";
    }
  });
}

function rerenderWorkspace() {
  renderThresholdInputs();
  updateControllerBanner();
  renderTimerControl();
  renderMonitorHeader();
  renderSummaryStrip();
  renderCards();
  renderSessionPanel();
  renderSessionControls();
}

async function sendWorkspaceAction(action = "", payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: BLONDIE_TIME_WORKSPACE_MESSAGE_TYPE,
      channel: "workspace-action",
      action: String(action || "").trim().toLowerCase(),
      ...payload,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function sendBlondieTimeRuntimeAction(action = "", payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: BLONDIE_TIME_MESSAGE_TYPE,
      channel: "runtime-command",
      action: String(action || "").trim().toLowerCase(),
      workspace: "bt",
      windowId: Number(state.windowId || 0),
      tabId: Number(state.tabId || 0),
      workspaceContextKey: String(state.workspaceContextKey || "").trim(),
      programmerId: String(state.programmerId || "").trim(),
      programmerName: String(state.programmerName || "").trim(),
      ...payload,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function normalizeLaunchContext(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const createdAt = Math.max(0, Number(value?.createdAt || 0));
  if (!createdAt || Date.now() - createdAt > 10 * 60 * 1000) {
    return null;
  }
  return {
    createdAt,
    targetWindowId: Math.max(0, Number(value?.targetWindowId || 0)),
    intervalMinutes: Math.max(0, Number(value?.intervalMinutes || 0)),
    triggerMode: normalizeTriggerMode(value?.triggerMode || "self"),
    deliveryTarget: cloneDeliveryTarget(value?.deliveryTarget || null),
    noteText: String(value?.noteText || ""),
    workspaceContextKey: String(value?.workspaceContextKey || "").trim(),
    programmerId: String(value?.programmerId || "").trim(),
    programmerName: String(value?.programmerName || "").trim(),
    adobePassEnvironment: cloneJson(value?.adobePassEnvironment, null),
    requestorIds: Array.isArray(value?.requestorIds) ? value.requestorIds.map((item) => String(item || "").trim()).filter(Boolean) : [],
    mvpdIds: Array.isArray(value?.mvpdIds) ? value.mvpdIds.map((item) => String(item || "").trim()).filter(Boolean) : [],
    thresholds: BLONDIE_TIME_LOGIC.normalizeThresholds(value?.thresholds || null),
    cards: (Array.isArray(value?.cards) ? value.cards : []).map((card) => normalizeCardPayload(card)).filter(Boolean),
  };
}

async function clearPendingLaunchContext() {
  try {
    await chrome.storage.local.remove(BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

async function readPendingLaunchContext() {
  try {
    const payload = await chrome.storage.local.get(BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY);
    return normalizeLaunchContext(payload?.[BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY] || null);
  } catch {
    return null;
  }
}

function applyControllerState(payload = {}) {
  const incomingUpdatedAt = Math.max(0, Number(payload?.updatedAt || 0));
  if (
    incomingUpdatedAt > 0 &&
    Number(state.controllerStateUpdatedAt || 0) > 0 &&
    incomingUpdatedAt < Number(state.controllerStateUpdatedAt || 0)
  ) {
    return;
  }
  state.controllerOnline = payload?.controllerOnline === true;
  state.controllerStateVersion = Math.max(0, Number(payload?.controllerStateVersion || state.controllerStateVersion || 0));
  state.controllerStateUpdatedAt = incomingUpdatedAt || Date.now();
  state.slackReady = payload?.slack?.ready === true;
  state.slackUserId = String(payload?.slack?.userId || state.slackUserId || "").trim().toUpperCase();
  state.slackUserName = String(payload?.slack?.userName || state.slackUserName || "").trim();
  state.slackShareTargets = normalizeShareTargets(payload?.slack?.shareTargets || state.slackShareTargets);
  state.programmerId = String(payload?.programmerId || state.programmerId || "").trim();
  state.programmerName = String(payload?.programmerName || state.programmerName || "").trim();
  state.requestorIds = Array.isArray(payload?.requestorIds) ? payload.requestorIds.map((item) => String(item || "").trim()).filter(Boolean) : state.requestorIds;
  state.mvpdIds = Array.isArray(payload?.mvpdIds) ? payload.mvpdIds.map((item) => String(item || "").trim()).filter(Boolean) : state.mvpdIds;
  state.workspaceContextKey = String(payload?.workspaceContextKey || state.workspaceContextKey || "").trim();
  state.adobePassEnvironment = resolveWorkspaceAdobePassEnvironment(payload?.adobePassEnvironment || state.adobePassEnvironment);
  if (!state.slackReady || state.slackShareTargets.length === 0) {
    closeSharePicker();
  }
  rerenderWorkspace();
}

function applyReportStart(payload = {}) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = true;
  cardState.lastModified = "";
  rerenderWorkspace();
}

function applyReportResult(payload = {}) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = false;
  if (!payload?.ok) {
    cardState.rows = [];
    cardState.lastModified = "";
    setStatus(payload?.error || "BT_WS request failed.", "error");
    rerenderWorkspace();
    return;
  }
  cardState.rows = Array.isArray(payload?.rows) ? payload.rows.map((row) => ({ ...(row && typeof row === "object" ? row : {}) })) : [];
  cardState.columns = Array.isArray(payload?.columns) ? payload.columns.map((value) => String(value || "").trim()).filter(Boolean) : cardState.columns;
  cardState.lastModified = String(payload?.lastModified || "").trim();
  rerenderWorkspace();
}

function handleWorkspaceEvent(event = "", payload = {}) {
  const normalizedEvent = String(event || "").trim().toLowerCase();
  if (normalizedEvent === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (normalizedEvent === "report-start") {
    applyReportStart(payload);
    return;
  }
  if (normalizedEvent === "report-result") {
    applyReportResult(payload);
    return;
  }
  if (normalizedEvent === "batch-start") {
    state.batchRunning = true;
    state.activeBatchReason = String(payload?.reason || "").trim();
    rerenderWorkspace();
    return;
  }
  if (normalizedEvent === "batch-end") {
    state.batchRunning = false;
    rerenderWorkspace();
  }
}

async function rerunAllCards(options = {}) {
  const cards = getOrderedCards().map((cardState) => buildCardPayload(cardState));
  if (cards.length === 0) {
    throw new Error("Open at least one ESM analysis table before monitoring Blondie Time.");
  }
  const reason = firstNonEmptyString([options.reason, `bt-monitor-lap-${Date.now()}`]);
  const intervalMinutes = Math.max(
    0,
    Number(options.intervalMinutes || state.lastStartOptions?.intervalMinutes || state.runtimeState?.intervalMinutes || 0)
  );
  const requestedAt = Math.max(0, Number(options.requestedAt || Date.now())) || Date.now();
  const result = await sendWorkspaceAction("rerun-all", {
    cards,
    reason,
    intervalMinutes,
    requestedAt,
  });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to rerun BT analysis tables.");
  }
}

async function deliverCurrentLap(options = {}) {
  const exportPayload = buildCurrentLapExportPayload(options);
  const historyEntry = buildLapHistoryEntry(exportPayload);
  appendLapHistory(historyEntry);
  rerenderWorkspace();
  if (options.deliver === false) {
    return {
      ok: true,
      exportPayload,
      deliveredCount: 0,
    };
  }
  const result = await sendWorkspaceAction("blondie-export-all", {
    exportPayload,
    deliveryTarget: state.lastStartOptions?.deliveryTarget || null,
    noteText: state.lastStartOptions?.noteText || "",
  });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to deliver Blondie Time Results to Slack.");
  }
  setStatus(
    result?.deliveredCount > 0
      ? `Blondie Time Results delivered to Slack with ${formatInteger(exportPayload.rowCount)} row(s).`
      : "Blondie Time evaluated successfully.",
    "success"
  );
  return {
    ok: true,
    exportPayload,
    deliveredCount: Math.max(0, Number(result?.deliveredCount || 0)),
  };
}

async function executeMonitoringLap(options = {}) {
  if (state.lapRunning) {
    throw new Error("Blondie Time is already evaluating a BT lap.");
  }
  state.lapRunning = true;
  rerenderWorkspace();
  try {
    if (options.rerun === true) {
      await rerunAllCards({
        reason: firstNonEmptyString([options.reason, `bt-monitor-lap-${Date.now()}`]),
        intervalMinutes: Number(options.intervalMinutes || state.lastStartOptions?.intervalMinutes || state.runtimeState?.intervalMinutes || 0),
        requestedAt: Number(options.requestedAt || Date.now()),
      });
    }
    const deliveryResult = await deliverCurrentLap({
      deliver: options.deliver !== false,
      intervalMinutes: Number(options.intervalMinutes || state.lastStartOptions?.intervalMinutes || state.runtimeState?.intervalMinutes || 0),
      requestedAt: Number(options.requestedAt || Date.now()),
    });
    if (options.scheduleAfter === true && state.lastStartOptions?.intervalMinutes > 0) {
      const scheduleResult = await sendBlondieTimeRuntimeAction("start", {
        intervalMinutes: Number(state.lastStartOptions.intervalMinutes || 0),
        triggerMode: String(state.lastStartOptions.triggerMode || "self"),
        deliveryTarget: state.lastStartOptions.deliveryTarget || null,
        noteText: String(state.lastStartOptions.noteText || ""),
      });
      if (!scheduleResult?.ok) {
        throw new Error(scheduleResult?.error || "The first BT lap completed, but repeat scheduling failed.");
      }
      state.runtimeState = normalizeRuntimeState(scheduleResult?.state || null);
    }
    return deliveryResult;
  } finally {
    state.lapRunning = false;
    rerenderWorkspace();
  }
}

async function startMonitoring(intervalMinutes = 0, options = {}) {
  const normalizedInterval = BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES.includes(Number(intervalMinutes))
    ? Number(intervalMinutes)
    : Number(state.lastStartOptions?.intervalMinutes || BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES[0]);
  const triggerMode = normalizeTriggerMode(options?.triggerMode || getTimerPendingMode());
  const blockedReason = getMonitoringStartBlockedReason(triggerMode);
  if (blockedReason) {
    state.timerLocalWarning = blockedReason;
    rerenderWorkspace();
    setStatus(blockedReason, "error");
    return {
      ok: false,
      error: blockedReason,
    };
  }
  state.timerLocalWarning = "";
  state.lastStartOptions = {
    intervalMinutes: normalizedInterval,
    triggerMode,
    deliveryTarget: triggerMode === "teammate" ? cloneDeliveryTarget(options?.deliveryTarget || null) : null,
    noteText: String(options?.noteText || ""),
  };
  closeTimerPicker({ restoreFocus: false });
  closeSharePicker();
  try {
    const result = await executeMonitoringLap({
      rerun: true,
      deliver: true,
      scheduleAfter: true,
      intervalMinutes: normalizedInterval,
      requestedAt: Date.now(),
      reason: `bt-start-${Date.now()}`,
    });
    return {
      ok: true,
      deliveredCount: Math.max(0, Number(result?.deliveredCount || 0)),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    state.timerLocalWarning = message;
    rerenderWorkspace();
    setStatus(message, "error");
    return {
      ok: false,
      error: message,
    };
  }
}

async function consumeLaunchContext(context = null) {
  const launchContext = normalizeLaunchContext(context || (await readPendingLaunchContext()));
  if (!launchContext) {
    return false;
  }
  if (launchContext.targetWindowId > 0 && Number(state.windowId || 0) > 0 && launchContext.targetWindowId !== Number(state.windowId || 0)) {
    return false;
  }
  if (state.lapRunning || isRuntimeActiveHere()) {
    setStatus("Stop the current BT monitoring session before loading a new ESM context.", "warn");
    return false;
  }
  await clearPendingLaunchContext();
  state.launchConsumedAt = Date.now();
  state.lastStartOptions = {
    intervalMinutes: BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES.includes(Number(launchContext.intervalMinutes || 0))
      ? Number(launchContext.intervalMinutes || 0)
      : BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES[0],
    triggerMode: launchContext.triggerMode,
    deliveryTarget: null,
    noteText: "",
  };
  state.timerPendingMode = launchContext.triggerMode;
  state.timerLocalWarning = "";
  state.thresholds = BLONDIE_TIME_LOGIC.normalizeThresholds(launchContext.thresholds);
  state.workspaceContextKey = String(launchContext.workspaceContextKey || state.workspaceContextKey || "").trim();
  state.programmerId = String(launchContext.programmerId || state.programmerId || "").trim();
  state.programmerName = String(launchContext.programmerName || state.programmerName || "").trim();
  state.requestorIds = Array.isArray(launchContext.requestorIds) ? launchContext.requestorIds.slice() : state.requestorIds;
  state.mvpdIds = Array.isArray(launchContext.mvpdIds) ? launchContext.mvpdIds.slice() : state.mvpdIds;
  state.adobePassEnvironment = resolveWorkspaceAdobePassEnvironment(launchContext.adobePassEnvironment || state.adobePassEnvironment);
  state.cardsById.clear();
  launchContext.cards.forEach((card) => {
    const cardState = ensureCard(card);
    if (cardState) {
      analyzeCard(cardState);
    }
  });
  state.sessionHistory = [];
  state.sessionStartedAt = 0;
  state.sessionStoppedAt = 0;
  state.sessionExporting = false;
  state.exportPanelOpen = false;
  rerenderWorkspace();
  scheduleCloseGuardSnapshotPersist({ immediate: true });
  openTimerPicker(launchContext.triggerMode, { focus: true });
  setStatus("BT_WS loaded the current ESM context. Choose an interval to start Blondie Time.", "success");
  return true;
}

async function refreshRuntimeState() {
  const result = await sendBlondieTimeRuntimeAction("query");
  if (!result?.ok) {
    return;
  }
  state.runtimeState = normalizeRuntimeState(result?.state || null);
  if (state.runtimeState?.running && state.runtimeState.workspace === "bt") {
    state.lastStartOptions = {
      intervalMinutes: Number(state.runtimeState.intervalMinutes || 0),
      triggerMode: state.runtimeState.triggerMode,
      deliveryTarget: state.runtimeState.deliveryTarget || null,
      noteText: state.runtimeState.noteText || "",
    };
    state.timerPendingMode = state.runtimeState.triggerMode;
    state.timerLocalWarning = "";
    if (!state.sessionStartedAt && Number(state.runtimeState.startedAt || 0) > 0) {
      state.sessionStartedAt = Number(state.runtimeState.startedAt || 0);
    }
  } else {
    state.timerLocalWarning = String(state.runtimeState?.lastError || "").trim();
  }
  rerenderWorkspace();
  scheduleCloseGuardSnapshotPersist();
}

async function stopMonitoring(reason = "manual") {
  closeTimerPicker({ restoreFocus: false });
  closeSharePicker();
  const result = await sendBlondieTimeRuntimeAction("cancel", {
    reason,
  });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to stop Blondie Time.");
  }
  state.runtimeState = normalizeRuntimeState(result?.state || null);
  state.sessionStoppedAt = Date.now();
  state.exportPanelOpen = true;
  state.timerLocalWarning = "";
  rerenderWorkspace();
  scheduleCloseGuardSnapshotPersist({ immediate: true });
  setStatus("Blondie Time stopped. The Monitoring Session summary and BT PDF/CSV export are ready below.", "success");
}

async function handleAlarmLap(message = {}) {
  const runtimeState = normalizeRuntimeState(message?.state || state.runtimeState);
  if (!runtimeState?.running || runtimeState.workspace !== "bt") {
    return {
      ok: false,
      error: "This BT workspace is not the active Blondie Time target.",
    };
  }
  state.runtimeState = runtimeState;
  state.lastStartOptions = {
    intervalMinutes: Number(runtimeState.intervalMinutes || 0),
    triggerMode: runtimeState.triggerMode,
    deliveryTarget: runtimeState.deliveryTarget || null,
    noteText: runtimeState.noteText || "",
  };
  state.timerPendingMode = runtimeState.triggerMode;
  state.timerLocalWarning = "";
  try {
    const result = await executeMonitoringLap({
      rerun: true,
      deliver: true,
      scheduleAfter: false,
      intervalMinutes: Number(runtimeState.intervalMinutes || 0),
      requestedAt: Date.now(),
      reason: `bt-runtime-${Date.now()}`,
    });
    return {
      ok: true,
      deliveredCount: Math.max(0, Number(result?.deliveredCount || 0)),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function downloadBlobFile(blob = null, fileName = "bt-report.txt") {
  if (!(blob instanceof Blob)) {
    throw new Error("Unable to build the requested BT export file.");
  }
  const url = URL.createObjectURL(blob);
  let downloadStarted = false;
  try {
    if (chrome?.downloads?.download) {
      await chrome.downloads.download({
        url,
        filename: String(fileName || "bt-report.txt"),
        saveAs: false,
        conflictAction: "uniquify",
      });
      downloadStarted = true;
    }
  } catch {
    downloadStarted = false;
  }
  if (!downloadStarted) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function downloadTextFile(text = "", fileName = "bt-report.txt", contentType = "text/plain;charset=utf-8") {
  await downloadBlobFile(new Blob([String(text || "")], { type: contentType }), fileName);
}

function escapeDelimitedValue(value = "", delimiter = ",") {
  const text = String(value ?? "");
  if (text.includes('"') || text.includes("\n") || text.includes("\r") || text.includes(delimiter)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function buildSessionReportFileName(extension = "txt") {
  const programmerSegment = firstNonEmptyString([state.programmerId, state.programmerName, "media-company"])
    .replace(/[^a-z0-9._-]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "media-company";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `underpar_bt_ws_${programmerSegment}_${stamp}.${extension}`;
}

async function requestSessionPdfExport(fileName = "underpar_bt_ws_session.pdf") {
  const result = await sendWorkspaceAction("export-session-pdf", {
    fileName: String(fileName || "underpar_bt_ws_session.pdf"),
  });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to download the BT monitoring session PDF.");
  }
  return result;
}

function getSessionExportContext() {
  const cards = getOrderedCards();
  const sessionWindow = getSessionWindow();
  return {
    cards,
    sessionWindow,
  };
}

async function requestSessionCsvExport(cards = [], sessionWindow = {}) {
  const result = await sendWorkspaceAction("export-session-csv", {
    cards: (Array.isArray(cards) ? cards : []).map((cardState) => buildCardPayload(cardState)),
    sessionWindow: {
      start: String(sessionWindow?.start || "").trim(),
      end: String(sessionWindow?.end || "").trim(),
    },
  });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to download the BT full-session CSV.");
  }
  return result;
}

async function exportSessionReport() {
  const { cards, sessionWindow } = getSessionExportContext();
  if (cards.length === 0) {
    setStatus("No BT analysis tables are loaded for monitoring session export.", "error");
    return;
  }
  if (!sessionWindow.start || !sessionWindow.end) {
    setStatus("Start and stop the BT monitoring session before exporting the report.", "error");
    return;
  }

  const summaryModel = buildSessionSummaryModel();
  const pdfFileName = buildSessionReportFileName("pdf");
  state.sessionExporting = true;
  rerenderWorkspace();
  let pdfDownloaded = false;
  let pdfWarning = "";
  try {
    await requestSessionPdfExport(pdfFileName);
    pdfDownloaded = true;
  } catch (error) {
    pdfWarning = error instanceof Error ? error.message : String(error);
  }

  try {
    const result = await requestSessionCsvExport(cards, sessionWindow);
    await downloadTextFile(
      String(result.csvText || ""),
      String(result.fileName || buildSessionReportFileName("csv")),
      "text/csv;charset=utf-8"
    );
    if (pdfDownloaded) {
      setStatus(
        `Downloaded the BT monitoring session PDF and full-session CSV for ${formatInteger(
          result.tableCount || cards.length
        )} analysis table(s) and ${formatInteger(result.rowCount || 0)} row(s).`,
        "success"
      );
    } else {
      setStatus(
        `Downloaded the full-session CSV for ${formatInteger(result.tableCount || cards.length)} analysis table(s) and ${formatInteger(
          result.rowCount || 0
        )} row(s), but the BT monitoring session PDF failed: ${pdfWarning}`.trim(),
        pdfWarning ? "warn" : "success"
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(
      pdfDownloaded
        ? `Downloaded the BT monitoring session PDF, but CSV export failed: ${message}`
        : firstNonEmptyString([pdfWarning, message, "Unable to export the BT monitoring session files."]),
      pdfDownloaded ? "warn" : "error"
    );
  } finally {
    state.sessionExporting = false;
    rerenderWorkspace();
  }
}

function updateThresholdsFromInputs() {
  state.thresholds = BLONDIE_TIME_LOGIC.normalizeThresholds({
    minAuthnAttempts: els.thresholdMinAuthn?.value,
    authnSuccessMin: els.thresholdAuthn?.value,
    authzSuccessMin: els.thresholdAuthz?.value,
    latencyMaxMs: els.thresholdLatency?.value,
  });
  rerenderWorkspace();
  setStatus("BT thresholds updated. Existing analysis tables were recalculated in place.", "success");
}

async function openCardInEsmWorkspace(cardId = "") {
  const cardState = state.cardsById.get(String(cardId || "").trim()) || null;
  if (!cardState) {
    setStatus("Unable to find the selected BT analysis table.", "error");
    return;
  }
  const result = await sendWorkspaceAction("send-to-esm-workspace", {
    card: buildCardPayload(cardState),
  });
  if (!result?.ok) {
    setStatus(result?.error || "Unable to open the BT analysis table in ESM Workspace.", "error");
    return;
  }
  setStatus("Analysis table sent to ESM Workspace.", "success");
}

function registerEventHandlers() {
  window.addEventListener("beforeunload", handleBeforeUnload);

  [els.thresholdMinAuthn, els.thresholdAuthn, els.thresholdAuthz, els.thresholdLatency].forEach((input) => {
    input?.addEventListener("change", updateThresholdsFromInputs);
  });

  els.refreshButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await executeMonitoringLap({
        rerun: true,
        deliver: false,
        scheduleAfter: false,
        intervalMinutes: Number(state.runtimeState?.intervalMinutes || state.lastStartOptions?.intervalMinutes || 0),
        requestedAt: Date.now(),
        reason: `bt-manual-refresh-${Date.now()}`,
      });
      setStatus("BT analysis tables refreshed without Slack delivery.", "success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  els.sessionToggleButton?.addEventListener("click", (event) => {
    event.preventDefault();
    state.exportPanelOpen = !state.exportPanelOpen;
    rerenderWorkspace();
  });

  els.timerButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    if (isRuntimeActiveHere()) {
      return;
    }
    if (getTimerStartDisabledReason()) {
      setStatus(getTimerStartDisabledReason(), "warn");
      return;
    }
    openTimerPicker(event.shiftKey ? "teammate" : "self");
  });

  els.timerStopButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await stopMonitoring("manual");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  els.monitoringStopButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await stopMonitoring("manual");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  els.timerPicker?.addEventListener("keydown", handleTimerPickerKeydown);
  getTimerPickerButtons().forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const intervalMinutes = Number(button.dataset.minutes || 0);
      if (!BLONDIE_TIME_INTERVAL_OPTIONS_MINUTES.includes(intervalMinutes)) {
        return;
      }
      const triggerMode = getTimerPendingMode();
      if (triggerMode === "teammate") {
        const blockedReason = getMonitoringStartBlockedReason("teammate");
        if (blockedReason && blockedReason !== BLONDIE_BUTTON_SHARE_TARGETS_EMPTY_MESSAGE) {
          state.timerLocalWarning = blockedReason;
          rerenderWorkspace();
          setStatus(blockedReason, "error");
          return;
        }
        closeTimerPicker({ restoreFocus: false });
        openSharePicker(els.timerButton, async ({ selectedTarget, noteText }) => {
          return await startMonitoring(intervalMinutes, {
            triggerMode: "teammate",
            deliveryTarget: {
              mode: "teammate",
              userId: selectedTarget.userId,
              userName: selectedTarget.userName || selectedTarget.label,
            },
            noteText,
          });
        });
        return;
      }
      await startMonitoring(intervalMinutes, {
        triggerMode: "self",
      });
    });
  });

  els.cardsHost?.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".bt-send-to-esm-btn") : null;
    if (!button) {
      return;
    }
    event.preventDefault();
    void openCardInEsmWorkspace(String(button.getAttribute("data-card-id") || ""));
  });

  els.exportButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const exportFormat = String(button.getAttribute("data-export-format") || "").trim().toLowerCase();
      if (exportFormat === "report") {
        await exportSessionReport();
      }
    });
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(changes, BLONDIE_TIME_RUNTIME_STORAGE_KEY)) {
      state.runtimeState = normalizeRuntimeState(changes[BLONDIE_TIME_RUNTIME_STORAGE_KEY]?.newValue || null);
      if (state.runtimeState?.running && state.runtimeState.workspace === "bt") {
        state.lastStartOptions = {
          intervalMinutes: Number(state.runtimeState.intervalMinutes || 0),
          triggerMode: state.runtimeState.triggerMode,
          deliveryTarget: state.runtimeState.deliveryTarget || null,
          noteText: state.runtimeState.noteText || "",
        };
        state.timerPendingMode = state.runtimeState.triggerMode;
        state.timerLocalWarning = "";
      } else {
        state.timerLocalWarning = String(state.runtimeState?.lastError || "").trim();
      }
      rerenderWorkspace();
      scheduleCloseGuardSnapshotPersist();
    }
    if (Object.prototype.hasOwnProperty.call(changes, BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY)) {
      const nextValue = normalizeLaunchContext(changes[BLONDIE_TIME_WORKSPACE_LAUNCH_STORAGE_KEY]?.newValue || null);
      if (nextValue) {
        void consumeLaunchContext(nextValue);
      }
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== BLONDIE_TIME_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
      return false;
    }
    const targetWindowId = Number(message?.targetWindowId || 0);
    if (targetWindowId > 0 && Number(state.windowId || 0) > 0 && targetWindowId !== Number(state.windowId || 0)) {
      return false;
    }
    handleWorkspaceEvent(message?.event, message?.payload || {});
    return false;
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== BLONDIE_TIME_MESSAGE_TYPE || message?.channel !== "workspace-control") {
      return false;
    }
    const targetTabId = Number(message?.targetTabId || message?.state?.targetTabId || 0);
    if (targetTabId > 0 && Number(state.tabId || 0) > 0 && targetTabId !== Number(state.tabId || 0)) {
      return false;
    }
    const targetWindowId = Number(message?.targetWindowId || 0);
    if (
      targetTabId <= 0 &&
      targetWindowId > 0 &&
      Number(state.windowId || 0) > 0 &&
      targetWindowId !== Number(state.windowId || 0)
    ) {
      return false;
    }
    if (String(message?.action || "").trim().toLowerCase() !== "fire-lap") {
      return false;
    }
    const runtimeState = normalizeRuntimeState(message?.state || null);
    if (runtimeState && String(runtimeState.workspace || "").trim().toLowerCase() !== "bt") {
      return false;
    }
    void handleAlarmLap(message)
      .then((result) => sendResponse(result))
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true;
  });
}

async function init() {
  const [windowResult, tabResult] = await Promise.allSettled([chrome.windows.getCurrent(), chrome.tabs.getCurrent()]);
  state.windowId = windowResult.status === "fulfilled" ? Number(windowResult.value?.id || 0) : 0;
  state.tabId = tabResult.status === "fulfilled" ? Number(tabResult.value?.id || 0) : 0;
  renderThresholdInputs();
  rerenderWorkspace();
  registerEventHandlers();
  await refreshRuntimeState();
  const readyResult = await sendWorkspaceAction("workspace-ready");
  if (!readyResult?.ok) {
    setStatus(readyResult?.error || "Unable to contact the UnderPAR controller.", "error");
  }
  const launchContext = await readPendingLaunchContext();
  if (launchContext) {
    await consumeLaunchContext(launchContext);
  }
  scheduleCloseGuardSnapshotPersist({ immediate: true });
}

void init();
