#!/usr/bin/env tsx
/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver, etc.)
 *
 * Dynamically reads sitemap.xml — no need to maintain a URL list.
 *
 * Usage:
 *   npx tsx scripts/submit-indexnow.ts              # submit all sitemap URLs
 *   npx tsx scripts/submit-indexnow.ts /dragon-ball  # submit specific URL(s)
 */

const SITE = "https://fusiongenerator.fun";
const INDEXNOW_KEY = "0c32f305-17b0-4d16-8f50-0fa6d90a0528";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

async function getSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();

  const urls: string[] = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submitIndexNow(urls: string[]) {
  const body = {
    host: "fusiongenerator.fun",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`Response: ${res.status} ${res.statusText}`);
  if (res.ok) {
    console.log("✅ IndexNow submission successful!");
  } else {
    console.log("❌ Submission failed:", await res.text());
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const urls = args.map((a) =>
    a.startsWith("http") ? a : `${SITE}${a.startsWith("/") ? "" : "/"}${a}`
  );
  submitIndexNow(urls);
} else {
  getSitemapUrls().then(submitIndexNow);
}
