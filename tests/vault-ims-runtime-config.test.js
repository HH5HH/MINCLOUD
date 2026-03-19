const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("VAULT devtools import and export round-trip Adobe IMS runtime config rows", () => {
  const panelSource = read("up-devtools-panel.js");

  assert.match(panelSource, /target\.underpar\.globals\.adobeIms = null;/);
  assert.match(panelSource, /function normalizeVaultImsRuntimeConfigRecord\(/);
  assert.match(panelSource, /"Row Type": "underpar-adobe-ims"/);
  assert.match(panelSource, /if \(rowType === "underpar-adobe-ims"\)/);
  assert.match(panelSource, /const importedImsRuntimeConfig = getVaultImsRuntimeConfig\(normalizedImportedVault\);/);
  assert.match(panelSource, /setVaultImsRuntimeConfig\(nextVault, importedImsRuntimeConfig\);/);
  assert.match(panelSource, /adobeIms: importedImsRuntimeConfig,/);
});

test("VAULT summary and exportability surface the configured Adobe IMS client", () => {
  const panelSource = read("up-devtools-panel.js");

  assert.match(panelSource, /<p class="vault-metric-label">Adobe IMS<\/p>/);
  assert.match(panelSource, /getVaultImsRuntimeConfig\(vaultPayload \|\| snapshot\?\.vaultPayload \|\| null\)/);
  assert.match(panelSource, /Boolean\(imsRuntimeConfig\?\.clientId\)/);
});
