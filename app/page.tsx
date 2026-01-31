import Script from "next/script";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { CTA } from "@/components/home/cta";
import { BlogPreview } from "@/components/home/blog-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { FAQ } from "@/components/home/faq";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
  title: "Fusion Generator – Create Dragon Ball & Pokémon AI Fusions",
  description: "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Fusion Generator – Create Dragon Ball & Pokémon AI Fusions",
    description: "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
    url: "/",
    type: "website",
    siteName: "Fusion Generator",
    images: [
      {
        url: "/hero-fusion-example.webp",
        width: 1200,
        height: 630,
        alt: "Fusion Generator Preview - AI Character Mixer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Generator – Create Dragon Ball & Pokémon AI Fusions",
    description: "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
    images: ["/hero-fusion-example.webp"],
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Fusion Generator",
    "description": "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
    "url": "https://fusiongenerator.fun/",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fusion Generator",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fusiongenerator.fun"
      }
    ]
  };

  const siteNavigationData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": "https://fusiongenerator.fun",
    "significantLink": [
      "https://fusiongenerator.fun/dragon-ball",
      "https://fusiongenerator.fun/pokemon",
      "https://fusiongenerator.fun/ai",
      "https://fusiongenerator.fun/gallery",
      "https://fusiongenerator.fun/blog",
      "https://fusiongenerator.fun/pricing"
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            structuredData,
            softwareApplicationData,
            breadcrumbData,
            siteNavigationData
          ])
        }}
      />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <GalleryPreview />
        <HowItWorks />
        <FAQ />
        <CTA />
        <BlogPreview />
      </div>
    </>
  );
}
