import { MetadataRoute } from 'next'
import { getLastModifiedDate } from '@/lib/sitemap-helper'

// 重要：告诉 Next.js 每天重新生成一次 sitemap
// 这样 Google 爬虫可以更及时地发现更新
export const revalidate = 86400 // 24 小时 (单位: 秒)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusiongenerator.fun'

    const routes = [
        // 核心页面 - 映射到对应的物理文件或目录
        { url: '', file: 'app/page.tsx', changeFrequency: 'weekly', priority: 1.0 },
        { url: '/dragon-ball', file: 'app/dragon-ball/page.tsx', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/pokemon', file: 'app/pokemon/page.tsx', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/ai', file: 'app/ai/page.tsx', changeFrequency: 'weekly', priority: 0.8 },
        { url: '/gallery', file: 'app/gallery/page.tsx', changeFrequency: 'weekly', priority: 0.8 },

        // 博客首页
        { url: '/blog', file: 'app/blog/page.tsx', changeFrequency: 'weekly', priority: 0.8 },

        // 具体博客文章
        { url: '/blog/top-dragon-ball-fusions', file: 'app/blog/top-dragon-ball-fusions/page.tsx', changeFrequency: 'monthly', priority: 0.6 },
        { url: '/blog/pokemon-fusion-technology', file: 'app/blog/pokemon-fusion-technology/page.tsx', changeFrequency: 'monthly', priority: 0.6 },
        { url: '/blog/fusion-design-tips', file: 'app/blog/fusion-design-tips/page.tsx', changeFrequency: 'monthly', priority: 0.6 },

        // 静态页面
        { url: '/pricing', file: 'app/pricing/page.tsx', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/about', file: 'app/about/page.tsx', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/contact', file: 'app/contact/page.tsx', changeFrequency: 'monthly', priority: 0.7 },
        { url: '/site-map', file: 'app/site-map/page.tsx', changeFrequency: 'monthly', priority: 0.5 },
        { url: '/privacy', file: 'app/privacy/page.tsx', changeFrequency: 'yearly', priority: 0.3 },
        { url: '/terms', file: 'app/terms/page.tsx', changeFrequency: 'yearly', priority: 0.3 },
    ]

    try {
        // 并行获取所有文件的日期
        const sitemapEntries = await Promise.all(routes.map(async (route) => {
            const lastModified = await getLastModifiedDate(route.file);
            return {
                url: `${baseUrl}${route.url}`,
                lastModified,
                changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
                priority: route.priority,
            };
        }));

        return sitemapEntries;
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // 如果失败，至少返回基础页面
        return routes.map(route => ({
            url: `${baseUrl}${route.url}`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
            priority: route.priority,
        }));
    }
}
