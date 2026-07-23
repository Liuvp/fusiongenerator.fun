"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, RefreshCw, Share2, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { DB_CHARACTERS, DB_FUSION_STYLES, DBCharacter, getRandomCharacters } from "@/lib/dragon-ball-data";
import { User } from "@supabase/supabase-js";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInAction, signUpAction, signInWithGoogleAction, signUpWithGoogleAction, inlineSignInAction, inlineSignUpAction } from "@/app/actions";

// ===============================
// 常量定义
// ===============================
const LOCAL_STORAGE_KEY = "db_fusion_studio_state";
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
const DEFAULT_QUOTA = { used: 0, remaining: 3, limit: 3, isVIP: false }; // 免费额度 3 次

// ===============================
// 类型定义
// ===============================
interface FusionResult {
    imageUrl: string;
    char1: DBCharacter;
    char2: DBCharacter;
    savedId?: string;
}

interface Quota {
    used: number;
    remaining: number;
    limit: number;
    isVIP: boolean;
    type?: "monthly_limit" | "credits" | "credits_fallback";
}

interface LocalStorageState {
    c1?: string;
    c2?: string;
    timestamp: number;
}

// Survives the full-page reload triggered by login/OAuth redirect so the
// generated fusion is not lost after a guest signs in to save it.
const PENDING_RESULT_KEY = "db_fusion_pending_result";

interface PendingResultState {
    imageUrl: string;
    char1Id: string;
    char2Id: string;
    styleId: string;
    pendingSave: boolean;
    timestamp: number;
}

type AuthGateReason = "guest_quota_used" | "member_quota_exceeded" | "api_limit_reached";

type StudioEventPayload = Record<string, string | number | boolean | null | undefined>;

const trackStudioEvent = (eventName: string, payload: StudioEventPayload = {}): void => {
    if (typeof window === "undefined") return;

    try {
        const globalWindow = window as Window & {
            gtag?: (...args: unknown[]) => void;
        };

        if (typeof globalWindow.gtag === "function") {
            globalWindow.gtag("event", eventName, payload);
        }
    } catch (error) {
        console.warn("Failed to track studio event:", error);
    }
};

// ===============================
// 工具函数
// ===============================
const getRemainingDisplay = (quota: Quota): string =>
    quota.isVIP ? `${Math.max(0, quota.limit - quota.used)}` : quota.remaining.toString();

const hasQuotaAccess = (quota: Quota, user: User | null): boolean => {
    // VIP 用户永远有访问权限
    if (quota.isVIP) return true;

    // 已认证用户检查配额
    if (user && quota) {
        return quota.remaining > 0;
    }

    // 未登录用户：检查是否还有免费额度
    if (!user && quota) {
        return quota.remaining > 0;
    }

    // 未登录且配额未加载：禁止尝试（API 层面也会检查，但前端不应放行）
    return false;
};

// ===============================
// CharacterButton 组件 - 提取出来减少主组件复杂度
// ===============================
interface CharacterButtonProps {
    character: DBCharacter;
    index: number;
    isSelected1: boolean;
    isSelected2: boolean;
    isProLocked: boolean;
    disabled: boolean;
    onSelect: (char: DBCharacter) => void;
}

const CharacterButton = memo(({
    character,
    index,
    isSelected1,
    isSelected2,
    isProLocked,
    disabled,
    onSelect
}: CharacterButtonProps) => {
    const isSelected = isSelected1 || isSelected2;

    return (
        <button
            type="button"
            onClick={() => onSelect(character)}
            disabled={disabled}
            className={`
                group relative aspect-square rounded-xl overflow-hidden border-2 min-h-[44px] min-w-[44px]
                transition-all duration-200 active:scale-95 touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${isSelected1
                    ? 'border-orange-500 shadow-md ring-2 ring-orange-200 ring-offset-1 scale-105'
                    : isSelected2
                        ? 'border-blue-500 shadow-md ring-2 ring-blue-200 ring-offset-1 scale-105'
                        : isProLocked
                            ? 'border-amber-300 hover:border-amber-400 hover:shadow-sm'
                            : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                }
            `}
            aria-label={isSelected ? `${character.name} selected. Tap again to remove.` : isProLocked ? `${character.name} - Pro only. Tap to unlock.` : `Select ${character.name}`}
            aria-pressed={isSelected}
            title={isSelected ? `Remove ${character.name} from the fusion` : isProLocked ? `${character.name} (Pro only)` : `Select ${character.name}`}
        >
            <div className="relative w-full h-full bg-gray-100 flex items-center justify-center p-1">
                <Image
                    src={character.imageUrl}
                    alt={`Dragon Ball character ${character.name}`}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 15vw, 150px"
                    className={`
                        object-contain p-1 transition-transform duration-300
                        ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                        ${isProLocked && !isSelected ? 'opacity-75' : ''}
                    `}
                    priority={index < 4}
                    loading={index < 4 ? "eager" : "lazy"}
                    unoptimized={true}
                />
                {isSelected && (
                    <div className={`
                        absolute top-1 right-1 w-6 h-6 rounded-full 
                        flex items-center justify-center text-xs font-bold shadow-md
                        ${isSelected1 ? 'bg-orange-500' : 'bg-blue-500'} text-white
                    `}>
                        {isSelected1 ? '1' : '2'}
                    </div>
                )}
                {isProLocked && !isSelected && (
                    <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs text-white shadow-md">
                        🔒
                    </div>
                )}
                {isProLocked && (
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
                )}
            </div>
        </button>
    );
});
CharacterButton.displayName = "CharacterButton";

// ===============================
// 主组件
// ===============================
export function DBFusionStudio() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const resultRef = useRef<HTMLDivElement>(null);
    const selectionCardRef = useRef<HTMLDivElement>(null);
    const char1Ref = useRef<DBCharacter | undefined>(undefined);
    const char2Ref = useRef<DBCharacter | undefined>(undefined);

    // ✅ 使用 useRef 管理订阅，避免重复创建
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
    const supabase = createClient();

    // ===============================
    // 状态管理
    // ===============================
    const [char1, setChar1] = useState<DBCharacter | undefined>(DB_CHARACTERS.find(c => c.id === 'goku'));
    const [char2, setChar2] = useState<DBCharacter | undefined>(DB_CHARACTERS.find(c => c.id === 'vegeta'));
    const [isGenerating, setIsGenerating] = useState(false);
    const [fusionProgress, setFusionProgress] = useState(0);
    const [result, setResult] = useState<FusionResult | null>(null);
    const [quota, setQuota] = useState<Quota>(DEFAULT_QUOTA);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [quotaLoaded, setQuotaLoaded] = useState(false);
    const quotaLoadedRef = useRef(false);

    // ===============================
    // State for interactive feedback
    // ===============================
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"sign_up" | "sign_in">("sign_up");
    // Optional context-specific copy for the auth dialog (e.g. the post-download prompt)
    const [authHeadline, setAuthHeadline] = useState<{ title: string; description: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [resultBannerDismissed, setResultBannerDismissed] = useState(false);
    const [pendingForm, setPendingForm] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isSelectionHintActive, setIsSelectionHintActive] = useState(false);
    const hiddenResultNoticeRef = useRef(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedStyleId, setSelectedStyleId] = useState<string>('potara');
    const [authBannerDismissed, setAuthBannerDismissed] = useState(false);
    const dbReturnTarget = "/dragon-ball?auth=welcome&from=dragon_ball_fusion#fusion-studio";
    const showAuthReturnBanner = searchParams.get("auth") === "welcome" && !authBannerDismissed;

    // Auto-dismiss welcome banner when user starts selecting characters
    useEffect(() => {
        if (char1 || char2) setAuthBannerDismissed(true);
    }, [char1, char2]);

    // Handle payment success: show toast + scroll to studio
    // Only fire after quota is loaded (to correctly show Pro vs Refill toast) and only once
    const paymentToastShownRef = useRef(false);
    useEffect(() => {
        if (searchParams.get("payment") !== "success" || paymentToastShownRef.current) return;
        paymentToastShownRef.current = true;

        // Show immediate confirmation — don't wait for webhook
        toast({
            title: "Payment received! 🎉",
            description: "Your plan is being activated — this usually takes a few seconds.",
            duration: 6000,
        });
        scrollAndCleanup();

        // Background poll to update quota state (silent, no additional toast)
        let attempts = 0;
        const maxAttempts = 6;
        const poll = () => {
            attempts++;
            fetch('/api/get-quota').then(r => r.json()).then(data => {
                if (data?.quota) {
                    setQuota(data.quota);
                } else if (attempts < maxAttempts) {
                    setTimeout(poll, 3000);
                }
            }).catch(() => {
                if (attempts < maxAttempts) {
                    setTimeout(poll, 3000);
                }
            });
        };
        setTimeout(poll, 2000); // First poll after 2s (give webhook time)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, toast, quota.isVIP, quotaLoaded]);

    function scrollAndCleanup() {
        const el = document.getElementById("fusion-studio");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        window.history.replaceState({}, "", url.pathname + url.search + "#fusion-studio");
    }

    // 检查是否选完
    const isSelectionComplete = useMemo(() => !!(char1 && char2), [char1, char2]);

    const hasQuotaAccessValue = useMemo(() =>
        hasQuotaAccess(quota, user),
        [quota, user]
    );

    const remainingDisplay = useMemo(() =>
        getRemainingDisplay(quota),
        [quota]
    );

    const selectedCount = useMemo(
        () => Number(Boolean(char1)) + Number(Boolean(char2)),
        [char1, char2]
    );

    const selectionGuidance = useMemo(() => {
        if (selectedCount === 0) {
            return {
                title: "Pick your first fighter",
                description: "Start with any Dragon Ball character. Pick a second fighter to unlock fusion."
            };
        }

        if (selectedCount === 1) {
            const selectedName = char1?.name ?? char2?.name;
            return {
                title: `${selectedName} locked in`,
                description: "Pick one more fighter to complete the pair. Tap a selected fighter again if you want to remove it."
            };
        }

        return {
            title: `${char1?.name} + ${char2?.name} ready`,
            description: "Tap FUU-SION-HA! to generate. If you tap a new fighter now, it replaces slot 1 and shifts the older pick to slot 2."
        };
    }, [char1, char2, selectedCount]);

    const quotaStatusCopy = useMemo(() => {
        if (isLoadingAuth) {
            return {
                title: "Checking your fusion energy...",
                description: "Preparing your account and free quota details."
            };
        }

        if (quota.isVIP) {
            // VIP user exhausted monthly quota, using refill pack credits
            if (quota.type === "credits_fallback") {
                return {
                    title: `${quota.remaining} refill credit${quota.remaining === 1 ? "" : "s"} remaining`,
                    description: "Monthly limit reached. Using refill pack credits."
                };
            }
            return {
                title: "Pro unlocked: 300 fusions/month",
                description: "Generate up to 300 Dragon Ball fusions per month."
            };
        }

        if (hasQuotaAccessValue) {
            return user
                ? {
                    title: `${quota.remaining} fusion credit${quota.remaining === 1 ? "" : "s"} remaining`,
                    description: "Use a credit to generate one fusion."
                }
                : {
                    title: `${quota.remaining} free fusion${quota.remaining === 1 ? "" : "s"} left`,
                    description: "Sign in to save your fusions and get 2 starter credits."
                };
        }

            return user
                ? {
                    title: "No credits left",
                    description: "Upgrade to Pro for 300 fusions/month."
                }
                : {
                title: "Keep generating with a free account",
                description: "Guest access includes 3 free fusions. Sign in or create a free account before your next generation."
            };
    }, [hasQuotaAccessValue, isLoadingAuth, quota.isVIP, quota.remaining, user]);

    const showGuestStartBanner = !user && quota.remaining > 0 && !char1 && !char2;
    const showGuestQuotaUsedBanner = !user && quota.remaining <= 0 && !char1 && !char2;
    const isFromChatGPT = searchParams.get('utm_source') === 'chatgpt.com';

    const openAuthGate = useCallback((reason: AuthGateReason): void => {
        setShowAuthOptions(true);
        trackStudioEvent("db_auth_modal_show", {
            reason,
            is_logged_in: Boolean(user),
            remaining_quota: quota.remaining,
            is_vip: quota.isVIP,
        });
    }, [quota.isVIP, quota.remaining, user]);

    // ===============================
    // 本地存储管理 - 优化：只在选择完成时保存
    // ===============================
    const saveToLocalStorage = useCallback(() => {
        // ✅ 改进：只在选择完成时保存，减少无效写入
        if (!isSelectionComplete) {
            try {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            } catch {
                // 忽略清除错误
            }
            return;
        }

        try {
            const state: LocalStorageState = {
                c1: char1?.id,
                c2: char2?.id,
                timestamp: Date.now()
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        } catch {
            console.warn("Failed to save to localStorage");
        }
    }, [char1, char2, isSelectionComplete]);

    const loadFromLocalStorage = useCallback((): void => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!saved) return;

            const { c1, c2, timestamp }: LocalStorageState = JSON.parse(saved);

            // 检查是否过期
            if (Date.now() - timestamp > STORAGE_EXPIRY) {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                return;
            }

            if (c1) {
                const foundChar = DB_CHARACTERS.find(c => c.id === c1);
                if (foundChar) setChar1(foundChar);
            }

            if (c2) {
                const foundChar = DB_CHARACTERS.find(c => c.id === c2);
                if (foundChar) setChar2(foundChar);
            }
        } catch {
            console.warn("Failed to load from localStorage");
        }
    }, []);

    // Persist the current result (and whether the user asked to save it) so it
    // can be restored after the login redirect reloads the whole page.
    const persistPendingResult = useCallback((res: FusionResult, pendingSave: boolean): void => {
        try {
            const payload: PendingResultState = {
                imageUrl: res.imageUrl,
                char1Id: res.char1.id,
                char2Id: res.char2.id,
                styleId: selectedStyleId,
                pendingSave,
                timestamp: Date.now(),
            };
            localStorage.setItem(PENDING_RESULT_KEY, JSON.stringify(payload));
        } catch {
            // ignore storage errors
        }
    }, [selectedStyleId]);

    // ===============================
    // 初始化加载
    // ===============================
    useEffect(() => {
        loadFromLocalStorage();
    }, [loadFromLocalStorage]);

    // Keep char refs in sync for use in rapid click handlers (#6)
    useEffect(() => { char1Ref.current = char1; }, [char1]);
    useEffect(() => { char2Ref.current = char2; }, [char2]);

    // ===============================
    // 自动保存 - 优化：只在选择完成时保存
    // ===============================
    useEffect(() => {
        saveToLocalStorage();
    }, [saveToLocalStorage]);

    // ===============================
    // 滚动到结果
    // ===============================
    useEffect(() => {
        if (result && !isGenerating && resultRef.current) {
            const scrollTimeout = setTimeout(() => {
                resultRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);

            return () => clearTimeout(scrollTimeout);
        }
    }, [result, isGenerating]);

    // 融合进度动画 - 15秒内从0到95%，完成后等API返回再到100%
    useEffect(() => {
        if (!isGenerating) {
            setFusionProgress(0);
            return;
        }
        const interval = setInterval(() => {
            setFusionProgress(prev => Math.min(prev + 100 / 75, 95)); // ~15秒到95%
        }, 200);
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => {
        const handleVisibilityChange = (): void => {
            if (document.hidden) return;
            if (!hiddenResultNoticeRef.current || !result) return;

            hiddenResultNoticeRef.current = false;
            toast({
                title: "Fusion Ready",
                description: `${result.char1.name} x ${result.char2.name} is ready below.`,
                duration: 2500
            });
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [result, toast]);

    // ===============================
    // 认证和配额检查
    // ===============================
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async (): Promise<void> => {
            try {
                const { data } = await supabase.auth.getUser();
                if (!isMounted) return;

                setUser(data?.user ?? null);
                setIsLoadingAuth(false);

                const response = await fetch('/api/get-quota');
                if (response.ok) {
                    const quotaData = await response.json();
                    if (isMounted) {
                        setQuota(quotaData.quota);
                        quotaLoadedRef.current = true;
                        setQuotaLoaded(true);
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setIsLoadingAuth(false);
                    console.error("Auth initialization error:", error);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return;

                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setUser(session?.user ?? null);

                    try {
                        const response = await fetch('/api/get-quota');
                        if (response.ok) {
                            const quotaData = await response.json();
                            setQuota(quotaData.quota);
                        }
                    } catch (error) {
                        console.error("Failed to fetch quota:", error);
                    } finally {
                        if (isMounted) {
                            quotaLoadedRef.current = true;
                            setQuotaLoaded(true);
                        }
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setQuota(DEFAULT_QUOTA);
                }
            }
        );

        subscriptionRef.current = subscription;

        return () => {
            isMounted = false;
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [supabase]);

    // ===============================
    // 登录跳转返回后：恢复被整页重载清掉的结果，并在有保存意图时自动保存
    // ===============================
    const pendingRestoreHandledRef = useRef(false);

    useEffect(() => {
        if (isLoadingAuth) return;                 // wait until auth state is known
        if (pendingRestoreHandledRef.current) return;
        pendingRestoreHandledRef.current = true;

        let raw: string | null = null;
        try {
            raw = localStorage.getItem(PENDING_RESULT_KEY);
        } catch {
            return;
        }
        if (!raw) return;

        const clearPending = () => {
            try { localStorage.removeItem(PENDING_RESULT_KEY); } catch { /* ignore */ }
        };

        let parsed: PendingResultState | null = null;
        try {
            parsed = JSON.parse(raw) as PendingResultState;
        } catch {
            parsed = null;
        }

        if (!parsed || !parsed.imageUrl || Date.now() - parsed.timestamp > STORAGE_EXPIRY) {
            clearPending();
            return;
        }

        const c1 = DB_CHARACTERS.find(c => c.id === parsed!.char1Id);
        const c2 = DB_CHARACTERS.find(c => c.id === parsed!.char2Id);
        if (!c1 || !c2) {
            clearPending();
            return;
        }

        // Restore the fusion so the image doesn't vanish after the login redirect
        const restored: FusionResult = { imageUrl: parsed.imageUrl, char1: c1, char2: c2 };
        setChar1(prev => prev ?? c1);
        setChar2(prev => prev ?? c2);
        setSelectedStyleId(prev => (prev === 'potara' && parsed!.styleId) ? parsed!.styleId : prev);
        setResult(prev => prev ?? restored);

        // If the visitor logged in specifically to save it, complete the save now
        if (user && parsed.pendingSave) {
            const styleId = parsed.styleId;
            (async () => {
                try {
                    const styleName = DB_FUSION_STYLES.find(s => s.id === styleId)?.name || 'Potara Fusion';
                    const response = await fetch('/api/save-fusion', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fusionType: 'dragon_ball',
                            char1Id: c1.id,
                            char1Name: c1.name,
                            char2Id: c2.id,
                            char2Name: c2.name,
                            styleId,
                            styleName,
                            imageUrl: restored.imageUrl,
                        }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setResult(prev => prev ? { ...prev, savedId: data.id } : prev);
                        setIsSaved(true);
                        toast({
                            title: "Fusion saved! 🎉",
                            description: "Your creation is now in your Dashboard collection.",
                            duration: 4000,
                        });
                        trackStudioEvent("db_result_autosaved_after_signup", { char1_id: c1.id, char2_id: c2.id });
                    }
                } catch {
                    // ignore — the image is still restored so the user can save manually
                } finally {
                    clearPending();
                }
            })();
        } else if (user) {
            // Logged in without an explicit save intent — nothing left to persist
            clearPending();
        }
        // else: still a guest — keep the key so a later login can still restore & save
    }, [isLoadingAuth, user, toast]);

    // ===============================
    // 交互函数
    // ===============================
    const selectCharacter = useCallback((char: DBCharacter): void => {
        const c1 = char1Ref.current;
        const c2 = char2Ref.current;
        const selectedBefore = Number(Boolean(c1)) + Number(Boolean(c2));

        // 允许反选：点击已选中的角色取消选中
        if (c1?.id === char.id) {
            trackStudioEvent("db_select_char", {
                action: "deselect",
                slot: 1,
                char_id: char.id,
                selected_count_before: selectedBefore,
            });
            setChar1(undefined);
            setResult(null);
            return;
        }
        if (c2?.id === char.id) {
            trackStudioEvent("db_select_char", {
                action: "deselect",
                slot: 2,
                char_id: char.id,
                selected_count_before: selectedBefore,
            });
            setChar2(undefined);
            setResult(null);
            return;
        }

        trackStudioEvent("db_select_char", {
            action: "select",
            char_id: char.id,
            selected_count_before: selectedBefore,
        });

        if (!c1) {
            setChar1(char);
        } else if (!c2) {
            setChar2(char);
        } else {
            // 队列逻辑：旧的 char1 移到 char2，新角色占据 char1
            toast({
                title: "Lead fighter updated",
                description: `${char.name} moved into slot 1. ${c1.name} shifted to slot 2.`,
                duration: 1600
            });
            setChar2(c1);
            setChar1(char);
        }
        setResult(null);
    }, [toast]);

    const randomize = useCallback((): void => {
        const [c1, c2] = getRandomCharacters(2, false);
        setChar1(c1);
        setChar2(c2);
        setResult(null);

        toast({
            title: "Random Pair Selected",
            description: `${c1.name} + ${c2.name}`,
            duration: 2000
        });
    }, [toast]);

    const swapLeftFighter = useCallback((): void => {
        const options = DB_CHARACTERS.filter((fighter) => fighter.id !== char2?.id);
        const nextFighter = options[Math.floor(Math.random() * options.length)];
        if (!nextFighter || !char2) return;

        setChar1(nextFighter);
        setResult(null);
        toast({
            title: "Left fighter swapped",
            description: `${nextFighter.name} is ready to fuse with ${char2.name}.`,
            duration: 1800
        });
    }, [char2, toast]);

    const swapRightFighter = useCallback((): void => {
        const options = DB_CHARACTERS.filter((fighter) => fighter.id !== char1?.id);
        const nextFighter = options[Math.floor(Math.random() * options.length)];
        if (!nextFighter || !char1) return;

        setChar2(nextFighter);
        setResult(null);
        toast({
            title: "Right fighter swapped",
            description: `${char1.name} is now paired with ${nextFighter.name}.`,
            duration: 1800
        });
    }, [char1, toast]);

    const clearSelection = useCallback((): void => {
        setChar1(undefined);
        setChar2(undefined);
        setResult(null);

        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
            console.warn("Failed to clear localStorage");
        }

        // ✅ 改进：提供视觉和屏幕阅读器反馈
        toast({
            title: "Selection Cleared",
            description: "Ready to select new fighters",
            duration: 1500
        });
    }, [toast]);

    const generateFusion = useCallback(async (): Promise<void> => {
        trackStudioEvent("db_generate_click", {
            selected_count: selectedCount,
            is_selection_complete: isSelectionComplete,
            has_quota_access: hasQuotaAccessValue,
            is_logged_in: Boolean(user),
            remaining_quota: quota.remaining,
            is_vip: quota.isVIP,
        });
        // 配额检查
        if (!hasQuotaAccessValue) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);

            // 区分未登录和已登录用户，提供更清晰的提示
            if (!user) {
                toast({
                    title: "Free Quota Used",
                    description: "Sign in to get more fusion credits!",
                    variant: "default",
                    duration: 3000
                });
                openAuthGate("guest_quota_used");
            } else {
                toast({
                    title: "Quota Exceeded",
                    description: "Upgrade to Pro for 300 fusions/month!",
                    variant: "destructive",
                    duration: 3000
                });
                openAuthGate("member_quota_exceeded");
            }
            trackStudioEvent("db_generate_fail", {
                reason: "quota_blocked_before_request",
                is_logged_in: Boolean(user),
                remaining_quota: quota.remaining,
            });
            return;
        }

        // 选择检查
        if (!isSelectionComplete) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setIsSelectionHintActive(true);
            setTimeout(() => setIsSelectionHintActive(false), 900);
            selectionCardRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            toast({
                title: "Select Two Characters",
                description: "Choose two fighters to fuse",
                variant: "destructive",
                duration: 3000
            });
            trackStudioEvent("db_generate_fail", {
                reason: "selection_incomplete",
                selected_count: selectedCount,
            });
            return;
        }

        setIsGenerating(true);
        setResult(null);
        // A fresh generation invalidates any previously persisted result
        try { localStorage.removeItem(PENDING_RESULT_KEY); } catch { /* ignore */ }

        try {
            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    char1: char1!.id,
                    char2: char2!.id,
                    style: selectedStyleId
                }),
            });

            let data: Record<string, unknown> = {};
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                // ✅ 改进：更详细的错误信息处理
                const errorMessage = String(data.error || data.message || `Server error: ${response.status}`);
                const normalizedError = errorMessage.toLowerCase();

                // === 新增：自动跳转逻辑 ===
                // 处理配额不足或限制到达的情况
                if (
                    response.status === 402
                    || response.status === 429
                    || normalizedError.includes("limit reached")
                    || normalizedError.includes("quota")
                    || normalizedError.includes("credit")
                ) {
                    // Distinguish burst rate limit vs quota exceeded
                    const reason = data.reason;
                    const isBurst = response.status === 429 && reason === "burst";

                    toast({
                        title: isBurst ? "Slow down!" : "Limit Reached",
                        description: isBurst
                            ? "You're going too fast. Wait a moment and try again."
                            : user
                                ? "Upgrade to Pro for 300 fusions/month."
                                : "Sign in to unlock more fusion credits.",
                        variant: "destructive",
                        duration: isBurst ? 2000 : 3000
                    });

                    // 延迟跳转，给用户时间看 Toast
                    trackStudioEvent("db_generate_fail", {
                        reason: "api_limit_reached",
                        status_code: response.status,
                        is_logged_in: Boolean(user),
                        remaining_quota: quota.remaining,
                        limit_type: isBurst ? "burst" : "quota",
                    });

                    // Burst is temporary (1 min cooldown) — don't force auth gate
                    if (isBurst) return;

                    openAuthGate(user ? "member_quota_exceeded" : "api_limit_reached");

                    return; // 中断后续逻辑
                }

                throw new Error(errorMessage);
            }

            // 更新配额：优先使用后端返回的最新状态
            if (!data.imageUrl || typeof data.imageUrl !== "string") {
                throw new Error("Fusion image was not returned by the server.");
            }

            if (data.quota) {
                setQuota(data.quota as Quota);
            } else {
                setQuota(prev => ({
                    ...prev,
                    used: prev.used + 1,
                    remaining: prev.isVIP ? prev.remaining : Math.max(0, prev.remaining - 1)
                }));
            }

            // 设置结果
            setFeedbackSubmitted(false);
            setIsSaved(false);
            const newResult: FusionResult = {
                imageUrl: data.imageUrl,
                char1: char1!,
                char2: char2!
            };
            setResult(newResult);

            // 自动保存到历史记录（已登录用户）
            if (user) {
                autoSaveFusion(newResult);
            }

            if (typeof document !== "undefined" && document.hidden) {
                hiddenResultNoticeRef.current = true;
            }

            toast({
                title: "Fusion Complete!",
                description: "A new warrior is born!",
                duration: 3000
            });

            trackStudioEvent("db_generate_success", {
                char1_id: char1!.id,
                char2_id: char2!.id,
                is_logged_in: Boolean(user),
                remaining_quota: data.quota && typeof data.quota === "object" && "remaining" in data.quota
                    ? Number((data.quota as Quota).remaining)
                    : Math.max(0, quota.remaining - 1),
            });

        } catch (error: unknown) {
            console.error("Fusion error:", error);

            // ✅ 改进：安全的错误消息显示，区分不同类型
            const errorMessage = error instanceof Error ? error.message : "";
            let errorDescription = "Please try again";
            if (errorMessage.includes("timeout") || errorMessage.includes("time out")) {
                errorDescription = "The AI service is taking too long. Please try again later.";
            } else if (errorMessage.includes("rate limit") || errorMessage.includes("too many requests")) {
                errorDescription = "Too many requests. Please wait a moment before trying again.";
            } else if (errorMessage) {
                errorDescription = errorMessage;
            }

            toast({
                title: "Fusion Failed",
                description: errorDescription,
                variant: "destructive",
                duration: 5000
            });
            trackStudioEvent("db_generate_fail", {
                reason: "runtime_error",
                message: errorDescription,
                is_logged_in: Boolean(user),
                remaining_quota: quota.remaining,
            });
        } finally {
            setIsGenerating(false);
        }
    }, [
        char1,
        char2,
        hasQuotaAccessValue,
        isSelectionComplete,
        openAuthGate,
        quota.isVIP,
        quota.remaining,
        selectedCount,
        selectedStyleId,
        toast,
        user,
    ]);

    const downloadImage = useCallback(async (): Promise<void> => {
        if (!result?.imageUrl) return;

        try {
            const a = document.createElement('a');
            a.href = result.imageUrl;
            a.download = `fusion-${result.char1.name}-${result.char2.name}-${Date.now()}.png`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
                title: "Download Started",
                description: "Image saved to your device",
                duration: 2000
            });
        } catch {
            // 备用方案：在新标签页打开
            window.open(result.imageUrl, '_blank');
            toast({
                title: "Opening Image",
                description: "Use browser menu to save image.",
                duration: 2000
            });
        }

        // Post-download conversion (option B): a guest just got the image they
        // like — capture that high-intent moment with a sign-up prompt, and stash
        // the result so signing up auto-saves it into their new collection.
        if (!user) {
            trackStudioEvent("db_post_download_prompt", {
                char1_id: result.char1.id,
                char2_id: result.char2.id,
            });
            persistPendingResult(result, true);
            setAuthHeadline({
                title: "Love your fusion? Keep it forever",
                description: "Create a free account to save this to your collection and get 2 starter credits. Upgrade to Pro anytime for HD downloads with no watermark.",
            });
            setAuthMode("sign_up");
            // Delay so the browser download starts before the dialog appears
            window.setTimeout(() => setAuthDialogOpen(true), 900);
        }
    }, [result, toast, user, persistPendingResult]);

    const shareResult = useCallback(async (): Promise<void> => {
        if (!result) return;

        const shareUrl = window.location.href;
        const shareText = `Check out this Dragon Ball fusion: ${result.char1.name} × ${result.char2.name}! 🔥 Created with FusionGenerator.fun`;

        try {
            // Try Web Share API first
            if (navigator.share && navigator.canShare({ title: `${result.char1.name} × ${result.char2.name} Fusion`, text: shareText, url: shareUrl })) {
                await navigator.share({
                    title: `${result.char1.name} × ${result.char2.name} Fusion`,
                    text: shareText,
                    url: shareUrl
                });

                // Grant +1 credit for share
                if (!user) {
                    try {
                        await fetch('/api/share-reward', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ platform: 'share' }),
                        });
                    } catch { /* ignore */ }
                }
            } else {
                // Fallback: Twitter intent
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');

                // Grant +1 credit for share
                if (!user) {
                    try {
                        await fetch('/api/share-reward', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ platform: 'twitter' }),
                        });
                    } catch { /* ignore */ }
                }
            }

            toast({
                title: "Thanks for sharing!",
                description: user ? "You're awesome!" : "+1 free fusion credit unlocked!",
                duration: 3000
            });
        } catch {
            console.warn("Share failed");
        }
    }, [result, toast, user]);

    const submitFeedback = useCallback(async (rating: number): Promise<void> => {
        if (!result || feedbackSubmitted) return;
        setFeedbackSubmitted(true);

        trackStudioEvent("db_fusion_feedback", {
            rating,
            char1_id: result.char1.id,
            char2_id: result.char2.id,
            is_logged_in: Boolean(user),
        });

        try {
            await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fusionType: "dragon_ball",
                    char1Id: result.char1.id,
                    char2Id: result.char2.id,
                    rating,
                    imageUrl: result.imageUrl,
                }),
            });
        } catch {
            console.warn("Feedback submission failed");
        }
    }, [result, feedbackSubmitted, user]);

    // ===============================
    // 自动保存融合到历史记录
    // ===============================
    const autoSaveFusion = useCallback(async (fusionResult: FusionResult): Promise<void> => {
        if (!user) return;

        try {
            const response = await fetch('/api/save-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fusionType: 'dragon_ball',
                    char1Id: fusionResult.char1.id,
                    char1Name: fusionResult.char1.name,
                    char2Id: fusionResult.char2.id,
                    char2Name: fusionResult.char2.name,
                    styleId: selectedStyleId,
                    styleName: DB_FUSION_STYLES.find(s => s.id === selectedStyleId)?.name || 'Potara Fusion',
                    imageUrl: fusionResult.imageUrl,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setResult(prev => prev ? { ...prev, savedId: data.id } : null);
                setIsSaved(true);
                toast({
                    title: "Fusion saved!",
                    description: "View your collection in Dashboard.",
                    duration: 3000
                });
            }
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }, [selectedStyleId, user]);

    // 手动收藏/取消收藏
    const toggleFavorite = useCallback(async (): Promise<void> => {
        if (!result?.savedId) return;

        try {
            const response = await fetch('/api/save-fusion', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: result.savedId,
                    isFavorite: !isSaved,
                }),
            });

            if (response.ok) {
                setIsSaved(!isSaved);
                toast({
                    title: isSaved ? "Removed from favorites" : "Added to favorites",
                    duration: 2000
                });
            }
        } catch (error) {
            console.warn('Toggle favorite failed:', error);
        }
    }, [result?.savedId, isSaved, toast]);

    // ===============================
    // 渲染函数 - 优化：使用提取的组件
    // ===============================
    const characterGrid = useMemo(() => {
        return DB_CHARACTERS.map((character, index) => (
            <CharacterButton
                key={character.id}
                character={character}
                index={index}
                isSelected1={char1?.id === character.id}
                isSelected2={char2?.id === character.id}
                isProLocked={false}
                disabled={isGenerating}
                onSelect={selectCharacter}
            />
        ));
    }, [char1, char2, selectCharacter, isGenerating]);

    // 步骤指示器
    const steps = useMemo(() => (
        <div
            className="flex items-center justify-center mb-6 space-x-1 sm:space-x-4 px-2"
            role="list"
            aria-label="Fusion progress steps"
        >
            {[
                { key: 1, label: "Pick 1st", active: !char1, completed: !!char1 },
                { key: 2, label: "Pick 2nd", active: char1 && !char2, completed: !!char2 },
                { key: 3, label: "Generate", active: isSelectionComplete }
            ].map((step) => (
                <div key={step.key} className="flex items-center space-x-2">
                    <div
                        role="listitem"
                        className={`
                            flex items-center space-x-2 transition-colors
                            ${step.active ? 'text-orange-600 font-bold' : 'text-gray-500'}
                        `}
                    >
                        <span
                            aria-current={step.active ? 'step' : undefined}
                            aria-label={step.active ? 'Current step' : step.completed ? 'Completed' : 'Pending'}
                            className={`
                                w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${step.active ? 'bg-orange-600 text-white' :
                                    step.completed ? 'bg-green-500 text-white' :
                                        'bg-gray-200 text-gray-600'}
                            `}
                        >
                            {step.completed ? "OK" : step.key}
                        </span>
                        <span className="text-xs sm:text-sm">{step.label}</span>
                    </div>
                    {step.key < 3 && <div className="w-4 sm:w-8 h-px bg-gray-200" />}
                </div>
            ))}
        </div>
    ), [char1, char2, isSelectionComplete]);

    // ===============================
    // 主渲染
    // ===============================
    return (
        <div
            id="fusion-studio"
            className="scroll-mt-20 bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl"
            role="region"
            aria-label="Dragon Ball Fusion Studio"
        >
            {/* 头部 */}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Dragon Ball Fusion Studio
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Combine your favorite characters
                    </p>
                </div>
                <Badge
                    variant={hasQuotaAccessValue ? "default" : "destructive"}
                    className="text-sm px-3 py-1.5 min-w-[80px] justify-center font-semibold"
                    aria-label={`${remainingDisplay} attempts remaining`}
                >
                    {remainingDisplay} Left
                </Badge>
            </header>

            {/* 步骤指示器 */}
            {showAuthReturnBanner && (
                <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900 relative">
                    <button
                        type="button"
                        onClick={() => setAuthBannerDismissed(true)}
                        className="absolute top-2 right-2 text-orange-400 hover:text-orange-600 transition-colors"
                        aria-label="Dismiss welcome banner"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <p className="font-semibold">You&apos;re back in Dragon Ball Fusion Studio</p>
                    <p className="mt-1 text-xs text-orange-800">
                        Sign-in worked. Pick 2 fighters and keep going right where you left off.
                    </p>
                </div>
            )}

            {showGuestStartBanner && (
                <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                    <p className="font-semibold">No account required for your first 3 Dragon Ball fusions</p>
                    <p className="mt-1 text-xs text-orange-800">
                        You can try 3 guest fusions right now. We only ask you to sign in after that if you want more generations or saved history.
                    </p>
                </div>
            )}

            {showGuestQuotaUsedBanner && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <p className="font-semibold">You've used your free guest fusions</p>
                    <p className="mt-1 text-xs text-amber-800">
                        Sign in once to keep generating without getting bounced between pages.
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => { setAuthMode("sign_in"); setAuthDialogOpen(true); trackStudioEvent("db_auth_gate_click", { cta: "sign_in_banner", reason: "quota_limit" }); }}
                            className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                        >
                            Sign In to Continue
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthMode("sign_up"); setAuthDialogOpen(true); trackStudioEvent("db_auth_gate_click", { cta: "sign_up_banner", reason: "quota_limit" }); }}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-red-600"
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            )}

            {isFromChatGPT && (
                <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-900">
                    <p className="font-semibold">Welcome from ChatGPT! 👋</p>
                    <p className="mt-1 text-xs text-purple-800">
                        Pick any two Dragon Ball characters below, then tap "FUU-SION-HA!" to create your fusion. No account needed for your first 3 tries.
                    </p>
                </div>
            )}

            {steps}

            {/* 角色选择区域 */}
            <Card
                ref={selectionCardRef}
                className={`border-0 shadow-sm mb-6 transition-all ${isSelectionHintActive ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
            >
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Choose Fighters
                        </h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={randomize}
                            aria-label="Select two random Dragon Ball characters"
                            className="h-7 px-2 text-xs text-gray-600 hover:text-orange-600 font-medium"
                            title="Select random character pair"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" focusable="false" />
                            Random
                        </Button>
                    </div>
                    <div
                        className={`grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 pr-1 custom-scrollbar transition-all duration-300 md:overflow-y-auto md:max-h-[320px]`}
                        aria-live="polite"
                    >
                        {characterGrid}
                    </div>
                </CardContent>
            </Card>

            {/* 融合区域 */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm mb-6">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-700">
                                {isSelectionComplete ? "Selected Fusion" : "Select 2 Fighters"}
                            </h3>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600">
                                {selectedCount}/2 selected
                            </span>
                        </div>
                        {(char1 || char2) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearSelection}
                                aria-label="Clear current fighter selection"
                                className="h-7 px-2 text-xs text-gray-500 hover:text-destructive"
                                title="Clear current selection"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                        <CharacterSlot char={char1} position={1} onClear={() => { setChar1(undefined); setResult(null); }} onSlotClick={() => { setChar1(undefined); setResult(null); }} priority={true} highlight={!char1 && !!char2} />
                        <button
                            type="button"
                            onClick={() => {
                                const c1 = char1Ref.current;
                                const c2 = char2Ref.current;
                                if (c1 && c2) {
                                    setChar1(c2);
                                    setChar2(c1);
                                    setResult(null);
                                } else if (!c1 && !c2) {
                                    randomize();
                                } else {
                                    // Only one fighter selected: pick a random partner (#1)
                                    const selectedId = c1?.id ?? c2?.id;
                                    const options = DB_CHARACTERS.filter(f => f.id !== selectedId);
                                    const next = options[Math.floor(Math.random() * options.length)];
                                    if (!c1) setChar1(next);
                                    else setChar2(next);
                                    setResult(null);
                                    toast({
                                        title: "Partner found",
                                        description: `${next.name} joined the fusion.`,
                                        duration: 1600
                                    });
                                }
                            }}
                            className="flex flex-col items-center gap-1 group/plus"
                            aria-label={char1 && char2 ? "Swap fighters" : "Pick random fighter"}
                            title={char1 && char2 ? "Swap fighters" : "Pick a random fighter"}
                        >
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center shadow-sm group-hover/plus:from-orange-200 group-hover/plus:to-yellow-200 group-hover/plus:scale-110 transition-all active:scale-95"
                            >
                                <span className="text-xl font-bold text-orange-500">{char1 && char2 ? '⇄' : '+'}</span>
                            </div>
                            <span className="text-[10px] text-orange-400 font-medium">
                                {char1 && char2 ? 'SWAP' : 'RANDOM'}
                            </span>
                        </button>
                        <CharacterSlot char={char2} position={2} onClear={() => { setChar2(undefined); setResult(null); }} onSlotClick={() => { setChar2(undefined); setResult(null); }} priority={true} highlight={!!char1 && !char2} />
                    </div>

                    <div
                        className={`mb-4 rounded-xl border px-3 py-2 text-xs ${
                            hasQuotaAccessValue
                                ? "border-orange-100 bg-orange-50/60 text-orange-700"
                                : "border-red-100 bg-red-50 text-red-700"
                        }`}
                    >
                        <p className="font-semibold">{quotaStatusCopy.title}</p>
                        <p className="mt-1">{quotaStatusCopy.description}</p>
                    </div>

                    <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                        <p className="font-semibold">{selectionGuidance.title}</p>
                        <p className="mt-1 text-gray-500">{selectionGuidance.description}</p>
                    </div>

                    {/* Fusion Style Selector — hidden for now, defaults to 'potara'
                    {isSelectionComplete && (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Fusion Style</p>
                            <div className="flex flex-wrap gap-2">
                                {DB_FUSION_STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        type="button"
                                        onClick={() => setSelectedStyleId(style.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            selectedStyleId === style.id
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                                        }`}
                                    >
                                        {style.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    */}

                    <Button
                        type="button"
                        onClick={generateFusion}
                        disabled={isGenerating} // Only disable when actually generating to allow clicks for feedback
                        size="lg"
                        className={`
                            w-full py-6 text-xl font-black uppercase tracking-wide shadow-xl
                            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                            ${isShaking ? 'animate-shake ring-2 ring-red-500 ring-offset-2' : ''}
                            ${isGenerating
                                ? 'bg-gray-200 text-gray-500'
                                : !isSelectionComplete
                                    ? 'bg-gray-300 text-gray-500 cursor-pointer hover:bg-gray-400' // Clickable even when inactive — shows shake feedback
                                    : !hasQuotaAccessValue
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white hover:shadow-2xl'
                            }
                        `}
                        aria-label={
                            isGenerating ? "Generating fusion..." :
                                !hasQuotaAccessValue ? (user ? "Upgrade for more attempts" : "Login for energy") :
                                    !isSelectionComplete ? "Select 2 fighters to continue" :
                                        "Create fusion"
                        }
                        title={isGenerating ? "Please wait while we generate your fusion" : undefined}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 animate-spin" aria-hidden="true" focusable="false" />
                                <span aria-live="polite">FUSING...</span>
                            </span>
                        ) : !isSelectionComplete ? (
                            <span className="flex items-center gap-2">
                                <span aria-hidden="true">LOCK</span>
                                <span>SELECT 2 FIGHTERS ({selectedCount}/2)</span>
                            </span>
                        ) : !hasQuotaAccessValue ? (
                            user ? "UNLOCK MORE FUSIONS" : "SAVE MY FUSIONS (FREE)"
                        ) : (
                            <span className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6" aria-hidden="true" focusable="false" />
                                FUU-SION-HA!
                            </span>
                        )}
                    </Button>

                    {!isSelectionComplete && (
                        <p className="mt-3 text-center text-xs text-gray-500">
                            Pick 2 fighters above, then generate. Click a selected fighter again to remove it.
                        </p>
                    )}

                    {/* 未登录用户引导：配额不足时显示 */}
                    {showAuthOptions && !user && (
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4 space-y-1">
                                <h4 className="font-bold text-gray-800">You&apos;ve used your 3 free fusions</h4>
                                <p className="text-xs text-gray-600">
                                    Create a free account to save your fusions and get 2 starter credits, or upgrade to Pro for 300 fusions/month.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                                    onClick={() => {
                                        setAuthMode("sign_in");
                                        setAuthDialogOpen(true);
                                        trackStudioEvent("db_auth_gate_click", { cta: "sign_in_dialog", reason: "quota_limit" });
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 border-0"
                                    onClick={() => {
                                        setAuthMode("sign_up");
                                        setAuthDialogOpen(true);
                                        trackStudioEvent("db_auth_gate_click", { cta: "sign_up_dialog", reason: "quota_limit" });
                                    }}
                                >
                                    Sign Up Free
                                </Button>
                            </div>
                            <Button asChild variant="ghost" className="w-full mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs">
                                <Link href="/pricing?source=dragon_ball_quota_anon" onClick={() => trackStudioEvent("db_auth_gate_click", { cta: "pricing_skip", reason: "quota_limit" })}>
                                    Skip - Upgrade to Pro directly 🚀
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* 已登录用户引导：配额不足时显示 */}
                    {showAuthOptions && user && !hasQuotaAccessValue && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4 space-y-1">
                                <h4 className="font-bold text-gray-800">Fusion Energy Depleted!</h4>
                                <p className="text-xs text-gray-600">
                                    {quota.isVIP
                                        ? "You've used all 300 monthly fusions. Buy a Refill Pack to keep generating."
                                        : "You've used all free credits. Upgrade to keep fusing without limits."
                                    }
                                </p>
                            </div>
                            <div className="space-y-2">
                                {quota.isVIP ? (
                                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-700 border-0">
                                        <Link
                                            href="/pricing?source=dragon_ball_fusion_refill"
                                            onClick={() => trackStudioEvent("db_auth_gate_click", { cta: "refill", reason: "pro_quota_exceeded" })}
                                        >
                                            Buy Refill Pack - 100 Fusions for $4.99 💎
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-700 border-0">
                                        <Link
                                            href="/pricing?source=dragon_ball_fusion_quota"
                                            onClick={() => trackStudioEvent("db_auth_gate_click", { cta: "pricing", reason: "member_quota_exceeded" })}
                                        >
                                            Upgrade to Pro - 300 Fusions/month 🚀
                                        </Link>
                                    </Button>
                                )}
                                <p className="text-[10px] text-center text-gray-500">
                                    {quota.isVIP
                                        ? "Continue fusing with more credits · No waiting for next month"
                                        : "300 fusions/month · No watermark · HD download · Commercial license"
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 加载状态 - Dragon Ball 主题融合动画 */}
            {
                isGenerating && (() => {
                    const phase = fusionProgress < 25 ? "Gathering Ki..."
                        : fusionProgress < 50 ? "Aligning DNA..."
                        : fusionProgress < 75 ? "Fusion in progress..."
                        : fusionProgress < 95 ? "Stabilizing form..."
                        : "Almost there...";
                    return (
                        <Card
                            className="border-0 shadow-xl mb-6 overflow-hidden"
                            aria-live="polite"
                            aria-busy="true"
                            role="status"
                        >
                            <CardContent className="p-0">
                                <div className="relative h-[300px] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
                                    {/* 速度线背景 */}
                                    <div
                                        className="absolute inset-0 opacity-20 animate-fusion-speed"
                                        style={{
                                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px)',
                                            backgroundSize: '100px 100px',
                                        }}
                                    />

                                    {/* 角色缩略图 - 左右向中间靠拢 */}
                                    <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12">
                                        <div className="animate-fusion-left">
                                            <Image
                                                src={char1?.thumbnailUrl || char1?.imageUrl || ''}
                                                alt={char1?.name || 'Character 1'}
                                                width={72} height={72}
                                                className="rounded-full border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 object-cover"
                                            />
                                        </div>
                                        <div className="animate-fusion-right">
                                            <Image
                                                src={char2?.thumbnailUrl || char2?.imageUrl || ''}
                                                alt={char2?.name || 'Character 2'}
                                                width={72} height={72}
                                                className="rounded-full border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* 中心能量球 */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 -m-4 rounded-full bg-yellow-400/30 blur-xl animate-fusion-energy" />
                                            <div className="absolute inset-0 -m-2 rounded-full bg-orange-400/40 blur-md animate-fusion-aura" />
                                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 animate-fusion-energy shadow-2xl shadow-yellow-400/80" />
                                        </div>
                                    </div>

                                    {/* FUU-SION-HA 文字 */}
                                    <div className="absolute top-8 left-0 right-0 text-center">
                                        <p className="text-xl sm:text-2xl font-black text-white tracking-wider animate-fusion-text" style={{ textShadow: '0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,100,0,0.5)' }}>
                                            FUU-SION-HA!
                                        </p>
                                        <p className="text-sm text-yellow-200/80 mt-1 font-semibold">
                                            {char1?.name} × {char2?.name}
                                        </p>
                                    </div>

                                    {/* 进度条 */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-white/90 font-semibold">{phase}</p>
                                            <p className="text-xs text-white/60">~{Math.max(1, Math.ceil((95 - fusionProgress) / 100 * 15))}s</p>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-200 ease-out"
                                                style={{ width: `${fusionProgress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 无障碍 */}
                                    <div className="sr-only">
                                        Generating fusion between {char1?.name} and {char2?.name}. {phase} Please wait.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })()
            }

            {/* 结果显示 */}
            {
                result && (
                    <Card
                        ref={resultRef}
                        className="border-0 shadow-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-8 duration-500"
                        aria-label="Fusion result"
                    >
                        <CardContent className="p-0">
                            {/* 注册引导横幅 - 未登录用户，图片正上方 */}
                            {!user && !resultBannerDismissed && (
                                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-3 text-center">
                                    <p className="text-white font-bold text-sm sm:text-base">
                                        🔥 Love this fusion? Create a free account to save it and get 2 starter credits!
                                    </p>
                                    <div className="mt-2 flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs h-8 px-4 shadow-lg"
                                            onClick={() => {
                                                if (result) persistPendingResult(result, true);
                                                setAuthMode("sign_up");
                                                setAuthDialogOpen(true);
                                                trackStudioEvent("db_result_banner_click", { cta: "sign_up" });
                                            }}
                                        >
                                            Sign Up Free
                                        </Button>
                                        <button
                                            type="button"
                                            className="text-white/80 hover:text-white text-xs underline"
                                            onClick={() => { setResultBannerDismissed(true); trackStudioEvent("db_result_banner_dismiss"); }}
                                        >
                                            No thanks
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100">
                                <Image
                                    src={result.imageUrl}
                                    alt={`${result.char1.name} fused with ${result.char2.name}`}
                                    fill
                                    className="object-contain p-4"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    quality={90}
                                    priority
                                    unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {result.char1.name} × {result.char2.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Fusion complete. Download it, keep generating, or explore next steps.
                                    </p>
                                </div>
                                {!feedbackSubmitted ? (
                                    <div className="flex items-center justify-center gap-4 py-2">
                                        <span className="text-sm text-gray-500">How do you like it?</span>
                                        <button type="button" onClick={() => submitFeedback(1)} className="text-2xl hover:scale-125 transition-transform" aria-label="Love it">😍</button>
                                        <button type="button" onClick={() => submitFeedback(2)} className="text-2xl hover:scale-125 transition-transform" aria-label="It's okay">😐</button>
                                        <button type="button" onClick={() => submitFeedback(3)} className="text-2xl hover:scale-125 transition-transform" aria-label="Not good">😢</button>
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-green-600 py-2">Thanks for your feedback!</p>
                                )}
                                {/* Primary action — guests: Save (registration hook); members: Download */}
                                {!user ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (result) persistPendingResult(result, true);
                                            setAuthMode("sign_up");
                                            setAuthDialogOpen(true);
                                            trackStudioEvent("db_result_primary_click", { cta: "save_signup" });
                                        }}
                                        size="lg"
                                        aria-label="Save this fusion by creating a free account"
                                        className="w-full py-6 text-base font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                                    >
                                        💾 Save My Fusion — Free
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={downloadImage}
                                        size="lg"
                                        aria-label="Download fusion image"
                                        className="w-full py-6 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                                        title="Download fusion image"
                                    >
                                        <Download className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" />
                                        {quota.isVIP ? "Download HD" : "Download (Watermarked)"}
                                    </Button>
                                )}

                                {/* Secondary actions */}
                                <div className="grid grid-cols-2 gap-2">
                                    {!user ? (
                                        <Button
                                            type="button"
                                            onClick={downloadImage}
                                            variant="outline"
                                            aria-label="Download fusion image"
                                            title="Download watermarked image"
                                        >
                                            <Download className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" />
                                            Download
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={toggleFavorite}
                                            disabled={isSaving}
                                            variant={isSaved ? "default" : "outline"}
                                            className={isSaved ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : ""}
                                            title={isSaved ? "Remove from favorites" : "Save to favorites"}
                                        >
                                            {isSaved ? "★ Saved to History" : "☆ Save to History"}
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        aria-label="Share this fusion with friends"
                                        onClick={shareResult}
                                        variant="outline"
                                        title="Share fusion result"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" />
                                        Share
                                    </Button>
                                </div>

                                {/* Regenerate the same pair — key satisfaction lever (AI output varies each run) */}
                                <Button
                                    type="button"
                                    onClick={generateFusion}
                                    disabled={isGenerating}
                                    variant="outline"
                                    aria-label="Regenerate a new version of the same two fighters"
                                    className="w-full border-orange-300 text-orange-700 font-semibold hover:bg-orange-50"
                                    title="Not quite right? Generate another version of the same pair"
                                >
                                    <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} aria-hidden="true" focusable="false" />
                                    {isGenerating ? "Generating…" : "🎲 Regenerate This Pair"}
                                </Button>

                                {/* Remix / explore — compact, low-emphasis */}
                                <div className="grid grid-cols-3 gap-1">
                                    <Button type="button" onClick={clearSelection} variant="ghost" className="text-xs text-gray-500 hover:text-orange-600" title="Start a brand new pair">
                                        <RefreshCw className="w-3.5 h-3.5 mr-1" aria-hidden="true" focusable="false" />
                                        New Pair
                                    </Button>
                                    <Button type="button" onClick={swapLeftFighter} variant="ghost" className="text-xs text-gray-500 hover:text-orange-600" title="Keep the right fighter, swap the left">
                                        Swap Left
                                    </Button>
                                    <Button type="button" onClick={swapRightFighter} variant="ghost" className="text-xs text-gray-500 hover:text-orange-600" title="Keep the left fighter, swap the right">
                                        Swap Right
                                    </Button>
                                </div>

                                {/* Upgrade nudge — non-VIP only (single, consolidated CTA) */}
                                {!quota.isVIP && (
                                    <Link
                                        href="/pricing?source=dragon_ball_result_upgrade"
                                        onClick={() => trackStudioEvent("db_result_upgrade_click", { is_logged_in: Boolean(user) })}
                                        className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                                    >
                                        <Sparkles className="w-4 h-4" aria-hidden="true" focusable="false" />
                                        Upgrade to Pro — HD, no watermark, 300/mo
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* 底部说明 */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-xs text-gray-400">
                    Fusion results are AI-generated for entertainment. Not official Dragon Ball content.
                </p>
            </div>

            {/* 内联注册/登录对话框 */}
            <Dialog open={authDialogOpen} onOpenChange={(open) => { setAuthDialogOpen(open); if (!open) setAuthHeadline(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {authHeadline ? authHeadline.title : (authMode === "sign_up" ? "Save My Fusions (Free)" : "Welcome Back")}
                        </DialogTitle>
                        <DialogDescription>
                            {authHeadline
                                ? authHeadline.description
                                : authMode === "sign_up"
                                    ? "Create an account to save your fusion history and get 2 starter credits."
                                    : "Sign in to continue your fusion session and access your saved creations."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {/* Google 登录 */}
                        <form action={authMode === "sign_in" ? signInWithGoogleAction : signUpWithGoogleAction}>
                            <input type="hidden" name="redirect_to" value={dbReturnTarget} />
                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 shadow-sm"
                                onClick={() => {
                                    setPendingForm(true);
                                    setFormError(null);
                                    trackStudioEvent("db_auth_dialog_click", { method: "google", mode: authMode });
                                }}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                            {authMode === "sign_up" && (
                                <p className="text-xs text-center text-green-700 font-medium">
                                    Instant access — no email verification needed
                                </p>
                            )}
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or with email
                                </span>
                            </div>
                        </div>

                        {/* 切换登录/注册标签 */}
                        <div className="flex rounded-lg border p-1 bg-muted/30">
                            <button
                                type="button"
                                onClick={() => { setAuthMode("sign_up"); setFormError(null); }}
                                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${authMode === "sign_up" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Sign Up
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode("sign_in"); setFormError(null); }}
                                className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${authMode === "sign_in" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Sign In
                            </button>
                        </div>

                        {/* 密码表单 */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setFormError(null);
                                setPendingForm(true);
                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                formData.set("redirect_to", dbReturnTarget);
                                try {
                                    // Use inline-safe actions — return results, never throw redirect()
                                    const action = authMode === "sign_up" ? inlineSignUpAction : inlineSignInAction;
                                    const result = await action(formData);
                                    if (result.error) {
                                        setFormError(result.error);
                                    } else if (result.success) {
                                        // Registration success — show inline message
                                        setFormError(null);
                                        setAuthMode("sign_in");
                                        toast({
                                            title: "Account created! 🎉",
                                            description: result.success,
                                            duration: 8000,
                                        });
                                    } else if (result.redirect) {
                                        window.location.href = result.redirect;
                                    }
                                } catch (err) {
                                    setFormError(err instanceof Error ? err.message : "An error occurred. Please try again.");
                                } finally {
                                    setPendingForm(false);
                                }
                            }}
                            className="grid gap-3"
                        >
                            <input type="hidden" name="redirect_to" value={dbReturnTarget} />
                            <div className="grid gap-1.5">
                                <Label htmlFor="auth-email">Email</Label>
                                <Input
                                    id="auth-email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                    className="h-10"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="auth-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="auth-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={authMode === "sign_up" ? "Create a password (min 6 chars)" : "Enter your password"}
                                        autoComplete={authMode === "sign_up" ? "new-password" : "current-password"}
                                        required
                                        minLength={6}
                                        className="pr-10 h-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {authMode === "sign_in" && (
                                <div className="text-right">
                                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground hover:underline" onClick={() => setAuthDialogOpen(false)}>
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
                            {formError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={pendingForm}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 border-0"
                            >
                                {pendingForm ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {authMode === "sign_up" ? "Creating account..." : "Signing in..."}
                                    </>
                                ) : (
                                    authMode === "sign_up" ? "Create Free Account" : "Sign In"
                                )}
                            </Button>
                            {authMode === "sign_up" && (
                                <p className="text-[10px] text-center text-muted-foreground">
                                    Both Google and email sign-up are instant.
                                </p>
                            )}
                        </form>

                        <p className="text-xs text-center text-muted-foreground">
                            By continuing, you agree to our{' '}
                            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>


        </div >
    );
}

// ===============================
// CharacterSlot 组件
// ===============================
interface CharacterSlotProps {
    char?: DBCharacter;
    position: 1 | 2;
    onClear?: () => void;
    onSlotClick?: () => void;
    priority?: boolean;
    highlight?: boolean;
}

const CharacterSlot = ({ char, position, onClear, onSlotClick, priority = false, highlight = false }: CharacterSlotProps) => {
    const color = position === 1
        ? { border: 'border-orange-500', bg: 'bg-orange-500', highlightBorder: 'border-orange-400', highlightShadow: 'shadow-orange-200', highlightText: 'text-orange-400' }
        : { border: 'border-blue-500', bg: 'bg-blue-500', highlightBorder: 'border-blue-400', highlightShadow: 'shadow-blue-200', highlightText: 'text-blue-400' };

    // ✅ 改进：屏幕阅读器提示
    const [isCleared, setIsCleared] = useState(false);

    const handleClear = () => {
        setIsCleared(true);
        setTimeout(() => setIsCleared(false), 3000); // 3秒后重置
        if (onClear) onClear();
    };

    return (
        <div className="flex flex-col items-center group">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => { if (char && onSlotClick) onSlotClick(); }}
                    className={`
                        relative w-24 h-24 rounded-xl overflow-hidden border-4 shadow-lg
                        ${char ? color.border : (highlight ? `${color.highlightBorder} animate-pulse shadow-lg ${color.highlightShadow}` : 'border-gray-200')} bg-gray-100
                        ${char && onSlotClick ? 'cursor-pointer hover:brightness-95 active:scale-95 transition-all' : 'cursor-default'}
                    `}
                    aria-label={char ? `${char.name} character - tap to remove` : `Empty slot ${position}${highlight ? ' - pick a character' : ''}`}
                    disabled={!char || !onSlotClick}
                >
                {char ? (
                    <Image
                        src={char.imageUrl}
                        alt={char.name}
                        fill
                        className="object-contain p-1"
                        sizes="96px"
                        quality={85}
                        priority={priority}
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className={`font-black ${highlight ? `text-sm ${color.highlightText}` : 'text-2xl text-gray-300'}`}>{highlight ? 'PICK!' : '?'}</span>
                    </div>
                )}
                </button>
                {char && onClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-1 left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                        aria-label="Remove this fighter"
                        title="Remove this fighter"
                    >
                        x
                    </button>
                )}
            </div>
            <div
                className={`
                    mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase
                    ${char ? `${color.bg} text-white` : 'bg-gray-100 text-gray-400'}
                `}
                aria-label={char ? `Selected: ${char.name}` : `Slot ${position}`}
            >
                {char ? char.name : `SLOT ${position}`}
            </div>
            {isCleared && (
                <div className="sr-only" aria-live="polite">
                    Slot {position} cleared
                </div>
            )}
        </div>
    );
};
