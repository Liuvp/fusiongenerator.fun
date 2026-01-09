import type { MetadataRoute } from "next"

const BASE = process.env.BASE_URL ? `https://${process.env.BASE_URL}` : "http://localhost:3000"
const locales = ["en", "ja"] as const

const paths = [
  "/",
  "/dragon-ball",
  "/pokemon",
  "/ai",
  "/gallery",
  "/blog",
  "/blog/top-dragon-ball-fusions",
  "/blog/pokemon-fusion-technology",
  "/blog/fusion-design-tips",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const p of paths) {
    const url = `${BASE}${p}`
    const alternates = Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${p}`]))
    entries.push({
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages: alternates },
    })
    // also add localized root entries
    for (const l of locales) {
      entries.push({
        url: `${BASE}/${l}${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  }

  return entries
}
