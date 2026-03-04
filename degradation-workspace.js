const DEGRADATION_WORKSPACE_MESSAGE_TYPE = "underpar:degradation-workspace";

const state = {
  windowId: 0,
  controllerOnline: false,
  degradationReady: false,
  programmerId: "",
  programmerName: "",
  requestorId: "",
  mvpd: "",
  mvpdLabel: "",
  mvpdScopeLabel: "",
  selectionKey: "",
  appGuid: "",
  appName: "",
  reports: [],
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
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

function normalizeReport(report = null) {
  if (!report || typeof report !== "object") {
    return null;
  }
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const columns = Array.isArray(report.columns)
    ? report.columns.map((value) => String(value || "").trim()).filter(Boolean)
    : rows.length > 0
      ? Object.keys(rows[0]).map((value) => String(value || "").trim()).filter(Boolean)
      : [];
  const normalized = {
    ...report,
    reportId: String(report.reportId || "").trim(),
    queryKey: String(report.queryKey || report.reportId || "").trim(),
    endpointTitle: String(report.endpointTitle || report.endpointPath || "DEGRADATION Status").trim(),
    mvpdScopeLabel: String(report.mvpdScopeLabel || "").trim(),
    requestUrl: String(report.requestUrl || "").trim(),
    statusText: String(report.statusText || "").trim(),
    error: String(report.error || "").trim(),
    columns,
    rows,
    rowCount: Number(report.rowCount || rows.length || 0),
    activeCount: Number(report.activeCount || 0),
    status: Number(report.status || 0),
    fetchedAt: Number(report.fetchedAt || 0),
    durationMs: Number(report.durationMs || 0),
    ok: report.ok === true,
    programmerId: String(report.programmerId || "").trim(),
    mvpd: String(report.mvpd || "").trim(),
    apiVersion: String(report.apiVersion || "").trim(),
    selectionKey: String(report.selectionKey || "").trim(),
  };
  return normalized;
}

function normalizeReports(reportList = []) {
  return (Array.isArray(reportList) ? reportList : [])
    .map((item) => normalizeReport(item))
    .filter(Boolean)
    .sort((left, right) => Number(right.fetchedAt || 0) - Number(left.fetchedAt || 0));
}

function getReportIdentity(report = null) {
  return firstNonEmptyString([report?.queryKey, report?.reportId]);
}

function setStatus(message = "", type = "info") {
  if (!els.status) {
    return;
  }
  const text = String(message || "").trim();
  els.status.textContent = text;
  els.status.classList.toggle("success", type === "success");
  els.status.classList.toggle("error", type === "error");
}

function syncActionButtonsDisabled() {
  if (els.clearButton) {
    els.clearButton.disabled = state.reports.length === 0;
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

function getFilterLabel() {
  const requestor = String(state.requestorId || "").trim();
  const mvpdScope = String(state.mvpdScopeLabel || "").trim() || "ALL MVPDs";
  const appName = String(state.appName || state.appGuid || "").trim() || "N/A";
  return `Requestor: ${requestor || "N/A"} | Scope: ${mvpdScope} | App: ${appName}`;
}

function updateControllerBanner() {
  if (els.controllerState) {
    els.controllerState.textContent = `DEGRADATION Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.textContent = getFilterLabel();
  }
  syncActionButtonsDisabled();
}

function applyControllerState(payload = {}) {
  state.controllerOnline = payload?.controllerOnline === true;
  state.degradationReady = payload?.degradationReady === true;
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorId = String(payload?.requestorId || "");
  state.mvpd = String(payload?.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || "");
  state.mvpdScopeLabel = String(payload?.mvpdScopeLabel || "");
  state.selectionKey = String(payload?.selectionKey || state.selectionKey || "");
  state.appGuid = String(payload?.appGuid || "");
  state.appName = String(payload?.appName || "");
  updateControllerBanner();
}

function renderTable(report = null) {
  const columns = Array.isArray(report?.columns) ? report.columns : [];
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  if (columns.length === 0 || rows.length === 0) {
    return '<p class="degradation-report-empty">No rule rows were returned for this request.</p>';
  }

  const headerHtml = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");

  const formatCellValue = (rawValue) => {
    if (rawValue == null) {
      return "N/A";
    }
    if (Array.isArray(rawValue)) {
      const compactValues = rawValue.map((item) => formatCellValue(item)).filter((item) => item && item !== "N/A");
      return compactValues.length > 0 ? compactValues.join(" | ") : "N/A";
    }
    if (typeof rawValue === "object") {
      const preferred = firstNonEmptyString([
        rawValue.id,
        rawValue.name,
        rawValue.label,
        rawValue.value,
        rawValue.status,
        rawValue.message,
      ]);
      return preferred || "Structured value";
    }
    const text = String(rawValue).trim();
    if (!text) {
      return "N/A";
    }
    if (
      (text.startsWith("{") && text.endsWith("}")) ||
      (text.startsWith("[") && text.endsWith("]")) ||
      (text.startsWith("<") && text.endsWith(">"))
    ) {
      return "Structured value";
    }
    return text;
  };

  const bodyHtml = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const raw = row?.[column];
          const value = formatCellValue(raw);
          if (String(column).trim().toLowerCase() === "active") {
            const isActive = value.toUpperCase() === "YES";
            const pillClass = isActive ? "degradation-active-pill" : "degradation-active-pill no";
            const pillLabel = isActive ? "YES" : "NO";
            return `<td><span class="${pillClass}">${pillLabel}</span></td>`;
          }
          return `<td>${escapeHtml(value || "N/A")}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="degradation-report-table-wrap">
      <table class="degradation-report-table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
  `;
}

function renderReportCard(report = null) {
  if (!report || typeof report !== "object") {
    return "";
  }
  const checkedAtLabel = formatDateTime(report.fetchedAt);
  const httpLabel = report.status > 0 ? `HTTP ${report.status} ${report.statusText || ""}`.trim() : "Request Error";
  const requestLine = firstNonEmptyString([
    report.requestUrl,
    `${report.endpointPath || ""}${report.programmerId ? `?programmer=${report.programmerId}` : ""}`,
  ]);
  const rowSummary = report.ok
    ? `${report.activeCount}/${report.rowCount} active rows`
    : "Request failed";
  const errorMarkup = report.ok
    ? ""
    : `<p class="degradation-report-error">${escapeHtml(report.error || "Request failed.")}</p>`;
  return `
    <article class="degradation-report-card">
      <header class="degradation-report-head">
        <div class="degradation-report-title-row">
          <p class="degradation-report-title">${escapeHtml(report.endpointTitle || "DEGRADATION Status")}</p>
          <p class="degradation-report-http ${report.ok ? "" : "error"}">${escapeHtml(httpLabel)}</p>
        </div>
        <p class="degradation-report-subtitle">${escapeHtml(report.mvpdScopeLabel || "ALL MVPDs")}</p>
        <p class="degradation-report-meta">
          <strong>Programmer:</strong> ${escapeHtml(report.programmerId || "N/A")} |
          <strong>Rows:</strong> ${escapeHtml(rowSummary)} |
          <strong>Duration:</strong> ${escapeHtml(String(report.durationMs || 0))}ms |
          <strong>Checked:</strong> ${escapeHtml(checkedAtLabel)}
        </p>
        <p class="degradation-report-url"><strong>GET:</strong> <code>${escapeHtml(requestLine || "N/A")}</code></p>
      </header>
      ${errorMarkup}
      ${report.ok ? renderTable(report) : ""}
    </article>
  `;
}

function renderReports() {
  if (!els.cardsHost) {
    return;
  }
  if (state.reports.length === 0) {
    els.cardsHost.innerHTML =
      '<article class="degradation-report-card"><p class="degradation-report-empty">Run GET status calls from the DEGRADATION sidepanel controller to populate report cards.</p></article>';
    syncActionButtonsDisabled();
    return;
  }
  const cardsMarkup = state.reports.map((report) => renderReportCard(report)).join("");
  els.cardsHost.innerHTML = cardsMarkup;
  syncActionButtonsDisabled();
}

function replaceReports(reportList = []) {
  state.reports = normalizeReports(reportList);
  renderReports();
}

function upsertReport(report = null) {
  const normalized = normalizeReport(report);
  if (!normalized) {
    return;
  }
  const identity = getReportIdentity(normalized);
  const nextReports = [];
  let inserted = false;

  if (identity) {
    nextReports.push(normalized);
    inserted = true;
    state.reports.forEach((existing) => {
      const existingIdentity = getReportIdentity(existing);
      if (!existingIdentity || existingIdentity !== identity) {
        nextReports.push(existing);
      }
    });
  }

  if (!inserted) {
    nextReports.push(normalized, ...state.reports);
  }

  state.reports = normalizeReports(nextReports).slice(0, 30);
  if (normalized.selectionKey) {
    state.selectionKey = normalized.selectionKey;
  }
  renderReports();
}

function clearWorkspaceCards() {
  state.reports = [];
  renderReports();
}

function handleReportsSync(payload = {}) {
  const reports = normalizeReports(payload?.reports);
  const selectionKey = String(payload?.selectionKey || "").trim();
  if (selectionKey) {
    state.selectionKey = selectionKey;
  }
  replaceReports(reports);
  if (reports.length > 0) {
    setStatus(`Loaded ${reports.length} DEGRADATION report card${reports.length === 1 ? "" : "s"}.`, "success");
  } else {
    setStatus("No DEGRADATION report cards are cached for this selection.", "info");
  }
}

function handleReportResult(payload = {}) {
  const report = normalizeReport(payload);
  if (!report) {
    return;
  }
  upsertReport(report);
  if (report.ok) {
    setStatus(`${report.endpointTitle}: loaded ${report.activeCount}/${report.rowCount} active rows.`, "success");
  } else {
    setStatus(`${report.endpointTitle}: ${report.error || "Request failed."}`, "error");
  }
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
  if (event === "reports-sync") {
    handleReportsSync(payload);
    return;
  }
  if (event === "report-result") {
    handleReportResult(payload);
    return;
  }
  if (event === "workspace-clear") {
    clearWorkspaceCards();
    setStatus("DEGRADATION workspace cleared.", "info");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: DEGRADATION_WORKSPACE_MESSAGE_TYPE,
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

function clearWorkspace() {
  clearWorkspaceCards();
  void sendWorkspaceAction("clear-all", {
    selectionKey: String(state.selectionKey || "").trim(),
  });
  setStatus("DEGRADATION workspace cleared.", "info");
}

function registerEventHandlers() {
  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspace();
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== DEGRADATION_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
  renderReports();
  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR DEGRADATION controller.", "error");
  }
}

void init();
