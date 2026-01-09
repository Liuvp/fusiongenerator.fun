import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Terms of Service - Fusion Generator",
    description:
        "Read the Terms of Service for Fusion Generator. Learn about usage rights, content policies, and guidelines for creating Dragon Ball and Pokemon fusions.",
    alternates: {
        canonical: "/terms",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
