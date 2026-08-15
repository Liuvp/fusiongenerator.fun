import { MetadataRoute } from "next";
import { getAllPosts } from "@/app/blog/data/posts";
import { getSiteUrl } from "@/lib/site-url";
import { getLastModifiedDate } from "@/lib/sitemap-helper";

// Intentionally NO revalidate/ISR here: runtime regeneration on Vercel lambdas
// has no git binary and no source files, so lastmod would silently fall back to
// today's date for every URL, and crawlers hitting a cold regen can time out.
// Fully static = regenerated on each deploy with real git dates, served from CDN.

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type StaticRoute = {
  url: string;
  // Page file + the component/data paths it renders. lastmod = newest across all,
  // so content edits (not just page-file edits) refresh the date.
  files: string[];
  changeFrequency: ChangeFrequency;
  priority: number;
};

const staticRoutes: StaticRoute[] = [
  { url: "", files: ["app/page.tsx", "components/home"], changeFrequency: "weekly", priority: 1.0 },
  { url: "/dragon-ball", files: ["app/dragon-ball", "components/dragon-ball", "lib/dragon-ball-data.ts"], changeFrequency: "daily", priority: 0.9 },
  { url: "/pokemon", files: ["app/pokemon", "components/pokemon", "lib/pokemon-data.ts"], changeFrequency: "daily", priority: 0.9 },
  { url: "/ai", files: ["app/ai"], changeFrequency: "weekly", priority: 0.8 },
  { url: "/gallery", files: ["app/gallery"], changeFrequency: "weekly", priority: 0.8 },
  { url: "/blog", files: ["app/blog/page.tsx", "app/blog/data/posts.ts"], changeFrequency: "weekly", priority: 0.8 },
  { url: "/blog/top-dragon-ball-fusions", files: ["app/blog/top-dragon-ball-fusions"], changeFrequency: "monthly", priority: 0.6 },
  { url: "/pricing", files: ["app/pricing"], changeFrequency: "monthly", priority: 0.7 },
  { url: "/about", files: ["app/about"], changeFrequency: "monthly", priority: 0.7 },
  { url: "/contact", files: ["app/contact"], changeFrequency: "monthly", priority: 0.7 },
  { url: "/site-map", files: ["app/site-map"], changeFrequency: "monthly", priority: 0.3 },
  { url: "/privacy", files: ["app/privacy"], changeFrequency: "yearly", priority: 0.3 },
  { url: "/terms", files: ["app/terms"], changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  try {
    const staticEntries = await Promise.all(
      staticRoutes.map(async (route) => ({
        url: `${baseUrl}${route.url}`,
        lastModified: await getLastModifiedDate(route.files),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }))
    );

    const blogEntries = getAllPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const entry of [...staticEntries, ...blogEntries]) {
      deduped.set(entry.url, entry);
    }

    return Array.from(deduped.values());
  } catch (error) {
    console.error("Error generating sitemap:", error);

    const fallbackDate = new Date().toISOString().split("T")[0];
    const staticEntries = staticRoutes.map((route) => ({
      url: `${baseUrl}${route.url}`,
      lastModified: fallbackDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

    const blogEntries = getAllPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    return [...staticEntries, ...blogEntries];
  }
}
