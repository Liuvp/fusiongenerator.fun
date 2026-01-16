import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function DBCTA() {
    return (
        <div className="text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Ready to Create Dragon Ball Fusions?
            </div>
            <div className="flex items-center justify-center gap-3">
                <Button asChild className="h-10 px-4 py-2">
                    <Link href="/pricing">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 px-4 py-2">
                    <Link href="/gallery">Explore Gallery</Link>
                </Button>
            </div>
        </div>
    );
}
