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
const toggleExtensionCheckbox = document.getElementById("toggle-extension-checkbox");
const keySortCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

let flow = null;
let events = [];
let selectedSeq = 0;
let showExtensionEvents = false;
let flowListKeyboardActive = false;
const eventRowsBySeq = new Map();

const port = chrome.runtime.connect({ name: "underpardebug-devtools" });

function setStatus(text) {
  statusEl.textContent = String(text || "");
}

function isExtensionEvent(event) {
  return String(event?.source || "")
    .trim()
    .toLowerCase() === "extension";
}

function getVisibleEvents() {
  if (showExtensionEvents) {
    return events;
  }
  return events.filter((event) => !isExtensionEvent(event));
}

function getVisibleEventBySeq(seq) {
  if (!seq) {
    return null;
  }
  return getVisibleEvents().find((event) => event.seq === seq) || null;
}

function setFlowSummary(currentFlow = flow) {
  const resolvedFlowId = String(currentFlow?.flowId || queryFlowId || "").trim();
  const flowLabel = resolvedFlowId ? `Flow ${resolvedFlowId}` : "Flow";
  const visibleCount = getVisibleEvents().length;
  const totalCount = events.length;
  if (visibleCount !== totalCount) {
    leftTitleEl.textContent = `${flowLabel} • ${visibleCount} visible / ${totalCount} total`;
    return;
  }
  leftTitleEl.textContent = `${flowLabel} • ${totalCount} event(s)`;
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

function updateExtensionToggleUi() {
  if (!toggleExtensionCheckbox) {
    return;
  }
  toggleExtensionCheckbox.checked = showExtensionEvents;
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
  const visibleEvents = getVisibleEvents();
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
  if (event.seq === selectedSeq) {
    row.classList.add("selected");
  }

  const head = document.createElement("div");
  head.className = "event-head";
  const seq = createElementWithClass("span", "event-col-seq", `#${String(event.seq || "")}`);
  const time = createElementWithClass("span", "event-col-time", formatTime(event.timestamp));
  const source = createElementWithClass("span", "event-col-source", String(event.source || ""));
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
  const visibleEvents = getVisibleEvents();
  resetEventRows();
  if (!visibleEvents.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent =
      events.length > 0
        ? "No visible events. Use \"Show Extension Rows\" to include extension events."
        : "No trace events yet. Click START RECORDING in the UnderPAR side panel to start capture.";
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
  if (!findEventBySeq(selectedSeq)) {
    selectedSeq = 0;
  }
  setFlowSummary(flow);
  renderEventListFromSnapshot();
}

function appendIncomingEvent(event) {
  if (!event || typeof event !== "object") {
    return;
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
  const visibleEvents = getVisibleEvents();
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

function setExtensionRowsVisible(nextVisible) {
  showExtensionEvents = Boolean(nextVisible);
  updateExtensionToggleUi();
  setFlowSummary(flow);
  renderEventListFromSnapshot();
}

eventsEl.setAttribute("tabindex", "0");
eventsEl.addEventListener("keydown", handleFlowListKeyDown);
eventsEl.addEventListener("focus", handleFlowListFocus);
eventsEl.addEventListener("blur", handleFlowListBlur);
eventsEl.addEventListener("mousedown", handleFlowListMouseDown);

if (toggleExtensionCheckbox) {
  toggleExtensionCheckbox.addEventListener("change", () => {
    setExtensionRowsVisible(Boolean(toggleExtensionCheckbox.checked));
  });
}

updateExtensionToggleUi();

port.onMessage.addListener((message) => {
  if (!message || typeof message !== "object") {
    return;
  }

  if (message.type === "snapshot") {
    applySnapshot(message.flow || null);
    return;
  }

  if (message.type === "event") {
    if (flow?.flowId && message.flowId && flow.flowId !== message.flowId) {
      return;
    }
    appendIncomingEvent(message.event);
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

if (tabId > 0) {
  tabLabelEl.textContent = `Tab ${tabId}`;
  setFlowSummary();
  setStatus("Subscribing to UP trace stream...");
  port.postMessage({ type: "subscribe", tabId });
} else {
  tabLabelEl.textContent = queryFlowId ? `Flow ${queryFlowId}` : "No tab binding";
  setFlowSummary();
  renderEventListFromSnapshot();
  setStatus("No tab binding yet. Click START RECORDING in the UnderPAR side panel to stream events here.");
  clearButton.disabled = true;
}
