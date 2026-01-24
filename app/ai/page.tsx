import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Wand2, Upload, ChevronDown } from "lucide-react";
import Script from "next/script";

// Dynamic import for heavy client component
const FusionClientPage = nextDynamic(() => import("./client-page"), {
    ssr: true,
    loading: () => (
        <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
            {/* Header Skeleton */}
            <div className="text-center space-y-2">
                <div className="h-8 sm:h-10 bg-muted animate-pulse rounded-lg w-56 mx-auto"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-72 mx-auto mt-2"></div>
            </div>

            {/* Step 1 Label */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted animate-pulse"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            </div>

            {/* Upload Boxes - Mobile: Stack, Tablet+: Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="aspect-square bg-muted animate-pulse rounded-2xl"></div>
                <div className="aspect-square bg-muted animate-pulse rounded-2xl"></div>
            </div>

            {/* Step 2 & Prompt */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted animate-pulse"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-36"></div>
                </div>
                <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
            </div>

            {/* Step 3 & Generate Button */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted animate-pulse"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-28"></div>
                </div>
                <div className="h-14 bg-muted animate-pulse rounded-2xl"></div>
            </div>
        </section>
    )
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
                url: "/gallery/AI-Fusion-Generator-Preview.png", // Assuming a generic preview
                width: 1200,
                height: 630,
                alt: "AI Fusion Generator Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Fusion Generator – Anime & Character Fusions Online",
        description:
            "Create unique anime and character fusions with our free AI Fusion Generator. Easily merge photos, cartoons, and manga characters online in seconds.",
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

    return (
        <>
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="min-h-screen bg-background">
                <div className="container px-4 sm:px-6 py-8 sm:py-12">
                    <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 md:space-y-16">

                        {/* Hero Section - Mobile First */}
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary font-medium">
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                AI-Powered Fusion Studio
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                AI Fusion Generator
                                <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-muted-foreground font-semibold">
                                    Create Anime & Character Fusions
                                </span>
                            </h1>
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
                                            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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
                                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
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
                                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
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
                                        desc: "High-energy Saiyan fusion with balanced power"
                                    },
                                    {
                                        left: "Pikachu",
                                        right: "Charizard",
                                        series: "Pokemon",
                                        desc: "Electric dragon hybrid with fire and lightning"
                                    },
                                    {
                                        left: "Naruto",
                                        right: "Sasuke",
                                        series: "Anime",
                                        desc: "Ninja fusion combining chakra techniques"
                                    },
                                    {
                                        left: "Iron Man",
                                        right: "Spider-Man",
                                        series: "Marvel",
                                        desc: "Tech-enhanced web-slinger hybrid"
                                    },
                                ].map((item, i) => (
                                    <Card key={i} className="border-2 shadow-sm flex-shrink-0 w-[260px] sm:w-auto snap-start">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="space-y-3">
                                                <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden border">
                                                    <Image
                                                        src="/images/fusion-generator-logo.svg"
                                                        alt={`AI Fusion Example: ${item.left} and ${item.right} from ${item.series} - ${item.desc}`}
                                                        fill
                                                        sizes="(max-width: 640px) 260px, (max-width: 768px) 50vw, 33vw"
                                                        loading="lazy"
                                                        className="object-cover p-6 sm:p-8 opacity-70"
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
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
