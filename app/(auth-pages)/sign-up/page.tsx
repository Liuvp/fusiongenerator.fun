import { Metadata } from "next";
import { Message } from "@/components/form-message";
import ClientPage from "./client-page";

export type AuthSearchParams = Message & {
  redirect_to?: string;
  source?: string;
  reason?: string;
};

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
  searchParams: Promise<AuthSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const redirectTo = searchParams.redirect_to;
  return <ClientPage searchParams={searchParams} redirectTo={redirectTo} />;
}
