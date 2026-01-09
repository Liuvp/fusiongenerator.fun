import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  alternates: {
    canonical: "/en/dragon-ball",
    languages: {
      "en-US": "/en/dragon-ball",
      en: "/en/dragon-ball",
      "ja-JP": "/ja/dragon-ball",
      ja: "/ja/dragon-ball",
      "x-default": "/en/dragon-ball",
    },
  },
  openGraph: {
    url: "/en/dragon-ball",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
  },
}

export default function DragonBallLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
