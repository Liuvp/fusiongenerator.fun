import { Metadata } from "next";
import AboutPage from "./client-page";

export const metadata: Metadata = {
  title: "About Fusion Generator - Create Dragon Ball & Pokemon Fusions with AI",
  description: "Learn about Fusion Generator, the leading AI-powered platform for creating Dragon Ball and Pokemon character fusions. Discover our mission to bring fusion creativity to everyone.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Fusion Generator - AI-Powered Character Fusion Platform",
    description: "Discover how Fusion Generator helps creators make amazing Dragon Ball and Pokemon fusions with advanced AI technology.",
    url: "https://fusiongenerator.fun/about",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Fusion Generator",
    description: "AI-powered Dragon Ball & Pokemon fusion platform",
  },
};

export default function Page() {
  return <AboutPage />;
}
