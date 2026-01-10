import { Metadata } from "next";
import { DBHero } from "@/components/dragon-ball/hero";
import { DBFusionStudio } from "@/components/dragon-ball/fusion-studio";
import { DBHowToUse } from "@/components/dragon-ball/how-to-use";
import { DBPopularFusions } from "@/components/dragon-ball/popular-fusions";
import { DBFeatures } from "@/components/dragon-ball/features";
import { DBFAQ } from "@/components/dragon-ball/faq";
import { DBCTA } from "@/components/dragon-ball/cta";

export const metadata: Metadata = {
  title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
  description:
    "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
  alternates: {
    canonical: "/dragon-ball",
  },
  openGraph: {
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description:
      "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    url: "https://fusiongenerator.fun/dragon-ball",
    type: "website",
    images: [
      {
        url: "/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.png",
        width: 1200,
        height: 630,
        alt: "Dragon Ball Fusion Generator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ball Fusion Generator – Goku & Vegeta AI Fusions",
    description: "Instantly create Dragon Ball fusions like Goku & Vegeta with our free AI tool. Fun, fast, and easy-to-use DBZ fusion generator for fans!",
    images: ["/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.png"],
  },
};

export default function DragonBallPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          <DBHero />
          <DBFusionStudio />
          <DBHowToUse />
          <DBPopularFusions />
          <DBFeatures />
          <DBFAQ />
          <DBCTA />
        </div>
      </div>
    </div>
  );
}
