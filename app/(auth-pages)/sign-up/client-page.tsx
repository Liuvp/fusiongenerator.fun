"use client";

import { signUpAction, signUpWithGoogleAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Zap, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ClientPage({ searchParams, redirectTo }: { searchParams: Message, redirectTo?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Join Fusion Generator
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Create unlimited Dragon Ball & Pokemon fusions with our AI-powered generator
                </p>
            </div>

            {/* Benefits Section */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-semibold mb-3 text-center">What you'll get:</p>
                <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Unlimited fusion generations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>HD quality downloads (1080p)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Save to personal gallery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>No watermarks on images</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Priority processing</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <form className="grid gap-4">
                    {/* Redirect URL */}
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
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                minLength={6}
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
                        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                    </div>
                    <SubmitButton
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        pendingText="Creating account..."
                        formAction={signUpAction}
                    >
                        <Zap className="mr-2 h-4 w-4" />
                        Create free account
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <form action={signUpWithGoogleAction}>
                    <input type="hidden" name="redirect_to" value={redirectTo || ""} />
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
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
                        Sign up with Google
                    </Button>
                </form>

                <div className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                    Already have an account?{" "}
                    <Link
                        href={redirectTo ? `/sign-in?redirect_to=${encodeURIComponent(redirectTo)}` : "/sign-in"}
                        className="text-primary underline underline-offset-4 hover:text-primary/90 font-semibold"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center mb-2">Try it free first:</p>
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
