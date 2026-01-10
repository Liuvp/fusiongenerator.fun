"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "./animations";

export function Testimonials() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-12"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Fans Love It 💫</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Over 10,000 creators use our fusion generator. See what they say.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {/* 评价1 */}
                    <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden mr-4">
                                <Image src="/testimonials/user1.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Alex M.</h4>
                                <div className="flex text-yellow-400">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">&quot;This fusion generator is amazing! The Goku + Vegeta fusion exceeded my expectations with great attention to detail.&quot;</p>
                    </motion.div>

                    {/* 评价2 */}
                    <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full overflow-hidden mr-4">
                                <Image src="/testimonials/user2.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Sarah J.</h4>
                                <div className="flex text-yellow-400">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">&quot;As a Pokémon fan, I can finally create my own fusions! Pikachu + Bulbasaur is a perfect combo—my friends were impressed.&quot;</p>
                    </motion.div>

                    {/* 评价3 */}
                    <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full overflow-hidden mr-4">
                                <Image src="/testimonials/user3.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">DragonBall_Fan99</h4>
                                <div className="flex text-yellow-400">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">&quot;The Pro version&apos;s customization options are great. I can fine-tune fusion ratios and styles to match my vision. Worth every penny!&quot;</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-center mt-8"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <p className="text-purple-600 font-medium">This week&apos;s popular fusions: Gogeta (Goku + Vegeta), Pikario (Pikachu + Lucario), Cellhan (Cell + Gohan)</p>
                </motion.div>
            </div>
        </section>
    );
}
