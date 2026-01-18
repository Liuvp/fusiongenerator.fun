import { Metadata } from "next";
import AboutPage from "./client-page";

// Force static generation to ensure meta tags are in <head>
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Fusion Generator – AI Character Fusion Platform",
  description: "Learn about Fusion Generator, the AI-powered platform for creating character fusions. An innovative tool for creative fans worldwide to bring their fusion ideas to life.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Fusion Generator – AI Character Fusion Platform",
    description: "Discover how Fusion Generator helps creators make amazing character fusions with advanced AI technology.",
    url: "https://fusiongenerator.fun/about",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Fusion Generator",
    description: "AI-powered character fusion platform for creative fans worldwide",
  },
};

export default function Page() {
  return <AboutPage />;
}
