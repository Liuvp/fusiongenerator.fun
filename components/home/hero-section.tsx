import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="w-full md:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Fusion Generator – The Ultimate AI Character Mixer
                        </h1>

                        <p className="text-lg md:text-xl text-purple-100 max-w-xl">
                            Create stunning character fusions instantly. From anime legends to monster collections, our AI blends any two images into a new masterpiece.
                        </p>

                        <div className="relative max-w-lg mt-8">
                            <Link href="/ai" className="group block cursor-pointer" aria-label="Open AI Fusion Generator to create character fusions">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl border border-purple-200">
                                    <div className="flex-1 px-4 text-gray-500 font-medium truncate">
                                        Mix: Anime + Superheroes
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition transform group-hover:scale-105">
                                        Fuse Your Characters!
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src="/hero-fusion-example.webp"
                                    alt="AI-powered fusion generator showcasing character fusion capabilities with anime and game characters"
                                    role="img"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                    priority={true}
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
