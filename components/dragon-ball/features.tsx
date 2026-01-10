import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Flame } from "lucide-react";

export function DBFeatures() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Dragon Ball Fusion Technology</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Advanced DBZ fusion algorithms for authentic Dragon Ball character combinations...
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Fusion Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Balance heritage, rivalry, and personality to achieve authentic Dragon Ball fusion results.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Flame className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Visual Motifs</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Outfits, spiky hair, and aura colors combine to deliver striking, anime-accurate visuals.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
