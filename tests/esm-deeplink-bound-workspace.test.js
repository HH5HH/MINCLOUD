const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function extractFunctionSource(source, functionName) {
  const markers = [`async function ${functionName}(`, `function ${functionName}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start !== -1) {
      break;
    }
  }
  assert.notEqual(start, -1, `Unable to locate ${functionName}`);
  const paramsStart = source.indexOf("(", start);
  assert.notEqual(paramsStart, -1, `Unable to locate params for ${functionName}`);
  let paramsDepth = 0;
  let bodyStart = -1;
  for (let index = paramsStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "(") paramsDepth += 1;
    if (char === ")") {
      paramsDepth -= 1;
      if (paramsDepth === 0) {
        bodyStart = source.indexOf("{", index);
        break;
      }
    }
  }
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

function loadBackgroundEsmWorkspaceHelpers(seed = {}) {
  const filePath = path.join(ROOT, "background.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const UNDERPAR_ESM_WORKSPACE_PATH = "esm-workspace.html";',
    'const UNDERPAR_ESM_WORKSPACE_BINDING_STORAGE_KEY = "underpar_esm_workspace_binding_v1";',
    "const chrome = globalThis.__seed.chrome;",
    "const controllerBridgeState = globalThis.__seed.controllerBridgeState || { sidepanelStateByPort: new Map() };",
    extractFunctionSource(source, "normalizeWindowId"),
    extractFunctionSource(source, "isEsmWorkspaceTab"),
    extractFunctionSource(source, "pickBestEsmWorkspaceTab"),
    extractFunctionSource(source, "normalizePersistedEsmWorkspaceBindingRecord"),
    extractFunctionSource(source, "getPersistedEsmWorkspaceBindingRecord"),
    extractFunctionSource(source, "findPersistedBoundEsmWorkspaceTab"),
    extractFunctionSource(source, "findEsmWorkspaceTab"),
    extractFunctionSource(source, "getPreferredUnderparControllerWindowId"),
    extractFunctionSource(source, "focusEsmWorkspace"),
    extractFunctionSource(source, "handoffEsmDeeplinkToWorkspace"),
    "module.exports = { pickBestEsmWorkspaceTab, findEsmWorkspaceTab, findPersistedBoundEsmWorkspaceTab, focusEsmWorkspace, handoffEsmDeeplinkToWorkspace };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadBackgroundEsmRedirectHelpers(seed = {}) {
  const filePath = path.join(ROOT, "background.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const UNDERPAR_ESM_DEEPLINK_REDIRECT_RULE_ID = 164002;',
    'const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";',
    'const UNDERPAR_ESM_DEEPLINK_MARKER_VALUE = "esm";',
    'const UNDERPAR_ESM_DEEPLINK_BRIDGE_PATH = "esm-deeplink-bridge.html";',
    "const chrome = globalThis.__seed.chrome;",
    extractFunctionSource(source, "ensureUnderparWorkspaceDeeplinkRedirectRule"),
    extractFunctionSource(source, "ensureUnderparEsmDeeplinkRedirectRule"),
    "module.exports = { ensureUnderparWorkspaceDeeplinkRedirectRule, ensureUnderparEsmDeeplinkRedirectRule };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
    URL,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function createChromeSeed(options = {}) {
  const workspaceUrl = "chrome-extension://underpar/esm-workspace.html";
  const tabsById = new Map();
  for (const tab of options.tabsById || []) {
    tabsById.set(Number(tab.id || 0), { ...tab });
  }
  const queryResponses = new Map();
  for (const [key, value] of Object.entries(options.queryResponses || {})) {
    queryResponses.set(key, Array.isArray(value) ? value.map((tab) => ({ ...tab })) : []);
  }
  const queryCalls = [];
  const storageCalls = [];
  const updateCalls = [];
  const createCalls = [];
  const windowUpdateCalls = [];
  return {
    queryCalls,
    storageCalls,
    updateCalls,
    createCalls,
    windowUpdateCalls,
    controllerBridgeState:
      options.controllerBridgeState || {
        sidepanelStateByPort: new Map(),
      },
    chrome: {
      runtime: {
        getURL(fileName) {
          return `chrome-extension://underpar/${String(fileName || "")}`;
        },
      },
      storage: {
        local: {
          async get(key) {
            storageCalls.push(key);
            return {
              underpar_esm_workspace_binding_v1: options.binding || null,
            };
          },
        },
      },
      tabs: {
        async get(tabId) {
          const tab = tabsById.get(Number(tabId || 0));
          if (!tab) {
            throw new Error(`Missing tab ${tabId}`);
          }
          return { ...tab };
        },
        async query(queryInfo = {}) {
          const key = Object.prototype.hasOwnProperty.call(queryInfo, "windowId")
            ? `window:${Number(queryInfo.windowId || 0)}`
            : "all";
          queryCalls.push(key);
          return (queryResponses.get(key) || []).map((tab) => ({ ...tab }));
        },
        async update(tabId, updateInfo = {}) {
          updateCalls.push({ tabId: Number(tabId || 0), updateInfo: { ...updateInfo } });
          const tab = tabsById.get(Number(tabId || 0));
          if (!tab) {
            throw new Error(`Missing tab ${tabId}`);
          }
          const nextTab = { ...tab, ...updateInfo };
          tabsById.set(Number(tabId || 0), nextTab);
          return { ...nextTab };
        },
        async create(createInfo = {}) {
          createCalls.push({ ...createInfo });
          const nextTab = {
            id: 999,
            windowId: Number(createInfo.windowId || 0) || 1,
            url: String(createInfo.url || ""),
            active: createInfo.active === true,
          };
          tabsById.set(nextTab.id, nextTab);
          return { ...nextTab };
        },
      },
      windows: {
        async update(windowId, updateInfo = {}) {
          windowUpdateCalls.push({ windowId: Number(windowId || 0), updateInfo: { ...updateInfo } });
          return { id: Number(windowId || 0), ...updateInfo };
        },
      },
    },
    workspaceUrl,
  };
}

test("findEsmWorkspaceTab prefers the persisted bound workspace tab for the controller window", async () => {
  const seed = createChromeSeed({
    binding: {
      windowId: 10,
      tabId: 202,
      tabIdsByWindowId: [[10, 202]],
    },
    tabsById: [
      { id: 202, windowId: 10, url: "chrome-extension://underpar/esm-workspace.html", active: false, lastAccessed: 5 },
    ],
    queryResponses: {
      "window:10": [
        { id: 101, windowId: 10, url: "chrome-extension://underpar/esm-workspace.html", active: true, lastAccessed: 20 },
      ],
    },
  });
  const { findEsmWorkspaceTab } = loadBackgroundEsmWorkspaceHelpers(seed);

  const tab = await findEsmWorkspaceTab(10);

  assert.equal(Number(tab?.id || 0), 202);
  assert.deepEqual(seed.queryCalls, []);
});

test("findEsmWorkspaceTab reuses the global bound workspace tab instead of a duplicate in the deeplink sender window", async () => {
  const seed = createChromeSeed({
    binding: {
      windowId: 10,
      tabId: 202,
      tabIdsByWindowId: [[10, 202]],
    },
    tabsById: [
      { id: 202, windowId: 10, url: "chrome-extension://underpar/esm-workspace.html", active: false, lastAccessed: 15 },
    ],
    queryResponses: {
      "window:55": [
        { id: 909, windowId: 55, url: "chrome-extension://underpar/esm-workspace.html", active: true, lastAccessed: 100 },
      ],
      all: [
        { id: 909, windowId: 55, url: "chrome-extension://underpar/esm-workspace.html", active: true, lastAccessed: 100 },
        { id: 202, windowId: 10, url: "chrome-extension://underpar/esm-workspace.html", active: false, lastAccessed: 15 },
      ],
    },
  });
  const { findEsmWorkspaceTab } = loadBackgroundEsmWorkspaceHelpers(seed);

  const tab = await findEsmWorkspaceTab(55);

  assert.equal(Number(tab?.id || 0), 202);
  assert.deepEqual(seed.queryCalls, []);
});

test("pickBestEsmWorkspaceTab falls back to the active workspace tab when no binding is available", async () => {
  const seed = createChromeSeed();
  const { pickBestEsmWorkspaceTab } = loadBackgroundEsmWorkspaceHelpers(seed);

  const tab = pickBestEsmWorkspaceTab([
    { id: 1, windowId: 9, url: "chrome-extension://underpar/esm-workspace.html", active: false, lastAccessed: 10 },
    { id: 2, windowId: 9, url: "chrome-extension://underpar/esm-workspace.html", active: true, lastAccessed: 5 },
    { id: 3, windowId: 9, url: "https://example.com", active: true, lastAccessed: 1000 },
  ]);

  assert.equal(Number(tab?.id || 0), 2);
});

test("handoffEsmDeeplinkToWorkspace focuses the main controller window without creating a duplicate workspace tab", async () => {
  const seed = createChromeSeed({
    controllerBridgeState: {
      sidepanelStateByPort: new Map([
        [{ name: "p1" }, { windowId: 10, sessionReady: true }],
      ]),
    },
    queryResponses: {
      "window:10": [],
      all: [],
    },
  });
  const { handoffEsmDeeplinkToWorkspace } = loadBackgroundEsmWorkspaceHelpers(seed);

  const result = await handoffEsmDeeplinkToWorkspace(55);

  assert.equal(Number(result?.tabId || 0), 0);
  assert.equal(Number(result?.windowId || 0), 10);
  assert.deepEqual(seed.windowUpdateCalls, [{ windowId: 10, updateInfo: { focused: true } }]);
  assert.deepEqual(seed.createCalls, []);
});

test("esm deeplink redirect rule routes old esm markers through the bridge page", async () => {
  const calls = [];
  const helpers = loadBackgroundEsmRedirectHelpers({
    chrome: {
      runtime: {
        id: "underpar-runtime",
        getURL(fileName) {
          return `chrome-extension://underpar-runtime/${String(fileName || "")}`;
        },
      },
      identity: {
        getRedirectURL(pathname) {
          return `https://underpar-runtime.chromiumapp.org/${String(pathname || "")}`;
        },
      },
      declarativeNetRequest: {
        async updateSessionRules(payload) {
          calls.push(payload);
        },
      },
    },
  });

  await helpers.ensureUnderparEsmDeeplinkRedirectRule();

  assert.equal(calls.length, 1);
  const [payload] = calls;
  assert.deepEqual(Array.from(payload.removeRuleIds || []), [164002]);
  assert.equal(payload.addRules[0].action.redirect.transform.path, "/esm-deeplink-bridge.html");
  assert.equal(payload.addRules[0].condition.regexFilter, "^https://underpar-runtime\\.chromiumapp\\.org/\\?underpar_deeplink=esm(?:&.*)?$");
});
