import { Metadata } from "next";
import ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Profile | Fusion Generator",
  description: "View your fusion creation history and manage your saved character fusions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ClientPage />;
}
