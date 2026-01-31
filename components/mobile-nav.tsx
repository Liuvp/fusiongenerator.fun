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
import { useState, useEffect } from "react";

interface MobileNavProps {
  items: { label: string; href: string; isButton?: boolean }[];
  user: any;
  isDashboard: boolean;
}

import { usePathname } from "next/navigation";
const AUTH_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/auth/callback"];

export function MobileNav({ items, user, isDashboard }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute top-16 left-0 w-full bg-background border-b shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-4 max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col gap-4">
                {!isDashboard
                  ? items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={item.isButton
                        ? "text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md px-6 py-2 rounded-lg text-center mx-2"
                        : "text-lg font-medium px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                  : items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>

              <div className="mt-6 pt-6 border-t flex flex-col gap-3">
                {user ? (
                  <>
                    {user.email && (
                      <p className="text-sm text-muted-foreground px-2">{user.email}</p>
                    )}
                    {!isDashboard && (
                      <>
                        <Button asChild variant="default" className="w-full justify-start">
                          <Link href="/profile">Profile</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                      </>
                    )}
                    <form action={signOutAction} className="w-full">
                      <Button type="submit" variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                        Sign out
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href={AUTH_PATHS.includes(pathname) ? "/sign-in" : `/sign-in?redirect_to=${encodeURIComponent(pathname)}`}>Sign in</Link>
                    </Button>
                    <Button asChild variant="default" className="w-full">
                      <Link href={AUTH_PATHS.includes(pathname) ? "/sign-up" : `/sign-up?redirect_to=${encodeURIComponent(pathname)}`}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
