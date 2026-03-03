const MVPD_MESSAGE_TYPE = "underpar:mvpd-workspace";
const WORKSPACE_TEARSHEET_PAYLOAD_ID = "clickmvpdws-payload";
const CM_WORKSPACE_TEARSHEET_PAYLOAD_ID = "clickcmuws-payload";
const WORKSPACE_TEARSHEET_RUNTIME_PATH = "cm-workspace.js";
const WORKSPACE_TEARSHEET_TEMPLATE_PATH = "cm-workspace.html";
const CM_WORKSPACE_RUNTIME_TOKEN_INPUT_NAME = "access_token";
const CM_WORKSPACE_RUNTIME_CLIENT_IDS_INPUT_NAME = "cm_client_ids";
const CM_WORKSPACE_RUNTIME_USER_ID_INPUT_NAME = "cm_user_id";
const CM_WORKSPACE_RUNTIME_SCOPE_INPUT_NAME = "cm_scope";
const CM_WORKSPACE_IMS_DEFAULT_SCOPE =
  "AdobeID,openid,dma_group_mapping,read_organizations,additional_info.projectedProductContext";
const CM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
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
  "v2",
  "view",
  "activity-level",
  "activity_level",
]);
const CM_TENANT_QUERY_PARAM_KEYS = ["tenant", "tenant_id", "tenant-id"];

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
const IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME = Boolean(workspaceExportPayload);

const state = {
  windowId: 0,
  controllerOnline: false,
  mvpdReady: false,
  hasMvpdCmTenant: false,
  mvpdCmTenantScope: "",
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  mvpdLabel: "",
  requestorMvpdLabel: "",
  resolvedIntegration: "",
  integrationRef: "",
  integrationRecordUrl: "",
  expectedSelectionKey: "",
  loading: false,
  batchRunning: false,
  workspaceLocked: false,
  snapshot: null,
  cmCardsById: new Map(),
  cardsById: new Map(),
  profileHarvest: null,
  profileHarvestList: [],
};
let cardIdentity = 0;

const els = {
  stylesheet: document.getElementById("workspace-style-link"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  makeClickMvpdButton: document.getElementById("workspace-make-clickmvpd"),
  makeClickMvpdWorkspaceButton: document.getElementById("workspace-make-clickmvpdws"),
  makeClickCmuButton: document.getElementById("workspace-make-clickmvpd"),
  makeClickCmuWorkspaceButton: document.getElementById("workspace-make-clickmvpdws"),
  rerunIndicator: document.getElementById("workspace-rerun-indicator"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
};

state.cardsById = state.cmCardsById;

let workspaceStylesheetTextCache = "";
let workspaceTearsheetRuntimeTextCache = "";
let workspaceTearsheetTemplateTextCache = "";

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
    const text = String(value || "").trim();
    if (!text) {
      return;
    }
    const key = text.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(text);
  });
  return output;
}

function upsertBodyHiddenInput(doc, name, value) {
  const normalizedName = String(name || "").trim();
  if (!doc?.body || !normalizedName) {
    return;
  }
  let input = doc.body.querySelector(`input[type="hidden"][name="${normalizedName}"]`);
  if (!input) {
    input = doc.createElement("input");
    input.type = "hidden";
    input.name = normalizedName;
    doc.body.append(input);
  }
  input.value = String(value || "");
}

function truncateDisplayText(value, limit = 240) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function tryParseJsonText(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }
  const looksLikeJson =
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"));
  if (!looksLikeJson) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function formatPrimitiveForErrorLine(value) {
  if (value == null) {
    return "null";
  }
  if (typeof value === "string") {
    return truncateDisplayText(value, 280);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return truncateDisplayText(JSON.stringify(value), 280);
}

function collectPrettyErrorLines(value, output, path = "", depth = 0, maxLines = 28) {
  if (!Array.isArray(output) || output.length >= maxLines || depth > 6) {
    return;
  }
  if (value == null || typeof value !== "object") {
    const label = path || "detail";
    output.push(`${label}: ${formatPrimitiveForErrorLine(value)}`);
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      output.push(`${path || "detail"}: [empty]`);
      return;
    }
    const primitivesOnly = value.every((entry) => entry == null || ["string", "number", "boolean"].includes(typeof entry));
    if (primitivesOnly) {
      const joined = value.map((entry) => formatPrimitiveForErrorLine(entry)).join(", ");
      output.push(`${path || "detail"}: ${truncateDisplayText(joined, 280)}`);
      return;
    }
    value.forEach((entry, index) => {
      if (output.length >= maxLines) {
        return;
      }
      const nextPath = path ? `${path}[${index}]` : `item[${index}]`;
      collectPrettyErrorLines(entry, output, nextPath, depth + 1, maxLines);
    });
    return;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    output.push(`${path || "detail"}: [empty]`);
    return;
  }
  entries.forEach(([key, entryValue]) => {
    if (output.length >= maxLines) {
      return;
    }
    const nextPath = path ? `${path}.${key}` : key;
    collectPrettyErrorLines(entryValue, output, nextPath, depth + 1, maxLines);
  });
}

function buildPrettyErrorLines(call) {
  const lines = [];
  const structuredPayload = call?.errorPayload && typeof call.errorPayload === "object" ? call.errorPayload : null;
  if (structuredPayload) {
    collectPrettyErrorLines(structuredPayload, lines);
  }
  if (lines.length === 0) {
    const parsedFromError = tryParseJsonText(call?.error || "");
    if (parsedFromError && typeof parsedFromError === "object") {
      collectPrettyErrorLines(parsedFromError, lines);
    }
  }
  if (lines.length === 0) {
    const parsedFromBody = tryParseJsonText(call?.errorBody || "");
    if (parsedFromBody && typeof parsedFromBody === "object") {
      collectPrettyErrorLines(parsedFromBody, lines);
    }
  }
  if (lines.length === 0) {
    const fallback = firstNonEmptyString([call?.error, call?.errorBody]);
    if (fallback) {
      lines.push(truncateDisplayText(fallback, 360));
    }
  }
  if (lines.length > 28) {
    return [...lines.slice(0, 28), "detail: [truncated]"];
  }
  return lines;
}

function renderApiCallErrorCell(call) {
  const lines = buildPrettyErrorLines(call);
  if (lines.length === 0) {
    return "";
  }
  return `<div class="mvpd-error-pretty">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
}

function sanitizeAnchorToken(value, fallback = "details") {
  const token = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return token || String(fallback || "details");
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

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getSelectedRequestorId() {
  return String(state.requestorIds[0] || "").trim();
}

function getSelectedMvpdId() {
  return String(state.mvpdIds[0] || "").trim();
}

function getSelectedMvpdLabel() {
  return String(state.mvpdLabel || "").trim();
}

function getSelectionKey(programmerId = state.programmerId, requestorId = getSelectedRequestorId(), mvpdId = getSelectedMvpdId()) {
  const programmer = String(programmerId || "").trim();
  const requestor = String(requestorId || "").trim();
  const mvpd = String(mvpdId || "").trim();
  if (!programmer || !requestor || !mvpd) {
    return "";
  }
  return `${programmer}|${requestor}|${mvpd}`;
}

function resolvePayloadMvpdLabel(payload = null) {
  const labels = Array.isArray(payload?.mvpdLabels)
    ? payload.mvpdLabels.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  return firstNonEmptyString([payload?.mvpdLabel, labels[0], payload?.snapshot?.mvpdLabel]);
}

function getPayloadSelectionKey(payload = null) {
  const programmerId = String(payload?.programmerId || payload?.snapshot?.programmerId || "").trim();
  const requestorId = String(payload?.requestorId || payload?.snapshot?.requestorId || "").trim();
  const mvpdId = String(payload?.mvpdId || payload?.snapshot?.mvpdId || "").trim();
  return getSelectionKey(programmerId, requestorId, mvpdId);
}

function payloadMatchesCurrentSelection(payload = null) {
  const expectedSelectionKey = String(state.expectedSelectionKey || "").trim();
  const payloadSelectionKey = getPayloadSelectionKey(payload);
  if (expectedSelectionKey && payloadSelectionKey) {
    return expectedSelectionKey === payloadSelectionKey;
  }
  const activeProgrammer = String(state.programmerId || "").trim();
  const activeRequestor = getSelectedRequestorId();
  const activeMvpd = getSelectedMvpdId();
  const payloadProgrammer = String(payload?.programmerId || payload?.snapshot?.programmerId || "").trim();
  const payloadRequestor = String(payload?.requestorId || payload?.snapshot?.requestorId || "").trim();
  const payloadMvpd = String(payload?.mvpdId || payload?.snapshot?.mvpdId || "").trim();
  if (activeProgrammer && payloadProgrammer && activeProgrammer !== payloadProgrammer) {
    return false;
  }
  if (!payloadRequestor || !payloadMvpd) {
    return true;
  }
  if (!activeRequestor || !activeMvpd) {
    return true;
  }
  return activeRequestor === payloadRequestor && activeMvpd === payloadMvpd;
}

function sanitizeHttpUrl(urlValue = "") {
  const text = String(urlValue || "").trim();
  if (!text) {
    return "";
  }
  try {
    const parsed = new URL(text);
    const protocol = String(parsed.protocol || "").toLowerCase();
    if (protocol === "http:" || protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Ignore parse errors.
  }
  return "";
}

function getActiveIntegrationRef() {
  return firstNonEmptyString([
    state.resolvedIntegration,
    state.integrationRef,
    state.snapshot?.resolvedIntegration,
    state.snapshot?.integrationRef,
  ]);
}

function getActiveIntegrationRecordUrl() {
  return sanitizeHttpUrl(
    firstNonEmptyString([
      state.integrationRecordUrl,
      state.snapshot?.integrationRecordUrl,
    ])
  );
}

function getRequestorMvpdLabel() {
  return firstNonEmptyString([
    state.requestorMvpdLabel,
    state.snapshot?.requestorMvpdLabel,
  ]);
}

function buildSelectionQueueMarkup() {
  const requestor = getSelectedRequestorId();
  const mvpd = getSelectedMvpdId();
  const mvpdLabel = getSelectedMvpdLabel() || mvpd;
  if (!requestor || !mvpd) {
    return '<span class="workspace-filter-empty">Select Requestor + MVPD in UnderPAR to load details.</span>';
  }

  const queue = [
    `<span class="workspace-filter-pill workspace-filter-pill--mvpd"><span class="workspace-filter-pill-key">MVPD</span><span class="workspace-filter-pill-value">${escapeHtml(
      mvpdLabel
    )}</span></span>`,
    `<span class="workspace-filter-pill"><span class="workspace-filter-pill-key">RequestorId</span><span class="workspace-filter-pill-value">${escapeHtml(
      requestor
    )}</span></span>`,
  ];

  const relationLabel = getRequestorMvpdLabel();
  if (relationLabel) {
    queue.push(
      `<span class="workspace-filter-pill workspace-filter-pill--relation"><span class="workspace-filter-pill-key">Linkage</span><span class="workspace-filter-pill-value">${escapeHtml(
        relationLabel
      )}</span></span>`
    );
  }

  const integrationRef = getActiveIntegrationRef();
  const integrationRecordUrl = getActiveIntegrationRecordUrl();
  if (integrationRef && integrationRecordUrl) {
    queue.push(
      `<a class="workspace-filter-link" href="${escapeHtml(
        integrationRecordUrl
      )}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(
        integrationRef
      )} record">${escapeHtml(integrationRef)}</a>`
    );
  } else if (integrationRef) {
    queue.push(
      `<span class="workspace-filter-pill workspace-filter-pill--integration"><span class="workspace-filter-pill-key">Integration</span><span class="workspace-filter-pill-value">${escapeHtml(
        integrationRef
      )}</span></span>`
    );
  }

  return `<span class="workspace-filter-queue">${queue.join("")}</span>`;
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  if (!els.status) {
    return;
  }
  const showMessage = Boolean(text);
  const showError = type === "error" && showMessage;
  els.status.textContent = showMessage ? text : "";
  els.status.classList.toggle("error", showError);
  els.status.hidden = !showMessage;
}

function hasSelectionContext() {
  return Boolean(String(state.programmerId || "").trim()) && Boolean(getSelectedRequestorId()) && Boolean(getSelectedMvpdId());
}

function hasMvpdCmExportContext() {
  return hasSelectionContext() && state.hasMvpdCmTenant === true && Boolean(String(state.mvpdCmTenantScope || "").trim());
}

function isWorkspaceNetworkBusy() {
  if (state.loading === true || state.batchRunning === true) {
    return true;
  }
  if (!(state.cmCardsById instanceof Map)) {
    return false;
  }
  for (const cardState of state.cmCardsById.values()) {
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
  const hasSelection = hasSelectionContext();
  const hasMvpdCm = hasMvpdCmExportContext();
  const hasSnapshot = Boolean(state.snapshot);
  const hasCmuCards =
    state.cmCardsById instanceof Map &&
    [...state.cmCardsById.values()].some((entry) => Boolean(getCardBaseRequestUrl(entry) || entry?.requestUrl || entry?.endpointUrl));
  const disableReference = isWorkspaceNetworkBusy() || !hasMvpdCm;
  const disableWorkspaceTearsheet = isWorkspaceNetworkBusy() || !hasMvpdCm || !hasCmuCards;
  const disableRefresh = isWorkspaceNetworkBusy() || !hasSelection;
  const disableClear = isWorkspaceNetworkBusy() || !hasSnapshot;
  if (els.makeClickMvpdButton) {
    els.makeClickMvpdButton.disabled = disableReference;
  }
  if (els.makeClickMvpdWorkspaceButton) {
    els.makeClickMvpdWorkspaceButton.disabled = disableWorkspaceTearsheet;
  }
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = disableRefresh;
  }
  if (els.clearButton) {
    els.clearButton.disabled = disableClear;
  }
  if (IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME) {
    if (els.makeClickMvpdButton) {
      els.makeClickMvpdButton.disabled = true;
    }
    if (els.makeClickMvpdWorkspaceButton) {
      els.makeClickMvpdWorkspaceButton.disabled = true;
    }
    if (els.rerunAllButton) {
      els.rerunAllButton.disabled = true;
    }
    if (els.clearButton) {
      els.clearButton.disabled = true;
    }
  }
  syncWorkspaceNetworkIndicator();
}

function syncTearsheetButtonsVisibility() {
  const isVisible = hasMvpdCmExportContext();
  if (els.makeClickMvpdButton) {
    els.makeClickMvpdButton.hidden = !isVisible || IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME;
  }
  if (els.makeClickMvpdWorkspaceButton) {
    els.makeClickMvpdWorkspaceButton.hidden = !isVisible || IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME;
  }
}

function updateControllerBanner() {
  if (els.controllerState) {
    const selectedMvpdLabel = getSelectedMvpdLabel() || getSelectedMvpdId();
    els.controllerState.textContent = selectedMvpdLabel
      ? `Selected MVPD: ${selectedMvpdLabel} | ${getProgrammerLabel()}`
      : `MVPD Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.innerHTML = buildSelectionQueueMarkup();
  }
  syncTearsheetButtonsVisibility();
  syncActionButtonsDisabled();
}

function clearWorkspaceCards() {
  if (els.cardsHost) {
    els.cardsHost.innerHTML = "";
  }
  cardIdentity = 0;
  state.batchRunning = false;
  state.snapshot = null;
  state.cmCardsById.clear();
  syncActionButtonsDisabled();
}

function setCardCollapsed(article, head, body, toggleButton, collapsed) {
  const isCollapsed = Boolean(collapsed);
  article.classList.toggle("is-collapsed", isCollapsed);
  if (body) {
    body.hidden = isCollapsed;
  }
  if (head) {
    head.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  }
  if (toggleButton) {
    toggleButton.setAttribute("aria-label", isCollapsed ? "Expand section" : "Collapse section");
    toggleButton.title = isCollapsed ? "Expand section" : "Collapse section";
  }
}

function createCard(title, subtitle = "", options = {}) {
  const cardId = `mvpd-card-body-${++cardIdentity}`;
  const article = document.createElement("article");
  article.className = "mvpd-card";
  const anchorId = String(options?.anchorId || "").trim();
  if (anchorId) {
    article.id = anchorId;
  }
  article.innerHTML = `
    <div class="mvpd-card-head" role="button" tabindex="0" aria-expanded="true" aria-controls="${escapeHtml(cardId)}">
      <div class="mvpd-card-head-copy">
        <p class="mvpd-card-title">${escapeHtml(title)}</p>
        <p class="mvpd-card-subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <button type="button" class="mvpd-card-toggle" aria-label="Collapse section" title="Collapse section">
        <span class="mvpd-card-toggle-icon" aria-hidden="true">▾</span>
      </button>
    </div>
    <div class="mvpd-card-body" id="${escapeHtml(cardId)}"></div>
  `;
  const head = article.querySelector(".mvpd-card-head");
  const body = article.querySelector(".mvpd-card-body");
  const toggleButton = article.querySelector(".mvpd-card-toggle");
  const toggle = () => {
    setCardCollapsed(article, head, body, toggleButton, !article.classList.contains("is-collapsed"));
  };
  head?.addEventListener("click", () => {
    toggle();
  });
  head?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    toggle();
  });
  toggleButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle();
  });
  // MVPD workspace defaults all containers to collapsed for faster scanning.
  setCardCollapsed(article, head, body, toggleButton, options.collapsed !== false);
  return {
    article,
    body,
  };
}

function textContainsTms(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return false;
  }
  return text.includes("tmsid") || text.includes("tms ids") || text.includes("tmsidmap") || /\btms\b/i.test(text);
}

function entryContainsTms(entry) {
  return (
    textContainsTms(entry?.source) ||
    textContainsTms(entry?.path) ||
    textContainsTms(entry?.key) ||
    textContainsTms(entry?.value)
  );
}

function sectionContainsTms(section) {
  if (textContainsTms(section?.id) || textContainsTms(section?.title)) {
    return true;
  }
  return Array.isArray(section?.entries) && section.entries.some((entry) => entryContainsTms(entry));
}

function sampleContainsTms(sample) {
  if (textContainsTms(sample?.key) || textContainsTms(sample?.label)) {
    return true;
  }
  return Array.isArray(sample?.entries) && sample.entries.some((entry) => entryContainsTms(entry));
}

function renderOverviewCard(snapshot) {
  const { article, body } = createCard("Selection Overview", "Active MVPD detail context");
  const overview = Array.isArray(snapshot?.overview) ? snapshot.overview : [];
  const rows = overview
    .map((item) => {
      const label = String(item?.label || "").trim();
      const value = String(item?.value || "").trim();
      if (!label) {
        return "";
      }
      return `
        <p class="mvpd-grid-key">${escapeHtml(label)}</p>
        <p class="mvpd-grid-value">${escapeHtml(value || "N/A")}</p>
      `;
    })
    .filter(Boolean)
    .join("");
  body.innerHTML = rows ? `<div class="mvpd-grid">${rows}</div>` : '<p class="mvpd-empty">No overview details available.</p>';
  return article;
}

function renderCallSummaryCard(snapshot, callLinkByKey = new Map()) {
  const calls = Array.isArray(snapshot?.calls) ? snapshot.calls : [];
  const { article, body } = createCard("API Call Summary", "All API results displayed below");
  if (calls.length === 0) {
    body.innerHTML = '<p class="mvpd-empty">No call metadata available.</p>';
    return article;
  }
  const getCallLabel = (call) => String(call?.label || call?.key || "Call").trim() || "Call";
  const sortedCalls = [...calls].sort((left, right) =>
    getCallLabel(left).localeCompare(getCallLabel(right), undefined, {
      sensitivity: "base",
      numeric: true,
    })
  );
  const rows = sortedCalls
    .map((call) => {
      const statusText = call?.ok ? String(call?.status || "OK") : "ERR";
      const urlText = firstNonEmptyString([call?.url, call?.requestUrl, call?.label]);
      const callLabel = getCallLabel(call);
      const callKey = String(call?.key || "").trim();
      const targetCardId = String(callLinkByKey.get(callKey) || "").trim();
      const callCell = targetCardId
        ? `<a href="#${escapeHtml(targetCardId)}" class="mvpd-call-link" data-target-card-id="${escapeHtml(
            targetCardId
          )}">${escapeHtml(callLabel)}</a>`
        : escapeHtml(callLabel);
      const errorCell = renderApiCallErrorCell(call);
      return `
        <tr>
          <td>${callCell}</td>
          <td>${escapeHtml(statusText)}</td>
          <td>${escapeHtml(String(call?.durationMs || 0))}</td>
          <td>${escapeHtml(urlText)}</td>
          <td>${errorCell}</td>
        </tr>
      `;
    })
    .join("");
  body.innerHTML = `
    <div class="mvpd-table-wrap">
      <table class="mvpd-table">
        <thead>
          <tr>
            <th>Call</th>
            <th>Status</th>
            <th>ms</th>
            <th>Resolved URL</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  body.querySelectorAll(".mvpd-call-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetCardId = String(link.getAttribute("data-target-card-id") || "").trim();
      if (!targetCardId) {
        return;
      }
      event.preventDefault();
      const targetCard = document.getElementById(targetCardId);
      if (!targetCard) {
        return;
      }
      const head = targetCard.querySelector(".mvpd-card-head");
      const cardBody = targetCard.querySelector(".mvpd-card-body");
      const toggleButton = targetCard.querySelector(".mvpd-card-toggle");
      if (targetCard.classList.contains("is-collapsed")) {
        setCardCollapsed(targetCard, head, cardBody, toggleButton, false);
      }
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      targetCard.classList.add("is-jump-target");
      window.setTimeout(() => {
        targetCard.classList.remove("is-jump-target");
      }, 900);
    });
  });
  return article;
}

function renderChipCard(title, subtitle, chips = []) {
  const { article, body } = createCard(title, subtitle);
  const values = Array.isArray(chips)
    ? chips
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    : [];
  if (values.length === 0) {
    body.innerHTML = '<p class="mvpd-empty">No values found.</p>';
    return article;
  }
  body.innerHTML = `<div class="mvpd-chip-cloud">${values
    .map((value) => `<span class="mvpd-chip">${escapeHtml(value)}</span>`)
    .join("")}</div>`;
  return article;
}

function renderEntriesCard(title, subtitle, entries = [], options = {}) {
  const rows = (Array.isArray(entries) ? entries : [])
    .map((entry) => {
      const source = String(entry?.source || "").trim();
      const path = String(entry?.path || entry?.key || "").trim();
      const value = String(entry?.value || "").trim();
      if (!path && !value) {
        return "";
      }
      return `
        <tr>
          <td>${escapeHtml(source)}</td>
          <td>${escapeHtml(path)}</td>
          <td>${escapeHtml(value)}</td>
        </tr>
      `;
    })
    .filter(Boolean)
    .join("");
  const { article, body } = createCard(title, subtitle, {
    anchorId: String(options?.anchorId || "").trim(),
  });
  if (!rows) {
    body.innerHTML = '<p class="mvpd-empty">No entries found.</p>';
    return article;
  }
  body.innerHTML = `
    <div class="mvpd-table-wrap">
      <table class="mvpd-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Path</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
  return article;
}

function getMvpdCmSelectionKey() {
  const programmerId = String(state.programmerId || "").trim();
  const requestorId = String(getSelectedRequestorId() || "").trim();
  const mvpdId = String(getSelectedMvpdId() || "").trim();
  if (!programmerId || !requestorId || !mvpdId) {
    return "";
  }
  return `${programmerId}|${requestorId}|${mvpdId}`;
}

function payloadMatchesCurrentMvpdCmSelection(payload = null) {
  const activeSelectionKey = getMvpdCmSelectionKey();
  if (!activeSelectionKey) {
    return true;
  }
  const payloadProgrammerId = String(payload?.programmerId || "").trim();
  const payloadRequestorId = String(payload?.requestorId || "").trim();
  const payloadMvpdId = String(payload?.mvpdId || "").trim();
  if (!payloadProgrammerId || !payloadRequestorId || !payloadMvpdId) {
    return true;
  }
  return `${payloadProgrammerId}|${payloadRequestorId}|${payloadMvpdId}` === activeSelectionKey;
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
      state.mvpdCmTenantScope,
      state.programmerId,
      cardPayload?.tenantName,
      cardState?.tenantName,
    ])
  );
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
  if (parts.length === 0 || !parts.includes("year") || !parts.includes("tenant")) {
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

const CM_WORKSPACE_ROW_FLATTEN_MAX_DEPTH = 4;
const CM_WORKSPACE_ROW_ARRAY_FIELD_LIMIT = 8;
const CM_WORKSPACE_ROW_PREVIEW_LIMIT = 6;
const CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT = 1400;

function truncateCmRowText(value, limit = CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT) {
  const text = String(value == null ? "" : value);
  const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT;
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, Math.max(0, max - 1))}...`;
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
  return truncateCmRowText(label ? `${label} | ${preview}${more}` : `${preview}${more}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
}

function summarizeArrayRowValue(value) {
  if (!Array.isArray(value)) {
    return normalizeRowValue(value);
  }
  if (value.length === 0) {
    return "";
  }
  if (value.every((item) => isPrimitiveRowValue(item))) {
    return truncateCmRowText(
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
  return truncateCmRowText(
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
      return truncateCmRowText(
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
  return truncateCmRowText(String(value), CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
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
          row[`${key}.${field}`] = truncateCmRowText(`${preview}${overflow}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
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

function getDefaultCmuUsageSortStack() {
  return [{ col: "DATE", dir: "DESC" }];
}

function buildDefaultSortStack(headers = [], options = {}) {
  const normalizedHeaders = Array.isArray(headers) ? headers.map((header) => String(header || "").trim()).filter(Boolean) : [];
  if (options?.cmuUsage === true && options?.hasDate === true && normalizedHeaders.includes("DATE")) {
    return getDefaultCmuUsageSortStack();
  }
  return normalizedHeaders.length > 0 ? [{ col: normalizedHeaders[0], dir: "DESC" }] : [];
}

function getDefaultSortStackForCard(cardState) {
  return isCmuUsageCard(cardState) ? getDefaultCmuUsageSortStack() : [];
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
  actionLink.title = "Load details in MVPD Workspace";
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

function renderTableBody(tableState) {
  if (tableState?.mode === "cmu-usage") {
    renderCmuUsageTableBody(tableState);
    return;
  }
  renderGenericTableBody(tableState);
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
    tenantId: String(cardState?.tenantId || getSelectedMvpdId() || ""),
    tenantName: String(cardState?.tenantName || getSelectedMvpdLabel() || getSelectedMvpdId() || ""),
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

function renderCmReportCardMessage(cardState, message, options = {}) {
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
  const normalized = {
    baseUrl: String(source.baseUrl || "https://streams-stage.adobeprimetime.com").trim() || "https://streams-stage.adobeprimetime.com",
    idp: firstNonEmptyString([source.idp, getSelectedMvpdId() || ""]),
    subject: firstNonEmptyString([source.subject, getSelectedRequestorId() || ""]),
    session: String(source.session || "").trim(),
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
    renderCmReportCardMessage(cardState, "CM V2 operation details are unavailable.", { error: true });
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
      renderCmReportCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
  });
}

function createCmReportCardElements(cardState) {
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
  const nextCardPayload = {
    cardId: buildWorkspaceCardId("path"),
    endpointUrl: targetEndpointUrl,
    requestUrl: resolvedRequestUrl,
    baseRequestUrl: resolvedRequestUrl,
    zoomKey: String(cardState?.zoomKey || ""),
    columns: Array.isArray(cardState?.columns) ? cardState.columns.map((column) => String(column || "")).filter(Boolean) : [],
    tenantId: String(cardState?.tenantId || getSelectedMvpdId() || ""),
    tenantName: String(cardState?.tenantName || getSelectedMvpdLabel() || getSelectedMvpdId() || ""),
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
  if (!state.workspaceLocked) {
    return true;
  }
  setStatus("MVPD workspace is locked.", "error");
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
      renderCmReportCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
    return;
  }
  const result = await sendWorkspaceAction("run-card", {
    card: getCardPayload(cardState),
  });
  if (!result?.ok) {
    renderCmReportCardMessage(cardState, result?.error || "Unable to run report from UnderPAR CM controller.", { error: true });
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

function renderCardTable(cardState, rows, lastModified) {
  const normalizedRows = normalizeRows(rows);
  if (normalizedRows.length === 0) {
    renderCmReportCardMessage(cardState, "No data");
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
      const csvPayload = usageCard
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
      renderCmReportCardMessage(cardState, "Table closed.");
    });
  }

  wireCardRerunAndFilterActions(cardState);
  tableState.data = sortRows(tableState.data, tableState.sortStack, tableState.context);
  renderTableBody(tableState);
  updateTableWrapperViewport(tableState);
  refreshHeaderStates(tableState);
  cardState.sortStack = tableState.sortStack;
}

function ensureCmReportCard(cardMeta = {}) {
  const cardId = String(cardMeta?.cardId || "").trim();
  if (!cardId || !els.cardsHost) {
    return null;
  }

  if (state.cmCardsById.has(cardId)) {
    const existing = state.cmCardsById.get(cardId);
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
    tenantId: String(cardMeta?.tenantId || state.mvpdCmTenantScope || getSelectedMvpdId() || ""),
    tenantName: String(cardMeta?.tenantName || cardMeta?.tenantId || getSelectedMvpdLabel() || getSelectedMvpdId() || ""),
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
  createCmReportCardElements(cardState);
  cardState.localColumnFilters = normalizeCmLocalColumnFilters(cardMeta?.localColumnFilters, cardState);
  updateCardHeader(cardState);
  renderCmReportCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    if (typeof cardState.pickerOutsidePointerHandler === "function") {
      document.removeEventListener("pointerdown", cardState.pickerOutsidePointerHandler, true);
    }
    if (typeof cardState.pickerOutsideKeyHandler === "function") {
      document.removeEventListener("keydown", cardState.pickerOutsideKeyHandler, true);
    }
    cardState.element?.remove();
    state.cmCardsById.delete(cardState.cardId);
    syncActionButtonsDisabled();
  });

  state.cmCardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  syncActionButtonsDisabled();
  return cardState;
}

function renderMvpdCmReportStart(payload = {}) {
  if (!payloadMatchesCurrentMvpdCmSelection(payload)) {
    return;
  }
  const cardState = ensureCmReportCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = true;
  cardState.rows = [];
  cardState.sourceRows = [];
  cardState.sortStack = getDefaultSortStackForCard(cardState);
  updateCardHeader(cardState);
  renderCmReportCardMessage(cardState, "Loading report...");
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  syncActionButtonsDisabled();
}

function renderMvpdCmReportForm(payload = {}) {
  if (!payloadMatchesCurrentMvpdCmSelection(payload)) {
    return;
  }
  const cardState = ensureCmReportCard(payload);
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

function renderMvpdCmReportResult(payload = {}) {
  if (!payloadMatchesCurrentMvpdCmSelection(payload)) {
    return;
  }
  const cardState = ensureCmReportCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = false;

  if (!payload?.ok) {
    const error = payload?.error || "Request failed.";
    renderCmReportCardMessage(cardState, error, { error: true });
    setStatus(error, "error");
    syncActionButtonsDisabled();
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
    renderCmReportCardMessage(cardState, "No data");
    syncActionButtonsDisabled();
    return;
  }

  renderCardTable(cardState, filteredRows, cardState.lastModified);
  syncActionButtonsDisabled();
}

function renderSnapshot(snapshot) {
  if (!els.cardsHost) {
    return;
  }
  els.cardsHost.innerHTML = "";
  state.cmCardsById.clear();

  const tmsCards = [];
  const regularCards = [];
  let selectedMvpdMatchesCard = null;
  let samlMetadataSettingsCard = null;
  const callLinkByKey = new Map();
  const usedAnchorIds = new Set();
  const reserveCardAnchorId = (seed, fallback = "details") => {
    const safeBase = `mvpd-details-${sanitizeAnchorToken(seed, fallback)}`;
    let candidate = safeBase;
    let suffix = 2;
    while (usedAnchorIds.has(candidate)) {
      candidate = `${safeBase}-${suffix}`;
      suffix += 1;
    }
    usedAnchorIds.add(candidate);
    return candidate;
  };

  const sections = Array.isArray(snapshot?.sections) ? snapshot.sections : [];
  sections.forEach((section) => {
    const title = String(section?.title || "").trim();
    if (!title) {
      return;
    }
    const entries = Array.isArray(section?.entries) ? section.entries : [];
    const subtitle = `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`;
    const card = renderEntriesCard(title, subtitle, entries, {
      anchorId: reserveCardAnchorId(section?.id || title, "section"),
    });
    const sectionId = String(section?.id || "").trim().toLowerCase();
    if (sectionId === "mvpd-match") {
      selectedMvpdMatchesCard = card;
      return;
    }
    if (sectionId === "saml") {
      samlMetadataSettingsCard = card;
      return;
    }
    if (sectionContainsTms(section)) {
      tmsCards.push(card);
      return;
    }
    regularCards.push(card);
  });

  const samples = Array.isArray(snapshot?.sourceSamples) ? snapshot.sourceSamples : [];
  samples.forEach((sample) => {
    const title = `Source Sample: ${String(sample?.label || sample?.key || "call").trim() || "call"}`;
    const entries = Array.isArray(sample?.entries) ? sample.entries : [];
    const sampleKey = String(sample?.key || "").trim();
    const anchorId = reserveCardAnchorId(sampleKey || title, "source");
    const card = renderEntriesCard(title, `${entries.length} sampled entr${entries.length === 1 ? "y" : "ies"}`, entries, {
      anchorId,
    });
    if (sampleKey && !callLinkByKey.has(sampleKey)) {
      callLinkByKey.set(sampleKey, anchorId);
    }
    if (sampleContainsTms(sample)) {
      tmsCards.push(card);
      return;
    }
    regularCards.push(card);
  });

  els.cardsHost.appendChild(renderOverviewCard(snapshot));
  els.cardsHost.appendChild(renderCallSummaryCard(snapshot, callLinkByKey));
  els.cardsHost.appendChild(
    renderChipCard("Resource IDs", "Values detected across MVPD lookup payloads", snapshot?.resourceIds || [])
  );
  const tmsAnchorCard = renderChipCard("TMSIDs", "Values detected across MVPD lookup payloads", snapshot?.tmsIds || []);
  els.cardsHost.appendChild(tmsAnchorCard);

  tmsCards.forEach((card) => {
    els.cardsHost.appendChild(card);
  });
  const orderedRegularCards = [];
  if (samlMetadataSettingsCard) {
    orderedRegularCards.push(samlMetadataSettingsCard);
  }
  if (selectedMvpdMatchesCard) {
    orderedRegularCards.push(selectedMvpdMatchesCard);
  }
  regularCards.forEach((card) => {
    orderedRegularCards.push(card);
  });
  orderedRegularCards.forEach((card) => {
    els.cardsHost.appendChild(card);
  });
}

function applyControllerState(payload) {
  const previousSelectionKey = getSelectionKey();
  state.controllerOnline = payload?.controllerOnline === true;
  state.mvpdReady = payload?.mvpdReady === true;
  state.hasMvpdCmTenant = payload?.hasMvpdCmTenant === true;
  state.mvpdCmTenantScope = String(payload?.mvpdCmTenantScope || "").trim();
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorIds = Array.isArray(payload?.requestorIds)
    ? payload.requestorIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdIds = Array.isArray(payload?.mvpdIds)
    ? payload.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdLabel = resolvePayloadMvpdLabel(payload);
  state.requestorMvpdLabel = String(payload?.requestorMvpdLabel || "").trim();
  state.resolvedIntegration = String(payload?.resolvedIntegration || "").trim();
  state.integrationRef = String(payload?.integrationRef || "").trim();
  state.integrationRecordUrl = sanitizeHttpUrl(payload?.integrationRecordUrl || "");
  const nextSelectionKey = getSelectionKey();
  state.expectedSelectionKey = nextSelectionKey;
  if (previousSelectionKey !== nextSelectionKey) {
    state.loading = false;
    clearWorkspaceCards();
  }
  updateControllerBanner();
}

function handleSnapshotStart(payload) {
  if (!payloadMatchesCurrentSelection(payload)) {
    return;
  }
  const mvpdLabel = resolvePayloadMvpdLabel(payload);
  if (mvpdLabel) {
    state.mvpdLabel = mvpdLabel;
    updateControllerBanner();
  }
  state.loading = true;
  syncActionButtonsDisabled();
  const requestorId = String(payload?.requestorId || getSelectedRequestorId() || "").trim();
  const mvpdId = String(payload?.mvpdId || getSelectedMvpdId() || "").trim();
  const mvpdDisplayLabel = firstNonEmptyString([mvpdLabel, getSelectedMvpdLabel(), mvpdId]);
  const label = requestorId && mvpdDisplayLabel ? `${requestorId} x ${mvpdDisplayLabel}` : "selected MVPD";
  setStatus(`Loading ${label} details...`);
}

function handleSnapshotResult(payload) {
  if (!payloadMatchesCurrentSelection(payload)) {
    return;
  }
  const mvpdLabel = resolvePayloadMvpdLabel(payload);
  if (mvpdLabel) {
    state.mvpdLabel = mvpdLabel;
    updateControllerBanner();
  }
  state.loading = false;
  syncActionButtonsDisabled();
  if (!payload || payload.ok !== true) {
    setStatus(String(payload?.error || "Unable to load MVPD details."), "error");
    return;
  }
  state.snapshot = payload.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : null;
  state.requestorMvpdLabel = firstNonEmptyString([payload?.snapshot?.requestorMvpdLabel, state.requestorMvpdLabel]);
  state.resolvedIntegration = firstNonEmptyString([payload?.snapshot?.resolvedIntegration, state.resolvedIntegration]);
  state.integrationRef = firstNonEmptyString([payload?.snapshot?.integrationRef, payload?.snapshot?.resolvedIntegration, state.integrationRef]);
  state.integrationRecordUrl = sanitizeHttpUrl(
    firstNonEmptyString([payload?.snapshot?.integrationRecordUrl, state.integrationRecordUrl])
  );
  if (!state.snapshot) {
    clearWorkspaceCards();
    setStatus("No MVPD details were returned.", "error");
    return;
  }
  renderSnapshot(state.snapshot);
  updateControllerBanner();
  setStatus(`MVPD details loaded at ${formatDateTime(state.snapshot?.fetchedAt)}`);
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
  if (event === "snapshot-start") {
    handleSnapshotStart(payload);
    return;
  }
  if (event === "snapshot-result") {
    handleSnapshotResult(payload);
    return;
  }
  if (event === "cm-report-start") {
    renderMvpdCmReportStart(payload);
    setStatus("Loading CM report...");
    return;
  }
  if (event === "cm-report-form") {
    renderMvpdCmReportForm(payload);
    setStatus("CM API form loaded.");
    return;
  }
  if (event === "cm-report-result") {
    renderMvpdCmReportResult(payload);
    const rowCount = Array.isArray(payload?.rows) ? payload.rows.length : 0;
    if (payload?.ok === true) {
      setStatus(`CM report loaded (${rowCount} row${rowCount === 1 ? "" : "s"}).`);
    } else {
      setStatus(String(payload?.error || "Unable to load CM report."), "error");
    }
    return;
  }
  if (event === "cm-batch-start") {
    state.batchRunning = true;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    return;
  }
  if (event === "cm-batch-end") {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
    return;
  }
  if (event === "workspace-clear") {
    const payloadProgrammerId = String(payload?.programmerId || "").trim();
    const payloadRequestorId = String(payload?.requestorId || "").trim();
    const payloadMvpdId = String(payload?.mvpdId || "").trim();
    if (payloadProgrammerId) {
      state.programmerId = payloadProgrammerId;
    }
    if (payloadRequestorId) {
      state.requestorIds = [payloadRequestorId];
    }
    if (payloadMvpdId) {
      state.mvpdIds = [payloadMvpdId];
    }
    const payloadMvpdLabel = resolvePayloadMvpdLabel(payload);
    if (payloadMvpdLabel) {
      state.mvpdLabel = payloadMvpdLabel;
    }
    state.expectedSelectionKey = getSelectionKey();
    state.loading = false;
    state.batchRunning = false;
    clearWorkspaceCards();
    updateControllerBanner();
    setStatus("");
  }
}

function hasChromeRuntimeMessaging() {
  return !IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME && Boolean(chrome?.runtime?.sendMessage);
}

async function makeClickMvpdDownload() {
  if (!hasSelectionContext()) {
    setStatus("Select Requestor + MVPD in UnderPAR first.", "error");
    return;
  }
  try {
    setStatus("");
    const result = await sendWorkspaceAction("make-clickcmu");
    if (!result?.ok) {
      throw new Error(result?.error || "Unable to generate clickCMU.");
    }
    setStatus("");
  } catch (error) {
    setStatus(`Unable to generate clickCMU: ${error instanceof Error ? error.message : String(error)}`, "error");
  }
}

function getOrderedCmCardStates() {
  const ordered = [];
  if (els.cardsHost) {
    els.cardsHost.querySelectorAll(".report-card[data-card-id]").forEach((element) => {
      const cardId = String(element.getAttribute("data-card-id") || "").trim();
      if (!cardId || !state.cmCardsById.has(cardId)) {
        return;
      }
      ordered.push(state.cmCardsById.get(cardId));
    });
  }
  if (ordered.length > 0) {
    return ordered;
  }
  return [...state.cmCardsById.values()];
}

function collectMvpdCmuWorkspaceExportCards() {
  const cards = [];
  if (!(state.cmCardsById instanceof Map) || state.cmCardsById.size === 0) {
    return cards;
  }
  getOrderedCmCardStates().forEach((cardState) => {
    if (!cardState || typeof cardState !== "object") {
      return;
    }
    const payload = getCardPayload(cardState);
    const requestUrl = String(payload.requestUrl || payload.endpointUrl || "").trim();
    const endpointUrl = String(payload.endpointUrl || requestUrl).trim();
    if (!requestUrl || !endpointUrl) {
      return;
    }
    cards.push({
      cardId: String(payload.cardId || ""),
      requestUrl,
      endpointUrl,
      baseRequestUrl: String(payload.baseRequestUrl || requestUrl).trim(),
      zoomKey: String(payload.zoomKey || "cmu").trim(),
      columns: Array.isArray(payload.columns)
        ? payload.columns.map((value) => String(value || "").trim()).filter(Boolean)
        : [],
      localColumnFilters:
        payload.localColumnFilters && typeof payload.localColumnFilters === "object" ? { ...payload.localColumnFilters } : {},
      operation: payload.operation && typeof payload.operation === "object" ? { ...payload.operation } : null,
      formValues: payload.formValues && typeof payload.formValues === "object" ? { ...payload.formValues } : {},
      tenantId: String(payload.tenantId || getSelectedMvpdId() || "").trim(),
      tenantName: String(payload.tenantName || getSelectedMvpdLabel() || getSelectedMvpdId() || "").trim(),
    });
  });
  return cards;
}

function sanitizeDownloadFileSegment(value, fallback = "MVPD") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function truncateDownloadFileSegment(value, maxLength = 64) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).replace(/[_-]+$/g, "");
}

function cloneJsonCompatible(value, fallback = null) {
  if (value == null) {
    return fallback;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function normalizeStandaloneEpoch(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return Date.now();
  }
  return Math.round(numeric);
}

function buildClickMvpdWorkspaceFileName(snapshot = {}) {
  const epoch = normalizeStandaloneEpoch(Date.parse(String(snapshot?.generatedAt || "").trim()) || Date.now());
  const mvpdToken = firstNonEmptyString([
    snapshot?.mvpdIds?.[0],
    state.mvpdIds?.[0],
    getSelectedMvpdId(),
    state.mvpdLabel,
    "MVPD",
  ]);
  const base = truncateDownloadFileSegment(sanitizeDownloadFileSegment(mvpdToken, "MVPD"), 64) || "MVPD";
  return `${base}_clickCMUWS_${epoch}.html`;
}

function serializeCardForWorkspaceExport(cardState) {
  if (!cardState || typeof cardState !== "object") {
    return null;
  }
  const payload = getCardPayload(cardState);
  const sortStack =
    Array.isArray(cardState.sortStack) && cardState.sortStack.length > 0
      ? cardState.sortStack
          .map((rule) => ({
            col: String(rule?.col || "").trim(),
            dir: String(rule?.dir || "").trim().toUpperCase() === "ASC" ? "ASC" : "DESC",
          }))
          .filter((rule) => rule.col)
      : [];
  return {
    ...payload,
    rows: normalizeRows(Array.isArray(cardState.rows) ? cardState.rows : []),
    sourceRows: normalizeRows(Array.isArray(cardState.sourceRows) ? cardState.sourceRows : []),
    sortStack,
    lastModified: String(cardState.lastModified || ""),
  };
}

function buildWorkspaceExportSnapshot() {
  const cards = getOrderedCmCardStates()
    .map((cardState) => serializeCardForWorkspaceExport(cardState))
    .filter(Boolean);
  const generatedAt = new Date();
  const requestorIds = Array.isArray(state.requestorIds) ? state.requestorIds.slice(0, 24) : [];
  const mvpdIds = Array.isArray(state.mvpdIds) ? state.mvpdIds.slice(0, 24) : [];
  const profileHarvest = state.profileHarvest && typeof state.profileHarvest === "object"
    ? cloneJsonCompatible(state.profileHarvest, null)
    : null;
  const profileHarvestList =
    Array.isArray(state.profileHarvestList) && state.profileHarvestList.length > 0
      ? state.profileHarvestList
          .filter((entry) => entry && typeof entry === "object")
          .map((entry) => cloneJsonCompatible(entry, null))
          .filter(Boolean)
      : [];
  return {
    title: `${firstNonEmptyString([state.mvpdLabel, getSelectedMvpdLabel(), getSelectedMvpdId(), "MVPD"])} clickCMU Workspace`,
    controllerStateText: String(els.controllerState?.textContent || "").trim(),
    filterStateText: String(els.filterState?.textContent || "").trim(),
    exportMetaText: "",
    programmerId: String(state.programmerId || ""),
    programmerName: String(state.programmerName || ""),
    requestorIds,
    mvpdIds,
    profileHarvest,
    profileHarvestList,
    cards,
    generatedAt: generatedAt.toISOString(),
    clientTimeZone: CLIENT_TIMEZONE,
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
  const inlineLocalImports = async (cssText, baseUrl, depth = 0) => {
    const text = String(cssText || "");
    if (!text.trim() || depth > 3) {
      return text;
    }
    const importPattern = /@import\s+(?:url\()?["']?([^"')\s]+)["']?\)?\s*;/gi;
    let output = "";
    let cursor = 0;
    let match = null;
    while ((match = importPattern.exec(text)) !== null) {
      output += text.slice(cursor, match.index);
      cursor = importPattern.lastIndex;
      const rawImportPath = String(match?.[1] || "").trim();
      if (!rawImportPath) {
        continue;
      }
      let importUrl = "";
      try {
        importUrl = new URL(rawImportPath, baseUrl).toString();
      } catch {
        importUrl = "";
      }
      if (!importUrl || !importUrl.startsWith("chrome-extension://")) {
        continue;
      }
      try {
        const importResponse = await fetch(importUrl, {
          method: "GET",
          credentials: "omit",
          cache: "no-cache",
        });
        if (!importResponse.ok) {
          continue;
        }
        const importCss = await importResponse.text();
        const inlined = await inlineLocalImports(importCss, importUrl, depth + 1);
        output += `\n/* inlined from ${rawImportPath} */\n${inlined}\n`;
      } catch {
        // Keep going with the rest of the stylesheet.
      }
    }
    output += text.slice(cursor);
    return output;
  };
  workspaceStylesheetTextCache = await inlineLocalImports(stylesheetText, stylesheetUrl, 0);
  if (!String(workspaceStylesheetTextCache || "").trim()) {
    throw new Error("Workspace stylesheet is empty.");
  }
  return workspaceStylesheetTextCache;
}

async function loadWorkspaceTearsheetRuntimeText() {
  if (typeof workspaceTearsheetRuntimeTextCache === "string" && workspaceTearsheetRuntimeTextCache.trim().length > 0) {
    return workspaceTearsheetRuntimeTextCache;
  }
  if (!chrome?.runtime?.getURL) {
    throw new Error("MVPD workspace runtime loader requires extension context.");
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
  if (!chrome?.runtime?.getURL) {
    throw new Error("MVPD workspace template loader requires extension context.");
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

  const titleText = String(snapshot?.title || "MVPD clickCMU Workspace").trim() || "MVPD clickCMU Workspace";
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
  ["workspace-make-clickcmu", "workspace-make-clickcmuws", "workspace-rerun-all", "workspace-clear-all"].forEach((id) => {
    const node = doc.getElementById(id);
    if (node) {
      node.remove();
    }
  });

  const payloadNode = doc.createElement("script");
  payloadNode.id = CM_WORKSPACE_TEARSHEET_PAYLOAD_ID;
  payloadNode.type = "application/json";
  payloadNode.textContent = payloadJson;
  doc.body.append(payloadNode);

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

async function makeClickMvpdWorkspaceDownload() {
  if (!hasSelectionContext()) {
    setStatus("Select Requestor + MVPD in UnderPAR first.", "error");
    return;
  }
  const cards = collectMvpdCmuWorkspaceExportCards();
  if (cards.length === 0) {
    setStatus("Open at least one MVPD CMU table before generating clickCMUWS_TEARSHEET.", "error");
    return;
  }
  if (els.makeClickMvpdWorkspaceButton) {
    els.makeClickMvpdWorkspaceButton.disabled = true;
  }
  try {
    setStatus("");
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
    const fileName = buildClickMvpdWorkspaceFileName(snapshot);
    downloadHtmlFile(outputHtml, fileName);
    setStatus("");
  } catch (error) {
    setStatus(`Unable to generate clickCMUWS_TEARSHEET: ${error instanceof Error ? error.message : String(error)}`, "error");
  } finally {
    syncActionButtonsDisabled();
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  if (!hasChromeRuntimeMessaging()) {
    return { ok: false, error: "Runtime messaging is unavailable in standalone clickMVPDWS." };
  }
  try {
    return await chrome.runtime.sendMessage({
      type: MVPD_MESSAGE_TYPE,
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

async function refreshSnapshot(forceRefresh = true) {
  if (!hasSelectionContext()) {
    setStatus("Select Requestor + MVPD in UnderPAR first.", "error");
    return;
  }
  state.loading = true;
  syncActionButtonsDisabled();
  setStatus("Refreshing MVPD details...");
  const result = await sendWorkspaceAction("refresh-selected", {
    forceRefresh,
  });
  if (!result?.ok) {
    state.loading = false;
    syncActionButtonsDisabled();
    setStatus(String(result?.error || "Unable to refresh MVPD details."), "error");
  }
}

async function rerunAllCmCards() {
  if (!hasSelectionContext()) {
    setStatus("Select Requestor + MVPD in UnderPAR first.", "error");
    return;
  }
  const cards = collectMvpdCmuWorkspaceExportCards();
  if (cards.length === 0) {
    void refreshSnapshot(true);
    return;
  }
  state.batchRunning = true;
  syncActionButtonsDisabled();
  setStatus(`Re-running ${cards.length} report(s)...`);
  const result = await sendWorkspaceAction("rerun-all", { cards, reason: "workspace" });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
  }
}

function clearWorkspaceView() {
  clearWorkspaceCards();
  if (hasChromeRuntimeMessaging()) {
    void sendWorkspaceAction("clear-all");
  }
}

function registerEventHandlers() {
  if (els.makeClickMvpdButton) {
    els.makeClickMvpdButton.addEventListener("click", () => {
      void makeClickMvpdDownload();
    });
  }

  if (els.makeClickMvpdWorkspaceButton) {
    els.makeClickMvpdWorkspaceButton.addEventListener("click", () => {
      void makeClickMvpdWorkspaceDownload();
    });
  }

  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void rerunAllCmCards();
    });
  }

  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspaceView();
    });
  }

  if (hasChromeRuntimeMessaging()) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type !== MVPD_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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

function hydrateWorkspaceCardsFromExportPayload(payload = {}) {
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
      tenantId: String(cardMeta?.tenantId || getSelectedMvpdId() || ""),
      tenantName: String(cardMeta?.tenantName || getSelectedMvpdLabel() || getSelectedMvpdId() || ""),
    };
    const cardState = ensureCmReportCard(normalizedMeta);
    if (!cardState) {
      return;
    }

    cardState.running = false;
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
    renderCmReportCardMessage(cardState, "No data");
  });
}

function hydrateWorkspaceFromExportPayload(payload = workspaceExportPayload) {
  if (!payload || typeof payload !== "object") {
    return;
  }

  const controllerStatePayload =
    payload.controllerState && typeof payload.controllerState === "object"
      ? payload.controllerState
      : {};
  applyControllerState({
    controllerOnline: true,
    mvpdReady: true,
    programmerId: String(controllerStatePayload.programmerId || ""),
    programmerName: String(controllerStatePayload.programmerName || ""),
    requestorIds: Array.isArray(controllerStatePayload.requestorIds)
      ? controllerStatePayload.requestorIds
      : [],
    mvpdIds: Array.isArray(controllerStatePayload.mvpdIds) ? controllerStatePayload.mvpdIds : [],
    mvpdLabel: String(controllerStatePayload.mvpdLabel || ""),
    requestorMvpdLabel: String(controllerStatePayload.requestorMvpdLabel || ""),
    resolvedIntegration: String(controllerStatePayload.resolvedIntegration || ""),
    integrationRef: String(controllerStatePayload.integrationRef || ""),
    integrationRecordUrl: String(controllerStatePayload.integrationRecordUrl || ""),
  });

  const snapshot = payload.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : null;
  if (snapshot) {
    handleSnapshotResult({
      ok: true,
      snapshot,
      requestorId: String(snapshot.requestorId || controllerStatePayload.requestorId || ""),
      mvpdId: String(snapshot.mvpdId || controllerStatePayload.mvpdId || ""),
      mvpdLabel: String(snapshot.mvpdLabel || controllerStatePayload.mvpdLabel || ""),
    });
  } else {
    clearWorkspaceCards();
  }

  hydrateWorkspaceCardsFromExportPayload(payload);
  if (Array.isArray(payload?.cards) && payload.cards.length > 0) {
    const total = Number(state.cmCardsById.size || 0);
    setStatus(
      total > 0
        ? `clickCMUWS_TEARSHEET ready: ${total} report${total === 1 ? "" : "s"}.`
        : "No workspace reports were captured for this tearsheet."
    );
  }
  syncActionButtonsDisabled();
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

  if (IS_MVPD_WORKSPACE_TEARSHEET_RUNTIME) {
    hydrateWorkspaceFromExportPayload(workspaceExportPayload);
    if (els.rerunAllButton) {
      els.rerunAllButton.hidden = true;
    }
    if (els.clearButton) {
      els.clearButton.hidden = true;
    }
    return;
  }

  const readyResult = await sendWorkspaceAction("workspace-ready");
  if (!readyResult?.ok) {
    setStatus(String(readyResult?.error || "Unable to connect to UnderPAR MVPD controller."), "error");
  }
}

void init();
