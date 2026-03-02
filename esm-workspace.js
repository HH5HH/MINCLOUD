const ESM_WORKSPACE_MESSAGE_TYPE = "underpar:esm-workspace";
const ESM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
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
  "decision-attempts",
  "decision-successful",
  "decision-failed",
  "decision-media-tokens",
]);
const ESM_DATE_PARTS = ["year", "month", "day", "hour", "minute"];
const ESM_DEPRECATED_COLUMN_KEYS = new Set(["clientless-failures", "clientless-tokens"]);
const ESM_SUPPRESSED_COLUMNS = new Set(["media-company"]);
const ESM_PROGRAMMER_DIMENSION_DESCRIPTIONS = new Map([
  ["year", "4-digit year"],
  ["month", "Month"],
  ["day", "Day"],
  ["hour", "Hour of day"],
  ["minute", "Minute of hour"],
  ["dc", "Data center"],
  ["proxy", "Proxy MVPD"],
  ["mvpd", "MVPD granting entitlement"],
  ["requestor-id", "Requestor ID used for entitlement"],
  ["channel", "Channel website"],
  ["resource-id", "Resource title"],
  ["device", "Device platform"],
  ["eap", "External auth provider"],
  ["os-family", "OS family"],
  ["browser-family", "Browser family"],
  ["cdt", "Clientless device type"],
  ["platform-version", "Clientless SDK version"],
  ["os-type", "OS"],
  ["browser-version", "Browser version"],
  ["nsdk", "Client SDK"],
  ["nsdk-version", "Adobe Pass SDK version"],
  ["event", "Adobe Pass event name"],
  ["reason", "Failure reason"],
  ["sso-type", "SSO mechanism"],
  ["platform", "Device platform"],
  ["application-name", "DCR app name"],
  ["application-version", "DCR app version"],
  ["customer-app", "Custom application ID"],
  ["content-category", "Content category requested"],
  ["api", "API entry point"],
]);
const ESM_MVPD_DIMENSION_DESCRIPTIONS = new Map([
  ["year", "4-digit year"],
  ["month", "Month"],
  ["day", "Day"],
  ["hour", "Hour of day"],
  ["minute", "Minute of hour"],
  ["mvpd", "MVPD ID"],
  ["requestor-id", "Requestor ID"],
  ["eap", "External auth provider"],
  ["cdt", "Clientless device type"],
  ["sdk-type", "Flash, HTML5, Android native, iOS, Clientless, etc."],
  ["platform", "Device platform"],
  ["nsdk", "Client SDK"],
  ["nsdk-version", "Adobe Pass SDK version"],
]);
const ESM_NODE_BASE_URL = "https://mgmt.auth.adobe.com/esm/v3/media-company/";
const ESM_NODE_BASE_PATH = "esm/v3/media-company/";
const WORKSPACE_EXPORT_FILE_SYSTEM_QUERY_KEYS = new Set(["format", "limit"]);
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
const WORKSPACE_TEARSHEET_RUNTIME_PATH = "clickesmws-runtime.js";
const WORKSPACE_TEARSHEET_TEMPLATE_PATH = "esm-workspace.html";
const PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL =
  "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers";
const WORKSPACE_LOCK_MESSAGE_SUFFIX =
  "does not have access to ESM. Please confirm if the console is out of sync and this Media Company should have access to ESM.";

const state = {
  windowId: 0,
  controllerOnline: false,
  esmAvailable: null,
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  profileHarvest: null,
  profileHarvestList: [],
  cardsById: new Map(),
  batchRunning: false,
  workspaceLocked: false,
  nonEsmMode: false,
  pendingAutoRerunProgrammerKey: "",
  autoRerunInFlightProgrammerKey: "",
};

const els = {
  appRoot: document.getElementById("workspace-app-root"),
  stylesheet: document.getElementById("workspace-style-link"),
  nonEsmScreen: document.getElementById("workspace-non-esm-screen"),
  nonEsmHeadline: document.getElementById("workspace-non-esm-headline"),
  nonEsmNote: document.getElementById("workspace-non-esm-note"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  lockBanner: document.getElementById("workspace-lock-banner"),
  lockMessage: document.getElementById("workspace-lock-message"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
  makeClickEsmButton: document.getElementById("workspace-make-clickesm"),
  makeClickEsmWorkspaceButton: document.getElementById("workspace-make-clickesmws"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
};

let workspaceStylesheetTextCache = "";
let workspaceTearsheetRuntimeTextCache = "";
let workspaceTearsheetTemplateTextCache = "";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeEsmColumns(columns, options = {}) {
  const hrefValue = String(options?.href || "").trim();
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
      return;
    }
    const lower = normalized.toLowerCase();
    if (ESM_DEPRECATED_COLUMN_KEYS.has(lower) || lower === "media-company") {
      return;
    }
    if (!seen.has(lower)) {
      output.push(normalized);
      seen.add(lower);
    }
  });
  if (output.length === 0 && hrefValue) {
    return getSupportedDimensionsFromHref(hrefValue);
  }
  return output;
}

function normalizeDimensionName(columnName) {
  return String(columnName || "").trim().toLowerCase();
}

function isSuppressedEsmColumn(columnName) {
  const normalized = normalizeDimensionName(columnName);
  return Boolean(normalized) && ESM_SUPPRESSED_COLUMNS.has(normalized);
}

function isDateTimeDimension(columnName) {
  const normalized = normalizeDimensionName(columnName);
  return Boolean(normalized) && ESM_DATE_PARTS.includes(normalized);
}

function resolveDimensionCatalogForHref(hrefValue) {
  const normalizedHref = String(hrefValue || "").toLowerCase();
  if (normalizedHref.includes("/esm/v3/mvpd/")) {
    return ESM_MVPD_DIMENSION_DESCRIPTIONS;
  }
  return ESM_PROGRAMMER_DIMENSION_DESCRIPTIONS;
}

function getDimensionDescription(columnName, hrefValue = "") {
  const key = normalizeDimensionName(columnName);
  if (!key || isSuppressedEsmColumn(key)) {
    return "";
  }
  const primary = resolveDimensionCatalogForHref(hrefValue);
  if (primary.has(key)) {
    return String(primary.get(key) || "").trim();
  }
  const secondary =
    primary === ESM_MVPD_DIMENSION_DESCRIPTIONS
      ? ESM_PROGRAMMER_DIMENSION_DESCRIPTIONS
      : ESM_MVPD_DIMENSION_DESCRIPTIONS;
  return String(secondary.get(key) || "").trim();
}

function isFilterableDimension(columnName, hrefValue = "") {
  if (isDateTimeDimension(columnName)) {
    return false;
  }
  return Boolean(getDimensionDescription(columnName, hrefValue));
}

function isSupportedDimension(columnName, hrefValue = "") {
  return Boolean(getDimensionDescription(columnName, hrefValue));
}

function isDisplayableDimension(columnName, hrefValue = "") {
  if (isDateTimeDimension(columnName)) {
    return false;
  }
  return isSupportedDimension(columnName, hrefValue);
}

function getSupportedDimensionsFromHref(hrefValue = "") {
  const rawHref = String(hrefValue || "").trim();
  if (!rawHref) {
    return [];
  }

  let path = "";
  try {
    const parsed = new URL(rawHref, window.location.href);
    path = String(parsed.pathname || "");
  } catch {
    path = rawHref.split("?", 1)[0] || "";
  }

  const segments = path
    .split("/")
    .map((segment) => decodeURIComponent(String(segment || "").trim().toLowerCase()))
    .filter(Boolean);
  if (!segments.length) {
    return [];
  }

  const v3Index = segments.findIndex((segment, index) => segment === "v3" && segments[index - 1] === "esm");
  const startIndex = v3Index >= 0 ? v3Index + 1 : 0;
  let dimensionSegments = segments.slice(startIndex);
  if (dimensionSegments[0] === "media-company" || dimensionSegments[0] === "mvpd") {
    dimensionSegments = dimensionSegments.slice(1);
  }

  const output = [];
  const seen = new Set();
  dimensionSegments.forEach((segment) => {
    const normalized = normalizeDimensionName(segment);
    if (
      !normalized ||
      isSuppressedEsmColumn(normalized) ||
      !isDisplayableDimension(normalized, rawHref) ||
      seen.has(normalized)
    ) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function buildDisplayDimensions(columns, hrefValue = "") {
  const fromHref = getSupportedDimensionsFromHref(hrefValue);
  if (fromHref.length > 0) {
    return fromHref;
  }

  const output = [];
  const seen = new Set();
  normalizeEsmColumns(columns).forEach((columnName) => {
    const normalized = normalizeDimensionName(columnName);
    if (
      !normalized ||
      isSuppressedEsmColumn(normalized) ||
      !isDisplayableDimension(normalized, hrefValue) ||
      seen.has(normalized)
    ) {
      return;
    }
    seen.add(normalized);
    output.push(normalized);
  });
  return output;
}

function compareColumnValues(leftValue, rightValue) {
  return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function buildDistinctValuesForColumns(rows, columns) {
  const distinct = new Map();
  (Array.isArray(columns) ? columns : []).forEach((columnName) => {
    const normalized = normalizeDimensionName(columnName);
    if (!normalized || isSuppressedEsmColumn(normalized)) {
      return;
    }
    distinct.set(normalized, new Set());
  });
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return;
    }
    distinct.forEach((set, columnName) => {
      if (!(columnName in row)) {
        return;
      }
      const raw = row[columnName];
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
      [...set].sort((left, right) => compareColumnValues(left, right))
    );
  });
  return output;
}

function normalizeLocalColumnFilters(rawFilters) {
  const output = new Map();
  const appendValues = (columnName, values) => {
    const normalizedColumn = normalizeDimensionName(columnName);
    if (
      !normalizedColumn ||
      isSuppressedEsmColumn(normalizedColumn) ||
      isDateTimeDimension(normalizedColumn)
    ) {
      return;
    }
    const nextSet = new Set();
    (Array.isArray(values) ? values : []).forEach((value) => {
      const normalizedValue = String(value || "").trim();
      if (!normalizedValue) {
        return;
      }
      nextSet.add(normalizedValue);
    });
    if (nextSet.size > 0) {
      output.set(normalizedColumn, nextSet);
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

function serializeLocalColumnFilters(filterMap) {
  const normalized = normalizeLocalColumnFilters(filterMap);
  const output = {};
  [...normalized.keys()]
    .sort()
    .forEach((columnName) => {
      const values = normalized.get(columnName) || new Set();
      const sortedValues = [...values].sort((left, right) => compareColumnValues(left, right));
      if (sortedValues.length > 0) {
        output[columnName] = sortedValues;
      }
    });
  return output;
}

function hasLocalColumnFilters(filterMap) {
  const normalized = normalizeLocalColumnFilters(filterMap);
  let hasAny = false;
  normalized.forEach((values) => {
    if (values instanceof Set && values.size > 0) {
      hasAny = true;
    }
  });
  return hasAny;
}

function matchesLocalFilterValue(rowValue, selectedValues) {
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

function applyLocalColumnFiltersToRows(rows, filterMap) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) {
    return list;
  }

  const normalizedFilters = normalizeLocalColumnFilters(filterMap);
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
      if (!matchesLocalFilterValue(row[columnName], values)) {
        return false;
      }
    }
    return true;
  });
}

function firstNonEmptyString(values) {
  for (const value of Array.isArray(values) ? values : []) {
    const normalized = String(value || "").trim();
    if (normalized) {
      return normalized;
    }
  }
  return "";
}

function sanitizeDownloadFileSegment(value, fallback = "download") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function truncateDownloadFileSegment(value, maxLength = 48) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }
  if (!Number.isFinite(maxLength) || maxLength <= 0) {
    return normalized;
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return normalized.slice(0, maxLength);
}

function getWorkspaceExportQueryEntries(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return [];
  }
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return [];
  }
  const entries = [];
  parsed.searchParams.forEach((value, key) => {
    const normalizedKey = String(key || "").trim().toLowerCase();
    if (!normalizedKey || WORKSPACE_EXPORT_FILE_SYSTEM_QUERY_KEYS.has(normalizedKey)) {
      return;
    }
    const normalizedValue = String(value || "").trim();
    if (!normalizedValue) {
      return;
    }
    entries.push({ key: normalizedKey, value: normalizedValue });
  });
  return entries;
}

function areStringSetsEqual(leftSet, rightSet) {
  if (!(leftSet instanceof Set) || !(rightSet instanceof Set)) {
    return false;
  }
  if (leftSet.size !== rightSet.size) {
    return false;
  }
  for (const value of leftSet) {
    if (!rightSet.has(value)) {
      return false;
    }
  }
  return true;
}

function compactWorkspaceExportContextValue(value, maxLength = 16) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^\d{4}-\d{2}(-\d{2})?(T\d{2}:\d{2}(:\d{2})?Z)?$/i.test(raw)) {
    const digits = raw.replace(/\D+/g, "");
    return truncateDownloadFileSegment(digits, Math.max(8, maxLength));
  }
  return truncateDownloadFileSegment(sanitizeDownloadFileSegment(raw, ""), maxLength);
}

function buildWorkspaceExportFileStamp() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return sanitizeDownloadFileSegment(stamp, "snapshot");
}

function buildWorkspaceExportGlobalContext(snapshot = {}) {
  const cards = Array.isArray(snapshot?.cards) ? snapshot.cards : [];
  if (cards.length === 0) {
    return "ctx";
  }

  const cardMaps = cards.map((cardSnapshot) => {
    const map = new Map();
    const requestUrl = String(cardSnapshot?.requestUrl || cardSnapshot?.endpointUrl || "").trim();
    getWorkspaceExportQueryEntries(requestUrl).forEach(({ key, value }) => {
      if (!map.has(key)) {
        map.set(key, new Set());
      }
      map.get(key).add(value);
    });
    return map;
  });

  const firstMap = cardMaps[0] instanceof Map ? cardMaps[0] : new Map();
  const sharedEntries = [];
  firstMap.forEach((valueSet, key) => {
    const isShared = cardMaps.every((map) => map.has(key) && areStringSetsEqual(valueSet, map.get(key)));
    if (isShared) {
      sharedEntries.push([key, valueSet]);
    }
  });
  if (sharedEntries.length === 0) {
    return "ctx";
  }

  const aliasByKey = {
    "requestor-id": "rq",
    mvpd: "mv",
    start: "st",
    end: "en",
  };
  const visibleEntries = sharedEntries
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([key, valueSet]) => {
      const alias =
        aliasByKey[key] || truncateDownloadFileSegment(sanitizeDownloadFileSegment(String(key || ""), "q"), 4);
      const values = [...valueSet].sort();
      if (values.length === 0) {
        return alias;
      }
      if (values.length > 1) {
        return `${alias}${values.length}`;
      }
      const compactValue = compactWorkspaceExportContextValue(values[0], 14);
      return compactValue ? `${alias}-${compactValue}` : alias;
    });
  const remainder = sharedEntries.length - visibleEntries.length;
  if (remainder > 0) {
    visibleEntries.push(`k${remainder}`);
  }
  return truncateDownloadFileSegment(
    sanitizeDownloadFileSegment(visibleEntries.join("_"), "ctx"),
    44
  );
}

function getOrderedCardStates() {
  const cardsById = state.cardsById instanceof Map ? state.cardsById : new Map();
  const ordered = [];
  if (els.cardsHost) {
    els.cardsHost.querySelectorAll(".report-card[data-card-id]").forEach((element) => {
      const cardId = String(element.getAttribute("data-card-id") || "").trim();
      if (!cardId || !cardsById.has(cardId)) {
        return;
      }
      ordered.push(cardsById.get(cardId));
    });
  }
  if (ordered.length > 0) {
    return ordered;
  }
  return [...cardsById.values()];
}

function cloneWorkspaceRows(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return {};
    }
    return { ...row };
  });
}

function buildWorkspaceExportSnapshot() {
  const cards = getOrderedCardStates().map((cardState) => ({
    cardId: String(cardState?.cardId || ""),
    endpointUrl: String(cardState?.endpointUrl || ""),
    requestUrl: String(cardState?.requestUrl || cardState?.endpointUrl || ""),
    zoomKey: String(cardState?.zoomKey || ""),
    columns: normalizeEsmColumns(cardState?.columns),
    localColumnFilters: serializeLocalColumnFilters(cardState?.localColumnFilters),
    rows: cloneWorkspaceRows(cardState?.rows),
    sortStack:
      Array.isArray(cardState?.sortStack) && cardState.sortStack.length > 0
        ? cardState.sortStack
            .map((entry) => ({
              col: String(entry?.col || "").trim(),
              dir: String(entry?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
            }))
            .filter((entry) => entry.col)
        : [{ col: "DATE", dir: "DESC" }],
    lastModified: String(cardState?.lastModified || ""),
  }));
  const generatedAt = new Date();
  return {
    title: `${getProgrammerLabel()} clickESM Workspace`,
    controllerStateText: String(els.controllerState?.textContent || "").trim(),
    filterStateText: String(els.filterState?.textContent || "").trim(),
    exportMetaText: "",
    programmerId: String(state.programmerId || ""),
    programmerName: String(state.programmerName || ""),
    requestorIds: Array.isArray(state.requestorIds) ? state.requestorIds.slice(0, 24) : [],
    mvpdIds: Array.isArray(state.mvpdIds) ? state.mvpdIds.slice(0, 24) : [],
    generatedAt: generatedAt.toISOString(),
    clientTimeZone: CLIENT_TIMEZONE,
    cards,
  };
}

function buildClickEsmWorkspaceFileName(snapshot = {}) {
  const mediaCompany = truncateDownloadFileSegment(
    sanitizeDownloadFileSegment(
      firstNonEmptyString([snapshot?.programmerName, snapshot?.programmerId, "MediaCompany"]),
      "MediaCompany"
    ),
    48
  );
  const epoch = Date.now();
  return `${mediaCompany}_clickESMWS_${epoch}.html`;
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
  if (typeof stylesheetText !== "string" || stylesheetText.trim().length === 0) {
    throw new Error("Workspace stylesheet is empty.");
  }
  workspaceStylesheetTextCache = stylesheetText;
  return workspaceStylesheetTextCache;
}

async function loadWorkspaceTearsheetRuntimeText() {
  if (typeof workspaceTearsheetRuntimeTextCache === "string" && workspaceTearsheetRuntimeTextCache.trim().length > 0) {
    return workspaceTearsheetRuntimeTextCache;
  }
  const runtimeUrl = chrome.runtime.getURL(WORKSPACE_TEARSHEET_RUNTIME_PATH);
  const response = await fetch(runtimeUrl, {
    method: "GET",
    credentials: "omit",
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Unable to load clickESMWS runtime (${response.status}).`);
  }
  const runtimeText = await response.text();
  if (typeof runtimeText !== "string" || runtimeText.trim().length === 0) {
    throw new Error("clickESMWS runtime is empty.");
  }
  workspaceTearsheetRuntimeTextCache = runtimeText;
  return workspaceTearsheetRuntimeTextCache;
}

async function loadWorkspaceTearsheetTemplateText() {
  if (typeof workspaceTearsheetTemplateTextCache === "string" && workspaceTearsheetTemplateTextCache.trim().length > 0) {
    return workspaceTearsheetTemplateTextCache;
  }
  const templateUrl = chrome.runtime.getURL(WORKSPACE_TEARSHEET_TEMPLATE_PATH);
  const response = await fetch(templateUrl, {
    method: "GET",
    credentials: "omit",
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Unable to load clickESMWS template (${response.status}).`);
  }
  const templateText = await response.text();
  if (typeof templateText !== "string" || templateText.trim().length === 0) {
    throw new Error("clickESMWS template is empty.");
  }
  workspaceTearsheetTemplateTextCache = templateText;
  return workspaceTearsheetTemplateTextCache;
}

function upsertBodyHiddenInput(doc, name, value) {
  if (!doc || !doc.body) {
    return;
  }
  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    return;
  }
  const selector = `input[name="${normalizedName}"]`;
  let input = doc.body.querySelector(selector);
  if (!input) {
    input = doc.createElement("input");
    input.type = "hidden";
    input.name = normalizedName;
    doc.body.insertBefore(input, doc.body.firstChild);
  }
  input.value = String(value || "");
}

function buildWorkspaceTearsheetHtml(snapshot, templateHtml, stylesheetText, runtimeScriptText, authContext = {}) {
  const templateText = String(templateHtml || "");
  if (!templateText.trim()) {
    throw new Error("clickESMWS template is empty.");
  }

  const payloadJson = JSON.stringify(snapshot || {}).replace(/</g, "\\u003c");
  const runtimeScript = String(runtimeScriptText || "").replace(/<\/script/gi, "<\\/script");
  if (!runtimeScript.trim()) {
    throw new Error("clickESMWS runtime script is empty.");
  }
  const safeStyles = String(stylesheetText || "").replace(/<\/style/gi, "<\\/style");
  if (!safeStyles.trim()) {
    throw new Error("clickESMWS stylesheet is empty.");
  }

  const doc = new DOMParser().parseFromString(templateText, "text/html");
  if (!doc?.documentElement || !doc?.head || !doc?.body) {
    throw new Error("clickESMWS template is invalid.");
  }

  const titleText = String(snapshot?.title || "clickESM Workspace Tearsheet").trim() || "clickESM Workspace Tearsheet";
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

  doc.querySelectorAll("script[src]").forEach((node) => {
    node.remove();
  });

  const genericClickEsmButton = doc.getElementById("workspace-make-clickesm");
  if (genericClickEsmButton) {
    genericClickEsmButton.remove();
  }

  const workspaceClickEsmButton = doc.getElementById("workspace-make-clickesmws");
  if (workspaceClickEsmButton) {
    workspaceClickEsmButton.remove();
  }
  const workspaceClearAllButton = doc.getElementById("workspace-clear-all");
  if (workspaceClearAllButton) {
    workspaceClearAllButton.remove();
  }
  const workspaceExportMeta = doc.getElementById("workspace-export-meta");
  if (workspaceExportMeta) {
    workspaceExportMeta.remove();
  }

  upsertBodyHiddenInput(doc, "cid", authContext?.clientId);
  upsertBodyHiddenInput(doc, "csc", authContext?.clientSecret);
  upsertBodyHiddenInput(doc, "access_token", authContext?.accessToken);

  const payloadNode = doc.createElement("script");
  payloadNode.id = "clickesmws-payload";
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
  anchor.download = String(fileName || "clickESMWS.html");
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1500);
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  // Keep workspace status focused on actionable failures only.
  if (type !== "error" && text) {
    return;
  }
  els.status.textContent = text;
  els.status.classList.remove("error");
  if (type === "error") {
    els.status.classList.add("error");
  }
}

function setActionButtonsDisabled(disabled) {
  const isDisabled = Boolean(disabled);
  const hasCards = hasWorkspaceCardContext();
  if (els.makeClickEsmButton) {
    els.makeClickEsmButton.disabled = isDisabled || state.esmAvailable !== true;
  }
  if (els.makeClickEsmWorkspaceButton) {
    els.makeClickEsmWorkspaceButton.disabled = isDisabled || state.esmAvailable !== true || !hasCards;
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
  const isVisible = state.esmAvailable === true;
  if (els.makeClickEsmButton) {
    els.makeClickEsmButton.hidden = !isVisible;
  }
  if (els.makeClickEsmWorkspaceButton) {
    els.makeClickEsmWorkspaceButton.hidden = !isVisible;
  }
}

function formatProgrammerLabel(programmerId = "", programmerName = "") {
  const name = String(programmerName || "").trim();
  const id = String(programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getProgrammerLabel() {
  return formatProgrammerLabel(state.programmerId, state.programmerName);
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

function buildNotPremiumConsoleLinkHtml(serviceLabel = "ESM") {
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

function shouldShowNonEsmMode() {
  return state.esmAvailable === false && hasProgrammerContext();
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

function updateNonEsmMode() {
  const shouldShow = shouldShowNonEsmMode();
  state.nonEsmMode = shouldShow;
  if (els.nonEsmHeadline) {
    els.nonEsmHeadline.textContent = `No Soup for ${getProgrammerLabel()}. No Premium, No ESM, No Dice.`;
  }
  if (els.nonEsmNote) {
    els.nonEsmNote.innerHTML = buildNotPremiumConsoleLinkHtml("ESM");
  }

  // Preserve workspace card context while temporarily viewing non-ESM media companies.
  // Cards should only be cleared by explicit user action (Clear All) or workspace close.

  if (els.stylesheet) {
    els.stylesheet.disabled = shouldShow;
  }
  if (els.appRoot) {
    els.appRoot.hidden = shouldShow;
  }
  if (els.nonEsmScreen) {
    els.nonEsmScreen.hidden = !shouldShow;
  }
}

function updateWorkspaceLockState() {
  const shouldLock = shouldShowNonEsmMode();
  state.workspaceLocked = shouldLock;
  document.body.classList.toggle("workspace-locked", shouldLock);
  if (els.lockBanner) {
    els.lockBanner.hidden = !shouldLock;
  }
  if (els.lockMessage) {
    els.lockMessage.innerHTML = shouldLock ? buildWorkspaceLockMessageHtml() : "";
  }
  syncActionButtonsDisabled();
  updateNonEsmMode();
}

function updateControllerBanner() {
  if (!els.controllerState || !els.filterState) {
    return;
  }

  const hasProgrammerContext = Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
  if (state.workspaceLocked) {
    els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
    els.filterState.textContent = "ESM Workspace is locked for this media company. No Premium, No ESM, No Dice.";
    return;
  }
  if (!state.controllerOnline) {
    if (hasProgrammerContext) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "Waiting for ESM controller sync from UnderPAR side panel...";
    } else {
      els.controllerState.textContent = "Waiting for UnderPAR side panel controller...";
      els.filterState.textContent = "";
    }
    return;
  }

  const programmerLabel = getProgrammerLabel();
  els.controllerState.textContent = `Selected Media Company: ${programmerLabel}`;

  const requestorLabel = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
  const mvpdLabel = state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs";
  const harvestList = Array.isArray(state.profileHarvestList) ? state.profileHarvestList : [];
  const harvest = state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : harvestList[0] || null;
  const harvestCount = harvestList.length;
  const harvestPairLabel =
    harvest && (String(harvest.requestorId || "").trim() || String(harvest.mvpd || "").trim())
      ? `${String(harvest.requestorId || "").trim() || "requestor"} x ${String(harvest.mvpd || "").trim() || "mvpd"}`
      : "";
  const harvestSummary =
    harvestCount > 0
      ? ` | MVPD Login History: ${harvestCount} captured${harvestPairLabel ? ` | Latest: ${harvestPairLabel}` : ""}`
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

function clearPendingProgrammerSwitchTransition() {
  state.pendingAutoRerunProgrammerKey = "";
  state.autoRerunInFlightProgrammerKey = "";
}

async function autoRerunCardsForProgrammerSwitch(expectedProgrammerKey = "") {
  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  if (!currentProgrammerKey) {
    return false;
  }
  if (expectedProgrammerKey && currentProgrammerKey !== expectedProgrammerKey) {
    return false;
  }
  if (state.esmAvailable !== true || state.workspaceLocked || state.nonEsmMode || state.batchRunning) {
    return false;
  }

  const cards = getOrderedCardStates();
  if (cards.length === 0) {
    return false;
  }

  await rerunAllCards({
    // Keep media-company switch refresh behavior aligned with the same code path
    // users trigger via the workspace Re-Run All button.
    reason: "manual-reload",
  });
  return true;
}

function maybeConsumePendingAutoRerun() {
  const pendingProgrammerKey = String(state.pendingAutoRerunProgrammerKey || "").trim();
  if (!pendingProgrammerKey) {
    return;
  }
  if (state.controllerOnline) {
    return;
  }

  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  if (!currentProgrammerKey || currentProgrammerKey !== pendingProgrammerKey) {
    return;
  }

  if (state.esmAvailable === false) {
    clearPendingProgrammerSwitchTransition();
    return;
  }
  if (state.esmAvailable !== true) {
    return;
  }

  if (state.batchRunning || state.workspaceLocked || state.nonEsmMode) {
    return;
  }

  const cards = getOrderedCardStates();
  if (cards.length === 0) {
    clearPendingProgrammerSwitchTransition();
    return;
  }

  state.pendingAutoRerunProgrammerKey = "";
  state.autoRerunInFlightProgrammerKey = currentProgrammerKey;
  void autoRerunCardsForProgrammerSwitch(currentProgrammerKey).finally(() => {
    if (String(state.autoRerunInFlightProgrammerKey || "").trim() === currentProgrammerKey) {
      state.autoRerunInFlightProgrammerKey = "";
    }
  });
}

function getDefaultSortStack() {
  return [{ col: "DATE", dir: "DESC" }];
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

function formatPercent(rate) {
  if (rate == null) {
    return "—";
  }
  return `${(rate * 100).toFixed(2)}%`;
}

function createCell(value) {
  const cell = document.createElement("td");
  const text = value == null ? "" : String(value);
  cell.textContent = text;
  cell.title = text;
  return cell;
}

function getCellValue(row, columnKey, context) {
  if (columnKey === "DATE") {
    return esmPartsToUtcMs(row);
  }

  if (context.hasAuthN && columnKey === "AuthN Success") {
    const rate = safeRate(row["authn-successful"], row["authn-attempts"]);
    return rate == null ? -1 : rate;
  }

  if (context.hasAuthZ && columnKey === "AuthZ Success") {
    const rate = safeRate(row["authz-successful"], row["authz-attempts"]);
    return rate == null ? -1 : rate;
  }

  if (columnKey === "COUNT") {
    const value = toNumber(row.count);
    return value == null ? 0 : value;
  }

  const rawValue = row[columnKey];
  if (rawValue == null) {
    return "";
  }

  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return rawValue;
  }

  const converted = toNumber(rawValue);
  if (converted != null) {
    return converted;
  }
  return String(rawValue).toLowerCase();
}

function sortRows(rows, sortStack, context) {
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? sortStack : getDefaultSortStack();
  return [...rows].sort((left, right) => {
    for (const sortRule of stack) {
      const factor = sortRule.dir === "ASC" ? 1 : -1;
      const leftValue = getCellValue(left, sortRule.col, context);
      const rightValue = getCellValue(right, sortRule.col, context);
      if (leftValue < rightValue) {
        return -1 * factor;
      }
      if (leftValue > rightValue) {
        return 1 * factor;
      }
    }
    return getCellValue(right, "DATE", context) - getCellValue(left, "DATE", context);
  });
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
  tableState.tbody.innerHTML = "";
  tableState.data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(buildEsmDateLabel(row)));

    if (tableState.hasAuthN) {
      tr.appendChild(createCell(formatPercent(safeRate(row["authn-successful"], row["authn-attempts"]))));
    }
    if (tableState.hasAuthZ) {
      tr.appendChild(createCell(formatPercent(safeRate(row["authz-successful"], row["authz-attempts"]))));
    }
    if (!tableState.hasAuthN && !tableState.hasAuthZ && tableState.hasCount) {
      tr.appendChild(createCell(row.count));
    }

    tableState.displayColumns.forEach((column) => {
      tr.appendChild(createCell(row[column] ?? ""));
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
  return {
    cardId: cardState.cardId,
    endpointUrl: cardState.endpointUrl,
    requestUrl: cardState.requestUrl,
    zoomKey: cardState.zoomKey,
    columns: cardState.columns,
    localColumnFilters: serializeLocalColumnFilters(cardState?.localColumnFilters),
  };
}

function safeDecodeUrlSegment(segment) {
  const raw = String(segment || "");
  try {
    return decodeURIComponent(raw);
  } catch (_error) {
    return raw;
  }
}

function stripEsmBaseFromPath(pathValue) {
  const normalized = String(pathValue || "").replace(/^\/+|\/+$/g, "");
  if (!normalized) {
    return "";
  }

  const lower = normalized.toLowerCase();
  const marker = ESM_NODE_BASE_PATH.toLowerCase();
  if (lower.startsWith(marker)) {
    return normalized.slice(marker.length).replace(/^\/+|\/+$/g, "");
  }
  return normalized;
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

function parseEsmRequestContext(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return {
      fullUrl: "",
      displayPath: "",
      queryPairs: [],
    };
  }

  let displayPath = "";
  try {
    const parsed = new URL(raw);
    displayPath = stripEsmBaseFromPath(parsed.pathname);
  } catch (_error) {
    // Ignore parse failures and continue with raw fallback.
  }

  if (!displayPath) {
    const withoutQuery = raw.split(/[?#]/, 1)[0] || raw;
    const withoutBase = withoutQuery.startsWith(ESM_NODE_BASE_URL) ? withoutQuery.slice(ESM_NODE_BASE_URL.length) : withoutQuery;
    displayPath = stripEsmBaseFromPath(withoutBase);
  }

  return {
    fullUrl: raw,
    displayPath,
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
  const fallback = `${ESM_NODE_BASE_URL}${targetPath}`;
  const rawBase = String(baseEndpointUrl || "").trim();
  if (!rawBase) {
    return fallback;
  }

  try {
    const parsed = new URL(rawBase);
    parsed.pathname = `/${ESM_NODE_BASE_PATH}${targetPath}`;
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch (_error) {
    return fallback;
  }
}

function buildInheritedRequestUrl(endpointUrl, sourceRequestUrl) {
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
      return endpointParsed.toString();
    }

    const sourceParsed = new URL(sourceRaw);
    sourceParsed.searchParams.forEach((value, key) => {
      endpointParsed.searchParams.append(key, value);
    });
    return endpointParsed.toString();
  } catch (_error) {
    return endpointRaw;
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
  const context = parseEsmRequestContext(urlValue);
  if (!context.fullUrl) {
    return '<span class="card-url-empty">No ESM URL</span>';
  }

  const pathSegments = String(context.displayPath || "")
    .split("/")
    .map((segment) => safeDecodeUrlSegment(segment.trim()))
    .filter(Boolean);
  const pathMarkup =
    pathSegments.length > 0
      ? pathSegments
          .map(
            (segment, index) => {
              const segmentClass = `card-url-path-segment${index === pathSegments.length - 1 ? " card-url-path-segment-terminal" : ""}`;
              const segmentEndpointUrl = buildPathEndpointUrl(endpointUrl || context.fullUrl, pathSegments, index + 1);
              const segmentText = escapeHtml(segment);
              const segmentMarkup = segmentEndpointUrl
                ? `<a class="${segmentClass} card-url-path-link" href="${escapeHtml(segmentEndpointUrl)}" data-endpoint-url="${escapeHtml(
                    segmentEndpointUrl
                  )}" data-source-request-url="${escapeHtml(context.fullUrl)}">${segmentText}</a>`
                : `<span class="${segmentClass}">${segmentText}</span>`;
              return `${segmentMarkup}${index < pathSegments.length - 1 ? '<span class="card-url-path-divider">/</span>' : ""}`;
            }
          )
          .join("")
      : '<span class="card-url-path-segment card-url-path-segment-empty">media-company</span>';

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
    <span class="card-url-context" aria-label="ESM request context">
      <span class="card-url-path" aria-label="ESM path">${pathMarkup}</span>
      <span class="card-url-query-cloud" aria-label="ESM query context">${queryMarkup}</span>
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

async function runCardFromPathNode(cardState, endpointUrl, sourceRequestUrl) {
  const targetEndpointUrl = String(endpointUrl || "").trim();
  if (!targetEndpointUrl) {
    return;
  }
  const inheritedRequestUrl = buildInheritedRequestUrl(targetEndpointUrl, sourceRequestUrl || cardState?.requestUrl);
  const targetEndpointKey = getWorkspaceEndpointKey(targetEndpointUrl);
  const currentEndpointKey = getWorkspaceEndpointKey(String(cardState?.endpointUrl || cardState?.requestUrl || ""));
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
      setStatus(result?.error || "Unable to re-run ESM node report.", "error");
    }
    return;
  }
  const nextCardPayload = {
    cardId: buildWorkspaceCardId("path"),
    endpointUrl: targetEndpointUrl,
    requestUrl: inheritedRequestUrl || targetEndpointUrl,
    zoomKey: String(cardState?.zoomKey || ""),
    columns: normalizeEsmColumns(cardState?.columns),
  };

  const result = await sendWorkspaceAction("run-card", {
    requestSource: "workspace-path-link",
    card: nextCardPayload,
  });
  if (!result?.ok) {
    setStatus(result?.error || "Unable to run ESM path node report.", "error");
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

function getEsmNodeLabel(urlValue) {
  const context = parseEsmRequestContext(urlValue);
  if (!context.fullUrl) {
    return "node";
  }

  const segments = String(context.displayPath || "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments.length > 0 ? safeDecodeUrlSegment(segments[segments.length - 1]) : "node";
}

function initializeCardLocalFilterBaseline(cardState, rows, requestUrl) {
  if (!cardState || !Array.isArray(rows) || rows.length === 0) {
    return;
  }
  if (!cardState.localHasBaselineData) {
    const rowSample = rows[0] && typeof rows[0] === "object" ? rows[0] : {};
    const fallbackColumns = Object.keys(rowSample)
      .map((columnName) => normalizeDimensionName(columnName))
      .filter(Boolean)
      .filter((columnName) => !isSuppressedEsmColumn(columnName));
    const candidateColumns = normalizeEsmColumns(cardState.columns, { href: requestUrl })
      .map((columnName) => normalizeDimensionName(columnName))
      .filter(Boolean)
      .filter((columnName) => !isSuppressedEsmColumn(columnName));
    const baselineColumns = (candidateColumns.length > 0 ? candidateColumns : fallbackColumns)
      .filter((columnName) => isFilterableDimension(columnName, requestUrl));
    const distinct = buildDistinctValuesForColumns(rows, baselineColumns);

    cardState.localDistinctByColumn.clear();
    cardState.localDescriptionByColumn.clear();
    distinct.forEach((values, columnName) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }
      cardState.localDistinctByColumn.set(columnName, values);
      const description = getDimensionDescription(columnName, requestUrl);
      if (description) {
        cardState.localDescriptionByColumn.set(columnName, description);
      }
    });
    cardState.localHasBaselineData = cardState.localDistinctByColumn.size > 0;
  }
  if (!cardState.localHasBaselineData) {
    return;
  }

  const nextFilters = normalizeLocalColumnFilters(cardState.localColumnFilters);
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

function buildCardLocalFilterResetMarkup(cardState, { compact = false } = {}) {
  if (!hasLocalColumnFilters(cardState?.localColumnFilters)) {
    return "";
  }
  const className = compact
    ? "esm-action-btn esm-unfilter esm-clear-filter-rerun esm-clear-filter-rerun--inline"
    : "esm-action-btn esm-unfilter esm-clear-filter-rerun";
  const ariaLabel = compact
    ? "Remove local column filters and rerun this ESM table"
    : "Un-filter and rerun this ESM table";
  return `<button type="button" class="${className}" aria-label="${ariaLabel}" title="Clear this table local column filters and rerun this ESM URL"><svg class="esm-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7z"/></svg></button>`;
}

function buildCardColumnsMarkup(cardState) {
  const requestUrl = String(cardState?.requestUrl || cardState?.endpointUrl || "").trim();
  const sourceColumns =
    cardState?.localDistinctByColumn && cardState.localDistinctByColumn.size > 0
      ? [...cardState.localDistinctByColumn.keys()]
      : normalizeEsmColumns(cardState?.columns, { href: requestUrl });
  const displayColumns = buildDisplayDimensions(sourceColumns, requestUrl);
  const nodeLabel = getEsmNodeLabel(requestUrl);
  const endpointMarkup = requestUrl
    ? `<a class="card-col-parent-url card-rerun-url" href="${escapeHtml(requestUrl)}" title="${escapeHtml(
        requestUrl
      )}">${escapeHtml(nodeLabel)}</a>`
    : `<span class="card-col-parent-url card-col-parent-url-empty">node</span>`;
  const normalizedFilterableColumns = displayColumns.filter((column) => isFilterableDimension(column, requestUrl));
  const hasInteractiveBaseline =
    Boolean(cardState?.localHasBaselineData) &&
    cardState?.localDistinctByColumn instanceof Map &&
    cardState.localDistinctByColumn.size > 0;
  const interactiveColumns = hasInteractiveBaseline
    ? [...cardState.localDistinctByColumn.keys()]
        .map((column) => normalizeDimensionName(column))
        .filter((column) => normalizedFilterableColumns.includes(column))
    : [];
  const interactiveColumnSet = new Set(interactiveColumns);
  const columnsMarkup =
    displayColumns.length > 0
      ? `<div class="col-chip-cloud">${displayColumns
          .map((column) => {
            if (interactiveColumnSet.has(column)) {
            const description = String(
              cardState?.localDescriptionByColumn?.get(column) || getDimensionDescription(column, requestUrl) || ""
            ).trim();
            const selectedCount = cardState?.localColumnFilters?.get(column)?.size || 0;
            const label = selectedCount > 0 ? `${column} (${selectedCount})` : column;
            const title = selectedCount > 0 ? `${description || column} (${selectedCount} selected)` : description || column;
            const classes = `col-chip${selectedCount > 0 ? " col-chip-filtered" : ""}`;
            return `<div class="${classes}" data-column="${escapeHtml(column)}" data-filterable="1"${
              description ? ` data-description="${escapeHtml(description)}"` : ""
            } title="${escapeHtml(title)}">
              <button type="button" class="col-chip-trigger" title="${escapeHtml(title)}">${escapeHtml(label)}</button>
            </div>`;
            }
            const description = String(getDimensionDescription(column, requestUrl) || "").trim();
            const title = description || column;
            return `<div class="col-chip" data-column="${escapeHtml(column)}" data-filterable="0" title="${escapeHtml(title)}">
              <span class="col-chip-label col-chip-label-static" title="${escapeHtml(title)}">${escapeHtml(column)}</span>
            </div>`;
          })
          .join("")}</div>`
      : `<span class="card-col-empty"></span>`;

  return `
    <div class="card-col-list">
      <div class="card-col-layout">
        <div class="card-col-node">${endpointMarkup}</div>
        <div class="card-col-columns-wrap">
          <div class="card-col-columns" aria-label="ESM columns">${columnsMarkup}</div>
          <div class="local-col-picker-wrap" hidden>
            <select class="local-col-menu" multiple size="1" title="Choose one or more values from this column"></select>
          </div>
        </div>
      </div>
    </div>
  `;
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

  const title = article.querySelector(".card-title");
  const subtitle = article.querySelector(".card-subtitle");
  const closeButton = article.querySelector(".card-close");
  const body = article.querySelector(".card-body");

  cardState.element = article;
  cardState.titleElement = title;
  cardState.subtitleElement = subtitle;
  cardState.closeButton = closeButton;
  cardState.bodyElement = body;
}

function updateCardHeader(cardState) {
  const requestUrl = String(cardState.requestUrl || cardState.endpointUrl || "").trim();
  cardState.titleElement.innerHTML = buildCardHeaderContextMarkup(requestUrl, String(cardState.endpointUrl || ""));
  cardState.titleElement.title = requestUrl || "No ESM URL";
  const zoom = cardState.zoomKey ? `Zoom: ${cardState.zoomKey}` : "Zoom: --";
  const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
  cardState.subtitleElement.textContent = `${zoom} | Rows: ${rows}`;
  wireCardHeaderPathLinks(cardState);
}

function ensureWorkspaceUnlocked() {
  if (!state.workspaceLocked && !state.nonEsmMode) {
    return true;
  }
  setStatus(getWorkspaceLockMessage(), "error");
  return false;
}

async function rerunCard(cardState) {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  const result = await sendWorkspaceAction("run-card", {
    card: getCardPayload(cardState),
  });
  if (!result?.ok) {
    renderCardMessage(cardState, result?.error || "Unable to run report from UnderPAR side panel controller.", { error: true });
    setStatus(result?.error || "Unable to run report from UnderPAR side panel controller.", "error");
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
  const clearFilterButtons = cardState?.bodyElement?.querySelectorAll(".esm-clear-filter-rerun") || [];
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
      const columnName = normalizeDimensionName(chip.getAttribute("data-column"));
      if (!columnName) {
        return;
      }
      const trigger = chip.querySelector(".col-chip-trigger");
      const selectedCount = cardState?.localColumnFilters?.get(columnName)?.size || 0;
      const description = String(chip.getAttribute("data-description") || "").trim();
      const title = selectedCount > 0 ? `${description || columnName} (${selectedCount} selected)` : description || columnName;
      chip.classList.toggle("col-chip-active", pickerOpen && cardState.pickerOpenColumn === columnName);
      chip.classList.toggle("col-chip-filtered", selectedCount > 0);
      if (trigger) {
        trigger.textContent = selectedCount > 0 ? `${columnName} (${selectedCount})` : columnName;
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
      // ignore
    }
    try {
      pickerSelect.click();
    } catch (_error) {
      // ignore
    }
  };

  const openPicker = (columnName, chipElement) => {
    const normalizedColumn = normalizeDimensionName(columnName);
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
      const columnName = normalizeDimensionName(chip.getAttribute("data-column"));
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
    const columnName = normalizeDimensionName(pickerWrap.dataset.column || "");
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

  const openColumn = normalizeDimensionName(cardState.pickerOpenColumn || "");
  if (openColumn) {
    const chipToReopen = [...cloudElement.querySelectorAll(".col-chip[data-column]")].find(
      (chip) => normalizeDimensionName(chip.getAttribute("data-column")) === openColumn
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
    const previousEndpointKey = getWorkspaceEndpointKey(String(existing.endpointUrl || existing.requestUrl || ""));
    if (cardMeta?.endpointUrl) {
      existing.endpointUrl = String(cardMeta.endpointUrl);
    }
    if (cardMeta?.requestUrl) {
      existing.requestUrl = String(cardMeta.requestUrl);
    }
    if (cardMeta?.zoomKey) {
      existing.zoomKey = String(cardMeta.zoomKey);
    }
    if (Array.isArray(cardMeta?.columns)) {
      existing.columns = normalizeEsmColumns(cardMeta.columns);
    }
    if (cardMeta?.localColumnFilters && typeof cardMeta.localColumnFilters === "object") {
      existing.localColumnFilters = normalizeLocalColumnFilters(cardMeta.localColumnFilters);
    }
    const nextEndpointKey = getWorkspaceEndpointKey(String(existing.endpointUrl || existing.requestUrl || ""));
    if (previousEndpointKey && nextEndpointKey && previousEndpointKey !== nextEndpointKey) {
      existing.localColumnFilters = new Map();
      existing.localDistinctByColumn.clear();
      existing.localDescriptionByColumn.clear();
      existing.localHasBaselineData = false;
      existing.pickerOpenColumn = "";
    }
    updateCardHeader(existing);
    return existing;
  }

  const cardState = {
    cardId,
    endpointUrl: String(cardMeta?.endpointUrl || ""),
    requestUrl: String(cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
    zoomKey: String(cardMeta?.zoomKey || ""),
    columns: normalizeEsmColumns(cardMeta?.columns),
    rows: [],
    sortStack: getDefaultSortStack(),
    lastModified: "",
    localColumnFilters: normalizeLocalColumnFilters(cardMeta?.localColumnFilters),
    localDistinctByColumn: new Map(),
    localDescriptionByColumn: new Map(),
    localHasBaselineData: false,
    pickerOpenColumn: "",
    pickerOutsidePointerHandler: null,
    pickerOutsideKeyHandler: null,
    running: false,
    element: null,
    titleElement: null,
    subtitleElement: null,
    closeButton: null,
    bodyElement: null,
  };

  createCardElements(cardState);
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    if (typeof cardState.pickerOutsidePointerHandler === "function") {
      document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    }
    if (typeof cardState.pickerOutsideKeyHandler === "function") {
      document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    }
    cardState.element.remove();
    state.cardsById.delete(cardState.cardId);
    syncActionButtonsDisabled();
  });

  state.cardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  syncActionButtonsDisabled();
  return cardState;
}

function renderCardTable(cardState, rows, lastModified) {
  const firstRow = rows[0];
  const hasAuthN = firstRow["authn-attempts"] != null && firstRow["authn-successful"] != null;
  const hasAuthZ = firstRow["authz-attempts"] != null && firstRow["authz-successful"] != null;
  const hasCount = firstRow.count != null;
  const displayColumns = Object.keys(firstRow).filter(
    (column) => !ESM_METRIC_COLUMNS.has(column) && !ESM_DATE_PARTS.includes(column) && !isSuppressedEsmColumn(column)
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
                  <span class="esm-close" title="Close table"> x </span>
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
  const closeButton = cardState.bodyElement.querySelector(".esm-close");

  const tableState = {
    wrapper: tableWrapper,
    table,
    thead,
    tbody,
    data: rows,
    sortStack: getDefaultSortStack(),
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
      const result = await sendWorkspaceAction("download-csv", {
        card: getCardPayload(cardState),
        sortRule: cardState.sortStack?.[0] || getDefaultSortStack()[0],
      });
      if (!result?.ok) {
        setStatus(result?.error || "Unable to download CSV.", "error");
      } else {
        setStatus("CSV download started.");
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      cardState.rows = [];
      cardState.lastModified = "";
      cardState.sortStack = getDefaultSortStack();
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
  cardState.sortStack = getDefaultSortStack();
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Loading report...");
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  syncWorkspaceNetworkIndicator();
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

  const rows = applyLocalColumnFiltersToRows(
    Array.isArray(payload?.rows) ? payload.rows : [],
    cardState.localColumnFilters
  );
  cardState.rows = rows;
  cardState.lastModified = String(payload?.lastModified || "");
  cardState.sortStack = getDefaultSortStack();
  initializeCardLocalFilterBaseline(cardState, rows, String(payload?.requestUrl || cardState.requestUrl || cardState.endpointUrl || ""));
  updateCardHeader(cardState);

  if (rows.length === 0) {
    renderCardMessage(cardState, "No data");
    syncWorkspaceNetworkIndicator();
    return;
  }

  renderCardTable(cardState, rows, cardState.lastModified);
  syncWorkspaceNetworkIndicator();
}

function applyControllerState(payload) {
  const previousProgrammerId = String(state.programmerId || "");
  const previousProgrammerName = String(state.programmerName || "");
  const previousProgrammerKey = getProgrammerIdentityKey(previousProgrammerId, previousProgrammerName);
  const controllerReason = String(payload?.controllerReason || "").trim().toLowerCase();

  state.controllerOnline = payload?.controllerOnline === true;
  if (payload?.esmAvailable === true) {
    state.esmAvailable = true;
  } else if (payload?.esmAvailable === false) {
    state.esmAvailable = false;
  } else {
    state.esmAvailable = null;
  }
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
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
  if (programmerChanged) {
    state.batchRunning = false;
    state.autoRerunInFlightProgrammerKey = "";
    state.cardsById.forEach((cardState) => {
      if (cardState) {
        cardState.running = false;
      }
    });
    syncActionButtonsDisabled();
  }
  const currentProgrammerKey = getProgrammerIdentityKey(state.programmerId, state.programmerName);
  const shouldTriggerWorkspaceRedraw =
    programmerChanged &&
    Boolean(previousProgrammerKey) &&
    hasWorkspaceCardContext() &&
    state.controllerOnline === false &&
    controllerReason === "media-company-change";
  if (shouldTriggerWorkspaceRedraw && currentProgrammerKey) {
    state.pendingAutoRerunProgrammerKey = currentProgrammerKey;
  } else if (programmerChanged) {
    state.pendingAutoRerunProgrammerKey = "";
  }

  syncTearsheetButtonsVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
  maybeConsumePendingAutoRerun();
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
    clearPendingProgrammerSwitchTransition();
    applyReportStart(payload);
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
    const reason = String(payload?.reason || "").trim().toLowerCase();
    if (reason === "manual-reload") {
      setStatus(total > 0 ? `Reloading ${total} report(s)...` : "Reloading reports...");
    } else {
      setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    }
    return;
  }

  if (event === "batch-end") {
    state.batchRunning = false;
    state.cardsById.forEach((cardState) => {
      if (cardState) {
        cardState.running = false;
      }
    });
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
    maybeConsumePendingAutoRerun();
    return;
  }

  if (event === "csv-complete") {
    setStatus("CSV download started.");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  if (String(action || "").trim().toLowerCase() !== "workspace-ready" && !ensureWorkspaceUnlocked()) {
    return { ok: false, error: getWorkspaceLockMessage() };
  }
  try {
    return await chrome.runtime.sendMessage({
      type: ESM_WORKSPACE_MESSAGE_TYPE,
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

async function rerunAllCards(options = {}) {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  const reason = String(options?.reason || "").trim().toLowerCase();
  if (state.cardsById.size === 0) {
    setStatus("No reports are open.");
    return;
  }

  const cards = [...state.cardsById.values()].map((cardState) => getCardPayload(cardState));
  state.batchRunning = true;
  syncActionButtonsDisabled();
  if (reason === "manual-reload") {
    setStatus(`Reloading ${cards.length} report(s)...`);
  } else {
    setStatus(`Re-running ${cards.length} report(s)...`);
  }
  const result = await sendWorkspaceAction("rerun-all", { cards, reason });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
    return;
  }
}

async function makeClickEsmDownload() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.esmAvailable !== true) {
    setStatus("clickESM generation is only available for media companies with ESM.", "error");
    return;
  }

  setStatus("", "info");
  const result = await sendWorkspaceAction("make-clickesm");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to generate clickESM file.", "error");
    return;
  }
}

async function makeClickEsmWorkspaceDownload() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.esmAvailable !== true) {
    setStatus("clickESMWS_TEARSHEET generation is only available for media companies with ESM.", "error");
    return;
  }
  const cards = getOrderedCardStates();
  if (cards.length === 0) {
    setStatus("Open at least one workspace report before generating clickESMWS_TEARSHEET.", "error");
    return;
  }

  if (els.makeClickEsmWorkspaceButton) {
    els.makeClickEsmWorkspaceButton.disabled = true;
  }
  setStatus("", "info");
  try {
    const snapshot = buildWorkspaceExportSnapshot();
    const authResult = await sendWorkspaceAction("resolve-clickesmws-auth");
    if (!authResult?.ok) {
      throw new Error(authResult?.error || "Unable to resolve clickESM workspace credentials.");
    }
    const [templateHtml, runtimeScriptText, stylesheetText] = await Promise.all([
      loadWorkspaceTearsheetTemplateText(),
      loadWorkspaceTearsheetRuntimeText(),
      loadWorkspaceStylesheetText(),
    ]);
    const outputHtml = buildWorkspaceTearsheetHtml(snapshot, templateHtml, stylesheetText, runtimeScriptText, {
      clientId: String(authResult?.clientId || ""),
      clientSecret: String(authResult?.clientSecret || ""),
      accessToken: String(authResult?.accessToken || ""),
    });
    const fileName = buildClickEsmWorkspaceFileName(snapshot);
    downloadHtmlFile(outputHtml, fileName);
  } catch (error) {
    setStatus(
      `Unable to generate clickESMWS_TEARSHEET: ${error instanceof Error ? error.message : String(error)}`,
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
  if (els.makeClickEsmButton) {
    els.makeClickEsmButton.addEventListener("click", () => {
      void makeClickEsmDownload();
    });
  }
  if (els.makeClickEsmWorkspaceButton) {
    els.makeClickEsmWorkspaceButton.addEventListener("click", () => {
      void makeClickEsmWorkspaceDownload();
    });
  }

  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void rerunAllCards({
        reason: "manual-reload",
      });
    });
  }

  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspace();
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== ESM_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
  registerEventHandlers();
  syncTearsheetButtonsVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR side panel controller.", "error");
  }
}

void init();
