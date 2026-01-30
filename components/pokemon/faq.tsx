import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function PokeFAQ() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                "name": "Is the Pokemon Fusion Generator really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, 100% free with no hidden costs. No registration or payment required. You can create Pokemon fusions immediately without signing up.",
                },
            },
            {
                "@type": "Question",
                "name": "Do I need an account to use the Pokemon AI fusion tool?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No account creation needed. Our Pokemon AI fusion tool works instantly without any registration.",
                },
            },
            {
                "@type": "Question",
                "name": "Which Pokemon generations are supported?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We support all Pokemon from Generation 1 to Generation 9, including Scarlet/Violet Pokemon and regional variants.",
                },
            },
            {
                "@type": "Question",
                "name": "Can I fuse Legendary Pokémon?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can fuse any Pokémon, including Legendary and Mythical species.",
                },
            },
            {
                "@type": "Question",
                "name": "Can I create Shiny fusions?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! Enable Shiny mode manually, or let the system randomly generate one.",
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
        </>
    );
}
