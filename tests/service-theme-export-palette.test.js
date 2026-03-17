const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("ESM export surfaces use the orange service palette", () => {
  const esmWorkspaceCss = read("esm-workspace.css");
  const upsWorkspaceCss = read("ups/esm-workspace.css");
  const clickEsmTemplate = read("clickESM-template.html");
  const upsViewCss = read("ups/view.css");
  const megWorkspaceCss = read("meg-workspace.css");

  assert.match(esmWorkspaceCss, /--legacy-accent:\s*#c24e00;/i);
  assert.match(upsWorkspaceCss, /--legacy-accent:\s*#c24e00;/i);
  assert.match(clickEsmTemplate, /--zip-accent-500:255,\s*162,\s*19;/);
  assert.match(clickEsmTemplate, /--reset-bg:#C24E00;/);
  assert.match(clickEsmTemplate, /--click-url-rgb:243,\s*117,\s*0;/);
  assert.match(upsViewCss, /\.ups-utility-link\s*\{[\s\S]*?color:\s*#c24e00;/);
  assert.match(megWorkspaceCss, /--meg-focus:\s*#c24e00;/i);
  assert.match(megWorkspaceCss, /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*#c24e00 0%,\s*#ffa213 100%\);/i);

  [
    esmWorkspaceCss,
    upsWorkspaceCss,
    clickEsmTemplate,
    upsViewCss,
    megWorkspaceCss,
  ].forEach((source) => {
    assert.doesNotMatch(source, /#0064e0|#004daf|0,\s*100,\s*224|0,\s*77,\s*175/i);
  });
});

test("CM export surfaces use the purple service palette", () => {
  const cmWorkspaceCss = read("cm-workspace.css");
  const mvpdWorkspaceCss = read("mvpd-workspace.css");
  const clickCmuTemplate = read("clickCMU-template.html");
  const popupSource = read("popup.js");

  assert.match(cmWorkspaceCss, /--legacy-accent:\s*#9a47e2;/i);
  assert.match(mvpdWorkspaceCss, /--zip-accent-500:\s*107,\s*6,\s*195;/);
  assert.match(mvpdWorkspaceCss, /force purple readability/i);
  assert.match(clickCmuTemplate, /--accent:\s*#9a47e2;/i);
  assert.match(popupSource, /--zip-accent-500:208,\s*167,\s*243;/);
  assert.match(popupSource, /themePreset:\s*"purple"/);
  assert.match(popupSource, /normalizedThemePreset !== "purple" && normalizedThemePreset !== "sunflower"/);

  [cmWorkspaceCss, mvpdWorkspaceCss, clickCmuTemplate].forEach((source) => {
    assert.doesNotMatch(source, /#408111|#346d0c|#90e752|#2a8b74|#1d6252|Sunflower/i);
  });
});
