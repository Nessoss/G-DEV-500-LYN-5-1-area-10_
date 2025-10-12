import { ArrowRight, Zap, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import ServicesCarousel from "@/components/ServicesCarousel"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Fond gradient global uniforme */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Bienvenue sur
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}AREA
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
              Connectez vos applications préférées et automatisez vos tâches quotidiennes.
              Simple, rapide et puissant.
            </p>

            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/areas">
                <Button size="lg" className="gap-2">
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/aboutus">
                <Button 
                  size="lg" 
                  variant="outline"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <ServicesCarousel />

      {/* Features Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir AREA ?
            </h2>
            <p className="mt-4 text-lg">
              Une solution complète pour automatiser votre quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary/70 hover:bg-primary/5 dark:hover:bg-primary/10 hover-lift">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300">
                  <Zap className="h-6 w-6 text-primary animate-pulse-subtle" />
                </div>
                <CardTitle>Rapide et efficace</CardTitle>
                <CardDescription>
                  Automatisez vos tâches en quelques clics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">
                  Créez des automatisations puissantes sans écrire une seule ligne de code.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Interface intuitive et facile à prendre en main</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Déclenchement instantané de vos actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Connectez plus de 10 services populaires</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/70 hover:bg-secondary/5 dark:hover:bg-secondary/10 hover-lift">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-300">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Sécurisé</CardTitle>
                <CardDescription>
                  Vos données sont protégées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">
                  Chiffrement de bout en bout et conformité aux standards de sécurité.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 font-bold">✓</span>
                    <span>Authentification OAuth sécurisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 font-bold">✓</span>
                    <span>Hébergement conforme RGPD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 font-bold">✓</span>
                    <span>Surveillance 24/7 et backups automatiques</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-400/70 hover:bg-orange-50/30 dark:hover:bg-orange-900/20 hover-lift">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 hover:bg-accent/20 transition-all duration-300">
                  <Users className="h-6 w-6 text-accent animate-bounce-subtle" />
                </div>
                <CardTitle>Collaboratif</CardTitle>
                <CardDescription>
                  Travaillez en équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">
                  Partagez vos automatisations et collaborez avec votre équipe.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">✓</span>
                    <span>Espaces de travail partagés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">✓</span>
                    <span>Gestion des rôles et permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-bold">✓</span>
                    <span>Templates réutilisables par toute l&apos;équipe</span>
                  </li>
                </ul>
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
              Prêt à commencer ?
            </h2>
            <p className="mt-6 text-lg leading-8">
              Rejoignez des milliers d&apos;utilisateurs qui automatisent leur quotidien
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button size="lg" className="gap-2">
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t relative">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-foreground/70">
            © 2025 AREA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}