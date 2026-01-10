import type { MetadataRoute } from "next"

const BASE = process.env.BASE_URL ? `https://${process.env.BASE_URL}` : "https://fusiongenerator.fun"

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
  const now = new Date().toISOString().split("T")[0]
  const entries: MetadataRoute.Sitemap = []

  for (const p of paths) {
    const url = `${BASE}${p}`
    entries.push({
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "/" ? 1 : 0.7,
    })
  }

  return entries
}
