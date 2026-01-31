import Link from "next/link";

export function FAQ() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">Answers to common questions about creating character fusions with AI</p>
                </div>

                <div className="space-y-6">
                    {/* Q1 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Can I create custom character fusions with my own images?
                        </h3>
                        <div>
                            <p className="text-gray-700">
                                <strong>Absolutely!</strong> Use our <strong>AI Fusion tool</strong> to upload any two images
                                (anime, games, photos) and create unique blends. Perfect for <strong>fan art</strong>,
                                <strong> original characters</strong>, or <strong>crossover concepts</strong>. No design skills needed.
                            </p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            What&apos;s the difference between Dragon Ball Fusion and AI Fusion?
                        </h3>
                        <div>
                            <p className="text-gray-700">
                                <strong>Dragon Ball Fusion</strong> is optimized for anime characters with preset styles
                                and character libraries. <strong>AI Fusion</strong> works with any images and offers
                                more customization options like fusion strength adjustment.
                            </p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            How long does it take to generate a fusion image?
                        </h3>
                        <div>
                            <p className="text-gray-700">
                                Most fusions generate in <strong>under 30 seconds</strong>. Simple combinations like
                                <strong> Pikachu + Charizard</strong> may take 15-20 seconds. Pro users get
                                <strong> priority queue access</strong> for faster results.
                            </p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Can I use fusion images for commercial projects?
                        </h3>
                        <div>
                            <p className="text-gray-700">
                                <strong>Free tier:</strong> Personal use only (wallpapers, avatars, fan projects).
                                <br />
                                <strong>Pro plan:</strong> Includes commercial rights for all generated assets.
                                <br />
                                <strong>Important:</strong> Commercial usage is subject to applicable IP laws
                                governing Dragon Ball and Pokémon in your region.
                            </p>
                        </div>
                    </div>

                    {/* Q5 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Do I need an account to use Fusion Generator?
                        </h3>
                        <div>
                            <p className="text-gray-700">
                                <strong>No account needed to start!</strong> You can try for free daily without signing up.
                                Create an account to <strong>save your creations</strong> to your personal Fusion Gallery,
                                access generation history, and unlock Pro features.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 新增：联系方式提示 */}
                <div className="mt-12 p-6 bg-purple-50 rounded-xl border border-purple-100 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-700">
                        Check our <Link href="/blog" className="text-purple-600 hover:underline font-medium">blog</Link> for tutorials,
                        or <Link href="/contact" className="text-purple-600 hover:underline font-medium">contact us</Link> for support.
                    </p>
                </div>
            </div>
        </section>
    );
}
