import { NextResponse } from 'next/server';

/**
 * SEO 健康检查端点
 * 用于验证 Google 爬虫能否正常访问您的网站
 * 访问 /api/seo-health 查看结果
 */
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusiongenerator.fun';

    // 检查项目
    const checks = {
        timestamp: new Date().toISOString(),
        baseUrl,
        sitemapUrl: `${baseUrl}/sitemap.xml`,
        robotsUrl: `${baseUrl}/robots.txt`,

        // 环境变量检查
        environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL_ENV: process.env.VERCEL_ENV,
        },

        // 页面列表
        pages: [
            '/',
            '/dragon-ball',
            '/pokemon',
            '/ai',
            '/gallery',
            '/blog',
            '/pricing',
            '/about',
            '/contact',
            '/privacy',
            '/terms',
        ],

        // 提示信息
        tips: [
            '1. GSC 需要 24-72 小时处理新提交的站点地图',
            '2. 确保网站没有被防火墙或安全措施阻止',
            '3. 检查 Vercel 部署日志是否有错误',
            '4. 使用 Google Search Console 的 URL 检查工具测试单个页面',
            '5. 尝试删除站点地图后重新提交',
        ],

        // Google 验证步骤
        googleVerificationSteps: [
            '步骤 1: 访问 https://search.google.com/search-console',
            '步骤 2: 选择您的资源',
            '步骤 3: 左侧菜单 -> 站点地图',
            '步骤 4: 删除旧的站点地图',
            '步骤 5: 等待 5 分钟',
            '步骤 6: 重新提交 sitemap.xml',
            '步骤 7: 使用 URL 检查工具测试单个页面',
        ],
    };

    return NextResponse.json(checks, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
