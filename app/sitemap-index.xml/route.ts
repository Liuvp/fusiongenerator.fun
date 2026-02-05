import { NextResponse } from 'next/server';

/**
 * Sitemap Index - 站点地图索引
 * 用于组织网站的所有站点地图
 * Google 会优先抓取这个索引文件
 */
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusiongenerator.fun';
    const today = new Date().toISOString().split('T')[0];

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 缓存 1 天
        },
    });
}
