import Link from "next/link";
import Image from "next/image";

function getEnSeoImageName(series: 'dragon-ball' | 'pokemon', left: string, right: string) {
    const s = series === 'dragon-ball' ? 'Dragon Ball fusion' : 'Pokemon fusion'
    return `${s} ${left} and ${right} AI generated image`
}

export function GalleryPreview() {
    return (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fusion Gallery - Dragon Ball & Pokemon Character Fusions</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our collection of amazing Dragon Ball and Pokemon character fusions. Get inspired by community creations and start your own fusion journey.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 融合作品1 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
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
                    </div>

                    {/* 融合作品2 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
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
                    </div>

                    {/* 融合作品3 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
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
                    </div>

                    {/* 融合作品4 */}
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
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
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/gallery"
                        className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all"
                    >
                        View Dragon Ball & Pokémon Fusions
                    </Link>
                </div>
            </div>
        </section>
    );
}
