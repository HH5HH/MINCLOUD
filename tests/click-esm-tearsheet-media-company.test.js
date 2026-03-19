const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

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

function extractConstDeclaration(source, constName) {
  const marker = `const ${constName} =`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Unable to locate ${constName}`);
  const end = source.indexOf(";\n", start);
  assert.notEqual(end, -1, `Unable to locate terminator for ${constName}`);
  return source.slice(start, end + 1);
}

function buildHarness(relativePath) {
  const source = read(relativePath);
  const script = [
    extractFunctionSource(source, "appendFilterParams"),
    extractConstDeclaration(source, "ESM_SUPPRESSED_COLUMNS"),
    extractFunctionSource(source, "__normalizeColumnName"),
    extractFunctionSource(source, "__isSuppressedEsmColumn"),
    extractFunctionSource(source, "getVisibleSystemRequestUrl"),
    extractFunctionSource(source, "getVisibleSystemQueryString"),
    extractFunctionSource(source, "getCompactCmuLabel"),
    "module.exports = { appendFilterParams, __isSuppressedEsmColumn, getVisibleSystemRequestUrl, getVisibleSystemQueryString, getCompactCmuLabel };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    URLSearchParams,
    window: {
      location: {
        href: "https://example.test/",
      },
    },
    document: {
      getElementById(id) {
        if (id === "fltr_requestorid") {
          return {
            selectedOptions: [{ value: "MML" }],
          };
        }
        if (id === "fltr_mvpdId") {
          return {
            disabled: false,
            selectedOptions: [{ value: "ATT" }],
          };
        }
        return null;
      },
    },
  };
  vm.runInNewContext(script, context, { filename: relativePath });
  return {
    source,
    api: context.module.exports,
  };
}

["clickESM-template.html", "scripts/clickESM.html"].forEach((relativePath) => {
  test(`${relativePath} does not append media-company to ESM click export URLs`, () => {
    const { source, api } = buildHarness(relativePath);

    assert.doesNotMatch(source, /searchParams\.set\(['"]media-company['"]/);
    assert.doesNotMatch(source, /params\.set\(['"]media-company['"]/);

    const nextUrl = api.appendFilterParams("https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day");
    const parsed = new URL(nextUrl);
    assert.equal(parsed.searchParams.get("requestor-id"), "MML");
    assert.equal(parsed.searchParams.get("mvpd"), "ATT");
    assert.equal(parsed.searchParams.has("media-company"), false);
  });

  test(`${relativePath} hides media-company from visible clickESM labels and columns`, () => {
    const { source, api } = buildHarness(relativePath);

    assert.doesNotMatch(source, /\['media-company',\s*'Media company'\]/);
    assert.match(
      source,
      /const headers = Object\.keys\(sorted\[0\]\)\.filter\(\(columnName\) => !__isSuppressedEsmColumn\(columnName\)\);/
    );
    assert.match(source, /anchor\.href = visibleHref \|\| resolvedHref;/);

    const visibleQuery = api.getVisibleSystemQueryString(
      "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day?media-company=Turner&requestor-id=MML&mvpd=ATT&metrics=count&format=json"
    );
    assert.equal(visibleQuery, "?requestor-id=MML&mvpd=ATT");

    const visibleUrl = api.getVisibleSystemRequestUrl(
      "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day?requestor-id=MML&mvpd=ATT&metrics=count&limit=500&format=json#frag"
    );
    assert.equal(
      visibleUrl,
      "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day?requestor-id=MML&mvpd=ATT"
    );

    const compactLabel = api.getCompactCmuLabel(
      "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day?media-company=Turner&requestor-id=MML&mvpd=ATT&limit=500&format=json"
    );
    assert.equal(compactLabel, "year/month/day?requestor-id=MML&mvpd=ATT");
    assert.equal(api.__isSuppressedEsmColumn("media-company"), true);
  });
});
