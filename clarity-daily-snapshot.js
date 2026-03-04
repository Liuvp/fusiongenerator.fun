#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
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

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function copyIfExists(fromPath, toPath) {
  if (!(await fileExists(fromPath))) return false;
  await ensureDir(path.dirname(toPath));
  await fs.copyFile(fromPath, toPath);
  return true;
}

async function copyRawJsonFiles(rawDir, targetDir) {
  if (!(await fileExists(rawDir))) return [];
  await ensureDir(targetDir);
  const entries = await fs.readdir(rawDir, { withFileTypes: true });
  const copied = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.toLowerCase().endsWith(".json")) continue;
    const from = path.join(rawDir, entry.name);
    const to = path.join(targetDir, entry.name);
    await fs.copyFile(from, to);
    copied.push(entry.name);
  }
  return copied;
}

function toUtcDateLabel(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function toFileSafeTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runNodeScript({ cwd, scriptName, scriptArgs }) {
  const scriptPath = path.join(cwd, scriptName);
  const startedAt = new Date();
  const startedMs = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code, signal) => {
      resolve({
        scriptName,
        args: scriptArgs,
        startedAtUtc: startedAt.toISOString(),
        durationMs: Date.now() - startedMs,
        exitCode: code,
        signal: signal || null,
      });
    });
  });
}

function summarizeSnapshot(snapshot) {
  const meta = snapshot && typeof snapshot === "object" ? snapshot.meta || {} : {};
  return {
    fetchedAtUtc: meta.fetchedAtUtc || null,
    numOfDays: typeof meta.numOfDays === "number" ? meta.numOfDays : null,
    successCount: typeof meta.successCount === "number" ? meta.successCount : 0,
    failedCount: typeof meta.failedCount === "number" ? meta.failedCount : 0,
    skippedCount: typeof meta.skippedCount === "number" ? meta.skippedCount : 0,
    plannedRequests:
      typeof meta.plannedRequests === "number" ? meta.plannedRequests : null,
  };
}

function hasQuotaExceeded(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  const queries = Array.isArray(snapshot.queries) ? snapshot.queries : [];
  for (const query of queries) {
    if (!query || typeof query !== "object") continue;
    if (Number(query.statusCode) === 429) return true;
    const message = String(query.error || "").toLowerCase();
    if (message.includes("429") || message.includes("daily limit")) return true;
  }
  return false;
}

async function updateIndex({ indexPath, newRun, keepRuns }) {
  const index =
    (await readJsonIfExists(indexPath)) || {
      generatedAtUtc: null,
      runs: [],
    };

  const existingRuns = Array.isArray(index.runs) ? index.runs : [];
  const runs = [newRun, ...existingRuns].slice(0, keepRuns);
  const next = {
    generatedAtUtc: new Date().toISOString(),
    runs,
  };
  await writeJson(indexPath, next);
}

function printUsage() {
  console.log(`
Usage:
  node clarity-daily-snapshot.js [--numOfDays=1] [--date=YYYY-MM-DD]
                                 [--retries=2] [--retryDelayMs=5000]
                                 [--top=15] [--minSessions=3]
                                 [--includeChannel=false]
                                 [--maxRequests=5]
                                 [--historyDir=clarity-history/daily]
                                 [--keepRuns=120]

What this does:
  1) Runs clarity-fetch-metrics.js with soft fail enabled
  2) Retries when successful query count is 0
  3) Runs clarity-analyze.js into a per-day run directory
  4) Archives snapshot + raw JSON files + run manifest
  5) Updates daily index and latest pointer

Notes:
  - Clarity API supports only last 1-3 days (UTC) per request.
  - Daily quota is 10 requests per project (UTC).
  - Token must be provided via CLARITY_API_TOKEN.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    printUsage();
    return;
  }

  const cwd = process.cwd();
  const numOfDays = clamp(toInt(args.numOfDays || 1, 1), 1, 3);
  const retries = clamp(toInt(args.retries || 2, 2), 0, 10);
  const retryDelayMs = Math.max(500, toInt(args.retryDelayMs || 5000, 5000));
  const top = Math.max(1, toInt(args.top || 15, 15));
  const minSessions = Math.max(1, toInt(args.minSessions || 3, 3));
  const includeChannel = toBool(args.includeChannel, false);
  const maxRequests =
    args.maxRequests == null ? null : clamp(toInt(args.maxRequests, 5), 1, 10);
  const keepRuns = Math.max(30, toInt(args.keepRuns || 120, 120));

  const dateLabel = args.date || toUtcDateLabel();
  const runId = `run-${toFileSafeTimestamp()}`;

  const historyDir = path.resolve(cwd, args.historyDir || "clarity-history/daily");
  const dayDir = path.join(historyDir, dateLabel);
  const runDir = path.join(dayDir, runId);
  const indexPath = path.join(historyDir, "index.json");
  const latestPath = path.join(historyDir, "latest.json");

  const attemptsRoot = path.join(runDir, "attempts");

  await ensureDir(runDir);
  await ensureDir(attemptsRoot);

  const attempts = [];
  let chosenSnapshotPath = null;
  let chosenSnapshot = null;
  let chosenAttemptDir = null;
  let fetchRun = null;
  let lastSnapshotPath = null;
  let lastSnapshot = null;
  let lastAttemptDir = null;
  let haltReason = null;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    console.log(
      `\n[Daily Snapshot] Fetch attempt ${attempt}/${retries + 1} (numOfDays=${numOfDays})`
    );

    const fetchArgs = [
      `--numOfDays=${numOfDays}`,
      "--softFail=true",
      `--includeChannel=${includeChannel}`,
      `--outDir=${path.join(attemptsRoot, `attempt-${attempt}`)}`,
    ];
    if (maxRequests != null) {
      fetchArgs.push(`--maxRequests=${maxRequests}`);
    }

    fetchRun = await runNodeScript({
      cwd,
      scriptName: "clarity-fetch-metrics.js",
      scriptArgs: fetchArgs,
    });

    const attemptDir = path.join(attemptsRoot, `attempt-${attempt}`);
    const attemptLiveSnapshotPath = path.join(attemptDir, "clarity-live-insights.json");
    const attemptFailedSnapshotPath = path.join(
      attemptDir,
      "clarity-live-insights.failed.json"
    );
    const liveSnapshot = await readJsonIfExists(attemptLiveSnapshotPath);
    const failedSnapshot = await readJsonIfExists(attemptFailedSnapshotPath);

    let selectedPath = null;
    let selectedSnapshot = null;

    if (liveSnapshot) {
      selectedPath = attemptLiveSnapshotPath;
      selectedSnapshot = liveSnapshot;
    } else if (failedSnapshot) {
      selectedPath = attemptFailedSnapshotPath;
      selectedSnapshot = failedSnapshot;
    }

    const summary = summarizeSnapshot(selectedSnapshot);
    const quotaExceeded = hasQuotaExceeded(selectedSnapshot);
    attempts.push({
      attempt,
      fetch: fetchRun,
      snapshotPath: selectedPath,
      snapshotSummary: summary,
      quotaExceeded,
    });

    if (selectedPath && selectedSnapshot) {
      lastSnapshotPath = selectedPath;
      lastSnapshot = selectedSnapshot;
      lastAttemptDir = attemptDir;
    }

    if (summary.successCount > 0) {
      chosenSnapshotPath = selectedPath;
      chosenSnapshot = selectedSnapshot;
      chosenAttemptDir = attemptDir;
      break;
    }

    if (quotaExceeded) {
      haltReason = "quota_exceeded";
      console.log(
        "[Daily Snapshot] Detected HTTP 429 daily quota limit. Stop retrying for this UTC day."
      );
      break;
    }

    if (attempt <= retries) {
      const waitMs = retryDelayMs * attempt;
      console.log(
        `[Daily Snapshot] No successful query yet. Waiting ${waitMs}ms before retry...`
      );
      await sleep(waitMs);
    }
  }

  if (!chosenSnapshotPath && lastSnapshotPath && lastSnapshot) {
    chosenSnapshotPath = lastSnapshotPath;
    chosenSnapshot = lastSnapshot;
    chosenAttemptDir = lastAttemptDir;
  }

  let analyzeRun = null;
  let analysisSummary = null;
  if (chosenSnapshotPath && chosenSnapshot && summarizeSnapshot(chosenSnapshot).successCount > 0) {
    console.log(
      `\n[Daily Snapshot] Running analyze with input: ${path.basename(
        chosenSnapshotPath
      )}`
    );
    analyzeRun = await runNodeScript({
      cwd,
      scriptName: "clarity-analyze.js",
      scriptArgs: [
        `--input=${chosenSnapshotPath}`,
        `--outDir=${runDir}`,
        `--top=${top}`,
        `--minSessions=${minSessions}`,
      ],
    });
    analysisSummary = await readJsonIfExists(
      path.join(runDir, "clarity-analysis-summary.json")
    );
  }

  const copiedAttemptArtifacts = await fileExists(attemptsRoot);
  const copiedRawFiles = chosenAttemptDir
    ? await copyRawJsonFiles(
        path.join(chosenAttemptDir, "clarity-raw"),
        path.join(runDir, "clarity-raw")
      )
    : [];

  const copiedLive = chosenSnapshotPath
    ? await copyIfExists(
        chosenSnapshotPath,
        path.join(runDir, path.basename(chosenSnapshotPath))
      )
    : false;
  const copiedFailed = false;

  const finalSnapshotSummary = summarizeSnapshot(chosenSnapshot);
  const status =
    finalSnapshotSummary.successCount > 0 &&
    analyzeRun &&
    analyzeRun.exitCode === 0
      ? "ok"
      : haltReason === "quota_exceeded"
      ? "blocked_quota"
      : "degraded";

  const runManifest = {
    createdAtUtc: new Date().toISOString(),
    dateLabel,
    runId,
    status,
    config: {
      numOfDays,
      retries,
      retryDelayMs,
      top,
      minSessions,
      includeChannel,
      maxRequests,
      keepRuns,
    },
    fetchAttempts: attempts,
    haltReason,
    selectedSnapshotPath: chosenSnapshotPath,
    selectedSnapshotSummary: finalSnapshotSummary,
    analyze: analyzeRun,
    analysisSummary,
    artifacts: {
      runDir,
      copiedRawFiles,
      copiedAttemptArtifacts,
      copiedLiveSnapshot: copiedLive,
      copiedFailedSnapshot: copiedFailed,
    },
  };

  await writeJson(path.join(runDir, "run-manifest.json"), runManifest);

  const indexRun = {
    createdAtUtc: runManifest.createdAtUtc,
    dateLabel,
    runId,
    status,
    runDir,
    selectedSnapshotSummary: finalSnapshotSummary,
    analyzeExitCode: analyzeRun ? analyzeRun.exitCode : null,
  };

  await updateIndex({
    indexPath,
    newRun: indexRun,
    keepRuns,
  });
  await writeJson(latestPath, indexRun);

  console.log("\n[Daily Snapshot] Completed");
  console.log(`Run dir: ${runDir}`);
  console.log(`Status: ${status}`);
  console.log(
    `Snapshot successCount: ${finalSnapshotSummary.successCount}, failedCount: ${finalSnapshotSummary.failedCount}, skippedCount: ${finalSnapshotSummary.skippedCount}`
  );
  if (haltReason === "quota_exceeded") {
    console.log(
      "Reason: Clarity API daily quota hit (HTTP 429). Retry after next UTC day reset."
    );
  }
  console.log(`Index: ${indexPath}`);
  console.log(`Latest pointer: ${latestPath}`);

  if (status !== "ok") {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(
    `clarity-daily-snapshot.js failed: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
});
