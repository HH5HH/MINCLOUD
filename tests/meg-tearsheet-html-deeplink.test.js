const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function extractFunctionSource(source, functionName) {
  const marker = `function ${functionName}(`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Unable to locate ${functionName}`);
  const bodyStart = source.indexOf("{", start);
  assert.notEqual(bodyStart, -1, `Unable to locate body for ${functionName}`);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }
  throw new Error(`Unterminated function: ${functionName}`);
}

function extractBetweenMarkers(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `Unable to locate start marker: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(end, -1, `Unable to locate end marker: ${endMarker}`);
  return source.slice(start, end).trim();
}

function loadPopupMegSnapshotHelper(seed = {}) {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const chrome = globalThis.__seed.chrome;',
    extractBetweenMarkers(
      source,
      "function buildMegWorkspaceTearsheetSnapshot(",
      "function buildMegWorkspaceTearsheetFileName("
    ),
    "module.exports = { buildMegWorkspaceTearsheetSnapshot };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
    firstNonEmptyString(values = []) {
      for (const value of Array.isArray(values) ? values : []) {
        const text = String(value ?? "").trim();
        if (text) {
          return text;
        }
      }
      return "";
    },
    stripMegWorkspaceMediaCompanyQueryParam(value = "") {
      return String(value || "").trim();
    },
    getActiveAdobePassEnvironment() {
      return {
        key: "release-production",
        label: "Production",
      };
    },
    cloneJsonLikeValue(value, fallback = null) {
      if (value == null) {
        return fallback;
      }
      return JSON.parse(JSON.stringify(value));
    },
    buildUnderparTearsheetExportPayload() {
      return { workspaceKey: "esm" };
    },
    popupGetSavedEsmQueryRecords() {
      return [];
    },
    resolveSelectedProgrammer() {
      return null;
    },
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupMegTearsheetPatchScriptBuilder() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    extractBetweenMarkers(
      source,
      "function buildMegWorkspaceTearsheetHtmlPatchScript(",
      "function buildMegWorkspaceTearsheetHtml("
    ),
    "module.exports = { buildMegWorkspaceTearsheetHtmlPatchScript };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadMegStandaloneBridgeHelpers(seed = {}) {
  const filePath = path.join(ROOT, "meg-workspace.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const UNDERPAR_ESM_DEEPLINK_WORKSPACE_PATH = "esm-workspace.html";',
    'const UNDERPAR_ESM_DEEPLINK_BRIDGE_PATH = "esm-deeplink-bridge.html";',
    'const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";',
    'const UNDERPAR_ESM_DEEPLINK_BRIDGE_MARKER_VALUE = "esm-bridge";',
    'const UNDERPAR_ESM_NODE_PATH_PREFIX = "/esm/v3/media-company";',
    'const DEFAULT_ADOBEPASS_ENVIRONMENT = { key: "release-production", label: "Production", mgmtBase: "https://mgmt.auth.adobe.com", esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/" };',
    "const state = globalThis.__seed.state || { adobePassEnvironment: { ...DEFAULT_ADOBEPASS_ENVIRONMENT } };",
    "function getMegWorkspacePayload() { return globalThis.__seed.payload || {}; }",
    "function buildFallbackEnvironmentFromInputs() { return { ...DEFAULT_ADOBEPASS_ENVIRONMENT }; }",
    extractBetweenMarkers(source, "function stripMegScopedQueryParams(", "function stripMegMediaCompanyQueryParam("),
    extractBetweenMarkers(
      source,
      "function stripMegMediaCompanyQueryParam(",
      "function buildMegStandaloneUnderparEsmRequestPath("
    ),
    extractBetweenMarkers(
      source,
      "function buildMegStandaloneUnderparEsmRequestPath(",
      "function logMegConsoleUrl("
    ),
    "module.exports = { getMegStandaloneUnderparEsmBridgeUrl, normalizeMegStandaloneUnderparEsmRequestPath, buildMegStandaloneUnderparDirectEsmBridgeUrl };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    URLSearchParams,
    __seed: seed,
    chrome: seed.chrome || {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadMegStandaloneSendWorkspaceAction(seed = {}) {
  const filePath = path.join(ROOT, "meg-workspace.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const MEG_WORKSPACE_MESSAGE_TYPE = "underpar:meg-workspace";',
    "const state = globalThis.__seed.state || {};",
    "const chrome = globalThis.__seed.chrome || { runtime: { sendMessage: async () => ({ ok: true }) } };",
    "function isMegStandaloneMode() { return globalThis.__seed.isMegStandaloneMode !== false; }",
    "function canUseMegSavedQueryBridge() { return globalThis.__seed.canUseMegSavedQueryBridge === true; }",
    "function buildMegStandaloneControllerState() { return globalThis.__seed.controllerState || {}; }",
    "function getMegStandaloneSelectionPayload() { return globalThis.__seed.selection || null; }",
    'function getProgrammerLabel() { return globalThis.__seed.programmerLabel || "Turner"; }',
    "function getEmbeddedInputValue(name) { return (globalThis.__seed.inputs || {})[name] || \"\"; }",
    "function getMegToken() { return globalThis.__seed.megToken || \"\"; }",
    "function setMegToken(value) { globalThis.__seed.updatedMegToken = value; }",
    "function normalizeMegExportFormat(value, fallback = \"\") { return globalThis.__seed.normalizeMegExportFormat ? globalThis.__seed.normalizeMegExportFormat(value, fallback) : (String(value || fallback || \"\").trim().toLowerCase() || fallback); }",
    "async function requestMegSavedQueryBridge(action, payload) { return globalThis.__seed.requestMegSavedQueryBridge(action, payload); }",
    "async function megStandaloneFetchResponse(url, format) { return globalThis.__seed.megStandaloneFetchResponse(url, format); }",
    "function megWorkspaceDownloadFile(payloadText, fileName, mimeType) { globalThis.__seed.downloads.push({ payloadText, fileName, mimeType }); }",
    "function sanitizeMegDownloadSegment(value = \"\") { return globalThis.__seed.sanitizeMegDownloadSegment ? globalThis.__seed.sanitizeMegDownloadSegment(value) : String(value || \"\"); }",
    "function rewriteMegStandaloneHtmlExportLinks(htmlText, context = {}) { return globalThis.__seed.rewriteMegStandaloneHtmlExportLinks ? globalThis.__seed.rewriteMegStandaloneHtmlExportLinks(htmlText, context) : htmlText; }",
    "function getMegStandaloneUnderparEsmBridgeUrl() { return globalThis.__seed.bridgeUrl || \"\"; }",
    extractBetweenMarkers(source, "async function sendWorkspaceAction(", "function sanitizeMegDownloadSegment("),
    "module.exports = { sendWorkspaceAction };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: {
      downloads: [],
      ...seed,
    },
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return {
    ...context.module.exports,
    seed: context.__seed,
  };
}

function loadMegStandaloneExportMeg(seed = {}) {
  const filePath = path.join(ROOT, "meg-workspace.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "function normalizeMegExportFormat(value, fallback = \"\") { return globalThis.__seed.normalizeMegExportFormat ? globalThis.__seed.normalizeMegExportFormat(value, fallback) : (String(value || fallback || \"\").trim().toLowerCase() || fallback); }",
    "function ensureMegWorkspaceAccess(reason = \"\") { globalThis.__seed.accessChecks.push(reason); return globalThis.__seed.ensureMegWorkspaceAccess ? globalThis.__seed.ensureMegWorkspaceAccess(reason) : true; }",
    "function isMegStandaloneMode() { return globalThis.__seed.isMegStandaloneMode !== false; }",
    "async function downloadMegStandaloneHtmlExport(rawUrl = \"\") { return globalThis.__seed.downloadMegStandaloneHtmlExport(rawUrl); }",
    "async function sendWorkspaceAction(action, payload = {}) { return globalThis.__seed.sendWorkspaceAction(action, payload); }",
    "function setStatus(message) { globalThis.__seed.statuses.push(String(message || \"\")); }",
    "function ack(message) { globalThis.__seed.acks.push(String(message || \"\")); }",
    "function bonk(message, options = {}) { globalThis.__seed.bonks.push({ message: String(message || \"\"), options }); }",
    "const fldEsmUrl = globalThis.__seed.fldEsmUrl || { value: \"\" };",
    extractBetweenMarkers(source, "async function exportMeg(", "async function exportMegTearsheet("),
    "module.exports = { exportMeg, exportMegHtml };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: {
      accessChecks: [],
      statuses: [],
      acks: [],
      bonks: [],
      ...seed,
    },
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return {
    ...context.module.exports,
    seed: context.__seed,
  };
}

function loadMegExportPack(seed = {}) {
  const filePath = path.join(ROOT, "meg-workspace.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const MEG_EXPORT_FORMATS = Object.freeze([\"csv\", \"json\", \"xml\", \"html\"]);",
    "function normalizeMegExportFormat(value, fallback = \"\") { return globalThis.__seed.normalizeMegExportFormat ? globalThis.__seed.normalizeMegExportFormat(value, fallback) : (String(value || fallback || \"\").trim().toLowerCase() || fallback); }",
    "function beginSavedQueryFlow() { globalThis.__seed.savedQueryFlowCount += 1; }",
    "async function exportMeg(format = \"csv\") { globalThis.__seed.exportMegCalls.push(String(format || \"\")); }",
    "async function exportMegHtml() { globalThis.__seed.exportMegHtmlCalls += 1; }",
    "const document = globalThis.__seed.document;",
    extractBetweenMarkers(source, "function buildMegExportPack(", "function renderRetroNavigation("),
    "module.exports = { buildMegExportPack };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: {
      savedQueryFlowCount: 0,
      exportMegCalls: [],
      exportMegHtmlCalls: 0,
      ...seed,
    },
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return {
    ...context.module.exports,
    seed: context.__seed,
  };
}

test("MEGTOOL tearsheet snapshot embeds the UnderPAR ESM bridge URL for standalone HTML exports", () => {
  const helpers = loadPopupMegSnapshotHelper({
    chrome: {
      runtime: {
        getURL(resourcePath) {
          return `chrome-extension://underpar-runtime/${String(resourcePath || "")}`;
        },
      },
    },
  });

  const snapshot = helpers.buildMegWorkspaceTearsheetSnapshot(
    {
      programmer: {
        programmerId: "foxsports",
        programmerName: "FOX Sports",
      },
    },
    {
      currentUrl: "/esm/v3/media-company/year?requestor-id",
    }
  );

  assert.equal(snapshot.underparEsmBridgeUrl, "chrome-extension://underpar-runtime/esm-deeplink-bridge.html");
});

test("MEGTOOL tearsheet generator emits a dedicated HTML export parity patch", () => {
  const helpers = loadPopupMegTearsheetPatchScriptBuilder();
  const patchScript = helpers.buildMegWorkspaceTearsheetHtmlPatchScript();

  assert.match(patchScript, /installMegTearsheetHtmlExportPatch/);
  assert.match(patchScript, /patchedMegTearsheetExportMegHtml/);
  assert.match(patchScript, /patchedMegTearsheetExportMeg/);
  assert.match(patchScript, /normalizedAction === "download-export"/);
  assert.match(patchScript, /rewriteMegPatchHtmlExportLinks/);
  assert.match(patchScript, /underpar_deeplink/);
  assert.match(patchScript, /parsedBridgeUrl\.protocol === "chrome-extension:"/);
  assert.match(patchScript, /chromiumapp\.org/);
  assert.match(patchScript, /noopener noreferrer/);
  assert.doesNotMatch(patchScript, /createElement\("iframe"\)/);
  assert.match(patchScript, /megStandaloneFetchResponse/);
});

test("standalone MEGTOOL bridge helper converts exported ESM links into chromiumapp esm-bridge deeplinks", () => {
  const helpers = loadMegStandaloneBridgeHelpers({
    payload: {
      underparEsmBridgeUrl: "chrome-extension://underpar-runtime/esm-deeplink-bridge.html",
    },
    state: {
      adobePassEnvironment: {
        key: "release-production",
        label: "Production",
        mgmtBase: "https://mgmt.auth.adobe.com",
        esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/",
      },
    },
  });

  const deeplinkUrl = helpers.buildMegStandaloneUnderparDirectEsmBridgeUrl(
    "https://mgmt.auth.adobe.com/esm/v3/media-company/year?media-company=foxsports&requestor-id&api",
    {
      displayNodeLabel: "Year",
      programmerId: "foxsports",
      programmerName: "FOX Sports",
      environmentKey: "release-production",
      environmentLabel: "Production",
      source: "megspace-html-export",
      createdAt: 1710000000000,
    }
  );

  const parsed = new URL(deeplinkUrl);

  assert.equal(parsed.protocol, "https:");
  assert.equal(parsed.host, "underpar-runtime.chromiumapp.org");
  assert.equal(parsed.pathname, "/");
  assert.equal(parsed.searchParams.get("underpar_deeplink"), "esm-bridge");
  assert.equal(parsed.searchParams.get("requestPath"), "/esm/v3/media-company/year?requestor-id&api");
  assert.equal(parsed.searchParams.get("displayNodeLabel"), "Year");
  assert.equal(parsed.searchParams.get("programmerId"), "foxsports");
  assert.equal(parsed.searchParams.get("programmerName"), "FOX Sports");
  assert.equal(parsed.searchParams.get("environmentKey"), "release-production");
  assert.equal(parsed.searchParams.get("environmentLabel"), "Production");
  assert.equal(parsed.searchParams.get("source"), "megspace-html-export");
  assert.equal(parsed.searchParams.get("createdAt"), "1710000000000");
});

test("standalone MEGTOOL bridge helper derives the ESM bridge URL from savedQueryBridgeUrl when snapshot bridge data is missing", () => {
  const helpers = loadMegStandaloneBridgeHelpers({
    payload: {
      savedQueryBridgeUrl: "chrome-extension://underpar-runtime/saved-query-bridge.html",
    },
    state: {
      adobePassEnvironment: {
        key: "release-production",
        label: "Production",
        mgmtBase: "https://mgmt.auth.adobe.com",
        esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/",
      },
    },
  });

  assert.equal(
    helpers.getMegStandaloneUnderparEsmBridgeUrl(),
    "chrome-extension://underpar-runtime/esm-deeplink-bridge.html"
  );
});

test("standalone MEGTOOL HTML export mirrors the MEGSPACE local fetch and rewrite flow", async () => {
  let fetchCalled = false;
  let bridgeCalled = false;
  let rewriteArgs = null;
  const helpers = loadMegStandaloneSendWorkspaceAction({
    state: {
      programmerId: "turner",
      programmerName: "Turner",
      requestorIds: ["requestor-id"],
      mvpdIds: ["all"],
      adobePassEnvironment: {
        key: "release-production",
        label: "Production",
      },
    },
    inputs: {
      mgmt_base: "https://mgmt.auth.adobe.com",
      sp_base: "https://sp.auth.adobe.com",
      cid: "client-id",
      csc: "client-secret",
    },
    megToken: "seed-token",
    requestMegSavedQueryBridge: async () => {
      bridgeCalled = true;
      throw new Error("bridge should not be used");
    },
    megStandaloneFetchResponse: async () => {
      fetchCalled = true;
      return {
        responseOk: true,
        bodyText: "<html><body>raw</body></html>",
        contentType: "text/html;charset=utf-8",
      };
    },
    rewriteMegStandaloneHtmlExportLinks: (htmlText, context) => {
      rewriteArgs = { htmlText, context };
      return "<html data-underpar='1'></html>";
    },
  });

  const result = await helpers.sendWorkspaceAction("download-export", {
    url: "/esm/v3/media-company/year/month/day?requestor-id",
    format: "html",
  });

  assert.equal(result?.ok, true);
  assert.equal(result?.format, "html");
  assert.equal(fetchCalled, true);
  assert.equal(bridgeCalled, false);
  assert.equal(rewriteArgs?.htmlText, "<html><body>raw</body></html>");
  assert.equal(rewriteArgs?.context?.programmerId, "turner");
  assert.equal(rewriteArgs?.context?.programmerName, "Turner");
  assert.equal(rewriteArgs?.context?.environmentKey, "release-production");
  assert.equal(rewriteArgs?.context?.environmentLabel, "Production");
  assert.equal(rewriteArgs?.context?.source, "megspace-html-export");
  assert.equal(helpers.seed.downloads.length, 1);
  assert.equal(helpers.seed.downloads[0].payloadText, "<html data-underpar='1'></html>");
  assert.match(String(helpers.seed.downloads[0].fileName || ""), /^esm_Turner_\d+\.html$/);
});

test("standalone MEGTOOL HTML button routes directly through the local MEGSPACE-style HTML export helper", async () => {
  let htmlHelperUrl = "";
  let sendWorkspaceActionCalled = false;
  const helpers = loadMegStandaloneExportMeg({
    fldEsmUrl: {
      value: "/esm/v3/media-company/year/month/day?requestor-id",
    },
    downloadMegStandaloneHtmlExport: async (rawUrl) => {
      htmlHelperUrl = String(rawUrl || "");
      return {
        ok: true,
        fileName: "esm_Turner_1710000000000.html",
        format: "html",
      };
    },
    sendWorkspaceAction: async () => {
      sendWorkspaceActionCalled = true;
      throw new Error("sendWorkspaceAction should not be used for standalone HTML button export");
    },
  });

  await helpers.exportMeg("html");

  assert.equal(sendWorkspaceActionCalled, false);
  assert.equal(htmlHelperUrl, "/esm/v3/media-company/year/month/day?requestor-id");
  assert.deepEqual(helpers.seed.accessChecks, ["export HTML from MEGSPACE"]);
  assert.deepEqual(helpers.seed.statuses, ["HTML download started."]);
  assert.deepEqual(helpers.seed.acks, ["HTML download started: esm_Turner_1710000000000.html"]);
  assert.equal(helpers.seed.bonks.length, 0);
});

test("retro export pack HTML button click calls the dedicated MEGSPACE HTML export helper", () => {
  function createElement(tagName) {
    return {
      tagName: String(tagName || "").toUpperCase(),
      children: [],
      attributes: new Map(),
      className: "",
      textContent: "",
      title: "",
      innerHTML: "",
      type: "",
      listeners: {},
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      setAttribute(name, value) {
        this.attributes.set(String(name), String(value));
      },
      getAttribute(name) {
        return this.attributes.get(String(name));
      },
      addEventListener(eventName, listener) {
        this.listeners[String(eventName)] = listener;
      },
      click() {
        const listener = this.listeners.click;
        if (typeof listener === "function") {
          listener();
        }
      },
    };
  }

  const helpers = loadMegExportPack({
    document: {
      createElement,
    },
  });

  const exportPack = helpers.buildMegExportPack("retro");
  const htmlButton = exportPack.children.find((child) => child?.textContent === "HTML");
  assert.ok(htmlButton, "Expected retro export pack to include an HTML button");

  htmlButton.click();

  assert.equal(helpers.seed.exportMegHtmlCalls, 1);
  assert.deepEqual(helpers.seed.exportMegCalls, []);
});
