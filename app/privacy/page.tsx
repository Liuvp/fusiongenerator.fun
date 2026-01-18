import { Metadata } from "next";
import PrivacyPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy – Fusion Generator",
  description: "Learn how Fusion Generator protects your personal information and respects your privacy. Updated January 2026.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}