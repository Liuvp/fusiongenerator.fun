"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react";
import { getLocaleFromPath, t } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function TermsPage() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname) || "en";
  const L = (p: string) => `/${locale}${p}`;
  return (
    <div className="min-h-screen bg-background">
      {/* Header removed: duplicate of breadcrumbs */}

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <Scale className="mr-2 h-4 w-4" />
              {t(locale, "terms.hero.badge")}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t(locale, "terms.hero.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t(locale, "terms.hero.desc")}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> 2025-12-04
            </p>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">{t(locale, "terms.keypoints.can.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{t(locale, "terms.keypoints.can.desc")}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">{t(locale, "terms.keypoints.cannot.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{t(locale, "terms.keypoints.cannot.desc")}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{t(locale, "terms.keypoints.commitment.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{t(locale, "terms.keypoints.commitment.desc")}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                {t(locale, "terms.service.title")}
              </h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>{t(locale, "terms.service.p1")}</p>
                
                <ul className="space-y-2">
                  <li>• {t(locale, "terms.service.list.db")}</li>
                  <li>• {t(locale, "terms.service.list.pk")}</li>
                  <li>• {t(locale, "terms.service.list.ai")}</li>
                  <li>• {t(locale, "terms.service.list.gallery")}</li>
                  <li>• {t(locale, "terms.service.list.disclaimer")}</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t(locale, "terms.resp.title")}</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">{t(locale, "terms.resp.acceptable.title")}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t(locale, "terms.resp.acceptable.item1")}</li>
                    <li>• {t(locale, "terms.resp.acceptable.item2")}</li>
                    <li>• {t(locale, "terms.resp.acceptable.item3")}</li>
                    <li>• {t(locale, "terms.resp.acceptable.item4")}</li>
                    <li>• {t(locale, "terms.resp.acceptable.item5")}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">{t(locale, "terms.resp.prohibited.title")}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t(locale, "terms.resp.prohibited.item1")}</li>
                    <li>• {t(locale, "terms.resp.prohibited.item2")}</li>
                    <li>• {t(locale, "terms.resp.prohibited.item3")}</li>
                    <li>• {t(locale, "terms.resp.prohibited.item4")}</li>
                    <li>• {t(locale, "terms.resp.prohibited.item5")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t(locale, "terms.ip.title")}</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{t(locale, "terms.ip.userRights.title")}</h4>
                  <p>{t(locale, "terms.ip.userRights.p")}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{t(locale, "terms.ip.platform.title")}</h4>
                  <p>{t(locale, "terms.ip.platform.p")}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{t(locale, "terms.ip.gallery.title")}</h4>
                  <p>{t(locale, "terms.ip.gallery.p")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Takedown Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t(locale, "terms.takedown.title")}</h3>
              <p className="text-muted-foreground">{t(locale, "terms.takedown.p")}</p>
            </div>
          </motion.div>

          {/* Service Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                {t(locale, "terms.availability.title")}
              </h3>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">{t(locale, "terms.availability.service.title")}</h4>
                  <p>{t(locale, "terms.availability.service.p")}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">{t(locale, "terms.availability.ai.title")}</h4>
                  <p>{t(locale, "terms.availability.ai.p")}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">{t(locale, "terms.availability.warranty.title")}</h4>
                  <p>{t(locale, "terms.availability.warranty.p")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t(locale, "terms.payment.title")}</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">{t(locale, "terms.payment.subs.title")}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t(locale, "terms.payment.subs.item1")}</li>
                    <li>• {t(locale, "terms.payment.subs.item2")}</li>
                    <li>• {t(locale, "terms.payment.subs.item3")}</li>
                    <li>• {t(locale, "terms.payment.subs.item4")}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">{t(locale, "terms.payment.cancel.title")}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t(locale, "terms.payment.cancel.item1")}</li>
                    <li>• {t(locale, "terms.payment.cancel.item2")}</li>
                    <li>• {t(locale, "terms.payment.cancel.item3")}</li>
                    <li>• {t(locale, "terms.payment.cancel.item4")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t(locale, "terms.changes.title")}</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>{t(locale, "terms.changes.p")}</p>
                
                <ul className="space-y-2">
                  <li>• {t(locale, "terms.changes.item1")}</li>
                  <li>• {t(locale, "terms.changes.item2")}</li>
                  <li>• {t(locale, "terms.changes.p")}</li>
                  <li>• {t(locale, "terms.changes.item3")}</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">{t(locale, "terms.contact.title")}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t(locale, "terms.contact.p")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href={L("/contact")}>
                  {t(locale, "terms.contact.cta.support")}
                </Link>
              </Button>
              <Button asChild>
                <Link href={L("/ai")}>
                  {t(locale, "terms.contact.cta.start")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
