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
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import {
    DB_CHARACTERS,
    DB_FUSION_STYLES,
    DBCharacter,
    DBFusionStyle,
    buildDBPrompt
} from "@/lib/dragon-ball-data";

export function DBFusionStudio() {
    const { toast } = useToast();
    const supabase = createClient();

    // State
    const [prompt, setPrompt] = useState("");
    const [promptSource, setPromptSource] = useState<"manual" | "auto">("auto");
    const [promptUpdated, setPromptUpdated] = useState(false);
    const [char1, setChar1] = useState<DBCharacter | undefined>();
    const [char2, setChar2] = useState<DBCharacter | undefined>();
    const [style, setStyle] = useState<DBFusionStyle>(DB_FUSION_STYLES[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    // 配额状态
    const [quota, setQuota] = useState<{
        used: number;
        remaining: number;
        limit: number;
        isVIP: boolean;
    } | null>(null);

    // 组件加载时获取配额
    useEffect(() => {
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

        fetchQuota();
    }, []);

    // 自动更新 Prompt
    useEffect(() => {
        if ((char1 || char2) && promptSource === "auto") {
            const generatedPrompt = buildDBPrompt(char1, char2, style);
            setPrompt(generatedPrompt);
            setPromptUpdated(true);
            setTimeout(() => setPromptUpdated(false), 600);
        }
    }, [char1, char2, style, promptSource]);

    // 生成融合
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Prompt Required",
                description: "Select characters or enter a prompt!",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            // Auth Check
            if (response.status === 401) {
                toast({
                    title: "🔐 Authentication Required",
                    description: "Please sign in to create fusions",
                    variant: "destructive",
                });
                const currentPath = window.location.pathname;
                setTimeout(() => window.location.href = `/sign-in?redirect_to=${currentPath}`, 2000);
                return;
            }

            const data = await response.json();

            // Rate Limit Check
            if (response.status === 429) {
                toast({
                    title: "Limit Reached",
                    description: data.error,
                    variant: "destructive",
                });
                return;
            }

            if (!response.ok) throw new Error(data.error || 'Generation failed');

            // Update Quota
            if (data.quota) setQuota(data.quota);

            setResult({
                imageUrl: data.imageUrl,
                prompt,
            });

            toast({
                title: "Fusion Successful!",
                description: `Super Saiyan Power! ${data.quota.remaining} generations left.`,
            });

        } catch (error: any) {
            console.error('Generation error:', error);
            toast({
                title: "Generation Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const canGenerate = prompt.trim() && !isGenerating;

    return (
        <div id="fusion-studio" className="space-y-6 scroll-mt-20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Dragon Ball Fusion Studio
            </h2>

            <Card className="border-2 shadow-sm border-orange-500/20">
                <CardContent className="p-6 space-y-6">
                    {/* Prompt Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Fusion Prompt</Label>
                            <div className="flex items-center gap-2">
                                {promptSource === "manual" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs text-orange-600"
                                        onClick={() => setPromptSource("auto")}
                                    >
                                        Reset to Auto
                                    </Button>
                                )}
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                                    {prompt.length} / 1000
                                </Badge>
                            </div>
                        </div>
                        <Textarea
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value.slice(0, 1000));
                                setPromptSource("manual");
                            }}
                            placeholder="Describe your ultimate warrior..."
                            rows={3}
                            className={`resize-none transition-all duration-300 ${promptUpdated ? "ring-2 ring-orange-500 bg-orange-50" : ""}`}
                        />
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 font-bold py-6 text-lg shadow-lg transform active:scale-95 transition-all text-white"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                                CHARGING KI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                FUU-SION-HA!
                            </>
                        )}
                    </Button>

                    {/* Quota */}
                    {quota && (
                        <div className="text-center text-sm text-muted-foreground">
                            {quota.isVIP ? '💎 VIP' : '👤 Free'}: {quota.remaining}/{quota.limit} energy remaining
                        </div>
                    )}

                    {/* Character Selectors */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {['Character 1', 'Character 2'].map((label, idx) => {
                            const isFirst = idx === 0;
                            const selected = isFirst ? char1 : char2;
                            const setter = isFirst ? setChar1 : setChar2;
                            const other = isFirst ? char2 : char1;

                            return (
                                <div key={idx} className="space-y-2">
                                    <Label className="text-sm font-semibold text-orange-800">{label}</Label>
                                    <div className="border rounded-lg p-2 max-h-[220px] overflow-y-auto bg-muted/20 custom-scrollbar">
                                        <div className="grid grid-cols-3 gap-2">
                                            {DB_CHARACTERS.map((c) => {
                                                const isSelected = selected?.id === c.id;
                                                const isDisabled = other?.id === c.id;

                                                return (
                                                    <div
                                                        key={c.id}
                                                        className={`
                                                            relative flex flex-col items-center p-2 rounded-md cursor-pointer transition-all border-2
                                                            ${isSelected ? "border-orange-500 bg-orange-50 shadow-md scale-95" : "border-transparent hover:bg-muted hover:border-muted-foreground/20"}
                                                            ${isDisabled ? "opacity-30 cursor-not-allowed grayscale" : ""}
                                                        `}
                                                        onClick={() => !isDisabled && setter(c)}
                                                    >
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mb-1">
                                                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-center leading-tight">{c.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-orange-800">Fusion Style</Label>
                        <RadioGroup
                            value={style.id}
                            onValueChange={(val) => {
                                const s = DB_FUSION_STYLES.find(x => x.id === val);
                                if (s) setStyle(s);
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-2"
                        >
                            {DB_FUSION_STYLES.map((s) => (
                                <div
                                    key={s.id}
                                    className={`
                                        flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-orange-50 transition-colors
                                        ${style.id === s.id ? "bg-orange-100 border-orange-500" : ""}
                                    `}
                                    onClick={() => setStyle(s)}
                                >
                                    <RadioGroupItem value={s.id} id={s.id} className="text-orange-600 border-orange-600" />
                                    <Label htmlFor={s.id} className="text-xs cursor-pointer flex-1 font-medium">
                                        {s.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Result Display */}
                    {result && (
                        <div className="mt-8 pt-8 border-t animate-in fade-in zoom-in duration-500 scroll-mt-10" id="result-area">
                            <h3 className="text-xl font-bold mb-4 text-center text-orange-700">Fusion Complete!</h3>
                            <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl border-4 border-yellow-400 shadow-2xl overflow-hidden bg-black/5 flex items-center justify-center group">
                                <img
                                    src={result.imageUrl}
                                    alt="Result"
                                    className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-xl" />
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-2 italic max-w-md mx-auto">
                                "{result.prompt.slice(0, 100)}..."
                            </p>
                            <div className="mt-4 flex justify-center gap-4">
                                <Button variant="outline" onClick={() => window.open(result.imageUrl, '_blank')}>
                                    Download HD
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
