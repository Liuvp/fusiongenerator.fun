import Script from "next/script";
import { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { PokeHero } from "@/components/pokemon/hero";
import { PokeHowToUse } from "@/components/pokemon/how-to-use";
import { PokeFeatures } from "@/components/pokemon/features";
import { PokeFAQ, FAQ_DATA } from "@/components/pokemon/faq";

// Dynamic imports for heavy interactive components
const PokeFusionStudio = dynamicImport(
  () => import("@/components/pokemon/fusion-studio").then(mod => mod.PokeFusionStudio),
  {
    loading: () => <div className="w-full h-[600px] bg-slate-100 rounded-3xl animate-pulse mx-auto" />
  }
);
import { PokePopularFusions } from "@/components/pokemon/popular-fusions";
import { PokeCTA } from "@/components/pokemon/cta";
import { ErrorBoundary } from "@/components/error-boundary";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Pokemon Fusion Generator (Gen 1-9) | Free Online AI Tool",
  description:
    "Use our free online Pokemon Fusion Generator to combine any two Pokemon in seconds. Supports Gen 1-9 styles, no download, and instant AI fusion results.",
  alternates: {
    canonical: "https://fusiongenerator.fun/pokemon",
  },
  openGraph: {
    title: "Pokemon Fusion Generator (Gen 1-9) | Free Online AI Tool",
    description:
      "Use our free online Pokemon Fusion Generator to combine any two Pokemon in seconds. Supports Gen 1-9 styles, no download, and instant AI fusion results.",
    url: "https://fusiongenerator.fun/pokemon",
    type: "website",
    images: [
      {
        url: "/images/pokemon-character-fusion-generator-preview.webp",
        width: 1200,
        height: 630,
        alt: "Pokemon fusion generator result: Pikachu + Charizard (Gen 1-9 style)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Fusion Generator (Gen 1-9) | Free Online AI Tool",
    description: "Free online Pokemon fusion tool for Gen 1-9 inspired hybrids. No download required.",
    images: ["/images/pokemon-character-fusion-generator-preview.webp"],
  },
};

export default function PokemonPage() {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pokemon Fusion Generator",
    "description": "Create Pokemon fusions online for free using AI. Combine any two Pokemon with Gen 1-9 inspired styles and instant results.",
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
      "Free online Pokemon fusion generation",
      "Gen 1-9 inspired fusion styles",
      "No download required",
      "High-resolution image output"
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
          __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd, FAQ_DATA])
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-10 md:py-12">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            <PokeHero />

            {/* SEO Intro Section */}
            <section className="prose prose-lg prose-neutral max-w-none mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6">Free Online Pokemon Fusion Generator (Gen 1-9)</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg">
                    Create unique Pokemon fusions online for free. Our <strong>Pokemon Fusion Generator</strong> lets
                    you combine any two Pokemon and instantly generate a new hybrid design in your browser. No
                    download is required, and results are ready in seconds.
                  </p>
                  <p className="mt-4">
                    If you searched for a <strong>Pokemon combiner</strong>, <strong>Pokemon merger</strong>, or
                    <strong> Pokemon fusion AI</strong>, this tool gives you all three in one simple workflow.
                  </p>
                </div>

                <div>
                  <p className="text-lg">
                    Generate fusions with <strong>Gen 1-9 inspired styles</strong>, including fan-favorites like
                    Pikachu, Charizard, and Mewtwo. The AI intelligently blends:
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

              <div className="mt-8 rounded-xl border border-border p-6 bg-muted/20">
                <h3 className="text-xl font-semibold mb-3">
                  Pokemon Combiner, Merger, or Fusion Generator - What&apos;s the Difference?
                </h3>
                <p className="text-base m-0">
                  A basic Pokemon combiner or merger usually overlays features, while an AI Pokemon Fusion Generator
                  creates cleaner hybrids with better style blending, colors, and structure. This page is optimized for
                  combine, merge, and fusion intents while keeping results fast and high quality.
                </p>
              </div>
            </section>

            <ErrorBoundary context="pokemon_studio">
              <PokeFusionStudio />
            </ErrorBoundary>
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
