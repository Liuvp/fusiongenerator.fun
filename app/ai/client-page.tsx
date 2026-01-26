"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, Sparkles, Trash2, Dice6, RefreshCw, Download, Share2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ======================
   Types
====================== */
type UploadedFile = {
    file: File;
    preview: string;
};

type Side = "left" | "right";

/* ======================
   Utils
====================== */
function revokeFile(file: UploadedFile | null) {
    if (file?.preview) URL.revokeObjectURL(file.preview);
}

/* ======================
   UploadBox - Mobile First Design
====================== */
interface UploadBoxProps {
    side: Side;
    file: UploadedFile | null;
    onUpload: (files: File[], side: Side) => void;
    onRemove: () => void;
    disabled?: boolean;
}

function UploadBox({ side, file, onUpload, onRemove, disabled }: UploadBoxProps) {
    const [showActions, setShowActions] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        noClick: true, // Fix: disable default click to handle manually
        noKeyboard: true,
        disabled: disabled,
        onDropAccepted: (files) => onUpload(files, side),
    });

    // Toggle actions on mobile tap or open file dialog
    const handleTap = () => {
        if (file) {
            setShowActions(!showActions);
        } else {
            open(); // Fix: manually trigger open if no file
        }
    };

    if (!mounted) {
        // SSR / Initial Render Fallback - Static representation to prevent hydration mismatch
        return (
            <div className="relative w-full">
                {file ? (
                    <div className="relative aspect-square rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-lg">
                        <Image
                            src={file.preview}
                            alt={`Uploaded ${side === "left" ? "Image A" : "Image B"}`}
                            fill
                            className="object-contain p-3"
                        />
                    </div>
                ) : (
                    <div
                        className="relative w-full rounded-2xl aspect-square border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-4 bg-muted/10 cursor-wait"
                    >
                        <Upload className="h-6 w-6 text-muted-foreground mb-3" />
                        <p className="text-base font-semibold text-foreground/50">
                            {side === "left" ? "Upload Image A" : "Upload Image B"}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {file ? (
                // File Present State - No role="button" on container to avoid nested interactive elements
                <div
                    className="relative w-full rounded-2xl transition-all duration-300"
                    onClick={handleTap}
                >
                    <div className="relative aspect-square rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-lg">
                        <Image
                            src={file.preview}
                            alt={`Uploaded ${side === "left" ? "Image A" : "Image B"}`}
                            fill
                            className="object-contain p-3"
                        />

                        {/* Label Badge */}
                        <span className="absolute top-3 left-3 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-md">
                            {side === "left" ? "Image A" : "Image B"}
                        </span>

                        {/* Action Overlay - Desktop hover + Mobile tap */}
                        <div
                            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-3 ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActions(false);
                                    open();
                                }}
                                className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors shadow-lg min-h-[44px]"
                                aria-label="Replace Image"
                            >
                                <RefreshCw size={16} />
                                Replace
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActions(false);
                                    onRemove();
                                }}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-600 transition-colors shadow-lg min-h-[44px]"
                                aria-label="Remove Image"
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Upload State - Single interactive element
                <div
                    {...getRootProps()}
                    className={`relative w-full cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-2xl transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                    role="button"
                    aria-label={`Upload ${side === "left" ? "Image A" : "Image B"}`}
                    tabIndex={0}
                    onClick={handleTap}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleTap();
                        }
                    }}
                    suppressHydrationWarning
                >
                    <input {...getInputProps()} />
                    <div
                        className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${isDragActive
                            ? "border-primary bg-primary/10 scale-[1.02]"
                            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
                            }`}
                    >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-base font-semibold text-foreground">
                            {side === "left" ? "Upload Image A" : "Upload Image B"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click or drag to upload
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                            JPG, PNG, WebP (Max 5MB)
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Close Actions Hint */}
            {file && showActions && (
                <button
                    onClick={() => setShowActions(false)}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center shadow-lg md:hidden"
                    aria-label="Close menu"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

/* ======================
    Page - Mobile First Responsive
 ====================== */
export default function AIFusionStudioPage() {
    const supabase = createClient();
    const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
    const [rightFile, setRightFile] = useState<UploadedFile | null>(null);

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    /* -------- Safe Setters -------- */
    const setFileSafe = (
        setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>,
        next: UploadedFile | null
    ) => {
        setter((prev) => {
            revokeFile(prev);
            return next;
        });
    };

    /* -------- Upload Handler -------- */
    const onDrop = useCallback((files: File[], side: Side) => {
        const file = files[0];
        const wrapped: UploadedFile = {
            file,
            preview: URL.createObjectURL(file),
        };

        if (side === "left") setFileSafe(setLeftFile, wrapped);
        else setFileSafe(setRightFile, wrapped);
    }, []);

    /* -------- Cleanup -------- */
    useEffect(() => {
        return () => {
            revokeFile(leftFile);
            revokeFile(rightFile);
        };
    }, [leftFile, rightFile]);

    /* -------- Generate -------- */
    const canGenerate = !!leftFile && !!rightFile && !isGenerating;

    const startGenerate = async () => {
        if (!canGenerate) return;

        setIsGenerating(true);
        setProgress(0);
        setResultImage(null);
        setError(null);

        // Prepare FormData
        const formData = new FormData();
        formData.append("image1", leftFile.file);
        formData.append("image2", rightFile.file);
        if (prompt) formData.append("prompt", prompt);

        try {
            // Start progress animation
            const progressTimer = setInterval(() => {
                setProgress((old) => {
                    if (old >= 90) return old;
                    return old + Math.random() * 3 + 1;
                });
            }, 400);

            // Get session token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch("/api/fusion/generate", {
                method: "POST",
                headers: headers,
                body: formData,
            });

            const data = await res.json();

            clearInterval(progressTimer);
            setProgress(100);

            if (res.status === 402) {
                const errorMsg = data.error || "Insufficient credits";
                setError(errorMsg);
                // Redirect to pricing with source tracking
                setTimeout(() => {
                    window.location.href = "/pricing?source=ai_studio&reason=insufficient_credits";
                }, 2000);
                throw new Error(errorMsg);
            }

            if (!res.ok) {
                const errorMsg = data.error || "Generation failed, please try again";
                setError(errorMsg);
                throw new Error(errorMsg);
            }

            setResultImage(data.imageUrl);

            // Scroll to result on mobile
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);

        } catch (err: any) {
            setError(err.message || "An unknown error occurred");
            setProgress(0);
        } finally {
            setIsGenerating(false);
        }
    };

    /* -------- Surprise Me -------- */
    const randomPrompts = [
        "Cyberpunk style fusion",
        "Cinematic anime lighting",
        "Cute chibi fusion",
        "Dark fantasy concept art",
        "Hyper-detailed game character",
        "Watercolor art style",
        "Neon sci-fi aesthetic",
        "Classical oil painting style",
    ];

    const surpriseMe = () => {
        const p = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        setPrompt(p);
    };

    /* -------- Download Result -------- */
    const downloadResult = async () => {
        if (!resultImage) return;
        try {
            const response = await fetch(resultImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fusion-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Download failed:', e);
        }
    };

    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
    }, []);

    /* -------- Share Result -------- */
    const shareResult = async () => {
        if (!resultImage || !canShare) return;
        try {
            await navigator.share({
                title: 'AI Fusion 创作',
                text: '查看我用 AI Fusion Generator 创建的融合作品！',
                url: window.location.href,
            });
        } catch (e) {
            // Share cancelled or failed
        }
    };

    /* ======================
       Render - Mobile First
    ====================== */
    return (
        <section
            id="fusion-studio"
            className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8"
            aria-labelledby="studio-title"
        >
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 id="studio-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    AI Fusion Studio
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    Upload two images, describe the fusion style, and create unique artwork instantly.
                </p>
            </div>

            {/* Upload Section - Stack on mobile, side by side on larger screens */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                    Select Images to Fuse
                </div>

                {/* Mobile: Stack vertically for larger touch targets */}
                {/* Tablet+: Side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <UploadBox
                        side="left"
                        file={leftFile}
                        onUpload={onDrop}
                        onRemove={() => setFileSafe(setLeftFile, null)}
                        disabled={isGenerating}
                    />

                    {/* Fusion Indicator - Between images on mobile */}
                    <div className="flex sm:hidden items-center justify-center -my-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-px w-8 bg-border"></div>
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            <div className="h-px w-8 bg-border"></div>
                        </div>
                    </div>

                    <UploadBox
                        side="right"
                        file={rightFile}
                        onUpload={onDrop}
                        onRemove={() => setFileSafe(setRightFile, null)}
                        disabled={isGenerating}
                    />
                </div>
            </div>

            {/* Prompt Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                    Describe Fusion Style (Optional)
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="fusion-prompt" className="sr-only">Fusion Prompt</label>
                        <button
                            onClick={surpriseMe}
                            disabled={isGenerating}
                            className="text-sm flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors disabled:opacity-50 ml-auto min-h-[44px] px-2"
                            aria-label="Generate random prompt"
                        >
                            <Dice6 size={16} aria-hidden="true" />
                            Surprise Me
                        </button>
                    </div>
                    <input
                        id="fusion-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isGenerating}
                        placeholder="e.g. Cyberpunk style, Cinematic lighting..."
                        className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all disabled:opacity-50 min-h-[48px]"
                    />
                </div>
            </div>

            {/* Generate Button */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                    Generate Fusion
                </div>

                <button
                    disabled={!canGenerate}
                    onClick={startGenerate}
                    className={`w-full rounded-2xl py-4 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 min-h-[56px] shadow-lg ${canGenerate
                        ? "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] text-white shadow-primary/25"
                        : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                        }`}
                    aria-busy={isGenerating}
                    aria-label={isGenerating ? "Generating..." : "Generate AI Fusion"}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} aria-hidden="true" />
                            Generate Fusion
                        </>
                    )}
                </button>

                {/* Progress Bar */}
                {isGenerating && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300" role="status" aria-live="polite">
                        <div
                            role="progressbar"
                            aria-valuenow={Math.round(progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-2 rounded-full bg-muted overflow-hidden"
                        >
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            AI is creating your fusion... {Math.round(progress)}%
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && !isGenerating && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center animate-in fade-in duration-300">
                        {error}
                    </div>
                )}
            </div>

            {/* Result Display */}
            <div ref={resultRef} aria-live="polite" className="space-y-4">
                {resultImage && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl sm:text-2xl font-bold">🎨 Result</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={downloadResult}
                                    className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    aria-label="Download Image"
                                >
                                    <Download size={18} />
                                </button>
                                {canShare && (
                                    <button
                                        onClick={shareResult}
                                        className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                        aria-label="Share Image"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative aspect-square w-full rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-xl flex items-center justify-center">
                            <Image
                                src={resultImage}
                                alt="AI Generated Fusion Artwork"
                                fill
                                sizes="(max-width: 640px) 100vw, 600px"
                                quality={95}
                                unoptimized
                                className="object-contain p-2"
                                priority
                            />
                        </div>

                        {/* Create Another Button */}
                        <button
                            onClick={() => {
                                setResultImage(null);
                                setFileSafe(setLeftFile, null);
                                setFileSafe(setRightFile, null);
                                setPrompt("");
                                setError(null);
                            }}
                            className="w-full py-3 rounded-xl border-2 border-border hover:border-primary/50 text-base font-medium flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                        >
                            <RefreshCw size={18} />
                            Create New Fusion
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
