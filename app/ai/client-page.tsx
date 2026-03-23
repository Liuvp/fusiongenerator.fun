"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Dice6, RefreshCw, Download, Share2 } from "lucide-react";
import UploadBox, { UploadedFile, Side } from "./components/UploadBox";
import { createClient } from "@/utils/supabase/client";
import { toAnalyticsErrorMessage } from "@/utils/analytics";

type AuthGateKind = "guest_limit" | "member_credits";

type AuthGateState = {
    kind: AuthGateKind;
    title: string;
    description: string;
} | null;

type StudioEventPayload = Record<string, string | number | boolean | null | undefined>;
type QuotaSnapshot = {
    used: number;
    remaining: number;
    limit: number;
    isVIP: boolean;
    type?: "anonymous" | "credits" | "daily_limit";
} | null;

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
const DUPLICATE_SUBMIT_WINDOW_MS = 1500;

const trackStudioEvent = (eventName: string, payload: StudioEventPayload = {}): void => {
    if (typeof window === "undefined") return;

    try {
        const globalWindow = window as Window & { gtag?: (...args: unknown[]) => void };
        if (typeof globalWindow.gtag === "function") {
            globalWindow.gtag("event", eventName, payload);
        }
    } catch (error) {
        console.warn("Failed to track AI studio event:", error);
    }
};

const revokeFile = (file: UploadedFile | null): void => {
    if (file?.preview) URL.revokeObjectURL(file.preview);
};

const normalizeGenerationError = (
    status: number,
    data: unknown
): { message: string; authGate: AuthGateState } => {
    const errorText = (() => {
        if (data && typeof data === "object") {
            if ("error" in data && typeof data.error === "string") return data.error;
            if ("message" in data && typeof data.message === "string") return data.message;
        }
        return "";
    })();

    const normalized = errorText.toLowerCase();
    const isLimit =
        status === 402 ||
        status === 429 ||
        normalized.includes("limit reached") ||
        normalized.includes("free trial");
    const isGuestLimit =
        data !== null &&
        typeof data === "object" &&
        "isLimitReached" in data &&
        Boolean(data.isLimitReached);

    if (isLimit && isGuestLimit) {
        return {
            message: "Free quota used. Log in to continue generating.",
            authGate: {
                kind: "guest_limit",
                title: "Continue with a free account",
                description: "Sign in or create a free account to unlock more generations and keep exploring ideas.",
            },
        };
    }

    if (isLimit) {
        return {
            message: "Not enough credits. Upgrade to continue generating.",
            authGate: {
                kind: "member_credits",
                title: "Need more generation credits?",
                description: "Upgrade to unlock more AI fusion generations.",
            },
        };
    }

    if (status === 503 || normalized.includes("temporarily unavailable")) {
        return {
            message: "Service is temporarily unavailable. Please try again in a moment.",
            authGate: null,
        };
    }

    if (normalized.includes("timeout") || normalized.includes("busy")) {
        return {
            message: "Generation is taking longer than expected. Please retry.",
            authGate: null,
        };
    }

    if (status >= 500) {
        return {
            message: "Generation failed due to a server error. Please try again.",
            authGate: null,
        };
    }

    return {
        message: errorText || "Generation failed. Please try again.",
        authGate: null,
    };
};

export default function AIFusionStudioPage() {
    const supabase = useMemo(() => createClient(), []);
    const resultRef = useRef<HTMLDivElement>(null);
    const generateLockRef = useRef(false);
    const lastSubmissionRef = useRef<{ signature: string; timestamp: number } | null>(null);

    const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
    const [rightFile, setRightFile] = useState<UploadedFile | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [authGate, setAuthGate] = useState<AuthGateState>(null);
    const [missingSides, setMissingSides] = useState<Side[]>([]);
    const [canShare, setCanShare] = useState(false);
    const [isActionHintActive, setIsActionHintActive] = useState(false);
    const [quota, setQuota] = useState<QuotaSnapshot>(null);
    const [isQuotaLoading, setIsQuotaLoading] = useState(true);
    const [showPromptControls, setShowPromptControls] = useState(false);
    const [isHashFocused, setIsHashFocused] = useState(false);

    const setFileSafe = (
        setter: Dispatch<SetStateAction<UploadedFile | null>>,
        next: UploadedFile | null
    ) => {
        setter((previous) => {
            revokeFile(previous);
            return next;
        });
    };

    const onDropAccepted = useCallback((files: File[], side: Side) => {
        const file = files[0];
        const wrapped: UploadedFile = {
            file,
            preview: URL.createObjectURL(file),
        };

        if (side === "left") {
            setFileSafe(setLeftFile, wrapped);
        } else {
            setFileSafe(setRightFile, wrapped);
        }

        setMissingSides((previous) => previous.filter((item) => item !== side));
        setError(null);
        setAuthGate(null);
        trackStudioEvent("ai_upload_success", {
            side,
            size_kb: Math.round(file.size / 1024),
            type: file.type,
        });
    }, []);

    const onDropRejected = useCallback((side: Side, reason: string) => {
        setError(reason);
        setAuthGate(null);
        setMissingSides((previous) => (previous.includes(side) ? previous : [...previous, side]));
        setIsActionHintActive(true);
        setTimeout(() => setIsActionHintActive(false), 500);
        trackStudioEvent("ai_upload_reject", {
            side,
            reason,
        });
    }, []);

    useEffect(() => {
        return () => {
            revokeFile(leftFile);
            revokeFile(rightFile);
        };
    }, [leftFile, rightFile]);

    useEffect(() => {
        setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    }, []);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            trackStudioEvent("ai_runtime_error", {
                page: "ai_studio",
                message: toAnalyticsErrorMessage(event.error || event.message),
            });
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            trackStudioEvent("ai_runtime_error", {
                page: "ai_studio",
                message: toAnalyticsErrorMessage(event.reason),
            });
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);
        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    useEffect(() => {
        const highlightStudioFromHash = (): void => {
            if (typeof window === "undefined") return;
            if (window.location.hash !== "#fusion-studio") return;

            setIsHashFocused(true);
            window.setTimeout(() => setIsHashFocused(false), 1400);
        };

        highlightStudioFromHash();
        window.addEventListener("hashchange", highlightStudioFromHash);
        return () => window.removeEventListener("hashchange", highlightStudioFromHash);
    }, []);

    const refreshQuota = useCallback(async (options?: { silent?: boolean }): Promise<void> => {
        if (!options?.silent) {
            setIsQuotaLoading(true);
        }

        try {
            const response = await fetch("/api/get-quota", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                setQuota(null);
                return;
            }

            const data = await response.json();
            if (data && typeof data === "object" && "quota" in data) {
                setQuota((data as { quota: QuotaSnapshot }).quota ?? null);
            } else {
                setQuota(null);
            }
        } catch (error) {
            setQuota(null);
        } finally {
            if (!options?.silent) {
                setIsQuotaLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        void refreshQuota();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            if (!mounted) return;
            void refreshQuota();
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [refreshQuota, supabase.auth]);

    const canGenerate = Boolean(leftFile && rightFile) && !isGenerating;
    const canRetry = Boolean(leftFile && rightFile) && !isGenerating;
    const isQuotaBlocked = Boolean(quota && !quota.isVIP && quota.remaining <= 0);
    const quotaStatusCopy = useMemo(() => {
        if (isQuotaLoading) {
            return {
                title: "Checking your free quota...",
                description: "We show remaining attempts before generation so you know what to expect.",
                tone: "neutral" as const,
            };
        }

        if (!quota) {
            return {
                title: "Free access is available",
                description: "Quota details could not be loaded yet. You can still try generating.",
                tone: "neutral" as const,
            };
        }

        if (quota.isVIP) {
            return {
                title: "VIP active: unlimited generations",
                description: "You can generate and download without free-tier limits.",
                tone: "positive" as const,
            };
        }

        if (quota.remaining > 0) {
            if (quota.type === "anonymous") {
                return {
                    title: `${quota.remaining} free guest attempt${quota.remaining === 1 ? "" : "s"} left`,
                    description: "When this reaches 0, sign-in is required before the next generation.",
                    tone: "positive" as const,
                };
            }

            return {
                title: `${quota.remaining} credit${quota.remaining === 1 ? "" : "s"} remaining`,
                description: "Each generation uses one credit.",
                tone: "positive" as const,
            };
        }

        if (quota.type === "anonymous") {
            return {
                title: "Free guest quota used",
                description: "Sign in to continue generating before uploading and submitting again.",
                tone: "warning" as const,
            };
        }

        return {
            title: "No credits left",
            description: "Upgrade to continue generating AI fusions.",
            tone: "warning" as const,
        };
    }, [isQuotaLoading, quota]);

    const getSubmissionSignature = (left: UploadedFile, right: UploadedFile): string =>
        [
            left.file.name,
            left.file.size,
            left.file.lastModified,
            right.file.name,
            right.file.size,
            right.file.lastModified,
            prompt.trim().toLowerCase(),
        ].join("|");

    const startGenerate = async (): Promise<void> => {
        if (generateLockRef.current || isGenerating) {
            trackStudioEvent("ai_generate_blocked", { reason: "request_in_flight" });
            return;
        }

        trackStudioEvent("ai_generate_click", {
            has_left_image: Boolean(leftFile),
            has_right_image: Boolean(rightFile),
            has_prompt: Boolean(prompt.trim()),
        });

        const missing: Side[] = [];
        if (!leftFile) missing.push("left");
        if (!rightFile) missing.push("right");

        if (missing.length > 0) {
            setMissingSides(missing);
            setAuthGate(null);
            setIsActionHintActive(true);
            setTimeout(() => setIsActionHintActive(false), 500);

            const missingLabel =
                missing.length === 2
                    ? "Upload both Image A and Image B first."
                    : `Upload ${missing[0] === "left" ? "Image A" : "Image B"} first.`;
            setError(missingLabel);

            trackStudioEvent("ai_generate_blocked", {
                reason: "missing_upload",
                missing_count: missing.length,
            });
            return;
        }

        const selectedLeft = leftFile;
        const selectedRight = rightFile;
        if (!selectedLeft || !selectedRight) {
            setError("Upload both images before generating.");
            setAuthGate(null);
            return;
        }

        if (isQuotaBlocked) {
            const nextAuthGate: AuthGateState =
                quota?.type === "anonymous"
                    ? {
                        kind: "guest_limit",
                        title: "Continue your fusion session",
                        description: "Free guest quota is used. Sign in before generating again.",
                    }
                    : {
                        kind: "member_credits",
                        title: "Need more generation credits?",
                        description: "Upgrade to unlock more AI fusion generations.",
                    };

            setAuthGate(nextAuthGate);
            setError(
                nextAuthGate.kind === "guest_limit"
                    ? "Free quota used. Log in to continue generating."
                    : "Not enough credits. Upgrade to continue generating."
            );
            setIsActionHintActive(true);
            setTimeout(() => setIsActionHintActive(false), 500);
            trackStudioEvent("ai_generate_blocked", {
                reason: "quota_blocked_before_request",
                quota_type: quota?.type ?? "unknown",
            });
            trackStudioEvent("ai_auth_gate_open", {
                kind: nextAuthGate.kind,
                status: 0,
            });
            return;
        }

        const requestSignature = getSubmissionSignature(selectedLeft, selectedRight);
        const now = Date.now();
        const previousSubmission = lastSubmissionRef.current;
        if (
            previousSubmission
            && previousSubmission.signature === requestSignature
            && now - previousSubmission.timestamp < DUPLICATE_SUBMIT_WINDOW_MS
        ) {
            setAuthGate(null);
            setError("Generation already submitted. Please wait a moment before trying again.");
            setIsActionHintActive(true);
            setTimeout(() => setIsActionHintActive(false), 500);
            trackStudioEvent("ai_generate_blocked", {
                reason: "duplicate_submit",
                cooldown_ms: DUPLICATE_SUBMIT_WINDOW_MS,
            });
            return;
        }

        lastSubmissionRef.current = { signature: requestSignature, timestamp: now };
        generateLockRef.current = true;
        setMissingSides([]);
        setIsGenerating(true);
        setProgress(0);
        setResultImage(null);
        setError(null);
        setAuthGate(null);

        const formData = new FormData();
        formData.append("image1", selectedLeft.file);
        formData.append("image2", selectedRight.file);
        if (prompt.trim()) formData.append("prompt", prompt.trim());

        let progressTimer: ReturnType<typeof setInterval> | null = null;
        let success = false;

        try {
            progressTimer = setInterval(() => {
                setProgress((previous) => (previous >= 90 ? previous : previous + Math.random() * 3 + 1));
            }, 400);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            const headers: Record<string, string> = {};
            if (session?.access_token) {
                headers.Authorization = `Bearer ${session.access_token}`;
            }

            const response = await fetch("/api/fusion/generate", {
                method: "POST",
                headers,
                body: formData,
            });

            let data: unknown = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                const normalized = normalizeGenerationError(response.status, data);
                setError(normalized.message);
                setAuthGate(normalized.authGate);
                setProgress(0);
                void refreshQuota({ silent: true });

                if (normalized.authGate) {
                    trackStudioEvent("ai_auth_gate_open", {
                        kind: normalized.authGate.kind,
                        status: response.status,
                    });
                }

                trackStudioEvent("ai_generate_fail", {
                    status: response.status,
                    reason: normalized.authGate?.kind || "api_error",
                });
                return;
            }

            const imageUrl =
                data && typeof data === "object" && "imageUrl" in data && typeof data.imageUrl === "string"
                    ? data.imageUrl
                    : null;

            if (!imageUrl) {
                setError("Generation finished but no image was returned. Please retry.");
                setProgress(0);
                trackStudioEvent("ai_generate_fail", {
                    status: response.status,
                    reason: "empty_image_url",
                });
                return;
            }

            setResultImage(imageUrl);
            setProgress(100);
            setAuthGate(null);
            success = true;
            void refreshQuota({ silent: true });

            trackStudioEvent("ai_generate_success", {
                has_prompt: Boolean(prompt.trim()),
            });

            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 250);
        } catch (err: unknown) {
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : "Network error. Please check your connection and try again.";
            setError(message);
            setProgress(0);
            trackStudioEvent("ai_generate_fail", {
                status: 0,
                reason: "runtime_error",
            });
        } finally {
            if (progressTimer) clearInterval(progressTimer);
            if (!success) setProgress((previous) => (previous === 100 ? 100 : 0));
            generateLockRef.current = false;
            setIsGenerating(false);
        }
    };

    const surpriseMe = (): void => {
        const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        setShowPromptControls(true);
        setPrompt(randomPrompt);
        trackStudioEvent("ai_prompt_randomized", { prompt: randomPrompt });
    };

    const downloadResult = async (): Promise<void> => {
        if (!resultImage) return;
        try {
            const response = await fetch(resultImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `fusion-${Date.now()}.png`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
            trackStudioEvent("ai_result_download");
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const shareResult = async (): Promise<void> => {
        if (!resultImage || !canShare) return;
        try {
            await navigator.share({
                title: "AI Fusion Creation",
                text: "Check out the fusion artwork I created with AI Fusion Generator!",
                url: window.location.href,
            });
            trackStudioEvent("ai_result_share");
        } catch {
            // Ignore share cancellation.
        }
    };

    return (
        <section
            id="fusion-studio"
            className={`scroll-mt-24 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 interactive-loaded rounded-3xl transition-all duration-500 ${
                isHashFocused ? "ring-2 ring-primary/50 ring-offset-4 ring-offset-background bg-primary/5" : ""
            }`}
            aria-labelledby="studio-title"
        >
            <div className="text-center space-y-2">
                <h2 id="studio-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    AI Fusion Studio
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    Upload two images, describe the fusion style, and create unique artwork instantly.
                </p>
            </div>

            <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                    quotaStatusCopy.tone === "warning"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : quotaStatusCopy.tone === "positive"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-border bg-muted/40 text-muted-foreground"
                }`}
            >
                <p className="font-semibold">{quotaStatusCopy.title}</p>
                <p className="mt-1 text-xs sm:text-sm">{quotaStatusCopy.description}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card/70 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Fast path for first-time users</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            1. Upload Image A and Image B. 2. Click Generate. Add style instructions only if you want a specific look.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPromptControls((current) => !current)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/30"
                        aria-expanded={showPromptControls}
                        aria-controls="optional-style-panel"
                    >
                        {showPromptControls ? "Hide Optional Style" : "Add Optional Style"}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                    Select Images to Fuse
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <UploadBox
                        side="left"
                        file={leftFile}
                        onUpload={onDropAccepted}
                        onReject={onDropRejected}
                        onRemove={() => {
                            setFileSafe(setLeftFile, null);
                            setMissingSides((previous) => (previous.includes("left") ? previous : [...previous, "left"]));
                            trackStudioEvent("ai_upload_removed", { side: "left" });
                        }}
                        disabled={isGenerating}
                        highlight={missingSides.includes("left")}
                    />

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
                        onUpload={onDropAccepted}
                        onReject={onDropRejected}
                        onRemove={() => {
                            setFileSafe(setRightFile, null);
                            setMissingSides((previous) => (previous.includes("right") ? previous : [...previous, "right"]));
                            trackStudioEvent("ai_upload_removed", { side: "right" });
                        }}
                        disabled={isGenerating}
                        highlight={missingSides.includes("right")}
                    />
                </div>
            </div>

            {(showPromptControls || Boolean(prompt.trim())) && (
                <div id="optional-style-panel" className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                        Optional Style Instructions
                    </div>

                    <div className="space-y-2 rounded-2xl border border-border bg-card/60 p-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="fusion-prompt" className="sr-only">Fusion Prompt</label>
                            <p className="text-xs text-muted-foreground">Skip this for the fastest first result.</p>
                            <button
                                type="button"
                                onClick={surpriseMe}
                                disabled={isGenerating}
                                className="text-sm flex items-center gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ml-auto min-h-[44px] px-3 font-medium"
                                aria-label="Generate random prompt"
                            >
                                <Dice6 size={18} aria-hidden="true" />
                                Surprise Me
                            </button>
                        </div>
                        <input
                            id="fusion-prompt"
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            disabled={isGenerating}
                            placeholder="e.g. Cyberpunk style, Cinematic lighting..."
                            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {showPromptControls || Boolean(prompt.trim()) ? "3" : "2"}
                    </span>
                    Generate Fusion
                </div>

                {Boolean(leftFile && rightFile) && !isGenerating && !isQuotaBlocked && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                        <p className="font-semibold">Ready to generate</p>
                        <p className="mt-1 text-xs sm:text-sm text-primary/80">
                            Your two images are loaded. Generate now or add optional style instructions first.
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    disabled={isGenerating}
                    onClick={startGenerate}
                    className={`w-full rounded-2xl py-4 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 min-h-[56px] shadow-lg ${
                        isGenerating
                            ? "bg-muted text-muted-foreground cursor-wait shadow-none"
                            : isQuotaBlocked
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            : canGenerate
                                ? "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] active:scale-[0.98] text-white shadow-primary/25"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                    } ${isActionHintActive ? "ring-2 ring-red-400 ring-offset-2" : ""}`}
                    aria-busy={isGenerating}
                    aria-disabled={isGenerating}
                    aria-label={isGenerating ? "Generating fusion..." : "Generate AI fusion"}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : isQuotaBlocked ? (
                        <>
                            <Sparkles size={20} aria-hidden="true" />
                            Sign in to Continue
                        </>
                    ) : canGenerate ? (
                        <>
                            <Sparkles size={20} aria-hidden="true" />
                            Generate Fusion
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} aria-hidden="true" />
                            Upload 2 Images to Start
                        </>
                    )}
                </button>

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
                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            AI is creating your fusion... {Math.round(progress)}%
                        </p>
                        <p className="text-xs text-muted-foreground/80 text-center">
                            You can switch tabs while we process. Come back here for the final result.
                        </p>
                    </div>
                )}

                {error && !isGenerating && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center animate-in fade-in duration-300">
                        <p>{error}</p>
                        {canRetry && (
                            <button
                                type="button"
                                onClick={startGenerate}
                                className="mt-3 inline-flex items-center justify-center rounded-lg border border-destructive/40 bg-white px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                )}

                {authGate?.kind === "guest_limit" && (
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <div className="text-center mb-4 space-y-1">
                            <h4 className="font-bold text-gray-800">{authGate.title}</h4>
                            <p className="text-xs text-gray-600">{authGate.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href={`/sign-in?redirect_to=${encodeURIComponent("/ai#fusion-studio")}&source=ai_studio&reason=free_limit`}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                onClick={() =>
                                    trackStudioEvent("ai_auth_gate_click", {
                                        kind: "guest_limit",
                                        cta: "sign_in",
                                    })
                                }
                            >
                                Continue Free
                            </Link>
                            <Link
                                href={`/sign-up?redirect_to=${encodeURIComponent("/ai#fusion-studio")}&source=ai_studio&reason=free_limit`}
                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700"
                                onClick={() =>
                                    trackStudioEvent("ai_auth_gate_click", {
                                        kind: "guest_limit",
                                        cta: "sign_up",
                                    })
                                }
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                )}

                {authGate?.kind === "member_credits" && (
                    <div className="mt-2 p-4 bg-purple-50 border border-purple-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <div className="text-center mb-4 space-y-1">
                            <h4 className="font-bold text-gray-800">{authGate.title}</h4>
                            <p className="text-xs text-gray-600">{authGate.description}</p>
                        </div>
                        <Link
                            href="/pricing?source=ai_studio&reason=insufficient_credits"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:from-purple-700 hover:to-indigo-700"
                            onClick={() =>
                                trackStudioEvent("ai_auth_gate_click", {
                                    kind: "member_credits",
                                    cta: "pricing",
                                })
                            }
                        >
                            Upgrade to Continue
                        </Link>
                    </div>
                )}
            </div>

            <div ref={resultRef} aria-live="polite" className="space-y-4">
                {resultImage && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl font-bold">Your Fusion Is Ready</h3>
                            <p className="text-sm text-muted-foreground">
                                Download it now, then continue generating variations or explore more examples.
                            </p>
                        </div>

                        <div className="relative aspect-square w-full rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-xl flex items-center justify-center">
                            <Image
                                src={resultImage}
                                alt="AI generated fusion artwork"
                                fill
                                sizes="(max-width: 640px) 100vw, 600px"
                                quality={95}
                                unoptimized
                                decoding="async"
                                className="object-contain p-2"
                                priority
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={downloadResult}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-green-700 min-h-[48px]"
                            >
                                <Download size={18} />
                                Download HD
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setResultImage(null);
                                    setError(null);
                                    setProgress(0);
                                    setAuthGate(null);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted/20 min-h-[48px]"
                            >
                                <RefreshCw size={18} />
                                Continue Generating
                            </button>
                            {canShare && (
                                <button
                                    type="button"
                                    onClick={shareResult}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted/20 min-h-[48px] sm:col-span-2"
                                >
                                    <Share2 size={18} />
                                    Share Result
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link
                                href="/gallery?source=ai_result"
                                className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted/20 min-h-[48px]"
                            >
                                See Example Results
                            </Link>
                            <Link
                                href="/pricing?source=ai_result_next_step"
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:from-purple-700 hover:to-indigo-700 min-h-[48px]"
                            >
                                Unlock Unlimited
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setResultImage(null);
                                setFileSafe(setLeftFile, null);
                                setFileSafe(setRightFile, null);
                                setPrompt("");
                                setError(null);
                                setProgress(0);
                                setAuthGate(null);
                                setMissingSides([]);
                            }}
                            className="w-full py-3 rounded-xl border-2 border-border hover:border-primary/50 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                        >
                            <RefreshCw size={18} />
                            Start From Scratch
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
