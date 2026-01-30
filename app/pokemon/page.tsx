import Script from "next/script";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { PokeHero } from "@/components/pokemon/hero";
import { PokeHowToUse } from "@/components/pokemon/how-to-use";
import { PokeFeatures } from "@/components/pokemon/features";
import { PokeFAQ } from "@/components/pokemon/faq";

// Dynamic imports for heavy interactive components
const PokeFusionStudio = dynamicImport(() => import("@/components/pokemon/fusion-studio").then(mod => mod.PokeFusionStudio));
import { PokePopularFusions } from "@/components/pokemon/popular-fusions";
import { PokeCTA } from "@/components/pokemon/cta";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Pokemon Fusion Generator | AI Pokemon Fusion Online",
  description:
    "Instantly create infinite Pokemon fusions! Mix Pikachu, Charizard, Mewtwo, and more to discover new species. Free, fun, and easy-to-use Pokemon fusion generator.",
  alternates: {
    canonical: "https://fusiongenerator.fun/pokemon",
  },
  openGraph: {
    title: "Pokemon Fusion Generator | AI Pokemon Fusion Online",
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
    title: "Pokemon Fusion Generator | AI Pokemon Fusion Online",
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
    "author": {
      "@type": "Organization",
      "name": "Fusion Generator",
      "alternateName": ["FusionGenerator", "Fusion Generator AI"],
      "url": "https://fusiongenerator.fun"
    },
    "softwareHelp": "https://fusiongenerator.fun/blog",
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

            {/* SEO Intro Section */}
            <section className="prose prose-lg prose-neutral max-w-none mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6">Create AI Pokemon Fusions Online</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg">
                    Our <strong>Pokemon Fusion Generator</strong> is an AI-powered tool that lets you
                    combine any two Pokémon to create unique fusion characters. Using advanced{" "}
                    <strong>Pokemon fusion AI</strong>, you can instantly generate new hybrid Pokémon
                    designs online.
                  </p>
                  <p className="mt-4">
                    Popularized by fan projects like <strong>Pokémon Infinite Fusion</strong>, our
                    AI-based Pokemon fusion generator allows infinite creative combinations.
                  </p>
                </div>

                <div>
                  <p className="text-lg">
                    Mix Pokémon from <strong>Generation 1 to Generation 9</strong>, including Pikachu, Charizard,
                    and Mewtwo. The AI intelligently blends:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Visual traits and colors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Type combinations and abilities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Evolutionary characteristics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <PokeFusionStudio />
            <PokeHowToUse />
            <PokePopularFusions />
            <PokeFeatures />
            <PokeFAQ />
            <PokeCTA />
          </div>
        </div>
      </div>
    </>
  );
}
