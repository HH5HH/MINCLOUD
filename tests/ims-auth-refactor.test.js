const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function extractFunctionSource(source, functionName) {
  const markers = [`async function ${functionName}(`, `function ${functionName}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start !== -1) {
      break;
    }
  }
  assert.notEqual(start, -1, `Unable to locate ${functionName}`);
  const paramsStart = source.indexOf("(", start);
  assert.notEqual(paramsStart, -1, `Unable to locate params for ${functionName}`);
  let paramsDepth = 0;
  let bodyStart = -1;
  for (let index = paramsStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "(") paramsDepth += 1;
    if (char === ")") {
      paramsDepth -= 1;
      if (paramsDepth === 0) {
        bodyStart = source.indexOf("{", index);
        break;
      }
    }
  }
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

function loadPopupImsHelpers() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const IMS_SCOPE = "openid profile offline_access additional_info.projectedProductContext read_organizations";',
    'const UNDERPAR_ACTIVATION_REQUIRED_SCOPE = "openid profile additional_info.projectedProductContext";',
    'const UNDERPAR_RECOVERY_REQUIRED_SCOPE = "openid profile additional_info.projectedProductContext read_organizations";',
    'const IMS_ORGANIZATION_SCOPE = "openid profile read_organizations";',
    'const IMS_DEFAULT_AUTHORIZATION_ENDPOINT = "https://ims-na1.adobelogin.com/ims/authorize/v2";',
    'const IMS_DEFAULT_LOGOUT_ENDPOINT = "https://ims-na1.adobelogin.com/ims/logout";',
    'const IMS_CONSOLE_ALLOWED_SCOPES = ["openid","profile","offline_access","additional_info.projectedProductContext","AdobeID","read_organizations","additional_info.job_function"];',
    'const IMS_LEGACY_SCOPE_MIGRATION_TOKENS = ["avatar","session","additional_info.account_type","additional_info.roles","additional_info.user_image_url","analytics_services"];',
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    "function uniqueSorted(values = []) { return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean))].sort(); }",
    "function getZipKeyValueByPath(payload = null, pathExpr = '') { if (!payload || typeof payload !== 'object') { return undefined; } const expr = String(pathExpr || '').trim(); if (!expr) { return undefined; } if (Object.prototype.hasOwnProperty.call(payload, expr)) { return payload[expr]; } const parts = expr.split('.').map((part) => part.trim()).filter(Boolean); if (parts.length === 0) { return undefined; } let node = payload; for (const part of parts) { if (!node || typeof node !== 'object' || !Object.prototype.hasOwnProperty.call(node, part)) { return undefined; } node = node[part]; } return node; }",
    "function readZipKeyValue(payload = null, candidates = []) { for (const candidate of Array.isArray(candidates) ? candidates : []) { const value = getZipKeyValueByPath(payload, candidate); if (typeof value === 'string') { const trimmed = value.trim(); if (trimmed) { return trimmed; } continue; } if (typeof value === 'number' && Number.isFinite(value)) { return String(value); } if (typeof value === 'boolean') { return value ? 'true' : 'false'; } } return ''; }",
    "function parseJsonText(text, fallback = null) { if (!text || typeof text !== 'string') { return fallback; } try { return JSON.parse(text); } catch { return fallback; } }",
    "function decodeZipKeyPayloadBase64(value = '') { const compact = String(value || '').replace(/\\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'); if (!compact) { return ''; } const remainder = compact.length % 4; const padded = remainder === 0 ? compact : `${compact}${'='.repeat(4 - remainder)}`; const binary = atob(padded); try { const bytes = Uint8Array.from(binary, (entry) => entry.charCodeAt(0)); return new TextDecoder().decode(bytes); } catch { return binary; } }",
    "function parseKeyValueText(rawText = '') { const payload = {}; String(rawText || '').split(/\\r?\\n/).forEach((line) => { const match = line.match(/^\\s*([^=:\\s]+)\\s*[:=]\\s*(.+)\\s*$/); if (!match) { return; } payload[String(match[1] || '').trim()] = String(match[2] || '').trim(); }); return payload; }",
    "function parseZipKeyPayload(rawText = '') { const raw = String(rawText || '').trim(); if (!raw) { throw new Error('ZIP.KEY payload is empty.'); } const prefix = 'ZIPKEY1:'; let payloadText = raw; if (raw.slice(0, prefix.length).toUpperCase() === prefix) { payloadText = raw.slice(prefix.length).trim(); } if (!payloadText) { throw new Error('ZIP.KEY payload is empty.'); } if (payloadText.startsWith('{')) { try { const parsed = JSON.parse(payloadText); if (parsed && typeof parsed === 'object') { return parsed; } } catch { throw new Error('ZIP.KEY JSON payload could not be parsed.'); } } try { const decoded = decodeZipKeyPayloadBase64(payloadText).trim(); if (decoded.startsWith('{')) { const parsed = JSON.parse(decoded); if (parsed && typeof parsed === 'object') { return parsed; } } } catch { } const fromKeyValue = parseKeyValueText(payloadText); if (Object.keys(fromKeyValue).length > 0) { return fromKeyValue; } throw new Error('Unknown ZIP.KEY format. Use ZIPKEY1 base64 JSON, raw JSON, or KEY=VALUE lines.'); }",
    "function uniquePreserveOrder(values = []) { const seen = new Set(); const output = []; for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (!text || seen.has(text)) { continue; } seen.add(text); output.push(text); } return output; }",
    "function parseJwtPayload() { return {}; }",
    "function extractScopeValuesFromTokenClaims() { return []; }",
    "function readZipKeyRawValue(payload = null, candidates = []) { for (const candidate of Array.isArray(candidates) ? candidates : []) { const value = getZipKeyValueByPath(payload, candidate); if (value === undefined || value === null) { continue; } if (typeof value === 'string' && !value.trim()) { continue; } return value; } return null; }",
    "function normalizeConfiguredOrganizationsSource(value) { if (Array.isArray(value) || (value && typeof value === 'object')) { return value; } const raw = String(value || '').trim(); if (!raw) { return null; } if (raw.startsWith('[') || raw.startsWith('{')) { const parsed = parseJsonText(raw, null); if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) { return parsed; } } return raw.split(/[;\\n]+/).map((entry) => entry.trim()).filter(Boolean).map((entry) => { const separatorMatch = entry.match(/^([^|:=]+)\\s*(?:\\||:|=)\\s*(.+)$/); if (separatorMatch) { return { id: separatorMatch[1], label: separatorMatch[2] }; } return { id: entry, label: entry }; }); }",
    "function collectConfiguredOrganizationEntriesByPrefix(sourcePayload = {}) { if (!sourcePayload || typeof sourcePayload !== 'object') { return []; } const candidatePrefixes = ['services.adobe.ims.organizations.','services.adobe.ims.organization.','services.adobe.ims.orgs.','services.adobe.ims.org.','adobe.ims.organizations.','adobe.ims.organization.','adobe.ims.orgs.','adobe.ims.org.','ims.organizations.','ims.organization.','ims.orgs.','ims.org.','organizations.','organization.','orgs.','org.']; const entries = []; for (const [key, value] of Object.entries(sourcePayload)) { const normalizedKey = String(key || '').trim(); if (!normalizedKey) { continue; } const matchedPrefix = candidatePrefixes.find((prefix) => normalizedKey.startsWith(prefix)); if (!matchedPrefix) { continue; } const organizationId = normalizedKey.slice(matchedPrefix.length).trim(); const organizationLabel = String(value ?? '').trim(); if (!organizationId || !organizationLabel) { continue; } entries.push({ id: organizationId, label: organizationLabel }); } return entries; }",
    "function normalizeConfiguredOrganizationEntry(entry, index = 0) { const payload = typeof entry === 'string' ? { id: entry, label: entry } : entry && typeof entry === 'object' ? entry : null; if (!payload) { return null; } const id = firstNonEmptyString([payload.id,payload.orgId,payload.orgID,payload.org_id,payload.organizationId,payload.organizationID,payload.organization_id,payload.customerOrgId,payload.customer_org_id,payload.value]); const label = firstNonEmptyString([payload.label,payload.name,payload.title,payload.displayName,payload.organizationName,payload.organization_name,id]); if (!id || !label) { return null; } return { key: `target-org:${String(id).trim().toLowerCase() || index}`, id: String(id).trim(), label: String(label).trim() }; }",
    "function normalizeConfiguredOrganizations(value, additionalEntries = []) { const sourceValue = normalizeConfiguredOrganizationsSource(value); if (!sourceValue && (!Array.isArray(additionalEntries) || additionalEntries.length === 0)) { return []; } const rawEntries = [...(Array.isArray(sourceValue) ? sourceValue : sourceValue && typeof sourceValue === 'object' ? Object.entries(sourceValue).map(([id, label]) => ({ id, label })) : []), ...(Array.isArray(additionalEntries) ? additionalEntries : [])]; const organizations = []; const seen = new Set(); rawEntries.forEach((entry, index) => { const normalized = normalizeConfiguredOrganizationEntry(entry, index); if (!normalized || seen.has(normalized.key)) { return; } seen.add(normalized.key); organizations.push(normalized); }); return organizations; }",
    extractFunctionSource(source, "normalizeImsScopeList"),
    extractFunctionSource(source, "normalizeImsScopeToken"),
    extractFunctionSource(source, "tokenizeImsScopeList"),
    extractFunctionSource(source, "resolveGrantedUnderparImsScope"),
    extractFunctionSource(source, "getMissingUnderparImsScopeTokens"),
    extractFunctionSource(source, "sanitizeUnderparImsScopeForCredential"),
    extractFunctionSource(source, "normalizeUnderparVaultImsRuntimeConfigRecord"),
    extractFunctionSource(source, "extractUnderparImsRuntimeConfigFromZipKeyText"),
    extractFunctionSource(source, "buildUnderparImsAuthorizationCodeUrl"),
    extractFunctionSource(source, "buildUnderparImsLogoutUrl"),
    "module.exports = { normalizeImsScopeList, normalizeImsScopeToken, tokenizeImsScopeList, resolveGrantedUnderparImsScope, getMissingUnderparImsScopeTokens, sanitizeUnderparImsScopeForCredential, normalizeUnderparVaultImsRuntimeConfigRecord, extractUnderparImsRuntimeConfigFromZipKeyText, buildUnderparImsAuthorizationCodeUrl, buildUnderparImsLogoutUrl };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    atob: (value) => Buffer.from(String(value || ""), "base64").toString("binary"),
    TextDecoder,
    Uint8Array,
    URLSearchParams,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupClientIdCandidateHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "let tokenClaims = null;",
    "let runtimeConfig = null;",
    "function parseJwtPayload() { return tokenClaims || {}; }",
    "function getActiveUnderparImsRuntimeConfig() { return runtimeConfig; }",
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    "function uniquePreserveOrder(values = []) { const seen = new Set(); const output = []; for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (!text || seen.has(text)) { continue; } seen.add(text); output.push(text); } return output; }",
    extractFunctionSource(source, "getUnderparImsClientIdCandidates"),
    "function setTestContext(nextTokenClaims = null, nextRuntimeConfig = null) { tokenClaims = nextTokenClaims; runtimeConfig = nextRuntimeConfig; }",
    "module.exports = { getUnderparImsClientIdCandidates, setTestContext };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupLogoutClientIdHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "let tokenClaims = null;",
    "let runtimeConfig = null;",
    "function parseJwtPayload() { return tokenClaims || {}; }",
    "function getActiveUnderparImsRuntimeConfig() { return runtimeConfig || {}; }",
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    extractFunctionSource(source, "getUnderparLogoutClientId"),
    "function setTestContext(nextTokenClaims = null, nextRuntimeConfig = null) { tokenClaims = nextTokenClaims; runtimeConfig = nextRuntimeConfig; }",
    "module.exports = { getUnderparLogoutClientId, setTestContext };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupCmActivationHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    extractFunctionSource(source, "shouldAllowTemporaryCmBootstrapTabForActivation"),
    "module.exports = { shouldAllowTemporaryCmBootstrapTabForActivation };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupConsoleConfigUrlHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "let underparStateRef = null;",
    "function uniquePreserveOrder(values = []) { const seen = new Set(); const output = []; for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (!text || seen.has(text)) { continue; } seen.add(text); output.push(text); } return output; }",
    extractFunctionSource(source, "mvpdWorkspaceExtractConfigurationVersion"),
    extractFunctionSource(source, "getKnownAdobeConsoleConfigurationVersion"),
    extractFunctionSource(source, "appendAdobeConsoleConfigurationVersion"),
    extractFunctionSource(source, "buildProgrammerEndpointsForConsoleBase"),
    "function setBootstrapState(nextBootstrapState = null) { underparStateRef = nextBootstrapState && typeof nextBootstrapState === 'object' ? { consoleBootstrapState: nextBootstrapState } : null; }",
    "module.exports = { mvpdWorkspaceExtractConfigurationVersion, getKnownAdobeConsoleConfigurationVersion, appendAdobeConsoleConfigurationVersion, buildProgrammerEndpointsForConsoleBase, setBootstrapState };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupExperienceCloudAuthResponseHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    extractFunctionSource(source, "getRestV2CaseInsensitiveObjectValue"),
    extractFunctionSource(source, "getRestV2CaseInsensitiveHeaderValue"),
    extractFunctionSource(source, "isExperienceCloudAuthResponseUrl"),
    extractFunctionSource(source, "responseLooksLikeExperienceCloudSignIn"),
    "module.exports = { responseLooksLikeExperienceCloudSignIn };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URL,
    Headers,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupRestrictedOrgLabelHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    extractFunctionSource(source, "normalizeOrganizationIdentifier"),
    extractFunctionSource(source, "buildRestrictedOrgOptionLabel"),
    "module.exports = { buildRestrictedOrgOptionLabel };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupBootstrapProgrammersHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    extractFunctionSource(source, "buildProgrammerEntitiesFromConsoleBootstrap"),
    "module.exports = { buildProgrammerEntitiesFromConsoleBootstrap };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupImsAuthLaunchHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "let recordedOptions = [];",
    "const NON_INTERACTIVE_AUTH_TIMEOUT_MS = 45000;",
    "const chrome = { identity: { launchWebAuthFlow: async (options) => { recordedOptions.push(options); return `callback:${String(options?.interactive)}`; } } };",
    extractFunctionSource(source, "launchUnderparImsAuthorizationFlow"),
    "function getRecordedOptions() { return recordedOptions.slice(); }",
    "function resetRecordedOptions() { recordedOptions = []; }",
    "module.exports = { launchUnderparImsAuthorizationFlow, getRecordedOptions, resetRecordedOptions, chrome };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupHeaderAuthClickHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const state = { zipKeyImportPending: false, busy: false, sessionReady: false, loginData: null, restricted: false };",
    "let promptCount = 0;",
    "let signInCount = 0;",
    "let signInArgs = [];",
    "let toggleCount = 0;",
    "function shouldShowZipKeyImportGate() { return false; }",
    "function buildTargetOrganizationContext() { return { requiresSelection: false, selectedOrganization: null }; }",
    "function promptForZipKeyImport() { promptCount += 1; }",
    "function setStatus() {}",
    "function render() {}",
    "async function signInInteractive(options = {}) { signInCount += 1; signInArgs.push(options || {}); }",
    "function toggleAvatarMenu() { toggleCount += 1; }",
    extractFunctionSource(source, "onPrimarySignInClick"),
    extractFunctionSource(source, "onAuthClick"),
    "function setState(nextState = {}) { Object.assign(state, nextState || {}); }",
    "function getCounts() { return { promptCount, signInCount, toggleCount }; }",
    "function getLastSignInOptions() { return signInArgs.length > 0 ? signInArgs[signInArgs.length - 1] : null; }",
    "module.exports = { onPrimarySignInClick, onAuthClick, setState, getCounts, getLastSignInOptions };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupSilentBootstrapGateHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const state = { sessionReady: false, restricted: false, busy: false, restrictedOrgSwitchBusy: false, zipKeyImportPending: false, manualSignOutHold: false };",
    "function hasConfiguredUnderparImsClientId() { return true; }",
    "function buildTargetOrganizationContext() { return { requiresSelection: false }; }",
    extractFunctionSource(source, "shouldAttemptSilentBootstrapSession"),
    "function setState(nextState = {}) { Object.assign(state, nextState || {}); }",
    "module.exports = { shouldAttemptSilentBootstrapSession, setState };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function loadPopupCmPrecheckResetHelper() {
  const filePath = path.join(ROOT, "popup.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    "const state = { cmTenantsPrecheckPromise: 'pending', cmTenantsPrecheckPending: true, cmTenantsPrecheckComplete: true, cmTenantsPrecheckLastError: 'boom', cmTenantsCatalog: { tenants: [1] }, cmTenantsCatalogPromise: Promise.resolve(null), cmTenantsCatalogHydrated: true, cmTenantsCatalogHydrationPromise: Promise.resolve(null), cmTenantsCatalogRuntimeFresh: true, cmTenantsCatalogFetchAttempted: true };",
    "let syncCalls = 0;",
    "function syncMediaCompanySelectAvailability() { syncCalls += 1; }",
    extractFunctionSource(source, "resetCmTenantsPrecheckState"),
    "function getStateSnapshot() { return { ...state }; }",
    "function getSyncCalls() { return syncCalls; }",
    "module.exports = { resetCmTenantsPrecheckState, getStateSnapshot, getSyncCalls };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Promise,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

test("runtime source no longer hard-codes debugger client or legacy redirect host", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const backgroundSource = fs.readFileSync(path.join(ROOT, "background.js"), "utf8");
  const manifestSource = fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8");

  for (const source of [popupSource, backgroundSource, manifestSource]) {
    assert.equal(/adobeExperienceCloudDebugger/i.test(source), false);
    assert.equal(/login\.aepdebugger\.adobe\.com/i.test(source), false);
  }
});

test("legacy helper login surface is no longer shipped", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "src/login/login.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "src/login/login.html")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "src/login/login.css")), false);

  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const backgroundSource = fs.readFileSync(path.join(ROOT, "background.js"), "utf8");
  const manifestSource = fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8");

  for (const source of [popupSource, backgroundSource, manifestSource]) {
    assert.equal(/src\/login\/login\.(html|js|css)/.test(source), false);
    assert.equal(/loginHelperResult/i.test(source), false);
  }
});

test("interactive UnderPAR IMS login uses chrome.identity.launchWebAuthFlow", async () => {
  const helpers = loadPopupImsAuthLaunchHelper();
  helpers.resetRecordedOptions();

  const response = await helpers.launchUnderparImsAuthorizationFlow("https://ims.example/authorize", true);

  assert.equal(response, "callback:true");
  const [request] = helpers.getRecordedOptions();
  assert.equal(request.url, "https://ims.example/authorize");
  assert.equal(request.interactive, true);
  assert.equal(Object.prototype.hasOwnProperty.call(request, "abortOnLoadForNonInteractive"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(request, "timeoutMsForNonInteractive"), false);
});

test("header UP button no longer launches sign-in when logged out", async () => {
  const helpers = loadPopupHeaderAuthClickHelper();

  helpers.setState({
    zipKeyImportPending: false,
    busy: false,
    sessionReady: false,
    loginData: null,
    restricted: false,
  });
  await helpers.onAuthClick();
  assert.equal(JSON.stringify(helpers.getCounts()), JSON.stringify({
    promptCount: 0,
    signInCount: 0,
    toggleCount: 0,
  }));

  await helpers.onPrimarySignInClick();
  assert.equal(JSON.stringify(helpers.getCounts()), JSON.stringify({
    promptCount: 0,
    signInCount: 1,
    toggleCount: 0,
  }));
  assert.equal(
    JSON.stringify(helpers.getLastSignInOptions()),
    JSON.stringify({
      prompt: "login",
      forceBrowserLogout: true,
    })
  );

  helpers.setState({
    sessionReady: true,
    loginData: {
      accessToken: "token",
    },
  });
  await helpers.onAuthClick();
  assert.equal(JSON.stringify(helpers.getCounts()), JSON.stringify({
    promptCount: 0,
    signInCount: 1,
    toggleCount: 1,
  }));
});

test("silent UnderPAR IMS login keeps non-interactive launchWebAuthFlow options", async () => {
  const helpers = loadPopupImsAuthLaunchHelper();
  helpers.resetRecordedOptions();

  const response = await helpers.launchUnderparImsAuthorizationFlow("https://ims.example/authorize", false);

  assert.equal(response, "callback:false");
  const [request] = helpers.getRecordedOptions();
  assert.equal(request.url, "https://ims.example/authorize");
  assert.equal(request.interactive, false);
  assert.equal(request.abortOnLoadForNonInteractive, false);
  assert.equal(request.timeoutMsForNonInteractive, 45000);
});

test("CM auth bootstrap no longer harvests tokens from Experience page context", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.equal(/requestCmConsoleTokenFromExperiencePageContext/.test(popupSource), false);
  assert.equal(/page-cm:/.test(popupSource), false);
});

test("popup IMS runtime config parser recognizes adobe.ims ZIP.KEY paths", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.match(popupSource, /services\.adobe\.ims\.client_id/);
  assert.match(popupSource, /adobe\.ims\.client_id/);
  assert.match(popupSource, /services\.adobe\.ims\.scope/);
  assert.match(popupSource, /adobe\.ims\.scope/);
});

test("ZIP.KEY-only Adobe IMS imports accept direct adobe.ims.client_id entries", () => {
  const helpers = loadPopupImsHelpers();

  const result = helpers.extractUnderparImsRuntimeConfigFromZipKeyText([
    "adobe.ims.client_id=underpar-client-id",
    "adobe.ims.scope=openid profile additional_info.projectedProductContext",
  ].join("\n"));

  assert.equal(result.imsRuntimeConfig.clientId, "underpar-client-id");
  assert.equal(result.imsRuntimeConfig.scope, "openid profile additional_info.projectedProductContext");
  assert.equal(result.imsRuntimeConfig.source, "ZIP.KEY");
});

test("ZIP.KEY Adobe IMS imports preserve configured org picker entries", () => {
  const helpers = loadPopupImsHelpers();

  const result = helpers.extractUnderparImsRuntimeConfigFromZipKeyText(
    JSON.stringify({
      adobe: {
        ims: {
          client_id: "underpar-client-id",
          organizations: [
            {
              id: "@AdobePass",
              label: "@AdobePass",
            },
            {
              id: "alt-org",
              label: "Alternate Org",
            },
          ],
        },
      },
    })
  );

  assert.deepEqual(
    JSON.parse(JSON.stringify(result.imsRuntimeConfig.organizations)),
    [
      {
        key: "target-org:@adobepass",
        id: "@AdobePass",
        label: "@AdobePass",
      },
      {
        key: "target-org:alt-org",
        id: "alt-org",
        label: "Alternate Org",
      },
    ]
  );
});

test("legacy IMS scope bundles clamp to the LoginButton-style PKCE default scope", () => {
  const helpers = loadPopupImsHelpers();

  const result = helpers.sanitizeUnderparImsScopeForCredential(
    "AdobeID,openid,avatar,session,read_organizations,additional_info.job_function,additional_info.projectedProductContext,analytics_services"
  );

  assert.equal(result.scope, "openid profile offline_access additional_info.projectedProductContext read_organizations");
  assert.deepEqual([...result.droppedScopes].sort(), ["analytics_services", "avatar", "session"].sort());
});

test("supported Adobe IMS org scopes survive ZIP.KEY normalization order", () => {
  const helpers = loadPopupImsHelpers();

  const result = helpers.sanitizeUnderparImsScopeForCredential(
    "openid AdobeID read_organizations additional_info.projectedProductContext additional_info.job_function"
  );

  assert.equal(
    result.scope,
    "openid additional_info.projectedProductContext AdobeID read_organizations additional_info.job_function"
  );
  assert.deepEqual([...result.droppedScopes], []);
});

test("primary IMS client-id candidates come from the token and ZIP.KEY runtime config only", () => {
  const helpers = loadPopupClientIdCandidateHelper();

  helpers.setTestContext({ client_id: "token-client" }, { clientId: "vault-client" });
  assert.deepEqual([...helpers.getUnderparImsClientIdCandidates("token-value")], ["token-client", "vault-client"]);

  helpers.setTestContext({}, null);
  assert.deepEqual([...helpers.getUnderparImsClientIdCandidates("")], []);
});

test("logout revocation targets the active UnderPAR client id before falling back to ZIP.KEY runtime config", () => {
  const helpers = loadPopupLogoutClientIdHelper();

  helpers.setTestContext({ client_id: "token-client" }, { clientId: "vault-client" });
  assert.equal(
    helpers.getUnderparLogoutClientId({
      accessToken: "token-value",
      imsSession: {
        clientId: "session-client",
      },
    }),
    "token-client"
  );

  helpers.setTestContext({}, { clientId: "vault-client" });
  assert.equal(
    helpers.getUnderparLogoutClientId({
      accessToken: "",
      imsSession: {},
    }),
    "vault-client"
  );
});

test("activation reuses cached organization payloads from the PKCE login handoff", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const buildSessionSource = extractFunctionSource(popupSource, "buildLoginSessionPayloadFromAuth");
  const enforceAccessSource = extractFunctionSource(popupSource, "enforceAdobePassAccess");

  assert.match(buildSessionSource, /organizations:/);
  assert.match(enforceAccessSource, /resolveCachedOrganizationsFromLoginData\(loginData\)/);
  assert.doesNotMatch(enforceAccessSource, /let organizations = \[\];/);
});

test("activation qualifies the unified-shell console bearer before programmer discovery", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const activateSource = extractFunctionSource(popupSource, "activateSession");
  const consoleTokenPreferenceSource = extractFunctionSource(popupSource, "getPreferredAdobeConsoleAccessTokenCandidate");

  assert.match(consoleTokenPreferenceSource, /getPreferredExperienceCloudConsoleAccessTokenCandidate\(\)/);
  assert.match(consoleTokenPreferenceSource, /getPreferredPrimaryImsAccessTokenCandidate\(\)/);
  assert.match(activateSource, /requestQualifiedExperienceCloudConsoleToken\(\{/);
  assert.match(activateSource, /state\.consoleBootstrapState\?\.shellSnapshot\?\.imsToken/);
  assert.match(activateSource, /qualifiedExperienceCloudTokenResult\?\.accessToken/);
  assert.match(activateSource, /mergeExperienceCloudConsoleTokenIntoLoginData\(enforced\.loginData,\s*qualifiedExperienceCloudTokenResult\)/);
  assert.match(activateSource, /await loadProgrammersData\(consoleAccessToken/);
  assert.match(activateSource, /resetBootstrapTokens: true/);
  assert.match(activateSource, /mergeExperienceCloudConsoleTokenIntoLoginData\(\s*mergeExperienceCloudShellSnapshotIntoLoginData\(/);
});

test("sign out path revokes Adobe tokens before clearing session state", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  assert.match(popupSource, /revokeUnderparLoginTokensForLogout\(state\.loginData\)/);
});

test("interactive Adobe auth popup no longer attaches the debugger or retains the callback window", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const popupTransportSource = extractFunctionSource(popupSource, "runAuthInPopupWindow");
  const signInSource = extractFunctionSource(popupSource, "signInInteractive");

  assert.equal(/chrome\.debugger/.test(popupTransportSource), false);
  assert.equal(/keepWindowOpenForBootstrap/.test(popupTransportSource), false);
  assert.equal(/retainAuthPopupBootstrapContext/.test(popupTransportSource), false);
  assert.equal(/keepAuthWindowOpenForBootstrap/.test(signInSource), false);
});

test("interactive login and org switching allow a temporary shared shell page context when needed", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const signInSource = extractFunctionSource(popupSource, "signInInteractive");
  const refreshSource = extractFunctionSource(popupSource, "refreshSessionManual");
  const restrictedSwitchSource = extractFunctionSource(popupSource, "onRestrictedOrgSwitch");
  const recoverySource = extractFunctionSource(popupSource, "attemptInteractiveAdobePassRecovery");

  assert.match(signInSource, /activateSession\(/);
  assert.match(refreshSource, /activateSession\(/);
  assert.match(restrictedSwitchSource, /activateSession\(/);
  assert.match(recoverySource, /activateSession\(/);
  assert.doesNotMatch(signInSource, /withTemporaryCmConsoleBootstrapContext/);
  assert.doesNotMatch(refreshSource, /withTemporaryCmConsoleBootstrapContext/);
  assert.doesNotMatch(restrictedSwitchSource, /withTemporaryCmConsoleBootstrapContext/);
  assert.doesNotMatch(recoverySource, /withTemporaryCmConsoleBootstrapContext/);
  assert.match(signInSource, /await awaitCmBootstrapForExplicitActivation\("interactive"/);
  assert.match(refreshSource, /await awaitCmBootstrapForExplicitActivation\(/);
  assert.match(restrictedSwitchSource, /await awaitCmBootstrapForExplicitActivation\("restricted-org-switch"/);
  assert.match(signInSource, /allowTemporaryPageContextTab:\s*true/);
  assert.match(refreshSource, /allowTemporaryPageContextTab:\s*true/);
  assert.match(restrictedSwitchSource, /allowTemporaryPageContextTab:\s*true/);
  assert.match(recoverySource, /allowTemporaryPageContextTab:\s*true/);
});

test("session activation defers CM tenant hydration and unlocks Media Company selection immediately", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const activateSource = extractFunctionSource(popupSource, "activateSession");
  const programmersSource = extractFunctionSource(popupSource, "loadProgrammersData");
  const mediaCompanyLockSource = extractFunctionSource(popupSource, "isMediaCompanySelectionLockedByCmPrecheck");
  const mediaCompanyLabelSource = extractFunctionSource(popupSource, "getMediaCompanySelectDefaultLabel");
  const prefetchSource = extractFunctionSource(popupSource, "prefetchCmTenantsCatalogInBackground");

  assert.match(activateSource, /prefetchCmTenantsCatalogInBackground/);
  assert.match(activateSource, /prefetchCmConsoleBootstrapSummaryInBackground/);
  assert.match(activateSource, /allowRestrictedSession:\s*true/);
  assert.doesNotMatch(activateSource, /await ensureCmTenantsPrecheckForActiveSession/);
  assert.match(programmersSource, /const allowRestrictedSession = options\.allowRestrictedSession === true;/);
  assert.match(programmersSource, /\(state\.restricted && !allowRestrictedSession\)/);
  assert.match(mediaCompanyLockSource, /return false;/);
  assert.match(mediaCompanyLabelSource, /-- Choose a Media Company --/);
  assert.match(prefetchSource, /ensureCmTenantsPrecheckForActiveSession/);
});

test("environment restore lets the premium panel path own PassVault hydration", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const applySelectionSource = extractFunctionSource(popupSource, "applyGlobalSelectionSnapshot");

  assert.match(applySelectionSource, /refreshProgrammerPanels\(/);
  assert.doesNotMatch(applySelectionSource, /hydrateProgrammerFromPassVault\(/);
});

test("selected media company refresh primes CM tenant precheck before CM service matching", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const refreshPanelsSource = extractFunctionSource(popupSource, "refreshProgrammerPanels");
  const selectPreferredCmRuntimeServiceSource = extractFunctionSource(popupSource, "selectPreferredCmRuntimeService");

  assert.match(refreshPanelsSource, /ensureCmTenantsPrecheckForActiveSession\(`panel-selection:\$\{programmer\.programmerId\}`/);
  assert.match(refreshPanelsSource, /allowTemporaryPageContextTab:\s*true/);
  assert.match(refreshPanelsSource, /const cmServicePromise = Promise\.resolve\(cmSelectionBootstrapPromise\)/);
  assert.match(refreshPanelsSource, /const cmMvpdServicePromise = Promise\.resolve\(cmSelectionBootstrapPromise\)/);
  assert.match(refreshPanelsSource, /selectPreferredCmRuntimeService\(currentServices\?\.cm,\s*resolvedCmService\)/);
  assert.match(refreshPanelsSource, /selectPreferredCmRuntimeService\(currentServices\?\.cmMvpd,\s*resolvedCmMvpdService\)/);
  assert.match(selectPreferredCmRuntimeServiceSource, /resolvedVisible && !currentVisible/);
  assert.match(selectPreferredCmRuntimeServiceSource, /currentRetry && !resolvedRetry/);
});

test("environment switch reactivation allows temporary CM bootstrap context recovery", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const environmentSwitchSource = extractFunctionSource(popupSource, "switchAdobePassEnvironmentInPlace");

  assert.match(environmentSwitchSource, /activateSession\(retainedLoginData,\s*"environment-switch",\s*\{/);
  assert.match(environmentSwitchSource, /activateSession\(silent,\s*"environment-switch",\s*\{/);
  assert.match(environmentSwitchSource, /allowTemporaryPageContextTab:\s*true/);
});

test("PassVault storage changes re-seed runtime without force-overwriting active service snapshots", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const storageListenerSource = extractFunctionSource(popupSource, "registerPassVaultStorageListener");

  assert.match(storageListenerSource, /seedCurrentProgrammersFromPassVault/);
  assert.match(storageListenerSource, /forceOverwrite: false/);
});

test("active auth and bootstrap flows no longer fall back to cookie-session activation", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const signInSource = extractFunctionSource(popupSource, "signInInteractive");
  const refreshSource = extractFunctionSource(popupSource, "refreshSessionManual");
  const restrictedSwitchSource = extractFunctionSource(popupSource, "onRestrictedOrgSwitch");
  const bootstrapSource = extractFunctionSource(popupSource, "bootstrapSession");

  assert.equal(/tryActivateCookieSession/.test(signInSource), false);
  assert.equal(/tryActivateCookieSession/.test(refreshSource), false);
  assert.equal(/tryActivateCookieSession/.test(restrictedSwitchSource), false);
  assert.equal(/tryActivateCookieSession/.test(bootstrapSource), false);
});

test("legacy cookie-session helper auth paths are no longer shipped", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.doesNotMatch(popupSource, /function tryActivateCookieSession/);
  assert.doesNotMatch(popupSource, /function hydrateCookieSessionWithProfile/);
  assert.doesNotMatch(popupSource, /createCookieSessionLoginData/);
  assert.doesNotMatch(popupSource, /allowCookieProfile/);
  assert.doesNotMatch(popupSource, /function createSessionSeedLoginData/);
  assert.match(popupSource, /function createCmBootstrapSeedLoginData/);
});

test("IMS profile hydration uses token-backed profile and userinfo only", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const fetchProfileSource = extractFunctionSource(popupSource, "fetchImsSessionProfile");

  assert.equal(/ims\/check\/v6\/status/.test(fetchProfileSource), false);
  assert.equal(/ims\/check\/v5\/status/.test(fetchProfileSource), false);
  assert.equal(/ims\/check\/status/.test(fetchProfileSource), false);
  assert.match(fetchProfileSource, /ims\/userinfo\/v2/);
  assert.match(fetchProfileSource, /return null;/);
});

test("session monitor is token-driven and no longer probes cookie or page session state", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const shouldRunSource = extractFunctionSource(popupSource, "shouldRunExperienceCloudSessionMonitor");
  const tickSource = extractFunctionSource(popupSource, "runExperienceCloudSessionMonitorTick");

  assert.match(shouldRunSource, /state\.sessionReady && state\.loginData\?\.accessToken && !state\.restricted/);
  assert.equal(/probeExperienceCloudSessionState/.test(tickSource), false);
  assert.equal(/attemptSessionAutoBootstrap/.test(tickSource), false);
  assert.doesNotMatch(popupSource, /function attemptSessionAutoBootstrap/);
});

test("console configuration version is sourced dynamically from console bootstrap state", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const loadProgrammersSource = extractFunctionSource(popupSource, "loadProgrammersData");
  const fetchProgrammersSource = extractFunctionSource(popupSource, "fetchProgrammersFromApi");
  const fetchBootstrapSource = extractFunctionSource(popupSource, "fetchAdobeConsoleBootstrapState");
  const configVersionSource = extractFunctionSource(popupSource, "getKnownAdobeConsoleConfigurationVersion");
  const configExtractorSource = extractFunctionSource(popupSource, "mvpdWorkspaceExtractConfigurationVersion");
  const consoleHeaderSource = extractFunctionSource(popupSource, "getAdobeConsoleRequestHeaders");
  const bootstrapEnsureSource = extractFunctionSource(popupSource, "ensureConsoleBootstrapState");
  const fetchConsoleSource = extractFunctionSource(popupSource, "fetchAdobeConsoleJsonWithAuthVariants");

  assert.equal(/configurationVersion=3522/.test(popupSource), false);
  assert.match(popupSource, /function appendAdobeConsoleConfigurationVersion/);
  assert.match(popupSource, /consoleBootstrapState/);
  assert.match(popupSource, /let underparStateRef = null;/);
  assert.match(popupSource, /underparStateRef = state;/);
  assert.doesNotMatch(configVersionSource, /typeof state/);
  assert.match(configExtractorSource, /payload\.configurationVersion/);
  assert.match(configExtractorSource, /payload\.configurationInfo/);
  assert.doesNotMatch(configExtractorSource, /for \(const nestedValue of Object\.values\(payload\)\)/);
  assert.match(consoleHeaderSource, /const csrfToken = String\(state\?\.consoleCsrfToken \|\| ""\)\.trim\(\) \|\| "NO-TOKEN";/);
  assert.match(consoleHeaderSource, /Origin: ADOBE_CONSOLE_RUNTIME_ORIGIN/);
  assert.match(consoleHeaderSource, /Referer: ADOBE_CONSOLE_RUNTIME_REFERER/);
  assert.match(consoleHeaderSource, /"AP-Request-Id": generateRequestId\(\)/);
  assert.match(bootstrapEnsureSource, /getPreferredAdobeConsoleAccessTokenCandidate\(\)/);
  assert.match(loadProgrammersSource, /bootstrapState = await ensureConsoleBootstrapState/);
  assert.match(loadProgrammersSource, /allowInteractiveAuthBootstrap: options\.allowInteractiveAuthBootstrap === true/);
  assert.match(fetchBootstrapSource, /const fetchViaShellPageContext = async \(endpoint\) =>/);
  assert.match(fetchBootstrapSource, /await Promise\.all\(\[/);
  assert.match(fetchBootstrapSource, /fetchAdobeConsoleJsonViaShellPageContext/);
  assert.match(fetchBootstrapSource, /preferShellAccessToken:\s*true/);
  assert.match(loadProgrammersSource, /const configurationVersion = mvpdWorkspaceExtractConfigurationVersion\(bootstrapState, 0\)/);
  assert.doesNotMatch(loadProgrammersSource, /configurationVersion <= 0/);
  assert.match(loadProgrammersSource, /!bootstrapState \|\| !bootstrapState\.extendedProfile/);
  assert.match(loadProgrammersSource, /grantedAuthorities\.length > 0 && !hasAdobeConsoleProgrammerAccess\(grantedAuthorities\)/);
  assert.match(fetchConsoleSource, /variants\.push\(getAdobeConsoleRequestHeaders\(""\)\)/);
  assert.match(fetchProgrammersSource, /state\.loginData\?\.experienceCloudAccessToken/);
  assert.match(fetchProgrammersSource, /getPreferredExperienceCloudConsoleAccessTokenCandidate\(\)/);
  assert.match(fetchProgrammersSource, /const pageContextResult = await fetchAdobeConsoleJsonViaShellPageContext/);
  assert.match(fetchProgrammersSource, /const buildHeaderVariants = \(\) =>/);
  assert.match(fetchProgrammersSource, /getAdobeConsoleRequestHeaders\(""\)/);
  assert.match(fetchProgrammersSource, /fetchAdobeConsoleJsonViaShellPageContext/);
  assert.match(fetchProgrammersSource, /preferShellAccessToken:\s*true/);
  assert.match(fetchBootstrapSource, /shellPageExtendedProfile/);
  assert.match(fetchBootstrapSource, /shellSnapshot\?\.imsToken/);
  assert.match(fetchBootstrapSource, /mergeExperienceCloudShellSnapshotIntoLoginData\(state\.loginData,\s*shellSnapshot\)/);
  assert.match(loadProgrammersSource, /const resolvedConsoleAccessToken = normalizeBearerTokenValue\(/);
  assert.match(loadProgrammersSource, /firstNonEmptyString\(\[bootstrapState\?\.accessToken,\s*normalizedAccessToken\]\)/);
});

test("programmer endpoint access_denied responses stay on the auth-denied recovery path", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const helperSource = extractFunctionSource(popupSource, "isAdobeConsoleAccessDeniedResponse");
  const fetchProgrammersSource = extractFunctionSource(popupSource, "fetchProgrammersFromApi");

  assert.match(helperSource, /normalizedStatus !== 401 && normalizedStatus !== 403/);
  assert.match(helperSource, /normalizedError === "access_denied" \|\| normalizedError === "unauthorized"/);
  assert.match(helperSource, /normalizedMessage\.includes\("access is denied"\)/);
  assert.match(fetchProgrammersSource, /const accessDeniedResponse = isAdobeConsoleAccessDeniedResponse/);
  assert.match(fetchProgrammersSource, /accessDeniedResponse \? "PROGRAMMERS_ACCESS_DENIED" : "PROGRAMMERS_ENDPOINT_FAILED"/);
});

test("programmer access denial can fall back to vaulted media companies", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const vaultBuilderSource = extractFunctionSource(popupSource, "buildProgrammerEntitiesFromPassVault");
  const loadProgrammersSource = extractFunctionSource(popupSource, "loadProgrammersData");
  const bootstrapFallbackIndex = loadProgrammersSource.indexOf("buildProgrammerEntitiesFromConsoleBootstrap");
  const vaultFallbackIndex = loadProgrammersSource.indexOf("buildProgrammerEntitiesFromPassVault");

  assert.match(vaultBuilderSource, /normalizeUnderparPassVaultProgrammerRecord/);
  assert.match(vaultBuilderSource, /buildPassVaultApplicationsSnapshotFromRegisteredApplications/);
  assert.match(vaultBuilderSource, /contentProviders: requestorIds/);
  assert.ok(bootstrapFallbackIndex !== -1);
  assert.ok(vaultFallbackIndex !== -1);
  assert.ok(bootstrapFallbackIndex < vaultFallbackIndex, "bootstrap fallback should run before vault fallback");
  assert.match(loadProgrammersSource, /buildProgrammerEntitiesFromPassVault\(vault, getActiveAdobePassEnvironmentKey\(\)\)/);
  assert.match(loadProgrammersSource, /phase: "vault-fallback"/);
  assert.match(loadProgrammersSource, /Using vaulted media companies/);
});

test("console bootstrap accessible root entities can seed media companies when Programmer listing is denied", () => {
  const { buildProgrammerEntitiesFromConsoleBootstrap } = loadPopupBootstrapProgrammersHelper();

  assert.equal(
    JSON.stringify(
      buildProgrammerEntitiesFromConsoleBootstrap({
        extendedProfile: {
          accessibleRootEntities: {
            "com.adobe.pass.model.olca.actor.Programmer": {
              "Programmer:Adobe": "WRITE",
              "Programmer:*": "READ",
            },
            "com.adobe.pass.model.olca.actor.Mvpd": {
              "Mvpd:*": "READ",
            },
          },
        },
      })
    ),
    JSON.stringify([
      {
        key: "Programmer:Adobe",
        entityData: {
          id: "Adobe",
          displayName: "Adobe",
          mediaCompanyName: "Adobe",
          contentProviders: [],
          applications: [],
          permissions: ["WRITE"],
        },
      },
    ])
  );
});

test("programmer discovery stays on deterministic entity endpoints and console role extraction handles authority objects", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const endpointBuilderSource = extractFunctionSource(popupSource, "buildProgrammerEndpointsForConsoleBase");
  const roleExtractorSource = extractFunctionSource(popupSource, "extractAdobeConsoleGrantedAuthorities");
  const roleValueSource = extractFunctionSource(popupSource, "extractAdobeConsoleGrantedAuthorityValue");

  assert.match(endpointBuilderSource, /rest\/api\/entity\/Programmer/);
  assert.doesNotMatch(endpointBuilderSource, /rest\/api\/programmers/);
  assert.doesNotMatch(endpointBuilderSource, /rest\/api\/v1\/programmers/);
  assert.match(roleValueSource, /entry\.authority/);
  assert.match(roleValueSource, /entry\.role/);
  assert.match(roleExtractorSource, /extractAdobeConsoleGrantedAuthorityValue\(entry\)/);
});

test("programmer discovery keeps configurationVersion=0 on Adobe console entity requests", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const appendConfigVersionSource = extractFunctionSource(popupSource, "appendAdobeConsoleConfigurationVersion");
  const {
    mvpdWorkspaceExtractConfigurationVersion,
    getKnownAdobeConsoleConfigurationVersion,
    appendAdobeConsoleConfigurationVersion,
    buildProgrammerEndpointsForConsoleBase,
    setBootstrapState,
  } = loadPopupConsoleConfigUrlHelper();

  assert.doesNotMatch(appendConfigVersionSource, /normalizedVersion <= 0/);
  assert.equal(
    mvpdWorkspaceExtractConfigurationVersion({
      configurationVersion: 0,
      fetchedAt: 1773987269048,
      extendedProfile: { userId: "123" },
    }, 0),
    0
  );
  setBootstrapState({
    configurationVersion: 0,
    fetchedAt: 1773987269048,
    extendedProfile: { userId: "123" },
  });
  assert.equal(getKnownAdobeConsoleConfigurationVersion(), 0);
  assert.equal(
    appendAdobeConsoleConfigurationVersion("https://console.auth.adobe.com/rest/api/entity/Programmer", 0),
    "https://console.auth.adobe.com/rest/api/entity/Programmer?configurationVersion=0"
  );
  assert.deepEqual([...buildProgrammerEndpointsForConsoleBase("https://console.auth.adobe.com")], [
    "https://console.auth.adobe.com/rest/api/entity/Programmer?configurationVersion=0",
  ]);
});

test("programmer discovery keeps fetch header variants as plain header objects", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const fetchProgrammersSource = extractFunctionSource(popupSource, "fetchProgrammersFromApi");

  assert.match(fetchProgrammersSource, /if \(accessToken\) \{\s*variants\.push\(\{ headers: getAdobeConsoleRequestHeaders\(accessToken\) \}\);/);
  assert.match(fetchProgrammersSource, /variants\.push\(\{ headers: getAdobeConsoleRequestHeaders\(""\) \}\);/);
  assert.doesNotMatch(fetchProgrammersSource, /uniquePreserveOrder\(\s*\[\s*accessToken \? getAdobeConsoleRequestHeaders/);
});

test("experience cloud auth redirect detection accepts plain-object headers from shell page context", () => {
  const { responseLooksLikeExperienceCloudSignIn } = loadPopupExperienceCloudAuthResponseHelper();

  assert.equal(
    responseLooksLikeExperienceCloudSignIn(
      {
        status: 403,
        url: "https://console.auth.adobe.com/rest/api/entity/Programmer?configurationVersion=0",
        headers: {
          "content-type": "application/json",
          "www-authenticate": 'Bearer realm="AdobeID login_required"',
        },
      },
      '{"error":"access_denied","error_description":"Access is denied"}'
    ),
    true
  );
});

test("shell page context harvests the unified shell IMS session before console entity fetches", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const bootstrapUrlSource = extractFunctionSource(popupSource, "getAdobeConsolePageContextBootstrapUrl");
  const resolveTargetSource = extractFunctionSource(popupSource, "resolveAdobeConsolePageContextTarget");
  const withTargetSource = extractFunctionSource(popupSource, "withAdobeConsolePageContextTarget");
  const shellFetchSource = extractFunctionSource(popupSource, "fetchAdobeConsoleJsonViaShellPageContext");
  const shellMergeSource = extractFunctionSource(popupSource, "mergeExperienceCloudShellSnapshotIntoLoginData");
  const activationSource = extractFunctionSource(popupSource, "activateSession");
  const loadProgrammersSource = extractFunctionSource(popupSource, "loadProgrammersData");
  const tempTargetSource = extractFunctionSource(popupSource, "openTemporaryAdobePageContextTarget");

  assert.match(bootstrapUrlSource, /const isProgrammersRequest =/);
  assert.match(bootstrapUrlSource, /const isApplicationsRequest =/);
  assert.match(bootstrapUrlSource, /isProgrammersRequest \|\| isApplicationsRequest \? getActiveAdobePassEnvironment\(\)\?\.consoleProgrammersUrl/);
  assert.match(resolveTargetSource, /resolveReusableAdobePageContextTab/);
  assert.match(resolveTargetSource, /findExistingExperienceCloudAdobeTab/);
  assert.match(resolveTargetSource, /openTemporaryAdobePageContextTarget\(\s*getAdobeConsolePageContextBootstrapUrl\(requestUrl\)/);
  assert.match(withTargetSource, /resolveAdobeConsolePageContextTarget\(requestUrl,\s*\{/);
  assert.match(withTargetSource, /closeTemporaryAdobePageContextTarget\(target\.temporaryTarget\)/);
  assert.match(shellFetchSource, /const target = await resolveAdobeConsolePageContextTarget\(normalizedUrl,\s*\{/);
  assert.match(shellFetchSource, /const isExplicitShellRoot = \/window\\\.\(\?:__shellConfiguration\|shellConfiguration\|__excShellConfiguration\|__adobeShellConfiguration\)\$\/i/);
  assert.match(shellFetchSource, /if \(preferShellAccessToken && variants\.length > 0\) \{\s*return variants;/);
  assert.match(shellFetchSource, /target: \{ tabId, allFrames: true \ }|target: \{ tabId, allFrames: true \}/);
  assert.match(
    shellFetchSource,
    /\.\.\.\(headers && typeof headers === "object" \? headers : \{\}\),\s*Authorization: `Bearer \$\{shellSnapshot\.imsToken\}`/
  );
  assert.match(shellFetchSource, /const shellSnapshot = await waitForShellSnapshot\(\);/);
  assert.match(shellFetchSource, /const isAdobePassConsoleFrame =\s*\/cdn\\\.experience\\\.adobe\\\.net\\\/solutions\\\/AdobePass-adobepass-unifiedshell-console-client\\\//);
  assert.match(shellFetchSource, /const normalizeExecutionResults = \(executionResults = \[\]\) =>/);
  assert.match(shellFetchSource, /const preferredFrameWaitDeadline = Date\.now\(\) \+ Math\.max\(1200, Math\.min\(timeoutMs, 6000\)\)/);
  assert.match(shellFetchSource, /const preferredFrameResults = normalizedResults\.filter\(\(entry\) => entry\.isAdobePassConsoleFrame\)/);
  assert.match(shellFetchSource, /await new Promise\(\(resolve\) => setTimeout\(resolve, 180\)\)/);
  assert.match(shellFetchSource, /window\.__shellConfiguration/);
  assert.match(shellFetchSource, /window\.shellConfiguration/);
  assert.match(shellFetchSource, /const isReadyShellSnapshot = \(snapshot = null\) =>/);
  assert.match(shellFetchSource, /frameUrl,/);
  assert.match(shellFetchSource, /isAdobePassConsoleFrame,/);
  assert.match(shellFetchSource, /shell: normalizedShellSnapshot/);
  assert.match(shellMergeSource, /tokenSupportsExperienceCloudConsole\(normalizedShellSnapshot\.imsToken\)/);
  assert.match(shellMergeSource, /organizations: mergedOrganizations/);
  assert.match(activationSource, /mergeExperienceCloudShellSnapshotIntoLoginData\(/);
  assert.match(activationSource, /state\.consoleBootstrapState\?\.shellSnapshot/);
  assert.match(loadProgrammersSource, /return withAdobeConsolePageContextTarget\(/);
  assert.match(loadProgrammersSource, /allowTemporaryPageContextTab:\s*pageContextOptions\?\.allowTemporaryPageContextTab === true/);
  assert.match(tempTargetSource, /chrome\.tabs\?\.create/);
  assert.match(tempTargetSource, /active:\s*false/);
  assert.match(tempTargetSource, /chrome\.windows\?\.create/);
  assert.match(tempTargetSource, /type:\s*"popup"/);
  assert.doesNotMatch(tempTargetSource, /state:\s*"normal"/);
});

test("media company selection reuses AdobePass shell page context for application hydration", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const withTargetSource = extractFunctionSource(popupSource, "withAdobeConsolePageContextTarget");
  const pageContextVariantsSource = extractFunctionSource(popupSource, "fetchAdobeConsoleJsonWithShellPageContextVariants");
  const fetchApplicationsSource = extractFunctionSource(popupSource, "fetchApplicationsForProgrammer");
  const fetchApplicationDetailsSource = extractFunctionSource(popupSource, "fetchApplicationDetailsByGuid");
  const fetchApplicationRawSource = extractFunctionSource(popupSource, "fetchApplicationRawByGuid");
  const ensurePremiumAppsSource = extractFunctionSource(popupSource, "ensurePremiumAppsForProgrammer");
  const hydrateScopesSource = extractFunctionSource(popupSource, "hydrateApplicationScopesForProgrammer");
  const refreshPanelsSource = extractFunctionSource(popupSource, "refreshProgrammerPanels");

  assert.match(withTargetSource, /allowTemporaryPageContextTab:\s*resolvedTabId > 0 \? false : allowTemporaryTab/);
  assert.match(pageContextVariantsSource, /fetchAdobeConsoleJsonViaShellPageContext/);
  assert.match(pageContextVariantsSource, /allowTemporaryPageContextTab === true/);
  assert.match(fetchApplicationsSource, /fetchAdobeConsoleJsonWithShellPageContextVariants\(\[lookupUrl\], "Applications load"/);
  assert.match(fetchApplicationDetailsSource, /fetchAdobeConsoleJsonWithShellPageContextVariants\(urlCandidates, "Application detail"/);
  assert.match(fetchApplicationRawSource, /fetchAdobeConsoleJsonWithShellPageContextVariants\(urlCandidates, "Application raw fetch"/);
  assert.match(ensurePremiumAppsSource, /const allowTemporaryPageContextTab = options\.allowTemporaryPageContextTab === true;/);
  assert.match(ensurePremiumAppsSource, /const preferredTabId = Number\(options\.preferredTabId \|\| getRetainedAuthPopupBootstrapTabId\(\) \|\| 0\);/);
  assert.match(hydrateScopesSource, /const allowTemporaryPageContextTab = options\.allowTemporaryPageContextTab === true;/);
  assert.match(refreshPanelsSource, /withAdobeConsolePageContextTarget\(/);
  assert.match(refreshPanelsSource, /\/rest\/api\/applications\?programmer=/);
  assert.match(refreshPanelsSource, /allowTemporaryTab:\s*true/);
  assert.match(refreshPanelsSource, /ensurePremiumAppsForProgrammer\(programmer,\s*\{/);
  assert.match(refreshPanelsSource, /allowTemporaryPageContextTab:\s*pageContextOptions\?\.allowTemporaryPageContextTab === true/);
  assert.match(
    refreshPanelsSource,
    /preferredTabId:\s*Number\(pageContextOptions\?\.preferredTabId \|\| 0\) \|\| getRetainedAuthPopupBootstrapTabId\(\) \|\| 0/
  );
});

test("restricted org labels collapse duplicate AdobePass segments", () => {
  const { buildRestrictedOrgOptionLabel } = loadPopupRestrictedOrgLabelHelper();

  assert.equal(
    buildRestrictedOrgOptionLabel({
      name: "@AdobePass | @adobepass | @adobepass",
      orgId: "@adobepass",
      userId: "",
    }),
    "@AdobePass"
  );
});

test("console endpoint bootstrap initializes underparStateRef before top-level programmer endpoint construction", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const stateRefIndex = popupSource.indexOf("let underparStateRef = null;");
  const endpointIndex = popupSource.indexOf("let PROGRAMMER_ENDPOINTS = buildProgrammerEndpointsForConsoleBase(ADOBE_CONSOLE_BASE);");

  assert.notEqual(stateRefIndex, -1);
  assert.notEqual(endpointIndex, -1);
  assert.ok(stateRefIndex < endpointIndex, "underparStateRef must initialize before PROGRAMMER_ENDPOINTS");
});

test("DEBUG INFO and logged-out controls bind before async init and keep a safe fallback snapshot", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const initSource = extractFunctionSource(popupSource, "init");
  const renderDebugSource = extractFunctionSource(popupSource, "renderDebugConsole");
  const copyDebugSource = extractFunctionSource(popupSource, "copyDebugConsoleToClipboard");
  const statusSource = extractFunctionSource(popupSource, "setStatus");

  assert.match(popupSource, /let underparCoreInteractionHandlersBound = false;/);
  assert.match(popupSource, /function registerCoreInteractionHandlers\(\)/);
  assert.match(popupSource, /registerCoreInteractionHandlers\(\);\s*\n\s*function log\(/);
  assert.match(popupSource, /function composeUnderparDebugConsoleFallback\(/);
  assert.match(popupSource, /function getUnderparDebugConsoleSnapshot\(/);
  assert.match(popupSource, /debugStatusHistory:\s*\[\]/);
  assert.match(popupSource, /debugMarkers:\s*\{\}/);
  assert.match(popupSource, /function appendDebugStatusHistoryEntry\(/);
  assert.match(popupSource, /function setUnderparDiagnosticMarker\(/);
  assert.match(renderDebugSource, /setTextOutput\(els\.logOutput,\s*getUnderparDebugConsoleSnapshot\(\)\);/);
  assert.match(copyDebugSource, /els\.logOutput\?\.value \|\| getUnderparDebugConsoleSnapshot\(\)/);
  assert.match(statusSource, /appendDebugStatusHistoryEntry\(normalizedMessage,\s*normalizedType,\s*"status"\)/);
  assert.match(initSource, /registerCoreInteractionHandlers\(\);/);
  assert.match(initSource, /registerEventHandlers\(\);/);
  assert.match(initSource, /await settleUnderparInitStep\("Initial shell render", \(\) => render\(\)\);/);
  assert.match(initSource, /await settleUnderparInitStep\("Pass VAULT load", \(\) => ensurePassVaultLoaded\(\{ forceReload: false \}\)\);/);
});

test("post-ZIP.KEY logged-out flow silently probes for an existing Adobe session like LoginButton", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const initSource = extractFunctionSource(popupSource, "init");
  const registerHandlersSource = extractFunctionSource(popupSource, "registerEventHandlers");
  const importZipKeySource = extractFunctionSource(popupSource, "importZipKeyIntoVaultFromText");
  const finalizeZipKeySource = extractFunctionSource(popupSource, "finalizeSuccessfulZipKeyImport");
  const bootstrapSource = extractFunctionSource(popupSource, "bootstrapSession");

  assert.match(popupSource, /const SILENT_BOOTSTRAP_RETRY_INTERVAL_MS = 15 \* 1000;/);
  assert.match(popupSource, /function shouldAttemptSilentBootstrapSession\(\)/);
  assert.match(initSource, /await settleUnderparInitStep\("Session bootstrap", \(\) => bootstrapSession\("startup"\)\);/);
  assert.match(registerHandlersSource, /void bootstrapSession\("panel-visible"\);/);
  assert.match(registerHandlersSource, /void bootstrapSession\("window-focus"\);/);
  assert.match(importZipKeySource, /return await finalizeSuccessfulZipKeyImport\(result\);/);
  assert.match(finalizeZipKeySource, /state\.manualZipKeyImportGate = false;/);
  assert.match(finalizeZipKeySource, /await bootstrapSession\("zip-key-import"\);/);
  assert.match(bootstrapSource, /const silent = await attemptSilentBootstrapLogin\(\);/);
  assert.match(bootstrapSource, /silent-bootstrap:/);
});

test("manual sign-out suppresses silent bootstrap until the user explicitly signs in again", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const helpers = loadPopupSilentBootstrapGateHelper();
  const applySessionSource = extractFunctionSource(popupSource, "applyActiveLoginSession");
  const finalizeZipKeySource = extractFunctionSource(popupSource, "finalizeSuccessfulZipKeyImport");
  const signOutSource = extractFunctionSource(popupSource, "signOutAndResetSession");

  helpers.setState({
    sessionReady: false,
    restricted: false,
    zipKeyImportPending: false,
    manualSignOutHold: false,
  });
  assert.equal(helpers.shouldAttemptSilentBootstrapSession(), true);

  helpers.setState({
    manualSignOutHold: true,
  });
  assert.equal(helpers.shouldAttemptSilentBootstrapSession(), false);
  helpers.setState({
    manualSignOutHold: false,
    busy: true,
  });
  assert.equal(helpers.shouldAttemptSilentBootstrapSession(), false);
  helpers.setState({
    busy: false,
    restrictedOrgSwitchBusy: true,
  });
  assert.equal(helpers.shouldAttemptSilentBootstrapSession(), false);
  assert.match(signOutSource, /persistManualSignOutHold\(true,\s*"manual-sign-out"\)/);
  assert.match(applySessionSource, /persistManualSignOutHold\(false,\s*"session-activated"\)/);
  assert.match(finalizeZipKeySource, /if \(!state\.manualSignOutHold\) \{\s*await bootstrapSession\("zip-key-import"\);/);
});

test("silent bootstrap preserves restricted recovery instead of resetting back to logged-out sign-in", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const bootstrapSource = extractFunctionSource(popupSource, "bootstrapSession");

  assert.match(bootstrapSource, /if \(state\.restricted\) \{\s*setUnderparDiagnosticMarker\("bootstrap", \{\s*status: "restricted",[\s\S]*phase: "silent-session-denied",/);
  assert.match(bootstrapSource, /if \(state\.restricted\) \{\s*setUnderparDiagnosticMarker\("bootstrap", \{\s*status: "restricted",[\s\S]*phase: "complete",/);
  assert.ok(
    bootstrapSource.indexOf('phase: "silent-session-denied"') <
      bootstrapSource.indexOf("resetWorkflowForLoggedOut();")
  );
});

test("interactive recovery paths force Adobe IMS to show the login chooser without hard-gating activation on helper scopes", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const signInSource = extractFunctionSource(popupSource, "signInInteractive");
  const switchSource = extractFunctionSource(popupSource, "onRestrictedOrgSwitch");
  const retrySource = extractFunctionSource(popupSource, "runUnderparPkceLogin");
  const autoSwitchSource = extractFunctionSource(popupSource, "attemptAutoSwitchToAdobePass");
  const signInAgainSource = extractFunctionSource(popupSource, "onRestrictedSignInAgain");
  const logoutSource = extractFunctionSource(popupSource, "runUnderparImsBrowserLogout");
  const organizationsSource = extractFunctionSource(popupSource, "fetchOrganizations");
  const activationSource = extractFunctionSource(popupSource, "activateSession");

  assert.match(popupSource, /const IMS_SCOPE = "openid profile offline_access additional_info\.projectedProductContext read_organizations";/);
  assert.match(popupSource, /const IMS_ORGANIZATION_SCOPE = "openid profile read_organizations";/);
  assert.match(popupSource, /const IMS_DEFAULT_LOGOUT_ENDPOINT = `\$\{IMS_ISSUER_URL\}\/ims\/logout`;/);
  assert.match(signInSource, /prompt: normalizeUnderparImsPrompt\(loginOptions\?\.prompt \|\| "login", true\)/);
  assert.match(signInSource, /if \(loginOptions\?\.forceBrowserLogout === true\)/);
  assert.match(signInSource, /await runUnderparImsBrowserLogout\(/);
  assert.doesNotMatch(signInSource, /minimumGrantedScope/);
  assert.doesNotMatch(signInSource, /requiredActivationScope/);
  assert.match(switchSource, /prompt: "login"/);
  assert.doesNotMatch(switchSource, /minimumGrantedScope/);
  assert.doesNotMatch(switchSource, /requiredActivationScope/);
  assert.match(autoSwitchSource, /const prompt = normalizeUnderparImsPrompt\(options\?\.prompt \|\| \(interactive \? "login" : ""\), interactive\);/);
  assert.doesNotMatch(autoSwitchSource, /minimumGrantedScope/);
  assert.match(signInAgainSource, /await signInInteractive\(\{[\s\S]*prompt: "login",[\s\S]*forceBrowserLogout: true,[\s\S]*\}\);/);
  assert.match(retrySource, /scope: IMS_ORGANIZATION_SCOPE,\s*reason: "org-scope-fallback"/);
  assert.doesNotMatch(retrySource, /minimumGrantedScope/);
  assert.doesNotMatch(retrySource, /INSUFFICIENT_IMS_SCOPE/);
  assert.match(logoutSource, /buildUnderparImsLogoutUrl\(/);
  assert.match(logoutSource, /await launchUnderparImsAuthorizationFlow\(logoutUrl, interactive\);/);
  assert.match(organizationsSource, /const grantedScope = resolveGrantedUnderparImsScope\(normalizedAccessToken, "", ""\);/);
  assert.match(organizationsSource, /getMissingUnderparImsScopeTokens\(grantedScope, "read_organizations"\)/);
  assert.match(organizationsSource, /token does not have the "read_organizations" scope/);
  assert.match(organizationsSource, /const clientIdCandidates = getUnderparImsClientIdCandidates\(normalizedAccessToken\);/);
  assert.match(organizationsSource, /credentials: "include"/);
  assert.match(organizationsSource, /headers: buildImsProfileHeaders\(normalizedAccessToken, endpoint\.clientId\)/);
  assert.match(organizationsSource, /const payloadScore = flattenOrganizations\(parsed\)\.length;/);
  assert.doesNotMatch(activationSource, /requiredActivationScope/);
  assert.doesNotMatch(activationSource, /insufficient-ims-scope/);
});

test("vault purge path forces a durable start-shell reset and clears in-memory vault state", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const purgeSource = extractFunctionSource(popupSource, "purgePassVaultFromDevtools");
  const resetWorkflowSource = extractFunctionSource(popupSource, "resetWorkflowForLoggedOut");

  assert.match(purgeSource, /persistManualSignOutHold\(true,\s*"vault-purge"\)/);
  assert.match(purgeSource, /clearDebugFlowStorageFromChromeStorage\(\)/);
  assert.match(purgeSource, /purgeAvatarCaches\(\)/);
  assert.match(purgeSource, /cancelPendingBootstrapSession\(\)/);
  assert.match(
    purgeSource,
    /resetToSignedOutState\(\{\s*closeWorkspaceReason:\s*"up-devtools-vault-purge",[\s\S]*statusMessage:\s*message,[\s\S]*statusType:\s*"success",?[\s\S]*\}\)/
  );
  assert.match(purgeSource, /preservePassVault:\s*false,/);
  assert.match(resetWorkflowSource, /const preservePassVault = options\?\.preservePassVault !== false;/);
  assert.match(resetWorkflowSource, /: createEmptyUnderparVaultPayload\(\);/);
  assert.match(resetWorkflowSource, /state\.passVaultLoadPromise = null;/);
  assert.match(resetWorkflowSource, /state\.passVaultPersistPromise = null;/);
  assert.match(resetWorkflowSource, /state\.passVaultPendingStorageWriteMarkers\.clear\(\);/);
  assert.match(resetWorkflowSource, /state\.passVaultCompilePromiseByProgrammerKey\.clear\(\);/);
});

test("active CM bootstrap uses UnderPAR bearer-derived qualification instead of exc_app seeding", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const requestQualifiedSource = extractFunctionSource(popupSource, "requestQualifiedCmConsoleToken");
  const hydrateCmSource = extractFunctionSource(popupSource, "hydrateGlobalCmConsoleBootstrapForActiveSession");
  const ensureCmSource = extractFunctionSource(popupSource, "ensureCmApiAccessToken");

  assert.equal(/requestExperienceCloudConsoleToken/.test(requestQualifiedSource), false);
  assert.equal(/persistExperienceCloudConsoleTokenResult/.test(requestQualifiedSource), false);
  assert.equal(/getPreferredExperienceCloudConsoleAccessTokenCandidate/.test(requestQualifiedSource), false);
  assert.equal(/requestExperienceCloudConsoleToken/.test(hydrateCmSource), false);
  assert.equal(/persistExperienceCloudConsoleTokenResult/.test(hydrateCmSource), false);
  assert.equal(/tryRefreshCmTokenFromIms\(\"\"/.test(hydrateCmSource), false);
  assert.equal(/requestExperienceCloudConsoleToken/.test(ensureCmSource), false);
  assert.equal(/persistExperienceCloudConsoleTokenResult/.test(ensureCmSource), false);
  assert.equal(/ensure-cookie-session/.test(ensureCmSource), false);
});

test("CM token bootstrap can harvest JWTs from raw IMS response text when access_token fields are missing", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const extractTokenSource = extractFunctionSource(popupSource, "extractImsAccessTokenFromPayload");
  const validateSource = extractFunctionSource(popupSource, "requestCmTokenViaValidateToken");
  const checkSource = extractFunctionSource(popupSource, "requestCmTokenViaImsCheck");

  assert.match(extractTokenSource, /extractJwtAndUrls\(payload\)/);
  assert.match(extractTokenSource, /rawJwtMatch/);
  assert.match(extractTokenSource, /access_token\|accessToken\|bearer\|authorization\|authToken\|token/);
  assert.match(validateSource, /const text = await response\.text\(\)\.catch\(\(\) => ""\);/);
  assert.match(validateSource, /extractImsAccessTokenFromPayload\(parsed,\s*text\)/);
  assert.match(checkSource, /const text = await response\.text\(\)\.catch\(\(\) => ""\);/);
  assert.match(checkSource, /extractImsAccessTokenFromPayload\(parsed,\s*text\)/);
});

test("CM request path accepts the configured UnderPAR shell bearer before requiring cm-console-ui requalification", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const requestSupportSource = extractFunctionSource(popupSource, "tokenSupportsCmConsoleRequests");
  const ensureCmSource = extractFunctionSource(popupSource, "ensureCmApiAccessToken");
  const tenantCatalogSource = extractFunctionSource(popupSource, "fetchCmTenantCatalogWithAuth");
  const reportHeadersSource = extractFunctionSource(popupSource, "withCmReportContextHeaders");

  assert.match(requestSupportSource, /isUnderparImsClientId/);
  assert.match(ensureCmSource, /getPreferredCmRequestAccessTokenCandidate\(\)/);
  assert.match(ensureCmSource, /tokenSupportsCmConsoleRequests\(existingToken\)/);
  assert.match(ensureCmSource, /tokenSupportsCmConsoleRequests\(primarySeedToken\)/);
  assert.match(tenantCatalogSource, /state\.loginData\?\.accessToken/);
  assert.match(tenantCatalogSource, /tokenSupportsCmConsoleRequests\(candidate\)/);
  assert.match(reportHeadersSource, /AP-Request-Id/);
});

test("CM tenant catalog reuses the vaulted tenant list until explicit refresh instead of forcing per-session re-fetches", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const ensureCatalogSource = extractFunctionSource(popupSource, "ensureCmTenantsCatalog");
  const activateSessionSource = extractFunctionSource(popupSource, "activateSession");

  assert.match(
    ensureCatalogSource,
    /if \(!forceRefresh && cachedCatalog && Array\.isArray\(cachedCatalog\.tenants\) && cachedCatalog\.tenants\.length > 0\)/
  );
  assert.match(ensureCatalogSource, /phase: state\.cmTenantsCatalogRuntimeFresh === true \? "cm-tenant-catalog-cache-hit" : "cm-tenant-catalog-vault-hit"/);
  assert.match(
    ensureCatalogSource,
    /const hydratedCatalog = await hydrateCmTenantsCatalogFromStorage\(\{ forceReload: false \}\);[\s\S]*phase: "cm-tenant-catalog-vault-hit"[\s\S]*return hydratedCatalog;/
  );
  assert.match(activateSessionSource, /prefetchCmTenantsCatalogInBackground\(`session-activated:\$\{source\}`,\s*\{[\s\S]*forceRefresh: false,/);
});

test("missing DCR credentials trigger on-demand pass vault compilation instead of requiring manual re-selection", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const ensureDcrSource = extractFunctionSource(popupSource, "ensureDcrAccessToken");

  assert.match(ensureDcrSource, /queuePassVaultProgrammerCompilation\(/);
  assert.match(ensureDcrSource, /dcr-registration-trigger-vault-compile/);
  assert.doesNotMatch(ensureDcrSource, /Re-select the media company to hydrate its registered applications first/);
  assert.match(ensureDcrSource, /UnderPAR could not auto-hydrate DCR credentials/);
});

test("selected programmer hydration is primed early and reused by panel render instead of waiting for first service click", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const refreshSource = extractFunctionSource(popupSource, "refreshProgrammerPanels");
  const activateSessionSource = extractFunctionSource(popupSource, "activateSession");

  assert.match(popupSource, /async function primeProgrammerServiceHydration\(/);
  assert.match(refreshSource, /backgroundHydrationPromise = primeProgrammerServiceHydration\(programmer, cachedServices/);
  assert.match(refreshSource, /backgroundHydrationPromise =\s*backgroundHydrationPromise \|\|[\s\S]*primeProgrammerServiceHydration\(programmer, initialMergedServices/);
  assert.match(activateSessionSource, /primeProgrammerServiceHydration\(\s*selectedProgrammerForHydration/);
});

test("ESM, CM, and DEGRADATION panel loaders wait for in-flight programmer hydration before surfacing missing-service state", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const esmSource = extractFunctionSource(popupSource, "loadEsmWorkspaceService");
  const cmSource = extractFunctionSource(popupSource, "loadCmService");
  const degradationSource = extractFunctionSource(popupSource, "loadDegradationService");

  assert.match(esmSource, /getProgrammerServiceHydrationPromise\(programmer\.programmerId\)/);
  assert.match(esmSource, /primeProgrammerServiceHydration\(programmer, currentServices/);
  assert.match(cmSource, /primeProgrammerServiceHydration\(programmer, latestServices/);
  assert.match(degradationSource, /primeProgrammerServiceHydration\(programmer, getCurrentPremiumAppsSnapshot\(programmer\.programmerId\)/);
});

test("CM direct fetch and tenant catalog paths no longer issue unauthenticated cookie-style fallbacks", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const fetchSource = extractFunctionSource(popupSource, "fetchCmJsonWithAuthVariants");
  const tenantCatalogSource = extractFunctionSource(popupSource, "fetchCmTenantCatalogWithAuth");

  assert.doesNotMatch(popupSource, /function fetchCmTenantCatalogWithSession/);
  assert.match(fetchSource, /const requiresAdobeConsoleAuth = isCmReportsRequestUrl\(url\) \|\| isCmConfigRequestUrl\(url\);/);
  assert.doesNotMatch(fetchSource, /allowCookieFallback/);
  assert.doesNotMatch(tenantCatalogSource, /headerVariants\.push\(baseHeaders\)/);
  assert.match(
    tenantCatalogSource,
    /UnderPAR could not auto-hydrate a cm-console-ui bearer from the current Adobe IMS session/
  );
});

test("CM tenant bootstrap prefers direct bearer fetch before reports page fallback", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const ensureCatalogSource = extractFunctionSource(popupSource, "ensureCmTenantsCatalog");
  const reportsPageSource = extractFunctionSource(popupSource, "requestCmConsoleBootstrapCatalogFromReportsPage");

  assert.doesNotMatch(ensureCatalogSource, /const shouldPreferReportsPageBootstrap/);
  assert.ok(
    ensureCatalogSource.indexOf("for (const tenantCatalogUrl of tenantCatalogUrls)") <
      ensureCatalogSource.indexOf("requestCmConsoleBootstrapCatalogFromReportsPage(")
  );
  assert.match(reportsPageSource, /openTemporaryAdobePageContextTarget/);
  assert.doesNotMatch(reportsPageSource, /findExistingExperienceAdobeTab/);
});

test("PKCE authorization URL uses code response mode and the configured client ID", () => {
  const helpers = loadPopupImsHelpers();

  const authorizationUrl = helpers.buildUnderparImsAuthorizationCodeUrl({
    clientId: "underpar-client-id",
    redirectUri: "https://example.chromiumapp.org/ims-callback",
    scope: "openid profile",
    state: "state-123",
    codeChallenge: "challenge-123",
    prompt: "none",
    extraParams: {
      organization: "@adobepass",
    },
  });

  const parsed = new URL(authorizationUrl);
  assert.equal(parsed.origin, "https://ims-na1.adobelogin.com");
  assert.equal(parsed.pathname, "/ims/authorize/v2");
  assert.equal(parsed.searchParams.get("client_id"), "underpar-client-id");
  assert.equal(parsed.searchParams.get("response_type"), "code");
  assert.equal(parsed.searchParams.get("response_mode"), "query");
  assert.equal(parsed.searchParams.get("code_challenge_method"), "S256");
  assert.equal(parsed.searchParams.get("code_challenge"), "challenge-123");
  assert.equal(parsed.searchParams.get("redirect_uri"), "https://example.chromiumapp.org/ims-callback");
  assert.equal(parsed.searchParams.get("scope"), "openid profile");
  assert.equal(parsed.searchParams.get("prompt"), "none");
  assert.equal(parsed.searchParams.get("organization"), "@adobepass");
});

test("PKCE authorization URL ignores auth-envelope overrides from extra params", () => {
  const helpers = loadPopupImsHelpers();

  const authorizationUrl = helpers.buildUnderparImsAuthorizationCodeUrl({
    clientId: "underpar-client-id",
    redirectUri: "https://example.chromiumapp.org/ims-callback",
    scope: "openid profile",
    state: "state-123",
    codeChallenge: "challenge-123",
    extraParams: {
      client_id: "exc_app",
      response_type: "token",
      response_mode: "fragment",
      code_challenge_method: "plain",
      code_challenge: "override-me",
      organization: "@adobepass",
    },
  });

  const parsed = new URL(authorizationUrl);
  assert.equal(parsed.searchParams.get("client_id"), "underpar-client-id");
  assert.equal(parsed.searchParams.get("response_type"), "code");
  assert.equal(parsed.searchParams.get("response_mode"), "query");
  assert.equal(parsed.searchParams.get("code_challenge_method"), "S256");
  assert.equal(parsed.searchParams.get("code_challenge"), "challenge-123");
  assert.equal(parsed.searchParams.get("organization"), "@adobepass");
});

test("PKCE authorization URL carries the supported IMS login prompt when requested", () => {
  const helpers = loadPopupImsHelpers();

  const authorizationUrl = helpers.buildUnderparImsAuthorizationCodeUrl({
    clientId: "underpar-client-id",
    redirectUri: "https://example.chromiumapp.org/ims-callback",
    scope: "openid profile read_organizations",
    state: "state-123",
    codeChallenge: "challenge-123",
    prompt: "login",
  });

  const parsed = new URL(authorizationUrl);
  assert.equal(parsed.searchParams.get("prompt"), "login");
});

test("IMS logout URL carries the browser reset parameters needed for recovery re-auth", () => {
  const helpers = loadPopupImsHelpers();

  const logoutUrl = helpers.buildUnderparImsLogoutUrl({
    accessToken: "ims-access-token",
    redirectUri: "https://example.chromiumapp.org/ims-callback",
    clientId: "underpar-client-id",
  });

  const parsed = new URL(logoutUrl);
  assert.equal(parsed.origin, "https://ims-na1.adobelogin.com");
  assert.equal(parsed.pathname, "/ims/logout");
  assert.equal(parsed.searchParams.get("access_token"), "ims-access-token");
  assert.equal(parsed.searchParams.get("redirect_uri"), "https://example.chromiumapp.org/ims-callback");
  assert.equal(parsed.searchParams.get("client_id"), "underpar-client-id");
});

test("granted IMS scope merges response and claims tokens for org diagnostics", () => {
  const helpers = loadPopupImsHelpers();

  assert.equal(
    helpers.resolveGrantedUnderparImsScope(
      "",
      "openid profile",
      "additional_info.projectedProductContext read_organizations"
    ),
    "openid profile additional_info.projectedproductcontext read_organizations"
  );
  assert.equal(
    JSON.stringify(
      helpers.getMissingUnderparImsScopeTokens(
        "openid profile additional_info.projectedproductcontext",
        "openid profile additional_info.projectedProductContext read_organizations"
      )
    ),
    JSON.stringify(["read_organizations"])
  );
});

test("restricted org extraction accepts shell-style label and value records", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const extractOrgIdSource = extractFunctionSource(popupSource, "extractOrgId");
  const extractOrganizationIdSource = extractFunctionSource(popupSource, "extractOrganizationId");
  const extractVerifiedOrgClaimSource = extractFunctionSource(popupSource, "extractVerifiedCustomerOrganizationClaim");
  const extractOrgNameSource = extractFunctionSource(popupSource, "extractOrgName");
  const extractUserIdSource = extractFunctionSource(popupSource, "extractUserId");

  assert.doesNotMatch(extractOrgIdSource, /org\?\.value/);
  assert.doesNotMatch(extractOrgIdSource, /org\?\.organization(?!Id|ID|_id)\b/);
  assert.doesNotMatch(extractOrgIdSource, /org\?\.id/);
  assert.match(extractOrganizationIdSource, /looksLikeOrganizationObject\(value\) \? firstNonEmptyString\(\[value\.value, value\.id, value\.code\]\) : ""/);
  assert.match(extractVerifiedOrgClaimSource, /idClaims\?\.org_id/);
  assert.match(extractVerifiedOrgClaimSource, /accessClaims\?\.organizationId/);
  assert.doesNotMatch(extractVerifiedOrgClaimSource, /profile\.projectedProductContext/);
  assert.doesNotMatch(extractVerifiedOrgClaimSource, /extractOrganizationId\(accessClaims\)/);
  assert.match(extractOrgNameSource, /org\?\.label/);
  assert.match(extractUserIdSource, /org\?\.profileGuid/);
  assert.match(extractUserIdSource, /org\?\.userGuid/);
});

test("restricted org picker merges IMS orgs with profile claims and configured ZIP.KEY orgs", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const buildOptionsSource = extractFunctionSource(popupSource, "buildRestrictedOrgOptions");
  const collectCandidatesSource = extractFunctionSource(popupSource, "collectRestrictedOrganizationCandidates");

  assert.match(buildOptionsSource, /getActiveUnderparImsRuntimeConfig\(\)/);
  assert.match(buildOptionsSource, /parseJwtPayload\(currentSession\?\.accessToken\)/);
  assert.match(buildOptionsSource, /parseJwtPayload\(currentSession\?\.idToken\)/);
  assert.match(collectCandidatesSource, /configuredOrganizations\.forEach/);
  assert.match(collectCandidatesSource, /collectCandidatesFromValue\(profile, "profile"\)/);
  assert.match(collectCandidatesSource, /collectCandidatesFromValue\(profile\?\.additional_info, "profile\.additional_info"\)/);
  assert.match(collectCandidatesSource, /collectCandidatesFromValue\(accessClaims, "accessClaims"\)/);
  assert.match(collectCandidatesSource, /collectCandidatesFromValue\(idClaims, "idClaims"\)/);
});

test("popup and sidepanel ship a minimal sign-in surface without a pre-auth org target picker", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const renderSignInViewSource = extractFunctionSource(popupSource, "renderSignInView");

  for (const htmlSource of [popupHtml, sidepanelHtml]) {
    assert.doesNotMatch(htmlSource, /id="sign-in-org-field"/);
    assert.doesNotMatch(htmlSource, /id="sign-in-org-select"/);
    assert.doesNotMatch(htmlSource, /id="sign-in-org-meta"/);
    assert.doesNotMatch(htmlSource, /id="sign-in-org-hint"/);
    assert.match(htmlSource, /id="sign-in-hero-btn"/);
  }

  assert.doesNotMatch(renderSignInViewSource, /buildTargetOrganizationContext\(\)/);
  assert.doesNotMatch(renderSignInViewSource, /PREAUTH_TARGET_ORG_PLACEHOLDER_VALUE/);
  assert.match(renderSignInViewSource, /els\.signInHeroBtn\.disabled = signingIn;/);
  assert.match(renderSignInViewSource, /els\.signInHeroBtn\.textContent = signingIn \? "Signing In\.\.\." : "Sign In";/);
});

test("primary sign-in always forces Adobe's chooser and silent bootstrap no longer waits on pre-auth org selection", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const primarySignInSource = extractFunctionSource(popupSource, "onPrimarySignInClick");
  const silentBootstrapSource = extractFunctionSource(popupSource, "shouldAttemptSilentBootstrapSession");

  assert.doesNotMatch(primarySignInSource, /buildTargetOrganizationContext\(\)/);
  assert.doesNotMatch(primarySignInSource, /Choose an Adobe org target before signing in\./);
  assert.match(primarySignInSource, /await signInInteractive\(\{\s*prompt: "login",\s*forceBrowserLogout: true,\s*\}\);/);
  assert.doesNotMatch(silentBootstrapSource, /targetOrganizationContext/);
  assert.match(silentBootstrapSource, /!state\.manualSignOutHold/);
  assert.match(silentBootstrapSource, /hasConfiguredUnderparImsClientId\(\)/);
});

test("activation and restricted recovery are target-org aware and no longer multi-loop org-switch attempts", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const activationPrepSource = extractFunctionSource(popupSource, "enforceAdobePassAccess");
  const restrictedSwitchSource = extractFunctionSource(popupSource, "onRestrictedOrgSwitch");
  const restrictedOptionsSource = extractFunctionSource(popupSource, "ensureRestrictedOrgOptionsFromToken");

  assert.match(activationPrepSource, /attachTargetOrganizationToLoginData/);
  assert.match(activationPrepSource, /verifyTargetOrganizationSelection/);
  assert.match(activationPrepSource, /tokenHasReadOrganizationsScope/);
  assert.match(restrictedOptionsSource, /updateRestrictedOrgOptions\(cachedOrganizations, configuredPreferredOrg, seedSession\)/);
  assert.match(restrictedSwitchSource, /buildPreferredOrgSwitchStrategy\(selected\)/);
  assert.doesNotMatch(restrictedSwitchSource, /for \(const strategy of strategies\)/);
  assert.doesNotMatch(activationPrepSource, /orgVerification\.status === "verified-mismatch"/);
});

test("programmer access denial drops into the org picker instead of auto-restarting recovery auth", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const activationSource = extractFunctionSource(popupSource, "activateSession");

  assert.doesNotMatch(activationSource, /attemptInteractiveAdobePassRecovery/);
  assert.match(activationSource, /ensureRestrictedOrgOptionsFromToken\(\s*deniedAccessToken,[\s\S]*deniedSessionData/);
});

test("logged-out popup and sidepanel surfaces expose ZIP.KEY import controls", () => {
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupCss = fs.readFileSync(path.join(ROOT, "popup.css"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  for (const htmlSource of [popupHtml, sidepanelHtml]) {
    assert.match(htmlSource, /id="zip-key-import-view"/);
    assert.match(htmlSource, /id="zip-key-dropzone"/);
    assert.match(htmlSource, /id="zip-key-file-input"/);
    assert.match(htmlSource, /id="zip-key-browse-btn"/);
    assert.match(htmlSource, />LOAD KEY</);
    assert.match(htmlSource, />CHOOSE KEY</);
    assert.match(htmlSource, /id="zip-key-import-state" class="zip-key-import-state" hidden/);
    assert.doesNotMatch(htmlSource, />Drop key\.</);
  }

  assert.match(popupCss, /\.zip-key-import-card\s*\{[\s\S]*width: 100%;[\s\S]*padding: 0;[\s\S]*border: none;[\s\S]*background: none;[\s\S]*box-shadow: none;/);
  assert.match(popupCss, /\.zip-key-dropzone\s*\{[\s\S]*width: 100%;[\s\S]*max-width: none;[\s\S]*min-height: min\(48vh, 320px\);/);
  assert.match(popupCss, /body\.underpar-up-tab \.zip-key-import-view--gate\s*\{[\s\S]*width: 100%;[\s\S]*max-width: 100%;[\s\S]*align-self: stretch;/);
  assert.match(popupSource, /promptForZipKeyImport/);
  assert.match(popupSource, /importZipKeyIntoVaultFromFile/);
});

test("missing-client-id flow renders a standalone ZIP.KEY gate before sign-in", () => {
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const shouldShowGateSource = extractFunctionSource(popupSource, "shouldShowZipKeyImportGate");
  const syncZipKeyImportViewSource = extractFunctionSource(popupSource, "syncZipKeyImportView");
  const renderSource = extractFunctionSource(popupSource, "render");

  assert.match(popupHtml, /id="zip-key-import-view" class="zip-key-import-view zip-key-import-view--gate"/);
  assert.match(sidepanelHtml, /id="zip-key-import-view" class="zip-key-import-view zip-key-import-view--gate"/);
  assert.doesNotMatch(popupHtml, /id="zip-key-import-view"[^>]*hidden/);
  assert.doesNotMatch(sidepanelHtml, /id="zip-key-import-view"[^>]*hidden/);
  assert.ok(popupHtml.indexOf('id="zip-key-import-view"') < popupHtml.indexOf('id="sign-in-view"'));
  assert.match(popupHtml, /id="sign-in-view" class="sign-in-view" hidden/);
  assert.match(sidepanelHtml, /id="sign-in-view" class="sign-in-view" hidden/);
  assert.match(popupSource, /function shouldShowZipKeyImportGate\(/);
  assert.match(shouldShowGateSource, /state\.manualZipKeyImportGate === true \|\| !hasConfiguredUnderparImsClientId/);
  assert.match(syncZipKeyImportViewSource, /const show = shouldShowZipKeyImportGate\(\);/);
  assert.match(syncZipKeyImportViewSource, /const explicitStateMessage = String\(state\.zipKeyImportMessage \|\| ""\)\.trim\(\);/);
  assert.match(syncZipKeyImportViewSource, /hasClientId \? READY_ZIP_KEY_IMPORT_STATUS_MESSAGE : ""/);
  assert.match(syncZipKeyImportViewSource, /els\.zipKeyImportState\.hidden = !hasStateMessage;/);
  assert.match(renderSource, /const showZipKeyImportGate = shouldShowZipKeyImportGate\(\);/);
  assert.match(renderSource, /els\.authBtn\.hidden = showZipKeyImportGate;/);
});

test("ZIP.KEY import completion clears the gate before bootstrap resumes session detection", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const finalizeSource = extractFunctionSource(popupSource, "finalizeSuccessfulZipKeyImport");
  const fileImportSource = extractFunctionSource(popupSource, "importZipKeyIntoVaultFromFile");
  const textImportSource = extractFunctionSource(popupSource, "importZipKeyIntoVaultFromText");

  assert.match(finalizeSource, /state\.zipKeyImportPending = false;/);
  assert.match(finalizeSource, /state\.manualZipKeyImportGate = false;/);
  assert.match(finalizeSource, /await bootstrapSession\("zip-key-import"\)/);
  assert.match(fileImportSource, /return await finalizeSuccessfulZipKeyImport\(result\);/);
  assert.match(textImportSource, /return await finalizeSuccessfulZipKeyImport\(result\);/);
});

test("logged-out workflow reset preserves imported ZIP.KEY IMS config unless the vault is explicitly purged", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const resetSource = extractFunctionSource(popupSource, "resetWorkflowForLoggedOut");
  const signedOutSource = extractFunctionSource(popupSource, "resetToSignedOutState");
  const purgeSource = extractFunctionSource(popupSource, "purgePassVaultFromDevtools");

  assert.match(resetSource, /const preservePassVault = options\?\.preservePassVault !== false;/);
  assert.match(resetSource, /const nextPassVault = preservePassVault/);
  assert.match(resetSource, /const hasZipKeyClientId = hasConfiguredUnderparImsClientId\(nextPassVault\);/);
  assert.match(resetSource, /normalizeUnderparVaultPayload\(state\.passVault \|\| createEmptyUnderparVaultPayload\(\)\)/);
  assert.match(resetSource, /state\.zipKeyImportPending = false;/);
  assert.match(resetSource, /state\.zipKeyImportDragActive = false;/);
  assert.match(resetSource, /if \(!hasZipKeyClientId\) \{\s*setZipKeyImportFeedback\("",\s*"info"\);\s*\}/);
  assert.match(resetSource, /state\.passVault = nextPassVault;/);
  assert.match(resetSource, /rebuildPassVaultProgrammerStatusIndex\(nextPassVault\);/);
  assert.doesNotMatch(resetSource, /state\.passVault = createEmptyUnderparVaultPayload\(\);/);
  assert.match(signedOutSource, /const preservePassVault = options\.preservePassVault !== false;/);
  assert.match(signedOutSource, /resetWorkflowForLoggedOut\(\{\s*preservePassVault,\s*\}\);/);
  assert.match(purgeSource, /preservePassVault: false,/);
});

test("build label renders immediately from the manifest version with a placeholder fallback", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const bootstrapSource = fs.readFileSync(path.join(ROOT, "build-info-bootstrap.js"), "utf8");
  const renderBuildInfoSource = extractFunctionSource(popupSource, "renderBuildInfo");
  const initSource = extractFunctionSource(popupSource, "init");

  assert.match(popupHtml, /<script src="build-info-bootstrap\.js"><\/script>/);
  assert.match(sidepanelHtml, /<script src="build-info-bootstrap\.js"><\/script>/);
  assert.match(bootstrapSource, /chrome\?\.runtime\?\.getManifest\?\.\(\)\?\.version/);
  assert.match(bootstrapSource, /Version \$\{version\}/);
  assert.match(renderBuildInfoSource, /chrome\?\.\s*runtime\?\.\s*getManifest\?\.\(\)\?\.version/);
  assert.match(renderBuildInfoSource, /Version \$\{manifestVersion\}/);
  assert.match(renderBuildInfoSource, /Version --/);
  assert.match(initSource, /renderBuildInfo\(\);/);
});

test("popup and sidepanel ship the same sparse logged-out sign-in surface after ZIP.KEY import", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");

  assert.match(sidepanelHtml, /id="sign-in-view"/);
  assert.match(popupHtml, /id="sign-in-view"/);
  assert.match(sidepanelHtml, /id="sign-in-hero-btn"/);
  assert.match(popupHtml, /id="sign-in-hero-btn"/);
  assert.match(sidepanelHtml, />SIGN IN</);
  assert.match(popupHtml, />SIGN IN</);
  assert.doesNotMatch(sidepanelHtml, /id="sign-in-zip-key-btn"/);
  assert.doesNotMatch(popupHtml, /id="sign-in-zip-key-btn"/);
  assert.doesNotMatch(sidepanelHtml, /class="sign-in-view-card"/);
  assert.doesNotMatch(popupHtml, /class="sign-in-view-card"/);
  assert.ok(sidepanelHtml.indexOf('id="zip-key-import-view"') < sidepanelHtml.indexOf('id="sign-in-view"'));
});

test("popup and sidepanel both ship the generic restricted org picker surface", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const renderRestrictedSource = extractFunctionSource(popupSource, "renderRestrictedView");

  for (const htmlSource of [popupHtml, sidepanelHtml]) {
    assert.match(htmlSource, /id="restricted-view"/);
    assert.match(htmlSource, /class="restricted-view-card"/);
    assert.match(htmlSource, /id="restricted-org-select"/);
    assert.match(htmlSource, /id="restricted-org-hint"/);
    assert.match(htmlSource, /id="restricted-org-switch-btn"/);
    assert.match(htmlSource, /id="restricted-sign-in-btn"/);
    assert.match(htmlSource, /id="restricted-sign-out-btn"/);
    assert.match(htmlSource, /Adobe Org Picker/);
    assert.match(htmlSource, /Adobe Org Profile/);
    assert.match(htmlSource, /Sign In Again/);
    assert.match(htmlSource, /Sign Out/);
    assert.doesNotMatch(htmlSource, /For @AdobePass only/);
  }

  assert.match(renderRestrictedSource, /!els\.restrictedOrgSelect/);
  assert.match(renderRestrictedSource, /!els\.restrictedOrgSwitchBtn/);
  assert.match(renderRestrictedSource, /!els\.restrictedSignInBtn/);
  assert.match(renderRestrictedSource, /!els\.restrictedSignOutBtn/);
  assert.doesNotMatch(renderRestrictedSource, /Auto-switch to @AdobePass is required for access\./);
});

test("sidepanel requestor picker spans the same full workflow width as media company and MVPD", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupCss = fs.readFileSync(path.join(ROOT, "popup.css"), "utf8");

  assert.match(sidepanelHtml, /<div class="field field--requestor">/);
  assert.match(sidepanelHtml, /<div class="picker-action-row requestor-select-row">/);
  assert.match(sidepanelHtml, /class="selector-quick-launch-spacer"/);
  assert.match(popupCss, /\.workflow > \.field--requestor\s*\{\s*grid-column:\s*1 \/ -1;\s*\}/);
  assert.match(
    popupCss,
    /\.selector-quick-launch-spacer\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?width:\s*32px;[\s\S]*?visibility:\s*hidden;/i
  );
  assert.match(
    popupCss,
    /\.workflow > \.hr-services-container,\s*\.workflow > \.premium-services-container\s*\{[\s\S]*?grid-column:\s*1 \/ -1;[\s\S]*?width:\s*100%;[\s\S]*?min-width:\s*0;/
  );
  assert.match(
    popupCss,
    /\.premium-service-section,\s*\.hr-context-section\s*\{[\s\S]*?width:\s*100%;[\s\S]*?max-width:\s*none;[\s\S]*?min-width:\s*0;[\s\S]*?box-sizing:\s*border-box;/
  );
  assert.match(
    popupCss,
    /\.premium-service-section \.service-box-details,\s*\.hr-context-section \.service-box-details\s*\{[\s\S]*?display:\s*block;[\s\S]*?width:\s*100%;[\s\S]*?min-width:\s*0;/
  );
});

test("requestor and MVPD selectors ship blank default options instead of placeholder copy", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.match(sidepanelHtml, /id="requestor-select" disabled>\s*<option value=""><\/option>/);
  assert.match(sidepanelHtml, /id="mvpd-select" disabled>\s*<option value=""><\/option>/);
  assert.match(popupHtml, /id="requestor-select" disabled>\s*<option value=""><\/option>/);
  assert.match(popupHtml, /id="mvpd-select" disabled>\s*<option value=""><\/option>/);
  assert.match(popupSource, /els\.requestorSelect\.innerHTML = '<option value=""><\/option>';/);
  assert.match(popupSource, /els\.mvpdSelect\.innerHTML = '<option value=""><\/option>';/);
  assert.match(popupSource, /defaultOption\.textContent = "";/);
  assert.doesNotMatch(popupSource, /-- Choose a Content Provider --/);
  assert.doesNotMatch(popupSource, /-- Choose an MVPD --/);
});

test("sidepanel exposes LoginButton-style DEBUG INFO controls backed by popup runtime state", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const renderDebugConsoleSource = extractFunctionSource(popupSource, "renderDebugConsole");
  const copyDebugConsoleSource = extractFunctionSource(popupSource, "copyDebugConsoleToClipboard");
  const composeDebugSource = extractFunctionSource(popupSource, "composeUnderparDebugConsoleOutput");

  assert.match(sidepanelHtml, /id="debugConsole"/);
  assert.match(sidepanelHtml, /id="debugToggleButton"/);
  assert.match(sidepanelHtml, /<body class="underpar-up-tab underpar-sidepanel">/);
  assert.match(
    sidepanelHtml,
    /id="debugToggleButtonLabel" class="spectrum-Detail spectrum-Detail--sizeL debug-toggleTitle">DEBUG INFO</
  );
  assert.match(
    sidepanelHtml,
    /id="debugToggleStatus" class="spectrum-Detail spectrum-Detail--sizeS debug-toggleStatus" hidden>Copied to clipboard</
  );
  assert.match(sidepanelHtml, /id="debugConsoleBody" class="debug-body" hidden/);
  assert.match(sidepanelHtml, /class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Textfield--multiline is-readOnly debug-field"/);
  assert.match(sidepanelHtml, /class="spectrum-Textfield-input debug-field-input"/);
  assert.match(sidepanelHtml, /Click copies\. Shift\+click toggles details\./);
  assert.match(sidepanelHtml, /id="logOutput"/);
  assert.match(popupSource, /const DEFAULT_DEBUG_TOGGLE_LABEL = "DEBUG INFO"/);
  assert.match(popupSource, /const DEFAULT_DEBUG_TOGGLE_META = "Click copies\. Shift\+click toggles details\.";/);
  assert.match(popupSource, /const DEFAULT_DEBUG_COPY_STATUS = "Copied to clipboard"/);
  assert.match(renderDebugConsoleSource, /Shift-click to expand/);
  assert.match(renderDebugConsoleSource, /Shift-click to collapse/);
  assert.match(copyDebugConsoleSource, /UnderPAR could not copy the debug console to the clipboard\./);
  assert.match(composeDebugSource, /UnderPAR DEBUG INFO/);
  assert.match(composeDebugSource, /"diagnostics"/);
  assert.match(composeDebugSource, /"recent_status"/);
  assert.match(composeDebugSource, /"recent_failures"/);
  assert.match(composeDebugSource, /last_error_status=/);
  assert.match(composeDebugSource, /console_bootstrap=/);
  assert.match(composeDebugSource, /programmers=/);
  assert.match(composeDebugSource, /cm_precheck=/);
  assert.match(composeDebugSource, /"recent_activity"/);
  assert.match(composeDebugSource, /precheck_pending/);
});

test("stored and silent session activation stay tabless unless explicitly allowed", () => {
  const helpers = loadPopupCmActivationHelper();

  assert.equal(helpers.shouldAllowTemporaryCmBootstrapTabForActivation("stored", false), false);
  assert.equal(helpers.shouldAllowTemporaryCmBootstrapTabForActivation("silent-bootstrap:startup", false), false);
  assert.equal(helpers.shouldAllowTemporaryCmBootstrapTabForActivation("interactive", false), false);
  assert.equal(helpers.shouldAllowTemporaryCmBootstrapTabForActivation("manual-refresh", true), true);
});

test("CM precheck reset clears stale pending state before background bootstrap begins", () => {
  const helpers = loadPopupCmPrecheckResetHelper();

  helpers.resetCmTenantsPrecheckState();
  const stateSnapshot = helpers.getStateSnapshot();

  assert.equal(stateSnapshot.cmTenantsPrecheckPromise, null);
  assert.equal(stateSnapshot.cmTenantsPrecheckPending, false);
  assert.equal(stateSnapshot.cmTenantsPrecheckComplete, false);
  assert.equal(stateSnapshot.cmTenantsPrecheckLastError, "");
  assert.equal(stateSnapshot.cmTenantsCatalog, null);
  assert.equal(stateSnapshot.cmTenantsCatalogPromise, null);
  assert.equal(stateSnapshot.cmTenantsCatalogHydrated, false);
  assert.equal(stateSnapshot.cmTenantsCatalogHydrationPromise, null);
  assert.equal(stateSnapshot.cmTenantsCatalogRuntimeFresh, false);
  assert.equal(stateSnapshot.cmTenantsCatalogFetchAttempted, false);
  assert.equal(helpers.getSyncCalls(), 1);
});

test("CM tenant background prefetch is guarded by the shared precheck promise instead of a stale pending flag", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const prefetchSource = extractFunctionSource(popupSource, "prefetchCmTenantsCatalogInBackground");
  const precheckSource = extractFunctionSource(popupSource, "ensureCmTenantsPrecheckForActiveSession");
  const activateSessionSource = extractFunctionSource(popupSource, "activateSession");

  assert.match(prefetchSource, /state\.cmTenantsCatalogPromise \|\| state\.cmTenantsPrecheckPromise/);
  assert.match(precheckSource, /if \(!forceRefresh && state\.cmTenantsPrecheckPromise\)/);
  assert.match(precheckSource, /state\.cmTenantsPrecheckPromise = precheckPromise/);
  assert.match(precheckSource, /const effectiveAllowTemporaryPageContextTab = allowTemporaryPageContextTab;/);
  assert.doesNotMatch(precheckSource, /preferredCmBootstrapTabId <= 0 && getRetainedAuthPopupBootstrapTabId\(\) <= 0/);
  assert.match(
    activateSessionSource,
    /allowTemporaryPageContextTab:\s*allowBackgroundTemporaryPageContextTab/
  );
});
