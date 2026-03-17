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

function loadBlondieSignatureHelpers() {
  const source = fs.readFileSync(POPUP_JS_PATH, "utf8");
  const script = [
    'const UNDERPAR_BLONDIE_ZIP_TOOL_BETA_ARTICLE_URL = "https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP";',
    'const UNDERPAR_UPSPACE_SLACK_LINK_LABEL = "in UPSpace";',
    extractFunctionSource(source, "escapeUnderparSlackMrkdwn"),
    extractFunctionSource(source, "sanitizeUnderparSlackLinkTarget"),
    extractFunctionSource(source, "buildUnderparSlackMrkdwnLink"),
    extractFunctionSource(source, "buildUnderparUpspaceSlackLink"),
    extractFunctionSource(source, "buildUnderparBlondieSignatureLine"),
    "module.exports = { buildUnderparBlondieSignatureLine };"
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {}
  };
  vm.runInNewContext(script, context, { filename: POPUP_JS_PATH });
  return context.module.exports;
}

test("UnderPAR Blondie signature uses the ZIP-ZAP article link", () => {
  const helpers = loadBlondieSignatureHelpers();
  const signature = helpers.buildUnderparBlondieSignatureLine();
  assert.equal(signature, "// <https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP|zip-zap> :blondiebtn: in UnderPAR");
});

test("UnderPAR Blondie signature keeps the UnderPAR deeplink alongside ZIP-ZAP", () => {
  const helpers = loadBlondieSignatureHelpers();
  const signature = helpers.buildUnderparBlondieSignatureLine(null, "https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm");
  assert.equal(
    signature,
    "// <https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP|zip-zap> :blondiebtn: <https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm|in UnderPAR>"
  );
});

test("UnderPAR Blondie signature appends the UPSpace launch link for ESM workspace payloads", () => {
  const helpers = loadBlondieSignatureHelpers();
  const signature = helpers.buildUnderparBlondieSignatureLine(
    { workspaceKey: "esm" },
    "https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm",
    "https://hh5hh.com/ups/?id=abc123"
  );
  assert.equal(
    signature,
    "// <https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP|zip-zap> :blondiebtn: <https://underpar-runtime.chromiumapp.org/?underpar_deeplink=esm|in UnderPAR> <https://hh5hh.com/ups/?id=abc123|in UPSpace>"
  );
});

test("UnderPAR Blondie signature skips the UPSpace launch link for non-ESM payloads", () => {
  const helpers = loadBlondieSignatureHelpers();
  const signature = helpers.buildUnderparBlondieSignatureLine(
    { workspaceKey: "cm" },
    "https://underpar-runtime.chromiumapp.org/?underpar_deeplink=cm",
    "https://hh5hh.com/ups/?id=abc123"
  );
  assert.equal(
    signature,
    "// <https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP|zip-zap> :blondiebtn: <https://underpar-runtime.chromiumapp.org/?underpar_deeplink=cm|in UnderPAR>"
  );
});
