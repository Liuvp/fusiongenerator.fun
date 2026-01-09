import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Contact Us - Fusion Generator Support & Feedback",
    description:
        "Get in touch with the Fusion Generator team. We're here to help with questions about Dragon Ball fusions, Pokemon fusions, and AI character creation.",
    keywords:
        "contact fusion generator, fusion generator support, customer service, feedback, help, dragon ball fusion help, pokemon fusion support",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Fusion Generator",
        description: "Get help with Dragon Ball & Pokemon fusions. Contact our support team.",
        url: "https://fusiongenerator.fun/contact",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Contact Fusion Generator",
        description: "Get in touch with our team",
    },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
