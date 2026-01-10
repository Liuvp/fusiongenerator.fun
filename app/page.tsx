import Script from "next/script";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { BlogPreview } from "@/components/home/blog-preview";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Fusion Generator",
    "description": "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
    "url": "https://fusiongenerator.fun",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does this fusion generator work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool uses advanced AI image generation techniques to analyze the visual features of two characters (like Goku and Vegeta) and synthesizes a new, coherent fusion character that blends their traits seamlessly."
        }
      },
      {
        "@type": "Question",
        "name": "Is Dragon Ball and Pokemon fusion free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, basic generation is free for all users with daily limits. Pro plans are available for users who need unlimited generations, higher resolution downloads, and faster processing speeds."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the generated images legally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Images are fan-generated content. For personal use (wallpapers, avatars, fan projects), they are generally fine. Commercial use depends on the specific IP laws governing Dragon Ball and Pokemon in your region."
        }
      },
      {
        "@type": "Question",
        "name": "What AI model is used for fusion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We utilize advanced AI image generation models optimized for character consistency to ensure faithful fusions of known characters."
        }
      },
      {
        "@type": "Question",
        "name": "Is Fusion Generator legal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fusion Generator creates fan-made AI art. Users should respect local copyright laws when using generated images."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, faqData])
        }}
      />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <GalleryPreview />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
        <BlogPreview />
      </div>
    </>
  );
}
