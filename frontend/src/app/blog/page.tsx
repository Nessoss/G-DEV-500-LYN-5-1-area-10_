import { ArrowRight, Search, Calendar, User, Clock, Tag, TrendingUp, ExternalLink, MessageSquare, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function BlogPage() {
  const categories = [
    { name: "Tous", count: 28, color: "primary" },
    { name: "Tutoriels", count: 12, color: "secondary" },
    { name: "Nouveautés", count: 8, color: "accent" },
    { name: "Cas d&apos;usage", count: 6, color: "primary" },
    { name: "Techniques", count: 2, color: "secondary" }
  ];

  const featuredArticle = {
    id: 1,
    title: "10 Automatisations qui vont révolutionner votre productivité en 2025",
    excerpt: "Découvrez les tendances d&apos;automatisation les plus impactantes de cette année et comment les implémenter avec AREA.",
    author: "Sophie Martin",
    authorRole: "Product Manager",
    date: "5 janvier 2025",
    readTime: "8 min",
    category: "Productivité",
    image: "📈",
    tags: ["Productivity", "2025", "Trends"],
    views: "2.1K",
    likes: 156,
    comments: 23,
    featured: true
  };

  const recentArticles = [
    {
      id: 2,
      title: "Comment automatiser votre workflow marketing avec Gmail et Slack",
      excerpt: "Guide complet pour créer un système de lead nurturing automatisé en 15 minutes.",
      author: "Alexandre Dubois",
      authorRole: "Marketing Lead",
      date: "2 janvier 2025",
      readTime: "12 min",
      category: "Marketing",
      image: "📧",
      tags: ["Gmail", "Slack", "Marketing"],
      views: "1.8K",
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      title: "Nouveauté : Intégration Discord et webhooks avancés",
      excerpt: "Découvrez notre nouvelle intégration Discord et les possibilités offertes par nos webhooks améliorés.",
      author: "Marie Lefebvre",
      authorRole: "Developer",
      date: "28 décembre 2024",
      readTime: "6 min",
      category: "Nouveautés",
      image: "🎮",
      tags: ["Discord", "Webhooks", "Update"],
      views: "3.2K",
      likes: 234,
      comments: 45
    },
    {
      id: 4,
      title: "Sécurité et RGPD : Comment AREA protège vos données",
      excerpt: "Plongée technique dans nos mesures de sécurité et notre conformité aux réglementations européennes.",
      author: "Thomas Bernard",
      authorRole: "Security Engineer",
      date: "20 décembre 2024",
      readTime: "10 min",
      category: "Technique",
      image: "🔒",
      tags: ["Security", "GDPR", "Privacy"],
      views: "945",
      likes: 67,
      comments: 8
    }
  ];

  const allArticles = [
    {
      id: 5,
      title: "E-commerce : 5 automatisations indispensables pour votre boutique Shopify",
      excerpt: "Optimisez vos ventes avec ces automatisations éprouvées pour votre boutique en ligne.",
      author: "Julie Rousseau",
      authorRole: "E-commerce Expert",
      date: "15 décembre 2024",
      readTime: "9 min",
      category: "E-commerce",
      image: "🛒",
      tags: ["Shopify", "E-commerce", "Sales"],
      views: "1.5K",
      likes: 78,
      comments: 12
    },
    {
      id: 6,
      title: "Automatisation pour développeurs : GitHub, Trello et Slack en synergie",
      excerpt: "Créez un workflow de développement parfaitement orchestré avec ces trois outils essentiels.",
      author: "Paul Dumont",
      authorRole: "Lead Developer",
      date: "10 décembre 2024",
      readTime: "14 min",
      category: "Développement",
      image: "⚡",
      tags: ["GitHub", "Development", "Workflow"],
      views: "2.3K",
      likes: 145,
      comments: 28
    },
    {
      id: 7,
      title: "Retour d&apos;expérience : Comment TechCorp a économisé 40h/semaine",
      excerpt: "Étude de cas détaillée sur l&apos;implémentation d&apos;AREA dans une entreprise de 200 personnes.",
      author: "Marie Dubois",
      authorRole: "Customer Success",
      date: "5 décembre 2024",
      readTime: "11 min",
      category: "Cas d&apos;usage",
      image: "📊",
      tags: ["Case Study", "Enterprise", "ROI"],
      views: "1.9K",
      likes: 98,
      comments: 19
    },
    {
      id: 8,
      title: "Notion + Gmail : L&apos;alliance parfaite pour la gestion de projets",
      excerpt: "Transformez vos emails en tâches Notion automatiquement et ne perdez plus jamais une information.",
      author: "Sophie Martin",
      authorRole: "Product Manager", 
      date: "1er décembre 2024",
      readTime: "7 min",
      category: "Productivité",
      image: "📝",
      tags: ["Notion", "Gmail", "Projects"],
      views: "2.7K",
      likes: 189,
      comments: 34
    },
    {
      id: 9,
      title: "Guide complet : Migrer de Zapier vers AREA sans effort",
      excerpt: "Toutes les étapes pour migrer vos automatisations existantes vers AREA en préservant vos workflows.",
      author: "Alexandre Dubois",
      authorRole: "Migration Expert",
      date: "25 novembre 2024",
      readTime: "16 min",
      category: "Guide",
      image: "🔄",
      tags: ["Migration", "Zapier", "Tutorial"],
      views: "3.8K",
      likes: 267,
      comments: 52
    },
    {
      id: 10,
      title: "Automatisation mobile : Gérez vos Areas depuis votre smartphone",
      excerpt: "Découvrez notre nouvelle app mobile et comment gérer vos automatisations en déplacement.",
      author: "Julie Rousseau",
      authorRole: "Mobile Team Lead",
      date: "18 novembre 2024",
      readTime: "5 min",
      category: "Mobile",
      image: "📱",
      tags: ["Mobile", "App", "Management"],
      views: "1.2K",
      likes: 56,
      comments: 9
    }
  ];

  const popularTags = [
    { name: "Gmail", count: 8 },
    { name: "Slack", count: 6 },
    { name: "Automation", count: 12 },
    { name: "Marketing", count: 5 },
    { name: "Tutorial", count: 9 },
    { name: "Productivity", count: 7 },
    { name: "E-commerce", count: 4 },
    { name: "Security", count: 3 }
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
              Blog
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}AREA
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Tutoriels, actualités et conseils d&apos;experts pour maîtriser l&apos;automatisation 
              et optimiser votre productivité.
            </p>
            
            {/* Barre de recherche */}
            <div className="mt-10 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <Input 
                  className="pl-10 pr-4 py-3 text-lg"
                  placeholder="Rechercher un article..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

      {/* Featured Article */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Article à la une
            </h2>
          </div>

          <Card className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-12">
                <div className="text-8xl">{featuredArticle.image}</div>
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                      FEATURED
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {featuredArticle.category}
                    </span>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl mb-3">{featuredArticle.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{featuredArticle.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{featuredArticle.author}</p>
                          <p className="text-xs text-foreground/70">{featuredArticle.authorRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-foreground/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{featuredArticle.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredArticle.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featuredArticle.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-muted px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-sm text-foreground/70">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{featuredArticle.views} vues</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{featuredArticle.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{featuredArticle.comments} commentaires</span>
                      </div>
                    </div>
                    <Button className="gap-2">
                      Lire l&apos;article
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Articles récents
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Les dernières publications de notre équipe d&apos;experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((article, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{article.image}</div>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                  <CardDescription>{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-xs">{article.author}</p>
                      <p className="text-xs text-foreground/70">{article.authorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-foreground/70">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-muted px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-3 text-xs text-foreground/70">
                      <span>{article.views} vues</span>
                      <span>{article.likes} ❤️</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Lire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tous les articles
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Explorez notre archive complète de guides et tutoriels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((article, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{article.image}</span>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <CardTitle className="text-base mb-2">{article.title}</CardTitle>
                  <CardDescription className="text-sm">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <p className="font-medium text-xs">{article.author}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-foreground/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-3 text-xs text-foreground/70">
                      <span>{article.views} vues</span>
                      <span>{article.likes} ❤️</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus d&apos;articles
            </Button>
          </div>
        </div>
      </section>

      {/* Tags populaires */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tags populaires
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Explorez les sujets les plus discutés
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {popularTags.map((tag, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="gap-2 hover:bg-primary/10 hover:border-primary/50"
              >
                <Tag className="h-3 w-3" />
                {tag.name} ({tag.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Restez informés
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Recevez nos derniers articles et conseils d&apos;automatisation directement dans votre boîte mail.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Votre adresse email"
                className="flex-1"
              />
              <Button className="gap-2">
                S&apos;abonner
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-foreground/70">
              Pas de spam, désinscription en un clic. Newsletter mensuelle uniquement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à mettre en pratique ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Transformez vos lectures en actions. Créez votre première automatisation maintenant.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Commencer maintenant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline">
                  Voir les templates
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
            Nouveaux articles chaque semaine
          </p>
        </div>
      </footer>
    </div>
  );
}
