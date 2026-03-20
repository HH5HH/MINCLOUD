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

  assert.match(popupSource, /class="degradation-cheat-sheet-row\b[^"]*"/);
  assert.match(popupSource, /class="degradation-cheat-sheet-row degradation-utility-row"/);
  assert.match(popupSource, /class="degradation-copy-curl-btn"/);
  assert.match(
    popupSource,
    /class="degradation-make-clickdgr-btn esm-workspace-toolbar-icon-btn esm-workspace-toolbar-icon-btn--tearsheet"/
  );
  assert.match(popupSource, />\s*CHEAT SHEET\s*</);
  assert.match(
    popupSource,
    /<div class="degradation-runner-actions">[\s\S]*?<div class="degradation-runner-form"[\s\S]*?class="degradation-endpoint-select"[\s\S]*?class="degradation-run-go-btn"[\s\S]*?class="degradation-record-toggle-btn"[\s\S]*?<\/div>\s*<div class="degradation-cheat-sheet-row degradation-utility-row"[\s\S]*?class="degradation-copy-curl-btn"[\s\S]*?CHEAT SHEET[\s\S]*?class="degradation-make-clickdgr-btn esm-workspace-toolbar-icon-btn esm-workspace-toolbar-icon-btn--tearsheet"/
  );
  assert.doesNotMatch(popupSource, /class="degradation-controller-status"/);
  assert.doesNotMatch(popupSource, /class="degradation-controller-shell"/);
  assert.match(popupSource, /function degradationHasQualifiedCheatSheetContext\(/);
  assert.match(popupSource, /function degradationSyncCheatSheetButton\(/);
  assert.match(popupSource, /Select Environment x Media Company, RequestorId, and MVPD first/);
  assert.doesNotMatch(popupSource, /class="degradation-quick-set-select"/);
  assert.doesNotMatch(popupSource, /class="degradation-quick-set-btn"/);
  assert.match(popupSource, /function buildDegradationCheatSheetSetupItems\(/);
  assert.match(popupSource, /async function degradationGenerateCheatSheetFromUi\(/);
  assert.match(popupSource, /async function resolveClickDgrCheatSheetAuthContext\(/);
  assert.match(popupSource, /Select RequestorId in the global picker first\./);
  assert.match(popupSource, /Select MVPD in the global picker first\./);
  assert.match(
    popupSource,
    /Open the DEGRADATION Cheat Sheet in the workspace using the current global RequestorId and MVPD/
  );
  assert.match(popupSource, /degradationWorkspaceStoreCheatSheet\(/);
  assert.match(popupSource, /function degradationWorkspaceGetCheatSheets\(/);
  assert.match(popupSource, /function degradationWorkspaceFlushReportsToTarget\(/);
  assert.match(popupSource, /function degradationWorkspaceActivateTarget\(/);
  assert.match(popupSource, /degradationWorkspacePendingCheatSheetByWindowId:\s*new Map\(\)/);
  assert.match(popupSource, /function degradationWorkspaceSetPendingCheatSheet\(/);
  assert.match(popupSource, /function degradationWorkspaceClearPendingCheatSheet\(/);
  assert.match(popupSource, /function degradationWorkspaceWaitForReady\(/);
  assert.match(popupSource, /degradationWorkspaceMarkReady\(/);
  assert.match(popupSource, /syncReports:\s*false/);
  assert.match(popupSource, /function degradationBuildCheatSheetFallbackCoverage\(/);
  assert.match(popupSource, /Live \/all harvest failed\. Building cheat sheet with fallback defaults\./);
  assert.match(popupSource, /DEGRADATION_CHEAT_SHEET_FAST_AUTH_TIMEOUT_MS = 1200/);
  assert.match(popupSource, /DEGRADATION_CHEAT_SHEET_FAST_HARVEST_TIMEOUT_MS = 1200/);
  assert.match(popupSource, /"cheat-sheet-start"/);
  assert.match(popupSource, /"cheat-sheet-progress"/);
  assert.match(popupSource, /"cheat-sheet-error"/);
  assert.match(
    popupSource,
    /const reports = degradationWorkspaceGetReports\(resolvedSelectionKey\);\s*const cheatSheets = degradationWorkspaceGetCheatSheets\(resolvedSelectionKey\);/
  );
  assert.match(popupSource, /await degradationWorkspaceWaitForReady\(/);
  assert.match(popupSource, /degradationWorkspaceBroadcastReports\(resolvedSelectionKey, resolvedWindowId\);/);
  assert.match(popupSource, /void degradationWorkspaceSendWorkspaceMessage\("report-result", reportPayload, \{ targetWindowId: resolvedWindowId \}\);/);
  assert.match(popupSource, /activateWorkspace:\s*false/);
  assert.match(popupSource, /void degradationWorkspaceActivateTarget\(\);/);
  assert.match(popupSource, /DEGRADATION_MEGA_STATUS_ENDPOINT_SPEC/);
  assert.match(popupSource, /degradationBuildEndpointReportsFromMegaStatusReport\(megaReport, queryValues\)/);
  assert.doesNotMatch(popupSource, /const reports = degradationWorkspaceGetAllReports\(\);\s*const cheatSheets = degradationWorkspaceGetAllCheatSheets\(\);/);
  assert.match(popupSource, /cheatSheetPending:\s*Boolean\(pendingCheatSheet\)/);
  assert.match(popupSource, /cheatSheetLoadingMessage:\s*String\(pendingCheatSheet\?\.message \|\| ""\)\.trim\(\)/);
  assert.match(popupSource, /const pendingCheatSheet = degradationWorkspaceGetPendingCheatSheet\(senderWindowId, selectionContext\.selectionKey\);/);
  assert.match(popupSource, /function buildDegradationCheatSheetTokenBootstrap\(/);
  assert.match(popupSource, /grant_type:\s*"client_credentials"/);
  assert.match(popupSource, /Step 1\. Mint a fresh bearer token:/);
  assert.match(popupSource, /Step 3\. Replace <PASTE_FRESH_ACCESS_TOKEN_HERE> in the calls below\./);
  assert.match(popupSource, /manualTokenCommand/);
  assert.match(popupSource, /void degradationWorkspaceSendWorkspaceMessage\("cheat-sheet-result"/);
  assert.match(popupSource, /degradationHarvestCheatSheetTargetCoverage\(activePanelState, queryValues\)/);
  assert.match(popupSource, /resolveClickDgrAuthContext\(context, requestToken, \{\s*\.\.\.options,\s*forceFreshToken: false,/);
  assert.doesNotMatch(popupSource, /source:\s*"degradation-cheat-sheet",\s*forceFreshToken:\s*true/);
  assert.match(popupSource, /Could not resolve host:/);
  assert.doesNotMatch(popupSource, /Could not resolve host: --request/);
  assert.match(popupSource, /const methodPrefix = method === "GET" \? "curl" : `curl -X \$\{method\}`;/);
  assert.match(
    popupSource,
    /: accessToken\s*\?\s*`-H \$\{quoteCurlDoubleQuoted\(`Authorization: Bearer \$\{accessToken\}`\)\}`\s*:\s*'-H "Authorization: Bearer <PASTE_FRESH_ACCESS_TOKEN_HERE>"'/
  );
  assert.match(popupSource, /const tokenRequestBody = new URLSearchParams\(\{/);
  assert.match(popupSource, /curl \$\{quoteCurlDoubleQuoted\(tokenUrl\)\}/);
  assert.match(popupSource, /-d \$\{quoteCurlDoubleQuoted\(tokenRequestBody\)\}/);
  assert.doesNotMatch(popupSource, /scope:\s*tokenScope/);
  assert.doesNotMatch(popupSource, /-H "Content-Type: application\/x-www-form-urlencoded"/);
  assert.match(popupSource, /-H "Authorization: Bearer \$DGR_ACCESS_TOKEN"/);
  assert.doesNotMatch(popupSource, /quoteCurlDoubleQuoted\(`api_version: \$\{DEGRADATION_API_VERSION\}`\)/);
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
  assert.match(popupCss, /\.degradation-utility-row\s*\{/);
  assert.doesNotMatch(popupCss, /\.degradation-controller-shell\s*\{/);
  assert.match(
    popupCss,
    /\.degradation-cheat-sheet-row\s*\{[\s\S]*?display:\s*flex;[\s\S]*?align-items:\s*center;[\s\S]*?gap:\s*8px;[\s\S]*?flex-wrap:\s*nowrap;/
  );
  assert.match(
    popupCss,
    /\.degradation-utility-row\s*\{[\s\S]*?justify-content:\s*space-between;[\s\S]*?margin-top:\s*2px;[\s\S]*?width:\s*100%;/
  );
  assert.match(
    popupCss,
    /\.degradation-runner-form\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?min-width:\s*0;[\s\S]*?flex-direction:\s*row;[\s\S]*?margin-top:\s*0;/
  );
  assert.match(
    popupCss,
    /\.degradation-runner-form \.degradation-endpoint-select\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?width:\s*auto;[\s\S]*?min-width:\s*0;/
  );
  assert.match(
    popupCss,
    /\.degradation-runner-actions\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-wrap:\s*nowrap;[\s\S]*?justify-content:\s*flex-end;[\s\S]*?align-items:\s*center;/
  );
  assert.match(
    popupCss,
    /\.degradation-utility-row \.degradation-make-clickdgr-btn\.esm-workspace-toolbar-icon-btn--tearsheet\s*\{[\s\S]*?width:\s*32px;[\s\S]*?height:\s*32px;/
  );
  assert.match(
    popupCss,
    /\.service-degradation \.degradation-make-clickdgr-btn\.esm-workspace-toolbar-icon-btn--tearsheet\s*\{/
  );
  assert.match(popupCss, /\.degradation-copy-curl-btn\s*\{/);
  assert.match(
    popupCss,
    /\.degradation-quick-set-btn,\s*\.degradation-copy-curl-btn\s*\{[\s\S]*?height:\s*32px;[\s\S]*?display:\s*inline-flex;[\s\S]*?align-items:\s*center;[\s\S]*?justify-content:\s*center;/
  );
  assert.match(
    popupCss,
    /\.degradation-copy-curl-btn\s*\{[\s\S]*?flex:\s*0 1 auto;[\s\S]*?min-width:\s*0;[\s\S]*?border-color:\s*var\(--service-action-border\);[\s\S]*?background:\s*var\(--service-action-bg\);[\s\S]*?color:\s*#ffffff;[\s\S]*?box-shadow:\s*var\(--service-action-shadow\);/
  );
  assert.match(
    popupCss,
    /\.degradation-copy-curl-btn:hover:not\(:disabled\)\s*\{[\s\S]*?border-color:\s*var\(--service-action-border-hover\);[\s\S]*?background:\s*var\(--service-action-bg-hover\);[\s\S]*?color:\s*#ffffff;[\s\S]*?box-shadow:\s*var\(--service-action-shadow-hover\);/
  );

  assert.match(workspaceSource, /function renderCheatSheetCard\(/);
  assert.match(workspaceSource, /function buildWorkspaceFeedMarkup\(/);
  assert.match(workspaceSource, /function workspacePayloadMatchesSelection\(/);
  assert.match(workspaceSource, /function resetWorkspaceCardsForSelection\(/);
  assert.match(workspaceSource, /const incomingSelectionKey = normalizeWorkspaceSelectionKey\(payload\?\.selectionKey,\s*\{/);
  assert.match(workspaceSource, /const nextSelectionKey = incomingSelectionKey \|\| previousSelectionKey;/);
  assert.match(workspaceSource, /function handleCheatSheetResult\(/);
  assert.match(workspaceSource, /function handleCheatSheetStart\(/);
  assert.match(workspaceSource, /function handleCheatSheetError\(/);
  assert.match(workspaceSource, /const cheatSheetPending = payload\?\.cheatSheetPending === true;/);
  assert.match(workspaceSource, /state\.cheatSheetLoading = cheatSheetPending;/);
  assert.match(workspaceSource, /Generating DEGRADATION Cheat Sheet/);
  assert.match(workspaceSource, /masterCopyText/);
  assert.match(workspaceSource, /Fresh Token Bootstrap/);
  assert.match(workspaceSource, /full DEGRADATION setup and command chain/);
  assert.match(workspaceSource, /event === "cheat-sheet-start"/);
  assert.match(workspaceSource, /event === "cheat-sheet-progress"/);
  assert.match(workspaceSource, /event === "cheat-sheet-error"/);
  assert.match(workspaceSource, /event === "cheat-sheet-result"/);
  assert.match(workspaceSource, /els\.cardsHost\.innerHTML = buildWorkspaceFeedMarkup\(\);/);
  assert.match(workspaceSource, /if \(!workspacePayloadMatchesSelection\(report\.selectionKey\)\) \{\s*return;\s*\}/);
  assert.match(workspaceSource, /if \(!workspacePayloadMatchesSelection\(cheatSheet\.selectionKey\)\) \{\s*return;\s*\}/);
  assert.match(workspaceSource, /if \(!workspacePayloadMatchesSelection\(payload\?\.selectionKey\)\) \{\s*return;\s*\}/);
  assert.match(workspaceSource, /data-action="copy-cheat-all"/);
  assert.match(workspaceSource, /data-action="copy-cheat-command"/);
  assert.match(workspaceSource, /Prerequisite Setup/);

  assert.match(workspaceCss, /\.degradation-cheat-sheet-card\s*\{/);
  assert.match(workspaceCss, /\.degradation-cheat-action-btn\s*\{/);
  assert.match(workspaceCss, /\.degradation-cheat-command-block\s*\{/);
});
