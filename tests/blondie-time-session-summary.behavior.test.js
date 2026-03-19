const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const FILE_PATH = path.join(ROOT, "blondie-time-workspace.js");

function extractFunctionSource(source, functionName) {
  const marker = "function " + functionName + "(";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, "Unable to locate " + functionName + " in blondie-time-workspace.js");
  const bodyStart = source.indexOf("{", start);
  assert.notEqual(bodyStart, -1, "Unable to locate body for " + functionName);
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
  throw new Error("Unterminated function: " + functionName);
}

function loadSessionSummaryHelpers() {
  const source = fs.readFileSync(FILE_PATH, "utf8");
  const script = [
    extractFunctionSource(source, "escapeHtml"),
    extractFunctionSource(source, "firstNonEmptyString"),
    extractFunctionSource(source, "formatPercent"),
    extractFunctionSource(source, "formatLatency"),
    extractFunctionSource(source, "formatInteger"),
    extractFunctionSource(source, "formatTimestamp"),
    extractFunctionSource(source, "getLapOffenderSnapshots"),
    extractFunctionSource(source, "formatSessionOffenderHitSummary"),
    extractFunctionSource(source, "formatSessionOffenderTableSummary"),
    extractFunctionSource(source, "formatSessionOffenderWorstSnapshot"),
    extractFunctionSource(source, "formatLatestLapOffenderLabels"),
    extractFunctionSource(source, "collectSessionOffenderSummaries"),
    "module.exports = { collectSessionOffenderSummaries };",
  ].join("\n\n");
  const context = {
    module: { exports: {} },
    exports: {},
    Intl,
    Date,
    state: { sessionHistory: [] },
    CLIENT_TIMEZONE: "America/Denver",
    BLONDIE_TIME_LOGIC: {
      formatPercent(value) {
        return value == null ? "—" : `${Number(value).toFixed(2)}%`;
      },
      formatLatency(value) {
        return value == null ? "—" : `${Number(value).toFixed(2)} ms`;
      },
    },
  };
  vm.runInNewContext(script, context, { filename: FILE_PATH });
  return context.module.exports;
}

test("BT session offender summaries keep offending MVPD identities and hit counts", () => {
  const helpers = loadSessionSummaryHelpers();
  const sessionHistory = [
    {
      lapNumber: 1,
      firedAt: Date.parse("2026-03-19T15:21:54-06:00"),
      offenderSnapshots: [
        {
          label: "Verizon",
          tableTitle: "LEM",
          hitKeys: ["authn"],
          thresholdSummary: "AuthN 35.00% < 40%",
          authnSuccessPercent: 35,
          authzSuccessPercent: 84,
          avgLatencyMs: 900,
        },
        {
          label: "Verizon",
          tableTitle: "LEM",
          hitKeys: ["authn"],
          thresholdSummary: "AuthN 37.00% < 40%",
          authnSuccessPercent: 37,
          authzSuccessPercent: 85,
          avgLatencyMs: 920,
        },
        {
          label: "Comcast_SSO",
          tableTitle: "LEM",
          hitKeys: ["latency"],
          thresholdSummary: "Latency 1257.62 ms > 1000 ms",
          authnSuccessPercent: 96,
          authzSuccessPercent: 98,
          avgLatencyMs: 1257.62,
        },
      ],
    },
  ];

  const summary = helpers.collectSessionOffenderSummaries(sessionHistory);

  assert.equal(summary.totalOffenderRows, 3);
  assert.equal(summary.uniqueOffenders, 2);
  assert.equal(summary.authnHitRows, 2);
  assert.equal(summary.latencyHitRows, 1);
  assert.equal(summary.latestLapOffenderRows, 3);
  assert.equal(summary.latestLapOffenderLabels, "Verizon, Comcast_SSO");
  assert.equal(summary.topOffenders[0].label, "Verizon");
  assert.equal(summary.topOffenders[0].rowHits, 2);
  assert.equal(summary.topOffenders[0].hitSummary, "AuthN 2");
  assert.equal(summary.topOffenders[0].worstSnapshot, "AuthN 35.00%");
});

test("BT session summary source now includes offender-focused sections", () => {
  const source = fs.readFileSync(FILE_PATH, "utf8");

  assert.match(source, /Offender Rollup/);
  assert.match(source, /Offending rows observed:/);
  assert.match(source, /Latest lap offenders:/);
});
