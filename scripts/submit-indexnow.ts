#!/usr/bin/env tsx
/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver, etc.)
 *
 * Usage:
 *   npx tsx scripts/submit-indexnow.ts              # submit all sitemap URLs
 *   npx tsx scripts/submit-indexnow.ts /dragon-ball  # submit specific URL(s)
 *
 * Requires no env vars — key is hardcoded from public/<key>.txt
 */

const SITE = "https://fusiongenerator.fun";
const INDEXNOW_KEY = "0c32f305-17b0-4d16-8f50-0fa6d90a0528";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

// All sitemap URLs
const ALL_URLS = [
  `${SITE}`,
  `${SITE}/dragon-ball`,
  `${SITE}/pokemon`,
  `${SITE}/ai`,
  `${SITE}/gallery`,
  `${SITE}/blog`,
  `${SITE}/blog/top-dragon-ball-fusions`,
  `${SITE}/pricing`,
  `${SITE}/about`,
  `${SITE}/contact`,
  `${SITE}/privacy`,
  `${SITE}/terms`,
];

async function submitIndexNow(urls: string[]) {
  const body = {
    host: "fusiongenerator.fun",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
  console.log("URLs:", urls.join("\n  "));

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`\nResponse: ${res.status} ${res.statusText}`);

  if (res.ok) {
    console.log("✅ IndexNow submission successful!");
  } else {
    const text = await res.text();
    console.log("❌ Submission failed:", text);
  }
}

// Parse CLI args — if URLs are passed, submit those; otherwise submit all
const args = process.argv.slice(2);
const urls =
  args.length > 0
    ? args.map((a) => (a.startsWith("http") ? a : `${SITE}${a.startsWith("/") ? "" : "/"}${a}`))
    : ALL_URLS;

submitIndexNow(urls);
