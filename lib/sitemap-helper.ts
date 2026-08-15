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

// Accepts one or more paths (files or directories). Returns the NEWEST valid
// date across all of them, so a route's lastmod reflects edits to the page
// file AND the components/data it renders — not just the page file itself.
export async function getLastModifiedDate(filePath: string | string[]): Promise<string> {
  const files = Array.isArray(filePath) ? filePath : [filePath];
  const dates: string[] = [];

  for (const file of files) {
    const fullPath = path.join(process.cwd(), file);
    const cached = lastModifiedCache.get(fullPath);
    if (cached) {
      dates.push(cached);
      continue;
    }

    const fromGit = getGitLastModified(fullPath);
    if (fromGit) {
      lastModifiedCache.set(fullPath, fromGit);
      dates.push(fromGit);
      continue;
    }

    const fromFileSystem = await getFileSystemLastModified(fullPath);
    if (fromFileSystem) {
      lastModifiedCache.set(fullPath, fromFileSystem);
      dates.push(fromFileSystem);
      continue;
    }
    // Path missing/unreadable — skip; other paths may still yield a date
  }

  if (dates.length > 0) {
    // ISO yyyy-mm-dd strings sort lexicographically, so the last is the newest
    return dates.sort()[dates.length - 1];
  }

  return new Date().toISOString().split("T")[0];
}
