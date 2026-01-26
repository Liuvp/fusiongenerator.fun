import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function DBHero() {
    return (
        <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                    Dragon Ball Fusion Studio
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Dragon Ball Z (DBZ) Fusion Generator
                    <br />
                    Create Goku & Vegeta Fusions
                </h1>
                <p className="text-lg text-muted-foreground">
                    Use our Dragon Ball Fusion Generator to combine Goku, Vegeta, and all DBZ characters. Create Super Saiyan fusions instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="h-10 px-4 py-2">
                        <Link href="#fusion-studio">Start Fusing</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 px-4 py-2">
                        <Link href="/gallery">View Gallery</Link>
                    </Button>
                </div>
            </div>
            <div className="relative w-full h-[260px] md:h-[360px]">
                <Image
                    src="/images/dragon-ball-fusion-preview-goku-vegeta.webp"
                    alt="Dragon Ball Z fusion example showing combined Goku and Vegeta characters"
                    fill
                    className="object-contain"
                    priority={true}
                    loading="eager"
                    fetchPriority="high"
                />
            </div>
        </div>
    );
}
