import Header from "@/components/header";
import Script from "next/script";
import { Footer } from "@/components/footer";
import type { Metadata, Viewport } from "next";
import Breadcrumbs from "@/components/breadcrumbs";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "https://fusiongenerator.fun/";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl.trim()),
  title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
  description:
    "Create amazing Dragon Ball and Pokémon character fusions with our AI. Mix Goku & Vegeta, Pikachu & Charizard, and more instantly – free and easy!",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Bing Webmaster validation here
    // other: { 'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE' },
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
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "v5zc7wdkn7");
          `}
        </Script>
      </body>
    </html>
  );
}
