import { Metadata } from "next";
import BlogPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog – Fusion Generator",
  description: "Read the latest guides, tips, and news about Dragon Ball and Pokémon fusion generation. Updated regularly.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog – Fusion Generator",
    description: "Read the latest guides, tips, and news about Dragon Ball and Pokémon fusion generation.",
    url: "https://fusiongenerator.fun/blog",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – Fusion Generator",
    description: "Read the latest guides, tips, and news about Dragon Ball and Pokémon fusion generation.",
  },
};

export default function Page() {
  return <BlogPage />;
}
