import Link from "next/link";
import Script from "next/script";

export function DBHowToUse() {
    const howToJsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use Dragon Ball Fusion Generator",
        "description": "Create your own Dragon Ball character fusions in 3 simple steps using our AI-powered roster selection.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Select 2 Characters",
                "text": "Choose any two legendary fighters from our character grid, such as Goku, Vegeta, or Frieza.",
                "url": "https://fusiongenerator.fun/dragon-ball#fusion-studio"
            },
            {
                "@type": "HowToStep",
                "name": "Click Fusion Button",
                "text": "Press the 'FUU-SION-HA!' button to start the AI generation process instantly.",
                "url": "https://fusiongenerator.fun/dragon-ball#fusion-studio"
            },
            {
                "@type": "HowToStep",
                "name": "Download Artwork",
                "text": "Save your high-resolution fusion image to your device or share it on social media.",
                "url": "https://fusiongenerator.fun/dragon-ball#fusion-studio"
            }
        ]
    };

    return (
        <article className="space-y-6">

            {/* JSON-LD for HowTo */}
            <Script
                id="dragon-ball-howto-json-ld"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
            />

            {/* Header */}
            <header className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4">
                    How to Create Dragon Ball Fusions
                </h2>
                <p className="text-muted-foreground text-base pl-4">
                    No uploads or design skills required - just pick your fighters and fuse!
                </p>
            </header>

            {/* Steps Section */}
            <section className="grid gap-6 md:grid-cols-3 pt-4">
                <div className="group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 mb-4">
                        <span className="text-2xl font-black text-white">1</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Select Fighters</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Choose two characters from our roster grid. Try combining Saiyans, villains, or icons like Piccolo.
                    </p>
                </div>

                <div className="group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
                        <span className="text-2xl font-black text-white">2</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">FUU-SION-HA!</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Click the fusion button. Our AI will channel Ki to blend their features into a unique new warrior.
                    </p>
                </div>

                <div className="group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200 mb-4">
                        <span className="text-2xl font-black text-white">3</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Save Result</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Download your HD fusion artwork instantly. Share it with friends or on social media!
                    </p>
                </div>
            </section>

            {/* Roster-based Tips */}
            <section className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <h3 className="font-bold text-orange-900">Fusion Tips & Quota</h3>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 text-sm text-orange-800/80">
                    <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Free trial available for everyone (No login needed!)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Register to get starter credits for more fusions
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Character order (P1 vs P2) can slightly vary the result
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Try mixing heroes and villains for unique results
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Generated images are HD and ready for download
                    </li>
                </ul>
            </section>

            {/* CTA */}
            <section className="text-center pt-4 pb-2 space-y-4">
                <div className="inline-flex flex-col items-center">
                    <p className="text-gray-600 mb-3">Ready to witness the ultimate warrior?</p>
                    <a
                        href="#fusion-studio"
                        className="group relative px-8 py-3 bg-orange-500 text-white font-bold rounded-full overflow-hidden shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-orange-300"
                        aria-label="Jump to the fusion studio at the top"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Fusing Now
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </a>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                    <Link
                        href="/gallery"
                        className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                    >
                        Gallery
                    </Link>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <Link
                        href="/blog"
                        className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                    >
                        Latest News
                    </Link>
                </div>
            </section>

        </article>
    );
}
