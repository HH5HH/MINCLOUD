const SAVED_QUERY_STORAGE_PREFIX = "underpar:saved-esm-query:";
const SAVED_QUERY_BRIDGE_MESSAGE_TYPE = "underpar:meg-saved-query-bridge";
const SAVED_QUERY_BRIDGE_RESPONSE_TYPE = `${SAVED_QUERY_BRIDGE_MESSAGE_TYPE}:response`;
const UNDERPAR_VAULT_STORAGE_KEY = "underpar_vault_v1";
const MEG_WORKSPACE_MESSAGE_TYPE = "underpar:meg-workspace";
const UNDERPAR_ESM_DEEPLINK_WORKSPACE_PATH = "esm-workspace.html";
const UNDERPAR_ESM_DEEPLINK_BRIDGE_PATH = "esm-deeplink-bridge.html";
const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";
const UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE = "esm-bridge";
const UNDERPAR_ESM_HTML_EXPORT_TARGET_NAME = "UnderPAR_ESM_Bridge";
const UNDERPAR_ESM_HTML_EXPORT_BRIDGE_FRAME_ID = "underpar-esm-export-bridge-frame";
const UNDERPAR_ESM_NODE_PATH_PREFIX = "/esm/v3/media-company";
const DEFAULT_ADOBEPASS_ENVIRONMENT = Object.freeze({
  key: "release-production",
  label: "Production",
  mgmtBase: "https://mgmt.auth.adobe.com",
  spBase: "https://sp.auth.adobe.com",
  esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/",
});
const MEG_WORKSPACE_EXPORT_FORMATS = new Set(["json", "xml", "csv", "html"]);
const MEG_WORKSPACE_EXPORT_MIME_BY_FORMAT = Object.freeze({
  json: "application/json;charset=utf-8",
  xml: "application/xml;charset=utf-8",
  csv: "text/csv;charset=utf-8",
  html: "text/html;charset=utf-8",
});

function firstNonEmptyString(values = []) {
  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value ?? "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function sanitizeHarFileSegment(value, fallback = "capture") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function getAdobePassEnvironmentFileTag(environment = null) {
  const resolved =
    environment && typeof environment === "object"
      ? environment
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

function resolveBridgeAdobePassEnvironment(input = null) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const mgmtBase =
    String(source?.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase).trim() || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase;
  const spBase =
    String(source?.spBase || mgmtBase.replace("://mgmt.", "://sp.") || DEFAULT_ADOBEPASS_ENVIRONMENT.spBase).trim() ||
    DEFAULT_ADOBEPASS_ENVIRONMENT.spBase;
  return {
    ...DEFAULT_ADOBEPASS_ENVIRONMENT,
    ...source,
    key: String(source?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim() || DEFAULT_ADOBEPASS_ENVIRONMENT.key,
    label: String(source?.label || DEFAULT_ADOBEPASS_ENVIRONMENT.label).trim() || DEFAULT_ADOBEPASS_ENVIRONMENT.label,
    mgmtBase,
    spBase,
    esmBase:
      String(source?.esmBase || `${mgmtBase.replace(/\/+$/, "")}/esm/v3/media-company/`).trim() ||
      `${mgmtBase.replace(/\/+$/, "")}/esm/v3/media-company/`,
  };
}

function megWorkspaceNormalizeExportFormat(rawValue, fallback = "") {
  const normalized = String(rawValue || "").trim().toLowerCase();
  if (MEG_WORKSPACE_EXPORT_FORMATS.has(normalized)) {
    return normalized;
  }
  const fallbackValue = String(fallback || "").trim().toLowerCase();
  return MEG_WORKSPACE_EXPORT_FORMATS.has(fallbackValue) ? fallbackValue : "";
}

function megWorkspaceApplyFormatToPath(pathname, format = "") {
  const normalizedFormat = megWorkspaceNormalizeExportFormat(format);
  const trimmedPath = String(pathname || "").trim();
  const withoutFormatSuffix = (trimmedPath || "/").replace(/\.(json|xml|csv|html)$/i, "");
  if (!normalizedFormat) {
    return withoutFormatSuffix || "/";
  }
  return `${withoutFormatSuffix || "/"}.${normalizedFormat}`;
}

function megWorkspaceBuildAbsoluteServiceUrl(baseOrigin = "", value = "") {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }
  try {
    return new URL(rawValue, String(baseOrigin || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase).trim()).toString();
  } catch {
    const normalizedBase = String(baseOrigin || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase).replace(/\/+$/, "");
    const normalizedValue = rawValue.replace(/^\/+/, "");
    return `${normalizedBase}/${normalizedValue}`;
  }
}

function megWorkspaceCheckForCountCall(url) {
  const rawUrl = stripSavedQueryScopedQueryParams(String(url || "").trim());
  if (!rawUrl) {
    return "";
  }
  const [path, query] = rawUrl.split("?");
  let nextUrl = rawUrl;
  if (nextUrl.includes("channel")) {
    nextUrl = nextUrl.replace(/(metrics=)[^&]*/, (match, prefix) => {
      const metrics = match
        .split("=")[1]
        .split(",")
        .filter((metric) => !metric.startsWith("authn-"))
        .join(",");
      return `${prefix}${metrics}`;
    });
  }
  if (!path.includes("/event") && !path.includes("/event/")) {
    return nextUrl;
  }
  const params = query ? query.split("&") : [];
  const filteredParams = params.filter((param) => !param.startsWith("metrics="));
  const sanitizedQuery = filteredParams.join("&");
  return sanitizedQuery ? `${path}?${sanitizedQuery}` : path;
}

function appendPinnedEsmMediaCompanyQueryParam(rawUrl = "", mediaCompanyId = "", environment = null) {
  const normalizedUrl = String(rawUrl || "").trim();
  const normalizedMediaCompanyId = String(mediaCompanyId || "").trim();
  if (!normalizedUrl || !normalizedMediaCompanyId) {
    return normalizedUrl;
  }
  const resolvedEnvironment = resolveBridgeAdobePassEnvironment(environment);
  const hasAbsoluteScheme = /^[a-z][a-z\d+.-]*:/i.test(normalizedUrl);
  const fallbackBase = String(resolvedEnvironment?.esmBase || DEFAULT_ADOBEPASS_ENVIRONMENT.esmBase).trim();
  try {
    const parsed = hasAbsoluteScheme ? new URL(normalizedUrl) : new URL(normalizedUrl, fallbackBase || "https://example.invalid");
    if (!/\/esm\/v3\/media-company\//i.test(String(parsed.pathname || ""))) {
      return normalizedUrl;
    }
    parsed.searchParams.set("media-company", normalizedMediaCompanyId);
    parsed.hash = "";
    return hasAbsoluteScheme ? parsed.toString() : `${String(parsed.pathname || "")}${String(parsed.search || "")}`;
  } catch {
    if (!/\/esm\/v3\/media-company\//i.test(normalizedUrl)) {
      return normalizedUrl;
    }
    const withoutHash = normalizedUrl.split("#")[0] || "";
    const [path, query = ""] = withoutHash.split("?");
    const params = new URLSearchParams(query);
    params.set("media-company", normalizedMediaCompanyId);
    const nextQuery = params.toString();
    return nextQuery ? `${path}?${nextQuery}` : path;
  }
}

function megWorkspaceBuildRequestUrl(rawUrl = "", options = {}) {
  const environment = resolveBridgeAdobePassEnvironment(options?.environment || null);
  const format = megWorkspaceNormalizeExportFormat(options.format, "");
  const requestUrl = megWorkspaceBuildAbsoluteServiceUrl(
    environment?.mgmtBase || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase,
    stripSavedQueryScopedQueryParams(String(rawUrl || "").trim())
  );
  if (!requestUrl) {
    return "";
  }
  const parsed = new URL(requestUrl);
  parsed.hash = "";
  parsed.pathname = megWorkspaceApplyFormatToPath(parsed.pathname, format);
  parsed.searchParams.delete("format");
  parsed.searchParams.delete("media-company");
  return megWorkspaceCheckForCountCall(parsed.toString());
}

function megWorkspaceBuildExportFileName(context = {}, rawUrl = "", format = "csv") {
  const normalizedFormat = megWorkspaceNormalizeExportFormat(format, "csv");
  const environment = resolveBridgeAdobePassEnvironment(context?.environment || null);
  const absoluteUrl = megWorkspaceBuildAbsoluteServiceUrl(environment?.mgmtBase, String(rawUrl || "").trim());
  let endpointPath = "endpoint";
  try {
    const parsed = new URL(absoluteUrl);
    endpointPath = megWorkspaceApplyFormatToPath(parsed.pathname, "").replace(/^\/+/, "").replace(/\//g, "-");
  } catch {
    endpointPath = "endpoint";
  }
  const requestorId = sanitizeHarFileSegment(
    Array.isArray(context?.requestorIds) && context.requestorIds.length > 0 ? context.requestorIds.join("-") : "all-requestors",
    "all-requestors"
  );
  const mvpdId = sanitizeHarFileSegment(
    Array.isArray(context?.mvpdIds) && context.mvpdIds.length > 0 ? context.mvpdIds.join("-") : "all-mvpds",
    "all-mvpds"
  );
  const endpointSegment = sanitizeHarFileSegment(endpointPath, "endpoint");
  const envTag = getAdobePassEnvironmentFileTag(environment);
  const stamp = Date.now();
  return `esm_${sanitizeHarFileSegment(context?.programmerId, "programmer")}_${requestorId}_${mvpdId}_${endpointSegment}_${envTag}_${stamp}.${normalizedFormat}`;
}

function megWorkspaceResolveDownloadMimeType(format, responseContentType = "") {
  const normalizedFormat = megWorkspaceNormalizeExportFormat(format, "csv");
  const contentType = String(responseContentType || "").trim();
  return contentType || MEG_WORKSPACE_EXPORT_MIME_BY_FORMAT[normalizedFormat] || "application/octet-stream";
}

function buildUnderparEsmRequestPath(pathname = "", search = "", options = {}) {
  const allowBarePath = options?.allowBarePath === true;
  let normalizedPath = String(pathname || "").trim().replace(/\/+$/g, "");
  if (!normalizedPath) {
    return "";
  }
  if (/^\/?esm\/v3\/media-company(?:\/|$)/i.test(normalizedPath)) {
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }
    return `${normalizedPath}${String(search || "")}`;
  }
  if (!allowBarePath) {
    return "";
  }
  normalizedPath = normalizedPath.replace(/^\/+/, "");
  if (!normalizedPath) {
    return "";
  }
  return `${UNDERPAR_ESM_NODE_PATH_PREFIX}/${normalizedPath}${String(search || "")}`;
}

function normalizeUnderparEsmRequestPath(rawValue = "", environment = null) {
  const normalized = stripSavedQueryScopedQueryParams(String(rawValue || "").trim());
  if (!normalized) {
    return "";
  }
  const resolvedEnvironment = resolveBridgeAdobePassEnvironment(environment);
  const hasAbsoluteScheme = /^[a-z][a-z\d+.-]*:/i.test(normalized);
  try {
    const base = String(resolvedEnvironment?.esmBase || DEFAULT_ADOBEPASS_ENVIRONMENT.esmBase).trim();
    const parsed = hasAbsoluteScheme ? new URL(normalized) : new URL(normalized, base || DEFAULT_ADOBEPASS_ENVIRONMENT.mgmtBase);
    return buildUnderparEsmRequestPath(String(parsed.pathname || ""), String(parsed.search || ""), {
      allowBarePath: !hasAbsoluteScheme,
    });
  } catch {
    const withoutHash = normalized.split("#")[0] || "";
    const [pathPart, queryPart = ""] = withoutHash.split("?");
    return buildUnderparEsmRequestPath(pathPart, queryPart ? `?${queryPart}` : "", {
      allowBarePath: !hasAbsoluteScheme,
    });
  }
}

function getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl() {
  try {
    const runtimeId = String(chrome?.runtime?.id || "").trim();
    return runtimeId ? `https://${runtimeId}.chromiumapp.org/` : "";
  } catch {
    return "";
  }
}

function buildUnderparWorkspaceBlondieDeeplinkBaseUrl(markerValue = "") {
  const normalizedMarkerValue = String(markerValue || "").trim();
  if (!normalizedMarkerValue) {
    return null;
  }
  const baseUrl = getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl();
  if (!baseUrl) {
    return null;
  }
  const url = new URL(baseUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set(UNDERPAR_ESM_DEEPLINK_MARKER_PARAM, normalizedMarkerValue);
  return url;
}

function buildUnderparDirectEsmBridgeUrl(rawRequestValue = "", options = {}) {
  const requestPath = normalizeUnderparEsmRequestPath(rawRequestValue, options.environment || null);
  if (!requestPath) {
    return "";
  }
  let url;
  const deeplinkBaseUrl = buildUnderparWorkspaceBlondieDeeplinkBaseUrl(UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE);
  if (deeplinkBaseUrl) {
    url = deeplinkBaseUrl;
  } else {
    try {
      const bridgeUrl = String(chrome.runtime.getURL(UNDERPAR_ESM_DEEPLINK_BRIDGE_PATH) || "").trim();
      let parsed = null;
      try {
        parsed = new URL(bridgeUrl);
      } catch {
        parsed = null;
      }
      if (parsed?.protocol === "chrome-extension:" && parsed.host) {
        url = new URL(`https://${parsed.host}.chromiumapp.org/`);
        url.searchParams.set(UNDERPAR_ESM_DEEPLINK_MARKER_PARAM, UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE);
      } else if (parsed?.protocol === "https:" && String(parsed.hostname || "").toLowerCase().endsWith(".chromiumapp.org")) {
        url = new URL(`${parsed.origin}${String(parsed.pathname || "").trim() || "/"}`);
        url.searchParams.set(UNDERPAR_ESM_DEEPLINK_MARKER_PARAM, UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE);
      } else {
        url = null;
      }
    } catch {
      return "";
    }
  }
  if (!url) {
    return "";
  }
  url.hash = "";
  const params = new URLSearchParams(url.search);
  params.set("requestPath", requestPath);
  const displayNodeLabel = String(options.displayNodeLabel || "").trim();
  const programmerId = String(options.programmerId || "").trim();
  const programmerName = String(options.programmerName || "").trim();
  const resolvedEnvironment = resolveBridgeAdobePassEnvironment(options.environment || null);
  const environmentKey = String(options.environmentKey || resolvedEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim() ||
    DEFAULT_ADOBEPASS_ENVIRONMENT.key;
  const environmentLabel =
    String(options.environmentLabel || resolvedEnvironment?.label || DEFAULT_ADOBEPASS_ENVIRONMENT.label).trim() ||
    DEFAULT_ADOBEPASS_ENVIRONMENT.label;
  const source = String(options.source || "megspace-html-export").trim() || "megspace-html-export";
  const createdAt = Math.max(0, Number(options.createdAt || Date.now() || 0)) || Date.now();
  if (displayNodeLabel) {
    params.set("displayNodeLabel", displayNodeLabel);
  }
  if (programmerId) {
    params.set("programmerId", programmerId);
  }
  if (programmerName) {
    params.set("programmerName", programmerName);
  }
  if (environmentKey) {
    params.set("environmentKey", environmentKey);
  }
  if (environmentLabel) {
    params.set("environmentLabel", environmentLabel);
  }
  params.set("source", source);
  params.set("createdAt", String(createdAt));
  url.search = params.toString();
  return url.toString();
}

function rewriteMegWorkspaceHtmlExportLinks(htmlText, context = {}) {
  const sourceHtml = String(htmlText || "");
  if (!sourceHtml.trim() || typeof DOMParser !== "function") {
    return sourceHtml;
  }
  let documentNode = null;
  try {
    documentNode = new DOMParser().parseFromString(sourceHtml, "text/html");
  } catch {
    return sourceHtml;
  }
  if (!documentNode?.querySelectorAll) {
    return sourceHtml;
  }
  const programmerId = String(context?.programmerId || "").trim();
  const programmerName = String(context?.programmerName || "").trim();
  const environment = resolveBridgeAdobePassEnvironment(context?.environment || null);
  const environmentKey = String(context?.environmentKey || environment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim() ||
    DEFAULT_ADOBEPASS_ENVIRONMENT.key;
  const environmentLabel = String(context?.environmentLabel || environment?.label || DEFAULT_ADOBEPASS_ENVIRONMENT.label).trim();
  let rewriteCount = 0;
  documentNode.querySelectorAll("a[href]").forEach((anchor) => {
    const rawHref = String(anchor.getAttribute("href") || "").trim();
    const requestPath = normalizeUnderparEsmRequestPath(rawHref, environment);
    if (!requestPath) {
      return;
    }
    const displayNodeLabel = firstNonEmptyString([
      String(anchor.textContent || "").trim(),
      String(anchor.getAttribute("title") || "").trim(),
      requestPath,
    ]);
    const deeplinkUrl = buildUnderparDirectEsmBridgeUrl(requestPath, {
      displayNodeLabel,
      programmerId,
      programmerName,
      environment,
      environmentKey,
      environmentLabel,
      source: "megspace-html-export",
    });
    if (!deeplinkUrl) {
      return;
    }
    anchor.setAttribute("href", deeplinkUrl);
    anchor.setAttribute("target", UNDERPAR_ESM_HTML_EXPORT_TARGET_NAME);
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.setAttribute("data-underpar-esm-request-path", requestPath);
    const existingTitle = String(anchor.getAttribute("title") || "").trim();
    const underparTitle = displayNodeLabel
      ? `Open ${displayNodeLabel} in UnderPAR ESM Workspace`
      : "Open in UnderPAR ESM Workspace";
    anchor.setAttribute("title", existingTitle ? `${existingTitle} | ${underparTitle}` : underparTitle);
    rewriteCount += 1;
  });
  if (!rewriteCount || !documentNode.documentElement) {
    return sourceHtml;
  }
  const existingBridgeFrame = documentNode.getElementById(UNDERPAR_ESM_HTML_EXPORT_BRIDGE_FRAME_ID);
  if (existingBridgeFrame?.parentNode) {
    existingBridgeFrame.parentNode.removeChild(existingBridgeFrame);
  }
  return `<!doctype html>\n${documentNode.documentElement.outerHTML}`;
}

async function refreshMegBridgeToken(payload = {}) {
  const clientId = String(payload?.clientId || "").trim();
  const clientSecret = String(payload?.clientSecret || "").trim();
  const environment = resolveBridgeAdobePassEnvironment(payload?.environment || {
    mgmtBase: payload?.mgmtBase,
    spBase: payload?.spBase,
  });
  const spBase = String(environment?.spBase || DEFAULT_ADOBEPASS_ENVIRONMENT.spBase).trim();
  if (!clientId || !clientSecret) {
    throw new Error("Missing MEGTOOL credentials for token refresh.");
  }
  const tokenUrl = new URL(`${spBase.replace(/\/+$/, "")}/o/client/token`);
  tokenUrl.searchParams.set("grant_type", "client_credentials");
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set("scope", "analytics:client");
  const response = await fetch(tokenUrl.toString(), {
    method: "POST",
  });
  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Unable to refresh MEGTOOL token (HTTP ${response.status}${bodyText ? ` ${bodyText.trim()}` : ""}).`);
  }
  const responsePayload = await response.json().catch(() => null);
  const accessToken = String(responsePayload?.access_token || "").trim();
  if (!accessToken) {
    throw new Error("Token refresh did not return an access token.");
  }
  return accessToken;
}

async function downloadMegExportThroughBridge(payload = {}) {
  const format = megWorkspaceNormalizeExportFormat(payload?.format, "csv");
  const environment = resolveBridgeAdobePassEnvironment(payload?.environment || {
    mgmtBase: payload?.mgmtBase,
    spBase: payload?.spBase,
  });
  const requestUrl = megWorkspaceBuildRequestUrl(String(payload?.url || ""), {
    format,
    environment,
  });
  if (!requestUrl) {
    throw new Error("ESM endpoint URL is required.");
  }
  const scopedRequestUrl = appendPinnedEsmMediaCompanyQueryParam(requestUrl, String(payload?.programmerId || ""), environment);
  let accessToken = String(payload?.accessToken || "").trim();
  if (!accessToken) {
    accessToken = await refreshMegBridgeToken({
      ...payload,
      environment,
    });
  }
  let response = await fetch(scopedRequestUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.status === 401) {
    accessToken = await refreshMegBridgeToken({
      ...payload,
      environment,
    });
    response = await fetch(scopedRequestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  const bodyText = await response.text().catch(() => "");
  if (!response.ok) {
    throw new Error(String(bodyText || `${format.toUpperCase()} request failed (${response.status || 0})`));
  }
  const payloadText =
    format === "html"
      ? rewriteMegWorkspaceHtmlExportLinks(bodyText, {
          programmerId: String(payload?.programmerId || "").trim(),
          programmerName: String(payload?.programmerName || "").trim(),
          environment,
          environmentKey: String(environment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key).trim(),
          environmentLabel: String(environment?.label || DEFAULT_ADOBEPASS_ENVIRONMENT.label).trim(),
        })
      : bodyText;
  return {
    fileName: megWorkspaceBuildExportFileName(
      {
        programmerId: String(payload?.programmerId || "").trim(),
        requestorIds: Array.isArray(payload?.requestorIds) ? payload.requestorIds : [],
        mvpdIds: Array.isArray(payload?.mvpdIds) ? payload.mvpdIds : [],
        environment,
      },
      String(payload?.url || ""),
      format
    ),
    format,
    mimeType: megWorkspaceResolveDownloadMimeType(format, String(response.headers.get("content-type") || "")),
    payloadText,
    accessToken,
  };
}

function normalizeSavedQueryName(value = "") {
  return String(value || "").replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function buildSavedQueryStorageKey(name = "") {
  return `${SAVED_QUERY_STORAGE_PREFIX}${encodeURIComponent(String(name || "").trim())}`;
}

function stripSavedQueryScopedQueryParams(rawUrl = "") {
  const normalized = String(rawUrl || "").trim();
  if (!normalized) {
    return "";
  }
  const withoutHash = normalized.split("#")[0] || "";
  const queryIndex = withoutHash.indexOf("?");
  if (queryIndex < 0) {
    return withoutHash;
  }
  const path = withoutHash.slice(0, queryIndex);
  const query = withoutHash.slice(queryIndex + 1);
  const nextQuery = query
    .split("&")
    .filter((segment) => {
      if (!segment) {
        return false;
      }
      const keySegment = segment.includes("=") ? segment.slice(0, segment.indexOf("=")) : segment;
      try {
        return decodeURIComponent(keySegment.replace(/\+/g, "%20")).trim().toLowerCase() !== "media-company";
      } catch (_error) {
        return keySegment.trim().toLowerCase() !== "media-company";
      }
    })
    .join("&");
  return nextQuery ? `${path}?${nextQuery}` : path;
}

function buildSavedQueryRecord(name = "", rawUrl = "") {
  const normalizedName = normalizeSavedQueryName(name);
  const normalizedUrl = stripSavedQueryScopedQueryParams(String(rawUrl || "").trim());
  if (!normalizedName || !normalizedUrl) {
    return null;
  }
  return {
    name: normalizedName,
    url: normalizedUrl,
  };
}

function buildSavedQueryPayload(name = "", esmUrl = "") {
  const record = buildSavedQueryRecord(name, esmUrl);
  if (!record) {
    return "";
  }
  return record.url;
}

function parseSavedQueryRecord(storageKey = "", payload = "") {
  const normalizedStorageKey = String(storageKey || "").trim();
  if (!normalizedStorageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
    return null;
  }
  const storedName = decodeURIComponent(normalizedStorageKey.slice(SAVED_QUERY_STORAGE_PREFIX.length) || "");
  const normalizedPayload = String(payload || "").trim();
  try {
    const parsed = JSON.parse(normalizedPayload);
    if (parsed && typeof parsed === "object") {
      const record = buildSavedQueryRecord(parsed.name || storedName, parsed.url || parsed.esmUrl || "");
      if (record) {
        return {
          storageKey: normalizedStorageKey,
          ...record,
        };
      }
    }
  } catch (_error) {
    // Fall through to legacy string parsing.
  }
  const separatorIndex = normalizedPayload.indexOf("|");
  if (separatorIndex <= 0) {
    const record = buildSavedQueryRecord(storedName, normalizedPayload);
    if (record) {
      return {
        storageKey: normalizedStorageKey,
        ...record,
      };
    }
    return null;
  }
  const record = buildSavedQueryRecord(
    normalizedPayload.slice(0, separatorIndex),
    String(normalizedPayload.slice(separatorIndex + 1) || "").trim()
  );
  if (!record) {
    return null;
  }
  return {
    storageKey: normalizedStorageKey,
    ...record,
  };
}

function readLegacyLocalSavedQueries() {
  const records = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const storageKey = String(localStorage.key(index) || "").trim();
      if (!storageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
        continue;
      }
      const payload = localStorage.getItem(storageKey);
      const record = parseSavedQueryRecord(storageKey, payload);
      if (!record) {
        continue;
      }
      const normalizedPayload = buildSavedQueryPayload(record.name, record.url);
      if (payload !== normalizedPayload) {
        localStorage.setItem(storageKey, normalizedPayload);
      }
      records.push(record);
    }
  } catch (_error) {
    return [];
  }
  return records.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

function normalizeVaultSavedQueries(input = null) {
  const normalizedEntries = {};
  const appendEntry = (name = "", rawUrl = "") => {
    const record = buildSavedQueryRecord(name, rawUrl);
    if (record) {
      normalizedEntries[record.name] = record.url;
    }
  };

  if (Array.isArray(input)) {
    input.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      appendEntry(entry?.name || "", entry?.url || entry?.esmUrl || "");
    });
    return normalizedEntries;
  }

  if (!input || typeof input !== "object") {
    return normalizedEntries;
  }

  Object.entries(input).forEach(([name, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      appendEntry(value?.name || name, value?.url || value?.esmUrl || value?.value || "");
      return;
    }
    appendEntry(name, value);
  });
  return normalizedEntries;
}

function ensureVaultGlobalContainers(vaultPayload = null) {
  const target = vaultPayload && typeof vaultPayload === "object" ? vaultPayload : {};
  if (!target.underpar || typeof target.underpar !== "object" || Array.isArray(target.underpar)) {
    target.underpar = {};
  }
  if (!target.underpar.globals || typeof target.underpar.globals !== "object" || Array.isArray(target.underpar.globals)) {
    target.underpar.globals = {};
  }
  if (!target.underpar.app || typeof target.underpar.app !== "object" || Array.isArray(target.underpar.app)) {
    target.underpar.app = {};
  }
  if (
    !target.underpar.globals.savedQueries ||
    typeof target.underpar.globals.savedQueries !== "object" ||
    Array.isArray(target.underpar.globals.savedQueries)
  ) {
    target.underpar.globals.savedQueries = {};
  }
  if (
    !target.underpar.app.savedQueries ||
    typeof target.underpar.app.savedQueries !== "object" ||
    Array.isArray(target.underpar.app.savedQueries)
  ) {
    target.underpar.app.savedQueries = {};
  }
  return target;
}

function getVaultSavedQueriesInput(vaultPayload = null) {
  if (!vaultPayload || typeof vaultPayload !== "object") {
    return null;
  }
  if (
    vaultPayload?.underpar?.globals?.savedQueries &&
    typeof vaultPayload.underpar.globals.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.globals.savedQueries)
  ) {
    return vaultPayload.underpar.globals.savedQueries;
  }
  if (
    vaultPayload?.underpar?.app?.savedQueries &&
    typeof vaultPayload.underpar.app.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.app.savedQueries)
  ) {
    return vaultPayload.underpar.app.savedQueries;
  }
  if (
    vaultPayload?.underpar?.savedQueries &&
    typeof vaultPayload.underpar.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.savedQueries)
  ) {
    return vaultPayload.underpar.savedQueries;
  }
  return null;
}

function setVaultSavedQueries(vaultPayload = null, savedQueries = null) {
  const target = ensureVaultGlobalContainers(vaultPayload);
  const normalizedSavedQueries = normalizeVaultSavedQueries(savedQueries);
  target.underpar.globals.savedQueries = JSON.parse(JSON.stringify(normalizedSavedQueries));
  target.underpar.app.savedQueries = JSON.parse(JSON.stringify(normalizedSavedQueries));
  return normalizedSavedQueries;
}

function normalizeVaultPayload(payload = null) {
  const normalized = {
    schemaVersion: 1,
    updatedAt: Date.now(),
    underpar: {
      globals: {
        savedQueries: {},
      },
      app: {
        savedQueries: {},
      },
    },
    pass: {
      schemaVersion: 1,
      environments: {},
    },
  };

  if (!payload || typeof payload !== "object") {
    return normalized;
  }

  normalized.schemaVersion = Number(payload?.schemaVersion || 1) || 1;
  normalized.updatedAt = Number(payload?.updatedAt || Date.now()) || Date.now();
  setVaultSavedQueries(normalized, getVaultSavedQueriesInput(payload));
  normalized.pass =
    payload?.pass && typeof payload.pass === "object" && !Array.isArray(payload.pass)
      ? payload.pass
      : normalized.pass;
  return normalized;
}

async function readVaultPayload() {
  if (!chrome?.storage?.local?.get) {
    return normalizeVaultPayload(null);
  }
  const payload = await chrome.storage.local.get(UNDERPAR_VAULT_STORAGE_KEY).catch(() => ({}));
  return normalizeVaultPayload(payload?.[UNDERPAR_VAULT_STORAGE_KEY] || null);
}

async function writeVaultPayload(vaultPayload = null) {
  if (!chrome?.storage?.local?.set) {
    throw new Error("Chrome local storage is unavailable.");
  }
  const normalizedVault = normalizeVaultPayload(vaultPayload);
  normalizedVault.updatedAt = Date.now();
  await chrome.storage.local.set({
    [UNDERPAR_VAULT_STORAGE_KEY]: normalizedVault,
  });
  return normalizedVault;
}

async function getSavedQueryRecords() {
  const vault = await readVaultPayload();
  const mergedEntries = {
    ...Object.fromEntries(readLegacyLocalSavedQueries().map((record) => [record.name, record.url])),
    ...normalizeVaultSavedQueries(getVaultSavedQueriesInput(vault)),
  };

  return Object.entries(mergedEntries)
    .map(([name, rawUrl]) => {
      const record = buildSavedQueryRecord(name, rawUrl);
      if (!record) {
        return null;
      }
      return {
        storageKey: buildSavedQueryStorageKey(record.name),
        ...record,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

async function persistSavedQueryRecord(name = "", rawUrl = "") {
  const record = buildSavedQueryRecord(name, rawUrl);
  if (!record) {
    throw new Error("Saved Query name and URL are required.");
  }
  const storageKey = buildSavedQueryStorageKey(record.name);
  const vault = await readVaultPayload();
  const nextSavedQueries = {
    ...Object.fromEntries(readLegacyLocalSavedQueries().map((entry) => [entry.name, entry.url])),
    ...normalizeVaultSavedQueries(getVaultSavedQueriesInput(vault)),
  };
  const existed = Object.prototype.hasOwnProperty.call(nextSavedQueries, record.name);
  nextSavedQueries[record.name] = record.url;
  setVaultSavedQueries(vault, nextSavedQueries);
  await writeVaultPayload(vault);
  return {
    storageKey,
    existed,
  };
}

async function deleteSavedQueryRecord(storageKey = "") {
  const normalizedStorageKey = String(storageKey || "").trim();
  if (!normalizedStorageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
    throw new Error("Saved Query storage key is required.");
  }
  const name = decodeURIComponent(normalizedStorageKey.slice(SAVED_QUERY_STORAGE_PREFIX.length) || "");
  const normalizedName = normalizeSavedQueryName(name);
  if (!normalizedName) {
    throw new Error("Saved Query storage key is required.");
  }
  const vault = await readVaultPayload();
  const nextSavedQueries = {
    ...Object.fromEntries(readLegacyLocalSavedQueries().map((entry) => [entry.name, entry.url])),
    ...normalizeVaultSavedQueries(getVaultSavedQueriesInput(vault)),
  };
  delete nextSavedQueries[normalizedName];
  setVaultSavedQueries(vault, nextSavedQueries);
  await writeVaultPayload(vault);
  return {
    storageKey: normalizedStorageKey,
  };
}

window.addEventListener("message", (event) => {
  const payload = event?.data;
  if (!payload || payload.type !== SAVED_QUERY_BRIDGE_MESSAGE_TYPE) {
    return;
  }
  const requestId = String(payload.requestId || "").trim();
  const action = String(payload.action || "").trim().toLowerCase();
  const respond = (ok, result = null, error = "") => {
    event.source?.postMessage(
      {
        type: SAVED_QUERY_BRIDGE_RESPONSE_TYPE,
        requestId,
        ok,
        result,
        error: String(error || ""),
      },
      "*"
    );
  };

  void (async () => {
    try {
      if (action === "get-records") {
        respond(true, { records: await getSavedQueryRecords() });
        return;
      }

      if (action === "put-record") {
        const result = await persistSavedQueryRecord(payload?.payload?.name || "", payload?.payload?.url || "");
        respond(true, result);
        return;
      }

      if (action === "delete-record") {
        const result = await deleteSavedQueryRecord(payload?.payload?.storageKey || "");
        respond(true, result);
        return;
      }

      if (action === "workspace-action") {
        const workspaceAction = String(payload?.payload?.workspaceAction || "").trim();
        if (!workspaceAction) {
          throw new Error("Workspace bridge action is required.");
        }
        const workspacePayload =
          payload?.payload?.workspacePayload && typeof payload.payload.workspacePayload === "object"
            ? payload.payload.workspacePayload
            : {};
        const result = await chrome.runtime.sendMessage({
          type: MEG_WORKSPACE_MESSAGE_TYPE,
          channel: "workspace-action",
          action: workspaceAction,
          payload: workspacePayload,
        });
        respond(true, result && typeof result === "object" ? result : { ok: true });
        return;
      }

      if (action === "download-export") {
        const result = await downloadMegExportThroughBridge(payload?.payload || {});
        respond(true, result);
        return;
      }

      respond(false, null, `Unsupported bridge action: ${action || "unknown"}`);
    } catch (error) {
      respond(false, null, error instanceof Error ? error.message : String(error));
    }
  })();
});
