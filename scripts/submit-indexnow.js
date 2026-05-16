/**
 * IndexNow auto-submission — runs on every Vercel build via postbuild hook
 *
 * Submits all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 * No env vars needed — key is from public/<key>.txt.
 */

const SITE = "https://fusiongenerator.fun";
const INDEXNOW_KEY = "0c32f305-17b0-4d16-8f50-0fa6d90a0528";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

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

async function submitIndexNow() {
  try {
    const body = JSON.stringify({
      host: "fusiongenerator.fun",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: ALL_URLS,
    });

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });

    if (res.ok) {
      console.log(`[IndexNow] ✅ Submitted ${ALL_URLS.length} URLs — ${res.status}`);
    } else {
      console.log(`[IndexNow] ⚠️ ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    // Don't fail the build if IndexNow is down
    console.log(`[IndexNow] ⚠️ Skipped:`, err.message);
  }
}

submitIndexNow();
