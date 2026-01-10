import { Metadata } from "next";
import { PokeHero } from "@/components/pokemon/hero";
import { PokeFusionStudio } from "@/components/pokemon/fusion-studio";
import { PokeHowToUse } from "@/components/pokemon/how-to-use";
import { PokePopularFusions } from "@/components/pokemon/popular-fusions";
import { PokeFeatures } from "@/components/pokemon/features";
import { PokeFAQ } from "@/components/pokemon/faq";
import { PokeCTA } from "@/components/pokemon/cta";

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
