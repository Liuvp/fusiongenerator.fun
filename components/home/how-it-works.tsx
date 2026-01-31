import Link from "next/link";

export function HowItWorks() {
    return (
        <>
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        {/* 修改1：标题更简洁直接 */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Create Character Fusions in 4 Easy Steps
                        </h2>
                        {/* 修改2：描述更短，重点突出 */}
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered fusion generator makes it easy to create unique character blends.
                            No design skills required - just follow these simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* 步骤1 - 优化文本 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Fusion Type</h3>
                            {/* 修改3：添加具体例子 */}
                            <p className="text-gray-600">
                                Select Dragon Ball, Pokémon, or Custom AI Fusion
                            </p>
                        </div>

                        {/* 步骤2 - 优化文本 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Characters</h3>
                            {/* 修改4：提供更具体的指导 */}
                            <p className="text-gray-600">
                                Pick from our library or upload your own images
                            </p>
                        </div>

                        {/* 步骤3 - 优化文本 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Adjust Settings</h3>
                            {/* 修改5：简化描述 */}
                            <p className="text-gray-600">
                                Set fusion strength for perfect blending
                            </p>
                        </div>

                        {/* 步骤4 - 优化文本 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate & Download</h3>
                            {/* 修改6：强调结果 */}
                            <p className="text-gray-600">
                                Create HD fusion image in seconds
                            </p>
                        </div>
                    </div>

                    {/* 修改7：优化按钮区域 */}
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

                    {/* 新增：快速提示区域 */}
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

            {/* SEO Explanation Text */}
            <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto max-w-3xl text-center">
                    <div className="prose prose-lg mx-auto">
                        {/* 修改8：优化小标题 */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            How Our AI Fusion Technology Works
                        </h2>
                        {/* 修改9：段落更结构化，关键词更丰富 */}
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Fusion Generator uses advanced <strong>AI image synthesis technology</strong> to analyze and combine visual elements from two characters.
                            Our system identifies key features like <strong>Goku&apos;s spiky hair</strong>, <strong>Vegeta&apos;s armor</strong>,
                            <strong>Pikachu&apos;s cheeks</strong>, and <strong>Charizard&apos;s wings</strong>, then creates a seamless blend that maintains the original art style.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Whether you&apos;re creating <strong>Dragon Ball fusions</strong> for fan art, <strong>Pokémon hybrids</strong> for game concepts,
                            or <strong>custom character mixes</strong> for creative projects, our tool delivers professional-quality results in seconds.
                        </p>
                        {/* 新增：技术优势列表 */}
                        <div className="mt-8 text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features:</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Style-consistent character blending</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>High-resolution output (HD Quality)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>No watermarks (Pro plan)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Fast processing (under 30 seconds)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
