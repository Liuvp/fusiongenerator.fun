"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptEditorProps {
    prompt: string;
    onChange: (prompt: string) => void;
    label?: string;
}

export function PromptEditor({ prompt, onChange, label = "Generated Fusion Prompt" }: PromptEditorProps) {
    const charCount = prompt.length;
    const maxChars = 500;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">{label}</Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    This prompt is automatically generated based on your selections.
                                    You can edit it before generating your fusion.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Badge variant="outline" className="text-xs">
                    {charCount} / {maxChars}
                </Badge>
            </div>

            <Textarea
                value={prompt}
                onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
                rows={4}
                className="font-mono text-sm resize-none"
                placeholder="Your fusion prompt will appear here..."
            />

            <p className="text-xs text-muted-foreground">
                💡 You can edit this prompt to customize your fusion before generating
            </p>
        </div>
    );
}
