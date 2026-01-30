import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export const FAQ_DATA = {
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
                "text": "We feature a curated collection of iconic Pokemon across generations, including fan-favorites like Charizard, Mewtwo, and Lucario.",
            },
        },
        {
            "@type": "Question",
            "name": "Can I fuse Legendary Pokémon?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our roster includes powerful Legendary and Mythical Pokémon for you to combine.",
            },
        },
        {
            "@type": "Question",
            "name": "Can I create Shiny fusions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Simply select the 'Custom' style and add the word 'Shiny' to your prompt description.",
            },
        },
        {
            "@type": "Question",
            "name": "Is this similar to Pokémon Infinite Fusion?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our tool is inspired by the popular fan concept of Pokémon Infinite Fusion. While the original project focuses on sprite-based fusions, our AI-powered generator creates <strong>high-quality visual fusions</strong> with realistic blending, color mixing, and detailed features. <a href='/blog/pokemon-fusion-technology' class='text-blue-600 hover:text-blue-800 underline font-medium'>Learn how our AI fusion technology works →</a>",
            },
        },
    ],
};

export function PokeFAQ() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">FAQ</h3>
            <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-6">
                    {FAQ_DATA.mainEntity.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="font-semibold">{item.name}</div>
                            <div
                                className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: item.acceptedAnswer.text }}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

    );
}
