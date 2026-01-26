import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function DBPopularFusions() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Popular Dragon Ball Fusions</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
                Fans frequently search for dragon ball z vegeta and goku fusion, so we’ve optimized presets for both Gogeta (Fusion Dance) and Vegito (Potara). Gogeta showcases balanced facial structure and fast, cinematic motion lines, perfect for dynamic posters. Vegito highlights confident posture, golden ki accents, and sharper silhouette contrast—ideal for powerful hero shots. Gotenks, formed by Goten and Trunks, emphasizes playful energy and exaggerated features, while Piccolo + Gohan combinations capture mentor‑student harmony and tactical composure. Our generator models iconic hairstyles, battle outfits, and aura color theory to preserve anime consistency while enabling custom creativity.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
                Try mixing protagonists and rivals to explore heritage and rivalry: Goku + Vegeta for classic synergy, Android 18 + Krillin for battle couple dynamics, or Broly + Goku for overwhelming ki force. For long‑tail keyword coverage, you can label creations as &quot;Dragon Ball Fusion: Goku × Vegeta&quot; or &quot;DBZ Fusion: Frieza × Buu&quot; right on the card. The tool’s AI‑driven pipeline balances feature blending, color grading, and aura geometry, producing high‑resolution images that look great in galleries, avatars, and printable merch. Whether you want a poster‑ready Gogeta or an emerald ki Vegito, this Dragon Ball Fusion Generator delivers authentic results quickly and reliably.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
                {[
                    {
                        left: "Goku",
                        right: "Vegeta",
                        name: "Gogeta Variant",
                        image: "/images/goku-vegeta-gogeta-fusion-avatar.webp",
                        alt: "Gogeta fusion avatar combining Goku and Vegeta Dragon Ball Z characters"
                    },
                    {
                        left: "Vegeta",
                        right: "Piccolo",
                        name: "Tactical Powerhouse",
                        image: "/images/vegeta-piccolo-potara-fusion.webp",
                        alt: "Vegeta and Piccolo Potara fusion with Supreme Kai earrings and combined powers"
                    },
                    {
                        left: "Frieza",
                        right: "Majin Buu",
                        name: "Tyrant & Magic",
                        image: "/images/frieza-majin-buu-fusion.webp",
                        alt: "Frieza and Majin Buu fusion - Galactic tyrant meets magical being"
                    },
                    {
                        left: "Android 18",
                        right: "Krillin",
                        name: "Battle Couple",
                        image: "/images/android18-krillin-couple-fusion.webp",
                        alt: "Android 18 and Krillin couple fusion - Cyborg meets Earth's strongest human"
                    },
                ].map((item, i) => (
                    <Card key={i} className="border-2 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Dragon Ball Fusion: {item.left} × {item.right}</p>
                                    <p className="font-semibold text-lg">{item.name}</p>
                                </div>
                                <div className="relative w-20 h-20 bg-muted rounded-full overflow-hidden border">
                                    <Image
                                        src={(item as any).image || "/images/fusion-generator-logo.svg"}
                                        alt={(item as any).alt || `Dragon Ball Fusion Generator – ${item.left} and ${item.right} fusion preview`}
                                        fill
                                        className={(item as any).image ? "object-cover" : "object-cover p-2"}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
