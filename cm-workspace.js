const CM_MESSAGE_TYPE = "underpar:cm";
const CM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
const WORKSPACE_TEARSHEET_RUNTIME_PATH = "cm-workspace.js";
const WORKSPACE_TEARSHEET_TEMPLATE_PATH = "cm-workspace.html";
const WORKSPACE_TEARSHEET_PAYLOAD_ID = "clickcmuws-payload";
const CM_WORKSPACE_RUNTIME_TOKEN_INPUT_NAME = "access_token";
const CM_WORKSPACE_RUNTIME_CLIENT_IDS_INPUT_NAME = "cm_client_ids";
const CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME = "cm_user_id";
const CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME = "cm_scope";
const CM_WORKSPACE_RUNTIME_EXPERIENCE_TOKEN_INPUT_NAME = "experience_cloud_access_token";
const CM_WORKSPACE_RUNTIME_EXPERIENCE_CLIENT_IDS_INPUT_NAME = "experience_cloud_client_ids";
const CM_WORKSPACE_RUNTIME_EXPERIENCE_USER_ID_INPUT_NAME = "experience_cloud_user_id";
const CM_WORKSPACE_RUNTIME_EXPERIENCE_SCOPE_INPUT_NAME = "experience_cloud_scope";
const CM_WORKSPACE_PRIMARY_CLIENT_ID = "cm-console-ui";
const CM_WORKSPACE_EXPERIENCE_CLIENT_ID = "exc_app";
const CM_WORKSPACE_IMS_VALIDATE_TOKEN_URL = "https://ims-na1.adobelogin.com/ims/validate_token/v1?jslVersion=underpar-clickcmuws";
const CM_WORKSPACE_IMS_CHECK_TOKEN_URL = "https://adobeid-na1.services.adobe.com/ims/check/v6/token";
const UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE = "underpar:networkActivity";
let CM_WORKSPACE_CONSOLE_ORIGIN = "https://experience.adobe.com";
let CM_WORKSPACE_CONSOLE_REFERER = `${CM_WORKSPACE_CONSOLE_ORIGIN}/`;
const CM_WORKSPACE_CONFIG_BASE_URL = "https://config.adobeprimetime.com";
const CM_WORKSPACE_REPORTS_BASE_URL = "https://cm-reports.adobeprimetime.com";
const CM_WORKSPACE_REPORTS_ORIGIN = "https://cdn.experience.adobe.net";
const CM_WORKSPACE_REPORTS_REFERER = `${CM_WORKSPACE_REPORTS_ORIGIN}/`;
const CM_WORKSPACE_IMS_DEFAULT_SCOPE =
  "AdobeID,openid,dma_group_mapping,read_organizations,additional_info.projectedProductContext";
const CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS = 45 * 1000;
const CM_WORKSPACE_FETCH_TIMEOUT_MS = 45 * 1000;
const CM_WORKSPACE_FALLBACK_BASE_URL = "https://streams-stage.adobeprimetime.com";
const CM_WORKSPACE_EXPORT_FILE_SYSTEM_QUERY_KEYS = new Set(["format", "limit"]);
const CM_CARD_EDITABLE_QUERY_KEYS = new Set(["start", "end"]);
const CM_QUERY_CONTEXT_HIDDEN_KEYS = new Set(["metrics", ...CM_WORKSPACE_EXPORT_FILE_SYSTEM_QUERY_KEYS]);
let PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL =
  "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers";
const WORKSPACE_LOCK_MESSAGE_SUFFIX =
  "does not have Concurrency Monitoring access. Confirm CM tenant mapping for this media company.";
const UNDERPAR_ENVIRONMENT_REGISTRY = globalThis.UnderParEnvironment || null;
const DEFAULT_ADOBEPASS_ENVIRONMENT =
  UNDERPAR_ENVIRONMENT_REGISTRY?.getDefaultEnvironment?.() || {
    key: "release-production",
    route: "release-production",
    consoleBase: "https://console.auth.adobe.com",
    cmConsoleOrigin: "https://experience.adobe.com",
    mgmtBase: "https://mgmt.auth.adobe.com",
    consoleProgrammersUrl:
      "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers",
  };
const BLONDIE_BUTTON_STATES = new Set(["inactive", "ready", "active", "ack"]);
const BLONDIE_BUTTON_ACK_RESET_MS = 2000;
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
const CM_METRIC_COLUMNS = new Set([
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
  "decision-attempts",
  "decision-successful",
  "decision-failed",
  "decision-media-tokens",
  "users",
  "active-users",
  "active-sessions",
  "started-sessions",
  "completed-sessions",
  "failed-attempts",
  "dismissed-sessions",
  "killed-sessions",
  "duration-0-15",
  "duration-15-30",
  "duration-30-60",
  "duration-60-120",
  "duration-2h-4h",
  "duration-4h-8h",
  "duration-8h-16h",
  "duration-16h-1d",
  "duration-1d-3d",
  "duration-3d-7d",
  "duration-1w-1m",
  "duration-over-1m",
  "bstreams-15",
  "bstreams-30",
  "bstreams-45",
  "bstreams-60",
  "bstreams-75",
  "bstreams-90",
  "bstreams-105",
  "bstreams-120",
]);
const CM_DATE_DIMENSION_KEYS = new Set(["year", "month", "day", "hour", "minute", "second", "date", "time", "timestamp"]);
const CM_FILTER_BLOCKED_COLUMNS = new Set([
  "media-company",
  "v2",
  "view",
]);
const CM_CMU_NON_DIMENSION_PATH_SEGMENTS = new Set([
  "cmu",
  "v2",
  "summary",
  "concurrency",
  "report",
  "reports",
  "usage",
]);
const CM_TENANT_QUERY_PARAM_KEYS = ["tenant", "tenant_id", "tenant-id"];
const CM_WORKSPACE_BROWSER_CONSOLE_TRACE_ENABLED = true;
const CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_DEPTH = 4;
const CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_ITEMS = 24;
const CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_KEYS = 40;
const CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_STRING = 1000;

function summarizeCmWorkspaceConsoleString(value, keyName = "") {
  const raw = String(value ?? "");
  if (!raw) {
    return "";
  }
  const normalizedKey = String(keyName || "").trim().toLowerCase();
  const normalizedToken = normalizeBearerTokenValue(raw);
  if (normalizedToken && normalizedToken.split(".").length === 3) {
    return `<redacted-jwt:${normalizedToken.slice(-12)}>`;
  }
  if (
    normalizedKey.includes("token") ||
    normalizedKey.includes("secret") ||
    normalizedKey.includes("password") ||
    normalizedKey === "authorization" ||
    normalizedKey === "cookie" ||
    normalizedKey === "set-cookie"
  ) {
    return "<redacted>";
  }
  return raw.length > CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_STRING
    ? `${raw.slice(0, CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_STRING)}... [truncated ${raw.length - CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_STRING} chars]`
    : raw;
}

function sanitizeCmWorkspaceConsoleTraceValue(value, options = {}) {
  const depth = Number(options.depth || 0);
  const keyName = String(options.keyName || "").trim();
  const seen = options.seen instanceof WeakSet ? options.seen : new WeakSet();

  if (value == null) {
    return value;
  }
  if (typeof value === "string") {
    return summarizeCmWorkspaceConsoleString(value, keyName);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Error) {
    return {
      name: String(value.name || "Error"),
      message: summarizeCmWorkspaceConsoleString(value.message || "", keyName || "message"),
      stack: summarizeCmWorkspaceConsoleString(String(value.stack || ""), "stack"),
    };
  }
  if (typeof Headers !== "undefined" && value instanceof Headers) {
    const headers = {};
    value.forEach((headerValue, headerName) => {
      headers[headerName] = summarizeCmWorkspaceConsoleString(headerValue, headerName);
    });
    return sanitizeCmWorkspaceConsoleTraceValue(headers, {
      depth: depth + 1,
      keyName,
      seen,
    });
  }
  if (typeof value !== "object") {
    return summarizeCmWorkspaceConsoleString(String(value), keyName);
  }
  if (depth >= CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_DEPTH) {
    return Array.isArray(value) ? `[array:${value.length}]` : `[${String(value?.constructor?.name || "object")}]`;
  }
  if (seen.has(value)) {
    return "[circular]";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    const output = value
      .slice(0, CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_ITEMS)
      .map((entry) =>
        sanitizeCmWorkspaceConsoleTraceValue(entry, {
          depth: depth + 1,
          keyName,
          seen,
        })
      );
    if (value.length > CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_ITEMS) {
      output.push(`[+${value.length - CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_ITEMS} more]`);
    }
    return output;
  }

  const output = {};
  const entries = Object.entries(value);
  entries.slice(0, CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_KEYS).forEach(([entryKey, entryValue]) => {
    output[entryKey] = sanitizeCmWorkspaceConsoleTraceValue(entryValue, {
      depth: depth + 1,
      keyName: entryKey,
      seen,
    });
  });
  if (entries.length > CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_KEYS) {
    output.__truncatedKeys = entries.length - CM_WORKSPACE_BROWSER_CONSOLE_TRACE_MAX_KEYS;
  }
  return output;
}

function emitCmWorkspaceConsoleTrace(channel = "event", message = "", details = null, options = {}) {
  if (CM_WORKSPACE_BROWSER_CONSOLE_TRACE_ENABLED !== true) {
    return;
  }
  const consoleMethodName = ["log", "info", "warn", "error", "debug"].includes(String(options.level || "").trim())
    ? String(options.level || "").trim()
    : "log";
  const consoleMethod = typeof console?.[consoleMethodName] === "function" ? console[consoleMethodName].bind(console) : console.log.bind(console);
  const label = `[UnderPAR CM Workspace][${String(channel || "event").trim() || "event"}] ${String(message || "").trim() || "(no message)"}`;
  if (details == null) {
    consoleMethod(label);
    return;
  }
  consoleMethod(label, sanitizeCmWorkspaceConsoleTraceValue(details));
}

const state = {
  windowId: 0,
  controllerOnline: false,
  adobePassEnvironment: { ...DEFAULT_ADOBEPASS_ENVIRONMENT },
  slackReady: false,
  slackUserId: "",
  slackUserName: "",
  slackShareTargets: [],
  cmAvailable: null,
  cmAvailabilityResolved: false,
  cmContainerVisible: null,
  tenantScope: "",
  programmerId: "",
  programmerName: "",
  programmerHydrationReady: false,
  premiumPanelRequestToken: 0,
  workspaceContextKey: "",
  requestorIds: [],
  mvpdIds: [],
  profileHarvest: null,
  profileHarvestList: [],
  controllerStateVersion: 0,
  controllerStateUpdatedAt: 0,
  cardsById: new Map(),
  batchRunning: false,
  workspaceLocked: false,
  nonCmMode: false,
  programmerSwitchLoading: false,
  programmerSwitchLoadingKey: "",
  pendingAutoRerunProgrammerKey: "",
  autoRerunInFlightProgrammerKey: "",
  pendingAutoRerunCards: [],
  workspaceReplayCards: [],
  pendingWorkspaceDeeplink: null,
  pendingWorkspaceDeeplinkConsuming: false,
};

const els = {
  appRoot: document.getElementById("workspace-app-root"),
  stylesheet: document.getElementById("workspace-style-link"),
  nonCmScreen: document.getElementById("workspace-non-cm-screen"),
  nonCmHeadline: document.getElementById("workspace-non-cm-headline"),
  nonCmNote: document.getElementById("workspace-non-cm-note"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  lockBanner: document.getElementById("workspace-lock-banner"),
  lockMessage: document.getElementById("workspace-lock-message"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
  makeClickCmuButton: document.getElementById("workspace-make-clickcmu"),
  makeClickCmuWorkspaceButton: document.getElementById("workspace-make-clickcmuws"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
  pageEnvBadge: document.getElementById("page-env-badge"),
  pageEnvBadgeValue: document.getElementById("page-env-badge-value"),
};

let workspaceStylesheetTextCache = "";
let workspaceTearsheetRuntimeTextCache = "";
let workspaceTearsheetTemplateTextCache = "";
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

function parseWorkspaceExportPayload() {
  const payloadNode = document.getElementById(WORKSPACE_TEARSHEET_PAYLOAD_ID);
  if (!payloadNode) {
    return null;
  }
  try {
    const parsed = JSON.parse(String(payloadNode.textContent || "{}"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const workspaceExportPayload = parseWorkspaceExportPayload();
const IS_CM_WORKSPACE_TEARSHEET_RUNTIME = Boolean(workspaceExportPayload);

function getWorkspaceEnvironmentRegistry() {
  return globalThis.UnderParEnvironment || UNDERPAR_ENVIRONMENT_REGISTRY || null;
}

function resolveWorkspaceAdobePassEnvironment(value = null) {
  const embedded =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : workspaceExportPayload?.adobePassEnvironment &&
          typeof workspaceExportPayload.adobePassEnvironment === "object"
        ? workspaceExportPayload.adobePassEnvironment
        : null;
  if (embedded) {
    return {
      ...DEFAULT_ADOBEPASS_ENVIRONMENT,
      ...embedded,
    };
  }
  const registry = getWorkspaceEnvironmentRegistry();
  if (registry?.getEnvironment) {
    return registry.getEnvironment(value || DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  }
  return { ...DEFAULT_ADOBEPASS_ENVIRONMENT };
}

function applyWorkspaceAdobePassEnvironment(environment = null) {
  const resolved = resolveWorkspaceAdobePassEnvironment(environment);
  CM_WORKSPACE_CONSOLE_ORIGIN = String(resolved.cmConsoleOrigin || "https://experience.adobe.com");
  CM_WORKSPACE_CONSOLE_REFERER = `${CM_WORKSPACE_CONSOLE_ORIGIN.replace(/\/+$/, "")}/`;
  PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL = String(
    resolved.consoleProgrammersUrl ||
      `https://experience.adobe.com/#/@adobepass/pass/authentication/${resolved.route || "release-production"}/programmers`
  );
  state.adobePassEnvironment = resolved;
  renderWorkspaceEnvironmentBadge();
  return resolved;
}

function buildWorkspaceDeeplinkRequestPath(pathname = "", search = "", options = {}) {
  const allowBarePath = options?.allowBarePath === true;
  let normalizedPath = String(pathname || "").trim();
  if (!normalizedPath) {
    return "";
  }
  if (!normalizedPath.startsWith("/")) {
    if (!allowBarePath) {
      return "";
    }
    normalizedPath = `/${normalizedPath.replace(/^\/+/, "")}`;
  }
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  if (isCmuUsageRequestUrl(normalizedPath) || workspaceUsagePathRequiresTenantScope(normalizedPath)) {
    CM_TENANT_QUERY_PARAM_KEYS.forEach((key) => params.delete(key));
  }
  if (/^\/maitai\/(?:applications|policy)(?:\/|$)/i.test(normalizedPath)) {
    params.delete("orgId");
    params.delete("orgid");
  }
  const normalizedSearch = params.toString();
  return `${normalizedPath}${normalizedSearch ? `?${normalizedSearch}` : ""}`;
}

function normalizeWorkspaceDeeplinkRequestPath(rawValue = "") {
  const normalized = String(rawValue || "").trim();
  if (!normalized) {
    return "";
  }
  const hasAbsoluteScheme = /^[a-z][a-z\d+.-]*:/i.test(normalized);
  try {
    const parsed = hasAbsoluteScheme ? new URL(normalized) : new URL(normalized, CM_WORKSPACE_REPORTS_BASE_URL);
    return buildWorkspaceDeeplinkRequestPath(String(parsed.pathname || ""), String(parsed.search || ""), {
      allowBarePath: !hasAbsoluteScheme,
    });
  } catch (_error) {
    const withoutHash = normalized.split("#")[0] || "";
    const [pathPart, queryPart = ""] = withoutHash.split("?");
    return buildWorkspaceDeeplinkRequestPath(pathPart, queryPart ? `?${queryPart}` : "", {
      allowBarePath: !hasAbsoluteScheme,
    });
  }
}

function parseWorkspaceDeeplinkPayloadFromLocation() {
  const query = String(window.location.hash || "").startsWith("#")
    ? window.location.hash.slice(1)
    : String(window.location.search || "").replace(/^\?/, "");
  if (!query) {
    return null;
  }
  const params = new URLSearchParams(query);
  const requestPath = normalizeWorkspaceDeeplinkRequestPath(
    params.get("requestPath") || params.get("requestUrl") || params.get("baseRequestUrl") || params.get("endpointUrl") || ""
  );
  if (!requestPath) {
    return null;
  }
  return {
    requestPath,
    displayNodeLabel: String(params.get("displayNodeLabel") || "").trim(),
    source: String(params.get("source") || "blondie-button").trim() || "blondie-button",
    createdAt: Math.max(0, Number(params.get("createdAt") || Date.now() || 0)),
  };
}

function clearWorkspaceDeeplinkFromLocation() {
  try {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = "";
    [
      "requestPath",
      "requestUrl",
      "endpointUrl",
      "baseRequestUrl",
      "displayNodeLabel",
      "programmerId",
      "programmerName",
      "tenantId",
      "tenantName",
      "zoomKey",
      "environmentKey",
      "environmentLabel",
      "source",
      "createdAt",
    ].forEach((key) => nextUrl.searchParams.delete(key));
    const nextHref = `${String(nextUrl.pathname || "")}${String(nextUrl.search || "")}`;
    window.history.replaceState(null, document.title, nextHref || window.location.pathname);
  } catch (_error) {
    // Ignore history cleanup failures.
  }
}

function resolveWorkspaceDeeplinkBaseUrlForPath(requestPath = "") {
  const normalizedPath = String(requestPath || "")
    .trim()
    .split(/[?#]/, 1)[0];
  if (/^\/maitai(?:\/|$)/i.test(normalizedPath)) {
    return CM_WORKSPACE_CONFIG_BASE_URL;
  }
  return (
    String(state.adobePassEnvironment?.cmReportsBase || DEFAULT_ADOBEPASS_ENVIRONMENT.cmReportsBase || CM_WORKSPACE_REPORTS_BASE_URL).trim() ||
    CM_WORKSPACE_REPORTS_BASE_URL
  );
}

function buildWorkspaceDeeplinkAbsoluteRequestUrl(requestPath = "") {
  const normalizedPath = normalizeWorkspaceDeeplinkRequestPath(requestPath);
  if (!normalizedPath) {
    return "";
  }
  try {
    return new URL(normalizedPath, resolveWorkspaceDeeplinkBaseUrlForPath(normalizedPath)).toString();
  } catch (_error) {
    return "";
  }
}

function buildWorkspaceDeeplinkAbsoluteEndpointUrl(requestPath = "") {
  const requestUrl = buildWorkspaceDeeplinkAbsoluteRequestUrl(requestPath);
  if (!requestUrl) {
    return "";
  }
  try {
    const parsed = new URL(requestUrl);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch (_error) {
    return String(requestUrl || "").split(/[?#]/, 1)[0];
  }
}

async function initializeWorkspaceAdobePassEnvironment() {
  if (workspaceExportPayload?.adobePassEnvironment && typeof workspaceExportPayload.adobePassEnvironment === "object") {
    return applyWorkspaceAdobePassEnvironment(workspaceExportPayload.adobePassEnvironment);
  }
  const registry = getWorkspaceEnvironmentRegistry();
  const environment = registry?.getStoredEnvironment
    ? await registry.getStoredEnvironment()
    : resolveWorkspaceAdobePassEnvironment(DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  return applyWorkspaceAdobePassEnvironment(environment);
}

function buildWorkspaceEnvironmentTooltip(environment) {
  const resolved =
    environment && typeof environment === "object"
      ? environment
      : resolveWorkspaceAdobePassEnvironment(DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  const registry = getWorkspaceEnvironmentRegistry();
  if (registry?.buildEnvironmentBadgeTooltip) {
    return String(registry.buildEnvironmentBadgeTooltip(resolved, "cm") || "").trim();
  }
  const route = String(resolved.route || DEFAULT_ADOBEPASS_ENVIRONMENT.route || "release-production").trim() || "release-production";
  const label = String(resolved.label || (route === "release-staging" ? "Staging" : "Production")).trim() || "Production";
  const cmReportsBase = String(
    resolved.cmReportsBase || DEFAULT_ADOBEPASS_ENVIRONMENT.cmReportsBase || "https://cm-reports.adobeprimetime.com"
  ).trim();
  return [`Environment : ${label}`, `Concurrency Monitoring : ${cmReportsBase}`].join("\n").trim();
}

function renderWorkspaceEnvironmentBadge() {
  if (!els.pageEnvBadge || !els.pageEnvBadgeValue) {
    return;
  }
  const environment =
    state.adobePassEnvironment && typeof state.adobePassEnvironment === "object"
      ? state.adobePassEnvironment
      : resolveWorkspaceAdobePassEnvironment(DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  const label = String(environment?.label || "").trim() || "Production";
  const title = buildWorkspaceEnvironmentTooltip(environment) || label;
  els.pageEnvBadgeValue.textContent = "";
  els.pageEnvBadgeValue.setAttribute("aria-hidden", "true");
  els.pageEnvBadge.title = title;
  els.pageEnvBadge.setAttribute("aria-label", title);
}

function readHiddenInputValue(name) {
  const normalizedName = String(name || "").trim();
  if (!normalizedName || !document?.body) {
    return "";
  }
  const input = document.body.querySelector(`input[name="${normalizedName}"]`);
  return String(input?.value || "").trim();
}

function upsertBodyHiddenInput(doc, name, value) {
  if (!doc || !doc.body) {
    return;
  }
  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    return;
  }
  let input = doc.body.querySelector(`input[name="${normalizedName}"]`);
  if (!input) {
    input = doc.createElement("input");
    input.type = "hidden";
    input.name = normalizedName;
    doc.body.insertBefore(input, doc.body.firstChild);
  }
  input.value = String(value || "");
}

function parseJsonArray(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const cmWorkspaceRuntimeAuth = {
  accessToken: readHiddenInputValue(CM_WORKSPACE_RUNTIME_TOKEN_INPUT_NAME),
  clientIds: parseJsonArray(readHiddenInputValue(CM_WORKSPACE_RUNTIME_CLIENT_IDS_INPUT_NAME))
    .map((value) => String(value || "").trim())
    .filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_PRIMARY_CLIENT_ID),
  userId: readHiddenInputValue(CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME),
  scope: readHiddenInputValue(CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME) || CM_WORKSPACE_IMS_DEFAULT_SCOPE,
  experienceCloudAccessToken: readHiddenInputValue(CM_WORKSPACE_RUNTIME_EXPERIENCE_TOKEN_INPUT_NAME),
  experienceCloudClientIds: parseJsonArray(readHiddenInputValue(CM_WORKSPACE_RUNTIME_EXPERIENCE_CLIENT_IDS_INPUT_NAME))
    .map((value) => String(value || "").trim())
    .filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_EXPERIENCE_CLIENT_ID),
  experienceCloudUserId: readHiddenInputValue(CM_WORKSPACE_RUNTIME_EXPERIENCE_USER_ID_INPUT_NAME),
  experienceCloudScope: readHiddenInputValue(CM_WORKSPACE_RUNTIME_EXPERIENCE_SCOPE_INPUT_NAME) || "",
};

function applyWorkspaceRuntimeAuthContext(authContext = null) {
  const source = authContext && typeof authContext === "object" ? authContext : {};
  const token = normalizeBearerTokenValue(firstNonEmptyString([source.accessToken, source.access_token]));
  if (token && tokenSupportsCmCatalog(token)) {
    setWorkspaceRuntimeAccessToken(token);
  }

  const clientIds = dedupeCandidateStrings([
    ...(Array.isArray(source.clientIds) ? source.clientIds : []),
    ...(Array.isArray(source.client_ids) ? source.client_ids : []),
    ...(Array.isArray(cmWorkspaceRuntimeAuth.clientIds) ? cmWorkspaceRuntimeAuth.clientIds : []),
    CM_WORKSPACE_PRIMARY_CLIENT_ID,
  ]).filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_PRIMARY_CLIENT_ID);
  cmWorkspaceRuntimeAuth.clientIds = clientIds;
  upsertBodyHiddenInput(document, CM_WORKSPACE_RUNTIME_CLIENT_IDS_INPUT_NAME, JSON.stringify(clientIds));

  const userId = firstNonEmptyString([source.userId, source.user_id, cmWorkspaceRuntimeAuth.userId]);
  cmWorkspaceRuntimeAuth.userId = String(userId || "").trim();
  upsertBodyHiddenInput(document, CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME, cmWorkspaceRuntimeAuth.userId);

  const scope = firstNonEmptyString([source.scope, cmWorkspaceRuntimeAuth.scope, CM_WORKSPACE_IMS_DEFAULT_SCOPE]);
  cmWorkspaceRuntimeAuth.scope = String(scope || CM_WORKSPACE_IMS_DEFAULT_SCOPE).trim() || CM_WORKSPACE_IMS_DEFAULT_SCOPE;
  upsertBodyHiddenInput(document, CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME, cmWorkspaceRuntimeAuth.scope);

  const experienceToken = normalizeBearerTokenValue(
    firstNonEmptyString([source.experienceCloudAccessToken, source.experience_cloud_access_token])
  );
  if (experienceToken) {
    cmWorkspaceRuntimeAuth.experienceCloudAccessToken = experienceToken;
    upsertBodyHiddenInput(document, CM_WORKSPACE_RUNTIME_EXPERIENCE_TOKEN_INPUT_NAME, experienceToken);
  }

  const experienceClientIds = dedupeCandidateStrings([
    ...(Array.isArray(source.experienceCloudClientIds) ? source.experienceCloudClientIds : []),
    ...(Array.isArray(source.experience_cloud_client_ids) ? source.experience_cloud_client_ids : []),
    ...(Array.isArray(cmWorkspaceRuntimeAuth.experienceCloudClientIds) ? cmWorkspaceRuntimeAuth.experienceCloudClientIds : []),
    CM_WORKSPACE_EXPERIENCE_CLIENT_ID,
  ]).filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_EXPERIENCE_CLIENT_ID);
  cmWorkspaceRuntimeAuth.experienceCloudClientIds = experienceClientIds;
  upsertBodyHiddenInput(
    document,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_CLIENT_IDS_INPUT_NAME,
    JSON.stringify(experienceClientIds)
  );

  const experienceUserId = firstNonEmptyString([
    source.experienceCloudUserId,
    source.experience_cloud_user_id,
    cmWorkspaceRuntimeAuth.experienceCloudUserId,
  ]);
  cmWorkspaceRuntimeAuth.experienceCloudUserId = String(experienceUserId || "").trim();
  upsertBodyHiddenInput(
    document,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_USER_ID_INPUT_NAME,
    cmWorkspaceRuntimeAuth.experienceCloudUserId
  );

  const experienceScope = firstNonEmptyString([
    source.experienceCloudScope,
    source.experience_cloud_scope,
    cmWorkspaceRuntimeAuth.experienceCloudScope,
    cmWorkspaceRuntimeAuth.scope,
  ]);
  cmWorkspaceRuntimeAuth.experienceCloudScope = String(experienceScope || "").trim();
  upsertBodyHiddenInput(
    document,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_SCOPE_INPUT_NAME,
    cmWorkspaceRuntimeAuth.experienceCloudScope
  );
}

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

function dedupeCandidateStrings(values = []) {
  const output = [];
  const seen = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const normalized = String(value ?? "").trim();
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

function hasHeaderName(headersLike, headerName) {
  const normalizedHeaderName = String(headerName || "").trim().toLowerCase();
  if (!normalizedHeaderName || !headersLike || typeof headersLike !== "object") {
    return false;
  }
  return Object.keys(headersLike).some((key) => String(key || "").trim().toLowerCase() === normalizedHeaderName);
}

function isCmWorkspaceReportsUrl(urlValue = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    return String(parsed.hostname || "").trim().toLowerCase() === "cm-reports.adobeprimetime.com";
  } catch {
    return false;
  }
}

function withCmWorkspaceReportHeaders(headersLike = {}, requestUrl = "") {
  const nextHeaders = headersLike && typeof headersLike === "object" ? { ...headersLike } : {};
  if (!isCmWorkspaceReportsUrl(requestUrl)) {
    return nextHeaders;
  }
  if (!hasHeaderName(nextHeaders, "Origin")) {
    nextHeaders.Origin = CM_WORKSPACE_REPORTS_ORIGIN;
  }
  if (!hasHeaderName(nextHeaders, "Referer")) {
    nextHeaders.Referer = CM_WORKSPACE_REPORTS_REFERER;
  }
  return nextHeaders;
}

function safeJsonParse(value, fallback = null) {
  const text = String(value || "").trim();
  if (!text) {
    return fallback;
  }
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function normalizeBearerTokenValue(value) {
  return String(value || "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function parseJwtPayload(tokenValue) {
  const token = normalizeBearerTokenValue(tokenValue);
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const payloadPart = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadPart + "=".repeat((4 - (payloadPart.length % 4 || 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getTokenExpiryEpochMs(tokenValue) {
  const claims = parseJwtPayload(tokenValue) || {};
  const exp = Number(claims.exp || 0);
  if (!Number.isFinite(exp) || exp <= 0) {
    return 0;
  }
  return exp * 1000;
}

function isBearerTokenFresh(tokenValue, skewMs = 0) {
  const token = normalizeBearerTokenValue(tokenValue);
  if (!token) {
    return false;
  }
  const expMs = getTokenExpiryEpochMs(token);
  if (!expMs) {
    return true;
  }
  return expMs > Date.now() + Math.max(0, Number(skewMs) || 0);
}

function tokenizeScopeSet(scopeValue) {
  return String(scopeValue || "")
    .split(/[\s,]+/g)
    .map((part) => String(part || "").trim())
    .filter(Boolean);
}

function tokenSupportsCmCatalog(tokenValue) {
  const token = normalizeBearerTokenValue(tokenValue);
  if (!token) {
    return false;
  }
  const claims = parseJwtPayload(token) || {};
  if (!claims || typeof claims !== "object") {
    return false;
  }
  const clientId = String(claims.client_id || claims.clientId || "").trim().toLowerCase();
  return clientId === CM_WORKSPACE_PRIMARY_CLIENT_ID;
}

function collectWorkspaceUserIdCandidates() {
  const tokenClaims = parseJwtPayload(cmWorkspaceRuntimeAuth.accessToken || "") || {};
  const experienceCloudClaims = parseJwtPayload(cmWorkspaceRuntimeAuth.experienceCloudAccessToken || "") || {};
  const orderedCandidates = [
    cmWorkspaceRuntimeAuth.userId,
    cmWorkspaceRuntimeAuth.experienceCloudUserId,
    tokenClaims.user_id,
    tokenClaims.userId,
    experienceCloudClaims.user_id,
    experienceCloudClaims.userId,
  ];
  const output = [];
  const seen = new Set();
  orderedCandidates.forEach((value) => {
    const normalized = String(value || "").trim();
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

function extractImsAccessTokenFromPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const nestedToken =
    payload.token && typeof payload.token === "object"
      ? payload.token.access_token || payload.token.accessToken || payload.token.token || payload.token.value || ""
      : payload.token || "";
  return normalizeBearerTokenValue(
    payload.access_token ||
      payload.accessToken ||
      nestedToken ||
      payload.authorization ||
      payload.Authorization ||
      payload.bearer ||
      payload.imsToken ||
      ""
  );
}

function formatCmuDateQueryValue(dateValue) {
  const value = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const yyyy = value.getUTCFullYear();
  const mm = String(value.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(value.getUTCDate()).padStart(2, "0");
  const hh = String(value.getUTCHours()).padStart(2, "0");
  const mi = String(value.getUTCMinutes()).padStart(2, "0");
  const ss = String(value.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

function formatCmuIsoQueryValue(dateValue) {
  return new Date(dateValue).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function shiftInstantToPstCalendar(dateValue) {
  return new Date(new Date(dateValue).getTime() + (CM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000));
}

function normalizeCmuZoomFromValue(value = "") {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  if (!normalized) {
    return "";
  }
  if (normalized === "YR" || normalized === "YEAR" || normalized === "YEARLY") {
    return "YR";
  }
  if (normalized === "MO" || normalized === "MON" || normalized === "MONTH" || normalized === "MONTHLY") {
    return "MO";
  }
  if (normalized === "DAY" || normalized === "DAILY" || normalized === "D") {
    return "DAY";
  }
  if (normalized === "HR" || normalized === "HOUR" || normalized === "HOURLY" || normalized === "H") {
    return "HR";
  }
  if (normalized === "MIN" || normalized === "MINUTE" || normalized === "MINUTELY" || normalized === "M") {
    return "MIN";
  }
  return "";
}

function getCmuZoomKeyFromUrl(urlValue = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    const queryZoom = normalizeCmuZoomFromValue(
      firstNonEmptyString([
        parsed.searchParams.get("zm"),
        parsed.searchParams.get("zoom"),
        parsed.searchParams.get("zoomLevel"),
        parsed.searchParams.get("zoom_level"),
        parsed.searchParams.get("zoom-level"),
      ])
    );
    if (queryZoom) {
      return queryZoom;
    }
  } catch {
    const queryMatch = raw.match(/[?&](?:zm|zoom(?:[_-]?level)?)=([^&#]+)/i);
    if (queryMatch?.[1]) {
      try {
        const decodedZoom = normalizeCmuZoomFromValue(decodeURIComponent(queryMatch[1]));
        if (decodedZoom) {
          return decodedZoom;
        }
      } catch {
        const rawZoom = normalizeCmuZoomFromValue(queryMatch[1]);
        if (rawZoom) {
          return rawZoom;
        }
      }
    }
  }

  let pathText = "";
  try {
    pathText = String(new URL(raw).pathname || "").toLowerCase();
  } catch {
    pathText = String(raw || "").split("?")[0].toLowerCase();
  }
  if (pathText.includes("/minute")) {
    return "MIN";
  }
  if (pathText.includes("/hour")) {
    return "HR";
  }
  if (pathText.includes("/day")) {
    return "DAY";
  }
  if (pathText.includes("/month")) {
    return "MO";
  }
  if (pathText.includes("/year")) {
    return "YR";
  }
  return "";
}

function buildCmuTimeWindowForZoom(zoomKey = "") {
  const normalizedZoom = String(zoomKey || "").trim().toUpperCase();
  const now = new Date();
  const nowPst = shiftInstantToPstCalendar(now);
  const nowIso = formatCmuIsoQueryValue(now);

  if (normalizedZoom === "YR") {
    return {
      start: String(nowPst.getUTCFullYear() - 1),
      end: nowIso,
    };
  }
  if (normalizedZoom === "MO") {
    const previousMonth = new Date(Date.UTC(nowPst.getUTCFullYear(), nowPst.getUTCMonth() - 1, 1));
    return {
      start: `${previousMonth.getUTCFullYear()}-${String(previousMonth.getUTCMonth() + 1).padStart(2, "0")}`,
      end: nowIso,
    };
  }
  if (normalizedZoom === "DAY") {
    const previousDay = new Date(Date.UTC(nowPst.getUTCFullYear(), nowPst.getUTCMonth(), nowPst.getUTCDate() - 1));
    return {
      start: `${previousDay.getUTCFullYear()}-${String(previousDay.getUTCMonth() + 1).padStart(2, "0")}-${String(
        previousDay.getUTCDate()
      ).padStart(2, "0")}`,
      end: nowIso,
    };
  }
  if (normalizedZoom === "HR") {
    return {
      start: formatCmuIsoQueryValue(new Date(now.getTime() - 12 * 60 * 60 * 1000)),
      end: nowIso,
    };
  }
  if (normalizedZoom === "MIN") {
    return {
      start: formatCmuIsoQueryValue(new Date(now.getTime() - 60 * 60 * 1000)),
      end: nowIso,
    };
  }
  return {
    start: nowIso,
    end: nowIso,
  };
}

function normalizeWorkspaceTenantScopeValue(value) {
  return String(value || "").trim();
}

function workspaceUsagePathRequiresTenantScope(pathValue = "") {
  try {
    const parsed = new URL(String(pathValue || ""), DEFAULT_CM_REPORTS_BASE);
    return String(parsed.pathname || "")
      .split("/")
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean)
      .includes("tenant");
  } catch {
    return String(pathValue || "")
      .split("/")
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean)
      .includes("tenant");
  }
}

function applyWorkspaceTenantScopeToSearchParams(searchParams, tenantScope = "") {
  if (!(searchParams instanceof URLSearchParams)) {
    return;
  }
  CM_TENANT_QUERY_PARAM_KEYS.forEach((key) => searchParams.delete(key));
  const normalizedTenantScope = normalizeWorkspaceTenantScopeValue(tenantScope);
  if (normalizedTenantScope) {
    searchParams.set("tenant", normalizedTenantScope);
  }
}

function applyWorkspaceTenantScopeToUsageUrl(urlValue, tenantScope = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  const normalizedTenantScope = normalizeWorkspaceTenantScopeValue(tenantScope);
  try {
    const parsed = new URL(raw);
    if (!isCmuUsageRequestUrl(parsed.toString())) {
      return parsed.toString();
    }
    CM_TENANT_QUERY_PARAM_KEYS.forEach((key) => parsed.searchParams.delete(key));
    if (workspaceUsagePathRequiresTenantScope(parsed.pathname)) {
      applyWorkspaceTenantScopeToSearchParams(parsed.searchParams, normalizedTenantScope);
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

function applyWorkspaceTenantScopeToConfigUrl(urlValue, tenantScope = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  const normalizedTenantScope = normalizeWorkspaceTenantScopeValue(tenantScope);
  try {
    const parsed = new URL(raw);
    if (!/^\/maitai\/(?:applications|policy)(?:\/|$)/i.test(String(parsed.pathname || "").trim())) {
      return parsed.toString();
    }
    parsed.searchParams.delete("orgId");
    parsed.searchParams.delete("orgid");
    if (normalizedTenantScope) {
      parsed.searchParams.set("orgId", normalizedTenantScope);
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

function applyWorkspaceTenantScopeToDeeplinkUrl(urlValue, tenantScope = "") {
  const usageScopedUrl = applyWorkspaceTenantScopeToUsageUrl(urlValue, tenantScope);
  return applyWorkspaceTenantScopeToConfigUrl(usageScopedUrl, tenantScope);
}

function resolveWorkspaceTenantScope(cardState = null, cardPayload = null) {
  return normalizeWorkspaceTenantScopeValue(
    firstNonEmptyString([
      cardPayload?.tenantId,
      cardState?.tenantId,
      state.tenantScope,
      cardPayload?.tenantName,
      cardState?.tenantName,
    ])
  );
}

function resolveWorkspaceTenantLabel(cardState = null, cardPayload = null) {
  return String(
    firstNonEmptyString([
      cardPayload?.tenantName,
      cardState?.tenantName,
      cardPayload?.tenantId,
      cardState?.tenantId,
      state.tenantScope,
      state.programmerName,
      state.programmerId,
    ]) || ""
  ).trim();
}

function ensureCmuQueryDefaults(urlValue, tenantScope = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    if (!parsed.searchParams.has("format")) {
      parsed.searchParams.set("format", "json");
    }
    if (isCmuUsageRequestUrl(parsed.toString())) {
      const timeWindow = buildCmuTimeWindowForZoom(getCmuZoomKeyFromUrl(parsed.toString()));
      parsed.searchParams.set("start", String(timeWindow.start || formatCmuIsoQueryValue(new Date())));
      parsed.searchParams.set("end", String(timeWindow.end || formatCmuIsoQueryValue(new Date())));
    }
    const lowerPath = String(parsed.pathname || "").toLowerCase();
    if (!parsed.searchParams.has("metrics") && (lowerPath.includes("/tenant") || lowerPath.includes("/hour"))) {
      parsed.searchParams.set("metrics", "users");
    }
    return applyWorkspaceTenantScopeToUsageUrl(parsed.toString(), tenantScope);
  } catch {
    return raw;
  }
}

async function fetchWithTimeout(url, init = {}, timeoutMs = CM_WORKSPACE_FETCH_TIMEOUT_MS) {
  const reportActivity =
    chrome?.runtime?.sendMessage && /^https?:\/\//i.test(String(url || "").trim())
      ? Math.trunc
      : null;
  const requestUrl = String(url || "").trim();
  const method = String(init?.method || "GET").trim().toUpperCase() || "GET";
  const startedAt = Date.now();
  if (reportActivity) {
    void chrome.runtime
      .sendMessage({
        type: UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE,
        delta: 1,
        context: "cm-workspace-fetch",
      })
      .catch(() => {});
  }
  const controller = new AbortController();
  const timerId = window.setTimeout(() => controller.abort(), Math.max(2000, Number(timeoutMs) || CM_WORKSPACE_FETCH_TIMEOUT_MS));
  try {
    emitCmWorkspaceConsoleTrace("fetch", `${method} ${requestUrl}`, {
      phase: "request",
      method,
      url: requestUrl,
      timeoutMs: Math.max(2000, Number(timeoutMs) || CM_WORKSPACE_FETCH_TIMEOUT_MS),
    });
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    emitCmWorkspaceConsoleTrace("fetch", `${method} ${requestUrl}`, {
      phase: "response",
      method,
      url: requestUrl,
      status: Number(response?.status || 0),
      ok: Boolean(response?.ok),
      redirected: Boolean(response?.redirected),
      durationMs: Date.now() - startedAt,
    });
    return response;
  } catch (error) {
    emitCmWorkspaceConsoleTrace(
      "fetch",
      `${method} ${requestUrl}`,
      {
        phase: "error",
        method,
        url: requestUrl,
        durationMs: Date.now() - startedAt,
        error,
      },
      { level: "error" }
    );
    throw error;
  } finally {
    window.clearTimeout(timerId);
    if (reportActivity) {
      void chrome.runtime
        .sendMessage({
          type: UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE,
          delta: -1,
          context: "cm-workspace-fetch",
        })
        .catch(() => {});
    }
  }
}

function resolveWorkspaceRuntimeClientIds() {
  return dedupeCandidateStrings([
    ...(Array.isArray(cmWorkspaceRuntimeAuth.clientIds) ? cmWorkspaceRuntimeAuth.clientIds : []),
    CM_WORKSPACE_PRIMARY_CLIENT_ID,
  ]).filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_PRIMARY_CLIENT_ID);
}

function resolveWorkspaceExperienceClientIds() {
  return dedupeCandidateStrings([
    ...(Array.isArray(cmWorkspaceRuntimeAuth.experienceCloudClientIds) ? cmWorkspaceRuntimeAuth.experienceCloudClientIds : []),
    CM_WORKSPACE_EXPERIENCE_CLIENT_ID,
  ]).filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_EXPERIENCE_CLIENT_ID);
}

function collectWorkspaceScopeCandidates() {
  const candidates = dedupeCandidateStrings(
    [
      cmWorkspaceRuntimeAuth.scope,
      cmWorkspaceRuntimeAuth.experienceCloudScope,
      CM_WORKSPACE_IMS_DEFAULT_SCOPE,
    ].map((value) => tokenizeScopeSet(value).join(","))
  );
  return candidates.length > 0 ? candidates : [CM_WORKSPACE_IMS_DEFAULT_SCOPE];
}

function collectWorkspaceValidateTokenSeeds() {
  const output = [];
  const seen = new Set();
  const pushSeed = (tokenValue, clientIds) => {
    const token = normalizeBearerTokenValue(tokenValue);
    if (!token) {
      return;
    }
    const key = token.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push({
      token,
      clientIds: dedupeCandidateStrings(Array.isArray(clientIds) ? clientIds : []),
    });
  };
  pushSeed(cmWorkspaceRuntimeAuth.experienceCloudAccessToken, resolveWorkspaceExperienceClientIds());
  pushSeed(cmWorkspaceRuntimeAuth.accessToken, resolveWorkspaceRuntimeClientIds());
  return output;
}

function buildValidateTokenFormBody(tokenValue, clientId) {
  const form = new URLSearchParams({
    type: "access_token",
    token: normalizeBearerTokenValue(tokenValue),
  });
  if (clientId) {
    form.set("client_id", String(clientId).trim());
  }
  return form.toString();
}

function buildImsCheckTokenUrl(clientId, scope, userId) {
  const url = new URL(CM_WORKSPACE_IMS_CHECK_TOKEN_URL);
  if (clientId) {
    url.searchParams.set("client_id", clientId);
  }
  if (scope) {
    url.searchParams.set("scope", scope);
  }
  if (userId) {
    url.searchParams.set("user_id", userId);
  }
  return url.toString();
}

async function refreshTokenViaValidateToken(seedToken, forceFresh = false, clientIds = resolveWorkspaceRuntimeClientIds()) {
  for (const clientId of clientIds) {
    for (const credentials of ["include", "omit"]) {
      const response = await fetchWithTimeout(CM_WORKSPACE_IMS_VALIDATE_TOKEN_URL, {
        method: "POST",
        credentials,
        headers: {
          Accept: "*/*",
          Origin: CM_WORKSPACE_CONSOLE_ORIGIN,
          Referer: CM_WORKSPACE_CONSOLE_REFERER,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          ...(clientId ? { client_id: clientId } : {}),
        },
        body: buildValidateTokenFormBody(seedToken, clientId),
      }).catch(() => null);
      if (!response || !response.ok) {
        continue;
      }
      const parsed = safeJsonParse(await response.text().catch(() => ""), null);
      if (!parsed || typeof parsed !== "object") {
        continue;
      }
      const refreshedToken = extractImsAccessTokenFromPayload(parsed);
      if (
        refreshedToken &&
        tokenSupportsCmCatalog(refreshedToken) &&
        (!forceFresh || isBearerTokenFresh(refreshedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS))
      ) {
        return refreshedToken;
      }
      if (parsed.valid === true && !forceFresh && tokenSupportsCmCatalog(seedToken)) {
        return normalizeBearerTokenValue(seedToken);
      }
    }
  }
  return "";
}

async function refreshTokenViaImsCheck(forceFresh = false) {
  const userIdCandidates = [];
  collectWorkspaceUserIdCandidates().forEach((candidate) => {
    if (!userIdCandidates.includes(candidate)) {
      userIdCandidates.push(candidate);
    }
  });
  if (!userIdCandidates.includes("")) {
    userIdCandidates.push("");
  }
  const scopes = collectWorkspaceScopeCandidates();
  for (const clientId of resolveWorkspaceRuntimeClientIds()) {
    for (const scope of scopes) {
      for (const userIdCandidate of userIdCandidates) {
        const requestUrl = buildImsCheckTokenUrl(clientId, scope, userIdCandidate);
        for (const credentials of ["include", "omit"]) {
          const response = await fetchWithTimeout(requestUrl, {
            method: "POST",
            credentials,
            headers: {
              Accept: "*/*",
              Origin: CM_WORKSPACE_CONSOLE_ORIGIN,
              Referer: CM_WORKSPACE_CONSOLE_REFERER,
            },
          }).catch(() => null);
          if (!response || !response.ok) {
            continue;
          }
          const parsed = safeJsonParse(await response.text().catch(() => ""), null);
          if (!parsed || typeof parsed !== "object") {
            continue;
          }
          const refreshedToken = extractImsAccessTokenFromPayload(parsed);
          if (!refreshedToken || !tokenSupportsCmCatalog(refreshedToken)) {
            continue;
          }
          if (forceFresh && !isBearerTokenFresh(refreshedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS)) {
            continue;
          }
          return refreshedToken;
        }
      }
    }
  }
  return "";
}

function isBasicAuthHeader(value) {
  return /^basic\s+/i.test(String(value || "").trim());
}

function setWorkspaceRuntimeAccessToken(tokenValue) {
  const token = normalizeBearerTokenValue(tokenValue);
  cmWorkspaceRuntimeAuth.accessToken = token;
  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME) {
    upsertBodyHiddenInput(document, CM_WORKSPACE_RUNTIME_TOKEN_INPUT_NAME, token);
  }
}

async function resolveWorkspaceRuntimeAuthFromController(forceFresh = false) {
  const result = await sendWorkspaceAction("resolve-run-context", {
    forceRefresh: forceFresh === true,
    source: "cm-workspace-auth",
  });
  const authContext = result?.cmAuth && typeof result.cmAuth === "object" ? result.cmAuth : null;
  if (authContext) {
    applyWorkspaceRuntimeAuthContext(authContext);
  }
  const token = normalizeBearerTokenValue(authContext?.accessToken || "");
  if (token && tokenSupportsCmCatalog(token)) {
    setWorkspaceRuntimeAccessToken(token);
    return token;
  }
  return "";
}

async function refreshCmWorkspaceAccessToken(forceFresh = false) {
  const seedToken = normalizeBearerTokenValue(cmWorkspaceRuntimeAuth.accessToken || "");
  if (!forceFresh && seedToken && isBearerTokenFresh(seedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS) && tokenSupportsCmCatalog(seedToken)) {
    setWorkspaceRuntimeAccessToken(seedToken);
    return seedToken;
  }
  let refreshedToken = "";
  try {
    refreshedToken = await resolveWorkspaceRuntimeAuthFromController(forceFresh);
  } catch {
    refreshedToken = "";
  }
  if (refreshedToken && tokenSupportsCmCatalog(refreshedToken)) {
    return refreshedToken;
  }
  if (!refreshedToken) {
    try {
      refreshedToken = await resolveWorkspaceRuntimeAuthFromController(true);
    } catch {
      refreshedToken = "";
    }
  }
  if (!refreshedToken) {
    const seedEntries = collectWorkspaceValidateTokenSeeds();
    for (const seedEntry of seedEntries) {
      try {
        refreshedToken = await refreshTokenViaValidateToken(seedEntry.token, forceFresh, seedEntry.clientIds);
      } catch {
        refreshedToken = "";
      }
      if (refreshedToken) {
        break;
      }
    }
  }
  if (!refreshedToken) {
    try {
      refreshedToken = await refreshTokenViaImsCheck(forceFresh);
    } catch {
      refreshedToken = "";
    }
  }
  const fallbackToken = !forceFresh && tokenSupportsCmCatalog(seedToken) ? seedToken : "";
  const resolvedToken = normalizeBearerTokenValue(refreshedToken || fallbackToken);
  if (resolvedToken) {
    setWorkspaceRuntimeAccessToken(resolvedToken);
  }
  return resolvedToken;
}

async function fetchCmWorkspaceWithAuth(urlValue, init = {}, options = {}) {
  const requestUrl = String(urlValue || "").trim();
  if (!requestUrl) {
    throw new Error("CM request URL is required.");
  }
  const method = String(init?.method || "GET").trim().toUpperCase() || "GET";
  const baseHeaders = withCmWorkspaceReportHeaders(
    {
      Accept: "*/*",
      ...(init?.headers && typeof init.headers === "object" ? init.headers : {}),
    },
    requestUrl
  );
  const headers = { ...baseHeaders };
  const hasBasicAuthorization = isBasicAuthHeader(baseHeaders.Authorization || baseHeaders.authorization || "");
  if (!hasBasicAuthorization) {
    let token = normalizeBearerTokenValue(cmWorkspaceRuntimeAuth.accessToken || "");
    if (!token || !isBearerTokenFresh(token, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS) || !tokenSupportsCmCatalog(token)) {
      token = await refreshCmWorkspaceAccessToken(false);
    }
    if (!token || !tokenSupportsCmCatalog(token)) {
      throw new Error(
        "CM request failed: UnderPAR could not auto-hydrate a cm-console-ui bearer from the current Adobe IMS session. Sign in again and retry."
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const requestInit = {
    ...init,
    method,
    credentials: "include",
    headers,
  };
  let response = await fetchWithTimeout(requestUrl, requestInit, options.timeoutMs || CM_WORKSPACE_FETCH_TIMEOUT_MS);

  const shouldRetryWithFreshToken =
    !hasBasicAuthorization && options.retryOnAuthError !== false && (response.status === 401 || response.status === 403);
  if (shouldRetryWithFreshToken) {
    const refreshedToken = await refreshCmWorkspaceAccessToken(true);
    if (refreshedToken) {
      const retryHeaders = {
        ...baseHeaders,
        Authorization: `Bearer ${refreshedToken}`,
      };
      response = await fetchWithTimeout(
        requestUrl,
        {
          ...requestInit,
          headers: retryHeaders,
        },
        options.timeoutMs || CM_WORKSPACE_FETCH_TIMEOUT_MS
      );
    } else {
      throw new Error(
        "CM request failed: UnderPAR could not auto-hydrate a cm-console-ui bearer from the current Adobe IMS session. Sign in again and retry."
      );
    }
  }

  return response;
}

function extractRowsFromCmPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return [];
  }
  if (Array.isArray(payload.report)) {
    return payload.report;
  }
  if (Array.isArray(payload.rows)) {
    return payload.rows;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  if (Array.isArray(payload.results)) {
    return payload.results;
  }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }
  return [payload];
}

function normalizeCmColumnName(value) {
  return String(value || "").trim().toLowerCase();
}

function getRowValueByColumn(row, columnName) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    return undefined;
  }
  const rawColumnName = String(columnName || "").trim();
  if (!rawColumnName) {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(row, rawColumnName)) {
    return row[rawColumnName];
  }
  const normalizedColumn = normalizeCmColumnName(rawColumnName);
  if (!normalizedColumn) {
    return undefined;
  }
  for (const [key, value] of Object.entries(row)) {
    if (normalizeCmColumnName(key) === normalizedColumn) {
      return value;
    }
  }
  return undefined;
}

function compareCmColumnValues(leftValue, rightValue) {
  return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function isCmuUsageRequestUrl(urlValue = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return false;
  }
  const resolvePath = (value) => {
    try {
      return String(new URL(value).pathname || "").trim().toLowerCase();
    } catch (_error) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .split("?")[0];
    }
  };
  const path = resolvePath(raw);
  if (!path) {
    return false;
  }
  const parts = String(path || "")
    .split("/")
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .filter((value) => value !== "cmu" && value !== "v2");
  if (
    parts.length === 0 ||
    !parts.includes("year") ||
    !parts.includes("tenant")
  ) {
    return false;
  }
  return true;
}

function isCmuUsageCard(cardState) {
  const zoomKey = String(cardState?.zoomKey || "").trim().toLowerCase();
  if (zoomKey === "usage" || zoomKey === "cmu") {
    return true;
  }
  const requestUrl = String(cardState?.baseRequestUrl || cardState?.requestUrl || cardState?.endpointUrl || "").trim();
  return isCmuUsageRequestUrl(requestUrl);
}

function isCmDateTimeColumn(columnName) {
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized) {
    return false;
  }
  if (CM_DATE_DIMENSION_KEYS.has(normalized)) {
    return true;
  }
  return /(?:^|[-_])(year|month|day|hour|minute|second|date|time|timestamp)(?:$|[-_])/i.test(normalized);
}

function isCmMetricColumn(columnName) {
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized) {
    return false;
  }
  const canonical = normalized.replace(/_/g, "-");
  return CM_METRIC_COLUMNS.has(canonical);
}

function addCmuPathDimensionAliases(targetSet, segment) {
  if (!(targetSet instanceof Set)) {
    return;
  }
  const normalized = normalizeCmColumnName(segment);
  if (!normalized) {
    return;
  }
  const canonical = normalized.replace(/_/g, "-");
  targetSet.add(normalized);
  targetSet.add(canonical);
  if (canonical === "tenant") {
    targetSet.add("tenant-id");
    targetSet.add("tenant_id");
  } else if (canonical === "application-id") {
    targetSet.add("application_id");
  } else if (canonical === "decision-type") {
    targetSet.add("decision_type");
  } else if (canonical === "service-provider") {
    targetSet.add("service_provider");
  } else if (canonical === "activity-level") {
    targetSet.add("activity_level");
  } else if (canonical === "concurrency-level") {
    targetSet.add("concurrency_level");
  }
}

function resolveCmuPathDimensionSet(cardState = null) {
  const requestUrl = String(cardState?.baseRequestUrl || cardState?.requestUrl || cardState?.endpointUrl || "").trim();
  if (!requestUrl) {
    return null;
  }
  let pathname = "";
  try {
    pathname = String(new URL(requestUrl).pathname || "");
  } catch (_error) {
    pathname = String(requestUrl || "").split("?", 1)[0] || "";
  }
  const segments = pathname
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(String(segment || "").trim());
      } catch (_error) {
        return String(segment || "").trim();
      }
    })
    .map((segment) => normalizeCmColumnName(segment))
    .filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const supported = new Set();
  segments.forEach((segment) => {
    const canonical = segment.replace(/_/g, "-");
    if (
      CM_CMU_NON_DIMENSION_PATH_SEGMENTS.has(segment) ||
      CM_CMU_NON_DIMENSION_PATH_SEGMENTS.has(canonical) ||
      CM_FILTER_BLOCKED_COLUMNS.has(segment) ||
      CM_FILTER_BLOCKED_COLUMNS.has(canonical) ||
      isCmDateTimeColumn(segment) ||
      isCmMetricColumn(segment)
    ) {
      return;
    }
    addCmuPathDimensionAliases(supported, segment);
  });
  return supported.size > 0 ? supported : null;
}

function isDisplayableCmuUsageColumn(cardState, columnName) {
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized || normalized.startsWith("__")) {
    return false;
  }
  const canonical = normalized.replace(/_/g, "-");
  if (CM_FILTER_BLOCKED_COLUMNS.has(normalized) || CM_FILTER_BLOCKED_COLUMNS.has(canonical)) {
    return false;
  }
  if (isCmDateTimeColumn(normalized) || isCmMetricColumn(normalized)) {
    return false;
  }
  const supportedDimensions = resolveCmuPathDimensionSet(cardState);
  if (
    supportedDimensions instanceof Set &&
    supportedDimensions.size > 0 &&
    !supportedDimensions.has(normalized) &&
    !supportedDimensions.has(canonical)
  ) {
    return false;
  }
  return true;
}

function isDisplayableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  return isDisplayableCmuUsageColumn(cardState, columnName);
}

function isFilterableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  return isDisplayableCmuUsageColumn(cardState, columnName);
}

function collectHarvestCandidateValues(harvestList = []) {
  const list = Array.isArray(harvestList) ? harvestList : [];
  const idpCandidates = dedupeCandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.mvpd || "").trim(),
      ...(Array.isArray(harvest?.idpCandidates) ? harvest.idpCandidates : []),
      ...(Array.isArray(harvest?.allIdpCandidates) ? harvest.allIdpCandidates : []),
    ])
  );
  const subjectCandidates = dedupeCandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.subject || "").trim(),
      String(harvest?.upstreamUserId || "").trim(),
      String(harvest?.userId || "").trim(),
      ...(Array.isArray(harvest?.subjectCandidates) ? harvest.subjectCandidates : []),
      ...(Array.isArray(harvest?.allSubjectCandidates) ? harvest.allSubjectCandidates : []),
    ])
  );
  const sessionCandidates = dedupeCandidateStrings(
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

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  els.status.textContent = text;
  els.status.classList.remove("error");
  if (type === "error") {
    els.status.classList.add("error");
  }
}

function setActionButtonsDisabled(disabled) {
  const isDisabled = Boolean(disabled);
  const hasCards = hasWorkspaceCardContext();
  if (els.makeClickCmuButton) {
    els.makeClickCmuButton.disabled = isDisabled || state.cmAvailable !== true;
  }
  if (els.makeClickCmuWorkspaceButton) {
    els.makeClickCmuWorkspaceButton.disabled = isDisabled || state.cmAvailable !== true || !hasCards;
  }
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isDisabled || !hasCards;
  }
  if (els.clearButton) {
    els.clearButton.disabled = isDisabled;
  }
}

function isWorkspaceNetworkBusy() {
  if (state.batchRunning) {
    return true;
  }
  for (const cardState of state.cardsById.values()) {
    if (cardState?.running === true) {
      return true;
    }
  }
  return false;
}

function syncWorkspaceNetworkIndicator() {
  const isBusy = isWorkspaceNetworkBusy();
  if (els.rerunAllButton) {
    els.rerunAllButton.classList.toggle("net-busy", isBusy);
    els.rerunAllButton.setAttribute("aria-busy", isBusy ? "true" : "false");
    els.rerunAllButton.title = isBusy ? "Re-run all (loading...)" : "Re-run all";
  }
  if (els.rerunIndicator) {
    els.rerunIndicator.hidden = !isBusy;
  }
}

function syncActionButtonsDisabled() {
  setActionButtonsDisabled(state.batchRunning || state.workspaceLocked);
  syncWorkspaceNetworkIndicator();
}

function syncTearsheetButtonsVisibility() {
  const isVisible = state.cmAvailable === true;
  if (els.makeClickCmuButton) {
    els.makeClickCmuButton.hidden = !isVisible;
  }
  if (els.makeClickCmuWorkspaceButton) {
    els.makeClickCmuWorkspaceButton.hidden = !isVisible;
  }
}

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getWorkspaceLockMessage() {
  return `${getProgrammerLabel()} ${WORKSPACE_LOCK_MESSAGE_SUFFIX}`;
}

function getProgrammerConsoleApplicationsUrl() {
  const programmerId = String(state.programmerId || "").trim();
  if (!programmerId) {
    return "";
  }
  return `${PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL}/${encodeURIComponent(programmerId)}/applications`;
}

function buildNotPremiumConsoleLinkHtml(serviceLabel = "CM") {
  const consoleUrl = getProgrammerConsoleApplicationsUrl();
  if (!consoleUrl) {
    return `* If this looks wrong, no Media Company id is available for an Adobe Pass Console deeplink for ${escapeHtml(
      serviceLabel
    )}.`;
  }
  return `* If this looks wrong, <a href="${escapeHtml(
    consoleUrl
  )}" target="_blank" rel="noopener noreferrer">click here to inspect this Media Company in Adobe Pass Console</a> and verify legacy applications and premium scopes for ${escapeHtml(
    serviceLabel
  )}.`;
}

function buildWorkspaceLockMessageHtml() {
  const baseMessage = escapeHtml(getWorkspaceLockMessage());
  const consoleUrl = getProgrammerConsoleApplicationsUrl();
  if (!consoleUrl) {
    return baseMessage;
  }
  return `${baseMessage} <a href="${escapeHtml(
    consoleUrl
  )}" target="_blank" rel="noopener noreferrer">Open Media Company in Adobe Pass Console</a>.`;
}

function hasProgrammerContext() {
  return Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
}

function shouldShowNonCmMode() {
  return (
    state.cmAvailabilityResolved === true &&
    state.cmAvailable === false &&
    state.cmContainerVisible === false &&
    hasProgrammerContext()
  );
}

function normalizeWorkspaceReplayCardPayload(card = null) {
  if (!card || typeof card !== "object") {
    return null;
  }
  const normalizedCardId = String(card?.cardId || buildWorkspaceCardId("replay")).trim();
  const endpointUrl = String(card?.endpointUrl || "").trim();
  const requestUrl = String(card?.requestUrl || endpointUrl || "").trim();
  const baseRequestUrl = String(card?.baseRequestUrl || requestUrl || endpointUrl || "").trim();
  return {
    cardId: normalizedCardId || buildWorkspaceCardId("replay"),
    endpointUrl,
    requestUrl,
    baseRequestUrl,
    seedEndpointUrl: String(card?.seedEndpointUrl || "").trim(),
    seedRequestUrl: String(card?.seedRequestUrl || "").trim(),
    seedBaseRequestUrl: String(card?.seedBaseRequestUrl || "").trim(),
    seedLocalColumnFilters:
      card?.seedLocalColumnFilters && typeof card.seedLocalColumnFilters === "object" ? { ...card.seedLocalColumnFilters } : {},
    zoomKey: String(card?.zoomKey || "").trim(),
    columns: Array.isArray(card?.columns) ? card.columns.map((column) => String(column || "")).filter(Boolean) : [],
    localColumnFilters:
      card?.localColumnFilters && typeof card.localColumnFilters === "object" ? { ...card.localColumnFilters } : {},
    operation: card?.operation && typeof card.operation === "object" ? { ...card.operation } : null,
    formValues: card?.formValues && typeof card.formValues === "object" ? { ...card.formValues } : {},
    tenantId: String(card?.tenantId || "").trim(),
    tenantName: String(card?.tenantName || "").trim(),
  };
}

function cloneWorkspaceReplayCards(cards = []) {
  return (Array.isArray(cards) ? cards : [])
    .map((card) => normalizeWorkspaceReplayCardPayload(card))
    .filter(Boolean);
}

function getWorkspaceReplayCardsFromCurrentState() {
  const cards = getOrderedCardStates();
  if (!Array.isArray(cards) || cards.length === 0) {
    return [];
  }
  return cloneWorkspaceReplayCards(cards.map((cardState) => getCardPayload(cardState)));
}

function getWorkspaceReplayCards() {
  const fromCurrentState = getWorkspaceReplayCardsFromCurrentState();
  if (fromCurrentState.length > 0) {
    state.workspaceReplayCards = cloneWorkspaceReplayCards(fromCurrentState);
    return cloneWorkspaceReplayCards(fromCurrentState);
  }
  return cloneWorkspaceReplayCards(state.workspaceReplayCards);
}

function syncWorkspaceReplayCardsFromCurrentCards() {
  const fromCurrentState = getWorkspaceReplayCardsFromCurrentState();
  const existingReplayCards = cloneWorkspaceReplayCards(state.workspaceReplayCards);
  const shouldPreserveExistingReplayContext =
    existingReplayCards.length > fromCurrentState.length &&
    (state.batchRunning === true ||
      state.programmerSwitchLoading === true ||
      Boolean(String(state.pendingAutoRerunProgrammerKey || "").trim()) ||
      Boolean(String(state.autoRerunInFlightProgrammerKey || "").trim()));
  if (shouldPreserveExistingReplayContext) {
    return;
  }
  if (fromCurrentState.length > 0) {
    state.workspaceReplayCards = cloneWorkspaceReplayCards(fromCurrentState);
    return;
  }
  if (state.cardsById.size === 0) {
    state.workspaceReplayCards = [];
  }
}

function clearWorkspaceCards(options = {}) {
  const preserveReplayContext = options?.preserveReplayContext === true;
  if (!preserveReplayContext) {
    state.workspaceReplayCards = [];
    state.pendingAutoRerunCards = [];
  }
  state.cardsById.forEach((cardState) => {
    teardownCardHeaderQueryEditors(cardState);
    cardState.element?.remove();
  });
  state.cardsById.clear();
  syncActionButtonsDisabled();
}

function hasWorkspaceCardContext() {
  return state.cardsById instanceof Map && state.cardsById.size > 0;
}

function hasWorkspaceReplayContext() {
  return getWorkspaceReplayCards().length > 0;
}

function updateNonCmMode() {
  const shouldShowNoCm = shouldShowNonCmMode();
  state.nonCmMode = shouldShowNoCm;
  if (els.nonCmHeadline) {
    els.nonCmHeadline.textContent = `No Soup for ${getProgrammerLabel()}. No Premium, No CM, No Dice.`;
  }
  if (els.nonCmNote) {
    els.nonCmNote.innerHTML = buildNotPremiumConsoleLinkHtml("CM");
  }

  // Preserve the mounted CM workspace during non-CM selections so the same
  // card layout can return immediately when the next CM-capable company lands.
  if (els.stylesheet) {
    els.stylesheet.disabled = false;
  }
  if (els.appRoot) {
    els.appRoot.hidden = false;
  }
  if (els.nonCmScreen) {
    els.nonCmScreen.hidden = true;
  }
}

function updateWorkspaceLockState() {
  const shouldLock = shouldShowNonCmMode();
  state.workspaceLocked = shouldLock;
  document.body.classList.toggle("workspace-locked", shouldLock);
  if (els.lockBanner) {
    els.lockBanner.hidden = !shouldLock;
  }
  if (els.lockMessage) {
    els.lockMessage.innerHTML = shouldLock ? buildWorkspaceLockMessageHtml() : "";
  }
  syncActionButtonsDisabled();
  updateNonCmMode();
}

function updateControllerBanner() {
  if (!els.controllerState || !els.filterState) {
    return;
  }

  const hasProgrammerContext = Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
  if (state.workspaceLocked) {
    els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
    els.filterState.textContent = "CM workspace is locked for this media company. No Premium, No CM, No Dice.";
    return;
  }
  if (!state.controllerOnline) {
    if (hasProgrammerContext) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "Waiting for CM controller sync from UnderPAR side panel...";
    } else {
      els.controllerState.textContent = "Waiting for UnderPAR side panel controller...";
      els.filterState.textContent = "";
    }
    return;
  }

  els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
  const requestorLabel = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
  const mvpdLabel = state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs";
  const harvestList = Array.isArray(state.profileHarvestList) ? state.profileHarvestList : [];
  const harvest = state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : harvestList[0] || null;
  const harvestSubject = String(harvest?.subject || "").trim();
  const harvestMvpd = String(harvest?.mvpd || "").trim();
  const harvestSession = String(harvest?.sessionId || "").trim();
  const harvestOutcome = String(harvest?.profileCheckOutcome || "").trim();
  const harvestProfileCount = Number(harvest?.profileCount || 0);
  const compact = (value, limit) => {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  };
  const harvestStatusSummary = harvestOutcome
    ? ` | MVPD Profile: ${compact(harvestOutcome, 16)}${Number.isFinite(harvestProfileCount) ? ` (profiles=${harvestProfileCount})` : ""}`
    : "";
  const harvestCountSummary = harvestList.length > 0 ? ` | MVPD Login History: ${harvestList.length} captured` : "";
  const harvestIdentitySummary = harvestSubject
    ? ` | Correlation Subject: ${compact(harvestSubject, 42)}${harvestMvpd ? ` | Correlation MVPD: ${compact(harvestMvpd, 18)}` : ""}${
        harvestSession ? ` | Session: ${compact(harvestSession, 24)}` : ""
      }`
    : "";
  const harvestSummary =
    harvestStatusSummary || harvestIdentitySummary || harvestCountSummary
      ? `${harvestCountSummary}${harvestStatusSummary}${harvestIdentitySummary}`
      : "";
  els.filterState.textContent = `RequestorId(s): ${requestorLabel} | MVPD(s): ${mvpdLabel}${harvestSummary}`;
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
  // Ignore transient partial identity payloads (e.g. id present in one state and name-only in another).
  return false;
}

function buildWorkspaceControllerContextKey(
  programmerId = "",
  premiumPanelRequestToken = 0,
  environmentKey = state.adobePassEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key
) {
  const normalizedEnvironmentKey =
    String(environmentKey || state.adobePassEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim() ||
    DEFAULT_ADOBEPASS_ENVIRONMENT.key;
  const normalizedProgrammerId = String(programmerId || "").trim() || "no-programmer";
  const normalizedRequestToken = Math.max(0, Number(premiumPanelRequestToken || 0));
  return `${normalizedEnvironmentKey}::${normalizedProgrammerId}::${normalizedRequestToken}`;
}

function doesWorkspaceEventMatchCurrentContext(payload = {}) {
  const incomingContextKey = String(payload?.workspaceContextKey || "").trim();
  const currentContextKey = String(state.workspaceContextKey || "").trim();
  if (incomingContextKey && currentContextKey && incomingContextKey !== currentContextKey) {
    return false;
  }

  const incomingProgrammerId = String(payload?.programmerId || "").trim();
  const currentProgrammerId = String(state.programmerId || "").trim();
  if (incomingProgrammerId && currentProgrammerId && incomingProgrammerId !== currentProgrammerId) {
    return false;
  }

  const incomingEnvironmentKey = String(payload?.adobePassEnvironmentKey || "").trim();
  const currentEnvironmentKey = String(state.adobePassEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim();
  if (incomingEnvironmentKey && currentEnvironmentKey && incomingEnvironmentKey !== currentEnvironmentKey) {
    return false;
  }

  const incomingRequestToken = Math.max(0, Number(payload?.premiumPanelRequestToken || 0));
  const currentRequestToken = Math.max(0, Number(state.premiumPanelRequestToken || 0));
  if (incomingRequestToken > 0 && currentRequestToken > 0 && incomingRequestToken !== currentRequestToken) {
    return false;
  }

  return true;
}

function clearPendingProgrammerSwitchTransition() {
  state.programmerSwitchLoading = false;
  state.programmerSwitchLoadingKey = "";
  state.pendingAutoRerunProgrammerKey = "";
  state.autoRerunInFlightProgrammerKey = "";
  state.pendingAutoRerunCards = [];
}

async function autoRerunCardsForProgrammerSwitch(expectedProgrammerKey = "") {
  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  if (!currentProgrammerKey) {
    return false;
  }
  if (expectedProgrammerKey && currentProgrammerKey !== expectedProgrammerKey) {
    return false;
  }
  if (
    state.cmAvailable !== true ||
    state.programmerHydrationReady !== true ||
    state.workspaceLocked ||
    state.nonCmMode ||
    state.batchRunning
  ) {
    return false;
  }

  const queuedCards =
    Array.isArray(state.pendingAutoRerunCards) && state.pendingAutoRerunCards.length > 0
      ? cloneWorkspaceReplayCards(state.pendingAutoRerunCards)
      : getWorkspaceReplayCards();
  const cards = cloneWorkspaceReplayCards(queuedCards);
  if (cards.length === 0) {
    return false;
  }

  // Rebuild the visible workspace from the preserved replay snapshot when CM
  // returns after one or more non-CM selections. This keeps replay context
  // intact while preventing stale card DOM from leaking across companies.
  clearWorkspaceCards({ preserveReplayContext: true });

  await rerunAllCards({
    // Use the explicit programmer-switch reason so media-company refreshes stay
    // distinct from ordinary reruns and card adds.
    reason: "programmer-switch",
    cards,
  });
  return true;
}

function maybeConsumePendingAutoRerun() {
  const pendingProgrammerKey = String(state.pendingAutoRerunProgrammerKey || "").trim();
  if (!pendingProgrammerKey) {
    if (!String(state.autoRerunInFlightProgrammerKey || "").trim()) {
      state.programmerSwitchLoading = false;
      state.programmerSwitchLoadingKey = "";
    }
    return;
  }
  const hasRunnableControllerContext = state.controllerOnline === true;
  if (!hasRunnableControllerContext) {
    return;
  }

  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  if (!currentProgrammerKey || currentProgrammerKey !== pendingProgrammerKey) {
    return;
  }
  if (state.programmerHydrationReady !== true) {
    return;
  }

  if (state.cmAvailabilityResolved !== true) {
    return;
  }
  if (state.cmAvailabilityResolved === true && state.cmAvailable === false) {
    clearPendingProgrammerSwitchTransition();
    return;
  }
  if (state.cmAvailable !== true) {
    return;
  }

  if (state.batchRunning || state.workspaceLocked || state.nonCmMode) {
    return;
  }

  const cards =
    Array.isArray(state.pendingAutoRerunCards) && state.pendingAutoRerunCards.length > 0
      ? cloneWorkspaceReplayCards(state.pendingAutoRerunCards)
      : getWorkspaceReplayCards();
  if (cards.length === 0) {
    clearPendingProgrammerSwitchTransition();
    return;
  }

  state.pendingAutoRerunProgrammerKey = "";
  state.autoRerunInFlightProgrammerKey = currentProgrammerKey;
  state.programmerSwitchLoading = true;
  state.programmerSwitchLoadingKey = currentProgrammerKey;
  void autoRerunCardsForProgrammerSwitch(currentProgrammerKey).finally(() => {
    if (String(state.autoRerunInFlightProgrammerKey || "").trim() === currentProgrammerKey) {
      state.autoRerunInFlightProgrammerKey = "";
    }
    if (!String(state.pendingAutoRerunProgrammerKey || "").trim()) {
      state.programmerSwitchLoading = false;
      state.programmerSwitchLoadingKey = "";
    }
    syncActionButtonsDisabled();
  });
}

const CM_WORKSPACE_ROW_FLATTEN_MAX_DEPTH = 4;
const CM_WORKSPACE_ROW_ARRAY_FIELD_LIMIT = 8;
const CM_WORKSPACE_ROW_PREVIEW_LIMIT = 6;
const CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT = 1400;

function truncateText(value, limit = CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT) {
  const text = String(value == null ? "" : value);
  const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT;
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, Math.max(0, max - 1))}…`;
}

function isPrimitiveRowValue(value) {
  return value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function extractRowEntityLabel(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }
  return String(
    firstNonEmptyString([
      value.name,
      value.displayName,
      value.display_name,
      value.title,
      value.label,
      value.consoleId,
      value.consoleOwnerId,
      value.id,
      value.tenantId,
      value.tenant_id,
      value.applicationId,
      value.application_id,
      value.policyId,
      value.policy_id,
      value.ruleId,
      value.rule_id,
      value.type,
      value.key,
    ]) || ""
  ).trim();
}

function summarizeObjectRowValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return normalizeRowValue(value);
  }
  const keys = Object.keys(value).map((key) => String(key || "").trim()).filter(Boolean);
  if (keys.length === 0) {
    return "(empty object)";
  }
  const label = extractRowEntityLabel(value);
  const preview = keys.slice(0, 4).join(", ");
  const more = keys.length > 4 ? ` (+${keys.length - 4} more)` : "";
  return truncateText(label ? `${label} | ${preview}${more}` : `${preview}${more}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
}

function summarizeArrayRowValue(value) {
  if (!Array.isArray(value)) {
    return normalizeRowValue(value);
  }
  if (value.length === 0) {
    return "";
  }
  if (value.every((item) => isPrimitiveRowValue(item))) {
    return truncateText(
      value
        .map((item) => (item == null ? "" : String(item)))
        .filter((item) => String(item).trim() !== "")
        .join(", "),
      CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT
    );
  }
  const labels = [];
  value.forEach((item) => {
    if (labels.length >= CM_WORKSPACE_ROW_PREVIEW_LIMIT) {
      return;
    }
    if (isPrimitiveRowValue(item)) {
      const normalized = String(item == null ? "" : item).trim();
      if (normalized) {
        labels.push(normalized);
      }
      return;
    }
    if (Array.isArray(item)) {
      labels.push(`${item.length} item${item.length === 1 ? "" : "s"}`);
      return;
    }
    if (item && typeof item === "object") {
      const label = extractRowEntityLabel(item);
      if (label) {
        labels.push(label);
        return;
      }
      const keyPreview = Object.keys(item)
        .map((key) => String(key || "").trim())
        .filter(Boolean)
        .slice(0, 2)
        .join("/");
      if (keyPreview) {
        labels.push(keyPreview);
      }
    }
  });
  const labelPrefix = labels.length > 0 ? `: ${labels.join(", ")}` : "";
  const overflow = value.length > CM_WORKSPACE_ROW_PREVIEW_LIMIT ? ` (+${value.length - CM_WORKSPACE_ROW_PREVIEW_LIMIT} more)` : "";
  return truncateText(
    `${value.length} item${value.length === 1 ? "" : "s"}${labelPrefix}${overflow}`,
    CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT
  );
}

function collectArrayRowObjectFields(values) {
  const fields = [];
  const seen = new Set();
  values.slice(0, CM_WORKSPACE_ROW_PREVIEW_LIMIT).forEach((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return;
    }
    Object.keys(entry).forEach((rawKey) => {
      const key = String(rawKey || "").trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      fields.push(key);
    });
  });
  return fields.slice(0, CM_WORKSPACE_ROW_ARRAY_FIELD_LIMIT);
}

function normalizeRowValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    if (value.every((item) => isPrimitiveRowValue(item))) {
      return truncateText(
        value
          .map((item) => (item == null ? "" : String(item)))
          .filter((item) => String(item).trim() !== "")
          .join(", "),
        CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT
      );
    }
    return summarizeArrayRowValue(value);
  }
  if (typeof value === "object") {
    return summarizeObjectRowValue(value);
  }
  return truncateText(String(value), CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
}

function flattenValueIntoRow(row, keyPrefix, value, depth = 0, seen = null) {
  const key = String(keyPrefix || "value").trim() || "value";
  const seenRefs = seen instanceof Set ? seen : new Set();

  if (isPrimitiveRowValue(value)) {
    row[key] = normalizeRowValue(value);
    return;
  }

  if (depth >= CM_WORKSPACE_ROW_FLATTEN_MAX_DEPTH) {
    row[key] = normalizeRowValue(value);
    return;
  }

  if (typeof value === "object") {
    if (seenRefs.has(value)) {
      row[key] = "(circular reference)";
      return;
    }
    seenRefs.add(value);
  }

  if (Array.isArray(value)) {
    row[`${key}.count`] = value.length;
    row[key] = summarizeArrayRowValue(value);
    if (value.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
      const fields = collectArrayRowObjectFields(value);
      fields.forEach((field) => {
        const valuesByField = [];
        const valueSeen = new Set();
        value.forEach((entry) => {
          const normalizedValue = normalizeRowValue(entry?.[field]);
          const normalizedText = String(normalizedValue == null ? "" : normalizedValue).trim();
          if (!normalizedText || valueSeen.has(normalizedText)) {
            return;
          }
          valueSeen.add(normalizedText);
          valuesByField.push(normalizedText);
        });
        if (valuesByField.length > 0) {
          const preview = valuesByField.slice(0, CM_WORKSPACE_ROW_PREVIEW_LIMIT).join(", ");
          const overflow = valuesByField.length > CM_WORKSPACE_ROW_PREVIEW_LIMIT ? ` (+${valuesByField.length - CM_WORKSPACE_ROW_PREVIEW_LIMIT} more)` : "";
          row[`${key}.${field}`] = truncateText(`${preview}${overflow}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
        }
      });
    }
    return;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      row[key] = "(empty object)";
      return;
    }
    entries.forEach(([nestedKey, nestedValue]) => {
      const childKey = String(nestedKey || "").trim();
      if (!childKey) {
        return;
      }
      flattenValueIntoRow(row, `${key}.${childKey}`, nestedValue, depth + 1, seenRefs);
    });
    return;
  }

  row[key] = normalizeRowValue(value);
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const normalized = {};
      const seenRefs = new Set();
      Object.entries(row).forEach(([key, value]) => {
        const normalizedKey = String(key || "").trim();
        if (!normalizedKey) {
          return;
        }
        flattenValueIntoRow(normalized, normalizedKey, value, 0, seenRefs);
      });
      if (Object.keys(normalized).length === 0) {
        normalized.value = summarizeObjectRowValue(row);
      }
      return normalized;
    });
}

function normalizeCmLocalColumnFilters(rawFilters, cardState = null) {
  const output = new Map();
  const appendValues = (columnName, values) => {
    const normalizedColumn = normalizeCmColumnName(columnName);
    if (!normalizedColumn || !isFilterableCmuColumn(cardState, normalizedColumn)) {
      return;
    }
    const nextValues = new Set();
    (Array.isArray(values) ? values : []).forEach((value) => {
      const normalizedValue = String(value || "").trim();
      if (!normalizedValue) {
        return;
      }
      nextValues.add(normalizedValue);
    });
    if (nextValues.size > 0) {
      output.set(normalizedColumn, nextValues);
    }
  };

  if (rawFilters instanceof Map) {
    rawFilters.forEach((values, columnName) => {
      appendValues(columnName, values instanceof Set ? [...values] : values);
    });
    return output;
  }
  if (Array.isArray(rawFilters)) {
    rawFilters.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      appendValues(entry.column, entry.values);
    });
    return output;
  }
  if (rawFilters && typeof rawFilters === "object") {
    Object.entries(rawFilters).forEach(([columnName, values]) => {
      appendValues(columnName, values);
    });
  }
  return output;
}

function serializeCmLocalColumnFilters(filterMap, cardState = null) {
  const normalized = normalizeCmLocalColumnFilters(filterMap, cardState);
  const output = {};
  [...normalized.keys()]
    .sort()
    .forEach((columnName) => {
      const values = normalized.get(columnName) || new Set();
      const sortedValues = [...values].sort((left, right) => compareCmColumnValues(left, right));
      if (sortedValues.length > 0) {
        output[columnName] = sortedValues;
      }
    });
  return output;
}

function hasCmLocalColumnFilters(filterMap, cardState = null) {
  const normalized = normalizeCmLocalColumnFilters(filterMap, cardState);
  let hasAny = false;
  normalized.forEach((values) => {
    if (values instanceof Set && values.size > 0) {
      hasAny = true;
    }
  });
  return hasAny;
}

function cmMatchesLocalFilterValue(rowValue, selectedValues) {
  if (!selectedValues || selectedValues.size === 0 || rowValue == null) {
    return false;
  }

  const rowText = String(rowValue).trim();
  if (!rowText) {
    return false;
  }

  if (selectedValues.has(rowText)) {
    return true;
  }

  const rowLower = rowText.toLowerCase();
  const rowNumber = Number(rowText);
  const rowIsNumber = Number.isFinite(rowNumber);

  for (const selectedValue of selectedValues) {
    const selectedText = String(selectedValue || "").trim();
    if (!selectedText) {
      continue;
    }
    if (selectedText.toLowerCase() === rowLower) {
      return true;
    }
    if (rowIsNumber) {
      const selectedNumber = Number(selectedText);
      if (Number.isFinite(selectedNumber) && selectedNumber === rowNumber) {
        return true;
      }
    }
  }

  return false;
}

function applyCmLocalColumnFiltersToRows(rows, filterMap, cardState = null) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) {
    return list;
  }

  const normalizedFilters = normalizeCmLocalColumnFilters(filterMap, cardState);
  const entries = [...normalizedFilters.entries()].filter(
    ([columnName, values]) => String(columnName || "").trim() && values instanceof Set && values.size > 0
  );
  if (!entries.length) {
    return list;
  }

  return list.filter((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return false;
    }
    for (const [columnName, values] of entries) {
      if (!cmMatchesLocalFilterValue(getRowValueByColumn(row, columnName), values)) {
        return false;
      }
    }
    return true;
  });
}

function buildCmDistinctValuesForColumns(rows, columns) {
  const distinct = new Map();
  (Array.isArray(columns) ? columns : []).forEach((columnName) => {
    const normalized = normalizeCmColumnName(columnName);
    if (!normalized) {
      return;
    }
    distinct.set(normalized, new Set());
  });
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return;
    }
    distinct.forEach((set, columnName) => {
      const raw = getRowValueByColumn(row, columnName);
      if (raw == null) {
        return;
      }
      const normalizedValue = String(raw).trim();
      if (!normalizedValue) {
        return;
      }
      set.add(normalizedValue);
    });
  });

  const output = new Map();
  distinct.forEach((set, columnName) => {
    if (!set || set.size === 0) {
      return;
    }
    output.set(
      columnName,
      [...set].sort((left, right) => compareCmColumnValues(left, right))
    );
  });
  return output;
}

function initializeCardLocalFilterBaseline(cardState, rows) {
  if (!cardState || !isCmuUsageCard(cardState) || !Array.isArray(rows) || rows.length === 0) {
    return;
  }
  if (!cardState.localHasBaselineData) {
    const rowSample = rows[0] && typeof rows[0] === "object" ? rows[0] : {};
    const fallbackColumns = Object.keys(rowSample)
      .map((columnName) => normalizeCmColumnName(columnName))
      .filter((columnName) => isFilterableCmuColumn(cardState, columnName));
    const candidateColumns = (Array.isArray(cardState.columns) ? cardState.columns : [])
      .map((columnName) => normalizeCmColumnName(columnName))
      .filter((columnName) => isFilterableCmuColumn(cardState, columnName));
    const baselineColumns = candidateColumns.length > 0 ? candidateColumns : fallbackColumns;
    const distinct = buildCmDistinctValuesForColumns(rows, baselineColumns);
    cardState.localDistinctByColumn.clear();
    distinct.forEach((values, columnName) => {
      if (Array.isArray(values) && values.length > 0) {
        cardState.localDistinctByColumn.set(columnName, values);
      }
    });
    cardState.localHasBaselineData = cardState.localDistinctByColumn.size > 0;
  }

  if (!cardState.localHasBaselineData) {
    return;
  }
  const nextFilters = normalizeCmLocalColumnFilters(cardState.localColumnFilters, cardState);
  const prunedFilters = new Map();
  nextFilters.forEach((values, columnName) => {
    const allowed = new Set(cardState.localDistinctByColumn.get(columnName) || []);
    if (allowed.size === 0) {
      return;
    }
    const retained = new Set([...values].filter((value) => allowed.has(value)));
    if (retained.size > 0) {
      prunedFilters.set(columnName, retained);
    }
  });
  cardState.localColumnFilters = prunedFilters;
}

function appendCmLocalColumnFiltersToUrl(urlValue, filterMap, cardState = null) {
  const rawUrl = String(urlValue || "").trim();
  if (!rawUrl) {
    return "";
  }
  const normalized = normalizeCmLocalColumnFilters(filterMap, cardState);
  if (normalized.size === 0) {
    return rawUrl;
  }

  try {
    const parsed = new URL(rawUrl);
    normalized.forEach((_values, columnName) => {
      parsed.searchParams.delete(columnName);
    });
    normalized.forEach((values, columnName) => {
      [...values]
        .sort((left, right) => compareCmColumnValues(left, right))
        .forEach((value) => {
          parsed.searchParams.append(columnName, value);
        });
    });
    return parsed.toString();
  } catch (_error) {
    const queryParts = [];
    normalized.forEach((values, columnName) => {
      [...values]
        .sort((left, right) => compareCmColumnValues(left, right))
        .forEach((value) => {
          queryParts.push(`${encodeURIComponent(columnName)}=${encodeURIComponent(value)}`);
        });
    });
    if (queryParts.length === 0) {
      return rawUrl;
    }
    const separator = rawUrl.includes("?") ? "&" : "?";
    return `${rawUrl}${separator}${queryParts.join("&")}`;
  }
}

function getCardBaseRequestUrl(cardState) {
  return String(cardState?.baseRequestUrl || cardState?.requestUrl || cardState?.endpointUrl || "").trim();
}

function getCardEffectiveRequestUrl(cardState) {
  const baseRequestUrl = getCardBaseRequestUrl(cardState);
  if (!baseRequestUrl) {
    return "";
  }
  if (!isCmuUsageCard(cardState)) {
    return baseRequestUrl;
  }
  return appendCmLocalColumnFiltersToUrl(baseRequestUrl, cardState?.localColumnFilters, cardState);
}

function buildCardDisplayRequestUrl(cardState) {
  const sourceRaw = firstNonEmptyString([
    String(cardState?.requestUrl || "").trim(),
    String(cardState?.baseRequestUrl || "").trim(),
    String(cardState?.seedBaseRequestUrl || "").trim(),
    String(cardState?.seedRequestUrl || "").trim(),
    String(cardState?.seedEndpointUrl || "").trim(),
    String(cardState?.endpointUrl || "").trim(),
  ]);
  if (!sourceRaw) {
    return "";
  }

  const normalizedFilters = normalizeCmLocalColumnFilters(cardState?.localColumnFilters, cardState);
  const nextPairs = parseRawQueryPairs(sourceRaw).filter((pair) => {
    if (!pair?.hasValue) {
      return true;
    }
    const normalizedKey = normalizeCmColumnName(pair?.key);
    if (!normalizedKey || !normalizedFilters.has(normalizedKey)) {
      return true;
    }
    return false;
  });

  normalizedFilters.forEach((values, columnName) => {
    [...values]
      .sort((left, right) => compareCmColumnValues(left, right))
      .forEach((value) => {
        nextPairs.push({
          key: columnName,
          value,
          hasValue: true,
        });
      });
  });

  const queryText = nextPairs
    .map((pair) => {
      const key = encodeURIComponent(String(pair?.key || "").trim()).replace(/%20/g, "+");
      if (!key) {
        return "";
      }
      if (pair?.hasValue && String(pair?.value || "").trim().length > 0) {
        return `${key}=${String(pair?.value || "")}`;
      }
      if (pair?.hasAssignment === true) {
        return `${key}=`;
      }
      return key;
    })
    .filter(Boolean)
    .join("&");

  try {
    const parsed = new URL(sourceRaw);
    parsed.hash = "";
    parsed.search = queryText ? `?${queryText}` : "";
    return parsed.toString();
  } catch (_error) {
    const pathOnly = sourceRaw.split(/[?#]/, 1)[0] || sourceRaw;
    return queryText ? `${pathOnly}?${queryText}` : pathOnly;
  }
}

function getComparableValue(row, header) {
  const value = getRowValueByColumn(row, header);
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && String(value).trim() !== "") {
    return asNumber;
  }
  return String(value || "").toLowerCase();
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeRate(numerator, denominator) {
  const n = toNumber(numerator);
  const d = toNumber(denominator);
  if (n == null || d == null || d <= 0) {
    return null;
  }
  const rate = n / d;
  return Number.isFinite(rate) ? rate : null;
}

function parseCmuTimestampCandidate(row) {
  const timestampCandidate =
    getRowValueByColumn(row, "timestamp") ??
    getRowValueByColumn(row, "date") ??
    getRowValueByColumn(row, "time");
  if (timestampCandidate == null || timestampCandidate === "") {
    return Number.NaN;
  }
  const parsed = new Date(timestampCandidate);
  const ms = parsed.getTime();
  return Number.isFinite(ms) ? ms : Number.NaN;
}

function formatPercent(rate) {
  if (rate == null) {
    return "—";
  }
  return `${(rate * 100).toFixed(2)}%`;
}

function cmuPartsToUtcMs(row) {
  const rawYear = toNumber(getRowValueByColumn(row, "year"));
  const rawMonth = toNumber(getRowValueByColumn(row, "month"));
  const rawDay = toNumber(getRowValueByColumn(row, "day"));
  const rawHour = toNumber(getRowValueByColumn(row, "hour"));
  const rawMinute = toNumber(getRowValueByColumn(row, "minute"));
  const hasAnyParts = [rawYear, rawMonth, rawDay, rawHour, rawMinute].some((value) => value != null);
  if (!hasAnyParts) {
    return parseCmuTimestampCandidate(row);
  }

  const nowPst = new Date(Date.now() + CM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000);
  const fallbackYear = nowPst.getUTCFullYear();
  const year = rawYear ?? fallbackYear;
  const month = rawMonth ?? 1;
  const day = rawDay ?? 1;
  const hour = rawHour ?? 0;
  const minute = rawMinute ?? 0;

  const ms =
    Date.UTC(
      Number.isFinite(year) ? year : fallbackYear,
      Math.max(0, (Number.isFinite(month) ? month : 1) - 1),
      Number.isFinite(day) ? day : 1,
      Number.isFinite(hour) ? hour : 0,
      Number.isFinite(minute) ? minute : 0
    ) -
    CM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000;
  if (Number.isFinite(ms)) {
    return ms;
  }
  return parseCmuTimestampCandidate(row);
}

function hasCmuUsageDate(row) {
  const ms = cmuPartsToUtcMs(row);
  return Number.isFinite(ms);
}

function buildCmuDateLabel(row) {
  const ms = cmuPartsToUtcMs(row);
  if (!Number.isFinite(ms)) {
    return "";
  }
  const date = new Date(ms);
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

function getCmuUsageCellValue(row, columnKey, context = {}) {
  if (columnKey === "DATE") {
    const dateMs = cmuPartsToUtcMs(row);
    return Number.isFinite(dateMs) ? dateMs : -Infinity;
  }
  if (context.hasAuthN && columnKey === "AuthN Success") {
    const rate = safeRate(getRowValueByColumn(row, "authn-successful"), getRowValueByColumn(row, "authn-attempts"));
    return rate == null ? -1 : rate;
  }
  if (context.hasAuthZ && columnKey === "AuthZ Success") {
    const rate = safeRate(getRowValueByColumn(row, "authz-successful"), getRowValueByColumn(row, "authz-attempts"));
    return rate == null ? -1 : rate;
  }
  if (columnKey === "COUNT") {
    const value = toNumber(getRowValueByColumn(row, "count"));
    return value == null ? 0 : value;
  }
  return getComparableValue(row, columnKey);
}

function sortRows(rows, sortStack, context = null) {
  const fallbackStack =
    context?.mode === "cmu-usage"
      ? getDefaultCmuUsageSortStack()
      : Array.isArray(context?.headers) && context.headers.length > 0
        ? buildDefaultSortStack(context.headers)
        : [];
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? [sortStack[0]] : fallbackStack.slice(0, 1);
  if (stack.length === 0) {
    return [...rows];
  }

  const [rule] = stack;
  return [...rows].sort((left, right) => {
    const factor = rule.dir === "ASC" ? 1 : -1;
    const leftValue =
      context?.mode === "cmu-usage"
        ? getCmuUsageCellValue(left, rule.col, context)
        : getComparableValue(left, rule.col);
    const rightValue =
      context?.mode === "cmu-usage"
        ? getCmuUsageCellValue(right, rule.col, context)
        : getComparableValue(right, rule.col);
    if (leftValue < rightValue) {
      return -1 * factor;
    }
    if (leftValue > rightValue) {
      return 1 * factor;
    }
    if (context?.mode === "cmu-usage") {
      return getCmuUsageCellValue(right, "DATE", context) - getCmuUsageCellValue(left, "DATE", context);
    }
    return 0;
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  const text = value == null ? "" : String(value);
  cell.textContent = text;
  cell.title = text;
  return cell;
}

function createActionCell(row, header) {
  const actionKey = String(header || "").trim().toUpperCase();
  if (actionKey !== "VIEW") {
    return createCell(getRowValueByColumn(row, header) ?? "");
  }

  const targetRecordId = String(row?.__cmViewRecordId || "").trim();
  if (!targetRecordId) {
    return createCell(getRowValueByColumn(row, header) ?? "");
  }

  const cell = document.createElement("td");
  const actionLink = document.createElement("a");
  actionLink.href = "#";
  actionLink.className = "cm-view-link";
  actionLink.textContent = String(getRowValueByColumn(row, header) || "VIEW");
  actionLink.title = "Load details in CM Workspace";
  actionLink.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!ensureWorkspaceUnlocked()) {
      return;
    }
    const result = await sendWorkspaceAction("run-card", {
      card: {
        cardId: targetRecordId,
      },
      forceRefetch: false,
    });
    if (!result?.ok) {
      setStatus(result?.error || "Unable to load CM detail report.", "error");
    } else {
      setStatus("CM detail report loaded.");
    }
  });
  cell.appendChild(actionLink);
  return cell;
}

function refreshHeaderStates(tableState) {
  if (!tableState?.thead) {
    return;
  }
  tableState.thead.querySelectorAll("th").forEach((headerCell) => {
    if (typeof headerCell._updateState === "function") {
      headerCell._updateState();
    }
  });
}

function renderTableBody(tableState) {
  if (tableState?.mode === "cmu-usage") {
    renderCmuUsageTableBody(tableState);
    return;
  }
  renderGenericTableBody(tableState);
}

function renderGenericTableBody(tableState) {
  tableState.tbody.innerHTML = "";
  tableState.data.forEach((row) => {
    const tr = document.createElement("tr");
    tableState.headers.forEach((header) => {
      tr.appendChild(createActionCell(row, header));
    });
    tableState.tbody.appendChild(tr);
  });
}

function renderCmuUsageTableBody(tableState) {
  tableState.tbody.innerHTML = "";
  tableState.data.forEach((row) => {
    const tr = document.createElement("tr");
    if (tableState.hasDate) {
      tr.appendChild(createCell(buildCmuDateLabel(row)));
    }
    if (tableState.hasAuthN) {
      tr.appendChild(
        createCell(
          formatPercent(safeRate(getRowValueByColumn(row, "authn-successful"), getRowValueByColumn(row, "authn-attempts")))
        )
      );
    }
    if (tableState.hasAuthZ) {
      tr.appendChild(
        createCell(
          formatPercent(safeRate(getRowValueByColumn(row, "authz-successful"), getRowValueByColumn(row, "authz-attempts")))
        )
      );
    }
    if (!tableState.hasAuthN && !tableState.hasAuthZ && tableState.hasCount) {
      tr.appendChild(createCell(getRowValueByColumn(row, "count") ?? ""));
    }
    tableState.displayColumns.forEach((columnName) => {
      tr.appendChild(createCell(getRowValueByColumn(row, columnName) ?? ""));
    });
    tableState.tbody.appendChild(tr);
  });
}

function isBlondieButtonSupported() {
  return !IS_CM_WORKSPACE_TEARSHEET_RUNTIME;
}

function canUseBlondieButton() {
  return state.slackReady === true && isBlondieButtonSupported();
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

function getBlondieButtonTitle(buttonState = "") {
  const normalizedState = BLONDIE_BUTTON_STATES.has(String(buttonState || "").trim().toLowerCase())
    ? String(buttonState || "").trim().toLowerCase()
    : getBlondieButtonDefaultState();
  if (!isBlondieButtonSupported()) {
    return ":blondiebtn: is unavailable in this workspace export.";
  }
  if (normalizedState === "active") {
    return ":blondiebtn: is delivering your Slack CSV...";
  }
  if (normalizedState === "ack") {
    return "Slack acknowledged :blondiebtn: delivery.";
  }
  if (canUseBlondieButton()) {
    return hasBlondieShareTargets()
      ? "Click sends to you. Shift-click opens the Slack note dialog for a pass-transition teammate."
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
  const supported = isBlondieButtonSupported();
  let normalizedState = String(nextState || "").trim().toLowerCase();
  if (!BLONDIE_BUTTON_STATES.has(normalizedState)) {
    normalizedState = getBlondieButtonDefaultState();
  }
  if (!supported) {
    normalizedState = "inactive";
  }
  const title = getBlondieButtonTitle(normalizedState);
  button.hidden = !supported;
  button.disabled = !supported;
  button.dataset.blondieState = normalizedState;
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

function buildBlondieButtonMarkup() {
  const initialState = getBlondieButtonDefaultState();
  const title = escapeHtml(getBlondieButtonTitle(initialState));
  const hiddenAttr = isBlondieButtonSupported() ? "" : " hidden";
  return `<button type="button" class="esm-action-btn underpar-blondie-btn" data-blondie-state="${escapeHtml(initialState)}" title="${title}" aria-label="${title}"${hiddenAttr}>
      <img class="underpar-blondie-icon" src="${escapeHtml(BLONDIE_BUTTON_ICON_URLS[initialState])}" alt="" aria-hidden="true" />
    </button>`;
}

function buildCmBlondieExportPayload(cardState, tableState) {
  const sortRule = cardState?.sortStack?.[0] || tableState?.sortStack?.[0] || null;
  const csvRows = buildStandaloneCsvRows(cardState, sortRule);
  if (csvRows.length <= 1) {
    return null;
  }
  const requestUrl = String(buildCardDisplayRequestUrl(cardState) || getCardEffectiveRequestUrl(cardState) || "").trim();
  const requestPath = normalizeWorkspaceDeeplinkRequestPath(requestUrl);
  const operationLabel = String(cardState?.operation?.label || cardState?.operation?.pathTemplate || "").trim();
  const tenantScope = resolveWorkspaceTenantScope(cardState);
  const displayNodeLabel = operationLabel || getNodeLabel(requestUrl) || "CM Report Card";
  return {
    workspaceKey: "cm",
    workspaceLabel: "CM",
    datasetLabel: displayNodeLabel,
    displayNodeLabel,
    requestUrl,
    requestPath,
    endpointUrl: String(cardState?.endpointUrl || requestUrl || "").trim(),
    baseRequestUrl: String(getCardBaseRequestUrl(cardState) || requestUrl || "").trim(),
    zoomKey: String(cardState?.zoomKey || "").trim(),
    programmerId: String(state.programmerId || "").trim(),
    programmerName: String(state.programmerName || "").trim(),
    tenantId: String(tenantScope || "").trim(),
    tenantName: resolveWorkspaceTenantLabel(cardState),
    adobePassEnvironmentKey: String(state.adobePassEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim(),
    adobePassEnvironmentLabel: String(state.adobePassEnvironment?.label || "").trim(),
    columns: csvRows[0].map((value) => String(value ?? "").trim()).filter(Boolean),
    rows: csvRows.slice(1).map((row) => row.map((value) => String(value ?? ""))),
    rowCount: Math.max(0, csvRows.length - 1),
  };
}

function syncBlondieButtons(root = document) {
  if (!root?.querySelectorAll) {
    return;
  }
  root.querySelectorAll(".underpar-blondie-btn").forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    if (!isBlondieButtonSupported()) {
      renderBlondieButtonState(button, "inactive");
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

function updateTableWrapperViewport(tableState) {
  const wrapper = tableState?.wrapper;
  const table = tableState?.table;
  if (!wrapper || !table) {
    return;
  }

  const totalRows = Array.isArray(tableState.data) ? tableState.data.length : 0;
  const visibleRows = totalRows > 0 ? Math.min(WORKSPACE_TABLE_VISIBLE_ROW_CAP, totalRows) : 1;
  const sampleRow = table.querySelector("tbody tr");
  const headerRow = table.querySelector("thead tr");
  const footerRow = table.querySelector("tfoot tr");

  const rowHeight = sampleRow ? sampleRow.getBoundingClientRect().height : 36;
  const headerHeight = headerRow ? headerRow.getBoundingClientRect().height : 42;
  const footerHeight = footerRow ? footerRow.getBoundingClientRect().height : 40;
  const viewportHeight = Math.ceil(headerHeight + footerHeight + rowHeight * visibleRows + 2);

  wrapper.style.maxHeight = `${viewportHeight}px`;
}

function getCardPayload(cardState) {
  const effectiveRequestUrl = getCardEffectiveRequestUrl(cardState);
  const tenantScope = resolveWorkspaceTenantScope(cardState);
  return {
    cardId: cardState.cardId,
    endpointUrl: cardState.endpointUrl,
    requestUrl: effectiveRequestUrl,
    baseRequestUrl: getCardBaseRequestUrl(cardState),
    seedEndpointUrl: String(cardState?.seedEndpointUrl || "").trim(),
    seedRequestUrl: String(cardState?.seedRequestUrl || "").trim(),
    seedBaseRequestUrl: String(cardState?.seedBaseRequestUrl || "").trim(),
    seedLocalColumnFilters: serializeCmLocalColumnFilters(cardState?.seedLocalColumnFilters, cardState),
    zoomKey: cardState.zoomKey,
    columns: cardState.columns,
    localColumnFilters: serializeCmLocalColumnFilters(cardState?.localColumnFilters, cardState),
    operation: cardState.operation && typeof cardState.operation === "object" ? { ...cardState.operation } : null,
    formValues: cardState.formValues && typeof cardState.formValues === "object" ? { ...cardState.formValues } : {},
    tenantId: String(tenantScope || ""),
    tenantName: resolveWorkspaceTenantLabel(cardState),
  };
}

function getNodeLabel(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "cm";
  }
  try {
    const parsed = new URL(raw);
    const parts = String(parsed.pathname || "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return decodeURIComponent(parts[parts.length - 1]);
    }
  } catch {
    // Ignore parse errors.
  }
  return raw;
}

function cloneCmLocalFilterState(filterState, cardState = null) {
  return normalizeCmLocalColumnFilters(filterState, cardState);
}

function hasStoredSeedQueryState(cardState) {
  if (!cardState) {
    return false;
  }
  return (
    String(cardState.seedEndpointUrl || cardState.seedRequestUrl || cardState.seedBaseRequestUrl || "").trim().length > 0 ||
    hasCmLocalColumnFilters(cardState.seedLocalColumnFilters, cardState)
  );
}

function areCmLocalFilterMapsEqual(leftFilters, rightFilters, cardState = null) {
  const left = normalizeCmLocalColumnFilters(leftFilters, cardState);
  const right = normalizeCmLocalColumnFilters(rightFilters, cardState);
  if (left.size !== right.size) {
    return false;
  }
  for (const [columnName, leftValues] of left.entries()) {
    const rightValues = right.get(columnName);
    if (!(rightValues instanceof Set) || leftValues.size !== rightValues.size) {
      return false;
    }
    for (const value of leftValues) {
      if (!rightValues.has(value)) {
        return false;
      }
    }
  }
  return true;
}

function snapshotCardStartingFilterState(cardState) {
  if (!cardState) {
    return;
  }
  cardState.startingUiLocalColumnFilters = cloneCmLocalFilterState(cardState.localColumnFilters, cardState);
  cardState.startingUiPersistentQuerySignature = buildCardPersistentQuerySignature(
    cardState,
    getCardEffectiveRequestUrl(cardState) || cardState.requestUrl || cardState.endpointUrl || ""
  );
  cardState.startingUiStateCaptured = true;
}

function isCardAtStartingFilterState(cardState) {
  if (!cardState?.startingUiStateCaptured) {
    return !hasCmLocalColumnFilters(cardState?.localColumnFilters, cardState);
  }
  return (
    areCmLocalFilterMapsEqual(cardState?.localColumnFilters, cardState?.startingUiLocalColumnFilters, cardState) &&
    buildCardPersistentQuerySignature(
      cardState,
      getCardEffectiveRequestUrl(cardState) || cardState?.requestUrl || cardState?.endpointUrl || ""
    ) === String(cardState?.startingUiPersistentQuerySignature || "[]")
  );
}

function restoreCardSeedQueryState(cardState) {
  if (!cardState || !hasStoredSeedQueryState(cardState)) {
    return false;
  }
  teardownCardHeaderQueryEditors(cardState);
  cardState.endpointUrl = String(cardState.seedEndpointUrl || cardState.endpointUrl || "").trim();
  cardState.baseRequestUrl = String(
    cardState.seedBaseRequestUrl || cardState.seedRequestUrl || cardState.seedEndpointUrl || cardState.baseRequestUrl || ""
  ).trim();
  cardState.requestUrl = String(
    appendCmLocalColumnFiltersToUrl(cardState.baseRequestUrl, cardState.seedLocalColumnFilters, cardState) ||
      cardState.baseRequestUrl ||
      cardState.requestUrl ||
      cardState.endpointUrl ||
      ""
  ).trim();
  cardState.localColumnFilters = cloneCmLocalFilterState(cardState.seedLocalColumnFilters, cardState);
  cardState.pickerOpenColumn = "";
  return true;
}

function safeDecodeUrlSegment(segment) {
  const raw = String(segment || "");
  try {
    return decodeURIComponent(raw);
  } catch (_error) {
    return raw;
  }
}

function isLikelyRequestUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  if (/^https?:\/\//i.test(raw)) {
    return true;
  }
  if (raw.startsWith("/")) {
    return true;
  }
  return /^[a-z0-9._~-]+\/[^\s]+$/i.test(raw);
}

function parseRawQueryPairs(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!isLikelyRequestUrl(raw)) {
    return [];
  }
  const queryIndex = raw.indexOf("?");
  if (queryIndex < 0) {
    return [];
  }
  const hashIndex = raw.indexOf("#", queryIndex + 1);
  const queryText = raw.slice(queryIndex + 1, hashIndex >= 0 ? hashIndex : undefined).trim();
  if (!queryText) {
    return [];
  }
  return queryText
    .split("&")
    .map((entry) => String(entry || "").trim())
    .filter(Boolean)
    .map((entry) => {
      const equalsIndex = entry.indexOf("=");
      if (equalsIndex < 0) {
        return {
          key: safeDecodeUrlSegment(entry.replace(/\+/g, " ")),
          value: "",
          hasValue: false,
          hasAssignment: false,
        };
      }
      const key = safeDecodeUrlSegment(entry.slice(0, equalsIndex).replace(/\+/g, " "));
      const value = entry.slice(equalsIndex + 1);
      return {
        key,
        value,
        hasValue: String(value || "").trim().length > 0,
        hasAssignment: true,
      };
    });
}

function normalizeDisplayDimensionFromQueryKey(columnName = "") {
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized) {
    return "";
  }
  return normalized.endsWith("!") ? normalized.slice(0, -1) : normalized;
}

function decodeQueryPairValue(value = "") {
  return safeDecodeUrlSegment(String(value || "").replace(/\+/g, " ")).trim();
}

function isEditableCardQueryKey(columnName = "") {
  return CM_CARD_EDITABLE_QUERY_KEYS.has(normalizeCmColumnName(columnName));
}

function normalizeEditableQueryDateTimeValue(value = "") {
  const decoded = decodeQueryPairValue(value);
  if (!decoded) {
    return "";
  }
  const normalized = decoded.replace(/\s+/, "T");
  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/i);
  if (match) {
    return `${match[1]}T${match[2]}`;
  }
  return "";
}

function buildCardPersistentQuerySignature(cardState, urlValue = "") {
  const sourceRaw = String(urlValue || "").trim();
  if (!sourceRaw) {
    return "[]";
  }

  const controlColumns = new Set(normalizeCmLocalColumnFilters(cardState?.localColumnFilters, cardState).keys());
  const signature = parseRawQueryPairs(sourceRaw)
    .map((pair) => {
      const normalizedKey = normalizeDisplayDimensionFromQueryKey(pair?.key);
      if (!normalizedKey || CM_WORKSPACE_EXPORT_FILE_SYSTEM_QUERY_KEYS.has(normalizedKey) || controlColumns.has(normalizedKey)) {
        return null;
      }
      return {
        key: normalizedKey,
        operator: normalizeCmColumnName(pair?.key).endsWith("!")
          ? "!="
          : pair?.hasAssignment === true || pair?.hasValue
            ? "="
            : "",
        value: pair?.hasAssignment === true || pair?.hasValue ? decodeQueryPairValue(pair?.value) : "",
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftKey = `${left.key}\u0000${left.operator}\u0000${left.value}`;
      const rightKey = `${right.key}\u0000${right.operator}\u0000${right.value}`;
      return leftKey.localeCompare(rightKey, undefined, { numeric: true, sensitivity: "base" });
    });

  return JSON.stringify(signature);
}

function updateUrlQueryParamValue(urlValue = "", key = "", value = "") {
  const rawUrl = String(urlValue || "").trim();
  const normalizedKey = normalizeCmColumnName(key);
  if (!rawUrl || !normalizedKey) {
    return rawUrl;
  }
  try {
    const parsed = new URL(rawUrl, window.location.href);
    parsed.hash = "";
    parsed.searchParams.delete(normalizedKey);
    const normalizedValue = String(value || "").trim();
    if (normalizedValue) {
      parsed.searchParams.append(normalizedKey, normalizedValue);
    }
    return parsed.toString();
  } catch (_error) {
    return rawUrl;
  }
}

function updateCardEditableQueryValue(cardState, key, value) {
  if (!cardState) {
    return;
  }
  const normalizedKey = normalizeCmColumnName(key);
  if (!isEditableCardQueryKey(normalizedKey)) {
    return;
  }
  const nextValue = String(value || "").trim();
  const liveBaseRequestUrl = getCardBaseRequestUrl(cardState) || String(cardState.requestUrl || cardState.endpointUrl || "").trim();
  const nextBaseRequestUrl = updateUrlQueryParamValue(liveBaseRequestUrl, normalizedKey, nextValue);
  cardState.baseRequestUrl = nextBaseRequestUrl;
  cardState.requestUrl = appendCmLocalColumnFiltersToUrl(nextBaseRequestUrl, cardState?.localColumnFilters, cardState);
}

function parseCmRequestContext(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!isLikelyRequestUrl(raw)) {
    return {
      fullUrl: "",
      hiddenPathSegments: [],
      pathSegments: [],
      queryPairs: [],
    };
  }

  let fullPathSegments = [];
  try {
    const parsed = new URL(raw);
    fullPathSegments = String(parsed.pathname || "")
      .split("/")
      .map((segment) => safeDecodeUrlSegment(segment.trim()))
      .filter(Boolean);
  } catch (_error) {
    fullPathSegments = String(raw.split(/[?#]/, 1)[0] || "")
      .split("/")
      .map((segment) => safeDecodeUrlSegment(segment.trim()))
      .filter(Boolean);
  }

  const normalizedFullPathSegments = fullPathSegments
    .map((segment) => String(segment || "").trim())
    .filter(Boolean);
  let hiddenPathSegments = [];
  let displayPathSegments = normalizedFullPathSegments;
  if (normalizedFullPathSegments.length > 1 && String(normalizedFullPathSegments[0]).toLowerCase() === "v2") {
    hiddenPathSegments = [normalizedFullPathSegments[0]];
    displayPathSegments = normalizedFullPathSegments.slice(1);
  }

  return {
    fullUrl: raw,
    hiddenPathSegments,
    pathSegments: displayPathSegments,
    queryPairs: parseRawQueryPairs(raw),
  };
}

function buildPathEndpointUrl(baseEndpointUrl, pathSegments, depth) {
  const normalizedDepth = Number(depth);
  if (!Number.isInteger(normalizedDepth) || normalizedDepth < 1) {
    return "";
  }
  const normalizedSegments = (Array.isArray(pathSegments) ? pathSegments : [])
    .map((segment) => String(segment || "").trim())
    .filter(Boolean)
    .slice(0, normalizedDepth);
  if (normalizedSegments.length === 0) {
    return "";
  }

  const targetPath = normalizedSegments.join("/");
  const fallback = `/${targetPath}`;
  const rawBase = String(baseEndpointUrl || "").trim();
  if (!rawBase) {
    return fallback;
  }

  try {
    const parsed = new URL(rawBase);
    parsed.pathname = fallback;
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch (_error) {
    return fallback;
  }
}

function buildInheritedRequestUrl(endpointUrl, sourceRequestUrl, tenantScope = "") {
  const endpointRaw = String(endpointUrl || "").trim();
  if (!endpointRaw) {
    return "";
  }

  try {
    const endpointParsed = new URL(endpointRaw);
    endpointParsed.search = "";
    endpointParsed.hash = "";

    const sourceRaw = String(sourceRequestUrl || "").trim();
    if (!sourceRaw) {
      return applyWorkspaceTenantScopeToUsageUrl(endpointParsed.toString(), tenantScope);
    }

    const sourceParsed = new URL(sourceRaw);
    sourceParsed.searchParams.forEach((value, key) => {
      endpointParsed.searchParams.append(key, value);
    });
    return applyWorkspaceTenantScopeToUsageUrl(endpointParsed.toString(), tenantScope);
  } catch (_error) {
    const endpointWithoutHash = endpointRaw.split("#", 1)[0];
    const endpointBase = endpointWithoutHash.split("?", 1)[0];
    const sourceRaw = String(sourceRequestUrl || "").trim();
    const sourceQueryIndex = sourceRaw.indexOf("?");
    if (sourceQueryIndex < 0) {
      return endpointBase;
    }
    const sourceHashIndex = sourceRaw.indexOf("#", sourceQueryIndex + 1);
    const sourceQuery = sourceRaw.slice(sourceQueryIndex + 1, sourceHashIndex >= 0 ? sourceHashIndex : undefined).trim();
    if (!sourceQuery) {
      return applyWorkspaceTenantScopeToUsageUrl(endpointBase, tenantScope);
    }
    return applyWorkspaceTenantScopeToUsageUrl(`${endpointBase}?${sourceQuery}`, tenantScope);
  }
}

function buildWorkspaceCardId(prefix = "workspace") {
  const normalizedPrefix = String(prefix || "workspace").replace(/[^a-z0-9_-]+/gi, "-");
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${normalizedPrefix}-${crypto.randomUUID()}`;
  }
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${normalizedPrefix}-${stamp}-${random}`;
}

function buildCardHeaderContextMarkup(urlValue, endpointUrl = "") {
  const context = parseCmRequestContext(urlValue);
  if (!context.fullUrl) {
    return '<span class="card-url-empty">No CM URL</span>';
  }

  const hiddenPathSegments = Array.isArray(context.hiddenPathSegments)
    ? context.hiddenPathSegments
    : [];
  const visiblePathSegments = Array.isArray(context.pathSegments)
    ? context.pathSegments
    : [];
  const fullPathSegments = [...hiddenPathSegments, ...visiblePathSegments];
  const visibleOffset = hiddenPathSegments.length;

  const pathMarkup =
    visiblePathSegments.length > 0
      ? visiblePathSegments
          .map((segment, index) => {
            const segmentClass = `card-url-path-segment${index === visiblePathSegments.length - 1 ? " card-url-path-segment-terminal" : ""}`;
            const segmentEndpointUrl = buildPathEndpointUrl(endpointUrl || context.fullUrl, fullPathSegments, visibleOffset + index + 1);
            const segmentText = escapeHtml(segment);
            const segmentMarkup = segmentEndpointUrl
              ? `<a class="${segmentClass} card-url-path-link" href="${escapeHtml(segmentEndpointUrl)}" data-endpoint-url="${escapeHtml(
                  segmentEndpointUrl
                )}" data-source-request-url="${escapeHtml(context.fullUrl)}">${segmentText}</a>`
              : `<span class="${segmentClass}">${segmentText}</span>`;
            return `${segmentMarkup}${
              index < visiblePathSegments.length - 1 ? '<span class="card-url-path-divider">/</span>' : ""
            }`;
          })
          .join("")
      : '<span class="card-url-path-segment card-url-path-segment-empty">cm</span>';

  const queryChips = context.queryPairs
    .map((pair) => {
      const rawKey = String(pair?.key || "").trim();
      const normalizedKey = normalizeDisplayDimensionFromQueryKey(rawKey);
      if (CM_QUERY_CONTEXT_HIDDEN_KEYS.has(normalizedKey)) {
        return "";
      }
      const hasRenderableValue = pair?.hasValue === true && String(pair?.value || "").trim().length > 0;
      const isNotEquals = hasRenderableValue && rawKey.endsWith("!");
      const keyLabel = isNotEquals ? rawKey.slice(0, -1) : rawKey;
      const keyHtml = `<span class="card-url-query-key">${escapeHtml(keyLabel)}</span>`;
      if (!hasRenderableValue) {
        return `<span class="card-url-query-chip">${keyHtml}</span>`;
      }
      const decodedValue = decodeQueryPairValue(pair.value);
      const inputValue = normalizeEditableQueryDateTimeValue(decodedValue);
      const isEditable = !isNotEquals && isEditableCardQueryKey(keyLabel) && Boolean(inputValue);
      if (isEditable) {
        return `<span class="card-url-query-chip card-url-query-chip--editable" data-query-key="${escapeHtml(
          keyLabel
        )}">${keyHtml}<span class="card-url-query-eq">=</span><button type="button" class="card-url-query-value-btn" data-query-editor-key="${escapeHtml(
          keyLabel
        )}" data-query-editor-value="${escapeHtml(inputValue)}" title="Edit ${escapeHtml(
          keyLabel
        )}">${escapeHtml(decodedValue || pair.value)}</button><span class="card-url-query-editor" hidden><input type="datetime-local" class="card-url-query-datetime-input" data-query-input-key="${escapeHtml(
          keyLabel
        )}" value="${escapeHtml(inputValue)}" /></span></span>`;
      }
      return `<span class="card-url-query-chip">${keyHtml}<span class="card-url-query-eq">${
        isNotEquals ? "!=" : "="
      }</span><span class="card-url-query-value">${escapeHtml(decodedValue || pair.value)}</span></span>`;
    })
    .filter(Boolean);
  const queryMarkup = queryChips.length > 0 ? queryChips.join("") : "";

  return `
    <span class="card-url-context" aria-label="CM request context">
      <span class="card-url-path" aria-label="CM path">${pathMarkup}</span>
      <span class="card-url-query-cloud" aria-label="CM query context">${queryMarkup}</span>
    </span>
  `;
}

function getWorkspaceEndpointKey(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${normalizedPath}`.toLowerCase();
  } catch {
    return raw.split(/[?#]/, 1)[0].replace(/\/+$/, "").toLowerCase();
  }
}

function collectCardDataColumns(cardState) {
  const sourceRows = Array.isArray(cardState?.sourceRows) ? cardState.sourceRows : [];
  const collected = [];
  const seen = new Set();
  const push = (value) => {
    const text = String(value || "").trim();
    if (!text) {
      return;
    }
    const dedupeKey = normalizeCmColumnName(text);
    if (!dedupeKey || seen.has(dedupeKey)) {
      return;
    }
    seen.add(dedupeKey);
    collected.push(text);
  };
  (Array.isArray(cardState?.columns) ? cardState.columns : []).forEach(push);
  sourceRows.forEach((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return;
    }
    Object.keys(row).forEach(push);
  });
  return collected;
}

function getCmuUsageDisplayColumns(cardState) {
  const output = [];
  const seen = new Set();
  collectCardDataColumns(cardState).forEach((columnName) => {
    const normalized = normalizeCmColumnName(columnName);
    if (!normalized || seen.has(normalized) || !isDisplayableCmuColumn(cardState, normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function getCmuUsageTableDisplayColumns(cardState, row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    return [];
  }
  const output = [];
  const seen = new Set();
  Object.keys(row).forEach((columnName) => {
    const normalized = normalizeCmColumnName(columnName);
    if (!normalized || seen.has(normalized) || !isDisplayableCmuUsageColumn(cardState, normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function buildCardColumnsMarkup(cardState) {
  const requestUrl = buildCardDisplayRequestUrl(cardState) || getCardEffectiveRequestUrl(cardState);
  const usageCard = isCmuUsageCard(cardState);
  const columns = usageCard
    ? getCmuUsageDisplayColumns(cardState)
    : collectCardDataColumns(cardState)
        .map((column) => String(column || "").trim())
        .filter((column) => column && !column.startsWith("__"));
  const nodeLabel = getNodeLabel(requestUrl);
  const endpointMarkup = requestUrl
    ? `<a class="card-col-parent-url card-rerun-url" href="${escapeHtml(requestUrl)}" title="${escapeHtml(requestUrl)}">${escapeHtml(nodeLabel)}</a>`
    : `<span class="card-col-parent-url card-col-parent-url-empty">cm</span>`;
  const hasInteractiveBaseline =
    usageCard &&
    Boolean(cardState?.localHasBaselineData) &&
    cardState?.localDistinctByColumn instanceof Map &&
    cardState.localDistinctByColumn.size > 0;
  const interactiveColumns = hasInteractiveBaseline
    ? [...cardState.localDistinctByColumn.keys()].filter((columnName) => columns.includes(normalizeCmColumnName(columnName)))
    : [];
  const interactiveColumnSet = new Set(interactiveColumns);
  const usageColumnsMarkup =
    columns.length > 0
      ? `<div class="col-chip-cloud">${columns
          .map((column) => {
            const normalizedColumn = normalizeCmColumnName(column);
            if (interactiveColumnSet.has(normalizedColumn)) {
              const selectedCount = cardState?.localColumnFilters?.get(normalizedColumn)?.size || 0;
              const label = selectedCount > 0 ? `${normalizedColumn} (${selectedCount})` : normalizedColumn;
              const title = selectedCount > 0 ? `${normalizedColumn} (${selectedCount} selected)` : normalizedColumn;
              const classes = `col-chip${selectedCount > 0 ? " col-chip-filtered" : ""}`;
              return `<div class="${classes}" data-column="${escapeHtml(normalizedColumn)}" data-label="${escapeHtml(
                normalizedColumn
              )}" data-filterable="1" title="${escapeHtml(title)}">
                <button type="button" class="col-chip-trigger" title="${escapeHtml(title)}">${escapeHtml(label)}</button>
              </div>`;
            }
            return `<div class="col-chip" data-column="${escapeHtml(normalizedColumn)}" data-label="${escapeHtml(
              normalizedColumn
            )}" data-filterable="0">
              <span class="col-chip-label col-chip-label-static">${escapeHtml(normalizedColumn)}</span>
            </div>`;
          })
          .join("")}</div>`
      : `<span class="card-col-empty"></span>`;
  const columnsMarkup =
    usageCard
      ? usageColumnsMarkup
      : columns.length > 0
        ? columns
            .map((column) => {
              const normalizedColumn = normalizeCmColumnName(column);
              if (interactiveColumnSet.has(normalizedColumn)) {
                const selectedCount = cardState?.localColumnFilters?.get(normalizedColumn)?.size || 0;
                const label = selectedCount > 0 ? `${normalizedColumn} (${selectedCount})` : normalizedColumn;
                const title = selectedCount > 0 ? `${normalizedColumn} (${selectedCount} selected)` : normalizedColumn;
                const classes = `card-col-chip${selectedCount > 0 ? " card-col-chip-filtered" : ""}`;
                return `<div class="${classes}" data-column="${escapeHtml(normalizedColumn)}" data-label="${escapeHtml(
                  normalizedColumn
                )}" data-filterable="1" title="${escapeHtml(title)}">
                  <button type="button" class="card-col-chip-trigger" title="${escapeHtml(title)}">${escapeHtml(label)}</button>
                </div>`;
              }
              return `<span class="card-col-chip" data-column="${escapeHtml(normalizedColumn)}" data-label="${escapeHtml(
                normalizedColumn
              )}" data-filterable="0">${escapeHtml(normalizedColumn)}</span>`;
            })
            .join("")
        : `<span class="card-col-empty">No columns</span>`;
  const pickerMarkup =
    usageCard && columns.length > 0
      ? `
        <div class="local-col-picker-wrap" hidden>
          <select class="local-col-menu" multiple size="1" title="Choose one or more values from this column"></select>
        </div>
      `
      : "";

  return `
    <div class="card-col-list">
      <div class="card-col-layout">
        <div class="card-col-node">${endpointMarkup}</div>
        <div class="card-col-columns-wrap">
          <div class="card-col-columns" aria-label="CM columns">${columnsMarkup}</div>
          ${pickerMarkup}
        </div>
      </div>
    </div>
  `;
}

function buildCardLocalFilterResetMarkup(cardState, { compact = false } = {}) {
  const hasRawFilters =
    cardState?.localColumnFilters instanceof Map && [...cardState.localColumnFilters.values()].some((values) => values instanceof Set && values.size > 0);
  if (!isCmuUsageCard(cardState) || (!hasCmLocalColumnFilters(cardState?.localColumnFilters, cardState) && !hasRawFilters)) {
    return "";
  }
  const className = compact
    ? "esm-action-btn esm-unfilter esm-clear-filter-rerun esm-clear-filter-rerun--inline"
    : "esm-action-btn esm-unfilter esm-clear-filter-rerun";
  const ariaLabel = compact
    ? "Remove local column filters and rerun this CMU table"
    : "Un-filter and rerun this CMU table";
  return `<button type="button" class="${className}" aria-label="${ariaLabel}" title="Clear this table local column filters and rerun this CMU URL"><svg class="esm-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7z"/></svg></button>`;
}

function renderCardMessage(cardState, message, options = {}) {
  const cssClass = options.error ? "card-message error" : "card-message";
  const resetMarkup = buildCardLocalFilterResetMarkup(cardState, { compact: true });
  cardState.bodyElement.innerHTML = `
    <p class="${cssClass}">
      <span class="card-message-inline">
        <span class="card-message-text">${escapeHtml(message || "")}</span>
        ${resetMarkup}
      </span>
    </p>
    ${buildCardColumnsMarkup(cardState)}
  `;
  wireCardRerunAndFilterActions(cardState);
}

function normalizeOperationDescriptor(operation) {
  if (!operation || typeof operation !== "object") {
    return null;
  }
  const parameters = Array.isArray(operation.parameters)
    ? operation.parameters
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          const name = String(item.name || "").trim();
          if (!name) {
            return null;
          }
          return {
            name,
            in: String(item.in || "path").trim().toLowerCase(),
            required: item.required === true,
            description: String(item.description || "").trim(),
          };
        })
        .filter(Boolean)
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

function normalizeOperationFormValues(operation, values = {}) {
  const source = values && typeof values === "object" ? values : {};
  const profileHarvestList = Array.isArray(state.profileHarvestList) ? state.profileHarvestList : [];
  const profileHarvest =
    state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : profileHarvestList[0] || null;
  const aggregatedCandidates = collectHarvestCandidateValues(profileHarvestList);
  const idpCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.idpCandidates) ? profileHarvest.idpCandidates : []),
    ...aggregatedCandidates.idpCandidates,
  ]);
  const subjectCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.subjectCandidates) ? profileHarvest.subjectCandidates : []),
    ...aggregatedCandidates.subjectCandidates,
  ]);
  const sessionCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.sessionCandidates) ? profileHarvest.sessionCandidates : []),
    ...aggregatedCandidates.sessionCandidates,
  ]);
  const normalized = {
    baseUrl: String(source.baseUrl || "https://streams-stage.adobeprimetime.com").trim() || "https://streams-stage.adobeprimetime.com",
    idp: firstNonEmptyString([source.idp, profileHarvest?.mvpd, ...idpCandidates, state.mvpdIds?.[0] || ""]),
    subject: firstNonEmptyString([
      source.subject,
      profileHarvest?.subject,
      profileHarvest?.upstreamUserId,
      profileHarvest?.userId,
      ...subjectCandidates,
      state.requestorIds?.[0] || "",
    ]),
    session: firstNonEmptyString([source.session, profileHarvest?.sessionId, ...sessionCandidates]),
    xTerminate: String(source.xTerminate || "").trim(),
    authUser: String(source.authUser || "").trim(),
    authPass: String(source.authPass || "").trim(),
  };
  const parameters = Array.isArray(operation?.parameters) ? operation.parameters : [];
  parameters.forEach((param) => {
    const name = String(param?.name || "").trim();
    if (!name) {
      return;
    }
    const key = name.toLowerCase() === "x-terminate" ? "xTerminate" : name;
    if (!Object.prototype.hasOwnProperty.call(normalized, key)) {
      normalized[key] = String(source[key] || source[name] || "").trim();
    }
  });
  return normalized;
}

function buildOperationFormField(label, name, value, options = {}) {
  const required = options.required === true;
  const type = String(options.type || "text").trim();
  const placeholder = String(options.placeholder || "").trim();
  const help = String(options.help || "").trim();
  return `
    <label class="cm-api-field">
      <span class="cm-api-label">${escapeHtml(label)}${required ? ' <em aria-hidden="true">*</em>' : ""}</span>
      <input class="cm-api-input" type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value || "")}" ${
        required ? "required" : ""
      } ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""} />
      ${help ? `<span class="cm-api-help">${escapeHtml(help)}</span>` : ""}
    </label>
  `;
}

function renderOperationFormCard(cardState, options = {}) {
  const operation = normalizeOperationDescriptor(cardState?.operation);
  if (!operation) {
    renderCardMessage(cardState, "CM V2 operation details are unavailable.", { error: true });
    return;
  }

  const values = normalizeOperationFormValues(operation, options.formValues || cardState.formValues || {});
  cardState.formValues = { ...values };
  const parameterFields = operation.parameters
    .map((param) => {
      const paramName = String(param.name || "").trim();
      const key = paramName.toLowerCase() === "x-terminate" ? "xTerminate" : paramName;
      const labelPrefix = String(param.in || "path").toUpperCase();
      const label = `${labelPrefix} ${paramName}`;
      const placeholder = param.in === "path" ? `{${paramName}}` : "";
      return buildOperationFormField(label, key, values[key] || "", {
        required: param.required === true,
        placeholder,
        help: param.description || "",
      });
    })
    .join("");

  const securityHint = operation.security ? `Auth: ${operation.security}` : "Auth: IMS/Cookie or Basic";
  const body = `
    <form class="cm-api-form" data-card-id="${escapeHtml(cardState.cardId)}">
      <div class="cm-api-intro">
        <p class="cm-api-intro-main">${escapeHtml(operation.method)} ${escapeHtml(operation.pathTemplate)}</p>
        <p class="cm-api-intro-sub">${escapeHtml(securityHint)}</p>
      </div>
      <div class="cm-api-grid">
        ${buildOperationFormField("Base URL", "baseUrl", values.baseUrl, { required: true, type: "url" })}
        ${buildOperationFormField("Basic Auth User", "authUser", values.authUser)}
        ${buildOperationFormField("Basic Auth Password", "authPass", values.authPass, { type: "password" })}
        ${parameterFields}
      </div>
      <div class="cm-api-actions-row">
        <button type="submit" class="cm-api-run">Run API</button>
      </div>
    </form>
    ${buildCardColumnsMarkup(cardState)}
  `;
  cardState.bodyElement.innerHTML = body;
  wireCardRerunAndFilterActions(cardState);

  const formElement = cardState.bodyElement.querySelector(".cm-api-form");
  if (!formElement) {
    return;
  }
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureWorkspaceUnlocked()) {
      return;
    }
    const formData = new FormData(formElement);
    const submittedValues = {};
    formData.forEach((value, key) => {
      submittedValues[String(key || "")] = String(value || "").trim();
    });
    cardState.formValues = normalizeOperationFormValues(operation, submittedValues);
    setStatus(`Running ${operation.method} ${operation.pathTemplate}...`);
    const result = await sendWorkspaceAction("run-api-operation", {
      card: getCardPayload(cardState),
      formValues: cardState.formValues,
    });
    if (!result?.ok) {
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
  });
}

function createCardElements(cardState) {
  const article = document.createElement("article");
  article.className = "report-card";
  article.setAttribute("data-card-id", cardState.cardId);
  article.innerHTML = `
    <div class="card-head">
      <div class="card-title-wrap">
        <p class="card-title"></p>
        <p class="card-subtitle"></p>
      </div>
      <div class="card-actions">
        <button type="button" class="card-close" aria-label="Close report card" title="Close report card">
          <svg class="card-close-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M7 7 17 17" />
            <path d="M17 7 7 17" />
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body"></div>
  `;

  cardState.element = article;
  cardState.titleElement = article.querySelector(".card-title");
  cardState.subtitleElement = article.querySelector(".card-subtitle");
  cardState.closeButton = article.querySelector(".card-close");
  cardState.bodyElement = article.querySelector(".card-body");
}

function syncCardUsageModeClass(cardState) {
  if (!cardState?.element) {
    return;
  }
  cardState.element.classList.toggle("report-card--cmu-usage", isCmuUsageCard(cardState));
}

async function runCardFromPathNode(cardState, endpointUrl, sourceRequestUrl) {
  const targetEndpointUrl = String(endpointUrl || "").trim();
  if (!targetEndpointUrl) {
    return;
  }
  const tenantScope = resolveWorkspaceTenantScope(cardState);
  const inheritedRequestUrl = buildInheritedRequestUrl(
    targetEndpointUrl,
    sourceRequestUrl || getCardEffectiveRequestUrl(cardState),
    tenantScope
  );
  const targetEndpointKey = getWorkspaceEndpointKey(targetEndpointUrl);
  const currentEndpointKey = getWorkspaceEndpointKey(String(cardState?.endpointUrl || getCardEffectiveRequestUrl(cardState) || ""));

  if (targetEndpointKey && currentEndpointKey && targetEndpointKey === currentEndpointKey) {
    const resolvedRequestUrl = inheritedRequestUrl || targetEndpointUrl;
    const result = await sendWorkspaceAction("run-card", {
      requestSource: "workspace-path-link",
      card: {
        ...getCardPayload(cardState),
        endpointUrl: targetEndpointUrl,
        requestUrl: resolvedRequestUrl,
        baseRequestUrl: resolvedRequestUrl,
      },
    });
    if (!result?.ok) {
      setStatus(result?.error || "Unable to re-run CMU node report.", "error");
    }
    return;
  }

  const resolvedRequestUrl = inheritedRequestUrl || targetEndpointUrl;
  const nextTenantScope = resolveWorkspaceTenantScope(cardState);
  const nextCardPayload = {
    cardId: buildWorkspaceCardId("path"),
    endpointUrl: targetEndpointUrl,
    requestUrl: resolvedRequestUrl,
    baseRequestUrl: resolvedRequestUrl,
    zoomKey: String(cardState?.zoomKey || ""),
    columns: Array.isArray(cardState?.columns) ? cardState.columns.map((column) => String(column || "")).filter(Boolean) : [],
    tenantId: String(nextTenantScope || ""),
    tenantName: resolveWorkspaceTenantLabel(cardState, { tenantId: nextTenantScope }),
  };
  const result = await sendWorkspaceAction("run-card", {
    requestSource: "workspace-path-link",
    card: nextCardPayload,
  });
  if (!result?.ok) {
    setStatus(result?.error || "Unable to run CMU path node report.", "error");
  }
}

function wireCardHeaderPathLinks(cardState) {
  const titleElement = cardState?.titleElement;
  if (!titleElement) {
    return;
  }
  titleElement.querySelectorAll(".card-url-path-link[data-endpoint-url]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void runCardFromPathNode(
        cardState,
        String(link.getAttribute("data-endpoint-url") || ""),
        String(link.getAttribute("data-source-request-url") || "")
      );
    });
  });
}

function teardownCardHeaderQueryEditors(cardState) {
  if (!cardState) {
    return;
  }
  if (typeof cardState.queryEditorOutsidePointerHandler === "function") {
    document.removeEventListener("pointerdown", cardState.queryEditorOutsidePointerHandler, true);
  }
  if (typeof cardState.queryEditorOutsideKeyHandler === "function") {
    document.removeEventListener("keydown", cardState.queryEditorOutsideKeyHandler, true);
  }
  cardState.queryEditorOutsidePointerHandler = null;
  cardState.queryEditorOutsideKeyHandler = null;
  cardState.openQueryEditorKey = "";
}

function wireCardHeaderQueryEditors(cardState) {
  const titleElement = cardState?.titleElement;
  if (!titleElement) {
    return;
  }
  teardownCardHeaderQueryEditors(cardState);

  const closeEditor = () => {
    titleElement.querySelectorAll(".card-url-query-editor").forEach((editor) => {
      editor.hidden = true;
    });
    teardownCardHeaderQueryEditors(cardState);
  };

  const openEditor = (button, editor, input, key) => {
    if (!button || !editor || !input || !key) {
      return;
    }
    closeEditor();
    editor.hidden = false;
    cardState.openQueryEditorKey = key;
    input.value = normalizeEditableQueryDateTimeValue(input.value || button.getAttribute("data-query-editor-value") || "");
    cardState.queryEditorOutsidePointerHandler = (event) => {
      const target = event?.target;
      if (target instanceof Node && (editor.contains(target) || button.contains(target))) {
        return;
      }
      closeEditor();
    };
    cardState.queryEditorOutsideKeyHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeEditor();
      }
    };
    document.addEventListener("pointerdown", cardState.queryEditorOutsidePointerHandler, true);
    document.addEventListener("keydown", cardState.queryEditorOutsideKeyHandler, true);
    try {
      input.focus({ preventScroll: true });
    } catch (_error) {
      input.focus();
    }
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      }
    } catch (_error) {
      // Ignore browsers that block programmatic picker display.
    }
  };

  titleElement.querySelectorAll(".card-url-query-value-btn[data-query-editor-key]").forEach((button) => {
    const key = normalizeCmColumnName(button.getAttribute("data-query-editor-key"));
    const editor = button.parentElement?.querySelector(".card-url-query-editor");
    const input = editor?.querySelector(".card-url-query-datetime-input");
    if (!key || !editor || !input) {
      return;
    }
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor(button, editor, input, key);
    });
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeEditor();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        updateCardEditableQueryValue(cardState, key, input.value);
        updateCardHeader(cardState);
      }
    });
    input.addEventListener("change", () => {
      updateCardEditableQueryValue(cardState, key, input.value);
      updateCardHeader(cardState);
    });
  });
}

function updateCardHeader(cardState) {
  syncCardUsageModeClass(cardState);
  teardownCardHeaderQueryEditors(cardState);
  const operation = normalizeOperationDescriptor(cardState?.operation);
  if (operation) {
    const title = operation.label ? `${operation.label}` : `${operation.method} ${operation.pathTemplate}`;
    const subtitle = `${operation.method} ${operation.pathTemplate}`;
    cardState.titleElement.textContent = title;
    cardState.titleElement.title = title;
    const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
    cardState.subtitleElement.textContent = `${subtitle} | Rows: ${rows}`;
    return;
  }
  const effectiveRequestUrl = buildCardDisplayRequestUrl(cardState) || getCardEffectiveRequestUrl(cardState);
  if (isCmuUsageCard(cardState)) {
    cardState.titleElement.innerHTML = buildCardHeaderContextMarkup(effectiveRequestUrl, String(cardState.endpointUrl || ""));
    wireCardHeaderPathLinks(cardState);
    wireCardHeaderQueryEditors(cardState);
  } else {
    cardState.titleElement.textContent = effectiveRequestUrl || "No CM URL";
  }
  cardState.titleElement.title = effectiveRequestUrl || "No CM URL";
  const zoom = cardState.zoomKey ? `Zoom: ${cardState.zoomKey}` : "Zoom: --";
  const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
  cardState.subtitleElement.textContent = `${zoom} | Rows: ${rows}`;
}

function ensureWorkspaceUnlocked() {
  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME) {
    return true;
  }
  if (!state.workspaceLocked) {
    return true;
  }
  setStatus(getWorkspaceLockMessage(), "error");
  return false;
}

async function rerunCard(cardState) {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (normalizeOperationDescriptor(cardState?.operation)) {
    const result = await sendWorkspaceAction("run-api-operation", {
      card: getCardPayload(cardState),
      formValues: cardState.formValues && typeof cardState.formValues === "object" ? cardState.formValues : {},
    });
    if (!result?.ok) {
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
    return;
  }
  const result = await sendWorkspaceAction("run-card", {
    card: getCardPayload(cardState),
  });
  if (!result?.ok) {
    renderCardMessage(cardState, result?.error || "Unable to run report from UnderPAR CM controller.", { error: true });
    setStatus(result?.error || "Unable to run report from UnderPAR CM controller.", "error");
  }
}

function wireCardRerunAndFilterActions(cardState) {
  const rerunUrl = cardState?.bodyElement?.querySelector(".card-rerun-url");
  if (rerunUrl) {
    rerunUrl.addEventListener("click", (event) => {
      event.preventDefault();
      void rerunCard(cardState);
    });
  }

  const clearFilterButtons = cardState?.bodyElement?.querySelectorAll(".esm-clear-filter-rerun, .cm-clear-filter-rerun") || [];
  clearFilterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const restoredSeed = restoreCardSeedQueryState(cardState);
      if (!restoredSeed) {
        cardState.localColumnFilters = new Map();
      }
      cardState.pickerOpenColumn = "";
      void rerunCard(cardState);
    });
  });

  wireCardColumnFilterCloud(cardState);
}

function wireCardColumnFilterCloud(cardState) {
  if (!isCmuUsageCard(cardState)) {
    return;
  }
  const bodyElement = cardState?.bodyElement;
  if (!bodyElement) {
    return;
  }

  const cloudElement = bodyElement.querySelector(".card-col-columns");
  const pickerWrap = bodyElement.querySelector(".local-col-picker-wrap");
  const pickerSelect = bodyElement.querySelector(".local-col-menu");
  if (!cloudElement || !pickerWrap || !pickerSelect) {
    return;
  }

  if (typeof cardState.pickerOutsidePointerHandler === "function") {
    document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
  }
  if (typeof cardState.pickerOutsideKeyHandler === "function") {
    document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
  }
  cardState.pickerOutsidePointerHandler = null;
  cardState.pickerOutsideKeyHandler = null;

  const updateVisualState = () => {
    const pickerOpen = !pickerWrap.hidden;
    cloudElement.querySelectorAll(".col-chip[data-column]").forEach((chip) => {
      const columnName = normalizeCmColumnName(chip.getAttribute("data-column"));
      if (!columnName) {
        return;
      }
      const displayLabel = String(chip.getAttribute("data-label") || columnName).trim() || columnName;
      const trigger = chip.querySelector(".col-chip-trigger");
      const selectedCount = cardState?.localColumnFilters?.get(columnName)?.size || 0;
      const title = selectedCount > 0 ? `${displayLabel} (${selectedCount} selected)` : displayLabel;
      chip.classList.toggle("col-chip-active", pickerOpen && cardState.pickerOpenColumn === columnName);
      chip.classList.toggle("col-chip-filtered", selectedCount > 0);
      if (trigger) {
        trigger.textContent = selectedCount > 0 ? `${displayLabel} (${selectedCount})` : displayLabel;
        trigger.title = title;
      }
      chip.title = title;
    });
  };

  const closePicker = () => {
    pickerWrap.hidden = true;
    pickerWrap.removeAttribute("data-column");
    cardState.pickerOpenColumn = "";
    pickerSelect.size = 1;
    if (typeof cardState.pickerOutsidePointerHandler === "function") {
      document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    }
    if (typeof cardState.pickerOutsideKeyHandler === "function") {
      document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    }
    cardState.pickerOutsidePointerHandler = null;
    cardState.pickerOutsideKeyHandler = null;
    updateVisualState();
  };

  const openNativePicker = () => {
    if (pickerWrap.hidden || pickerSelect.disabled) {
      return;
    }
    try {
      pickerSelect.focus({ preventScroll: true });
    } catch (_error) {
      pickerSelect.focus();
    }
    try {
      if (typeof pickerSelect.showPicker === "function") {
        pickerSelect.showPicker();
        return;
      }
    } catch (_error) {
      // Ignore unsupported picker APIs.
    }
    try {
      pickerSelect.click();
    } catch (_error) {
      // Ignore.
    }
  };

  const openPicker = (columnName, chipElement) => {
    const normalizedColumn = normalizeCmColumnName(columnName);
    if (!normalizedColumn) {
      return;
    }
    const values = cardState.localDistinctByColumn.get(normalizedColumn) || [];
    if (!Array.isArray(values) || values.length === 0) {
      return;
    }

    pickerWrap.dataset.column = normalizedColumn;
    cardState.pickerOpenColumn = normalizedColumn;
    pickerSelect.innerHTML = "";
    const selectedValues = cardState.localColumnFilters.get(normalizedColumn) || new Set();
    values.forEach((value, index) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = selectedValues.has(value);
      option.classList.add(index % 2 === 1 ? "req-tone-b" : "req-tone-a");
      pickerSelect.appendChild(option);
    });
    pickerSelect.disabled = values.length === 0;
    chipElement.appendChild(pickerWrap);
    pickerWrap.hidden = false;
    cardState.pickerOutsidePointerHandler = (event) => {
      if (chipElement.contains(event.target)) {
        return;
      }
      closePicker();
    };
    cardState.pickerOutsideKeyHandler = (event) => {
      if (event.key === "Escape") {
        closePicker();
      }
    };
    document.addEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    document.addEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    updateVisualState();
    openNativePicker();
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => openNativePicker());
    }
  };

  cloudElement.querySelectorAll(".col-chip[data-filterable=\"1\"][data-column]").forEach((chip) => {
    const trigger = chip.querySelector(".col-chip-trigger");
    if (!trigger) {
      return;
    }
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const columnName = normalizeCmColumnName(chip.getAttribute("data-column"));
      if (!columnName) {
        return;
      }
      const isSameColumn = cardState.pickerOpenColumn === columnName && pickerWrap.hidden === false;
      if (isSameColumn) {
        openNativePicker();
        return;
      }
      openPicker(columnName, chip);
    });
  });

  pickerSelect.addEventListener("change", () => {
    const columnName = normalizeCmColumnName(pickerWrap.dataset.column || "");
    if (!columnName) {
      return;
    }
    const selected = new Set(
      [...pickerSelect.selectedOptions]
        .map((option) => String(option.value || "").trim())
        .filter(Boolean)
    );
    if (selected.size > 0) {
      cardState.localColumnFilters.set(columnName, selected);
    } else {
      cardState.localColumnFilters.delete(columnName);
    }
    updateVisualState();
  });

  const openColumn = normalizeCmColumnName(cardState.pickerOpenColumn || "");
  if (openColumn) {
    const chipToReopen = [...cloudElement.querySelectorAll(".col-chip[data-column]")].find(
      (chip) => normalizeCmColumnName(chip.getAttribute("data-column")) === openColumn
    );
    if (chipToReopen) {
      openPicker(openColumn, chipToReopen);
      return;
    }
  }
  updateVisualState();
}

function ensureCard(cardMeta) {
  const cardId = String(cardMeta?.cardId || "").trim();
  if (!cardId) {
    return null;
  }

  if (state.cardsById.has(cardId)) {
    const existing = state.cardsById.get(cardId);
    const previousEndpointKey = String(existing.endpointUrl || existing.baseRequestUrl || existing.requestUrl || "")
      .trim()
      .toLowerCase();
    if (cardMeta?.endpointUrl) {
      existing.endpointUrl = String(cardMeta.endpointUrl);
    }
    if (cardMeta?.requestUrl) {
      existing.requestUrl = String(cardMeta.requestUrl);
    }
    if (cardMeta?.baseRequestUrl) {
      existing.baseRequestUrl = String(cardMeta.baseRequestUrl);
    } else if (!String(existing.baseRequestUrl || "").trim()) {
      existing.baseRequestUrl = String(existing.requestUrl || existing.endpointUrl || "");
    }
    if ("seedEndpointUrl" in (cardMeta || {})) {
      existing.seedEndpointUrl = String(cardMeta?.seedEndpointUrl || "").trim();
    }
    if ("seedRequestUrl" in (cardMeta || {})) {
      existing.seedRequestUrl = String(cardMeta?.seedRequestUrl || "").trim();
    }
    if ("seedBaseRequestUrl" in (cardMeta || {})) {
      existing.seedBaseRequestUrl = String(cardMeta?.seedBaseRequestUrl || "").trim();
    }
    if (cardMeta?.zoomKey) {
      existing.zoomKey = String(cardMeta.zoomKey);
    }
    if (cardMeta?.tenantId != null) {
      existing.tenantId = String(cardMeta.tenantId || "");
    }
    if (cardMeta?.tenantName != null || cardMeta?.tenantId != null) {
      existing.tenantName = String(cardMeta.tenantName || cardMeta.tenantId || existing.tenantName || "");
    }
    if (Array.isArray(cardMeta?.columns)) {
      existing.columns = cardMeta.columns.map((column) => String(column || "")).filter(Boolean);
    }
    if (cardMeta?.localColumnFilters && typeof cardMeta.localColumnFilters === "object") {
      existing.localColumnFilters = normalizeCmLocalColumnFilters(cardMeta.localColumnFilters, existing);
    }
    if (cardMeta?.seedLocalColumnFilters && typeof cardMeta.seedLocalColumnFilters === "object") {
      existing.seedLocalColumnFilters = normalizeCmLocalColumnFilters(cardMeta.seedLocalColumnFilters, existing);
    }
    if (cardMeta?.operation && typeof cardMeta.operation === "object") {
      existing.operation = normalizeOperationDescriptor(cardMeta.operation);
    }
    if (cardMeta?.formValues && typeof cardMeta.formValues === "object") {
      existing.formValues = normalizeOperationFormValues(existing.operation, cardMeta.formValues);
    }
    const nextEndpointKey = String(existing.endpointUrl || existing.baseRequestUrl || existing.requestUrl || "")
      .trim()
      .toLowerCase();
    if (previousEndpointKey && nextEndpointKey && previousEndpointKey !== nextEndpointKey) {
      existing.localDistinctByColumn.clear();
      existing.localHasBaselineData = false;
      existing.localColumnFilters = new Map();
      existing.pickerOpenColumn = "";
      existing.sortStack = getDefaultSortStackForCard(existing);
      existing.seedEndpointUrl = String(cardMeta?.seedEndpointUrl || existing.endpointUrl || "").trim();
      existing.seedRequestUrl = String(cardMeta?.seedRequestUrl || existing.requestUrl || existing.endpointUrl || "").trim();
      existing.seedBaseRequestUrl = String(
        cardMeta?.seedBaseRequestUrl || existing.baseRequestUrl || existing.requestUrl || existing.endpointUrl || ""
      ).trim();
      existing.seedLocalColumnFilters = normalizeCmLocalColumnFilters(cardMeta?.seedLocalColumnFilters, existing);
      existing.startingUiLocalColumnFilters = new Map();
      existing.startingUiPersistentQuerySignature = "[]";
      existing.startingUiStateCaptured = false;
      teardownCardHeaderQueryEditors(existing);
    } else if (!Array.isArray(existing.sortStack) || existing.sortStack.length === 0) {
      existing.sortStack = getDefaultSortStackForCard(existing);
    }
    if (!hasStoredSeedQueryState(existing)) {
      existing.seedEndpointUrl = String(existing.endpointUrl || "").trim();
      existing.seedRequestUrl = String(existing.requestUrl || existing.endpointUrl || "").trim();
      existing.seedBaseRequestUrl = String(existing.baseRequestUrl || existing.requestUrl || existing.endpointUrl || "").trim();
      existing.seedLocalColumnFilters = new Map();
    }
    updateCardHeader(existing);
    return existing;
  }

  const cardState = {
    cardId,
    endpointUrl: String(cardMeta?.endpointUrl || ""),
    requestUrl: String(cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
    baseRequestUrl: String(cardMeta?.baseRequestUrl || cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
    zoomKey: String(cardMeta?.zoomKey || ""),
    columns: Array.isArray(cardMeta?.columns) ? cardMeta.columns.map((column) => String(column || "")).filter(Boolean) : [],
    tenantId: resolveWorkspaceTenantScope(null, cardMeta),
    tenantName: resolveWorkspaceTenantLabel(null, cardMeta),
    rows: [],
    sourceRows: [],
    sortStack: [],
    lastModified: "",
    seedEndpointUrl: String(cardMeta?.seedEndpointUrl || cardMeta?.endpointUrl || ""),
    seedRequestUrl: String(cardMeta?.seedRequestUrl || cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
    seedBaseRequestUrl: String(
      cardMeta?.seedBaseRequestUrl || cardMeta?.baseRequestUrl || cardMeta?.requestUrl || cardMeta?.endpointUrl || ""
    ),
    seedLocalColumnFilters: normalizeCmLocalColumnFilters(cardMeta?.seedLocalColumnFilters, null),
    startingUiLocalColumnFilters: new Map(),
    startingUiPersistentQuerySignature: "[]",
    startingUiStateCaptured: false,
    localColumnFilters: normalizeCmLocalColumnFilters(cardMeta?.localColumnFilters, null),
    localDistinctByColumn: new Map(),
    localHasBaselineData: false,
    pickerOpenColumn: "",
    pickerOutsidePointerHandler: null,
    pickerOutsideKeyHandler: null,
    queryEditorOutsidePointerHandler: null,
    queryEditorOutsideKeyHandler: null,
    openQueryEditorKey: "",
    operation: cardMeta?.operation && typeof cardMeta.operation === "object" ? normalizeOperationDescriptor(cardMeta.operation) : null,
    formValues:
      cardMeta?.formValues && typeof cardMeta.formValues === "object"
        ? normalizeOperationFormValues(normalizeOperationDescriptor(cardMeta.operation), cardMeta.formValues)
        : {},
    running: false,
    element: null,
    titleElement: null,
    subtitleElement: null,
    closeButton: null,
    bodyElement: null,
  };

  cardState.sortStack = getDefaultSortStackForCard(cardState);
  createCardElements(cardState);
  cardState.localColumnFilters = normalizeCmLocalColumnFilters(cardMeta?.localColumnFilters, cardState);
  cardState.seedLocalColumnFilters = normalizeCmLocalColumnFilters(cardMeta?.seedLocalColumnFilters, cardState);
  if (!hasStoredSeedQueryState(cardState)) {
    cardState.seedEndpointUrl = String(cardState.endpointUrl || "").trim();
    cardState.seedRequestUrl = String(cardState.requestUrl || cardState.endpointUrl || "").trim();
    cardState.seedBaseRequestUrl = String(cardState.baseRequestUrl || cardState.requestUrl || cardState.endpointUrl || "").trim();
  }
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    if (typeof cardState.pickerOutsidePointerHandler === "function") {
      document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    }
    if (typeof cardState.pickerOutsideKeyHandler === "function") {
      document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    }
    teardownCardHeaderQueryEditors(cardState);
    cardState.element?.remove();
    state.cardsById.delete(cardState.cardId);
    syncWorkspaceReplayCardsFromCurrentCards();
    syncActionButtonsDisabled();
  });

  state.cardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  syncActionButtonsDisabled();
  return cardState;
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
    return "";
  }
  const date = new Date(rawHttpDate);
  if (Number.isNaN(date.getTime())) {
    return String(rawHttpDate || "");
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

function buildDefaultSortStack(headers = [], options = {}) {
  const normalizedHeaders = Array.isArray(headers) ? headers.map((header) => String(header || "").trim()).filter(Boolean) : [];
  if (options?.cmuUsage === true && options?.hasDate === true && normalizedHeaders.includes("DATE")) {
    return getDefaultCmuUsageSortStack();
  }
  return normalizedHeaders.length > 0 ? [{ col: normalizedHeaders[0], dir: "DESC" }] : [];
}

function getDefaultCmuUsageSortStack() {
  return [{ col: "DATE", dir: "DESC" }];
}

function getDefaultSortStackForCard(cardState) {
  return isCmuUsageCard(cardState) ? getDefaultCmuUsageSortStack() : [];
}

function renderCardTable(cardState, rows, lastModified) {
  const normalizedRows = normalizeRows(rows);
  if (normalizedRows.length === 0) {
    renderCardMessage(cardState, "No data");
    return;
  }

  const usageCard = isCmuUsageCard(cardState);
  const firstRow = normalizedRows[0] && typeof normalizedRows[0] === "object" ? normalizedRows[0] : {};
  const genericHeaders = Array.from(
    new Set([
      ...(Array.isArray(cardState.columns) ? cardState.columns : []),
      ...Object.keys(firstRow),
    ])
  ).filter((header) => {
    const normalizedHeader = String(header || "").trim();
    return normalizedHeader && !normalizedHeader.startsWith("__");
  });
  const hasDate = usageCard;
  const hasAuthN =
    usageCard &&
    getRowValueByColumn(firstRow, "authn-attempts") != null &&
    getRowValueByColumn(firstRow, "authn-successful") != null;
  const hasAuthZ =
    usageCard &&
    getRowValueByColumn(firstRow, "authz-attempts") != null &&
    getRowValueByColumn(firstRow, "authz-successful") != null;
  const hasCount = usageCard && getRowValueByColumn(firstRow, "count") != null;
  const displayColumns = usageCard ? getCmuUsageTableDisplayColumns(cardState, firstRow) : [];
  const headers = usageCard
    ? [
        ...(hasDate ? ["DATE"] : []),
        ...(hasAuthN ? ["AuthN Success"] : []),
        ...(hasAuthZ ? ["AuthZ Success"] : []),
        ...(!hasAuthN && !hasAuthZ && hasCount ? ["COUNT"] : []),
        ...displayColumns,
      ]
    : genericHeaders;
  const closeControlMarkup = `<button type="button" class="esm-action-btn esm-table-close" aria-label="Close table" title="Close table">
                    <svg class="esm-action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 7 17 17"></path>
                      <path d="M17 7 7 17"></path>
                    </svg>
                  </button>`;

  cardState.bodyElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer">
                <div class="underpar-export-actions">
                  ${buildBlondieButtonMarkup()}
                  <a href="#" class="esm-csv-link">CSV</a>
                </div>
                <div class="esm-footer-controls">
                  <div class="esm-footer-meta">
                    <span class="esm-last-modified"></span>
                  </div>
                  <div class="esm-footer-actions">
                    ${buildCardLocalFilterResetMarkup(cardState)}
                    ${closeControlMarkup}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    ${buildCardColumnsMarkup(cardState)}
  `;

  const table = cardState.bodyElement.querySelector(".esm-table");
  const tableWrapper = cardState.bodyElement.querySelector(".esm-table-wrapper");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const footerCell = cardState.bodyElement.querySelector(".esm-footer-cell");
  const lastModifiedLabel = cardState.bodyElement.querySelector(".esm-last-modified");
  const blondieButton = cardState.bodyElement.querySelector(".underpar-blondie-btn");
  const csvLink = cardState.bodyElement.querySelector(".esm-csv-link");
  const closeButton = cardState.bodyElement.querySelector(".esm-table-close");

  const normalizedIncomingSortStack =
    Array.isArray(cardState?.sortStack) && cardState.sortStack.length > 0
      ? cardState.sortStack
          .map((rule) => ({
            col: String(rule?.col || "").trim(),
            dir: String(rule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
          }))
          .filter((rule) => rule.col)
          .slice(0, 1)
      : [];

  const tableState = {
    wrapper: tableWrapper,
    table,
    thead,
    tbody,
    mode: usageCard ? "cmu-usage" : "generic",
    headers,
    data: normalizedRows,
    sortStack:
      normalizedIncomingSortStack.length > 0
        ? normalizedIncomingSortStack
        : buildDefaultSortStack(headers, { cmuUsage: usageCard, hasDate }),
    hasDate,
    hasAuthN,
    hasAuthZ,
    hasCount,
    displayColumns,
    context: usageCard
      ? {
          mode: "cmu-usage",
          headers,
          hasDate,
          hasAuthN,
          hasAuthZ,
        }
      : null,
  };

  const headerRow = thead.querySelector("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
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

    th.addEventListener("click", () => {
      const existingRule = tableState.sortStack[0]?.col === header ? tableState.sortStack[0] : null;
      tableState.sortStack = [
        {
          col: header,
          dir: existingRule ? (existingRule.dir === "DESC" ? "ASC" : "DESC") : "DESC",
        },
      ];
      tableState.data = sortRows(tableState.data, tableState.sortStack, tableState.context);
      renderTableBody(tableState);
      updateTableWrapperViewport(tableState);
      refreshHeaderStates(tableState);
      cardState.sortStack = tableState.sortStack;
    });
    headerRow.appendChild(th);
  });

  if (footerCell) {
    footerCell.colSpan = Math.max(1, headers.length);
  }
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

  if (csvLink) {
    csvLink.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!ensureWorkspaceUnlocked()) {
        return;
      }
      const csvPayload =
        usageCard
          ? getCardPayload(cardState)
          : {
              ...getCardPayload(cardState),
              rows: Array.isArray(cardState.rows) ? cardState.rows : [],
            };
      const defaultSortRule = usageCard
        ? getDefaultCmuUsageSortStack()[0]
        : tableState.sortStack?.[0] || null;
      const result = await sendWorkspaceAction("download-csv", {
        card: csvPayload,
        sortRule: cardState.sortStack?.[0] || defaultSortRule,
      });
      if (!result?.ok) {
        setStatus(result?.error || (usageCard ? "Unable to download CSV." : "Unable to download CM CSV."), "error");
      } else {
        setStatus(usageCard ? "CSV download started." : "CM CSV download started.");
      }
    });
  }

  if (blondieButton) {
    blondieButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!ensureWorkspaceUnlocked()) {
        return;
      }
      const currentBlondieState = getBlondieButtonState(blondieButton);
      if (currentBlondieState === "active" || currentBlondieState === "ack") {
        return;
      }
      if (!canUseBlondieButton()) {
        renderBlondieButtonState(blondieButton, "inactive");
        setStatus(BLONDIE_BUTTON_INACTIVE_MESSAGE, "error");
        return;
      }
      const exportPayload = buildCmBlondieExportPayload(cardState, tableState);
      if (!exportPayload) {
        setStatus("No visible CM rows are available for :blondiebtn:.", "error");
        return;
      }
      const sendExport = async (deliveryTarget = null) => {
        renderBlondieButtonState(blondieButton, "active");
        try {
          const result = await sendWorkspaceAction("blondie-export", {
            exportPayload,
            card: getCardPayload(cardState),
            deliveryTarget: deliveryTarget?.target || deliveryTarget || null,
            noteText: deliveryTarget?.noteText || "",
          });
          if (!result?.ok) {
            renderBlondieButtonState(blondieButton, getBlondieButtonDefaultState());
            setStatus(result?.error || "Unable to deliver CM rows with :blondiebtn:.", "error");
            return {
              ok: false,
              error: result?.error || "Unable to deliver CM rows with :blondiebtn:.",
            };
          }
          renderBlondieButtonState(blondieButton, "ack");
          queueBlondieButtonAckReset(blondieButton);
          const deliveredRecipientLabel = String(result?.recipient_label || "").trim();
          const deliveredViaDialog = !!deliveryTarget && !!deliveredRecipientLabel;
          setStatus(
            deliveredViaDialog
              ? `:blondiebtn: delivered ${exportPayload.rowCount} CM row(s) to ${deliveredRecipientLabel}.`
              : `:blondiebtn: delivered ${exportPayload.rowCount} CM row(s) to your Slack DM.`,
            "success"
          );
          return result;
        } catch (error) {
          renderBlondieButtonState(blondieButton, getBlondieButtonDefaultState());
          const message = error instanceof Error ? error.message : "Unable to deliver CM rows with :blondiebtn:.";
          setStatus(message, "error");
          return {
            ok: false,
            error: message,
          };
        }
      };
      if (event.shiftKey) {
        openBlondieSharePicker(blondieButton, async ({ selectedTarget, noteText }) => {
          return sendExport({
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
      await sendExport(null);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      cardState.rows = [];
      cardState.sourceRows = [];
      cardState.lastModified = "";
      cardState.sortStack = buildDefaultSortStack(headers, { cmuUsage: usageCard, hasDate });
      updateCardHeader(cardState);
      renderCardMessage(cardState, "Table closed.");
    });
  }

  wireCardRerunAndFilterActions(cardState);
  tableState.data = sortRows(tableState.data, tableState.sortStack, tableState.context);
  renderTableBody(tableState);
  updateTableWrapperViewport(tableState);
  refreshHeaderStates(tableState);
  cardState.sortStack = tableState.sortStack;
  syncBlondieButtons(cardState.bodyElement);
}

function applyReportStart(payload) {
  const requestSource = String(payload?.requestSource || "").trim().toLowerCase();
  if (
    requestSource !== "workspace-programmer-switch" &&
    (
      state.programmerSwitchLoading === true ||
      String(state.pendingAutoRerunProgrammerKey || "").trim() ||
      String(state.autoRerunInFlightProgrammerKey || "").trim()
    )
  ) {
    clearPendingProgrammerSwitchTransition();
    syncActionButtonsDisabled();
  }
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  syncWorkspaceReplayCardsFromCurrentCards();
  cardState.running = true;
  cardState.rows = [];
  cardState.sourceRows = [];
  cardState.sortStack = getDefaultSortStackForCard(cardState);
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Loading report...");
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  syncWorkspaceNetworkIndicator();
}

function applyReportForm(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  syncWorkspaceReplayCardsFromCurrentCards();
  if (payload?.operation && typeof payload.operation === "object") {
    cardState.operation = normalizeOperationDescriptor(payload.operation);
  }
  cardState.formValues = normalizeOperationFormValues(cardState.operation, payload?.formValues || cardState.formValues || {});
  cardState.rows = [];
  cardState.sourceRows = [];
  cardState.sortStack = [];
  updateCardHeader(cardState);
  renderOperationFormCard(cardState, {
    formValues: cardState.formValues,
  });
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function applyReportResult(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  syncWorkspaceReplayCardsFromCurrentCards();
  cardState.running = false;

  if (!payload?.ok) {
    const error = payload?.error || "Request failed.";
    renderCardMessage(cardState, error, { error: true });
    setStatus(error, "error");
    syncWorkspaceNetworkIndicator();
    return;
  }

  const rows = normalizeRows(Array.isArray(payload?.rows) ? payload.rows : []);
  cardState.sourceRows = rows;
  initializeCardLocalFilterBaseline(cardState, rows);
  if (!cardState.startingUiStateCaptured) {
    snapshotCardStartingFilterState(cardState);
  }
  const filteredRows = applyCmLocalColumnFiltersToRows(rows, cardState.localColumnFilters, cardState);
  cardState.rows = filteredRows;
  cardState.lastModified = String(payload?.lastModified || "");
  cardState.sortStack = getDefaultSortStackForCard(cardState);
  updateCardHeader(cardState);

  if (filteredRows.length === 0) {
    renderCardMessage(cardState, "No data");
    syncWorkspaceNetworkIndicator();
    return;
  }

  renderCardTable(cardState, filteredRows, cardState.lastModified);
  syncWorkspaceNetworkIndicator();
}

function applyControllerState(payload) {
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
  if (incomingEnvironment) {
    applyWorkspaceAdobePassEnvironment(incomingEnvironment);
  }
  applyWorkspaceRuntimeAuthContext(payload?.cmAuth);

  const previousProgrammerId = String(state.programmerId || "");
  const previousProgrammerName = String(state.programmerName || "");
  const previousProgrammerKey = getProgrammerIdentityKey(previousProgrammerId, previousProgrammerName);
  const controllerReason = String(payload?.controllerReason || "").trim().toLowerCase();
  const hasWorkspaceCards = hasWorkspaceCardContext();
  const hasActiveWorkspaceContext =
    hasWorkspaceCards ||
    state.batchRunning ||
    Boolean(String(state.pendingAutoRerunProgrammerKey || "").trim()) ||
    Boolean(String(state.autoRerunInFlightProgrammerKey || "").trim());

  let nextCmAvailable = null;
  if (payload?.cmAvailable === true) {
    nextCmAvailable = true;
  } else if (payload?.cmAvailable === false) {
    nextCmAvailable = false;
  }

  let nextCmAvailabilityResolved = false;
  if (payload?.cmAvailabilityResolved === true) {
    nextCmAvailabilityResolved = true;
  } else if (payload?.cmAvailabilityResolved === false) {
    nextCmAvailabilityResolved = false;
  } else {
    nextCmAvailabilityResolved = nextCmAvailable === true || nextCmAvailable === false;
  }

  let nextCmContainerVisible = null;
  if (payload?.cmContainerVisible === true) {
    nextCmContainerVisible = true;
  } else if (payload?.cmContainerVisible === false) {
    nextCmContainerVisible = false;
  }

  const sameProgrammerIdentity = !hasProgrammerIdentityChanged(
    previousProgrammerId,
    previousProgrammerName,
    String(payload?.programmerId || ""),
    String(payload?.programmerName || "")
  );
  const shouldIgnoreTransientCmDowngrade =
    nextCmAvailable === false &&
    state.cmAvailable === true &&
    sameProgrammerIdentity &&
    !environmentChanged &&
    hasActiveWorkspaceContext;

  if (shouldIgnoreTransientCmDowngrade) {
    nextCmAvailable = true;
    nextCmAvailabilityResolved = true;
    nextCmContainerVisible = true;
  }

  state.controllerOnline = payload?.controllerOnline === true;
  state.cmAvailable = nextCmAvailable;
  state.cmAvailabilityResolved = nextCmAvailabilityResolved;
  state.cmContainerVisible = nextCmContainerVisible;
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.programmerHydrationReady = payload?.programmerHydrationReady === true;
  state.slackReady = payload?.slack?.ready === true;
  state.slackUserId = String(payload?.slack?.userId || "").trim().toUpperCase();
  state.slackUserName = String(payload?.slack?.userName || "").trim();
  state.slackShareTargets = normalizeBlondieShareTargets(payload?.slack?.shareTargets || []);
  if (!state.slackReady || state.slackShareTargets.length === 0) {
    closeBlondieSharePicker();
  }
  state.premiumPanelRequestToken = Math.max(
    0,
    Number(payload?.premiumPanelRequestToken || state.premiumPanelRequestToken || 0)
  );
  state.workspaceContextKey =
    String(payload?.workspaceContextKey || "").trim() ||
    buildWorkspaceControllerContextKey(
      state.programmerId,
      state.premiumPanelRequestToken,
      incomingEnvironmentKey || previousEnvironmentKey
    );
  state.tenantScope = String(payload?.tenantScope || "").trim();
  state.requestorIds = Array.isArray(payload?.requestorIds)
    ? payload.requestorIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdIds = Array.isArray(payload?.mvpdIds)
    ? payload.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.profileHarvest =
    payload?.profileHarvest && typeof payload.profileHarvest === "object"
      ? {
          ...payload.profileHarvest,
        }
      : null;
  state.profileHarvestList =
    Array.isArray(payload?.profileHarvestList) && payload.profileHarvestList.length > 0
      ? payload.profileHarvestList.filter((item) => item && typeof item === "object").map((item) => ({ ...item }))
      : state.profileHarvest
        ? [{ ...state.profileHarvest }]
        : [];

  const programmerChanged = hasProgrammerIdentityChanged(
    previousProgrammerId,
    previousProgrammerName,
    state.programmerId,
    state.programmerName
  );
  const replayCardsForSwitch = getWorkspaceReplayCards();
  if (programmerChanged || environmentChanged) {
    state.batchRunning = false;
    state.programmerSwitchLoading = false;
    state.programmerSwitchLoadingKey = "";
    state.autoRerunInFlightProgrammerKey = "";
    if (hasWorkspaceCards) {
      state.cardsById.forEach((cardState) => {
        if (cardState) {
          cardState.localDistinctByColumn.clear();
          cardState.localHasBaselineData = false;
        }
      });
    }
    state.cardsById.forEach((cardState) => {
      if (cardState) {
        cardState.running = false;
      }
    });
    syncActionButtonsDisabled();
  }

  state.cardsById.forEach((cardState) => {
    if (!normalizeOperationDescriptor(cardState?.operation)) {
      return;
    }
    const existingValues = cardState.formValues && typeof cardState.formValues === "object" ? cardState.formValues : {};
    cardState.formValues = normalizeOperationFormValues(cardState.operation, {
      baseUrl: String(existingValues.baseUrl || "").trim(),
      authUser: String(existingValues.authUser || "").trim(),
      authPass: String(existingValues.authPass || "").trim(),
      xTerminate: String(existingValues.xTerminate || "").trim(),
    });
    if (cardState.bodyElement?.querySelector(".cm-api-form")) {
      renderOperationFormCard(cardState, {
        formValues: cardState.formValues,
      });
    }
  });

  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  const isMediaCompanySwitchReason =
    !controllerReason || controllerReason === "media-company-change" || controllerReason === "programmer-change";
  const shouldTriggerWorkspaceRedraw =
    replayCardsForSwitch.length > 0 &&
    Boolean(currentProgrammerKey) &&
    ((programmerChanged &&
      Boolean(previousProgrammerKey) &&
      isMediaCompanySwitchReason) ||
      (environmentChanged && controllerReason === "environment-switch"));
  if (shouldTriggerWorkspaceRedraw && currentProgrammerKey) {
    state.workspaceReplayCards = cloneWorkspaceReplayCards(replayCardsForSwitch);
    state.pendingAutoRerunCards = cloneWorkspaceReplayCards(replayCardsForSwitch);
    state.programmerSwitchLoading = true;
    state.programmerSwitchLoadingKey = currentProgrammerKey;
    setStatus(
      state.pendingAutoRerunCards.length > 0
        ? `Refreshing ${state.pendingAutoRerunCards.length} report(s) for ${getProgrammerLabel()}...`
        : "Refreshing workspace for selected Media Company..."
    );
    state.pendingAutoRerunProgrammerKey = currentProgrammerKey;
  } else if (programmerChanged || (environmentChanged && replayCardsForSwitch.length === 0)) {
    state.programmerSwitchLoading = false;
    state.programmerSwitchLoadingKey = "";
    state.pendingAutoRerunProgrammerKey = "";
    state.pendingAutoRerunCards = [];
    if (environmentChanged && replayCardsForSwitch.length === 0) {
      setStatus(`Environment changed to ${String(state.adobePassEnvironment?.label || incomingEnvironmentKey || "Production")}.`);
    }
  }

  syncTearsheetButtonsVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
  syncBlondieButtons();
  maybeConsumePendingAutoRerun();
  void maybeConsumePendingWorkspaceDeeplink();
}

function handleWorkspaceEvent(eventName, payload) {
  const event = String(eventName || "").trim();
  if (!event) {
    return;
  }

  if (
    ["report-start", "report-form", "report-result", "batch-start", "batch-end", "csv-complete"].includes(event) &&
    !doesWorkspaceEventMatchCurrentContext(payload)
  ) {
    return;
  }

  if (event === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (event === "report-start") {
    applyReportStart(payload);
    return;
  }
  if (event === "report-form") {
    applyReportForm(payload);
    return;
  }
  if (event === "report-result") {
    applyReportResult(payload);
    return;
  }
  if (event === "batch-start") {
    if (String(payload?.reason || "").trim().toLowerCase() !== "programmer-switch" && state.programmerSwitchLoading === true) {
      clearPendingProgrammerSwitchTransition();
    }
    state.batchRunning = true;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    const reason = String(payload?.reason || "").trim().toLowerCase();
    if (reason === "programmer-switch") {
      setStatus(total > 0 ? `Refreshing ${total} report(s) for ${getProgrammerLabel()}...` : "Refreshing workspace...");
    } else if (reason === "manual-reload") {
      setStatus(total > 0 ? `Reloading ${total} report(s)...` : "Reloading reports...");
    } else {
      setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    }
    return;
  }
  if (event === "batch-end") {
    state.batchRunning = false;
    if (String(payload?.reason || "").trim().toLowerCase() === "programmer-switch" && !String(state.pendingAutoRerunProgrammerKey || "").trim()) {
      state.programmerSwitchLoading = false;
      state.programmerSwitchLoadingKey = "";
      state.autoRerunInFlightProgrammerKey = "";
    }
    state.cardsById.forEach((cardState) => {
      if (cardState) {
        cardState.running = false;
      }
    });
    syncWorkspaceReplayCardsFromCurrentCards();
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
    maybeConsumePendingAutoRerun();
    return;
  }
  if (event === "environment-switch-rerun") {
    const replayCards = getWorkspaceReplayCards();
    if (state.batchRunning || replayCards.length === 0) {
      return;
    }
    const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
    if (!currentProgrammerKey) {
      return;
    }
    state.pendingAutoRerunCards = cloneWorkspaceReplayCards(replayCards);
    state.pendingAutoRerunProgrammerKey = currentProgrammerKey;
    state.programmerSwitchLoading = true;
    state.programmerSwitchLoadingKey = currentProgrammerKey;
    maybeConsumePendingAutoRerun();
    return;
  }
}

function hasChromeRuntimeMessaging() {
  return (
    typeof chrome !== "undefined" &&
    chrome?.runtime &&
    typeof chrome.runtime.sendMessage === "function"
  );
}

function hasChromeRuntimeMessageListener() {
  return (
    typeof chrome !== "undefined" &&
    chrome?.runtime &&
    chrome.runtime.onMessage &&
    typeof chrome.runtime.onMessage.addListener === "function"
  );
}

function getOrderedCardStates() {
  const ordered = [];
  if (els.cardsHost) {
    els.cardsHost.querySelectorAll(".report-card[data-card-id]").forEach((element) => {
      const cardId = String(element.getAttribute("data-card-id") || "").trim();
      if (!cardId || !state.cardsById.has(cardId)) {
        return;
      }
      ordered.push(state.cardsById.get(cardId));
    });
  }
  if (ordered.length > 0) {
    return ordered;
  }
  return [...state.cardsById.values()];
}

function sanitizeDownloadFileSegment(value, fallback = "download") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function truncateDownloadFileSegment(value, maxLength = 48) {
  const text = String(value || "");
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).replace(/[_-]+$/g, "");
}

function getWorkspaceEnvironmentFileTag(environment = null) {
  const resolved =
    environment && typeof environment === "object"
      ? environment
      : state.adobePassEnvironment && typeof state.adobePassEnvironment === "object"
        ? state.adobePassEnvironment
        : DEFAULT_ADOBEPASS_ENVIRONMENT;
  const raw = [
    resolved?.shortCode,
    resolved?.label,
    resolved?.key,
    resolved?.route,
    resolved?.consoleBase,
    resolved?.mgmtBase,
    resolved?.spBase,
    resolved?.consoleShellUrl,
    resolved?.cmConsoleOrigin,
    resolved?.cmConsoleShellUrl,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (raw.includes("staging") || raw.includes("stage")) {
    return "STAGE";
  }
  return "PROD";
}

function buildClickCmuWorkspaceFileName(snapshot = {}) {
  const mediaCompany = truncateDownloadFileSegment(
    sanitizeDownloadFileSegment(
      firstNonEmptyString([snapshot?.programmerName, snapshot?.programmerId, "MediaCompany"]),
      "MediaCompany"
    ),
    48
  );
  const envTag = getWorkspaceEnvironmentFileTag(snapshot?.adobePassEnvironment);
  const epoch = Date.now();
  return `${mediaCompany}_clickCMUWS_${envTag}_${epoch}.html`;
}

function serializeCardForWorkspaceExport(cardState) {
  if (!cardState) {
    return null;
  }
  return {
    cardId: String(cardState.cardId || ""),
    endpointUrl: String(cardState.endpointUrl || ""),
    requestUrl: String(cardState.requestUrl || cardState.endpointUrl || ""),
    baseRequestUrl: String(cardState.baseRequestUrl || cardState.requestUrl || cardState.endpointUrl || ""),
    seedEndpointUrl: String(cardState.seedEndpointUrl || ""),
    seedRequestUrl: String(cardState.seedRequestUrl || ""),
    seedBaseRequestUrl: String(cardState.seedBaseRequestUrl || ""),
    zoomKey: String(cardState.zoomKey || ""),
    tenantId: String(cardState.tenantId || ""),
    tenantName: String(cardState.tenantName || ""),
    columns: Array.isArray(cardState.columns) ? cardState.columns.map((column) => String(column || "")).filter(Boolean) : [],
    seedLocalColumnFilters: serializeCmLocalColumnFilters(cardState.seedLocalColumnFilters, cardState),
    localColumnFilters: serializeCmLocalColumnFilters(cardState.localColumnFilters, cardState),
    operation: cardState.operation && typeof cardState.operation === "object" ? { ...cardState.operation } : null,
    formValues: cardState.formValues && typeof cardState.formValues === "object" ? { ...cardState.formValues } : {},
    rows: normalizeRows(Array.isArray(cardState.rows) ? cardState.rows : []),
    sourceRows: normalizeRows(Array.isArray(cardState.sourceRows) ? cardState.sourceRows : []),
    sortStack:
      Array.isArray(cardState.sortStack) && cardState.sortStack.length > 0
        ? cardState.sortStack
            .map((rule) => ({
              col: String(rule?.col || "").trim(),
              dir: String(rule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
            }))
            .filter((rule) => rule.col)
        : [],
    lastModified: String(cardState.lastModified || ""),
  };
}

function buildWorkspaceExportSnapshot(options = {}) {
  const cards = getOrderedCardStates()
    .map((cardState) => serializeCardForWorkspaceExport(cardState))
    .filter(Boolean);
  const generatedAt = new Date();
  return {
    title: `${getProgrammerLabel()} clickCMU Workspace`,
    controllerStateText: String(els.controllerState?.textContent || "").trim(),
    filterStateText: String(els.filterState?.textContent || "").trim(),
    exportMetaText: "",
    adobePassEnvironment:
      state.adobePassEnvironment && typeof state.adobePassEnvironment === "object"
        ? { ...state.adobePassEnvironment }
        : { ...DEFAULT_ADOBEPASS_ENVIRONMENT },
    programmerId: String(state.programmerId || ""),
    programmerName: String(state.programmerName || ""),
    requestorIds: Array.isArray(state.requestorIds) ? state.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(state.mvpdIds) ? state.mvpdIds.slice(0, 24) : [],
    profileHarvest: state.profileHarvest && typeof state.profileHarvest === "object" ? { ...state.profileHarvest } : null,
    profileHarvestList:
      Array.isArray(state.profileHarvestList) && state.profileHarvestList.length > 0
        ? state.profileHarvestList.filter((entry) => entry && typeof entry === "object").map((entry) => ({ ...entry }))
        : [],
    vaultExportPayload:
      options?.vaultExportPayload && typeof options.vaultExportPayload === "object"
        ? cloneJsonCompatible(options.vaultExportPayload, null)
        : null,
    generatedAt: generatedAt.toISOString(),
    clientTimeZone: CLIENT_TIMEZONE,
    cards,
  };
}

async function loadWorkspaceStylesheetText() {
  if (typeof workspaceStylesheetTextCache === "string" && workspaceStylesheetTextCache.trim().length > 0) {
    return workspaceStylesheetTextCache;
  }
  const stylesheetUrl = String(els.stylesheet?.href || "").trim();
  if (!stylesheetUrl) {
    throw new Error("Workspace stylesheet URL is unavailable.");
  }
  const response = await fetch(stylesheetUrl, {
    method: "GET",
    credentials: "omit",
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Unable to load workspace stylesheet (${response.status}).`);
  }
  const stylesheetText = await response.text();
  if (!String(stylesheetText || "").trim()) {
    throw new Error("Workspace stylesheet is empty.");
  }
  workspaceStylesheetTextCache = stylesheetText;
  return workspaceStylesheetTextCache;
}

async function loadWorkspaceTearsheetRuntimeText() {
  if (typeof workspaceTearsheetRuntimeTextCache === "string" && workspaceTearsheetRuntimeTextCache.trim().length > 0) {
    return workspaceTearsheetRuntimeTextCache;
  }
  if (!hasChromeRuntimeMessaging() || !chrome?.runtime?.getURL) {
    throw new Error("CM workspace runtime loader requires extension context.");
  }
  const runtimeUrl = chrome.runtime.getURL(WORKSPACE_TEARSHEET_RUNTIME_PATH);
  const response = await fetch(runtimeUrl, {
    method: "GET",
    credentials: "omit",
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Unable to load clickCMUWS runtime (${response.status}).`);
  }
  const runtimeText = await response.text();
  if (!String(runtimeText || "").trim()) {
    throw new Error("clickCMUWS runtime is empty.");
  }
  workspaceTearsheetRuntimeTextCache = runtimeText;
  return workspaceTearsheetRuntimeTextCache;
}

async function loadWorkspaceTearsheetTemplateText() {
  if (typeof workspaceTearsheetTemplateTextCache === "string" && workspaceTearsheetTemplateTextCache.trim().length > 0) {
    return workspaceTearsheetTemplateTextCache;
  }
  if (!hasChromeRuntimeMessaging() || !chrome?.runtime?.getURL) {
    throw new Error("CM workspace template loader requires extension context.");
  }
  const templateUrl = chrome.runtime.getURL(WORKSPACE_TEARSHEET_TEMPLATE_PATH);
  const response = await fetch(templateUrl, {
    method: "GET",
    credentials: "omit",
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Unable to load clickCMUWS template (${response.status}).`);
  }
  const templateText = await response.text();
  if (!String(templateText || "").trim()) {
    throw new Error("clickCMUWS template is empty.");
  }
  workspaceTearsheetTemplateTextCache = templateText;
  return workspaceTearsheetTemplateTextCache;
}

function buildWorkspaceTearsheetHtml(snapshot, templateHtml, stylesheetText, runtimeScriptText, authContext = {}) {
  const templateText = String(templateHtml || "");
  if (!templateText.trim()) {
    throw new Error("clickCMUWS template is empty.");
  }
  const runtimeScript = String(runtimeScriptText || "").replace(/<\/script/gi, "<\\/script");
  if (!runtimeScript.trim()) {
    throw new Error("clickCMUWS runtime script is empty.");
  }
  const safeStyles = String(stylesheetText || "").replace(/<\/style/gi, "<\\/style");
  if (!safeStyles.trim()) {
    throw new Error("clickCMUWS stylesheet is empty.");
  }
  const payloadJson = JSON.stringify(snapshot || {}).replace(/</g, "\\u003c");

  const doc = new DOMParser().parseFromString(templateText, "text/html");
  if (!doc?.documentElement || !doc?.head || !doc?.body) {
    throw new Error("clickCMUWS template is invalid.");
  }

  const titleText = String(snapshot?.title || "clickCMU Workspace Tearsheet").trim() || "clickCMU Workspace Tearsheet";
  doc.title = titleText;

  const styleNode = doc.createElement("style");
  styleNode.id = "workspace-style-inline";
  styleNode.textContent = safeStyles;
  const existingStyleLink = doc.getElementById("workspace-style-link");
  if (existingStyleLink?.parentNode) {
    existingStyleLink.parentNode.replaceChild(styleNode, existingStyleLink);
  } else {
    doc.head.append(styleNode);
  }

  doc.querySelectorAll("script[src]").forEach((node) => node.remove());

  const genericClickCmuButton = doc.getElementById("workspace-make-clickcmu");
  if (genericClickCmuButton) {
    genericClickCmuButton.remove();
  }
  const workspaceClickCmuButton = doc.getElementById("workspace-make-clickcmuws");
  if (workspaceClickCmuButton) {
    workspaceClickCmuButton.remove();
  }
  const workspaceClearAllButton = doc.getElementById("workspace-clear-all");
  if (workspaceClearAllButton) {
    workspaceClearAllButton.remove();
  }

  upsertBodyHiddenInput(doc, CM_WORKSPACE_RUNTIME_TOKEN_INPUT_NAME, String(authContext?.accessToken || ""));
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_CLIENT_IDS_INPUT_NAME,
    JSON.stringify(
      dedupeCandidateStrings(
        (Array.isArray(authContext?.clientIds) ? authContext.clientIds : [])
          .map((value) => String(value || "").trim())
          .filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_PRIMARY_CLIENT_ID)
      )
    )
  );
  upsertBodyHiddenInput(doc, CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME, String(authContext?.userId || ""));
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME,
    String(authContext?.scope || CM_WORKSPACE_IMS_DEFAULT_SCOPE || "")
  );
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_TOKEN_INPUT_NAME,
    String(authContext?.experienceCloudAccessToken || "")
  );
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_CLIENT_IDS_INPUT_NAME,
    JSON.stringify(
      dedupeCandidateStrings(
        (Array.isArray(authContext?.experienceCloudClientIds) ? authContext.experienceCloudClientIds : [])
          .map((value) => String(value || "").trim())
          .filter((value) => String(value || "").trim().toLowerCase() === CM_WORKSPACE_EXPERIENCE_CLIENT_ID)
      )
    )
  );
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_USER_ID_INPUT_NAME,
    String(authContext?.experienceCloudUserId || "")
  );
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_EXPERIENCE_SCOPE_INPUT_NAME,
    String(authContext?.experienceCloudScope || "")
  );

  const payloadNode = doc.createElement("script");
  payloadNode.id = WORKSPACE_TEARSHEET_PAYLOAD_ID;
  payloadNode.type = "application/json";
  payloadNode.textContent = payloadJson;
  doc.body.append(payloadNode);

  const runtimeNode = doc.createElement("script");
  runtimeNode.textContent = runtimeScript;
  doc.body.append(runtimeNode);

  return `<!doctype html>\n${doc.documentElement.outerHTML}`;
}

function downloadHtmlFile(htmlText, fileName) {
  const blob = new Blob([String(htmlText || "")], { type: "text/html;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = String(fileName || `clickCMUWS_${Date.now()}.html`);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1500);
}

function resolveCardStateForPayload(cardPayload) {
  const cardId = String(cardPayload?.cardId || "").trim();
  if (cardId && state.cardsById.has(cardId)) {
    return state.cardsById.get(cardId);
  }
  const endpointKey = getWorkspaceEndpointKey(String(cardPayload?.endpointUrl || cardPayload?.baseRequestUrl || cardPayload?.requestUrl || ""));
  if (!endpointKey) {
    return null;
  }
  for (const cardState of state.cardsById.values()) {
    const candidateKey = getWorkspaceEndpointKey(
      String(cardState?.endpointUrl || cardState?.baseRequestUrl || cardState?.requestUrl || "")
    );
    if (candidateKey && candidateKey === endpointKey) {
      return cardState;
    }
  }
  return null;
}

function normalizeSortRule(sortRule) {
  const col = String(sortRule?.col || "").trim();
  if (!col) {
    return null;
  }
  return {
    col,
    dir: String(sortRule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
  };
}

function buildCardRequestUrlForStandaloneRun(cardState, cardPayload = {}) {
  const usageCard = isCmuUsageCard(cardState);
  const baseRequestUrl = String(
    cardPayload?.requestUrl ||
      cardPayload?.baseRequestUrl ||
      cardState?.requestUrl ||
      cardState?.baseRequestUrl ||
      cardState?.endpointUrl ||
      ""
  ).trim();
  if (!baseRequestUrl) {
    throw new Error("CM card request URL is missing.");
  }
  const filteredRequestUrl = appendCmLocalColumnFiltersToUrl(baseRequestUrl, cardState?.localColumnFilters, cardState);
  return usageCard ? ensureCmuQueryDefaults(filteredRequestUrl, resolveWorkspaceTenantScope(cardState, cardPayload)) : filteredRequestUrl;
}

function buildStandaloneOperationRequest(operation, formValues = {}) {
  const descriptor = normalizeOperationDescriptor(operation);
  if (!descriptor) {
    throw new Error("CM V2 operation metadata is missing.");
  }
  if (!descriptor.pathTemplate) {
    throw new Error("CM V2 operation path template is missing.");
  }

  const values = normalizeOperationFormValues(descriptor, formValues || {});
  const baseUrlRaw = String(values.baseUrl || CM_WORKSPACE_FALLBACK_BASE_URL).trim();
  const baseUrl = baseUrlRaw.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("CM V2 base URL is required.");
  }

  const pathParams = descriptor.parameters.filter((item) => item.in === "path");
  const headerParams = descriptor.parameters.filter((item) => item.in === "header");
  const queryParams = descriptor.parameters.filter((item) => item.in === "query");

  let resolvedPath = descriptor.pathTemplate;
  pathParams.forEach((param) => {
    const fieldName = String(param?.name || "").trim();
    if (!fieldName) {
      return;
    }
    const lookupKey = fieldName.toLowerCase() === "x-terminate" ? "xTerminate" : fieldName;
    const value = String(values?.[lookupKey] || "").trim();
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
    const fieldName = String(param?.name || "").trim();
    if (!fieldName) {
      return;
    }
    const value = String(values?.[fieldName] || "").trim();
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
    const fieldName = String(param?.name || "").trim();
    if (!fieldName) {
      return;
    }
    const lookupKey = fieldName.toLowerCase() === "x-terminate" ? "xTerminate" : fieldName;
    const rawValue = String(values?.[lookupKey] || "").trim();
    if (!rawValue && param.required) {
      throw new Error(`CM V2 header "${fieldName}" is required.`);
    }
    if (!rawValue) {
      return;
    }
    if (fieldName.toLowerCase() === "x-terminate") {
      const normalized = rawValue
        .split(/[\n,]+/)
        .map((item) => String(item || "").trim())
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
    headers.Authorization = `Basic ${btoa(`${values.authUser || ""}:${values.authPass || ""}`)}`;
  }

  const queryText = query.toString();
  const url = `${baseUrl}${resolvedPath}${queryText ? `?${queryText}` : ""}`;
  return {
    url,
    method: descriptor.method || "GET",
    headers,
    formValues: values,
  };
}

async function runStandaloneCard(cardPayload = {}, options = {}) {
  const cardId = String(cardPayload?.cardId || "").trim() || buildWorkspaceCardId("runtime");
  const startPayload = {
    cardId,
    endpointUrl: String(cardPayload?.endpointUrl || ""),
    requestUrl: String(cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
    baseRequestUrl: String(cardPayload?.baseRequestUrl || cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
    zoomKey: String(cardPayload?.zoomKey || ""),
    columns: Array.isArray(cardPayload?.columns) ? cardPayload.columns : [],
    localColumnFilters: cardPayload?.localColumnFilters || {},
  };
  handleWorkspaceEvent("report-start", startPayload);
  const cardState = resolveCardStateForPayload(startPayload) || ensureCard(startPayload);
  if (!cardState) {
    return { ok: false, error: "Unable to resolve workspace card state." };
  }

  try {
    const requestUrl = buildCardRequestUrlForStandaloneRun(cardState, cardPayload);
    const response = await fetchCmWorkspaceWithAuth(requestUrl, {
      method: "GET",
      credentials: "include",
    });
    const responseText = await response.text().catch(() => "");
    const parsed = safeJsonParse(responseText, null);
    if (!response.ok) {
      const errorPreview = String(responseText || "").trim();
      throw new Error(`HTTP ${response.status}${errorPreview ? ` ${errorPreview}` : ""}`);
    }
    const rows = normalizeRows(extractRowsFromCmPayload(parsed));
    const columns =
      rows.length > 0
        ? Object.keys(rows[0]).filter((key) => String(key || "").trim() && !String(key || "").startsWith("__"))
        : Array.isArray(cardState.columns)
          ? cardState.columns
          : [];
    handleWorkspaceEvent("report-result", {
      ...startPayload,
      ok: true,
      requestUrl,
      baseRequestUrl: String(cardPayload?.baseRequestUrl || cardState.baseRequestUrl || requestUrl),
      rows,
      columns,
      lastModified: String(response.headers.get("Last-Modified") || response.headers.get("Date") || ""),
    });
    if (options.suppressStatus !== true) {
      setStatus(rows.length > 0 ? `Loaded ${rows.length} row(s).` : "No data.");
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    handleWorkspaceEvent("report-result", {
      ...startPayload,
      ok: false,
      error: message || "Request failed.",
    });
    if (options.suppressStatus !== true) {
      setStatus(message || "Request failed.", "error");
    }
    return { ok: false, error: message || "Request failed." };
  }
}

async function runStandaloneApiOperation(cardPayload = {}, formValues = {}, options = {}) {
  const cardId = String(cardPayload?.cardId || "").trim() || buildWorkspaceCardId("runtime-op");
  const operation = normalizeOperationDescriptor(cardPayload?.operation);
  if (!operation) {
    return { ok: false, error: "CM V2 operation metadata is missing." };
  }
  const normalizedFormValues = normalizeOperationFormValues(operation, formValues || cardPayload?.formValues || {});
  handleWorkspaceEvent("report-form", {
    cardId,
    endpointUrl: String(cardPayload?.endpointUrl || ""),
    requestUrl: String(cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
    baseRequestUrl: String(cardPayload?.baseRequestUrl || cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
    zoomKey: String(cardPayload?.zoomKey || "CMV2"),
    columns: Array.isArray(cardPayload?.columns) ? cardPayload.columns : [],
    operation,
    formValues: normalizedFormValues,
    localColumnFilters: cardPayload?.localColumnFilters || {},
  });
  const cardState = resolveCardStateForPayload({ cardId }) || ensureCard({ cardId, operation, formValues: normalizedFormValues });
  if (!cardState) {
    return { ok: false, error: "Unable to resolve CM V2 operation card state." };
  }

  try {
    const request = buildStandaloneOperationRequest(operation, normalizedFormValues);
    handleWorkspaceEvent("report-start", {
      cardId,
      endpointUrl: String(cardPayload?.endpointUrl || request.url || operation.pathTemplate || ""),
      requestUrl: request.url,
      baseRequestUrl: String(cardPayload?.baseRequestUrl || request.url || ""),
      zoomKey: String(cardPayload?.zoomKey || "CMV2"),
      columns: Array.isArray(cardPayload?.columns) ? cardPayload.columns : [],
      operation,
      formValues: request.formValues,
      localColumnFilters: cardPayload?.localColumnFilters || {},
    });

    const response = isBasicAuthHeader(request.headers?.Authorization || "")
      ? await fetchWithTimeout(request.url, {
          method: request.method,
          credentials: "include",
          headers: request.headers,
        })
      : await fetchCmWorkspaceWithAuth(request.url, {
          method: request.method,
          credentials: "include",
          headers: request.headers,
        });

    const responseText = await response.text().catch(() => "");
    const parsed = safeJsonParse(responseText, null);
    if (!response.ok) {
      const errorPreview = String(responseText || "").trim();
      throw new Error(`HTTP ${response.status}${errorPreview ? ` ${errorPreview}` : ""}`);
    }
    const rows = normalizeRows(extractRowsFromCmPayload(parsed));
    const columns =
      rows.length > 0
        ? Object.keys(rows[0]).filter((key) => String(key || "").trim() && !String(key || "").startsWith("__"))
        : Array.isArray(cardState.columns)
          ? cardState.columns
          : [];

    handleWorkspaceEvent("report-result", {
      cardId,
      endpointUrl: String(cardPayload?.endpointUrl || request.url || operation.pathTemplate || ""),
      requestUrl: request.url,
      baseRequestUrl: String(cardPayload?.baseRequestUrl || request.url || ""),
      zoomKey: String(cardPayload?.zoomKey || "CMV2"),
      columns,
      operation,
      formValues: request.formValues,
      localColumnFilters: cardPayload?.localColumnFilters || {},
      ok: true,
      rows,
      lastModified: String(response.headers.get("Last-Modified") || response.headers.get("Date") || ""),
    });
    if (options.suppressStatus !== true) {
      setStatus(rows.length > 0 ? `Loaded ${rows.length} row(s).` : "No data.");
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    handleWorkspaceEvent("report-result", {
      cardId,
      endpointUrl: String(cardPayload?.endpointUrl || ""),
      requestUrl: String(cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
      baseRequestUrl: String(cardPayload?.baseRequestUrl || cardPayload?.requestUrl || cardPayload?.endpointUrl || ""),
      zoomKey: String(cardPayload?.zoomKey || "CMV2"),
      operation,
      formValues: normalizedFormValues,
      localColumnFilters: cardPayload?.localColumnFilters || {},
      ok: false,
      error: message || "CM V2 request failed.",
    });
    if (options.suppressStatus !== true) {
      setStatus(message || "CM V2 request failed.", "error");
    }
    return { ok: false, error: message || "CM V2 request failed." };
  }
}

function csvEscape(value) {
  const text = String(value == null ? "" : value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function buildStandaloneCsvRows(cardState, sortRule = null) {
  const rows = normalizeRows(Array.isArray(cardState?.rows) ? cardState.rows : []);
  if (rows.length === 0) {
    return [];
  }
  const usageCard = isCmuUsageCard(cardState);
  if (!usageCard) {
    const headers = collectCardDataColumns(cardState);
    if (headers.length === 0) {
      return [];
    }
    const normalizedSortRule = normalizeSortRule(sortRule);
    const sortStack =
      normalizedSortRule && headers.includes(normalizedSortRule.col)
        ? [normalizedSortRule]
        : Array.isArray(cardState?.sortStack) && cardState.sortStack.length > 0
          ? cardState.sortStack
          : buildDefaultSortStack(headers, { cmuUsage: false, hasDate: false });
    const sortedRows = sortRows(rows, sortStack, null);
    return [
      headers,
      ...sortedRows.map((row) => headers.map((header) => getRowValueByColumn(row, header) ?? "")),
    ];
  }

  const firstRow = rows[0] || {};
  const hasAuthN = getRowValueByColumn(firstRow, "authn-attempts") != null && getRowValueByColumn(firstRow, "authn-successful") != null;
  const hasAuthZ = getRowValueByColumn(firstRow, "authz-attempts") != null && getRowValueByColumn(firstRow, "authz-successful") != null;
  const hasCount = getRowValueByColumn(firstRow, "count") != null;
  const displayColumns = getCmuUsageTableDisplayColumns(cardState, firstRow);
  const headers = [
    "DATE",
    ...(hasAuthN ? ["AuthN Success"] : []),
    ...(hasAuthZ ? ["AuthZ Success"] : []),
    ...(!hasAuthN && !hasAuthZ && hasCount ? ["COUNT"] : []),
    ...displayColumns,
  ];
  const context = {
    mode: "cmu-usage",
    hasDate: true,
    hasAuthN,
    hasAuthZ,
  };
  const normalizedSortRule = normalizeSortRule(sortRule);
  const sortStack =
    normalizedSortRule && headers.includes(normalizedSortRule.col)
      ? [normalizedSortRule]
      : Array.isArray(cardState?.sortStack) && cardState.sortStack.length > 0
        ? cardState.sortStack
        : getDefaultCmuUsageSortStack();
  const sortedRows = sortRows(rows, sortStack, context);
  const csvRows = [headers];
  sortedRows.forEach((row) => {
    const line = [buildCmuDateLabel(row)];
    if (hasAuthN) {
      line.push(formatPercent(safeRate(getRowValueByColumn(row, "authn-successful"), getRowValueByColumn(row, "authn-attempts"))));
    }
    if (hasAuthZ) {
      line.push(formatPercent(safeRate(getRowValueByColumn(row, "authz-successful"), getRowValueByColumn(row, "authz-attempts"))));
    }
    if (!hasAuthN && !hasAuthZ && hasCount) {
      line.push(getRowValueByColumn(row, "count") ?? "");
    }
    displayColumns.forEach((columnName) => {
      line.push(getRowValueByColumn(row, columnName) ?? "");
    });
    csvRows.push(line);
  });
  return csvRows;
}

function downloadStandaloneCardCsv(cardPayload = {}, sortRule = null) {
  const cardState = resolveCardStateForPayload(cardPayload);
  if (!cardState) {
    return { ok: false, error: "CM workspace card is unavailable for CSV export." };
  }
  const csvRows = buildStandaloneCsvRows(cardState, sortRule);
  if (csvRows.length === 0) {
    return { ok: false, error: "No CM data is available for CSV export." };
  }
  const csvText = csvRows.map((row) => row.map((value) => csvEscape(value)).join(",")).join("\r\n");
  const nodeLabel = truncateDownloadFileSegment(
    sanitizeDownloadFileSegment(getNodeLabel(getCardEffectiveRequestUrl(cardState)), "workspace"),
    56
  );
  const envTag = getWorkspaceEnvironmentFileTag();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${nodeLabel}_clickCMUWS_${envTag}_${stamp}.csv`;
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1500);
  return { ok: true, fileName };
}

async function runStandaloneBatch(cards = [], reason = "") {
  const queue = Array.isArray(cards) ? cards : [];
  handleWorkspaceEvent("batch-start", {
    total: queue.length,
    reason: String(reason || ""),
    startedAt: Date.now(),
  });
  for (const card of queue) {
    if (normalizeOperationDescriptor(card?.operation)) {
      await runStandaloneApiOperation(card, card?.formValues || {}, { suppressStatus: true });
    } else {
      await runStandaloneCard(card, { suppressStatus: true });
    }
  }
  handleWorkspaceEvent("batch-end", {
    total: queue.length,
    reason: String(reason || ""),
    completedAt: Date.now(),
  });
  return { ok: true };
}

async function sendWorkspaceActionInStandaloneRuntime(action, payload = {}) {
  const normalizedAction = String(action || "").trim().toLowerCase();
  if (normalizedAction === "workspace-ready") {
    return { ok: true, controllerOnline: true, standalone: true };
  }
  if (normalizedAction === "run-card") {
    const card = payload?.card && typeof payload.card === "object" ? payload.card : {};
    return runStandaloneCard(card);
  }
  if (normalizedAction === "run-api-operation") {
    const card = payload?.card && typeof payload.card === "object" ? payload.card : {};
    const formValues = payload?.formValues && typeof payload.formValues === "object" ? payload.formValues : {};
    return runStandaloneApiOperation(card, formValues);
  }
  if (normalizedAction === "rerun-all") {
    return runStandaloneBatch(payload?.cards, payload?.reason || "");
  }
  if (normalizedAction === "download-csv") {
    return downloadStandaloneCardCsv(payload?.card || {}, payload?.sortRule || null);
  }
  return {
    ok: false,
    error: `Unsupported workspace action in clickCMUWS tearsheet: ${normalizedAction || "unknown"}`,
  };
}

async function sendWorkspaceAction(action, payload = {}) {
  const normalizedAction = String(action || "").trim();
  const startedAt = Date.now();
  if (String(action || "").trim().toLowerCase() !== "workspace-ready" && !ensureWorkspaceUnlocked()) {
    emitCmWorkspaceConsoleTrace("runtime", `blocked ${normalizedAction || "workspace-action"}`, {
      phase: "blocked",
      action: normalizedAction,
      payload,
      reason: getWorkspaceLockMessage(),
    }, { level: "warn" });
    return { ok: false, error: getWorkspaceLockMessage() };
  }
  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME || !hasChromeRuntimeMessaging()) {
    emitCmWorkspaceConsoleTrace("runtime", `standalone ${normalizedAction || "workspace-action"}`, {
      phase: "request",
      action: normalizedAction,
      payload,
    });
    const response = await sendWorkspaceActionInStandaloneRuntime(action, payload);
    emitCmWorkspaceConsoleTrace("runtime", `standalone ${normalizedAction || "workspace-action"}`, {
      phase: "response",
      action: normalizedAction,
      durationMs: Date.now() - startedAt,
      response,
    });
    return response;
  }
  try {
    emitCmWorkspaceConsoleTrace("runtime", `send ${normalizedAction || "workspace-action"}`, {
      phase: "request",
      action: normalizedAction,
      payload,
    });
    const response = await chrome.runtime.sendMessage({
      type: CM_MESSAGE_TYPE,
      channel: "workspace-action",
      action,
      ...payload,
    });
    emitCmWorkspaceConsoleTrace("runtime", `recv ${normalizedAction || "workspace-action"}`, {
      phase: "response",
      action: normalizedAction,
      durationMs: Date.now() - startedAt,
      response,
    });
    return response;
  } catch (error) {
    emitCmWorkspaceConsoleTrace(
      "runtime",
      `error ${normalizedAction || "workspace-action"}`,
      {
        phase: "error",
        action: normalizedAction,
        durationMs: Date.now() - startedAt,
        payload,
        error,
      },
      { level: "error" }
    );
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function maybeConsumePendingWorkspaceDeeplink() {
  const pending = state.pendingWorkspaceDeeplink;
  if (!pending || state.pendingWorkspaceDeeplinkConsuming) {
    return;
  }
  if (!state.controllerOnline || !String(state.programmerId || "").trim()) {
    return;
  }

  if (state.cmAvailable === false || state.cmContainerVisible === false || state.workspaceLocked || state.nonCmMode) {
    state.pendingWorkspaceDeeplink = null;
    clearWorkspaceDeeplinkFromLocation();
    setStatus(
      "This CM deeplink needs an active Concurrency Monitoring-scoped Media Company selected in UnderPAR.",
      "error"
    );
    return;
  }

  state.pendingWorkspaceDeeplinkConsuming = true;
  try {
    const tenantScope = resolveWorkspaceTenantScope();
    const requestUrl =
      applyWorkspaceTenantScopeToDeeplinkUrl(buildWorkspaceDeeplinkAbsoluteRequestUrl(pending.requestPath), tenantScope) ||
      buildWorkspaceDeeplinkAbsoluteRequestUrl(pending.requestPath);
    const endpointUrl = buildWorkspaceDeeplinkAbsoluteEndpointUrl(pending.requestPath);
    const baseRequestUrl =
      buildInheritedRequestUrl(endpointUrl || requestUrl, requestUrl, tenantScope) ||
      applyWorkspaceTenantScopeToDeeplinkUrl(requestUrl, tenantScope) ||
      requestUrl;
    if (!requestUrl || !endpointUrl) {
      throw new Error("This CM deeplink is missing a valid request path.");
    }
    const result = await sendWorkspaceAction("run-card", {
      requestSource: "workspace-path-link",
      card: {
        cardId: buildWorkspaceCardId("deeplink"),
        endpointUrl,
        requestUrl: baseRequestUrl,
        baseRequestUrl,
        columns: [],
        tenantId: String(tenantScope || "").trim(),
        tenantName: resolveWorkspaceTenantLabel(),
      },
    });
    if (!result?.ok) {
      throw new Error(result?.error || "Unable to open CM deeplink.");
    }
    state.pendingWorkspaceDeeplink = null;
    clearWorkspaceDeeplinkFromLocation();
    setStatus(
      `Loaded ${String(pending.displayNodeLabel || pending.requestPath || "CM report").trim()} from Slack.`,
      "success"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      /attached to a different window/i.test(message) ||
      /bound CM workspace tab/i.test(message)
    ) {
      state.pendingWorkspaceDeeplink = null;
      clearWorkspaceDeeplinkFromLocation();
    }
    setStatus(message || "Unable to open CM deeplink.", "error");
  } finally {
    state.pendingWorkspaceDeeplinkConsuming = false;
  }
}

async function rerunAllCards(options = {}) {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  const reason = String(options?.reason || "").trim().toLowerCase();
  const explicitCards =
    Array.isArray(options?.cards) && options.cards.length > 0
      ? cloneWorkspaceReplayCards(options.cards)
      : [];
  const cards =
    explicitCards.length > 0
      ? explicitCards
      : [...state.cardsById.values()].map((cardState) => getCardPayload(cardState));
  if (cards.length === 0) {
    setStatus("No reports are open.");
    return;
  }

  if (cards.length > 0) {
    state.workspaceReplayCards = cloneWorkspaceReplayCards(cards);
  }
  state.batchRunning = true;
  syncActionButtonsDisabled();
  if (reason === "manual-reload") {
    setStatus(`Reloading ${cards.length} report(s)...`);
  } else if (reason === "programmer-switch") {
    setStatus(`Refreshing ${cards.length} report(s) for ${getProgrammerLabel()}...`);
  } else {
    setStatus(`Re-running ${cards.length} report(s)...`);
  }
  const result = await sendWorkspaceAction("rerun-all", { cards, reason });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
  }
}

async function makeClickCmuDownload() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.cmAvailable !== true) {
    setStatus("clickCMU generation is only available for media companies with Concurrency Monitoring.", "error");
    return;
  }

  setStatus("", "info");
  const result = await sendWorkspaceAction("make-clickcmu");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to generate clickCMU file.", "error");
  }
}

async function makeClickCmuWorkspaceDownload() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.cmAvailable !== true) {
    setStatus("clickCMUWS_TEARSHEET generation is only available for media companies with Concurrency Monitoring.", "error");
    return;
  }

  const cards = getOrderedCardStates();
  if (cards.length === 0) {
    setStatus("Open at least one workspace report before generating clickCMUWS_TEARSHEET.", "error");
    return;
  }

  if (els.makeClickCmuWorkspaceButton) {
    els.makeClickCmuWorkspaceButton.disabled = true;
  }
  setStatus("", "info");
  try {
    const result = await sendWorkspaceAction("make-clickcmuws", {
      cards: cards.map((cardState) => getCardPayload(cardState)),
    });
    if (!result?.ok) {
      throw new Error(result?.error || "Unable to generate clickCMUWS_TEARSHEET.");
    }
    setStatus("clickCMUWS_TEARSHEET download started.");
  } catch (error) {
    setStatus(
      `Unable to generate clickCMUWS_TEARSHEET: ${error instanceof Error ? error.message : String(error)}`,
      "error"
    );
  } finally {
    syncActionButtonsDisabled();
  }
}

function clearWorkspace() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  clearPendingProgrammerSwitchTransition();
  clearWorkspaceCards();
}

function registerEventHandlers() {
  if (els.makeClickCmuButton) {
    els.makeClickCmuButton.addEventListener("click", () => {
      void makeClickCmuDownload();
    });
  }
  if (els.makeClickCmuWorkspaceButton) {
    els.makeClickCmuWorkspaceButton.addEventListener("click", () => {
      void makeClickCmuWorkspaceDownload();
    });
  }
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

  if (hasChromeRuntimeMessageListener()) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type !== CM_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
}

function hydrateWorkspaceFromExportPayload(payload = workspaceExportPayload) {
  if (!payload || typeof payload !== "object") {
    return;
  }

  applyControllerState({
    controllerOnline: true,
    cmAvailable: true,
    programmerId: String(payload?.programmerId || ""),
    programmerName: String(payload?.programmerName || ""),
    requestorIds: Array.isArray(payload?.requestorIds) ? payload.requestorIds : [],
    mvpdIds: Array.isArray(payload?.mvpdIds) ? payload.mvpdIds : [],
    profileHarvest: payload?.profileHarvest && typeof payload.profileHarvest === "object" ? payload.profileHarvest : null,
    profileHarvestList: Array.isArray(payload?.profileHarvestList) ? payload.profileHarvestList : [],
  });

  clearWorkspaceCards();
  const cards = Array.isArray(payload?.cards) ? payload.cards.slice().reverse() : [];
  cards.forEach((cardMeta) => {
    if (!cardMeta || typeof cardMeta !== "object") {
      return;
    }
    const normalizedMeta = {
      cardId: String(cardMeta?.cardId || buildWorkspaceCardId("import")),
      endpointUrl: String(cardMeta?.endpointUrl || ""),
      requestUrl: String(cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
      baseRequestUrl: String(cardMeta?.baseRequestUrl || cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
      seedEndpointUrl: String(cardMeta?.seedEndpointUrl || ""),
      seedRequestUrl: String(cardMeta?.seedRequestUrl || ""),
      seedBaseRequestUrl: String(cardMeta?.seedBaseRequestUrl || ""),
      zoomKey: String(cardMeta?.zoomKey || ""),
      columns: Array.isArray(cardMeta?.columns) ? cardMeta.columns : [],
      seedLocalColumnFilters: cardMeta?.seedLocalColumnFilters || {},
      localColumnFilters: cardMeta?.localColumnFilters || {},
      operation: cardMeta?.operation && typeof cardMeta.operation === "object" ? cardMeta.operation : null,
      formValues: cardMeta?.formValues && typeof cardMeta.formValues === "object" ? cardMeta.formValues : {},
    };
    const cardState = ensureCard(normalizedMeta);
    if (!cardState) {
      return;
    }

    cardState.operation = normalizeOperationDescriptor(normalizedMeta.operation);
    cardState.formValues = normalizeOperationFormValues(cardState.operation, normalizedMeta.formValues || {});
    cardState.seedLocalColumnFilters = normalizeCmLocalColumnFilters(normalizedMeta.seedLocalColumnFilters, cardState);
    cardState.localColumnFilters = normalizeCmLocalColumnFilters(normalizedMeta.localColumnFilters, cardState);
    cardState.sourceRows = normalizeRows(Array.isArray(cardMeta?.sourceRows) ? cardMeta.sourceRows : cardMeta?.rows || []);
    const payloadRows = Array.isArray(cardMeta?.rows) ? cardMeta.rows : cardState.sourceRows;
    cardState.rows = normalizeRows(payloadRows);
    cardState.lastModified = String(cardMeta?.lastModified || "");
    cardState.sortStack =
      Array.isArray(cardMeta?.sortStack) && cardMeta.sortStack.length > 0
        ? cardMeta.sortStack
            .map((rule) => ({
              col: String(rule?.col || "").trim(),
              dir: String(rule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
            }))
            .filter((rule) => rule.col)
        : getDefaultSortStackForCard(cardState);

    if (cardState.sourceRows.length > 0) {
      initializeCardLocalFilterBaseline(cardState, cardState.sourceRows);
      cardState.rows = applyCmLocalColumnFiltersToRows(cardState.sourceRows, cardState.localColumnFilters, cardState);
    }

    updateCardHeader(cardState);
    if (cardState.rows.length > 0) {
      renderCardTable(cardState, cardState.rows, cardState.lastModified);
      return;
    }
    if (cardState.operation) {
      renderOperationFormCard(cardState, {
        formValues: cardState.formValues,
      });
      return;
    }
    renderCardMessage(cardState, "No data");
  });
  syncWorkspaceReplayCardsFromCurrentCards();

  const total = state.cardsById.size;
  setStatus(
    total > 0
      ? `clickCMUWS_TEARSHEET ready: ${total} report${total === 1 ? "" : "s"}.`
      : "No workspace reports were captured for this tearsheet."
  );
  syncActionButtonsDisabled();
}

async function init() {
  try {
    await initializeWorkspaceAdobePassEnvironment();
  } catch {
    applyWorkspaceAdobePassEnvironment(DEFAULT_ADOBEPASS_ENVIRONMENT.key);
  }
  state.pendingWorkspaceDeeplink = parseWorkspaceDeeplinkPayloadFromLocation();
  if (!IS_CM_WORKSPACE_TEARSHEET_RUNTIME && hasChromeRuntimeMessaging() && chrome?.windows?.getCurrent) {
    try {
      const currentWindow = await chrome.windows.getCurrent();
      state.windowId = Number(currentWindow?.id || 0);
    } catch {
      state.windowId = 0;
    }
  } else {
    state.windowId = 0;
  }

  registerEventHandlers();
  syncTearsheetButtonsVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
  if (state.pendingWorkspaceDeeplink?.requestPath) {
    setStatus(
      `Opening ${String(state.pendingWorkspaceDeeplink.displayNodeLabel || state.pendingWorkspaceDeeplink.requestPath).trim()} from Slack...`
    );
  }

  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME) {
    hydrateWorkspaceFromExportPayload(workspaceExportPayload);
    return;
  }

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR CM controller.", "error");
    return;
  }
  void maybeConsumePendingWorkspaceDeeplink();
}

void init();
