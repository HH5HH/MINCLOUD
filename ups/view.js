(function initUnderParIBetaView(globalScope) {
  const ZIP_ZAP_URL = "https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP";
  const UPS_AFFIRMATION_TEXT = "You're doing great. Keep it UP!";
  const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const UPS_PRINT_PAGE_STYLE_ID = "underpar-ups-print-page-style";
  const UPS_PRINT_PAGE_MARGIN_MM = 4;
  const UPS_PRINT_PAGE_WIDTH_MM = 279.4;
  const UPS_PRINT_PAGE_HEIGHT_MM = 215.9;
  const UPS_PRINT_SCALE_MIN = 0.42;

  function readSnapshot() {
    const node = document.getElementById("underpar-ibeta-snapshot");
    if (!(node instanceof HTMLScriptElement)) {
      return null;
    }
    try {
      const parsed = JSON.parse(String(node.textContent || "{}"));
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function firstNonEmptyString(values) {
    for (const value of Array.isArray(values) ? values : []) {
      const normalized = String(value || "").trim();
      if (normalized) {
        return normalized;
      }
    }
    return "";
  }

  function sanitizeDownloadFileSegment(value, fallback = "download") {
    const normalized = String(value || "")
      .trim()
      .replace(/[^\w.-]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return normalized || fallback;
  }

  function truncateDownloadFileSegment(value, maxLength = 48) {
    const normalized = String(value || "").trim();
    if (!normalized) {
      return "";
    }
    if (!Number.isFinite(maxLength) || maxLength <= 0) {
      return normalized;
    }
    if (normalized.length <= maxLength) {
      return normalized;
    }
    return normalized.slice(0, maxLength);
  }

  function getTerminalPathSegment(snapshot) {
    const pathSegments = Array.isArray(snapshot?.headerContext?.pathSegments) ? snapshot.headerContext.pathSegments : [];
    const terminal = String(pathSegments[pathSegments.length - 1] || "").trim();
    return terminal || "node";
  }

  function getPrimarySnapshotCard(snapshot = null) {
    const cards = Array.isArray(snapshot?.cards) ? snapshot.cards.filter((card) => card && typeof card === "object") : [];
    if (cards.length > 0) {
      return cards[0];
    }
    return snapshot && typeof snapshot === "object" ? snapshot : {};
  }

  function buildUpspaceReportLabel(snapshot = null) {
    const primaryCard = getPrimarySnapshotCard(snapshot);
    return firstNonEmptyString([
      snapshot?.displayNodeLabel,
      snapshot?.datasetLabel,
      primaryCard?.displayNodeLabel,
      primaryCard?.datasetLabel,
      getTerminalPathSegment(primaryCard),
      snapshot?.workspaceLabel,
      primaryCard?.workspaceLabel,
      "report",
    ]);
  }

  function buildUpspacePrintStamp(snapshot = null) {
    const primaryCard = getPrimarySnapshotCard(snapshot);
    const sourceTimestamp = Number(snapshot?.createdAt || primaryCard?.createdAt || Date.now() || 0);
    const resolvedTimestamp = Number.isFinite(sourceTimestamp) && sourceTimestamp > 0 ? sourceTimestamp : Date.now();
    return new Date(resolvedTimestamp).toISOString().replace(/[:.]/g, "-");
  }

  function buildUpspacePrintDocumentTitle(snapshot = null) {
    const primaryCard = getPrimarySnapshotCard(snapshot);
    const workspaceKey = truncateDownloadFileSegment(
      sanitizeDownloadFileSegment(firstNonEmptyString([snapshot?.workspaceKey, primaryCard?.workspaceKey, "workspace"]), "workspace").toLowerCase(),
      24
    );
    const programmerSegment = truncateDownloadFileSegment(
      sanitizeDownloadFileSegment(
        firstNonEmptyString([
          snapshot?.programmerId,
          primaryCard?.programmerId,
          snapshot?.programmerName,
          primaryCard?.programmerName,
          "",
        ]),
        ""
      ),
      32
    );
    const datasetSegment = truncateDownloadFileSegment(
      sanitizeDownloadFileSegment(buildUpspaceReportLabel(snapshot), "report"),
      40
    );
    const envSegment = truncateDownloadFileSegment(
      sanitizeDownloadFileSegment(
        firstNonEmptyString([
          snapshot?.adobePassEnvironmentKey,
          primaryCard?.adobePassEnvironmentKey,
          snapshot?.adobePassEnvironmentLabel,
          primaryCard?.adobePassEnvironmentLabel,
          "",
        ]),
        ""
      ),
      16
    );
    return [
      "underpar",
      workspaceKey,
      programmerSegment,
      datasetSegment || "report",
      envSegment,
      buildUpspacePrintStamp(snapshot),
    ]
      .filter(Boolean)
      .join("_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 96);
  }

  function buildUpspacePrintActionLabel(snapshot = null) {
    return `Print ${buildUpspaceReportLabel(snapshot)} from UPSpace`;
  }

  function syncDocumentTitle(snapshot = null, targetDocument = document) {
    if (!targetDocument || typeof targetDocument !== "object") {
      return;
    }
    const nextTitle = buildUpspacePrintDocumentTitle(snapshot);
    if (!nextTitle) {
      return;
    }
    targetDocument.title = nextTitle;
  }

  function clampNumber(value, min, max) {
    const normalized = Number(value);
    if (!Number.isFinite(normalized)) {
      return Number(min);
    }
    return Math.min(Math.max(normalized, Number(min)), Number(max));
  }

  function pxToMm(value) {
    const normalized = Number(value);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      return 0;
    }
    return (normalized * 25.4) / 96;
  }

  function mmToPx(value) {
    const normalized = Number(value);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      return 0;
    }
    return (normalized * 96) / 25.4;
  }

  function measureNodeWidth(node) {
    if (!node || typeof node !== "object") {
      return 0;
    }
    let width = Math.max(Number(node.scrollWidth || 0), Number(node.clientWidth || 0), Number(node.offsetWidth || 0));
    try {
      if (typeof node.getBoundingClientRect === "function") {
        const rect = node.getBoundingClientRect();
        width = Math.max(width, Number(rect?.width || 0));
      }
    } catch {
      // Ignore layout measurement failures.
    }
    return width;
  }

  function buildUpspacePrintScale(widestMeasuredPx) {
    const printableWidthPx = mmToPx(UPS_PRINT_PAGE_WIDTH_MM - UPS_PRINT_PAGE_MARGIN_MM * 2);
    const measuredWidthPx = Number(widestMeasuredPx || 0);
    if (!Number.isFinite(measuredWidthPx) || measuredWidthPx <= 0 || printableWidthPx <= 0) {
      return 1;
    }
    return clampNumber(printableWidthPx / measuredWidthPx, UPS_PRINT_SCALE_MIN, 1);
  }

  function buildUpspacePrintPageCss(widestMeasuredPx) {
    const scale = buildUpspacePrintScale(widestMeasuredPx);
    return [
      `@page { size: ${UPS_PRINT_PAGE_WIDTH_MM.toFixed(2)}mm ${UPS_PRINT_PAGE_HEIGHT_MM.toFixed(2)}mm; margin: ${UPS_PRINT_PAGE_MARGIN_MM}mm; }`,
      `:root { --ups-print-scale: ${scale.toFixed(4)}; }`,
    ].join("\n");
  }

  function upsertUpspacePrintPageStyle(cssText, targetDocument = document) {
    if (!targetDocument || typeof targetDocument !== "object" || typeof targetDocument.createElement !== "function" || !targetDocument.head) {
      return null;
    }
    let styleNode =
      typeof targetDocument.getElementById === "function" ? targetDocument.getElementById(UPS_PRINT_PAGE_STYLE_ID) : null;
    if (!styleNode || String(styleNode.tagName || "").toLowerCase() !== "style") {
      styleNode = targetDocument.createElement("style");
      styleNode.id = UPS_PRINT_PAGE_STYLE_ID;
      styleNode.media = "print";
      targetDocument.head.appendChild(styleNode);
    }
    styleNode.textContent = String(cssText || "");
    return styleNode;
  }

  function prepareUpspacePrintLayout(root = null, targetDocument = document) {
    const resolvedDocument = targetDocument && typeof targetDocument === "object" ? targetDocument : document;
    const measurementRoot =
      root && typeof root === "object"
        ? root
        : typeof resolvedDocument.getElementById === "function"
          ? resolvedDocument.getElementById("ibeta-root")
          : null;
    const measuredWidths = [
      measureNodeWidth(resolvedDocument?.documentElement),
      measureNodeWidth(resolvedDocument?.body),
      Number(globalScope?.innerWidth || 0),
    ];
    if (measurementRoot && typeof measurementRoot.querySelectorAll === "function") {
      measuredWidths.push(measureNodeWidth(measurementRoot));
      Array.from(
        measurementRoot.querySelectorAll(
          ".ibeta-report-scroll-shell, .ibeta-report-card, .ibeta-report-card .ups-report-title-wrap, .ibeta-report-card .esm-table-wrapper, .ibeta-report-card .esm-table"
        )
      ).forEach((node) => {
        measuredWidths.push(measureNodeWidth(node));
      });
    }
    const widestMeasuredPx = measuredWidths.reduce((widest, value) => Math.max(widest, Number(value || 0)), 0);
    // Fit to a standard landscape PDF/printable page even when the browser ignores large custom @page sizes.
    const cssText = buildUpspacePrintPageCss(widestMeasuredPx + 32);
    upsertUpspacePrintPageStyle(cssText, resolvedDocument);
    return {
      cssText,
      widestMeasuredPx,
    };
  }

  function normalizeCards(snapshot) {
    const cards = Array.isArray(snapshot?.cards) ? snapshot.cards.filter((card) => card && typeof card === "object") : [];
    if (cards.length > 0) {
      return cards;
    }
    return snapshot && typeof snapshot === "object" ? [snapshot] : [];
  }

  function buildTableBodyMarkup(snapshot) {
    const rows = Array.isArray(snapshot?.table?.rows) ? snapshot.table.rows : [];
    return rows
      .map((row) => {
        const cells = (Array.isArray(row) ? row : []).map((value) => {
          const text = String(value ?? "");
          return `<td title="${escapeHtml(text)}">${escapeHtml(text)}</td>`;
        });
        return `<tr>${cells.join("")}</tr>`;
      })
      .join("");
  }

  function buildTableHeadMarkup(snapshot) {
    const headers = Array.isArray(snapshot?.table?.headers) ? snapshot.table.headers : [];
    return headers
      .map((header, index) => {
        const isActiveDateSort = index === 0 && header === "DATE";
        const title = header === "DATE" ? `DATE (${escapeHtml(CLIENT_TIMEZONE)}, converted from PST)` : escapeHtml(header);
        const activeClass = isActiveDateSort ? " active-sort" : "";
        const iconText = isActiveDateSort ? "▼" : "";
        return `<th class="${activeClass.trim()}" title="${title}">${escapeHtml(header)}<span class="sort-icon" aria-hidden="true">${iconText}</span></th>`;
      })
      .join("");
  }

  function buildTableMarkup(snapshot) {
    return `
      <div class="esm-table-wrapper">
        <table class="esm-table">
          <thead><tr>${buildTableHeadMarkup(snapshot)}</tr></thead>
          <tbody>${buildTableBodyMarkup(snapshot)}</tbody>
        </table>
      </div>
    `;
  }

  function buildReportTitleMarkup(snapshot) {
    const reportLabel = buildUpspaceReportLabel(snapshot);
    return `
      <header class="ups-report-title-wrap">
        <h1 class="ups-report-title" title="${escapeHtml(reportLabel)}">${escapeHtml(reportLabel)}</h1>
      </header>
    `;
  }

  function buildUtilityBarMarkup(snapshot) {
    const printActionLabel = escapeHtml(buildUpspacePrintActionLabel(snapshot));
    return `
      <header class="ups-utility-bar" aria-label="UPS actions">
        <span class="ups-utility-prefix" aria-hidden="true">//</span>
        <a href="${escapeHtml(ZIP_ZAP_URL)}" target="_blank" rel="noopener noreferrer" class="ups-utility-link ups-utility-link-zipzap">zip-zap</a>
        <a href="#" class="ups-utility-link ups-print-link" title="${printActionLabel}" aria-label="${printActionLabel}">print</a>
      </header>
    `;
  }

  function buildAffirmationFooterMarkup() {
    return `<footer class="ups-affirmation-footer">${escapeHtml(UPS_AFFIRMATION_TEXT)}</footer>`;
  }

  function buildCardMarkup(snapshot) {
    return `
      <div class="ibeta-report-scroll-shell">
        <article class="report-card ibeta-report-card">
          ${buildReportTitleMarkup(snapshot)}
          <div class="card-body">
            ${buildTableMarkup(snapshot)}
          </div>
        </article>
      </div>
    `;
  }

  function scrubVisibleUrl() {
    try {
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    } catch {
      // Ignore history scrubbing failures.
    }
  }

  function wireActions(root, snapshot) {
    root.querySelectorAll(".ups-print-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        try {
          syncDocumentTitle(snapshot);
          prepareUpspacePrintLayout(root, document);
          if (typeof globalScope.requestAnimationFrame === "function") {
            globalScope.requestAnimationFrame(() => {
              window.print();
            });
            return;
          }
          window.print();
        } catch {
          // Ignore print failures.
        }
      });
    });
  }

  function renderSnapshot(snapshot) {
    const root = document.getElementById("ibeta-root");
    if (!(root instanceof HTMLElement)) {
      return;
    }
    const cards = normalizeCards(snapshot);
    if (cards.length === 0) {
      document.title = "UPSpace";
      root.innerHTML = '<section class="ibeta-stage" aria-hidden="true"></section>';
      return;
    }
    syncDocumentTitle(snapshot);
    root.innerHTML = `
      <section class="ibeta-stage">
        <div class="ups-shell">
          ${buildUtilityBarMarkup(snapshot)}
          <div class="workspace-cards ibeta-cards">
          ${cards.map((card) => buildCardMarkup(card)).join("")}
          </div>
          ${buildAffirmationFooterMarkup()}
        </div>
      </section>
    `;
    prepareUpspacePrintLayout(root, document);
    wireActions(root, snapshot);
  }

  const snapshot = readSnapshot();
  renderSnapshot(snapshot);
  scrubVisibleUrl();
  try {
    if (typeof globalScope.addEventListener === "function") {
      globalScope.addEventListener("beforeprint", () => {
        prepareUpspacePrintLayout(
          typeof document.getElementById === "function" ? document.getElementById("ibeta-root") : null,
          document
        );
      });
    }
  } catch {
    // Ignore print listener failures.
  }
  try {
    console.debug("[ups]", globalScope.__UNDERPAR_IBETA_DEBUG__ || {}, snapshot || null);
  } catch {
    // Ignore console debug failures.
  }
})(globalThis);
