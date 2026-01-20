import { Metadata } from "next";
import PricingPage from "./client-page";

// 改为动态渲染以获取实时用户session
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PricingPage user={user} />;
}