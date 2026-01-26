"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { BlogStructuredData } from "@/components/BlogStructuredData";

export default function BlogPage() {
    const pathname = usePathname() || "/";

    const posts = [
        {
            slug: "pokemon-infinite-fusion-guide",
            title: "Pokemon Infinite Fusion Generator: The Ultimate Guide & How to Use It",
            description: "Complete guide to Gen 1–9 Pokemon fusion generators: how they work and how to use them.",
            datePublished: "2025-12-01",
            readTime: "9 min read",
            image: "/images/blog/pokemon-infinite-fusion-guide-cover.png",
            author: "Fusion Expert"
        },
        {
            slug: "pokemon-fusion-technology",
            title: "How Pokémon Fusion Generator Technology Works",
            description: "Explore the AI technology behind our Pokemon fusion generator and learn how to create unique Pokemon combinations.",
            datePublished: "2026-01-11",
            readTime: "7 min read",
            image: "/images/blog/pokemon-fusion-technology-cover.png",
            author: "Fusion Expert"
        },
        {
            slug: "fusion-design-tips",
            title: "Character Fusion Design Tips & Best Practices",
            description: "Master the art of character fusion with our expert design tips for creating balanced and visually appealing fusions.",
            datePublished: "2026-01-10",
            readTime: "6 min read",
            image: "/images/blog/fusion-design-tips-cover.png",
            author: "Fusion Expert"
        }
    ];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://fusiongenerator.fun/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://fusiongenerator.fun/blog"
            }
        ]
    };

    return (
        <>
            <BlogStructuredData posts={posts} />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <div className="min-h-screen bg-background">
                <section className="py-10 md:py-12 px-4 md:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        {/* Hero */}
                        <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-2">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Fusion Generator Blog
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Fusion Generator Blog
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions
                            </p>
                        </div>

                        {/* Blog Posts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div key={post.slug} className="group h-full">
                                    <Link href={`/blog/${post.slug}`} className="flex flex-col h-full overflow-hidden rounded-xl border bg-card hover:bg-muted/30 transition-all hover:shadow-lg">
                                        <div className="relative w-full aspect-video bg-muted overflow-hidden">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                <span>{post.datePublished}</span>
                                                <span>•</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-3 flex-1">{post.description}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* About Section */}
                        <div className="mt-16 bg-muted/30 rounded-xl p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">About Our Blog</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                                Welcome to the Fusion Generator blog! Here you'll find comprehensive guides on <strong>Dragon Ball fusion</strong>, <strong>Pokemon fusion</strong>, and <strong>AI image fusion</strong> technology. Whether you're a beginner or an experienced creator, our tutorials will help you master the art of character fusion.
                            </p>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Learn fusion design tips, explore the latest AI fusion techniques, and discover how to create stunning character combinations that stand out.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
