"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "./animations";

export function FeaturesSection() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-12"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Fusion Tools</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Select a specialized generator to start creating your unique characters.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {/* Dragon Ball Fusion */}
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="h-48 relative overflow-hidden bg-orange-50">
                            <Image
                                src="/dragonball-fusion-preview.webp"
                                alt="Dragon Ball fusion AI tool – Anime Fighter Fusions"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Anime Fighter Fusions</h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Combine legendary warriors to create new super forms.
                            </p>
                            <Link
                                href="/dragon-ball"
                                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all text-center"
                                aria-label="Go to Dragon Ball Fusion Generator to create anime fighter fusions"
                            >
                                Dragon Ball Fusion Generator
                            </Link>
                        </div>
                    </motion.div>

                    {/* Pokemon Fusion */}
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <Image
                                src="/pokemon-fusion-preview.webp"
                                alt="Pokémon fusion AI tool – Monster Hybrid Maker"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Monster Hybrid Maker</h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Discover infinite combinations of your favorite pocket monsters.
                            </p>
                            <Link
                                href="/pokemon"
                                className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-center"
                                aria-label="Go to Pokemon Fusion Generator to create monster hybrid combinations"
                            >
                                Pokemon Fusion Generator
                            </Link>
                        </div>
                    </motion.div>

                    {/* AI Fusion */}
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <Image
                                src="/custom-fusion-preview.webp"
                                alt="AI fusion tool combining any two images – Custom AI Mixer"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Custom AI Mixer</h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Upload any two photos to create a unique artistic blend.
                            </p>
                            <Link
                                href="/ai"
                                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                                aria-label="Go to AI Fusion Generator to create custom character blends"
                            >
                                AI Fusion Generator
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
