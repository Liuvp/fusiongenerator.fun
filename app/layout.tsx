import Header from "@/components/header";
import Script from "next/script";
import { Footer } from "@/components/footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cookies } from "next/headers";


const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "https://fusiongenerator.fun/";

export const metadata = {
  metadataBase: new URL("https://fusiongenerator.fun/"),
  title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
  description:
    "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
  // keywords removed for SEO best practices
  openGraph: {
    title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
    description:
      "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
    type: "website",
    url: "https://fusiongenerator.fun/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
    description:
      "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
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

  /* Removed Multi-language Logic */

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Header user={user} />
            {/* Breadcrumbs for existing pages (not shown on homepage) */}
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
