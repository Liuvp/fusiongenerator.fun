"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Settings2, Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { POKEMON_DATABASE, FUSION_STYLES, PRE_GENERATED_FUSIONS, getPokemonImageUrl, type Pokemon, type FusionStyle } from "@/lib/pokemon-data";
import { buildFusionPrompt } from "@/lib/prompt-builder";
import { User } from "@supabase/supabase-js";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInAction, signUpAction, signUpWithGoogleAction } from "@/app/actions";

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
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"sign_up" | "sign_in">("sign_up");
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [pendingForm, setPendingForm] = useState(false);
    // Tracks whether the user dismissed the auth gate via "No thanks". Reset
    // whenever quota access is regained, so the gate can re-open naturally.
    const [dismissedAuthOptions, setDismissedAuthOptions] = useState(false);
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
    const getRemainingDisplay = () => quota?.isVIP ? "∞" : (quota ? quota.remaining : user ? "0" : "2");
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
    // Show the gate when quota is exhausted OR the user opened it manually,
    // but respect an explicit "No thanks" dismissal until quota access changes.
    const shouldShowAuthOptions = (!hasQuotaAccessValue || showAuthOptions) && !dismissedAuthOptions;
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
            setDismissedAuthOptions(false);
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

        const remaining = quota?.remaining ?? (user ? 0 : 2);
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
                description: "Guest access includes 2 free fusions. Sign in or create a free account before your next generation."
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
                                <h4 className="font-bold text-gray-800">You've used your 2 free fusions</h4>
                                <p className="text-xs text-gray-600">
                                    Create a free account to save your fusions and unlock more generations.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                                    onClick={() => {
                                        setAuthMode("sign_in");
                                        setAuthDialogOpen(true);
                                        trackStudioEvent("pokemon_auth_gate_click", { cta: "sign_in_dialog", reason: authGateReason ?? "quota_limit" });
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 border-0"
                                    onClick={() => {
                                        setAuthMode("sign_up");
                                        setAuthDialogOpen(true);
                                        trackStudioEvent("pokemon_auth_gate_click", { cta: "sign_up_dialog", reason: authGateReason ?? "quota_limit" });
                                    }}
                                >
                                    Save My Fusions (Free)
                                </Button>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAuthOptions(false);
                                    setDismissedAuthOptions(true);
                                }}
                                className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                No thanks, I'll keep browsing
                            </button>
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

            {/* 内联注册/登录对话框 */}
            <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {authMode === "sign_up" ? "Save My Fusions (Free)" : "Welcome Back"}
                        </DialogTitle>
                        <DialogDescription>
                            {authMode === "sign_up"
                                ? "Create an account to save your fusion history, get more credits, and pick up where you left off."
                                : "Sign in to continue your fusion session and access your saved creations."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {/* Google 登录 */}
                        <form action={signUpWithGoogleAction}>
                            <input type="hidden" name="redirect_to" value="/pokemon#fusion-studio" />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 h-11"
                                onClick={() => {
                                    setPendingForm(true);
                                    setFormError(null);
                                    trackStudioEvent("pokemon_auth_dialog_click", { method: "google", mode: authMode });
                                }}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or with email
                                </span>
                            </div>
                        </div>

                        {/* 切换登录/注册标签 */}
                        <div className="flex rounded-lg border p-1 bg-muted/30">
                            <button
                                type="button"
                                onClick={() => { setAuthMode("sign_up"); setFormError(null); }}
                                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${authMode === "sign_up" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Sign Up
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("sign_in"); setFormError(null); }}
                                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${authMode === "sign_in" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Sign In
                            </button>
                        </div>

                        {/* 密码表单 */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setFormError(null);
                                setPendingForm(true);
                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                formData.set("redirect_to", "/pokemon#fusion-studio");
                                try {
                                    const action = authMode === "sign_up" ? signUpAction : signInAction;
                                    const result = await action(formData) as { redirect?: string } | undefined;
                                    if (result?.redirect) {
                                        window.location.href = result.redirect;
                                    }
                                } catch (err) {
                                    setFormError(err instanceof Error ? err.message : "An error occurred. Please try again.");
                                } finally {
                                    setPendingForm(false);
                                }
                            }}
                            className="grid gap-3"
                        >
                            <input type="hidden" name="redirect_to" value="/pokemon#fusion-studio" />
                            <div className="grid gap-1.5">
                                <Label htmlFor="auth-email">Email</Label>
                                <Input
                                    id="auth-email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                    className="h-10"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="auth-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="auth-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={authMode === "sign_up" ? "Create a password (min 6 chars)" : "Enter your password"}
                                        autoComplete={authMode === "sign_up" ? "new-password" : "current-password"}
                                        required
                                        minLength={6}
                                        className="pr-10 h-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {formError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={pendingForm}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 border-0"
                            >
                                {pendingForm ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {authMode === "sign_up" ? "Creating account..." : "Signing in..."}
                                    </>
                                ) : (
                                    authMode === "sign_up" ? "Create Free Account" : "Sign In"
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-center text-muted-foreground">
                            By continuing, you agree to our{' '}
                            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
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
