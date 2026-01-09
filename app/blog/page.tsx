"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getLocaleFromPath, localizedPath } from "@/lib/i18n";
import Script from "next/script";
import { BookOpen, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function BlogPage() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname) || "en";
  const L = (p: string) => localizedPath(locale, p);

  const posts = [
    {
      slug: "/blog/pokemon-infinite-fusion-guide",
      title: "Pokemon Infinite Fusion Generator: The Ultimate Guide & How to Use It",
      excerpt: "Complete guide to Gen 1–9 Pokemon fusion generators: how they work and how to use them.",
      date: "December 1, 2025",
      readTime: "9 min read"
    },
    {
      slug: "/blog/ai-image-fusion-guide",
      title: "How AI Image Fusion Generators Work: The Complete Beginner's Guide",
      excerpt: "A complete beginner's guide to AI image fusion technology, adapted for Fusion Generator users.",
      date: "December 1, 2025",
      readTime: "9 min read"
    },
    {
      slug: "/blog/pokemon-fusion-technology",
      title: "How Pokémon Fusion Generator Technology Works",
      excerpt: "Explore the AI technology behind our Pokemon fusion generator and learn how to create unique Pokemon combinations.",
      date: "November 23, 2025",
      readTime: "7 min read"
    },
    {
      slug: "/blog/fusion-design-tips",
      title: "Character Fusion Design Tips & Best Practices",
      excerpt: "Master the art of character fusion with our expert design tips for creating balanced and visually appealing fusions.",
      date: "November 23, 2025",
      readTime: "6 min read"
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What topics does the Fusion Generator blog cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our blog covers Dragon Ball fusion techniques, Pokemon fusion guides, AI image fusion technology, character design tips, and best practices for creating amazing fusion artwork."
        }
      },
      {
        "@type": "Question",
        name: "How often is the blog updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We publish new fusion guides and tutorials regularly, covering the latest techniques in Dragon Ball fusion, Pokemon fusion, and AI-powered character fusion."
        }
      },
      {
        "@type": "Question",
        name: "Are the fusion tutorials suitable for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our tutorials range from beginner-friendly guides to advanced techniques, ensuring everyone can learn how to create amazing character fusions."
        }
      }
    ]
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Fusion Generator Blog",
    description: "Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions",
    url: "https://fusiongenerator.fun/blog",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: "Fusion Generator"
      }
    }))
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Script
        id="blog-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-background">
        <section className="py-10 md:py-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            {/* Hero */}
            <motion.div
              className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-2">
                <BookOpen className="mr-2 h-4 w-4" />
                Fusion Generator Blog
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Fusion Generator Blog</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Expert guides, tips, and inspiration for creating amazing Dragon Ball and Pokemon character fusions
              </p>
            </motion.div>

            {/* Blog Posts Grid */}
            <motion.ul
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {posts.map((post) => (
                <motion.li key={post.slug} variants={fadeInUp}>
                  <Link href={L(post.slug)} className="block p-6 rounded-xl border hover:bg-muted/30 transition-colors h-full">
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* About Section */}
            <motion.div
              className="mt-16 bg-muted/30 rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">About Our Blog</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Welcome to the Fusion Generator blog! Here you'll find comprehensive guides on <strong>Dragon Ball fusion</strong>, <strong>Pokemon fusion</strong>, and <strong>AI image fusion</strong> technology. Whether you're a beginner or an experienced creator, our tutorials will help you master the art of character fusion.
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn fusion design tips, explore the latest AI fusion techniques, and discover how to create stunning character combinations that stand out.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
