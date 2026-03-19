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

  assert.match(source, /@page\s*\{[\s\S]*size:\s*279\.4mm\s+215\.9mm;/i);
  assert.match(source, /@page\s*\{[\s\S]*margin:\s*4mm;/i);
  assert.match(source, /@media print[\s\S]*print-color-adjust:\s*exact;/i);
  assert.match(source, /@media print[\s\S]*:root\s*\{[\s\S]*--ups-print-scale:\s*1;/i);
  assert.match(
    source,
    /@media print[\s\S]*\.workspace-app \*,[\s\S]*\.ibeta-app \*::after\s*\{[\s\S]*background-image:\s*none !important;/i
  );
  assert.match(source, /@media print[\s\S]*\.ups-shell\s*\{[\s\S]*zoom:\s*var\(--ups-print-scale,\s*1\);/i);
  assert.match(source, /@supports not \(zoom:\s*1\)\s*\{[\s\S]*\.ups-shell\s*\{[\s\S]*transform:\s*scale\(var\(--ups-print-scale,\s*1\)\);/i);
  assert.match(source, /@media print[\s\S]*\.report-card\s*\{[\s\S]*background:\s*#fff !important;/i);
  assert.match(source, /@media print[\s\S]*\.ups-report-title-wrap\s*\{[\s\S]*background:\s*#f3f4f6 !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table thead th\s*\{[\s\S]*background:\s*#e7eaee !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table tbody tr:nth-child\(even\) td\s*\{[\s\S]*background:\s*#f7f8fa !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*width:\s*max-content !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table\s*\{[\s\S]*width:\s*max-content !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table\s*\{[\s\S]*table-layout:\s*auto !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table thead th\s*\{[\s\S]*position:\s*static !important;/i);
  assert.match(source, /@media print[\s\S]*\.ibeta-report-card \.esm-table th,[\s\S]*white-space:\s*nowrap !important;/i);
  assert.match(runtimeSource, /const UPS_PRINT_PAGE_STYLE_ID = "underpar-ups-print-page-style";/);
  assert.match(runtimeSource, /function prepareUpspacePrintLayout\(/);
  assert.match(runtimeSource, /const UPS_PRINT_SCALE_MIN = 0\.42;/);
  assert.match(runtimeSource, /function buildUpspacePrintScale\(/);
  assert.match(runtimeSource, /sanitizeDownloadFileSegment\(buildUpspaceReportLabel\(snapshot\), "report"\),\s*40/);
  assert.match(
    runtimeSource,
    /measurementRoot\.querySelectorAll\(\s*"\.ibeta-report-scroll-shell, \.ibeta-report-card, \.ibeta-report-card \.ups-report-title-wrap, \.ibeta-report-card \.esm-table-wrapper, \.ibeta-report-card \.esm-table"\s*\)/
  );
  assert.match(runtimeSource, /buildUpspacePrintPageCss\(widestMeasuredPx \+ 32\)/);
});

test("UPSpace live layout expands to report width without truncating mobile data", () => {
  const source = read("ups/view.css");
  const workspaceSource = read("ups/esm-workspace.css");
  const runtimeSource = read("ups/view.js");

  assert.match(source, /\.ibeta-report-scroll-shell\s*\{[\s\S]*overflow-x:\s*auto;[\s\S]*touch-action:\s*pan-x pan-y;/i);
  assert.match(source, /\.ibeta-report-card\s*\{[\s\S]*width:\s*max-content;[\s\S]*min-width:\s*100%;/i);
  assert.match(source, /\.ups-report-title-wrap\s*\{[\s\S]*background:\s*var\(--card-band-top\);/i);
  assert.match(source, /\.ups-report-title\s*\{[\s\S]*font-size:\s*18px;/i);
  assert.match(source, /\.ibeta-report-card \.esm-table-wrapper\s*\{[\s\S]*overflow:\s*visible;/i);
  assert.match(source, /\.ibeta-report-card \.esm-table\s*\{[\s\S]*width:\s*max-content;[\s\S]*min-width:\s*100%;/i);
  assert.match(workspaceSource, /\.esm-table th,[\s\S]*\.esm-table td \{[\s\S]*overflow:\s*visible;[\s\S]*text-overflow:\s*clip;/i);
  assert.match(runtimeSource, /<div class="ibeta-report-scroll-shell">/);
  assert.match(runtimeSource, /<h1 class="ups-report-title"/);
  assert.doesNotMatch(runtimeSource, /card-url-context|card-col-list|card-subtitle/);
  assert.doesNotMatch(source, /@media screen and \(max-width:\s*900px\)[\s\S]*\.ibeta-report-card \.esm-table thead\s*\{[\s\S]*display:\s*none;/i);
  assert.doesNotMatch(source, /\.ibeta-report-card \.esm-table td::before\s*\{[\s\S]*content:\s*attr\(data-column-label\);/i);
  assert.doesNotMatch(runtimeSource, /data-column-label=|data-is-primary=/);
});

test("UPSpace entrypoint cache-busts CSS and JS assets", () => {
  const source = read("ups/index.php");

  assert.match(source, /\$upsAssetVersion = static function \(string \$relativePath\): string \{/);
  assert.match(source, /\$esmWorkspaceCssHref = '\.\/esm-workspace\.css\?v=' \. \$upsAssetVersion\('esm-workspace\.css'\);/);
  assert.match(source, /\$viewCssHref = '\.\/view\.css\?v=' \. \$upsAssetVersion\('view\.css'\);/);
  assert.match(source, /\$viewJsHref = '\.\/view\.js\?v=' \. \$upsAssetVersion\('view\.js'\);/);
  assert.match(source, /<link rel="stylesheet" href="<\?= htmlspecialchars\(\$esmWorkspaceCssHref, ENT_QUOTES, 'UTF-8'\) \?>" \/>/);
  assert.match(source, /<link rel="stylesheet" href="<\?= htmlspecialchars\(\$viewCssHref, ENT_QUOTES, 'UTF-8'\) \?>" \/>/);
  assert.match(source, /<script src="<\?= htmlspecialchars\(\$viewJsHref, ENT_QUOTES, 'UTF-8'\) \?>"><\/script>/);
});
