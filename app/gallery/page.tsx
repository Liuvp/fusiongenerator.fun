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
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/ai">Try the Generator</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>

      <GalleryPage />
    </div>
  );
}
