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
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // 添加 sitemap-index.xml 作为主索引，sitemap.xml 作为备用
    // Google 会优先抓取索引文件
    sitemap: [
      `${baseUrl}/sitemap-index.xml`,
      `${baseUrl}/sitemap.xml`,
    ],
  }
}
