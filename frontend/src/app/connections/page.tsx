"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Github, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthUser } from "@/hooks/use-auth-user"
import {
  getConnections,
  startDiscordConnection,
  startGithubConnection
} from "@/lib/api"
import type { ConnectionStatus } from "@/types/connections"

type ConnectState = "idle" | "github" | "discord"

export default function ConnectionsPage() {
  const authUser = useAuthUser()
  const [connectState, setConnectState] = useState<ConnectState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [discordError, setDiscordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [connections, setConnections] = useState<ConnectionStatus[]>([])

  const loadConnections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getConnections()
      setConnections(response.connections)
    } catch (err) {
      console.error("Échec du chargement des connexions:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger vos connexions pour le moment."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authUser) {
      setLoading(false)
      return
    }
    void loadConnections()
  }, [authUser, loadConnections])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data?.type === "github-connection:completed") {
        void loadConnections()
        if (event.data.success) {
          setError(null)
        } else if (event.data.error) {
          setError(event.data.error)
        }
        setConnectState("idle")
      }

      if (event.data?.type === "discord-connection:completed") {
        void loadConnections()
        if (event.data.success) {
          setDiscordError(null)
        } else if (event.data.error) {
          setDiscordError(event.data.error)
        }
        setConnectState("idle")
      }
    }

    window.addEventListener("message", handler)
    return () => {
      window.removeEventListener("message", handler)
    }
  }, [loadConnections])

  const githubStatus = useMemo(
    () => connections.find((connection) => connection.provider === "github"),
    [connections]
  )

  const discordStatus = useMemo(
    () => connections.find((connection) => connection.provider === "discord"),
    [connections]
  )

  const handleGithubConnect = async () => {
    setError(null)
    setConnectState("github")

    try {
      const { authorizeUrl, state } = await startGithubConnection()

      try {
        localStorage.setItem("github_oauth_state", state)
      } catch {
        // Ignore storage errors (private mode, etc.)
      }

      const popup = window.open(
        authorizeUrl,
        "github-oauth",
        "width=600,height=720,noopener,noreferrer"
      )

      if (!popup) {
        window.location.href = authorizeUrl
      } else {
        popup.focus()
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      setError(message)
      setConnectState("idle")
    }
  }

  const handleDiscordConnect = async () => {
    setDiscordError(null)
    setConnectState("discord")

    try {
      const { authorizeUrl, state } = await startDiscordConnection()

      try {
        localStorage.setItem("discord_oauth_state", state)
      } catch {
        // Ignore storage errors (private mode, etc.)
      }

      const popup = window.open(
        authorizeUrl,
        "discord-oauth",
        "width=600,height=720,noopener,noreferrer"
      )

      if (!popup) {
        window.location.href = authorizeUrl
      } else {
        popup.focus()
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      setDiscordError(message)
      setConnectState("idle")
    }
  }

  const isGithubConnected = githubStatus?.connected ?? false
  const isDiscordConnected = discordStatus?.connected ?? false
  const githubConnectedAt = githubStatus?.connectedAt ?? null
  const discordConnectedAt = discordStatus?.connectedAt ?? null

  if (!authUser) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-md space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
                Connectez-vous pour gérer vos services
              </h1>
              <p className="text-foreground/70">
                Ajoutez et contrôlez vos connexions (GitHub, Letterboxd, Slack...) après authentification.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="sm:w-auto">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="sm:w-auto">
                <Link href="/signup">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Gérez vos{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              connexions
            </span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Connectez vos services préférés pour créer des automatisations puissantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-border/60 bg-card/60 backdrop-blur hover:border-primary/60 hover:bg-primary/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background shadow-md">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">GitHub</CardTitle>
                  <CardDescription>Suivez issues, pull requests et releases en temps réel.</CardDescription>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  isGithubConnected
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isGithubConnected ? "Connecté" : "Non connecté"}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-foreground/70 leading-relaxed">
                Autorisez AREA51 à accéder en lecture à vos dépôts publics ou privés. Vous pourrez ensuite déclencher
                des actions dès qu&apos;une issue, un pull request ou une release est créée.
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Autorisation OAuth sécurisée</li>
                <li>• Gestion des areas GitHub dans quelques clics</li>
                <li>• Possibilité d&apos;envoyer des notifications via vos réactions existantes</li>
              </ul>
              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-foreground/60">
                {loading
                  ? "Vérification de votre connexion..."
                  : isGithubConnected
                  ? githubConnectedAt
                    ? `Connecté depuis le ${new Date(githubConnectedAt).toLocaleDateString("fr-FR")}`
                    : "Compte GitHub connecté."
                  : "Aucun compte GitHub lié."}
              </div>
              <Button
                size="lg"
                className="gap-2"
                onClick={handleGithubConnect}
                disabled={connectState === "github"}
              >
                <Github className="h-4 w-4" />
                {connectState === "github"
                  ? "Ouverture de la connexion..."
                  : isGithubConnected
                  ? "Reconnecter GitHub"
                  : "Connecter GitHub"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-border/60 bg-card/60 backdrop-blur hover:border-secondary/60 hover:bg-secondary/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Discord</CardTitle>
                  <CardDescription>Envoyez des messages, embeds ou réactions sur vos serveurs.</CardDescription>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  isDiscordConnected
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isDiscordConnected ? "Connecté" : "Non connecté"}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-foreground/70 leading-relaxed">
                Autorisez AREA51 à accéder à votre compte Discord pour inviter le bot sur vos serveurs. Une fois cette
                étape faite, choisissez le serveur et le salon directement dans la configuration de vos areas (les
                champs `guildId` et `channelId` disposent désormais de listes déroulantes).
              </p>

              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Invitation du bot via OAuth Discord (scopes <code>identify guilds bot</code>).</li>
                <li>• Le statut ci-dessous indique si la connexion est active.</li>
                <li>• Lors de la création d’une area Discord, sélectionnez le serveur et le salon voulus.</li>
              </ul>

              {discordError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {discordError}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-foreground/60">
                {loading
                  ? "Vérification de votre connexion..."
                  : isDiscordConnected
                  ? discordConnectedAt
                    ? `Connecté depuis le ${new Date(discordConnectedAt).toLocaleDateString("fr-FR")}`
                    : "Compte Discord connecté."
                  : "Bot Discord non autorisé."}
              </div>
              <Button
                size="lg"
                variant={isDiscordConnected ? "outline" : "default"}
                className="gap-2"
                onClick={handleDiscordConnect}
                disabled={connectState === "discord"}
              >
                <MessageSquare className="h-4 w-4" />
                {connectState === "discord"
                  ? "Ouverture de la connexion..."
                  : isDiscordConnected
                  ? "Reconnecter Discord"
                  : "Connecter Discord"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
