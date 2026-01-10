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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Fusion Generator</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our specialized fusion generators for different character universes</p>
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
                        <div className="h-48 relative overflow-hidden">
                            <Image
                                src="/dragonball-fusion-preview.webp"
                                alt="Dragon Ball character fusion example - Goku and Vegeta fusion"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Dragon Ball Fusion Maker</h3>
                            <p className="text-sm text-gray-500 mb-4">DBZ Fusion Generator - Goku Vegeta Fusion</p>
                            <p className="text-gray-700 mb-6">Create Dragon Ball Z fusions with Goku, Vegeta, Gohan, and more DBZ characters.</p>
                            <Link
                                href="/dragon-ball"
                                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all text-center"
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
                                alt="Pokemon fusion example - Pikachu and Charizard fusion"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Pokemon Infinite Fusion Tool</h3>
                            <p className="text-sm text-gray-500 mb-4">Pokémon Infinite Fusion Generator</p>
                            <p className="text-gray-700 mb-6">Pokemon fusion generator for all generations - Pikachu Charizard, Mewtwo Lucario fusions.</p>
                            <Link
                                href="/pokemon"
                                className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-center"
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
                                alt="AI fusion generator example - custom character fusion"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Universal AI Character Mixer</h3>
                            <p className="text-sm text-gray-500 mb-4">Advanced AI Image Fusion Generator</p>
                            <p className="text-gray-700 mb-6">Universal fusion generator for custom character fusions with AI technology.</p>
                            <Link
                                href="/ai"
                                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
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
