import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Fusion Gallery - Dragon Ball & Pokemon Character Fusions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of amazing Dragon Ball and Pokemon character fusions. Get inspired by community creations and start your own fusion journey.
        </p>
      </div>

      {/* Sticky return-to-generator banner — stays visible while scrolling gallery (#10) */}
      <div className="sticky top-16 z-40 mb-8 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground hidden sm:block">
            Want to make your own fusion?
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Button asChild variant="default" size="sm">
              <Link href="/dragon-ball">← Back to Fusion Generator</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      <GalleryPage />
    </div>
  );
}
