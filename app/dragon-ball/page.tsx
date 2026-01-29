import Script from "next/script";
import { Metadata } from "next";
import dynamicImport from "next/dynamic"; // Renamed to avoid usage conflict with export const dynamic

// 获取基础URL（用于JSON-LD）
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return "https://fusiongenerator.fun";
};

const baseUrl = getBaseUrl();

// 静态导入关键SEO组件（保证首屏内容）
import { DBHero } from "@/components/dragon-ball/hero";
import { DBHowToUse } from "@/components/dragon-ball/how-to-use";
import { DBFeatures } from "@/components/dragon-ball/features";

// 动态导入非关键组件（减少初始包大小）
const DBFusionStudio = dynamicImport(
  () => import("@/components/dragon-ball/fusion-studio").then(mod => mod.DBFusionStudio),
  {
    loading: () => <FusionStudioSkeleton />
  }
);

const DBPopularFusions = dynamicImport(
  () => import("@/components/dragon-ball/popular-fusions").then(mod => mod.DBPopularFusions),
  {
    loading: () => <PopularFusionsSkeleton />
  }
);

const DBFAQ = dynamicImport(
  () => import("@/components/dragon-ball/faq").then(mod => mod.DBFAQ),
  {
    loading: () => <FAQSkeleton />
  }
);

const DBCTA = dynamicImport(
  () => import("@/components/dragon-ball/cta").then(mod => mod.DBCTA),
  {
    loading: () => <CTASkeleton />
  }
);

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// ✅ 修复：添加 Metadata 类型注解
export const metadata: Metadata = {
  title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
  description:
    "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
  robots: "index, follow",
  alternates: {
    canonical: "/dragon-ball",
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description:
      "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    url: "/dragon-ball",
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
  // ✅ 修复：JSON-LD 使用动态 baseUrl
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dragon Ball Fusion Generator",
    "description": "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. High-quality character designs for fans.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "url": `${baseUrl}/dragon-ball`, // ✅ 动态URL
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
        "item": `${baseUrl}/` // ✅ 动态URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dragon Ball Fusion Generator",
        "item": `${baseUrl}/dragon-ball` // ✅ 动态URL
      }
    ]
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dragon Ball Fusion Generator",
    "description": "AI-powered Dragon Ball character fusion generator",
    "url": `${baseUrl}/dragon-ball`, // ✅ 动态URL
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "screenshot": `${baseUrl}/images/dragon-ball-fusion-preview-goku-vegeta.webp`, // ✅ 动态URL
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
