"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Heart } from "lucide-react";
import Image from "next/image";

interface ResultDisplayProps {
    imageUrl: string;
    prompt: string;
    pokemon1Name: string;
    pokemon2Name: string;
    styleName: string;
    onDownload?: () => void;
    onShare?: () => void;
    onSave?: () => void;
}

export function ResultDisplay({
    imageUrl,
    prompt,
    pokemon1Name,
    pokemon2Name,
    styleName,
    onDownload,
    onShare,
    onSave
}: ResultDisplayProps) {
    return (
        <Card className="border-2 border-primary/20">
            <CardContent className="p-6 space-y-4">
                {/* 标题 */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {pokemon1Name} × {pokemon2Name}
                    </h3>
                    <Badge variant="secondary">{styleName}</Badge>
                </div>

                {/* 生成的图片 */}
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={`${pokemon1Name} and ${pokemon2Name} fusion`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Prompt 信息 */}
                <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-mono line-clamp-2">
                        {prompt}
                    </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-2">
                    <Button onClick={onDownload} variant="default" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>

                    <Button onClick={onSave} variant="outline" className="flex-1">
                        <Heart className="h-4 w-4 mr-2" />
                        Save to Profile
                    </Button>

                    <Button onClick={onShare} variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>

                {/* 提示信息 */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        💡 <strong>Tip:</strong> Your fusion is saved privately by default.
                        You can share it to the gallery from your profile.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
