"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirection après connexion réussie
        window.location.href = "/areas"
      } else {
        alert(data.error || "Erreur de connexion")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <p className="text-left text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
