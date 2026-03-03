const REST_WORKSPACE_MESSAGE_TYPE = "underpar:rest-workspace";

const state = {
  windowId: 0,
  controllerOnline: false,
  restReady: false,
  programmerId: "",
  programmerName: "",
  requestorId: "",
  mvpd: "",
  mvpdLabel: "",
  upstreamUserId: "",
  selectionKey: "",
  loading: false,
  report: null,
  sortRule: {
    col: "",
    dir: "DESC",
  },
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
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

function firstNonEmptyString(values = []) {
  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value ?? "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function normalizeSortDirection(value) {
  return String(value || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC";
}

function formatDateTime(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "N/A";
  }
  try {
    return new Date(numeric).toLocaleString();
  } catch {
    return "N/A";
  }
}

function compareCellValues(leftValue, rightValue) {
  const leftText = String(leftValue ?? "").trim();
  const rightText = String(rightValue ?? "").trim();
  if (!leftText && !rightText) {
    return 0;
  }
  if (!leftText) {
    return -1;
  }
  if (!rightText) {
    return 1;
  }
  const leftNumber = Number(leftText);
  const rightNumber = Number(rightText);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    if (leftNumber < rightNumber) {
      return -1;
    }
    if (leftNumber > rightNumber) {
      return 1;
    }
  }
  return leftText.localeCompare(rightText, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function sortRows(rows = [], sortRule = null) {
  const output = Array.isArray(rows) ? rows.slice() : [];
  const column = String(sortRule?.col || "").trim();
  if (!column) {
    return output;
  }
  const direction = normalizeSortDirection(sortRule?.dir);
  output.sort((left, right) => {
    const order = compareCellValues(left?.[column], right?.[column]);
    return direction === "ASC" ? order : -order;
  });
  return output;
}

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getFilterLabel() {
  const requestor = String(state.requestorId || "").trim();
  const mvpd = String(state.mvpd || "").trim();
  const mvpdLabel = String(state.mvpdLabel || "").trim();
  const upstream = String(state.upstreamUserId || "").trim();
  if (!requestor || !mvpd) {
    return "Select Requestor + MVPD and run SPLUNK from Can I watch?.";
  }
  return `Requestor: ${requestor} | MVPD: ${mvpdLabel || mvpd} | upstreamUserID=${upstream || "N/A"}`;
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  if (!els.status) {
    return;
  }
  const showError = type === "error" && Boolean(text);
  els.status.textContent = showError ? text : "";
  els.status.classList.toggle("error", showError);
  els.status.hidden = !showError;
}

function syncActionButtonsDisabled() {
  const disableRerun = state.loading || !state.report;
  const disableClear = state.loading || !state.report;
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = disableRerun;
    els.rerunAllButton.classList.toggle("net-busy", state.loading);
  }
  if (els.rerunIndicator) {
    els.rerunIndicator.hidden = !state.loading;
  }
  if (els.clearButton) {
    els.clearButton.disabled = disableClear;
  }
}

function updateControllerBanner() {
  if (els.controllerState) {
    els.controllerState.textContent = `REST Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.textContent = getFilterLabel();
  }
  syncActionButtonsDisabled();
}

function applyControllerState(payload = {}) {
  state.controllerOnline = payload?.controllerOnline === true;
  state.restReady = payload?.restReady === true;
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorId = String(payload?.requestorId || "");
  state.mvpd = String(payload?.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || "");
  state.upstreamUserId = String(payload?.upstreamUserId || "");
  state.selectionKey = String(payload?.selectionKey || "");
  updateControllerBanner();
}

function setDefaultSortForReport(report = null) {
  const columns = Array.isArray(report?.columns) ? report.columns.map((value) => String(value || "").trim()).filter(Boolean) : [];
  if (!columns.length) {
    state.sortRule = {
      col: "",
      dir: "DESC",
    };
    return;
  }
  if (columns.includes("_time")) {
    state.sortRule = {
      col: "_time",
      dir: "DESC",
    };
    return;
  }
  const first = String(columns[0] || "").trim();
  state.sortRule = {
    col: first,
    dir: "ASC",
  };
}

function renderNetworkEvents(report = null) {
  const events = Array.isArray(report?.networkEvents) ? report.networkEvents : [];
  if (events.length === 0) {
    return "";
  }
  const rows = events
    .map((event) => {
      const method = String(event?.method || "").trim().toUpperCase() || "GET";
      const status = Number(event?.status || 0);
      const statusText = String(event?.statusText || "").trim();
      const phase = String(event?.phase || "").trim();
      const url = String(event?.url || "").trim();
      const duration = Number(event?.durationMs || 0);
      const summary = `${method} ${url} | HTTP ${status || 0} ${statusText} | ${duration}ms`;
      return `<li class="rest-report-network-item">${escapeHtml(phase ? `${phase}: ${summary}` : summary)}</li>`;
    })
    .join("");
  return `
    <p class="rest-report-network">Network Activity (${events.length} calls)</p>
    <ul class="rest-report-network-list">${rows}</ul>
  `;
}

function renderTable(report = null) {
  const columns = Array.isArray(report?.columns) ? report.columns.map((value) => String(value || "").trim()).filter(Boolean) : [];
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  if (columns.length === 0 || rows.length === 0) {
    return `<p class="rest-report-empty">No Splunk events were returned for this upstreamUserID.</p>`;
  }

  const sortedRows = sortRows(rows, state.sortRule);
  const headerHtml = columns
    .map((columnName) => {
      const normalized = String(columnName || "").trim();
      const isActive = normalized && normalized === state.sortRule.col;
      const direction = normalizeSortDirection(state.sortRule?.dir);
      const glyph = isActive ? (direction === "ASC" ? "▲" : "▼") : "";
      return `
        <th class="${isActive ? "active-sort" : ""}">
          <button type="button" data-sort-col="${escapeHtml(normalized)}">
            <span>${escapeHtml(normalized)}</span>
            <span>${escapeHtml(glyph)}</span>
          </button>
        </th>
      `;
    })
    .join("");

  const bodyHtml = sortedRows
    .map((row) => {
      const cells = columns
        .map((columnName) => {
          const raw = row?.[columnName];
          const value = String(raw == null ? "" : raw);
          return `<td>${escapeHtml(value)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="rest-report-table-wrap">
      <table class="rest-report-table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
  `;
}

function renderReport() {
  if (!els.cardsHost) {
    return;
  }
  const report = state.report;
  if (!report || typeof report !== "object") {
    els.cardsHost.innerHTML = '<article class="rest-report-card"><p class="rest-report-empty">No Splunk report loaded yet.</p></article>';
    return;
  }

  const queryContext = report?.queryContext && typeof report.queryContext === "object" ? report.queryContext : {};
  const mvpdLabel = firstNonEmptyString([queryContext?.mvpdLabel, state.mvpdLabel, state.mvpd]);
  const subtitle = firstNonEmptyString([
    `${String(queryContext?.requestorId || state.requestorId || "").trim()} x ${mvpdLabel}`,
    "Splunk RCA",
  ]);
  const checkedAtLabel = formatDateTime(report?.checkedAt);
  const sid = String(report?.sid || "").trim();
  const rowCount = Number(report?.displayedRows || 0);
  const totalRows = Number(report?.totalRows || 0);
  const rowSummary =
    totalRows > rowCount ? `${rowCount} shown of ${totalRows} rows` : `${rowCount} row${rowCount === 1 ? "" : "s"}`;
  const searchText = String(queryContext?.search || "").trim();
  const queryWindow = `${String(queryContext?.earliest || "").trim() || "N/A"} -> ${String(
    queryContext?.latest || ""
  ).trim() || "N/A"}`;
  const networkMarkup = renderNetworkEvents(report);
  const errorMarkup = report.ok === true ? "" : `<p class="rest-report-empty rest-report-error">${escapeHtml(report.error || "Request failed.")}</p>`;
  const tableMarkup = report.ok === true ? renderTable(report) : "";

  els.cardsHost.innerHTML = `
    <article class="rest-report-card">
      <header class="rest-report-head">
        <p class="rest-report-title">Splunk RCA Report</p>
        <p class="rest-report-subtitle">${escapeHtml(subtitle)}</p>
        <p class="rest-report-query"><strong>Query:</strong> <code>${escapeHtml(searchText || "(empty)")}</code></p>
        <p class="rest-report-meta"><strong>Window:</strong> ${escapeHtml(queryWindow)} | <strong>SID:</strong> ${escapeHtml(
          sid || "N/A"
        )} | <strong>Checked:</strong> ${escapeHtml(checkedAtLabel)} | <strong>Rows:</strong> ${escapeHtml(rowSummary)}</p>
      </header>
      ${networkMarkup}
      ${errorMarkup}
      ${tableMarkup}
    </article>
  `;

  const sortButtons = els.cardsHost.querySelectorAll("[data-sort-col]");
  sortButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const column = String(target?.getAttribute("data-sort-col") || "").trim();
      if (!column) {
        return;
      }
      if (state.sortRule.col === column) {
        state.sortRule.dir = normalizeSortDirection(state.sortRule.dir) === "ASC" ? "DESC" : "ASC";
      } else {
        state.sortRule.col = column;
        state.sortRule.dir = column === "_time" ? "DESC" : "ASC";
      }
      renderReport();
    });
  });
}

function handleReportStart(payload = {}) {
  const selectionKey = String(payload?.selectionKey || "").trim();
  if (selectionKey && state.selectionKey && selectionKey !== state.selectionKey) {
    return;
  }
  state.loading = true;
  syncActionButtonsDisabled();
  setStatus("Running Splunk query...");
}

function handleReportResult(payload = {}) {
  const selectionKey = String(payload?.selectionKey || "").trim();
  if (selectionKey && state.selectionKey && selectionKey !== state.selectionKey) {
    return;
  }
  state.loading = false;
  state.report = payload && typeof payload === "object" ? payload : null;
  if (state.report) {
    const reportSelection = String(state.report?.selectionKey || "").trim();
    if (reportSelection) {
      state.selectionKey = reportSelection;
    }
  }
  if (state.report) {
    setDefaultSortForReport(state.report);
  } else {
    state.sortRule = { col: "", dir: "DESC" };
  }
  renderReport();
  syncActionButtonsDisabled();
  if (!state.report) {
    setStatus("No Splunk data returned.", "error");
    return;
  }
  if (state.report.ok === true) {
    const shown = Number(state.report?.displayedRows || 0);
    const total = Number(state.report?.totalRows || 0);
    setStatus(total > shown ? `Loaded ${shown} of ${total} Splunk rows.` : `Loaded ${shown} Splunk rows.`);
    return;
  }
  setStatus(String(state.report?.error || "Splunk query failed."), "error");
}

function clearWorkspaceCards() {
  state.report = null;
  state.loading = false;
  state.sortRule = {
    col: "",
    dir: "DESC",
  };
  renderReport();
  syncActionButtonsDisabled();
}

function handleWorkspaceEvent(eventName, payload = {}) {
  const event = String(eventName || "").trim();
  if (!event) {
    return;
  }
  if (event === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (event === "report-start") {
    handleReportStart(payload);
    return;
  }
  if (event === "report-result") {
    handleReportResult(payload);
    return;
  }
  if (event === "workspace-clear") {
    clearWorkspaceCards();
    setStatus("");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: REST_WORKSPACE_MESSAGE_TYPE,
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

async function rerunLatestReport() {
  if (state.loading) {
    return;
  }
  if (!state.report) {
    setStatus("No previous Splunk report is available to refresh.", "error");
    return;
  }
  state.loading = true;
  syncActionButtonsDisabled();
  setStatus("Refreshing Splunk report...");
  const result = await sendWorkspaceAction("refresh-latest", {
    selectionKey: String(state.selectionKey || "").trim(),
  });
  if (!result?.ok) {
    state.loading = false;
    syncActionButtonsDisabled();
    setStatus(String(result?.error || "Unable to refresh Splunk report."), "error");
  }
}

function clearWorkspace() {
  clearWorkspaceCards();
  void sendWorkspaceAction("clear-all", {
    selectionKey: String(state.selectionKey || "").trim(),
  });
}

function registerEventHandlers() {
  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void rerunLatestReport();
    });
  }
  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspace();
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== REST_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
  updateControllerBanner();
  renderReport();
  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR REST controller.", "error");
  }
}

void init();
