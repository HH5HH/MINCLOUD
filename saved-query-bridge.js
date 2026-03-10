const SAVED_QUERY_STORAGE_PREFIX = "underpar:saved-esm-query:";
const SAVED_QUERY_BRIDGE_MESSAGE_TYPE = "underpar:meg-saved-query-bridge";
const SAVED_QUERY_BRIDGE_RESPONSE_TYPE = `${SAVED_QUERY_BRIDGE_MESSAGE_TYPE}:response`;

function normalizeSavedQueryName(value = "") {
  return String(value || "").replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function buildSavedQueryStorageKey(name = "") {
  return `${SAVED_QUERY_STORAGE_PREFIX}${encodeURIComponent(String(name || "").trim())}`;
}

function buildSavedQueryPayload(name = "", esmUrl = "") {
  return `${String(name || "").trim()}|${String(esmUrl || "").trim()}`;
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
      const parsedName = normalizeSavedQueryName(parsed.name || "");
      const parsedUrl = String(parsed.url || parsed.esmUrl || "").trim();
      if (parsedName && parsedUrl) {
        return {
          storageKey: normalizedStorageKey,
          name: parsedName,
          url: parsedUrl,
        };
      }
    }
  } catch (_error) {
    // Fall through to legacy string parsing.
  }
  const separatorIndex = normalizedPayload.indexOf("|");
  if (separatorIndex <= 0) {
    const rawName = normalizeSavedQueryName(
      decodeURIComponent(normalizedStorageKey.slice(SAVED_QUERY_STORAGE_PREFIX.length) || "")
    );
    const rawUrl = normalizedPayload;
    if (rawName && rawUrl) {
      return {
        storageKey: normalizedStorageKey,
        name: rawName,
        url: rawUrl,
      };
    }
    return null;
  }
  const name = normalizeSavedQueryName(normalizedPayload.slice(0, separatorIndex));
  const url = String(normalizedPayload.slice(separatorIndex + 1) || "").trim();
  if (!name || !url) {
    return null;
  }
  return {
    storageKey: normalizedStorageKey,
    name,
    url,
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
      const record = parseSavedQueryRecord(storageKey, localStorage.getItem(storageKey));
      if (record) {
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
      const url = String(payload?.payload?.url || "").trim();
      if (!name || !url) {
        respond(false, null, "Saved Query name and URL are required.");
        return;
      }
      const storageKey = buildSavedQueryStorageKey(name);
      const existed = localStorage.getItem(storageKey) !== null;
      localStorage.setItem(storageKey, buildSavedQueryPayload(name, url));
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
