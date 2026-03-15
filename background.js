const BUILD_INFO_KEY = "underpar_build_info";
const LEGACY_BUILD_INFO_KEY = "mincloudlogin_build_info";
const AVATAR_MAX_DATAURL_BYTES = 6000000;
const IMS_CLIENT_ID = "adobeExperienceCloudDebugger";
const IMS_BASE_URL = "https://ims-na1.adobelogin.com";
const PPS_PROFILE_BASE_URL = "https://pps.services.adobe.com";
const IMS_AVATAR_CLIENT_IDS = ["AdobePass1", IMS_CLIENT_ID];
const IMS_LOGIN_HELPER_PATH = "src/login/login.html";
const IMS_LOGIN_REDIRECT_RULE_ID = 164001;
const UNDERPAR_ESM_DEEPLINK_REDIRECT_RULE_ID = 164002;
const UNDERPAR_DEGRADATION_DEEPLINK_REDIRECT_RULE_ID = 164003;
const UNDERPAR_CM_DEEPLINK_REDIRECT_RULE_ID = 164004;
const UNDERPAR_BT_DEEPLINK_REDIRECT_RULE_ID = 164005;
const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";
const UNDERPAR_ESM_DEEPLINK_MARKER_VALUE = "esm";
const UNDERPAR_BT_DEEPLINK_MARKER_VALUE = "bt";
const UNDERPAR_DEGRADATION_DEEPLINK_MARKER_VALUE = "degradation";
const UNDERPAR_CM_DEEPLINK_MARKER_VALUE = "cm";
const UNDERPAR_ESM_WORKSPACE_PATH = "esm-workspace.html";
const UNDERPAR_BLONDIE_TIME_WORKSPACE_PATH = "blondie-time-workspace.html";
const UNDERPAR_BLONDIE_TIME_DEEPLINK_BRIDGE_PATH = "blondie-time-deeplink-bridge.html";
const UNDERPAR_DEGRADATION_WORKSPACE_PATH = "degradation-workspace.html";
const UNDERPAR_CM_WORKSPACE_PATH = "cm-workspace.html";
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
const UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE = "underpar:networkActivity";
const LEGACY_UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE = "mincloudlogin:networkActivity";
const IMS_FETCH_REQUEST_TYPE = "underpar:imsFetch";
const LEGACY_IMS_FETCH_REQUEST_TYPE = "mincloudlogin:imsFetch";
const CM_FETCH_REQUEST_TYPE = "underpar:cmFetch";
const LEGACY_CM_FETCH_REQUEST_TYPE = "mincloudlogin:cmFetch";
const SPLUNK_FETCH_REQUEST_TYPE = "underpar:splunkFetch";
const LEGACY_SPLUNK_FETCH_REQUEST_TYPE = "mincloudlogin:splunkFetch";
const CONSOLE_LOG_RELAY_REQUEST_TYPE = "underpar:consoleLog";
const DEBUG_MESSAGE_TYPE_PREFIX = "underpardebug:";
const LEGACY_DEBUG_MESSAGE_TYPE_PREFIX = "minclouddebug:";
const DEBUG_DEVTOOLS_PORT_NAME = "underpardebug-devtools";
const LEGACY_DEBUG_DEVTOOLS_PORT_NAME = "minclouddebug-devtools";
const SIDEPANEL_SESSION_PORT_NAME = "underpar-sidepanel-session";
const UP_DEVTOOLS_STATUS_PORT_NAME = "underpar-up-devtools-status";
const DEBUG_FLOW_PERSIST_MAX = 8;
const DEBUG_FLOW_PERSIST_DEBOUNCE_MS = 250;
const IMS_RELAY_FETCH_TIMEOUT_MS = 15000;
// Redirect-host filtering mode for flow capture trimming.
// - "exact_path": ignore only the exact redirect URL path
// - "path_tree": ignore redirect URL path and subtree
// - "origin_except_pass": ignore entire redirect origin except PASS-critical paths
const REDIRECT_IGNORE_MATCHER_MODE = "origin_except_pass";
const WEB_REQUEST_FILTER = { urls: ["<all_urls>"] };
const UNDERPAR_WORKSPACE_PATHS = Object.freeze([
  "esm-workspace.html",
  "blondie-time-workspace.html",
  "meg-workspace.html",
  "cm-workspace.html",
  "mvpd-workspace.html",
  "rest-workspace.html",
  "degradation-workspace.html",
  "bobtools-workspace.html",
]);
const UNDERPAR_BLONDIE_TIME_MESSAGE_TYPE = "underpar:blondie-time";
const UNDERPAR_BLONDIE_TIME_DEEPLINK_REQUEST_TYPE = "underpar:openBlondieTimeWorkspaceFromDeeplink";
const UNDERPAR_BLONDIE_TIME_STORAGE_KEY = "underpar_blondie_time_esm_state";
const UNDERPAR_BLONDIE_TIME_ALARM_NAME = "underpar:blondie-time:esm";
const UNDERPAR_BLONDIE_TIME_NOTIFICATION_ID = "underpar:blondie-time:esm";
const UNDERPAR_BLONDIE_TIME_NOTIFICATION_BACKOFF_MS = 30 * 1000;
const BUILD_FINGERPRINT_FILES = [
  "manifest.json",
  "background.js",
  "underpar-environment.js",
  "popup.js",
  "popup.html",
  "sidepanel.html",
  "popup.css",
  "esm-workspace.html",
  "esm-workspace.css",
  "esm-workspace.js",
  "blondie-time-workspace.html",
  "blondie-time-workspace.css",
  "blondie-time-workspace.js",
  "blondie-time-deeplink-bridge.html",
  "blondie-time-deeplink-bridge.js",
  "blondie-time-logic.js",
  "meg-workspace.html",
  "meg-workspace.css",
  "meg-workspace.js",
  "saved-query-bridge.html",
  "saved-query-bridge.js",
  "clickesmws-runtime.js",
  "clickESM-template.html",
  "clickCMU-template.html",
  "click-cmu-endpoints.json",
  "cm-workspace.html",
  "cm-workspace.css",
  "cm-workspace.js",
  "rest-workspace.html",
  "rest-workspace.css",
  "rest-workspace.js",
  "degradation-workspace.html",
  "degradation-workspace.css",
  "degradation-workspace.js",
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
  panelStateByPort: new Map(),
  debuggerAttachedTabIds: new Set(),
  persistTimerByFlowId: new Map(),
  persistIndexTimerId: 0,
};

const controllerBridgeState = {
  sidepanelStateByPort: new Map(),
  devtoolsStatusPorts: new Set(),
  networkActivityCount: 0,
  networkActivityContext: "",
};

async function configureSidePanelBehavior() {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch {
    // Ignore when side panel APIs are unavailable.
  }
}

function createBlondieTimeRunId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `blondie-time-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeBlondieTimeTriggerMode(value = "") {
  return String(value || "").trim().toLowerCase() === "teammate" ? "teammate" : "self";
}

function cloneBlondieTimeDeliveryTarget(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (String(value?.mode || "").trim().toLowerCase() !== "teammate") {
    return null;
  }
  const userId = String(value?.userId || "").trim().toUpperCase();
  if (!userId) {
    return null;
  }
  return {
    mode: "teammate",
    userId,
    userName: String(value?.userName || "").trim(),
  };
}

function normalizeBlondieTimeIntervalMinutes(value = 0) {
  const normalized = Number(value || 0);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 2;
}

function normalizeBlondieTimeState(value = null) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const intervalMinutes = normalizeBlondieTimeIntervalMinutes(value?.intervalMinutes || 2);
  const rawIntervalMs = Number(value?.intervalMs || 0);
  const intervalMs =
    Number.isFinite(rawIntervalMs) && rawIntervalMs > 0 ? Math.max(intervalMinutes * 60 * 1000, rawIntervalMs) : intervalMinutes * 60 * 1000;
  return {
    workspace: String(value?.workspace || "bt").trim().toLowerCase() || "bt",
    runId: String(value?.runId || "").trim(),
    running: value?.running === true,
    intervalMinutes,
    intervalMs,
    nextFireAt: Math.max(0, Number(value?.nextFireAt || 0)),
    startedAt: Math.max(0, Number(value?.startedAt || 0)),
    targetWindowId: Math.max(0, Number(value?.targetWindowId || 0)),
    workspaceContextKey: String(value?.workspaceContextKey || "").trim(),
    programmerId: String(value?.programmerId || "").trim(),
    programmerName: String(value?.programmerName || "").trim(),
    triggerMode: normalizeBlondieTimeTriggerMode(value?.triggerMode || "self"),
    deliveryTarget: cloneBlondieTimeDeliveryTarget(value?.deliveryTarget || null),
    noteText: String(value?.noteText || ""),
    lastError: String(value?.lastError || "").trim(),
    lastStopReason: String(value?.lastStopReason || "").trim(),
    lastLapAt: Math.max(0, Number(value?.lastLapAt || 0)),
    lastDeliveredCount: Math.max(0, Number(value?.lastDeliveredCount || 0)),
    lapCount: Math.max(0, Number(value?.lapCount || 0)),
    lastNotificationAt: Math.max(0, Number(value?.lastNotificationAt || 0)),
  };
}

async function readBlondieTimeState() {
  try {
    const payload = await chrome.storage.local.get(UNDERPAR_BLONDIE_TIME_STORAGE_KEY);
    return normalizeBlondieTimeState(payload?.[UNDERPAR_BLONDIE_TIME_STORAGE_KEY] || null);
  } catch {
    return null;
  }
}

async function writeBlondieTimeState(nextState = null) {
  const normalizedState = normalizeBlondieTimeState(nextState);
  if (!normalizedState) {
    await chrome.storage.local.remove(UNDERPAR_BLONDIE_TIME_STORAGE_KEY);
    return null;
  }
  await chrome.storage.local.set({
    [UNDERPAR_BLONDIE_TIME_STORAGE_KEY]: normalizedState,
  });
  return normalizedState;
}

async function ensureBlondieTimeAlarmScheduled(timerState = null) {
  const normalizedState = normalizeBlondieTimeState(timerState);
  if (!normalizedState?.running) {
    await chrome.alarms.clear(UNDERPAR_BLONDIE_TIME_ALARM_NAME);
    return null;
  }
  const when = Math.max(Date.now() + 500, Number(normalizedState.nextFireAt || 0));
  const existingAlarm = await chrome.alarms.get(UNDERPAR_BLONDIE_TIME_ALARM_NAME);
  if (!existingAlarm || Math.abs(Number(existingAlarm.scheduledTime || 0) - when) > 1500) {
    await chrome.alarms.create(UNDERPAR_BLONDIE_TIME_ALARM_NAME, { when });
  }
  return when;
}

async function findBlondieTimeWorkspaceTab(targetWindowId = 0) {
  const btUrlPrefix = chrome.runtime.getURL(UNDERPAR_BLONDIE_TIME_WORKSPACE_PATH);
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    const tabUrl = String(tab?.url || "");
    if (!tabUrl.startsWith(btUrlPrefix)) {
      continue;
    }
    if (targetWindowId > 0 && Number(tab?.windowId || 0) !== targetWindowId) {
      continue;
    }
    return tab;
  }
  return null;
}

async function focusBlondieTimeWorkspace(targetWindowId = 0) {
  const existingTab = await findBlondieTimeWorkspaceTab(targetWindowId);
  if (existingTab?.id) {
    try {
      await chrome.tabs.update(existingTab.id, { active: true });
    } catch {
      // Fall through to create a fresh workspace tab.
    }
    if (existingTab.windowId) {
      try {
        await chrome.windows.update(existingTab.windowId, { focused: true });
      } catch {
        // Ignore focus failures.
      }
    }
    return existingTab;
  }
  const createOptions = {
    url: chrome.runtime.getURL(UNDERPAR_BLONDIE_TIME_WORKSPACE_PATH),
    active: true,
  };
  if (targetWindowId > 0) {
    try {
      return await chrome.tabs.create({
        ...createOptions,
        windowId: targetWindowId,
      });
    } catch {
      // Retry without a window affinity if the stored window no longer exists.
    }
  }
  return await chrome.tabs.create(createOptions);
}

async function notifyBlondieTimeIssue(message = "", timerState = null) {
  const normalizedState = normalizeBlondieTimeState(timerState);
  const now = Date.now();
  if (normalizedState && now - Number(normalizedState.lastNotificationAt || 0) < UNDERPAR_BLONDIE_TIME_NOTIFICATION_BACKOFF_MS) {
    await chrome.notifications.clear(UNDERPAR_BLONDIE_TIME_NOTIFICATION_ID).catch(() => {});
  }
  try {
    await chrome.notifications.create(UNDERPAR_BLONDIE_TIME_NOTIFICATION_ID, {
      type: "basic",
      iconUrl: "icons/underpar-128.png",
      title: "Blondie Time",
      message: String(message || "Blondie Time needs your attention.").trim(),
      priority: 1,
      buttons: [{ title: "Open BT Workspace" }],
    });
  } catch {
    return normalizedState;
  }
  if (!normalizedState) {
    return null;
  }
  return await writeBlondieTimeState({
    ...normalizedState,
    lastNotificationAt: now,
  });
}

async function stopBlondieTime(reason = "", options = {}) {
  const previousState = normalizeBlondieTimeState(options?.state || (await readBlondieTimeState()));
  await chrome.alarms.clear(UNDERPAR_BLONDIE_TIME_ALARM_NAME);
  if (!previousState) {
    return null;
  }
  const nextState = {
    ...previousState,
    running: false,
    nextFireAt: 0,
    lastError: options?.clearError === true ? "" : String(reason || previousState.lastError || "").trim(),
    lastStopReason: String(reason || previousState.lastStopReason || options?.lastStopReason || "").trim(),
  };
  const storedState = await writeBlondieTimeState(nextState);
  if (options?.notify === true && String(reason || "").trim()) {
    return await notifyBlondieTimeIssue(reason, storedState);
  }
  return storedState;
}

async function startBlondieTime(message = {}) {
  const intervalMinutes = normalizeBlondieTimeIntervalMinutes(message?.intervalMinutes || 2);
  const nextFireAt = Date.now() + intervalMinutes * 60 * 1000;
  const nextState = {
    workspace: "bt",
    runId: createBlondieTimeRunId(),
    running: true,
    intervalMinutes,
    intervalMs: intervalMinutes * 60 * 1000,
    nextFireAt,
    startedAt: Date.now(),
    targetWindowId: Math.max(0, Number(message?.windowId || 0)),
    workspaceContextKey: String(message?.workspaceContextKey || "").trim(),
    programmerId: String(message?.programmerId || "").trim(),
    programmerName: String(message?.programmerName || "").trim(),
    triggerMode: normalizeBlondieTimeTriggerMode(message?.triggerMode || "self"),
    deliveryTarget: cloneBlondieTimeDeliveryTarget(message?.deliveryTarget || null),
    noteText: String(message?.noteText || ""),
    lastError: "",
    lastStopReason: "",
    lastLapAt: 0,
    lastDeliveredCount: 0,
    lapCount: 1,
    lastNotificationAt: 0,
  };
  const storedState = await writeBlondieTimeState(nextState);
  await ensureBlondieTimeAlarmScheduled(storedState);
  return storedState;
}

async function ensureBlondieTimeRuntimeConsistency() {
  const timerState = await readBlondieTimeState();
  if (!timerState?.running) {
    await chrome.alarms.clear(UNDERPAR_BLONDIE_TIME_ALARM_NAME);
    return timerState;
  }
  await ensureBlondieTimeAlarmScheduled(timerState);
  return timerState;
}

async function handleBlondieTimeAlarm() {
  const timerState = await readBlondieTimeState();
  if (!timerState?.running) {
    return;
  }
  const workspaceTab = await findBlondieTimeWorkspaceTab(timerState.targetWindowId);
  if (!workspaceTab) {
    await stopBlondieTime("Blondie Time could not find its BT workspace tab.", {
      state: timerState,
      notify: true,
    });
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      type: UNDERPAR_BLONDIE_TIME_MESSAGE_TYPE,
      channel: "workspace-control",
      action: "fire-lap",
      targetWindowId: Number(timerState.targetWindowId || 0),
      state: timerState,
    });
    if (!response?.ok) {
      throw new Error(response?.error || "Blondie Time could not complete the scheduled lap.");
    }

    const liveState = await readBlondieTimeState();
    if (!liveState?.running || String(liveState.runId || "") !== String(timerState.runId || "")) {
      return;
    }

    const nextFireAt = Date.now() + timerState.intervalMs;
    const nextState = {
      ...liveState,
      nextFireAt,
      lastError: "",
      lastStopReason: "",
      lastLapAt: Date.now(),
      lastDeliveredCount: Math.max(0, Number(response?.deliveredCount || 0)),
      lapCount: Math.max(1, Number(liveState?.lapCount || timerState?.lapCount || 1)) + 1,
    };
    const storedState = await writeBlondieTimeState(nextState);
    await ensureBlondieTimeAlarmScheduled(storedState);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await stopBlondieTime(message || "Blondie Time stopped unexpectedly.", {
      state: timerState,
      notify: true,
    });
  }
}

function normalizeWindowId(value) {
  const normalized = Number(value || 0);
  return Number.isInteger(normalized) && normalized > 0 ? normalized : 0;
}

function buildUnderparControllerStatusSnapshot() {
  const sidepanelStates = Array.from(controllerBridgeState.sidepanelStateByPort.values()).filter(
    (entry) => entry && typeof entry === "object"
  );
  const activeWindowIds = new Set();
  let hasReadySidepanel = false;
  let hasRestrictedSidepanel = false;
  let hasBootstrappingSidepanel = false;
  let hasReportedState = false;

  for (const entry of sidepanelStates) {
    const windowId = normalizeWindowId(entry.windowId);
    if (windowId) {
      activeWindowIds.add(windowId);
    }
    if (Number(entry.reportedAt || 0) > 0) {
      hasReportedState = true;
    }
    if (entry.sessionReady === true) {
      hasReadySidepanel = true;
    }
    if (entry.restricted === true) {
      hasRestrictedSidepanel = true;
    }
    if (entry.bootstrapping === true) {
      hasBootstrappingSidepanel = true;
    }
  }

  const sidepanelOpen = sidepanelStates.length > 0;
  let status = "sidepanel-closed";
  let message = "Open the UnderPAR side panel to re-enable this UP panel.";

  if (sidepanelOpen) {
    if (hasReadySidepanel) {
      status = "ready";
      message = "Connected to the UnderPAR side panel.";
    } else if (!hasReportedState || hasBootstrappingSidepanel) {
      status = "bootstrapping";
      message = "UnderPAR is checking session state in the side panel.";
    } else if (hasRestrictedSidepanel) {
      status = "restricted";
      message = "Resolve the restricted AdobePass state in the UnderPAR side panel.";
    } else {
      status = "signed-out";
      message = "UnderPAR is signed out. Sign in from the side panel to re-enable this UP panel.";
    }
  }

  return {
    ready: sidepanelOpen && hasReadySidepanel,
    sidepanelOpen,
    activeSidepanelCount: sidepanelStates.length,
    activeWindowIds: Array.from(activeWindowIds),
    status,
    message,
    updatedAt: Date.now(),
  };
}

function broadcastUnderparControllerStatus() {
  const snapshot = buildUnderparControllerStatusSnapshot();
  for (const port of controllerBridgeState.devtoolsStatusPorts) {
    postToPortSafe(port, {
      type: "controller-status",
      status: snapshot,
    });
  }
}

function buildUnderparNetworkActivitySnapshot() {
  const count = Math.max(0, Number(controllerBridgeState.networkActivityCount || 0));
  return {
    active: count > 0,
    count,
    context: String(controllerBridgeState.networkActivityContext || "").trim(),
    updatedAt: Date.now(),
  };
}

function broadcastUnderparNetworkActivity() {
  const snapshot = buildUnderparNetworkActivitySnapshot();
  for (const port of controllerBridgeState.sidepanelStateByPort.keys()) {
    postToPortSafe(port, {
      type: "network-activity",
      activity: snapshot,
    });
  }
}

function beginUnderparNetworkActivity(context = "") {
  controllerBridgeState.networkActivityCount = Math.max(0, Number(controllerBridgeState.networkActivityCount || 0)) + 1;
  const normalizedContext = String(context || "").trim();
  if (normalizedContext) {
    controllerBridgeState.networkActivityContext = normalizedContext;
  }
  broadcastUnderparNetworkActivity();

  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    controllerBridgeState.networkActivityCount = Math.max(
      0,
      Number(controllerBridgeState.networkActivityCount || 0) - 1
    );
    if (controllerBridgeState.networkActivityCount === 0) {
      controllerBridgeState.networkActivityContext = "";
    }
    broadcastUnderparNetworkActivity();
  };
}

function applyUnderparNetworkActivityDelta(delta = 0, context = "") {
  const normalizedDelta = Math.trunc(Number(delta || 0));
  if (!normalizedDelta) {
    return buildUnderparNetworkActivitySnapshot();
  }

  controllerBridgeState.networkActivityCount = Math.max(
    0,
    Number(controllerBridgeState.networkActivityCount || 0) + normalizedDelta
  );
  const normalizedContext = String(context || "").trim();
  if (normalizedDelta > 0 && normalizedContext) {
    controllerBridgeState.networkActivityContext = normalizedContext;
  }
  if (controllerBridgeState.networkActivityCount === 0) {
    controllerBridgeState.networkActivityContext = "";
  }
  broadcastUnderparNetworkActivity();
  return buildUnderparNetworkActivitySnapshot();
}

function countTrackedSidepanelsForWindow(windowId) {
  const normalizedWindowId = normalizeWindowId(windowId);
  if (!normalizedWindowId) {
    return 0;
  }
  let count = 0;
  for (const entry of controllerBridgeState.sidepanelStateByPort.values()) {
    if (normalizeWindowId(entry?.windowId) === normalizedWindowId) {
      count += 1;
    }
  }
  return count;
}

function isUnderparWorkspaceUrl(urlValue = "") {
  const normalizedUrl = String(urlValue || "").trim();
  if (!normalizedUrl) {
    return false;
  }
  return UNDERPAR_WORKSPACE_PATHS.some((path) => normalizedUrl.startsWith(chrome.runtime.getURL(path)));
}

async function closeUnderparWorkspaceTabs(options = {}) {
  const targetWindowId = normalizeWindowId(options.windowId);
  const reason = String(options.reason || "sidepanel-disconnect").trim() || "sidepanel-disconnect";
  let candidateTabs = [];

  try {
    const allTabs = await chrome.tabs.query({});
    candidateTabs = (Array.isArray(allTabs) ? allTabs : []).filter((tab) => {
      const tabWindowId = normalizeWindowId(tab?.windowId);
      if (targetWindowId && tabWindowId !== targetWindowId) {
        return false;
      }
      return isUnderparWorkspaceUrl(tab?.url);
    });
  } catch {
    return {
      closedCount: 0,
      requestedCloseCount: 0,
    };
  }

  const tabIds = candidateTabs
    .map((tab) => Number(tab?.id || 0))
    .filter((tabId) => Number.isInteger(tabId) && tabId > 0);
  if (tabIds.length === 0) {
    return {
      closedCount: 0,
      requestedCloseCount: 0,
    };
  }

  const closedTabIds = [];
  for (const tabId of tabIds) {
    try {
      await chrome.tabs.remove(tabId);
      closedTabIds.push(tabId);
    } catch {
      // Ignore tabs that were already closed or became unavailable.
    }
  }

  if (closedTabIds.length > 0) {
    console.log("[UnderPAR][Controller] Closed workspace tabs after sidepanel disconnect.", {
      reason,
      targetWindowId,
      requestedCloseCount: tabIds.length,
      closedCount: closedTabIds.length,
    });
  }

  return {
    closedCount: closedTabIds.length,
    requestedCloseCount: tabIds.length,
  };
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

async function ensureUnderparWorkspaceDeeplinkRedirectRule(ruleId, markerValue, workspacePath) {
  const dnr = chrome.declarativeNetRequest;
  if (!dnr?.updateSessionRules) {
    return;
  }

  let workspaceUrl;
  let redirectOrigin;
  try {
    workspaceUrl = new URL(chrome.runtime.getURL(workspacePath));
    redirectOrigin = new URL(
      String(chrome.identity?.getRedirectURL?.("") || `https://${String(chrome.runtime?.id || "").trim()}.chromiumapp.org/`).trim()
    );
  } catch {
    return;
  }

  const escapedOrigin = String(redirectOrigin.origin || "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escapedOrigin) {
    return;
  }
  const markerKey = UNDERPAR_ESM_DEEPLINK_MARKER_PARAM.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedMarkerValue = String(markerValue || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexFilter = `^${escapedOrigin}/\\?${markerKey}=${escapedMarkerValue}(?:&.*)?$`;

  try {
    await dnr.updateSessionRules({
      removeRuleIds: [Number(ruleId || 0)],
      addRules: [
        {
          id: Number(ruleId || 0),
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                scheme: workspaceUrl.protocol.replace(":", ""),
                host: workspaceUrl.host,
                path: workspaceUrl.pathname,
                queryTransform: {
                  removeParams: [UNDERPAR_ESM_DEEPLINK_MARKER_PARAM],
                },
              },
            },
          },
          condition: {
            regexFilter,
            resourceTypes: ["main_frame", "sub_frame"],
          },
        },
      ],
    });
  } catch {
    // Ignore DNR setup errors; deeplink fallback paths remain available.
  }
}

async function ensureUnderparEsmDeeplinkRedirectRule() {
  return ensureUnderparWorkspaceDeeplinkRedirectRule(
    UNDERPAR_ESM_DEEPLINK_REDIRECT_RULE_ID,
    UNDERPAR_ESM_DEEPLINK_MARKER_VALUE,
    UNDERPAR_ESM_WORKSPACE_PATH
  );
}

async function ensureUnderparDegradationDeeplinkRedirectRule() {
  return ensureUnderparWorkspaceDeeplinkRedirectRule(
    UNDERPAR_DEGRADATION_DEEPLINK_REDIRECT_RULE_ID,
    UNDERPAR_DEGRADATION_DEEPLINK_MARKER_VALUE,
    UNDERPAR_DEGRADATION_WORKSPACE_PATH
  );
}

async function ensureUnderparCmDeeplinkRedirectRule() {
  return ensureUnderparWorkspaceDeeplinkRedirectRule(
    UNDERPAR_CM_DEEPLINK_REDIRECT_RULE_ID,
    UNDERPAR_CM_DEEPLINK_MARKER_VALUE,
    UNDERPAR_CM_WORKSPACE_PATH
  );
}

async function ensureUnderparBtDeeplinkRedirectRule() {
  return ensureUnderparWorkspaceDeeplinkRedirectRule(
    UNDERPAR_BT_DEEPLINK_REDIRECT_RULE_ID,
    UNDERPAR_BT_DEEPLINK_MARKER_VALUE,
    UNDERPAR_BLONDIE_TIME_DEEPLINK_BRIDGE_PATH
  );
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
  const blockedAudienceManagerAvatar = (() => {
    const normalized = String(trimmed || "").trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    if (normalized.includes("audiencemanager")) {
      return true;
    }
    if (/^dma[_-]/i.test(normalized)) {
      return true;
    }
    return (
      /^\/?ims\/avatar\/download\/dma[_-]/i.test(normalized) ||
      /^\/?avatar\/download\/dma[_-]/i.test(normalized) ||
      /\/ims\/avatar\/download\/dma[_-]/i.test(normalized)
    );
  })();
  if (blockedAudienceManagerAvatar) {
    return "";
  }

  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (/^\/?api\/profile\/[^/]+\/image(\/|$)/i.test(trimmed)) {
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${PPS_PROFILE_BASE_URL}${normalizedPath}`;
  }

  if (/^ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}/${trimmed}`;
  }

  if (/^avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}/ims/${trimmed}`;
  }

  if (/^\/ims\/avatar\/download\//i.test(trimmed)) {
    return `${IMS_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${IMS_BASE_URL}${trimmed}`;
  }

  if (!trimmed.includes("://") && /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`;
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

function toPpsProfileImageSizeUrl(url, size) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized || !isPpsProfileImageUrl(normalized) || !Number.isFinite(size) || size <= 0) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    const nextSize = String(Math.floor(size));
    const withTrailingSize = parsed.pathname.replace(/\/(\d+)(\/?)$/i, `/${nextSize}$2`);

    if (withTrailingSize !== parsed.pathname) {
      parsed.pathname = withTrailingSize;
      return parsed.toString();
    }

    parsed.pathname = `${parsed.pathname.replace(/\/?$/, "")}/${nextSize}`;
    return parsed.toString();
  } catch {
    return normalized;
  }
}

function buildAvatarFetchUrlCandidates(url) {
  const normalized = normalizeAvatarCandidate(url);
  if (!normalized) {
    return [];
  }

  const candidates = [normalized];
  const pushCandidate = (value) => {
    const candidate = normalizeAvatarCandidate(value);
    if (candidate && !candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  };

  if (isPpsProfileImageUrl(normalized)) {
    for (const size of AVATAR_SIZE_PREFERENCES) {
      pushCandidate(toPpsProfileImageSizeUrl(normalized, size));
    }
    return candidates;
  }

  if (!isImsAvatarDownloadUrl(normalized)) {
    for (const size of AVATAR_SIZE_PREFERENCES) {
      try {
        const parsed = new URL(normalized);
        parsed.searchParams.set("size", String(size));
        pushCandidate(parsed.toString());
      } catch {
        // Keep original URL when query updates fail.
      }
    }
    return candidates;
  }

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

function buildAvatarFetchAttempts(accessToken = "", url = "") {
  const baseHeaders = {
    Accept: "image/*,*/*;q=0.8",
  };
  const preferCookieSessionFirst = isPpsProfileImageUrl(url);

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

  if (preferCookieSessionFirst) {
    pushAttempt(baseHeaders, "include");
    pushAttempt(baseHeaders, "omit");
  }

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

  if (!preferCookieSessionFirst) {
    pushAttempt(baseHeaders, "omit");
    pushAttempt(baseHeaders, "include");
  } else {
    pushAttempt({ Accept: "*/*" }, "include");
    pushAttempt({ Accept: "*/*" }, "omit");
  }
  return attempts;
}

async function fetchAvatarAsDataUrl(url, accessToken = "") {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Missing avatar URL.");
  }

  const release = beginUnderparNetworkActivity("avatar-relay");
  try {
    const urlCandidates = buildAvatarFetchUrlCandidates(url);
    const maxAttempts = 14;
    let attemptCount = 0;

    let lastError = null;
    for (const targetUrl of urlCandidates) {
      const attempts = buildAvatarFetchAttempts(accessToken, targetUrl);
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
  } finally {
    release();
  }
}

function isAllowedImsRelayUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "ims-na1.adobelogin.com" || host.endsWith(".adobelogin.com")) {
      return true;
    }
    if (host === "adobeid-na1.services.adobe.com") {
      return true;
    }
    if (host.startsWith("adobeid-") && host.endsWith(".services.adobe.com")) {
      return true;
    }
    if (host === "auth.services.adobe.com" || host.endsWith(".auth.services.adobe.com")) {
      return true;
    }
    if (host === "idg.adobe.com" || host.endsWith(".idg.adobe.com")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function normalizeImsRelayHeaders(headersLike) {
  if (!headersLike || typeof headersLike !== "object") {
    return {};
  }
  const output = {};
  for (const [keyRaw, valueRaw] of Object.entries(headersLike)) {
    const key = String(keyRaw || "").trim();
    if (!key) {
      continue;
    }
    output[key] = String(valueRaw ?? "");
  }
  return output;
}

function normalizeImsRelayCredentials(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "include" || normalized === "same-origin" || normalized === "omit") {
    return normalized;
  }
  return "omit";
}

async function fetchWithAbortTimeout(url, init = {}, timeoutMs = 0) {
  const normalizedTimeoutMs = Math.max(0, Number(timeoutMs || 0));
  if (!normalizedTimeoutMs) {
    return fetch(url, init);
  }

  const controller = new AbortController();
  const requestInit = {
    ...init,
    signal: controller.signal,
  };
  const timerId = globalThis.setTimeout(() => controller.abort(), Math.max(2000, normalizedTimeoutMs));
  try {
    return await fetch(url, requestInit);
  } finally {
    globalThis.clearTimeout(timerId);
  }
}

async function fetchImsRelayResponse(payload = {}) {
  const release = beginUnderparNetworkActivity("ims-relay");
  try {
  const requestUrl = String(payload?.url || "").trim();
  if (!isAllowedImsRelayUrl(requestUrl)) {
    throw new Error("IMS relay blocked: unsupported URL.");
  }

  const method = String(payload?.method || "GET").trim().toUpperCase();
  if (method !== "GET" && method !== "POST") {
    throw new Error(`IMS relay blocked: unsupported method "${method}".`);
  }

  const credentials = normalizeImsRelayCredentials(payload?.credentials);
  const headers = normalizeImsRelayHeaders(payload?.headers);
  const bodyText = typeof payload?.body === "string" ? payload.body : "";

  const response = await fetchWithAbortTimeout(
    requestUrl,
    {
      method,
      credentials,
      cache: "no-store",
      redirect: "follow",
      headers,
      body: method === "POST" ? bodyText : undefined,
    },
    IMS_RELAY_FETCH_TIMEOUT_MS
  );

  const headersObject = {};
  response.headers.forEach((value, key) => {
    headersObject[key] = value;
  });

  return {
    ok: response.ok,
    status: Number(response.status || 0),
    statusText: String(response.statusText || ""),
    url: String(response.url || requestUrl),
    redirected: Boolean(response.redirected),
    headers: headersObject,
    bodyText: await response.text().catch(() => ""),
  };
  } finally {
    release();
  }
}

function isAllowedCmRelayUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return (
      host === "config.adobeprimetime.com" ||
      host === "cm-reports.adobeprimetime.com" ||
      host.endsWith(".adobeprimetime.com")
    );
  } catch {
    return false;
  }
}

async function fetchCmRelayResponse(payload = {}) {
  const release = beginUnderparNetworkActivity("cm-relay");
  try {
  const requestUrl = String(payload?.url || "").trim();
  if (!isAllowedCmRelayUrl(requestUrl)) {
    throw new Error("CM relay blocked: unsupported URL.");
  }

  const method = String(payload?.method || "GET").trim().toUpperCase();
  if (method !== "GET" && method !== "POST") {
    throw new Error(`CM relay blocked: unsupported method "${method}".`);
  }

  const credentials = normalizeImsRelayCredentials(payload?.credentials);
  const headers = normalizeImsRelayHeaders(payload?.headers);
  const bodyText = typeof payload?.body === "string" ? payload.body : "";

  const response = await fetch(requestUrl, {
    method,
    credentials,
    cache: "no-store",
    redirect: "follow",
    headers,
    body: method === "POST" ? bodyText : undefined,
  });

  const headersObject = {};
  response.headers.forEach((value, key) => {
    headersObject[key] = value;
  });

  return {
    ok: response.ok,
    status: Number(response.status || 0),
    statusText: String(response.statusText || ""),
    url: String(response.url || requestUrl),
    redirected: Boolean(response.redirected),
    headers: headersObject,
    bodyText: await response.text().catch(() => ""),
  };
  } finally {
    release();
  }
}

function isAllowedSplunkRelayUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return host === "splunk-us.corp.adobe.com";
  } catch {
    return false;
  }
}

function getHeaderKeyCaseInsensitive(headers = {}, headerName = "") {
  const target = String(headerName || "").trim().toLowerCase();
  if (!target || !headers || typeof headers !== "object") {
    return "";
  }
  for (const key of Object.keys(headers)) {
    if (String(key || "").trim().toLowerCase() === target) {
      return key;
    }
  }
  return "";
}

function setHeaderIfMissing(headers = {}, headerName = "", value = "") {
  if (!headers || typeof headers !== "object") {
    return;
  }
  const targetName = String(headerName || "").trim();
  if (!targetName) {
    return;
  }
  const existingKey = getHeaderKeyCaseInsensitive(headers, targetName);
  if (existingKey) {
    const existingValue = String(headers[existingKey] ?? "").trim();
    if (existingValue) {
      return;
    }
    delete headers[existingKey];
  }
  headers[targetName] = String(value ?? "");
}

function extractSplunkFormKeyFromCookieValue(rawValue = "") {
  const normalized = String(rawValue || "").trim();
  if (!normalized) {
    return "";
  }
  let decoded = normalized;
  try {
    decoded = decodeURIComponent(normalized);
  } catch {
    decoded = normalized;
  }
  const candidateSegments = [decoded, ...decoded.split(/[=:|]/g).map((part) => String(part || "").trim())].filter(Boolean);
  for (const segment of candidateSegments) {
    if (/^[A-Za-z0-9._-]{8,}$/.test(segment)) {
      return segment;
    }
  }
  return "";
}

async function resolveSplunkFormKeyFromCookies(requestUrl = "") {
  if (!chrome.cookies) {
    return "";
  }
  const normalizedUrl = String(requestUrl || "").trim();
  if (!normalizedUrl) {
    return "";
  }
  let cookies = [];
  try {
    cookies = await chrome.cookies.getAll({ url: normalizedUrl });
  } catch {
    cookies = [];
  }
  if (!Array.isArray(cookies) || cookies.length === 0) {
    return "";
  }
  const scoredCandidates = [];
  for (const cookie of cookies) {
    const name = String(cookie?.name || "").trim();
    if (!name) {
      continue;
    }
    if (!/csrf/i.test(name)) {
      continue;
    }
    const extractedValue = extractSplunkFormKeyFromCookieValue(cookie?.value);
    if (!extractedValue) {
      continue;
    }
    let score = 0;
    if (/^splunkweb_csrf_token/i.test(name)) {
      score += 10;
    }
    if (/csrf_token/i.test(name)) {
      score += 6;
    }
    if (cookie?.secure) {
      score += 2;
    }
    if (String(cookie?.domain || "").toLowerCase().includes("splunk-us.corp.adobe.com")) {
      score += 2;
    }
    scoredCandidates.push({
      score,
      value: extractedValue,
    });
  }
  scoredCandidates.sort((left, right) => Number(right.score || 0) - Number(left.score || 0));
  return String(scoredCandidates[0]?.value || "");
}

async function enrichSplunkRelayHeaders(requestUrl = "", method = "GET", headers = {}) {
  const output = headers && typeof headers === "object" ? { ...headers } : {};
  setHeaderIfMissing(output, "X-Requested-With", "XMLHttpRequest");
  setHeaderIfMissing(output, "Accept", "*/*");
  if (String(method || "GET").toUpperCase() === "POST") {
    setHeaderIfMissing(output, "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  }
  const hasFormKey = Boolean(getHeaderKeyCaseInsensitive(output, "X-Splunk-Form-Key"));
  if (!hasFormKey) {
    const formKey = await resolveSplunkFormKeyFromCookies(requestUrl);
    if (formKey) {
      output["X-Splunk-Form-Key"] = formKey;
    }
  }
  return output;
}

async function fetchSplunkRelayResponse(payload = {}) {
  const release = beginUnderparNetworkActivity("splunk-relay");
  try {
  const requestUrl = String(payload?.url || "").trim();
  if (!isAllowedSplunkRelayUrl(requestUrl)) {
    throw new Error("Splunk relay blocked: unsupported URL.");
  }

  const method = String(payload?.method || "GET").trim().toUpperCase();
  if (method !== "GET" && method !== "POST") {
    throw new Error(`Splunk relay blocked: unsupported method "${method}".`);
  }

  const credentials = normalizeImsRelayCredentials(payload?.credentials);
  const incomingHeaders = normalizeImsRelayHeaders(payload?.headers);
  const headers = await enrichSplunkRelayHeaders(requestUrl, method, incomingHeaders);
  const bodyText = typeof payload?.body === "string" ? payload.body : "";

  const response = await fetch(requestUrl, {
    method,
    credentials,
    cache: "no-store",
    redirect: "follow",
    headers,
    body: method === "POST" ? bodyText : undefined,
  });

  const headersObject = {};
  response.headers.forEach((value, key) => {
    headersObject[key] = value;
  });

  return {
    ok: response.ok,
    status: Number(response.status || 0),
    statusText: String(response.statusText || ""),
    url: String(response.url || requestUrl),
    redirected: Boolean(response.redirected),
    headers: headersObject,
    bodyText: await response.text().catch(() => ""),
  };
  } finally {
    release();
  }
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
      await syncDebuggerAttachmentForTab(tabId, "state-restore");
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

function setPanelStateForPort(port, tabId, options = {}) {
  if (!port) {
    return;
  }
  const normalizedTabId = normalizeTabId(tabId);
  const existing = debugState.panelStateByPort.get(port) || {};
  const visible =
    options.visible === undefined
      ? existing.visible !== false
      : options.visible === true;
  debugState.panelStateByPort.set(port, {
    tabId: normalizedTabId,
    visible,
  });
}

function updatePanelVisibilityForPort(port, visible) {
  if (!port) {
    return;
  }
  const existing = debugState.panelStateByPort.get(port) || {};
  debugState.panelStateByPort.set(port, {
    tabId: normalizeTabId(existing.tabId),
    visible: visible === true,
  });
}

function clearPanelStateForPort(port) {
  if (!port) {
    return;
  }
  debugState.panelStateByPort.delete(port);
}

function countVisiblePanelsForTab(tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return 0;
  }
  const ports = getPortsForTab(normalizedTabId);
  if (!ports || ports.size === 0) {
    return 0;
  }
  let visibleCount = 0;
  for (const port of ports) {
    const panelState = debugState.panelStateByPort.get(port);
    if (!panelState || panelState.visible !== false) {
      visibleCount += 1;
    }
  }
  return visibleCount;
}

function isUpPanelVisibleForTab(tabId) {
  return countVisiblePanelsForTab(tabId) > 0;
}

function hasAnyVisibleUpPanel() {
  for (const portState of debugState.panelStateByPort.values()) {
    if (!portState || portState.visible === false) {
      continue;
    }
    return true;
  }
  return false;
}

function flowHasNetworkCaptureEnabled(flow) {
  const captureNetwork =
    flow?.context && typeof flow.context === "object" && Object.prototype.hasOwnProperty.call(flow.context, "captureNetwork")
      ? flow.context.captureNetwork === true
      : false;
  return captureNetwork;
}

function shouldRetainFlowEvent(flow) {
  if (!flow) {
    return false;
  }
  if (flowHasNetworkCaptureEnabled(flow)) {
    // HAR/recording flows always retain events, even when UP is hidden.
    return true;
  }
  // Non-recording flows are retained only while any UP panel is visible.
  return hasAnyVisibleUpPanel();
}

function shouldAllowNetworkCaptureForFlow(flow, tabId) {
  if (!flow || !flowHasNetworkCaptureEnabled(flow)) {
    return false;
  }
  const normalizedTabId = normalizeTabId(tabId || flow?.tabId || 0);
  const keepNetworkWhenHidden =
    flow?.context && typeof flow.context === "object" && flow.context.keepNetworkWhenHidden === true;
  if (keepNetworkWhenHidden) {
    return true;
  }
  return isUpPanelVisibleForTab(normalizedTabId);
}

function consumeRuntimeLastError() {
  try {
    const runtimeError = chrome.runtime?.lastError;
    return runtimeError ? String(runtimeError.message || runtimeError) : "";
  } catch {
    return "";
  }
}

function postToPortSafe(port, payload) {
  try {
    port.postMessage(payload);
  } catch {
    consumeRuntimeLastError();
    // Ignore disconnected ports.
  }
}

function postFlowEventToTabPorts(tabId, payload) {
  const ports = getPortsForTab(tabId);
  if (!ports || ports.size === 0) {
    return;
  }

  for (const port of ports) {
    const panelState = debugState.panelStateByPort.get(port);
    if (panelState && panelState.visible === false) {
      continue;
    }
    postToPortSafe(port, payload);
  }
}

function postFlowEventToAllSubscribedPorts(payload, options = {}) {
  const excludedTabId = normalizeTabId(options.excludeTabId);
  const deliveredPorts = new Set();
  for (const [tabIdRaw, ports] of debugState.portsByTabId.entries()) {
    const tabId = normalizeTabId(tabIdRaw);
    if (excludedTabId && tabId === excludedTabId) {
      continue;
    }
    if (!ports || ports.size === 0) {
      continue;
    }
    for (const port of ports) {
      if (!port || deliveredPorts.has(port)) {
        continue;
      }
      const panelState = debugState.panelStateByPort.get(port);
      if (panelState && panelState.visible === false) {
        continue;
      }
      deliveredPorts.add(port);
      postToPortSafe(port, payload);
    }
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

function shouldMirrorPassEventToAllPorts(event) {
  if (!event || typeof event !== "object") {
    return false;
  }

  const service = String(event.service || "").trim().toLowerCase();
  if (
    service === "cm" ||
    service.includes("cmu") ||
    service.includes("esm") ||
    service.includes("mvpd") ||
    service.includes("rest") ||
    service.includes("degrad") ||
    service.includes("decision")
  ) {
    return true;
  }

  const requestScope = String(event.requestScope || "").trim().toLowerCase();
  if (
    requestScope.includes("cm") ||
    requestScope.includes("esm") ||
    requestScope.includes("mvpd") ||
    requestScope.includes("rest") ||
    requestScope.includes("degrad") ||
    requestScope.includes("decision")
  ) {
    return true;
  }

  const phase = String(event.phase || "").trim().toLowerCase();
  if (
    phase.startsWith("cm-") ||
    phase.includes("cmu") ||
    phase.includes("esm") ||
    phase.includes("mvpd") ||
    phase.startsWith("restv2-") ||
    phase.startsWith("token-") ||
    phase.startsWith("profiles-")
  ) {
    return true;
  }

  const workspaceHint = String(event.workspaceKey || event.workspaceOrigin || "").trim().toLowerCase();
  if (
    workspaceHint.includes("cm") ||
    workspaceHint.includes("esm") ||
    workspaceHint.includes("mvpd") ||
    workspaceHint.includes("rest") ||
    workspaceHint.includes("degrad")
  ) {
    return true;
  }

  const urlHints = [event.url, event.endpointUrl, event.loginUrl]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
  return /(?:cm-reports|config)\.adobeprimetime\.com|(?:sp|api)\.auth\.adobe\.com|mgmt\.auth\.adobe\.com|experience\.adobe\.com|\/cmu?\/|\/esm\/|\/api\/v2\/|\/authenticate\/|\/o\//i.test(
    urlHints
  );
}

function appendFlowEvent(flow, event) {
  if (!flow || !event || typeof event !== "object") {
    return null;
  }
  if (!shouldRetainFlowEvent(flow)) {
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
  if (shouldMirrorPassEventToAllPorts(normalizedEvent)) {
    postFlowEventToAllSubscribedPorts(
      {
        type: "pass-event",
        tabId: normalizeTabId(flow.tabId),
        flowId: flow.flowId,
        event: normalizedEvent,
      },
      { excludeTabId: flow.tabId }
    );
  }

  return normalizedEvent;
}

async function syncDebuggerAttachmentForTab(tabId, reason = "") {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }
  const flow = getFlowByTabId(normalizedTabId);
  if (!flow) {
    if (debugState.debuggerAttachedTabIds.has(normalizedTabId)) {
      await detachDebuggerForTab(normalizedTabId, reason || "flow-missing");
    }
    return;
  }
  const shouldAttach = shouldAllowNetworkCaptureForFlow(flow, normalizedTabId);
  if (shouldAttach) {
    await ensureDebuggerAttachedForTab(normalizedTabId, flow);
    return;
  }
  if (debugState.debuggerAttachedTabIds.has(normalizedTabId)) {
    await detachDebuggerForTab(normalizedTabId, reason || "network-capture-disabled");
  }
}

async function ensureDebuggerAttachedForTab(tabId, flow) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }
  if (!shouldAllowNetworkCaptureForFlow(flow, normalizedTabId)) {
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
  const captureNetwork = !(
    (metadata && typeof metadata === "object" && metadata.eventsOnly === true) ||
    (metadata && typeof metadata === "object" && metadata.captureNetwork === false)
  );
  if (metadata && typeof metadata === "object") {
    const nextContext = flow.context && typeof flow.context === "object" ? { ...flow.context } : {};
    const contextFields = ["requestorId", "mvpd", "loginUrl", "redirectUrl", "serviceType", "tenantScope"];
    for (const field of contextFields) {
      const value = metadata[field];
      if (value === undefined || value === null || value === "") {
        continue;
      }
      nextContext[field] = String(value);
    }
    nextContext.captureNetwork = captureNetwork;
    nextContext.eventsOnly = !captureNetwork;
    nextContext.keepNetworkWhenHidden =
      metadata.keepNetworkWhenHidden === undefined ? captureNetwork : metadata.keepNetworkWhenHidden === true;
    flow.context = nextContext;
  } else {
    const nextContext = flow.context && typeof flow.context === "object" ? { ...flow.context } : {};
    nextContext.captureNetwork = captureNetwork;
    nextContext.eventsOnly = !captureNetwork;
    nextContext.keepNetworkWhenHidden = captureNetwork;
    flow.context = nextContext;
  }
  debugState.flowIdByTabId.set(normalizedTabId, flow.flowId);
  appendFlowEvent(flow, {
    source: "extension",
    phase: "tab-bound",
    tabId: normalizedTabId,
    captureNetwork,
    ...metadata,
  });

  await syncDebuggerAttachmentForTab(normalizedTabId, captureNetwork ? "tab-bound" : "events-only-flow");
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

  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }

  if (!/^https?:$/i.test(parsed.protocol)) {
    // Ignore extension/document noise (chrome-extension://, data:, blob:, about:, etc).
    return true;
  }

  const redirectUrl = String(flow?.context?.redirectUrl || "").trim();
  if (!redirectUrl) {
    return false;
  }

  let redirectParsed;
  try {
    redirectParsed = new URL(redirectUrl);
  } catch {
    return false;
  }

  if (parsed.origin !== redirectParsed.origin) {
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
  if (!shouldAllowNetworkCaptureForFlow(flow, tabId)) {
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

function subscribePortToTab(port, tabId, options = {}) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  setPanelStateForPort(port, normalizedTabId, {
    visible: options.visible === undefined ? true : options.visible === true,
  });
  const portSet = debugState.portsByTabId.get(normalizedTabId) || new Set();
  portSet.add(port);
  debugState.portsByTabId.set(normalizedTabId, portSet);
  sendFlowSnapshotToTabPorts(normalizedTabId);
  void syncDebuggerAttachmentForTab(normalizedTabId, "panel-subscribed");
}

function unsubscribePortFromTab(port, tabId) {
  const normalizedTabId = normalizeTabId(tabId);
  if (!normalizedTabId) {
    return;
  }

  const portSet = debugState.portsByTabId.get(normalizedTabId);
  if (!portSet) {
    clearPanelStateForPort(port);
    return;
  }

  portSet.delete(port);
  if (portSet.size === 0) {
    debugState.portsByTabId.delete(normalizedTabId);
  }
  clearPanelStateForPort(port);
  void syncDebuggerAttachmentForTab(normalizedTabId, "panel-unsubscribed");
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
  void ensureBlondieTimeRuntimeConsistency();
  void ensureImsLoginRedirectRule();
  void ensureUnderparEsmDeeplinkRedirectRule();
  void ensureUnderparBtDeeplinkRedirectRule();
  void ensureUnderparDegradationDeeplinkRedirectRule();
  void ensureUnderparCmDeeplinkRedirectRule();
  void updateActionBadge();
  void syncBuildInfo(`onInstalled:${details?.reason || "unknown"}`);
});

chrome.runtime.onStartup.addListener(() => {
  void configureSidePanelBehavior();
  void ensureBlondieTimeRuntimeConsistency();
  void ensureImsLoginRedirectRule();
  void ensureUnderparEsmDeeplinkRedirectRule();
  void ensureUnderparBtDeeplinkRedirectRule();
  void ensureUnderparDegradationDeeplinkRedirectRule();
  void ensureUnderparCmDeeplinkRedirectRule();
  void updateActionBadge();
  void syncBuildInfo("onStartup");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === UNDERPAR_BLONDIE_TIME_DEEPLINK_REQUEST_TYPE) {
    void readBlondieTimeState()
      .then((timerState) => focusBlondieTimeWorkspace(Number(timerState?.targetWindowId || 0)))
      .then((workspaceTab) => {
        sendResponse({
          ok: Boolean(workspaceTab?.id),
          tabId: Number(workspaceTab?.id || 0),
          windowId: Number(workspaceTab?.windowId || 0),
        });
      })
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true;
  }

  if (message?.type === UNDERPAR_BLONDIE_TIME_MESSAGE_TYPE && message?.channel === "runtime-command") {
    void (async () => {
      const action = String(message?.action || "").trim().toLowerCase();
      if (action === "query") {
        const timerState = await ensureBlondieTimeRuntimeConsistency();
        return {
          ok: true,
          state: timerState,
        };
      }
      if (action === "start") {
        const timerState = await startBlondieTime(message);
        return {
          ok: true,
          state: timerState,
        };
      }
      if (action === "cancel") {
        const reason = String(message?.reason || "manual").trim();
        const timerState = await stopBlondieTime(reason, {
          clearError: reason === "manual",
        });
        return {
          ok: true,
          state: timerState,
        };
      }
      return {
        ok: false,
        error: `Unsupported Blondie Time action: ${action || "unknown"}`,
      };
    })()
      .then((result) => {
        sendResponse(result && typeof result === "object" ? result : { ok: true });
      })
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true;
  }

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

  if (message?.type === IMS_FETCH_REQUEST_TYPE || message?.type === LEGACY_IMS_FETCH_REQUEST_TYPE) {
    void fetchImsRelayResponse(message || {})
      .then((response) => {
        sendResponse({ ok: true, response });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (message?.type === CM_FETCH_REQUEST_TYPE || message?.type === LEGACY_CM_FETCH_REQUEST_TYPE) {
    void fetchCmRelayResponse(message || {})
      .then((response) => {
        sendResponse({ ok: true, response });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (message?.type === SPLUNK_FETCH_REQUEST_TYPE || message?.type === LEGACY_SPLUNK_FETCH_REQUEST_TYPE) {
    void fetchSplunkRelayResponse(message || {})
      .then((response) => {
        sendResponse({ ok: true, response });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (
    message?.type === UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE ||
    message?.type === LEGACY_UNDERPAR_NETWORK_ACTIVITY_MESSAGE_TYPE
  ) {
    sendResponse({
      ok: true,
      activity: applyUnderparNetworkActivityDelta(message?.delta || 0, message?.context || ""),
    });
    return false;
  }

  if (message?.type === CONSOLE_LOG_RELAY_REQUEST_TYPE) {
    const text = String(message?.message || "").trim();
    const details = message?.details && typeof message.details === "object" ? message.details : null;
    if (text) {
      if (details) {
        console.log(`[UnderPAR][Sidepanel] ${text}`, details);
      } else {
        console.log(`[UnderPAR][Sidepanel] ${text}`);
      }
    }
    sendResponse({ ok: true });
    return false;
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

  if (message?.type === `${DEBUG_MESSAGE_TYPE_PREFIX}getFlow` || message?.type === `${LEGACY_DEBUG_MESSAGE_TYPE_PREFIX}getFlow`) {
    const flow = getFlowById(message?.flowId || "");
    sendResponse({
      ok: true,
      flow: flow ? serializeFlow(flow) : null,
    });
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
  if (!port || (port.name !== SIDEPANEL_SESSION_PORT_NAME && port.name !== UP_DEVTOOLS_STATUS_PORT_NAME)) {
    return;
  }

  if (port.name === UP_DEVTOOLS_STATUS_PORT_NAME) {
    controllerBridgeState.devtoolsStatusPorts.add(port);
    postToPortSafe(port, {
      type: "controller-status",
      status: buildUnderparControllerStatusSnapshot(),
    });

    const onDisconnect = () => {
      consumeRuntimeLastError();
      controllerBridgeState.devtoolsStatusPorts.delete(port);
      port.onDisconnect.removeListener(onDisconnect);
    };

    port.onDisconnect.addListener(onDisconnect);
    return;
  }

  controllerBridgeState.sidepanelStateByPort.set(port, {
    windowId: 0,
    sessionReady: false,
    restricted: false,
    bootstrapping: true,
    reportedAt: 0,
  });
  broadcastUnderparControllerStatus();
  postToPortSafe(port, {
    type: "network-activity",
    activity: buildUnderparNetworkActivitySnapshot(),
  });

  const onMessage = (message) => {
    if (!message || typeof message !== "object" || message.type !== "session-state") {
      return;
    }

    controllerBridgeState.sidepanelStateByPort.set(port, {
      windowId: normalizeWindowId(message.windowId),
      sessionReady: message.sessionReady === true,
      restricted: message.restricted === true,
      bootstrapping: message.bootstrapping === true,
      reportedAt: Date.now(),
    });
    broadcastUnderparControllerStatus();
  };

  const onDisconnect = () => {
    consumeRuntimeLastError();
    const previousState = controllerBridgeState.sidepanelStateByPort.get(port) || null;
    const previousWindowId = normalizeWindowId(previousState?.windowId);
    controllerBridgeState.sidepanelStateByPort.delete(port);
    broadcastUnderparControllerStatus();

    if (previousWindowId) {
      if (countTrackedSidepanelsForWindow(previousWindowId) === 0) {
        void closeUnderparWorkspaceTabs({
          reason: "sidepanel-disconnect",
          windowId: previousWindowId,
        });
      }
    } else if (controllerBridgeState.sidepanelStateByPort.size === 0) {
      void closeUnderparWorkspaceTabs({
        reason: "sidepanel-disconnect",
      });
    }

    port.onMessage.removeListener(onMessage);
    port.onDisconnect.removeListener(onDisconnect);
  };

  port.onMessage.addListener(onMessage);
  port.onDisconnect.addListener(onDisconnect);
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
        subscribePortToTab(port, subscribedTabId, {
          visible: message.visible !== false,
        });
        void restoreFlowForTabFromStorage(subscribedTabId).then((restored) => {
          if (restored) {
            sendFlowSnapshotToTabPorts(subscribedTabId);
            void syncDebuggerAttachmentForTab(subscribedTabId, "panel-subscribe-restore");
          }
        });
      }
      return;
    }

    if (message.type === "panel-visibility") {
      const tabForVisibility = normalizeTabId(message.tabId || subscribedTabId);
      if (!tabForVisibility) {
        return;
      }
      const isVisible = message.visible === true;
      updatePanelVisibilityForPort(port, isVisible);
      if (isVisible) {
        sendFlowSnapshotToTabPorts(tabForVisibility);
      }
      void syncDebuggerAttachmentForTab(tabForVisibility, "panel-visibility-change");
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
    consumeRuntimeLastError();
    if (subscribedTabId) {
      unsubscribePortFromTab(port, subscribedTabId);
    } else {
      clearPanelStateForPort(port);
    }
    port.onMessage.removeListener(onMessage);
    port.onDisconnect.removeListener(onDisconnect);
  };

  port.onMessage.addListener(onMessage);
  port.onDisconnect.addListener(onDisconnect);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (String(alarm?.name || "") !== UNDERPAR_BLONDIE_TIME_ALARM_NAME) {
    return;
  }
  void handleBlondieTimeAlarm();
});

chrome.notifications.onClicked.addListener((notificationId) => {
  if (String(notificationId || "") !== UNDERPAR_BLONDIE_TIME_NOTIFICATION_ID) {
    return;
  }
  void readBlondieTimeState().then((timerState) => {
    return focusBlondieTimeWorkspace(Number(timerState?.targetWindowId || 0));
  });
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (String(notificationId || "") !== UNDERPAR_BLONDIE_TIME_NOTIFICATION_ID || Number(buttonIndex || 0) !== 0) {
    return;
  }
  void readBlondieTimeState().then((timerState) => {
    return focusBlondieTimeWorkspace(Number(timerState?.targetWindowId || 0));
  });
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
void ensureBlondieTimeRuntimeConsistency();
void ensureImsLoginRedirectRule();
void ensureUnderparEsmDeeplinkRedirectRule();
void ensureUnderparDegradationDeeplinkRedirectRule();
void ensureUnderparCmDeeplinkRedirectRule();
void updateActionBadge();
void syncBuildInfo("serviceWorkerStart");
void restoreDebugStateFromStorage().then(() => reattachDebuggersFromState());
