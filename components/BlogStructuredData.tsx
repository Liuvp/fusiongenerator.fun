"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BlogPost {
    title: string;
    slug: string;
    datePublished: string;
    description: string;
    image?: string;
    author?: string;
}

interface BlogStructuredDataProps {
    posts: BlogPost[];
}

export const BlogStructuredData: React.FC<BlogStructuredDataProps> = ({ posts }) => {
    const pathname = usePathname();
    const blogUrl = `https://fusiongenerator.fun${pathname}`;

    const jsonLd = useMemo(() => {
        const blogPosting = posts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.datePublished,
            "author": { "@type": "Person", "name": post.author || "Fusion Expert" },
            "image": post.image ? `https://fusiongenerator.fun${post.image}` : "https://fusiongenerator.fun/images/fusion-generator-logo-new.svg",
            "url": `https://fusiongenerator.fun/blog/${post.slug}`,
            "description": post.description,
        }));

        const itemList = posts.map((post, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://fusiongenerator.fun/blog/${post.slug}`,
        }));

        return [
            {
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "Fusion Generator Blog",
                "url": blogUrl,
                "description": "Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions",
                "publisher": {
                    "@type": "Organization",
                    "name": "FusionGenerator",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://fusiongenerator.fun/images/fusion-generator-logo-new.svg"
                    }
                },
                "blogPost": blogPosting,
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Fusion Generator Latest Articles",
                "numberOfItems": posts.length,
                "itemListElement": itemList,
            }
        ];
    }, [posts, blogUrl]);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};
