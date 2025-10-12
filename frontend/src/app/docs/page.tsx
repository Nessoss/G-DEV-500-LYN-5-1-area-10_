import { ArrowRight, BookOpen, Lightbulb, Zap, Users, Settings, HelpCircle, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: "1",
      title: "Créez votre compte",
      description: "Inscrivez-vous gratuitement en moins de 30 secondes",
      icon: Users
    },
    {
      step: "2", 
      title: "Connectez vos apps",
      description: "Liez vos services favoris avec OAuth sécurisé",
      icon: Settings
    },
    {
      step: "3",
      title: "Créez votre première Area",
      description: "Définissez un déclencheur et une action en quelques clics",
      icon: Zap
    },
    {
      step: "4",
      title: "Activez et profitez",
      description: "Votre automatisation fonctionne maintenant 24/7",
      icon: Lightbulb
    }
  ];

  const categories = [
    {
      title: "Guide de démarrage",
      description: "Premiers pas avec AREA",
      articles: [
        "Comment créer votre première automatisation",
        "Connecter vos applications favorites",
        "Comprendre les déclencheurs et actions",
        "Gérer vos automatisations"
      ],
      icon: BookOpen,
      color: "primary"
    },
    {
      title: "Intégrations",
      description: "Configurer vos services",
      articles: [
        "Gmail - Automatiser vos emails",
        "Slack - Notifications intelligentes", 
        "Google Drive - Synchronisation de fichiers",
        "Twitter - Gestion des réseaux sociaux"
      ],
      icon: Settings,
      color: "secondary"
    },
    {
      title: "Cas d&apos;usage avancés",
      description: "Automatisations complexes",
      articles: [
        "Workflow marketing automatisé",
        "Sauvegarde automatique de données",
        "Monitoring et alertes",
        "Intégration CRM et ventes"
      ],
      icon: Zap,
      color: "accent"
    },
    {
      title: "Résolution de problèmes",
      description: "Aide et dépannage",
      articles: [
        "Que faire si mon automatisation ne fonctionne pas ?",
        "Erreurs de connexion aux services",
        "Limites et quotas",
        "Contacter le support"
      ],
      icon: HelpCircle,
      color: "primary"
    }
  ];

  const popularArticles = [
    "Comment créer une automatisation Gmail → Slack",
    "Synchroniser Google Calendar avec Notion",
    "Automatiser vos posts sur les réseaux sociaux",
    "Sauvegarder automatiquement vos photos Instagram",
    "Créer des notifications personnalisées"
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
              Documentation
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}AREA
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Tout ce que vous devez savoir pour maîtriser AREA. 
              Guides, tutoriels et exemples pour automatiser votre quotidien.
            </p>
            
            {/* Barre de recherche */}
            <div className="mt-10 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  className="pl-10 pr-4 py-3 text-lg"
                  placeholder="Rechercher dans la documentation..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Guide de démarrage rapide
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Créez votre première automatisation en 4 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStartSteps.map((step, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    Étape {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/areas">
              <Button size="lg" className="gap-2">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explorez la documentation
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Trouvez rapidement les informations dont vous avez besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${category.color}/10`}>
                      <category.icon className={`h-6 w-6 text-${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                      <CardDescription className="text-base">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm hover:underline">{article}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Articles populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Les guides les plus consultés par notre communauté
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors cursor-pointer p-3 rounded-lg hover:bg-primary/5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-base hover:underline">{article}</span>
                      <ExternalLink className="h-4 w-4 ml-auto flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Réponses aux questions les plus courantes
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
              <CardHeader>
                <CardTitle>AREA est-il gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Oui ! AREA propose un plan gratuit généreux avec jusqu&apos;à 10 automatisations actives. 
                  Des plans payants sont disponibles pour plus de fonctionnalités.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-all duration-300">
              <CardHeader>
                <CardTitle>Combien d&apos;applications puis-je connecter ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Plus de 15 services populaires sont disponibles, incluant Gmail, Slack, Google Drive, 
                  Twitter, et bien d&apos;autres. La liste s&apos;agrandit régulièrement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-300">
              <CardHeader>
                <CardTitle>Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Absolument. Nous utilisons OAuth pour l&apos;authentification et chiffrons toutes les données. 
                  Vos informations ne sont jamais stockées en plain text.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
              <CardHeader>
                <CardTitle>Que faire si mon automatisation ne fonctionne pas ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Vérifiez d&apos;abord les logs dans votre dashboard. La plupart des problèmes viennent 
                  des permissions d&apos;applications. Notre support est là pour vous aider !
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Besoin d&apos;aide supplémentaire ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Notre équipe support est disponible 24/7 pour répondre à toutes vos questions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/support">
                <Button size="lg" className="gap-2">
                  Contacter le support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline">
                  Rejoindre la communauté
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
            Documentation mise à jour quotidiennement
          </p>
        </div>
      </footer>
    </div>
  );
}
