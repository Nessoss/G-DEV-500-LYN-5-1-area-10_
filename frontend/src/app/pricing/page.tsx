import { ArrowRight, Check, Zap, Users, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "/mois",
      description: "Parfait pour découvrir AREA",
      icon: Zap,
      color: "primary",
      popular: false,
      features: [
        "10 automatisations actives",
        "5 services connectés",
        "Historique 7 jours",
        "Support communautaire",
        "Templates de base",
        "Exécutions illimitées"
      ],
      limitations: [
        "Pas de support prioritaire",
        "Fonctionnalités avancées limitées"
      ],
      cta: "Commencer gratuitement",
      href: "/signup"
    },
    {
      name: "Pro", 
      price: "9",
      period: "/mois",
      description: "Pour les utilisateurs avancés",
      icon: Users,
      color: "secondary", 
      popular: true,
      features: [
        "100 automatisations actives",
        "Tous les services disponibles",
        "Historique 90 jours",
        "Support email prioritaire",
        "Templates avancés",
        "Webhooks personnalisés",
        "Filtres et conditions",
        "Notifications en temps réel"
      ],
      limitations: [],
      cta: "Essai gratuit 14 jours",
      href: "/signup?plan=pro"
    },
    {
      name: "Business",
      price: "29", 
      period: "/mois",
      description: "Pour les équipes et entreprises",
      icon: Crown,
      color: "accent",
      popular: false,
      features: [
        "Automatisations illimitées", 
        "Tous les services + API custom",
        "Historique illimité",
        "Support téléphonique 24/7",
        "Templates personnalisés",
        "Webhooks avancés",
        "Gestion d'équipe",
        "Analytics avancées",
        "SLA 99.9% garanti",
        "Sauvegarde et export"
      ],
      limitations: [],
      cta: "Démo personnalisée", 
      href: "/contact?plan=business"
    }
  ];

  const features = [
    {
      category: "Automatisations",
      free: "10 actives",
      pro: "100 actives", 
      business: "Illimitées"
    },
    {
      category: "Services connectés",
      free: "5 services",
      pro: "Tous les services",
      business: "Tous + API custom"
    },
    {
      category: "Historique",
      free: "7 jours",
      pro: "90 jours",
      business: "Illimité"
    },
    {
      category: "Support",
      free: "Communauté",
      pro: "Email prioritaire", 
      business: "Téléphone 24/7"
    },
    {
      category: "Webhooks",
      free: "Non",
      pro: "Basiques",
      business: "Avancés"
    },
    {
      category: "Gestion d'équipe", 
      free: "Non",
      pro: "Non",
      business: "Oui"
    },
    {
      category: "SLA",
      free: "Best effort",
      pro: "99% uptime",
      business: "99.9% garanti"
    },
    {
      category: "Analytics",
      free: "Basiques",
      pro: "Standards",
      business: "Avancées"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Marketing Manager",
      company: "TechCorp",
      plan: "Pro",
      testimonial: "AREA nous fait économiser 10h par semaine sur nos tâches répétitives. Le plan Pro est parfait pour notre équipe marketing.",
      avatar: "M"
    },
    {
      name: "Alexandre Martin",
      role: "CTO",
      company: "StartupXYZ", 
      plan: "Business",
      testimonial: "Avec le plan Business, nous avons pu intégrer AREA dans notre infrastructure. Le support est exceptionnel.",
      avatar: "A"
    },
    {
      name: "Sophie Leroy",
      role: "Freelance",
      company: "Consultante",
      plan: "Gratuit",
      testimonial: "J'ai commencé avec le plan gratuit et c'était déjà très puissant. Excellent pour débuter avec l'automatisation.",
      avatar: "S"
    }
  ];

  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
    },
    {
      question: "Y a-t-il des frais cachés ?",
      answer: "Non, nos prix sont transparents. Pas de frais d'installation, de résiliation ou autres frais cachés."
    },
    {
      question: "Que se passe-t-il si je dépasse mes limites ?",
      answer: "Nous vous préviendrons avant d'atteindre vos limites. Vous pourrez upgrader votre plan ou optimiser vos automatisations."
    },
    {
      question: "Proposez-vous des remises pour les associations ?",
      answer: "Oui, nous offrons des remises spéciales pour les associations, écoles et organisations à but non lucratif. Contactez-nous pour plus 'informations."
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Fond gradient global uniforme */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Tarifs
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}simples
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Choisissez le plan qui correspond à vos besoins. 
              Commencez gratuitement, évoluez à votre rythme.
            </p>
            
            {/* Toggle annuel/mensuel */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-foreground/80">Mensuel</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" />
                <div className="w-10 h-6 bg-muted rounded-full shadow-inner"></div>
              </div>
              <span className="text-sm font-medium text-foreground/80">
                Annuel 
                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">-20%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-2 relative transition-all duration-300 hover-lift ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Plus populaire
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-${plan.color}/10 flex items-center justify-center mb-4`}>
                    <plan.icon className={`h-8 w-8 text-${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="pt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-foreground">{plan.price}€</span>
                      <span className="text-lg text-foreground/60 ml-1">{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-foreground/60 mb-2">Limitations :</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-xs text-foreground/60">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link href={plan.href} className="block">
                    <Button 
                      className={`w-full gap-2 ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comparaison détaillée
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Toutes les fonctionnalités en un coup d&apos;œil
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-foreground">Fonctionnalités</th>
                      <th className="text-center p-4 font-medium text-foreground">Gratuit</th>
                      <th className="text-center p-4 font-medium text-foreground bg-primary/5">Pro</th>
                      <th className="text-center p-4 font-medium text-foreground">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium text-foreground/80">{feature.category}</td>
                        <td className="p-4 text-center text-foreground/70">{feature.free}</td>
                        <td className="p-4 text-center text-foreground/70 bg-primary/5">{feature.pro}</td>
                        <td className="p-4 text-center text-foreground/70">{feature.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ce que disent nos clients
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Des témoignages authentiques sur chaque plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {testimonial.plan}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 italic">
                    &quot;{testimonial.testimonial}&quot;
                  </p>
                  <p className="text-sm text-foreground/60 mt-2">
                    — {testimonial.company}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Tout ce que vous devez savoir sur nos tarifs
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à automatiser votre quotidien ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Commencez gratuitement dès aujourd&apos;hui. Aucune carte de crédit requise.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Essayer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Parler à un expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t relative">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-foreground/70">
            © 2025 AREA. Tous droits réservés. • 
            <span className="mx-2">•</span>
            Tarifs susceptibles d&apos;évoluer avec préavis de 30 jours
          </p>
        </div>
      </footer>
    </div>
  );
}
