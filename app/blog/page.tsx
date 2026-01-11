import { Metadata } from "next";
import BlogPage from "./client-page";

export const metadata: Metadata = {
  title: "Blog – Fusion Generator",
  description: "Read the latest guides, tips, and news about Dragon Ball and Pokémon fusion generation. Updated regularly.",
  alternates: {
    canonical: "/blog",
  },
};

export default function Page() {
  return <BlogPage />;
}
