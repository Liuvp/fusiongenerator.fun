import { Metadata } from "next";
import GalleryPage from "./client-page";

export const metadata: Metadata = {
  title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
  description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions. Get inspired by community creations and start your own fusion journey.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
    description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions. Get inspired by community creations and start your own fusion journey.",
    url: "https://fusiongenerator.fun/gallery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Gallery – Create Dragon Ball & Pokémon AI Fusions",
    description: "Browse our collection of amazing Dragon Ball and Pokémon character fusions.",
  },
};

export default function Page() {
  return <GalleryPage />;
}
