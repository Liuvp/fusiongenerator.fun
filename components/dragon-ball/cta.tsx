import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DBCTA() {
    return (
        <div className="space-y-8">
            {/* Internal Link to AI Fusion */}
            <Card className="border-2 bg-muted/50">
                <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-3">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Beyond Dragon Ball
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                        Want to fuse characters beyond Dragon Ball?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Try our <Link href="/ai" className="text-primary hover:underline font-medium">AI Fusion Generator</Link> to merge anime characters, photos, and custom artwork.
                    </p>
                </CardContent>
            </Card>

            {/* Original CTA */}
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
        </div>
    );
}
