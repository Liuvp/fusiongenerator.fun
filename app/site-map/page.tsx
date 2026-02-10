import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Sitemap – Fusion Generator',
    description: 'Complete sitemap of all pages on Fusion Generator - Dragon Ball fusions, Pokemon fusions, AI fusion tools, blog articles, and more.',
    robots: {
        index: true,
        follow: true,
    },
}

// 页面分组数据
const sitemapData = {
    main: [
        { url: '/', title: 'Home', description: 'Generate Dragon Ball and Pokemon character fusions with AI' },
        { url: '/dragon-ball', title: 'Dragon Ball Fusion Generator', description: 'Create DBZ character fusions like Goku & Vegeta' },
        { url: '/pokemon', title: 'Pokemon Fusion Generator', description: 'Mix Pokemon species with AI fusion technology' },
        { url: '/ai', title: 'Custom AI Fusion', description: 'Upload your own images for custom AI fusions' },
        { url: '/gallery', title: 'Fusion Gallery', description: 'Browse community-created fusion characters' },
    ],
    content: [
        { url: '/blog', title: 'Blog', description: 'Guides, tips, and news about character fusion' },
        { url: '/blog/top-dragon-ball-fusions', title: 'Top Dragon Ball Fusions', description: 'Best Dragon Ball character fusion combinations' },
        { url: '/blog/pokemon-fusion-technology', title: 'Pokemon Fusion Technology', description: 'How AI Pokemon fusion works' },
        { url: '/blog/fusion-design-tips', title: 'Fusion Design Tips', description: 'Expert tips for creating great character fusions' },
    ],
    info: [
        { url: '/pricing', title: 'Pricing', description: 'Free and premium fusion generation plans' },
        { url: '/about', title: 'About Us', description: 'Learn about Fusion Generator' },
        { url: '/contact', title: 'Contact', description: 'Get in touch with our team' },
    ],
    legal: [
        { url: '/privacy', title: 'Privacy Policy', description: 'How we protect your data' },
        { url: '/terms', title: 'Terms of Service', description: 'Terms and conditions of use' },
    ],
}

export default function SitemapPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Site Map
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore all pages on Fusion Generator - from Dragon Ball fusions to Pokemon fusions and more
                        </p>
                    </div>

                    {/* Main Pages */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-purple-500 rounded-full"></span>
                            Main Pages
                        </h2>
                        <div className="grid gap-4">
                            {sitemapData.main.map((page) => (
                                <Link
                                    key={page.url}
                                    href={page.url}
                                    className="group p-5 rounded-xl border border-border hover:border-purple-500/50 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                                        {page.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{page.description}</p>
                                    <p className="text-xs text-purple-600/70 mt-2 font-mono">
                                        {page.url === '/' ? 'https://fusiongenerator.fun/' : `https://fusiongenerator.fun${page.url}`}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Blog & Content */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></span>
                            Blog & Content
                        </h2>
                        <div className="grid gap-4">
                            {sitemapData.content.map((page) => (
                                <Link
                                    key={page.url}
                                    href={page.url}
                                    className="group p-5 rounded-xl border border-border hover:border-blue-500/50 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                        {page.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{page.description}</p>
                                    <p className="text-xs text-blue-600/70 mt-2 font-mono">
                                        https://fusiongenerator.fun{page.url}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Company Info */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></span>
                            Company Info
                        </h2>
                        <div className="grid gap-4">
                            {sitemapData.info.map((page) => (
                                <Link
                                    key={page.url}
                                    href={page.url}
                                    className="group p-5 rounded-xl border border-border hover:border-green-500/50 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600 transition-colors">
                                        {page.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{page.description}</p>
                                    <p className="text-xs text-green-600/70 mt-2 font-mono">
                                        https://fusiongenerator.fun{page.url}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Legal */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></span>
                            Legal
                        </h2>
                        <div className="grid gap-4">
                            {sitemapData.legal.map((page) => (
                                <Link
                                    key={page.url}
                                    href={page.url}
                                    className="group p-5 rounded-xl border border-border hover:border-gray-500/50 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                        {page.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{page.description}</p>
                                    <p className="text-xs text-gray-600/70 dark:text-gray-400/70 mt-2 font-mono">
                                        https://fusiongenerator.fun{page.url}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* XML Sitemap Link */}
                    <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800">
                        <h3 className="text-lg font-semibold mb-3">🤖 For Search Engines</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            XML sitemap for search engine crawlers:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/sitemap.xml"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-border hover:border-purple-500 transition-colors font-mono text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                sitemap.xml
                            </a>
                            <a
                                href="/robots.txt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-border hover:border-purple-500 transition-colors font-mono text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                robots.txt
                            </a>
                        </div>
                    </div>

                    {/* SEO Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Home',
                                        item: 'https://fusiongenerator.fun',
                                    },
                                    {
                                        '@type': 'ListItem',
                                        position: 2,
                                        name: 'Sitemap',
                                        item: 'https://fusiongenerator.fun/site-map',
                                    },
                                ],
                            }),
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
