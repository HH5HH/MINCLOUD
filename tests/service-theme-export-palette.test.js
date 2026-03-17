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
  assert.match(upsWorkspaceCss, /--underpar-payne-gray:\s*#5C677D;/i);
  assert.match(upsWorkspaceCss, /--zip-accent-1000:\s*243,\s*117,\s*0;/);
  assert.match(upsWorkspaceCss, /--spectrum-gray-25-rgb:\s*255,\s*255,\s*255;/);
  assert.match(upsWorkspaceCss, /--legacy-bg:\s*var\(--spectrum-gray-25\);/);
  assert.match(upsWorkspaceCss, /--legacy-panel:\s*var\(--spectrum-gray-25\);/);
  assert.match(
    upsWorkspaceCss,
    /body\s*\{[\s\S]*?radial-gradient\(120% 76% at 0% 0%,\s*rgba\(var\(--underpar-payne-gray-rgb\),\s*0\.12\)\s*0%,\s*transparent 46%\)[\s\S]*?linear-gradient\(180deg,\s*var\(--spectrum-gray-25\)\s*0%,\s*var\(--spectrum-gray-50\)\s*58%,\s*var\(--spectrum-gray-75\)\s*100%\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-header\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.98\)\s*0%,\s*rgba\(243,\s*243,\s*243,\s*0\.98\)\s*100%\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-blondie-time-picker\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.98\),\s*rgba\(243,\s*243,\s*243,\s*0\.98\)\);/i
  );
  assert.match(
    upsWorkspaceCss,
    /\.workspace-icon-btn\s*\{[\s\S]*?background:\s*var\(--s2-action-bg-default\);[\s\S]*?box-shadow:\s*0 6px 12px rgba\(17,\s*17,\s*17,\s*0\.08\);/i
  );
  assert.match(clickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(clickEsmTemplate, /function __normalizeTheme\(theme\)\s*\{\s*return theme === 'light' \? 'light' : 'dark';/);
  assert.match(clickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(clickEsmTemplate, /--click-url-rgb:243,\s*117,\s*0;/);
  assert.match(clickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(mirroredClickEsmTemplate, /<body data-theme="dark">/i);
  assert.match(mirroredClickEsmTemplate, /--zip-accent-900:224,\s*100,\s*0;/);
  assert.match(mirroredClickEsmTemplate, /--fg-primary:var\(--spectrum-text-color-link\);/);
  assert.match(upsViewCss, /\.ups-utility-bar\s*\{[\s\S]*?color:\s*rgba\(82,\s*82,\s*82,\s*0\.86\);/i);
  assert.match(upsViewCss, /\.ups-utility-link\s*\{[\s\S]*?color:\s*var\(--fg-primary,\s*rgb\(243,\s*117,\s*0\)\);/);
  assert.match(upsViewCss, /\.ibeta-report-scroll-shell\s*\{[\s\S]*overflow-x:\s*auto;[\s\S]*touch-action:\s*pan-x pan-y;/i);
  assert.match(upsViewCss, /\.ibeta-report-card\s*\{[\s\S]*width:\s*max-content;[\s\S]*min-width:\s*100%;/i);
  assert.match(megWorkspaceCss, /--meg-focus:\s*rgb\(224,\s*100,\s*0\);/i);
  assert.match(megWorkspaceCss, /--meg-saved-query-accent:\s*rgb\(243,\s*117,\s*0\);/i);
  assert.match(megWorkspaceCss, /a:hover\s*\{[\s\S]*?text-decoration:\s*underline;/i);
  assert.match(
    megWorkspaceCss,
    /--meg-theme-preview-modern:\s*linear-gradient\(180deg,\s*rgb\(92,\s*103,\s*125\)\s*0%,\s*rgb\(17,\s*17,\s*17\)\s*100%\);/i
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

test("Popup UP tab shifts to light obsidian while the sidepanel keeps the gold shell", () => {
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
  assert.doesNotMatch(sidepanelHtml, /underpar-up-tab/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?color-scheme:\s*light;/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--underpar-gray-25-rgb:\s*255,\s*255,\s*255;/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--legacy-accent:\s*var\(--underpar-payne-gray\);/);
  assert.match(popupCss, /body\.underpar-up-tab\s*\{[\s\S]*?--legacy-border:\s*rgb\(var\(--underpar-gray-300-rgb\)\);/);
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.header\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.98\)\s*0%,\s*rgba\(243,\s*243,\s*243,\s*0\.98\)\s*100%\);/
  );
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.sign-in-hero-btn\s*\{[\s\S]*?background:\s*var\(--s2-action-bg-accent\);/
  );
  assert.match(popupCss, /\.premium-service-section,\s*\.hr-context-section\s*\{[\s\S]*?color-scheme:\s*dark;/);
  assert.match(
    popupCss,
    /body\.underpar-up-tab \.premium-service-section,\s*body\.underpar-up-tab \.hr-context-section\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?--underpar-service-dark-panel-rgb:\s*255,\s*255,\s*255;/
  );
  assert.match(
    popupCss,
    /\.service-esm :is\(\.esm-workspace-search, \.esm-workspace-zoom-filter, \.esm-workspace-meg-select, \.esm-workspace-meg-saved-select\) \{[\s\S]*?background:\s*var\(--service-input-bg\);/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-select,\s*\.service-esm \.esm-workspace-meg-saved-select \{[\s\S]*?background:\s*#ffffff;[\s\S]*?color:\s*#000;/
  );
  assert.match(
    popupCss,
    /\.service-esm \.esm-workspace-meg-open-btn \{[\s\S]*?background:\s*#000;[\s\S]*?color:\s*#ffffff;/
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
