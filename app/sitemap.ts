import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusiongenerator.fun'

    const routes = [
        { url: '', changeFrequency: 'weekly', priority: 1.0 },
        { url: '/dragon-ball', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/pokemon', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/ai', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/gallery', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/blog', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/blog/top-dragon-ball-fusions', changeFrequency: 'monthly', priority: 0.6 },
        { url: '/blog/pokemon-fusion-technology', changeFrequency: 'monthly', priority: 0.6 },
        { url: '/blog/fusion-design-tips', changeFrequency: 'monthly', priority: 0.6 },
        { url: '/pricing', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/contact', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
        { url: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route.url}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
        priority: route.priority,
    }))
}
