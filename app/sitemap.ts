import { MetadataRoute } from "next";
import { getAllPosts } from "@/app/blog/data/posts";
import { getSiteUrl } from "@/lib/site-url";
import { getLastModifiedDate } from "@/lib/sitemap-helper";

export const revalidate = 86400;

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
  file: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

const staticRoutes: StaticRoute[] = [
  { url: "", file: "app/page.tsx", changeFrequency: "weekly", priority: 1.0 },
  { url: "/dragon-ball", file: "app/dragon-ball/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { url: "/pokemon", file: "app/pokemon/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { url: "/ai", file: "app/ai/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { url: "/gallery", file: "app/gallery/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { url: "/blog", file: "app/blog/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { url: "/blog/top-dragon-ball-fusions", file: "app/blog/top-dragon-ball-fusions/page.tsx", changeFrequency: "monthly", priority: 0.6 },
  { url: "/pricing", file: "app/pricing/page.tsx", changeFrequency: "monthly", priority: 0.7 },
  { url: "/about", file: "app/about/page.tsx", changeFrequency: "monthly", priority: 0.7 },
  { url: "/contact", file: "app/contact/page.tsx", changeFrequency: "monthly", priority: 0.7 },
  { url: "/site-map", file: "app/site-map/page.tsx", changeFrequency: "monthly", priority: 0.5 },
  { url: "/privacy", file: "app/privacy/page.tsx", changeFrequency: "yearly", priority: 0.3 },
  { url: "/terms", file: "app/terms/page.tsx", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  try {
    const staticEntries = await Promise.all(
      staticRoutes.map(async (route) => ({
        url: `${baseUrl}${route.url}`,
        lastModified: await getLastModifiedDate(route.file),
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
