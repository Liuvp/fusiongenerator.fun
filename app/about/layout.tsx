import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "About Fusion Generator - Create Dragon Ball Fusions with AI",
    description:
        "Learn about Fusion Generator, the leading AI-powered platform for creating Dragon Ball character fusions. Discover our mission to bring fusion creativity to everyone.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Fusion Generator - AI-Powered Character Fusion Platform",
        description:
            "Discover how Fusion Generator helps creators make amazing Dragon Ball fusions with advanced AI technology.",
        url: "https://fusiongenerator.fun/about",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Fusion Generator",
        description: "AI-powered Dragon Ball fusion platform",
    },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
