import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Flame, ChevronDown, Upload, Star } from "lucide-react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dragon Ball Fusion Generator - Create DBZ Character Fusions | FusionGenerator",
  description:
    "Free Dragon Ball Fusion Generator for Goku Vegeta fusion, DBZ character combinations. Create Super Saiyan fusions with our AI-powered Dragon Ball Z fusion tool.",
  keywords:
    "fusion generator, dragon ball fusion, pokemon fusion, character fusion, AI fusion, anime fusion, game character fusion",
  alternates: {
    canonical: "/dragon-ball",
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator - Create DBZ Character Fusions | FusionGenerator",
    description:
      "Free Dragon Ball Fusion Generator for Goku Vegeta fusion, DBZ character combinations. Create Super Saiyan fusions with our AI-powered Dragon Ball Z fusion tool.",
    url: "https://fusiongenerator.fun/dragon-ball",
    type: "website",
    images: [
      {
        url: "/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.png",
        width: 1200,
        height: 630,
        alt: "Dragon Ball Fusion Generator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ball Fusion Generator",
    description: "Create DBZ character fusions online",
    images: ["/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.png"],
  },
};

export default function DragonBallPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What happens to my uploaded photos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We do not store your original uploads. They are processed to create your fusion and deleted after completion. Only the final fusion result may be stored for sharing.",
        },
      },
      {
        "@type": "Question",
        name: "Can I fuse two animals or objects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The more creative, the better. Try a cat + dog or coffee cup + laptop to craft a fun Z-Fighter.",
        },
      },
      {
        "@type": "Question",
        name: "Can I mix a real person with an anime character?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Upload a photo of yourself and a character image to see a hybrid Saiyan form.",
        },
      },
      {
        "@type": "Question",
        name: "How many fusions can I create for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can create 3 free fusions per day. Sharing results on social platforms may grant extra attempts.",
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
                  Dragon Ball Fusion Studio
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Dragon Ball Fusion Generator
                  <br />
                  Create Epic DBZ Character Fusions
                </h1>
                <p className="text-lg text-muted-foreground">
                  Use our Dragon Ball Fusion Generator to combine Goku, Vegeta, and all DBZ characters. Create Super Saiyan fusions instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="h-10 px-4 py-2">
                    <Link href="#fusion-studio">Start Fusing</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-10 px-4 py-2">
                    <Link href="/gallery">View Gallery</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-[260px] md:h-[360px]">
                <Image
                  src="/images/fusion-generator-logo.svg"
                  alt="Dragon Ball fusion preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Fusion Studio Section */}
            <div id="fusion-studio" className="space-y-6 scroll-mt-20">
              <h2 className="text-2xl font-bold">Dragon Ball Fusion Studio</h2>
              <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* Upload Areas */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Character A */}
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        Upload Dragon Ball Character A
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
                        placeholder="Name A (optional)"
                      />
                      <div className="text-xs text-muted-foreground">
                        Pro Tip: Use clear, front-facing images
                      </div>
                    </div>

                    {/* Character B */}
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        Upload Dragon Ball Character B
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
                        placeholder="Name B (optional)"
                      />
                      <div className="text-xs text-muted-foreground">
                        Pro Tip: Use clear, front-facing images
                      </div>
                    </div>
                  </div>

                  {/* Settings & Action */}
                  <div className="grid gap-4 md:grid-cols-3 items-end">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Select Fusion Form</div>
                      <div className="relative">
                        <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                          <option>Potara (Vegito Style)</option>
                          <option>Fusion Dance (Gogeta Style)</option>
                          <option>Super Saiyan God</option>
                          <option>Ultra Instinct</option>
                          <option>Legendary Super Saiyan</option>
                          <option>Base Form</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Button className="w-full h-12 text-base font-bold tracking-wide" disabled>
                        CREATE DRAGON BALL FUSION
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How to Use Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">How to Use Our Dragon Ball Fusion Generator</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Our Dragon Ball Fusion Generator lets you create anime-accurate character combinations in seconds. Upload two clear, front-facing images for Character A and Character B, then choose a fusion form like Potara (Vegito), Fusion Dance (Gogeta), Super Saiyan God, Ultra Instinct, Legendary Super Saiyan, or Base Form. The tool blends silhouettes, colors, and iconic Dragon Ball visual motifs to produce a high-resolution result. For popular long‑tail queries such as Goku and Vegeta fusion or Dragon Ball Z fusion generator, simply input &quot;Goku&quot; and &quot;Vegeta&quot; as names to label your output, and pick Potara or Fusion Dance depending on the style you want.
              </p>

              <h3 className="text-xl font-semibold">Fusion Types Explained</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Potara fusions combine fighters via Supreme Kai earrings and typically yield Vegito‑style results with golden aura lines and sharper contrast. Fusion Dance produces Gogeta‑style outcomes with balanced features, athletic proportions, and dynamic speed trails. Super Saiyan God adds crimson godly ki and refined edges, while Ultra Instinct emphasizes silver highlights and effortless motion. Legendary Super Saiyan evokes emerald energy and high impact lines. Each setting tailors color grading, glow distribution, and aura geometry to match Dragon Ball’s canon aesthetics.
              </p>

              <h3 className="text-xl font-semibold">Tips for Best Results</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Use high‑quality source images, avoid extreme angles, and keep backgrounds simple. Name your fighters (e.g., &quot;Goku&quot; and &quot;Vegeta&quot;) to auto‑generate a themed fusion name. After you click Create Dragon Ball Fusion, download the HD image or share on social media. If you love anime pairings beyond Saiyans, try Piccolo + Gohan, Trunks + Goten, or villain fusions like Frieza + Cell. This Dragon Ball Fusion Generator is AI‑assisted, ensuring consistent lighting, aura cohesion, and anime‑style edges for authentic DBZ character fusions every time.
              </p>
            </div>

            {/* Popular Fusions Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Popular Dragon Ball Fusions</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Fans frequently search for dragon ball z vegeta and goku fusion, so we’ve optimized presets for both Gogeta (Fusion Dance) and Vegito (Potara). Gogeta showcases balanced facial structure and fast, cinematic motion lines, perfect for dynamic posters. Vegito highlights confident posture, golden ki accents, and sharper silhouette contrast—ideal for powerful hero shots. Gotenks, formed by Goten and Trunks, emphasizes playful energy and exaggerated features, while Piccolo + Gohan combinations capture mentor‑student harmony and tactical composure. Our generator models iconic hairstyles, battle outfits, and aura color theory to preserve anime consistency while enabling custom creativity.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                Try mixing protagonists and rivals to explore heritage and rivalry: Goku + Vegeta for classic synergy, Frieza + Cell for villain supremacy, or Broly + Goku for overwhelming ki force. For long‑tail keyword coverage, you can label creations as &quot;Dragon Ball Fusion: Goku × Vegeta&quot; or &quot;DBZ Fusion: Trunks × Goten&quot; right on the card. The tool’s AI‑driven pipeline balances feature blending, color grading, and aura geometry, producing high‑resolution images that look great in galleries, avatars, and printable merch. Whether you want a poster‑ready Gogeta or an emerald ki Vegito, this Dragon Ball Fusion Generator delivers authentic results quickly and reliably.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { left: "Goku", right: "Vegeta", name: "Gogeta Variant" },
                  { left: "Piccolo", right: "Gohan", name: "Mentor’s Resolve" },
                  { left: "Trunks", right: "Goten", name: "Future Spark" },
                  { left: "Frieza", right: "Cell", name: "Perfect Emperor" },
                ].map((item, i) => (
                  <Card key={i} className="border-2 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Dragon Ball Fusion: {item.left} × {item.right}</p>
                          <p className="font-semibold text-lg">{item.name}</p>
                        </div>
                        <div className="relative w-20 h-20 bg-muted rounded-full overflow-hidden border">
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

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Dragon Ball Fusion Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Advanced DBZ fusion algorithms for authentic Dragon Ball character combinations...
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Fusion Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Balance heritage, rivalry, and personality to achieve authentic Dragon Ball fusion results.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Visual Motifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Outfits, spiky hair, and aura colors combine to deliver striking, anime-accurate visuals.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">FAQ</h3>
              <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-4">
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
                Ready to Create Dragon Ball Fusions?
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button asChild className="h-10 px-4 py-2">
                  <Link href="/pricing">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 px-4 py-2">
                  <Link href="/gallery">Explore Gallery</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
