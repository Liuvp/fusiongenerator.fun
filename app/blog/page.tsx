import BlogCard from '@/components/blog/BlogCard'
import { getAllPosts } from './data/posts'

// ✅ 静态生成配置 - 完全静态
export const dynamic = 'force-static'
export const revalidate = false // 完全静态，不重新验证

// ✅ SEO优化：完整的元数据
export const metadata = {
  title: 'Blog – Fusion Generator',
  description: 'Read the latest guides, tips, and news about Dragon Ball and Pokémon fusion generation. Updated regularly.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fusiongenerator.fun/blog',
    languages: {
      'en-US': 'https://fusiongenerator.fun/blog',
      'x-default': 'https://fusiongenerator.fun/blog',
    },
  },
  openGraph: {
    title: 'Fusion Generator Blog - Expert Fusion Guides & Tips 2026',
    description: 'Learn how to create amazing Dragon Ball and Pokémon character fusions with our expert guides and AI fusion techniques. Updated regularly.',
    url: 'https://fusiongenerator.fun/blog',
    siteName: 'Fusion Generator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://fusiongenerator.fun/images/blog/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fusion Generator Blog - Character Fusion Guides & Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fusion Generator Blog - Expert Fusion Guides 2026',
    description: 'Professional guides for Dragon Ball and Pokémon character fusion. Learn AI techniques and design tips.',
    images: ['https://fusiongenerator.fun/images/blog/blog-og-image.jpg'],
    creator: '@FusionGenerator',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// ✅ 结构化数据
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Fusion Generator Blog",
  "url": "https://fusiongenerator.fun/blog",
  "description": "Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions",
  "publisher": {
    "@type": "Organization",
    "name": "FusionGenerator",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fusiongenerator.fun/images/fusion-generator-logo-new.svg",
      "width": 200,
      "height": 200
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://fusiongenerator.fun/blog"
  },
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "datePublished": "2025-01-01",
  "dateModified": new Date().toISOString().split('T')[0]
}

export default function BlogPage() {
  // ✅ 静态数据 - 无API调用
  const allPosts = getAllPosts()

  // ✅ 生成项目列表结构化数据
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Latest Fusion Generator Articles",
    "numberOfItems": allPosts.length,
    "itemListElement": allPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "name": post.title,
        "url": `https://fusiongenerator.fun/blog/${post.slug}`,
        "image": `https://fusiongenerator.fun${post.coverImage}`,
        "description": post.excerpt,
        "datePublished": post.publishedDate,
        "author": {
          "@type": "Person",
          "name": post.author
        }
      }
    }))
  }

  return (
    <>
      {/* ✅ 结构化数据 - 非阻塞加载 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        defer
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        defer
      />

      <div className="min-h-screen bg-background">
        <section className="py-10 md:py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">

            {/* ✅ 首屏关键内容 - 完全静态 */}
            <header className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-2"
                role="banner" aria-label="Blog category">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open mr-2 h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 7v14" />
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
                Fusion Generator Blog
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Fusion Generator Blog
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions.
                Learn AI fusion techniques, design principles, and industry best practices.
              </p>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="text-xs md:text-sm px-3 py-1 bg-secondary/20 text-secondary rounded-full">Dragon Ball Fusion</span>
                <span className="text-xs md:text-sm px-3 py-1 bg-secondary/20 text-secondary rounded-full">Pokémon Fusion</span>
                <span className="text-xs md:text-sm px-3 py-1 bg-secondary/20 text-secondary rounded-full">AI Technology</span>
                <span className="text-xs md:text-sm px-3 py-1 bg-secondary/20 text-secondary rounded-full">Design Tips</span>
                <span className="text-xs md:text-sm px-3 py-1 bg-secondary/20 text-secondary rounded-full">2026 Guides</span>
              </div>
            </header>

            {/* ✅ 所有文章部分 */}
            <section aria-labelledby="all-posts" className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 id="all-posts" className="text-2xl md:text-3xl font-bold">
                  Latest Articles
                </h2>
                <span className="text-sm text-muted-foreground">
                  {allPosts.length} total {allPosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    priority={false} // 非首屏图片延迟加载
                  />
                ))}
              </div>
            </section>

            {/* ✅ About Section */}
            <section className="mt-16 bg-muted/30 rounded-xl p-8 text-center border">
              <h2 className="text-2xl font-bold mb-4">About Our Blog</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Welcome to the Fusion Generator blog! Here you'll find comprehensive guides on <strong>Dragon Ball fusion</strong>, <strong>Pokemon fusion</strong>, and <strong>AI image fusion</strong> technology. Whether you're a beginner or an experienced creator, our tutorials will help you master the art of character fusion.
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn fusion design tips, explore the latest AI fusion techniques, and discover how to create stunning character combinations that stand out.
              </p>
            </section>

          </div>
        </section>
      </div>
    </>
  )
}
