const CM_MESSAGE_TYPE = "underpar:cm";
const CM_SOURCE_UTC_OFFSET_MINUTES = -8 * 60;
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
const PASS_CONSOLE_PROGRAMMER_APPLICATIONS_URL =
  "https://experience.adobe.com/#/@adobepass/pass/authentication/release-production/programmers";
const WORKSPACE_LOCK_MESSAGE_SUFFIX =
  "does not have Concurrency Monitoring access. Confirm CM tenant mapping for this media company.";
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
const CM_FILTER_BLOCKED_COLUMNS = new Set(["view"]);

const state = {
  windowId: 0,
  controllerOnline: false,
  cmAvailable: null,
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  profileHarvest: null,
  profileHarvestList: [],
  cardsById: new Map(),
  batchRunning: false,
  workspaceLocked: false,
  nonCmMode: false,
};

const els = {
  appRoot: document.getElementById("workspace-app-root"),
  stylesheet: document.getElementById("workspace-style-link"),
  nonCmScreen: document.getElementById("workspace-non-cm-screen"),
  nonCmHeadline: document.getElementById("workspace-non-cm-headline"),
  nonCmNote: document.getElementById("workspace-non-cm-note"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  lockBanner: document.getElementById("workspace-lock-banner"),
  lockMessage: document.getElementById("workspace-lock-message"),
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

function dedupeCandidateStrings(values = []) {
  const output = [];
  const seen = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) {
      return;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(normalized);
  });
  return output;
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

function isCmuUsageCard(cardState) {
  const zoomKey = String(cardState?.zoomKey || "").trim().toLowerCase();
  if (zoomKey === "usage") {
    return true;
  }
  const requestUrl = String(cardState?.baseRequestUrl || cardState?.requestUrl || cardState?.endpointUrl || "")
    .trim()
    .toLowerCase();
  return requestUrl.includes("/cmu/");
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

function isDisplayableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized || normalized.startsWith("__")) {
    return false;
  }
  if (CM_FILTER_BLOCKED_COLUMNS.has(normalized)) {
    return false;
  }
  if (isCmDateTimeColumn(normalized) || isCmMetricColumn(normalized)) {
    return false;
  }
  return true;
}

function isFilterableCmuColumn(cardState, columnName) {
  if (!isCmuUsageCard(cardState)) {
    return false;
  }
  const normalized = normalizeCmColumnName(columnName);
  if (!normalized || normalized.startsWith("__")) {
    return false;
  }
  if (CM_FILTER_BLOCKED_COLUMNS.has(normalized)) {
    return false;
  }
  if (isCmDateTimeColumn(normalized) || isCmMetricColumn(normalized)) {
    return false;
  }
  return true;
}

function collectHarvestCandidateValues(harvestList = []) {
  const list = Array.isArray(harvestList) ? harvestList : [];
  const idpCandidates = dedupeCandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.mvpd || "").trim(),
      ...(Array.isArray(harvest?.idpCandidates) ? harvest.idpCandidates : []),
      ...(Array.isArray(harvest?.allIdpCandidates) ? harvest.allIdpCandidates : []),
    ])
  );
  const subjectCandidates = dedupeCandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.subject || "").trim(),
      String(harvest?.upstreamUserId || "").trim(),
      String(harvest?.userId || "").trim(),
      ...(Array.isArray(harvest?.subjectCandidates) ? harvest.subjectCandidates : []),
      ...(Array.isArray(harvest?.allSubjectCandidates) ? harvest.allSubjectCandidates : []),
    ])
  );
  const sessionCandidates = dedupeCandidateStrings(
    list.flatMap((harvest) => [
      String(harvest?.sessionId || "").trim(),
      ...(Array.isArray(harvest?.sessionCandidates) ? harvest.sessionCandidates : []),
      ...(Array.isArray(harvest?.allSessionCandidates) ? harvest.allSessionCandidates : []),
    ])
  );
  return {
    idpCandidates,
    subjectCandidates,
    sessionCandidates,
  };
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
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isDisabled || !hasWorkspaceCardContext();
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

function buildNotPremiumConsoleLinkHtml(serviceLabel = "CM") {
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

function shouldShowNonCmMode() {
  return !state.controllerOnline && state.cmAvailable === false && hasProgrammerContext();
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

function updateNonCmMode() {
  const shouldShow = shouldShowNonCmMode();
  state.nonCmMode = shouldShow;
  if (els.nonCmHeadline) {
    els.nonCmHeadline.textContent = `No Soup for ${getProgrammerLabel()}. No Premium, No CM, No Dice.`;
  }
  if (els.nonCmNote) {
    els.nonCmNote.innerHTML = buildNotPremiumConsoleLinkHtml("CM");
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
  if (els.nonCmScreen) {
    els.nonCmScreen.hidden = !shouldShow;
  }
}

function updateWorkspaceLockState() {
  const shouldLock = shouldShowNonCmMode();
  state.workspaceLocked = shouldLock;
  document.body.classList.toggle("workspace-locked", shouldLock);
  if (els.lockBanner) {
    els.lockBanner.hidden = !shouldLock;
  }
  if (els.lockMessage) {
    els.lockMessage.innerHTML = shouldLock ? buildWorkspaceLockMessageHtml() : "";
  }
  syncActionButtonsDisabled();
  updateNonCmMode();
}

function updateControllerBanner() {
  if (!els.controllerState || !els.filterState) {
    return;
  }

  const hasProgrammerContext = Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
  if (!state.controllerOnline) {
    if (state.workspaceLocked) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "CM workspace is locked for this media company. No Premium, No CM, No Dice.";
    } else if (hasProgrammerContext) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "Waiting for CM controller sync from UnderPAR side panel...";
    } else {
      els.controllerState.textContent = "Waiting for UnderPAR side panel controller...";
      els.filterState.textContent = "";
    }
    return;
  }

  els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
  const requestorLabel = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
  const mvpdLabel = state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs";
  const harvestList = Array.isArray(state.profileHarvestList) ? state.profileHarvestList : [];
  const harvest = state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : harvestList[0] || null;
  const harvestSubject = String(harvest?.subject || "").trim();
  const harvestMvpd = String(harvest?.mvpd || "").trim();
  const harvestSession = String(harvest?.sessionId || "").trim();
  const harvestOutcome = String(harvest?.profileCheckOutcome || "").trim();
  const harvestProfileCount = Number(harvest?.profileCount || 0);
  const compact = (value, limit) => {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  };
  const harvestStatusSummary = harvestOutcome
    ? ` | MVPD Profile: ${compact(harvestOutcome, 16)}${Number.isFinite(harvestProfileCount) ? ` (profiles=${harvestProfileCount})` : ""}`
    : "";
  const harvestCountSummary = harvestList.length > 0 ? ` | MVPD Login History: ${harvestList.length} captured` : "";
  const harvestIdentitySummary = harvestSubject
    ? ` | Correlation Subject: ${compact(harvestSubject, 42)}${harvestMvpd ? ` | Correlation MVPD: ${compact(harvestMvpd, 18)}` : ""}${
        harvestSession ? ` | Session: ${compact(harvestSession, 24)}` : ""
      }`
    : "";
  const harvestSummary =
    harvestStatusSummary || harvestIdentitySummary || harvestCountSummary
      ? `${harvestCountSummary}${harvestStatusSummary}${harvestIdentitySummary}`
      : "";
  els.filterState.textContent = `RequestorId(s): ${requestorLabel} | MVPD(s): ${mvpdLabel}${harvestSummary}`;
}

const CM_WORKSPACE_ROW_FLATTEN_MAX_DEPTH = 4;
const CM_WORKSPACE_ROW_ARRAY_FIELD_LIMIT = 8;
const CM_WORKSPACE_ROW_PREVIEW_LIMIT = 6;
const CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT = 1400;

function truncateText(value, limit = CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT) {
  const text = String(value == null ? "" : value);
  const max = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT;
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, Math.max(0, max - 1))}…`;
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
  return truncateText(label ? `${label} | ${preview}${more}` : `${preview}${more}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
}

function summarizeArrayRowValue(value) {
  if (!Array.isArray(value)) {
    return normalizeRowValue(value);
  }
  if (value.length === 0) {
    return "";
  }
  if (value.every((item) => isPrimitiveRowValue(item))) {
    return truncateText(
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
  return truncateText(
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
      return truncateText(
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
  return truncateText(String(value), CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
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
          row[`${key}.${field}`] = truncateText(`${preview}${overflow}`, CM_WORKSPACE_ROW_VALUE_CHAR_LIMIT);
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

  const hasCalendarParts = rawYear != null && rawMonth != null && rawDay != null;
  if (hasCalendarParts) {
    return (
      Date.UTC(
        rawYear ?? 1970,
        Math.max(0, (rawMonth ?? 1) - 1),
        rawDay ?? 1,
        rawHour ?? 0,
        rawMinute ?? 0
      ) -
      CM_SOURCE_UTC_OFFSET_MINUTES * 60 * 1000
    );
  }

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

function hasCmuUsageDate(row) {
  const ms = cmuPartsToUtcMs(row);
  return Number.isFinite(ms);
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

function sortRows(rows, sortStack, context = null) {
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? sortStack : [];
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
  actionLink.title = "Load details in CM Workspace";
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

function renderTableBody(tableState) {
  if (tableState?.mode === "cmu-usage") {
    renderCmuUsageTableBody(tableState);
    return;
  }
  renderGenericTableBody(tableState);
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

function parseCmRequestContext(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return {
      fullUrl: "",
      pathSegments: [],
      queryPairs: [],
    };
  }

  let pathSegments = [];
  try {
    const parsed = new URL(raw);
    pathSegments = String(parsed.pathname || "")
      .split("/")
      .map((segment) => safeDecodeUrlSegment(segment.trim()))
      .filter(Boolean);
  } catch (_error) {
    pathSegments = String(raw.split(/[?#]/, 1)[0] || "")
      .split("/")
      .map((segment) => safeDecodeUrlSegment(segment.trim()))
      .filter(Boolean);
  }

  return {
    fullUrl: raw,
    pathSegments,
    queryPairs: parseRawQueryPairs(raw),
  };
}

function buildCardHeaderContextMarkup(urlValue) {
  const context = parseCmRequestContext(urlValue);
  if (!context.fullUrl) {
    return '<span class="card-url-empty">No CM URL</span>';
  }

  const pathMarkup =
    context.pathSegments.length > 0
      ? context.pathSegments
          .map((segment, index) => {
            const segmentClass = `card-url-path-segment${index === context.pathSegments.length - 1 ? " card-url-path-segment-terminal" : ""}`;
            const segmentText = escapeHtml(segment);
            return `<span class="${segmentClass}">${segmentText}</span>${
              index < context.pathSegments.length - 1 ? '<span class="card-url-path-divider">/</span>' : ""
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
    ? "esm-action-btn esm-unfilter cm-clear-filter-rerun cm-clear-filter-rerun--inline"
    : "esm-action-btn esm-unfilter cm-clear-filter-rerun";
  const ariaLabel = compact
    ? "Remove local column filters and rerun this CMU table"
    : "Un-filter and rerun this CMU table";
  return `<button type="button" class="${className}" aria-label="${ariaLabel}" title="Clear this table local column filters and rerun this CMU URL"><svg class="esm-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7z"/></svg></button>`;
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
  const profileHarvestList = Array.isArray(state.profileHarvestList) ? state.profileHarvestList : [];
  const profileHarvest =
    state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : profileHarvestList[0] || null;
  const aggregatedCandidates = collectHarvestCandidateValues(profileHarvestList);
  const idpCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.idpCandidates) ? profileHarvest.idpCandidates : []),
    ...aggregatedCandidates.idpCandidates,
  ]);
  const subjectCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.subjectCandidates) ? profileHarvest.subjectCandidates : []),
    ...aggregatedCandidates.subjectCandidates,
  ]);
  const sessionCandidates = dedupeCandidateStrings([
    ...(Array.isArray(profileHarvest?.sessionCandidates) ? profileHarvest.sessionCandidates : []),
    ...aggregatedCandidates.sessionCandidates,
  ]);
  const normalized = {
    baseUrl: String(source.baseUrl || "https://streams-stage.adobeprimetime.com").trim() || "https://streams-stage.adobeprimetime.com",
    idp: firstNonEmptyString([source.idp, profileHarvest?.mvpd, ...idpCandidates, state.mvpdIds?.[0] || ""]),
    subject: firstNonEmptyString([
      source.subject,
      profileHarvest?.subject,
      profileHarvest?.upstreamUserId,
      profileHarvest?.userId,
      ...subjectCandidates,
      state.requestorIds?.[0] || "",
    ]),
    session: firstNonEmptyString([source.session, profileHarvest?.sessionId, ...sessionCandidates]),
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
    renderCardMessage(cardState, "CM V2 operation details are unavailable.", { error: true });
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
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
  });
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

  cardState.element = article;
  cardState.titleElement = article.querySelector(".card-title");
  cardState.subtitleElement = article.querySelector(".card-subtitle");
  cardState.closeButton = article.querySelector(".card-close");
  cardState.bodyElement = article.querySelector(".card-body");
}

function updateCardHeader(cardState) {
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
    cardState.titleElement.innerHTML = buildCardHeaderContextMarkup(effectiveRequestUrl);
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
  setStatus(getWorkspaceLockMessage(), "error");
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
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
    return;
  }
  const result = await sendWorkspaceAction("run-card", {
    card: getCardPayload(cardState),
  });
  if (!result?.ok) {
    renderCardMessage(cardState, result?.error || "Unable to run report from UnderPAR CM controller.", { error: true });
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

  const clearFilterButtons = cardState?.bodyElement?.querySelectorAll(".cm-clear-filter-rerun") || [];
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

function ensureCard(cardMeta) {
  const cardId = String(cardMeta?.cardId || "").trim();
  if (!cardId) {
    return null;
  }

  if (state.cardsById.has(cardId)) {
    const existing = state.cardsById.get(cardId);
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

  createCardElements(cardState);
  cardState.localColumnFilters = normalizeCmLocalColumnFilters(cardMeta?.localColumnFilters, cardState);
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    cardState.element?.remove();
    state.cardsById.delete(cardState.cardId);
    syncActionButtonsDisabled();
  });

  state.cardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  syncActionButtonsDisabled();
  return cardState;
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

function buildDefaultSortStack(headers = [], options = {}) {
  const normalizedHeaders = Array.isArray(headers) ? headers.map((header) => String(header || "").trim()).filter(Boolean) : [];
  if (options?.cmuUsage === true && options?.hasDate === true && normalizedHeaders.includes("DATE")) {
    return [{ col: "DATE", dir: "DESC" }];
  }
  return normalizedHeaders.length > 0 ? [{ col: normalizedHeaders[0], dir: "DESC" }] : [];
}

function renderCardTable(cardState, rows, lastModified) {
  const normalizedRows = normalizeRows(rows);
  if (normalizedRows.length === 0) {
    renderCardMessage(cardState, "No data");
    return;
  }

  const usageCard = isCmuUsageCard(cardState);
  const genericHeaders = Array.from(
    new Set([
      ...(Array.isArray(cardState.columns) ? cardState.columns : []),
      ...Object.keys(normalizedRows[0] || {}),
    ])
  ).filter((header) => {
    const normalizedHeader = String(header || "").trim();
    return normalizedHeader && !normalizedHeader.startsWith("__");
  });
  const hasDate = usageCard;
  const hasAuthN =
    usageCard &&
    normalizedRows.some(
      (row) => getRowValueByColumn(row, "authn-attempts") != null && getRowValueByColumn(row, "authn-successful") != null
    );
  const hasAuthZ =
    usageCard &&
    normalizedRows.some(
      (row) => getRowValueByColumn(row, "authz-attempts") != null && getRowValueByColumn(row, "authz-successful") != null
    );
  const hasCount = usageCard && normalizedRows.some((row) => getRowValueByColumn(row, "count") != null);
  const displayColumns = usageCard ? getCmuUsageDisplayColumns(cardState) : [];
  const headers = usageCard
    ? [
        ...(hasDate ? ["DATE"] : []),
        ...(hasAuthN ? ["AuthN Success"] : []),
        ...(hasAuthZ ? ["AuthZ Success"] : []),
        ...(!hasAuthN && !hasAuthZ && hasCount ? ["COUNT"] : []),
        ...displayColumns,
      ]
    : genericHeaders;

  cardState.bodyElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer">
                <a href="#" class="cm-csv-link">CSV</a>
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
  const csvLink = cardState.bodyElement.querySelector(".cm-csv-link");
  const closeButton = cardState.bodyElement.querySelector(".esm-close");

  const tableState = {
    wrapper: tableWrapper,
    table,
    thead,
    tbody,
    mode: usageCard ? "cmu-usage" : "generic",
    headers,
    data: normalizedRows,
    sortStack: buildDefaultSortStack(headers, { cmuUsage: usageCard, hasDate }),
    hasDate,
    hasAuthN,
    hasAuthZ,
    hasCount,
    displayColumns,
    context: usageCard
      ? {
          mode: "cmu-usage",
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
      const result = await sendWorkspaceAction("download-csv", {
        card: {
          ...getCardPayload(cardState),
          rows: Array.isArray(cardState.rows) ? cardState.rows : [],
        },
        sortRule: cardState.sortStack?.[0] || tableState.sortStack?.[0] || null,
      });
      if (!result?.ok) {
        setStatus(result?.error || "Unable to download CM CSV.", "error");
      } else {
        setStatus("CM CSV download started.");
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
  cardState.sourceRows = [];
  cardState.sortStack = [];
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Loading report...");
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  syncWorkspaceNetworkIndicator();
}

function applyReportForm(payload) {
  const cardState = ensureCard(payload);
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

  const rows = normalizeRows(Array.isArray(payload?.rows) ? payload.rows : []);
  cardState.sourceRows = rows;
  initializeCardLocalFilterBaseline(cardState, rows);
  const filteredRows = applyCmLocalColumnFiltersToRows(rows, cardState.localColumnFilters, cardState);
  cardState.rows = filteredRows;
  cardState.lastModified = String(payload?.lastModified || "");
  cardState.sortStack = [];
  updateCardHeader(cardState);

  if (filteredRows.length === 0) {
    renderCardMessage(cardState, "No data");
    syncWorkspaceNetworkIndicator();
    return;
  }

  renderCardTable(cardState, filteredRows, cardState.lastModified);
  syncWorkspaceNetworkIndicator();
}

function applyControllerState(payload) {
  state.controllerOnline = payload?.controllerOnline === true;
  if (payload?.cmAvailable === true) {
    state.cmAvailable = true;
  } else if (payload?.cmAvailable === false) {
    state.cmAvailable = false;
  } else {
    state.cmAvailable = null;
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

  state.cardsById.forEach((cardState) => {
    if (!normalizeOperationDescriptor(cardState?.operation)) {
      return;
    }
    const existingValues = cardState.formValues && typeof cardState.formValues === "object" ? cardState.formValues : {};
    cardState.formValues = normalizeOperationFormValues(cardState.operation, {
      baseUrl: String(existingValues.baseUrl || "").trim(),
      authUser: String(existingValues.authUser || "").trim(),
      authPass: String(existingValues.authPass || "").trim(),
      xTerminate: String(existingValues.xTerminate || "").trim(),
    });
    if (cardState.bodyElement?.querySelector(".cm-api-form")) {
      renderOperationFormCard(cardState, {
        formValues: cardState.formValues,
      });
    }
  });

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
  if (event === "report-form") {
    applyReportForm(payload);
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
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  if (String(action || "").trim().toLowerCase() !== "workspace-ready" && !ensureWorkspaceUnlocked()) {
    return { ok: false, error: getWorkspaceLockMessage() };
  }
  try {
    return await chrome.runtime.sendMessage({
      type: CM_MESSAGE_TYPE,
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
  }
}

function clearWorkspace() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  state.cardsById.forEach((cardState) => {
    cardState.element?.remove();
  });
  state.cardsById.clear();
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

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== CM_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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
  updateWorkspaceLockState();
  updateControllerBanner();

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR CM controller.", "error");
  }
}

void init();
