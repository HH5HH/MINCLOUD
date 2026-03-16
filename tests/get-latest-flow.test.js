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

function loadGetLatestHelpers(seed = {}) {
  const filePath = path.join(ROOT, "background.js");
  const source = fs.readFileSync(filePath, "utf8");
  const script = [
    'const UNDERPAR_GITHUB_OWNER = "HH5HH";',
    'const UNDERPAR_GITHUB_REPO = "UNDERPAR";',
    'const UNDERPAR_LATEST_REF_API_URL = `https://api.github.com/repos/${UNDERPAR_GITHUB_OWNER}/${UNDERPAR_GITHUB_REPO}/git/ref/heads/main`;',
    'const UNDERPAR_LATEST_COMMIT_API_URL = `https://api.github.com/repos/${UNDERPAR_GITHUB_OWNER}/${UNDERPAR_GITHUB_REPO}/commits/main`;',
    'const UNDERPAR_LATEST_MANIFEST_URL = `https://raw.githubusercontent.com/${UNDERPAR_GITHUB_OWNER}/${UNDERPAR_GITHUB_REPO}/main/manifest.json`;',
    'const UNDERPAR_LATEST_MANIFEST_API_URL = `https://api.github.com/repos/${UNDERPAR_GITHUB_OWNER}/${UNDERPAR_GITHUB_REPO}/contents/manifest.json?ref=main`;',
    'const UNDERPAR_LATEST_PACKAGE_URL = `https://raw.githubusercontent.com/${UNDERPAR_GITHUB_OWNER}/${UNDERPAR_GITHUB_REPO}/main/underpar_distro.zip`;',
    'const CHROME_EXTENSIONS_URL = "chrome://extensions";',
    'const UPDATE_CHECK_TTL_MS = 10 * 60 * 1000;',
    "const chrome = globalThis.__seed.chrome;",
    "const fetch = globalThis.__seed.fetch;",
    "const updateState = globalThis.__seed.updateState || { currentVersion: '', latestVersion: '', latestCommitSha: '', updateAvailable: false, lastCheckedAt: 0, checkError: '', inFlight: null };",
    extractFunctionSource(source, "getUnderparBuildVersion"),
    extractFunctionSource(source, "parseVersionPart"),
    extractFunctionSource(source, "compareVersions"),
    extractFunctionSource(source, "extractVersionFromManifestObject"),
    extractFunctionSource(source, "fetchLatestUnderparVersionFromRaw"),
    extractFunctionSource(source, "fetchLatestUnderparVersionFromGithubApi"),
    extractFunctionSource(source, "fetchLatestUnderparVersion"),
    extractFunctionSource(source, "normalizeCommitSha"),
    extractFunctionSource(source, "extractCommitShaFromRefPayload"),
    extractFunctionSource(source, "extractCommitShaFromCommitPayload"),
    extractFunctionSource(source, "fetchLatestUnderparCommitShaFromRefApi"),
    extractFunctionSource(source, "fetchLatestUnderparCommitShaFromCommitApi"),
    extractFunctionSource(source, "fetchLatestUnderparCommitSha"),
    extractFunctionSource(source, "withCacheBust"),
    extractFunctionSource(source, "buildLatestUnderparPackageUrl"),
    extractFunctionSource(source, "sanitizeLatestPackageFileSegment"),
    extractFunctionSource(source, "buildLatestUnderparPackageFileName"),
    extractFunctionSource(source, "startLatestPackageDownload"),
    extractFunctionSource(source, "getUpdateStatePayload"),
    extractFunctionSource(source, "refreshUpdateState"),
    extractFunctionSource(source, "openUnderparGetLatestFlow"),
    "module.exports = { buildLatestUnderparPackageUrl, getUpdateStatePayload, refreshUpdateState, openUnderparGetLatestFlow, updateState };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    __seed: seed,
    atob: (value) => Buffer.from(String(value || ""), "base64").toString("utf8"),
  };
  vm.runInNewContext(script, context, { filename: filePath });
  return context.module.exports;
}

function createSeed(options = {}) {
  const calls = {
    fetch: [],
    downloadsDownload: [],
    tabsCreate: [],
  };
  const responseByUrl = new Map(Object.entries(options.responseByUrl || {}));
  return {
    calls,
    chrome: {
      runtime: {
        getManifest() {
          return { version: String(options.currentVersion || "1.0.0") };
        },
      },
      downloads: {
        async download(info = {}) {
          calls.downloadsDownload.push({ ...info });
          if (options.downloadShouldFail === true) {
            throw new Error("download failed");
          }
          return Number(options.downloadId || 91);
        },
      },
      tabs: {
        async create(info = {}) {
          calls.tabsCreate.push({ ...info });
          return {
            id: calls.tabsCreate.length,
            windowId: 1,
            url: String(info.url || ""),
          };
        },
      },
    },
    async fetch(url) {
      const targetUrl = String(url || "");
      calls.fetch.push(targetUrl);
      if (responseByUrl.has(targetUrl)) {
        return responseByUrl.get(targetUrl);
      }
      return {
        ok: false,
        status: 404,
        async json() {
          return {};
        },
      };
    },
    updateState: {
      currentVersion: "",
      latestVersion: "",
      latestCommitSha: "",
      updateAvailable: false,
      lastCheckedAt: 0,
      checkError: "",
      inFlight: null,
    },
  };
}

test("openUnderparGetLatestFlow uses a SHA-pinned underpar_distro.zip when GitHub ref lookup succeeds", async () => {
  const latestSha = "0123456789abcdef0123456789abcdef01234567";
  const seed = createSeed({
    currentVersion: "1.0.0",
    responseByUrl: {
      "https://raw.githubusercontent.com/HH5HH/UNDERPAR/main/manifest.json": {
        ok: true,
        status: 200,
        async json() {
          return { version: "9.9.9" };
        },
      },
      "https://api.github.com/repos/HH5HH/UNDERPAR/git/ref/heads/main": {
        ok: true,
        status: 200,
        async json() {
          return { object: { sha: latestSha } };
        },
      },
    },
  });

  const helpers = loadGetLatestHelpers(seed);
  const response = await helpers.openUnderparGetLatestFlow();

  assert.equal(response.ok, true);
  assert.equal(String(response.latestCommitSha || ""), latestSha);
  assert.equal(response.downloadStarted, true);
  assert.equal(seed.calls.downloadsDownload.length, 1);
  assert.equal(seed.calls.tabsCreate.length, 1);
  const downloadUrl = String(seed.calls.downloadsDownload[0]?.url || "");
  assert.match(downloadUrl, new RegExp(`/${latestSha}/underpar_distro\\.zip\\?cacheBust=\\d+$`));
  assert.equal(downloadUrl.includes("/main/underpar_distro.zip"), false);
  assert.match(String(seed.calls.downloadsDownload[0]?.filename || ""), /^UnderPAR-v9\.9\.9-0123456\.zip$/);
  assert.equal(String(seed.calls.tabsCreate[0]?.url || ""), "chrome://extensions");
});

test("openUnderparGetLatestFlow falls back to main underpar_distro.zip with cache bust when SHA lookup fails", async () => {
  const seed = createSeed({
    currentVersion: "1.0.0",
    responseByUrl: {
      "https://raw.githubusercontent.com/HH5HH/UNDERPAR/main/manifest.json": {
        ok: true,
        status: 200,
        async json() {
          return { version: "9.9.9" };
        },
      },
    },
  });

  const helpers = loadGetLatestHelpers(seed);
  const response = await helpers.openUnderparGetLatestFlow();

  assert.equal(response.ok, true);
  assert.equal(String(response.latestCommitSha || ""), "");
  assert.equal(response.downloadStarted, true);
  assert.equal(seed.calls.downloadsDownload.length, 1);
  assert.equal(seed.calls.tabsCreate.length, 1);
  const downloadUrl = String(seed.calls.downloadsDownload[0]?.url || "");
  assert.match(downloadUrl, /\/main\/underpar_distro\.zip\?cacheBust=\d+$/);
  assert.match(String(seed.calls.downloadsDownload[0]?.filename || ""), /^UnderPAR-v9\.9\.9\.zip$/);
  assert.equal(String(seed.calls.tabsCreate[0]?.url || ""), "chrome://extensions");
});

test("openUnderparGetLatestFlow falls back to opening the package tab when downloads API fails", async () => {
  const latestSha = "fedcba9876543210fedcba9876543210fedcba98";
  const seed = createSeed({
    currentVersion: "1.0.0",
    downloadShouldFail: true,
    responseByUrl: {
      "https://raw.githubusercontent.com/HH5HH/UNDERPAR/main/manifest.json": {
        ok: true,
        status: 200,
        async json() {
          return { version: "8.8.8" };
        },
      },
      "https://api.github.com/repos/HH5HH/UNDERPAR/git/ref/heads/main": {
        ok: true,
        status: 200,
        async json() {
          return { object: { sha: latestSha } };
        },
      },
    },
  });

  const helpers = loadGetLatestHelpers(seed);
  const response = await helpers.openUnderparGetLatestFlow();

  assert.equal(response.ok, true);
  assert.equal(response.downloadStarted, false);
  assert.equal(response.downloadTabOpened, true);
  assert.equal(seed.calls.downloadsDownload.length, 1);
  assert.equal(seed.calls.tabsCreate.length, 2);
  assert.match(String(seed.calls.tabsCreate[0]?.url || ""), new RegExp(`/${latestSha}/underpar_distro\\.zip\\?cacheBust=\\d+$`));
  assert.equal(String(seed.calls.tabsCreate[1]?.url || ""), "chrome://extensions");
});

test("UnderPAR avatar menu exposes a Get Latest action wired to the background flow", () => {
  const sidepanelHtml = fs.readFileSync(path.join(ROOT, "sidepanel.html"), "utf8");
  const popupSource = fs.readFileSync(path.join(ROOT, "popup.js"), "utf8");

  assert.match(sidepanelHtml, /id="get-latest-btn"/);
  assert.match(popupSource, /UNDERPAR_GET_LATEST_REQUEST_TYPE/);
  assert.match(popupSource, /Starting latest UnderPAR download and opening chrome:\/\/extensions\.\.\./);
});
