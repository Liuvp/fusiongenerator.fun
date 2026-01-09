"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { localizedPath, t, Locale } from "@/lib/i18n";

interface HeaderProps {
  user: any;
  locale: Locale;
}

interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export default function Header({ user, locale }: HeaderProps) {
  const pathname = usePathname() || "/";
  const isDashboard = pathname?.startsWith("/dashboard");
  const L = (p: string) => localizedPath(locale, p);

  // Main navigation items for Fusion Generator
  const mainNavItems: NavItem[] = [
    { label: t(locale, "nav.home"), href: L("/") },
    { label: t(locale, "nav.dragonBall"), href: L("/dragon-ball") },
    { label: t(locale, "nav.pokemon"), href: L("/pokemon") },
    { label: t(locale, "nav.ai"), href: L("/ai") },
    { label: t(locale, "nav.gallery"), href: L("/gallery") },
    { label: t(locale, "nav.blog"), href: L("/blog") },
    { label: t(locale, "nav.pricing"), href: L("/pricing"), isButton: true },
  ];

  // Dashboard items - empty array as we don't want navigation items in dashboard
  const dashboardItems: NavItem[] = [];

  // Choose which navigation items to show
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.isButton
                ? "px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-white/20"
                : "text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isDashboard && (
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.email}
                </span>
              )}
              {!isDashboard && (
                <>
                  <Button asChild size="sm" variant="default">
                    <Link href={L("/profile")}>{t(locale, "nav.profile")}</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={L("/dashboard")}>{t(locale, "nav.dashboard")}</Link>
                  </Button>
                </>
              )}
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  {t(locale, "nav.signout")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={L("/sign-in")}>{t(locale, "nav.signin")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={L("/sign-up")}>{t(locale, "nav.signup")}</Link>
              </Button>
            </div>
          )}
          <MobileNav items={navItems} user={user} isDashboard={isDashboard} locale={locale} />
        </div>
      </div>
    </header>
  );
}

