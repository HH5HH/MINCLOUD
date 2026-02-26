const CM_MESSAGE_TYPE = "underpar:cm";
const WORKSPACE_TABLE_VISIBLE_ROW_CAP = 10;
const WORKSPACE_LOCK_MESSAGE_SUFFIX =
  "does not have Concurrency Monitoring access. Confirm CM tenant mapping for this media company.";

const state = {
  windowId: 0,
  controllerOnline: false,
  cmAvailable: null,
  programmerId: "",
  programmerName: "",
  requestorIds: [],
  mvpdIds: [],
  profileHarvest: null,
  cardsById: new Map(),
  batchRunning: false,
  workspaceLocked: false,
};

const els = {
  controllerState: document.getElementById("workspace-controller-state"),
  filterState: document.getElementById("workspace-filter-state"),
  status: document.getElementById("workspace-status"),
  lockBanner: document.getElementById("workspace-lock-banner"),
  lockMessage: document.getElementById("workspace-lock-message"),
  rerunAllButton: document.getElementById("workspace-rerun-all"),
  clearButton: document.getElementById("workspace-clear-all"),
  cardsHost: document.getElementById("workspace-cards"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setStatus(message = "", type = "info") {
  const text = String(message || "").trim();
  els.status.textContent = text;
  els.status.classList.remove("error");
  if (type === "error") {
    els.status.classList.add("error");
  }
}

function setActionButtonsDisabled(disabled) {
  const isDisabled = Boolean(disabled);
  if (els.rerunAllButton) {
    els.rerunAllButton.disabled = isDisabled;
  }
  if (els.clearButton) {
    els.clearButton.disabled = isDisabled;
  }
}

function syncActionButtonsDisabled() {
  setActionButtonsDisabled(state.batchRunning || state.workspaceLocked);
}

function getProgrammerLabel() {
  const name = String(state.programmerName || "").trim();
  const id = String(state.programmerId || "").trim();
  if (name && id && name !== id) {
    return `${name} (${id})`;
  }
  return name || id || "Selected Media Company";
}

function getWorkspaceLockMessage() {
  return `${getProgrammerLabel()} ${WORKSPACE_LOCK_MESSAGE_SUFFIX}`;
}

function updateWorkspaceLockState() {
  const hasProgrammerContext = Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
  const shouldLock = !state.controllerOnline && state.cmAvailable === false && hasProgrammerContext;
  state.workspaceLocked = shouldLock;
  document.body.classList.toggle("workspace-locked", shouldLock);
  if (els.lockBanner) {
    els.lockBanner.hidden = !shouldLock;
  }
  if (els.lockMessage) {
    els.lockMessage.textContent = shouldLock ? getWorkspaceLockMessage() : "";
  }
  syncActionButtonsDisabled();
}

function updateControllerBanner() {
  if (!els.controllerState || !els.filterState) {
    return;
  }

  const hasProgrammerContext = Boolean(String(state.programmerId || "").trim() || String(state.programmerName || "").trim());
  if (!state.controllerOnline) {
    if (state.workspaceLocked) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "CM workspace is locked for this media company.";
    } else if (hasProgrammerContext) {
      els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
      els.filterState.textContent = "Waiting for CM controller sync from UnderPAR side panel...";
    } else {
      els.controllerState.textContent = "Waiting for UnderPAR side panel controller...";
      els.filterState.textContent = "";
    }
    return;
  }

  els.controllerState.textContent = `Selected Media Company: ${getProgrammerLabel()}`;
  const requestorLabel = state.requestorIds.length > 0 ? state.requestorIds.join(", ") : "All requestors";
  const mvpdLabel = state.mvpdIds.length > 0 ? state.mvpdIds.join(", ") : "All MVPDs";
  const harvest = state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : null;
  const harvestSubject = String(harvest?.subject || "").trim();
  const harvestMvpd = String(harvest?.mvpd || "").trim();
  const harvestSession = String(harvest?.sessionId || "").trim();
  const compact = (value, limit) => {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  };
  const harvestSummary = harvestSubject
    ? ` | Correlation Subject: ${compact(harvestSubject, 42)}${harvestMvpd ? ` | Correlation MVPD: ${compact(harvestMvpd, 18)}` : ""}${
        harvestSession ? ` | Session: ${compact(harvestSession, 24)}` : ""
      }`
    : "";
  els.filterState.textContent = `RequestorId(s): ${requestorLabel} | MVPD(s): ${mvpdLabel}${harvestSummary}`;
}

function normalizeRowValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const normalized = {};
      Object.entries(row).forEach(([key, value]) => {
        normalized[String(key || "")] = normalizeRowValue(value);
      });
      return normalized;
    });
}

function getComparableValue(row, header) {
  const value = row?.[header];
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && String(value).trim() !== "") {
    return asNumber;
  }
  return String(value || "").toLowerCase();
}

function sortRows(rows, sortStack) {
  const stack = Array.isArray(sortStack) && sortStack.length > 0 ? sortStack : [];
  if (stack.length === 0) {
    return [...rows];
  }

  return [...rows].sort((left, right) => {
    for (const rule of stack) {
      const factor = rule.dir === "ASC" ? 1 : -1;
      const leftValue = getComparableValue(left, rule.col);
      const rightValue = getComparableValue(right, rule.col);
      if (leftValue < rightValue) {
        return -1 * factor;
      }
      if (leftValue > rightValue) {
        return 1 * factor;
      }
    }
    return 0;
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  const text = value == null ? "" : String(value);
  cell.textContent = text;
  cell.title = text;
  return cell;
}

function refreshHeaderStates(tableState) {
  if (!tableState?.thead) {
    return;
  }
  tableState.thead.querySelectorAll("th").forEach((headerCell) => {
    if (typeof headerCell._updateState === "function") {
      headerCell._updateState();
    }
  });
}

function renderTableBody(tableState) {
  tableState.tbody.innerHTML = "";
  tableState.data.forEach((row) => {
    const tr = document.createElement("tr");
    tableState.headers.forEach((header) => {
      tr.appendChild(createCell(row?.[header] ?? ""));
    });
    tableState.tbody.appendChild(tr);
  });
}

function updateTableWrapperViewport(tableState) {
  const wrapper = tableState?.wrapper;
  const table = tableState?.table;
  if (!wrapper || !table) {
    return;
  }

  const totalRows = Array.isArray(tableState.data) ? tableState.data.length : 0;
  const visibleRows = totalRows > 0 ? Math.min(WORKSPACE_TABLE_VISIBLE_ROW_CAP, totalRows) : 1;
  const sampleRow = table.querySelector("tbody tr");
  const headerRow = table.querySelector("thead tr");
  const footerRow = table.querySelector("tfoot tr");

  const rowHeight = sampleRow ? sampleRow.getBoundingClientRect().height : 36;
  const headerHeight = headerRow ? headerRow.getBoundingClientRect().height : 42;
  const footerHeight = footerRow ? footerRow.getBoundingClientRect().height : 40;
  const viewportHeight = Math.ceil(headerHeight + footerHeight + rowHeight * visibleRows + 2);

  wrapper.style.maxHeight = `${viewportHeight}px`;
}

function getCardPayload(cardState) {
  return {
    cardId: cardState.cardId,
    endpointUrl: cardState.endpointUrl,
    requestUrl: cardState.requestUrl,
    zoomKey: cardState.zoomKey,
    columns: cardState.columns,
    operation: cardState.operation && typeof cardState.operation === "object" ? { ...cardState.operation } : null,
    formValues: cardState.formValues && typeof cardState.formValues === "object" ? { ...cardState.formValues } : {},
  };
}

function getNodeLabel(urlValue) {
  const raw = String(urlValue || "").trim();
  if (!raw) {
    return "cm";
  }
  try {
    const parsed = new URL(raw);
    const parts = String(parsed.pathname || "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return decodeURIComponent(parts[parts.length - 1]);
    }
  } catch {
    // Ignore parse errors.
  }
  return raw;
}

function buildCardColumnsMarkup(cardState) {
  const columns = Array.isArray(cardState?.columns) ? cardState.columns : [];
  const requestUrl = String(cardState?.requestUrl || cardState?.endpointUrl || "").trim();
  const nodeLabel = getNodeLabel(requestUrl);
  const endpointMarkup = requestUrl
    ? `<a class="card-col-parent-url card-rerun-url" href="${escapeHtml(requestUrl)}" title="${escapeHtml(requestUrl)}">${escapeHtml(nodeLabel)}</a>`
    : `<span class="card-col-parent-url card-col-parent-url-empty">cm</span>`;
  const columnsMarkup =
    columns.length > 0
      ? columns.map((column) => `<span class="card-col-chip">${escapeHtml(column)}</span>`).join("")
      : `<span class="card-col-empty">No columns</span>`;

  return `
    <div class="card-col-list">
      <div class="card-col-layout">
        <div class="card-col-node">${endpointMarkup}</div>
        <div class="card-col-columns" aria-label="CM columns">${columnsMarkup}</div>
      </div>
    </div>
  `;
}

function renderCardMessage(cardState, message, options = {}) {
  const cssClass = options.error ? "card-message error" : "card-message";
  cardState.bodyElement.innerHTML = `<p class="${cssClass}">${escapeHtml(message || "")}</p>${buildCardColumnsMarkup(cardState)}`;
  wireCardRerunUrl(cardState);
}

function normalizeOperationDescriptor(operation) {
  if (!operation || typeof operation !== "object") {
    return null;
  }
  const parameters = Array.isArray(operation.parameters)
    ? operation.parameters
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          const name = String(item.name || "").trim();
          if (!name) {
            return null;
          }
          return {
            name,
            in: String(item.in || "path").trim().toLowerCase(),
            required: item.required === true,
            description: String(item.description || "").trim(),
          };
        })
        .filter(Boolean)
    : [];
  return {
    key: String(operation.key || "").trim(),
    label: String(operation.label || "").trim(),
    method: String(operation.method || "GET").trim().toUpperCase(),
    pathTemplate: String(operation.pathTemplate || "").trim(),
    parameters,
    security: String(operation.security || "").trim(),
  };
}

function normalizeOperationFormValues(operation, values = {}) {
  const source = values && typeof values === "object" ? values : {};
  const profileHarvest = state.profileHarvest && typeof state.profileHarvest === "object" ? state.profileHarvest : null;
  const normalized = {
    baseUrl: String(source.baseUrl || "https://streams-stage.adobeprimetime.com").trim() || "https://streams-stage.adobeprimetime.com",
    idp: String(source.idp || profileHarvest?.mvpd || state.mvpdIds?.[0] || "").trim(),
    subject: String(source.subject || profileHarvest?.subject || state.requestorIds?.[0] || "").trim(),
    session: String(source.session || profileHarvest?.sessionId || "").trim(),
    xTerminate: String(source.xTerminate || "").trim(),
    authUser: String(source.authUser || "").trim(),
    authPass: String(source.authPass || "").trim(),
  };
  const parameters = Array.isArray(operation?.parameters) ? operation.parameters : [];
  parameters.forEach((param) => {
    const name = String(param?.name || "").trim();
    if (!name) {
      return;
    }
    const key = name.toLowerCase() === "x-terminate" ? "xTerminate" : name;
    if (!Object.prototype.hasOwnProperty.call(normalized, key)) {
      normalized[key] = String(source[key] || source[name] || "").trim();
    }
  });
  return normalized;
}

function buildOperationFormField(label, name, value, options = {}) {
  const required = options.required === true;
  const type = String(options.type || "text").trim();
  const placeholder = String(options.placeholder || "").trim();
  const help = String(options.help || "").trim();
  return `
    <label class="cm-api-field">
      <span class="cm-api-label">${escapeHtml(label)}${required ? ' <em aria-hidden="true">*</em>' : ""}</span>
      <input class="cm-api-input" type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value || "")}" ${
        required ? "required" : ""
      } ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ""} />
      ${help ? `<span class="cm-api-help">${escapeHtml(help)}</span>` : ""}
    </label>
  `;
}

function renderOperationFormCard(cardState, options = {}) {
  const operation = normalizeOperationDescriptor(cardState?.operation);
  if (!operation) {
    renderCardMessage(cardState, "CM V2 operation details are unavailable.", { error: true });
    return;
  }

  const values = normalizeOperationFormValues(operation, options.formValues || cardState.formValues || {});
  cardState.formValues = { ...values };
  const parameterFields = operation.parameters
    .map((param) => {
      const paramName = String(param.name || "").trim();
      const key = paramName.toLowerCase() === "x-terminate" ? "xTerminate" : paramName;
      const labelPrefix = String(param.in || "path").toUpperCase();
      const label = `${labelPrefix} ${paramName}`;
      const placeholder = param.in === "path" ? `{${paramName}}` : "";
      return buildOperationFormField(label, key, values[key] || "", {
        required: param.required === true,
        placeholder,
        help: param.description || "",
      });
    })
    .join("");

  const securityHint = operation.security ? `Auth: ${operation.security}` : "Auth: IMS/Cookie or Basic";
  const body = `
    <form class="cm-api-form" data-card-id="${escapeHtml(cardState.cardId)}">
      <div class="cm-api-intro">
        <p class="cm-api-intro-main">${escapeHtml(operation.method)} ${escapeHtml(operation.pathTemplate)}</p>
        <p class="cm-api-intro-sub">${escapeHtml(securityHint)}</p>
      </div>
      <div class="cm-api-grid">
        ${buildOperationFormField("Base URL", "baseUrl", values.baseUrl, { required: true, type: "url" })}
        ${buildOperationFormField("Basic Auth User", "authUser", values.authUser)}
        ${buildOperationFormField("Basic Auth Password", "authPass", values.authPass, { type: "password" })}
        ${parameterFields}
      </div>
      <div class="cm-api-actions-row">
        <button type="submit" class="cm-api-run">Run API</button>
      </div>
    </form>
    ${buildCardColumnsMarkup(cardState)}
  `;
  cardState.bodyElement.innerHTML = body;
  wireCardRerunUrl(cardState);

  const formElement = cardState.bodyElement.querySelector(".cm-api-form");
  if (!formElement) {
    return;
  }
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureWorkspaceUnlocked()) {
      return;
    }
    const formData = new FormData(formElement);
    const submittedValues = {};
    formData.forEach((value, key) => {
      submittedValues[String(key || "")] = String(value || "").trim();
    });
    cardState.formValues = normalizeOperationFormValues(operation, submittedValues);
    setStatus(`Running ${operation.method} ${operation.pathTemplate}...`);
    const result = await sendWorkspaceAction("run-api-operation", {
      card: getCardPayload(cardState),
      formValues: cardState.formValues,
    });
    if (!result?.ok) {
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
  });
}

function createCardElements(cardState) {
  const article = document.createElement("article");
  article.className = "report-card";
  article.setAttribute("data-card-id", cardState.cardId);
  article.innerHTML = `
    <div class="card-head">
      <div class="card-title-wrap">
        <p class="card-title"></p>
        <p class="card-subtitle"></p>
      </div>
      <div class="card-actions">
        <button type="button" class="card-close" aria-label="Close report card" title="Close report card">
          <svg class="card-close-icon" viewBox="0 0 12 12" focusable="false" aria-hidden="true">
            <path d="M2 2 10 10" />
            <path d="M10 2 2 10" />
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body"></div>
  `;

  cardState.element = article;
  cardState.titleElement = article.querySelector(".card-title");
  cardState.subtitleElement = article.querySelector(".card-subtitle");
  cardState.closeButton = article.querySelector(".card-close");
  cardState.bodyElement = article.querySelector(".card-body");
}

function updateCardHeader(cardState) {
  const operation = normalizeOperationDescriptor(cardState?.operation);
  if (operation) {
    const title = operation.label ? `${operation.label}` : `${operation.method} ${operation.pathTemplate}`;
    const subtitle = `${operation.method} ${operation.pathTemplate}`;
    cardState.titleElement.textContent = title;
    cardState.titleElement.title = title;
    const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
    cardState.subtitleElement.textContent = `${subtitle} | Rows: ${rows}`;
    return;
  }
  const requestUrl = String(cardState.requestUrl || cardState.endpointUrl || "").trim();
  cardState.titleElement.textContent = requestUrl || "No CM URL";
  cardState.titleElement.title = requestUrl || "No CM URL";
  const zoom = cardState.zoomKey ? `Type: ${cardState.zoomKey}` : "Type: --";
  const rows = Array.isArray(cardState.rows) ? cardState.rows.length : 0;
  cardState.subtitleElement.textContent = `${zoom} | Rows: ${rows}`;
}

function ensureWorkspaceUnlocked() {
  if (!state.workspaceLocked) {
    return true;
  }
  setStatus(getWorkspaceLockMessage(), "error");
  return false;
}

async function rerunCard(cardState) {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (normalizeOperationDescriptor(cardState?.operation)) {
    const result = await sendWorkspaceAction("run-api-operation", {
      card: getCardPayload(cardState),
      formValues: cardState.formValues && typeof cardState.formValues === "object" ? cardState.formValues : {},
    });
    if (!result?.ok) {
      renderCardMessage(cardState, result?.error || "Unable to run CM V2 operation.", { error: true });
      setStatus(result?.error || "Unable to run CM V2 operation.", "error");
    }
    return;
  }
  const result = await sendWorkspaceAction("run-card", {
    card: getCardPayload(cardState),
  });
  if (!result?.ok) {
    renderCardMessage(cardState, result?.error || "Unable to run report from UnderPAR CM controller.", { error: true });
    setStatus(result?.error || "Unable to run report from UnderPAR CM controller.", "error");
  }
}

function wireCardRerunUrl(cardState) {
  const rerunUrl = cardState?.bodyElement?.querySelector(".card-rerun-url");
  if (!rerunUrl) {
    return;
  }
  rerunUrl.addEventListener("click", (event) => {
    event.preventDefault();
    void rerunCard(cardState);
  });
}

function ensureCard(cardMeta) {
  const cardId = String(cardMeta?.cardId || "").trim();
  if (!cardId) {
    return null;
  }

  if (state.cardsById.has(cardId)) {
    const existing = state.cardsById.get(cardId);
    if (cardMeta?.endpointUrl) {
      existing.endpointUrl = String(cardMeta.endpointUrl);
    }
    if (cardMeta?.requestUrl) {
      existing.requestUrl = String(cardMeta.requestUrl);
    }
    if (cardMeta?.zoomKey) {
      existing.zoomKey = String(cardMeta.zoomKey);
    }
    if (Array.isArray(cardMeta?.columns)) {
      existing.columns = cardMeta.columns.map((column) => String(column || "")).filter(Boolean);
    }
    if (cardMeta?.operation && typeof cardMeta.operation === "object") {
      existing.operation = normalizeOperationDescriptor(cardMeta.operation);
    }
    if (cardMeta?.formValues && typeof cardMeta.formValues === "object") {
      existing.formValues = normalizeOperationFormValues(existing.operation, cardMeta.formValues);
    }
    updateCardHeader(existing);
    return existing;
  }

  const cardState = {
    cardId,
    endpointUrl: String(cardMeta?.endpointUrl || ""),
    requestUrl: String(cardMeta?.requestUrl || cardMeta?.endpointUrl || ""),
    zoomKey: String(cardMeta?.zoomKey || ""),
    columns: Array.isArray(cardMeta?.columns) ? cardMeta.columns.map((column) => String(column || "")).filter(Boolean) : [],
    rows: [],
    sortStack: [],
    lastModified: "",
    operation: cardMeta?.operation && typeof cardMeta.operation === "object" ? normalizeOperationDescriptor(cardMeta.operation) : null,
    formValues:
      cardMeta?.formValues && typeof cardMeta.formValues === "object"
        ? normalizeOperationFormValues(normalizeOperationDescriptor(cardMeta.operation), cardMeta.formValues)
        : {},
    running: false,
    element: null,
    titleElement: null,
    subtitleElement: null,
    closeButton: null,
    bodyElement: null,
  };

  createCardElements(cardState);
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Waiting for data...");

  cardState.closeButton.addEventListener("click", () => {
    cardState.element?.remove();
    state.cardsById.delete(cardState.cardId);
  });

  state.cardsById.set(cardId, cardState);
  els.cardsHost.prepend(cardState.element);
  return cardState;
}

function formatLastModifiedForDisplay(rawHttpDate) {
  if (rawHttpDate == null || String(rawHttpDate).trim() === "") {
    return "";
  }
  const date = new Date(rawHttpDate);
  if (Number.isNaN(date.getTime())) {
    return String(rawHttpDate || "");
  }
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function renderCardTable(cardState, rows, lastModified) {
  const normalizedRows = normalizeRows(rows);
  if (normalizedRows.length === 0) {
    renderCardMessage(cardState, "No data");
    return;
  }

  const headers = Array.from(
    new Set([
      ...(Array.isArray(cardState.columns) ? cardState.columns : []),
      ...Object.keys(normalizedRows[0] || {}),
    ])
  ).filter(Boolean);

  cardState.bodyElement.innerHTML = `
    <div class="esm-table-wrapper">
      <table class="esm-table">
        <thead><tr></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td class="esm-footer-cell">
              <div class="esm-footer">
                <a href="#" class="cm-rerun-link">RERUN</a>
                <span class="esm-last-modified"></span>
                <span class="esm-close" title="Close table"> x </span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    ${buildCardColumnsMarkup(cardState)}
  `;

  const table = cardState.bodyElement.querySelector(".esm-table");
  const tableWrapper = cardState.bodyElement.querySelector(".esm-table-wrapper");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const footerCell = cardState.bodyElement.querySelector(".esm-footer-cell");
  const lastModifiedLabel = cardState.bodyElement.querySelector(".esm-last-modified");
  const rerunLink = cardState.bodyElement.querySelector(".cm-rerun-link");
  const closeButton = cardState.bodyElement.querySelector(".esm-close");

  const tableState = {
    wrapper: tableWrapper,
    table,
    thead,
    tbody,
    headers,
    data: normalizedRows,
    sortStack: headers.length > 0 ? [{ col: headers[0], dir: "DESC" }] : [],
  };

  const headerRow = thead.querySelector("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    th.title = header;
    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.style.marginLeft = "6px";
    th.appendChild(icon);

    th._updateState = () => {
      const isActive = tableState.sortStack[0]?.col === header;
      th.classList.toggle("active-sort", isActive);
      icon.textContent = isActive ? (tableState.sortStack[0].dir === "ASC" ? "▲" : "▼") : "";
    };

    th.addEventListener("click", (event) => {
      const existingRule = tableState.sortStack.find((rule) => rule.col === header);
      if (event.shiftKey && existingRule) {
        existingRule.dir = existingRule.dir === "DESC" ? "ASC" : "DESC";
      } else if (event.shiftKey) {
        tableState.sortStack.push({ col: header, dir: "DESC" });
      } else {
        tableState.sortStack = [
          {
            col: header,
            dir: existingRule ? (existingRule.dir === "DESC" ? "ASC" : "DESC") : "DESC",
          },
        ];
      }
      tableState.data = sortRows(tableState.data, tableState.sortStack);
      renderTableBody(tableState);
      updateTableWrapperViewport(tableState);
      refreshHeaderStates(tableState);
      cardState.sortStack = tableState.sortStack;
    });
    headerRow.appendChild(th);
  });

  if (footerCell) {
    footerCell.colSpan = Math.max(1, headers.length);
  }
  if (lastModifiedLabel) {
    lastModifiedLabel.textContent = lastModified
      ? `Last-Modified: ${formatLastModifiedForDisplay(lastModified)}`
      : "Last-Modified: (real-time)";
  }

  if (rerunLink) {
    rerunLink.addEventListener("click", (event) => {
      event.preventDefault();
      void rerunCard(cardState);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      cardState.rows = [];
      cardState.lastModified = "";
      cardState.sortStack = [];
      updateCardHeader(cardState);
      renderCardMessage(cardState, "Table closed.");
    });
  }

  wireCardRerunUrl(cardState);
  tableState.data = sortRows(tableState.data, tableState.sortStack);
  renderTableBody(tableState);
  updateTableWrapperViewport(tableState);
  refreshHeaderStates(tableState);
  cardState.sortStack = tableState.sortStack;
}

function applyReportStart(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = true;
  cardState.rows = [];
  cardState.sortStack = [];
  updateCardHeader(cardState);
  renderCardMessage(cardState, "Loading report...");
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function applyReportForm(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  if (payload?.operation && typeof payload.operation === "object") {
    cardState.operation = normalizeOperationDescriptor(payload.operation);
  }
  cardState.formValues = normalizeOperationFormValues(cardState.operation, payload?.formValues || cardState.formValues || {});
  cardState.rows = [];
  cardState.sortStack = [];
  updateCardHeader(cardState);
  renderOperationFormCard(cardState, {
    formValues: cardState.formValues,
  });
  if (cardState.element && !document.hidden) {
    cardState.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function applyReportResult(payload) {
  const cardState = ensureCard(payload);
  if (!cardState) {
    return;
  }
  cardState.running = false;

  if (!payload?.ok) {
    const error = payload?.error || "Request failed.";
    renderCardMessage(cardState, error, { error: true });
    setStatus(error, "error");
    return;
  }

  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  cardState.rows = rows;
  cardState.lastModified = String(payload?.lastModified || "");
  cardState.sortStack = [];
  updateCardHeader(cardState);

  if (rows.length === 0) {
    renderCardMessage(cardState, "No data");
    return;
  }

  renderCardTable(cardState, rows, cardState.lastModified);
}

function applyControllerState(payload) {
  state.controllerOnline = payload?.controllerOnline === true;
  if (payload?.cmAvailable === true) {
    state.cmAvailable = true;
  } else if (payload?.cmAvailable === false) {
    state.cmAvailable = false;
  } else {
    state.cmAvailable = null;
  }
  state.programmerId = String(payload?.programmerId || "");
  state.programmerName = String(payload?.programmerName || "");
  state.requestorIds = Array.isArray(payload?.requestorIds)
    ? payload.requestorIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.mvpdIds = Array.isArray(payload?.mvpdIds)
    ? payload.mvpdIds.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  state.profileHarvest =
    payload?.profileHarvest && typeof payload.profileHarvest === "object"
      ? {
          ...payload.profileHarvest,
        }
      : null;

  state.cardsById.forEach((cardState) => {
    if (!normalizeOperationDescriptor(cardState?.operation)) {
      return;
    }
    const existingValues = cardState.formValues && typeof cardState.formValues === "object" ? cardState.formValues : {};
    cardState.formValues = normalizeOperationFormValues(cardState.operation, {
      baseUrl: String(existingValues.baseUrl || "").trim(),
      authUser: String(existingValues.authUser || "").trim(),
      authPass: String(existingValues.authPass || "").trim(),
      xTerminate: String(existingValues.xTerminate || "").trim(),
    });
    if (cardState.bodyElement?.querySelector(".cm-api-form")) {
      renderOperationFormCard(cardState, {
        formValues: cardState.formValues,
      });
    }
  });

  updateWorkspaceLockState();
  updateControllerBanner();
}

function handleWorkspaceEvent(eventName, payload) {
  const event = String(eventName || "").trim();
  if (!event) {
    return;
  }

  if (event === "controller-state") {
    applyControllerState(payload);
    return;
  }
  if (event === "report-start") {
    applyReportStart(payload);
    return;
  }
  if (event === "report-form") {
    applyReportForm(payload);
    return;
  }
  if (event === "report-result") {
    applyReportResult(payload);
    return;
  }
  if (event === "batch-start") {
    state.batchRunning = true;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-running ${total} report(s)...` : "Re-running reports...");
    return;
  }
  if (event === "batch-end") {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    const total = Number(payload?.total || 0);
    setStatus(total > 0 ? `Re-run completed for ${total} report(s).` : "Re-run completed.");
  }
}

async function sendWorkspaceAction(action, payload = {}) {
  if (String(action || "").trim().toLowerCase() !== "workspace-ready" && !ensureWorkspaceUnlocked()) {
    return { ok: false, error: getWorkspaceLockMessage() };
  }
  try {
    return await chrome.runtime.sendMessage({
      type: CM_MESSAGE_TYPE,
      channel: "workspace-action",
      action,
      ...payload,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function rerunAllCards() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  if (state.cardsById.size === 0) {
    setStatus("No reports are open.");
    return;
  }

  const cards = [...state.cardsById.values()].map((cardState) => getCardPayload(cardState));
  state.batchRunning = true;
  syncActionButtonsDisabled();
  setStatus(`Re-running ${cards.length} report(s)...`);
  const result = await sendWorkspaceAction("rerun-all", { cards });
  if (!result?.ok) {
    state.batchRunning = false;
    syncActionButtonsDisabled();
    setStatus(result?.error || "Unable to re-run reports.", "error");
  }
}

function clearWorkspace() {
  if (!ensureWorkspaceUnlocked()) {
    return;
  }
  state.cardsById.forEach((cardState) => {
    cardState.element?.remove();
  });
  state.cardsById.clear();
}

function registerEventHandlers() {
  if (els.rerunAllButton) {
    els.rerunAllButton.addEventListener("click", () => {
      void rerunAllCards();
    });
  }
  if (els.clearButton) {
    els.clearButton.addEventListener("click", () => {
      clearWorkspace();
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== CM_MESSAGE_TYPE || message?.channel !== "workspace-event") {
      return false;
    }
    const targetWindowId = Number(message?.targetWindowId || 0);
    if (targetWindowId > 0 && Number(state.windowId || 0) > 0 && targetWindowId !== Number(state.windowId)) {
      return false;
    }
    handleWorkspaceEvent(message?.event, message?.payload || {});
    return false;
  });
}

async function init() {
  try {
    const currentWindow = await chrome.windows.getCurrent();
    state.windowId = Number(currentWindow?.id || 0);
  } catch {
    state.windowId = 0;
  }

  registerEventHandlers();
  updateWorkspaceLockState();
  updateControllerBanner();

  const result = await sendWorkspaceAction("workspace-ready");
  if (!result?.ok) {
    setStatus(result?.error || "Unable to contact UnderPAR CM controller.", "error");
  }
}

void init();
