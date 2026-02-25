"use strict";

const IMS_CLIENT_ID = "adobeExperienceCloudDebugger";
const IMS_SCOPE =
  "AdobeID,openid,avatar,session,read_organizations,additional_info.job_function,additional_info.projectedProductContext,additional_info.account_type,additional_info.roles,additional_info.user_image_url,analytics_services";
const IMS_AUTHORIZE_URL = "https://ims-na1.adobelogin.com/ims/authorize/v1";
const IMS_PROFILE_URL = "https://ims-na1.adobelogin.com/ims/profile/v1";
const IMS_ORGS_URL = "https://ims-na1.adobelogin.com/ims/organizations/v5";
const IMS_LEGACY_REDIRECT_URI = "https://login.aepdebugger.adobe.com";
const IMS_PROFILE_CLIENT_IDS = [IMS_CLIENT_ID, "AdobePass1"];
const IMS_LOGOUT_URLS = [
  `https://ims-na1.adobelogin.com/ims/logout/v1?client_id=${encodeURIComponent(IMS_CLIENT_ID)}&locale=en_US`,
  "https://ims-na1.adobelogin.com/ims/logout/v1?client_id=AdobePass1&locale=en_US",
  "https://ims-na1.adobelogin.com/ims/logout?locale=en_US",
];
const HELPER_STATE_KEY = "underpar_helper_state_v1";
const LEGACY_HELPER_STATE_KEY = "mincloudlogin_helper_state_v1";
const HELPER_RESULT_PREFIX = "underpar_helper_result_v1:";
const LEGACY_HELPER_RESULT_PREFIX = "mincloudlogin_helper_result_v1:";
const HELPER_RESULT_MESSAGE_TYPE = "underpar:loginHelperResult";
const LEGACY_HELPER_RESULT_MESSAGE_TYPE = "mincloudlogin:loginHelperResult";
const CLOSE_WINDOW_DELAY_MS = 350;

const statusElement = document.getElementById("status");

function setStatus(text) {
  if (!statusElement) {
    return;
  }
  statusElement.textContent = String(text || "");
}

function randomToken() {
  try {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

function parseJsonText(text, fallback = null) {
  if (!text || typeof text !== "string") {
    return fallback;
  }
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function normalizeAvatarCandidate(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "");
  if (!trimmed) {
    return "";
  }

  if (/^data:image\//i.test(trimmed) || /^blob:/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    if (parsed.protocol !== "https:") {
      return "";
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

function isPpsProfileImageUrl(url) {
  if (!url || url.startsWith("data:image/") || url.startsWith("blob:")) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return /(^|\.)pps\.services\.adobe\.com$/i.test(parsed.hostname) && /\/api\/profile\/[^/]+\/image(\/|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function getProfileIdentityValue(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return "";
  }

  return firstNonEmptyString([
    profilePayload?.userId,
    profilePayload?.user_id,
    profilePayload?.sub,
    profilePayload?.id,
  ]);
}

function isSyntheticIdentityAvatarCandidate(profilePayload, candidate) {
  const identity = getProfileIdentityValue(profilePayload);
  const normalized = normalizeAvatarCandidate(candidate);
  if (!identity || !normalized || !isImsAvatarDownloadUrl(normalized)) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    const match = parsed.pathname.match(/\/ims\/avatar\/download\/([^/?#]+)/i);
    if (!match) {
      return false;
    }
    const decodedIdentity = decodeURIComponent(String(match[1] || "")).trim();
    return decodedIdentity === identity;
  } catch {
    return false;
  }
}

function collectProfileAvatarCandidates(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return [];
  }

  const candidates = new Set();
  const pushCandidate = (value) => {
    const normalized = normalizeAvatarCandidate(value);
    if (normalized) {
      candidates.add(normalized);
    }
  };

  const explicitValues = [
    profilePayload?.user_image_url,
    profilePayload?.userImageUrl,
    profilePayload?.avatar,
    profilePayload?.avatarUrl,
    profilePayload?.avatar_url,
    profilePayload?.additional_info?.user_image_url,
    profilePayload?.additional_info?.userImageUrl,
    profilePayload?.additional_info?.avatar,
    profilePayload?.additional_info?.avatarUrl,
    profilePayload?.additional_info?.avatar_url,
    profilePayload?.picture,
    profilePayload?.photo,
    profilePayload?.imageUrl,
    profilePayload?.images?.avatar?.url,
    profilePayload?.images?.avatar?.href,
    profilePayload?.images?.profile?.url,
    profilePayload?.images?.profile?.href,
  ];

  for (const value of explicitValues) {
    pushCandidate(value);
  }

  const seen = new WeakSet();
  const queue = [profilePayload];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || seen.has(current)) {
      continue;
    }
    seen.add(current);

    if (Array.isArray(current)) {
      for (const entry of current) {
        if (entry && typeof entry === "object") {
          queue.push(entry);
        } else if (typeof entry === "string") {
          pushCandidate(entry);
        }
      }
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === "object") {
        queue.push(value);
        continue;
      }
      if (typeof value !== "string") {
        continue;
      }

      if (/avatar|photo|picture|image|thumbnail|icon/i.test(key) || /\/api\/profile\/[^/]+\/image\//i.test(value)) {
        pushCandidate(value);
      }
    }
  }

  return [...candidates];
}

function scoreProfileAvatarPayload(profilePayload) {
  if (!profilePayload || typeof profilePayload !== "object") {
    return Number.NEGATIVE_INFINITY;
  }

  const candidates = collectProfileAvatarCandidates(profilePayload).filter(
    (candidate) => !isSyntheticIdentityAvatarCandidate(profilePayload, candidate)
  );
  if (candidates.length === 0) {
    return -100;
  }

  let bestScore = -100;
  for (const candidate of candidates.slice(0, 10)) {
    let score = 0;
    if (candidate.startsWith("data:image/")) {
      score += 420;
    } else if (isPpsProfileImageUrl(candidate)) {
      score += 340;
    } else if (isImsAvatarDownloadUrl(candidate)) {
      score += 260;
    } else if (/\/ims\/avatar\//i.test(candidate)) {
      score += 220;
    } else {
      score += 140;
    }

    if (/avatar|profile|picture|photo|image/i.test(candidate)) {
      score += 16;
    }
    bestScore = Math.max(bestScore, score);
  }

  return bestScore + Math.min(candidates.length, 10) * 3;
}

function decodeBase64Url(value) {
  if (!value) {
    return "";
  }
  let normalized = String(value).trim().replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;
  if (remainder) {
    normalized += "=".repeat(4 - remainder);
  }
  try {
    return atob(normalized);
  } catch {
    return "";
  }
}

function decodeExtraParams(rawValue) {
  const decoded = decodeBase64Url(rawValue);
  const parsed = parseJsonText(decoded, {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }
  return parsed;
}

function extractAuthParams(responseUrl) {
  const response = new URL(responseUrl);
  const params = new URLSearchParams(response.search);

  let hash = response.hash.startsWith("#") ? response.hash.slice(1) : response.hash;
  if (hash) {
    hash = hash.replace(/from_ims=true\?/gi, "from_ims=true&").replace(/#/g, "&");
    const hashParams = new URLSearchParams(hash);
    for (const [key, value] of hashParams.entries()) {
      if (!params.has(key)) {
        params.set(key, value);
      }
    }
  }

  return params;
}

function parseAuthResponse(responseUrl, expectedState = "") {
  const authParams = extractAuthParams(responseUrl);
  const authError = authParams.get("error");
  if (authError) {
    const description = authParams.get("error_description");
    throw new Error(description ? `${authError}: ${description}` : authError);
  }

  const returnedState = String(authParams.get("state") || "");
  const normalizedExpectedState = String(expectedState || "");
  if (normalizedExpectedState && returnedState && returnedState !== normalizedExpectedState) {
    throw new Error("State validation failed.");
  }

  const accessToken = String(authParams.get("access_token") || "").trim();
  if (!accessToken) {
    throw new Error("No access token returned from IMS.");
  }

  const expiresInSeconds = Number(authParams.get("expires_in") || "0");
  const expiresAt = Date.now() + Math.max(expiresInSeconds, 0) * 1000;

  return { accessToken, expiresAt };
}

function buildAuthorizeUrl(requestState, extraParams = {}) {
  const params = new URLSearchParams({
    client_id: IMS_CLIENT_ID,
    response_type: "token",
    scope: IMS_SCOPE,
    state: requestState,
    locale: "en_US",
    redirect_uri: IMS_LEGACY_REDIRECT_URI,
  });

  for (const [key, value] of Object.entries(extraParams || {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  return `${IMS_AUTHORIZE_URL}?${params.toString()}`;
}

function buildImsProfileHeaders(accessToken = "", clientId = "") {
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=utf-8",
  };

  if (clientId) {
    headers["X-IMS-ClientId"] = clientId;
    headers["x-api-key"] = clientId;
    headers.client_id = clientId;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

async function fetchProfile(accessToken = "") {
  if (!accessToken) {
    return null;
  }

  const endpoints = [
    ...IMS_PROFILE_CLIENT_IDS.map((clientId) => ({
      url: `${IMS_PROFILE_URL}?client_id=${encodeURIComponent(clientId)}`,
      clientId,
    })),
    {
      url: IMS_PROFILE_URL,
      clientId: "",
    },
  ];

  let bestPayload = null;
  let bestPayloadScore = Number.NEGATIVE_INFINITY;
  for (const endpoint of endpoints) {
    const attempts = [{ credentials: "omit" }, { credentials: "include" }];

    for (const attempt of attempts) {
      try {
        const response = await fetch(endpoint.url, {
          method: "GET",
          mode: "cors",
          credentials: attempt.credentials,
          headers: buildImsProfileHeaders(accessToken, endpoint.clientId),
        });
        if (!response.ok) {
          continue;
        }
        const text = await response.text().catch(() => "");
        const parsed = parseJsonText(text, null);
        if (parsed && typeof parsed === "object") {
          const payloadScore = scoreProfileAvatarPayload(parsed);
          if (payloadScore > bestPayloadScore) {
            bestPayload = parsed;
            bestPayloadScore = payloadScore;
          }
          if (payloadScore >= 320) {
            return parsed;
          }
        }
      } catch {
        // Continue to next variant.
      }
    }
  }

  return bestPayload;
}

async function fetchOrganizations(accessToken = "") {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(IMS_ORGS_URL, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

function readHelperState() {
  try {
    const raw = sessionStorage.getItem(HELPER_STATE_KEY) || sessionStorage.getItem(LEGACY_HELPER_STATE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeHelperState(nextState) {
  try {
    sessionStorage.setItem(HELPER_STATE_KEY, JSON.stringify(nextState || {}));
    sessionStorage.removeItem(LEGACY_HELPER_STATE_KEY);
  } catch {
    // Ignore storage failures in helper window.
  }
}

function clearHelperState() {
  try {
    sessionStorage.removeItem(HELPER_STATE_KEY);
    sessionStorage.removeItem(LEGACY_HELPER_STATE_KEY);
  } catch {
    // Ignore storage failures in helper window.
  }
}

function getResultStorageKeys(requestId) {
  const normalized = String(requestId || "").trim();
  if (!normalized) {
    return [];
  }
  return [`${HELPER_RESULT_PREFIX}${normalized}`, `${LEGACY_HELPER_RESULT_PREFIX}${normalized}`];
}

function getResultStorageArea() {
  return chrome.storage?.session || chrome.storage?.local || null;
}

async function cacheResultForPopup(payload) {
  const requestId = String(payload?.requestId || "").trim();
  const storageArea = getResultStorageArea();
  if (!requestId || !storageArea?.set) {
    return;
  }

  const keys = getResultStorageKeys(requestId);
  const persistPayload = {};
  for (const key of keys) {
    persistPayload[key] = payload;
  }
  try {
    await storageArea.set(persistPayload);
  } catch {
    // Ignore storage session failures.
  }
}

async function emitResult(payload) {
  const normalizedPayload = {
    ...payload,
    requestId: String(payload?.requestId || "").trim(),
  };

  await cacheResultForPopup(normalizedPayload);

  try {
    await chrome.runtime.sendMessage({
      type: HELPER_RESULT_MESSAGE_TYPE,
      message: normalizedPayload,
    });
  } catch {
    // The opener may be closed; storage-backed polling still covers this.
  }

  try {
    await chrome.runtime.sendMessage({
      type: LEGACY_HELPER_RESULT_MESSAGE_TYPE,
      message: normalizedPayload,
    });
  } catch {
    // Legacy opener may be unavailable; ignore.
  }
}

function closeWindowSoon() {
  window.setTimeout(() => {
    window.close();
  }, CLOSE_WINDOW_DELAY_MS);
}

async function failLogin(requestId, error) {
  const message = error instanceof Error ? error.message : String(error || "Login failed.");
  setStatus(message);
  await emitResult({
    ok: false,
    mode: "login",
    requestId,
    error: message,
  });
  closeWindowSoon();
}

async function handleImsRedirect(query) {
  const stored = readHelperState();
  const requestId = String(stored?.requestId || query.get("requestId") || "").trim();
  const expectedState = String(stored?.requestState || query.get("state") || "").trim();

  try {
    setStatus("Finishing sign-in...");
    const authData = parseAuthResponse(window.location.href, expectedState);
    const profile = await fetchProfile(authData.accessToken);
    const organizations = await fetchOrganizations(authData.accessToken);
    clearHelperState();

    await emitResult({
      ok: true,
      mode: "login",
      requestId,
      accessToken: authData.accessToken,
      expiresAt: authData.expiresAt,
      profile,
      organizations,
    });

    setStatus("Sign-in completed. Closing window...");
    closeWindowSoon();
  } catch (error) {
    clearHelperState();
    await failLogin(requestId, error);
  }
}

function beginLogin(query) {
  const requestId = String(query.get("requestId") || "").trim() || randomToken();
  const requestState = String(query.get("state") || "").trim() || randomToken();
  const extraParams = decodeExtraParams(query.get("extra"));
  const authUrl = buildAuthorizeUrl(requestState, extraParams);

  writeHelperState({
    requestId,
    requestState,
    createdAt: Date.now(),
  });

  setStatus("Redirecting to UnderPAR IMS...");
  window.location.replace(authUrl);
}

async function beginLogout(query) {
  const requestId = String(query.get("requestId") || "").trim();
  setStatus("Signing out...");

  for (const url of IMS_LOGOUT_URLS) {
    try {
      await fetch(url, {
        method: "GET",
        credentials: "include",
        mode: "no-cors",
        cache: "no-store",
      });
    } catch {
      // Continue best-effort logout across IMS endpoints.
    }
  }

  clearHelperState();
  await emitResult({
    ok: true,
    mode: "logout",
    requestId,
  });
  setStatus("Sign-out completed. Closing window...");
  closeWindowSoon();
}

async function run() {
  const query = new URLSearchParams(window.location.search);
  const mode = String(query.get("mode") || "login").toLowerCase() === "logout" ? "logout" : "login";
  const fromIms = String(query.get("from_ims") || "").toLowerCase() === "true";

  if (mode === "logout") {
    await beginLogout(query);
    return;
  }

  if (fromIms || window.location.href.includes("from_ims=true")) {
    await handleImsRedirect(query);
    return;
  }

  beginLogin(query);
}

void run();
