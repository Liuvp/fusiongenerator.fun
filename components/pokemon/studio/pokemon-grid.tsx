"use client";

import Image from "next/image";
import { POKEMON_DATABASE, getPokemonImageUrl, Pokemon } from "@/lib/pokemon-data";

interface PokemonGridProps {
    pokemon1?: Pokemon;
    pokemon2?: Pokemon;
    onSelect: (p: Pokemon) => void;
}

export function PokemonGrid({ pokemon1, pokemon2, onSelect }: PokemonGridProps) {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {POKEMON_DATABASE.map((p) => {
                const isSelected1 = pokemon1?.id === p.id;
                const isSelected2 = pokemon2?.id === p.id;
                const isSelected = isSelected1 || isSelected2;

                return (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 touch-manipulation 
                            ${isSelected1
                                ? 'border-orange-500 shadow-md ring-2 ring-orange-200 scale-105 z-10'
                                : isSelected2
                                    ? 'border-blue-500 shadow-md ring-2 ring-blue-200 scale-105 z-10'
                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                        aria-label={`Select ${p.name}`}
                        aria-pressed={isSelected}
                    >
                        {/* Background & Image */}
                        <div className="relative w-full h-full bg-gray-50/50">
                            <Image
                                src={getPokemonImageUrl(p)}
                                alt={p.name}
                                fill
                                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 120px"
                                className={`object-contain p-1 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                            />

                            {/* Selection Badge */}
                            {isSelected && (
                                <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm
                                    ${isSelected1 ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                    {isSelected1 ? '1' : '2'}
                                </div>
                            )}
                        </div>

                        {/* Name Label */}
                        <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-[1px] text-[9px] text-white py-0.5 text-center truncate px-1">
                            {p.name}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
