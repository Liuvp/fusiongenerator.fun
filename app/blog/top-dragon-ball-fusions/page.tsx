import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Top 10 Dragon Ball Fusions You Must Try | Fusion Generator",
    description: "Discover the most powerful and iconic Dragon Ball character fusions. From Gogeta to Vegito, explore the best combinations for our Fusion Generator.",
    alternates: {
        canonical: "/blog/top-dragon-ball-fusions",
    },
};

export default function TopDragonBallFusionsPage() {
    return (
        <article className="container max-w-4xl py-12 px-4 md:px-6">
            <div className="mb-8">
                <Button asChild variant="ghost" className="pl-0 hover:bg-transparent text-primary mb-4">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </Button>
                <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    Dragon Ball
                </span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">
                    Top 10 Dragon Ball Fusions You Must Try
                </h1>
                <div className="mt-4 flex items-center text-muted-foreground">
                    <span>January 10, 2026</span>
                    <span className="mx-2">•</span>
                    <span>5 min read</span>
                </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                <p className="lead text-xl">
                    Fusion is one of the most exciting concepts in the Dragon Ball universe. Whether it’s the Metamoran Fusion Dance or the Potara Earrings, combining two warriors creates a fighter with immense power and a cool new look. Here are the top 10 fusions you can recreate or reimagine with our <strong>Fusion Generator</strong>.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Gogeta (Goku + Vegeta)</h2>
                <p>
                    The result of the Fusion Dance between Goku and Vegeta. Gogeta is a fan favorite for his serious demeanor in Dragon Ball Z: Fusion Reborn and his confident swagger in Dragon Ball GT and Dragon Ball Super: Broly.
                </p>
                <div className="my-6 p-4 bg-gray-50 border rounded-lg">
                    <strong>Fusion Tip:</strong> Try mixing their Super Saiyan Blue forms in our generator for an intense aura effect.
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Vegito (Vegeta + Goku)</h2>
                <p>
                    Formed via the Potara Earrings, Vegito is the rival to Gogeta. He combines Vegeta’s tactical genius with Goku’s combat ingenuity.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Gotenks (Goten + Trunks)</h2>
                <p>
                    The playful and arrogant fusion of Goten and Trunks. Gotenks is known for his bizarre attacks like the Super Ghost Kamikaze Attack.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Zamasu (Goku Black + Future Zamasu)</h2>
                <p>
                    A terrifying Potara fusion of two versions of the same being. Merged Zamasu possesses immortality and immense divine power.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Kefla (Kale + Caulifla)</h2>
                <p>
                    The powerhouse female Saiyan fusion from Universe 6. Kefla proved to be a match for Goku even in his Ultra Instinct Omen form.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Piccolo (Namekian Fusion)</h2>
                <p>
                    While not a traditional "fusion," Piccolo’s assimilation of Nail and Kami vastly increased his power, making him relevant against Frieza and the Androids.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Fused Android 13</h2>
                <p>
                    Android 13 absorbs the components of Androids 14 and 15 to become "Super Android 13," turning blue and muscular with wild orange hair.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">8. Tiencha (Tien + Yamcha)</h2>
                <p>
                    A "what-if" fusion from the Budokai 2 game. This unlikely pairing shows that even Earthlings can tap into fusion power (with hilarious results).
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">9. Karoly (Goku + Broly)</h2>
                <p>
                    Exclusive to Dragon Ball Fusions, this combines the Legendary Super Saiyan Broly with Kakarot (Goku). A terrifying mix of raw power.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">10. Majin Satan (Majin Buu + Hercule)</h2>
                <p>
                    Another funny "what-if." Imagine the chaotic energy of Majin Buu mixed with the showmanship of Mr. Satan!
                </p>

                <hr className="my-8" />

                <h3 className="text-xl font-bold mb-4">Ready to Create Your Own?</h3>
                <p>
                    You don’t need earrings or a dance to fuse characters anymore. Use our <strong>AI Fusion Generator</strong> to mix and match any Dragon Ball characters—or even cross them over with other universes like Pokémon!
                </p>

                <div className="mt-8 flex gap-4">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/dragon-ball">Try Dragon Ball Fusion</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/ai">Custom AI Fusion</Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}
