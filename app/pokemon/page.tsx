import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { PokeHero } from "@/components/pokemon/hero";

// Critical: Load with SSR to ensure initial content
const PokeFusionStudio = nextDynamic(() => import("@/components/pokemon/fusion-studio").then(mod => mod.PokeFusionStudio), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 animate-pulse bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading Fusion Studio...</p>
    </div>
  )
});

// Lazy load non-critical components to improve initial page load performance
const PokeHowToUse = nextDynamic(() => import("@/components/pokemon/how-to-use").then(mod => mod.PokeHowToUse));
const PokePopularFusions = nextDynamic(() => import("@/components/pokemon/popular-fusions").then(mod => mod.PokePopularFusions));
const PokeFeatures = nextDynamic(() => import("@/components/pokemon/features").then(mod => mod.PokeFeatures));
const PokeFAQ = nextDynamic(() => import("@/components/pokemon/faq").then(mod => mod.PokeFAQ));
const PokeCTA = nextDynamic(() => import("@/components/pokemon/cta").then(mod => mod.PokeCTA));

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Pokemon Fusion Generator – Pikachu, Charizard & Mewtwo Fusions",
  description:
    "Instantly create infinite Pokemon fusions! Mix Pikachu, Charizard, Mewtwo, and more to discover new species. Free, fun, and easy-to-use Pokemon fusion generator.",
  alternates: {
    canonical: "/pokemon",
  },
  openGraph: {
    title: "Pokemon Fusion Generator – Pikachu, Charizard & Mewtwo Fusions",
    description:
      "Instantly create infinite Pokemon fusions! Mix Pikachu, Charizard, Mewtwo, and more to discover new species. Free, fun, and easy-to-use Pokemon fusion generator.",
    url: "https://fusiongenerator.fun/pokemon",
    type: "website",
    images: [
      {
        url: "/gallery/Pokemon-Character-Fusion-Pikachu-Charizard-HD-Preview.png",
        width: 1200,
        height: 630,
        alt: "Pokemon Fusion Generator Preview - Pikachu and Charizard Hybrid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Fusion Generator – Pikachu, Charizard & Mewtwo Fusions",
    description: "Instantly create infinite Pokemon fusions! Mix Pikachu, Charizard, Mewtwo, and more to discover new species.",
    images: ["/gallery/Pokemon-Character-Fusion-Pikachu-Charizard-HD-Preview.png"],
  },
};

export default function PokemonPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          <PokeHero />
          <PokeFusionStudio />
          <PokeHowToUse />
          <PokeFeatures />
          <PokePopularFusions />
          <PokeFAQ />
          <PokeCTA />
        </div>
      </div>
    </div>
  );
}
