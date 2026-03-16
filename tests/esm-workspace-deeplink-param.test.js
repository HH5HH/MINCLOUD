const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const FILE_PATH = path.join(ROOT, "esm-workspace.js");

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

test("ESM workspace accepts deeplink as a direct request-path alias", () => {
  const source = fs.readFileSync(FILE_PATH, "utf8");
  const script = [
    'const ESM_NODE_BASE_PATH = "esm/v3/media-company/";',
    'const ESM_NODE_BASE_URL = "https://mgmt.auth.adobe.com/esm/v3/media-company/";',
    'const DEFAULT_ADOBEPASS_ENVIRONMENT = { esmBase: "https://mgmt.auth.adobe.com/esm/v3/media-company/" };',
    extractBetweenMarkers(
      source,
      "function buildWorkspaceDeeplinkRequestPath(",
      "function buildWorkspaceDeeplinkAbsoluteRequestUrl("
    ),
    "module.exports = { parseWorkspaceDeeplinkPayloadFromLocation };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    URLSearchParams,
    window: {
      location: {
        hash: "",
        search:
          "?deeplink=%2Fesm%2Fv3%2Fmedia-company%2Fyear%2Fmonth%2Fday%2Fproxy%2Fmvpd&displayNodeLabel=mvpd&source=megspace-html-export",
      },
    },
  };
  vm.runInNewContext(script, context, { filename: FILE_PATH });

  const result = context.module.exports.parseWorkspaceDeeplinkPayloadFromLocation();

  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    requestPath: "/esm/v3/media-company/year/month/day/proxy/mvpd",
    displayNodeLabel: "mvpd",
    source: "megspace-html-export",
    createdAt: result.createdAt,
  });
  assert.equal(typeof result.createdAt, "number");
  assert.ok(result.createdAt > 0);
});
