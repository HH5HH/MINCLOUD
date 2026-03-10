const SAVED_QUERY_STORAGE_PREFIX = "underpar:saved-esm-query:";
const SAVED_QUERY_BRIDGE_MESSAGE_TYPE = "underpar:meg-saved-query-bridge";
const SAVED_QUERY_BRIDGE_RESPONSE_TYPE = `${SAVED_QUERY_BRIDGE_MESSAGE_TYPE}:response`;

function normalizeSavedQueryName(value = "") {
  return String(value || "").replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function buildSavedQueryStorageKey(name = "") {
  return `${SAVED_QUERY_STORAGE_PREFIX}${encodeURIComponent(String(name || "").trim())}`;
}

function stripSavedQueryScopedQueryParams(rawUrl = "", options = {}) {
  const normalized = String(rawUrl || "").trim();
  if (!normalized) {
    return "";
  }
  const stripRequestorId = options?.stripRequestorId === true;
  const hasAbsoluteScheme = /^[a-z][a-z\d+.-]*:/i.test(normalized);
  try {
    const parsed = hasAbsoluteScheme ? new URL(normalized) : new URL(normalized, "https://example.invalid");
    parsed.searchParams.delete("media-company");
    if (stripRequestorId) {
      parsed.searchParams.delete("requestor-id");
    }
    parsed.hash = "";
    return hasAbsoluteScheme ? parsed.toString() : `${String(parsed.pathname || "")}${String(parsed.search || "")}`;
  } catch (_error) {
    const withoutHash = normalized.split("#")[0] || "";
    const [path, query = ""] = withoutHash.split("?");
    const params = new URLSearchParams(query);
    params.delete("media-company");
    if (stripRequestorId) {
      params.delete("requestor-id");
    }
    const nextQuery = params.toString();
    return nextQuery ? `${path}?${nextQuery}` : path;
  }
}

function buildSavedQueryRecord(name = "", rawUrl = "", options = {}) {
  const normalizedName = normalizeSavedQueryName(name);
  const explicitRequestorId = options?.explicitRequestorId === true;
  const normalizedUrl = stripSavedQueryScopedQueryParams(String(rawUrl || "").trim(), {
    stripRequestorId: explicitRequestorId !== true,
  });
  if (!normalizedName || !normalizedUrl) {
    return null;
  }
  return {
    name: normalizedName,
    url: normalizedUrl,
    explicitRequestorId,
  };
}

function buildSavedQueryPayload(name = "", esmUrl = "", options = {}) {
  const record = buildSavedQueryRecord(name, esmUrl, options);
  if (!record) {
    return "";
  }
  return JSON.stringify({
    name: record.name,
    url: record.url,
    explicitRequestorId: record.explicitRequestorId,
  });
}

function parseSavedQueryRecord(storageKey = "", payload = "") {
  const normalizedStorageKey = String(storageKey || "").trim();
  if (!normalizedStorageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
    return null;
  }
  const normalizedPayload = String(payload || "").trim();
  try {
    const parsed = JSON.parse(normalizedPayload);
    if (parsed && typeof parsed === "object") {
      const record = buildSavedQueryRecord(parsed.name || "", parsed.url || parsed.esmUrl || "", {
        explicitRequestorId: parsed.explicitRequestorId === true,
      });
      if (record) {
        return {
          storageKey: normalizedStorageKey,
          ...record,
        };
      }
    }
  } catch (_error) {
    // Fall through to legacy string parsing.
  }
  const separatorIndex = normalizedPayload.indexOf("|");
  if (separatorIndex <= 0) {
    const record = buildSavedQueryRecord(
      decodeURIComponent(normalizedStorageKey.slice(SAVED_QUERY_STORAGE_PREFIX.length) || ""),
      normalizedPayload,
      { explicitRequestorId: false }
    );
    if (record) {
      return {
        storageKey: normalizedStorageKey,
        ...record,
      };
    }
    return null;
  }
  const record = buildSavedQueryRecord(
    normalizedPayload.slice(0, separatorIndex),
    String(normalizedPayload.slice(separatorIndex + 1) || "").trim(),
    { explicitRequestorId: false }
  );
  if (!record) {
    return null;
  }
  return {
    storageKey: normalizedStorageKey,
    ...record,
  };
}

function getSavedQueryRecords() {
  const records = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const storageKey = String(localStorage.key(index) || "").trim();
      if (!storageKey.startsWith(SAVED_QUERY_STORAGE_PREFIX)) {
        continue;
      }
      const payload = localStorage.getItem(storageKey);
      const record = parseSavedQueryRecord(storageKey, payload);
      if (record) {
        const normalizedPayload = buildSavedQueryPayload(record.name, record.url, {
          explicitRequestorId: record.explicitRequestorId === true,
        });
        if (payload !== normalizedPayload) {
          localStorage.setItem(storageKey, normalizedPayload);
        }
        records.push(record);
      }
    }
  } catch (_error) {
    return [];
  }
  return records.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));
}

window.addEventListener("message", (event) => {
  const payload = event?.data;
  if (!payload || payload.type !== SAVED_QUERY_BRIDGE_MESSAGE_TYPE) {
    return;
  }
  const requestId = String(payload.requestId || "").trim();
  const action = String(payload.action || "").trim().toLowerCase();
  const respond = (ok, result = null, error = "") => {
    event.source?.postMessage(
      {
        type: SAVED_QUERY_BRIDGE_RESPONSE_TYPE,
        requestId,
        ok,
        result,
        error: String(error || ""),
      },
      "*"
    );
  };

  try {
    if (action === "get-records") {
      respond(true, { records: getSavedQueryRecords() });
      return;
    }

    if (action === "put-record") {
      const name = normalizeSavedQueryName(payload?.payload?.name || "");
      const record = buildSavedQueryRecord(name, payload?.payload?.url || "", {
        explicitRequestorId: payload?.payload?.explicitRequestorId === true,
      });
      if (!record) {
        respond(false, null, "Saved Query name and URL are required.");
        return;
      }
      const storageKey = buildSavedQueryStorageKey(record.name);
      const existed = localStorage.getItem(storageKey) !== null;
      localStorage.setItem(storageKey, buildSavedQueryPayload(record.name, record.url, record));
      respond(true, {
        storageKey,
        existed,
      });
      return;
    }

    if (action === "delete-record") {
      const storageKey = String(payload?.payload?.storageKey || "").trim();
      if (!storageKey) {
        respond(false, null, "Saved Query storage key is required.");
        return;
      }
      localStorage.removeItem(storageKey);
      respond(true, {
        storageKey,
      });
      return;
    }

    respond(false, null, `Unsupported bridge action: ${action || "unknown"}`);
  } catch (error) {
    respond(false, null, error instanceof Error ? error.message : String(error));
  }
});
