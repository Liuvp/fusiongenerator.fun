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
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="text-center space-y-1">
                <div className="h-8 bg-muted animate-pulse rounded w-48 mx-auto"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-64 mx-auto mt-2"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-muted animate-pulse rounded-xl"></div>
                <div className="aspect-square bg-muted animate-pulse rounded-xl"></div>
            </div>
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
            <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
        </div>
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
                <div className="container px-4 md:px-6 py-10 md:py-12">
                    <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                        {/* Hero Section */}
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI-Powered Fusion Studio
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                AI Fusion Generator
                                <br />
                                Create Anime & Character Fusions Instantly
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Advanced AI fusion technology to merge any two images. Supports characters, animals, and custom photos with professional results.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Button asChild className="h-10 px-4 py-2">
                                    <Link href="#fusion-studio" aria-label="Start creating AI fusions">Start Fusing</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-10 px-4 py-2">
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

                        {/* Features Grid */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="border-2 shadow-sm">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Wand2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">AI-Powered Blending</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Deep learning algorithms analyze and merge images intelligently.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-2 shadow-sm">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Instant Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Generate professional-quality fusions in seconds, not hours.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-2 shadow-sm">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Multiple Styles</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Choose from balanced, artistic, or realistic fusion styles.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Example Fusions Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Example AI Fusions</h3>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                Explore stunning examples created with our AI fusion generator. From Dragon Ball character combinations to Pokemon hybrids, see what's possible with advanced AI image fusion technology.
                            </p>

                            <div className="grid gap-6 sm:grid-cols-2">
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
                                    <Card key={i} className="border-2 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="space-y-3">
                                                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border">
                                                    <Image
                                                        src="/images/fusion-generator-logo.svg"
                                                        alt={`AI Fusion Example: ${item.left} and ${item.right} from ${item.series} - ${item.desc}`}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                                        loading="lazy"
                                                        className="object-cover p-8 opacity-70"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{item.left} × {item.right}</p>
                                                    <p className="font-semibold text-lg">{item.series} Fusion</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
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
                                Ready to create amazing AI fusions?
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <Button asChild className="h-10 px-4 py-2">
                                    <Link href="/pricing" aria-label="View pricing plans and get started">Get Started</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-10 px-4 py-2">
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
