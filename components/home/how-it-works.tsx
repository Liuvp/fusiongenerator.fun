"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "./animations";

export function HowItWorks() {
    return (
        <>
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center mb-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Use Our Fusion Generator - 4 Simple Steps</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our AI fusion generator makes creation simple and fun</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {/* 步骤1 */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Generator</h3>
                            <p className="text-gray-600">Choose Dragon Ball Fusion, Pokemon Fusion, or AI Fusion</p>
                        </motion.div>

                        {/* 步骤2 */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Two Images</h3>
                            <p className="text-gray-600">Drag & drop or click to upload character images (supports custom photos)</p>
                        </motion.div>

                        {/* 步骤3 */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Configure Fusion Settings</h3>
                            <p className="text-gray-600">Pick fusion form/style, set presets and fusion strength</p>
                        </motion.div>

                        {/* 步骤4 */}
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate, Save & Share</h3>
                            <p className="text-gray-600">Click Generate, download HD, save to gallery, and share</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center gap-4 mt-12"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Link href="/ai" className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">Try Now</Link>
                        <Link href="/pricing" className="px-8 py-3 bg-white border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all">Upgrade to Pro</Link>
                    </motion.div>
                </div>
            </section>

            {/* SEO Explanation Text */}
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto max-w-3xl text-center">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="prose prose-lg mx-auto"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">How the Fusion Generator Works</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Fusion Generator uses advanced AI image synthesis to combine visual traits, colors, and proportions from two characters into a single cohesive fusion image.
                            This process analyzes the key features of both input characters—such as Goku&apos;s hair or Pikachu&apos;s lightning tail—and blends them while preserving the unique style of the original anime or game universe.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            The result is a high-quality, fan-made character design that looks like it could belong in an official episode. Whether you are looking for inspiration for your own fan art or just want to see &quot;what if&quot; scenarios, our AI tool provides endless creative possibilities.
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
