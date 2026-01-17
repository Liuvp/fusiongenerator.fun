import { Metadata } from "next";
import PrivacyPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy – Data Protection & Transparency",
  description: "Learn how Fusion Generator protects your personal data, what we collect, and your privacy rights. Updated December 2025.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}