"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FUSION_STYLES, FusionStyle } from "@/lib/pokemon-data";

interface SettingsPanelProps {
    style: FusionStyle;
    setStyle: (style: FusionStyle) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    setPromptSource: (source: "manual" | "auto") => void;
}

export function SettingsPanel({ style, setStyle, prompt, setPrompt, setPromptSource }: SettingsPanelProps) {
    return (
        <Card className="border-0 shadow-sm mb-6 bg-slate-50">
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold">Fusion Style</Label>
                    <RadioGroup
                        value={style.id}
                        onValueChange={(v) => {
                            const found = FUSION_STYLES.find(s => s.id === v);
                            if (found) setStyle(found);
                        }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                        {FUSION_STYLES.map(s => (
                            <div key={s.id} className={`flex items-center space-x-2 border rounded p-2 cursor-pointer bg-white transition-all ${style.id === s.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'hover:border-blue-200'}`}>
                                <RadioGroupItem value={s.id} id={s.id} />
                                <Label htmlFor={s.id} className="text-xs cursor-pointer flex-1 user-select-none">{s.name}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-semibold">Prompt Override</Label>
                        <span className="text-[10px] text-gray-400">Optional</span>
                    </div>
                    <Textarea
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            setPromptSource("manual");
                        }}
                        className="text-xs h-20 bg-white resize-none focus:ring-blue-500"
                        placeholder="E.g., 'wearing golden armor, cinematic lighting'..."
                    />
                </div>
            </CardContent>
        </Card>
    );
}
