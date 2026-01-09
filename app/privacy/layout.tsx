import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Privacy Policy - Fusion Generator",
    description:
        "Fusion Generator Privacy Policy. Learn how we protect your data when you create Dragon Ball fusions, Pokemon fusions, and AI character mashups.",
    alternates: {
        canonical: "/privacy",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
