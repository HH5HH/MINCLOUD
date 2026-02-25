const IMS_CLIENT_ID = "adobeExperienceCloudDebugger";
const IMS_SCOPE =
  "AdobeID,openid,avatar,session,read_organizations,additional_info.job_function,additional_info.projectedProductContext,additional_info.account_type,additional_info.roles,additional_info.user_image_url,analytics_services";
const IMS_AUTHORIZE_URL = "https://ims-na1.adobelogin.com/ims/authorize/v1";
const IMS_PROFILE_URL = "https://ims-na1.adobelogin.com/ims/profile/v1";
const IMS_ORGS_URL = "https://ims-na1.adobelogin.com/ims/organizations/v5";
const IMS_LEGACY_REDIRECT_URI = "https://login.aepdebugger.adobe.com";
const LOGIN_HELPER_PATH = "src/login/login.html";
const LOGIN_HELPER_RESULT_PREFIX = "underpar_helper_result_v1:";
const LEGACY_LOGIN_HELPER_RESULT_PREFIX = "mincloudlogin_helper_result_v1:";
const LOGIN_HELPER_RESULT_MESSAGE_TYPE = "underpar:loginHelperResult";
const LEGACY_LOGIN_HELPER_RESULT_MESSAGE_TYPE = "mincloudlogin:loginHelperResult";
const CONSOLE_AUTH_CALLBACK_PREFIX = "https://console.auth.adobe.com/oauth2/callback";

const ADOBE_CONSOLE_BASE = "https://console.auth.adobe.com";
const ADOBE_MGMT_BASE = "https://mgmt.auth.adobe.com";
const ADOBE_SP_BASE = "https://sp.auth.adobe.com";
const REST_V2_BASE = `${ADOBE_SP_BASE}/api/v2`;
const PROGRAMMER_ENDPOINTS = [
  `${ADOBE_CONSOLE_BASE}/rest/api/entity/Programmer?configurationVersion=3522`,
  `${ADOBE_CONSOLE_BASE}/rest/api/entity/Programmer`,
  `${ADOBE_CONSOLE_BASE}/rest/api/programmers`,
  `${ADOBE_CONSOLE_BASE}/rest/api/v1/programmers`,
];
const DCR_CACHE_PREFIX = "underpar_dcr_cache_v1";
const LEGACY_DCR_CACHE_PREFIX = "mincloudlogin_dcr_cache_v1";
const PREMIUM_SERVICE_ORDER = ["restV2", "esm", "degradation"];
const PREMIUM_SERVICE_DISPLAY_ORDER = ["restV2", "clickEsm", "decompTree", "degradation"];
const PREMIUM_SERVICE_SCOPE_BY_KEY = {
  degradation: "decisions:owner",
  esm: "analytics:client",
  restV2: "api:client:v2",
};
const REST_V2_SCOPE = PREMIUM_SERVICE_SCOPE_BY_KEY.restV2;
const PREMIUM_SERVICE_TITLE_BY_KEY = {
  degradation: "Degradation",
  esm: "ESM",
  clickEsm: "clickESM",
  decompTree: "decomp",
  restV2: "REST V2",
};
const REST_V2_DEVICE_ID_STORAGE_KEY = "underpar_restv2_device_id_v1";
const LEGACY_REST_V2_DEVICE_ID_STORAGE_KEY = "mincloudlogin_restv2_device_id_v1";
const REST_V2_DEFAULT_DOMAIN = "adobe.com";
const REST_V2_REDIRECT_CANDIDATES = [
  "https://sp.auth-staging.adobe.com/apitest/api.html",
  `${ADOBE_SP_BASE}/apitest/api.html`,
  `${ADOBE_SP_BASE}/api.html`,
];

const STORAGE_KEY = "ims_login_data";
const DEBUG_FLOW_STORAGE_INDEX_KEY = "underpardebug_flow_index_v1";
const LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY = "minclouddebug_flow_index_v1";
const DEBUG_FLOW_STORAGE_PREFIX = "underpardebug_flow_v1:";
const LEGACY_DEBUG_FLOW_STORAGE_PREFIX = "minclouddebug_flow_v1:";
const AUTH_WINDOW_TIMEOUT_MS = 180000;
const TOKEN_REFRESH_LEEWAY_MS = 2 * 60 * 1000;
const AUTH_DEBUGGER_PROTOCOL_VERSION = "1.3";
const RATE_LIMIT_MAX_RETRIES = 4;
const RATE_LIMIT_BASE_DELAY_MS = 1200;
const RATE_LIMIT_MAX_DELAY_MS = 60000;
const RATE_LIMIT_JITTER_MS = 400;
const REST_V2_CONFIG_ATTEMPT_CONCURRENCY = 2;
const REST_V2_PREPARED_LOGIN_MAX_AGE_MS = 2 * 60 * 1000;
const DEBUG_TEXT_PREVIEW_LIMIT = 12000;
const DEBUG_REDACT_SENSITIVE = false;
const UP_TRACE_VIEW_PATH = "up-devtools-panel.html";
const REST_V2_LOGIN_WINDOW_WIDTH = 980;
const REST_V2_LOGIN_WINDOW_HEIGHT = 860;
const REST_V2_LOGOUT_NAVIGATION_TIMEOUT_MS = 35000;
const REST_V2_LOGOUT_POST_NAV_DELAY_MS = 1200;
const ESM_INLINE_RESULT_LIMIT = 50;
const ESM_AUTO_REFRESH_INTERVAL_MS = 60 * 1000;
const CLICK_ESM_INLINE_RESULT_LIMIT = 50;
const CLICK_ESM_CSV_RESULT_LIMIT = 10000;
const CLICK_ESM_ENDPOINTS_PATH = "click-esm-endpoints.json";
const DECOMP_INLINE_RESULT_LIMIT = 50;
const DECOMP_CSV_RESULT_LIMIT = 10000;
const DECOMP_WORKSPACE_PATH = "decomp-workspace.html";
const DECOMP_MESSAGE_TYPE = "underpar:decomp";
const LEGACY_DECOMP_MESSAGE_TYPE = "mincloud:decomp";
const ESM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
// Redirect-host filtering mode for HAR trimming.
// - "exact_path": ignore only the exact redirect URL path
// - "path_tree": ignore redirect URL path and subtree
// - "origin_except_pass": ignore entire redirect origin except PASS-critical paths
const REDIRECT_IGNORE_MATCHER_MODE = "origin_except_pass";

const ADOBEPASS_ORG_KEYWORD = "adobepass";
const ADOBEPASS_ORG_HANDLE = "@adobepass";
const ADOBEPASS_ORG_ID_ALLOWLIST = [];
const DEFAULT_AVATAR = "icons/underpar-128.png";
const FALLBACK_AVATAR_ASSET = "icons/underpar-128.png";
const FALLBACK_AVATAR = chrome.runtime.getURL(FALLBACK_AVATAR_ASSET);
const AVATAR_CACHE_TTL_SECONDS = 3600;
const AVATAR_SIZE_PREFERENCES = [128, 64, 256, 32];
const AVATAR_MAX_RESOLVE_CANDIDATES = 20;
const AVATAR_DIRECT_LOAD_TIMEOUT_MS = 1200;
const AVATAR_IMS_REFRESH_COOLDOWN_MS = 2 * 60 * 1000;
const IMS_AVATAR_CLIENT_IDS = ["AdobePass1", IMS_CLIENT_ID];
const IMS_PROFILE_CLIENT_IDS = [IMS_CLIENT_ID, "AdobePass1"];
const AVATAR_CACHE_STORAGE_PREFIX = "underpar_avatar_cache_v2:";
const LEGACY_AVATAR_CACHE_STORAGE_PREFIX = "mincloudlogin_avatar_cache_v2:";
const AVATAR_MAX_LOCALSTORAGE_DATAURL_BYTES = 220000;
const IMS_LOGOUT_URLS = [
  `https://ims-na1.adobelogin.com/ims/logout/v1?client_id=${encodeURIComponent(IMS_CLIENT_ID)}&locale=en_US`,
  "https://ims-na1.adobelogin.com/ims/logout/v1?client_id=AdobePass1&locale=en_US",
  "https://ims-na1.adobelogin.com/ims/logout?locale=en_US",
];
const LOGIN_HELPER_RESULT_MESSAGE_TYPES = new Set([
  LOGIN_HELPER_RESULT_MESSAGE_TYPE,
  LEGACY_LOGIN_HELPER_RESULT_MESSAGE_TYPE,
]);
const DECOMP_MESSAGE_TYPES = new Set([DECOMP_MESSAGE_TYPE, LEGACY_DECOMP_MESSAGE_TYPE]);

const state = {
  busy: false,
  restricted: false,
  restrictedOrgOptions: [],
  selectedRestrictedOrgKey: "",
  restrictedOrgSwitchBusy: false,
  restrictedLoginLabel: "",
  restrictedOrgLabel: "",
  restrictedRecoveryLabel: "",
  sessionReady: false,
  avatarMenuOpen: false,
  avatarResolvedUrl: "",
  avatarObjectUrl: "",
  avatarResolveKey: "",
  avatarImsRefreshKey: "",
  avatarImsRefreshAt: 0,
  avatarResolving: false,
  avatarFailureLogged: false,
  avatarMemoryCache: new Map(),
  loginData: null,
  programmers: [],
  selectedMediaCompany: "",
  selectedRequestorId: "",
  selectedMvpdId: "",
  selectedProgrammerKey: "",
  programmersApiEndpoint: null,
  refreshTimeoutId: null,
  mvpdCacheByRequestor: new Map(),
  mvpdLoadPromiseByRequestor: new Map(),
  restV2AuthContextByRequestor: new Map(),
  restV2PrewarmedAppsByProgrammerId: new Map(),
  restV2PreparedLoginBySelectionKey: new Map(),
  restV2PreparePromiseBySelectionKey: new Map(),
  restV2PrepareErrorBySelectionKey: new Map(),
  restV2LastLaunchTabId: 0,
  restV2LastLaunchWindowId: 0,
  restV2PreviousTabId: 0,
  restV2PreviousTabUrl: "",
  restV2DebugFlowId: "",
  restV2RecordingActive: false,
  restV2RecordingStartedAt: 0,
  restV2RecordingContext: null,
  restV2Stopping: false,
  restV2TraceViewerWindowId: 0,
  restV2TraceViewerTabId: 0,
  applicationsByProgrammerId: new Map(),
  premiumAppsByProgrammerId: new Map(),
  premiumAppsLoadPromiseByProgrammerId: new Map(),
  premiumSectionCollapsedByKey: new Map(),
  premiumPanelRequestToken: 0,
  dcrEnsureTokenPromiseByKey: new Map(),
  consoleContextReady: false,
  consoleContextPromise: null,
  isBootstrapping: false,
  decompWorkspaceTabId: 0,
  decompWorkspaceWindowId: 0,
  decompWorkspaceTabIdByWindowId: new Map(),
  decompRuntimeListenerBound: false,
  decompWorkspaceTabWatcherBound: false,
  decompDebugFlowId: "",
  decompRecordingActive: false,
  decompRecordingStartedAt: 0,
  decompRecordingContext: null,
  decompStopping: false,
  decompTraceViewerWindowId: 0,
  decompTraceViewerTabId: 0,
};

const els = {
  authBtn: document.getElementById("auth-btn"),
  status: document.getElementById("status"),
  buildInfo: document.getElementById("build-info"),
  restrictedView: document.getElementById("restricted-view"),
  restrictedOrgSelect: document.getElementById("restricted-org-select"),
  restrictedOrgHint: document.getElementById("restricted-org-hint"),
  restrictedOrgSwitchBtn: document.getElementById("restricted-org-switch-btn"),
  restrictedSignInBtn: document.getElementById("restricted-sign-in-btn"),
  restrictedSignOutBtn: document.getElementById("restricted-sign-out-btn"),
  restrictedLoginState: document.getElementById("restricted-login-state"),
  restrictedOrgState: document.getElementById("restricted-org-state"),
  restrictedRecoveryState: document.getElementById("restricted-recovery-state"),
  workflow: document.getElementById("workflow"),
  avatarMenu: document.getElementById("avatar-menu"),
  avatarMenuImage: document.getElementById("avatar-menu-image"),
  avatarMenuName: document.getElementById("avatar-menu-name"),
  avatarMenuEmail: document.getElementById("avatar-menu-email"),
  avatarMenuOrg: document.getElementById("avatar-menu-org"),
  avatarMenuDetails: document.getElementById("avatar-menu-details"),
  signOutBtn: document.getElementById("sign-out-btn"),
  mediaCompanySelect: document.getElementById("media-company-select"),
  requestorSelect: document.getElementById("requestor-select"),
  mvpdSelect: document.getElementById("mvpd-select"),
  premiumServicesContainer: document.getElementById("premium-services-container"),
};

let clickEsmEndpoints = [];
let clickEsmEndpointsPromise = null;

function log(message, details = null) {
  if (details === null) {
    console.log(`[UnderPAR] ${message}`);
    return;
  }
  console.log(`[UnderPAR] ${message}`, details);
}

function setStatus(message = "", type = "info") {
  const normalizedMessage = String(message || "").trim();
  els.status.textContent = normalizedMessage;
  els.status.hidden = normalizedMessage.length === 0;
  els.status.classList.remove("error", "success");
  if (type === "error") {
    els.status.classList.add("error");
  } else if (type === "success") {
    els.status.classList.add("success");
  }
}

function setBusy(isBusy, context = "") {
  state.busy = isBusy;

  if (!state.sessionReady) {
    els.authBtn.disabled = isBusy;
    const busyLabel = context && context.toLowerCase().includes("sign") ? "Signing In..." : "Checking...";
    els.authBtn.textContent = isBusy ? busyLabel : "Sign In";
    els.authBtn.title = context || "Sign in to AdobePass";
    return;
  }

  els.authBtn.disabled = isBusy;
  els.authBtn.title = isBusy ? "Working..." : "Account menu";
}

function truncateDebugText(value, limit = DEBUG_TEXT_PREVIEW_LIMIT) {
  const text = typeof value === "string" ? value : String(value ?? "");
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}... [truncated ${text.length - limit} chars]`;
}

function redactDebugHeaderValue(headerName, value) {
  if (!DEBUG_REDACT_SENSITIVE) {
    return String(value ?? "");
  }

  const key = String(headerName || "").trim().toLowerCase();
  if (key === "authorization" || key === "cookie" || key === "set-cookie" || key === "x-api-key") {
    return "<redacted>";
  }
  return String(value ?? "");
}

function toDebugHeadersObject(headersLike) {
  if (!headersLike) {
    return {};
  }

  const output = {};
  if (headersLike instanceof Headers) {
    for (const [key, value] of headersLike.entries()) {
      output[key] = redactDebugHeaderValue(key, value);
    }
    return output;
  }

  if (Array.isArray(headersLike)) {
    for (const pair of headersLike) {
      if (!Array.isArray(pair) || pair.length < 2) {
        continue;
      }
      const [key, value] = pair;
      output[String(key)] = redactDebugHeaderValue(key, value);
    }
    return output;
  }

  if (typeof headersLike === "object") {
    for (const [key, value] of Object.entries(headersLike)) {
      output[key] = redactDebugHeaderValue(key, value);
    }
  }

  return output;
}

async function sendRuntimeMessageSafe(payload) {
  try {
    return await chrome.runtime.sendMessage(payload);
  } catch {
    return null;
  }
}

async function startRestV2DebugFlow(context = {}, trigger = "test-mvpd-login") {
  const response = await sendRuntimeMessageSafe({
    type: "underpardebug:startFlow",
    trigger,
    context,
  });
  if (response?.ok && typeof response.flowId === "string" && response.flowId) {
    return response.flowId;
  }
  return "";
}

function emitRestV2DebugEvent(flowId, event = {}) {
  if (!flowId) {
    return;
  }

  void sendRuntimeMessageSafe({
    type: "underpardebug:traceEvent",
    flowId,
    event,
  });
}

async function bindRestV2DebugFlowToTab(flowId, tabId, metadata = {}) {
  if (!flowId || !Number.isFinite(Number(tabId)) || Number(tabId) <= 0) {
    return false;
  }

  const response = await sendRuntimeMessageSafe({
    type: "underpardebug:bindFlowTab",
    flowId,
    tabId: Number(tabId),
    metadata,
  });
  return Boolean(response?.ok);
}

async function stopRestV2DebugFlowAndSnapshot(flowId, reason = "manual") {
  const normalizedFlowId = String(flowId || "").trim();
  if (!normalizedFlowId) {
    return { ok: false, flow: null };
  }

  const response = await sendRuntimeMessageSafe({
    type: "underpardebug:stopFlow",
    flowId: normalizedFlowId,
    reason,
  });
  if (!response || typeof response !== "object") {
    return { ok: false, flow: null };
  }
  return {
    ok: response.ok === true,
    flow: response.flow && typeof response.flow === "object" ? response.flow : null,
    error: response.error ? String(response.error) : "",
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseJsonText(text, fallback = {}) {
  try {
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeHttpErrorMessage(value) {
  const raw = String(value || "");
  if (!raw) {
    return "";
  }

  const collapsed = raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!collapsed) {
    return "";
  }

  return collapsed.length > 220 ? `${collapsed.slice(0, 217)}...` : collapsed;
}

function extractApiErrorCode(value) {
  if (!value) {
    return "";
  }

  let payload = value;
  if (typeof payload === "string") {
    payload = parseJsonText(payload, null);
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  return String(
    firstNonEmptyString([
      payload?.code,
      payload?.error,
      payload?.errorCode,
      payload?.error_code,
      payload?.error?.code,
      payload?.error?.error,
      payload?.error?.errorCode,
      payload?.error?.error_code,
    ]) || ""
  )
    .trim()
    .toLowerCase();
}

function isServiceProviderTokenMismatchError(value) {
  const code = extractApiErrorCode(value);
  if (code === "invalid_access_token_service_provider") {
    return true;
  }

  if (typeof value === "string") {
    return value.toLowerCase().includes("invalid_access_token_service_provider");
  }

  return false;
}

function sleepMs(durationMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, Number(durationMs) || 0));
  });
}

function parseRetryAfterMs(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return 0;
  }

  if (/^\d+$/.test(raw)) {
    return Math.max(0, Number(raw) * 1000);
  }

  const parsedDateMs = Date.parse(raw);
  if (!Number.isFinite(parsedDateMs)) {
    return 0;
  }

  return Math.max(0, parsedDateMs - Date.now());
}

function resolveRateLimitDelayMs(response, attemptIndex) {
  const retryAfterMs = parseRetryAfterMs(response.headers?.get("Retry-After"));
  if (retryAfterMs > 0) {
    return Math.min(retryAfterMs, RATE_LIMIT_MAX_DELAY_MS);
  }

  const safeAttempt = Math.max(0, Number(attemptIndex) || 0);
  const baseDelay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, safeAttempt);
  const jitter = Math.floor(Math.random() * RATE_LIMIT_JITTER_MS);
  return Math.min(baseDelay + jitter, RATE_LIMIT_MAX_DELAY_MS);
}

async function fetchWithRateLimitRetry(requestFactory, contextLabel, options = {}) {
  const maxRetries =
    Number.isFinite(options.maxRetries) && Number(options.maxRetries) >= 0
      ? Number(options.maxRetries)
      : RATE_LIMIT_MAX_RETRIES;

  let attempt = 0;
  while (true) {
    const response = await requestFactory();
    if (response.status !== 429 || attempt >= maxRetries) {
      return response;
    }

    const delayMs = resolveRateLimitDelayMs(response, attempt);
    const retryCount = attempt + 1;
    const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
    log(`${contextLabel} rate limited (429); retrying in ${delaySeconds}s.`, {
      attempt: retryCount,
      maxRetries,
      delayMs,
    });

    if (typeof options.onRetry === "function") {
      try {
        options.onRetry({ attempt: retryCount, maxRetries, delayMs, response });
      } catch {
        // Ignore UI callback failures.
      }
    }

    await response.text().catch(() => "");
    await sleepMs(delayMs);
    attempt = retryCount;
  }
}

function extractAuthorizationCodeUrl(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidate = firstNonEmptyString([
    payload.authorization_code_url,
    payload.authorizationCodeUrl,
    payload?.error?.authorization_code_url,
    payload?.error?.authorizationCodeUrl,
  ]);

  if (!candidate) {
    return "";
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

async function ensureConsoleSecurityContext(authorizationCodeUrl) {
  if (!authorizationCodeUrl) {
    return false;
  }

  if (state.consoleContextReady) {
    return true;
  }

  if (state.consoleContextPromise) {
    return state.consoleContextPromise;
  }

  state.consoleContextPromise = (async () => {
    try {
      await runAuthInPopupWindow(authorizationCodeUrl, CONSOLE_AUTH_CALLBACK_PREFIX);
      state.consoleContextReady = true;
      log("Console security context established.");
      return true;
    } catch (error) {
      log("Console security context bootstrap failed", error?.message || String(error));
      return false;
    } finally {
      state.consoleContextPromise = null;
    }
  })();

  return state.consoleContextPromise;
}

function buildDcrDeviceInfo() {
  const screenInfo =
    typeof window !== "undefined" && window.screen
      ? {
          width: Number(window.screen.width || 0),
          height: Number(window.screen.height || 0),
        }
      : {
          width: 0,
          height: 0,
        };

  return JSON.stringify({
    deviceType: "ChromeExtension",
    deviceName: "UnderPAR",
    deviceOS: "Desktop",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    screen: screenInfo,
  });
}

function base64EncodeUtf8(value) {
  return btoa(unescape(encodeURIComponent(String(value || ""))));
}

function encodeDevicePayload(value) {
  const raw = typeof value === "string" ? value : JSON.stringify(value || {});
  return base64EncodeUtf8(raw);
}

function getStableRestV2DeviceIdentifier() {
  try {
    const cached = localStorage.getItem(REST_V2_DEVICE_ID_STORAGE_KEY);
    if (cached) {
      return cached;
    }

    const legacyCached = localStorage.getItem(LEGACY_REST_V2_DEVICE_ID_STORAGE_KEY);
    if (legacyCached) {
      localStorage.setItem(REST_V2_DEVICE_ID_STORAGE_KEY, legacyCached);
      return legacyCached;
    }

    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `00000000-0000-4000-8000-${Math.random().toString(16).slice(2, 14).padEnd(12, "0")}`;
    localStorage.setItem(REST_V2_DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `00000000-0000-4000-8000-${Math.random().toString(16).slice(2, 14).padEnd(12, "0")}`;
  }
}

function detectOsName() {
  const ua = String(navigator.userAgent || "").toLowerCase();
  if (ua.includes("android")) {
    return "Android";
  }
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return "iOS";
  }
  if (ua.includes("cros")) {
    return "Chrome OS";
  }
  if (ua.includes("windows")) {
    return "Windows";
  }
  if (ua.includes("mac os") || ua.includes("macintosh")) {
    return "Mac OS";
  }
  if (ua.includes("linux")) {
    return "Linux";
  }
  return "Linux";
}

function detectBrowserInfo() {
  const ua = String(navigator.userAgent || "");
  const normalized = ua.toLowerCase();
  if (normalized.includes("edg/")) {
    const version = (ua.match(/Edg\/([\d.]+)/) || [])[1] || "";
    return { name: "Edge", vendor: "Microsoft", version };
  }
  if (normalized.includes("chrome/") && !normalized.includes("edg/")) {
    const version = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || "";
    return { name: "Chrome", vendor: "Google", version };
  }
  if (normalized.includes("safari/") && !normalized.includes("chrome/")) {
    const version = (ua.match(/Version\/([\d.]+)/) || [])[1] || "";
    return { name: "Safari", vendor: "Apple", version };
  }
  if (normalized.includes("firefox/")) {
    const version = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || "";
    return { name: "Firefox", vendor: "Mozilla", version };
  }
  return { name: "Chrome", vendor: "Google", version: "" };
}

function buildLegacyDeviceInfoPayload(requestorId) {
  const browser = detectBrowserInfo();
  return {
    primaryHardwareType: "Desktop",
    model: navigator.platform || "Desktop",
    version: "1.0",
    osName: detectOsName(),
    osVersion: navigator.userAgent || "",
    browserName: browser.name,
    browserVendor: browser.vendor,
    browserVersion: browser.version,
    userAgent: navigator.userAgent || "",
    connectionType: navigator.connection?.effectiveType || "WiFi",
    connectionSecure: window.location.protocol === "https:",
    applicationId: requestorId || window.location.hostname || "UnderPAR",
  };
}

function buildDeviceIdentifierPayload() {
  const stableId = getStableRestV2DeviceIdentifier();
  return `fingerprint ${base64EncodeUtf8(stableId)}`;
}

function buildRestV2Headers(requestorId, extraHeaders = {}) {
  return {
    Accept: "application/json",
    "AP-Device-Identifier": buildDeviceIdentifierPayload(),
    "X-Device-Info": encodeDevicePayload(buildLegacyDeviceInfoPayload(requestorId)),
    ...extraHeaders,
  };
}

function getProgrammerByKey(key) {
  if (!key) {
    return null;
  }
  return state.programmers.find((item) => item.key === key) || null;
}

function getProgrammersForSelectedMediaCompany() {
  const programmer = getProgrammerByKey(state.selectedProgrammerKey);
  return programmer ? [programmer] : [];
}

function resolveSelectedProgrammer() {
  const mediaProgrammers = getProgrammersForSelectedMediaCompany();
  if (mediaProgrammers.length === 0) {
    state.selectedProgrammerKey = "";
    return null;
  }
  state.selectedProgrammerKey = mediaProgrammers[0].key;
  return mediaProgrammers[0];
}

function buildMetadataItemHtml(key, value) {
  return `
    <article class="metadata-item">
      <p class="metadata-key">${escapeHtml(key)}</p>
      <p class="metadata-value">${escapeHtml(value)}</p>
    </article>
  `;
}

function getPremiumCollapseKey(programmerId, serviceKey) {
  return `${String(programmerId || "")}:${String(serviceKey || "")}`;
}

function getPremiumSectionCollapsed(programmerId, serviceKey) {
  const key = getPremiumCollapseKey(programmerId, serviceKey);
  if (!state.premiumSectionCollapsedByKey.has(key)) {
    return true;
  }
  return Boolean(state.premiumSectionCollapsedByKey.get(key));
}

function setPremiumSectionCollapsed(programmerId, serviceKey, isCollapsed) {
  state.premiumSectionCollapsedByKey.set(getPremiumCollapseKey(programmerId, serviceKey), Boolean(isCollapsed));
}

function applyCollapsibleState(toggleButton, containerElement, isCollapsed) {
  if (!toggleButton || !containerElement) {
    return;
  }

  const collapsed = Boolean(isCollapsed);
  toggleButton.classList.toggle("collapsed", collapsed);
  toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
  containerElement.classList.toggle("collapsed", collapsed);
}

function wireCollapsibleSection(toggleButton, containerElement, initialCollapsed, onCollapsedChange = null) {
  if (!toggleButton || !containerElement) {
    return;
  }

  applyCollapsibleState(toggleButton, containerElement, initialCollapsed);

  const onToggle = () => {
    const nextCollapsed = !containerElement.classList.contains("collapsed");
    applyCollapsibleState(toggleButton, containerElement, nextCollapsed);
    if (typeof onCollapsedChange === "function") {
      onCollapsedChange(Boolean(nextCollapsed));
    }
  };

  toggleButton.addEventListener("click", onToggle);
  toggleButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  });
}

function setRestV2LoginPanelStatus(section, message, type = "") {
  const statusElement = section?.querySelector(".rest-v2-login-status");
  if (!statusElement) {
    return;
  }

  statusElement.classList.remove("success", "error");
  if (type === "success" || type === "error") {
    statusElement.classList.add(type);
  }
  statusElement.textContent = String(message || "");
}

function getRestV2SelectionKey(context) {
  if (!context?.ok) {
    return "";
  }
  return [context.programmerId, context.requestorId, context.mvpd].map((value) => String(value || "").trim()).join("|");
}

function isRestV2PreparedLoginEntryFresh(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const ageMs = Date.now() - Number(entry.preparedAt || 0);
  return Boolean(entry.loginUrl) && Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= REST_V2_PREPARED_LOGIN_MAX_AGE_MS;
}

function getRestV2PreparedLoginEntry(context) {
  const selectionKey = getRestV2SelectionKey(context);
  if (!selectionKey) {
    return null;
  }

  const entry = state.restV2PreparedLoginBySelectionKey.get(selectionKey) || null;
  if (!entry) {
    return null;
  }

  if (!isRestV2PreparedLoginEntryFresh(entry)) {
    state.restV2PreparedLoginBySelectionKey.delete(selectionKey);
    return null;
  }

  return entry;
}

function setRestV2PreparedLoginEntry(context, payload) {
  const selectionKey = getRestV2SelectionKey(context);
  if (!selectionKey) {
    return null;
  }

  const entry = {
    selectionKey,
    preparedAt: Date.now(),
    loginUrl: String(payload?.loginUrl || "").trim(),
    appInfo: payload?.appInfo || context?.appInfo || null,
    sessionData: payload?.sessionData && typeof payload.sessionData === "object" ? payload.sessionData : null,
    payload: payload?.payload && typeof payload.payload === "object" ? payload.payload : null,
  };
  if (!entry.loginUrl) {
    return null;
  }

  state.restV2PreparedLoginBySelectionKey.set(selectionKey, entry);
  return entry;
}

function clearRestV2PreparedLoginState() {
  if (state.restV2DebugFlowId) {
    void stopRestV2DebugFlowAndSnapshot(state.restV2DebugFlowId, "state-reset");
  }

  void closeExistingRestV2LaunchTarget();

  state.restV2PreparedLoginBySelectionKey.clear();
  state.restV2PreparePromiseBySelectionKey.clear();
  state.restV2PrepareErrorBySelectionKey.clear();
  state.restV2LastLaunchTabId = 0;
  state.restV2LastLaunchWindowId = 0;
  state.restV2PreviousTabId = 0;
  state.restV2PreviousTabUrl = "";
  state.restV2RecordingActive = false;
  state.restV2RecordingStartedAt = 0;
  state.restV2RecordingContext = null;
  state.restV2Stopping = false;
  state.restV2DebugFlowId = "";
}

function storeRestV2AuthContextForRequestor(context, selectedAppInfo) {
  if (!context?.requestorId || !selectedAppInfo?.guid) {
    return;
  }

  const existing = state.restV2AuthContextByRequestor.get(context.requestorId) || {};
  const existingCandidateGuids = Array.isArray(existing.candidateGuids) ? existing.candidateGuids : [];
  const contextCandidateGuids = Array.isArray(context.restV2AppCandidates)
    ? context.restV2AppCandidates.map((item) => item?.guid).filter(Boolean)
    : [];

  state.restV2AuthContextByRequestor.set(context.requestorId, {
    programmerId: context.programmerId,
    preferredAppGuid: selectedAppInfo.guid,
    candidateGuids: [...new Set([selectedAppInfo.guid, ...contextCandidateGuids, ...existingCandidateGuids])],
  });
}

async function closeExistingRestV2LaunchTarget() {
  const launchWindowId = Number(state.restV2LastLaunchWindowId || 0);
  const launchTabId = Number(state.restV2LastLaunchTabId || 0);

  if (Number.isFinite(launchWindowId) && launchWindowId > 0) {
    try {
      await chrome.windows.remove(launchWindowId);
    } catch {
      // Ignore if already closed.
    }
  } else if (Number.isFinite(launchTabId) && launchTabId > 0) {
    try {
      await chrome.tabs.remove(launchTabId);
    } catch {
      // Ignore if already closed.
    }
  }

  state.restV2LastLaunchTabId = 0;
  state.restV2LastLaunchWindowId = 0;
}

function syncRestV2CloseLoginButton(section) {
  const closeButton = section?.querySelector(".rest-v2-close-login-btn");
  if (!closeButton) {
    return;
  }

  const showClose = state.restV2RecordingActive === true;
  closeButton.hidden = !showClose;
  closeButton.disabled = !showClose || state.busy || state.restV2Stopping;
  closeButton.textContent = "STOP";
}

async function getCurrentActiveTab() {
  try {
    const tabs = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (Array.isArray(tabs) && tabs.length > 0) {
      return tabs[0];
    }
  } catch {
    // Ignore query failures.
  }
  return null;
}

async function openRestV2LoginPopupWindow() {
  const createData = {
    url: "about:blank",
    focused: true,
    type: "popup",
    width: REST_V2_LOGIN_WINDOW_WIDTH,
    height: REST_V2_LOGIN_WINDOW_HEIGHT,
  };

  try {
    const currentWindow = await chrome.windows.getCurrent();
    if (Number.isFinite(Number(currentWindow?.left)) && Number.isFinite(Number(currentWindow?.top))) {
      createData.left = Number(currentWindow.left) + 24;
      createData.top = Number(currentWindow.top) + 24;
    }
  } catch {
    // Use default placement when current window bounds are unavailable.
  }

  const createdWindow = await chrome.windows.create(createData);
  const launchWindowId =
    Number.isFinite(Number(createdWindow?.id)) && Number(createdWindow.id) > 0 ? Number(createdWindow.id) : 0;
  const launchTabId =
    Number.isFinite(Number(createdWindow?.tabs?.[0]?.id)) && Number(createdWindow.tabs[0].id) > 0
      ? Number(createdWindow.tabs[0].id)
      : 0;

  if (!launchWindowId || !launchTabId) {
    throw new Error("Unable to open dedicated MVPD login window.");
  }

  return {
    windowId: launchWindowId,
    tabId: launchTabId,
  };
}

function getUPTraceViewerUrl(tabId, flowId = "", source = "test-mvpd-login") {
  const url = new URL(chrome.runtime.getURL(UP_TRACE_VIEW_PATH));
  const normalizedTabId = Number(tabId || 0);
  if (Number.isFinite(normalizedTabId) && normalizedTabId > 0) {
    url.searchParams.set("tabId", String(normalizedTabId));
  }
  const normalizedFlowId = String(flowId || "").trim();
  if (normalizedFlowId) {
    url.searchParams.set("flowId", normalizedFlowId);
  }
  url.searchParams.set("source", String(source || "test-mvpd-login"));
  return url.toString();
}

async function openOrFocusUPTraceViewerWithState(tabId, flowId = "", options = {}) {
  const normalizedTabId = Number(tabId || 0);
  if (!Number.isFinite(normalizedTabId) || normalizedTabId <= 0) {
    return { ok: false, error: "Unable to open UP trace: missing target tab id." };
  }

  const traceTabStateKey = String(options.traceTabStateKey || "restV2TraceViewerTabId");
  const traceWindowStateKey = String(options.traceWindowStateKey || "restV2TraceViewerWindowId");
  const source = String(options.source || "test-mvpd-login");
  const traceViewerUrl = getUPTraceViewerUrl(normalizedTabId, flowId, source);
  const existingTraceViewerTabId = Number(state?.[traceTabStateKey] || 0);

  if (Number.isFinite(existingTraceViewerTabId) && existingTraceViewerTabId > 0) {
    try {
      const existingTab = await chrome.tabs.get(existingTraceViewerTabId);
      if (existingTab?.id) {
        await chrome.tabs.update(existingTab.id, {
          url: traceViewerUrl,
          active: true,
        });
        if (Number.isFinite(Number(existingTab.windowId)) && Number(existingTab.windowId) > 0) {
          await chrome.windows.update(Number(existingTab.windowId), { focused: true });
          state[traceWindowStateKey] = Number(existingTab.windowId);
        }
        state[traceTabStateKey] = Number(existingTab.id);
        return {
          ok: true,
          reused: true,
          tabId: Number(existingTab.id),
          windowId: Number(existingTab.windowId || 0),
        };
      }
    } catch {
      state[traceTabStateKey] = 0;
      state[traceWindowStateKey] = 0;
    }
  }

  try {
    const createdTab = await chrome.tabs.create({
      url: traceViewerUrl,
      active: true,
    });
    state[traceTabStateKey] =
      Number.isFinite(Number(createdTab?.id)) && Number(createdTab.id) > 0 ? Number(createdTab.id) : 0;
    state[traceWindowStateKey] =
      Number.isFinite(Number(createdTab?.windowId)) && Number(createdTab.windowId) > 0 ? Number(createdTab.windowId) : 0;

    return {
      ok: true,
      reused: false,
      tabId: Number(state[traceTabStateKey] || 0),
      windowId: Number(state[traceWindowStateKey] || 0),
      mode: "tab",
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to open UP trace viewer.",
    };
  }
}

async function openOrFocusUPTraceViewer(tabId, flowId = "") {
  return openOrFocusUPTraceViewerWithState(tabId, flowId, {
    source: "test-mvpd-login",
    traceTabStateKey: "restV2TraceViewerTabId",
    traceWindowStateKey: "restV2TraceViewerWindowId",
  });
}

async function openOrFocusDecompTraceViewer(tabId, flowId = "") {
  return openOrFocusUPTraceViewerWithState(tabId, flowId, {
    source: "esm-decomp-recording",
    traceTabStateKey: "decompTraceViewerTabId",
    traceWindowStateKey: "decompTraceViewerWindowId",
  });
}

function isCurrentRestV2SelectionKey(selectionKey) {
  if (!selectionKey) {
    return false;
  }

  const currentContext = buildCurrentRestV2SelectionContext(resolveSelectedProgrammer(), null);
  if (!currentContext?.ok) {
    return false;
  }
  return getRestV2SelectionKey(currentContext) === selectionKey;
}

async function ensurePreparedRestV2LoginForContext(section, context, options = {}) {
  const force = options.force === true;
  const debugFlowId = String(options.debugFlowId || "").trim();
  const selectionKey = getRestV2SelectionKey(context);
  if (!selectionKey) {
    throw new Error("REST V2 login preparation failed: missing selection context.");
  }

  if (force) {
    state.restV2PreparedLoginBySelectionKey.delete(selectionKey);
    state.restV2PrepareErrorBySelectionKey.delete(selectionKey);
  }

  if (!force) {
    const prepared = getRestV2PreparedLoginEntry(context);
    if (prepared) {
      return prepared;
    }
  }

  const existingPromise = state.restV2PreparePromiseBySelectionKey.get(selectionKey);
  if (existingPromise) {
    return existingPromise;
  }

  const launchButton = section?.querySelector(".rest-v2-test-login-btn");
  if (launchButton && isCurrentRestV2SelectionKey(selectionKey)) {
    launchButton.hidden = false;
    launchButton.disabled = true;
  }
  if (section && isCurrentRestV2SelectionKey(selectionKey)) {
    setRestV2LoginPanelStatus(
      section,
      `Preparing ${context.requestorId} x ${context.mvpd} MVPD login target...`
    );
  }

  const workPromise = (async () => {
    try {
      const { loginUrl, appInfo: selectedAppInfo, sessionData, payload } = await createRestV2SessionForContext(context, {
        debugFlowId,
      });
      if (!loginUrl) {
        throw new Error("REST V2 session response did not include a login URL.");
      }

      const resolvedAppInfo = selectedAppInfo || context.appInfo;
      storeRestV2AuthContextForRequestor(context, resolvedAppInfo);
      const entry = setRestV2PreparedLoginEntry(context, {
        loginUrl,
        appInfo: resolvedAppInfo,
        sessionData,
        payload,
      });
      if (!entry) {
        throw new Error("REST V2 login preparation failed: unable to cache login URL.");
      }

      state.restV2PrepareErrorBySelectionKey.delete(selectionKey);
      if (section && isCurrentRestV2SelectionKey(selectionKey)) {
        const appName = resolvedAppInfo?.appName || resolvedAppInfo?.guid || context.appInfo?.appName || "REST V2 App";
        setRestV2LoginPanelStatus(
          section,
          `Ready to test ${context.requestorId} x ${context.mvpd} with "${appName}".`,
          "success"
        );
        if (launchButton) {
          launchButton.hidden = false;
          launchButton.disabled = false;
        }
      }

      return entry;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      state.restV2PrepareErrorBySelectionKey.set(selectionKey, reason);
      if (section && isCurrentRestV2SelectionKey(selectionKey)) {
        setRestV2LoginPanelStatus(section, reason, "error");
        if (launchButton) {
          launchButton.hidden = false;
          launchButton.disabled = false;
        }
      }
      throw error;
    }
  })();

  state.restV2PreparePromiseBySelectionKey.set(selectionKey, workPromise);
  try {
    return await workPromise;
  } finally {
    if (state.restV2PreparePromiseBySelectionKey.get(selectionKey) === workPromise) {
      state.restV2PreparePromiseBySelectionKey.delete(selectionKey);
    }
  }
}

function buildCurrentRestV2SelectionContext(programmer, appInfoOverride = null) {
  const resolvedProgrammer = programmer || resolveSelectedProgrammer();
  if (!resolvedProgrammer || !resolvedProgrammer.programmerId) {
    return { ok: false, reason: "Select a Media Company first." };
  }

  const requestorId = String(state.selectedRequestorId || "").trim();
  if (!requestorId) {
    return { ok: false, reason: "Select a Content Provider first." };
  }

  const mvpd = String(state.selectedMvpdId || els.mvpdSelect?.value || "").trim();
  if (!mvpd) {
    return { ok: false, reason: "Select an MVPD to enable REST V2 test login." };
  }

  const premiumApps = state.premiumAppsByProgrammerId.get(resolvedProgrammer.programmerId) || null;
  const baseCandidates = collectRestV2AppCandidatesFromPremiumApps(premiumApps);
  const byGuid = new Map();
  baseCandidates.forEach((item) => {
    if (item?.guid && !byGuid.has(item.guid)) {
      byGuid.set(item.guid, item);
    }
  });
  if (appInfoOverride?.guid && !byGuid.has(appInfoOverride.guid)) {
    byGuid.set(appInfoOverride.guid, appInfoOverride);
  }

  const cachedAuthContext = state.restV2AuthContextByRequestor.get(requestorId) || null;
  const orderedCandidates = [];
  const pushCandidate = (item) => {
    if (!item?.guid || orderedCandidates.some((entry) => entry.guid === item.guid)) {
      return;
    }
    orderedCandidates.push(item);
  };

  if (
    cachedAuthContext &&
    cachedAuthContext.programmerId === resolvedProgrammer.programmerId &&
    Array.isArray(cachedAuthContext.candidateGuids)
  ) {
    cachedAuthContext.candidateGuids.forEach((guid) => {
      pushCandidate(byGuid.get(guid));
    });
  }

  const mappingPreferred = resolveRestV2AppForServiceProvider(
    baseCandidates,
    requestorId,
    resolvedProgrammer.programmerId
  );
  pushCandidate(mappingPreferred);
  pushCandidate(appInfoOverride);
  baseCandidates.forEach((item) => pushCandidate(item));

  const resolvedApp =
    (cachedAuthContext &&
    cachedAuthContext.programmerId === resolvedProgrammer.programmerId &&
    cachedAuthContext.preferredAppGuid
      ? orderedCandidates.find((item) => item.guid === cachedAuthContext.preferredAppGuid)
      : null) ||
    orderedCandidates[0] ||
    null;

  if (!resolvedApp?.guid) {
    return {
      ok: false,
      reason: `No REST V2 scoped app is mapped to RequestorId "${requestorId}".`,
    };
  }

  const mvpdMeta = state.mvpdCacheByRequestor.get(requestorId)?.get(mvpd) || null;
  return {
    ok: true,
    programmerId: resolvedProgrammer.programmerId,
    programmerName: resolvedProgrammer.programmerName,
    requestorId,
    serviceProviderId: requestorId,
    mvpd,
    mvpdMeta,
    appInfo: resolvedApp,
    restV2AppCandidates: orderedCandidates,
  };
}

function syncRestV2LoginPanel(section, programmer, appInfo) {
  const button = section?.querySelector(".rest-v2-test-login-btn");
  syncRestV2CloseLoginButton(section);
  if (!button) {
    return;
  }

  button.textContent = "START RECORDING";
  button.hidden = false;

  if (state.restV2Stopping) {
    button.disabled = true;
    setRestV2LoginPanelStatus(section, "Finalizing recording and HAR export...");
    return;
  }

  if (state.restV2RecordingActive && state.restV2DebugFlowId) {
    button.disabled = true;
    const activeContext = state.restV2RecordingContext;
    const captureLabel =
      activeContext?.requestorId && activeContext?.mvpd
        ? `${activeContext.requestorId} x ${activeContext.mvpd}`
        : "active MVPD flow";
    setRestV2LoginPanelStatus(
      section,
      `Recording HTTP session traffic for ${captureLabel}. Click STOP to end capture and download HAR.`,
      "success"
    );
    return;
  }

  const context = buildCurrentRestV2SelectionContext(programmer, appInfo);
  if (!context.ok) {
    button.hidden = true;
    button.disabled = true;
    setRestV2LoginPanelStatus(section, context.reason);
    return;
  }

  const selectionKey = getRestV2SelectionKey(context);
  const prepareError = state.restV2PrepareErrorBySelectionKey.get(selectionKey) || "";
  const hasPreparePromise = state.restV2PreparePromiseBySelectionKey.has(selectionKey);
  const preparedEntry = getRestV2PreparedLoginEntry(context);
  const appName = context.appInfo?.appName || context.appInfo?.guid || "REST V2 App";

  button.hidden = false;
  if (preparedEntry?.loginUrl) {
    button.disabled = false;
    setRestV2LoginPanelStatus(
      section,
      `Ready to start recording ${context.requestorId} x ${context.mvpd} with "${appName}".`,
      "success"
    );
    return;
  }

  if (hasPreparePromise) {
    button.disabled = true;
    setRestV2LoginPanelStatus(
      section,
      `Preparing ${context.requestorId} x ${context.mvpd} MVPD login target...`
    );
    return;
  }

  if (prepareError) {
    button.disabled = false;
    setRestV2LoginPanelStatus(section, prepareError, "error");
    return;
  }

  button.disabled = true;
  setRestV2LoginPanelStatus(
    section,
    `Preparing ${context.requestorId} x ${context.mvpd} MVPD login target...`
  );
  void ensurePreparedRestV2LoginForContext(section, context).catch(() => {
    // Status is surfaced by ensurePreparedRestV2LoginForContext.
  });
}

function refreshRestV2LoginPanels() {
  const sections = document.querySelectorAll(".premium-service-section.service-rest-v2");
  if (!sections || sections.length === 0) {
    return;
  }

  const selectedProgrammer = resolveSelectedProgrammer();
  sections.forEach((section) => {
    syncRestV2LoginPanel(section, selectedProgrammer, null);
  });
}

function waitForDelay(durationMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, Number(durationMs) || 0));
  });
}

function toRestV2RecordingContext(context, appInfoOverride = null, options = {}) {
  if (!context?.ok) {
    return null;
  }
  const selectedAppInfo = appInfoOverride || context.appInfo || null;
  const compactAppInfo = selectedAppInfo
    ? {
        guid: String(selectedAppInfo.guid || ""),
        appName: String(selectedAppInfo.appName || selectedAppInfo.guid || ""),
        scopes: Array.isArray(selectedAppInfo.scopes) ? selectedAppInfo.scopes.slice(0, 12) : [],
        softwareStatement: String(selectedAppInfo.softwareStatement || ""),
      }
      : null;
  const redirectUrl = normalizeAdobeNavigationUrl(firstNonEmptyString([options?.redirectUrl, context?.redirectUrl]));
  return {
    programmerId: context.programmerId,
    programmerName: context.programmerName || "",
    requestorId: context.requestorId,
    serviceProviderId: context.serviceProviderId || context.requestorId,
    mvpd: context.mvpd,
    appInfo: compactAppInfo,
    redirectUrl,
    startedAt: Date.now(),
  };
}

async function launchRestV2MvpdLogin(section, programmer, appInfo) {
  const button = section?.querySelector(".rest-v2-test-login-btn");
  if (button) {
    button.disabled = true;
  }

  let debugFlowId = "";
  try {
    if (state.restV2Stopping) {
      setRestV2LoginPanelStatus(section, "Stopping previous recording. Please wait...");
      return;
    }

    if (state.restV2RecordingActive && state.restV2DebugFlowId) {
      setRestV2LoginPanelStatus(
        section,
        "A recording session is already active. Click STOP to end capture and download HAR."
      );
      return;
    }

    const context = buildCurrentRestV2SelectionContext(programmer, appInfo);
    if (!context.ok) {
      throw new Error(context.reason);
    }

    debugFlowId = await startRestV2DebugFlow(
      {
        programmerId: context.programmerId,
        programmerName: context.programmerName || "",
        requestorId: context.requestorId,
        mvpd: context.mvpd,
      },
      "start-recording-click"
    );
    if (!debugFlowId) {
      throw new Error("Unable to start UP HTTP recording flow.");
    }

    state.restV2DebugFlowId = debugFlowId;
    state.restV2RecordingActive = true;
    state.restV2RecordingStartedAt = Date.now();
    state.restV2RecordingContext = toRestV2RecordingContext(context);

    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      phase: "recording-start",
      requestorId: context.requestorId,
      mvpd: context.mvpd,
    });

    let preparedEntry = getRestV2PreparedLoginEntry(context);
    if (!preparedEntry?.loginUrl) {
      emitRestV2DebugEvent(debugFlowId, {
        source: "extension",
        phase: "prepare-miss",
        requestorId: context.requestorId,
        mvpd: context.mvpd,
      });
      preparedEntry = await ensurePreparedRestV2LoginForContext(section, context, {
        force: true,
        debugFlowId,
      });
    } else {
      emitRestV2DebugEvent(debugFlowId, {
        source: "extension",
        phase: "prepare-hit",
        loginUrl: preparedEntry.loginUrl,
        preparedAt: preparedEntry.preparedAt,
        sessionCode: preparedEntry?.sessionData?.code || "",
        sessionId: preparedEntry?.sessionData?.sessionId || "",
        sessionAction: preparedEntry?.sessionData?.actionName || "",
      });
    }

    if (!preparedEntry?.loginUrl) {
      throw new Error("REST V2 session response did not include a login URL.");
    }

    const selectedAppInfo = preparedEntry.appInfo || context.appInfo;
    const configuredRedirectUrl = normalizeAdobeNavigationUrl(
      firstNonEmptyString([
        preparedEntry?.payload?.redirectUrl,
        preparedEntry?.sessionData?.existingParameters?.redirectUrl,
      ])
    );
    storeRestV2AuthContextForRequestor(context, selectedAppInfo);
    state.restV2RecordingContext = toRestV2RecordingContext(context, selectedAppInfo, {
      redirectUrl: configuredRedirectUrl,
    });

    const activeTab = await getCurrentActiveTab();
    state.restV2PreviousTabId =
      Number.isFinite(Number(activeTab?.id)) && Number(activeTab.id) > 0 ? Number(activeTab.id) : 0;
    state.restV2PreviousTabUrl = String(activeTab?.url || "");

    await closeExistingRestV2LaunchTarget();

    const launchedTarget = await openRestV2LoginPopupWindow();
    state.restV2LastLaunchWindowId = Number(launchedTarget.windowId || 0);
    state.restV2LastLaunchTabId = Number(launchedTarget.tabId || 0);
    if (state.restV2LastLaunchTabId > 0) {
      const bound = await bindRestV2DebugFlowToTab(debugFlowId, state.restV2LastLaunchTabId, {
        requestorId: context.requestorId,
        mvpd: context.mvpd,
        loginUrl: preparedEntry.loginUrl,
        redirectUrl: configuredRedirectUrl,
      });
      if (!bound && debugFlowId) {
        emitRestV2DebugEvent(debugFlowId, {
          source: "extension",
          phase: "bind-tab-failed",
          tabId: state.restV2LastLaunchTabId,
        });
      }

      await chrome.tabs.update(state.restV2LastLaunchTabId, {
        url: preparedEntry.loginUrl,
        active: true,
      });

      const traceViewerResult = await openOrFocusUPTraceViewer(state.restV2LastLaunchTabId, debugFlowId);
      if (traceViewerResult.ok) {
        emitRestV2DebugEvent(debugFlowId, {
          source: "extension",
          phase: "trace-view-opened",
          traceTabId: traceViewerResult.tabId || 0,
          traceWindowId: traceViewerResult.windowId || 0,
          traceMode: traceViewerResult.mode || (traceViewerResult.reused ? "reuse" : "unknown"),
        });
      } else {
        emitRestV2DebugEvent(debugFlowId, {
          source: "extension",
          phase: "trace-view-open-failed",
          error: traceViewerResult.error || "Unable to open UP trace viewer.",
        });
      }
    } else {
      throw new Error("Unable to open login window.");
    }

    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      phase: "tab-launched",
      tabId: state.restV2LastLaunchTabId,
      windowId: state.restV2LastLaunchWindowId,
      loginUrl: preparedEntry.loginUrl,
      sessionCode: preparedEntry?.sessionData?.code || "",
      sessionAction: preparedEntry?.sessionData?.actionName || "",
    });

    setRestV2LoginPanelStatus(
      section,
      `Recording started for ${context.requestorId} x ${context.mvpd}. Use STOP to end capture and download HAR.`,
      "success"
    );
    syncRestV2LoginPanel(section, programmer, appInfo);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    setRestV2LoginPanelStatus(section, reason, "error");
    emitRestV2DebugEvent(debugFlowId || state.restV2DebugFlowId, {
      source: "extension",
      phase: "launch-error",
      error: reason,
    });

    state.restV2RecordingActive = false;
    state.restV2RecordingStartedAt = 0;
    state.restV2RecordingContext = null;

    const flowToStop = String(debugFlowId || state.restV2DebugFlowId || "").trim();
    if (flowToStop) {
      await stopRestV2DebugFlowAndSnapshot(flowToStop, "start-failed");
    }
    state.restV2DebugFlowId = "";
  } finally {
    if (button && !(state.restV2RecordingActive && state.restV2DebugFlowId)) {
      button.disabled = false;
    }
    if (!(state.restV2RecordingActive && state.restV2DebugFlowId)) {
      syncRestV2LoginPanel(section, programmer, appInfo);
    }
  }
}

async function closeRestV2LoginAndReturn(section, options = {}) {
  const suppressStatus = options.suppressStatus === true;
  const phasePrefix = String(options.phasePrefix || "close").trim() || "close";
  const closeButton = section?.querySelector(".rest-v2-close-login-btn");
  if (closeButton) {
    closeButton.disabled = true;
  }

  emitRestV2DebugEvent(state.restV2DebugFlowId, {
    source: "extension",
    phase: `${phasePrefix}-click`,
    tabId: Number(state.restV2LastLaunchTabId || 0),
    windowId: Number(state.restV2LastLaunchWindowId || 0),
  });

  try {
    const launchTabId = Number(state.restV2LastLaunchTabId || 0);
    const launchWindowId = Number(state.restV2LastLaunchWindowId || 0);
    const previousTabId = Number(state.restV2PreviousTabId || 0);
    const previousTabUrl = String(state.restV2PreviousTabUrl || "").trim();

    let returned = false;
    if (Number.isFinite(previousTabId) && previousTabId > 0) {
      try {
        await chrome.tabs.update(previousTabId, { active: true });
        returned = true;
      } catch {
        returned = false;
      }
    }

    if (!returned && previousTabUrl) {
      try {
        await chrome.tabs.create({
          url: previousTabUrl,
          active: true,
        });
        returned = true;
      } catch {
        returned = false;
      }
    }

    if (Number.isFinite(launchWindowId) && launchWindowId > 0) {
      try {
        await chrome.windows.remove(launchWindowId);
      } catch {
        // Ignore if already closed by user.
      }
    } else if (Number.isFinite(launchTabId) && launchTabId > 0) {
      try {
        await chrome.tabs.remove(launchTabId);
      } catch {
        // Ignore if already closed by user.
      }
    }

    state.restV2LastLaunchTabId = 0;
    state.restV2LastLaunchWindowId = 0;

    if (!suppressStatus) {
      if (returned) {
        setRestV2LoginPanelStatus(section, "Closed MVPD login window and returned to your previous page.", "success");
      } else {
        setRestV2LoginPanelStatus(
          section,
          "MVPD login window closed. Previous tab was not available; use Chrome tabs to continue."
        );
      }
    }

    emitRestV2DebugEvent(state.restV2DebugFlowId, {
      source: "extension",
      phase: `${phasePrefix}-complete`,
      returnedToPreviousTab: returned,
      previousTabId,
      closedTabId: launchTabId,
      closedWindowId: launchWindowId,
    });
    return {
      ok: true,
      returned,
      previousTabId,
      closedTabId: launchTabId,
      closedWindowId: launchWindowId,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (!suppressStatus) {
      setRestV2LoginPanelStatus(section, reason, "error");
    }
    emitRestV2DebugEvent(state.restV2DebugFlowId, {
      source: "extension",
      phase: `${phasePrefix}-error`,
      error: reason,
    });
    return {
      ok: false,
      error: reason,
    };
  } finally {
    syncRestV2CloseLoginButton(section);
  }
}

async function waitForTabCompletion(tabId, timeoutMs = REST_V2_LOGOUT_NAVIGATION_TIMEOUT_MS) {
  const normalizedTabId = Number(tabId || 0);
  if (!Number.isFinite(normalizedTabId) || normalizedTabId <= 0) {
    return { ok: false, reason: "invalid-tab" };
  }

  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = 0;

    const done = (result) => {
      if (settled) {
        return;
      }
      settled = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.onRemoved.removeListener(onRemoved);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resolve(result);
    };

    const onUpdated = (updatedTabId, changeInfo, tab) => {
      if (Number(updatedTabId) !== normalizedTabId) {
        return;
      }
      if (changeInfo.status === "complete") {
        done({
          ok: true,
          status: "complete",
          url: String(tab?.url || changeInfo.url || ""),
        });
      }
    };

    const onRemoved = (removedTabId) => {
      if (Number(removedTabId) === normalizedTabId) {
        done({ ok: false, reason: "tab-removed" });
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);
    timeoutId = setTimeout(() => {
      done({ ok: false, reason: "timeout" });
    }, Math.max(5000, Number(timeoutMs || REST_V2_LOGOUT_NAVIGATION_TIMEOUT_MS)));

    void chrome.tabs
      .get(normalizedTabId)
      .then((tab) => {
        if (tab?.status === "complete") {
          done({
            ok: true,
            status: "already-complete",
            url: String(tab?.url || ""),
          });
        }
      })
      .catch(() => {
        // Wait for update/remove callbacks.
      });
  });
}

function resolveRestV2LogoutAction(payload, mvpd, fallbackLocation = "") {
  const normalizedMvpd = String(mvpd || "").trim();
  const logoutMap = payload?.logouts && typeof payload.logouts === "object" ? payload.logouts : {};
  const candidates = [];

  if (normalizedMvpd && logoutMap[normalizedMvpd]) {
    candidates.push(logoutMap[normalizedMvpd]);
  }

  for (const value of Object.values(logoutMap)) {
    if (value && typeof value === "object") {
      candidates.push(value);
    }
  }

  if (fallbackLocation) {
    candidates.push({
      mvpd: normalizedMvpd,
      actionName: "redirect",
      actionType: "redirect",
      url: fallbackLocation,
    });
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    return {
      mvpd: String(candidate.mvpd || normalizedMvpd || ""),
      actionName: String(candidate.actionName || ""),
      actionType: String(candidate.actionType || ""),
      url: String(candidate.url || ""),
    };
  }

  return null;
}

async function ensureBoundRestV2LaunchTabForFlow(flowId, context = null, metadata = {}) {
  let launchTabId = Number(state.restV2LastLaunchTabId || 0);
  if (!Number.isFinite(launchTabId) || launchTabId <= 0) {
    const launchedTarget = await openRestV2LoginPopupWindow();
    state.restV2LastLaunchWindowId = Number(launchedTarget.windowId || 0);
    state.restV2LastLaunchTabId = Number(launchedTarget.tabId || 0);
    launchTabId = Number(state.restV2LastLaunchTabId || 0);
  }

  if (!Number.isFinite(launchTabId) || launchTabId <= 0) {
    throw new Error("Unable to open an MVPD browser tab for logout.");
  }

  if (flowId) {
    const bound = await bindRestV2DebugFlowToTab(flowId, launchTabId, {
      requestorId: String(context?.requestorId || ""),
      mvpd: String(context?.mvpd || ""),
      ...metadata,
    });
    if (!bound) {
      emitRestV2DebugEvent(flowId, {
        source: "extension",
        phase: "logout-bind-tab-failed",
        tabId: launchTabId,
      });
    }
  }

  return launchTabId;
}

async function navigateRestV2LogoutUrlInLaunchTab(logoutUrl, flowId, context = null) {
  const normalizedUrl = String(logoutUrl || "").trim();
  if (!normalizedUrl) {
    return { ok: false, reason: "missing-url" };
  }

  const launchTabId = await ensureBoundRestV2LaunchTabForFlow(flowId, context, {
    logoutUrl: normalizedUrl,
    phase: "logout",
  });

  await chrome.tabs.update(launchTabId, {
    url: normalizedUrl,
    active: true,
  });

  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "logout-navigation-start",
    tabId: launchTabId,
    logoutUrl: normalizedUrl,
  });

  const navigationResult = await waitForTabCompletion(launchTabId, REST_V2_LOGOUT_NAVIGATION_TIMEOUT_MS);
  await waitForDelay(REST_V2_LOGOUT_POST_NAV_DELAY_MS);

  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "logout-navigation-finished",
    tabId: launchTabId,
    logoutUrl: normalizedUrl,
    ...navigationResult,
  });

  return {
    ...navigationResult,
    tabId: launchTabId,
  };
}

async function hasActiveRestV2Profile(context, flowId) {
  if (!context?.programmerId || !context?.appInfo?.guid || !context?.serviceProviderId || !context?.mvpd) {
    return false;
  }

  const profilesUrl = `${REST_V2_BASE}/${encodeURIComponent(context.serviceProviderId)}/profiles/${encodeURIComponent(
    context.mvpd
  )}`;

  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "profiles-check-request",
    url: profilesUrl,
    requestorId: context.requestorId,
    mvpd: context.mvpd,
  });

  try {
    const response = await fetchWithPremiumAuth(
      context.programmerId,
      context.appInfo,
      profilesUrl,
      {
        method: "GET",
        mode: "cors",
        headers: buildRestV2Headers(context.serviceProviderId, {
          Accept: "application/json",
        }),
      },
      "refresh",
      {
        flowId,
        requestorId: context.requestorId,
        mvpd: context.mvpd,
        scope: "profiles-check",
      }
    );

    const responseText = await response.text().catch(() => "");
    const parsed = parseJsonText(responseText, {});
    const profiles = parsed?.profiles && typeof parsed.profiles === "object" ? parsed.profiles : {};
    const profileCount = Object.keys(profiles).length;

    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "profiles-check-response",
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
      profileCount,
      responsePreview: truncateDebugText(responseText, 1200),
    });

    return response.ok && profileCount > 0;
  } catch (error) {
    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "profiles-check-error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

async function executeRestV2LogoutFlow(context, flowId) {
  const result = {
    attempted: false,
    performed: false,
    actionName: "",
    actionType: "",
    logoutUrl: "",
    error: "",
  };

  if (!context?.programmerId || !context?.appInfo?.guid || !context?.serviceProviderId || !context?.mvpd) {
    return result;
  }

  result.attempted = true;
  const redirectUrl = firstNonEmptyString([
    REST_V2_REDIRECT_CANDIDATES[1],
    REST_V2_REDIRECT_CANDIDATES[0],
    `${ADOBE_SP_BASE}/api.html`,
  ]);
  const logoutEndpoint = `${REST_V2_BASE}/${encodeURIComponent(context.serviceProviderId)}/logout/${encodeURIComponent(
    context.mvpd
  )}${redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : ""}`;

  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "logout-request",
    url: logoutEndpoint,
    requestorId: context.requestorId,
    mvpd: context.mvpd,
  });

  try {
    const response = await fetchWithPremiumAuth(
      context.programmerId,
      context.appInfo,
      logoutEndpoint,
      {
        method: "GET",
        mode: "cors",
        headers: buildRestV2Headers(context.serviceProviderId, {
          Accept: "application/json",
        }),
      },
      "refresh",
      {
        flowId,
        requestorId: context.requestorId,
        mvpd: context.mvpd,
        scope: "logout",
      }
    );

    const responseText = await response.text().catch(() => "");
    const parsed = parseJsonText(responseText, {});
    const locationHeader = response.headers?.get("Location") || "";
    const resolvedAction = resolveRestV2LogoutAction(parsed, context.mvpd, locationHeader);
    if (resolvedAction) {
      result.actionName = resolvedAction.actionName;
      result.actionType = resolvedAction.actionType;
      result.logoutUrl = resolvedAction.url;
    }

    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "logout-response",
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
      actionName: result.actionName,
      actionType: result.actionType,
      logoutUrl: result.logoutUrl,
      responsePreview: truncateDebugText(responseText, 2000),
    });

    if (!response.ok && response.status !== 302) {
      result.error =
        firstNonEmptyString([
          parsed?.code,
          parsed?.error,
          parsed?.message,
          normalizeHttpErrorMessage(responseText),
          response.statusText,
        ]) || `Logout failed (${response.status}).`;
      return result;
    }

    if (result.logoutUrl) {
      const navigationResult = await navigateRestV2LogoutUrlInLaunchTab(result.logoutUrl, flowId, context);
      result.performed = navigationResult.ok === true;
      if (!result.performed && !result.error) {
        result.error = `Logout navigation did not complete (${navigationResult.reason || "unknown"}).`;
      }
      return result;
    }

    result.performed = /complete/i.test(result.actionName) || Boolean(response.ok);
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "logout-error",
      error: result.error,
    });
    return result;
  }
}

function pickFlowEventTimestampMs(event, fallbackMs = Date.now()) {
  const iso = Date.parse(String(event?.timestamp || ""));
  if (Number.isFinite(iso) && iso > 0) {
    return iso;
  }

  const raw = Number(event?.timestampMs || 0);
  if (Number.isFinite(raw) && raw > 0) {
    return raw;
  }

  return fallbackMs;
}

function toHarHeadersArray(headersLike) {
  const output = [];
  if (!headersLike) {
    return output;
  }

  if (Array.isArray(headersLike)) {
    for (const entry of headersLike) {
      if (!entry || typeof entry !== "object") {
        continue;
      }
      if (Array.isArray(entry) && entry.length >= 2) {
        output.push({
          name: String(entry[0]),
          value: String(entry[1]),
        });
        continue;
      }
      output.push({
        name: String(entry.name || ""),
        value: String(entry.value || ""),
      });
    }
    return output.filter((item) => item.name);
  }

  if (headersLike instanceof Headers) {
    for (const [name, value] of headersLike.entries()) {
      output.push({ name: String(name), value: String(value) });
    }
    return output;
  }

  if (typeof headersLike === "object") {
    for (const [name, value] of Object.entries(headersLike)) {
      output.push({ name: String(name), value: String(value ?? "") });
    }
  }

  return output.filter((item) => item.name);
}

function getHarHeaderValue(headers, name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  if (!normalizedName || !Array.isArray(headers)) {
    return "";
  }
  const match = headers.find((entry) => String(entry?.name || "").trim().toLowerCase() === normalizedName);
  return match ? String(match.value || "") : "";
}

function toHarQueryStringArray(url) {
  if (!url) {
    return [];
  }

  try {
    const parsed = new URL(url);
    const output = [];
    for (const [name, value] of parsed.searchParams.entries()) {
      output.push({ name, value });
    }
    return output;
  } catch {
    return [];
  }
}

function isPassCriticalPath(pathname = "") {
  const normalized = String(pathname || "").toLowerCase();
  return (
    normalized.startsWith("/api/v2/") ||
    normalized.startsWith("/o/") ||
    normalized.startsWith("/authenticate/")
  );
}

function shouldIgnoreRedirectSiteUrl(url, context = null) {
  const redirectUrl = normalizeAdobeNavigationUrl(firstNonEmptyString([context?.redirectUrl]));
  if (!redirectUrl || !url) {
    return false;
  }

  let redirectParsed;
  let parsed;
  try {
    redirectParsed = new URL(redirectUrl);
    parsed = new URL(String(url));
  } catch {
    return false;
  }

  if (parsed.origin !== redirectParsed.origin) {
    return false;
  }
  if (isPassCriticalPath(parsed.pathname)) {
    return false;
  }

  const mode = String(REDIRECT_IGNORE_MATCHER_MODE || "origin_except_pass").trim().toLowerCase();
  const redirectPath = redirectParsed.pathname || "/";
  if (mode === "exact_path") {
    return parsed.pathname === redirectPath;
  }

  if (parsed.pathname === redirectPath) {
    return true;
  }

  if (mode === "path_tree" && redirectPath !== "/") {
    const redirectDir = redirectPath.endsWith("/")
      ? redirectPath
      : redirectPath.slice(0, redirectPath.lastIndexOf("/") + 1);
    if (redirectDir && redirectDir !== "/" && parsed.pathname.startsWith(redirectDir)) {
      return true;
    }
    return false;
  }

  // Broad mode: same-origin non-PASS endpoints are redirect target app/site noise.
  return mode === "origin_except_pass";
}

function buildWebRequestHarEntries(flowEvents = [], context = null) {
  const records = new Map();

  const getRecord = (event) => {
    const tabId = Number(event?.tabId || 0);
    const requestId = String(event?.requestId || "").trim();
    const fallbackKey = `${tabId}:seq:${String(event?.seq || 0)}`;
    const key = requestId ? `${tabId}:${requestId}` : fallbackKey;
    const existing = records.get(key);
    if (existing) {
      return existing;
    }

    const record = {
      key,
      tabId,
      requestId,
      startedMs: 0,
      endedMs: 0,
      method: "",
      url: "",
      requestHeaders: {},
      responseHeaders: {},
      requestBody: null,
      status: 0,
      statusText: "",
      redirectUrl: "",
      errorText: "",
    };
    records.set(key, record);
    return record;
  };

  for (const event of flowEvents) {
    if (!event || event.source !== "web-request") {
      continue;
    }
    if (shouldIgnoreRedirectSiteUrl(event.url || "", context)) {
      continue;
    }

    const record = getRecord(event);
    const timestampMs = pickFlowEventTimestampMs(event, Date.now());
    if (!record.startedMs || timestampMs < record.startedMs) {
      record.startedMs = timestampMs;
    }
    if (!record.endedMs || timestampMs > record.endedMs) {
      record.endedMs = timestampMs;
    }

    if (!record.method) {
      record.method = String(event.method || "GET").toUpperCase();
    }
    if (!record.url) {
      record.url = String(event.url || "");
    }
    if (!record.requestHeaders || Object.keys(record.requestHeaders).length === 0) {
      if (event.requestHeaders && typeof event.requestHeaders === "object") {
        record.requestHeaders = event.requestHeaders;
      }
    }
    if (event.responseHeaders && typeof event.responseHeaders === "object") {
      record.responseHeaders = event.responseHeaders;
    }
    if (event.requestBody && record.requestBody === null) {
      record.requestBody = event.requestBody;
    }

    if (Number(event.statusCode || 0) > 0) {
      record.status = Number(event.statusCode || 0);
    }
    if (event.statusLine) {
      record.statusText = String(event.statusLine || "");
    }
    if (event.redirectUrl) {
      record.redirectUrl = String(event.redirectUrl || "");
    }
    if (event.error) {
      record.errorText = String(event.error || "");
    }
  }

  const entries = [];
  for (const record of records.values()) {
    if (!record.url) {
      continue;
    }

    const startedMs = record.startedMs || Date.now();
    const endedMs = record.endedMs || startedMs;
    const durationMs = Math.max(0, endedMs - startedMs);
    const requestHeaders = toHarHeadersArray(record.requestHeaders);
    const responseHeaders = toHarHeadersArray(record.responseHeaders);
    const requestBodyText =
      record.requestBody === null
        ? ""
        : typeof record.requestBody === "string"
          ? record.requestBody
          : JSON.stringify(record.requestBody);
    const mimeType = firstNonEmptyString([
      getHarHeaderValue(responseHeaders, "content-type").split(";")[0],
      getHarHeaderValue(requestHeaders, "content-type").split(";")[0],
      "application/octet-stream",
    ]);
    const status = Number(record.status || 0);

    entries.push({
      startedDateTime: new Date(startedMs).toISOString(),
      time: durationMs,
      request: {
        method: record.method || "GET",
        url: record.url,
        httpVersion: "HTTP/1.1",
        headers: requestHeaders,
        queryString: toHarQueryStringArray(record.url),
        cookies: [],
        headersSize: -1,
        bodySize: requestBodyText ? requestBodyText.length : 0,
        postData: requestBodyText
          ? {
              mimeType: firstNonEmptyString([getHarHeaderValue(requestHeaders, "content-type"), "application/json"]),
              text: truncateDebugText(requestBodyText, 10000),
            }
          : undefined,
      },
      response: {
        status,
        statusText: record.errorText || record.statusText || (status > 0 ? "" : "NETWORK_ERROR"),
        httpVersion: "HTTP/1.1",
        headers: responseHeaders,
        cookies: [],
        redirectURL: record.redirectUrl || "",
        headersSize: -1,
        bodySize: -1,
        content: {
          size: 0,
          mimeType,
        },
      },
      cache: {},
      timings: {
        send: 0,
        wait: durationMs,
        receive: 0,
      },
      _underpar: {
        source: "web-request",
        tabId: record.tabId,
        requestId: record.requestId,
      },
    });
  }

  return entries;
}

function buildExtensionHarEntries(flowEvents = []) {
  const entries = [];
  const pendingApiByKey = new Map();
  const pendingTokenByKey = new Map();

  const getApiKey = (event) => {
    return [
      String(event?.method || "GET").toUpperCase(),
      String(event?.url || ""),
      String(event?.requestorId || ""),
      String(event?.mvpd || ""),
      String(event?.requestScope || ""),
    ].join("|");
  };
  const getTokenKey = (event) => {
    return [
      String(event?.transport || ""),
      String(event?.method || "POST").toUpperCase(),
      String(event?.url || ""),
      String(event?.requestorId || ""),
      String(event?.mvpd || ""),
      String(event?.requestScope || ""),
    ].join("|");
  };

  for (const event of flowEvents) {
    if (!event || event.source !== "extension") {
      continue;
    }

    if (event.phase === "restv2-request") {
      const key = getApiKey(event);
      const queue = pendingApiByKey.get(key) || [];
      queue.push(event);
      pendingApiByKey.set(key, queue);
      continue;
    }

    if (event.phase === "restv2-response") {
      const key = getApiKey(event);
      const queue = pendingApiByKey.get(key) || [];
      const requestEvent = queue.length > 0 ? queue.shift() : null;
      if (queue.length === 0) {
        pendingApiByKey.delete(key);
      } else {
        pendingApiByKey.set(key, queue);
      }

      const startedMs = pickFlowEventTimestampMs(requestEvent || event, Date.now());
      const endedMs = pickFlowEventTimestampMs(event, startedMs);
      const durationMs = Math.max(0, endedMs - startedMs);
      const requestHeaders = toHarHeadersArray(requestEvent?.requestHeaders || {});
      const responseHeaders = toHarHeadersArray(event?.responseHeaders || {});
      const requestBodyText = String(requestEvent?.requestBodyPreview || "");
      const responseBodyText = String(event?.responsePreview || "");
      const requestUrl = String(event?.url || requestEvent?.url || "");
      const status = Number(event?.status || 0);
      const responseMimeType = firstNonEmptyString([
        getHarHeaderValue(responseHeaders, "content-type").split(";")[0],
        "application/json",
      ]);

      entries.push({
        startedDateTime: new Date(startedMs).toISOString(),
        time: durationMs,
        request: {
          method: String(event?.method || requestEvent?.method || "GET").toUpperCase(),
          url: requestUrl,
          httpVersion: "HTTP/1.1",
          headers: requestHeaders,
          queryString: toHarQueryStringArray(requestUrl),
          cookies: [],
          headersSize: -1,
          bodySize: requestBodyText ? requestBodyText.length : 0,
          postData: requestBodyText
            ? {
                mimeType: firstNonEmptyString([getHarHeaderValue(requestHeaders, "content-type"), "text/plain"]),
                text: truncateDebugText(requestBodyText, 10000),
              }
            : undefined,
        },
        response: {
          status,
          statusText: String(event?.statusText || ""),
          httpVersion: "HTTP/1.1",
          headers: responseHeaders,
          cookies: [],
          redirectURL: "",
          headersSize: -1,
          bodySize: responseBodyText ? responseBodyText.length : -1,
          content: {
            size: responseBodyText.length,
            mimeType: responseMimeType,
            text: responseBodyText ? truncateDebugText(responseBodyText, 10000) : undefined,
          },
        },
        cache: {},
        timings: {
          send: 0,
          wait: durationMs,
          receive: 0,
        },
        _underpar: {
          source: "extension-restv2",
          requestorId: String(event?.requestorId || requestEvent?.requestorId || ""),
          mvpd: String(event?.mvpd || requestEvent?.mvpd || ""),
          requestScope: String(event?.requestScope || requestEvent?.requestScope || ""),
        },
      });
      continue;
    }

    if (event.phase === "token-request-attempt") {
      const key = getTokenKey(event);
      const queue = pendingTokenByKey.get(key) || [];
      queue.push(event);
      pendingTokenByKey.set(key, queue);
      continue;
    }

    if (event.phase !== "token-request-attempt-succeeded" && event.phase !== "token-request-attempt-failed") {
      continue;
    }

    const key = getTokenKey(event);
    const queue = pendingTokenByKey.get(key) || [];
    const requestEvent = queue.length > 0 ? queue.shift() : null;
    if (queue.length === 0) {
      pendingTokenByKey.delete(key);
    } else {
      pendingTokenByKey.set(key, queue);
    }

    const startedMs = pickFlowEventTimestampMs(requestEvent || event, Date.now());
    const endedMs = pickFlowEventTimestampMs(event, startedMs);
    const durationMs = Math.max(0, endedMs - startedMs);
    const requestUrl = String(requestEvent?.url || event?.url || `${ADOBE_SP_BASE}/o/client/token`);
    const requestMethod = String(requestEvent?.method || event?.method || "POST").toUpperCase();
    const status = Number(event?.status || 0);
    const statusText = String(event?.statusText || event?.error || "");

    entries.push({
      startedDateTime: new Date(startedMs).toISOString(),
      time: durationMs,
      request: {
        method: requestMethod,
        url: requestUrl,
        httpVersion: "HTTP/1.1",
        headers: [],
        queryString: toHarQueryStringArray(requestUrl),
        cookies: [],
        headersSize: -1,
        bodySize: 0,
      },
      response: {
        status,
        statusText: statusText || (status > 0 ? "" : "TOKEN_REQUEST_FAILED"),
        httpVersion: "HTTP/1.1",
        headers: [],
        cookies: [],
        redirectURL: "",
        headersSize: -1,
        bodySize: -1,
        content: {
          size: 0,
          mimeType: "application/json",
        },
      },
      cache: {},
      timings: {
        send: 0,
        wait: durationMs,
        receive: 0,
      },
      _underpar: {
        source: "extension-token",
        requestorId: String(event?.requestorId || requestEvent?.requestorId || ""),
        mvpd: String(event?.mvpd || requestEvent?.mvpd || ""),
        requestScope: String(event?.requestScope || requestEvent?.requestScope || ""),
        transport: String(event?.transport || requestEvent?.transport || ""),
      },
    });
  }

  for (const queue of pendingApiByKey.values()) {
    for (const requestEvent of queue) {
      const startedMs = pickFlowEventTimestampMs(requestEvent, Date.now());
      const requestHeaders = toHarHeadersArray(requestEvent?.requestHeaders || {});
      const requestBodyText = String(requestEvent?.requestBodyPreview || "");
      const requestUrl = String(requestEvent?.url || "");
      entries.push({
        startedDateTime: new Date(startedMs).toISOString(),
        time: 0,
        request: {
          method: String(requestEvent?.method || "GET").toUpperCase(),
          url: requestUrl,
          httpVersion: "HTTP/1.1",
          headers: requestHeaders,
          queryString: toHarQueryStringArray(requestUrl),
          cookies: [],
          headersSize: -1,
          bodySize: requestBodyText ? requestBodyText.length : 0,
          postData: requestBodyText
            ? {
                mimeType: firstNonEmptyString([getHarHeaderValue(requestHeaders, "content-type"), "text/plain"]),
                text: truncateDebugText(requestBodyText, 10000),
              }
            : undefined,
        },
        response: {
          status: 0,
          statusText: "NO_RESPONSE",
          httpVersion: "HTTP/1.1",
          headers: [],
          cookies: [],
          redirectURL: "",
          headersSize: -1,
          bodySize: -1,
          content: {
            size: 0,
            mimeType: "application/json",
          },
        },
        cache: {},
        timings: {
          send: 0,
          wait: 0,
          receive: 0,
        },
        _underpar: {
          source: "extension-restv2",
          requestorId: String(requestEvent?.requestorId || ""),
          mvpd: String(requestEvent?.mvpd || ""),
          requestScope: String(requestEvent?.requestScope || ""),
        },
      });
    }
  }

  for (const queue of pendingTokenByKey.values()) {
    for (const requestEvent of queue) {
      const startedMs = pickFlowEventTimestampMs(requestEvent, Date.now());
      const requestUrl = String(requestEvent?.url || `${ADOBE_SP_BASE}/o/client/token`);
      const requestMethod = String(requestEvent?.method || "POST").toUpperCase();
      entries.push({
        startedDateTime: new Date(startedMs).toISOString(),
        time: 0,
        request: {
          method: requestMethod,
          url: requestUrl,
          httpVersion: "HTTP/1.1",
          headers: [],
          queryString: toHarQueryStringArray(requestUrl),
          cookies: [],
          headersSize: -1,
          bodySize: 0,
        },
        response: {
          status: 0,
          statusText: "NO_RESPONSE",
          httpVersion: "HTTP/1.1",
          headers: [],
          cookies: [],
          redirectURL: "",
          headersSize: -1,
          bodySize: -1,
          content: {
            size: 0,
            mimeType: "application/json",
          },
        },
        cache: {},
        timings: {
          send: 0,
          wait: 0,
          receive: 0,
        },
        _underpar: {
          source: "extension-token",
          requestorId: String(requestEvent?.requestorId || ""),
          mvpd: String(requestEvent?.mvpd || ""),
          requestScope: String(requestEvent?.requestScope || ""),
          transport: String(requestEvent?.transport || ""),
        },
      });
    }
  }

  return entries;
}

function buildHarLogFromFlowSnapshot(flowSnapshot, context = null, logoutResult = null) {
  const flowEvents = Array.isArray(flowSnapshot?.events) ? flowSnapshot.events : [];
  const entries = [...buildWebRequestHarEntries(flowEvents, context), ...buildExtensionHarEntries(flowEvents)].sort(
    (a, b) => {
    const left = Date.parse(a?.startedDateTime || "") || 0;
    const right = Date.parse(b?.startedDateTime || "") || 0;
    return left - right;
  }
  );

  const startedDateTime = entries[0]?.startedDateTime || new Date().toISOString();
  const pageId = `page-${String(flowSnapshot?.flowId || "capture")}`;
  const manifestVersion = chrome.runtime.getManifest().version;
  const pageTitle =
    context?.serviceType === "esm-decomp"
      ? "ESM decomp session"
      : context?.requestorId && context?.mvpd
        ? `${context.requestorId} x ${context.mvpd}`
        : "MVPD session";
  const compactContext = context
    ? {
        serviceType: String(context.serviceType || ""),
        programmerId: String(context.programmerId || ""),
        requestorId: String(context.requestorId || ""),
        mvpd: String(context.mvpd || ""),
        requestorIds: Array.isArray(context.requestorIds) ? context.requestorIds.slice(0, 24) : [],
        mvpdIds: Array.isArray(context.mvpdIds) ? context.mvpdIds.slice(0, 24) : [],
        serviceProviderId: String(context.serviceProviderId || ""),
        appGuid: String(context?.appInfo?.guid || ""),
        appName: String(context?.appInfo?.appName || ""),
        redirectUrl: String(context?.redirectUrl || ""),
      }
    : null;

  return {
    log: {
      version: "1.2",
      creator: {
        name: "UnderPAR",
        version: String(manifestVersion || "0"),
      },
      browser: {
        name: "Chrome Extension",
        version: String(manifestVersion || "0"),
      },
      pages: [
        {
          startedDateTime,
          id: pageId,
          title: pageTitle,
          pageTimings: {},
        },
      ],
      entries: entries.map((entry) => ({
        ...entry,
        pageref: pageId,
      })),
      _underpar: {
        flowId: String(flowSnapshot?.flowId || ""),
        eventCount: flowEvents.length,
        context: compactContext,
        logoutResult,
        generatedAt: new Date().toISOString(),
      },
    },
  };
}

function sanitizeHarFileSegment(value, fallback = "capture") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function buildRestV2HarFilename(context = null, logoutResult = null) {
  const requestor = sanitizeHarFileSegment(context?.requestorId || "requestor", "requestor");
  const mvpd = sanitizeHarFileSegment(context?.mvpd || "mvpd", "mvpd");
  const mode = logoutResult?.performed ? "full-login-logout" : "failed-login-attempt";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `underpar-restv2-${requestor}-${mvpd}-${mode}-${stamp}.har`;
}

function downloadHarFile(harPayload, fileName) {
  const json = JSON.stringify(harPayload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1500);
}

async function stopRestV2MvpdRecording(section, programmer, appInfo) {
  if (state.restV2Stopping) {
    return;
  }
  state.restV2Stopping = true;

  try {
  const closeButton = section?.querySelector(".rest-v2-close-login-btn");
  if (closeButton) {
    closeButton.disabled = true;
  }

  const activeFlowId = String(state.restV2DebugFlowId || "").trim();
  if (!activeFlowId) {
    state.restV2RecordingActive = false;
    state.restV2RecordingStartedAt = 0;
    state.restV2RecordingContext = null;
    state.restV2Stopping = false;
    syncRestV2LoginPanel(section, programmer, appInfo);
    setRestV2LoginPanelStatus(section, "No active recording session was found.");
    return;
  }

  const fallbackContextCandidate = buildCurrentRestV2SelectionContext(programmer, appInfo);
  const recordingContext =
    (state.restV2RecordingContext && typeof state.restV2RecordingContext === "object"
      ? state.restV2RecordingContext
      : null) || (fallbackContextCandidate.ok ? toRestV2RecordingContext(fallbackContextCandidate) : null);

  emitRestV2DebugEvent(activeFlowId, {
    source: "extension",
    phase: "recording-stop-request",
    requestorId: String(recordingContext?.requestorId || ""),
    mvpd: String(recordingContext?.mvpd || ""),
  });

  let logoutResult = {
    attempted: false,
    performed: false,
    actionName: "",
    actionType: "",
    logoutUrl: "",
    error: "",
  };
  let closeResult = { ok: true };

  try {
    if (
      recordingContext?.programmerId &&
      recordingContext?.appInfo?.guid &&
      recordingContext?.serviceProviderId &&
      recordingContext?.mvpd
    ) {
      const hasProfile = await hasActiveRestV2Profile(recordingContext, activeFlowId);
      if (hasProfile) {
        logoutResult = await executeRestV2LogoutFlow(recordingContext, activeFlowId);
      } else {
        emitRestV2DebugEvent(activeFlowId, {
          source: "extension",
          phase: "logout-skipped-no-active-profile",
          requestorId: recordingContext.requestorId,
          mvpd: recordingContext.mvpd,
        });
      }
    }

    closeResult = await closeRestV2LoginAndReturn(section, {
      suppressStatus: true,
      phasePrefix: "recording-close",
    });
  } catch (error) {
    logoutResult.error = error instanceof Error ? error.message : String(error);
  }

  await waitForDelay(900);
  const stopResult = await stopRestV2DebugFlowAndSnapshot(activeFlowId, "user-stop");

  state.restV2DebugFlowId = "";
  state.restV2RecordingActive = false;
  state.restV2RecordingStartedAt = 0;
  state.restV2RecordingContext = null;

  state.restV2Stopping = false;
  syncRestV2LoginPanel(section, programmer, appInfo);

  if (stopResult?.flow) {
    const harPayload = buildHarLogFromFlowSnapshot(stopResult.flow, recordingContext, logoutResult);
    const harFileName = buildRestV2HarFilename(recordingContext, logoutResult);
    downloadHarFile(harPayload, harFileName);

    if (closeResult?.ok === false) {
      setRestV2LoginPanelStatus(
        section,
        `Recording stopped. HAR downloaded as ${harFileName}. Login window close note: ${closeResult.error || "unknown"}.`,
        "error"
      );
    } else if (logoutResult.performed) {
      setRestV2LoginPanelStatus(
        section,
        `Recording stopped. Downloaded full login/logout HAR: ${harFileName}`,
        "success"
      );
    } else {
      const logoutNote = logoutResult.error ? ` Logout note: ${logoutResult.error}` : "";
      setRestV2LoginPanelStatus(
        section,
        `Recording stopped. Downloaded failed login attempt HAR: ${harFileName}.${logoutNote}`,
        "success"
      );
    }
  } else {
    const failureReason = stopResult?.error || "Flow snapshot unavailable.";
    setRestV2LoginPanelStatus(section, `Recording stopped, but HAR export failed: ${failureReason}`, "error");
  }
  } finally {
    state.restV2Stopping = false;
  }
}

const ESM_METRIC_COLUMNS = new Set([
  "authn-attempts",
  "authn-successful",
  "authn-pending",
  "authn-failed",
  "clientless-tokens",
  "clientless-failures",
  "authz-attempts",
  "authz-successful",
  "authz-failed",
  "authz-rejected",
  "authz-latency",
  "media-tokens",
  "unique-accounts",
  "unique-sessions",
  "count",
]);
const ESM_DATE_PARTS = ["year", "month", "day", "hour", "minute"];

function isoTimestamp(date) {
  return new Date(date).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function getSelectedRequestorId() {
  return String(state.selectedRequestorId || els.requestorSelect?.value || "").trim();
}

function getSelectedMvpdId() {
  return String(state.selectedMvpdId || els.mvpdSelect?.value || "").trim();
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
  const date = new Date(esmPartsToUtcMs(row));
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

function getLastModifiedSourceTimezone(rawHttpDate) {
  if (rawHttpDate == null || typeof rawHttpDate !== "string") {
    return "";
  }
  const tail = rawHttpDate.trim().split(/\s+/).pop();
  if (!tail) {
    return "";
  }
  if (/^[A-Z]{2,4}$/i.test(tail)) {
    return tail.toUpperCase();
  }
  if (/^[+-]\d{4}$/.test(tail)) {
    return tail;
  }
  return "";
}

function formatLastModifiedForDisplay(rawHttpDate) {
  if (rawHttpDate == null || String(rawHttpDate).trim() === "") {
    return rawHttpDate;
  }
  const date = new Date(rawHttpDate);
  if (Number.isNaN(date.getTime())) {
    return rawHttpDate;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CLIENT_TIMEZONE,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type) => parts.find((part) => part.type === type)?.value ?? "";
  const tzName = getPart("timeZoneName");
  return `${getPart("month")}/${getPart("day")}/${getPart("year")} ${getPart("hour")}:${getPart("minute")}:${getPart("second")} ${tzName || CLIENT_TIMEZONE}`;
}

function esmToNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function esmSafeRate(numerator, denominator) {
  const n = esmToNumber(numerator);
  const d = esmToNumber(denominator);
  if (n == null || d == null || d <= 0) {
    return null;
  }
  const rate = n / d;
  return Number.isFinite(rate) ? rate : null;
}

function esmFormatPercent(rate) {
  if (rate == null) {
    return "—";
  }
  return `${(rate * 100).toFixed(2)}%`;
}

function createEsmCell(value) {
  const cell = document.createElement("td");
  const text = value == null ? "" : String(value);
  cell.textContent = text;
  cell.title = text;
  return cell;
}

function buildEsmCsvFileName(programmerId) {
  const requestorId = getSelectedRequestorId();
  const mvpdId = getSelectedMvpdId();
  const now = new Date();
  const timestamp = [
    now.getFullYear().toString(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `esm_${sanitizeHarFileSegment(programmerId, "programmer")}_${sanitizeHarFileSegment(requestorId, "all-requestors")}_${sanitizeHarFileSegment(mvpdId, "all-mvpds")}_${timestamp}.csv`;
}

function getDefaultEsmSortStack() {
  return [{ col: "DATE", dir: "DESC" }];
}

function getEsmCellValue(row, columnKey, context) {
  if (columnKey === "DATE") {
    return esmPartsToUtcMs(row);
  }

  if (context.hasAuthN && columnKey === "AuthN Success") {
    const rate = esmSafeRate(row["authn-successful"], row["authn-attempts"]);
    return rate == null ? -1 : rate;
  }

  if (context.hasAuthZ && columnKey === "AuthZ Success") {
    const rate = esmSafeRate(row["authz-successful"], row["authz-attempts"]);
    return rate == null ? -1 : rate;
  }

  if (columnKey === "COUNT") {
    const value = esmToNumber(row.count);
    return value == null ? 0 : value;
  }

  const rawValue = row[columnKey];
  if (rawValue == null) {
    return "";
  }

  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return rawValue;
  }

  const converted = esmToNumber(rawValue);
  if (converted != null) {
    return converted;
  }

  return String(rawValue).toLowerCase();
}

function sortEsmRows(rows, sortStack, context) {
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? sortStack : getDefaultEsmSortStack();

  return [...rows].sort((left, right) => {
    for (const sortRule of stack) {
      const factor = sortRule.dir === "ASC" ? 1 : -1;
      const leftValue = getEsmCellValue(left, sortRule.col, context);
      const rightValue = getEsmCellValue(right, sortRule.col, context);

      if (leftValue < rightValue) {
        return -1 * factor;
      }
      if (leftValue > rightValue) {
        return 1 * factor;
      }
    }

    return getEsmCellValue(right, "DATE", context) - getEsmCellValue(left, "DATE", context);
  });
}

function renderEsmTableBody(stateSnapshot) {
  const { tbody, data, hasAuthN, hasAuthZ, hasCount, displayColumns } = stateSnapshot;
  tbody.innerHTML = "";

  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.appendChild(createEsmCell(buildEsmDateLabel(row)));

    if (hasAuthN) {
      tableRow.appendChild(createEsmCell(esmFormatPercent(esmSafeRate(row["authn-successful"], row["authn-attempts"]))));
    }
    if (hasAuthZ) {
      tableRow.appendChild(createEsmCell(esmFormatPercent(esmSafeRate(row["authz-successful"], row["authz-attempts"]))));
    }
    if (!hasAuthN && !hasAuthZ && hasCount) {
      tableRow.appendChild(createEsmCell(row.count));
    }

    displayColumns.forEach((column) => {
      tableRow.appendChild(createEsmCell(row[column] ?? ""));
    });

    tbody.appendChild(tableRow);
  });
}

function refreshEsmHeaderStates(stateSnapshot) {
  if (!stateSnapshot || !stateSnapshot.thead) {
    return;
  }
  stateSnapshot.thead.querySelectorAll("th").forEach((headerCell) => {
    if (typeof headerCell._updateState === "function") {
      headerCell._updateState();
    }
  });
}

function downloadEsmCsv(rows, sortRule, context, fileName) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const sortedRows = sortEsmRows(rows, sortRule ? [sortRule] : getDefaultEsmSortStack(), context);
  const headers = Object.keys(sortedRows[0]);
  const lines = [
    headers.join(","),
    ...sortedRows.map((row) =>
      headers
        .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = fileName || "esm-report.csv";
  downloadLink.click();
  URL.revokeObjectURL(blobUrl);
}

function renderEsmReportTable(contentElement, reportRows, lastModified, programmerId) {
  if (!Array.isArray(reportRows) || reportRows.length === 0) {
    contentElement.innerHTML =
      '<div class="metadata-item"><p class="metadata-key">ESM</p><p class="metadata-value"><span class="null-value">No rows returned.</span></p></div>';
    return;
  }

  contentElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer">
                <a href="#" class="esm-csv-link">CSV</a>
                <span class="esm-last-modified"></span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  const table = contentElement.querySelector(".esm-table");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  const firstRow = reportRows[0];
  const hasAuthN = firstRow["authn-attempts"] != null && firstRow["authn-successful"] != null;
  const hasAuthZ = firstRow["authz-attempts"] != null && firstRow["authz-successful"] != null;
  const hasCount = firstRow.count != null;
  const displayColumns = Object.keys(firstRow).filter(
    (column) => !ESM_METRIC_COLUMNS.has(column) && !ESM_DATE_PARTS.includes(column) && column !== "media-company"
  );

  const headers = ["DATE"];
  if (hasAuthN) {
    headers.push("AuthN Success");
  }
  if (hasAuthZ) {
    headers.push("AuthZ Success");
  }
  if (!hasAuthN && !hasAuthZ && hasCount) {
    headers.push("COUNT");
  }
  headers.push(...displayColumns);

  const context = { hasAuthN, hasAuthZ };
  const tableState = {
    thead,
    tbody,
    data: reportRows,
    sortStack: getDefaultEsmSortStack(),
    hasAuthN,
    hasAuthZ,
    hasCount,
    displayColumns,
    context,
  };

  const headerRow = thead.querySelector("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.style.cursor = "pointer";
    th.textContent = header;

    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.style.marginLeft = "6px";
    th.appendChild(icon);

    th._updateState = () => {
      const isActive = tableState.sortStack[0]?.col === header;
      th.classList.toggle("active-sort", isActive);
      icon.textContent = isActive ? (tableState.sortStack[0].dir === "ASC" ? "▲" : "▼") : "";
    };

    th.addEventListener("click", (event) => {
      const existingRule = tableState.sortStack.find((rule) => rule.col === header);

      if (event.shiftKey && existingRule) {
        existingRule.dir = existingRule.dir === "DESC" ? "ASC" : "DESC";
      } else if (event.shiftKey) {
        tableState.sortStack.push({ col: header, dir: "DESC" });
      } else {
        tableState.sortStack = [
          {
            col: header,
            dir: existingRule ? (existingRule.dir === "DESC" ? "ASC" : "DESC") : "DESC",
          },
        ];
      }

      tableState.data = sortEsmRows(tableState.data, tableState.sortStack, context);
      renderEsmTableBody(tableState);
      refreshEsmHeaderStates(tableState);
    });

    headerRow.appendChild(th);
  });

  const footerCell = contentElement.querySelector(".esm-footer-cell");
  if (footerCell) {
    footerCell.colSpan = Math.max(1, headers.length);
  }

  tableState.data = sortEsmRows(tableState.data, tableState.sortStack, context);
  renderEsmTableBody(tableState);
  refreshEsmHeaderStates(tableState);

  const csvLink = contentElement.querySelector(".esm-csv-link");
  if (csvLink) {
    csvLink.addEventListener("click", (event) => {
      event.preventDefault();
      const csvFileName = buildEsmCsvFileName(programmerId);
      downloadEsmCsv(reportRows, tableState.sortStack[0], context, csvFileName);
    });
  }

  const lastModifiedLabel = contentElement.querySelector(".esm-last-modified");
  if (!lastModifiedLabel) {
    return;
  }

  if (lastModified) {
    const sourceTz = getLastModifiedSourceTimezone(lastModified);
    lastModifiedLabel.textContent = `Last-Modified: ${formatLastModifiedForDisplay(lastModified)}`;
    lastModifiedLabel.title = sourceTz
      ? `Server time: ${sourceTz} (converted to your timezone)`
      : "Converted to your timezone";
  } else {
    lastModifiedLabel.textContent = "Last-Modified: (real-time)";
  }
}

function isEsmServiceRequestActive(section, requestToken, programmerId) {
  if (!section || !section.isConnected) {
    return false;
  }
  if (requestToken !== state.premiumPanelRequestToken) {
    return false;
  }
  const selected = resolveSelectedProgrammer();
  return Boolean(selected && selected.programmerId === programmerId);
}

function buildEsmUrl() {
  const now = new Date();
  const start = new Date(now.getTime() - 60 * 60 * 1000);

  const params = new URLSearchParams();
  params.set("start", isoTimestamp(start));
  params.set("end", isoTimestamp(now));
  params.set("format", "json");
  params.set("limit", String(ESM_INLINE_RESULT_LIMIT));

  const selectedRequestor = getSelectedRequestorId();
  if (selectedRequestor) {
    params.append("requestor-id", selectedRequestor);
  }

  const selectedMvpd = getSelectedMvpdId();
  if (selectedMvpd) {
    params.append("mvpd", selectedMvpd);
  }

  return `${ADOBE_MGMT_BASE}/esm/v3/media-company/year/month/day/hour/minute?${params.toString()}`;
}

async function loadEsmService(programmer, appInfo, section, contentElement, refreshButton, requestToken) {
  if (!contentElement) {
    return;
  }
  if (!programmer?.programmerId || !appInfo?.guid) {
    contentElement.innerHTML = '<div class="service-error">Missing media company or ESM application details.</div>';
    return;
  }

  if (refreshButton) {
    refreshButton.disabled = true;
  }
  contentElement.innerHTML = '<div class="loading">Loading ESM data...</div>';

  try {
    const url = buildEsmUrl();
    const response = await fetchWithPremiumAuth(
      programmer.programmerId,
      appInfo,
      url,
      { method: "GET" },
      "refresh",
      {
        scope: "esm",
        requestorId: getSelectedRequestorId(),
        mvpd: getSelectedMvpdId(),
      }
    );
    const lastModified = response.headers.get("Last-Modified");
    const bodyText = await response.text();

    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }

    if (!response.ok) {
      contentElement.innerHTML = `<div class="service-error">HTTP ${response.status} ${escapeHtml(response.statusText)}
${escapeHtml(bodyText || "")}</div>`;
      return;
    }

    let jsonData = null;
    try {
      jsonData = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      jsonData = null;
    }

    const reportRows = Array.isArray(jsonData?.report) ? jsonData.report : [];
    renderEsmReportTable(contentElement, reportRows, lastModified, programmer.programmerId);
  } catch (error) {
    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    contentElement.innerHTML = `<div class="service-error">${escapeHtml(error instanceof Error ? error.message : String(error))}</div>`;
  } finally {
    if (refreshButton && isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      refreshButton.disabled = false;
    }
  }
}

function refreshEsmPanels() {
  const sections = document.querySelectorAll(
    ".premium-service-section.service-esm, .premium-service-section.service-esm-click"
  );
  if (!sections || sections.length === 0) {
    return;
  }

  sections.forEach((section) => {
    if (typeof section.__underparRefreshEsm === "function") {
      void section.__underparRefreshEsm();
    }
    if (typeof section.__underparRefreshClickEsm === "function") {
      void section.__underparRefreshClickEsm();
    }
  });
}

const CLICK_ESM_ZOOM_OPTIONS = ["", "YR", "MO", "DAY", "HR", "MIN"];
const CLICK_ESM_ZOOM_TOKEN_BY_KEY = {
  YR: "/year",
  MO: "/month",
  DAY: "/day",
  HR: "/hour",
  MIN: "/minute",
};
const CLICK_ESM_METRIC_COLUMNS = new Set([...ESM_METRIC_COLUMNS, "authn-failed", "decision-media-tokens"]);

function clickEsmEscapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clickEsmNormalizeSearchTerm(rawValue) {
  return String(rawValue || "")
    .toLowerCase()
    .split(" ")
    .join("");
}

function clickEsmGetZoomKey(endpoint) {
  const explicit = String(endpoint?.zoomKey || "").trim().toUpperCase();
  if (CLICK_ESM_ZOOM_OPTIONS.includes(explicit)) {
    return explicit;
  }

  const href = String(endpoint?.url || "");
  let detected = "";
  let bestIndex = -1;
  Object.entries(CLICK_ESM_ZOOM_TOKEN_BY_KEY).forEach(([key, token]) => {
    const index = href.lastIndexOf(token);
    if (index > bestIndex) {
      detected = key;
      bestIndex = index;
    }
  });
  return detected;
}

function clickEsmIso(date) {
  return new Date(date).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function clickEsmShiftInstantToPstCalendar(date) {
  return new Date(date.getTime() + ESM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000);
}

function clickEsmComputeTimeWindow(zoomKey) {
  const now = new Date();
  const nowPst = clickEsmShiftInstantToPstCalendar(now);

  if (zoomKey === "YR") {
    return {
      start: String(nowPst.getUTCFullYear() - 1),
      end: clickEsmIso(now),
    };
  }

  if (zoomKey === "MO") {
    const previousMonth = new Date(Date.UTC(nowPst.getUTCFullYear(), nowPst.getUTCMonth() - 1, 1));
    return {
      start: `${previousMonth.getUTCFullYear()}-${String(previousMonth.getUTCMonth() + 1).padStart(2, "0")}`,
      end: clickEsmIso(now),
    };
  }

  if (zoomKey === "DAY") {
    const previousDay = new Date(
      Date.UTC(nowPst.getUTCFullYear(), nowPst.getUTCMonth(), nowPst.getUTCDate() - 1)
    );
    return {
      start: `${previousDay.getUTCFullYear()}-${String(previousDay.getUTCMonth() + 1).padStart(2, "0")}-${String(
        previousDay.getUTCDate()
      ).padStart(2, "0")}`,
      end: clickEsmIso(now),
    };
  }

  if (zoomKey === "HR") {
    return {
      start: clickEsmIso(new Date(now.getTime() - 12 * 60 * 60 * 1000)),
      end: clickEsmIso(now),
    };
  }

  if (zoomKey === "MIN") {
    return {
      start: clickEsmIso(new Date(now.getTime() - 60 * 60 * 1000)),
      end: clickEsmIso(now),
    };
  }

  return { start: clickEsmIso(now), end: clickEsmIso(now) };
}

function clickEsmGetSelectedValues(selectElement) {
  if (!selectElement) {
    return [];
  }
  return [...selectElement.selectedOptions].map((option) => String(option.value || "").trim()).filter(Boolean);
}

function clickEsmBuildRequestMetadata(clickState) {
  const requestorSelect = clickState.contentElement?.querySelector(".click-esm-requestor-select");
  const mvpdSelect = clickState.contentElement?.querySelector(".click-esm-mvpd-select");
  const requestorIds = clickEsmGetSelectedValues(requestorSelect);
  const mvpds = clickEsmGetSelectedValues(mvpdSelect);
  return {
    requestorId: requestorIds[0] || "",
    mvpd: mvpds[0] || "",
  };
}

function clickEsmEnsureLimit(url, limit) {
  try {
    const parsed = new URL(url);
    const isEsmEndpoint = parsed.origin === ADOBE_MGMT_BASE && parsed.pathname.includes("/esm/");
    if (!isEsmEndpoint) {
      return parsed.toString();
    }
    parsed.searchParams.set("limit", String(limit));
    return parsed.toString();
  } catch {
    return String(url || "");
  }
}

function clickEsmBuildEndpointUrl(clickState, endpoint) {
  const zoomKey = clickEsmGetZoomKey(endpoint);
  const timeWindow = clickEsmComputeTimeWindow(zoomKey);
  const requestorSelect = clickState.contentElement?.querySelector(".click-esm-requestor-select");
  const mvpdSelect = clickState.contentElement?.querySelector(".click-esm-mvpd-select");
  const requestorIds = clickEsmGetSelectedValues(requestorSelect);
  const mvpdIds = mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(mvpdSelect);

  const parsed = new URL(endpoint.url);
  parsed.searchParams.set("start", timeWindow.start);
  parsed.searchParams.set("end", timeWindow.end);
  parsed.searchParams.set("format", "json");
  parsed.searchParams.delete("requestor-id");
  parsed.searchParams.delete("mvpd");
  requestorIds.forEach((requestorId) => {
    parsed.searchParams.append("requestor-id", requestorId);
  });
  mvpdIds.forEach((mvpd) => {
    parsed.searchParams.append("mvpd", mvpd);
  });

  return parsed.toString();
}

function clickEsmSetNetworkBusy(clickState, isBusy) {
  if (!clickState?.contentElement) {
    return;
  }
  const shell = clickState.contentElement.querySelector(".click-esm-shell");
  const indicator = clickState.contentElement.querySelector(".click-esm-net-indicator");
  if (shell) {
    shell.classList.toggle("net-busy", Boolean(isBusy));
  }
  if (indicator) {
    indicator.hidden = !isBusy;
  }
}

function clickEsmStartNetwork(clickState) {
  if (!clickState) {
    return;
  }
  clickState.netInFlight = Number(clickState.netInFlight || 0) + 1;
  if (clickState.netInFlight === 1) {
    clickEsmSetNetworkBusy(clickState, true);
  }
}

function clickEsmEndNetwork(clickState) {
  if (!clickState) {
    return;
  }
  clickState.netInFlight = Math.max(0, Number(clickState.netInFlight || 0) - 1);
  if (clickState.netInFlight === 0) {
    clickEsmSetNetworkBusy(clickState, false);
  }
}

async function clickEsmFetchWithPremiumAuth(clickState, url, options = {}, limit = CLICK_ESM_CSV_RESULT_LIMIT) {
  const finalUrl = clickEsmEnsureLimit(url, limit);
  const requestMeta = clickEsmBuildRequestMetadata(clickState);
  clickEsmStartNetwork(clickState);
  try {
    return await fetchWithPremiumAuth(
      clickState.programmer?.programmerId,
      clickState.appInfo,
      finalUrl,
      options,
      "refresh",
      {
        scope: "esm-click",
        requestorId: requestMeta.requestorId,
        mvpd: requestMeta.mvpd,
      }
    );
  } finally {
    clickEsmEndNetwork(clickState);
  }
}

async function loadClickEsmEndpoints() {
  if (Array.isArray(clickEsmEndpoints) && clickEsmEndpoints.length > 0) {
    return clickEsmEndpoints;
  }
  if (clickEsmEndpointsPromise) {
    return clickEsmEndpointsPromise;
  }

  clickEsmEndpointsPromise = (async () => {
    const resourceUrl = chrome.runtime.getURL(CLICK_ESM_ENDPOINTS_PATH);
    const response = await fetch(resourceUrl, {
      method: "GET",
      credentials: "omit",
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error(`Unable to load clickESM endpoint catalog (${response.status}).`);
    }

    const payload = await response.json().catch(() => null);
    const endpoints = Array.isArray(payload?.endpoints) ? payload.endpoints : [];
    clickEsmEndpoints = endpoints
      .map((endpoint) => {
        if (!endpoint || typeof endpoint !== "object") {
          return null;
        }
        const url = String(endpoint.url || "").trim();
        if (!url) {
          return null;
        }
        const zoomKey = clickEsmGetZoomKey(endpoint);
        return {
          url,
          zoomClass: String(endpoint.zoomClass || "").trim(),
          zoomKey,
          columns: Array.isArray(endpoint.columns) ? endpoint.columns.map((value) => String(value || "").trim()).filter(Boolean) : [],
        };
      })
      .filter(Boolean);

    return clickEsmEndpoints;
  })();

  try {
    return await clickEsmEndpointsPromise;
  } finally {
    clickEsmEndpointsPromise = null;
  }
}

function clickEsmBuildShellHtml(endpoints) {
  const endpointRows = endpoints
    .map((endpoint, index) => {
      const zoomKey = clickEsmGetZoomKey(endpoint);
      return `
        <dl class="click-esm-item" data-endpoint-index="${index}" data-zoom-key="${escapeHtml(zoomKey)}">
          <dt>
            <button type="button" class="click-esm-link" data-endpoint-index="${index}" title="${escapeHtml(endpoint.url)}">
              ${escapeHtml(endpoint.url)}
            </button>
          </dt>
          <dd class="click-esm-col-list"></dd>
          <dd class="click-esm-table-host" data-endpoint-index="${index}"></dd>
        </dl>
      `;
    })
    .join("");

  const zoomOptions = CLICK_ESM_ZOOM_OPTIONS.map((key) => {
    const value = escapeHtml(key);
    const label = key ? escapeHtml(key) : "";
    return `<option value="${value}">${label}</option>`;
  }).join("");

  return `
    <div class="click-esm-shell">
      <div class="click-esm-toolbar">
        <select class="click-esm-zoom-filter" title="Zoom Level">${zoomOptions}</select>
        <input type="text" class="click-esm-search" placeholder="ESM Column search..." />
        <button type="button" class="click-esm-find-btn">FIND IT</button>
        <button type="button" class="click-esm-reset-btn">RESET</button>
        <span class="click-esm-net-indicator" title="Loading" aria-label="Loading" hidden></span>
      </div>
      <div class="click-esm-scroll-container">
        ${endpointRows}
      </div>
      <div class="click-esm-footer">
        <select
          class="click-esm-requestor-select"
          multiple
          size="1"
          title="Filter by selected requestor-id(s)"
        ></select>
        <select
          class="click-esm-mvpd-select"
          multiple
          size="1"
          title="Filter by selected MVPD(s)"
          disabled
          hidden
        ></select>
      </div>
    </div>
  `;
}

function clickEsmSetEndpointButtonUrl(clickState, endpointIndex, fullUrl) {
  if (!clickState?.contentElement) {
    return;
  }
  const button = clickState.contentElement.querySelector(`.click-esm-link[data-endpoint-index="${endpointIndex}"]`);
  if (!button) {
    return;
  }

  const normalized = String(fullUrl || "").trim();
  if (!normalized) {
    return;
  }

  button.textContent = normalized;
  button.title = normalized;
}

function clickEsmRefreshEndpointUrls(clickState) {
  if (!clickState?.contentElement || !Array.isArray(clickState.endpoints)) {
    return;
  }
  clickState.endpoints.forEach((endpoint, endpointIndex) => {
    const url = clickEsmBuildEndpointUrl(clickState, endpoint);
    clickEsmSetEndpointButtonUrl(clickState, endpointIndex, url);
  });
}

function clickEsmSetColumnListMarkup(columnElement, columns = [], highlightedTerm = "") {
  if (!columnElement) {
    return;
  }

  const normalizedColumns = Array.isArray(columns) ? columns.map((value) => String(value || "").trim()).filter(Boolean) : [];
  if (normalizedColumns.length === 0) {
    columnElement.innerHTML = '<span class="click-esm-col-chip">No report columns</span>';
    return;
  }

  const markMatches = (value, term) => {
    if (!term) {
      return escapeHtml(value);
    }
    const safeTerm = clickEsmEscapeRegExp(term);
    const pattern = new RegExp(safeTerm, "gi");
    let output = "";
    let cursor = 0;
    let match = pattern.exec(value);
    while (match) {
      output += escapeHtml(value.slice(cursor, match.index));
      output += `<span class="click-esm-highlight">${escapeHtml(match[0])}</span>`;
      cursor = match.index + match[0].length;
      if (match[0].length === 0) {
        break;
      }
      match = pattern.exec(value);
    }
    output += escapeHtml(value.slice(cursor));
    return output;
  };

  const chipsHtml = normalizedColumns
    .map((columnValue) => {
      const hasMatch = highlightedTerm && columnValue.toLowerCase().includes(highlightedTerm);
      const chipClass = hasMatch ? "click-esm-col-chip click-esm-col-chip-match" : "click-esm-col-chip";
      return `<span class="${chipClass}">${markMatches(columnValue, highlightedTerm)}</span>`;
    })
    .join("");
  columnElement.innerHTML = chipsHtml;
}

function clickEsmApplyEndpointFilters(clickState, options = {}) {
  const zoomFilter = String(clickState.zoomFilterSelect?.value || "").trim().toUpperCase();
  const rawSearch = String(clickState.searchInput?.value || "");
  const normalizedTerm = clickEsmNormalizeSearchTerm(rawSearch);
  const shouldHighlight = Boolean(options.highlight && normalizedTerm);

  clickState.contentElement?.querySelectorAll(".click-esm-item").forEach((itemElement) => {
    const endpointIndex = Number(itemElement.getAttribute("data-endpoint-index"));
    const endpoint = clickState.endpoints[endpointIndex];
    const endpointZoom = clickEsmGetZoomKey(endpoint);
    const columnElement = itemElement.querySelector(".click-esm-col-list");
    const columnValues = Array.isArray(endpoint?.columns) ? endpoint.columns : [];
    const columnsRawText = columnValues.join(" ");

    if (columnElement) {
      clickEsmSetColumnListMarkup(columnElement, columnValues, shouldHighlight ? normalizedTerm : "");
    }
    itemElement.classList.remove("click-esm-parent-highlight");

    const zoomPass = !zoomFilter || endpointZoom === zoomFilter;
    const searchPass = !normalizedTerm || String(columnsRawText || "").toLowerCase().includes(normalizedTerm);
    const shouldShow = zoomPass && searchPass;
    itemElement.hidden = !shouldShow;

    if (shouldShow && shouldHighlight) {
      itemElement.classList.add("click-esm-parent-highlight");
    }
  });
}

function clickEsmHideMvpdSelector(clickState) {
  const mvpdSelect = clickState.mvpdSelect;
  if (!mvpdSelect) {
    return;
  }
  mvpdSelect.innerHTML = "";
  mvpdSelect.disabled = true;
  mvpdSelect.hidden = true;
  clickState.lastKnownSelectedMvpdIds = new Set();
}

function clickEsmRememberMvpdSelection(clickState) {
  clickState.lastKnownSelectedMvpdIds = new Set(clickEsmGetSelectedValues(clickState.mvpdSelect));
}

function clickEsmGetSharedMvpdMapForRequestor(requestorId) {
  const normalizedRequestorId = String(requestorId || "").trim();
  if (!normalizedRequestorId) {
    return null;
  }
  const map = state.mvpdCacheByRequestor.get(normalizedRequestorId);
  if (map instanceof Map && map.size > 0) {
    return map;
  }
  return null;
}

async function clickEsmLoadMvpdMapForRequestor(requestorId) {
  const normalizedRequestorId = String(requestorId || "").trim();
  if (!normalizedRequestorId) {
    return new Map();
  }
  const sharedMap = clickEsmGetSharedMvpdMapForRequestor(normalizedRequestorId);
  if (sharedMap) {
    return sharedMap;
  }
  return loadMvpdsFromRestV2(normalizedRequestorId);
}

function syncClickEsmMvpdMenusForRequestor(requestorId, mvpdMap) {
  const normalizedRequestorId = String(requestorId || "").trim();
  if (!normalizedRequestorId || !(mvpdMap instanceof Map)) {
    return;
  }

  getInteractiveEsmStates().forEach((clickState) => {
    if (!clickState?.section?.isConnected || !clickState.requestorSelect || !clickState.mvpdSelect) {
      return;
    }

    const selectedRequestorIds = clickEsmGetSelectedValues(clickState.requestorSelect);
    const isExactRequestorSelection =
      selectedRequestorIds.length === 1 && selectedRequestorIds[0] === normalizedRequestorId;
    const isImplicitTopSelection =
      selectedRequestorIds.length === 0 && String(state.selectedRequestorId || "").trim() === normalizedRequestorId;
    if (!isExactRequestorSelection && !isImplicitTopSelection) {
      return;
    }

    if (isImplicitTopSelection && clickState.requestorSelect?.options?.length) {
      [...clickState.requestorSelect.options].forEach((option) => {
        option.selected = option.value === normalizedRequestorId;
      });
      clickState.pendingRequestorIds = [normalizedRequestorId];
    }

    const currentSelected = new Set(clickEsmGetSelectedValues(clickState.mvpdSelect));
    const desiredSelectedIds = currentSelected.size ? currentSelected : new Set(clickState.lastKnownSelectedMvpdIds);
    clickState.mvpdSelect.disabled = true;
    clickState.mvpdSelect.hidden = false;
    clickEsmApplyMvpdOptions(clickState, [...mvpdMap.entries()], desiredSelectedIds);
    clickState.mvpdSelect.disabled = false;
    clickEsmRememberMvpdSelection(clickState);
    if (clickState.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
  });
}

function clearClickEsmMvpdMenusForRequestor(requestorId, label = "-- MVPD config unavailable --") {
  const normalizedRequestorId = String(requestorId || "").trim();
  const clearAll = normalizedRequestorId.length === 0;
  getInteractiveEsmStates().forEach((clickState) => {
    if (!clickState?.section?.isConnected || !clickState.requestorSelect || !clickState.mvpdSelect) {
      return;
    }

    const selectedRequestorIds = clickEsmGetSelectedValues(clickState.requestorSelect);
    const isExactRequestorSelection =
      selectedRequestorIds.length === 1 && selectedRequestorIds[0] === normalizedRequestorId;
    const isImplicitTopSelection =
      selectedRequestorIds.length === 0 && String(state.selectedRequestorId || "").trim() === normalizedRequestorId;
    if (!clearAll && !isExactRequestorSelection && !isImplicitTopSelection) {
      return;
    }

    clickState.mvpdSelect.innerHTML = `<option value="">${escapeHtml(label)}</option>`;
    clickState.mvpdSelect.disabled = true;
    clickState.mvpdSelect.hidden = false;
    clickState.lastKnownSelectedMvpdIds = new Set();
    if (clickState.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
  });
}

function clickEsmApplyMvpdOptions(clickState, entries, desiredSelectedIds) {
  const mvpdSelect = clickState.mvpdSelect;
  if (!mvpdSelect) {
    return;
  }
  mvpdSelect.innerHTML = "";

  let lastLetter = "";
  let indexWithinGroup = 0;
  const orderedEntries = [...entries].sort((left, right) => {
    const leftName = String(left?.[1]?.name || left?.[0] || "");
    const rightName = String(right?.[1]?.name || right?.[0] || "");
    return leftName.localeCompare(rightName, undefined, { sensitivity: "base" });
  });

  orderedEntries.forEach(([mvpdId, metadata]) => {
    const option = document.createElement("option");
    const displayName = String(metadata?.name || mvpdId || "");
    const isProxy = metadata?.isProxy === false ? false : true;
    option.value = mvpdId;
    option.textContent = `${displayName} (${mvpdId})`;
    option.classList.add(isProxy ? "click-esm-mvpd-proxy" : "click-esm-mvpd-direct");
    option.style.fontWeight = isProxy ? "400" : "700";

    const letterMatch = displayName.match(/[A-Za-z]/);
    const currentLetter = letterMatch ? letterMatch[0].toUpperCase() : "A";
    if (currentLetter !== lastLetter) {
      lastLetter = currentLetter;
      indexWithinGroup = 0;
    }

    const isGroupA = (currentLetter.charCodeAt(0) - 65) % 2 === 0;
    const isOdd = indexWithinGroup % 2 === 1;
    if (isGroupA) {
      option.classList.add(isOdd ? "click-esm-mvpd-tone-a2" : "click-esm-mvpd-tone-a1");
      option.style.backgroundColor = isOdd ? "#dcebff" : "#eaf3ff";
    } else {
      option.classList.add(isOdd ? "click-esm-mvpd-tone-b2" : "click-esm-mvpd-tone-b1");
      option.style.backgroundColor = isOdd ? "#ffe3d1" : "#fff1e6";
    }
    indexWithinGroup += 1;

    if (desiredSelectedIds && desiredSelectedIds.has(mvpdId)) {
      option.selected = true;
    }
    mvpdSelect.appendChild(option);
  });

  if (![...mvpdSelect.options].some((option) => option.selected)) {
    mvpdSelect.selectedIndex = -1;
  }
}

function clickEsmEnableMvpdHoverHint(clickState) {
  const mvpdSelect = clickState?.mvpdSelect;
  if (!mvpdSelect || mvpdSelect.__clickEsmHoverAttached) {
    return;
  }
  mvpdSelect.__clickEsmHoverAttached = true;

  let lastOption = null;
  const clearHover = () => {
    if (lastOption) {
      lastOption.classList.remove("click-esm-mvpd-hover");
    }
    lastOption = null;
  };
  const setHover = (option) => {
    if (!option || option === lastOption) {
      return;
    }
    if (lastOption) {
      lastOption.classList.remove("click-esm-mvpd-hover");
    }
    option.classList.add("click-esm-mvpd-hover");
    lastOption = option;
  };
  const resolveOptionFromEvent = (event) => {
    if (event?.target?.tagName === "OPTION") {
      return event.target;
    }

    const optionCount = Number(mvpdSelect.options?.length || 0);
    if (optionCount <= 0) {
      return null;
    }
    if (!mvpdSelect.multiple && Number(mvpdSelect.size || 0) <= 1) {
      return null;
    }

    const rect = mvpdSelect.getBoundingClientRect();
    const y = Number(event?.clientY || 0) - rect.top + mvpdSelect.scrollTop;
    const optionHeight = mvpdSelect.scrollHeight / optionCount;
    if (!Number.isFinite(optionHeight) || optionHeight < 12 || optionHeight > 60) {
      return null;
    }

    const optionIndex = Math.floor(y / optionHeight);
    if (optionIndex < 0 || optionIndex >= optionCount) {
      return null;
    }
    return mvpdSelect.options[optionIndex];
  };

  mvpdSelect.addEventListener("mousemove", (event) => {
    const option = resolveOptionFromEvent(event);
    if (option) {
      setHover(option);
    }
  });
  mvpdSelect.addEventListener("mouseleave", clearHover);
  mvpdSelect.addEventListener("blur", clearHover);
}

async function clickEsmApplyRequestorSelection(clickState, requestorIds, requestToken) {
  if (!clickState.mvpdSelect) {
    return;
  }
  const serviceLabel = clickState?.serviceType === "decompTree" ? "decomp" : "clickESM";

  if (!requestorIds.length) {
    clickEsmHideMvpdSelector(clickState);
    if (clickState?.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
    return;
  }

  const currentSelected = new Set(clickEsmGetSelectedValues(clickState.mvpdSelect));
  const desiredSelectedIds = currentSelected.size ? currentSelected : new Set(clickState.lastKnownSelectedMvpdIds);

  clickState.mvpdSelect.disabled = true;
  clickState.mvpdSelect.hidden = false;
  if (!clickState.mvpdSelect.options.length) {
    clickState.mvpdSelect.innerHTML = '<option value="">Loading MVPDs...</option>';
  }

  const settledMaps = await Promise.allSettled(
    requestorIds.map((requestorId) => clickEsmLoadMvpdMapForRequestor(requestorId))
  );
  if (!isEsmServiceRequestActive(clickState.section, requestToken, clickState.programmer?.programmerId)) {
    return;
  }

  const maps = settledMaps.filter((entry) => entry.status === "fulfilled").map((entry) => entry.value);
  const failures = settledMaps.filter((entry) => entry.status === "rejected").map((entry) => entry.reason);
  if (maps.length === 0) {
    clickState.mvpdSelect.innerHTML = '<option value="">-- MVPD config unavailable --</option>';
    clickState.mvpdSelect.disabled = true;
    if (failures.length > 0) {
      const firstFailure = failures[0];
      const reason = firstFailure instanceof Error ? firstFailure.message : String(firstFailure);
      setStatus(`REST V2 configuration failed for ${serviceLabel} MVPD list: ${reason}`, "error");
    }
    if (clickState?.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
    return;
  }
  if (failures.length > 0) {
    const firstFailure = failures[0];
    log(`${serviceLabel} MVPD merge fallback`, {
      failedRequests: failures.length,
      reason: firstFailure instanceof Error ? firstFailure.message : String(firstFailure),
    });
  }

  const mergedMap = new Map();
  maps.forEach((mvpdMap) => {
    mvpdMap.forEach((metadata, mvpdId) => {
      const normalized = {
        name: String(metadata?.name || mvpdId || "").trim() || mvpdId,
        isProxy: metadata?.isProxy === false ? false : true,
      };
      if (!mergedMap.has(mvpdId)) {
        mergedMap.set(mvpdId, normalized);
        return;
      }

      const existing = mergedMap.get(mvpdId) || {};
      mergedMap.set(mvpdId, {
        name: String(existing.name || normalized.name || mvpdId),
        isProxy: existing.isProxy === false || normalized.isProxy === false ? false : true,
      });
    });
  });

  if (mergedMap.size === 0) {
    clickState.mvpdSelect.innerHTML = '<option value="">-- No MVPDs available --</option>';
    clickState.mvpdSelect.disabled = true;
    if (clickState?.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
    return;
  }

  clickEsmApplyMvpdOptions(clickState, [...mergedMap.entries()], desiredSelectedIds);
  clickEsmRememberMvpdSelection(clickState);
  clickState.mvpdSelect.disabled = false;
  setStatus("", "info");
  if (clickState?.serviceType === "decompTree") {
    decompBroadcastControllerState(clickState);
  }
}

function clickEsmScheduleRequestorSelection(clickState, requestToken) {
  if (clickState.requestorApplyTimer) {
    clearTimeout(clickState.requestorApplyTimer);
    clickState.requestorApplyTimer = 0;
  }

  clickState.requestorApplyTimer = setTimeout(() => {
    clickState.requestorApplyTimer = 0;
    void clickEsmApplyRequestorSelection(clickState, clickState.pendingRequestorIds, requestToken);
  }, 350);
}

function clickEsmHandleRequestorChange(clickState, requestToken, options = {}) {
  clickState.pendingRequestorIds = clickEsmGetSelectedValues(clickState.requestorSelect);

  if (!clickState.pendingRequestorIds.length) {
    if (clickState.requestorApplyTimer) {
      clearTimeout(clickState.requestorApplyTimer);
      clickState.requestorApplyTimer = 0;
    }
    clickEsmHideMvpdSelector(clickState);
    return;
  }

  if (options.immediate) {
    void clickEsmApplyRequestorSelection(clickState, clickState.pendingRequestorIds, requestToken);
    return;
  }
  clickEsmScheduleRequestorSelection(clickState, requestToken);
}

function clickEsmResolveSharedRequestorIds(clickState) {
  const programmerRequestorIds = Array.isArray(clickState?.programmer?.requestorIds)
    ? clickState.programmer.requestorIds
    : [];
  const normalizedProgrammerIds = uniqueSorted(programmerRequestorIds.map((value) => String(value || "").trim()).filter(Boolean));
  if (normalizedProgrammerIds.length > 0) {
    return normalizedProgrammerIds;
  }
  return getRequestorsForSelectedMediaCompany();
}

function clickEsmApplySharedRequestorOptions(clickState, requestToken, options = {}) {
  if (!clickState.requestorSelect) {
    return;
  }

  const rawRequestorIds = Array.isArray(options.requestorIds)
    ? options.requestorIds
    : clickEsmResolveSharedRequestorIds(clickState);
  const requestorIds = uniqueSorted(rawRequestorIds.map((value) => String(value || "").trim()).filter(Boolean));
  const selectedTopRequestorId =
    options.selectedRequestorId !== undefined
      ? String(options.selectedRequestorId || "").trim()
      : String(state.selectedRequestorId || "").trim();
  const existingSelectedIds = new Set(clickEsmGetSelectedValues(clickState.requestorSelect));
  const desiredSelectedIds = selectedTopRequestorId
    ? new Set([selectedTopRequestorId])
    : existingSelectedIds;

  clickState.requestorSelect.innerHTML = "";
  if (requestorIds.length === 0) {
    const emptyLabel = String(options.emptyLabel || "No requestor-id values returned.");
    clickState.requestorSelect.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>`;
    clickState.requestorSelect.disabled = true;
    clickEsmHideMvpdSelector(clickState);
    return;
  }

  requestorIds.forEach((requestorId, index) => {
    const option = document.createElement("option");
    option.value = requestorId;
    option.textContent = requestorId;
    const isOdd = index % 2 === 1;
    option.classList.add(isOdd ? "click-esm-requestor-tone-b" : "click-esm-requestor-tone-a");
    // Inline fallback for environments that under-apply <option> class backgrounds.
    option.style.backgroundColor = isOdd ? "#f2f5f8" : "#f9fafb";
    if (desiredSelectedIds.has(requestorId)) {
      option.selected = true;
    }
    clickState.requestorSelect.appendChild(option);
  });

  if (![...clickState.requestorSelect.options].some((option) => option.selected)) {
    clickState.requestorSelect.selectedIndex = -1;
  }
  clickState.requestorSelect.disabled = false;
  clickEsmHandleRequestorChange(clickState, requestToken, { immediate: true });
}

function syncClickEsmRequestorMenus(requestorIds, selectedRequestorId = "", options = {}) {
  const normalizedRequestorIds = uniqueSorted(
    (Array.isArray(requestorIds) ? requestorIds : []).map((value) => String(value || "").trim()).filter(Boolean)
  );
  const targetSelection = String(selectedRequestorId || "").trim();
  const requestToken = Number(options.requestToken || state.premiumPanelRequestToken);
  const emptyLabel = String(options.emptyLabel || "No requestor-id values returned.");
  getInteractiveEsmStates().forEach((clickState) => {
    if (!clickState?.section?.isConnected || !clickState.requestorSelect) {
      return;
    }
    if (!isEsmServiceRequestActive(clickState.section, requestToken, clickState.programmer?.programmerId)) {
      return;
    }
    clickEsmApplySharedRequestorOptions(clickState, requestToken, {
      requestorIds: normalizedRequestorIds,
      selectedRequestorId: targetSelection,
      emptyLabel,
    });
    if (clickState.serviceType === "decompTree") {
      decompBroadcastControllerState(clickState);
    }
  });
}

function clickEsmBuildCsvFileName(clickState, endpointUrl) {
  let endpointPath = "endpoint";
  try {
    const parsed = new URL(endpointUrl);
    endpointPath = parsed.pathname.replace(/^\/+/, "").replace(/\//g, "-");
  } catch {
    endpointPath = "endpoint";
  }
  const selectedRequestorIds = clickEsmGetSelectedValues(clickState?.requestorSelect);
  const selectedMvpds = clickState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(clickState?.mvpdSelect);
  const requestorId = sanitizeHarFileSegment(selectedRequestorIds.join("-") || "all-requestors", "all-requestors");
  const mvpdId = sanitizeHarFileSegment(selectedMvpds.join("-") || "all-mvpds", "all-mvpds");
  const endpointSegment = sanitizeHarFileSegment(endpointPath, "endpoint");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `clickesm_${sanitizeHarFileSegment(clickState?.programmer?.programmerId, "programmer")}_${requestorId}_${mvpdId}_${endpointSegment}_${stamp}.csv`;
}

async function clickEsmDownloadCsv(clickState, endpoint, sortRule, requestToken) {
  const dataUrl = clickEsmBuildEndpointUrl(clickState, endpoint);
  const response = await clickEsmFetchWithPremiumAuth(
    clickState,
    dataUrl,
    { method: "GET" },
    CLICK_ESM_CSV_RESULT_LIMIT
  );
  if (!isEsmServiceRequestActive(clickState.section, requestToken, clickState.programmer?.programmerId)) {
    return;
  }
  if (!response.ok) {
    throw new Error(`CSV request failed (${response.status})`);
  }

  const payload = await response.json().catch(() => null);
  const rows = Array.isArray(payload?.report) ? payload.report : [];
  if (rows.length === 0) {
    return;
  }

  const firstRow = rows[0];
  const sortContext = {
    hasAuthN: firstRow["authn-attempts"] != null && firstRow["authn-successful"] != null,
    hasAuthZ: firstRow["authz-attempts"] != null && firstRow["authz-successful"] != null,
  };
  const fileName = clickEsmBuildCsvFileName(clickState, endpoint.url);
  downloadEsmCsv(rows, sortRule, sortContext, fileName);
}

function clickEsmRenderTableMessage(hostElement, message) {
  hostElement.innerHTML = `
    <div class="metadata-item">
      <p class="metadata-key">clickESM</p>
      <p class="metadata-value"><span class="null-value">${escapeHtml(message)}</span></p>
    </div>
  `;
}

function clickEsmRenderTable(clickState, endpoint, hostElement, reportRows, lastModified, requestToken) {
  if (!Array.isArray(reportRows) || reportRows.length === 0) {
    clickEsmRenderTableMessage(hostElement, "No data");
    return;
  }

  hostElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer click-esm-table-footer">
                <a href="#" class="esm-csv-link">CSV</a>
                <span class="esm-last-modified"></span>
                <button type="button" class="click-esm-close" title="Close table">x</button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  const table = hostElement.querySelector(".esm-table");
  const thead = table?.querySelector("thead");
  const tbody = table?.querySelector("tbody");
  if (!table || !thead || !tbody) {
    return;
  }

  const firstRow = reportRows[0];
  const hasAuthN = firstRow["authn-attempts"] != null && firstRow["authn-successful"] != null;
  const hasAuthZ = firstRow["authz-attempts"] != null && firstRow["authz-successful"] != null;
  const hasCount = firstRow.count != null;
  const displayColumns = Object.keys(firstRow).filter(
    (column) => !CLICK_ESM_METRIC_COLUMNS.has(column) && !ESM_DATE_PARTS.includes(column) && column !== "media-company"
  );

  const headers = ["DATE"];
  if (hasAuthN) {
    headers.push("AuthN Success");
  }
  if (hasAuthZ) {
    headers.push("AuthZ Success");
  }
  if (!hasAuthN && !hasAuthZ && hasCount) {
    headers.push("COUNT");
  }
  headers.push(...displayColumns);

  const tableState = {
    thead,
    tbody,
    data: reportRows,
    sortStack: getDefaultEsmSortStack(),
    hasAuthN,
    hasAuthZ,
    hasCount,
    displayColumns,
    context: {
      hasAuthN,
      hasAuthZ,
    },
  };

  const headerRow = thead.querySelector("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.style.cursor = "pointer";
    th.textContent = header;
    th.title = header === "DATE" ? `DATE (${CLIENT_TIMEZONE}, converted from PST)` : header;
    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.style.marginLeft = "6px";
    th.appendChild(icon);

    th._updateState = () => {
      const isActive = tableState.sortStack[0]?.col === header;
      th.classList.toggle("active-sort", isActive);
      icon.textContent = isActive ? (tableState.sortStack[0].dir === "ASC" ? "▲" : "▼") : "";
    };

    th.addEventListener("click", (event) => {
      const existingRule = tableState.sortStack.find((rule) => rule.col === header);
      if (event.shiftKey && existingRule) {
        existingRule.dir = existingRule.dir === "DESC" ? "ASC" : "DESC";
      } else if (event.shiftKey) {
        tableState.sortStack.push({ col: header, dir: "DESC" });
      } else {
        tableState.sortStack = [
          {
            col: header,
            dir: existingRule ? (existingRule.dir === "DESC" ? "ASC" : "DESC") : "DESC",
          },
        ];
      }

      tableState.data = sortEsmRows(tableState.data, tableState.sortStack, tableState.context);
      renderEsmTableBody(tableState);
      refreshEsmHeaderStates(tableState);
    });

    headerRow.appendChild(th);
  });

  const footerCell = hostElement.querySelector(".esm-footer-cell");
  if (footerCell) {
    footerCell.colSpan = Math.max(1, headers.length);
  }

  tableState.data = sortEsmRows(tableState.data, tableState.sortStack, tableState.context);
  renderEsmTableBody(tableState);
  refreshEsmHeaderStates(tableState);

  const csvLink = hostElement.querySelector(".esm-csv-link");
  if (csvLink) {
    csvLink.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await clickEsmDownloadCsv(clickState, endpoint, tableState.sortStack[0], requestToken);
      } catch (error) {
        setStatus(`clickESM CSV download failed: ${error instanceof Error ? error.message : String(error)}`, "error");
      }
    });
  }

  const closeButton = hostElement.querySelector(".click-esm-close");
  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      hostElement.innerHTML = "";
    });
  }

  const lastModifiedLabel = hostElement.querySelector(".esm-last-modified");
  if (lastModifiedLabel) {
    if (lastModified) {
      const sourceTz = getLastModifiedSourceTimezone(lastModified);
      lastModifiedLabel.textContent = `Last-Modified: ${formatLastModifiedForDisplay(lastModified)}`;
      lastModifiedLabel.title = sourceTz
        ? `Server time: ${sourceTz} (converted to your timezone)`
        : "Converted to your timezone";
    } else {
      lastModifiedLabel.textContent = "Last-Modified: (real-time)";
    }
  }
}

async function clickEsmRunEndpoint(clickState, endpointIndex, requestToken) {
  const endpoint = clickState.endpoints[endpointIndex];
  const hostElement = clickState.contentElement?.querySelector(`.click-esm-table-host[data-endpoint-index="${endpointIndex}"]`);
  if (!endpoint || !hostElement) {
    return;
  }

  hostElement.innerHTML = '<div class="loading">Loading ESM data...</div>';

  let response;
  try {
    const url = clickEsmBuildEndpointUrl(clickState, endpoint);
    clickEsmSetEndpointButtonUrl(clickState, endpointIndex, url);
    response = await clickEsmFetchWithPremiumAuth(
      clickState,
      url,
      {
        method: "GET",
      },
      CLICK_ESM_INLINE_RESULT_LIMIT
    );
  } catch (error) {
    if (isEsmServiceRequestActive(clickState.section, requestToken, clickState.programmer?.programmerId)) {
      clickEsmRenderTableMessage(hostElement, error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (!isEsmServiceRequestActive(clickState.section, requestToken, clickState.programmer?.programmerId)) {
    return;
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    clickEsmRenderTableMessage(
      hostElement,
      `HTTP ${response.status} ${normalizeHttpErrorMessage(bodyText) || response.statusText || "Request failed"}`
    );
    return;
  }

  const bodyText = await response.text().catch(() => "");
  let jsonPayload = null;
  if (bodyText) {
    try {
      jsonPayload = JSON.parse(bodyText);
    } catch {
      jsonPayload = null;
    }
  }
  if (!jsonPayload && bodyText.trim()) {
    clickEsmRenderTableMessage(hostElement, bodyText.trim());
    return;
  }
  const reportRows = Array.isArray(jsonPayload?.report) ? jsonPayload.report : [];
  clickEsmRenderTable(clickState, endpoint, hostElement, reportRows, response.headers.get("Last-Modified"), requestToken);
}

function wireClickEsmInteractions(clickState, requestToken) {
  const { contentElement } = clickState;
  if (!contentElement) {
    return;
  }

  contentElement.querySelectorAll(".click-esm-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const endpointIndex = Number(button.getAttribute("data-endpoint-index"));
      void clickEsmRunEndpoint(clickState, endpointIndex, requestToken);
    });
  });

  if (clickState.findButton) {
    clickState.findButton.addEventListener("click", () => {
      clickState.searchInput.value = clickEsmNormalizeSearchTerm(clickState.searchInput.value);
      clickEsmApplyEndpointFilters(clickState, { highlight: true });
    });
  }

  if (clickState.resetButton) {
    clickState.resetButton.addEventListener("click", () => {
      if (clickState.searchInput) {
        clickState.searchInput.value = "";
      }
      if (clickState.zoomFilterSelect) {
        clickState.zoomFilterSelect.value = "";
      }
      clickEsmApplyEndpointFilters(clickState, { highlight: false });
    });
  }

  if (clickState.zoomFilterSelect) {
    clickState.zoomFilterSelect.addEventListener("change", () => {
      const term = clickEsmNormalizeSearchTerm(clickState.searchInput?.value || "");
      clickEsmApplyEndpointFilters(clickState, { highlight: Boolean(term) });
    });
  }

  if (clickState.searchInput) {
    clickState.searchInput.addEventListener("input", () => {
      const term = clickEsmNormalizeSearchTerm(clickState.searchInput.value);
      clickEsmApplyEndpointFilters(clickState, { highlight: Boolean(term) });
    });

    clickState.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        clickState.searchInput.value = clickEsmNormalizeSearchTerm(clickState.searchInput.value);
        clickEsmApplyEndpointFilters(clickState, { highlight: true });
      }
    });
  }

  if (clickState.requestorSelect) {
    clickState.requestorSelect.addEventListener("change", () => {
      clickEsmHandleRequestorChange(clickState, requestToken);
      clickEsmRefreshEndpointUrls(clickState);
    });
  }

  if (clickState.mvpdSelect) {
    clickEsmEnableMvpdHoverHint(clickState);
    clickState.mvpdSelect.addEventListener("change", () => {
      clickEsmRememberMvpdSelection(clickState);
      clickEsmRefreshEndpointUrls(clickState);
    });
  }
}

async function loadClickEsmService(programmer, appInfo, section, contentElement, refreshButton, requestToken) {
  if (!contentElement) {
    return;
  }
  if (!programmer?.programmerId || !appInfo?.guid) {
    contentElement.innerHTML = '<div class="service-error">Missing media company or ESM application details.</div>';
    return;
  }

  const existingClickState = section?.__underparClickEsmState;
  if (existingClickState?.requestorApplyTimer) {
    clearTimeout(existingClickState.requestorApplyTimer);
  }
  section.__underparClickEsmState = null;

  if (refreshButton) {
    refreshButton.disabled = true;
  }
  contentElement.innerHTML = '<div class="loading">Loading clickESM...</div>';

  try {
    const endpoints = await loadClickEsmEndpoints();
    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      contentElement.innerHTML = '<div class="service-error">No clickESM endpoints were found.</div>';
      return;
    }

    contentElement.innerHTML = clickEsmBuildShellHtml(endpoints);
    const clickState = {
      serviceType: "clickEsm",
      section,
      contentElement,
      programmer,
      appInfo,
      endpoints,
      netInFlight: 0,
      requestorApplyTimer: 0,
      pendingRequestorIds: [],
      lastKnownSelectedMvpdIds: new Set(),
      zoomFilterSelect: contentElement.querySelector(".click-esm-zoom-filter"),
      searchInput: contentElement.querySelector(".click-esm-search"),
      findButton: contentElement.querySelector(".click-esm-find-btn"),
      resetButton: contentElement.querySelector(".click-esm-reset-btn"),
      requestorSelect: contentElement.querySelector(".click-esm-requestor-select"),
      mvpdSelect: contentElement.querySelector(".click-esm-mvpd-select"),
    };

    section.__underparClickEsmState = clickState;
    wireClickEsmInteractions(clickState, requestToken);
    clickEsmApplyEndpointFilters(clickState, { highlight: false });
    clickEsmApplySharedRequestorOptions(clickState, requestToken, {
      selectedRequestorId: state.selectedRequestorId,
      emptyLabel: "-- Select a Media Company first --",
    });
    clickEsmRefreshEndpointUrls(clickState);

    if (clickState.mvpdSelect && state.selectedMvpdId) {
      [...clickState.mvpdSelect.options].forEach((option) => {
        if (option.value === state.selectedMvpdId) {
          option.selected = true;
        }
      });
      clickEsmRememberMvpdSelection(clickState);
      clickEsmRefreshEndpointUrls(clickState);
    }
  } catch (error) {
    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    contentElement.innerHTML = `<div class="service-error">${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</div>`;
  } finally {
    if (refreshButton && isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      refreshButton.disabled = false;
    }
  }
}

const DECOMP_SEGMENT_COLORS = {
  "media-company": "#222222",
  year: "#2D8CFF",
  month: "#28C76F",
  day: "#EA5455",
  hour: "#FF9F43",
  minute: "#A97142",
  "requestor-id": "#D4A106",
  proxy: "#8B5E34",
  mvpd: "#00B8D9",
  platform: "#6C7A89",
  "platform-version": "#95A5A6",
  dc: "#E67E22",
  channel: "#1ABC9C",
  "customer-app": "#2E86DE",
  "application-name": "#9B59B6",
  "application-version": "#AF7AC5",
  nsdk: "#27AE60",
  "nsdk-version": "#2ECC71",
  "sso-type": "#F1C40F",
  cdt: "#D35400",
  eap: "#34495E",
  "content-category": "#16A085",
  "os-family": "#2980B9",
  "browser-family": "#5DADE2",
  "browser-version": "#85C1E9",
  device: "#7F8C8D",
  reason: "#C0392B",
  "decision-type": "#7D3C98",
  api: "#6C3483",
  event: "#E84393",
};

function decompHexToRgb(hexValue) {
  const match = String(hexValue || "")
    .trim()
    .match(/^#?([0-9a-f]{6})$/i);
  if (!match) {
    return null;
  }
  const parsed = Number.parseInt(match[1], 16);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return {
    red: (parsed >> 16) & 255,
    green: (parsed >> 8) & 255,
    blue: parsed & 255,
  };
}

function decompGetSegmentColor(segment) {
  const key = String(segment || "").trim().toLowerCase();
  return DECOMP_SEGMENT_COLORS[key] || "#6A6A6A";
}

function decompApplyChipColor(chipElement, segment) {
  if (!chipElement) {
    return;
  }
  const rgb = decompHexToRgb(decompGetSegmentColor(segment));
  if (!rgb) {
    return;
  }
  chipElement.style.color = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  chipElement.style.backgroundColor = `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.14)`;
  chipElement.style.borderColor = `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.35)`;
}

function decompCompareSegments(left, right) {
  const rank = {
    "media-company": 0,
    year: 1,
    month: 2,
    day: 3,
    hour: 4,
    minute: 5,
  };
  const leftKey = String(left || "").toLowerCase();
  const rightKey = String(right || "").toLowerCase();
  const leftRank = Object.prototype.hasOwnProperty.call(rank, leftKey) ? rank[leftKey] : 99;
  const rightRank = Object.prototype.hasOwnProperty.call(rank, rightKey) ? rank[rightKey] : 99;
  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }
  return leftKey.localeCompare(rightKey, undefined, { sensitivity: "base" });
}

function decompExtractSegments(endpointUrl) {
  try {
    const parsed = new URL(endpointUrl);
    const marker = "/esm/v3/";
    let pathname = String(parsed.pathname || "");
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex >= 0) {
      pathname = pathname.slice(markerIndex + marker.length);
    }
    return pathname
      .split("/")
      .map((segment) => String(segment || "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function decompBuildCatalog(endpoints) {
  return (Array.isArray(endpoints) ? endpoints : [])
    .map((endpoint) => {
      if (!endpoint || typeof endpoint !== "object") {
        return null;
      }
      const url = String(endpoint.url || "").trim();
      if (!url) {
        return null;
      }
      const segs = decompExtractSegments(url);
      const columns = Array.isArray(endpoint.columns)
        ? endpoint.columns.map((value) => String(value || "").trim()).filter(Boolean)
        : [];
      const zoomKey = clickEsmGetZoomKey(endpoint);
      return {
        url,
        zoomKey,
        columns,
        segs,
        hay: `${segs.join(" ")} ${columns.join(" ")}`
          .toLowerCase()
          .replace(/\s+/g, ""),
      };
    })
    .filter(Boolean);
}

function decompBuildTrie(catalog) {
  const root = { key: "", endpointIndex: null, children: new Map() };
  catalog.forEach((item, index) => {
    let node = root;
    item.segs.forEach((segment) => {
      if (!node.children.has(segment)) {
        node.children.set(segment, { key: segment, endpointIndex: null, children: new Map() });
      }
      node = node.children.get(segment);
    });
    node.endpointIndex = index;
  });
  return root;
}

function decompCompressTrie(node) {
  let cursor = node;
  const parts = [];
  if (cursor.key) {
    parts.push(cursor.key);
  }

  while (cursor.children.size === 1 && cursor.endpointIndex == null) {
    const onlyChild = cursor.children.values().next().value;
    parts.push(onlyChild.key);
    cursor = onlyChild;
  }

  const output = {
    parts,
    endpointIndex: cursor.endpointIndex,
    children: [],
    count: 0,
  };

  const children = [...cursor.children.values()].sort((left, right) => decompCompareSegments(left.key, right.key));
  output.children = children.map((child) => decompCompressTrie(child));
  return output;
}

function decompCountEndpoints(node) {
  let count = node.endpointIndex != null ? 1 : 0;
  node.children.forEach((child) => {
    count += decompCountEndpoints(child);
  });
  node.count = count;
  return count;
}

function decompGetWorkspaceUrl() {
  return chrome.runtime.getURL(DECOMP_WORKSPACE_PATH);
}

function decompIsWorkspaceTab(tabLike) {
  return String(tabLike?.url || "").startsWith(decompGetWorkspaceUrl());
}

async function decompGetCurrentWindowId() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    return Number(currentWindow?.id || 0);
  } catch {
    return 0;
  }
}

function decompBindWorkspaceTab(windowId, tabId) {
  const normalizedWindowId = Number(windowId || 0);
  const normalizedTabId = Number(tabId || 0);
  if (normalizedWindowId > 0 && normalizedTabId > 0) {
    state.decompWorkspaceTabIdByWindowId.set(normalizedWindowId, normalizedTabId);
  }
  if (normalizedWindowId > 0) {
    state.decompWorkspaceWindowId = normalizedWindowId;
  }
  if (normalizedTabId > 0) {
    state.decompWorkspaceTabId = normalizedTabId;
  }
}

function decompUnbindWorkspaceTab(tabId) {
  const normalizedTabId = Number(tabId || 0);
  if (normalizedTabId > 0) {
    for (const [windowId, mappedTabId] of state.decompWorkspaceTabIdByWindowId.entries()) {
      if (Number(mappedTabId || 0) === normalizedTabId) {
        state.decompWorkspaceTabIdByWindowId.delete(windowId);
      }
    }
  }

  if (!normalizedTabId || Number(state.decompWorkspaceTabId || 0) === normalizedTabId) {
    state.decompWorkspaceTabId = 0;
    state.decompWorkspaceWindowId = 0;
  }
}

function decompGetBoundWorkspaceTabId(windowId) {
  const normalizedWindowId = Number(windowId || 0);
  if (normalizedWindowId > 0) {
    const mapped = Number(state.decompWorkspaceTabIdByWindowId.get(normalizedWindowId) || 0);
    if (mapped > 0) {
      return mapped;
    }
  }
  return Number(state.decompWorkspaceTabId || 0);
}

function decompGetControllerStatePayload(decompState) {
  const requestorIds = clickEsmGetSelectedValues(decompState?.requestorSelect);
  const mvpdIds = decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState?.mvpdSelect);
  return {
    controllerOnline: Boolean(decompState?.section?.isConnected),
    programmerId: String(decompState?.programmer?.programmerId || ""),
    programmerName: String(decompState?.programmer?.programmerName || ""),
    requestorIds,
    mvpdIds,
    updatedAt: Date.now(),
  };
}

async function decompSendWorkspaceMessage(event, payload = {}, options = {}) {
  const targetWindowId = Number(options.targetWindowId || 0);
  try {
    const message = {
      type: DECOMP_MESSAGE_TYPE,
      channel: "workspace-event",
      event: String(event || ""),
      payload,
    };
    if (targetWindowId > 0) {
      message.targetWindowId = targetWindowId;
    }
    await chrome.runtime.sendMessage(message);
  } catch {
    // Ignore when no workspace listener is active.
  }
}

function decompBroadcastControllerState(decompState, targetWindowId = 0) {
  if (!decompState) {
    return;
  }
  const resolvedWindowId =
    Number(targetWindowId || 0) || Number(decompState.controllerWindowId || 0) || Number(state.decompWorkspaceWindowId || 0);
  void decompSendWorkspaceMessage("controller-state", decompGetControllerStatePayload(decompState), {
    targetWindowId: resolvedWindowId,
  });
}

async function decompEnsureWorkspaceTab(options = {}) {
  const shouldActivate = options.activate !== false;
  const requestedWindowId = Number(options.windowId || 0);
  const targetWindowId = requestedWindowId > 0 ? requestedWindowId : await decompGetCurrentWindowId();
  const useWindowFilter = targetWindowId > 0;
  let workspaceTab = null;

  const boundTabId = decompGetBoundWorkspaceTabId(targetWindowId);
  if (boundTabId > 0) {
    try {
      const existing = await chrome.tabs.get(boundTabId);
      if (decompIsWorkspaceTab(existing) && (!useWindowFilter || Number(existing.windowId || 0) === targetWindowId)) {
        workspaceTab = existing;
      }
    } catch {
      decompUnbindWorkspaceTab(boundTabId);
      workspaceTab = null;
    }
  }

  if (!workspaceTab) {
    try {
      const allTabs = await chrome.tabs.query(useWindowFilter ? { windowId: targetWindowId } : { currentWindow: true });
      workspaceTab = allTabs.find((tab) => decompIsWorkspaceTab(tab)) || null;
    } catch {
      workspaceTab = null;
    }
  }

  if (!workspaceTab) {
    workspaceTab = await chrome.tabs.create({
      url: decompGetWorkspaceUrl(),
      active: shouldActivate,
      ...(useWindowFilter ? { windowId: targetWindowId } : {}),
    });
  } else if (shouldActivate && workspaceTab.id) {
    try {
      workspaceTab = await chrome.tabs.update(workspaceTab.id, { active: true });
      if (Number(workspaceTab?.windowId || 0) > 0) {
        await chrome.windows.update(Number(workspaceTab.windowId), { focused: true });
      }
    } catch {
      // Ignore activation failures; workspace may still be available.
    }
  }

  decompBindWorkspaceTab(workspaceTab?.windowId, workspaceTab?.id);
  return workspaceTab;
}

function getDecompRecordingSelections(decompState) {
  const requestorIds = clickEsmGetSelectedValues(decompState?.requestorSelect);
  const mvpdIds = decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState?.mvpdSelect);
  return { requestorIds, mvpdIds };
}

function toDecompRecordingContext(decompState) {
  const selections = getDecompRecordingSelections(decompState);
  return {
    serviceType: "esm-decomp",
    programmerId: String(decompState?.programmer?.programmerId || ""),
    programmerName: String(decompState?.programmer?.programmerName || ""),
    requestorIds: selections.requestorIds.slice(0, 24),
    mvpdIds: selections.mvpdIds.slice(0, 24),
    requestorId: String(selections.requestorIds[0] || ""),
    mvpd: String(selections.mvpdIds[0] || ""),
    appInfo: decompState?.appInfo
      ? {
          guid: String(decompState.appInfo.guid || ""),
          appName: String(decompState.appInfo.appName || decompState.appInfo.guid || ""),
          scopes: Array.isArray(decompState.appInfo.scopes) ? decompState.appInfo.scopes.slice(0, 12) : [],
        }
      : null,
    startedAt: Date.now(),
  };
}

function getActiveDecompDebugFlowId() {
  if (!state.decompRecordingActive) {
    return "";
  }
  return String(state.decompDebugFlowId || "").trim();
}

function emitDecompDebugEvent(flowId, event = {}) {
  const normalizedFlowId = String(flowId || "").trim();
  if (!normalizedFlowId) {
    return;
  }

  emitRestV2DebugEvent(normalizedFlowId, {
    source: "extension",
    service: "esm-decomp",
    ...event,
  });
}

function setDecompRecordingStatus(decompState, message = "", type = "info") {
  if (!decompState?.recordingStatusElement) {
    return;
  }

  decompState.recordingStatusElement.textContent = String(message || "").trim();
  decompState.recordingStatusElement.classList.remove("success", "error");
  if (type === "success") {
    decompState.recordingStatusElement.classList.add("success");
  } else if (type === "error") {
    decompState.recordingStatusElement.classList.add("error");
  }
}

function syncDecompRecordingControls(decompState) {
  if (!decompState) {
    return;
  }

  const startButton = decompState.startRecordingButton;
  const stopButton = decompState.stopRecordingButton;
  const context = toDecompRecordingContext(decompState);
  const hasProgrammer = Boolean(context.programmerId);

  if (!startButton || !stopButton) {
    return;
  }

  if (state.decompStopping) {
    startButton.disabled = true;
    stopButton.hidden = false;
    stopButton.disabled = true;
    setDecompRecordingStatus(decompState, "Finalizing ESM recording...");
    return;
  }

  const activeFlowId = getActiveDecompDebugFlowId();
  if (activeFlowId) {
    startButton.disabled = true;
    stopButton.hidden = false;
    stopButton.disabled = false;

    const requestorLabel = context.requestorIds.length > 0 ? context.requestorIds.join(", ") : "all requestors";
    const mvpdLabel = context.mvpdIds.length > 0 ? context.mvpdIds.join(", ") : "all MVPDs";
    setDecompRecordingStatus(
      decompState,
      `Recording ESM flow for ${requestorLabel} / ${mvpdLabel}. Click STOP to end capture.`,
      "success"
    );
    return;
  }

  startButton.disabled = !hasProgrammer;
  stopButton.hidden = true;
  stopButton.disabled = true;

  if (!hasProgrammer) {
    setDecompRecordingStatus(decompState, "Select a Media Company first.");
    return;
  }

  setDecompRecordingStatus(
    decompState,
    "Click START RECORDING to capture token + decomp ESM API activity in the UP trace."
  );
}

function buildDecompHarFilename(recordingContext = null) {
  const programmer = sanitizeHarFileSegment(recordingContext?.programmerId || "programmer", "programmer");
  const requestors = sanitizeHarFileSegment(
    Array.isArray(recordingContext?.requestorIds) && recordingContext.requestorIds.length > 0
      ? recordingContext.requestorIds.join("-")
      : "all-requestors",
    "all-requestors"
  );
  const mvpds = sanitizeHarFileSegment(
    Array.isArray(recordingContext?.mvpdIds) && recordingContext.mvpdIds.length > 0
      ? recordingContext.mvpdIds.join("-")
      : "all-mvpds",
    "all-mvpds"
  );
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `underpar-esm-decomp-${programmer}-${requestors}-${mvpds}-${stamp}.har`;
}

function clearDecompRecordingState(reason = "state-reset", options = {}) {
  const shouldStopFlow = options?.stopFlow !== false;
  const activeFlowId = String(state.decompDebugFlowId || "").trim();
  if (activeFlowId && shouldStopFlow) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "recording-force-stop",
      reason: String(reason || "state-reset"),
    });
    void stopRestV2DebugFlowAndSnapshot(activeFlowId, String(reason || "state-reset"));
  }

  state.decompDebugFlowId = "";
  state.decompRecordingActive = false;
  state.decompRecordingStartedAt = 0;
  state.decompRecordingContext = null;
  state.decompStopping = false;
  state.decompTraceViewerWindowId = 0;
  state.decompTraceViewerTabId = 0;
}

async function startDecompEsmRecording(decompState, requestToken) {
  if (!decompState) {
    return;
  }
  if (state.decompStopping) {
    return;
  }
  if (state.decompRecordingActive && state.decompDebugFlowId) {
    syncDecompRecordingControls(decompState);
    return;
  }
  if (!isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
    setDecompRecordingStatus(decompState, "decomp view is stale. Refresh this panel first.", "error");
    return;
  }

  const recordingContext = toDecompRecordingContext(decompState);
  if (!recordingContext.programmerId || !recordingContext.appInfo?.guid) {
    setDecompRecordingStatus(decompState, "Missing decomp app context for recording.", "error");
    return;
  }

  state.decompStopping = true;
  syncDecompRecordingControls(decompState);

  try {
    const workspaceTab = await decompEnsureWorkspaceTab({
      activate: true,
      windowId: Number(decompState.controllerWindowId || 0),
    });
    const workspaceTabId = Number(workspaceTab?.id || decompGetBoundWorkspaceTabId(decompState.controllerWindowId));
    if (!Number.isFinite(workspaceTabId) || workspaceTabId <= 0) {
      throw new Error("Unable to open decomp workspace tab.");
    }

    const flowId = await startRestV2DebugFlow(
      {
        serviceType: "esm-decomp",
        programmerId: recordingContext.programmerId,
        programmerName: recordingContext.programmerName,
        requestorId: recordingContext.requestorId,
        mvpd: recordingContext.mvpd,
        requestorIds: recordingContext.requestorIds,
        mvpdIds: recordingContext.mvpdIds,
      },
      "start-esm-recording"
    );
    if (!flowId) {
      throw new Error("Unable to start UP ESM recording flow.");
    }

    state.decompDebugFlowId = flowId;
    state.decompRecordingActive = true;
    state.decompRecordingStartedAt = Date.now();
    state.decompRecordingContext = recordingContext;

    emitDecompDebugEvent(flowId, {
      phase: "recording-start",
      workspaceTabId,
      programmerId: recordingContext.programmerId,
      requestorIds: recordingContext.requestorIds,
      mvpdIds: recordingContext.mvpdIds,
    });

    const bound = await bindRestV2DebugFlowToTab(flowId, workspaceTabId, {
      requestorId: recordingContext.requestorId,
      mvpd: recordingContext.mvpd,
      serviceType: "esm-decomp",
    });
    if (!bound) {
      emitDecompDebugEvent(flowId, {
        phase: "workspace-bind-failed",
        workspaceTabId,
      });
    }

    const traceViewerResult = await openOrFocusDecompTraceViewer(workspaceTabId, flowId);
    if (traceViewerResult.ok) {
      emitDecompDebugEvent(flowId, {
        phase: "trace-view-opened",
        traceTabId: traceViewerResult.tabId || 0,
        traceWindowId: traceViewerResult.windowId || 0,
        traceMode: traceViewerResult.mode || (traceViewerResult.reused ? "reuse" : "unknown"),
      });
    } else {
      emitDecompDebugEvent(flowId, {
        phase: "trace-view-open-failed",
        error: traceViewerResult.error || "Unable to open UP trace viewer.",
      });
    }

    try {
      await ensureDcrAccessToken(recordingContext.programmerId, decompState.appInfo, true, {
        flowId,
        scope: "esm-access-token",
        requestorId: recordingContext.requestorId,
        mvpd: recordingContext.mvpd,
        service: "esm-decomp",
      });
      emitDecompDebugEvent(flowId, {
        phase: "access-token-ready",
        appGuid: recordingContext.appInfo.guid,
      });
    } catch (error) {
      emitDecompDebugEvent(flowId, {
        phase: "access-token-prime-failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    state.decompStopping = false;
    syncDecompRecordingControls(decompState);
    setDecompRecordingStatus(
      decompState,
      "ESM recording started. Run reports / CSV actions and watch events live in the UP tab.",
      "success"
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    emitDecompDebugEvent(state.decompDebugFlowId, {
      phase: "recording-start-failed",
      error: reason,
    });
    clearDecompRecordingState("start-failed");
    state.decompStopping = false;
    syncDecompRecordingControls(decompState);
    setDecompRecordingStatus(decompState, reason, "error");
  }
}

async function stopDecompEsmRecording(decompState) {
  if (state.decompStopping) {
    return;
  }

  const activeFlowId = String(state.decompDebugFlowId || "").trim();
  if (!activeFlowId) {
    clearDecompRecordingState("stop-empty");
    syncDecompRecordingControls(decompState);
    setDecompRecordingStatus(decompState, "No active ESM recording session was found.");
    return;
  }

  state.decompStopping = true;
  syncDecompRecordingControls(decompState);

  const recordingContext =
    state.decompRecordingContext && typeof state.decompRecordingContext === "object"
      ? state.decompRecordingContext
      : toDecompRecordingContext(decompState);

  emitDecompDebugEvent(activeFlowId, {
    phase: "recording-stop-request",
    requestorIds: recordingContext?.requestorIds || [],
    mvpdIds: recordingContext?.mvpdIds || [],
  });

  try {
    await waitForDelay(400);
    const stopResult = await stopRestV2DebugFlowAndSnapshot(activeFlowId, "esm-user-stop");
    clearDecompRecordingState("stop-complete", { stopFlow: false });
    state.decompStopping = false;
    syncDecompRecordingControls(decompState);

    if (stopResult?.flow) {
      const harPayload = buildHarLogFromFlowSnapshot(stopResult.flow, recordingContext, null);
      const fileName = buildDecompHarFilename(recordingContext);
      downloadHarFile(harPayload, fileName);
      setDecompRecordingStatus(
        decompState,
        `ESM recording stopped. HAR downloaded as ${fileName}.`,
        "success"
      );
      return;
    }

    setDecompRecordingStatus(
      decompState,
      `Recording stopped, but snapshot export failed: ${stopResult?.error || "unknown error"}.`,
      "error"
    );
  } catch (error) {
    clearDecompRecordingState("stop-failed");
    state.decompStopping = false;
    syncDecompRecordingControls(decompState);
    setDecompRecordingStatus(
      decompState,
      error instanceof Error ? error.message : String(error),
      "error"
    );
  }
}

function decompSetNetworkBusy(decompState, isBusy) {
  if (!decompState?.contentElement) {
    return;
  }
  const shell = decompState.contentElement.querySelector(".decomp-shell");
  const indicator = decompState.contentElement.querySelector(".decomp-net-indicator");
  if (shell) {
    shell.classList.toggle("net-busy", Boolean(isBusy));
  }
  if (indicator) {
    indicator.hidden = !isBusy;
  }
}

function decompStartNetwork(decompState) {
  if (!decompState) {
    return;
  }
  decompState.netInFlight = Number(decompState.netInFlight || 0) + 1;
  if (decompState.netInFlight === 1) {
    decompSetNetworkBusy(decompState, true);
  }
}

function decompEndNetwork(decompState) {
  if (!decompState) {
    return;
  }
  decompState.netInFlight = Math.max(0, Number(decompState.netInFlight || 0) - 1);
  if (decompState.netInFlight === 0) {
    decompSetNetworkBusy(decompState, false);
  }
}

function decompBuildEndpointUrl(decompState, endpoint) {
  const zoomKey = clickEsmGetZoomKey(endpoint);
  const timeWindow = clickEsmComputeTimeWindow(zoomKey);
  const requestorIds = clickEsmGetSelectedValues(decompState?.requestorSelect);
  const mvpdIds = decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState?.mvpdSelect);

  const parsed = new URL(endpoint.url);
  parsed.searchParams.set("start", timeWindow.start);
  parsed.searchParams.set("end", timeWindow.end);
  parsed.searchParams.set("format", "json");
  parsed.searchParams.delete("requestor-id");
  parsed.searchParams.delete("mvpd");
  requestorIds.forEach((requestorId) => {
    parsed.searchParams.append("requestor-id", requestorId);
  });
  mvpdIds.forEach((mvpdId) => {
    parsed.searchParams.append("mvpd", mvpdId);
  });
  return parsed.toString();
}

function decompBuildRequestMetadata(decompState) {
  const requestorIds = clickEsmGetSelectedValues(decompState?.requestorSelect);
  const mvpds = decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState?.mvpdSelect);
  return {
    requestorIds,
    mvpdIds: mvpds,
    requestorId: requestorIds[0] || "",
    mvpd: mvpds[0] || "",
  };
}

async function decompFetchWithPremiumAuth(decompState, url, options = {}, limit = DECOMP_CSV_RESULT_LIMIT, debugMeta = {}) {
  const finalUrl = clickEsmEnsureLimit(url, limit);
  const requestMeta = decompBuildRequestMetadata(decompState);
  const activeFlowId = getActiveDecompDebugFlowId();
  const requestScope = String(debugMeta?.scope || "esm-decomp").trim() || "esm-decomp";
  decompStartNetwork(decompState);
  try {
    return await fetchWithPremiumAuth(
      decompState.programmer?.programmerId,
      decompState.appInfo,
      finalUrl,
      options,
      "refresh",
      {
        flowId: activeFlowId,
        requestorId: requestMeta.requestorId,
        mvpd: requestMeta.mvpd,
        requestorIds: requestMeta.requestorIds,
        mvpdIds: requestMeta.mvpdIds,
        service: "esm-decomp",
        endpointUrl: String(debugMeta?.endpointUrl || ""),
        cardId: String(debugMeta?.cardId || ""),
        scope: requestScope,
      }
    );
  } finally {
    decompEndNetwork(decompState);
  }
}

function decompNormalizeSortRule(rule) {
  if (!rule || typeof rule !== "object") {
    return null;
  }
  const col = String(rule.col || "").trim();
  if (!col) {
    return null;
  }
  const dir = String(rule.dir || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
  return { col, dir };
}

function decompBuildCsvFileName(decompState, endpointUrl) {
  let endpointPath = "endpoint";
  try {
    const parsed = new URL(endpointUrl);
    endpointPath = parsed.pathname.replace(/^\/+/, "").replace(/\//g, "-");
  } catch {
    endpointPath = "endpoint";
  }

  const selectedRequestorIds = clickEsmGetSelectedValues(decompState?.requestorSelect);
  const selectedMvpds = decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState?.mvpdSelect);
  const requestorId = sanitizeHarFileSegment(selectedRequestorIds.join("-") || "all-requestors", "all-requestors");
  const mvpdId = sanitizeHarFileSegment(selectedMvpds.join("-") || "all-mvpds", "all-mvpds");
  const endpointSegment = sanitizeHarFileSegment(endpointPath, "endpoint");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `decomp_${sanitizeHarFileSegment(decompState?.programmer?.programmerId, "programmer")}_${requestorId}_${mvpdId}_${endpointSegment}_${stamp}.csv`;
}

function decompFindEndpointByUrl(decompState, endpointUrl, fallback = {}) {
  const normalizedUrl = String(endpointUrl || "").trim();
  if (!normalizedUrl) {
    return null;
  }
  const mappedEndpoint = decompState?.endpointByUrl?.get(normalizedUrl) || null;
  if (mappedEndpoint) {
    return mappedEndpoint;
  }
  return {
    url: normalizedUrl,
    zoomKey: String(fallback.zoomKey || clickEsmGetZoomKey({ url: normalizedUrl }) || ""),
    columns: Array.isArray(fallback.columns)
      ? fallback.columns.map((value) => String(value || "").trim()).filter(Boolean)
      : [],
  };
}

async function decompDownloadCsvForCard(decompState, endpoint, sortRule, requestToken, cardId = "") {
  const targetWindowId = Number(decompState?.controllerWindowId || state.decompWorkspaceWindowId || 0);
  const normalizedSort = decompNormalizeSortRule(sortRule);
  const dataUrl = decompBuildEndpointUrl(decompState, endpoint);
  const activeFlowId = getActiveDecompDebugFlowId();
  emitDecompDebugEvent(activeFlowId, {
    phase: "csv-download-start",
    endpointUrl: String(endpoint?.url || ""),
    cardId: String(cardId || ""),
    requestUrl: dataUrl,
  });
  let response;
  try {
    response = await decompFetchWithPremiumAuth(
      decompState,
      dataUrl,
      { method: "GET" },
      DECOMP_CSV_RESULT_LIMIT,
      {
        scope: "esm-decomp-csv",
        endpointUrl: endpoint?.url || "",
        cardId: String(cardId || ""),
      }
    );
  } catch (error) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "csv-download-error",
      endpointUrl: String(endpoint?.url || ""),
      cardId: String(cardId || ""),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
  if (!isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
    return;
  }
  if (!response.ok) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "csv-download-failed",
      endpointUrl: String(endpoint?.url || ""),
      cardId: String(cardId || ""),
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
    });
    throw new Error(`CSV request failed (${response.status})`);
  }

  const payload = await response.json().catch(() => null);
  const rows = Array.isArray(payload?.report) ? payload.report : [];
  if (rows.length === 0) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "csv-download-no-data",
      endpointUrl: String(endpoint?.url || ""),
      cardId: String(cardId || ""),
    });
    return;
  }

  const firstRow = rows[0];
  const context = {
    hasAuthN: firstRow["authn-attempts"] != null && firstRow["authn-successful"] != null,
    hasAuthZ: firstRow["authz-attempts"] != null && firstRow["authz-successful"] != null,
  };

  downloadEsmCsv(rows, normalizedSort || getDefaultEsmSortStack()[0], context, decompBuildCsvFileName(decompState, endpoint.url));
  emitDecompDebugEvent(activeFlowId, {
    phase: "csv-download-complete",
    endpointUrl: String(endpoint?.url || ""),
    cardId: String(cardId || ""),
    rowCount: rows.length,
  });
  if (cardId) {
    void decompSendWorkspaceMessage("csv-complete", {
      cardId: String(cardId),
      endpointUrl: endpoint.url,
      completedAt: Date.now(),
    }, {
      targetWindowId,
    });
  }
}

async function decompRunEndpointToWorkspace(decompState, endpoint, cardId, requestToken, options = {}) {
  if (!endpoint?.url) {
    return;
  }
  const normalizedCardId = String(cardId || generateRequestId());
  const requestUrl = clickEsmEnsureLimit(decompBuildEndpointUrl(decompState, endpoint), DECOMP_INLINE_RESULT_LIMIT);
  const activeFlowId = getActiveDecompDebugFlowId();
  const reportMeta = {
    cardId: normalizedCardId,
    endpointUrl: endpoint.url,
    requestUrl,
    zoomKey: clickEsmGetZoomKey(endpoint),
    columns: Array.isArray(endpoint.columns)
      ? endpoint.columns.map((value) => String(value || "").trim()).filter(Boolean)
      : [],
  };
  const targetWindowId = Number(decompState?.controllerWindowId || state.decompWorkspaceWindowId || 0);

  if (options.emitStart !== false) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "report-start",
      cardId: normalizedCardId,
      endpointUrl: endpoint.url,
      requestUrl,
      requestSource: String(options.requestSource || "tree"),
    });
    void decompSendWorkspaceMessage("report-start", {
      ...reportMeta,
      requestSource: String(options.requestSource || "tree"),
      startedAt: Date.now(),
    }, {
      targetWindowId,
    });
  }

  if (!isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
    return;
  }

  let response;
  try {
    response = await decompFetchWithPremiumAuth(
      decompState,
      requestUrl,
      { method: "GET" },
      DECOMP_INLINE_RESULT_LIMIT,
      {
        scope: "esm-decomp-report",
        endpointUrl: endpoint.url,
        cardId: normalizedCardId,
      }
    );
  } catch (error) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "report-fetch-error",
      cardId: normalizedCardId,
      endpointUrl: endpoint.url,
      error: error instanceof Error ? error.message : String(error),
    });
    void decompSendWorkspaceMessage("report-result", {
      ...reportMeta,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      rows: [],
      completedAt: Date.now(),
    }, {
      targetWindowId,
    });
    return;
  }

  if (!isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
    return;
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    emitDecompDebugEvent(activeFlowId, {
      phase: "report-http-error",
      cardId: normalizedCardId,
      endpointUrl: endpoint.url,
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
      responsePreview: truncateDebugText(bodyText, 2000),
    });
    void decompSendWorkspaceMessage("report-result", {
      ...reportMeta,
      ok: false,
      error: `HTTP ${response.status} ${normalizeHttpErrorMessage(bodyText) || response.statusText || "Request failed"}`,
      status: Number(response.status || 0),
      rows: [],
      completedAt: Date.now(),
    }, {
      targetWindowId,
    });
    return;
  }

  const bodyText = await response.text().catch(() => "");
  let payload = null;
  if (bodyText) {
    try {
      payload = JSON.parse(bodyText);
    } catch {
      payload = null;
    }
  }

  if (!payload && bodyText.trim()) {
    emitDecompDebugEvent(activeFlowId, {
      phase: "report-parse-error",
      cardId: normalizedCardId,
      endpointUrl: endpoint.url,
      error: "Response was not valid JSON.",
      responsePreview: truncateDebugText(bodyText, 2000),
    });
    void decompSendWorkspaceMessage("report-result", {
      ...reportMeta,
      ok: false,
      error: bodyText.trim(),
      rows: [],
      completedAt: Date.now(),
    }, {
      targetWindowId,
    });
    return;
  }

  const rows = Array.isArray(payload?.report) ? payload.report : [];
  emitDecompDebugEvent(activeFlowId, {
    phase: "report-result",
    cardId: normalizedCardId,
    endpointUrl: endpoint.url,
    rowCount: rows.length,
    noData: rows.length === 0,
    lastModified: response.headers.get("Last-Modified") || response.headers.get("Date") || "",
  });
  void decompSendWorkspaceMessage("report-result", {
    ...reportMeta,
    ok: true,
    rows,
    noData: rows.length === 0,
    lastModified: response.headers.get("Last-Modified") || response.headers.get("Date") || "",
    completedAt: Date.now(),
  }, {
    targetWindowId,
  });
}

function decompBuildShellHtml() {
  const zoomOptions = CLICK_ESM_ZOOM_OPTIONS.map((key) => {
    const value = escapeHtml(key);
    const label = key ? escapeHtml(key) : "";
    return `<option value="${value}">${label}</option>`;
  }).join("");

  return `
    <div class="decomp-shell">
      <div class="decomp-toolbar">
        <select class="decomp-zoom-filter" title="Zoom Level">${zoomOptions}</select>
        <input type="text" class="decomp-search" placeholder="Search segments / columns..." />
        <button type="button" class="decomp-find-btn">FIND IT</button>
        <button type="button" class="decomp-reset-btn">RESET</button>
        <span class="decomp-net-indicator" title="Loading" aria-label="Loading" hidden></span>
      </div>
      <div class="decomp-tree-head">
        <div class="decomp-tree-title">decomp</div>
        <div class="decomp-tree-actions">
          <button type="button" class="decomp-open-workspace-btn">OPEN WORKSPACE</button>
          <button type="button" class="decomp-expand-btn">Expand</button>
          <button type="button" class="decomp-collapse-btn">Collapse</button>
          <span class="decomp-tree-stats"></span>
        </div>
      </div>
      <div class="decomp-recording-tool">
        <p class="decomp-recording-status">Click START RECORDING to capture decomp ESM traffic in the UP trace.</p>
        <div class="decomp-recording-actions">
          <button type="button" class="decomp-start-record-btn">START RECORDING</button>
          <button type="button" class="decomp-stop-record-btn" disabled hidden>STOP</button>
        </div>
      </div>
      <div class="decomp-tree-scroll">
        <div class="decomp-tree-root"></div>
      </div>
      <div class="decomp-footer">
        <select
          class="decomp-requestor-select click-esm-requestor-select"
          multiple
          size="1"
          title="Filter by selected requestor-id(s)"
        ></select>
        <select
          class="decomp-mvpd-select click-esm-mvpd-select"
          multiple
          size="1"
          title="Filter by selected MVPD(s)"
          disabled
          hidden
        ></select>
      </div>
    </div>
  `;
}

function decompRenderTreeNode(decompState, node, parentUl, requestToken) {
  const item = document.createElement("li");
  const nodeRow = document.createElement("div");
  nodeRow.className = "decomp-node";

  const twisty = document.createElement("span");
  twisty.className = "decomp-twisty";
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  twisty.textContent = hasChildren ? "+" : "";
  if (!hasChildren) {
    twisty.classList.add("hidden");
  }

  const label = document.createElement("span");
  label.className = "decomp-label";
  const parts = Array.isArray(node.parts) ? node.parts : [];
  parts.forEach((segment, index) => {
    const chip = document.createElement("span");
    chip.className = "decomp-chip";
    chip.dataset.raw = String(segment || "");
    chip.textContent = String(segment || "");
    decompApplyChipColor(chip, segment);
    label.appendChild(chip);

    if (index < parts.length - 1) {
      const separator = document.createElement("span");
      separator.className = "decomp-badge";
      separator.textContent = "/";
      separator.title = "Compressed path";
      label.appendChild(separator);
    }
  });

  const meta = document.createElement("span");
  meta.className = "decomp-meta";
  const endpointCount = Number(node.count || 0);
  meta.textContent = endpointCount ? String(endpointCount) : "";

  nodeRow.appendChild(twisty);
  nodeRow.appendChild(label);
  nodeRow.appendChild(meta);

  if (node.endpointIndex != null) {
    const endpoint = decompState.catalog[node.endpointIndex];
    item.dataset.endpointIndex = String(node.endpointIndex);
    item.dataset.zoomKey = String(endpoint?.zoomKey || "");
    item.dataset.hay = String(endpoint?.hay || "");
    item.dataset.href = String(endpoint?.url || "");
    if (endpoint?.zoomKey) {
      meta.textContent = `${endpointCount} • [${endpoint.zoomKey}]`;
    }

    const runButton = document.createElement("button");
    runButton.className = "decomp-run";
    runButton.type = "button";
    runButton.textContent = "▶";
    runButton.title = "Run this endpoint in Workspace";
    runButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void decompEnsureWorkspaceTab({ activate: true, windowId: decompState.controllerWindowId })
        .then(() => {
          decompBroadcastControllerState(decompState);
          return decompRunEndpointToWorkspace(decompState, endpoint, generateRequestId(), requestToken, {
            emitStart: true,
            requestSource: "tree",
          });
        })
        .catch((error) => {
          setStatus(`Unable to open decomp workspace: ${error instanceof Error ? error.message : String(error)}`, "error");
        });
    });
    nodeRow.appendChild(runButton);
  }

  const toggleNode = () => {
    const childList = item.querySelector(":scope > ul");
    if (!childList) {
      return;
    }
    const collapsed = childList.style.display === "none";
    childList.style.display = collapsed ? "" : "none";
    twisty.textContent = collapsed ? "−" : "+";
  };

  twisty.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleNode();
  });

  label.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isLeaf = !hasChildren;
    if (isLeaf && node.endpointIndex != null) {
      const endpoint = decompState.catalog[node.endpointIndex];
      void decompEnsureWorkspaceTab({ activate: true, windowId: decompState.controllerWindowId })
        .then(() => {
          decompBroadcastControllerState(decompState);
          return decompRunEndpointToWorkspace(decompState, endpoint, generateRequestId(), requestToken, {
            emitStart: true,
            requestSource: "tree",
          });
        })
        .catch((error) => {
          setStatus(`Unable to open decomp workspace: ${error instanceof Error ? error.message : String(error)}`, "error");
        });
      return;
    }
    if (hasChildren) {
      toggleNode();
    }
  });

  item.appendChild(nodeRow);
  if (hasChildren) {
    const childUl = document.createElement("ul");
    childUl.style.display = "none";
    node.children.forEach((child) => {
      decompRenderTreeNode(decompState, child, childUl, requestToken);
    });
    item.appendChild(childUl);
  }
  parentUl.appendChild(item);
}

function decompExpandCollapseAll(decompState, shouldExpand) {
  const root = decompState?.treeRootElement;
  if (!root) {
    return;
  }
  root.querySelectorAll("li > ul").forEach((nested) => {
    nested.style.display = shouldExpand ? "" : "none";
  });
  root.querySelectorAll(".decomp-twisty").forEach((twisty) => {
    if (!twisty.classList.contains("hidden")) {
      twisty.textContent = shouldExpand ? "−" : "+";
    }
  });
}

function decompExpandTrunk(decompState) {
  const root = decompState?.treeRootElement;
  if (!root) {
    return;
  }
  let current = root.querySelector("ul.decomp-root > li");
  while (current) {
    const childUl = current.querySelector(":scope > ul");
    if (!childUl) {
      break;
    }
    childUl.style.display = "";
    const twisty = current.querySelector(":scope .decomp-twisty");
    if (twisty && !twisty.classList.contains("hidden")) {
      twisty.textContent = "−";
    }

    const children = [...childUl.children];
    if (children.length !== 1) {
      break;
    }
    current = children[0];
  }
}

function decompApplyTreeFilters(decompState, options = {}) {
  const root = decompState?.treeRootElement;
  if (!root) {
    return;
  }

  const zoomFilter = String(options.zoomFilter ?? decompState.zoomFilterSelect?.value ?? "")
    .trim()
    .toUpperCase();
  const term = clickEsmNormalizeSearchTerm(options.term ?? decompState.searchInput?.value ?? "");
  const doHighlight = Boolean(options.highlight && term);
  const highlightPattern = doHighlight ? new RegExp(clickEsmEscapeRegExp(term), "gi") : null;
  let visibleEndpoints = 0;

  const walk = (item) => {
    let anyVisibleChild = false;
    const childList = item.querySelector(":scope > ul");
    if (childList) {
      [...childList.children].forEach((childItem) => {
        if (walk(childItem)) {
          anyVisibleChild = true;
        }
      });
    }

    const endpointIndex = item.getAttribute("data-endpoint-index");
    const isEndpoint = endpointIndex != null;
    let selfVisible = false;

    const label = item.querySelector(":scope > .decomp-node > .decomp-label");
    if (label) {
      label.querySelectorAll(".decomp-chip").forEach((chip) => {
        const rawValue = String(chip.dataset.raw || chip.textContent || "");
        if (highlightPattern && rawValue.toLowerCase().replace(/\s+/g, "").includes(term)) {
          chip.innerHTML = rawValue.replace(highlightPattern, (match) => `<mark>${escapeHtml(match)}</mark>`);
        } else {
          chip.textContent = rawValue;
        }
        decompApplyChipColor(chip, rawValue);
      });
    }

    if (isEndpoint) {
      const endpointZoom = String(item.dataset.zoomKey || "").trim().toUpperCase();
      const haystack = String(item.dataset.hay || "").toLowerCase();
      const zoomPass = !zoomFilter || endpointZoom === zoomFilter;
      const termPass = !term || haystack.includes(term);
      selfVisible = zoomPass && termPass;
      if (selfVisible) {
        visibleEndpoints += 1;
      }

      const runButton = item.querySelector(":scope > .decomp-node > .decomp-run");
      if (runButton) {
        runButton.style.display = selfVisible ? "" : "none";
      }

      if (label) {
        const labelNormalized = label.textContent.toLowerCase().replace(/\s+/g, "");
        const segMatch = Boolean(term && labelNormalized.includes(term));
        const colOnlyMatch = Boolean(term && termPass && !segMatch);
        label.classList.toggle("decomp-col-match", colOnlyMatch);
      }
    }

    const shouldShow = selfVisible || anyVisibleChild;
    item.style.display = shouldShow ? "" : "none";

    if (doHighlight && term && shouldShow && anyVisibleChild && childList) {
      childList.style.display = "";
      const twisty = item.querySelector(":scope > .decomp-node > .decomp-twisty");
      if (twisty && !twisty.classList.contains("hidden")) {
        twisty.textContent = "−";
      }
    }

    return shouldShow;
  };

  const topList = root.querySelector("ul.decomp-root");
  if (topList) {
    [...topList.children].forEach((topItem) => {
      walk(topItem);
    });
  }

  if (decompState.treeStatsElement) {
    const zoomLabel = zoomFilter ? ` • ${zoomFilter}` : "";
    decompState.treeStatsElement.textContent = `${visibleEndpoints} endpoints${zoomLabel}`;
  }
}

function decompBuildTree(decompState, requestToken) {
  const treeRoot = decompState?.treeRootElement;
  if (!treeRoot) {
    return;
  }

  const trie = decompBuildTrie(decompState.catalog);
  const model = decompCompressTrie(trie);
  decompCountEndpoints(model);
  decompState.treeModel = model;

  treeRoot.innerHTML = "";
  const rootList = document.createElement("ul");
  rootList.className = "decomp-root";
  const hasSyntheticRootParts = Array.isArray(model.parts) && model.parts.length > 0;

  if (hasSyntheticRootParts || model.endpointIndex != null) {
    decompRenderTreeNode(decompState, model, rootList, requestToken);
  } else {
    model.children.forEach((childNode) => {
      decompRenderTreeNode(decompState, childNode, rootList, requestToken);
    });
  }

  treeRoot.appendChild(rootList);
  decompExpandTrunk(decompState);
  decompApplyTreeFilters(decompState, { highlight: false });
}

function wireDecompInteractions(decompState, requestToken) {
  if (!decompState?.contentElement) {
    return;
  }

  decompState.startRecordingButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void startDecompEsmRecording(decompState, requestToken);
  });

  decompState.stopRecordingButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void stopDecompEsmRecording(decompState);
  });

  decompState.findButton?.addEventListener("click", () => {
    if (decompState.searchInput) {
      decompState.searchInput.value = clickEsmNormalizeSearchTerm(decompState.searchInput.value);
    }
    decompApplyTreeFilters(decompState, { highlight: true });
  });

  decompState.resetButton?.addEventListener("click", () => {
    if (decompState.searchInput) {
      decompState.searchInput.value = "";
    }
    if (decompState.zoomFilterSelect) {
      decompState.zoomFilterSelect.value = "";
    }
    decompApplyTreeFilters(decompState, { highlight: false });
  });

  decompState.zoomFilterSelect?.addEventListener("change", () => {
    const term = clickEsmNormalizeSearchTerm(decompState.searchInput?.value || "");
    decompApplyTreeFilters(decompState, { highlight: Boolean(term) });
  });

  decompState.searchInput?.addEventListener("input", () => {
    const term = clickEsmNormalizeSearchTerm(decompState.searchInput?.value || "");
    decompApplyTreeFilters(decompState, { highlight: Boolean(term) });
  });

  decompState.searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      decompState.searchInput.value = clickEsmNormalizeSearchTerm(decompState.searchInput.value);
      decompApplyTreeFilters(decompState, { highlight: true });
    }
  });

  decompState.expandAllButton?.addEventListener("click", () => {
    decompExpandCollapseAll(decompState, true);
  });

  decompState.collapseAllButton?.addEventListener("click", () => {
    decompExpandCollapseAll(decompState, false);
  });

  decompState.openWorkspaceButton?.addEventListener("click", () => {
    void decompEnsureWorkspaceTab({ activate: true, windowId: decompState.controllerWindowId })
      .then(() => {
        decompBroadcastControllerState(decompState);
      })
      .catch((error) => {
        setStatus(`Unable to open decomp workspace: ${error instanceof Error ? error.message : String(error)}`, "error");
      });
  });

  decompState.requestorSelect?.addEventListener("change", () => {
    clickEsmHandleRequestorChange(decompState, requestToken);
    decompBroadcastControllerState(decompState);
    syncDecompRecordingControls(decompState);
  });

  decompState.mvpdSelect?.addEventListener("change", () => {
    clickEsmRememberMvpdSelection(decompState);
    decompBroadcastControllerState(decompState);
    syncDecompRecordingControls(decompState);
  });

  clickEsmEnableMvpdHoverHint(decompState);
}

function getActiveDecompState() {
  const sections = document.querySelectorAll(".premium-service-section.service-esm-decomp");
  for (const section of sections) {
    const decompState = section?.__underparDecompState || null;
    if (decompState?.section?.isConnected) {
      return decompState;
    }
  }
  return null;
}

function getInteractiveEsmStates() {
  const states = [];
  document.querySelectorAll(".premium-service-section.service-esm-click").forEach((section) => {
    const clickState = section?.__underparClickEsmState || null;
    if (clickState?.section?.isConnected) {
      states.push(clickState);
    }
  });
  document.querySelectorAll(".premium-service-section.service-esm-decomp").forEach((section) => {
    const decompState = section?.__underparDecompState || null;
    if (decompState?.section?.isConnected) {
      states.push(decompState);
    }
  });
  return states;
}

async function handleDecompWorkspaceAction(message, sender = null) {
  const action = String(message?.action || "").trim().toLowerCase();
  const decompState = getActiveDecompState();
  const senderWindowId = Number(sender?.tab?.windowId || 0);
  const senderTabId = Number(sender?.tab?.id || 0);
  const controllerWindowId = decompState
    ? Number(decompState.controllerWindowId || state.decompWorkspaceWindowId || 0)
    : 0;
  const mappedSenderTabId =
    senderWindowId > 0 ? Number(state.decompWorkspaceTabIdByWindowId.get(senderWindowId) || 0) : 0;

  if (senderWindowId > 0 && controllerWindowId > 0 && senderWindowId !== controllerWindowId) {
    return { ok: false, error: "decomp controller is attached to a different window." };
  }
  if (senderWindowId > 0 && senderTabId > 0 && mappedSenderTabId > 0 && senderTabId !== mappedSenderTabId) {
    return { ok: false, error: "This is not the bound decomp workspace tab for the window." };
  }
  if (senderWindowId > 0 && senderTabId > 0 && (!mappedSenderTabId || mappedSenderTabId <= 0)) {
    decompBindWorkspaceTab(senderWindowId, senderTabId);
  }
  if (decompState && senderWindowId > 0 && Number(decompState.controllerWindowId || 0) <= 0) {
    decompState.controllerWindowId = senderWindowId;
  }

  if (action === "workspace-ready") {
    emitDecompDebugEvent(getActiveDecompDebugFlowId(), {
      phase: "workspace-ready",
      source: "workspace",
      windowId: senderWindowId,
      tabId: senderTabId,
    });
    if (decompState) {
      if (senderWindowId > 0) {
        decompBindWorkspaceTab(senderWindowId, senderTabId);
      }
      decompBroadcastControllerState(decompState, senderWindowId);
    } else {
      void decompSendWorkspaceMessage("controller-state", {
        controllerOnline: false,
        programmerId: "",
        programmerName: "",
        requestorIds: [],
        mvpdIds: [],
        updatedAt: Date.now(),
      }, {
        targetWindowId: senderWindowId,
      });
    }
    return { ok: true, controllerOnline: Boolean(decompState) };
  }

  if (!decompState) {
    return { ok: false, error: "Open decomp in the UnderPAR side panel to run reports." };
  }

  const requestToken = Number(state.premiumPanelRequestToken || 0);
  if (!isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
    return { ok: false, error: "decomp controller is no longer active for the selected media company." };
  }
  const activeFlowId = getActiveDecompDebugFlowId();

  if (action === "open-workspace") {
    emitDecompDebugEvent(activeFlowId, {
      phase: "workspace-action",
      action: "open-workspace",
      source: "workspace",
      windowId: senderWindowId || Number(decompState.controllerWindowId || 0),
    });
    const targetWindowId = senderWindowId || Number(decompState.controllerWindowId || 0);
    await decompEnsureWorkspaceTab({ activate: true, windowId: targetWindowId });
    decompBroadcastControllerState(decompState, targetWindowId);
    return { ok: true };
  }

  if (action === "run-card") {
    const card = message?.card && typeof message.card === "object" ? message.card : {};
    emitDecompDebugEvent(activeFlowId, {
      phase: "workspace-action",
      action: "run-card",
      source: "workspace",
      cardId: String(card?.cardId || ""),
      endpointUrl: String(card?.endpointUrl || ""),
    });
    const endpoint = decompFindEndpointByUrl(decompState, card.endpointUrl, card);
    if (!endpoint) {
      return { ok: false, error: "Endpoint URL is required." };
    }
    await decompRunEndpointToWorkspace(decompState, endpoint, String(card.cardId || generateRequestId()), requestToken, {
      emitStart: true,
      requestSource: "workspace",
    });
    return { ok: true };
  }

  if (action === "rerun-all") {
    const cards = Array.isArray(message?.cards) ? message.cards : [];
    emitDecompDebugEvent(activeFlowId, {
      phase: "workspace-action",
      action: "rerun-all",
      source: "workspace",
      cardCount: cards.length,
    });
    void decompSendWorkspaceMessage("batch-start", {
      total: cards.length,
      startedAt: Date.now(),
    }, {
      targetWindowId: senderWindowId || Number(decompState.controllerWindowId || 0),
    });
    for (const card of cards) {
      const endpoint = decompFindEndpointByUrl(decompState, card?.endpointUrl, card || {});
      if (!endpoint) {
        continue;
      }
      await decompRunEndpointToWorkspace(decompState, endpoint, String(card?.cardId || generateRequestId()), requestToken, {
        emitStart: true,
        requestSource: "workspace",
      });
    }
    void decompSendWorkspaceMessage("batch-end", {
      total: cards.length,
      completedAt: Date.now(),
    }, {
      targetWindowId: senderWindowId || Number(decompState.controllerWindowId || 0),
    });
    return { ok: true };
  }

  if (action === "download-csv") {
    const card = message?.card && typeof message.card === "object" ? message.card : {};
    emitDecompDebugEvent(activeFlowId, {
      phase: "workspace-action",
      action: "download-csv",
      source: "workspace",
      cardId: String(card?.cardId || ""),
      endpointUrl: String(card?.endpointUrl || ""),
    });
    const endpoint = decompFindEndpointByUrl(decompState, card.endpointUrl, card);
    if (!endpoint) {
      return { ok: false, error: "Endpoint URL is required." };
    }
    await decompDownloadCsvForCard(
      decompState,
      endpoint,
      decompNormalizeSortRule(message?.sortRule),
      requestToken,
      String(card.cardId || "")
    );
    return { ok: true };
  }

  return { ok: false, error: `Unsupported workspace action: ${action}` };
}

function ensureDecompRuntimeListener() {
  if (state.decompRuntimeListenerBound) {
    return;
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!DECOMP_MESSAGE_TYPES.has(String(message?.type || "")) || message?.channel !== "workspace-action") {
      return false;
    }

    void handleDecompWorkspaceAction(message, sender)
      .then((result) => {
        sendResponse(result && typeof result === "object" ? result : { ok: true });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });
    return true;
  });
  state.decompRuntimeListenerBound = true;
}

function ensureDecompWorkspaceTabWatcher() {
  if (state.decompWorkspaceTabWatcherBound) {
    return;
  }

  chrome.tabs.onRemoved.addListener((tabId) => {
    const removedTabId = Number(tabId || 0);
    if (removedTabId > 0) {
      const isBoundWorkspaceTab =
        removedTabId === Number(state.decompWorkspaceTabId || 0) ||
        [...state.decompWorkspaceTabIdByWindowId.values()].some((mappedTabId) => Number(mappedTabId || 0) === removedTabId);
      if (isBoundWorkspaceTab) {
        emitDecompDebugEvent(getActiveDecompDebugFlowId(), {
          phase: "workspace-tab-closed",
          tabId: removedTabId,
        });
      }
    }
    decompUnbindWorkspaceTab(tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const normalizedTabId = Number(tabId || 0);
    if (!normalizedTabId || !changeInfo?.url) {
      return;
    }
    if (decompIsWorkspaceTab(tab)) {
      decompBindWorkspaceTab(tab?.windowId, normalizedTabId);
      return;
    }
    const boundTabId = Number(state.decompWorkspaceTabId || 0);
    let isMappedTab = false;
    for (const mappedTabId of state.decompWorkspaceTabIdByWindowId.values()) {
      if (Number(mappedTabId || 0) === normalizedTabId) {
        isMappedTab = true;
        break;
      }
    }
    if (isMappedTab || normalizedTabId === boundTabId) {
      decompUnbindWorkspaceTab(normalizedTabId);
    }
  });
  state.decompWorkspaceTabWatcherBound = true;
}

async function loadDecompService(programmer, appInfo, section, contentElement, refreshButton, requestToken) {
  if (!contentElement) {
    return;
  }
  if (!programmer?.programmerId || !appInfo?.guid) {
    contentElement.innerHTML = '<div class="service-error">Missing media company or ESM application details.</div>';
    return;
  }

  const existingDecompState = section?.__underparDecompState || null;
  if (existingDecompState?.requestorApplyTimer) {
    clearTimeout(existingDecompState.requestorApplyTimer);
  }
  section.__underparDecompState = null;
  if (
    state.decompRecordingActive &&
    state.decompRecordingContext &&
    String(state.decompRecordingContext.programmerId || "") &&
    String(state.decompRecordingContext.programmerId || "") !== String(programmer.programmerId || "")
  ) {
    clearDecompRecordingState("programmer-change");
  }

  if (refreshButton) {
    refreshButton.disabled = true;
  }
  contentElement.innerHTML = '<div class="loading">Loading decomp...</div>';

  try {
    const controllerWindowId = await decompGetCurrentWindowId();
    const endpoints = await loadClickEsmEndpoints();
    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      contentElement.innerHTML = '<div class="service-error">No ESM endpoints were found for decomp.</div>';
      return;
    }

    const catalog = decompBuildCatalog(endpoints);
    const endpointByUrl = new Map();
    catalog.forEach((item) => {
      endpointByUrl.set(item.url, {
        url: item.url,
        zoomKey: item.zoomKey,
        columns: item.columns,
      });
    });

    contentElement.innerHTML = decompBuildShellHtml();
    const decompState = {
      serviceType: "decompTree",
      controllerWindowId: Number(controllerWindowId || 0),
      section,
      contentElement,
      programmer,
      appInfo,
      endpoints,
      catalog,
      endpointByUrl,
      treeModel: null,
      netInFlight: 0,
      requestorApplyTimer: 0,
      pendingRequestorIds: [],
      lastKnownSelectedMvpdIds: new Set(),
      zoomFilterSelect: contentElement.querySelector(".decomp-zoom-filter"),
      searchInput: contentElement.querySelector(".decomp-search"),
      findButton: contentElement.querySelector(".decomp-find-btn"),
      resetButton: contentElement.querySelector(".decomp-reset-btn"),
      expandAllButton: contentElement.querySelector(".decomp-expand-btn"),
      collapseAllButton: contentElement.querySelector(".decomp-collapse-btn"),
      openWorkspaceButton: contentElement.querySelector(".decomp-open-workspace-btn"),
      treeStatsElement: contentElement.querySelector(".decomp-tree-stats"),
      treeRootElement: contentElement.querySelector(".decomp-tree-root"),
      requestorSelect: contentElement.querySelector(".decomp-requestor-select"),
      mvpdSelect: contentElement.querySelector(".decomp-mvpd-select"),
      recordingStatusElement: contentElement.querySelector(".decomp-recording-status"),
      startRecordingButton: contentElement.querySelector(".decomp-start-record-btn"),
      stopRecordingButton: contentElement.querySelector(".decomp-stop-record-btn"),
    };

    section.__underparDecompState = decompState;
    wireDecompInteractions(decompState, requestToken);
    syncDecompRecordingControls(decompState);
    decompBuildTree(decompState, requestToken);
    clickEsmApplySharedRequestorOptions(decompState, requestToken, {
      selectedRequestorId: state.selectedRequestorId,
      emptyLabel: "-- Select a Media Company first --",
    });

    if (decompState.mvpdSelect && state.selectedMvpdId) {
      [...decompState.mvpdSelect.options].forEach((option) => {
        if (option.value === state.selectedMvpdId) {
          option.selected = true;
        }
      });
      clickEsmRememberMvpdSelection(decompState);
    }
    syncDecompRecordingControls(decompState);

    ensureDecompRuntimeListener();
    ensureDecompWorkspaceTabWatcher();
    await decompEnsureWorkspaceTab({ activate: false, windowId: decompState.controllerWindowId });
    decompBroadcastControllerState(decompState);
  } catch (error) {
    if (!isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    contentElement.innerHTML = `<div class="service-error">${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</div>`;
  } finally {
    if (refreshButton && isEsmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      refreshButton.disabled = false;
    }
  }
}

function buildPremiumServiceSummaryHtml(programmer, serviceKey, appInfo) {
  const scopeList = Array.isArray(appInfo?.scopes) && appInfo.scopes.length > 0 ? appInfo.scopes.join(", ") : "No scopes";
  const softwareState = appInfo?.softwareStatement ? "Software statement ready" : "Software statement pending";
  const dcrCache = programmer?.programmerId && appInfo?.guid ? loadDcrCache(programmer.programmerId, appInfo.guid) : null;
  const restV2CandidateCount = Array.isArray(
    state.premiumAppsByProgrammerId.get(programmer?.programmerId || "")?.restV2Apps
  )
    ? state.premiumAppsByProgrammerId.get(programmer?.programmerId || "").restV2Apps.length
    : 0;

  let dcrState = "No DCR client cached.";
  if (dcrCache?.clientId) {
    const expiresAtMs = Number(dcrCache.tokenExpiresAt || 0);
    const hasLiveToken = Boolean(dcrCache.accessToken) && Number.isFinite(expiresAtMs) && expiresAtMs > Date.now();
    if (hasLiveToken) {
      dcrState = `DCR token ready (expires ${new Date(expiresAtMs).toLocaleString()})`;
    } else {
      dcrState = "DCR client cached; token missing/expired.";
    }
  }

  const title = PREMIUM_SERVICE_TITLE_BY_KEY[serviceKey] || serviceKey;
  const summaryItems = [
    buildMetadataItemHtml(`${title} Application`, appInfo?.appName || appInfo?.guid || "Registered application"),
    buildMetadataItemHtml("Application GUID", appInfo?.guid || "N/A"),
    buildMetadataItemHtml("Scopes", scopeList),
    buildMetadataItemHtml("Software Statement", softwareState),
    buildMetadataItemHtml("DCR Cache", dcrState),
  ];

  if (serviceKey === "restV2") {
    summaryItems.push(buildMetadataItemHtml("REST V2 App Candidates", String(restV2CandidateCount || 1)));
  }

  return summaryItems.join("");
}

function stopPremiumServiceAutoRefresh(section) {
  const timerId = Number(section?.__underparAutoRefreshTimer || 0);
  if (!timerId) {
    return;
  }
  clearInterval(timerId);
  section.__underparAutoRefreshTimer = 0;
}

function startPremiumServiceAutoRefresh(section, container, refreshFn, intervalMs) {
  stopPremiumServiceAutoRefresh(section);
  if (typeof refreshFn !== "function") {
    return;
  }

  const tick = () => {
    if (!section?.isConnected) {
      stopPremiumServiceAutoRefresh(section);
      return;
    }
    if (container?.classList.contains("collapsed")) {
      return;
    }
    void refreshFn();
  };

  section.__underparAutoRefreshTimer = window.setInterval(tick, Math.max(15000, Number(intervalMs) || ESM_AUTO_REFRESH_INTERVAL_MS));
}

function clearPremiumServiceAutoRefreshTimers() {
  if (!els.premiumServicesContainer) {
    return;
  }
  const sections = els.premiumServicesContainer.querySelectorAll(".premium-service-section");
  sections.forEach((section) => {
    stopPremiumServiceAutoRefresh(section);
  });
}

function createPremiumServiceSection(programmer, serviceKey, appInfo) {
  const title = PREMIUM_SERVICE_TITLE_BY_KEY[serviceKey] || serviceKey;
  const serviceClassByKey = {
    degradation: "service-degradation",
    esm: "service-esm",
    clickEsm: "service-esm-click",
    decompTree: "service-esm-decomp",
    restV2: "service-rest-v2",
  };

  const section = document.createElement("article");
  section.className = `metadata-section premium-service-section ${serviceClassByKey[serviceKey] || ""}`;
  const restV2LoginToolHtml =
    serviceKey === "restV2"
      ? `
        <section class="rest-v2-login-tool">
          <p class="rest-v2-login-status">Choose Requestor + MVPD, then click START RECORDING to capture end-to-end MVPD traffic. Click STOP at any time to close and download HAR.</p>
          <div class="rest-v2-login-actions">
            <button type="button" class="rest-v2-test-login-btn" disabled hidden>START RECORDING</button>
            <button type="button" class="rest-v2-close-login-btn" disabled hidden>STOP</button>
          </div>
        </section>
        `
      : "";
  const serviceBodyHtml =
    serviceKey === "esm"
      ? '<div class="loading">Loading ESM data...</div>'
      : serviceKey === "clickEsm"
        ? '<div class="loading">Loading clickESM...</div>'
      : serviceKey === "decompTree"
        ? '<div class="loading">Loading decomp...</div>'
      : buildPremiumServiceSummaryHtml(programmer, serviceKey, appInfo);
  const showManualRefresh = serviceKey !== "esm" && serviceKey !== "clickEsm" && serviceKey !== "decompTree";
  const serviceActionsHtml = showManualRefresh
    ? `
      <div class="service-actions">
        <button type="button" class="service-refresh-btn">Refresh ${escapeHtml(title)}</button>
      </div>
    `
    : "";
  const sectionLabel =
    serviceKey === "clickEsm"
      ? `clickESM w/ '${appInfo?.appName || appInfo?.guid || "Registered application"}'`
      : serviceKey === "decompTree"
        ? `decomp w/ '${appInfo?.appName || appInfo?.guid || "Registered application"}'`
      : `${title} w/ '${appInfo?.appName || appInfo?.guid || "Registered application"}'`;
  section.innerHTML = `
    <button type="button" class="metadata-header service-box-header">
      <span>${escapeHtml(sectionLabel)}</span>
      <span class="collapse-icon">▼</span>
    </button>
    <div class="metadata-container service-box-container">
      ${serviceActionsHtml}
      <div class="service-content">
        ${restV2LoginToolHtml}
        ${serviceBodyHtml}
      </div>
    </div>
  `;

  const toggleButton = section.querySelector(".service-box-header");
  const container = section.querySelector(".service-box-container");
  const refreshButton = section.querySelector(".service-refresh-btn");
  const contentElement = section.querySelector(".service-content");
  const initialCollapsed = getPremiumSectionCollapsed(programmer?.programmerId, serviceKey);
  wireCollapsibleSection(toggleButton, container, initialCollapsed, (collapsed) => {
    setPremiumSectionCollapsed(programmer?.programmerId, serviceKey, collapsed);
    if (!collapsed) {
      if (serviceKey === "esm" && typeof section.__underparRefreshEsm === "function") {
        void section.__underparRefreshEsm();
      } else if (serviceKey === "clickEsm" && typeof section.__underparRefreshClickEsm === "function") {
        void section.__underparRefreshClickEsm();
      } else if (serviceKey === "decompTree" && typeof section.__underparRefreshDecomp === "function") {
        void section.__underparRefreshDecomp();
      }
    }
  });

  if (serviceKey === "esm") {
    section.__underparRefreshEsm = () => {
      const requestToken = state.premiumPanelRequestToken;
      return loadEsmService(programmer, appInfo, section, contentElement, refreshButton, requestToken);
    };
    void section.__underparRefreshEsm();
    startPremiumServiceAutoRefresh(section, container, section.__underparRefreshEsm, ESM_AUTO_REFRESH_INTERVAL_MS);
  } else if (serviceKey === "clickEsm") {
    section.__underparRefreshClickEsm = () => {
      const requestToken = state.premiumPanelRequestToken;
      return loadClickEsmService(programmer, appInfo, section, contentElement, refreshButton, requestToken);
    };
    void section.__underparRefreshClickEsm();
  } else if (serviceKey === "decompTree") {
    section.__underparRefreshDecomp = () => {
      const requestToken = state.premiumPanelRequestToken;
      return loadDecompService(programmer, appInfo, section, contentElement, refreshButton, requestToken);
    };
    void section.__underparRefreshDecomp();
  } else {
    refreshButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const selected = resolveSelectedProgrammer();
      if (!selected || !programmer || selected.programmerId !== programmer.programmerId) {
        return;
      }

      refreshButton.disabled = true;
      setStatus(`Refreshing ${title} premium service...`, "info");
      try {
        await ensurePremiumAppsForProgrammer(programmer, { forceRefresh: true });
        await refreshProgrammerPanels({ forcePremiumRefresh: false });
        setStatus(`${title} premium service refreshed.`, "success");
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        setStatus(`Unable to refresh ${title}: ${reason}`, "error");
      } finally {
        refreshButton.disabled = false;
      }
    });
  }

  if (serviceKey === "restV2") {
    const testLoginButton = section.querySelector(".rest-v2-test-login-btn");
    const closeLoginButton = section.querySelector(".rest-v2-close-login-btn");
    if (testLoginButton) {
      testLoginButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        await launchRestV2MvpdLogin(section, programmer, appInfo);
      });
    }
    if (closeLoginButton) {
      closeLoginButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        await stopRestV2MvpdRecording(section, programmer, appInfo);
      });
    }

    syncRestV2LoginPanel(section, programmer, appInfo);
  }

  return section;
}

function renderPremiumServicesLoading(programmer) {
  if (!els.premiumServicesContainer) {
    return;
  }
  clearPremiumServiceAutoRefreshTimers();

  const label = programmer?.programmerName
    ? `Loading premium services for ${programmer.programmerName}...`
    : "Loading premium services...";
  els.premiumServicesContainer.innerHTML = `<p class="metadata-empty">${escapeHtml(label)}</p>`;
}

function renderPremiumServicesError(error) {
  if (!els.premiumServicesContainer) {
    return;
  }
  clearPremiumServiceAutoRefreshTimers();
  const reason = error instanceof Error ? error.message : String(error);
  els.premiumServicesContainer.innerHTML = `<p class="metadata-empty service-error">${escapeHtml(reason)}</p>`;
}

function renderPremiumServices(services, programmer = null) {
  if (!els.premiumServicesContainer) {
    return;
  }
  clearPremiumServiceAutoRefreshTimers();

  if (!services) {
    els.premiumServicesContainer.innerHTML =
      '<p class="metadata-empty">No premium scoped applications loaded yet.</p>';
    return;
  }

  const availableKeys = PREMIUM_SERVICE_DISPLAY_ORDER.filter((serviceKey) => {
    if (serviceKey === "clickEsm") {
      return Boolean(services?.esm);
    }
    if (serviceKey === "decompTree") {
      return Boolean(services?.esm);
    }
    return Boolean(services?.[serviceKey]);
  });
  if (availableKeys.length === 0) {
    els.premiumServicesContainer.innerHTML =
      '<p class="metadata-empty">No premium scoped applications found for this media company.</p>';
    return;
  }

  els.premiumServicesContainer.innerHTML = "";
  for (const serviceKey of availableKeys) {
    const appInfo = serviceKey === "clickEsm" || serviceKey === "decompTree" ? services.esm : services[serviceKey];
    const section = createPremiumServiceSection(programmer, serviceKey, appInfo);
    els.premiumServicesContainer.appendChild(section);
  }
  refreshRestV2LoginPanels();
}

function resetWorkflowForLoggedOut() {
  clearRestrictedOrgOptions();
  state.programmers = [];
  state.selectedMediaCompany = "";
  state.selectedRequestorId = "";
  state.selectedMvpdId = "";
  state.selectedProgrammerKey = "";
  state.applicationsByProgrammerId.clear();
  state.premiumAppsByProgrammerId.clear();
  state.premiumAppsLoadPromiseByProgrammerId.clear();
  state.premiumSectionCollapsedByKey.clear();
  state.premiumPanelRequestToken = 0;
  state.mvpdCacheByRequestor.clear();
  state.mvpdLoadPromiseByRequestor.clear();
  state.restV2AuthContextByRequestor.clear();
  state.restV2PrewarmedAppsByProgrammerId.clear();
  clearRestV2PreparedLoginState();
  clearDecompRecordingState("logout-reset");
  state.consoleContextReady = false;
  state.decompWorkspaceTabId = 0;
  state.decompWorkspaceWindowId = 0;
  state.decompWorkspaceTabIdByWindowId.clear();

  void decompSendWorkspaceMessage("controller-state", {
    controllerOnline: false,
    programmerId: "",
    programmerName: "",
    requestorIds: [],
    mvpdIds: [],
    updatedAt: Date.now(),
  });

  els.mediaCompanySelect.disabled = true;
  els.mediaCompanySelect.innerHTML = '<option value="">-- Please login first --</option>';

  els.requestorSelect.disabled = true;
  els.requestorSelect.innerHTML = '<option value="">-- Select a Media Company first --</option>';

  els.mvpdSelect.disabled = true;
  els.mvpdSelect.innerHTML = '<option value="">-- Select Requestor first --</option>';

  renderPremiumServices(null);
}

function randomStateValue() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function generateRequestId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function isAuthFlowUrl(url) {
  if (!url) {
    return false;
  }

  const value = String(url).toLowerCase();
  return (
    value.includes("adobelogin.com") ||
    value.includes("experience.adobe.com") ||
    value.includes("console.auth.adobe.com") ||
    value.includes("login.aepdebugger.adobe.com")
  );
}

function summarizeUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return String(url);
  }
}

function getDebuggerEventUrl(method, params) {
  if (method === "Network.requestWillBeSent") {
    return params?.request?.url || "";
  }

  if (method === "Network.responseReceived") {
    return params?.response?.url || "";
  }

  if (method === "Network.loadingFailed") {
    return params?.request?.url || "";
  }

  if (method === "Page.frameNavigated") {
    return params?.frame?.url || "";
  }

  return "";
}

async function attachAuthDebugger(tabId) {
  if (!chrome.debugger || !tabId) {
    return null;
  }

  const target = { tabId };
  const onEvent = (source, method, params) => {
    if (source.tabId !== tabId) {
      return;
    }

    if (
      method !== "Network.requestWillBeSent" &&
      method !== "Network.responseReceived" &&
      method !== "Network.loadingFailed" &&
      method !== "Page.frameNavigated"
    ) {
      return;
    }

    const eventUrl = getDebuggerEventUrl(method, params);
    if (!isAuthFlowUrl(eventUrl)) {
      return;
    }

    if (method === "Network.responseReceived") {
      const status = params?.response?.status;
      log("Auth debugger response", {
        status,
        url: summarizeUrl(eventUrl),
      });
      return;
    }

    if (method === "Network.loadingFailed") {
      log("Auth debugger request failed", {
        url: summarizeUrl(eventUrl),
        error: params?.errorText || "unknown",
      });
      return;
    }

    log("Auth debugger event", {
      method,
      url: summarizeUrl(eventUrl),
    });
  };

  const onDetach = (source, reason) => {
    if (source.tabId !== tabId) {
      return;
    }
    log("Auth debugger detached", { reason: reason || "unknown" });
  };

  chrome.debugger.onEvent.addListener(onEvent);
  chrome.debugger.onDetach.addListener(onDetach);

  try {
    await chrome.debugger.attach(target, AUTH_DEBUGGER_PROTOCOL_VERSION);
    await chrome.debugger.sendCommand(target, "Network.enable");
    await chrome.debugger.sendCommand(target, "Page.enable");
    log("Auth debugger attached", { tabId });
  } catch (error) {
    chrome.debugger.onEvent.removeListener(onEvent);
    chrome.debugger.onDetach.removeListener(onDetach);
    log("Unable to attach auth debugger", error?.message || String(error));
    return null;
  }

  return {
    async detach() {
      chrome.debugger.onEvent.removeListener(onEvent);
      chrome.debugger.onDetach.removeListener(onDetach);
      try {
        await chrome.debugger.detach(target);
      } catch {
        // Ignore detach errors.
      }
    },
  };
}

function extractAuthParams(responseUrl) {
  const response = new URL(responseUrl);
  const params = new URLSearchParams(response.search);

  let hash = response.hash.startsWith("#") ? response.hash.slice(1) : response.hash;
  if (hash) {
    hash = hash.replace(/from_ims=true\?/gi, "from_ims=true&").replace(/#/g, "&");
    const hashParams = new URLSearchParams(hash);
    for (const [key, value] of hashParams.entries()) {
      if (!params.has(key)) {
        params.set(key, value);
      }
    }
  }

  return params;
}

function parseAuthResponse(responseUrl, requestState) {
  const authParams = extractAuthParams(responseUrl);

  const authError = authParams.get("error");
  if (authError) {
    const description = authParams.get("error_description");
    throw new Error(description ? `${authError}: ${description}` : authError);
  }

  const returnedState = authParams.get("state");
  if (returnedState && returnedState !== requestState) {
    throw new Error("State validation failed.");
  }

  const accessToken = authParams.get("access_token");
  if (!accessToken) {
    throw new Error("No access token returned from IMS.");
  }

  const expiresInSeconds = Number(authParams.get("expires_in") || "0");
  const expiresAt = Date.now() + Math.max(expiresInSeconds, 0) * 1000;

  return { accessToken, expiresAt };
}

function shouldUseAuthWindowFallback(error) {
  const text = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return text.includes("authorization page could not be loaded");
}

function buildAuthorizeUrl(redirectUri, requestState, extraParams = {}) {
  const params = new URLSearchParams({
    client_id: IMS_CLIENT_ID,
    response_type: "token",
    scope: IMS_SCOPE,
    state: requestState,
    locale: "en_US",
    redirect_uri: redirectUri,
  });

  for (const [key, value] of Object.entries(extraParams)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  return `${IMS_AUTHORIZE_URL}?${params.toString()}`;
}

function encodeBase64UrlUtf8(value) {
  const base64 = base64EncodeUtf8(value);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getLoginHelperStorageArea() {
  return chrome.storage?.session || chrome.storage.local;
}

function buildLoginHelperResultKeys(requestId) {
  const normalized = String(requestId || "").trim();
  if (!normalized) {
    return [];
  }
  return [`${LOGIN_HELPER_RESULT_PREFIX}${normalized}`, `${LEGACY_LOGIN_HELPER_RESULT_PREFIX}${normalized}`];
}

async function readLoginHelperResult(requestId) {
  const keys = buildLoginHelperResultKeys(requestId);
  const storageArea = getLoginHelperStorageArea();
  if (keys.length === 0 || !storageArea?.get) {
    return null;
  }

  try {
    const payload = await storageArea.get(keys);
    for (const key of keys) {
      const result = payload?.[key];
      if (result && typeof result === "object") {
        return result;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function clearLoginHelperResult(requestId) {
  const keys = buildLoginHelperResultKeys(requestId);
  const storageArea = getLoginHelperStorageArea();
  if (keys.length === 0 || !storageArea?.remove) {
    return;
  }

  try {
    await storageArea.remove(keys);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function normalizeLoginHelperMessage(message, requestId) {
  if (!message || typeof message !== "object") {
    return null;
  }

  const normalizedRequestId = String(requestId || "").trim();
  if (normalizedRequestId && String(message.requestId || "").trim() !== normalizedRequestId) {
    return null;
  }

  return message;
}

async function runLoginHelperFlow(requestState, extraParams = {}) {
  const helperRequestId = randomStateValue();
  const helperUrl = new URL(chrome.runtime.getURL(LOGIN_HELPER_PATH));
  helperUrl.searchParams.set("mode", "login");
  helperUrl.searchParams.set("requestId", helperRequestId);
  helperUrl.searchParams.set("state", requestState);

  const sanitizedExtraParams = Object.fromEntries(
    Object.entries(extraParams || {}).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
  if (Object.keys(sanitizedExtraParams).length > 0) {
    helperUrl.searchParams.set("extra", encodeBase64UrlUtf8(JSON.stringify(sanitizedExtraParams)));
  }

  await clearLoginHelperResult(helperRequestId);

  return new Promise(async (resolve, reject) => {
    let completed = false;
    let helperWindowId = 0;
    let helperTabId = 0;
    let timeoutId = null;
    let pollId = null;

    const finalize = async (payload, error) => {
      if (completed) {
        return;
      }
      completed = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (pollId) {
        clearInterval(pollId);
      }
      chrome.runtime.onMessage.removeListener(onRuntimeMessage);
      chrome.tabs.onRemoved.removeListener(onTabRemoved);

      await clearLoginHelperResult(helperRequestId);

      if (helperWindowId) {
        try {
          await chrome.windows.remove(helperWindowId);
        } catch {
          // Ignore window close failures.
        }
      }

      if (error) {
        reject(error);
        return;
      }

      const accessToken = String(payload?.accessToken || "").trim();
      if (!accessToken) {
        reject(new Error("No access token returned from helper login flow."));
        return;
      }

      const expiresAt = Number(payload?.expiresAt || 0);
      resolve({
        accessToken,
        expiresAt: Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt : Date.now() + 60 * 60 * 1000,
        profile: payload?.profile && typeof payload.profile === "object" ? payload.profile : null,
        organizations: payload?.organizations && typeof payload.organizations === "object" ? payload.organizations : null,
      });
    };

    const handleHelperPayload = (payload) => {
      const normalized = normalizeLoginHelperMessage(payload, helperRequestId);
      if (!normalized) {
        return;
      }

      if (normalized.ok !== true) {
        const message = String(normalized.error || "Login helper flow failed.");
        void finalize(null, new Error(message));
        return;
      }

      void finalize(normalized, null);
    };

    const onRuntimeMessage = (incomingMessage) => {
      if (!incomingMessage || !LOGIN_HELPER_RESULT_MESSAGE_TYPES.has(String(incomingMessage.type || ""))) {
        return;
      }

      const payload =
        incomingMessage.message && typeof incomingMessage.message === "object"
          ? incomingMessage.message
          : incomingMessage;
      handleHelperPayload(payload);
    };

    const onTabRemoved = (tabId) => {
      if (!helperTabId || tabId !== helperTabId || completed) {
        return;
      }
      void finalize(null, new Error("Login window was closed before completion."));
    };

    chrome.runtime.onMessage.addListener(onRuntimeMessage);
    chrome.tabs.onRemoved.addListener(onTabRemoved);

    timeoutId = setTimeout(() => {
      void finalize(null, new Error("Login timed out. Please try again."));
    }, AUTH_WINDOW_TIMEOUT_MS);

    pollId = setInterval(() => {
      void readLoginHelperResult(helperRequestId)
        .then((payload) => {
          if (payload) {
            handleHelperPayload(payload);
          }
        })
        .catch(() => {
          // Ignore helper storage polling failures.
        });
    }, 250);

    try {
      const helperWindow = await chrome.windows.create({
        url: helperUrl.toString(),
        type: "popup",
        width: 520,
        height: 720,
        focused: true,
      });

      helperWindowId = Number(helperWindow?.id || 0);
      helperTabId = Number(helperWindow?.tabs?.[0]?.id || 0);
      if (!helperTabId) {
        await finalize(null, new Error("Unable to open login window."));
      }
    } catch (error) {
      await finalize(null, error instanceof Error ? error : new Error(String(error)));
    }
  });
}

async function runAuthInPopupWindow(authUrl, redirectUri) {
  return new Promise(async (resolve, reject) => {
    let completed = false;
    let authWindowId = null;
    let authTabId = null;
    let debuggerSession = null;
    let timeoutId = null;
    let pollId = null;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (pollId) {
        clearInterval(pollId);
      }
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.onRemoved.removeListener(onRemoved);
      if (debuggerSession) {
        void debuggerSession.detach();
        debuggerSession = null;
      }
    };

    const closeAuthWindow = async () => {
      if (!authWindowId) {
        return;
      }
      try {
        await chrome.windows.remove(authWindowId);
      } catch {
        // Ignore close errors.
      }
    };

    const finish = (result, error) => {
      if (completed) {
        return;
      }
      completed = true;
      cleanup();
      void closeAuthWindow();

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    };

    const maybeResolveFromUrl = (url) => {
      if (!url || !url.startsWith(redirectUri)) {
        return;
      }
      finish(url, null);
    };

    const onUpdated = (tabId, changeInfo, tab) => {
      if (tabId !== authTabId) {
        return;
      }
      maybeResolveFromUrl(changeInfo.url || tab?.url || "");
    };

    const onRemoved = (tabId) => {
      if (tabId === authTabId && !completed) {
        finish(null, new Error("Login window was closed before completion."));
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);

    timeoutId = setTimeout(() => {
      finish(null, new Error("Login timed out. Please try again."));
    }, AUTH_WINDOW_TIMEOUT_MS);

    try {
      const authWindow = await chrome.windows.create({
        url: authUrl,
        type: "popup",
        width: 520,
        height: 720,
        focused: true,
      });

      authWindowId = authWindow.id ?? null;
      authTabId = authWindow.tabs?.[0]?.id ?? null;

      if (!authTabId) {
        finish(null, new Error("Unable to open login window."));
        return;
      }

      debuggerSession = await attachAuthDebugger(authTabId);

      pollId = setInterval(async () => {
        if (!authTabId || completed) {
          return;
        }

        try {
          const tab = await chrome.tabs.get(authTabId);
          maybeResolveFromUrl(tab.url || "");
        } catch {
          // Ignore transient polling errors.
        }
      }, 250);
    } catch (error) {
      finish(null, error instanceof Error ? error : new Error(String(error)));
    }
  });
}

async function runIdentityWebAuthFlow(requestState, extraParams = {}, interactive = true) {
  const redirectUri = chrome.identity.getRedirectURL("ims-callback");
  const authUrl = buildAuthorizeUrl(redirectUri, requestState, extraParams);

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive,
  });

  if (!responseUrl) {
    throw new Error("Login was canceled.");
  }

  return parseAuthResponse(responseUrl, requestState);
}

async function runLegacyAuthWindowFlow(requestState, extraParams = {}) {
  const authUrl = buildAuthorizeUrl(IMS_LEGACY_REDIRECT_URI, requestState, extraParams);
  const responseUrl = await runAuthInPopupWindow(authUrl, IMS_LEGACY_REDIRECT_URI);
  return parseAuthResponse(responseUrl, requestState);
}

async function startLogin(options = {}) {
  const requestState = randomStateValue();
  const extraParams = options.extraParams || {};
  const interactive = options.interactive !== false;
  const allowFallback = options.allowFallback !== false;
  const useLoginHelper = interactive && options.useLoginHelper !== false;

  log("Starting IMS auth flow", { interactive, allowFallback, useLoginHelper, extraParams });

  if (useLoginHelper) {
    try {
      return await runLoginHelperFlow(requestState, extraParams);
    } catch (error) {
      const message = error?.message || String(error);
      const normalizedMessage = String(message).toLowerCase();
      log("Login helper auth flow failed", message);

      const userClosedLoginWindow =
        normalizedMessage.includes("closed before completion") ||
        normalizedMessage.includes("login was canceled") ||
        normalizedMessage.includes("login was cancelled");
      if (userClosedLoginWindow || !allowFallback) {
        throw error;
      }
    }
  }

  let authData;
  try {
    authData = await runIdentityWebAuthFlow(requestState, extraParams, interactive);
  } catch (error) {
    log("Identity auth flow failed", error?.message || String(error));
    if (!(allowFallback && interactive && shouldUseAuthWindowFallback(error))) {
      throw error;
    }
    log("Falling back to popup auth window flow");
    authData = await runLegacyAuthWindowFlow(requestState, extraParams);
  }

  return authData;
}

function buildImsProfileHeaders(accessToken = "", clientId = "") {
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=utf-8",
  };

  const normalizedClientId = String(clientId || "").trim();
  if (normalizedClientId) {
    headers["X-IMS-ClientId"] = normalizedClientId;
    headers["x-api-key"] = normalizedClientId;
    headers.client_id = normalizedClientId;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function getProfileIdentityValue(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return "";
  }

  return firstNonEmptyString([
    profilePayload?.userId,
    profilePayload?.user_id,
    profilePayload?.sub,
    profilePayload?.id,
  ]);
}

function isImsAvatarForIdentity(candidate, identityValue) {
  const normalized = normalizeAvatarCandidate(candidate);
  const identity = String(identityValue || "").trim();
  if (!normalized || !identity || !isImsAvatarDownloadUrl(normalized)) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    const match = parsed.pathname.match(/\/ims\/avatar\/download\/([^/?#]+)/i);
    if (!match) {
      return false;
    }

    const decodedIdentity = decodeURIComponent(String(match[1] || "")).trim();
    return decodedIdentity === identity;
  } catch {
    return false;
  }
}

function isSyntheticIdentityAvatarCandidate(profilePayload, candidate) {
  const identity = getProfileIdentityValue(profilePayload);
  if (!identity) {
    return false;
  }
  return isImsAvatarForIdentity(candidate, identity);
}

function getNonSyntheticProfileAvatarCandidates(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return [];
  }

  const allCandidates = [
    ...getProfileInlineAvatarDataCandidates(profilePayload),
    ...getProfileAvatarCandidates(profilePayload),
    ...collectAvatarCandidatesFromProfileShape(profilePayload),
  ]
    .map((value) => normalizeAvatarCandidate(value) || normalizeInlineAvatarData(value))
    .filter(Boolean);

  const unique = [...new Set(allCandidates)];
  const nonSynthetic = unique.filter((candidate) => !isSyntheticIdentityAvatarCandidate(profilePayload, candidate));
  return prioritizeAvatarCandidates(nonSynthetic);
}

function getBestNonSyntheticProfileAvatarCandidate(profilePayload) {
  return getNonSyntheticProfileAvatarCandidates(profilePayload)[0] || "";
}

function scoreProfileAvatarPayload(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return Number.NEGATIVE_INFINITY;
  }

  const nonSyntheticCandidates = getNonSyntheticProfileAvatarCandidates(profilePayload);
  if (nonSyntheticCandidates.length === 0) {
    const fallbackCandidates = getProfileAvatarCandidates(profilePayload).filter(Boolean);
    return fallbackCandidates.length > 0 ? -20 : -100;
  }

  const bestCandidateScore = nonSyntheticCandidates
    .slice(0, 10)
    .reduce((bestScore, candidate) => Math.max(bestScore, scoreAvatarCandidatePriority(candidate)), -100);
  return bestCandidateScore + Math.min(nonSyntheticCandidates.length, 10) * 4;
}

function normalizeProfileAvatarFields(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return profilePayload;
  }

  const inlineAvatar = getProfileInlineAvatarDataUrl(profilePayload);
  const directAvatar = normalizeAvatarCandidate(
    firstNonEmptyString([
      profilePayload?.user_image_url,
      profilePayload?.userImageUrl,
      profilePayload?.avatar,
      profilePayload?.avatarUrl,
      profilePayload?.avatar_url,
      profilePayload?.additional_info?.user_image_url,
      profilePayload?.additional_info?.userImageUrl,
      profilePayload?.additional_info?.avatar,
      profilePayload?.additional_info?.avatarUrl,
      profilePayload?.additional_info?.avatar_url,
    ])
  );
  const discoveredAvatar = getBestNonSyntheticProfileAvatarCandidate(profilePayload);
  const avatar = directAvatar || inlineAvatar || discoveredAvatar;
  if (!avatar) {
    return profilePayload;
  }

  if (!profilePayload.user_image_url) {
    profilePayload.user_image_url = avatar;
  }
  if (!profilePayload.userImageUrl) {
    profilePayload.userImageUrl = avatar;
  }
  if (!profilePayload.avatar && !profilePayload.avatarUrl && !profilePayload.avatar_url) {
    profilePayload.avatarUrl = avatar;
  }
  return profilePayload;
}

async function fetchProfile(accessToken) {
  const endpoints = [
    ...IMS_PROFILE_CLIENT_IDS.map((clientId) => ({
      url: `${IMS_PROFILE_URL}?client_id=${encodeURIComponent(clientId)}`,
      clientId,
    })),
    {
      url: IMS_PROFILE_URL,
      clientId: "",
    },
  ];

  let lastError = null;
  let bestPayload = null;
  let bestPayloadScore = Number.NEGATIVE_INFINITY;
  for (const endpoint of endpoints) {
    const attempts = [
      { credentials: "omit" },
      { credentials: "include" },
    ];

    for (const attempt of attempts) {
      try {
        const response = await fetch(endpoint.url, {
          method: "GET",
          mode: "cors",
          credentials: attempt.credentials,
          headers: buildImsProfileHeaders(accessToken, endpoint.clientId),
        });

        const text = await response.text().catch(() => "");
        if (!response.ok) {
          lastError = new Error(
            `Profile request failed (${response.status} ${response.statusText})${
              text ? ` - ${normalizeHttpErrorMessage(text)}` : ""
            }`
          );
          continue;
        }

        const parsed = parseJsonText(text, null);
        if (!parsed || typeof parsed !== "object") {
          continue;
        }

        const normalizedPayload = normalizeProfileAvatarFields(parsed);
        const payloadScore = scoreProfileAvatarPayload(normalizedPayload);
        if (payloadScore > bestPayloadScore) {
          bestPayload = normalizedPayload;
          bestPayloadScore = payloadScore;
        }
        if (payloadScore >= 320) {
          return normalizedPayload;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  if (bestPayload) {
    return bestPayload;
  }

  throw lastError || new Error("Profile request failed.");
}

async function resolveProfileAfterLogin(authData) {
  const hasInlineProfile = Boolean(authData && Object.prototype.hasOwnProperty.call(authData, "profile"));
  if (hasInlineProfile) {
    if (authData?.profile && typeof authData.profile === "object") {
      return normalizeProfileAvatarFields(authData.profile);
    }
    return {};
  }

  return fetchProfile(authData?.accessToken || "");
}

function mergeProfilePayloads(baseProfile, updateProfile) {
  const base = baseProfile && typeof baseProfile === "object" ? baseProfile : {};
  const update = updateProfile && typeof updateProfile === "object" ? updateProfile : {};
  return {
    ...base,
    ...update,
    additional_info: {
      ...(base.additional_info && typeof base.additional_info === "object" ? base.additional_info : {}),
      ...(update.additional_info && typeof update.additional_info === "object" ? update.additional_info : {}),
    },
  };
}

async function fetchImsSessionProfile(accessToken = "") {
  const imsBase = IMS_AUTHORIZE_URL.split("/ims/")[0];
  const endpoints = [
    `${IMS_PROFILE_URL}?client_id=AdobePass1`,
    `${IMS_PROFILE_URL}?client_id=${encodeURIComponent(IMS_CLIENT_ID)}`,
    IMS_PROFILE_URL,
    `${imsBase}/ims/userinfo/v2`,
    `${imsBase}/ims/check/v6/status?client_id=AdobePass1`,
    `${imsBase}/ims/check/v6/status?client_id=${encodeURIComponent(IMS_CLIENT_ID)}`,
    `${imsBase}/ims/check/v5/status?client_id=AdobePass1&locale=en_US`,
    `${imsBase}/ims/check/status?client_id=AdobePass1`,
  ];

  const variants = [];
  const dedupeKeys = new Set();
  const pushVariant = (clientId, credentials, includeToken) => {
    const headers = buildImsProfileHeaders(includeToken ? accessToken : "", clientId);
    const key = `${clientId}|${credentials}|${includeToken ? "token" : "notoken"}`;
    if (dedupeKeys.has(key)) {
      return;
    }
    dedupeKeys.add(key);
    variants.push({ credentials, headers });
  };

  for (const clientId of IMS_PROFILE_CLIENT_IDS) {
    pushVariant(clientId, "include", false);
    if (accessToken) {
      pushVariant(clientId, "omit", true);
      pushVariant(clientId, "include", true);
    }
  }

  pushVariant("", "include", false);
  if (accessToken) {
    pushVariant("", "omit", true);
    pushVariant("", "include", true);
  }

  let bestPayload = null;
  let bestPayloadScore = Number.NEGATIVE_INFINITY;
  for (const endpoint of endpoints) {
    for (const variant of variants) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          mode: "cors",
          credentials: variant.credentials,
          headers: variant.headers,
        });
        if (!response.ok) {
          continue;
        }

        const text = await response.text().catch(() => "");
        const parsed = parseJsonText(text, null);
        if (!parsed || typeof parsed !== "object") {
          continue;
        }

        const normalizedPayload = normalizeProfileAvatarFields(parsed);
        const payloadScore = scoreProfileAvatarPayload(normalizedPayload);
        if (payloadScore > bestPayloadScore) {
          bestPayload = normalizedPayload;
          bestPayloadScore = payloadScore;
        }
        if (payloadScore >= 320) {
          return normalizedPayload;
        }
      } catch {
        // Continue to next endpoint/variant.
      }
    }
  }

  return bestPayload;
}

async function fetchOrganizations(accessToken) {
  const response = await fetch(IMS_ORGS_URL, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Organizations request failed (${response.status} ${response.statusText})${body ? ` - ${body}` : ""}`);
  }

  return response.json();
}

function collectObjects(value, output = []) {
  if (!value) {
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectObjects(item, output);
    }
    return output;
  }

  if (typeof value === "object") {
    output.push(value);
    for (const nestedValue of Object.values(value)) {
      if (nestedValue && (Array.isArray(nestedValue) || typeof nestedValue === "object")) {
        collectObjects(nestedValue, output);
      }
    }
  }

  return output;
}

function flattenOrganizations(payload) {
  const objects = collectObjects(payload, []);
  const seen = new Set();
  const flattened = [];

  for (const org of objects) {
    const key = JSON.stringify(org);
    if (!seen.has(key)) {
      seen.add(key);
      flattened.push(org);
    }
  }

  return flattened;
}

function extractOrgId(org) {
  const candidates = [
    org?.orgId,
    org?.organizationId,
    org?.organization_id,
    org?.tenantId,
    org?.imsOrgId,
    org?.id,
  ];
  return candidates.find((value) => value !== undefined && value !== null && value !== "") || null;
}

function extractUserId(org) {
  const candidates = [
    org?.userId,
    org?.user_id,
    org?.profileId,
    org?.profile_id,
    org?.accountId,
    org?.account_id,
  ];
  return candidates.find((value) => value !== undefined && value !== null && value !== "") || null;
}

function extractOrgName(org) {
  const candidates = [
    org?.orgName,
    org?.organizationName,
    org?.organization_name,
    org?.displayName,
    org?.display_name,
    org?.name,
  ];
  return candidates.find((value) => typeof value === "string" && value.trim()) || "";
}

function extractOrgAvatarUrl(org) {
  const candidates = [
    org?.logo,
    org?.logoUrl,
    org?.logo_url,
    org?.tenantLogo,
    org?.tenantLogoUrl,
    org?.tenant_logo,
    org?.tenant_logo_url,
    org?.companyLogo,
    org?.companyLogoUrl,
    org?.company_logo,
    org?.company_logo_url,
    org?.organizationLogo,
    org?.organizationLogoUrl,
    org?.organization_logo,
    org?.organization_logo_url,
    org?.orgLogo,
    org?.orgLogoUrl,
    org?.org_logo,
    org?.org_logo_url,
    org?.avatar,
    org?.avatarUrl,
    org?.avatar_url,
    org?.image,
    org?.imageUrl,
    org?.image_url,
    org?.icon,
    org?.iconUrl,
    org?.icon_url,
    org?.links?.logo?.href,
    org?.links?.avatar?.href,
    org?.links?.icon?.href,
  ];

  return (
    candidates.find((value) => typeof value === "string" && /^https?:\/\//i.test(value)) || ""
  );
}

function objectContainsAdobePass(value) {
  return objectContainsText(value, ADOBEPASS_ORG_KEYWORD);
}

function objectContainsText(value, keyword) {
  if (!value) {
    return false;
  }

  try {
    return JSON.stringify(value).toLowerCase().includes(String(keyword || "").toLowerCase());
  } catch {
    return false;
  }
}

function isOrgIdAllowed(orgId) {
  if (!orgId || ADOBEPASS_ORG_ID_ALLOWLIST.length === 0) {
    return false;
  }
  return ADOBEPASS_ORG_ID_ALLOWLIST.includes(String(orgId));
}

function matchesAdobePassOrg(org) {
  const orgId = extractOrgId(org);
  return isOrgIdAllowed(orgId) || objectContainsAdobePass(org);
}

function findAdobePassOrg(organizations) {
  return organizations.find((org) => matchesAdobePassOrg(org)) || null;
}

function findProfileOrgAvatar(profile, org) {
  if (!profile || typeof profile !== "object") {
    return "";
  }

  const orgId = extractOrgId(org);
  const orgName = extractOrgName(org);
  const objects = collectObjects(profile, []);

  for (const object of objects) {
    const matches =
      (orgId && objectContainsText(object, orgId)) ||
      (orgName && objectContainsText(object, orgName)) ||
      objectContainsAdobePass(object);

    if (!matches) {
      continue;
    }

    const avatar = extractOrgAvatarUrl(object);
    if (avatar) {
      return avatar;
    }
  }

  return "";
}

function toAdobePassOrgDescriptor(org, profile = null) {
  if (!org || typeof org !== "object") {
    return null;
  }

  const explicitOrgAvatar = extractOrgAvatarUrl(org);
  const profileOrgAvatar = explicitOrgAvatar ? "" : findProfileOrgAvatar(profile, org);

  return {
    orgId: extractOrgId(org),
    userId: extractUserId(org),
    name: extractOrgName(org),
    avatarUrl: explicitOrgAvatar || profileOrgAvatar || "",
  };
}

function buildOrgSwitchStrategies(orgValue) {
  if (!orgValue) {
    return [];
  }

  const source = orgValue.raw && typeof orgValue.raw === "object" ? orgValue.raw : orgValue;
  const orgId = firstNonEmptyString([toEntryValueString(orgValue.orgId), toEntryValueString(extractOrgId(source))]);
  const userId = firstNonEmptyString([toEntryValueString(orgValue.userId), toEntryValueString(extractUserId(source))]);
  const orgName = firstNonEmptyString([toEntryValueString(orgValue.name), toEntryValueString(extractOrgName(source))]);
  const isAdobePass = orgValue.isAdobePass === true || matchesAdobePassOrg(source);
  const strategyCandidates = [
    { organization_id: orgId },
    { organization: orgId },
    { organization_id: orgId, user_id: userId },
    { organization: orgId, user_id: userId },
    { organization: orgName },
    isAdobePass ? { organization: ADOBEPASS_ORG_HANDLE } : null,
    isAdobePass ? { organization_id: orgId, organization: ADOBEPASS_ORG_HANDLE, user_id: userId } : null,
    { user_id: userId },
  ];

  const seen = new Set();
  const strategies = [];
  for (const candidate of strategyCandidates) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }

    const cleaned = Object.fromEntries(
      Object.entries(candidate).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
    const key = JSON.stringify(cleaned);
    if (key !== "{}" && !seen.has(key)) {
      seen.add(key);
      strategies.push(cleaned);
    }
  }
  return strategies;
}

function createRestrictedOrgOption(org, index = 0) {
  const descriptor = toAdobePassOrgDescriptor(org) || {};
  const isAdobePass = matchesAdobePassOrg(org);
  const orgId = toEntryValueString(descriptor.orgId);
  const userId = toEntryValueString(descriptor.userId);
  const name = firstNonEmptyString([descriptor.name, isAdobePass ? "@AdobePass" : ""]);
  const keyBase = [orgId, userId, name.toLowerCase()].join("::");
  const key = keyBase || `org-index-${index}`;
  const labelSegments = [];
  if (name) {
    labelSegments.push(name);
  }
  if (orgId) {
    labelSegments.push(orgId);
  }
  if (userId) {
    labelSegments.push(`user ${userId}`);
  }

  return {
    key,
    label: labelSegments.join(" | ") || `Organization ${index + 1}`,
    orgId,
    userId,
    name,
    isAdobePass,
    raw: org,
  };
}

function buildRestrictedOrgOptions(organizations) {
  if (!Array.isArray(organizations) || organizations.length === 0) {
    return [];
  }

  const options = [];
  const seenKeys = new Set();
  organizations.forEach((org, index) => {
    const option = createRestrictedOrgOption(org, index);
    if (!option.orgId && !option.userId && !option.name && !option.isAdobePass) {
      return;
    }
    if (seenKeys.has(option.key)) {
      return;
    }
    seenKeys.add(option.key);
    options.push(option);
  });

  options.sort((left, right) => {
    if (left.isAdobePass !== right.isAdobePass) {
      return left.isAdobePass ? -1 : 1;
    }
    return left.label.localeCompare(right.label);
  });

  return options;
}

function updateRestrictedOrgOptions(organizations, preferredOrg = null) {
  const options = buildRestrictedOrgOptions(organizations);
  state.restrictedOrgOptions = options;

  if (options.length === 0) {
    state.selectedRestrictedOrgKey = "";
    return;
  }

  const preferredDescriptor = preferredOrg ? toAdobePassOrgDescriptor(preferredOrg) : null;
  const preferredKey =
    preferredDescriptor && typeof preferredDescriptor === "object"
      ? [toEntryValueString(preferredDescriptor.orgId), toEntryValueString(preferredDescriptor.userId), toEntryValueString(preferredDescriptor.name).toLowerCase()].join("::")
      : "";

  if (preferredKey && options.some((option) => option.key === preferredKey)) {
    state.selectedRestrictedOrgKey = preferredKey;
    return;
  }

  if (state.selectedRestrictedOrgKey && options.some((option) => option.key === state.selectedRestrictedOrgKey)) {
    return;
  }

  state.selectedRestrictedOrgKey = options[0].key;
}

function clearRestrictedOrgOptions() {
  state.restrictedOrgOptions = [];
  state.selectedRestrictedOrgKey = "";
  state.restrictedOrgSwitchBusy = false;
  state.restrictedLoginLabel = "";
  state.restrictedOrgLabel = "";
  state.restrictedRecoveryLabel = "";
}

function getSelectedRestrictedOrgOption() {
  return state.restrictedOrgOptions.find((option) => option.key === state.selectedRestrictedOrgKey) || null;
}

function getProfileDisplayNameRaw(profile) {
  const direct = firstNonEmptyString([profile?.displayName, profile?.fullName, profile?.full_name, profile?.name]);
  if (direct) {
    return direct;
  }

  const firstName = firstNonEmptyString([profile?.firstName, profile?.first_name]);
  const lastName = firstNonEmptyString([profile?.lastName, profile?.last_name]);
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function updateRestrictedContext(sessionData, options = {}) {
  const profile = resolveLoginProfile(sessionData);
  const displayName = getProfileDisplayNameRaw(profile);
  const email = getProfileEmail(profile);
  const loginLabel = firstNonEmptyString([displayName, email])
    ? `Signed in as ${firstNonEmptyString([displayName, email])}${displayName && email ? ` (${email})` : ""}`
    : "Sign-in state is unknown.";

  const orgFromProfile = firstNonEmptyString([
    profile?.organizationName,
    profile?.organization_name,
    profile?.orgName,
    profile?.org_name,
    profile?.tenantName,
    profile?.tenant_name,
    profile?.companyName,
    profile?.company_name,
    profile?.additional_info?.organizationName,
    profile?.additional_info?.organization_name,
    profile?.additional_info?.orgName,
    profile?.additional_info?.org_name,
    profile?.additional_info?.tenantName,
    profile?.additional_info?.tenant_name,
    profile?.additional_info?.companyName,
    profile?.additional_info?.company_name,
  ]);
  const selectedOption = getSelectedRestrictedOrgOption();
  const orgLabel = firstNonEmptyString([
    options.orgLabel,
    orgFromProfile,
    selectedOption?.label,
    options.fallbackOrgLabel,
    "Unknown org profile",
  ]);

  const recoveryLabel = firstNonEmptyString([
    options.recoveryLabel,
    state.restrictedRecoveryLabel,
    "Auto-switch attempted but AdobePass access is still denied.",
  ]);

  state.restrictedLoginLabel = loginLabel;
  state.restrictedOrgLabel = `Detected org: ${orgLabel}`;
  state.restrictedRecoveryLabel = recoveryLabel;
}

function isLikelyUrlWithoutScheme(value) {
  if (typeof value !== "string") {
    return false;
  }
  return /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(value.trim());
}

function isLikelyImageAssetPath(value) {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().replace(/^\.?\//, "");
  if (!normalized || /\s/.test(normalized)) {
    return false;
  }

  return (
    normalized === DEFAULT_AVATAR ||
    normalized === FALLBACK_AVATAR_ASSET ||
    /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(normalized)
  );
}

function isLikelyImsAvatarId(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!/^[a-z0-9_-]{8,}$/i.test(trimmed)) {
    return false;
  }

  // Common IDs and handles that are not avatar download IDs.
  if (/^@/.test(trimmed) || /@adobeorg$/i.test(trimmed)) {
    return false;
  }

  return true;
}

function normalizeAvatarCandidate(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "");
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("data:image/")) {
    return normalizeInlineAvatarData(trimmed);
  }

  if (trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("chrome-extension://") || trimmed.startsWith("moz-extension://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (/^ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_AUTHORIZE_URL.split("/ims/")[0]}/${trimmed}`;
  }

  if (/^avatar\/download\//i.test(trimmed)) {
    return `${IMS_AUTHORIZE_URL.split("/ims/")[0]}/ims/${trimmed}`;
  }

  if (/^\/ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_AUTHORIZE_URL.split("/ims/")[0]}${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${IMS_AUTHORIZE_URL.split("/ims/")[0]}${trimmed}`;
  }

  if (!trimmed.includes("://")) {
    if (isLikelyUrlWithoutScheme(trimmed)) {
      return `https://${trimmed}`;
    }

    if (isLikelyImsAvatarId(trimmed)) {
      return `${IMS_AUTHORIZE_URL.split("/ims/")[0]}/ims/avatar/download/${encodeURIComponent(trimmed)}`;
    }

    if (!isLikelyImageAssetPath(trimmed)) {
      return "";
    }

    try {
      return chrome.runtime.getURL(trimmed);
    } catch {
      return "";
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "chrome-extension:" && parsed.protocol !== "moz-extension:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function isPpsProfileImageUrl(url) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return /(^|\.)pps\.services\.adobe\.com$/i.test(parsed.hostname) && /\/api\/profile\/[^/]+\/image(\/|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function toPpsProfileImageSizeUrl(url, size) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized || !isPpsProfileImageUrl(normalized) || !Number.isFinite(size) || size <= 0) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    const nextSize = String(Math.floor(size));
    const withTrailingSize = parsed.pathname.replace(/\/(\d+)(\/?)$/i, `/${nextSize}$2`);

    if (withTrailingSize !== parsed.pathname) {
      parsed.pathname = withTrailingSize;
      return parsed.toString();
    }

    parsed.pathname = `${parsed.pathname.replace(/\/?$/, "")}/${nextSize}`;
    return parsed.toString();
  } catch {
    return normalized;
  }
}

function scoreAvatarCandidatePriority(value) {
  const normalized = normalizeAvatarCandidate(value) || normalizeInlineAvatarData(value);
  if (!normalized) {
    return -1000;
  }

  const lower = normalized.toLowerCase();
  if (
    normalized === FALLBACK_AVATAR ||
    /underpar(?:-round)?-[0-9]+\.png$/i.test(lower) ||
    /underpar(?:-round)?\.ico$/i.test(lower)
  ) {
    return -200;
  }

  if (normalized.startsWith("data:image/")) {
    return 420;
  }
  if (normalized.startsWith("blob:")) {
    return 390;
  }
  if (normalized.startsWith("chrome-extension://") || normalized.startsWith("moz-extension://")) {
    return 320;
  }

  let score = 0;
  if (isPpsProfileImageUrl(normalized)) {
    score += 340;
  }
  if (isImsAvatarDownloadUrl(normalized)) {
    score += 280;
  } else if (/\/ims\/avatar\//i.test(normalized)) {
    score += 220;
  }
  if (/avatar|profile|picture|photo|image/i.test(normalized)) {
    score += 24;
  }
  if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(normalized)) {
    score += 12;
  }
  if (/^https:\/\//i.test(normalized)) {
    score += 4;
  }

  return score;
}

function prioritizeAvatarCandidates(values) {
  const normalized = [
    ...new Set((values || []).map((value) => normalizeAvatarCandidate(value) || normalizeInlineAvatarData(value)).filter(Boolean)),
  ];
  return normalized
    .map((value, index) => ({
      value,
      index,
      score: scoreAvatarCandidatePriority(value),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((entry) => entry.value);
}

function inferImageMimeTypeFromBuffer(buffer) {
  if (!buffer) {
    return "";
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (!bytes || bytes.length < 2) {
    return "";
  }

  const hasPrefix = (prefix) => {
    if (!Array.isArray(prefix) || bytes.length < prefix.length) {
      return false;
    }
    for (let index = 0; index < prefix.length; index += 1) {
      if (bytes[index] !== prefix[index]) {
        return false;
      }
    }
    return true;
  };

  if (hasPrefix([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (hasPrefix([0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }
  if (hasPrefix([0x47, 0x49, 0x46, 0x38])) {
    return "image/gif";
  }
  if (hasPrefix([0x42, 0x4d])) {
    return "image/bmp";
  }

  if (bytes.length >= 12) {
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (riff === "RIFF" && webp === "WEBP") {
      return "image/webp";
    }
  }

  if (bytes.length >= 12) {
    const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (ftyp === "ftyp" && (brand === "avif" || brand === "avis")) {
      return "image/avif";
    }
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, Math.min(bytes.length, 512)));
    if (/<svg[\s>]/i.test(text)) {
      return "image/svg+xml";
    }
  } catch {
    // Ignore text decoding errors for binary payloads.
  }

  return "";
}

function normalizeInlineAvatarData(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const normalizeBase64 = (base64Value) => String(base64Value || "").replace(/\s+/g, "");
  const inferMimeType = (normalizedBase64) => {
    if (!normalizedBase64) {
      return "";
    }
    if (normalizedBase64.startsWith("iVBOR")) {
      return "image/png";
    }
    if (normalizedBase64.startsWith("/9j/")) {
      return "image/jpeg";
    }
    if (normalizedBase64.startsWith("R0lGOD")) {
      return "image/gif";
    }
    if (normalizedBase64.startsWith("UklGR")) {
      return "image/webp";
    }
    if (normalizedBase64.startsWith("Qk")) {
      return "image/bmp";
    }
    if (normalizedBase64.startsWith("PHN2Zy")) {
      return "image/svg+xml";
    }
    return "";
  };

  const looksLikeBase64Image = (normalizedBase64) => {
    if (!normalizedBase64 || normalizedBase64.length < 64) {
      return false;
    }
    if (!/^[A-Za-z0-9+/=_-]+$/.test(normalizedBase64)) {
      return false;
    }
    return Boolean(inferMimeType(normalizedBase64));
  };

  const looksLikeBase64Payload = (normalizedBase64) => {
    if (!normalizedBase64 || normalizedBase64.length < 64) {
      return false;
    }
    return /^[A-Za-z0-9+/=_-]+$/.test(normalizedBase64);
  };

  if (/^data:/i.test(trimmed)) {
    const match = trimmed.match(/^data:([^;,]+);base64,(.+)$/i);
    if (!match) {
      return "";
    }

    const rawMime = String(match[1] || "").trim().toLowerCase();
    const normalizedBase64 = normalizeBase64(match[2]);
    const inferredMime = inferMimeType(normalizedBase64);
    const mime = /^image\//i.test(rawMime) ? rawMime : inferredMime;
    const isImageMime = /^image\//i.test(mime);
    const validPayload = isImageMime ? looksLikeBase64Payload(normalizedBase64) : looksLikeBase64Image(normalizedBase64);
    if (!normalizedBase64 || !mime || !validPayload) {
      return "";
    }
    return `data:${mime};base64,${normalizedBase64}`;
  }

  const normalizedBase64 = normalizeBase64(trimmed);
  if (!looksLikeBase64Image(normalizedBase64)) {
    return "";
  }

  const mime = inferMimeType(normalizedBase64) || "image/png";
  return `data:${mime};base64,${normalizedBase64}`;
}

function collectInlineAvatarDataCandidatesFromShape(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const candidates = [];
  const seenObjects = new WeakSet();
  const queue = [{ current: value, depth: 0 }];

  while (queue.length > 0) {
    const { current, depth } = queue.shift();
    if (!current || typeof current !== "object" || seenObjects.has(current) || depth > 4) {
      continue;
    }
    seenObjects.add(current);

    if (Array.isArray(current)) {
      const limit = Math.min(current.length, 32);
      for (let index = 0; index < limit; index += 1) {
        const item = current[index];
        if (item && typeof item === "object") {
          queue.push({ current: item, depth: depth + 1 });
        }
      }
      continue;
    }

    for (const [key, entry] of Object.entries(current)) {
      if (entry && typeof entry === "object") {
        queue.push({ current: entry, depth: depth + 1 });
        continue;
      }

      if (typeof entry !== "string") {
        continue;
      }

      const keyLooksRelevant = /avatar|photo|picture|image|thumbnail|icon/i.test(key);
      if (!keyLooksRelevant && !/^data:image\//i.test(entry.trim())) {
        continue;
      }

      const normalized = normalizeInlineAvatarData(entry);
      if (normalized) {
        candidates.push(normalized);
      }
    }
  }

  return [...new Set(candidates)];
}

function getProfileInlineAvatarDataCandidates(profile) {
  if (!profile || typeof profile !== "object") {
    return [];
  }

  const explicitCandidates = [
    profile?.user_image,
    profile?.userImage,
    profile?.additional_info?.user_image,
    profile?.additional_info?.userImage,
    profile?.avatar_data,
    profile?.avatarData,
    profile?.additional_info?.avatar_data,
    profile?.additional_info?.avatarData,
    profile?.picture_data,
    profile?.additional_info?.picture_data,
    profile?.images?.avatar?.data,
    profile?.images?.profile?.data,
  ]
    .map((value) => normalizeInlineAvatarData(value))
    .filter(Boolean);

  const discoveredCandidates = collectInlineAvatarDataCandidatesFromShape(profile);
  return [...new Set([...explicitCandidates, ...discoveredCandidates])];
}

function getProfileInlineAvatarDataUrl(profile) {
  return getProfileInlineAvatarDataCandidates(profile)[0] || "";
}

function toImsAvatarDownloadUrl(identity, size = 128) {
  const raw = String(identity || "").trim();
  if (!raw) {
    return "";
  }

  const normalized = normalizeAvatarCandidate(raw);
  if (normalized) {
    return normalized;
  }

  const imsBase = IMS_AUTHORIZE_URL.split("/ims/")[0];
  const encoded = encodeURIComponent(raw);
  const sizePart = Number.isFinite(size) && size > 0 ? `?size=${encodeURIComponent(String(size))}` : "";
  return `${imsBase}/ims/avatar/download/${encoded}${sizePart}`;
}

function extractProfileImageUrl(profile) {
  const direct = firstNonEmptyString([
    profile?.user_image_url,
    profile?.userImageUrl,
    profile?.additional_info?.user_image_url,
    profile?.additional_info?.userImageUrl,
    profile?.avatar,
    profile?.avatarUrl,
    profile?.avatar_url,
    profile?.additional_info?.avatar,
    profile?.additional_info?.avatarUrl,
    profile?.additional_info?.avatar_url,
    profile?.picture,
    profile?.photo,
  ]);

  const normalized = normalizeAvatarCandidate(direct);
  if (normalized) {
    return normalized;
  }

  const identityFallback = firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    profile?.id,
  ]);

  return toImsAvatarDownloadUrl(identityFallback);
}

function resolveLoginProfile(loginData) {
  return loginData?.profile || loginData?.userProfile || null;
}

function resolveLoginImageUrl(loginData) {
  const direct = normalizeAvatarCandidate(
    firstNonEmptyString([
      loginData?.imageUrl,
      loginData?.user_image_url,
      loginData?.userImageUrl,
      loginData?.avatarUrl,
      loginData?.avatar_url,
    ])
  );
  if (direct) {
    return direct;
  }

  const inlineLoginCandidate = normalizeInlineAvatarData(
    firstNonEmptyString([
      loginData?.user_image,
      loginData?.userImage,
      loginData?.avatarData,
      loginData?.avatar_data,
    ])
  );
  if (inlineLoginCandidate) {
    return inlineLoginCandidate;
  }

  const profile = resolveLoginProfile(loginData) || {};
  const inlineProfileCandidate = getProfileInlineAvatarDataUrl(profile);
  if (inlineProfileCandidate) {
    return inlineProfileCandidate;
  }

  return extractProfileImageUrl(profile);
}

function getProfileAvatarCandidates(profile) {
  const inlineDataCandidates = getProfileInlineAvatarDataCandidates(profile);
  const candidates = [
    profile?.additional_info?.user_image_url,
    profile?.additional_info?.user_image,
    profile?.additional_info?.userImageUrl,
    profile?.additional_info?.userImage,
    profile?.additional_info?.user_picture,
    profile?.additional_info?.picture_url,
    profile?.additional_info?.userPhotoUrl,
    profile?.additional_info?.profile_picture,
    profile?.additional_info?.avatar,
    profile?.additional_info?.avatar_url,
    profile?.additional_info?.avatarUrl,
    profile?.additional_info?.picture,
    profile?.user_image_url,
    profile?.user_image,
    profile?.userImageUrl,
    profile?.userImage,
    profile?.userPhotoUrl,
    profile?.profilePicture,
    profile?.avatar,
    profile?.avatarUrl,
    profile?.avatar_url,
    profile?.picture,
    profile?.photo,
    profile?.photo_url,
    profile?.thumbnailUrl,
    profile?.thumbnail_url,
    profile?.user?.avatar,
    profile?.user?.avatarUrl,
    profile?.profile?.avatar,
    profile?.profile?.avatarUrl,
    profile?.profile?.picture,
    profile?.profile?.photo,
    profile?.imageUrl,
    profile?.images?.avatar?.url,
    profile?.images?.avatar?.href,
    profile?.images?.profile?.url,
    profile?.images?.profile?.href,
    profile?.photo?.url,
    profile?.photo?.href,
  ];

  const identityCandidate = firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    profile?.id,
  ]);
  const identityAvatarUrl = toImsAvatarDownloadUrl(identityCandidate);
  if (identityAvatarUrl) {
    // Keep user_image_url/avatar fields first; use userId-derived endpoint as fallback only.
    candidates.push(identityAvatarUrl);
  }

  const normalized = [
    ...inlineDataCandidates,
    ...candidates.map((value) => normalizeAvatarCandidate(value)).filter(Boolean),
  ];
  return [...new Set(normalized)];
}

function getProfileAvatarUrl(profile) {
  return getProfileAvatarCandidates(profile)[0] || "";
}

function appendAvatarSize(url, size) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return url;
  }

  if (!Number.isFinite(size) || size <= 0) {
    return url;
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("size", String(size));
    return parsed.toString();
  } catch {
    return url;
  }
}

function collectAvatarCandidatesFromProfileShape(profile) {
  if (!profile || typeof profile !== "object") {
    return [];
  }

  const scoredCandidates = [];
  const seenObjects = new WeakSet();
  const stack = [profile];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object" || seenObjects.has(current)) {
      continue;
    }
    seenObjects.add(current);

    if (Array.isArray(current)) {
      for (const item of current) {
        if (item && typeof item === "object") {
          stack.push(item);
        } else if (typeof item === "string") {
          const normalized = normalizeAvatarCandidate(item);
          if (
            normalized &&
            (/\/ims\/avatar\//i.test(normalized) || /avatar|photo|picture|image/i.test(normalized))
          ) {
            const score = /\/ims\/avatar\/download\//i.test(normalized) ? 80 : 40;
            scoredCandidates.push({ url: normalized, score });
          }
        }
      }
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === "object") {
        stack.push(value);
        continue;
      }

      if (typeof value !== "string") {
        continue;
      }

      const normalized = normalizeAvatarCandidate(value);
      if (!normalized) {
        continue;
      }

      const keyLooksLikeAvatar = /avatar|photo|picture|image/i.test(key);
      const valueLooksLikeAvatar =
        /\/ims\/avatar\//i.test(normalized) ||
        /avatar|photo|picture|image/i.test(normalized) ||
        /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(normalized);

      if (keyLooksLikeAvatar || valueLooksLikeAvatar) {
        let score = 0;
        if (/user|person|profile|self/i.test(key)) {
          score += 30;
        }
        if (/avatar/i.test(key)) {
          score += 18;
        }
        if (/photo|picture|image/i.test(key)) {
          score += 12;
        }
        if (/\/ims\/avatar\/download\//i.test(normalized)) {
          score += 80;
        } else if (/\/ims\/avatar\//i.test(normalized)) {
          score += 50;
        } else if (/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(normalized)) {
          score += 22;
        }
        scoredCandidates.push({ url: normalized, score });
      }
    }
  }

  const bestScoreByUrl = new Map();
  for (const candidate of scoredCandidates) {
    const currentScore = bestScoreByUrl.get(candidate.url);
    if (currentScore === undefined || candidate.score > currentScore) {
      bestScoreByUrl.set(candidate.url, candidate.score);
    }
  }

  return [...bestScoreByUrl.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([url]) => url);
}

function getAvatarCandidates(loginData) {
  const candidates = [];
  const explicitLoginImageUrl = resolveLoginImageUrl(loginData);
  if (explicitLoginImageUrl) {
    candidates.push(explicitLoginImageUrl);
  }

  const loginProfile = resolveLoginProfile(loginData);
  const profileCandidates = getProfileAvatarCandidates(loginProfile);
  const discoveredProfileCandidates = collectAvatarCandidatesFromProfileShape(loginProfile);
  candidates.push(...profileCandidates);
  candidates.push(...discoveredProfileCandidates);

  const orgAvatar = normalizeAvatarCandidate(loginData?.adobePassOrg?.avatarUrl || "");
  if (orgAvatar) {
    candidates.push(orgAvatar);
  }

  if (loginData?.adobePassOrg) {
    candidates.push(FALLBACK_AVATAR);
  }

  candidates.push(DEFAULT_AVATAR);
  return [...new Set(candidates.filter(Boolean))];
}

function getAvatarUrl(loginData) {
  return getAvatarCandidates(loginData)[0] || DEFAULT_AVATAR;
}

function getAvatarRenderUrl(loginData) {
  const resolved = normalizeAvatarCandidate(state.avatarResolvedUrl);
  if (resolved) {
    return resolved;
  }

  const provisional = normalizeAvatarCandidate(resolveLoginImageUrl(loginData));
  if (provisional) {
    return provisional;
  }

  return FALLBACK_AVATAR;
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function getProfileDisplayName(profile) {
  const direct = firstNonEmptyString([profile?.displayName, profile?.fullName, profile?.full_name, profile?.name]);
  if (direct) {
    return direct;
  }

  const firstName = firstNonEmptyString([profile?.firstName, profile?.first_name]);
  const lastName = firstNonEmptyString([profile?.lastName, profile?.last_name]);
  const joined = [firstName, lastName].filter(Boolean).join(" ");
  return joined || "Adobe User";
}

function getProfileEmail(profile) {
  return firstNonEmptyString([
    profile?.email,
    profile?.user_email,
    profile?.emailAddress,
    profile?.mail,
    profile?.additional_info?.email,
  ]);
}

function getOrgDisplayName(loginData) {
  return firstNonEmptyString([loginData?.adobePassOrg?.name, ADOBEPASS_ORG_HANDLE]) || ADOBEPASS_ORG_HANDLE;
}

function toEntryValueString(value) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function flattenPrimitiveFields(value, prefix, output, options) {
  const { depth, maxDepth, maxEntries, seen } = options;
  if (output.length >= maxEntries || depth > maxDepth || value === null || value === undefined) {
    return;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const entryValue = toEntryValueString(value);
    if (entryValue) {
      output.push({ key: prefix || "value", value: entryValue });
    }
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return;
    }

    if (value.every((item) => ["string", "number", "boolean"].includes(typeof item))) {
      const joined = value.map((item) => String(item)).join(", ");
      if (joined) {
        output.push({ key: prefix || "value", value: joined });
      }
      return;
    }

    const limit = Math.min(value.length, 8);
    for (let index = 0; index < limit; index += 1) {
      flattenPrimitiveFields(value[index], `${prefix}[${index}]`, output, {
        depth: depth + 1,
        maxDepth,
        maxEntries,
        seen,
      });
      if (output.length >= maxEntries) {
        return;
      }
    }
    return;
  }

  if (typeof value !== "object") {
    return;
  }

  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
  for (const key of keys) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenPrimitiveFields(value[key], nextPrefix, output, {
      depth: depth + 1,
      maxDepth,
      maxEntries,
      seen,
    });
    if (output.length >= maxEntries) {
      return;
    }
  }
}

function formatAvatarCandidateForMenu(candidate) {
  const value = String(candidate || "").trim();
  if (!value) {
    return "";
  }
  if (/^data:image\//i.test(value)) {
    const header = value.slice(0, value.indexOf(",") + 1);
    return `${header}... [inline payload, ${value.length} chars]`;
  }
  return value;
}

function isLikelyProfileImageReference(value) {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }
  return (
    /^https?:\/\//i.test(text) ||
    /^\/\//.test(text) ||
    /^\/ims\/avatar\/download\//i.test(text) ||
    /^ims\/avatar\/download\//i.test(text) ||
    /^avatar\/download\//i.test(text) ||
    /^data:image\//i.test(text) ||
    /^blob:/i.test(text) ||
    /adobelogin\.com\/ims\/avatar\//i.test(text) ||
    /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(text)
  );
}

function collectProfileImageCandidatesForMenu(profile) {
  if (!profile || typeof profile !== "object") {
    return [];
  }

  const rawCandidates = [];
  const flattened = [];
  flattenPrimitiveFields(profile, "profile", flattened, {
    depth: 0,
    maxDepth: 4,
    maxEntries: 220,
    seen: new WeakSet(),
  });

  for (const entry of flattened) {
    if (!/avatar|photo|picture|image|thumbnail|icon/i.test(String(entry?.key || ""))) {
      continue;
    }
    if (isLikelyProfileImageReference(entry?.value)) {
      rawCandidates.push(String(entry.value).trim());
    }
  }

  const knownCandidates = getProfileAvatarCandidates(profile);
  const discoveredCandidates = collectAvatarCandidatesFromProfileShape(profile);
  const merged = [...new Set([...rawCandidates, ...knownCandidates, ...discoveredCandidates])];
  const normalized = [];
  const seen = new Set();

  const append = (value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) {
      return;
    }
    seen.add(text);
    normalized.push(text);
  };

  for (const candidate of merged) {
    append(candidate);
    const normalizedCandidate = normalizeAvatarCandidate(candidate) || normalizeInlineAvatarData(candidate);
    if (normalizedCandidate && normalizedCandidate !== candidate) {
      append(normalizedCandidate);
    }
  }

  return normalized.slice(0, 80);
}

function buildAvatarMenuEntries(loginData) {
  const profile = resolveLoginProfile(loginData) || {};
  const resolvedProfileImage = resolveLoginImageUrl(loginData);
  const profileImageLabel = resolvedProfileImage.startsWith("data:image/")
    ? "[inline image payload]"
    : resolvedProfileImage;
  const entries = [];
  const seenKeys = new Set();

  const pushEntry = (label, value, options = {}) => {
    const normalizedValue = toEntryValueString(value);
    if (!normalizedValue || seenKeys.has(label)) {
      return;
    }
    seenKeys.add(label);
    entries.push({
      key: label,
      value: normalizedValue,
      multiline: options.multiline === true,
    });
  };

  pushEntry("Name", getProfileDisplayName(profile));
  pushEntry("Email", getProfileEmail(profile));
  pushEntry("Organization", getOrgDisplayName(loginData));
  pushEntry("Organization ID", loginData?.adobePassOrg?.orgId);
  pushEntry("Profile Image URL", profileImageLabel);
  const allProfileImageCandidates = collectProfileImageCandidatesForMenu(profile);
  const allProfileImageLines =
    allProfileImageCandidates.length > 0
      ? allProfileImageCandidates.map((candidate) => formatAvatarCandidateForMenu(candidate))
      : ["No profile image URL candidates found in profile payload."];
  pushEntry("All Profile Image URLs", allProfileImageLines.join("\n"), { multiline: true });
  pushEntry("User ID", firstNonEmptyString([profile?.userId, profile?.user_id, profile?.sub, profile?.id]));
  pushEntry(
    "Account Type",
    firstNonEmptyString([profile?.account_type, profile?.additional_info?.account_type, profile?.additional_info?.projectedProductContext])
  );

  const flattened = [];
  flattenPrimitiveFields(profile, "profile", flattened, {
    depth: 0,
    maxDepth: 4,
    maxEntries: 80,
    seen: new WeakSet(),
  });

  for (const entry of flattened) {
    if (!seenKeys.has(entry.key)) {
      seenKeys.add(entry.key);
      entries.push(entry);
    }
  }

  return entries;
}

function getAvatarCacheIdentity(loginData) {
  const profile = resolveLoginProfile(loginData) || {};
  return firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.id,
    profile?.sub,
    profile?.email,
    profile?.user_email,
    loginData?.adobePassOrg?.userId,
    "anonymous",
  ]);
}

function getAvatarCacheKey(loginData, url, size = 0) {
  const identity = getAvatarCacheIdentity(loginData);
  const normalizedUrl = normalizeAvatarCandidate(url);
  return `${AVATAR_CACHE_STORAGE_PREFIX}${identity}:${size}:${normalizedUrl}`;
}

function readAvatarCacheFromStorage(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      localStorage.removeItem(cacheKey);
      return null;
    }

    const expiresAt = Number(parsed.expiresAt || 0);
    if (expiresAt <= Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    const cachedUrl = normalizeAvatarCandidate(parsed.url || "");
    const dataUrl = typeof parsed.dataUrl === "string" ? parsed.dataUrl : "";
    if (dataUrl.startsWith("data:image/")) {
      return {
        sourceUrl: cachedUrl,
        resolvedUrl: dataUrl,
        expiresAt,
      };
    }

    if (cachedUrl) {
      return {
        sourceUrl: cachedUrl,
        resolvedUrl: cachedUrl,
        expiresAt,
      };
    }

    localStorage.removeItem(cacheKey);
    return null;
  } catch {
    return null;
  }
}

function readAvatarCache(cacheKey) {
  const memoryEntry = state.avatarMemoryCache.get(cacheKey);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return memoryEntry;
  }

  if (memoryEntry) {
    state.avatarMemoryCache.delete(cacheKey);
  }

  const storageEntry = readAvatarCacheFromStorage(cacheKey);
  if (storageEntry) {
    state.avatarMemoryCache.set(cacheKey, storageEntry);
    return storageEntry;
  }

  return null;
}

function writeAvatarCache(cacheKey, payload) {
  const ttlSeconds = Number(payload?.ttlSeconds || AVATAR_CACHE_TTL_SECONDS);
  const expiresAt = Date.now() + Math.max(1, ttlSeconds) * 1000;
  const sourceUrl = normalizeAvatarCandidate(payload?.sourceUrl || "");
  const resolvedUrl = payload?.resolvedUrl || "";
  const dataUrl = typeof payload?.dataUrl === "string" && payload.dataUrl.startsWith("data:image/")
    ? payload.dataUrl
    : "";

  if (!resolvedUrl && !dataUrl && !sourceUrl) {
    return;
  }

  const entry = {
    sourceUrl,
    resolvedUrl: dataUrl || resolvedUrl || sourceUrl,
    expiresAt,
  };
  state.avatarMemoryCache.set(cacheKey, entry);

  try {
    const persistable = {
      expiresAt,
      url: sourceUrl || normalizeAvatarCandidate(resolvedUrl) || "",
      dataUrl: dataUrl && dataUrl.length <= AVATAR_MAX_LOCALSTORAGE_DATAURL_BYTES ? dataUrl : "",
    };
    localStorage.setItem(cacheKey, JSON.stringify(persistable));
  } catch {
    // Ignore storage quota failures.
  }
}

function blobToDataUrl(blob) {
  if (!blob || blob.size <= 0) {
    return Promise.resolve("");
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve("");
    reader.onload = () => {
      if (typeof reader.result === "string" && reader.result.startsWith("data:image/")) {
        resolve(reader.result);
        return;
      }
      resolve("");
    };
    reader.readAsDataURL(blob);
  });
}

function logAvatarFailureOnce(reason, details = null) {
  if (state.avatarFailureLogged) {
    return;
  }
  state.avatarFailureLogged = true;
  log(`Avatar load failed (${reason}); using placeholder.`, details);
}

function purgeAvatarCaches() {
  state.avatarMemoryCache.clear();
  try {
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (
        typeof key === "string" &&
        (key.startsWith(AVATAR_CACHE_STORAGE_PREFIX) || key.startsWith(LEGACY_AVATAR_CACHE_STORAGE_PREFIX))
      ) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore localStorage cleanup failures.
  }
}

function purgeDcrCaches() {
  state.dcrEnsureTokenPromiseByKey.clear();
  try {
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (
        typeof key === "string" &&
        (key.startsWith(`${DCR_CACHE_PREFIX}:`) || key.startsWith(`${LEGACY_DCR_CACHE_PREFIX}:`))
      ) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore localStorage cleanup failures.
  }
}

function clearResolvedAvatar() {
  if (state.avatarObjectUrl) {
    try {
      URL.revokeObjectURL(state.avatarObjectUrl);
    } catch {
      // Ignore revoke errors.
    }
  }
  state.avatarObjectUrl = "";
  state.avatarResolvedUrl = "";
  state.avatarResolveKey = "";
  state.avatarImsRefreshKey = "";
  state.avatarImsRefreshAt = 0;
  state.avatarResolving = false;
  state.avatarFailureLogged = false;
}

function setResolvedAvatarUrl(url, objectUrl = false) {
  const normalized = normalizeAvatarCandidate(url);
  if (objectUrl) {
    if (state.avatarObjectUrl && state.avatarObjectUrl !== normalized) {
      try {
        URL.revokeObjectURL(state.avatarObjectUrl);
      } catch {
        // Ignore revoke errors.
      }
    }
    state.avatarObjectUrl = normalized;
  } else if (state.avatarObjectUrl) {
    try {
      URL.revokeObjectURL(state.avatarObjectUrl);
    } catch {
      // Ignore revoke errors.
    }
    state.avatarObjectUrl = "";
  }

  state.avatarResolvedUrl = normalized;
}

function makeAvatarResolveKey(loginData) {
  const compactAvatarValue = (value) => {
    const normalized = normalizeAvatarCandidate(value) || normalizeInlineAvatarData(value);
    if (!normalized) {
      return "";
    }
    if (normalized.startsWith("data:image/")) {
      const header = normalized.slice(0, normalized.indexOf(",") + 1);
      return `${header}len:${normalized.length}`;
    }
    return normalized;
  };

  const tokenFingerprint = loginData?.accessToken ? String(loginData.accessToken).slice(-16) : "";
  const orgAvatar = compactAvatarValue(loginData?.adobePassOrg?.avatarUrl || "");
  const explicitLoginImageUrl = compactAvatarValue(resolveLoginImageUrl(loginData));
  const loginProfile = resolveLoginProfile(loginData) || {};
  const profileCandidates = getProfileAvatarCandidates(loginProfile).map((value) => compactAvatarValue(value));
  const discoveredProfileCandidates = collectAvatarCandidatesFromProfileShape(loginProfile).map((value) =>
    compactAvatarValue(value)
  );
  return JSON.stringify({
    tokenFingerprint,
    orgAvatar,
    explicitLoginImageUrl,
    profileCandidates,
    discoveredProfileCandidates,
  });
}

function getAvatarRefreshSessionKey(loginData) {
  const tokenFingerprint = loginData?.accessToken ? String(loginData.accessToken).slice(-24) : "";
  const profile = resolveLoginProfile(loginData) || {};
  const identity = firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    profile?.id,
    profile?.email,
    profile?.user_email,
    loginData?.adobePassOrg?.userId,
  ]);
  return `${identity}::${tokenFingerprint}`;
}

function shouldAttemptLiveAvatarRefresh(loginData) {
  const key = getAvatarRefreshSessionKey(loginData);
  const now = Date.now();
  if (!key) {
    return false;
  }

  if (state.avatarImsRefreshKey !== key) {
    state.avatarImsRefreshKey = key;
    state.avatarImsRefreshAt = now;
    return true;
  }

  if (now - Number(state.avatarImsRefreshAt || 0) >= AVATAR_IMS_REFRESH_COOLDOWN_MS) {
    state.avatarImsRefreshAt = now;
    return true;
  }

  return false;
}

function buildAvatarResolveCandidateList(baseCandidates) {
  const normalizedBase = prioritizeAvatarCandidates(baseCandidates || []);
  if (normalizedBase.length === 0) {
    return [];
  }

  const candidates = [];
  const seen = new Set();
  const pushCandidate = (value) => {
    const normalized = normalizeAvatarCandidate(value);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    candidates.push(normalized);
  };

  for (const candidate of normalizedBase) {
    pushCandidate(candidate);
  }

  for (const size of AVATAR_SIZE_PREFERENCES) {
    for (const candidate of normalizedBase) {
      if (
        candidate === FALLBACK_AVATAR ||
        /underpar(?:-round)?-[0-9]+\.png$/i.test(candidate) ||
        /underpar(?:-round)?\.ico$/i.test(candidate)
      ) {
        continue;
      }

      if (isPpsProfileImageUrl(candidate)) {
        pushCandidate(toPpsProfileImageSizeUrl(candidate, size));
        continue;
      }

      if (isImsAvatarDownloadUrl(candidate)) {
        continue;
      }
      pushCandidate(appendAvatarSize(candidate, size));
    }
  }

  return prioritizeAvatarCandidates(candidates).slice(0, AVATAR_MAX_RESOLVE_CANDIDATES);
}

async function fetchLiveAvatarCandidatesFromIms(loginData) {
  const token = String(loginData?.accessToken || "").trim();
  const candidates = [];
  const seen = new Set();
  const appendCandidate = (value) => {
    const normalized = normalizeAvatarCandidate(value);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    candidates.push(normalized);
  };

  const mergeProfileIntoSession = (incomingProfile) => {
    if (!incomingProfile || typeof incomingProfile !== "object" || !state.loginData) {
      return;
    }

    const mergedProfile = mergeProfilePayloads(resolveLoginProfile(state.loginData), incomingProfile);
    const mergedLoginData = {
      ...state.loginData,
      profile: mergedProfile,
      imageUrl: resolveLoginImageUrl({
        ...state.loginData,
        profile: mergedProfile,
      }),
    };
    state.loginData = mergedLoginData;
  };

  try {
    const profilePayload = await fetchImsSessionProfile(token);
    if (profilePayload && typeof profilePayload === "object") {
      mergeProfileIntoSession(profilePayload);
      for (const candidate of getProfileAvatarCandidates(profilePayload)) {
        appendCandidate(candidate);
      }
      for (const candidate of collectAvatarCandidatesFromProfileShape(profilePayload)) {
        appendCandidate(candidate);
      }
    }
  } catch {
    // Continue with existing in-memory candidates.
  }

  const sessionProfile = resolveLoginProfile(state.loginData);
  for (const candidate of getProfileAvatarCandidates(sessionProfile)) {
    appendCandidate(candidate);
  }
  for (const candidate of collectAvatarCandidatesFromProfileShape(sessionProfile)) {
    appendCandidate(candidate);
  }

  return candidates;
}

function isImsAvatarDownloadUrl(url) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return /(^|\.)adobelogin\.com$/i.test(parsed.hostname) && /\/ims\/avatar\/download\//i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function buildAvatarFetchUrlCandidates(url) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized) {
    return [];
  }

  const candidates = [normalized];
  const pushCandidate = (value) => {
    const candidate = normalizeAvatarCandidate(value);
    if (candidate && !candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  };

  if (isPpsProfileImageUrl(normalized)) {
    for (const size of AVATAR_SIZE_PREFERENCES) {
      pushCandidate(toPpsProfileImageSizeUrl(normalized, size));
    }
    return candidates;
  }

  if (!isImsAvatarDownloadUrl(normalized)) {
    for (const size of AVATAR_SIZE_PREFERENCES) {
      pushCandidate(appendAvatarSize(normalized, size));
    }
    return candidates;
  }

  try {
    const parsed = new URL(normalized);
    if (!parsed.searchParams.has("size")) {
      const sized = new URL(parsed.toString());
      sized.searchParams.set("size", String(AVATAR_SIZE_PREFERENCES[0] || 128));
      pushCandidate(sized.toString());
    } else {
      for (const size of AVATAR_SIZE_PREFERENCES) {
        pushCandidate(appendAvatarSize(normalized, size));
      }
    }
  } catch {
    // Keep original candidates only.
  }

  return candidates;
}

function buildAvatarFetchAttempts(accessToken = "", url = "") {
  const baseHeaders = {
    Accept: "image/*,*/*;q=0.8",
  };
  const preferCookieSessionFirst = isPpsProfileImageUrl(url);

  const attempts = [];
  const seen = new Set();
  const pushAttempt = (headers, credentials) => {
    const key = `${credentials}|${Object.entries(headers)
      .sort((left, right) => String(left[0]).localeCompare(String(right[0])))
      .map(([key, value]) => `${key}:${value}`)
      .join("|")}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    attempts.push({ headers, credentials });
  };

  if (preferCookieSessionFirst) {
    pushAttempt(baseHeaders, "include");
    pushAttempt(baseHeaders, "omit");
  }

  if (accessToken) {
    pushAttempt(
      {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      "omit"
    );
    pushAttempt(
      {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      "include"
    );
    pushAttempt(
      {
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
      "omit"
    );

    for (const clientId of IMS_AVATAR_CLIENT_IDS) {
      if (!clientId) {
        continue;
      }
      pushAttempt(
        {
          ...baseHeaders,
          Authorization: `Bearer ${accessToken}`,
          "X-IMS-ClientId": clientId,
          "x-api-key": clientId,
        },
        "omit"
      );
      pushAttempt(
        {
          ...baseHeaders,
          Authorization: `Bearer ${accessToken}`,
          "X-IMS-ClientId": clientId,
          "x-api-key": clientId,
        },
        "include"
      );
    }
  }

  if (!preferCookieSessionFirst) {
    pushAttempt(baseHeaders, "omit");
    pushAttempt(baseHeaders, "include");
  } else {
    pushAttempt({ Accept: "*/*" }, "include");
    pushAttempt({ Accept: "*/*" }, "omit");
  }
  return attempts;
}

function canUseDirectAvatarLoad(url) {
  if (!url) {
    return Promise.resolve(false);
  }

  const normalized = normalizeAvatarCandidate(url) || normalizeInlineAvatarData(url);
  if (!normalized) {
    return Promise.resolve(false);
  }

  if (normalized.startsWith("chrome-extension://") || normalized.startsWith("moz-extension://")) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const done = (result) => {
      if (settled) {
        return;
      }
      settled = true;
      image.onload = null;
      image.onerror = null;
      resolve(result);
    };

    const timeoutId = setTimeout(() => done(false), AVATAR_DIRECT_LOAD_TIMEOUT_MS);
    image.onload = () => {
      clearTimeout(timeoutId);
      done(true);
    };
    image.onerror = () => {
      clearTimeout(timeoutId);
      done(false);
    };
    image.src = normalized;
  });
}

async function fetchAvatarBlobUrl(url) {
  if (
    !url ||
    url.startsWith("data:image/") ||
    url.startsWith("blob:") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("moz-extension://")
  ) {
    return null;
  }

  const urlCandidates = buildAvatarFetchUrlCandidates(url);
  let attemptCount = 0;
  const maxAttempts = 14;
  for (const targetUrl of urlCandidates) {
    const attempts = buildAvatarFetchAttempts(state.loginData?.accessToken || "", targetUrl);
    for (const attempt of attempts) {
      attemptCount += 1;
      if (attemptCount > maxAttempts) {
        return null;
      }

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          cache: "no-store",
          credentials: attempt.credentials,
          redirect: "follow",
          headers: attempt.headers,
        });

        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          continue;
        }

        const responseBuffer = await blob.arrayBuffer();
        const responseMimeType = String(blob.type || "").toLowerCase();
        const inferredMimeType = inferImageMimeTypeFromBuffer(responseBuffer);
        const resolvedMimeType = responseMimeType.startsWith("image/") ? responseMimeType : inferredMimeType;
        if (!resolvedMimeType) {
          continue;
        }

        const normalizedBlob =
          responseMimeType === resolvedMimeType ? blob : new Blob([responseBuffer], { type: resolvedMimeType });
        const objectUrl = URL.createObjectURL(normalizedBlob);
        const dataUrl =
          normalizedBlob.size <= AVATAR_MAX_LOCALSTORAGE_DATAURL_BYTES ? await blobToDataUrl(normalizedBlob) : "";
        return { objectUrl, dataUrl };
      } catch {
        // Try next URL/header method.
      }
    }
  }

  return null;
}

async function fetchAvatarDataUrlViaBackground(url) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return "";
  }

  const response = await sendRuntimeMessageSafe({
    type: "underpar:fetchAvatarDataUrl",
    url,
    accessToken: state.loginData?.accessToken || "",
  });

  if (response?.ok && typeof response.dataUrl === "string" && response.dataUrl.startsWith("data:image/")) {
    return response.dataUrl;
  }

  return "";
}

async function ensureResolvedAvatarUrl() {
  if (!state.sessionReady || !state.loginData) {
    clearResolvedAvatar();
    return;
  }

  const resolveKey = makeAvatarResolveKey(state.loginData);
  if (state.avatarResolveKey === resolveKey && state.avatarResolvedUrl) {
    return;
  }

  if (state.avatarResolving && state.avatarResolveKey === resolveKey) {
    return;
  }

  state.avatarResolving = true;
  state.avatarResolveKey = resolveKey;

  try {
    const tryResolveCandidates = async (candidateList) => {
      for (const candidate of candidateList) {
        const normalized = normalizeAvatarCandidate(candidate);
        if (!normalized) {
          continue;
        }

        if (normalized.startsWith("data:image/")) {
          const inlineUsable = await canUseDirectAvatarLoad(normalized);
          if (inlineUsable) {
            setResolvedAvatarUrl(normalized, false);
            render();
            return true;
          }
          continue;
        }

        const cacheKey = getAvatarCacheKey(state.loginData, normalized, 0);
        const cached = readAvatarCache(cacheKey);
        if (cached?.resolvedUrl) {
          const cachedResolved = normalizeAvatarCandidate(cached.resolvedUrl);
          const cachedUsable = cachedResolved && (await canUseDirectAvatarLoad(cachedResolved));

          if (cachedUsable) {
            setResolvedAvatarUrl(cachedResolved, cachedResolved.startsWith("blob:"));
            render();
            return true;
          }

          state.avatarMemoryCache.delete(cacheKey);
          try {
            localStorage.removeItem(cacheKey);
          } catch {
            // Ignore storage cleanup failures.
          }
        }

        if (/^https?:\/\//i.test(normalized)) {
          const backgroundFirstDataUrl = await fetchAvatarDataUrlViaBackground(normalized);
          if (backgroundFirstDataUrl) {
            setResolvedAvatarUrl(backgroundFirstDataUrl, false);
            writeAvatarCache(cacheKey, {
              sourceUrl: normalized,
              resolvedUrl: backgroundFirstDataUrl,
              dataUrl: backgroundFirstDataUrl,
              ttlSeconds: AVATAR_CACHE_TTL_SECONDS,
            });
            render();
            return true;
          }
        }

        const directOk = await canUseDirectAvatarLoad(normalized);
        if (directOk) {
          setResolvedAvatarUrl(normalized, normalized.startsWith("blob:"));
          writeAvatarCache(cacheKey, {
            sourceUrl: normalized,
            resolvedUrl: normalized,
            ttlSeconds: AVATAR_CACHE_TTL_SECONDS,
          });
          render();
          return true;
        }

        const blobResult = await fetchAvatarBlobUrl(normalized);
        if (blobResult?.objectUrl) {
          setResolvedAvatarUrl(blobResult.objectUrl, true);
          writeAvatarCache(cacheKey, {
            sourceUrl: normalized,
            resolvedUrl: blobResult.objectUrl,
            dataUrl: blobResult.dataUrl || "",
            ttlSeconds: AVATAR_CACHE_TTL_SECONDS,
          });
          render();
          return true;
        }

      }
      return false;
    };

    const baseCandidates = getAvatarCandidates(state.loginData);
    const prioritizedCandidates = buildAvatarResolveCandidateList(baseCandidates);
    if (await tryResolveCandidates(prioritizedCandidates)) {
      return;
    }

    if (shouldAttemptLiveAvatarRefresh(state.loginData)) {
      const liveCandidates = await fetchLiveAvatarCandidatesFromIms(state.loginData);
      const retryCandidates = buildAvatarResolveCandidateList([...liveCandidates, ...getAvatarCandidates(state.loginData)]);
      if (await tryResolveCandidates(retryCandidates)) {
        return;
      }
    }

    logAvatarFailureOnce("all-candidates-failed", {
      candidates: prioritizedCandidates,
      hasProfile: Boolean(state.loginData?.profile),
      hasAccessToken: Boolean(state.loginData?.accessToken),
    });
    setResolvedAvatarUrl(FALLBACK_AVATAR);
    render();
  } finally {
    state.avatarResolving = false;
    render();
  }
}

function closeAvatarMenu() {
  state.avatarMenuOpen = false;
  if (els.avatarMenu) {
    els.avatarMenu.hidden = true;
  }
}

function renderAvatarMenu() {
  if (!els.avatarMenu || !state.sessionReady || !state.loginData || state.restricted) {
    closeAvatarMenu();
    return;
  }

  const avatarUrl = getAvatarRenderUrl(state.loginData).replace(/"/g, "");
  const profile = resolveLoginProfile(state.loginData) || {};
  const name = getProfileDisplayName(profile);
  const email = getProfileEmail(profile) || "No email available";

  els.avatarMenuImage.style.backgroundImage = `url("${avatarUrl}"), url("${FALLBACK_AVATAR}")`;
  els.avatarMenuImage.setAttribute("role", "img");
  els.avatarMenuImage.setAttribute("aria-hidden", "false");
  els.avatarMenuImage.setAttribute("aria-label", `${name} avatar`);
  els.avatarMenuName.textContent = name;
  els.avatarMenuEmail.textContent = email;
  els.avatarMenuOrg.textContent = `Organization: ${getOrgDisplayName(state.loginData)}`;

  const entries = buildAvatarMenuEntries(state.loginData);
  els.avatarMenuDetails.innerHTML = "";
  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "avatar-menu-row";
    const key = document.createElement("span");
    key.className = "avatar-menu-key";
    key.textContent = "Profile";
    const value = document.createElement("span");
    value.className = "avatar-menu-value";
    value.textContent = "No profile details available.";
    empty.appendChild(key);
    empty.appendChild(value);
    els.avatarMenuDetails.appendChild(empty);
  } else {
    for (const entry of entries) {
      const row = document.createElement("div");
      row.className = "avatar-menu-row";

      const key = document.createElement("span");
      key.className = "avatar-menu-key";
      key.textContent = entry.key;

      const value = document.createElement("span");
      value.className = "avatar-menu-value";
      if (entry.multiline) {
        value.classList.add("avatar-menu-value-multiline");
      }
      value.textContent = entry.value;

      row.appendChild(key);
      row.appendChild(value);
      els.avatarMenuDetails.appendChild(row);
    }
  }

  els.avatarMenu.hidden = !state.avatarMenuOpen;
}

function openAvatarMenu() {
  if (!state.sessionReady || !state.loginData || state.restricted || state.busy) {
    return;
  }
  state.avatarMenuOpen = true;
  renderAvatarMenu();
}

function toggleAvatarMenu() {
  if (state.avatarMenuOpen) {
    closeAvatarMenu();
    return;
  }
  openAvatarMenu();
}

async function clearIdentityTokens() {
  const token = state.loginData?.accessToken;
  if (token && chrome.identity?.removeCachedAuthToken) {
    try {
      await chrome.identity.removeCachedAuthToken({ token });
    } catch {
      // Ignore cache removal errors.
    }
  }

  if (chrome.identity?.clearAllCachedAuthTokens) {
    try {
      await chrome.identity.clearAllCachedAuthTokens();
    } catch {
      // Ignore clear-all errors.
    }
  }
}

async function invalidateImsWebSession() {
  for (const url of IMS_LOGOUT_URLS) {
    try {
      await fetch(url, {
        method: "GET",
        credentials: "include",
        mode: "no-cors",
        cache: "no-store",
      });
    } catch {
      // Ignore logout endpoint failures and continue best-effort.
    }
  }
}

async function signOutAndResetSession() {
  if (state.busy) {
    return;
  }

  closeAvatarMenu();
  setBusy(true, "Signing out...");
  setStatus("", "info");

  try {
    clearRefreshTimer();
    await Promise.all([clearIdentityTokens(), invalidateImsWebSession()]);
    await clearLoginData();
    purgeAvatarCaches();
    purgeDcrCaches();

    resetWorkflowForLoggedOut();
    state.loginData = null;
    state.restricted = false;
    state.sessionReady = false;
    state.programmersApiEndpoint = null;
    state.mvpdCacheByRequestor.clear();
    clearResolvedAvatar();
  } finally {
    setBusy(false);
    render();
  }
}

async function attemptAutoSwitchToAdobePass(organizations, options = {}) {
  const adobePassOrg = findAdobePassOrg(organizations);
  if (!adobePassOrg) {
    return null;
  }

  const interactive = options.interactive === true;
  const allowFallback = options.allowFallback === true;
  const maxStrategies = Number.isFinite(options.maxStrategies) ? Math.max(1, Number(options.maxStrategies)) : 0;
  const strategies = buildOrgSwitchStrategies({
    ...toAdobePassOrgDescriptor(adobePassOrg),
    isAdobePass: true,
    raw: adobePassOrg,
  });
  const orderedStrategies = maxStrategies > 0 ? strategies.slice(0, maxStrategies) : strategies;

  for (const strategy of orderedStrategies) {
    try {
      const authData = await startLogin({
        extraParams: strategy,
        interactive,
        allowFallback,
      });

      const profile = await resolveProfileAfterLogin(authData);
      return {
        accessToken: authData.accessToken,
        expiresAt: authData.expiresAt,
        profile,
      };
    } catch (error) {
      log("Auto-switch strategy failed", {
        strategy,
        interactive,
        allowFallback,
        error: error?.message || String(error),
      });
    }
  }

  return null;
}

async function enforceAdobePassAccess(loginData) {
  const normalizedProfile = resolveLoginProfile(loginData);
  const normalizedImageUrl = resolveLoginImageUrl({
    ...loginData,
    profile: normalizedProfile,
  });
  let organizations = [];
  let orgFetchFailed = false;

  try {
    const orgPayload = await fetchOrganizations(loginData.accessToken);
    organizations = flattenOrganizations(orgPayload);
    updateRestrictedOrgOptions(organizations, loginData?.adobePassOrg || null);
  } catch (error) {
    orgFetchFailed = true;
    log("Unable to fetch organizations; allowing session as unknown", error);
  }

  if (orgFetchFailed) {
    return {
      allowed: true,
      loginData: {
        ...loginData,
        profile: normalizedProfile,
        imageUrl: normalizedImageUrl,
        adobePassOrg: loginData.adobePassOrg || null,
      },
    };
  }

  const adobePassOrg = findAdobePassOrg(organizations);
  if (!adobePassOrg) {
    // Do not block purely on org parsing mismatches; final entitlement is verified via programmers access.
    return {
      allowed: true,
      loginData: {
        ...loginData,
        profile: normalizedProfile,
        imageUrl: normalizedImageUrl,
        adobePassOrg: loginData.adobePassOrg || null,
      },
    };
  }

  let resolved = {
    ...loginData,
    profile: normalizedProfile,
    imageUrl: normalizedImageUrl,
    adobePassOrg: toAdobePassOrgDescriptor(adobePassOrg, normalizedProfile),
  };

  const switched = await attemptAutoSwitchToAdobePass(organizations);
  if (switched) {
    let switchedOrgs = organizations;
    try {
      const switchedPayload = await fetchOrganizations(switched.accessToken);
      switchedOrgs = flattenOrganizations(switchedPayload);
    } catch (error) {
      log("Unable to refetch organizations after switch", error);
    }

    const switchedAdobePassOrg = findAdobePassOrg(switchedOrgs) || adobePassOrg;
    const switchedProfile = resolveLoginProfile(switched);
    updateRestrictedOrgOptions(switchedOrgs, switchedAdobePassOrg || adobePassOrg);
    resolved = {
      ...switched,
      profile: switchedProfile,
      imageUrl: resolveLoginImageUrl({
        ...switched,
        profile: switchedProfile,
      }),
      adobePassOrg: toAdobePassOrgDescriptor(switchedAdobePassOrg, switchedProfile),
    };
  }

  return { allowed: true, loginData: resolved };
}

async function ensureRestrictedOrgOptionsFromToken(accessToken, preferredOrg = null) {
  const token = String(accessToken || "").trim();
  if (!token) {
    return false;
  }

  try {
    const orgPayload = await fetchOrganizations(token);
    const organizations = flattenOrganizations(orgPayload);
    updateRestrictedOrgOptions(organizations, preferredOrg);
    return organizations.length > 0;
  } catch (error) {
    log("Unable to load org options for restricted picker", error);
    return false;
  }
}

async function attemptInteractiveAdobePassRecovery(sessionData) {
  const token = String(sessionData?.accessToken || "").trim();
  if (!token) {
    return false;
  }

  let organizations = [];
  try {
    const orgPayload = await fetchOrganizations(token);
    organizations = flattenOrganizations(orgPayload);
    updateRestrictedOrgOptions(organizations, sessionData?.adobePassOrg || null);
  } catch (error) {
    log("Unable to load organizations for interactive AdobePass recovery", error);
    return false;
  }

  if (!findAdobePassOrg(organizations)) {
    updateRestrictedContext(sessionData, {
      recoveryLabel: "No AdobePass org membership was found for this account.",
    });
    return false;
  }

  const switched = await attemptAutoSwitchToAdobePass(organizations, {
    interactive: true,
    allowFallback: true,
    maxStrategies: 4,
  });
  if (!switched) {
    updateRestrictedContext(sessionData, {
      recoveryLabel: "Auto-switch to @AdobePass failed. Select a profile manually or sign in again.",
    });
    return false;
  }

  return activateSession(
    {
      accessToken: switched.accessToken,
      expiresAt: switched.expiresAt,
      profile: switched.profile,
    },
    "interactive-auto-switch-recovery",
    { allowDeniedRecovery: false }
  );
}

async function loadStoredLoginData() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const loginData = stored?.[STORAGE_KEY] || null;

  if (!loginData) {
    return null;
  }

  if (!loginData.accessToken || !loginData.expiresAt || loginData.expiresAt <= Date.now()) {
    await chrome.storage.local.remove(STORAGE_KEY);
    return null;
  }

  const normalizedProfile = resolveLoginProfile(loginData);
  return {
    ...loginData,
    profile: normalizedProfile,
    imageUrl: resolveLoginImageUrl({
      ...loginData,
      profile: normalizedProfile,
    }),
  };
}

function pruneEmptyObject(value) {
  if (!value || typeof value !== "object") {
    return {};
  }

  const output = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry === undefined || entry === null || entry === "") {
      continue;
    }

    if (Array.isArray(entry)) {
      const filtered = entry.filter((item) => item !== undefined && item !== null && item !== "");
      if (filtered.length > 0) {
        output[key] = filtered;
      }
      continue;
    }

    if (typeof entry === "object") {
      const nested = pruneEmptyObject(entry);
      if (Object.keys(nested).length > 0) {
        output[key] = nested;
      }
      continue;
    }

    output[key] = entry;
  }

  return output;
}

function compactStorageString(value, maxLength = 320) {
  if (value === undefined || value === null) {
    return "";
  }
  const text = String(value).trim();
  if (!text) {
    return "";
  }
  if (!Number.isFinite(maxLength) || maxLength <= 0 || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength);
}

function compactStorageAvatarUrl(value) {
  const normalized = normalizeAvatarCandidate(value);
  if (!normalized || normalized.startsWith("data:image/") || normalized.startsWith("blob:")) {
    return "";
  }
  return normalized;
}

function compactAdobePassOrgForStorage(org) {
  if (!org || typeof org !== "object") {
    return null;
  }

  const compact = pruneEmptyObject({
    orgId: compactStorageString(org.orgId, 180),
    userId: compactStorageString(org.userId, 180),
    name: compactStorageString(org.name, 240),
    avatarUrl: compactStorageAvatarUrl(org.avatarUrl),
  });

  return Object.keys(compact).length > 0 ? compact : null;
}

function compactProfileForStorage(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const identity = compactStorageString(
    firstNonEmptyString([profile?.userId, profile?.user_id, profile?.sub, profile?.id]),
    180
  );

  const avatarUrl = compactStorageAvatarUrl(
    firstNonEmptyString([
      profile?.user_image_url,
      profile?.userImageUrl,
      profile?.avatar,
      profile?.avatarUrl,
      profile?.avatar_url,
      profile?.additional_info?.user_image_url,
      profile?.additional_info?.userImageUrl,
      profile?.additional_info?.avatar,
      profile?.additional_info?.avatarUrl,
      profile?.additional_info?.avatar_url,
      toImsAvatarDownloadUrl(identity, 128),
    ])
  );

  const roles = (
    Array.isArray(profile?.additional_info?.roles)
      ? profile.additional_info.roles
      : Array.isArray(profile?.roles)
        ? profile.roles
        : []
  )
    .map((role) => compactStorageString(role, 120))
    .filter(Boolean)
    .slice(0, 24);

  const additionalInfo = pruneEmptyObject({
    email: compactStorageString(firstNonEmptyString([profile?.additional_info?.email]), 320),
    account_type: compactStorageString(firstNonEmptyString([profile?.additional_info?.account_type]), 80),
    user_image_url: compactStorageAvatarUrl(
      firstNonEmptyString([
        profile?.additional_info?.user_image_url,
        profile?.additional_info?.userImageUrl,
        profile?.additional_info?.avatar,
        profile?.additional_info?.avatarUrl,
        profile?.additional_info?.avatar_url,
      ])
    ),
    avatarUrl: compactStorageAvatarUrl(
      firstNonEmptyString([
        profile?.additional_info?.avatar,
        profile?.additional_info?.avatarUrl,
        profile?.additional_info?.avatar_url,
      ])
    ),
    roles,
  });

  const compact = pruneEmptyObject({
    userId: identity,
    user_id: identity,
    sub: compactStorageString(firstNonEmptyString([profile?.sub]), 180),
    displayName: compactStorageString(getProfileDisplayName(profile), 180),
    firstName: compactStorageString(firstNonEmptyString([profile?.firstName, profile?.first_name]), 120),
    lastName: compactStorageString(firstNonEmptyString([profile?.lastName, profile?.last_name]), 120),
    email: compactStorageString(getProfileEmail(profile), 320),
    account_type: compactStorageString(
      firstNonEmptyString([profile?.account_type, profile?.additional_info?.account_type]),
      80
    ),
    user_image_url: avatarUrl,
    avatarUrl,
    additional_info: additionalInfo,
  });

  return Object.keys(compact).length > 0 ? compact : null;
}

function buildStoredLoginData(loginData, minimal = false) {
  const profile = minimal ? null : compactProfileForStorage(resolveLoginProfile(loginData));
  const fallbackIdentity = firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    loginData?.adobePassOrg?.userId,
  ]);
  const fallbackAvatar = fallbackIdentity ? toImsAvatarDownloadUrl(fallbackIdentity, 128) : "";

  const compact = pruneEmptyObject({
    accessToken: compactStorageString(firstNonEmptyString([loginData?.accessToken]), 4096),
    expiresAt: Number(loginData?.expiresAt || 0),
    imageUrl: compactStorageAvatarUrl(
      firstNonEmptyString([
        loginData?.imageUrl,
        loginData?.user_image_url,
        loginData?.avatarUrl,
        loginData?.avatar_url,
        loginData?.adobePassOrg?.avatarUrl,
        profile?.user_image_url,
        fallbackAvatar,
      ])
    ),
    profile,
    adobePassOrg: compactAdobePassOrgForStorage(loginData?.adobePassOrg),
  });

  return compact;
}

function isStorageQuotaError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  if (!message) {
    return false;
  }
  const normalized = message.toLowerCase();
  return (
    normalized.includes("quota") ||
    normalized.includes("kquotabytes") ||
    normalized.includes("max_write_operations") ||
    normalized.includes("resource::kquotabytes")
  );
}

async function clearDebugFlowStorageFromChromeStorage() {
  try {
    const payload = await chrome.storage.local.get(null);
    const keysToRemove = Object.keys(payload || {}).filter(
      (key) =>
        key === DEBUG_FLOW_STORAGE_INDEX_KEY ||
        key === LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY ||
        key.startsWith(DEBUG_FLOW_STORAGE_PREFIX) ||
        key.startsWith(LEGACY_DEBUG_FLOW_STORAGE_PREFIX)
    );
    if (keysToRemove.length === 0) {
      return 0;
    }
    await chrome.storage.local.remove(keysToRemove);
    return keysToRemove.length;
  } catch {
    return 0;
  }
}

async function saveLoginData(loginData) {
  const normalized = buildStoredLoginData(loginData, false);
  if (!normalized.accessToken || !normalized.expiresAt || normalized.expiresAt <= 0) {
    return false;
  }

  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: normalized });
    return true;
  } catch (error) {
    if (!isStorageQuotaError(error)) {
      log("Unable to persist login data; keeping in-memory session only.", error?.message || String(error));
      return false;
    }

    const removedDebugKeys = await clearDebugFlowStorageFromChromeStorage();
    if (removedDebugKeys > 0) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEY]: normalized });
        log("Recovered storage quota by clearing persisted UP debug flow keys.", { removedDebugKeys });
        return true;
      } catch {
        // Fallback to minimal payload below.
      }
    }

    const minimal = buildStoredLoginData(loginData, true);
    if (!minimal.accessToken || !minimal.expiresAt || minimal.expiresAt <= 0) {
      return false;
    }

    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: minimal });
      log("Stored minimal session payload after quota pressure.", { removedDebugKeys });
      return true;
    } catch (retryError) {
      log("Storage quota prevented persisted session write; continuing with in-memory session.", {
        removedDebugKeys,
        error: retryError instanceof Error ? retryError.message : String(retryError),
      });
      return false;
    }
  }
}

async function clearLoginData() {
  await chrome.storage.local.remove(STORAGE_KEY);
}

function clearRefreshTimer() {
  if (state.refreshTimeoutId) {
    clearTimeout(state.refreshTimeoutId);
    state.refreshTimeoutId = null;
  }
}

function scheduleNoTouchRefresh() {
  clearRefreshTimer();

  if (!state.loginData?.expiresAt) {
    return;
  }

  const delay = Math.max(15000, state.loginData.expiresAt - Date.now() - TOKEN_REFRESH_LEEWAY_MS);
  state.refreshTimeoutId = setTimeout(() => {
    void refreshSessionNoTouch();
  }, delay);
}

async function activateSession(sessionData, source = "unknown", options = {}) {
  const allowDeniedRecovery = options.allowDeniedRecovery !== false;
  const enforced = await enforceAdobePassAccess(sessionData);
  if (!enforced.allowed || !enforced.loginData) {
    await clearLoginData();
    resetWorkflowForLoggedOut();
    await ensureRestrictedOrgOptionsFromToken(sessionData?.accessToken, sessionData?.adobePassOrg || null);
    updateRestrictedContext(sessionData, {
      recoveryLabel: "Unable to verify AdobePass access for this login.",
    });
    state.loginData = null;
    state.restricted = true;
    state.sessionReady = false;
    clearRefreshTimer();
    setStatus("", "info");
    render();
    return false;
  }

  try {
    await loadProgrammersData(enforced.loginData.accessToken);
  } catch (error) {
    const accessDenied = error?.code === "PROGRAMMERS_ACCESS_DENIED";
    const deniedSessionData = enforced.loginData || sessionData;
    const deniedAccessToken = firstNonEmptyString([enforced.loginData?.accessToken, sessionData?.accessToken]);
    const deniedExpiresAt = Number(enforced.loginData?.expiresAt || sessionData?.expiresAt || 0);

    if (accessDenied && allowDeniedRecovery) {
      const recovered = await attemptInteractiveAdobePassRecovery({
        accessToken: deniedAccessToken,
        expiresAt: deniedExpiresAt,
        profile: resolveLoginProfile(deniedSessionData),
        adobePassOrg: deniedSessionData?.adobePassOrg || null,
      });
      if (recovered) {
        setStatus("", "info");
        return true;
      }
    }

    await clearLoginData();
    resetWorkflowForLoggedOut();
    state.loginData = null;
    state.sessionReady = false;
    clearRefreshTimer();

    if (accessDenied) {
      await ensureRestrictedOrgOptionsFromToken(
        deniedAccessToken,
        deniedSessionData?.adobePassOrg || sessionData?.adobePassOrg || null
      );
      updateRestrictedContext(deniedSessionData, {
        recoveryLabel: allowDeniedRecovery
          ? "Auto-switch to @AdobePass was attempted but access is still denied."
          : "AdobePass access is still denied after auto-switch.",
      });
      state.restricted = true;
      setStatus("", "info");
    } else {
      state.restricted = false;
      setStatus("Unable to verify AdobePass access. Please sign in again.", "error");
    }

    render();
    return false;
  }

  let sessionProfile = resolveLoginProfile(enforced.loginData);
  try {
    const profileFromSession = await fetchImsSessionProfile(enforced.loginData.accessToken || "");
    if (profileFromSession && typeof profileFromSession === "object") {
      sessionProfile = mergeProfilePayloads(sessionProfile, profileFromSession);
    }
  } catch {
    // Keep existing profile data when IMS profile enrichment fails.
  }

  const resolvedProfile = sessionProfile;
  const resolvedImageUrl = resolveLoginImageUrl({
    ...enforced.loginData,
    profile: resolvedProfile,
  });

  const resolvedLoginData = {
    ...enforced.loginData,
    profile: resolvedProfile,
    imageUrl: resolvedImageUrl,
    adobePassOrg:
      enforced.loginData.adobePassOrg ||
      {
        orgId: ADOBEPASS_ORG_HANDLE,
        userId: null,
        name: "@AdobePass",
        avatarUrl: "",
      },
  };

  state.loginData = resolvedLoginData;
  state.restricted = false;
  clearRestrictedOrgOptions();
  state.sessionReady = true;
  await saveLoginData(resolvedLoginData);
  scheduleNoTouchRefresh();
  render();
  log(`Session activated (${source})`, {
    expiresAt: resolvedLoginData.expiresAt,
    org: resolvedLoginData.adobePassOrg,
  });
  return true;
}

async function refreshSessionNoTouch() {
  if (state.busy || state.isBootstrapping) {
    return;
  }

  try {
    const authData = await startLogin({ interactive: false, allowFallback: false });
    const profile = await resolveProfileAfterLogin(authData);
    await activateSession(
      {
        accessToken: authData.accessToken,
        expiresAt: authData.expiresAt,
        profile,
      },
      "silent-refresh"
    );
  } catch (error) {
    log("No-touch refresh skipped", error?.message || String(error));
    if (state.loginData?.expiresAt && state.loginData.expiresAt > Date.now()) {
      scheduleNoTouchRefresh();
    }
  }
}

async function attemptSilentBootstrapLogin() {
  try {
    const authData = await startLogin({ interactive: false, allowFallback: false });
    const profile = await resolveProfileAfterLogin(authData);
    return {
      accessToken: authData.accessToken,
      expiresAt: authData.expiresAt,
      profile,
    };
  } catch {
    return null;
  }
}

function normalizeProgrammersResponse(data) {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      key: item.key || `Programmer:${item.entityData?.id || item.id || index}`,
      entityData: item.entityData || item,
    }));
  }

  if (Array.isArray(data?.entities)) {
    return data.entities.map((item, index) => ({
      key: item.key || `Programmer:${item.entityData?.id || item.id || index}`,
      entityData: item.entityData || item,
    }));
  }

  if (data && typeof data === "object") {
    return [
      {
        key: data.key || `Programmer:${data.entityData?.id || data.id || "single"}`,
        entityData: data.entityData || data,
      },
    ];
  }

  return [];
}

function extractContentProviderId(reference) {
  const text = String(reference || "");
  const match = text.match(/^@ContentProvider:(.+)$/);
  if (match) {
    return match[1];
  }

  return text.trim() || null;
}

function mapProgrammerEntity(entity, index) {
  const data = entity.entityData || {};
  const programmerId = data.id || data.programmerId || data["programmer-id"] || `programmer-${index + 1}`;
  const programmerName = data.displayName || data["display-name"] || data.name || programmerId;
  const mediaCompanyName =
    data["media-company"] ||
    data.media_company ||
    data.mediaCompany ||
    data.mediaCompanyName ||
    data.company ||
    programmerName ||
    programmerId;

  const requestorIds = Array.isArray(data.contentProviders)
    ? data.contentProviders.map((item) => extractContentProviderId(item)).filter(Boolean)
    : [];
  const applications = Array.isArray(data.applications) ? data.applications : [];

  return {
    key: `${programmerId}-${index}`,
    programmerId,
    programmerName,
    mediaCompanyName,
    requestorIds,
    applications,
    source: entity,
  };
}

function uniqueSorted(values) {
  const set = new Set(values.filter(Boolean));
  return [...set].sort((a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: "base" }));
}

function populateMediaCompanySelect() {
  state.selectedMvpdId = "";

  const options = [...state.programmers]
    .map((item) => ({
      value: item.key,
      text: `${item.programmerName} - ${item.programmerId}`,
    }))
    .sort((left, right) => left.text.localeCompare(right.text, undefined, { sensitivity: "base" }));

  els.mediaCompanySelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Choose a Media Company --";
  els.mediaCompanySelect.appendChild(defaultOption);

  for (const optionValue of options) {
    const option = document.createElement("option");
    option.value = optionValue.value;
    option.textContent = optionValue.text;
    els.mediaCompanySelect.appendChild(option);
  }

  els.mediaCompanySelect.disabled = options.length === 0;

  els.requestorSelect.disabled = true;
  els.requestorSelect.innerHTML = '<option value="">-- Select a Media Company first --</option>';

  els.mvpdSelect.disabled = true;
  els.mvpdSelect.innerHTML = '<option value="">-- Select Requestor first --</option>';
  renderPremiumServices(null);
  refreshRestV2LoginPanels();
}

function getRequestorsForSelectedMediaCompany() {
  const programmer = resolveSelectedProgrammer();
  if (!programmer) {
    return [];
  }
  return uniqueSorted(programmer.requestorIds || []);
}

function populateRequestorSelect() {
  state.selectedMvpdId = "";
  const requestorIds = getRequestorsForSelectedMediaCompany();
  const selectedRequestorId = String(state.selectedRequestorId || "").trim();

  els.requestorSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Choose a Content Provider --";
  els.requestorSelect.appendChild(defaultOption);

  for (const requestorId of requestorIds) {
    const option = document.createElement("option");
    option.value = requestorId;
    option.textContent = requestorId;
    els.requestorSelect.appendChild(option);
  }

  els.requestorSelect.disabled = requestorIds.length === 0;

  els.mvpdSelect.disabled = true;
  els.mvpdSelect.innerHTML = '<option value="">-- Select Requestor first --</option>';
  syncClickEsmRequestorMenus(requestorIds, selectedRequestorId, {
    emptyLabel: "-- Select a Media Company first --",
  });
  refreshRestV2LoginPanels();
}

async function refreshProgrammerPanels(options = {}) {
  const programmer = resolveSelectedProgrammer();
  const forcePremiumRefresh = options.forcePremiumRefresh === true;
  const requestToken = ++state.premiumPanelRequestToken;

  if (!programmer) {
    renderPremiumServices(null);
    return;
  }

  const cachedPremiumApps = state.premiumAppsByProgrammerId.get(programmer.programmerId) || null;
  if (cachedPremiumApps && !forcePremiumRefresh) {
    renderPremiumServices(cachedPremiumApps, programmer);
    void prewarmRestV2ForProgrammer(programmer, cachedPremiumApps);
    return;
  }

  renderPremiumServicesLoading(programmer);
  try {
    const premiumApps = await ensurePremiumAppsForProgrammer(programmer, {
      forceRefresh: forcePremiumRefresh,
    });
    if (requestToken !== state.premiumPanelRequestToken || resolveSelectedProgrammer()?.programmerId !== programmer.programmerId) {
      return;
    }
    renderPremiumServices(premiumApps, programmer);
    void prewarmRestV2ForProgrammer(programmer, premiumApps);
  } catch (error) {
    if (requestToken !== state.premiumPanelRequestToken || resolveSelectedProgrammer()?.programmerId !== programmer.programmerId) {
      return;
    }
    renderPremiumServicesError(error);
  }
}

function extractApplicationGuid(appReference) {
  const value = String(appReference || "").trim();
  const match = value.match(/^@RegisteredApplication:(.+)$/);
  if (match) {
    return match[1];
  }
  return value || null;
}

function normalizeEntityToken(value) {
  return String(value || "").trim().toLowerCase();
}

function extractEntityIdFromToken(value) {
  const text = String(value || "").trim();
  const prefixed = text.match(/^@[^:]+:(.+)$/);
  if (prefixed) {
    return String(prefixed[1] || "").trim();
  }
  return text;
}

function collectRestV2ServiceProviderCandidatesFromApp(appInfo, programmerId) {
  const candidates = [];
  const seen = new Set();

  const pushValue = (value) => {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => pushValue(item));
      return;
    }
    if (typeof value === "object") {
      return;
    }

    const id = extractEntityIdFromToken(value);
    if (!id) {
      return;
    }

    const key = normalizeEntityToken(id);
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    candidates.push(id);
  };

  pushValue(appInfo?.appData?.serviceProviders);
  pushValue(appInfo?.appData?.contentProviders);
  pushValue(appInfo?.appData?.requestors);
  pushValue(appInfo?.appData?.requestorIds);
  pushValue(appInfo?.appData?.requestor);
  pushValue(appInfo?.appData?.serviceProvider);

  if (programmerId) {
    pushValue(programmerId);
  }

  return candidates;
}

function appSupportsServiceProvider(appInfo, serviceProviderId, programmerId) {
  const normalizedTarget = normalizeEntityToken(serviceProviderId);
  if (!normalizedTarget) {
    return false;
  }

  const candidates = collectRestV2ServiceProviderCandidatesFromApp(appInfo, programmerId);
  return candidates.some((candidate) => normalizeEntityToken(candidate) === normalizedTarget);
}

function resolveRestV2AppForServiceProvider(restV2Apps, serviceProviderId, programmerId) {
  if (!Array.isArray(restV2Apps) || restV2Apps.length === 0) {
    return null;
  }

  const matched = restV2Apps.find((appInfo) =>
    appSupportsServiceProvider(appInfo, serviceProviderId, programmerId)
  );
  if (matched) {
    return matched;
  }

  return restV2Apps[0];
}

function normalizeScope(scope) {
  return String(scope || "").trim().toLowerCase();
}

function getScopesFromApplication(appData) {
  if (!appData || typeof appData !== "object") {
    return [];
  }

  const rawCandidates = [];
  const pushCandidate = (value) => {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => pushCandidate(item));
      return;
    }
    if (typeof value === "object") {
      if (typeof value.value === "string") {
        pushCandidate(value.value);
      }
      Object.values(value).forEach((item) => {
        if (typeof item === "string" || Array.isArray(item)) {
          pushCandidate(item);
        }
      });
      return;
    }
    if (typeof value === "string") {
      value
        .split(/[,\n;]+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => rawCandidates.push(part));
    }
  };

  pushCandidate(appData.scopes);
  pushCandidate(appData.scope);
  pushCandidate(appData.scopeSet);
  pushCandidate(appData.scopeList);
  pushCandidate(appData.permissions);
  pushCandidate(appData.__rawEnvelope?.entityData?.scopes);
  pushCandidate(appData.__rawEnvelope?.scopes);

  const normalized = Array.from(new Set(rawCandidates.map((scope) => normalizeScope(scope)).filter(Boolean)));
  if (normalized.length > 0) {
    return normalized;
  }

  try {
    const serialized = JSON.stringify(appData).toLowerCase();
    if (serialized.includes(REST_V2_SCOPE)) {
      return [REST_V2_SCOPE];
    }
  } catch {
    // Ignore serialization issues.
  }

  return [];
}

function isProbablyJwt(value) {
  if (!value) {
    return false;
  }
  const token = String(value).trim();
  if (token.length < 60) {
    return false;
  }
  const parts = token.split(".");
  return parts.length === 3 && /^[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+$/.test(token);
}

function extractJwtAndUrls(value) {
  const seen = new Set();
  const jwtCandidates = [];
  const urlCandidates = [];
  const stack = [{ node: value, path: "" }];

  while (stack.length > 0) {
    const { node, path } = stack.pop();

    if (typeof node === "string") {
      const trimmed = node.trim();
      if (isProbablyJwt(trimmed)) {
        const lowerPath = String(path || "").toLowerCase();
        let score = 0;
        if (lowerPath.includes("software") && lowerPath.includes("statement")) {
          score += 100;
        }
        if (lowerPath.includes("software_statement") || lowerPath.includes("softwarestatement")) {
          score += 100;
        }
        if (lowerPath.includes("jwt")) {
          score += 10;
        }
        jwtCandidates.push({ score, value: trimmed });
      }

      if (/^https?:\/\//i.test(trimmed) && /software/i.test(trimmed) && /statement/i.test(trimmed)) {
        urlCandidates.push(trimmed);
      }
      continue;
    }

    if (!node || typeof node !== "object") {
      continue;
    }
    if (seen.has(node)) {
      continue;
    }
    seen.add(node);

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        stack.push({ node: item, path: `${path}[${index}]` });
      });
      continue;
    }

    Object.entries(node).forEach(([key, nested]) => {
      const nestedPath = path ? `${path}.${key}` : key;
      stack.push({ node: nested, path: nestedPath });
    });
  }

  jwtCandidates.sort((left, right) => right.score - left.score);
  return {
    jwt: jwtCandidates[0]?.value || "",
    urls: urlCandidates,
  };
}

function extractSoftwareStatementFromAppData(appData) {
  const directCandidates = [
    appData?.softwareStatement,
    appData?.software_statement,
    appData?.softwarestatement,
    appData?.software?.statement,
    appData?.dcr?.softwareStatement,
    appData?.credentials?.softwareStatement,
  ];

  let fallbackCandidate = "";
  for (const candidate of directCandidates) {
    if (typeof candidate !== "string" || candidate.trim() === "") {
      continue;
    }
    const trimmed = candidate.trim();
    if (isProbablyJwt(trimmed)) {
      return trimmed;
    }
    if (!fallbackCandidate) {
      fallbackCandidate = trimmed;
    }
  }

  const extracted = extractJwtAndUrls(appData);
  return extracted.jwt || fallbackCandidate || "";
}

function normalizeApplicationsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item) => item.entityData || item).filter((item) => item && typeof item === "object");
  }

  if (Array.isArray(payload?.entities)) {
    return payload.entities
      .map((item) => item?.entityData || item)
      .filter((item) => item && typeof item === "object");
  }

  if (payload && typeof payload === "object") {
    const single = payload.entityData || payload;
    if (single && typeof single === "object") {
      return [single];
    }
  }

  return [];
}

function getAdobeConsoleRequestHeaders(accessToken = "") {
  const headers = {
    Accept: "application/json, text/plain, */*",
    Origin: "https://cdn.experience.adobe.net",
    Referer: "https://cdn.experience.adobe.net/",
    "ap-request-id": generateRequestId(),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

async function fetchAdobeConsoleJsonWithAuthVariants(urlCandidates, contextLabel) {
  const urls = Array.isArray(urlCandidates)
    ? [...new Set(urlCandidates.filter((item) => typeof item === "string" && item.trim()))]
    : [];
  if (urls.length === 0) {
    throw new Error(`${contextLabel} failed: no URL candidates.`);
  }

  const accessToken = state.loginData?.accessToken || "";
  const headerVariants = [getAdobeConsoleRequestHeaders("")];
  if (accessToken) {
    headerVariants.push(getAdobeConsoleRequestHeaders(accessToken));
  }

  let lastError = null;
  for (const url of urls) {
    let bootstrapAttemptedForUrl = false;

    for (const headers of headerVariants) {
      for (let round = 0; round < 2; round += 1) {
        try {
          const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers,
          });

          const text = await response.text().catch(() => "");
          const parsed = parseJsonText(text, null);
          if (response.ok) {
            return {
              url,
              parsed: parsed ?? {},
              text,
              status: response.status,
            };
          }

          const authorizationCodeUrl = extractAuthorizationCodeUrl(parsed || {});
          if (
            response.status === 401 &&
            authorizationCodeUrl &&
            !bootstrapAttemptedForUrl &&
            round === 0
          ) {
            bootstrapAttemptedForUrl = true;
            const contextReady = await ensureConsoleSecurityContext(authorizationCodeUrl);
            if (contextReady) {
              continue;
            }
          }

          const message =
            parsed?.error_description ||
            parsed?.error?.message ||
            parsed?.error ||
            parsed?.message ||
            text ||
            response.statusText;
          lastError = new Error(`${contextLabel} failed (${response.status}): ${message}`);
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          break;
        }
      }
    }
  }

  throw lastError || new Error(`${contextLabel} failed.`);
}

async function fetchApplicationDetailsByGuid(guid) {
  if (!guid) {
    return null;
  }
  const url = `${ADOBE_CONSOLE_BASE}/rest/api/applications/${encodeURIComponent(guid)}`;
  const { parsed } = await fetchAdobeConsoleJsonWithAuthVariants([url], "Application detail");
  return parsed?.entityData || parsed || null;
}

async function fetchApplicationRawByGuid(guid) {
  if (!guid) {
    return { text: "", parsed: null };
  }
  const url = `${ADOBE_CONSOLE_BASE}/rest/api/applications/${encodeURIComponent(guid)}`;
  const payload = await fetchAdobeConsoleJsonWithAuthVariants([url], "Application raw fetch");
  const parsed = payload?.parsed?.entityData || payload?.parsed || null;
  return {
    text: String(payload?.text || ""),
    parsed: parsed && typeof parsed === "object" ? parsed : null,
  };
}

async function fetchSoftwareStatementForAppGuid(guid) {
  if (!guid) {
    return "";
  }

  try {
    const details = await fetchApplicationDetailsByGuid(guid);
    const direct = extractSoftwareStatementFromAppData(details);
    if (direct) {
      return direct;
    }
  } catch {
    // Continue to raw fallback.
  }

  let rawPayload = null;
  try {
    rawPayload = await fetchApplicationRawByGuid(guid);
  } catch {
    return "";
  }

  if (rawPayload?.parsed) {
    const extracted = extractSoftwareStatementFromAppData(rawPayload.parsed);
    if (extracted) {
      return extracted;
    }

    const dereference = extractJwtAndUrls(rawPayload.parsed);
    if (dereference.jwt) {
      return dereference.jwt;
    }

    for (const candidateUrl of dereference.urls) {
      try {
        const response = await fetch(candidateUrl, {
          method: "GET",
          credentials: "include",
          mode: "cors",
          headers: {
            Accept: "text/plain, application/json, */*",
          },
        });
        if (!response.ok) {
          continue;
        }
        const content = await response.text();
        const match = String(content || "").match(/[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/);
        if (match && isProbablyJwt(match[0])) {
          return match[0];
        }
      } catch {
        // Ignore dereference errors and continue.
      }
    }
  }

  const rawTextMatch = String(rawPayload?.text || "").match(/[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/);
  if (rawTextMatch && isProbablyJwt(rawTextMatch[0])) {
    return rawTextMatch[0];
  }

  return "";
}

async function fetchApplicationsForProgrammer(programmerId, options = {}) {
  if (!programmerId) {
    return {};
  }

  const forceRefresh = options.forceRefresh === true;
  if (forceRefresh) {
    state.applicationsByProgrammerId.delete(programmerId);
  }

  if (!forceRefresh && state.applicationsByProgrammerId.has(programmerId)) {
    return state.applicationsByProgrammerId.get(programmerId);
  }

  const payload = await fetchAdobeConsoleJsonWithAuthVariants(
    [
      `${ADOBE_CONSOLE_BASE}/rest/api/applications?programmer=${encodeURIComponent(programmerId)}&configurationVersion=3522`,
      `${ADOBE_CONSOLE_BASE}/rest/api/applications?programmer=${encodeURIComponent(programmerId)}`,
    ],
    "Applications load"
  );
  const items = normalizeApplicationsResponse(payload?.parsed || payload);
  const byGuid = {};
  for (const item of items) {
    const guid = item?.id;
    if (!guid) {
      continue;
    }
    byGuid[guid] = item;
  }

  state.applicationsByProgrammerId.set(programmerId, byGuid);
  return byGuid;
}

function findPremiumServiceApplications(applicationsArray, applicationsData) {
  const services = {
    degradation: null,
    esm: null,
    restV2: null,
    restV2Apps: [],
  };

  if (!applicationsData || typeof applicationsData !== "object") {
    return services;
  }

  const appRefsByGuid = new Map();
  if (Array.isArray(applicationsArray)) {
    applicationsArray.forEach((appRef, index) => {
      const guid = extractApplicationGuid(appRef);
      if (guid && !appRefsByGuid.has(guid)) {
        appRefsByGuid.set(guid, { index, appRef });
      }
    });
  }

  const candidates = [];
  for (const [guid, appData] of Object.entries(applicationsData)) {
    if (!guid || !appData || typeof appData !== "object") {
      continue;
    }

    const scopes = getScopesFromApplication(appData);
    if (scopes.length === 0) {
      continue;
    }

    const refMeta = appRefsByGuid.get(guid) || {};
    candidates.push({
      index: Number.isFinite(refMeta.index) ? refMeta.index : Number.MAX_SAFE_INTEGER,
      guid,
      appRef: refMeta.appRef || `@RegisteredApplication:${guid}`,
      appData,
      appName: appData.name || appData.displayName || guid,
      scopes,
      softwareStatement: extractSoftwareStatementFromAppData(appData),
    });
  }

  candidates.sort((left, right) => {
    if (left.index !== right.index) {
      return left.index - right.index;
    }
    return String(left.appName || left.guid).localeCompare(String(right.appName || right.guid), undefined, {
      sensitivity: "base",
    });
  });

  for (const appInfo of candidates) {
    if (!services.degradation && appInfo.scopes.includes(PREMIUM_SERVICE_SCOPE_BY_KEY.degradation)) {
      services.degradation = appInfo;
    }
    if (!services.esm && appInfo.scopes.includes(PREMIUM_SERVICE_SCOPE_BY_KEY.esm)) {
      services.esm = appInfo;
    }
    if (appInfo.scopes.includes(PREMIUM_SERVICE_SCOPE_BY_KEY.restV2)) {
      if (!services.restV2) {
        services.restV2 = appInfo;
      }
      services.restV2Apps.push(appInfo);
    }
  }

  return services;
}

async function enrichPremiumAppsWithSoftwareStatements(premiumApps) {
  const uniqueApps = new Map();
  const pushApp = (appInfo) => {
    if (!appInfo?.guid || uniqueApps.has(appInfo.guid)) {
      return;
    }
    uniqueApps.set(appInfo.guid, appInfo);
  };

  pushApp(premiumApps?.degradation);
  pushApp(premiumApps?.esm);
  pushApp(premiumApps?.restV2);
  if (Array.isArray(premiumApps?.restV2Apps)) {
    premiumApps.restV2Apps.forEach((appInfo) => pushApp(appInfo));
  }

  const hasServiceProviderHints = (appInfo) => {
    const appData = appInfo?.appData;
    if (!appData || typeof appData !== "object") {
      return false;
    }

    const fields = [
      appData.serviceProviders,
      appData.contentProviders,
      appData.requestors,
      appData.requestorIds,
      appData.requestor,
      appData.serviceProvider,
      appData.__rawEnvelope?.entityData?.serviceProviders,
      appData.__rawEnvelope?.entityData?.contentProviders,
      appData.__rawEnvelope?.entityData?.requestors,
      appData.__rawEnvelope?.entityData?.requestorIds,
    ];

    return fields.some((value) => {
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      if (Array.isArray(value)) {
        return value.some((item) => String(item || "").trim().length > 0);
      }
      return false;
    });
  };

  for (const appInfo of uniqueApps.values()) {
    if (!appInfo) {
      continue;
    }

    const shouldHydrateDetails =
      !appInfo.softwareStatement || !hasServiceProviderHints(appInfo);
    if (shouldHydrateDetails) {
      try {
        const details = await fetchApplicationDetailsByGuid(appInfo.guid);
        if (details) {
          appInfo.appData = details;
          if (!appInfo.softwareStatement) {
            appInfo.softwareStatement = extractSoftwareStatementFromAppData(details);
          }
        }
      } catch {
        // Continue with next source.
      }
    }

    if (!appInfo.softwareStatement) {
      appInfo.softwareStatement = await fetchSoftwareStatementForAppGuid(appInfo.guid);
    }
  }
}

function collectRestV2AppCandidatesFromPremiumApps(premiumApps) {
  const candidates = [];
  const seen = new Set();

  const pushCandidate = (appInfo) => {
    if (!appInfo?.guid || seen.has(appInfo.guid)) {
      return;
    }
    seen.add(appInfo.guid);
    candidates.push(appInfo);
  };

  if (Array.isArray(premiumApps?.restV2Apps)) {
    premiumApps.restV2Apps.forEach((appInfo) => pushCandidate(appInfo));
  }
  pushCandidate(premiumApps?.restV2);

  return candidates;
}

function hasRestV2AppBeenPrewarmed(programmerId, appGuid) {
  const appSet = state.restV2PrewarmedAppsByProgrammerId.get(String(programmerId || ""));
  return Boolean(appSet && appSet.has(String(appGuid || "")));
}

function markRestV2AppPrewarmed(programmerId, appGuid) {
  const key = String(programmerId || "");
  const guid = String(appGuid || "");
  if (!key || !guid) {
    return;
  }

  const appSet = state.restV2PrewarmedAppsByProgrammerId.get(key) || new Set();
  appSet.add(guid);
  state.restV2PrewarmedAppsByProgrammerId.set(key, appSet);
}

async function prewarmRestV2ForProgrammer(programmer, premiumApps) {
  if (!programmer?.programmerId || !premiumApps) {
    return;
  }

  const candidates = collectRestV2AppCandidatesFromPremiumApps(premiumApps);
  if (candidates.length === 0) {
    return;
  }

  const preferredRequestor =
    String(state.selectedRequestorId || "").trim() ||
    (Array.isArray(programmer.requestorIds) && programmer.requestorIds.length > 0
      ? String(programmer.requestorIds[0] || "").trim()
      : "");

  const prioritized =
    resolveRestV2AppForServiceProvider(candidates, preferredRequestor, programmer.programmerId) || candidates[0];
  const ordered = [prioritized, ...candidates.filter((item) => item?.guid && item.guid !== prioritized?.guid)];

  const toWarm = ordered
    .filter((item) => item?.guid && !hasRestV2AppBeenPrewarmed(programmer.programmerId, item.guid))
    .slice(0, 2);

  for (const app of toWarm) {
    markRestV2AppPrewarmed(programmer.programmerId, app.guid);
    void ensureDcrAccessToken(programmer.programmerId, app, false).catch((error) => {
      log("REST V2 prewarm failed", {
        programmerId: programmer.programmerId,
        appGuid: app.guid,
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }
}

function getDcrCacheKey(programmerId, appGuid) {
  return `${DCR_CACHE_PREFIX}:${programmerId}:${appGuid}`;
}

function getLegacyDcrCacheKey(programmerId, appGuid) {
  return `${LEGACY_DCR_CACHE_PREFIX}:${programmerId}:${appGuid}`;
}

function loadDcrCache(programmerId, appGuid) {
  try {
    const raw =
      localStorage.getItem(getDcrCacheKey(programmerId, appGuid)) ||
      localStorage.getItem(getLegacyDcrCacheKey(programmerId, appGuid));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return {
      ...parsed,
      clientId: parsed.clientId || parsed.client_id || "",
      clientSecret: parsed.clientSecret || parsed.client_secret || "",
      accessToken: parsed.accessToken || parsed.access_token || "",
      tokenExpiresAt: Number(parsed.tokenExpiresAt || parsed.expires_at || 0),
    };
  } catch {
    return null;
  }
}

function saveDcrCache(programmerId, appGuid, value) {
  try {
    const normalized = {
      ...value,
      clientId: value?.clientId || value?.client_id || "",
      clientSecret: value?.clientSecret || value?.client_secret || "",
      accessToken: value?.accessToken || value?.access_token || "",
      tokenExpiresAt: Number(value?.tokenExpiresAt || value?.expires_at || 0),
    };
    localStorage.setItem(getDcrCacheKey(programmerId, appGuid), JSON.stringify(normalized));
  } catch {
    // Ignore localStorage cache failures.
  }
}

function clearDcrCache(programmerId, appGuid) {
  try {
    localStorage.removeItem(getDcrCacheKey(programmerId, appGuid));
    localStorage.removeItem(getLegacyDcrCacheKey(programmerId, appGuid));
  } catch {
    // Ignore localStorage cache cleanup failures.
  }
}

async function registerClientWithSoftwareStatement(softwareStatement) {
  const dcrDeviceInfo = buildDcrDeviceInfo();
  const attempts = [];

  attempts.push(async () => {
    const response = await fetchWithRateLimitRetry(
      () =>
        fetch(`${ADOBE_SP_BASE}/o/client/register`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Device-Info": dcrDeviceInfo,
          },
          body: JSON.stringify({
            software_statement: softwareStatement,
            redirect_uri: chrome.identity.getRedirectURL("ims-callback"),
            grant_types: ["client_credentials"],
            token_endpoint_auth_method: "client_secret_post",
          }),
        }),
      "DCR JSON register",
      {
        onRetry: ({ attempt, maxRetries, delayMs }) => {
          const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
          setStatus(
            `DCR registration rate-limited. Retrying in ${delaySeconds}s (${attempt}/${maxRetries})...`,
            "info"
          );
        },
      }
    );

    const text = await response.text().catch(() => "");
    const parsed = parseJsonText(text, {});
    if (!response.ok) {
      const reason = normalizeHttpErrorMessage(text) || response.statusText;
      throw new Error(`DCR JSON register failed (${response.status}): ${reason}`);
    }
    return parsed || {};
  });

  attempts.push(async () => {
    const body = new URLSearchParams();
    body.set("software_statement", softwareStatement);
    body.set("redirect_uri", chrome.identity.getRedirectURL("ims-callback"));
    const response = await fetchWithRateLimitRetry(
      () =>
        fetch(`${ADOBE_SP_BASE}/o/client/register`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            "X-Device-Info": dcrDeviceInfo,
          },
          body: body.toString(),
        }),
      "DCR form register",
      {
        onRetry: ({ attempt, maxRetries, delayMs }) => {
          const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
          setStatus(
            `DCR registration rate-limited. Retrying in ${delaySeconds}s (${attempt}/${maxRetries})...`,
            "info"
          );
        },
      }
    );

    const text = await response.text().catch(() => "");
    const parsed = parseJsonText(text, {});
    if (!response.ok) {
      const reason = normalizeHttpErrorMessage(text) || response.statusText;
      throw new Error(`DCR form register failed (${response.status}): ${reason}`);
    }
    return parsed || {};
  });

  let lastError = "DCR registration failed.";
  for (const attempt of attempts) {
    try {
      const data = await attempt();
      const clientId = data.client_id || data.clientId || data.clientID;
      const clientSecret = data.client_secret || data.clientSecret || data.clientSECRET;
      if (!clientId || !clientSecret) {
        throw new Error("DCR response missing client_id/client_secret.");
      }
      return { clientId, clientSecret };
    } catch (error) {
      lastError = error?.message || String(error);
    }
  }

  throw new Error(lastError);
}

async function requestClientCredentialsToken(clientId, clientSecret, debugMeta = null) {
  const debugFlowId = String(debugMeta?.flowId || "").trim();
  const emitTokenDebugEvent = (phase, details = {}) => {
    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      service: String(debugMeta?.service || ""),
      phase,
      requestScope: String(debugMeta?.scope || ""),
      requestorId: String(debugMeta?.requestorId || ""),
      mvpd: String(debugMeta?.mvpd || ""),
      appGuid: String(debugMeta?.appGuid || ""),
      ...details,
    });
  };

  const attempts = [];

  attempts.push(async () => {
    const url = `${ADOBE_SP_BASE}/o/client/token?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
    emitTokenDebugEvent("token-request-attempt", {
      transport: "query",
      method: "POST",
      url: `${ADOBE_SP_BASE}/o/client/token`,
    });
    const response = await fetchWithRateLimitRetry(
      () =>
        fetch(url, {
          method: "POST",
          mode: "cors",
        }),
      "DCR token query",
      {
        onRetry: ({ attempt, maxRetries, delayMs }) => {
          const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
          setStatus(
            `DCR token rate-limited. Retrying in ${delaySeconds}s (${attempt}/${maxRetries})...`,
            "info"
          );
        },
      }
    );
    const text = await response.text().catch(() => "");
    const parsed = parseJsonText(text, {});
    if (!response.ok) {
      const reason = normalizeHttpErrorMessage(text) || response.statusText;
      emitTokenDebugEvent("token-request-attempt-failed", {
        transport: "query",
        status: Number(response.status || 0),
        statusText: String(response.statusText || ""),
        error: reason,
      });
      throw new Error(`DCR token query failed (${response.status}): ${reason}`);
    }
    emitTokenDebugEvent("token-request-attempt-succeeded", {
      transport: "query",
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
    });
    return parsed || {};
  });

  attempts.push(async () => {
    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");
    body.set("client_id", clientId);
    body.set("client_secret", clientSecret);
    emitTokenDebugEvent("token-request-attempt", {
      transport: "form",
      method: "POST",
      url: `${ADOBE_SP_BASE}/o/client/token`,
    });
    const response = await fetchWithRateLimitRetry(
      () =>
        fetch(`${ADOBE_SP_BASE}/o/client/token`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: body.toString(),
        }),
      "DCR token form",
      {
        onRetry: ({ attempt, maxRetries, delayMs }) => {
          const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
          setStatus(
            `DCR token rate-limited. Retrying in ${delaySeconds}s (${attempt}/${maxRetries})...`,
            "info"
          );
        },
      }
    );
    const text = await response.text().catch(() => "");
    const parsed = parseJsonText(text, {});
    if (!response.ok) {
      const reason = normalizeHttpErrorMessage(text) || response.statusText;
      emitTokenDebugEvent("token-request-attempt-failed", {
        transport: "form",
        status: Number(response.status || 0),
        statusText: String(response.statusText || ""),
        error: reason,
      });
      throw new Error(`DCR token form failed (${response.status}): ${reason}`);
    }
    emitTokenDebugEvent("token-request-attempt-succeeded", {
      transport: "form",
      status: Number(response.status || 0),
      statusText: String(response.statusText || ""),
    });
    return parsed || {};
  });

  let lastError = "Token request failed.";
  for (const attempt of attempts) {
    try {
      const data = await attempt();
      const accessToken = data.access_token || data.accessToken;
      if (!accessToken) {
        throw new Error("Token response missing access_token.");
      }

      const expiresInSeconds = Number(data.expires_in || data.expiresIn);
      const ttlSeconds = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0 ? expiresInSeconds : 6 * 60 * 60;
      emitTokenDebugEvent("token-response", {
        ttlSeconds,
      });
      return {
        accessToken,
        tokenExpiresAt: Date.now() + ttlSeconds * 1000,
      };
    } catch (error) {
      lastError = error?.message || String(error);
    }
  }

  emitTokenDebugEvent("token-request-failed", {
    error: String(lastError || "Token request failed."),
  });
  throw new Error(lastError);
}

async function ensureDcrAccessToken(programmerId, appInfo, forceRefresh = false, debugMeta = null) {
  if (!programmerId) {
    throw new Error("Media company ID is required.");
  }
  if (!appInfo || !appInfo.guid) {
    throw new Error("Registered application details are missing.");
  }

  const debugFlowId = String(debugMeta?.flowId || "").trim();
  const emitDcrDebugEvent = (phase, details = {}) => {
    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      service: String(debugMeta?.service || ""),
      phase,
      requestScope: String(debugMeta?.scope || ""),
      requestorId: String(debugMeta?.requestorId || ""),
      mvpd: String(debugMeta?.mvpd || ""),
      programmerId: String(programmerId || ""),
      appGuid: String(appInfo?.guid || ""),
      appName: String(appInfo?.appName || appInfo?.guid || ""),
      ...details,
    });
  };

  const promiseKey = getDcrCacheKey(programmerId, appInfo.guid);
  if (!forceRefresh && state.dcrEnsureTokenPromiseByKey.has(promiseKey)) {
    emitDcrDebugEvent("token-promise-reuse");
    return state.dcrEnsureTokenPromiseByKey.get(promiseKey);
  }

  const workPromise = (async () => {
    let cache = loadDcrCache(programmerId, appInfo.guid) || {};

    if (!cache.clientId || !cache.clientSecret) {
      emitDcrDebugEvent("dcr-registration-required");
      if (!appInfo.softwareStatement) {
        try {
          const details = await fetchApplicationDetailsByGuid(appInfo.guid);
          appInfo.softwareStatement = extractSoftwareStatementFromAppData(details);
        } catch {
          // Continue and fail below if still missing.
        }
      }
      if (!appInfo.softwareStatement) {
        appInfo.softwareStatement = await fetchSoftwareStatementForAppGuid(appInfo.guid);
      }
      if (!appInfo.softwareStatement) {
        throw new Error(`No software statement found on app ${appInfo.appName || appInfo.guid}`);
      }

      const registered = await registerClientWithSoftwareStatement(appInfo.softwareStatement);
      cache.clientId = registered.clientId;
      cache.clientSecret = registered.clientSecret;
      emitDcrDebugEvent("dcr-registration-succeeded");
    }

    const tokenMissing = !cache.accessToken || !cache.tokenExpiresAt;
    const tokenExpired = Date.now() >= Number(cache.tokenExpiresAt) - 60 * 1000;
    if (forceRefresh || tokenMissing || tokenExpired) {
      emitDcrDebugEvent("token-refresh-required", {
        forceRefresh: forceRefresh === true,
        tokenMissing: tokenMissing === true,
        tokenExpired: tokenExpired === true,
      });
      const token = await requestClientCredentialsToken(cache.clientId, cache.clientSecret, {
        ...debugMeta,
        appGuid: String(appInfo?.guid || ""),
      });
      cache.accessToken = token.accessToken;
      cache.tokenExpiresAt = token.tokenExpiresAt;
    } else {
      emitDcrDebugEvent("token-cache-hit", {
        tokenExpiresAt: Number(cache.tokenExpiresAt || 0),
      });
    }

    saveDcrCache(programmerId, appInfo.guid, cache);
    emitDcrDebugEvent("token-ready", {
      tokenExpiresAt: Number(cache.tokenExpiresAt || 0),
    });
    return cache.accessToken;
  })();

  state.dcrEnsureTokenPromiseByKey.set(promiseKey, workPromise);
  try {
    return await workPromise;
  } finally {
    if (state.dcrEnsureTokenPromiseByKey.get(promiseKey) === workPromise) {
      state.dcrEnsureTokenPromiseByKey.delete(promiseKey);
    }
  }
}

async function fetchWithPremiumAuth(programmerId, appInfo, url, options = {}, retryStage = "refresh", debugMeta = null) {
  const debugFlowId = String(debugMeta?.flowId || "").trim();
  const token = await ensureDcrAccessToken(programmerId, appInfo, false, debugMeta);
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  const requestMethod = String(options.method || "GET").toUpperCase();
  const requestBodyPreview =
    typeof options.body === "string" ? truncateDebugText(options.body, 4000) : options.body ? "[non-string body]" : "";

  emitRestV2DebugEvent(debugFlowId, {
    source: "extension",
    phase: "restv2-request",
    method: requestMethod,
    url: String(url || ""),
    retryStage,
    programmerId: String(programmerId || ""),
    appGuid: String(appInfo?.guid || ""),
    appName: String(appInfo?.appName || ""),
    requestHeaders: toDebugHeadersObject(headers),
    requestBodyPreview,
    requestorId: String(debugMeta?.requestorId || ""),
    mvpd: String(debugMeta?.mvpd || ""),
    requestorIds: Array.isArray(debugMeta?.requestorIds) ? debugMeta.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(debugMeta?.mvpdIds) ? debugMeta.mvpdIds.slice(0, 24) : [],
    requestScope: String(debugMeta?.scope || ""),
    service: String(debugMeta?.service || ""),
    endpointUrl: String(debugMeta?.endpointUrl || ""),
    cardId: String(debugMeta?.cardId || ""),
  });

  const response = await fetchWithRateLimitRetry(
    () =>
      fetch(url, {
        ...options,
        mode: options.mode || "cors",
        credentials: options.credentials ?? "omit",
        referrerPolicy: options.referrerPolicy || "no-referrer",
        headers,
      }),
    "Premium API",
    {
      onRetry: ({ attempt, maxRetries, delayMs }) => {
        const delaySeconds = Math.max(1, Math.ceil(delayMs / 1000));
        setStatus(`Premium API rate-limited. Retrying in ${delaySeconds}s (${attempt}/${maxRetries})...`, "info");
      },
    }
  );
  let responsePreview = "";
  try {
    responsePreview = truncateDebugText(await response.clone().text(), 4000);
  } catch {
    responsePreview = "";
  }

  emitRestV2DebugEvent(debugFlowId, {
    source: "extension",
    phase: "restv2-response",
    method: requestMethod,
    url: String(url || ""),
    status: Number(response.status || 0),
    statusText: String(response.statusText || ""),
    retryStage,
    programmerId: String(programmerId || ""),
    appGuid: String(appInfo?.guid || ""),
    appName: String(appInfo?.appName || ""),
    responseHeaders: toDebugHeadersObject(response.headers),
    responsePreview,
    requestorId: String(debugMeta?.requestorId || ""),
    mvpd: String(debugMeta?.mvpd || ""),
    requestorIds: Array.isArray(debugMeta?.requestorIds) ? debugMeta.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(debugMeta?.mvpdIds) ? debugMeta.mvpdIds.slice(0, 24) : [],
    requestScope: String(debugMeta?.scope || ""),
    service: String(debugMeta?.service || ""),
    endpointUrl: String(debugMeta?.endpointUrl || ""),
    cardId: String(debugMeta?.cardId || ""),
  });

  if (response.status === 401 && retryStage === "refresh") {
    const bodyText = await response.clone().text().catch(() => "");
    if (isServiceProviderTokenMismatchError(bodyText)) {
      return response;
    }
    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      phase: "restv2-retry",
      reason: "401-refresh",
      url: String(url || ""),
      status: 401,
      responsePreview: truncateDebugText(bodyText, 1200),
      service: String(debugMeta?.service || ""),
      requestScope: String(debugMeta?.scope || ""),
    });
    await ensureDcrAccessToken(programmerId, appInfo, true, debugMeta);
    return fetchWithPremiumAuth(programmerId, appInfo, url, options, "reprovision", debugMeta);
  }

  if (response.status === 401 && retryStage === "reprovision") {
    const bodyText = await response.clone().text().catch(() => "");
    if (isServiceProviderTokenMismatchError(bodyText)) {
      return response;
    }
    emitRestV2DebugEvent(debugFlowId, {
      source: "extension",
      phase: "restv2-retry",
      reason: "401-reprovision",
      url: String(url || ""),
      status: 401,
      responsePreview: truncateDebugText(bodyText, 1200),
      service: String(debugMeta?.service || ""),
      requestScope: String(debugMeta?.scope || ""),
    });
    clearDcrCache(programmerId, appInfo.guid);
    await ensureDcrAccessToken(programmerId, appInfo, true, debugMeta);
    return fetchWithPremiumAuth(programmerId, appInfo, url, options, "none", debugMeta);
  }

  return response;
}

function getProgrammerCandidatesForRequestor(requestorId) {
  if (!requestorId) {
    return [];
  }

  const selectedProgrammer = resolveSelectedProgrammer();
  if (selectedProgrammer && Array.isArray(selectedProgrammer.requestorIds) && selectedProgrammer.requestorIds.includes(requestorId)) {
    return [selectedProgrammer];
  }

  const scoped = state.programmers.filter((item) => {
    return Array.isArray(item.requestorIds) && item.requestorIds.includes(requestorId);
  });

  if (scoped.length > 0) {
    return scoped;
  }

  return state.programmers.filter((item) => Array.isArray(item.requestorIds) && item.requestorIds.includes(requestorId));
}

async function ensurePremiumAppsForProgrammer(programmer, options = {}) {
  if (!programmer || !programmer.programmerId) {
    return { degradation: null, esm: null, restV2: null, restV2Apps: [] };
  }

  const forceRefresh = options.forceRefresh === true;
  if (forceRefresh) {
    state.premiumAppsByProgrammerId.delete(programmer.programmerId);
    state.applicationsByProgrammerId.delete(programmer.programmerId);
  }

  const existing = state.premiumAppsByProgrammerId.get(programmer.programmerId);
  if (!forceRefresh && existing) {
    return existing;
  }

  if (!forceRefresh && state.premiumAppsLoadPromiseByProgrammerId.has(programmer.programmerId)) {
    return state.premiumAppsLoadPromiseByProgrammerId.get(programmer.programmerId);
  }

  const loadPromise = (async () => {
    const applicationsData = await fetchApplicationsForProgrammer(programmer.programmerId, { forceRefresh });
    const premiumApps = findPremiumServiceApplications(programmer.applications || [], applicationsData || {});
    void enrichPremiumAppsWithSoftwareStatements(premiumApps).catch((error) => {
      log("Premium app enrichment skipped", {
        programmerId: programmer.programmerId,
        error: error instanceof Error ? error.message : String(error),
      });
    });
    state.premiumAppsByProgrammerId.set(programmer.programmerId, premiumApps);
    return premiumApps;
  })();

  state.premiumAppsLoadPromiseByProgrammerId.set(programmer.programmerId, loadPromise);

  try {
    return await loadPromise;
  } finally {
    if (state.premiumAppsLoadPromiseByProgrammerId.get(programmer.programmerId) === loadPromise) {
      state.premiumAppsLoadPromiseByProgrammerId.delete(programmer.programmerId);
    }
  }
}

function normalizeRestV2MvpdCollection(payload) {
  const collection = payload?.requestor?.mvpds || payload?.mvpds || payload?.requestor?.mvpd || [];
  if (!Array.isArray(collection)) {
    return [];
  }

  return collection
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const id = firstNonEmptyString([item.id, item.mvpd, item.platformMappingId]);
      if (!id) {
        return null;
      }

      return {
        id,
        name: firstNonEmptyString([item.displayName, item.name, id]) || id,
        isProxy: item.isProxy === false ? false : true,
        boardingStatus: firstNonEmptyString([item.boardingStatus]),
      };
    })
    .filter(Boolean);
}

function normalizeAdobeNavigationUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw, ADOBE_SP_BASE);
    const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (isLocal && (parsed.pathname.startsWith("/api/v2/") || parsed.pathname.startsWith("/authenticate/"))) {
      return `${ADOBE_SP_BASE}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

function resolveMvpdLoginNavigationUrl(sessionData, serviceProviderId) {
  const normalizedServiceProvider = String(serviceProviderId || "").trim();
  const rawUrl = normalizeAdobeNavigationUrl(sessionData?.url || "");
  const actionName = String(sessionData?.actionName || "").trim().toLowerCase();
  const missingParameters = Array.isArray(sessionData?.missingParameters)
    ? sessionData.missingParameters.map((item) => String(item || "").trim().toLowerCase()).filter(Boolean)
    : [];

  let code = String(sessionData?.code || "").trim();
  if (!code && rawUrl) {
    const match = rawUrl.match(/\/sessions\/([^/?#]+)/i);
    if (match && match[1]) {
      code = decodeURIComponent(match[1]);
    }
  }

  const authUrl =
    normalizedServiceProvider && code
      ? `${REST_V2_BASE}/authenticate/${encodeURIComponent(normalizedServiceProvider)}/${encodeURIComponent(code)}`
      : "";
  if (!rawUrl) {
    return authUrl;
  }

  const pointsToSessionEndpoint = /\/api\/v2\/[^/]+\/sessions\/[^/?#]+$/i.test(rawUrl);
  const requiresResumeParameters =
    actionName.includes("resume") ||
    missingParameters.includes("redirecturl") ||
    missingParameters.includes("domainname");

  if (authUrl && (pointsToSessionEndpoint || requiresResumeParameters)) {
    return authUrl;
  }

  return rawUrl || authUrl;
}

function buildRestV2SessionCreatePayloadCandidates(mvpd) {
  const mvpdId = String(mvpd || "").trim();
  if (!mvpdId) {
    return [];
  }

  const payloads = [];
  const seen = new Set();
  const pushPayload = (domainName = "", redirectUrl = "") => {
    const normalizedDomain = String(domainName || "").trim();
    const normalizedRedirect = String(redirectUrl || "").trim();
    const key = `${normalizedDomain}|${normalizedRedirect}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    const body = new URLSearchParams();
    body.set("mvpd", mvpdId);
    if (normalizedDomain) {
      body.set("domainName", normalizedDomain);
    }
    if (normalizedRedirect) {
      body.set("redirectUrl", normalizedRedirect);
    }

    payloads.push({
      domainName: normalizedDomain,
      redirectUrl: normalizedRedirect,
      body: body.toString(),
    });
  };

  REST_V2_REDIRECT_CANDIDATES.forEach((redirectUrl) => pushPayload(REST_V2_DEFAULT_DOMAIN, redirectUrl));
  pushPayload(REST_V2_DEFAULT_DOMAIN, "");
  pushPayload("", "");

  return payloads;
}

async function createRestV2SessionForContext(context, options = {}) {
  if (!context?.programmerId || !context?.appInfo?.guid || !context?.serviceProviderId || !context?.mvpd) {
    throw new Error("Create session failed: missing media company, app, requestor, or MVPD.");
  }
  const debugFlowId = String(options.debugFlowId || "").trim();

  const appCandidates = Array.isArray(context.restV2AppCandidates)
    ? context.restV2AppCandidates.filter((item) => item?.guid)
    : [];
  if (appCandidates.length === 0) {
    appCandidates.push(context.appInfo);
  }
  if (!appCandidates.some((item) => item.guid === context.appInfo.guid)) {
    appCandidates.unshift(context.appInfo);
  }

  const payloadCandidates = buildRestV2SessionCreatePayloadCandidates(context.mvpd);
  if (payloadCandidates.length === 0) {
    throw new Error("Create session failed: no payload candidates available.");
  }

  let lastErrorText = "";
  let lastStatus = 0;
  for (const appCandidate of appCandidates) {
    for (const payloadCandidate of payloadCandidates) {
      log("REST V2 create-session attempt", {
        serviceProvider: context.serviceProviderId,
        appGuid: appCandidate.guid,
        domainName: payloadCandidate.domainName || "<none>",
        redirectUrl: payloadCandidate.redirectUrl || "<none>",
      });
      emitRestV2DebugEvent(debugFlowId, {
        source: "extension",
        phase: "create-session-attempt",
        serviceProviderId: context.serviceProviderId,
        requestorId: context.requestorId,
        mvpd: context.mvpd,
        appGuid: appCandidate.guid,
        appName: appCandidate.appName || appCandidate.guid,
        domainName: payloadCandidate.domainName || "",
        redirectUrl: payloadCandidate.redirectUrl || "",
      });

      const response = await fetchWithPremiumAuth(
        context.programmerId,
        appCandidate,
        `${REST_V2_BASE}/${encodeURIComponent(context.serviceProviderId)}/sessions`,
        {
          method: "POST",
          mode: "cors",
          headers: buildRestV2Headers(context.serviceProviderId, {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          }),
          body: payloadCandidate.body,
        },
        "refresh",
        {
          flowId: debugFlowId,
          requestorId: context.requestorId,
          mvpd: context.mvpd,
          scope: "create-session",
        }
      );

      const text = await response.text().catch(() => "");
      const parsed = parseJsonText(text, null);
      if (response.ok) {
        const sessionData = parsed && typeof parsed === "object" ? parsed : {};
        const locationHeader = response.headers?.get("Location") || "";
        if (!sessionData.url && locationHeader) {
          sessionData.url = locationHeader;
        }
        const loginUrl = resolveMvpdLoginNavigationUrl(sessionData, context.serviceProviderId);
        if (loginUrl) {
          emitRestV2DebugEvent(debugFlowId, {
            source: "extension",
            phase: "create-session-success",
            serviceProviderId: context.serviceProviderId,
            requestorId: context.requestorId,
            mvpd: context.mvpd,
            appGuid: appCandidate.guid,
            appName: appCandidate.appName || appCandidate.guid,
            status: response.status,
            loginUrl,
            responsePreview: truncateDebugText(text, 2000),
          });
          return {
            loginUrl,
            sessionData,
            payload: payloadCandidate,
            appInfo: appCandidate,
          };
        }
        lastStatus = response.status;
        lastErrorText = "REST V2 session response did not include a login URL/code.";
        continue;
      }

      lastStatus = response.status;
      const message =
        firstNonEmptyString([
          parsed?.code,
          parsed?.error,
          parsed?.message,
          parsed?.description,
          normalizeHttpErrorMessage(text),
          response.statusText,
        ]) || response.statusText;
      lastErrorText = `Create session payload failed (${response.status}): ${message}`;
      log("REST V2 create-session failed", {
        status: response.status,
        message,
        serviceProvider: context.serviceProviderId,
        appGuid: appCandidate.guid,
      });
      emitRestV2DebugEvent(debugFlowId, {
        source: "extension",
        phase: "create-session-failed-attempt",
        serviceProviderId: context.serviceProviderId,
        requestorId: context.requestorId,
        mvpd: context.mvpd,
        appGuid: appCandidate.guid,
        appName: appCandidate.appName || appCandidate.guid,
        status: response.status,
        error: message,
        responsePreview: truncateDebugText(text, 2000),
      });
    }
  }

  if (lastStatus > 0) {
    throw new Error(lastErrorText || `Create session failed (${lastStatus}).`);
  }
  throw new Error(lastErrorText || "Create session failed.");
}

async function fetchRestV2ConfigurationMvpds(programmer, appInfo, requestorId) {
  const response = await fetchWithPremiumAuth(
    programmer.programmerId,
    appInfo,
    `${REST_V2_BASE}/${encodeURIComponent(requestorId)}/configuration`,
    {
      method: "GET",
      mode: "cors",
      headers: buildRestV2Headers(requestorId, {
        Accept: "application/json",
      }),
    }
  );

  const text = await response.text().catch(() => "");
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      firstNonEmptyString([
        payload?.error?.code,
        payload?.error?.message,
        typeof payload?.error === "string" ? payload.error : "",
        payload?.message,
        normalizeHttpErrorMessage(text),
        response.statusText,
      ]) || response.statusText;
    throw new Error(`REST V2 configuration failed (${response.status}): ${message}`);
  }

  const mvpds = normalizeRestV2MvpdCollection(payload || {});
  const map = new Map();
  for (const item of mvpds) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return map;
}

function orderRestV2AppCandidatesForRequestor(restV2Apps, resolvedApp, requestorId) {
  const candidates = Array.isArray(restV2Apps) ? restV2Apps : [];
  const byGuid = new Map(candidates.filter((item) => item?.guid).map((item) => [item.guid, item]));
  const context = state.restV2AuthContextByRequestor.get(String(requestorId || "")) || {};
  const ordered = [];
  const seen = new Set();

  const pushCandidate = (candidate) => {
    if (!candidate?.guid || seen.has(candidate.guid)) {
      return;
    }
    seen.add(candidate.guid);
    ordered.push(candidate);
  };

  if (context.preferredAppGuid) {
    pushCandidate(byGuid.get(context.preferredAppGuid));
  }

  if (Array.isArray(context.candidateGuids)) {
    context.candidateGuids.forEach((guid) => {
      pushCandidate(byGuid.get(guid));
    });
  }

  pushCandidate(resolvedApp);
  candidates.forEach((candidate) => pushCandidate(candidate));
  return ordered;
}

async function fetchRestV2ConfigurationUsingCandidateApps(programmer, requestorId, orderedCandidates) {
  const candidates = Array.isArray(orderedCandidates) ? orderedCandidates.filter((item) => item?.guid) : [];
  if (candidates.length === 0) {
    throw new Error("No REST V2 app candidates available.");
  }

  const concurrency = Math.max(1, Number(REST_V2_CONFIG_ATTEMPT_CONCURRENCY) || 1);
  let lastError = null;

  for (let index = 0; index < candidates.length; index += concurrency) {
    const batch = candidates.slice(index, index + concurrency);
    const attempts = batch.map((appInfo) =>
      fetchRestV2ConfigurationMvpds(programmer, appInfo, requestorId)
        .then((map) => ({ map, appInfo }))
        .catch((error) => {
          const normalized = error instanceof Error ? error : new Error(String(error));
          lastError = normalized;
          log("REST V2 configuration attempt failed", {
            requestorId,
            programmerId: programmer?.programmerId || "",
            app: appInfo?.appName || appInfo?.guid || "unknown",
            error: normalized.message,
          });
          throw normalized;
        })
    );

    try {
      return await Promise.any(attempts);
    } catch {
      // Every attempt in this batch failed; continue to next candidate batch.
    }
  }

  throw lastError || new Error("Unable to load MVPDs via REST V2 configuration.");
}

async function loadMvpdsFromRestV2(requestorId) {
  if (!requestorId) {
    return new Map();
  }

  if (state.mvpdCacheByRequestor.has(requestorId)) {
    return state.mvpdCacheByRequestor.get(requestorId);
  }

  if (state.mvpdLoadPromiseByRequestor.has(requestorId)) {
    return state.mvpdLoadPromiseByRequestor.get(requestorId);
  }

  const loadPromise = (async () => {
    const programmers = getProgrammerCandidatesForRequestor(requestorId);
    if (programmers.length === 0) {
      throw new Error(`Unable to find a media company mapping for requestor ${requestorId}.`);
    }

    let lastError = null;
    let hasRestV2Candidate = false;
    for (const programmer of programmers) {
      try {
        const premiumApps = await ensurePremiumAppsForProgrammer(programmer);
        const restV2Apps = collectRestV2AppCandidatesFromPremiumApps(premiumApps);
        const resolvedApp = resolveRestV2AppForServiceProvider(restV2Apps, requestorId, programmer.programmerId);
        if (!resolvedApp) {
          continue;
        }

        hasRestV2Candidate = true;
        const orderedCandidates = orderRestV2AppCandidatesForRequestor(restV2Apps, resolvedApp, requestorId);
        const { map, appInfo } = await fetchRestV2ConfigurationUsingCandidateApps(
          programmer,
          requestorId,
          orderedCandidates
        );

        state.mvpdCacheByRequestor.set(requestorId, map);
        state.restV2AuthContextByRequestor.set(requestorId, {
          programmerId: programmer.programmerId,
          preferredAppGuid: appInfo.guid,
          candidateGuids: orderedCandidates.map((candidate) => candidate.guid).filter(Boolean),
        });
        log("MVPD menu loaded from REST V2 configuration.", {
          requestorId,
          programmerId: programmer.programmerId,
          app: appInfo.appName,
          count: map.size,
        });
        return map;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (!hasRestV2Candidate) {
      throw new Error(`No REST V2 scoped app mapping was found for RequestorId "${requestorId}".`);
    }
    throw lastError || new Error("Unable to load MVPDs via REST V2 configuration.");
  })();

  state.mvpdLoadPromiseByRequestor.set(requestorId, loadPromise);
  try {
    return await loadPromise;
  } finally {
    if (state.mvpdLoadPromiseByRequestor.get(requestorId) === loadPromise) {
      state.mvpdLoadPromiseByRequestor.delete(requestorId);
    }
  }
}

async function populateMvpdSelectForRequestor(requestorId) {
  els.mvpdSelect.innerHTML = "";
  const expectedRequestorId = String(requestorId || "");

  if (!requestorId) {
    els.mvpdSelect.disabled = true;
    els.mvpdSelect.innerHTML = '<option value="">-- Select Requestor first --</option>';
    state.selectedMvpdId = "";
    clearClickEsmMvpdMenusForRequestor(expectedRequestorId, "-- Select Requestor first --");
    refreshRestV2LoginPanels();
    return;
  }

  els.mvpdSelect.disabled = true;
  els.mvpdSelect.innerHTML = '<option value="">Loading MVPD menu (REST V2)...</option>';

  try {
    const merged = await loadMvpdsFromRestV2(requestorId);

    if (String(state.selectedRequestorId || "") !== expectedRequestorId) {
      return;
    }
    els.mvpdSelect.innerHTML = "";

    if (merged.size === 0) {
      els.mvpdSelect.disabled = true;
      els.mvpdSelect.innerHTML = '<option value="">-- No MVPDs available --</option>';
      state.selectedMvpdId = "";
      refreshRestV2LoginPanels();
      return;
    }

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Choose an MVPD --";
    els.mvpdSelect.appendChild(defaultOption);

    const entries = [...merged.entries()].sort((a, b) => {
      const aText = `${a[1].name || a[0]} (${a[0]})`;
      const bText = `${b[1].name || b[0]} (${b[0]})`;
      return String(aText).localeCompare(String(bText), undefined, { sensitivity: "base" });
    });

    for (const [mvpdId, meta] of entries) {
      const option = document.createElement("option");
      option.value = mvpdId;
      option.textContent = `${meta.name || mvpdId} (${mvpdId})`;
      option.style.fontWeight = meta.isProxy === false ? "700" : "400";
      els.mvpdSelect.appendChild(option);
    }

    els.mvpdSelect.disabled = false;
    state.selectedMvpdId = "";
    els.mvpdSelect.value = "";
    syncClickEsmMvpdMenusForRequestor(expectedRequestorId, merged);
    refreshRestV2LoginPanels();
    setStatus("", "info");
  } catch (error) {
    if (String(state.selectedRequestorId || "") !== expectedRequestorId) {
      return;
    }
    els.mvpdSelect.disabled = true;
    els.mvpdSelect.innerHTML = '<option value="">-- MVPD config unavailable --</option>';
    state.selectedMvpdId = "";
    clearClickEsmMvpdMenusForRequestor(expectedRequestorId, "-- MVPD config unavailable --");
    refreshRestV2LoginPanels();
    const reason = error instanceof Error ? error.message : String(error);
    setStatus(`REST V2 configuration failed for MVPD list: ${reason}`, "error");
  }
}

function createProgrammersError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function fetchProgrammersFromApi(options = {}) {
  const accessToken = options.accessToken || state.loginData?.accessToken || "";
  const requireEntities = options.requireEntities !== false;
  const endpoints = state.programmersApiEndpoint
    ? [state.programmersApiEndpoint, ...PROGRAMMER_ENDPOINTS.filter((item) => item !== state.programmersApiEndpoint)]
    : [...PROGRAMMER_ENDPOINTS];

  let lastError = null;
  let denied = false;
  for (const endpoint of endpoints) {
    try {
      const baseHeaders = {
        Accept: "application/json, text/plain, */*",
        "ap-request-id": generateRequestId(),
        Origin: "https://cdn.experience.adobe.net",
        Referer: "https://cdn.experience.adobe.net/",
      };

      const headerVariants = [baseHeaders];
      if (accessToken) {
        headerVariants.push({
          ...baseHeaders,
          Authorization: `Bearer ${accessToken}`,
        });
      }

      for (const headers of headerVariants) {
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          mode: "cors",
          headers,
        });

        if (response.status === 401 || response.status === 403) {
          denied = true;
          const body = await response.text();
          lastError = createProgrammersError(
            `Media company access denied (${response.status})${body ? `: ${body}` : ""}`,
            "PROGRAMMERS_ACCESS_DENIED"
          );
          continue;
        }

        if (!response.ok) {
          const body = await response.text();
          lastError = createProgrammersError(
            `Endpoint ${endpoint} failed (${response.status}): ${body || response.statusText}`,
            "PROGRAMMERS_ENDPOINT_FAILED"
          );
          continue;
        }

        const payload = await response.json();
        const normalizedEntities = normalizeProgrammersResponse(payload);
        if (requireEntities && normalizedEntities.length === 0) {
          lastError = createProgrammersError(`Endpoint ${endpoint} returned no media companies.`, "PROGRAMMERS_EMPTY");
          continue;
        }

        state.programmersApiEndpoint = endpoint;
        return normalizedEntities;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  if (denied) {
    throw lastError || createProgrammersError("Media company access denied.", "PROGRAMMERS_ACCESS_DENIED");
  }

  throw lastError || createProgrammersError("Unable to load media companies from API.", "PROGRAMMERS_LOAD_FAILED");
}

async function loadProgrammersData(accessToken = "") {
  if ((!state.loginData && !accessToken) || state.restricted) {
    resetWorkflowForLoggedOut();
    return;
  }

  try {
    const entities = await fetchProgrammersFromApi({
      accessToken: accessToken || state.loginData?.accessToken,
      requireEntities: false,
    });
    applyProgrammerEntities(entities);
    if (state.programmers.length === 0) {
      setStatus("No media company records were returned for this account.", "error");
    }
    return true;
  } catch (error) {
    log("Media company load failed", error);
    state.programmers = [];
    resetWorkflowForLoggedOut();
    throw error;
  }
}

function applyProgrammerEntities(entities) {
  state.programmers = entities.map((entity, index) => mapProgrammerEntity(entity, index));
  state.selectedMediaCompany = "";
  state.selectedRequestorId = "";
  state.selectedMvpdId = "";
  state.selectedProgrammerKey = "";
  state.mvpdCacheByRequestor.clear();
  state.mvpdLoadPromiseByRequestor.clear();
  state.restV2AuthContextByRequestor.clear();
  state.applicationsByProgrammerId.clear();
  state.premiumAppsByProgrammerId.clear();
  state.premiumAppsLoadPromiseByProgrammerId.clear();
  state.premiumSectionCollapsedByKey.clear();
  state.premiumPanelRequestToken = 0;
  state.restV2PrewarmedAppsByProgrammerId.clear();
  clearRestV2PreparedLoginState();
  populateMediaCompanySelect();
}

function createCookieSessionLoginData() {
  return {
    accessToken: "",
    expiresAt: 0,
    profile: null,
    imageUrl: "",
    adobePassOrg: {
      orgId: ADOBEPASS_ORG_HANDLE,
      userId: null,
      name: "@AdobePass",
      avatarUrl: "",
    },
  };
}

async function tryActivateCookieSession(source, options = {}) {
  const restrictOnDenied = options.restrictOnDenied === true;
  try {
    const entities = await fetchProgrammersFromApi({
      accessToken: "",
      requireEntities: false,
    });

    applyProgrammerEntities(entities);
    if (!state.loginData) {
      state.loginData = createCookieSessionLoginData();
    }

    try {
      const profileFromSession = await fetchImsSessionProfile("");
      if (profileFromSession && typeof profileFromSession === "object") {
        const mergedProfile = mergeProfilePayloads(resolveLoginProfile(state.loginData), profileFromSession);
        state.loginData = {
          ...state.loginData,
          profile: mergedProfile,
          imageUrl: resolveLoginImageUrl({
            ...state.loginData,
            profile: mergedProfile,
          }),
        };
      }
    } catch {
      // Ignore cookie-profile lookup errors.
    }

    state.sessionReady = true;
    state.restricted = false;
    clearRestrictedOrgOptions();
    clearRefreshTimer();
    render();

    if (state.programmers.length === 0) {
      setStatus("No media company records were returned for this account.", "error");
    } else {
      setStatus("", "info");
    }

    void hydrateCookieSessionWithProfile();

    log(`Cookie session activated (${source})`, { programmersCount: state.programmers.length });
    return true;
  } catch (error) {
    if (restrictOnDenied && error?.code === "PROGRAMMERS_ACCESS_DENIED") {
      await clearLoginData();
      resetWorkflowForLoggedOut();
      await ensureRestrictedOrgOptionsFromToken(state.loginData?.accessToken, state.loginData?.adobePassOrg || null);
      updateRestrictedContext(state.loginData, {
        recoveryLabel: "Cookie session is not mapped to AdobePass access. Sign in again with the AdobePass profile.",
      });
      state.loginData = null;
      state.sessionReady = false;
      state.restricted = true;
      setStatus("", "info");
      render();
    }
    return false;
  }
}

async function hydrateCookieSessionWithProfile() {
  if (!state.sessionReady || state.restricted) {
    return;
  }

  if (state.loginData?.accessToken) {
    return;
  }

  try {
    const silent = await attemptSilentBootstrapLogin();
    if (!silent) {
      const cookieProfile = await fetchImsSessionProfile("");
      if (cookieProfile && typeof cookieProfile === "object" && state.loginData) {
        const mergedProfile = mergeProfilePayloads(resolveLoginProfile(state.loginData), cookieProfile);
        state.loginData = {
          ...state.loginData,
          profile: mergedProfile,
          imageUrl: resolveLoginImageUrl({
            ...state.loginData,
            profile: mergedProfile,
          }),
        };
        state.avatarResolveKey = "";
        render();
      }
      return;
    }

    const enforced = await enforceAdobePassAccess(silent);
    if (!enforced.allowed || !enforced.loginData) {
      return;
    }

    const profileFromSession = await fetchImsSessionProfile(enforced.loginData.accessToken || "");
    const hydratedProfile = mergeProfilePayloads(resolveLoginProfile(enforced.loginData), profileFromSession);
    const hydratedImageUrl = resolveLoginImageUrl({
      ...enforced.loginData,
      profile: hydratedProfile,
    });

    const hydrated = {
      ...enforced.loginData,
      profile: hydratedProfile,
      imageUrl: hydratedImageUrl,
      adobePassOrg:
        enforced.loginData.adobePassOrg ||
        state.loginData?.adobePassOrg ||
        {
          orgId: ADOBEPASS_ORG_HANDLE,
          userId: null,
          name: "@AdobePass",
          avatarUrl: "",
        },
    };

    state.loginData = hydrated;
    state.avatarResolveKey = "";
    await saveLoginData(hydrated);
    scheduleNoTouchRefresh();
    render();
    log("Cookie session profile hydrated.");
  } catch (error) {
    log("Cookie session profile hydration skipped", error?.message || String(error));
  }
}

function renderBuildInfo() {
  const manifestVersion = chrome.runtime.getManifest().version;
  if (!els.buildInfo) {
    return;
  }
  els.buildInfo.textContent = `v${manifestVersion}`;
}

function renderRestrictedView() {
  if (
    !els.restrictedOrgSelect ||
    !els.restrictedOrgHint ||
    !els.restrictedOrgSwitchBtn ||
    !els.restrictedSignInBtn ||
    !els.restrictedSignOutBtn ||
    !els.restrictedLoginState ||
    !els.restrictedOrgState ||
    !els.restrictedRecoveryState
  ) {
    return;
  }

  const options = Array.isArray(state.restrictedOrgOptions) ? state.restrictedOrgOptions : [];
  if (options.length === 0) {
    state.selectedRestrictedOrgKey = "";
  } else if (!options.some((option) => option.key === state.selectedRestrictedOrgKey)) {
    state.selectedRestrictedOrgKey = options[0].key;
  }

  els.restrictedOrgSelect.innerHTML = "";
  if (options.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "-- No organizations available --";
    els.restrictedOrgSelect.appendChild(emptyOption);
  } else {
    for (const option of options) {
      const optionNode = document.createElement("option");
      optionNode.value = option.key;
      optionNode.textContent = option.isAdobePass ? `${option.label} (recommended)` : option.label;
      els.restrictedOrgSelect.appendChild(optionNode);
    }
  }

  els.restrictedOrgSelect.value = state.selectedRestrictedOrgKey || "";

  const actionsDisabled = state.busy || state.restrictedOrgSwitchBusy;
  els.restrictedOrgSelect.disabled = actionsDisabled || options.length === 0;
  els.restrictedOrgSwitchBtn.disabled = actionsDisabled || options.length === 0 || !state.selectedRestrictedOrgKey;
  els.restrictedOrgSwitchBtn.textContent = state.restrictedOrgSwitchBusy ? "Switching..." : "Switch Org";
  els.restrictedSignInBtn.disabled = actionsDisabled;
  els.restrictedSignOutBtn.disabled = actionsDisabled;

  if (!state.restrictedOrgLabel) {
    const selected = getSelectedRestrictedOrgOption();
    if (selected) {
      state.restrictedOrgLabel = `Selected org: ${selected.label}`;
    }
  }

  els.restrictedLoginState.textContent = state.restrictedLoginLabel || "Sign-in state is unknown.";
  els.restrictedOrgState.textContent = state.restrictedOrgLabel || "Detected org: Unknown org profile";
  els.restrictedRecoveryState.textContent =
    state.restrictedRecoveryLabel || "Auto-switch to @AdobePass is required for access.";

  const recommended = options.find((option) => option.isAdobePass);
  if (options.length === 0) {
    els.restrictedOrgHint.textContent =
      "No org profiles were returned from IMS. Click Sign In Again and choose the correct profile.";
  } else if (recommended) {
    els.restrictedOrgHint.textContent = `Recommended profile: ${recommended.label}`;
  } else {
    els.restrictedOrgHint.textContent = "Select your AdobePass org profile and click Switch Org.";
  }
}

function render() {
  if (state.restricted) {
    clearResolvedAvatar();
    closeAvatarMenu();
    els.authBtn.hidden = true;
    els.restrictedView.hidden = false;
    els.workflow.hidden = true;
    renderRestrictedView();
    return;
  }

  els.authBtn.hidden = false;
  els.restrictedView.hidden = true;
  els.workflow.hidden = !state.sessionReady;

  if (!state.sessionReady || !state.loginData) {
    clearResolvedAvatar();
    closeAvatarMenu();
    els.authBtn.classList.remove("avatar");
    els.authBtn.classList.remove("avatar-loading", "avatar-ready");
    els.authBtn.style.backgroundImage = "none";
    els.authBtn.setAttribute("aria-label", "Sign in to AdobePass");
    if (!state.busy) {
      els.authBtn.textContent = "Sign In";
      els.authBtn.title = "Sign in to AdobePass";
    }
    return;
  }

  const avatarUrl = getAvatarRenderUrl(state.loginData).replace(/"/g, "");
  els.authBtn.classList.add("avatar");
  els.authBtn.classList.toggle("avatar-loading", state.avatarResolving);
  els.authBtn.classList.toggle("avatar-ready", !state.avatarResolving);
  els.authBtn.style.backgroundImage = `url("${avatarUrl}"), url("${FALLBACK_AVATAR}")`;
  els.authBtn.textContent = "Account";
  els.authBtn.setAttribute("aria-label", `${getProfileDisplayName(resolveLoginProfile(state.loginData) || {})} account menu`);
  if (!state.busy) {
    els.authBtn.title = "Account menu";
  }
  renderAvatarMenu();
  void ensureResolvedAvatarUrl();
}

async function signInInteractive() {
  setBusy(true, "Signing in...");
  setStatus("", "info");

  try {
    const authData = await startLogin({ interactive: true, allowFallback: true });
    const profile = await resolveProfileAfterLogin(authData);
    const activated = await activateSession(
      {
        accessToken: authData.accessToken,
        expiresAt: authData.expiresAt,
        profile,
      },
      "interactive"
    );

    if (!activated) {
      const cookieActivated = await tryActivateCookieSession("interactive-post-login", {
        restrictOnDenied: true,
      });
      if (cookieActivated) {
        setStatus("", "info");
        return;
      }
      setStatus("", "info");
      return;
    }

    setStatus("", "info");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  } finally {
    setBusy(false);
    render();
  }
}

async function refreshSessionManual() {
  setBusy(true, "Refreshing session...");
  setStatus("", "info");

  try {
    let authData;
    try {
      authData = await startLogin({ interactive: false, allowFallback: false });
    } catch {
      authData = await startLogin({ interactive: true, allowFallback: true });
    }

    const profile = await resolveProfileAfterLogin(authData);
    const activated = await activateSession(
      {
        accessToken: authData.accessToken,
        expiresAt: authData.expiresAt,
        profile,
      },
      "manual-refresh"
    );

    if (!activated) {
      const cookieActivated = await tryActivateCookieSession("manual-refresh-post-login", {
        restrictOnDenied: true,
      });
      if (cookieActivated) {
        setStatus("", "info");
        return;
      }
      setStatus("", "info");
      return;
    }

    setStatus("", "info");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  } finally {
    setBusy(false);
    render();
  }
}

async function onRestrictedOrgSwitch() {
  if (state.busy || state.restrictedOrgSwitchBusy || !state.restricted) {
    return;
  }

  const selected = getSelectedRestrictedOrgOption();
  if (!selected) {
    state.restrictedRecoveryLabel = "Pick an org profile before switching.";
    setStatus("Choose an Adobe org profile before switching.", "error");
    render();
    return;
  }

  const strategies = buildOrgSwitchStrategies(selected);
  if (strategies.length === 0) {
    state.restrictedRecoveryLabel = "Selected profile does not include switchable identifiers.";
    setStatus("The selected org does not include switchable identifiers.", "error");
    render();
    return;
  }

  state.restrictedOrgSwitchBusy = true;
  state.restrictedOrgLabel = `Selected org: ${selected.label}`;
  state.restrictedRecoveryLabel = "Manual org switch in progress...";
  setStatus(`Switching org profile: ${selected.name || selected.orgId || "selected profile"}...`, "info");
  render();

  let lastError = null;
  try {
    for (const strategy of strategies) {
      try {
        const authData = await startLogin({
          extraParams: strategy,
          interactive: true,
          allowFallback: true,
        });
        const profile = await resolveProfileAfterLogin(authData);
        const activated = await activateSession(
          {
            accessToken: authData.accessToken,
            expiresAt: authData.expiresAt,
            profile,
          },
          "restricted-org-switch",
          { allowDeniedRecovery: false }
        );
        if (activated) {
          setStatus("", "info");
          return;
        }
      } catch (error) {
        lastError = error;
        log("Restricted org switch strategy failed", {
          strategy,
          error: error?.message || String(error),
        });
      }
    }

    const cookieActivated = await tryActivateCookieSession("restricted-org-switch", {
      restrictOnDenied: true,
    });
    if (cookieActivated) {
      setStatus("", "info");
      return;
    }

    if (lastError) {
      state.restrictedRecoveryLabel = "Manual org switch failed. Try Sign In Again or Sign Out and retry.";
      setStatus(lastError instanceof Error ? lastError.message : String(lastError), "error");
    } else {
      state.restrictedRecoveryLabel = "Manual org switch could not complete. Try Sign In Again.";
      setStatus("Unable to switch org profile. Try Sign In Again.", "error");
    }
  } finally {
    state.restrictedOrgSwitchBusy = false;
    render();
  }
}

async function onRestrictedSignInAgain() {
  if (state.busy || state.restrictedOrgSwitchBusy) {
    return;
  }
  state.restrictedRecoveryLabel = "Running full interactive sign-in flow.";
  await signInInteractive();
}

async function onRestrictedSignOut() {
  if (state.busy || state.restrictedOrgSwitchBusy) {
    return;
  }
  await signOutAndResetSession();
}

async function onAuthClick() {
  if (state.busy) {
    return;
  }

  if (!state.sessionReady) {
    await signInInteractive();
    return;
  }

  toggleAvatarMenu();
}

async function bootstrapSession() {
  if (state.isBootstrapping) {
    return;
  }

  state.isBootstrapping = true;
  setBusy(true, "Checking session...");
  setStatus("", "info");

  try {
    const stored = await loadStoredLoginData();
    if (stored) {
      try {
        const profile = await fetchProfile(stored.accessToken);
        const activated = await activateSession(
          {
            accessToken: stored.accessToken,
            expiresAt: stored.expiresAt,
            profile,
            adobePassOrg: stored.adobePassOrg || null,
          },
          "stored"
        );

        if (activated) {
          setStatus("", "info");
          return;
        }

        if (state.restricted) {
          setStatus("", "info");
          return;
        }
      } catch (error) {
        log("Stored session invalid", error);
        await clearLoginData();
      }
    }

    const cookieActivated = await tryActivateCookieSession("bootstrap-cookie-precheck", {
      restrictOnDenied: false,
    });
    if (cookieActivated) {
      return;
    }

    const silent = await attemptSilentBootstrapLogin();
    if (silent) {
      const activated = await activateSession(silent, "silent-bootstrap");
      if (activated) {
        setStatus("", "info");
        return;
      }

      if (state.restricted) {
        setStatus("", "info");
        return;
      }
    }

    resetWorkflowForLoggedOut();
    state.loginData = null;
    state.restricted = false;
    state.sessionReady = false;
    setStatus("", "info");
  } finally {
    state.isBootstrapping = false;
    setBusy(false);
    render();
  }
}

function registerEventHandlers() {
  els.authBtn.addEventListener("click", () => {
    void onAuthClick();
  });

  if (els.restrictedOrgSelect) {
    els.restrictedOrgSelect.addEventListener("change", (event) => {
      state.selectedRestrictedOrgKey = String(event.target.value || "");
      const selected = getSelectedRestrictedOrgOption();
      if (selected) {
        state.restrictedOrgLabel = `Selected org: ${selected.label}`;
      }
      renderRestrictedView();
    });
  }

  if (els.restrictedOrgSwitchBtn) {
    els.restrictedOrgSwitchBtn.addEventListener("click", () => {
      void onRestrictedOrgSwitch();
    });
  }

  if (els.restrictedSignInBtn) {
    els.restrictedSignInBtn.addEventListener("click", () => {
      void onRestrictedSignInAgain();
    });
  }

  if (els.restrictedSignOutBtn) {
    els.restrictedSignOutBtn.addEventListener("click", () => {
      void onRestrictedSignOut();
    });
  }

  if (els.signOutBtn) {
    els.signOutBtn.addEventListener("click", () => {
      void signOutAndResetSession();
    });
  }

  els.mediaCompanySelect.addEventListener("change", (event) => {
    state.selectedProgrammerKey = String(event.target.value || "");
    state.selectedRequestorId = "";
    state.selectedMvpdId = "";
    populateRequestorSelect();
    void refreshProgrammerPanels();
  });

  els.requestorSelect.addEventListener("change", (event) => {
    state.selectedRequestorId = String(event.target.value || "");
    state.selectedMvpdId = "";
    syncClickEsmRequestorMenus(getRequestorsForSelectedMediaCompany(), state.selectedRequestorId, {
      emptyLabel: "-- Select a Media Company first --",
    });
    void refreshProgrammerPanels();
    void populateMvpdSelectForRequestor(state.selectedRequestorId);
  });

  els.mvpdSelect.addEventListener("change", (event) => {
    state.selectedMvpdId = String(event.target.value || "");
    refreshRestV2LoginPanels();
    refreshEsmPanels();
    const decompState = getActiveDecompState();
    if (decompState) {
      decompBroadcastControllerState(decompState);
      syncDecompRecordingControls(decompState);
    }
  });

  document.addEventListener("click", (event) => {
    if (!state.avatarMenuOpen || !els.avatarMenu) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      closeAvatarMenu();
      return;
    }

    if (els.avatarMenu.contains(target) || els.authBtn.contains(target)) {
      return;
    }
    closeAvatarMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAvatarMenu();
    }
  });
}

function init() {
  ensureDecompRuntimeListener();
  ensureDecompWorkspaceTabWatcher();
  void renderBuildInfo();
  resetWorkflowForLoggedOut();
  registerEventHandlers();
  render();
  void bootstrapSession();
}

init();
