"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { PokemonSelector } from "./pokemon-selector";
import { ResultDisplay } from "./result-display";
import { FUSION_STYLES, POKEMON_DATABASE, getPokemonImageUrl, type Pokemon, type FusionStyle } from "@/lib/pokemon-data";
import { buildFusionPrompt, validatePokemonSelection } from "@/lib/prompt-builder";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

export function PokeFusionStudio() {
    const { toast } = useToast();
    const supabase = createClient();

    // State
    const [prompt, setPrompt] = useState("");
    const [promptSource, setPromptSource] = useState<"manual" | "auto">("auto");
    const [promptUpdated, setPromptUpdated] = useState(false);
    const [pokemon1, setPokemon1] = useState<Pokemon | undefined>();
    const [pokemon2, setPokemon2] = useState<Pokemon | undefined>();
    const [style, setStyle] = useState<FusionStyle>(FUSION_STYLES[0]);
    const [customStyle, setCustomStyle] = useState(""); // 自定义风格
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    // 配额状态
    const [quota, setQuota] = useState<{
        used: number;
        remaining: number;
        limit: number;
        isVIP: boolean;
    } | null>(null);

    // 用户状态
    const [user, setUser] = useState<any>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // 获取用户 session 和配额 - 改进的认证检测
    useEffect(() => {
        const checkUser = async () => {
            try {
                console.log('[PokeFusion] 开始检查用户认证状态...');

                // 1. 首先尝试获取 Session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                console.log('[PokeFusion] Session 检查:', {
                    hasSession: !!session,
                    sessionError: sessionError?.message
                });

                // 2. 然后获取用户信息
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                console.log('[PokeFusion] 用户信息:', {
                    hasUser: !!user,
                    userId: user?.id,
                    email: user?.email,
                    userError: userError?.message
                });

                setUser(user);
                setIsLoadingAuth(false);
            } catch (error) {
                console.error('[PokeFusion] 认证检查失败:', error);
                setIsLoadingAuth(false);
            }
        };

        const fetchQuota = async () => {
            try {
                const response = await fetch('/api/get-quota');
                if (response.ok) {
                    const data = await response.json();
                    setQuota(data.quota);
                    console.log('[PokeFusion] 配额信息:', data.quota);
                }
            } catch (error) {
                console.error('[PokeFusion] 获取配额失败:', error);
            }
        };

        checkUser();
        fetchQuota();

        // 3. 监听认证状态变化（关键！）
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[PokeFusion] 认证状态变化:', { event, hasSession: !!session, userId: session?.user?.id });

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setUser(session?.user ?? null);
                    // 重新获取配额
                    fetchQuota();
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setQuota(null);
                }
            }
        );

        // 清理订阅
        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    // 当用户通过卡片选择时，只在 auto 模式下更新 Prompt
    useEffect(() => {
        if ((pokemon1 || pokemon2) && promptSource === "auto") {
            // 如果是custom风格且有自定义内容，使用自定义风格
            const effectiveStyle = style.id === 'custom' && customStyle
                ? { ...style, prompt: customStyle }
                : style;

            const generatedPrompt = buildFusionPrompt(pokemon1, pokemon2, effectiveStyle);
            setPrompt(generatedPrompt);

            // 触发高亮效果
            setPromptUpdated(true);
            setTimeout(() => setPromptUpdated(false), 600);
        }
    }, [pokemon1, pokemon2, style, customStyle, promptSource]);

    // 生成融合
    const handleGenerate = async () => {
        // 1. 客户端认证检查
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Redirecting to sign in...",
            });
            setTimeout(() => window.location.href = '/sign-in?redirect_to=/pokemon', 1500);
            return;
        }

        if (!prompt.trim()) {
            toast({
                title: "Prompt Required",
                description: "Please enter a fusion description or select Pokemon below",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            // 先检查认证错误（401）- 不尝试解析JSON
            if (response.status === 401) {
                toast({
                    title: "🔐 Authentication Required",
                    description: "Please sign in to generate Pokemon fusions",
                    variant: "destructive",
                });
                setTimeout(() => window.location.href = '/sign-in?page=pokemon-fusion&action=generate-btn-click', 2000);
                return;
            }

            // 尝试解析JSON响应
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Invalid response from server');
            }

            // 处理配额限制（429）
            if (response.status === 429) {
                const isQuotaError = data.limit !== undefined;

                if (isQuotaError) {
                    toast({
                        title: quota?.isVIP ? "💎 VIP Daily Limit Reached" : "📊 Daily Limit Reached",
                        description: data.error,
                        variant: "destructive",
                    });

                    if (!quota?.isVIP) {
                        setTimeout(() => window.location.href = '/pricing?page=pokemon-fusion&action=quota-exceeded&plan=free', 3000);
                    }
                } else {
                    toast({
                        title: "⏱️ Rate Limit",
                        description: data.error,
                        variant: "destructive",
                    });
                    return;
                }
                return;
            }

            // 处理积分不足（402）
            if (response.status === 402) {
                toast({
                    title: "🪙 Insufficient Credits",
                    description: data.error || "Please upgrade or top up to continue generating.",
                    variant: "destructive",
                });

                // 延迟跳转到定价页面
                setTimeout(() => window.location.href = data.upgradeUrl || '/pricing?page=pokemon-fusion&action=insufficient-credits', 2000);
                return;
            }

            // 其他错误
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate');
            }

            // 更新配额信息
            if (data.quota) {
                setQuota(data.quota);
            }

            setResult({
                imageUrl: data.imageUrl,
                prompt,
                pokemon1Name: pokemon1?.name || "Custom",
                pokemon2Name: pokemon2?.name || "Fusion",
                styleName: style.name,
            });

            toast({
                title: "✨ Fusion Created!",
                description: data.quota
                    ? `Generation successful! ${data.quota.remaining}/${data.quota.limit} generations remaining today${data.quota.isVIP ? ' (VIP)' : ' (Free)'}.`
                    : "Your Pokemon fusion has been generated successfully.",
            });
        } catch (error: any) {
            console.error('Generation error:', error);
            toast({
                title: "Generation Failed",
                description: error.message || "Try simplifying your prompt or check your connection",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const canGenerate = prompt.trim() && !isGenerating;

    return (
        <div id="fusion-studio" className="space-y-6 scroll-mt-20">
            <h2 className="text-2xl font-bold">Pokemon Fusion Studio</h2>

            <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-4">
                    {/* 主输入区 - 紧凑设计 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Fusion Prompt</Label>
                            <div className="flex items-center gap-2">
                                {promptSource === "manual" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setPromptSource("auto")}
                                    >
                                        Switch to Auto
                                    </Button>
                                )}
                                <Badge
                                    variant={prompt.length > 800 ? "destructive" : prompt.length > 500 ? "secondary" : "outline"}
                                    className="text-xs"
                                >
                                    {prompt.length > 800 ? "⚠️ Too long" : `${prompt.length} / 1000`}
                                </Badge>
                            </div>
                        </div>

                        <Textarea
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value.slice(0, 1000));
                                setPromptSource("manual");
                            }}
                            placeholder="Describe your fusion, or use examples/helper below..."
                            rows={3}
                            className={`resize-none transition-all duration-300 ${promptUpdated ? "ring-2 ring-primary bg-primary/5" : ""
                                }`}
                        />
                    </div>

                    {/* 生成按钮 */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        aria-label="Generate Pokemon fusion"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold py-6 text-lg"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                                Generating Fusion...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                                EVOLVE & FUSE!
                            </>
                        )}
                    </Button>

                    {/* 配额显示 */}
                    {quota && (
                        <div className="text-center text-sm text-muted-foreground">
                            {quota.isVIP ? '💎 VIP' : '👤 Free'}: {quota.remaining}/{quota.limit} generations remaining today
                        </div>
                    )}

                    {/* 提示文字 */}
                    <p className="text-center text-xs text-muted-foreground">
                        💡 Edit prompt above or select Pokemon below
                    </p>

                    {/* Pokemon 选择器 - 紧凑网格 */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-sm">Pokemon 1</Label>
                            <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto bg-muted/20">
                                <div className="grid grid-cols-3 gap-2">
                                    {POKEMON_DATABASE.filter((p: Pokemon) => p.id !== pokemon2?.id).slice(0, 12).map((p: Pokemon) => (
                                        <Card
                                            key={p.id}
                                            className={`cursor-pointer transition-all ${pokemon1?.id === p.id
                                                ? "ring-2 ring-primary shadow-lg"
                                                : "hover:border-primary/50 hover:shadow-sm"
                                                }`}
                                            onClick={() => {
                                                setPokemon1(p);
                                                setPromptSource("auto");
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Select ${p.name} as Pokemon 1`}
                                            aria-pressed={pokemon1?.id === p.id}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setPokemon1(p);
                                                    setPromptSource("auto");
                                                }
                                            }}
                                        >
                                            <CardContent className="p-2">
                                                <div className="relative w-full aspect-square bg-gray-100 rounded">
                                                    <Image
                                                        src={getPokemonImageUrl(p)}
                                                        alt={`${p.name} - ${p.types.join(', ')} type Pokemon`}
                                                        fill
                                                        sizes="(max-width: 640px) 30vw, (max-width: 768px) 25vw, 100px"
                                                        loading="lazy"
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div className="text-[11px] font-medium text-center mt-1">{p.name}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Pokemon 2</Label>
                            <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto bg-muted/20">
                                <div className="grid grid-cols-3 gap-2">
                                    {POKEMON_DATABASE.filter((p: Pokemon) => p.id !== pokemon1?.id).slice(0, 12).map((p: Pokemon) => (
                                        <Card
                                            key={p.id}
                                            className={`cursor-pointer transition-all ${pokemon2?.id === p.id
                                                ? "ring-2 ring-primary shadow-lg"
                                                : "hover:border-primary/50 hover:shadow-sm"
                                                }`}
                                            onClick={() => {
                                                setPokemon2(p);
                                                setPromptSource("auto");
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Select ${p.name} as Pokemon 2`}
                                            aria-pressed={pokemon2?.id === p.id}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setPokemon2(p);
                                                    setPromptSource("auto");
                                                }
                                            }}
                                        >
                                            <CardContent className="p-2">
                                                <div className="relative w-full aspect-square bg-gray-100 rounded">
                                                    <Image
                                                        src={getPokemonImageUrl(p)}
                                                        alt={`${p.name} - ${p.types.join(', ')} type Pokemon`}
                                                        fill
                                                        sizes="(max-width: 640px) 30vw, (max-width: 768px) 25vw, 100px"
                                                        loading="lazy"
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div className="text-[11px] font-medium text-center mt-1">{p.name}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 风格选择 */}
                    <div className="space-y-2">
                        <Label className="text-sm">Fusion Style</Label>
                        <RadioGroup
                            value={style.id}
                            onValueChange={(value) => {
                                const selectedStyle = FUSION_STYLES.find(s => s.id === value);
                                if (selectedStyle) {
                                    setStyle(selectedStyle);
                                    if (value !== 'custom') {
                                        setCustomStyle('');
                                    }
                                }
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-2"
                        >
                            {FUSION_STYLES.map((s) => (
                                <div
                                    key={s.id}
                                    className={`flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-accent ${style.id === s.id ? "bg-accent border-primary" : ""
                                        }`}
                                    onClick={() => {
                                        setStyle(s);
                                        if (s.id !== 'custom') {
                                            setCustomStyle('');
                                        }
                                    }}
                                >
                                    <RadioGroupItem value={s.id} id={s.id} />
                                    <Label htmlFor={s.id} className="text-xs cursor-pointer flex-1">
                                        {s.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        {/* Custom风格输入框 */}
                        {style.id === 'custom' && (
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Custom Style Description</Label>
                                <input
                                    type="text"
                                    value={customStyle}
                                    onChange={(e) => {
                                        setCustomStyle(e.target.value);
                                        // 触发高亮效果
                                        if (e.target.value.trim()) {
                                            setPromptUpdated(true);
                                            setTimeout(() => setPromptUpdated(false), 600);
                                        }
                                    }}
                                    placeholder="e.g., cute, dark, epic..."
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {customStyle && (
                                    <p className="text-xs text-primary">
                                        ✨ Custom style: "{customStyle}"
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 结果展示 */}
            {result && (
                <ResultDisplay
                    imageUrl={result.imageUrl}
                    prompt={result.prompt}
                    pokemon1Name={result.pokemon1Name}
                    pokemon2Name={result.pokemon2Name}
                    styleName={result.styleName}
                />
            )}

            {/* Loading骨架 */}
            {isGenerating && (
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
                        <Skeleton className="h-3 w-1/2 mx-auto mt-2" />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
