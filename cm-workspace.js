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
const CM_WORKSPACE_IMS_VALIDATE_TOKEN_URL = "https://ims-na1.adobelogin.com/ims/validate_token/v1?jslVersion=underpar-clickcmuws";
const CM_WORKSPACE_IMS_CHECK_TOKEN_URL = "https://adobeid-na1.services.adobe.com/ims/check/v6/token";
const CM_WORKSPACE_IMS_DEFAULT_SCOPE =
  "AdobeID,openid,dma_group_mapping,read_organizations,additional_info.projectedProductContext";
const CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS = 45 * 1000;
const CM_WORKSPACE_FETCH_TIMEOUT_MS = 45 * 1000;
const CM_WORKSPACE_FALLBACK_BASE_URL = "https://streams-stage.adobeprimetime.com";
const PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL =
  "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers";
const WORKSPACE_LOCK_MESSAGE_SUFFIX =
  "does not have Concurrency Monitoring access. Confirm CM tenant mapping for this media company.";
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
]);
const CM_DATE_DIMENSION_KEYS = new Set(["year", "month", "day", "hour", "minute", "second", "date", "time", "timestamp"]);
const CM_FILTER_BLOCKED_COLUMNS = new Set([
  "tenant",
  "tenant-id",
  "tenant_id",
  "view",
  "activity-level",
  "activity_level",
]);
const CM_TENANT_QUERY_PARAM_KEYS = ["tenant", "tenant_id", "tenant-id"];

const state = {
  windowId: 0,
  controllerOnline: false,
  cmAvailable: null,
  tenantScope: "",
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  profileHarvest: null,
  profileHarvestList: [],
  cardsById: new Map(),
  batchRunning: false,
  workspaceLocked: false,
  nonCmMode: false,
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
};

let workspaceStylesheetTextCache = "";
let workspaceTearsheetRuntimeTextCache = "";
let workspaceTearsheetTemplateTextCache = "";

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
    .filter(Boolean),
  userId: readHiddenInputValue(CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME),
  scope: readHiddenInputValue(CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME) || CM_WORKSPACE_IMS_DEFAULT_SCOPE,
};

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
  const clientId = String(claims.client_id || claims.clientId || "").trim().toLowerCase();
  if (clientId === "cm-console-ui") {
    return true;
  }
  const scopes = new Set(tokenizeScopeSet(claims.scope || "").map((scope) => scope.toLowerCase()));
  return scopes.has("read_organizations") || scopes.has("dma_group_mapping");
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

function normalizeWorkspaceTenantScopeValue(value) {
  return String(value || "").trim();
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
  if (!normalizedTenantScope) {
    return raw;
  }
  try {
    const parsed = new URL(raw);
    if (!isCmuUsageRequestUrl(parsed.toString())) {
      return parsed.toString();
    }
    const existingTenantScope = normalizeWorkspaceTenantScopeValue(
      parsed.searchParams.get("tenant") || parsed.searchParams.get("tenant_id") || parsed.searchParams.get("tenant-id")
    );
    applyWorkspaceTenantScopeToSearchParams(parsed.searchParams, existingTenantScope || normalizedTenantScope);
    return parsed.toString();
  } catch {
    return raw;
  }
}

function resolveWorkspaceTenantScope(cardState = null, cardPayload = null) {
  return normalizeWorkspaceTenantScopeValue(
    firstNonEmptyString([
      cardPayload?.tenantId,
      cardState?.tenantId,
      state.tenantScope,
      state.programmerId,
      cardPayload?.tenantName,
      cardState?.tenantName,
    ])
  );
}

function ensureCmuQueryDefaults(urlValue, limitValue = 1000, tenantScope = "") {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    if (!parsed.searchParams.has("format")) {
      parsed.searchParams.set("format", "json");
    }
    if (!parsed.searchParams.has("start") || !parsed.searchParams.has("end")) {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 9 * 24 * 60 * 60 * 1000);
      if (!parsed.searchParams.has("start")) {
        parsed.searchParams.set("start", formatCmuDateQueryValue(startDate));
      }
      if (!parsed.searchParams.has("end")) {
        parsed.searchParams.set("end", formatCmuDateQueryValue(endDate));
      }
    }
    const limit = Number(limitValue);
    if (!parsed.searchParams.has("limit") && Number.isFinite(limit) && limit > 0) {
      parsed.searchParams.set("limit", String(Math.max(1, Math.round(limit))));
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
  const controller = new AbortController();
  const timerId = window.setTimeout(() => controller.abort(), Math.max(2000, Number(timeoutMs) || CM_WORKSPACE_FETCH_TIMEOUT_MS));
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timerId);
  }
}

function resolveWorkspaceRuntimeClientIds() {
  return dedupeCandidateStrings([
    ...(Array.isArray(cmWorkspaceRuntimeAuth.clientIds) ? cmWorkspaceRuntimeAuth.clientIds : []),
    "cm-console-ui",
    "AdobePass1",
    "exc_app",
  ]);
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

async function refreshTokenViaValidateToken(seedToken, forceFresh = false) {
  const clientIds = resolveWorkspaceRuntimeClientIds();
  for (const clientId of clientIds) {
    for (const credentials of ["include", "omit"]) {
      const response = await fetchWithTimeout(CM_WORKSPACE_IMS_VALIDATE_TOKEN_URL, {
        method: "POST",
        credentials,
        headers: {
          Accept: "application/json, text/plain, */*",
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
      if (refreshedToken && (!forceFresh || isBearerTokenFresh(refreshedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS))) {
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
  const userId = String(cmWorkspaceRuntimeAuth.userId || "").trim();
  if (!userId) {
    return "";
  }
  const scopeValue = String(cmWorkspaceRuntimeAuth.scope || CM_WORKSPACE_IMS_DEFAULT_SCOPE).trim() || CM_WORKSPACE_IMS_DEFAULT_SCOPE;
  const scopeCandidates = dedupeCandidateStrings([scopeValue, CM_WORKSPACE_IMS_DEFAULT_SCOPE].map((value) => tokenizeScopeSet(value).join(",")));
  const scopes = scopeCandidates.length > 0 ? scopeCandidates : [CM_WORKSPACE_IMS_DEFAULT_SCOPE];
  for (const clientId of resolveWorkspaceRuntimeClientIds()) {
    for (const scope of scopes) {
      const response = await fetchWithTimeout(buildImsCheckTokenUrl(clientId, scope, userId), {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
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
      if (!refreshedToken) {
        continue;
      }
      if (forceFresh && !isBearerTokenFresh(refreshedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS)) {
        continue;
      }
      return refreshedToken;
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

async function refreshCmWorkspaceAccessToken(forceFresh = false) {
  const seedToken = normalizeBearerTokenValue(cmWorkspaceRuntimeAuth.accessToken || "");
  if (!seedToken) {
    return "";
  }
  if (!forceFresh && isBearerTokenFresh(seedToken, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS) && tokenSupportsCmCatalog(seedToken)) {
    setWorkspaceRuntimeAccessToken(seedToken);
    return seedToken;
  }
  let refreshedToken = "";
  try {
    refreshedToken = await refreshTokenViaValidateToken(seedToken, forceFresh);
  } catch {
    refreshedToken = "";
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
  const headers = {
    Accept: "application/json, text/plain, */*",
    ...(init?.headers && typeof init.headers === "object" ? init.headers : {}),
  };
  const hasBasicAuthorization = isBasicAuthHeader(headers.Authorization || headers.authorization || "");
  if (!hasBasicAuthorization) {
    let token = normalizeBearerTokenValue(cmWorkspaceRuntimeAuth.accessToken || "");
    if (!token || !isBearerTokenFresh(token, CM_WORKSPACE_TOKEN_REFRESH_SKEW_MS) || !tokenSupportsCmCatalog(token)) {
      token = await refreshCmWorkspaceAccessToken(false);
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
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
        ...headers,
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

function isDisplayableCmuUsageColumn(columnName) {
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
  return true;
}

function isDisplayableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  return isDisplayableCmuUsageColumn(columnName);
}

function isFilterableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  return isDisplayableCmuUsageColumn(columnName);
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
  return !state.controllerOnline && state.cmAvailable === false && hasProgrammerContext();
}

function clearWorkspaceCards() {
  state.cardsById.forEach((cardState) => {
    cardState.element?.remove();
  });
  state.cardsById.clear();
  syncActionButtonsDisabled();
}

function hasWorkspaceCardContext() {
  return state.cardsById instanceof Map && state.cardsById.size > 0;
}

function updateNonCmMode() {
  const shouldShow = shouldShowNonCmMode();
  state.nonCmMode = shouldShow;
  if (els.nonCmHeadline) {
    els.nonCmHeadline.textContent = `No Soup for ${getProgrammerLabel()}. No Premium, No CM, No Dice.`;
  }
  if (els.nonCmNote) {
    els.nonCmNote.innerHTML = buildNotPremiumConsoleLinkHtml("CM");
  }

  if (shouldShow) {
    clearWorkspaceCards();
  }

  if (els.stylesheet) {
    els.stylesheet.disabled = shouldShow;
  }
  if (els.appRoot) {
    els.appRoot.hidden = shouldShow;
  }
  if (els.nonCmScreen) {
    els.nonCmScreen.hidden = !shouldShow;
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
  if (!state.controllerOnline) {
    if (state.workspaceLocked) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "CM workspace is locked for this media company. No Premium, No CM, No Dice.";
    } else if (hasProgrammerContext) {
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
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? sortStack : fallbackStack;
  if (stack.length === 0) {
    return [...rows];
  }

  return [...rows].sort((left, right) => {
    for (const rule of stack) {
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
  return {
    cardId: cardState.cardId,
    endpointUrl: cardState.endpointUrl,
    requestUrl: effectiveRequestUrl,
    baseRequestUrl: getCardBaseRequestUrl(cardState),
    zoomKey: cardState.zoomKey,
    columns: cardState.columns,
    localColumnFilters: serializeCmLocalColumnFilters(cardState?.localColumnFilters, cardState),
    operation: cardState.operation && typeof cardState.operation === "object" ? { ...cardState.operation } : null,
    formValues: cardState.formValues && typeof cardState.formValues === "object" ? { ...cardState.formValues } : {},
    tenantId: String(cardState?.tenantId || state.programmerId || ""),
    tenantName: String(cardState?.tenantName || state.programmerName || state.programmerId || ""),
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

function safeDecodeUrlSegment(segment) {
  const raw = String(segment || "");
  try {
    return decodeURIComponent(raw);
  } catch (_error) {
    return raw;
  }
}

function parseRawQueryPairs(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
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
        };
      }
      const key = safeDecodeUrlSegment(entry.slice(0, equalsIndex).replace(/\+/g, " "));
      const value = entry.slice(equalsIndex + 1);
      return {
        key,
        value,
        hasValue: true,
      };
    });
}

function parseCmRequestContext(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
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

  const queryMarkup =
    context.queryPairs.length > 0
      ? context.queryPairs
          .map((pair) => {
            const keyHtml = `<span class="card-url-query-key">${escapeHtml(pair.key)}</span>`;
            if (!pair.hasValue) {
              return `<span class="card-url-query-chip">${keyHtml}</span>`;
            }
            return `<span class="card-url-query-chip">${keyHtml}<span class="card-url-query-eq">=</span><span class="card-url-query-value">${escapeHtml(
              pair.value
            )}</span></span>`;
          })
          .join("")
      : '<span class="card-url-query-empty">no-query</span>';

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

function getCmuUsageTableDisplayColumns(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    return [];
  }
  const output = [];
  const seen = new Set();
  Object.keys(row).forEach((columnName) => {
    const normalized = normalizeCmColumnName(columnName);
    if (!normalized || seen.has(normalized) || !isDisplayableCmuUsageColumn(normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function buildCardColumnsMarkup(cardState) {
  const requestUrl = getCardEffectiveRequestUrl(cardState);
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
          <svg class="card-close-icon" viewBox="0 0 12 12" focusable="false" aria-hidden="true">
            <path d="M2 2 10 10" />
            <path d="M10 2 2 10" />
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
    const result = await sendWorkspaceAction("run-card", {
      requestSource: "workspace-path-link",
      card: {
        ...getCardPayload(cardState),
        endpointUrl: targetEndpointUrl,
        requestUrl: inheritedRequestUrl || targetEndpointUrl,
      },
    });
    if (!result?.ok) {
      setStatus(result?.error || "Unable to re-run CMU node report.", "error");
    }
    return;
  }

  const nextCardPayload = {
    cardId: buildWorkspaceCardId("path"),
    endpointUrl: targetEndpointUrl,
    requestUrl: inheritedRequestUrl || targetEndpointUrl,
    baseRequestUrl: targetEndpointUrl,
    zoomKey: String(cardState?.zoomKey || ""),
    columns: Array.isArray(cardState?.columns) ? cardState.columns.map((column) => String(column || "")).filter(Boolean) : [],
    tenantId: String(cardState?.tenantId || state.programmerId || ""),
    tenantName: String(cardState?.tenantName || state.programmerName || state.programmerId || ""),
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

function updateCardHeader(cardState) {
  syncCardUsageModeClass(cardState);
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
  const effectiveRequestUrl = getCardEffectiveRequestUrl(cardState);
  if (isCmuUsageCard(cardState)) {
    cardState.titleElement.innerHTML = buildCardHeaderContextMarkup(effectiveRequestUrl, String(cardState.endpointUrl || ""));
    wireCardHeaderPathLinks(cardState);
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
      cardState.localColumnFilters = new Map();
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
    } else if (!Array.isArray(existing.sortStack) || existing.sortStack.length === 0) {
      existing.sortStack = getDefaultSortStackForCard(existing);
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
    tenantId: String(cardMeta?.tenantId || state.programmerId || ""),
    tenantName: String(cardMeta?.tenantName || cardMeta?.tenantId || state.programmerName || state.programmerId || ""),
    rows: [],
    sourceRows: [],
    sortStack: [],
    lastModified: "",
    localColumnFilters: normalizeCmLocalColumnFilters(cardMeta?.localColumnFilters, null),
    localDistinctByColumn: new Map(),
    localHasBaselineData: false,
    pickerOpenColumn: "",
    pickerOutsidePointerHandler: null,
    pickerOutsideKeyHandler: null,
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
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    if (typeof cardState.pickerOutsidePointerHandler === "function") {
      document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    }
    if (typeof cardState.pickerOutsideKeyHandler === "function") {
      document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    }
    cardState.element?.remove();
    state.cardsById.delete(cardState.cardId);
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
  const displayColumns = usageCard ? getCmuUsageTableDisplayColumns(firstRow) : [];
  const headers = usageCard
    ? [
        ...(hasDate ? ["DATE"] : []),
        ...(hasAuthN ? ["AuthN Success"] : []),
        ...(hasAuthZ ? ["AuthZ Success"] : []),
        ...(!hasAuthN && !hasAuthZ && hasCount ? ["COUNT"] : []),
        ...displayColumns,
      ]
    : genericHeaders;
  const closeControlMarkup = usageCard
    ? `<button type="button" class="esm-action-btn esm-delete-data" aria-label="Delete data table" title="Delete this table data">
                    <svg class="esm-action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4h8v2"></path>
                      <path d="M6 6l1 14h10l1-14"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                    </svg>
                  </button>`
    : `<span class="esm-close" title="Close table"> x </span>`;

  cardState.bodyElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer">
                <a href="#" class="esm-csv-link">CSV</a>
                <div class="esm-footer-controls">
                  ${buildCardLocalFilterResetMarkup(cardState)}
                  <span class="esm-last-modified"></span>
                  ${closeControlMarkup}
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
  const csvLink = cardState.bodyElement.querySelector(".esm-csv-link");
  const closeButton = cardState.bodyElement.querySelector(usageCard ? ".esm-delete-data" : ".esm-close");

  const normalizedIncomingSortStack =
    Array.isArray(cardState?.sortStack) && cardState.sortStack.length > 0
      ? cardState.sortStack
          .map((rule) => ({
            col: String(rule?.col || "").trim(),
            dir: String(rule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
          }))
          .filter((rule) => rule.col)
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
}

function applyReportStart(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
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
  state.controllerOnline = payload?.controllerOnline === true;
  if (payload?.cmAvailable === true) {
    state.cmAvailable = true;
  } else if (payload?.cmAvailable === false) {
    state.cmAvailable = false;
  } else {
    state.cmAvailable = null;
  }
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.tenantScope = String(payload?.tenantScope || payload?.programmerId || "").trim();
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

  syncTearsheetButtonsVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
}

function handleWorkspaceEvent(eventName, payload) {
  const event = String(eventName || "").trim();
  if (!event) {
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
    state.batchRunning = true;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    return;
  }
  if (event === "batch-end") {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
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

function buildClickCmuWorkspaceFileName(snapshot = {}) {
  const mediaCompany = truncateDownloadFileSegment(
    sanitizeDownloadFileSegment(
      firstNonEmptyString([snapshot?.programmerName, snapshot?.programmerId, "MediaCompany"]),
      "MediaCompany"
    ),
    48
  );
  const epoch = Date.now();
  return `${mediaCompany}_clickCMUWS_${epoch}.html`;
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
    zoomKey: String(cardState.zoomKey || ""),
    tenantId: String(cardState.tenantId || ""),
    tenantName: String(cardState.tenantName || ""),
    columns: Array.isArray(cardState.columns) ? cardState.columns.map((column) => String(column || "")).filter(Boolean) : [],
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

function buildWorkspaceExportSnapshot() {
  const cards = getOrderedCardStates()
    .map((cardState) => serializeCardForWorkspaceExport(cardState))
    .filter(Boolean);
  const generatedAt = new Date();
  return {
    title: `${getProgrammerLabel()} clickCMU Workspace`,
    controllerStateText: String(els.controllerState?.textContent || "").trim(),
    filterStateText: String(els.filterState?.textContent || "").trim(),
    exportMetaText: "",
    programmerId: String(state.programmerId || ""),
    programmerName: String(state.programmerName || ""),
    requestorIds: Array.isArray(state.requestorIds) ? state.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(state.mvpdIds) ? state.mvpdIds.slice(0, 24) : [],
    profileHarvest: state.profileHarvest && typeof state.profileHarvest === "object" ? { ...state.profileHarvest } : null,
    profileHarvestList:
      Array.isArray(state.profileHarvestList) && state.profileHarvestList.length > 0
        ? state.profileHarvestList.filter((entry) => entry && typeof entry === "object").map((entry) => ({ ...entry }))
        : [],
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
          .filter(Boolean)
      )
    )
  );
  upsertBodyHiddenInput(doc, CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME, String(authContext?.userId || ""));
  upsertBodyHiddenInput(
    doc,
    CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME,
    String(authContext?.scope || CM_WORKSPACE_IMS_DEFAULT_SCOPE || "")
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
  anchor.download = String(fileName || "clickCMUWS.html");
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
  return usageCard ? ensureCmuQueryDefaults(filteredRequestUrl, 1000, resolveWorkspaceTenantScope(cardState, cardPayload)) : filteredRequestUrl;
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
  const displayColumns = getCmuUsageTableDisplayColumns(firstRow);
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
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${nodeLabel}_clickCMUWS_${stamp}.csv`;
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
  if (String(action || "").trim().toLowerCase() !== "workspace-ready" && !ensureWorkspaceUnlocked()) {
    return { ok: false, error: getWorkspaceLockMessage() };
  }
  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME || !hasChromeRuntimeMessaging()) {
    return sendWorkspaceActionInStandaloneRuntime(action, payload);
  }
  try {
    return await chrome.runtime.sendMessage({
      type: CM_MESSAGE_TYPE,
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

async function rerunAllCards() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.cardsById.size === 0) {
    setStatus("No reports are open.");
    return;
  }

  const cards = [...state.cardsById.values()].map((cardState) => getCardPayload(cardState));
  state.batchRunning = true;
  syncActionButtonsDisabled();
  setStatus(`Re-running ${cards.length} report(s)...`);
  const result = await sendWorkspaceAction("rerun-all", { cards });
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
    const snapshot = buildWorkspaceExportSnapshot();
    const authResult = await sendWorkspaceAction("resolve-clickcmuws-auth");
    if (!authResult?.ok) {
      throw new Error(authResult?.error || "Unable to resolve clickCMU workspace credentials.");
    }
    const [templateHtml, runtimeScriptText, stylesheetText] = await Promise.all([
      loadWorkspaceTearsheetTemplateText(),
      loadWorkspaceTearsheetRuntimeText(),
      loadWorkspaceStylesheetText(),
    ]);
    const outputHtml = buildWorkspaceTearsheetHtml(snapshot, templateHtml, stylesheetText, runtimeScriptText, {
      accessToken: String(authResult?.accessToken || ""),
      clientIds: Array.isArray(authResult?.clientIds) ? authResult.clientIds : [],
      userId: String(authResult?.userId || ""),
      scope: String(authResult?.scope || CM_WORKSPACE_IMS_DEFAULT_SCOPE || ""),
    });
    const fileName = buildClickCmuWorkspaceFileName(snapshot);
    downloadHtmlFile(outputHtml, fileName);
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
      zoomKey: String(cardMeta?.zoomKey || ""),
      columns: Array.isArray(cardMeta?.columns) ? cardMeta.columns : [],
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

  const total = state.cardsById.size;
  setStatus(
    total > 0
      ? `clickCMUWS_TEARSHEET ready: ${total} report${total === 1 ? "" : "s"}.`
      : "No workspace reports were captured for this tearsheet."
  );
  syncActionButtonsDisabled();
}

async function init() {
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

  if (IS_CM_WORKSPACE_TEARSHEET_RUNTIME) {
    hydrateWorkspaceFromExportPayload(workspaceExportPayload);
    return;
  }

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR CM controller.", "error");
  }
}

void init();
