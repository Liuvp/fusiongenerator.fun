"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
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

type AuthGateReason = "guest_quota_used" | "member_quota_exceeded" | "api_limit_reached";
type StudioEventPayload = Record<string, string | number | boolean | null | undefined>;

const trackStudioEvent = (eventName: string, payload: StudioEventPayload = {}): void => {
    if (typeof window === "undefined") return;

    try {
        const globalWindow = window as Window & { gtag?: (...args: unknown[]) => void };
        if (typeof globalWindow.gtag === "function") {
            globalWindow.gtag("event", eventName, payload);
        }
    } catch (error) {
        console.warn("Failed to track Pokemon studio event:", error);
    }
};

export function PokeFusionStudio() {
    const { toast } = useToast();
    const supabase = useMemo(() => createClient(), []);
    const resultRef = useRef<HTMLDivElement>(null);
    const hiddenResultNoticeRef = useRef(false);

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
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const [authGateReason, setAuthGateReason] = useState<AuthGateReason | null>(null);
    const [isActionHintActive, setIsActionHintActive] = useState(false);

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

    useEffect(() => {
        const handleVisibilityChange = (): void => {
            if (document.hidden) return;
            if (!hiddenResultNoticeRef.current || !result) return;

            hiddenResultNoticeRef.current = false;
            toast({
                title: "Fusion Ready",
                description: `${result.pokemon1.name} x ${result.pokemon2.name} is ready below.`,
                duration: 2500
            });
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [result, toast]);

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
    const selectedCount = Number(Boolean(pokemon1)) + Number(Boolean(pokemon2));
    const hasQuotaAccessValue = hasQuotaAccess();
    const shouldShowAuthOptions = !hasQuotaAccessValue || showAuthOptions;
    const shouldDisableButton = isGenerating;
    const selectionGuidance = useMemo(() => {
        if (selectedCount === 0) {
            return {
                title: "Pick your first Pokemon",
                description: "Choose any Pokemon to begin. Add a second one to unlock the fusion button."
            };
        }

        if (selectedCount === 1) {
            const selectedName = pokemon1?.name ?? pokemon2?.name;
            return {
                title: `${selectedName} locked in`,
                description: "Pick one more Pokemon to complete the pair. Tap a selected Pokemon again if you want to remove it."
            };
        }

        return {
            title: `${pokemon1?.name} + ${pokemon2?.name} ready`,
            description: "Fuse now for the fastest result. If you tap a new Pokemon, it replaces slot 1 and shifts the older pick to slot 2."
        };
    }, [pokemon1, pokemon2, selectedCount]);

    const openAuthGate = useCallback((reason: AuthGateReason) => {
        setAuthGateReason(reason);
        setShowAuthOptions(true);
        trackStudioEvent("pokemon_auth_gate_open", {
            reason,
            is_logged_in: Boolean(user),
            remaining_quota: quota?.remaining ?? null,
            is_vip: Boolean(quota?.isVIP),
        });
    }, [quota?.isVIP, quota?.remaining, user]);

    useEffect(() => {
        if (hasQuotaAccessValue) {
            setShowAuthOptions(false);
            setAuthGateReason(null);
        }
    }, [hasQuotaAccessValue]);

    const quotaStatusCopy = useMemo(() => {
        if (quota?.isVIP) {
            return {
                title: "VIP access unlocked",
                description: "You can generate unlimited Pokemon fusions."
            };
        }

        const remaining = quota?.remaining ?? (user ? 0 : 1);
        if (hasQuotaAccessValue) {
            return user
                ? {
                    title: `${remaining} credit${remaining === 1 ? "" : "s"} remaining`,
                    description: "Each generation uses one credit."
                }
                : {
                    title: `${remaining} free fusion${remaining === 1 ? "" : "s"} left`,
                    description: "When this reaches 0, sign in is required before the next generation."
                };
        }

        return user
            ? {
                title: "No credits left",
                description: "Upgrade to VIP for unlimited Pokemon fusions."
            }
            : {
                title: "Keep generating with a free account",
                description: "Guest access includes 1 free fusion. Sign in or create a free account before your next generation."
            };
    }, [hasQuotaAccessValue, quota?.isVIP, quota?.remaining, user]);

    /** Handlers */
    const selectPokemon = (p: Pokemon) => {
        const isSelectedAsP1 = pokemon1?.id === p.id;
        const isSelectedAsP2 = pokemon2?.id === p.id;

        // Clicking an already selected Pokemon should produce a visible state change.
        if (isSelectedAsP1 || isSelectedAsP2) {
            trackStudioEvent("pokemon_select", {
                action: "deselect",
                slot: isSelectedAsP1 ? 1 : 2,
                pokemon_id: p.id,
            });
            if (isSelectedAsP1) {
                if (pokemon2) {
                    setPokemon1(pokemon2);
                    setPokemon2(undefined);
                } else {
                    setPokemon1(undefined);
                }
            } else {
                setPokemon2(undefined);
            }
            setResult(null);
            setPromptSource("auto");
            return;
        }

        trackStudioEvent("pokemon_select", {
            action: "select",
            pokemon_id: p.id,
            selected_count_before: Number(Boolean(pokemon1)) + Number(Boolean(pokemon2)),
        });

        if (!pokemon1) setPokemon1(p);
        else if (!pokemon2) setPokemon2(p);
        else {
            toast({
                title: "Lead Pokemon updated",
                description: `${p.name} moved into slot 1. ${pokemon1.name} shifted to slot 2.`,
                duration: 1600
            });
            setPokemon2(pokemon1);
            setPokemon1(p);
        }
        setResult(null);
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

    const swapLeftPokemon = () => {
        const options = POKEMON_DATABASE.filter((pokemon) => pokemon.id !== pokemon2?.id);
        const nextPokemon = options[Math.floor(Math.random() * options.length)];
        if (!nextPokemon || !pokemon2) return;

        setPokemon1(nextPokemon);
        setPromptSource("auto");
        setResult(null);
        toast({
            title: "Left Pokemon swapped",
            description: `${nextPokemon.name} is ready to fuse with ${pokemon2.name}.`,
        });
    };

    const swapRightPokemon = () => {
        const options = POKEMON_DATABASE.filter((pokemon) => pokemon.id !== pokemon1?.id);
        const nextPokemon = options[Math.floor(Math.random() * options.length)];
        if (!nextPokemon || !pokemon1) return;

        setPokemon2(nextPokemon);
        setPromptSource("auto");
        setResult(null);
        toast({
            title: "Right Pokemon swapped",
            description: `${pokemon1.name} is now paired with ${nextPokemon.name}.`,
        });
    };

    const clearSelection = () => {
        setPokemon1(undefined);
        setPokemon2(undefined);
        setResult(null);
    };

    const generateFusion = async () => {
        trackStudioEvent("pokemon_generate_click", {
            selected_count: selectedCount,
            is_selection_complete: isSelectionComplete,
            has_quota_access: hasQuotaAccessValue,
            is_logged_in: Boolean(user),
            remaining_quota: quota?.remaining ?? null,
            is_vip: Boolean(quota?.isVIP),
        });

        if (!isSelectionComplete) {
            setIsActionHintActive(true);
            setTimeout(() => setIsActionHintActive(false), 600);
            toast({
                title: "Select 2 Pokemon first",
                description: `Current selection: ${selectedCount}/2`,
            });
            trackStudioEvent("pokemon_generate_blocked", {
                reason: "incomplete_selection",
                selected_count: selectedCount,
            });
            return;
        }

        if (!hasQuotaAccessValue) {
            setIsActionHintActive(true);
            setTimeout(() => setIsActionHintActive(false), 600);

            if (!user) {
                toast({
                    title: "Free trial used",
                    description: "Create a free account to keep generating fusions.",
                });
                if (authGateReason !== "guest_quota_used") {
                    openAuthGate("guest_quota_used");
                } else {
                    setShowAuthOptions(true);
                }
                trackStudioEvent("pokemon_generate_blocked", {
                    reason: "guest_quota_used",
                    remaining_quota: quota?.remaining ?? 0,
                });
            } else {
                toast({
                    title: "Quota Exceeded",
                    description: "Upgrade to VIP for unlimited fusions!",
                    variant: "destructive",
                });
                openAuthGate("member_quota_exceeded");
                trackStudioEvent("pokemon_generate_blocked", {
                    reason: "member_quota_exceeded",
                    remaining_quota: quota?.remaining ?? 0,
                });
            }
            return;
        }

        setShowAuthOptions(false);
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
                    openAuthGate(user ? "member_quota_exceeded" : "api_limit_reached");
                    trackStudioEvent("pokemon_generate_fail", {
                        status: res.status,
                        reason: user ? "member_quota_exceeded" : "api_limit_reached",
                    });
                    return;
                }
                throw new Error(data.error);
            }

            if (data.quota) setQuota(data.quota);
            if (pokemon1 && pokemon2) {
                if (typeof document !== "undefined" && document.hidden) {
                    hiddenResultNoticeRef.current = true;
                }
                setResult({ imageUrl: data.imageUrl, pokemon1, pokemon2, style });
                toast({ title: "Started!", description: "Creating your fusion..." });
                trackStudioEvent("pokemon_generate_success", {
                    pokemon_1: pokemon1.id,
                    pokemon_2: pokemon2.id,
                    style: style.id,
                    remaining_quota: data?.quota?.remaining ?? quota?.remaining ?? null,
                });
            }
        } catch (error: any) {
            toast({ title: "Failed", description: error.message, variant: "destructive" });
            trackStudioEvent("pokemon_generate_fail", {
                status: 0,
                reason: "runtime_error",
            });
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
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Choose Pokemon</h2>
                            <p className="text-[11px] text-gray-500">Tip: Click a selected Pokemon again to remove it.</p>
                        </div>
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

                    <div className={`mb-4 rounded-xl border px-3 py-2 text-xs ${hasQuotaAccessValue ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
                        <p className="font-semibold">{quotaStatusCopy.title}</p>
                        <p className="mt-1">{quotaStatusCopy.description}</p>
                    </div>

                    <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                        <p className="font-semibold">{selectionGuidance.title}</p>
                        <p className="mt-1 text-gray-500">{selectionGuidance.description}</p>
                    </div>

                    <Button onClick={generateFusion} disabled={shouldDisableButton} size="lg" className={`w-full py-6 text-xl font-black uppercase shadow-xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${isActionHintActive ? 'ring-2 ring-red-400 ring-offset-2' : ''} ${!isSelectionComplete ? 'bg-gray-400 hover:bg-gray-500' : !hasQuotaAccessValue ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}>
                        {isGenerating ? (
                            <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-spin" /> Generating...</span>
                        ) : !isSelectionComplete ? (
                            `Select 2 Pokemon (${selectedCount}/2)`
                        ) : !hasQuotaAccessValue ? (
                            user ? "Unlock More Fusions" : "Create Free Account"
                        ) : (
                            <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Fuse Pokemon!</span>
                        )}
                    </Button>

                    {shouldShowAuthOptions && !user && !hasQuotaAccessValue && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4 space-y-1">
                                <h4 className="font-bold text-gray-800">Keep generating with a free account</h4>
                                <p className="text-xs text-gray-600">
                                    {authGateReason === "api_limit_reached"
                                        ? "Your free guest try is used. Sign in before your next generation."
                                        : "Guest access includes 1 free fusion. Sign in or create a free account to keep generating and save your next fusions."}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button asChild variant="outline" className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
                                    <Link
                                        href={`/sign-in?redirect_to=${encodeURIComponent('/pokemon#fusion-studio')}&reason=pokemon_quota&source=pokemon_fusion`}
                                        onClick={() => trackStudioEvent("pokemon_auth_gate_click", { cta: "sign_in", reason: authGateReason ?? "quota_limit" })}
                                    >
                                        Sign In to Continue
                                    </Link>
                                </Button>
                                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 border-0">
                                    <Link
                                        href={`/sign-up?redirect_to=${encodeURIComponent('/pokemon#fusion-studio')}&reason=pokemon_quota&source=pokemon_fusion`}
                                        onClick={() => trackStudioEvent("pokemon_auth_gate_click", { cta: "sign_up", reason: authGateReason ?? "quota_limit" })}
                                    >
                                        Create Free Account
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {shouldShowAuthOptions && user && !hasQuotaAccessValue && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4 space-y-1">
                                <h4 className="font-bold text-gray-800">Need more fusion credits?</h4>
                                <p className="text-xs text-gray-600">
                                    Upgrade to VIP to remove limits and generate unlimited Pokemon fusions.
                                </p>
                            </div>
                            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 border-0">
                                <Link
                                    href="/pricing?source=pokemon_fusion_quota"
                                    onClick={() => trackStudioEvent("pokemon_auth_gate_click", { cta: "pricing", reason: "member_quota_exceeded" })}
                                >
                                    Upgrade to VIP
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {isGenerating && (
                <Card className="border-0 shadow-md mb-6 animate-pulse">
                    <CardContent className="h-[300px] flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl">
                        <Sparkles className="w-10 h-10 text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Mixing DNA for {pokemon1?.name} x {pokemon2?.name}...</p>
                        <p className="text-xs text-gray-400 mt-2">You can switch tabs while we keep generating.</p>
                        <p className="text-xs text-gray-400">If the result finishes while you are away, we will call it out when you come back.</p>
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
                    onSwapLeft={swapLeftPokemon}
                    onSwapRight={swapRightPokemon}
                    onTryAnotherPair={randomize}
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
