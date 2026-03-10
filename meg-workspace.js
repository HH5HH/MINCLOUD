const MEG_WORKSPACE_MESSAGE_TYPE = "underpar:meg-workspace";
const MEG_EXPORT_FORMATS = Object.freeze(["csv", "json", "xml", "html"]);
const MEG_SUPPRESSED_COLUMNS = new Set(["media-company"]);
const SAVED_QUERY_STORAGE_PREFIX = "underpar:saved-esm-query:";
const MEG_WORKSPACE_PAYLOAD_NODE_ID = "meg-workspace-payload";
const MEG_SAVED_QUERY_BRIDGE_MESSAGE_TYPE = "underpar:meg-saved-query-bridge";
const MEG_SAVED_QUERY_BRIDGE_RESPONSE_TYPE = `${MEG_SAVED_QUERY_BRIDGE_MESSAGE_TYPE}:response`;
const MEG_SAVED_QUERY_BRIDGE_TIMEOUT_MS = 4000;
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

const MEG_STANDALONE_PAYLOAD = (() => {
  const payloadNode = document.getElementById(MEG_WORKSPACE_PAYLOAD_NODE_ID);
  if (!payloadNode) {
    return {};
  }
  try {
    return JSON.parse(String(payloadNode.textContent || "{}"));
  } catch (_error) {
    return {};
  }
})();

const MEG_HAS_RUNTIME_MESSAGING = Boolean(globalThis.chrome?.runtime?.sendMessage);

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
  standaloneMode: !MEG_HAS_RUNTIME_MESSAGING,
  standaloneSavedQueriesSeeded: false,
  savedQueryRecords: [],
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
const btnMakeMegtool = document.getElementById("workspace-make-megtool");
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
let megSavedQueryBridgeFrame = null;
let megSavedQueryBridgeLoadPromise = null;
let megSavedQueryBridgeTargetOrigin = "";
let megSavedQueryBridgeRequestCounter = 0;
const megSavedQueryBridgePending = new Map();

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

function getMegWorkspacePayload() {
  return MEG_STANDALONE_PAYLOAD && typeof MEG_STANDALONE_PAYLOAD === "object" ? MEG_STANDALONE_PAYLOAD : {};
}

function getMegSavedQueryBridgeUrl() {
  return String(getMegWorkspacePayload()?.savedQueryBridgeUrl || "").trim();
}

function canUseMegSavedQueryBridge() {
  return isMegStandaloneMode() && Boolean(getMegSavedQueryBridgeUrl());
}

function isMegStandaloneMode() {
  return state.standaloneMode === true || !MEG_HAS_RUNTIME_MESSAGING;
}

function getMegStandaloneSavedQueryRecords() {
  const rawRecords = Array.isArray(getMegWorkspacePayload()?.savedQueries) ? getMegWorkspacePayload().savedQueries : [];
  return rawRecords
    .map((entry) => {
      const name = normalizeSavedQueryName(entry?.name || "");
      const url = String(entry?.url || "").trim();
      if (!name || !url) {
        return null;
      }
      return { name, url };
    })
    .filter(Boolean);
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
  if (btnMakeMegtool) {
    const programmerLabel = getProgrammerLabel();
    const buttonTitle = `Generate MEGTOOL for ${programmerLabel}`;
    btnMakeMegtool.title = buttonTitle;
    btnMakeMegtool.setAttribute("aria-label", buttonTitle);
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

function handleMegSavedQueryBridgeMessage(event) {
  if (event?.source !== megSavedQueryBridgeFrame?.contentWindow) {
    return;
  }
  const payload = event?.data;
  if (!payload || payload.type !== MEG_SAVED_QUERY_BRIDGE_RESPONSE_TYPE) {
    return;
  }
  const requestId = String(payload.requestId || "").trim();
  const pending = requestId ? megSavedQueryBridgePending.get(requestId) : null;
  if (!pending) {
    return;
  }
  megSavedQueryBridgePending.delete(requestId);
  window.clearTimeout(pending.timeoutId);
  if (payload.ok === false) {
    pending.reject(new Error(String(payload.error || "Saved query bridge request failed.")));
    return;
  }
  pending.resolve(payload.result ?? null);
}

async function ensureMegSavedQueryBridgeFrame() {
  if (!canUseMegSavedQueryBridge()) {
    throw new Error("Saved query bridge is unavailable.");
  }
  if (megSavedQueryBridgeFrame?.contentWindow) {
    return megSavedQueryBridgeFrame;
  }
  if (megSavedQueryBridgeLoadPromise) {
    return megSavedQueryBridgeLoadPromise;
  }
  const bridgeUrl = getMegSavedQueryBridgeUrl();
  if (!bridgeUrl) {
    throw new Error("Saved query bridge URL is missing.");
  }
  try {
    megSavedQueryBridgeTargetOrigin = new URL(bridgeUrl).origin;
  } catch (_error) {
    megSavedQueryBridgeTargetOrigin = "*";
  }
  megSavedQueryBridgeLoadPromise = new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.src = bridgeUrl;
    iframe.style.cssText = "display:none;width:0;height:0;border:0;";
    const timeoutId = window.setTimeout(() => {
      cleanup();
      iframe.remove();
      megSavedQueryBridgeLoadPromise = null;
      reject(new Error("Saved query bridge load timed out."));
    }, MEG_SAVED_QUERY_BRIDGE_TIMEOUT_MS);
    const cleanup = () => {
      window.clearTimeout(timeoutId);
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
    };
    const handleLoad = () => {
      cleanup();
      megSavedQueryBridgeFrame = iframe;
      resolve(iframe);
    };
    const handleError = () => {
      cleanup();
      megSavedQueryBridgeLoadPromise = null;
      reject(new Error("Unable to load saved query bridge."));
    };
    iframe.addEventListener("load", handleLoad, { once: true });
    iframe.addEventListener("error", handleError, { once: true });
    document.body.appendChild(iframe);
  });
  return megSavedQueryBridgeLoadPromise;
}

async function requestMegSavedQueryBridge(action = "", payload = {}) {
  const iframe = await ensureMegSavedQueryBridgeFrame();
  const targetWindow = iframe?.contentWindow;
  if (!targetWindow) {
    throw new Error("Saved query bridge window is unavailable.");
  }
  const requestId = `meg-saved-query-${Date.now()}-${(megSavedQueryBridgeRequestCounter += 1)}`;
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      megSavedQueryBridgePending.delete(requestId);
      reject(new Error("Saved query bridge timed out."));
    }, MEG_SAVED_QUERY_BRIDGE_TIMEOUT_MS);
    megSavedQueryBridgePending.set(requestId, {
      resolve,
      reject,
      timeoutId,
    });
    targetWindow.postMessage(
      {
        type: MEG_SAVED_QUERY_BRIDGE_MESSAGE_TYPE,
        requestId,
        action: String(action || "").trim(),
        payload,
      },
      megSavedQueryBridgeTargetOrigin || "*"
    );
  });
}

function buildMegAbsoluteUrl(urlValue = "") {
  const rawUrl = String(urlValue || "").trim();
  if (!rawUrl) {
    return "";
  }
  try {
    const mgmtBase =
      String(state.adobePassEnvironment?.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase || window.location.origin).trim() ||
      window.location.origin;
    return new URL(rawUrl, `${mgmtBase.replace(/\/+$/, "")}/`).toString();
  } catch (_error) {
    return rawUrl;
  }
}

function logMegConsoleUrl(label = "URL", urlValue = "") {
  const resolvedUrl = buildMegAbsoluteUrl(urlValue);
  if (!resolvedUrl) {
    return;
  }
  ack(`[URL] ${String(label || "URL").trim()}: ${resolvedUrl}`);
}

function reportMegDataCondition(message = "", urlValue = "") {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) {
    return;
  }
  const resolvedUrl = buildMegAbsoluteUrl(urlValue);
  ack(`[0x34] ${normalizedMessage}${resolvedUrl ? ` | URL: ${resolvedUrl}` : ""}`);
}

function megWorkspaceDownloadFile(payloadText, fileName, mimeType) {
  const blob = new Blob([String(payloadText || "")], {
    type: String(mimeType || "application/octet-stream"),
  });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = String(fileName || "esm-export.txt");
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 0);
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

function getMegTokenStorageScope() {
  const environment = state.adobePassEnvironment && typeof state.adobePassEnvironment === "object"
    ? state.adobePassEnvironment
    : buildFallbackEnvironmentFromInputs();
  const key = String(environment?.key || "").trim().toLowerCase();
  if (key) {
    return key;
  }
  const origin = String(environment?.spBase || environment?.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase).trim();
  try {
    return String(new URL(origin, window.location.href).host || "mgmt.auth.adobe.com").trim().toLowerCase();
  } catch {
    return String(origin || "mgmt.auth.adobe.com").trim().toLowerCase();
  }
}

function getMegTokenStorageKey() {
  const cid = getEmbeddedInputValue("cid");
  const envScope = getMegTokenStorageScope().replace(/[^a-zA-Z0-9._-]+/g, "_") || "release-production";
  if (!cid) {
    return `meg_access_token_${envScope}_default`;
  }
  const safeCid = cid.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `meg_access_token_${envScope}_${safeCid}`;
}

function getMegToken() {
  const embeddedToken = getEmbeddedInputValue("access_token");
  if (embeddedToken) {
    return embeddedToken;
  }
  try {
    return String(localStorage.getItem(getMegTokenStorageKey()) || "").trim();
  } catch (_error) {
    return "";
  }
}

function setMegToken(token = "") {
  const normalizedToken = String(token || "").trim();
  setEmbeddedInputValue("access_token", normalizedToken);
  try {
    if (normalizedToken) {
      localStorage.setItem(getMegTokenStorageKey(), normalizedToken);
    } else {
      localStorage.removeItem(getMegTokenStorageKey());
    }
  } catch (_error) {
    // Ignore localStorage failures in degraded standalone contexts.
  }
}

async function refreshMegToken() {
  const cid = getEmbeddedInputValue("cid");
  const csc = getEmbeddedInputValue("csc");
  const spBase = String(
    state.adobePassEnvironment?.spBase || getEmbeddedInputValue("sp_base") || DEFAULT_ADOBEPASS_ENVIRONMENT.spBase
  ).trim();
  if (!cid || !csc) {
    throw new Error("Missing MEGTOOL credentials for token refresh.");
  }

  const response = await fetch(
    `${spBase.replace(/\/+$/, "")}/o/client/token?grant_type=client_credentials&client_id=${encodeURIComponent(
      cid
    )}&client_secret=${encodeURIComponent(csc)}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Unable to refresh MEGTOOL token (HTTP ${response.status}${bodyText ? ` ${bodyText.trim()}` : ""}).`);
  }
  const payload = await response.json().catch(() => null);
  const accessToken = String(payload?.access_token || "").trim();
  if (!accessToken) {
    throw new Error("Token refresh did not return an access token.");
  }
  setMegToken(accessToken);
  return accessToken;
}

function megWorkspaceApplyFormatToPath(pathname = "", format = "") {
  const normalizedFormat = normalizeMegExportFormat(format, "");
  const trimmedPath = String(pathname || "").trim();
  const withoutFormatSuffix = (trimmedPath || "/").replace(/\.(json|xml|csv|html)$/i, "");
  if (!normalizedFormat) {
    return withoutFormatSuffix || "/";
  }
  return `${withoutFormatSuffix || "/"}.${normalizedFormat}`;
}

function buildMegRequestUrl(rawUrl = "", format = "json") {
  const normalizedFormat = normalizeMegExportFormat(format, "json");
  const absoluteUrl = buildMegAbsoluteUrl(rawUrl);
  if (!absoluteUrl) {
    return "";
  }
  const parsed = new URL(absoluteUrl);
  parsed.hash = "";
  parsed.pathname = megWorkspaceApplyFormatToPath(parsed.pathname, normalizedFormat);
  parsed.searchParams.delete("format");
  return checkForCountCall(parsed.toString());
}

async function megStandaloneFetchResponse(rawUrl = "", format = "json") {
  const requestUrl = buildMegRequestUrl(rawUrl, format);
  if (!requestUrl) {
    throw new Error("ESM endpoint URL is required.");
  }

  let token = getMegToken();
  if (!token) {
    token = await refreshMegToken();
  }

  let response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    token = await refreshMegToken();
    response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const bodyText = await response.text().catch(() => "");
  return {
    requestUrl,
    responseOk: response.ok,
    status: Number(response.status || 0),
    statusText: String(response.statusText || ""),
    bodyText,
    contentType: String(response.headers.get("content-type") || ""),
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

function buildMegStandaloneControllerState() {
  const payload = getMegWorkspacePayload();
  const environment =
    payload?.adobePassEnvironment && typeof payload.adobePassEnvironment === "object"
      ? {
          ...DEFAULT_ADOBEPASS_ENVIRONMENT,
          ...payload.adobePassEnvironment,
        }
      : buildFallbackEnvironmentFromInputs();
  return {
    controllerOnline: false,
    esmAvailable: true,
    esmAvailabilityResolved: true,
    esmContainerVisible: true,
    programmerId: String(payload?.programmerId || payload?.programmer?.programmerId || "").trim(),
    programmerName: String(payload?.programmerName || payload?.programmer?.programmerName || "").trim(),
    adobePassEnvironment: environment,
    requestorIds: Array.isArray(payload?.requestorIds)
      ? payload.requestorIds.map((value) => String(value || "").trim()).filter(Boolean)
      : [],
    mvpdIds: Array.isArray(payload?.mvpdIds)
      ? payload.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean)
      : [],
    controllerStateVersion: Number(payload?.controllerStateVersion || 1),
    updatedAt: Number(payload?.updatedAt || Date.now()),
  };
}

function getMegStandaloneSelectionPayload() {
  const payload = getMegWorkspacePayload();
  if (payload?.selection && typeof payload.selection === "object") {
    return payload.selection;
  }
  const initialUrl = String(payload?.initialUrl || "").trim();
  if (!initialUrl) {
    return null;
  }
  return {
    endpointPath: initialUrl,
    endpointLabel: String(payload?.selectionLabel || payload?.displayNodeLabel || "").trim(),
    endpointUrl: buildMegAbsoluteUrl(initialUrl),
  };
}

function seedStandaloneSavedQueries() {
  if (!isMegStandaloneMode() || state.standaloneSavedQueriesSeeded === true) {
    return;
  }
  const records = getMegStandaloneSavedQueryRecords();
  if (records.length === 0) {
    state.standaloneSavedQueriesSeeded = true;
    return;
  }
  records.forEach((record) => {
    try {
      localStorage.setItem(buildSavedQueryStorageKey(record.name), buildSavedQueryPayload(record.name, record.url));
    } catch (error) {
      ack(`Saved query standalone seed failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  state.standaloneSavedQueriesSeeded = true;
}

function applyStandaloneBootstrapState() {
  if (!isMegStandaloneMode()) {
    return;
  }
  const payload = getMegWorkspacePayload();
  const selection = getMegStandaloneSelectionPayload();
  if (selection) {
    applySelection(selection);
  }
  const initialUrl = String(payload?.initialUrl || "").trim();
  if (initialUrl) {
    fldEsmUrl.value = initialUrl;
  }
  if (fldStart) {
    fldStart.value = String(payload?.initialStart || "").trim();
  }
  if (fldEnd) {
    fldEnd.value = String(payload?.initialEnd || "").trim();
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  if (isMegStandaloneMode()) {
    const normalizedAction = String(action || "").trim().toLowerCase();
    if (normalizedAction === "workspace-ready") {
      return {
        ok: true,
        controllerOnline: false,
      };
    }
    if (normalizedAction === "resolve-run-context") {
      const controllerState = buildMegStandaloneControllerState();
      const selection = getMegStandaloneSelectionPayload();
      return {
        ok: true,
        controllerState,
        selection,
        programmerLabel: getProgrammerLabel(),
        clientId: getEmbeddedInputValue("cid"),
        clientSecret: getEmbeddedInputValue("csc"),
        accessToken: getMegToken(),
        requestorIds: Array.isArray(controllerState?.requestorIds) ? controllerState.requestorIds.slice(0, 24) : [],
        mvpdIds: Array.isArray(controllerState?.mvpdIds) ? controllerState.mvpdIds.slice(0, 24) : [],
      };
    }
    if (normalizedAction === "fetch-esm") {
      const response = await megStandaloneFetchResponse(String(payload?.url || ""), String(payload?.format || "json"));
      return {
        ok: true,
        ...response,
      };
    }
    if (normalizedAction === "download-csv" || normalizedAction === "download-export") {
      const format =
        normalizedAction === "download-csv"
          ? "csv"
          : normalizeMegExportFormat(String(payload?.format || ""), "csv");
      const response = await megStandaloneFetchResponse(String(payload?.url || ""), format);
      if (!response.responseOk) {
        return {
          ok: false,
          error: String(response.bodyText || `${format.toUpperCase()} request failed (${response.status || 0})`),
        };
      }
      const fileName = `esm_${sanitizeMegDownloadSegment(getProgrammerLabel())}_${Date.now()}.${format}`;
      const mimeType =
        response.contentType ||
        {
          csv: "text/csv;charset=utf-8",
          json: "application/json;charset=utf-8",
          xml: "application/xml;charset=utf-8",
          html: "text/html;charset=utf-8",
        }[format] ||
        "application/octet-stream";
      megWorkspaceDownloadFile(response.bodyText, fileName, mimeType);
      return {
        ok: true,
        fileName,
        format,
      };
    }
    return {
      ok: false,
      error: `Unsupported standalone MEGTOOL action: ${normalizedAction || "unknown"}`,
    };
  }

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

function sanitizeMegDownloadSegment(value = "") {
  const normalized = String(value || "").trim().replace(/[^a-z0-9._-]+/gi, "_").replace(/^_+|_+$/g, "");
  return normalized || "MediaCompany";
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

function generateTable(data, requestUrl = "") {
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

  if (rows.length === 0) {
    reportMegDataCondition("No data returned from ESM.", requestUrl);
    return;
  }

  if (rows.length > 0 && headers.length === 0) {
    reportMegDataCondition("No visible report columns were returned from ESM.", requestUrl);
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

function renderData(data, requestUrl = "") {
  if (Object.hasOwn(data, "_links")) {
    generateDD_TBL(data._links);
  }

  if (Object.hasOwn(data, "report")) {
    generateTable(data.report, requestUrl);
  } else {
    reportMegDataCondition("Unexpected ESM payload shape. No report field was returned.", requestUrl);
    ack("No report found. Generating table with raw data...");
    generateTable(data, requestUrl);
  }
}

async function dasink(requestVersion = 0) {
  const bodyElement = document.body;
  let activeRequestUrl = "";
  let originalRequestUrl = "";
  let retryRequestUrl = "";

  try {
    bodyElement.style.cursor = "wait";
    if (loadProgress) {
      loadProgress.value = 1;
      loadProgress.style.display = "block";
    }
    setRerunBusy(true);
    setStatus("");

    let esmUrl = checkForCountCall(fldEsmUrl.value);
    originalRequestUrl = esmUrl;
    activeRequestUrl = esmUrl;
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
        retryRequestUrl = sanitizedEsmUrl;
        activeRequestUrl = sanitizedEsmUrl;
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
          const retryError = new Error(`Failed to fetch ESM data: ${errorText2}`);
          retryError.megUrl = sanitizedEsmUrl;
          retryError.megOriginalUrl = esmUrl;
          throw retryError;
        }

        const data4 = JSON.parse(String(response4.bodyText || "{}"));
        const alertMessage =
          "Hey, your original call didn't work because of a METRICS mis-match.\n\n" +
          `Here was the original query:\n${esmUrl}\n\n` +
          `Here is what was run and is being displayed:\n${sanitizedEsmUrl}`;

        alert(alertMessage);
        ack(alertMessage);
        logMegConsoleUrl("Original request URL", esmUrl);
        logMegConsoleUrl("Sanitized retry URL", sanitizedEsmUrl);
        renderData(data4, sanitizedEsmUrl);
        return;
      }
      const fetchError = new Error(`Failed to fetch ESM data: ${errorText}`);
      fetchError.megUrl = esmUrl;
      throw fetchError;
    }

    const data3 = JSON.parse(String(response3.bodyText || "{}"));
    if (!isMegRequestCurrent(requestVersion)) {
      return;
    }
    renderData(data3, esmUrl);
  } catch (error) {
    if (isMegRequestCurrent(requestVersion)) {
      bonk(`[0x33] Error: ${error.message}`, {
        url: error?.megUrl || activeRequestUrl || originalRequestUrl,
        originalUrl: error?.megOriginalUrl || (retryRequestUrl ? originalRequestUrl : ""),
        retryUrl: error?.megRetryUrl || retryRequestUrl,
      });
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
    bonk(`[0x35] ${error.message}`, {
      url: fldEsmUrl.value,
    });
  }
}

async function exportMegTearsheet() {
  if (!ensureMegWorkspaceAccess("generate a MEGTOOL tearsheet")) {
    return;
  }
  try {
    const result = await sendWorkspaceAction("make-tearsheet", {
      currentUrl: String(fldEsmUrl?.value || "").trim(),
      currentStart: String(fldStart?.value || "").trim(),
      currentEnd: String(fldEnd?.value || "").trim(),
      selection: state.currentSelection && typeof state.currentSelection === "object" ? { ...state.currentSelection } : null,
    });
    if (!result?.ok) {
      throw new Error(result?.error || "Unable to export MEGTOOL tearsheet.");
    }
    setStatus("MEGTOOL tearsheet download started.");
    ack(`MEGTOOL tearsheet download started: ${String(result.fileName || "MEGTOOL.html")}`);
  } catch (error) {
    bonk(`[0x36] ${error instanceof Error ? error.message : String(error)}`, {
      url: fldEsmUrl?.value || "",
    });
  }
}

function bonk(msg, options = {}) {
  setStatus(msg, "error");
  ack(`<OOPS>${msg}</OOPS>`);
  const primaryUrl = String(options?.url || "").trim();
  const originalUrl = String(options?.originalUrl || "").trim();
  const retryUrl = String(options?.retryUrl || "").trim();
  if (primaryUrl) {
    logMegConsoleUrl("Request URL", primaryUrl);
  }
  if (originalUrl && originalUrl !== primaryUrl) {
    logMegConsoleUrl("Original request URL", originalUrl);
  }
  if (retryUrl && retryUrl !== primaryUrl && retryUrl !== originalUrl) {
    logMegConsoleUrl("Retry request URL", retryUrl);
  }
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
  try {
    const parsed = JSON.parse(normalizedPayload);
    if (parsed && typeof parsed === "object") {
      const parsedName = normalizeSavedQueryName(parsed.name || "");
      const parsedUrl = String(parsed.url || parsed.esmUrl || "").trim();
      if (parsedName && parsedUrl) {
        return {
          storageKey: normalizedStorageKey,
          name: parsedName,
          url: parsedUrl,
        };
      }
    }
  } catch (_error) {
    // Fall through to legacy string parsing.
  }
  const separatorIndex = normalizedPayload.indexOf("|");
  if (separatorIndex <= 0) {
    const rawName = normalizeSavedQueryName(
      decodeURIComponent(normalizedStorageKey.slice(SAVED_QUERY_STORAGE_PREFIX.length) || "")
    );
    const rawUrl = normalizedPayload;
    if (rawName && rawUrl) {
      return {
        storageKey: normalizedStorageKey,
        name: rawName,
        url: rawUrl,
      };
    }
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
  const widthLabel = [...savedQueryPicker.options]
    .map((option) => String(option?.textContent || "").trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length)[0] || "Saved Queries";
  const nextWidthCh = Math.min(Math.max(widthLabel.length + 4, 18), 52);
  const title = selectedOption ? String(selectedOption.value || "").trim() : "Saved Queries";
  savedQueryPicker.style.width = `${nextWidthCh}ch`;
  savedQueryPicker.title = title;
  savedQueryPicker.setAttribute("aria-label", selectedOption ? `Saved ESM Query: ${selectedOption.textContent || ""}` : "Saved Queries");
}

function populateSavedQuerySelect(preferredStorageKey = "", records = state.savedQueryRecords) {
  if (!savedQueryPicker) {
    return;
  }

  const fallbackStorageKey =
    String(preferredStorageKey || "").trim() ||
    String(savedQueryPicker.selectedOptions?.[0]?.dataset.storageKey || "").trim();

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

async function loadSavedQueryRecords() {
  if (canUseMegSavedQueryBridge()) {
    try {
      const result = await requestMegSavedQueryBridge("get-records");
      const rawRecords = Array.isArray(result?.records) ? result.records : [];
      return rawRecords
        .map((record) => {
          const name = normalizeSavedQueryName(record?.name || "");
          const url = String(record?.url || "").trim();
          const storageKey = String(record?.storageKey || buildSavedQueryStorageKey(name)).trim();
          if (!name || !url || !storageKey) {
            return null;
          }
          return {
            storageKey,
            name,
            url,
          };
        })
        .filter(Boolean)
        .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
    } catch (error) {
      ack(`Saved query bridge read failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return getSavedQueryRecords();
}

async function refreshSavedQuerySelect(preferredStorageKey = "") {
  state.savedQueryRecords = await loadSavedQueryRecords();
  populateSavedQuerySelect(preferredStorageKey, state.savedQueryRecords);
}

async function persistSavedQueryRecord(queryName = "", esmUrl = "") {
  const storageKey = buildSavedQueryStorageKey(queryName);
  const nextPayload = buildSavedQueryPayload(queryName, esmUrl);
  if (canUseMegSavedQueryBridge()) {
    try {
      const result = await requestMegSavedQueryBridge("put-record", {
        name: queryName,
        url: esmUrl,
        storageKey,
        payload: nextPayload,
      });
      return {
        storageKey: String(result?.storageKey || storageKey).trim(),
        existed: result?.existed === true,
      };
    } catch (error) {
      ack(`Saved query bridge save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const existingPayload = localStorage.getItem(storageKey);
  localStorage.setItem(storageKey, nextPayload);
  return {
    storageKey,
    existed: Boolean(existingPayload),
  };
}

async function removeSavedQueryRecord(storageKey = "") {
  const normalizedStorageKey = String(storageKey || "").trim();
  if (!normalizedStorageKey) {
    return;
  }
  if (canUseMegSavedQueryBridge()) {
    try {
      await requestMegSavedQueryBridge("delete-record", {
        storageKey: normalizedStorageKey,
      });
      return;
    } catch (error) {
      ack(`Saved query bridge delete failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  localStorage.removeItem(normalizedStorageKey);
}

function reportSavedQueryStatus(message = "", type = "info") {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) {
    return;
  }
  setStatus(normalizedMessage, type);
  ack(normalizedMessage);
}

async function saveCurrentQuery() {
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

  try {
    const result = await persistSavedQueryRecord(queryName, esmUrl);
    await refreshSavedQuerySelect(result?.storageKey || buildSavedQueryStorageKey(queryName));
    setSavedQueryCue(false);
    if (fldSavedQueryName) {
      fldSavedQueryName.value = "";
      fldSavedQueryName.blur();
    }
    reportSavedQueryStatus(
      result?.existed ? `Updated Saved ESM Query "${queryName}".` : `Saved ESM Query "${queryName}".`
    );
  } catch (error) {
    reportSavedQueryStatus(
      `Unable to save Saved ESM Query: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
  }
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

async function deleteSelectedSavedQuery() {
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
    await removeSavedQueryRecord(storageKey);
    await refreshSavedQuerySelect();
    reportSavedQueryStatus(`Deleted Saved ESM Query "${savedQueryName}".`);
  } catch (error) {
    reportSavedQueryStatus(
      `Unable to delete Saved ESM Query: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
  }
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

  btnMakeMegtool?.addEventListener("click", () => {
    void exportMegTearsheet();
  });

  resetHeading?.addEventListener("click", () => {
    setupUrl();
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
    void saveCurrentQuery();
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
    void saveCurrentQuery();
  });

  btnDeleteQuery?.addEventListener("click", () => {
    void deleteSelectedSavedQuery();
  });

  infoToggle?.addEventListener("click", () => {
    setInfoPanelCollapsed(!infoPanel?.classList.contains("is-collapsed"));
  });

  if (MEG_HAS_RUNTIME_MESSAGING && globalThis.chrome?.runtime?.onMessage) {
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

  window.addEventListener("message", handleMegSavedQueryBridgeMessage);
}

async function init() {
  if (MEG_HAS_RUNTIME_MESSAGING && globalThis.chrome?.windows?.getCurrent) {
    try {
      const currentWindow = await chrome.windows.getCurrent();
      state.windowId = Number(currentWindow?.id || 0);
    } catch {
      state.windowId = 0;
    }
  } else {
    state.windowId = 0;
  }

  if (isMegStandaloneMode()) {
    applyControllerState(buildMegStandaloneControllerState());
  } else {
    const environment = await resolveAdobePassEnvironment();
    applyControllerState({
      controllerOnline: false,
      programmerId: "",
      programmerName: "",
      adobePassEnvironment: environment,
    });
  }

  fldEsmUrl.value = "";

  if (fldStart && fldEnd) {
    fldStart.value = "";
    fldEnd.value = "";
  } else {
    ack("?DONDE ES LOS DATE FIELDOS?");
  }

  seedStandaloneSavedQueries();
  registerEventHandlers();
  applyStandaloneBootstrapState();
  await refreshSavedQuerySelect();
  setInfoPanelCollapsed(true);
  setRerunBusy(false);
  syncFloatingContext();

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    bonk(result?.error || "Unable to contact UnderPar MEG controller.");
    return;
  }
  if (isMegStandaloneMode()) {
    const payload = getMegWorkspacePayload();
    if (payload?.autoRun === true && hasMegRunnableContext() && !state.workspaceLocked && !state.nonEsmMode) {
      void runMeg("standalone-init");
    }
  }
}

void init();
