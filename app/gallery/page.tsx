import { Metadata } from "next";
import GalleryPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
  description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions. Get inspired by community creations and start your own fusion journey.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
    description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions. Get inspired by community creations and start your own fusion journey.",
    url: "/gallery",
    type: "website",
    images: [
      {
        url: "/images/gallery-preview.png",
        width: 1200,
        height: 630,
        alt: "Fusion Gallery Preview - Dragon Ball & Pokemon Fusions",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
    description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions.",
    images: ["/images/gallery-preview.png"],
  },
};

export default function Page() {
  return <GalleryPage />;
}
