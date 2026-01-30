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
                        Smartly combines physical traits, color palettes, and distinctive features using advanced generative AI.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Elemental Fusion</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Seamlessly merges elemental effects like flames, water, and lightning into a cohesive new design.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Multi-Style Generation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Create fusions in various artistic styles, from realistic 3D renders to classic anime aesthetics.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
