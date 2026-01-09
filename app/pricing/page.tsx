"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";
import { Check, Gift, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function PricingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use all fusion generators on the free plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Free users get access to all three generators (Dragon Ball, Pokemon, AI) with 5 daily fusions total."
        }
      },
      {
        "@type": "Question",
        name: "Do credits work for all generator types?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. 1 credit = 1 standard fusion or 2 credits = 1 HD fusion, regardless of which generator you use."
        }
      },
      {
        "@type": "Question",
        name: "What's the difference between Pro and Credit Pack?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pro is subscription-based with unlimited everything. Credit Pack is pay-as-you-go for occasional creators."
        }
      },
      {
        "@type": "Question",
        name: "Can I switch between plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can upgrade, downgrade, or switch to credits anytime. Unused credits are always preserved."
        }
      },
      {
        "@type": "Question",
        name: "Does the free plan include Dragon Ball Z fusion generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Free users get access to our Dragon Ball fusion generator with 5 daily fusions included."
        }
      },
      {
        "@type": "Question",
        name: "Can I create Pokemon infinite fusions with credits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Credits work across all generators including Pokemon infinite fusion and Dragon Ball fusion generator."
        }
      },
      {
        "@type": "Question",
        name: "Is there an AI fusion generator free option?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the free plan includes access to our AI fusion generator with 5 daily creations."
        }
      }
    ]
  };

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "forever",
      description: "Try all fusion generators",
      icon: Gift,
      features: [
        "5 free fusions daily across all tools",
        "Access to: Dragon Ball, Pokemon & AI Fusion",
        "Standard quality (720p)",
        "Share to Fusion Gallery",
        "Watermark on generated images"
      ],
      cta: "Start Creating Free",
      popular: false
    },
    {
      name: "Pro Unlimited",
      price: "$9.99",
      period: "/month",
      description: "Full access to all fusion generators",
      icon: Crown,
      features: [
        "Unlimited fusions across all tools",
        "HD quality (1080p)",
        "No watermark",
        "Priority processing",
        "Early access to new generators"
      ],
      cta: "Get Pro Unlimited",
      popular: true,
      savings: "Save 20% with annual billing • $7.99/month"
    },
    {
      name: "Credit Pack",
      price: "$14.99",
      period: "/500 credits",
      description: "Pay as you go, credits never expire",
      icon: Sparkles,
      features: [
        "1 credit = 1 standard fusion",
        "2 credits = 1 HD fusion",
        "Works across all generators",
        "Credits never expire",
        "Perfect for occasional use"
      ],
      cta: "Buy Credits",
      popular: false,
      note: "≈ $0.03 per HD fusion • Great for occasional use"
    }
  ];

  return (
    <>
      <Script
        id="pricing-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-10">
          {/* CTA Banner */}
          <motion.section
            className="text-center py-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl mb-10"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-2">Try Our Dragon Ball Fusion Generator Free Today!</h3>
            <p className="mb-4 text-muted-foreground">5 free fusions daily - No credit card required</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/ai">Start Free Dragon Ball Fusion</Link>
            </Button>
          </motion.section>

          {/* Hero */}
          <motion.section
            className="text-center space-y-2 mb-10"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Fusion Generator Pricing: Free Dragon Ball & Pokemon Fusion Tools
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Start free and upgrade anytime. Choose the plan that fits your fusion creation needs.
            </p>
            <h2 className="text-xl font-semibold text-muted-foreground mt-2">
              Create Unlimited Dragon Ball Z Fusions, Pokemon Character Fusions & AI Anime Fusions
            </h2>
          </motion.section>

          {/* Pricing Cards */}
          <section className="w-full py-12">
            <div className="mx-auto max-w-6xl space-y-12">
              <motion.div
                className="text-center space-y-4"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Choose Your Fusion Plan
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                  Start with a free trial or get unlimited access to all fusion generators.
                </p>
              </motion.div>

              <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card className={`h-full transition-all duration-300 hover:shadow-lg ${plan.popular ? 'border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10' : 'border border-border hover:border-primary/20'
                      }`}>
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`p-3 rounded-full ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                            <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                        </div>
                        <h3 className="tracking-tight text-2xl font-bold text-foreground">{plan.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground text-lg">{plan.period}</span>
                          </div>
                          <p className="text-muted-foreground">{plan.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className={`mt-0.5 p-1 rounded-full ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                                <Check className={`h-3 w-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                              <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4">
                          <Button
                            asChild
                            className={`w-full h-12 text-lg font-medium transition-all duration-200 ${plan.popular
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                : 'border-primary/20 text-primary hover:bg-primary/5'
                              }`}
                            variant={plan.popular ? 'default' : 'outline'}
                          >
                            <Link href={plan.name === "Free Plan" ? "/ai" : "/sign-up"}>
                              {plan.cta}
                            </Link>
                          </Button>
                        </div>
                        {(plan.savings || plan.note) && (
                          <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground">{plan.savings || plan.note}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Common Questions */}
              <motion.div
                className="text-center space-y-4 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-foreground">Common Questions</h3>
                <p className="text-muted-foreground">
                  All plans include full access to Dragon Ball Fusion, Pokemon Fusion, and AI Fusion generators. Only quality and quantity differ.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    One price for all fusion tools
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    Cancel anytime
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    30-day money-back guarantee
                  </span>
                </div>

                {/* FAQ */}
                <div className="mx-auto max-w-3xl text-left space-y-3 pt-4">
                  {faqSchema.mainEntity.map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-muted-foreground">{item.acceptedAnswer.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}