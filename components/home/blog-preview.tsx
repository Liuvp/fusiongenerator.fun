"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "./animations";

export function BlogPreview() {
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Creation Guide</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our blog for creation tips and inspiration</p>
                </motion.div>

                <motion.ul
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <motion.li variants={fadeInUp}>
                        <Link href="/blog/top-dragon-ball-fusions" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            Top 10 Dragon Ball Fusions You Must Try
                        </Link>
                    </motion.li>
                    <motion.li variants={fadeInUp}>
                        <Link href="/blog/pokemon-fusion-technology" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            How Pokémon Fusion Generator Works
                        </Link>
                    </motion.li>
                    <motion.li variants={fadeInUp}>
                        <Link href="/blog/fusion-design-tips" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            Design Tips: How to Create Perfect Character Fusions
                        </Link>
                    </motion.li>
                </motion.ul>

                <motion.div
                    className="text-center mt-10"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Link
                        href="/blog"
                        className="inline-block px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                        Browse more articles
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
