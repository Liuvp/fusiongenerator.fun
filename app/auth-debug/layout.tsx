import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Auth Debug | Fusion Generator",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthDebugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
