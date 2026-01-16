import type { MetadataRoute } from "next"

const getBaseUrl = () => {
  if (process.env.BASE_URL) {
    return `https://${process.env.BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }
  return "https://fusiongenerator.fun/"
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}
