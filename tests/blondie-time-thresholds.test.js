const test = require("node:test");
const assert = require("node:assert/strict");

const logic = require("../blondie-time-logic.js");

test("legacy Blondie thresholds filter low-volume rows and flag authN/authZ/latency offenders", () => {
  const rows = [
    {
      mvpd: "Healthy",
      "authn-attempts": "150",
      "authn-successful": "120",
      "authz-attempts": "100",
      "authz-successful": "95",
      "authz-latency": "400000",
    },
    {
      mvpd: "AuthN Bad",
      "authn-attempts": "200",
      "authn-successful": "60",
      "authz-attempts": "190",
      "authz-successful": "180",
      "authz-latency": "760000",
    },
    {
      mvpd: "AuthZ Slow",
      "authn-attempts": "180",
      "authn-successful": "170",
      "authz-attempts": "160",
      "authz-successful": "8",
      "authz-latency": "2000000",
    },
    {
      mvpd: "Low Volume",
      "authn-attempts": "20",
      "authn-successful": "1",
      "authz-attempts": "10",
      "authz-successful": "1",
      "authz-latency": "500000",
    },
  ];

  const analysis = logic.analyzeRows(rows, {
    minAuthnAttempts: 100,
    authnSuccessMin: 40,
    authzSuccessMin: 10,
    latencyMaxMs: 10000,
  });

  assert.equal(analysis.totalRows, 4);
  assert.equal(analysis.eligibleRows, 3);
  assert.equal(analysis.filteredLowVolumeCount, 1);
  assert.equal(analysis.offendingRows.length, 2);
  assert.deepEqual(
    analysis.offendingRows.map((row) => row.mvpd),
    ["AuthN Bad", "AuthZ Slow"]
  );

  const authnBadHits = analysis.offendingRows[0].__btThresholdHits.map((hit) => hit.key);
  const authzSlowHits = analysis.offendingRows[1].__btThresholdHits.map((hit) => hit.key);
  assert.deepEqual(authnBadHits, ["authn"]);
  assert.deepEqual(authzSlowHits, ["authz", "latency"]);
  assert.equal(analysis.offendersByMetric.authn, 1);
  assert.equal(analysis.offendersByMetric.authz, 1);
  assert.equal(analysis.offendersByMetric.latency, 1);
  assert.equal(analysis.summary.snapshot.authnAttempts.low, 150);
  assert.equal(analysis.summary.snapshot.authnAttempts.high, 200);
  assert.equal(Number(analysis.summary.snapshot.authnAttempts.average.toFixed(2)), 176.67);
  assert.equal(analysis.summary.snapshot.authnSuccessPercent.low, 30);
  assert.equal(analysis.summary.snapshot.authzSuccessPercent.high, 95);
  assert.equal(analysis.summary.liveSnapshot.authnAttempts.low, 20);
  assert.equal(analysis.summary.liveSnapshot.authnAttempts.high, 200);
  assert.equal(Number(analysis.summary.liveAverageAuthnSuccessPercent.toFixed(2)), 63.82);
});

test("summary lines preserve the legacy aggregate presentation shape", () => {
  const analysis = logic.analyzeRows(
    [
      {
        mvpd: "One",
        "authn-attempts": "100",
        "authn-successful": "50",
        "authz-attempts": "100",
        "authz-successful": "10",
        "authz-latency": "1000000",
      },
    ],
    null
  );

  const lines = logic.toSummaryLines(analysis);
  assert.equal(lines.length, 8);
  assert.match(lines[0], /Latency pass average:/);
  assert.match(lines[1], /AuthN pass average:/);
  assert.match(lines[2], /AuthZ pass average:/);
  assert.match(lines[3], /Eligible rows:/);
  assert.match(lines[4], /AuthN attempts low\/avg\/high:/);
  assert.match(lines[5], /AuthN success low\/avg\/high:/);
  assert.match(lines[6], /AuthZ success low\/avg\/high:/);
  assert.match(lines[7], /Avg latency low\/avg\/high:/);
});

test("slack summary lines preserve legacy pass averages and explicit threshold warning details", () => {
  const analysis = logic.analyzeRows(
    [
      {
        mvpd: "Healthy",
        "authn-attempts": "160",
        "authn-successful": "140",
        "authz-attempts": "140",
        "authz-successful": "132",
        "authz-latency": "420000",
      },
      {
        mvpd: "AuthN Bad",
        "authn-attempts": "150",
        "authn-successful": "30",
        "authz-attempts": "120",
        "authz-successful": "100",
        "authz-latency": "240000",
      },
      {
        mvpd: "AuthZ Slow",
        "authn-attempts": "200",
        "authn-successful": "180",
        "authz-attempts": "100",
        "authz-successful": "5",
        "authz-latency": "1500000",
      },
    ],
    {
      minAuthnAttempts: 100,
      authnSuccessMin: 40,
      authzSuccessMin: 10,
      latencyMaxMs: 10000,
    }
  );

  const lines = logic.toSlackSummaryLines(analysis);
  assert.equal(lines.length, 11);
  assert.match(lines[0], /^Pass: Avg MVPD response times:/);
  assert.match(lines[1], /NOTE: Warning levels for latency AuthZ Slow\(15000.00 ms\)/);
  assert.match(lines[2], /^Pass: Avg AuthN successful conversions %:/);
  assert.match(lines[3], /NOTE: Warning levels for authN AuthN Bad\(20.00%\)/);
  assert.match(lines[4], /^Pass: Avg AuthZ successful conversions %:/);
  assert.match(lines[5], /NOTE: Warning levels for authZ AuthZ Slow\(5.00%\)/);
  assert.match(lines[6], /Threshold results: Returned 3 \| Eligible 3 \| Offending 2 \| Clear 1 \| Filtered low-volume 0/);
  assert.match(lines[7], /AuthN attempts low\/avg\/high:/);
  assert.match(lines[8], /AuthN success low\/avg\/high:/);
  assert.match(lines[9], /AuthZ success low\/avg\/high:/);
  assert.match(lines[10], /Avg latency low\/avg\/high:/);
});

test("slack summary lines always report clean threshold state when there are no offenders", () => {
  const analysis = logic.analyzeRows(
    [
      {
        mvpd: "Healthy",
        "authn-attempts": "180",
        "authn-successful": "170",
        "authz-attempts": "160",
        "authz-successful": "150",
        "authz-latency": "400000",
      },
    ],
    null
  );

  const lines = logic.toSlackSummaryLines(analysis);
  assert.equal(lines.length, 8);
  assert.doesNotMatch(lines.join("\n"), /NOTE: Warning levels/);
  assert.match(lines[0], /^Pass: Avg MVPD response times:/);
  assert.match(lines[1], /^Pass: Avg AuthN successful conversions %:/);
  assert.match(lines[2], /^Pass: Avg AuthZ successful conversions %:/);
  assert.match(lines[3], /Threshold results: Returned 1 \| Eligible 1 \| Offending 0 \| Clear 1 \| Filtered low-volume 0/);
});

test("slack summary lines keep live averages and ranges when all rows are filtered low-volume", () => {
  const analysis = logic.analyzeRows(
    [
      {
        mvpd: "Low Volume One",
        "authn-attempts": "20",
        "authn-successful": "10",
        "authz-attempts": "20",
        "authz-successful": "18",
        "authz-latency": "10000",
      },
      {
        mvpd: "Low Volume Two",
        "authn-attempts": "30",
        "authn-successful": "24",
        "authz-attempts": "25",
        "authz-successful": "20",
        "authz-latency": "50000",
      },
    ],
    {
      minAuthnAttempts: 100,
      authnSuccessMin: 40,
      authzSuccessMin: 10,
      latencyMaxMs: 10000,
    }
  );

  const lines = logic.toSlackSummaryLines(analysis);
  assert.equal(analysis.summary.eligibleRows, 0);
  assert.match(lines[0], /Pass: Avg MVPD response times: 1,333\.33 ms|Pass: Avg MVPD response times: 1333\.33 ms/);
  assert.match(lines[1], /Pass: Avg AuthN successful conversions %: 68\.00%/);
  assert.match(lines[2], /Pass: Avg AuthZ successful conversions %: 84\.44%/);
  assert.match(lines[3], /Threshold results: Returned 2 \| Eligible 0 \| Offending 0 \| Clear 0 \| Filtered low-volume 2/);
  assert.doesNotMatch(lines[4], /— \/ — \/ —/);
  assert.doesNotMatch(lines[5], /— \/ — \/ —/);
  assert.doesNotMatch(lines[6], /— \/ — \/ —/);
  assert.doesNotMatch(lines[7], /— \/ — \/ —/);
});

test("legacy ESM interval window preserves the current-hour clamp when inside the interval", () => {
  const window = logic.computeLegacyEsmIntervalWindow(15, {
    nowMs: Date.parse("2026-03-14T12:13:45-07:00"),
  });

  assert.equal(window.start, "2026-03-14T12:00:00");
  assert.equal(window.end, "2026-03-14T12:13:00");
});

test("legacy ESM interval window backs into the previous hour when fired too early in the interval", () => {
  const window = logic.computeLegacyEsmIntervalWindow(10, {
    nowMs: Date.parse("2026-03-14T12:04:22-07:00"),
  });

  assert.equal(window.start, "2026-03-14T11:50:00");
  assert.equal(window.end, "2026-03-14T11:59:00");
});

test("legacy ESM interval request url reapplies start end format and caps large limits", () => {
  const requestUrl = logic.buildLegacyEsmIntervalRequestUrl(
    "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day/hour/minute/proxy/mvpd?proxy=Direct&requestor-id=NFL&limit=5000&format=csv",
    15,
    {
      nowMs: Date.parse("2026-03-14T12:13:45-07:00"),
    }
  );
  const parsed = new URL(requestUrl);

  assert.equal(parsed.searchParams.get("start"), "2026-03-14T12:00:00");
  assert.equal(parsed.searchParams.get("end"), "2026-03-14T12:13:00");
  assert.equal(parsed.searchParams.get("limit"), "1000");
  assert.equal(parsed.searchParams.get("format"), "json");
  assert.equal(parsed.searchParams.get("proxy"), "Direct");
  assert.equal(parsed.searchParams.get("requestor-id"), "NFL");
});

test("legacy ESM interval request url preserves a smaller caller limit", () => {
  const requestUrl = logic.buildLegacyEsmIntervalRequestUrl(
    "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day/hour/minute/proxy/mvpd?proxy=Direct&requestor-id=NFL&limit=250",
    5,
    {
      nowMs: Date.parse("2026-03-14T12:26:08-07:00"),
    }
  );
  const parsed = new URL(requestUrl);

  assert.equal(parsed.searchParams.get("start"), "2026-03-14T12:21:00");
  assert.equal(parsed.searchParams.get("end"), "2026-03-14T12:26:00");
  assert.equal(parsed.searchParams.get("limit"), "250");
});

test("legacy ESM fixed window request url reapplies provided start end and caps large limits", () => {
  const requestUrl = logic.buildLegacyEsmWindowRequestUrl(
    "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day/hour/minute/proxy/mvpd?proxy=Direct&requestor-id=NFL&limit=5000&format=csv",
    {
      start: "2026-03-14T10:00:00",
      end: "2026-03-14T12:17:00",
    }
  );
  const parsed = new URL(requestUrl);

  assert.equal(parsed.searchParams.get("start"), "2026-03-14T10:00:00");
  assert.equal(parsed.searchParams.get("end"), "2026-03-14T12:17:00");
  assert.equal(parsed.searchParams.get("limit"), "1000");
  assert.equal(parsed.searchParams.get("format"), "json");
  assert.equal(parsed.searchParams.get("proxy"), "Direct");
  assert.equal(parsed.searchParams.get("requestor-id"), "NFL");
});

test("stripPinnedEsmTimeWindowParams removes only start and end from saved query style urls", () => {
  const requestUrl = logic.stripPinnedEsmTimeWindowParams(
    "https://mgmt.auth.adobe.com/esm/v3/media-company/year/month/day/hour/minute/proxy/mvpd?proxy=Direct&requestor-id=NFL&start=2026-03-14T12:00:00&end=2026-03-14T12:15:00&limit=250&format=json"
  );
  const parsed = new URL(requestUrl);

  assert.equal(parsed.searchParams.get("start"), null);
  assert.equal(parsed.searchParams.get("end"), null);
  assert.equal(parsed.searchParams.get("limit"), "250");
  assert.equal(parsed.searchParams.get("format"), "json");
  assert.equal(parsed.searchParams.get("requestor-id"), "NFL");
});
