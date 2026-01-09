import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Pricing - Fusion Generator | Free Dragon Ball & Pokemon Fusion Plans",
    description:
        "Choose your Fusion Generator plan: Free forever with 5 daily fusions, Pro Unlimited at $9.99/month, or pay-as-you-go credits. Create unlimited Dragon Ball and Pokemon fusions.",
    keywords:
        "fusion generator pricing, pokemon fusion price, dragon ball fusion cost, AI fusion plans, free fusion generator, unlimited fusion subscription",
    alternates: {
        canonical: "/pricing",
        languages: {
            "en-US": "/pricing",
            en: "/pricing",
            "ja-JP": "/ja/pricing",
            ja: "/ja/pricing",
            "x-default": "/pricing",
        },
    },
    openGraph: {
        title: "Fusion Generator Pricing - Free & Premium Plans",
        description:
            "Start free with 5 daily fusions or upgrade to unlimited. Create Dragon Ball Z fusions, Pokemon fusions & AI character fusions.",
        url: "https://fusiongenerator.fun/pricing",
        type: "website",
        locale: "en_US",
        alternateLocale: ["ja_JP"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fusion Generator Pricing",
        description: "Free & Premium plans for unlimited character fusions",
    },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
