const IMS_CLIENT_ID = "adobeExperienceCloudDebugger";
const IMS_SCOPE =
  "AdobeID,openid,avatar,session,read_organizations,additional_info.job_function,additional_info.projectedProductContext,additional_info.account_type,additional_info.roles,additional_info.user_image_url,analytics_services";
const IMS_AUTHORIZE_URL = "https://ims-na1.adobelogin.com/ims/authorize/v1";
const IMS_BASE_URL = IMS_AUTHORIZE_URL.split("/ims/")[0];
const IMS_PROFILE_URL = "https://ims-na1.adobelogin.com/ims/profile/v1";
const IMS_ORGS_URL = "https://ims-na1.adobelogin.com/ims/organizations/v5";
const PPS_PROFILE_BASE_URL = "https://pps.services.adobe.com";
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
const PREMIUM_SERVICE_DISPLAY_ORDER = ["restV2", "decompTree", "degradation", "cm"];
const PREMIUM_SERVICE_SCOPE_BY_KEY = {
  degradation: "decisions:owner",
  esm: "analytics:client",
  restV2: "api:client:v2",
};
const REST_V2_SCOPE = PREMIUM_SERVICE_SCOPE_BY_KEY.restV2;
const PREMIUM_SERVICE_TITLE_BY_KEY = {
  cm: "Concurrency Monitoring",
  degradation: "Degradation",
  decompTree: "ESM",
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
const JWT_VALUE_REDACTION_PATTERN = /\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g;
const BEARER_TOKEN_REDACTION_PATTERN = /\bBearer\s+[A-Za-z0-9._~-]{20,}\b/gi;
const NAMED_TOKEN_VALUE_REDACTION_PATTERN =
  /\b(access[_\s-]?token|id[_\s-]?token|refresh[_\s-]?token)\b\s*([:=])\s*([A-Za-z0-9._~-]{16,})/gi;
const AUTH_DEBUGGER_PROTOCOL_VERSION = "1.3";
const RATE_LIMIT_MAX_RETRIES = 4;
const RATE_LIMIT_BASE_DELAY_MS = 1200;
const RATE_LIMIT_MAX_DELAY_MS = 60000;
const RATE_LIMIT_JITTER_MS = 400;
const REST_V2_CONFIG_ATTEMPT_CONCURRENCY = 2;
const REST_V2_PREPARED_LOGIN_MAX_AGE_MS = 2 * 60 * 1000;
const REST_V2_PROFILE_HARVEST_BUCKET_MAX = 120;
const REST_V2_PREAUTHORIZE_HISTORY_MAX = 120;
const REST_V2_DEFAULT_RESOURCE_ID_INPUT = "NBALPP";
const DEBUG_TEXT_PREVIEW_LIMIT = 12000;
const DEBUG_REDACT_SENSITIVE = false;
const UP_TRACE_VIEW_PATH = "up-devtools-panel.html";
const REST_V2_LOGIN_WINDOW_WIDTH = 980;
const REST_V2_LOGIN_WINDOW_HEIGHT = 860;
const REST_V2_LOGOUT_NAVIGATION_TIMEOUT_MS = 35000;
const REST_V2_LOGOUT_POST_NAV_DELAY_MS = 1200;
const ESM_AUTO_REFRESH_INTERVAL_MS = 60 * 1000;
const IMS_SESSION_MONITOR_INTERVAL_MS = 15 * 1000;
const IMS_SESSION_MONITOR_START_DELAY_MS = 1500;
const IMS_SESSION_MONITOR_BOOTSTRAP_COOLDOWN_MS = 20 * 1000;
const IMS_SESSION_MONITOR_INACTIVITY_GUARD_MS = 45 * 1000;
const IMS_SESSION_MONITOR_INACTIVE_CONFIRM_TICKS = 2;
const EXPERIENCE_CLOUD_SSO_TOKEN_ENDPOINT =
  "https://auth.services.adobe.com/signin/v2/tokens?credential=sso&checkReauth=false&puser=&t2Only=false&euid=&pbaPolicy=";
const EXPERIENCE_CLOUD_SSO_CLIENT_ID = "exc_app";
const EXPERIENCE_CLOUD_SILENT_PROFILE_FILTER =
  '{"findFirst":true, "fallbackToAA":true, "preferForwardProfile":true}; hasPC("dma_tartan")';
const CLICK_ESM_ENDPOINTS_PATH = "click-esm-endpoints.json";
const CLICK_ESM_TEMPLATE_PATH = "clickESM-template.html";
const CLICK_ESM_TEMPLATE_PLACEHOLDER_TITLE = "__UP_CLICK_ESM_TITLE__";
const CLICK_ESM_TEMPLATE_PLACEHOLDER_CID = "__UP_CID__";
const CLICK_ESM_TEMPLATE_PLACEHOLDER_CSC = "__UP_CSC__";
const CLICK_ESM_TEMPLATE_PLACEHOLDER_ACCESS_TOKEN = "__UP_ACCESS_TOKEN__";
const DECOMP_INLINE_RESULT_LIMIT = 100;
const DECOMP_CSV_RESULT_LIMIT = 10000;
const ESM_DEPRECATED_COLUMN_KEYS = new Set(["clientless-failures", "clientless-tokens"]);
const DECOMP_WORKSPACE_PATH = "decomp-workspace.html";
const DECOMP_MESSAGE_TYPE = "underpar:decomp";
const LEGACY_DECOMP_MESSAGE_TYPE = "mincloud:decomp";
const CM_WORKSPACE_PATH = "cm-workspace.html";
const CM_MESSAGE_TYPE = "underpar:cm";
const LEGACY_CM_MESSAGE_TYPE = "mincloud:cm";
const ESM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const CM_CONFIG_BASE_URL = "https://config.adobeprimetime.com";
const CM_REPORTS_BASE_URL = "https://cm-reports.adobeprimetime.com";
const CM_DEFAULT_TENANT_ORG_HINT = "adobe";
const CM_TENANT_ENDPOINT_CANDIDATES = [
  `${CM_CONFIG_BASE_URL}/core/tenants?orgId=${CM_DEFAULT_TENANT_ORG_HINT}`,
  `${CM_CONFIG_BASE_URL}/core/tenants?orgId=adobepass`,
];
const CM_TENANT_DETAIL_PATH_TEMPLATES = [
  `/core/tenants?orgId=${CM_DEFAULT_TENANT_ORG_HINT}`,
];
const CM_APPLICATIONS_PATH_TEMPLATES = [
  "/maitai/applications?orgId={tenantId}",
];
const CM_POLICIES_PATH_TEMPLATES = [
  "/maitai/policy?orgId={tenantId}",
];
const CM_USAGE_PATH_TEMPLATES = [
  "/v2/year/month",
  "/v2/year/month/duration",
  "/v2/year/month/mvpd",
  "/v2/year/month/mvpd/duration",
  "/v2/year/month/mvpd/duration/occurrences",
  "/v2/year/month/mvpd/duration/occurrences/activity-level",
  "/v2/year/month/mvpd/duration/occurrences/activity-level/day",
  "/v2/year/month/mvpd/duration/occurrences/activity-level/day/hour",
  "/v2/year/month/mvpd/duration/occurrences/activity-level/day/hour/tenant",
  "/v2/year/month/mvpd/concurrency-level",
  "/v2/year/month/mvpd/concurrency-level/tenant",
  "/v2/year/month/mvpd/concurrency-level/tenant/occurrences",
  "/v2/year/month/mvpd/concurrency-level/tenant/occurrences/day",
  "/v2/year/month/mvpd/concurrency-level/tenant/occurrences/day/duration",
  "/v2/year/month/mvpd/concurrency-level/tenant/occurrences/day/duration/hour",
];
const CM_BASE_URL_CANDIDATES = [
  CM_CONFIG_BASE_URL,
  CM_REPORTS_BASE_URL,
];
const CM_V2_API_BASE_DEFAULT = "https://streams-stage.adobeprimetime.com";
const CM_V2_OPERATION_DEFINITIONS = [
  {
    key: "metadata",
    label: "CM V2 Metadata",
    method: "GET",
    pathTemplate: "/v2/metadata",
    parameters: [],
  },
  {
    key: "running-streams",
    label: "CM V2 Running Streams",
    method: "GET",
    pathTemplate: "/v2/runningStreams/{idp}/{subject}",
    parameters: [
      { name: "idp", in: "path", required: true, description: "Identity provider / MVPD identifier." },
      { name: "subject", in: "path", required: true, description: "Subject (viewer/account identifier)." },
    ],
  },
  {
    key: "init-session",
    label: "CM V2 Init Session",
    method: "POST",
    pathTemplate: "/v2/sessions/{idp}/{subject}",
    parameters: [
      { name: "idp", in: "path", required: true, description: "Identity provider / MVPD identifier." },
      { name: "subject", in: "path", required: true, description: "Subject (viewer/account identifier)." },
      { name: "X-Terminate", in: "header", required: false, description: "Optional list of session IDs to terminate." },
    ],
  },
  {
    key: "heartbeat",
    label: "CM V2 Heartbeat",
    method: "POST",
    pathTemplate: "/v2/sessions/{idp}/{subject}/{session}",
    parameters: [
      { name: "idp", in: "path", required: true, description: "Identity provider / MVPD identifier." },
      { name: "subject", in: "path", required: true, description: "Subject (viewer/account identifier)." },
      { name: "session", in: "path", required: true, description: "Session identifier returned by init/evaluation." },
    ],
  },
  {
    key: "terminate-session",
    label: "CM V2 Terminate Session",
    method: "DELETE",
    pathTemplate: "/v2/sessions/{idp}/{subject}/{session}",
    parameters: [
      { name: "idp", in: "path", required: true, description: "Identity provider / MVPD identifier." },
      { name: "subject", in: "path", required: true, description: "Subject (viewer/account identifier)." },
      { name: "session", in: "path", required: true, description: "Session identifier to terminate." },
    ],
  },
];
const CM_AUTH_BOOTSTRAP_RETRY_MS = 5 * 60 * 1000;
const CM_MESSAGE_TYPES = new Set([CM_MESSAGE_TYPE, LEGACY_CM_MESSAGE_TYPE]);
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
const IMS_PROFILE_CLIENT_IDS = [IMS_CLIENT_ID, "AdobePass1", "exc_app"];
const IMS_VALIDATE_CLIENT_IDS = [IMS_CLIENT_ID, "AdobePass1", "exc_app"];
const AVATAR_CACHE_STORAGE_PREFIX = "underpar_avatar_cache_v2:";
const LEGACY_AVATAR_CACHE_STORAGE_PREFIX = "mincloudlogin_avatar_cache_v2:";
const AVATAR_MAX_LOCALSTORAGE_DATAURL_BYTES = 220000;
const AVATAR_PERSIST_STORAGE_PREFIX = "underpar_avatar_persist_v1:";
const LEGACY_AVATAR_PERSIST_STORAGE_PREFIX = "mincloudlogin_avatar_persist_v1:";
const AVATAR_PERSIST_GLOBAL_KEY = `${AVATAR_PERSIST_STORAGE_PREFIX}last`;
const LEGACY_AVATAR_PERSIST_GLOBAL_KEY = `${LEGACY_AVATAR_PERSIST_STORAGE_PREFIX}last`;
const AVATAR_PERSIST_TTL_SECONDS = 30 * 24 * 60 * 60;
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
  avatarDataUrlPrefetchKeys: new Set(),
  avatarMemoryCache: new Map(),
  loginData: null,
  programmers: [],
  selectedMediaCompany: "",
  selectedRequestorId: "",
  selectedMvpdId: "",
  selectedProgrammerKey: "",
  programmersApiEndpoint: null,
  refreshTimeoutId: null,
  silentRefreshPromise: null,
  mvpdCacheByRequestor: new Map(),
  mvpdLoadPromiseByRequestor: new Map(),
  restV2AuthContextByRequestor: new Map(),
  restV2PrewarmedAppsByProgrammerId: new Map(),
  restV2PreparedLoginBySelectionKey: new Map(),
  restV2PreparePromiseBySelectionKey: new Map(),
  restV2PrepareErrorBySelectionKey: new Map(),
  restV2ProfileHarvestBySelectionKey: new Map(),
  restV2ProfileHarvestByProgrammerId: new Map(),
  restV2ProfileHarvestBucketByProgrammerId: new Map(),
  restV2ProfileHarvestLast: null,
  restV2PreauthorizeHistoryByProgrammerId: new Map(),
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
  cmServiceByProgrammerId: new Map(),
  cmServiceLoadPromiseByProgrammerId: new Map(),
  cmTenantsCatalog: null,
  cmTenantsCatalogPromise: null,
  cmAuthBootstrapPromise: null,
  cmAuthBootstrapLastAttemptAt: 0,
  cmTenantBundleByTenantKey: new Map(),
  cmTenantBundlePromiseByTenantKey: new Map(),
  premiumSectionCollapsedByKey: new Map(),
  premiumPanelRequestToken: 0,
  dcrEnsureTokenPromiseByKey: new Map(),
  consoleContextReady: false,
  consoleContextPromise: null,
  isBootstrapping: false,
  sessionMonitorIntervalId: 0,
  sessionMonitorStartTimeoutId: 0,
  sessionMonitorBusy: false,
  sessionMonitorSuppressed: false,
  sessionMonitorLastProbeSource: "unknown",
  sessionMonitorInactivityGuardUntil: 0,
  sessionMonitorConsecutiveInactiveDetections: 0,
  sessionMonitorLastBootstrapAttemptAt: 0,
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
  cmWorkspaceTabId: 0,
  cmWorkspaceWindowId: 0,
  cmWorkspaceTabIdByWindowId: new Map(),
  cmRuntimeListenerBound: false,
  cmWorkspaceTabWatcherBound: false,
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
let clickEsmTemplateHtml = "";
let clickEsmTemplatePromise = null;

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

function getActivePremiumDebugFlowId() {
  if (state.restV2RecordingActive) {
    const restFlowId = String(state.restV2DebugFlowId || "").trim();
    if (restFlowId) {
      return restFlowId;
    }
  }
  return getActiveDecompDebugFlowId();
}

function resolveCmDebugFlowId(explicitFlowId = "") {
  const direct = String(explicitFlowId || "").trim();
  if (direct) {
    return direct;
  }
  return String(getActivePremiumDebugFlowId() || "").trim();
}

function detectCmAuthMode(headersLike) {
  if (!headersLike) {
    return "none";
  }

  let authorizationValue = "";
  if (headersLike instanceof Headers) {
    authorizationValue = String(headersLike.get("Authorization") || headersLike.get("authorization") || "").trim();
  } else if (typeof headersLike === "object") {
    const directValue =
      headersLike.Authorization ||
      headersLike.authorization ||
      headersLike.AUTHORIZATION ||
      headersLike["auth-header"] ||
      "";
    authorizationValue = String(directValue || "").trim();
  }

  if (!authorizationValue) {
    return "none";
  }
  if (/^basic\s+/i.test(authorizationValue)) {
    return "basic";
  }
  if (/^bearer\s+/i.test(authorizationValue)) {
    return "bearer";
  }
  return "custom";
}

function emitCmDebugEvent(event = {}, options = {}) {
  const flowId = resolveCmDebugFlowId(options.flowId || "");
  if (!flowId) {
    return;
  }

  const debugContext = options.context && typeof options.context === "object" ? options.context : {};
  emitRestV2DebugEvent(flowId, {
    source: "extension",
    service: "cm",
    requestorId: String(debugContext.requestorId || state.selectedRequestorId || ""),
    mvpd: String(debugContext.mvpd || state.selectedMvpdId || ""),
    programmerId: String(debugContext.programmerId || resolveSelectedProgrammer()?.programmerId || ""),
    ...event,
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

function redactSensitiveTokenValues(value) {
  const raw = String(value || "");
  if (!raw) {
    return "";
  }

  return raw
    .replace(BEARER_TOKEN_REDACTION_PATTERN, "Bearer <redacted>")
    .replace(NAMED_TOKEN_VALUE_REDACTION_PATTERN, (_match, tokenName, operator) => `${tokenName}${operator}<redacted>`)
    .replace(JWT_VALUE_REDACTION_PATTERN, "<redacted-jwt>");
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

  const redacted = redactSensitiveTokenValues(collapsed);
  if (!redacted) {
    return "";
  }

  return redacted.length > 220 ? `${redacted.slice(0, 217)}...` : redacted;
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

function isConsoleAuthWindowSuccessUrl(url) {
  const candidate = String(url || "").trim();
  if (!candidate) {
    return false;
  }

  try {
    const parsed = new URL(candidate);
    if (!/(^|\.)console\.auth\.adobe\.com$/i.test(parsed.hostname)) {
      return false;
    }

    if (parsed.pathname.startsWith("/oauth2/callback")) {
      return true;
    }
    if (parsed.pathname.startsWith("/rest/api/")) {
      return true;
    }
    if (parsed.searchParams.has("authorization_code") || parsed.searchParams.has("code")) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
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
      await runAuthInPopupWindow(authorizationCodeUrl, CONSOLE_AUTH_CALLBACK_PREFIX, {
        successUrlMatcher: isConsoleAuthWindowSuccessUrl,
      });
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

function stringifyJsonForDisplay(value) {
  if (value == null || value === "") {
    return "{}";
  }
  if (typeof value === "string") {
    const parsed = parseJsonText(value, null);
    if (parsed && typeof parsed === "object") {
      try {
        return JSON.stringify(parsed, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatTimestampLabel(value) {
  const raw = Number(value || 0);
  if (!Number.isFinite(raw) || raw <= 0) {
    return "Unknown";
  }
  return new Date(raw).toLocaleString();
}

function getRestV2HarvestRecordKey(harvest = null, index = 0) {
  if (!harvest || typeof harvest !== "object") {
    return `harvest-${index + 1}`;
  }
  return (
    buildRestV2ProfileHarvestBucketKey(harvest) ||
    [String(harvest.programmerId || ""), String(harvest.flowId || ""), String(harvest.harvestedAt || "")].join("|") ||
    `harvest-${index + 1}`
  );
}

function getRestV2PreauthorizeHistoryForProgrammer(programmer = null) {
  const programmerId =
    programmer && typeof programmer === "object" ? String(programmer.programmerId || "").trim() : String(programmer || "").trim();
  if (!programmerId) {
    return [];
  }
  const history = state.restV2PreauthorizeHistoryByProgrammerId.get(programmerId);
  if (!Array.isArray(history) || history.length === 0) {
    return [];
  }
  return history
    .filter((item) => item && typeof item === "object")
    .slice()
    .sort((left, right) => Number(right?.checkedAt || 0) - Number(left?.checkedAt || 0));
}

function storeRestV2PreauthorizeHistoryEntry(programmerId, entry = null) {
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!normalizedProgrammerId || !entry || typeof entry !== "object") {
    return [];
  }
  const existing = getRestV2PreauthorizeHistoryForProgrammer(normalizedProgrammerId);
  const next = [entry, ...existing]
    .filter((item) => item && typeof item === "object")
    .sort((left, right) => Number(right?.checkedAt || 0) - Number(left?.checkedAt || 0))
    .slice(0, REST_V2_PREAUTHORIZE_HISTORY_MAX);
  state.restV2PreauthorizeHistoryByProgrammerId.set(normalizedProgrammerId, next);
  return next;
}

function getRestV2SectionState(section) {
  if (!section) {
    return {
      selectedHarvestKey: "",
      expandedHarvestKey: "",
      hasProfileExpansionChoice: false,
      resourceInput: REST_V2_DEFAULT_RESOURCE_ID_INPUT,
      entitlementBusy: false,
      lastEntitlementResult: null,
    };
  }
  if (!section.__underparRestV2State || typeof section.__underparRestV2State !== "object") {
    section.__underparRestV2State = {
      selectedHarvestKey: "",
      expandedHarvestKey: "",
      hasProfileExpansionChoice: false,
      resourceInput: REST_V2_DEFAULT_RESOURCE_ID_INPUT,
      entitlementBusy: false,
      lastEntitlementResult: null,
    };
  }
  if (typeof section.__underparRestV2State.selectedHarvestKey !== "string") {
    section.__underparRestV2State.selectedHarvestKey = "";
  }
  if (typeof section.__underparRestV2State.expandedHarvestKey !== "string") {
    section.__underparRestV2State.expandedHarvestKey = "";
  }
  if (typeof section.__underparRestV2State.hasProfileExpansionChoice !== "boolean") {
    section.__underparRestV2State.hasProfileExpansionChoice = false;
  }
  if (typeof section.__underparRestV2State.resourceInput !== "string") {
    section.__underparRestV2State.resourceInput = REST_V2_DEFAULT_RESOURCE_ID_INPUT;
  }
  if (typeof section.__underparRestV2State.entitlementBusy !== "boolean") {
    section.__underparRestV2State.entitlementBusy = false;
  }
  return section.__underparRestV2State;
}

function parseRestV2ResourceIdInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }
  return dedupeRestV2CandidateStrings(
    raw
      .split(/[,\n\r;]+/g)
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  );
}

function formatRestV2CompactValue(value, maxLength = 44) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  const limit = Math.max(12, Number(maxLength) || 44);
  if (text.length <= limit) {
    return text;
  }
  const prefix = Math.max(4, Math.floor((limit - 3) * 0.6));
  const suffix = Math.max(4, limit - 3 - prefix);
  return `${text.slice(0, prefix)}...${text.slice(-suffix)}`;
}

function resolveRestV2AppInfoForHarvest(harvest = null) {
  if (!harvest || typeof harvest !== "object") {
    return null;
  }
  const programmerId = String(harvest.programmerId || "").trim();
  if (!programmerId) {
    return null;
  }

  const services = state.premiumAppsByProgrammerId.get(programmerId) || null;
  const restV2Candidates = collectRestV2AppCandidatesFromPremiumApps(services);
  const appGuid = String(harvest.appGuid || "").trim();
  if (appGuid) {
    const guidMatch = restV2Candidates.find((item) => String(item?.guid || "").trim() === appGuid);
    if (guidMatch?.guid) {
      return guidMatch;
    }
  }

  const requestorId = String(harvest.requestorId || "").trim();
  if (requestorId) {
    const mapped = resolveRestV2AppForServiceProvider(restV2Candidates, requestorId, programmerId);
    if (mapped?.guid) {
      return mapped;
    }
  }

  if (services?.restV2?.guid) {
    return services.restV2;
  }
  return restV2Candidates[0] || null;
}

function buildRestV2ContextFromHarvest(harvest = null) {
  if (!harvest || typeof harvest !== "object") {
    return null;
  }
  const programmerId = String(harvest.programmerId || "").trim();
  const requestorId = String(harvest.requestorId || harvest.serviceProviderId || "").trim();
  const serviceProviderId = String(harvest.serviceProviderId || harvest.requestorId || "").trim();
  const mvpd = String(harvest.mvpd || "").trim();
  const appInfo = resolveRestV2AppInfoForHarvest(harvest);
  if (!programmerId || !requestorId || !serviceProviderId || !mvpd || !appInfo?.guid) {
    return null;
  }
  return {
    ok: true,
    programmerId,
    programmerName: String(harvest.programmerName || "").trim(),
    requestorId,
    serviceProviderId,
    mvpd,
    appInfo,
    restV2AppCandidates: [appInfo],
  };
}

function normalizeRestV2DecisionVerdict(authorized = null) {
  if (authorized === true) {
    return "Permit";
  }
  if (authorized === false) {
    return "Deny";
  }
  return "Unknown";
}

function parseRestV2DecisionError(errorValue = null) {
  if (!errorValue || typeof errorValue !== "object") {
    return {
      errorCode: "",
      errorDetails: "",
    };
  }
  const errorCode = String(
    firstNonEmptyString([
      errorValue.code,
      errorValue.error,
      errorValue.action,
    ]) || ""
  ).trim();
  const messageValue = errorValue.message;
  const messageText =
    typeof messageValue === "string"
      ? messageValue
      : messageValue && typeof messageValue === "object"
        ? stringifyJsonForDisplay(messageValue)
        : "";
  const errorDetails = String(
    firstNonEmptyString([
      errorValue.details,
      messageText,
    ]) || ""
  ).trim();
  return {
    errorCode,
    errorDetails,
  };
}

function parseRestV2DecisionRowFromPayload(decisionValue = null, fallbackResourceId = "") {
  const decision = decisionValue && typeof decisionValue === "object" ? decisionValue : {};
  const resourceId = firstNonEmptyString([
    decision.resource,
    decision.resourceId,
    fallbackResourceId,
  ]);
  const authorized = typeof decision.authorized === "boolean" ? decision.authorized : null;
  const tokenValue = String(
    firstNonEmptyString([
      decision?.token?.serializedToken,
      decision?.token?.token,
      decision?.token?.mediaToken,
    ]) || ""
  ).trim();
  const errorDetails = parseRestV2DecisionError(decision.error);
  return {
    resourceId: String(resourceId || "").trim(),
    decision: normalizeRestV2DecisionVerdict(authorized),
    authorized,
    source: String(firstNonEmptyString([decision.source]) || "").trim(),
    serviceProvider: String(firstNonEmptyString([decision.serviceProvider]) || "").trim(),
    mvpd: String(firstNonEmptyString([decision.mvpd]) || "").trim(),
    errorCode: String(errorDetails.errorCode || "").trim(),
    errorDetails: String(errorDetails.errorDetails || "").trim(),
    mediaTokenPresent: Boolean(tokenValue),
    mediaTokenPreview: tokenValue ? formatRestV2CompactValue(tokenValue, 30) : "",
    mediaTokenNotBeforeMs: Number(decision?.token?.notBefore || 0),
    mediaTokenNotAfterMs: Number(decision?.token?.notAfter || 0),
    notBeforeMs: Number(decision?.notBefore || 0),
    notAfterMs: Number(decision?.notAfter || 0),
    raw: cloneJsonLikeValue(decision, {}),
  };
}

function mergeRestV2DecisionRowByResource(existing = null, incoming = null) {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  const existingRank =
    existing.decision === "Permit" ? 3 : existing.decision === "Deny" ? 2 : existing.decision === "Unknown" ? 1 : 0;
  const incomingRank =
    incoming.decision === "Permit" ? 3 : incoming.decision === "Deny" ? 2 : incoming.decision === "Unknown" ? 1 : 0;
  if (incomingRank > existingRank) {
    return incoming;
  }
  if (incomingRank === existingRank && Number(incoming.notAfterMs || 0) > Number(existing.notAfterMs || 0)) {
    return incoming;
  }
  return existing;
}

function extractRestV2PreauthorizeDecisionRows(payload, requestedResourceIds = []) {
  const requested = Array.isArray(requestedResourceIds)
    ? requestedResourceIds.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const decisions = Array.isArray(payload?.decisions) ? payload.decisions : [];
  const rowsByResource = new Map();

  decisions.forEach((decision) => {
    const row = parseRestV2DecisionRowFromPayload(decision);
    const key = String(row.resourceId || "").trim().toLowerCase();
    if (!key) {
      return;
    }
    const existing = rowsByResource.get(key) || null;
    rowsByResource.set(key, mergeRestV2DecisionRowByResource(existing, row));
  });

  requested.forEach((resourceId) => {
    const key = resourceId.toLowerCase();
    if (rowsByResource.has(key)) {
      return;
    }
    rowsByResource.set(
      key,
      parseRestV2DecisionRowFromPayload(
        {
          resource: resourceId,
          authorized: null,
          source: "",
        },
        resourceId
      )
    );
  });

  return [...rowsByResource.values()].sort((left, right) =>
    String(left?.resourceId || "").localeCompare(String(right?.resourceId || ""))
  );
}

function applyRestV2TopLevelErrorToDecisionRows(rows = [], payload = null) {
  const list = Array.isArray(rows) ? rows : [];
  const errorCode = String(
    firstNonEmptyString([
      payload?.code,
      payload?.error?.code,
      payload?.error,
    ]) || ""
  ).trim();
  const messageValue = payload?.message;
  const messageText =
    typeof messageValue === "string"
      ? messageValue
      : messageValue && typeof messageValue === "object"
        ? stringifyJsonForDisplay(messageValue)
        : "";
  const errorDetails = String(
    firstNonEmptyString([
      payload?.details,
      messageText,
    ]) || ""
  ).trim();

  if (!errorCode && !errorDetails) {
    return list;
  }
  return list.map((row) => ({
    ...row,
    errorCode: row?.errorCode ? String(row.errorCode) : errorCode,
    errorDetails: row?.errorDetails ? String(row.errorDetails) : errorDetails,
  }));
}

function summarizeRestV2PreauthorizeRows(rows = [], requestedResourceIds = []) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const permitCount = normalizedRows.filter((item) => String(item?.decision || "").trim().toLowerCase() === "permit").length;
  const denyCount = normalizedRows.filter((item) => String(item?.decision || "").trim().toLowerCase() === "deny").length;
  const unknownCount = normalizedRows.length - permitCount - denyCount;
  const requestedCount = Array.isArray(requestedResourceIds) ? requestedResourceIds.length : 0;
  const allRequestedPermitted = requestedCount > 0 && permitCount >= requestedCount && denyCount === 0 && unknownCount === 0;
  return {
    permitCount,
    denyCount,
    unknownCount,
    requestedCount,
    allRequestedPermitted,
  };
}

async function fetchRestV2PreauthorizeDecisions(harvest, resourceIds) {
  const serviceProviderId = String(harvest?.serviceProviderId || harvest?.requestorId || "").trim();
  const mvpd = String(harvest?.mvpd || "").trim();
  const programmerId = String(harvest?.programmerId || "").trim();
  if (!serviceProviderId || !mvpd) {
    throw new Error("Missing service provider or MVPD from the selected MVPD profile.");
  }
  if (!programmerId) {
    throw new Error("Missing programmer context for preauthorization.");
  }

  const appInfo = resolveRestV2AppInfoForHarvest(harvest);
  if (!appInfo?.guid) {
    throw new Error("Unable to resolve REST V2 application context for preauthorization.");
  }

  const endpointUrl = `${REST_V2_BASE}/${encodeURIComponent(serviceProviderId)}/decisions/preauthorize/${encodeURIComponent(mvpd)}`;
  const requestHeaders = buildRestV2Headers(serviceProviderId, {
    Accept: "application/json",
    "Content-Type": "application/json",
  });
  const requestBody = JSON.stringify({
    resources: resourceIds,
  });

  const flowId = String(harvest?.flowId || "").trim();
  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "preauthorize-request",
    method: "POST",
    url: endpointUrl,
    scope: "decisions-preauthorize",
    requestorId: String(harvest?.requestorId || ""),
    mvpd,
    programmerId,
    appGuid: String(appInfo?.guid || ""),
    appName: String(appInfo?.appName || appInfo?.guid || ""),
    authMode: "dcr_client_bearer",
    body: cloneJsonLikeValue({ resources: resourceIds }, {}),
  });

  const response = await fetchWithPremiumAuth(
    programmerId,
    appInfo,
    endpointUrl,
    {
      method: "POST",
      mode: "cors",
      headers: requestHeaders,
      body: requestBody,
    },
    "refresh",
    {
      flowId,
      requestorId: String(harvest?.requestorId || serviceProviderId || ""),
      mvpd,
      scope: "decisions-preauthorize",
      service: "rest-v2-entitlements",
      endpointUrl,
    }
  );
  const responseText = await response.text().catch(() => "");
  const parsedPayload = parseJsonText(responseText, null);
  const decisionRows = applyRestV2TopLevelErrorToDecisionRows(
    extractRestV2PreauthorizeDecisionRows(parsedPayload, resourceIds),
    parsedPayload
  );
  const decisionSummary = summarizeRestV2PreauthorizeRows(decisionRows, resourceIds);
  const checkedAt = Date.now();
  const checkedAtLabel = formatTimestampLabel(checkedAt);

  const result = {
    checkedAt,
    checkedAtLabel,
    ok: response.ok === true,
    status: Number(response.status || 0),
    statusText: String(response.statusText || "").trim(),
    programmerId,
    appGuid: String(appInfo?.guid || "").trim(),
    appName: String(appInfo?.appName || appInfo?.guid || "").trim(),
    authMode: "dcr_client_bearer",
    endpointUrl,
    requestBody: {
      resources: resourceIds.slice(),
    },
    serviceProviderId,
    requestorId: String(harvest?.requestorId || serviceProviderId || "").trim(),
    mvpd,
    harvestKey: getRestV2HarvestRecordKey(harvest),
    harvestCapturedAt: Number(harvest?.harvestedAt || 0),
    subject: String(harvest?.subject || "").trim(),
    upstreamUserId: String(harvest?.upstreamUserId || "").trim(),
    userId: String(harvest?.userId || "").trim(),
    profileKey: String(harvest?.profileKey || "").trim(),
    resourceIds: resourceIds.slice(),
    decisionRows,
    permitCount: decisionSummary.permitCount,
    denyCount: decisionSummary.denyCount,
    unknownCount: decisionSummary.unknownCount,
    allRequestedPermitted: decisionSummary.allRequestedPermitted,
    responsePreview: truncateDebugText(responseText, 3000),
    responsePayload: parsedPayload ?? responseText,
    error: "",
  };

  emitRestV2DebugEvent(flowId, {
    source: "extension",
    phase: "preauthorize-response",
    method: "POST",
    url: endpointUrl,
    scope: "decisions-preauthorize",
    status: result.status,
    statusText: result.statusText,
    requestorId: result.requestorId,
    mvpd: result.mvpd,
    programmerId,
    appGuid: result.appGuid,
    appName: result.appName,
    authMode: result.authMode,
    decisionRows: cloneJsonLikeValue(decisionRows, []),
    permitCount: result.permitCount,
    denyCount: result.denyCount,
    unknownCount: result.unknownCount,
    responsePreview: result.responsePreview,
  });

  if (!response.ok) {
    const errorCode = String(
      firstNonEmptyString([
        parsedPayload?.code,
        parsedPayload?.error?.code,
        parsedPayload?.error,
      ]) || ""
    ).trim();
    const errorMessage =
      firstNonEmptyString([
        errorCode,
        parsedPayload?.error?.code,
        parsedPayload?.error,
        parsedPayload?.details,
        parsedPayload?.message,
        normalizeHttpErrorMessage(responseText),
        result.statusText,
      ]) || `HTTP ${result.status}`;
    const errorHint =
      Number(result.status || 0) === 401
        ? "REST V2 rejected the client bearer token. UnderPAR uses DCR auth for this API, and token refresh is automatic."
        : "";
    result.error = errorHint ? `${errorMessage}. ${errorHint}` : errorMessage;
    throw Object.assign(new Error(`Preauthorization failed (${result.status}): ${errorMessage}`), { underparResult: result });
  }

  return result;
}

function renderRestV2ProfileHistoryTool(section, harvestList = []) {
  const tool = section?.querySelector(".rest-v2-profile-history-tool");
  const countElement = section?.querySelector(".rest-v2-profile-count");
  const listElement = section?.querySelector(".rest-v2-profile-list");
  if (!tool || !listElement || !countElement) {
    return null;
  }

  const sectionState = getRestV2SectionState(section);
  const records = (Array.isArray(harvestList) ? harvestList : [])
    .filter((item) => item && typeof item === "object")
    .map((harvest, index) => ({
      harvest,
      key: getRestV2HarvestRecordKey(harvest, index),
      capturedAtLabel: formatTimestampLabel(harvest?.harvestedAt),
      title: `${String(harvest?.requestorId || "").trim() || "requestor"} x ${String(harvest?.mvpd || "").trim() || "mvpd"}`,
      subtitle: firstNonEmptyString([
        String(harvest?.subject || "").trim(),
        String(harvest?.upstreamUserId || "").trim(),
        String(harvest?.userId || "").trim(),
        "No subject",
      ]),
      statusLabel: String(harvest?.profileCheckOutcome || "").trim() || "unknown",
    }));

  if (records.length === 0) {
    tool.hidden = true;
    countElement.textContent = "0";
    listElement.innerHTML = "";
    sectionState.selectedHarvestKey = "";
    sectionState.expandedHarvestKey = "";
    sectionState.hasProfileExpansionChoice = false;
    return null;
  }

  tool.hidden = false;
  countElement.textContent = String(records.length);
  let selected = records.find((item) => item.key === sectionState.selectedHarvestKey) || records[0];
  sectionState.selectedHarvestKey = selected.key;
  let expandedHarvestKey = String(sectionState.expandedHarvestKey || "").trim();
  if (expandedHarvestKey && !records.some((item) => item.key === expandedHarvestKey)) {
    expandedHarvestKey = "";
  }
  if (!expandedHarvestKey && sectionState.hasProfileExpansionChoice !== true) {
    expandedHarvestKey = selected.key;
  }
  sectionState.expandedHarvestKey = expandedHarvestKey;

  listElement.innerHTML = records
    .map(
      (record) => {
        const isSelected = record.key === selected.key;
        const isExpanded = record.key === expandedHarvestKey;
        const selectedHarvest = record.harvest;
        const profileCount = Number(selectedHarvest?.profileCount || 0);
        const profileKey = String(selectedHarvest?.profileKey || "").trim() || "N/A";
        const sessionId = String(selectedHarvest?.sessionId || "").trim() || "N/A";
        const profileCheck =
          selectedHarvest?.profileCheck && typeof selectedHarvest.profileCheck === "object" ? selectedHarvest.profileCheck : {};
        const profileTtlText = `${
          Number(selectedHarvest?.notBeforeMs || 0) > 0 ? formatTimestampLabel(selectedHarvest.notBeforeMs) : "N/A"
        } -> ${Number(selectedHarvest?.notAfterMs || 0) > 0 ? formatTimestampLabel(selectedHarvest.notAfterMs) : "N/A"}`;
        const profileStatusText = `${String(selectedHarvest?.profileCheckOutcome || "unknown")} | HTTP ${
          Number(profileCheck?.status || 0) || 0
        } ${String(profileCheck?.statusText || "").trim()}`.trim();
        const attributes =
          selectedHarvest?.profileAttributes && typeof selectedHarvest.profileAttributes === "object"
            ? Object.entries(selectedHarvest.profileAttributes)
            : [];
        const factRows = [
          ["Requestor", String(selectedHarvest?.requestorId || "").trim() || "N/A"],
          ["Service Provider", String(selectedHarvest?.serviceProviderId || "").trim() || "N/A"],
          ["MVPD", String(selectedHarvest?.mvpd || "").trim() || "N/A"],
          [
            "Subject",
            firstNonEmptyString([String(selectedHarvest?.subject || "").trim(), String(record.subtitle || "").trim(), "N/A"]),
          ],
          ["Session ID", sessionId],
          ["Profiles Returned", String(profileCount)],
          ["Profile TTL", profileTtlText],
          ["Profile Check", profileStatusText || "N/A"],
          ["Next Action", "Ready for Can I watch? and CM inputs"],
        ];
        const factCards = factRows
          .map(
            ([label, value]) => `
          <div class="rest-v2-profile-fact">
            <span class="rest-v2-profile-fact-label">${escapeHtml(label)}</span>
            <span class="rest-v2-profile-fact-value">${escapeHtml(formatRestV2CompactValue(String(value || ""), 120) || "N/A")}</span>
          </div>
        `
          )
          .join("");
        const attributeMarkup =
          attributes.length > 0
            ? `
            <div class="rest-v2-profile-attributes">
              <p class="rest-v2-profile-attributes-title">Profile Attributes</p>
              <ul class="rest-v2-profile-attributes-list">
                ${attributes
                  .map(
                    ([key, value]) => `
                  <li class="rest-v2-profile-attributes-item">
                    <span class="rest-v2-profile-attributes-key">${escapeHtml(String(key || "").trim())}</span>
                    <span class="rest-v2-profile-attributes-value">${escapeHtml(
                      formatRestV2CompactValue(String(value || "").trim(), 120) || "N/A"
                    )}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          `
            : `<p class="rest-v2-profile-attributes-empty">No profile attributes returned.</p>`;
        return `
      <li class="rest-v2-profile-item${isSelected ? " active" : ""}${isExpanded ? " expanded" : ""}">
        <article class="rest-v2-profile-card">
          <div class="rest-v2-profile-card-head">
            <button
              type="button"
              class="rest-v2-profile-card-toggle${isSelected ? " active" : ""}"
              data-harvest-key="${escapeHtml(record.key)}"
              aria-expanded="${isExpanded ? "true" : "false"}"
            >
              <span class="rest-v2-profile-entry-title">
                <span>${escapeHtml(record.title)}</span>
                <span class="rest-v2-profile-collapse-icon" aria-hidden="true">▼</span>
              </span>
              <span class="rest-v2-profile-entry-meta">${escapeHtml(record.subtitle)} | ${escapeHtml(record.capturedAtLabel)}</span>
            </button>
            <button
              type="button"
              class="rest-v2-profile-delete-btn"
              data-harvest-key="${escapeHtml(record.key)}"
              aria-label="Delete captured MVPD profile"
              title="Delete captured MVPD profile"
            >×</button>
          </div>
          <div class="rest-v2-profile-card-body"${isExpanded ? "" : " hidden"}>
            <p class="rest-v2-profile-details-meta">
              subject=${escapeHtml(record.subtitle)} | profileKey=${escapeHtml(profileKey)} | session=${escapeHtml(
          sessionId
        )} | profiles=${escapeHtml(String(profileCount))} | status=${escapeHtml(record.statusLabel)}
            </p>
            <div class="rest-v2-profile-facts-grid">${factCards}</div>
            ${attributeMarkup}
          </div>
        </article>
      </li>
    `
      }
    )
    .join("");
  return selected.harvest;
}

function renderRestV2EntitlementTool(section, programmerId, selectedHarvest = null) {
  const tool = section?.querySelector(".rest-v2-entitlement-tool");
  const contextElement = section?.querySelector(".rest-v2-entitlement-context");
  const inputElement = section?.querySelector(".rest-v2-resource-input");
  const buttonElement = section?.querySelector(".rest-v2-entitlement-go-btn");
  const statusElement = section?.querySelector(".rest-v2-entitlement-status");
  const summaryElement = section?.querySelector(".rest-v2-entitlement-summary");
  if (!tool || !contextElement || !inputElement || !buttonElement || !statusElement || !summaryElement) {
    return;
  }

  const sectionState = getRestV2SectionState(section);
  if (!selectedHarvest || typeof selectedHarvest !== "object") {
    tool.hidden = true;
    return;
  }

  tool.hidden = false;
  contextElement.textContent = `Using MVPD profile ${String(selectedHarvest.requestorId || "").trim() || "requestor"} x ${
    String(selectedHarvest.mvpd || "").trim() || "mvpd"
  } | subject=${formatRestV2CompactValue(firstNonEmptyString([
    String(selectedHarvest.subject || "").trim(),
    String(selectedHarvest.upstreamUserId || "").trim(),
    String(selectedHarvest.userId || "").trim(),
    "no subject",
  ]), 42)}.`;

  if (typeof sectionState.resourceInput !== "string" || !sectionState.resourceInput.trim()) {
    sectionState.resourceInput = REST_V2_DEFAULT_RESOURCE_ID_INPUT;
  }
  if (document.activeElement !== inputElement) {
    inputElement.value = sectionState.resourceInput;
  }

  const busy = sectionState.entitlementBusy === true;
  inputElement.disabled = busy;
  buttonElement.disabled = busy;
  buttonElement.textContent = busy ? "GO..." : "GO";

  const harvestKey = getRestV2HarvestRecordKey(selectedHarvest);
  const history = getRestV2PreauthorizeHistoryForProgrammer(programmerId);
  const historyResult = history.find((item) => String(item?.harvestKey || "") === harvestKey) || history[0] || null;
  const currentResult =
    sectionState.lastEntitlementResult && typeof sectionState.lastEntitlementResult === "object"
      ? sectionState.lastEntitlementResult
      : historyResult;

  if (currentResult && typeof currentResult === "object" && !busy) {
    sectionState.lastEntitlementResult = currentResult;
    const verdict = currentResult.allRequestedPermitted ? "YES" : "NO";
    const verdictClass = currentResult.allRequestedPermitted ? "success" : "error";
    const statusPrefix = `Can I watch? ${verdict}`;
    const authLabel =
      String(currentResult.authMode || "").trim() === "dcr_client_bearer"
        ? `Auth: DCR bearer (${String(currentResult.appName || currentResult.appGuid || "REST V2 app").trim() || "REST V2 app"})`
        : "Auth: unknown";
    const statusText =
      currentResult.error && !currentResult.ok
        ? `${statusPrefix} (${currentResult.error})`
        : `${statusPrefix} (${currentResult.permitCount} permit, ${currentResult.denyCount} deny, ${currentResult.unknownCount} unknown)`;
    statusElement.classList.remove("success", "error");
    statusElement.classList.add(verdictClass);
    statusElement.textContent = statusText;

    summaryElement.hidden = false;
    const decisionRows = Array.isArray(currentResult.decisionRows) ? currentResult.decisionRows : [];
    const hasAuthenticatedProfileMissing =
      String(currentResult.error || "").toLowerCase().includes("authenticated_profile_missing") ||
      decisionRows.some((row) => String(row?.errorCode || "").trim().toLowerCase() === "authenticated_profile_missing");
    const summaryItems = decisionRows
      .map((row) => {
        const decisionRaw = String(row?.decision || "").trim().toLowerCase();
        const cssClass =
          decisionRaw === "permit" ? "permit" : decisionRaw === "deny" ? "deny" : decisionRaw ? "unknown" : "unknown";
        const errorCode = String(row?.errorCode || "").trim();
        const errorDetails = String(row?.errorDetails || "").trim();
        const sourceLabel = String(row?.source || "").trim() || "N/A";
        const mediaTokenLabel = row?.mediaTokenPresent ? String(row?.mediaTokenPreview || "present") : "none";
        const reasonText = errorCode
          ? `${errorCode}${errorDetails ? `: ${formatRestV2CompactValue(errorDetails, 90)}` : ""}`
          : sourceLabel && sourceLabel !== "N/A"
            ? `source=${sourceLabel}`
            : "No additional details";
        return `
          <li class="rest-v2-entitlement-decision ${cssClass}">
            <span class="rest-v2-entitlement-decision-resource">${escapeHtml(String(row?.resourceId || ""))}</span>
            <span class="rest-v2-entitlement-decision-badge ${cssClass}">${escapeHtml(String(row?.decision || "Unknown"))}</span>
            <span class="rest-v2-entitlement-decision-reason">${escapeHtml(reasonText)}</span>
            <span class="rest-v2-entitlement-decision-meta">${escapeHtml(`source=${sourceLabel} | mediaToken=${mediaTokenLabel}`)}</span>
          </li>
        `;
      })
      .join("");
    const guidanceMarkup = hasAuthenticatedProfileMissing
      ? `<p class="rest-v2-entitlement-guidance">Profile is no longer active for this MVPD session. Run START RECORDING MVPD login again, then retry Can I watch?.</p>`
      : "";
    summaryElement.innerHTML = `
      <p class="rest-v2-entitlement-summary-head">
        <strong>Request:</strong> ${escapeHtml((currentResult.resourceIds || []).join(", "))}
        <span> | ${escapeHtml(formatTimestampLabel(currentResult.checkedAt))}</span>
      </p>
      ${guidanceMarkup}
      <ul class="rest-v2-entitlement-decision-list">${summaryItems}</ul>
      <p class="rest-v2-entitlement-summary-meta">${escapeHtml(
        `${authLabel} | POST ${String(currentResult.endpointUrl || "").trim()} | HTTP ${Number(currentResult.status || 0)} ${
          String(currentResult.statusText || "").trim() || ""
        }`
      )}</p>
    `;
    return;
  }

  statusElement.classList.remove("success", "error");
  statusElement.textContent = busy
    ? "Running entitlement check against REST V2 Decisions..."
    : "Enter resourceIds, then press Enter or GO to check authorization.";
  summaryElement.hidden = true;
  summaryElement.innerHTML = "";
}

function syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo) {
  if (!section) {
    return;
  }
  const context = buildCurrentRestV2SelectionContext(programmer, appInfo);
  const programmerId = context?.ok
    ? String(context.programmerId || "").trim()
    : String(programmer?.programmerId || resolveSelectedProgrammer()?.programmerId || "").trim();

  if (!programmerId) {
    const historyTool = section.querySelector(".rest-v2-profile-history-tool");
    const entitlementTool = section.querySelector(".rest-v2-entitlement-tool");
    if (historyTool) {
      historyTool.hidden = true;
    }
    if (entitlementTool) {
      entitlementTool.hidden = true;
    }
    return;
  }

  const harvestList = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
  const selectedHarvest = renderRestV2ProfileHistoryTool(section, harvestList);
  renderRestV2EntitlementTool(section, programmerId, selectedHarvest);
}

async function runRestV2EntitlementCheck(section, programmer, appInfo) {
  if (!section) {
    return;
  }
  const sectionState = getRestV2SectionState(section);
  if (sectionState.entitlementBusy === true) {
    return;
  }

  const context = buildCurrentRestV2SelectionContext(programmer, appInfo);
  const programmerId = context?.ok
    ? String(context.programmerId || "").trim()
    : String(programmer?.programmerId || resolveSelectedProgrammer()?.programmerId || "").trim();
  if (!programmerId) {
    setStatus("Select a media company before running entitlement checks.", "error");
    return;
  }

  const harvestList = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
  if (harvestList.length === 0) {
    setStatus("No successful MVPD profile captures are available yet.", "error");
    return;
  }

  let selectedHarvest =
    harvestList.find((item, index) => getRestV2HarvestRecordKey(item, index) === sectionState.selectedHarvestKey) || harvestList[0];
  sectionState.selectedHarvestKey = getRestV2HarvestRecordKey(selectedHarvest, 0);

  const inputElement = section.querySelector(".rest-v2-resource-input");
  if (inputElement && document.activeElement === inputElement) {
    sectionState.resourceInput = String(inputElement.value || "");
  }
  const resourceIds = parseRestV2ResourceIdInput(sectionState.resourceInput);
  if (resourceIds.length === 0) {
    sectionState.lastEntitlementResult = {
      checkedAt: Date.now(),
      ok: false,
      status: 0,
      statusText: "",
      endpointUrl: "",
      serviceProviderId: String(selectedHarvest?.serviceProviderId || selectedHarvest?.requestorId || "").trim(),
      requestorId: String(selectedHarvest?.requestorId || "").trim(),
      mvpd: String(selectedHarvest?.mvpd || "").trim(),
      harvestKey: sectionState.selectedHarvestKey,
      resourceIds: [],
      decisionRows: [],
      permitCount: 0,
      denyCount: 0,
      unknownCount: 0,
      allRequestedPermitted: false,
      responsePayload: {},
      error: "Enter at least one resourceId (comma-delimited supported).",
      programmerId,
    };
    setStatus("Enter at least one resourceId (comma-delimited supported).", "error");
    syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);
    return;
  }

  sectionState.entitlementBusy = true;
  sectionState.lastEntitlementResult = null;
  syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);

  try {
    const preflightContext = buildRestV2ContextFromHarvest(selectedHarvest);
    if (!preflightContext) {
      throw new Error("Selected MVPD profile is missing REST V2 application context.");
    }
    const preflightFlowId = String(selectedHarvest?.flowId || "").trim();
    const preflight = await fetchRestV2ProfileCheckResult(
      preflightContext,
      preflightFlowId,
      "profiles-preauthorize-preflight"
    );
    if (preflight?.harvestedProfile && isUsableRestV2ProfileHarvest(preflight.harvestedProfile)) {
      const refreshedHarvest = storeRestV2ProfileHarvest(preflightContext, preflight, preflightFlowId);
      if (refreshedHarvest && isUsableRestV2ProfileHarvest(refreshedHarvest)) {
        selectedHarvest = refreshedHarvest;
        sectionState.selectedHarvestKey = getRestV2HarvestRecordKey(selectedHarvest);
      }
    }
    if (!preflight?.ok || Number(preflight?.profileCount || 0) <= 0) {
      const preflightPayload = preflight?.responsePayload && typeof preflight.responsePayload === "object" ? preflight.responsePayload : {};
      const preflightCode = String(
        firstNonEmptyString([
          preflightPayload?.code,
          preflightPayload?.error?.code,
          preflightPayload?.error,
          Number(preflight?.profileCount || 0) <= 0 ? "authenticated_profile_missing" : "",
        ]) || "authenticated_profile_missing"
      ).trim();
      const preflightMessage = String(
        firstNonEmptyString([
          preflightPayload?.details,
          preflightPayload?.message,
          preflight?.error,
          "The authenticated profile associated with this request is missing or expired.",
        ]) || "The authenticated profile associated with this request is missing or expired."
      ).trim();
      const guidance = "Re-run START RECORDING MVPD login to refresh the profile, then retry Can I watch?.";
      const preflightResult = {
        checkedAt: Date.now(),
        ok: false,
        status: Number(preflight?.status || 403),
        statusText: String(preflight?.statusText || "").trim(),
        programmerId,
        appGuid: String(preflightContext?.appInfo?.guid || "").trim(),
        appName: String(preflightContext?.appInfo?.appName || preflightContext?.appInfo?.guid || "").trim(),
        authMode: "dcr_client_bearer",
        endpointUrl: String(preflight?.url || "").trim(),
        requestBody: {
          resources: resourceIds.slice(),
        },
        serviceProviderId: String(selectedHarvest?.serviceProviderId || selectedHarvest?.requestorId || "").trim(),
        requestorId: String(selectedHarvest?.requestorId || "").trim(),
        mvpd: String(selectedHarvest?.mvpd || "").trim(),
        harvestKey: sectionState.selectedHarvestKey,
        harvestCapturedAt: Number(selectedHarvest?.harvestedAt || 0),
        subject: String(selectedHarvest?.subject || "").trim(),
        upstreamUserId: String(selectedHarvest?.upstreamUserId || "").trim(),
        userId: String(selectedHarvest?.userId || "").trim(),
        profileKey: String(selectedHarvest?.profileKey || "").trim(),
        resourceIds: resourceIds.slice(),
        decisionRows: resourceIds.map((resourceId) => ({
          resourceId: String(resourceId || "").trim(),
          decision: "Unknown",
          authorized: null,
          source: "",
          serviceProvider: "",
          mvpd: String(selectedHarvest?.mvpd || "").trim(),
          errorCode: preflightCode,
          errorDetails: preflightMessage,
          mediaTokenPresent: false,
          mediaTokenPreview: "",
          mediaTokenNotBeforeMs: 0,
          mediaTokenNotAfterMs: 0,
          notBeforeMs: 0,
          notAfterMs: 0,
          raw: {},
        })),
        permitCount: 0,
        denyCount: 0,
        unknownCount: resourceIds.length,
        allRequestedPermitted: false,
        responsePreview: String(preflight?.responsePreview || "").trim(),
        responsePayload: preflightPayload,
        error: `${preflightCode}: ${preflightMessage}. ${guidance}`,
      };
      throw Object.assign(new Error(preflightResult.error), { underparResult: preflightResult });
    }

    const result = await fetchRestV2PreauthorizeDecisions(selectedHarvest, resourceIds);
    const enrichedResult = {
      ...result,
      programmerId,
    };
    sectionState.lastEntitlementResult = enrichedResult;
    storeRestV2PreauthorizeHistoryEntry(programmerId, enrichedResult);
    if (result.allRequestedPermitted) {
      setStatus(`Can I watch? YES for ${resourceIds.join(", ")} (${result.requestorId} x ${result.mvpd}).`, "success");
    } else {
      setStatus(
        `Can I watch? NO for ${resourceIds.join(", ")} (${result.requestorId} x ${result.mvpd}) (${result.permitCount} permit / ${result.denyCount} deny / ${result.unknownCount} unknown).`,
        "error"
      );
    }
  } catch (error) {
    const resultFromError = error?.underparResult && typeof error.underparResult === "object" ? error.underparResult : null;
    if (resultFromError) {
      const enrichedResult = {
        ...resultFromError,
        programmerId,
      };
      sectionState.lastEntitlementResult = enrichedResult;
      storeRestV2PreauthorizeHistoryEntry(programmerId, enrichedResult);
    }
    const displayError = resultFromError?.error || (error instanceof Error ? error.message : String(error));
    setStatus(displayError, "error");
  } finally {
    sectionState.entitlementBusy = false;
    syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);
  }
}

function wireRestV2ProfileAndEntitlementHandlers(section, programmer, appInfo) {
  if (!section || section.__underparRestV2HandlersBound) {
    return;
  }
  section.__underparRestV2HandlersBound = true;

  const listElement = section.querySelector(".rest-v2-profile-list");
  if (listElement) {
    listElement.addEventListener("click", (event) => {
      const deleteButton = event.target instanceof Element ? event.target.closest(".rest-v2-profile-delete-btn") : null;
      if (deleteButton) {
        event.preventDefault();
        event.stopPropagation();
        const sectionState = getRestV2SectionState(section);
        const harvestKey = String(deleteButton.dataset.harvestKey || "").trim();
        const context = buildCurrentRestV2SelectionContext(programmer, appInfo);
        const programmerId = context?.ok
          ? String(context.programmerId || "").trim()
          : String(programmer?.programmerId || resolveSelectedProgrammer()?.programmerId || "").trim();
        if (!programmerId || !harvestKey) {
          return;
        }
        const removed = removeRestV2ProfileHarvestByRecordKey(programmerId, harvestKey);
        if (!removed) {
          return;
        }
        if (sectionState.selectedHarvestKey === harvestKey) {
          sectionState.selectedHarvestKey = "";
          sectionState.lastEntitlementResult = null;
        }
        if (sectionState.expandedHarvestKey === harvestKey) {
          sectionState.expandedHarvestKey = "";
        }
        sectionState.hasProfileExpansionChoice = false;
        setStatus("Removed captured MVPD login profile.", "info");
        syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);
        return;
      }

      const target = event.target instanceof Element ? event.target.closest(".rest-v2-profile-card-toggle") : null;
      if (!target) {
        return;
      }
      const sectionState = getRestV2SectionState(section);
      const harvestKey = String(target.dataset.harvestKey || "").trim();
      if (!harvestKey) {
        return;
      }
      sectionState.selectedHarvestKey = harvestKey;
      if (sectionState.expandedHarvestKey === harvestKey) {
        sectionState.expandedHarvestKey = "";
      } else {
        sectionState.expandedHarvestKey = harvestKey;
      }
      sectionState.hasProfileExpansionChoice = true;
      syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);
    });
  }

  const inputElement = section.querySelector(".rest-v2-resource-input");
  if (inputElement) {
    inputElement.addEventListener("input", () => {
      const sectionState = getRestV2SectionState(section);
      sectionState.resourceInput = String(inputElement.value || "");
    });
  }

  const formElement = section.querySelector(".rest-v2-entitlement-form");
  if (formElement) {
    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      await runRestV2EntitlementCheck(section, programmer, appInfo);
    });
  }
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
  state.restV2ProfileHarvestBySelectionKey.clear();
  state.restV2ProfileHarvestByProgrammerId.clear();
  state.restV2ProfileHarvestBucketByProgrammerId.clear();
  state.restV2ProfileHarvestLast = null;
  state.restV2PreauthorizeHistoryByProgrammerId.clear();
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
  syncRestV2ProfileAndEntitlementPanels(section, programmer, appInfo);
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

function buildRestV2ProfileHarvestSelectionKey(context = null) {
  const programmerId = String(context?.programmerId || "").trim().toLowerCase();
  const requestorId = String(context?.requestorId || "").trim().toLowerCase();
  const mvpd = String(context?.mvpd || "").trim().toLowerCase();
  return [programmerId, requestorId, mvpd].join("|");
}

function normalizeRestV2ProfileAttributeValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (typeof value === "object") {
    if (typeof value.value === "string" || typeof value.value === "number" || typeof value.value === "boolean") {
      return String(value.value).trim();
    }
    if (typeof value.raw === "string" || typeof value.raw === "number" || typeof value.raw === "boolean") {
      return String(value.raw).trim();
    }
  }
  return "";
}

function dedupeRestV2CandidateStrings(values = []) {
  const output = [];
  const seen = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const normalized = normalizeRestV2ProfileAttributeValue(value);
    if (!normalized) {
      return;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(normalized);
  });
  return output;
}

function cloneJsonLikeValue(value, fallback = null) {
  if (value == null) {
    return fallback;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function getRestV2ProfileAttribute(profile, nameVariants = []) {
  const attributes = profile?.attributes && typeof profile.attributes === "object" ? profile.attributes : {};
  if (!attributes || typeof attributes !== "object") {
    return "";
  }

  const attributeEntries = Object.entries(attributes);
  const normalizedTargets = new Set(
    (Array.isArray(nameVariants) ? nameVariants : [])
      .map((name) => String(name || "").trim().toLowerCase())
      .filter(Boolean)
  );
  if (normalizedTargets.size === 0) {
    return "";
  }

  for (const [rawKey, rawValue] of attributeEntries) {
    const normalizedKey = String(rawKey || "").trim().toLowerCase();
    if (!normalizedTargets.has(normalizedKey)) {
      continue;
    }
    const value = normalizeRestV2ProfileAttributeValue(rawValue);
    if (value) {
      return value;
    }
  }
  return "";
}

function getRestV2ProfileAttributesMap(profile) {
  const attributes = profile?.attributes && typeof profile.attributes === "object" ? profile.attributes : {};
  if (!attributes || typeof attributes !== "object") {
    return {};
  }

  const normalized = {};
  Object.entries(attributes).forEach(([rawKey, rawValue]) => {
    const key = String(rawKey || "").trim();
    if (!key) {
      return;
    }
    const value = normalizeRestV2ProfileAttributeValue(rawValue);
    if (!value) {
      return;
    }
    normalized[key] = value;
  });
  return normalized;
}

function getRestV2ProfileScalarFields(profile) {
  const scalarFields = {};
  if (!profile || typeof profile !== "object") {
    return scalarFields;
  }
  Object.entries(profile).forEach(([rawKey, rawValue]) => {
    const key = String(rawKey || "").trim();
    if (!key || key === "attributes") {
      return;
    }
    const value = normalizeRestV2ProfileAttributeValue(rawValue);
    if (!value) {
      return;
    }
    scalarFields[key] = value;
  });
  return scalarFields;
}

function getRestV2ProfileSummary(profile, profileKey = "", context = null) {
  const normalizedProfile = profile && typeof profile === "object" ? profile : {};
  const attributesMap = getRestV2ProfileAttributesMap(normalizedProfile);
  const scalarFields = getRestV2ProfileScalarFields(normalizedProfile);
  const readValue = (keyCandidates = []) => {
    const normalizedCandidates = (Array.isArray(keyCandidates) ? keyCandidates : [])
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean);
    if (normalizedCandidates.length === 0) {
      return "";
    }

    for (const candidate of normalizedCandidates) {
      const directValue = Object.entries(scalarFields).find(([key]) => String(key || "").trim().toLowerCase() === candidate)?.[1] || "";
      if (directValue) {
        return directValue;
      }
      const attributeValue =
        Object.entries(attributesMap).find(([key]) => String(key || "").trim().toLowerCase() === candidate)?.[1] || "";
      if (attributeValue) {
        return attributeValue;
      }
    }
    return "";
  };

  const upstreamUserId = firstNonEmptyString([
    readValue(["upstreamuserid", "upstream_user_id", "upstreamuserid", "upstream_userid"]),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.upstreamUserID),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.upstreamUserId),
  ]);
  const userId = firstNonEmptyString([
    readValue(["userid", "user_id", "userid", "sub"]),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.userID),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.userId),
  ]);
  const sessionId = firstNonEmptyString([
    readValue(["sessionid", "session_id", "session", "sessiontoken", "session_token"]),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.sessionId),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.sessionID),
  ]);
  const mvpd = firstNonEmptyString([
    readValue(["mvpd", "idp", "provider", "provider_id"]),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.mvpd),
    normalizeRestV2ProfileAttributeValue(normalizedProfile.idp),
    String(profileKey || "").trim(),
    String(context?.mvpd || "").trim(),
  ]);

  const subjectCandidates = dedupeRestV2CandidateStrings([
    upstreamUserId,
    userId,
    readValue(["subject", "subscriberid", "subscriber_id", "accountid", "account_id", "personaid", "persona_id", "sub"]),
  ]);
  const sessionCandidates = dedupeRestV2CandidateStrings([
    sessionId,
    readValue(["sessionid", "session_id", "session", "sessiontoken", "session_token", "tokenid", "token_id"]),
  ]);
  const idpCandidates = dedupeRestV2CandidateStrings([
    mvpd,
    readValue(["mvpd", "idp", "provider", "providerid", "provider_id"]),
    String(context?.mvpd || "").trim(),
  ]);

  const notBeforeMs = Number(normalizedProfile.notBefore || normalizedProfile.not_before || 0);
  const notAfterMs = Number(normalizedProfile.notAfter || normalizedProfile.not_after || 0);
  const subject = firstNonEmptyString(subjectCandidates);

  return {
    profileKey: String(profileKey || "").trim(),
    mvpd: String(mvpd || "").trim(),
    subject: String(subject || "").trim(),
    upstreamUserId: String(upstreamUserId || "").trim(),
    userId: String(userId || "").trim(),
    sessionId: String(sessionId || "").trim(),
    subjectCandidates,
    sessionCandidates,
    idpCandidates,
    notBeforeMs: Number.isFinite(notBeforeMs) && notBeforeMs > 0 ? notBeforeMs : 0,
    notAfterMs: Number.isFinite(notAfterMs) && notAfterMs > 0 ? notAfterMs : 0,
    attributes: attributesMap,
    scalarFields,
    rawProfile: cloneJsonLikeValue(normalizedProfile, {}),
  };
}

function findRestV2PreferredProfileSummary(profileSummaries = [], preferredMvpd = "") {
  const summaries = Array.isArray(profileSummaries) ? profileSummaries : [];
  if (summaries.length === 0) {
    return null;
  }

  const preferred = String(preferredMvpd || "").trim().toLowerCase();
  if (preferred) {
    const direct = summaries.find((summary) => String(summary?.profileKey || "").trim().toLowerCase() === preferred);
    if (direct) {
      return direct;
    }
    const idpMatch = summaries.find((summary) =>
      (Array.isArray(summary?.idpCandidates) ? summary.idpCandidates : []).some(
        (candidate) => String(candidate || "").trim().toLowerCase() === preferred
      )
    );
    if (idpMatch) {
      return idpMatch;
    }
  }
  return summaries[0] || null;
}

function buildRestV2ProfileHarvest(context, profileCheckResult, flowId = "") {
  if (!context || !profileCheckResult || profileCheckResult.checked !== true) {
    return null;
  }

  const payload =
    profileCheckResult.responsePayload && typeof profileCheckResult.responsePayload === "object"
      ? profileCheckResult.responsePayload
      : {};
  const profiles =
    payload && typeof payload === "object" && payload.profiles && typeof payload.profiles === "object" ? payload.profiles : {};
  const profileEntries = Object.entries(profiles).filter(([, value]) => value && typeof value === "object");
  const profileSummaries = profileEntries.map(([profileKey, profileValue]) => getRestV2ProfileSummary(profileValue, profileKey, context));
  const selectedSummary = findRestV2PreferredProfileSummary(profileSummaries, context.mvpd);

  const profileCount = profileSummaries.length;
  const profileKeys = profileSummaries.map((summary) => String(summary?.profileKey || "").trim()).filter(Boolean);
  const allSubjectCandidates = dedupeRestV2CandidateStrings(profileSummaries.flatMap((summary) => summary?.subjectCandidates || []));
  const allSessionCandidates = dedupeRestV2CandidateStrings(profileSummaries.flatMap((summary) => summary?.sessionCandidates || []));
  const allIdpCandidates = dedupeRestV2CandidateStrings(profileSummaries.flatMap((summary) => summary?.idpCandidates || []));

  const subjectCandidates = dedupeRestV2CandidateStrings([
    ...(selectedSummary?.subjectCandidates || []),
    ...(selectedSummary?.upstreamUserId ? [selectedSummary.upstreamUserId] : []),
    ...(selectedSummary?.userId ? [selectedSummary.userId] : []),
    ...allSubjectCandidates,
  ]);
  const sessionCandidates = dedupeRestV2CandidateStrings([...(selectedSummary?.sessionCandidates || []), ...allSessionCandidates]);
  const idpCandidates = dedupeRestV2CandidateStrings([...(selectedSummary?.idpCandidates || []), ...allIdpCandidates, context.mvpd]);

  const upstreamUserId = firstNonEmptyString([selectedSummary?.upstreamUserId, selectedSummary?.userId, ...subjectCandidates]);
  const userId = firstNonEmptyString([selectedSummary?.userId, selectedSummary?.upstreamUserId, ...subjectCandidates]);
  const sessionId = firstNonEmptyString([selectedSummary?.sessionId, ...sessionCandidates]);
  const mvpd = firstNonEmptyString([selectedSummary?.mvpd, ...idpCandidates, context.mvpd]);
  const subject = firstNonEmptyString([selectedSummary?.subject, selectedSummary?.upstreamUserId, selectedSummary?.userId, ...subjectCandidates]);

  const notBeforeMs = Number(selectedSummary?.notBeforeMs || 0);
  const notAfterMs = Number(selectedSummary?.notAfterMs || 0);
  const harvestedAt = Date.now();
  const responseStatus = Number(profileCheckResult.status || 0);
  const responseOk = profileCheckResult.ok === true;
  const responseError = String(profileCheckResult.error || "").trim();
  const profileCheckOutcome = responseError
    ? "error"
    : !responseOk
      ? "http_error"
      : profileCount > 0
        ? "success"
        : "empty";

  return {
    harvestedAt,
    flowId: String(flowId || "").trim(),
    programmerId: String(context.programmerId || "").trim(),
    requestorId: String(context.requestorId || "").trim(),
    serviceProviderId: String(context.serviceProviderId || "").trim(),
    appGuid: String(context.appInfo?.guid || "").trim(),
    profileUrl: String(profileCheckResult.url || "").trim(),
    profileCheckOutcome,
    profileCheck: {
      checked: profileCheckResult.checked === true,
      ok: responseOk,
      status: responseStatus,
      statusText: String(profileCheckResult.statusText || "").trim(),
      error: responseError,
      profileCount,
      url: String(profileCheckResult.url || "").trim(),
      responsePreview: String(profileCheckResult.responsePreview || "").trim(),
    },
    profileCount,
    profileKeys,
    selectedProfileFound: Boolean(selectedSummary),
    profileKey: String(selectedSummary?.profileKey || "").trim(),
    mvpd: String(mvpd || "").trim(),
    subject: String(subject || "").trim(),
    upstreamUserId: String(upstreamUserId || "").trim(),
    userId: String(userId || "").trim(),
    sessionId: String(sessionId || "").trim(),
    idpCandidates,
    subjectCandidates,
    sessionCandidates,
    allSubjectCandidates,
    allSessionCandidates,
    allIdpCandidates,
    notBeforeMs: Number.isFinite(notBeforeMs) && notBeforeMs > 0 ? notBeforeMs : 0,
    notAfterMs: Number.isFinite(notAfterMs) && notAfterMs > 0 ? notAfterMs : 0,
    profileAttributes: selectedSummary?.attributes && typeof selectedSummary.attributes === "object" ? { ...selectedSummary.attributes } : {},
    profileScalarFields:
      selectedSummary?.scalarFields && typeof selectedSummary.scalarFields === "object" ? { ...selectedSummary.scalarFields } : {},
    profile: selectedSummary?.rawProfile && typeof selectedSummary.rawProfile === "object" ? { ...selectedSummary.rawProfile } : {},
    profileSummaries: cloneJsonLikeValue(profileSummaries, []),
    profileResponsePayload: cloneJsonLikeValue(payload, {}),
  };
}

function storeRestV2ProfileHarvest(context, profileCheckResult, flowId = "") {
  const harvest = buildRestV2ProfileHarvest(context, profileCheckResult, flowId);
  if (!harvest) {
    return null;
  }

  const selectionKey = buildRestV2ProfileHarvestSelectionKey(context);
  if (selectionKey && selectionKey !== "||") {
    state.restV2ProfileHarvestBySelectionKey.set(selectionKey, harvest);
  }
  if (isUsableRestV2ProfileHarvest(harvest)) {
    upsertRestV2ProfileHarvestBucketEntry(harvest);
    if (harvest.programmerId) {
      state.restV2ProfileHarvestByProgrammerId.set(harvest.programmerId, harvest);
    }
  } else if (harvest.programmerId) {
    const existingBucket = getRestV2ProfileHarvestBucketForProgrammer(harvest.programmerId);
    if (existingBucket.length > 0) {
      state.restV2ProfileHarvestByProgrammerId.set(harvest.programmerId, existingBucket[0]);
    }
  }
  state.restV2ProfileHarvestLast = harvest;
  return harvest;
}

function isUsableRestV2ProfileHarvest(harvest = null) {
  if (!harvest || typeof harvest !== "object") {
    return false;
  }
  if (String(harvest.profileCheckOutcome || "").trim().toLowerCase() !== "success") {
    return false;
  }
  return Number(harvest.profileCount || 0) > 0;
}

function buildRestV2ProfileHarvestBucketKey(harvest = null) {
  if (!harvest || typeof harvest !== "object") {
    return "";
  }
  const parts = [
    harvest.programmerId,
    harvest.requestorId,
    harvest.mvpd,
    harvest.profileKey,
    harvest.subject,
    harvest.sessionId,
    harvest.upstreamUserId,
    harvest.userId,
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
  return parts.join("|");
}

function compareRestV2HarvestRecency(left, right) {
  return Number(right?.harvestedAt || 0) - Number(left?.harvestedAt || 0);
}

function getLatestRestV2ProfileHarvestFromBuckets() {
  let latest = null;
  for (const bucket of state.restV2ProfileHarvestBucketByProgrammerId.values()) {
    for (const harvest of Array.isArray(bucket) ? bucket : []) {
      if (!harvest || typeof harvest !== "object") {
        continue;
      }
      if (!latest || Number(harvest.harvestedAt || 0) > Number(latest.harvestedAt || 0)) {
        latest = harvest;
      }
    }
  }
  return latest;
}

function getLatestRestV2ProfileHarvestFromSelectionMap() {
  let latest = null;
  for (const harvest of state.restV2ProfileHarvestBySelectionKey.values()) {
    if (!harvest || typeof harvest !== "object") {
      continue;
    }
    if (!latest || Number(harvest.harvestedAt || 0) > Number(latest.harvestedAt || 0)) {
      latest = harvest;
    }
  }
  return latest;
}

function recomputeRestV2ProfileHarvestLast() {
  const latestFromBuckets = getLatestRestV2ProfileHarvestFromBuckets();
  if (latestFromBuckets) {
    state.restV2ProfileHarvestLast = latestFromBuckets;
    return latestFromBuckets;
  }
  const latestFromSelections = getLatestRestV2ProfileHarvestFromSelectionMap();
  state.restV2ProfileHarvestLast = latestFromSelections || null;
  return state.restV2ProfileHarvestLast;
}

function removeRestV2ProfileHarvestByRecordKey(programmer = null, harvestKey = "") {
  const programmerId =
    programmer && typeof programmer === "object" ? String(programmer.programmerId || "").trim() : String(programmer || "").trim();
  const normalizedHarvestKey = String(harvestKey || "").trim();
  if (!programmerId || !normalizedHarvestKey) {
    return false;
  }

  const bucket = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
  const filteredBucket = bucket.filter((item, index) => getRestV2HarvestRecordKey(item, index) !== normalizedHarvestKey);
  const removed = filteredBucket.length !== bucket.length;
  if (!removed) {
    return false;
  }

  if (filteredBucket.length > 0) {
    filteredBucket.sort(compareRestV2HarvestRecency);
    state.restV2ProfileHarvestBucketByProgrammerId.set(programmerId, filteredBucket);
    state.restV2ProfileHarvestByProgrammerId.set(programmerId, filteredBucket[0]);
  } else {
    state.restV2ProfileHarvestBucketByProgrammerId.delete(programmerId);
    state.restV2ProfileHarvestByProgrammerId.delete(programmerId);
  }

  for (const [selectionKey, harvest] of state.restV2ProfileHarvestBySelectionKey.entries()) {
    if (!harvest || typeof harvest !== "object") {
      continue;
    }
    if (getRestV2HarvestRecordKey(harvest) === normalizedHarvestKey) {
      state.restV2ProfileHarvestBySelectionKey.delete(selectionKey);
    }
  }

  if (state.restV2PreauthorizeHistoryByProgrammerId.has(programmerId)) {
    const history = getRestV2PreauthorizeHistoryForProgrammer(programmerId);
    const filteredHistory = history.filter((entry) => String(entry?.harvestKey || "").trim() !== normalizedHarvestKey);
    if (filteredHistory.length > 0) {
      state.restV2PreauthorizeHistoryByProgrammerId.set(programmerId, filteredHistory);
    } else {
      state.restV2PreauthorizeHistoryByProgrammerId.delete(programmerId);
    }
  }

  recomputeRestV2ProfileHarvestLast();
  return true;
}

function upsertRestV2ProfileHarvestBucketEntry(harvest = null) {
  if (!isUsableRestV2ProfileHarvest(harvest)) {
    return;
  }
  const programmerId = String(harvest.programmerId || "").trim();
  if (!programmerId) {
    return;
  }

  const existingBucket = Array.isArray(state.restV2ProfileHarvestBucketByProgrammerId.get(programmerId))
    ? state.restV2ProfileHarvestBucketByProgrammerId.get(programmerId)
    : [];
  const harvestKey = buildRestV2ProfileHarvestBucketKey(harvest);
  const nextBucket = existingBucket.slice();
  const existingIndex = harvestKey
    ? nextBucket.findIndex((item) => buildRestV2ProfileHarvestBucketKey(item) === harvestKey)
    : -1;
  if (existingIndex >= 0) {
    nextBucket[existingIndex] = harvest;
  } else {
    nextBucket.push(harvest);
  }
  nextBucket.sort(compareRestV2HarvestRecency);
  state.restV2ProfileHarvestBucketByProgrammerId.set(programmerId, nextBucket.slice(0, REST_V2_PROFILE_HARVEST_BUCKET_MAX));
}

function getRestV2ProfileHarvestBucketForProgrammer(programmer = null) {
  const programmerId =
    programmer && typeof programmer === "object" ? String(programmer.programmerId || "").trim() : String(programmer || "").trim();
  if (!programmerId) {
    return [];
  }
  const bucket = state.restV2ProfileHarvestBucketByProgrammerId.get(programmerId);
  if (!Array.isArray(bucket) || bucket.length === 0) {
    return [];
  }
  return bucket
    .filter((item) => item && typeof item === "object")
    .slice()
    .sort(compareRestV2HarvestRecency);
}

function getRestV2ProfileHarvestListForContext(context = null) {
  if (context && typeof context === "object") {
    const programmerId = String(context.programmerId || "").trim();
    if (programmerId) {
      const bucket = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
      if (bucket.length > 0) {
        return bucket;
      }
      const selectionKey = buildRestV2ProfileHarvestSelectionKey(context);
      const selectionHarvest =
        selectionKey && state.restV2ProfileHarvestBySelectionKey.has(selectionKey)
          ? state.restV2ProfileHarvestBySelectionKey.get(selectionKey) || null
          : null;
      return selectionHarvest && typeof selectionHarvest === "object" ? [selectionHarvest] : [];
    }
  }

  const latest = getLatestRestV2ProfileHarvestFromBuckets();
  if (latest) {
    return [latest];
  }

  return state.restV2ProfileHarvestLast && typeof state.restV2ProfileHarvestLast === "object"
    ? [state.restV2ProfileHarvestLast]
    : [];
}

function mergeRestV2ProfileHarvestLists(...lists) {
  const merged = [];
  const keyToIndex = new Map();
  lists.forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((item) => {
      if (!item || typeof item !== "object") {
        return;
      }
      const bucketKey =
        buildRestV2ProfileHarvestBucketKey(item) ||
        [String(item.programmerId || ""), String(item.flowId || ""), String(item.harvestedAt || "")].join("|");
      const existingIndex = keyToIndex.has(bucketKey) ? Number(keyToIndex.get(bucketKey)) : -1;
      if (existingIndex >= 0) {
        const existing = merged[existingIndex];
        if (Number(item.harvestedAt || 0) >= Number(existing?.harvestedAt || 0)) {
          merged[existingIndex] = item;
        }
      } else {
        keyToIndex.set(bucketKey, merged.length);
        merged.push(item);
      }
    });
  });
  merged.sort(compareRestV2HarvestRecency);
  return merged;
}

function collectRestV2HarvestCandidateValues(harvestList = []) {
  const list = Array.isArray(harvestList) ? harvestList : [];
  const idpCandidates = dedupeRestV2CandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.mvpd || "").trim(),
      ...(Array.isArray(harvest?.idpCandidates) ? harvest.idpCandidates : []),
      ...(Array.isArray(harvest?.allIdpCandidates) ? harvest.allIdpCandidates : []),
    ])
  );
  const subjectCandidates = dedupeRestV2CandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.subject || "").trim(),
      String(harvest?.upstreamUserId || "").trim(),
      String(harvest?.userId || "").trim(),
      ...(Array.isArray(harvest?.subjectCandidates) ? harvest.subjectCandidates : []),
      ...(Array.isArray(harvest?.allSubjectCandidates) ? harvest.allSubjectCandidates : []),
    ])
  );
  const sessionCandidates = dedupeRestV2CandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.sessionId || "").trim(),
      ...(Array.isArray(harvest?.sessionCandidates) ? harvest.sessionCandidates : []),
      ...(Array.isArray(harvest?.allSessionCandidates) ? harvest.allSessionCandidates : []),
    ])
  );
  return {
    idpCandidates,
    subjectCandidates,
    sessionCandidates,
  };
}

function clearRestV2ProfileHarvestForContext(context = null) {
  if (!context || typeof context !== "object") {
    return;
  }
  const selectionKey = buildRestV2ProfileHarvestSelectionKey(context);
  if (selectionKey && state.restV2ProfileHarvestBySelectionKey.has(selectionKey)) {
    state.restV2ProfileHarvestBySelectionKey.delete(selectionKey);
  }
  const programmerId = String(context.programmerId || "").trim();
  if (!programmerId) {
    return;
  }

  const normalizedRequestorId = String(context.requestorId || "").trim().toLowerCase();
  const normalizedMvpd = String(context.mvpd || "").trim().toLowerCase();
  const existingBucket = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
  if (existingBucket.length > 0) {
    const filteredBucket = existingBucket.filter((harvest) => {
      const harvestRequestorId = String(harvest?.requestorId || "").trim().toLowerCase();
      const harvestMvpd = String(harvest?.mvpd || "").trim().toLowerCase();
      const matchesRequestor = normalizedRequestorId ? harvestRequestorId === normalizedRequestorId : true;
      const matchesMvpd = normalizedMvpd ? harvestMvpd === normalizedMvpd : true;
      return !(matchesRequestor && matchesMvpd);
    });

    if (filteredBucket.length > 0) {
      state.restV2ProfileHarvestBucketByProgrammerId.set(programmerId, filteredBucket);
      state.restV2ProfileHarvestByProgrammerId.set(programmerId, filteredBucket[0]);
    } else {
      state.restV2ProfileHarvestBucketByProgrammerId.delete(programmerId);
      state.restV2ProfileHarvestByProgrammerId.delete(programmerId);
    }
  } else {
    state.restV2ProfileHarvestByProgrammerId.delete(programmerId);
  }

  recomputeRestV2ProfileHarvestLast();
}

function getRestV2ProfileHarvestForContext(context = null) {
  if (context && typeof context === "object") {
    const selectionKey = buildRestV2ProfileHarvestSelectionKey(context);
    const selectionHarvest =
      selectionKey && state.restV2ProfileHarvestBySelectionKey.has(selectionKey)
        ? state.restV2ProfileHarvestBySelectionKey.get(selectionKey) || null
        : null;
    if (isUsableRestV2ProfileHarvest(selectionHarvest)) {
      return selectionHarvest;
    }

    const programmerId = String(context.programmerId || "").trim();
    if (programmerId) {
      const bucket = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
      if (bucket.length > 0) {
        const normalizedRequestorId = String(context.requestorId || "").trim().toLowerCase();
        const normalizedMvpd = String(context.mvpd || "").trim().toLowerCase();
        const strictMatch = bucket.find((harvest) => {
          const harvestRequestorId = String(harvest?.requestorId || "").trim().toLowerCase();
          const harvestMvpd = String(harvest?.mvpd || "").trim().toLowerCase();
          const requestorMatch = normalizedRequestorId ? harvestRequestorId === normalizedRequestorId : true;
          const mvpdMatch = normalizedMvpd ? harvestMvpd === normalizedMvpd : true;
          return requestorMatch && mvpdMatch;
        });
        if (strictMatch) {
          return strictMatch;
        }

        if (normalizedMvpd) {
          const mvpdMatch = bucket.find(
            (harvest) => String(harvest?.mvpd || "").trim().toLowerCase() === normalizedMvpd
          );
          if (mvpdMatch) {
            return mvpdMatch;
          }
        }

        if (normalizedRequestorId) {
          const requestorMatch = bucket.find(
            (harvest) => String(harvest?.requestorId || "").trim().toLowerCase() === normalizedRequestorId
          );
          if (requestorMatch) {
            return requestorMatch;
          }
        }

        return bucket[0];
      }
    }

    if (selectionHarvest && typeof selectionHarvest === "object") {
      return selectionHarvest;
    }

    if (selectionKey && state.restV2ProfileHarvestBySelectionKey.has(selectionKey)) {
      return state.restV2ProfileHarvestBySelectionKey.get(selectionKey) || null;
    }
    if (programmerId && state.restV2ProfileHarvestByProgrammerId.has(programmerId)) {
      return state.restV2ProfileHarvestByProgrammerId.get(programmerId) || null;
    }
  }

  if (isUsableRestV2ProfileHarvest(state.restV2ProfileHarvestLast)) {
    return state.restV2ProfileHarvestLast;
  }

  const latestFromBuckets = getLatestRestV2ProfileHarvestFromBuckets();
  if (latestFromBuckets) {
    return latestFromBuckets;
  }

  return state.restV2ProfileHarvestLast && typeof state.restV2ProfileHarvestLast === "object" ? state.restV2ProfileHarvestLast : null;
}

async function fetchRestV2ProfileCheckResult(context, flowId, scope = "profiles-check") {
  const emptyResult = {
    checked: false,
    ok: false,
    status: 0,
    statusText: "",
    profileCount: 0,
    responsePreview: "",
    url: "",
    error: "",
    responsePayload: null,
    harvestedProfile: null,
  };

  if (!context?.programmerId || !context?.appInfo?.guid || !context?.serviceProviderId || !context?.mvpd) {
    return {
      ...emptyResult,
      error: "Missing REST V2 profile-check context.",
    };
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
        scope,
      }
    );

    const responseText = await response.text().catch(() => "");
    const parsed = parseJsonText(responseText, {});
    const profiles = parsed?.profiles && typeof parsed.profiles === "object" ? parsed.profiles : {};
    const profileCount = Object.keys(profiles).length;
    const status = Number(response.status || 0);
    const statusText = String(response.statusText || "");
    const responsePreview = truncateDebugText(responseText, 1200);
    const harvestedProfile = buildRestV2ProfileHarvest(context, {
      checked: true,
      ok: Boolean(response.ok),
      status,
      statusText,
      profileCount,
      responsePreview,
      responsePayload: parsed,
      url: profilesUrl,
      error: "",
    }, flowId);

    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "profiles-check-response",
      status,
      statusText,
      profileCount,
      responsePreview,
      profileKeys: Object.keys(profiles || {}),
      payload: cloneJsonLikeValue(parsed, {}),
      profileHarvest: harvestedProfile ? cloneJsonLikeValue(harvestedProfile, {}) : null,
    });

    return {
      checked: true,
      ok: Boolean(response.ok),
      status,
      statusText,
      profileCount,
      responsePreview,
      url: profilesUrl,
      error: "",
      responsePayload: parsed,
      harvestedProfile,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const errorResult = {
      ...emptyResult,
      checked: true,
      ok: false,
      url: profilesUrl,
      error: reason,
    };
    const harvestedProfile = buildRestV2ProfileHarvest(
      context,
      {
        ...errorResult,
      },
      flowId
    );
    emitRestV2DebugEvent(flowId, {
      source: "extension",
      phase: "profiles-check-error",
      url: profilesUrl,
      error: reason,
      profileHarvest: harvestedProfile ? cloneJsonLikeValue(harvestedProfile, {}) : null,
    });
    return {
      ...errorResult,
      harvestedProfile,
    };
  }
}

function buildRestV2ProfileVerdict(profileCheckResult, context = null) {
  if (!profileCheckResult || profileCheckResult.checked !== true) {
    return null;
  }

  const requestorId = String(context?.requestorId || "");
  const mvpd = String(context?.mvpd || "");
  const targetLabel = requestorId && mvpd ? `${requestorId} x ${mvpd}` : "selected Requestor x MVPD";

  if (profileCheckResult.error || !profileCheckResult.ok) {
    const reason =
      profileCheckResult.error ||
      `HTTP ${Number(profileCheckResult.status || 0)} ${String(profileCheckResult.statusText || "").trim()}`.trim();
    return {
      panelType: "error",
      mainType: "error",
      panelSuffix: `Profile check: ERROR (${reason || "unknown"}).`,
      mainMessage: `REST V2 Profile Check ERROR for ${targetLabel}: ${reason || "unknown"}.`,
    };
  }

  if (Number(profileCheckResult.profileCount || 0) > 0) {
    return {
      panelType: "success",
      mainType: "success",
      panelSuffix: `Profile check: SUCCESS (populated profiles response).`,
      mainMessage: `REST V2 Profile Check SUCCESS for ${targetLabel} (profiles=${Number(profileCheckResult.profileCount || 0)}).`,
    };
  }

  return {
    panelType: "error",
    mainType: "error",
    panelSuffix: "Profile check: FAIL AUTHNF (empty profiles response).",
    mainMessage: `REST V2 Profile Check FAIL AUTHNF for ${targetLabel} (empty profiles response).`,
  };
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
  const pendingCmByKey = new Map();

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
  const normalizeCmPhase = (event) => String(event?.phase || "").trim().toLowerCase();
  const isCmRequestStartPhase = (event) => {
    const phase = normalizeCmPhase(event);
    return phase === "cm-request-attempt" || phase === "cm-v2-request";
  };
  const isCmResponsePhase = (event) => {
    const phase = normalizeCmPhase(event);
    return (
      phase === "cm-response" ||
      phase === "cm-request-failed" ||
      phase === "cm-request-error" ||
      phase === "cm-v2-response" ||
      phase === "cm-v2-request-failed" ||
      phase === "cm-v2-request-error"
    );
  };
  const getCmKey = (event) => {
    return [
      String(event?.method || "GET").toUpperCase(),
      String(event?.url || event?.endpointUrl || ""),
      String(event?.requestorId || ""),
      String(event?.mvpd || ""),
      String(event?.programmerId || ""),
      String(event?.cardId || ""),
      String(event?.operationKey || ""),
      String(event?.attempt || ""),
      String(event?.contextLabel || ""),
    ].join("|");
  };

  for (const event of flowEvents) {
    if (!event || event.source !== "extension") {
      continue;
    }

    if (isCmRequestStartPhase(event)) {
      const key = getCmKey(event);
      const queue = pendingCmByKey.get(key) || [];
      queue.push(event);
      pendingCmByKey.set(key, queue);
      continue;
    }

    if (isCmResponsePhase(event)) {
      const key = getCmKey(event);
      const queue = pendingCmByKey.get(key) || [];
      const requestEvent = queue.length > 0 ? queue.shift() : null;
      if (queue.length === 0) {
        pendingCmByKey.delete(key);
      } else {
        pendingCmByKey.set(key, queue);
      }

      const startedMs = pickFlowEventTimestampMs(requestEvent || event, Date.now());
      const endedMs = pickFlowEventTimestampMs(event, startedMs);
      const durationMs = Math.max(0, endedMs - startedMs);
      const requestUrl = String(event?.url || event?.endpointUrl || requestEvent?.url || requestEvent?.endpointUrl || "");
      const requestMethod = String(event?.method || requestEvent?.method || "GET").toUpperCase();
      const status = Number(event?.status || 0);
      const statusText =
        String(event?.statusText || "") ||
        String(event?.error || "") ||
        (status > 0 ? "" : "CM_REQUEST_FAILED");
      const responseBodyText = firstNonEmptyString([String(event?.responsePreview || ""), String(event?.error || "")]);
      const phase = normalizeCmPhase(event);

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
          statusText,
          httpVersion: "HTTP/1.1",
          headers: [],
          cookies: [],
          redirectURL: "",
          headersSize: -1,
          bodySize: responseBodyText ? responseBodyText.length : -1,
          content: {
            size: responseBodyText.length,
            mimeType: "application/json",
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
          source: "extension-cm",
          phase,
          authMode: String(requestEvent?.authMode || event?.authMode || ""),
          contextLabel: String(requestEvent?.contextLabel || event?.contextLabel || ""),
          requestorId: String(event?.requestorId || requestEvent?.requestorId || ""),
          mvpd: String(event?.mvpd || requestEvent?.mvpd || ""),
          programmerId: String(event?.programmerId || requestEvent?.programmerId || ""),
          operationKey: String(event?.operationKey || requestEvent?.operationKey || ""),
          cardId: String(event?.cardId || requestEvent?.cardId || ""),
        },
      });
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

  for (const queue of pendingCmByKey.values()) {
    for (const requestEvent of queue) {
      const startedMs = pickFlowEventTimestampMs(requestEvent, Date.now());
      const requestUrl = String(requestEvent?.url || requestEvent?.endpointUrl || "");
      const requestMethod = String(requestEvent?.method || "GET").toUpperCase();
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
          source: "extension-cm",
          phase: normalizeCmPhase(requestEvent),
          authMode: String(requestEvent?.authMode || ""),
          contextLabel: String(requestEvent?.contextLabel || ""),
          requestorId: String(requestEvent?.requestorId || ""),
          mvpd: String(requestEvent?.mvpd || ""),
          programmerId: String(requestEvent?.programmerId || ""),
          operationKey: String(requestEvent?.operationKey || ""),
          cardId: String(requestEvent?.cardId || ""),
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

function sanitizeDownloadFileSegment(value, fallback = "download") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function buildRestV2HarFilename(context = null, logoutResult = null, profileCheckResult = null) {
  const requestor = sanitizeHarFileSegment(context?.requestorId || "requestor", "requestor");
  const mvpd = sanitizeHarFileSegment(context?.mvpd || "mvpd", "mvpd");
  const hasProfile = Boolean(profileCheckResult?.ok) && Number(profileCheckResult?.profileCount || 0) > 0;
  const mode = logoutResult?.performed ? "full-login-logout" : hasProfile ? "login-profile-retained" : "failed-login-attempt";
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

    let profileCheckResult = {
      checked: false,
      ok: false,
      status: 0,
      statusText: "",
      profileCount: 0,
      responsePreview: "",
      url: "",
      error: "",
      responsePayload: null,
      harvestedProfile: null,
    };
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
        profileCheckResult = await fetchRestV2ProfileCheckResult(recordingContext, activeFlowId, "profiles-check");
        const harvestedProfile = storeRestV2ProfileHarvest(recordingContext, profileCheckResult, activeFlowId);
        if (harvestedProfile) {
          emitRestV2DebugEvent(activeFlowId, {
            source: "extension",
            phase: "profiles-harvested",
            requestorId: recordingContext.requestorId,
            mvpd: recordingContext.mvpd,
            subject: harvestedProfile.subject,
            sessionId: harvestedProfile.sessionId,
            profileCheckOutcome: harvestedProfile.profileCheckOutcome,
            profileCount: Number(harvestedProfile.profileCount || 0),
            profileHarvest: cloneJsonLikeValue(harvestedProfile, {}),
            profileCheck:
              harvestedProfile.profileCheck && typeof harvestedProfile.profileCheck === "object"
                ? { ...harvestedProfile.profileCheck }
                : null,
          });
        } else {
          clearRestV2ProfileHarvestForContext(recordingContext);
        }

        const selectedProgrammer = resolveSelectedProgrammer();
        if (selectedProgrammer?.programmerId && selectedProgrammer.programmerId === recordingContext.programmerId) {
          const selectedServices = state.premiumAppsByProgrammerId.get(selectedProgrammer.programmerId) || null;
          cmBroadcastSelectedControllerState(selectedProgrammer, selectedServices);
          const activeCmState = getActiveCmState();
          if (activeCmState && String(activeCmState.programmer?.programmerId || "") === String(selectedProgrammer.programmerId)) {
            cmBroadcastControllerState(activeCmState);
          }
        }

        const hasProfile = Boolean(profileCheckResult.ok) && Number(profileCheckResult.profileCount || 0) > 0;
        if (hasProfile) {
          logoutResult = {
            attempted: false,
            performed: false,
            actionName: "profile-preserved",
            actionType: "",
            logoutUrl: "",
            error: "",
          };
          emitRestV2DebugEvent(activeFlowId, {
            source: "extension",
            phase: "logout-skipped-preserve-profile-for-entitlements",
            requestorId: recordingContext.requestorId,
            mvpd: recordingContext.mvpd,
            profileCount: Number(profileCheckResult.profileCount || 0),
          });
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
    syncRestV2LoginPanel(section, programmer, appInfo);

    const profileVerdict = buildRestV2ProfileVerdict(profileCheckResult, recordingContext);

    if (stopResult?.flow) {
      const harPayload = buildHarLogFromFlowSnapshot(stopResult.flow, recordingContext, logoutResult);
      const harFileName = buildRestV2HarFilename(recordingContext, logoutResult, profileCheckResult);
      downloadHarFile(harPayload, harFileName);

      let panelMessage = "";
      let panelType = "success";
      const hasProfile = Boolean(profileCheckResult.ok) && Number(profileCheckResult.profileCount || 0) > 0;
      if (closeResult?.ok === false) {
        panelMessage = `Recording stopped. HAR downloaded as ${harFileName}. Login window close note: ${closeResult.error || "unknown"}.`;
        panelType = "error";
      } else if (logoutResult.performed) {
        panelMessage = `Recording stopped. Downloaded full login/logout HAR: ${harFileName}`;
      } else if (hasProfile) {
        panelMessage = `Recording stopped. Downloaded login HAR with active MVPD profile retained for Can I watch?: ${harFileName}`;
      } else {
        const logoutNote = logoutResult.error ? ` Logout note: ${logoutResult.error}` : "";
        panelMessage = `Recording stopped. Downloaded failed login attempt HAR: ${harFileName}.${logoutNote}`;
      }

      if (profileVerdict) {
        panelMessage = `${panelMessage} ${profileVerdict.panelSuffix}`;
        if (panelType !== "error") {
          panelType = profileVerdict.panelType;
        }
        setStatus(profileVerdict.mainMessage, profileVerdict.mainType);
      }

      setRestV2LoginPanelStatus(section, panelMessage, panelType);
    } else {
      const failureReason = stopResult?.error || "Flow snapshot unavailable.";
      const fallbackMessage = `Recording stopped, but HAR export failed: ${failureReason}`;
      if (profileVerdict) {
        setStatus(profileVerdict.mainMessage, profileVerdict.mainType);
        setRestV2LoginPanelStatus(section, `${fallbackMessage} ${profileVerdict.panelSuffix}`, "error");
      } else {
        setRestV2LoginPanelStatus(section, fallbackMessage, "error");
      }
    }
  } finally {
    state.restV2Stopping = false;
  }
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

const CLICK_ESM_ZOOM_OPTIONS = ["", "YR", "MO", "DAY", "HR", "MIN"];
const CLICK_ESM_ZOOM_TOKEN_BY_KEY = {
  YR: "/year",
  MO: "/month",
  DAY: "/day",
  HR: "/hour",
  MIN: "/minute",
};

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

function normalizeEsmColumns(columns, options = {}) {
  const includeFallbackLabel = options.includeFallbackLabel === true;
  const output = [];
  const seen = new Set();

  (Array.isArray(columns) ? columns : []).forEach((value) => {
    const normalized = String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized) {
      return;
    }

    if (/^no\s+report\s+columns$/i.test(normalized)) {
      const key = "no report columns";
      if (!seen.has(key)) {
        output.push("No report columns");
        seen.add(key);
      }
      return;
    }

    const lower = normalized.toLowerCase();
    if (ESM_DEPRECATED_COLUMN_KEYS.has(lower)) {
      return;
    }
    if (!seen.has(lower)) {
      output.push(normalized);
      seen.add(lower);
    }
  });

  if (output.length === 0 && includeFallbackLabel) {
    return ["No report columns"];
  }
  return output;
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
      throw new Error(`Unable to load ESM endpoint catalog (${response.status}).`);
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
        const normalizedColumns = normalizeEsmColumns(endpoint.columns, { includeFallbackLabel: true });

        return {
          url,
          zoomClass: String(endpoint.zoomClass || "").trim(),
          zoomKey,
          columns: normalizedColumns,
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

async function loadClickEsmTemplateHtml() {
  if (typeof clickEsmTemplateHtml === "string" && clickEsmTemplateHtml.trim().length > 0) {
    return clickEsmTemplateHtml;
  }
  if (clickEsmTemplatePromise) {
    return clickEsmTemplatePromise;
  }

  clickEsmTemplatePromise = (async () => {
    const resourceUrl = chrome.runtime.getURL(CLICK_ESM_TEMPLATE_PATH);
    const response = await fetch(resourceUrl, {
      method: "GET",
      credentials: "omit",
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error(`Unable to load clickESM template (${response.status}).`);
    }
    const templateHtml = await response.text();
    if (typeof templateHtml !== "string" || templateHtml.trim().length === 0) {
      throw new Error("clickESM template is empty.");
    }
    clickEsmTemplateHtml = templateHtml;
    return clickEsmTemplateHtml;
  })();

  try {
    return await clickEsmTemplatePromise;
  } finally {
    clickEsmTemplatePromise = null;
  }
}

function clickEsmReplaceTitleHotspot(templateHtml, titleText) {
  const safeTitle = escapeHtml(String(titleText || "").trim());
  if (!safeTitle) {
    throw new Error("clickESM title is required.");
  }
  let output = String(templateHtml || "");
  if (output.includes(CLICK_ESM_TEMPLATE_PLACEHOLDER_TITLE)) {
    output = output.replaceAll(CLICK_ESM_TEMPLATE_PLACEHOLDER_TITLE, safeTitle);
    return output;
  }
  if (/<title[\s\S]*?<\/title>/i.test(output)) {
    return output.replace(/<title[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  }
  throw new Error("clickESM template is missing the <title> hotspot.");
}

function clickEsmReplaceHiddenInputHotspot(templateHtml, inputName, value, placeholderToken) {
  const safeName = String(inputName || "").trim();
  if (!safeName) {
    throw new Error("clickESM hidden input name is required.");
  }
  const safeValue = escapeHtml(String(value || "").trim());
  if (!safeValue) {
    throw new Error(`clickESM hidden input "${safeName}" is required.`);
  }

  let output = String(templateHtml || "");
  const placeholder = String(placeholderToken || "").trim();
  if (placeholder && output.includes(placeholder)) {
    return output.replaceAll(placeholder, safeValue);
  }

  const escapedName = clickEsmEscapeRegExp(safeName);
  const inputPattern = new RegExp(
    `(<input\\b[^>]*\\bname=(["'])${escapedName}\\2[^>]*\\bvalue=(["']))([^"']*)(\\3[^>]*>)`,
    "i"
  );
  if (inputPattern.test(output)) {
    output = output.replace(inputPattern, `$1${safeValue}$5`);
    return output;
  }

  throw new Error(`clickESM template is missing hidden input "${safeName}".`);
}

function buildClickEsmHtmlFromTemplate(templateHtml, context = {}) {
  const programmerLabel = String(context.programmerLabel || "").trim();
  const titleText = `${programmerLabel || "Media Company"} CLICK ESM`;
  let output = clickEsmReplaceTitleHotspot(templateHtml, titleText);
  output = clickEsmReplaceHiddenInputHotspot(output, "cid", context.clientId, CLICK_ESM_TEMPLATE_PLACEHOLDER_CID);
  output = clickEsmReplaceHiddenInputHotspot(output, "csc", context.clientSecret, CLICK_ESM_TEMPLATE_PLACEHOLDER_CSC);
  output = clickEsmReplaceHiddenInputHotspot(
    output,
    "access_token",
    context.accessToken,
    CLICK_ESM_TEMPLATE_PLACEHOLDER_ACCESS_TOKEN
  );
  return output;
}

function downloadClickEsmHtmlFile(htmlText, fileName) {
  const blob = new Blob([String(htmlText || "")], { type: "text/html;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = String(fileName || "clickESM.html");
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1500);
}

function buildClickEsmDownloadFileName(programmer) {
  const label = firstNonEmptyString([
    programmer?.programmerName,
    programmer?.mediaCompanyName,
    programmer?.programmerId,
  ]);
  const base = sanitizeDownloadFileSegment(label, "MediaCompany");
  return `${base}_clickESM.html`;
}

function resolveClickEsmDownloadContext(decompState = null) {
  if (decompState?.programmer?.programmerId && decompState?.appInfo?.guid) {
    return {
      programmer: decompState.programmer,
      appInfo: decompState.appInfo,
      requestorIds: clickEsmGetSelectedValues(decompState.requestorSelect),
      mvpdIds: decompState?.mvpdSelect?.disabled ? [] : clickEsmGetSelectedValues(decompState.mvpdSelect),
      section: decompState.section || null,
    };
  }

  const selectedProgrammer = resolveSelectedProgrammer();
  if (!selectedProgrammer?.programmerId) {
    return null;
  }
  const selectedServices = state.premiumAppsByProgrammerId.get(selectedProgrammer.programmerId) || null;
  const esmApp = selectedServices?.esm || null;
  if (!esmApp?.guid) {
    return null;
  }
  return {
    programmer: selectedProgrammer,
    appInfo: esmApp,
    requestorIds: state.selectedRequestorId ? [String(state.selectedRequestorId)] : [],
    mvpdIds: state.selectedMvpdId ? [String(state.selectedMvpdId)] : [],
    section: null,
  };
}

async function makeClickEsmDownload(context, requestToken, options = {}) {
  const programmer = context?.programmer || null;
  const appInfo = context?.appInfo || null;
  if (!programmer?.programmerId) {
    throw new Error("Media company is required to generate clickESM.");
  }
  if (!appInfo?.guid) {
    throw new Error("ESM application details are required to generate clickESM.");
  }
  if (
    context?.section &&
    !isEsmServiceRequestActive(context.section, requestToken, programmer.programmerId)
  ) {
    throw new Error("decomp controller is no longer active for the selected media company.");
  }

  const accessToken = await ensureDcrAccessToken(programmer.programmerId, appInfo, false, {
    service: "esm-clickesm",
    scope: PREMIUM_SERVICE_SCOPE_BY_KEY.esm,
    requestorIds: Array.isArray(context?.requestorIds) ? context.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(context?.mvpdIds) ? context.mvpdIds.slice(0, 24) : [],
    requestorId: String(context?.requestorIds?.[0] || ""),
    mvpd: String(context?.mvpdIds?.[0] || ""),
    appGuid: String(appInfo?.guid || ""),
    appName: String(appInfo?.appName || appInfo?.guid || ""),
    source: String(options.source || "sidepanel"),
  });

  const dcrCache = loadDcrCache(programmer.programmerId, appInfo.guid) || {};
  const clientId = String(dcrCache.clientId || "");
  const clientSecret = String(dcrCache.clientSecret || "");
  const resolvedAccessToken = String(accessToken || dcrCache.accessToken || "");
  if (!clientId || !clientSecret || !resolvedAccessToken) {
    throw new Error("Unable to resolve ESM credentials/token for clickESM generation.");
  }

  const templateHtml = await loadClickEsmTemplateHtml();
  const programmerLabel = firstNonEmptyString([
    programmer?.programmerName,
    programmer?.mediaCompanyName,
    programmer?.programmerId,
  ]) || "Media Company";
  const fileName = buildClickEsmDownloadFileName(programmer);
  const downloadHtml = buildClickEsmHtmlFromTemplate(templateHtml, {
    programmerLabel,
    clientId,
    clientSecret,
    accessToken: resolvedAccessToken,
  });
  downloadClickEsmHtmlFile(downloadHtml, fileName);
  return {
    fileName,
    programmerLabel,
  };
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
  const serviceLabel = "decomp";

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
      const columns = normalizeEsmColumns(endpoint.columns);
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
  const profileHarvestContext = {
    programmerId: String(decompState?.programmer?.programmerId || ""),
    requestorId: String(requestorIds[0] || ""),
    mvpd: String(mvpdIds[0] || ""),
  };
  const profileHarvest = getRestV2ProfileHarvestForContext(profileHarvestContext);
  const profileHarvestList = getRestV2ProfileHarvestBucketForProgrammer(profileHarvestContext.programmerId);
  return {
    controllerOnline: Boolean(decompState?.section?.isConnected),
    esmAvailable: true,
    programmerId: String(decompState?.programmer?.programmerId || ""),
    programmerName: String(decompState?.programmer?.programmerName || ""),
    requestorIds,
    mvpdIds,
    profileHarvest:
      profileHarvest && typeof profileHarvest === "object"
        ? {
            ...profileHarvest,
          }
        : null,
    profileHarvestList:
      profileHarvestList.length > 0
        ? profileHarvestList.map((item) => ({
            ...item,
          }))
        : [],
    updatedAt: Date.now(),
  };
}

function decompGetSelectedControllerStatePayload(programmer = null, services = null) {
  const resolvedProgrammer =
    programmer && typeof programmer === "object" ? programmer : resolveSelectedProgrammer();
  let resolvedServices = services;
  if (!resolvedServices && resolvedProgrammer?.programmerId) {
    resolvedServices = state.premiumAppsByProgrammerId.get(resolvedProgrammer.programmerId) || null;
  }

  const requestorIds = state.selectedRequestorId ? [String(state.selectedRequestorId)] : [];
  const mvpdIds = state.selectedMvpdId ? [String(state.selectedMvpdId)] : [];
  let esmAvailable = null;
  if (resolvedServices && typeof resolvedServices === "object") {
    esmAvailable = Boolean(resolvedServices.esm);
  }
  const profileHarvestContext = {
    programmerId: String(resolvedProgrammer?.programmerId || ""),
    requestorId: String(requestorIds[0] || ""),
    mvpd: String(mvpdIds[0] || ""),
  };
  const profileHarvest = getRestV2ProfileHarvestForContext(profileHarvestContext);
  const profileHarvestList = getRestV2ProfileHarvestBucketForProgrammer(profileHarvestContext.programmerId);

  return {
    controllerOnline: false,
    esmAvailable,
    programmerId: String(resolvedProgrammer?.programmerId || ""),
    programmerName: String(resolvedProgrammer?.programmerName || ""),
    requestorIds,
    mvpdIds,
    profileHarvest:
      profileHarvest && typeof profileHarvest === "object"
        ? {
            ...profileHarvest,
          }
        : null,
    profileHarvestList:
      profileHarvestList.length > 0
        ? profileHarvestList.map((item) => ({
            ...item,
          }))
        : [],
    updatedAt: Date.now(),
  };
}

function decompBroadcastSelectedControllerState(programmer = null, services = null, targetWindowId = 0) {
  const resolvedWindowId = Number(targetWindowId || 0) || Number(state.decompWorkspaceWindowId || 0);
  void decompSendWorkspaceMessage("controller-state", decompGetSelectedControllerStatePayload(programmer, services), {
    targetWindowId: resolvedWindowId,
  });
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
      const reason = error instanceof Error ? error.message : String(error);
      emitDecompDebugEvent(flowId, {
        phase: "access-token-prime-failed",
        error: reason,
      });
      throw new Error(`Unable to fetch a fresh ESM access token: ${reason}`);
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

function decompNormalizeRunRequestUrlOverride(endpointUrl, requestUrlOverride) {
  const endpointRaw = String(endpointUrl || "").trim();
  const overrideRaw = String(requestUrlOverride || "").trim();
  if (!endpointRaw || !overrideRaw) {
    return "";
  }

  try {
    const endpointParsed = new URL(endpointRaw);
    const overrideParsed = new URL(overrideRaw);
    const endpointPath = String(endpointParsed.pathname || "").replace(/\/+$/g, "");
    const overridePath = String(overrideParsed.pathname || "").replace(/\/+$/g, "");
    if (endpointParsed.origin !== overrideParsed.origin || endpointPath !== overridePath) {
      return "";
    }
    overrideParsed.hash = "";
    return overrideParsed.toString();
  } catch (_error) {
    return "";
  }
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
    columns: normalizeEsmColumns(fallback.columns),
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
  const requestUrlOverride = decompNormalizeRunRequestUrlOverride(endpoint.url, options.requestUrlOverride);
  const requestUrl = clickEsmEnsureLimit(
    requestUrlOverride || decompBuildEndpointUrl(decompState, endpoint),
    DECOMP_INLINE_RESULT_LIMIT
  );
  const activeFlowId = getActiveDecompDebugFlowId();
  const reportMeta = {
    cardId: normalizedCardId,
    endpointUrl: endpoint.url,
    requestUrl,
    zoomKey: clickEsmGetZoomKey(endpoint),
    columns: normalizeEsmColumns(endpoint.columns),
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
        <button type="button" class="decomp-reset-btn">RESET</button>
        <button
          type="button"
          class="decomp-make-clickesm-btn decomp-toolbar-icon-btn decomp-toolbar-icon-btn--tearsheet"
          title="Generate ESM tearsheet (clickESM)"
          aria-label="Generate ESM tearsheet (clickESM)"
        >
          <span class="decomp-toolbar-icon decomp-toolbar-icon--tearsheet" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M7 3.75h7.25L19 8.5v11.75A1.75 1.75 0 0 1 17.25 22H7A1.75 1.75 0 0 1 5.25 20.25V5.5A1.75 1.75 0 0 1 7 3.75Z" />
              <path d="M14.25 3.75V8.5H19" />
              <path d="M9.5 12.75 10 14.25 11.5 14.75 10 15.25 9.5 16.75 9 15.25 7.5 14.75 9 14.25 9.5 12.75Z" />
              <path d="M14 12.25 14.3 13.1 15.2 13.4 14.3 13.7 14 14.55 13.7 13.7 12.8 13.4 13.7 13.1 14 12.25Z" />
            </svg>
          </span>
        </button>
        <span class="decomp-net-indicator" title="Loading" aria-label="Loading" hidden></span>
      </div>
      <div class="decomp-tree-panel">
        <div class="decomp-tree-head">
          <div class="decomp-tree-title">decomp Tree</div>
          <div class="decomp-tree-actions">
            <button type="button" class="decomp-tree-toggle-btn" aria-expanded="false" title="Expand all nodes">[ + ]</button>
          </div>
        </div>
        <div class="decomp-tree-scroll">
          <div class="decomp-tree-root"></div>
        </div>
      </div>
      <div class="decomp-treemap-panel">
        <div class="decomp-treemap-head">
          <div class="decomp-treemap-title">decomp Treemap</div>
          <div class="decomp-tree-actions">
            <button type="button" class="decomp-treemap-toggle-btn" aria-expanded="true" title="Hide treemap">Hide</button>
          </div>
        </div>
        <div class="decomp-treemap-scroll">
          <div class="decomp-treemap-root"></div>
        </div>
      </div>
      <div class="decomp-recording-tool">
        <p class="decomp-recording-status">Click START RECORDING to capture decomp ESM traffic in the UP trace.</p>
        <div class="decomp-recording-actions">
          <button type="button" class="decomp-start-record-btn">START RECORDING</button>
          <button type="button" class="decomp-stop-record-btn" disabled hidden>STOP</button>
        </div>
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

function decompParsePathParts(rawValue) {
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    return [];
  }
  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((value) => String(value || "").trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function decompRenderLabelChips(labelElement, pathParts, term = "", highlightPattern = null) {
  if (!labelElement) {
    return;
  }
  const normalizedParts = Array.isArray(pathParts)
    ? pathParts.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  const normalizedTerm = String(term || "").trim();
  labelElement.innerHTML = "";
  normalizedParts.forEach((segment, index) => {
    const chip = document.createElement("span");
    chip.className = "decomp-chip";
    chip.dataset.raw = segment;
    const segHay = segment.toLowerCase().replace(/\s+/g, "");
    const showHighlight = Boolean(normalizedTerm && highlightPattern && segHay.includes(normalizedTerm));
    if (showHighlight) {
      chip.innerHTML = segment.replace(highlightPattern, (match) => `<mark>${escapeHtml(match)}</mark>`);
    } else {
      chip.textContent = segment;
    }
    decompApplyChipColor(chip, segment);
    labelElement.appendChild(chip);

    if (index < normalizedParts.length - 1) {
      const separator = document.createElement("span");
      separator.className = "decomp-badge";
      separator.textContent = "/";
      separator.title = "Compressed path";
      labelElement.appendChild(separator);
    }
  });
}

async function decompRunEndpointFromUi(decompState, endpoint, requestToken, requestSource = "tree") {
  if (!decompState || !endpoint?.url) {
    return;
  }
  try {
    await decompEnsureWorkspaceTab({ activate: true, windowId: decompState.controllerWindowId });
    decompBroadcastControllerState(decompState);
    await decompRunEndpointToWorkspace(decompState, endpoint, generateRequestId(), requestToken, {
      emitStart: true,
      requestSource,
    });
  } catch (error) {
    setStatus(`Unable to open decomp workspace: ${error instanceof Error ? error.message : String(error)}`, "error");
  }
}

async function decompMakeClickEsmFromUi(decompState, requestToken, source = "sidepanel") {
  if (!decompState) {
    return;
  }
  const triggerButton = decompState.makeClickEsmButton;
  if (triggerButton) {
    triggerButton.disabled = true;
  }
  try {
    const context = resolveClickEsmDownloadContext(decompState);
    if (!context) {
      throw new Error("Select a media company with ESM access to generate clickESM.");
    }
    const result = await makeClickEsmDownload(context, requestToken, { source });
    setStatus(`Downloaded ${result.fileName} for ${result.programmerLabel}.`, "success");
  } catch (error) {
    setStatus(`Unable to generate clickESM: ${error instanceof Error ? error.message : String(error)}`, "error");
  } finally {
    if (triggerButton && isEsmServiceRequestActive(decompState.section, requestToken, decompState.programmer?.programmerId)) {
      triggerButton.disabled = false;
    }
  }
}

function decompRenderTreeNode(decompState, node, parentUl, requestToken, parentPathParts = []) {
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
  const parts = Array.isArray(node.parts) ? node.parts.map((value) => String(value || "").trim()).filter(Boolean) : [];
  const fullPathParts = [...(Array.isArray(parentPathParts) ? parentPathParts : []), ...parts];
  item.dataset.nodeParts = JSON.stringify(parts);
  item.dataset.pathParts = JSON.stringify(fullPathParts);
  item.dataset.pathHay = fullPathParts.join(" ").toLowerCase().replace(/\s+/g, "");
  decompRenderLabelChips(label, parts);

  const meta = document.createElement("span");
  meta.className = "decomp-meta";
  meta.textContent = "";

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
      meta.textContent = `[${endpoint.zoomKey}]`;
    }

    const runButton = document.createElement("button");
    runButton.className = "decomp-run";
    runButton.type = "button";
    runButton.textContent = "▶";
    runButton.title = "Run this endpoint in Workspace";
    runButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void decompRunEndpointFromUi(decompState, endpoint, requestToken, "tree");
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
    decompSyncTreeToggleButton(decompState);
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
      void decompRunEndpointFromUi(decompState, endpoint, requestToken, "tree");
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
      decompRenderTreeNode(decompState, child, childUl, requestToken, fullPathParts);
    });
    item.appendChild(childUl);
  }
  parentUl.appendChild(item);
}

function decompIsTreeFullyExpanded(decompState) {
  const root = decompState?.treeRootElement;
  if (!root) {
    return false;
  }

  const nestedLists = [...root.querySelectorAll("li > ul")].filter((nested) => {
    const parentItem = nested.parentElement;
    if (!(parentItem instanceof HTMLElement)) {
      return false;
    }
    return parentItem.style.display !== "none";
  });

  if (nestedLists.length === 0) {
    return false;
  }

  return nestedLists.every((nested) => nested.style.display !== "none");
}

function decompSyncTreeToggleButton(decompState) {
  const button = decompState?.treeToggleButton;
  if (!button) {
    return;
  }

  const root = decompState?.treeRootElement;
  if (!root) {
    button.textContent = "[ + ]";
    button.title = "Expand all nodes";
    button.setAttribute("aria-label", "Expand all nodes");
    button.setAttribute("aria-expanded", "false");
    button.dataset.nextState = "expand";
    button.disabled = true;
    return;
  }

  const hasExpandableNodes = root.querySelector("li > ul") != null;
  if (!hasExpandableNodes) {
    button.textContent = "[ + ]";
    button.title = "No expandable nodes";
    button.setAttribute("aria-label", "No expandable nodes");
    button.setAttribute("aria-expanded", "false");
    button.dataset.nextState = "expand";
    button.disabled = true;
    return;
  }

  const expanded = decompIsTreeFullyExpanded(decompState);
  const nextState = expanded ? "collapse" : "expand";
  const label = expanded ? "[ - ]" : "[ + ]";
  const title = expanded ? "Collapse all nodes" : "Expand all nodes";

  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.setAttribute("aria-expanded", expanded ? "true" : "false");
  button.dataset.nextState = nextState;
  button.disabled = false;
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
  decompSyncTreeToggleButton(decompState);
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

function decompBuildTreemapModel(catalog, endpointIndexes) {
  const root = {
    key: "",
    pathParts: [],
    endpointIndex: null,
    children: new Map(),
    count: 0,
  };

  const normalizedIndexes = [...new Set(
    (Array.isArray(endpointIndexes) ? endpointIndexes : [])
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < catalog.length)
  )];

  normalizedIndexes.forEach((endpointIndex) => {
    const endpoint = catalog[endpointIndex];
    if (!endpoint) {
      return;
    }
    let cursor = root;
    endpoint.segs.forEach((rawSegment) => {
      const segment = String(rawSegment || "").trim();
      if (!segment) {
        return;
      }
      if (!cursor.children.has(segment)) {
        cursor.children.set(segment, {
          key: segment,
          pathParts: [...cursor.pathParts, segment],
          endpointIndex: null,
          children: new Map(),
          count: 0,
        });
      }
      cursor = cursor.children.get(segment);
    });
    cursor.endpointIndex = endpointIndex;
  });

  const finalize = (node) => {
    const childNodes = [...node.children.values()].sort((left, right) => decompCompareSegments(left.key, right.key));
    node.children = childNodes.map((child) => finalize(child));
    let endpointCount = node.endpointIndex != null ? 1 : 0;
    node.children.forEach((child) => {
      endpointCount += Number(child.count || 0);
    });
    node.count = endpointCount;
    return node;
  };

  return finalize(root);
}

function decompFlattenTreemapNodes(model) {
  const output = [];
  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) {
      return;
    }
    node.children.forEach((child) => {
      const pathParts = Array.isArray(child.pathParts)
        ? child.pathParts.slice().map((value) => String(value || "").trim()).filter(Boolean)
        : [String(child.key || "").trim()].filter(Boolean);
      output.push({
        key: String(child.key || "").trim(),
        pathParts,
        depth: pathParts.length,
        endpointIndex: child.endpointIndex != null ? Number(child.endpointIndex) : null,
        count: Number(child.count || 0),
      });
      walk(child);
    });
  };

  walk(model);
  output.sort((left, right) => {
    const depthDelta = Number(left.depth || 0) - Number(right.depth || 0);
    if (depthDelta !== 0) {
      return depthDelta;
    }
    return left.pathParts
      .join("/")
      .localeCompare(right.pathParts.join("/"), undefined, { sensitivity: "base" });
  });
  return output;
}

function decompCreateTreemapTile(decompState, nodeEntry, requestToken) {
  const tile = document.createElement("article");
  tile.className = "decomp-map-tile";
  tile.dataset.depth = String(Math.max(1, Number(nodeEntry?.depth || 1)));

  const hexColor = decompGetSegmentColor(nodeEntry?.key);
  const rgb = decompHexToRgb(hexColor);
  if (rgb) {
    tile.style.setProperty("--tile-rgb", `${rgb.red}, ${rgb.green}, ${rgb.blue}`);
  } else {
    tile.style.setProperty("--tile-rgb", "106, 106, 106");
  }

  const endpoint =
    nodeEntry?.endpointIndex != null && Number.isInteger(nodeEntry.endpointIndex)
      ? decompState.catalog[nodeEntry.endpointIndex]
      : null;
  if (endpoint) {
    tile.classList.add("decomp-map-leaf");
  }

  const content = document.createElement("div");
  content.className = "decomp-map-content";

  const name = document.createElement("div");
  name.className = "decomp-map-name";
  name.textContent = nodeEntry?.key || "node";
  name.title = Array.isArray(nodeEntry?.pathParts) ? nodeEntry.pathParts.join("/") : "";
  content.appendChild(name);

  const parent = document.createElement("div");
  parent.className = "decomp-map-parent";
  const parentParts = Array.isArray(nodeEntry?.pathParts) ? nodeEntry.pathParts.slice(0, -1) : [];
  parent.textContent = parentParts.length > 0 ? parentParts.join(" / ") : "media-company";
  parent.title = parentParts.join("/");
  content.appendChild(parent);

  const meta = document.createElement("div");
  meta.className = "decomp-map-meta";
  if (endpoint?.zoomKey) {
    meta.textContent = `[${endpoint.zoomKey}]`;
  } else {
    const endpointCount = Number(nodeEntry?.count || 0);
    meta.textContent = `${endpointCount} endpoint${endpointCount === 1 ? "" : "s"}`;
  }
  content.appendChild(meta);
  tile.appendChild(content);

  if (endpoint) {
    const runLink = document.createElement("a");
    runLink.href = "#";
    runLink.className = "decomp-map-run-link";
    runLink.textContent = "Get ESM";
    runLink.title = "Get ESM in Workspace";
    runLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void decompRunEndpointFromUi(decompState, endpoint, requestToken, "treemap");
    });
    tile.appendChild(runLink);
  }

  if (endpoint) {
    tile.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest(".decomp-map-run-link")) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      void decompRunEndpointFromUi(decompState, endpoint, requestToken, "treemap");
    });
  }

  return tile;
}

function decompRenderTreemap(decompState, endpointIndexes, options = {}) {
  const treemapRoot = decompState?.treemapRootElement;
  if (!treemapRoot) {
    return;
  }
  const requestToken = Number(options.requestToken || decompState?.requestToken || state.premiumPanelRequestToken || 0);
  const endpointList = [...new Set(
    (Array.isArray(endpointIndexes) ? endpointIndexes : [])
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0)
  )];
  const model = decompBuildTreemapModel(decompState.catalog, endpointList);
  const onlyRunnable = options.onlyRunnable === true;
  const nodeEntries = decompFlattenTreemapNodes(model).filter((nodeEntry) => {
    if (!onlyRunnable) {
      return true;
    }
    return Number.isInteger(nodeEntry?.endpointIndex) && nodeEntry.endpointIndex >= 0;
  });
  treemapRoot.innerHTML = "";

  if (!model || nodeEntries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "decomp-treemap-empty";
    empty.textContent = "No endpoints match current zoom/search filters.";
    treemapRoot.appendChild(empty);
  } else {
    const groupedByDepth = new Map();
    nodeEntries.forEach((nodeEntry) => {
      const depth = Math.max(1, Number(nodeEntry.depth || 1));
      if (!groupedByDepth.has(depth)) {
        groupedByDepth.set(depth, []);
      }
      groupedByDepth.get(depth).push(nodeEntry);
    });

    [...groupedByDepth.keys()].sort((left, right) => left - right).forEach((depth) => {
      const depthNodes = groupedByDepth.get(depth) || [];
      const band = document.createElement("section");
      band.className = "decomp-map-depth-band";
      band.dataset.depth = String(depth);

      const bandHead = document.createElement("div");
      bandHead.className = "decomp-map-depth-head";
      const depthLabel = document.createElement("span");
      depthLabel.className = "decomp-map-depth-label";
      depthLabel.textContent = `Level ${depth}`;
      const depthCount = document.createElement("span");
      depthCount.className = "decomp-map-depth-count";
      depthCount.textContent = `${depthNodes.length} node${depthNodes.length === 1 ? "" : "s"}`;
      bandHead.appendChild(depthLabel);
      bandHead.appendChild(depthCount);
      band.appendChild(bandHead);

      const bandGrid = document.createElement("div");
      bandGrid.className = "decomp-map-grid";
      depthNodes.forEach((nodeEntry) => {
        const tile = decompCreateTreemapTile(decompState, nodeEntry, requestToken);
        bandGrid.appendChild(tile);
      });
      band.appendChild(bandGrid);

      treemapRoot.appendChild(band);
    });
  }

}

function decompSetTreemapCollapsed(decompState, shouldCollapse) {
  const toggleButton = decompState?.treemapToggleButton;
  const scrollElement = decompState?.treemapScrollElement;
  if (!toggleButton || !scrollElement) {
    return;
  }
  const collapsed = Boolean(shouldCollapse);
  scrollElement.hidden = collapsed;
  toggleButton.textContent = collapsed ? "Show" : "Hide";
  toggleButton.title = collapsed ? "Show treemap" : "Hide treemap";
  toggleButton.setAttribute("aria-label", collapsed ? "Show treemap" : "Hide treemap");
  toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
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
  const searchMode = Boolean(term);
  const filteredMode = Boolean(searchMode || zoomFilter);
  const doHighlight = Boolean(options.highlight && term);
  const highlightPattern = doHighlight ? new RegExp(clickEsmEscapeRegExp(term), "gi") : null;
  let visibleEndpoints = 0;
  const visibleEndpointIndexes = [];
  root.classList.toggle("decomp-search-mode", searchMode);

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

    const isEndpoint = item.hasAttribute("data-endpoint-index");
    let selfVisible = false;

    const label = item.querySelector(":scope > .decomp-node > .decomp-label");

    if (isEndpoint) {
      const endpointZoom = String(item.dataset.zoomKey || "").trim().toUpperCase();
      const haystack = String(item.dataset.hay || "").toLowerCase();
      const zoomPass = !zoomFilter || endpointZoom === zoomFilter;
      const termPass = !term || haystack.includes(term);
      selfVisible = zoomPass && termPass;
      if (selfVisible) {
        visibleEndpoints += 1;
        const endpointIndex = Number(item.dataset.endpointIndex || -1);
        if (Number.isInteger(endpointIndex) && endpointIndex >= 0) {
          visibleEndpointIndexes.push(endpointIndex);
        }
      }

      if (label) {
        const partsForRender = searchMode
          ? decompParsePathParts(item.dataset.pathParts)
          : decompParsePathParts(item.dataset.nodeParts);
        decompRenderLabelChips(label, partsForRender, doHighlight ? term : "", highlightPattern);
      }

      const runButton = item.querySelector(":scope > .decomp-node > .decomp-run");
      if (runButton) {
        runButton.style.display = selfVisible ? "" : "none";
      }

      if (label) {
        const pathHay = String(item.dataset.pathHay || "");
        const segMatch = Boolean(term && pathHay.includes(term));
        const colOnlyMatch = Boolean(term && termPass && !segMatch);
        label.classList.toggle("decomp-col-match", colOnlyMatch);
      }
    } else if (label && !searchMode) {
      decompRenderLabelChips(label, decompParsePathParts(item.dataset.nodeParts));
      label.classList.remove("decomp-col-match");
    }

    // Endpoint nodes can also be branch parents; keep the branch visible when descendants match.
    const shouldShow = selfVisible || anyVisibleChild;
    item.style.display = shouldShow ? "" : "none";
    item.classList.toggle("decomp-search-parent", searchMode && !selfVisible && anyVisibleChild);

    if (searchMode && shouldShow && anyVisibleChild && childList) {
      childList.style.display = "";
      const twisty = item.querySelector(":scope > .decomp-node > .decomp-twisty");
      if (twisty && !twisty.classList.contains("hidden")) {
        twisty.textContent = "−";
      }
    } else if (!searchMode) {
      item.classList.remove("decomp-search-parent");
    }

    return shouldShow;
  };

  const topList = root.querySelector("ul.decomp-root");
  if (topList) {
    [...topList.children].forEach((topItem) => {
      walk(topItem);
    });
  }

  decompRenderTreemap(decompState, visibleEndpointIndexes, {
    zoomFilter,
    onlyRunnable: filteredMode,
    requestToken: options.requestToken || decompState?.requestToken || state.premiumPanelRequestToken || 0,
  });
  decompSyncTreeToggleButton(decompState);
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
    decompRenderTreeNode(decompState, model, rootList, requestToken, []);
  } else {
    model.children.forEach((childNode) => {
      decompRenderTreeNode(decompState, childNode, rootList, requestToken, []);
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

  const applyDecompSearchFilters = ({ highlight = false, normalizeInput = false } = {}) => {
    const normalizedTerm = clickEsmNormalizeSearchTerm(decompState.searchInput?.value || "");
    if (decompState.searchInput && normalizeInput) {
      decompState.searchInput.value = normalizedTerm;
    }
    decompApplyTreeFilters(decompState, {
      term: normalizedTerm,
      highlight: Boolean(highlight && normalizedTerm),
    });
  };

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

  decompState.resetButton?.addEventListener("click", () => {
    if (decompState.searchInput) {
      decompState.searchInput.value = "";
    }
    if (decompState.zoomFilterSelect) {
      decompState.zoomFilterSelect.value = "";
    }
    applyDecompSearchFilters({ highlight: false, normalizeInput: true });
  });

  decompState.makeClickEsmButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void decompMakeClickEsmFromUi(decompState, requestToken, "sidepanel");
  });

  decompState.zoomFilterSelect?.addEventListener("change", () => {
    applyDecompSearchFilters({ highlight: true });
  });

  decompState.searchInput?.addEventListener("input", () => {
    applyDecompSearchFilters({ highlight: true });
  });

  decompState.searchInput?.addEventListener("change", () => {
    applyDecompSearchFilters({ highlight: true });
  });

  decompState.searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    applyDecompSearchFilters({ highlight: true, normalizeInput: true });
  });

  decompState.treeToggleButton?.addEventListener("click", () => {
    const nextState = String(decompState.treeToggleButton?.dataset.nextState || "expand").trim().toLowerCase();
    const shouldExpand = nextState !== "collapse";
    decompExpandCollapseAll(decompState, shouldExpand);
  });

  decompState.treemapToggleButton?.addEventListener("click", () => {
    const expanded = String(decompState.treemapToggleButton?.getAttribute("aria-expanded") || "true") !== "false";
    decompSetTreemapCollapsed(decompState, expanded);
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
      const selectedProgrammer = resolveSelectedProgrammer();
      const selectedServices = selectedProgrammer?.programmerId
        ? state.premiumAppsByProgrammerId.get(selectedProgrammer.programmerId) || null
        : null;
      decompBroadcastSelectedControllerState(selectedProgrammer, selectedServices, senderWindowId);
    }
    return { ok: true, controllerOnline: Boolean(decompState) };
  }

  if (action === "make-clickesm") {
    const context = resolveClickEsmDownloadContext(decompState);
    if (!context) {
      return { ok: false, error: "Select a media company with ESM access to generate clickESM." };
    }
    const requestToken = Number(state.premiumPanelRequestToken || 0);
    const result = await makeClickEsmDownload(context, requestToken, { source: "workspace" });
    return {
      ok: true,
      fileName: result.fileName,
      programmerLabel: result.programmerLabel,
    };
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
    const requestSourceRaw = String(message?.requestSource || "").trim().toLowerCase();
    const requestSource = requestSourceRaw || "workspace";
    const allowRequestOverride = requestSource === "workspace-path-link" || requestSource === "workspace-path-node";
    const requestUrlOverride = allowRequestOverride ? String(card?.requestUrl || "") : "";
    emitDecompDebugEvent(activeFlowId, {
      phase: "workspace-action",
      action: "run-card",
      source: "workspace",
      cardId: String(card?.cardId || ""),
      endpointUrl: String(card?.endpointUrl || ""),
      requestSource,
    });
    const endpoint = decompFindEndpointByUrl(decompState, card.endpointUrl, card);
    if (!endpoint) {
      return { ok: false, error: "Endpoint URL is required." };
    }
    await decompRunEndpointToWorkspace(decompState, endpoint, String(card.cardId || generateRequestId()), requestToken, {
      emitStart: true,
      requestSource,
      requestUrlOverride,
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
      requestToken,
      zoomFilterSelect: contentElement.querySelector(".decomp-zoom-filter"),
      searchInput: contentElement.querySelector(".decomp-search"),
      resetButton: contentElement.querySelector(".decomp-reset-btn"),
      makeClickEsmButton: contentElement.querySelector(".decomp-make-clickesm-btn"),
      treeToggleButton: contentElement.querySelector(".decomp-tree-toggle-btn"),
      treeRootElement: contentElement.querySelector(".decomp-tree-root"),
      treemapToggleButton: contentElement.querySelector(".decomp-treemap-toggle-btn"),
      treemapRootElement: contentElement.querySelector(".decomp-treemap-root"),
      treemapScrollElement: contentElement.querySelector(".decomp-treemap-scroll"),
      requestorSelect: contentElement.querySelector(".decomp-requestor-select"),
      mvpdSelect: contentElement.querySelector(".decomp-mvpd-select"),
      recordingStatusElement: contentElement.querySelector(".decomp-recording-status"),
      startRecordingButton: contentElement.querySelector(".decomp-start-record-btn"),
      stopRecordingButton: contentElement.querySelector(".decomp-stop-record-btn"),
    };

    section.__underparDecompState = decompState;
    wireDecompInteractions(decompState, requestToken);
    decompSetTreemapCollapsed(decompState, false);
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

function isCmServiceRequestActive(section, requestToken, programmerId) {
  if (!section || !section.isConnected) {
    return false;
  }
  if (requestToken !== state.premiumPanelRequestToken) {
    return false;
  }
  const selected = resolveSelectedProgrammer();
  return Boolean(selected && selected.programmerId === programmerId);
}

function cmGetWorkspaceUrl() {
  return chrome.runtime.getURL(CM_WORKSPACE_PATH);
}

function cmIsWorkspaceTab(tabLike) {
  return String(tabLike?.url || "").startsWith(cmGetWorkspaceUrl());
}

function cmBindWorkspaceTab(windowId, tabId) {
  const normalizedWindowId = Number(windowId || 0);
  const normalizedTabId = Number(tabId || 0);
  if (normalizedWindowId > 0 && normalizedTabId > 0) {
    state.cmWorkspaceTabIdByWindowId.set(normalizedWindowId, normalizedTabId);
  }
  if (normalizedWindowId > 0) {
    state.cmWorkspaceWindowId = normalizedWindowId;
  }
  if (normalizedTabId > 0) {
    state.cmWorkspaceTabId = normalizedTabId;
  }
}

function cmUnbindWorkspaceTab(tabId) {
  const normalizedTabId = Number(tabId || 0);
  if (normalizedTabId > 0) {
    for (const [windowId, mappedTabId] of state.cmWorkspaceTabIdByWindowId.entries()) {
      if (Number(mappedTabId || 0) === normalizedTabId) {
        state.cmWorkspaceTabIdByWindowId.delete(windowId);
      }
    }
  }

  if (!normalizedTabId || Number(state.cmWorkspaceTabId || 0) === normalizedTabId) {
    state.cmWorkspaceTabId = 0;
    state.cmWorkspaceWindowId = 0;
  }
}

function cmGetBoundWorkspaceTabId(windowId) {
  const normalizedWindowId = Number(windowId || 0);
  if (normalizedWindowId > 0) {
    const mapped = Number(state.cmWorkspaceTabIdByWindowId.get(normalizedWindowId) || 0);
    if (mapped > 0) {
      return mapped;
    }
  }
  return Number(state.cmWorkspaceTabId || 0);
}

function cmGetControllerStatePayload(cmState) {
  const requestorIds = state.selectedRequestorId ? [String(state.selectedRequestorId)] : [];
  const mvpdIds = state.selectedMvpdId ? [String(state.selectedMvpdId)] : [];
  const profileHarvest = getCmProfileHarvestForProgrammer(cmState?.programmer || null);
  const profileHarvestList = getCmProfileHarvestListForProgrammer(cmState?.programmer || null);
  return {
    controllerOnline: Boolean(cmState?.section?.isConnected),
    cmAvailable: true,
    programmerId: String(cmState?.programmer?.programmerId || ""),
    programmerName: String(cmState?.programmer?.programmerName || ""),
    requestorIds,
    mvpdIds,
    profileHarvest:
      profileHarvest && typeof profileHarvest === "object"
        ? {
            ...profileHarvest,
          }
        : null,
    profileHarvestList:
      profileHarvestList.length > 0
        ? profileHarvestList.map((item) => ({
            ...item,
          }))
        : [],
    updatedAt: Date.now(),
  };
}

function cmGetSelectedControllerStatePayload(programmer = null, services = null) {
  const resolvedProgrammer =
    programmer && typeof programmer === "object" ? programmer : resolveSelectedProgrammer();
  let resolvedServices = services;
  if (!resolvedServices && resolvedProgrammer?.programmerId) {
    resolvedServices = state.premiumAppsByProgrammerId.get(resolvedProgrammer.programmerId) || null;
  }

  let cmAvailable = null;
  if (resolvedServices && typeof resolvedServices === "object" && Object.prototype.hasOwnProperty.call(resolvedServices, "cm")) {
    cmAvailable = shouldShowCmService(resolvedServices.cm);
  }
  const requestorIds = state.selectedRequestorId ? [String(state.selectedRequestorId)] : [];
  const mvpdIds = state.selectedMvpdId ? [String(state.selectedMvpdId)] : [];
  const profileHarvest = getCmProfileHarvestForProgrammer(resolvedProgrammer);
  const profileHarvestList = getCmProfileHarvestListForProgrammer(resolvedProgrammer);
  return {
    controllerOnline: false,
    cmAvailable,
    programmerId: String(resolvedProgrammer?.programmerId || ""),
    programmerName: String(resolvedProgrammer?.programmerName || ""),
    requestorIds,
    mvpdIds,
    profileHarvest:
      profileHarvest && typeof profileHarvest === "object"
        ? {
            ...profileHarvest,
          }
        : null,
    profileHarvestList:
      profileHarvestList.length > 0
        ? profileHarvestList.map((item) => ({
            ...item,
          }))
        : [],
    updatedAt: Date.now(),
  };
}

async function cmSendWorkspaceMessage(event, payload = {}, options = {}) {
  const targetWindowId = Number(options.targetWindowId || 0);
  try {
    const message = {
      type: CM_MESSAGE_TYPE,
      channel: "workspace-event",
      event: String(event || ""),
      payload,
    };
    if (targetWindowId > 0) {
      message.targetWindowId = targetWindowId;
    }
    await chrome.runtime.sendMessage(message);
  } catch {
    // Ignore when no CM workspace listener is active.
  }
}

function cmBroadcastSelectedControllerState(programmer = null, services = null, targetWindowId = 0) {
  const resolvedWindowId = Number(targetWindowId || 0) || Number(state.cmWorkspaceWindowId || 0);
  void cmSendWorkspaceMessage("controller-state", cmGetSelectedControllerStatePayload(programmer, services), {
    targetWindowId: resolvedWindowId,
  });
}

function cmBroadcastControllerState(cmState, targetWindowId = 0) {
  if (!cmState) {
    return;
  }
  const resolvedWindowId =
    Number(targetWindowId || 0) || Number(cmState.controllerWindowId || 0) || Number(state.cmWorkspaceWindowId || 0);
  void cmSendWorkspaceMessage("controller-state", cmGetControllerStatePayload(cmState), {
    targetWindowId: resolvedWindowId,
  });
}

async function cmEnsureWorkspaceTab(options = {}) {
  const shouldActivate = options.activate !== false;
  const requestedWindowId = Number(options.windowId || 0);
  const targetWindowId = requestedWindowId > 0 ? requestedWindowId : await decompGetCurrentWindowId();
  const useWindowFilter = targetWindowId > 0;
  let workspaceTab = null;

  const boundTabId = cmGetBoundWorkspaceTabId(targetWindowId);
  if (boundTabId > 0) {
    try {
      const existing = await chrome.tabs.get(boundTabId);
      if (cmIsWorkspaceTab(existing) && (!useWindowFilter || Number(existing.windowId || 0) === targetWindowId)) {
        workspaceTab = existing;
      }
    } catch {
      cmUnbindWorkspaceTab(boundTabId);
      workspaceTab = null;
    }
  }

  if (!workspaceTab) {
    try {
      const allTabs = await chrome.tabs.query(useWindowFilter ? { windowId: targetWindowId } : { currentWindow: true });
      workspaceTab = allTabs.find((tab) => cmIsWorkspaceTab(tab)) || null;
    } catch {
      workspaceTab = null;
    }
  }

  if (!workspaceTab) {
    workspaceTab = await chrome.tabs.create({
      url: cmGetWorkspaceUrl(),
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
      // Ignore activation failures.
    }
  }

  cmBindWorkspaceTab(workspaceTab?.windowId, workspaceTab?.id);
  return workspaceTab;
}

function cmBuildRecordId(kind, tenantId, entityId, index = 0) {
  return [String(kind || "cm"), String(tenantId || "tenant"), String(entityId || `item-${index + 1}`)]
    .map((value) => value.replace(/[^\w\-.:]+/g, "_"))
    .join(":");
}

function getCmProfileHarvestForProgrammer(programmer = null) {
  const programmerId = String(programmer?.programmerId || programmer || "").trim();
  if (!programmerId) {
    return null;
  }
  const context = {
    programmerId,
    requestorId: String(state.selectedRequestorId || "").trim(),
    mvpd: String(state.selectedMvpdId || "").trim(),
  };
  return getRestV2ProfileHarvestForContext(context) || getRestV2ProfileHarvestBucketForProgrammer(programmerId)[0] || null;
}

function getCmProfileHarvestListForProgrammer(programmer = null) {
  const programmerId = String(programmer?.programmerId || programmer || "").trim();
  if (!programmerId) {
    return [];
  }
  return getRestV2ProfileHarvestBucketForProgrammer(programmerId);
}

function normalizeCmCredentialValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (typeof value === "object") {
    if (typeof value.value === "string" || typeof value.value === "number" || typeof value.value === "boolean") {
      return String(value.value).trim();
    }
    if (typeof value.raw === "string" || typeof value.raw === "number" || typeof value.raw === "boolean") {
      return String(value.raw).trim();
    }
  }
  return "";
}

function findCmValueByCandidateKeys(source, keyCandidates = [], maxDepth = 4) {
  const targetKeys = new Set((Array.isArray(keyCandidates) ? keyCandidates : []).map((key) => String(key || "").trim().toLowerCase()).filter(Boolean));
  if (targetKeys.size === 0 || !source || typeof source !== "object") {
    return "";
  }

  const stack = [{ node: source, depth: 0 }];
  const seen = new Set();
  while (stack.length > 0) {
    const current = stack.pop();
    const node = current?.node;
    const depth = Number(current?.depth || 0);
    if (!node || typeof node !== "object" || depth > maxDepth || seen.has(node)) {
      continue;
    }
    seen.add(node);

    if (Array.isArray(node)) {
      node.forEach((item) => {
        if (item && typeof item === "object") {
          stack.push({ node: item, depth: depth + 1 });
        }
      });
      continue;
    }

    for (const [rawKey, rawValue] of Object.entries(node)) {
      const normalizedKey = String(rawKey || "").trim().toLowerCase();
      if (targetKeys.has(normalizedKey)) {
        const value = normalizeCmCredentialValue(rawValue);
        if (value) {
          return value;
        }
      }
      if (rawValue && typeof rawValue === "object") {
        stack.push({ node: rawValue, depth: depth + 1 });
      }
    }
  }

  return "";
}

function cmExtractCredentialHintsFromBundles(bundles = []) {
  const hints = [];
  const seen = new Set();

  (Array.isArray(bundles) ? bundles : []).forEach((bundle) => {
    const tenantId = String(bundle?.tenant?.tenantId || "").trim();
    const tenantName = String(bundle?.tenant?.tenantName || tenantId).trim();
    const rows = Array.isArray(bundle?.applications?.rows) ? bundle.applications.rows : [];
    rows.forEach((row) => {
      if (!row || typeof row !== "object") {
        return;
      }
      const raw = row.raw && typeof row.raw === "object" ? row.raw : row;
      const applicationId = firstNonEmptyString([
        row.entityId,
        row.consoleId,
        raw.id,
        raw.applicationId,
        raw.application_id,
        raw.appId,
        raw.app_id,
      ]);
      const applicationName = firstNonEmptyString([
        row.name,
        raw.name,
        raw.displayName,
        raw.display_name,
        applicationId,
      ]);
      const username = firstNonEmptyString([
        findCmValueByCandidateKeys(raw, ["basicauthusername", "username", "clientid", "client_id", "authuser", "auth_user"]),
        applicationId,
      ]);
      const password = firstNonEmptyString([
        findCmValueByCandidateKeys(raw, [
          "basicauthpassword",
          "password",
          "clientsecret",
          "client_secret",
          "secret",
          "authpass",
          "auth_pass",
        ]),
      ]);
      if (!username) {
        return;
      }

      const dedupeKey = `${tenantId}|${username}`.toLowerCase();
      if (seen.has(dedupeKey)) {
        return;
      }
      seen.add(dedupeKey);

      hints.push({
        tenantId,
        tenantName,
        applicationId: String(applicationId || ""),
        applicationName: String(applicationName || username),
        username: String(username || ""),
        password: String(password || ""),
      });
    });
  });

  return hints;
}

function cmBuildCredentialHintRecords(hints = [], programmer = null) {
  return (Array.isArray(hints) ? hints : [])
    .map((hint, index) => {
      const username = String(hint?.username || "").trim();
      if (!username) {
        return null;
      }
      const tenantId = String(hint?.tenantId || programmer?.programmerId || "cm").trim();
      const applicationId = String(hint?.applicationId || username).trim();
      const applicationName = String(hint?.applicationName || applicationId || username).trim();
      const hasPassword = Boolean(String(hint?.password || "").trim());
      const payload = {
        mediaCompany: String(programmer?.programmerName || programmer?.programmerId || "").trim(),
        tenantId: String(hint?.tenantId || "").trim(),
        tenantName: String(hint?.tenantName || "").trim(),
        applicationId,
        applicationName,
        basicAuthUsername: username,
        basicAuthPassword: hasPassword ? String(hint?.password || "").trim() : "(not exposed by current CM APIs)",
        passwordAvailableFromApi: hasPassword ? "Yes" : "No",
      };
      return {
        cardId: cmBuildRecordId("credential", tenantId || "cm", applicationId || username, index),
        kind: "credential",
        title: applicationName,
        subtitle: `${String(hint?.tenantName || hint?.tenantId || "tenant")} | Basic user: ${username}`,
        endpointUrl: "",
        requestUrl: "",
        payload,
        columns: cmColumnsFromPayload(payload),
        tenantId: tenantId || "cm",
        tenantName: String(hint?.tenantName || hint?.tenantId || "CM"),
      };
    })
    .filter(Boolean);
}

function cmCollectCmV2ContextDefaults(programmer = null, credentialHints = []) {
  const profileHarvestList = getCmProfileHarvestListForProgrammer(programmer);
  const profileHarvest = getCmProfileHarvestForProgrammer(programmer) || profileHarvestList[0] || null;
  const aggregatedCandidates = collectRestV2HarvestCandidateValues(profileHarvestList);
  const hints = Array.isArray(credentialHints) ? credentialHints : [];
  const primaryCredentialHint =
    hints.find((hint) => String(hint?.password || "").trim()) || hints.find((hint) => String(hint?.username || "").trim()) || null;
  const harvestIdpCandidates = dedupeRestV2CandidateStrings([
    ...(Array.isArray(profileHarvest?.idpCandidates) ? profileHarvest.idpCandidates : []),
    ...aggregatedCandidates.idpCandidates,
  ]);
  const harvestSubjectCandidates = dedupeRestV2CandidateStrings([
    ...(Array.isArray(profileHarvest?.subjectCandidates) ? profileHarvest.subjectCandidates : []),
    ...aggregatedCandidates.subjectCandidates,
  ]);
  const harvestSessionCandidates = dedupeRestV2CandidateStrings([
    ...(Array.isArray(profileHarvest?.sessionCandidates) ? profileHarvest.sessionCandidates : []),
    ...aggregatedCandidates.sessionCandidates,
  ]);
  const contextDefaults = {
    baseUrl: CM_V2_API_BASE_DEFAULT,
    idp: firstNonEmptyString([profileHarvest?.mvpd, ...harvestIdpCandidates, state.selectedMvpdId]),
    subject: firstNonEmptyString([
      profileHarvest?.subject,
      profileHarvest?.upstreamUserId,
      profileHarvest?.userId,
      ...harvestSubjectCandidates,
      state.selectedRequestorId,
    ]),
    session: firstNonEmptyString([profileHarvest?.sessionId, ...harvestSessionCandidates]),
    xTerminate: "",
    authUser: String(primaryCredentialHint?.username || "").trim(),
    authPass: String(primaryCredentialHint?.password || "").trim(),
    mediaCompany: String(programmer?.programmerName || programmer?.mediaCompanyName || "").trim(),
    programmerId: String(programmer?.programmerId || "").trim(),
    profileHarvest: profileHarvest && typeof profileHarvest === "object" ? { ...profileHarvest } : null,
    profileHarvestList: profileHarvestList.map((harvest) => ({ ...harvest })),
  };
  return contextDefaults;
}

function cmBuildCmV2OperationRecords(programmer = null, credentialHints = []) {
  const contextDefaults = cmCollectCmV2ContextDefaults(programmer, credentialHints);
  return CM_V2_OPERATION_DEFINITIONS.map((definition, index) => {
    const method = String(definition?.method || "GET").toUpperCase();
    const pathTemplate = String(definition?.pathTemplate || "").trim();
    const opKey = String(definition?.key || `operation-${index + 1}`).trim() || `operation-${index + 1}`;
    return {
      cardId: cmBuildRecordId("cmv2", contextDefaults.programmerId || "cmv2", opKey, index),
      kind: "cmv2-op",
      title: String(definition?.label || `${method} ${pathTemplate}`),
      subtitle: `${method} ${pathTemplate}`,
      endpointUrl: normalizeCmUrl(`${contextDefaults.baseUrl}${pathTemplate}`) || `${contextDefaults.baseUrl}${pathTemplate}`,
      requestUrl: normalizeCmUrl(`${contextDefaults.baseUrl}${pathTemplate}`) || `${contextDefaults.baseUrl}${pathTemplate}`,
      payload: {
        operation: {
          key: opKey,
          label: String(definition?.label || `${method} ${pathTemplate}`),
          method,
          pathTemplate,
          parameters: Array.isArray(definition?.parameters) ? definition.parameters.map((item) => ({ ...item })) : [],
          security: "basicAuth",
        },
        formDefaults: { ...contextDefaults },
        profileHarvest:
          contextDefaults.profileHarvest && typeof contextDefaults.profileHarvest === "object"
            ? { ...contextDefaults.profileHarvest }
            : null,
        profileHarvestList: Array.isArray(contextDefaults.profileHarvestList)
          ? contextDefaults.profileHarvestList.map((harvest) => ({ ...harvest }))
          : [],
      },
      columns: [],
      tenantId: contextDefaults.programmerId || "cmv2",
      tenantName: contextDefaults.mediaCompany || contextDefaults.programmerId || "CM V2",
    };
  });
}

function cmBuildRestV2CorrelationRecords(programmer = null) {
  const profileHarvestList = getCmProfileHarvestListForProgrammer(programmer);
  if (profileHarvestList.length === 0) {
    return [];
  }

  const toJsonString = (value) => {
    if (value == null || value === "") {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  return profileHarvestList.map((profileHarvest, recordIndex) => {
    const capturedAtLabel = profileHarvest.harvestedAt
      ? new Date(Number(profileHarvest.harvestedAt || 0)).toLocaleString()
      : "Unknown";
    const profileCheck =
      profileHarvest.profileCheck && typeof profileHarvest.profileCheck === "object" ? profileHarvest.profileCheck : null;
    const profileCheckStatus = profileCheck
      ? profileCheck.error
        ? `ERROR (${profileCheck.error})`
        : profileCheck.ok
          ? Number(profileCheck.profileCount || 0) > 0
            ? "SUCCESS (profiles returned)"
            : "FAIL AUTHNF (empty profiles)"
          : `ERROR (HTTP ${Number(profileCheck.status || 0)} ${String(profileCheck.statusText || "").trim()})`
      : "Unknown";
    const profileSummaries = Array.isArray(profileHarvest.profileSummaries) ? profileHarvest.profileSummaries : [];
    const summaryRows =
      profileSummaries.length > 0
        ? profileSummaries.map((summary, index) => ({
            Row: index + 1,
            RequestorId: String(profileHarvest.requestorId || "").trim(),
            ServiceProviderId: String(profileHarvest.serviceProviderId || "").trim(),
            ProfileCheckOutcome: String(profileHarvest.profileCheckOutcome || "").trim(),
            ProfileCheckStatus: profileCheckStatus,
            ProfileCheckHttpStatus: profileCheck ? Number(profileCheck.status || 0) : 0,
            ProfileCheckHttpText: profileCheck ? String(profileCheck.statusText || "").trim() : "",
            ProfileCheckError: profileCheck ? String(profileCheck.error || "").trim() : "",
            ProfileCheckResponsePreview: profileCheck ? String(profileCheck.responsePreview || "").trim() : "",
            ProfileCount: Number(profileHarvest.profileCount || profileCheck?.profileCount || 0),
            ProfileKeys: Array.isArray(profileHarvest.profileKeys) ? profileHarvest.profileKeys.join(", ") : "",
            HarvestedAt: capturedAtLabel,
            ProfileUrl: String(profileHarvest.profileUrl || "").trim(),
            ProfileKey: String(summary?.profileKey || "").trim(),
            Mvpd: String(summary?.mvpd || profileHarvest.mvpd || "").trim(),
            Subject: String(summary?.subject || profileHarvest.subject || "").trim(),
            UpstreamUserId: String(summary?.upstreamUserId || profileHarvest.upstreamUserId || "").trim(),
            UserId: String(summary?.userId || profileHarvest.userId || "").trim(),
            SessionId: String(summary?.sessionId || profileHarvest.sessionId || "").trim(),
            IdpCandidates: Array.isArray(summary?.idpCandidates) ? summary.idpCandidates.join(", ") : "",
            SubjectCandidates: Array.isArray(summary?.subjectCandidates) ? summary.subjectCandidates.join(", ") : "",
            SessionCandidates: Array.isArray(summary?.sessionCandidates) ? summary.sessionCandidates.join(", ") : "",
            NotBeforeMs: Number(summary?.notBeforeMs || 0),
            NotAfterMs: Number(summary?.notAfterMs || 0),
            ProfileAttributesJson: toJsonString(summary?.attributes),
            ProfileScalarFieldsJson: toJsonString(summary?.scalarFields),
            ProfileRawJson: toJsonString(summary?.rawProfile),
            ProfileResponsePayloadJson: toJsonString(profileHarvest.profileResponsePayload),
          }))
        : [
            {
              Row: 1,
              RequestorId: String(profileHarvest.requestorId || "").trim(),
              ServiceProviderId: String(profileHarvest.serviceProviderId || "").trim(),
              ProfileCheckOutcome: String(profileHarvest.profileCheckOutcome || "").trim(),
              ProfileCheckStatus: profileCheckStatus,
              ProfileCheckHttpStatus: profileCheck ? Number(profileCheck.status || 0) : 0,
              ProfileCheckHttpText: profileCheck ? String(profileCheck.statusText || "").trim() : "",
              ProfileCheckError: profileCheck ? String(profileCheck.error || "").trim() : "",
              ProfileCheckResponsePreview: profileCheck ? String(profileCheck.responsePreview || "").trim() : "",
              ProfileCount: Number(profileHarvest.profileCount || profileCheck?.profileCount || 0),
              ProfileKeys: Array.isArray(profileHarvest.profileKeys) ? profileHarvest.profileKeys.join(", ") : "",
              HarvestedAt: capturedAtLabel,
              ProfileUrl: String(profileHarvest.profileUrl || "").trim(),
              ProfileKey: String(profileHarvest.profileKey || "").trim(),
              Mvpd: String(profileHarvest.mvpd || "").trim(),
              Subject: String(profileHarvest.subject || "").trim(),
              UpstreamUserId: String(profileHarvest.upstreamUserId || "").trim(),
              UserId: String(profileHarvest.userId || "").trim(),
              SessionId: String(profileHarvest.sessionId || "").trim(),
              IdpCandidates: Array.isArray(profileHarvest.idpCandidates) ? profileHarvest.idpCandidates.join(", ") : "",
              SubjectCandidates: Array.isArray(profileHarvest.subjectCandidates) ? profileHarvest.subjectCandidates.join(", ") : "",
              SessionCandidates: Array.isArray(profileHarvest.sessionCandidates) ? profileHarvest.sessionCandidates.join(", ") : "",
              NotBeforeMs: Number(profileHarvest.notBeforeMs || 0),
              NotAfterMs: Number(profileHarvest.notAfterMs || 0),
              ProfileAttributesJson: toJsonString(profileHarvest.profileAttributes),
              ProfileScalarFieldsJson: toJsonString(profileHarvest.profileScalarFields),
              ProfileRawJson: toJsonString(profileHarvest.profile),
              ProfileResponsePayloadJson: toJsonString(profileHarvest.profileResponsePayload),
            },
          ];
    const payload = {
      mediaCompany: String(programmer?.programmerName || programmer?.mediaCompanyName || programmer?.programmerId || "").trim(),
      requestorId: String(profileHarvest.requestorId || "").trim(),
      serviceProviderId: String(profileHarvest.serviceProviderId || "").trim(),
      mvpd: String(profileHarvest.mvpd || "").trim(),
      profileCheckOutcome: String(profileHarvest.profileCheckOutcome || "").trim(),
      profileCheckStatus,
      profileCount: Number(profileHarvest.profileCount || profileCheck?.profileCount || 0),
      profileKeys: Array.isArray(profileHarvest.profileKeys) ? profileHarvest.profileKeys.join(", ") : "",
      selectedProfileFound: profileHarvest.selectedProfileFound === true ? "Yes" : "No",
      profileUrl: String(profileHarvest.profileUrl || "").trim(),
      items: summaryRows,
      harvestedAt: capturedAtLabel,
    };

    const correlationKey =
      buildRestV2ProfileHarvestBucketKey(profileHarvest) ||
      `${String(profileHarvest.requestorId || "requestor")}_${String(profileHarvest.mvpd || "mvpd")}_${recordIndex + 1}`;
    return {
      cardId: cmBuildRecordId(
        "correlation",
        String(profileHarvest.programmerId || programmer?.programmerId || "cm"),
        correlationKey,
        recordIndex
      ),
      kind: "correlation",
      title: "MVPD Login Profile",
      subtitle: `${payload.requestorId || "requestor"} x ${payload.mvpd || "mvpd"} | ${profileCheckStatus} | ${capturedAtLabel}`,
      endpointUrl: "",
      requestUrl: "",
      payload,
      columns: cmColumnsFromPayload(payload),
      tenantId: String(profileHarvest.programmerId || programmer?.programmerId || ""),
      tenantName: String(programmer?.programmerName || programmer?.mediaCompanyName || profileHarvest.programmerId || "CM"),
      lastModified: "",
    };
  });
}

function cmBuildWorkspaceRecordsFromBundles(bundles) {
  const output = [];
  const seen = new Set();
  const pushRecord = (record) => {
    if (!record?.cardId || seen.has(record.cardId)) {
      return;
    }
    seen.add(record.cardId);
    output.push(record);
  };

  (Array.isArray(bundles) ? bundles : []).forEach((bundle, bundleIndex) => {
    const tenant = bundle?.tenant || {};
    const tenantId = String(tenant?.tenantId || `tenant-${bundleIndex + 1}`);
    const tenantName = String(tenant?.tenantName || tenantId);
    const tenantPayload = bundle?.tenantDetail?.payload || tenant?.raw || {};
    pushRecord({
      cardId: cmBuildRecordId("tenant", tenantId, tenantId, bundleIndex),
      kind: "tenant",
      title: tenantName,
      subtitle: tenantId,
      endpointUrl: String(bundle?.tenantDetail?.url || tenant?.sourceUrl || tenant?.links?.[0] || ""),
      requestUrl: String(bundle?.tenantDetail?.url || tenant?.sourceUrl || tenant?.links?.[0] || ""),
      payload: tenantPayload,
      columns: cmColumnsFromPayload(tenantPayload),
      lastModified: String(bundle?.tenantDetail?.lastModified || ""),
      tenantId,
      tenantName,
    });

    const groups = [
      {
        kind: "applications",
        rows: Array.isArray(bundle?.applications?.rows) ? bundle.applications.rows : [],
        fallbackUrl: String(bundle?.applications?.url || ""),
        lastModified: String(bundle?.applications?.lastModified || ""),
      },
      {
        kind: "policies",
        rows: Array.isArray(bundle?.policies?.rows) ? bundle.policies.rows : [],
        fallbackUrl: String(bundle?.policies?.url || ""),
        lastModified: String(bundle?.policies?.lastModified || ""),
      },
      {
        kind: "usage",
        rows: Array.isArray(bundle?.usage?.rows) ? bundle.usage.rows : [],
        fallbackUrl: String(bundle?.usage?.url || ""),
        lastModified: String(bundle?.usage?.lastModified || ""),
      },
    ];

    groups.forEach((group) => {
      group.rows.forEach((row, rowIndex) => {
        const entityId = String(row?.entityId || row?.name || `${group.kind}-${rowIndex + 1}`);
        const isUsageRecord = group.kind === "usage";
        const payload = isUsageRecord ? null : row?.raw && typeof row.raw === "object" ? row.raw : row;
        const primaryUrl = String(row?.links?.[0] || row?.sourceUrl || group.fallbackUrl || "");
        pushRecord({
          cardId: cmBuildRecordId(group.kind, tenantId, entityId, rowIndex),
          kind: group.kind,
          title: String(row?.name || entityId),
          subtitle: `${tenantName} (${tenantId})`,
          endpointUrl: primaryUrl,
          requestUrl: primaryUrl,
          payload,
          columns: payload != null ? cmColumnsFromPayload(payload) : [],
          lastModified: group.lastModified,
          tenantId,
          tenantName,
        });
      });
    });
  });

  return output;
}

function cmFormatRecordKindLabel(kind) {
  const normalized = String(kind || "").trim().toLowerCase();
  const labels = {
    tenant: "Tenant",
    applications: "Application",
    policies: "Policy",
    usage: "Usage",
    correlation: "MVPD Login",
    credential: "Credential",
    "cmv2-op": "CM V2 API",
    "group-list": "List",
  };
  if (labels[normalized]) {
    return labels[normalized];
  }
  if (!normalized) {
    return "CM";
  }
  return normalized.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function cmBuildGroupWorkspaceRecord(groupKey, groupLabel, records, programmer = null, index = 0) {
  const programmerId = String(programmer?.programmerId || "cm").trim() || "cm";
  const programmerName = String(programmer?.programmerName || programmer?.mediaCompanyName || programmerId).trim() || programmerId;
  const normalizedGroupKey = String(groupKey || groupLabel || `group-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^\w\-.:]+/g, "_");
  const normalizedGroupLabel = String(groupLabel || normalizedGroupKey || "CM Group").trim() || "CM Group";
  const listRows = (Array.isArray(records) ? records : []).map((record) => {
    const endpoint = String(record?.requestUrl || record?.endpointUrl || "").trim();
    return {
      VIEW: "VIEW",
      Name: String(record?.title || "").trim(),
      Type: cmFormatRecordKindLabel(record?.kind),
      Tenant: String(record?.tenantName || record?.tenantId || "").trim(),
      Summary: String(record?.subtitle || "").trim(),
      Endpoint: endpoint,
      __cmViewRecordId: String(record?.cardId || "").trim(),
    };
  });
  const payload = {
    items: listRows,
  };
  return {
    cardId: cmBuildRecordId("group-list", programmerId, normalizedGroupKey, index),
    kind: "group-list",
    title: `${normalizedGroupLabel} List`,
    subtitle: `${listRows.length} item${listRows.length === 1 ? "" : "s"} | ${programmerName}`,
    endpointUrl: "",
    requestUrl: "",
    payload,
    columns: ["VIEW", "Name", "Type", "Tenant", "Summary", "Endpoint"],
    tenantId: programmerId,
    tenantName: programmerName,
    lastModified: "",
  };
}

function cmBuildGroupListHtml(groupLabel, records, groupRecordId = "") {
  const rows = Array.isArray(records) ? records : [];
  const recordId = String(groupRecordId || "").trim();
  const clickableHeaderMarkup = `
    <button type="button" class="cm-group-title cm-group-link" data-record-id="${escapeHtml(recordId)}">
      <span class="cm-group-title-text">${escapeHtml(groupLabel)}</span>
      <span class="cm-group-title-count">${rows.length}</span>
    </button>
  `;
  if (rows.length === 0) {
    return `
      <section class="cm-group">
        ${clickableHeaderMarkup}
        <p class="cm-group-empty">No ${escapeHtml(groupLabel.toLowerCase())} detected for this tenant set.</p>
      </section>
    `;
  }

  const items = rows
    .map(
      (record) => `
      <li class="cm-group-item">
        <button type="button" class="cm-record-link" data-record-id="${escapeHtml(record.cardId)}">
          <span class="cm-record-name">${escapeHtml(record.title)}</span>
          <span class="cm-record-meta">${escapeHtml(record.subtitle || "")}</span>
        </button>
      </li>
    `
    )
    .join("");

  return `
    <section class="cm-group">
      ${clickableHeaderMarkup}
      <ul class="cm-group-list">${items}</ul>
    </section>
  `;
}

function getActiveCmState() {
  const sections = document.querySelectorAll(".premium-service-section.service-cm");
  for (const section of sections) {
    const cmState = section?.__underparCmState || null;
    if (cmState?.section?.isConnected) {
      return cmState;
    }
  }
  return null;
}

function cmFindRecordByCard(cmState, card) {
  if (!cmState?.recordsById) {
    return null;
  }
  const cardId = String(card?.cardId || "").trim();
  if (cardId && cmState.recordsById.has(cardId)) {
    return cmState.recordsById.get(cardId);
  }
  const endpointUrl = String(card?.requestUrl || card?.endpointUrl || "").trim();
  if (!endpointUrl) {
    return null;
  }
  for (const record of cmState.recordsById.values()) {
    if (String(record?.requestUrl || record?.endpointUrl || "").trim() === endpointUrl) {
      return record;
    }
  }
  return null;
}

function cmGetOperationForRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const payload = record.payload && typeof record.payload === "object" ? record.payload : null;
  const operation = payload?.operation && typeof payload.operation === "object" ? payload.operation : null;
  if (!operation) {
    return null;
  }
  const parameters = Array.isArray(operation.parameters)
    ? operation.parameters
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          return {
            name: String(item.name || "").trim(),
            in: String(item.in || "path").trim().toLowerCase(),
            required: item.required === true,
            description: String(item.description || "").trim(),
          };
        })
        .filter((item) => item?.name)
    : [];
  return {
    key: String(operation.key || "").trim(),
    label: String(operation.label || "").trim(),
    method: String(operation.method || "GET").trim().toUpperCase(),
    pathTemplate: String(operation.pathTemplate || "").trim(),
    parameters,
    security: String(operation.security || "").trim(),
  };
}

function cmGetOperationDefaultFormValues(record) {
  const payload = record?.payload && typeof record.payload === "object" ? record.payload : null;
  const rawDefaults = payload?.formDefaults && typeof payload.formDefaults === "object" ? payload.formDefaults : {};
  const payloadHarvest = payload?.profileHarvest && typeof payload.profileHarvest === "object" ? payload.profileHarvest : null;
  const payloadHarvestList =
    Array.isArray(payload?.profileHarvestList) && payload.profileHarvestList.length > 0
      ? payload.profileHarvestList.filter((item) => item && typeof item === "object")
      : [];
  const programmerId = String(rawDefaults.programmerId || record?.tenantId || "").trim();
  const contextHarvest = getRestV2ProfileHarvestForContext({
    programmerId,
    requestorId: state.selectedRequestorId,
    mvpd: state.selectedMvpdId,
  });
  const profileHarvest = isUsableRestV2ProfileHarvest(contextHarvest) ? contextHarvest : null;
  const profileHarvestList = getRestV2ProfileHarvestBucketForProgrammer(programmerId);
  const mergedHarvestList = mergeRestV2ProfileHarvestLists(
    payloadHarvest ? [payloadHarvest] : [],
    payloadHarvestList,
    profileHarvest ? [profileHarvest] : [],
    profileHarvestList
  );
  const aggregatedCandidates = collectRestV2HarvestCandidateValues(mergedHarvestList);
  const payloadIdpCandidates = Array.isArray(payloadHarvest?.idpCandidates) ? payloadHarvest.idpCandidates : [];
  const profileIdpCandidates = Array.isArray(profileHarvest?.idpCandidates) ? profileHarvest.idpCandidates : [];
  const payloadSubjectCandidates = Array.isArray(payloadHarvest?.subjectCandidates) ? payloadHarvest.subjectCandidates : [];
  const profileSubjectCandidates = Array.isArray(profileHarvest?.subjectCandidates) ? profileHarvest.subjectCandidates : [];
  const payloadSessionCandidates = Array.isArray(payloadHarvest?.sessionCandidates) ? payloadHarvest.sessionCandidates : [];
  const profileSessionCandidates = Array.isArray(profileHarvest?.sessionCandidates) ? profileHarvest.sessionCandidates : [];
  return {
    baseUrl: firstNonEmptyString([rawDefaults.baseUrl, CM_V2_API_BASE_DEFAULT]) || CM_V2_API_BASE_DEFAULT,
    idp: firstNonEmptyString([
      rawDefaults.idp,
      payloadHarvest?.mvpd,
      ...payloadIdpCandidates,
      profileHarvest?.mvpd,
      ...profileIdpCandidates,
      ...aggregatedCandidates.idpCandidates,
      state.selectedMvpdId,
    ]),
    subject: firstNonEmptyString([
      rawDefaults.subject,
      payloadHarvest?.subject,
      payloadHarvest?.upstreamUserId,
      payloadHarvest?.userId,
      ...payloadSubjectCandidates,
      profileHarvest?.subject,
      profileHarvest?.upstreamUserId,
      profileHarvest?.userId,
      ...profileSubjectCandidates,
      ...aggregatedCandidates.subjectCandidates,
      state.selectedRequestorId,
    ]),
    session: firstNonEmptyString([
      rawDefaults.session,
      payloadHarvest?.sessionId,
      ...payloadSessionCandidates,
      profileHarvest?.sessionId,
      ...profileSessionCandidates,
      ...aggregatedCandidates.sessionCandidates,
    ]),
    xTerminate: String(rawDefaults.xTerminate || "").trim(),
    authUser: String(rawDefaults.authUser || "").trim(),
    authPass: String(rawDefaults.authPass || "").trim(),
  };
}

function cmNormalizeOperationFormValues(record, formValues = {}) {
  const defaults = cmGetOperationDefaultFormValues(record);
  const source = formValues && typeof formValues === "object" ? formValues : {};
  return {
    baseUrl: firstNonEmptyString([source.baseUrl, defaults.baseUrl, CM_V2_API_BASE_DEFAULT]) || CM_V2_API_BASE_DEFAULT,
    idp: String(source.idp || defaults.idp || "").trim(),
    subject: String(source.subject || defaults.subject || "").trim(),
    session: String(source.session || defaults.session || "").trim(),
    xTerminate: String(source.xTerminate || defaults.xTerminate || "").trim(),
    authUser: String(source.authUser || defaults.authUser || "").trim(),
    authPass: String(source.authPass || defaults.authPass || "").trim(),
  };
}

function cmBuildOperationRequest(record, formValues = {}) {
  const operation = cmGetOperationForRecord(record);
  if (!operation) {
    throw new Error("CM V2 operation metadata is missing.");
  }
  if (!operation.pathTemplate) {
    throw new Error("CM V2 operation path template is missing.");
  }

  const values = cmNormalizeOperationFormValues(record, formValues);
  const baseUrlRaw = String(values.baseUrl || CM_V2_API_BASE_DEFAULT).trim();
  const baseUrl = baseUrlRaw.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("CM V2 base URL is required.");
  }

  const pathParams = operation.parameters.filter((item) => item.in === "path");
  const headerParams = operation.parameters.filter((item) => item.in === "header");
  const queryParams = operation.parameters.filter((item) => item.in === "query");

  let resolvedPath = operation.pathTemplate;
  pathParams.forEach((param) => {
    const fieldName = String(param.name || "").trim();
    if (!fieldName) {
      return;
    }
    const lookupKey = fieldName.toLowerCase() === "x-terminate" ? "xTerminate" : fieldName;
    const value = String(values[lookupKey] || "").trim();
    if (!value && param.required) {
      throw new Error(`CM V2 parameter "${fieldName}" is required.`);
    }
    const placeholderPattern = new RegExp(`\\{${fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\}`, "g");
    resolvedPath = resolvedPath.replace(placeholderPattern, encodeURIComponent(value));
  });

  if (/\{[^}]+\}/.test(resolvedPath)) {
    throw new Error(`CM V2 path contains unresolved parameters: ${resolvedPath}`);
  }

  const query = new URLSearchParams();
  queryParams.forEach((param) => {
    const fieldName = String(param.name || "").trim();
    if (!fieldName) {
      return;
    }
    const value = String(values[fieldName] || "").trim();
    if (!value && param.required) {
      throw new Error(`CM V2 query parameter "${fieldName}" is required.`);
    }
    if (value) {
      query.append(fieldName, value);
    }
  });

  const headers = {
    Accept: "application/json, text/plain, */*",
  };
  headerParams.forEach((param) => {
    const fieldName = String(param.name || "").trim();
    if (!fieldName) {
      return;
    }
    const lookupKey = fieldName.toLowerCase() === "x-terminate" ? "xTerminate" : fieldName;
    const rawValue = String(values[lookupKey] || "").trim();
    if (!rawValue && param.required) {
      throw new Error(`CM V2 header "${fieldName}" is required.`);
    }
    if (!rawValue) {
      return;
    }
    if (fieldName.toLowerCase() === "x-terminate") {
      const normalized = rawValue
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",");
      if (normalized) {
        headers[fieldName] = normalized;
      }
      return;
    }
    headers[fieldName] = rawValue;
  });

  if (values.authUser || values.authPass) {
    headers.Authorization = `Basic ${base64EncodeUtf8(`${values.authUser || ""}:${values.authPass || ""}`)}`;
  }

  const queryText = query.toString();
  const url = normalizeCmUrl(`${baseUrl}${resolvedPath}${queryText ? `?${queryText}` : ""}`);
  return {
    url,
    method: operation.method || "GET",
    headers,
    operation,
    formValues: values,
  };
}

async function cmRunOperationRecordToWorkspace(cmState, record, requestToken, options = {}) {
  if (!cmState || !record) {
    return;
  }
  if (!isCmServiceRequestActive(cmState.section, requestToken, cmState.programmer?.programmerId)) {
    return;
  }

  const operation = cmGetOperationForRecord(record);
  if (!operation) {
    throw new Error("CM V2 operation metadata is missing.");
  }

  const cardId = String(options.cardId || record.cardId || generateRequestId());
  const targetWindowId =
    Number(options.targetWindowId || 0) || Number(cmState.controllerWindowId || 0) || Number(state.cmWorkspaceWindowId || 0);
  const formValues = cmNormalizeOperationFormValues(record, options.formValues || {});
  if (record.payload && typeof record.payload === "object") {
    record.payload.formDefaults = { ...formValues };
  }

  const displayPath = String(operation.pathTemplate || "").trim();
  const fallbackUrl = normalizeCmUrl(`${String(formValues.baseUrl || CM_V2_API_BASE_DEFAULT).replace(/\/+$/, "")}${displayPath}`);

  if (options.emitForm !== false) {
    void cmSendWorkspaceMessage(
      "report-form",
      {
        cardId,
        endpointUrl: fallbackUrl || displayPath,
        requestUrl: fallbackUrl || displayPath,
        zoomKey: "CMV2",
        columns: [],
        operation,
        formValues,
      },
      { targetWindowId }
    );
  }

  if (options.execute !== true) {
    return;
  }

  void cmSendWorkspaceMessage(
    "report-start",
    {
      cardId,
      endpointUrl: fallbackUrl || displayPath,
      requestUrl: fallbackUrl || displayPath,
      zoomKey: "CMV2",
      columns: [],
    },
    { targetWindowId }
  );

  try {
    const request = cmBuildOperationRequest(record, formValues);
    emitCmDebugEvent(
      {
        phase: "cm-v2-request",
        cardId,
        operationKey: String(operation.key || ""),
        operationLabel: String(operation.label || ""),
        method: request.method,
        url: request.url,
        authMode: detectCmAuthMode(request.headers),
      },
      {
        context: {
          programmerId: String(cmState?.programmer?.programmerId || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      }
    );
    const response = await fetch(request.url, {
      method: request.method,
      mode: "cors",
      credentials: "include",
      referrerPolicy: "no-referrer",
      headers: request.headers,
    });

    const text = await response.text().catch(() => "");
    emitCmDebugEvent(
      {
        phase: "cm-v2-response",
        cardId,
        operationKey: String(operation.key || ""),
        operationLabel: String(operation.label || ""),
        method: request.method,
        url: request.url,
        status: Number(response.status || 0),
        statusText: String(response.statusText || ""),
        responsePreview: truncateDebugText(text, 1600),
      },
      {
        context: {
          programmerId: String(cmState?.programmer?.programmerId || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      }
    );
    const parsed = parseJsonText(text, null);
    const normalizedPayload = parsed ?? text;
    const rows = cmRowsFromPayload(normalizedPayload);
    const summaryRows =
      rows.length > 0
        ? rows
        : [
            {
              status: Number(response.status || 0),
              statusText: String(response.statusText || ""),
              method: request.method,
              url: request.url,
              message: text ? truncateDebugText(text, 1200) : "(no body)",
            },
          ];

    if (!response.ok) {
      const errorDetails = truncateDebugText(text || response.statusText || "Request failed.", 1600);
      emitCmDebugEvent(
        {
          phase: "cm-v2-request-failed",
          cardId,
          operationKey: String(operation.key || ""),
          method: request.method,
          url: request.url,
          status: Number(response.status || 0),
          statusText: String(response.statusText || ""),
          error: errorDetails,
        },
        {
          context: {
            programmerId: String(cmState?.programmer?.programmerId || ""),
            requestorId: String(state.selectedRequestorId || ""),
            mvpd: String(state.selectedMvpdId || ""),
          },
        }
      );
      throw new Error(`CM V2 ${request.method} ${request.url} failed (${response.status}): ${errorDetails}`);
    }

    record.requestUrl = request.url;
    record.endpointUrl = request.url;
    record.lastModified = String(response.headers?.get("Last-Modified") || "");
    record.columns = cmColumnsFromPayload(normalizedPayload);

    void cmSendWorkspaceMessage(
      "report-result",
      {
        ok: true,
        cardId,
        endpointUrl: request.url,
        requestUrl: request.url,
        zoomKey: "CMV2",
        columns: record.columns,
        rows: summaryRows,
        lastModified: record.lastModified,
      },
      { targetWindowId }
    );
  } catch (error) {
    emitCmDebugEvent(
      {
        phase: "cm-v2-request-error",
        cardId,
        operationKey: String(operation.key || ""),
        operationLabel: String(operation.label || ""),
        endpointUrl: fallbackUrl || displayPath,
        error: error instanceof Error ? error.message : String(error),
      },
      {
        context: {
          programmerId: String(cmState?.programmer?.programmerId || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      }
    );
    void cmSendWorkspaceMessage(
      "report-result",
      {
        ok: false,
        cardId,
        endpointUrl: fallbackUrl || displayPath,
        requestUrl: fallbackUrl || displayPath,
        error: error instanceof Error ? error.message : String(error),
      },
      { targetWindowId }
    );
  }
}

async function cmRunRecordToWorkspace(cmState, record, requestToken, options = {}) {
  if (!cmState || !record) {
    return;
  }
  if (!isCmServiceRequestActive(cmState.section, requestToken, cmState.programmer?.programmerId)) {
    return;
  }

  if (String(record?.kind || "").toLowerCase() === "cmv2-op") {
    await cmRunOperationRecordToWorkspace(cmState, record, requestToken, {
      emitForm: options.emitForm !== false,
      execute: options.execute === true,
      formValues: options.formValues && typeof options.formValues === "object" ? options.formValues : {},
      cardId: options.cardId,
      targetWindowId: options.targetWindowId,
    });
    return;
  }

  const cardId = String(options.cardId || record.cardId || generateRequestId());
  const endpointUrl = String(record.endpointUrl || record.requestUrl || "").trim();
  const requestUrl = String(record.requestUrl || endpointUrl).trim();
  const targetWindowId =
    Number(options.targetWindowId || 0) || Number(cmState.controllerWindowId || 0) || Number(state.cmWorkspaceWindowId || 0);
  if (options.emitStart !== false) {
    void cmSendWorkspaceMessage(
      "report-start",
      {
        cardId,
        endpointUrl,
        requestUrl,
        zoomKey: String(record.kind || "").toUpperCase(),
        columns: Array.isArray(record.columns) ? record.columns : [],
      },
      { targetWindowId }
    );
  }

  let payload = record.payload;
  let lastModified = String(record.lastModified || "");
  const shouldRefetch = options.forceRefetch === true || payload == null;
  if (requestUrl && shouldRefetch) {
    try {
      const response = await fetchCmJsonWithAuthVariants([requestUrl], `CM ${record.kind || "item"} report`, {
        debugMeta: {
          scope: String(record.kind || "report"),
          cardId,
          endpointUrl: requestUrl,
          programmerId: String(cmState?.programmer?.programmerId || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      });
      payload = response.parsed;
      lastModified = response.lastModified || lastModified;
      record.payload = payload;
      record.lastModified = lastModified;
    } catch (error) {
      if (payload == null) {
        void cmSendWorkspaceMessage(
          "report-result",
          {
            ok: false,
            cardId,
            endpointUrl,
            requestUrl,
            error: error instanceof Error ? error.message : String(error),
          },
          { targetWindowId }
        );
        return;
      }
    }
  }

  const rows = cmRowsFromPayload(payload);
  const columns = cmColumnsFromPayload(payload);
  record.columns = columns;
  void cmSendWorkspaceMessage(
    "report-result",
    {
      ok: true,
      cardId,
      endpointUrl,
      requestUrl,
      zoomKey: String(record.kind || "").toUpperCase(),
      columns,
      rows,
      lastModified,
    },
    { targetWindowId }
  );
}

async function handleCmWorkspaceAction(message, sender = null) {
  const action = String(message?.action || "").trim().toLowerCase();
  const cmState = getActiveCmState();
  const senderWindowId = Number(sender?.tab?.windowId || 0);
  const senderTabId = Number(sender?.tab?.id || 0);
  const controllerWindowId = cmState ? Number(cmState.controllerWindowId || state.cmWorkspaceWindowId || 0) : 0;
  const mappedSenderTabId = senderWindowId > 0 ? Number(state.cmWorkspaceTabIdByWindowId.get(senderWindowId) || 0) : 0;

  if (senderWindowId > 0 && controllerWindowId > 0 && senderWindowId !== controllerWindowId) {
    return { ok: false, error: "CM controller is attached to a different window." };
  }
  if (senderWindowId > 0 && senderTabId > 0 && mappedSenderTabId > 0 && senderTabId !== mappedSenderTabId) {
    return { ok: false, error: "This is not the bound CM workspace tab for the window." };
  }
  if (senderWindowId > 0 && senderTabId > 0 && (!mappedSenderTabId || mappedSenderTabId <= 0)) {
    cmBindWorkspaceTab(senderWindowId, senderTabId);
  }
  if (cmState && senderWindowId > 0 && Number(cmState.controllerWindowId || 0) <= 0) {
    cmState.controllerWindowId = senderWindowId;
  }

  if (action === "workspace-ready") {
    if (cmState) {
      if (senderWindowId > 0) {
        cmBindWorkspaceTab(senderWindowId, senderTabId);
      }
      cmBroadcastControllerState(cmState, senderWindowId);
    } else {
      const selectedProgrammer = resolveSelectedProgrammer();
      const selectedServices = selectedProgrammer?.programmerId
        ? state.premiumAppsByProgrammerId.get(selectedProgrammer.programmerId) || null
        : null;
      cmBroadcastSelectedControllerState(selectedProgrammer, selectedServices, senderWindowId);
    }
    return { ok: true, controllerOnline: Boolean(cmState) };
  }

  if (!cmState) {
    return { ok: false, error: "Open Concurrency Monitoring in the UnderPAR side panel to run reports." };
  }

  const requestToken = Number(state.premiumPanelRequestToken || 0);
  if (!isCmServiceRequestActive(cmState.section, requestToken, cmState.programmer?.programmerId)) {
    return { ok: false, error: "CM controller is no longer active for the selected media company." };
  }

  if (action === "open-workspace") {
    const targetWindowId = senderWindowId || Number(cmState.controllerWindowId || 0);
    await cmEnsureWorkspaceTab({ activate: true, windowId: targetWindowId });
    cmBroadcastControllerState(cmState, targetWindowId);
    return { ok: true };
  }

  if (action === "run-card") {
    const card = message?.card && typeof message.card === "object" ? message.card : {};
    const shouldForceRefetch = message?.forceRefetch !== false;
    const matchedRecord = cmFindRecordByCard(cmState, card);
    if (!matchedRecord) {
      const fallbackUrl = String(card?.requestUrl || card?.endpointUrl || "").trim();
      if (!fallbackUrl) {
        return { ok: false, error: "CM card request URL is missing." };
      }
      await cmRunRecordToWorkspace(
        cmState,
        {
          cardId: String(card.cardId || generateRequestId()),
          kind: "cm",
          title: "CM item",
          subtitle: "",
          endpointUrl: fallbackUrl,
          requestUrl: fallbackUrl,
          payload: null,
          columns: Array.isArray(card?.columns) ? card.columns : [],
          lastModified: "",
        },
        requestToken,
        {
          emitStart: true,
          forceRefetch: shouldForceRefetch,
          cardId: String(card.cardId || generateRequestId()),
          targetWindowId: senderWindowId || Number(cmState.controllerWindowId || 0),
        }
      );
      return { ok: true };
    }

    await cmRunRecordToWorkspace(cmState, matchedRecord, requestToken, {
      emitStart: true,
      forceRefetch: shouldForceRefetch,
      cardId: String(card?.cardId || matchedRecord.cardId || generateRequestId()),
      targetWindowId: senderWindowId || Number(cmState.controllerWindowId || 0),
    });
    return { ok: true };
  }

  if (action === "run-api-operation") {
    const card = message?.card && typeof message.card === "object" ? message.card : {};
    const formValues = message?.formValues && typeof message.formValues === "object" ? message.formValues : {};
    let matchedRecord = cmFindRecordByCard(cmState, card);
    if ((!matchedRecord || String(matchedRecord?.kind || "").toLowerCase() !== "cmv2-op") && card?.operation) {
      matchedRecord = {
        cardId: String(card?.cardId || generateRequestId()),
        kind: "cmv2-op",
        title: String(card?.operation?.label || "CM V2 Operation"),
        subtitle: `${String(card?.operation?.method || "GET").toUpperCase()} ${String(card?.operation?.pathTemplate || "").trim()}`,
        endpointUrl: String(card?.endpointUrl || ""),
        requestUrl: String(card?.requestUrl || card?.endpointUrl || ""),
        payload: {
          operation: card.operation,
          formDefaults: { ...formValues },
        },
        columns: Array.isArray(card?.columns) ? card.columns.map((value) => String(value || "")).filter(Boolean) : [],
      };
    }
    if (!matchedRecord || String(matchedRecord?.kind || "").toLowerCase() !== "cmv2-op") {
      return { ok: false, error: "CM V2 API operation record could not be resolved." };
    }
    await cmRunRecordToWorkspace(cmState, matchedRecord, requestToken, {
      emitForm: false,
      execute: true,
      formValues,
      cardId: String(card?.cardId || matchedRecord.cardId || generateRequestId()),
      targetWindowId: senderWindowId || Number(cmState.controllerWindowId || 0),
    });
    return { ok: true };
  }

  if (action === "download-csv") {
    const card = message?.card && typeof message.card === "object" ? message.card : {};
    const sortRule = decompNormalizeSortRule(message?.sortRule);
    const matchedRecord = cmFindRecordByCard(cmState, card);
    const fallbackUrl = String(card?.requestUrl || card?.endpointUrl || "").trim();
    const fallbackRecord = {
      cardId: String(card?.cardId || generateRequestId()),
      kind: "cm",
      title: "CM item",
      subtitle: "",
      endpointUrl: fallbackUrl,
      requestUrl: fallbackUrl,
      payload: null,
      columns: Array.isArray(card?.columns) ? card.columns.map((value) => String(value || "")).filter(Boolean) : [],
      lastModified: "",
      tenantId: String(cmState?.programmer?.programmerId || "cm"),
      tenantName: String(cmState?.programmer?.programmerName || cmState?.programmer?.programmerId || "CM"),
    };
    const record = matchedRecord || fallbackRecord;
    if (!matchedRecord && !fallbackUrl && (!Array.isArray(card?.rows) || card.rows.length === 0)) {
      return { ok: false, error: "CM card request URL is missing." };
    }

    const csvResult = await cmDownloadCsvForCard(cmState, record, card, sortRule, requestToken);
    if (!csvResult?.ok) {
      return { ok: false, error: csvResult?.error || "Unable to download CM CSV." };
    }
    return { ok: true, fileName: csvResult.fileName || "" };
  }

  if (action === "rerun-all") {
    const cards = Array.isArray(message?.cards) ? message.cards : [];
    const targetWindowId = senderWindowId || Number(cmState.controllerWindowId || 0);
    void cmSendWorkspaceMessage(
      "batch-start",
      {
        total: cards.length,
        startedAt: Date.now(),
      },
      { targetWindowId }
    );
    for (const card of cards) {
      const record = cmFindRecordByCard(cmState, card);
      if (!record) {
        continue;
      }
      if (String(record?.kind || "").toLowerCase() === "cmv2-op") {
        await cmRunRecordToWorkspace(cmState, record, requestToken, {
          emitForm: false,
          execute: true,
          formValues: card?.formValues && typeof card.formValues === "object" ? card.formValues : {},
          cardId: String(card?.cardId || record.cardId || generateRequestId()),
          targetWindowId,
        });
        continue;
      }
      await cmRunRecordToWorkspace(cmState, record, requestToken, {
        emitStart: true,
        forceRefetch: true,
        cardId: String(card?.cardId || record.cardId || generateRequestId()),
        targetWindowId,
      });
    }
    void cmSendWorkspaceMessage(
      "batch-end",
      {
        total: cards.length,
        completedAt: Date.now(),
      },
      { targetWindowId }
    );
    return { ok: true };
  }

  return { ok: false, error: `Unsupported CM workspace action: ${action}` };
}

function ensureCmRuntimeListener() {
  if (state.cmRuntimeListenerBound) {
    return;
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!CM_MESSAGE_TYPES.has(String(message?.type || "")) || message?.channel !== "workspace-action") {
      return false;
    }
    void handleCmWorkspaceAction(message, sender)
      .then((result) => {
        sendResponse(result && typeof result === "object" ? result : { ok: true });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });
    return true;
  });
  state.cmRuntimeListenerBound = true;
}

function ensureCmWorkspaceTabWatcher() {
  if (state.cmWorkspaceTabWatcherBound) {
    return;
  }
  chrome.tabs.onRemoved.addListener((tabId) => {
    cmUnbindWorkspaceTab(tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const normalizedTabId = Number(tabId || 0);
    if (!normalizedTabId || !changeInfo?.url) {
      return;
    }
    if (cmIsWorkspaceTab(tab)) {
      cmBindWorkspaceTab(tab?.windowId, normalizedTabId);
      return;
    }
    const boundTabId = Number(state.cmWorkspaceTabId || 0);
    let isMappedTab = false;
    for (const mappedTabId of state.cmWorkspaceTabIdByWindowId.values()) {
      if (Number(mappedTabId || 0) === normalizedTabId) {
        isMappedTab = true;
        break;
      }
    }
    if (isMappedTab || normalizedTabId === boundTabId) {
      cmUnbindWorkspaceTab(normalizedTabId);
    }
  });
  state.cmWorkspaceTabWatcherBound = true;
}

async function cmOpenRecordInWorkspace(cmState, record, requestToken, options = {}) {
  if (!cmState || !record) {
    return;
  }
  const workspaceTab = await cmEnsureWorkspaceTab({
    activate: options.activate !== false,
    windowId: Number(cmState.controllerWindowId || 0) || undefined,
  });
  cmBindWorkspaceTab(workspaceTab?.windowId, workspaceTab?.id);
  const targetWindowId = Number(workspaceTab?.windowId || cmState.controllerWindowId || 0);
  cmBroadcastControllerState(cmState, targetWindowId);
  await cmRunRecordToWorkspace(cmState, record, requestToken, {
    emitStart: options.emitStart !== false,
    forceRefetch: options.forceRefetch === true,
    cardId: String(options.cardId || record.cardId || generateRequestId()),
    targetWindowId,
  });
}

async function loadCmService(programmer, cmService, section, contentElement, refreshButton, requestToken) {
  if (!contentElement) {
    return;
  }
  if (!programmer?.programmerId) {
    contentElement.innerHTML = '<div class="service-error">Missing media company details.</div>';
    return;
  }
  const matchedTenants = Array.isArray(cmService?.matchedTenants) ? cmService.matchedTenants : [];
  if (matchedTenants.length === 0) {
    const loadError = String(cmService?.loadError || "").trim();
    const message = loadError
      ? `CM tenant discovery failed: ${escapeHtml(loadError)}`
      : "No CM tenant matches were detected for this media company.";
    contentElement.innerHTML = `<div class="service-error">${message}</div>`;
    return;
  }

  if (refreshButton) {
    refreshButton.disabled = true;
  }
  contentElement.innerHTML = '<div class="loading">Loading Concurrency Monitoring...</div>';

  try {
    const controllerWindowId = await decompGetCurrentWindowId();
    const profileHarvest = getCmProfileHarvestForProgrammer(programmer);
    const bundles = await Promise.all(matchedTenants.map((tenant) => loadCmTenantBundle(tenant, { profileHarvest })));
    if (!isCmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }

    const bundleRecords = cmBuildWorkspaceRecordsFromBundles(bundles);
    const correlationRecords = cmBuildRestV2CorrelationRecords(programmer);
    const credentialHints = cmExtractCredentialHintsFromBundles(bundles);
    const credentialRecords = cmBuildCredentialHintRecords(credentialHints, programmer);
    const apiOperationRecords = cmBuildCmV2OperationRecords(programmer, credentialHints);
    const records = [...correlationRecords, ...bundleRecords, ...credentialRecords, ...apiOperationRecords];
    const correlationCardRecords = records.filter((record) => record.kind === "correlation");
    const tenantRecords = records.filter((record) => record.kind === "tenant");
    const applicationRecords = records.filter((record) => record.kind === "applications");
    const credentialHintRecords = records.filter((record) => record.kind === "credential");
    const policyRecords = records.filter((record) => record.kind === "policies");
    const usageRecords = records.filter((record) => record.kind === "usage");
    const operationRecords = records.filter((record) => record.kind === "cmv2-op");
    const groupDefinitions = [
      {
        key: "correlation",
        label: "MVPD Login History",
        records: correlationCardRecords,
      },
      {
        key: "tenants",
        label: "CM Tenants",
        records: tenantRecords,
      },
      {
        key: "applications",
        label: "CM Applications",
        records: applicationRecords,
      },
      {
        key: "credentials",
        label: "CM Credential Hints",
        records: credentialHintRecords,
      },
      {
        key: "policies",
        label: "CM Policies",
        records: policyRecords,
      },
      {
        key: "usage",
        label: "CM Usage (CMU)",
        records: usageRecords,
      },
      {
        key: "control-api",
        label: "CM V2 Control API",
        records: operationRecords,
      },
    ];
    // Keep tenant groups in internal records for fast CM mapping/debug workflows,
    // but hide the broad CM tenant list from sidepanel UI.
    const hiddenCmGroupKeys = new Set(["tenants"]);
    const groupRecordsByKey = new Map();
    groupDefinitions.forEach((group, index) => {
      const groupRecord = cmBuildGroupWorkspaceRecord(group.key, group.label, group.records, programmer, index);
      records.push(groupRecord);
      groupRecordsByKey.set(group.key, groupRecord);
    });
    const recordsById = new Map(records.map((record) => [record.cardId, record]));
    const sourceLabel = String(cmService?.sourceUrl || "").trim() || "CM API discovery";
    const groupMarkup = groupDefinitions
      .filter((group) => !hiddenCmGroupKeys.has(group.key))
      .map((group) => {
        const groupRecord = groupRecordsByKey.get(group.key);
        return cmBuildGroupListHtml(group.label, group.records, groupRecord?.cardId || "");
      })
      .join("");

    contentElement.innerHTML = `
      <div class="cm-shell">
        <div class="cm-toolbar">
          <p class="cm-summary">
            Matched ${matchedTenants.length} tenant${matchedTenants.length === 1 ? "" : "s"} from ${escapeHtml(sourceLabel)}.
          </p>
          <button type="button" class="cm-open-workspace-btn">Open CM Workspace</button>
        </div>
        <div class="cm-sidepanel">${groupMarkup}</div>
      </div>
    `;

    const cmState = {
      serviceType: "cm",
      section,
      programmer,
      cmService,
      contentElement,
      requestToken,
      bundles,
      recordsById,
      controllerWindowId,
    };
    section.__underparCmState = cmState;

    const openWorkspaceButton = contentElement.querySelector(".cm-open-workspace-btn");
    if (openWorkspaceButton) {
      openWorkspaceButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        const targetWindowId = Number(cmState.controllerWindowId || 0);
        const workspaceTab = await cmEnsureWorkspaceTab({
          activate: true,
          windowId: targetWindowId || undefined,
        });
        cmBindWorkspaceTab(workspaceTab?.windowId, workspaceTab?.id);
        cmBroadcastControllerState(cmState, Number(workspaceTab?.windowId || targetWindowId || 0));
      });
    }

    contentElement.querySelectorAll(".cm-record-link").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        const recordId = String(button.getAttribute("data-record-id") || "").trim();
        if (!recordId) {
          return;
        }
        const record = cmState.recordsById.get(recordId);
        if (!record) {
          return;
        }
        await cmOpenRecordInWorkspace(cmState, record, requestToken, {
          activate: true,
          emitStart: true,
          forceRefetch: false,
          cardId: record.cardId,
        });
      });
    });

    contentElement.querySelectorAll(".cm-group-link").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        const recordId = String(button.getAttribute("data-record-id") || "").trim();
        if (!recordId) {
          return;
        }
        const groupRecord = cmState.recordsById.get(recordId);
        if (!groupRecord) {
          return;
        }
        await cmOpenRecordInWorkspace(cmState, groupRecord, requestToken, {
          activate: true,
          emitStart: true,
          forceRefetch: false,
          cardId: groupRecord.cardId,
        });
      });
    });

    ensureCmRuntimeListener();
    ensureCmWorkspaceTabWatcher();
    cmBroadcastControllerState(cmState);
  } catch (error) {
    if (!isCmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      return;
    }
    contentElement.innerHTML = `<div class="service-error">${escapeHtml(
      error instanceof Error ? error.message : String(error)
    )}</div>`;
  } finally {
    if (refreshButton && isCmServiceRequestActive(section, requestToken, programmer.programmerId)) {
      refreshButton.disabled = false;
    }
  }
}

function buildPremiumServiceSummaryHtml(programmer, serviceKey, appInfo) {
  if (serviceKey === "cm") {
    const matchedTenants = Array.isArray(appInfo?.matchedTenants) ? appInfo.matchedTenants : [];
    const tenantLabel = matchedTenants.length === 1 ? "tenant" : "tenants";
    const sampleNames = matchedTenants.slice(0, 4).map((item) => item?.tenantName || item?.tenantId).filter(Boolean);
    const sourceUrl = String(appInfo?.sourceUrl || "").trim();
    const profileHarvestList = getCmProfileHarvestListForProgrammer(programmer);
    const profileHarvest = getCmProfileHarvestForProgrammer(programmer) || profileHarvestList[0] || null;
    const correlationPairLabel =
      profileHarvestList.length > 0 && (profileHarvest?.subject || profileHarvest?.mvpd)
        ? `${profileHarvestList.length} captured | latest: ${
            String(profileHarvest.requestorId || "").trim() || "requestor"
          } x ${String(profileHarvest.mvpd || "").trim() || "mvpd"}`
        : "No captured MVPD logins yet";
    const profileCheckOutcome = String(profileHarvest?.profileCheckOutcome || "").trim();
    const profileCount = Number(profileHarvest?.profileCount || 0);
    const profileCheckLabel = profileCheckOutcome
      ? `${profileCheckOutcome}${Number.isFinite(profileCount) ? ` (profiles=${profileCount})` : ""}`
      : "Not captured";
    const summaryItems = [
      buildMetadataItemHtml("CM Tenant Matches", `${matchedTenants.length} ${tenantLabel}`),
      buildMetadataItemHtml("Matched Tenant Names", sampleNames.length > 0 ? sampleNames.join(", ") : "N/A"),
      buildMetadataItemHtml("CM Tenant Source", sourceUrl || "Not detected"),
      buildMetadataItemHtml("MVPD Login History", correlationPairLabel),
      buildMetadataItemHtml("Latest MVPD Profile Check", profileCheckLabel),
    ];
    return summaryItems.join("");
  }

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
  const servicesForProgrammer =
    programmer?.programmerId && state.premiumAppsByProgrammerId.has(programmer.programmerId)
      ? state.premiumAppsByProgrammerId.get(programmer.programmerId)
      : null;
  const resolvedRegisteredApp =
    String(appInfo?.appName || appInfo?.guid || "").trim() ||
    String(
      servicesForProgrammer?.esm?.appName ||
        servicesForProgrammer?.esm?.guid ||
        servicesForProgrammer?.degradation?.appName ||
        servicesForProgrammer?.degradation?.guid ||
        servicesForProgrammer?.restV2?.appName ||
        servicesForProgrammer?.restV2?.guid ||
        ""
    ).trim() ||
    "Registered application";
  const serviceHoverMessage = `Premium Service ${title} using registered application '${resolvedRegisteredApp}'.`;
  const serviceClassByKey = {
    cm: "service-cm",
    degradation: "service-degradation",
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
        <section class="rest-v2-profile-history-tool" hidden>
          <div class="rest-v2-tool-head">
            <p class="rest-v2-tool-title">MVPD Login Profiles</p>
            <span class="rest-v2-tool-count rest-v2-profile-count">0</span>
          </div>
          <ul class="rest-v2-profile-list"></ul>
        </section>
        <section class="rest-v2-entitlement-tool" hidden>
          <div class="rest-v2-tool-head">
            <p class="rest-v2-tool-title">Can I watch?</p>
          </div>
          <p class="rest-v2-entitlement-context"></p>
          <form class="rest-v2-entitlement-form">
            <input
              type="text"
              class="rest-v2-resource-input"
              placeholder="NBALPP, RESOURCE_ID_2"
              aria-label="Resource IDs for preauthorization"
              value="${escapeHtml(REST_V2_DEFAULT_RESOURCE_ID_INPUT)}"
            />
            <button type="submit" class="rest-v2-entitlement-go-btn">GO</button>
          </form>
          <p class="rest-v2-entitlement-status"></p>
          <div class="rest-v2-entitlement-summary" hidden></div>
        </section>
        `
      : "";
  const serviceBodyHtml =
    serviceKey === "decompTree"
      ? '<div class="loading">Loading decomp...</div>'
      : serviceKey === "cm"
        ? '<div class="loading">Loading Concurrency Monitoring...</div>'
        : buildPremiumServiceSummaryHtml(programmer, serviceKey, appInfo);
  const showManualRefresh = serviceKey !== "decompTree";
  const serviceActionsHtml = showManualRefresh
    ? `
      <div class="service-actions">
        <button type="button" class="service-refresh-btn">Refresh ${escapeHtml(title)}</button>
      </div>
    `
    : "";
  const sectionLabel = title;
  section.innerHTML = `
    <button type="button" class="metadata-header service-box-header" title="${escapeHtml(serviceHoverMessage)}" aria-label="${escapeHtml(
      serviceHoverMessage
    )}">
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
  section.classList.toggle("service-open", !initialCollapsed);
  wireCollapsibleSection(toggleButton, container, initialCollapsed, (collapsed) => {
    setPremiumSectionCollapsed(programmer?.programmerId, serviceKey, collapsed);
    section.classList.toggle("service-open", !collapsed);
    if (!collapsed && serviceKey === "decompTree" && typeof section.__underparRefreshDecomp === "function") {
      void section.__underparRefreshDecomp();
    }
    if (!collapsed && serviceKey === "cm" && typeof section.__underparRefreshCm === "function") {
      void section.__underparRefreshCm();
    }
  });

  if (serviceKey === "decompTree") {
    section.__underparRefreshDecomp = () => {
      const requestToken = state.premiumPanelRequestToken;
      return loadDecompService(programmer, appInfo, section, contentElement, refreshButton, requestToken);
    };
    void section.__underparRefreshDecomp();
  } else if (serviceKey === "cm") {
    section.__underparRefreshCm = () => {
      const requestToken = state.premiumPanelRequestToken;
      return loadCmService(programmer, appInfo, section, contentElement, refreshButton, requestToken);
    };
    if (refreshButton) {
      refreshButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        const selected = resolveSelectedProgrammer();
        if (!selected || !programmer || selected.programmerId !== programmer.programmerId) {
          return;
        }
        refreshButton.disabled = true;
        setStatus(`Refreshing ${title} premium service...`, "info");
        try {
          await refreshProgrammerPanels({ forcePremiumRefresh: true });
          setStatus(`${title} premium service refreshed.`, "success");
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          setStatus(`Unable to refresh ${title}: ${reason}`, "error");
        } finally {
          refreshButton.disabled = false;
        }
      });
    }
    void section.__underparRefreshCm();
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
        await refreshProgrammerPanels({ forcePremiumRefresh: true });
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

    wireRestV2ProfileAndEntitlementHandlers(section, programmer, appInfo);
    syncRestV2LoginPanel(section, programmer, appInfo);
  }

  return section;
}

function renderPremiumServicesLoading(programmer) {
  if (!els.premiumServicesContainer) {
    return;
  }
  clearPremiumServiceAutoRefreshTimers();
  decompBroadcastSelectedControllerState(programmer, null);
  cmBroadcastSelectedControllerState(programmer, null);

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
  decompBroadcastSelectedControllerState(resolveSelectedProgrammer(), null);
  cmBroadcastSelectedControllerState(resolveSelectedProgrammer(), null);
  const reason = error instanceof Error ? error.message : String(error);
  els.premiumServicesContainer.innerHTML = `<p class="metadata-empty service-error">${escapeHtml(reason)}</p>`;
}

function shouldShowCmService(cmService) {
  if (!cmService || typeof cmService !== "object") {
    return false;
  }

  const matchedTenants = Array.isArray(cmService.matchedTenants) ? cmService.matchedTenants : [];
  return matchedTenants.length > 0;
}

function renderPremiumServices(services, programmer = null) {
  if (!els.premiumServicesContainer) {
    return;
  }
  clearPremiumServiceAutoRefreshTimers();

  if (!services) {
    decompBroadcastSelectedControllerState(programmer, null);
    cmBroadcastSelectedControllerState(programmer, null);
    els.premiumServicesContainer.innerHTML =
      '<p class="metadata-empty">No premium scoped applications loaded yet.</p>';
    return;
  }
  decompBroadcastSelectedControllerState(programmer, services);
  cmBroadcastSelectedControllerState(programmer, services);

  const availableKeys = PREMIUM_SERVICE_DISPLAY_ORDER.filter((serviceKey) => {
    if (serviceKey === "decompTree") {
      return Boolean(services?.esm);
    }
    if (serviceKey === "cm") {
      return shouldShowCmService(services?.cm);
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
    const appInfo = serviceKey === "decompTree" ? services.esm : services[serviceKey];
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
  state.cmServiceByProgrammerId.clear();
  state.cmServiceLoadPromiseByProgrammerId.clear();
  state.cmTenantsCatalog = null;
  state.cmTenantsCatalogPromise = null;
  state.cmAuthBootstrapPromise = null;
  state.cmAuthBootstrapLastAttemptAt = 0;
  state.cmTenantBundleByTenantKey.clear();
  state.cmTenantBundlePromiseByTenantKey.clear();
  state.cmWorkspaceTabId = 0;
  state.cmWorkspaceWindowId = 0;
  state.cmWorkspaceTabIdByWindowId.clear();
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
    esmAvailable: null,
    programmerId: "",
    programmerName: "",
    requestorIds: [],
    mvpdIds: [],
    profileHarvest: null,
    profileHarvestList: [],
    updatedAt: Date.now(),
  });
  void cmSendWorkspaceMessage("controller-state", {
    controllerOnline: false,
    cmAvailable: null,
    programmerId: "",
    programmerName: "",
    requestorIds: [],
    mvpdIds: [],
    profileHarvest: null,
    profileHarvestList: [],
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
    value.includes("auth.services.adobe.com") ||
    value.includes("experience.adobe.com") ||
    value.includes("console.auth.adobe.com") ||
    value.includes("login.aepdebugger.adobe.com") ||
    value.includes("pps.services.adobe.com")
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

function isAuthAvatarCaptureCandidate(url) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized) {
    return false;
  }
  return (
    isPpsProfileImageUrl(normalized) ||
    isImsAvatarDownloadUrl(normalized) ||
    /\/ims\/avatar\//i.test(normalized) ||
    /\/api\/profile\/[^/]+\/image(\/|$)/i.test(normalized)
  );
}

function scoreAuthAvatarCaptureCandidate(url, response = {}) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  if (isPpsProfileImageUrl(normalized)) {
    score += 1200;
  } else if (isImsAvatarDownloadUrl(normalized)) {
    score += 760;
  } else if (/\/ims\/avatar\//i.test(normalized)) {
    score += 620;
  } else if (/\/avatar/i.test(normalized)) {
    score += 280;
  }

  const mimeType = String(response?.mimeType || "").toLowerCase();
  const resourceType = String(response?.type || "").toLowerCase();
  const status = Number(response?.status || 0);
  if (mimeType.startsWith("image/")) {
    score += 180;
  }
  if (resourceType === "image") {
    score += 90;
  }
  if (status >= 200 && status < 300) {
    score += 50;
  }
  if (normalized.includes("/100")) {
    score += 18;
  }
  if (/avatar|profile|picture|photo|image/i.test(normalized)) {
    score += 14;
  }

  return score;
}

function applyCapturedAvatarToProfile(profilePayload, avatarCandidate) {
  const normalizedAvatar = normalizeAvatarCandidate(avatarCandidate) || normalizeInlineAvatarData(avatarCandidate);
  if (!normalizedAvatar) {
    return profilePayload && typeof profilePayload === "object" ? profilePayload : null;
  }

  const baseProfile = profilePayload && typeof profilePayload === "object" ? { ...profilePayload } : {};
  const additionalInfo =
    baseProfile.additional_info && typeof baseProfile.additional_info === "object"
      ? { ...baseProfile.additional_info }
      : {};

  const existingBest = getBestNonSyntheticProfileAvatarCandidate(baseProfile) || extractProfileImageUrl(baseProfile);
  const identity = getProfileIdentityValue(baseProfile);
  const existingIsSyntheticIdentity = existingBest ? isImsAvatarForIdentity(existingBest, identity) : false;
  const shouldPreferCaptured = !existingBest || existingIsSyntheticIdentity || isPpsProfileImageUrl(normalizedAvatar);

  if (shouldPreferCaptured) {
    baseProfile.user_image_url = normalizedAvatar;
    baseProfile.userImageUrl = normalizedAvatar;
    baseProfile.avatarUrl = normalizedAvatar;
    baseProfile.avatar = normalizedAvatar;
    baseProfile.avatar_url = normalizedAvatar;
  } else {
    if (!baseProfile.user_image_url) {
      baseProfile.user_image_url = normalizedAvatar;
    }
    if (!baseProfile.userImageUrl) {
      baseProfile.userImageUrl = normalizedAvatar;
    }
    if (!baseProfile.avatarUrl && !baseProfile.avatar && !baseProfile.avatar_url) {
      baseProfile.avatarUrl = normalizedAvatar;
    }
  }

  if (!additionalInfo.user_image_url || shouldPreferCaptured) {
    additionalInfo.user_image_url = normalizedAvatar;
  }
  if (!additionalInfo.userImageUrl || shouldPreferCaptured) {
    additionalInfo.userImageUrl = normalizedAvatar;
  }
  if ((!additionalInfo.avatar && !additionalInfo.avatarUrl && !additionalInfo.avatar_url) || shouldPreferCaptured) {
    additionalInfo.avatarUrl = normalizedAvatar;
  }

  baseProfile.additional_info = additionalInfo;
  return normalizeProfileAvatarFields(baseProfile);
}

async function attachAuthDebugger(tabId, options = {}) {
  if (!chrome.debugger || !tabId) {
    return null;
  }

  const target = { tabId };
  const captureProfileAvatar = options?.captureProfileAvatar === true;
  let capturedAvatarCandidate = "";
  let capturedAvatarScore = Number.NEGATIVE_INFINITY;
  const responseByRequestId = new Map();

  const setCapturedAvatarCandidate = (candidate, response = {}) => {
    if (!captureProfileAvatar) {
      return;
    }

    const normalized = normalizeAvatarCandidate(candidate) || normalizeInlineAvatarData(candidate);
    if (!normalized || !isAuthAvatarCaptureCandidate(normalized)) {
      return;
    }

    const score = scoreAuthAvatarCaptureCandidate(normalized, response);
    if (score > capturedAvatarScore) {
      capturedAvatarScore = score;
      capturedAvatarCandidate = normalized;
      log("Auth debugger captured avatar candidate", {
        score,
        status: response?.status,
        url: summarizeUrl(normalized),
      });
    }
  };

  const onEvent = (source, method, params) => {
    if (source.tabId !== tabId) {
      return;
    }

    if (
      method !== "Network.requestWillBeSent" &&
      method !== "Network.responseReceived" &&
      method !== "Network.loadingFinished" &&
      method !== "Network.loadingFailed" &&
      method !== "Page.frameNavigated"
    ) {
      return;
    }

    if (captureProfileAvatar && method === "Network.requestWillBeSent") {
      const requestId = String(params?.requestId || "");
      const requestUrl = params?.request?.url || "";
      if (requestId && requestUrl) {
        responseByRequestId.set(requestId, {
          url: requestUrl,
          status: 0,
          mimeType: "",
          type: "",
        });
        setCapturedAvatarCandidate(requestUrl, {
          status: 0,
          mimeType: "",
          type: String(params?.type || ""),
        });
      }
    }

    if (captureProfileAvatar && method === "Network.responseReceived") {
      const requestId = String(params?.requestId || "");
      const responseUrl = params?.response?.url || "";
      const metadata = {
        status: Number(params?.response?.status || 0),
        mimeType: String(params?.response?.mimeType || ""),
        type: String(params?.type || ""),
      };

      if (requestId && responseUrl) {
        responseByRequestId.set(requestId, {
          url: responseUrl,
          ...metadata,
        });
      }

      setCapturedAvatarCandidate(responseUrl, metadata);
    }

    if (captureProfileAvatar && method === "Network.loadingFinished") {
      const requestId = String(params?.requestId || "");
      const responseMeta = requestId ? responseByRequestId.get(requestId) : null;
      if (responseMeta?.url) {
        setCapturedAvatarCandidate(responseMeta.url, responseMeta);
      }
      if (requestId) {
        responseByRequestId.delete(requestId);
      }
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
    getCapturedAvatarCandidate() {
      return normalizeAvatarCandidate(capturedAvatarCandidate) || normalizeInlineAvatarData(capturedAvatarCandidate);
    },
    async detach() {
      chrome.debugger.onEvent.removeListener(onEvent);
      chrome.debugger.onDetach.removeListener(onDetach);
      responseByRequestId.clear();
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

function decodeBase64UrlText(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }

  let padded = normalized.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = padded.length % 4;
  if (remainder) {
    padded += "=".repeat(4 - remainder);
  }

  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    try {
      return atob(padded);
    } catch {
      return "";
    }
  }
}

function parseJwtPayload(accessToken = "") {
  const token = String(accessToken || "").trim();
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const decodedPayload = decodeBase64UrlText(parts[1]);
  const parsedPayload = parseJsonText(decodedPayload, null);
  return parsedPayload && typeof parsedPayload === "object" ? parsedPayload : null;
}

function parseImsStatePayload(rawState = "") {
  const normalized = String(rawState || "").trim();
  if (!normalized || !normalized.startsWith("{")) {
    return null;
  }
  const parsed = parseJsonText(normalized, null);
  return parsed && typeof parsed === "object" ? parsed : null;
}

function mergeImsSessionSnapshots(baseSession, incomingSession) {
  const base = baseSession && typeof baseSession === "object" ? baseSession : {};
  const incoming = incomingSession && typeof incomingSession === "object" ? incomingSession : {};
  const merged = pruneEmptyObject({
    tokenId: firstNonEmptyString([incoming.tokenId, incoming.id, base.tokenId, base.id]),
    sessionId: firstNonEmptyString([incoming.sessionId, incoming.sid, base.sessionId, base.sid]),
    sessionUrl: firstNonEmptyString([incoming.sessionUrl, incoming.session, base.sessionUrl, base.session]),
    userId: firstNonEmptyString([incoming.userId, incoming.user_id, base.userId, base.user_id]),
    authId: firstNonEmptyString([incoming.authId, incoming.aa_id, base.authId, base.aa_id]),
    clientId: firstNonEmptyString([incoming.clientId, incoming.client_id, base.clientId, base.client_id]),
    tokenType: firstNonEmptyString([incoming.tokenType, incoming.type, base.tokenType, base.type]),
    scope: firstNonEmptyString([incoming.scope, base.scope]),
    as: firstNonEmptyString([incoming.as, base.as]),
    fg: firstNonEmptyString([incoming.fg, base.fg]),
    moi: firstNonEmptyString([incoming.moi, base.moi]),
    pba: firstNonEmptyString([incoming.pba, base.pba]),
    keyAlias: firstNonEmptyString([incoming.keyAlias, incoming.key_alias, base.keyAlias, base.key_alias]),
    stateNonce: firstNonEmptyString([incoming.stateNonce, incoming.nonce, base.stateNonce, base.nonce]),
    stateJslibVersion: firstNonEmptyString([
      incoming.stateJslibVersion,
      incoming.jslibver,
      base.stateJslibVersion,
      base.jslibver,
    ]),
    createdAt: Number(incoming.createdAt || incoming.created_at || base.createdAt || base.created_at || 0),
    issuedAt: Number(incoming.issuedAt || incoming.issued_at || base.issuedAt || base.issued_at || 0),
    expiresAt: Number(incoming.expiresAt || incoming.expires_at || base.expiresAt || base.expires_at || 0),
  });

  return Object.keys(merged).length > 0 ? merged : null;
}

function deriveImsSessionSnapshotFromToken(accessToken = "") {
  const claims = parseJwtPayload(accessToken);
  if (!claims) {
    return null;
  }

  const statePayload = parseImsStatePayload(firstNonEmptyString([claims.state]));
  const expSeconds = Number(claims.exp || 0);
  const iatSeconds = Number(claims.iat || 0);
  const createdAtRaw = Number(claims.created_at || 0);
  const createdAtMs =
    createdAtRaw > 0 && createdAtRaw < 1000000000000 ? createdAtRaw * 1000 : createdAtRaw > 0 ? createdAtRaw : 0;

  return mergeImsSessionSnapshots(null, {
    tokenId: claims.id,
    sessionId: claims.sid,
    sessionUrl: firstNonEmptyString([claims.session, statePayload?.session]),
    userId: firstNonEmptyString([claims.user_id, claims.userId]),
    authId: firstNonEmptyString([claims.aa_id, claims.authId]),
    clientId: firstNonEmptyString([claims.client_id, claims.clientId]),
    tokenType: firstNonEmptyString([claims.type]),
    scope: firstNonEmptyString([claims.scope]),
    as: claims.as,
    fg: claims.fg,
    moi: claims.moi,
    pba: claims.pba,
    keyAlias: firstNonEmptyString([claims.key_alias, claims.keyAlias]),
    stateNonce: statePayload?.nonce,
    stateJslibVersion: firstNonEmptyString([statePayload?.jslibver, statePayload?.jslibVersion]),
    createdAt: createdAtMs,
    issuedAt: Number.isFinite(iatSeconds) && iatSeconds > 0 ? iatSeconds * 1000 : 0,
    expiresAt: Number.isFinite(expSeconds) && expSeconds > 0 ? expSeconds * 1000 : 0,
  });
}

function coercePositiveNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function resolveAuthResponseExpiry(accessToken, expiresInValue) {
  const tokenSnapshot = deriveImsSessionSnapshotFromToken(accessToken);
  const tokenExpiresAt = coercePositiveNumber(tokenSnapshot?.expiresAt);
  const expiresIn = coercePositiveNumber(expiresInValue);
  const now = Date.now();

  if (!expiresIn) {
    return {
      expiresAt: tokenExpiresAt,
      tokenSnapshot,
    };
  }

  const expiresAtFromSeconds = now + expiresIn * 1000;
  const expiresAtFromMilliseconds = now + expiresIn;
  if (tokenExpiresAt > 0) {
    const candidates = [tokenExpiresAt, expiresAtFromSeconds];
    if (expiresIn >= 1000) {
      candidates.push(expiresAtFromMilliseconds);
    }

    let bestCandidate = tokenExpiresAt;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      if (!Number.isFinite(candidate) || candidate <= 0) {
        continue;
      }
      const delta = Math.abs(candidate - tokenExpiresAt);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestCandidate = candidate;
      }
    }

    return {
      expiresAt: bestCandidate,
      tokenSnapshot,
    };
  }

  const appearsToBeMilliseconds = expiresIn >= 100000 && expiresIn <= 24 * 60 * 60 * 1000;
  return {
    expiresAt: appearsToBeMilliseconds ? expiresAtFromMilliseconds : expiresAtFromSeconds,
    tokenSnapshot,
  };
}

async function fetchValidateTokenSessionSnapshot(accessToken = "") {
  const token = String(accessToken || "").trim();
  if (!token) {
    return null;
  }

  const endpoint = `${IMS_BASE_URL}/ims/validate_token/v1?jslVersion=underpar`;
  const clientIds = [...new Set(IMS_VALIDATE_CLIENT_IDS.map((value) => String(value || "").trim()).filter(Boolean))];

  for (const clientId of clientIds) {
    const body = new URLSearchParams({
      type: "access_token",
      client_id: clientId,
      token,
    });
    const attempts = [
      { credentials: "omit" },
      { credentials: "include" },
    ];

    for (const attempt of attempts) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          mode: "cors",
          credentials: attempt.credentials,
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: body.toString(),
        });
        if (!response.ok) {
          continue;
        }

        const parsed = parseJsonText(await response.text().catch(() => ""), null);
        if (!parsed || typeof parsed !== "object") {
          continue;
        }

        const tokenPayload = parsed?.token && typeof parsed.token === "object" ? parsed.token : {};
        const statePayload = parseImsStatePayload(firstNonEmptyString([tokenPayload?.state]));
        const createdAtRaw = Number(tokenPayload?.created_at || 0);
        const createdAtMs =
          createdAtRaw > 0 && createdAtRaw < 1000000000000 ? createdAtRaw * 1000 : createdAtRaw > 0 ? createdAtRaw : 0;

        const snapshot = mergeImsSessionSnapshots(null, {
          tokenId: tokenPayload?.id,
          sessionId: tokenPayload?.sid,
          sessionUrl: firstNonEmptyString([statePayload?.session]),
          userId: firstNonEmptyString([tokenPayload?.user_id]),
          authId: firstNonEmptyString([tokenPayload?.aa_id]),
          clientId: firstNonEmptyString([tokenPayload?.client_id, clientId]),
          tokenType: firstNonEmptyString([tokenPayload?.type]),
          scope: firstNonEmptyString([tokenPayload?.scope]),
          as: tokenPayload?.as,
          fg: tokenPayload?.fg,
          moi: tokenPayload?.moi,
          pba: tokenPayload?.pba,
          keyAlias: firstNonEmptyString([tokenPayload?.key_alias]),
          stateNonce: statePayload?.nonce,
          stateJslibVersion: firstNonEmptyString([statePayload?.jslibver, statePayload?.jslibVersion]),
          createdAt: createdAtMs,
          expiresAt: Number(parsed?.expires_at || 0),
        });
        if (snapshot) {
          return snapshot;
        }
      } catch {
        // Continue best-effort across client/credential variants.
      }
    }
  }

  return null;
}

function parseAuthResponse(responseUrl, requestState) {
  const authParams = extractAuthParams(responseUrl);

  const authError = authParams.get("error");
  if (authError) {
    const description = authParams.get("error_description");
    throw new Error(redactSensitiveTokenValues(description ? `${authError}: ${description}` : authError));
  }

  const returnedState = authParams.get("state");
  if (returnedState && returnedState !== requestState) {
    throw new Error("State validation failed.");
  }

  const accessToken = authParams.get("access_token");
  if (!accessToken) {
    throw new Error("No access token returned from IMS.");
  }

  const expiry = resolveAuthResponseExpiry(accessToken, authParams.get("expires_in"));
  const expiresAt = coercePositiveNumber(expiry.expiresAt);
  const tokenType = String(authParams.get("token_type") || "bearer").trim();
  const scope = String(authParams.get("scope") || "").trim();
  const idToken = String(authParams.get("id_token") || "").trim();
  const refreshToken = String(authParams.get("refresh_token") || "").trim();
  const statePayload = parseImsStatePayload(String(authParams.get("state") || ""));

  const callbackSession = mergeImsSessionSnapshots(null, {
    tokenId: authParams.get("id"),
    sessionId: authParams.get("sid"),
    sessionUrl: firstNonEmptyString([authParams.get("session"), statePayload?.session]),
    userId: firstNonEmptyString([authParams.get("user_id"), authParams.get("userId")]),
    authId: firstNonEmptyString([authParams.get("aa_id"), authParams.get("authId"), authParams.get("auth_id")]),
    clientId: authParams.get("client_id"),
    tokenType,
    scope,
    as: authParams.get("as"),
    fg: authParams.get("fg"),
    moi: authParams.get("moi"),
    pba: authParams.get("pba"),
    keyAlias: authParams.get("key_alias"),
    stateNonce: statePayload?.nonce,
    stateJslibVersion: firstNonEmptyString([statePayload?.jslibver, statePayload?.jslibVersion]),
    expiresAt,
  });

  const imsSession = mergeImsSessionSnapshots(expiry.tokenSnapshot, callbackSession);
  if (imsSession && (!Number.isFinite(Number(imsSession.expiresAt)) || Number(imsSession.expiresAt) <= 0)) {
    imsSession.expiresAt = expiresAt;
  }

  return {
    accessToken,
    expiresAt,
    tokenType: tokenType || "bearer",
    scope,
    idToken,
    refreshToken,
    imsSession,
  };
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
    let debuggerSession = null;
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

      let capturedAvatarCandidate = "";
      if (debuggerSession?.getCapturedAvatarCandidate) {
        try {
          capturedAvatarCandidate = debuggerSession.getCapturedAvatarCandidate() || "";
        } catch {
          capturedAvatarCandidate = "";
        }
      }

      if (debuggerSession) {
        try {
          await debuggerSession.detach();
        } catch {
          // Ignore debugger detach failures.
        }
        debuggerSession = null;
      }

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
      const capturedAvatarUrl = normalizeAvatarCandidate(
        firstNonEmptyString([payload?.capturedAvatarUrl, payload?.imageUrl, capturedAvatarCandidate])
      );
      const helperImsSession = mergeImsSessionSnapshots(
        deriveImsSessionSnapshotFromToken(accessToken),
        payload?.imsSession && typeof payload.imsSession === "object" ? payload.imsSession : null
      );
      const helperProfile = payload?.profile && typeof payload.profile === "object" ? payload.profile : null;
      const mergedProfile = applyCapturedAvatarToProfile(helperProfile, capturedAvatarUrl);
      const resolvedImageUrl =
        normalizeAvatarCandidate(
          firstNonEmptyString([
            payload?.imageUrl,
            capturedAvatarUrl,
            resolveLoginImageUrl({
              profile: mergedProfile,
              imageUrl: capturedAvatarUrl,
            }),
          ])
        ) || "";

      resolve({
        accessToken,
        expiresAt: Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt : Date.now() + 60 * 60 * 1000,
        tokenType: compactStorageString(firstNonEmptyString([payload?.tokenType]), 60) || "bearer",
        scope: compactStorageString(firstNonEmptyString([payload?.scope]), 2048),
        idToken: compactStorageString(firstNonEmptyString([payload?.idToken]), 4096),
        refreshToken: compactStorageString(firstNonEmptyString([payload?.refreshToken]), 4096),
        imsSession: helperImsSession,
        profile: mergedProfile,
        imageUrl: resolvedImageUrl,
        capturedAvatarUrl,
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
        return;
      }

      debuggerSession = await attachAuthDebugger(helperTabId, { captureProfileAvatar: true });
    } catch (error) {
      await finalize(null, error instanceof Error ? error : new Error(String(error)));
    }
  });
}

async function runAuthInPopupWindow(authUrl, redirectUri, options = {}) {
  return new Promise(async (resolve, reject) => {
    let completed = false;
    let authWindowId = null;
    let authTabId = null;
    let debuggerSession = null;
    let timeoutId = null;
    let pollId = null;
    const successUrlMatcher = typeof options.successUrlMatcher === "function" ? options.successUrlMatcher : null;

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
      const capturedAvatarUrl = debuggerSession?.getCapturedAvatarCandidate
        ? normalizeAvatarCandidate(debuggerSession.getCapturedAvatarCandidate())
        : "";
      cleanup();
      void closeAuthWindow();

      if (error) {
        reject(error);
      } else {
        resolve({
          responseUrl: String(result || ""),
          capturedAvatarUrl,
        });
      }
    };

    const maybeResolveFromUrl = (url) => {
      if (!url) {
        return;
      }
      if (redirectUri && url.startsWith(redirectUri)) {
        finish(url, null);
        return;
      }
      if (successUrlMatcher && successUrlMatcher(url)) {
        finish(url, null);
      }
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

      debuggerSession = await attachAuthDebugger(authTabId, { captureProfileAvatar: true });

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
  const authWindowResult = await runAuthInPopupWindow(authUrl, IMS_LEGACY_REDIRECT_URI);
  const responseUrl = String(authWindowResult?.responseUrl || "");
  const parsed = parseAuthResponse(responseUrl, requestState);
  const capturedAvatarUrl = normalizeAvatarCandidate(authWindowResult?.capturedAvatarUrl || "");
  return capturedAvatarUrl
    ? {
        ...parsed,
        capturedAvatarUrl,
      }
    : parsed;
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
  const capturedAvatarUrl = normalizeAvatarCandidate(
    firstNonEmptyString([authData?.capturedAvatarUrl, authData?.imageUrl])
  );
  const hasInlineProfile = Boolean(authData && Object.prototype.hasOwnProperty.call(authData, "profile"));
  if (hasInlineProfile) {
    if (authData?.profile && typeof authData.profile === "object") {
      return applyCapturedAvatarToProfile(normalizeProfileAvatarFields(authData.profile), capturedAvatarUrl);
    }
    return applyCapturedAvatarToProfile({}, capturedAvatarUrl) || {};
  }

  const fetchedProfile = await fetchProfile(authData?.accessToken || "");
  return applyCapturedAvatarToProfile(fetchedProfile, capturedAvatarUrl) || fetchedProfile;
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
  const imsBase = IMS_BASE_URL;
  const endpoints = [
    `${IMS_PROFILE_URL}?client_id=AdobePass1`,
    `${IMS_PROFILE_URL}?client_id=exc_app`,
    `${IMS_PROFILE_URL}?client_id=${encodeURIComponent(IMS_CLIENT_ID)}`,
    IMS_PROFILE_URL,
    `${imsBase}/ims/userinfo/v2`,
    `${imsBase}/ims/check/v6/status?client_id=exc_app`,
    `${imsBase}/ims/check/v6/status?client_id=AdobePass1`,
    `${imsBase}/ims/check/v6/status?client_id=${encodeURIComponent(IMS_CLIENT_ID)}`,
    `${imsBase}/ims/check/v5/status?client_id=exc_app&locale=en_US`,
    `${imsBase}/ims/check/v5/status?client_id=AdobePass1&locale=en_US`,
    `${imsBase}/ims/check/status?client_id=exc_app`,
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

  if (/^\/?api\/profile\/[^/]+\/image(\/|$)/i.test(trimmed)) {
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${PPS_PROFILE_BASE_URL}${normalizedPath}`;
  }

  if (/^ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}/${trimmed}`;
  }

  if (/^avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}/ims/${trimmed}`;
  }

  if (/^\/ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${IMS_BASE_URL}${trimmed}`;
  }

  if (!trimmed.includes("://")) {
    if (isLikelyUrlWithoutScheme(trimmed)) {
      return `https://${trimmed}`;
    }

    if (isLikelyImsAvatarId(trimmed)) {
      return `${IMS_BASE_URL}/ims/avatar/download/${encodeURIComponent(trimmed)}`;
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

  const imsBase = IMS_BASE_URL;
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

  const persistedAvatar = readPersistedAvatarCandidate(loginData);
  if (persistedAvatar) {
    candidates.push(persistedAvatar);
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

  const persistedCandidate = readPersistedAvatarCandidate(loginData);
  const persisted = normalizeAvatarCandidate(persistedCandidate) || normalizeInlineAvatarData(persistedCandidate);
  if (persisted && persisted.startsWith("data:image/")) {
    return persisted;
  }

  const provisional = normalizeAvatarCandidate(resolveLoginImageUrl(loginData));
  if (provisional) {
    return provisional;
  }

  if (persisted) {
    return persisted;
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

function getAvatarPersistIdentityCandidates(loginData, options = {}) {
  const includeTokenFingerprint = options.includeTokenFingerprint !== false;
  const profile = resolveLoginProfile(loginData) || {};
  const tokenFingerprint = loginData?.accessToken ? String(loginData.accessToken).slice(-24) : "";
  const candidates = [
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    profile?.id,
    profile?.email,
    profile?.user_email,
    profile?.additional_info?.email,
    loginData?.adobePassOrg?.userId,
  ];
  if (includeTokenFingerprint && tokenFingerprint) {
    candidates.push(`token:${tokenFingerprint}`);
  }

  return [...new Set(candidates.map((value) => String(value || "").trim()).filter(Boolean))].slice(0, 12);
}

function hasAvatarPersistProfileIdentity(loginData) {
  const profile = resolveLoginProfile(loginData) || {};
  const identity = firstNonEmptyString([
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    profile?.id,
    profile?.email,
    profile?.user_email,
    profile?.additional_info?.email,
    loginData?.adobePassOrg?.userId,
  ]);
  return Boolean(identity);
}

function getAvatarPersistStorageKeys(loginData, options = {}) {
  const identities = getAvatarPersistIdentityCandidates(loginData, options);
  const keys = [];
  for (const identity of identities) {
    const encodedIdentity = encodeURIComponent(identity);
    keys.push(`${AVATAR_PERSIST_STORAGE_PREFIX}${encodedIdentity}`);
    keys.push(`${LEGACY_AVATAR_PERSIST_STORAGE_PREFIX}${encodedIdentity}`);
  }
  return [...new Set(keys)];
}

function normalizeAvatarPersistIdentityValues(values) {
  const source = Array.isArray(values) ? values : [values];
  const normalized = source
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(normalized)].slice(0, 24);
}

function avatarPersistIdentitiesOverlap(leftValues, rightValues) {
  const left = normalizeAvatarPersistIdentityValues(leftValues);
  const right = new Set(normalizeAvatarPersistIdentityValues(rightValues));
  if (left.length === 0 || right.size === 0) {
    return false;
  }
  return left.some((value) => right.has(value));
}

function getAvatarPersistKeyScopeWeight(key, identityKeySet) {
  if (identityKeySet.has(key)) {
    if (key.startsWith(AVATAR_PERSIST_STORAGE_PREFIX)) {
      return 2400;
    }
    if (key.startsWith(LEGACY_AVATAR_PERSIST_STORAGE_PREFIX)) {
      return 2200;
    }
    return 2000;
  }

  if (key === AVATAR_PERSIST_GLOBAL_KEY) {
    return 1200;
  }
  if (key === LEGACY_AVATAR_PERSIST_GLOBAL_KEY) {
    return 1000;
  }
  return 0;
}

function readPersistedAvatarCandidate(loginData) {
  const hasProfileIdentity = hasAvatarPersistProfileIdentity(loginData);
  const identityKeys = getAvatarPersistStorageKeys(loginData, {
    includeTokenFingerprint: !hasProfileIdentity,
  });
  const identityKeySet = new Set(identityKeys);
  const activeIdentityHints = normalizeAvatarPersistIdentityValues(
    getAvatarPersistIdentityCandidates(loginData, { includeTokenFingerprint: false })
  );
  const keys = [...new Set([...identityKeys, AVATAR_PERSIST_GLOBAL_KEY, LEGACY_AVATAR_PERSIST_GLOBAL_KEY])];
  if (keys.length === 0) {
    return "";
  }

  let bestCandidate = "";
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestUpdatedAt = 0;

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        localStorage.removeItem(key);
        continue;
      }

      if (key === AVATAR_PERSIST_GLOBAL_KEY || key === LEGACY_AVATAR_PERSIST_GLOBAL_KEY) {
        const recordIdentityHints = normalizeAvatarPersistIdentityValues(parsed.identities || parsed.identityHints || []);
        if (
          activeIdentityHints.length > 0 &&
          recordIdentityHints.length > 0 &&
          !avatarPersistIdentitiesOverlap(activeIdentityHints, recordIdentityHints)
        ) {
          continue;
        }
      }

      const expiresAt = Number(parsed.expiresAt || 0);
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        localStorage.removeItem(key);
        continue;
      }

      const candidate = normalizeInlineAvatarData(parsed.dataUrl || "") || normalizeAvatarCandidate(parsed.url || "");
      if (!candidate) {
        localStorage.removeItem(key);
        continue;
      }

      const avatarScore = scoreAvatarCandidatePriority(candidate);
      const scopeScore = getAvatarPersistKeyScopeWeight(key, identityKeySet);
      const totalScore = avatarScore + scopeScore;
      const updatedAt = Number(parsed.updatedAt || 0);
      const normalizedUpdatedAt = Number.isFinite(updatedAt) ? Math.max(0, updatedAt) : 0;

      if (totalScore > bestScore || (totalScore === bestScore && normalizedUpdatedAt > bestUpdatedAt)) {
        bestScore = totalScore;
        bestUpdatedAt = normalizedUpdatedAt;
        bestCandidate = candidate;
      }
    } catch {
      // Ignore malformed local avatar persistence entries.
    }
  }

  return bestCandidate;
}

function writePersistedAvatarCandidate(loginData, payload) {
  const keys = [
    ...getAvatarPersistStorageKeys(loginData).filter((key) => key.startsWith(AVATAR_PERSIST_STORAGE_PREFIX)),
    AVATAR_PERSIST_GLOBAL_KEY,
  ];
  if (keys.length === 0) {
    return;
  }

  const normalizedResolved = normalizeInlineAvatarData(payload?.resolvedUrl || "") || normalizeAvatarCandidate(payload?.resolvedUrl || "");
  const normalizedDataUrl = normalizeInlineAvatarData(payload?.dataUrl || payload?.resolvedUrl || "");
  const normalizedSource = normalizeAvatarCandidate(payload?.sourceUrl || "");
  const preferredCandidate = normalizedDataUrl || normalizedResolved || normalizedSource;
  if (!preferredCandidate || scoreAvatarCandidatePriority(preferredCandidate) <= -150) {
    return;
  }

  const persistDataUrl =
    normalizedDataUrl && normalizedDataUrl.length <= AVATAR_MAX_LOCALSTORAGE_DATAURL_BYTES ? normalizedDataUrl : "";
  const persistUrl = normalizeAvatarCandidate(
    firstNonEmptyString([
      normalizedSource,
      normalizedResolved.startsWith("https://") ? normalizedResolved : "",
    ])
  );

  if (!persistDataUrl && !persistUrl) {
    return;
  }

  const ttlSeconds = Number(payload?.ttlSeconds || AVATAR_PERSIST_TTL_SECONDS);
  const expiresAt = Date.now() + Math.max(1, ttlSeconds) * 1000;
  const identityHints = normalizeAvatarPersistIdentityValues(
    getAvatarPersistIdentityCandidates(loginData, { includeTokenFingerprint: false })
  );
  const record = JSON.stringify({
    expiresAt,
    url: persistUrl,
    dataUrl: persistDataUrl,
    identities: identityHints,
    updatedAt: Date.now(),
  });

  try {
    for (const key of keys) {
      localStorage.setItem(key, record);
    }
  } catch {
    // Ignore localStorage quota failures.
  }
}

function resetAvatarStateForInteractiveLogin() {
  purgeAvatarCaches();
  clearResolvedAvatar();
}

function resolveAuthAvatarSeed(authData, profile = null) {
  const profileSeed = profile ? resolveLoginImageUrl({ profile }) : "";
  return normalizeAvatarCandidate(
    firstNonEmptyString([authData?.capturedAvatarUrl, authData?.imageUrl, profileSeed])
  ) || "";
}

function buildSessionKeySnapshot(loginData = {}) {
  const profile = resolveLoginProfile(loginData) || {};
  const imsSession = loginData?.imsSession && typeof loginData.imsSession === "object" ? loginData.imsSession : {};
  return pruneEmptyObject({
    userId: compactStorageString(
      firstNonEmptyString([
        imsSession?.userId,
        profile?.userId,
        profile?.user_id,
        profile?.sub,
        profile?.id,
        loginData?.adobePassOrg?.userId,
      ]),
      220
    ),
    authId: compactStorageString(
      firstNonEmptyString([imsSession?.authId, profile?.authId, profile?.aa_id, profile?.adobeID]),
      220
    ),
    sessionId: compactStorageString(firstNonEmptyString([imsSession?.sessionId]), 220),
    tokenId: compactStorageString(firstNonEmptyString([imsSession?.tokenId]), 220),
    orgId: compactStorageString(firstNonEmptyString([loginData?.adobePassOrg?.orgId]), 220),
    accessTokenFingerprint: compactStorageString(loginData?.accessToken ? String(loginData.accessToken).slice(-24) : "", 64),
  });
}

function buildLoginSessionPayloadFromAuth(authData, profile = null, imageUrl = "") {
  const normalizedProfile = profile && typeof profile === "object" ? profile : null;
  const resolvedImageUrl =
    normalizeAvatarCandidate(
      firstNonEmptyString([imageUrl, resolveAuthAvatarSeed(authData, normalizedProfile || undefined)])
    ) || "";
  const imsSession = mergeImsSessionSnapshots(
    deriveImsSessionSnapshotFromToken(authData?.accessToken || ""),
    authData?.imsSession && typeof authData.imsSession === "object" ? authData.imsSession : null
  );
  return {
    accessToken: firstNonEmptyString([authData?.accessToken]),
    expiresAt: Number(authData?.expiresAt || 0),
    tokenType: compactStorageString(firstNonEmptyString([authData?.tokenType]), 60) || "bearer",
    scope: compactStorageString(firstNonEmptyString([authData?.scope]), 2048),
    idToken: compactStorageString(firstNonEmptyString([authData?.idToken]), 4096),
    refreshToken: compactStorageString(firstNonEmptyString([authData?.refreshToken]), 4096),
    imsSession,
    profile: normalizedProfile,
    imageUrl: resolvedImageUrl,
    sessionKeys: buildSessionKeySnapshot({
      accessToken: authData?.accessToken || "",
      profile: normalizedProfile,
      imsSession,
    }),
  };
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
  state.avatarDataUrlPrefetchKeys.clear();
  try {
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (
        typeof key === "string" &&
        (
          key.startsWith(AVATAR_CACHE_STORAGE_PREFIX) ||
          key.startsWith(LEGACY_AVATAR_CACHE_STORAGE_PREFIX) ||
          key.startsWith(AVATAR_PERSIST_STORAGE_PREFIX) ||
          key.startsWith(LEGACY_AVATAR_PERSIST_STORAGE_PREFIX)
        )
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
  const persistedAvatar = compactAvatarValue(readPersistedAvatarCandidate(loginData));
  const orgAvatar = compactAvatarValue(loginData?.adobePassOrg?.avatarUrl || "");
  const explicitLoginImageUrl = compactAvatarValue(resolveLoginImageUrl(loginData));
  const loginProfile = resolveLoginProfile(loginData) || {};
  const profileCandidates = getProfileAvatarCandidates(loginProfile).map((value) => compactAvatarValue(value));
  const discoveredProfileCandidates = collectAvatarCandidatesFromProfileShape(loginProfile).map((value) =>
    compactAvatarValue(value)
  );
  return JSON.stringify({
    tokenFingerprint,
    persistedAvatar,
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

async function fetchAvatarDataUrlViaBackground(url, accessToken = "") {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return "";
  }

  const token = firstNonEmptyString([accessToken, state.loginData?.accessToken]);
  const response = await sendRuntimeMessageSafe({
    type: "underpar:fetchAvatarDataUrl",
    url,
    accessToken: token,
  });

  if (response?.ok && typeof response.dataUrl === "string" && response.dataUrl.startsWith("data:image/")) {
    return response.dataUrl;
  }

  return "";
}

function buildAvatarDataUrlPrefetchKey(loginData, url) {
  const sourceUrl = normalizeAvatarCandidate(url);
  if (!sourceUrl) {
    return "";
  }
  const tokenFingerprint = loginData?.accessToken ? String(loginData.accessToken).slice(-24) : "cookie";
  const userFingerprint = getAvatarCacheIdentity(loginData);
  return `${userFingerprint}:${tokenFingerprint}:${sourceUrl}`;
}

function scheduleAvatarDataUrlPrefetch(loginData, url, cacheKey = "") {
  const sourceUrl = normalizeAvatarCandidate(url);
  if (!sourceUrl || sourceUrl.startsWith("data:image/") || sourceUrl.startsWith("blob:")) {
    return;
  }

  const prefetchKey = buildAvatarDataUrlPrefetchKey(loginData, sourceUrl);
  if (!prefetchKey || state.avatarDataUrlPrefetchKeys.has(prefetchKey)) {
    return;
  }
  state.avatarDataUrlPrefetchKeys.add(prefetchKey);

  void (async () => {
    const token = firstNonEmptyString([loginData?.accessToken, state.loginData?.accessToken]);
    const dataUrl = await fetchAvatarDataUrlViaBackground(sourceUrl, token);
    if (!dataUrl || !state.loginData) {
      return;
    }

    writePersistedAvatarCandidate(state.loginData, {
      sourceUrl,
      resolvedUrl: dataUrl,
      dataUrl,
      ttlSeconds: AVATAR_PERSIST_TTL_SECONDS,
    });
    if (cacheKey) {
      writeAvatarCache(cacheKey, {
        sourceUrl,
        resolvedUrl: dataUrl,
        dataUrl,
        ttlSeconds: AVATAR_CACHE_TTL_SECONDS,
      });
    }

    const currentResolved = normalizeAvatarCandidate(state.avatarResolvedUrl);
    if (!currentResolved || currentResolved === sourceUrl) {
      setResolvedAvatarUrl(dataUrl, false);
      render();
    }
  })();
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
    const persistResolvedAvatar = (payload) => {
      if (!state.loginData) {
        return;
      }
      writePersistedAvatarCandidate(state.loginData, payload || {});
    };

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
            persistResolvedAvatar({
              sourceUrl: normalized,
              resolvedUrl: normalized,
              dataUrl: normalized,
            });
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
            persistResolvedAvatar({
              sourceUrl: cached.sourceUrl || normalized,
              resolvedUrl: cachedResolved,
              dataUrl: cachedResolved.startsWith("data:image/") ? cachedResolved : "",
            });
            scheduleAvatarDataUrlPrefetch(state.loginData, cached.sourceUrl || normalized, cacheKey);
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
            persistResolvedAvatar({
              sourceUrl: normalized,
              resolvedUrl: backgroundFirstDataUrl,
              dataUrl: backgroundFirstDataUrl,
            });
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
          persistResolvedAvatar({
            sourceUrl: normalized,
            resolvedUrl: normalized,
          });
          writeAvatarCache(cacheKey, {
            sourceUrl: normalized,
            resolvedUrl: normalized,
            ttlSeconds: AVATAR_CACHE_TTL_SECONDS,
          });
          scheduleAvatarDataUrlPrefetch(state.loginData, normalized, cacheKey);
          render();
          return true;
        }

        const blobResult = await fetchAvatarBlobUrl(normalized);
        if (blobResult?.objectUrl) {
          setResolvedAvatarUrl(blobResult.objectUrl, true);
          persistResolvedAvatar({
            sourceUrl: normalized,
            resolvedUrl: blobResult.objectUrl,
            dataUrl: blobResult.dataUrl || "",
          });
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

async function signOutAndResetSession() {
  if (state.busy) {
    return;
  }

  closeAvatarMenu();
  setBusy(true, "Signing out of UnderPAR...");
  setStatus("", "info");
  state.sessionMonitorSuppressed = true;

  try {
    await clearIdentityTokens();
    await Promise.all([clearDebugFlowStorageFromChromeStorage(), clearLoginHelperResultStorage()]);
    purgeAvatarCaches();
    purgeDcrCaches();
    await resetToSignedOutState();
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
      if (interactive) {
        resetAvatarStateForInteractiveLogin();
      }

      const profile = await resolveProfileAfterLogin(authData);
      const imageUrl = resolveAuthAvatarSeed(authData, profile);
      return buildLoginSessionPayloadFromAuth(authData, profile, imageUrl);
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
  const profileSeedData = {
    ...loginData,
    profile: normalizedProfile,
  };
  const normalizedImageUrl =
    normalizeAvatarCandidate(resolveLoginImageUrl(profileSeedData)) ||
    normalizeAvatarCandidate(readPersistedAvatarCandidate(profileSeedData)) ||
    "";
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
    buildLoginSessionPayloadFromAuth(switched, switched.profile, switched.imageUrl),
    "interactive-auto-switch-recovery",
    { allowDeniedRecovery: false }
  );
}

function resolveStoredSessionExpiresAt(loginData, tokenSession) {
  const storedExpiresAt = coercePositiveNumber(loginData?.expiresAt);
  const tokenExpiresAt = coercePositiveNumber(tokenSession?.expiresAt);
  if (!tokenExpiresAt) {
    return storedExpiresAt;
  }
  if (!storedExpiresAt) {
    return tokenExpiresAt;
  }

  if (Math.abs(storedExpiresAt - tokenExpiresAt) > 2 * 60 * 1000) {
    return tokenExpiresAt;
  }

  return Math.min(storedExpiresAt, tokenExpiresAt);
}

async function loadStoredLoginData() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const loginData = stored?.[STORAGE_KEY] || null;

  if (!loginData) {
    return null;
  }

  const accessToken = firstNonEmptyString([loginData?.accessToken]);
  if (!accessToken) {
    await chrome.storage.local.remove(STORAGE_KEY);
    return null;
  }

  const normalizedProfile = resolveLoginProfile(loginData);
  const tokenSnapshot = deriveImsSessionSnapshotFromToken(accessToken);
  const expiresAt = resolveStoredSessionExpiresAt(loginData, tokenSnapshot);
  if (!expiresAt || expiresAt <= Date.now()) {
    await chrome.storage.local.remove(STORAGE_KEY);
    return null;
  }

  const imsSession = mergeImsSessionSnapshots(
    tokenSnapshot,
    loginData?.imsSession && typeof loginData.imsSession === "object" ? loginData.imsSession : null
  );
  if (imsSession && (!coercePositiveNumber(imsSession.expiresAt) || Math.abs(coercePositiveNumber(imsSession.expiresAt) - expiresAt) > 2 * 60 * 1000)) {
    imsSession.expiresAt = expiresAt;
  }
  return {
    ...loginData,
    accessToken,
    expiresAt,
    tokenType: compactStorageString(firstNonEmptyString([loginData?.tokenType]), 60) || "bearer",
    scope: compactStorageString(firstNonEmptyString([loginData?.scope]), 2048),
    idToken: compactStorageString(firstNonEmptyString([loginData?.idToken]), 4096),
    refreshToken: compactStorageString(firstNonEmptyString([loginData?.refreshToken]), 4096),
    imsSession,
    profile: normalizedProfile,
    imageUrl: resolveLoginImageUrl({
      ...loginData,
      profile: normalizedProfile,
    }),
    sessionKeys:
      loginData?.sessionKeys && typeof loginData.sessionKeys === "object"
        ? loginData.sessionKeys
        : buildSessionKeySnapshot({
            ...loginData,
            profile: normalizedProfile,
            imsSession,
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

function compactImsSessionForStorage(session) {
  if (!session || typeof session !== "object") {
    return null;
  }

  const compact = pruneEmptyObject({
    tokenId: compactStorageString(firstNonEmptyString([session?.tokenId, session?.id]), 220),
    sessionId: compactStorageString(firstNonEmptyString([session?.sessionId, session?.sid]), 220),
    sessionUrl: compactStorageString(firstNonEmptyString([session?.sessionUrl, session?.session]), 2048),
    userId: compactStorageString(firstNonEmptyString([session?.userId, session?.user_id]), 220),
    authId: compactStorageString(firstNonEmptyString([session?.authId, session?.aa_id]), 220),
    clientId: compactStorageString(firstNonEmptyString([session?.clientId, session?.client_id]), 140),
    tokenType: compactStorageString(firstNonEmptyString([session?.tokenType, session?.type]), 60),
    scope: compactStorageString(firstNonEmptyString([session?.scope]), 2048),
    as: compactStorageString(firstNonEmptyString([session?.as]), 80),
    fg: compactStorageString(firstNonEmptyString([session?.fg]), 120),
    moi: compactStorageString(firstNonEmptyString([session?.moi]), 120),
    pba: compactStorageString(firstNonEmptyString([session?.pba]), 240),
    keyAlias: compactStorageString(firstNonEmptyString([session?.keyAlias, session?.key_alias]), 180),
    stateNonce: compactStorageString(firstNonEmptyString([session?.stateNonce, session?.nonce]), 120),
    stateJslibVersion: compactStorageString(
      firstNonEmptyString([session?.stateJslibVersion, session?.jslibver, session?.jslibVersion]),
      160
    ),
    createdAt: Number(session?.createdAt || session?.created_at || 0),
    issuedAt: Number(session?.issuedAt || session?.issued_at || 0),
    expiresAt: Number(session?.expiresAt || session?.expires_at || 0),
  });

  return Object.keys(compact).length > 0 ? compact : null;
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
  const imsSession = compactImsSessionForStorage(loginData?.imsSession);
  const sessionKeys =
    loginData?.sessionKeys && typeof loginData.sessionKeys === "object"
      ? pruneEmptyObject(loginData.sessionKeys)
      : buildSessionKeySnapshot({
          ...loginData,
          profile: resolveLoginProfile(loginData),
          imsSession,
        });
  const fallbackIdentity = firstNonEmptyString([
    imsSession?.userId,
    profile?.userId,
    profile?.user_id,
    profile?.sub,
    loginData?.adobePassOrg?.userId,
  ]);
  const fallbackAvatar = fallbackIdentity ? toImsAvatarDownloadUrl(fallbackIdentity, 128) : "";

  const compact = pruneEmptyObject({
    accessToken: compactStorageString(firstNonEmptyString([loginData?.accessToken]), 4096),
    expiresAt: Number(loginData?.expiresAt || 0),
    tokenType: compactStorageString(firstNonEmptyString([loginData?.tokenType, imsSession?.tokenType]), 60),
    scope: compactStorageString(firstNonEmptyString([loginData?.scope, imsSession?.scope]), 2048),
    idToken: compactStorageString(firstNonEmptyString([loginData?.idToken]), 4096),
    refreshToken: compactStorageString(firstNonEmptyString([loginData?.refreshToken]), 4096),
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
    imsSession,
    sessionKeys,
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

async function clearLoginHelperResultStorage() {
  const areas = [chrome.storage?.session, chrome.storage?.local].filter(
    (area) => area && typeof area.get === "function" && typeof area.remove === "function"
  );
  if (areas.length === 0) {
    return 0;
  }

  let removedTotal = 0;
  for (const area of areas) {
    try {
      const payload = await area.get(null);
      const keysToRemove = Object.keys(payload || {}).filter(
        (key) => key.startsWith(LOGIN_HELPER_RESULT_PREFIX) || key.startsWith(LEGACY_LOGIN_HELPER_RESULT_PREFIX)
      );
      if (keysToRemove.length === 0) {
        continue;
      }
      await area.remove(keysToRemove);
      removedTotal += keysToRemove.length;
    } catch {
      // Ignore storage cleanup failures.
    }
  }

  return removedTotal;
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

function stopExperienceCloudSessionMonitor() {
  if (state.sessionMonitorStartTimeoutId) {
    clearTimeout(state.sessionMonitorStartTimeoutId);
    state.sessionMonitorStartTimeoutId = 0;
  }
  if (state.sessionMonitorIntervalId) {
    clearInterval(state.sessionMonitorIntervalId);
    state.sessionMonitorIntervalId = 0;
  }
  state.sessionMonitorBusy = false;
}

function startExperienceCloudSessionMonitor() {
  stopExperienceCloudSessionMonitor();

  const tick = () => {
    void runExperienceCloudSessionMonitorTick("interval");
  };

  state.sessionMonitorStartTimeoutId = window.setTimeout(() => {
    state.sessionMonitorStartTimeoutId = 0;
    tick();
    state.sessionMonitorIntervalId = window.setInterval(tick, IMS_SESSION_MONITOR_INTERVAL_MS);
  }, IMS_SESSION_MONITOR_START_DELAY_MS);
}

async function probeImsCookieSessionState() {
  const endpoints = [
    `${IMS_BASE_URL}/ims/check/v6/status?client_id=exc_app`,
    `${IMS_BASE_URL}/ims/check/v6/status?client_id=AdobePass1`,
    `${IMS_BASE_URL}/ims/check/v6/status?client_id=${encodeURIComponent(IMS_CLIENT_ID)}`,
    `${IMS_PROFILE_URL}?client_id=exc_app`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      });
      const responseText = await response.text().catch(() => "");
      if (responseLooksLikeExperienceCloudSignIn(response, responseText)) {
        return "inactive";
      }
      if (!response.ok) {
        continue;
      }
      const payload = parseJsonText(responseText, null);
      if (payload && typeof payload === "object") {
        return "active";
      }
    } catch {
      // Continue probing remaining endpoints.
    }
  }

  return "unknown";
}

async function probeExperienceCloudSsoCookieState() {
  try {
    const response = await fetch(EXPERIENCE_CLOUD_SSO_TOKEN_ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-IMS-ClientId": EXPERIENCE_CLOUD_SSO_CLIENT_ID,
      },
      body: "{}",
    });
    const responseText = await response.text().catch(() => "");
    const payload = parseJsonText(responseText, {});
    if (response.status === 401 || response.status === 403) {
      const errorCode = String(payload?.errorCode || payload?.error || "").toLowerCase();
      const errorMessage = String(payload?.errorMessage || payload?.message || "").toLowerCase();
      if (
        errorCode.includes("invalid_sso_info") ||
        errorMessage.includes("session cookie is null") ||
        errorMessage.includes("session cookie")
      ) {
        return "inactive";
      }
      return "unknown";
    }
    if (response.ok) {
      return "active";
    }
    if (responseLooksLikeExperienceCloudSignIn(response, responseText)) {
      return "inactive";
    }
  } catch {
    // Continue to the other probes.
  }
  return "unknown";
}

function markExperienceCloudSessionProbeResult(value, source = "unknown") {
  state.sessionMonitorLastProbeSource = String(source || "unknown");
  return value;
}

function isStrongInactiveSessionSignal(source = "unknown") {
  const normalized = String(source || "unknown").trim().toLowerCase();
  return normalized === "ims-cookie" || normalized === "programmers" || normalized === "sso-cookie";
}

function getSessionExpiryState() {
  const expiresAt = Number(state.loginData?.expiresAt || 0);
  if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
    return "unknown";
  }
  const now = Date.now();
  if (expiresAt <= now) {
    return "expired";
  }
  if (expiresAt <= now + TOKEN_REFRESH_LEEWAY_MS) {
    return "expiring";
  }
  return "fresh";
}

async function attemptSessionAutoBootstrap(trigger = "interval") {
  if (state.sessionMonitorSuppressed || state.sessionReady || state.restricted) {
    return false;
  }

  const now = Date.now();
  if (now - Number(state.sessionMonitorLastBootstrapAttemptAt || 0) < IMS_SESSION_MONITOR_BOOTSTRAP_COOLDOWN_MS) {
    return false;
  }
  state.sessionMonitorLastBootstrapAttemptAt = now;

  const cookieActivated = await tryActivateCookieSession(`session-monitor-${trigger}`, {
    restrictOnDenied: false,
  });
  if (cookieActivated) {
    return true;
  }

  const silent = await attemptSilentBootstrapLogin();
  if (!silent) {
    return false;
  }

  return activateSession(silent, `session-monitor-silent-${trigger}`);
}

async function probeExperienceCloudSessionState() {
  const ssoCookieState = await probeExperienceCloudSsoCookieState();
  if (ssoCookieState === "active") {
    return markExperienceCloudSessionProbeResult("active", "sso-cookie");
  }

  const imsCookieState = await probeImsCookieSessionState();
  if (imsCookieState === "active" || imsCookieState === "inactive") {
    return markExperienceCloudSessionProbeResult(imsCookieState, "ims-cookie");
  }

  try {
    const profile = await fetchImsSessionProfile("");
    if (profile && typeof profile === "object") {
      return markExperienceCloudSessionProbeResult("active", "ims-profile");
    }
  } catch {
    // Fall through to programmers access check.
  }

  try {
    await fetchProgrammersFromApi({ accessToken: "", requireEntities: false });
    return markExperienceCloudSessionProbeResult("active", "programmers");
  } catch (error) {
    if (error?.code === "PROGRAMMERS_ACCESS_DENIED") {
      return markExperienceCloudSessionProbeResult("inactive", "programmers");
    }
    if (ssoCookieState === "inactive") {
      return markExperienceCloudSessionProbeResult("inactive", "sso-fallback");
    }
    return markExperienceCloudSessionProbeResult("unknown", "unknown");
  }
}

async function resetToSignedOutState(options = {}) {
  const statusMessage = String(options.statusMessage || "").trim();
  const statusType = options.statusType === "error" ? "error" : options.statusType === "success" ? "success" : "info";
  clearRefreshTimer();
  clearPremiumServiceAutoRefreshTimers();
  await clearLoginData();
  resetWorkflowForLoggedOut();
  state.loginData = null;
  state.restricted = false;
  state.sessionReady = false;
  state.programmersApiEndpoint = null;
  state.mvpdCacheByRequestor.clear();
  state.sessionMonitorConsecutiveInactiveDetections = 0;
  state.sessionMonitorLastProbeSource = "unknown";
  state.sessionMonitorInactivityGuardUntil = 0;
  clearResolvedAvatar();
  setStatus(statusMessage, statusType);
  render();
}

async function runExperienceCloudSessionMonitorTick(trigger = "interval") {
  if (state.sessionMonitorBusy || state.busy || state.isBootstrapping || state.restrictedOrgSwitchBusy) {
    return;
  }
  if (state.sessionMonitorSuppressed && !state.sessionReady && !state.restricted) {
    return;
  }

  state.sessionMonitorBusy = true;
  try {
    const expiryState = getSessionExpiryState();
    if ((expiryState === "expiring" || expiryState === "expired") && state.sessionReady && state.loginData?.accessToken) {
      const refreshed = await refreshSessionNoTouch();
      if (!refreshed) {
        const postRefreshSessionState = await probeExperienceCloudSessionState();
        if (postRefreshSessionState === "active") {
          return;
        }
        await resetToSignedOutState({
          statusMessage:
            "Experience Cloud session is expiring. Please re-log into Experience Cloud, then click Sign In.",
          statusType: "error",
        });
        return;
      }
    }

    const sessionState = await probeExperienceCloudSessionState();
    if (sessionState === "active") {
      state.sessionMonitorConsecutiveInactiveDetections = 0;
      if (!state.sessionReady && !state.restricted && !state.sessionMonitorSuppressed) {
        await attemptSessionAutoBootstrap(trigger);
      }
      return;
    }

    if (sessionState === "unknown") {
      state.sessionMonitorConsecutiveInactiveDetections = 0;
      if (!state.sessionReady && !state.restricted && !state.sessionMonitorSuppressed) {
        await attemptSessionAutoBootstrap(`${trigger}-unknown`);
      }
      return;
    }

    if (sessionState === "inactive" && (state.sessionReady || state.restricted || state.loginData)) {
      const now = Date.now();
      const hasFreshUnderparToken =
        Boolean(state.loginData?.accessToken) && Number(state.loginData?.expiresAt || 0) > now + 60 * 1000;
      const probeSource = String(state.sessionMonitorLastProbeSource || "unknown");
      const strongInactiveSignal = isStrongInactiveSessionSignal(probeSource);
      if (strongInactiveSignal) {
        state.sessionMonitorConsecutiveInactiveDetections += 1;
      } else {
        state.sessionMonitorConsecutiveInactiveDetections = 0;
      }

      if (
        hasFreshUnderparToken &&
        (now < Number(state.sessionMonitorInactivityGuardUntil || 0) || !strongInactiveSignal)
      ) {
        return;
      }

      if (!strongInactiveSignal) {
        return;
      }

      if (state.sessionMonitorConsecutiveInactiveDetections < IMS_SESSION_MONITOR_INACTIVE_CONFIRM_TICKS) {
        return;
      }

      if (hasFreshUnderparToken) {
        const refreshed = await refreshSessionNoTouch();
        if (refreshed) {
          state.sessionMonitorConsecutiveInactiveDetections = 0;
          return;
        }
      }

      await resetToSignedOutState({
        statusMessage: "Experience Cloud session ended. UnderPAR is paused. Re-login in Experience Cloud or click Sign In.",
        statusType: "error",
      });
    }
  } finally {
    state.sessionMonitorBusy = false;
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
  const resolvedImageData = {
    ...enforced.loginData,
    profile: resolvedProfile,
  };
  const resolvedImageUrl =
    normalizeAvatarCandidate(resolveLoginImageUrl(resolvedImageData)) ||
    normalizeAvatarCandidate(readPersistedAvatarCandidate(resolvedImageData)) ||
    "";

  let validatedImsSession = null;
  try {
    validatedImsSession = await fetchValidateTokenSessionSnapshot(enforced.loginData.accessToken || "");
  } catch {
    validatedImsSession = null;
  }

  const resolvedImsSession = mergeImsSessionSnapshots(
    mergeImsSessionSnapshots(
      mergeImsSessionSnapshots(
        deriveImsSessionSnapshotFromToken(enforced.loginData.accessToken || ""),
        enforced.loginData?.imsSession && typeof enforced.loginData.imsSession === "object"
          ? enforced.loginData.imsSession
          : null
      ),
      validatedImsSession
    ),
    {
      userId: firstNonEmptyString([
        resolvedProfile?.userId,
        resolvedProfile?.user_id,
        resolvedProfile?.sub,
        resolvedProfile?.id,
      ]),
      authId: firstNonEmptyString([resolvedProfile?.authId, resolvedProfile?.aa_id, resolvedProfile?.adobeID]),
      expiresAt: Number(enforced.loginData?.expiresAt || 0),
      tokenType: firstNonEmptyString([enforced.loginData?.tokenType]),
      scope: firstNonEmptyString([enforced.loginData?.scope]),
    }
  );

  const resolvedLoginData = {
    ...enforced.loginData,
    tokenType: compactStorageString(firstNonEmptyString([enforced.loginData?.tokenType]), 60) || "bearer",
    scope: compactStorageString(firstNonEmptyString([enforced.loginData?.scope, resolvedImsSession?.scope]), 2048),
    idToken: compactStorageString(firstNonEmptyString([enforced.loginData?.idToken]), 4096),
    refreshToken: compactStorageString(firstNonEmptyString([enforced.loginData?.refreshToken]), 4096),
    imsSession: resolvedImsSession,
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
  resolvedLoginData.sessionKeys = buildSessionKeySnapshot(resolvedLoginData);

  state.loginData = resolvedLoginData;
  writePersistedAvatarCandidate(resolvedLoginData, {
    sourceUrl: resolvedLoginData.imageUrl || "",
    resolvedUrl: resolvedLoginData.imageUrl || "",
  });
  scheduleAvatarDataUrlPrefetch(resolvedLoginData, resolvedLoginData.imageUrl || "");
  state.restricted = false;
  state.sessionMonitorSuppressed = false;
  state.sessionMonitorConsecutiveInactiveDetections = 0;
  state.sessionMonitorInactivityGuardUntil = Date.now() + IMS_SESSION_MONITOR_INACTIVITY_GUARD_MS;
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
  if (state.silentRefreshPromise) {
    return state.silentRefreshPromise;
  }

  if (state.busy || state.isBootstrapping) {
    return false;
  }

  const refreshPromise = (async () => {
    try {
      const authData = await startLogin({ interactive: false, allowFallback: false });
      const profile = await resolveProfileAfterLogin(authData);
      const activated = await activateSession(buildLoginSessionPayloadFromAuth(authData, profile), "silent-refresh");
      return activated === true;
    } catch (error) {
      log("No-touch refresh skipped", error?.message || String(error));
      if (state.loginData?.expiresAt && state.loginData.expiresAt > Date.now()) {
        scheduleNoTouchRefresh();
      }
      return false;
    } finally {
      if (state.silentRefreshPromise === refreshPromise) {
        state.silentRefreshPromise = null;
      }
    }
  })();

  state.silentRefreshPromise = refreshPromise;
  return refreshPromise;
}

async function attemptSilentBootstrapLogin() {
  const silentVariants = [
    {},
    {
      client_id: EXPERIENCE_CLOUD_SSO_CLIENT_ID,
      profile_filter: EXPERIENCE_CLOUD_SILENT_PROFILE_FILTER,
    },
    {
      client_id: "AdobePass1",
    },
  ];

  for (const variant of silentVariants) {
    try {
      const authData = await startLogin({
        interactive: false,
        allowFallback: false,
        extraParams: variant,
      });
      const profile = await resolveProfileAfterLogin(authData);
      return buildLoginSessionPayloadFromAuth(authData, profile);
    } catch {
      // Try the next silent variant.
    }
  }

  return null;
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
  if (forcePremiumRefresh) {
    state.cmTenantBundleByTenantKey.clear();
    state.cmTenantBundlePromiseByTenantKey.clear();
  }

  if (!programmer) {
    renderPremiumServices(null);
    decompBroadcastSelectedControllerState(null, null);
    cmBroadcastSelectedControllerState(null, null);
    return;
  }
  decompBroadcastSelectedControllerState(programmer, null);
  cmBroadcastSelectedControllerState(programmer, null);

  const cachedServices = state.premiumAppsByProgrammerId.get(programmer.programmerId) || null;
  const cachedIncludesCm = Boolean(cachedServices && Object.prototype.hasOwnProperty.call(cachedServices, "cm"));
  const shouldReuseCachedServices =
    cachedServices &&
    cachedIncludesCm &&
    !forcePremiumRefresh &&
    !shouldRetryCachedCmService(cachedServices?.cm);
  if (shouldReuseCachedServices) {
    renderPremiumServices(cachedServices, programmer);
    void prewarmRestV2ForProgrammer(programmer, cachedServices);
    return;
  }

  renderPremiumServicesLoading(programmer);
  try {
    const [premiumApps, cmService] = await Promise.all([
      ensurePremiumAppsForProgrammer(programmer, {
        forceRefresh: forcePremiumRefresh,
      }),
      ensureCmServiceForProgrammer(programmer, {
        forceRefresh: forcePremiumRefresh,
      }),
    ]);
    if (requestToken !== state.premiumPanelRequestToken || resolveSelectedProgrammer()?.programmerId !== programmer.programmerId) {
      return;
    }
    const mergedServices = {
      ...(premiumApps && typeof premiumApps === "object" ? premiumApps : {}),
      cm: cmService,
    };
    state.premiumAppsByProgrammerId.set(programmer.programmerId, mergedServices);
    renderPremiumServices(mergedServices, programmer);
    void prewarmRestV2ForProgrammer(programmer, mergedServices);
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

function getAdobeConsoleErrorMessage(parsed, text, statusText = "") {
  return (
    normalizeHttpErrorMessage(
      firstNonEmptyString([
        parsed?.error_description,
        parsed?.error?.description,
        parsed?.error?.message,
        typeof parsed?.error === "string" ? parsed.error : "",
        parsed?.message,
        text,
        statusText,
      ])
    ) || "Request failed."
  );
}

function isAdobeConsoleTokenExpiredResponse(status, parsed, text = "") {
  if (Number(status) !== 401) {
    return false;
  }

  const errorCode = String(
    firstNonEmptyString([
      parsed?.code,
      parsed?.error_code,
      parsed?.errorCode,
      parsed?.error?.code,
      parsed?.error?.error_code,
      parsed?.error?.errorCode,
    ]) || ""
  )
    .trim()
    .toLowerCase();

  if (errorCode.includes("expired") || errorCode.includes("invalid_token")) {
    return true;
  }

  const normalizedMessage = String(
    firstNonEmptyString([
      parsed?.error_description,
      parsed?.error?.description,
      parsed?.error?.message,
      typeof parsed?.error === "string" ? parsed.error : "",
      parsed?.message,
      text,
    ]) || ""
  )
    .trim()
    .toLowerCase();

  return (
    normalizedMessage.includes("access token is expired") ||
    normalizedMessage.includes("token is expired") ||
    normalizedMessage.includes("expired token") ||
    normalizedMessage.includes("invalid access token")
  );
}

async function fetchAdobeConsoleJsonWithAuthVariants(urlCandidates, contextLabel) {
  const urls = Array.isArray(urlCandidates)
    ? [...new Set(urlCandidates.filter((item) => typeof item === "string" && item.trim()))]
    : [];
  if (urls.length === 0) {
    throw new Error(`${contextLabel} failed: no URL candidates.`);
  }

  const getHeaderVariants = () => {
    const variants = [getAdobeConsoleRequestHeaders("")];
    const activeAccessToken = firstNonEmptyString([state.loginData?.accessToken]);
    if (activeAccessToken) {
      variants.push(getAdobeConsoleRequestHeaders(activeAccessToken));
    }
    return variants;
  };

  let lastError = null;
  for (const url of urls) {
    let bootstrapAttemptedForUrl = false;
    let silentRefreshAttemptedForUrl = false;
    let headerVariants = getHeaderVariants();

    headersLoop: for (let headerIndex = 0; headerIndex < headerVariants.length; headerIndex += 1) {
      const headers = headerVariants[headerIndex];
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

          if (
            isAdobeConsoleTokenExpiredResponse(response.status, parsed, text) &&
            !silentRefreshAttemptedForUrl &&
            firstNonEmptyString([state.loginData?.accessToken])
          ) {
            silentRefreshAttemptedForUrl = true;
            const refreshed = await refreshSessionNoTouch();
            if (refreshed) {
              headerVariants = getHeaderVariants();
              bootstrapAttemptedForUrl = false;
              headerIndex = -1;
              continue headersLoop;
            }
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

          const message = getAdobeConsoleErrorMessage(parsed, text, response.statusText);
          lastError = new Error(`${contextLabel} failed (${response.status}): ${message}`);
          break;
        } catch (error) {
          const message = normalizeHttpErrorMessage(error instanceof Error ? error.message : String(error));
          lastError = new Error(message || `${contextLabel} request failed.`);
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
    return { degradation: null, esm: null, restV2: null, restV2Apps: [], cm: null };
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
    const existingServices = state.premiumAppsByProgrammerId.get(programmer.programmerId) || null;
    const mergedServices = {
      ...premiumApps,
      cm: existingServices?.cm ?? null,
    };
    state.premiumAppsByProgrammerId.set(programmer.programmerId, mergedServices);
    return mergedServices;
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

function normalizeCmMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenizeCmMatchText(value) {
  return normalizeCmMatchText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function normalizeCmUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || !/^https?:\/\//i.test(raw)) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    return parsed.toString();
  } catch {
    return raw;
  }
}

function collectCmUrlsFromValue(value, options = {}) {
  const maxDepth = Math.max(1, Number(options.maxDepth || 4));
  const urls = new Set();
  const visited = new Set();
  const stack = [{ node: value, depth: 0 }];
  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    if (node == null || depth > maxDepth) {
      continue;
    }
    if (typeof node === "string") {
      const normalized = normalizeCmUrl(node);
      if (normalized) {
        urls.add(normalized);
      }
      continue;
    }
    if (typeof node !== "object") {
      continue;
    }
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);
    if (Array.isArray(node)) {
      node.forEach((item) => stack.push({ node: item, depth: depth + 1 }));
      continue;
    }
    Object.entries(node).forEach(([key, nested]) => {
      if (typeof nested === "string") {
        const normalized = normalizeCmUrl(nested);
        if (normalized) {
          urls.add(normalized);
        }
      }
      if (typeof nested === "object") {
        stack.push({ node: nested, depth: depth + 1 });
      }
      if (typeof nested === "string" && /(url|href|link|endpoint|api)/i.test(key)) {
        const normalized = normalizeCmUrl(nested);
        if (normalized) {
          urls.add(normalized);
        }
      }
    });
  }
  return [...urls];
}

function collectCmCollections(value, options = {}) {
  const preferredKeys = Array.isArray(options.preferredKeys)
    ? options.preferredKeys.map((key) => String(key || "").toLowerCase()).filter(Boolean)
    : [];
  const maxDepth = Math.max(1, Number(options.maxDepth || 4));
  const output = [];
  const visited = new Set();
  const stack = [{ node: value, key: "$root", depth: 0 }];
  while (stack.length > 0) {
    const { node, key, depth } = stack.pop();
    if (node == null || depth > maxDepth) {
      continue;
    }
    if (typeof node !== "object") {
      continue;
    }
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);

    if (Array.isArray(node)) {
      const objectCount = node.reduce((count, item) => count + (item && typeof item === "object" ? 1 : 0), 0);
      const normalizedKey = String(key || "").toLowerCase();
      const preferred = preferredKeys.some((preferredKey) => normalizedKey === preferredKey || normalizedKey.includes(preferredKey));
      output.push({
        key: normalizedKey || "$root",
        depth,
        preferred,
        objectCount,
        values: node,
      });
      node.forEach((item) => {
        if (item && typeof item === "object") {
          stack.push({ node: item, key: normalizedKey, depth: depth + 1 });
        }
      });
      continue;
    }

    Object.entries(node).forEach(([childKey, childValue]) => {
      stack.push({ node: childValue, key: childKey, depth: depth + 1 });
    });
  }

  output.sort((left, right) => {
    if (left.preferred !== right.preferred) {
      return left.preferred ? -1 : 1;
    }
    if (left.objectCount !== right.objectCount) {
      return right.objectCount - left.objectCount;
    }
    if (left.values.length !== right.values.length) {
      return right.values.length - left.values.length;
    }
    return left.depth - right.depth;
  });
  return output;
}

function collectCmNameCandidates(item, extra = []) {
  const values = [];
  const pushValue = (value) => {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => pushValue(entry));
      return;
    }
    if (typeof value === "object") {
      return;
    }
    const text = String(value || "").trim();
    if (!text) {
      return;
    }
    values.push(text);
  };

  if (item && typeof item === "object") {
    const payload = item.payload && typeof item.payload === "object" ? item.payload : null;
    pushValue(item.name);
    pushValue(item.displayName);
    pushValue(item.display_name);
    pushValue(item.title);
    pushValue(item.label);
    pushValue(item.tenantName);
    pushValue(item.tenant_name);
    pushValue(item.shortName);
    pushValue(item.short_name);
    pushValue(item.code);
    pushValue(item.groupName);
    pushValue(item.group_name);
    pushValue(item.slug);
    pushValue(item.id);
    pushValue(item.tenantId);
    pushValue(item.tenant_id);
    pushValue(item.uuid);
    pushValue(item.consoleId);
    pushValue(item.consoleOwnerId);
    pushValue(item.requestorId);
    pushValue(item.requestor_id);
    if (payload) {
      pushValue(payload.name);
      pushValue(payload.displayName);
      pushValue(payload.display_name);
      pushValue(payload.title);
      pushValue(payload.label);
      pushValue(payload.id);
      pushValue(payload.ownerId);
      pushValue(payload.tenantId);
      pushValue(payload.tenant_id);
      pushValue(payload.orgId);
      pushValue(payload.org_id);
      pushValue(payload.policyId);
      pushValue(payload.policy_id);
      pushValue(payload.applicationId);
      pushValue(payload.application_id);
      pushValue(payload.consoleId);
      pushValue(payload.consoleOwnerId);
      pushValue(payload.code);
      pushValue(payload.slug);
    }
  }
  pushValue(extra);
  return uniqueSorted(values);
}

function extractCmTenantIdFromUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  const readSegments = (text) =>
    String(text || "")
      .split("/")
      .map((segment) => decodeURIComponent(String(segment || "").trim()))
      .filter(Boolean);
  try {
    const parsed = new URL(raw);
    const segments = readSegments(parsed.pathname);
    for (let index = 0; index < segments.length; index += 1) {
      const part = String(segments[index] || "").toLowerCase();
      if ((part === "tenant" || part === "tenants") && segments[index + 1]) {
        return String(segments[index + 1] || "").trim();
      }
    }
    const hashText = String(parsed.hash || "").replace(/^#/, "");
    if (hashText) {
      const hashSegments = readSegments(hashText);
      for (let index = 0; index < hashSegments.length; index += 1) {
        const part = String(hashSegments[index] || "").toLowerCase();
        if ((part === "tenant" || part === "tenants") && hashSegments[index + 1]) {
          return String(hashSegments[index + 1] || "").trim();
        }
      }
      if (hashSegments.length >= 1 && hashSegments.some((part) => String(part).toLowerCase() === "cm-console")) {
        return String(hashSegments[hashSegments.length - 1] || "").trim();
      }
    }
  } catch {
    // Ignore URL parse errors.
  }
  return "";
}

function normalizeCmTenantRecord(item, index = 0, sourceUrl = "") {
  if (item == null) {
    return null;
  }
  if (typeof item !== "object") {
    const primitiveName = String(item || "").trim();
    if (!primitiveName) {
      return null;
    }
    return {
      tenantId: primitiveName,
      tenantName: primitiveName,
      aliases: collectCmNameCandidates(null, [primitiveName]),
      links: sourceUrl ? [sourceUrl] : [],
      raw: item,
      sourceUrl: String(sourceUrl || ""),
    };
  }
  const keys = Object.keys(item).map((key) => String(key || "").toLowerCase());
  const payload = item.payload && typeof item.payload === "object" ? item.payload : null;
  const hasTenantSignal =
    keys.some((key) => key.includes("tenant")) ||
    item.tenantId != null ||
    item.tenant_id != null ||
    item.tenantName != null ||
    item.tenant_name != null ||
    item.consoleId != null ||
    item.consoleOwnerId != null ||
    payload?.tenantId != null ||
    payload?.tenant_id != null ||
    payload?.name != null ||
    payload?.ownerId != null;
  const hasEntityIdentity =
    Boolean(
      firstNonEmptyString([
        item.id,
        item.uuid,
        item.slug,
        item.code,
        item.consoleId,
        item.consoleOwnerId,
        payload?.id,
        payload?.ownerId,
      ])
    ) &&
    Boolean(
      firstNonEmptyString([
        item.name,
        item.displayName,
        item.display_name,
        item.title,
        item.label,
        payload?.name,
        payload?.displayName,
        payload?.display_name,
        payload?.title,
      ])
    );
  const sourceLooksLikeCmCatalog = /(?:cm-console|adobeprimetime\.com|\/cm\/|\/tenant|\/tenants|\/applications|\/policies|\/usage|\/cmu)/i.test(
    String(sourceUrl || "")
  );
  if (!hasTenantSignal && !(hasEntityIdentity && sourceLooksLikeCmCatalog)) {
    return null;
  }
  const links = uniqueSorted(collectCmUrlsFromValue(item).concat(sourceUrl ? [sourceUrl] : []));
  const tenantIdFromLink = firstNonEmptyString(links.map((url) => extractCmTenantIdFromUrl(url)));
  const tenantId = firstNonEmptyString([
    item.tenantId,
    item.tenant_id,
    item.consoleId,
    item.consoleOwnerId,
    item.id,
    item.uuid,
    item.slug,
    item.code,
    item.tenant,
    payload?.tenantId,
    payload?.tenant_id,
    payload?.ownerId,
    payload?.orgId,
    payload?.id,
    tenantIdFromLink,
    item.name,
    payload?.name,
  ]);
  const tenantName = firstNonEmptyString([
    item.tenantName,
    item.tenant_name,
    item.displayName,
    item.display_name,
    item.tenant,
    item.name,
    item.title,
    payload?.name,
    payload?.displayName,
    payload?.display_name,
    payload?.title,
    payload?.ownerId,
    tenantIdFromLink,
    tenantId,
  ]);
  if (!tenantId && !tenantName) {
    return null;
  }
  const aliases = collectCmNameCandidates(item, [tenantId, tenantName]);
  return {
    tenantId: String(tenantId || tenantName || `tenant-${index + 1}`),
    tenantName: String(tenantName || tenantId || `Tenant ${index + 1}`),
    aliases,
    links,
    raw: item,
    sourceUrl: String(sourceUrl || ""),
  };
}

function normalizeCmEntityRecord(kind, item, index = 0, tenant = null, fallbackUrl = "") {
  if (!item || typeof item !== "object") {
    return null;
  }
  const kindValue = String(kind || "").trim().toLowerCase();
  const payload = item.payload && typeof item.payload === "object" ? item.payload : null;
  const entityId = firstNonEmptyString([
    item.consoleId,
    item.id,
    item.applicationId,
    item.application_id,
    item.appId,
    item.app_id,
    item.policyId,
    item.policy_id,
    item.ruleId,
    item.rule_id,
    item.usageId,
    item.usage_id,
    item.uuid,
    item.slug,
    payload?.id,
    payload?.applicationId,
    payload?.application_id,
    payload?.policyId,
    payload?.policy_id,
    payload?.ruleId,
    payload?.rule_id,
    payload?.usageId,
    payload?.usage_id,
    item.name,
    payload?.name,
  ]);
  const name = firstNonEmptyString([
    item.name,
    item.displayName,
    item.display_name,
    item.applicationName,
    item.application_name,
    item.policyName,
    item.policy_name,
    item.ruleName,
    item.rule_name,
    item.title,
    item.label,
    payload?.name,
    payload?.displayName,
    payload?.display_name,
    payload?.applicationName,
    payload?.application_name,
    payload?.policyName,
    payload?.policy_name,
    payload?.ruleName,
    payload?.rule_name,
    payload?.title,
    payload?.label,
    entityId,
  ]);
  if (!entityId && !name) {
    return null;
  }
  const linkCandidates = collectCmUrlsFromValue(item)
    .concat(payload ? collectCmUrlsFromValue(payload) : [])
    .concat(fallbackUrl ? [fallbackUrl] : []);
  const tenantId = String(tenant?.tenantId || "").trim();
  if (kindValue === "policies" && tenantId && entityId) {
    linkCandidates.push(
      `${CM_CONFIG_BASE_URL}/maitai/policy/${encodeURIComponent(String(entityId || "").trim())}?orgId=${encodeURIComponent(
        tenantId
      )}`
    );
  }
  const links = uniqueSorted(linkCandidates.map((value) => normalizeCmUrl(value)).filter(Boolean));
  return {
    kind: kindValue,
    entityId: String(entityId || name || `${kind}-${index + 1}`),
    name: String(name || entityId || `${kind}-${index + 1}`),
    tenantId: String(tenant?.tenantId || ""),
    tenantName: String(tenant?.tenantName || ""),
    aliases: collectCmNameCandidates(item, [entityId, name]),
    links,
    raw: payload || item,
    sourceUrl: String(fallbackUrl || ""),
  };
}

function normalizeCmTenantsFromPayload(payload, sourceUrl = "") {
  const collections = collectCmCollections(payload, {
    preferredKeys: ["tenants", "tenant", "items", "results", "data"],
    maxDepth: 5,
  });
  const tenants = [];
  const seen = new Set();
  collections.forEach((collection) => {
    collection.values.forEach((item, index) => {
      const record = normalizeCmTenantRecord(item, index, sourceUrl);
      if (!record) {
        return;
      }
      const key = normalizeCmMatchText(`${record.tenantId}|${record.tenantName}`);
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      tenants.push(record);
    });
  });
  return tenants;
}

function normalizeCmResourceListFromPayload(kind, payload, tenant = null, fallbackUrl = "") {
  const kindValue = String(kind || "").trim().toLowerCase();
  const preferredByKind = {
    applications: ["applications", "application", "apps", "items", "data", "results"],
    policies: ["policies", "policy", "rules", "items", "data", "results"],
    usage: ["usage", "cmu", "metrics", "reports", "items", "data", "results"],
  };
  const collections = collectCmCollections(payload, {
    preferredKeys: preferredByKind[kindValue] || ["items", "data", "results"],
    maxDepth: 5,
  });
  const rows = [];
  const seen = new Set();
  collections.forEach((collection) => {
    collection.values.forEach((item, index) => {
      const record = normalizeCmEntityRecord(kindValue, item, index, tenant, fallbackUrl);
      if (!record) {
        return;
      }
      const key = normalizeCmMatchText(`${record.kind}|${record.entityId}|${record.name}|${record.tenantId}`);
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      rows.push(record);
    });
  });
  return rows;
}

function collectCmMatchVariants(values) {
  const variants = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const normalized = normalizeCmMatchText(value);
    if (!normalized) {
      return;
    }
    variants.add(normalized);
    const parts = tokenizeCmMatchText(normalized);
    if (parts.length >= 2) {
      variants.add(parts.join(""));
      variants.add(parts.map((part) => String(part || "").charAt(0)).join(""));
    }
  });
  return [...variants];
}

function scoreCmTenantMatch(programmer, tenant) {
  const programmerCandidates = uniqueSorted([
    programmer?.mediaCompanyName,
    programmer?.programmerName,
    programmer?.programmerId,
  ]);
  const tenantCandidates = uniqueSorted([tenant?.tenantName, tenant?.tenantId, ...(tenant?.aliases || [])]);

  const programmerNormalized = collectCmMatchVariants(programmerCandidates);
  const tenantNormalized = collectCmMatchVariants(tenantCandidates);
  if (programmerNormalized.length === 0 || tenantNormalized.length === 0) {
    return 0;
  }

  let score = 0;
  programmerNormalized.forEach((pToken) => {
    tenantNormalized.forEach((tToken) => {
      if (pToken === tToken) {
        score = Math.max(score, 100);
        return;
      }
      if (pToken.includes(tToken) || tToken.includes(pToken)) {
        score = Math.max(score, Math.min(88, Math.max(38, Math.floor(Math.min(pToken.length, tToken.length) * 2.2))));
      }
      const pParts = new Set(tokenizeCmMatchText(pToken));
      const tParts = new Set(tokenizeCmMatchText(tToken));
      if (pParts.size === 0 || tParts.size === 0) {
        return;
      }
      let overlap = 0;
      pParts.forEach((part) => {
        if (tParts.has(part)) {
          overlap += 1;
        }
      });
      if (overlap > 0) {
        const ratio = overlap / Math.max(pParts.size, tParts.size);
        score = Math.max(score, Math.floor(22 + ratio * 48));
      }
    });
  });
  return score;
}

function isCmDirectTenantMatch(programmer, tenant) {
  const programmerCandidates = uniqueSorted([programmer?.mediaCompanyName, programmer?.programmerName, programmer?.programmerId]);
  const tenantCandidates = uniqueSorted([tenant?.tenantName, tenant?.tenantId, ...(tenant?.aliases || [])]);
  const programmerVariants = collectCmMatchVariants(programmerCandidates).filter((value) => String(value || "").length >= 2);
  const tenantVariants = new Set(collectCmMatchVariants(tenantCandidates).filter((value) => String(value || "").length >= 2));
  if (programmerVariants.length === 0 || tenantVariants.size === 0) {
    return false;
  }
  return programmerVariants.some((value) => tenantVariants.has(value));
}

function findCmTenantMatchesForProgrammer(programmer, tenants) {
  const scored = (Array.isArray(tenants) ? tenants : [])
    .map((tenant) => ({
      tenant,
      score: scoreCmTenantMatch(programmer, tenant),
    }))
    .filter((entry) => entry.score >= 26)
    .sort((left, right) => right.score - left.score || left.tenant.tenantName.localeCompare(right.tenant.tenantName));
  if (scored.length === 0) {
    return [];
  }
  const directMatches = scored.filter((entry) => isCmDirectTenantMatch(programmer, entry.tenant)).map((entry) => entry.tenant);
  if (directMatches.length > 0) {
    const seen = new Set();
    return directMatches.filter((tenant) => {
      const key = `${tenant?.tenantId || ""}|${tenant?.tenantName || ""}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  const bestScore = scored[0].score;
  const floor = Math.max(26, bestScore >= 90 ? bestScore - 34 : bestScore - 22);
  return scored.filter((entry) => entry.score >= floor).map((entry) => entry.tenant);
}

function cmGetTenantCacheKey(tenant) {
  const tenantId = normalizeCmMatchText(tenant?.tenantId);
  const tenantName = normalizeCmMatchText(tenant?.tenantName);
  const key = `${tenantId}|${tenantName}`.replace(/^\|+|\|+$/g, "");
  return key || "";
}

function buildCmTenantEndpointCandidates() {
  const orgHints = uniqueSorted(
    [
      CM_DEFAULT_TENANT_ORG_HINT,
      ADOBEPASS_ORG_KEYWORD,
      state.loginData?.adobePassOrg?.name,
      state.loginData?.adobePassOrg?.orgId,
      state.loginData?.profile?.currentOrg?.name,
      state.loginData?.profile?.currentOrg?.id,
    ]
      .map((value) => String(value || "").trim().replace(/^@+/, "").replace(/^\/+|\/+$/g, ""))
      .map((value) => value.toLowerCase())
      .filter(Boolean)
  );
  const dynamicUrls = orgHints.map((orgId) => `${CM_CONFIG_BASE_URL}/core/tenants?orgId=${encodeURIComponent(orgId)}`);
  return uniqueSorted([...CM_TENANT_ENDPOINT_CANDIDATES, ...dynamicUrls].map((url) => normalizeCmUrl(url)).filter(Boolean));
}

async function ensureCmApiAccessToken(options = {}) {
  const forceRefresh = options.forceRefresh === true;
  const tokenFreshLeewayMs =
    Number.isFinite(options.freshLeewayMs) && Number(options.freshLeewayMs) >= 0
      ? Number(options.freshLeewayMs)
      : 60 * 1000;
  const existingToken = String(state.loginData?.accessToken || "").trim();
  const existingExpiresAt = Number(state.loginData?.expiresAt || 0);
  const hasKnownExpiry = Number.isFinite(existingExpiresAt) && existingExpiresAt > 0;
  const tokenLooksFresh = hasKnownExpiry && existingExpiresAt > Date.now() + tokenFreshLeewayMs;
  if (existingToken && !forceRefresh && (!hasKnownExpiry || tokenLooksFresh)) {
    return existingToken;
  }

  if (state.cmAuthBootstrapPromise) {
    return state.cmAuthBootstrapPromise;
  }

  const now = Date.now();
  const lastAttempt = Number(state.cmAuthBootstrapLastAttemptAt || 0);
  if (!forceRefresh && lastAttempt > 0 && now - lastAttempt < CM_AUTH_BOOTSTRAP_RETRY_MS) {
    return existingToken;
  }
  state.cmAuthBootstrapLastAttemptAt = now;

  const promise = (async () => {
    try {
      const silent = await attemptSilentBootstrapLogin();
      const accessToken = String(silent?.accessToken || "").trim();
      if (!accessToken) {
        return "";
      }

      const current = state.loginData || createCookieSessionLoginData();
      const mergedProfile = mergeProfilePayloads(resolveLoginProfile(current), resolveLoginProfile(silent));
      const nextLoginData = {
        ...current,
        accessToken,
        expiresAt: Number(silent?.expiresAt || 0),
        profile: mergedProfile,
        imageUrl: resolveLoginImageUrl({
          ...current,
          accessToken,
          profile: mergedProfile,
        }),
      };
      state.loginData = nextLoginData;

      try {
        await saveLoginData(nextLoginData);
      } catch (error) {
        log("CM token bootstrap persisted in-memory only", {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      scheduleNoTouchRefresh();
      return accessToken;
    } catch (error) {
      log("CM token bootstrap skipped", {
        error: error instanceof Error ? error.message : String(error),
      });
      return existingToken;
    }
  })();

  state.cmAuthBootstrapPromise = promise;
  try {
    return await promise;
  } finally {
    if (state.cmAuthBootstrapPromise === promise) {
      state.cmAuthBootstrapPromise = null;
    }
  }
}

function getCmAuthFingerprint() {
  const token = String(state.loginData?.accessToken || "").trim();
  return token ? token.slice(-24) : "no-token";
}

function shouldRetryCachedCmService(cmService) {
  const currentFingerprint = getCmAuthFingerprint();
  if (!cmService || typeof cmService !== "object") {
    return currentFingerprint !== "no-token";
  }

  const loadError = String(cmService.loadError || "").trim();
  if (loadError) {
    const fetchedAt = Number(cmService.fetchedAt || 0);
    if (!fetchedAt) {
      return true;
    }
    return Date.now() - fetchedAt >= 60 * 1000;
  }

  const matchedTenants = Array.isArray(cmService.matchedTenants) ? cmService.matchedTenants : [];
  if (matchedTenants.length > 0) {
    return false;
  }

  const cachedFingerprint = String(cmService.tokenFingerprint || "").trim();
  if (!cachedFingerprint) {
    return currentFingerprint !== "no-token";
  }
  if (currentFingerprint === "no-token" && cachedFingerprint === "no-token") {
    const fetchedAt = Number(cmService.fetchedAt || 0);
    if (fetchedAt > 0 && Date.now() - fetchedAt >= CM_AUTH_BOOTSTRAP_RETRY_MS) {
      return true;
    }
  }
  return cachedFingerprint !== currentFingerprint;
}

function prefetchCmTenantsCatalogInBackground(reason = "background") {
  if (state.restricted || state.programmers.length === 0) {
    return;
  }
  if (state.cmTenantsCatalogPromise) {
    return;
  }
  const cached = state.cmTenantsCatalog;
  if (cached && Array.isArray(cached.tenants) && cached.tenants.length > 0) {
    return;
  }
  void ensureCmTenantsCatalog()
    .then(() => {
      // Background prefetch intentionally silent to avoid UI noise.
    })
    .catch((error) => {
      log("CM tenant prefetch failed", {
        reason,
        error: error instanceof Error ? error.message : String(error),
      });
    });
}

function buildCmTemplateUrls(tenantId, templates) {
  const resolvedTenantId = String(tenantId || "").trim();
  if (!resolvedTenantId) {
    return [];
  }
  const encodedTenantId = encodeURIComponent(resolvedTenantId);
  const urls = [];
  CM_BASE_URL_CANDIDATES.forEach((base) => {
    (Array.isArray(templates) ? templates : []).forEach((template) => {
      const path = String(template || "").replace(/\{tenantId\}/g, encodedTenantId);
      const normalizedBase = String(base || "").replace(/\/+$/, "");
      urls.push(`${normalizedBase}${path}`);
    });
  });
  return uniqueSorted(urls.map((url) => normalizeCmUrl(url)).filter(Boolean));
}

function formatCmUsageLabelFromPath(path) {
  const text = String(path || "").trim();
  if (!text) {
    return "CMU";
  }
  const parts = text
    .replace(/^\/+/, "")
    .replace(/\?.*$/, "")
    .split("/")
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .filter((part) => part.toLowerCase() !== "v2")
    .filter((part) => part.toLowerCase() !== "cmu")
    .filter((part) => part.toLowerCase() !== "year")
    .filter((part) => part.toLowerCase() !== "month");
  if (parts.length === 0) {
    return "CMU Summary (Year/Month)";
  }
  return `CMU ${parts.map((part) => part.replace(/-/g, " ")).join(" > ")}`.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCmUsageDateValue(date) {
  const value = date instanceof Date ? date : new Date(date);
  const yyyy = value.getUTCFullYear();
  const mm = String(value.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(value.getUTCDate()).padStart(2, "0");
  const hh = String(value.getUTCHours()).padStart(2, "0");
  const mi = String(value.getUTCMinutes()).padStart(2, "0");
  const ss = String(value.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

function buildCmUsageDateWindow(profileHarvest = null) {
  const nowMs = Date.now();
  let startMs = nowMs - 9 * 24 * 60 * 60 * 1000;
  let endMs = nowMs;
  const harvested = profileHarvest && typeof profileHarvest === "object" ? profileHarvest : null;
  if (harvested) {
    const notBeforeMs = Number(harvested.notBeforeMs || 0);
    const notAfterMs = Number(harvested.notAfterMs || 0);
    if (Number.isFinite(notBeforeMs) && notBeforeMs > 0) {
      startMs = Math.max(notBeforeMs - 60 * 60 * 1000, nowMs - 31 * 24 * 60 * 60 * 1000);
    }
    if (Number.isFinite(notAfterMs) && notAfterMs > 0) {
      endMs = Math.min(nowMs, notAfterMs + 60 * 60 * 1000);
    }
  }
  if (endMs <= startMs) {
    endMs = Math.min(nowMs, startMs + 24 * 60 * 60 * 1000);
  }
  return {
    start: new Date(startMs),
    end: new Date(endMs),
  };
}

function buildCmUsageQueryString(path, profileHarvest = null) {
  const now = new Date();
  const range = buildCmUsageDateWindow(profileHarvest);
  const start = range.start || new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000);
  const end = range.end || now;
  const params = new URLSearchParams();
  params.set("start", formatCmUsageDateValue(start));
  params.set("end", formatCmUsageDateValue(end));
  params.set("limit", "1000");
  if (/\/tenant(?:\/|$)/i.test(String(path || "")) || /\/hour(?:\/|$)/i.test(String(path || ""))) {
    params.set("metrics", "users");
  }
  params.set("format", "json");
  return params.toString();
}

function buildCmUsageSeedRows(tenant, profileHarvest = null) {
  const tenantId = String(tenant?.tenantId || "").trim();
  const tenantName = String(tenant?.tenantName || tenantId).trim();
  const correlation = profileHarvest && typeof profileHarvest === "object" ? profileHarvest : null;
  const rows = [];
  const seen = new Set();
  CM_USAGE_PATH_TEMPLATES.forEach((template, index) => {
    const path = String(template || "").trim();
    if (!path) {
      return;
    }
    const normalizedPath = `/${path.replace(/^\/+/, "").replace(/\?.*$/, "")}`;
    const queryString = buildCmUsageQueryString(normalizedPath, correlation);
    const absoluteUrl = normalizeCmUrl(`${CM_REPORTS_BASE_URL}${normalizedPath}?${queryString}`);
    if (!absoluteUrl || seen.has(absoluteUrl)) {
      return;
    }
    seen.add(absoluteUrl);
    const endpointLabelBase = formatCmUsageLabelFromPath(normalizedPath);
    const endpointLabel = correlation?.subject ? `${endpointLabelBase} (Correlated Window)` : endpointLabelBase;
    const endpointKey = String(normalizedPath || "")
      .replace(/^\/+/, "")
      .replace(/[^\w/-]+/g, "-")
      .replace(/\/+/g, "-");
    rows.push({
      kind: "usage",
      entityId: endpointKey || `cmu-${index + 1}`,
      name: endpointLabel,
      tenantId,
      tenantName,
      aliases: [normalizedPath, endpointKey],
      links: [absoluteUrl],
      sourceUrl: absoluteUrl,
      raw: {
        endpointPath: normalizedPath,
        endpointUrl: absoluteUrl,
        endpointLabel,
        tenantId,
        tenantName,
        correlationSubject: String(correlation?.subject || "").trim(),
        correlationSessionId: String(correlation?.sessionId || "").trim(),
        correlationMvpd: String(correlation?.mvpd || "").trim(),
      },
    });
  });
  return rows;
}

function isCmTokenExpiredResponse(status, parsed, text = "") {
  if (Number(status) !== 401) {
    return false;
  }

  const errorCode = extractApiErrorCode(parsed);
  if (errorCode.includes("expired") || errorCode.includes("invalid_token")) {
    return true;
  }

  const message = String(
    firstNonEmptyString([
      parsed?.error?.code,
      parsed?.error?.message,
      typeof parsed?.error === "string" ? parsed.error : "",
      parsed?.message,
      text,
    ]) || ""
  )
    .trim()
    .toLowerCase();

  return (
    message.includes("access token is expired") ||
    message.includes("token is expired") ||
    message.includes("expired token") ||
    message.includes("invalid access token")
  );
}

async function fetchCmJsonWithAuthVariants(urlCandidates, contextLabel, options = {}) {
  const urls = uniqueSorted((Array.isArray(urlCandidates) ? urlCandidates : []).map((url) => normalizeCmUrl(url)).filter(Boolean));
  if (urls.length === 0) {
    throw new Error(`${contextLabel} failed: no URL candidates.`);
  }

  const method = String(options.method || "GET").toUpperCase();
  const debugMeta = options.debugMeta && typeof options.debugMeta === "object" ? options.debugMeta : {};
  const baseHeaders = {
    Accept: "application/json, text/plain, */*",
    ...(options.headers && typeof options.headers === "object" ? options.headers : {}),
  };
  const buildHeaderVariants = () => {
    const variants = [baseHeaders];
    const accessToken = String(state.loginData?.accessToken || "").trim();
    if (accessToken) {
      variants.push({
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      });
    }
    return variants;
  };

  let lastError = null;
  let attemptCounter = 0;
  for (const url of urls) {
    let tokenRefreshAttempted = false;
    let headerVariants = buildHeaderVariants();
    headersLoop: for (let headerIndex = 0; headerIndex < headerVariants.length; headerIndex += 1) {
      const headers = headerVariants[headerIndex];
      attemptCounter += 1;
      emitCmDebugEvent(
        {
          phase: "cm-request-attempt",
          contextLabel: String(contextLabel || ""),
          method,
          url,
          attempt: attemptCounter,
          authMode: detectCmAuthMode(headers),
          hasBody: options.body != null,
        },
        {
          flowId: String(debugMeta.flowId || "").trim(),
          context: debugMeta,
        }
      );
      try {
        const response = await fetch(url, {
          method,
          mode: options.mode || "cors",
          credentials: options.credentials ?? "include",
          referrerPolicy: options.referrerPolicy || "no-referrer",
          headers,
          ...(options.body != null ? { body: options.body } : {}),
        });

        const text = await response.text().catch(() => "");
        const parsed = parseJsonText(text, null);
        emitCmDebugEvent(
          {
            phase: "cm-response",
            contextLabel: String(contextLabel || ""),
            method,
            url,
            attempt: attemptCounter,
            status: Number(response.status || 0),
            statusText: String(response.statusText || ""),
            responsePreview: truncateDebugText(text, 1600),
          },
          {
            flowId: String(debugMeta.flowId || "").trim(),
            context: debugMeta,
          }
        );
        if (response.ok) {
          return {
            url,
            parsed: parsed ?? text,
            text,
            status: Number(response.status || 0),
            lastModified: response.headers?.get("Last-Modified") || "",
          };
        }

        if (
          !tokenRefreshAttempted &&
          isCmTokenExpiredResponse(response.status, parsed, text)
        ) {
          tokenRefreshAttempted = true;
          const refreshedToken = await ensureCmApiAccessToken({ forceRefresh: true });
          if (String(refreshedToken || "").trim()) {
            headerVariants = buildHeaderVariants();
            headerIndex = -1;
            continue headersLoop;
          }
        }

        const message =
          firstNonEmptyString([
            parsed?.error?.code,
            parsed?.error?.message,
            typeof parsed?.error === "string" ? parsed.error : "",
            parsed?.message,
            normalizeHttpErrorMessage(text),
            response.statusText,
          ]) || response.statusText;
        lastError = new Error(`${contextLabel} failed (${response.status}): ${message}`);
        emitCmDebugEvent(
          {
            phase: "cm-request-failed",
            contextLabel: String(contextLabel || ""),
            method,
            url,
            attempt: attemptCounter,
            status: Number(response.status || 0),
            statusText: String(response.statusText || ""),
            error: message,
          },
          {
            flowId: String(debugMeta.flowId || "").trim(),
            context: debugMeta,
          }
        );
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        emitCmDebugEvent(
          {
            phase: "cm-request-error",
            contextLabel: String(contextLabel || ""),
            method,
            url,
            attempt: attemptCounter,
            error: lastError.message,
          },
          {
            flowId: String(debugMeta.flowId || "").trim(),
            context: debugMeta,
          }
        );
      }
    }
  }

  throw lastError || new Error(`${contextLabel} failed.`);
}

async function ensureCmTenantsCatalog(options = {}) {
  const forceRefresh = options.forceRefresh === true;
  const cachedCatalog =
    state.cmTenantsCatalog && Array.isArray(state.cmTenantsCatalog.tenants) ? state.cmTenantsCatalog : null;
  if (forceRefresh) {
    state.cmTenantsCatalog = null;
  }

  if (!forceRefresh && cachedCatalog) {
    return cachedCatalog;
  }

  if (!forceRefresh && state.cmTenantsCatalogPromise) {
    return state.cmTenantsCatalogPromise;
  }

  const loadPromise = (async () => {
    await ensureCmApiAccessToken();

    const queue = buildCmTenantEndpointCandidates();
    const attempted = new Set();
    let lastError = null;

    while (queue.length > 0) {
      const candidate = normalizeCmUrl(queue.shift());
      if (!candidate || attempted.has(candidate)) {
        continue;
      }
      attempted.add(candidate);

      try {
        const response = await fetchCmJsonWithAuthVariants([candidate], "CM tenants load", {
          debugMeta: {
            scope: "tenant-catalog",
            endpointUrl: candidate,
            requestorId: String(state.selectedRequestorId || ""),
            mvpd: String(state.selectedMvpdId || ""),
          },
        });
        const tenants = normalizeCmTenantsFromPayload(response.parsed, response.url);
        if (tenants.length > 0) {
          const catalog = {
            tenants,
            sourceUrl: response.url,
            fetchedAt: Date.now(),
          };
          state.cmTenantsCatalog = catalog;
          log("CM tenants catalog loaded", {
            sourceUrl: response.url,
            tenantCount: tenants.length,
          });
          return catalog;
        }

        collectCmUrlsFromValue(response.parsed, { maxDepth: 5 })
          .filter((url) => /tenant/i.test(String(url || "")))
          .forEach((url) => {
            const normalized = normalizeCmUrl(url);
            if (normalized && !attempted.has(normalized)) {
              queue.push(normalized);
            }
          });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (cachedCatalog && Array.isArray(cachedCatalog.tenants) && cachedCatalog.tenants.length > 0) {
      log("Using stale CM tenant catalog cache after refresh failure", {
        error: lastError instanceof Error ? lastError.message : String(lastError),
      });
      return cachedCatalog;
    }

    throw lastError || new Error("Unable to load CM tenant catalog.");
  })();

  state.cmTenantsCatalogPromise = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (state.cmTenantsCatalogPromise === loadPromise) {
      state.cmTenantsCatalogPromise = null;
    }
  }
}

async function ensureCmServiceForProgrammer(programmer, options = {}) {
  if (!programmer?.programmerId) {
    return null;
  }

  const forceRefresh = options.forceRefresh === true;
  if (forceRefresh) {
    state.cmServiceByProgrammerId.delete(programmer.programmerId);
    state.cmTenantsCatalog = null;
    state.cmTenantBundleByTenantKey.clear();
    state.cmTenantBundlePromiseByTenantKey.clear();
  }

  if (!forceRefresh && state.cmServiceByProgrammerId.has(programmer.programmerId)) {
    const cachedService = state.cmServiceByProgrammerId.get(programmer.programmerId);
    const cachedMatches = Array.isArray(cachedService?.matchedTenants) ? cachedService.matchedTenants : [];
    if (cachedMatches.length === 0) {
      const catalog = state.cmTenantsCatalog && Array.isArray(state.cmTenantsCatalog.tenants) ? state.cmTenantsCatalog : null;
      if (catalog && catalog.tenants.length > 0) {
        const rematchedTenants = findCmTenantMatchesForProgrammer(programmer, catalog.tenants);
        if (rematchedTenants.length > 0) {
          const refreshedService = {
            ...(cachedService && typeof cachedService === "object" ? cachedService : {}),
            matchedTenants: rematchedTenants,
            sourceUrl: String(catalog.sourceUrl || cachedService?.sourceUrl || ""),
            fetchedAt: Number(catalog.fetchedAt || cachedService?.fetchedAt || Date.now()),
            tenantCount: Number(catalog.tenants.length || cachedService?.tenantCount || rematchedTenants.length),
            tokenFingerprint: getCmAuthFingerprint(),
          };
          state.cmServiceByProgrammerId.set(programmer.programmerId, refreshedService);
          return refreshedService;
        }
      }
    }
    if (!shouldRetryCachedCmService(cachedService)) {
      return cachedService;
    }
  }

  if (!forceRefresh && state.cmServiceLoadPromiseByProgrammerId.has(programmer.programmerId)) {
    return state.cmServiceLoadPromiseByProgrammerId.get(programmer.programmerId);
  }

  const loadPromise = (async () => {
    let catalog = null;
    try {
      catalog = await ensureCmTenantsCatalog({ forceRefresh });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      log("CM tenants load failed", {
        programmerId: programmer.programmerId,
        error: reason,
      });
      const service = {
        matchedTenants: [],
        sourceUrl: "",
        fetchedAt: Date.now(),
        tenantCount: 0,
        tokenFingerprint: getCmAuthFingerprint(),
        loadError: reason,
      };
      state.cmServiceByProgrammerId.set(programmer.programmerId, service);
      return service;
    }

    const matchedTenants = findCmTenantMatchesForProgrammer(programmer, catalog?.tenants || []);
    const tokenFingerprint = getCmAuthFingerprint();
    if (matchedTenants.length === 0) {
      const topCandidates = (Array.isArray(catalog?.tenants) ? catalog.tenants : [])
        .map((tenant) => ({
          tenantId: tenant?.tenantId || "",
          tenantName: tenant?.tenantName || "",
          score: scoreCmTenantMatch(programmer, tenant),
        }))
        .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))
        .slice(0, 5);
      log("CM no tenant match for programmer", {
        programmerId: programmer.programmerId,
        programmerName: programmer.programmerName,
        topCandidates,
      });
      const service = {
        matchedTenants: [],
        sourceUrl: String(catalog?.sourceUrl || ""),
        fetchedAt: Number(catalog?.fetchedAt || Date.now()),
        tenantCount: Number(catalog?.tenants?.length || 0),
        tokenFingerprint,
      };
      state.cmServiceByProgrammerId.set(programmer.programmerId, service);
      return service;
    }

    const service = {
      matchedTenants,
      sourceUrl: String(catalog?.sourceUrl || ""),
      fetchedAt: Number(catalog?.fetchedAt || Date.now()),
      tenantCount: Number(catalog?.tenants?.length || 0),
      tokenFingerprint,
    };
    log("CM tenants matched for programmer", {
      programmerId: programmer.programmerId,
      programmerName: programmer.programmerName,
      matchedTenants: matchedTenants.map((tenant) => tenant?.tenantName || tenant?.tenantId).slice(0, 10),
    });
    state.cmServiceByProgrammerId.set(programmer.programmerId, service);
    return service;
  })();

  state.cmServiceLoadPromiseByProgrammerId.set(programmer.programmerId, loadPromise);
  try {
    return await loadPromise;
  } finally {
    if (state.cmServiceLoadPromiseByProgrammerId.get(programmer.programmerId) === loadPromise) {
      state.cmServiceLoadPromiseByProgrammerId.delete(programmer.programmerId);
    }
  }
}

function buildCmResourceUrlCandidates(kind, tenant, profileHarvest = null) {
  const tenantId = String(tenant?.tenantId || "").trim();
  const tenantLinks = Array.isArray(tenant?.links) ? tenant.links : [];
  const rawLinks = collectCmUrlsFromValue(tenant?.raw, { maxDepth: 5 });
  const kindValue = String(kind || "").trim().toLowerCase();

  if (kindValue === "applications" && tenantId) {
    return uniqueSorted([`${CM_CONFIG_BASE_URL}/maitai/applications?orgId=${encodeURIComponent(tenantId)}`]);
  }
  if (kindValue === "policies" && tenantId) {
    return uniqueSorted([`${CM_CONFIG_BASE_URL}/maitai/policy?orgId=${encodeURIComponent(tenantId)}`]);
  }
  if (kindValue === "tenant") {
    return uniqueSorted(
      [...tenantLinks, ...rawLinks, `${CM_CONFIG_BASE_URL}/core/tenants?orgId=${encodeURIComponent(CM_DEFAULT_TENANT_ORG_HINT)}`]
        .map((url) => normalizeCmUrl(url))
        .filter(Boolean)
    );
  }
  if (kindValue === "usage") {
    return uniqueSorted(
      buildCmUsageSeedRows(tenant, profileHarvest)
        .map((row) => String(row?.sourceUrl || "").trim())
        .filter(Boolean)
    );
  }

  const keywordByKind = {
    tenant: ["tenant"],
    applications: ["application", "apps"],
    policies: ["policy", "policies", "rule", "rules"],
    usage: ["usage", "cmu", "metric", "report"],
  };
  const keywordList = keywordByKind[kindValue] || [];
  const filteredLinks = uniqueSorted(
    [...tenantLinks, ...rawLinks].filter((url) => {
      if (kindValue === "tenant") {
        return /tenant/i.test(String(url || ""));
      }
      return keywordList.some((keyword) => String(url || "").toLowerCase().includes(keyword));
    })
  );

  const templateByKind = {
    tenant: CM_TENANT_DETAIL_PATH_TEMPLATES,
    applications: CM_APPLICATIONS_PATH_TEMPLATES,
    policies: CM_POLICIES_PATH_TEMPLATES,
    usage: CM_USAGE_PATH_TEMPLATES,
  };
  const templateUrls = buildCmTemplateUrls(tenantId, templateByKind[kindValue] || []);
  return uniqueSorted([...filteredLinks, ...templateUrls].filter(Boolean));
}

async function fetchCmTenantResource(kind, tenant, profileHarvest = null) {
  const kindValue = String(kind || "").trim().toLowerCase();
  const candidates = buildCmResourceUrlCandidates(kindValue, tenant, profileHarvest);
  if (candidates.length === 0) {
    return {
      kind: kindValue,
      url: "",
      payload: null,
      lastModified: "",
      rows: [],
      error: `No ${kindValue} endpoints were discovered for tenant "${tenant?.tenantName || tenant?.tenantId || "unknown"}".`,
    };
  }

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const response = await fetchCmJsonWithAuthVariants([candidate], `CM ${kindValue} load`, {
        debugMeta: {
          scope: kindValue,
          endpointUrl: candidate,
          tenantId: String(tenant?.tenantId || ""),
          tenantName: String(tenant?.tenantName || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      });
      const payload = response.parsed;
      const rows =
        kindValue === "tenant"
          ? payload && typeof payload === "object"
            ? [payload]
            : []
          : normalizeCmResourceListFromPayload(kindValue, payload, tenant, response.url);
      return {
        kind: kindValue,
        url: response.url,
        payload,
        lastModified: response.lastModified || "",
        rows,
        error: "",
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  return {
    kind: kindValue,
    url: "",
    payload: null,
    lastModified: "",
    rows: [],
    error: lastError ? lastError.message : `Unable to load CM ${kindValue}.`,
  };
}

async function loadCmTenantBundle(tenant, options = {}) {
  const forceRefresh = options.forceRefresh === true;
  const profileHarvest = options?.profileHarvest && typeof options.profileHarvest === "object" ? options.profileHarvest : null;
  const tenantCacheKey = cmGetTenantCacheKey(tenant);

  if (!forceRefresh && tenantCacheKey) {
    const cachedEntry = state.cmTenantBundleByTenantKey.get(tenantCacheKey);
    if (cachedEntry?.bundle) {
      const mergedTenant =
        tenant && typeof tenant === "object" ? { ...(cachedEntry.bundle.tenant || {}), ...tenant } : cachedEntry.bundle.tenant;
      const usageRows = buildCmUsageSeedRows(mergedTenant, profileHarvest);
      return {
        ...cachedEntry.bundle,
        tenant: mergedTenant,
        usage: {
          ...(cachedEntry.bundle.usage || {}),
          rows: usageRows,
        },
      };
    }
    if (state.cmTenantBundlePromiseByTenantKey.has(tenantCacheKey)) {
      return state.cmTenantBundlePromiseByTenantKey.get(tenantCacheKey);
    }
  }

  const loadPromise = (async () => {
    const [applications, policies] = await Promise.all([
      fetchCmTenantResource("applications", tenant, profileHarvest),
      fetchCmTenantResource("policies", tenant, profileHarvest),
    ]);
    const tenantDetail = {
      kind: "tenant",
      url: String(tenant?.sourceUrl || ""),
      payload: tenant?.raw && typeof tenant.raw === "object" ? tenant.raw : tenant || null,
      lastModified: "",
      rows: tenant?.raw && typeof tenant.raw === "object" ? [tenant.raw] : [],
      error: "",
    };
    const usage = {
      kind: "usage",
      url: "",
      payload: null,
      lastModified: "",
      rows: buildCmUsageSeedRows(tenant, profileHarvest),
      error: "",
    };
    const bundle = {
      tenant,
      tenantDetail,
      applications,
      policies,
      usage,
    };
    if (tenantCacheKey) {
      state.cmTenantBundleByTenantKey.set(tenantCacheKey, {
        fetchedAt: Date.now(),
        bundle,
      });
    }
    return bundle;
  })();

  if (tenantCacheKey) {
    state.cmTenantBundlePromiseByTenantKey.set(tenantCacheKey, loadPromise);
  }
  try {
    return await loadPromise;
  } catch (error) {
    if (!forceRefresh && tenantCacheKey) {
      const fallbackEntry = state.cmTenantBundleByTenantKey.get(tenantCacheKey);
      if (fallbackEntry?.bundle) {
        log("Using stale CM tenant bundle cache after refresh failure", {
          tenantId: tenant?.tenantId || "",
          tenantName: tenant?.tenantName || "",
          error: error instanceof Error ? error.message : String(error),
        });
        return fallbackEntry.bundle;
      }
    }
    throw error;
  } finally {
    if (tenantCacheKey && state.cmTenantBundlePromiseByTenantKey.get(tenantCacheKey) === loadPromise) {
      state.cmTenantBundlePromiseByTenantKey.delete(tenantCacheKey);
    }
  }
}

function cmNormalizeRowValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    if (value.every((item) => item == null || typeof item === "string" || typeof item === "number" || typeof item === "boolean")) {
      return value.map((item) => String(item ?? "")).join(", ");
    }
    return truncateDebugText(JSON.stringify(value), 1800);
  }
  if (typeof value === "object") {
    return truncateDebugText(JSON.stringify(value), 1800);
  }
  return String(value);
}

function cmFlattenObjectToRow(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { value: cmNormalizeRowValue(value) };
  }
  const row = {};
  Object.entries(value).forEach(([key, nested]) => {
    row[String(key || "")] = cmNormalizeRowValue(nested);
  });
  return row;
}

function cmRowsFromPayload(payload) {
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return [];
    }
    if (payload.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
      return payload.map((item) => cmFlattenObjectToRow(item));
    }
    return payload.map((item) => ({ value: cmNormalizeRowValue(item) }));
  }

  if (payload && typeof payload === "object") {
    const collectionCandidates = [
      payload.items,
      payload.data,
      payload.results,
      payload.records,
      payload.report,
      payload.runningStreams,
      payload.associatedAdvice,
      payload.obligations,
      payload.applications,
      payload.policies,
      payload.usage,
    ].filter((candidate) => Array.isArray(candidate));

    if (collectionCandidates.length > 0) {
      const largest = collectionCandidates.sort((left, right) => right.length - left.length)[0];
      return cmRowsFromPayload(largest);
    }
    return [cmFlattenObjectToRow(payload)];
  }

  if (payload == null || payload === "") {
    return [];
  }
  return [{ value: cmNormalizeRowValue(payload) }];
}

function cmColumnsFromPayload(payload) {
  const rows = cmRowsFromPayload(payload);
  if (rows.length === 0) {
    return [];
  }
  return uniqueSorted(
    Object.keys(rows[0] || {})
      .map((key) => String(key || "").trim())
      .filter((key) => key && !key.startsWith("__"))
  );
}

function cmColumnsFromRows(rows, preferredColumns = []) {
  const output = [];
  const seen = new Set();
  const pushColumn = (value) => {
    const key = String(value || "").trim();
    if (!key || key.startsWith("__") || seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(key);
  };

  (Array.isArray(preferredColumns) ? preferredColumns : []).forEach((column) => {
    pushColumn(column);
  });
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || typeof row !== "object") {
      return;
    }
    Object.keys(row).forEach((column) => {
      pushColumn(column);
    });
  });
  return output;
}

function cmNormalizeCsvCellValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function cmGetSortableValue(row, column) {
  const value = row?.[column];
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric) && String(value).trim() !== "") {
    return numeric;
  }
  return String(value == null ? "" : value).toLowerCase();
}

function cmSortRowsForCsv(rows, sortRule = null, columns = []) {
  const normalizedSort = decompNormalizeSortRule(sortRule);
  const fallbackColumn = Array.isArray(columns) && columns.length > 0 ? String(columns[0] || "").trim() : "";
  const sortColumn = String(normalizedSort?.col || fallbackColumn || "").trim();
  if (!sortColumn) {
    return [...rows];
  }
  const direction = String(normalizedSort?.dir || "DESC").toUpperCase() === "ASC" ? 1 : -1;
  return [...rows].sort((left, right) => {
    const leftValue = cmGetSortableValue(left, sortColumn);
    const rightValue = cmGetSortableValue(right, sortColumn);
    if (leftValue < rightValue) {
      return -1 * direction;
    }
    if (leftValue > rightValue) {
      return 1 * direction;
    }
    return 0;
  });
}

function cmBuildCsvFileName(cmState, record = null, fallbackCard = null) {
  const programmerSegment = sanitizeHarFileSegment(cmState?.programmer?.programmerId, "cm");
  const tenantSegment = sanitizeHarFileSegment(record?.tenantId || record?.tenantName, "tenant");
  const kindSegment = sanitizeHarFileSegment(record?.kind || fallbackCard?.zoomKey, "report");
  const entitySegment = sanitizeHarFileSegment(record?.title || fallbackCard?.cardId, "dataset");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `cm_${programmerSegment}_${tenantSegment}_${kindSegment}_${entitySegment}_${stamp}.csv`;
}

function cmDownloadRowsAsCsv(rows, options = {}) {
  const normalizedRows = (Array.isArray(rows) ? rows : [])
    .filter((row) => row && typeof row === "object")
    .map((row) => ({ ...row }));
  if (normalizedRows.length === 0) {
    return false;
  }

  const columns = cmColumnsFromRows(normalizedRows, options.columns);
  if (columns.length === 0) {
    return false;
  }
  const sortedRows = cmSortRowsForCsv(normalizedRows, options.sortRule, columns);
  const lines = [
    columns.map((column) => `"${String(column || "").replace(/"/g, '""')}"`).join(","),
    ...sortedRows.map((row) =>
      columns.map((column) => `"${cmNormalizeCsvCellValue(row[column]).replace(/"/g, '""')}"`).join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = String(options.fileName || "cm-report.csv");
  anchor.click();
  URL.revokeObjectURL(blobUrl);
  return true;
}

async function cmDownloadCsvForCard(cmState, record, card, sortRule, requestToken) {
  const normalizedCard = card && typeof card === "object" ? card : {};
  let rows = Array.isArray(normalizedCard.rows) ? normalizedCard.rows : [];
  let columns = Array.isArray(normalizedCard.columns) ? normalizedCard.columns : [];

  if (rows.length === 0 && record?.payload != null) {
    rows = cmRowsFromPayload(record.payload);
    columns = Array.isArray(record?.columns) && record.columns.length > 0 ? record.columns : cmColumnsFromPayload(record.payload);
  }

  if (rows.length === 0 && record && String(record?.kind || "").toLowerCase() !== "cmv2-op") {
    const requestUrl = String(record.requestUrl || record.endpointUrl || "").trim();
    if (requestUrl) {
      const response = await fetchCmJsonWithAuthVariants([requestUrl], `CM ${record.kind || "report"} CSV`, {
        debugMeta: {
          scope: `cm-csv-${String(record.kind || "report")}`,
          endpointUrl: requestUrl,
          cardId: String(normalizedCard?.cardId || record?.cardId || ""),
          programmerId: String(cmState?.programmer?.programmerId || ""),
          requestorId: String(state.selectedRequestorId || ""),
          mvpd: String(state.selectedMvpdId || ""),
        },
      });
      if (!isCmServiceRequestActive(cmState.section, requestToken, cmState.programmer?.programmerId)) {
        return { ok: false, skipped: true, error: "CM controller is no longer active for the selected media company." };
      }
      record.payload = response.parsed;
      record.lastModified = String(response.lastModified || record.lastModified || "");
      rows = cmRowsFromPayload(record.payload);
      columns = cmColumnsFromPayload(record.payload);
      record.columns = columns;
    }
  }

  if (rows.length === 0) {
    return { ok: false, error: "No CM rows are available to export as CSV." };
  }

  const fileName = cmBuildCsvFileName(cmState, record, normalizedCard);
  const started = cmDownloadRowsAsCsv(rows, {
    columns,
    sortRule,
    fileName,
  });
  if (!started) {
    return { ok: false, error: "Unable to build CM CSV from the current report rows." };
  }
  return { ok: true, fileName };
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

function isExperienceCloudAuthResponseUrl(url) {
  const value = String(url || "").trim();
  if (!value) {
    return false;
  }
  try {
    const parsed = new URL(value);
    const host = String(parsed.hostname || "").toLowerCase();
    if (
      host === "auth.services.adobe.com" ||
      host.endsWith(".auth.services.adobe.com") ||
      host === "idg.adobe.com" ||
      host.endsWith(".idg.adobe.com")
    ) {
      return true;
    }
    if (host === "ims-na1.adobelogin.com" || host.endsWith(".adobelogin.com")) {
      return parsed.pathname.startsWith("/ims/authorize") || parsed.pathname.startsWith("/ims/adobeid/");
    }
  } catch {
    return false;
  }
  return false;
}

function responseLooksLikeExperienceCloudSignIn(response, responseBody = "") {
  const status = Number(response?.status || 0);
  const responseUrl = String(response?.url || "").trim();
  if (response?.redirected && isExperienceCloudAuthResponseUrl(responseUrl)) {
    return true;
  }
  if (isExperienceCloudAuthResponseUrl(responseUrl)) {
    return true;
  }

  const contentType = String(response?.headers?.get("content-type") || "").toLowerCase();
  const body = String(responseBody || "").toLowerCase();
  if (status === 401 || status === 403) {
    const authHeader = String(response?.headers?.get("www-authenticate") || "").toLowerCase();
    if (
      body.includes("invalid_sso_info") ||
      body.includes("session cookie is null") ||
      body.includes("session cookie") ||
      body.includes("id=\"adobeid_signin\"") ||
      body.includes("flow_type=token") ||
      authHeader.includes("adobeid") ||
      authHeader.includes("login") ||
      authHeader.includes("invalid_sso_info")
    ) {
      return true;
    }
  }

  if (!contentType.includes("text/html")) {
    return false;
  }

  return (
    body.includes("auth.services.adobe.com") ||
    body.includes("/signin/v2/tokens") ||
    body.includes("flow_type=token") ||
    body.includes("id=\"adobeid_signin\"") ||
    body.includes("credential=sso")
  );
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

        const responseText = await response.text().catch(() => "");
        if (responseLooksLikeExperienceCloudSignIn(response, responseText)) {
          denied = true;
          lastError = createProgrammersError(
            `Media company access denied (${response.status || 0})`,
            "PROGRAMMERS_ACCESS_DENIED"
          );
          continue;
        }

        if (!response.ok) {
          lastError = createProgrammersError(
            `Endpoint ${endpoint} failed (${response.status}): ${responseText || response.statusText}`,
            "PROGRAMMERS_ENDPOINT_FAILED"
          );
          continue;
        }

        const payload = parseJsonText(responseText, null);
        if (payload === null) {
          lastError = createProgrammersError(
            `Endpoint ${endpoint} returned non-JSON payload (${response.status}).`,
            "PROGRAMMERS_ENDPOINT_FAILED"
          );
          continue;
        }
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
  state.restV2ProfileHarvestBySelectionKey.clear();
  state.restV2ProfileHarvestByProgrammerId.clear();
  state.restV2ProfileHarvestBucketByProgrammerId.clear();
  state.restV2ProfileHarvestLast = null;
  state.cmServiceByProgrammerId.clear();
  state.cmServiceLoadPromiseByProgrammerId.clear();
  state.cmTenantsCatalog = null;
  state.cmTenantsCatalogPromise = null;
  state.cmAuthBootstrapPromise = null;
  state.cmAuthBootstrapLastAttemptAt = 0;
  state.cmTenantBundleByTenantKey.clear();
  state.cmTenantBundlePromiseByTenantKey.clear();
  state.premiumSectionCollapsedByKey.clear();
  state.premiumPanelRequestToken = 0;
  state.restV2PrewarmedAppsByProgrammerId.clear();
  clearRestV2PreparedLoginState();
  populateMediaCompanySelect();
  prefetchCmTenantsCatalogInBackground("programmer-entities");
}

function createCookieSessionLoginData() {
  return {
    accessToken: "",
    expiresAt: 0,
    tokenType: "bearer",
    scope: "",
    idToken: "",
    refreshToken: "",
    imsSession: null,
    sessionKeys: null,
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
        writePersistedAvatarCandidate(state.loginData, {
          sourceUrl: state.loginData.imageUrl || "",
          resolvedUrl: state.loginData.imageUrl || "",
        });
      }
    } catch {
      // Ignore cookie-profile lookup errors.
    }

    const cookieSessionData = {
      ...state.loginData,
      imsSession: mergeImsSessionSnapshots(
        deriveImsSessionSnapshotFromToken(state.loginData?.accessToken || ""),
        state.loginData?.imsSession && typeof state.loginData.imsSession === "object" ? state.loginData.imsSession : null
      ),
    };
    cookieSessionData.sessionKeys = buildSessionKeySnapshot(cookieSessionData);
    state.loginData = cookieSessionData;

    state.sessionReady = true;
    state.restricted = false;
    state.sessionMonitorSuppressed = false;
    state.sessionMonitorConsecutiveInactiveDetections = 0;
    state.sessionMonitorInactivityGuardUntil = Date.now() + IMS_SESSION_MONITOR_INACTIVITY_GUARD_MS;
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
        const mergedCookieSession = {
          ...state.loginData,
          profile: mergedProfile,
          imageUrl: resolveLoginImageUrl({
            ...state.loginData,
            profile: mergedProfile,
          }),
        };
        mergedCookieSession.sessionKeys = buildSessionKeySnapshot(mergedCookieSession);
        state.loginData = mergedCookieSession;
        writePersistedAvatarCandidate(state.loginData, {
          sourceUrl: state.loginData.imageUrl || "",
          resolvedUrl: state.loginData.imageUrl || "",
        });
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
      ...buildLoginSessionPayloadFromAuth(enforced.loginData, hydratedProfile, hydratedImageUrl),
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
    hydrated.sessionKeys = buildSessionKeySnapshot(hydrated);

    state.loginData = hydrated;
    writePersistedAvatarCandidate(hydrated, {
      sourceUrl: hydrated.imageUrl || "",
      resolvedUrl: hydrated.imageUrl || "",
    });
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
  els.authBtn.textContent = "";
  els.authBtn.setAttribute("aria-label", `${getProfileDisplayName(resolveLoginProfile(state.loginData) || {})} account menu`);
  if (!state.busy) {
    els.authBtn.title = "Account menu";
  }
  renderAvatarMenu();
  void ensureResolvedAvatarUrl();
}

async function signInInteractive() {
  state.sessionMonitorSuppressed = false;
  setBusy(true, "Signing in...");
  setStatus("", "info");

  try {
    const authData = await startLogin({ interactive: true, allowFallback: true });
    resetAvatarStateForInteractiveLogin();
    const profile = await resolveProfileAfterLogin(authData);
    const imageUrl = resolveAuthAvatarSeed(authData, profile);
    const activated = await activateSession(buildLoginSessionPayloadFromAuth(authData, profile, imageUrl), "interactive");

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
  state.sessionMonitorSuppressed = false;
  setBusy(true, "Refreshing session...");
  setStatus("", "info");

  try {
    let authData;
    let usedInteractiveLogin = false;
    try {
      authData = await startLogin({ interactive: false, allowFallback: false });
    } catch {
      authData = await startLogin({ interactive: true, allowFallback: true });
      usedInteractiveLogin = true;
    }

    if (usedInteractiveLogin) {
      resetAvatarStateForInteractiveLogin();
    }

    const profile = await resolveProfileAfterLogin(authData);
    const imageUrl = resolveAuthAvatarSeed(authData, profile);
    const activated = await activateSession(
      buildLoginSessionPayloadFromAuth(authData, profile, imageUrl),
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
        resetAvatarStateForInteractiveLogin();
        const profile = await resolveProfileAfterLogin(authData);
        const imageUrl = resolveAuthAvatarSeed(authData, profile);
        const activated = await activateSession(
          buildLoginSessionPayloadFromAuth(authData, profile, imageUrl),
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

  state.sessionMonitorSuppressed = false;
  state.isBootstrapping = true;
  setBusy(true, "Checking session...");
  setStatus("", "info");

  try {
    const stored = await loadStoredLoginData();
    if (stored) {
      try {
        const profile = await fetchProfile(stored.accessToken);
        const storedSessionPayload = {
          ...buildLoginSessionPayloadFromAuth(stored, profile, stored.imageUrl),
          adobePassOrg: stored.adobePassOrg || null,
          sessionKeys: buildSessionKeySnapshot({
            ...stored,
            profile,
          }),
        };
        const activated = await activateSession(
          storedSessionPayload,
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
    const cmState = getActiveCmState();
    if (cmState) {
      cmBroadcastControllerState(cmState);
    }
  });

  els.mvpdSelect.addEventListener("change", (event) => {
    state.selectedMvpdId = String(event.target.value || "");
    refreshRestV2LoginPanels();
    const decompState = getActiveDecompState();
    if (decompState) {
      decompBroadcastControllerState(decompState);
      syncDecompRecordingControls(decompState);
    }
    const cmState = getActiveCmState();
    if (cmState) {
      cmBroadcastControllerState(cmState);
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

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      void runExperienceCloudSessionMonitorTick("visibility");
    }
  });

  window.addEventListener("focus", () => {
    void runExperienceCloudSessionMonitorTick("focus");
  });

  window.addEventListener(
    "pagehide",
    () => {
      stopExperienceCloudSessionMonitor();
    },
    { once: true }
  );
}

function init() {
  ensureDecompRuntimeListener();
  ensureDecompWorkspaceTabWatcher();
  ensureCmRuntimeListener();
  ensureCmWorkspaceTabWatcher();
  void renderBuildInfo();
  resetWorkflowForLoggedOut();
  registerEventHandlers();
  render();
  void bootstrapSession();
  startExperienceCloudSessionMonitor();
}

init();
