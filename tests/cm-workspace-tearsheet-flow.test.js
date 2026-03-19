const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

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

function loadFunctions(relativePath, functionNames, globals = {}) {
  const source = read(relativePath);
  const script = [
    ...functionNames.map((name) => extractFunctionSource(source, name)),
    `module.exports = { ${functionNames.join(", ")} };`,
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Blob,
    ...globals,
  };
  vm.runInNewContext(script, context, { filename: path.join(ROOT, relativePath) });
  return context.module.exports;
}

test("CM workspace tearsheet button delegates export to the background make-clickcmuws action", async () => {
  const statusLog = [];
  let syncCount = 0;
  let actionCall = null;
  const els = {
    makeClickCmuWorkspaceButton: {
      disabled: false,
    },
  };
  const cards = [{ id: "card-1" }, { id: "card-2" }];
  const { makeClickCmuWorkspaceDownload } = loadFunctions("cm-workspace.js", ["makeClickCmuWorkspaceDownload"], {
    state: { cmAvailable: true },
    els,
    ensureWorkspaceUnlocked: () => true,
    setStatus: (message = "", type = "info") => {
      statusLog.push({ message, type });
    },
    getOrderedCardStates: () => cards,
    getCardPayload: (cardState) => ({ cardId: String(cardState.id || "") }),
    sendWorkspaceAction: async (action, payload) => {
      actionCall = { action, payload };
      return { ok: true, fileName: "Turner_clickCMUWS_release-production_1.html" };
    },
    syncActionButtonsDisabled: () => {
      syncCount += 1;
    },
  });

  await makeClickCmuWorkspaceDownload();

  assert.deepEqual(JSON.parse(JSON.stringify(actionCall)), {
    action: "make-clickcmuws",
    payload: {
      cards: [{ cardId: "card-1" }, { cardId: "card-2" }],
    },
  });
  assert.equal(els.makeClickCmuWorkspaceButton.disabled, true);
  assert.equal(syncCount, 1);
  assert.deepEqual(statusLog, [
    { message: "", type: "info" },
    { message: "clickCMUWS_TEARSHEET download started.", type: "info" },
  ]);
});

test("HTML tearsheet downloads flow through downloadBlobFile", async () => {
  let captured = null;
  const { downloadClickEsmHtmlFile } = loadFunctions("popup.js", ["downloadClickEsmHtmlFile"], {
    downloadBlobFile: async (blob, fileName) => {
      captured = { blob, fileName };
    },
  });

  await downloadClickEsmHtmlFile("<html><body>UnderPAR</body></html>", "underpar-test.html");

  assert.ok(captured);
  assert.equal(captured.fileName, "underpar-test.html");
  assert.equal(captured.blob.type, "text/html;charset=utf-8");
  assert.equal(await captured.blob.text(), "<html><body>UnderPAR</body></html>");
});

test("popup clickCMU workspace export awaits the hardened HTML download helper", () => {
  const popupSource = read("popup.js");

  assert.match(
    popupSource,
    /async function makeClickCmuWorkspaceDownload[\s\S]*?await downloadClickEsmHtmlFile\(downloadHtml, fileName\);/
  );
});
