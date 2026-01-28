import Script from "next/script";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// 静态导入关键SEO组件（保证首屏内容）
import { DBHero } from "@/components/dragon-ball/hero";
import { DBHowToUse } from "@/components/dragon-ball/how-to-use";
import { DBFeatures } from "@/components/dragon-ball/features";

// 动态导入非关键组件（减少初始包大小）
const DBFusionStudio = dynamic(
  () => import("@/components/dragon-ball/fusion-studio").then(mod => mod.DBFusionStudio),
  {
    loading: () => <FusionStudioSkeleton />
  }
);

const DBPopularFusions = dynamic(
  () => import("@/components/dragon-ball/popular-fusions").then(mod => mod.DBPopularFusions),
  {
    loading: () => <PopularFusionsSkeleton />
  }
);

const DBFAQ = dynamic(
  () => import("@/components/dragon-ball/faq").then(mod => mod.DBFAQ),
  {
    loading: () => <FAQSkeleton />
  }
);

const DBCTA = dynamic(
  () => import("@/components/dragon-ball/cta").then(mod => mod.DBCTA),
  {
    loading: () => <CTASkeleton />
  }
);

// Force static generation to ensure meta tags are in <head>
export const dynamicParams = true; // Use default behavior but ensure SSG where possible
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
  description:
    "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
  keywords: "Dragon Ball, DBZ, fusion, Goku, Vegeta, AI generator, anime, fusion generator, Dragon Ball Z",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  alternates: {
    canonical: "/dragon-ball",
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description:
      "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    url: "https://fusiongenerator.fun/dragon-ball",
    type: "website",
    siteName: "Fusion Generator",
    images: [
      {
        url: "/images/dragon-ball-fusion-preview-goku-vegeta.webp",
        width: 1200,
        height: 630,
        alt: "Dragon Ball Fusion Generator preview – Goku and Vegeta fusion",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fusiongenerator",
    creator: "@fusiongenerator",
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    images: ["/images/dragon-ball-fusion-preview-goku-vegeta.webp"],
  },
};

// 骨架屏组件
function FusionStudioSkeleton() {
  return (
    <div className="bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl min-h-[600px] animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

function PopularFusionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}

function CTASkeleton() {
  return (
    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
  );
}

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

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dragon Ball Fusion Generator",
    "description": "AI-powered Dragon Ball character fusion generator",
    "url": "https://fusiongenerator.fun/dragon-ball",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "screenshot": "https://fusiongenerator.fun/images/dragon-ball-fusion-preview-goku-vegeta.webp",
    "inLanguage": "en"
  };

  return (
    <>


      {/* JSON-LD 结构化数据 */}
      <Script
        id="dragon-ball-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd, webAppJsonLd])
        }}
      />

      {/* 预加载关键图片 - 等有了WebP文件后再取消注释，目前先用png避免404 */}
      {/* 
      <link 
        rel="preload" 
        as="image" 
        href="/images/dragon-ball-fusion-preview-goku-vegeta.webp"
        type="image/webp"
        fetchPriority="high"
      /> 
      */}

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
