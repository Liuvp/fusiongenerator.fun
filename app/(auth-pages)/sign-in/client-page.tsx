"use client";

import { signInAction, signInWithGoogleAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Zap, Eye, EyeOff, Infinity, Download, Images } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackEvent, toAnalyticsErrorMessage } from "@/utils/analytics";
import type { AuthSearchParams } from "./page";

export default function ClientPage({
    searchParams,
    redirectTo,
}: {
    searchParams: AuthSearchParams;
    redirectTo?: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const trackedErrorRef = useRef<string | null>(null);
    const source = searchParams.source || "direct";
    const reason = searchParams.reason || "none";
    const isAiStudioFlow = source === "ai_studio";
    const buildAuthHref = (basePath: "/sign-in" | "/sign-up") => {
        const params = new URLSearchParams();
        if (redirectTo) params.set("redirect_to", redirectTo);
        if (source && source !== "direct") params.set("source", source);
        if (reason && reason !== "none") params.set("reason", reason);
        const query = params.toString();
        return query ? `${basePath}?${query}` : basePath;
    };

    useEffect(() => {
        trackEvent("auth_page_view", {
            page: "sign_in",
            source,
            reason,
            has_redirect: Boolean(redirectTo),
        });
    }, [reason, redirectTo, source]);

    useEffect(() => {
        if (!("error" in searchParams) || !searchParams.error) return;
        if (trackedErrorRef.current === searchParams.error) return;

        trackedErrorRef.current = searchParams.error;
        trackEvent("auth_form_error", {
            page: "sign_in",
            source,
            reason,
            message: searchParams.error.slice(0, 160),
        });
    }, [reason, searchParams, source]);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            trackEvent("auth_runtime_error", {
                page: "sign_in",
                source,
                reason,
                message: toAnalyticsErrorMessage(event.error || event.message),
            });
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            trackEvent("auth_runtime_error", {
                page: "sign_in",
                source,
                reason,
                message: toAnalyticsErrorMessage(event.reason),
            });
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);
        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, [reason, source]);

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Welcome Back to Fusion Generator
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Sign in to continue your current fusion, use your credits, and access saved creations.
                </p>
                {redirectTo && (
                    <p className="text-xs font-medium text-primary">
                        Sign in and we&apos;ll bring you back to where you left off.
                    </p>
                )}
            </div>

            {isAiStudioFlow && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    <p className="font-semibold">You&apos;re coming back to AI Fusion Studio</p>
                    <p className="mt-1 text-xs text-blue-800">
                        If you previously used Google, choose Continue with Google for the fastest route back to your fusion flow.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 my-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                    <Infinity className="mx-auto h-6 w-6 text-primary" />
                    <div className="text-xs text-muted-foreground mt-2">Continue Your Session</div>
                </div>
                <div className="text-center">
                    <Download className="mx-auto h-6 w-6 text-primary" />
                    <div className="text-xs text-muted-foreground mt-2">Use Your Credits</div>
                </div>
                <div className="text-center">
                    <Images className="mx-auto h-6 w-6 text-primary" />
                    <div className="text-xs text-muted-foreground mt-2">Saved Gallery</div>
                </div>
            </div>

            <div className="grid gap-6">
                <form action={signInWithGoogleAction} className="grid gap-3">
                    <input type="hidden" name="redirect_to" value={redirectTo || ""} />
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 h-11"
                        onClick={() =>
                            trackEvent("auth_submit_click", {
                                page: "sign_in",
                                method: "google",
                                source,
                                reason,
                            })
                        }
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        If you used Google before, start here to avoid password errors.
                    </p>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or use email
                        </span>
                    </div>
                </div>
                <form className="grid gap-4">
                    <input type="hidden" name="redirect_to" value={redirectTo || ""} />

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="pr-10 h-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <SubmitButton
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        pendingText="Signing in..."
                        formAction={signInAction}
                        onClick={() =>
                            trackEvent("auth_submit_click", {
                                page: "sign_in",
                                method: "password",
                                source,
                                reason,
                            })
                        }
                    >
                        <Zap className="mr-2 h-4 w-4" />
                        Sign in with email
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </form>
                <div className="text-sm text-muted-foreground text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={buildAuthHref("/sign-up")}
                        className="text-primary underline underline-offset-4 hover:text-primary/90 font-semibold"
                        onClick={() =>
                            trackEvent("auth_switch_flow_click", {
                                page: "sign_in",
                                destination: "sign_up",
                                source,
                                reason,
                            })
                        }
                    >
                        Sign up for free
                    </Link>
                </div>

                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center mb-2">Start creating without an account:</p>
                    <div className="grid grid-cols-3 gap-2">
                        <Link href="/pokemon" className="text-xs text-center p-2 rounded-md border hover:bg-muted/50 transition-colors">
                            Pokemon
                        </Link>
                        <Link href="/dragon-ball" className="text-xs text-center p-2 rounded-md border hover:bg-muted/50 transition-colors">
                            Dragon Ball
                        </Link>
                        <Link href="/ai" className="text-xs text-center p-2 rounded-md border hover:bg-muted/50 transition-colors">
                            AI Fusion
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
