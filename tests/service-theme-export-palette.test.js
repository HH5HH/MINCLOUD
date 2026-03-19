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
  assert.match(esmWorkspaceCss, /--workspace-header-action-size:\s*var\(--blondie-time-size\);/i);
  assert.match(upsWorkspaceCss, /color-scheme:\s*dark;/i);
  assert.match(upsWorkspaceCss, /--underpar-gold-base:\s*#f4ac10;/i);
  assert.match(upsWorkspaceCss, /--zip-accent-1000:\s*243,\s*117,\s*0;/);
  assert.match(upsWorkspaceCss, /--spectrum-gray-25-rgb:\s*11,\s*13,\s*16;/);
  assert.match(upsWorkspaceCss, /--legacy-bg:\s*var\(--spectrum-gray-25\);/);
  assert.match(upsWorkspaceCss, /--legacy-panel:\s*var\(--spectrum-gray-50\);/);
  assert.match(
    upsWorkspaceCss,
    /body\s*\{[\s\S]*?radial-gradient\(circle at 18% 8%,\s*rgba\(255,\s*193,\s*67,\s*0\.18\)\s*0%,\s*transparent 24%\)[\s\S]*?linear-gradient\(145deg,\s*#0f1319\s*0%,\s*#171c24\s*48%,\s*#202630\s*100%\);/i
  );
  assert.match(
    esmWorkspaceCss,
    /\.workspace-actions\s*>\s*\.workspace-icon-btn\s*\{[\s\S]*?width:\s*var\(--workspace-header-action-size\);[\s\S]*?height:\s*var\(--workspace-header-action-size\);/i
  );
  assert.match(
    esmWorkspaceCss,
    /\.workspace-actions\s*>\s*\.workspace-icon-btn\s*\.workspace-icon--rerun-glyph\s*\{[\s\S]*?font-size:\s*var\(--workspace-header-action-rerun-glyph-size\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-header\s*\{[\s\S]*?background:[\s\S]*?linear-gradient\(145deg,\s*rgba\(25,\s*29,\s*37,\s*0\.98\),\s*rgba\(16,\s*19,\s*24,\s*0\.96\)\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-blondie-time-picker\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(26,\s*31,\s*39,\s*0\.98\),\s*rgba\(14,\s*17,\s*22,\s*0\.98\)\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-icon-btn\s*\{[\s\S]*?background:\s*var\(--s2-action-bg-default\);[\s\S]*?box-shadow:\s*0 18px 30px rgba\(0,\s*0,\s*0,\s*0\.28\),\s*inset 0 1px 0 rgba\(255,\s*255,\s*255,\s*0\.08\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-icon-btn--rerun\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);[\s\S]*?color:\s*#231300;/i
  );
  assert.match(clickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(clickEsmTemplate, /function __normalizeTheme\(theme\)\s*\{\s*return theme === 'light' \? 'light' : 'dark';/);
  assert.match(clickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(clickEsmTemplate, /--click-url-rgb:243,\s*117,\s*0;/);
  assert.match(clickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(mirroredClickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(mirroredClickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(mirroredClickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(
    upsViewCss,
    /\.ups-utility-bar\s*\{[\s\S]*?border:\s*1px solid rgba\(255,\s*198,\s*78,\s*0\.14\);[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(27,\s*31,\s*39,\s*0\.98\)\s*0%,\s*rgba\(18,\s*22,\s*28,\s*0\.98\)\s*100%\);[\s\S]*?color:\s*rgba\(255,\s*210,\s*96,\s*0\.9\);/i
  );
  assert.match(upsViewCss, /\.ups-utility-link\s*\{[\s\S]*?color:\s*var\(--fg-primary,\s*rgb\(243,\s*117,\s*0\)\);/);
  assert.match(upsViewCss, /\.ibeta-report-scroll-shell\s*\{[\s\S]*overflow-x:\s*auto;[\s\S]*touch-action:\s*pan-x pan-y;/i);
  assert.match(upsViewCss, /\.ibeta-report-card\s*\{[\s\S]*width:\s*max-content;[\s\S]*min-width:\s*100%;/i);
  assert.match(megWorkspaceCss, /body\.meg-standalone-mode\[data-theme="modern"\]\s*\{[\s\S]*?color-scheme:\s*dark;/i);
  assert.match(megWorkspaceCss, /body\.meg-standalone-mode\[data-theme="modern"\]\s*\{[\s\S]*?--meg-link:\s*rgb\(255,\s*210,\s*87\);/i);
  assert.match(megWorkspaceCss, /body\.meg-standalone-mode\[data-theme="modern"\]\s*\{[\s\S]*?--meg-rerun-bg:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);[\s\S]*?--meg-rerun-text:\s*#231300;/i);
  assert.match(megWorkspaceCss, /a:hover\s*\{[\s\S]*?text-decoration:\s*underline;/i);
  assert.match(
    megWorkspaceCss,
    /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*(?:#171c24|rgb\(23,\s*28,\s*36\))\s*0%,\s*(?:#f4ac10|rgb\(244,\s*172,\s*16\))\s*100%\);/i
  );
  assert.match(
    megWorkspaceCss,
    /body\.meg-standalone-mode\[data-theme="modern"\] #btnSaveQuery,\s*body\.meg-standalone-mode\[data-theme="modern"\] \.meg-export-pack-button--modern\.meg-export-pack-button--icon\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);[\s\S]*?color:\s*#231300;/i
  );
  assert.match(
    megWorkspaceCss,
    /body\.meg-standalone-mode\[data-theme="retro"\]\s*\{[\s\S]*?--meg-button-border:\s*#000000;[\s\S]*?--meg-rerun-bg:\s*#efefef;[\s\S]*?--meg-rerun-text:\s*#000000;/i
  );
  assert.match(megWorkspaceJs, /applyTheme\(readStoredTheme\(\) \|\| "modern", \{ persist: false \}\);/);
  assert.match(blondieWorkspaceCss, /color-scheme:\s*dark;/i);
  assert.match(blondieWorkspaceCss, /--zip-accent-900:\s*224,\s*100,\s*0;/);
  assert.match(popupCss, /--s2-action-bg-accent:\s*var\(--underpar-gold-base\);/);
  assert.match(popupCss, /--service-esm-zip-800:\s*199,\s*82,\s*0;/);
  assert.match(popupCss, /\/\* MEGSPACE stays classic monochrome inside the embedded UnderPAR service launcher\. \*\//);
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-panel,\s*\.service-esm \.esm-workspace-meg-body\s*\{[\s\S]*?background:\s*#ffffff;[\s\S]*?box-shadow:\s*none;/i
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-open-btn\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*#f4f4f4\s*0%,\s*#c7c7c7\s*100%\);[\s\S]*?color:\s*#000000;/i
  );
  assert.match(esmWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-1000\);/);
  assert.match(upsWorkspaceCss, /--workspace-link-rgb:\s*var\(--zip-accent-1000\);/);
  assert.match(popupCss, /--service-link-rgb:\s*var\(--service-zip-1000\);/);
  assert.doesNotMatch(upsWorkspaceCss, /color-scheme:\s*light;/i);
  assert.doesNotMatch(
    upsWorkspaceCss,
    /\.workspace-header\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.98\)\s*0%,\s*rgba\(243,\s*243,\s*243,\s*0\.98\)\s*100%\);/i
  );
  assert.doesNotMatch(
    megWorkspaceCss,
    /body\.meg-standalone-mode\[data-theme="modern"\]\s*\{[\s\S]*?--meg-button-border:\s*#000000;[\s\S]*?--meg-rerun-bg:\s*linear-gradient\(180deg,\s*#f4f4f4\s*0%,\s*#c7c7c7\s*100%\);[\s\S]*?--meg-rerun-text:\s*#000000;/i
  );
  assert.doesNotMatch(
    megWorkspaceCss,
    /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*(?:#111111|rgb\(17,\s*17,\s*17\))\s*0%,\s*(?:#f4f4f4|rgb\(244,\s*244,\s*244\))\s*100%\);/i
  );

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

test("Popup and sidepanel share the gold-and-onyx shell while service palettes stay as accents", () => {
  const popupCss = read("popup.css");
  const popupHtml = read("popup.html");
  const sidepanelHtml = read("sidepanel.html");

  assert.match(popupCss, /--service-health-zip-500:\s*2,\s*87,\s*58;/);
  assert.match(popupCss, /--service-learning-zip-500:\s*26,\s*58,\s*195;/);
  assert.match(popupCss, /--service-esm-zip-800:\s*199,\s*82,\s*0;/);
  assert.match(popupCss, /--service-cm-zip-800:\s*157,\s*78,\s*228;/);
  assert.match(popupCss, /--service-degradation-zip-800:\s*223,\s*52,\s*34;/);
  assert.match(popupCss, /--s2-action-bg-accent:\s*var\(--underpar-gold-base\);/);
  assert.match(popupHtml, /<body class="underpar-up-tab">/i);
  assert.match(sidepanelHtml, /<body class="underpar-up-tab underpar-sidepanel">/i);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?color-scheme:\s*dark;/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--underpar-gray-25-rgb:\s*11,\s*13,\s*16;/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--legacy-accent:\s*var\(--underpar-gold-base\);/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--legacy-border:\s*rgba\(255,\s*198,\s*78,\s*0\.16\);/);
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.header\s*\{[\s\S]*?background:[\s\S]*?linear-gradient\(145deg,\s*rgba\(25,\s*29,\s*37,\s*0\.98\),\s*rgba\(16,\s*19,\s*24,\s*0\.96\)\);/
  );
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.app-shell-card\s*\{[\s\S]*?linear-gradient\(145deg,\s*rgba\(18,\s*22,\s*28,\s*0\.98\),\s*rgba\(32,\s*38,\s*48,\s*0\.96\)\);/
  );
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.sign-in-hero-btn\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);/
  );
  assert.match(
    popupCss,
    /\.sign-in-view\s*\{[\s\S]*?display:\s*flex;[\s\S]*?justify-content:\s*flex-start;[\s\S]*?padding-top:\s*4px;/
  );
  assert.doesNotMatch(popupCss, /\.sign-in-view-card\s*\{/);
  assert.match(
    popupCss,
    /body\.underpar-sidepanel \.surface--debug\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?inset-inline-end:\s*16px;[\s\S]*?inset-block-end:\s*16px;/
  );
  assert.match(popupCss, /\.surface--debug\.is-collapsed \.debug-body\s*\{\s*display:\s*none;\s*\}/);
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.workflow > \.field\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(24,\s*28,\s*35,\s*0\.98\),\s*rgba\(15,\s*18,\s*24,\s*0\.98\)\);/
  );
  assert.match(popupCss, /\.premium-service-section,\s*\.hr-context-section\s*\{[\s\S]*?color-scheme:\s*dark;/);
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.premium-service-section,\s*body\.underpar-up-tab \.hr-context-section\s*\{[\s\S]*?color-scheme:\s*dark;[\s\S]*?--underpar-service-dark-panel-rgb:\s*13,\s*16,\s*20;/
  );
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.premium-service-section::after,\s*body\.underpar-up-tab \.hr-context-section::after\s*\{[\s\S]*?repeating-linear-gradient/
  );
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.premium-service-section \.metadata-header\.service-box-header::before,\s*body\.underpar-up-tab \.hr-context-section \.metadata-header\.service-box-header::before\s*\{[\s\S]*?width:\s*6px;[\s\S]*?box-shadow:\s*10px 0 0 rgba\(var\(--service-zip-1100\),\s*0\.14\);/
  );
  assert.doesNotMatch(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?color-scheme:\s*light;/);
  assert.doesNotMatch(
    popupCss,
    /body\.underpar-up-tab \.header\s*\{[\s\S]*?linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.98\)\s*0%,\s*rgba\(243,\s*243,\s*243,\s*0\.98\)\s*100%\);/
  );
  assert.match(
    popupCss,
    /\.service-esm :is\(\.esm-workspace-search, \.esm-workspace-zoom-filter, \.esm-workspace-meg-select, \.esm-workspace-meg-saved-select\) \{[\s\S]*?background:\s*var\(--service-input-bg\);/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-panel \{[\s\S]*?border:\s*2px solid #000000;[\s\S]*?border-radius:\s*0;/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-body \{[\s\S]*?border-top:\s*2px solid #000000;/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-select,\s*\.service-esm \.esm-workspace-meg-saved-select \{[\s\S]*?border:\s*1px solid #000000;[\s\S]*?border-radius:\s*0;[\s\S]*?background:\s*#ffffff;[\s\S]*?color:\s*#000000;/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-open-btn \{[\s\S]*?border:\s*1px solid #000000;[\s\S]*?border-radius:\s*0;[\s\S]*?background:\s*linear-gradient\(180deg,\s*#f4f4f4\s*0%,\s*#c7c7c7\s*100%\);[\s\S]*?color:\s*#000000;/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-toggle:focus-visible,\s*\.service-esm \.esm-workspace-meg-select:focus-visible,\s*\.service-esm \.esm-workspace-meg-saved-select:focus-visible,\s*\.service-esm \.esm-workspace-meg-open-btn:focus-visible \{[\s\S]*?outline:\s*2px solid #000000;[\s\S]*?outline-offset:\s*2px;/
  );
});

test("ESM and CMU JellyBeans use vibrant onyx pills with shared service racing stripes", () => {
  const popupCss = read("popup.css");

  assert.match(
    popupCss,
    /\.esm-workspace-label\s*\{[\s\S]*?--esm-workspace-chip-service-rgb:\s*255,\s*198,\s*78;[\s\S]*?background:\s*linear-gradient\(165deg,\s*rgba\(31,\s*36,\s*44,\s*0\.98\),\s*rgba\(14,\s*17,\s*22,\s*0\.98\)\s*62%,\s*rgba\(9,\s*11,\s*14,\s*0\.98\)\s*100%\);[\s\S]*?inset 3px 0 0 rgba\(var\(--esm-workspace-chip-service-rgb\),\s*0\.12\)/i
  );
  assert.match(
    popupCss,
    /\.esm-workspace-chip\s*\{[\s\S]*?--esm-workspace-seg-fill-rgb:\s*124,\s*136,\s*153;[\s\S]*?--esm-workspace-seg-border-rgb:\s*190,\s*199,\s*211;[\s\S]*?background:\s*linear-gradient\(\s*140deg,\s*rgba\(var\(--esm-workspace-seg-fill-rgb\),\s*0\.42\),[\s\S]*?rgba\(16,\s*19,\s*24,\s*0\.98\)\s*100%\s*\);[\s\S]*?rgba\(var\(--esm-workspace-chip-service-rgb\),\s*0\.1\);/i
  );
  assert.match(
    popupCss,
    /\.esm-workspace-chip::before\s*\{[\s\S]*?width:\s*3px;[\s\S]*?rgba\(var\(--esm-workspace-chip-service-rgb\),\s*0\.9\),\s*rgba\(var\(--esm-workspace-chip-service-rgb\),\s*0\.18\)/i
  );
  assert.match(
    popupCss,
    /:is\(\.service-esm,\s*\.service-cm,\s*\.service-cm-mvpd\)\s+\.esm-workspace-tree-scroll\s*\{[\s\S]*?border-color:\s*rgba\(var\(--service-zip-1100\),\s*0\.2\);[\s\S]*?rgb\(var\(--underpar-service-dark-panel-rgb\)\)\s*92%,\s*rgb\(var\(--service-zip-1000\)\)\s*8%/i
  );
  assert.match(
    popupCss,
    /:is\(\.service-esm,\s*\.service-cm,\s*\.service-cm-mvpd\)\s+\.esm-workspace-chip\s*\{[\s\S]*?--esm-workspace-chip-service-rgb:\s*var\(--service-zip-1000\);/i
  );
  assert.match(
    popupCss,
    /:is\(\.service-esm,\s*\.service-cm,\s*\.service-cm-mvpd\)\s+\.esm-workspace-chip mark\s*\{[\s\S]*?color-mix\(in srgb,\s*rgb\(var\(--service-zip-1000\)\)\s*34%,\s*var\(--underpar-gold-base\)\s*66%\)/i
  );
  assert.match(
    popupCss,
    /:is\(\.service-esm,\s*\.service-cm,\s*\.service-cm-mvpd\)\s+\.esm-workspace-label\.esm-workspace-col-match\s*\{[\s\S]*?inset 4px 0 0 rgba\(var\(--service-zip-1000\),\s*0\.32\)/i
  );
});

test("BT monitoring session summary uses the dark orange workspace palette", () => {
  const blondieWorkspaceCss = read("blondie-time-workspace.css");

  assert.match(
    blondieWorkspaceCss,
    /\.bt-monitoring-stop-zone\s*\{[\s\S]*?border:\s*1px solid var\(--bt-line-strong\);[\s\S]*?rgba\(var\(--zip-accent-1000\),\s*0\.18\)[\s\S]*?linear-gradient\(180deg,\s*rgba\(44,\s*44,\s*44,\s*0\.96\),\s*rgba\(27,\s*27,\s*27,\s*0\.98\)\);/
  );
  assert.match(
    blondieWorkspaceCss,
    /\.bt-action-btn,\s*\.bt-export-btn\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(44,\s*44,\s*44,\s*0\.98\),\s*rgba\(27,\s*27,\s*27,\s*0\.98\)\);/
  );
  assert.match(
    blondieWorkspaceCss,
    /\.bt-table-scroll\s*\{[\s\S]*?background:\s*var\(--bt-panel-muted\);/
  );
  assert.match(
    blondieWorkspaceCss,
    /\.bt-table thead th\s*\{[\s\S]*?background:\s*var\(--bt-band\);[\s\S]*?color:\s*var\(--bt-ink\);/
  );
  assert.match(
    blondieWorkspaceCss,
    /\.bt-session-block\s*\{[\s\S]*?border:\s*1px solid rgba\(var\(--zip-accent-1000\),\s*0\.18\);[\s\S]*?linear-gradient\(180deg,\s*rgba\(44,\s*44,\s*44,\s*0\.96\),\s*rgba\(27,\s*27,\s*27,\s*0\.98\)\);/
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

test("UP devtools panel uses ZIP dark obsidian while preserving the Slacktivate gate", () => {
  const upDevtoolsCss = read("up-devtools-panel.css");

  assert.match(upDevtoolsCss, /--up-obsidian:\s*#0B0B0B;/);
  assert.match(upDevtoolsCss, /--up-payne-gray:\s*#5C677D;/);
  assert.match(upDevtoolsCss, /--up-gray-300-rgb:\s*57,\s*57,\s*57;/);
  assert.match(upDevtoolsCss, /--up-bg-deep:\s*#050505;/);
  assert.match(
    upDevtoolsCss,
    /body\s*\{[\s\S]*?linear-gradient\(180deg,\s*var\(--up-obsidian\)\s*0%,\s*rgb\(var\(--up-gray-25-rgb\)\)\s*42%,\s*rgb\(var\(--up-gray-50-rgb\)\)\s*78%,\s*var\(--up-bg-deep\)\s*100%\);/i
  );
  assert.match(
    upDevtoolsCss,
    /\.switch-btn\s*\{[\s\S]*?background:\s*var\(--up-button-gradient\);[\s\S]*?color:\s*#ffffff;/i
  );
  assert.match(
    upDevtoolsCss,
    /\.context-row dd a,\s*\.vault-entry-preview a,\s*\.vault-raw-json a\s*\{[\s\S]*?color:\s*var\(--up-link\);/i
  );
  assert.match(upDevtoolsCss, /\.zip-config-gate\s*\{[\s\S]*?border:\s*1px solid #000;[\s\S]*?background:\s*#fff;/i);
  assert.match(
    upDevtoolsCss,
    /\.vault-slacktivate-state\[data-state="pending"\] \.zip-config-gate\s*\{[\s\S]*?border:\s*4px solid #000;[\s\S]*?background:\s*#fff;/i
  );
  assert.match(
    upDevtoolsCss,
    /\.zip-config-dropzone\s*\{[\s\S]*?border-color:\s*#000;[\s\S]*?background:\s*#fff;[\s\S]*?color:\s*#000;/i
  );
  assert.doesNotMatch(
    upDevtoolsCss,
    /#1b1307|#0d0904|#ffc736|#ffd978|#ffe7a5|255,\s*199,\s*54|255,\s*211,\s*102|255,\s*203,\s*72|255,\s*190,\s*76|255,\s*214,\s*112|255,\s*219,\s*130|255,\s*205,\s*98|255,\s*186,\s*72|255,\s*220,\s*138|255,\s*198,\s*62/i
  );
});
