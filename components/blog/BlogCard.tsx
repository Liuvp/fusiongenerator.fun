'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/app/blog/data/posts'

interface BlogCardProps {
    post: BlogPost
    priority?: boolean
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
    const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <article
            itemScope
            itemType="https://schema.org/BlogPosting"
            className="group h-full flex flex-col"
        >
            <Link
                href={`/blog/${post.slug}`}
                aria-label={`Read article: ${post.title}`}
                itemProp="url"
                className="flex flex-col h-full overflow-hidden rounded-xl border bg-card hover:bg-card/80 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-100"
                prefetch={true} // ✅ 预加载
            >
                {/* ✅ 性能优化：图片加载策略 */}
                <div className="relative w-full aspect-video bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={`${post.title} - Featured image`}
                        fill
                        itemProp="image"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={priority ? 85 : 75}
                        loading={priority ? "eager" : "lazy"}
                        fetchPriority={priority ? "high" : "low"}
                        priority={priority}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* 标签徽章 */}
                    {post.featured && (
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                Featured
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                    {/* ✅ SEO优化：语义化标题 */}
                    <h3
                        className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2"
                        itemProp="headline"
                    >
                        {post.title}
                    </h3>

                    {/* ✅ 元数据行 */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span itemProp="timeRequired">{post.readTime} min read</span>
                        </div>
                        <span aria-hidden="true">•</span>
                        <time dateTime={post.publishedDate} itemProp="datePublished">
                            {formattedDate}
                        </time>
                    </div>

                    {/* ✅ 描述 */}
                    <p
                        className="text-muted-foreground line-clamp-3 flex-1 mb-4"
                        itemProp="description"
                    >
                        {post.excerpt}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary/10 text-secondary"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                                +{post.tags.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* ✅ 隐藏的结构化数据 */}
                    <meta itemProp="author" content={post.author} />
                    <meta itemProp="publisher" content="FusionGenerator" />
                    <meta itemProp="mainEntityOfPage" content={`https://fusiongenerator.fun/blog/${post.slug}`} />
                    <meta itemProp="dateModified" content={post.publishedDate} />
                </div>
            </Link>
        </article>
    )
}
