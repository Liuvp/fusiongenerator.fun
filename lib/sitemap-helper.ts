import { execFileSync } from "child_process";
import { stat } from "fs/promises";
import path from "path";

const MIN_VALID_YEAR = 2020;
const lastModifiedCache = new Map<string, string>();

function toIsoDate(date: Date): string | null {
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (date.getUTCFullYear() < MIN_VALID_YEAR) {
    return null;
  }

  return date.toISOString().split("T")[0];
}

function getGitLastModified(fullPath: string): string | null {
  try {
    const timestamp = execFileSync(
      "git",
      ["log", "-1", "--format=%ct", "--", fullPath],
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    ).trim();

    const seconds = Number.parseInt(timestamp, 10);
    if (!Number.isFinite(seconds)) {
      return null;
    }

    return toIsoDate(new Date(seconds * 1000));
  } catch {
    return null;
  }
}

async function getFileSystemLastModified(fullPath: string): Promise<string | null> {
  try {
    const fileStat = await stat(fullPath);
    return toIsoDate(fileStat.mtime);
  } catch {
    return null;
  }
}

export async function getLastModifiedDate(filePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), filePath);
  const cached = lastModifiedCache.get(fullPath);
  if (cached) {
    return cached;
  }

  const fromGit = getGitLastModified(fullPath);
  if (fromGit) {
    lastModifiedCache.set(fullPath, fromGit);
    return fromGit;
  }

  const fromFileSystem = await getFileSystemLastModified(fullPath);
  if (fromFileSystem) {
    lastModifiedCache.set(fullPath, fromFileSystem);
    return fromFileSystem;
  }

  const fallbackDate = new Date().toISOString().split("T")[0];
  lastModifiedCache.set(fullPath, fallbackDate);
  return fallbackDate;
}
