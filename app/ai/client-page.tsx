"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ChevronDown, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function FusionClientPage() {
    const [leftImage, setLeftImage] = useState<string | null>(null);
    const [rightImage, setRightImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (side === 'left') setLeftImage(e.target?.result as string);
                else setRightImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!leftImage || !rightImage) {
            toast({
                title: "Images Required",
                description: "Please upload both images to start fusion.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            const response = await fetch("/api/fusion/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image1: leftImage, // In real app, maybe upload to storage first and send URL
                    image2: rightImage,
                    fusionStrength: 60
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    // Hit free limit
                    toast({
                        title: "Daily Limit Reached",
                        description: "You've reached your free daily limit. Upgrade to Pro for unlimited fusions!",
                        variant: "destructive",
                        action: (
                            <Button variant="outline" size="sm" onClick={() => router.push("/pricing")}>
                                Upgrade
                            </Button>
                        )
                    });
                } else {
                    throw new Error(data.error || "Generation failed");
                }
            } else {
                setResultImage(data.imageUrl);
                toast({
                    title: "Fusion Complete!",
                    description: "Your masterpiece is ready.",
                });
            }

        } catch (error: any) {
            console.error("Generation error:", error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 scroll-mt-20" id="fusion-studio">
            <h2 className="text-2xl font-bold">AI Fusion Studio</h2>
            <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-8">
                    {/* Upload Areas */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Left Image */}
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                Upload Left Image
                            </div>
                            <div
                                className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden h-64"
                                onClick={() => document.getElementById('left-upload')?.click()}
                            >
                                <input
                                    id="left-upload"
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'left')}
                                />

                                {leftImage ? (
                                    <Image src={leftImage} alt="Left upload" fill className="object-contain p-2" />
                                ) : (
                                    <>
                                        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Drop or Click to Upload
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                Upload Right Image
                            </div>
                            <div
                                className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden h-64"
                                onClick={() => document.getElementById('right-upload')?.click()}
                            >
                                <input
                                    id="right-upload"
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'right')}
                                />
                                {rightImage ? (
                                    <Image src={rightImage} alt="Right upload" fill className="object-contain p-2" />
                                ) : (
                                    <>
                                        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Drop or Click to Upload
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings & Action */}
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Fusion Series</div>
                            <div className="relative">
                                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                    <option>Dragon Ball</option>
                                    <option>Pokemon</option>
                                    <option>Anime Characters</option>
                                    <option>Custom Images</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Fusion Style</div>
                            <div className="relative">
                                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                    <option>Balanced Hybrid</option>
                                    <option>Left-Dominant</option>
                                    <option>Right-Dominant</option>
                                    <option>Artistic Blend</option>
                                    <option>Realistic Merge</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <Button
                                className="w-full h-12 text-base font-bold tracking-wide"
                                onClick={handleGenerate}
                                disabled={isGenerating || !leftImage || !rightImage}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        FUSING...
                                    </>
                                ) : (
                                    "GENERATE AI FUSION"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Result Area */}
                    {resultImage && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                            <div className="h-px bg-border" />
                            <h3 className="text-xl font-bold text-center">Fusion Result</h3>
                            <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden border-2 shadow-lg">
                                <Image src={resultImage} alt="Fusion Result" fill className="object-cover" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" onClick={() => window.open(resultImage, '_blank')}>
                                    Download HD
                                </Button>
                                <Button variant="ghost" onClick={() => { setLeftImage(null); setRightImage(null); setResultImage(null); }}>
                                    Start Over
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
