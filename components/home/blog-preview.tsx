import Link from "next/link";

export function BlogPreview() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Creation Guide</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our blog for creation tips and inspiration</p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <li>
                        <Link href="/blog/top-dragon-ball-fusions" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            Top 10 Dragon Ball Fusions You Must Try
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog/pokemon-fusion-technology" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            How Pokémon Fusion Generator Works
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog/fusion-design-tips" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            Design Tips: How to Create Perfect Character Fusions
                        </Link>
                    </li>
                </ul>

                <div className="text-center mt-10">
                    <Link
                        href="/blog"
                        className="inline-block px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                        Browse more articles
                    </Link>
                </div>
            </div>
        </section>
    );
}
