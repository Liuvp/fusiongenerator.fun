"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, RefreshCw, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { DB_CHARACTERS, DBCharacter, getRandomCharacters } from "@/lib/dragon-ball-data";
import { User } from "@supabase/supabase-js";

// ===============================
// 常量定义
// ===============================
const LOCAL_STORAGE_KEY = "db_fusion_studio_state";
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
const DEFAULT_QUOTA = { used: 0, remaining: 1, limit: 1, isVIP: false }; // 统一免费额度为 1 次

// ===============================
// 类型定义
// ===============================
interface FusionResult {
    imageUrl: string;
    char1: DBCharacter;
    char2: DBCharacter;
}

interface Quota {
    used: number;
    remaining: number;
    limit: number;
    isVIP: boolean;
}

interface LocalStorageState {
    c1?: string;
    c2?: string;
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
    quota.isVIP ? "∞" : quota.remaining.toString();

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

    // 未登录且配额未加载：允许尝试（会在 API 层面检查）
    return true;
};

// ===============================
// CharacterButton 组件 - 提取出来减少主组件复杂度
// ===============================
interface CharacterButtonProps {
    character: DBCharacter;
    index: number;
    isSelected1: boolean;
    isSelected2: boolean;
    onSelect: (char: DBCharacter) => void;
}

const CharacterButton = ({
    character,
    index,
    isSelected1,
    isSelected2,
    onSelect
}: CharacterButtonProps) => {
    const isSelected = isSelected1 || isSelected2;

    return (
        <button
            type="button"
            onClick={() => onSelect(character)}
            className={`
                group relative aspect-square rounded-xl overflow-hidden border-2 
                transition-all duration-200 active:scale-95 touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                ${isSelected1
                    ? 'border-orange-500 shadow-md ring-2 ring-orange-200 ring-offset-1 scale-105'
                    : isSelected2
                        ? 'border-blue-500 shadow-md ring-2 ring-blue-200 ring-offset-1 scale-105'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                }
            `}
            aria-label={`Select ${character.name}`}
            aria-pressed={isSelected}
            title={`Select ${character.name}`}
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
                    `}
                    priority={index < 8} // Prioritize above-the-fold characters
                    unoptimized={true} // Avoid blurry downscaling if Next.js image optimization is aggressive
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
            </div>
        </button>
    );
};

// ===============================
// 主组件
// ===============================
export function DBFusionStudio() {
    const { toast } = useToast();
    const resultRef = useRef<HTMLDivElement>(null);
    const selectionCardRef = useRef<HTMLDivElement>(null);

    // ✅ 使用 useRef 管理订阅，避免重复创建
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
    const supabase = createClient();

    // ===============================
    // 状态管理
    // ===============================
    const [char1, setChar1] = useState<DBCharacter | undefined>(DB_CHARACTERS.find(c => c.id === 'goku'));
    const [char2, setChar2] = useState<DBCharacter | undefined>(DB_CHARACTERS.find(c => c.id === 'vegeta'));
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<FusionResult | null>(null);
    const [quota, setQuota] = useState<Quota>(DEFAULT_QUOTA);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // ===============================
    // State for interactive feedback
    // ===============================
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isSelectionHintActive, setIsSelectionHintActive] = useState(false);

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

    const quotaStatusCopy = useMemo(() => {
        if (isLoadingAuth) {
            return {
                title: "Checking your fusion energy...",
                description: "Preparing your account and free quota details."
            };
        }

        if (quota.isVIP) {
            return {
                title: "VIP unlocked: unlimited fusions",
                description: "Generate as many Dragon Ball fusions as you want."
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
                    description: "Sign in to unlock more credits when your free quota runs out."
                };
        }

        return user
            ? {
                title: "No credits left",
                description: "Upgrade to VIP for unlimited Dragon Ball fusions."
            }
            : {
                title: "Free quota used",
                description: "Sign in to continue generating fusions."
            };
    }, [hasQuotaAccessValue, isLoadingAuth, quota.isVIP, quota.remaining, user]);

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

    // ===============================
    // 初始化加载
    // ===============================
    useEffect(() => {
        loadFromLocalStorage();
    }, [loadFromLocalStorage]);

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
                    if (isMounted) setQuota(quotaData.quota);
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
    // 交互函数
    // ===============================
    const selectCharacter = useCallback((char: DBCharacter): void => {
        const selectedBefore = Number(Boolean(char1)) + Number(Boolean(char2));
        console.log("Selecting:", char.name, "Current:", { c1: char1?.name, c2: char2?.name });

        // 允许反选：点击已选中的角色取消选中
        if (char1?.id === char.id) {
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
        if (char2?.id === char.id) {
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

        if (!char1) {
            setChar1(char);
        } else if (!char2) {
            setChar2(char);
        } else {
            // 队列逻辑：旧的 char1 移到 char2，新角色占据 char1
            setChar2(char1);
            setChar1(char);
        }
        setResult(null);
    }, [char1, char2]);

    const randomize = useCallback((): void => {
        const [c1, c2] = getRandomCharacters(2);
        setChar1(c1);
        setChar2(c2);
        setResult(null);

        toast({
            title: "Random Pair Selected",
            description: `${c1.name} + ${c2.name}`,
            duration: 2000
        });
    }, [toast]);

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
                    description: "Upgrade to VIP for unlimited fusions!",
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

        try {
            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    char1: char1!.id,
                    char2: char2!.id,
                    style: 'potara'
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
                    toast({
                        title: "Limit Reached",
                        description: user
                            ? "Upgrade to VIP for unlimited fusions."
                            : "Sign in to unlock more fusion credits.",
                        variant: "destructive",
                        duration: 3000
                    });

                    // 延迟跳转，给用户时间看 Toast
                    trackStudioEvent("db_generate_fail", {
                        reason: "api_limit_reached",
                        status_code: response.status,
                        is_logged_in: Boolean(user),
                        remaining_quota: quota.remaining,
                    });
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
            setResult({
                imageUrl: data.imageUrl,
                char1: char1!,
                char2: char2!
            });

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
        toast,
        user,
    ]);

    const downloadImage = useCallback(async (): Promise<void> => {
        if (!result?.imageUrl) return;

        try {
            const a = document.createElement('a');
            a.href = result.imageUrl;
            a.download = `fusion-${result.char1.name}-${result.char2.name}-${Date.now()}.jpg`;
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
    }, [result, toast]);

    const shareResult = useCallback(async (): Promise<void> => {
        if (!result) return;

        const shareData = {
            title: `${result.char1.name} × ${result.char2.name} Fusion`,
            text: `Check out this Dragon Ball fusion created with Fusion Generator!`,
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link Copied!",
                    description: "Paste to share with friends",
                    duration: 2000
                });
            }
        } catch {
            console.warn("Share failed");
        }
    }, [result, toast]);

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
                onSelect={selectCharacter}
            />
        ));
    }, [char1, char2, selectCharacter]);

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
            className="bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl"
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
            {steps}

            {/* 角色选择区域 */}
            <Card
                ref={selectionCardRef}
                className={`border-0 shadow-sm mb-6 transition-all ${isSelectionHintActive ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
            >
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
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
                        className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar"
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
                        <CharacterSlot char={char1} position={1} onClear={clearSelection} priority={true} />
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center shadow-sm"
                                aria-hidden="true"
                            >
                                <span className="text-xl font-bold text-orange-500" aria-hidden="true">+</span>
                            </div>
                            <span className="text-[10px] text-orange-400 font-medium">FUSE</span>
                        </div>
                        <CharacterSlot char={char2} position={2} onClear={clearSelection} priority={true} />
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
                                    ? 'bg-gray-300 text-gray-500 cursor-help hover:bg-gray-400' // Visual indication of inactive state
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
                            user ? "UPGRADE TO CONTINUE" : "LOGIN TO CONTINUE"
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
                                <h4 className="font-bold text-gray-800">Need more Fusion Energy?</h4>
                                <p className="text-xs text-gray-600">
                                    Join thousands of Dragon Ball fans creating daily fusions!
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button asChild variant="outline" className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
                                    <Link href={`/sign-in?redirect_to=${encodeURIComponent('/dragon-ball#fusion-studio')}&reason=quota_limit&source=dragon_ball_fusion`}>
                                        Log In
                                    </Link>
                                </Button>
                                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 border-0">
                                    <Link href={`/sign-up?redirect_to=${encodeURIComponent('/dragon-ball#fusion-studio')}&reason=quota_limit&source=dragon_ball_fusion`}>
                                        Sign Up Free
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* 已登录用户引导：配额不足时显示 */}
                    {showAuthOptions && user && !hasQuotaAccessValue && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4 space-y-1">
                                <h4 className="font-bold text-gray-800">Fusion Energy Depleted!</h4>
                                <p className="text-xs text-gray-600">
                                    Become a Super Saiyan (VIP) for unlimited generations.
                                </p>
                            </div>
                            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-700 border-0">
                                <Link href="/pricing?source=dragon_ball_fusion_quota">
                                    Upgrade to VIP 🚀
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 加载状态 */}
            {
                isGenerating && (
                    <Card
                        className="border-0 shadow-md mb-6 animate-pulse"
                        aria-live="polite"
                        aria-busy="true"
                        role="status"
                    >
                        <CardContent className="h-[300px] flex flex-col items-center justify-center p-5 space-y-4 bg-gray-50/50 rounded-xl">
                            <Sparkles
                                className="w-12 h-12 text-orange-400 animate-spin"
                                aria-hidden="true"
                                focusable="false"
                            />
                            <p className="text-gray-600 font-semibold">Channeling Ki...</p>
                            <p className="text-sm text-gray-500 font-medium">You can switch tabs while we keep generating.</p>
                            <p className="text-xs text-gray-400">We will show the fusion result here as soon as it is ready.</p>
                            <div className="sr-only">
                                Generating fusion between {char1?.name} and {char2?.name}. Please wait.
                            </div>
                        </CardContent>
                    </Card>
                )
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        onClick={downloadImage}
                                        variant="default"
                                        aria-label="Download fusion results as an image"
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                        title="Download fusion image"
                                    >
                                        <Download className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" />
                                        Download HD
                                    </Button>
                                    <Button
                                        type="button"
                                        aria-label="Continue generating another Dragon Ball fusion"
                                        onClick={clearSelection}
                                        variant="outline"
                                        title="Continue with a new fusion"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" />
                                        Continue Generating
                                    </Button>
                                    <Button
                                        type="button"
                                        aria-label="Share this fusion with friends"
                                        onClick={shareResult}
                                        variant="outline"
                                        title="Share fusion result"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" />
                                        Share Result
                                    </Button>
                                    <Button
                                        type="button"
                                        asChild
                                        variant="outline"
                                        title="View example fusion results"
                                    >
                                        <Link href="/gallery?source=dragon_ball_result">
                                            View Example Results
                                        </Link>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Button type="button" asChild variant="outline">
                                        <Link href="/pokemon?source=dragon_ball_result">
                                            Try Pokemon Studio
                                        </Link>
                                    </Button>
                                    <Button type="button" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-0">
                                        <Link href="/pricing?source=dragon_ball_result_next_step">
                                            Unlock Unlimited
                                        </Link>
                                    </Button>
                                </div>
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
    priority?: boolean;
}

const CharacterSlot = ({ char, position, onClear, priority = false }: CharacterSlotProps) => {
    const color = position === 1
        ? { border: 'border-orange-500', bg: 'bg-orange-500' }
        : { border: 'border-blue-500', bg: 'bg-blue-500' };

    // ✅ 改进：屏幕阅读器提示
    const [isCleared, setIsCleared] = useState(false);

    const handleClear = () => {
        setIsCleared(true);
        setTimeout(() => setIsCleared(false), 3000); // 3秒后重置
        if (onClear) onClear();
    };

    return (
        <div className="flex flex-col items-center group">
            <div
                className={`
                    relative w-24 h-24 rounded-xl overflow-hidden border-4 shadow-lg
                    ${char ? color.border : 'border-gray-200'} bg-gray-100
                `}
                role="img"
                aria-label={char ? `${char.name} character` : `Empty slot ${position}`}
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
                        <span className="text-2xl font-black text-gray-300">?</span>
                    </div>
                )}
                {char && onClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-1 left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Clear current selection"
                        title="Clear current selection"
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
