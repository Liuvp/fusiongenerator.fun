import { getAllPosts } from '../data/posts'

export async function GET() {
    const posts = getAllPosts()

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fusion Generator Blog</title>
    <description>Latest guides and tips for character fusion</description>
    <link>https://fusiongenerator.fun/blog</link>
    <atom:link href="https://fusiongenerator.fun/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <description>${post.excerpt}</description>
      <link>https://fusiongenerator.fun/blog/${post.slug}</link>
      <guid isPermaLink="true">https://fusiongenerator.fun/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
      <author>${post.author}</author>
    </item>
    `).join('')}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    })
}
