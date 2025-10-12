import { ArrowRight, Search, Star, ExternalLink, Zap, Users, Database, Code, Globe, MessageSquare, FileText, BarChart3, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function IntegrationsPage() {
  const categories = [
    { name: "Tous", count: 15, icon: Globe, color: "primary" },
    { name: "Communication", count: 4, icon: MessageSquare, color: "secondary" },
    { name: "Stockage", count: 3, icon: Database, color: "accent" },
    { name: "Productivité", count: 3, icon: FileText, color: "primary" },
    { name: "E-commerce", count: 2, icon: ShoppingCart, color: "secondary" },
    { name: "Développement", count: 2, icon: Code, color: "accent" },
    { name: "Analytics", count: 1, icon: BarChart3, color: "primary" }
  ];

  const integrations = [
    {
      name: "Gmail",
      description: "Automatisez et gérez vos emails",
      category: "Communication",
      logo: "📧",
      popularity: 5,
      rating: 4.8,
      users: "25K+",
      triggers: ["Nouvel email", "Email avec pièce jointe", "Email d'un expéditeur spécifique"],
      actions: ["Envoyer un email", "Marquer comme lu", "Ajouter un label", "Transférer"],
      setupTime: "2 min",
      difficulty: "Facile",
      featured: true
    },
    {
      name: "Slack",
      description: "Notifications intelligentes et gestion d'équipe",
      category: "Communication", 
      logo: "💬",
      popularity: 5,
      rating: 4.9,
      users: "20K+",
      triggers: ["Message dans un canal", "Mention", "Nouveau membre"],
      actions: ["Envoyer un message", "Créer un canal", "Inviter un utilisateur"],
      setupTime: "1 min",
      difficulty: "Facile",
      featured: true
    },
    {
      name: "Google Drive",
      description: "Synchronisation et gestion automatique de fichiers",
      category: "Stockage",
      logo: "💾", 
      popularity: 4,
      rating: 4.7,
      users: "18K+",
      triggers: ["Nouveau fichier", "Fichier modifié", "Fichier partagé"],
      actions: ["Uploader un fichier", "Créer un dossier", "Partager", "Copier"],
      setupTime: "3 min",
      difficulty: "Facile",
      featured: false
    },
    {
      name: "Twitter/X",
      description: "Automatisation des réseaux sociaux et veille",
      category: "Communication",
      logo: "🐦",
      popularity: 4,
      rating: 4.6,
      users: "15K+", 
      triggers: ["Nouveau tweet", "Mention", "Nouveau follower", "Tweet avec hashtag"],
      actions: ["Publier un tweet", "Aimer", "Retweeter", "Suivre un utilisateur"],
      setupTime: "2 min",
      difficulty: "Moyen",
      featured: false
    },
    {
      name: "Notion",
      description: "Base de données et gestion de contenu avancée",
      category: "Productivité",
      logo: "📝",
      popularity: 4,
      rating: 4.8,
      users: "12K+",
      triggers: ["Nouvelle page", "Page mise à jour", "Tâche créée"],
      actions: ["Créer une page", "Mettre à jour une base de données", "Ajouter une tâche"],
      setupTime: "5 min", 
      difficulty: "Moyen",
      featured: true
    },
    {
      name: "GitHub",
      description: "Automatisation du workflow de développement",
      category: "Développement",
      logo: "🐙",
      popularity: 3,
      rating: 4.7,
      users: "8K+",
      triggers: ["Nouveau commit", "Pull request", "Issue créée", "Release"],
      actions: ["Créer une issue", "Commenter", "Merger PR", "Créer un tag"],
      setupTime: "3 min",
      difficulty: "Avancé",
      featured: false
    },
    {
      name: "Google Calendar",
      description: "Gestion automatique d'agenda et événements",
      category: "Productivité",
      logo: "📅",
      popularity: 4,
      rating: 4.5,
      users: "10K+",
      triggers: ["Nouvel événement", "Événement modifié", "Rappel"],
      actions: ["Créer un événement", "Inviter des participants", "Envoyer un rappel"],
      setupTime: "2 min",
      difficulty: "Facile", 
      featured: false
    },
    {
      name: "Dropbox",
      description: "Synchronisation de fichiers et collaboration",
      category: "Stockage",
      logo: "📦",
      popularity: 3,
      rating: 4.4,
      users: "7K+",
      triggers: ["Fichier ajouté", "Dossier partagé", "Lien créé"],
      actions: ["Uploader", "Partager un lien", "Créer un dossier"],
      setupTime: "3 min",
      difficulty: "Facile",
      featured: false
    },
    {
      name: "Trello",
      description: "Gestion de projets et tâches collaboratives",
      category: "Productivité", 
      logo: "📋",
      popularity: 3,
      rating: 4.6,
      users: "9K+",
      triggers: ["Nouvelle carte", "Carte déplacée", "Échéance approche"],
      actions: ["Créer une carte", "Déplacer une carte", "Ajouter un commentaire"],
      setupTime: "2 min",
      difficulty: "Facile",
      featured: false
    },
    {
      name: "Shopify",
      description: "Automatisation e-commerce et gestion des commandes",
      category: "E-commerce",
      logo: "🛒",
      popularity: 3,
      rating: 4.7,
      users: "6K+",
      triggers: ["Nouvelle commande", "Produit en rupture", "Nouveau client"],
      actions: ["Créer un produit", "Mettre à jour l'inventaire", "Envoyer un email"],
      setupTime: "5 min",
      difficulty: "Moyen",
      featured: false
    },
    {
      name: "OneDrive",
      description: "Stockage cloud Microsoft et collaboration",
      category: "Stockage",
      logo: "☁️",
      popularity: 3,
      rating: 4.3,
      users: "5K+",
      triggers: ["Nouveau fichier", "Fichier modifié", "Partage"],
      actions: ["Uploader", "Partager", "Synchroniser"],
      setupTime: "3 min",
      difficulty: "Facile", 
      featured: false
    },
    {
      name: "Discord",
      description: "Automatisation communauté et notifications gaming",
      category: "Communication",
      logo: "🎮",
      popularity: 3,
      rating: 4.5,
      users: "4K+",
      triggers: ["Nouveau message", "Membre rejoint", "Réaction ajoutée"],
      actions: ["Envoyer un message", "Créer un salon", "Assigner un rôle"],
      setupTime: "2 min",
      difficulty: "Moyen",
      featured: false
    },
    {
      name: "Airtable",
      description: "Base de données relationnelle et automatisation",
      category: "Productivité",
      logo: "🗃️", 
      popularity: 2,
      rating: 4.6,
      users: "3K+",
      triggers: ["Nouveau record", "Record modifié", "Vue filtrée"],
      actions: ["Créer un record", "Mettre à jour", "Lier des tables"],
      setupTime: "4 min",
      difficulty: "Moyen",
      featured: false
    },
    {
      name: "WooCommerce",
      description: "E-commerce WordPress et gestion boutique",
      category: "E-commerce", 
      logo: "🏪",
      popularity: 2,
      rating: 4.4,
      users: "2K+",
      triggers: ["Nouvelle commande", "Stock faible", "Nouveau produit"],
      actions: ["Créer un produit", "Mettre à jour le stock", "Notification"],
      setupTime: "6 min",
      difficulty: "Avancé",
      featured: false
    },
    {
      name: "Google Analytics",
      description: "Suivi et analyse automatique du trafic web",
      category: "Analytics",
      logo: "📊",
      popularity: 2,
      rating: 4.5,
      users: "1K+",
      triggers: ["Objectif atteint", "Pic de trafic", "Nouvelle session"],
      actions: ["Créer un rapport", "Envoyer des métriques", "Alertes"],
      setupTime: "7 min",
      difficulty: "Avancé", 
      featured: false
    }
  ];

  const popularWorkflows = [
    {
      title: "Email → Slack",
      description: "Nouveau email important → Notification Slack équipe",
      services: ["Gmail", "Slack"],
      usage: "8.2K utilisateurs",
      category: "Communication"
    },
    {
      title: "Drive → Notion",
      description: "Nouveau fichier Drive → Créer une page Notion",
      services: ["Google Drive", "Notion"],
      usage: "5.1K utilisateurs", 
      category: "Productivité"
    },
    {
      title: "GitHub → Discord",
      description: "Nouveau commit → Message Discord équipe dev",
      services: ["GitHub", "Discord"],
      usage: "3.8K utilisateurs",
      category: "Développement"
    },
    {
      title: "Calendar → Gmail",
      description: "Événement demain → Email de rappel automatique",
      services: ["Google Calendar", "Gmail"],
      usage: "4.5K utilisateurs",
      category: "Productivité"
    }
  ];

  const requestedIntegrations = [
    { name: "Instagram", votes: 245, category: "Social Media" },
    { name: "LinkedIn", votes: 189, category: "Professional" },
    { name: "Microsoft Teams", votes: 156, category: "Communication" },
    { name: "Stripe", votes: 134, category: "Payment" },
    { name: "HubSpot", votes: 98, category: "CRM" }
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
              Intégrations
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}populaires
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Connectez tous vos outils favoris. Plus de 15 services supportés 
              avec des nouvelles intégrations ajoutées chaque mois.
            </p>
            
            {/* Recherche et filtres */}
            <div className="mt-10 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                  <Input 
                    className="pl-10 pr-4 py-3 text-lg"
                    placeholder="Rechercher une intégration..."
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="storage">Stockage</SelectItem>
                    <SelectItem value="productivity">Productivité</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 cursor-pointer text-center">
                <CardContent className="p-4">
                  <div className={`mx-auto w-10 h-10 rounded-lg bg-${category.color}/10 flex items-center justify-center mb-3`}>
                    <category.icon className={`h-5 w-5 text-${category.color}`} />
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-1">{category.name}</h3>
                  <p className="text-xs text-foreground/60">{category.count} services</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Integrations */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Intégrations populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Les services les plus utilisés par notre communauté
            </p>
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {integrations.filter(integration => integration.featured).map((integration, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift relative">
                <div className="absolute -top-3 -right-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Star className="h-4 w-4" />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{integration.logo}</div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                  
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{integration.rating}</span>
                    </div>
                    <span className="text-sm text-foreground/70">{integration.users} utilisateurs</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Déclencheurs populaires:</h4>
                    <div className="space-y-1">
                      {integration.triggers.slice(0, 2).map((trigger, triggerIndex) => (
                        <div key={triggerIndex} className="text-xs bg-muted/50 px-2 py-1 rounded">
                          {trigger}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Configuration: {integration.setupTime}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      integration.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                      integration.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {integration.difficulty}
                    </span>
                  </div>

                  <Button className="w-full" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Connecter {integration.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Integrations Grid */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Toutes les intégrations
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Explorez notre catalogue complet de services supportés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{integration.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          {[...Array(integration.popularity)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <CardDescription className="text-sm">{integration.description}</CardDescription>
                      <div className="mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {integration.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-xs text-foreground/70">
                    <span>{integration.users} utilisateurs</span>
                    <span>★ {integration.rating}</span>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    Voir les détails
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Workflows */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Workflows populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Les automatisations les plus créées avec ces intégrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularWorkflows.map((workflow, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{workflow.title}</CardTitle>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {workflow.category}
                    </span>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {workflow.services.map((service, serviceIndex) => (
                        <span key={serviceIndex} className="text-xs bg-muted px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Users className="h-4 w-4" />
                      <span>{workflow.usage}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Utiliser ce template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/templates">
              <Button variant="outline" size="lg">
                Voir tous les templates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Requested Integrations */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Intégrations demandées
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Votez pour les prochaines intégrations à développer
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {requestedIntegrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{integration.name}</h3>
                          <p className="text-sm text-foreground/70">{integration.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-foreground/70">
                          <Users className="h-4 w-4" />
                          <span>{integration.votes} votes</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Voter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline">
                    Proposer une nouvelle intégration
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
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
              Prêt à connecter vos outils ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Commencez dès maintenant avec nos intégrations les plus populaires. 
              Configuration en moins de 5 minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Créer ma première automatisation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Guide d&apos;intégration
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
            Nouvelles intégrations ajoutées chaque mois
          </p>
        </div>
      </footer>
    </div>
  );
}
