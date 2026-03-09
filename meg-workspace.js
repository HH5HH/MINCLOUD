const MEG_WORKSPACE_MESSAGE_TYPE = "underpar:meg-workspace";
const MEG_EXPORT_FORMATS = Object.freeze(["csv", "json", "xml", "html"]);
const MEG_SUPPRESSED_COLUMNS = new Set(["media-company"]);
const SAVED_QUERY_STORAGE_PREFIX = "underpar:saved-esm-query:";
const DEFAULT_MEG_URLS = Object.freeze([
  "/esm/v3/media-company/year?requestor-id&api&metrics=authz-successful,media-tokens",
  "/esm/v3/media-company/year/month/day?event&requestor-id&mvpd&reason!=None",
]);

const DEFAULT_ADOBEPASS_ENVIRONMENT = Object.freeze({
  key: "release-production",
  route: "release-production",
  label: "Production",
  consoleBase: "https://console.auth.adobe.com",
  consoleProgrammersUrl: "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers",
  mgmtBase: "https://mgmt.auth.adobe.com",
  spBase: "https://sp.auth.adobe.com",
  esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/",
});

const state = {
  windowId: 0,
  controllerOnline: false,
  esmAvailable: null,
  esmAvailabilityResolved: false,
  esmContainerVisible: null,
  programmerId: "",
  programmerName: "",
  adobePassEnvironment: { ...DEFAULT_ADOBEPASS_ENVIRONMENT },
  controllerStateVersion: 0,
  controllerStateUpdatedAt: 0,
  currentSelection: null,
  lastLaunchTokenHandled: "",
  workspaceLocked: false,
  nonEsmMode: false,
  pendingAutoRerunContextKey: "",
  autoRerunInFlightContextKey: "",
  requestVersion: 0,
  rawTable: {
    headers: [],
    rows: [],
    sortStack: [],
  },
};

const appRoot = document.getElementById("workspace-app-root");
const nonEsmScreen = document.getElementById("workspace-non-esm-screen");
const nonEsmHeadline = document.getElementById("workspace-non-esm-headline");
const nonEsmNote = document.getElementById("workspace-non-esm-note");
const btnRerunAll = document.getElementById("workspace-rerun-all");
const fldEsmUrl = document.getElementById("fldEsmUrl");
const fldStart = document.getElementById("fldEsmStart");
const fldEnd = document.getElementById("fldEsmEnd");
const pageEnvBadge = document.getElementById("page-env-badge");
const pageEnvBadgeValue = document.getElementById("page-env-badge-value");
const rerunIndicator = document.getElementById("workspace-rerun-indicator");
const statusElement = document.getElementById("workspace-status");
const statBucket = document.getElementById("stat_bkt");
const resetHeading = document.getElementById("meg-reset-url");
const infoPanel = document.getElementById("meg-info-panel");
const infoToggle = document.getElementById("meg-info-toggle");
const infoBody = document.getElementById("meg-info-body");
const savedQuerySection = document.getElementById("meg-saved-query-section");
const loadProgress = document.getElementById("load_progress");
const fldSavedQueryName = document.getElementById("fldSavedQueryName");
const savedQueryPicker = document.getElementById("savedEsmQueryPicker");
const btnSaveQuery = document.getElementById("btnSaveQuery");
const btnDeleteQuery = document.getElementById("btnDeleteQuery");

ack("MEG TOOL - OPEN WIDE, get the story from your data");
ack("UNDER CONSTRUCTION DISCLAIMER: Please forgive the mess, it's a live develop as needed situation...");

function getEmbeddedInputValue(name) {
  return String(document.querySelector(`input[name="${name}"]`)?.value ?? "").trim();
}

function setEmbeddedInputValue(name, value) {
  const input = document.querySelector(`input[name="${name}"]`);
  if (input) {
    input.value = String(value ?? "").trim();
  }
}

function buildWorkspaceEnvironmentTooltip(environment) {
  const resolved =
    environment && typeof environment === "object"
      ? environment
      : buildFallbackEnvironmentFromInputs();
  const registry = globalThis.UnderParEnvironment || null;
  if (registry?.buildEnvironmentBadgeTooltip) {
    return String(registry.buildEnvironmentBadgeTooltip(resolved, "esm") || "").trim();
  }
  const route = String(resolved.route || DEFAULT_ADOBEPASS_ENVIRONMENT.key || "release-production").trim() || "release-production";
  const label = String(resolved.label || (route === "release-staging" ? "Staging" : "Production")).trim() || "Production";
  const mgmtBase =
    String(resolved.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase || "").trim() ||
    (route === "release-staging" ? "https://mgmt.auth-staging.adobe.com" : "https://mgmt.auth.adobe.com");
  const esmBase = String(resolved.esmBase || `${mgmtBase}/esm/v3/media-company/`).trim();
  return [`Environment : ${label}`, `ESM : ${esmBase}`].join("\n").trim();
}

function syncFloatingContext() {
  if (pageEnvBadge && pageEnvBadgeValue) {
    const title = buildWorkspaceEnvironmentTooltip(state.adobePassEnvironment) || "Data Environment";
    pageEnvBadgeValue.textContent = "";
    pageEnvBadgeValue.setAttribute("aria-hidden", "true");
    pageEnvBadge.title = title;
    pageEnvBadge.setAttribute("aria-label", title);
  }
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  if (!statusElement) {
    return;
  }
  statusElement.textContent = text;
  statusElement.hidden = !text;
  statusElement.classList.toggle("error", type === "error" && Boolean(text));
  statBucket?.classList.toggle("meg-console-error", type === "error" && Boolean(text));
}

function setRerunBusy(isBusy) {
  const busy = Boolean(isBusy);
  btnRerunAll?.classList.toggle("net-busy", busy);
  if (rerunIndicator) {
    rerunIndicator.hidden = !busy;
  }
}

function clearTables() {
  const ddTable = document.getElementById("DD_TBL");
  const rawTable = document.getElementById("RAW_TBL");
  [ddTable, rawTable].forEach((table) => {
    const thead = table?.querySelector("thead tr");
    const tbody = table?.querySelector("tbody");
    if (thead) {
      thead.innerHTML = "";
    }
    if (tbody) {
      tbody.innerHTML = "";
    }
  });
  state.rawTable.headers = [];
  state.rawTable.rows = [];
  state.rawTable.sortStack = [];
}

function setInfoPanelCollapsed(collapsed = true) {
  if (!infoPanel || !infoToggle || !infoBody) {
    return;
  }
  const isCollapsed = Boolean(collapsed);
  infoPanel.classList.toggle("is-collapsed", isCollapsed);
  infoBody.hidden = isCollapsed;
  infoToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  infoToggle.title = isCollapsed ? "Expand INFO" : "Collapse INFO";
  infoToggle.setAttribute("aria-label", isCollapsed ? "Expand INFO" : "Collapse INFO");
}

function setSavedQueryCue(active = false) {
  const nextState = Boolean(active);
  fldSavedQueryName?.classList.toggle("meg-save-query-cued", nextState);
  btnSaveQuery?.classList.toggle("meg-save-query-cued", nextState);
}

function beginSavedQueryFlow() {
  if (!hasMegRunnableContext()) {
    reportSavedQueryStatus("An ESM URL is required to save a Saved ESM Query.", "error");
    fldEsmUrl?.focus();
    return;
  }

  setInfoPanelCollapsed(false);
  setSavedQueryCue(true);

  requestAnimationFrame(() => {
    infoBody?.scrollTo({
      top: infoBody.scrollHeight,
      behavior: "smooth",
    });
    savedQuerySection?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
    requestAnimationFrame(() => {
      fldSavedQueryName?.focus({ preventScroll: true });
      fldSavedQueryName?.select?.();
    });
  });
}

function buildFallbackEnvironmentFromInputs() {
  const mgmtBase = getEmbeddedInputValue("mgmt_base") || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase;
  const spBase = getEmbeddedInputValue("sp_base") || mgmtBase.replace("://mgmt.", "://sp.");
  const route = /staging/i.test(`${mgmtBase} ${spBase}`) ? "release-staging" : "release-production";
  const label = /staging/i.test(`${mgmtBase} ${spBase}`) ? "Staging" : "Production";
  return {
    ...DEFAULT_ADOBEPASS_ENVIRONMENT,
    route,
    label,
    mgmtBase,
    spBase,
    consoleProgrammersUrl: `https://experience.adobe.com/#/@adobepass/pass/authentication/${route}/programmers`,
    esmBase: `${mgmtBase.replace(/\/+$/, "")}/esm/v3/media-company/`,
  };
}

function getProgrammerLabel() {
  return String(state.programmerName || state.programmerId || "Selected Media Company").trim() || "Selected Media Company";
}

function getProgrammerIdentityKey(programmerId = "", programmerName = "") {
  const id = String(programmerId || "").trim();
  if (id) {
    return `id:${id}`;
  }
  const name = String(programmerName || "").trim().toLowerCase();
  return name ? `name:${name}` : "";
}

function hasProgrammerIdentityChanged(previousProgrammerId = "", previousProgrammerName = "", nextProgrammerId = "", nextProgrammerName = "") {
  const previousId = String(previousProgrammerId || "").trim();
  const nextId = String(nextProgrammerId || "").trim();
  if (previousId && nextId) {
    return previousId !== nextId;
  }

  const previousName = String(previousProgrammerName || "").trim().toLowerCase();
  const nextName = String(nextProgrammerName || "").trim().toLowerCase();
  if (previousName && nextName) {
    return previousName !== nextName;
  }

  if (!previousId && !nextId && !previousName && !nextName) {
    return false;
  }

  return false;
}

function getMegControllerContextKey(programmerId = "", programmerName = "", environmentKey = "") {
  const programmerKey = getProgrammerIdentityKey(programmerId, programmerName);
  const normalizedEnvironmentKey =
    String(environmentKey || DEFAULT_ADOBEPASS_ENVIRONMENT.key || "release-production").trim() || "release-production";
  if (!programmerKey) {
    return "";
  }
  return `${programmerKey}|env:${normalizedEnvironmentKey}`;
}

function getProgrammerConsoleApplicationsUrl() {
  const programmerId = String(state.programmerId || "").trim();
  if (!programmerId) {
    return "";
  }
  const consoleProgrammersUrl = String(
    state.adobePassEnvironment?.consoleProgrammersUrl ||
      DEFAULT_ADOBEPASS_ENVIRONMENT.consoleProgrammersUrl ||
      ""
  ).trim();
  if (!consoleProgrammersUrl) {
    return "";
  }
  return `${consoleProgrammersUrl}/${encodeURIComponent(programmerId)}/applications`;
}

function buildNotPremiumConsoleLinkHtml(serviceLabel = "ESM") {
  const consoleUrl = getProgrammerConsoleApplicationsUrl();
  if (!consoleUrl) {
    return `* If this looks wrong, no Media Company id is available for an Adobe Pass Console deeplink for ${serviceLabel}.`;
  }
  return `* If this looks wrong, <a href="${consoleUrl}" target="_blank" rel="noopener noreferrer">click here to inspect this Media Company in Adobe Pass Console</a> and verify legacy applications and premium scopes for ${serviceLabel}.`;
}

function hasProgrammerContext() {
  return Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
}

function hasMegRunnableContext() {
  return Boolean(String(fldEsmUrl?.value || "").trim());
}

function shouldShowNonEsmMode() {
  return (
    state.esmAvailabilityResolved === true &&
    state.esmAvailable === false &&
    state.esmContainerVisible === false &&
    hasProgrammerContext()
  );
}

function teardownMegWorkspaceForNonEsm() {
  state.requestVersion = Number(state.requestVersion || 0) + 1;
  clearTables();
  setStatus("");
  setRerunBusy(false);
  if (loadProgress) {
    loadProgress.value = 0;
    loadProgress.style.display = "none";
  }
  document.body.style.cursor = "default";
}

function updateNonEsmMode() {
  const shouldShow = shouldShowNonEsmMode();
  state.nonEsmMode = shouldShow;
  if (nonEsmHeadline) {
    nonEsmHeadline.textContent = `No Soup for ${getProgrammerLabel()}. No Premium, No ESM, No Dice.`;
  }
  if (nonEsmNote) {
    nonEsmNote.innerHTML = buildNotPremiumConsoleLinkHtml("ESM");
  }
  if (appRoot) {
    appRoot.hidden = shouldShow;
  }
  if (nonEsmScreen) {
    nonEsmScreen.hidden = !shouldShow;
  }
}

function updateWorkspaceLockState() {
  const shouldLock = shouldShowNonEsmMode();
  const wasLocked = state.workspaceLocked === true;
  state.workspaceLocked = shouldLock;
  document.body.classList.toggle("workspace-locked", shouldLock);
  if (shouldLock && !wasLocked) {
    teardownMegWorkspaceForNonEsm();
    ack(`MEGSPACE locked -> ${getProgrammerLabel()} has no Premium ESM access`);
  }
  updateNonEsmMode();
}

function ensureMegWorkspaceAccess(actionLabel = "run MEGSPACE") {
  if (!state.workspaceLocked && !state.nonEsmMode) {
    return true;
  }
  ack(`Blocked ${actionLabel}: ${getProgrammerLabel()} has no Premium ESM access`);
  return false;
}

function clearPendingMegContextTransition() {
  state.pendingAutoRerunContextKey = "";
  state.autoRerunInFlightContextKey = "";
}

function nextMegRequestVersion() {
  state.requestVersion = Number(state.requestVersion || 0) + 1;
  return state.requestVersion;
}

function isMegRequestCurrent(requestVersion) {
  const normalizedVersion = Number(requestVersion || 0);
  return (
    normalizedVersion > 0 &&
    normalizedVersion === Number(state.requestVersion || 0) &&
    !state.workspaceLocked &&
    !state.nonEsmMode
  );
}

async function autoRerunMegForContextChange(expectedContextKey = "") {
  const currentContextKey = getMegControllerContextKey(
    state.programmerId,
    state.programmerName,
    state.adobePassEnvironment?.key
  );
  if (!currentContextKey) {
    return false;
  }
  if (expectedContextKey && currentContextKey !== expectedContextKey) {
    return false;
  }
  if (!hasMegRunnableContext() || state.esmAvailable !== true || state.workspaceLocked || state.nonEsmMode) {
    return false;
  }

  await runMeg("rerun-all");
  return true;
}

function maybeConsumePendingAutoRerun() {
  const pendingContextKey = String(state.pendingAutoRerunContextKey || "").trim();
  if (!pendingContextKey) {
    return;
  }

  const currentContextKey = getMegControllerContextKey(
    state.programmerId,
    state.programmerName,
    state.adobePassEnvironment?.key
  );
  if (!currentContextKey || currentContextKey !== pendingContextKey) {
    return;
  }

  if (!hasMegRunnableContext()) {
    clearPendingMegContextTransition();
    return;
  }
  if (state.esmAvailabilityResolved === true && state.esmAvailable === false) {
    clearPendingMegContextTransition();
    return;
  }
  if (state.esmAvailable !== true || state.workspaceLocked || state.nonEsmMode) {
    return;
  }

  state.pendingAutoRerunContextKey = "";
  state.autoRerunInFlightContextKey = currentContextKey;
  setStatus(
    `Refreshing MEGTOOL for ${getProgrammerLabel()} in ${String(
      state.adobePassEnvironment?.label || DEFAULT_ADOBEPASS_ENVIRONMENT.label
    )}...`
  );
  void autoRerunMegForContextChange(currentContextKey).finally(() => {
    if (String(state.autoRerunInFlightContextKey || "").trim() === currentContextKey) {
      state.autoRerunInFlightContextKey = "";
    }
  });
}

async function resolveAdobePassEnvironment() {
  const registry = globalThis.UnderParEnvironment || null;

  if (registry?.getStoredEnvironment) {
    try {
      const environment = await registry.getStoredEnvironment();
      if (environment && typeof environment === "object") {
        return environment;
      }
    } catch (error) {
      ack(`Falling back to embedded environment: ${error.message}`);
    }
  }

  if (registry?.getDefaultEnvironment) {
    try {
      const environment = registry.getDefaultEnvironment();
      if (environment && typeof environment === "object") {
        return environment;
      }
    } catch (error) {
      ack(`Falling back to embedded environment: ${error.message}`);
    }
  }

  return buildFallbackEnvironmentFromInputs();
}

function applyControllerState(payload = {}) {
  const incomingControllerStateVersion = Number(payload?.controllerStateVersion || 0);
  const incomingControllerUpdatedAt = Number(payload?.updatedAt || 0);
  const currentControllerStateVersion = Number(state.controllerStateVersion || 0);
  const currentControllerUpdatedAt = Number(state.controllerStateUpdatedAt || 0);
  const hasIncomingUpdatedAt = Number.isFinite(incomingControllerUpdatedAt) && incomingControllerUpdatedAt > 0;
  const hasCurrentUpdatedAt = Number.isFinite(currentControllerUpdatedAt) && currentControllerUpdatedAt > 0;

  if (hasIncomingUpdatedAt && hasCurrentUpdatedAt && incomingControllerUpdatedAt < currentControllerUpdatedAt) {
    return;
  }
  if (
    hasIncomingUpdatedAt &&
    hasCurrentUpdatedAt &&
    incomingControllerUpdatedAt === currentControllerUpdatedAt &&
    incomingControllerStateVersion > 0 &&
    currentControllerStateVersion > 0 &&
    incomingControllerStateVersion < currentControllerStateVersion
  ) {
    return;
  }
  if (
    !hasIncomingUpdatedAt &&
    incomingControllerStateVersion > 0 &&
    currentControllerStateVersion > 0 &&
    incomingControllerStateVersion < currentControllerStateVersion
  ) {
    return;
  }

  if (incomingControllerStateVersion > 0) {
    state.controllerStateVersion = incomingControllerStateVersion;
  }
  if (hasIncomingUpdatedAt) {
    state.controllerStateUpdatedAt = incomingControllerUpdatedAt;
  }

  const previousEnvironmentKey = String(state.adobePassEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim();
  const incomingEnvironment =
    payload?.adobePassEnvironment && typeof payload.adobePassEnvironment === "object" ? payload.adobePassEnvironment : null;
  const incomingEnvironmentKey = String(incomingEnvironment?.key || "").trim();
  const environmentChanged = Boolean(incomingEnvironmentKey) && incomingEnvironmentKey !== previousEnvironmentKey;
  const previousProgrammerId = String(state.programmerId || "");
  const previousProgrammerName = String(state.programmerName || "");
  const controllerReason = String(payload?.controllerReason || "").trim().toLowerCase();

  state.controllerOnline = payload?.controllerOnline === true;
  if (payload?.esmAvailable === true) {
    state.esmAvailable = true;
  } else if (payload?.esmAvailable === false) {
    state.esmAvailable = false;
  } else {
    state.esmAvailable = null;
  }
  if (payload?.esmAvailabilityResolved === true) {
    state.esmAvailabilityResolved = true;
  } else if (payload?.esmAvailabilityResolved === false) {
    state.esmAvailabilityResolved = false;
  } else {
    state.esmAvailabilityResolved = state.esmAvailable === true || state.esmAvailable === false;
  }
  if (payload?.esmContainerVisible === true) {
    state.esmContainerVisible = true;
  } else if (payload?.esmContainerVisible === false) {
    state.esmContainerVisible = false;
  } else {
    state.esmContainerVisible = null;
  }
  state.programmerId = String(payload?.programmerId || "").trim();
  state.programmerName = String(payload?.programmerName || "").trim();
  if (incomingEnvironment) {
    state.adobePassEnvironment = {
      ...DEFAULT_ADOBEPASS_ENVIRONMENT,
      ...incomingEnvironment,
    };
  }
  const programmerChanged = hasProgrammerIdentityChanged(
    previousProgrammerId,
    previousProgrammerName,
    state.programmerId,
    state.programmerName
  );
  const currentContextKey = getMegControllerContextKey(state.programmerId, state.programmerName, state.adobePassEnvironment?.key);
  if (programmerChanged || environmentChanged) {
    state.autoRerunInFlightContextKey = "";
  }

  const shouldTriggerWorkspaceRedraw =
    hasMegRunnableContext() &&
    Boolean(currentContextKey) &&
    ((programmerChanged && controllerReason === "media-company-change") ||
      (environmentChanged && controllerReason === "environment-switch"));

  if (shouldTriggerWorkspaceRedraw) {
    state.pendingAutoRerunContextKey = currentContextKey;
    setStatus(
      `Refreshing MEGTOOL for ${getProgrammerLabel()} in ${String(
        state.adobePassEnvironment?.label || incomingEnvironmentKey || DEFAULT_ADOBEPASS_ENVIRONMENT.label
      )}...`
    );
  } else if (programmerChanged || environmentChanged) {
    state.pendingAutoRerunContextKey = "";
    if (environmentChanged && !hasMegRunnableContext()) {
      setStatus(`Environment changed to ${String(state.adobePassEnvironment?.label || incomingEnvironmentKey || "Production")}.`);
    }
  }

  setEmbeddedInputValue("mgmt_base", state.adobePassEnvironment?.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase);
  setEmbeddedInputValue("sp_base", state.adobePassEnvironment?.spBase || DEFAULT_ADOBEPASS_ENVIRONMENT.spBase);
  syncFloatingContext();
  updateWorkspaceLockState();
  maybeConsumePendingAutoRerun();
}

function normalizeSelection(payload = {}) {
  const endpointUrl = String(payload?.endpointUrl || "").trim();
  let endpointPath = String(payload?.endpointPath || "").trim();
  if (!endpointPath && endpointUrl) {
    try {
      const parsed = new URL(endpointUrl);
      endpointPath = `${String(parsed.pathname || "")}${String(parsed.search || "")}`;
    } catch {
      endpointPath = endpointUrl;
    }
  }
  const endpointLabel = String(payload?.endpointLabel || "").trim();
  if (!endpointPath) {
    return null;
  }
  return {
    endpointPath,
    endpointUrl,
    endpointLabel,
    launchToken: String(payload?.launchToken || "").trim(),
  };
}

function applySelection(payload = {}) {
  const selection = normalizeSelection(payload);
  if (!selection) {
    return;
  }
  state.currentSelection = selection;
  fldEsmUrl.value = selection.endpointPath;
  ack(`MEGSPACE selection -> ${selection.endpointLabel || selection.endpointPath}`);
}

async function sendWorkspaceAction(action, payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: MEG_WORKSPACE_MESSAGE_TYPE,
      channel: "workspace-action",
      action,
      payload,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function resolveRunContext(source = "workspace") {
  const result = await sendWorkspaceAction("resolve-run-context", { source });
  if (!result?.ok) {
    throw new Error(result?.error || "Unable to resolve current UnderPar MEG context.");
  }
  if (result?.controllerState) {
    applyControllerState(result.controllerState);
  }
  setEmbeddedInputValue("cid", result?.clientId || "");
  setEmbeddedInputValue("csc", result?.clientSecret || "");
  setEmbeddedInputValue("access_token", result?.accessToken || "");
  if (result?.selection) {
    state.currentSelection = normalizeSelection(result.selection) || state.currentSelection;
  }
  return result;
}

function formatMegCellDisplayValue(value) {
  return value == null ? "" : String(value);
}

function isMegSuppressedColumn(columnName = "") {
  const normalized = String(columnName || "").trim().toLowerCase();
  return Boolean(normalized) && MEG_SUPPRESSED_COLUMNS.has(normalized);
}

function getMegDisplayHeaders(rows = []) {
  const firstRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  const headers = firstRow && typeof firstRow === "object" ? Object.keys(firstRow) : [];
  return headers.filter((header) => !isMegSuppressedColumn(header));
}

function createMegCell(value) {
  const cell = document.createElement("td");
  const text = formatMegCellDisplayValue(value);
  cell.textContent = text;
  cell.title = text;
  return cell;
}

function normalizeMegSortDirection(value) {
  return String(value || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC";
}

function normalizeMegExportFormat(rawValue, fallback = "csv") {
  const normalized = String(rawValue || "").trim().toLowerCase();
  if (MEG_EXPORT_FORMATS.includes(normalized)) {
    return normalized;
  }
  return String(fallback || "csv").trim().toLowerCase();
}

function normalizeMegSortStack(rawSortStack, headers = []) {
  const availableHeaders = new Set((Array.isArray(headers) ? headers : []).map((header) => String(header || "").trim()).filter(Boolean));
  return (Array.isArray(rawSortStack) ? rawSortStack : [])
    .map((rule) => ({
      col: String(rule?.col || "").trim(),
      dir: normalizeMegSortDirection(rule?.dir),
    }))
    .filter((rule) => rule.col && availableHeaders.has(rule.col))
    .slice(0, 1);
}

function megPartsToUtcMs(row) {
  const year = Number(row?.year ?? 1970);
  const month = Number(row?.month ?? 1);
  const day = Number(row?.day ?? 1);
  const hour = Number(row?.hour ?? 0);
  const minute = Number(row?.minute ?? 0);
  return Date.UTC(
    Number.isFinite(year) ? year : 1970,
    Number.isFinite(month) ? month - 1 : 0,
    Number.isFinite(day) ? day : 1,
    Number.isFinite(hour) ? hour : 0,
    Number.isFinite(minute) ? minute : 0
  );
}

function megToNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDefaultMegSortStack(headers = []) {
  return Array.isArray(headers) && headers.includes("DATE") ? [{ col: "DATE", dir: "DESC" }] : [];
}

function getMegCellValue(row, columnKey) {
  if (columnKey === "DATE") {
    return megPartsToUtcMs(row);
  }

  const rawValue = row?.[columnKey];
  if (rawValue == null) {
    return "";
  }

  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return rawValue;
  }

  const converted = megToNumber(rawValue);
  if (converted != null) {
    return converted;
  }

  return String(rawValue).toLowerCase();
}

function sortMegRows(rows = [], sortStack = [], headers = []) {
  const normalizedRows = Array.isArray(rows) ? rows.slice() : [];
  const stack = normalizeMegSortStack(sortStack, headers);
  if (stack.length === 0) {
    return normalizedRows;
  }

  const [sortRule] = stack;
  return normalizedRows.sort((left, right) => {
    const factor = sortRule.dir === "ASC" ? 1 : -1;
    const leftValue = getMegCellValue(left, sortRule.col);
    const rightValue = getMegCellValue(right, sortRule.col);
    if (leftValue < rightValue) {
      return -1 * factor;
    }
    if (leftValue > rightValue) {
      return 1 * factor;
    }
    return 0;
  });
}

function refreshMegHeaderStates(tableState) {
  tableState?.thead?.querySelectorAll("th").forEach((headerCell) => {
    if (typeof headerCell._updateState === "function") {
      headerCell._updateState();
    }
  });
}

function renderMegTableBody(tableState) {
  tableState.tbody.innerHTML = "";
  tableState.data.forEach((item) => {
    const row = document.createElement("tr");
    tableState.headers.forEach((header) => {
      row.appendChild(createMegCell(item?.[header]));
    });
    tableState.tbody.appendChild(row);
  });
}

function generateTable(data) {
  const table = document.getElementById("RAW_TBL");
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");
  const rows = Array.isArray(data)
    ? data.filter((item) => item && typeof item === "object" && !Array.isArray(item))
    : data && typeof data === "object"
      ? [data]
      : [];
  const headers = getMegDisplayHeaders(rows);
  const normalizedSortStack = normalizeMegSortStack(state.rawTable.sortStack, headers);
  const activeSortStack = normalizedSortStack.length > 0 ? normalizedSortStack : getDefaultMegSortStack(headers);
  const tableState = {
    table,
    thead: table.querySelector("thead"),
    tbody,
    headers,
    sourceRows: rows.slice(),
    data: sortMegRows(rows, activeSortStack, headers),
    sortStack: activeSortStack,
  };

  thead.innerHTML = "";
  tbody.innerHTML = "";
  state.rawTable.headers = headers.slice();
  state.rawTable.rows = rows.slice();
  state.rawTable.sortStack = activeSortStack.map((rule) => ({ ...rule }));

  if (rows.length > 0 && headers.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = "No visible report columns.";
    cell.title = "No visible report columns.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.title = `Sort by ${header}`;

    const button = document.createElement("button");
    button.className = "meg-sort-button";
    button.type = "button";
    button.title = `Sort by ${header}`;

    const label = document.createElement("span");
    label.className = "meg-sort-label";
    label.textContent = header;

    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.setAttribute("aria-hidden", "true");

    th._updateState = () => {
      const isActive = tableState.sortStack[0]?.col === header;
      const direction = normalizeMegSortDirection(tableState.sortStack[0]?.dir);
      th.classList.toggle("active-sort", isActive);
      th.setAttribute("aria-sort", isActive ? (direction === "ASC" ? "ascending" : "descending") : "none");
      icon.textContent = isActive ? (direction === "ASC" ? "▲" : "▼") : "";
      button.setAttribute("aria-label", isActive ? `Sort by ${header}, currently ${direction === "ASC" ? "ascending" : "descending"}` : `Sort by ${header}`);
    };

    const applySort = () => {
      const existingRule = tableState.sortStack[0]?.col === header ? tableState.sortStack[0] : null;
      tableState.sortStack = [
        {
          col: header,
          dir: existingRule ? (existingRule.dir === "DESC" ? "ASC" : "DESC") : "DESC",
        },
      ];
      tableState.data = sortMegRows(tableState.sourceRows, tableState.sortStack, tableState.headers);
      renderMegTableBody(tableState);
      refreshMegHeaderStates(tableState);
      state.rawTable.sortStack = tableState.sortStack.map((rule) => ({ ...rule }));
    };

    button.addEventListener("click", () => {
      applySort();
    });
    button.appendChild(label);
    button.appendChild(icon);
    th.appendChild(button);
    thead.appendChild(th);
  });

  renderMegTableBody(tableState);
  refreshMegHeaderStates(tableState);
}

const dateSink = (key, value) => {
  const baseUrl = String(fldEsmUrl.value.split("?")[0] || "").trim();
  if (!baseUrl) {
    return;
  }
  const params = new URLSearchParams(fldEsmUrl.value.split("?")[1] || "");
  const normalizedValue = String(value || "").trim();
  if (normalizedValue) {
    params.set(key, normalizedValue);
  } else {
    params.delete(key);
  }
  const nextQuery = params.toString();
  fldEsmUrl.value = nextQuery ? `${baseUrl}?${nextQuery}` : baseUrl;
};

function syncDatePickersFromServerHref(href = "") {
  const normalizedHref = String(href || "").trim();
  if (!normalizedHref || !fldStart || !fldEnd) {
    return;
  }

  let searchParams;
  try {
    searchParams = new URL(normalizedHref, "https://example.invalid").searchParams;
  } catch {
    searchParams = new URLSearchParams(normalizedHref.split("?")[1] || "");
  }

  const serverStart = String(searchParams.get("start") || "").trim();
  const serverEnd = String(searchParams.get("end") || "").trim();

  if (serverStart) {
    fldStart.value = serverStart.slice(0, 16);
  }
  if (serverEnd) {
    fldEnd.value = serverEnd.slice(0, 16);
  }
};

function generateDD_TBL(data) {
  const table = document.getElementById("DD_TBL");
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      thead.appendChild(th);
    });
  }

  const row = document.createElement("tr");
  row.className = "meg-drilldown-row";

  if (data?.self?.href) {
    syncDatePickersFromServerHref(data.self.href);
  }

  if (data["roll-up"]) {
    if (data["roll-up"].href !== "/esm/v3") {
      const cell = document.createElement("th");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = `\u2191 ${data["roll-up"].name}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        urlSink(data["roll-up"].href);
      });
      cell.appendChild(link);
      row.appendChild(cell);
    }
  }

  if (data["drill-down"]) {
    if (data["drill-down"].length) {
      data["drill-down"].forEach((item) => {
        const cell = document.createElement("th");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = `\u2193 ${item.name}`;
        link.addEventListener("click", (event) => {
          event.preventDefault();
          urlSink(item.href);
        });
        cell.appendChild(link);
        row.appendChild(cell);
      });
    } else {
      const cell = document.createElement("th");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = `\u2193 ${data["drill-down"].name}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        urlSink(data["drill-down"].href);
      });
      cell.appendChild(link);
      row.appendChild(cell);
    }
  }

  const exportCell = document.createElement("th");
  exportCell.className = "meg-export-pack-cell";

  const exportPack = document.createElement("div");
  exportPack.className = "meg-export-pack";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "meg-export-pack-button meg-export-pack-button--icon";
  saveButton.title = "Save ESM Query for use in ESM Workspace";
  saveButton.setAttribute("aria-label", "Save ESM Query for use in ESM Workspace");
  saveButton.innerHTML = `
    <span class="meg-export-pack-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5.25 4.5h10.5L19.5 8.25v10.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z"></path>
        <path d="M8.25 4.5v5.25h7.5V4.5"></path>
        <path d="M9 15.75h6"></path>
      </svg>
    </span>
  `;
  saveButton.addEventListener("click", () => {
    beginSavedQueryFlow();
  });
  exportPack.appendChild(saveButton);

  MEG_EXPORT_FORMATS.forEach((format) => {
    const exportButton = document.createElement("button");
    exportButton.className = "meg-export-pack-button";
    const normalizedFormat = normalizeMegExportFormat(format);
    exportButton.textContent = normalizedFormat.toUpperCase();
    exportButton.title = `Export query as ${normalizedFormat.toUpperCase()}`;
    exportButton.setAttribute("aria-label", `Export query as ${normalizedFormat.toUpperCase()}`);
    exportButton.addEventListener("click", () => {
      void exportMeg(normalizedFormat);
    });
    exportPack.appendChild(exportButton);
  });

  exportCell.appendChild(exportPack);
  row.appendChild(exportCell);
  tbody.appendChild(row);
}

function urlSink(esmUrl) {
  const oldUrl = fldEsmUrl.value;
  let newUrl;

  if (oldUrl.indexOf("?") > -1) {
    newUrl = `${esmUrl}?${fldEsmUrl.value.split("?")[1]}`;
  } else {
    newUrl = esmUrl;
  }

  fldEsmUrl.value = newUrl;
  state.currentSelection = normalizeSelection({
    endpointPath: esmUrl,
    endpointLabel: String(esmUrl || "").split("?")[0],
  });
  void runMeg("drill-down");
}

function renderData(data) {
  if (Object.hasOwn(data, "_links")) {
    generateDD_TBL(data._links);
  }

  if (Object.hasOwn(data, "report")) {
    generateTable(data.report);
  } else {
    ack("No report found. Generating table with raw data...");
    generateTable(data);
  }
}

async function dasink(requestVersion = 0) {
  const bodyElement = document.body;

  try {
    bodyElement.style.cursor = "wait";
    if (loadProgress) {
      loadProgress.value = 1;
      loadProgress.style.display = "block";
    }
    setRerunBusy(true);
    setStatus("");

    let esmUrl = checkForCountCall(fldEsmUrl.value);
    let response3 = await sendWorkspaceAction("fetch-esm", {
      url: esmUrl,
      format: "json",
    });

    if (!response3?.ok) {
      throw new Error(response3?.error || "Unable to fetch ESM data through UnderPar.");
    }

    if (!isMegRequestCurrent(requestVersion)) {
      return;
    }

    if (!response3.responseOk) {
      const errorText = String(response3.bodyText || "");
      if (errorText.startsWith("The requested metrics are not available for the selected dimensions")) {
        const sanitizedEsmUrl = esmUrl.replace(/&?metrics=[^&]*/, "");
        const response4 = await sendWorkspaceAction("fetch-esm", {
          url: sanitizedEsmUrl,
          format: "json",
        });

        if (!response4?.ok) {
          throw new Error(response4?.error || "Unable to fetch sanitized ESM data through UnderPar.");
        }

        if (!isMegRequestCurrent(requestVersion)) {
          return;
        }

        if (!response4.responseOk) {
          const errorText2 = String(response4.bodyText || "");
          throw new Error(`Failed to fetch ESM data: ${errorText2}`);
        }

        const data4 = JSON.parse(String(response4.bodyText || "{}"));
        const alertMessage =
          "Hey, your original call didn't work because of a METRICS mis-match.\n\n" +
          `Here was the original query:\n${esmUrl}\n\n` +
          `Here is what was run and is being displayed:\n${sanitizedEsmUrl}`;

        alert(alertMessage);
        ack(alertMessage);
        renderData(data4);
        return;
      }
      throw new Error(`Failed to fetch ESM data: ${errorText}`);
    }

    const data3 = JSON.parse(String(response3.bodyText || "{}"));
    if (!isMegRequestCurrent(requestVersion)) {
      return;
    }
    renderData(data3);
  } catch (error) {
    if (isMegRequestCurrent(requestVersion)) {
      bonk(`[0x33] Error: ${error.message}`);
    }
  } finally {
    setTimeout(() => {
      if (isMegRequestCurrent(requestVersion)) {
        if (loadProgress) {
          loadProgress.value = 100;
          loadProgress.style.display = "none";
        }
        bodyElement.style.cursor = "default";
        setRerunBusy(false);
      }
    }, 500);
  }
}

async function runMeg(source = "manual") {
  if (!ensureMegWorkspaceAccess("run MEGSPACE")) {
    return;
  }
  const requestVersion = nextMegRequestVersion();
  await resolveRunContext(source);
  if (!ensureMegWorkspaceAccess("run MEGSPACE")) {
    return;
  }
  await dasink(requestVersion);
}

async function exportMeg(format = "csv") {
  const normalizedFormat = normalizeMegExportFormat(format);
  if (!ensureMegWorkspaceAccess(`export ${normalizedFormat.toUpperCase()} from MEGSPACE`)) {
    return;
  }
  try {
    const result = await sendWorkspaceAction("download-export", {
      url: fldEsmUrl.value,
      format: normalizedFormat,
    });
    if (!result?.ok) {
      throw new Error(result?.error || `Unable to export ${normalizedFormat.toUpperCase()} through UnderPar.`);
    }
    setStatus(`${normalizedFormat.toUpperCase()} download started.`);
    ack(`${normalizedFormat.toUpperCase()} download started: ${String(result.fileName || `esm-export.${normalizedFormat}`)}`);
  } catch (error) {
    bonk(`[0x35] ${error.message}`);
  }
}

function bonk(msg) {
  setStatus(msg, "error");
  ack(`<OOPS>${msg}</OOPS>`);
}

function ack(msg) {
  const existingVal = document.getElementById("stat_bkt").value;
  document.getElementById("stat_bkt").value = `${Date.now()} ${msg}\n${existingVal}`;
}

function normalizeSavedQueryName(value = "") {
  return String(value || "").replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function buildSavedQueryStorageKey(name = "") {
  return `${SAVED_QUERY_STORAGE_PREFIX}${encodeURIComponent(String(name || "").trim())}`;
}

function buildSavedQueryPayload(name = "", esmUrl = "") {
  return `${String(name || "").trim()}|${String(esmUrl || "").trim()}`;
}

function parseSavedQueryRecord(storageKey = "", payload = "") {
  const normalizedStorageKey = String(storageKey || "").trim();
  if (!normalizedStorageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
    return null;
  }
  const normalizedPayload = String(payload || "").trim();
  const separatorIndex = normalizedPayload.indexOf("|");
  if (separatorIndex <= 0) {
    return null;
  }
  const name = normalizeSavedQueryName(normalizedPayload.slice(0, separatorIndex));
  const url = String(normalizedPayload.slice(separatorIndex + 1) || "").trim();
  if (!name || !url) {
    return null;
  }
  return {
    storageKey: normalizedStorageKey,
    name,
    url,
  };
}

function getSavedQueryRecords() {
  const records = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const storageKey = String(localStorage.key(index) || "").trim();
      if (!storageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
        continue;
      }
      const record = parseSavedQueryRecord(storageKey, localStorage.getItem(storageKey));
      if (record) {
        records.push(record);
      }
    }
  } catch (error) {
    ack(`Saved query localStorage read failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  return records.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

function getSelectedSavedQueryOption() {
  const selectedOption = savedQueryPicker?.selectedOptions?.[0] || null;
  if (!selectedOption || !String(selectedOption.value || "").trim()) {
    return null;
  }
  return selectedOption;
}

function syncSavedQueryButtonsDisabled() {
  const hasSelection = Boolean(getSelectedSavedQueryOption());
  if (btnDeleteQuery) {
    btnDeleteQuery.disabled = !hasSelection;
  }
}

function syncSavedQueryPickerTitle() {
  if (!savedQueryPicker) {
    return;
  }
  const selectedOption = getSelectedSavedQueryOption();
  const widthLabel = String(selectedOption?.textContent || "").trim() || "Saved Queries";
  const nextWidthCh = Math.min(Math.max(widthLabel.length + 4, 18), 44);
  const title = selectedOption ? String(selectedOption.value || "").trim() : "Saved Queries";
  savedQueryPicker.style.width = `${nextWidthCh}ch`;
  savedQueryPicker.title = title;
  savedQueryPicker.setAttribute("aria-label", selectedOption ? `Saved ESM Query: ${selectedOption.textContent || ""}` : "Saved Queries");
}

function populateSavedQuerySelect(preferredStorageKey = "") {
  if (!savedQueryPicker) {
    return;
  }

  const fallbackStorageKey =
    String(preferredStorageKey || "").trim() ||
    String(savedQueryPicker.selectedOptions?.[0]?.dataset.storageKey || "").trim();
  const records = getSavedQueryRecords();

  savedQueryPicker.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Saved Queries";
  defaultOption.value = "";
  savedQueryPicker.appendChild(defaultOption);

  records.forEach((record) => {
    const option = document.createElement("option");
    option.textContent = record.name;
    option.value = record.url;
    option.dataset.storageKey = record.storageKey;
    option.title = record.url;
    if (fallbackStorageKey && record.storageKey === fallbackStorageKey) {
      option.selected = true;
    }
    savedQueryPicker.appendChild(option);
  });

  syncSavedQueryPickerTitle();
  syncSavedQueryButtonsDisabled();
}

function reportSavedQueryStatus(message = "", type = "info") {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) {
    return;
  }
  setStatus(normalizedMessage, type);
  ack(normalizedMessage);
}

function saveCurrentQuery() {
  const queryName = normalizeSavedQueryName(fldSavedQueryName?.value || "");
  const esmUrl = String(fldEsmUrl?.value || "").trim();
  if (!queryName) {
    reportSavedQueryStatus("Query Name is required to save a Saved ESM Query.", "error");
    fldSavedQueryName?.focus();
    return;
  }
  if (!esmUrl) {
    reportSavedQueryStatus("An ESM URL is required to save a Saved ESM Query.", "error");
    fldEsmUrl?.focus();
    return;
  }

  const storageKey = buildSavedQueryStorageKey(queryName);
  const existingPayload = localStorage.getItem(storageKey);
  const nextPayload = buildSavedQueryPayload(queryName, esmUrl);

  try {
    localStorage.setItem(storageKey, nextPayload);
  } catch (error) {
    reportSavedQueryStatus(
      `Unable to save Saved ESM Query: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
    return;
  }

  populateSavedQuerySelect(storageKey);
  setSavedQueryCue(false);
  if (fldSavedQueryName) {
    fldSavedQueryName.value = "";
    fldSavedQueryName.blur();
  }
  reportSavedQueryStatus(existingPayload ? `Updated Saved ESM Query "${queryName}".` : `Saved ESM Query "${queryName}".`);
}

async function loadSelectedSavedQuery() {
  const selectedOption = getSelectedSavedQueryOption();
  if (!selectedOption) {
    reportSavedQueryStatus("Select a Saved ESM Query to load.", "error");
    return;
  }

  const savedQueryUrl = String(selectedOption.value || "").trim();
  const savedQueryName = String(selectedOption.textContent || "").trim();
  fldEsmUrl.value = savedQueryUrl;
  state.currentSelection = normalizeSelection({
    endpointPath: savedQueryUrl,
    endpointLabel: savedQueryName,
  });
  reportSavedQueryStatus(`Loaded Saved ESM Query "${savedQueryName}". Running query...`);

  try {
    await runMeg("saved-query-load");
  } catch (error) {
    reportSavedQueryStatus(
      `Loaded Saved ESM Query "${savedQueryName}" but auto-run failed: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
    fldEsmUrl.focus();
    return;
  }

  fldEsmUrl.focus();
}

function deleteSelectedSavedQuery() {
  const selectedOption = getSelectedSavedQueryOption();
  if (!selectedOption) {
    reportSavedQueryStatus("Select a Saved ESM Query to delete.", "error");
    return;
  }

  const storageKey = String(selectedOption.dataset.storageKey || "").trim();
  const savedQueryName = String(selectedOption.textContent || "").trim();
  if (!storageKey) {
    reportSavedQueryStatus("Selected Saved ESM Query could not be resolved for deletion.", "error");
    return;
  }

  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    reportSavedQueryStatus(
      `Unable to delete Saved ESM Query: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
    return;
  }

  populateSavedQuerySelect();
  reportSavedQueryStatus(`Deleted Saved ESM Query "${savedQueryName}".`);
}

function setupUrl() {
  const currentValue = String(fldEsmUrl?.value || "").trim();
  const currentIndex = DEFAULT_MEG_URLS.findIndex((value) => value === currentValue);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % DEFAULT_MEG_URLS.length : 0;
  fldEsmUrl.value = DEFAULT_MEG_URLS[nextIndex] || "";
}

function checkForCountCall(url) {
  const [path, query] = url.split("?");

  if (url.includes("channel")) {
    url = url.replace(/(metrics=)[^&]*/, (match, p1) => {
      const metrics = match
        .split("=")[1]
        .split(",")
        .filter((metric) => !metric.startsWith("authn-"))
        .join(",");
      return `${p1}${metrics}`;
    });
  }

  if (!path.includes("/event") && !path.includes("/event/")) {
    if (url.includes("/dc")) {
      const indexOfDC = url.indexOf("/dc");
      const substringBeforeDC = url.substring(0, indexOfDC);

      if (!substringBeforeDC.includes("/requestor-id/")) {
        url = url.replace(/requestor-id/g, "media-company");
      }
    }

    return url;
  }

  const params = query ? query.split("&") : [];
  const filteredParams = params.filter((param) => !param.startsWith("metrics="));
  const sanitizedQuery = filteredParams.join("&");

  return sanitizedQuery ? `${path}?${sanitizedQuery}` : path;
}

function handleWorkspaceEvent(event, payload = {}) {
  const normalizedEvent = String(event || "").trim().toLowerCase();
  if (normalizedEvent === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (normalizedEvent === "environment-switch-rerun") {
    const currentContextKey = getMegControllerContextKey(
      state.programmerId,
      state.programmerName,
      state.adobePassEnvironment?.key
    );
    if (!hasMegRunnableContext() || !currentContextKey) {
      return;
    }
    if (String(state.autoRerunInFlightContextKey || "").trim() === currentContextKey) {
      return;
    }
    if (state.esmAvailable === true && !state.workspaceLocked && !state.nonEsmMode) {
      clearPendingMegContextTransition();
      void runMeg("rerun-all");
      return;
    }
    state.pendingAutoRerunContextKey = currentContextKey;
    maybeConsumePendingAutoRerun();
    return;
  }
  if (normalizedEvent === "selection-change") {
    const selection = normalizeSelection(payload);
    if (!selection) {
      return;
    }
    applySelection(selection);
    const launchToken = String(selection.launchToken || "").trim();
    if (
      payload?.autoRun === true &&
      !state.workspaceLocked &&
      !state.nonEsmMode &&
      (!launchToken || launchToken !== state.lastLaunchTokenHandled)
    ) {
      state.lastLaunchTokenHandled = launchToken;
      void runMeg("selection-change");
    }
    return;
  }
  if (normalizedEvent === "workspace-clear") {
    clearPendingMegContextTransition();
    state.requestVersion = Number(state.requestVersion || 0) + 1;
    clearTables();
    setStatus("");
    setRerunBusy(false);
    if (loadProgress) {
      loadProgress.value = 0;
      loadProgress.style.display = "none";
    }
    document.body.style.cursor = "default";
  }
}

function registerEventHandlers() {
  btnRerunAll?.addEventListener("click", () => {
    void runMeg("rerun-all");
  });

  resetHeading?.addEventListener("click", () => {
    setupUrl();
  });

  document.getElementById("fldEsmUrl").addEventListener("paste", (event) => {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData("text");

    if (pastedText.includes("/esm/v3/")) {
      const newValue = pastedText.substring(pastedText.indexOf("/esm/v3/"));
      ack(`GOT ESM V3 URL!!! ${pastedText}`);
      ack(`MEG IT >>  ${newValue}`);
      fldEsmUrl.value = newValue;
    }
  });

  fldEsmUrl?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    void runMeg("url-enter");
  });

  fldStart?.addEventListener("change", (event) => {
    ack(`START DATE CHANGE TO : ${event.target.value}`);
    dateSink("start", event.target.value);
  });

  fldEnd?.addEventListener("change", (event) => {
    ack(`END DATE CHANGE TO : ${event.target.value}`);
    dateSink("end", event.target.value);
  });

  fldSavedQueryName?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    saveCurrentQuery();
  });

  savedQueryPicker?.addEventListener("change", () => {
    syncSavedQueryPickerTitle();
    syncSavedQueryButtonsDisabled();
    if (!getSelectedSavedQueryOption()) {
      return;
    }
    void loadSelectedSavedQuery();
  });

  btnSaveQuery?.addEventListener("click", () => {
    saveCurrentQuery();
  });

  btnDeleteQuery?.addEventListener("click", () => {
    deleteSelectedSavedQuery();
  });

  infoToggle?.addEventListener("click", () => {
    setInfoPanelCollapsed(!infoPanel?.classList.contains("is-collapsed"));
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== MEG_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
      return false;
    }
    const targetWindowId = Number(message?.targetWindowId || 0);
    if (targetWindowId > 0 && Number(state.windowId || 0) > 0 && targetWindowId !== Number(state.windowId || 0)) {
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

  const environment = await resolveAdobePassEnvironment();
  applyControllerState({
    controllerOnline: false,
    programmerId: "",
    programmerName: "",
    adobePassEnvironment: environment,
  });

  fldEsmUrl.value = "";

  if (fldStart && fldEnd) {
    fldStart.value = "";
    fldEnd.value = "";
  } else {
    ack("?DONDE ES LOS DATE FIELDOS?");
  }

  registerEventHandlers();
  populateSavedQuerySelect();
  setInfoPanelCollapsed(true);
  setRerunBusy(false);

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    bonk(result?.error || "Unable to contact UnderPar MEG controller.");
  }
}

void init();
