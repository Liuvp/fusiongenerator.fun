import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";
import Link from "next/link";

export const FAQ_DATA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            "name": "Can I create custom character fusions with my own images?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. You can upload any two images and generate a custom fusion using our AI-powered fusion tools.",
            },
        },
        {
            "@type": "Question",
            "name": "What’s the difference between Dragon Ball Fusion and AI Fusion?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Dragon Ball Fusion is designed for Dragon Ball characters, while AI Fusion allows you to combine any images for more flexible creations.",
            },
        },
        {
            "@type": "Question",
            "name": "How long does it take to generate a fusion image?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most fusion images are generated within seconds, depending on image complexity and system load.",
            },
        },
        {
            "@type": "Question",
            "name": "Can I use fusion images for commercial projects?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Commercial usage is available on paid plans. Please ensure compliance with applicable intellectual property laws.",
            },
        },
        {
            "@type": "Question",
            "name": "Do I need an account to use Fusion Generator?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No account is required to try Fusion Generator. Creating an account unlocks additional features.",
            },
        },
    ],
};

export function FAQ() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-4xl">
                <Script
                    id="home-faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_DATA) }}
                />

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">Answers to common questions about creating character fusions with AI</p>
                </div>

                <Card className="border-2 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        {FAQ_DATA.mainEntity.map((item, index) => (
                            <div key={index} className="space-y-2 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                <div className="font-bold text-lg text-gray-900">{item.name}</div>
                                <div
                                    className="text-gray-600 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: item.acceptedAnswer.text }}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 联系方式提示 */}
                <div className="mt-12 p-6 bg-purple-50 rounded-xl border border-purple-100 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-700">
                        Didn't find the answer you were looking for? <Link href="/contact" className="text-purple-600 hover:underline font-medium">Contact our support team</Link>.
                    </p>
                </div>
            </div>
        </section>
    );
}
