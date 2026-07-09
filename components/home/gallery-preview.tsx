import Link from "next/link";
import Image from "next/image";

function getEnSeoImageName(left: string, right: string) {
    return `Dragon Ball fusion ${left} and ${right} AI generated image`
}

export function GalleryPreview() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Endless Fusion Gallery</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore AI-generated Dragon Ball character fusions.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    {/* 融合作品1 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
                        <Image
                            src="/gallery/Dragon-Ball-Character-Fusion-Goku-Vegeta-HD-Preview.webp"
                            alt={getEnSeoImageName('Goku', 'Vegeta')}
                            width={300}
                            height={256}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            quality={65}
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <p className="text-white p-4 text-sm">Dragon Ball Fusion: Goku + Vegeta</p>
                        </div>
                    </div>

                    {/* 融合作品2 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
                        <Image
                            src="/gallery/Dragon-Ball-Character-Fusion-Gohan-Piccolo-HD-Preview.webp"
                            alt={getEnSeoImageName('Gohan', 'Piccolo')}
                            width={300}
                            height={256}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            quality={65}
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <p className="text-white p-4 text-sm">Dragon Ball Fusion: Gohan + Piccolo</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/gallery"
                        className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all"
                    >
                        Explore All Fusions
                    </Link>
                </div>
            </div>
        </section>
    );
}
