import { ArrowRight, Search, Star, ExternalLink, Zap, Users, TrendingUp, Clock, Tag, Heart, Download, Play, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function TemplatesPage() {
  const categories = [
    { name: "Tous", count: 42, color: "primary" },
    { name: "Marketing", count: 12, color: "secondary" },
    { name: "Productivité", count: 10, color: "accent" },
    { name: "E-commerce", count: 8, color: "primary" },
    { name: "Communication", count: 7, color: "secondary" },
    { name: "Développement", count: 5, color: "accent" }
  ];

  const featuredTemplates = [
    {
      id: 1,
      title: "Lead Nurturing Automatique",
      description: "Séquence d&apos;emails automatique pour convertir vos leads en clients",
      category: "Marketing",
      difficulty: "Intermédiaire",
      setupTime: "10 min",
      rating: 4.9,
      uses: "2.1K",
      author: "AREA Team",
      services: ["Gmail", "Google Sheets", "Slack"],
      triggers: ["Nouveau lead dans Google Sheets"],
      actions: ["Série d&apos;emails personnalisés", "Notification Slack équipe vente"],
      featured: true,
      premium: false
    },
    {
      id: 2, 
      title: "Sauvegarde Automatique de Contenu",
      description: "Sauvegarde automatique de tous vos contenus sociaux et articles",
      category: "Productivité",
      difficulty: "Facile",
      setupTime: "5 min",
      rating: 4.8,
      uses: "1.8K",
      author: "Marie D.",
      services: ["Twitter", "Google Drive", "Notion"],
      triggers: ["Nouveau tweet avec hashtag", "Article publié"],
      actions: ["Sauvegarde dans Drive", "Ajout à base Notion"],
      featured: true,
      premium: false
    },
    {
      id: 3,
      title: "Monitoring E-commerce Avancé",
      description: "Surveillance complète de votre boutique avec alertes intelligentes",
      category: "E-commerce", 
      difficulty: "Avancé",
      setupTime: "15 min",
      rating: 4.7,
      uses: "956",
      author: "Alex M.",
      services: ["Shopify", "Gmail", "Slack", "Google Analytics"],
      triggers: ["Stock faible", "Commande importante", "Pic de trafic"],
      actions: ["Alertes email", "Notifications Slack", "Rapport automatique"],
      featured: true,
      premium: true
    }
  ];

  const allTemplates = [
    {
      id: 4,
      title: "Onboarding Client Automatisé",
      description: "Séquence d&apos;accueil automatique pour nouveaux clients",
      category: "Marketing",
      difficulty: "Facile",
      setupTime: "8 min",
      rating: 4.6,
      uses: "1.2K",
      author: "Sophie L.",
      services: ["Gmail", "Trello"],
      premium: false
    },
    {
      id: 5,
      title: "Veille Concurrentielle",
      description: "Surveillance automatique de vos concurrents sur les réseaux sociaux",
      category: "Marketing",
      difficulty: "Intermédiaire", 
      setupTime: "12 min",
      rating: 4.5,
      uses: "890",
      author: "Thomas B.",
      services: ["Twitter", "Google Sheets", "Gmail"],
      premium: false
    },
    {
      id: 6,
      title: "Synchronisation d&apos;Équipe",
      description: "Synchronise les tâches entre Trello, Slack et Google Calendar",
      category: "Productivité",
      difficulty: "Intermédiaire",
      setupTime: "10 min", 
      rating: 4.8,
      uses: "1.5K",
      author: "Julie R.",
      services: ["Trello", "Slack", "Google Calendar"],
      premium: false
    },
    {
      id: 7,
      title: "Backup Automatique GitHub",
      description: "Sauvegarde automatique de vos repos dans Google Drive",
      category: "Développement",
      difficulty: "Facile",
      setupTime: "6 min",
      rating: 4.7,
      uses: "743",
      author: "Dev Community",
      services: ["GitHub", "Google Drive"],
      premium: false
    },
    {
      id: 8,
      title: "Analytics Dashboard Temps Réel", 
      description: "Dashboard automatique avec métriques business actualisées",
      category: "E-commerce",
      difficulty: "Avancé",
      setupTime: "20 min",
      rating: 4.9,
      uses: "654",
      author: "AREA Pro",
      services: ["Google Analytics", "Shopify", "Slack", "Gmail"],
      premium: true
    },
    {
      id: 9,
      title: "Support Client Intelligent",
      description: "Répartition automatique des tickets selon la priorité",
      category: "Communication",
      difficulty: "Intermédiaire",
      setupTime: "12 min",
      rating: 4.6,
      uses: "1.1K", 
      author: "Customer Team",
      services: ["Gmail", "Trello", "Slack"],
      premium: false
    },
    {
      id: 10,
      title: "Content Marketing Automation",
      description: "Publication croisée automatique sur tous vos réseaux sociaux",
      category: "Marketing",
      difficulty: "Facile",
      setupTime: "7 min",
      rating: 4.4,
      uses: "2.3K",
      author: "Marketing Pro", 
      services: ["Twitter", "LinkedIn", "Facebook"],
      premium: false
    },
    {
      id: 11,
      title: "Gestion de Stock Intelligente",
      description: "Réapprovisionnement automatique basé sur les ventes",
      category: "E-commerce",
      difficulty: "Avancé",
      setupTime: "18 min",
      rating: 4.8,
      uses: "432",
      author: "E-commerce Expert",
      services: ["Shopify", "Google Sheets", "Gmail"],
      premium: true
    },
    {
      id: 12,
      title: "Workflow de Développement",
      description: "Automatisation complète du cycle de développement",
      category: "Développement", 
      difficulty: "Avancé",
      setupTime: "25 min",
      rating: 4.7,
      uses: "567",
      author: "DevOps Team",
      services: ["GitHub", "Slack", "Trello", "Gmail"],
      premium: true
    }
  ];

  const stats = [
    { label: "Templates disponibles", value: "42+", icon: Zap },
    { label: "Téléchargements", value: "15K+", icon: Download },
    { label: "Utilisateurs actifs", value: "8.2K", icon: Users },
    { label: "Note moyenne", value: "4.7/5", icon: Star }
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
              Templates
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}prêts à l&apos;emploi
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Automatisations pré-construites par notre communauté. 
              Installez et personnalisez en quelques clics.
            </p>
            
            {/* Recherche et filtres */}
            <div className="mt-10 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    className="pl-10 pr-4 py-3 text-lg"
                    placeholder="Rechercher un template..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    Catégorie
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    Difficulté
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Parcourir par catégorie
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="gap-2 hover:bg-primary/10 hover:border-primary/50"
              >
                <Tag className="h-4 w-4" />
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Templates populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Les automatisations les plus appréciées par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift relative">
                {template.premium && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                      PRO
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
                  <CardDescription className="text-base">{template.description}</CardDescription>
                  
                  <div className="flex items-center justify-between mt-4 text-sm text-foreground/70">
                    <span>Par {template.author}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{template.uses}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.setupTime}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-foreground/90">Services utilisés:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.services.map((service, serviceIndex) => (
                        <span key={serviceIndex} className="text-xs bg-muted px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-foreground/90">Déclencheurs:</h4>
                    <ul className="space-y-1">
                      {template.triggers.map((trigger, triggerIndex) => (
                        <li key={triggerIndex} className="text-xs text-foreground/70 flex items-start gap-1">
                          <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                          <span>{trigger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button className="flex-1 gap-2" size="sm">
                      <Play className="h-4 w-4" />
                      Utiliser
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Templates */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tous les templates
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Explorez notre bibliothèque complète d&apos;automatisations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTemplates.map((template, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 relative">
                {template.premium && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      P
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{template.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-base mb-1">{template.title}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-foreground/70">
                    <span>Par {template.author}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{template.uses}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.setupTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.services.slice(0, 3).map((service, serviceIndex) => (
                      <span key={serviceIndex} className="text-xs bg-muted px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                    {template.services.length > 3 && (
                      <span className="text-xs text-foreground/70">
                        +{template.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="flex-1" variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-2" />
                      Utiliser
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus de templates
            </Button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contribuez à la communauté
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Partagez vos automatisations et aidez d&apos;autres utilisateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Créer un template</CardTitle>
                <CardDescription>
                  Transformez votre automatisation en template réutilisable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Publier mon template
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Rejoindre la communauté</CardTitle>
                <CardDescription>
                  Échangez avec d&apos;autres créateurs de templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Rejoindre le Discord
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-300 text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Programme de récompenses</CardTitle>
                <CardDescription>
                  Gagnez des récompenses pour vos templates populaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  En savoir plus
                </Button>
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
              Prêt à automatiser avec nos templates ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Plus de 42 templates prêts à l&apos;emploi. Installation en un clic, 
              personnalisation selon vos besoins.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Commencer avec un template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Guide des templates
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
            Nouveaux templates ajoutés chaque semaine
          </p>
        </div>
      </footer>
    </div>
  );
}
