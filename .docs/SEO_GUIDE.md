# 搜索引擎收录指南 (SEO Guide)

## 为什么 Bing/Google 没有收录我的网站？

新网站上线后，搜索引擎并不会自动立即知道它的存在。如果没有主动提交，可能需要数周甚至数月才能被发现。

## ✅ 关键行动清单 (必须手动执行)

### 1. 提交站点地图 (Sitemap)

你的网站已经自动生成了符合规范的站点地图：`https://fusiongenerator.fun/sitemap.xml`

**行动步骤**：
1.  访问 [Bing Webmaster Tools](https://www.bing.com/webmasters) 并登录。
2.  添加你的网站 URL。
3.  验证所有权（推荐使用 DNS 验证或 HTML 文件上传）。
4.  在左侧菜单找到 **Sitemaps**。
5.  点击 **Submit sitemap**，输入 `https://fusiongenerator.fun/sitemap.xml`。

*Google Search Console 同理操作。*

### 2. 使用 URL 提交工具 (最快收录方法)

Bing Webmaster Tools 提供了一个 **URL Submission** 功能，可以立即通知 Bing 抓取你的页面。

**建议提交的 URL**：
- `https://fusiongenerator.fun/`
- `https://fusiongenerator.fun/dragon-ball`
- `https://fusiongenerator.fun/pokemon`
- `https://fusiongenerator.fun/ai`

### 3. 检查 IndexNow

Bing 支持 IndexNow 协议。虽然 Next.js 需要配置才能自动推送，但手动在 Bing 后台提交是最简单的第一步。

### 4. 社交媒体分享

在 Twitter, Reddit, Facebook 等平台分享你的网站链接。搜索引擎爬虫会通过这些外部链接发现你的网站。

## 🔍 技术检查清单 (已完成)

我们已经为你完成了以下技术优化：

- [x] **Robots.txt**: 已配置，允许所有爬虫访问。
- [x] **Sitemap.xml**: 已自动生成，包含所有核心页面。
- [x] **Metadata**: 显式添加了 `index: true, follow: true`。
- [x] **Canonical URLs**: 页面中已包含规范链接。
- [x] **性能优化**: LCP 达标，有助于提升排名。

---

**总结**：如果你还没有去 Bing Webmaster Tools 提交网站，**请立即去提交**。这是解决 "必应没收录" 的唯一有效途径。
