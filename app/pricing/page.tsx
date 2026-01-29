import { Metadata } from "next";
import PricingPageClient from "./client-page";

// ✅ 关键配置
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证

export const metadata: Metadata = {
  title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
  description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",

  alternates: {
    canonical: "/pricing", // ✅ 相对路径
  },

  openGraph: {
    title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
    description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",
    url: "/pricing", // ✅ 相对路径
    locale: "en_US",
    type: "website",
    siteName: "Fusion Generator",
    images: [
      {
        url: "/images/pricing-preview.png", // ✅ 确保这个图片存在
        width: 1200,
        height: 630,
        alt: "Fusion Generator Pricing Plans",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@fusiongenerator",
    creator: "@fusiongenerator",
    title: "Fusion Generator Pricing – Free & Pro AI Character Fusions",
    description: "View Fusion Generator pricing plans. Create AI character fusions for free, or upgrade for unlimited HD images, faster generation, and priority access.",
    images: ["/images/pricing-preview.png"], // ✅ 确保这个图片存在
  },

  robots: "index, follow", // ✅ 明确指定
};

export default function Page() {
  return <PricingPageClient user={null} />;
}