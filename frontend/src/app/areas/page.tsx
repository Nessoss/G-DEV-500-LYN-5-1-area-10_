"use client"

import { useState, useEffect } from "react"
import { Plus, Power, PowerOff, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CreateAreaModal } from "@/components/CreateAreaModal"
import { getAreas, updateAreaStatus, ApiError } from "@/lib/api"
import type { Area } from "@/types/area"

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAreas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAreas()
      setAreas(response.areas)
    } catch (err) {
      console.error("Erreur lors du chargement des areas:", err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Impossible de charger les areas. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAreas()
  }, [])

  const toggleAreaStatus = async (areaId: number) => {
    const area = areas.find(a => a.id === areaId)
    if (!area) return

    try {
      const updatedArea = await updateAreaStatus(areaId, { enabled: !area.enabled })
      setAreas(prevAreas =>
        prevAreas.map(a =>
          a.id === areaId ? updatedArea : a
        )
      )
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'area:", err)
      if (err instanceof ApiError) {
        alert(`Erreur: ${err.message}`)
      } else {
        alert("Impossible de mettre à jour l'area. Veuillez réessayer.")
      }
    }
  }

  const handleCreateArea = async () => {
    // Reload areas after creation
    await loadAreas()
    setIsCreateModalOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-foreground/70">Chargement de vos areas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="mb-4 text-destructive text-6xl">⚠️</div>
            <h2 className="text-2xl font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-foreground/70 mb-6">{error}</p>
            <Button onClick={loadAreas}>Réessayer</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Fond gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Mes 
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {" "}Areas
            </span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Gérez vos automatisations et créez de nouvelles connections entre vos applications
          </p>
        </div>

        {/* Bouton de création si aucune area */}
        {areas.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Aucune area créée
              </h2>
              <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                Commencez par créer votre première automatisation pour connecter vos applications préférées
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Créer une Area
            </Button>
          </div>
        ) : (
          <>
            {/* Bouton de création d'area */}
            <div className="flex justify-center mb-12">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Nouvelle Area
              </Button>
            </div>

            {/* Grille des areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {areas.map((area) => (
                <Card
                  key={area.id}
                  className={`border-2 hover-lift w-full bg-card/50 backdrop-blur ${
                    area.enabled
                      ? 'hover:border-primary/70 hover:bg-primary/5 dark:hover:bg-primary/10'
                      : 'hover:border-orange-400/70 hover:bg-orange-50/30 dark:hover:bg-orange-900/20'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex-shrink-0">
                          <Settings className="h-6 w-6 text-primary hover:rotate-12 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-semibold truncate">{area.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                              area.enabled
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {area.enabled ? '● Actif' : '○ Inactif'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-4 text-base leading-relaxed">
                      Quand &quot;{area.action.description}&quot; sur {area.action.service.name}, alors &quot;{area.reaction.description}&quot; sur {area.reaction.service.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 pb-6">
                    <div className="space-y-6">
                      {/* Action */}
                      <div className="rounded-xl border-2 border-primary/20 p-4 bg-primary/10 dark:bg-primary/5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                            🔔 Déclencheur
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-lg">{area.action.service.name}</p>
                          <p className="text-foreground/70 mt-1">{area.action.description}</p>
                        </div>
                      </div>

                      {/* Flèche */}
                      <div className="flex justify-center">
                        <div className="text-2xl text-foreground/60 font-bold">↓</div>
                      </div>

                      {/* Reaction */}
                      <div className="rounded-xl border-2 border-secondary/20 p-4 bg-secondary/10 dark:bg-secondary/5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-wide">
                            ⚡ Action
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-lg">{area.reaction.service.name}</p>
                          <p className="text-foreground/70 mt-1">{area.reaction.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-foreground/70">
                      Créé le {new Date(area.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <Button
                      variant={area.enabled ? "default" : "outline"}
                      size="default"
                      onClick={() => toggleAreaStatus(area.id)}
                      className="gap-2 min-w-[80px]"
                    >
                      {area.enabled ? (
                        <>
                          <Power className="h-4 w-4" />
                          ON
                        </>
                      ) : (
                        <>
                          <PowerOff className="h-4 w-4" />
                          OFF
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de création */}
      <CreateAreaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateArea}
      />
      {/* Footer */}
      <footer className="border-t relative">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-foreground/70">
            © 2025 AREA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
