const extractBtn = document.getElementById("extractBtn");
const extractAllBtn = document.getElementById("extractAllBtn");
const copyJsonlBtn = document.getElementById("copyJsonlBtn");
const downloadJsonlBtn = document.getElementById("downloadJsonlBtn");
const downloadJsonBtn = document.getElementById("downloadJsonBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const summaryEl = document.getElementById("summary");

let lastSessions = [];

function setSummary(text) {
  summaryEl.textContent = text;
}

function setExportButtonsEnabled(enabled) {
  copyJsonlBtn.disabled = !enabled;
  downloadJsonlBtn.disabled = !enabled;
  downloadJsonBtn.disabled = !enabled;
  downloadCsvBtn.disabled = !enabled;
}

function setExtractButtonsDisabled(disabled) {
  extractBtn.disabled = disabled;
  extractAllBtn.disabled = disabled;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toJsonl(items) {
  return items.map((item) => JSON.stringify(item)).join("\n");
}

function toCsvValue(value) {
  if (value == null) return "";
  const text = Array.isArray(value) ? value.join(" | ") : String(value);
  if (/[",\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function toCsv(items) {
  if (!items.length) return "";
  const keys = [
    "session_id",
    "captured_at_utc",
    "source_url",
    "entry_url",
    "exit_url",
    "referrer",
    "duration_text",
    "duration_sec",
    "clicks",
    "pages",
    "user_id",
    "country",
    "browser",
    "device",
    "local_time_hint",
    "local_date_hint",
    "session_insights_text",
  ];
  const header = keys.join(",");
  const rows = items.map((item) => keys.map((key) => toCsvValue(item[key])).join(","));
  return [header, ...rows].join("\n");
}

function triggerDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download(
    {
      url,
      filename,
      saveAs: true,
    },
    () => {
      URL.revokeObjectURL(url);
    }
  );
}

function timestampForFilename(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function isClarityUrl(url) {
  return typeof url === "string" && /^https:\/\/clarity\.microsoft\.com\//i.test(url);
}

async function sendMessageWithInjectionFallback(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    const missingReceiver =
      /Receiving end does not exist/i.test(text) ||
      /Could not establish connection/i.test(text);
    if (!missingReceiver) {
      throw error;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"],
    });
    await sleep(60);
    return chrome.tabs.sendMessage(tabId, message);
  }
}

async function extractSessionsFromTab(mode) {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    throw new Error("No active tab detected.");
  }
  if (!isClarityUrl(tab.url || "")) {
    throw new Error("Current tab is not a clarity.microsoft.com page.");
  }
  const message =
    mode === "all"
      ? {
          type: "EXTRACT_CLARITY_SESSIONS_ALL",
          options: { maxSteps: 120, stepDelayMs: 250 },
        }
      : { type: "EXTRACT_CLARITY_SESSIONS" };
  const response = await sendMessageWithInjectionFallback(tab.id, message);
  if (!response || !response.ok) {
    throw new Error((response && response.error) || "Extraction failed.");
  }
  return {
    sessions: response.sessions || [],
    meta: response.meta || { mode: "visible_only" },
  };
}

function summarize(sessions, meta) {
  if (!sessions.length) return "No matching session panels found on this page.";

  const byEntry = new Map();
  for (const item of sessions) {
    const key = item.entry_url || "(unknown entry)";
    byEntry.set(key, (byEntry.get(key) || 0) + 1);
  }
  const topEntries = [...byEntry.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([url, count]) => `- ${count}x ${url}`)
    .join("\n");

  return [
    `Extracted sessions: ${sessions.length}`,
    `Mode: ${meta && meta.mode ? meta.mode : "visible_only"}`,
    meta && typeof meta.steps === "number" ? `Steps: ${meta.steps}` : null,
    meta && typeof meta.clickedCards === "number"
      ? `Clicked cards: ${meta.clickedCards}`
      : null,
    meta && typeof meta.enrichedSessions === "number"
      ? `Enriched sessions: ${meta.enrichedSessions}`
      : null,
    meta && typeof meta.insightSessions === "number"
      ? `Sessions with insights: ${meta.insightSessions}`
      : null,
    meta && typeof meta.endReached === "boolean"
      ? `Reached list end: ${meta.endReached ? "yes" : "no"}`
      : null,
    "",
    "Top entry URLs:",
    topEntries || "- (none)",
    "",
    "Ready to export JSONL / JSON / CSV.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function runExtract(mode) {
  try {
    setExtractButtonsDisabled(true);
    setSummary(mode === "all" ? "Auto-scrolling and extracting..." : "Extracting...");
    const result = await extractSessionsFromTab(mode);
    const sessions = result.sessions;
    lastSessions = sessions;
    setExportButtonsEnabled(sessions.length > 0);
    setSummary(summarize(sessions, result.meta));
  } catch (error) {
    setExportButtonsEnabled(false);
    setSummary(
      "Failed to extract.\n\n" +
        (error instanceof Error ? error.message : String(error)) +
        "\n\nTip: Open a clarity.microsoft.com recordings page first."
    );
  } finally {
    setExtractButtonsDisabled(false);
  }
}

extractBtn.addEventListener("click", async () => {
  await runExtract("visible");
});

extractAllBtn.addEventListener("click", async () => {
  await runExtract("all");
});

copyJsonlBtn.addEventListener("click", async () => {
  if (!lastSessions.length) return;
  const jsonl = toJsonl(lastSessions);
  try {
    await navigator.clipboard.writeText(jsonl);
    setSummary(summarize(lastSessions, { mode: "last_result" }) + "\n\nCopied JSONL to clipboard.");
  } catch (error) {
    setSummary(
      summarize(lastSessions, { mode: "last_result" }) +
        "\n\nClipboard copy failed: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
});

downloadJsonlBtn.addEventListener("click", () => {
  if (!lastSessions.length) return;
  const filename = `clarity-sessions-${timestampForFilename()}.jsonl`;
  triggerDownload(filename, toJsonl(lastSessions), "application/x-ndjson");
});

downloadJsonBtn.addEventListener("click", () => {
  if (!lastSessions.length) return;
  const filename = `clarity-sessions-${timestampForFilename()}.json`;
  const content = JSON.stringify(lastSessions, null, 2);
  triggerDownload(filename, content, "application/json");
});

downloadCsvBtn.addEventListener("click", () => {
  if (!lastSessions.length) return;
  const filename = `clarity-sessions-${timestampForFilename()}.csv`;
  triggerDownload(filename, toCsv(lastSessions), "text/csv");
});

setExportButtonsEnabled(false);
