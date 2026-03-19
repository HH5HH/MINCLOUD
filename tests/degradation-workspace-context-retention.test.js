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

function loadPopupDegradationSelectionHelpers() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const DEFAULT_ADOBEPASS_ENVIRONMENT = { key: 'release-production', label: 'Production' };",
    "const state = { selectedRequestorId: 'MML', selectedMvpdId: 'ATT' };",
    "let activeEnvironment = { key: 'release-production', label: 'Production' };",
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    "function getActiveAdobePassEnvironmentKey() { return String(activeEnvironment?.key || DEFAULT_ADOBEPASS_ENVIRONMENT.key); }",
    "function getActiveAdobePassEnvironment() { return { ...activeEnvironment }; }",
    "function getRestV2MvpdPickerLabel(requestorId = '', mvpd = '') { return requestorId && mvpd ? `${requestorId}:${mvpd}` : String(mvpd || ''); }",
    "function getCurrentPremiumAppsSnapshot() { return { degradation: { guid: 'app-1', appName: 'Degradation App' } }; }",
    extractFunctionSource(source, "buildDegradationWorkspaceSelectionKey"),
    extractFunctionSource(source, "parseDegradationWorkspaceSelectionKey"),
    extractFunctionSource(source, "normalizeDegradationWorkspaceSelectionKey"),
    extractFunctionSource(source, "degradationWorkspaceGetSelectionContext"),
    "function setGlobalSelection(requestorId = '', mvpd = '') { state.selectedRequestorId = String(requestorId || '').trim(); state.selectedMvpdId = String(mvpd || '').trim(); }",
    "function setActiveEnvironment(environmentKey = 'release-production', label = 'Production') { activeEnvironment = { key: String(environmentKey || 'release-production'), label: String(label || 'Production') }; }",
    "module.exports = { buildDegradationWorkspaceSelectionKey, parseDegradationWorkspaceSelectionKey, normalizeDegradationWorkspaceSelectionKey, degradationWorkspaceGetSelectionContext, setGlobalSelection, setActiveEnvironment };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadWorkspaceControllerHelpers() {
  const filePath = path.join(ROOT, "degradation-workspace.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const state = { selectionKey: '', adobePassEnvironment: { key: 'release-production', label: 'Production' }, controllerOnline: false, degradationReady: false, slackReady: false, slackUserId: '', slackUserName: '', slackShareTargets: [], programmerId: '', programmerName: '', requestorId: '', mvpd: '', mvpdLabel: '', mvpdScopeLabel: '', appGuid: '', appName: '' };",
    "let resetCalls = [];",
    "let renderCalls = 0;",
    "let bannerCalls = 0;",
    "let maybeConsumeCalls = 0;",
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    "function getEnvironmentKey(environment = null) { return String(environment?.key || '').trim(); }",
    "function resolveWorkspaceAdobePassEnvironment(environment = null) { return environment && typeof environment === 'object' ? environment : { ...state.adobePassEnvironment }; }",
    "function normalizeBlondieShareTargets(targets = []) { return Array.isArray(targets) ? targets : []; }",
    "function closeBlondieSharePicker() {}",
    "function updateControllerBanner() { bannerCalls += 1; }",
    "function renderWorkspaceCards() { renderCalls += 1; }",
    "function syncBlondieButtons() {}",
    "function syncActionButtonsDisabled() {}",
    "function maybeConsumePendingWorkspaceDeeplink() { maybeConsumeCalls += 1; }",
    "function resetWorkspaceCardsForSelection(nextSelectionKey = '') { resetCalls.push(String(nextSelectionKey || '').trim()); }",
    extractFunctionSource(source, "buildWorkspaceDeeplinkSelectionKey"),
    extractFunctionSource(source, "parseWorkspaceSelectionKey"),
    extractFunctionSource(source, "normalizeWorkspaceSelectionKey"),
    extractFunctionSource(source, "applyControllerState"),
    "function getMetrics() { return { resetCalls: resetCalls.slice(), renderCalls, bannerCalls, maybeConsumeCalls }; }",
    "function getState() { return JSON.parse(JSON.stringify(state)); }",
    "module.exports = { buildWorkspaceDeeplinkSelectionKey, parseWorkspaceSelectionKey, normalizeWorkspaceSelectionKey, applyControllerState, getMetrics, getState };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

test("DEGRADATION popup selection key stays pinned to env and media company", () => {
  const helpers = loadPopupDegradationSelectionHelpers();
  const programmer = {
    programmerId: "Turner",
    programmerName: "Turner",
  };
  const services = {
    degradation: {
      guid: "app-1",
      appName: "Turner Degradation",
    },
  };

  helpers.setGlobalSelection("MML", "ATT");
  const firstContext = helpers.degradationWorkspaceGetSelectionContext(programmer, services);

  helpers.setGlobalSelection("CNN", "XFINITY");
  const secondContext = helpers.degradationWorkspaceGetSelectionContext(programmer, services);

  assert.equal(firstContext.selectionKey, "release-production|Turner");
  assert.equal(secondContext.selectionKey, "release-production|Turner");
  assert.equal(secondContext.requestorId, "CNN");
  assert.equal(secondContext.mvpd, "XFINITY");
  assert.equal(secondContext.mvpdScopeLabel, "CNN:XFINITY (XFINITY)");
});

test("DEGRADATION selection normalization collapses legacy child-scope keys", () => {
  const popupHelpers = loadPopupDegradationSelectionHelpers();
  const workspaceHelpers = loadWorkspaceControllerHelpers();

  assert.equal(
    popupHelpers.normalizeDegradationWorkspaceSelectionKey("release-production|Turner|MML|ATT"),
    "release-production|Turner"
  );
  assert.equal(
    workspaceHelpers.normalizeWorkspaceSelectionKey("release-staging|Fox|DTV|COMCAST"),
    "release-staging|Fox"
  );
});

test("DEGRADATION workspace only redraws when env or media company changes", () => {
  const helpers = loadWorkspaceControllerHelpers();

  helpers.applyControllerState({
    controllerOnline: true,
    degradationReady: true,
    programmerId: "Turner",
    programmerName: "Turner",
    requestorId: "MML",
    mvpd: "ATT",
    mvpdLabel: "AT&T",
    mvpdScopeLabel: "AT&T",
    selectionKey: "release-production|Turner|MML|ATT",
    adobePassEnvironment: { key: "release-production", label: "Production" },
    slack: { ready: false, shareTargets: [] },
  });

  helpers.applyControllerState({
    controllerOnline: true,
    degradationReady: true,
    programmerId: "Turner",
    programmerName: "Turner",
    requestorId: "CNN",
    mvpd: "XFINITY",
    mvpdLabel: "Comcast",
    mvpdScopeLabel: "Comcast",
    selectionKey: "release-production|Turner|CNN|XFINITY",
    adobePassEnvironment: { key: "release-production", label: "Production" },
    slack: { ready: false, shareTargets: [] },
  });

  let metrics = helpers.getMetrics();
  let state = helpers.getState();
  assert.equal(Array.from(metrics.resetCalls).join(","), "release-production|Turner");
  assert.equal(metrics.renderCalls, 1);
  assert.equal(state.selectionKey, "release-production|Turner");
  assert.equal(state.requestorId, "CNN");
  assert.equal(state.mvpd, "XFINITY");

  helpers.applyControllerState({
    controllerOnline: true,
    degradationReady: true,
    programmerId: "Fox",
    programmerName: "Fox",
    requestorId: "FOXNOW",
    mvpd: "DISH",
    mvpdLabel: "Dish",
    mvpdScopeLabel: "Dish",
    selectionKey: "release-production|Fox|FOXNOW|DISH",
    adobePassEnvironment: { key: "release-production", label: "Production" },
    slack: { ready: false, shareTargets: [] },
  });

  metrics = helpers.getMetrics();
  state = helpers.getState();
  assert.equal(Array.from(metrics.resetCalls).join(","), "release-production|Turner,release-production|Fox");
  assert.equal(metrics.renderCalls, 2);
  assert.equal(state.selectionKey, "release-production|Fox");
});
