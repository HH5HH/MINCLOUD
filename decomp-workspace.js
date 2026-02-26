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
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
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
    els.lockMessage.textContent = shouldLock ? getWorkspaceLockMessage() : "";
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
      els.filterState.textContent = "decomp workspace is locked for this media company.";
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
  els.filterState.textContent = `RequestorId(s): ${requestorLabel} | MVPD(s): ${mvpdLabel}`;
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

function getEsmNodeLabel(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "node";
  }

  try {
    const parsed = new URL(raw);
    let path = String(parsed.pathname || "").replace(/^\/+|\/+$/g, "");
    if (path.startsWith("esm/v3/media-company/")) {
      path = path.slice("esm/v3/media-company/".length);
    }
    const segments = path.split("/").map((segment) => segment.trim()).filter(Boolean);
    const leaf = segments.length > 0 ? segments[segments.length - 1] : "";
    if (leaf) {
      return safeDecodeUrlSegment(leaf);
    }
  } catch (_error) {
    // Ignore parse failures and continue with fallback path parsing.
  }

  const withoutQuery = raw.split(/[?#]/, 1)[0] || raw;
  const withoutBase = withoutQuery.startsWith(ESM_NODE_BASE_URL)
    ? withoutQuery.slice(ESM_NODE_BASE_URL.length)
    : withoutQuery;
  const segments = withoutBase.split("/").map((segment) => segment.trim()).filter(Boolean);
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
  cardState.titleElement.textContent = requestUrl || "No ESM URL";
  cardState.titleElement.title = requestUrl || "No ESM URL";
  const zoom = cardState.zoomKey ? `Zoom: ${cardState.zoomKey}` : "Zoom: --";
  const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
  cardState.subtitleElement.textContent = `${zoom} | Rows: ${rows}`;
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
