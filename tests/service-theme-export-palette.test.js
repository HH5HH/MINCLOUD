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
  const megWorkspaceJs = read("meg-workspace.js");
  const blondieWorkspaceCss = read("blondie-time-workspace.css");
  const popupCss = read("popup.css");

  assert.match(esmWorkspaceCss, /color-scheme:\s*dark;/i);
  assert.match(esmWorkspaceCss, /--zip-accent-800:\s*199,\s*82,\s*0;/);
  assert.match(upsWorkspaceCss, /color-scheme:\s*light;/i);
  assert.match(upsWorkspaceCss, /--zip-accent-1000:\s*243,\s*117,\s*0;/);
  assert.match(upsWorkspaceCss, /--spectrum-gray-25-rgb:\s*255,\s*255,\s*255;/);
  assert.match(upsWorkspaceCss, /--legacy-bg:\s*var\(--spectrum-gray-25\);/);
  assert.match(clickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(clickEsmTemplate, /function __normalizeTheme\(theme\)\s*\{\s*return theme === 'light' \? 'light' : 'dark';/);
  assert.match(clickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(clickEsmTemplate, /--click-url-rgb:243,\s*117,\s*0;/);
  assert.match(clickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(mirroredClickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(mirroredClickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(mirroredClickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(upsViewCss, /\.ups-utility-link\s*\{[\s\S]*?color:\s*var\(--fg-primary,\s*rgb\(243,\s*117,\s*0\)\);/);
  assert.match(upsViewCss, /\.ibeta-app,[\s\S]*\.ibeta-stage,[\s\S]*\.ups-shell,[\s\S]*width:\s*max-content;/i);
  assert.match(megWorkspaceCss, /--meg-focus:\s*rgb\(224,\s*100,\s*0\);/i);
  assert.match(megWorkspaceCss, /--meg-saved-query-accent:\s*rgb\(243,\s*117,\s*0\);/i);
  assert.match(megWorkspaceCss, /a:hover\s*\{[\s\S]*?text-decoration:\s*underline;/i);
  assert.match(
    megWorkspaceCss,
    /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*rgb\(199,\s*82,\s*0\)\s*0%,\s*rgb\(243,\s*117,\s*0\)\s*100%\);/i
  );
  assert.match(megWorkspaceJs, /applyTheme\(readStoredTheme\(\) \|\| "modern", \{ persist: false \}\);/);
  assert.match(blondieWorkspaceCss, /color-scheme:\s*dark;/i);
  assert.match(blondieWorkspaceCss, /--zip-accent-900:\s*224,\s*100,\s*0;/);
  assert.match(popupCss, /--s2-action-bg-accent:\s*var\(--underpar-gold-base\);/);
  assert.match(popupCss, /--service-esm-zip-800:\s*199,\s*82,\s*0;/);
  assert.match(esmWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-1000\);/);
  assert.match(upsWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-900\);/);
  assert.match(popupCss, /--service-link-rgb:\s*var\(--service-zip-1000\);/);

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

  assert.match(cmWorkspaceCss, /color-scheme:\s*dark;/i);
  assert.match(cmWorkspaceCss, /--zip-accent-800:\s*157,\s*78,\s*228;/);
  assert.match(mvpdWorkspaceCss, /--zip-accent-800:\s*157,\s*78,\s*228;/);
  assert.match(mvpdWorkspaceCss, /force purple readability/i);
  assert.match(clickCmuTemplate, /color-scheme:\s*dark;/i);
  assert.match(clickCmuTemplate, /--accent-900-rgb:\s*173,\s*105,\s*233;/);
  assert.match(clickCmuTemplate, /--fg-primary:\s*var\(--spectrum-text-color-link\);/);
  assert.match(cmWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-1000\);/);
  assert.match(mvpdWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-1000\);/);
  assert.match(popupSource, /--zip-accent-500":\s*"107,\s*6,\s*195"/);
  assert.match(popupSource, /--zip-accent-800":\s*"157,\s*78,\s*228"/);
  assert.match(popupSource, /--fg-primary":\s*"rgb\(186,\s*127,\s*237\)"/);
  assert.match(popupSource, /themePreset:\s*"purple"/);
  assert.doesNotMatch(popupSource, /sunflower/i);

  [cmWorkspaceCss, mvpdWorkspaceCss, clickCmuTemplate].forEach((source) => {
    assert.doesNotMatch(source, /#408111|#346d0c|#90e752|#2a8b74|#1d6252|Sunflower|#20498f/i);
  });
});

test("Popup service containers use ZIP dark service ramps while keeping the gold shell", () => {
  const popupCss = read("popup.css");

  assert.match(popupCss, /--service-health-zip-500:\s*2,\s*87,\s*58;/);
  assert.match(popupCss, /--service-learning-zip-500:\s*26,\s*58,\s*195;/);
  assert.match(popupCss, /--service-esm-zip-800:\s*199,\s*82,\s*0;/);
  assert.match(popupCss, /--service-cm-zip-800:\s*157,\s*78,\s*228;/);
  assert.match(popupCss, /--service-degradation-zip-800:\s*223,\s*52,\s*34;/);
  assert.match(popupCss, /--s2-action-bg-accent:\s*var\(--underpar-gold-base\);/);
  assert.match(popupCss, /\.premium-service-section,\s*\.hr-context-section\s*\{[\s\S]*?color-scheme:\s*dark;/);
  assert.match(
    popupCss,
    /\.service-esm :is\(\.esm-workspace-search, \.esm-workspace-zoom-filter, \.esm-workspace-meg-select, \.esm-workspace-meg-saved-select\) \{[\s\S]*?background:\s*var\(--service-input-bg\);/
  );
});

test("VCR controls keep universal green-start and red-stop semantics", () => {
  const popupCss = read("popup.css");
  const esmWorkspaceCss = read("esm-workspace.css");
  const upsWorkspaceCss = read("ups/esm-workspace.css");
  const blondieWorkspaceCss = read("blondie-time-workspace.css");

  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-record-toggle-btn \{[\s\S]*?background:\s*linear-gradient\(160deg,\s*rgb\(var\(--underpar-success-700\)\),\s*rgb\(var\(--underpar-success-900\)\)\);/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-record-toggle-btn\.is-recording,\s*\.degradation-record-toggle-btn\.is-recording \{[\s\S]*?background:\s*linear-gradient\(160deg,\s*rgb\(var\(--underpar-danger-700\)\),\s*rgb\(var\(--underpar-danger-900\)\)\);/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-record-btn-icon--record,\s*\.degradation-record-btn-icon--record \{[\s\S]*?background:\s*rgb\(var\(--underpar-danger-1000\)\);/
  );

  [esmWorkspaceCss, upsWorkspaceCss].forEach((source) => {
    assert.match(source, /--vcr-stop-600:\s*177,\s*38,\s*23;/);
    assert.match(source, /\.workspace-blondie-time-stop \{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(var\(--vcr-stop-600\),\s*0\.98\),\s*rgba\(var\(--vcr-stop-300\),\s*0\.98\)\);/);
    assert.match(source, /\.workspace-blondie-time-stop \{[\s\S]*?color:\s*#fff7f1;/);
  });

  assert.match(blondieWorkspaceCss, /--bt-vcr-stop-600:\s*177,\s*38,\s*23;/);
  assert.match(
    blondieWorkspaceCss,
    /\.workspace-blondie-time-stop \{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(var\(--bt-vcr-stop-600\),\s*0\.98\),\s*rgba\(var\(--bt-vcr-stop-300\),\s*0\.98\)\);/
  );
  assert.match(blondieWorkspaceCss, /\.workspace-blondie-time-stop \{[\s\S]*?color:\s*#fff;/);
});

test("Degradation workspace surfaces stay on the red palette", () => {
  const degradationWorkspaceCss = read("degradation-workspace.css");

  assert.match(degradationWorkspaceCss, /--zip-accent-900:\s*252,\s*67,\s*46;/);
  assert.match(
    degradationWorkspaceCss,
    /--underpar-blondie-share-dialog-background:\s*linear-gradient\(180deg,\s*rgba\(64,\s*12,\s*12,\s*0\.98\),\s*rgba\(32,\s*8,\s*8,\s*0\.98\)\);/
  );
  assert.doesNotMatch(
    degradationWorkspaceCss,
    /rgba\(13,\s*25,\s*45|rgba\(24,\s*54,\s*97|79,\s*138,\s*255|122,\s*174,\s*255|255,\s*78,\s*135|76,\s*174,\s*255/i
  );
});

test("UPSpace launch labels stay ASCII badges", () => {
  const popupSource = read("popup.js");
  const upsViewSource = read("ups/view.js");

  assert.match(popupSource, /const UNDERPAR_UPSPACE_SLACK_LINK_LABEL = "\[ \^ \]";/);
  assert.doesNotMatch(popupSource, /const UNDERPAR_UPSPACE_SLACK_LINK_LABEL = "in UPSpace";/);
  assert.doesNotMatch(popupSource, /const UNDERPAR_UPSPACE_SLACK_LINK_LABEL = "↗";/);
  assert.match(upsViewSource, />zip-zap<\/a>/);
  assert.match(upsViewSource, />print<\/a>/);
  assert.doesNotMatch(upsViewSource, /🛰️|🖨️|↗/);
});
