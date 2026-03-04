#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const METRIC_KEYS = [
  "sessions",
  "engagementTime",
  "scrollDepth",
  "rageClicks",
  "deadClicks",
  "quickbackClicks",
  "scriptErrors",
  "errorClicks",
  "excessiveScrolls",
];

const ISSUE_METRIC_KEYS = [
  "rageClicks",
  "deadClicks",
  "quickbackClicks",
  "scriptErrors",
  "errorClicks",
];

const ISSUE_METRIC_SET = new Set(ISSUE_METRIC_KEYS);

const METRIC_FIELD_PATTERNS = {
  sessions: [/^totalSessionCount$/i, /^sessionCount$/i, /^sessions?$/i, /traffic/i],
  engagementTime: [
    /^engagementTime$/i,
    /^avgEngagementTime$/i,
    /^averageEngagementTime$/i,
    /^avgSessionTime$/i,
    /sessionTime/i,
    /time/i,
  ],
  scrollDepth: [/^scrollDepth$/i, /^pageScrollDepth$/i, /scrollDepth/i, /scroll/i],
  rageClicks: [/^rageClickCount$/i, /rageClick/i],
  deadClicks: [/^deadClickCount$/i, /deadClick/i],
  quickbackClicks: [/^quickbackClickCount$/i, /quickbackClick/i, /quickback/i],
  scriptErrors: [/^scriptErrorCount$/i, /scriptError/i],
  errorClicks: [/^errorClickCount$/i, /errorClick/i],
  excessiveScrolls: [/^excessiveScrollCount$/i, /excessiveScroll/i],
};

const ASSET_URL_PATTERN =
  /\.(?:avif|bmp|css|gif|ico|jpeg|jpg|js|json|map|mp3|mp4|pdf|png|svg|txt|webm|webp|woff|woff2|xml)(?:\?.*)?$/i;

const DIMENSION_KEYS = [
  "URL",
  "Device",
  "OS",
  "Browser",
  "Source",
  "Channel",
  "Country/Region",
  "Country",
  "Page Title",
];

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const body = arg.slice(2);
    const eq = body.indexOf("=");
    if (eq === -1) {
      args[body] = true;
      continue;
    }
    const key = body.slice(0, eq);
    const value = body.slice(eq + 1);
    args[key] = value;
  }
  return args;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}

function toBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
}

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/,/g, "").replace(/%$/, "").trim();
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value, digits = 4) {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

function isIssueMetric(metricKey) {
  return ISSUE_METRIC_SET.has(metricKey);
}

function isLikelyAssetUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ASSET_URL_PATTERN.test(parsed.pathname);
  } catch {
    return ASSET_URL_PATTERN.test(String(url));
  }
}

function getDimensionValue(row, preferredDimension) {
  if (!row || typeof row !== "object") return null;
  if (preferredDimension && row[preferredDimension] != null) {
    return String(row[preferredDimension]);
  }

  if (preferredDimension) {
    const wanted = preferredDimension.toLowerCase();
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase() === wanted && value != null) {
        return String(value);
      }
    }
  }

  for (const key of DIMENSION_KEYS) {
    if (row[key] != null) return String(row[key]);
  }

  const candidates = Object.entries(row).filter(([, value]) => {
    if (value == null) return false;
    if (typeof value === "number") return false;
    if (typeof value !== "string") return false;
    if (toNumber(value) != null) return false;
    return true;
  });
  if (candidates.length > 0) {
    return String(candidates[0][1]);
  }
  return null;
}

function normalizeMetricName(metricName) {
  const normalized = String(metricName || "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();
  if (!normalized) return null;

  if (normalized.includes("traffic")) return "sessions";
  if (normalized.includes("engagement") && normalized.includes("time")) {
    return "engagementTime";
  }
  if (normalized.includes("scroll") && normalized.includes("depth")) {
    return "scrollDepth";
  }
  if (normalized.includes("rage") && normalized.includes("click")) {
    return "rageClicks";
  }
  if (normalized.includes("dead") && normalized.includes("click")) {
    return "deadClicks";
  }
  if (
    normalized.includes("quickback") ||
    (normalized.includes("quick") && normalized.includes("back"))
  ) {
    return "quickbackClicks";
  }
  if (normalized.includes("script") && normalized.includes("error")) {
    return "scriptErrors";
  }
  if (normalized.includes("error") && normalized.includes("click")) {
    return "errorClicks";
  }
  if (normalized.includes("excessive") && normalized.includes("scroll")) {
    return "excessiveScrolls";
  }

  return null;
}

function pickMetricValue(row, metricKey) {
  if (!row || typeof row !== "object") return null;
  const patterns = METRIC_FIELD_PATTERNS[metricKey] || [];

  const entries = Object.entries(row)
    .map(([key, rawValue]) => ({
      key,
      value: toNumber(rawValue),
    }))
    .filter((item) => item.value != null);

  if (entries.length === 0) return null;

  const exact = (candidateKeys) => {
    const wanted = candidateKeys.map((key) => key.toLowerCase());
    for (const entry of entries) {
      if (wanted.includes(entry.key.toLowerCase())) {
        return entry.value;
      }
    }
    return null;
  };

  const byRegex = (regexes, rejectRegex) => {
    for (const regex of regexes) {
      for (const entry of entries) {
        if (!regex.test(entry.key)) continue;
        if (rejectRegex && rejectRegex.test(entry.key)) continue;
        return entry.value;
      }
    }
    return null;
  };

  if (metricKey === "sessions") {
    const selected = exact([
      "totalSessionCount",
      "sessionCount",
      "sessionsCount",
      "sessions",
    ]);
    if (selected != null) return selected;
    return byRegex([/session/i], /bot|distinct/i);
  }

  if (metricKey === "engagementTime") {
    const selected = exact([
      "activeTime",
      "totalTime",
      "engagementTime",
      "avgEngagementTime",
      "averageEngagementTime",
      "avgSessionTime",
    ]);
    if (selected != null) return selected;
    return byRegex([/active.*time/i, /total.*time/i, /engagement.*time/i, /time/i]);
  }

  if (metricKey === "scrollDepth") {
    const selected = exact(["averageScrollDepth", "scrollDepth", "pageScrollDepth"]);
    if (selected != null) return selected;
    return byRegex([/scroll.*depth/i, /depth/i]);
  }

  if (isIssueMetric(metricKey) || metricKey === "excessiveScrolls") {
    const selected = exact([
      "subTotal",
      "totalCount",
      "count",
      "rageClickCount",
      "deadClickCount",
      "quickbackClickCount",
      "scriptErrorCount",
      "errorClickCount",
      "excessiveScrollCount",
    ]);
    if (selected != null) return selected;
    return byRegex(
      [/sub.?total/i, /count$/i],
      /sessions?|pagesViews?|percentage|distinct|bot/i
    );
  }

  for (const regex of patterns) {
    for (const entry of entries) {
      if (regex.test(entry.key)) {
        if (metricKey === "sessions" && /bot/i.test(entry.key)) continue;
        return entry.value;
      }
    }
  }

  return null;
}

function createEmptyUrlStat(url) {
  return {
    url,
    sessions: 0,
    engagementTime: 0,
    scrollDepth: 0,
    rageClicks: 0,
    deadClicks: 0,
    quickbackClicks: 0,
    scriptErrors: 0,
    errorClicks: 0,
    excessiveScrolls: 0,
    issueCount: 0,
    issueRate: 0,
    sessionShare: 0,
    priorityScore: 0,
    dominantIssue: null,
    suggestion: "",
    breakdownHint: "",
  };
}

function getQueryData(query) {
  if (!query || typeof query !== "object") return null;
  if (Array.isArray(query.data)) return query.data;
  if (Array.isArray(query.response)) return query.response;
  return null;
}

function buildUrlStats(byUrlQuery, options = {}) {
  const { excludeAssets = true } = options;
  const metricBlocks = getQueryData(byUrlQuery);
  if (!Array.isArray(metricBlocks)) {
    throw new Error("Missing or invalid URL query data.");
  }

  const map = new Map();
  for (const block of metricBlocks) {
    if (!block || typeof block !== "object") continue;
    const metricKey = normalizeMetricName(block.metricName);
    if (!metricKey) continue;

    const rows = Array.isArray(block.information) ? block.information : [];
    for (const row of rows) {
      const url = getDimensionValue(row, "URL");
      if (!url) continue;
      if (excludeAssets && isLikelyAssetUrl(url)) continue;
      const value = pickMetricValue(row, metricKey);
      if (value == null) continue;

      const current = map.get(url) || createEmptyUrlStat(url);
      current[metricKey] += value;
      map.set(url, current);
    }
  }

  const stats = Array.from(map.values());
  const totalSessions = stats.reduce((sum, item) => sum + item.sessions, 0);

  for (const item of stats) {
    item.issueCount = ISSUE_METRIC_KEYS.reduce(
      (sum, key) => sum + (item[key] || 0),
      0
    );
    item.issueRate = item.sessions > 0 ? item.issueCount / item.sessions : 0;
    item.sessionShare = totalSessions > 0 ? item.sessions / totalSessions : 0;
    item.priorityScore = item.sessionShare * item.issueRate * 100;
    const dominantIssue = ISSUE_METRIC_KEYS.map((key) => ({
      key,
      value: item[key] || 0,
    }))
      .sort((a, b) => b.value - a.value)[0];
    item.dominantIssue =
      dominantIssue && dominantIssue.value > 0 ? dominantIssue.key : null;
  }

  return stats.sort((a, b) => b.priorityScore - a.priorityScore);
}

function buildBreakdownIndex(query) {
  const dimensions = Array.isArray(query?.dimensions) ? query.dimensions : [];
  if (dimensions.length < 2) return null;

  const primaryDimension = dimensions[0];
  const secondaryDimension = dimensions[1];
  const metricBlocks = getQueryData(query);
  if (!Array.isArray(metricBlocks)) return null;

  const flat = new Map();
  for (const block of metricBlocks) {
    if (!block || typeof block !== "object") continue;
    const metricKey = normalizeMetricName(block.metricName);
    if (!metricKey) continue;

    const rows = Array.isArray(block.information) ? block.information : [];
    for (const row of rows) {
      const primary = getDimensionValue(row, primaryDimension);
      const secondary = getDimensionValue(row, secondaryDimension);
      if (!primary || !secondary) continue;

      const value = pickMetricValue(row, metricKey);
      if (value == null) continue;

      const key = `${primary}__${secondary}`;
      const current =
        flat.get(key) ||
        Object.fromEntries([
          ["url", primary],
          ["dimensionName", secondaryDimension],
          ["dimensionValue", secondary],
          ...METRIC_KEYS.map((metric) => [metric, 0]),
        ]);
      current[metricKey] += value;
      flat.set(key, current);
    }
  }

  const grouped = new Map();
  for (const item of flat.values()) {
    const issueCount = ISSUE_METRIC_KEYS.reduce(
      (sum, key) => sum + (item[key] || 0),
      0
    );
    const issueRate = item.sessions > 0 ? issueCount / item.sessions : 0;
    const enriched = {
      ...item,
      issueCount,
      issueRate,
    };

    const list = grouped.get(item.url) || [];
    list.push(enriched);
    grouped.set(item.url, list);
  }

  for (const [url, list] of grouped.entries()) {
    list.sort((a, b) => b.issueRate - a.issueRate || b.issueCount - a.issueCount);
    grouped.set(url, list);
  }

  return {
    primaryDimension,
    secondaryDimension,
    data: grouped,
  };
}

function formatPercent(value) {
  return `${round(value * 100, 2)}%`;
}

function buildSuggestion(item) {
  const sessions = Math.max(item.sessions, 1);
  const rates = {
    rage: item.rageClicks / sessions,
    dead: item.deadClicks / sessions,
    quickback: item.quickbackClicks / sessions,
    script: item.scriptErrors / sessions,
    errorClick: item.errorClicks / sessions,
  };

  if (rates.script >= 0.01) {
    return "Script errors are elevated. Fix blocking frontend errors first, then retest the core path.";
  }
  if (rates.dead >= 0.04) {
    return "Dead clicks are high. Audit elements that look clickable but are not, and add clearer click feedback.";
  }
  if (rates.rage >= 0.03) {
    return "Rage clicks are high. Improve button responsiveness, loading states, and repeated-click prevention.";
  }
  if (rates.quickback >= 0.08) {
    return "Quickback is high. Improve landing-page intent match and surface key answers earlier on the page.";
  }
  if (item.scrollDepth > 0 && item.scrollDepth < 35) {
    return "Scroll depth is low. Move primary value props and CTA above the fold and reduce first-screen clutter.";
  }
  if (item.engagementTime > 0 && item.engagementTime < 20) {
    return "Engagement time is low. Strengthen hero copy and make the next action clearer.";
  }
  return "Prioritize small iterations: improve above-the-fold clarity, click feedback, and key-path visibility.";
}

function attachBreakdownHints(stats, breakdownIndexes) {
  const usable = breakdownIndexes.filter(Boolean);
  for (const item of stats) {
    let bestHint = "";
    let bestRate = -1;
    for (const index of usable) {
      const candidates = index.data.get(item.url) || [];
      const candidate = candidates.find((row) => row.sessions >= 10) || candidates[0];
      if (!candidate) continue;
      if (candidate.issueRate > bestRate) {
        bestRate = candidate.issueRate;
        bestHint = `${index.secondaryDimension}=${candidate.dimensionValue} (issueRate ${formatPercent(
          candidate.issueRate
        )}, sessions ${round(candidate.sessions, 0)})`;
      }
    }
    item.breakdownHint = bestHint;
    item.suggestion = buildSuggestion(item);
  }
}

function pickQuery(queries, id) {
  return queries.find((query) => query.id === id && query.status !== "error");
}

function renderMarkdownReport({ inputPath, rows, topN }) {
  const lines = [];
  lines.push("# Clarity Analysis Report");
  lines.push("");
  lines.push(`Source: \`${inputPath}\``);
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Top ${topN} URLs to Improve`);
  lines.push("");
  lines.push(
    "| URL | Sessions | Issue Rate | Priority | Dominant Issue | Breakdown Hint | Action |"
  );
  lines.push("| --- | ---: | ---: | ---: | --- | --- | --- |");

  for (const item of rows.slice(0, topN)) {
    lines.push(
      `| ${item.url} | ${round(item.sessions, 0)} | ${formatPercent(
        item.issueRate
      )} | ${round(item.priorityScore, 4)} | ${item.dominantIssue || "-"} | ${
        item.breakdownHint || "-"
      } | ${item.suggestion} |`
    );
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- Priority score formula: `sessionShare * issueRate * 100`.");
  lines.push(
    "- Issue metrics: rage clicks + dead clicks + quickback clicks + script errors + error clicks."
  );
  lines.push("- Use this as a ranking signal, then validate with session replays.");
  lines.push("");

  return lines.join("\n");
}

function printUsage() {
  console.log(`
Usage:
  node clarity-analyze.js [--input=clarity-live-insights.json] [--outDir=.]
                          [--top=10] [--minSessions=1] [--excludeAssets=true]
  `);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
}

async function loadFallbackQueriesFromRawDir(rawDir) {
  const plan = [
    { id: "by_url", dimensions: ["URL"], fileName: "by_url.json" },
    {
      id: "by_url_device",
      dimensions: ["URL", "Device"],
      fileName: "by_url_device.json",
    },
    {
      id: "by_url_os",
      dimensions: ["URL", "OS"],
      fileName: "by_url_os.json",
    },
    {
      id: "by_url_browser",
      dimensions: ["URL", "Browser"],
      fileName: "by_url_browser.json",
    },
    {
      id: "by_url_source",
      dimensions: ["URL", "Source"],
      fileName: "by_url_source.json",
    },
    {
      id: "by_url_channel",
      dimensions: ["URL", "Channel"],
      fileName: "by_url_channel.json",
    },
  ];

  const queries = [];
  for (const item of plan) {
    const filePath = path.join(rawDir, item.fileName);
    const data = await readJsonIfExists(filePath);
    if (!data) continue;
    queries.push({
      id: item.id,
      status: "ok",
      dimensions: item.dimensions,
      data,
      fromRawFallback: true,
      rawFilePath: filePath,
    });
  }
  return queries;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    printUsage();
    return;
  }

  const cwd = process.cwd();
  const inputPath = path.resolve(cwd, args.input || "clarity-live-insights.json");
  const outDir = path.resolve(cwd, args.outDir || ".");
  const topN = Math.max(1, toInt(args.top || 10, 10));
  const minSessions = Math.max(
    1,
    toInt(args.minSessions || process.env.CLARITY_MIN_SESSIONS || 1, 1)
  );
  const excludeAssets = toBool(
    args.excludeAssets ?? process.env.CLARITY_EXCLUDE_ASSETS,
    true
  );

  const raw = await fs.readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw);

  let queries = Array.isArray(parsed?.queries)
    ? parsed.queries
    : [{ id: "by_url", status: "ok", dimensions: ["URL"], data: parsed }];

  let usedRawFallback = false;
  let byUrlQuery = pickQuery(queries, "by_url");
  if (!byUrlQuery) {
    const rawDir = path.join(path.dirname(inputPath), "clarity-raw");
    const fallbackQueries = await loadFallbackQueriesFromRawDir(rawDir);
    if (fallbackQueries.length > 0) {
      queries = fallbackQueries;
      byUrlQuery = pickQuery(queries, "by_url");
      usedRawFallback = Boolean(byUrlQuery);
    }
  }

  if (!byUrlQuery) {
    throw new Error("Cannot find successful by_url query in input.");
  }

  const stats = buildUrlStats(byUrlQuery, { excludeAssets });
  const breakdownIndexes = [
    buildBreakdownIndex(pickQuery(queries, "by_url_device")),
    buildBreakdownIndex(pickQuery(queries, "by_url_os")),
    buildBreakdownIndex(pickQuery(queries, "by_url_browser")),
    buildBreakdownIndex(pickQuery(queries, "by_url_source")),
    buildBreakdownIndex(pickQuery(queries, "by_url_channel")),
  ];
  const filteredStats = stats.filter((item) => item.sessions >= minSessions);
  const finalStats = filteredStats.length > 0 ? filteredStats : stats;
  attachBreakdownHints(finalStats, breakdownIndexes);

  const sessionsOutput = finalStats
    .slice()
    .sort((a, b) => b.sessions - a.sessions)
    .map((item) => ({
      url: item.url,
      sessions: round(item.sessions, 0),
      sessionSharePct: round(item.sessionShare * 100, 2),
      engagementTime: round(item.engagementTime, 2),
      scrollDepth: round(item.scrollDepth, 2),
    }));

  const issueOutput = finalStats
    .slice()
    .sort((a, b) => b.issueCount - a.issueCount)
    .map((item) => ({
      url: item.url,
      rageClicks: round(item.rageClicks, 0),
      deadClicks: round(item.deadClicks, 0),
      quickbackClicks: round(item.quickbackClicks, 0),
      scriptErrors: round(item.scriptErrors, 0),
      errorClicks: round(item.errorClicks, 0),
      issueCount: round(item.issueCount, 0),
      issueRatePct: round(item.issueRate * 100, 2),
      priorityScore: round(item.priorityScore, 4),
      dominantIssue: item.dominantIssue,
      breakdownHint: item.breakdownHint,
      suggestion: item.suggestion,
    }));

  const actionItems = finalStats.slice(0, topN).map((item, index) => ({
    rank: index + 1,
    url: item.url,
    sessions: round(item.sessions, 0),
    issueRatePct: round(item.issueRate * 100, 2),
    priorityScore: round(item.priorityScore, 4),
    dominantIssue: item.dominantIssue,
    breakdownHint: item.breakdownHint,
    action: item.suggestion,
  }));

  await fs.mkdir(outDir, { recursive: true });
  await writeJson(path.join(outDir, "clarity-sessions.json"), sessionsOutput);
  await writeJson(path.join(outDir, "clarity-rageClicks.json"), issueOutput);
  await writeJson(path.join(outDir, "clarity-action-items.json"), actionItems);
  await writeJson(
    path.join(outDir, "clarity-analysis-summary.json"),
    {
      generatedAtUtc: new Date().toISOString(),
      inputPath,
      topN,
      minSessions,
      excludeAssets,
      totalUrls: finalStats.length,
      rawTotalUrls: stats.length,
      rows: actionItems,
    }
  );

  const report = renderMarkdownReport({ inputPath, rows: finalStats, topN });
  await fs.writeFile(path.join(outDir, "clarity-analysis-report.md"), report, "utf8");

  if (usedRawFallback) {
    console.log("Input had no successful by_url query. Used fallback data from clarity-raw.");
  }
  if (filteredStats.length === 0 && stats.length > 0 && minSessions > 1) {
    console.log(
      `No URL met minSessions=${minSessions}. Output includes all ${stats.length} URLs.`
    );
  }
  console.log(`Analyzed ${finalStats.length} URLs from ${inputPath}`);
  console.log(`Output files written to: ${outDir}`);
}

main().catch((error) => {
  console.error(
    `clarity-analyze.js failed: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
});
