import { Metadata } from "next";
import PrivacyPage from "./client-page";

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