const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("DEGRADATION controller exposes a workspace cheat-sheet flow without quick-set UI", () => {
  const popupSource = read("popup.js");
  const popupCss = read("popup.css");
  const workspaceSource = read("degradation-workspace.js");
  const workspaceCss = read("degradation-workspace.css");
  const cheatSheetSpecBlock = popupSource.match(
    /const DEGRADATION_CHEAT_SHEET_CALL_SPECS = Object\.freeze\(\[([\s\S]*?)\]\);/
  );
  const cheatSheetKeys = Array.from(cheatSheetSpecBlock?.[1]?.matchAll(/key:\s*"([^"]+)"/g) || []).map((match) => match[1]);

  assert.match(popupSource, /class="degradation-cheat-sheet-row"/);
  assert.match(popupSource, /class="degradation-copy-curl-btn"/);
  assert.doesNotMatch(popupSource, /class="degradation-quick-set-select"/);
  assert.doesNotMatch(popupSource, /class="degradation-quick-set-btn"/);
  assert.match(popupSource, /function buildDegradationCheatSheetSetupItems\(/);
  assert.match(popupSource, /async function degradationGenerateCheatSheetFromUi\(/);
  assert.match(popupSource, /Select RequestorId in the global picker first\./);
  assert.match(popupSource, /Select MVPD in the global picker first\./);
  assert.match(
    popupSource,
    /Open the DEGRADATION Cheat Sheet in the workspace using the current global RequestorId and MVPD/
  );
  assert.match(popupSource, /degradationWorkspaceStoreCheatSheet\(/);
  assert.match(popupSource, /function degradationWorkspaceWaitForReady\(/);
  assert.match(popupSource, /degradationWorkspaceMarkReady\(/);
  assert.match(popupSource, /syncReports:\s*false/);
  assert.match(popupSource, /void degradationWorkspaceSendWorkspaceMessage\("cheat-sheet-result"/);
  assert.match(popupSource, /click CHEAT again to mint a new bearer token/);
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

  assert.match(popupCss, /\.degradation-cheat-sheet-row\s*\{/);
  assert.match(popupCss, /\.degradation-copy-curl-btn\s*\{/);

  assert.match(workspaceSource, /function renderCheatSheetCard\(/);
  assert.match(workspaceSource, /function handleCheatSheetResult\(/);
  assert.match(workspaceSource, /event === "cheat-sheet-result"/);
  assert.match(workspaceSource, /data-action="copy-cheat-all"/);
  assert.match(workspaceSource, /data-action="copy-cheat-command"/);
  assert.match(workspaceSource, /Prerequisite Setup/);

  assert.match(workspaceCss, /\.degradation-cheat-sheet-card\s*\{/);
  assert.match(workspaceCss, /\.degradation-cheat-action-btn\s*\{/);
  assert.match(workspaceCss, /\.degradation-cheat-command-block\s*\{/);
});
