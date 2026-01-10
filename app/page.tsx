"use client";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Imports cleaned

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.7 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function getEnSeoImageName(series: 'dragon-ball' | 'pokemon', left: string, right: string) {
  const s = series === 'dragon-ball' ? 'Dragon Ball fusion' : 'Pokemon fusion'
  return `${s} ${left} and ${right} AI generated image`
}

function getEnSeoImageFile(series: 'dragon-ball' | 'pokemon', left: string, right: string) {
  return `${getEnSeoImageName(series, left, right)}.webp`
}

export default function Home() {
  const pathname = usePathname() || "/";
  // const locale removed
  // const L removed
  const router = useRouter();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Fusion Generator",
    "description": "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
    "url": "https://fusiongenerator.fun",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            structuredData,
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does this fusion generator work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The tool uses advanced AI image generation techniques to analyze the visual features of two characters (like Goku and Vegeta) and synthesizes a new, coherent fusion character that blends their traits seamlessly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Dragon Ball and Pokemon fusion free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, basic generation is free for all users with daily limits. Pro plans are available for users who need unlimited generations, higher resolution downloads, and faster processing speeds."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I use the generated images legally?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Images are fan-generated content. For personal use (wallpapers, avatars, fan projects), they are generally fine. Commercial use depends on the specific IP laws governing Dragon Ball and Pokemon in your region."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What AI model is used for fusion?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We utilize advanced AI image generation models optimized for character consistency to ensure faithful fusions of known characters."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Fusion Generator legal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Fusion Generator creates fan-made AI art. Users should respect local copyright laws when using generated images."
                  }
                }
              ]
            }
          ])
        }}
      />
      <div className="flex flex-col min-h-screen">
        {/* 英雄区域（Hero Section）- 优化关键词 */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div
                className="w-full md:w-1/2 space-y-6"
                variants={staggerContainer}
                initial={false}
                animate="animate"
              >
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                >
                  AI Fusion Generator for Dragon Ball and Pokémon Character Fusions
                </h1>

                <p
                  className="text-lg md:text-xl text-purple-100 max-w-xl"
                >
                  The world's #1 AI tool to merge any two images into Dragon Ball warriors, Pokémon hybrids, or any custom art style.
                </p>

                {/* Simulated Input for CTR Optimization */}
                {/* Optimized CTA for Conversion */}
                <motion.div
                  initial={false}
                  variants={fadeInUp}
                  className="relative max-w-lg mt-8"
                >
                  <Link href="/ai" className="group block cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl border border-purple-200">
                      <div className="flex-1 px-4 text-gray-500 font-medium truncate">
                        Try: Goku + Iron Man...
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition transform group-hover:scale-105">
                        Generate
                      </span>
                    </div>
                  </Link>
                </motion.div>



                {/* Popular Keywords Section removed */}
              </motion.div>

              <motion.div
                variants={fadeInScale}
                className="w-full md:w-1/2"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/hero-fusion-example.webp"
                      alt="AI-generated Dragon Ball and Pokemon character fusion example showing fusion generator capabilities"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 功能展示区（Features Section）- 优化为三大核心功能 */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Fusion Generator</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our specialized fusion generators for different character universes</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Dragon Ball Fusion */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/dragonball-fusion-preview.webp"
                    alt="Dragon Ball character fusion example - Goku and Vegeta fusion"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dragon Ball Fusion Maker</h3>
                  <p className="text-sm text-gray-500 mb-4">DBZ Fusion Generator - Goku Vegeta Fusion</p>
                  <p className="text-gray-700 mb-6">Create Dragon Ball Z fusions with Goku, Vegeta, Gohan, and more DBZ characters.</p>
                  <Link
                    href="/dragon-ball"
                    className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all text-center"
                  >
                    Dragon Ball Fusion Generator
                  </Link>
                </div>
              </motion.div>

              {/* Pokemon Fusion */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/pokemon-fusion-preview.webp"
                    alt="Pokemon fusion example - Pikachu and Charizard fusion"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pokemon Infinite Fusion Tool</h3>
                  <p className="text-sm text-gray-500 mb-4">Pokémon Infinite Fusion Generator</p>
                  <p className="text-gray-700 mb-6">Pokemon fusion generator for all generations - Pikachu Charizard, Mewtwo Lucario fusions.</p>
                  <Link
                    href="/pokemon"
                    className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-center"
                  >
                    Pokemon Fusion Generator
                  </Link>
                </div>
              </motion.div>

              {/* AI Fusion */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/custom-fusion-preview.webp"
                    alt="AI fusion generator example - custom character fusion"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Universal AI Character Mixer</h3>
                  <p className="text-sm text-gray-500 mb-4">Advanced AI Image Fusion Generator</p>
                  <p className="text-gray-700 mb-6">Universal fusion generator for custom character fusions with AI technology.</p>
                  <Link
                    href="/ai"
                    className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                  >
                    AI Fusion Generator
                  </Link>
                </div>
              </motion.div>
            </motion.div>


          </div>
        </section>

        {/* 融合示例展示（Gallery Preview）*/}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Gallery - Dragon Ball & Pokemon Character Fusions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our collection of amazing Dragon Ball and Pokemon character fusions. Get inspired by community creations and start your own fusion journey.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* 融合作品1 */}
              <motion.div
                variants={fadeInUp}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src="/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.webp"
                  alt={getEnSeoImageName('dragon-ball', 'Goku', 'Vegeta')}
                  width={300}
                  height={256}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm">Dragon Ball Fusion: Goku + Vegeta</p>
                </div>
              </motion.div>

              {/* 融合作品2 */}
              <motion.div
                variants={fadeInUp}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src="/gallery/Pokemon-Character-Fusion-Pikachu-Charizard-HD-Preview.webp"
                  alt={getEnSeoImageName('pokemon', 'Pikachu', 'Charizard')}
                  width={300}
                  height={256}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm">Pokemon Fusion: Pikachu + Charizard</p>
                </div>
              </motion.div>

              {/* 融合作品3 */}
              <motion.div
                variants={fadeInUp}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src="/gallery/Dragon-Ball-Character-Fusion-Gohan-Piccolo-HD-Preview.webp"
                  alt={getEnSeoImageName('dragon-ball', 'Gohan', 'Piccolo')}
                  width={300}
                  height={256}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm">Dragon Ball Fusion: Gohan + Piccolo</p>
                </div>
              </motion.div>

              {/* 融合作品4 */}
              <motion.div
                variants={fadeInUp}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src="/gallery/Pokemon-Character-Fusion-Mewtwo-Lucario-HD-Preview.webp"
                  alt={getEnSeoImageName('pokemon', 'Mewtwo', 'Lucario')}
                  width={300}
                  height={256}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-sm">Pokemon Fusion: Mewtwo + Lucario</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-10"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link
                href="/gallery"
                className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all"
              >
                View more fusions
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 使用流程（How It Works）*/}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Use Our Fusion Generator - 4 Simple Steps</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our AI fusion generator makes creation simple and fun</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* 步骤1 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Generator</h3>
                <p className="text-gray-600">Choose Dragon Ball Fusion, Pokemon Fusion, or AI Fusion</p>
              </motion.div>

              {/* 步骤2 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Two Images</h3>
                <p className="text-gray-600">Drag & drop or click to upload character images (supports custom photos)</p>
              </motion.div>

              {/* 步骤3 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configure Fusion Settings</h3>
                <p className="text-gray-600">Pick fusion form/style, set presets and fusion strength</p>
              </motion.div>

              {/* 步骤4 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generate, Save & Share</h3>
                <p className="text-gray-600">Click Generate, download HD, save to gallery, and share</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center gap-4 mt-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/ai" className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">Try Now</Link>
              <Link href="/pricing" className="px-8 py-3 bg-white border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all">Upgrade to Pro</Link>
            </motion.div>
          </div>
        </section>

        {/* 用户评价（Social Proof）*/}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Fans Love It 💫</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Over 10,000 creators use our fusion generator. See what they say.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* 评价1 */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden mr-4">
                    <Image src="/testimonials/user1.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Alex M.</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"This fusion generator is amazing! The Goku + Vegeta fusion exceeded my expectations with great attention to detail."</p>
              </motion.div>

              {/* 评价2 */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full overflow-hidden mr-4">
                    <Image src="/testimonials/user2.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah J.</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"As a Pokémon fan, I can finally create my own fusions! Pikachu + Bulbasaur is a perfect combo—my friends were impressed."</p>
              </motion.div>

              {/* 评价3 */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full overflow-hidden mr-4">
                    <Image src="/testimonials/user3.svg" alt="User avatar" width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">DragonBall_Fan99</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"The Pro version's customization options are great. I can fine-tune fusion ratios and styles to match my vision. Worth every penny!"</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <p className="text-purple-600 font-medium">This week's popular fusions: Gogeta (Goku + Vegeta), Pikario (Pikachu + Lucario), Cellhan (Cell + Gohan)</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works (SEO Explanation) */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="prose prose-lg mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How the Fusion Generator Works</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Fusion Generator uses advanced AI image synthesis to combine visual traits, colors, and proportions from two characters into a single cohesive fusion image.
                This process analyzes the key features of both input characters—such as Goku's hair or Pikachu's lightning tail—and blends them while preserving the unique style of the original anime or game universe.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The result is a high-quality, fan-made character design that looks like it could belong in an official episode. Whether you are looking for inspiration for your own fan art or just want to see "what if" scenarios, our AI tool provides endless creative possibilities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What makes Fusion Generator the best?</h3>
                <div>
                  <p className="text-gray-700">We provide deep IP customization (Dragon Ball/Pokémon) and universal AI art fusion using state-of-the-art Latent Diffusion models, ensuring high-quality, coherent character designs.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Is it free to use?</h3>
                <div>
                  <p className="text-gray-700">Yes, we offer 3 free creations daily. Upgrade to Premium for unlimited generations, Ultra HD downloads, and commercial rights.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do I need to sign up?</h3>
                <div>
                  <p className="text-gray-700">You can start fusing immediately without an account. Sign up is only required to save your creations to your personal Fusion Dex/Portfolio.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I use the images for commercial projects?</h3>
                <div>
                  <p className="text-gray-700">Free tier images are for personal use only. Pro and Enterprise plans include commercial usage rights for all generated assets. Commercial usage is subject to applicable IP laws.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 行动号召区（CTA）*/}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Start Creating with Our Free Fusion Generator
            </motion.h2>
            <motion.p
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Join 10,000+ users creating Dragon Ball fusions, Pokemon fusions, and custom character combinations.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/ai" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg">Start for Free</Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-transparent border-2 border-white rounded-full text-lg font-medium hover:bg-white/10 transition-all"
              >
                Upgrade to Pro
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-purple-200 mt-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Pro users enjoy advanced fusion options, unlimited generations, HD downloads, and more
            </motion.p>
          </div>
        </section>

        {/* 博客预览区（Blog Section）*/}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Creation Guide</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our blog for creation tips and inspiration</p>
            </motion.div>

            <motion.ul
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.li variants={fadeInUp}>
                <Link href="/blog/top-dragon-ball-fusions" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  Top 10 Dragon Ball Fusions You Must Try
                </Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/blog/pokemon-fusion-technology" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  How Pokémon Fusion Generator Works
                </Link>
              </motion.li>
              <motion.li variants={fadeInUp}>
                <Link href="/blog/fusion-design-tips" className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  Design Tips: How to Create Perfect Character Fusions
                </Link>
              </motion.li>
            </motion.ul>

            <motion.div
              className="text-center mt-10"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link
                href="/blog"
                className="inline-block px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Browse more articles
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
