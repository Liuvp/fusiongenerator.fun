import { Metadata } from "next";
import TermsPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Service – Fusion Generator",
  description: "Review the terms governing use of Fusion Generator for Dragon Ball and Pokémon fusions. Updated January 2026.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service – Fusion Generator",
    description: "Review the terms governing use of Fusion Generator for Dragon Ball and Pokémon fusions.",
    url: "https://fusiongenerator.fun/terms",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service – Fusion Generator",
    description: "Review the terms governing use of Fusion Generator for Dragon Ball and Pokémon fusions.",
  },
};

export default function Page() {
  return <TermsPage />;
}
