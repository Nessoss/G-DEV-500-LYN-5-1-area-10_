import { ArrowRight, Zap, Shield, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Bienvenue sur 
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AREA
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted max-w-2xl mx-auto">
              Connectez vos applications préférées et automatisez vos tâches quotidiennes.
              Simple, rapide et puissant.
            </p>

            <div className="mt-10 flex items-center justify-center gap-6">
              <Button size="lg" className="gap-2">
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir AREA ?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Une solution complète pour automatiser votre quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rapide et efficace</CardTitle>
                <CardDescription>
                  Automatisez vos tâches en quelques clics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Créez des automatisations puissantes sans écrire une seule ligne de code.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Sécurisé</CardTitle>
                <CardDescription>
                  Vos données sont protégées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chiffrement de bout en bout et conformité aux standards de sécurité.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Collaboratif</CardTitle>
                <CardDescription>
                  Travaillez en équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Partagez vos automatisations et collaborez avec votre équipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Rejoignez des milliers d'utilisateurs qui automatisent leur quotidien
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
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AREA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
