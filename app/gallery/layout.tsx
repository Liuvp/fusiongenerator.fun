import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Dragon Ball & Pokemon Fusion Gallery | Create & Browse Characters",
  description:
    "Explore the best Dragon Ball & Pokemon fusions created by AI. Browse thousands of unique character combinations or generate your own fusion today!",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Fusion Gallery - Dragon Ball & Pokemon Fusions",
    description:
      "Explore the best Dragon Ball & Pokemon fusions created by AI. Browse thousands of unique character combinations or generate your own fusion today!",
    url: "https://fusiongenerator.fun/gallery",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/fusion-generator-logo.svg", // Ideally this should be a featured image, keeping logo for now as I don't have a better asset path yet.
        width: 1200,
        height: 630,
        alt: "Fusion Generator Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Gallery - Dragon Ball & Pokemon Fusions",
    description: "Explore the best Dragon Ball & Pokemon fusions created by AI.",
  },
}

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
