"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Gift, Sparkles } from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function PricingPage() {
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
                            Fusion Generator Pricing: Free Dragon Ball & Pokemon Fusion Tools
                        </h1>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Start free and upgrade anytime. Choose the plan that fits your fusion creation needs.
                        </p>
                        <h2 className="text-xl font-semibold text-muted-foreground mt-2">
                            Create Unlimited Dragon Ball Z Fusions, Pokemon Character Fusions & AI Anime Fusions
                        </h2>
                    </motion.section>

                    {/* Pricing Cards */}
                    <section className="w-full py-12">
                        <div className="mx-auto max-w-6xl space-y-12">
                            <motion.div
                                className="text-center space-y-4"
                                initial="initial"
                                animate="animate"
                                variants={fadeInUp}
                            >
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                                    Choose Your Fusion Plan
                                </h2>
                                <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                                    Start with a free trial or get unlimited access to all fusion generators.
                                </p>
                            </motion.div>

                            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
                                {/* Free Plan */}
                                <motion.div className="relative" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20">
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
                                        <div className="p-6 pt-0 space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">5 free fusions daily across all tools</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Access to: Dragon Ball, Pokemon & AI Fusion</span>
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
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Share to Fusion Gallery</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Watermark on generated images</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
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

                                {/* Pro Unlimited */}
                                <motion.div className="relative" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-primary text-primary-foreground">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            Most Popular
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <Crown className="h-6 w-6 text-primary" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-2xl font-bold text-foreground">Pro Unlimited</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-bold text-foreground">$9.99</span>
                                                    <span className="text-muted-foreground text-lg">/month</span>
                                                </div>
                                                <p className="text-muted-foreground">Full access to all fusion generators</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Unlimited fusions across all tools</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">HD quality (1080p)</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">No watermark</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Priority processing</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Early access to new generators</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Link
                                                    href="/sign-up"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-12 text-lg font-medium transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground"
                                                >
                                                    Get Pro Unlimited
                                                </Link>
                                            </div>
                                            <div className="text-center pt-2">
                                                <p className="text-sm text-muted-foreground">Save 20% with annual billing • $7.99/month</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Credit Pack */}
                                <motion.div className="relative" initial="initial" animate="animate" variants={fadeInUp}>
                                    <div className="rounded-lg bg-card text-card-foreground shadow-sm h-full transition-all duration-300 hover:shadow-lg border border-border hover:border-primary/20">
                                        <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="p-3 rounded-full bg-muted">
                                                    <Sparkles className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <h3 className="tracking-tight text-2xl font-bold text-foreground">Credit Pack</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-bold text-foreground">$14.99</span>
                                                    <span className="text-muted-foreground text-lg">/500 credits</span>
                                                </div>
                                                <p className="text-muted-foreground">Pay as you go, credits never expire</p>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">1 credit = 1 standard fusion</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">2 credits = 1 HD fusion</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Works across all generators</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Credits never expire</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 rounded-full bg-muted">
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-muted-foreground text-sm leading-relaxed">Perfect for occasional use</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Link
                                                    href="/sign-up"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground px-4 py-2 w-full h-12 text-lg font-medium transition-all duration-200 border-primary/20 text-primary hover:bg-primary/5"
                                                >
                                                    Buy Credits
                                                </Link>
                                            </div>
                                            <div className="text-center pt-2">
                                                <p className="text-sm text-muted-foreground">≈ $0.03 per HD fusion • Great for occasional use</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* FAQ Section */}
                            <motion.div
                                className="text-center space-y-4 pt-8"
                                initial="initial"
                                animate="animate"
                                variants={fadeInUp}
                            >
                                <h3 className="text-xl font-semibold text-foreground">Common Questions</h3>
                                <p className="text-muted-foreground">All plans include full access to Dragon Ball Fusion, Pokemon Fusion, and AI Fusion generators. Only quality and quantity differ.</p>
                                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-500" />
                                        One price for all fusion tools
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-500" />
                                        Cancel anytime
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Check className="h-3 w-3 text-green-500" />
                                        30-day money-back guarantee
                                    </span>
                                </div>
                                <div className="mx-auto max-w-3xl text-left space-y-3 pt-4">
                                    <div>
                                        <p className="font-semibold">Can I use all fusion generators on the free plan?</p>
                                        <p className="text-muted-foreground">Yes! Free users get access to all three generators (Dragon Ball, Pokemon, AI) with 5 daily fusions total.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Do credits work for all generator types?</p>
                                        <p className="text-muted-foreground">Absolutely. 1 credit = 1 standard fusion or 2 credits = 1 HD fusion, regardless of which generator you use.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">What's the difference between Pro and Credit Pack?</p>
                                        <p className="text-muted-foreground">Pro is subscription-based with unlimited everything. Credit Pack is pay-as-you-go for occasional creators.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Can I switch between plans?</p>
                                        <p className="text-muted-foreground">Yes, you can upgrade, downgrade, or switch to credits anytime. Unused credits are always preserved.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Does the free plan include Dragon Ball Z fusion generator?</p>
                                        <p className="text-muted-foreground">Yes! Free users get access to our Dragon Ball fusion generator with 5 daily fusions included.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Can I create Pokemon infinite fusions with credits?</p>
                                        <p className="text-muted-foreground">Absolutely! Credits work across all generators including Pokemon infinite fusion and Dragon Ball fusion generator.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Is there an AI fusion generator free option?</p>
                                        <p className="text-muted-foreground">Yes, the free plan includes access to our AI fusion generator with 5 daily creations.</p>
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
