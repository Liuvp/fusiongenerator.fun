import Link from "next/link";

export function CTA() {
    return (
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white">
            <div className="container mx-auto max-w-4xl text-center">
                {/* 优化标题 - 更直接的行动号召 */}
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Create Your First Fusion in 30 Seconds
                </h2>

                {/* 优化描述 - 强调免费和简单 */}
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of users creating amazing Dragon Ball fusions,
                    Pokémon hybrids, and custom character blends. No design experience needed.
                </p>

                {/* 优化按钮文本 */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/ai"
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        🎨 Create Free Fusion Now
                    </Link>
                    <Link
                        href="/pricing"
                        className="px-8 py-4 bg-white text-purple-700 rounded-full text-lg font-medium hover:bg-purple-50 transition-all font-semibold"
                    >
                        ⚡ Unlock Pro Features
                    </Link>
                </div>

                {/* 优化价值主张 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="text-center">
                        <div className="text-2xl font-bold">Free Daily</div>
                        <div className="text-purple-200">Generations</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">No Sign-up</div>
                        <div className="text-purple-200">Required</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">Instant</div>
                        <div className="text-purple-200">Downloads</div>
                    </div>
                </div>

                {/* 优化 Pro 用户卖点 */}
                <p className="text-sm text-purple-200 mt-8">
                    🔥 Pro users get: Unlimited generations • HD Quality • No watermarks •
                    Priority processing • Commercial usage rights
                </p>
            </div>
        </section>
    );
}
