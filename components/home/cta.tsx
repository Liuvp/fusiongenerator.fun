import Link from "next/link";

export function CTA() {
    return (
        <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 px-4 py-20 text-white md:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                    Create Your First Fusion in 30 Seconds
                </h2>

                <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
                    Join thousands of users creating amazing Dragon Ball fusions,
                    Pokemon hybrids, and custom character blends. No design experience needed.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link
                        href="/ai"
                        className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-lg font-medium shadow-lg transition-all hover:from-orange-600 hover:to-pink-600 hover:shadow-xl"
                    >
                        Create Free Fusion Now
                    </Link>
                    <Link
                        href="/pricing"
                        className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-purple-700 transition-all hover:bg-purple-50"
                    >
                        Unlock Pro Features
                    </Link>
                </div>

                <p className="mt-8 text-sm text-purple-200">
                    Pro: Unlimited generations, HD, no watermark, priority queue, commercial rights.
                </p>
            </div>
        </section>
    );
}
