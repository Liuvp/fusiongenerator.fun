import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "AI Fusion Generator - Free Online Image Fusion Tool",
  description:
    "Free AI Fusion Generator - Combine any two images with advanced AI technology. Create unique character fusions, merge photos, and generate creative artwork instantly.",
  alternates: {
    canonical: "/ai",
    languages: {
      "en-US": "/ai",
      en: "/ai",
      "ja-JP": "/ja/ai",
      ja: "/ja/ai",
      "zh-CN": "/zh/ai",
      zh: "/zh/ai",
      "x-default": "/ai",
    },
  },
  openGraph: {
    title: "AI Fusion Generator - Free Online Image Fusion Tool",
    description:
      "Free AI Fusion Generator - Combine any two images with advanced AI technology.",
    url: "https://fusiongenerator.fun/ai",
    locale: "en_US",
    alternateLocale: ["ja_JP", "zh_CN"],
    images: [
      {
        url: "/images/ai-fusion-guide.jpg",
        width: 1200,
        height: 630,
        alt: "AI Fusion Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fusion Generator",
    description: "Combine images with AI",
    images: ["/images/ai-fusion-guide.jpg"],
  },
}


export default function AILayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
