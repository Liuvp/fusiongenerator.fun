import Link from "next/link";
import Script from "next/script";

export const HOW_TO_DATA = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create AI Character Fusions",
    "step": [
        {
            "@type": "HowToStep",
            "position": 1,
            "name": "Choose Fusion Type",
            "text": "Select Dragon Ball, Pokémon, or Custom AI Fusion from the dashboard."
        },
        {
            "@type": "HowToStep",
            "position": 2,
            "name": "Select Characters",
            "text": "Pick characters from our library or upload your own reference images."
        },
        {
            "@type": "HowToStep",
            "position": 3,
            "name": "Adjust Settings",
            "text": "Set fusion strength to control how much of each character appears in the result."
        },
        {
            "@type": "HowToStep",
            "position": 4,
            "name": "Generate & Download",
            "text": "Click generate to create your HD fusion image in seconds."
        }
    ]
};

export function HowItWorks() {
    return (
        <>
            <Script
                id="howto-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_DATA) }}
            />
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Create Character Fusions in 4 Easy Steps
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered fusion generator makes it easy to create unique character blends.
                            No design skills required - just follow these simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* 步骤1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Fusion Type</h3>
                            <p className="text-gray-600">
                                Select Dragon Ball, Pokémon, or Custom AI Fusion
                            </p>
                        </div>

                        {/* 步骤2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Characters</h3>
                            <p className="text-gray-600">
                                Pick from library or upload images
                            </p>
                        </div>

                        {/* 步骤3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Adjust Settings</h3>
                            <p className="text-gray-600">
                                Set fusion strength for perfect blending
                            </p>
                        </div>

                        {/* 步骤4 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate & Download</h3>
                            <p className="text-gray-600">
                                Create HD fusion image in seconds
                            </p>
                        </div>
                    </div>

                    {/* 按钮区域 */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                        <Link
                            href="/ai"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md text-center"
                        >
                            🚀 Start Creating Now
                        </Link>
                        <Link
                            href="/dragon-ball"
                            className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all text-center"
                        >
                            🐉 Try Dragon Ball Fusion
                        </Link>
                    </div>

                    {/* 快速提示 */}
                    <div className="mt-10 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-purple-600 font-bold">💡 Pro Tip:</span>
                            <span className="text-gray-700">
                                Start with our preset characters for best results, then try custom images!
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 简化的 SEO 说明文字 */}
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">How AI Fusion Works</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Our AI analyzes key visual features from two characters and blends them into
                        a seamless fusion image in seconds.
                    </p>
                    <ul className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-left sm:text-center">
                        <li className="flex items-center gap-2 text-gray-800 font-medium">
                            <span className="text-green-500 text-xl">✓</span> Feature-aware blending
                        </li>
                        <li className="flex items-center gap-2 text-gray-800 font-medium">
                            <span className="text-green-500 text-xl">✓</span> Style consistency
                        </li>
                        <li className="flex items-center gap-2 text-gray-800 font-medium">
                            <span className="text-green-500 text-xl">✓</span> Fast AI generation
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
}
