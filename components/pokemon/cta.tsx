import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Grid } from "lucide-react";

export function PokeCTA() {
    return (
        <div className="text-center space-y-8">
            <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ready to craft a new species?
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild className="h-10 px-4 py-2">
                        <Link href="/pricing">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 px-4 py-2">
                        <Link href="/gallery"><Grid className="mr-2 h-4 w-4" /> Explore Fusion Dex</Link>
                    </Button>
                </div>
            </div>

            <div className="pt-8 border-t max-w-2xl mx-auto">
                <p className="text-sm text-muted-foreground mb-4">You might also like:</p>
                <div className="flex justify-center">
                    <Button asChild variant="ghost" className="hover:bg-orange-100 hover:text-orange-700">
                        <Link href="/dragon-ball"><Flame className="mr-2 h-4 w-4" /> Try Dragon Ball Fusion Generator</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
