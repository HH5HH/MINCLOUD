const queryParams = new URLSearchParams(window.location.search);
const queryTabId = Number(queryParams.get("tabId") || 0);
const queryFlowId = String(queryParams.get("flowId") || "").trim();

const inspectedTabId = (() => {
  try {
    return Number(chrome?.devtools?.inspectedWindow?.tabId || 0);
  } catch {
    return 0;
  }
})();

const tabId =
  Number.isFinite(queryTabId) && queryTabId > 0
    ? queryTabId
    : Number.isFinite(inspectedTabId) && inspectedTabId > 0
      ? inspectedTabId
      : 0;

const statusEl = document.getElementById("status");
const tabLabelEl = document.getElementById("tab-label");
const leftTitleEl = document.getElementById("left-title");
const eventsEl = document.getElementById("events");
const detailsEl = document.getElementById("details");
const clearButton = document.getElementById("clear-btn");
const copyButton = document.getElementById("copy-btn");
const autoscrollCheckbox = document.getElementById("autoscroll");
const keySortCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

let flow = null;
let events = [];
let selectedSeq = 0;
let flowListKeyboardActive = false;
const eventRowsBySeq = new Map();
const seenEventKeys = new Set();
const EVENT_SERVICE_LABELS = Object.freeze({
  "rest-v2": "REST V2",
  esm: "ESM",
  cm: "CM",
  mvpd: "MVPD",
  degradation: "DEGRADATION",
});
const EVENT_WORKSPACE_LABELS = Object.freeze({
  "esm-workspace": "ESM Workspace",
  "cmu-workspace": "CMU Workspace",
  "mvpd-workspace": "MVPD Workspace",
});

const port = chrome.runtime.connect({ name: "underpardebug-devtools" });

function isPanelVisible() {
  return document.visibilityState !== "hidden";
}

function notifyPanelVisibility() {
  if (!tabId) {
    return;
  }
  try {
    port.postMessage({
      type: "panel-visibility",
      tabId,
      visible: isPanelVisible(),
    });
  } catch {
    // Ignore disconnected port errors.
  }
}

function setStatus(text) {
  statusEl.textContent = String(text || "");
}

function buildEventDedupeKey(flowIdHint, event) {
  const normalizedFlowId = String(flowIdHint || "").trim();
  const seq = Number(event?.seq || 0);
  if (!normalizedFlowId || !Number.isFinite(seq) || seq <= 0) {
    return "";
  }
  return `${normalizedFlowId}:${seq}`;
}

function normalizeEventServiceKey(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  if (raw === "mvpd" || raw.includes("mvpd")) {
    return "mvpd";
  }
  if (raw === "cm" || raw.includes("cm")) {
    return "cm";
  }
  if (raw === "esm" || raw.includes("esm")) {
    return "esm";
  }
  if (raw.includes("degrad")) {
    return "degradation";
  }
  if (raw.includes("restv2") || raw.includes("rest-v2") || raw.includes("rest")) {
    return "rest-v2";
  }
  return "";
}

function classifyEventService(event) {
  const direct = normalizeEventServiceKey(event?.service);
  if (direct) {
    return direct;
  }

  const requestScope = String(event?.requestScope || "").trim().toLowerCase();
  if (requestScope.includes("degrad") || requestScope === "decisions:owner") {
    return "degradation";
  }
  if (requestScope.includes("cm")) {
    return "cm";
  }
  if (requestScope.includes("mvpd")) {
    return "mvpd";
  }
  if (requestScope.includes("esm")) {
    return "esm";
  }
  if (requestScope.includes("rest")) {
    return "rest-v2";
  }

  const phase = String(event?.phase || "").trim().toLowerCase();
  if (phase.startsWith("cm-") || phase.includes("cmu")) {
    return "cm";
  }
  if (phase.includes("mvpd")) {
    return "mvpd";
  }
  if (phase.includes("esm") || phase.includes("clickesm")) {
    return "esm";
  }
  if (phase.includes("degrad")) {
    return "degradation";
  }
  if (phase.startsWith("restv2-") || phase.startsWith("profiles-check") || phase.startsWith("token-")) {
    return "rest-v2";
  }

  const urlHints = [event?.url, event?.endpointUrl, event?.loginUrl]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
  if (/(cm-reports|config)\.adobeprimetime\.com|streams-stage\.adobeprimetime\.com|\/cmu?\//i.test(urlHints)) {
    return "cm";
  }
  if (urlHints.includes("/api/v2/") || urlHints.includes("api.auth.adobe.com")) {
    return "rest-v2";
  }

  return "unknown";
}

function normalizeWorkspaceKey(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  if (raw.includes("mvpd")) {
    return "mvpd-workspace";
  }
  if (raw.includes("cmu") || raw.includes("cm-workspace") || raw === "cm") {
    return "cmu-workspace";
  }
  if (raw.includes("esm")) {
    return "esm-workspace";
  }
  return "";
}

function classifyEventWorkspace(event) {
  const direct = normalizeWorkspaceKey(firstNonEmptyString([event?.workspaceKey, event?.workspaceOrigin]));
  if (direct) {
    return direct;
  }

  const requestScope = String(event?.requestScope || "").trim().toLowerCase();
  if (requestScope.includes("mvpd")) {
    return "mvpd-workspace";
  }
  if (requestScope.includes("cmu")) {
    return "cmu-workspace";
  }
  if (requestScope.includes("esm-workspace")) {
    return "esm-workspace";
  }

  const phase = String(event?.phase || "").trim().toLowerCase();
  if (phase.includes("mvpd-workspace")) {
    return "mvpd-workspace";
  }
  if (phase.includes("cmu") || phase.includes("cm-v2")) {
    return "cmu-workspace";
  }
  if (phase.includes("report-") || phase.includes("csv-download")) {
    if (classifyEventService(event) === "esm") {
      return "esm-workspace";
    }
  }
  return "";
}

function setFlowSummary(currentFlow = flow) {
  const resolvedFlowId = String(currentFlow?.flowId || queryFlowId || "").trim();
  const flowLabel = resolvedFlowId ? `Flow ${resolvedFlowId}` : "Flow";
  leftTitleEl.textContent = `${flowLabel} • ${events.length} event(s)`;
}

function formatTime(value) {
  if (!value) {
    return "";
  }
  try {
    return new Date(value).toLocaleTimeString();
  } catch {
    return String(value);
  }
}

function pickEventLabel(event) {
  const parts = [];
  if (event.method) {
    parts.push(String(event.method));
  }
  if (Number.isFinite(Number(event.status)) && Number(event.status) > 0) {
    parts.push(String(event.status));
  }
  if (event.requestId) {
    parts.push(`req:${event.requestId}`);
  }
  return parts.join(" | ");
}

function findEventBySeq(seq) {
  if (!seq) {
    return null;
  }
  return events.find((event) => event.seq === seq) || null;
}

function toTitleCaseKey(value) {
  const input = String(value || "").trim();
  if (!input) {
    return "";
  }
  return input
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

function compareObjectKeys(leftKey, rightKey) {
  return keySortCollator.compare(String(leftKey || ""), String(rightKey || ""));
}

function isPrimitiveValue(value) {
  return value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function hasMeaningfulValue(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function createElementWithClass(tagName, className, text = "") {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function formatPrimitiveValue(value) {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return String(value);
}

function getPrimitiveClassName(value) {
  if (value === null || value === undefined) {
    return "value-null";
  }
  if (typeof value === "boolean") {
    return "value-boolean";
  }
  if (typeof value === "number") {
    return "value-number";
  }
  if (typeof value === "string") {
    return "value-string";
  }
  return "";
}

function createSummaryCard(label, value) {
  const card = createElementWithClass("article", "summary-card");
  const cardLabel = createElementWithClass("span", "summary-card-label", label);
  const cardValue = createElementWithClass("span", "summary-card-value", formatPrimitiveValue(value));
  card.appendChild(cardLabel);
  card.appendChild(cardValue);
  return card;
}

function createDetailRow(key, value, depth, seen) {
  const normalizedDepth = Math.max(0, Math.min(Number(depth || 0), 6));
  const row = createElementWithClass("div", `detail-row depth-${normalizedDepth}`);
  const keyEl = createElementWithClass("span", `detail-key depth-${normalizedDepth}`, key);
  const valueEl = createElementWithClass("div", "detail-value");
  valueEl.appendChild(renderValueNode(value, depth, seen));
  row.appendChild(keyEl);
  row.appendChild(valueEl);
  return row;
}

function renderValueNode(value, depth = 0, seen = new WeakSet()) {
  if (isPrimitiveValue(value)) {
    if (value === "" || value === null || value === undefined) {
      return createElementWithClass("span", "value-empty", value === "" ? '""' : formatPrimitiveValue(value));
    }
    const className = getPrimitiveClassName(value);
    return createElementWithClass("span", `value-scalar ${className}`.trim(), formatPrimitiveValue(value));
  }

  if (typeof value !== "object") {
    return createElementWithClass("span", "", formatPrimitiveValue(value));
  }

  if (seen.has(value)) {
    return createElementWithClass("span", "value-empty", "[Circular]");
  }
  seen.add(value);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return createElementWithClass("span", "value-empty", "[]");
    }

    const wrapper = createElementWithClass("details", `value-group depth-${Math.max(0, Math.min(depth, 6))}`);
    wrapper.open = depth < 1;
    const summary = createElementWithClass("summary", "", `Array (${value.length})`);
    wrapper.appendChild(summary);

    const body = createElementWithClass("div", "value-group-body");
    for (let index = 0; index < value.length; index += 1) {
      body.appendChild(createDetailRow(`[${index}]`, value[index], depth + 1, seen));
    }
    wrapper.appendChild(body);
    return wrapper;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return createElementWithClass("span", "value-empty", "{}");
  }

  const wrapper = createElementWithClass("details", "value-group");
  wrapper.classList.add(`depth-${Math.max(0, Math.min(depth, 6))}`);
  wrapper.open = depth < 1;
  const summary = createElementWithClass("summary", "", `Object (${entries.length} fields)`);
  wrapper.appendChild(summary);

  const body = createElementWithClass("div", "value-group-body");
  const sortedEntries = [...entries].sort((left, right) => compareObjectKeys(left[0], right[0]));
  for (let index = 0; index < sortedEntries.length; index += 1) {
    const [key, nestedValue] = sortedEntries[index];
    body.appendChild(createDetailRow(key, nestedValue, depth + 1, seen));
  }

  wrapper.appendChild(body);
  return wrapper;
}

function normalizeSectionKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSection(title, content, sectionKey = "") {
  if (!hasMeaningfulValue(content)) {
    return null;
  }

  const section = createElementWithClass("section", "event-section");
  const normalizedSectionKey = normalizeSectionKey(sectionKey || title);
  if (normalizedSectionKey) {
    section.classList.add(`section-${normalizedSectionKey}`);
  }
  const heading = createElementWithClass("h3", "event-section-head", title);
  const body = createElementWithClass("div", "event-section-body");

  if (isPrimitiveValue(content)) {
    body.appendChild(createDetailRow("value", content, 0, new WeakSet()));
  } else if (Array.isArray(content)) {
    body.appendChild(renderValueNode(content, 0, new WeakSet()));
  } else {
    const sortedEntries = Object.entries(content).sort((left, right) => compareObjectKeys(left[0], right[0]));
    for (const [key, value] of sortedEntries) {
      body.appendChild(createDetailRow(key, value, 0, new WeakSet()));
    }
  }

  section.appendChild(heading);
  section.appendChild(body);
  return section;
}

function renderRawJsonDisclosure(event) {
  const details = createElementWithClass("details", "raw-json");
  const summary = createElementWithClass("summary", "", "Raw JSON");
  const pre = createElementWithClass("pre");
  pre.textContent = JSON.stringify(event, null, 2);
  details.appendChild(summary);
  details.appendChild(pre);
  return details;
}

function renderSelectedEventDetails(event) {
  detailsEl.innerHTML = "";

  if (!event || typeof event !== "object") {
    const empty = createElementWithClass("p", "details-empty", "Select an event to view details.");
    detailsEl.appendChild(empty);
    return;
  }

  const summaryFields = [
    ["Sequence", event.seq],
    ["Time", formatTime(event.timestamp) || event.timestamp],
    ["Source", event.source],
    ["Phase", event.phase],
    ["Method", event.method],
    ["Status", event.status],
    ["Request ID", event.requestId],
    ["Tab ID", event.tabId],
    ["URL", firstNonEmptyString([event.url, event.loginUrl, event.redirectUrl])],
  ].filter(([, value]) => hasMeaningfulValue(value));

  if (summaryFields.length > 0) {
    const summaryGrid = createElementWithClass("section", "event-summary-grid");
    for (const [label, value] of summaryFields) {
      summaryGrid.appendChild(createSummaryCard(label, value));
    }
    detailsEl.appendChild(summaryGrid);
  }

  const sectionKeyOrder = [
    "requestHeaders",
    "responseHeaders",
    "setCookies",
    "cookies",
    "requestBody",
    "request",
    "responseBody",
    "bodyPreview",
    "response",
    "payload",
    "responsePayload",
    "profileHarvest",
    "profileCheck",
    "harvestedProfile",
    "metadata",
    "sessionData",
    "error",
  ];

  const consumedKeys = new Set(["seq", "timestamp", "source", "phase", "method", "status", "requestId", "tabId", "url", "loginUrl", "redirectUrl"]);
  for (const key of sectionKeyOrder) {
    if (!hasMeaningfulValue(event[key])) {
      continue;
    }
    const section = createSection(toTitleCaseKey(key), event[key], key);
    if (section) {
      detailsEl.appendChild(section);
      consumedKeys.add(key);
    }
  }

  const additionalEntries = Object.entries(event).filter(
    ([key, value]) => !consumedKeys.has(key) && hasMeaningfulValue(value)
  );

  if (additionalEntries.length > 0) {
    const additionalSection = createElementWithClass("section", "event-section");
    additionalSection.classList.add("section-additional");
    const heading = createElementWithClass("h3", "event-section-head", "Additional Fields");
    const body = createElementWithClass("div", "event-section-body");
    const sortedEntries = additionalEntries.sort((left, right) => compareObjectKeys(left[0], right[0]));
    for (const [key, value] of sortedEntries) {
      body.appendChild(createDetailRow(key, value, 0, new WeakSet()));
    }
    additionalSection.appendChild(heading);
    additionalSection.appendChild(body);
    detailsEl.appendChild(additionalSection);
  }

  detailsEl.appendChild(renderRawJsonDisclosure(event));
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function updateDetailsFromSelection() {
  const selectedEvent = findEventBySeq(selectedSeq);
  renderSelectedEventDetails(selectedEvent);
}

function setSelectedEvent(seq) {
  const visibleEvents = events;
  const normalizedSeq = Number(seq || 0);
  if (!normalizedSeq || !visibleEvents.some((event) => event.seq === normalizedSeq)) {
    if (selectedSeq && eventRowsBySeq.has(selectedSeq)) {
      eventRowsBySeq.get(selectedSeq).classList.remove("selected");
    }
    selectedSeq = 0;
    updateDetailsFromSelection();
    return;
  }

  if (selectedSeq && selectedSeq !== normalizedSeq && eventRowsBySeq.has(selectedSeq)) {
    eventRowsBySeq.get(selectedSeq).classList.remove("selected");
  }

  selectedSeq = normalizedSeq;
  if (eventRowsBySeq.has(selectedSeq)) {
    eventRowsBySeq.get(selectedSeq).classList.add("selected");
  }
  updateDetailsFromSelection();
}

function renderEventRow(event) {
  const row = document.createElement("article");
  row.className = "event-row";
  row.dataset.seq = String(event.seq || "");
  row.dataset.service = classifyEventService(event);
  row.dataset.workspace = classifyEventWorkspace(event);
  if (event.seq === selectedSeq) {
    row.classList.add("selected");
  }

  const head = document.createElement("div");
  head.className = "event-head";
  const seq = createElementWithClass("span", "event-col-seq", `#${String(event.seq || "")}`);
  const time = createElementWithClass("span", "event-col-time", formatTime(event.timestamp));
  const source = createElementWithClass("span", "event-col-source");
  const sourceLabel = createElementWithClass("span", "event-col-source-label", String(event.source || ""));
  source.appendChild(sourceLabel);
  const serviceKey = String(row.dataset.service || "unknown");
  const serviceLabel = EVENT_SERVICE_LABELS[serviceKey] || "";
  if (serviceLabel) {
    const badge = createElementWithClass("span", `event-service-badge service-${serviceKey}`, serviceLabel);
    source.appendChild(badge);
  }
  const workspaceKey = String(row.dataset.workspace || "");
  const workspaceLabel = EVENT_WORKSPACE_LABELS[workspaceKey] || "";
  if (workspaceLabel) {
    const badge = createElementWithClass("span", `event-workspace-badge workspace-${workspaceKey}`, workspaceLabel);
    source.appendChild(badge);
  }
  const phase = createElementWithClass("span", "event-col-phase", String(event.phase || ""));
  const status = createElementWithClass("span", "event-col-status", pickEventLabel(event));
  head.appendChild(seq);
  head.appendChild(time);
  head.appendChild(source);
  head.appendChild(phase);
  head.appendChild(status);

  row.appendChild(head);

  const eventUrl = String(event.url || event.loginUrl || "").trim();
  if (eventUrl) {
    const url = document.createElement("div");
    url.className = "event-url";
    url.textContent = eventUrl;
    row.appendChild(url);
  }

  row.addEventListener("click", () => {
    if (typeof eventsEl.focus === "function") {
      eventsEl.focus();
    }
    setSelectedEvent(event.seq);
  });

  return row;
}

function resetEventRows() {
  eventsEl.innerHTML = "";
  eventRowsBySeq.clear();
}

function appendEventRow(event) {
  const row = renderEventRow(event);
  eventRowsBySeq.set(event.seq, row);
  eventsEl.appendChild(row);
}

function renderEventListFromSnapshot() {
  const visibleEvents = events;
  resetEventRows();
  if (!visibleEvents.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trace events yet. Run ESM/CMU actions or click START RECORDING in the UnderPAR side panel.";
    eventsEl.appendChild(empty);
    renderSelectedEventDetails(null);
    return;
  }

  for (const event of visibleEvents) {
    appendEventRow(event);
  }

  if (!selectedSeq || !visibleEvents.some((event) => event.seq === selectedSeq)) {
    const latest = visibleEvents[visibleEvents.length - 1];
    selectedSeq = Number(latest?.seq || 0);
  }
  setSelectedEvent(selectedSeq);

  if (autoscrollCheckbox.checked) {
    eventsEl.scrollTop = eventsEl.scrollHeight;
  }
}

function applySnapshot(nextFlow) {
  flow = nextFlow || null;
  events = Array.isArray(flow?.events) ? [...flow.events] : [];
  seenEventKeys.clear();
  const snapshotFlowId = String(flow?.flowId || "").trim();
  if (snapshotFlowId) {
    events.forEach((event) => {
      const key = buildEventDedupeKey(snapshotFlowId, event);
      if (key) {
        seenEventKeys.add(key);
      }
    });
  }
  if (!findEventBySeq(selectedSeq)) {
    selectedSeq = 0;
  }
  setFlowSummary(flow);
  renderEventListFromSnapshot();
}

function appendIncomingEvent(event, flowIdHint = "") {
  if (!event || typeof event !== "object") {
    return;
  }

  const key = buildEventDedupeKey(flowIdHint, event);
  if (key && seenEventKeys.has(key)) {
    return;
  }
  if (key) {
    seenEventKeys.add(key);
  }

  events.push(event);
  if (events.length > 4000) {
    events.splice(0, events.length - 4000);
  }

  setFlowSummary(flow);
  renderEventListFromSnapshot();
}

function scrollSelectedRowIntoView() {
  if (!selectedSeq) {
    return;
  }
  const row = eventRowsBySeq.get(selectedSeq);
  if (row && typeof row.scrollIntoView === "function") {
    row.scrollIntoView({ block: "nearest" });
  }
}

function moveSelectionBy(delta) {
  const visibleEvents = events;
  if (!visibleEvents.length) {
    return;
  }

  const currentIndex = visibleEvents.findIndex((event) => event.seq === selectedSeq);
  let nextIndex = currentIndex;
  if (currentIndex < 0) {
    nextIndex = delta >= 0 ? 0 : visibleEvents.length - 1;
  } else {
    nextIndex = Math.min(visibleEvents.length - 1, Math.max(0, currentIndex + delta));
  }

  const target = visibleEvents[nextIndex];
  if (!target) {
    return;
  }

  setSelectedEvent(target.seq);
  scrollSelectedRowIntoView();
}

function handleFlowListKeyDown(event) {
  if (!flowListKeyboardActive) {
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveSelectionBy(-1);
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveSelectionBy(1);
  }
}

function handleFlowListFocus() {
  flowListKeyboardActive = true;
}

function handleFlowListBlur() {
  flowListKeyboardActive = false;
}

function handleFlowListMouseDown() {
  if (typeof eventsEl.focus === "function") {
    eventsEl.focus();
  }
}

eventsEl.setAttribute("tabindex", "0");
eventsEl.addEventListener("keydown", handleFlowListKeyDown);
eventsEl.addEventListener("focus", handleFlowListFocus);
eventsEl.addEventListener("blur", handleFlowListBlur);
eventsEl.addEventListener("mousedown", handleFlowListMouseDown);

port.onMessage.addListener((message) => {
  if (!message || typeof message !== "object") {
    return;
  }

  if (message.type === "snapshot") {
    applySnapshot(message.flow || null);
    return;
  }

  if (message.type === "event") {
    appendIncomingEvent(message.event, String(message.flowId || "").trim());
    return;
  }

  if (message.type === "pass-event" || message.type === "cm-event") {
    appendIncomingEvent(message.event, String(message.flowId || "").trim());
  }
});

clearButton.addEventListener("click", () => {
  if (!tabId) {
    setStatus("Cannot clear events until this viewer is bound to a browser tab.");
    return;
  }
  port.postMessage({ type: "clear", tabId });
});

copyButton.addEventListener("click", async () => {
  const payload = {
    tabId,
    flowHint: queryFlowId,
    flow,
    events,
  };
  const serialized = JSON.stringify(payload, null, 2);

  try {
    await navigator.clipboard.writeText(serialized);
    setStatus(`Copied ${events.length} event(s) to clipboard.`);
  } catch {
    setStatus("Clipboard write failed. Select and copy from raw JSON section.");
    detailsEl.innerHTML = "";
    const raw = createElementWithClass("details", "raw-json");
    raw.open = true;
    const summary = createElementWithClass("summary", "", "Trace JSON");
    const pre = createElementWithClass("pre");
    pre.textContent = serialized;
    raw.appendChild(summary);
    raw.appendChild(pre);
    detailsEl.appendChild(raw);
  }
});

window.addEventListener("beforeunload", () => {
  eventsEl.removeEventListener("keydown", handleFlowListKeyDown);
  eventsEl.removeEventListener("focus", handleFlowListFocus);
  eventsEl.removeEventListener("blur", handleFlowListBlur);
  eventsEl.removeEventListener("mousedown", handleFlowListMouseDown);
  try {
    port.disconnect();
  } catch {
    // Ignore disconnect errors.
  }
});

document.addEventListener("visibilitychange", () => {
  notifyPanelVisibility();
});

if (tabId > 0) {
  tabLabelEl.textContent = `Tab ${tabId}`;
  setFlowSummary();
  setStatus("Subscribing to UP trace stream...");
  port.postMessage({ type: "subscribe", tabId, visible: isPanelVisible() });
  notifyPanelVisibility();
} else {
  tabLabelEl.textContent = queryFlowId ? `Flow ${queryFlowId}` : "No tab binding";
  setFlowSummary();
  renderEventListFromSnapshot();
  setStatus("No tab binding yet. Click START RECORDING in the UnderPAR side panel to stream events here.");
  clearButton.disabled = true;
}
