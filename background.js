const BUILD_INFO_KEY = "underpar_build_info";
const LEGACY_BUILD_INFO_KEY = "mincloudlogin_build_info";
const AVATAR_MAX_DATAURL_BYTES = 6000000;
const IMS_CLIENT_ID = "adobeExperienceCloudDebugger";
const IMS_AVATAR_CLIENT_IDS = ["AdobePass1", IMS_CLIENT_ID];
const IMS_LOGIN_HELPER_PATH = "src/login/login.html";
const IMS_LOGIN_REDIRECT_RULE_ID = 164001;
const AVATAR_SIZE_PREFERENCES = [128, 64, 256, 32];
const AUTH_DEBUGGER_PROTOCOL_VERSION = "1.3";
const DEBUG_TRACE_EVENT_LIMIT = 15000;
const DEBUG_TRACE_EVENT_STORAGE_LIMIT = 600;
const DEBUG_TRACE_BODY_PREVIEW_LIMIT = 12000;
const DEBUG_TRACE_REQUEST_MAP_LIMIT = 200;
const DEBUG_REDACT_SENSITIVE = false;
const DEBUG_FLOW_STORAGE_INDEX_KEY = "underpardebug_flow_index_v1";
const DEBUG_FLOW_STORAGE_PREFIX = "underpardebug_flow_v1:";
const LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY = "minclouddebug_flow_index_v1";
const LEGACY_DEBUG_FLOW_STORAGE_PREFIX = "minclouddebug_flow_v1:";
const BUILD_INFO_REQUEST_TYPE = "underpar:getBuildInfo";
const LEGACY_BUILD_INFO_REQUEST_TYPE = "mincloudlogin:getBuildInfo";
const FETCH_AVATAR_REQUEST_TYPE = "underpar:fetchAvatarDataUrl";
const LEGACY_FETCH_AVATAR_REQUEST_TYPE = "mincloudlogin:fetchAvatarDataUrl";
const DEBUG_MESSAGE_TYPE_PREFIX = "underpardebug:";
const LEGACY_DEBUG_MESSAGE_TYPE_PREFIX = "minclouddebug:";
const DEBUG_DEVTOOLS_PORT_NAME = "underpardebug-devtools";
const LEGACY_DEBUG_DEVTOOLS_PORT_NAME = "minclouddebug-devtools";
const DEBUG_FLOW_PERSIST_MAX = 8;
const DEBUG_FLOW_PERSIST_DEBOUNCE_MS = 250;
// Redirect-host filtering mode for flow capture trimming.
// - "exact_path": ignore only the exact redirect URL path
// - "path_tree": ignore redirect URL path and subtree
// - "origin_except_pass": ignore entire redirect origin except PASS-critical paths
const REDIRECT_IGNORE_MATCHER_MODE = "origin_except_pass";
const WEB_REQUEST_FILTER = { urls: ["<all_urls>"] };
const BUILD_FINGERPRINT_FILES = [
  "manifest.json",
  "background.js",
  "popup.js",
  "popup.html",
  "sidepanel.html",
  "popup.css",
  "decomp-workspace.html",
  "decomp-workspace.css",
  "decomp-workspace.js",
  "devtools.html",
  "devtools.js",
  "up-devtools-panel.html",
  "up-devtools-panel.js",
  "up-devtools-panel.css",
  "src/login/login.html",
  "src/login/login.js",
  "src/login/login.css",
];

const debugState = {
  flowsById: new Map(),
  flowIdByTabId: new Map(),
  portsByTabId: new Map(),
  debuggerAttachedTabIds: new Set(),
  persistTimerByFlowId: new Map(),
  persistIndexTimerId: 0,
};

async function configureSidePanelBehavior() {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch {
    // Ignore when side panel APIs are unavailable.
  }
}

async function ensureImsLoginRedirectRule() {
  const dnr = chrome.declarativeNetRequest;
  if (!dnr?.updateSessionRules) {
    return;
  }

  let helperUrl;
  try {
    helperUrl = new URL(chrome.runtime.getURL(IMS_LOGIN_HELPER_PATH));
  } catch {
    return;
  }

  try {
    await dnr.updateSessionRules({
      removeRuleIds: [IMS_LOGIN_REDIRECT_RULE_ID],
      addRules: [
        {
          id: IMS_LOGIN_REDIRECT_RULE_ID,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                scheme: helperUrl.protocol.replace(":", ""),
                host: helperUrl.host,
                path: helperUrl.pathname,
                queryTransform: {
                  addOrReplaceParams: [
                    {
                      key: "from_ims",
                      value: "true",
                    },
                  ],
                },
              },
            },
          },
          condition: {
            urlFilter: "*://login.aepdebugger.adobe.com/*",
            resourceTypes: ["main_frame", "sub_frame"],
          },
        },
      ],
    });
  } catch {
    // Ignore DNR setup errors; auth flow has non-DNR fallback paths.
  }
}

async function getBuildInfo() {
  const data = await chrome.storage.local.get([BUILD_INFO_KEY, LEGACY_BUILD_INFO_KEY]);
  return data?.[BUILD_INFO_KEY] || data?.[LEGACY_BUILD_INFO_KEY] || null;
}

async function setBuildInfo(info) {
  await chrome.storage.local.set({ [BUILD_INFO_KEY]: info });
  try {
    await chrome.storage.local.remove(LEGACY_BUILD_INFO_KEY);
  } catch {
    // Ignore cleanup failures.
  }
}

async function updateActionBadge() {
  try {
    await chrome.action.setBadgeText({ text: "" });
  } catch {
    // Ignore badge API failures.
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function hashText(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return bytesToHex(new Uint8Array(digest));
}

async function readExtensionFile(filePath) {
  try {
    const response = await fetch(chrome.runtime.getURL(filePath), { cache: "no-store" });
    if (!response.ok) {
      return `__READ_ERROR__:${filePath}:${response.status}:${response.statusText}`;
    }
    return await response.text();
  } catch (error) {
    return `__READ_ERROR__:${filePath}:${error instanceof Error ? error.message : String(error)}`;
  }
}

async function computeBuildFingerprint() {
  const chunks = [];

  for (const filePath of BUILD_FINGERPRINT_FILES) {
    const content = await readExtensionFile(filePath);
    chunks.push(`FILE:${filePath}\n${content}\n`);
  }

  return hashText(chunks.join("\n"));
}

function getManifestPatchCounter(manifestVersion) {
  const parts = String(manifestVersion || "")
    .trim()
    .split(".")
    .map((part) => Number(part));
  if (parts.length < 3 || parts.some((value) => !Number.isInteger(value) || value < 0)) {
    return 0;
  }
  return parts[2];
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function inferImageMimeTypeFromBuffer(buffer) {
  if (!buffer) {
    return "";
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (!bytes || bytes.length < 2) {
    return "";
  }

  const hasPrefix = (prefix) => {
    if (!Array.isArray(prefix) || bytes.length < prefix.length) {
      return false;
    }
    for (let index = 0; index < prefix.length; index += 1) {
      if (bytes[index] !== prefix[index]) {
        return false;
      }
    }
    return true;
  };

  if (hasPrefix([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (hasPrefix([0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }
  if (hasPrefix([0x47, 0x49, 0x46, 0x38])) {
    return "image/gif";
  }
  if (hasPrefix([0x42, 0x4d])) {
    return "image/bmp";
  }
  if (bytes.length >= 12) {
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (riff === "RIFF" && webp === "WEBP") {
      return "image/webp";
    }
  }
  if (bytes.length >= 12) {
    const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (ftyp === "ftyp" && (brand === "avif" || brand === "avis")) {
      return "image/avif";
    }
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, Math.min(bytes.length, 512)));
    if (/<svg[\s>]/i.test(text)) {
      return "image/svg+xml";
    }
  } catch {
    // Ignore text decoding errors for binary payloads.
  }

  return "";
}

function normalizeAvatarCandidate(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "");
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function isImsAvatarDownloadUrl(url) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return /(^|\.)adobelogin\.com$/i.test(parsed.hostname) && /\/ims\/avatar\/download\//i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function buildAvatarFetchUrlCandidates(url) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized) {
    return [];
  }

  const candidates = [normalized];
  if (!isImsAvatarDownloadUrl(normalized)) {
    return candidates;
  }

  const pushCandidate = (value) => {
    const candidate = normalizeAvatarCandidate(value);
    if (candidate && !candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  };

  try {
    const parsed = new URL(normalized);
    if (!parsed.searchParams.has("size")) {
      const sized = new URL(parsed.toString());
      sized.searchParams.set("size", String(AVATAR_SIZE_PREFERENCES[0] || 128));
      pushCandidate(sized.toString());
    }
  } catch {
    // Keep original candidates only.
  }

  return candidates;
}

function buildAvatarFetchAttempts(accessToken = "") {
  const baseHeaders = {
    Accept: "image/*,*/*;q=0.8",
  };

  const attempts = [];
  const seen = new Set();
  const pushAttempt = (headers, credentials) => {
    const key = `${credentials}|${Object.entries(headers)
      .sort((left, right) => String(left[0]).localeCompare(String(right[0])))
      .map(([key, value]) => `${key}:${value}`)
      .join("|")}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    attempts.push({ headers, credentials });
  };

  if (accessToken) {
    pushAttempt(
      {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      "omit"
    );
    pushAttempt(
      {
        ...baseHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      "include"
    );
    pushAttempt(
      {
        Accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
      "omit"
    );

    for (const clientId of IMS_AVATAR_CLIENT_IDS) {
      if (!clientId) {
        continue;
      }
      pushAttempt(
        {
          ...baseHeaders,
          Authorization: `Bearer ${accessToken}`,
          "X-IMS-ClientId": clientId,
          "x-api-key": clientId,
        },
        "omit"
      );
      pushAttempt(
        {
          ...baseHeaders,
          Authorization: `Bearer ${accessToken}`,
          "X-IMS-ClientId": clientId,
          "x-api-key": clientId,
        },
        "include"
      );
    }
  }

  pushAttempt(baseHeaders, "omit");
  pushAttempt(baseHeaders, "include");
  return attempts;
}

async function fetchAvatarAsDataUrl(url, accessToken = "") {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Missing avatar URL.");
  }

  const urlCandidates = buildAvatarFetchUrlCandidates(url);
  const attempts = buildAvatarFetchAttempts(accessToken);
  const maxAttempts = 14;
  let attemptCount = 0;

  let lastError = null;
  for (const targetUrl of urlCandidates) {
    for (const attempt of attempts) {
      attemptCount += 1;
      if (attemptCount > maxAttempts) {
        break;
      }

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          cache: "no-store",
          credentials: attempt.credentials,
          redirect: "follow",
          headers: attempt.headers,
        });

        if (!response.ok) {
          lastError = new Error(`Avatar request failed (${response.status})`);
          continue;
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          lastError = new Error("Avatar response was empty.");
          continue;
        }

        if (blob.size > AVATAR_MAX_DATAURL_BYTES) {
          lastError = new Error("Avatar payload too large for data URL response.");
          continue;
        }

        const buffer = await blob.arrayBuffer();
        const responseMimeType = String(blob.type || "").toLowerCase();
        const inferredMimeType = inferImageMimeTypeFromBuffer(buffer);
        const resolvedMimeType = responseMimeType.startsWith("image/") ? responseMimeType : inferredMimeType;
        if (!resolvedMimeType) {
          lastError = new Error(`Avatar response type was not image (${blob.type || "unknown"}).`);
          continue;
        }
        const base64 = bufferToBase64(buffer);
        return `data:${resolvedMimeType};base64,${base64}`;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    if (attemptCount > maxAttempts) {
      break;
    }
  }

  throw lastError || new Error("Unable to fetch avatar.");
}

async function syncBuildInfo(trigger) {
  const manifestVersion = chrome.runtime.getManifest().version;
  const fingerprint = await computeBuildFingerprint();
  const nextCounter = getManifestPatchCounter(manifestVersion);
  const info = {
    counter: nextCounter,
    manifestVersion,
    fingerprint,
    trigger,
    updatedAt: new Date().toISOString(),
  };

  await setBuildInfo(info);
  await updateActionBadge();
  return info;
}

function getFlowStorageKey(flowId) {
  return `${DEBUG_FLOW_STORAGE_PREFIX}${String(flowId || "")}`;
}

function getLegacyFlowStorageKey(flowId) {
  return `${LEGACY_DEBUG_FLOW_STORAGE_PREFIX}${String(flowId || "")}`;
}

function getFlowStorageKeyCandidates(flowId) {
  return [getFlowStorageKey(flowId), getLegacyFlowStorageKey(flowId)];
}

function isStorageQuotaError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  if (!message) {
    return false;
  }
  const normalized = message.toLowerCase();
  return normalized.includes("quota") || normalized.includes("kquotabytes") || normalized.includes("resource::kquotabytes");
}

async function clearPersistedDebugFlowStorage() {
  try {
    const payload = await chrome.storage.local.get(null);
    const keysToRemove = Object.keys(payload || {}).filter(
      (key) =>
        key === DEBUG_FLOW_STORAGE_INDEX_KEY ||
        key === LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY ||
        key.startsWith(DEBUG_FLOW_STORAGE_PREFIX) ||
        key.startsWith(LEGACY_DEBUG_FLOW_STORAGE_PREFIX)
    );
    if (keysToRemove.length === 0) {
      return 0;
    }
    await chrome.storage.local.remove(keysToRemove);
    return keysToRemove.length;
  } catch {
    return 0;
  }
}

function clampDebugText(value, limit = 512) {
  const text = typeof value === "string" ? value : String(value ?? "");
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit);
}

function serializeRequestMap(requestById) {
  if (!(requestById instanceof Map)) {
    return {};
  }

  const output = {};
  const entries = [...requestById.entries()];
  const limitedEntries = entries.slice(Math.max(entries.length - DEBUG_TRACE_REQUEST_MAP_LIMIT, 0));

  for (const [requestId, value] of limitedEntries) {
    const normalizedValue = value && typeof value === "object"
      ? {
          url: clampDebugText(value.url || "", 512),
          method: clampDebugText(value.method || "", 24),
          mimeType: clampDebugText(value.mimeType || "", 160),
          status: Number(value.status || 0),
        }
      : {};
    output[String(requestId)] = normalizedValue;
  }
  return output;
}

function deserializeRequestMap(rawValue) {
  const map = new Map();
  if (!rawValue || typeof rawValue !== "object") {
    return map;
  }

  for (const [requestId, value] of Object.entries(rawValue)) {
    map.set(String(requestId), value && typeof value === "object" ? value : {});
  }
  return map;
}

function serializeFlowForStorage(flow) {
  if (!flow) {
    return null;
  }

  return {
    flowId: flow.flowId,
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
    tabId: normalizeTabId(flow.tabId),
    context: flow.context && typeof flow.context === "object" ? flow.context : {},
    events: Array.isArray(flow.events) ? flow.events.slice(-DEBUG_TRACE_EVENT_STORAGE_LIMIT) : [],
    nextSeq: Number(flow.nextSeq || 1),
    requestById: serializeRequestMap(flow.requestById),
  };
}

function restoreFlowFromStorage(stored) {
  if (!stored || typeof stored !== "object") {
    return null;
  }

  const flowId = String(stored.flowId || "").trim();
  if (!flowId) {
    return null;
  }

  const events = Array.isArray(stored.events) ? stored.events : [];
  const maxSeq = events.reduce((max, event) => {
    const value = Number(event?.seq || 0);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);

  return {
    flowId,
    createdAt: String(stored.createdAt || new Date().toISOString()),
    updatedAt: String(stored.updatedAt || new Date().toISOString()),
    tabId: normalizeTabId(stored.tabId),
    context: stored.context && typeof stored.context === "object" ? stored.context : {},
    events,
    nextSeq: Math.max(Number(stored.nextSeq || 0), maxSeq + 1, 1),
    requestById: deserializeRequestMap(stored.requestById),
  };
}

async function persistFlowNow(flow) {
  if (!flow?.flowId) {
    return;
  }

  try {
    const payload = serializeFlowForStorage(flow);
    if (!payload) {
      return;
    }
    await chrome.storage.local.set({
      [getFlowStorageKey(flow.flowId)]: payload,
    });
  } catch (error) {
    if (!isStorageQuotaError(error)) {
      return;
    }

    const removed = await clearPersistedDebugFlowStorage();
    if (removed <= 0) {
      return;
    }

    try {
      const payload = serializeFlowForStorage(flow);
      if (!payload) {
        return;
      }
      await chrome.storage.local.set({
        [getFlowStorageKey(flow.flowId)]: payload,
      });
    } catch {
      // Ignore retries when storage is still constrained.
    }
  }
}

function scheduleFlowPersist(flow) {
  if (!flow?.flowId) {
    return;
  }

  const flowId = flow.flowId;
  const existingTimer = debugState.persistTimerByFlowId.get(flowId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timerId = setTimeout(() => {
    debugState.persistTimerByFlowId.delete(flowId);
    void persistFlowNow(flow);
  }, DEBUG_FLOW_PERSIST_DEBOUNCE_MS);
  debugState.persistTimerByFlowId.set(flowId, timerId);
}

function buildFlowStorageIndex() {
  const flowByTab = {};
  for (const [tabId, flowId] of debugState.flowIdByTabId.entries()) {
    flowByTab[String(tabId)] = flowId;
  }

  const recentFlowIds = [...debugState.flowsById.values()]
    .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")))
    .slice(0, DEBUG_FLOW_PERSIST_MAX)
    .map((flow) => flow.flowId);

  return {
    updatedAt: new Date().toISOString(),
    flowByTab,
    recentFlowIds,
  };
}

async function persistFlowIndexNow() {
  try {
    const index = buildFlowStorageIndex();
    await chrome.storage.local.set({
      [DEBUG_FLOW_STORAGE_INDEX_KEY]: index,
    });
  } catch (error) {
    if (isStorageQuotaError(error)) {
      await clearPersistedDebugFlowStorage();
    }
  }
}

function scheduleFlowIndexPersist() {
  if (debugState.persistIndexTimerId) {
    clearTimeout(debugState.persistIndexTimerId);
  }

  debugState.persistIndexTimerId = setTimeout(() => {
    debugState.persistIndexTimerId = 0;
    void persistFlowIndexNow();
  }, DEBUG_FLOW_PERSIST_DEBOUNCE_MS);
}

function removeFlowStorage(flowId) {
  if (!flowId) {
    return;
  }
  void chrome.storage.local.remove(getFlowStorageKeyCandidates(flowId)).catch(() => {
    // Ignore storage removal failures.
  });
}

async function restoreDebugStateFromStorage() {
  try {
    const payload = await chrome.storage.local.get([DEBUG_FLOW_STORAGE_INDEX_KEY, LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY]);
    const index = payload?.[DEBUG_FLOW_STORAGE_INDEX_KEY] || payload?.[LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY];
    if (!index || typeof index !== "object") {
      return;
    }

    const flowIds = Array.isArray(index.recentFlowIds)
      ? [...new Set(index.recentFlowIds.map((item) => String(item || "").trim()).filter(Boolean))]
      : [];

    if (flowIds.length === 0) {
      return;
    }

    const storageKeys = flowIds.flatMap((flowId) => getFlowStorageKeyCandidates(flowId));
    const storedFlowsPayload = await chrome.storage.local.get(storageKeys);
    for (const flowId of flowIds) {
      const [primaryKey, legacyKey] = getFlowStorageKeyCandidates(flowId);
      const restored = restoreFlowFromStorage(storedFlowsPayload?.[primaryKey] || storedFlowsPayload?.[legacyKey]);
      if (!restored) {
        continue;
      }
      debugState.flowsById.set(restored.flowId, restored);
    }

    const flowByTab = index.flowByTab && typeof index.flowByTab === "object" ? index.flowByTab : {};
    for (const [tabIdRaw, flowIdRaw] of Object.entries(flowByTab)) {
      const tabId = normalizeTabId(tabIdRaw);
      const flowId = String(flowIdRaw || "").trim();
      if (!tabId || !flowId || !debugState.flowsById.has(flowId)) {
        continue;
      }
      debugState.flowIdByTabId.set(tabId, flowId);
      const flow = debugState.flowsById.get(flowId);
      if (flow) {
        flow.tabId = tabId;
      }
    }
  } catch {
    // Ignore restore failures.
  }
}

async function restoreFlowForTabFromStorage(tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId || getFlowByTabId(normalizedTabId)) {
    return getFlowByTabId(normalizedTabId);
  }

  try {
    const payload = await chrome.storage.local.get([DEBUG_FLOW_STORAGE_INDEX_KEY, LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY]);
    const index = payload?.[DEBUG_FLOW_STORAGE_INDEX_KEY] || payload?.[LEGACY_DEBUG_FLOW_STORAGE_INDEX_KEY];
    if (!index || typeof index !== "object") {
      return null;
    }

    const flowId = String(index?.flowByTab?.[String(normalizedTabId)] || "").trim();
    if (!flowId) {
      return null;
    }

    const [primaryKey, legacyKey] = getFlowStorageKeyCandidates(flowId);
    const flowPayload = await chrome.storage.local.get([primaryKey, legacyKey]);
    const restored = restoreFlowFromStorage(flowPayload?.[primaryKey] || flowPayload?.[legacyKey]);
    if (!restored) {
      return null;
    }

    restored.tabId = normalizedTabId;
    debugState.flowsById.set(restored.flowId, restored);
    debugState.flowIdByTabId.set(normalizedTabId, restored.flowId);
    return restored;
  } catch {
    return null;
  }
}

async function reattachDebuggersFromState() {
  for (const [tabId, flowId] of debugState.flowIdByTabId.entries()) {
    const flow = debugState.flowsById.get(flowId);
    if (!flow) {
      continue;
    }
    try {
      await ensureDebuggerAttachedForTab(tabId, flow);
    } catch (error) {
      appendFlowEvent(flow, {
        source: "extension",
        phase: "debugger-reattach-failed",
        tabId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

function normalizeTabId(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return 0;
}

function redactHeaderValue(headerName, value) {
  if (!DEBUG_REDACT_SENSITIVE) {
    return String(value ?? "");
  }

  const key = String(headerName || "").trim().toLowerCase();
  if (key === "authorization" || key === "cookie" || key === "set-cookie" || key === "x-api-key") {
    return "<redacted>";
  }
  return String(value ?? "");
}

function toDebugHeadersObject(headersLike) {
  if (!headersLike) {
    return {};
  }

  const output = {};
  if (headersLike instanceof Headers) {
    for (const [key, value] of headersLike.entries()) {
      output[key] = redactHeaderValue(key, value);
    }
    return output;
  }

  if (Array.isArray(headersLike)) {
    for (const entry of headersLike) {
      if (Array.isArray(entry) && entry.length >= 2) {
        const [key, value] = entry;
        output[String(key)] = redactHeaderValue(key, value);
        continue;
      }

      if (!entry || typeof entry !== "object") {
        continue;
      }
      const key = String(entry.name || "").trim();
      if (!key) {
        continue;
      }
      const value = entry.value;
      output[String(key)] = redactHeaderValue(key, value);
    }
    return output;
  }

  if (typeof headersLike === "object") {
    for (const [key, value] of Object.entries(headersLike)) {
      output[key] = redactHeaderValue(key, value);
    }
  }

  return output;
}

function truncateText(value, limit = DEBUG_TRACE_BODY_PREVIEW_LIMIT) {
  const text = typeof value === "string" ? value : String(value ?? "");
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}... [truncated ${text.length - limit} chars]`;
}

function isTextMimeType(mimeType) {
  const value = String(mimeType || "").toLowerCase();
  return (
    value.startsWith("text/") ||
    value.includes("json") ||
    value.includes("xml") ||
    value.includes("javascript") ||
    value.includes("urlencoded") ||
    value.includes("html")
  );
}

function createFlowId() {
  return `flow-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDebugFlow(context = {}) {
  const flowId = createFlowId();
  const flow = {
    flowId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tabId: 0,
    context: context && typeof context === "object" ? context : {},
    events: [],
    nextSeq: 1,
    requestById: new Map(),
  };

  debugState.flowsById.set(flowId, flow);
  scheduleFlowPersist(flow);
  scheduleFlowIndexPersist();
  return flow;
}

function getFlowById(flowId) {
  if (!flowId) {
    return null;
  }
  return debugState.flowsById.get(String(flowId)) || null;
}

function getFlowByTabId(tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return null;
  }
  const flowId = debugState.flowIdByTabId.get(normalizedTabId);
  if (!flowId) {
    return null;
  }
  return getFlowById(flowId);
}

function serializeFlow(flow) {
  if (!flow) {
    return null;
  }

  return {
    flowId: flow.flowId,
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
    tabId: flow.tabId,
    context: flow.context,
    events: flow.events,
  };
}

function getPortsForTab(tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return null;
  }
  return debugState.portsByTabId.get(normalizedTabId) || null;
}

function postToPortSafe(port, payload) {
  try {
    port.postMessage(payload);
  } catch {
    // Ignore disconnected ports.
  }
}

function postFlowEventToTabPorts(tabId, payload) {
  const ports = getPortsForTab(tabId);
  if (!ports || ports.size === 0) {
    return;
  }

  for (const port of ports) {
    postToPortSafe(port, payload);
  }
}

function sendFlowSnapshotToTabPorts(tabId) {
  const flow = getFlowByTabId(tabId);
  postFlowEventToTabPorts(tabId, {
    type: "snapshot",
    tabId: normalizeTabId(tabId),
    flow: serializeFlow(flow),
  });
}

function appendFlowEvent(flow, event) {
  if (!flow || !event || typeof event !== "object") {
    return null;
  }

  const normalizedEvent = {
    seq: flow.nextSeq++,
    timestamp: new Date().toISOString(),
    source: String(event.source || "extension"),
    phase: String(event.phase || "event"),
    ...event,
  };

  flow.events.push(normalizedEvent);
  if (flow.events.length > DEBUG_TRACE_EVENT_LIMIT) {
    flow.events.splice(0, flow.events.length - DEBUG_TRACE_EVENT_LIMIT);
  }
  flow.updatedAt = new Date().toISOString();
  scheduleFlowPersist(flow);
  scheduleFlowIndexPersist();

  if (flow.tabId) {
    postFlowEventToTabPorts(flow.tabId, {
      type: "event",
      tabId: flow.tabId,
      flowId: flow.flowId,
      event: normalizedEvent,
    });
  }

  return normalizedEvent;
}

async function ensureDebuggerAttachedForTab(tabId, flow) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  if (debugState.debuggerAttachedTabIds.has(normalizedTabId)) {
    return;
  }

  const target = { tabId: normalizedTabId };
  await chrome.debugger.attach(target, AUTH_DEBUGGER_PROTOCOL_VERSION);
  await chrome.debugger.sendCommand(target, "Network.enable");
  await chrome.debugger.sendCommand(target, "Page.enable");
  debugState.debuggerAttachedTabIds.add(normalizedTabId);

  if (flow) {
    appendFlowEvent(flow, {
      source: "extension",
      phase: "debugger-attached",
      tabId: normalizedTabId,
    });
  }
}

async function detachDebuggerForTab(tabId, reason = "") {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId || !debugState.debuggerAttachedTabIds.has(normalizedTabId)) {
    return;
  }

  debugState.debuggerAttachedTabIds.delete(normalizedTabId);
  try {
    await chrome.debugger.detach({ tabId: normalizedTabId });
  } catch {
    // Ignore detach errors.
  }

  const flow = getFlowByTabId(normalizedTabId);
  if (flow) {
    appendFlowEvent(flow, {
      source: "extension",
      phase: "debugger-detached",
      tabId: normalizedTabId,
      reason: reason || "manual",
    });
  }
}

async function bindFlowToTab(flowId, tabId, metadata = {}) {
  const flow = getFlowById(flowId);
  const normalizedTabId = normalizeTabId(tabId);
  if (!flow) {
    throw new Error("Debug flow not found.");
  }
  if (!normalizedTabId) {
    throw new Error("A valid tabId is required to bind debug flow.");
  }

  if (flow.tabId && flow.tabId !== normalizedTabId) {
    debugState.flowIdByTabId.delete(flow.tabId);
  }

  const previousFlowId = debugState.flowIdByTabId.get(normalizedTabId);
  if (previousFlowId && previousFlowId !== flow.flowId) {
    const previousFlow = getFlowById(previousFlowId);
    if (previousFlow) {
      previousFlow.tabId = 0;
      appendFlowEvent(previousFlow, {
        source: "extension",
        phase: "tab-rebound",
        tabId: normalizedTabId,
        replacementFlowId: flow.flowId,
      });
    }
  }

  flow.tabId = normalizedTabId;
  if (metadata && typeof metadata === "object") {
    const nextContext = flow.context && typeof flow.context === "object" ? { ...flow.context } : {};
    const contextFields = ["requestorId", "mvpd", "loginUrl", "redirectUrl"];
    for (const field of contextFields) {
      const value = metadata[field];
      if (value === undefined || value === null || value === "") {
        continue;
      }
      nextContext[field] = String(value);
    }
    flow.context = nextContext;
  }
  debugState.flowIdByTabId.set(normalizedTabId, flow.flowId);
  appendFlowEvent(flow, {
    source: "extension",
    phase: "tab-bound",
    tabId: normalizedTabId,
    ...metadata,
  });

  await ensureDebuggerAttachedForTab(normalizedTabId, flow);
  scheduleFlowPersist(flow);
  scheduleFlowIndexPersist();
  sendFlowSnapshotToTabPorts(normalizedTabId);
}

function isPassCriticalPath(pathname = "") {
  const normalized = String(pathname || "").toLowerCase();
  return (
    normalized.startsWith("/api/v2/") ||
    normalized.startsWith("/o/") ||
    normalized.startsWith("/authenticate/")
  );
}

function shouldIgnoreUrlForFlow(flow, url) {
  if (!flow || !url) {
    return false;
  }

  const redirectUrl = String(flow?.context?.redirectUrl || "").trim();
  if (!redirectUrl) {
    return false;
  }

  let redirectParsed;
  let parsed;
  try {
    redirectParsed = new URL(redirectUrl);
    parsed = new URL(String(url));
  } catch {
    return false;
  }

  if (!/^https?:$/i.test(parsed.protocol) || parsed.origin !== redirectParsed.origin) {
    return false;
  }
  if (isPassCriticalPath(parsed.pathname)) {
    return false;
  }

  const mode = String(REDIRECT_IGNORE_MATCHER_MODE || "origin_except_pass").trim().toLowerCase();
  const redirectPath = redirectParsed.pathname || "/";
  if (mode === "exact_path") {
    return parsed.pathname === redirectPath;
  }

  if (parsed.pathname === redirectPath) {
    return true;
  }

  if (mode === "path_tree" && redirectPath !== "/") {
    const redirectDir = redirectPath.endsWith("/")
      ? redirectPath
      : redirectPath.slice(0, redirectPath.lastIndexOf("/") + 1);
    if (redirectDir && redirectDir !== "/" && parsed.pathname.startsWith(redirectDir)) {
      return true;
    }
    return false;
  }

  // Broad mode: same-origin non-PASS endpoints are redirect-site noise.
  return mode === "origin_except_pass";
}

function shouldCaptureNetworkBody(url, mimeType, encodedDataLength) {
  const normalizedUrl = String(url || "");
  const mime = String(mimeType || "").toLowerCase();
  const bytes = Number(encodedDataLength || 0);

  if (!normalizedUrl) {
    return false;
  }
  if (bytes > 2_000_000) {
    return false;
  }
  if (normalizedUrl.includes("/api/v2/")) {
    return true;
  }
  if (isTextMimeType(mime)) {
    return true;
  }
  return false;
}

function decodeBodyPreview(body, base64Encoded, mimeType) {
  const rawBody = typeof body === "string" ? body : "";
  if (!rawBody) {
    return "";
  }

  if (!base64Encoded) {
    return truncateText(rawBody);
  }

  if (!isTextMimeType(mimeType)) {
    return `[base64 body omitted: ${rawBody.length} chars]`;
  }

  try {
    return truncateText(atob(rawBody));
  } catch {
    return `[base64 text decode failed: ${rawBody.length} chars]`;
  }
}

async function captureNetworkBody(flow, tabId, requestId, finishParams = {}) {
  if (!flow || !requestId) {
    return;
  }

  const requestState = flow.requestById.get(requestId);
  if (!requestState) {
    return;
  }
  if (requestState.ignored === true || shouldIgnoreUrlForFlow(flow, requestState.url || "")) {
    return;
  }

  if (!shouldCaptureNetworkBody(requestState.url, requestState.mimeType, finishParams.encodedDataLength)) {
    return;
  }

  try {
    const bodyResult = await chrome.debugger.sendCommand(
      { tabId: normalizeTabId(tabId) },
      "Network.getResponseBody",
      { requestId }
    );

    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "body",
      requestId,
      url: requestState.url,
      status: requestState.status || 0,
      mimeType: requestState.mimeType || "",
      bodyPreview: decodeBodyPreview(bodyResult?.body || "", bodyResult?.base64Encoded === true, requestState.mimeType || ""),
      base64Encoded: bodyResult?.base64Encoded === true,
    });
  } catch (error) {
    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "body-error",
      requestId,
      url: requestState.url,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function handleDebuggerEvent(source, method, params) {
  const tabId = normalizeTabId(source?.tabId);
  if (!tabId) {
    return;
  }

  const flow = getFlowByTabId(tabId);
  if (!flow) {
    return;
  }

  if (method === "Network.requestWillBeSent") {
    const requestId = String(params?.requestId || "");
    const request = params?.request || {};
    const requestUrl = String(request.url || "");
    const ignored = shouldIgnoreUrlForFlow(flow, requestUrl);
    if (requestId) {
      flow.requestById.set(requestId, {
        url: requestUrl,
        method: String(request.method || "GET"),
        mimeType: "",
        status: 0,
        ignored,
      });
    }
    if (ignored) {
      return;
    }

    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "request",
      tabId,
      requestId,
      method: String(request.method || "GET"),
      url: requestUrl,
      resourceType: String(params?.type || ""),
      initiatorType: String(params?.initiator?.type || ""),
      documentURL: String(params?.documentURL || ""),
      requestHeaders: toDebugHeadersObject(request.headers || {}),
      postDataPreview: truncateText(request.postData || "", 4000),
    });
    return;
  }

  if (method === "Network.responseReceived") {
    const requestId = String(params?.requestId || "");
    const response = params?.response || {};
    const requestState = flow.requestById.get(requestId) || {
      url: String(response.url || ""),
      method: "",
      mimeType: "",
      status: 0,
      ignored: false,
    };

    requestState.url = String(response.url || requestState.url || "");
    requestState.status = Number(response.status || 0);
    requestState.mimeType = String(response.mimeType || "");
    if (requestState.ignored !== true && shouldIgnoreUrlForFlow(flow, requestState.url || "")) {
      requestState.ignored = true;
    }
    flow.requestById.set(requestId, requestState);
    if (requestState.ignored === true) {
      return;
    }

    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "response",
      tabId,
      requestId,
      url: requestState.url,
      status: requestState.status,
      statusText: String(response.statusText || ""),
      mimeType: requestState.mimeType,
      resourceType: String(params?.type || ""),
      fromDiskCache: response.fromDiskCache === true,
      fromServiceWorker: response.fromServiceWorker === true,
      responseHeaders: toDebugHeadersObject(response.headers || {}),
    });
    return;
  }

  if (method === "Network.loadingFinished") {
    const requestId = String(params?.requestId || "");
    const requestState = flow.requestById.get(requestId);
    if (requestState?.ignored === true) {
      return;
    }
    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "loading-finished",
      tabId,
      requestId,
      url: requestState?.url || "",
      encodedDataLength: Number(params?.encodedDataLength || 0),
    });
    void captureNetworkBody(flow, tabId, requestId, params || {});
    return;
  }

  if (method === "Network.loadingFailed") {
    const requestId = String(params?.requestId || "");
    const requestState = flow.requestById.get(requestId);
    if (requestState?.ignored === true) {
      return;
    }
    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "loading-failed",
      tabId,
      requestId,
      url: requestState?.url || "",
      errorText: String(params?.errorText || "unknown"),
      canceled: params?.canceled === true,
      blockedReason: String(params?.blockedReason || ""),
    });
    return;
  }

  if (method === "Page.frameNavigated") {
    const frameUrl = String(params?.frame?.url || "");
    if (shouldIgnoreUrlForFlow(flow, frameUrl)) {
      return;
    }
    appendFlowEvent(flow, {
      source: "tab-network",
      phase: "frame-navigated",
      tabId,
      frameId: String(params?.frame?.id || ""),
      url: frameUrl,
      securityOrigin: String(params?.frame?.securityOrigin || ""),
    });
  }
}

function handleDebuggerDetach(source, reason) {
  const tabId = normalizeTabId(source?.tabId);
  if (!tabId) {
    return;
  }

  debugState.debuggerAttachedTabIds.delete(tabId);
  const flow = getFlowByTabId(tabId);
  if (!flow) {
    return;
  }

  appendFlowEvent(flow, {
    source: "extension",
    phase: "debugger-detached",
    tabId,
    reason: String(reason || "unknown"),
  });
}

function subscribePortToTab(port, tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  const portSet = debugState.portsByTabId.get(normalizedTabId) || new Set();
  portSet.add(port);
  debugState.portsByTabId.set(normalizedTabId, portSet);
  sendFlowSnapshotToTabPorts(normalizedTabId);
}

function unsubscribePortFromTab(port, tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  const portSet = debugState.portsByTabId.get(normalizedTabId);
  if (!portSet) {
    return;
  }

  portSet.delete(port);
  if (portSet.size === 0) {
    debugState.portsByTabId.delete(normalizedTabId);
  }
}

function getFlowForWebRequest(details) {
  const tabId = normalizeTabId(details?.tabId);
  if (!tabId) {
    return null;
  }
  const flow = getFlowByTabId(tabId);
  if (!flow) {
    return null;
  }
  if (shouldIgnoreUrlForFlow(flow, String(details?.url || ""))) {
    return null;
  }
  return flow;
}

function extractHeaderValues(headers, targetName) {
  if (!Array.isArray(headers)) {
    return [];
  }
  const normalizedTarget = String(targetName || "").trim().toLowerCase();
  if (!normalizedTarget) {
    return [];
  }

  const values = [];
  for (const header of headers) {
    if (!header || typeof header !== "object") {
      continue;
    }
    const name = String(header.name || "").trim().toLowerCase();
    if (name === normalizedTarget) {
      values.push(String(header.value || ""));
    }
  }
  return values;
}

function summarizeWebRequestBody(requestBody) {
  if (!requestBody || typeof requestBody !== "object") {
    return null;
  }

  if (requestBody.error) {
    return { error: String(requestBody.error) };
  }

  if (requestBody.formData && typeof requestBody.formData === "object") {
    const output = {};
    for (const [key, values] of Object.entries(requestBody.formData)) {
      output[key] = Array.isArray(values) ? values.map((item) => String(item ?? "")) : [String(values ?? "")];
    }
    return { type: "formData", formData: output };
  }

  if (Array.isArray(requestBody.raw) && requestBody.raw.length > 0) {
    const chunks = requestBody.raw.map((entry) => {
      if (!entry || typeof entry !== "object") {
        return {};
      }
      const bytes = Number(entry.bytes?.byteLength || 0);
      return {
        bytes,
        file: entry.file ? String(entry.file) : "",
      };
    });
    return { type: "raw", chunks };
  }

  return { type: "unknown" };
}

async function captureCookieSnapshotForUrl(flow, url, trigger, requestId = "") {
  if (!flow || !url || !chrome.cookies) {
    return;
  }
  if (shouldIgnoreUrlForFlow(flow, url)) {
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return;
  }

  if (!/^https?:$/i.test(parsedUrl.protocol)) {
    return;
  }

  try {
    const cookies = await chrome.cookies.getAll({ url: parsedUrl.toString() });
    appendFlowEvent(flow, {
      source: "web-request",
      phase: "cookies-snapshot",
      requestId: String(requestId || ""),
      trigger: String(trigger || ""),
      url: parsedUrl.toString(),
      cookies: Array.isArray(cookies)
        ? cookies.map((cookie) => ({
            domain: cookie.domain,
            path: cookie.path,
            name: cookie.name,
            value: cookie.value,
            session: cookie.session,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
            expirationDate: cookie.expirationDate,
            hostOnly: cookie.hostOnly,
            storeId: cookie.storeId,
            partitionKey: cookie.partitionKey || null,
          }))
        : [],
    });
  } catch (error) {
    appendFlowEvent(flow, {
      source: "web-request",
      phase: "cookies-snapshot-error",
      requestId: String(requestId || ""),
      trigger: String(trigger || ""),
      url: String(url || ""),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function appendWebRequestEvent(flow, phase, details = {}, extra = {}) {
  appendFlowEvent(flow, {
    source: "web-request",
    phase,
    tabId: normalizeTabId(details.tabId),
    requestId: String(details.requestId || ""),
    method: String(details.method || ""),
    url: String(details.url || ""),
    type: String(details.type || ""),
    frameId: Number(details.frameId || 0),
    parentFrameId: Number(details.parentFrameId || -1),
    documentId: String(details.documentId || ""),
    documentLifecycle: String(details.documentLifecycle || ""),
    initiator: String(details.initiator || ""),
    ip: String(details.ip || ""),
    statusCode: Number(details.statusCode || 0),
    statusLine: String(details.statusLine || ""),
    fromCache: details.fromCache === true,
    error: String(details.error || ""),
    timestampMs: Number(details.timeStamp || 0),
    ...extra,
  });
}

function handleWebRequestBeforeRequest(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }

  appendWebRequestEvent(flow, "onBeforeRequest", details, {
    requestBody: summarizeWebRequestBody(details.requestBody),
  });
}

function handleWebRequestBeforeSendHeaders(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }

  appendWebRequestEvent(flow, "onBeforeSendHeaders", details, {
    requestHeaders: toDebugHeadersObject(details.requestHeaders || []),
    cookieHeaders: extractHeaderValues(details.requestHeaders || [], "cookie"),
  });
}

function handleWebRequestHeadersReceived(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }

  const setCookieHeaders = extractHeaderValues(details.responseHeaders || [], "set-cookie");
  appendWebRequestEvent(flow, "onHeadersReceived", details, {
    responseHeaders: toDebugHeadersObject(details.responseHeaders || []),
    setCookieHeaders,
  });
  void captureCookieSnapshotForUrl(flow, details.url || "", "headers-received", details.requestId || "");
}

function handleWebRequestBeforeRedirect(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }

  const setCookieHeaders = extractHeaderValues(details.responseHeaders || [], "set-cookie");
  appendWebRequestEvent(flow, "onBeforeRedirect", details, {
    redirectUrl: String(details.redirectUrl || ""),
    responseHeaders: toDebugHeadersObject(details.responseHeaders || []),
    setCookieHeaders,
  });
  void captureCookieSnapshotForUrl(flow, details.url || "", "before-redirect", details.requestId || "");
  if (details.redirectUrl && !shouldIgnoreUrlForFlow(flow, details.redirectUrl)) {
    void captureCookieSnapshotForUrl(flow, details.redirectUrl, "redirect-target", details.requestId || "");
  }
}

function handleWebRequestCompleted(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }

  appendWebRequestEvent(flow, "onCompleted", details, {
    responseHeaders: toDebugHeadersObject(details.responseHeaders || []),
  });
  void captureCookieSnapshotForUrl(flow, details.url || "", "completed", details.requestId || "");
}

function handleWebRequestError(details) {
  const flow = getFlowForWebRequest(details);
  if (!flow) {
    return;
  }
  appendWebRequestEvent(flow, "onErrorOccurred", details, {});
}

chrome.runtime.onInstalled.addListener((details) => {
  void configureSidePanelBehavior();
  void ensureImsLoginRedirectRule();
  void updateActionBadge();
  void syncBuildInfo(`onInstalled:${details?.reason || "unknown"}`);
});

chrome.runtime.onStartup.addListener(() => {
  void configureSidePanelBehavior();
  void ensureImsLoginRedirectRule();
  void updateActionBadge();
  void syncBuildInfo("onStartup");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === BUILD_INFO_REQUEST_TYPE || message?.type === LEGACY_BUILD_INFO_REQUEST_TYPE) {
    void syncBuildInfo("buildInfoRequest")
      .then((info) => {
        sendResponse({ ok: true, info });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (message?.type === FETCH_AVATAR_REQUEST_TYPE || message?.type === LEGACY_FETCH_AVATAR_REQUEST_TYPE) {
    void fetchAvatarAsDataUrl(message?.url || "", message?.accessToken || "")
      .then((dataUrl) => {
        sendResponse({ ok: true, dataUrl });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (message?.type === `${DEBUG_MESSAGE_TYPE_PREFIX}startFlow` || message?.type === `${LEGACY_DEBUG_MESSAGE_TYPE_PREFIX}startFlow`) {
    const flow = createDebugFlow(message?.context || {});
    appendFlowEvent(flow, {
      source: "extension",
      phase: "flow-start",
      trigger: String(message?.trigger || "test-mvpd-login"),
    });
    sendResponse({ ok: true, flowId: flow.flowId });
    return false;
  }

  if (message?.type === `${DEBUG_MESSAGE_TYPE_PREFIX}traceEvent` || message?.type === `${LEGACY_DEBUG_MESSAGE_TYPE_PREFIX}traceEvent`) {
    const flow = getFlowById(message?.flowId || "");
    if (!flow) {
      sendResponse({ ok: false, error: "Debug flow not found." });
      return false;
    }

    appendFlowEvent(flow, {
      source: "extension",
      phase: "event",
      ...(message?.event && typeof message.event === "object" ? message.event : {}),
    });
    sendResponse({ ok: true });
    return false;
  }

  if (message?.type === `${DEBUG_MESSAGE_TYPE_PREFIX}bindFlowTab` || message?.type === `${LEGACY_DEBUG_MESSAGE_TYPE_PREFIX}bindFlowTab`) {
    void bindFlowToTab(message?.flowId || "", message?.tabId || 0, message?.metadata || {})
      .then(() => {
        sendResponse({ ok: true });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });
    return true;
  }

  if (message?.type === `${DEBUG_MESSAGE_TYPE_PREFIX}stopFlow` || message?.type === `${LEGACY_DEBUG_MESSAGE_TYPE_PREFIX}stopFlow`) {
    const flow = getFlowById(message?.flowId || "");
    if (!flow) {
      sendResponse({ ok: true, flow: null });
      return false;
    }

    appendFlowEvent(flow, {
      source: "extension",
      phase: "flow-stop",
      reason: String(message?.reason || "manual"),
    });

    const snapshot = serializeFlow(flow);

    if (flow.tabId) {
      debugState.flowIdByTabId.delete(flow.tabId);
      void detachDebuggerForTab(flow.tabId, "flow-stop");
      flow.tabId = 0;
    }
    scheduleFlowPersist(flow);
    scheduleFlowIndexPersist();
    sendResponse({ ok: true, flow: snapshot });
    return false;
  }

  return false;
});

chrome.runtime.onConnect.addListener((port) => {
  if (!port || (port.name !== DEBUG_DEVTOOLS_PORT_NAME && port.name !== LEGACY_DEBUG_DEVTOOLS_PORT_NAME)) {
    return;
  }

  let subscribedTabId = 0;

  const onMessage = (message) => {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "subscribe") {
      const nextTabId = normalizeTabId(message.tabId);
      if (subscribedTabId && subscribedTabId !== nextTabId) {
        unsubscribePortFromTab(port, subscribedTabId);
      }
      subscribedTabId = nextTabId;
      if (subscribedTabId) {
        subscribePortToTab(port, subscribedTabId);
        void restoreFlowForTabFromStorage(subscribedTabId).then((restored) => {
          if (restored) {
            sendFlowSnapshotToTabPorts(subscribedTabId);
            void ensureDebuggerAttachedForTab(subscribedTabId, restored);
          }
        });
      }
      return;
    }

    if (message.type === "clear") {
      const tabId = normalizeTabId(message.tabId || subscribedTabId);
      const flow = getFlowByTabId(tabId);
      if (flow) {
        flow.events = [];
        flow.requestById.clear();
        flow.updatedAt = new Date().toISOString();
        scheduleFlowPersist(flow);
        scheduleFlowIndexPersist();
      }
      sendFlowSnapshotToTabPorts(tabId);
    }
  };

  const onDisconnect = () => {
    if (subscribedTabId) {
      unsubscribePortFromTab(port, subscribedTabId);
    }
    port.onMessage.removeListener(onMessage);
    port.onDisconnect.removeListener(onDisconnect);
  };

  port.onMessage.addListener(onMessage);
  port.onDisconnect.addListener(onDisconnect);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  const flow = getFlowByTabId(normalizedTabId);
  if (flow) {
    appendFlowEvent(flow, {
      source: "extension",
      phase: "tab-closed",
      tabId: normalizedTabId,
    });
    flow.tabId = 0;
  }

  debugState.flowIdByTabId.delete(normalizedTabId);
  scheduleFlowIndexPersist();
  void detachDebuggerForTab(normalizedTabId, "tab-removed");
});

chrome.debugger.onEvent.addListener(handleDebuggerEvent);
chrome.debugger.onDetach.addListener(handleDebuggerDetach);

if (chrome.webRequest) {
  chrome.webRequest.onBeforeRequest.addListener(handleWebRequestBeforeRequest, WEB_REQUEST_FILTER, ["requestBody"]);
  chrome.webRequest.onBeforeSendHeaders.addListener(handleWebRequestBeforeSendHeaders, WEB_REQUEST_FILTER, [
    "requestHeaders",
    "extraHeaders",
  ]);
  chrome.webRequest.onHeadersReceived.addListener(handleWebRequestHeadersReceived, WEB_REQUEST_FILTER, [
    "responseHeaders",
    "extraHeaders",
  ]);
  chrome.webRequest.onBeforeRedirect.addListener(handleWebRequestBeforeRedirect, WEB_REQUEST_FILTER, [
    "responseHeaders",
    "extraHeaders",
  ]);
  chrome.webRequest.onCompleted.addListener(handleWebRequestCompleted, WEB_REQUEST_FILTER, [
    "responseHeaders",
    "extraHeaders",
  ]);
  chrome.webRequest.onErrorOccurred.addListener(handleWebRequestError, WEB_REQUEST_FILTER);
}

void configureSidePanelBehavior();
void ensureImsLoginRedirectRule();
void updateActionBadge();
void syncBuildInfo("serviceWorkerStart");
void restoreDebugStateFromStorage().then(() => reattachDebuggersFromState());
