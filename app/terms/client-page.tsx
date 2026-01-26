"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TermsPage() {
    const pathname = usePathname() || "/";
    // const locale removed
    // const L removed

    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service - Fusion Generator",
        "description": "Terms and conditions for using Fusion Generator services.",
        "url": "https://fusiongenerator.fun/terms",
        "lastReviewed": "2026-01-10",
        "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "main"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
            />
            <div className="min-h-screen bg-background">
                {/* Header removed: duplicate of breadcrumbs */}

                {/* Main Content */}
                <div className="container px-4 md:px-6 py-10 md:py-12">
                    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center space-y-6"
                        >
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                                <Scale className="mr-2 h-4 w-4" />
                                Legal Terms
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Terms of Service
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                These terms govern your use of our Fusion Generator for Dragon Ball and Pokémon character fusions. By using our service, you agree to these terms.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Last updated:</strong> 2026-01-10
                            </p>
                        </motion.div>

                        {/* Key Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-6 md:grid-cols-3"
                        >
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <CardTitle className="text-lg">What You Can Do</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Use our tools to create fan-made fusions, save favorites, and share non-commercial creations within the community.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <CardTitle className="text-lg">What You Cannot Do</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Commercialize generated content, infringe IP, impersonate brands, upload illegal or harmful content, or harass others.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">Our Commitment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Deliver a reliable creation experience, protect your privacy, moderate community content, and continuously improve quality.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Service Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-primary" />
                                    Our Service
                                </h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <p>Fusion Generator provides creation tools and preview experiences to craft fan-made character fusions with coherent rules across universes.</p>
                                    <ul className="space-y-2">
                                        <li>• <Link href="/dragon-ball" className="text-primary hover:underline">Dragon Ball Fusion</Link> tools and presets</li>
                                        <li>• <Link href="/pokemon" className="text-primary hover:underline">Pokémon Fusion</Link> tools and presets</li>
                                        <li>• <Link href="/ai" className="text-primary hover:underline">AI Custom Fusion</Link> workflow</li>
                                        <li>• <Link href="/gallery" className="text-primary hover:underline">Community Gallery</Link> and sharing</li>
                                        <li>• We are not affiliated with or endorsed by Toei Animation, Shueisha, Nintendo, Game Freak, or The Pokémon Company.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* User Responsibilities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Your Responsibilities</h3>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-green-700">Acceptable Use</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Use the service for personal, educational, or non-commercial fan works</li>
                                            <li>• Provide accurate information when creating an account</li>
                                            <li>• Respect intellectual property and community guidelines</li>
                                            <li>• Keep your account credentials secure</li>
                                            <li>• Report technical issues, abuse, or infringement</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-red-700">Prohibited Activities</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Commercializing generated content without explicit permission</li>
                                            <li>• Impersonating brands or claiming official affiliation</li>
                                            <li>• Uploading illegal, hateful, or explicit content</li>
                                            <li>• Reverse-engineering, scraping, or bulk-generating to bypass limits</li>
                                            <li>• Harassment, spam, or manipulating community rankings</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Intellectual Property */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Intellectual Property and Generated Works</h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-foreground">Your Rights to Generated Works</h4>
                                        <p>You may use fusion creations for personal, non-commercial purposes. Fan works are derivative in nature and may not be exclusively owned.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-foreground">Our Intellectual Property</h4>
                                        <p>The platform, creation logic, website design, and proprietary technology remain our IP. Do not copy, modify, or redistribute our platform or technology.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-foreground">License to Display</h4>
                                        <p>By submitting or saving works to the gallery, you grant us a non-exclusive license to display and promote them within the service.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Takedown Policy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Takedown and Rights Requests</h3>
                                <p className="text-muted-foreground">If you are a rights holder and believe content infringes your rights, contact us with the work’s URL and proof of ownership. We will review and remove eligible content.</p>
                            </div>
                        </motion.div>

                        {/* Service Availability */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                                    Service Availability and Disclaimers
                                </h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <div>
                                        <h4 className="font-semibold mb-2 text-foreground">Service Availability</h4>
                                        <p>We aim for continuous availability but may suspend services for maintenance or circumstances beyond our control.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2 text-foreground">AI-Generated Content</h4>
                                        <p>Fusion styles and outputs are generated by algorithms. Accuracy and appropriateness can vary; use discretion for public or formal contexts.</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2 text-foreground">No Warranties</h4>
                                        <p>The service is provided ‘as is’ without warranties. We do not guarantee suitability or acceptance across all contexts.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Terms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Payment and Subscription Terms</h3>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-3">Premium Subscriptions</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Monthly and annual options available</li>
                                            <li>• Automatic renewal unless cancelled</li>
                                            <li>• Access to higher limits and features</li>
                                            <li>• Advanced customization and presets</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Payment Processing</h4>
                                        <p className="text-muted-foreground mb-3">
                                            Payments are processed securely by authorized third-party payment providers, including Creem, depending on your selected plan and region. Fusion Generator does not store or process full payment card details.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Cancellation and Refunds</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Cancel anytime in account settings</li>
                                            <li>• Refunds follow our refund policy</li>
                                            <li>• No refunds for partially used periods</li>
                                            <li>• If a free trial is offered, it may convert to a paid subscription unless cancelled before the trial ends. Trial availability and duration may vary by plan.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Subscription Cancellation</h4>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            You can cancel your subscription at any time from your account dashboard.
                                        </p>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            Cancellation will stop future billing, and you will continue to have access to your subscription benefits until the end of the current billing cycle.
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Please note that we do not offer refunds for unused time or usage after the subscription has been activated.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Changes to Terms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Changes to These Terms</h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <p>We may update these terms to reflect service, legal, or business changes. Continued use after updates constitutes acceptance.</p>

                                    <ul className="space-y-2">
                                        <li>• We update the ‘Last updated’ date</li>
                                        <li>• Significant changes may be notified by email or in-app</li>
                                        <li>• You can always find the current version on this page</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Governing Law and Operator */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Governing Law and Operator</h3>

                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        Fusion Generator is operated and maintained by <span className="font-semibold text-foreground">Liu Longquan</span>, based in China.
                                    </p>
                                    <p>
                                        These terms are governed by and construed in accordance with the laws of the People's Republic of China, without regard to conflict of law principles.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Contact us if you need clarification about your rights and responsibilities or our moderation and takedown policies.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild variant="outline">
                                    <Link href="/contact">
                                        Contact Support
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/ai">
                                        Start Creating
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
