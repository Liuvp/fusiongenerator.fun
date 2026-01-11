import { Metadata } from "next";
import ContactPage from "./client-page";

export const metadata: Metadata = {
  title: "Contact Fusion Generator – Get Help & Support",
  description: "Reach out for support, feedback, or partnership inquiries about the AI-powered Dragon Ball and Pokémon fusion platform.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}