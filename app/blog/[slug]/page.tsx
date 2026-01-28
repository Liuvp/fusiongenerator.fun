import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '../data/posts'
import BlogCard from '@/components/blog/BlogCard'

interface Props {
    params: Promise<{
        slug: string
    }>
}

// ✅ SSG: 静态生成所有可能的路径
export async function generateStaticParams() {
    const posts = getAllPosts()

    return posts.map((post) => ({
        slug: post.slug,
    }))
}

// ✅ SEO: 动态生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {}
    }

    const ogImage = post.coverImage // 实际项目中可以是专门生成的 OG 图片

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `https://fusiongenerator.fun/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedDate,
            authors: [post.author],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
        },
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = getRelatedPosts(post.slug)
    const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // ✅ 结构化数据：Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": [
            `https://fusiongenerator.fun${post.coverImage}`
        ],
        "datePublished": post.publishedDate,
        "dateModified": post.publishedDate,
        "author": [{
            "@type": "Person",
            "name": post.author,
            "url": "https://fusiongenerator.fun"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Fusion Generator",
            "logo": {
                "@type": "ImageObject",
                "url": "https://fusiongenerator.fun/images/fusion-generator-logo-new.svg"
            }
        },
        "description": post.excerpt
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <div className="min-h-screen bg-background pb-20">
                {/* 顶部进度条/导航占位 - 如果有全局Header这里会自动处理 */}

                <article className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                    {/* 面包屑导航 */}
                    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
                        <ol className="flex items-center space-x-2">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><span className="select-none">/</span></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><span className="select-none">/</span></li>
                            <li className="text-foreground truncate max-w-[200px] sm:max-w-md" aria-current="page">{post.title}</li>
                        </ol>
                    </nav>

                    {/* 文章头部 */}
                    <header className="mb-10 text-center space-y-6">
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <span className="sr-only">Author</span>
                                <span className="font-medium text-foreground">{post.author}</span>
                            </div>
                            <span aria-hidden="true">•</span>
                            <time dateTime={post.publishedDate}>{formattedDate}</time>
                            <span aria-hidden="true">•</span>
                            <span>{post.readTime} min read</span>
                        </div>
                    </header>

                    {/* 封面图 */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-12 bg-muted">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                        />
                    </div>

                    {/* 文章内容区 */}
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:shadow-md">
                        {/* 注意：这里的 content 目前是纯文本占位符。实际项目中，你应该使用 MDXRemote 或 dangerouslySetInnerHTML 来渲染 Markdown/HTML 内容 */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />

                        {/* 模拟一些默认内容填充，防止页面看起来太空 */}
                        {post.content === 'Full article content here...' && (
                            <div className="space-y-6 text-muted-foreground">
                                <p className="lead text-xl text-foreground">
                                    {post.excerpt}
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <h2>Understanding Fusion Mechanics</h2>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <blockquote>
                                    "The art of fusion is not just about clear boundaries, but about the seamless integration of distinct identities."
                                </blockquote>
                                <h3>Key Techniques for Better Results</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Start with high-quality source images</li>
                                    <li>Consider color palette compatibility</li>
                                    <li>Use the right prompts for AI generation</li>
                                    <li>Experiment with different styles</li>
                                </ul>
                                <p>
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                </p>
                            </div>
                        )}
                    </div>

                    <hr className="my-12 border-border" />

                    {/* 相关文章推荐 */}
                    {relatedPosts.length > 0 && (
                        <aside aria-labelledby="related-posts">
                            <h2 id="related-posts" className="text-3xl font-bold mb-8">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.map(post => (
                                    <div key={post.id} className="h-full">
                                        <BlogCard post={post} />
                                    </div>
                                ))}
                            </div>
                        </aside>
                    )}
                </article>
            </div>
        </>
    )
}
