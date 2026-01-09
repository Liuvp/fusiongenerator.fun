import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  alternates: {
    canonical: "/en/pokemon",
    languages: {
      "en-US": "/en/pokemon",
      en: "/en/pokemon",
      "ja-JP": "/ja/pokemon",
      ja: "/ja/pokemon",
      "x-default": "/en/pokemon",
    },
  },
  openGraph: {
    url: "/en/pokemon",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
  },
}

export default function PokemonLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
