import { Metadata } from "next";
import TermsPage from "./client-page";

export const metadata: Metadata = {
  title: "Terms of Service – Fusion Generator",
  description: "Review the terms governing use of Fusion Generator for Dragon Ball and Pokémon fusions. Updated December 2025.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}
