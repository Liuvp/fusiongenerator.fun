import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Fusion Generator Blog - Dragon Ball & Pokemon Fusion Guides",
    description:
        "Expert guides, tips, and tutorials for creating amazing Dragon Ball fusions, Pokemon fusions, and AI character mashups. Learn fusion techniques and best practices.",
    keywords:
        "fusion generator blog, pokemon fusion guide, dragon ball fusion tutorial, AI fusion tips, character fusion techniques, fusion design guide",
    alternates: {
        canonical: "/blog",
        languages: {
            "en-US": "/blog",
            en: "/blog",
            "ja-JP": "/ja/blog",
            ja: "/ja/blog",
            "x-default": "/blog",
        },
    },
    openGraph: {
        title: "Fusion Generator Blog - Expert Fusion Guides & Tutorials",
        description:
            "Learn how to create amazing Dragon Ball and Pokemon fusions with our expert guides and tutorials.",
        url: "https://fusiongenerator.fun/blog",
        type: "website",
        locale: "en_US",
        alternateLocale: ["ja_JP"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fusion Generator Blog",
        description: "Expert guides for creating amazing character fusions",
    },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
