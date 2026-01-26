import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Wand2, Upload, ChevronDown } from "lucide-react";
import Script from "next/script";

// Optimize: Dynamic import to reduce initial JS bundle size
const FusionClientPage = nextDynamic(() => import('./client-page'), {
    loading: () => (
        <div className="w-full max-w-2xl mx-auto px-4 py-12 space-y-8 animate-pulse">
            <div className="h-8 bg-muted rounded-md w-1/3 mx-auto" />
            <div className="h-4 bg-muted rounded-md w-2/3 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="aspect-square bg-muted rounded-2xl" />
                <div className="aspect-square bg-muted rounded-2xl" />
            </div>
            <div className="h-12 bg-muted rounded-xl w-full" />
            <div className="h-14 bg-muted rounded-2xl w-full" />
        </div>
    ),
});

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "AI Fusion Generator – Anime & Character Fusions Online",
    description:
        "Create unique anime and character fusions with our free AI Fusion Generator. Easily merge photos, cartoons, and manga characters online in seconds.",
    alternates: {
        canonical: "/ai",
    },
    openGraph: {
        title: "AI Fusion Generator – Anime & Character Fusions Online",
        description:
            "Create unique anime and character fusions with our free AI Fusion Generator. Easily merge photos, cartoons, and manga characters online in seconds.",
        url: "https://fusiongenerator.fun/ai",
        type: "website",
        images: [
            {
                url: "/images/character-fusion-mashup-ai-generator.webp",
                width: 1200,
                height: 630,
                alt: "AI Fusion Generator output example: A high-quality creative mashup of different character styles",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Fusion Generator – Anime & Character Fusions Online",
        description:
            "Create unique anime and character fusions with our free AI Fusion Generator. Easily merge photos, cartoons, and manga characters online in seconds.",
        images: ["/images/character-fusion-mashup-ai-generator.webp"],
    },
};

export default function AIFusionPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How does the AI fusion technology work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our AI fusion generator uses deep learning algorithms to analyze both images and create seamless blends while preserving important features from each source image.",
                },
            },
            {
                "@type": "Question",
                name: "What types of images work best with AI fusion?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The AI works well with anime-style character fusions, Pokémon-inspired hybrids, and realistic photo blends, as long as the images are clear and well-lit.",
                },
            },
            {
                "@type": "Question",
                name: "Is the AI fusion generator really free?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! Our basic AI image fusion is completely free with 3 fusions per day. Premium features and unlimited fusions are available for advanced users.",
                },
            },
            {
                "@type": "Question",
                name: "Can I use AI fusion for commercial projects?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Free tier fusions are for personal use only. Commercial usage requires a Premium or Pro subscription with full commercial rights.",
                },
            },
        ],
    };

    const softwareAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Fusion Generator",
        "description": "Advanced AI technology to merge any two images. Create unique character fusions, anime mashups, and artistic photo blends instantly.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": "https://fusiongenerator.fun/ai",
        "image": "https://fusiongenerator.fun/images/character-fusion-mashup-ai-generator.webp",
        "author": {
            "@type": "Organization",
            "name": "FusionGenerator",
            "url": "https://fusiongenerator.fun"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/UseAction",
            "userInteractionCount": 5800
        },
        "featureList": [
            "Cross-IP Character Fusion",
            "Photo to Anime Merging",
            "Custom Fusion Prompts",
            "Real-time AI Processing"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": 120
        }
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
                "name": "AI Fusion Generator",
                "item": "https://fusiongenerator.fun/ai"
            }
        ]
    };

    return (
        <>
            <Script
                id="ai-fusion-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, softwareAppJsonLd, breadcrumbJsonLd]) }}
            />

            <div className="min-h-screen bg-background">
                <div className="container px-4 sm:px-6 py-8 sm:py-12">
                    <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 md:space-y-16">

                        {/* Hero Section - Mobile First */}
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary font-medium">
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                                AI-Powered Fusion Studio
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                AI Fusion Generator
                                <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-muted-foreground font-semibold">
                                    Create Anime & Character Fusions
                                </span>
                            </h1>
                            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-xl overflow-hidden shadow-2xl my-6">
                                <Image
                                    src="/images/character-fusion-mashup-ai-generator.webp"
                                    alt="AI Fusion Generator output example: A high-quality creative mashup of different character styles"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
                                Advanced AI fusion technology to merge any two images. Supports characters, animals, and custom photos with professional results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
                                <Button asChild className="h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="#fusion-studio" aria-label="Start creating AI fusions">Start Fusing</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="/gallery" aria-label="View gallery of AI fusion examples">View Gallery</Link>
                                </Button>
                            </div>
                        </div>


                        {/* AI Fusion Studio Section */}
                        <FusionClientPage />

                        <noscript>
                            <div className="w-full max-w-2xl mx-auto px-4 py-12 text-center space-y-6 border-2 border-dashed border-primary/20 rounded-2xl bg-muted/10">
                                <Sparkles className="h-12 w-12 text-primary mx-auto opacity-50" />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">AI Fusion Studio</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        JavaScript is required to use the interactive fusion studio.
                                        Please enable JavaScript to upload images and generate amazing character fusions.
                                    </p>
                                </div>
                            </div>
                        </noscript>

                        {/* About Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">About Our AI Fusion Generator</h2>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                Our <strong>AI fusion generator</strong> uses cutting-edge artificial intelligence to seamlessly blend any two images. Whether you're creating character fusions, <strong>AI image fusion</strong> artwork, or experimenting with <strong>fusion AI image generator</strong> technology, our tool delivers professional results instantly. Looking for specialized Dragon Ball or Pokémon character fusions? Try our main <Link href="/" className="text-primary hover:underline font-medium">Fusion Generator</Link> for curated fusion options, or continue here for advanced AI-powered image blending. The advanced <strong>fusion generator AI</strong> analyzes visual features, color palettes, and structural elements to create harmonious combinations that preserve the best aspects of both source images.
                            </p>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                Perfect for artists, content creators, and enthusiasts, our <strong>image fusion AI</strong> technology supports a wide range of applications including character design, concept art, social media content, and creative experimentation. Upload any two images and watch as our AI creates stunning fusions in seconds.
                            </p>
                        </div>

                        {/* Features Grid - Mobile: Horizontal scroll, Tablet+: Grid */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left">Why Choose Our AI Fusion</h3>

                            {/* Mobile: Horizontal scrollable cards */}
                            <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                                <Card className="border-2 shadow-sm flex-shrink-0 w-[280px] sm:w-auto snap-start">
                                    <CardHeader className="pb-2">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                                            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg">AI-Powered Blending</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Deep learning algorithms analyze and merge images intelligently.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-2 shadow-sm flex-shrink-0 w-[280px] sm:w-auto snap-start">
                                    <CardHeader className="pb-2">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-3">
                                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" aria-hidden="true" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg">Instant Results</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Generate professional-quality fusions in seconds, not hours.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-2 shadow-sm flex-shrink-0 w-[280px] sm:w-auto snap-start">
                                    <CardHeader className="pb-2">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-3">
                                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent" aria-hidden="true" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg">Multiple Styles</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Choose from balanced, artistic, or realistic fusion styles.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Mobile scroll indicator */}
                            <p className="text-xs text-muted-foreground text-center sm:hidden">
                                ← Swipe to see more →
                            </p>
                        </div>

                        {/* Example Fusions Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl sm:text-2xl font-bold">Example AI Fusions</h3>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Explore stunning examples created with our AI fusion generator. From Dragon Ball character combinations to Pokemon hybrids, see what's possible.
                            </p>

                            {/* Mobile: Horizontal scroll, Tablet+: 2-column grid */}
                            <div className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                                {[
                                    {
                                        left: "Goku",
                                        right: "Vegeta",
                                        series: "Dragon Ball",
                                        desc: "High-energy Saiyan fusion with balanced power",
                                        image: "/images/dragon-ball-fusion-preview-goku-vegeta.webp"
                                    },
                                    {
                                        left: "Pikachu",
                                        right: "Charizard",
                                        series: "Pokemon",
                                        desc: "Electric dragon hybrid with fire and lightning",
                                        image: "/images/pokemon-character-fusion-generator-preview.webp"
                                    },
                                    {
                                        left: "Naruto",
                                        right: "Kurama",
                                        series: "Anime",
                                        desc: "Sage Mode power awakening in human-beast hybrid form",
                                        image: "/images/naruto-kurama-fusion.webp"
                                    },
                                    {
                                        left: "Cyborg",
                                        right: "Samurai",
                                        series: "Original Art",
                                        desc: "Futuristic warrior blending high-tech armor with traditional bushido",
                                        image: "/images/cyberpunk-samurai-fusion.webp"
                                    },
                                ].map((item, i) => (
                                    <Card key={i} className="border-2 shadow-sm flex-shrink-0 w-[260px] sm:w-auto snap-start bg-card/50 backdrop-blur-sm">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="space-y-3">
                                                <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden border shadow-sm">
                                                    <Image
                                                        src={item.image}
                                                        alt={`AI Fusion Example: ${item.left} and ${item.right} from ${item.series} - ${item.desc}`}
                                                        fill
                                                        sizes="(max-width: 640px) 260px, (max-width: 768px) 50vw, 33vw"
                                                        loading="lazy"
                                                        className="object-cover hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">{item.left} × {item.right}</p>
                                                    <p className="font-semibold text-base sm:text-lg">{item.series} Fusion</p>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.desc}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Mobile scroll indicator */}
                            <p className="text-xs text-muted-foreground text-center sm:hidden">
                                ← Swipe to see more examples →
                            </p>
                        </div>

                        {/* FAQ Section - Mobile optimized */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-xl sm:text-2xl font-bold">Frequently Asked Questions</h3>
                            <Card className="border-2 shadow-sm">
                                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    {faqSchema.mainEntity.map((item, index) => (
                                        <div key={index} className="space-y-1.5 sm:space-y-2">
                                            <div className="font-semibold text-sm sm:text-base">{item.name}</div>
                                            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.acceptedAnswer.text}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bottom CTA - Mobile optimized */}
                        <div className="text-center space-y-4 px-4 sm:px-0">
                            <div className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary font-medium">
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                                Ready to create amazing AI fusions?
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Button asChild className="w-full sm:w-auto h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="/pricing" aria-label="View pricing plans and get started">Get Started</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="/gallery" aria-label="Explore more AI fusion examples in the gallery">Explore Gallery</Link>
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
