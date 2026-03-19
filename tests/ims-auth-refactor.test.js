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
    'const IMS_SCOPE = "openid profile offline_access additional_info.projectedProductContext";',
    'const IMS_DEFAULT_AUTHORIZATION_ENDPOINT = "https://ims-na1.adobelogin.com/ims/authorize/v2";',
    'const IMS_CONSOLE_ALLOWED_SCOPES = ["openid","profile","offline_access","additional_info.projectedProductContext","AdobeID","read_organizations","additional_info.job_function"];',
    'const IMS_LEGACY_SCOPE_MIGRATION_TOKENS = ["avatar","session","additional_info.account_type","additional_info.roles","additional_info.user_image_url","analytics_services"];',
    "function firstNonEmptyString(values = []) { for (const value of Array.isArray(values) ? values : []) { const text = String(value || '').trim(); if (text) { return text; } } return ''; }",
    "function uniqueSorted(values = []) { return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean))].sort(); }",
    "function getZipKeyValueByPath(payload = null, pathExpr = '') { if (!payload || typeof payload !== 'object') { return undefined; } const expr = String(pathExpr || '').trim(); if (!expr) { return undefined; } if (Object.prototype.hasOwnProperty.call(payload, expr)) { return payload[expr]; } const parts = expr.split('.').map((part) => part.trim()).filter(Boolean); if (parts.length === 0) { return undefined; } let node = payload; for (const part of parts) { if (!node || typeof node !== 'object' || !Object.prototype.hasOwnProperty.call(node, part)) { return undefined; } node = node[part]; } return node; }",
    "function readZipKeyValue(payload = null, candidates = []) { for (const candidate of Array.isArray(candidates) ? candidates : []) { const value = getZipKeyValueByPath(payload, candidate); if (typeof value === 'string') { const trimmed = value.trim(); if (trimmed) { return trimmed; } continue; } if (typeof value === 'number' && Number.isFinite(value)) { return String(value); } if (typeof value === 'boolean') { return value ? 'true' : 'false'; } } return ''; }",
    "function decodeZipKeyPayloadBase64(value = '') { const compact = String(value || '').replace(/\\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'); if (!compact) { return ''; } const remainder = compact.length % 4; const padded = remainder === 0 ? compact : `${compact}${'='.repeat(4 - remainder)}`; const binary = atob(padded); try { const bytes = Uint8Array.from(binary, (entry) => entry.charCodeAt(0)); return new TextDecoder().decode(bytes); } catch { return binary; } }",
    "function parseKeyValueText(rawText = '') { const payload = {}; String(rawText || '').split(/\\r?\\n/).forEach((line) => { const match = line.match(/^\\s*([^=:\\s]+)\\s*[:=]\\s*(.+)\\s*$/); if (!match) { return; } payload[String(match[1] || '').trim()] = String(match[2] || '').trim(); }); return payload; }",
    "function parseZipKeyPayload(rawText = '') { const raw = String(rawText || '').trim(); if (!raw) { throw new Error('ZIP.KEY payload is empty.'); } const prefix = 'ZIPKEY1:'; let payloadText = raw; if (raw.slice(0, prefix.length).toUpperCase() === prefix) { payloadText = raw.slice(prefix.length).trim(); } if (!payloadText) { throw new Error('ZIP.KEY payload is empty.'); } if (payloadText.startsWith('{')) { try { const parsed = JSON.parse(payloadText); if (parsed && typeof parsed === 'object') { return parsed; } } catch { throw new Error('ZIP.KEY JSON payload could not be parsed.'); } } try { const decoded = decodeZipKeyPayloadBase64(payloadText).trim(); if (decoded.startsWith('{')) { const parsed = JSON.parse(decoded); if (parsed && typeof parsed === 'object') { return parsed; } } } catch { } const fromKeyValue = parseKeyValueText(payloadText); if (Object.keys(fromKeyValue).length > 0) { return fromKeyValue; } throw new Error('Unknown ZIP.KEY format. Use ZIPKEY1 base64 JSON, raw JSON, or KEY=VALUE lines.'); }",
    extractFunctionSource(source, "normalizeImsScopeList"),
    extractFunctionSource(source, "sanitizeUnderparImsScopeForCredential"),
    extractFunctionSource(source, "normalizeUnderparVaultImsRuntimeConfigRecord"),
    extractFunctionSource(source, "extractUnderparImsRuntimeConfigFromZipKeyText"),
    extractFunctionSource(source, "buildUnderparImsAuthorizationCodeUrl"),
    "module.exports = { normalizeImsScopeList, sanitizeUnderparImsScopeForCredential, normalizeUnderparVaultImsRuntimeConfigRecord, extractUnderparImsRuntimeConfigFromZipKeyText, buildUnderparImsAuthorizationCodeUrl };",
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

test("legacy IMS scope bundles clamp to the LoginButton-style PKCE default scope", () => {
  const helpers = loadPopupImsHelpers();

  const result = helpers.sanitizeUnderparImsScopeForCredential(
    "AdobeID,openid,avatar,session,read_organizations,additional_info.job_function,additional_info.projectedProductContext,analytics_services"
  );

  assert.equal(result.scope, "openid profile offline_access additional_info.projectedProductContext");
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

test("interactive login and org switching no longer block on a temporary CM bootstrap tab", () => {
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
});

test("session activation defers CM tenant hydration and unlocks Media Company selection immediately", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const activateSource = extractFunctionSource(popupSource, "activateSession");
  const mediaCompanyLockSource = extractFunctionSource(popupSource, "isMediaCompanySelectionLockedByCmPrecheck");
  const mediaCompanyLabelSource = extractFunctionSource(popupSource, "getMediaCompanySelectDefaultLabel");
  const prefetchSource = extractFunctionSource(popupSource, "prefetchCmTenantsCatalogInBackground");

  assert.match(activateSource, /prefetchCmTenantsCatalogInBackground/);
  assert.match(activateSource, /prefetchCmConsoleBootstrapSummaryInBackground/);
  assert.doesNotMatch(activateSource, /await ensureCmTenantsPrecheckForActiveSession/);
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
  const configVersionSource = extractFunctionSource(popupSource, "getKnownAdobeConsoleConfigurationVersion");

  assert.equal(/configurationVersion=3522/.test(popupSource), false);
  assert.match(popupSource, /function appendAdobeConsoleConfigurationVersion/);
  assert.match(popupSource, /consoleBootstrapState/);
  assert.match(popupSource, /let underparStateRef = null;/);
  assert.match(popupSource, /underparStateRef = state;/);
  assert.doesNotMatch(configVersionSource, /typeof state/);
  assert.match(loadProgrammersSource, /const consoleBootstrapPromise = ensureConsoleBootstrapState/);
  assert.match(loadProgrammersSource, /settlePromiseWithin\(consoleBootstrapPromise, 900, null\)/);
  assert.match(fetchProgrammersSource, /Authorization: `Bearer \$\{accessToken\}`/);
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

  assert.match(popupSource, /let underparCoreInteractionHandlersBound = false;/);
  assert.match(popupSource, /function registerCoreInteractionHandlers\(\)/);
  assert.match(popupSource, /registerCoreInteractionHandlers\(\);\s*\n\s*function log\(/);
  assert.match(popupSource, /function composeUnderparDebugConsoleFallback\(/);
  assert.match(popupSource, /function getUnderparDebugConsoleSnapshot\(/);
  assert.match(renderDebugSource, /setTextOutput\(els\.logOutput,\s*getUnderparDebugConsoleSnapshot\(\)\);/);
  assert.match(copyDebugSource, /els\.logOutput\?\.value \|\| getUnderparDebugConsoleSnapshot\(\)/);
  assert.match(initSource, /registerCoreInteractionHandlers\(\);/);
  assert.match(initSource, /registerEventHandlers\(\);/);
  assert.match(initSource, /await settleUnderparInitStep\("Initial shell render", \(\) => render\(\)\);/);
  assert.match(initSource, /await settleUnderparInitStep\("Pass VAULT load", \(\) => ensurePassVaultLoaded\(\{ forceReload: false \}\)\);/);
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

test("logged-out popup and sidepanel surfaces expose ZIP.KEY import controls", () => {
  const popupHtml = fs.readFileSync(path.join(ROOT, "popup.html"), "utf8");
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  for (const htmlSource of [popupHtml, sidepanelHtml]) {
    assert.match(htmlSource, /id="zip-key-import-view"/);
    assert.match(htmlSource, /id="zip-key-dropzone"/);
    assert.match(htmlSource, /id="zip-key-file-input"/);
    assert.match(htmlSource, /id="zip-key-browse-btn"/);
    assert.match(htmlSource, />LOAD KEY</);
    assert.match(htmlSource, />CHOOSE KEY</);
    assert.match(htmlSource, />Drop key\.</);
  }

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
  assert.ok(popupHtml.indexOf('id="zip-key-import-view"') < popupHtml.indexOf('id="sign-in-view"'));
  assert.match(popupSource, /function shouldShowZipKeyImportGate\(/);
  assert.match(shouldShowGateSource, /state\.manualZipKeyImportGate === true \|\| !hasConfiguredUnderparImsClientId/);
  assert.match(syncZipKeyImportViewSource, /const show = shouldShowZipKeyImportGate\(\);/);
  assert.match(renderSource, /const showZipKeyImportGate = shouldShowZipKeyImportGate\(\);/);
  assert.match(renderSource, /els\.authBtn\.hidden = showZipKeyImportGate;/);
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
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

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
  assert.match(composeDebugSource, /"recent_activity"/);
  assert.match(composeDebugSource, /precheck_pending/);
});
