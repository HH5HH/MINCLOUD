const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const BRIDGE_PATH = path.join(ROOT, "saved-query-bridge.js");

function extractBetweenMarkers(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `Unable to locate start marker: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(end, -1, `Unable to locate end marker: ${endMarker}`);
  return source.slice(start, end).trim();
}

test("saved query bridge proxies MEG workspace actions to the runtime listener", async () => {
  const source = fs.readFileSync(BRIDGE_PATH, "utf8");
  let messageHandler = null;
  let runtimeMessage = null;

  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    URLSearchParams,
    localStorage: {
      length: 0,
      key() {
        return null;
      },
      getItem() {
        return null;
      },
      setItem() {},
      removeItem() {},
    },
    chrome: {
      runtime: {
        async sendMessage(message) {
          runtimeMessage = message;
          return {
            ok: true,
            fileName: "esm_export.html",
            format: "html",
          };
        },
      },
      storage: {
        local: {
          async get() {
            return {};
          },
          async set() {},
        },
      },
    },
    window: {
      addEventListener(type, handler) {
        if (type === "message") {
          messageHandler = handler;
        }
      },
    },
  };

  vm.runInNewContext(source, context, { filename: BRIDGE_PATH });
  assert.equal(typeof messageHandler, "function");

  const response = await new Promise((resolve) => {
    messageHandler({
      data: {
        type: "underpar:meg-saved-query-bridge",
        requestId: "req-1",
        action: "workspace-action",
        payload: {
          workspaceAction: "download-export",
          workspacePayload: {
            url: "/esm/v3/media-company/year?requestor-id",
            format: "html",
          },
        },
      },
      source: {
        postMessage(message) {
          resolve(message);
        },
      },
    });
  });

  assert.equal(
    JSON.stringify(runtimeMessage),
    JSON.stringify({
      type: "underpar:meg-workspace",
      channel: "workspace-action",
      action: "download-export",
      payload: {
        url: "/esm/v3/media-company/year?requestor-id",
        format: "html",
      },
    })
  );
  assert.equal(response.type, "underpar:meg-saved-query-bridge:response");
  assert.equal(response.requestId, "req-1");
  assert.equal(response.ok, true);
  assert.equal(response.result?.fileName, "esm_export.html");
  assert.equal(response.result?.format, "html");
});

test("saved query bridge fallback derives chromiumapp esm deeplinks from chrome-extension bridge URLs", () => {
  const source = fs.readFileSync(BRIDGE_PATH, "utf8");
  const script = [
    'const UNDERPAR_ESM_DEEPLINK_BRIDGE_PATH = "esm-deeplink-bridge.html";',
    'const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";',
    'const UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE = "esm-bridge";',
    'const UNDERPAR_ESM_NODE_PATH_PREFIX = "/esm/v3/media-company";',
    'const DEFAULT_ADOBEPASS_ENVIRONMENT = { key: "release-production", label: "Production", mgmtBase: "https://mgmt.auth.adobe.com", esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/" };',
    "function resolveBridgeAdobePassEnvironment(environment = null) { return environment || DEFAULT_ADOBEPASS_ENVIRONMENT; }",
    "function stripSavedQueryScopedQueryParams(rawUrl = \"\") { return String(rawUrl || \"\").trim(); }",
    extractBetweenMarkers(source, "function buildUnderparEsmRequestPath(", "function normalizeUnderparEsmRequestPath("),
    extractBetweenMarkers(source, "function normalizeUnderparEsmRequestPath(", "function getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl("),
    extractBetweenMarkers(source, "function getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl(", "function rewriteMegWorkspaceHtmlExportLinks("),
    "module.exports = { buildUnderparDirectEsmBridgeUrl };",
  ].join("\n\n");

  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    URLSearchParams,
    chrome: {
      runtime: {
        getURL(resourcePath) {
          return `chrome-extension://underpar-runtime/${String(resourcePath || "")}`;
        },
      },
    },
  };
  vm.runInNewContext(script, context, { filename: BRIDGE_PATH });

  const deeplinkUrl = context.module.exports.buildUnderparDirectEsmBridgeUrl("/esm/v3/media-company/year/month/day/event", {
    programmerId: "Turner",
    programmerName: "Turner",
    environmentKey: "release-production",
    environmentLabel: "Production",
    source: "megspace-html-export",
    createdAt: 1773635449683,
  });

  const parsed = new URL(deeplinkUrl);
  assert.equal(parsed.protocol, "https:");
  assert.equal(parsed.host, "underpar-runtime.chromiumapp.org");
  assert.equal(parsed.searchParams.get("underpar_deeplink"), "esm-bridge");
  assert.equal(parsed.searchParams.get("requestPath"), "/esm/v3/media-company/year/month/day/event");
  assert.equal(parsed.searchParams.get("programmerId"), "Turner");
  assert.equal(parsed.searchParams.get("source"), "megspace-html-export");
});
