/**
 * IndexNow auto-submission — runs on every Vercel build via postbuild hook
 *
 * Dynamically reads sitemap.xml and submits all URLs.
 * No env vars needed — key is from public/<key>.txt.
 */

const SITE = "https://fusiongenerator.fun";
const INDEXNOW_KEY = "0c32f305-17b0-4d16-8f50-0fa6d90a0528";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

async function getSitemapUrls() {
  try {
    const res = await fetch(`${SITE}/sitemap.xml`);
    if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
    const xml = await res.text();

    // Extract <loc> values from sitemap XML
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  } catch (err) {
    console.log(`[IndexNow] ⚠️ Failed to read sitemap:`, err.message);
    return [];
  }
}

async function submitIndexNow() {
  try {
    const urls = await getSitemapUrls();
    if (urls.length === 0) {
      console.log("[IndexNow] ⚠️ No URLs found, skipping.");
      return;
    }

    const body = JSON.stringify({
      host: "fusiongenerator.fun",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    });

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });

    if (res.ok) {
      console.log(`[IndexNow] ✅ Submitted ${urls.length} URLs — ${res.status}`);
    } else {
      console.log(`[IndexNow] ⚠️ ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.log(`[IndexNow] ⚠️ Skipped:`, err.message);
  }
}

submitIndexNow();
