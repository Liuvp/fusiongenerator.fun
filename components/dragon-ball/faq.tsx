import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function DBFAQ() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Do I need to upload my own images to use the Dragon Ball Fusion Generator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. For the best experience, we provide a curated library of legendary Dragon Ball fighters. Simply select any two characters from our roster—like Goku, Vegeta, or Frieza—and our AI will handle the rest. You don't need to worry about image quality or background removal."
                }
            },
            {
                "@type": "Question",
                "name": "Can I fuse any Dragon Ball characters together?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can fuse any characters in our roster, including classic Saiyan duos, Namekian combinations like Piccolo and Gohan, or even creative mixes involving villains like Frieza and Majin Buu. The generator automatically adapts their iconic features to create a brand new warrior."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between Gogeta and Vegito fusions in the generator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While both result in powerful warriors, our AI understands the stylistic differences. Fusion Dance (Gogeta) results typically feature balanced traits and athletic builds, while Potara (Vegito) fusions emphasize high contrast, specific earring accessories, and a more aggressive Ki presence. The generator captures these anime-accurate motifs automatically."
                }
            },
            {
                "@type": "Question",
                "name": "How many Dragon Ball fusions can I create for free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Visitors can try one fusion for free. After that, you can sign up for a free account to receive starter credits. Standard account credits do not reset daily, while VIP daily limits reset at midnight."
                }
            },
            {
                "@type": "Question",
                "name": "Can I regenerate a fusion if I want a different result?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. If you choose the same pair of fighters and click 'FUU-SION-HA!' again, the AI will re-channel their Ki to produce a new visual variation. Each generation explores unique details in aura geometry, facial structure, and outfit blending while staying true to the Dragon Ball art style."
                }
            }
        ]
    };

    return (
        <>
            <Script
                id="dragon-ball-faq-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <section className="space-y-6">
                <header className="space-y-2 border-l-4 border-orange-500 pl-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Dragon Ball Fusion Generator FAQ
                    </h3>
                    <p className="text-muted-foreground text-base">
                        Common questions about Dragon Ball character fusion, privacy, and free usage
                    </p>
                </header>

                <Card className="border-2 shadow-sm bg-gradient-to-b from-white to-gray-50/30">
                    <CardContent className="p-6 space-y-8">
                        {faqSchema.mainEntity.map((item, index) => (
                            <div key={index} className="space-y-3 group">
                                <h4 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors flex items-start gap-2">
                                    <span className="text-orange-500 font-black">Q:</span>
                                    {item.name}
                                </h4>
                                <div className="flex gap-2 pl-6">
                                    <span className="text-blue-500 font-black flex-shrink-0">A:</span>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.acceptedAnswer.text}
                                    </p>
                                </div>
                                {index < faqSchema.mainEntity.length - 1 && (
                                    <div className="h-px bg-gray-100 mt-6" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
