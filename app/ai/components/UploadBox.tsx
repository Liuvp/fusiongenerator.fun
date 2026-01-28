"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, Trash2, RefreshCw, X } from "lucide-react";

/* ======================
   Types
====================== */
export type UploadedFile = {
    file: File;
    preview: string;
};

export type Side = "left" | "right";

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

export default function UploadBox({ side, file, onUpload, onRemove, disabled }: UploadBoxProps) {
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
