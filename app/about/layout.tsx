import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "About Fusion Generator - Create Dragon Ball & Pokemon Fusions with AI",
    description:
        "Learn about Fusion Generator, the leading AI-powered platform for creating Dragon Ball and Pokemon character fusions. Discover our mission to bring fusion creativity to everyone.",
    alternates: {
        canonical: "/about",
        languages: {
            "en-US": "/en/about",
            en: "/en/about",
            "ja-JP": "/ja/about",
            ja: "/ja/about",
            "x-default": "/en/about",
        },
    },
    openGraph: {
        title: "About Fusion Generator - AI-Powered Character Fusion Platform",
        description:
            "Discover how Fusion Generator helps creators make amazing Dragon Ball and Pokemon fusions with advanced AI technology.",
        url: "https://fusiongenerator.fun/about",
        type: "website",
        locale: "en_US",
        alternateLocale: ["ja_JP"],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Fusion Generator",
        description: "AI-powered Dragon Ball & Pokemon fusion platform",
    },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
