import type { MetadataRoute } from "next"

const getBaseUrl = () => {
  if (process.env.BASE_URL) {
    return `https://${process.env.BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }
  return "https://fusiongenerator.fun"
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  return {
    // 空规则：让 Cloudflare 完全接管 User-agent 规则和 AI 爬虫黑名单
    rules: [],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}
