"use client";

import { useState } from "react";
import Image from "next/image";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, Trash2, RefreshCw, X } from "lucide-react";
import StaticUploadBox from "./StaticUploadBox";
import { isClient } from "../utils/safeHydration";

export type UploadedFile = {
    file: File;
    preview: string;
};

export type Side = "left" | "right";

interface UploadBoxProps {
    side: Side;
    file: UploadedFile | null;
    onUpload: (files: File[], side: Side) => void;
    onReject?: (side: Side, reason: string) => void;
    onRemove: () => void;
    disabled?: boolean;
    staticMode?: boolean;
    highlight?: boolean;
}

const getDropRejectedMessage = (rejections: FileRejection[]): string => {
    const codes = new Set(
        rejections.flatMap((item) => item.errors.map((error) => error.code))
    );

    if (codes.has("file-invalid-type")) return "Unsupported format. Use JPG, PNG, or WebP.";
    if (codes.has("file-too-large")) return "File is too large. Max size is 5MB.";
    if (codes.has("too-many-files")) return "Please upload one image at a time.";
    return "Upload failed. Please try another image.";
};

export default function UploadBox({
    side,
    file,
    onUpload,
    onReject,
    onRemove,
    disabled,
    staticMode = false,
    highlight = false,
}: UploadBoxProps) {
    const [showActions, setShowActions] = useState(false);

    if (!isClient || staticMode) {
        return (
            <StaticUploadBox
                side={side}
                className={highlight ? "rounded-2xl ring-2 ring-red-400 ring-offset-2" : ""}
            />
        );
    }

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        noClick: true,
        noKeyboard: true,
        disabled,
        onDropAccepted: (files) => onUpload(files, side),
        onDropRejected: (rejections) => {
            onReject?.(side, getDropRejectedMessage(rejections));
        },
    });

    const handleTap = (): void => {
        if (file) {
            setShowActions(!showActions);
            return;
        }
        open();
    };

    return (
        <div className="relative w-full">
            {file ? (
                <div className="relative w-full rounded-2xl transition-all duration-300" onClick={handleTap}>
                    <div className="relative aspect-square rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-lg">
                        <Image
                            src={file.preview}
                            alt={`Uploaded ${side === "left" ? "Image A" : "Image B"}`}
                            fill
                            decoding="async"
                            className="object-contain p-3"
                        />

                        <span className="absolute top-3 left-3 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-md">
                            {side === "left" ? "Image A" : "Image B"}
                        </span>

                        <div
                            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                                showActions
                                    ? "opacity-100 pointer-events-auto"
                                    : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setShowActions(false);
                                    open();
                                }}
                                className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors shadow-lg min-h-[44px]"
                                aria-label="Replace image"
                            >
                                <RefreshCw size={16} />
                                Replace
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setShowActions(false);
                                    onRemove();
                                }}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-600 transition-colors shadow-lg min-h-[44px]"
                                aria-label="Remove image"
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`relative w-full cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-2xl transition-all duration-300 ${
                        highlight ? "ring-2 ring-red-400 ring-offset-2" : ""
                    } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                    role="button"
                    aria-label={`Upload ${side === "left" ? "Image A" : "Image B"}`}
                    tabIndex={0}
                    onClick={handleTap}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            handleTap();
                        }
                    }}
                >
                    <input {...getInputProps()} aria-label={`Upload file for ${side === "left" ? "Image A" : "Image B"}`} />
                    <div
                        className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
                            isDragActive
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
                        <p className="text-sm text-muted-foreground mt-1 text-center">Click or drag to upload</p>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                </div>
            )}

            {file && showActions && (
                <button
                    type="button"
                    onClick={() => setShowActions(false)}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center shadow-lg md:hidden"
                    aria-label="Close image actions"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
