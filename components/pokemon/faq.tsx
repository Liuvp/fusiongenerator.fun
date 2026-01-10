import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function PokeFAQ() {
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
                    text: "You can create 3 free fusions per day. Sharing your creation on social media unlocks bonus fusion attempts.",
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
