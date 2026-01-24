"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
// removed duplicate line
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

const AUTH_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/auth/callback"];

export default function Header({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState(initialUser);
  const pathname = usePathname() || "/";
  const isDashboard = pathname?.startsWith("/dashboard");
  const supabase = createClient();

  // Sync auth state on client side
  useEffect(() => {
    // Correct local state if server prop was stale
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !user) {
        setUser(session.user);
      } else if (!session?.user && user) {
        setUser(null);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, user]);

  // Main navigation items for Fusion Generator
  const mainNavItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Dragon Ball", href: "/dragon-ball" },
    { label: "Pokemon", href: "/pokemon" },
    { label: "AI Fusion", href: "/ai" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing", isButton: true },
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
          {user ? (
            <div className="hidden md:flex items-center gap-2 animate-in fade-in duration-300">
              {isDashboard && (
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.email}
                </span>
              )}
              {!isDashboard && (
                <>
                  <Button asChild size="sm" variant="default">
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              )}
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex gap-2 animate-in fade-in duration-300">
              <Button asChild size="sm" variant="outline">
                <Link href={AUTH_PATHS.includes(pathname) ? "/sign-in" : `/sign-in?redirect_to=${encodeURIComponent(pathname)}`}>Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={AUTH_PATHS.includes(pathname) ? "/sign-up" : `/sign-up?redirect_to=${encodeURIComponent(pathname)}`}>Sign up</Link>
              </Button>
            </div>
          )}
          <MobileNav items={navItems} user={user} isDashboard={isDashboard} />
        </div>
      </div>
    </header>
  );
}

