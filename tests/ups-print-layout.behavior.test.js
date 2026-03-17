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
  assert.match(runtimeSource, /measurementRoot\.querySelectorAll\("\.ibeta-report-card, \.ibeta-report-card \.esm-table-wrapper, \.ibeta-report-card \.esm-table"\)/);
  assert.match(runtimeSource, /buildUpspacePrintPageCss\(pxToMm\(widestMeasuredPx \+ 64\)\)/);
});

test("UPSpace narrow-screen layout keeps the report readable with horizontal table scrolling", () => {
  const source = read("ups/view.css");

  assert.match(source, /html,[\s\S]*body\s*\{[\s\S]*overflow-x:\s*auto;/i);
  assert.match(source, /\.ibeta-stage\s*\{[\s\S]*overflow-x:\s*auto;/i);
  assert.match(source, /@media \(max-width:\s*900px\)[\s\S]*\.ups-utility-bar\s*\{[\s\S]*flex-wrap:\s*wrap;/i);
  assert.match(source, /@media \(max-width:\s*900px\)[\s\S]*\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*overflow-x:\s*auto;/i);
  assert.match(source, /@media \(max-width:\s*900px\)[\s\S]*\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*touch-action:\s*pan-x pan-y;/i);
  assert.match(source, /@media \(max-width:\s*900px\)[\s\S]*\.ibeta-report-card \.esm-table\s*\{[\s\S]*min-width:\s*max-content;/i);
});
