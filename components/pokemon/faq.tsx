import { Card, CardContent } from "@/components/ui/card";

export const FAQ_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this Pokemon Fusion Generator free and online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This is a free online Pokemon Fusion Generator that works directly in your browser with no download required.",
      },
    },
    {
      "@type": "Question",
      name: "Does this Pokemon Fusion Generator support Gen 1-9 styles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The generator is designed for Gen 1-9 inspired fusion styles, including classic and modern Pokemon visual traits.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this as a Pokemon combiner or merger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If you search for a Pokemon combiner or Pokemon merger, this tool covers the same intent and adds cleaner AI-powered blending.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Pokemon Infinite Fusion and this generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pokemon Infinite Fusion is known for sprite-style combinations, while this generator creates AI-based fusion images with smoother blending and flexible style output.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate HD Pokemon fusion images for download?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After generation, you can download high-quality Pokemon fusion images and use them for sharing or inspiration.",
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
