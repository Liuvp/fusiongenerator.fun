import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function PokeHero() {
    return (
        <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-100 text-blue-700">
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                    Free Online Pokemon Fusion Generator
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Pokemon Fusion Generator (Gen 1-9)
                    <br />
                    Free Online AI Tool
                </h1>
                <p className="text-lg text-muted-foreground">
                    Create Pokemon fusions online for free. Combine any two Pokemon in seconds with Gen 1-9 inspired
                    styles and no download required.
                    Use our <strong>Pokemon fusion generator online</strong> to create high-quality <strong>Pokemon fusion images</strong> instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                        <Link href="#fusion-studio">Start Fusing</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 px-4 py-2">
                        <Link href="/gallery">Explore Fusion Dex</Link>
                    </Button>
                </div>
            </div>
            <div className="relative w-full h-[260px] md:h-[360px]">
                <Image
                    src="/images/pokemon-character-fusion-generator-preview.webp"
                    alt="Pokemon fusion generator result: Pikachu + Charizard (Gen 1-9 style)"
                    fill
                    className="object-contain"
                    priority={true}
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 360px"
                />
            </div>
        </div>
    );
}
