const UNDERPAR_ESM_DEEPLINK_STORAGE_KEY = "underpar_pending_esm_deeplink_v1";
const UNDERPAR_ESM_DEEPLINK_MAX_AGE_MS = 30 * 60 * 1000;
const UNDERPAR_ESM_DEEPLINK_REQUEST_TYPE = "underpar:openEsmWorkspaceFromDeeplink";
const UNDERPAR_ESM_NODE_PATH_PREFIX = "/esm/v3/media-company";

function buildUnderparEsmRequestPath(pathname = "", search = "", options = {}) {
  const allowBarePath = options?.allowBarePath === true;
  let normalizedPath = String(pathname || "").trim().replace(/\/+$/g, "");
  if (!normalizedPath) {
    return "";
  }
  if (/^\/?esm\/v3\/media-company(?:\/|$)/i.test(normalizedPath)) {
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }
    return `${normalizedPath}${String(search || "")}`;
  }
  if (!allowBarePath) {
    return "";
  }
  normalizedPath = normalizedPath.replace(/^\/+/, "");
  if (!normalizedPath) {
    return "";
  }
  return `${UNDERPAR_ESM_NODE_PATH_PREFIX}/${normalizedPath}${String(search || "")}`;
}

function normalizeUnderparEsmRequestPath(rawValue = "") {
  const normalized = String(rawValue || "").trim();
  if (!normalized) {
    return "";
  }
  const hasAbsoluteScheme = /^[a-z][a-z\d+.-]*:/i.test(normalized);
  try {
    const parsed = hasAbsoluteScheme ? new URL(normalized) : new URL(normalized, "https://mgmt.auth.adobe.com/esm/v3/media-company/");
    const searchParams = new URLSearchParams(parsed.search);
    searchParams.delete("media-company");
    const search = searchParams.toString();
    return buildUnderparEsmRequestPath(String(parsed.pathname || ""), search ? `?${search}` : "", {
      allowBarePath: !hasAbsoluteScheme,
    });
  } catch (_error) {
    const withoutHash = normalized.split("#")[0] || "";
    const [pathPart, queryPart = ""] = withoutHash.split("?");
    const searchParams = new URLSearchParams(queryPart);
    searchParams.delete("media-company");
    const search = searchParams.toString();
    return buildUnderparEsmRequestPath(pathPart, search ? `?${search}` : "", {
      allowBarePath: !hasAbsoluteScheme,
    });
  }
}

function parseUnderparEsmDeeplinkPayload() {
  const query = String(window.location.hash || "").startsWith("#")
    ? window.location.hash.slice(1)
    : String(window.location.search || "").replace(/^\?/, "");
  const params = new URLSearchParams(query);
  const requestPath = normalizeUnderparEsmRequestPath(params.get("requestPath") || params.get("requestUrl") || "");
  if (!requestPath) {
    return null;
  }
  return {
    requestPath,
    displayNodeLabel: String(params.get("displayNodeLabel") || "").trim(),
    programmerId: String(params.get("programmerId") || "").trim(),
    programmerName: String(params.get("programmerName") || "").trim(),
    environmentKey: String(params.get("environmentKey") || "").trim(),
    environmentLabel: String(params.get("environmentLabel") || "").trim(),
    source: String(params.get("source") || "blondie-button").trim() || "blondie-button",
    createdAt: Number(params.get("createdAt") || Date.now() || 0),
  };
}

function normalizePendingUnderparEsmDeeplinkPayload(input = null) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : null;
  if (!source) {
    return null;
  }
  const requestPath = normalizeUnderparEsmRequestPath(source.requestPath || source.requestUrl || "");
  if (!requestPath) {
    return null;
  }
  const createdAt = Math.max(0, Number(source.createdAt || Date.now() || 0));
  if (!createdAt || Date.now() - createdAt > UNDERPAR_ESM_DEEPLINK_MAX_AGE_MS) {
    return null;
  }
  return {
    requestPath,
    displayNodeLabel: String(source.displayNodeLabel || source.datasetLabel || "").trim(),
    programmerId: String(source.programmerId || "").trim(),
    programmerName: String(source.programmerName || "").trim(),
    environmentKey: String(source.environmentKey || source.adobePassEnvironmentKey || "").trim(),
    environmentLabel: String(source.environmentLabel || source.adobePassEnvironmentLabel || "").trim(),
    source: String(source.source || "blondie-button").trim() || "blondie-button",
    createdAt,
  };
}

function normalizePendingUnderparEsmDeeplinkQueue(input = null) {
  const rawEntries = Array.isArray(input) ? input : [input];
  return rawEntries
    .map((entry) => normalizePendingUnderparEsmDeeplinkPayload(entry))
    .filter(Boolean);
}

async function enqueuePendingUnderparEsmDeeplink(payload = null) {
  const normalizedPayload = normalizePendingUnderparEsmDeeplinkPayload(payload);
  if (!normalizedPayload) {
    throw new Error("This UnderPAR deeplink is missing a valid ESM request path.");
  }
  const existing = await chrome.storage.local.get(UNDERPAR_ESM_DEEPLINK_STORAGE_KEY).catch(() => ({}));
  const queue = normalizePendingUnderparEsmDeeplinkQueue(existing?.[UNDERPAR_ESM_DEEPLINK_STORAGE_KEY] || null);
  queue.push(normalizedPayload);
  await chrome.storage.local.set({
    [UNDERPAR_ESM_DEEPLINK_STORAGE_KEY]: queue,
  });
  return queue.length;
}

async function init() {
  const status = document.getElementById("status");
  const manualWrap = document.getElementById("manual-wrap");

  try {
    const payload = parseUnderparEsmDeeplinkPayload();
    if (!payload) {
      throw new Error("This UnderPAR deeplink is missing a valid ESM request path.");
    }
    status.textContent = "Sending your ESM report card to UnderPAR...";
    const topLevelBridge = (() => {
      try {
        return window.top === window.self;
      } catch {
        return true;
      }
    })();
    if (topLevelBridge) {
      const result = await chrome.runtime.sendMessage({
        type: UNDERPAR_ESM_DEEPLINK_REQUEST_TYPE,
        payload,
        closeSenderTab: true,
      });
      if (!result?.ok) {
        throw new Error(result?.error || "Unable to hand off this ESM deeplink to UnderPAR.");
      }
    } else {
      await enqueuePendingUnderparEsmDeeplink(payload);
    }
    status.textContent = "Queued in UnderPAR. Your active ESM Workspace will add this report card.";
    if (topLevelBridge) {
      window.setTimeout(() => {
        try {
          window.close();
        } catch (_error) {
          // Ignore close failures. Background also attempts cleanup for top-level bridge tabs.
        }
      }, 75);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    status.textContent = message || "Unable to open UnderPAR.";
    if (manualWrap) {
      manualWrap.hidden = false;
    }
  }
}

void init();
