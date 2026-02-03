import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Wand2, Shield, Flame } from "lucide-react";
import Script from "next/script";
import StaticFusionStudio from './components/StaticFusionStudio';
import FusionStudioWrapper from './components/FusionStudioWrapper';

// 移除原有的 nextDynamic，改用包装器以符合 Next.js App Router 的 SSR 规则

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
    title: "AI Fusion Generator – Merge Any Two Images with AI",
    description: "Use our AI Fusion Generator to seamlessly merge any two images online. Create realistic, artistic, or balanced AI image fusions instantly and for free.",
    alternates: { canonical: "https://fusiongenerator.fun/ai" },
    openGraph: {
        title: "AI Fusion Generator – Merge Any Two Images with AI",
        description: "Merge any two images with our free AI Fusion Generator. Fast, high-quality, and style-aware AI image fusion online.",
        url: "https://fusiongenerator.fun/ai",
        type: "website",
        images: [
            {
                url: "/images/character-fusion-mashup-ai-generator.webp",
                width: 1200,
                height: 630,
                alt: "AI Fusion Generator example showing AI image fusion result",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Fusion Generator – Merge Any Two Images with AI",
        description: "Merge any two images with our free AI Fusion Generator. Create professional, artistic, and realistic AI image fusions online.",
        images: ["/images/character-fusion-mashup-ai-generator.webp"],
    },
};

export default function AIFusionPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What types of images work best with the AI Fusion Generator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "High-resolution images with clear subjects work best. Avoid blurry or low-light images. For optimal results, try images with distinct characters or objects, so the AI can recognize and merge features effectively."
                }
            },
            {
                "@type": "Question",
                "name": "Can I control the fusion style or result?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can choose from multiple fusion styles such as Balanced, Artistic, or Realistic. Each style influences how the AI blends colors, textures, and features of the original images, giving you more creative control."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use the generated images for commercial projects?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You may use AI-generated images for personal or commercial projects, but please respect copyright laws if your input images include copyrighted characters. Consider creating original characters for unrestricted use."
                }
            },
            {
                "@type": "Question",
                "name": "Is the AI Fusion Generator really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can create AI fusions for free with basic features. Some advanced options and higher-resolution outputs may require a premium plan, which you can view on our Pricing page."
                }
            },
            {
                "@type": "Question",
                "name": "How can I improve the fusion quality?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use clear, high-quality images with similar art styles or lighting. Avoid overly complex backgrounds, and consider cropping images to focus on key subjects. Experiment with different fusion styles for the best effect."
                }
            },
            {
                "@type": "Question",
                "name": "Can I fuse more than two images?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Currently, our generator works best with two images at a time. For multiple images, you can merge them sequentially—create one fusion, then merge it with another image to achieve multi-source combinations."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a way to generate images with transparent backgrounds?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our AI supports transparent backgrounds for certain output formats. Choose the 'Transparent' option when generating the fusion to remove the background automatically."
                }
            }
        ]
    };

    const softwareAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "AI Fusion Generator",
        description: "AI-powered software to merge any two images into a seamless fusion. Supports photos, illustrations, and creative artwork using advanced AI image fusion technology.",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: "https://fusiongenerator.fun/ai",
        image: "https://fusiongenerator.fun/images/character-fusion-mashup-ai-generator.webp",
        author: { "@type": "Organization", name: "FusionGenerator", url: "https://fusiongenerator.fun" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
        featureList: [
            "General-Purpose AI Image Fusion",
            "Photo & Illustration Merging",
            "Style-Aware Blending Technology",
            "Real-Time Processing"
        ],
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://fusiongenerator.fun/" },
            { "@type": "ListItem", position: 2, name: "AI Fusion Generator", item: "https://fusiongenerator.fun/ai" },
        ],
    };

    const howToJsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Merge Images with the AI Fusion Generator",
        description: "A simple guide to creating your first AI image fusion for free in minutes.",
        totalTime: "PT2M",
        step: [
            { "@type": "HowToStep", position: 1, name: "Upload Your Images", text: "Click the upload areas in the fusion studio to select two clear images from your device.", image: "https://fusiongenerator.fun/images/character-fusion-mashup-ai-generator.webp" },
            { "@type": "HowToStep", position: 2, name: "Adjust Settings (Optional)", text: "Select your preferred fusion style (Balanced, Artistic, Realistic) for different visual outcomes.", image: "https://fusiongenerator.fun/images/character-fusion-mashup-ai-generator.webp" },
            { "@type": "HowToStep", position: 3, name: "Generate & Download", text: "Click the 'Generate Fusion' button. Once processed, download your high-quality, watermark-free result.", image: "https://fusiongenerator.fun/images/character-fusion-mashup-ai-generator.webp" },
        ],
    };

    const webPageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "AI Fusion Generator - Free Online Tool & Complete Guide",
        description: "Master AI image fusion with our comprehensive tool. Create unique character combinations and artistic blends using advanced deep learning technology.",
        url: "https://fusiongenerator.fun/ai",
        mainEntity: {
            ...softwareAppJsonLd,
            "@context": undefined // 嵌套对象不需要 context
        },
    };

    const exampleFusions = [
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
    ];

    return (
        <>
            <Script
                id="ai-fusion-combined-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, softwareAppJsonLd, breadcrumbJsonLd, howToJsonLd, webPageJsonLd]) }}
            />

            <div id="main-content" className="min-h-screen bg-background">
                <div className="container px-4 sm:px-6 py-8 sm:py-12">
                    <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 md:space-y-16">

                        {/* Hero Section */}
                        <section className="text-center space-y-4 sm:space-y-6" role="region" aria-labelledby="hero-title">
                            <div className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary font-medium">
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" focusable="false" />
                                AI-Powered Fusion Studio
                            </div>
                            <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                                AI Fusion Generator
                                <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-muted-foreground font-semibold">
                                    Merge Any Two Images with AI
                                </span>
                            </h1>
                            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-xl overflow-hidden shadow-2xl my-6 bg-muted group">
                                <Image
                                    src="/images/character-fusion-mashup-ai-generator.webp"
                                    alt="AI Fusion Generator example: Seamlessly merging two images into a high-quality creative output"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                    fetchPriority="high"
                                    decoding="async"
                                    quality={85}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
                                Advanced AI fusion technology to merge any two images. Supports photos, illustrations, and custom artwork with professional, watermark-free results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
                                <Button asChild className="h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="#fusion-studio" aria-label="Start using the AI fusion tool now">Start Fusing</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 sm:h-11 px-6 text-base sm:text-sm rounded-xl">
                                    <Link href="/gallery" aria-label="View our gallery of community AI fusions">View Gallery</Link>
                                </Button>
                            </div>
                        </section>

                        {/* AI Fusion Studio Section */}
                        <FusionStudioWrapper />
                        {/* About Section */}
                        <section className="space-y-6" role="region" aria-labelledby="about-title">
                            <h2 id="about-title" className="text-2xl font-bold border-l-4 border-primary pl-4">About Our AI Fusion Generator</h2>
                            <div className="space-y-4">
                                <p className="text-gray-600 text-base leading-relaxed">
                                    Our <strong>AI Fusion Generator</strong> uses advanced deep learning to analyze visual structure, colors, and features from two images and generate a seamless, high-quality fusion result. Unlike simple overlays, our technology understands <strong>style-aware blending</strong>.
                                </p>
                                <p className="text-gray-600 text-base leading-relaxed">
                                    Whether you are looking to create unique anime mashups, character variations, or experimental digital art, our <strong>AI image fusion</strong> tool provides the flexibility you need. Explore specialized tools for Dragon Ball, Pokemon, and more.
                                </p>
                            </div>
                        </section>

                        {/* Features Grid */}
                        <section className="space-y-8" role="region" aria-labelledby="features-title">
                            <h3 id="features-title" className="text-xl sm:text-2xl font-bold text-center sm:text-left">Why Choose Our AI Fusion</h3>
                            <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                                {[
                                    { icon: Wand2, title: "AI-Powered Blending", desc: "Deep learning algorithms analyze and merge images intelligently.", color: "text-primary", bg: "bg-primary/10" },
                                    { icon: Zap, title: "Instant Results", desc: "Generate professional-quality fusions in seconds, not hours.", color: "text-secondary", bg: "bg-secondary/10" },
                                    { icon: Sparkles, title: "Multiple Styles", desc: "Choose from balanced, artistic, or realistic fusion styles.", color: "text-amber-500", bg: "bg-amber-500/10" }
                                ].map((feature, i) => (
                                    <Card key={i} className="border-2 shadow-sm flex-shrink-0 w-[280px] sm:w-auto snap-start hover:border-primary/20 transition-colors">
                                        <CardHeader className="pb-2">
                                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-3 shadow-sm`}>
                                                <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} aria-hidden="true" focusable="false" />
                                            </div>
                                            <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 text-center sm:hidden" aria-hidden="true">
                                ← Swipe to see more →
                            </p>
                        </section>

                        {/* Example Fusions Section */}
                        <section className="space-y-6" role="region" aria-labelledby="examples-title">
                            <h3 id="examples-title" className="text-xl sm:text-2xl font-bold">Example AI Fusions</h3>
                            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                                Explore stunning examples created with our engine. From character combinations to creative artwork blends, see what's possible with just two clicks.
                            </p>
                            <div
                                className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl"
                                role="list"
                                aria-label="Example fusions gallery"
                                tabIndex={0}
                            >
                                {exampleFusions.map((item, i) => (
                                    <Card key={i} role="listitem" className="border-2 shadow-sm flex-shrink-0 w-[260px] sm:w-auto snap-start bg-card/50 backdrop-blur-sm overflow-hidden group">
                                        <CardContent className="p-0">
                                            <div className="space-y-0">
                                                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={`AI Fusion Example: ${item.left} + ${item.right} in ${item.series} style. ${item.desc}`}
                                                        fill
                                                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 480px, 450px"
                                                        quality={70}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div className="p-4 sm:p-5">
                                                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{item.left} × {item.right}</p>
                                                    <p className="font-bold text-lg text-gray-900">{item.series} Fusion</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 text-center sm:hidden" aria-hidden="true">
                                ← Swipe to see more examples →
                            </p>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-8" role="region" aria-labelledby="faq-title">
                            <header className="space-y-2 border-l-4 border-secondary pl-4">
                                <h3 id="faq-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Frequently Asked Questions
                                </h3>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    Common questions about our AI-powered image fusion technology
                                </p>
                            </header>
                            <Card className="border-2 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <dl className="divide-y divide-gray-100">
                                        {faqSchema.mainEntity.map((item, index) => (
                                            <div key={index} className="p-5 sm:p-6 space-y-2 group">
                                                <dt className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors flex items-start gap-2">
                                                    <span className="text-primary font-black" aria-hidden="true">Q:</span>
                                                    {item.name}
                                                </dt>
                                                <dd className="flex gap-2 pl-6">
                                                    <span className="text-orange-600 font-black flex-shrink-0" aria-hidden="true">A:</span>
                                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                                        {item.acceptedAnswer.text}
                                                    </p>
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Bottom CTA */}
                        <section className="text-center space-y-6 px-4 sm:px-0 py-8" role="region" aria-label="Call to action">
                            <div className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm bg-primary/10 text-primary font-medium">
                                <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" focusable="false" />
                                Ready to create amazing AI fusions?
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">Start Your AI Fusion Journey Today</h4>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Button asChild className="w-full sm:w-auto h-12 sm:h-11 px-8 text-base sm:text-sm rounded-xl shadow-lg shadow-primary/20">
                                    <Link href="#fusion-studio" aria-label="Go to the fusion studio to start creating">
                                        Start Fusing Now
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto h-12 sm:h-11 px-8 text-base sm:text-sm rounded-xl hover:bg-muted">
                                    <Link href="/pricing" aria-label="View pricing plans for unlimited AI generation">
                                        View Premium Plans
                                    </Link>
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
