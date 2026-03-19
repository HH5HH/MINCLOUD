const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(ROOT, "meg-workspace.css"), "utf8");

test("embedded MEG workspace stays monochrome while MEG save actions remain gold", () => {
  assert.match(
    css,
    /:root\s*\{[\s\S]*?color-scheme:\s*light;[\s\S]*?--meg-rerun-bg:\s*linear-gradient\(180deg,\s*#f4f4f4\s*0%,\s*#c7c7c7\s*100%\);[\s\S]*?--meg-rerun-text:\s*#000000;[\s\S]*?--meg-row-hover-accent:\s*#111111;[\s\S]*?--meg-row-hover-text:\s*#ffffff;/i
  );
  assert.match(
    css,
    /body:not\(\.meg-standalone-mode\) #btnSaveQuery\s*\{[\s\S]*?background:\s*var\(--meg-save-button-bg\);[\s\S]*?color:\s*var\(--meg-save-button-text\);/i
  );
  assert.match(
    css,
    /body:not\(\.meg-standalone-mode\) \.meg-export-pack-button--modern\.meg-export-pack-button--icon\s*\{[\s\S]*?background:\s*var\(--meg-save-button-bg\);[\s\S]*?color:\s*var\(--meg-save-button-text\);/i
  );
  assert.match(
    css,
    /body:not\(\.meg-standalone-mode\) #meg-modern-shell #RAW_TBL tbody tr:hover\s*\{[\s\S]*?background-color:\s*var\(--meg-row-hover-accent\);[\s\S]*?color:\s*var\(--meg-row-hover-text\);/i
  );
  assert.doesNotMatch(
    css,
    /body:not\(\.meg-standalone-mode\) #meg-modern-shell #DD_TBL tbody tr:hover/i
  );
  assert.doesNotMatch(
    css,
    /body:not\(\.meg-standalone-mode\) \.meg-export-pack-button--modern\s*\{[\s\S]*?background:\s*var\(--meg-save-button-bg\);/i
  );
  assert.doesNotMatch(css, /:root,\s*body\.meg-standalone-mode\[data-theme="modern"\]/i);
});

test("standalone MEG themes retain their dedicated retro and modern palettes", () => {
  assert.match(
    css,
    /body\.meg-standalone-mode\[data-theme="retro"\]\s*\{[\s\S]*?--meg-rerun-bg:\s*#efefef;[\s\S]*?--meg-row-hover-accent:\s*#fff0df;/i
  );
  assert.match(
    css,
    /body\.meg-standalone-mode\[data-theme="modern"\]\s*\{[\s\S]*?color-scheme:\s*dark;[\s\S]*?--meg-rerun-bg:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);/i
  );
  assert.match(
    css,
    /body\.meg-standalone-mode\[data-theme="modern"\] #btnSaveQuery,\s*body\.meg-standalone-mode\[data-theme="modern"\] \.meg-export-pack-button--modern\.meg-export-pack-button--icon\s*\{[\s\S]*?background:\s*linear-gradient\(180deg,\s*#ffd257\s*0%,\s*#f4ac10\s*100%\);/i
  );
});
