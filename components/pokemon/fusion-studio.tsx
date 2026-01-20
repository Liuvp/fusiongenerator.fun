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
import { PokemonSelector } from "./pokemon-selector";
import { ResultDisplay } from "./result-display";
import { FUSION_STYLES, POKEMON_DATABASE, getPokemonImageUrl, type Pokemon, type FusionStyle } from "@/lib/pokemon-data";
import { buildFusionPrompt, validatePokemonSelection } from "@/lib/prompt-builder";
import { useToast } from "@/hooks/use-toast";

export function PokeFusionStudio() {
    const { toast } = useToast();

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
            setTimeout(() => setPromptUpdated(false), 600); // 0.6秒后恢复
        }
    }, [pokemon1, pokemon2, style, customStyle, promptSource]);

    // 生成融合
    const handleGenerate = async () => {
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
            // 调用 Fal.ai API
            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate');
            }

            const data = await response.json();

            setResult({
                imageUrl: data.imageUrl,
                prompt,
                pokemon1Name: pokemon1?.name || "Custom",
                pokemon2Name: pokemon2?.name || "Fusion",
                styleName: style.name,
            });

            toast({
                title: "✨ Fusion Created!",
                description: "Your Pokemon fusion has been generated successfully.",
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
                            disabled={isGenerating}
                        />

                        {/* 更新提示 */}
                        {promptUpdated && (
                            <p className="text-xs text-primary animate-in fade-in duration-300">
                                ✨ Prompt updated from your selection
                            </p>
                        )}

                        {/* 生成按钮 */}
                        <Button
                            onClick={handleGenerate}
                            disabled={!canGenerate}
                            className="w-full h-11 text-base font-bold"
                            size="lg"
                        >
                            {isGenerating ? (
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center">
                                        <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                                        Generating...
                                    </div>
                                    <span className="text-xs font-normal opacity-70">
                                        You can edit prompt for next generation
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center">
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        EVOLVE & FUSE!
                                    </div>
                                    <span className="text-xs font-normal opacity-70">
                                        Generate AI Pokemon Fusion
                                    </span>
                                </div>
                            )}
                        </Button>

                        {/* 统一提示 */}
                        <p className="text-xs text-center text-muted-foreground">
                            💡 Edit prompt above or select Pokemon below
                        </p>
                    </div>

                    {/* Pokemon 选择区 */}
                    <div className="space-y-4 pt-4 border-t">

                        {/* Pokemon 选择器 - 紧凑网格 */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-sm">Pokemon 1</Label>
                                <div className="border rounded-lg p-2 max-h-[200px] overflow-y-auto bg-muted/20">
                                    <div className="grid grid-cols-3 gap-2">
                                        {POKEMON_DATABASE.filter((p: Pokemon) => p.id !== pokemon2?.id).slice(0, 12).map((p: Pokemon) => (
                                            <Card
                                                key={p.id}
                                                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-md ${pokemon1?.id === p.id
                                                    ? "ring-2 ring-primary shadow-lg"
                                                    : "hover:border-primary/50"
                                                    }`}
                                                onClick={() => {
                                                    setPokemon1(p);
                                                    setPromptSource("auto");
                                                }}
                                            >
                                                <CardContent className="p-2">
                                                    <img
                                                        src={getPokemonImageUrl(p)}
                                                        alt={p.name}
                                                        className="w-full aspect-square object-contain"
                                                    />
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
                                                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-md ${pokemon2?.id === p.id
                                                    ? "ring-2 ring-primary shadow-lg"
                                                    : "hover:border-primary/50"
                                                    }`}
                                                onClick={() => {
                                                    setPokemon2(p);
                                                    setPromptSource("auto");
                                                }}
                                            >
                                                <CardContent className="p-2">
                                                    <img
                                                        src={getPokemonImageUrl(p)}
                                                        alt={p.name}
                                                        className="w-full aspect-square object-contain"
                                                    />
                                                    <div className="text-[11px] font-medium text-center mt-1">{p.name}</div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 风格选择 - 紧凑 */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Style</Label>
                            <RadioGroup
                                value={style.id}
                                onValueChange={(value) => setStyle(FUSION_STYLES.find(s => s.id === value)!)}
                                className="grid grid-cols-5 gap-2"
                            >
                                {FUSION_STYLES.map((s) => (
                                    <Label
                                        key={s.id}
                                        htmlFor={s.id}
                                        className={`flex items-center justify-center border rounded-md p-2 cursor-pointer text-xs ${style.id === s.id ? 'border-primary bg-primary/5' : 'border-input'
                                            }`}
                                    >
                                        <RadioGroupItem value={s.id} id={s.id} className="sr-only" />
                                        {s.name}
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* 自定义风格输入框 */}
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
                                    placeholder="e.g., watercolor painting, pixel art, cyberpunk..."
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {customStyle && (
                                    <p className="text-xs text-primary">
                                        ✨ Custom style: "{customStyle}"
                                    </p>
                                )}
                            </div>
                        )}

                        {pokemon1 && pokemon2 && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    ✨ Prompt updated! Click EVOLVE & FUSE when ready.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Loading 状态 */}
            {
                isGenerating && (
                    <Card className="border-2 border-primary/20">
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="w-full aspect-square rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                Usually takes 5–10 seconds
                            </p>
                        </CardContent>
                    </Card>
                )
            }

            {/* 结果展示 */}
            {
                result && !isGenerating && (
                    <ResultDisplay
                        {...result}
                        onDownload={() => {
                            toast({
                                title: "Download Started",
                                description: "Your fusion is being downloaded.",
                            });
                        }}
                        onSave={() => {
                            toast({
                                title: "Saved!",
                                description: "Your fusion has been saved to your profile.",
                            });
                        }}
                        onShare={() => {
                            toast({
                                title: "Share",
                                description: "Share functionality coming soon!",
                            });
                        }}
                    />
                )
            }
        </div >
    );
}
