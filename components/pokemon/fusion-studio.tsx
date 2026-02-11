"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Settings2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { POKEMON_DATABASE, FUSION_STYLES, PRE_GENERATED_FUSIONS, getPokemonImageUrl, type Pokemon, type FusionStyle } from "@/lib/pokemon-data";
import { buildFusionPrompt } from "@/lib/prompt-builder";
import { User } from "@supabase/supabase-js";

// Sub-components
import { PokemonGrid } from "./studio/pokemon-grid";
import { ResultCard } from "./studio/result-card";
import { SettingsPanel } from "./studio/settings-panel";

// Using the optimized data directly
const OPTIMIZED_POKEMON = POKEMON_DATABASE;

export function PokeFusionStudio() {
    const { toast } = useToast();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const resultRef = useRef<HTMLDivElement>(null);

    // State
    const [pokemon1, setPokemon1] = useState<Pokemon>();
    const [pokemon2, setPokemon2] = useState<Pokemon>();
    const [style, setStyle] = useState<FusionStyle>(FUSION_STYLES[0]);
    const [prompt, setPrompt] = useState("");
    const [promptSource, setPromptSource] = useState<"manual" | "auto">("auto");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<{ imageUrl: string; pokemon1: Pokemon; pokemon2: Pokemon; style: FusionStyle } | null>(null);
    const [quota, setQuota] = useState<{ used: number; remaining: number; limit: number; isVIP: boolean } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    /** Local Storage Logic */
    const saveToLocalStorage = useCallback(() => {
        if (pokemon1 || pokemon2) {
            try {
                localStorage.setItem("pokemon_fusion_state", JSON.stringify({
                    p1: pokemon1?.id,
                    p2: pokemon2?.id,
                    s: style.id
                }));
            } catch (e) { }
        }
    }, [pokemon1, pokemon2, style]);

    useEffect(() => {
        const saved = localStorage.getItem("pokemon_fusion_state");
        if (saved) {
            try {
                const { p1, p2, s } = JSON.parse(saved);
                if (p1) setPokemon1(OPTIMIZED_POKEMON.find(p => p.id === p1));
                if (p2) setPokemon2(OPTIMIZED_POKEMON.find(p => p.id === p2));
                if (s) {
                    const savedStyle = FUSION_STYLES.find(style => style.id === s);
                    if (savedStyle) setStyle(savedStyle);
                }
            } catch (e) { }
        }
    }, []);

    useEffect(() => { saveToLocalStorage(); }, [saveToLocalStorage]);

    /** Prompt Construction */
    useEffect(() => {
        if ((pokemon1 || pokemon2) && promptSource === "auto") {
            const generatedPrompt = buildFusionPrompt(pokemon1, pokemon2, style);
            setPrompt(generatedPrompt);
        }
    }, [pokemon1, pokemon2, style, promptSource]);

    /** Auto Scroll */
    const scrollToResult = useCallback(() => {
        if (resultRef.current && !isGenerating) {
            requestAnimationFrame(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }
    }, [isGenerating]);

    useEffect(() => { if (result && !isGenerating) scrollToResult(); }, [result, isGenerating, scrollToResult]);

    /** Auth & Quota */
    useEffect(() => {
        let mounted = true;
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (mounted) setUser(data?.user ?? null);
        };
        const fetchQuota = async () => {
            try {
                const res = await fetch('/api/get-quota');
                if (res.ok && mounted) {
                    const data = await res.json();
                    setQuota(data.quota);
                }
            } catch (e) { }
        };

        Promise.all([checkUser(), fetchQuota()]);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (mounted) {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setUser(session?.user ?? null);
                    fetchQuota();
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setQuota(null);
                }
            }
        });

        return () => { mounted = false; subscription.unsubscribe(); };
    }, [supabase]);

    /** Helpers */
    const getRemainingDisplay = () => quota?.isVIP ? "∞" : (quota ? quota.remaining : user ? "0" : "1");
    const hasQuotaAccess = () => {
        // VIP 用户永远有访问权限
        if (quota?.isVIP) return true;

        // 已认证用户检查配额
        if (user && quota) {
            return quota.remaining > 0;
        }

        // 未登录用户：检查是否还有免费额度
        // 如果 quota 已加载且 remaining = 0，说明用完了
        if (!user && quota) {
            return quota.remaining > 0;
        }

        // 未登录且配额未加载：允许尝试（会在 API 层面检查）
        return true;
    };
    const isSelectionComplete = !!(pokemon1 && pokemon2);
    const shouldDisableButton = !isSelectionComplete || isGenerating;

    /** Handlers */
    const selectPokemon = (p: Pokemon) => {
        if (pokemon1?.id === p.id || pokemon2?.id === p.id) return;
        if (!pokemon1) setPokemon1(p);
        else if (!pokemon2) setPokemon2(p);
        else {
            setPokemon2(pokemon1);
            setPokemon1(p);
        }
        setPromptSource("auto");
    };

    const randomize = () => {
        const shuffled = [...POKEMON_DATABASE].sort(() => 0.5 - Math.random());
        const [p1, p2] = shuffled.slice(0, 2);
        setPokemon1(p1);
        setPokemon2(p2);
        setPromptSource("auto");
        setResult(null);
    };

    const loadDemoFusion = () => {
        const sample = PRE_GENERATED_FUSIONS[Math.floor(Math.random() * PRE_GENERATED_FUSIONS.length)];
        const p1 = OPTIMIZED_POKEMON.find(p => p.id === sample.char1Id);
        const p2 = OPTIMIZED_POKEMON.find(p => p.id === sample.char2Id);

        if (p1 && p2) {
            setPokemon1(p1);
            setPokemon2(p2);
            setPromptSource("auto");
            setResult({
                imageUrl: sample.imageUrl,
                pokemon1: p1,
                pokemon2: p2,
                style: FUSION_STYLES[0]
            });
            toast({ title: "Demo Loaded", description: `Showing random example: ${sample.name}` });
        }
    };

    const clearSelection = () => {
        setPokemon1(undefined);
        setPokemon2(undefined);
        setResult(null);
    };

    const generateFusion = async () => {
        if (!hasQuotaAccess()) {
            // 区分未登录和已登录用户，提供更清晰的提示
            if (!user) {
                toast({
                    title: "Free Quota Used",
                    description: "Sign in to get more fusion credits!",
                    variant: "default",
                });
                setTimeout(() => router.push('/sign-in?reason=fusion'), 2000);
            } else {
                toast({
                    title: "Quota Exceeded",
                    description: "Upgrade to VIP for unlimited fusions!",
                    variant: "destructive",
                });
                setTimeout(() => router.push('/pricing?reason=quota'), 2000);
            }
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const res = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429 || res.status === 402) {
                    toast({ title: "Limit Reached", description: data.error, variant: "destructive" });
                    if (res.status === 429 && !user) setTimeout(() => router.push('/sign-in'), 2000);
                    return;
                }
                throw new Error(data.error);
            }

            if (data.quota) setQuota(data.quota);
            if (pokemon1 && pokemon2) {
                setResult({ imageUrl: data.imageUrl, pokemon1, pokemon2, style });
                toast({ title: "Started!", description: "Creating your fusion..." });
            }
        } catch (error: any) {
            toast({ title: "Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = async () => {
        if (!result?.imageUrl) return;
        try {
            const res = await fetch(result.imageUrl);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pokemon-fusion-${result.pokemon1.name}-${result.pokemon2.name}.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            toast({ title: "Saved", description: "Image saved to device" });
        } catch (e) { window.open(result.imageUrl, '_blank'); }
    };

    const shareResult = async () => {
        if (!result) return;
        const shareData = {
            title: `${result.pokemon1.name} x ${result.pokemon2.name}`,
            text: "Check out this Pokemon Fusion!",
            url: window.location.href
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else {
                await navigator.clipboard.writeText(window.location.href);
                toast({ title: "Copied", description: "Link copied to clipboard" });
            }
        } catch (e) { }
    };

    return (
        <div id="fusion-studio" className="bg-gradient-to-b from-blue-50/30 to-white p-4 pb-8 rounded-3xl min-h-[600px]">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                <div>
                    <h2 className="text-2xl font-black text-blue-600 tracking-tight">Pokemon Fusion Studio</h2>
                    <p className="text-sm text-gray-500 mt-1">Combine Iconic Pokemon with AI</p>
                </div>
                <Badge variant={hasQuotaAccess() ? "default" : "destructive"} className="px-3 py-1.5 min-w-[80px] justify-center self-start sm:self-auto">
                    {quota?.isVIP ? "VIP" : `${getRemainingDisplay()} Left`}
                </Badge>
            </header>

            {/* Selection Area */}
            <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <h2 className="text-sm font-semibold text-gray-700">Choose Pokemon</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={loadDemoFusion} className="h-8 px-3 text-xs border-dashed border-blue-300 text-blue-600 hover:bg-blue-50">
                                <Sparkles className="w-3 h-3 mr-1.5" /> Try Example
                            </Button>
                            <Button variant="secondary" size="sm" onClick={randomize} className="h-8 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700">
                                <RefreshCw className="w-3 h-3 mr-1.5" /> Random
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className={`h-8 w-8 p-0 ${showSettings ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}>
                                <Settings2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Component: Grid */}
                    <PokemonGrid pokemon1={pokemon1} pokemon2={pokemon2} onSelect={selectPokemon} />
                </CardContent>
            </Card>

            {/* Component: Settings (Collapsible) */}
            {showSettings && (
                <SettingsPanel
                    style={style} setStyle={setStyle}
                    prompt={prompt} setPrompt={setPrompt}
                    setPromptSource={setPromptSource}
                />
            )}

            {/* Fuse Control Area */}
            <Card className="border-0 shadow-md mb-6 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">{isSelectionComplete ? "Ready to Fuse" : "Select 2 Pokemon"}</h2>
                        {(pokemon1 || pokemon2) && (
                            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-7 px-2 text-xs text-gray-500 hover:text-destructive">Clear</Button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <CharacterSlot char={pokemon1} position={1} />
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-lg font-bold text-blue-500">+</span></div>
                        </div>
                        <CharacterSlot char={pokemon2} position={2} />
                    </div>

                    <Button onClick={generateFusion} disabled={shouldDisableButton} size="lg" className="w-full py-6 text-xl font-black uppercase shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {isGenerating ? (
                            <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin" /> Generating...</span>
                        ) : !isSelectionComplete ? (
                            "Select 2 Pokemon"
                        ) : (
                            <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Fuse Pokemon!</span>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isGenerating && (
                <Card className="border-0 shadow-md mb-6 animate-pulse">
                    <CardContent className="h-[300px] flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl">
                        <Sparkles className="w-10 h-10 text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Mixing DNA...</p>
                        <p className="text-xs text-gray-400 mt-2">Creating new species...</p>
                    </CardContent>
                </Card>
            )}

            {/* Component: Result */}
            {result && (
                <ResultCard
                    ref={resultRef}
                    result={result}
                    onDownload={downloadImage}
                    onShare={shareResult}
                    onReset={clearSelection}
                />
            )}
        </div>
    );
}

const CharacterSlot = ({ char, position }: { char?: Pokemon; position: number }) => {
    const isP1 = position === 1;
    return (
        <div className="flex flex-col items-center group">
            <div className={`relative w-20 h-20 rounded-xl overflow-hidden border-4 shadow-sm transition-all ${char ? (isP1 ? 'border-orange-500' : 'border-blue-500') : 'border-gray-200 bg-gray-50'}`}>
                {char ? (
                    <Image src={getPokemonImageUrl(char)} alt={char.name} fill className="object-contain p-1" sizes="80px" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-2xl">?</div>
                )}
            </div>
            <div className={`mt-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${char ? (isP1 ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') : 'bg-gray-100 text-gray-400'}`}>
                {char ? char.name : `Slot ${position}`}
            </div>
        </div>
    );
};
