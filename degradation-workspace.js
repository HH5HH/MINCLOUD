const DEGRADATION_WORKSPACE_MESSAGE_TYPE = "underpar:degradation-workspace";
const BLONDIE_BUTTON_STATES = new Set(["inactive", "ready", "active", "ack"]);
const BLONDIE_BUTTON_ACK_RESET_MS = 2000;
const DEGRADATION_WORKSPACE_MAX_REPORTS = 60;
const BLONDIE_BUTTON_INACTIVE_MESSAGE =
  "No zip-zap without SLACKTIVATION. Please visit VAULT container on the UP Tab to feed your ZIP.KEY to UnderPAR";
const BLONDIE_BUTTON_SHARE_TARGETS_EMPTY_MESSAGE =
  "No pass-transition roster is cached yet. Re-SLACKTIVATE UnderPAR in the VAULT.";
const BLONDIE_BUTTON_SHARE_NOTE_EMPTY_MESSAGE = "Enter a Slack note before sending.";
const BLONDIE_BUTTON_ICON_URLS = (() => {
  const resolveIconUrl = (path) =>
    typeof chrome !== "undefined" && chrome?.runtime?.getURL ? chrome.runtime.getURL(path) : path;
  return {
    inactive: resolveIconUrl("icons/blondie-button-inactive.png"),
    ready: resolveIconUrl("icons/blondie-button-slacktivated.png"),
    active: resolveIconUrl("icons/blondie-button-active.png"),
    ack: resolveIconUrl("icons/blondie-button-zipzap200.png"),
  };
})();
const blondieAckResetTimerByButton = new WeakMap();

const state = {
  windowId: 0,
  controllerOnline: false,
  adobePassEnvironment: null,
  slackReady: false,
  slackUserId: "",
  slackUserName: "",
  slackShareTargets: [],
  degradationReady: false,
  programmerId: "",
  programmerName: "",
  requestorId: "",
  mvpd: "",
  mvpdLabel: "",
  mvpdScopeLabel: "",
  selectionKey: "",
  appGuid: "",
  appName: "",
  cheatSheetLoading: false,
  cheatSheetLoadingMessage: "",
  cheatSheets: [],
  reports: [],
  batchRunning: false,
  pendingAutoRerunCards: [],
  pendingAutoRerunSelectionKey: "",
  autoRerunInFlightSelectionKey: "",
  pendingWorkspaceDeeplink: null,
  pendingWorkspaceDeeplinkConsuming: false,
  pendingWorkspaceDeeplinkActivating: false,
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
  pageEnvBadge: document.getElementById("page-env-badge"),
  pageEnvBadgeValue: document.getElementById("page-env-badge-value"),
};
const UNDERPAR_BLONDIE_SHARE_PICKER = globalThis.UnderParBlondieSharePicker;
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
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

function getEnvironmentKey(environment = null) {
  return String(environment?.key || "").trim();
}

function getWorkspaceEnvironmentRegistry() {
  return globalThis.UnderParEnvironment || null;
}

function resolveWorkspaceAdobePassEnvironment(value = null) {
  const embedded = value && typeof value === "object" && !Array.isArray(value) ? value : null;
  const registry = getWorkspaceEnvironmentRegistry();
  if (embedded) {
    return registry?.getEnvironment ? registry.getEnvironment(embedded.key || embedded) : { ...embedded };
  }
  if (registry?.getEnvironment) {
    return registry.getEnvironment(value || "release-production");
  }
  return {
    key: "release-production",
    label: "Production",
    route: "release-production",
    mgmtBase: "https://mgmt.auth.adobe.com",
    degradationBase: "https://mgmt.auth.adobe.com/control/v3/degradation",
  };
}

function buildWorkspaceEnvironmentTooltip(environment) {
  const resolved = resolveWorkspaceAdobePassEnvironment(environment);
  const registry = getWorkspaceEnvironmentRegistry();
  if (registry?.buildEnvironmentBadgeTooltip) {
    return String(registry.buildEnvironmentBadgeTooltip(resolved, "degradation") || "").trim();
  }
  const route = String(resolved.route || "release-production").trim() || "release-production";
  const label = String(resolved.label || (route === "release-staging" ? "Staging" : "Production")).trim() || "Production";
  const mgmtBase = String(
    resolved.mgmtBase || (route === "release-staging" ? "https://mgmt.auth-staging.adobe.com" : "https://mgmt.auth.adobe.com")
  ).trim();
  const degradationBase = String(resolved.degradationBase || `${mgmtBase}/control/v3/degradation`).trim();
  return [`Environment : ${label}`, `DEGRADATION : ${degradationBase}`].join("\n").trim();
}

function renderWorkspaceEnvironmentBadge() {
  if (!els.pageEnvBadge || !els.pageEnvBadgeValue) {
    return;
  }
  const environment = resolveWorkspaceAdobePassEnvironment(state.adobePassEnvironment);
  const label = String(environment?.label || "").trim() || "Production";
  const title = buildWorkspaceEnvironmentTooltip(environment) || label;
  els.pageEnvBadgeValue.textContent = "";
  els.pageEnvBadgeValue.setAttribute("aria-hidden", "true");
  els.pageEnvBadge.title = title;
  els.pageEnvBadge.setAttribute("aria-label", title);
}

function buildWorkspaceDeeplinkSelectionKey(context = null) {
  const environmentKey = firstNonEmptyString([
    context?.environmentKey,
    context?.adobePassEnvironmentKey,
    getEnvironmentKey(state.adobePassEnvironment),
    getEnvironmentKey(resolveWorkspaceAdobePassEnvironment()),
  ]);
  const programmerId = String(context?.programmerId || "").trim();
  if (!programmerId) {
    return "";
  }
  return [environmentKey || "release-production", programmerId].join("|");
}

function parseWorkspaceSelectionKey(selectionKey = "") {
  const [environmentKey = "", programmerId = "", requestorId = "", mvpd = ""] = String(selectionKey || "").trim().split("|");
  return {
    environmentKey: String(environmentKey || "").trim(),
    programmerId: String(programmerId || "").trim(),
    requestorId: String(requestorId || "").trim() === "*" ? "" : String(requestorId || "").trim(),
    mvpd: String(mvpd || "").trim() === "*" ? "" : String(mvpd || "").trim(),
  };
}

function normalizeWorkspaceSelectionKey(selectionKey = "", context = null) {
  const selectionParts = parseWorkspaceSelectionKey(selectionKey);
  return buildWorkspaceDeeplinkSelectionKey({
    environmentKey: firstNonEmptyString([context?.environmentKey, selectionParts.environmentKey]),
    adobePassEnvironmentKey: context?.adobePassEnvironmentKey,
    programmerId: firstNonEmptyString([context?.programmerId, selectionParts.programmerId]),
  });
}

function parseWorkspaceDeeplinkBoolean(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function normalizeWorkspaceDeeplinkEndpointKeys(value = null) {
  const rawValues = Array.isArray(value) ? value : String(value || "").split(",");
  const output = [];
  const seen = new Set();
  rawValues.forEach((entry) => {
    const normalized = String(entry || "").trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function parseWorkspaceDeeplinkPayloadFromLocation() {
  const query = String(window.location.hash || "").startsWith("#")
    ? window.location.hash.slice(1)
    : String(window.location.search || "").replace(/^\?/, "");
  if (!query) {
    return null;
  }
  const params = new URLSearchParams(query);
  const endpointKeys = normalizeWorkspaceDeeplinkEndpointKeys(params.get("endpointKeys") || params.get("endpointKey") || "");
  const endpointKey = firstNonEmptyString([params.get("endpointKey"), params.get("endpointPath"), endpointKeys[0]]).toLowerCase();
  const programmerId = String(params.get("programmerId") || "").trim();
  const requestorId = String(params.get("requestorId") || "").trim();
  if ((!endpointKey && endpointKeys.length === 0) || !programmerId || !requestorId) {
    return null;
  }
  const mvpd = String(params.get("mvpd") || "").trim();
  const includeAllMvpd = parseWorkspaceDeeplinkBoolean(params.get("includeAllMvpd") || "") || !mvpd;
  const environmentKey = firstNonEmptyString([
    params.get("environmentKey"),
    params.get("adobePassEnvironmentKey"),
    getEnvironmentKey(resolveWorkspaceAdobePassEnvironment()),
  ]);
  const selectionKey =
    normalizeWorkspaceSelectionKey(params.get("selectionKey"), {
      environmentKey,
      programmerId,
    }) ||
    buildWorkspaceDeeplinkSelectionKey({
      environmentKey,
      programmerId,
    });
  return {
    endpointKey: endpointKey || endpointKeys[0] || "",
    endpointKeys: endpointKeys.length > 0 ? endpointKeys : [endpointKey].filter(Boolean),
    endpointPath: String(params.get("endpointPath") || "").trim(),
    requestUrl: String(params.get("requestUrl") || "").trim(),
    displayNodeLabel: firstNonEmptyString([params.get("displayNodeLabel"), params.get("datasetLabel"), params.get("endpointTitle")]),
    programmerId,
    programmerName: String(params.get("programmerName") || "").trim(),
    requestorId,
    mvpd: includeAllMvpd ? "" : mvpd,
    mvpdLabel: String(params.get("mvpdLabel") || "").trim(),
    includeAllMvpd,
    environmentKey,
    environmentLabel: String(params.get("environmentLabel") || "").trim(),
    selectionKey,
    source: String(params.get("source") || "blondie-button").trim() || "blondie-button",
    createdAt: Math.max(0, Number(params.get("createdAt") || Date.now() || 0)),
  };
}

function clearWorkspaceDeeplinkFromLocation() {
  try {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = "";
    [
      "endpointKey",
      "endpointKeys",
      "endpointPath",
      "requestUrl",
      "displayNodeLabel",
      "datasetLabel",
      "endpointTitle",
      "programmerId",
      "programmerName",
      "requestorId",
      "mvpd",
      "mvpdLabel",
      "includeAllMvpd",
      "environmentKey",
      "environmentLabel",
      "selectionKey",
      "source",
      "createdAt",
    ].forEach((key) => nextUrl.searchParams.delete(key));
    const nextHref = `${String(nextUrl.pathname || "")}${String(nextUrl.search || "")}`;
    window.history.replaceState(null, document.title, nextHref || window.location.pathname);
  } catch {
    // Ignore history cleanup failures.
  }
}

function normalizeReport(report = null) {
  if (!report || typeof report !== "object") {
    return null;
  }
  const rawSelectionKey = String(report.selectionKey || "").trim();
  const selectionParts = parseWorkspaceSelectionKey(rawSelectionKey);
  const selectionKey =
    normalizeWorkspaceSelectionKey(rawSelectionKey, {
      environmentKey: firstNonEmptyString([report.adobePassEnvironmentKey, report.environmentKey, selectionParts.environmentKey]),
      programmerId: firstNonEmptyString([report.mediaCompanyId, report.mediaCompany, selectionParts.programmerId]),
    }) ||
    buildWorkspaceDeeplinkSelectionKey({
      environmentKey: firstNonEmptyString([report.adobePassEnvironmentKey, report.environmentKey, selectionParts.environmentKey]),
      programmerId: firstNonEmptyString([report.mediaCompanyId, report.mediaCompany, selectionParts.programmerId]),
    });
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const columns = Array.isArray(report.columns)
    ? report.columns.map((value) => String(value || "").trim()).filter(Boolean)
    : rows.length > 0
      ? Object.keys(rows[0]).map((value) => String(value || "").trim()).filter(Boolean)
      : [];
  const requestorId = firstNonEmptyString([report.requestorId, report.programmerId, selectionParts.requestorId]);
  const mvpd = firstNonEmptyString([report.mvpd, selectionParts.mvpd]);
  const includeAllMvpd = report?.includeAllMvpd === true || !mvpd;
  const normalized = {
    ...report,
    reportId: String(report.reportId || "").trim(),
    queryKey: String(report.queryKey || report.reportId || "").trim(),
    runGroupId: String(report.runGroupId || "").trim(),
    endpointTitle: String(report.endpointTitle || report.endpointPath || "DEGRADATION Status").trim(),
    requestorId,
    programmerId: String(report.programmerId || requestorId).trim(),
    mediaCompanyId: firstNonEmptyString([report.mediaCompanyId, report.mediaCompany, selectionParts.programmerId]),
    mediaCompanyName: String(report.mediaCompanyName || report.mediaCompanyLabel || report.programmerName || "").trim(),
    mvpd,
    includeAllMvpd,
    mvpdLabel: String(report.mvpdLabel || "").trim(),
    mvpdScopeLabel: firstNonEmptyString([
      report.mvpdScopeLabel,
      includeAllMvpd ? "ALL MVPDs" : "",
      report.mvpdLabel,
      mvpd,
    ]),
    requestUrl: String(report.requestUrl || "").trim(),
    statusText: String(report.statusText || "").trim(),
    error: String(report.error || "").trim(),
    adobePassEnvironmentKey: firstNonEmptyString([
      report.adobePassEnvironmentKey,
      report.environmentKey,
      selectionParts.environmentKey,
    ]),
    adobePassEnvironmentLabel: String(report.adobePassEnvironmentLabel || report.environmentLabel || "").trim(),
    columns,
    rows,
    rowCount: Number(report.rowCount || rows.length || 0),
    activeCount: Number(report.activeCount || 0),
    status: Number(report.status || 0),
    fetchedAt: Number(report.fetchedAt || 0),
    durationMs: Number(report.durationMs || 0),
    ok: report.ok === true,
    selectionKey,
    apiVersion: String(report.apiVersion || "").trim(),
  };
  return normalized;
}

function normalizeReports(reportList = []) {
  return (Array.isArray(reportList) ? reportList : [])
    .map((item) => normalizeReport(item))
    .filter(Boolean)
    .sort((left, right) => Number(right.fetchedAt || 0) - Number(left.fetchedAt || 0));
}

function normalizeCheatSheetCall(call = null) {
  if (!call || typeof call !== "object") {
    return null;
  }
  return {
    key: String(call.key || "").trim(),
    title: String(call.title || call.path || "DEGRADATION Call").trim(),
    method: String(call.method || "GET").trim().toUpperCase() || "GET",
    path: String(call.path || "").trim(),
    requestUrl: String(call.requestUrl || "").trim(),
    command: String(call.command || "").trim(),
    mutation: call.mutation === true,
  };
}

function normalizeCheatSheet(payload = null) {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const rawSelectionKey = String(payload.selectionKey || "").trim();
  const selectionParts = parseWorkspaceSelectionKey(rawSelectionKey);
  const selectionKey =
    normalizeWorkspaceSelectionKey(rawSelectionKey, {
      environmentKey: firstNonEmptyString([payload.adobePassEnvironmentKey, payload.environmentKey, selectionParts.environmentKey]),
      programmerId: firstNonEmptyString([payload.programmerId, payload.mediaCompanyId, selectionParts.programmerId]),
    }) ||
    buildWorkspaceDeeplinkSelectionKey({
      environmentKey: firstNonEmptyString([payload.adobePassEnvironmentKey, payload.environmentKey, selectionParts.environmentKey]),
      programmerId: firstNonEmptyString([payload.programmerId, payload.mediaCompanyId, selectionParts.programmerId]),
    });
  const calls = (Array.isArray(payload.calls) ? payload.calls : [])
    .map((call) => normalizeCheatSheetCall(call))
    .filter(Boolean);
  const requestorId = firstNonEmptyString([payload.requestorId, selectionParts.requestorId]);
  const mvpd = firstNonEmptyString([payload.mvpd, selectionParts.mvpd]);
  const generatedAt = Math.max(0, Number(payload.generatedAt || Date.now() || 0));
  return {
    cheatSheetId: String(payload.cheatSheetId || [selectionKey, String(generatedAt || Date.now())].filter(Boolean).join("::")).trim(),
    selectionKey,
    title: String(payload.title || "DEGRADATION Cheat Sheet").trim(),
    description: String(payload.description || "").trim(),
    programmerId: firstNonEmptyString([payload.programmerId, selectionParts.programmerId]),
    programmerLabel: String(payload.programmerLabel || payload.mediaCompanyName || payload.programmerId || "").trim(),
    environmentLabel: String(payload.environmentLabel || payload.adobePassEnvironmentLabel || selectionParts.environmentKey || "").trim(),
    requestorId,
    mvpd,
    mvpdLabel: String(payload.mvpdLabel || mvpd).trim(),
    appName: String(payload.appName || "").trim(),
    appGuid: String(payload.appGuid || "").trim(),
    ttlSeconds: Math.max(0, Number(payload.ttlSeconds || 0)),
    message: String(payload.message || "").trim(),
    resource: String(payload.resource || "").trim(),
    resourceSource: String(payload.resourceSource || "").trim(),
    channel: String(payload.channel || "").trim(),
    channelSource: String(payload.channelSource || "").trim(),
    generatedAt,
    generatedAtLabel: String(payload.generatedAtLabel || (generatedAt > 0 ? new Date(generatedAt).toLocaleString() : "")).trim(),
    tokenExpiresLabel: String(payload.tokenExpiresLabel || "unknown").trim(),
    liveRowCount: Math.max(0, Number(payload.liveRowCount || 0)),
    callCount: Math.max(0, Number(payload.callCount || calls.length || 0)),
    tokenSetupScript: String(payload.tokenSetupScript || "").trim(),
    masterCopyText: String(payload.masterCopyText || "").trim(),
    setupItems: (Array.isArray(payload.setupItems) ? payload.setupItems : []).map((item) => String(item || "").trim()).filter(Boolean),
    calls,
  };
}

function normalizeCheatSheets(list = []) {
  return (Array.isArray(list) ? list : [])
    .map((item) => normalizeCheatSheet(item))
    .filter(Boolean)
    .sort((left, right) => Number(right.generatedAt || 0) - Number(left.generatedAt || 0));
}

function getReportIdentity(report = null) {
  return firstNonEmptyString([report?.queryKey, report?.reportId]);
}

function getReportPayload(report = null) {
  if (!report || typeof report !== "object") {
    return null;
  }
  const selectionParts = parseWorkspaceSelectionKey(report.selectionKey);
  const requestorId = firstNonEmptyString([report.requestorId, report.programmerId, selectionParts.requestorId, state.requestorId]);
  const mvpd = firstNonEmptyString([report.mvpd, selectionParts.mvpd]);
  const includeAllMvpd = report?.includeAllMvpd === true || !mvpd;
  return {
    reportId: String(report.reportId || "").trim(),
    queryKey: String(report.queryKey || "").trim(),
    runGroupId: String(report.runGroupId || "").trim(),
    endpointKey: String(report.endpointKey || "").trim().toLowerCase(),
    endpointPath: String(report.endpointPath || "").trim(),
    requestUrl: String(report.requestUrl || "").trim(),
    programmerId: String(report.programmerId || requestorId).trim(),
    requestorId,
    mediaCompanyId: firstNonEmptyString([report.mediaCompanyId, selectionParts.programmerId]),
    mediaCompanyName: String(report.mediaCompanyName || "").trim(),
    mvpd,
    mvpdLabel: String(report.mvpdLabel || "").trim(),
    mvpdScopeLabel: firstNonEmptyString([report.mvpdScopeLabel, includeAllMvpd ? "ALL MVPDs" : "", mvpd]),
    includeAllMvpd,
    adobePassEnvironmentKey: firstNonEmptyString([report.adobePassEnvironmentKey, selectionParts.environmentKey]),
    adobePassEnvironmentLabel: String(report.adobePassEnvironmentLabel || "").trim(),
    selectionKey: normalizeWorkspaceSelectionKey(report.selectionKey || state.selectionKey, {
      environmentKey: firstNonEmptyString([report.adobePassEnvironmentKey, selectionParts.environmentKey]),
      programmerId: firstNonEmptyString([report.mediaCompanyId, selectionParts.programmerId]),
    }),
  };
}

function setStatus(message = "", type = "info") {
  if (!els.status) {
    return;
  }
  const text = String(message || "").trim();
  els.status.textContent = text;
  els.status.classList.toggle("success", type === "success");
  els.status.classList.toggle("error", type === "error");
}

async function copyTextToClipboard(text = "") {
  const normalized = String(text || "");
  if (!normalized) {
    return false;
  }

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(normalized);
      return true;
    } catch {
      // continue to fallback
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = normalized;
  textArea.setAttribute("readonly", "readonly");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    textArea.remove();
  }
  return copied;
}

function findReportById(reportId = "") {
  const normalizedId = String(reportId || "").trim();
  if (!normalizedId) {
    return null;
  }
  return state.reports.find((report) => String(report?.reportId || "").trim() === normalizedId) || null;
}

async function copyReportRequestUrl(reportId = "") {
  const report = findReportById(reportId);
  if (!report) {
    return;
  }
  const requestUrl = firstNonEmptyString([report.requestUrl]);
  if (!requestUrl) {
    setStatus("Request URL unavailable for copy.", "error");
    return;
  }
  const copied = await copyTextToClipboard(requestUrl);
  if (copied) {
    setStatus("DEGRADATION request URL copied.", "success");
  } else {
    setStatus("Unable to copy DEGRADATION request URL.", "error");
  }
}

function findCheatSheetById(cheatSheetId = "") {
  const normalizedId = String(cheatSheetId || "").trim();
  if (!normalizedId) {
    return null;
  }
  return state.cheatSheets.find((cheatSheet) => String(cheatSheet?.cheatSheetId || "").trim() === normalizedId) || null;
}

function findCheatSheetCall(cheatSheetId = "", callKey = "") {
  const cheatSheet = findCheatSheetById(cheatSheetId);
  if (!cheatSheet) {
    return null;
  }
  const normalizedCallKey = String(callKey || "").trim().toLowerCase();
  return (
    (Array.isArray(cheatSheet.calls) ? cheatSheet.calls : []).find(
      (call) => String(call?.key || "").trim().toLowerCase() === normalizedCallKey
    ) || null
  );
}

async function copyCheatSheetAllCommands(cheatSheetId = "") {
  const cheatSheet = findCheatSheetById(cheatSheetId);
  if (!cheatSheet) {
    setStatus("Cheat sheet is unavailable.", "error");
    return;
  }
  const combined =
    String(cheatSheet.masterCopyText || "").trim() ||
    (Array.isArray(cheatSheet.calls) ? cheatSheet.calls : [])
      .map((call) => String(call?.command || "").trim())
      .filter(Boolean)
      .join("\n\n");
  const copied = await copyTextToClipboard(combined);
  if (copied) {
    setStatus("Copied the full DEGRADATION setup and command chain.", "success");
  } else {
    setStatus("Unable to copy the DEGRADATION cheat sheet.", "error");
  }
}

async function copyCheatSheetCommand(cheatSheetId = "", callKey = "") {
  const call = findCheatSheetCall(cheatSheetId, callKey);
  if (!call) {
    setStatus("Cheat-sheet command is unavailable.", "error");
    return;
  }
  const copied = await copyTextToClipboard(String(call.command || "").trim());
  if (copied) {
    setStatus(`${call.method} ${call.path} copied to clipboard.`, "success");
  } else {
    setStatus("Unable to copy the DEGRADATION command.", "error");
  }
}

async function copyCheatSheetUrl(cheatSheetId = "", callKey = "") {
  const call = findCheatSheetCall(cheatSheetId, callKey);
  if (!call) {
    setStatus("Cheat-sheet URL is unavailable.", "error");
    return;
  }
  const copied = await copyTextToClipboard(String(call.requestUrl || "").trim());
  if (copied) {
    setStatus(`${call.method} request URL copied.`, "success");
  } else {
    setStatus("Unable to copy the DEGRADATION request URL.", "error");
  }
}

function syncActionButtonsDisabled() {
  const hasReports = state.reports.length > 0;
  const hasCards = hasReports || state.cheatSheets.length > 0;
  const isBusy = state.batchRunning === true;
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isBusy || !hasReports;
    els.rerunAllButton.classList.toggle("net-busy", isBusy);
    els.rerunAllButton.setAttribute("aria-busy", isBusy ? "true" : "false");
    els.rerunAllButton.title = isBusy ? "Re-run all (loading...)" : "Re-run all";
  }
  if (els.rerunIndicator) {
    els.rerunIndicator.hidden = !isBusy;
  }
  if (els.clearButton) {
    els.clearButton.disabled = isBusy || !hasCards;
  }
}

function canUseBlondieButton() {
  return state.slackReady === true;
}

function getBlondieButtonDefaultState() {
  return canUseBlondieButton() ? "ready" : "inactive";
}

function clearBlondieButtonAckReset(button) {
  const timerId = blondieAckResetTimerByButton.get(button);
  if (timerId) {
    window.clearTimeout(timerId);
    blondieAckResetTimerByButton.delete(button);
  }
}

function getBlondieButtonState(button = null) {
  const stateValue = String(button?.dataset?.blondieState || "").trim().toLowerCase();
  return BLONDIE_BUTTON_STATES.has(stateValue) ? stateValue : getBlondieButtonDefaultState();
}

function normalizeBlondieShareTargets(value = null) {
  return UNDERPAR_BLONDIE_SHARE_PICKER.normalizeTargets(value);
}

function hasBlondieShareTargets() {
  return Array.isArray(state.slackShareTargets) && state.slackShareTargets.length > 0;
}

function isBlondieSharePickerOpen() {
  return blondieSharePickerController.isOpen();
}

function closeBlondieSharePicker() {
  blondieSharePickerController.close();
}

function openBlondieSharePicker(anchorButton, onSelect) {
  blondieSharePickerController.open({
    anchorButton,
    onSelect,
    selfUserId: state.slackUserId,
    targets: state.slackShareTargets,
  });
}

function getBlondieButtonTitle(buttonState = "", button = null) {
  const normalizedState = BLONDIE_BUTTON_STATES.has(String(buttonState || "").trim().toLowerCase())
    ? String(buttonState || "").trim().toLowerCase()
    : getBlondieButtonDefaultState();
  const receiptHover = String(button?.dataset?.receiptHover || "").trim();
  if (normalizedState !== "inactive" && receiptHover) {
    return receiptHover;
  }
  if (normalizedState === "active") {
    return ":blondiebtn: is delivering your Slack CSV...";
  }
  if (normalizedState === "ack") {
    return "Slack acknowledged :blondiebtn: delivery.";
  }
  if (canUseBlondieButton()) {
    return hasBlondieShareTargets()
      ? "Click sends to you. Shift-click picks a pass-transition teammate."
      : "Click sends to you. Re-SLACKTIVATE UnderPAR in the VAULT to load pass-transition teammates.";
  }
  return BLONDIE_BUTTON_INACTIVE_MESSAGE;
}

function renderBlondieButtonState(button, nextState = "", options = {}) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const preserveTimer = options?.preserveTimer === true;
  if (!preserveTimer) {
    clearBlondieButtonAckReset(button);
  }
  let normalizedState = String(nextState || "").trim().toLowerCase();
  if (!BLONDIE_BUTTON_STATES.has(normalizedState)) {
    normalizedState = getBlondieButtonDefaultState();
  }
  const title = getBlondieButtonTitle(normalizedState, button);
  button.dataset.blondieState = normalizedState;
  button.disabled = false;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.setAttribute("aria-busy", normalizedState === "active" ? "true" : "false");
  const icon = button.querySelector(".underpar-blondie-icon");
  if (icon instanceof HTMLImageElement) {
    icon.src = BLONDIE_BUTTON_ICON_URLS[normalizedState] || BLONDIE_BUTTON_ICON_URLS.inactive;
  }
}

function queueBlondieButtonAckReset(button) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  clearBlondieButtonAckReset(button);
  const timerId = window.setTimeout(() => {
    blondieAckResetTimerByButton.delete(button);
    renderBlondieButtonState(button, getBlondieButtonDefaultState());
  }, BLONDIE_BUTTON_ACK_RESET_MS);
  blondieAckResetTimerByButton.set(button, timerId);
}

function syncBlondieButtons(root = document) {
  if (!root?.querySelectorAll) {
    return;
  }
  root.querySelectorAll(".underpar-blondie-btn").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const currentState = getBlondieButtonState(button);
    if (!canUseBlondieButton()) {
      renderBlondieButtonState(button, "inactive");
      return;
    }
    if (currentState === "active" || currentState === "ack") {
      renderBlondieButtonState(button, currentState, { preserveTimer: true });
      return;
    }
    renderBlondieButtonState(button, "ready");
  });
}

function sanitizeCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function sanitizeFileNameSegment(value, fallback = "value") {
  const text = String(value || "")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return text || fallback;
}

function formatDegradationReportCellValue(rawValue) {
  if (rawValue == null) {
    return "N/A";
  }
  if (Array.isArray(rawValue)) {
    const compactValues = rawValue.map((item) => formatDegradationReportCellValue(item)).filter((item) => item && item !== "N/A");
    return compactValues.length > 0 ? compactValues.join(" | ") : "N/A";
  }
  if (typeof rawValue === "object") {
    const preferred = firstNonEmptyString([
      rawValue.id,
      rawValue.name,
      rawValue.label,
      rawValue.value,
      rawValue.status,
      rawValue.message,
    ]);
    return preferred || "Structured value";
  }
  const text = String(rawValue).trim();
  if (!text) {
    return "N/A";
  }
  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]")) ||
    (text.startsWith("<") && text.endsWith(">"))
  ) {
    return "Structured value";
  }
  return text;
}

function buildDegradationReportCsvFileName(report = null) {
  const mediaCompany = sanitizeFileNameSegment(
    firstNonEmptyString([report?.mediaCompanyName, report?.mediaCompanyId, state.programmerName, state.programmerId]),
    "MediaCompany"
  );
  const endpoint = sanitizeFileNameSegment(firstNonEmptyString([report?.endpointKey, report?.endpointPath, report?.endpointTitle]), "dgr");
  const requestor = sanitizeFileNameSegment(firstNonEmptyString([report?.requestorId, report?.programmerId, state.requestorId]), "requestor");
  const scope = sanitizeFileNameSegment(report?.mvpd || "all-mvpds", "all-mvpds");
  const rawEnvironment = firstNonEmptyString([
    report?.adobePassEnvironmentLabel,
    report?.adobePassEnvironmentKey,
    report?.requestUrl,
    state.adobePassEnvironment?.degradationBase,
  ]).toLowerCase();
  const envTag = rawEnvironment.includes("staging") || rawEnvironment.includes("stage") ? "STAGE" : "PROD";
  const stamp = new Date(report?.fetchedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
  return `${mediaCompany}_clickDGR_${endpoint}_${requestor}_${scope}_${envTag}_${stamp}.csv`;
}

function triggerFileDownload(content, fileName, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

function downloadDegradationReportCsv(reportId = "") {
  const report = findReportById(reportId);
  if (!report || !report.ok) {
    return;
  }
  const columns = Array.isArray(report.columns) ? report.columns : [];
  const rows = Array.isArray(report.rows) ? report.rows : [];
  if (columns.length === 0 || rows.length === 0) {
    return;
  }
  const csvBody = [
    columns.map((column) => sanitizeCsvCell(column)).join(","),
    ...rows.map((row) => columns.map((column) => sanitizeCsvCell(formatDegradationReportCellValue(row?.[column]))).join(",")),
  ].join("\n");
  triggerFileDownload(csvBody, buildDegradationReportCsvFileName(report), "text/csv;charset=utf-8");
}

function getDegradationBlondieMediaCompanyLabel(report = null) {
  const name = String(report?.mediaCompanyName || "").trim();
  const id = firstNonEmptyString([report?.mediaCompanyId, state.programmerId]);
  if (name && id && name.toLowerCase() !== id.toLowerCase()) {
    return `${name} (${id})`;
  }
  return name || id || "N/A";
}

function buildDegradationBlondieScopeLabel(report = null) {
  const requestorId = firstNonEmptyString([report?.requestorId, report?.programmerId, state.requestorId, "N/A"]);
  const scopeLabel = firstNonEmptyString([
    report?.mvpdScopeLabel,
    report?.includeAllMvpd === true || !String(report?.mvpd || "").trim() ? "ALL MVPDs" : "",
    report?.mvpd,
    state.mvpdScopeLabel,
    "ALL MVPDs",
  ]);
  return `${getDegradationBlondieMediaCompanyLabel(report)} X ${requestorId} X ${scopeLabel}`;
}

function buildDegradationBlondieStatusSummary(report = null) {
  if (!report || typeof report !== "object") {
    return "";
  }
  const scopeLabel = buildDegradationBlondieScopeLabel(report);
  if (report.ok === true) {
    const activeCount = Math.max(0, Number(report.activeCount || report.rowCount || 0));
    if (Number(report.rowCount || 0) > 0) {
      return `${activeCount} active rule${activeCount === 1 ? "" : "s"} for ${scopeLabel}.`;
    }
    return `No rules active for ${scopeLabel}.`;
  }
  const httpLabel = Number(report.status || 0) > 0 ? `HTTP ${Number(report.status || 0)} ${String(report.statusText || "").trim()}`.trim() : "Request Error";
  const message = String(report.error || "Request failed.").trim() || "Request failed.";
  return `${httpLabel}: ${message}`;
}

function buildDegradationBlondieReportItem(report = null) {
  if (!report || typeof report !== "object") {
    return null;
  }
  const title = firstNonEmptyString([report.endpointTitle, report.endpointKey, report.endpointPath, "DEGRADATION Status"]);
  const summary = buildDegradationBlondieStatusSummary(report);
  if (!title || !summary) {
    return null;
  }
  return {
    title,
    summary,
    requestUrl: String(report.requestUrl || "").trim(),
    endpointKey: String(report.endpointKey || "").trim().toLowerCase(),
    endpointPath: String(report.endpointPath || "").trim(),
    fetchedAt: Math.max(0, Number(report.fetchedAt || 0)),
    rowCount: Math.max(0, Number(report.rowCount || 0)),
    activeCount: Math.max(0, Number(report.activeCount || 0)),
    ok: report.ok === true,
    status: Math.max(0, Number(report.status || 0)),
    statusText: String(report.statusText || "").trim(),
    error: String(report.error || "").trim(),
  };
}

function getDegradationReportGroupId(report = null) {
  return firstNonEmptyString([report?.runGroupId, report?.reportId]);
}

function buildDegradationReportGroups(reportList = state.reports) {
  const groups = [];
  const groupMap = new Map();
  const reports = normalizeReports(reportList);
  reports.forEach((report) => {
    const groupId = getDegradationReportGroupId(report);
    if (!groupId) {
      return;
    }
    let group = groupMap.get(groupId);
    if (!group) {
      group = {
        groupId,
        reports: [],
        latestFetchedAt: Number(report?.fetchedAt || 0),
      };
      groupMap.set(groupId, group);
      groups.push(group);
    }
    group.reports.push(report);
    group.latestFetchedAt = Math.max(group.latestFetchedAt, Number(report?.fetchedAt || 0));
  });
  return groups
    .map((group) => {
      const reportsInGroup = Array.isArray(group.reports) ? group.reports.slice() : [];
      const firstReport = reportsInGroup[0] || null;
      const endpointKeys = [...new Set(reportsInGroup.map((report) => String(report?.endpointKey || "").trim().toLowerCase()).filter(Boolean))];
      const includeAllMvpd = firstReport?.includeAllMvpd === true || !String(firstReport?.mvpd || "").trim();
      return {
        groupId: group.groupId,
        reports: reportsInGroup,
        firstReport,
        endpointKeys,
        requestLabel:
          endpointKeys.length > 1
            ? "GET ALL"
            : firstNonEmptyString([firstReport?.endpointTitle, firstReport?.endpointKey, firstReport?.endpointPath, "DEGRADATION Status"]),
        reportCount: reportsInGroup.length,
        latestFetchedAt: group.latestFetchedAt,
        scopeLabel: buildDegradationBlondieScopeLabel(firstReport),
        environmentKey: firstNonEmptyString([firstReport?.adobePassEnvironmentKey]),
        environmentLabel: firstNonEmptyString([firstReport?.adobePassEnvironmentLabel, firstReport?.adobePassEnvironmentKey]),
        selectionKey: normalizeWorkspaceSelectionKey(firstReport?.selectionKey, {
          environmentKey: firstNonEmptyString([firstReport?.adobePassEnvironmentKey]),
          programmerId: firstNonEmptyString([firstReport?.mediaCompanyId]),
        }),
        requestorId: firstNonEmptyString([firstReport?.requestorId, firstReport?.programmerId]),
        mediaCompanyId: String(firstReport?.mediaCompanyId || "").trim(),
        mediaCompanyName: String(firstReport?.mediaCompanyName || "").trim(),
        mvpd: includeAllMvpd ? "" : String(firstReport?.mvpd || "").trim(),
        mvpdLabel: String(firstReport?.mvpdLabel || "").trim(),
        mvpdScopeLabel: firstNonEmptyString([
          firstReport?.mvpdScopeLabel,
          includeAllMvpd ? "ALL MVPDs" : "",
          firstReport?.mvpd,
          "ALL MVPDs",
        ]),
        includeAllMvpd,
      };
    })
    .sort((left, right) => Number(right.latestFetchedAt || 0) - Number(left.latestFetchedAt || 0));
}

function getWorkspaceFeedItemSortTime(item = null) {
  if (!item || typeof item !== "object") {
    return 0;
  }
  return Math.max(0, Number(item.sortTime || item.generatedAt || item.latestFetchedAt || item.fetchedAt || 0));
}

function buildWorkspaceFeedMarkup() {
  const timelineItems = [];
  normalizeCheatSheets(state.cheatSheets).forEach((cheatSheet) => {
    timelineItems.push({
      type: "cheat-sheet",
      sortTime: Number(cheatSheet?.generatedAt || 0),
      markup: renderCheatSheetCard(cheatSheet),
    });
  });
  buildDegradationReportGroups(state.reports).forEach((group) => {
    timelineItems.push({
      type: "report-group",
      sortTime: Number(group?.latestFetchedAt || 0),
      markup: renderReportGroup(group),
    });
  });
  return timelineItems
    .sort((left, right) => getWorkspaceFeedItemSortTime(right) - getWorkspaceFeedItemSortTime(left))
    .map((item) => item.markup)
    .join("");
}

function workspacePayloadMatchesSelection(selectionKey = "") {
  const expectedSelectionKey = normalizeWorkspaceSelectionKey(state.selectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  const payloadSelectionKey = normalizeWorkspaceSelectionKey(selectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
  });
  if (!expectedSelectionKey || !payloadSelectionKey) {
    return true;
  }
  return expectedSelectionKey === payloadSelectionKey;
}

function resetWorkspaceCardsForSelection(nextSelectionKey = "") {
  const normalizedSelectionKey = normalizeWorkspaceSelectionKey(nextSelectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  state.cheatSheetLoading = false;
  state.cheatSheetLoadingMessage = "";
  if (!normalizedSelectionKey) {
    state.cheatSheets = [];
    state.reports = [];
    return;
  }
  state.cheatSheets = normalizeCheatSheets(
    state.cheatSheets.filter(
      (cheatSheet) =>
        normalizeWorkspaceSelectionKey(cheatSheet?.selectionKey, {
          environmentKey: firstNonEmptyString([cheatSheet?.adobePassEnvironmentKey, cheatSheet?.environmentKey]),
          programmerId: firstNonEmptyString([cheatSheet?.programmerId, cheatSheet?.mediaCompanyId]),
        }) === normalizedSelectionKey
    )
  );
  state.reports = normalizeReports(
    state.reports.filter(
      (report) =>
        normalizeWorkspaceSelectionKey(report?.selectionKey, {
          environmentKey: firstNonEmptyString([report?.adobePassEnvironmentKey, report?.environmentKey]),
          programmerId: firstNonEmptyString([report?.mediaCompanyId, report?.mediaCompany]),
        }) === normalizedSelectionKey
    )
  );
}

function getDegradationReportGroup(groupId = "", reportList = state.reports) {
  const normalizedGroupId = String(groupId || "").trim();
  if (!normalizedGroupId) {
    return null;
  }
  return buildDegradationReportGroups(reportList).find((group) => String(group?.groupId || "").trim() === normalizedGroupId) || null;
}

function buildDegradationBlondieGroupExportPayload(groupId = "", reportList = state.reports) {
  const group = getDegradationReportGroup(groupId, reportList);
  if (!group) {
    return null;
  }
  const reports = Array.isArray(group.reports) ? group.reports : [];
  const reportItems = reports.map((report) => buildDegradationBlondieReportItem(report)).filter(Boolean);
  if (reportItems.length === 0) {
    return null;
  }
  const firstReport = group.firstReport || reports[0] || null;
  const requestorId = firstNonEmptyString([group.requestorId, firstReport?.requestorId, firstReport?.programmerId, ""]);
  const mvpd = String(group.mvpd || firstReport?.mvpd || "").trim();
  const includeAllMvpd = group.includeAllMvpd === true || !mvpd;
  const endpointKeys = Array.isArray(group.endpointKeys) ? group.endpointKeys : [];
  const mediaCompanyId = String(group.mediaCompanyId || firstReport?.mediaCompanyId || "").trim();
  const mediaCompanyName = String(group.mediaCompanyName || firstReport?.mediaCompanyName || "").trim();
  const environmentKey = firstNonEmptyString([group.environmentKey, getEnvironmentKey(state.adobePassEnvironment), "release-production"]);
  const environmentLabel = firstNonEmptyString([group.environmentLabel, firstReport?.adobePassEnvironmentLabel]);
  const mvpdScopeLabel = firstNonEmptyString([group.mvpdScopeLabel, includeAllMvpd ? "ALL MVPDs" : mvpd, "ALL MVPDs"]);
  const scopeReceiptLabel = `${getDegradationBlondieMediaCompanyLabel(firstReport)} X ${requestorId || "N/A"} X ${mvpdScopeLabel}`;
  const requestLabel = String(group.requestLabel || reportItems[0]?.title || "DEGRADATION Status").trim();
  const multiEndpoint = endpointKeys.length > 1;
  return {
    workspaceKey: "degradation",
    workspaceLabel: "DEGRADATION",
    displayNodeLabel: multiEndpoint ? "DEGRADATION GET ALL" : requestLabel,
    datasetLabel: `${multiEndpoint ? "DEGRADATION GET ALL" : requestLabel} | ${scopeReceiptLabel}`,
    requestLabel: multiEndpoint ? "GET ALL" : requestLabel,
    requestUrl: endpointKeys.length === 1 ? String(reportItems[0].requestUrl || firstReport?.requestUrl || "").trim() : "",
    programmerId: mediaCompanyId,
    programmerName: mediaCompanyName,
    requestorId,
    mvpd: includeAllMvpd ? "" : mvpd,
    mvpdLabel: String(group.mvpdLabel || firstReport?.mvpdLabel || "").trim(),
    mvpdScopeLabel,
    adobePassEnvironmentKey: environmentKey,
    adobePassEnvironmentLabel: environmentLabel,
    endpointKey: multiEndpoint ? "all" : endpointKeys[0] || "",
    endpointPath: multiEndpoint ? "all" : endpointKeys[0] || "",
    endpointKeys,
    includeAllMvpd,
    selectionKey:
      normalizeWorkspaceSelectionKey(group.selectionKey || firstReport?.selectionKey, {
        environmentKey,
        programmerId: mediaCompanyId,
      }) ||
      buildWorkspaceDeeplinkSelectionKey({
        environmentKey,
        programmerId: mediaCompanyId,
      }),
    messageOnly: true,
    skipCsvAttachment: true,
    reportCount: reportItems.length,
    reportItems,
    columns: [],
    rows: [],
    rowCount: reports.reduce((count, report) => count + Math.max(0, Number(report?.rowCount || 0)), 0),
    responseReceivedAt: Math.max(0, Number(group.latestFetchedAt || 0)),
    createdAt: Math.max(0, Number(group.latestFetchedAt || Date.now() || 0)),
  };
}

function renderCheatSheetCallCard(cheatSheet = null, call = null) {
  if (!cheatSheet || !call) {
    return "";
  }
  const methodClass = call.mutation
    ? "degradation-cheat-method-pill degradation-cheat-method-pill--mutating"
    : "degradation-cheat-method-pill degradation-cheat-method-pill--readonly";
  return `
    <article class="degradation-cheat-call-card">
      <header class="degradation-cheat-call-head">
        <div class="degradation-cheat-call-title-wrap">
          <span class="${methodClass}">${escapeHtml(call.method)}</span>
          <p class="degradation-cheat-call-title">${escapeHtml(call.title)}</p>
          <p class="degradation-cheat-call-path">/${escapeHtml(call.path)}</p>
        </div>
        <div class="degradation-cheat-call-actions">
          <button
            type="button"
            class="degradation-cheat-action-btn"
            data-action="copy-cheat-command"
            data-cheat-sheet-id="${escapeHtml(String(cheatSheet.cheatSheetId || ""))}"
            data-call-key="${escapeHtml(String(call.key || ""))}"
            title="Copy DEGRADATION cURL to clipboard"
            aria-label="Copy DEGRADATION cURL to clipboard"
          >Copy to Clipboard</button>
          <button
            type="button"
            class="degradation-cheat-action-btn degradation-cheat-action-btn--secondary"
            data-action="copy-cheat-url"
            data-cheat-sheet-id="${escapeHtml(String(cheatSheet.cheatSheetId || ""))}"
            data-call-key="${escapeHtml(String(call.key || ""))}"
            title="Copy DEGRADATION request URL to clipboard"
            aria-label="Copy DEGRADATION request URL to clipboard"
          >Copy URL</button>
        </div>
      </header>
      <p class="degradation-cheat-call-url">${escapeHtml(call.requestUrl)}</p>
      <pre class="degradation-cheat-command-block">${escapeHtml(call.command)}</pre>
    </article>
  `;
}

function renderCheatSheetCard(cheatSheet = null) {
  if (!cheatSheet || typeof cheatSheet !== "object") {
    return "";
  }
  const setupItems = Array.isArray(cheatSheet.setupItems) ? cheatSheet.setupItems : [];
  const tokenSetupScript = String(cheatSheet.tokenSetupScript || "").trim();
  const callsMarkup = (Array.isArray(cheatSheet.calls) ? cheatSheet.calls : [])
    .map((call) => renderCheatSheetCallCard(cheatSheet, call))
    .join("");
  return `
    <section class="degradation-cheat-sheet-card" data-cheat-sheet-id="${escapeHtml(String(cheatSheet.cheatSheetId || ""))}">
      <header class="degradation-cheat-sheet-head">
        <div class="degradation-cheat-sheet-title-row">
          <div class="degradation-cheat-sheet-title-wrap">
            <p class="degradation-cheat-sheet-kicker">DEGRADATION Cheat Sheet</p>
            <h2 class="degradation-cheat-sheet-title">${escapeHtml(cheatSheet.title || "DEGRADATION Cheat Sheet")}</h2>
            <p class="degradation-cheat-sheet-description">${escapeHtml(cheatSheet.description || "")}</p>
          </div>
          <div class="degradation-cheat-sheet-head-actions">
            <button
              type="button"
              class="degradation-cheat-action-btn"
              data-action="copy-cheat-all"
              data-cheat-sheet-id="${escapeHtml(String(cheatSheet.cheatSheetId || ""))}"
              title="Copy the full DEGRADATION setup and command chain to clipboard"
              aria-label="Copy the full DEGRADATION setup and command chain to clipboard"
            >Copy to Clipboard</button>
          </div>
        </div>
        <div class="degradation-cheat-meta-grid">
          <div class="degradation-cheat-meta-card"><span class="degradation-cheat-meta-label">Environment</span><span class="degradation-cheat-meta-value">${escapeHtml(cheatSheet.environmentLabel || "")}</span></div>
          <div class="degradation-cheat-meta-card"><span class="degradation-cheat-meta-label">Media Company</span><span class="degradation-cheat-meta-value">${escapeHtml(cheatSheet.programmerLabel || "")}</span></div>
          <div class="degradation-cheat-meta-card"><span class="degradation-cheat-meta-label">Requestor x MVPD</span><span class="degradation-cheat-meta-value">${escapeHtml(`${String(cheatSheet.requestorId || "").trim()} x ${String(cheatSheet.mvpdLabel || cheatSheet.mvpd || "").trim()}`)}</span></div>
          <div class="degradation-cheat-meta-card"><span class="degradation-cheat-meta-label">Token Freshness</span><span class="degradation-cheat-meta-value">${escapeHtml(`${String(cheatSheet.generatedAtLabel || "").trim()} -> ${String(cheatSheet.tokenExpiresLabel || "unknown").trim()}`)}</span></div>
        </div>
      </header>
      <section class="degradation-cheat-setup-shell">
        <p class="degradation-cheat-setup-kicker">Prerequisite Setup</p>
        <ol class="degradation-cheat-setup-list">
          ${setupItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ol>
      </section>
      ${
        tokenSetupScript
          ? `<section class="degradation-cheat-setup-shell">
        <p class="degradation-cheat-setup-kicker">Fresh Token Bootstrap</p>
        <pre class="degradation-cheat-command-block">${escapeHtml(tokenSetupScript)}</pre>
      </section>`
          : ""
      }
      <section class="degradation-cheat-call-grid">
        ${callsMarkup}
      </section>
    </section>
  `;
}

function renderReportFooter(report = null) {
  if (!report || typeof report !== "object") {
    return "";
  }
  const reportIdAttr = escapeHtml(String(report.reportId || ""));
  const hasCsv = report.ok === true && Number(report.rowCount || 0) > 0;
  return `
    <footer class="degradation-report-footer">
      ${hasCsv ? `<div class="underpar-export-actions"><a class="degradation-report-csv-link" href="#" data-action="download-csv" data-report-id="${reportIdAttr}">CSV</a></div>` : ""}
      <div class="degradation-report-footer-controls">
        <p class="degradation-report-last-modified">Last modified: ${escapeHtml(new Date(report.fetchedAt || Date.now()).toLocaleString())}</p>
      </div>
    </footer>
  `;
}

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getFilterLabel() {
  const requestor = String(state.requestorId || "").trim();
  const mvpdScope = String(state.mvpdScopeLabel || "").trim() || "ALL MVPDs";
  return `Requestor: ${requestor || "N/A"} | Scope: ${mvpdScope}`;
}

function updateControllerBanner() {
  if (els.controllerState) {
    els.controllerState.textContent = `DEGRADATION Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.textContent = getFilterLabel();
  }
  renderWorkspaceEnvironmentBadge();
  syncActionButtonsDisabled();
}

function getCurrentRerunCards(reportList = state.reports) {
  return (Array.isArray(reportList) ? reportList : [])
    .map((report) => getReportPayload(report))
    .filter((card) => card && card.endpointKey);
}

function clearPendingAutoRerun() {
  state.pendingAutoRerunCards = [];
  state.pendingAutoRerunSelectionKey = "";
  state.autoRerunInFlightSelectionKey = "";
}

function hasWorkspaceRefreshTransition() {
  return state.pendingAutoRerunCards.length > 0 || Boolean(String(state.autoRerunInFlightSelectionKey || "").trim());
}

function queuePendingAutoRerun(nextSelectionKey = "") {
  const cards = getCurrentRerunCards();
  if (cards.length === 0) {
    return false;
  }
  state.pendingAutoRerunCards = cards;
  state.pendingAutoRerunSelectionKey = normalizeWorkspaceSelectionKey(nextSelectionKey || state.selectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  const reportLabel = `${cards.length} report${cards.length === 1 ? "" : "s"}`;
  setStatus(`Refreshing ${reportLabel} for ${getProgrammerLabel()}...`);
  return true;
}

function maybeConsumePendingAutoRerun() {
  if (state.batchRunning || state.controllerOnline !== true || state.degradationReady !== true) {
    return;
  }
  const cards = Array.isArray(state.pendingAutoRerunCards)
    ? state.pendingAutoRerunCards.filter((card) => card && card.endpointKey)
    : [];
  if (cards.length === 0) {
    state.pendingAutoRerunCards = [];
    state.pendingAutoRerunSelectionKey = "";
    return;
  }
  const expectedSelectionKey = normalizeWorkspaceSelectionKey(state.pendingAutoRerunSelectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  const currentSelectionKey = normalizeWorkspaceSelectionKey(state.selectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  if (expectedSelectionKey && currentSelectionKey && expectedSelectionKey !== currentSelectionKey) {
    return;
  }
  const inFlightSelectionKey = expectedSelectionKey || currentSelectionKey;
  state.autoRerunInFlightSelectionKey = inFlightSelectionKey;
  void rerunAllCards({
    cards,
    reason: "manual-reload",
    selectionKey: expectedSelectionKey || currentSelectionKey,
  }).then((started) => {
    if (!started) {
      if (String(state.autoRerunInFlightSelectionKey || "").trim() === inFlightSelectionKey) {
        state.autoRerunInFlightSelectionKey = "";
      }
      return;
    }
    state.pendingAutoRerunCards = [];
    state.pendingAutoRerunSelectionKey = "";
  });
}

function buildPendingWorkspaceDeeplinkContextLabel(pending = null) {
  if (!pending || typeof pending !== "object") {
    return "";
  }
  const environmentLabel = firstNonEmptyString([pending.environmentLabel, pending.environmentKey]);
  const programmerLabel = firstNonEmptyString([pending.programmerName, pending.programmerId]);
  const requestorLabel = String(pending.requestorId || "").trim();
  const mvpdLabel = pending.includeAllMvpd === true ? "ALL MVPDs" : firstNonEmptyString([pending.mvpdLabel, pending.mvpd]);
  return [environmentLabel, programmerLabel, requestorLabel, mvpdLabel].filter(Boolean).join(" / ");
}

function buildPendingWorkspaceDeeplinkReportLabel(pending = null) {
  if (!pending || typeof pending !== "object") {
    return "the saved DEGRADATION request";
  }
  if (Array.isArray(pending.endpointKeys) && pending.endpointKeys.length > 1) {
    return firstNonEmptyString([pending.displayNodeLabel, "the saved DEGRADATION GET ALL request"]);
  }
  return firstNonEmptyString([pending.displayNodeLabel, pending.endpointKey, "the saved DEGRADATION request"]);
}

function buildPendingWorkspaceDeeplinkSetupMessage(pending = null) {
  const reportLabel = buildPendingWorkspaceDeeplinkReportLabel(pending);
  const contextLabel = buildPendingWorkspaceDeeplinkContextLabel(pending);
  if (contextLabel) {
    return `Restoring DEGRADATION for ${contextLabel} before rerunning ${reportLabel} from Slack.`;
  }
  return `Restoring DEGRADATION before rerunning ${reportLabel} from Slack.`;
}

async function maybeActivatePendingWorkspaceDeeplinkContext() {
  const pending = state.pendingWorkspaceDeeplink;
  if (!pending || !state.controllerOnline || state.pendingWorkspaceDeeplinkActivating) {
    return { ok: false, pending: true };
  }
  state.pendingWorkspaceDeeplinkActivating = true;
  try {
    return await sendWorkspaceAction("activate-deeplink-context", {
      deeplink: pending,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    state.pendingWorkspaceDeeplinkActivating = false;
  }
}

async function maybeConsumePendingWorkspaceDeeplink() {
  const pending = state.pendingWorkspaceDeeplink;
  if (!pending || state.pendingWorkspaceDeeplinkConsuming) {
    return;
  }
  if (!state.controllerOnline) {
    return;
  }
  if (!state.degradationReady || !String(state.programmerId || "").trim()) {
    const activationResult = await maybeActivatePendingWorkspaceDeeplinkContext();
    if (!activationResult?.ok) {
      setStatus(activationResult?.error || buildPendingWorkspaceDeeplinkSetupMessage(pending), activationResult?.error ? "error" : "info");
      return;
    }
    setStatus(buildPendingWorkspaceDeeplinkSetupMessage(pending), "info");
    return;
  }
  const currentSelectionKey =
    normalizeWorkspaceSelectionKey(state.selectionKey, {
      environmentKey: getEnvironmentKey(state.adobePassEnvironment),
      programmerId: state.programmerId,
    }) ||
    buildWorkspaceDeeplinkSelectionKey({
      environmentKey: getEnvironmentKey(state.adobePassEnvironment),
      programmerId: state.programmerId,
    });
  const expectedSelectionKey = normalizeWorkspaceSelectionKey(pending.selectionKey, {
    environmentKey: pending.environmentKey,
    programmerId: pending.programmerId,
  });
  if (expectedSelectionKey && currentSelectionKey !== expectedSelectionKey) {
    const activationResult = await maybeActivatePendingWorkspaceDeeplinkContext();
    if (!activationResult?.ok) {
      setStatus(activationResult?.error || buildPendingWorkspaceDeeplinkSetupMessage(pending), activationResult?.error ? "error" : "info");
      return;
    }
    setStatus(buildPendingWorkspaceDeeplinkSetupMessage(pending), "info");
    return;
  }

  state.pendingWorkspaceDeeplinkConsuming = true;
  try {
    const endpointKeys =
      Array.isArray(pending.endpointKeys) && pending.endpointKeys.length > 0
        ? pending.endpointKeys
        : [String(pending.endpointKey || "").trim().toLowerCase()].filter(Boolean);
    const started = await rerunAllCards({
      cards: endpointKeys.map((endpointKey, index) => ({
          reportId: "workspace-deeplink",
          queryKey: endpointKey || pending.endpointKey,
          endpointKey,
          endpointPath: index === 0 ? pending.endpointPath : "",
          requestUrl: pending.requestUrl,
          programmerId: pending.requestorId,
          requestorId: pending.requestorId,
          mvpd: pending.mvpd,
          includeAllMvpd: pending.includeAllMvpd === true || !pending.mvpd,
          selectionKey: expectedSelectionKey,
        })),
      reason: "workspace-deeplink",
      selectionKey: expectedSelectionKey,
    });
    if (!started) {
      return;
    }
    state.pendingWorkspaceDeeplink = null;
    clearWorkspaceDeeplinkFromLocation();
  } finally {
    state.pendingWorkspaceDeeplinkConsuming = false;
  }
}

function applyControllerState(payload = {}) {
  const previousSelectionKey = normalizeWorkspaceSelectionKey(state.selectionKey, {
    environmentKey: getEnvironmentKey(state.adobePassEnvironment),
    programmerId: state.programmerId,
  });
  const incomingSelectionKey = normalizeWorkspaceSelectionKey(payload?.selectionKey, {
    environmentKey: firstNonEmptyString([payload?.adobePassEnvironment?.key, payload?.environmentKey]),
    programmerId: payload?.programmerId,
  });
  const nextSelectionKey = incomingSelectionKey || previousSelectionKey;
  const nextEnvironment =
    payload?.adobePassEnvironment && typeof payload.adobePassEnvironment === "object"
      ? {
          ...payload.adobePassEnvironment,
        }
      : state.adobePassEnvironment;

  state.controllerOnline = payload?.controllerOnline === true;
  state.adobePassEnvironment = nextEnvironment;
  state.degradationReady = payload?.degradationReady === true;
  state.slackReady = payload?.slack?.ready === true;
  state.slackUserId = String(payload?.slack?.userId || "").trim().toUpperCase();
  state.slackUserName = String(payload?.slack?.userName || "").trim();
  state.slackShareTargets = normalizeBlondieShareTargets(payload?.slack?.shareTargets || []);
  if (!state.slackReady || state.slackShareTargets.length === 0) {
    closeBlondieSharePicker();
  }
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorId = String(payload?.requestorId || "");
  state.mvpd = String(payload?.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || "");
  state.mvpdScopeLabel = String(payload?.mvpdScopeLabel || "");
  state.selectionKey = nextSelectionKey;
  state.appGuid = String(payload?.appGuid || "");
  state.appName = String(payload?.appName || "");
  if (incomingSelectionKey && nextSelectionKey !== previousSelectionKey) {
    resetWorkspaceCardsForSelection(nextSelectionKey);
  }
  updateControllerBanner();
  if (incomingSelectionKey && nextSelectionKey !== previousSelectionKey) {
    renderWorkspaceCards();
  }
  syncBlondieButtons();
  syncActionButtonsDisabled();
  void maybeConsumePendingWorkspaceDeeplink();
}

function getScopeValues(report = null) {
  const requestor = firstNonEmptyString([report?.requestorId, report?.programmerId, state.requestorId, "N/A"]);
  const scope = firstNonEmptyString([report?.mvpdScopeLabel, report?.mvpd, state.mvpdScopeLabel, "ALL MVPDs"]);
  return {
    requestor,
    scope,
  };
}

function getNoRulesScopeLabel(report = null) {
  const { requestor, scope } = getScopeValues(report);
  return `${requestor} X ${scope}`;
}

function getNoRulesActiveMessage(report = null) {
  return `No rules active for ${getNoRulesScopeLabel(report)}.`;
}

function renderScopeEmphasisHtml(report = null) {
  const { requestor, scope } = getScopeValues(report);
  return `<span class="degradation-report-scope-value">${escapeHtml(requestor)}</span><span class="degradation-report-scope-sep"> X </span><span class="degradation-report-scope-value">${escapeHtml(scope)}</span>`;
}

function renderNoRulesCompactHtml(report = null) {
  const methodLabel = firstNonEmptyString([report?.endpointTitle, "DEGRADATION Status"]);
  return `${escapeHtml(methodLabel)}: No rules active for ${renderScopeEmphasisHtml(report)}.`;
}

function buildDegradationReceiptHoverText(group = null) {
  const capturedAt = new Date(group?.latestFetchedAt || Date.now()).toLocaleString();
  return `Slack receipt for this DEGRADATION run Captured ${capturedAt}`;
}

function renderTable(report = null) {
  const columns = Array.isArray(report?.columns) ? report.columns : [];
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  if (columns.length === 0 || rows.length === 0) {
    return `<p class="degradation-report-empty">${escapeHtml(getNoRulesActiveMessage(report))}</p>`;
  }

  const headerHtml = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");

  const bodyHtml = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const raw = row?.[column];
          const value = formatDegradationReportCellValue(raw);
          if (String(column).trim().toLowerCase() === "active") {
            const isActive = value.toUpperCase() === "YES";
            const pillClass = isActive ? "degradation-active-pill" : "degradation-active-pill no";
            const pillLabel = isActive ? "YES" : "NO";
            return `<td><span class="${pillClass}">${pillLabel}</span></td>`;
          }
          return `<td>${escapeHtml(value || "N/A")}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="degradation-report-table-wrap">
      <table class="degradation-report-table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
  `;
}

function renderReportCard(report = null) {
  if (!report || typeof report !== "object") {
    return "";
  }
  const requestLine = firstNonEmptyString([
    report.requestUrl,
    `${report.endpointPath || ""}${report.programmerId ? `?programmer=${report.programmerId}` : ""}`,
  ]);
  const statusTitle = `GET: ${requestLine || "N/A"}`;
  const footerMarkup = renderReportFooter(report);
  if (report.ok && Number(report.rowCount || 0) === 0) {
    return `
      <article class="degradation-report-card degradation-report-card--no-active">
        <p class="degradation-report-no-active-line">
          <button
            type="button"
            class="degradation-report-no-active-copy"
            data-action="copy-request-url"
            data-report-id="${escapeHtml(String(report.reportId || ""))}"
            title="${escapeHtml(statusTitle)}"
            aria-label="Copy DEGRADATION request URL to clipboard"
          >${renderNoRulesCompactHtml(report)}</button>
        </p>
        ${footerMarkup}
      </article>
    `;
  }
  const activeRules = Number(report.activeCount || report.rowCount || 0);
  const activeRuleLabel = `${activeRules} active rule${activeRules === 1 ? "" : "s"}`;
  const programmerScopeHtml = renderScopeEmphasisHtml(report);
  const httpLabel = report.status > 0 ? `HTTP ${report.status} ${report.statusText || ""}`.trim() : "Request Error";
  const errorMarkup = report.ok
    ? ""
    : `<p class="degradation-report-error">${escapeHtml(report.error || "Request failed.")}</p>`;
  return `
    <article class="degradation-report-card">
      <header class="degradation-report-head">
        <div class="degradation-report-title-row">
          <p class="degradation-report-title">${escapeHtml(report.endpointTitle || "DEGRADATION Status")}</p>
          <p class="degradation-report-http ${report.ok ? "" : "error"}">${escapeHtml(httpLabel)}</p>
        </div>
        <p class="degradation-report-subtitle">${programmerScopeHtml}</p>
        <p class="degradation-report-meta">${escapeHtml(report.ok ? activeRuleLabel : "Request failed")}</p>
      </header>
      ${errorMarkup}
      ${report.ok ? renderTable(report) : ""}
      ${footerMarkup}
    </article>
  `;
}

function renderResultGroupScopeHtml(group = null) {
  const mediaCompany = firstNonEmptyString([group?.mediaCompanyName, group?.mediaCompanyId, "N/A"]);
  const requestor = firstNonEmptyString([group?.requestorId, "N/A"]);
  const mvpdScope = firstNonEmptyString([group?.mvpdScopeLabel, group?.includeAllMvpd === true ? "ALL MVPDs" : "", group?.mvpd, "ALL MVPDs"]);
  return [
    `<span class="degradation-result-group-scope-value">${escapeHtml(mediaCompany)}</span>`,
    `<span class="degradation-result-group-scope-sep"> X </span>`,
    `<span class="degradation-result-group-scope-value">${escapeHtml(requestor)}</span>`,
    `<span class="degradation-result-group-scope-sep"> X </span>`,
    `<span class="degradation-result-group-scope-value">${escapeHtml(mvpdScope)}</span>`,
  ].join("");
}

function renderResultGroupBlondieButton(group = null) {
  const groupId = escapeHtml(String(group?.groupId || ""));
  const receiptHoverText = buildDegradationReceiptHoverText(group);
  const initialState = getBlondieButtonDefaultState();
  const title = getBlondieButtonTitle(initialState, {
    dataset: {
      receiptHover: receiptHoverText,
    },
  });
  const iconUrl = escapeHtml(BLONDIE_BUTTON_ICON_URLS[initialState] || BLONDIE_BUTTON_ICON_URLS.inactive);
  return `
    <button
      type="button"
      class="workspace-icon-btn workspace-icon-btn--blondie workspace-icon-btn--blondie-group underpar-blondie-btn"
      data-action="blondie-export-group"
      data-group-id="${groupId}"
      data-receipt-hover="${escapeHtml(receiptHoverText)}"
      data-blondie-state="${escapeHtml(initialState)}"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
    >
      <img class="underpar-blondie-icon underpar-blondie-icon--workspace" src="${iconUrl}" alt="" aria-hidden="true" />
    </button>
  `;
}

function renderReportGroup(group = null) {
  if (!group || typeof group !== "object") {
    return "";
  }
  const resultsLabel = `${Math.max(0, Number(group.reportCount || 0))} result${Number(group.reportCount || 0) === 1 ? "" : "s"}`;
  const environmentLabel = firstNonEmptyString([group.environmentLabel, group.environmentKey, "Unknown ENV"]);
  const timestampLabel = escapeHtml(new Date(group.latestFetchedAt || Date.now()).toLocaleString());
  const requestLabel = escapeHtml(String(group.requestLabel || "DEGRADATION Status"));
  const cardsMarkup = (Array.isArray(group.reports) ? group.reports : []).map((report) => renderReportCard(report)).join("");
  return `
    <section class="degradation-result-group" data-group-id="${escapeHtml(String(group.groupId || ""))}">
      <header class="degradation-result-group-head">
        <div class="degradation-result-group-title-row">
          <p class="degradation-result-group-title">${requestLabel}</p>
          <p class="degradation-result-group-count">${escapeHtml(resultsLabel)}</p>
        </div>
        <p class="degradation-result-group-scope">${renderResultGroupScopeHtml(group)}</p>
        <p class="degradation-result-group-meta">${escapeHtml(environmentLabel)} | ${timestampLabel}</p>
      </header>
      <div class="degradation-result-group-body">${cardsMarkup}</div>
      <footer class="degradation-result-group-footer">
        <div class="underpar-export-actions">${renderResultGroupBlondieButton(group)}</div>
      </footer>
    </section>
  `;
}

function renderWorkspaceCards() {
  if (!els.cardsHost) {
    return;
  }
  if (state.reports.length === 0 && state.cheatSheets.length === 0) {
    els.cardsHost.innerHTML = "";
    syncActionButtonsDisabled();
    return;
  }
  els.cardsHost.innerHTML = buildWorkspaceFeedMarkup();
  syncBlondieButtons(els.cardsHost);
  syncActionButtonsDisabled();
}

function replaceReports(reportList = []) {
  state.reports = normalizeReports(reportList);
  renderWorkspaceCards();
}

function replaceCheatSheets(cheatSheetList = []) {
  state.cheatSheets = normalizeCheatSheets(cheatSheetList);
  renderWorkspaceCards();
}

function upsertReport(report = null) {
  const normalized = normalizeReport(report);
  if (!normalized) {
    return;
  }
  const reportId = String(normalized.reportId || "").trim();
  const nextReports = [normalized];
  state.reports.forEach((existing) => {
    if (reportId && String(existing?.reportId || "").trim() === reportId) {
      return;
    }
    nextReports.push(existing);
  });
  state.reports = normalizeReports(nextReports).slice(0, DEGRADATION_WORKSPACE_MAX_REPORTS);
  if (normalized.selectionKey) {
    state.selectionKey = normalizeWorkspaceSelectionKey(normalized.selectionKey, {
      environmentKey: firstNonEmptyString([normalized.adobePassEnvironmentKey, normalized.environmentKey]),
      programmerId: firstNonEmptyString([normalized.mediaCompanyId, normalized.mediaCompany]),
    });
  }
  renderWorkspaceCards();
}

function upsertCheatSheet(cheatSheet = null) {
  const normalized = normalizeCheatSheet(cheatSheet);
  if (!normalized) {
    return;
  }
  const cheatSheetId = String(normalized.cheatSheetId || "").trim();
  const nextCheatSheets = [normalized];
  state.cheatSheets.forEach((existing) => {
    if (cheatSheetId && String(existing?.cheatSheetId || "").trim() === cheatSheetId) {
      return;
    }
    nextCheatSheets.push(existing);
  });
  state.cheatSheets = normalizeCheatSheets(nextCheatSheets).slice(0, 20);
  if (normalized.selectionKey) {
    state.selectionKey = normalizeWorkspaceSelectionKey(normalized.selectionKey, {
      environmentKey: firstNonEmptyString([normalized.adobePassEnvironmentKey, normalized.environmentKey]),
      programmerId: firstNonEmptyString([normalized.programmerId, normalized.mediaCompanyId]),
    });
  }
  renderWorkspaceCards();
}

function clearWorkspaceCards() {
  state.cheatSheetLoading = false;
  state.cheatSheetLoadingMessage = "";
  state.cheatSheets = [];
  state.reports = [];
  renderWorkspaceCards();
}

function handleReportsSync(payload = {}) {
  const reports = normalizeReports(payload?.reports);
  const cheatSheets = normalizeCheatSheets(payload?.cheatSheets);
  const selectionKey = normalizeWorkspaceSelectionKey(payload?.selectionKey, {
    environmentKey: firstNonEmptyString([payload?.adobePassEnvironment?.key, payload?.environmentKey]),
    programmerId: firstNonEmptyString([
      payload?.programmerId,
      reports[0]?.mediaCompanyId,
      cheatSheets[0]?.programmerId,
      state.programmerId,
    ]),
  });
  const cheatSheetPending = payload?.cheatSheetPending === true;
  const cheatSheetLoadingMessage = String(payload?.cheatSheetLoadingMessage || "").trim();
  if (selectionKey) {
    state.selectionKey = selectionKey;
  }
  state.cheatSheetLoading = cheatSheetPending;
  state.cheatSheetLoadingMessage = cheatSheetPending
    ? cheatSheetLoadingMessage || state.cheatSheetLoadingMessage || "Generating DEGRADATION Cheat Sheet..."
    : "";
  state.reports = reports;
  state.cheatSheets = cheatSheets;
  renderWorkspaceCards();
  if (reports.length > 0 || cheatSheets.length > 0) {
    const parts = [];
    if (cheatSheets.length > 0) {
      parts.push(`${cheatSheets.length} cheat sheet${cheatSheets.length === 1 ? "" : "s"}`);
    }
    if (reports.length > 0) {
      parts.push(`${reports.length} DEGRADATION report${reports.length === 1 ? "" : "s"}`);
    }
    setStatus(`Loaded ${parts.join(" and ")} in workspace.`, "success");
  } else if (state.cheatSheetLoading === true) {
    setStatus(state.cheatSheetLoadingMessage || "Generating DEGRADATION Cheat Sheet...", "info");
  } else {
    setStatus("No DEGRADATION reports or cheat sheets are cached in this workspace.", "info");
  }
}

function handleReportResult(payload = {}) {
  const report = normalizeReport(payload);
  if (!report) {
    return;
  }
  if (!workspacePayloadMatchesSelection(report.selectionKey)) {
    return;
  }
  upsertReport(report);
  if (report.ok) {
    setStatus("", "info");
  } else {
    setStatus(`${report.endpointTitle}: ${report.error || "Request failed."}`, "error");
  }
}

function handleCheatSheetResult(payload = {}) {
  const cheatSheet = normalizeCheatSheet(payload);
  if (!cheatSheet) {
    return;
  }
  if (!workspacePayloadMatchesSelection(cheatSheet.selectionKey)) {
    return;
  }
  state.cheatSheetLoading = false;
  state.cheatSheetLoadingMessage = "";
  upsertCheatSheet(cheatSheet);
  setStatus(
    `Loaded DEGRADATION Cheat Sheet with ${Math.max(0, Number(cheatSheet.callCount || cheatSheet.calls?.length || 0))} commands.`,
    "success"
  );
}

function handleCheatSheetStart(payload = {}) {
  if (!workspacePayloadMatchesSelection(payload?.selectionKey)) {
    return;
  }
  state.cheatSheetLoading = true;
  state.cheatSheetLoadingMessage = String(payload?.message || "Generating DEGRADATION Cheat Sheet...").trim();
  setStatus(state.cheatSheetLoadingMessage, "info");
}

function handleCheatSheetProgress(payload = {}) {
  if (!workspacePayloadMatchesSelection(payload?.selectionKey)) {
    return;
  }
  state.cheatSheetLoading = true;
  state.cheatSheetLoadingMessage = String(payload?.message || "Generating DEGRADATION Cheat Sheet...").trim();
  setStatus(state.cheatSheetLoadingMessage, String(payload?.type || "info").trim() || "info");
}

function handleCheatSheetError(payload = {}) {
  if (!workspacePayloadMatchesSelection(payload?.selectionKey)) {
    return;
  }
  state.cheatSheetLoading = false;
  state.cheatSheetLoadingMessage = "";
  setStatus(String(payload?.message || "Unable to generate the DEGRADATION cheat sheet.").trim(), "error");
}

function handleWorkspaceEvent(eventName, payload = {}) {
  const event = String(eventName || "").trim();
  if (!event) {
    return;
  }
  if (event === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (event === "reports-sync") {
    handleReportsSync(payload);
    return;
  }
  if (event === "report-result") {
    handleReportResult(payload);
    return;
  }
  if (event === "cheat-sheet-start") {
    handleCheatSheetStart(payload);
    return;
  }
  if (event === "cheat-sheet-progress") {
    handleCheatSheetProgress(payload);
    return;
  }
  if (event === "cheat-sheet-error") {
    handleCheatSheetError(payload);
    return;
  }
  if (event === "cheat-sheet-result") {
    handleCheatSheetResult(payload);
    return;
  }
  if (event === "batch-start") {
    state.batchRunning = true;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    const reason = String(payload?.reason || "").trim().toLowerCase();
    if (reason === "workspace-deeplink") {
      setStatus(total === 1 ? "Loading DEGRADATION report from Slack..." : `Loading ${total} DEGRADATION reports from Slack...`);
    } else if (reason === "manual-reload") {
      setStatus(total > 0 ? `Reloading ${total} report(s)...` : "Reloading reports...");
    } else {
      setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    }
    return;
  }
  if (event === "batch-end") {
    state.batchRunning = false;
    state.autoRerunInFlightSelectionKey = "";
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    const reason = String(payload?.reason || "").trim().toLowerCase();
    if (reason === "workspace-deeplink") {
      setStatus(total === 1 ? "Loaded DEGRADATION report from Slack." : `Loaded ${total} DEGRADATION reports from Slack.`, "success");
    } else {
      setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
    }
    return;
  }
  if (event === "environment-switch-rerun") {
    return;
  }
  if (event === "workspace-clear") {
    clearPendingAutoRerun();
    clearWorkspaceCards();
    setStatus("DEGRADATION workspace cleared.", "info");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: DEGRADATION_WORKSPACE_MESSAGE_TYPE,
      channel: "workspace-action",
      action,
      ...payload,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function clearWorkspace() {
  clearPendingAutoRerun();
  clearWorkspaceCards();
  void sendWorkspaceAction("clear-all");
  setStatus("DEGRADATION workspace cleared.", "info");
}

async function rerunAllCards(options = {}) {
  if (state.batchRunning) {
    return false;
  }
  const cards = Array.isArray(options?.cards)
    ? options.cards.filter((card) => card && card.endpointKey)
    : getCurrentRerunCards();
  if (cards.length === 0) {
    setStatus("No reports are open.");
    return false;
  }

  state.batchRunning = true;
  syncActionButtonsDisabled();
  const reason = String(options?.reason || "manual-reload").trim().toLowerCase();
  if (reason === "workspace-deeplink") {
    setStatus(cards.length === 1 ? "Loading DEGRADATION report from Slack..." : `Loading ${cards.length} DEGRADATION reports from Slack...`);
  } else if (reason === "manual-reload") {
    setStatus(`Reloading ${cards.length} report(s)...`);
  } else {
    setStatus(`Re-running ${cards.length} report(s)...`);
  }
  const result = await sendWorkspaceAction("rerun-all", {
    cards,
    reason,
    selectionKey: normalizeWorkspaceSelectionKey(options?.selectionKey || state.selectionKey, {
      environmentKey: getEnvironmentKey(state.adobePassEnvironment),
      programmerId: state.programmerId,
    }),
  });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
    return false;
  }
  return true;
}

async function deliverGroupToBlondie(groupId = "", button = null, deliveryTarget = null) {
  if (!(button instanceof HTMLButtonElement)) {
    return {
      ok: false,
      error: "Blondie button is unavailable.",
    };
  }
  const currentState = getBlondieButtonState(button);
  if (currentState === "active" || currentState === "ack" || state.batchRunning) {
    return {
      ok: false,
      error: "DEGRADATION Blondie is already busy.",
    };
  }
  if (!canUseBlondieButton()) {
    renderBlondieButtonState(button, "inactive");
    setStatus(BLONDIE_BUTTON_INACTIVE_MESSAGE, "error");
    return {
      ok: false,
      error: BLONDIE_BUTTON_INACTIVE_MESSAGE,
    };
  }
  const exportPayload = buildDegradationBlondieGroupExportPayload(groupId);
  if (!exportPayload) {
    setStatus("No visible DEGRADATION reports are available for :blondiebtn:.", "error");
    return {
      ok: false,
      error: "No visible DEGRADATION reports are available for :blondiebtn:.",
    };
  }

  renderBlondieButtonState(button, "active");
  setStatus("", "info");

  try {
    const result = await sendWorkspaceAction("blondie-export-all", {
      exportPayload,
      deliveryTarget: deliveryTarget?.target || deliveryTarget || null,
      noteText: deliveryTarget?.noteText || "",
    });
    if (!result?.ok) {
      renderBlondieButtonState(button, getBlondieButtonDefaultState());
      setStatus(result?.error || "Unable to deliver DEGRADATION reports with :blondiebtn:.", "error");
      return {
        ok: false,
        error: result?.error || "Unable to deliver DEGRADATION reports with :blondiebtn:.",
      };
    }
    renderBlondieButtonState(button, "ack");
    queueBlondieButtonAckReset(button);
    const deliveredRecipientLabel = String(result?.recipient_label || "").trim();
    const deliveredReportCount = Math.max(
      0,
      Number(exportPayload?.reportCount || exportPayload?.reportItems?.length || 0)
    );
    setStatus(
      deliveredRecipientLabel
        ? `:blondiebtn: delivered ${deliveredReportCount} DEGRADATION report(s) to ${deliveredRecipientLabel}.`
        : `:blondiebtn: delivered ${deliveredReportCount} DEGRADATION report(s) to your Slack DM.`,
      "success"
    );
    return result;
  } catch (error) {
    renderBlondieButtonState(button, getBlondieButtonDefaultState());
    const message = error instanceof Error ? error.message : "Unable to deliver DEGRADATION reports with :blondiebtn:.";
    setStatus(message, "error");
    return {
      ok: false,
      error: message,
    };
  }
}

function registerEventHandlers() {
  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void rerunAllCards();
    });
  }
  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspace();
    });
  }
  if (els.cardsHost) {
    els.cardsHost.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const copyAllTrigger = event.target.closest('button[data-action="copy-cheat-all"]');
      if (copyAllTrigger instanceof HTMLButtonElement) {
        event.preventDefault();
        void copyCheatSheetAllCommands(String(copyAllTrigger.getAttribute("data-cheat-sheet-id") || "").trim());
        return;
      }
      const copyCheatCommandTrigger = event.target.closest('button[data-action="copy-cheat-command"]');
      if (copyCheatCommandTrigger instanceof HTMLButtonElement) {
        event.preventDefault();
        void copyCheatSheetCommand(
          String(copyCheatCommandTrigger.getAttribute("data-cheat-sheet-id") || "").trim(),
          String(copyCheatCommandTrigger.getAttribute("data-call-key") || "").trim()
        );
        return;
      }
      const copyCheatUrlTrigger = event.target.closest('button[data-action="copy-cheat-url"]');
      if (copyCheatUrlTrigger instanceof HTMLButtonElement) {
        event.preventDefault();
        void copyCheatSheetUrl(
          String(copyCheatUrlTrigger.getAttribute("data-cheat-sheet-id") || "").trim(),
          String(copyCheatUrlTrigger.getAttribute("data-call-key") || "").trim()
        );
        return;
      }
      const groupBlondieTrigger = event.target.closest('button[data-action="blondie-export-group"]');
      if (groupBlondieTrigger instanceof HTMLButtonElement) {
        event.preventDefault();
        const groupId = String(groupBlondieTrigger.getAttribute("data-group-id") || "").trim();
        if (event.shiftKey) {
          openBlondieSharePicker(groupBlondieTrigger, async ({ selectedTarget, noteText }) => {
            return deliverGroupToBlondie(groupId, groupBlondieTrigger, {
              target: {
                mode: "teammate",
                userId: selectedTarget.userId,
                userName: selectedTarget.userName || selectedTarget.label,
              },
              noteText,
            });
          });
          return;
        }
        void deliverGroupToBlondie(groupId, groupBlondieTrigger);
        return;
      }
      const csvTrigger = event.target.closest('a[data-action="download-csv"]');
      if (csvTrigger instanceof HTMLAnchorElement) {
        event.preventDefault();
        downloadDegradationReportCsv(String(csvTrigger.getAttribute("data-report-id") || "").trim());
        setStatus("CSV download started.", "success");
        return;
      }
      const copyUrlTrigger = event.target.closest('button[data-action="copy-request-url"]');
      if (!(copyUrlTrigger instanceof HTMLButtonElement)) {
        return;
      }
      event.preventDefault();
      void copyReportRequestUrl(String(copyUrlTrigger.getAttribute("data-report-id") || "").trim());
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== DEGRADATION_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
      return false;
    }
    const targetWindowId = Number(message?.targetWindowId || 0);
    if (targetWindowId > 0 && Number(state.windowId || 0) > 0 && targetWindowId !== Number(state.windowId)) {
      return false;
    }
    handleWorkspaceEvent(message?.event, message?.payload || {});
    return false;
  });
}

async function init() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    state.windowId = Number(currentWindow?.id || 0);
  } catch {
    state.windowId = 0;
  }
  state.pendingWorkspaceDeeplink = parseWorkspaceDeeplinkPayloadFromLocation();
  registerEventHandlers();
  updateControllerBanner();
  renderWorkspaceCards();
  if (state.pendingWorkspaceDeeplink) {
    const label = firstNonEmptyString([
      state.pendingWorkspaceDeeplink.displayNodeLabel,
      state.pendingWorkspaceDeeplink.endpointKey,
      "DEGRADATION report",
    ]);
    setStatus(`Waiting to load ${label} from Slack...`);
  }
  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR DEGRADATION controller.", "error");
    return;
  }
  void maybeConsumePendingWorkspaceDeeplink();
}

void init();
