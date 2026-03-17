(function initUnderParIBetaView(globalScope) {
  const ZIP_ZAP_URL = "https://tve.zendesk.com/hc/en-us/articles/46503360732436-ZIP-ZAP";
  const UPS_AFFIRMATION_TEXT = "You're doing great. Keep it UP!";
  const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const ESM_CARD_ZOOM_LABEL_BY_KEY = {
    YR: "Year",
    MO: "Month",
    DAY: "Day",
    HR: "Hour",
    MIN: "Minute",
  };
  const ESM_CARD_ZOOM_PATH_TOKEN_BY_KEY = {
    YR: "/year",
    MO: "/month",
    DAY: "/day",
    HR: "/hour",
    MIN: "/minute",
  };

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

  function normalizeQueryPairs(value) {
    return (Array.isArray(value) ? value : [])
      .map((pair) => {
        const source = pair && typeof pair === "object" ? pair : null;
        if (!source) {
          return null;
        }
        const key = String(source.key || "").trim();
        if (!key) {
          return null;
        }
        return {
          key,
          operator: String(source.operator || "").trim(),
          value: String(source.value || "").trim(),
        };
      })
      .filter(Boolean);
  }

  function buildHeaderContextMarkup(snapshot) {
    const headerContext = snapshot?.headerContext && typeof snapshot.headerContext === "object" ? snapshot.headerContext : {};
    const pathSegments = (Array.isArray(headerContext.pathSegments) ? headerContext.pathSegments : [])
      .map((segment) => String(segment || "").trim())
      .filter(Boolean);
    const queryPairs = normalizeQueryPairs(headerContext.queryPairs);

    const pathMarkup =
      pathSegments.length > 0
        ? pathSegments
            .map((segment, index) => {
              const segmentClass = `card-url-path-segment${index === pathSegments.length - 1 ? " card-url-path-segment-terminal" : ""}`;
              return `${`<span class="${segmentClass}">${escapeHtml(segment)}</span>`}${
                index < pathSegments.length - 1 ? '<span class="card-url-path-divider">/</span>' : ""
              }`;
            })
            .join("")
        : '<span class="card-url-path-segment card-url-path-segment-empty">media-company</span>';

    const queryMarkup =
      queryPairs.length > 0
        ? queryPairs
            .map((pair) => {
              const operator = pair.operator || (pair.value ? "=" : "");
              const valueMarkup = pair.value
                ? `<span class="card-url-query-eq">${escapeHtml(operator)}</span><span class="card-url-query-value">${escapeHtml(
                    pair.value
                  )}</span>`
                : "";
              return `<span class="card-url-query-chip"><span class="card-url-query-key">${escapeHtml(pair.key)}</span>${valueMarkup}</span>`;
            })
            .join("")
        : '<span class="card-url-query-empty" aria-hidden="true"></span>';

    return `
      <span class="card-url-context" aria-label="ESM request context">
        <span class="card-url-path" aria-label="ESM path">${pathMarkup}</span>
        <span class="card-url-query-cloud" aria-label="ESM query context">${queryMarkup}</span>
      </span>
    `;
  }

  function buildCardSubtitle(snapshot) {
    const rowCount = Math.max(0, Number(snapshot?.table?.rowCount || snapshot?.table?.rows?.length || 0));
    const zoomLabel = getWorkspaceCardZoomLabel(snapshot);
    const zoom = zoomLabel ? `Zoom: ${zoomLabel}` : "Zoom: --";
    return `${zoom} | Rows: ${rowCount}`;
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
      72
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
      .join("_");
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

  function buildCardColumnsMarkup(snapshot) {
    const nodeLabel = String(snapshot?.displayNodeLabel || snapshot?.datasetLabel || "").trim() || getTerminalPathSegment(snapshot);
    const headers = (Array.isArray(snapshot?.table?.headers) ? snapshot.table.headers : [])
      .map((header) => String(header || "").trim())
      .filter((header) => header && header !== "DATE");
    const columnsMarkup =
      headers.length > 0
        ? `<div class="col-chip-cloud">${headers
            .map(
              (header) => `<div class="col-chip" data-filterable="0" title="${escapeHtml(header)}">
              <span class="col-chip-label col-chip-label-static" title="${escapeHtml(header)}">${escapeHtml(header)}</span>
            </div>`
            )
            .join("")}</div>`
        : '<span class="card-col-empty"></span>';
    return `
      <div class="card-col-list">
        <div class="card-col-layout">
          <div class="card-col-node">
            <span class="card-col-parent-url" title="${escapeHtml(nodeLabel)}">${escapeHtml(nodeLabel)}</span>
          </div>
          <div class="card-col-columns-wrap">
            <div class="card-col-columns" aria-label="ESM columns">${columnsMarkup}</div>
          </div>
        </div>
      </div>
    `;
  }

  function normalizeWorkspaceZoomKey(value = "") {
    const normalized = String(value || "").trim().toUpperCase();
    return Object.prototype.hasOwnProperty.call(ESM_CARD_ZOOM_LABEL_BY_KEY, normalized) ? normalized : "";
  }

  function detectWorkspaceZoomKeyFromUrl(urlValue = "") {
    const href = String(urlValue || "").trim().toLowerCase();
    if (!href) {
      return "";
    }
    let detected = "";
    let bestIndex = -1;
    Object.entries(ESM_CARD_ZOOM_PATH_TOKEN_BY_KEY).forEach(([key, token]) => {
      const index = href.lastIndexOf(token);
      if (index > bestIndex) {
        detected = key;
        bestIndex = index;
      }
    });
    return detected;
  }

  function resolveWorkspaceCardZoomKey(snapshot = null) {
    const explicit = normalizeWorkspaceZoomKey(snapshot?.zoomKey);
    if (explicit) {
      return explicit;
    }
    return (
      detectWorkspaceZoomKeyFromUrl(String(snapshot?.requestUrl || "").trim()) ||
      detectWorkspaceZoomKeyFromUrl(String(snapshot?.requestPath || "").trim()) ||
      ""
    );
  }

  function getWorkspaceCardZoomLabel(snapshot = null) {
    const zoomKey = resolveWorkspaceCardZoomKey(snapshot);
    return zoomKey ? ESM_CARD_ZOOM_LABEL_BY_KEY[zoomKey] || zoomKey : "";
  }

  function getLastModifiedSourceTimezone(rawHttpDate = "") {
    const tail = String(rawHttpDate || "").trim().split(/\s+/).pop();
    if (!tail) {
      return "";
    }
    if (/^[A-Z]{2,4}$/i.test(tail)) {
      return tail.toUpperCase();
    }
    if (/^[+-]\d{4}$/.test(tail)) {
      return tail;
    }
    return "";
  }

  function formatLastModifiedForDisplay(rawHttpDate = "") {
    if (rawHttpDate == null || String(rawHttpDate).trim() === "") {
      return rawHttpDate;
    }
    const date = new Date(rawHttpDate);
    if (Number.isNaN(date.getTime())) {
      return rawHttpDate;
    }
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: CLIENT_TIMEZONE,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find((part) => part.type === type)?.value ?? "";
    const tzName = getPart("timeZoneName");
    return `${getPart("month")}/${getPart("day")}/${getPart("year")} ${getPart("hour")}:${getPart("minute")}:${getPart("second")} ${tzName || CLIENT_TIMEZONE}`;
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
    const headers = Array.isArray(snapshot?.table?.headers) ? snapshot.table.headers : [];
    const lastModified = String(snapshot?.lastModified || "").trim();
    const lastModifiedMarkup = lastModified
      ? `Last-Modified: ${escapeHtml(formatLastModifiedForDisplay(lastModified))}`
      : "Last-Modified: (real-time)";
    const lastModifiedTitle = lastModified
      ? (() => {
          const sourceTz = getLastModifiedSourceTimezone(lastModified);
          return sourceTz ? `Server time: ${sourceTz} (converted to your timezone)` : "Converted to your timezone";
        })()
      : "";
    return `
      <div class="esm-table-wrapper">
        <table class="esm-table">
          <thead><tr>${buildTableHeadMarkup(snapshot)}</tr></thead>
          <tbody>${buildTableBodyMarkup(snapshot)}</tbody>
          <tfoot>
            <tr>
              <td class="esm-footer-cell" colspan="${Math.max(1, headers.length)}">
                <div class="esm-footer">
                  <div class="esm-footer-controls">
                    <div class="esm-footer-meta">
                      <span class="esm-last-modified"${lastModifiedTitle ? ` title="${escapeHtml(lastModifiedTitle)}"` : ""}>${lastModifiedMarkup}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
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
      <article class="report-card ibeta-report-card">
        <div class="card-head">
          <div class="card-title-wrap">
            <p class="card-title">${buildHeaderContextMarkup(snapshot)}</p>
            <p class="card-subtitle">${escapeHtml(buildCardSubtitle(snapshot))}</p>
          </div>
          <div class="card-actions" aria-hidden="true">
            <button type="button" class="card-close" tabindex="-1" aria-hidden="true" title="Close report card">
              <svg class="card-close-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 7 17 17" />
                <path d="M17 7 7 17" />
              </svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          ${buildTableMarkup(snapshot)}
          ${buildCardColumnsMarkup(snapshot)}
        </div>
      </article>
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

  function wireActions(root) {
    root.querySelectorAll(".ups-print-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        try {
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
    wireActions(root);
  }

  const snapshot = readSnapshot();
  renderSnapshot(snapshot);
  scrubVisibleUrl();
  try {
    console.debug("[ups]", globalScope.__UNDERPAR_IBETA_DEBUG__ || {}, snapshot || null);
  } catch {
    // Ignore console debug failures.
  }
})(globalThis);
