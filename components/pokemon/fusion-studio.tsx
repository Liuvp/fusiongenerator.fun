"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, RefreshCw, Share2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { POKEMON_DATABASE, getPokemonImageUrl, type Pokemon, getRandomPokemon } from "@/lib/pokemon-data";

export function PokeFusionStudio() {
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();
    const resultRef = useRef<HTMLDivElement>(null);

    const [pokemon1, setPokemon1] = useState<Pokemon>();
    const [pokemon2, setPokemon2] = useState<Pokemon>();
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<{ imageUrl: string; p1: Pokemon; p2: Pokemon } | null>(null);
    const [quota, setQuota] = useState<{ used: number; remaining: number; limit: number; isVIP: boolean } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    /** Load saved selection */
    useEffect(() => {
        const saved = localStorage.getItem("pokemon_fusion_state");
        if (saved) {
            try {
                const { p1, p2 } = JSON.parse(saved);
                if (p1) setPokemon1(POKEMON_DATABASE.find(c => c.id === p1));
                if (p2) setPokemon2(POKEMON_DATABASE.find(c => c.id === p2));
            } catch (e) {
                console.error("Failed to load saved state");
            }
        }
    }, []);

    /** Save selection */
    useEffect(() => {
        if (pokemon1 || pokemon2) {
            localStorage.setItem("pokemon_fusion_state", JSON.stringify({ p1: pokemon1?.id, p2: pokemon2?.id }));
        }
    }, [pokemon1, pokemon2]);

    /** Scroll to result when generated */
    useEffect(() => {
        if (result && resultRef.current && !isGenerating) {
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [result, isGenerating]);

    /** Auth & Quota */
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                setUser(data?.user ?? null);
                setIsLoadingAuth(false);
            } catch (error) {
                // console.error('Auth check error:', error);
                setIsLoadingAuth(false);
            }
        };

        const fetchQuota = async () => {
            try {
                const response = await fetch('/api/get-quota');
                if (response.ok) {
                    const data = await response.json();
                    setQuota(data.quota);
                }
            } catch (error) {
                console.error('Failed to fetch quota:', error);
            }
        };

        checkUser();
        fetchQuota();

        const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user ?? null);
                fetchQuota();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setQuota(null);
            }
        });

        return () => {
            if (authData.subscription) authData.subscription.unsubscribe();
        };
    }, [supabase]);

    /** Helpers */
    const getRemainingDisplay = () => quota?.isVIP ? "∞" : (quota ? quota.remaining : user ? "0" : "1");
    const hasQuotaAccess = () => quota?.isVIP || (quota ? quota.remaining > 0 : !user);
    const isSelectionComplete = !!(pokemon1 && pokemon2);
    const shouldDisableButton = !isSelectionComplete || isGenerating;

    /** Actions */
    const selectPokemon = (p: Pokemon) => {
        if (pokemon1?.id === p.id || pokemon2?.id === p.id) return;
        if (!pokemon1) setPokemon1(p);
        else if (!pokemon2) setPokemon2(p);
        else { setPokemon2(pokemon1); setPokemon1(p); }
    };

    const randomize = () => {
        const [p1, p2] = getRandomPokemon(2);
        setPokemon1(p1);
        setPokemon2(p2);
        setResult(null);
        toast({ title: "Random Pair Selected", description: `${p1.name} + ${p2.name}`, duration: 2000 });
    };

    const clearSelection = () => { setPokemon1(undefined); setPokemon2(undefined); setResult(null); };

    const generateFusion = async () => {
        if (!hasQuotaAccess()) {
            if (!user) router.push(`/sign-in?redirect_to=${window.location.pathname}&reason=fusion_quota`);
            else router.push('/pricing?source=pokemon_fusion&reason=upgrade_for_more');
            return;
        }

        if (!pokemon1 || !pokemon2) {
            toast({ title: "Select Two Pokémon", description: "Choose two Pokémon to fuse", variant: "destructive", duration: 3000 });
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const payload = { p1: pokemon1.id, p2: pokemon2.id };

            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data: any;
            try { data = await response.json(); } catch { data = {}; }

            if (response.status === 429) { toast({ title: "Limit Reached", description: data.error || "Try again later.", variant: "destructive", duration: 5000 }); return; }
            if (response.status === 402) { toast({ title: "Insufficient Credits", description: "Upgrade to continue.", variant: "destructive", duration: 5000 }); return; }
            if (!response.ok) throw new Error(data?.error || `Server error: ${response.status}`);

            if (data.quota) setQuota(data.quota);
            setResult({ imageUrl: data.imageUrl, p1: pokemon1, p2: pokemon2 });
            toast({ title: "Fusion Complete!", description: "A new Pokémon is born!", duration: 3000 });

        } catch (error: any) {
            console.error("Fusion error:", error);
            toast({ title: "Fusion Failed", description: error.message || "Please try again", variant: "destructive", duration: 4000 });
        } finally { setIsGenerating(false); }
    };

    const downloadImage = async () => {
        if (!result?.imageUrl) return;
        try {
            const response = await fetch(result.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fusion-${result.p1.name}-${result.p2.name}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({ title: "Download Started", description: "Image saved to your device", duration: 3000 });
        } catch { window.open(result.imageUrl, '_blank'); toast({ title: "Opening Image", description: "Use browser menu to save image.", duration: 3000 }); }
    };

    const shareResult = async () => {
        if (!result) return;
        const shareData = { title: `${result.p1.name} × ${result.p2.name} Fusion`, text: `Check out this Pokémon fusion!`, url: window.location.href };
        try { if (navigator.share && navigator.canShare(shareData)) await navigator.share(shareData); else { await navigator.clipboard.writeText(window.location.href); toast({ title: "Link Copied!", description: "Paste to share", duration: 3000 }); } }
        catch (error) { console.error("Share failed:", error); }
    };

    return (
        <div id="fusion-studio" className="bg-gradient-to-b from-blue-50/30 to-white p-4 pb-8 rounded-3xl min-h-[600px]">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-blue-600 tracking-tight">Pokémon Fusion Studio</h2>
                </div>
                <Badge variant={hasQuotaAccess() ? "default" : "destructive"} className="text-sm px-3 py-1.5 min-w-[80px] justify-center">
                    {quota?.isVIP ? "VIP" : `${getRemainingDisplay()} Left`}
                </Badge>
            </header>

            {/* 选择区 */}
            <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">Choose Pokémon</h2>
                        <Button variant="ghost" size="sm" onClick={randomize} className="h-7 px-2 text-xs text-gray-600 hover:text-blue-600"><RefreshCw className="w-3 h-3 mr-1" />Random</Button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                        {POKEMON_DATABASE.map((p, idx) => {
                            const isSelected1 = pokemon1?.id === p.id;
                            const isSelected2 = pokemon2?.id === p.id;
                            const isSelected = isSelected1 || isSelected2;
                            return (
                                <button key={p.id} onClick={() => selectPokemon(p)} className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 touch-manipulation ${isSelected1 ? 'border-blue-500 shadow-md ring-2 ring-blue-200 ring-offset-1 scale-105' : isSelected2 ? 'border-green-500 shadow-md ring-2 ring-green-200 ring-offset-1 scale-105' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`} aria-label={`Select ${p.name}`} aria-pressed={isSelected}>
                                    <div className="relative w-full h-full bg-gray-100">
                                        <Image src={getPokemonImageUrl(p)} alt={p.name} fill sizes="(max-width: 640px) 25vw, 80px" priority={idx < 8} className={`object-contain p-1 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} unoptimized />
                                        {isSelected && <div className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected1 ? 'bg-blue-500 text-white shadow-md' : 'bg-green-500 text-white shadow-md'}`}>{isSelected1 ? '1' : '2'}</div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 生成按钮 */}
            <Card className="border-0 shadow-md mb-6 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                        <CharacterSlot char={pokemon1} position={1} />
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center shadow-sm"><span className="text-xl font-bold text-blue-500">+</span></div>
                            <span className="text-[10px] text-blue-400 font-medium">FUSE</span>
                        </div>
                        <CharacterSlot char={pokemon2} position={2} />
                    </div>

                    <Button onClick={generateFusion} disabled={shouldDisableButton} size="lg" className={`w-full py-6 text-xl font-black uppercase tracking-wide shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isGenerating ? 'bg-gray-200 text-gray-500' : (!hasQuotaAccess() ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:shadow-2xl text-white')}`}>
                        {isGenerating ? <span className="flex items-center gap-3"><Sparkles className="w-6 h-6 animate-spin" />FUSING...</span> : !isSelectionComplete ? "SELECT 2 POKÉMON" : !hasQuotaAccess() ? (user ? "UPGRADE TO VIP" : "LOGIN FOR ENERGY") : <span className="flex items-center gap-3"><Sparkles className="w-6 h-6" />FUU-SION!</span>}
                    </Button>
                </CardContent>
            </Card>

            {/* Loading */}
            {isGenerating && (
                <Card className="border-0 shadow-md mb-6 animate-pulse">
                    <CardContent className="h-[400px] flex flex-col items-center justify-center p-5 space-y-4 bg-gray-50/50 rounded-xl">
                        <Sparkles className="w-12 h-12 text-blue-400 animate-spin" />
                        <p className="text-gray-500 font-medium">Channeling Energy...</p>
                    </CardContent>
                </Card>
            )}

            {/* 结果显示 */}
            {result && (
                <Card ref={resultRef} className="border-0 shadow-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <Image src={result.imageUrl} alt={`${result.p1.name} fused with ${result.p2.name}`} fill className="object-contain p-4" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{result.p1.name} × {result.p2.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Fusion Complete</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Button onClick={downloadImage} variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><Download className="w-4 h-4 mr-2" />Save</Button>
                                <Button onClick={shareResult} variant="outline"><Share2 className="w-4 h-4 mr-2" />Share</Button>
                                <Button onClick={clearSelection} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />New</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mt-8 text-center space-y-1">
                <p className="text-xs text-gray-500">Daily free attempts reset at midnight. Log in for more.</p>
                <p className="text-xs text-gray-400">Fusion results are AI-generated for entertainment. Not official Pokémon content.</p>
            </div>
        </div>
    );
}

/** Character Slot */
const CharacterSlot = ({ char, position }: { char?: Pokemon; position: number }) => {
    const colors = { 1: { border: 'border-blue-500', bg: 'bg-blue-500' }, 2: { border: 'border-green-500', bg: 'bg-green-500' } };
    const color = colors[position as keyof typeof colors];

    return (
        <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 rounded-xl overflow-hidden border-4 shadow-lg ${char ? color.border : 'border-gray-200'} bg-gray-100`}>
                {char ? (
                    <Image src={getPokemonImageUrl(char)} alt={char.name} fill className="object-contain p-1" sizes="96px" unoptimized />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-black text-gray-300">?</span>
                    </div>
                )}
            </div>
            <div className={`mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${char ? `${color.bg} text-white` : 'bg-gray-100 text-gray-400'}`}>
                {char ? char.name : `SLOT ${position}`}
            </div>
        </div>
    );
};
