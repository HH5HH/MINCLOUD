const environmentSelect = document.getElementById("environment-select");
const switchButton = document.getElementById("switch-btn");
const controllerStatusCard = document.getElementById("controller-status-card");
const controllerStatusBadge = document.getElementById("controller-status-badge");
const controllerStatusTitle = document.getElementById("controller-status-title");
const controllerStatusDetail = document.getElementById("controller-status-detail");
const environmentUrlsToggle = document.getElementById("environment-urls-toggle");
const environmentUrlsPanel = document.getElementById("environment-urls-panel");
const shellUrlEl = document.getElementById("shell-url");
const consoleBaseEl = document.getElementById("console-base");
const cmConsoleUrlEl = document.getElementById("cm-console-url");
const mgmtBaseEl = document.getElementById("mgmt-base");
const spBaseEl = document.getElementById("sp-base");
const dcrRegisterUrlEl = document.getElementById("dcr-register-url");
const dcrTokenUrlEl = document.getElementById("dcr-token-url");
const restV2BaseEl = document.getElementById("rest-v2-base");
const esmBaseEl = document.getElementById("esm-base");
const degradationBaseEl = document.getElementById("degradation-base");
const vaultToggle = document.getElementById("vault-toggle");
const vaultPanel = document.getElementById("vault-panel");
const vaultBadge = document.getElementById("vault-badge");
const vaultStatus = document.getElementById("vault-status");
const vaultSummary = document.getElementById("vault-summary");
const vaultPassSummary = document.getElementById("vault-pass-summary");
const vaultPassRecords = document.getElementById("vault-pass-records");
const vaultSections = document.getElementById("vault-sections");
const vaultExportButton = document.getElementById("vault-export-btn");
const vaultImportButton = document.getElementById("vault-import-btn");
const vaultPurgeButton = document.getElementById("vault-purge-btn");
const vaultImportInput = document.getElementById("vault-import-input");
const vaultSlacktivateToggle = document.getElementById("vault-slacktivate-toggle");
const vaultSlacktivatePanel = document.getElementById("vault-slacktivate-panel");
const vaultSlacktivateBadge = document.getElementById("vault-slacktivate-badge");
const vaultSlacktivateContent = document.getElementById("vault-slacktivate-content");
const vaultSlacktivateInput = document.getElementById("vault-slacktivate-input");
const UP_DEVTOOLS_STATUS_PORT_NAME = "underpar-up-devtools-status";
const FALLBACK_STORAGE_KEY = "underpar_adobepass_environment_v1";
const UNDERPAR_VAULT_STORAGE_KEY = "underpar_vault_v1";
const UNDERPAR_VAULT_CSV_SCHEMA = "underpar-pass-vault-csv-v5";
const UNDERPAR_VAULT_SUPPORTED_CSV_SCHEMAS = new Set([
  UNDERPAR_VAULT_CSV_SCHEMA,
  "underpar-pass-vault-csv-v4",
]);
const UNDERPAR_PASS_VAULT_PREMIUM_DETECTION_VERSION = 3;
const UP_DEVTOOLS_VAULT_ACTION_REQUEST_TYPE = "underpar:upDevtoolsVaultAction";
const UNDERPAR_DCR_CACHE_PREFIX = "underpar_dcr_cache_v1";
const SLACKTIVATION_WORKSPACE_ORIGIN = "https://adobedx.slack.com";
const SLACKTIVATION_OPENID_DEFAULT_SCOPE = "openid profile email";
const SLACKTIVATION_OPENID_DEFAULT_REDIRECT_PATH = "slack-user";
const UNDERPAR_PASS_TRANSITION_CHANNEL_ID = "C09NHJCMFC1";
const UNDERPAR_PASS_TRANSITION_CHANNEL_NAME = "pass-transition";
const VAULT_REQUIRED_SCOPE_BY_SERVICE_KEY = Object.freeze({
  restV2: "api:client:v2",
  esm: "analytics:client",
  degradation: "decisions:owner",
});
const FALLBACK_DEFAULT_KEY = "release-production";
const FALLBACK_ENVIRONMENTS = Object.freeze([
  {
    key: "release-production",
    label: "Production",
    route: "release-production",
    consoleBase: "https://console.auth.adobe.com",
    cmConsoleOrigin: "https://experience.adobe.com",
    mgmtBase: "https://mgmt.auth.adobe.com",
    spBase: "https://sp.auth.adobe.com",
  },
  {
    key: "release-staging",
    label: "Staging",
    route: "release-staging",
    consoleBase: "https://console.auth-staging.adobe.com",
    cmConsoleOrigin: "https://experience-stage.adobe.com",
    mgmtBase: "https://mgmt.auth-staging.adobe.com",
    spBase: "https://sp.auth-staging.adobe.com",
  },
]);
const panelState = {
  controllerReady: false,
  controllerStatusMessage: "Waiting for UnderPAR side panel status...",
  environmentsLoaded: false,
  switchBusy: false,
  statusPort: null,
  statusReconnectTimerId: 0,
  vaultLoadPromise: null,
  vaultSnapshot: null,
  vaultDirty: true,
  vaultMutationVersion: 0,
  vaultRefreshTimerId: 0,
  vaultStorageListenersBound: false,
  vaultImportBusy: false,
  vaultActionBusy: false,
  vaultActionContext: null,
  vaultSlacktivateDragDepth: 0,
};

function normalizeEnvironmentKey(value) {
  return String(value || "").trim().toLowerCase();
}

function resolveEnvironmentRecord(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return (
      FALLBACK_ENVIRONMENTS.find((entry) => normalizeEnvironmentKey(entry.key) === normalizeEnvironmentKey(value.key)) ||
      FALLBACK_ENVIRONMENTS[0]
    );
  }
  return FALLBACK_ENVIRONMENTS.find((entry) => normalizeEnvironmentKey(entry.key) === normalizeEnvironmentKey(value)) || FALLBACK_ENVIRONMENTS[0];
}

function cloneEnvironment(environment) {
  const source = resolveEnvironmentRecord(environment);
  const consoleShellUrl = `https://experience.adobe.com/#/@adobepass/pass/authentication/${source.route}`;
  const cmConsoleShellUrl = `${String(source.cmConsoleOrigin || "https://experience.adobe.com").replace(/\/+$/, "")}/#/@adobepass/cm-console/cmu/year`;
  const dcrRegisterUrl = `${source.spBase}/o/client/register`;
  const dcrTokenUrl = `${source.spBase}/o/client/token`;
  const restV2Base = `${source.spBase}/api/v2`;
  const esmBase = `${source.mgmtBase}/esm/v3/media-company/`;
  const degradationBase = `${source.mgmtBase}/control/v3/degradation`;
  const cmReportsBase = String(source.cmReportsBase || "https://cm-reports.adobeprimetime.com").trim();
  return {
    ...source,
    consoleShellUrl,
    cmConsoleShellUrl,
    consoleProgrammersUrl: `${consoleShellUrl}/programmers`,
    consoleCallbackPrefix: `${source.consoleBase}/oauth2/callback`,
    cmReportsBase,
    degradationBase,
    dcrRegisterUrl,
    dcrTokenUrl,
    clickEsmTokenUrl: dcrTokenUrl,
    restV2Base,
    esmBase,
    envBadgeTitle: buildEnvironmentTooltip(source),
  };
}

function buildEnvironmentTooltip(environment) {
  const env = resolveEnvironmentRecord(environment);
  const consoleShellUrl = `https://experience.adobe.com/#/@adobepass/pass/authentication/${env.route}`;
  const cmConsoleShellUrl = `${String(env.cmConsoleOrigin || "https://experience.adobe.com").replace(/\/+$/, "")}/#/@adobepass/cm-console/cmu/year`;
  const dcrRegisterUrl = `${env.spBase}/o/client/register`;
  const dcrTokenUrl = `${env.spBase}/o/client/token`;
  const restV2Base = `${env.spBase}/api/v2`;
  const esmBase = `${env.mgmtBase}/esm/v3/media-company/`;
  const degradationBase = `${env.mgmtBase}/control/v3/degradation`;
  const cmReportsBase = String(env.cmReportsBase || "https://cm-reports.adobeprimetime.com").trim();
  return [
    `Environment : ${env.label}`,
    `AdobePASS Console : ${consoleShellUrl}`,
    `AdobePASS Console Base : ${env.consoleBase}`,
    `CM Console : ${cmConsoleShellUrl}`,
    `Management : ${env.mgmtBase}`,
    `Service Provider : ${env.spBase}`,
    `DCR Register : ${dcrRegisterUrl}`,
    `DCR Token : ${dcrTokenUrl}`,
    `REST V2 : ${restV2Base}`,
    `ESM : ${esmBase}`,
    `DEGRADATION : ${degradationBase}`,
    `Concurrency Monitoring : ${cmReportsBase}`,
  ].join("\n");
}

async function getFallbackStoredEnvironment() {
  try {
    if (chrome?.storage?.local?.get) {
      const payload = await chrome.storage.local.get(FALLBACK_STORAGE_KEY);
      const storedKey = normalizeEnvironmentKey(payload?.[FALLBACK_STORAGE_KEY] || FALLBACK_DEFAULT_KEY);
      return cloneEnvironment(storedKey);
    }
  } catch {
    // Ignore and fall back to default.
  }
  return cloneEnvironment(FALLBACK_DEFAULT_KEY);
}

async function setFallbackStoredEnvironment(value) {
  const environment = cloneEnvironment(value);
  if (!chrome?.storage?.local?.set) {
    throw new Error("Chrome local storage is unavailable in the UP settings panel.");
  }
  await chrome.storage.local.set({
    [FALLBACK_STORAGE_KEY]: environment.key,
  });
  return environment;
}

const fallbackRegistry = Object.freeze({
  listEnvironments() {
    return FALLBACK_ENVIRONMENTS.map((environment) => cloneEnvironment(environment));
  },
  getEnvironment(value) {
    return cloneEnvironment(value);
  },
  getDefaultEnvironment() {
    return cloneEnvironment(FALLBACK_DEFAULT_KEY);
  },
  async getStoredEnvironment() {
    return getFallbackStoredEnvironment();
  },
  async setStoredEnvironment(value) {
    return setFallbackStoredEnvironment(value);
  },
});

function getEnvironmentRegistry() {
  return globalThis.UnderParEnvironment || fallbackRegistry;
}

function clearStatusPortReconnectTimer() {
  if (panelState.statusReconnectTimerId) {
    window.clearTimeout(panelState.statusReconnectTimerId);
    panelState.statusReconnectTimerId = 0;
  }
}

function syncInteractiveControlState() {
  const canInteract = panelState.controllerReady && panelState.environmentsLoaded && !panelState.switchBusy;
  document.body.classList.toggle("up-controller-disabled", !panelState.controllerReady);
  if (environmentSelect) {
    environmentSelect.disabled = !canInteract;
    environmentSelect.title = panelState.controllerReady ? "AdobePASS environment" : panelState.controllerStatusMessage;
  }
  if (switchButton) {
    switchButton.disabled = !canInteract;
    switchButton.title = panelState.controllerReady ? "Switch environment" : panelState.controllerStatusMessage;
  }
}

function renderControllerStatus(snapshot = null) {
  const status = snapshot && typeof snapshot === "object" ? snapshot : {};
  const normalizedStatus = String(status.status || "bootstrapping").trim().toLowerCase();
  const ready = status.ready === true;
  let badgeText = "Checking";
  let titleText = "UP panel disabled";
  let detailText = String(status.message || "Waiting for UnderPAR side panel status...");

  if (ready) {
    badgeText = "Ready";
    titleText = "Connected";
    detailText = "Connected to the UnderPAR side panel.";
  } else if (normalizedStatus === "sidepanel-closed") {
    badgeText = "Offline";
    titleText = "Side panel closed";
  } else if (normalizedStatus === "signed-out") {
    badgeText = "Signed out";
    titleText = "Sign in required";
  } else if (normalizedStatus === "restricted") {
    badgeText = "Action needed";
    titleText = "Resolve side panel state";
  }

  panelState.controllerReady = ready;
  panelState.controllerStatusMessage = detailText;

  if (controllerStatusCard) {
    controllerStatusCard.hidden = ready;
  }
  if (controllerStatusBadge) {
    controllerStatusBadge.textContent = badgeText;
    controllerStatusBadge.dataset.status = ready ? "ready" : normalizedStatus || "bootstrapping";
  }
  if (controllerStatusTitle) {
    controllerStatusTitle.textContent = titleText;
  }
  if (controllerStatusDetail) {
    controllerStatusDetail.textContent = detailText;
  }

  syncInteractiveControlState();
}

function scheduleStatusPortReconnect() {
  if (panelState.statusReconnectTimerId) {
    return;
  }
  panelState.statusReconnectTimerId = window.setTimeout(() => {
    panelState.statusReconnectTimerId = 0;
    connectControllerStatusPort();
  }, 250);
}

function connectControllerStatusPort() {
  clearStatusPortReconnectTimer();
  if (panelState.statusPort) {
    return panelState.statusPort;
  }

  try {
    const port = chrome.runtime.connect({ name: UP_DEVTOOLS_STATUS_PORT_NAME });
    panelState.statusPort = port;
    port.onMessage.addListener((message) => {
      if (!message || typeof message !== "object" || message.type !== "controller-status") {
        return;
      }
      renderControllerStatus(message.status || null);
    });
    port.onDisconnect.addListener(() => {
      if (panelState.statusPort === port) {
        panelState.statusPort = null;
      }
      renderControllerStatus({
        ready: false,
        status: "sidepanel-closed",
        message: "Open the UnderPAR side panel to re-enable this UP panel.",
      });
      scheduleStatusPortReconnect();
    });
    return port;
  } catch {
    renderControllerStatus({
      ready: false,
      status: "sidepanel-closed",
      message: "Unable to reach the UnderPAR controller. Reload DevTools and reopen the side panel.",
    });
    scheduleStatusPortReconnect();
    return null;
  }
}

function clearVaultRefreshTimer() {
  if (panelState.vaultRefreshTimerId) {
    window.clearTimeout(panelState.vaultRefreshTimerId);
    panelState.vaultRefreshTimerId = 0;
  }
}

function isVaultExpanded() {
  return Boolean(vaultToggle) && vaultToggle.getAttribute("aria-expanded") !== "false";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeJsonStringify(value, spacing = 0) {
  try {
    return JSON.stringify(value, null, spacing);
  } catch (error) {
    return JSON.stringify({
      __underparVaultError: error instanceof Error ? error.message : String(error),
    });
  }
}

function estimateSerializedBytes(value) {
  return new TextEncoder().encode(safeJsonStringify(value)).length;
}

function formatBytes(bytes = 0) {
  const normalizedBytes = Math.max(0, Number(bytes || 0));
  if (normalizedBytes >= 1024 * 1024) {
    return `${(normalizedBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (normalizedBytes >= 1024) {
    return `${(normalizedBytes / 1024).toFixed(1)} KB`;
  }
  return `${normalizedBytes} B`;
}

function formatVaultKeyCount(count = 0) {
  const normalizedCount = Math.max(0, Number(count || 0));
  return `${normalizedCount} ${normalizedCount === 1 ? "Key" : "Keys"}`;
}

function formatVaultTimestamp(value) {
  const normalizedValue = Number(value || 0);
  if (!normalizedValue) {
    return "Unknown";
  }
  try {
    return new Date(normalizedValue).toLocaleString();
  } catch {
    return String(value || "");
  }
}

function firstNonEmptyString(values = []) {
  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value || "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function uniqueSorted(values = []) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || "").trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" })
  );
}

function cloneJsonLikeValue(value, fallback = null) {
  if (value == null) {
    return fallback;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function normalizeSlacktivationText(value = "", maxLength = 0) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  if (maxLength > 0) {
    return normalized.slice(0, maxLength);
  }
  return normalized;
}

function normalizeSlacktivationHandle(value = "") {
  const handle = String(value || "").trim().replace(/^@+/, "");
  if (!handle || /\s/.test(handle)) {
    return "";
  }
  return /^[a-z0-9._-]{1,80}$/i.test(handle) ? handle : "";
}

function normalizeSlacktivationToken(value = "") {
  const token = String(value || "").trim();
  return /^(?:xoxe\.)?xox[a-z]-/i.test(token) ? token : "";
}

function normalizeSlacktivationWorkspaceOrigin(value = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return SLACKTIVATION_WORKSPACE_ORIGIN;
  }
  try {
    const parsed = new URL(raw);
    const host = String(parsed.hostname || "").toLowerCase();
    if (parsed.protocol !== "https:" || (host !== "slack.com" && !host.endsWith(".slack.com"))) {
      return SLACKTIVATION_WORKSPACE_ORIGIN;
    }
    return parsed.origin;
  } catch {
    return SLACKTIVATION_WORKSPACE_ORIGIN;
  }
}

function normalizeSlacktivationChannelId(value = "") {
  const normalized = String(value || "").trim().toUpperCase();
  return /^[CGD][A-Z0-9]{8,}$/.test(normalized) ? normalized : "";
}

function normalizeSlacktivationDirectChannelId(value = "") {
  const normalized = String(value || "").trim().toUpperCase();
  return /^D[A-Z0-9]{8,}$/.test(normalized) ? normalized : "";
}

function normalizeSlacktivationUserId(value = "") {
  const normalized = String(value || "").trim().toUpperCase();
  return /^[UW][A-Z0-9]{8,}$/.test(normalized) ? normalized : "";
}

function normalizeSlacktivationTeamId(value = "") {
  const normalized = String(value || "").trim().toUpperCase();
  return /^T[A-Z0-9]{8,}$/.test(normalized) ? normalized : "";
}

function normalizeSlacktivationMention(value = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^<@[UW][A-Z0-9]{8,}>$/i.test(raw)) {
    return raw;
  }
  const plain = raw.startsWith("@") ? raw.slice(1).trim() : raw;
  return plain ? `@${plain}` : "";
}

function normalizeSlacktivationAvatarUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function normalizeSlacktivationStatusIcon(value = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^:[a-z0-9_+\-]{1,64}:$/i.test(raw)) {
    return raw.toLowerCase();
  }
  if (/^[a-z0-9_+\-]{1,64}$/i.test(raw)) {
    return `:${raw.toLowerCase()}:`;
  }
  return normalizeSlacktivationText(raw, 32);
}

function normalizeSlacktivationStatusIconUrl(value = "") {
  return normalizeSlacktivationAvatarUrl(value);
}

function normalizeSlacktivationReady(value = false) {
  if (value === true) {
    return true;
  }
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "ready";
}

function normalizeSlacktivationOpenIdScope(value = "") {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return SLACKTIVATION_OPENID_DEFAULT_SCOPE;
  }
  const allowed = new Set(["openid", "profile", "email"]);
  const scopes = raw
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry, index, array) => allowed.has(entry) && array.indexOf(entry) === index);
  if (!scopes.includes("openid")) {
    scopes.unshift("openid");
  }
  return scopes.length > 0 ? scopes.join(" ") : SLACKTIVATION_OPENID_DEFAULT_SCOPE;
}

function normalizeVaultSlacktivationApiTokens(value = null) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const rawCandidates = [
    source.botToken,
    source.bot_token,
    source.userToken,
    source.user_token,
    source.oauthToken,
    source.oauth_token,
  ];
  const botCandidates = [];
  const userCandidates = [];
  rawCandidates.forEach((entry) => {
    const token = normalizeSlacktivationToken(entry);
    if (!token) {
      return;
    }
    if (/^xoxb-/i.test(token)) {
      if (!botCandidates.includes(token)) {
        botCandidates.push(token);
      }
      return;
    }
    if (!userCandidates.includes(token)) {
      userCandidates.push(token);
    }
  });
  return {
    botToken: botCandidates[0] || "",
    userToken: userCandidates[0] || "",
    oauthToken: userCandidates[0] || "",
  };
}

function normalizeSlacktivationRedirectPath(value = "") {
  const raw = String(value || "").trim().replace(/^\/+/, "");
  if (!raw) {
    return SLACKTIVATION_OPENID_DEFAULT_REDIRECT_PATH;
  }
  const normalized = raw.replace(/[^a-zA-Z0-9._/-]/g, "");
  if (!normalized || normalized.includes("..")) {
    return SLACKTIVATION_OPENID_DEFAULT_REDIRECT_PATH;
  }
  return normalized;
}

function normalizeSlacktivationRedirectUri(value = "") {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw);
    const host = String(parsed.hostname || "").toLowerCase();
    if (parsed.protocol !== "https:" || !host.endsWith(".chromiumapp.org")) {
      return "";
    }
    return `${parsed.origin}${String(parsed.pathname || "").trim() || "/"}`;
  } catch {
    return "";
  }
}

function normalizeVaultSlacktivationKeyMeta(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const rawServices = [];
  const appendService = (candidate) => {
    if (Array.isArray(candidate)) {
      candidate.forEach((entry) => appendService(entry));
      return;
    }
    const text = normalizeSlacktivationText(candidate, 64);
    if (text) {
      rawServices.push(text);
    }
  };
  appendService(value?.services);
  appendService(value?.service);
  appendService(value?.features);
  const services = uniqueSorted(
    rawServices
  );
  const keyVersion = normalizeSlacktivationText(value?.keyVersion || value?.version || "", 64);
  const importedAt = normalizeSlacktivationText(value?.importedAt || "", 80);
  const source = normalizeSlacktivationText(value?.source || "", 64);
  if (!services.length && !keyVersion && !importedAt && !source) {
    return null;
  }
  return {
    services,
    keyVersion,
    importedAt,
    source,
  };
}

function normalizeVaultSlacktivationOpenIdSession(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const accessToken = normalizeSlacktivationToken(value?.accessToken || value?.access_token || "");
  const idToken = normalizeSlacktivationText(value?.idToken || value?.id_token || "", 4096);
  const scope = normalizeSlacktivationOpenIdScope(value?.scope || "");
  const expiresAtMs = Math.max(0, Number(value?.expiresAtMs || value?.expires_at_ms || 0));
  const userId = normalizeSlacktivationUserId(value?.userId || value?.user_id || "");
  const teamId = normalizeSlacktivationTeamId(value?.teamId || value?.team_id || "");
  const userName = normalizeSlacktivationText(value?.userName || value?.user_name || "", 120);
  const avatarUrl = normalizeSlacktivationAvatarUrl(value?.avatarUrl || value?.avatar_url || "");
  const email = normalizeSlacktivationText(value?.email || "", 160);
  const verifiedAtMs = Math.max(0, Number(value?.verifiedAtMs || 0));
  const createdAt = normalizeSlacktivationText(value?.createdAt || "", 80);
  if (!accessToken && !idToken && !userId && !teamId && !userName && !avatarUrl && !email && !expiresAtMs) {
    return null;
  }
  return {
    accessToken,
    idToken,
    scope,
    expiresAtMs,
    userId,
    teamId,
    userName,
    avatarUrl,
    email,
    verifiedAtMs,
    createdAt,
  };
}

function normalizeVaultSlacktivationIdentity(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const mode = normalizeSlacktivationText(value?.mode || "", 32).toLowerCase();
  const userId = normalizeSlacktivationUserId(value?.userId || value?.user_id || "");
  const teamId = normalizeSlacktivationTeamId(value?.teamId || value?.team_id || "");
  const userName = normalizeSlacktivationText(value?.userName || value?.user_name || "", 120);
  const email = normalizeSlacktivationText(value?.email || "", 160);
  const avatarUrl = normalizeSlacktivationAvatarUrl(value?.avatarUrl || value?.avatar_url || "");
  const statusIcon = normalizeSlacktivationStatusIcon(value?.statusIcon || value?.status_icon || "");
  const statusIconUrl = normalizeSlacktivationStatusIconUrl(value?.statusIconUrl || value?.status_icon_url || "");
  const statusMessage = normalizeSlacktivationText(value?.statusMessage || value?.status_message || "", 160);
  const directChannelId = normalizeSlacktivationDirectChannelId(value?.directChannelId || value?.direct_channel_id || "");
  const directChannelErrorCode = normalizeSlacktivationText(
    value?.directChannelErrorCode || value?.direct_channel_error_code || "",
    64
  );
  const avatarErrorCode = normalizeSlacktivationText(value?.avatarErrorCode || value?.avatar_error_code || "", 64);
  const avatarError = normalizeSlacktivationText(value?.avatarError || value?.avatar_error || "", 240);
  const updatedAt = Math.max(0, Number(value?.updatedAt || 0));
  const ready = normalizeSlacktivationReady(value?.ready);
  if (
    !mode &&
    !userId &&
    !teamId &&
    !userName &&
    !email &&
    !avatarUrl &&
    !statusIcon &&
    !statusIconUrl &&
    !statusMessage &&
    !directChannelId &&
    !directChannelErrorCode &&
    !avatarErrorCode &&
    !avatarError &&
    !updatedAt &&
    ready !== true
  ) {
    return null;
  }
  return {
    mode,
    userId,
    teamId,
    userName,
    email,
    avatarUrl,
    statusIcon,
    statusIconUrl,
    statusMessage,
    directChannelId,
    directChannelErrorCode,
    avatarErrorCode,
    avatarError,
    updatedAt,
    ready,
  };
}

function normalizeVaultSlacktivationPassTransitionMember(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const userId = normalizeSlacktivationUserId(value?.userId || value?.user_id || value?.id || "");
  const userName = normalizeSlacktivationText(value?.userName || value?.user_name || value?.name || "", 120);
  const realName = normalizeSlacktivationText(value?.realName || value?.real_name || "", 120);
  const handle = normalizeSlacktivationHandle(value?.handle || value?.username || "");
  const email = normalizeSlacktivationText(value?.email || "", 160);
  const avatarUrl = normalizeSlacktivationAvatarUrl(value?.avatarUrl || value?.avatar_url || "");
  const deleted = value?.deleted === true;
  const bot = value?.bot === true || value?.isBot === true || value?.is_bot === true || value?.is_app_user === true;
  const updatedAt = Math.max(0, Number(value?.updatedAt || 0));
  if (!userId && !userName && !realName && !handle && !email && !avatarUrl && !deleted && !bot && !updatedAt) {
    return null;
  }
  return {
    userId,
    userName,
    realName,
    handle,
    email,
    avatarUrl,
    deleted,
    bot,
    updatedAt,
  };
}

function normalizeVaultSlacktivationPassTransition(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const channelId =
    normalizeSlacktivationChannelId(value?.channelId || value?.channel_id || "") || UNDERPAR_PASS_TRANSITION_CHANNEL_ID;
  const channelName =
    normalizeSlacktivationText(value?.channelName || value?.channel_name || "", 80) || UNDERPAR_PASS_TRANSITION_CHANNEL_NAME;
  const syncedAt = Math.max(0, Number(value?.syncedAt || value?.updatedAt || 0));
  const tokenType = normalizeSlacktivationText(value?.tokenType || value?.token_type || "", 48).toLowerCase();
  const members = [];
  const seenUserIds = new Set();
  (Array.isArray(value?.members) ? value.members : []).forEach((entry) => {
    const member = normalizeVaultSlacktivationPassTransitionMember(entry);
    if (!member || !member.userId || seenUserIds.has(member.userId)) {
      return;
    }
    seenUserIds.add(member.userId);
    members.push(member);
  });
  members.sort((left, right) =>
    firstNonEmptyString([left.userName, left.realName, left.email, left.userId]).localeCompare(
      firstNonEmptyString([right.userName, right.realName, right.email, right.userId]),
      undefined,
      { sensitivity: "base" }
    )
  );
  const lastError = normalizeVaultSlacktivationError(value?.lastError || null);
  if (!members.length && !syncedAt && !tokenType && !lastError && !channelId && !channelName) {
    return null;
  }
  return {
    channelId,
    channelName,
    syncedAt,
    tokenType,
    members,
    lastError,
  };
}

function normalizeVaultSlacktivationError(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const code = normalizeSlacktivationText(value?.code || "", 64);
  const message = normalizeSlacktivationText(value?.message || value?.error || "", 240);
  const updatedAt = Math.max(0, Number(value?.updatedAt || 0));
  if (!code && !message && !updatedAt) {
    return null;
  }
  return {
    code,
    message,
    updatedAt,
  };
}

function normalizeVaultSlacktivationRecord(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const oidcInput = value?.oidc && typeof value.oidc === "object" ? value.oidc : {};
  const apiInput = value?.api && typeof value.api === "object" ? value.api : {};
  const apiTokens = normalizeVaultSlacktivationApiTokens(apiInput);
  const singularityInput = value?.singularity && typeof value.singularity === "object" ? value.singularity : {};
  const identity = normalizeVaultSlacktivationIdentity(value?.identity || null);
  const keyMeta = normalizeVaultSlacktivationKeyMeta(value?.keyMeta || value?.meta || null);
  const openIdSession = normalizeVaultSlacktivationOpenIdSession(value?.openIdSession || value?.openid || null);
  const passTransition =
    normalizeVaultSlacktivationPassTransition(
      value?.passTransition || value?.pass_transition || value?.teamRoster || null
    ) || {
      channelId: UNDERPAR_PASS_TRANSITION_CHANNEL_ID,
      channelName: UNDERPAR_PASS_TRANSITION_CHANNEL_NAME,
      syncedAt: 0,
      tokenType: "",
      members: [],
      lastError: null,
    };
  const lastError = normalizeVaultSlacktivationError(value?.lastError || null);
  const record = {
    schemaVersion: Math.max(1, Number(value?.schemaVersion || 1)),
    workspaceOrigin: normalizeSlacktivationWorkspaceOrigin(value?.workspaceOrigin || value?.workspace_origin || ""),
    ready: identity?.ready === true || normalizeSlacktivationReady(value?.ready),
    activatedAt: Math.max(0, Number(value?.activatedAt || value?.activated_at || 0)),
    updatedAt: Math.max(0, Number(value?.updatedAt || 0)),
    oidc: {
      clientId: normalizeSlacktivationText(oidcInput?.clientId || oidcInput?.client_id || "", 160),
      clientSecret: normalizeSlacktivationText(oidcInput?.clientSecret || oidcInput?.client_secret || "", 200),
      scope: normalizeSlacktivationOpenIdScope(oidcInput?.scope || ""),
      redirectPath: normalizeSlacktivationRedirectPath(oidcInput?.redirectPath || oidcInput?.redirect_path || ""),
      redirectUri: normalizeSlacktivationRedirectUri(oidcInput?.redirectUri || oidcInput?.redirect_uri || ""),
    },
    api: {
      botToken: apiTokens.botToken,
      userToken: apiTokens.userToken,
      oauthToken: apiTokens.oauthToken || apiTokens.userToken,
    },
    singularity: {
      channelId: normalizeSlacktivationChannelId(
        singularityInput?.channelId || singularityInput?.channel_id || value?.channelId || ""
      ),
      mention: normalizeSlacktivationMention(
        singularityInput?.mention || singularityInput?.singularityMention || value?.mention || ""
      ),
    },
    identity,
    passTransition,
    openIdSession,
    keyMeta,
    lastError,
  };
  if (!record.activatedAt && record.ready) {
    record.activatedAt = Math.max(0, Number(identity?.updatedAt || record.updatedAt || Date.now()));
  }
  if (!record.updatedAt) {
    record.updatedAt = Math.max(
      Number(identity?.updatedAt || 0),
      Number(lastError?.updatedAt || 0),
      record.ready ? Date.now() : 0
    );
  }
  const hasConfig =
    Boolean(record.oidc.clientId) ||
    Boolean(record.oidc.clientSecret) ||
    Boolean(record.api.userToken) ||
    Boolean(record.api.botToken) ||
    Boolean(record.singularity.channelId) ||
    Boolean(record.singularity.mention);
  const hasRuntime = Boolean(record.identity) || Boolean(record.keyMeta) || Boolean(record.openIdSession) || Boolean(record.lastError);
  if (!hasConfig && !hasRuntime) {
    return null;
  }
  return record;
}

function normalizeVaultHydrationStatus(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "complete" || normalized === "partial" || normalized === "pending") {
    return normalized;
  }
  return normalized ? "partial" : "pending";
}

function buildEmptyVaultCredential() {
  return {
    clientId: "",
    clientSecret: "",
    accessToken: "",
    tokenExpiresAt: 0,
    tokenScope: "",
    serviceScope: "",
    tokenRequestedScope: "",
  };
}

function normalizeVaultCredential(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const normalized = {
    ...buildEmptyVaultCredential(),
    clientId: firstNonEmptyString([value?.clientId, value?.client_id]),
    clientSecret: firstNonEmptyString([value?.clientSecret, value?.client_secret]),
    accessToken: firstNonEmptyString([value?.accessToken, value?.access_token]),
    tokenExpiresAt: Number(value?.tokenExpiresAt || value?.expires_at || 0),
    tokenScope: String(value?.tokenScope || value?.scope || "").trim(),
    serviceScope: String(value?.serviceScope || "").trim(),
    tokenRequestedScope: String(value?.tokenRequestedScope || "").trim(),
  };
  if (
    !normalized.clientId &&
    !normalized.clientSecret &&
    !normalized.accessToken &&
    !normalized.tokenExpiresAt &&
    !normalized.tokenScope &&
    !normalized.serviceScope &&
    !normalized.tokenRequestedScope
  ) {
    return null;
  }
  return normalized;
}

function normalizeVaultSavedQueryName(value = "") {
  return String(value || "").replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeVaultSavedQueryUrl(rawUrl = "") {
  const normalized = String(rawUrl || "").trim();
  if (!normalized) {
    return "";
  }
  const withoutHash = normalized.split("#")[0] || "";
  const queryIndex = withoutHash.indexOf("?");
  if (queryIndex < 0) {
    return withoutHash;
  }
  const path = withoutHash.slice(0, queryIndex);
  const query = withoutHash.slice(queryIndex + 1);
  const nextQuery = query
    .split("&")
    .filter((segment) => {
      if (!segment) {
        return false;
      }
      const keySegment = segment.includes("=") ? segment.slice(0, segment.indexOf("=")) : segment;
      try {
        return decodeURIComponent(keySegment.replace(/\+/g, "%20")).trim().toLowerCase() !== "media-company";
      } catch (_error) {
        return keySegment.trim().toLowerCase() !== "media-company";
      }
    })
    .join("&");
  return nextQuery ? `${path}?${nextQuery}` : path;
}

function normalizeVaultSavedQueries(input = null) {
  const normalizedEntries = {};
  const appendEntry = (name = "", rawUrl = "") => {
    const normalizedName = normalizeVaultSavedQueryName(name);
    const normalizedUrl = normalizeVaultSavedQueryUrl(rawUrl);
    if (normalizedName && normalizedUrl) {
      normalizedEntries[normalizedName] = normalizedUrl;
    }
  };

  if (Array.isArray(input)) {
    input.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      appendEntry(entry?.name || "", entry?.url || entry?.esmUrl || "");
    });
    return normalizedEntries;
  }

  if (!input || typeof input !== "object") {
    return normalizedEntries;
  }

  Object.entries(input).forEach(([name, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      appendEntry(value?.name || name, value?.url || value?.esmUrl || value?.value || "");
      return;
    }
    appendEntry(name, value);
  });
  return normalizedEntries;
}

function getVaultSavedQueriesInput(vaultPayload = null) {
  if (!vaultPayload || typeof vaultPayload !== "object") {
    return null;
  }
  if (
    vaultPayload?.underpar?.globals?.savedQueries &&
    typeof vaultPayload.underpar.globals.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.globals.savedQueries)
  ) {
    return vaultPayload.underpar.globals.savedQueries;
  }
  if (
    vaultPayload?.underpar?.app?.savedQueries &&
    typeof vaultPayload.underpar.app.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.app.savedQueries)
  ) {
    return vaultPayload.underpar.app.savedQueries;
  }
  if (
    vaultPayload?.underpar?.savedQueries &&
    typeof vaultPayload.underpar.savedQueries === "object" &&
    !Array.isArray(vaultPayload.underpar.savedQueries)
  ) {
    return vaultPayload.underpar.savedQueries;
  }
  return null;
}

function ensureVaultGlobalContainers(vaultPayload = null) {
  const target = vaultPayload && typeof vaultPayload === "object" ? vaultPayload : {};
  if (!target.underpar || typeof target.underpar !== "object" || Array.isArray(target.underpar)) {
    target.underpar = {};
  }
  if (!target.underpar.globals || typeof target.underpar.globals !== "object" || Array.isArray(target.underpar.globals)) {
    target.underpar.globals = {};
  }
  if (!target.underpar.app || typeof target.underpar.app !== "object" || Array.isArray(target.underpar.app)) {
    target.underpar.app = {};
  }
  if (
    !target.underpar.globals.savedQueries ||
    typeof target.underpar.globals.savedQueries !== "object" ||
    Array.isArray(target.underpar.globals.savedQueries)
  ) {
    target.underpar.globals.savedQueries = {};
  }
  if (
    !target.underpar.globals.cmImsByEnvironment ||
    typeof target.underpar.globals.cmImsByEnvironment !== "object" ||
    Array.isArray(target.underpar.globals.cmImsByEnvironment)
  ) {
    target.underpar.globals.cmImsByEnvironment = {};
  }
  if (!Object.prototype.hasOwnProperty.call(target.underpar.globals, "adobeIms")) {
    target.underpar.globals.adobeIms = null;
  }
  if (!Object.prototype.hasOwnProperty.call(target.underpar.globals, "slack")) {
    target.underpar.globals.slack = null;
  }
  if (
    !target.underpar.app.savedQueries ||
    typeof target.underpar.app.savedQueries !== "object" ||
    Array.isArray(target.underpar.app.savedQueries)
  ) {
    target.underpar.app.savedQueries = {};
  }
  if (!target.pass || typeof target.pass !== "object" || Array.isArray(target.pass)) {
    target.pass = {
      schemaVersion: 1,
      environments: {},
    };
  }
  if (!target.pass.environments || typeof target.pass.environments !== "object" || Array.isArray(target.pass.environments)) {
    target.pass.environments = {};
  }
  return target;
}

function normalizeVaultImsRuntimeConfigRecord(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const clientId = String(value?.clientId || value?.client_id || "").trim();
  const rawScope = String(value?.rawScope || value?.raw_scope || value?.scope || "").trim();
  const scope = String(value?.scope || rawScope).trim();
  const droppedScopes = uniqueSorted(
    Array.isArray(value?.droppedScopes)
      ? value.droppedScopes
      : String(value?.droppedScopes || value?.dropped_scopes || "")
          .split(/[\s,]+/)
          .map((entry) => String(entry || "").trim())
          .filter(Boolean)
  );
  const source = String(value?.source || "").trim();
  const importedAt = String(value?.importedAt || value?.imported_at || "").trim();
  const updatedAt = Math.max(0, Number(value?.updatedAt || value?.updated_at || 0));

  if (!clientId && !scope && !rawScope && droppedScopes.length === 0 && !source && !importedAt && !updatedAt) {
    return null;
  }

  return {
    schemaVersion: 1,
    clientId,
    scope,
    rawScope: rawScope || scope,
    droppedScopes,
    source,
    importedAt,
    updatedAt: updatedAt || Date.now(),
  };
}

function getVaultImsRuntimeConfigInput(vaultPayload = null) {
  if (!vaultPayload || typeof vaultPayload !== "object") {
    return null;
  }
  if (vaultPayload?.underpar?.globals && Object.prototype.hasOwnProperty.call(vaultPayload.underpar.globals, "adobeIms")) {
    return vaultPayload.underpar.globals.adobeIms;
  }
  if (vaultPayload?.underpar?.globals && Object.prototype.hasOwnProperty.call(vaultPayload.underpar.globals, "ims")) {
    return vaultPayload.underpar.globals.ims;
  }
  if (vaultPayload?.underpar && Object.prototype.hasOwnProperty.call(vaultPayload.underpar, "adobeIms")) {
    return vaultPayload.underpar.adobeIms;
  }
  return null;
}

function getVaultImsRuntimeConfig(vaultPayload = null) {
  return normalizeVaultImsRuntimeConfigRecord(getVaultImsRuntimeConfigInput(vaultPayload));
}

function setVaultImsRuntimeConfig(vaultPayload = null, record = null) {
  const target = ensureVaultGlobalContainers(vaultPayload);
  const normalizedRecord = normalizeVaultImsRuntimeConfigRecord(record);
  target.underpar.globals.adobeIms = normalizedRecord ? cloneJsonLikeValue(normalizedRecord, null) : null;
  if (Object.prototype.hasOwnProperty.call(target.underpar.globals, "ims")) {
    delete target.underpar.globals.ims;
  }
  return normalizedRecord;
}

function normalizeVaultCmGlobalRecord(value = null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const clientId = String(value?.clientId || "").trim();
  const tokenClientId = String(value?.tokenClientId || clientId).trim();
  const userId = String(value?.userId || value?.imsUserId || "").trim();
  const scope = String(value?.scope || "").trim();
  const expiresAt = Math.max(0, Number(value?.expiresAt || 0));
  const updatedAt = Math.max(0, Number(value?.updatedAt || value?.refreshedAt || 0));
  const tokenFingerprint = String(value?.tokenFingerprint || "").trim();
  const imsSession =
    value?.imsSession && typeof value.imsSession === "object" && !Array.isArray(value.imsSession)
      ? cloneJsonLikeValue(value.imsSession, null)
      : null;

  if (!clientId && !tokenClientId && !userId && !scope && !expiresAt && !updatedAt && !tokenFingerprint && !imsSession) {
    return null;
  }

  return {
    clientId,
    tokenClientId,
    userId,
    scope,
    expiresAt,
    updatedAt: updatedAt || Date.now(),
    tokenFingerprint,
    imsSession,
  };
}

function getVaultCmGlobalInput(vaultPayload = null) {
  if (!vaultPayload || typeof vaultPayload !== "object") {
    return null;
  }
  if (
    vaultPayload?.underpar?.globals?.cmImsByEnvironment &&
    typeof vaultPayload.underpar.globals.cmImsByEnvironment === "object" &&
    !Array.isArray(vaultPayload.underpar.globals.cmImsByEnvironment)
  ) {
    return vaultPayload.underpar.globals.cmImsByEnvironment;
  }
  if (
    vaultPayload?.underpar?.globals?.cmGlobalByEnvironment &&
    typeof vaultPayload.underpar.globals.cmGlobalByEnvironment === "object" &&
    !Array.isArray(vaultPayload.underpar.globals.cmGlobalByEnvironment)
  ) {
    return vaultPayload.underpar.globals.cmGlobalByEnvironment;
  }
  return null;
}

function getVaultCmGlobalsByEnvironment(vaultPayload = null) {
  const explicit = {};
  const explicitInput = getVaultCmGlobalInput(vaultPayload);
  if (explicitInput && typeof explicitInput === "object" && !Array.isArray(explicitInput)) {
    Object.entries(explicitInput).forEach(([environmentKey, rawRecord]) => {
      const normalizedEnvironmentKey = String(environmentKey || rawRecord?.environmentKey || rawRecord?.key || "").trim();
      const record = normalizeVaultCmGlobalRecord(rawRecord);
      if (normalizedEnvironmentKey && record) {
        explicit[normalizedEnvironmentKey] = record;
      }
    });
  }

  const fallback = {};
  const environmentsInput =
    vaultPayload?.pass?.environments && typeof vaultPayload.pass.environments === "object" ? vaultPayload.pass.environments : {};
  Object.entries(environmentsInput).forEach(([environmentKey, environmentRecord]) => {
    const normalizedEnvironmentKey = String(environmentKey || environmentRecord?.key || "").trim();
    const record = normalizeVaultCmGlobalRecord(environmentRecord?.cmGlobal || environmentRecord?.cmConsole || null);
    if (normalizedEnvironmentKey && record) {
      fallback[normalizedEnvironmentKey] = record;
    }
  });

  return {
    ...fallback,
    ...explicit,
  };
}

function setVaultSavedQueries(vaultPayload = null, savedQueries = null) {
  const target = ensureVaultGlobalContainers(vaultPayload);
  const normalizedSavedQueries = normalizeVaultSavedQueries(savedQueries);
  target.underpar.globals.savedQueries = cloneJsonLikeValue(normalizedSavedQueries, {});
  target.underpar.app.savedQueries = cloneJsonLikeValue(normalizedSavedQueries, {});
  return normalizedSavedQueries;
}

function setVaultCmGlobalRecord(vaultPayload = null, environmentKey = "", record = null) {
  const target = ensureVaultGlobalContainers(vaultPayload);
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  if (!normalizedEnvironmentKey) {
    return null;
  }
  const normalizedRecord = normalizeVaultCmGlobalRecord(record);
  if (normalizedRecord) {
    target.underpar.globals.cmImsByEnvironment[normalizedEnvironmentKey] = cloneJsonLikeValue(normalizedRecord, null);
  } else {
    delete target.underpar.globals.cmImsByEnvironment[normalizedEnvironmentKey];
  }
  if (!target.pass.environments[normalizedEnvironmentKey]) {
    target.pass.environments[normalizedEnvironmentKey] = {
      key: normalizedEnvironmentKey,
      label: firstNonEmptyString([resolveEnvironmentRecord(normalizedEnvironmentKey)?.label, normalizedEnvironmentKey]),
      updatedAt: Date.now(),
      cmGlobal: null,
      mediaCompanies: {},
    };
  }
  target.pass.environments[normalizedEnvironmentKey].label = firstNonEmptyString([
    target.pass.environments[normalizedEnvironmentKey]?.label,
    resolveEnvironmentRecord(normalizedEnvironmentKey)?.label,
    normalizedEnvironmentKey,
  ]);
  target.pass.environments[normalizedEnvironmentKey].updatedAt = Date.now();
  target.pass.environments[normalizedEnvironmentKey].cmGlobal = cloneJsonLikeValue(normalizedRecord, null);
  return normalizedRecord;
}

function getVaultSlacktivationInput(vaultPayload = null) {
  if (!vaultPayload || typeof vaultPayload !== "object") {
    return null;
  }
  if (vaultPayload?.underpar?.globals && Object.prototype.hasOwnProperty.call(vaultPayload.underpar.globals, "slack")) {
    return vaultPayload.underpar.globals.slack;
  }
  if (vaultPayload?.underpar?.globals && Object.prototype.hasOwnProperty.call(vaultPayload.underpar.globals, "slacktivation")) {
    return vaultPayload.underpar.globals.slacktivation;
  }
  if (vaultPayload?.underpar && Object.prototype.hasOwnProperty.call(vaultPayload.underpar, "slacktivation")) {
    return vaultPayload.underpar.slacktivation;
  }
  return null;
}

function getVaultSlacktivationRecord(vaultPayload = null) {
  return normalizeVaultSlacktivationRecord(getVaultSlacktivationInput(vaultPayload));
}

function setVaultSlacktivationRecord(vaultPayload = null, record = null) {
  const target = ensureVaultGlobalContainers(vaultPayload);
  const normalizedRecord = normalizeVaultSlacktivationRecord(record);
  target.underpar.globals.slack = normalizedRecord ? cloneJsonLikeValue(normalizedRecord, null) : null;
  if (Object.prototype.hasOwnProperty.call(target.underpar.globals, "slacktivation")) {
    delete target.underpar.globals.slacktivation;
  }
  return normalizedRecord;
}

function normalizeVaultPayload(payload = null) {
  const normalized = {
    schemaVersion: 1,
    updatedAt: Date.now(),
    underpar: {
      globals: {
        savedQueries: {},
        cmImsByEnvironment: {},
        adobeIms: null,
        slack: null,
      },
      app: {
        savedQueries: {},
      },
    },
    pass: {
      schemaVersion: 1,
      environments: {},
    },
  };

  if (!payload || typeof payload !== "object") {
    return normalized;
  }

  normalized.schemaVersion = Number(payload?.schemaVersion || 1) || 1;
  normalized.updatedAt = Number(payload?.updatedAt || Date.now()) || Date.now();
  setVaultSavedQueries(normalized, getVaultSavedQueriesInput(payload));
  const cmGlobalsByEnvironment = getVaultCmGlobalsByEnvironment(payload);
  normalized.underpar.globals.cmImsByEnvironment = cloneJsonLikeValue(cmGlobalsByEnvironment, {});
  setVaultImsRuntimeConfig(normalized, getVaultImsRuntimeConfigInput(payload));
  setVaultSlacktivationRecord(normalized, getVaultSlacktivationInput(payload));

  const environmentsInput =
    payload?.pass?.environments && typeof payload.pass.environments === "object" ? payload.pass.environments : {};
  Object.entries(environmentsInput).forEach(([environmentKey, environmentRecord]) => {
    const normalizedEnvironmentKey = String(environmentKey || environmentRecord?.key || "").trim();
    if (!normalizedEnvironmentKey) {
      return;
    }
    const mediaCompaniesInput =
      environmentRecord?.mediaCompanies &&
      typeof environmentRecord.mediaCompanies === "object" &&
      !Array.isArray(environmentRecord.mediaCompanies)
        ? environmentRecord.mediaCompanies
        : {};
    const mediaCompanies = {};
    Object.entries(mediaCompaniesInput).forEach(([programmerId, rawRecord]) => {
      const normalizedProgrammerId = String(programmerId || rawRecord?.programmerId || "").trim();
      if (!normalizedProgrammerId) {
        return;
      }
      mediaCompanies[normalizedProgrammerId] = cloneJsonLikeValue(
        {
          ...rawRecord,
          programmerId: normalizedProgrammerId,
          hydrationStatus: normalizeVaultHydrationStatus(rawRecord?.hydrationStatus),
          registeredApplicationCount: Math.max(
            0,
            Number(rawRecord?.registeredApplicationCount || rawRecord?.scannedRegisteredApplicationCount || 0),
            Object.keys(getVaultRegisteredApplications(rawRecord)).length
          ),
        },
        {}
      );
    });
    normalized.pass.environments[normalizedEnvironmentKey] = {
      key: normalizedEnvironmentKey,
      label: firstNonEmptyString([environmentRecord?.label, resolveEnvironmentRecord(normalizedEnvironmentKey)?.label, normalizedEnvironmentKey]),
      updatedAt: Number(environmentRecord?.updatedAt || normalized.updatedAt || Date.now()),
      cmGlobal: normalizeVaultCmGlobalRecord(
        cmGlobalsByEnvironment[normalizedEnvironmentKey] || environmentRecord?.cmGlobal || environmentRecord?.cmConsole || null
      ),
      mediaCompanies,
    };
  });

  Object.entries(cmGlobalsByEnvironment).forEach(([environmentKey, record]) => {
    const normalizedEnvironmentKey = String(environmentKey || "").trim();
    if (!normalizedEnvironmentKey) {
      return;
    }
    if (!normalized.pass.environments[normalizedEnvironmentKey]) {
      normalized.pass.environments[normalizedEnvironmentKey] = {
        key: normalizedEnvironmentKey,
        label: firstNonEmptyString([resolveEnvironmentRecord(normalizedEnvironmentKey)?.label, normalizedEnvironmentKey]),
        updatedAt: normalized.updatedAt,
        cmGlobal: normalizeVaultCmGlobalRecord(record),
        mediaCompanies: {},
      };
      return;
    }
    if (!normalized.pass.environments[normalizedEnvironmentKey].cmGlobal) {
      normalized.pass.environments[normalizedEnvironmentKey].cmGlobal = normalizeVaultCmGlobalRecord(record);
    }
  });

  return normalized;
}

function getVaultPassEnvironments(vaultPayload = null) {
  const normalizedVault = normalizeVaultPayload(vaultPayload);
  return normalizedVault?.pass?.environments && typeof normalizedVault.pass.environments === "object"
    ? normalizedVault.pass.environments
    : {};
}

function getVaultServiceSummary(record = null, serviceKey = "") {
  const summary = record?.services?.[serviceKey];
  return summary && typeof summary === "object" ? summary : {};
}

function getVaultRegisteredApplications(record = null) {
  return record?.registeredApplicationsByGuid &&
    typeof record.registeredApplicationsByGuid === "object" &&
    !Array.isArray(record.registeredApplicationsByGuid)
    ? record.registeredApplicationsByGuid
    : {};
}

function getVaultRegisteredApplicationCount(record = null) {
  const explicitCount = Math.max(
    0,
    Number(record?.registeredApplicationCount || record?.scannedRegisteredApplicationCount || 0)
  );
  return Math.max(explicitCount, Object.keys(getVaultRegisteredApplications(record)).length);
}

function collectVaultServiceTags(record = null) {
  const serviceKeys = ["restV2", "esm", "degradation", "cm"];
  return serviceKeys
    .filter((serviceKey) => getVaultServiceSummary(record, serviceKey)?.available === true)
    .map((serviceKey) => {
      if (serviceKey === "restV2") {
        return "REST V2";
      }
      if (serviceKey === "esm") {
        return "ESM";
      }
      if (serviceKey === "degradation") {
        return "DEGRADATION";
      }
      return "CM";
    });
}

function buildPassVaultSummary(vaultPayload = null) {
  const environments = getVaultPassEnvironments(vaultPayload);
  const environmentSummaries = [];
  let mediaCompanyCount = 0;
  let completeCount = 0;
  let pendingCount = 0;
  let partialCount = 0;
  let registeredApplicationCount = 0;

  Object.entries(environments).forEach(([environmentKey, environmentRecord]) => {
    const mediaCompaniesInput =
      environmentRecord?.mediaCompanies &&
      typeof environmentRecord.mediaCompanies === "object" &&
      !Array.isArray(environmentRecord.mediaCompanies)
        ? environmentRecord.mediaCompanies
        : {};
    const mediaCompanies = Object.values(mediaCompaniesInput)
      .filter((record) => record && typeof record === "object")
      .map((record) => {
        const status = normalizeVaultHydrationStatus(record?.hydrationStatus);
        if (status === "complete") {
          completeCount += 1;
        } else if (status === "partial") {
          partialCount += 1;
        } else {
          pendingCount += 1;
        }

        const registeredApplicationCountForRecord = getVaultRegisteredApplicationCount(record);
        registeredApplicationCount += registeredApplicationCountForRecord;
        mediaCompanyCount += 1;

        return {
          programmerId: String(record?.programmerId || "").trim(),
          programmerName: firstNonEmptyString([record?.programmerName, record?.mediaCompanyName, record?.programmerId]),
          mediaCompanyName: firstNonEmptyString([record?.mediaCompanyName, record?.programmerName, record?.programmerId]),
          hydrationStatus: status,
          updatedAt: Number(record?.updatedAt || 0),
          hydratedAt: Number(record?.hydratedAt || 0),
          serviceTags: collectVaultServiceTags(record),
          registeredApplicationCount: registeredApplicationCountForRecord,
          matchedTenantCount: Number(getVaultServiceSummary(record, "cm")?.matchedTenantCount || 0),
        };
      })
      .sort((left, right) =>
        String(left.mediaCompanyName || "").localeCompare(String(right.mediaCompanyName || ""), undefined, {
          sensitivity: "base",
        })
      );

    environmentSummaries.push({
      environmentKey,
      label: firstNonEmptyString([environmentRecord?.label, resolveEnvironmentRecord(environmentKey)?.label, environmentKey]),
      updatedAt: Number(environmentRecord?.updatedAt || 0),
      mediaCompanies,
    });
  });

  environmentSummaries.sort((left, right) =>
    String(left.label || left.environmentKey || "").localeCompare(String(right.label || right.environmentKey || ""), undefined, {
      sensitivity: "base",
    })
  );

  return {
    environmentCount: environmentSummaries.length,
    mediaCompanyCount,
    completeCount,
    pendingCount,
    partialCount,
    registeredApplicationCount,
    environmentSummaries,
  };
}

function buildVaultProgrammerConsoleApplicationsUrl(environmentKey = "", programmerId = "") {
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!normalizedProgrammerId) {
    return "";
  }
  const environment = cloneEnvironment(resolveEnvironmentRecord(environmentKey || environmentSelect?.value || FALLBACK_DEFAULT_KEY));
  const programmersUrl = String(environment?.consoleProgrammersUrl || "").replace(/\/+$/, "");
  if (!programmersUrl) {
    return "";
  }
  return `${programmersUrl}/${encodeURIComponent(normalizedProgrammerId)}/applications`;
}

function buildEmptyVaultPassServicesSummary() {
  return {
    restV2: createImportedPassServiceSummary("restV2"),
    esm: createImportedPassServiceSummary("esm"),
    degradation: createImportedPassServiceSummary("degradation"),
    cm: createImportedPassServiceSummary("cm", {
      available: false,
      checked: false,
      matchedTenants: [],
      fetchedAt: 0,
    }),
  };
}

function buildOptimisticVaultSnapshotForAction(snapshot = null, action = "", environmentKey = "", programmerId = "") {
  const normalizedSnapshot = snapshot && typeof snapshot === "object" ? cloneJsonLikeValue(snapshot, {}) : null;
  const normalizedAction = String(action || "").trim();
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!normalizedSnapshot || !normalizedAction || !normalizedEnvironmentKey) {
    return normalizedSnapshot;
  }

  const nextVaultPayload = normalizeVaultPayload(normalizedSnapshot.vaultPayload || null);
  const environmentRecord = nextVaultPayload?.pass?.environments?.[normalizedEnvironmentKey];
  if (!environmentRecord || typeof environmentRecord !== "object") {
    return normalizedSnapshot;
  }

  const mediaCompanies =
    environmentRecord?.mediaCompanies &&
    typeof environmentRecord.mediaCompanies === "object" &&
    !Array.isArray(environmentRecord.mediaCompanies)
      ? environmentRecord.mediaCompanies
      : {};
  const now = Date.now();
  const invalidateRecord = (record = null) => {
    if (!record || typeof record !== "object") {
      return;
    }
    record.hydrationStatus = "pending";
    record.updatedAt = now;
    record.hydratedAt = 0;
    record.registeredApplicationCount = 0;
    record.registeredApplicationsByGuid = {};
    record.services = buildEmptyVaultPassServicesSummary();
  };

  if (normalizedAction === "rehydrate-environment") {
    Object.values(mediaCompanies).forEach((record) => invalidateRecord(record));
  } else if (normalizedAction === "rehydrate-media-company") {
    invalidateRecord(mediaCompanies?.[normalizedProgrammerId] || null);
  }

  environmentRecord.updatedAt = now;
  nextVaultPayload.updatedAt = now;
  normalizedSnapshot.vaultPayload = nextVaultPayload;
  normalizedSnapshot.passVaultSummary = buildPassVaultSummary(nextVaultPayload);
  return normalizedSnapshot;
}

function applyVaultActionResponseToSnapshot(snapshot = null, action = "", response = null, environmentKey = "", programmerId = "") {
  const normalizedAction = String(action || "").trim();
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!response || typeof response !== "object") {
    return null;
  }

  const nextSnapshot =
    snapshot && typeof snapshot === "object"
      ? cloneJsonLikeValue(snapshot, {})
      : {
          collectedAt: Date.now(),
          areaSnapshots: [],
          totalKeyCount: 0,
          totalByteCount: 0,
          namespaceSummary: [],
          vaultPayload: normalizeVaultPayload(null),
          savedQueryCount: 0,
          passVaultSummary: buildPassVaultSummary(null),
        };
  const hasDirectVaultPayload = response?.vaultPayload && typeof response.vaultPayload === "object";
  let nextVaultPayload = hasDirectVaultPayload
    ? normalizeVaultPayload(response.vaultPayload)
    : normalizeVaultPayload(nextSnapshot.vaultPayload || null);

  if (response.purged === true && !hasDirectVaultPayload) {
    nextVaultPayload = normalizeVaultPayload(response?.vaultPayload || null);
  } else if (!hasDirectVaultPayload && normalizedAction === "rehydrate-media-company" && normalizedEnvironmentKey && normalizedProgrammerId) {
    if (!response.record || typeof response.record !== "object") {
      return null;
    }
    if (!nextVaultPayload.pass.environments[normalizedEnvironmentKey]) {
      nextVaultPayload.pass.environments[normalizedEnvironmentKey] = {
        key: normalizedEnvironmentKey,
        label: firstNonEmptyString([resolveEnvironmentRecord(normalizedEnvironmentKey)?.label, normalizedEnvironmentKey]),
        updatedAt: Date.now(),
        mediaCompanies: {},
      };
    }
    nextVaultPayload.pass.environments[normalizedEnvironmentKey].mediaCompanies[normalizedProgrammerId] = cloneJsonLikeValue(
      response.record,
      {}
    );
    nextVaultPayload.pass.environments[normalizedEnvironmentKey].updatedAt = Date.now();
  } else if (!hasDirectVaultPayload && normalizedAction === "rehydrate-environment" && normalizedEnvironmentKey) {
    if (!response.environmentRecord || typeof response.environmentRecord !== "object") {
      return null;
    }
    nextVaultPayload.pass.environments[normalizedEnvironmentKey] = cloneJsonLikeValue(
      {
        ...response.environmentRecord,
        key: normalizedEnvironmentKey,
        label: firstNonEmptyString([
          response.environmentRecord?.label,
          resolveEnvironmentRecord(normalizedEnvironmentKey)?.label,
          normalizedEnvironmentKey,
        ]),
      },
      {}
    );
  } else if (!hasDirectVaultPayload) {
    return null;
  }

  nextVaultPayload.updatedAt = Date.now();
  nextSnapshot.collectedAt = Date.now();
  nextSnapshot.vaultPayload = nextVaultPayload;
  nextSnapshot.savedQueryCount = Object.keys(normalizeVaultSavedQueries(getVaultSavedQueriesInput(nextVaultPayload))).length;
  nextSnapshot.passVaultSummary = buildPassVaultSummary(nextVaultPayload);
  return nextSnapshot;
}

function getVaultProgrammerRecordFromSnapshot(snapshot = null, environmentKey = "", programmerId = "") {
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!snapshot || typeof snapshot !== "object" || !normalizedEnvironmentKey) {
    return null;
  }
  const vaultPayload = normalizeVaultPayload(snapshot.vaultPayload || null);
  const environmentRecord = vaultPayload?.pass?.environments?.[normalizedEnvironmentKey];
  const mediaCompanies =
    environmentRecord?.mediaCompanies &&
    typeof environmentRecord.mediaCompanies === "object" &&
    !Array.isArray(environmentRecord.mediaCompanies)
      ? environmentRecord.mediaCompanies
      : {};
  if (!normalizedProgrammerId) {
    return mediaCompanies;
  }
  return mediaCompanies?.[normalizedProgrammerId] || null;
}

function hasVaultProgrammerHydrationResults(record = null) {
  if (!record || typeof record !== "object") {
    return false;
  }

  const registeredApplications =
    record?.registeredApplicationsByGuid &&
    typeof record.registeredApplicationsByGuid === "object" &&
    !Array.isArray(record.registeredApplicationsByGuid)
      ? Object.keys(record.registeredApplicationsByGuid)
      : [];
  if (registeredApplications.length > 0) {
    return true;
  }

  const serviceSummaries = record?.services && typeof record.services === "object" ? record.services : {};
  return ["restV2", "esm", "degradation", "cm"].some((serviceKey) => {
    const summary = serviceSummaries?.[serviceKey];
    if (!summary || typeof summary !== "object") {
      return false;
    }
    return (
      summary.available === true ||
      Number(summary.matchedTenantCount || 0) > 0 ||
      (Array.isArray(summary.appGuids) && summary.appGuids.length > 0) ||
      Boolean(String(summary.primaryGuid || "").trim())
    );
  });
}

function isVaultActionSnapshotSettled(snapshot = null, action = "", environmentKey = "", programmerId = "") {
  const normalizedAction = String(action || "").trim();
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  if (!snapshot || typeof snapshot !== "object" || !normalizedAction || !normalizedEnvironmentKey) {
    return false;
  }

  if (normalizedAction === "rehydrate-media-company") {
    const record = getVaultProgrammerRecordFromSnapshot(snapshot, normalizedEnvironmentKey, programmerId);
    if (!record || typeof record !== "object") {
      return false;
    }
    const hydrationStatus = normalizeVaultHydrationStatus(record?.hydrationStatus);
    return hydrationStatus !== "pending" && hasVaultProgrammerHydrationResults(record);
  }

  if (normalizedAction === "rehydrate-environment") {
    const mediaCompanies = getVaultProgrammerRecordFromSnapshot(snapshot, normalizedEnvironmentKey, "");
    return Object.values(mediaCompanies || {}).every(
      (record) =>
        normalizeVaultHydrationStatus(record?.hydrationStatus) !== "pending" && hasVaultProgrammerHydrationResults(record)
    );
  }

  return false;
}

async function waitForVaultActionSnapshot(action = "", environmentKey = "", programmerId = "") {
  let lastSnapshot = panelState.vaultSnapshot || null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const snapshot = await ensureVaultSnapshot({
      force: true,
      allowWhileCollapsed: true,
    });
    if (snapshot) {
      lastSnapshot = snapshot;
    }
    if (isVaultActionSnapshotSettled(snapshot, action, environmentKey, programmerId)) {
      return snapshot;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }
  return lastSnapshot;
}

function extractNamespaceRoot(storageKey = "") {
  const normalizedKey = String(storageKey || "").trim();
  if (!normalizedKey) {
    return "unscoped";
  }
  const match = normalizedKey.match(/^([^:_-]+)/);
  return match ? String(match[1] || "").trim() || "unscoped" : normalizedKey;
}

function truncateVaultPreview(text, maxLength = 220) {
  const normalizedText = String(text || "").replace(/\s+/g, " ").trim();
  if (normalizedText.length <= maxLength) {
    return normalizedText;
  }
  return `${normalizedText.slice(0, Math.max(0, maxLength - 1))}…`;
}

function toVaultAnchorToken(value = "", fallback = "section") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function getVaultAreaAnchorId(areaId = "") {
  return `vault-area-${toVaultAnchorToken(areaId, "area")}`;
}

function getVaultEntryAnchorId(areaId = "", entryIndex = 0) {
  return `vault-entry-${toVaultAnchorToken(areaId, "area")}-${Math.max(0, Number(entryIndex || 0))}`;
}

function buildVaultAreaSnapshot(areaId, label, payload, errorMessage = "") {
  const normalizedPayload = payload && typeof payload === "object" ? payload : {};
  const entries = Object.keys(normalizedPayload)
    .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: "base" }))
    .map((key, entryIndex) => {
      const value = normalizedPayload[key];
      const serialized = safeJsonStringify(value, 2);
      return {
        key,
        value,
        bytes: estimateSerializedBytes(value),
        preview: truncateVaultPreview(serialized, 240),
        entryIndex,
        namespaceRoot: extractNamespaceRoot(key),
      };
    });

  return {
    areaId,
    label,
    errorMessage: String(errorMessage || "").trim(),
    keyCount: entries.length,
    byteCount: estimateSerializedBytes(normalizedPayload),
    payload: cloneJsonLikeValue(normalizedPayload, {}),
    entries,
    rawJson: safeJsonStringify(normalizedPayload, 2),
  };
}

function buildVaultNamespaceAnchorMap(areaSnapshots = []) {
  const anchorMap = new Map();
  for (const area of Array.isArray(areaSnapshots) ? areaSnapshots : []) {
    const areaId = String(area?.areaId || area?.label || "").trim();
    const areaLabel = String(area?.label || areaId || "Storage Area").trim();
    for (const entry of Array.isArray(area?.entries) ? area.entries : []) {
      const namespace = String(entry?.namespaceRoot || extractNamespaceRoot(entry?.key)).trim();
      if (!namespace || anchorMap.has(namespace)) {
        continue;
      }
      anchorMap.set(namespace, {
        targetId: getVaultEntryAnchorId(areaId, entry?.entryIndex),
        areaLabel,
      });
    }
  }
  return anchorMap;
}

async function readChromeStorageAreaSnapshot(areaName, storageArea) {
  if (!storageArea?.get) {
    return buildVaultAreaSnapshot(areaName, areaName, {}, "Storage area unavailable.");
  }
  try {
    const payload = await storageArea.get(null);
    return buildVaultAreaSnapshot(areaName, areaName, payload || {});
  } catch (error) {
    return buildVaultAreaSnapshot(
      areaName,
      areaName,
      {},
      error instanceof Error ? error.message : String(error)
    );
  }
}

function readWebStorageAreaSnapshot(areaId, label, storageArea) {
  if (!storageArea) {
    return buildVaultAreaSnapshot(areaId, label, {}, "Storage area unavailable.");
  }

  try {
    const payload = {};
    for (let index = 0; index < storageArea.length; index += 1) {
      const key = String(storageArea.key(index) || "").trim();
      if (!key) {
        continue;
      }
      payload[key] = storageArea.getItem(key);
    }
    return buildVaultAreaSnapshot(areaId, label, payload);
  } catch (error) {
    return buildVaultAreaSnapshot(
      areaId,
      label,
      {},
      error instanceof Error ? error.message : String(error)
    );
  }
}

function buildVaultNamespaceSummary(areaSnapshots = []) {
  const namespaceCounts = new Map();
  for (const area of Array.isArray(areaSnapshots) ? areaSnapshots : []) {
    for (const entry of Array.isArray(area?.entries) ? area.entries : []) {
      const namespaceRoot = extractNamespaceRoot(entry?.key);
      namespaceCounts.set(namespaceRoot, Number(namespaceCounts.get(namespaceRoot) || 0) + 1);
    }
  }
  return Array.from(namespaceCounts.entries())
    .map(([namespace, count]) => ({
      namespace,
      count,
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return String(left.namespace || "").localeCompare(String(right.namespace || ""), undefined, {
        sensitivity: "base",
      });
    });
}

async function collectVaultSnapshot() {
  const [chromeLocalSnapshot, chromeSessionSnapshot] = await Promise.all([
    readChromeStorageAreaSnapshot("chrome.storage.local", chrome?.storage?.local),
    readChromeStorageAreaSnapshot("chrome.storage.session", chrome?.storage?.session),
  ]);
  const localStorageSnapshot = readWebStorageAreaSnapshot("window.localStorage", "window.localStorage", globalThis.localStorage);
  const sessionStorageSnapshot = readWebStorageAreaSnapshot(
    "window.sessionStorage",
    "window.sessionStorage",
    globalThis.sessionStorage
  );
  const areaSnapshots = [chromeLocalSnapshot, chromeSessionSnapshot, localStorageSnapshot, sessionStorageSnapshot];
  const vaultPayload = normalizeVaultPayload(chromeLocalSnapshot?.payload?.[UNDERPAR_VAULT_STORAGE_KEY] || null);
  return {
    collectedAt: Date.now(),
    areaSnapshots,
    totalKeyCount: areaSnapshots.reduce((sum, area) => sum + Number(area?.keyCount || 0), 0),
    totalByteCount: areaSnapshots.reduce((sum, area) => sum + Number(area?.byteCount || 0), 0),
    namespaceSummary: buildVaultNamespaceSummary(areaSnapshots),
    vaultPayload,
    savedQueryCount: Object.keys(normalizeVaultSavedQueries(getVaultSavedQueriesInput(vaultPayload))).length,
    passVaultSummary: buildPassVaultSummary(vaultPayload),
  };
}

function setVaultStatus(message) {
  if (vaultStatus) {
    vaultStatus.textContent = String(message || "");
  }
}

function syncVaultIdleState(message = "") {
  const hasSnapshot = panelState.vaultSnapshot && typeof panelState.vaultSnapshot === "object";
  if (panelState.vaultActionBusy === true && !panelState.vaultLoadPromise) {
    if (vaultBadge) {
      vaultBadge.textContent = "Working";
    }
    if (message) {
      setVaultStatus(message);
    }
    if (vaultExportButton) {
      vaultExportButton.disabled = true;
    }
    if (vaultImportButton) {
      vaultImportButton.disabled = true;
    }
    if (vaultPurgeButton) {
      vaultPurgeButton.disabled = true;
    }
    return;
  }
  if (vaultBadge && !panelState.vaultLoadPromise) {
    if (panelState.vaultDirty === true) {
      vaultBadge.textContent = hasSnapshot ? "Stale" : "Pending";
    } else if (hasSnapshot) {
      vaultBadge.textContent = formatVaultKeyCount(panelState.vaultSnapshot?.totalKeyCount || 0);
    } else {
      vaultBadge.textContent = "Pending";
    }
  }
  if (message) {
    setVaultStatus(message);
  } else if (panelState.vaultDirty === true) {
    setVaultStatus(
      isVaultExpanded()
        ? "VAULT changed. Close and reopen VAULT to repopulate the latest UnderPAR storage snapshot."
        : "Open VAULT to populate and inspect current UnderPAR storage surfaces."
    );
  } else if (!hasSnapshot) {
    setVaultStatus("Open VAULT to populate and inspect current UnderPAR storage surfaces.");
  }
  if (vaultImportButton) {
    vaultImportButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
  if (vaultExportButton) {
    vaultExportButton.disabled =
      panelState.vaultActionBusy === true || !hasVaultExportableData(panelState.vaultSnapshot?.vaultPayload || null, panelState.vaultSnapshot);
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
}

function buildVaultActionContext(action = "", environmentKey = "", programmerId = "", message = "") {
  return {
    action: String(action || "").trim(),
    environmentKey: String(environmentKey || "").trim(),
    programmerId: String(programmerId || "").trim(),
    message: String(message || "").trim(),
    startedAt: Date.now(),
  };
}

function isVaultActionContextMatch(actionContext = null, action = "", environmentKey = "", programmerId = "") {
  if (!actionContext || typeof actionContext !== "object") {
    return false;
  }
  if (String(actionContext.action || "").trim() !== String(action || "").trim()) {
    return false;
  }
  if (String(actionContext.environmentKey || "").trim() !== String(environmentKey || "").trim()) {
    return false;
  }
  const requiredProgrammerId = String(programmerId || "").trim();
  if (!requiredProgrammerId) {
    return true;
  }
  return String(actionContext.programmerId || "").trim() === requiredProgrammerId;
}

function renderVaultBusyState(message = "Reading UnderPAR storage surfaces...") {
  if (vaultBadge) {
    vaultBadge.textContent = "Loading";
  }
  if (vaultExportButton) {
    vaultExportButton.disabled = true;
  }
  if (vaultImportButton) {
    vaultImportButton.disabled = panelState.vaultImportBusy || panelState.vaultActionBusy;
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.disabled = true;
  }
  setVaultStatus(message);
}

function buildVaultSummaryMarkup(snapshot, namespaceAnchorMap = new Map()) {
  const imsRuntimeConfig = getVaultImsRuntimeConfig(snapshot?.vaultPayload || null);
  const areaCards = (Array.isArray(snapshot?.areaSnapshots) ? snapshot.areaSnapshots : [])
    .map(
      (area) => `
        <a
          class="vault-metric-card vault-metric-card--nav"
          href="#${escapeHtml(getVaultAreaAnchorId(area?.areaId || area?.label || "area"))}"
          data-vault-nav-target="${escapeHtml(getVaultAreaAnchorId(area?.areaId || area?.label || "area"))}"
          title="${escapeHtml(`Jump to ${String(area?.label || area?.areaId || "storage area").trim()}`)}"
        >
          <p class="vault-metric-label">${escapeHtml(area.label)}</p>
          <p class="vault-metric-value">${escapeHtml(formatVaultKeyCount(area.keyCount))}</p>
          <p class="vault-metric-meta">${escapeHtml(formatBytes(area.byteCount))}</p>
        </a>
      `
    )
    .join("");
  const imsCard = imsRuntimeConfig?.clientId
    ? `
      <div class="vault-metric-card">
        <p class="vault-metric-label">Adobe IMS</p>
        <p class="vault-metric-value">${escapeHtml(String(imsRuntimeConfig.clientId || "").trim())}</p>
        <p class="vault-metric-meta">${escapeHtml(firstNonEmptyString([imsRuntimeConfig.source, imsRuntimeConfig.scope, "Configured"]))}</p>
      </div>
    `
    : "";
  const namespaceChips = (Array.isArray(snapshot?.namespaceSummary) ? snapshot.namespaceSummary : [])
    .map((entry) => {
      const namespaceTarget = namespaceAnchorMap.get(String(entry?.namespace || "").trim()) || null;
      if (!namespaceTarget?.targetId) {
        return `
        <span class="vault-namespace-chip">
          <span class="vault-namespace-name">${escapeHtml(entry.namespace)}</span>
          <span class="vault-namespace-count">${escapeHtml(String(entry.count))}</span>
        </span>
      `;
      }
      return `
        <a
          class="vault-namespace-chip vault-namespace-chip--nav"
          href="#${escapeHtml(namespaceTarget.targetId)}"
          data-vault-nav-target="${escapeHtml(namespaceTarget.targetId)}"
          title="${escapeHtml(
            `Jump to the first ${String(entry.namespace || "").trim()} entry in ${String(namespaceTarget.areaLabel || "").trim()}.`
          )}"
        >
          <span class="vault-namespace-name">${escapeHtml(entry.namespace)}</span>
          <span class="vault-namespace-count">${escapeHtml(String(entry.count))}</span>
        </a>
      `;
    })
    .join("");

  return `
    <div class="vault-summary-grid">
      <a
        class="vault-metric-card vault-metric-card--primary vault-metric-card--nav"
        href="#vault-sections"
        data-vault-nav-target="vault-sections"
        title="Jump to all storage area sections."
      >
        <p class="vault-metric-label">Total Footprint</p>
        <p class="vault-metric-value">${escapeHtml(formatVaultKeyCount(snapshot?.totalKeyCount || 0))}</p>
        <p class="vault-metric-meta">${escapeHtml(formatBytes(snapshot?.totalByteCount || 0))}</p>
      </a>
      ${imsCard}
      ${areaCards}
    </div>
    <div class="vault-namespace-strip">
      ${namespaceChips || '<span class="vault-empty-inline">No namespaces detected.</span>'}
    </div>
  `;
}

function getVaultHydrationLabel(status = "") {
  if (status === "complete") {
    return "Hydrated";
  }
  if (status === "partial") {
    return "Partial";
  }
  return "Pending";
}

function buildVaultPassSummaryMarkup(summary = null) {
  const normalizedSummary = summary && typeof summary === "object" ? summary : null;
  if (!normalizedSummary || Number(normalizedSummary.mediaCompanyCount || 0) === 0) {
    return `
      <article class="vault-pass-card vault-pass-card--empty">
        <div class="vault-pass-card-head">
          <h3 class="vault-pass-title">PASS Vault</h3>
          <span class="vault-pass-badge">Empty</span>
        </div>
        <p class="vault-pass-empty">No persisted PASS media-company records have been written yet.</p>
      </article>
    `;
  }

  return `
    <article class="vault-pass-card">
      <div class="vault-pass-card-head">
        <h3 class="vault-pass-title">PASS Vault</h3>
        <span class="vault-pass-badge">${escapeHtml(String(normalizedSummary.mediaCompanyCount || 0))} Media Companies</span>
      </div>
      <div class="vault-pass-metrics">
        <article class="vault-pass-metric">
          <p class="vault-pass-metric-label">Environments</p>
          <p class="vault-pass-metric-value">${escapeHtml(String(normalizedSummary.environmentCount || 0))}</p>
        </article>
        <article class="vault-pass-metric">
          <p class="vault-pass-metric-label">Hydrated</p>
          <p class="vault-pass-metric-value">${escapeHtml(String(normalizedSummary.completeCount || 0))}</p>
        </article>
        <article class="vault-pass-metric">
          <p class="vault-pass-metric-label">Pending</p>
          <p class="vault-pass-metric-value">${escapeHtml(String(normalizedSummary.pendingCount || 0))}</p>
        </article>
        <article class="vault-pass-metric">
          <p class="vault-pass-metric-label">Partial</p>
          <p class="vault-pass-metric-value">${escapeHtml(String(normalizedSummary.partialCount || 0))}</p>
        </article>
        <article class="vault-pass-metric">
          <p class="vault-pass-metric-label">Registered Apps</p>
          <p class="vault-pass-metric-value">${escapeHtml(String(normalizedSummary.registeredApplicationCount || 0))}</p>
        </article>
      </div>
    </article>
  `;
}

function buildVaultPassRecordsMarkup(summary = null) {
  const normalizedSummary = summary && typeof summary === "object" ? summary : null;
  const environments = Array.isArray(normalizedSummary?.environmentSummaries) ? normalizedSummary.environmentSummaries : [];
  if (environments.length === 0) {
    return "";
  }
  const actionButtonsDisabled = panelState.controllerReady !== true || panelState.vaultActionBusy === true || panelState.vaultImportBusy === true;

  return environments
    .map((environmentSummary) => {
      const environmentKey = String(environmentSummary?.environmentKey || "").trim();
      const isActiveEnvironment =
        normalizeEnvironmentKey(environmentKey) === normalizeEnvironmentKey(environmentSelect?.value || FALLBACK_DEFAULT_KEY);
      const environmentActionWorking = isVaultActionContextMatch(
        panelState.vaultActionContext,
        "rehydrate-environment",
        environmentKey
      );
      const mediaCompanies = Array.isArray(environmentSummary?.mediaCompanies) ? environmentSummary.mediaCompanies : [];
      const mediaCompanyMarkup =
        mediaCompanies.length > 0
          ? mediaCompanies
              .map(
                (record) => {
                  const programmerId = String(record?.programmerId || "").trim();
                  const mediaCompanyActionWorking = isVaultActionContextMatch(
                    panelState.vaultActionContext,
                    "rehydrate-media-company",
                    environmentKey,
                    programmerId
                  );
                  const recordWorking = environmentActionWorking || mediaCompanyActionWorking;
                  const hydrationStatus = normalizeVaultHydrationStatus(record?.hydrationStatus);
                  const renderedStatus = recordWorking ? "working" : hydrationStatus;
                  const renderedHydrationLabel = recordWorking ? "Working" : getVaultHydrationLabel(hydrationStatus);
                  const consoleApplicationsUrl = buildVaultProgrammerConsoleApplicationsUrl(
                    environmentKey,
                    programmerId
                  );
                  const registeredAppsMarkup = consoleApplicationsUrl
                    ? `<a
                        class="vault-pass-tag vault-pass-tag--meta vault-pass-tag--link"
                        href="${escapeHtml(consoleApplicationsUrl)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="${escapeHtml(
                          "Open this Media Company's Registered Applications in Adobe Pass Console."
                        )}"
                      >${escapeHtml(`${Number(record?.registeredApplicationCount || 0)} Apps`)}</a>`
                    : `<span class="vault-pass-tag vault-pass-tag--meta">${escapeHtml(
                        `${Number(record?.registeredApplicationCount || 0)} Apps`
                      )}</span>`;
                  return `
                  <article class="vault-pass-record${recordWorking ? " vault-pass-record--working" : ""}">
                    <div class="vault-pass-record-head">
                      <div>
                        <h4 class="vault-pass-record-title">${escapeHtml(
                          firstNonEmptyString([record?.mediaCompanyName, record?.programmerName, record?.programmerId])
                        )}</h4>
                        <p class="vault-pass-record-meta">${escapeHtml(String(record?.programmerId || ""))} | ${escapeHtml(
                          formatVaultTimestamp(record?.updatedAt || record?.hydratedAt || 0)
                        )}</p>
                      </div>
                      <div class="vault-pass-record-actions">
                        <span class="vault-pass-status" data-status="${escapeHtml(renderedStatus)}">${escapeHtml(
                          renderedHydrationLabel
                        )}</span>
                        <button
                          type="button"
                          class="vault-pass-action-btn${mediaCompanyActionWorking ? " vault-pass-action-btn--working" : ""}"
                          data-vault-action="rehydrate-media-company"
                          data-environment-key="${escapeHtml(environmentKey)}"
                          data-programmer-id="${escapeHtml(programmerId)}"
                          ${actionButtonsDisabled ? "disabled" : ""}
                          title="${escapeHtml(
                            mediaCompanyActionWorking
                              ? "UnderPAR is rebuilding this ENV x Media Company vault record."
                              : isActiveEnvironment
                              ? "Invalidate and rebuild this active environment media-company vault record."
                              : `Switch UnderPAR to ${environmentSummary?.label || environmentKey} and re-hydrate this media company.`
                          )}"
                        >${escapeHtml(mediaCompanyActionWorking ? "⟳ RE-HYDRATING..." : "⟳ RE-HYDRATE")}</button>
                      </div>
                    </div>
                    <div class="vault-pass-tag-strip">
                      ${(Array.isArray(record?.serviceTags) ? record.serviceTags : [])
                        .map((serviceTag) => `<span class="vault-pass-tag">${escapeHtml(serviceTag)}</span>`)
                        .join("")}
                      ${registeredAppsMarkup}
                      ${
                        Number(record?.matchedTenantCount || 0) > 0
                          ? `<span class="vault-pass-tag vault-pass-tag--meta">${escapeHtml(
                              `${Number(record?.matchedTenantCount || 0)} CM`
                            )}</span>`
                          : ""
                      }
                    </div>
                  </article>
                `;
                }
              )
              .join("")
          : '<p class="vault-pass-empty">No media-company records stored for this environment.</p>';

      return `
        <section class="vault-pass-environment">
          <div class="vault-pass-environment-head">
            <div>
              <h3 class="vault-pass-environment-title">${escapeHtml(environmentSummary?.label || environmentSummary?.environmentKey || "Environment")}</h3>
              <p class="vault-pass-environment-meta">${escapeHtml(
                formatVaultTimestamp(environmentSummary?.updatedAt || 0)
              )}</p>
            </div>
            <div class="vault-pass-environment-actions">
              <span class="vault-pass-badge">${escapeHtml(String(mediaCompanies.length))} Records</span>
              ${
                isActiveEnvironment
                  ? `<button
                      type="button"
                      class="vault-pass-action-btn${environmentActionWorking ? " vault-pass-action-btn--working" : ""}"
                      data-vault-action="rehydrate-environment"
                      data-environment-key="${escapeHtml(environmentKey)}"
                      ${actionButtonsDisabled ? "disabled" : ""}
                      title="${escapeHtml(
                        environmentActionWorking
                          ? `UnderPAR is rebuilding every stored media-company vault record in ${environmentSummary?.label || environmentKey}.`
                          : `Invalidate and rebuild every ${environmentSummary?.label || environmentKey} media-company vault record currently stored in VAULT.`
                      )}"
                    >${escapeHtml(environmentActionWorking ? "⟳ RE-HYDRATING..." : "⟳ RE-HYDRATE")}</button>`
                  : ""
              }
            </div>
          </div>
          <div class="vault-pass-record-grid">
            ${mediaCompanyMarkup}
          </div>
        </section>
      `;
    })
    .join("");
}

async function readStoredVaultPayload() {
  if (!chrome?.storage?.local?.get) {
    return normalizeVaultPayload(null);
  }
  try {
    const payload = await chrome.storage.local.get(UNDERPAR_VAULT_STORAGE_KEY);
    return normalizeVaultPayload(payload?.[UNDERPAR_VAULT_STORAGE_KEY] || null);
  } catch {
    return normalizeVaultPayload(null);
  }
}

function downloadTextFile(content, fileName, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([String(content || "")], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = String(fileName || "underpar-export.txt");
  anchor.click();
  URL.revokeObjectURL(blobUrl);
}

function escapeCsvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function serializeCsvRows(rows = []) {
  const normalizedRows = Array.isArray(rows) ? rows.filter((row) => row && typeof row === "object") : [];
  if (normalizedRows.length === 0) {
    return "";
  }
  const headers = Object.keys(normalizedRows[0]);
  const lines = [
    headers.map((header) => escapeCsvCell(header)).join(","),
    ...normalizedRows.map((row) => headers.map((header) => escapeCsvCell(row?.[header] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

function getVaultAppCredential(applicationRecord = null, serviceKey = "") {
  const serviceCredential =
    applicationRecord?.serviceCredentialsByServiceKey &&
    typeof applicationRecord.serviceCredentialsByServiceKey === "object"
      ? normalizeVaultCredential(applicationRecord.serviceCredentialsByServiceKey?.[serviceKey] || null)
      : null;
  if (serviceCredential) {
    return serviceCredential;
  }
  return normalizeVaultCredential(applicationRecord?.dcrCache || null);
}

function getVaultServiceLabel(serviceKey = "") {
  if (serviceKey === "restV2") {
    return "REST V2";
  }
  if (serviceKey === "esm") {
    return "ESM";
  }
  if (serviceKey === "degradation") {
    return "DEGRADATION";
  }
  if (serviceKey === "cm") {
    return "CM";
  }
  return String(serviceKey || "").trim();
}

function getVaultServiceKeyFromLabel(value = "") {
  const normalized = String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (normalized === "restv2" || normalized === "rest2") {
    return "restV2";
  }
  if (normalized === "esm") {
    return "esm";
  }
  if (normalized === "degradation" || normalized === "degredation") {
    return "degradation";
  }
  if (normalized === "cm" || normalized === "concurrencymonitoring" || normalized === "concurrencymonitorring") {
    return "cm";
  }
  return "";
}

function formatVaultMatchedTenants(value = []) {
  const entries = Array.isArray(value) ? value : [];
  return entries
    .map((entry) => {
      const consoleId = firstNonEmptyString([entry?.consoleId, entry?.id, entry?.tenantId, entry?.orgId]);
      const tenantId = firstNonEmptyString([entry?.tenantId, entry?.orgId, entry?.id, entry?.consoleId]);
      const displayName = firstNonEmptyString([entry?.displayName, entry?.name, entry?.label]);
      if (!consoleId && !tenantId && !displayName) {
        return "";
      }
      return [consoleId, tenantId, displayName].map((part) => String(part || "").trim()).join("::");
    })
    .filter(Boolean)
    .join("||");
}

function parseVaultMatchedTenants(value = "") {
  return String(value || "")
    .split("||")
    .map((entry) => {
      const [consoleId = "", tenantId = "", displayName = ""] = String(entry || "")
        .split("::")
        .map((part) => String(part || "").trim());
      if (!consoleId && !tenantId && !displayName) {
        return null;
      }
      return {
        consoleId,
        tenantId,
        displayName,
      };
    })
    .filter(Boolean);
}

function createVaultExportRowSkeleton() {
  return {
    "UnderPAR Vault CSV": UNDERPAR_VAULT_CSV_SCHEMA,
    "Row Type": "",
    "Environment Key": "",
    "Adobe IMS Client ID": "",
    "Adobe IMS Scope": "",
    "Adobe IMS Raw Scope": "",
    "Adobe IMS Dropped Scopes": "",
    "Adobe IMS Source": "",
    "Adobe IMS Imported At": "",
    "Adobe IMS Updated At": "",
    "Media Company ID": "",
    Service: "",
    "Registered Application GUID": "",
    "Client ID": "",
    "Client Secret": "",
    "Access Token": "",
    "Token Expires At": "",
    "CM Matched Tenants": "",
    "CM IMS Client ID": "",
    "CM IMS Token Client ID": "",
    "CM IMS User ID": "",
    "CM IMS Scope": "",
    "CM IMS Expires At": "",
    "CM IMS Token Fingerprint": "",
    "CM IMS Updated At": "",
    "CM IMS Session": "",
    "Saved Query Name": "",
    "Saved Query URL": "",
    "Slack Workspace Origin": "",
    "Slack Ready": "",
    "Slack Auth Mode": "",
    "Slack OIDC Client ID": "",
    "Slack OIDC Client Secret": "",
    "Slack OIDC Scope": "",
    "Slack OIDC Redirect Path": "",
    "Slack OIDC Redirect URI": "",
    "Slack API Bot Token": "",
    "Slack API User Token": "",
    "Slack API OAuth Token": "",
    "Slack Singularity Channel ID": "",
    "Slack Singularity Mention": "",
    "Slack User ID": "",
    "Slack Team ID": "",
    "Slack User Name": "",
    "Slack Email": "",
    "Slack Avatar URL": "",
    "Slack Status Icon": "",
    "Slack Status Icon URL": "",
    "Slack Status Message": "",
    "Slack Direct Channel ID": "",
    "Slack Direct Channel Error Code": "",
    "Slack Avatar Error Code": "",
    "Slack Avatar Error": "",
    "Slack Activated At": "",
    "Slack Updated At": "",
    "Slack Key Version": "",
    "Slack Key Imported At": "",
    "Slack Key Source": "",
    "Slack pass-transition Channel ID": "",
    "Slack pass-transition Channel Name": "",
    "Slack pass-transition Synced At": "",
    "Slack pass-transition Token Type": "",
    "Slack pass-transition Members JSON": "",
    "Slack pass-transition Error Code": "",
    "Slack pass-transition Error Message": "",
  };
}

function buildVaultExportRows(vaultPayload = null) {
  const environments = getVaultPassEnvironments(vaultPayload);
  const rows = [];
  const savedQueries = normalizeVaultSavedQueries(getVaultSavedQueriesInput(vaultPayload));
  const cmGlobalsByEnvironment = getVaultCmGlobalsByEnvironment(vaultPayload);
  const imsRuntimeConfig = getVaultImsRuntimeConfig(vaultPayload);
  const slacktivationRecord = getVaultSlacktivationRecord(vaultPayload);

  if (imsRuntimeConfig) {
    rows.push({
      ...createVaultExportRowSkeleton(),
      "Row Type": "underpar-adobe-ims",
      "Adobe IMS Client ID": String(imsRuntimeConfig.clientId || "").trim(),
      "Adobe IMS Scope": String(imsRuntimeConfig.scope || "").trim(),
      "Adobe IMS Raw Scope": String(imsRuntimeConfig.rawScope || "").trim(),
      "Adobe IMS Dropped Scopes": Array.isArray(imsRuntimeConfig.droppedScopes) ? imsRuntimeConfig.droppedScopes.join(" ") : "",
      "Adobe IMS Source": String(imsRuntimeConfig.source || "").trim(),
      "Adobe IMS Imported At": String(imsRuntimeConfig.importedAt || "").trim(),
      "Adobe IMS Updated At": Number(imsRuntimeConfig.updatedAt || 0) || "",
    });
  }

  Object.entries(savedQueries)
    .sort((left, right) => String(left[0] || "").localeCompare(String(right[0] || ""), undefined, { sensitivity: "base" }))
    .forEach(([name, url]) => {
      rows.push({
        ...createVaultExportRowSkeleton(),
        "Row Type": "underpar-saved-query",
        "Saved Query Name": String(name || "").trim(),
        "Saved Query URL": String(url || "").trim(),
      });
    });

  Object.entries(cmGlobalsByEnvironment)
    .sort((left, right) => String(left[0] || "").localeCompare(String(right[0] || ""), undefined, { sensitivity: "base" }))
    .forEach(([environmentKey, record]) => {
      const normalizedRecord = normalizeVaultCmGlobalRecord(record);
      if (!normalizedRecord) {
        return;
      }
      rows.push({
        ...createVaultExportRowSkeleton(),
        "Row Type": "underpar-cm-ims",
        "Environment Key": String(environmentKey || "").trim(),
        "CM IMS Client ID": String(normalizedRecord.clientId || "").trim(),
        "CM IMS Token Client ID": String(normalizedRecord.tokenClientId || "").trim(),
        "CM IMS User ID": String(normalizedRecord.userId || "").trim(),
        "CM IMS Scope": String(normalizedRecord.scope || "").trim(),
        "CM IMS Expires At": Number(normalizedRecord.expiresAt || 0) || "",
        "CM IMS Token Fingerprint": String(normalizedRecord.tokenFingerprint || "").trim(),
        "CM IMS Updated At": Number(normalizedRecord.updatedAt || 0) || "",
        "CM IMS Session": normalizedRecord.imsSession ? JSON.stringify(normalizedRecord.imsSession) : "",
      });
    });

  if (slacktivationRecord) {
    rows.push({
      ...createVaultExportRowSkeleton(),
      "Row Type": "underpar-slacktivation",
      "Slack Workspace Origin": String(slacktivationRecord.workspaceOrigin || "").trim(),
      "Slack Ready": slacktivationRecord.ready === true ? "true" : "false",
      "Slack Auth Mode": String(slacktivationRecord.identity?.mode || "").trim(),
      "Slack OIDC Client ID": String(slacktivationRecord.oidc?.clientId || "").trim(),
      "Slack OIDC Client Secret": String(slacktivationRecord.oidc?.clientSecret || "").trim(),
      "Slack OIDC Scope": String(slacktivationRecord.oidc?.scope || "").trim(),
      "Slack OIDC Redirect Path": String(slacktivationRecord.oidc?.redirectPath || "").trim(),
      "Slack OIDC Redirect URI": String(slacktivationRecord.oidc?.redirectUri || "").trim(),
      "Slack API Bot Token": String(slacktivationRecord.api?.botToken || "").trim(),
      "Slack API User Token": String(slacktivationRecord.api?.userToken || "").trim(),
      "Slack API OAuth Token": String(slacktivationRecord.api?.oauthToken || "").trim(),
      "Slack Singularity Channel ID": String(slacktivationRecord.singularity?.channelId || "").trim(),
      "Slack Singularity Mention": String(slacktivationRecord.singularity?.mention || "").trim(),
      "Slack User ID": String(slacktivationRecord.identity?.userId || "").trim(),
      "Slack Team ID": String(slacktivationRecord.identity?.teamId || "").trim(),
      "Slack User Name": String(slacktivationRecord.identity?.userName || "").trim(),
      "Slack Email": String(slacktivationRecord.identity?.email || "").trim(),
      "Slack Avatar URL": String(slacktivationRecord.identity?.avatarUrl || "").trim(),
      "Slack Status Icon": String(slacktivationRecord.identity?.statusIcon || "").trim(),
      "Slack Status Icon URL": String(slacktivationRecord.identity?.statusIconUrl || "").trim(),
      "Slack Status Message": String(slacktivationRecord.identity?.statusMessage || "").trim(),
      "Slack Direct Channel ID": String(slacktivationRecord.identity?.directChannelId || "").trim(),
      "Slack Direct Channel Error Code": String(slacktivationRecord.identity?.directChannelErrorCode || "").trim(),
      "Slack Avatar Error Code": String(slacktivationRecord.identity?.avatarErrorCode || "").trim(),
      "Slack Avatar Error": String(slacktivationRecord.identity?.avatarError || "").trim(),
      "Slack Activated At": Number(slacktivationRecord.activatedAt || 0) || "",
      "Slack Updated At": Number(slacktivationRecord.updatedAt || slacktivationRecord.identity?.updatedAt || 0) || "",
      "Slack Key Version": String(slacktivationRecord.keyMeta?.keyVersion || "").trim(),
      "Slack Key Imported At": String(slacktivationRecord.keyMeta?.importedAt || "").trim(),
      "Slack Key Source": String(slacktivationRecord.keyMeta?.source || "").trim(),
      "Slack pass-transition Channel ID": String(slacktivationRecord.passTransition?.channelId || "").trim(),
      "Slack pass-transition Channel Name": String(slacktivationRecord.passTransition?.channelName || "").trim(),
      "Slack pass-transition Synced At": Number(slacktivationRecord.passTransition?.syncedAt || 0) || "",
      "Slack pass-transition Token Type": String(slacktivationRecord.passTransition?.tokenType || "").trim(),
      "Slack pass-transition Members JSON": safeJsonStringify(slacktivationRecord.passTransition?.members || []),
      "Slack pass-transition Error Code": String(slacktivationRecord.passTransition?.lastError?.code || "").trim(),
      "Slack pass-transition Error Message": String(slacktivationRecord.passTransition?.lastError?.message || "").trim(),
    });
  }

  Object.entries(environments).forEach(([environmentKey, environmentRecord]) => {
    const mediaCompanies =
      environmentRecord?.mediaCompanies &&
      typeof environmentRecord.mediaCompanies === "object" &&
      !Array.isArray(environmentRecord.mediaCompanies)
        ? environmentRecord.mediaCompanies
        : {};

    Object.values(mediaCompanies).forEach((record) => {
      const serviceKeys = ["restV2", "esm", "degradation"];
      const registeredApplications = getVaultRegisteredApplications(record);
      const cmSummary = getVaultServiceSummary(record, "cm");
      const matchedTenants = Array.isArray(cmSummary?.matchedTenants) ? cmSummary.matchedTenants : [];

      serviceKeys.forEach((serviceKey) => {
        const serviceSummary = getVaultServiceSummary(record, serviceKey);
        const appGuids = uniqueSorted(Array.isArray(serviceSummary?.appGuids) ? serviceSummary.appGuids : []);
        appGuids.forEach((guid) => {
          const applicationRecord = registeredApplications?.[guid] || {};
          const credential = getVaultAppCredential(applicationRecord, serviceKey) || {};
          if (!credential?.clientId || !credential?.clientSecret) {
            return;
          }
          rows.push({
            ...createVaultExportRowSkeleton(),
            "Row Type": "pass-service",
            "Environment Key": environmentKey,
            "Media Company ID": String(record?.programmerId || "").trim(),
            Service: getVaultServiceLabel(serviceKey),
            "Registered Application GUID": guid,
            "Client ID": String(credential?.clientId || "").trim(),
            "Client Secret": String(credential?.clientSecret || "").trim(),
            "Access Token": String(credential?.accessToken || "").trim(),
            "Token Expires At": Number(credential?.tokenExpiresAt || 0) || "",
          });
        });
      });

      if (cmSummary?.available === true || matchedTenants.length > 0) {
        rows.push({
          ...createVaultExportRowSkeleton(),
          "Row Type": "pass-service",
          "Environment Key": environmentKey,
          "Media Company ID": String(record?.programmerId || "").trim(),
          Service: getVaultServiceLabel("cm"),
          "CM Matched Tenants": formatVaultMatchedTenants(matchedTenants),
        });
      }
    });
  });

  return rows;
}

function parseCsvText(csvText = "") {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    if (insideQuotes) {
      if (char === '"') {
        if (csvText[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  const [headerRow, ...valueRows] = rows.filter((entry) => Array.isArray(entry) && entry.some((cellValue) => String(cellValue || "").length > 0));
  if (!Array.isArray(headerRow) || headerRow.length === 0) {
    return [];
  }

  return valueRows.map((valueRow) => {
    const record = {};
    headerRow.forEach((header, index) => {
      record[String(header || "").trim()] = String(valueRow?.[index] || "");
    });
    return record;
  });
}

function mergeImportedVaultPayload(existingVault = null, importedVault = null) {
  const nextVault = normalizeVaultPayload(existingVault);
  const normalizedImportedVault = normalizeVaultPayload(importedVault);

  const importedSavedQueries = normalizeVaultSavedQueries(getVaultSavedQueriesInput(normalizedImportedVault));
  if (Object.keys(importedSavedQueries).length > 0) {
    setVaultSavedQueries(nextVault, {
      ...normalizeVaultSavedQueries(getVaultSavedQueriesInput(nextVault)),
      ...cloneJsonLikeValue(importedSavedQueries, {}),
    });
  }

  const importedCmGlobalsByEnvironment = getVaultCmGlobalsByEnvironment(normalizedImportedVault);
  Object.entries(importedCmGlobalsByEnvironment).forEach(([environmentKey, record]) => {
    const normalizedEnvironmentKey = String(environmentKey || "").trim();
    if (!normalizedEnvironmentKey) {
      return;
    }
    setVaultCmGlobalRecord(nextVault, normalizedEnvironmentKey, record);
  });

  const importedImsRuntimeConfig = getVaultImsRuntimeConfig(normalizedImportedVault);
  if (importedImsRuntimeConfig) {
    setVaultImsRuntimeConfig(nextVault, importedImsRuntimeConfig);
  }

  const importedSlacktivationRecord = getVaultSlacktivationRecord(normalizedImportedVault);
  if (importedSlacktivationRecord) {
    setVaultSlacktivationRecord(nextVault, importedSlacktivationRecord);
  }

  Object.entries(getVaultPassEnvironments(normalizedImportedVault)).forEach(([environmentKey, environmentRecord]) => {
    if (!nextVault.pass.environments[environmentKey]) {
      nextVault.pass.environments[environmentKey] = {
        key: environmentKey,
        label: firstNonEmptyString([environmentRecord?.label, environmentKey]),
        updatedAt: Date.now(),
        cmGlobal: normalizeVaultCmGlobalRecord(environmentRecord?.cmGlobal || null),
        mediaCompanies: {},
      };
    }

    const targetEnvironment = nextVault.pass.environments[environmentKey];
    targetEnvironment.label = firstNonEmptyString([environmentRecord?.label, targetEnvironment.label, environmentKey]);
    targetEnvironment.updatedAt = Date.now();
    const importedCmGlobalRecord = normalizeVaultCmGlobalRecord(environmentRecord?.cmGlobal || null);
    if (importedCmGlobalRecord) {
      setVaultCmGlobalRecord(nextVault, environmentKey, importedCmGlobalRecord);
    }
    const importedMediaCompanies =
      environmentRecord?.mediaCompanies &&
      typeof environmentRecord.mediaCompanies === "object" &&
      !Array.isArray(environmentRecord.mediaCompanies)
        ? environmentRecord.mediaCompanies
        : {};
    Object.entries(importedMediaCompanies).forEach(([programmerId, record]) => {
      const normalizedProgrammerId = String(programmerId || record?.programmerId || "").trim();
      if (!normalizedProgrammerId) {
        return;
      }
      targetEnvironment.mediaCompanies[normalizedProgrammerId] = cloneJsonLikeValue(record, {});
    });
  });

  nextVault.updatedAt = Date.now();
  return nextVault;
}

function createImportedPassServiceSummary(serviceKey = "", options = {}) {
  const requiredScope = firstNonEmptyString([
    String(options?.requiredScope || "").trim(),
    VAULT_REQUIRED_SCOPE_BY_SERVICE_KEY[serviceKey],
  ]);
  const matchedTenants = Array.isArray(options?.matchedTenants) ? cloneJsonLikeValue(options.matchedTenants, []) : [];
  if (serviceKey === "cm") {
    return {
      available: options?.available === true || matchedTenants.length > 0,
      checked: options?.checked !== false,
      matchedTenantCount: matchedTenants.length,
      matchedTenants,
      sourceUrl: String(options?.sourceUrl || "").trim(),
      fetchedAt: Number(options?.fetchedAt || Date.now()),
      loadError: String(options?.loadError || "").trim(),
    };
  }
  return {
    available: options?.available === true,
    primaryGuid: String(options?.primaryGuid || "").trim(),
    appGuids: uniqueSorted(Array.isArray(options?.appGuids) ? options.appGuids : []),
    requiredScope,
  };
}

function createImportedPassVaultRecord(meta = {}) {
  const programmerId = String(meta?.programmerId || "").trim();
  const programmerName = firstNonEmptyString([meta?.programmerName, meta?.mediaCompanyName, programmerId]);
  const mediaCompanyName = firstNonEmptyString([meta?.mediaCompanyName, meta?.programmerName, programmerId]);
  const environmentKey = String(meta?.environmentKey || "").trim();
  const environmentLabel = firstNonEmptyString([meta?.environmentLabel, resolveEnvironmentRecord(environmentKey)?.label, environmentKey]);
  const hydrationStatus = normalizeVaultHydrationStatus(meta?.hydrationStatus);
  const now = Date.now();
  return {
    programmerId,
    programmerName,
    mediaCompanyName,
    environmentKey,
    environmentLabel,
    hydrationStatus,
    source: "import",
    premiumDetectionVersion: UNDERPAR_PASS_VAULT_PREMIUM_DETECTION_VERSION,
    updatedAt: now,
    hydratedAt: hydrationStatus === "complete" ? now : 0,
    lastSelectedAt: 0,
    registeredApplicationCount: 0,
    registeredApplicationsByGuid: {},
    services: {
      restV2: createImportedPassServiceSummary("restV2"),
      esm: createImportedPassServiceSummary("esm"),
      degradation: createImportedPassServiceSummary("degradation"),
      cm: createImportedPassServiceSummary("cm", {
        available: false,
        checked: false,
        matchedTenants: [],
        fetchedAt: 0,
      }),
    },
  };
}

function ensureImportedPassVaultRecord(recordsByEnvironment = {}, environmentKey = "", environmentLabel = "", programmerId = "", meta = {}) {
  const normalizedEnvironmentKey = String(environmentKey || "").trim();
  const normalizedProgrammerId = String(programmerId || "").trim();
  if (!normalizedEnvironmentKey || !normalizedProgrammerId) {
    return null;
  }
  if (!recordsByEnvironment[normalizedEnvironmentKey]) {
    recordsByEnvironment[normalizedEnvironmentKey] = {};
  }
  if (!recordsByEnvironment[normalizedEnvironmentKey][normalizedProgrammerId]) {
    recordsByEnvironment[normalizedEnvironmentKey][normalizedProgrammerId] = createImportedPassVaultRecord({
      ...meta,
      environmentKey: normalizedEnvironmentKey,
      environmentLabel,
      programmerId: normalizedProgrammerId,
    });
  }
  const record = recordsByEnvironment[normalizedEnvironmentKey][normalizedProgrammerId];
  record.programmerName = firstNonEmptyString([meta?.programmerName, record.programmerName, normalizedProgrammerId]);
  record.mediaCompanyName = firstNonEmptyString([meta?.mediaCompanyName, record.mediaCompanyName, record.programmerName, normalizedProgrammerId]);
  record.environmentLabel = firstNonEmptyString([environmentLabel, record.environmentLabel, normalizedEnvironmentKey]);
  if (meta?.hydrationStatus) {
    record.hydrationStatus = normalizeVaultHydrationStatus(meta.hydrationStatus);
    if (record.hydrationStatus === "complete" && !record.hydratedAt) {
      record.hydratedAt = Date.now();
    }
  }
  record.updatedAt = Date.now();
  return record;
}

function createImportedApplicationData(guid = "", appName = "", scopes = []) {
  const normalizedGuid = String(guid || "").trim();
  const normalizedAppName = String(appName || "").trim();
  const normalizedScopes = uniqueSorted(Array.isArray(scopes) ? scopes : []);
  return {
    guid: normalizedGuid,
    name: normalizedAppName,
    ...(normalizedScopes.length > 0
      ? {
        scopes: normalizedScopes.slice(),
      }
      : {}),
  };
}

function getImportedPassApplicationRecord(record = null, guid = "", appName = "") {
  const normalizedGuid = String(guid || "").trim();
  if (!record || !normalizedGuid) {
    return null;
  }
  const existingApplicationRecord =
    record?.registeredApplicationsByGuid?.[normalizedGuid] &&
    typeof record.registeredApplicationsByGuid[normalizedGuid] === "object"
      ? record.registeredApplicationsByGuid[normalizedGuid]
      : null;
  if (existingApplicationRecord) {
    return existingApplicationRecord;
  }
  const nextApplicationRecord = {
    guid: normalizedGuid,
    appName: firstNonEmptyString([appName, normalizedGuid]),
    scopes: [],
    serviceKeys: [],
    dcrCache: null,
    serviceCredentialsByServiceKey: {},
    applicationData: createImportedApplicationData(normalizedGuid, firstNonEmptyString([appName, normalizedGuid])),
    updatedAt: Date.now(),
  };
  record.registeredApplicationsByGuid[normalizedGuid] = nextApplicationRecord;
  record.registeredApplicationCount = Math.max(
    0,
    Number(record?.registeredApplicationCount || 0),
    Object.keys(getVaultRegisteredApplications(record)).length
  );
  return nextApplicationRecord;
}

function mergeImportedMatchedTenants(...values) {
  const dedupe = new Map();
  values.forEach((value) => {
    (Array.isArray(value) ? value : []).forEach((entry) => {
      const consoleId = firstNonEmptyString([entry?.consoleId, entry?.id, entry?.tenantId, entry?.orgId]);
      const tenantId = firstNonEmptyString([entry?.tenantId, entry?.orgId, entry?.id, entry?.consoleId]);
      const displayName = firstNonEmptyString([entry?.displayName, entry?.name, entry?.label]);
      if (!consoleId && !tenantId && !displayName) {
        return;
      }
      dedupe.set(`${consoleId}::${tenantId}::${displayName}`, {
        ...(consoleId ? { consoleId } : {}),
        ...(tenantId ? { tenantId } : {}),
        ...(displayName ? { displayName } : {}),
      });
    });
  });
  return Array.from(dedupe.values());
}

function mergeImportedPassServiceSummary(record = null, serviceKey = "", options = {}) {
  if (!record || !serviceKey || !record.services || typeof record.services !== "object") {
    return null;
  }
  if (serviceKey === "cm") {
    const existingSummary = record?.services?.cm && typeof record.services.cm === "object" ? record.services.cm : {};
    const matchedTenants = mergeImportedMatchedTenants(existingSummary?.matchedTenants, options?.matchedTenants);
    const mergedSummary = createImportedPassServiceSummary("cm", {
      available: existingSummary?.available === true || options?.available === true || matchedTenants.length > 0,
      checked:
        existingSummary?.checked === true ||
        options?.checked === true ||
        matchedTenants.length > 0 ||
        Boolean(String(existingSummary?.loadError || options?.loadError || "").trim()),
      matchedTenants,
      fetchedAt: Math.max(
        Number(existingSummary?.fetchedAt || 0),
        Number(options?.fetchedAt || 0),
        matchedTenants.length > 0 ? Date.now() : 0
      ),
      sourceUrl: firstNonEmptyString([options?.sourceUrl, existingSummary?.sourceUrl]),
      loadError: firstNonEmptyString([options?.loadError, existingSummary?.loadError]),
    });
    record.services.cm = mergedSummary;
    return mergedSummary;
  }

  const existingSummary =
    record?.services?.[serviceKey] && typeof record.services[serviceKey] === "object" ? record.services[serviceKey] : {};
  const nextAppGuids = uniqueSorted(
    (Array.isArray(existingSummary?.appGuids) ? existingSummary.appGuids : []).concat(
      Array.isArray(options?.appGuids) ? options.appGuids : [],
      String(options?.primaryGuid || "").trim() ? [String(options.primaryGuid).trim()] : []
    )
  );
  const mergedSummary = createImportedPassServiceSummary(serviceKey, {
    available: existingSummary?.available === true || options?.available === true || nextAppGuids.length > 0,
    primaryGuid: firstNonEmptyString([existingSummary?.primaryGuid, options?.primaryGuid, nextAppGuids[0]]),
    appGuids: nextAppGuids,
    requiredScope: firstNonEmptyString([options?.requiredScope, existingSummary?.requiredScope]),
  });
  record.services[serviceKey] = mergedSummary;
  return mergedSummary;
}

function hydrateLegacyDcrCachesFromVault(vaultPayload = null) {
  const environments = getVaultPassEnvironments(vaultPayload);
  Object.entries(environments).forEach(([environmentKey, environmentRecord]) => {
    const mediaCompanies =
      environmentRecord?.mediaCompanies &&
      typeof environmentRecord.mediaCompanies === "object" &&
      !Array.isArray(environmentRecord.mediaCompanies)
        ? environmentRecord.mediaCompanies
        : {};
    Object.values(mediaCompanies).forEach((record) => {
      const programmerId = String(record?.programmerId || "").trim();
      if (!programmerId) {
        return;
      }
      const registeredApplications = getVaultRegisteredApplications(record);
      Object.entries(registeredApplications).forEach(([guid, applicationRecord]) => {
        const cache = getVaultAppCredential(applicationRecord, "restV2") || getVaultAppCredential(applicationRecord, "esm") || getVaultAppCredential(applicationRecord, "degradation");
        if (!cache) {
          return;
        }
        try {
          globalThis.localStorage?.setItem(
            `${UNDERPAR_DCR_CACHE_PREFIX}:${environmentKey}:${programmerId}:${guid}`,
            JSON.stringify(cache)
          );
        } catch {
          // Ignore local cache hydration failures during import.
        }
      });
    });
  });
}

async function persistImportedVaultPayload(vaultPayload = null) {
  if (!chrome?.storage?.local?.set) {
    throw new Error("Chrome local storage is unavailable in the UP panel.");
  }
  const normalizedVault = normalizeVaultPayload(vaultPayload);
  try {
    await chrome.storage.local.set({
      [UNDERPAR_VAULT_STORAGE_KEY]: normalizedVault,
    });
  } catch (error) {
    const message = String(error?.message || error || "").trim();
    if (message.toLowerCase().includes("quota")) {
      throw new Error("Chrome local storage quota exceeded. UnderPAR VAULT now stores only service-linked PASS records; purge or re-hydrate before importing again.");
    }
    throw error;
  }
  hydrateLegacyDcrCachesFromVault(normalizedVault);
  markVaultDirty("Vault import stored. Reopen VAULT to inspect the imported snapshot.");
  return normalizedVault;
}

function downloadVaultExportFile(vaultPayload = null, options = {}) {
  const exportRows = buildVaultExportRows(vaultPayload);
  if (exportRows.length === 0 && options.allowEmpty !== true) {
    throw new Error("No PASS vault records are available to export.");
  }
  const rows = exportRows.length > 0 ? exportRows : [createVaultExportRowSkeleton()];
  const csvContent = serializeCsvRows(rows);
  if (!csvContent) {
    throw new Error("Unable to serialize the current vault.");
  }
  const environmentTag = normalizeEnvironmentKey(environmentSelect?.value || FALLBACK_DEFAULT_KEY).includes("staging")
    ? "stage"
    : "prod";
  const filePrefix = String(options.filePrefix || "underpar-vault").trim() || "underpar-vault";
  const fileName = `${filePrefix}-${environmentTag}-${Date.now()}.csv`;
  downloadTextFile(csvContent, fileName, "text/csv;charset=utf-8");
  return {
    rowCount: exportRows.length,
    fileName,
  };
}

async function handleVaultExport() {
  if (vaultExportButton) {
    vaultExportButton.disabled = true;
  }
  setVaultStatus("Building UnderPAR vault export...");
  try {
    const vaultPayload = await readStoredVaultPayload();
    const exportResult = downloadVaultExportFile(vaultPayload);
    setVaultStatus(`Exported ${exportResult.rowCount} vault rows.`);
  } catch (error) {
    setVaultStatus(error instanceof Error ? error.message : String(error || "Unable to export the vault."));
  } finally {
    if (vaultExportButton) {
      vaultExportButton.disabled = false;
    }
  }
}

async function handleVaultImportFile(file) {
  if (!file) {
    return;
  }

  panelState.vaultImportBusy = true;
  if (vaultImportButton) {
    vaultImportButton.disabled = true;
  }
  if (vaultExportButton) {
    vaultExportButton.disabled = true;
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.disabled = true;
  }
  setVaultStatus(`Importing ${file.name} into the UnderPAR vault...`);

  try {
    const text = await file.text();
    const rows = parseCsvText(text);
    if (rows.length === 0) {
      throw new Error("The selected CSV did not contain any rows.");
    }

    const importedRecords = {};
    const importedSavedQueries = {};
    const importedCmGlobalsByEnvironment = {};
    let importedImsRuntimeConfig = null;
    let importedSlacktivationRecord = null;
    let importableRowCount = 0;

    rows.forEach((row) => {
      const schema = String(row?.["UnderPAR Vault CSV"] || "").trim();
      if (!UNDERPAR_VAULT_SUPPORTED_CSV_SCHEMAS.has(schema)) {
        return;
      }

      const rowType = String(row?.["Row Type"] || "").trim().toLowerCase();
      if (rowType === "underpar-saved-query") {
        const queryName = String(row?.["Saved Query Name"] || "").trim();
        const queryUrl = String(row?.["Saved Query URL"] || "").trim();
        if (queryName && queryUrl) {
          importedSavedQueries[queryName] = queryUrl;
          importableRowCount += 1;
        }
        return;
      }

      if (rowType === "underpar-cm-ims") {
        const environmentKey = String(row?.["Environment Key"] || "").trim();
        if (!environmentKey) {
          return;
        }
        let imsSession = null;
        const rawImsSession = String(row?.["CM IMS Session"] || "").trim();
        if (rawImsSession) {
          try {
            imsSession = JSON.parse(rawImsSession);
          } catch {
            imsSession = null;
          }
        }
        const record = normalizeVaultCmGlobalRecord({
          clientId: row?.["CM IMS Client ID"],
          tokenClientId: row?.["CM IMS Token Client ID"],
          userId: row?.["CM IMS User ID"],
          scope: row?.["CM IMS Scope"],
          expiresAt: row?.["CM IMS Expires At"],
          tokenFingerprint: row?.["CM IMS Token Fingerprint"],
          updatedAt: row?.["CM IMS Updated At"],
          imsSession,
        });
        if (record) {
          importedCmGlobalsByEnvironment[environmentKey] = record;
          importableRowCount += 1;
        }
        return;
      }

      if (rowType === "underpar-adobe-ims") {
        const record = normalizeVaultImsRuntimeConfigRecord({
          clientId: row?.["Adobe IMS Client ID"],
          scope: row?.["Adobe IMS Scope"],
          rawScope: row?.["Adobe IMS Raw Scope"],
          droppedScopes: row?.["Adobe IMS Dropped Scopes"],
          source: row?.["Adobe IMS Source"],
          importedAt: row?.["Adobe IMS Imported At"],
          updatedAt: row?.["Adobe IMS Updated At"],
        });
        if (record?.clientId) {
          importedImsRuntimeConfig = record;
          importableRowCount += 1;
        }
        return;
      }

      if (rowType === "underpar-slacktivation") {
        let passTransitionMembers = [];
        const rawPassTransitionMembers = String(row?.["Slack pass-transition Members JSON"] || "").trim();
        if (rawPassTransitionMembers) {
          try {
            const parsedMembers = JSON.parse(rawPassTransitionMembers);
            passTransitionMembers = Array.isArray(parsedMembers) ? parsedMembers : [];
          } catch {
            passTransitionMembers = [];
          }
        }
        const record = normalizeVaultSlacktivationRecord({
          workspaceOrigin: row?.["Slack Workspace Origin"],
          ready: row?.["Slack Ready"],
          activatedAt: row?.["Slack Activated At"],
          updatedAt: row?.["Slack Updated At"],
          oidc: {
            clientId: row?.["Slack OIDC Client ID"],
            clientSecret: row?.["Slack OIDC Client Secret"],
            scope: row?.["Slack OIDC Scope"],
            redirectPath: row?.["Slack OIDC Redirect Path"],
            redirectUri: row?.["Slack OIDC Redirect URI"],
          },
          api: {
            botToken: row?.["Slack API Bot Token"],
            userToken: row?.["Slack API User Token"],
            oauthToken: row?.["Slack API OAuth Token"],
          },
          singularity: {
            channelId: row?.["Slack Singularity Channel ID"],
            mention: row?.["Slack Singularity Mention"],
          },
          identity: {
            ready: row?.["Slack Ready"],
            mode: row?.["Slack Auth Mode"],
            userId: row?.["Slack User ID"],
            teamId: row?.["Slack Team ID"],
            userName: row?.["Slack User Name"],
            email: row?.["Slack Email"],
            avatarUrl: row?.["Slack Avatar URL"],
            statusIcon: row?.["Slack Status Icon"],
            statusIconUrl: row?.["Slack Status Icon URL"],
            statusMessage: row?.["Slack Status Message"],
            directChannelId: row?.["Slack Direct Channel ID"],
            directChannelErrorCode: row?.["Slack Direct Channel Error Code"],
            avatarErrorCode: row?.["Slack Avatar Error Code"],
            avatarError: row?.["Slack Avatar Error"],
            updatedAt: row?.["Slack Updated At"],
          },
          keyMeta: {
            keyVersion: row?.["Slack Key Version"],
            importedAt: row?.["Slack Key Imported At"],
            source: row?.["Slack Key Source"],
            services: ["slacktivation"],
          },
          passTransition: {
            channelId: row?.["Slack pass-transition Channel ID"],
            channelName: row?.["Slack pass-transition Channel Name"],
            syncedAt: row?.["Slack pass-transition Synced At"],
            tokenType: row?.["Slack pass-transition Token Type"],
            members: passTransitionMembers,
            lastError: {
              code: row?.["Slack pass-transition Error Code"],
              message: row?.["Slack pass-transition Error Message"],
            },
          },
        });
        if (record) {
          importedSlacktivationRecord = record;
          importableRowCount += 1;
        }
        return;
      }

      const environmentKey = String(row?.["Environment Key"] || "").trim();
      const programmerId = String(row?.["Media Company ID"] || "").trim();
      if (!environmentKey || !programmerId) {
        return;
      }

      const serviceKey = getVaultServiceKeyFromLabel(row?.Service);
      const environmentLabel = firstNonEmptyString([resolveEnvironmentRecord(environmentKey)?.label, environmentKey]);
      const record = ensureImportedPassVaultRecord(importedRecords, environmentKey, environmentLabel, programmerId, {
        programmerName: programmerId,
        mediaCompanyName: programmerId,
        hydrationStatus: "complete",
      });
      if (!record) {
        return;
      }

      if (rowType !== "pass-service") {
        return;
      }

      if (!serviceKey) {
        return;
      }

      if (serviceKey === "cm") {
        const matchedTenants = parseVaultMatchedTenants(row?.["CM Matched Tenants"] || "");
        mergeImportedPassServiceSummary(record, "cm", {
          available: matchedTenants.length > 0,
          checked: true,
          matchedTenants,
          fetchedAt: matchedTenants.length > 0 ? Date.now() : 0,
        });
        importableRowCount += 1;
        return;
      }

      const guid = firstNonEmptyString([row?.["Registered Application GUID"]]);
      if (!guid) {
        return;
      }

      const requiredScope = VAULT_REQUIRED_SCOPE_BY_SERVICE_KEY[serviceKey];
      const appName = guid;
      const scopes = requiredScope ? [requiredScope] : [];
      const credential = normalizeVaultCredential({
        clientId: row?.["Client ID"],
        clientSecret: row?.["Client Secret"],
        accessToken: row?.["Access Token"],
        tokenExpiresAt: row?.["Token Expires At"],
        serviceScope: requiredScope,
        tokenRequestedScope: requiredScope,
      });
      if (!credential?.clientId || !credential?.clientSecret) {
        return;
      }
      const applicationRecord = getImportedPassApplicationRecord(record, guid, appName);
      if (!applicationRecord) {
        return;
      }

      applicationRecord.appName = firstNonEmptyString([appName, applicationRecord.appName, guid]);
      applicationRecord.scopes = uniqueSorted(
        (Array.isArray(applicationRecord.scopes) ? applicationRecord.scopes : []).concat(scopes)
      );
      applicationRecord.serviceKeys = uniqueSorted(
        (Array.isArray(applicationRecord.serviceKeys) ? applicationRecord.serviceKeys : []).concat(serviceKey)
      );
      if (credential) {
        applicationRecord.serviceCredentialsByServiceKey[serviceKey] = credential;
        if (!applicationRecord.dcrCache) {
          applicationRecord.dcrCache = credential;
        }
      }
      applicationRecord.applicationData = createImportedApplicationData(
        guid,
        applicationRecord.appName,
        applicationRecord.scopes
      );
      applicationRecord.updatedAt = Date.now();
      record.registeredApplicationsByGuid[guid] = applicationRecord;

      mergeImportedPassServiceSummary(record, serviceKey, {
        available: true,
        primaryGuid: guid,
        appGuids: [guid],
        requiredScope,
      });
      importableRowCount += 1;
    });

    if (importableRowCount === 0) {
      throw new Error("The selected file is not a current minimal UnderPAR PASS vault export.");
    }

    Object.values(importedRecords).forEach((environmentRecords) => {
      Object.values(environmentRecords || {}).forEach((record) => {
        if (!record || typeof record !== "object") {
          return;
        }
        record.updatedAt = Date.now();
        if (record.hydrationStatus === "complete" && !record.hydratedAt) {
          record.hydratedAt = Date.now();
        }
      });
    });

    const importedVault = normalizeVaultPayload({
      underpar: {
        globals: {
          savedQueries: importedSavedQueries,
          cmImsByEnvironment: importedCmGlobalsByEnvironment,
          adobeIms: importedImsRuntimeConfig,
          slacktivation: importedSlacktivationRecord,
        },
        app: {
          savedQueries: importedSavedQueries,
        },
      },
      pass: {
        environments: Object.fromEntries(
          Object.entries(importedRecords).map(([environmentKey, mediaCompanies]) => [
            environmentKey,
            {
              key: environmentKey,
              label: resolveEnvironmentRecord(environmentKey)?.label || environmentKey,
              mediaCompanies,
            },
          ])
        ),
      },
    });

    const existingVault = await readStoredVaultPayload();
    const mergedVault = mergeImportedVaultPayload(existingVault, importedVault);
    await persistImportedVaultPayload(mergedVault);
    setVaultStatus("Vault import complete.");
    await ensureVaultSnapshot({ force: true });
  } catch (error) {
    setVaultStatus(error instanceof Error ? error.message : String(error || "Unable to import the selected vault file."));
  } finally {
    panelState.vaultImportBusy = false;
    if (vaultImportButton) {
      vaultImportButton.disabled = false;
    }
    if (vaultExportButton) {
      vaultExportButton.disabled = false;
    }
    if (vaultPurgeButton) {
      vaultPurgeButton.disabled = false;
    }
    if (vaultImportInput) {
      vaultImportInput.value = "";
    }
  }
}

async function sendVaultActionRequest(action = "", detail = {}) {
  if (!chrome?.runtime?.sendMessage) {
    throw new Error("Chrome runtime messaging is unavailable in the UP panel.");
  }
  const response = await chrome.runtime.sendMessage({
    type: UP_DEVTOOLS_VAULT_ACTION_REQUEST_TYPE,
    channel: "up-devtools",
    action: String(action || "").trim(),
    ...(detail && typeof detail === "object" ? detail : {}),
  });
  if (!response || response.ok !== true) {
    throw new Error(String(response?.error || "UnderPAR did not accept the requested VAULT action."));
  }
  return response;
}

async function handleVaultPassActionButtonClick(button) {
  const action = String(button?.dataset?.vaultAction || "").trim();
  const environmentKey = String(button?.dataset?.environmentKey || "").trim();
  const programmerId = String(button?.dataset?.programmerId || "").trim();
  if (!action || !environmentKey) {
    return;
  }
  if (!panelState.controllerReady) {
    setVaultStatus(panelState.controllerStatusMessage || "Open the UnderPAR side panel before using VAULT actions.");
    return;
  }
  if (panelState.vaultActionBusy === true || panelState.vaultImportBusy === true) {
    return;
  }

  const actionStatusMessage =
    action === "rehydrate-environment"
      ? `Re-hydrating every VAULT media-company record in ${resolveEnvironmentRecord(environmentKey)?.label || environmentKey}...`
      : `Re-hydrating ${programmerId} in ${resolveEnvironmentRecord(environmentKey)?.label || environmentKey}...`;
  panelState.vaultActionBusy = true;
  panelState.vaultActionContext = buildVaultActionContext(action, environmentKey, programmerId, actionStatusMessage);
  let actionCompleted = false;
  const optimisticSnapshot = buildOptimisticVaultSnapshotForAction(
    panelState.vaultSnapshot,
    action,
    environmentKey,
    programmerId
  );
  if (optimisticSnapshot) {
    panelState.vaultSnapshot = optimisticSnapshot;
    panelState.vaultDirty = true;
    if (isVaultExpanded()) {
      renderVaultSnapshot(optimisticSnapshot, {
        keepDirty: false,
      });
    }
  }
  syncVaultIdleState(actionStatusMessage);

  try {
    const response = await sendVaultActionRequest(action, {
      environmentKey,
      programmerId,
    });
    let bestSnapshot = null;
    const responseSnapshot = applyVaultActionResponseToSnapshot(
      panelState.vaultSnapshot,
      action,
      response,
      environmentKey,
      programmerId
    );
    if (responseSnapshot) {
      panelState.vaultSnapshot = responseSnapshot;
      panelState.vaultDirty = false;
      if (isVaultActionSnapshotSettled(responseSnapshot, action, environmentKey, programmerId)) {
        bestSnapshot = responseSnapshot;
      }
      if (isVaultExpanded()) {
        renderVaultSnapshot(responseSnapshot, {
          keepDirty: false,
        });
      }
    }
    if (!bestSnapshot) {
      const waitedSnapshot = await waitForVaultActionSnapshot(action, environmentKey, programmerId);
      if (waitedSnapshot && isVaultActionSnapshotSettled(waitedSnapshot, action, environmentKey, programmerId)) {
        bestSnapshot = waitedSnapshot;
      }
    }
    const refreshedSnapshot = await ensureVaultSnapshot({
      force: true,
      allowWhileCollapsed: true,
    });
    if (refreshedSnapshot && isVaultActionSnapshotSettled(refreshedSnapshot, action, environmentKey, programmerId)) {
      bestSnapshot = refreshedSnapshot;
    } else if (!bestSnapshot && refreshedSnapshot) {
      bestSnapshot = refreshedSnapshot;
    }
    if (bestSnapshot) {
      panelState.vaultSnapshot = bestSnapshot;
      panelState.vaultDirty = false;
      if (isVaultExpanded()) {
        renderVaultSnapshot(bestSnapshot, {
          keepDirty: false,
        });
      }
    }
    actionCompleted = true;
    if (!isVaultExpanded()) {
      syncVaultIdleState(String(response?.message || "VAULT updated. Reopen VAULT to inspect the latest snapshot."));
    }
  } catch (error) {
    setVaultStatus(error instanceof Error ? error.message : String(error || "Unable to re-hydrate the requested VAULT record."));
  } finally {
    panelState.vaultActionBusy = false;
    panelState.vaultActionContext = null;
    if (isVaultExpanded() && panelState.vaultSnapshot) {
      renderVaultSnapshot(panelState.vaultSnapshot, {
        keepDirty: actionCompleted ? false : panelState.vaultDirty === true,
      });
    } else {
      syncVaultIdleState();
    }
  }
}

async function handleVaultPurgeButtonClick() {
  if (!panelState.controllerReady) {
    setVaultStatus(panelState.controllerStatusMessage || "Open the UnderPAR side panel before using VAULT actions.");
    return;
  }
  if (panelState.vaultActionBusy === true || panelState.vaultImportBusy === true) {
    return;
  }

  panelState.vaultActionBusy = true;
  let actionCompleted = false;
  syncVaultIdleState("Exporting current VAULT, then purging all persisted PASS and saved-query state...");

  try {
    const vaultPayload = await readStoredVaultPayload();
    const exportResult = downloadVaultExportFile(vaultPayload, {
      allowEmpty: true,
      filePrefix: "underpar-vault-backup",
    });
    const response = await sendVaultActionRequest("purge-vault", {});
    const responseSnapshot = applyVaultActionResponseToSnapshot(panelState.vaultSnapshot, "purge-vault", response);
    if (responseSnapshot && isVaultExpanded()) {
      panelState.vaultDirty = false;
      renderVaultSnapshot(responseSnapshot, {
        keepDirty: false,
      });
    }
    const refreshedSnapshot = await ensureVaultSnapshot({
      force: true,
      allowWhileCollapsed: true,
    });
    if (refreshedSnapshot && isVaultExpanded()) {
      panelState.vaultDirty = false;
      renderVaultSnapshot(refreshedSnapshot, {
        keepDirty: false,
      });
    }
    actionCompleted = true;
    const exportedPrefix =
      exportResult.rowCount > 0
        ? `Exported ${exportResult.rowCount} vault rows, then purged UnderPAR vault state.`
        : "No exportable vault rows were present; UnderPAR vault state was purged.";
    if (!isVaultExpanded()) {
      syncVaultIdleState(String(response?.message || exportedPrefix));
    } else {
      setVaultStatus(String(response?.message || exportedPrefix));
    }
  } catch (error) {
    setVaultStatus(error instanceof Error ? error.message : String(error || "Unable to purge the current VAULT."));
  } finally {
    panelState.vaultActionBusy = false;
    if (isVaultExpanded() && panelState.vaultSnapshot) {
      renderVaultSnapshot(panelState.vaultSnapshot, {
        keepDirty: actionCompleted ? false : panelState.vaultDirty === true,
      });
    } else {
      syncVaultIdleState();
    }
  }
}

function buildVaultAreaMarkup(areaSnapshot) {
  const area = areaSnapshot && typeof areaSnapshot === "object" ? areaSnapshot : {};
  const entryMarkup = area.errorMessage
    ? `<p class="vault-area-error">${escapeHtml(area.errorMessage)}</p>`
    : area.keyCount > 0
      ? `
        <div class="vault-entry-list">
          ${area.entries
            .map(
              (entry) => `
                <article
                  class="vault-entry-card"
                  id="${escapeHtml(getVaultEntryAnchorId(area?.areaId || area?.label || "area", entry?.entryIndex))}"
                >
                  <div class="vault-entry-head">
                    <code class="vault-entry-key">${escapeHtml(entry.key)}</code>
                    <span class="vault-entry-size">${escapeHtml(formatBytes(entry.bytes))}</span>
                  </div>
                  <pre class="vault-entry-preview">${escapeHtml(entry.preview)}</pre>
                </article>
              `
            )
            .join("")}
        </div>
      `
      : '<p class="vault-area-empty">No keys stored in this area.</p>';

  const rawMarkup = area.errorMessage
    ? ""
    : `
      <details class="vault-raw-dump">
        <summary>Raw JSON</summary>
        <pre class="vault-raw-json">${escapeHtml(area.rawJson)}</pre>
      </details>
    `;

  return `
    <article class="vault-area-card" id="${escapeHtml(getVaultAreaAnchorId(area?.areaId || area?.label || "area"))}">
      <header class="vault-area-head">
        <div>
          <h3 class="vault-area-title">${escapeHtml(area.label || area.areaId || "Storage Area")}</h3>
          <p class="vault-area-meta">${escapeHtml(formatVaultKeyCount(area.keyCount || 0))} | ${escapeHtml(
            formatBytes(area.byteCount || 0)
          )}</p>
        </div>
        <span class="vault-area-badge">${escapeHtml(formatVaultKeyCount(area.keyCount || 0))}</span>
      </header>
      ${entryMarkup}
      ${rawMarkup}
    </article>
  `;
}

function formatSlacktivationModeLabel(mode = "") {
  const normalized = String(mode || "").trim().toLowerCase();
  if (normalized === "openid") {
    return "Slack OpenID";
  }
  if (normalized === "api") {
    return "Slack API";
  }
  return "Slack";
}

function buildVaultSlacktivatePassTransitionMemberLabel(member = null) {
  return firstNonEmptyString([
    member?.userName,
    member?.realName,
    member?.email,
    member?.userId,
  ]);
}

function buildVaultSlacktivatePassTransitionMarkup(record = null) {
  const passTransition = normalizeVaultSlacktivationPassTransition(record?.passTransition || null);
  if (!passTransition) {
    return "";
  }
  const activeMembers = (Array.isArray(passTransition.members) ? passTransition.members : []).filter(
    (member) => member?.deleted !== true && member?.bot !== true
  );
  const syncedAtLabel = passTransition.syncedAt ? formatVaultTimestamp(passTransition.syncedAt) : "Not synced yet";
  const tokenTypeLabel = passTransition.tokenType
    ? `${passTransition.tokenType === "bot" ? "Bot" : "User"} token`
    : "Token unknown";
  const errorMarkup = passTransition.lastError?.message
    ? `<p class="vault-slacktivate-inline-status" data-tone="error">${escapeHtml(passTransition.lastError.message)}</p>`
    : "";
  const listMarkup = activeMembers.length
    ? `
      <ul class="vault-slacktivate-roster-list">
        ${activeMembers
          .map((member) => {
            const label = buildVaultSlacktivatePassTransitionMemberLabel(member);
            return `
              <li class="vault-slacktivate-roster-item">
                <span class="vault-slacktivate-roster-name">${escapeHtml(label)}</span>
                <span class="vault-slacktivate-roster-id">${escapeHtml(member.userId || "")}</span>
              </li>
            `;
          })
          .join("")}
      </ul>
    `
    : '<p class="vault-slacktivate-inline-status">No pass-transition members are cached yet.</p>';
  return `
    <section class="vault-slacktivate-roster">
      <div class="vault-slacktivate-roster-head">
        <div>
          <p class="vault-slacktivate-roster-title">${escapeHtml(
            `${passTransition.channelName || UNDERPAR_PASS_TRANSITION_CHANNEL_NAME} member list`
          )}</p>
          <p class="vault-slacktivate-roster-meta">
            ${escapeHtml(`${activeMembers.length} member${activeMembers.length === 1 ? "" : "s"} | ${tokenTypeLabel} | Synced ${syncedAtLabel}`)}
          </p>
        </div>
        <span class="vault-slacktivate-roster-badge">${escapeHtml(String(activeMembers.length))}</span>
      </div>
      ${errorMarkup}
      ${listMarkup}
    </section>
  `;
}

function isVaultSlacktivateActionBusy() {
  return panelState.vaultActionBusy === true && String(panelState.vaultActionContext?.action || "").startsWith("slacktivate");
}

function hasVaultExportableData(vaultPayload = null, snapshot = null) {
  const passRecordCount = Number(snapshot?.passVaultSummary?.mediaCompanyCount || 0);
  const savedQueryCount = Number(snapshot?.savedQueryCount || 0);
  const slacktivationRecord = getVaultSlacktivationRecord(vaultPayload || snapshot?.vaultPayload || null);
  const imsRuntimeConfig = getVaultImsRuntimeConfig(vaultPayload || snapshot?.vaultPayload || null);
  return passRecordCount > 0 || savedQueryCount > 0 || Boolean(slacktivationRecord) || Boolean(imsRuntimeConfig?.clientId);
}

function buildVaultSlacktivatePendingMarkup(record = null) {
  const normalizedRecord = normalizeVaultSlacktivationRecord(record);
  const lastError = normalizedRecord?.lastError || null;
  const actionBusy = isVaultSlacktivateActionBusy();
  const disabled = actionBusy ? "disabled" : "";
  const processingClass = actionBusy ? " is-processing" : "";
  const dropActionLabel = actionBusy ? "SLACKTIVATING ZIP.KEY…" : "DROP ZIP.KEY TO SLACKTIVATE";
  const statusMarkup = lastError?.message
    ? `<p class="vault-slacktivate-inline-status" data-tone="error">${escapeHtml(lastError.message)}</p>`
    : "";
  return `
    <div class="vault-slacktivate-state" data-state="pending">
      <section class="zip-config-gate underpar-slacktivate-gate" aria-live="polite">
        <h2 class="zip-config-gate-title">Please drop ZIP.KEY to SLACKTIVATE</h2>
        <p class="zip-config-gate-message">Drag and drop your ZIP.KEY file onto the target below.</p>
        <button
          type="button"
          class="zip-config-dropzone spectrum-Button spectrum-Button--outline spectrum-Button--sizeM${processingClass}"
          data-slacktivate-trigger="file"
          data-slacktivate-dropzone="true"
          ${disabled}
        >
          <span class="spectrum-Button-label">${escapeHtml(dropActionLabel)}</span>
        </button>
        <p class="zip-config-gate-meta hidden"></p>
      </section>
      ${statusMarkup}
    </div>
  `;
}

function buildVaultSlacktivateReadyMarkup(record = null) {
  const normalizedRecord = normalizeVaultSlacktivationRecord(record);
  const identity = normalizedRecord?.identity || null;
  const statusText = normalizeSlacktivationText(identity?.statusMessage || "", 160) || "No custom Slack profile status set.";
  const directChannelLabel = identity?.directChannelId ? identity.directChannelId : "Pending";
  const keyImportedAt = normalizeSlacktivationText(normalizedRecord?.keyMeta?.importedAt || "", 80) || "Unknown";
  const updatedAt = Math.max(0, Number(identity?.updatedAt || normalizedRecord?.updatedAt || 0));
  const disabled = isVaultSlacktivateActionBusy() ? "disabled" : "";
  const rosterMarkup = buildVaultSlacktivatePassTransitionMarkup(normalizedRecord);
  return `
    <div class="vault-slacktivate-state" data-state="ready">
      <article class="vault-slacktivate-confirmation">
        <div class="vault-slacktivate-confirmation-head">
          <div>
            <p class="vault-slacktivate-eyebrow">SLACKTIVATED</p>
            <h3 class="vault-slacktivate-title">${escapeHtml(
              firstNonEmptyString([identity?.userName, identity?.userId, "Slack identity verified"])
            )}</h3>
            <p class="vault-slacktivate-meta">
              ${escapeHtml(formatSlacktivationModeLabel(identity?.mode || ""))} verified against
              ${escapeHtml(normalizedRecord?.workspaceOrigin || SLACKTIVATION_WORKSPACE_ORIGIN)}.
            </p>
          </div>
          <div class="vault-slacktivate-actions">
            <button
              type="button"
              class="vault-slacktivate-action-btn"
              data-slacktivate-action="refresh"
              ${disabled}
            >RE-SLACKTIVATE</button>
            <button
              type="button"
              class="vault-slacktivate-action-btn"
              data-slacktivate-trigger="file"
              ${disabled}
            >LOAD NEW ZIP.KEY</button>
          </div>
        </div>
        <p class="vault-slacktivate-statusline">
          <strong>${escapeHtml(identity?.statusIcon || "Status")}</strong> ${escapeHtml(statusText)}
        </p>
        <dl class="vault-slacktivate-details">
          <div class="vault-slacktivate-detail">
            <dt>Team</dt>
            <dd>${escapeHtml(firstNonEmptyString([identity?.teamId, "Unknown"]))}</dd>
          </div>
          <div class="vault-slacktivate-detail">
            <dt>Direct Channel</dt>
            <dd>${escapeHtml(directChannelLabel)}</dd>
          </div>
          <div class="vault-slacktivate-detail">
            <dt>Key Imported</dt>
            <dd>${escapeHtml(keyImportedAt)}</dd>
          </div>
          <div class="vault-slacktivate-detail">
            <dt>Verified</dt>
            <dd>${escapeHtml(formatVaultTimestamp(updatedAt))}</dd>
          </div>
        </dl>
        ${rosterMarkup}
        <p class="vault-slacktivate-footnote">
          Shift-click on any workspace :blondiebtn: uses this cached pass-transition roster to target a teammate.
        </p>
      </article>
    </div>
  `;
}

function renderVaultSlacktivation(vaultPayload = null) {
  if (!vaultSlacktivateContent) {
    return;
  }
  const record = getVaultSlacktivationRecord(vaultPayload);
  const actionBusy = isVaultSlacktivateActionBusy();
  vaultSlacktivateContent.dataset.dropActive = "false";
  vaultSlacktivateContent.dataset.state = record?.ready === true ? "ready" : "pending";
  if (vaultSlacktivateBadge) {
    vaultSlacktivateBadge.textContent = actionBusy ? "Working" : record?.ready === true ? "Ready" : "Pending";
  }
  vaultSlacktivateContent.innerHTML =
    record?.ready === true ? buildVaultSlacktivateReadyMarkup(record) : buildVaultSlacktivatePendingMarkup(record);
}

async function performVaultSlacktivateAction(action = "", detail = {}, messages = {}) {
  const normalizedAction = String(action || "").trim();
  if (!normalizedAction) {
    return;
  }
  if (!panelState.controllerReady) {
    setVaultStatus(panelState.controllerStatusMessage || "Open the UnderPAR side panel before using VAULT actions.");
    return;
  }
  if (panelState.vaultActionBusy === true || panelState.vaultImportBusy === true) {
    return;
  }

  const startMessage = String(messages?.start || "Refreshing Slacktivation state...").trim();
  panelState.vaultActionBusy = true;
  panelState.vaultActionContext = buildVaultActionContext(normalizedAction, "", "", startMessage);
  renderVaultSlacktivation(panelState.vaultSnapshot?.vaultPayload || null);
  syncVaultIdleState(startMessage);
  let actionCompleted = false;
  let finalStatusMessage = "";

  try {
    const response = await sendVaultActionRequest(normalizedAction, detail);
    const responseSnapshot = applyVaultActionResponseToSnapshot(panelState.vaultSnapshot, normalizedAction, response);
    if (responseSnapshot) {
      panelState.vaultSnapshot = responseSnapshot;
      panelState.vaultDirty = false;
      if (isVaultExpanded()) {
        renderVaultSnapshot(responseSnapshot, {
          keepDirty: false,
        });
      }
    }
    const refreshedSnapshot = await ensureVaultSnapshot({
      force: true,
      allowWhileCollapsed: true,
    });
    if (refreshedSnapshot) {
      panelState.vaultSnapshot = refreshedSnapshot;
      panelState.vaultDirty = false;
      if (isVaultExpanded()) {
        renderVaultSnapshot(refreshedSnapshot, {
          keepDirty: false,
        });
      }
    }
    actionCompleted = true;
    finalStatusMessage = String(response?.message || messages?.success || "Slacktivation updated.");
    setVaultStatus(finalStatusMessage);
  } catch (error) {
    finalStatusMessage = error instanceof Error ? error.message : String(error || messages?.error || "Unable to Slacktivate UnderPAR.");
    setVaultStatus(finalStatusMessage);
    try {
      const refreshedSnapshot = await ensureVaultSnapshot({
        force: true,
        allowWhileCollapsed: true,
      });
      if (refreshedSnapshot) {
        panelState.vaultSnapshot = refreshedSnapshot;
        panelState.vaultDirty = false;
        if (isVaultExpanded()) {
          renderVaultSnapshot(refreshedSnapshot, {
            keepDirty: false,
          });
        }
      }
    } catch {
      // Ignore follow-up refresh errors after a failed Slacktivation attempt.
    }
  } finally {
    panelState.vaultActionBusy = false;
    panelState.vaultActionContext = null;
    renderVaultSlacktivation(panelState.vaultSnapshot?.vaultPayload || null);
    if (isVaultExpanded() && panelState.vaultSnapshot) {
      renderVaultSnapshot(panelState.vaultSnapshot, {
        keepDirty: actionCompleted ? false : panelState.vaultDirty === true,
      });
    } else {
      syncVaultIdleState();
    }
    if (finalStatusMessage) {
      setVaultStatus(finalStatusMessage);
    }
  }
}

async function handleVaultSlacktivateFile(file = null) {
  const selectedFile = file && typeof file === "object" ? file : null;
  if (!selectedFile || typeof selectedFile.text !== "function") {
    return;
  }
  const zipKeyText = String(await selectedFile.text() || "").trim();
  if (!zipKeyText) {
    setVaultStatus("The selected ZIP.KEY file is empty.");
    return;
  }
  await performVaultSlacktivateAction(
    "slacktivate-import-key",
    { zipKeyText },
    {
      start: "SLACKTIVATING ZIP.KEY for UnderPAR...",
      success: "UnderPAR is SLACKTIVATED.",
      error: "Unable to Slacktivate UnderPAR from the selected ZIP.KEY.",
    }
  );
}

async function handleVaultSlacktivateRefreshButtonClick() {
  await performVaultSlacktivateAction(
    "slacktivate-refresh",
    { interactive: true },
    {
      start: "Refreshing stored Slacktivation credentials...",
      success: "UnderPAR Slacktivation refreshed.",
      error: "Unable to refresh stored Slacktivation credentials.",
    }
  );
}

function renderVaultSnapshot(snapshot, options = {}) {
  const normalizedSnapshot = snapshot && typeof snapshot === "object" ? snapshot : null;
  const keepDirty = options?.keepDirty === true;
  panelState.vaultSnapshot = normalizedSnapshot;
  panelState.vaultDirty = keepDirty;

  if (!normalizedSnapshot) {
    if (vaultBadge) {
      vaultBadge.textContent = keepDirty ? "Pending" : "Empty";
    }
    setVaultStatus(
      keepDirty
        ? "VAULT changed during capture. Close and reopen VAULT to repopulate the latest UnderPAR storage snapshot."
        : "No UnderPAR storage data is available."
    );
    if (vaultSummary) {
      vaultSummary.innerHTML = "";
    }
    if (vaultPassSummary) {
      vaultPassSummary.innerHTML = "";
    }
    if (vaultPassRecords) {
      vaultPassRecords.innerHTML = "";
    }
    if (vaultSections) {
      vaultSections.innerHTML = "";
    }
    renderVaultSlacktivation(null);
    if (vaultExportButton) {
      vaultExportButton.disabled = panelState.vaultActionBusy === true;
    }
    if (vaultImportButton) {
      vaultImportButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
    }
    if (vaultPurgeButton) {
      vaultPurgeButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
    }
    return;
  }

  if (vaultBadge) {
    vaultBadge.textContent = keepDirty ? "Stale" : formatVaultKeyCount(normalizedSnapshot.totalKeyCount || 0);
  }
  if (keepDirty) {
    setVaultStatus("VAULT changed during capture. Close and reopen VAULT to repopulate the latest UnderPAR storage snapshot.");
  } else {
    setVaultStatus(
      `Snapshot from ${formatVaultTimestamp(normalizedSnapshot.collectedAt)} | ${formatBytes(
        normalizedSnapshot.totalByteCount || 0
      )} across ${Number(normalizedSnapshot.areaSnapshots?.length || 0)} storage areas.`
    );
  }
  const namespaceAnchorMap = buildVaultNamespaceAnchorMap(normalizedSnapshot.areaSnapshots || []);
  if (vaultSummary) {
    vaultSummary.innerHTML = buildVaultSummaryMarkup(normalizedSnapshot, namespaceAnchorMap);
  }
  if (vaultPassSummary) {
    vaultPassSummary.innerHTML = buildVaultPassSummaryMarkup(normalizedSnapshot.passVaultSummary || null);
  }
  if (vaultPassRecords) {
    vaultPassRecords.innerHTML = buildVaultPassRecordsMarkup(normalizedSnapshot.passVaultSummary || null);
  }
  if (vaultSections) {
    vaultSections.innerHTML = (Array.isArray(normalizedSnapshot.areaSnapshots) ? normalizedSnapshot.areaSnapshots : [])
      .map((areaSnapshot) => buildVaultAreaMarkup(areaSnapshot))
      .join("");
  }
  renderVaultSlacktivation(normalizedSnapshot.vaultPayload || null);
  if (vaultExportButton) {
    vaultExportButton.disabled = panelState.vaultActionBusy === true || !hasVaultExportableData(normalizedSnapshot.vaultPayload, normalizedSnapshot);
  }
  if (vaultImportButton) {
    vaultImportButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
  if (panelState.vaultActionBusy === true && panelState.vaultActionContext?.message) {
    if (vaultBadge) {
      vaultBadge.textContent = "Working";
    }
    setVaultStatus(panelState.vaultActionContext.message);
  }
}

function renderVaultErrorState(error) {
  panelState.vaultDirty = true;
  if (vaultBadge) {
    vaultBadge.textContent = "Error";
  }
  setVaultStatus(error instanceof Error ? error.message : String(error || "Unable to inspect UnderPAR storage."));
  if (vaultSummary) {
    vaultSummary.innerHTML = "";
  }
  if (vaultPassSummary) {
    vaultPassSummary.innerHTML = "";
  }
  if (vaultPassRecords) {
    vaultPassRecords.innerHTML = "";
  }
  if (vaultSections) {
    vaultSections.innerHTML = "";
  }
  renderVaultSlacktivation(panelState.vaultSnapshot?.vaultPayload || null);
  if (vaultExportButton) {
    vaultExportButton.disabled = panelState.vaultActionBusy === true;
  }
  if (vaultImportButton) {
    vaultImportButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.disabled = panelState.vaultImportBusy === true || panelState.vaultActionBusy === true;
  }
}

function flashVaultNavigationTarget(target = null) {
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.__underparVaultNavFlashTimerId) {
    window.clearTimeout(target.__underparVaultNavFlashTimerId);
    target.__underparVaultNavFlashTimerId = 0;
  }
  target.classList.remove("vault-nav-flash");
  void target.offsetWidth;
  target.classList.add("vault-nav-flash");
  target.__underparVaultNavFlashTimerId = window.setTimeout(() => {
    target.classList.remove("vault-nav-flash");
    target.__underparVaultNavFlashTimerId = 0;
  }, 1600);
}

function navigateToVaultTarget(targetId = "") {
  const normalizedTargetId = String(targetId || "").trim();
  if (!normalizedTargetId) {
    return false;
  }
  const target = document.getElementById(normalizedTargetId);
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
  flashVaultNavigationTarget(target);
  return true;
}

function handleVaultSummaryNavigation(event) {
  const link = event.target instanceof Element ? event.target.closest("[data-vault-nav-target]") : null;
  if (!(link instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const targetId = String(link.dataset.vaultNavTarget || "").trim();
  if (!targetId) {
    return;
  }
  if (navigateToVaultTarget(targetId)) {
    event.preventDefault();
  }
}

async function ensureVaultSnapshot(options = {}) {
  const forceRefresh = options.force === true;
  const allowWhileCollapsed = options.allowWhileCollapsed === true;
  if (!allowWhileCollapsed && !isVaultExpanded()) {
    syncVaultIdleState();
    return panelState.vaultSnapshot;
  }
  if (!forceRefresh && panelState.vaultSnapshot && panelState.vaultDirty !== true) {
    renderVaultSnapshot(panelState.vaultSnapshot);
    return panelState.vaultSnapshot;
  }
  if (panelState.vaultLoadPromise) {
    return panelState.vaultLoadPromise;
  }

  renderVaultBusyState(forceRefresh ? "Refreshing UnderPAR storage surfaces..." : "Reading UnderPAR storage surfaces...");
  const loadMutationVersion = Number(panelState.vaultMutationVersion || 0);
  const loadPromise = collectVaultSnapshot()
    .then((snapshot) => {
      renderVaultSnapshot(snapshot, {
        keepDirty: Number(panelState.vaultMutationVersion || 0) !== loadMutationVersion,
      });
      return snapshot;
    })
    .catch((error) => {
      renderVaultErrorState(error);
      return null;
    })
    .finally(() => {
      if (panelState.vaultLoadPromise === loadPromise) {
        panelState.vaultLoadPromise = null;
      }
    });

  panelState.vaultLoadPromise = loadPromise;
  return loadPromise;
}

function markVaultDirty(message = "") {
  panelState.vaultMutationVersion = Number(panelState.vaultMutationVersion || 0) + 1;
  panelState.vaultDirty = true;
  clearVaultRefreshTimer();
  syncVaultIdleState(message);
}

function bindVaultRealtimeListeners() {
  if (panelState.vaultStorageListenersBound) {
    return;
  }

  if (chrome?.storage?.onChanged?.addListener) {
    chrome.storage.onChanged.addListener(() => {
      markVaultDirty();
    });
  }
  window.addEventListener("storage", () => {
    markVaultDirty();
  });
  panelState.vaultStorageListenersBound = true;
}

function setCollapsibleExpanded(toggleButton, panelElement, expanded) {
  if (!toggleButton || !panelElement) {
    return;
  }
  const isExpanded = Boolean(expanded);
  toggleButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  panelElement.hidden = !isExpanded;
}

function wireCollapsibleSection(toggleButton, panelElement, initiallyExpanded = true) {
  if (!toggleButton || !panelElement) {
    return;
  }
  setCollapsibleExpanded(toggleButton, panelElement, initiallyExpanded);
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") !== "false";
    setCollapsibleExpanded(toggleButton, panelElement, !isExpanded);
  });
}

function renderEnvironmentDetails(environment) {
  const env = environment && typeof environment === "object"
    ? environment
    : getEnvironmentRegistry()?.getDefaultEnvironment?.();
  if (!env) {
    return;
  }

  if (shellUrlEl) {
    shellUrlEl.textContent = env.consoleShellUrl || "";
  }
  if (consoleBaseEl) {
    consoleBaseEl.textContent = env.consoleBase || "";
  }
  if (cmConsoleUrlEl) {
    cmConsoleUrlEl.textContent = env.cmConsoleShellUrl || "";
  }
  if (mgmtBaseEl) {
    mgmtBaseEl.textContent = env.mgmtBase || "";
  }
  if (spBaseEl) {
    spBaseEl.textContent = env.spBase || "";
  }
  if (dcrRegisterUrlEl) {
    dcrRegisterUrlEl.textContent = env.dcrRegisterUrl || "";
  }
  if (dcrTokenUrlEl) {
    dcrTokenUrlEl.textContent = env.dcrTokenUrl || "";
  }
  if (restV2BaseEl) {
    restV2BaseEl.textContent = env.restV2Base || "";
  }
  if (esmBaseEl) {
    esmBaseEl.textContent = env.esmBase || "";
  }
  if (degradationBaseEl) {
    degradationBaseEl.textContent = env.degradationBase || "";
  }
}

async function loadSelectedEnvironment() {
  const registry = getEnvironmentRegistry();
  const environments = Array.isArray(registry?.listEnvironments?.()) ? registry.listEnvironments() : fallbackRegistry.listEnvironments();
  const currentEnvironment = registry?.getStoredEnvironment
    ? await registry.getStoredEnvironment()
    : await fallbackRegistry.getStoredEnvironment();
  environmentSelect.innerHTML = environments
    .map((environment) => {
      const selected = environment.key === currentEnvironment.key ? ' selected' : "";
      return `<option value="${environment.key}"${selected}>${environment.label}</option>`;
    })
    .join("");
  renderEnvironmentDetails(currentEnvironment);
  panelState.environmentsLoaded = true;
  syncInteractiveControlState();
}

async function handleEnvironmentSelectionChange() {
  const registry = getEnvironmentRegistry();
  if (!registry) {
    return;
  }
  const selectedEnvironment = registry.getEnvironment(environmentSelect.value);
  renderEnvironmentDetails(selectedEnvironment);
}

async function handleSwitch() {
  const registry = getEnvironmentRegistry();
  if (!registry) {
    return;
  }

  panelState.switchBusy = true;
  syncInteractiveControlState();
  try {
    const currentEnvironment = registry?.getStoredEnvironment
      ? await registry.getStoredEnvironment()
      : await fallbackRegistry.getStoredEnvironment();
    if (normalizeEnvironmentKey(currentEnvironment?.key) === normalizeEnvironmentKey(environmentSelect.value)) {
      renderEnvironmentDetails(currentEnvironment);
      return;
    }
    await registry.setStoredEnvironment(environmentSelect.value);
    await loadSelectedEnvironment();
  } catch (_error) {
  } finally {
    panelState.switchBusy = false;
    syncInteractiveControlState();
  }
}

function setVaultSlacktivateDropActive(active) {
  if (vaultSlacktivateContent) {
    vaultSlacktivateContent.dataset.dropActive = active ? "true" : "false";
    const dropzone = vaultSlacktivateContent.querySelector("[data-slacktivate-dropzone]");
    if (dropzone) {
      dropzone.classList.toggle("is-dragover", active === true);
    }
  }
}

function getDroppedVaultSlacktivateFile(dataTransfer = null) {
  if (!dataTransfer) {
    return null;
  }
  const files = dataTransfer.files;
  return files && files.length > 0 ? files[0] : null;
}

function init() {
  renderControllerStatus({
    ready: false,
    status: "bootstrapping",
    message: "Waiting for UnderPAR side panel status...",
  });
  syncInteractiveControlState();
  connectControllerStatusPort();
  wireCollapsibleSection(environmentUrlsToggle, environmentUrlsPanel, false);
  wireCollapsibleSection(vaultToggle, vaultPanel, false);
  wireCollapsibleSection(vaultSlacktivateToggle, vaultSlacktivatePanel, false);
  bindVaultRealtimeListeners();
  syncVaultIdleState();
  renderVaultSlacktivation(null);
  if (vaultToggle) {
    vaultToggle.addEventListener("click", () => {
      if (vaultToggle.getAttribute("aria-expanded") === "true") {
        void ensureVaultSnapshot({ force: true });
      } else {
        syncVaultIdleState();
      }
    });
  }
  if (vaultSummary) {
    vaultSummary.addEventListener("click", handleVaultSummaryNavigation);
  }
  if (vaultExportButton) {
    vaultExportButton.addEventListener("click", () => {
      void handleVaultExport();
    });
  }
  if (vaultImportButton) {
    vaultImportButton.addEventListener("click", () => {
      if (vaultImportInput && panelState.vaultImportBusy !== true) {
        vaultImportInput.click();
      }
    });
  }
  if (vaultPurgeButton) {
    vaultPurgeButton.addEventListener("click", () => {
      void handleVaultPurgeButtonClick();
    });
  }
  if (vaultImportInput) {
    vaultImportInput.addEventListener("change", () => {
      const selectedFile = vaultImportInput.files?.[0] || null;
      if (selectedFile) {
        void handleVaultImportFile(selectedFile);
      }
    });
  }
  if (vaultPassRecords) {
    vaultPassRecords.addEventListener("click", (event) => {
      const actionButton = event.target instanceof Element ? event.target.closest("[data-vault-action]") : null;
      if (!actionButton) {
        return;
      }
      event.preventDefault();
      void handleVaultPassActionButtonClick(actionButton);
    });
  }
  if (vaultSlacktivateContent) {
    vaultSlacktivateContent.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element ? event.target.closest("[data-slacktivate-trigger]") : null;
      if (trigger) {
        event.preventDefault();
        if (vaultSlacktivateInput && !isVaultSlacktivateActionBusy()) {
          vaultSlacktivateInput.click();
        }
        return;
      }
      const actionButton = event.target instanceof Element ? event.target.closest("[data-slacktivate-action]") : null;
      if (!actionButton) {
        return;
      }
      event.preventDefault();
      if (String(actionButton.getAttribute("data-slacktivate-action") || "") === "refresh") {
        void handleVaultSlacktivateRefreshButtonClick();
      }
    });
    vaultSlacktivateContent.addEventListener("dragenter", (event) => {
      const hasDropzone = event.target instanceof Element && event.target.closest("[data-slacktivate-dropzone]");
      if (!hasDropzone) {
        return;
      }
      event.preventDefault();
      panelState.vaultSlacktivateDragDepth += 1;
      setVaultSlacktivateDropActive(true);
    });
    vaultSlacktivateContent.addEventListener("dragover", (event) => {
      const hasDropzone = vaultSlacktivateContent.querySelector("[data-slacktivate-dropzone]");
      if (!hasDropzone) {
        return;
      }
      event.preventDefault();
      setVaultSlacktivateDropActive(true);
    });
    vaultSlacktivateContent.addEventListener("dragleave", (event) => {
      const hasDropzone = event.target instanceof Element && event.target.closest("[data-slacktivate-dropzone]");
      if (!hasDropzone) {
        return;
      }
      event.preventDefault();
      panelState.vaultSlacktivateDragDepth = Math.max(0, Number(panelState.vaultSlacktivateDragDepth || 0) - 1);
      if (panelState.vaultSlacktivateDragDepth === 0) {
        setVaultSlacktivateDropActive(false);
      }
    });
    vaultSlacktivateContent.addEventListener("drop", (event) => {
      const hasDropzone = vaultSlacktivateContent.querySelector("[data-slacktivate-dropzone]");
      if (!hasDropzone) {
        return;
      }
      event.preventDefault();
      panelState.vaultSlacktivateDragDepth = 0;
      setVaultSlacktivateDropActive(false);
      const file = getDroppedVaultSlacktivateFile(event.dataTransfer || null);
      if (file) {
        void handleVaultSlacktivateFile(file);
      }
    });
  }
  if (vaultSlacktivateInput) {
    vaultSlacktivateInput.addEventListener("change", () => {
      const selectedFile = vaultSlacktivateInput.files?.[0] || null;
      if (selectedFile) {
        void handleVaultSlacktivateFile(selectedFile).finally(() => {
          vaultSlacktivateInput.value = "";
        });
      }
    });
  }
  environmentSelect.addEventListener("change", () => {
    void handleEnvironmentSelectionChange();
  });
  switchButton.addEventListener("click", () => {
    void handleSwitch();
  });
  void loadSelectedEnvironment().catch(() => {
    panelState.environmentsLoaded = false;
    syncInteractiveControlState();
  });
  window.addEventListener(
    "pagehide",
    () => {
      clearStatusPortReconnectTimer();
      clearVaultRefreshTimer();
      const existingPort = panelState.statusPort;
      panelState.statusPort = null;
      if (existingPort) {
        try {
          existingPort.disconnect();
        } catch {
          // Ignore disconnect failures on shutdown.
        }
      }
    },
    { once: true }
  );
}

init();
