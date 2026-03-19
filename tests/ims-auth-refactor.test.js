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
    extractFunctionSource(source, "normalizeImsScopeList"),
    extractFunctionSource(source, "sanitizeUnderparImsScopeForCredential"),
    extractFunctionSource(source, "buildUnderparImsAuthorizationCodeUrl"),
    "module.exports = { normalizeImsScopeList, sanitizeUnderparImsScopeForCredential, buildUnderparImsAuthorizationCodeUrl };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    URLSearchParams,
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

test("runtime source no longer hard-codes debugger client or legacy redirect host", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");
  const backgroundSource = fs.readFileSync(path.join(ROOT, "background.js"), "utf8");
  const helperSource = fs.readFileSync(path.join(ROOT, "src/login/login.js"), "utf8");
  const manifestSource = fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8");

  for (const source of [popupSource, backgroundSource, helperSource, manifestSource]) {
    assert.equal(/adobeExperienceCloudDebugger/i.test(source), false);
    assert.equal(/login\.aepdebugger\.adobe\.com/i.test(source), false);
  }
});

test("popup IMS runtime config parser recognizes adobe.ims ZIP.KEY paths", () => {
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.match(popupSource, /services\.adobe\.ims\.client_id/);
  assert.match(popupSource, /adobe\.ims\.client_id/);
  assert.match(popupSource, /services\.adobe\.ims\.scope/);
  assert.match(popupSource, /adobe\.ims\.scope/);
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
