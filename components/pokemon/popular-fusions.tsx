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
                    {
                        left: "Dragonite",
                        right: "Snorlax",
                        name: "Dragolax",
                        types: ["🐉 Dragon", "⭐ Normal"],
                        desc: "Bulky sleepy dragon",
                        image: "/images/dragonite-snorlax-character-fusion-pokemon-preview.webp",
                        alt: "AI-generated Pokémon character fusion preview combining Dragonite and Snorlax traits"
                    },
                    {
                        left: "Charizard",
                        right: "Mewtwo",
                        name: "Charitwo",
                        types: ["🔥 Fire", "🔮 Psychic"],
                        desc: "Ultimate Psychic Dragon",
                        image: "/images/charizard-mewtwo-character-fusion-pokemon-preview.webp",
                        alt: "AI-generated Pokémon character fusion preview combining Charizard and Mewtwo traits"
                    },
                    {
                        left: "Snorlax",
                        right: "Pikachu",
                        name: "Pikalax",
                        types: ["⭐ Normal", "⚡ Electric"],
                        desc: "Cute but bulky hybrid",
                        image: "/images/snorlax-pikachu-ai-fusion-creature.webp",
                        alt: "Pokemon Infinite Fusion: A creative AI mashup of Pikachu and Snorlax, showing a cute but bulky pink hybrid"
                    },
                    {
                        left: "Pikachu",
                        right: "Eevee",
                        name: "PikaVee",
                        types: ["⚡ Electric", "⭐ Normal"],
                        desc: "Cute and adorable playful expression",
                        image: "/images/cute-pikachu-character-pokemon-preview.webp",
                        alt: "Cute and adorable Pikachu character illustration with a playful expression"
                    },
                ].map((item, i) => (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Card className="border-2 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full overflow-hidden border">
                                                <Image
                                                    src={(item as any).image || "/images/fusion-generator-logo.svg"}
                                                    alt={(item as any).alt || `${item.name} - Pokemon Fusion of ${item.left} and ${item.right}`}
                                                    fill
                                                    sizes="(max-width: 640px) 80px, 96px"
                                                    className={(item as any).image ? "object-cover" : "object-cover p-2"}
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
