const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const POPUP_JS_PATH = path.join(ROOT, "popup.js");

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
  const bodyStart = source.indexOf("{", start);
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

function extractConstSource(source, constName) {
  const marker = `const ${constName} =`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Unable to locate ${constName}`);
  let depthBrace = 0;
  let depthBracket = 0;
  let depthParen = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let isEscaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (inSingle) {
      if (char === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (char === '"') inDouble = false;
      continue;
    }
    if (inTemplate) {
      if (char === "`") inTemplate = false;
      continue;
    }
    if (char === "'") {
      inSingle = true;
      continue;
    }
    if (char === '"') {
      inDouble = true;
      continue;
    }
    if (char === "`") {
      inTemplate = true;
      continue;
    }
    if (char === "{") depthBrace += 1;
    if (char === "}") depthBrace -= 1;
    if (char === "[") depthBracket += 1;
    if (char === "]") depthBracket -= 1;
    if (char === "(") depthParen += 1;
    if (char === ")") depthParen -= 1;
    if (char === ";" && depthBrace === 0 && depthBracket === 0 && depthParen === 0) {
      return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unterminated const: ${constName}`);
}

function loadJellybeanPaletteHelpers() {
  const source = fs.readFileSync(POPUP_JS_PATH, "utf8");
  const script = [
    extractConstSource(source, "ZIP_THEME_PALETTE_HEX"),
    extractConstSource(source, "ESM_WORKSPACE_SEGMENT_COLOR_KEYS"),
    extractConstSource(source, "ZIP_NODE_SERVICE_PALETTE_HEX"),
    extractConstSource(source, "ZIP_WHITE_RGB_TRIPLET"),
    extractConstSource(source, "ZIP_BLACK_RGB_TRIPLET"),
    extractConstSource(source, "ZIP_NODE_TONE_CACHE"),
    extractFunctionSource(source, "esmWorkspaceHexToRgb"),
    extractFunctionSource(source, "zipNormalizeNodePaletteFamily"),
    extractFunctionSource(source, "zipResolveNodePaletteFamilyFromElement"),
    extractFunctionSource(source, "zipHashString"),
    extractFunctionSource(source, "esmWorkspaceGetSegmentColor"),
    extractFunctionSource(source, "zipClampRgbChannel"),
    extractFunctionSource(source, "zipMixRgbTriplets"),
    extractFunctionSource(source, "zipRgbTripletToCss"),
    extractFunctionSource(source, "zipResolveNodeToneSet"),
    extractFunctionSource(source, "esmWorkspaceApplyChipColor"),
    "module.exports = { ZIP_THEME_PALETTE_HEX, ZIP_NODE_SERVICE_PALETTE_HEX, esmWorkspaceGetSegmentColor, zipResolveNodeToneSet, esmWorkspaceApplyChipColor };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Map,
    Math,
    Number,
    String,
    Array,
  };
  vm.runInNewContext(script, context, { filename: POPUP_JS_PATH });
  return context.module.exports;
}

test("semantic JellyBean segments keep their assigned palette colors", () => {
  const helpers = loadJellybeanPaletteHelpers();

  assert.equal(helpers.esmWorkspaceGetSegmentColor("requestor-id", "esm"), helpers.ZIP_THEME_PALETTE_HEX.GOLD);
  assert.equal(helpers.esmWorkspaceGetSegmentColor("tenant", "cm"), helpers.ZIP_THEME_PALETTE_HEX.PURPLE);
  assert.equal(helpers.esmWorkspaceGetSegmentColor("api", "cm"), helpers.ZIP_THEME_PALETTE_HEX.INDIGO);
});

test("unknown JellyBean segments hash deterministically into per-service palettes", () => {
  const helpers = loadJellybeanPaletteHelpers();
  const segment = "audience-pod";
  const esmColor = helpers.esmWorkspaceGetSegmentColor(segment, "esm");
  const cmColor = helpers.esmWorkspaceGetSegmentColor(segment, "cm");

  assert.equal(esmColor, helpers.esmWorkspaceGetSegmentColor(segment, "esm"));
  assert.equal(cmColor, helpers.esmWorkspaceGetSegmentColor(segment, "cm"));
  assert.ok(helpers.ZIP_NODE_SERVICE_PALETTE_HEX.esm.includes(esmColor));
  assert.ok(helpers.ZIP_NODE_SERVICE_PALETTE_HEX.cm.includes(cmColor));
  assert.notEqual(esmColor, cmColor);
});

test("chip color application exports the new fill, border, ink, and glow variables", () => {
  const helpers = loadJellybeanPaletteHelpers();
  const applied = {};
  const chipElement = {
    style: {
      setProperty(name, value) {
        applied[name] = value;
      },
    },
    closest(selector) {
      if (selector === ".service-cm, .service-cm-mvpd") {
        return {};
      }
      return null;
    },
  };

  const expected = helpers.zipResolveNodeToneSet("audience-pod", "cm");
  helpers.esmWorkspaceApplyChipColor(chipElement, "audience-pod");

  assert.equal(applied["--esm-workspace-seg-fill-rgb"], expected.fillRgb);
  assert.equal(applied["--esm-workspace-seg-border-rgb"], expected.borderRgb);
  assert.equal(applied["--esm-workspace-seg-ink-rgb"], expected.inkRgb);
  assert.equal(applied["--esm-workspace-seg-shadow-rgb"], expected.shadowRgb);
  assert.equal(applied["--esm-workspace-seg-rest-rgb"], expected.restRgb);
  assert.equal(applied["--esm-workspace-seg-hot-rgb"], expected.hotRgb);
  assert.equal(applied["--esm-workspace-seg-active-rgb"], expected.activeRgb);
});
