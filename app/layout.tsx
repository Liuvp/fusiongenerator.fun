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

/* =========================
   Site URL Configuration
   ========================= */
function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // Fallback to hardcoded domain if env var is missing
  if (!raw) {
    return "https://fusiongenerator.fun";
  }

  let url = raw;

  // Ensure protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Remove trailing slash
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  // Validate URL format
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`Invalid NEXT_PUBLIC_SITE_URL: ${raw}, falling back to default.`);
    return "https://fusiongenerator.fun";
  }
}

const baseUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
  description:
    "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
  openGraph: {
    title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
    description:
      "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
    type: "website",
    url: "https://fusiongenerator.fun/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Generator – Dragon Ball & Pokémon AI Fusions",
    description:
      "Generate unique Dragon Ball and Pokémon character fusions instantly with AI. High-quality, style-consistent blending. No account required.",
  },
  robots: "index, follow",
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
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
      </head>
      <body className="bg-background text-foreground">
        <a href="#main-content" className="skip-link">Skip to main content</a>
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
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
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
