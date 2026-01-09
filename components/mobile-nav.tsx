"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { localizedPath, t, Locale } from "@/lib/i18n";

interface MobileNavProps {
  items: { label: string; href: string; isButton?: boolean }[];
  user: any;
  isDashboard: boolean;
  locale: Locale;
}

export function MobileNav({ items, user, isDashboard, locale }: MobileNavProps) {
  const L = (p: string) => localizedPath(locale, p);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Fusion Generator</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          {!isDashboard
            ? items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.isButton
                  ? "text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg px-6 py-3 rounded-full text-center mx-2"
                  : "text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
                }
              >
                {item.label}
              </Link>
            ))
            : items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          {user ? (
            <div className="flex flex-col gap-2">
              {user.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
              {!isDashboard && (
                <>
                  <Button asChild variant="default" className="w-full">
                    <Link href={L("/profile")}>{t(locale, "nav.profile")}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={L("/dashboard")}>{t(locale, "nav.dashboard")}</Link>
                  </Button>
                </>
              )}
              <form action={signOutAction} className="w-full">
                <Button type="submit" variant="outline" className="w-full">
                  {t(locale, "nav.signout")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={L("/sign-in")}>{t(locale, "nav.signin")}</Link>
              </Button>
              <Button asChild variant="default" className="w-full">
                <Link href={L("/sign-up")}>{t(locale, "nav.signup")}</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
