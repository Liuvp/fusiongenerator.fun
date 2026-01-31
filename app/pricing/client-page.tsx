"use client";

import Link from "next/link";
import Script from "next/script";
import { Check, Crown, Gift, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { User } from "@supabase/supabase-js";
import { useUser } from "@/hooks/use-user";

export default function PricingPage({ user: serverUser }: { user: User | null }) {
    const { user: clientUser, loading } = useUser();
    const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Keep for navigation
    const { toast } = useToast();

    // Use client user if available (solves nav issues), fallback to server user
    const user = clientUser || serverUser;

    const handleCheckout = async (plan: string) => {
        if (!user && !loading) {
            toast({
                title: "Login Required",
                description: "Please login to subscribe.",
            });
            // Redirect to login page with return URL
            router.push(`/sign-in?next=/pricing`);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || "No checkout URL returned");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Failed",
                description: error.message || "Please try again later.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">


            <main className="flex-1 min-h-screen bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4 md:px-6 py-10">

                    {/* Header */}
                    <section
                        className="animate-fade-in-up text-center space-y-2 mb-10"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            Fusion Generator Pricing Plans
                        </h1>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Create High-Quality AI Character Fusions with Advanced AI Technology
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center items-center mt-6 space-x-4">
                            <span className={`text-sm ${billingInterval === "monthly" ? "font-bold text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                            <button
                                onClick={() => setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                <span
                                    className={`${billingInterval === "yearly" ? "translate-x-6 bg-primary" : "translate-x-1 bg-muted-foreground"} inline-block h-4 w-4 transform rounded-full transition-transform`}
                                />
                            </button>
                            <span className={`text-sm ${billingInterval === "yearly" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                                Yearly <span className="text-green-500 font-bold ml-1">(Save 17%)</span>
                            </span>
                        </div>
                    </section>

                    {/* Pricing Cards */}
                    <section className="w-full py-6">
                        <div className="mx-auto max-w-6xl space-y-12">

                            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-start">
                                {/* Free Plan */}
                                <div className="animate-fade-in-up animation-delay-200 relative h-full">
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20 flex flex-col">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-muted" aria-label="Free Plan Icon" role="img">
                                                    <Gift className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-2xl font-bold text-foreground">Free Plan</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-bold text-foreground">$0</span>
                                                    <span className="text-muted-foreground text-lg">forever</span>
                                                </div>
                                                <p className="text-muted-foreground">Try all fusion generators</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">1 free fusion daily</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Standard queue (Slow)</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Watermarked images</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Standard quality (720p)</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Personal use only</span>
                                                </div>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <Link
                                                    href="/ai"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground px-4 py-2 w-full h-12 text-lg font-medium transition-all duration-200 border-primary/20 text-primary hover:bg-primary/5"
                                                >
                                                    Start Creating Free
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pro Unlimited - HERO */}
                                <div className="animate-fade-in-up animation-delay-400 relative h-full">
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[200px]">
                                        <div className="flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow-lg">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Most Popular
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-xl h-full transition-all duration-300 transform hover:scale-105 border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col relative overflow-hidden">
                                        {billingInterval === "yearly" && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">
                                                SAVE 17%
                                            </div>
                                        )}
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className="h-20 w-20 bg-primary/10 rounded-full blur-3xl absolute -top-10 -right-10"></div>
                                        </div>

                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-4 rounded-full bg-primary/20 ring-4 ring-primary/10" aria-label="Pro Unlimited Plan Icon" role="img">
                                                    <Crown className="h-8 w-8 text-primary" aria-hidden="true" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-3xl font-bold text-foreground">Pro Unlimited</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-extrabold text-foreground">
                                                        {billingInterval === "monthly" ? "$9.99" : "$79.99"}
                                                    </span>
                                                    <span className="text-muted-foreground text-lg">/{billingInterval === "monthly" ? "mo" : "yr"}</span>
                                                </div>
                                                <p className="text-primary font-medium">Commercial Use for Original AI Artwork*</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="font-semibold text-foreground">
                                                            {billingInterval === "monthly" ? "300 Fast Fusions / mo" : "3600 Fast Fusions / yr"}
                                                        </span>
                                                        <p className="text-xs text-muted-foreground">Jump the queue, generate in seconds</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="font-semibold text-foreground">Unlimited Relax Mode</span>
                                                        <p className="text-xs text-muted-foreground">Keep creating even after fast usage</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">No Watermark & HD Quality</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Private Mode (Hidden from Gallery)</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Priority Support</span>
                                                </div>
                                            </div>
                                            <div className="pt-6 mt-auto">
                                                <button
                                                    onClick={() => handleCheckout(billingInterval)}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-14 text-lg font-bold transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/30"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="nr-2 h-4 w-4 animate-spin" />
                                                            Redirecting...
                                                        </>
                                                    ) : (
                                                        "Get Pro Unlimited"
                                                    )}
                                                </button>
                                                <p className="text-xs text-center text-muted-foreground mt-3">
                                                    Starts a monthly subscription. You will be redirected to secure checkout.
                                                </p>
                                                <p className="text-xs text-center text-muted-foreground">
                                                    Secure payment via Creem • Cancel anytime
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Extra Credits / Refill Pack */}
                                <div className="animate-fade-in-up animation-delay-600 relative h-full">
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20 flex flex-col">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20" aria-label="Extra Credits Icon" role="img">
                                                    <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-2xl font-bold text-foreground">Extra Credits</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-4xl font-bold text-foreground">$4.99</span>
                                                </div>
                                                <p className="text-muted-foreground">One-time purchase</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed font-medium text-foreground">+100 Fast Fusions</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Never expires</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">No subscription required</span>
                                                </div>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <button
                                                    onClick={() => handleCheckout("refill")}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground px-4 py-2 w-full h-12 text-lg font-medium transition-all duration-200 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50"
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Buy Refill Pack"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing & Subscription Info */}
                            <div
                                className="animate-fade-in-up animation-delay-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
                            >
                                <h3 className="text-lg font-semibold text-foreground mb-4">Billing & Subscription</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Subscriptions renew automatically unless cancelled</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>You can cancel anytime from your account dashboard</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>No long-term commitment required</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>Refunds are handled according to our refund policy</span>
                                    </li>
                                </ul>
                                <p className="text-xs text-muted-foreground/80 mt-4 italic">
                                    *Unlimited usage is subject to fair use and system capacity limits.
                                </p>
                            </div>

                            {/* FAQ Section */}
                            <div
                                className="animate-fade-in-up animation-delay-1000 text-center space-y-4 pt-8 border-t"
                            >
                                <h3 className="text-xl font-semibold text-foreground">Common Questions</h3>
                                <div className="mx-auto max-w-3xl text-left space-y-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="font-semibold text-foreground">What is "Fast GPU"?</p>
                                        <p className="text-base text-muted-foreground mt-1">Pro users get access to our high-speed GPU cluster. Images generate in seconds, skipping the free queue completely.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Is the "Unlimited" really unlimited?</p>
                                        <p className="text-base text-muted-foreground mt-1">Yes! You have a high allowance of Fast Generations. If you exceed it, you can still generate unlimited images in Relax Mode (slightly slower).</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Can I use images commercially?</p>
                                        <p className="text-base text-muted-foreground mt-1">Yes! Pro plan includes a full commercial license. You own the images you create, subject to third-party character rights.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Can I cancel anytime?</p>
                                        <p className="text-base text-muted-foreground mt-1">Absolutely. You can cancel your subscription from your dashboard at any time. No questions asked.</p>
                                    </div>
                                </div>

                                {/* Commercial Use Disclaimer */}
                                <div className="mt-8 pt-6 border-t border-border">
                                    <p className="text-sm text-center text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                        <span className="font-semibold text-foreground">Commercial Use Notice:</span> Commercial use applies to original AI-generated artwork. Users are responsible for ensuring compliance with third-party character rights.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
