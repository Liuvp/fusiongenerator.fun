import Header from "@/components/header";
import { Footer } from "@/components/footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "Fusion Generator - Create Dragon Ball Fusions, Pokemon Fusions & AI Character Fusions",
  description:
    "Free Fusion Generator for Dragon Ball fusions, Pokemon fusions & AI character fusions. Create Goku Vegeta fusion, Pikachu Charizard fusion instantly with our AI.",
  keywords:
    "fusion generator, dragon ball fusion, pokemon fusion, character fusion, AI fusion, anime fusion, game character fusion, infinite fusion calculator",
  openGraph: {
    title: "Fusion Generator - Create Dragon Ball & Pokemon Fusions Free",
    description:
      "Create unique Dragon Ball and Pokemon character fusions with our AI generator. Try Goku + Vegeta or Pikachu + Charizard fusions now.",
    type: "website",
    url: baseUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Generator | AI Character Fusion Tool",
    description:
      "Create unique Dragon Ball and Pokemon character fusions with our AI generator.",
  },
  alternates: {
    canonical: "/",
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value || "en";

  return (
    <html lang={localeCookie} className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Header user={user} locale={localeCookie as Locale} />
            {/* Breadcrumbs for existing pages (not shown on homepage) */}
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <Footer locale={localeCookie as Locale} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
