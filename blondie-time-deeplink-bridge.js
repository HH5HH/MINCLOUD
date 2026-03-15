const UNDERPAR_BLONDIE_TIME_DEEPLINK_REQUEST_TYPE = "underpar:openBlondieTimeWorkspaceFromDeeplink";
const UNDERPAR_BLONDIE_TIME_WORKSPACE_PATH = "blondie-time-workspace.html";

async function init() {
  const status = document.getElementById("status");
  const manualWrap = document.getElementById("manual-wrap");
  const manualLink = document.getElementById("manual-link");
  const workspaceUrl = chrome.runtime.getURL(UNDERPAR_BLONDIE_TIME_WORKSPACE_PATH);
  if (manualLink instanceof HTMLAnchorElement) {
    manualLink.href = workspaceUrl;
  }

  try {
    const result = await chrome.runtime.sendMessage({
      type: UNDERPAR_BLONDIE_TIME_DEEPLINK_REQUEST_TYPE,
    });
    if (!result?.ok) {
      throw new Error(result?.error || "Unable to focus Blondie Time Workspace.");
    }
    status.textContent = "Blondie Time is open in UnderPAR.";
    window.setTimeout(() => {
      try {
        window.close();
      } catch (_error) {
        // Ignore close failures. The active BT workspace has already been focused.
      }
    }, 150);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    status.textContent = message || "Unable to open Blondie Time.";
    if (manualWrap) {
      manualWrap.hidden = false;
    }
  }
}

void init();
