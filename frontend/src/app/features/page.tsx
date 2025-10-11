import { ArrowRight, Zap, Shield, Users, Clock, Globe, Settings, Smartphone, BarChart3, Code, Webhook, Lock, Mail, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function FeaturesPage() {
  const mainFeatures = [
    {
      title: "Automatisation sans code",
      description: "Créez des automatisations puissantes avec notre interface visuelle intuitive. Aucune compétence technique requise.",
      icon: Zap,
      color: "primary",
      benefits: [
        "Interface drag & drop simple",
        "Templates prêts à l&apos;emploi", 
        "Assistant intelligent",
        "Aperçu en temps réel"
      ]
    },
    {
      title: "Sécurité renforcée",
      description: "Vos données sont protégées par les plus hauts standards de sécurité. Chiffrement bout-à-bout et conformité RGPD.",
      icon: Shield,
      color: "secondary", 
      benefits: [
        "Chiffrement AES-256",
        "OAuth 2.0 sécurisé",
        "Conformité RGPD",
        "Audits de sécurité réguliers"
      ]
    },
    {
      title: "Collaboration d&apos;équipe",
      description: "Travaillez ensemble sur vos automatisations. Partagez, commentez et gérez les permissions facilement.",
      icon: Users,
      color: "accent",
      benefits: [
        "Espaces de travail partagés",
        "Gestion des rôles et permissions",
        "Commentaires et notifications", 
        "Historique des modifications"
      ]
    },
    {
      title: "Exécution instantanée",
      description: "Vos automatisations se déclenchent en temps réel. Performance optimale garantie 24/7.",
      icon: Clock,
      color: "primary",
      benefits: [
        "Déclenchement en < 1 seconde",
        "99.9% d&apos;uptime garanti",
        "Surveillance proactive",
        "Auto-scaling automatique"
      ]
    }
  ];

  const integrations = [
    {
      name: "Gmail",
      description: "Automatisez vos emails",
      category: "Communication",
      logo: "📧"
    },
    {
      name: "Slack",
      description: "Notifications intelligentes", 
      category: "Communication",
      logo: "💬"
    },
    {
      name: "Google Drive",
      description: "Gestion de fichiers",
      category: "Stockage",
      logo: "💾"
    },
    {
      name: "Twitter",
      description: "Réseaux sociaux",
      category: "Social",
      logo: "🐦"
    },
    {
      name: "Notion",
      description: "Base de données",
      category: "Productivité", 
      logo: "📝"
    },
    {
      name: "GitHub",
      description: "Développement",
      category: "Code",
      logo: "🐙"
    },
    {
      name: "Webhooks",
      description: "API personnalisées",
      category: "Technique",
      logo: "🔗"
    },
    {
      name: "RSS",
      description: "Flux de contenu",
      category: "Contenu",
      logo: "📡"
    }
  ];

  const advancedFeatures = [
    {
      title: "Webhooks personnalisés",
      description: "Connectez n&apos;importe quelle API avec nos webhooks avancés et notre système de requêtes HTTP.",
      icon: Webhook,
      color: "primary"
    },
    {
      title: "Filtres et conditions",
      description: "Créez des logiques complexes avec des conditions if/then, des filtres de données et des boucles.",
      icon: Sliders,
      color: "secondary"
    },
    {
      title: "Analytics avancées", 
      description: "Suivez les performances de vos automatisations avec des métriques détaillées et des rapports.",
      icon: BarChart3,
      color: "accent"
    },
    {
      title: "API développeur",
      description: "Intégrez AREA dans vos applications avec notre API REST complète et notre SDK.",
      icon: Code,
      color: "primary"
    },
    {
      title: "App mobile",
      description: "Gérez vos automatisations depuis votre smartphone avec notre app iOS et Android.",
      icon: Smartphone,
      color: "secondary"
    },
    {
      title: "Support multi-région",
      description: "Vos données restent dans votre région avec notre infrastructure mondiale distribuée.",
      icon: Globe,
      color: "accent"
    }
  ];

  const useCases = [
    {
      title: "Marketing Automation",
      description: "Automatisez vos campagnes marketing, lead nurturing et reporting.",
      icon: Mail,
      examples: [
        "Nouveaux leads CRM → Email de bienvenue",
        "Mention Twitter → Notification Slack équipe",
        "Nouveau client → Ajout automatique newsletter"
      ]
    },
    {
      title: "Gestion de projet",
      description: "Synchronisez vos outils de projet et optimisez vos workflows d&apos;équipe.",
      icon: Settings,
      examples: [
        "Nouvelle tâche Trello → Notification équipe",
        "Commit GitHub → Mise à jour statut projet", 
        "Deadline approche → Rappel automatique"
      ]
    },
    {
      title: "E-commerce",
      description: "Automatisez vos processus de vente, inventaire et service client.",
      icon: BarChart3,
      examples: [
        "Nouvelle commande → Mise à jour inventaire",
        "Avis client négatif → Alerte support",
        "Stock faible → Commande fournisseur auto"
      ]
    },
    {
      title: "Conformité & Sécurité",
      description: "Surveillez et automatisez vos processus de sécurité et conformité.",
      icon: Lock,
      examples: [
        "Activité suspecte → Alerte sécurité",
        "Sauvegarde quotidienne → Vérification intégrité",
        "Nouveau employé → Provisioning comptes"
      ]
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
              Fonctionnalités
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}puissantes
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Découvrez toutes les fonctionnalités qui font d&apos;AREA la plateforme d&apos;automatisation 
              la plus complète et facile à utiliser du marché.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Essayer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Voir la documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Les fonctionnalités qui changent tout
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Des outils pensés pour simplifier votre quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${feature.color}/10 mb-4`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className={`w-2 h-2 rounded-full bg-${feature.color}`}></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              15+ intégrations populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Connectez vos outils favoris en quelques clics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{integration.logo}</div>
                  <h3 className="font-semibold text-foreground mb-1">{integration.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{integration.description}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {integration.category}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/integrations">
              <Button variant="outline" size="lg">
                Voir toutes les intégrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Fonctionnalités avancées
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Pour les utilisateurs qui veulent aller plus loin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
                <CardHeader>
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-${feature.color}/10 mb-3`}>
                    <feature.icon className={`h-5 w-5 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Cas d&apos;usage populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Comment nos clients utilisent AREA au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <useCase.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <CardDescription>{useCase.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground/90 text-sm">Exemples d&apos;automatisations :</h4>
                    <ul className="space-y-2">
                      {useCase.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-sm text-foreground/80 flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/use-cases">
              <Button variant="outline" size="lg">
                Découvrir plus de cas d&apos;usage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir AREA ?
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Comparaison avec les autres solutions du marché
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-2">AREA</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-primary">
                      <ArrowRight className="h-3 w-3" />
                      <span>Interface intuitive</span>
                    </li>
                    <li className="flex items-center gap-2 text-primary">
                      <ArrowRight className="h-3 w-3" />
                      <span>Plan gratuit généreux</span>
                    </li>
                    <li className="flex items-center gap-2 text-primary">
                      <ArrowRight className="h-3 w-3" />
                      <span>Support francophone</span>
                    </li>
                    <li className="flex items-center gap-2 text-primary">
                      <ArrowRight className="h-3 w-3" />
                      <span>Données hébergées en Europe</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground/60 mb-2">Zapier</div>
                  <ul className="space-y-2 text-sm text-foreground/60">
                    <li>• Interface complexe</li>
                    <li>• Plan gratuit très limité</li>
                    <li>• Support anglais uniquement</li>
                    <li>• Serveurs US principalement</li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground/60 mb-2">IFTTT</div>
                  <ul className="space-y-2 text-sm text-foreground/60">
                    <li>• Fonctionnalités limitées</li>
                    <li>• Pas de logique complexe</li>
                    <li>• Intégrations restreintes</li>
                    <li>• Pas de support entreprise</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à découvrir toute la puissance d&apos;AREA ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Commencez gratuitement et automatisez votre première tâche en moins de 5 minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Créer un compte gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  Voir les tarifs
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
            Nouvelles fonctionnalités ajoutées chaque semaine
          </p>
        </div>
      </footer>
    </div>
  );
}
