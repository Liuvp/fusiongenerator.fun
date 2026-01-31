"use client";

import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, HelpCircle, Calendar, Sparkles } from "lucide-react";

export default function ContactPage() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Fusion Generator",
        "description": "The official contact page for Fusion Generator support and business inquiries.",
        "url": "https://fusiongenerator.fun/contact",
        "mainEntity": {
            "@type": "Organization",
            "name": "FusionGenerator",
            "url": "https://fusiongenerator.fun",
            "logo": "https://fusiongenerator.fun/images/fusion-generator-logo-new.svg",
            "contactPoint": [
                {
                    "@type": "ContactPoint",
                    "email": "support@fusiongenerator.fun",
                    "contactType": "customer service",
                    "availableLanguage": ["English"]
                }
            ]
        }
    };

    return (
        <>
            <Script
                id="contact-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <div className="min-h-screen bg-background">
                {/* Main Content */}
                <div className="container px-4 md:px-6 py-16">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Hero */}
                        <div className="animate-fade-in-up text-center space-y-6">
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Get in touch
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Need Help with Fusion Generator?
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Whether you have questions about AI character fusions, need technical support, or want to explore partnership opportunities — we're here to help!
                            </p>
                        </div>

                        {/* Contact Options */}
                        <div className="animate-fade-in-up animation-delay-200 grid gap-6 md:grid-cols-3">
                            <Card className="border-2 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-label="Email Support Icon" role="img">
                                        <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                                    </div>
                                    <CardTitle className="text-lg">General Support</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Need help with fusion creation, account issues, or technical problems? Contact us at <a href="mailto:support@fusiongenerator.fun" className="text-primary hover:underline">support@fusiongenerator.fun</a> for support, feedback, or business inquiries.
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 mb-4">
                                        Operated by <span className="font-semibold">Fusion Generator</span>, Liu Longquan.
                                    </p>
                                    <Button asChild className="w-full">
                                        <a href="mailto:support@fusiongenerator.fun?subject=Support%20Request">Email Support</a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Feedback & Ideas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Have suggestions for new features or fusion types? We'd love to hear them!
                                    </p>
                                    <Button asChild variant="outline" className="w-full">
                                        <a href="mailto:support@fusiongenerator.fun?subject=Product%20Feedback">Send Feedback</a>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-label="Business Icon" role="img">
                                        <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
                                    </div>
                                    <CardTitle className="text-lg">Business & Partnerships</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Interested in <strong>AI Image API</strong> access, <strong>batch generation licensing</strong>, or strategic collaboration opportunities?
                                    </p>
                                    <Button asChild variant="secondary" className="w-full">
                                        <a href="mailto:support@fusiongenerator.fun?subject=Partnership%20Inquiry">Contact Us</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <div className="animate-fade-in-up animation-delay-400 bg-muted/30 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-primary" />
                                Common Questions
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">How do I create a fusion?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Visit our <Link href="/dragon-ball" className="text-primary hover:underline">Dragon Ball</Link>, <Link href="/pokemon" className="text-primary hover:underline">Pokemon</Link>, or <Link href="/ai" className="text-primary hover:underline">AI Fusion</Link> pages and follow the simple steps to create your fusion!
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Is Fusion Generator free?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Yes! We offer 5 free fusions daily. For unlimited access and HD quality, check out our <Link href="/pricing" className="text-primary hover:underline">pricing plans</Link>.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Can I use my fusions commercially?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Pro users have commercial usage rights. Please review our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> for details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Helpful Links */}
                        <div className="animate-fade-in-up animation-delay-600 space-y-6">
                            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                                <h3 className="text-2xl font-bold mb-4">Helpful Resources</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Button asChild variant="outline">
                                        <Link href="/blog">Blog & Guides</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/gallery">Fusion Gallery</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/privacy">Privacy Policy</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/terms">Terms of Service</Link>
                                    </Button>
                                </div>
                                <p className="mt-6 text-sm text-muted-foreground">
                                    📧 We typically respond within 24–48 hours. For urgent issues, please mention "URGENT" in your subject line.
                                </p>
                            </div>
                        </div>

                        {/* Operator Information */}
                        <div className="animate-fade-in-up animation-delay-800 bg-muted/30 rounded-2xl p-8 border border-border">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Information</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p><span className="font-semibold text-foreground">Service:</span> Fusion Generator</p>
                                <p><span className="font-semibold text-foreground">Operated by:</span> Liu Longquan</p>
                                <p><span className="font-semibold text-foreground">Email:</span> <a href="mailto:support@fusiongenerator.fun" className="text-primary hover:underline">support@fusiongenerator.fun</a></p>
                                <p><span className="font-semibold text-foreground">Website:</span> <a href="https://fusiongenerator.fun" className="text-primary hover:underline">fusiongenerator.fun</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
