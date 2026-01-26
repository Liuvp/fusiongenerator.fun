import Script from "next/script";
import { Metadata } from "next";
import { PokeHero } from "@/components/pokemon/hero";

// Text-heavy components - Static import for SEO and LCP
import { PokeHowToUse } from "@/components/pokemon/how-to-use";
import { PokePopularFusions } from "@/components/pokemon/popular-fusions";
import { PokeFeatures } from "@/components/pokemon/features";
import { PokeFAQ } from "@/components/pokemon/faq";
import { PokeCTA } from "@/components/pokemon/cta";
import { PokeFusionStudio } from "@/components/pokemon/fusion-studio";

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
        url: "/images/pokemon-character-fusion-generator-preview.webp",
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
    images: ["/images/pokemon-character-fusion-generator-preview.webp"],
  },
};

export default function PokemonPage() {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pokemon Fusion Generator",
    "description": "Create infinite Pokemon fusions using AI. Mix Pikachu, Charizard, and all species from Gen 1-9.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "url": "https://fusiongenerator.fun/pokemon",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UseAction",
      "userInteractionCount": "2500"
    },
    "featureList": [
      "Supports Gen 1-9 Pokémon",
      "Infinite Fusion Combinations",
      "High-Resolution Image Generation",
      "Shiny and Mega Evolution Styles"
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fusiongenerator.fun/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pokemon Fusion Generator",
        "item": "https://fusiongenerator.fun/pokemon"
      }
    ]
  };

  return (
    <>
      <Script
        id="pokemon-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd])
        }}
      />
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
    </>
  );
}
