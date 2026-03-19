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

function loadDegradationExecuteStatusRequestHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const DEGRADATION_API_BASE = "https://degradation.example";',
    'const DEGRADATION_API_VERSION = "4";',
    'const DEGRADATION_MEGA_STATUS_ENDPOINT_SPEC = { key: "all", path: "all" };',
    'const PREMIUM_SERVICE_SCOPE_BY_KEY = { degradation: "entitlement:degradation" };',
    'const state = { selectedRequestorId: "MML", degradationWorkspaceTabId: 0 };',
    "let refreshCalls = 0;",
    "let refreshOptions = [];",
    "let fetchCalls = [];",
    "let refreshApp = { guid: 'refreshed-app', appName: 'Refreshed App', scope: 'entitlement:degradation' };",
    "function degradationCollectFormValues() { return { requestorId: 'MML', programmerId: 'MML', mvpd: 'ATT', includeAllMvpd: false }; }",
    "function degradationBuildRequestUrl(panelState, endpointSpec, queryValues) { return new URL(`https://degradation.example/${panelState.programmer.programmerId}/${endpointSpec.path}?programmer=${queryValues.programmerId}`); }",
    "function resolveDegradationDebugFlowIdForRequest() { return 'flow-1'; }",
    "function degradationRefreshSelectedAppForRequest(panelState, options = {}) { refreshCalls += 1; refreshOptions.push(options); panelState.appInfo = refreshApp; return refreshApp; }",
    "function getPreferredDegradationScopeForApp(appInfo = null) { return String(appInfo?.scope || 'entitlement:degradation').trim(); }",
    "async function fetchWithPremiumAuth(programmerId, appInfo, url, options = {}, retryStage = 'refresh', debugMeta = null) { fetchCalls.push({ programmerId, appInfo, url, options, retryStage, debugMeta }); return { ok: true, status: 200, statusText: 'OK', text: async () => JSON.stringify({ rows: [{ id: 'row-1', status: 'active' }] }) }; }",
    "function parseJsonText(text = '', fallback = null) { try { return JSON.parse(text); } catch { return fallback; } }",
    "function degradationExtractRows(endpointSpec, payload) { return Array.isArray(payload?.rows) ? payload.rows : []; }",
    "function degradationFilterAppliedActiveRows(rows = []) { return Array.isArray(rows) ? rows : []; }",
    "function degradationBuildReportPayload(endpointSpec, queryValues, result = {}) { const rows = Array.isArray(result.rows) ? result.rows : []; return { endpointKey: String(endpointSpec?.key || ''), endpointPath: String(endpointSpec?.path || ''), endpointTitle: String(endpointSpec?.title || endpointSpec?.key || ''), programmerId: String(queryValues?.programmerId || ''), mvpd: String(queryValues?.mvpd || ''), includeAllMvpd: queryValues?.includeAllMvpd === true, mvpdScopeLabel: queryValues?.includeAllMvpd === true ? 'ALL MVPDs' : String(queryValues?.mvpd || ''), rowCount: rows.length, activeCount: rows.length, ...result }; }",
    extractFunctionSource(source, "degradationExecuteStatusRequest"),
    "function setRefreshApp(nextApp) { refreshApp = nextApp; }",
    "function getRefreshCalls() { return refreshCalls; }",
    "function getRefreshOptions() { return refreshOptions.slice(); }",
    "function getFetchCalls() { return fetchCalls.slice(); }",
    "module.exports = { degradationExecuteStatusRequest, setRefreshApp, getRefreshCalls, getRefreshOptions, getFetchCalls };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    Date,
    JSON,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadDegradationRunAllHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const DEGRADATION_STATUS_ENDPOINT_SPECS = [{ key: 'authnall', title: 'Authenticate All - Status' }, { key: 'authzall', title: 'Authorize All - Status' }, { key: 'authznone', title: 'Authorize None - Status' }];",
    "const DEGRADATION_MEGA_STATUS_ENDPOINT_SPEC = { key: 'all', path: 'all', title: 'All Rules - Status' };",
    "let refreshCalls = 0;",
    "let refreshOptions = [];",
    "let endpointCalls = [];",
    "let executeStatusCalls = [];",
    "let storedReports = [];",
    "let broadcastCalls = [];",
    "let queryValues = { requestorId: 'MML', programmerId: 'MML', mvpd: 'ATT', includeAllMvpd: false };",
    "let megaRows = [{ Rule: 'Authorize All - Status', id: 'row-1' }];",
    "function isDegradationServiceRequestActive() { return true; }",
    "function degradationCollectFormValues() { return { ...queryValues }; }",
    "function degradationRequireSelectedRequestor() { return true; }",
    "function degradationSetControllerStatus() {}",
    "function degradationSetBusy(panelState, busy) { panelState.busy = busy === true; }",
    "function buildDegradationRunGroupId() { return 'run-fixed'; }",
    "async function degradationOpenWorkspaceFromPanel() { return { targetWindowId: 42 }; }",
    "function degradationRefreshSelectedAppForRequest(panelState, options = {}) { refreshCalls += 1; refreshOptions.push(options); const app = { guid: 'app-1', appName: 'Degradation App', scope: 'entitlement:degradation' }; panelState.appInfo = app; return app; }",
    "function emitDegradationWorkspaceDebugEvent() {}",
    "function getActiveDegradationWorkspaceDebugFlowId() { return 'flow-1'; }",
    "function degradationWorkspaceGetSelectionContext() { return { selectionKey: 'release-production|Turner' }; }",
    "async function degradationExecuteStatusRequest(panelState, endpointSpec, options = {}) { executeStatusCalls.push({ endpointSpec, options }); return { ok: true, status: 200, statusText: 'OK', selectionKey: 'release-production|Turner', runGroupId: String(options.runGroupId || 'run-fixed'), requestUrl: 'https://degradation.example/Turner/all', rows: megaRows.slice(), rowCount: megaRows.length, activeCount: megaRows.length, fetchedAt: 1000, durationMs: 20 }; }",
    "function degradationBuildRequestGroupKey(queryValues = {}, sourceEndpointKey = '') { return [String(sourceEndpointKey || queryValues?.endpointKey || 'all').trim().toLowerCase(), `programmer=${String(queryValues?.programmerId || '').trim()}`, `mvpd=${String(queryValues?.mvpd || '*').trim() || '*'}`, `api_version=${String(queryValues?.apiVersion || '*').trim() || '*'}`].join('|'); }",
    "function degradationBuildReportPayload(endpointSpec, queryValues, result = {}) { const rows = Array.isArray(result.rows) ? result.rows : []; return { endpointKey: String(endpointSpec?.key || ''), endpointPath: String(endpointSpec?.path || ''), endpointTitle: String(endpointSpec?.title || endpointSpec?.key || ''), programmerId: String(queryValues?.programmerId || ''), mvpd: String(queryValues?.mvpd || ''), includeAllMvpd: queryValues?.includeAllMvpd === true, mvpdScopeLabel: queryValues?.includeAllMvpd === true ? 'ALL MVPDs' : String(queryValues?.mvpd || ''), rowCount: rows.length, activeCount: rows.length, ...result }; }",
    "function degradationWorkspaceStoreReport(report, state) { storedReports.push({ report, state }); }",
    "function degradationWorkspaceBroadcastReports(selectionKey, targetWindowId) { broadcastCalls.push({ selectionKey, targetWindowId }); }",
    "async function degradationRunStatusEndpointFromPanel(panelState, endpointKey, options = {}) { endpointCalls.push({ endpointKey, options }); return { ok: true, rowCount: 1, activeCount: 1 }; }",
    extractFunctionSource(source, "degradationBuildEndpointReportsFromMegaStatusReport"),
    extractFunctionSource(source, "degradationRunAllStatusEndpointsFromPanel"),
    "function setQueryValues(nextValues = {}) { queryValues = { ...queryValues, ...nextValues }; }",
    "function setMegaRows(nextRows = []) { megaRows = Array.isArray(nextRows) ? nextRows.slice() : []; }",
    "function getRefreshCalls() { return refreshCalls; }",
    "function getRefreshOptions() { return refreshOptions.slice(); }",
    "function getEndpointCalls() { return endpointCalls.slice(); }",
    "function getExecuteStatusCalls() { return executeStatusCalls.slice(); }",
    "function getStoredReports() { return storedReports.slice(); }",
    "function getBroadcastCalls() { return broadcastCalls.slice(); }",
    "module.exports = { degradationRunAllStatusEndpointsFromPanel, setQueryValues, setMegaRows, getRefreshCalls, getRefreshOptions, getEndpointCalls, getExecuteStatusCalls, getStoredReports, getBroadcastCalls };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadDegradationExtractRowsHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const DEGRADATION_MEGA_STATUS_ENDPOINT_SPEC = { key: 'all', path: 'all' };",
    "const state = { selectedRequestorId: 'MML' };",
    "function firstNonEmptyString(values = []) { for (const value of values) { const normalized = String(value == null ? '' : value).trim(); if (normalized) { return normalized; } } return ''; }",
    "function getRestV2MvpdPickerLabel(requestorId, mvpdId) { return mvpdId === 'ATT' ? 'AT&T U-verse (ATT)' : String(mvpdId || ''); }",
    "function degradationBuildScopeLabel(queryValues = {}) { return queryValues?.includeAllMvpd === true ? 'ALL MVPDs' : String(queryValues?.mvpd || '').trim(); }",
    extractFunctionSource(source, "degradationNormalizeObjectKeys"),
    extractFunctionSource(source, "degradationGetObjectValueByKeys"),
    extractFunctionSource(source, "degradationToArray"),
    extractFunctionSource(source, "degradationResolveIdValue"),
    extractFunctionSource(source, "degradationCoerceBooleanValue"),
    extractFunctionSource(source, "degradationFormatActivationTimeValue"),
    extractFunctionSource(source, "degradationFormatMvpdDisplayValue"),
    extractFunctionSource(source, "degradationBuildStatusRow"),
    extractFunctionSource(source, "degradationMergeStatusDetailNode"),
    extractFunctionSource(source, "degradationExtractRowsFromMegaPayload"),
    extractFunctionSource(source, "degradationExtractRows"),
    "module.exports = { degradationExtractRows };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Date,
    Number,
    String,
    Array,
    Object,
    Math,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadDegradationWorkspaceEnsureHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const state = { degradationWorkspaceTabIdByWindowId: new Map(), degradationWorkspaceWindowId: 0, degradationWorkspaceTabId: 0, degradationWorkspaceReadyByWindowId: new Map() };",
    "const createdTabs = [];",
    "const focusedWindows = [];",
    "function esmWorkspaceGetCurrentWindowId() { return Promise.resolve(12); }",
    "function degradationWorkspaceGetBoundWorkspaceTabId() { return 0; }",
    "function degradationWorkspaceIsWorkspaceTab(tabLike) { return String(tabLike?.url || '').startsWith('chrome-extension://underpar/degradation-workspace.html'); }",
    "function degradationWorkspaceGetWorkspaceUrl() { return 'chrome-extension://underpar/degradation-workspace.html'; }",
    "function degradationWorkspaceUnbindWorkspaceTab() {}",
    "function degradationWorkspaceBindWorkspaceTab(windowId, tabId) { state.degradationWorkspaceWindowId = Number(windowId || 0); state.degradationWorkspaceTabId = Number(tabId || 0); if (Number(windowId || 0) > 0 && Number(tabId || 0) > 0) { state.degradationWorkspaceTabIdByWindowId.set(Number(windowId), Number(tabId)); } }",
    "function degradationWorkspaceInvalidateReady() {}",
    "function degradationWorkspaceIsReady() { return false; }",
    "function degradationWorkspaceMarkReady() {}",
    "const chrome = { tabs: { get: async () => { throw new Error('missing'); }, query: async () => [], create: async (options) => { createdTabs.push(options); return { id: 99, windowId: Number(options?.windowId || 12), url: String(options?.url || ''), status: 'complete' }; }, update: async (tabId, options) => ({ id: Number(tabId || 0), windowId: 12, active: options?.active === true, url: 'chrome-extension://underpar/degradation-workspace.html' }) }, windows: { update: async (windowId, options) => { focusedWindows.push({ windowId, options }); return { id: Number(windowId || 0) }; } } };",
    extractFunctionSource(source, "degradationWorkspaceEnsureWorkspaceTab"),
    "function getCreatedTabs() { return createdTabs.slice(); }",
    "function getFocusedWindows() { return focusedWindows.slice(); }",
    "module.exports = { degradationWorkspaceEnsureWorkspaceTab, getCreatedTabs, getFocusedWindows };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Map,
    Number,
    String,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

test("DEGRADATION status request honors a preselected app and locks auth selection", async () => {
  const helpers = loadDegradationExecuteStatusRequestHelper();
  const selectedApp = {
    guid: "app-selected",
    appName: "Selected App",
    scope: "entitlement:degradation",
  };
  const panelState = {
    programmer: {
      programmerId: "Turner",
    },
  };

  const report = await helpers.degradationExecuteStatusRequest(
    panelState,
    {
      key: "authnall",
      path: "authnAll",
      title: "Authenticate All - Status",
    },
    {
      queryValues: {
        requestorId: "MML",
        programmerId: "MML",
        mvpd: "ATT",
        includeAllMvpd: false,
      },
      selectedApp,
    }
  );

  assert.equal(helpers.getRefreshCalls(), 0);
  const [fetchCall] = helpers.getFetchCalls();
  assert.equal(fetchCall.appInfo, selectedApp);
  assert.equal(fetchCall.debugMeta.allowProvisioning, true);
  assert.equal(fetchCall.debugMeta.lockAppSelection, true);
  assert.equal(fetchCall.debugMeta.requiredServiceScope, "entitlement:degradation");
  assert.equal(report.ok, true);
});

test("DEGRADATION GET ALL with a selected MVPD uses the mega endpoint and fans out report cards", async () => {
  const helpers = loadDegradationRunAllHelper();
  helpers.setMegaRows([
    { Rule: "Authorize All - Status", id: "row-1" },
    { Rule: "Authenticate All - Status", id: "row-2" },
  ]);
  const panelState = {
    section: {},
    programmer: {
      programmerId: "Turner",
    },
    requestToken: 7,
    busy: false,
  };

  const reports = await helpers.degradationRunAllStatusEndpointsFromPanel(panelState, {
    requestToken: 7,
  });

  assert.equal(helpers.getRefreshCalls(), 1);
  const [refreshOptions] = helpers.getRefreshOptions();
  assert.equal(refreshOptions.requestorId, "MML");
  assert.equal(refreshOptions.requestScope, "degradation-run-all");
  assert.equal(refreshOptions.targetWindowId, 42);

  assert.equal(helpers.getEndpointCalls().length, 0);
  const [executeCall] = helpers.getExecuteStatusCalls();
  assert.equal(executeCall.endpointSpec.key, "all");
  assert.equal(executeCall.options.selectedApp.guid, "app-1");
  assert.equal(executeCall.options.runGroupId, "run-fixed");
  assert.equal(executeCall.options.targetWindowId, 42);
  assert.equal(reports.length, 3);
  assert.equal(reports.find((report) => report.endpointKey === "authnall")?.rowCount, 1);
  assert.equal(reports.find((report) => report.endpointKey === "authzall")?.rowCount, 1);
  assert.equal(reports.find((report) => report.endpointKey === "authznone")?.rowCount, 0);
  assert.equal(panelState.busy, false);
});

test("DEGRADATION GET ALL for ALL MVPDs uses the mega endpoint and fans out report cards", async () => {
  const helpers = loadDegradationRunAllHelper();
  helpers.setQueryValues({
    mvpd: "",
    includeAllMvpd: true,
  });
  const panelState = {
    section: {},
    programmer: {
      programmerId: "Turner",
    },
    requestToken: 7,
    busy: false,
  };

  const reports = await helpers.degradationRunAllStatusEndpointsFromPanel(panelState, {
    requestToken: 7,
  });

  assert.equal(helpers.getRefreshCalls(), 1);
  assert.equal(helpers.getEndpointCalls().length, 0);
  const [executeCall] = helpers.getExecuteStatusCalls();
  assert.equal(executeCall.endpointSpec.key, "all");
  assert.equal(executeCall.options.selectedApp.guid, "app-1");
  assert.equal(executeCall.options.targetWindowId, 42);

  assert.equal(reports.length, 3);
  assert.equal(reports.find((report) => report.endpointKey === "authnall")?.rowCount, 0);
  assert.equal(reports.find((report) => report.endpointKey === "authzall")?.rowCount, 1);
  assert.equal(reports.find((report) => report.endpointKey === "authznone")?.rowCount, 0);
  assert.equal(helpers.getStoredReports().length, 3);
  assert.equal(JSON.stringify(helpers.getBroadcastCalls()), JSON.stringify([{ selectionKey: "release-production|Turner", targetWindowId: 42 }]));
  assert.equal(panelState.busy, false);
});

test("DEGRADATION direct authnAll extraction keeps applied status from the parent measure node", () => {
  const helpers = loadDegradationExtractRowsHelper();
  const rows = helpers.degradationExtractRows(
    {
      key: "authnall",
      path: "authnAll",
      title: "Authenticate All - Status",
      measureId: "authn-all",
      targetType: "programmer",
      targetKey: "programmer",
    },
    {
      "degradation-measure": {
        id: "authn-all",
        programmer: {
          id: "MML",
        },
        mvpd: {
          id: "ATT",
        },
        "degradation-measure-enable": true,
        "degradation-measure-status": "APPLIED",
        ttl: 21600,
        "activation-time": 1773947121,
      },
    },
    {
      requestorId: "MML",
      programmerId: "MML",
      mvpd: "ATT",
      includeAllMvpd: false,
    }
  );

  assert.equal(rows.length, 1);
  assert.equal(rows[0].Rule, "Authenticate All - Status");
  assert.equal(rows[0].Programmer, "MML");
  assert.equal(rows[0].MVPD, "AT&T U-verse (ATT)");
  assert.equal(rows[0].Status, "APPLIED");
  assert.equal(rows[0].Active, "YES");
});

test("DEGRADATION workspace creation focuses the new tab window when GO opens it", async () => {
  const helpers = loadDegradationWorkspaceEnsureHelper();

  const workspaceTab = await helpers.degradationWorkspaceEnsureWorkspaceTab({
    activate: true,
    windowId: 12,
  });

  const [createCall] = helpers.getCreatedTabs();
  assert.equal(createCall.url, "chrome-extension://underpar/degradation-workspace.html");
  assert.equal(createCall.active, true);
  assert.equal(createCall.windowId, 12);
  const [focusCall] = helpers.getFocusedWindows();
  assert.equal(JSON.stringify(focusCall), JSON.stringify({
    windowId: 12,
    options: {
      focused: true,
    },
  }));
  assert.equal(workspaceTab.id, 99);
});
