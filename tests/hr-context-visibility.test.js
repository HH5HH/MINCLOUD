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

function loadHrVisibilityHelpers(seed = {}) {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const DEFAULT_ADOBEPASS_ENVIRONMENT = { key: "production" };',
    'const PREMIUM_SERVICE_DISPLAY_ORDER = ["restV2", "esmWorkspace", "degradation", "cm", "cmMvpd"];',
    "const state = globalThis.__seed.state || { programmerWorkspaceHydrationReadyByKey: new Map() };",
    "function getActiveAdobePassEnvironmentKey() { return globalThis.__seed.environmentKey || DEFAULT_ADOBEPASS_ENVIRONMENT.key; }",
    extractFunctionSource(source, "getEnvironmentScopedProgrammerKey"),
    extractFunctionSource(source, "getProgrammerWorkspaceHydrationReadyKey"),
    extractFunctionSource(source, "isProgrammerWorkspaceHydrationReady"),
    extractFunctionSource(source, "hasEsmScopedApp"),
    extractFunctionSource(source, "shouldShowCmService"),
    extractFunctionSource(source, "getDetectedPremiumServiceKeys"),
    extractFunctionSource(source, "shouldRevealHrContextSections"),
    "module.exports = { shouldRevealHrContextSections };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

test("HR context stays hidden without a selected media company or detected premium services", () => {
  const state = {
    programmerWorkspaceHydrationReadyByKey: new Map([["production|fox", true], ["staging|fox", false]]),
  };
  const { shouldRevealHrContextSections } = loadHrVisibilityHelpers({
    state,
    environmentKey: "production",
  });

  assert.equal(shouldRevealHrContextSections(null, null), false);
  assert.equal(shouldRevealHrContextSections({ programmerId: "" }, null), false);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, null), false);
  assert.equal(shouldRevealHrContextSections({ programmerId: "nflx" }, null), false);
});

test("HR context reveals only when the selected media company has detected premium services", () => {
  const state = {
    programmerWorkspaceHydrationReadyByKey: new Map(),
  };
  const { shouldRevealHrContextSections } = loadHrVisibilityHelpers({
    state,
    environmentKey: "production",
  });

  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, { restV2: { appName: "REST V2" } }), true);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, { esm: { guid: "esm-guid" } }), true);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, { cm: { matchedTenants: [{ id: "cm-tenant" }] } }), true);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, {}), false);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, { cm: { matchedTenants: [] } }), false);
  assert.equal(shouldRevealHrContextSections({ programmerId: "fox" }, []), false);
});

test("sidepanel seeds the HR context container hidden and popup runtime uses unlabeled top and bottom separators", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.match(sidepanelHtml, /id="hr-services-container"\s+class="hr-services-container"\s+hidden/);
  assert.match(popupSource, /topDivider\.className = "hr-context-divider"/);
  assert.match(popupSource, /bottomDivider\.className = "hr-context-divider"/);
  assert.doesNotMatch(popupSource, /hr-context-divider-label/);
  assert.doesNotMatch(popupSource, />HR</);
  assert.doesNotMatch(popupSource, /textContent = "- HR -"/);
});
