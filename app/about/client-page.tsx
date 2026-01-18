"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart, Users, Globe, Zap, Palette } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Unleashing Creative Fusion Power
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            About Fusion Generator<br />
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">An AI Character Fusion Tool for Creative Fans Worldwide</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            <Link href="/" className="text-foreground font-semibold hover:text-primary transition-colors">Fusion Generator</Link> is the ultimate platform for creating amazing Dragon Ball fusions, Pokemon fusions, and AI-powered character mashups. We make fusion creativity accessible, fun, and limitless.
                        </p>
                    </motion.div>

                    {/* Mission Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <div className="rounded-lg bg-card text-card-foreground shadow-sm border-2 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Our Mission</h3>
                            </div>
                            <div className="p-6 pt-0">
                                <p className="text-muted-foreground">
                                    To empower fans and creators worldwide to bring their fusion fantasies to life. Whether it's Goku + Vegeta or Pikachu + Charizard, we make it possible with cutting-edge AI technology.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-card text-card-foreground shadow-sm border-2 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Our Community</h3>
                            </div>
                            <div className="p-6 pt-0">
                                <p className="text-muted-foreground">
                                    Join thousands of Dragon Ball and Pokemon fans creating, sharing, and celebrating amazing fusion art. Our gallery showcases the best community creations from around the world.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-card text-card-foreground shadow-sm border-2 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Global Impact</h3>
                            </div>
                            <div className="p-6 pt-0">
                                <p className="text-muted-foreground">
                                    From casual fans to professional artists, our platform serves creators worldwide who want to explore the endless possibilities of character fusion.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Our Story Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="prose prose-lg max-w-none"
                    >
                        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-primary" />
                                Our Story
                            </h2>
                            <div className="space-y-6 text-muted-foreground">
                                <p>
                                    Fusion Generator was born from a simple question: "What if we could fuse any two characters together?" As lifelong fans of Dragon Ball and Pokemon, we've always been fascinated by the concept of fusion - the idea that two characters could combine to create something entirely new and powerful.
                                </p>
                                <p>
                                    Traditional fusion art required hours of manual work and artistic skill. We wanted to democratize this creative process, making it accessible to everyone regardless of their artistic ability. Using advanced AI technology, we've built a platform that can generate fusion characters in seconds while maintaining quality and creativity.
                                </p>
                                <p>
                                    Today, Fusion Generator supports Dragon Ball fusions (from Goku and Vegeta to Frieza and Cell), Pokemon fusions (covering all generations 1-9), and even custom AI-powered character fusions. Whether you're creating for fun, inspiration, or professional projects, we're here to help you bring your fusion visions to life.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">What Makes Us Different</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                The features that set Fusion Generator apart
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">AI-Powered Technology</h3>
                                    <p className="text-muted-foreground">
                                        Our advanced AI understands character features, styles, and attributes to create authentic-looking fusions that respect the source material.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Palette className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Multiple Fusion Types</h3>
                                    <p className="text-muted-foreground">
                                        Create Dragon Ball Z fusions, Pokemon infinite fusions, or custom AI character mashups - all in one platform.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Community Gallery</h3>
                                    <p className="text-muted-foreground">
                                        Share your creations with thousands of fans and get inspired by the amazing fusions created by our community.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Heart className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Free to Start</h3>
                                    <p className="text-muted-foreground">
                                        Everyone gets 5 free fusions daily. No credit card required. Upgrade anytime for unlimited creations and HD quality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Service Information Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border border-border">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Globe className="h-6 w-6 text-primary" />
                                Service Information
                            </h2>
                            <div className="space-y-6 text-muted-foreground">
                                <p>
                                    Fusion Generator is an AI-powered image generation web application that allows users to create character fusion images through a simple online interface.
                                </p>
                                <p>
                                    The service operates as an independent project and provides access to image generation features based on user account status and subscription plans.
                                </p>

                                <div className="grid gap-4 md:grid-cols-2 mt-8 pt-6 border-t border-border">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">Founder</h3>
                                        <p>Liu Longquan</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">Business Type</h3>
                                        <p>Independent Developer</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">Location</h3>
                                        <p>Asia</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">Contact Email</h3>
                                        <p>
                                            <Link
                                                href="mailto:support@fusiongenerator.fun"
                                                className="text-primary hover:underline"
                                            >
                                                support@fusiongenerator.fun
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border">
                                    <h3 className="font-semibold text-foreground mb-2">AI Usage Disclosure</h3>
                                    <p>
                                        Fusion Generator uses third-party AI models to generate images. The platform does not train its own AI models and does not claim ownership of the underlying AI technology.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* CTA Section */}
                    <div
                        className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-8 md:p-12 border border-purple-200 dark:border-purple-800"
                    >
                        <h2 className="text-2xl font-bold mb-4">Ready to Create Your First Fusion?</h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Join thousands of creators making amazing Dragon Ball and Pokemon fusions. Start for free today - no signup required!
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="/dragon-ball"
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                Create Dragon Ball Fusion
                            </Link>
                            <Link
                                href="/pokemon"
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Create Pokemon Fusion
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
