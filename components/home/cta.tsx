import Link from "next/link";

export function CTA() {
    return (
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Start Creating with Our Free Fusion Generator
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                    Join 10,000+ users creating Dragon Ball fusions, Pokemon fusions, and custom character combinations.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/ai" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg">Start for Free</Link>
                    <Link
                        href="/pricing"
                        className="px-8 py-4 bg-transparent border-2 border-white rounded-full text-lg font-medium hover:bg-white/10 transition-all"
                    >
                        Upgrade to Pro
                    </Link>
                </div>

                <p className="text-sm text-purple-200 mt-6">
                    Pro users enjoy precise fusion control, 4K Ultra HD downloads without watermarks, and unlimited priority generations.
                </p>
            </div>
        </section>
    );
}
