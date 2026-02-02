import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export function DBFAQ() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is this Dragon Ball Fusion Generator official or affiliated with Toei Animation?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. This Dragon Ball Fusion Generator is a fan-made, AI-powered creative tool. It is not affiliated with, endorsed by, or connected to Toei Animation, Shueisha, or the official Dragon Ball franchise. It is designed purely for creative and entertainment purposes for fans."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need to upload images or do you store my data?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No upload is necessary. You select characters directly from our provided roster of legendary fighters. We do not store personal photos. Generated fusion images are processed in real-time and are not linked to your personal identity."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between Gogeta and Vegito fusions here?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI understands the visual legacy of both. Fusion Dance (Gogeta) styles focus on balanced proportions and athletic energy, while Potara (Vegito) styles emphasize sharp contrast, iconic earrings, and an aggressive Ki silhouette."
                }
            },
            {
                "@type": "Question",
                "name": "How is this different from other Dragon Ball fusion generators?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike basic image mashups, our generator uses advanced AI optimized for Dragon Ball's specific art style—focusing on canonical hair geometry, aura physics, and outfit blending rather than just overlapping sprites."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use generated Dragon Ball fusions commercially?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Generated images are for personal and fan use only. As Dragon Ball characters are copyrighted property of their respective owners, we do not recommend using these results for commercial purposes."
                }
            },
            {
                "@type": "Question",
                "name": "How many free fusions do I get and does it work on mobile?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Visitors get one free trial fusion without login. Registered users use a credit system. The studio is fully responsive and works perfectly on mobile browsers like Chrome and Safari."
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

            <section className="space-y-6" aria-labelledby="faq-title">
                <header className="space-y-2 border-l-4 border-orange-500 pl-4">
                    <h2 id="faq-title" className="text-2xl font-bold text-gray-900">
                        Dragon Ball Fusion Generator FAQ
                    </h2>
                    <p className="text-muted-foreground text-base">
                        Essential information about our fan-made Dragon Ball tool, privacy, and usage
                    </p>
                </header>

                <Card className="border-2 shadow-sm bg-gradient-to-b from-white to-gray-50/30">
                    <CardContent className="p-6">
                        <dl className="space-y-8">
                            {faqSchema.mainEntity.map((item, index) => (
                                <div key={index} className="space-y-3 group">
                                    <dt className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors flex items-start gap-2">
                                        <span className="text-orange-500 font-black" aria-hidden="true">Q:</span>
                                        {item.name}
                                    </dt>
                                    <dd className="flex gap-2 pl-6">
                                        <span className="text-blue-500 font-black flex-shrink-0" aria-hidden="true">A:</span>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.acceptedAnswer.text}
                                        </p>
                                    </dd>
                                    {index < faqSchema.mainEntity.length - 1 && (
                                        <div className="h-px bg-gray-100 mt-6" aria-hidden="true" />
                                    )}
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
