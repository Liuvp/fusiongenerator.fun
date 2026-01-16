import { Metadata } from "next";
import { Message } from "@/components/form-message";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Sign Up - Fusion Generator",
  description: "Create your free Fusion Generator account today. Mix and match Dragon Ball heroes, Pokemon, and more to create unique AI fusions.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/sign-up",
  },
};

export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return <ClientPage searchParams={searchParams} />;
}
