"use strict";

(function attachBlondieTimeLogic(globalObject) {
  const DEFAULT_THRESHOLDS = Object.freeze({
    minAuthnAttempts: 100,
    authnSuccessMin: 40,
    authzSuccessMin: 10,
    latencyMaxMs: 10000,
  });
  const LEGACY_ESM_QUERY_TIMEZONE = "America/Los_Angeles";
  const DEFAULT_ESM_QUERY_LIMIT = 1000;

  function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizeThresholds(input = null) {
    const source = input && typeof input === "object" ? input : {};
    const minAuthnAttempts = Math.max(
      0,
      Number.isFinite(Number(source.minAuthnAttempts)) ? Number(source.minAuthnAttempts) : DEFAULT_THRESHOLDS.minAuthnAttempts
    );
    const authnSuccessMin = Math.max(
      0,
      Number.isFinite(Number(source.authnSuccessMin)) ? Number(source.authnSuccessMin) : DEFAULT_THRESHOLDS.authnSuccessMin
    );
    const authzSuccessMin = Math.max(
      0,
      Number.isFinite(Number(source.authzSuccessMin)) ? Number(source.authzSuccessMin) : DEFAULT_THRESHOLDS.authzSuccessMin
    );
    const latencyMaxMs = Math.max(
      0,
      Number.isFinite(Number(source.latencyMaxMs)) ? Number(source.latencyMaxMs) : DEFAULT_THRESHOLDS.latencyMaxMs
    );
    return {
      minAuthnAttempts,
      authnSuccessMin,
      authzSuccessMin,
      latencyMaxMs,
    };
  }

  function computePercent(numerator, denominator) {
    const n = toNumber(numerator);
    const d = toNumber(denominator);
    if (n == null || d == null || d <= 0) {
      return null;
    }
    const rate = (n / d) * 100;
    return Number.isFinite(rate) ? rate : null;
  }

  function computeAverageLatencyMs(latencyTotal, attempts) {
    const latency = toNumber(latencyTotal);
    const denominator = toNumber(attempts);
    if (latency == null || denominator == null || denominator <= 0) {
      return null;
    }
    const average = latency / denominator;
    return Number.isFinite(average) ? average : null;
  }

  function formatPercent(value) {
    return value == null ? "—" : `${Number(value).toFixed(2)}%`;
  }

  function formatLatency(value) {
    return value == null ? "—" : `${Number(value).toFixed(2)} ms`;
  }

  function formatTimeZoneDateParts(value = 0, timeZone = LEGACY_ESM_QUERY_TIMEZONE) {
    const date = value instanceof Date ? value : new Date(Number(value || 0));
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: String(timeZone || LEGACY_ESM_QUERY_TIMEZONE),
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find((part) => part.type === type)?.value ?? "";
    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");
    if (!year || !month || !day || !hour || !minute) {
      return null;
    }
    return {
      year,
      month,
      day,
      hour,
      minute,
    };
  }

  function truncateToMinuteMs(value = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return Date.now();
    }
    const date = new Date(numeric);
    return numeric - date.getSeconds() * 1000 - date.getMilliseconds();
  }

  function formatLegacyEsmQueryTimestamp(value = 0, timeZone = LEGACY_ESM_QUERY_TIMEZONE) {
    const parts = formatTimeZoneDateParts(value, timeZone);
    return parts ? `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00` : "";
  }

  function computeLegacyEsmIntervalWindow(intervalMinutes = 0, options = {}) {
    const normalizedInterval = Math.max(
      1,
      Number.isFinite(Number(intervalMinutes)) ? Math.floor(Number(intervalMinutes)) : 1
    );
    const timeZone = String(options?.timeZone || LEGACY_ESM_QUERY_TIMEZONE || "UTC");
    const nowMs = truncateToMinuteMs(Number.isFinite(Number(options?.nowMs)) ? Number(options.nowMs) : Date.now());
    const parts = formatTimeZoneDateParts(nowMs, timeZone);
    const currentMinute = Math.max(0, Math.min(59, Number(parts?.minute || 0)));
    let startMs = nowMs - normalizedInterval * 60 * 1000;
    let endMs = nowMs;

    if (currentMinute < normalizedInterval) {
      startMs = nowMs - currentMinute * 60 * 1000;
      if (currentMinute < normalizedInterval / 2) {
        startMs = nowMs - (normalizedInterval + currentMinute) * 60 * 1000;
        endMs = nowMs - (1 + currentMinute) * 60 * 1000;
      }
    }

    return {
      intervalMinutes: normalizedInterval,
      timeZone,
      startMs,
      endMs,
      start: formatLegacyEsmQueryTimestamp(startMs, timeZone),
      end: formatLegacyEsmQueryTimestamp(endMs, timeZone),
    };
  }

  function resolveLegacyEsmQueryLimit(limitValue = null, capValue = DEFAULT_ESM_QUERY_LIMIT) {
    const limitCap = Math.max(
      1,
      Number.isFinite(Number(capValue)) ? Math.floor(Number(capValue)) : DEFAULT_ESM_QUERY_LIMIT
    );
    const numericLimit = Number(limitValue);
    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      return limitCap;
    }
    return Math.max(1, Math.min(limitCap, Math.floor(numericLimit)));
  }

  function buildLegacyEsmIntervalRequestUrl(urlValue = "", intervalMinutes = 0, options = {}) {
    const rawUrl = String(urlValue || "").trim();
    if (!rawUrl) {
      return "";
    }
    try {
      const parsed = new URL(rawUrl, String(options?.baseUrl || "https://example.invalid"));
      const intervalWindow = computeLegacyEsmIntervalWindow(intervalMinutes, options);
      if (!intervalWindow.start || !intervalWindow.end) {
        return rawUrl;
      }
      parsed.hash = "";
      parsed.searchParams.set("start", intervalWindow.start);
      parsed.searchParams.set("end", intervalWindow.end);
      parsed.searchParams.set(
        "limit",
        String(resolveLegacyEsmQueryLimit(parsed.searchParams.get("limit"), options?.limitCap))
      );
      if (options?.format !== false) {
        const formatValue = String(options?.format || "json").trim() || "json";
        parsed.searchParams.set("format", formatValue);
      }
      return parsed.toString();
    } catch (_error) {
      return rawUrl;
    }
  }

  function normalizeLegacyEsmWindowBoundary(value = "", timeZone = LEGACY_ESM_QUERY_TIMEZONE) {
    if (typeof value === "string") {
      const text = value.trim();
      if (text) {
        return text;
      }
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return formatLegacyEsmQueryTimestamp(numeric, timeZone);
    }
    return "";
  }

  function buildLegacyEsmWindowRequestUrl(urlValue = "", windowInput = null, options = {}) {
    const rawUrl = String(urlValue || "").trim();
    if (!rawUrl) {
      return "";
    }
    try {
      const parsed = new URL(rawUrl, String(options?.baseUrl || "https://example.invalid"));
      const timeZone = String(options?.timeZone || LEGACY_ESM_QUERY_TIMEZONE || "UTC");
      const windowSource = windowInput && typeof windowInput === "object" ? windowInput : {};
      const start = normalizeLegacyEsmWindowBoundary(windowSource.start ?? windowSource.startMs, timeZone);
      const end = normalizeLegacyEsmWindowBoundary(windowSource.end ?? windowSource.endMs, timeZone);
      if (!start || !end) {
        return rawUrl;
      }
      parsed.hash = "";
      parsed.searchParams.set("start", start);
      parsed.searchParams.set("end", end);
      parsed.searchParams.set(
        "limit",
        String(resolveLegacyEsmQueryLimit(parsed.searchParams.get("limit"), options?.limitCap))
      );
      if (options?.format !== false) {
        const formatValue = String(options?.format || "json").trim() || "json";
        parsed.searchParams.set("format", formatValue);
      }
      return parsed.toString();
    } catch (_error) {
      return rawUrl;
    }
  }

  function stripPinnedEsmTimeWindowParams(urlValue = "", options = {}) {
    const rawUrl = String(urlValue || "").trim();
    if (!rawUrl) {
      return "";
    }
    try {
      const parsed = new URL(rawUrl, String(options?.baseUrl || "https://example.invalid"));
      parsed.searchParams.delete("start");
      parsed.searchParams.delete("end");
      parsed.hash = "";
      return parsed.toString();
    } catch (_error) {
      return rawUrl;
    }
  }

  function createMetricRange() {
    return {
      low: null,
      high: null,
      sum: 0,
      count: 0,
    };
  }

  function trackMetricRange(range, value) {
    const numeric = toNumber(value);
    if (!range || numeric == null) {
      return;
    }
    range.low = range.low == null ? numeric : Math.min(range.low, numeric);
    range.high = range.high == null ? numeric : Math.max(range.high, numeric);
    range.sum += numeric;
    range.count += 1;
  }

  function finalizeMetricRange(range) {
    const source = range && typeof range === "object" ? range : createMetricRange();
    return {
      low: source.low,
      average: source.count > 0 ? source.sum / source.count : null,
      high: source.high,
      count: source.count,
    };
  }

  function buildThresholdHitList(metrics, thresholds) {
    const hits = [];
    if (metrics.authnSuccessPercent != null && metrics.authnSuccessPercent < thresholds.authnSuccessMin) {
      hits.push({
        key: "authn",
        label: "AuthN",
        value: metrics.authnSuccessPercent,
        displayValue: formatPercent(metrics.authnSuccessPercent),
        thresholdValue: thresholds.authnSuccessMin,
        comparator: "<",
      });
    }
    if (metrics.authzSuccessPercent != null && metrics.authzSuccessPercent < thresholds.authzSuccessMin) {
      hits.push({
        key: "authz",
        label: "AuthZ",
        value: metrics.authzSuccessPercent,
        displayValue: formatPercent(metrics.authzSuccessPercent),
        thresholdValue: thresholds.authzSuccessMin,
        comparator: "<",
      });
    }
    if (metrics.avgLatencyMs != null && metrics.avgLatencyMs > thresholds.latencyMaxMs) {
      hits.push({
        key: "latency",
        label: "Latency",
        value: metrics.avgLatencyMs,
        displayValue: formatLatency(metrics.avgLatencyMs),
        thresholdValue: thresholds.latencyMaxMs,
        comparator: ">",
      });
    }
    return hits;
  }

  function computeRowMetrics(row = null) {
    const source = row && typeof row === "object" ? row : {};
    const authnAttempts = toNumber(source["authn-attempts"]);
    const authnSuccessful = toNumber(source["authn-successful"]);
    const authzAttempts = toNumber(source["authz-attempts"]);
    const authzSuccessful = toNumber(source["authz-successful"]);
    const authzLatency = toNumber(source["authz-latency"]);
    return {
      authnAttempts,
      authnSuccessful,
      authzAttempts,
      authzSuccessful,
      authzLatency,
      authnSuccessPercent: computePercent(authnSuccessful, authnAttempts),
      authzSuccessPercent: computePercent(authzSuccessful, authzAttempts),
      avgLatencyMs: computeAverageLatencyMs(authzLatency, authzAttempts),
    };
  }

  function analyzeRows(rows = [], inputThresholds = null) {
    const thresholds = normalizeThresholds(inputThresholds);
    const sourceRows = Array.isArray(rows) ? rows : [];
    const eligibleRows = [];
    const offendingRows = [];
    const offendersByMetric = {
      authn: 0,
      authz: 0,
      latency: 0,
    };
    const totals = {
      authnAttempts: 0,
      authnSuccessful: 0,
      authzAttempts: 0,
      authzSuccessful: 0,
      authzLatency: 0,
    };
    const liveTotals = {
      authnAttempts: 0,
      authnSuccessful: 0,
      authzAttempts: 0,
      authzSuccessful: 0,
      authzLatency: 0,
    };
    const snapshotRanges = {
      authnAttempts: createMetricRange(),
      authnSuccessPercent: createMetricRange(),
      authzSuccessPercent: createMetricRange(),
      avgLatencyMs: createMetricRange(),
    };
    const liveSnapshotRanges = {
      authnAttempts: createMetricRange(),
      authnSuccessPercent: createMetricRange(),
      authzSuccessPercent: createMetricRange(),
      avgLatencyMs: createMetricRange(),
    };
    let filteredLowVolumeCount = 0;

    sourceRows.forEach((row) => {
      const metrics = computeRowMetrics(row);
      const authnAttempts = metrics.authnAttempts == null ? 0 : metrics.authnAttempts;
      liveTotals.authnAttempts += authnAttempts;
      liveTotals.authnSuccessful += metrics.authnSuccessful == null ? 0 : metrics.authnSuccessful;
      liveTotals.authzAttempts += metrics.authzAttempts == null ? 0 : metrics.authzAttempts;
      liveTotals.authzSuccessful += metrics.authzSuccessful == null ? 0 : metrics.authzSuccessful;
      liveTotals.authzLatency += metrics.authzLatency == null ? 0 : metrics.authzLatency;
      trackMetricRange(liveSnapshotRanges.authnAttempts, authnAttempts);
      trackMetricRange(liveSnapshotRanges.authnSuccessPercent, metrics.authnSuccessPercent);
      trackMetricRange(liveSnapshotRanges.authzSuccessPercent, metrics.authzSuccessPercent);
      trackMetricRange(liveSnapshotRanges.avgLatencyMs, metrics.avgLatencyMs);
      if (authnAttempts < thresholds.minAuthnAttempts) {
        filteredLowVolumeCount += 1;
        return;
      }
      eligibleRows.push(row);
      totals.authnAttempts += authnAttempts;
      totals.authnSuccessful += metrics.authnSuccessful == null ? 0 : metrics.authnSuccessful;
      totals.authzAttempts += metrics.authzAttempts == null ? 0 : metrics.authzAttempts;
      totals.authzSuccessful += metrics.authzSuccessful == null ? 0 : metrics.authzSuccessful;
      totals.authzLatency += metrics.authzLatency == null ? 0 : metrics.authzLatency;
      trackMetricRange(snapshotRanges.authnAttempts, authnAttempts);
      trackMetricRange(snapshotRanges.authnSuccessPercent, metrics.authnSuccessPercent);
      trackMetricRange(snapshotRanges.authzSuccessPercent, metrics.authzSuccessPercent);
      trackMetricRange(snapshotRanges.avgLatencyMs, metrics.avgLatencyMs);

      const thresholdHits = buildThresholdHitList(metrics, thresholds);
      if (thresholdHits.length === 0) {
        return;
      }
      thresholdHits.forEach((hit) => {
        offendersByMetric[hit.key] += 1;
      });
      offendingRows.push({
        ...row,
        __btMetrics: metrics,
        __btThresholdHits: thresholdHits,
        __btThresholdSummary: thresholdHits
          .map((hit) => `${hit.label} ${hit.displayValue} ${hit.comparator} ${hit.thresholdValue}${hit.key === "latency" ? " ms" : "%"}`)
          .join(" | "),
      });
    });

    const eligibleCount = eligibleRows.length;
    const liveAverageLatencyMs =
      sourceRows.length > 0 && liveTotals.authzAttempts > 0 ? liveTotals.authzLatency / liveTotals.authzAttempts : null;
    const liveAverageAuthnSuccessPercent =
      sourceRows.length > 0 && liveTotals.authnAttempts > 0 ? (liveTotals.authnSuccessful / liveTotals.authnAttempts) * 100 : null;
    const liveAverageAuthzSuccessPercent =
      sourceRows.length > 0 && liveTotals.authzAttempts > 0 ? (liveTotals.authzSuccessful / liveTotals.authzAttempts) * 100 : null;
    const averageLatencyMs =
      eligibleCount > 0 && totals.authzAttempts > 0 ? totals.authzLatency / totals.authzAttempts : null;
    const averageAuthnSuccessPercent =
      eligibleCount > 0 && totals.authnAttempts > 0 ? (totals.authnSuccessful / totals.authnAttempts) * 100 : null;
    const averageAuthzSuccessPercent =
      eligibleCount > 0 && totals.authzAttempts > 0 ? (totals.authzSuccessful / totals.authzAttempts) * 100 : null;

    return {
      thresholds,
      totalRows: sourceRows.length,
      eligibleRows: eligibleCount,
      filteredLowVolumeCount,
      offendingRows,
      offendersByMetric,
      summary: {
        liveAverageLatencyMs,
        liveAverageAuthnSuccessPercent,
        liveAverageAuthzSuccessPercent,
        liveSnapshot: {
          authnAttempts: finalizeMetricRange(liveSnapshotRanges.authnAttempts),
          authnSuccessPercent: finalizeMetricRange(liveSnapshotRanges.authnSuccessPercent),
          authzSuccessPercent: finalizeMetricRange(liveSnapshotRanges.authzSuccessPercent),
          avgLatencyMs: finalizeMetricRange(liveSnapshotRanges.avgLatencyMs),
        },
        averageLatencyMs,
        averageAuthnSuccessPercent,
        averageAuthzSuccessPercent,
        snapshot: {
          authnAttempts: finalizeMetricRange(snapshotRanges.authnAttempts),
          authnSuccessPercent: finalizeMetricRange(snapshotRanges.authnSuccessPercent),
          authzSuccessPercent: finalizeMetricRange(snapshotRanges.authzSuccessPercent),
          avgLatencyMs: finalizeMetricRange(snapshotRanges.avgLatencyMs),
        },
        offendingRows: offendingRows.length,
        eligibleRows: eligibleCount,
        filteredLowVolumeCount,
        passedWithoutHits: Math.max(0, eligibleCount - offendingRows.length),
      },
    };
  }

  function toSummaryLines(analysis = null) {
    if (!analysis || typeof analysis !== "object") {
      return [];
    }
    const thresholds = normalizeThresholds(analysis.thresholds);
    const summary = analysis.summary && typeof analysis.summary === "object" ? analysis.summary : {};
    const snapshot =
      summary.liveSnapshot && typeof summary.liveSnapshot === "object"
        ? summary.liveSnapshot
        : summary.snapshot && typeof summary.snapshot === "object"
          ? summary.snapshot
          : {};
    const lines = [
      `Latency pass average: ${formatLatency(summary.liveAverageLatencyMs ?? summary.averageLatencyMs)} | threshold <= ${thresholds.latencyMaxMs} ms`,
      `AuthN pass average: ${formatPercent(summary.liveAverageAuthnSuccessPercent ?? summary.averageAuthnSuccessPercent)} | threshold >= ${thresholds.authnSuccessMin}%`,
      `AuthZ pass average: ${formatPercent(summary.liveAverageAuthzSuccessPercent ?? summary.averageAuthzSuccessPercent)} | threshold >= ${thresholds.authzSuccessMin}%`,
      `Returned rows: ${Math.max(0, Number(analysis.totalRows || 0))} | Eligible rows: ${Math.max(0, Number(summary.eligibleRows || analysis.eligibleRows || 0))} | offending rows: ${Math.max(
        0,
        Number(summary.offendingRows || 0)
      )} | filtered low-volume rows: ${Math.max(0, Number(summary.filteredLowVolumeCount || analysis.filteredLowVolumeCount || 0))}`,
      `AuthN attempts low/avg/high: ${
        snapshot.authnAttempts
          ? `${snapshot.authnAttempts.low == null ? "—" : Number(snapshot.authnAttempts.low).toFixed(0)} / ${
              snapshot.authnAttempts.average == null ? "—" : Number(snapshot.authnAttempts.average).toFixed(2)
            } / ${snapshot.authnAttempts.high == null ? "—" : Number(snapshot.authnAttempts.high).toFixed(0)}`
          : "—"
      }`,
      `AuthN success low/avg/high: ${
        snapshot.authnSuccessPercent
          ? `${formatPercent(snapshot.authnSuccessPercent.low)} / ${formatPercent(snapshot.authnSuccessPercent.average)} / ${formatPercent(snapshot.authnSuccessPercent.high)}`
          : "—"
      }`,
      `AuthZ success low/avg/high: ${
        snapshot.authzSuccessPercent
          ? `${formatPercent(snapshot.authzSuccessPercent.low)} / ${formatPercent(snapshot.authzSuccessPercent.average)} / ${formatPercent(snapshot.authzSuccessPercent.high)}`
          : "—"
      }`,
      `Avg latency low/avg/high: ${
        snapshot.avgLatencyMs
          ? `${formatLatency(snapshot.avgLatencyMs.low)} / ${formatLatency(snapshot.avgLatencyMs.average)} / ${formatLatency(snapshot.avgLatencyMs.high)}`
          : "—"
      }`,
    ];
    return lines;
  }

  function getOffenderLabel(row = null) {
    const source = row && typeof row === "object" ? row : {};
    const candidates = [
      source.mvpd,
      source["requestor-id"],
      source.channel,
      source["resource-id"],
      source["service-provider"],
      source["site-name"],
      source.partner,
    ];
    for (let index = 0; index < candidates.length; index += 1) {
      const value = String(candidates[index] == null ? "" : candidates[index]).trim();
      if (value) {
        return value;
      }
    }
    return "Unknown";
  }

  function buildMetricWarningValues(analysis = null, metricKey = "") {
    if (!analysis || typeof analysis !== "object" || !metricKey) {
      return [];
    }
    const values = [];
    const seen = new Set();
    (Array.isArray(analysis.offendingRows) ? analysis.offendingRows : []).forEach((row) => {
      const hits = Array.isArray(row?.__btThresholdHits) ? row.__btThresholdHits : [];
      const matchedHit = hits.find((hit) => String(hit?.key || "").trim() === metricKey);
      if (!matchedHit) {
        return;
      }
      const label = `${getOffenderLabel(row)}(${String(matchedHit.displayValue || "").trim() || "—"})`;
      if (seen.has(label)) {
        return;
      }
      seen.add(label);
      values.push(label);
    });
    return values;
  }

  function toSlackSummaryLines(analysis = null) {
    if (!analysis || typeof analysis !== "object") {
      return [];
    }
    const thresholds = normalizeThresholds(analysis.thresholds);
    const summary = analysis.summary && typeof analysis.summary === "object" ? analysis.summary : {};
    const snapshot =
      summary.liveSnapshot && typeof summary.liveSnapshot === "object"
        ? summary.liveSnapshot
        : summary.snapshot && typeof summary.snapshot === "object"
          ? summary.snapshot
          : {};
    const latencyWarnings = buildMetricWarningValues(analysis, "latency");
    const authnWarnings = buildMetricWarningValues(analysis, "authn");
    const authzWarnings = buildMetricWarningValues(analysis, "authz");
    return [
      `Pass: Avg MVPD response times: ${formatLatency(summary.liveAverageLatencyMs ?? summary.averageLatencyMs)}`,
      ...(latencyWarnings.length > 0 ? [`NOTE: Warning levels for latency ${latencyWarnings.join(" ")}`] : []),
      `Pass: Avg AuthN successful conversions %: ${formatPercent(summary.liveAverageAuthnSuccessPercent ?? summary.averageAuthnSuccessPercent)}`,
      ...(authnWarnings.length > 0 ? [`NOTE: Warning levels for authN ${authnWarnings.join(" ")}`] : []),
      `Pass: Avg AuthZ successful conversions %: ${formatPercent(summary.liveAverageAuthzSuccessPercent ?? summary.averageAuthzSuccessPercent)}`,
      ...(authzWarnings.length > 0 ? [`NOTE: Warning levels for authZ ${authzWarnings.join(" ")}`] : []),
      `Threshold results: Returned ${Math.max(0, Number(analysis.totalRows || 0))} | Eligible ${Math.max(0, Number(summary.eligibleRows || analysis.eligibleRows || 0))} | Offending ${Math.max(
        0,
        Number(summary.offendingRows || 0)
      )} | Clear ${Math.max(0, Number(summary.passedWithoutHits || 0))} | Filtered low-volume ${Math.max(
        0,
        Number(summary.filteredLowVolumeCount || analysis.filteredLowVolumeCount || 0)
      )}`,
      `AuthN attempts low/avg/high: ${
        snapshot.authnAttempts
          ? `${snapshot.authnAttempts.low == null ? "—" : Number(snapshot.authnAttempts.low).toFixed(0)} / ${
              snapshot.authnAttempts.average == null ? "—" : Number(snapshot.authnAttempts.average).toFixed(2)
            } / ${snapshot.authnAttempts.high == null ? "—" : Number(snapshot.authnAttempts.high).toFixed(0)}`
          : "—"
      }`,
      `AuthN success low/avg/high: ${
        snapshot.authnSuccessPercent
          ? `${formatPercent(snapshot.authnSuccessPercent.low)} / ${formatPercent(snapshot.authnSuccessPercent.average)} / ${formatPercent(snapshot.authnSuccessPercent.high)}`
          : "—"
      }`,
      `AuthZ success low/avg/high: ${
        snapshot.authzSuccessPercent
          ? `${formatPercent(snapshot.authzSuccessPercent.low)} / ${formatPercent(snapshot.authzSuccessPercent.average)} / ${formatPercent(snapshot.authzSuccessPercent.high)}`
          : "—"
      }`,
      `Avg latency low/avg/high: ${
        snapshot.avgLatencyMs
          ? `${formatLatency(snapshot.avgLatencyMs.low)} / ${formatLatency(snapshot.avgLatencyMs.average)} / ${formatLatency(snapshot.avgLatencyMs.high)}`
          : "—"
      }`,
    ];
  }

  const api = {
    DEFAULT_THRESHOLDS,
    LEGACY_ESM_QUERY_TIMEZONE,
    DEFAULT_ESM_QUERY_LIMIT,
    toNumber,
    normalizeThresholds,
    computePercent,
    computeAverageLatencyMs,
    formatLegacyEsmQueryTimestamp,
    computeLegacyEsmIntervalWindow,
    resolveLegacyEsmQueryLimit,
    buildLegacyEsmIntervalRequestUrl,
    buildLegacyEsmWindowRequestUrl,
    stripPinnedEsmTimeWindowParams,
    computeRowMetrics,
    analyzeRows,
    formatPercent,
    formatLatency,
    toSummaryLines,
    toSlackSummaryLines,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalObject.UnderParBlondieTimeLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
