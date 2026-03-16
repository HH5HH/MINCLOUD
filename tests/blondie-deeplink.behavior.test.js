const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const POPUP_JS_PATH = path.join(ROOT, "popup.js");

function extractFunctionSource(source, functionName) {
  const marker = "function " + functionName + "(";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, "Unable to locate " + functionName + " in popup.js");
  const bodyStart = source.indexOf("{", start);
  assert.notEqual(bodyStart, -1, "Unable to locate body for " + functionName);
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
  throw new Error("Unterminated function: " + functionName);
}

function loadBlondieDeeplinkHelpers(seed) {
  const source = fs.readFileSync(POPUP_JS_PATH, "utf8");
  const script = [
    'const UNDERPAR_ESM_DEEPLINK_MARKER_PARAM = "underpar_deeplink";',
    'const chrome = globalThis.__seed.chrome;',
    extractFunctionSource(source, "normalizeSlackOpenIdRedirectUri"),
    extractFunctionSource(source, "getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl"),
    extractFunctionSource(source, "buildUnderparWorkspaceBlondieDeeplinkBaseUrl"),
    "module.exports = { getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl, buildUnderparWorkspaceBlondieDeeplinkBaseUrl };"
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    __seed: seed
  };
  vm.runInNewContext(script, context, { filename: POPUP_JS_PATH });
  return context.module.exports;
}

function loadBlondieEsmDeeplinkUrlBuilder(seed) {
  const source = fs.readFileSync(POPUP_JS_PATH, "utf8");
  const script = [
    extractFunctionSource(source, "buildUnderparEsmBlondieDeeplinkUrl"),
    "module.exports = { buildUnderparEsmBlondieDeeplinkUrl };"
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
    buildUnderparEsmBlondieDeeplinkPayload(exportPayload) {
      return seed.buildUnderparEsmBlondieDeeplinkPayload(exportPayload);
    },
    buildUnderparEsmBridgeDeeplinkUrl(requestPath, payload) {
      return seed.buildUnderparEsmBridgeDeeplinkUrl(requestPath, payload);
    }
  };
  vm.runInNewContext(script, context, { filename: POPUP_JS_PATH });
  return context.module.exports;
}

test("UnderPAR Blondie deeplink base follows the active UnderPAR runtime redirect origin", () => {
  const helpers = loadBlondieDeeplinkHelpers({
    chrome: {
      runtime: {
        id: "underpar-runtime"
      },
      identity: {
        getRedirectURL(pathname) {
          return "https://underpar-runtime.chromiumapp.org/" + String(pathname || "");
        }
      }
    }
  });

  const url = helpers.buildUnderparWorkspaceBlondieDeeplinkBaseUrl("esm");

  assert.ok(url instanceof URL);
  assert.equal(url.origin, "https://underpar-runtime.chromiumapp.org");
  assert.equal(url.pathname, "/");
  assert.equal(url.searchParams.get("underpar_deeplink"), "esm");
});

test("UnderPAR Blondie deeplink base falls back to the UnderPAR runtime id when identity redirects are unavailable", () => {
  const helpers = loadBlondieDeeplinkHelpers({
    chrome: {
      runtime: {
        id: "underpar-fallback"
      }
    }
  });

  const baseUrl = helpers.getUnderparWorkspaceBlondieDeeplinkRuntimeBaseUrl();
  const url = helpers.buildUnderparWorkspaceBlondieDeeplinkBaseUrl("cm");

  assert.equal(baseUrl, "https://underpar-fallback.chromiumapp.org/");
  assert.ok(url instanceof URL);
  assert.equal(url.origin, "https://underpar-fallback.chromiumapp.org");
  assert.equal(url.searchParams.get("underpar_deeplink"), "cm");
});

test("UnderPAR Blondie deeplink base supports the BT workspace marker", () => {
  const helpers = loadBlondieDeeplinkHelpers({
    chrome: {
      runtime: {
        id: "underpar-bt"
      }
    }
  });

  const url = helpers.buildUnderparWorkspaceBlondieDeeplinkBaseUrl("bt");

  assert.ok(url instanceof URL);
  assert.equal(url.origin, "https://underpar-bt.chromiumapp.org");
  assert.equal(url.searchParams.get("underpar_deeplink"), "bt");
});

test("UnderPAR Blondie ESM deeplink URLs now route through the ESM bridge handler", () => {
  const payload = {
    requestPath: "/esm/v3/media-company/year/month/day/event",
    source: "blondie-button",
  };
  const helpers = loadBlondieEsmDeeplinkUrlBuilder({
    buildUnderparEsmBlondieDeeplinkPayload() {
      return payload;
    },
    buildUnderparEsmBridgeDeeplinkUrl(requestPath, receivedPayload) {
      assert.equal(requestPath, payload.requestPath);
      assert.equal(receivedPayload, payload);
      return "https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm-bridge&requestPath=%2Fesm%2Fv3%2Fmedia-company%2Fyear%2Fmonth%2Fday%2Fevent";
    }
  });

  const url = helpers.buildUnderparEsmBlondieDeeplinkUrl({ workspaceKey: "esm" });

  assert.equal(
    url,
    "https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm-bridge&requestPath=%2Fesm%2Fv3%2Fmedia-company%2Fyear%2Fmonth%2Fday%2Fevent"
  );
});
