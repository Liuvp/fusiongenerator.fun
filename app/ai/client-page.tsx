"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, Sparkles, Trash2, Dice6 } from "lucide-react";

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
   UploadBox
====================== */
interface UploadBoxProps {
    side: Side;
    file: UploadedFile | null;
    onUpload: (files: File[], side: Side) => void;
    onRemove: () => void;
}

function UploadBox({ side, file, onUpload, onRemove }: UploadBoxProps) {
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        noClick: !!file,
        noKeyboard: !!file,
        onDropAccepted: (files) => onUpload(files, side),
    });

    return (
        <div
            {...getRootProps()}
            className="relative w-full cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl"
            role="button"
            aria-label={file ? `Change uploaded image for ${side} side` : `Upload image for ${side} side`}
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    open();
                }
            }}
        >
            <input {...getInputProps()} />

            {
                file ? (
                    <div className="relative aspect-square rounded-xl border bg-muted/30 overflow-hidden">
                        <Image
                            src={file.preview}
                            alt=""
                            fill
                            className="object-contain p-2"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                                aria-label="Replace image"
                            >
                                Replace
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove();
                                }}
                                aria-label="Remove image"
                            >
                                <Trash2 size={12} /> Remove
                            </button>
                        </div>

                        <span className="absolute top-2 left-2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                            {side === "left" ? "Image A" : "Image B"}
                        </span>
                    </div>
                ) : (
                    <div
                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition ${isDragActive ? "border-primary bg-primary/5" : "border-muted"
                            }`}
                    >
                        <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                            {side === "left" ? "Upload A" : "Upload B"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Click or drag
                        </p>
                    </div>
                )
            }
        </div >
    );
}

import { createClient } from "@/utils/supabase/client";

/* ======================
    Page
 ====================== */
export default function AIFusionStudioPage() {
    const supabase = createClient();
    const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
    const [rightFile, setRightFile] = useState<UploadedFile | null>(null);

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultImage, setResultImage] = useState<string | null>(null);

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

        // Prepare FormData
        const formData = new FormData();
        formData.append("image1", leftFile.file);
        formData.append("image2", rightFile.file);
        if (prompt) formData.append("prompt", prompt);

        try {
            // Start fake progress for better UX
            const start = Date.now();
            const progressTimer = setInterval(() => {
                setProgress((old) => {
                    if (old >= 90) return old;
                    return old + 2; // slow increment
                });
            }, 500);

            // Explicitly get session token to ensure auth works even if cookies flake
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

            if (!res.ok) {
                // DEBUG MODE: NO REDIRECTS to see real error
                const errorMsg = data.error || "Unknown Error";
                alert(`API Error: ${res.status}\nMessage: ${errorMsg}\n(Raw data: ${JSON.stringify(data)})`);
                throw new Error(errorMsg);
            }

            setResultImage(data.imageUrl);

        } catch (error: any) {
            // Only alert if it's not a redirect (though windows.location.href usually interrupts)
            if (!error.message.includes("generate")) { // Basic check, but usually the redirect happens first
                alert(error.message);
            }
            setProgress(0);
        } finally {
            setIsGenerating(false);
        }
    };

    /* -------- Surprise Me -------- */
    const randomPrompts = [
        "Cyberpunk style fusion",
        "Anime cinematic lighting",
        "Cute chibi fusion",
        "Dark fantasy concept art",
        "Ultra detailed game character",
    ];

    const surpriseMe = () => {
        const p =
            randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        setPrompt(p);
    };

    /* ======================
       Render
    ====================== */
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold">AI Fusion Studio</h1>
                <p className="text-sm text-muted-foreground">
                    Upload two images, describe the fusion, generate instantly.
                </p>
            </div>

            {/* Uploads */}
            <div className="grid grid-cols-2 gap-4">
                <UploadBox
                    side="left"
                    file={leftFile}
                    onUpload={onDrop}
                    onRemove={() => setFileSafe(setLeftFile, null)}
                />
                <UploadBox
                    side="right"
                    file={rightFile}
                    onUpload={onDrop}
                    onRemove={() => setFileSafe(setRightFile, null)}
                />
            </div>

            {/* Prompt */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Fusion Prompt (Optional)</label>
                    <button
                        onClick={surpriseMe}
                        className="text-xs flex items-center gap-1 text-primary hover:underline"
                    >
                        <Dice6 size={14} aria-hidden="true" /> Surprise Me
                    </button>
                </div>
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Cyberpunk style fusion"
                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    aria-label="Enter a prompt for the fusion style"
                />
            </div>

            {/* Generate */}
            <div className="space-y-4">
                <button
                    disabled={!canGenerate}
                    onClick={startGenerate}
                    className={`w-full rounded-xl py-3 text-lg font-semibold flex items-center justify-center gap-2 transition ${canGenerate
                        ? "bg-primary text-white hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                    aria-busy={isGenerating}
                    aria-label="Generate AI fusion from uploaded images"
                >
                    <Sparkles size={18} aria-hidden="true" />
                    {isGenerating ? "Generating..." : "Generate Fusion"}
                </button>

                {isGenerating && (
                    <div className="space-y-2">
                        <div className="h-2 rounded bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Fusing images… {progress}%
                        </p>
                    </div>
                )}
            </div>

            {/* Result Display */}
            {resultImage && (
                <div className="space-y-2 animate-in fade-in duration-500">
                    <h2 className="text-xl font-bold">Fusion Result</h2>
                    <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl border bg-muted/30 overflow-hidden flex items-center justify-center">
                        <Image
                            src={resultImage}
                            alt="AI generated fusion result showing the combination of the two uploaded images"
                            fill
                            sizes="(max-width: 768px) 100vw, 500px"
                            quality={95}
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
