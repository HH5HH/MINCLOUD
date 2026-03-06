const CMUEMU_MESSAGE_TYPE = "underpar:cmuemu-workspace";
const CMUEMU_LEGACY_MESSAGE_TYPE = "mincloud:cmuemu-workspace";
const CMUEMU_MESSAGE_TYPES = new Set([CMUEMU_MESSAGE_TYPE, CMUEMU_LEGACY_MESSAGE_TYPE]);
const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const state = {
  windowId: 0,
  controllerOnline: false,
  cmuemuAvailable: null,
  cmuemuAvailabilityResolved: false,
  cmuemuContainerVisible: null,
  incidentId: "CMUEMU",
  programmerId: "",
  programmerName: "",
  requestorId: "",
  mvpdId: "",
  requestorIds: [],
  mvpdIds: [],
  mvpdLabel: "",
  requestorMvpdLabel: "",
  tenantScope: "",
  esmAppName: "",
  esmAppGuid: "",
  cmTenantCount: 0,
  cmTenantNames: [],
  profileHarvest: null,
  profileHarvestList: [],
  timeWindowDays: 30,
  updatedAt: 0,
  fusionPayload: null,
  fusionLoading: false,
  fusionError: "",
  fusionRequestKey: "",
  lastFusionKey: "",
};

const els = {
  appRoot: document.getElementById("workspace-app-root"),
  content: document.getElementById("workspace-content"),
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  refreshButton: document.getElementById("workspace-refresh"),
  status: document.getElementById("workspace-status"),
  emptyScreen: document.getElementById("workspace-non-cmuemu-screen"),
  emptyHeadline: document.getElementById("workspace-non-cmuemu-headline"),
  emptyNote: document.getElementById("workspace-non-cmuemu-note"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setStatus(message = "", tone = "") {
  els.status.textContent = String(message || "").trim();
  els.status.className = "workspace-status";
  if (tone === "error") {
    els.status.classList.add("is-error");
  } else if (tone === "success") {
    els.status.classList.add("is-success");
  }
}

function syncRefreshButtonState() {
  if (!els.refreshButton) {
    return;
  }
  els.refreshButton.disabled = state.fusionLoading;
  els.refreshButton.textContent = state.fusionLoading ? "Refreshing..." : "Refresh Context";
}

function formatDateOnly(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function formatDateTimeIso(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function formatLocalDateTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function stableHash(input = "") {
  const raw = String(input || "");
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function buildAnonymizedId(prefix, seed) {
  return `${prefix}_${stableHash(seed).slice(0, 6)}`;
}

function sendWorkspaceAction(action, payload = {}) {
  return chrome.runtime.sendMessage({
    type: CMUEMU_MESSAGE_TYPE,
    channel: "workspace-action",
    action,
    ...payload,
  });
}

function cloneJsonLike(value) {
  if (value == null) {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}

function applyControllerState(payload = {}) {
  const next = payload && typeof payload === "object" ? payload : {};
  state.controllerOnline = next.controllerOnline === true;
  state.cmuemuAvailable = typeof next.cmuemuAvailable === "boolean" ? next.cmuemuAvailable : null;
  state.cmuemuAvailabilityResolved = next.cmuemuAvailabilityResolved === true;
  state.cmuemuContainerVisible = typeof next.cmuemuContainerVisible === "boolean" ? next.cmuemuContainerVisible : null;
  state.incidentId = String(next.incidentId || "CMUEMU").trim() || "CMUEMU";
  state.programmerId = String(next.programmerId || "").trim();
  state.programmerName = String(next.programmerName || "").trim();
  state.requestorId = String(next.requestorId || "").trim();
  state.mvpdId = String(next.mvpdId || "").trim();
  state.requestorIds = Array.isArray(next.requestorIds) ? next.requestorIds.map((value) => String(value || "").trim()).filter(Boolean) : [];
  state.mvpdIds = Array.isArray(next.mvpdIds) ? next.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean) : [];
  state.mvpdLabel = String(next.mvpdLabel || "").trim();
  state.requestorMvpdLabel = String(next.requestorMvpdLabel || "").trim();
  state.tenantScope = String(next.tenantScope || "").trim();
  state.esmAppName = String(next.esmAppName || "").trim();
  state.esmAppGuid = String(next.esmAppGuid || "").trim();
  state.cmTenantCount = Number(next.cmTenantCount || 0) || 0;
  state.cmTenantNames = Array.isArray(next.cmTenantNames)
    ? next.cmTenantNames.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.profileHarvest = next.profileHarvest && typeof next.profileHarvest === "object" ? cloneJsonLike(next.profileHarvest) : null;
  state.profileHarvestList = Array.isArray(next.profileHarvestList) ? cloneJsonLike(next.profileHarvestList) : [];
  state.timeWindowDays = Number(next.timeWindowDays || 30) || 30;
  state.updatedAt = Number(next.updatedAt || Date.now()) || Date.now();
}

function applyFusionPayload(payload = null) {
  state.fusionPayload = payload && typeof payload === "object" ? cloneJsonLike(payload) : null;
}

function resetFusionState() {
  applyFusionPayload(null);
  state.fusionLoading = false;
  state.fusionError = "";
  state.fusionRequestKey = "";
  state.lastFusionKey = "";
}

function getFusionRefreshKey() {
  return [
    state.programmerId,
    state.requestorId,
    state.mvpdId,
    state.tenantScope,
    state.updatedAt,
  ].join("|");
}

async function hydrateWindowId() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    state.windowId = Number(currentWindow?.id || 0);
  } catch {
    state.windowId = 0;
  }
}

function buildContextModel() {
  const days = Math.max(7, Number(state.timeWindowDays || 30));
  const end = new Date();
  const start = new Date(end.getTime() - (days * 24 * 60 * 60 * 1000));
  const firstSpike = new Date(start.getTime() + (8 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));
  const latestPeak = new Date(start.getTime() + (17 * 24 * 60 * 60 * 1000) + (21 * 60 * 60 * 1000));
  const releaseTarget = new Date(end.getTime() + (30 * 24 * 60 * 60 * 1000));
  const mediaCompany = state.programmerName || "Selected Media Company";
  const requestorLabel = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
  const mvpdLabel = state.mvpdLabel || (state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs");
  const upstreamUserId = String(state.profileHarvest?.upstreamUserId || "").trim();
  const selectedProfileLabel = state.requestorMvpdLabel || `${requestorLabel} x ${mvpdLabel}`;
  const verdict = {
    label: "Partial",
    confidencePct: 64,
    badge: "Spec mode · causation not yet proven",
  };
  const hashedSeed = `${mediaCompany}|${requestorLabel}|${mvpdLabel}|${upstreamUserId}`;
  const hashedUsers = [
    buildAnonymizedId("usr", `${hashedSeed}:1`),
    buildAnonymizedId("usr", `${hashedSeed}:2`),
    buildAnonymizedId("usr", `${hashedSeed}:3`),
  ];
  const hashedDevices = [
    buildAnonymizedId("dev", `${hashedSeed}:ios`),
    buildAnonymizedId("dev", `${hashedSeed}:tvos`),
    buildAnonymizedId("dev", `${hashedSeed}:ipad`),
  ];
  const sampleCount = 2480;
  const affectedUsersCount = 612;
  const sparklineHeights = [22, 24, 28, 33, 31, 38, 46, 64, 72, 67, 52, 44, 36, 28];
  return {
    incidentId: state.incidentId || "CMUEMU",
    mediaCompany,
    requestorLabel,
    mvpdLabel,
    selectedProfileLabel,
    upstreamUserId,
    esmAppName: state.esmAppName || "ESM registered application",
    cmTenantNames: state.cmTenantNames.length > 0 ? state.cmTenantNames : [state.tenantScope || "CM tenant scope pending"],
    cmTenantCount: state.cmTenantCount,
    tenantScope: state.tenantScope || "tenant scope pending",
    timeWindowLabel: `${formatDateOnly(start)}/${formatDateOnly(end)}`,
    timeWindowDays: days,
    firstSpikeIso: formatDateTimeIso(firstSpike),
    firstSpikeLocal: formatLocalDateTime(firstSpike),
    latestPeakIso: formatDateTimeIso(latestPeak),
    releaseTargetIso: formatDateOnly(releaseTarget),
    verdict,
    sampleCount,
    affectedUsersCount,
    sparklineHeights,
    hashedUsers,
    hashedDevices,
    references: [
      state.esmAppName || "ESM app pending",
      state.tenantScope || "CM tenant pending",
      selectedProfileLabel,
    ].filter(Boolean),
  };
}

function buildFusionViewModel() {
  const payload = state.fusionPayload && typeof state.fusionPayload === "object" ? state.fusionPayload : null;
  if (!payload) {
    return null;
  }
  const familyCards = Array.isArray(payload?.fusion?.familyCards) ? payload.fusion.familyCards : [];
  const overlapPairs = Array.isArray(payload?.fusion?.overlapPairs) ? payload.fusion.overlapPairs : [];
  const sharedFamilyCards = familyCards.filter((card) => card?.inEsm && card?.inCm);
  const esmOnlyFamilyCards = familyCards.filter((card) => card?.inEsm && !card?.inCm);
  const cmOnlyFamilyCards = familyCards.filter((card) => !card?.inEsm && card?.inCm);
  const zoomKeys = [...new Set([
    ...Object.keys(payload?.esm?.zoomCounts || {}),
    ...Object.keys(payload?.cmu?.zoomCounts || {}),
  ])].sort((left, right) => left.localeCompare(right));
  const liveSignals = payload?.live && typeof payload.live === "object" ? payload.live : null;
  const liveVerdict = liveSignals?.verdict && typeof liveSignals.verdict === "object" ? liveSignals.verdict : null;
  const liveEsm = liveSignals?.esm && typeof liveSignals.esm === "object" ? liveSignals.esm : null;
  const liveCmu = liveSignals?.cmu && typeof liveSignals.cmu === "object" ? liveSignals.cmu : null;
  return {
    incidentId: String(payload?.incidentId || "CMUEMU").trim() || "CMUEMU",
    mediaCompany: String(payload?.programmerName || state.programmerName || "Selected Media Company").trim(),
    requestorLabel:
      Array.isArray(payload?.requestorIds) && payload.requestorIds.length > 0 ? payload.requestorIds.join(", ") : "All requestors",
    mvpdLabel: String(payload?.mvpdLabel || state.mvpdLabel || "All MVPDs").trim(),
    tenantScope: String(payload?.tenantScope || state.tenantScope || "").trim(),
    esmAppName: String(payload?.esmAppName || state.esmAppName || "").trim() || "ESM app pending",
    cmTenantNames: Array.isArray(payload?.cmTenantNames) ? payload.cmTenantNames.filter(Boolean) : [],
    profileLabel:
      String(payload?.profileHarvest?.requestorId || "").trim() && String(payload?.profileHarvest?.mvpd || "").trim()
        ? `${String(payload.profileHarvest.requestorId || "").trim()} x ${String(payload.profileHarvest.mvpd || "").trim()}`
        : String(state.requestorMvpdLabel || "").trim(),
    upstreamUserId: String(payload?.profileHarvest?.upstreamUserId || "").trim(),
    esmEndpointCount: Number(payload?.esm?.endpointCount || 0),
    cmuEndpointCount: Number(payload?.cmu?.endpointCount || 0),
    cmApplicationsCount: Number(payload?.cmu?.applicationsCount || 0),
    cmPoliciesCount: Number(payload?.cmu?.policiesCount || 0),
    cmTenantsCount: Number(payload?.cmu?.tenantsCount || 0),
    usageRecordCount: Number(payload?.cmu?.usageRecordCount || 0),
    sharedFamilyCards,
    esmOnlyFamilyCards,
    cmOnlyFamilyCards,
    sharedRawTokens: Array.isArray(payload?.fusion?.sharedRawTokens) ? payload.fusion.sharedRawTokens : [],
    overlapPairs,
    strongestPair: payload?.fusion?.strongestPair && typeof payload.fusion.strongestPair === "object" ? payload.fusion.strongestPair : null,
    stories: Array.isArray(payload?.fusion?.stories) ? payload.fusion.stories : [],
    liveVerdictLabel: String(liveVerdict?.label || "").trim(),
    liveVerdictTone: String(liveVerdict?.tone || "muted").trim(),
    liveConfidencePct: Number(liveVerdict?.confidencePct || 0),
    liveHeadline: String(liveVerdict?.headline || "").trim(),
    liveSummary: String(liveVerdict?.summary || "").trim(),
    liveBullets: Array.isArray(liveVerdict?.bullets) ? liveVerdict.bullets : [],
    liveFocusMvpd: String(liveVerdict?.focusMvpd || payload?.mvpdLabel || state.mvpdLabel || "").trim(),
    liveFocusPlatform: String(liveVerdict?.focusPlatform || "").trim(),
    liveFocusTime: String(liveVerdict?.focusTime || "").trim(),
    liveAppleRows: Number(liveVerdict?.appleRows || 0),
    liveSampleCount: Number(liveVerdict?.sampleCount || 0),
    liveEsmRows: Number(liveEsm?.totalRows || 0),
    liveCmuRows: Number(liveCmu?.totalRows || 0),
    liveEsmReportsOk: Number(liveEsm?.successCount || 0),
    liveCmuReportsOk: Number(liveCmu?.successCount || 0),
    liveEsmReportsFailed: Number(liveEsm?.failedCount || 0),
    liveCmuReportsFailed: Number(liveCmu?.failedCount || 0),
    liveEsmPrimaryMetricKey: String(liveEsm?.primaryMetric?.key || "").trim(),
    liveEsmPrimaryMetricValue: Number(liveEsm?.primaryMetric?.value || 0),
    liveCmuPrimaryMetricKey: String(liveCmu?.primaryMetric?.key || "").trim(),
    liveCmuPrimaryMetricValue: Number(liveCmu?.primaryMetric?.value || 0),
    liveTopMvpds: Array.isArray(liveEsm?.topMvpds) || Array.isArray(liveCmu?.topMvpds)
      ? [...(Array.isArray(liveEsm?.topMvpds) ? liveEsm.topMvpds : []), ...(Array.isArray(liveCmu?.topMvpds) ? liveCmu.topMvpds : [])]
      : [],
    liveTopPlatforms: Array.isArray(liveEsm?.topPlatforms) || Array.isArray(liveCmu?.topPlatforms)
      ? [...(Array.isArray(liveEsm?.topPlatforms) ? liveEsm.topPlatforms : []), ...(Array.isArray(liveCmu?.topPlatforms) ? liveCmu.topPlatforms : [])]
      : [],
    esmLiveReportSummaries: Array.isArray(liveEsm?.reportSummaries) ? liveEsm.reportSummaries : [],
    cmuLiveReportSummaries: Array.isArray(liveCmu?.reportSummaries) ? liveCmu.reportSummaries : [],
    zoomRows: zoomKeys.map((zoomKey) => ({
      zoomKey,
      esmCount: Number(payload?.esm?.zoomCounts?.[zoomKey] || 0),
      cmuCount: Number(payload?.cmu?.zoomCounts?.[zoomKey] || 0),
    })),
    esmSampleEndpoints: Array.isArray(payload?.esm?.sampleEndpoints) ? payload.esm.sampleEndpoints : [],
    cmuSampleEndpoints: Array.isArray(payload?.cmu?.sampleEndpoints) ? payload.cmu.sampleEndpoints : [],
    sourceLabels: [String(payload?.esm?.source || "").trim(), String(payload?.cmu?.source || "").trim()].filter(Boolean),
  };
}

function formatMetricLabel(metricKey = "") {
  return String(metricKey || "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildLiveFusionHero(model) {
  const strongestPair = model?.strongestPair;
  const strongestPairLabel = strongestPair
    ? `${String(strongestPair.esmPathParts?.join(" / ") || strongestPair.esmLabel || "").trim()} ↔ ${String(
        strongestPair.cmPathParts?.join(" / ") || strongestPair.cmLabel || ""
      ).trim()}`
    : "No overlapping ESM/CMU pair discovered yet";
  return `
    <section class="hero-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Live CMUEMU Fusion</h2>
          <p class="panel-subtitle">Merged from the active ESM endpoint catalog and the active CMU usage catalog for the selected Media Company.</p>
        </div>
        <div class="panel-badges">
          <span class="panel-badge">${escapeHtml(model.incidentId)}</span>
          <span class="panel-badge is-spec">${escapeHtml(model.liveVerdictLabel || "Live data merge")}</span>
        </div>
      </div>
      <div class="meta-chip-row">
        <span class="meta-chip">Media Company: ${escapeHtml(model.mediaCompany)}</span>
        <span class="meta-chip">Requestor(s): ${escapeHtml(model.requestorLabel)}</span>
        <span class="meta-chip">MVPD: ${escapeHtml(model.mvpdLabel)}</span>
        <span class="meta-chip">ESM app: ${escapeHtml(model.esmAppName)}</span>
        <span class="meta-chip">CM tenant(s): ${escapeHtml(model.cmTenantNames.join(", ") || model.tenantScope || "pending")}</span>
      </div>
      <div class="metric-grid" style="margin-top:14px;">
        <article class="metric-card">
          <span class="metric-label">Live Verdict</span>
          <span class="metric-value">${escapeHtml(model.liveVerdictLabel || "Pending")}</span>
          <span class="metric-note">${escapeHtml(model.liveHeadline || "Waiting for live CMUEMU report sweep.")}</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Confidence</span>
          <span class="metric-value">${model.liveConfidencePct || 0}%</span>
          <span class="metric-note">${escapeHtml(model.liveSummary || "Confidence is based on the current live ESM and CMU sweep.")}</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Live Rows</span>
          <span class="metric-value">${model.liveSampleCount}</span>
          <span class="metric-note">ESM rows ${model.liveEsmRows} | CMU rows ${model.liveCmuRows}</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Focus Cohort</span>
          <span class="metric-value">${escapeHtml(model.liveFocusPlatform || "Unclear")}</span>
          <span class="metric-note">${escapeHtml(model.liveFocusMvpd || "All MVPDs")} | Peak ${escapeHtml(model.liveFocusTime || "Current window")}</span>
        </article>
      </div>
      <div class="split-grid" style="margin-top:14px;">
        <div class="story-block">
          <strong>Live story:</strong> ${escapeHtml(model.liveSummary || "Live row-level story will appear after the CMUEMU sweep completes.")}
        </div>
        <div class="story-block">
          <strong>Topology still available:</strong> ${model.cmApplicationsCount} CM applications, ${model.cmPoliciesCount} CM policies, ${model.cmuEndpointCount} CMU report paths, and ${model.esmEndpointCount} ESM report paths remain available below for deeper overlap analysis. Best pair: ${escapeHtml(strongestPairLabel)}
        </div>
      </div>
    </section>
  `;
}

function buildLiveDataPulsePanel(model) {
  const verdictToneClass =
    model.liveVerdictTone === "red"
      ? "is-red"
      : model.liveVerdictTone === "green"
        ? "is-green"
        : model.liveVerdictTone === "amber"
          ? "is-amber"
          : "is-muted";
  return `
    <section class="deliverable-panel">
      <h3>Live Data Pulse</h3>
      <p>These cards are driven by the current CMUEMU sweep, not by endpoint topology alone.</p>
      <div class="metric-grid" style="margin-top:14px;">
        <article class="metric-card">
          <span class="metric-label">Verdict</span>
          <span class="metric-value">${escapeHtml(model.liveVerdictLabel || "Pending")}</span>
          <span class="metric-note"><span class="heat-chip ${verdictToneClass}">${escapeHtml(model.liveVerdictTone || "muted")}</span></span>
        </article>
        <article class="metric-card">
          <span class="metric-label">ESM Lead Metric</span>
          <span class="metric-value">${model.liveEsmPrimaryMetricValue}</span>
          <span class="metric-note">${escapeHtml(formatMetricLabel(model.liveEsmPrimaryMetricKey || "No metric"))}</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">CMU Lead Metric</span>
          <span class="metric-value">${model.liveCmuPrimaryMetricValue}</span>
          <span class="metric-note">${escapeHtml(formatMetricLabel(model.liveCmuPrimaryMetricKey || "No metric"))}</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Apple Markers</span>
          <span class="metric-value">${model.liveAppleRows}</span>
          <span class="metric-note">Rows whose live platform fields indicate Apple cohorts.</span>
        </article>
      </div>
      <ul class="list-block" style="margin-top:14px;">
        ${model.liveBullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function buildLiveReportSweepPanel(model) {
  const renderCards = (items = [], title = "", sourceEmpty = "") => `
    <div>
      <h4>${escapeHtml(title)}</h4>
      ${
        !Array.isArray(items) || items.length === 0
          ? `<p class="note-block">${escapeHtml(sourceEmpty)}</p>`
          : `<div class="hero-stack">
              ${items
                .map(
                  (item) => `
                    <article class="story-block">
                      <strong>${escapeHtml(item.pathLabel || item.label || "Report")}</strong>
                      <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                        <span class="heat-chip ${item.error ? "is-red" : "is-green"}">${item.error ? "Error" : `${item.rowCount} rows`}</span>
                        <span class="heat-chip is-muted">${escapeHtml(item.zoomKey || "UNSCOPED")}</span>
                        <span class="heat-chip is-amber">${escapeHtml(formatMetricLabel(item.primaryMetric?.key || "No metric"))}: ${Number(
                          item.primaryMetric?.value || 0
                        )}</span>
                      </div>
                      <p class="cue-card-meta">
                        ${escapeHtml(
                          item.error ||
                            `Top MVPD: ${item.topMvpd?.value || "n/a"} | Top platform: ${item.topPlatform?.value || "n/a"} | Peak: ${
                              item.topTime?.value || "n/a"
                            } | Apple rows: ${Number(item.appleRows || 0)}`
                        )}
                      </p>
                    </article>
                  `
                )
                .join("")}
            </div>`
      }
    </div>
  `;

  return `
    <section class="deliverable-panel">
      <h3>Live Report Sweep</h3>
      <p>CMUEMU now fetches a focused set of overlapping ESM and CMU reports and compresses the returned rows into source-level evidence cards.</p>
      <div class="split-grid">
        ${renderCards(model.esmLiveReportSummaries, "ESM Fetches", "No live ESM reports were fetched.")}
        ${renderCards(model.cmuLiveReportSummaries, "CMU Fetches", "No live CMU reports were fetched.")}
      </div>
    </section>
  `;
}

function buildFamilyCoveragePanel(model) {
  const rows = [...model.sharedFamilyCards, ...model.esmOnlyFamilyCards, ...model.cmOnlyFamilyCards];
  return `
    <section class="deliverable-panel">
      <h3>Intersection Lenses</h3>
      <p>This matrix shows where ESM and CMU can tell the same story slice and where one service fills a gap the other cannot.</p>
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Lens</th>
            <th>ESM</th>
            <th>CMU</th>
            <th>Use in CMUEMU</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
              <tr>
                <td>${escapeHtml(row.label)}</td>
                <td><span class="heat-chip ${row.inEsm ? "is-green" : "is-muted"}">${row.inEsm ? "Present" : "Missing"}</span></td>
                <td><span class="heat-chip ${row.inCm ? "is-green" : "is-muted"}">${row.inCm ? "Present" : "Missing"}</span></td>
                <td>${escapeHtml(row.summary || "")}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
      <div class="legend-row">
        <span class="legend-chip is-green">Shared = merged story</span>
        <span class="legend-chip is-muted">Single-service only = gap or specialty</span>
      </div>
    </section>
  `;
}

function buildOverlapPairsPanel(model) {
  const rows = model.overlapPairs.length > 0 ? model.overlapPairs : [];
  return `
    <section id="fusion-pairings" class="deliverable-panel">
      <h3>Strongest ESM ↔ CMU Pairings</h3>
      <p>These are the highest-scoring live pairings between current ESM and CMU paths, based on shared semantic dimensions and shared raw tokens.</p>
      ${
        rows.length === 0
          ? '<p class="note-block" style="margin-top:14px;">No strong overlap pairings were discovered from the current live catalogs.</p>'
          : `
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Score</th>
            <th>ESM Path</th>
            <th>CMU Path</th>
            <th>Shared Lenses</th>
            <th>Story Prompt</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (pair) => `
              <tr>
                <td>${Number(pair.score || 0)}</td>
                <td>${escapeHtml(String(pair.esmPathParts?.join(" / ") || pair.esmLabel || "").trim())}</td>
                <td>${escapeHtml(String(pair.cmPathParts?.join(" / ") || pair.cmLabel || "").trim())}</td>
                <td>${escapeHtml((Array.isArray(pair.sharedFamilies) ? pair.sharedFamilies : []).join(", "))}</td>
                <td>${escapeHtml(String(pair.question || "").trim())}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>`
      }
    </section>
  `;
}

function buildZoomCoveragePanel(model) {
  return `
    <section class="deliverable-panel">
      <h3>Zoom Coverage</h3>
      <p>Shared zoom coverage indicates whether both services can be compared at the same time granularity.</p>
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Zoom</th>
            <th>ESM Paths</th>
            <th>CMU Paths</th>
            <th>Coverage</th>
          </tr>
        </thead>
        <tbody>
          ${model.zoomRows
            .map((row) => {
              const shared = row.esmCount > 0 && row.cmuCount > 0;
              return `
                <tr>
                  <td>${escapeHtml(row.zoomKey)}</td>
                  <td>${row.esmCount}</td>
                  <td>${row.cmuCount}</td>
                  <td><span class="heat-chip ${shared ? "is-green" : row.esmCount > 0 || row.cmuCount > 0 ? "is-amber" : "is-muted"}">${
                    shared ? "Both" : row.esmCount > 0 || row.cmuCount > 0 ? "One side only" : "None"
                  }</span></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function buildMergedStoriesPanel(model) {
  const esmOnly = model.esmOnlyFamilyCards.map((card) => card.label).join(", ") || "None";
  const cmOnly = model.cmOnlyFamilyCards.map((card) => card.label).join(", ") || "None";
  return `
    <section class="deliverable-panel">
      <h3>Merged Story Seeds</h3>
      <p>These prompts combine the live row sweep with the overlap topology, so the workspace can tell you what happened and why those specific reports matter together.</p>
      <ul class="list-block" style="margin-top:14px;">
        ${[...(Array.isArray(model.liveBullets) ? model.liveBullets : []), ...(Array.isArray(model.stories) ? model.stories : [])]
          .slice(0, 8)
          .map((story) => `<li>${escapeHtml(story)}</li>`)
          .join("")}
      </ul>
      <div class="split-grid" style="margin-top:14px;">
        <div class="story-block">
          <strong>ESM-only depth:</strong> ${escapeHtml(esmOnly)}. Use ESM alone when you need playback/auth diagnostics or content-specific details that CMU does not expose.
        </div>
        <div class="story-block">
          <strong>CMU-only depth:</strong> ${escapeHtml(cmOnly)}. Use CMU alone when you need concurrency/session pressure and tenant policy context that ESM does not expose.
        </div>
      </div>
      <p class="note-block" style="margin-top:14px;"><strong>Current profile context:</strong> ${escapeHtml(model.profileLabel || "No captured MVPD profile")} ${
        model.upstreamUserId ? `| upstreamUserID=${escapeHtml(model.upstreamUserId)}` : ""
      }</p>
    </section>
  `;
}

function buildEndpointSurfacePanel(model) {
  const renderEndpointList = (items = [], emptyLabel = "") => {
    if (!Array.isArray(items) || items.length === 0) {
      return `<p class="note-block">${escapeHtml(emptyLabel)}</p>`;
    }
    return `
      <div class="hero-stack">
        ${items
          .map((entry) => {
            const pathLabel = String(entry?.pathParts?.join(" / ") || entry?.label || "").trim();
            const zoomLabel = String(entry?.zoomKey || "").trim() || "UNSCOPED";
            const lensLabel = Array.isArray(entry?.familyKeys) ? entry.familyKeys.join(", ") : "";
            return `
              <article class="story-block">
                <strong>${escapeHtml(pathLabel || "Unnamed endpoint")}</strong>
                <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                  <span class="heat-chip is-green">${escapeHtml(zoomLabel)}</span>
                  <span class="heat-chip is-muted">${escapeHtml(lensLabel || "No mapped lenses")}</span>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  };

  return `
    <section class="deliverable-panel">
      <h3>Live Endpoint Surface</h3>
      <p>These are the actual active ESM and CMU report paths currently contributing to the merged CMUEMU story for this programmer.</p>
      <div class="split-grid">
        <div>
          <h4>ESM Sample Paths</h4>
          ${renderEndpointList(model.esmSampleEndpoints, "No ESM endpoints were available from the active catalog.")}
        </div>
        <div>
          <h4>CMU Sample Paths</h4>
          ${renderEndpointList(model.cmuSampleEndpoints, "No CMU endpoints were available from the active catalog.")}
        </div>
      </div>
    </section>
  `;
}

function buildFusionEvidencePanel(model) {
  const sharedTokens = Array.isArray(model.sharedRawTokens) ? model.sharedRawTokens.slice(0, 28) : [];
  return `
    <section class="deliverable-panel">
      <h3>Operational Readout</h3>
      <p>CMUEMU is built from live source catalogs and exposes the strongest common pivots that can tell the same incident story from both services.</p>
      <div class="split-grid">
        <div class="story-block">
          <strong>Source provenance:</strong> ${escapeHtml(model.sourceLabels.join(" + ") || "Live source labels unavailable")}.
          This tells you whether the merge came from already-open workspaces or freshly rebuilt side-panel catalogs.
        </div>
        <div class="story-block">
          <strong>Shared tokens driving the merge:</strong> ${escapeHtml(sharedTokens.join(", ") || "No shared raw tokens surfaced.")}
        </div>
      </div>
      <p class="note-block" style="margin-top:14px;">
        <strong>Interpretation rule:</strong> CMUEMU is not fabricating joins. It only highlights slices where both catalogs expose compatible pivots,
        then elevates the strongest overlaps for analyst review.
      </p>
    </section>
  `;
}

function buildFusionLoadingState() {
  return `
    <section class="hero-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Resolving Live CMUEMU Fusion</h2>
          <p class="panel-subtitle">UnderPAR is comparing the active ESM catalog with the active CMU usage catalog for the selected Media Company.</p>
        </div>
        <div class="panel-badges">
          <span class="panel-badge">CMUEMU</span>
          <span class="panel-badge is-spec">Live fetch</span>
        </div>
      </div>
      <div class="metric-grid" style="margin-top:14px;">
        <article class="metric-card">
          <span class="metric-label">Media Company</span>
          <span class="metric-value">${escapeHtml(state.programmerName || "Resolving")}</span>
          <span class="metric-note">Current selected programmer context.</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Requestor</span>
          <span class="metric-value">${escapeHtml(state.requestorId || "All")}</span>
          <span class="metric-note">Current requestor slice from UnderPAR context.</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">MVPD</span>
          <span class="metric-value">${escapeHtml(state.mvpdId || state.mvpdLabel || "All")}</span>
          <span class="metric-note">Current MVPD slice from UnderPAR context.</span>
        </article>
        <article class="metric-card">
          <span class="metric-label">Tenant Scope</span>
          <span class="metric-value">${escapeHtml(state.tenantScope || "Resolving")}</span>
          <span class="metric-note">Current CM scope candidate while fusion is loading.</span>
        </article>
      </div>
    </section>
  `;
}

function buildFusionErrorPanel() {
  return `
    <section class="hero-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">CMUEMU Fusion Failed</h2>
          <p class="panel-subtitle">The workspace could not build a merged ESM + CMU investigative surface for the current selection.</p>
        </div>
        <div class="panel-badges">
          <span class="panel-badge is-partial">Needs attention</span>
        </div>
      </div>
      <p class="note-block">${escapeHtml(state.fusionError || "Unknown CMUEMU fusion failure.")}</p>
    </section>
  `;
}

async function hydrateFusionPayload(options = {}) {
  if (!state.cmuemuAvailabilityResolved || !state.cmuemuAvailable || !state.cmuemuContainerVisible) {
    return;
  }
  const force = options?.force === true;
  const refreshKey = getFusionRefreshKey();
  if (!refreshKey) {
    return;
  }
  if (!force && state.fusionLoading && state.fusionRequestKey === refreshKey) {
    return;
  }
  if (!force && state.fusionPayload && state.lastFusionKey === refreshKey) {
    return;
  }

  state.fusionLoading = true;
  state.fusionError = "";
  state.fusionRequestKey = refreshKey;
  if (force || state.lastFusionKey !== refreshKey) {
    applyFusionPayload(null);
  }
  syncRefreshButtonState();
  setStatus("Resolving live CMUEMU fusion from ESM and CMU catalogs...", "success");
  renderFromState();

  try {
    const result = await sendWorkspaceAction("resolve-fusion");
    if (!result?.ok || !result?.payload) {
      throw new Error(String(result?.error || "CMUEMU fusion returned no payload."));
    }
    applyFusionPayload(result.payload);
    state.lastFusionKey = refreshKey;
    state.fusionError = "";
    const sharedLensCount = Array.isArray(result?.payload?.fusion?.sharedFamilyKeys) ? result.payload.fusion.sharedFamilyKeys.length : 0;
    setStatus(
      `Live fusion ready. ${Number(result?.payload?.esm?.endpointCount || 0)} ESM paths, ${Number(
        result?.payload?.cmu?.endpointCount || 0
      )} CMU paths, ${sharedLensCount} shared lenses.`,
      "success"
    );
  } catch (error) {
    state.fusionError = error instanceof Error ? error.message : String(error || "Unknown CMUEMU fusion failure.");
    applyFusionPayload(null);
    setStatus(state.fusionError, "error");
  } finally {
    state.fusionLoading = false;
    state.fusionRequestKey = "";
    syncRefreshButtonState();
    renderFromState();
  }
}

function buildSparklineBars(ctx) {
  return ctx.sparklineHeights
    .map((height, index) => `<span class="sparkline-bar" style="height:${Math.max(18, Number(height) || 18)}px" title="Day ${index + 1}"></span>`)
    .join("");
}

function buildIncidentCanvas(ctx) {
  return `
    <section class="hero-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">1. Incident Canvas</h2>
          <p class="panel-subtitle">Single-page executive answer sheet for ${escapeHtml(ctx.incidentId)} using a default ${ctx.timeWindowDays}-day window.</p>
        </div>
        <div class="panel-badges">
          <span class="panel-badge is-partial">Executive Verdict: ${escapeHtml(ctx.verdict.label)} · ${ctx.verdict.confidencePct}%</span>
          <span class="panel-badge is-spec">${escapeHtml(ctx.verdict.badge)}</span>
        </div>
      </div>
      <div class="meta-chip-row">
        <span class="meta-chip">Media Company: ${escapeHtml(ctx.mediaCompany)}</span>
        <span class="meta-chip">MVPD focus: ${escapeHtml(ctx.mvpdLabel)}</span>
        <span class="meta-chip">Requestor: ${escapeHtml(ctx.requestorLabel)}</span>
        <span class="meta-chip">ESM app: ${escapeHtml(ctx.esmAppName)}</span>
        <span class="meta-chip">CM tenant: ${escapeHtml(ctx.cmTenantNames.join(", "))}</span>
        <span class="meta-chip">Local timezone: ${escapeHtml(CLIENT_TIMEZONE)}</span>
      </div>
      <div class="priority-chip-row">
        <span class="priority-chip">Priority: playback_success_rate</span>
        <span class="priority-chip">Priority: concurrency_block_rate</span>
        <span class="priority-chip">Priority: failed_auth_rate</span>
        <span class="priority-chip">Priority: device_type / platform / region / time_bucket</span>
      </div>
      <div class="hero-grid" style="margin-top:14px;">
        <div class="hero-stack">
          <div class="metric-grid">
            <article class="metric-card">
              <span class="metric-label">Executive Verdict</span>
              <span class="metric-value">${escapeHtml(ctx.verdict.label)}</span>
              <span class="metric-note">Yes/No/Partial answer at a glance. Current default is Partial until lead/lag and significance rules are satisfied.</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Confidence</span>
              <span class="metric-value">${ctx.verdict.confidencePct}%</span>
              <span class="metric-note">Do not claim causation above 70% unless sample_count ≥ 50 and lead/lag > 2 minutes with p &lt; 0.05.</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Starting Point</span>
              <span class="metric-value">${escapeHtml(ctx.firstSpikeIso)}</span>
              <span class="metric-note">First observed spike marker. Also render ${escapeHtml(ctx.firstSpikeLocal)} for agents in local time.</span>
            </article>
            <article class="metric-card">
              <span class="metric-label">Fix ETA Impact</span>
              <span class="metric-value">~1 month</span>
              <span class="metric-note">Use temporary policy/routing mitigations while release and certification complete.</span>
            </article>
          </div>
          <p class="story-block">
            <strong>Quick rationale:</strong> Apple playback blocks may be a bug, valid CM enforcement, or a mixed condition. CMUEMU combines ESM errors,
            CM ruleset matches, and popularity/traffic anomalies so analysts can stop arguing from partial views and move to a defensible decision with confidence bands.
          </p>
          <div class="sparkline-card">
            <div class="sparkline-head">
              <span class="sparkline-label">Timeline sparkline · when it started, where it peaked</span>
              <span class="sparkline-window">${escapeHtml(ctx.timeWindowLabel)}</span>
            </div>
            <div class="sparkline-bars">${buildSparklineBars(ctx)}</div>
          </div>
          <div class="split-grid">
            <div class="story-block">
              <strong>Where seen:</strong> Focus first on ${escapeHtml(ctx.mvpdLabel)} and compare it against peer MVPD baselines, Apple iPhone / iPad / Apple TV,
              high-concurrency content, and evening traffic. If peers stay green while the focus MVPD goes red, treat that as isolation evidence rather than ecosystem-wide regression.
            </div>
            <div class="story-block">
              <strong>Who affected:</strong> Top cohorts should be presented as anonymized user and device clusters such as ${escapeHtml(ctx.hashedUsers[0])},
              ${escapeHtml(ctx.hashedUsers[1])}, and ${escapeHtml(ctx.hashedDevices[0])}. Public artifacts never show raw user_id, email, or device identifiers.
            </div>
          </div>
        </div>
        <div class="side-stack">
          <div class="story-block">
            <strong>Suggested Immediate Actions</strong>
            <ol class="action-list">
              <li>Run the Root-cause Triage Matrix before assigning blame; require all three signal groups.</li>
              <li>Compare ${escapeHtml(ctx.mvpdLabel)} against 3 peer MVPD rows and Apple vs non-Apple cohorts over the same window.</li>
              <li>If the bug branch wins, escalate hotfix path immediately; if CM branch wins, review temporary ruleset or pool changes while the 1-month fix is in flight.</li>
            </ol>
          </div>
          <div class="story-block">
            <strong>Resolution point template</strong><br />
            Declare resolved only after the highlighted Apple + ${escapeHtml(ctx.mvpdLabel)} cohort returns to baseline for 7 straight days, stays below 1.1x historical block-rate,
            and shows no recurrence after the planned release target of ${escapeHtml(ctx.releaseTargetIso)}.
          </div>
          <pre class="ascii-block">+---------------------------------------------------------------+
| Verdict | Rationale | Where seen | Start | Peak | Resolution   |
|---------+-----------+------------+-------+------+--------------|
| Who affected        | Immediate actions      | Fix ETA impact  |
| Timeline sparkline  | MVPD spread            | Confidence      |
+---------------------------------------------------------------+</pre>
        </div>
      </div>
    </section>
  `;
}

function buildTriageMatrix(ctx) {
  const cards = [
    {
      klass: "is-bug",
      label: "Bug suspected",
      title: "Branch A · Adobe or client defect",
      signals: [
        "ESM playback/client error codes spike 2+ minutes before CM blocks and persist across multiple sessions (sample_count ≥ 50, p < 0.05).",
        "Single app_version or OS version spike on Apple only, with repeated error signature and retry loop evidence.",
        "CM ruleset matches do not increase proportionally, or blocks follow client error bursts rather than precede them.",
      ],
      action: "If X then Y: escalate hotfix path, isolate Apple build/version, notify Programmer that enforcement may be secondary fallout.",
    },
    {
      klass: "is-policy",
      label: "CM working",
      title: "Branch B · Concurrency Monitoring enforcing policy",
      signals: [
        "High concurrency blocks align with ruleset or tenant policy matches while ESM error rate stays near baseline.",
        "Traffic/popularity anomaly is concentrated around a few content IDs or windows, suggesting legitimate demand surge or piracy pressure.",
        "MVPD policy configuration or entitlement data matches the exact block pattern and there is no simultaneous client error signature.",
      ],
      action: "If X then Y: advise MVPD/Product on temporary policy tuning, capacity/pool review, or exception window; keep monitoring for false blocks.",
    },
    {
      klass: "is-mixed",
      label: "Mixed condition",
      title: "Branch C · Bug plus legitimate enforcement",
      signals: [
        "ESM errors rise first, then CM blocks amplify because retries or duplicate sessions increase concurrency counts.",
        "Only some MVPDs or Apple app versions show high client errors, but popular content also drives real concurrency pressure.",
        "Remediation requires both code fix and ruleset review; neither branch alone fully explains the timeline.",
      ],
      action: "If X then Y: split mitigation into two tracks: code fix for the defect and temporary ruleset / communications plan for enforcement pressure.",
    },
  ];
  return `
    <section class="deliverable-panel">
      <h3>2. Decision Panel — Root-cause Triage Matrix</h3>
      <p>Blocker score formula: <strong>Blocker_Score = 0.5*ESM_error_signal + 0.3*RuleMismatch_signal + 0.2*Popularity_signal</strong>. Tune upward for ESM when reproducible client diagnostics exist; tune upward for ruleset when exact CM matches dominate and ESM stays clean.</p>
      <div class="decision-grid">
        ${cards
          .map(
            (card) => `
            <article class="decision-card ${card.klass}">
              <span class="decision-label">${escapeHtml(card.label)}</span>
              <h4>${escapeHtml(card.title)}</h4>
              <ol class="signal-list">
                ${card.signals.map((signal) => `<li>${escapeHtml(signal)}</li>`).join("")}
              </ol>
              <p class="cue-card-meta">${escapeHtml(card.action)}</p>
            </article>
          `
          )
          .join("")}
      </div>
      <p class="note-block" style="margin-top:14px;">Time-lag rule for causal inference: only claim a causal bug when the ESM error spike clearly precedes the CM block spike by more than 2 minutes and reproduces across multiple sessions with sample_count ≥ 50 and p &lt; 0.05.</p>
    </section>
  `;
}

function buildCrossMvpdPanel(ctx) {
  const rows = [
    [ctx.mvpdLabel, "Red (z=3.4)", "Red (z=3.1)", "Amber (z=1.8)", "Muted (&lt;30 samples)"],
    ["Peer MVPD A", "Green (z=0.4)", "Green (z=0.2)", "Green (z=0.1)", "Green (z=0.3)"],
    ["Peer MVPD B", "Amber (z=1.6)", "Green (z=0.8)", "Green (z=0.4)", "Muted (&lt;30 samples)"],
    ["Peer MVPD C", "Green (z=0.3)", "Green (z=0.2)", "Green (z=0.2)", "Green (z=0.5)"],
  ];
  const chipClassForValue = (value) => {
    const text = String(value || "").toLowerCase();
    if (text.includes("red")) return "is-red";
    if (text.includes("amber")) return "is-amber";
    if (text.includes("green")) return "is-green";
    return "is-muted";
  };
  return `
    <section class="deliverable-panel">
      <h3>3. Cross-MVPD Trend Panel</h3>
      <p>Visualization spec: MVPDs on Y, device/platform buckets on X, color = normalized block-rate anomaly versus baseline. Click an MVPD row to reveal time series, top content IDs, and exact ESM/CM signal mix.</p>
      <table class="matrix-table">
        <thead>
          <tr>
            <th>MVPD</th>
            <th>iOS</th>
            <th>tvOS</th>
            <th>Safari</th>
            <th>Desktop</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
              <tr>
                <td>${escapeHtml(row[0])}</td>
                ${row
                  .slice(1)
                  .map((value) => `<td><span class="heat-chip ${chipClassForValue(value)}">${value}</span></td>`)
                  .join("")}
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
      <div class="legend-row">
        <span class="legend-chip is-red">Red · z &gt; 2</span>
        <span class="legend-chip is-amber">Amber · 1 ≤ z ≤ 2</span>
        <span class="legend-chip is-green">Green · z &lt; 1</span>
        <span class="legend-chip is-muted">Muted · sample_count &lt; 30</span>
      </div>
      <p class="note-block" style="margin-top:14px;">Interaction spec: row click opens an inline time series, top contributing content IDs, and a side-by-side compare against non-Apple peers. Fallback when sample_count &lt; 30: show muted chip plus “low confidence” label instead of a trend call.</p>
    </section>
  `;
}

function buildBreadthDepthLocator() {
  const rows = [
    ["device_type", "Small-multiples line charts", "2x baseline or z > 2", "Apple TV spike begins here at 20:00 local; compare with iPhone and iPad."],
    ["OS version", "Stacked bars by major/minor version", "Single-version share > 40% of impacted cohort", "iOS 17.2 now represents 46% of the block anomaly."],
    ["app_version", "Ranked bar + release marker", "One version causes > 50% of anomaly", "App v5.2.1 owns 58% of affected Apple sessions."],
    ["CDN / DC", "Heat map by region and DC", "Block-rate > 1.5x peer DC", "US-West-2 shows 1.9x block rate relative to East."],
    ["geo", "Choropleth or ranked region list", "2x baseline by region", "Puerto Rico region blocks doubled after prime-time peak."],
    ["content_id", "Top-N ranked tiles", "Top 3 IDs contribute > 60% of anomaly", "Content IDs C123/C456/C789 drive 68% of events."],
    ["time_of_day", "24-hour heatmap", "Hot band in 2+ consecutive windows", "18:00–23:00 local remains red for 4 nights."],
    ["session_length", "Box plot / duration histogram", "Median session drops or retries surge", "Impacted sessions collapse from 42m to 11m."],
    ["auth_method", "Grouped bar by auth path", "One method > 2x failure baseline", "Clientless auth path is 2.3x normal for Apple."],
  ];
  return `
    <section class="deliverable-panel">
      <h3>4. Breadth &amp; Depth Locator</h3>
      <p>Prioritized dimensions to spot where else the trend lives and what visualization should carry each diagnostic slice.</p>
      <table class="locator-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Visualization</th>
            <th>Trigger rule</th>
            <th>Sample tooltip</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
              <tr>
                <td>${escapeHtml(row[0])}</td>
                <td>${escapeHtml(row[1])}</td>
                <td>${escapeHtml(row[2])}</td>
                <td>${escapeHtml(row[3])}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function buildSituationMatrix(ctx) {
  return `
    <section class="deliverable-panel">
      <h3>5. Full Situation Matrix</h3>
      <p>Populate WHAT / WHERE / WHEN / WHO plus START and RESOLUTION rules on every incident so stakeholders stop free-form debating.</p>
      <table class="situation-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Template</th>
            <th>Sample filled value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WHAT</td>
            <td>blocked_playback_count / total_playback_requests</td>
            <td>4,980 / 103,200 = 4.8% blocked playback rate within ${escapeHtml(ctx.timeWindowLabel)}</td>
          </tr>
          <tr>
            <td>WHERE</td>
            <td>MVPD(s), DC(s), platform(s)</td>
            <td>${escapeHtml(ctx.mvpdLabel)} · US-West-2 and US-East-1 · iPhone, iPad, Apple TV</td>
          </tr>
          <tr>
            <td>WHEN</td>
            <td>Time window + first-seen timestamp (ISO)</td>
            <td>${escapeHtml(ctx.timeWindowLabel)} · first seen ${escapeHtml(ctx.firstSpikeIso)}</td>
          </tr>
          <tr>
            <td>WHO</td>
            <td>Top affected cohorts</td>
            <td>${escapeHtml(ctx.hashedUsers[0])}, ${escapeHtml(ctx.hashedUsers[1])}, Apple app v5.2.x, cohort size ${ctx.affectedUsersCount}</td>
          </tr>
          <tr>
            <td>START</td>
            <td>First spike timestamp + evidence</td>
            <td>Apple sessions on ${escapeHtml(ctx.mvpdLabel)} increase 3.1x at ${escapeHtml(ctx.firstSpikeIso)} with matching block-rate anomaly.</td>
          </tr>
          <tr>
            <td>RESOLUTION</td>
            <td>Sustained drop to baseline for 7 days + no recurring spikes</td>
            <td>Hold green for 7 straight days after release target ${escapeHtml(ctx.releaseTargetIso)} and keep block-rate within 1.1x baseline.</td>
          </tr>
        </tbody>
      </table>
    </section>
  `;
}

function buildNarrativeSection(ctx) {
  const narrativeObjects = [
    {
      id: `${ctx.incidentId}-001`,
      title: "Executive Summary",
      summary: `Within ${ctx.timeWindowLabel}, Apple cohorts show elevated playback blocks for ${ctx.mvpdLabel}. CMUEMU verdict is Partial at ${ctx.verdict.confidencePct}% until lead/lag and significance rules are satisfied.`,
      narrative:
        "ESM diagnostics, CM block patterns, and traffic pressure should be reviewed together. Do not label Adobe code as the blocker unless ESM errors lead the CM block spike by more than 2 minutes and repeat across enough sessions to clear the confidence gate.",
      agent_script: [
        "State that the issue is under active triage and we are separating bug evidence from valid policy enforcement.",
        "Confirm the affected Apple device types, app versions, and content IDs before escalating.",
        "Share that public incident artifacts use anonymized IDs only.",
      ],
      customer_message:
        "We are actively investigating playback blocks affecting some Apple viewers and are comparing application diagnostics with concurrency-enforcement telemetry to isolate the cause.",
      confidence_pct: ctx.verdict.confidencePct,
      sample_count: ctx.sampleCount,
      time_window: ctx.timeWindowLabel,
      references: ctx.references,
    },
    {
      id: `${ctx.incidentId}-002`,
      title: "Agent Brief",
      summary: "Short-form agent summary with CM 101 framing and required metadata.",
      narrative:
        "Current evidence does not yet prove a single-cause blocker. Agents should explain that CM may be enforcing a valid rule while engineering confirms whether an Apple-specific defect is also contributing.",
      agent_script: [
        "Use confidence wording, not certainty wording.",
        "Always include sample_count and time_window.",
        "Name affected cohorts, not raw IDs.",
      ],
      customer_message: "We have identified the impacted cohorts and are validating whether the issue is a service defect, valid policy enforcement, or both.",
      confidence_pct: 60,
      sample_count: ctx.sampleCount,
      time_window: ctx.timeWindowLabel,
      references: [ctx.mvpdLabel, ctx.mediaCompany],
    },
    {
      id: `${ctx.incidentId}-003`,
      title: "Customer-Facing Message",
      summary: "Concise external-safe language with no internal blame call.",
      narrative:
        "We are actively investigating playback blocks affecting a subset of Apple viewers and are comparing application diagnostics with concurrency-enforcement telemetry so we can isolate the exact cause quickly and safely.",
      agent_script: [
        "Keep the wording plain and calm.",
        "Do not expose internal ruleset detail or raw identifiers.",
        "Offer follow-up once the verdict crosses the confidence gate.",
      ],
      customer_message:
        "We are investigating playback blocks affecting some Apple viewers and are working with the involved teams to isolate whether the issue is caused by application behavior, policy enforcement, or both.",
      confidence_pct: 55,
      sample_count: ctx.sampleCount,
      time_window: ctx.timeWindowLabel,
      references: [ctx.mvpdLabel, ctx.mediaCompany, ctx.firstSpikeIso],
    },
    {
      id: `${ctx.incidentId}-004`,
      title: "Post-Mortem Summary",
      summary: "Template for after-action review once release and stabilization complete.",
      narrative:
        "Summarize the starting point, verified root cause branch, mitigation timeline, customer impact, and the sustained seven-day stabilization proof. Document whether CM rules were correct, outdated, or amplified by a separate defect.",
      agent_script: [
        "Record actual fix version and deployment time.",
        "Capture whether temporary policy changes were used.",
        "Link the final incident matrix and trend comparisons.",
      ],
      customer_message:
        "The incident has been resolved and we have validated sustained return to baseline behavior after the corrective change.",
      confidence_pct: 92,
      sample_count: ctx.sampleCount,
      time_window: ctx.timeWindowLabel,
      references: [ctx.releaseTargetIso, ctx.mvpdLabel, ctx.mediaCompany],
    },
  ];
  const jsonl = narrativeObjects.map((item) => JSON.stringify(item)).join("\n");
  return `
    <section class="deliverable-panel">
      <h3>6. Narrative Engine Spec &amp; Story Templates</h3>
      <p>Every narrative must include sample_count, time_window, affected_users_count, MVPD list, and confidence_pct. Confidence wording rules: 90-100 = confirmed, 70-89 = high confidence, 50-69 = directional, below 50 = exploratory.</p>
      <p class="note-block" style="margin-top:14px;"><strong>CM 101 for agents:</strong> Concurrency Monitoring is the guardrail that limits simultaneous streams according to an agreed ruleset. It can be the cause of a visible block even when it is functioning correctly, which is why CMUEMU compares enforcement data with ESM client diagnostics before anyone labels the event as an Adobe bug.</p>
      <pre class="code-block" style="margin-top:14px; white-space:pre-wrap; overflow:auto;">${escapeHtml(jsonl)}</pre>
    </section>
  `;
}

function buildCueCards(ctx) {
  const cards = [
    {
      label: "Scenario A",
      title: "CM enforcing rules (high confidence)",
      copy: `Telemetry for ${ctx.mvpdLabel} shows a sharp Apple-only rise in concurrency blocks without a matching ESM playback or DRM error spike. That means CM is likely doing its job against an existing policy, not surfacing a new code defect. The analyst should explain that this is an enforcement pattern first, then validate whether the current ruleset still matches business intent. Ask whether the MVPD recently changed entitlement pools, whether the affected content IDs were unusually hot, and whether any non-Apple cohorts are blocked at the same time. Recommended next steps: review temporary policy tuning and provide anonymized timelines to the MVPD. Escalation link text: Open CM ruleset review in CMUEMU.` ,
    },
    {
      label: "Scenario B",
      title: "Bug suspected (high confidence)",
      copy: `ESM error signatures are the lead signal here. If Apple app version spikes begin before CM blocks and stay concentrated to a single build or OS segment, treat CM as downstream fallout rather than the root cause. Agents should say that evidence points toward an application or service defect and that CM appears to be blocking duplicate or retry-heavy sessions created by the bug. Ask which Apple app version is affected, whether player crashes or auth retries are also reported, and whether the same content fails on peer MVPDs. Recommended next steps: hotfix escalation plus tighter release rollback review. Escalation link text: Open Adobe bug branch in CMUEMU.` ,
    },
    {
      label: "Scenario C",
      title: "Mixed condition (medium confidence)",
      copy: `Some incidents are not clean. Apple diagnostics may show a real bug while popular content and old CM rules amplify the impact by turning retries into visible blocks. In that case, agents should not oversimplify. The correct message is that both code and enforcement pressure are contributing and two mitigations are running in parallel. Ask whether the affected content is especially high-demand, whether a temporary exception window is acceptable, and whether the same users are reappearing in multiple timelines. Recommended next steps: split work between hotfix delivery and ruleset review. Escalation link text: Open mixed mitigation plan in CMUEMU.` ,
    },
  ];
  return `
    <section class="deliverable-panel">
      <h3>7. Agent Cue-Card Examples</h3>
      <div class="cue-card-grid">
        ${cards
          .map(
            (card) => `
            <article class="cue-card">
              <span class="cue-card-label">${escapeHtml(card.label)}</span>
              <h4>${escapeHtml(card.title)}</h4>
              <p class="cue-card-copy">${escapeHtml(card.copy)}</p>
              <p class="cue-card-meta">Suggested questions: 1) Which Apple device/app version is affected? 2) Which content IDs are most reported? 3) Are non-Apple or peer MVPD cohorts impacted too?</p>
            </article>
          `
          )
          .join("")}
      </div>
    </section>
  `;
}

function buildDrilldownPanel(ctx) {
  return `
    <section class="deliverable-panel">
      <h3>8. Drilldown Panel Spec</h3>
      <p>Click any cell or insight to open a drilldown stack that keeps the human story intact while giving engineering enough evidence to act.</p>
      <p class="note-block" style="margin-top:14px;"><strong>Mock UI labels:</strong> “Anonymized Timelines”, “Top Content Pressure”, “Time-of-Day Heatmap”, “Device Split”, “ESM Error Codes”, and “Export anonymized CSV”.</p>
      <ol class="drilldown-list" style="margin-top:14px;">
        <li><strong>Top 10 anonymized user timelines:</strong> ${escapeHtml(ctx.hashedUsers[0])}, ${escapeHtml(ctx.hashedUsers[1])}, ${escapeHtml(ctx.hashedUsers[2])} plus seven more rows with event order, block reason, and retry count.</li>
        <li><strong>Content IDs most involved:</strong> ranked list with content share, concurrency pressure, and peer MVPD comparison.</li>
        <li><strong>Time-of-day heatmap:</strong> 24-hour band showing where blocks exceed baseline.</li>
        <li><strong>Device distribution:</strong> Apple vs non-Apple split, OS version, app version, and session_length overlays.</li>
        <li><strong>Exact ESM error codes:</strong> show client diagnostics, stacktrace family, and lead/lag marker relative to CM blocks when present.</li>
        <li><strong>Export button spec:</strong> “Export anonymized CSV” containing hashed identifiers, time bucket, MVPD, device, content_id, signal_group, and confidence band only.</li>
      </ol>
    </section>
  `;
}

function buildAcceptanceChecklist() {
  const items = [
    "Every highlighted cell shows sample_count ≥ 30 or is explicitly flagged low confidence.",
    "Incident Canvas renders first-seen timestamp in UTC and local timezone.",
    "Executive Verdict always includes confidence_pct and time_window.",
    "Cue-cards include affected_user_count, confidence_pct, and escalation link text.",
    "Cross-MVPD panel distinguishes isolated MVPD issues from peer-trending issues.",
    "Triage Matrix shows at least three high-confidence signals for Bug, CM working, and Mixed branches.",
    "Public-facing artifacts never expose raw user_id, email_hash, or device_id values.",
    "Resolution rule requires sustained return to baseline for 7 days after fix release.",
    "Drilldown panel includes top-10 anonymized timelines and exact ESM error codes when present.",
    "Handoff contract schema matches the example API payload and names every field type.",
  ];
  return `
    <section class="deliverable-panel">
      <h3>9. Acceptance Criteria &amp; Visual QA Checklist</h3>
      <ul class="checklist" style="margin-top:14px;">
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function buildImpactValue(ctx) {
  return `
    <section class="deliverable-panel">
      <h3>10. Business Impact &amp; Value Statement</h3>
      <p>Adobe PASS Premium Workflow plus Concurrency Monitoring gives customers faster root-cause decisioning, fewer false escalations, and clear evidence when policy enforcement is protecting the business instead of breaking playback.</p>
      <div class="impact-grid">
        <article class="impact-card">
          <span class="impact-card-label">Outcome 1</span>
          <h4>Reduced MTTR</h4>
          <p>Collapse six analyst hops into one visual cockpit and cut incident debate time by 40-60%.</p>
        </article>
        <article class="impact-card">
          <span class="impact-card-label">Outcome 2</span>
          <h4>Fewer false-block calls</h4>
          <p>Separate valid policy enforcement from true defects before the wrong team spends a month on the wrong fix.</p>
        </article>
        <article class="impact-card">
          <span class="impact-card-label">Outcome 3</span>
          <h4>Clearer escalation</h4>
          <p>Escalations carry confidence, sample size, and starting-point evidence instead of screenshots and opinions.</p>
        </article>
      </div>
      <p class="note-block" style="margin-top:14px;">CMUEMU exists to show the customer why paying for both ESM and CM matters: faster truth, better guardrails, and defensible action when pressure is high.</p>
    </section>
  `;
}

function buildHandoffContract(ctx) {
  const schemaRows = [
    ["incident_id", "string", "Stable incident key such as CMUEMU-2026-03-06-001"],
    ["time_window", "string", "ISO date range used for the analysis"],
    ["verdict", "string", "Yes | No | Partial | Mixed | Pending"],
    ["confidence_pct", "number", "0-100 confidence score"],
    ["sample_count", "number", "Total observations in scope"],
    ["affected_users_count", "number", "Distinct anonymized users impacted"],
    ["focus_mvpd", "string", "Selected MVPD id or label"],
    ["programmer_name", "string", "Selected Media Company label"],
    ["start_point", "string", "First spike timestamp in ISO format"],
    ["resolution_rule", "string", "Text rule for declaring incident resolved"],
    ["signal_groups", "array<object>", "ESM error, CM ruleset, and popularity signal summaries"],
    ["anomaly_matrix", "array<object>", "Pre-aggregated MVPD x device anomaly values"],
    ["narratives", "array<object>", "Narrative outputs for execs, agents, and customer comms"],
    ["references", "array<string>", "Human-readable references used in the story"],
  ];
  const apiExample = {
    incident_id: `${ctx.incidentId}-2026-03-06-001`,
    time_window: ctx.timeWindowLabel,
    verdict: ctx.verdict.label,
    confidence_pct: ctx.verdict.confidencePct,
    sample_count: ctx.sampleCount,
    affected_users_count: ctx.affectedUsersCount,
    focus_mvpd: ctx.mvpdLabel,
    programmer_name: ctx.mediaCompany,
    start_point: ctx.firstSpikeIso,
    resolution_rule: "Hold baseline for 7 days after fix release and show no recurring spikes.",
    signal_groups: [
      { key: "esm_error_signal", score: 0.46, note: "Apple playback signature present but not yet causal." },
      { key: "rule_mismatch_signal", score: 0.31, note: "CM matches require policy compare before blame." },
      { key: "popularity_signal", score: 0.23, note: "Top content surge may amplify enforcement pressure." },
    ],
    anomaly_matrix: [
      { mvpd: ctx.mvpdLabel, device_bucket: "iOS", z_score: 3.4, sample_count: 420, confidence_band: "high" },
      { mvpd: ctx.mvpdLabel, device_bucket: "tvOS", z_score: 3.1, sample_count: 188, confidence_band: "high" },
      { mvpd: "Peer MVPD A", device_bucket: "iOS", z_score: 0.4, sample_count: 304, confidence_band: "normal" },
    ],
    narratives: [
      { id: `${ctx.incidentId}-001`, title: "Executive Summary", confidence_pct: ctx.verdict.confidencePct },
      { id: `${ctx.incidentId}-002`, title: "Agent Brief", confidence_pct: 60 },
    ],
    references: ctx.references,
  };
  return `
    <section id="handoff-contract" class="deliverable-panel">
      <h3>11. Handoff / Implementation Contract</h3>
      <p>Required backend compute: pre-aggregated anomaly matrix, incident event list, lead/lag markers, cohort rollups, and narrative-ready summary objects. No SQL or spreadsheet artifacts belong in the analyst UI.</p>
      <div class="contract-grid">
        <div>
          <table class="schema-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${schemaRows
                .map(
                  (row) => `
                  <tr>
                    <td>${escapeHtml(row[0])}</td>
                    <td>${escapeHtml(row[1])}</td>
                    <td>${escapeHtml(row[2])}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div>
          <pre class="code-block" style="white-space:pre-wrap; overflow:auto;">${escapeHtml(JSON.stringify(apiExample, null, 2))}</pre>
        </div>
      </div>
    </section>
  `;
}

function renderWorkspace() {
  const model = buildFusionViewModel();
  if (!model) {
    els.controllerState.textContent = `${state.programmerName || "Selected Media Company"} · CMUEMU`;
    els.filterState.textContent = `Waiting for live ESM + CMU fusion for Requestor ${state.requestorId || "All"} | MVPD ${
      state.mvpdLabel || state.mvpdId || "All"
    }`;
    els.content.innerHTML = state.fusionError ? buildFusionErrorPanel() : buildFusionLoadingState();
    return;
  }

  const profileLine = model.profileLabel ? ` | Profile ${model.profileLabel}${model.upstreamUserId ? ` | upstreamUserID=${model.upstreamUserId}` : ""}` : "";
  els.controllerState.textContent = `${model.mediaCompany} · CMUEMU Live Fusion`;
  els.filterState.textContent = `Incident ${model.incidentId} | Requestor ${model.requestorLabel} | MVPD ${model.mvpdLabel} | Tenant ${
    model.tenantScope || model.cmTenantNames.join(", ") || "pending"
  }${profileLine}`;
  els.content.innerHTML = [
    buildLiveFusionHero(model),
    `<div class="deliverables-grid">${[
      buildLiveDataPulsePanel(model),
      buildLiveReportSweepPanel(model),
      buildFamilyCoveragePanel(model),
      buildOverlapPairsPanel(model),
      buildZoomCoveragePanel(model),
      buildFusionEvidencePanel(model),
      buildEndpointSurfacePanel(model),
      buildMergedStoriesPanel(model),
    ].join("")}</div>`,
  ].join("");
}

function renderLoadingState() {
  els.controllerState.textContent = "Waiting for CMUEMU context...";
  els.filterState.textContent = "UnderPAR is still resolving whether the selected Media Company has both ESM and Concurrency Monitoring.";
  els.content.innerHTML = `
    <section class="hero-panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">CMUEMU is resolving service availability</h2>
          <p class="panel-subtitle">This workspace only renders when the selected Media Company has both ESM and CM.</p>
        </div>
      </div>
      <p class="story-block">Waiting for sidepanel state. If the selected Media Company has both premium services, this workspace will redraw automatically.</p>
    </section>
  `;
}

function showEmptyScreen() {
  els.appRoot.hidden = true;
  els.emptyScreen.hidden = false;
}

function showWorkspace() {
  els.emptyScreen.hidden = true;
  els.appRoot.hidden = false;
}

function renderFromState() {
  syncRefreshButtonState();
  if (!state.cmuemuAvailabilityResolved) {
    showWorkspace();
    renderLoadingState();
    return;
  }
  if (!state.cmuemuAvailable || !state.cmuemuContainerVisible) {
    showEmptyScreen();
    return;
  }
  showWorkspace();
  if (state.fusionLoading && !state.fusionPayload) {
    els.controllerState.textContent = `${state.programmerName || "Selected Media Company"} · CMUEMU`;
    els.filterState.textContent = `Resolving live ESM + CMU intersection points for Requestor ${state.requestorId || "All"} | MVPD ${
      state.mvpdLabel || state.mvpdId || "All"
    }`;
    els.content.innerHTML = buildFusionLoadingState();
    return;
  }
  renderWorkspace();
}

function handleWorkspaceEvent(event, payload = {}) {
  const normalizedEvent = String(event || "").trim().toLowerCase();
  if (normalizedEvent === "controller-state") {
    const previousRefreshKey = getFusionRefreshKey();
    applyControllerState(payload);
    const nextRefreshKey = getFusionRefreshKey();
    const selectionChanged = previousRefreshKey !== nextRefreshKey;
    if (!state.cmuemuAvailable || !state.cmuemuContainerVisible) {
      resetFusionState();
      renderFromState();
      return;
    }
    if (selectionChanged) {
      applyFusionPayload(null);
      state.fusionError = "";
      state.lastFusionKey = "";
    }
    renderFromState();
    void hydrateFusionPayload({ force: selectionChanged || !state.fusionPayload });
    return;
  }
  if (normalizedEvent === "workspace-clear") {
    resetFusionState();
    els.content.innerHTML = "";
    setStatus("", "");
    return;
  }
}

function isTargetedToThisWindow(message = {}) {
  const targetWindowId = Number(message?.targetWindowId || 0);
  return targetWindowId <= 0 || targetWindowId === Number(state.windowId || 0);
}

function bindRuntimeListener() {
  chrome.runtime.onMessage.addListener((message) => {
    if (!CMUEMU_MESSAGE_TYPES.has(String(message?.type || "")) || message?.channel !== "workspace-event") {
      return false;
    }
    if (!isTargetedToThisWindow(message)) {
      return false;
    }
    handleWorkspaceEvent(message?.event, message?.payload || {});
    return false;
  });
}

async function initWorkspace() {
  await hydrateWindowId();
  bindRuntimeListener();
  syncRefreshButtonState();
  renderLoadingState();
  try {
    await sendWorkspaceAction("workspace-ready");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

els.refreshButton?.addEventListener("click", async () => {
  try {
    setStatus("Refreshing CMUEMU context...", "success");
    await sendWorkspaceAction("refresh-context");
    await hydrateFusionPayload({ force: true });
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
});

void initWorkspace();
