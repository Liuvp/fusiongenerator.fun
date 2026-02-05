#!/usr/bin/env node

/**
 * 站点地图验证脚本
 * 用于验证 sitemap.xml 能否被正确抓取
 */

const https = require('https');

const BASE_URL = 'https://fusiongenerator.fun';

const urls = [
    `${BASE_URL}/robots.txt`,
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/api/seo-health`,
];

console.log('🔍 开始验证站点地图配置...\n');

async function testUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    url,
                    status: res.statusCode,
                    contentType: res.headers['content-type'],
                    contentLength: data.length,
                    preview: data.substring(0, 200),
                });
            });
        }).on('error', (err) => {
            reject({ url, error: err.message });
        });
    });
}

async function runTests() {
    for (const url of urls) {
        try {
            const result = await testUrl(url);
            console.log(`✅ ${result.url}`);
            console.log(`   状态码: ${result.status}`);
            console.log(`   类型: ${result.contentType}`);
            console.log(`   大小: ${result.contentLength} 字节`);
            console.log(`   预览: ${result.preview}...`);
            console.log('');
        } catch (error) {
            console.log(`❌ ${error.url}`);
            console.log(`   错误: ${error.error}`);
            console.log('');
        }
    }

    console.log('\n📋 Google Search Console 操作步骤：');
    console.log('1. 访问 https://search.google.com/search-console');
    console.log('2. 选择您的资源 (fusiongenerator.fun)');
    console.log('3. 左侧菜单 -> 站点地图');
    console.log('4. 删除现有的 sitemap.xml');
    console.log('5. 等待 5 分钟后重新提交');
    console.log('6. 使用 "网址检查" 工具测试单个页面');
    console.log('\n💡 如果问题持续，可能需要：');
    console.log('- 检查 Vercel 防火墙设置');
    console.log('- 验证域名 DNS 配置');
    console.log('- 等待 24-72 小时让 Google 重新抓取');
}

runTests().catch(console.error);
