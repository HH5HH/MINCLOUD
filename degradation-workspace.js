const DEGRADATION_WORKSPACE_MESSAGE_TYPE = "underpar:degradation-workspace";

const state = {
  windowId: 0,
  controllerOnline: false,
  adobePassEnvironment: null,
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
  batchRunning: false,
  pendingAutoRerunCards: [],
  pendingAutoRerunSelectionKey: "",
  autoRerunInFlightSelectionKey: "",
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
  pageEnvBadge: document.getElementById("page-env-badge"),
  pageEnvBadgeValue: document.getElementById("page-env-badge-value"),
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

function getEnvironmentKey(environment = null) {
  return String(environment?.key || "").trim();
}

function getWorkspaceEnvironmentRegistry() {
  return globalThis.UnderParEnvironment || null;
}

function resolveWorkspaceAdobePassEnvironment(value = null) {
  const embedded = value && typeof value === "object" && !Array.isArray(value) ? value : null;
  const registry = getWorkspaceEnvironmentRegistry();
  if (embedded) {
    return registry?.getEnvironment ? registry.getEnvironment(embedded.key || embedded) : { ...embedded };
  }
  if (registry?.getEnvironment) {
    return registry.getEnvironment(value || "release-production");
  }
  return {
    key: "release-production",
    label: "Production",
    route: "release-production",
    mgmtBase: "https://mgmt.auth.adobe.com",
    degradationBase: "https://mgmt.auth.adobe.com/control/v3/degradation",
  };
}

function buildWorkspaceEnvironmentTooltip(environment) {
  const resolved = resolveWorkspaceAdobePassEnvironment(environment);
  const registry = getWorkspaceEnvironmentRegistry();
  if (registry?.buildEnvironmentBadgeTooltip) {
    return String(registry.buildEnvironmentBadgeTooltip(resolved, "degradation") || "").trim();
  }
  const route = String(resolved.route || "release-production").trim() || "release-production";
  const label = String(resolved.label || (route === "release-staging" ? "Staging" : "Production")).trim() || "Production";
  const mgmtBase = String(
    resolved.mgmtBase || (route === "release-staging" ? "https://mgmt.auth-staging.adobe.com" : "https://mgmt.auth.adobe.com")
  ).trim();
  const degradationBase = String(resolved.degradationBase || `${mgmtBase}/control/v3/degradation`).trim();
  return [`Environment : ${label}`, `DEGRADATION : ${degradationBase}`].join("\n").trim();
}

function renderWorkspaceEnvironmentBadge() {
  if (!els.pageEnvBadge || !els.pageEnvBadgeValue) {
    return;
  }
  const environment = resolveWorkspaceAdobePassEnvironment(state.adobePassEnvironment);
  const label = String(environment?.label || "").trim() || "Production";
  const title = buildWorkspaceEnvironmentTooltip(environment) || label;
  els.pageEnvBadgeValue.textContent = "";
  els.pageEnvBadgeValue.setAttribute("aria-hidden", "true");
  els.pageEnvBadge.title = title;
  els.pageEnvBadge.setAttribute("aria-label", title);
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

function getReportPayload(report = null) {
  if (!report || typeof report !== "object") {
    return null;
  }
  const mvpd = String(report.mvpd || "").trim();
  return {
    reportId: String(report.reportId || "").trim(),
    queryKey: String(report.queryKey || "").trim(),
    endpointKey: String(report.endpointKey || "").trim().toLowerCase(),
    endpointPath: String(report.endpointPath || "").trim(),
    requestUrl: String(report.requestUrl || "").trim(),
    programmerId: String(report.programmerId || "").trim(),
    mvpd,
    mvpdScopeLabel: String(report.mvpdScopeLabel || "").trim(),
    includeAllMvpd: report?.includeAllMvpd === true || !mvpd,
    selectionKey: String(report.selectionKey || state.selectionKey || "").trim(),
  };
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

async function copyTextToClipboard(text = "") {
  const normalized = String(text || "");
  if (!normalized) {
    return false;
  }

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(normalized);
      return true;
    } catch {
      // continue to fallback
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = normalized;
  textArea.setAttribute("readonly", "readonly");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    textArea.remove();
  }
  return copied;
}

function findReportById(reportId = "") {
  const normalizedId = String(reportId || "").trim();
  if (!normalizedId) {
    return null;
  }
  return state.reports.find((report) => String(report?.reportId || "").trim() === normalizedId) || null;
}

async function copyReportRequestUrl(reportId = "") {
  const report = findReportById(reportId);
  if (!report) {
    return;
  }
  const requestUrl = firstNonEmptyString([report.requestUrl]);
  if (!requestUrl) {
    setStatus("Request URL unavailable for copy.", "error");
    return;
  }
  const copied = await copyTextToClipboard(requestUrl);
  if (copied) {
    setStatus("DEGRADATION request URL copied.", "success");
  } else {
    setStatus("Unable to copy DEGRADATION request URL.", "error");
  }
}

function syncActionButtonsDisabled() {
  const hasCards = state.reports.length > 0;
  const isBusy = state.batchRunning === true;
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isBusy || !hasCards;
    els.rerunAllButton.classList.toggle("net-busy", isBusy);
    els.rerunAllButton.setAttribute("aria-busy", isBusy ? "true" : "false");
    els.rerunAllButton.title = isBusy ? "Re-run all (loading...)" : "Re-run all";
  }
  if (els.rerunIndicator) {
    els.rerunIndicator.hidden = !isBusy;
  }
  if (els.clearButton) {
    els.clearButton.disabled = isBusy || !hasCards;
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
  return `Requestor: ${requestor || "N/A"} | Scope: ${mvpdScope}`;
}

function updateControllerBanner() {
  if (els.controllerState) {
    els.controllerState.textContent = `DEGRADATION Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.textContent = getFilterLabel();
  }
  renderWorkspaceEnvironmentBadge();
  syncActionButtonsDisabled();
}

function getCurrentRerunCards(reportList = state.reports) {
  return (Array.isArray(reportList) ? reportList : [])
    .map((report) => getReportPayload(report))
    .filter((card) => card && card.endpointKey);
}

function clearPendingAutoRerun() {
  state.pendingAutoRerunCards = [];
  state.pendingAutoRerunSelectionKey = "";
  state.autoRerunInFlightSelectionKey = "";
}

function hasWorkspaceRefreshTransition() {
  return state.pendingAutoRerunCards.length > 0 || Boolean(String(state.autoRerunInFlightSelectionKey || "").trim());
}

function queuePendingAutoRerun(nextSelectionKey = "") {
  const cards = getCurrentRerunCards();
  if (cards.length === 0) {
    return false;
  }
  state.pendingAutoRerunCards = cards;
  state.pendingAutoRerunSelectionKey = String(nextSelectionKey || state.selectionKey || "").trim();
  const reportLabel = `${cards.length} report${cards.length === 1 ? "" : "s"}`;
  setStatus(`Refreshing ${reportLabel} for ${getProgrammerLabel()}...`);
  return true;
}

function maybeConsumePendingAutoRerun() {
  if (state.batchRunning || state.controllerOnline !== true || state.degradationReady !== true) {
    return;
  }
  const cards = Array.isArray(state.pendingAutoRerunCards)
    ? state.pendingAutoRerunCards.filter((card) => card && card.endpointKey)
    : [];
  if (cards.length === 0) {
    state.pendingAutoRerunCards = [];
    state.pendingAutoRerunSelectionKey = "";
    return;
  }
  const expectedSelectionKey = String(state.pendingAutoRerunSelectionKey || "").trim();
  const currentSelectionKey = String(state.selectionKey || "").trim();
  if (expectedSelectionKey && currentSelectionKey && expectedSelectionKey !== currentSelectionKey) {
    return;
  }
  const inFlightSelectionKey = expectedSelectionKey || currentSelectionKey;
  state.autoRerunInFlightSelectionKey = inFlightSelectionKey;
  void rerunAllCards({
    cards,
    reason: "manual-reload",
    selectionKey: expectedSelectionKey || currentSelectionKey,
  }).then((started) => {
    if (!started) {
      if (String(state.autoRerunInFlightSelectionKey || "").trim() === inFlightSelectionKey) {
        state.autoRerunInFlightSelectionKey = "";
      }
      return;
    }
    state.pendingAutoRerunCards = [];
    state.pendingAutoRerunSelectionKey = "";
  });
}

function applyControllerState(payload = {}) {
  const previousSelectionKey = String(state.selectionKey || "").trim();
  const previousProgrammerId = String(state.programmerId || "").trim();
  const previousProgrammerName = String(state.programmerName || "").trim();
  const previousEnvironmentKey = getEnvironmentKey(state.adobePassEnvironment);
  const nextEnvironment =
    payload?.adobePassEnvironment && typeof payload.adobePassEnvironment === "object"
      ? {
          ...payload.adobePassEnvironment,
        }
      : state.adobePassEnvironment;
  const nextEnvironmentKey = getEnvironmentKey(nextEnvironment);
  const nextProgrammerId = String(payload?.programmerId || "");
  const nextProgrammerName = String(payload?.programmerName || "");
  const nextSelectionKey = String(payload?.selectionKey || previousSelectionKey || "").trim();
  const selectionChanged = Boolean(previousSelectionKey && nextSelectionKey && previousSelectionKey !== nextSelectionKey);
  const environmentChanged = Boolean(previousEnvironmentKey && nextEnvironmentKey && previousEnvironmentKey !== nextEnvironmentKey);
  const programmerChanged =
    Boolean(previousProgrammerId || previousProgrammerName) &&
    (previousProgrammerId !== String(nextProgrammerId || "").trim() ||
      (previousProgrammerName &&
        nextProgrammerName &&
        previousProgrammerName.toLowerCase() !== String(nextProgrammerName || "").trim().toLowerCase()));

  state.controllerOnline = payload?.controllerOnline === true;
  state.adobePassEnvironment = nextEnvironment;
  state.degradationReady = payload?.degradationReady === true;
  state.programmerId = nextProgrammerId;
  state.programmerName = nextProgrammerName;
  state.requestorId = String(payload?.requestorId || "");
  state.mvpd = String(payload?.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || "");
  state.mvpdScopeLabel = String(payload?.mvpdScopeLabel || "");
  state.selectionKey = nextSelectionKey;
  state.appGuid = String(payload?.appGuid || "");
  state.appName = String(payload?.appName || "");
  if ((selectionChanged || environmentChanged || programmerChanged) && state.reports.length > 0) {
    queuePendingAutoRerun(nextSelectionKey);
  } else if ((selectionChanged || environmentChanged || programmerChanged) && state.reports.length === 0) {
    state.pendingAutoRerunCards = [];
    state.pendingAutoRerunSelectionKey = String(nextSelectionKey || "").trim();
  }
  updateControllerBanner();
  maybeConsumePendingAutoRerun();
}

function getScopeValues(report = null) {
  const requestor = firstNonEmptyString([report?.programmerId, state.requestorId, "N/A"]);
  const scope = firstNonEmptyString([report?.mvpdScopeLabel, report?.mvpd, state.mvpdScopeLabel, "ALL MVPDs"]);
  return {
    requestor,
    scope,
  };
}

function getNoRulesScopeLabel(report = null) {
  const { requestor, scope } = getScopeValues(report);
  return `${requestor} X ${scope}`;
}

function getNoRulesActiveMessage(report = null) {
  return `No rules active for ${getNoRulesScopeLabel(report)}.`;
}

function renderScopeEmphasisHtml(report = null) {
  const { requestor, scope } = getScopeValues(report);
  return `<span class="degradation-report-scope-value">${escapeHtml(requestor)}</span><span class="degradation-report-scope-sep"> X </span><span class="degradation-report-scope-value">${escapeHtml(scope)}</span>`;
}

function renderNoRulesCompactHtml(report = null) {
  const methodLabel = firstNonEmptyString([report?.endpointTitle, "DEGRADATION Status"]);
  return `${escapeHtml(methodLabel)}: No rules active for ${renderScopeEmphasisHtml(report)}.`;
}

function renderTable(report = null) {
  const columns = Array.isArray(report?.columns) ? report.columns : [];
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  if (columns.length === 0 || rows.length === 0) {
    return `<p class="degradation-report-empty">${escapeHtml(getNoRulesActiveMessage(report))}</p>`;
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
  const requestLine = firstNonEmptyString([
    report.requestUrl,
    `${report.endpointPath || ""}${report.programmerId ? `?programmer=${report.programmerId}` : ""}`,
  ]);
  const statusTitle = `GET: ${requestLine || "N/A"}`;
  if (report.ok && Number(report.rowCount || 0) === 0) {
    return `
      <article class="degradation-report-card degradation-report-card--no-active">
        <p class="degradation-report-no-active-line">
          <button
            type="button"
            class="degradation-report-no-active-copy"
            data-action="copy-request-url"
            data-report-id="${escapeHtml(String(report.reportId || ""))}"
            title="${escapeHtml(statusTitle)}"
            aria-label="Copy DEGRADATION request URL to clipboard"
          >${renderNoRulesCompactHtml(report)}</button>
        </p>
      </article>
    `;
  }
  const activeRules = Number(report.activeCount || report.rowCount || 0);
  const activeRuleLabel = `${activeRules} active rule${activeRules === 1 ? "" : "s"}`;
  const programmerScopeHtml = renderScopeEmphasisHtml(report);
  const httpLabel = report.status > 0 ? `HTTP ${report.status} ${report.statusText || ""}`.trim() : "Request Error";
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
        <p class="degradation-report-subtitle">${programmerScopeHtml}</p>
        <p class="degradation-report-meta">${escapeHtml(report.ok ? activeRuleLabel : "Request failed")}</p>
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
    els.cardsHost.innerHTML = "";
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
  if (hasWorkspaceRefreshTransition()) {
    return;
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
    setStatus("", "info");
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
    state.autoRerunInFlightSelectionKey = "";
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
    maybeConsumePendingAutoRerun();
    return;
  }
  if (event === "environment-switch-rerun") {
    if (state.batchRunning) {
      return;
    }
    if (state.pendingAutoRerunCards.length > 0) {
      maybeConsumePendingAutoRerun();
      return;
    }
    if (state.reports.length === 0) {
      return;
    }
    void rerunAllCards({
      reason: "manual-reload",
    });
    return;
  }
  if (event === "workspace-clear") {
    clearPendingAutoRerun();
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
  clearPendingAutoRerun();
  clearWorkspaceCards();
  void sendWorkspaceAction("clear-all", {
    selectionKey: String(state.selectionKey || "").trim(),
  });
  setStatus("DEGRADATION workspace cleared.", "info");
}

async function rerunAllCards(options = {}) {
  if (state.batchRunning) {
    return false;
  }
  const cards = Array.isArray(options?.cards)
    ? options.cards.filter((card) => card && card.endpointKey)
    : getCurrentRerunCards();
  if (cards.length === 0) {
    setStatus("No reports are open.");
    return false;
  }

  state.batchRunning = true;
  syncActionButtonsDisabled();
  const reason = String(options?.reason || "manual-reload").trim().toLowerCase();
  if (reason === "manual-reload") {
    setStatus(`Reloading ${cards.length} report(s)...`);
  } else {
    setStatus(`Re-running ${cards.length} report(s)...`);
  }
  const result = await sendWorkspaceAction("rerun-all", {
    cards,
    reason,
    selectionKey: String(options?.selectionKey || state.selectionKey || "").trim(),
  });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
    return false;
  }
  return true;
}

function registerEventHandlers() {
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
  if (els.cardsHost) {
    els.cardsHost.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const copyUrlTrigger = event.target.closest('button[data-action="copy-request-url"]');
      if (!(copyUrlTrigger instanceof HTMLButtonElement)) {
        return;
      }
      event.preventDefault();
      void copyReportRequestUrl(String(copyUrlTrigger.getAttribute("data-report-id") || "").trim());
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
