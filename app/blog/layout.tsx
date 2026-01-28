import { ReactNode } from 'react'
import Script from 'next/script'

export default function BlogLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* ✅ 预加载关键资源 */}


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
