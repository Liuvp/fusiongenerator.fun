import Script from "next/script";
import { Metadata } from "next";
import nextDynamic from "next/dynamic";

// ===============================
// 基础常量
// ===============================
const baseUrl = "https://fusiongenerator.fun";
const pageUrl = `${baseUrl}/dragon-ball`;

// ===============================
// 静态导入：首屏 & SEO 关键内容
// ===============================
import { DBHero } from "@/components/dragon-ball/hero";
import { DBHowToUse } from "@/components/dragon-ball/how-to-use";
import { DBFeatures } from "@/components/dragon-ball/features";
import { DBPopularFusions } from "@/components/dragon-ball/popular-fusions";
import { DBFAQ } from "@/components/dragon-ball/faq";
import { DBCTA } from "@/components/dragon-ball/cta";

// ===============================
// 动态导入：非关键交互组件
// ===============================
const DBFusionStudio = nextDynamic(
  () => import("@/components/dragon-ball/fusion-studio").then(mod => mod.DBFusionStudio),
  {
    loading: () => <FusionStudioSkeleton />
  }
);

// ===============================
// SSG 配置
// ===============================
export const dynamic = "force-static";
export const revalidate = 3600;

// ===============================
// Metadata（包含预加载）
// ===============================
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
  description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    url: pageUrl,
    type: "website",
    siteName: "Fusion Generator",
    images: [
      {
        url: `${baseUrl}/images/dragon-ball-fusion-preview-goku-vegeta.webp`,
        width: 1200,
        height: 630,
        alt: "Dragon Ball Fusion Generator preview",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    images: [`${baseUrl}/images/dragon-ball-fusion-preview-goku-vegeta.webp`],
  },
  // ✅ 通过Next.js标准API预加载关键资源
  other: {
    "preload-image-hero": "/images/dragon-ball-fusion-preview-goku-vegeta.webp",
    "preload-image-goku": "/images/dragon-ball/characters/goku.webp",
    "preload-image-vegeta": "/images/dragon-ball/characters/vegeta.webp",
  },
};

// ===============================
// 骨架屏组件
// ===============================
function FusionStudioSkeleton() {
  return (
    <div className="bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl min-h-[600px] animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-16 bg-gray-200 rounded-xl mb-4" />
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

function PopularFusionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}

function CTASkeleton() {
  return (
    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
  );
}

// ===============================
// 页面主体
// ===============================
export default function DragonBallPage() {
  // 1. WebApplication Schema
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dragon Ball Fusion Generator",
    description: "AI-powered Dragon Ball character fusion generator for fans.",
    url: pageUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript.",
    inLanguage: "en",
    screenshot: `${baseUrl}/images/dragon-ball-fusion-preview-goku-vegeta.webp`,
  };

  // 2. Breadcrumb Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dragon Ball Fusion Generator",
        item: pageUrl,
      },
    ],
  };


  return (
    <>
      {/* ✅ JSON-LD: 使用 beforeInteractive 策略（SEO最佳） */}
      <Script
        id="dragon-ball-webapp-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <Script
        id="dragon-ball-breadcrumb-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />



      {/* ✅ 主内容区域 */}
      <main id="main-content" className="min-h-screen bg-background">
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
      </main>
    </>
  );
}
