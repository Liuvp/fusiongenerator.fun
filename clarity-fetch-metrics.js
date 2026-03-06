#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const API_ENDPOINT =
  "https://www.clarity.ms/export-data/api/v1/project-live-insights";

const BASE_QUERY_PLAN = [
  { id: "by_url", dimensions: ["URL"] },
  { id: "by_url_device", dimensions: ["URL", "Device"] },
  { id: "by_url_os", dimensions: ["URL", "OS"] },
  { id: "by_url_browser", dimensions: ["URL", "Browser"] },
  { id: "by_url_source", dimensions: ["URL", "Source"] },
];

const OPTIONAL_QUERY_PLAN = [
  { id: "by_url_channel", dimensions: ["URL", "Channel"] },
];

class HttpError extends Error {
  constructor(statusCode, reason) {
    super(`HTTP ${statusCode}: ${reason}`);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.reason = reason;
  }
}

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

function cleanToken(value) {
  if (value == null) return null;
  const token = String(value).trim();
  return token || null;
}

function resolveToken(args) {
  const allowInsecureTokenArg = toBool(
    process.env.CLARITY_ALLOW_INSECURE_TOKEN_ARG,
    false
  );
  const argToken = cleanToken(args.token);
  if (argToken && !allowInsecureTokenArg) {
    throw new Error(
      "Passing token via --token is disabled for security. Set CLARITY_API_TOKEN in .env.local/.env or shell env."
    );
  }
  const envToken =
    cleanToken(process.env.CLARITY_API_TOKEN) || cleanToken(process.env.CLARITY_TOKEN);
  return argToken || envToken;
}

function parseDotEnvFile(content) {
  const parsed = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

async function loadDotEnvFiles(cwd) {
  const candidates = [".env.local", ".env"];
  for (const fileName of candidates) {
    const fullPath = path.join(cwd, fileName);
    try {
      const content = await fs.readFile(fullPath, "utf8");
      const env = parseDotEnvFile(content);
      for (const [key, value] of Object.entries(env)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch (error) {
      if (error && error.code !== "ENOENT") {
        throw error;
      }
    }
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
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

function buildUrl(dimensions, numOfDays) {
  const params = new URLSearchParams({
    numOfDays: String(numOfDays),
  });
  dimensions.forEach((dimension, index) => {
    params.set(`dimension${index + 1}`, dimension);
  });
  return `${API_ENDPOINT}?${params.toString()}`;
}

async function fetchQuery({ token, numOfDays, query }) {
  const url = buildUrl(query.dimensions, numOfDays);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    const reason =
      typeof json === "object" && json !== null
        ? JSON.stringify(json)
        : String(text);
    throw new HttpError(response.status, reason);
  }

  return {
    requestUrl: url,
    statusCode: response.status,
    response: json,
  };
}

function buildQueryPlan({ includeChannel, maxRequests }) {
  let plan = [...BASE_QUERY_PLAN];
  if (includeChannel) {
    plan = plan.concat(OPTIONAL_QUERY_PLAN);
  }
  if (maxRequests < plan.length) {
    return plan.slice(0, maxRequests);
  }
  return plan;
}

function toFileSafeTimestamp(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function printUsage() {
  console.log(`
Usage:
  node clarity-fetch-metrics.js [--numOfDays=1] [--outDir=.]
                               [--includeChannel=false] [--maxRequests=5]
                               [--strict=false] [--softFail=false]

Required env:
  CLARITY_API_TOKEN=your_token  # Preferred name
  CLARITY_TOKEN=your_token      # Supported alias

Optional env:
  CLARITY_NUM_OF_DAYS=1|2|3
  CLARITY_INCLUDE_CHANNEL=true|false
  CLARITY_MAX_REQUESTS=1..10
  CLARITY_STRICT=true|false
  CLARITY_SOFT_FAIL=true|false
  CLARITY_ALLOW_INSECURE_TOKEN_ARG=true  # Not recommended

Notes:
  - Clarity Data Export API supports only last 1-3 days (UTC).
  - Daily quota is 10 requests per project.
  - Default plan uses 5 requests; Channel is optional.
  - If a request hits HTTP 429, remaining queries are skipped.
  - If this run gets 0 successful queries, the last successful snapshot is preserved.
  `);
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("Global fetch is unavailable. Use Node.js 18+.");
  }

  const cwd = process.cwd();
  await loadDotEnvFiles(cwd);

  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    printUsage();
    return;
  }

  const token = resolveToken(args);
  if (!token) {
    throw new Error(
      "Missing CLARITY_API_TOKEN / CLARITY_TOKEN. Put one of them in .env.local (recommended) or set shell env."
    );
  }

  const outDir = path.resolve(cwd, args.outDir || ".");
  const numOfDays = clamp(
    toInt(args.numOfDays || process.env.CLARITY_NUM_OF_DAYS || 1, 1),
    1,
    3
  );
  const includeChannel = toBool(
    args.includeChannel ?? process.env.CLARITY_INCLUDE_CHANNEL,
    false
  );
  const defaultMaxRequests = includeChannel
    ? BASE_QUERY_PLAN.length + OPTIONAL_QUERY_PLAN.length
    : BASE_QUERY_PLAN.length;
  const maxRequests = clamp(
    toInt(args.maxRequests || process.env.CLARITY_MAX_REQUESTS || defaultMaxRequests, defaultMaxRequests),
    1,
    10
  );
  const strict = toBool(args.strict ?? process.env.CLARITY_STRICT, false);
  const softFail = toBool(args.softFail ?? process.env.CLARITY_SOFT_FAIL, false);

  const queryPlan = buildQueryPlan({ includeChannel, maxRequests });
  const rawDir = path.join(outDir, "clarity-raw");
  const historyDir = path.join(outDir, "clarity-history");
  const snapshotPath = path.join(outDir, "clarity-live-insights.json");
  const failedSnapshotPath = path.join(outDir, "clarity-live-insights.failed.json");

  await ensureDir(outDir);
  await ensureDir(rawDir);
  await ensureDir(historyDir);

  const startedAt = new Date();
  const queries = [];
  let quotaExceeded = false;

  for (let i = 0; i < queryPlan.length; i += 1) {
    const query = queryPlan[i];
    if (quotaExceeded) {
      queries.push({
        id: query.id,
        dimensions: query.dimensions,
        status: "skipped",
        error:
          "Skipped after earlier HTTP 429 (daily limit reached for this project).",
      });
      console.log(
        `[${i + 1}/${queryPlan.length}] Fetching ${query.id} ... skipped (quota exceeded)`
      );
      continue;
    }

    process.stdout.write(
      `[${i + 1}/${queryPlan.length}] Fetching ${query.id} ... `
    );
    try {
      const result = await fetchQuery({ token, numOfDays, query });
      queries.push({
        id: query.id,
        dimensions: query.dimensions,
        status: "ok",
        requestUrl: result.requestUrl,
        statusCode: result.statusCode,
        data: result.response,
      });

      const rawPath = path.join(rawDir, `${query.id}.json`);
      await writeJson(rawPath, result.response);
      console.log("ok");
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : null;
      const message = error instanceof Error ? error.message : String(error);
      queries.push({
        id: query.id,
        dimensions: query.dimensions,
        status: "error",
        statusCode,
        error: message,
      });
      if (statusCode === 429) {
        quotaExceeded = true;
        console.log("failed (429 daily limit)");
      } else {
        console.log("failed");
      }
    }
  }

  const successCount = queries.filter((item) => item.status === "ok").length;
  const failedCount = queries.filter((item) => item.status === "error").length;
  const skippedCount = queries.filter((item) => item.status === "skipped").length;

  const snapshot = {
    meta: {
      endpoint: API_ENDPOINT,
      fetchedAtUtc: startedAt.toISOString(),
      numOfDays,
      includeChannel,
      strict,
      softFail,
      quotaReminder:
        "Clarity API quota is 10 requests per project per day (UTC).",
      plannedRequests: queryPlan.length,
      successCount,
      failedCount,
      skippedCount,
    },
    queries,
  };

  const historyPath = path.join(
    historyDir,
    `clarity-live-insights-${toFileSafeTimestamp(startedAt)}.json`
  );
  await writeJson(historyPath, snapshot);

  let wroteMainSnapshot = false;
  if (successCount > 0) {
    await writeJson(snapshotPath, snapshot);
    wroteMainSnapshot = true;
  } else {
    const hasExistingMainSnapshot = await fileExists(snapshotPath);
    if (hasExistingMainSnapshot) {
      await writeJson(failedSnapshotPath, snapshot);
    } else {
      await writeJson(snapshotPath, snapshot);
      wroteMainSnapshot = true;
    }
  }

  console.log("");
  if (wroteMainSnapshot) {
    console.log(`Snapshot written: ${snapshotPath}`);
  } else {
    console.log(`No successful query in this run. Kept existing snapshot: ${snapshotPath}`);
    console.log(`Failure snapshot written: ${failedSnapshotPath}`);
  }
  console.log(`Run history snapshot: ${historyPath}`);
  console.log(`Raw responses: ${rawDir}`);
  if (failedCount > 0 || skippedCount > 0) {
    console.log(
      "Some requests failed. Check clarity-live-insights.json for details."
    );
  }

  if (softFail) {
    return;
  }

  if (strict) {
    if (failedCount > 0 || skippedCount > 0) {
      process.exitCode = 2;
    }
    return;
  }

  if (successCount === 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(
    `clarity-fetch-metrics.js failed: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
});
