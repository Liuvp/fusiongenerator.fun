import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Fusion Gallery - Browse Dragon Ball & Pokemon Fusions | FusionGenerator",
  description:
    "Explore thousands of Dragon Ball and Pokemon character fusions created by our community. Get inspired by Goku Vegeta fusions, Pikachu Charizard mashups, and more.",
  keywords:
    "fusion gallery, pokemon fusion gallery, dragon ball fusion examples, character fusion showcase, AI fusion art, anime fusion collection",
  alternates: {
    canonical: "/gallery",
    languages: {
      "en-US": "/gallery",
      en: "/gallery",
      "ja-JP": "/ja/gallery",
      ja: "/ja/gallery",
      "x-default": "/gallery",
    },
  },
  openGraph: {
    title: "Fusion Gallery - Dragon Ball & Pokemon Fusions",
    description:
      "Browse thousands of amazing character fusions. Get inspired and create your own Dragon Ball and Pokemon mashups.",
    url: "https://fusiongenerator.fun/gallery",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    images: [
      {
        url: "/images/fusion-generator-logo.svg",
        width: 1200,
        height: 630,
        alt: "Fusion Generator Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Gallery",
    description: "Browse amazing Dragon Ball & Pokemon fusions",
  },
}

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
