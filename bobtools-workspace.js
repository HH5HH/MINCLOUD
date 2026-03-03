const BOBTOOLS_WORKSPACE_MESSAGE_TYPE = "underpar:bobtools-workspace";

const ACTION_PREAUTHORIZE = "preauthorize";
const ACTION_AUTHORIZE = "authorize";
const ACTION_PROFILES_MVPD = "profiles-mvpd";
const ACTION_PROFILES_ALL = "profiles-all";
const ACTION_CONFIGURATION = "configuration";
const SPLUNK_PREVIEW_MAX_ROWS = 120;
const SPLUNK_DOWNLOAD_MAX_ROWS = 1000;
const SPLUNK_RAW_PREVIEW_MAX_FIELDS = 16;
const SPLUNK_RAW_PREVIEW_MAX_TEXT = 720;
const SPLUNK_XML_ARTIFACT_MAX_PER_EVENT = 4;
const SPLUNK_METRICS_MARKER = "[METRICS]";
const SPLUNK_RAW_IGNORED_KEYS = new Set(["trunc", "tokens", "segment_tree", "linecount", "_time", "time", "timestamp"]);

const state = {
  windowId: 0,
  controllerOnline: false,
  bobtoolsReady: false,
  programmerId: "",
  programmerName: "",
  userLabel: "",
  requestorId: "",
  mvpd: "",
  mvpdLabel: "",
  selectedHarvestKey: "",
  profiles: [],
  running: false,
  splunkRunning: false,
  apiAction: ACTION_PREAUTHORIZE,
  collapsedCards: {
    profiles: false,
    watch: false,
    splunk: false,
  },
  resultByHarvestActionKey: new Map(),
  resourceInputByHarvestKey: new Map(),
  splunkResultByHarvestKey: new Map(),
  splunkDownloadUrl: "",
  splunkArtifactDownloadUrls: [],
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  refreshButton: document.getElementById("workspace-refresh"),
  clearButton: document.getElementById("workspace-clear"),
  heroIcon: document.getElementById("bobtools-hero-icon"),
  greeting: document.getElementById("bobtools-greeting"),
  subtitle: document.getElementById("bobtools-subtitle"),
  profileCount: document.getElementById("bobtools-profile-count"),
  profileList: document.getElementById("bobtools-profile-list"),
  profileContext: document.getElementById("bobtools-profile-context"),
  form: document.getElementById("bobtools-form"),
  resourceInput: document.getElementById("bobtools-resource-input"),
  actionHint: document.getElementById("bobtools-action-hint"),
  goButton: document.getElementById("bobtools-go"),
  splunkButton: document.getElementById("bobtools-splunk"),
  resultStatus: document.getElementById("bobtools-result-status"),
  resultSummary: document.getElementById("bobtools-result-summary"),
  splunkCard: document.getElementById("bobtools-splunk-card"),
  splunkCardMeta: document.getElementById("bobtools-splunk-card-meta"),
  splunkCardBody: document.getElementById("bobtools-splunk-body"),
  splunkStatus: document.getElementById("bobtools-splunk-status"),
  splunkSummary: document.getElementById("bobtools-splunk-summary"),
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

function normalizeApiAction(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return ACTION_PREAUTHORIZE;
  }
  if (
    normalized === ACTION_PREAUTHORIZE ||
    normalized === "can-i-watch" ||
    normalized === "can_i_watch" ||
    normalized === "caniwatch"
  ) {
    return ACTION_PREAUTHORIZE;
  }
  if (normalized === ACTION_AUTHORIZE) {
    return ACTION_AUTHORIZE;
  }
  if (normalized === ACTION_PROFILES_MVPD || normalized === "profiles" || normalized === "profiles_mvpd") {
    return ACTION_PROFILES_MVPD;
  }
  if (normalized === ACTION_PROFILES_ALL || normalized === "profiles_all" || normalized === "profilesall") {
    return ACTION_PROFILES_ALL;
  }
  if (normalized === ACTION_CONFIGURATION || normalized === "config") {
    return ACTION_CONFIGURATION;
  }
  return ACTION_PREAUTHORIZE;
}

function getApiActionLabel(action = "") {
  const normalized = normalizeApiAction(action);
  if (normalized === ACTION_AUTHORIZE) {
    return "Authorize";
  }
  if (normalized === ACTION_PROFILES_MVPD) {
    return "Profiles (selected MVPD)";
  }
  if (normalized === ACTION_PROFILES_ALL) {
    return "Profiles (all MVPD)";
  }
  if (normalized === ACTION_CONFIGURATION) {
    return "Configuration";
  }
  return "Can I watch? (Preauthorize)";
}

function actionRequiresResources(action = "") {
  const normalized = normalizeApiAction(action);
  return normalized === ACTION_PREAUTHORIZE;
}

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getSelectedProfile() {
  const key = String(state.selectedHarvestKey || "").trim();
  if (!key) {
    return null;
  }
  return state.profiles.find((profile) => String(profile?.key || "") === key) || null;
}

function buildResultMapKey(harvestKey = "", action = "") {
  return `${String(harvestKey || "").trim()}::${normalizeApiAction(action)}`;
}

function getResultForProfile(profile = null) {
  const key = String(profile?.key || "").trim();
  if (!key) {
    return null;
  }
  return state.resultByHarvestActionKey.get(buildResultMapKey(key, state.apiAction)) || null;
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  if (!els.status) {
    return;
  }
  els.status.textContent = text;
  els.status.classList.remove("error");
  if (type === "error" && text) {
    els.status.classList.add("error");
  }
}

function getSplunkButtonLabel(profile = null, options = {}) {
  const upstreamUserId = String(profile?.upstreamUserId || "").trim();
  if (!upstreamUserId) {
    return options?.loading === true ? "SPLUNK..." : "SPLUNK";
  }
  const baseLabel = `SPLUNK "${upstreamUserId}"`;
  return options?.loading === true ? `${baseLabel}...` : baseLabel;
}

function syncButtons() {
  const selectedProfile = getSelectedProfile();
  const hasProfile = Boolean(selectedProfile);
  const hasUpstreamUserId = Boolean(String(selectedProfile?.upstreamUserId || "").trim());
  const action = normalizeApiAction(state.apiAction);
  const resourcesRequired = actionRequiresResources(action);
  const networkBusy = state.running || state.splunkRunning;
  if (els.goButton) {
    els.goButton.disabled = !hasProfile || networkBusy;
    els.goButton.textContent = state.running ? "GO..." : "GO";
  }
  if (els.resourceInput) {
    els.resourceInput.disabled = !hasProfile || networkBusy || !resourcesRequired;
  }
  if (els.splunkButton) {
    els.splunkButton.disabled = !hasProfile || !hasUpstreamUserId || networkBusy;
    els.splunkButton.textContent = getSplunkButtonLabel(selectedProfile, { loading: state.splunkRunning });
  }
  if (els.refreshButton) {
    els.refreshButton.disabled = networkBusy;
  }
  if (els.clearButton) {
    els.clearButton.disabled = networkBusy || !hasProfile;
  }
}

function syncActionInputState() {
  if (!els.resourceInput || !els.actionHint) {
    return;
  }
  els.resourceInput.placeholder = "RESOURCE_ID_1, RESOURCE_ID_2";
  els.actionHint.textContent = "Can I watch? uses REST V2 Preauthorize with comma-delimited resourceIds.";
}

function syncCardCollapseState() {
  const toggleButtons = document.querySelectorAll("[data-card-toggle]");
  toggleButtons.forEach((button) => {
    const cardKey = String(button.getAttribute("data-card-toggle") || "").trim();
    if (!cardKey) {
      return;
    }
    const collapsed = state.collapsedCards?.[cardKey] === true;
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    const card = button.closest(".bobtools-card");
    if (card) {
      card.classList.toggle("is-collapsed", collapsed);
    }
    const body =
      card?.querySelector(`[data-card-body="${cardKey}"]`) ||
      document.querySelector(`.bobtools-card-body[data-card-body="${cardKey}"]`);
    if (body) {
      body.hidden = collapsed;
    }
  });
}

function renderHeader() {
  if (els.controllerState) {
    els.controllerState.textContent = `BOBTOOLS Workspace | ${getProgrammerLabel()}`;
  }

  const selectedProfile = getSelectedProfile();
  const selectedLabel = firstNonEmptyString([
    selectedProfile?.requestorMvpdLabel,
    selectedProfile?.mvpdLabel,
    state.mvpdLabel,
    state.mvpd,
    "selected MVPD",
  ]);
  const userLabel = firstNonEmptyString([state.userLabel, "UnderPAR user"]);

  if (els.filterState) {
    const requestor = firstNonEmptyString([selectedProfile?.requestorId, state.requestorId]);
    const mvpd = firstNonEmptyString([selectedProfile?.mvpdLabel, state.mvpdLabel, state.mvpd]);
    const upstream = firstNonEmptyString([selectedProfile?.upstreamUserId, selectedProfile?.subject]);
    els.filterState.textContent = `Requestor: ${requestor || "N/A"} | MVPD: ${mvpd || "N/A"} | upstreamUserID=${upstream || "N/A"}`;
  }
  if (els.greeting) {
    els.greeting.textContent = `Hey ${userLabel},`;
  }
  if (els.subtitle) {
    els.subtitle.textContent = `We have a successful authenticated MVPD Profile from ${selectedLabel}. You can now use BOBTOOLS!`;
  }
}

function renderProfileList() {
  if (!els.profileList) {
    return;
  }
  const profiles = Array.isArray(state.profiles) ? state.profiles : [];
  if (els.profileCount) {
    els.profileCount.textContent = String(profiles.length);
  }
  if (profiles.length === 0) {
    els.profileList.innerHTML = '<li><p class="bobtools-profile-empty">No successful MVPD login profiles yet. Complete one MVPD login to unlock BOBTOOLS.</p></li>';
    return;
  }

  const selectedKey = String(state.selectedHarvestKey || "").trim();
  els.profileList.innerHTML = profiles
    .map((profile) => {
      const key = String(profile?.key || "").trim();
      const active = key && key === selectedKey;
      const title = firstNonEmptyString([profile?.requestorMvpdLabel, profile?.mvpdLabel, profile?.mvpd, "MVPD profile"]);
      const subtitle = firstNonEmptyString([profile?.upstreamUserId, profile?.subject, profile?.userId, "N/A"]);
      const capturedAt = firstNonEmptyString([profile?.capturedAtLabel, formatDateTime(profile?.capturedAt)]);
      const summary = firstNonEmptyString([profile?.lastCheckSummary, "No REST V2 checks yet"]);
      return `
        <li class="bobtools-profile-item${active ? " is-active" : ""}" data-profile-key="${escapeHtml(key)}">
          <div class="bobtools-profile-row">
            <button type="button" class="bobtools-profile-select" data-select-key="${escapeHtml(key)}" aria-label="Select ${escapeHtml(title)}">
              <p class="bobtools-profile-title">${escapeHtml(title)}</p>
              <p class="bobtools-profile-meta">${escapeHtml(subtitle)} | ${escapeHtml(capturedAt)}</p>
              <p class="bobtools-profile-check">${escapeHtml(summary)}</p>
            </button>
            <button type="button" class="bobtools-profile-delete" data-delete-key="${escapeHtml(key)}" aria-label="Delete profile" title="Delete profile">×</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function buildDecisionReason(row = null) {
  const errorCode = String(row?.errorCode || "").trim();
  const errorDetails = String(row?.errorDetails || "").trim();
  if (errorCode) {
    return `${errorCode}${errorDetails ? `: ${errorDetails}` : ""}`;
  }
  const source = String(row?.source || "").trim();
  if (source) {
    return `source=${source}`;
  }
  return "No additional details";
}

function renderDecisionsResult(result = null) {
  if (!els.resultStatus || !els.resultSummary) {
    return;
  }
  const actionLabel = firstNonEmptyString([result?.apiActionLabel, getApiActionLabel(state.apiAction)]);
  const checkedAtLabel = formatDateTime(result?.checkedAt);
  const resources = Array.isArray(result?.resourceIds) ? result.resourceIds.join(", ") : "";
  const permit = Number(result?.permitCount || 0);
  const deny = Number(result?.denyCount || 0);
  const unknown = Number(result?.unknownCount || 0);
  const verdict = result?.allRequestedPermitted ? "YES" : "NO";

  els.resultStatus.classList.remove("error", "success");
  if (result?.ok === true && result?.allRequestedPermitted) {
    els.resultStatus.classList.add("success");
  } else {
    els.resultStatus.classList.add("error");
  }
  els.resultStatus.textContent =
    result?.ok === true
      ? `${actionLabel}: ${verdict} (${permit} permit, ${deny} deny, ${unknown} unknown)`
      : `${actionLabel}: NO (${String(result?.error || "request_failed")})`;

  const decisions = Array.isArray(result?.decisionRows) ? result.decisionRows : [];
  const decisionMarkup = decisions
    .map((row) => {
      const decisionRaw = String(row?.decision || "").trim().toLowerCase();
      const verdictClass = decisionRaw === "permit" ? "permit" : decisionRaw === "deny" ? "deny" : "unknown";
      return `
        <li class="bobtools-decision-item">
          <span class="bobtools-decision-resource">${escapeHtml(String(row?.resourceId || ""))}</span>
          <span class="bobtools-decision-verdict ${escapeHtml(verdictClass)}">${escapeHtml(String(row?.decision || "Unknown"))}</span>
          <span class="bobtools-decision-reason">${escapeHtml(buildDecisionReason(row))}</span>
        </li>
      `;
    })
    .join("");

  const status = Number(result?.status || 0);
  const statusText = String(result?.statusText || "").trim();
  const endpoint = String(result?.endpointUrl || "").trim();
  const method = String(result?.method || "POST").trim().toUpperCase();
  const requestLabel = resources || "N/A";

  els.resultSummary.hidden = false;
  els.resultSummary.innerHTML = `
    <p class="bobtools-result-head"><strong>Action:</strong> ${escapeHtml(actionLabel)} | <strong>Request:</strong> ${escapeHtml(requestLabel)} | <strong>Checked:</strong> ${escapeHtml(checkedAtLabel)}</p>
    ${decisions.length > 0 ? `<ul class="bobtools-decision-list">${decisionMarkup}</ul>` : ""}
    <p class="bobtools-result-meta">${escapeHtml(method)} ${escapeHtml(endpoint)} | HTTP ${escapeHtml(String(status))} ${escapeHtml(statusText)}</p>
  `;
}

function renderProfilesResult(result = null) {
  if (!els.resultStatus || !els.resultSummary) {
    return;
  }
  const actionLabel = firstNonEmptyString([result?.apiActionLabel, getApiActionLabel(state.apiAction)]);
  const checkedAtLabel = formatDateTime(result?.checkedAt);
  const profileRows = Array.isArray(result?.profileRows) ? result.profileRows : [];

  els.resultStatus.classList.remove("error", "success");
  if (result?.ok === true) {
    els.resultStatus.classList.add("success");
    els.resultStatus.textContent = `${actionLabel}: ${profileRows.length} profile${profileRows.length === 1 ? "" : "s"} returned`;
  } else {
    els.resultStatus.classList.add("error");
    els.resultStatus.textContent = `${actionLabel}: ERROR (${String(result?.error || "request_failed")})`;
  }

  const rowMarkup = profileRows
    .map((row) => {
      const attributeRows = Array.isArray(row?.attributes) ? row.attributes : [];
      const attributeMarkup =
        attributeRows.length > 0
          ? `<ul class="bobtools-attribute-list">${attributeRows
              .map(
                (attribute) =>
                  `<li class="bobtools-attribute-item"><span class="bobtools-attribute-key">${escapeHtml(
                    String(attribute?.key || "")
                  )}</span><span class="bobtools-attribute-value">${escapeHtml(String(attribute?.value || ""))}</span></li>`
              )
              .join("")}</ul>`
          : '<p class="bobtools-profile-row-empty">No profile attributes returned.</p>';
      return `
        <li class="bobtools-profile-result-item">
          <p class="bobtools-profile-result-head"><strong>${escapeHtml(String(row?.profileKey || "N/A"))}</strong> | ${escapeHtml(
            String(row?.mvpd || "N/A")
          )}</p>
          <div class="bobtools-profile-result-grid">
            <span><strong>subject</strong> ${escapeHtml(String(row?.subject || "N/A"))}</span>
            <span><strong>upstreamUserID</strong> ${escapeHtml(String(row?.upstreamUserId || "N/A"))}</span>
            <span><strong>userID</strong> ${escapeHtml(String(row?.userId || "N/A"))}</span>
            <span><strong>session</strong> ${escapeHtml(String(row?.sessionId || "N/A"))}</span>
            <span><strong>TTL</strong> ${escapeHtml(formatDateTime(row?.notBeforeMs))} -> ${escapeHtml(formatDateTime(row?.notAfterMs))}</span>
          </div>
          ${attributeMarkup}
        </li>
      `;
    })
    .join("");

  const status = Number(result?.status || 0);
  const statusText = String(result?.statusText || "").trim();
  const endpoint = String(result?.endpointUrl || "").trim();
  const method = String(result?.method || "GET").trim().toUpperCase();

  els.resultSummary.hidden = false;
  els.resultSummary.innerHTML = `
    <p class="bobtools-result-head"><strong>Action:</strong> ${escapeHtml(actionLabel)} | <strong>Checked:</strong> ${escapeHtml(checkedAtLabel)} | <strong>Profiles:</strong> ${escapeHtml(
      String(profileRows.length)
    )}</p>
    ${
      rowMarkup
        ? `<ul class="bobtools-profile-result-list">${rowMarkup}</ul>`
        : '<p class="bobtools-profile-row-empty">No profiles were returned for this request.</p>'
    }
    <p class="bobtools-result-meta">${escapeHtml(method)} ${escapeHtml(endpoint)} | HTTP ${escapeHtml(String(status))} ${escapeHtml(statusText)}</p>
  `;
}

function renderConfigurationResult(result = null) {
  if (!els.resultStatus || !els.resultSummary) {
    return;
  }
  const actionLabel = firstNonEmptyString([result?.apiActionLabel, getApiActionLabel(state.apiAction)]);
  const checkedAtLabel = formatDateTime(result?.checkedAt);
  const rows = Array.isArray(result?.mvpdRows) ? result.mvpdRows : [];
  const previewRows = rows.slice(0, 120);

  els.resultStatus.classList.remove("error", "success");
  if (result?.ok === true) {
    els.resultStatus.classList.add("success");
    els.resultStatus.textContent = `${actionLabel}: ${rows.length} MVPD config entries`;
  } else {
    els.resultStatus.classList.add("error");
    els.resultStatus.textContent = `${actionLabel}: ERROR (${String(result?.error || "request_failed")})`;
  }

  const rowMarkup = previewRows
    .map(
      (row) => `
      <li class="bobtools-config-item">
        <span class="bobtools-config-id">${escapeHtml(String(row?.id || ""))}</span>
        <span class="bobtools-config-name">${escapeHtml(String(row?.name || ""))}</span>
        <span class="bobtools-config-meta">proxy=${row?.isProxy === true ? "true" : "false"}${
          row?.boardingStatus ? ` | boarding=${escapeHtml(String(row.boardingStatus))}` : ""
        }</span>
      </li>
    `
    )
    .join("");

  const status = Number(result?.status || 0);
  const statusText = String(result?.statusText || "").trim();
  const endpoint = String(result?.endpointUrl || "").trim();
  const method = String(result?.method || "GET").trim().toUpperCase();

  els.resultSummary.hidden = false;
  els.resultSummary.innerHTML = `
    <p class="bobtools-result-head"><strong>Action:</strong> ${escapeHtml(actionLabel)} | <strong>Checked:</strong> ${escapeHtml(checkedAtLabel)} | <strong>Rows:</strong> ${escapeHtml(
      String(rows.length)
    )}</p>
    ${rowMarkup ? `<ul class="bobtools-config-list">${rowMarkup}</ul>` : '<p class="bobtools-profile-row-empty">No MVPD entries were returned.</p>'}
    ${rows.length > previewRows.length ? `<p class="bobtools-result-meta">Showing ${previewRows.length} of ${rows.length} rows.</p>` : ""}
    <p class="bobtools-result-meta">${escapeHtml(method)} ${escapeHtml(endpoint)} | HTTP ${escapeHtml(String(status))} ${escapeHtml(statusText)}</p>
  `;
}

function getSplunkResultForProfile(profile = null) {
  const key = String(profile?.key || "").trim();
  if (!key) {
    return null;
  }
  return state.splunkResultByHarvestKey.get(key) || null;
}

function releaseSplunkDownloadUrl() {
  const url = String(state.splunkDownloadUrl || "").trim();
  if (!url) {
    return;
  }
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Ignore URL revoke errors.
  }
  state.splunkDownloadUrl = "";
}

function releaseSplunkArtifactDownloadUrls() {
  const urls = Array.isArray(state.splunkArtifactDownloadUrls) ? state.splunkArtifactDownloadUrls : [];
  urls.forEach((url) => {
    const normalized = String(url || "").trim();
    if (!normalized) {
      return;
    }
    try {
      URL.revokeObjectURL(normalized);
    } catch {
      // Ignore URL revoke errors.
    }
  });
  state.splunkArtifactDownloadUrls = [];
}

function normalizeSplunkPlainText(value = "", maxLength = SPLUNK_RAW_PREVIEW_MAX_TEXT) {
  const compact = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^\s*[{[]\s*/, "")
    .replace(/\s*[}\]]\s*$/, "")
    .trim();
  if (!compact) {
    return "";
  }
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, Math.max(64, maxLength)).trim()}...`;
}

function formatSplunkTimeLabel(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return "N/A";
  }
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }
  return parsed.toLocaleString();
}

function getSplunkRawMetricsPayload(rawValue = "") {
  const rawText = String(rawValue || "").trim();
  if (!rawText) {
    return "";
  }
  const markerIndex = rawText.toUpperCase().indexOf(SPLUNK_METRICS_MARKER);
  if (markerIndex < 0) {
    return rawText;
  }
  return rawText.slice(markerIndex + SPLUNK_METRICS_MARKER.length).trim();
}

function shouldIgnoreSplunkRawKey(key = "") {
  const normalized = String(key || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (SPLUNK_RAW_IGNORED_KEYS.has(normalized)) {
    return true;
  }
  const dotParts = normalized.split(".");
  const tail = String(dotParts[dotParts.length - 1] || "").trim();
  return Boolean(tail && SPLUNK_RAW_IGNORED_KEYS.has(tail));
}

function parseSplunkRawJson(rawValue = "") {
  const input = getSplunkRawMetricsPayload(rawValue);
  if (!input) {
    return null;
  }
  const parseOnce = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };
  const first = parseOnce(input);
  if (first == null) {
    return null;
  }
  if (typeof first === "string") {
    const second = parseOnce(first);
    return second == null ? null : second;
  }
  return first;
}

function decodeSplunkRawPairValue(value = "") {
  const plusDecoded = String(value || "").replace(/\+/g, " ");
  try {
    return decodeURIComponent(plusDecoded);
  } catch {
    return plusDecoded;
  }
}

function isLikelySplunkRawPairKey(value = "") {
  const key = String(value || "").trim();
  if (!key || key.length > 120 || /^\d+$/.test(key)) {
    return false;
  }
  return /^[A-Za-z0-9_.-]+$/.test(key);
}

function extractSplunkRawEntriesFromText(rawValue = "") {
  const text = getSplunkRawMetricsPayload(rawValue);
  if (!text) {
    return [];
  }
  const source = String(text || "");
  if (!source.trim()) {
    return [];
  }
  const entries = [];
  const pushEntry = (rawKey, rawValueText) => {
    if (entries.length >= SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
      return;
    }
    const key = decodeSplunkRawPairValue(rawKey).trim();
    if (!key) {
      return;
    }
    const value = decodeSplunkRawPairValue(rawValueText).trim();
    entries.push({
      key,
      value: String(value || ""),
    });
  };

  const queryStylePattern = /(?:^|[&\n;|])\s*([A-Za-z0-9_.-]+)\s*=/g;
  const queryMatches = [];
  let queryMatch = queryStylePattern.exec(source);
  while (queryMatch && queryMatches.length < SPLUNK_RAW_PREVIEW_MAX_FIELDS * 3) {
    const rawKey = String(queryMatch[1] || "");
    if (rawKey.trim()) {
      const matchText = String(queryMatch[0] || "");
      const keyOffsetInMatch = matchText.lastIndexOf(rawKey);
      const keyStart = queryMatch.index + (keyOffsetInMatch >= 0 ? keyOffsetInMatch : 0);
      queryMatches.push({
        key: rawKey,
        keyStart,
        valueStart: queryStylePattern.lastIndex,
      });
    }
    queryMatch = queryStylePattern.exec(source);
  }
  if (queryMatches.length > 0) {
    queryMatches.forEach((entry, index) => {
      if (entries.length >= SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
        return;
      }
      const valueEnd = index + 1 < queryMatches.length ? queryMatches[index + 1].keyStart : source.length;
      const valueSlice = source
        .slice(entry.valueStart, valueEnd)
        .replace(/^[ \t\r\n&;|]+/, "")
        .replace(/[ \t\r\n&;|]+$/, "");
      pushEntry(entry.key, valueSlice);
    });
    if (entries.length > 0) {
      return entries;
    }
  }

  const loosePattern = /(?:^|[,\n;|])\s*([A-Za-z0-9_.-]+)\s*[:=]\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|[^,\n;|]+)/g;
  let looseMatch = loosePattern.exec(source);
  while (looseMatch && entries.length < SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
    pushEntry(String(looseMatch[1] || ""), String(looseMatch[2] || "").replace(/^['"]|['"]$/g, ""));
    looseMatch = loosePattern.exec(source);
  }
  if (entries.length > 0) {
    return entries;
  }

  const lines = source
    .split(/\r?\n/)
    .map((line) => String(line || "").trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return entries;
  }
  for (let index = 0; index < lines.length && entries.length < SPLUNK_RAW_PREVIEW_MAX_FIELDS; index += 1) {
    const key = String(lines[index] || "").trim();
    if (!isLikelySplunkRawPairKey(key) || index + 1 >= lines.length) {
      continue;
    }
    let cursor = index + 1;
    const valueLines = [];
    while (cursor < lines.length) {
      const candidate = String(lines[cursor] || "").trim();
      const nextLooksKey = isLikelySplunkRawPairKey(candidate) && cursor + 1 < lines.length;
      if (nextLooksKey && valueLines.length > 0) {
        break;
      }
      valueLines.push(candidate);
      cursor += 1;
    }
    if (valueLines.length > 0) {
      pushEntry(key, valueLines.join("\n"));
      index = Math.max(index, cursor - 1);
    }
  }
  return entries;
}

function extractLikelyXmlPayload(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  const candidates = [
    text.indexOf("<?xml"),
    text.search(/<soap[0-9a-z]*:Envelope\b/i),
    text.search(/<saml[0-9a-z]*:/i),
    text.search(/<[A-Za-z_][A-Za-z0-9_.:-]*\b/),
  ].filter((index) => Number.isFinite(index) && index >= 0);
  if (candidates.length === 0) {
    return "";
  }
  const start = Math.min(...candidates);
  return text.slice(start).trim();
}

function isSplunkXmlPayload(value = "") {
  const xmlCandidate = extractLikelyXmlPayload(value);
  if (!xmlCandidate) {
    return false;
  }
  return /^<\?xml\b/i.test(xmlCandidate) || /^<[A-Za-z_][A-Za-z0-9_.:-]*\b/.test(xmlCandidate);
}

function prettyPrintSplunkXml(value = "") {
  const xmlCandidate = extractLikelyXmlPayload(value).replace(/>\s+</g, "><").trim();
  if (!xmlCandidate) {
    return "";
  }

  const rows = xmlCandidate.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n");
  let indent = 0;
  const output = [];
  rows.forEach((line) => {
    const normalizedLine = String(line || "").trim();
    if (!normalizedLine) {
      return;
    }
    if (/^<\/[^>]+>/.test(normalizedLine)) {
      indent = Math.max(0, indent - 1);
    }
    output.push(`${"  ".repeat(indent)}${normalizedLine}`);
    const opens = (normalizedLine.match(/<[^/!?][^>]*>/g) || []).length;
    const closes = (normalizedLine.match(/<\/[^>]+>/g) || []).length;
    const selfClosing = (normalizedLine.match(/<[^>]+\/>/g) || []).length;
    const declarations = (normalizedLine.match(/<\?[^>]+\?>/g) || []).length + (normalizedLine.match(/<![^>]+>/g) || []).length;
    const delta = opens - closes - selfClosing - declarations;
    if (delta > 0) {
      indent += delta;
    }
  });
  return output.join("\n").trim();
}

function sanitizeSplunkFileToken(value = "", fallback = "artifact") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
}

function createSplunkXmlArtifactDownload(xmlText = "", options = {}) {
  const rawXml = String(xmlText || "").trim();
  if (!rawXml) {
    return null;
  }
  const blob = new Blob([rawXml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  if (!Array.isArray(state.splunkArtifactDownloadUrls)) {
    state.splunkArtifactDownloadUrls = [];
  }
  state.splunkArtifactDownloadUrls.push(url);

  const requestor = sanitizeSplunkFileToken(options.requestorId || state.requestorId, "requestor");
  const mvpd = sanitizeSplunkFileToken(options.mvpd || state.mvpd, "mvpd");
  const label = sanitizeSplunkFileToken(options.label || options.kind || "xml", "xml");
  const rowPart = `row${Math.max(1, Number(options.rowIndex || 1))}`;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    url,
    filename: `underpar_splunk_${requestor}_${mvpd}_${label}_${rowPart}_${stamp}.xml`,
  };
}

function collectSplunkXmlArtifacts(rawValue = "") {
  const artifacts = [];
  const seen = new Set();
  const pushArtifact = (label, candidateValue) => {
    const xmlRaw = extractLikelyXmlPayload(candidateValue);
    if (!isSplunkXmlPayload(xmlRaw)) {
      return;
    }
    const key = xmlRaw.toLowerCase();
    if (!xmlRaw || seen.has(key)) {
      return;
    }
    seen.add(key);
    const xmlPretty = prettyPrintSplunkXml(xmlRaw);
    const lowered = `${String(label || "").toLowerCase()} ${xmlRaw.toLowerCase()}`;
    const kind = lowered.includes("saml") ? "saml" : lowered.includes("soap") || lowered.includes("envelope") ? "soap" : "xml";
    artifacts.push({
      label: String(label || kind).trim() || kind,
      kind,
      xmlRaw,
      xmlPretty: xmlPretty || xmlRaw,
    });
  };

  const parsed = parseSplunkRawJson(rawValue);
  const walk = (value, path = "", depth = 0) => {
    if (artifacts.length >= SPLUNK_XML_ARTIFACT_MAX_PER_EVENT || depth > 4 || value == null) {
      return;
    }
    if (typeof value === "string") {
      pushArtifact(path || "value", value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        walk(entry, `${path || "item"}[${index}]`, depth + 1);
      });
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([key, entry]) => {
        walk(entry, path ? `${path}.${key}` : key, depth + 1);
      });
    }
  };
  if (parsed != null) {
    walk(parsed, "", 0);
  }

  extractSplunkRawEntriesFromText(rawValue).forEach((entry) => {
    if (artifacts.length < SPLUNK_XML_ARTIFACT_MAX_PER_EVENT) {
      pushArtifact(entry.key, entry.value);
    }
  });

  if (artifacts.length < SPLUNK_XML_ARTIFACT_MAX_PER_EVENT) {
    pushArtifact("payload", getSplunkRawMetricsPayload(rawValue));
  }
  return artifacts.slice(0, SPLUNK_XML_ARTIFACT_MAX_PER_EVENT);
}

function collectSplunkRawPairs(value = null, output = [], prefix = "", depth = 0) {
  if (output.length >= SPLUNK_RAW_PREVIEW_MAX_FIELDS || value == null) {
    return;
  }
  const maxDepth = 1;
  const isPrimitive = (entry) =>
    entry == null || typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean";
  const pushPair = (key, raw) => {
    if (output.length >= SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
      return;
    }
    const keyLabel = String(key || "value").trim() || "value";
    if (shouldIgnoreSplunkRawKey(keyLabel)) {
      return;
    }
    let valueLabel = "";
    if (raw == null) {
      valueLabel = "";
    } else if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
      valueLabel = String(raw);
    } else if (Array.isArray(raw)) {
      if (raw.length === 0) {
        valueLabel = "";
      } else if (raw.every((entry) => isPrimitive(entry))) {
        valueLabel = raw.map((entry) => String(entry ?? "")).join(", ");
      } else {
        valueLabel = `${raw.length} entries`;
      }
    } else if (typeof raw === "object") {
      valueLabel = "structured payload";
    } else {
      valueLabel = String(raw);
    }
    output.push({
      key: keyLabel,
      value: String(valueLabel || ""),
    });
  };

  if (isPrimitive(value)) {
    pushPair(prefix || "value", value);
    return;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      pushPair(prefix || "list", "");
      return;
    }
    if (depth >= maxDepth) {
      pushPair(prefix || "list", `${value.length} entries`);
      return;
    }
    value.slice(0, SPLUNK_RAW_PREVIEW_MAX_FIELDS).forEach((entry, index) => {
      collectSplunkRawPairs(entry, output, `${prefix || "item"}[${index}]`, depth + 1);
    });
    return;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      pushPair(prefix || "payload", "");
      return;
    }
    entries.forEach(([key, entryValue]) => {
      if (output.length >= SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
        return;
      }
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (isPrimitive(entryValue) || depth >= maxDepth) {
        pushPair(nextKey, entryValue);
        return;
      }
      collectSplunkRawPairs(entryValue, output, nextKey, depth + 1);
    });
    return;
  }
  pushPair(prefix || "value", String(value));
}

function extractSplunkRawPairsFromText(rawValue = "") {
  return extractSplunkRawEntriesFromText(rawValue)
    .filter((entry) => !shouldIgnoreSplunkRawKey(entry?.key))
    .slice(0, SPLUNK_RAW_PREVIEW_MAX_FIELDS)
    .map((entry) => ({
      key: String(entry?.key || "").trim(),
      value: String(entry?.value || ""),
    }));
}

function extractSplunkRawPairsFromLooseText(rawValue = "") {
  const text = getSplunkRawMetricsPayload(rawValue);
  if (!text) {
    return [];
  }
  const pairs = [];
  const pattern = /(?:^|[,\n;|])\s*([A-Za-z0-9_.-]+)\s*[:=]\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|[^,\n;|]+)/g;
  let match = pattern.exec(String(text || ""));
  while (match && pairs.length < SPLUNK_RAW_PREVIEW_MAX_FIELDS) {
    const key = String(match[1] || "").trim();
    if (key && !shouldIgnoreSplunkRawKey(key)) {
      const valueRaw = String(match[2] || "").trim().replace(/^['"]|['"]$/g, "");
      pairs.push({
        key,
        value: normalizeSplunkPlainText(valueRaw, 220),
      });
    }
    match = pattern.exec(String(text || ""));
  }
  return pairs;
}

function formatSplunkRawValuePreview(value = "") {
  const rawText = String(value || "").trim();
  if (!rawText) {
    return "";
  }
  if (!isSplunkXmlPayload(rawText)) {
    return normalizeSplunkPlainText(rawText, 360);
  }
  const xmlPayload = extractLikelyXmlPayload(rawText);
  const xmlIndex = xmlPayload ? rawText.indexOf(xmlPayload) : -1;
  const prefix = xmlIndex > 0 ? normalizeSplunkPlainText(rawText.slice(0, xmlIndex), 180) : "";
  return prefix ? `${prefix} XML payload formatted below.` : "XML payload formatted below.";
}

function getSplunkXmlArtifactLabel(artifact = null, index = 0) {
  const kind = String(artifact?.kind || "").trim().toLowerCase();
  const suffix = index > 0 ? ` #${index + 1}` : "";
  if (kind === "saml") {
    return `SAML Object${suffix}`;
  }
  if (kind === "soap") {
    return `SOAP XML${suffix}`;
  }
  return `XML Payload${suffix}`;
}

function renderSplunkRawMarkup(rawValue = "", options = {}) {
  const metricsPayload = getSplunkRawMetricsPayload(rawValue);
  const parsed = parseSplunkRawJson(metricsPayload);
  const pairRows = [];
  if (parsed != null) {
    collectSplunkRawPairs(parsed, pairRows, "", 0);
  }
  if (pairRows.length === 0) {
    pairRows.push(...extractSplunkRawPairsFromText(metricsPayload));
  }
  if (pairRows.length === 0) {
    pairRows.push(...extractSplunkRawPairsFromLooseText(metricsPayload));
  }
  if (pairRows.length === 1 && String(pairRows[0]?.key || "").trim().toLowerCase() === "value") {
    const nestedValue = String(pairRows[0]?.value || "").trim();
    if (nestedValue) {
      const nestedPairs = extractSplunkRawPairsFromText(nestedValue);
      if (nestedPairs.length > 0) {
        pairRows.length = 0;
        pairRows.push(...nestedPairs);
      } else {
        const looseNestedPairs = extractSplunkRawPairsFromLooseText(nestedValue);
        if (looseNestedPairs.length > 0) {
          pairRows.length = 0;
          pairRows.push(...looseNestedPairs);
        }
      }
    }
  }
  const pairsMarkup =
    pairRows.length > 0
      ? `<ul class="bobtools-splunk-raw-pairs">${pairRows
      .slice(0, SPLUNK_RAW_PREVIEW_MAX_FIELDS)
      .map(
        (pair) => {
          const keyText = String(pair?.key || "").trim();
          const valueText = formatSplunkRawValuePreview(pair?.value || "");
          return keyText
            ? `<li class="bobtools-splunk-raw-pair"><span class="bobtools-splunk-raw-key">${escapeHtml(
                keyText
              )}</span><span class="bobtools-splunk-raw-value">${escapeHtml(valueText)}</span></li>`
            : `<li class="bobtools-splunk-raw-pair bobtools-splunk-raw-pair-value-only"><span class="bobtools-splunk-raw-value">${escapeHtml(
                valueText
              )}</span></li>`;
        }
      )
      .join("")}</ul>`
      : "";
  const artifacts = collectSplunkXmlArtifacts(metricsPayload);
  const artifactMarkup =
    artifacts.length > 0
      ? `<div class="bobtools-splunk-xml-list">${artifacts
          .map((artifact, index) => {
            const artifactLabel = getSplunkXmlArtifactLabel(artifact, index);
            const download = createSplunkXmlArtifactDownload(artifact?.xmlRaw, {
              requestorId: options?.requestorId || state.requestorId,
              mvpd: options?.mvpd || state.mvpd,
              rowIndex: Number(options?.rowIndex || 1),
              label: `${String(artifact?.kind || "xml")}-${index + 1}`,
            });
            const downloadMarkup = download?.url
              ? `<a class="bobtools-splunk-xml-download" href="${escapeHtml(download.url)}" download="${escapeHtml(
                  download.filename
                )}">Download ${escapeHtml(artifactLabel)}</a>`
              : "";
            return `<section class="bobtools-splunk-xml-artifact">
              <div class="bobtools-splunk-xml-head">
                <span class="bobtools-splunk-xml-title">${escapeHtml(artifactLabel)}</span>
                ${downloadMarkup}
              </div>
              <pre class="bobtools-splunk-xml-pre">${escapeHtml(String(artifact?.xmlPretty || artifact?.xmlRaw || ""))}</pre>
            </section>`;
          })
          .join("")}</div>`
      : "";
  if (pairsMarkup || artifactMarkup) {
    return `${pairsMarkup}${artifactMarkup}`;
  }
  const normalizedText = normalizeSplunkPlainText(metricsPayload, SPLUNK_RAW_PREVIEW_MAX_TEXT);
  return normalizedText
    ? `<p class="bobtools-splunk-raw-text">${escapeHtml(normalizedText)}</p>`
    : '<p class="bobtools-splunk-empty">No _raw payload returned.</p>';
}

function buildSplunkCsvCell(value = "") {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildSplunkCsvContent(rows = []) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const lines = ["_time,_raw"];
  normalizedRows.forEach((row) => {
    const timeValue = firstNonEmptyString([row?._time, row?.time, row?.timestamp]);
    const rawValue = firstNonEmptyString([row?._raw, row?.raw, row?.value, row?.message]);
    lines.push(`${buildSplunkCsvCell(timeValue)},${buildSplunkCsvCell(rawValue)}`);
  });
  return lines.join("\r\n");
}

function createSplunkCsvDownload(profile = null, rows = [], report = null) {
  releaseSplunkDownloadUrl();
  const normalizedRows = (Array.isArray(rows) ? rows : []).slice(0, SPLUNK_DOWNLOAD_MAX_ROWS);
  if (normalizedRows.length === 0) {
    return { url: "", filename: "" };
  }
  const csvBlob = new Blob([buildSplunkCsvContent(normalizedRows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(csvBlob);
  state.splunkDownloadUrl = url;
  const requestor = String(profile?.requestorId || state.requestorId || "requestor")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "_");
  const mvpd = String(profile?.mvpd || state.mvpd || "mvpd")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "_");
  const checkedAt = Number(report?.checkedAt || Date.now());
  const stamp = Number.isFinite(checkedAt) ? new Date(checkedAt).toISOString().replace(/[:.]/g, "-") : String(Date.now());
  return {
    url,
    filename: `underpar_splunk_${requestor}_${mvpd}_${stamp}.csv`,
  };
}

function buildSplunkRowUniqueKey(row = null) {
  if (!row || typeof row !== "object") {
    return "";
  }
  const rowTime = firstNonEmptyString([row?._time, row?.time, row?.timestamp]);
  const rowRaw = firstNonEmptyString([row?._raw, row?.raw, row?.value, row?.message]);
  if (rowTime || rowRaw) {
    return `${String(rowTime || "").trim()}|${String(rowRaw || "").trim()}`;
  }
  try {
    return JSON.stringify(row);
  } catch {
    return "";
  }
}

function dedupeSplunkReportRows(rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  const output = [];
  const seen = new Set();
  list.forEach((row) => {
    const key = buildSplunkRowUniqueKey(row);
    if (key && seen.has(key)) {
      return;
    }
    if (key) {
      seen.add(key);
    }
    output.push(row);
  });
  return output;
}

function renderSplunkPanel(profile = null) {
  if (!els.splunkCard || !els.splunkCardBody || !els.splunkSummary || !els.splunkStatus) {
    return;
  }
  releaseSplunkArtifactDownloadUrls();

  if (!profile) {
    els.splunkSummary.innerHTML = '<p class="bobtools-splunk-empty">Select an MVPD login profile, then click SPLUNK to load RCA events.</p>';
    els.splunkStatus.textContent = "Splunk RCA unlocks after selecting an MVPD login profile.";
    releaseSplunkDownloadUrl();
    if (els.splunkCardMeta) {
      els.splunkCardMeta.textContent = "";
      els.splunkCardMeta.hidden = true;
    }
    return;
  }

  const report = getSplunkResultForProfile(profile);

  if (!report || typeof report !== "object") {
    els.splunkStatus.classList.remove("error");
    releaseSplunkDownloadUrl();
    if (state.splunkRunning) {
      els.splunkStatus.textContent = "Running Splunk RCA query...";
      els.splunkSummary.innerHTML = '<p class="bobtools-splunk-empty">Opening Splunk and collecting results...</p>';
    } else {
      els.splunkStatus.textContent = "Click SPLUNK to fetch RCA events for this upstreamUserID.";
      els.splunkSummary.innerHTML = '<p class="bobtools-splunk-empty">No Splunk report loaded yet.</p>';
    }
    if (els.splunkCardMeta) {
      els.splunkCardMeta.textContent = "";
      els.splunkCardMeta.hidden = true;
    }
    return;
  }

  const checkedAt = formatDateTime(report?.checkedAt);
  const sid = String(report?.sid || "").trim();
  const allRows = dedupeSplunkReportRows(Array.isArray(report?.rows) ? report.rows : []);
  const totalRows = allRows.length;
  const displayedRows = Math.min(totalRows, SPLUNK_PREVIEW_MAX_ROWS);
  const rowSummary =
    totalRows > displayedRows
      ? `${displayedRows} shown of ${totalRows}`
      : `${displayedRows} row${displayedRows === 1 ? "" : "s"}`;
  if (els.splunkCardMeta) {
    els.splunkCardMeta.textContent = rowSummary;
    els.splunkCardMeta.hidden = false;
  }

  const query = String(report?.queryContext?.search || "").trim();
  els.splunkStatus.classList.remove("error");
  if (report.ok === true) {
    els.splunkStatus.textContent = `Loaded ${rowSummary}.`;
  } else {
    els.splunkStatus.classList.add("error");
    els.splunkStatus.textContent = String(report?.error || "Splunk query failed.");
  }

  if (report.ok !== true) {
    releaseSplunkDownloadUrl();
    els.splunkSummary.innerHTML = `
      <p class="bobtools-splunk-headline"><strong>Checked:</strong> ${escapeHtml(checkedAt)} | <strong>SID:</strong> ${escapeHtml(sid || "N/A")}</p>
      <p class="bobtools-splunk-query"><strong>Query:</strong> ${escapeHtml(query || "(empty)")}</p>
      <p class="bobtools-splunk-error">${escapeHtml(String(report?.error || "Splunk query failed."))}</p>
    `;
    return;
  }

  const rows = allRows.slice(0, SPLUNK_PREVIEW_MAX_ROWS);
  const csvDownload = createSplunkCsvDownload(profile, allRows, report);
  const actionsMarkup = csvDownload.url
    ? `<div class="bobtools-splunk-actions"><a class="bobtools-splunk-download" href="${escapeHtml(
        csvDownload.url
      )}" download="${escapeHtml(csvDownload.filename)}">Download CSV</a></div>`
    : "";
  const eventsMarkup =
    rows.length === 0
      ? '<p class="bobtools-splunk-empty">No Splunk events were returned for this upstreamUserID.</p>'
      : `<div class="bobtools-splunk-events">${rows
          .map((row, index) => {
            const rowTime = firstNonEmptyString([row?._time, row?.time, row?.timestamp, "N/A"]);
            const rowRaw = firstNonEmptyString([row?._raw, row?.raw, row?.value, row?.message]);
            const rowPayload = rowRaw || JSON.stringify(row || {});
            return `
              <article class="bobtools-splunk-event">
                <div class="bobtools-splunk-field bobtools-splunk-field--time">
                  <span class="bobtools-splunk-time">${escapeHtml(formatSplunkTimeLabel(rowTime))}</span>
                </div>
                <div class="bobtools-splunk-field bobtools-splunk-field--raw">
                  <div class="bobtools-splunk-raw-block">${renderSplunkRawMarkup(rowPayload, {
                    rowIndex: index + 1,
                    requestorId: String(profile?.requestorId || state.requestorId || "").trim(),
                    mvpd: String(profile?.mvpd || state.mvpd || "").trim(),
                  })}</div>
                </div>
              </article>
            `;
          })
          .join("")}</div>`;
  const truncationMarkup =
    rows.length < totalRows
      ? `<p class="bobtools-splunk-meta">Showing ${rows.length} of ${totalRows} rows.</p>`
      : "";

  els.splunkSummary.innerHTML = `
    <p class="bobtools-splunk-headline"><strong>Checked:</strong> ${escapeHtml(checkedAt)} | <strong>SID:</strong> ${escapeHtml(
      sid || "N/A"
    )} | <strong>Rows:</strong> ${escapeHtml(rowSummary)}</p>
    <p class="bobtools-splunk-query"><strong>Query:</strong> ${escapeHtml(query || "(empty)")}</p>
    ${actionsMarkup}
    ${eventsMarkup}
    ${truncationMarkup}
  `;
}

function renderResult() {
  const profile = getSelectedProfile();
  if (!els.profileContext || !els.resultStatus || !els.resultSummary || !els.resourceInput) {
    return;
  }

  syncActionInputState();

  if (!profile) {
    els.profileContext.textContent = "Select an MVPD login profile to run REST V2 actions.";
    els.resultStatus.textContent = "REST V2 actions unlock after at least one successful MVPD login profile is captured.";
    els.resultStatus.classList.remove("error", "success");
    els.resultSummary.hidden = true;
    els.resultSummary.innerHTML = "";
    return;
  }

  const actionLabel = getApiActionLabel(state.apiAction);
  const contextText = firstNonEmptyString([
    profile?.requestorMvpdLabel,
    profile?.mvpdLabel,
    profile?.mvpd,
    "MVPD profile",
  ]);
  const subjectText = firstNonEmptyString([profile?.upstreamUserId, profile?.subject, "N/A"]);
  els.profileContext.innerHTML = `Using selected profile <strong>${escapeHtml(contextText)}</strong> | upstreamUserID=${escapeHtml(
    subjectText
  )}.`;

  const key = String(profile?.key || "").trim();
  const rememberedInput = state.resourceInputByHarvestKey.get(key) || "";
  if (document.activeElement !== els.resourceInput) {
    els.resourceInput.value = rememberedInput;
  }

  const result = getResultForProfile(profile);
  if (!result || typeof result !== "object") {
    els.resultStatus.classList.remove("error", "success");
    if (actionRequiresResources(state.apiAction)) {
      els.resultStatus.textContent = `Enter resourceIds, then press Enter or GO to run ${actionLabel}.`;
    } else {
      els.resultStatus.textContent = `Press GO to run ${actionLabel} for the selected profile.`;
    }
    els.resultSummary.hidden = true;
    els.resultSummary.innerHTML = "";
    return;
  }

  const resultType = String(result?.resultType || "").trim().toLowerCase();
  if (resultType === "profiles") {
    renderProfilesResult(result);
    return;
  }
  if (resultType === "configuration") {
    renderConfigurationResult(result);
    return;
  }
  renderDecisionsResult(result);
}

function render() {
  const selectedProfile = getSelectedProfile();
  renderHeader();
  renderProfileList();
  renderResult();
  renderSplunkPanel(selectedProfile);
  syncCardCollapseState();
  syncButtons();
}

function selectProfile(harvestKey = "") {
  const key = String(harvestKey || "").trim();
  if (!key) {
    return;
  }
  const match = state.profiles.find((profile) => String(profile?.key || "").trim() === key);
  if (!match) {
    return;
  }
  state.selectedHarvestKey = key;
  render();
}

async function sendWorkspaceAction(action, payload = {}) {
  try {
    return await chrome.runtime.sendMessage({
      type: BOBTOOLS_WORKSPACE_MESSAGE_TYPE,
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

function applyControllerState(payload = {}) {
  state.controllerOnline = payload?.controllerOnline === true;
  state.bobtoolsReady = payload?.bobtoolsReady === true;
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.userLabel = String(payload?.userLabel || "");
  state.requestorId = String(payload?.requestorId || "");
  state.mvpd = String(payload?.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || "");
  if (String(payload?.workspaceIconUrl || "").trim() && els.heroIcon) {
    els.heroIcon.src = String(payload.workspaceIconUrl || "").trim();
  }
}

function applyProfiles(payload = {}) {
  const profiles = Array.isArray(payload?.profiles) ? payload.profiles : [];
  state.profiles = profiles;
  state.requestorId = String(payload?.requestorId || state.requestorId || "");
  state.mvpd = String(payload?.mvpd || state.mvpd || "");
  state.mvpdLabel = String(payload?.mvpdLabel || state.mvpdLabel || "");
  state.userLabel = String(payload?.userLabel || state.userLabel || "");

  profiles.forEach((profile) => {
    const key = String(profile?.key || "").trim();
    if (!key) {
      return;
    }
    const lastCheck = profile?.lastCheck && typeof profile.lastCheck === "object" ? profile.lastCheck : null;
    if (lastCheck) {
      const action = normalizeApiAction(lastCheck?.apiAction || ACTION_PREAUTHORIZE);
      state.resultByHarvestActionKey.set(buildResultMapKey(key, action), lastCheck);
      if (Array.isArray(lastCheck?.resourceIds) && lastCheck.resourceIds.length > 0) {
        state.resourceInputByHarvestKey.set(key, lastCheck.resourceIds.join(", "));
      }
    }
  });

  const activeKeys = new Set(
    profiles
      .map((profile) => String(profile?.key || "").trim())
      .filter(Boolean)
  );
  for (const resultKey of [...state.resultByHarvestActionKey.keys()]) {
    const [profileKey] = String(resultKey || "").split("::");
    if (!activeKeys.has(profileKey)) {
      state.resultByHarvestActionKey.delete(resultKey);
    }
  }
  for (const key of [...state.resourceInputByHarvestKey.keys()]) {
    if (!activeKeys.has(String(key || "").trim())) {
      state.resourceInputByHarvestKey.delete(key);
    }
  }
  for (const key of [...state.splunkResultByHarvestKey.keys()]) {
    if (!activeKeys.has(String(key || "").trim())) {
      state.splunkResultByHarvestKey.delete(key);
    }
  }

  const preferredKey = firstNonEmptyString([payload?.selectedHarvestKey, state.selectedHarvestKey, profiles[0]?.key]);
  const hasPreferred = profiles.some((profile) => String(profile?.key || "").trim() === preferredKey);
  state.selectedHarvestKey = hasPreferred ? preferredKey : String(profiles[0]?.key || "").trim();
}

function applyCanIWatchResult(payload = {}) {
  const harvestKey = String(payload?.harvestKey || "").trim();
  const result = payload?.result && typeof payload.result === "object" ? payload.result : null;
  if (!harvestKey || !result) {
    return;
  }
  const action = ACTION_PREAUTHORIZE;
  state.apiAction = action;
  state.resultByHarvestActionKey.set(buildResultMapKey(harvestKey, action), result);
  if (Array.isArray(result?.resourceIds) && result.resourceIds.length > 0) {
    state.resourceInputByHarvestKey.set(harvestKey, result.resourceIds.join(", "));
  }
  state.selectedHarvestKey = harvestKey;
}

async function runSelectedActionFromForm() {
  const profile = getSelectedProfile();
  if (!profile) {
    setStatus("Select an MVPD login profile first.", "error");
    return;
  }

  const action = ACTION_PREAUTHORIZE;
  const actionLabel = getApiActionLabel(action);
  if (!els.resourceInput) {
    return;
  }

  const harvestKey = String(profile?.key || "").trim();
  const resourceInput = String(els.resourceInput.value || "").trim();
  state.resourceInputByHarvestKey.set(harvestKey, resourceInput);
  if (actionRequiresResources(action) && !resourceInput) {
    setStatus(`${actionLabel} requires at least one resourceId.`, "error");
    return;
  }

  state.running = true;
  setStatus(`Running ${actionLabel}...`);
  render();
  const response = await sendWorkspaceAction("run-can-i-watch", {
    programmerId: String(state.programmerId || "").trim(),
    harvestKey,
    resourceInput,
  });
  state.running = false;

  if (!response?.ok) {
    setStatus(String(response?.error || `Unable to run ${actionLabel}.`), "error");
    render();
    return;
  }

  if (response?.result && typeof response.result === "object") {
    applyCanIWatchResult({ harvestKey, result: response.result, apiAction: action });
  }
  setStatus(`${actionLabel} complete.`);
  render();
}

async function runSplunkForSelectedProfile() {
  const profile = getSelectedProfile();
  if (!profile) {
    setStatus("Select an MVPD login profile first.", "error");
    return;
  }

  const harvestKey = String(profile?.key || "").trim();
  if (!harvestKey) {
    setStatus("Selected MVPD profile is missing a valid key.", "error");
    return;
  }

  const upstreamUserId = String(profile?.upstreamUserId || "").trim();
  if (!upstreamUserId) {
    setStatus("Selected MVPD profile does not include upstreamUserID.", "error");
    return;
  }

  state.splunkRunning = true;
  state.collapsedCards.splunk = false;
  setStatus("Running Splunk RCA query...");
  render();
  const response = await sendWorkspaceAction("run-splunk", {
    programmerId: String(state.programmerId || "").trim(),
    harvestKey,
  });
  state.splunkRunning = false;

  if (response?.report && typeof response.report === "object") {
    state.splunkResultByHarvestKey.set(harvestKey, response.report);
  }

  if (!response?.ok) {
    const fallbackReport =
      response?.report && typeof response.report === "object"
        ? response.report
        : {
            ok: false,
            checkedAt: Date.now(),
            queryContext: {
              search: `search index=pass-prod "${upstreamUserId}"`,
            },
            sid: "",
            rows: [],
            columns: [],
            totalRows: 0,
            displayedRows: 0,
            error: String(response?.error || "Splunk query failed."),
            networkEvents: [],
          };
    state.splunkResultByHarvestKey.set(harvestKey, fallbackReport);
    setStatus(
      String(response?.error || "Splunk query failed. Sign in to Splunk and retry."),
      "error"
    );
    render();
    return;
  }

  setStatus("Splunk query complete.");
  render();
}

async function deleteProfile(harvestKey = "") {
  const normalized = String(harvestKey || "").trim();
  if (!normalized) {
    return;
  }
  state.running = true;
  syncButtons();
  const response = await sendWorkspaceAction("delete-profile", {
    programmerId: String(state.programmerId || "").trim(),
    harvestKey: normalized,
  });
  state.running = false;
  if (!response?.ok) {
    setStatus(String(response?.error || "Unable to remove MVPD profile."), "error");
  } else {
    for (const resultKey of [...state.resultByHarvestActionKey.keys()]) {
      if (resultKey.startsWith(`${normalized}::`)) {
        state.resultByHarvestActionKey.delete(resultKey);
      }
    }
    state.resourceInputByHarvestKey.delete(normalized);
    state.splunkResultByHarvestKey.delete(normalized);
    setStatus(String(response?.message || "Removed MVPD profile."));
  }
  render();
}

function clearSelectedResult() {
  const profile = getSelectedProfile();
  if (!profile) {
    return;
  }
  const key = String(profile?.key || "").trim();
  if (!key) {
    return;
  }
  state.resultByHarvestActionKey.delete(buildResultMapKey(key, state.apiAction));
  void sendWorkspaceAction("clear-result", {
    harvestKey: key,
    apiAction: ACTION_PREAUTHORIZE,
  });
  render();
}

function handleWorkspaceEvent(eventName, payload = {}) {
  const event = String(eventName || "").trim();
  if (!event) {
    return;
  }
  if (event === "controller-state") {
    applyControllerState(payload);
    render();
    return;
  }
  if (event === "profiles-update") {
    applyProfiles(payload);
    render();
    return;
  }
  if (event === "can-i-watch-result") {
    applyCanIWatchResult(payload);
    render();
    return;
  }
  if (event === "workspace-clear") {
    state.resultByHarvestActionKey.clear();
    state.resourceInputByHarvestKey.clear();
    state.splunkResultByHarvestKey.clear();
    releaseSplunkDownloadUrl();
    releaseSplunkArtifactDownloadUrls();
    render();
  }
}

function registerEventHandlers() {
  window.addEventListener("beforeunload", () => {
    releaseSplunkDownloadUrl();
    releaseSplunkArtifactDownloadUrls();
  });

  if (els.profileList) {
    els.profileList.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }
      const deleteBtn = target.closest("[data-delete-key]");
      if (deleteBtn) {
        const key = String(deleteBtn.getAttribute("data-delete-key") || "").trim();
        void deleteProfile(key);
        return;
      }
      const selectBtn = target.closest("[data-select-key]");
      if (selectBtn) {
        const key = String(selectBtn.getAttribute("data-select-key") || "").trim();
        selectProfile(key);
      }
    });
  }

  if (els.form) {
    els.form.addEventListener("submit", (event) => {
      event.preventDefault();
      void runSelectedActionFromForm();
    });
  }

  if (els.resourceInput) {
    els.resourceInput.addEventListener("input", () => {
      const profile = getSelectedProfile();
      if (!profile) {
        return;
      }
      const key = String(profile?.key || "").trim();
      if (!key) {
        return;
      }
      state.resourceInputByHarvestKey.set(key, String(els.resourceInput.value || ""));
    });
  }

  const toggleCardCollapse = (toggleElement) => {
    const cardKey = String(toggleElement?.getAttribute("data-card-toggle") || "").trim();
    if (!cardKey) {
      return;
    }
    state.collapsedCards[cardKey] = state.collapsedCards?.[cardKey] !== true;
    syncCardCollapseState();
  };

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-card-toggle]") : null;
    if (!target) {
      return;
    }
    event.preventDefault();
    toggleCardCollapse(target);
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-card-toggle]") : null;
    if (!target) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    toggleCardCollapse(target);
  });

  if (els.refreshButton) {
    els.refreshButton.addEventListener("click", () => {
      void sendWorkspaceAction("refresh-selected", {
        programmerId: String(state.programmerId || "").trim(),
      });
    });
  }

  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearSelectedResult();
    });
  }

  if (els.splunkButton) {
    els.splunkButton.addEventListener("click", (event) => {
      event.preventDefault();
      void runSplunkForSelectedProfile();
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== BOBTOOLS_WORKSPACE_MESSAGE_TYPE || message?.channel !== "workspace-event") {
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

  state.apiAction = ACTION_PREAUTHORIZE;

  registerEventHandlers();
  render();
  const ready = await sendWorkspaceAction("workspace-ready", {
    windowId: Number(state.windowId || 0),
  });
  if (!ready?.ok) {
    setStatus(String(ready?.error || "Unable to contact UnderPAR BOBTOOLS controller."), "error");
  }
}

void init();
