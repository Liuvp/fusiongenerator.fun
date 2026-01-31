import Link from "next/link";

export function BlogPreview() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Learn More About Fusion Generators
                </h2>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    Explore in-depth guides, AI fusion concepts, and creative inspiration
                    to help you understand how fusion generators work.
                </p>

                <Link
                    href="/blog"
                    className="inline-block px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                    Visit the Fusion Generator Blog →
                </Link>
            </div>
        </section>
    );
}
