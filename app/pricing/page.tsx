import { Metadata } from "next";
import PricingPage from "./client-page";

export const metadata: Metadata = {
  title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
  description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
    description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",
    url: "https://fusiongenerator.fun/pricing",
    locale: "en_US",
    type: "website",
    siteName: "Fusion Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
    description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",
  },
};

export default function Page() {
  return <PricingPage user={null} />;
}