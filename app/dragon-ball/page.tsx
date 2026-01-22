import { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { DBHero } from "@/components/dragon-ball/hero";
import { DBFusionStudio } from "@/components/dragon-ball/fusion-studio";

// Lazy load non-critical components to improve initial page load performance
const DBHowToUse = nextDynamic(() => import("@/components/dragon-ball/how-to-use").then(mod => mod.DBHowToUse));
const DBPopularFusions = nextDynamic(() => import("@/components/dragon-ball/popular-fusions").then(mod => mod.DBPopularFusions));
const DBFeatures = nextDynamic(() => import("@/components/dragon-ball/features").then(mod => mod.DBFeatures));
const DBFAQ = nextDynamic(() => import("@/components/dragon-ball/faq").then(mod => mod.DBFAQ));
const DBCTA = nextDynamic(() => import("@/components/dragon-ball/cta").then(mod => mod.DBCTA));

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

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
        alt: "Dragon Ball Fusion Generator preview – Goku and Vegeta fusion",
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
