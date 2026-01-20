"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Heart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultDisplayProps {
    imageUrl: string;
    prompt: string;
    pokemon1Name: string;
    pokemon2Name: string;
    styleName: string;
}

export function ResultDisplay({
    imageUrl,
    prompt,
    pokemon1Name,
    pokemon2Name,
    styleName,
}: ResultDisplayProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // 下载图片
    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pokemon1Name}-${pokemon2Name}-fusion.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "✅ Download Started",
                description: "Your fusion image is being downloaded.",
            });
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Failed to download image. Please try again.",
                variant: "destructive",
            });
        }
    };

    // 分享（复制链接）
    const handleShare = async () => {
        try {
            if (navigator.share) {
                // 使用Web Share API（移动设备）
                await navigator.share({
                    title: `${pokemon1Name} × ${pokemon2Name} Fusion`,
                    text: `Check out this Pokemon fusion!`,
                    url: imageUrl,
                });
            } else {
                // 复制图片URL到剪贴板
                await navigator.clipboard.writeText(imageUrl);
                toast({
                    title: "🔗 Link Copied",
                    description: "Image URL copied to clipboard. You can share it now!",
                });
            }
        } catch (error) {
            toast({
                title: "Share Failed",
                description: "Failed to share. Please try copying the link manually.",
                variant: "destructive",
            });
        }
    };

    // 保存到Profile
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/save-fusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl,
                    prompt,
                    pokemon1Name,
                    pokemon2Name,
                    styleName,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save');
            }

            setIsSaved(true);
            toast({
                title: "💾 Saved to Profile",
                description: "Your fusion has been saved. View it in your profile!",
            });
        } catch (error: any) {
            toast({
                title: "Save Failed",
                description: error.message || "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

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
                    <img
                        src={imageUrl}
                        alt={`${pokemon1Name} and ${pokemon2Name} fusion`}
                        className="w-full h-full object-contain"
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
                    <Button onClick={handleDownload} variant="default" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>

                    <Button
                        onClick={handleSave}
                        variant="outline"
                        className="flex-1"
                        disabled={isSaving || isSaved}
                    >
                        {isSaved ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Heart className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save to Profile"}
                            </>
                        )}
                    </Button>

                    <Button onClick={handleShare} variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>

                {/* 提示信息 */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        💡 <strong>Tip:</strong> Download to save locally, or use "Save to Profile" to keep it in your gallery.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
