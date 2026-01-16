import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function DBFAQ() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What happens to my uploaded photos?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We do not store your original uploads. They are processed to create your fusion and deleted after completion. Only the final fusion result may be stored for sharing.",
                },
            },
            {
                "@type": "Question",
                name: "Can I fuse two animals or objects?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The more creative, the better. Try a cat + dog or coffee cup + laptop to craft a fun Z-Fighter.",
                },
            },
            {
                "@type": "Question",
                name: "Can I mix a real person with an anime character?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The AI supports anime character fusion, including Dragon Ball, Pokemon, and other popular anime styles. Upload a photo of yourself and a character image to see a hybrid Saiyan form.",
                },
            },
            {
                "@type": "Question",
                name: "How many fusions can I create for free?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can create 3 free fusions per day. Sharing results on social platforms may grant extra attempts.",
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
                    <CardContent className="p-6 space-y-4">
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
