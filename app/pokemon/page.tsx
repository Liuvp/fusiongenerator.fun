import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Palette, Leaf, ChevronDown, Upload } from "lucide-react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pokemon Fusion Generator - Create Infinite Pokemon Fusions Online",
  description:
    "Free Pokemon Fusion Generator - Combine any two Pokemon to create new evolutionary forms. Supports all generations 1-9, including legendary Pokemon fusions and shiny variants.",
  keywords:
    "pokemon fusion generator, pokemon infinite fusion, pokemon fusion, pokemon generator fusion, pokemon fusion generation, infinite fusion pokemon",
  alternates: {
    canonical: "/pokemon",
  },
  openGraph: {
    title: "Pokemon Fusion Generator - Create Infinite Pokemon Fusions Online",
    description:
      "Free Pokemon Fusion Generator - Combine any two Pokemon to create new evolutionary forms. Supports all generations 1-9, including legendary Pokemon fusions and shiny variants.",
    url: "https://fusiongenerator.fun/pokemon",
    type: "website",
    images: [
      {
        url: "/gallery/Pokemon-Character-Fusion-Pikachu-Charizard-HD-Preview.png",
        width: 1200,
        height: 630,
        alt: "Pokemon Fusion Generator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Fusion Generator",
    description: "Create infinite Pokemon fusions",
    images: ["/gallery/Pokemon-Character-Fusion-Pikachu-Charizard-HD-Preview.png"],
  },
};

export default function PokemonPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I fuse Legendary Pokémon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! You can fuse any Pokémon, including Legendary and Mythical species. Some advanced fusions—like Legendary Mega Forms—may require Fusion Stones (a premium feature).",
        },
      },
      {
        "@type": "Question",
        name: "Can I create Shiny fusions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Enable Shiny mode manually, or let the system randomly generate one. There is a 1/4096 probability for a natural Shiny fusion.",
        },
      },
      {
        "@type": "Question",
        name: "Which Pokémon generations are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All Pokémon from Generation 1 to Generation 9, including regional variants such as Alolan, Galarian, Hisuian, and Paldean forms.",
        },
      },
      {
        "@type": "Question",
        name: "How many fusions can I create for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can generate 3 free fusions per day. Sharing your creation on social media unlocks bonus fusion attempts.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 py-10 md:py-12">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Hero Section */}
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Pokemon Fusion Studio
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Pokemon Fusion Generator
                  <br />
                  Create Infinite Pokemon Combinations
                </h1>
                <p className="text-lg text-muted-foreground">
                  Upload two Pokemon and fuse types, abilities, and appearances in seconds. Supports all generations 1-9.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="h-10 px-4 py-2">
                    <Link href="#fusion-studio">Start Fusing</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-10 px-4 py-2">
                    <Link href="/gallery">View Fusion Dex</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-[260px] md:h-[360px]">
                <Image
                  src="/pokemon-fusion-preview.webp"
                  alt="Pokemon Fusion Generator Example - Pikachu and Charizard Fusion"
                  fill
                  className="object-cover rounded-xl"
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>

            {/* Fusion Studio Section */}
            <div id="fusion-studio" className="space-y-6 scroll-mt-20">
              <h2 className="text-2xl font-bold">Pokemon Fusion Studio</h2>
              <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* Upload Areas */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Pokemon A */}
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        Upload Pokemon A
                      </div>
                      <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input className="hidden" type="file" accept="image/*" />
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Drop or Click to Upload
                        </div>
                      </div>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Name (optional)"
                      />
                      <div className="text-xs text-muted-foreground">
                        Pro Tip: Clear, front-facing images work best
                      </div>
                    </div>

                    {/* Pokemon B */}
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        Upload Pokemon B
                      </div>
                      <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input className="hidden" type="file" accept="image/*" />
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Drop or Click to Upload
                        </div>
                      </div>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Name (optional)"
                      />
                      <div className="text-xs text-muted-foreground">
                        Pro Tip: Clear, front-facing images work best
                      </div>
                    </div>
                  </div>

                  {/* Settings & Action */}
                  <div className="grid gap-4 md:grid-cols-3 items-end">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Fusion Style</div>
                      <div className="relative">
                        <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                          <option>Balanced Hybrid</option>
                          <option>Type-Dominant A</option>
                          <option>Type-Dominant B</option>
                          <option>Mega Evolution Style</option>
                          <option>Regional Variant</option>
                          <option>Shiny Palette</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Button className="w-full h-12 text-base font-bold tracking-wide" disabled>
                        EVOLVE & FUSE!
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">About Our Pokemon Fusion Generator</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Our <strong>pokemon fusion generator</strong> allows you to combine any Pokemon from all generations. Create unique <strong>pokemon infinite fusion</strong> combinations with our advanced AI technology. Whether you're looking for <strong>pokemon fusion generation</strong> ideas or want to experiment with <strong>pokemon generator fusion</strong> tools, our platform supports all Pokemon from Gen 1 to Gen 9, including Legendary Pokemon, Mythical Pokemon, regional variants (Alolan, Galarian, Hisuian, Paldean), and even Shiny forms.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                The fusion process intelligently blends visual traits, type combinations, ability pools, and stat distributions to create biologically plausible hybrids. Upload clear images of two Pokemon, select your preferred fusion style (Balanced Hybrid, Type-Dominant, Mega Evolution Style, Regional Variant, or Shiny Palette), and watch as the generator produces a high-resolution fusion image complete with suggested typing, abilities, and Pokedex-style flavor text.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Visual Trait Fusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Combine colors, patterns, and physical characteristics seamlessly.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Type & Ability Mixing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Blend elemental types, abilities, and battle stats intelligently.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Evolution Science</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Create biologically plausible Pokemon hybrids with lore integration.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Popular Fusions Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Fusion Dex Gallery</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Explore some of the most popular Pokemon fusions created by our community. From classic combinations like Pikachu + Charizard (Pikazard) to creative hybrids like Mewtwo + Lucario (Mewcario), the possibilities are endless. Each fusion inherits unique type combinations, abilities, and visual characteristics from both parent Pokemon.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { left: "Pikachu", right: "Charizard", name: "Pikazard", types: ["⚡ Electric", "🐉 Dragon"] },
                  { left: "Mewtwo", right: "Lucario", name: "Mewcario", types: ["🔮 Psychic", "🥊 Fighting"] },
                  { left: "Gengar", right: "Snorlax", name: "Snorenar", types: ["⭐ Normal", "👻 Ghost"] },
                  { left: "Lapras", right: "Charizard", name: "Aquazard", types: ["💧 Water", "🔥 Fire"] },
                ].map((item, i) => (
                  <Card key={i} className="border-2 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{item.left} × {item.right}</p>
                          <p className="font-semibold text-lg">{item.name}</p>
                          <div className="flex gap-2 flex-wrap">
                            {item.types.map((type, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded-full border bg-muted">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="relative w-24 h-24 bg-muted rounded-full overflow-hidden border">
                          <Image
                            src="/images/fusion-generator-logo.svg"
                            alt={item.name}
                            fill
                            className="object-cover p-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">FAQ</h3>
              <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  {faqSchema.mainEntity.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.acceptedAnswer.text}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Ready to craft a new species?
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button asChild className="h-10 px-4 py-2">
                  <Link href="/pricing">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 px-4 py-2">
                  <Link href="/gallery">Explore Fusion Dex</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
