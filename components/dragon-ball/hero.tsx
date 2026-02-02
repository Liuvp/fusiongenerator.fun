import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function DBHero() {
    return (
        <section
            className="grid gap-8 md:grid-cols-2 items-center"
            aria-labelledby="dragon-ball-fusion-title"
            role="region"
        >
            <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" />
                    Dragon Ball Fusion Studio
                </div>
                <h1
                    id="dragon-ball-fusion-title"
                    className="text-4xl font-bold tracking-tight sm:text-5xl"
                >
                    Dragon Ball Z (DBZ) Fusion Generator
                    <br />
                    Create Goku & Vegeta Fusions
                </h1>
                <p className="text-lg text-muted-foreground">
                    Use our Dragon Ball Fusion Generator to combine Goku, Vegeta, and all DBZ characters. Create Super Saiyan fusions instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="h-10 px-4 py-2">
                        <Link href="#fusion-studio" aria-label="Start Dragon Ball fusion generator">
                            Start Fusing
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 px-4 py-2">
                        <Link href="/gallery" aria-label="View Dragon Ball fusion gallery">
                            View Gallery
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="relative w-full flex items-center justify-center">
                <Image
                    src="/images/dragon-ball-fusion-preview-goku-vegeta.webp"
                    alt="Dragon Ball Z fusion example showing combined Goku and Vegeta characters"
                    width={665}
                    height={499}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 665px"
                    className="w-full h-auto"
                />
            </div>
        </section>
    );
}
