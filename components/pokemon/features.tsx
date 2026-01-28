import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Palette, Leaf } from "lucide-react";

export function PokeFeatures() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Palette className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Visual Trait Fusion</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Combine colors, patterns, and physical characteristics seamlessly using AI analysis of original sprites.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Type & Ability Mixing</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Blend elemental types, abilities, and battle stats intelligently to create viable competitive fusions.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Evolution Science</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Create biologically plausible Pokemon hybrids with generated Pokedex lore and evolutionary backstories.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
