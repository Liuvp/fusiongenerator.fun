"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LOCALES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" }
] as const;

type Locale = typeof LOCALES[number]["code"];

function getLocaleFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/")[1];
  return LOCALES.find(locale => locale.code === seg)?.code || null;
}

function withLocale(pathname: string, target: Locale) {
  const parts = pathname.split("/");
  const curr = getLocaleFromPath(pathname);
  if (curr) {
    parts[1] = target; // swap locale segment
    const next = parts.join("/");
    return next || "/";
  }
  // no locale prefix: add one
  const base = pathname === "/" ? "" : pathname;
  return `/${target}${base}`;
}

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const current = getLocaleFromPath(pathname) || "en";
  const currentLocale = LOCALES.find(locale => locale.code === current) || LOCALES[0];

  const pushLocale = (target: Locale) => {
    const nextPath = withLocale(pathname, target);
    const query = searchParams?.toString();
    document.cookie = `locale=${target}; path=/; max-age=31536000`;
    router.push(query ? `${nextPath}?${query}` : nextPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 min-w-[100px]">
          <Globe className="w-4 h-4" />
          <span>{currentLocale.flag}</span>
          <span className="hidden sm:inline">{currentLocale.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LOCALES.map((locale) => (
          <DropdownMenuItem 
            key={locale.code}
            onClick={() => pushLocale(locale.code)}
            className={`flex items-center gap-2 ${current === locale.code ? "bg-purple-50 text-purple-600" : ""}`}
          >
            <span>{locale.flag}</span>
            <span>{locale.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
