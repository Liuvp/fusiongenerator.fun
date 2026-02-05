#!/usr/bin/env node

/**
 * Sitemap Index 验证脚本
 * 用于验证新创建的 sitemap-index.xml
 */

const https = require('https');

const BASE_URL = 'https://fusiongenerator.fun';

const urls = [
    `${BASE_URL}/sitemap-index.xml`,
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/robots.txt`,
];

console.log('🔍 验证 Sitemap Index 配置...\n');

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
                    preview: data.substring(0, 300).replace(/\n/g, ' '),
                });
            });
        }).on('error', (err) => {
            reject({ url, error: err.message });
        });
    });
}

async function runTests() {
    console.log('📋 测试结果：\n');

    for (const url of urls) {
        try {
            const result = await testUrl(url);
            console.log(`✅ ${result.url}`);
            console.log(`   状态: ${result.status}`);
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

    console.log('\n✨ Sitemap Index 的优势：');
    console.log('1. Google 优先抓取索引文件');
    console.log('2. 便于组织大型网站的多个站点地图');
    console.log('3. 可以为不同类型的内容创建独立的站点地图');
    console.log('4. 提高抓取效率');

    console.log('\n📋 Google Search Console 提交步骤：');
    console.log('1. 访问 https://search.google.com/search-console');
    console.log('2. 左侧菜单 -> 站点地图');
    console.log('3. 提交: sitemap-index.xml (推荐)');
    console.log('4. 也可以保留 sitemap.xml 作为备用');
}

runTests().catch(console.error);
