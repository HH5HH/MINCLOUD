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
  const mirroredClickEsmTemplate = read("scripts/clickESM.html");
  const upsViewCss = read("ups/view.css");
  const megWorkspaceCss = read("meg-workspace.css");
  const blondieWorkspaceCss = read("blondie-time-workspace.css");
  const popupCss = read("popup.css");

  assert.match(esmWorkspaceCss, /--legacy-accent:\s*#c24e00;/i);
  assert.match(upsWorkspaceCss, /--legacy-accent:\s*#c24e00;/i);
  assert.match(clickEsmTemplate, /--zip-accent-500:255,\s*162,\s*19;/);
  assert.match(mirroredClickEsmTemplate, /--zip-accent-500:255,\s*162,\s*19;/);
  assert.match(clickEsmTemplate, /--reset-bg:#C24E00;/);
  assert.match(clickEsmTemplate, /--click-url-rgb:243,\s*117,\s*0;/);
  assert.match(upsViewCss, /\.ups-utility-link\s*\{[\s\S]*?color:\s*#c24e00;/);
  assert.match(megWorkspaceCss, /--meg-focus:\s*#c24e00;/i);
  assert.match(megWorkspaceCss, /--meg-saved-query-accent:\s*#c24e00;/i);
  assert.match(megWorkspaceCss, /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*#c24e00 0%,\s*#ffa213 100%\);/i);
  assert.match(blondieWorkspaceCss, /--bt-accent:\s*#c24e00;/i);
  assert.match(blondieWorkspaceCss, /--zip-accent-900:\s*194,\s*78,\s*0;/);
  assert.match(popupCss, /--s2-action-bg-accent:\s*var\(--underpar-gold-base\);/);

  [
    esmWorkspaceCss,
    upsWorkspaceCss,
    clickEsmTemplate,
    mirroredClickEsmTemplate,
    upsViewCss,
    megWorkspaceCss,
    blondieWorkspaceCss,
    popupCss,
  ].forEach((source) => {
    assert.doesNotMatch(source, /#0064e0|#004daf|0,\s*100,\s*224|0,\s*77,\s*175/i);
  });

  [
    esmWorkspaceCss,
    upsWorkspaceCss,
    clickEsmTemplate,
    mirroredClickEsmTemplate,
    megWorkspaceCss,
    blondieWorkspaceCss,
  ].forEach((source) => {
    assert.doesNotMatch(
      source,
      /#107985|#0d5b73|16,\s*121,\s*133|13,\s*91,\s*115|96,\s*202,\s*242|171,\s*219,\s*68|165,\s*214,\s*58|145,\s*194,\s*45|96,\s*143,\s*28|82,\s*127,\s*24|Capri/i
    );
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
  assert.doesNotMatch(popupSource, /sunflower/i);

  [cmWorkspaceCss, mvpdWorkspaceCss, clickCmuTemplate].forEach((source) => {
    assert.doesNotMatch(source, /#408111|#346d0c|#90e752|#2a8b74|#1d6252|Sunflower|#20498f/i);
  });
});

test("Degradation workspace surfaces stay on the red palette", () => {
  const degradationWorkspaceCss = read("degradation-workspace.css");

  assert.match(degradationWorkspaceCss, /--zip-accent-900:\s*153,\s*31,\s*31;/);
  assert.match(
    degradationWorkspaceCss,
    /--underpar-blondie-share-dialog-background:\s*linear-gradient\(180deg,\s*rgba\(64,\s*12,\s*12,\s*0\.98\),\s*rgba\(32,\s*8,\s*8,\s*0\.98\)\);/
  );
  assert.doesNotMatch(
    degradationWorkspaceCss,
    /rgba\(13,\s*25,\s*45|rgba\(24,\s*54,\s*97|79,\s*138,\s*255|122,\s*174,\s*255|255,\s*78,\s*135|76,\s*174,\s*255/i
  );
});
