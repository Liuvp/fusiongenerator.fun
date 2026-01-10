import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function PokePopularFusions() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">Fusion Dex Gallery</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
                Explore some of the most popular Pokemon fusions created by our community. From classic combinations like Pikachu + Charizard (Pikazard) to creative hybrids like Mewtwo + Lucario (Mewcario), the possibilities are endless. Each fusion inherits unique type combinations, abilities, and visual characteristics from both parent Pokemon.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
                {[
                    { left: "Pikachu", right: "Charizard", name: "Pikazard", types: ["⚡ Electric", "🐉 Dragon"], desc: "High speed special attacker" },
                    { left: "Mewtwo", right: "Lucario", name: "Mewcario", types: ["🔮 Psychic", "🥊 Fighting"], desc: "Ultimate Aura master" },
                    { left: "Gengar", right: "Snorlax", name: "Snorenar", types: ["⭐ Normal", "👻 Ghost"], desc: "Dream eater tank" },
                    { left: "Lapras", right: "Charizard", name: "Aquazard", types: ["💧 Water", "🔥 Fire"], desc: "Sea and Sky guardian" },
                ].map((item, i) => (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Card className="border-2 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1 text-left">
                                                <p className="text-sm text-muted-foreground">{item.left} × {item.right}</p>
                                                <p className="font-semibold text-lg">{item.name}</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {item.types.map((type, idx) => (
                                                        <span key={idx} className="text-xs px-2 py-1 rounded-full border bg-muted">
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative w-24 h-24 bg-muted rounded-full overflow-hidden border">
                                                <Image
                                                    src="/images/fusion-generator-logo.svg"
                                                    alt={`${item.name} - Pokemon Fusion of ${item.left} and ${item.right}`}
                                                    fill
                                                    className="object-cover p-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-xs">{item.desc}</p>
                                <p className="text-xs text-muted-foreground">Click to view details</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    );
}
