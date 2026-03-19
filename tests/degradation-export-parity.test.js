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

function normalizeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadPopupParityHelpers() {
  const source = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const script = [
    "const DEGRADATION_MEGA_STATUS_ENDPOINT_SPEC = { key: 'all', path: 'all' };",
    "const DEGRADATION_STATUS_ENDPOINT_SPECS = [{ key: 'authnall', path: 'authnAll', title: 'Authenticate All - Status' }, { key: 'authzall', path: 'authzAll', title: 'Authorize All - Status' }, { key: 'authznone', path: 'authzNone', title: 'Authorize None - Status' }];",
    "const DEFAULT_ADOBEPASS_ENVIRONMENT = { key: 'release-production' };",
    "const state = { selectedRequestorId: 'MML' };",
    "function firstNonEmptyString(values = []) { for (const value of values) { const normalized = String(value == null ? '' : value).trim(); if (normalized) { return normalized; } } return ''; }",
    "function getRestV2MvpdPickerLabel(requestorId, mvpdId) { return mvpdId === 'ATT' ? 'AT&T U-verse (ATT)' : String(mvpdId || ''); }",
    "function degradationBuildScopeLabel(queryValues = {}) { return queryValues?.includeAllMvpd === true ? 'ALL MVPDs' : String(queryValues?.mvpd || '').trim(); }",
    "function getDegradationDefaultReportColumns() { return ['Rule', 'Measure ID', 'Programmer', 'MVPD', 'Target Type', 'Target', 'Enabled', 'Status', 'Active', 'TTL (s)', 'Message', 'Activation Time']; }",
    "function normalizeDegradationWorkspaceSelectionKey(value = '', fallbacks = {}) { return String(value || fallbacks?.environmentKey || '').trim(); }",
    "function buildDegradationWorkspaceSelectionKey(fallbacks = {}) { return String(fallbacks?.environmentKey || 'release-production').trim(); }",
    "function getActiveAdobePassEnvironmentKey() { return 'release-production'; }",
    "function getActiveAdobePassEnvironment() { return { label: 'Production' }; }",
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
    extractFunctionSource(source, "degradationIsAppliedActiveRow"),
    extractFunctionSource(source, "degradationFilterAppliedActiveRows"),
    extractFunctionSource(source, "degradationBuildRequestGroupKey"),
    extractFunctionSource(source, "degradationBuildReportPayload"),
    extractFunctionSource(source, "degradationBuildEndpointReportsFromMegaStatusReport"),
    "module.exports = { degradationExtractRows, degradationBuildEndpointReportsFromMegaStatusReport };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Date,
    JSON,
    Math,
    Map,
    Number,
    String,
    Array,
    Object,
  };
  vm.runInNewContext(script, context, { filename: path.join(ROOT, "popup.js") });
  return context.module.exports;
}

function loadClickDgrParityHelpers() {
  const source = fs.readFileSync(path.join(ROOT, "clickDGR-template.html"), "utf8");
  const script = [
    "const DEGRADATION_API_VERSION = '3.0';",
    "const MEGA_ENDPOINT_SPEC = { key: 'all', path: 'all' };",
    "const ENDPOINT_SPECS = [{ key: 'authnall', path: 'authnAll', title: 'Authenticate All - Status' }, { key: 'authzall', path: 'authzAll', title: 'Authorize All - Status' }, { key: 'authznone', path: 'authzNone', title: 'Authorize None - Status' }];",
    "const DEFAULT_COLUMNS = ['Rule', 'Measure ID', 'Programmer', 'MVPD', 'Target Type', 'Target', 'Enabled', 'Status', 'Active', 'TTL (s)', 'Message', 'Activation Time'];",
    "const state = { mvpdCacheByRequestor: new Map([['MML', new Map([['ATT', { name: 'AT&T U-verse (ATT)' }]])]]) };",
    "function firstNonEmptyString(values = []) { for (const value of values) { const normalized = String(value == null ? '' : value).trim(); if (normalized) { return normalized; } } return ''; }",
    "function buildScopeLabel(queryValues = {}) { return queryValues?.includeAllMvpd === true ? 'ALL MVPDs' : String(queryValues?.mvpd || '').trim(); }",
    extractFunctionSource(source, "normalizeObjectKeys"),
    extractFunctionSource(source, "getObjectValueByKeys"),
    extractFunctionSource(source, "toArray"),
    extractFunctionSource(source, "resolveIdValue"),
    extractFunctionSource(source, "coerceBooleanValue"),
    extractFunctionSource(source, "formatActivationTimeValue"),
    extractFunctionSource(source, "formatMvpdDisplayValue"),
    extractFunctionSource(source, "buildStatusRow"),
    extractFunctionSource(source, "mergeStatusDetailNode"),
    extractFunctionSource(source, "extractRowsFromMegaPayload"),
    extractFunctionSource(source, "extractRows"),
    extractFunctionSource(source, "filterAppliedActiveRows"),
    extractFunctionSource(source, "buildRequestGroupKey"),
    extractFunctionSource(source, "buildReportPayload"),
    extractFunctionSource(source, "buildEndpointReportsFromMegaStatusReport"),
    "module.exports = { extractRows, buildEndpointReportsFromMegaStatusReport };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Date,
    JSON,
    Math,
    Map,
    Number,
    String,
    Array,
    Object,
  };
  vm.runInNewContext(script, context, { filename: path.join(ROOT, "clickDGR-template.html") });
  return context.module.exports;
}

function loadClickDgrRunAllHelper() {
  const source = fs.readFileSync(path.join(ROOT, "clickDGR-template.html"), "utf8");
  const script = [
    "const MEGA_ENDPOINT_SPEC = { key: 'all', path: 'all', title: 'All Rules - Status' };",
    "const state = { busy: false };",
    "const els = { methodPicker: { value: 'all' }, requestorPicker: {}, mvpdPicker: {}, resultsHost: null };",
    "let busyStates = [];",
    "let statusMessages = [];",
    "let executeAllCalls = 0;",
    "let executeStatusCalls = 0;",
    "let upsertedGroups = [];",
    "function getEndpointSpec(key) { return String(key || '').trim().toLowerCase() === 'all' ? MEGA_ENDPOINT_SPEC : { key: String(key || '').trim().toLowerCase(), title: 'Direct' }; }",
    "function collectQueryValues(endpointKey = '') { return { requestorId: 'MML', programmerId: 'MML', mvpd: 'ATT', includeAllMvpd: false, endpointKey }; }",
    "function setBusy(busy) { busyStates.push(busy === true); state.busy = busy === true; }",
    "function setStatus(message = '', type = 'info') { statusMessages.push({ message: String(message || ''), type: String(type || 'info') }); }",
    "async function executeAllStatusReports(queryValues = {}) { executeAllCalls += 1; return { megaReport: { ok: true, endpointTitle: 'GET ALL', error: '' }, reports: [{ endpointKey: 'authnall' }, { endpointKey: 'authzall' }, { endpointKey: 'authznone' }] }; }",
    "async function executeStatusRequest(endpointSpec, queryValues = {}) { executeStatusCalls += 1; return { ok: true, endpointKey: String(endpointSpec?.key || ''), endpointTitle: 'Direct', error: '' }; }",
    "function upsertReports(reportList = []) { upsertedGroups.push(Array.isArray(reportList) ? reportList.slice() : []); }",
    "function upsertReport(report) { upsertedGroups.push(report ? [report] : []); }",
    extractFunctionSource(source, "runSelectedMethod"),
    "function getBusyStates() { return busyStates.slice(); }",
    "function getStatusMessages() { return statusMessages.slice(); }",
    "function getExecuteAllCalls() { return executeAllCalls; }",
    "function getExecuteStatusCalls() { return executeStatusCalls; }",
    "function getUpsertedGroups() { return upsertedGroups.slice(); }",
    "module.exports = { runSelectedMethod, getBusyStates, getStatusMessages, getExecuteAllCalls, getExecuteStatusCalls, getUpsertedGroups };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: path.join(ROOT, "clickDGR-template.html") });
  return context.module.exports;
}

test("popup and clickDGR share direct authnAll extraction semantics", () => {
  const popupHelpers = loadPopupParityHelpers();
  const clickHelpers = loadClickDgrParityHelpers();
  const endpointSpec = {
    key: "authnall",
    path: "authnAll",
    title: "Authenticate All - Status",
    measureId: "authn-all",
    targetType: "programmer",
    targetKey: "programmer",
  };
  const payload = {
    "degradation-measure": {
      id: "authn-all",
      programmer: { id: "MML" },
      mvpd: { id: "ATT" },
      "degradation-measure-enable": true,
      "degradation-measure-status": "APPLIED",
      ttl: 21600,
      "activation-time": 1773947121,
    },
  };
  const queryValues = {
    requestorId: "MML",
    programmerId: "MML",
    mvpd: "ATT",
    includeAllMvpd: false,
    apiVersion: "3.0",
  };

  const popupRows = normalizeJson(popupHelpers.degradationExtractRows(endpointSpec, payload, queryValues));
  const clickRows = normalizeJson(clickHelpers.extractRows(endpointSpec, payload, queryValues));

  assert.deepEqual(clickRows, popupRows);
});

test("popup and clickDGR share mega split report fanout semantics", () => {
  const popupHelpers = loadPopupParityHelpers();
  const clickHelpers = loadClickDgrParityHelpers();
  const megaReport = {
    ok: true,
    status: 200,
    statusText: "OK",
    rows: [
      { Rule: "Authenticate All - Status", Status: "APPLIED", Active: "YES", Programmer: "MML", MVPD: "AT&T U-verse (ATT)" },
      { Rule: "Authorize All - Status", Status: "APPLIED", Active: "YES", Programmer: "MML", MVPD: "AT&T U-verse (ATT)" },
    ],
    requestUrl: "https://mgmt.auth.adobe.com/control/v3/degradation/Turner/all?programmer=MML&mvpd=ATT&format=json",
    fetchedAt: 1773950000000,
    durationMs: 152,
  };
  const queryValues = {
    endpointKey: "all",
    requestorId: "MML",
    programmerId: "MML",
    mvpd: "ATT",
    includeAllMvpd: false,
    apiVersion: "3.0",
  };

  const summarize = (report) => ({
    endpointKey: report.endpointKey,
    rowCount: report.rowCount,
    requestMode: report.requestMode,
    requestGroupKey: report.requestGroupKey,
    sourceEndpointKey: report.sourceEndpointKey,
  });

  const popupReports = normalizeJson(
    popupHelpers.degradationBuildEndpointReportsFromMegaStatusReport(megaReport, queryValues).map(summarize)
  );
  const clickReports = normalizeJson(
    clickHelpers.buildEndpointReportsFromMegaStatusReport(megaReport, queryValues).map(summarize)
  );

  assert.deepEqual(clickReports, popupReports);
});

test("clickDGR GET ALL uses the mega endpoint and fans out one report group", async () => {
  const helpers = loadClickDgrRunAllHelper();

  await helpers.runSelectedMethod();

  assert.equal(helpers.getExecuteAllCalls(), 1);
  assert.equal(helpers.getExecuteStatusCalls(), 0);
  assert.equal(helpers.getUpsertedGroups().length, 1);
  assert.equal(helpers.getUpsertedGroups()[0].length, 3);
  assert.deepEqual(normalizeJson(helpers.getBusyStates()), [true, false]);
  const finalStatus = normalizeJson(helpers.getStatusMessages().at(-1));
  assert.deepEqual(finalStatus, { message: "", type: "info" });
});
