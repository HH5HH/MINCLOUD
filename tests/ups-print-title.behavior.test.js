const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const UPS_VIEW_JS_PATH = path.join(ROOT, "ups", "view.js");

function extractFunctionSource(source, functionName) {
  const marker = "function " + functionName + "(";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, "Unable to locate " + functionName + " in ups/view.js");
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

function loadUpsPrintHelpers() {
  const source = fs.readFileSync(UPS_VIEW_JS_PATH, "utf8");
  const script = [
    'const ZIP_ZAP_URL = "https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP";',
    'const UPS_PRINT_PAGE_STYLE_ID = "underpar-ups-print-page-style";',
    "const UPS_PRINT_PAGE_MARGIN_MM = 8;",
    "const UPS_PRINT_PAGE_WIDTH_MIN_MM = 431.8;",
    "const UPS_PRINT_PAGE_WIDTH_MAX_MM = 1117.6;",
    "const UPS_PRINT_PAGE_HEIGHT_MM = 279.4;",
    extractFunctionSource(source, "escapeHtml"),
    extractFunctionSource(source, "firstNonEmptyString"),
    extractFunctionSource(source, "sanitizeDownloadFileSegment"),
    extractFunctionSource(source, "truncateDownloadFileSegment"),
    extractFunctionSource(source, "getTerminalPathSegment"),
    extractFunctionSource(source, "getPrimarySnapshotCard"),
    extractFunctionSource(source, "buildUpspaceReportLabel"),
    extractFunctionSource(source, "buildUpspacePrintStamp"),
    extractFunctionSource(source, "buildUpspacePrintDocumentTitle"),
    extractFunctionSource(source, "buildUpspacePrintActionLabel"),
    extractFunctionSource(source, "clampNumber"),
    extractFunctionSource(source, "pxToMm"),
    extractFunctionSource(source, "buildUpspacePrintPageCss"),
    extractFunctionSource(source, "buildUtilityBarMarkup"),
    extractFunctionSource(source, "syncDocumentTitle"),
    "module.exports = { buildUpspacePrintDocumentTitle, buildUpspacePrintPageCss, buildUtilityBarMarkup, pxToMm, syncDocumentTitle };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    document: { title: "UPSpace" },
  };
  vm.runInNewContext(script, context, { filename: UPS_VIEW_JS_PATH });
  return context.module.exports;
}

test("UPSpace print titles reuse the ESM export context", () => {
  const helpers = loadUpsPrintHelpers();
  const snapshot = {
    workspaceKey: "esm",
    programmerId: "Turner",
    adobePassEnvironmentKey: "prod",
    createdAt: Date.UTC(2026, 2, 16, 12, 34, 56, 789),
    cards: [
      {
        displayNodeLabel: "Filtered low-volume",
        headerContext: {
          pathSegments: ["media-company", "filtered-low-volume"],
        },
      },
    ],
  };

  assert.equal(
    helpers.buildUpspacePrintDocumentTitle(snapshot),
    "underpar_esm_Turner_Filtered_low-volume_prod_2026-03-16T12-34-56-789Z"
  );
});

test("UPSpace print control exposes contextual hover copy", () => {
  const helpers = loadUpsPrintHelpers();
  const snapshot = {
    cards: [
      {
        displayNodeLabel: "Filtered low-volume",
      },
    ],
  };

  const markup = helpers.buildUtilityBarMarkup(snapshot);
  assert.match(markup, /class="ups-utility-link ups-print-link"/);
  assert.match(markup, /title="Print Filtered low-volume from UPSpace"/);
  assert.match(markup, /aria-label="Print Filtered low-volume from UPSpace"/);
});

test("UPSpace syncDocumentTitle projects the print filename into the page title", () => {
  const helpers = loadUpsPrintHelpers();
  const fakeDocument = { title: "UPSpace" };
  const snapshot = {
    workspaceKey: "esm",
    programmerId: "Turner",
    adobePassEnvironmentKey: "prod",
    createdAt: Date.UTC(2026, 2, 16, 12, 34, 56, 789),
    cards: [
      {
        displayNodeLabel: "Filtered low-volume",
      },
    ],
  };

  helpers.syncDocumentTitle(snapshot, fakeDocument);

  assert.equal(fakeDocument.title, "underpar_esm_Turner_Filtered_low-volume_prod_2026-03-16T12-34-56-789Z");
});

test("UPSpace print page css expands beyond baseline landscape when the report is wider", () => {
  const helpers = loadUpsPrintHelpers();

  assert.equal(helpers.buildUpspacePrintPageCss(300), "@page { size: 431.80mm 279.40mm; margin: 8mm; }");
  assert.equal(helpers.buildUpspacePrintPageCss(620), "@page { size: 620.00mm 279.40mm; margin: 8mm; }");
  assert.equal(helpers.pxToMm(960).toFixed(2), "254.00");
});
