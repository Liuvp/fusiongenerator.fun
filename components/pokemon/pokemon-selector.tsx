"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { POKEMON_DATABASE, type Pokemon } from "@/lib/pokemon-data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface PokemonSelectorProps {
    value?: Pokemon;
    onChange: (pokemon: Pokemon) => void;
    label: string;
    excludeId?: string;  // 排除已选择的另一个 Pokemon
}

export function PokemonSelector({ value, onChange, label, excludeId }: PokemonSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // 过滤 Pokemon（搜索 + 排除）
    const filteredPokemon = POKEMON_DATABASE.filter(p => {
        if (p.id === excludeId) return false;
        if (!searchQuery) return true;
        return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">{label}</Label>
                {value && (
                    <div className="mt-1 text-xs text-muted-foreground">
                        Selected: {value.emoji} {value.name}
                    </div>
                )}
            </div>

            {/* 搜索框 */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Pokemon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Pokemon 卡片网格 */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1">
                {filteredPokemon.map((pokemon) => (
                    <Card
                        key={pokemon.id}
                        className={cn(
                            "cursor-pointer transition-all hover:scale-105 hover:shadow-md",
                            value?.id === pokemon.id && "ring-2 ring-primary shadow-lg"
                        )}
                        onClick={() => onChange(pokemon)}
                    >
                        <CardContent className="p-3 text-center">
                            <div className="text-3xl mb-1">{pokemon.emoji}</div>
                            <div className="text-xs font-medium line-clamp-1">
                                {pokemon.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                #{pokemon.number}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPokemon.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                    No Pokemon found
                </div>
            )}
        </div>
    );
}
