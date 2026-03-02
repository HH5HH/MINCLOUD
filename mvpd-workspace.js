const MVPD_MESSAGE_TYPE = "underpar:mvpd-workspace";

const state = {
  windowId: 0,
  controllerOnline: false,
  mvpdReady: false,
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  mvpdLabel: "",
  loading: false,
  snapshot: null,
};
let cardIdentity = 0;

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

function payloadMatchesCurrentSelection(payload = null) {
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
    return false;
  }
  return activeRequestor === payloadRequestor && activeMvpd === payloadMvpd;
}

function getSelectionLabel() {
  const requestor = getSelectedRequestorId();
  const mvpd = getSelectedMvpdId();
  const mvpdLabel = getSelectedMvpdLabel();
  if (!requestor || !mvpd) {
    return "Select Requestor + MVPD in UnderPAR to load details.";
  }
  return `Requestor: ${requestor} | MVPD: ${mvpdLabel || mvpd}`;
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  if (!els.status) {
    return;
  }
  els.status.textContent = text;
  els.status.classList.remove("error");
  if (type === "error") {
    els.status.classList.add("error");
  }
}

function hasSelectionContext() {
  return Boolean(String(state.programmerId || "").trim()) && Boolean(getSelectedRequestorId()) && Boolean(getSelectedMvpdId());
}

function isWorkspaceNetworkBusy() {
  return state.loading === true;
}

function syncWorkspaceNetworkIndicator() {
  const isBusy = isWorkspaceNetworkBusy();
  if (els.rerunAllButton) {
    els.rerunAllButton.classList.toggle("net-busy", isBusy);
    els.rerunAllButton.setAttribute("aria-busy", isBusy ? "true" : "false");
    els.rerunAllButton.title = isBusy ? "Refresh selected MVPD details (loading...)" : "Refresh selected MVPD details";
  }
  if (els.rerunIndicator) {
    els.rerunIndicator.hidden = !isBusy;
  }
}

function syncActionButtonsDisabled() {
  const disableRefresh = state.loading || !hasSelectionContext();
  const disableClear = state.loading || !state.snapshot;
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = disableRefresh;
  }
  if (els.clearButton) {
    els.clearButton.disabled = disableClear;
  }
  syncWorkspaceNetworkIndicator();
}

function updateControllerBanner() {
  if (els.controllerState) {
    els.controllerState.textContent = `MVPD Workspace | ${getProgrammerLabel()}`;
  }
  if (els.filterState) {
    els.filterState.textContent = getSelectionLabel();
  }
  syncActionButtonsDisabled();
}

function clearWorkspaceCards() {
  if (els.cardsHost) {
    els.cardsHost.innerHTML = "";
  }
  cardIdentity = 0;
  state.snapshot = null;
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
  setCardCollapsed(article, head, body, toggleButton, options.collapsed === true);
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

function renderSnapshot(snapshot) {
  if (!els.cardsHost) {
    return;
  }
  els.cardsHost.innerHTML = "";

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
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorIds = Array.isArray(payload?.requestorIds)
    ? payload.requestorIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdIds = Array.isArray(payload?.mvpdIds)
    ? payload.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdLabel = resolvePayloadMvpdLabel(payload);
  const nextSelectionKey = getSelectionKey();
  if (previousSelectionKey && previousSelectionKey !== nextSelectionKey) {
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
  if (!state.snapshot) {
    clearWorkspaceCards();
    setStatus("No MVPD details were returned.", "error");
    return;
  }
  renderSnapshot(state.snapshot);
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
  if (event === "workspace-clear") {
    state.loading = false;
    clearWorkspaceCards();
    setStatus("");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
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

function clearWorkspaceView() {
  clearWorkspaceCards();
  void sendWorkspaceAction("clear-all");
}

function registerEventHandlers() {
  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void refreshSnapshot(true);
    });
  }

  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspaceView();
    });
  }

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

async function init() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    state.windowId = Number(currentWindow?.id || 0);
  } catch {
    state.windowId = 0;
  }

  registerEventHandlers();
  updateControllerBanner();

  const readyResult = await sendWorkspaceAction("workspace-ready");
  if (!readyResult?.ok) {
    setStatus(String(readyResult?.error || "Unable to connect to UnderPAR MVPD controller."), "error");
  }
}

void init();
