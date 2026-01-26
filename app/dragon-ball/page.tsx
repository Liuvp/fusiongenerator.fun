import Script from "next/script";
import { Metadata } from "next";
import { DBHero } from "@/components/dragon-ball/hero";

// Text-heavy components - Static import for SEO and LCP
import { DBHowToUse } from "@/components/dragon-ball/how-to-use";
import { DBPopularFusions } from "@/components/dragon-ball/popular-fusions";
import { DBFeatures } from "@/components/dragon-ball/features";
import { DBFAQ } from "@/components/dragon-ball/faq";
import { DBCTA } from "@/components/dragon-ball/cta";
import { DBFusionStudio } from "@/components/dragon-ball/fusion-studio";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
  description:
    "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
  alternates: {
    canonical: "/dragon-ball",
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description:
      "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    url: "https://fusiongenerator.fun/dragon-ball",
    type: "website",
    images: [
      {
        url: "/images/dragon-ball-fusion-preview-goku-vegeta.webp",
        width: 1200,
        height: 630,
        alt: "Dragon Ball Fusion Generator preview – Goku and Vegeta fusion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    images: ["/images/dragon-ball-fusion-preview-goku-vegeta.webp"],
  },
};

export default function DragonBallPage() {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dragon Ball Fusion Generator",
    "description": "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. High-quality character designs for fans.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "url": "https://fusiongenerator.fun/dragon-ball",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/DownloadAction",
      "userInteractionCount": 1280
    },
    "featureList": [
      "AI Character Fusion",
      "Anime-style artwork generation",
      "No registration required",
      "Free daily fusions"
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fusiongenerator.fun/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dragon Ball Fusion Generator",
        "item": "https://fusiongenerator.fun/dragon-ball"
      }
    ]
  };

  return (
    <>
      <Script
        id="dragon-ball-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd])
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-10 md:py-12">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            <DBHero />
            <DBFusionStudio />
            <DBHowToUse />
            <DBPopularFusions />
            <DBFeatures />
            <DBFAQ />
            <DBCTA />
          </div>
        </div>
      </div>
    </>
  );
}
