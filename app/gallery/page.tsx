"use client"

import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { getLocaleFromPath, t, SERIES_LABEL, Locale } from "@/lib/i18n"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useMemo, useState } from "react"
import { useUser } from "@/hooks/use-user"

type FusionItem = {
  id: string
  name: string
  left: string
  right: string
  series: "dragon-ball" | "pokemon"
  image: string
}

const ITEMS: FusionItem[] = [
  {
    id: "db-1",
    name: "Gogeta Variant",
    left: "Goku",
    right: "Vegeta",
    series: "dragon-ball",
    image: "/images/fusion-generator-logo.svg",
  },
  {
    id: "db-2",
    name: "Piccolo x Krillin",
    left: "Piccolo",
    right: "Krillin",
    series: "dragon-ball",
    image: "/images/fusion-generator-logo.svg",
  },
  {
    id: "pk-1",
    name: "Charizard x Blastoise",
    left: "Charizard",
    right: "Blastoise",
    series: "pokemon",
    image: "/images/fusion-generator-logo.svg",
  },
  {
    id: "pk-2",
    name: "Gengar x Alakazam",
    left: "Gengar",
    right: "Alakazam",
    series: "pokemon",
    image: "/images/fusion-generator-logo.svg",
  },
]

const SERIES_ZH: Record<FusionItem["series"], string> = {
  "dragon-ball": "龙珠",
  pokemon: "宝可梦",
}

function getSeoImageName(item: FusionItem, locale: Locale): string {
  const series = SERIES_LABEL[locale][item.series]
  if (locale === "en") {
    if (item.series === "dragon-ball") {
      return `Dragon Ball Fusion - ${item.left} and ${item.right} Fusion Character`
    }
    return `Pokemon Fusion - ${item.left} and ${item.right} Combined Evolution`
  }
  if (locale === "ja") return `${series}-キャラクター融合-${item.left}-${item.right}-HDプレビュー`
  return `${series}-Character-Fusion-${item.left}-${item.right}-HD-Preview`
}

export default function GalleryPage() {
  const pathname = usePathname() || "/"
  const locale: Locale = (getLocaleFromPath(pathname) || "en") as Locale
  const L = (p: string) => `/${locale}${p}`
  const [filter, setFilter] = useState<string>("all")
  const [selected, setSelected] = useState<FusionItem | null>(null)
  const { user } = useUser()
  const [myItems, setMyItems] = useState<Array<{ id: string; url: string; name: string; form?: string; created_at?: string; path: string }>>([])
  const [loadingMy, setLoadingMy] = useState(false)

  const filtered = useMemo(() => {
    if (filter === "all") return ITEMS
    return ITEMS.filter((i) => i.series === filter)
  }, [filter])

  async function loadMy() {
    try {
      setLoadingMy(true)
      const res = await fetch("/api/gallery/list")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load gallery")
      setMyItems(data.items || [])
    } catch (e) {
      setMyItems([])
    } finally {
      setLoadingMy(false)
    }
  }

  useEffect(() => {
    if (user) loadMy()
  }, [user])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Fusion Gallery - Dragon Ball & Pokemon Character Fusions",
    description: "Collection of unique character fusions from Dragon Ball and Pokemon series",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ITEMS.length,
      itemListElement: ITEMS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ImageObject",
          name: `${item.left} and ${item.right} Fusion`,
          description: `${item.series === "dragon-ball" ? "Dragon Ball" : "Pokemon"} character fusion of ${item.left} and ${item.right}`,
        },
      })),
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Fusion Gallery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Fusion Gallery showcases amazing Dragon Ball and Pokemon character fusions created by our community. Browse through unique combinations and get inspired for your own creations.",
        },
      },
      {
        "@type": "Question",
        name: "Can I save my own fusions to the gallery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! When you create a fusion using our generator, you can save it to your personal gallery. Sign up for a free account to start saving your creations.",
        },
      },
      {
        "@type": "Question",
        name: "How do I create my own fusion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Click 'Try the Generator' or 'Create Your Own Fusion' to access our AI-powered fusion generator. Upload two images or select characters, choose your fusion style, and generate your unique creation.",
        },
      },
    ],
  }


  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <Script id="gallery-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="gallery-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Back removed: duplicate of breadcrumbs */}

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t(locale, "gallery.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t(locale, "gallery.subtitle")}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button asChild variant="default">
              <Link href={L("/ai")}>Try the Generator</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={L("/pricing")}>View Pricing</Link>
            </Button>
          </div>
        </motion.div>

        {/* My Gallery */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Saved Fusions</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={loadMy} disabled={loadingMy}>Refresh</Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loadingMy && (
                <div className="text-sm text-muted-foreground">Loading...</div>
              )}
              {!loadingMy && myItems.length === 0 && (
                <div className="text-sm text-muted-foreground">No saved fusions yet.</div>
              )}
              {myItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{item.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">{item.form || ""}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                      <Image src={item.url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button asChild size="sm">
                        <a href={item.url} target="_blank" rel="noreferrer">Open</a>
                      </Button>
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          const res = await fetch("/api/gallery/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: item.path }) })
                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || "Delete failed")
                          await loadMy()
                        } catch { }
                      }}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mt-8 flex justify-center">
          <Tabs defaultValue="all" onValueChange={(v) => setFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">{t(locale, "gallery.tabs.all")}</TabsTrigger>
              <TabsTrigger value="dragon-ball">{t(locale, "gallery.tabs.db")}</TabsTrigger>
              <TabsTrigger value="pokemon">{t(locale, "gallery.tabs.pk")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Featured Character Fusions</h2>
          <p className="text-muted-foreground">Discover amazing <strong>Dragon Ball fusions</strong> and creative <strong>Pokemon fusions</strong> created by our community. Each fusion combines unique traits and abilities to create entirely new characters.</p>
        </section>

        {/* Grid */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="group cursor-pointer overflow-hidden" onClick={() => setSelected(item)}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{item.name}</span>
                    <span className="text-xs font-medium text-muted-foreground capitalize">
                      {item.series.replace("-", " ")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={item.image}
                      alt={`${getSeoImageName(item, locale)}`}
                      fill
                      className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                      priority={false}
                    />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{t(locale, "gallery.imageName")} {getSeoImageName(item, locale)}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">About Our Fusion Gallery</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Dragon Ball Fusions</h3>
              <p className="text-sm text-muted-foreground">Explore unique character combinations from the Dragon Ball universe. See how Goku, Vegeta, Piccolo, and other characters blend together to create powerful new warriors.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pokemon Fusions</h3>
              <p className="text-sm text-muted-foreground">Discover creative Pokemon hybrids that combine types, abilities, and appearances. From Charizard blends to psychic Pokemon fusions, the possibilities are endless.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">Want more? Generate your own unique fusion.</p>
          <div className="mt-3">
            <Button asChild>
              <Link href={L("/ai")}>Create Your Own Fusion</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected ? getSeoImageName(selected, locale) : ""}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <Image
                  src={selected.image}
                  alt={`${getSeoImageName(selected, locale)}`}
                  fill
                  className="object-contain p-6"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Series: <span className="capitalize">{selected.series.replace("-", " ")}</span>
              </div>
              <div className="text-sm">
                Fusion: <span className="font-medium">{selected.left}</span> × {selected.right}
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href={L("/ai")}>Generate a Similar Fusion</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
