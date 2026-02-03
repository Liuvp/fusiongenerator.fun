import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Flame } from "lucide-react";
import Script from "next/script";

export function DBFeatures() {
    const features = [
        {
            icon: Zap,
            title: "Dragon Ball Fusion Technology",
            description:
                "Advanced DBZ fusion algorithms for authentic Dragon Ball character combinations. Our AI blends silhouettes, colors, and iconic visual motifs.",
            ariaLabel: "Dragon Ball Fusion Technology Icon",
            color: "text-amber-500",
            bg: "bg-amber-100"
        },
        {
            icon: Shield,
            title: "Fusion Balance",
            description:
                "Balance heritage, rivalry, and personality to achieve authentic Dragon Ball fusion results. Ensures power scaling and aesthetic consistency.",
            ariaLabel: "Fusion Balance Icon",
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
        {
            icon: Flame,
            title: "Visual Motifs",
            description:
                "Outfits, spiky hair, and aura colors combine to deliver striking, anime-accurate visuals for all Dragon Ball fusions.",
            ariaLabel: "Visual Motifs Icon",
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
    ];

    const featuresJsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWorkSeries",
        "name": "Dragon Ball Fusion Generator Features",
        "hasPart": features.map((feature, i) => ({
            "@type": "CreativeWork",
            "position": i + 1,
            "name": feature.title,
            "description": feature.description
        }))
    };

    return (
        <section className="grid gap-6 md:grid-cols-3 py-4">
            {/* JSON-LD */}
            <Script
                id="db-features-json-ld"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresJsonLd) }}
            />

            {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                    <Card
                        key={i}
                        className="group border-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-500/20 bg-gradient-to-b from-white to-gray-50/50"
                    >
                        <CardHeader>
                            <div
                                className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                                role="img"
                                aria-label={feature.ariaLabel}
                            >
                                <Icon className={`h-7 w-7 ${feature.color}`} aria-hidden="true" focusable="false" />
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {feature.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}
