import { Metadata } from "next";
import { Message } from "@/components/form-message";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Sign In - Fusion Generator",
  description: "Log in to your Fusion Generator account to create unlimited Dragon Ball and Pokemon fusions, save your gallery, and access premium features.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/sign-in",
  },
};

export default async function Login(props: { searchParams: Promise<Message & { redirect_to?: string }> }) {
  const searchParams = await props.searchParams;
  const redirectTo = searchParams.redirect_to;
  return <ClientPage searchParams={searchParams} redirectTo={redirectTo} />;
}
