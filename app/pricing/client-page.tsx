"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Gift, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { User } from "@supabase/supabase-js";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function PricingPage({ user }: { user: User | null }) {
    const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Keep for navigation
    const { toast } = useToast();

    const handleCheckout = async (plan: string) => {
        if (!user) {
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

                    {/* Banner */}
                    <motion.section
                        className="text-center py-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl mb-10"
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                    >
                        <h3 className="text-2xl font-bold mb-2">Try Our Dragon Ball Fusion Generator Free Today!</h3>
                        <p className="mb-4 text-muted-foreground">5 free fusions daily - No credit card required</p>
                        <Link
                            href="/ai"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            Start Free Dragon Ball Fusion
                        </Link>
                    </motion.section>

                    {/* Header */}
                    <motion.section
                        className="text-center space-y-2 mb-10"
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                    >
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            Fusion Generator Pricing
                        </h1>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Create Unlimited Dragon Ball Z, Pokemon & AI Anime Fusions
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
                    </motion.section>

                    {/* Pricing Cards */}
                    <section className="w-full py-6">
                        <div className="mx-auto max-w-6xl space-y-12">

                            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-start">
                                {/* Free Plan */}
                                <motion.div className="relative h-full" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20 flex flex-col">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-muted">
                                                    <Gift className="h-6 w-6 text-muted-foreground" />
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
                                                    <span className="text-muted-foreground text-sm leading-relaxed">5 free fusions daily</span>
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
                                </motion.div>

                                {/* Pro Unlimited - HERO */}
                                <motion.div className="relative h-full" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[200px]">
                                        <div className="flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow-lg">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Most Popular
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-xl h-full transition-all duration-300 transform hover:scale-105 border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className="h-20 w-20 bg-primary/10 rounded-full blur-3xl absolute -top-10 -right-10"></div>
                                        </div>

                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-4 rounded-full bg-primary/20 ring-4 ring-primary/10">
                                                    <Crown className="h-8 w-8 text-primary" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-3xl font-bold text-foreground">Pro Unlimited</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-extrabold text-foreground">
                                                        {billingInterval === "monthly" ? "$9.90" : "$99.00"}
                                                    </span>
                                                    <span className="text-muted-foreground text-lg">/{billingInterval === "monthly" ? "mo" : "yr"}</span>
                                                </div>
                                                <p className="text-primary font-medium">Full Commercial License</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/20">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="font-semibold text-foreground">Fast GPU Generation</span>
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
                                                    Secure payment via Creem • Cancel anytime
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Enterprise / Bulk - Placeholder for balance */}
                                <motion.div className="relative h-full text-left" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20 flex flex-col opacity-90">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-muted">
                                                    <Sparkles className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-2xl font-bold text-foreground">Enterprise</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-3xl font-bold text-foreground">Custom</span>
                                                </div>
                                                <p className="text-muted-foreground">For high-volume needs</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-3 flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Need API access or bulk image generation? We offer custom solutions for businesses.
                                                </p>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Custom API Integration</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Bulk discounts</span>
                                                </div>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <Link
                                                    href="/contact"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground px-4 py-2 w-full h-12 text-lg font-medium transition-all duration-200 border-primary/20 text-primary hover:bg-primary/5"
                                                >
                                                    Contact Sales
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* FAQ Section */}
                            <motion.div
                                className="text-center space-y-4 pt-8 border-t"
                                initial="initial"
                                animate="animate"
                                variants={fadeInUp}
                            >
                                <h3 className="text-xl font-semibold text-foreground">Common Questions</h3>
                                <div className="mx-auto max-w-3xl text-left space-y-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="font-semibold text-foreground">What is "Fast GPU"?</p>
                                        <p className="text-sm text-muted-foreground mt-1">Pro users get access to our high-speed GPU cluster. Images generate in seconds, skipping the free queue completely.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Is the "Unlimited" really unlimited?</p>
                                        <p className="text-sm text-muted-foreground mt-1">Yes! You have a high allowance of Fast Generations. If you exceed it, you can still generate unlimited images in Relax Mode (slightly slower).</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Can I use images commercially?</p>
                                        <p className="text-sm text-muted-foreground mt-1">Yes! Pro plan includes a full commercial license. You own the images you create.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Can I cancel anytime?</p>
                                        <p className="text-sm text-muted-foreground mt-1">Absolutely. You can cancel your subscription from your dashboard at any time. No questions asked.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
