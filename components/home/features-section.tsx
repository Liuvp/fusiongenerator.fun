import Link from "next/link";
import Image from "next/image";

export function FeaturesSection() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    {/* 优化标题 */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        AI Fusion Tools: Dragon Ball, Pokémon & Custom
                    </h2>
                    {/* 优化描述 */}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create unique character fusions with our specialized AI generators.
                        Perfect for fan art, avatars, and creative projects.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Dragon Ball Fusion - 优化标题和按钮文本 */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-48 relative overflow-hidden bg-orange-50">
                            <Image
                                src="/dragonball-fusion-preview.webp"
                                alt="Dragon Ball Fusion Generator - Create Goku Vegeta Trunks Gotenks fusions"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                DBZ Fusion Generator
                            </h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Create epic Dragon Ball character fusions like Goku & Vegeta (Vegito),
                                Goten & Trunks (Gotenks), and more.
                            </p>
                            <Link
                                href="/dragon-ball"
                                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all text-center"
                                aria-label="Try DBZ Fusion Generator to create anime character fusions"
                            >
                                Try DBZ Fusion Generator
                            </Link>
                        </div>
                    </div>

                    {/* Pokemon Fusion - 优化标题和按钮文本 */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-48 relative overflow-hidden">
                            <Image
                                src="/pokemon-fusion-preview.webp"
                                alt="Pokémon Fusion AI - Create Pikachu Charizard Mewtwo Lucario hybrids"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Pokémon AI Fusion
                            </h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Mix your favorite Pokémon to create unique hybrids.
                                Pikachu + Charizard, Mewtwo + Lucario, and endless combinations.
                            </p>
                            <Link
                                href="/pokemon"
                                className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-center"
                                aria-label="Try Pokémon AI Fusion Generator to create monster hybrids"
                            >
                                Try Pokémon Fusion AI
                            </Link>
                        </div>
                    </div>

                    {/* AI Fusion - 优化标题和按钮文本 */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-48 relative overflow-hidden">
                            <Image
                                src="/custom-fusion-preview.webp"
                                alt="Custom AI Fusion Generator - Upload any two images to blend"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Custom AI Fusion
                            </h3>
                            <p className="text-sm text-gray-700 mb-6">
                                Upload any two images - anime, games, photos - and our AI will
                                create a seamless fusion. No design skills needed.
                            </p>
                            <Link
                                href="/ai"
                                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                                aria-label="Try Custom AI Fusion Generator with your own images"
                            >
                                Try Custom AI Fusion
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
