import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Design Tips: How to Create Perfect Character Fusions | Fusion Generator",
    description: "Master the art of character fusion. Learn design principles, color theory, and tips to make your Dragon Ball and Pokemon fusions look professional.",
    alternates: {
        canonical: "/blog/fusion-design-tips",
    },
};

export default function FusionDesignTipsPage() {
    return (
        <article className="container max-w-4xl py-12 px-4 md:px-6">
            <div className="mb-8">
                <Button asChild variant="ghost" className="pl-0 hover:bg-transparent text-primary mb-4">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </Button>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Design Guide
                </span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">
                    Design Tips: How to Create Perfect Character Fusions
                </h1>
                <div className="mt-4 flex items-center text-muted-foreground">
                    <span>January 10, 2026</span>
                    <span className="mx-2">•</span>
                    <span>6 min read</span>
                </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                <p className="lead text-xl">
                    Creating a great fusion isn't just about smashing two characters together. It's about finding harmony between their designs. Whether you're drawing by hand or using our <strong>Fusion Generator</strong>, these principles will help you create standout characters.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. The 70/30 Rule</h2>
                <p>
                    A balanced fusion shouldn't be exactly 50% of each character—that often looks messy. Instead, aim for a <strong>70/30 split</strong>:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Dominant Character (70%):</strong> Provides the body shape, silhouette, and primary distinguishing features.</li>
                    <li><strong>Secondary Character (30%):</strong> Provides the color palette, clothing details, and specific accessories (like a weapon or hat).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Color Theory in Fusion</h2>
                <p>
                    Colors are the first thing viewers notice. You have three main options for color fusion:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Blend:</strong> Mix the colors (e.g., Red + Blue = Purple outfit). Good for energy auras.</li>
                    <li><strong>Contrast:</strong> Keep the main colors separate to show duality (e.g., Vegito's orange undershirt vs blue tunic).</li>
                    <li><strong>Swap:</strong> Apply Character A's colors to Character B's design elements. This is very common in Pokemon fusions.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Silhouette is King</h2>
                <p>
                    If you blacked out your character, would it still be recognizable? A good fusion should have a unique silhouette.
                </p>
                <p>
                    <em>Example:</em> If fusing Goku and Frieza, combining Goku's spiky hair with Frieza's smooth tail creates a distinctive outline that screams "Fusion."
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Narrative Consistency</h2>
                <p>
                    Ask yourself: <em>Why</em> are these characters fusing?
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Power:</strong> If they fit for combat, emphasize muscles, armor, and weapons.</li>
                    <li><strong>Humor:</strong> If it's a joke fusion (like Mr. Satan), exaggerate the silly features.</li>
                    <li><strong>Horror:</strong> Some fusions are meant to be scary. Lean into the "uncanny valley" effect.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Using the AI Generator</h2>
                <p>
                    When using our AI tool, you can guide the design with your prompts:
                </p>
                <div className="p-4 bg-gray-100 rounded-md font-mono text-sm">
                    "Fusion of Goku and Ironman, anime style, Goku hair but metallic red, wearing Saiyan armor with arc reactor, dramatic lighting"
                </div>
                <p className="mt-2">
                    Being specific about which traits to keep (e.g., "Goku hair", "metallic red") gives you better control over the final look.
                </p>

                <hr className="my-8" />

                <h3 className="text-xl font-bold mb-4">Start Experimenting</h3>
                <p>
                    The best way to learn is to do. Go to our generator, pick two incompatible characters, and see what happens!
                </p>

                <div className="mt-8 flex gap-4">
                    <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Link href="/ai">Create AI Fusion</Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}
