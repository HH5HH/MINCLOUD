const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("DEGRADATION controller exposes the quick-set emergency row and full cheat-sheet export flow", () => {
  const popupSource = read("popup.js");
  const popupCss = read("popup.css");
  const cheatSheetSpecBlock = popupSource.match(
    /const DEGRADATION_CHEAT_SHEET_CALL_SPECS = Object\.freeze\(\[([\s\S]*?)\]\);/
  );
  const cheatSheetKeys = Array.from(cheatSheetSpecBlock?.[1]?.matchAll(/key:\s*"([^"]+)"/g) || []).map((match) => match[1]);

  assert.match(popupSource, /class="degradation-quick-set-row"/);
  assert.match(popupSource, /class="degradation-quick-set-select"/);
  assert.match(popupSource, /class="degradation-quick-set-btn"/);
  assert.match(popupSource, /class="degradation-copy-curl-btn"/);
  assert.match(popupSource, /class="degradation-controller-status"/);
  assert.match(popupSource, /function degradationBuildQuickSetState\(/);
  assert.match(popupSource, /async function applyDegradationQuickSetPreset\(/);
  assert.match(popupSource, /const DEGRADATION_CHEAT_SHEET_CALL_SPECS = Object\.freeze\(\[/);
  assert.match(popupSource, /function buildDegradationCheatSheetHtml\(/);
  assert.match(popupSource, /async function degradationGenerateCheatSheetFromUi\(/);
  assert.match(popupSource, /Generate a full DEGRADATION Cheat Sheet with fresh runnable cURL commands/);
  assert.match(popupSource, /Copy to Clipboard/);
  assert.match(popupSource, /Copy DEGRADATION cURL to clipboard/);
  assert.match(popupSource, /Copy all DEGRADATION cURL commands to clipboard/);
  assert.match(popupSource, /Prerequisite Setup/);
  assert.match(popupSource, /Bearer token rescue:/);
  assert.match(popupSource, /click CHEAT again to mint a new bearer token/);
  assert.match(popupSource, /QUICK SET ready:/);
  assert.ok(cheatSheetSpecBlock, "expected cheat-sheet call inventory to be declared");
  assert.deepEqual(cheatSheetKeys, [
    "get-all",
    "get-authn-all",
    "post-authn-all",
    "delete-authn-all",
    "get-authz-all",
    "post-authz-all",
    "delete-authz-all",
    "get-authz-none",
    "post-authz-none",
    "delete-authz-none",
  ]);

  assert.match(popupCss, /\.degradation-quick-set-row\s*\{/);
  assert.match(popupCss, /\.degradation-quick-set-select\s*\{/);
  assert.match(popupCss, /\.degradation-quick-set-btn,\s*\.degradation-copy-curl-btn\s*\{/);
  assert.match(popupCss, /\.degradation-copy-curl-btn\s*\{/);
});
