import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function PokeHero() {
    return (
        <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-100 text-blue-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Infinite Pokemon Fusion Generator
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Pokemon Fusion Generator
                    <br />
                    Create Epic Infinite Fusions
                </h1>
                <p className="text-lg text-muted-foreground">
                    Instantly create infinite Pokemon fusions! Mix Pikachu, Charizard, Mewtwo, and more to discover new species.
                    Use our free <strong>Pokemon fusion generator online</strong> to create stunning <strong>Pokemon fusion images</strong> in seconds.
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
                    src="/images/fusion-generator-logo.svg"
                    alt="Pokemon Fusion Generator Preview - Infinite Combinations"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
