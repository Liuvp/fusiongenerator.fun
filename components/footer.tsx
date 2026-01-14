"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { Github } from "lucide-react";
export function Footer() {
  const footerLinks = [
    {
      title: "Fusion Generator",
      links: [
        { label: "AI Fusion", href: "/ai" },
        { label: "Dragon Ball", href: "/dragon-ball" },
        { label: "Pokemon", href: "/pokemon" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Content",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Dragon Ball and Pokemon character fusion generator. Create unique fusion characters and share your creative works.
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
                      href={link.href}
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
            © 2025 FusionGenerator.fun
          </p>
          <p className="text-center text-xs text-muted-foreground/60 md:text-right max-w-xl">
            This tool is a fan-made AI generator and is not affiliated with or endorsed by Toei Animation, Shueisha, Nintendo, or The Pokémon Company. Fusion Generator uses third-party AI models to generate images. Users are aware that AI-generated content is powered by external AI services.
          </p>
        </div>
      </div>
    </footer>
  );
}
