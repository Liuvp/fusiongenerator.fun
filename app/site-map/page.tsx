import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap | Fusion Generator",
  description:
    "Complete sitemap of all pages on Fusion Generator including Dragon Ball, Pokemon, AI tools, and blog content.",
  alternates: {
    canonical: "/site-map",
  },
  robots: {
    index: false,
    follow: true,
  },
};

type SiteLink = {
  url: string;
  title: string;
  description: string;
};

const sitemapData: {
  main: SiteLink[];
  content: SiteLink[];
  info: SiteLink[];
  legal: SiteLink[];
} = {
  main: [
    { url: "/", title: "Home", description: "Generate Dragon Ball and Pokemon character fusions with AI" },
    { url: "/dragon-ball", title: "Dragon Ball Fusion Generator", description: "Create DBZ character fusions like Goku and Vegeta" },
    { url: "/pokemon", title: "Pokemon Fusion Generator", description: "Mix Pokemon species with AI fusion technology" },
    { url: "/ai", title: "Custom AI Fusion", description: "Upload your own images for custom AI fusions" },
    { url: "/gallery", title: "Fusion Gallery", description: "Browse community-created fusion characters" },
  ],
  content: [
    { url: "/blog", title: "Blog", description: "Guides, tips, and news about character fusion" },
    { url: "/blog/pokemon-infinite-fusion-guide", title: "Pokemon Infinite Fusion Guide", description: "Complete guide to Pokemon Infinite Fusion and how to use it" },
    { url: "/blog/top-dragon-ball-fusions", title: "Top Dragon Ball Fusions", description: "Best Dragon Ball character fusion combinations" },
    { url: "/blog/pokemon-fusion-technology", title: "Pokemon Fusion Technology", description: "How AI Pokemon fusion works" },
    { url: "/blog/fusion-design-tips", title: "Fusion Design Tips", description: "Expert tips for creating great character fusions" },
  ],
  info: [
    { url: "/pricing", title: "Pricing", description: "Free and premium fusion generation plans" },
    { url: "/about", title: "About Us", description: "Learn about Fusion Generator" },
    { url: "/contact", title: "Contact", description: "Get in touch with our team" },
  ],
  legal: [
    { url: "/privacy", title: "Privacy Policy", description: "How we protect your data" },
    { url: "/terms", title: "Terms of Service", description: "Terms and conditions of use" },
  ],
};

function UrlText({ url, className }: { url: string; className: string }) {
  return (
    <p className={className}>
      {url === "/" ? "https://fusiongenerator.fun/" : `https://fusiongenerator.fun${url}`}
    </p>
  );
}

function LinkCard({ page, hoverClass, urlClass }: { page: SiteLink; hoverClass: string; urlClass: string }) {
  return (
    <Link
      key={page.url}
      href={page.url}
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
    >
      <h3 className={`mb-2 text-lg font-semibold transition-colors ${hoverClass}`}>{page.title}</h3>
      <p className="line-clamp-1 text-sm text-muted-foreground">{page.description}</p>
      <UrlText url={page.url} className={`mt-2 font-mono text-xs ${urlClass}`} />
    </Link>
  );
}

function Section({
  title,
  barClass,
  items,
  hoverClass,
  urlClass,
}: {
  title: string;
  barClass: string;
  items: SiteLink[];
  hoverClass: string;
  urlClass: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className={`h-8 w-1.5 rounded-full ${barClass}`} />
        {title}
      </h2>
      <div className="grid gap-4">
        {items.map((page) => (
          <LinkCard key={page.url} page={page} hoverClass={hoverClass} urlClass={urlClass} />
        ))}
      </div>
    </section>
  );
}

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Site Map
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore all pages on Fusion Generator from Dragon Ball fusions to Pokemon fusions and more.
            </p>
          </div>

          <Section
            title="Main Pages"
            barClass="bg-gradient-to-b from-orange-500 to-purple-500"
            items={sitemapData.main}
            hoverClass="group-hover:text-purple-600"
            urlClass="text-purple-600/70"
          />

          <Section
            title="Blog and Content"
            barClass="bg-gradient-to-b from-blue-500 to-green-500"
            items={sitemapData.content}
            hoverClass="group-hover:text-blue-600"
            urlClass="text-blue-600/70"
          />

          <Section
            title="Company Info"
            barClass="bg-gradient-to-b from-green-500 to-teal-500"
            items={sitemapData.info}
            hoverClass="group-hover:text-green-600"
            urlClass="text-green-600/70"
          />

          <Section
            title="Legal"
            barClass="bg-gradient-to-b from-gray-500 to-gray-700"
            items={sitemapData.legal}
            hoverClass="group-hover:text-gray-700 dark:group-hover:text-gray-300"
            urlClass="text-gray-600/70 dark:text-gray-400/70"
          />

          <div className="mt-12 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 dark:border-purple-800 dark:from-purple-950/30 dark:to-blue-950/30">
            <h3 className="mb-3 text-lg font-semibold">For Search Engines</h3>
            <p className="mb-4 text-sm text-muted-foreground">Machine-readable sitemap and crawling rules:</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 font-mono text-sm transition-colors hover:border-purple-500 dark:bg-gray-900"
              >
                sitemap.xml
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 font-mono text-sm transition-colors hover:border-purple-500 dark:bg-gray-900"
              >
                robots.txt
              </a>
            </div>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://fusiongenerator.fun",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Sitemap",
                    item: "https://fusiongenerator.fun/site-map",
                  },
                ],
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
