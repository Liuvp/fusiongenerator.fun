import { Metadata } from 'next'
import { ReactNode } from 'react'
import Script from 'next/script'

export const metadata: Metadata = {
    title: {
        default: 'Fusion Generator Blog',
        template: '%s | Fusion Generator Blog'
    },
    description: 'Expert guides and tips for Dragon Ball and Pokémon character fusion generation.',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://fusiongenerator.fun/blog',
        siteName: 'Fusion Generator Blog',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@FusionGenerator',
        creator: '@FusionGenerator',
    },
    alternates: {
        canonical: 'https://fusiongenerator.fun/blog',
    },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* ✅ 预加载关键资源 */}
            <link
                rel="preload"
                href="/images/blog/blog-og-image.jpg"
                as="image"
                type="image/jpeg"
                fetchPriority="high"
            />

            {/* ✅ 博客特定的分析脚本 */}
            <Script
                strategy="afterInteractive"
                id="blog-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
            window.blogPageView = () => {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                  page_title: 'Blog Page',
                  page_location: window.location.href,
                  page_path: '/blog'
                });
              }
            };
            // Track blog page view
            if (document.readyState === 'complete') {
              window.blogPageView();
            } else {
              window.addEventListener('load', window.blogPageView);
            }
          `
                }}
            />

            {children}
        </>
    )
}
