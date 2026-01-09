"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { localizedPath, t, Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const L = (p: string) => localizedPath(locale, p);

  const footerLinks = [
    {
      title: t(locale, "footer.group.fusion"),
      links: [
        { label: t(locale, "nav.ai"), href: "/ai" },
        { label: t(locale, "nav.dragonBall"), href: "/dragon-ball" },
        { label: t(locale, "nav.pokemon"), href: "/pokemon" },
        { label: t(locale, "nav.gallery"), href: "/gallery" },
      ],
    },
    {
      title: t(locale, "footer.group.content"),
      links: [
        { label: t(locale, "nav.blog"), href: "/blog" },
        { label: t(locale, "footer.about"), href: "/about" },
        { label: t(locale, "footer.contact"), href: "/contact" },
      ],
    },
    {
      title: t(locale, "footer.group.legal"),
      links: [
        { label: t(locale, "footer.privacy"), href: "/privacy" },
        { label: t(locale, "footer.terms"), href: "/terms" },
      ],
    },
  ];

  if (isDashboard) {
    return (
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {t(locale, "footer.builtBy")}{" "}
              <Link
                href="https://Raphael.app"
                className="font-medium underline underline-offset-4"
              >
                Raphael Starter
              </Link>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              {t(locale, "footer.desc")}
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">{group.title}</h3>
                <nav className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={L(link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t(locale, "footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
