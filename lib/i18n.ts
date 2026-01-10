export const LOCALES = ["en", "pt-br", "de", "fr", "es", "it", "ja"] as const
export type Locale = typeof LOCALES[number]
export const DEFAULT_LOCALE: Locale = "en"

const enDict = {
  "home.hero.title": "AI Fusion Generator: Create Ultimate Dragon Ball & Pokemon Fusions for Free",
  "nav.home": "Home",
  "nav.dragonBall": "Dragon Ball",
  "nav.pokemon": "Pokemon",
  "nav.ai": "AI Fusion",
  "nav.gallery": "Gallery",
  "nav.blog": "Blog",
  "nav.pricing": "Pricing",
  "nav.dashboard": "Dashboard",
  "nav.profile": "Profile",
  "nav.signin": "Sign in",
  "nav.signup": "Sign up",
  "nav.signout": "Sign out",
  "footer.builtBy": "Built by",
  "footer.rights": "© 2025 FusionGenerator.fun",
  "footer.desc": "Dragon Ball and Pokemon character fusion generator. Create unique fusion characters and share your creative works.",
  "footer.group.fusion": "Fusion Generator",
  "footer.group.content": "Content",
  "footer.group.legal": "Legal",
  "footer.about": "About Us",
  "footer.contact": "Contact Us",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Use",
  "home.hero.subtitle": "The world's #1 AI tool to merge any two images into Dragon Ball warriors, Pokémon hybrids, or any custom art style.",
  "home.cta.try": "Try Now",
  "home.cta.start": "Start for Free",
  "home.cta.pro": "Upgrade to Pro",
  "home.steps.title": "How to Use Our Fusion Generator - 4 Simple Steps",
  "home.steps.sub": "Our AI fusion generator makes creation simple and fun",
  "gallery.title": "Fusion Gallery - Dragon Ball & Pokemon Character Fusions",
  "gallery.subtitle": "Browse our collection of amazing Dragon Ball and Pokemon character fusions. Get inspired by community creations and start your own fusion journey.",
  "gallery.tabs.all": "All",
  "gallery.tabs.db": "Dragon Ball",
  "gallery.tabs.pk": "Pokémon",
  "gallery.imageName": "Image name:",
  "faq.title": "Frequently Asked Questions",
  "faq.q1": "What makes Fusion Generator the best?",
  "faq.a1": "We provide deep IP customization (Dragon Ball/Pokémon) and universal AI art fusion using state-of-the-art Latent Diffusion models, ensuring high-quality, coherent character designs.",
  "faq.q2": "Is it free to use?",
  "faq.a2": "Yes, we offer 3 free creations daily. Upgrade to Premium for unlimited generations, Ultra HD downloads, and commercial rights.",
  "faq.q3": "Do I need to sign up?",
  "faq.a3": "You can start fusing immediately without an account. Sign up is only required to save your creations to your personal Fusion Dex/Portfolio.",
  "faq.q4": "Can I use the images for commercial projects?",
  "faq.a4": "Free tier images are for personal use only. Pro and Enterprise plans include commercial usage rights for all generated assets.",
  "about.hero.badge": "ACG Fusion Creator",
  "about.hero.title.line1": "Let Dragon Ball and Pokémon",
  "about.hero.title.highlight": "Fuse freely to create new forms",
  "about.hero.desc": "We blend typings, abilities, palettes, and body shapes with coherent rules so you can craft imaginative, consistent fusion characters fast.",
  "about.mission.title": "Our Mission",
  "about.mission.desc": "Lower the barrier to fusion creation with smart logic and friendly tooling so every fan can build their own fusion characters.",
  "about.community.title": "Our Community",
  "about.community.desc": "A global community of ACG fans sharing works and ideas, fostering an open, supportive creative environment.",
  "about.global.title": "Global Reach",
  "about.global.desc": "Accessible across regions and languages — start your fusion journey anywhere.",
  "about.story.title": "Our Story",
  "about.story.p1": "Fusion Generator began with a simple idea: combine familiar characters using sensible rules and visual expression to unlock new possibilities. We focus on popular universes like Dragon Ball and Pokémon so results feel surprising yet coherent.",
  "about.story.p2": "With intelligent fusion logic and instant previews, creation becomes smoother and faster. Choose styles and elements freely to get fusion forms that balance lore and aesthetics.",
  "about.story.p3": "Whether you're a devoted anime fan, a community creator, or a designer seeking inspiration, this is the place to turn ideas into shareable works.",
  "about.values.title": "Our Values",
  "about.values.subtitle": "Four principles guide our product and community",
  "about.values.1.title": "Creativity First",
  "about.values.1.desc": "Encourage bold experiments and personal expression so every fusion is unique.",
  "about.values.2.title": "Respect Canon",
  "about.values.2.desc": "Balance creativity with original settings, honoring the spirit and style of classic characters.",
  "about.values.3.title": "Usability & Efficiency",
  "about.values.3.desc": "Clear UI and smart logic reduce learning cost and speed up creation.",
  "about.values.4.title": "Open Community",
  "about.values.4.desc": "Promote sharing and discussion, respect diverse aesthetics and viewpoints, and grow together.",
  "about.cta.title": "Start Your Fusion Creation",
  "about.cta.desc": "Pick a universe to try now, or customize with AI.",
  "about.cta.db": "Dragon Ball Fusion",
  "about.cta.pk": "Pokémon Fusion",
  "about.cta.ai": "AI Custom Fusion",
  "terms.hero.badge": "Legal Terms",
  "terms.hero.title": "Terms of Service",
  "terms.hero.desc": "These terms govern your use of our Fusion Generator for Dragon Ball and Pokémon character fusions. By using our service, you agree to these terms.",
  "terms.keypoints.can.title": "What You Can Do",
  "terms.keypoints.can.desc": "Use our tools to create fan-made fusions, save favorites, and share non-commercial creations within the community.",
  "terms.keypoints.cannot.title": "What You Cannot Do",
  "terms.keypoints.cannot.desc": "Commercialize generated content, infringe IP, impersonate brands, upload illegal or harmful content, or harass others.",
  "terms.keypoints.commitment.title": "Our Commitment",
  "terms.keypoints.commitment.desc": "Deliver a reliable creation experience, protect your privacy, moderate community content, and continuously improve quality.",
  "terms.service.title": "Our Service",
  "terms.service.p1": "Fusion Generator provides creation tools and preview experiences to craft fan-made character fusions with coherent rules across universes.",
  "terms.service.list.db": "Dragon Ball Fusion tools and presets",
  "terms.service.list.pk": "Pokémon Fusion tools and presets",
  "terms.service.list.ai": "AI Custom Fusion workflow",
  "terms.service.list.gallery": "Community Gallery and sharing",
  "terms.service.list.disclaimer": "We are not affiliated with or endorsed by Toei Animation, Shueisha, Nintendo, Game Freak, or The Pokémon Company.",
  "terms.resp.title": "Your Responsibilities",
  "terms.resp.acceptable.title": "Acceptable Use",
  "terms.resp.acceptable.item1": "Use the service for personal, educational, or non-commercial fan works",
  "terms.resp.acceptable.item2": "Provide accurate information when creating an account",
  "terms.resp.acceptable.item3": "Respect intellectual property and community guidelines",
  "terms.resp.acceptable.item4": "Keep your account credentials secure",
  "terms.resp.acceptable.item5": "Report technical issues, abuse, or infringement",
  "terms.resp.prohibited.title": "Prohibited Activities",
  "terms.resp.prohibited.item1": "Commercializing generated content without explicit permission",
  "terms.resp.prohibited.item2": "Impersonating brands or claiming official affiliation",
  "terms.resp.prohibited.item3": "Uploading illegal, hateful, or explicit content",
  "terms.resp.prohibited.item4": "Reverse-engineering, scraping, or bulk-generating to bypass limits",
  "terms.resp.prohibited.item5": "Harassment, spam, or manipulating community rankings",
  "terms.ip.title": "Intellectual Property and Generated Works",
  "terms.ip.userRights.title": "Your Rights to Generated Works",
  "terms.ip.userRights.p": "You may use fusion creations for personal, non-commercial purposes. Fan works are derivative in nature and may not be exclusively owned.",
  "terms.ip.platform.title": "Our Intellectual Property",
  "terms.ip.platform.p": "The platform, creation logic, website design, and proprietary technology remain our IP. Do not copy, modify, or redistribute our platform or technology.",
  "terms.ip.gallery.title": "License to Display",
  "terms.ip.gallery.p": "By submitting or saving works to the gallery, you grant us a non-exclusive license to display and promote them within the service.",
  "terms.takedown.title": "Takedown and Rights Requests",
  "terms.takedown.p": "If you are a rights holder and believe content infringes your rights, contact us with the work’s URL and proof of ownership. We will review and remove eligible content.",
  "terms.availability.title": "Service Availability and Disclaimers",
  "terms.availability.service.title": "Service Availability",
  "terms.availability.service.p": "We aim for continuous availability but may suspend services for maintenance or circumstances beyond our control.",
  "terms.availability.ai.title": "AI-Generated Content",
  "terms.availability.ai.p": "Fusion styles and outputs are generated by algorithms. Accuracy and appropriateness can vary; use discretion for public or formal contexts.",
  "terms.availability.warranty.title": "No Warranties",
  "terms.availability.warranty.p": "The service is provided ‘as is’ without warranties. We do not guarantee suitability or acceptance across all contexts.",
  "terms.payment.title": "Payment and Subscription Terms",
  "terms.payment.subs.title": "Premium Subscriptions",
  "terms.payment.subs.item1": "Monthly and annual options available",
  "terms.payment.subs.item2": "Automatic renewal unless cancelled",
  "terms.payment.subs.item3": "Access to higher limits and features",
  "terms.payment.subs.item4": "Advanced customization and presets",
  "terms.payment.cancel.title": "Cancellation and Refunds",
  "terms.payment.cancel.item1": "Cancel anytime in account settings",
  "terms.payment.cancel.item2": "Refunds follow our refund policy",
  "terms.payment.cancel.item3": "No refunds for partially used periods",
  "terms.payment.cancel.item4": "Free trial cancellations take effect immediately",
  "terms.changes.title": "Changes to These Terms",
  "terms.changes.p": "We may update these terms to reflect service, legal, or business changes. Continued use after updates constitutes acceptance.",
  "terms.changes.item1": "We update the ‘Last updated’ date",
  "terms.changes.item2": "Significant changes may be notified by email or in-app",
  "terms.changes.item3": "You can always find the current version on this page",
  "terms.contact.title": "Questions About These Terms?",
  "terms.contact.p": "Contact us if you need clarification about your rights and responsibilities or our moderation and takedown policies.",
  "terms.contact.cta.support": "Contact Support",
  "terms.contact.cta.start": "Start Creating",
}

const dict: Record<Locale, Record<string, string>> = {
  en: enDict,
  "pt-br": enDict,
  de: enDict,
  fr: enDict,
  es: enDict,
  it: enDict,
  ja: enDict,
}

export function getLocale(): Locale {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )locale=([^;]+)/)
    const c = match ? decodeURIComponent(match[1]) : undefined
    if (c && (LOCALES as readonly string[]).includes(c)) return c as Locale
  }
  return DEFAULT_LOCALE
}

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const segments = pathname.split('/')
  const first = segments[1]
  if (first && (LOCALES as readonly string[]).includes(first)) {
    return first as Locale
  }
  return undefined
}

export function t(locale: Locale, key: string): string {
  const d = dict[locale] || dict[DEFAULT_LOCALE]
  return d[key] ?? dict[DEFAULT_LOCALE][key] ?? key
}

export const SERIES_LABEL: Record<Locale, Record<"dragon-ball" | "pokemon", string>> = {
  en: { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  "pt-br": { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  de: { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  fr: { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  es: { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  it: { "dragon-ball": "Dragon Ball", pokemon: "Pokémon" },
  ja: { "dragon-ball": "ドラゴンボール", pokemon: "ポケモン" },
}

/**
 * Generate a localized path
 * Default locale (en) has no prefix, other locales have prefix
 * @param locale - Current locale
 * @param path - Path to localize (should start with /)
 * @returns Localized path
 */
export function localizedPath(locale: Locale, path: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Default locale (en) has no prefix
  if (locale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  // Other locales have prefix
  return `/${locale}${cleanPath}`;
}
