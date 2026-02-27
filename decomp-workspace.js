const DECOMP_MESSAGE_TYPE = "underpar:decomp";
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
const ESM_NODE_BASE_URL = "https://mgmt.auth.adobe.com/esm/v3/media-company/";
const ESM_NODE_BASE_PATH = "esm/v3/media-company/";
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
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
  makeClickEsmButton: document.getElementById("workspace-make-clickesm"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeEsmColumns(columns) {
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
  return output;
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
  if (els.makeClickEsmButton) {
    els.makeClickEsmButton.disabled = isDisabled || state.esmAvailable !== true;
  }
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isDisabled;
  }
  if (els.clearButton) {
    els.clearButton.disabled = isDisabled;
  }
}

function syncActionButtonsDisabled() {
  setActionButtonsDisabled(state.batchRunning || state.workspaceLocked);
}

function syncMakeClickEsmVisibility() {
  if (!els.makeClickEsmButton) {
    return;
  }
  const isVisible = state.esmAvailable === true;
  els.makeClickEsmButton.hidden = !isVisible;
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
  return !state.controllerOnline && state.esmAvailable === false && hasProgrammerContext();
}

function clearWorkspaceCards() {
  state.cardsById.forEach((cardState) => {
    cardState.element?.remove();
  });
  state.cardsById.clear();
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

  if (shouldShow) {
    clearWorkspaceCards();
  }

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
  if (!state.controllerOnline) {
    if (state.workspaceLocked) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "decomp workspace is locked for this media company. No Premium, No ESM, No Dice.";
    } else if (hasProgrammerContext) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "Waiting for decomp controller sync from UnderPAR side panel...";
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

async function runCardFromPathNode(cardState, endpointUrl, sourceRequestUrl) {
  const targetEndpointUrl = String(endpointUrl || "").trim();
  if (!targetEndpointUrl) {
    return;
  }
  const inheritedRequestUrl = buildInheritedRequestUrl(targetEndpointUrl, sourceRequestUrl || cardState?.requestUrl);
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

function buildCardColumnsMarkup(cardState) {
  const columns = normalizeEsmColumns(cardState?.columns);
  const requestUrl = String(cardState?.requestUrl || cardState?.endpointUrl || "").trim();
  const nodeLabel = getEsmNodeLabel(requestUrl);
  const endpointMarkup = requestUrl
    ? `<a class="card-col-parent-url card-rerun-url" href="${escapeHtml(requestUrl)}" title="${escapeHtml(
        requestUrl
      )}">${escapeHtml(nodeLabel)}</a>`
    : `<span class="card-col-parent-url card-col-parent-url-empty">node</span>`;
  const columnsMarkup =
    columns.length > 0
      ? columns
          .map((column) => `<span class="card-col-chip">${escapeHtml(column)}</span>`)
          .join("")
      : `<span class="card-col-empty">No columns</span>`;

  return `
    <div class="card-col-list">
      <div class="card-col-layout">
        <div class="card-col-node">${endpointMarkup}</div>
        <div class="card-col-columns" aria-label="ESM columns">${columnsMarkup}</div>
      </div>
    </div>
  `;
}

function renderCardMessage(cardState, message, options = {}) {
  const cssClass = options.error ? "card-message error" : "card-message";
  cardState.bodyElement.innerHTML = `<p class="${cssClass}">${escapeHtml(message || "")}</p>${buildCardColumnsMarkup(cardState)}`;
  wireCardRerunUrl(cardState);
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

function wireCardRerunUrl(cardState) {
  const rerunUrl = cardState?.bodyElement?.querySelector(".card-rerun-url");
  if (!rerunUrl) {
    return;
  }
  rerunUrl.addEventListener("click", (event) => {
    event.preventDefault();
    void rerunCard(cardState);
  });
}

function ensureCard(cardMeta) {
  const cardId = String(cardMeta?.cardId || "").trim();
  if (!cardId) {
    return null;
  }

  if (state.cardsById.has(cardId)) {
    const existing = state.cardsById.get(cardId);
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
    cardState.element.remove();
    state.cardsById.delete(cardState.cardId);
  });

  state.cardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  return cardState;
}

function renderCardTable(cardState, rows, lastModified) {
  const firstRow = rows[0];
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
                <span class="esm-last-modified"></span>
                <span class="esm-close" title="Close table"> x </span>
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

  wireCardRerunUrl(cardState);
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
    return;
  }

  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  cardState.rows = rows;
  cardState.lastModified = String(payload?.lastModified || "");
  cardState.sortStack = getDefaultSortStack();
  updateCardHeader(cardState);

  if (rows.length === 0) {
    renderCardMessage(cardState, "No data");
    return;
  }

  renderCardTable(cardState, rows, cardState.lastModified);
}

function applyControllerState(payload) {
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
  syncMakeClickEsmVisibility();
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
      type: DECOMP_MESSAGE_TYPE,
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

  setStatus("Generating clickESM file...");
  const result = await sendWorkspaceAction("make-clickesm");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to generate clickESM file.", "error");
    return;
  }
  const fileName = String(result?.fileName || "clickESM.html");
  setStatus(`Downloaded ${fileName}.`);
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

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== DECOMP_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
  syncMakeClickEsmVisibility();
  updateWorkspaceLockState();
  updateControllerBanner();
  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR side panel controller.", "error");
  }
}

void init();
