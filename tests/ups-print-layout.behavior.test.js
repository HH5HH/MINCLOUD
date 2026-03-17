const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("UPSpace print stylesheet keeps wide reports overflow-safe in PDF", () => {
  const source = read("ups/view.css");
  const runtimeSource = read("ups/view.js");

  assert.match(source, /@page\s*\{[\s\S]*size:\s*17in\s+11in;/i);
  assert.match(source, /@media print[\s\S]*print-color-adjust:\s*exact;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*width:\s*max-content !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table\s*\{[\s\S]*width:\s*max-content !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table\s*\{[\s\S]*table-layout:\s*auto !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table thead th,[\s\S]*position:\s*static !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table th,[\s\S]*white-space:\s*nowrap !important;/i);
  assert.match(runtimeSource, /const UPS_PRINT_PAGE_STYLE_ID = "underpar-ups-print-page-style";/);
  assert.match(runtimeSource, /function prepareUpspacePrintLayout\(/);
  assert.match(
    runtimeSource,
    /measurementRoot\.querySelectorAll\(\s*"\.ibeta-report-card, \.ibeta-report-card \.card-head, \.ibeta-report-card \.card-col-list, \.ibeta-report-card \.esm-table-wrapper, \.ibeta-report-card \.esm-table"\s*\)/
  );
  assert.match(runtimeSource, /buildUpspacePrintPageCss\(pxToMm\(widestMeasuredPx \+ 64\)\)/);
});

test("UPSpace live layout expands to report width without truncating mobile data", () => {
  const source = read("ups/view.css");
  const workspaceSource = read("ups/esm-workspace.css");

  assert.match(source, /html,[\s\S]*body\s*\{[\s\S]*width:\s*max-content;/i);
  assert.match(source, /\.ibeta-stage\s*\{[\s\S]*width:\s*max-content;[\s\S]*overflow:\s*visible;/i);
  assert.match(source, /\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*width:\s*max-content;[\s\S]*overflow:\s*visible;/i);
  assert.match(source, /\.ibeta-report-card \.esm-table\s*\{[\s\S]*width:\s*max-content;[\s\S]*min-width:\s*100%;/i);
  assert.match(workspaceSource, /\.esm-table th,[\s\S]*\.esm-table td \{[\s\S]*overflow:\s*visible;[\s\S]*text-overflow:\s*clip;/i);
});
