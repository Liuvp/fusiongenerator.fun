"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PrivacyPage() {
    const pathname = usePathname() || "/";
    // const locale removed
    // const L removed

    const privacySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy - Fusion Generator",
        "description": "Fusion Generator's policy on data collection, user privacy, and information security.",
        "url": "https://fusiongenerator.fun/privacy",
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
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
                                Privacy Policy
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                We are committed to protecting your privacy and being transparent about how we collect,
                                use, and protect your personal information when you use Fusion Generator.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Last updated:</strong> 2026-01-10
                            </p>
                        </motion.div>

                        {/* Privacy Principles */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-6 md:grid-cols-3"
                        >
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Eye className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Transparency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        We clearly explain what data we collect and how we use it to provide you with the best fusion experience.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Lock className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Security</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        Your personal information is protected with industry‑standard security measures and encryption.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <UserCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        You have full control over your data, including the ability to access, update, or delete your information.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Information We Collect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Database className="h-6 w-6 text-primary" />
                                    Information We Collect
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold mb-3">Information You Provide</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• <strong>Account Information:</strong> Email address and password when you create an account</li>
                                            <li>• <strong>Fusion Creations:</strong> Dragon Ball fusions, Pokemon fusions, and AI fusions you generate</li>
                                            <li>• <strong>Gallery Uploads:</strong> Fusions you choose to share in the public gallery</li>
                                            <li>• <strong>Payment Information:</strong> Billing details for Pro subscriptions, processed securely by our authorized third-party payment providers</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3">Information We Collect Automatically</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• <strong>Usage Data:</strong> How you interact with our service</li>
                                            <li>• <strong>Device Information:</strong> Browser type, operating system, IP address</li>
                                            <li>• <strong>Cookies:</strong> To improve your experience and remember your preferences. You can control or disable cookies through your browser settings.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* How We Use Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                                    How We Use Information
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-green-700">Service Provision</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Generate Dragon Ball, Pokemon, and AI character fusions</li>
                                            <li>• Save your fusion creations to your account</li>
                                            <li>• Display your fusions in the public gallery (if you choose)</li>
                                            <li>• Process payments for Pro subscriptions and credit packs</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 text-blue-700">Service Improvement</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Analyze service usage to improve functionality</li>
                                            <li>• Develop new features and capabilities</li>
                                            <li>• Ensure service security and prevent fraud</li>
                                            <li>• Send service‑related communications</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Data Sharing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                    Information Sharing
                                </h2>
                                <p className="text-muted-foreground">
                                    <strong>We do not sell your personal information.</strong> We may share your information only in these limited circumstances:
                                </p>
                                <ul className="space-y-2">
                                    <li>• <strong>Service Providers:</strong> Trusted third parties who help us operate the service (payment processing, hosting, analytics)</li>
                                    <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                    <li>• <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                                    <li>• <strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Your Rights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6">Acceptable Use and Prohibited Activities</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-green-700">Acceptable Use</h4>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• Use the service for personal, educational, or non‑commercial fan works</li>
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
                                            <li>• Reverse‑engineering, scraping, or bulk‑generating to bypass limits</li>
                                            <li>• Harassment, spam, or manipulating community rankings</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Data Security */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6">Data Security and Retention</h2>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Security Measures</h4>
                                            <ul className="space-y-1">
                                                <li>• Encryption in transit and at rest</li>
                                                <li>• Regular security audits</li>
                                                <li>• Access controls and monitoring</li>
                                                <li>• Secure data centers</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-foreground">Data Retention</h4>
                                            <ul className="space-y-1">
                                                <li>• Account data: Until account deletion</li>
                                                <li>• Fusion creations: Until you delete them</li>
                                                <li>• Gallery uploads: Until you remove them</li>
                                                <li>• Usage logs: Up to 2 years</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Data Controller */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            className="space-y-8"
                        >
                            <div className="bg-muted/30 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6">Data Controller</h2>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        Fusion Generator is operated and maintained by <span className="font-semibold text-foreground">Liu Longquan</span>.
                                    </p>
                                    <p>
                                        If you have any questions about this Privacy Policy or how your data is handled, please contact us at <a href="mailto:support@fusiongenerator.fun" className="text-primary hover:underline">support@fusiongenerator.fun</a>.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                Contact us if you need clarification about how we handle your data or any privacy concerns.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild variant="outline">
                                    <Link href="/contact">Contact Support</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/">Back to Home</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
