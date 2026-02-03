import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function DBPopularFusions() {
    const fusions = [
        {
            left: "Goku",
            right: "Vegeta",
            name: "Gogeta Variant",
            image: "/images/goku-vegeta-gogeta-fusion-avatar.webp",
            alt: "Gogeta fusion avatar combining Goku and Vegeta Dragon Ball Z characters"
        },
        {
            left: "Vegeta",
            right: "Piccolo",
            name: "Tactical Powerhouse",
            image: "/images/vegeta-piccolo-potara-fusion.webp",
            alt: "Vegeta and Piccolo Potara fusion with Supreme Kai earrings and combined powers"
        },
        {
            left: "Frieza",
            right: "Majin Buu",
            name: "Tyrant & Magic",
            image: "/images/frieza-majin-buu-fusion.webp",
            alt: "Frieza and Majin Buu fusion - Galactic tyrant meets magical being"
        },
        {
            left: "Android 18",
            right: "Krillin",
            name: "Battle Couple",
            image: "/images/android18-krillin-couple-fusion.webp",
            alt: "Android 18 and Krillin couple fusion - Cyborg meets Earth's strongest human"
        },
    ];

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Popular Dragon Ball Fusions",
        "itemListElement": fusions.map((fusion, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": `Dragon Ball Fusion: ${fusion.left} × ${fusion.right} - ${fusion.name}`,
            "image": `https://fusiongenerator.fun${fusion.image}`
        }))
    };

    return (
        <section className="space-y-6">
            {/* JSON-LD */}
            <Script
                id="popular-fusions-json-ld"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />

            <header className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-500 pl-4">Popular Dragon Ball Fusions</h2>
                <p className="text-muted-foreground text-base leading-relaxed pl-4">
                    Explore top fan-favorite Dragon Ball fusions like Gogeta and Vegito, optimized for AI generation. Each fusion preserves iconic hairstyles, aura colors, and dynamic poses.
                </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2">
                {fusions.map((fusion, i) => (
                    <Card key={i} className="group border-2 shadow-sm transition-all duration-300 overflow-hidden">
                        <CardContent className="p-6 bg-white">
                            <article className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                        {fusion.left} × {fusion.right}
                                    </p>
                                    <h3 className="block font-black text-xl text-gray-900">
                                        {fusion.name}
                                    </h3>
                                    <div className="h-0.5 w-8 bg-blue-500/30" />
                                </div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full overflow-hidden border shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src={fusion.image}
                                        alt={fusion.alt}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                            </article>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
