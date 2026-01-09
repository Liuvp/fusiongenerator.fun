"use client";

import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { usePathname } from "next/navigation";

const routeNameMap: Record<string, string> = {
  // top-level pages
  about: "About",
  contact: "Contact",
  pricing: "Pricing",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  dashboard: "Dashboard",
  profile: "Profile",
  gallery: "Gallery",
  results: "Results",
  ai: "AI Fusion",
  "dragon-ball": "Dragon Ball Fusion",
  pokemon: "Pokemon Fusion",
  product: "Product",
  "name-detail": "Name Detail",
  // nested
  "popular-names": "Popular Names",
  "random-generator": "Random Generator",
  batch: "Batch",
};

function formatSegment(seg: string): string {
  if (!seg) return "";
  const key = seg.toLowerCase();
  return routeNameMap[key] ?? decodeURIComponent(seg).replace(/-/g, " ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname) return null;
  const locale = getLocale();
  const L = (p: string) => `/${locale}${p}`;

  const segments = pathname.split("/").filter(Boolean);
  // 不在首页显示
  if (segments.length === 0) return null;

  const items = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = formatSegment(seg);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 py-2">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href={L("/")} className="hover:text-foreground">Home</Link>
          </li>
          {items.map((item, idx) => (
            <li key={item.href} className="flex items-center gap-2">
              <span className="opacity-60">/</span>
              {idx === items.length - 1 ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumbs;
