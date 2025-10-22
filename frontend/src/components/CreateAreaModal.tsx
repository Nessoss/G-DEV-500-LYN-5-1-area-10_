"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectDropdown } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getServices, createArea, ApiError } from "@/lib/api"
import type { Service, Action, Reaction } from "@/types/area"
import { cn } from "@/lib/utils"

interface CreateAreaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function CreateAreaModal({ isOpen, onClose, onSubmit }: CreateAreaModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    actionServiceId: null as number | null,
    actionId: null as number | null,
    reactionServiceId: null as number | null,
    reactionId: null as number | null,
    actionConfig: {} as Record<string, unknown>,
    reactionConfig: {} as Record<string, unknown>,
  })

  // Load services on mount
  useEffect(() => {
    if (isOpen) {
      loadServices()
    }
  }, [isOpen])

  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getServices()
      setServices(response.services)
    } catch (err) {
      console.error("Erreur lors du chargement des services:", err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Impossible de charger les services. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedActionService = services.find(s => s.id === formData.actionServiceId)
  const selectedAction = selectedActionService?.actions.find(a => a.id === formData.actionId)
  const selectedReactionService = services.find(s => s.id === formData.reactionServiceId)
  const selectedReaction = selectedReactionService?.reactions.find(r => r.id === formData.reactionId)
  const servicesRequiringConnection = services.filter(
    service => service.requiresConnection && !service.connected
  )
  const missingConnectionNames = servicesRequiringConnection.map(service => service.name).join(", ")
  const needsPlural = servicesRequiringConnection.length > 1

  const makeServiceOption = (service: Service) => ({
    value: service.id.toString(),
    label: service.name,
    disabled: Boolean(service.requiresConnection && !service.connected),
    description:
      service.requiresConnection && !service.connected
        ? "Connectez ce service depuis l’onglet Connexions."
        : undefined,
  })
  const steps: { label: string; status: StepStatus }[] = (() => {
    if (!formData.actionId) {
      return [
        { label: "Déclencheur", status: "current" as StepStatus },
        { label: "Action", status: "upcoming" as StepStatus },
        { label: "Aperçu", status: "upcoming" as StepStatus },
      ]
    }

    if (!formData.reactionId) {
      return [
        { label: "Déclencheur", status: "done" as StepStatus },
        { label: "Action", status: "current" as StepStatus },
        { label: "Aperçu", status: "upcoming" as StepStatus },
      ]
    }

    return [
      { label: "Déclencheur", status: "done" as StepStatus },
      { label: "Action", status: "done" as StepStatus },
      { label: "Aperçu", status: "current" as StepStatus },
    ]
  })()

  const handleSubmit = async () => {
    if (!formData.actionId || !formData.reactionId) {
      setError("Veuillez sélectionner un déclencheur et une action")
      return
    }

    if (!selectedAction || !selectedReaction || !selectedActionService || !selectedReactionService) {
      setError("Sélection invalide")
      return
    }

    if (selectedActionService.requiresConnection && !selectedActionService.connected) {
      setError(`Connectez le service ${selectedActionService.name} avant de l'utiliser.`)
      return
    }

    if (selectedReactionService.requiresConnection && !selectedReactionService.connected) {
      setError(`Connectez le service ${selectedReactionService.name} avant de l'utiliser.`)
      return
    }

    // Generate area name
    const areaName = `${selectedActionService.name} → ${selectedReactionService.name}`

    try {
      setSubmitting(true)
      setError(null)

      await createArea({
        name: areaName,
        actionId: formData.actionId,
        reactionId: formData.reactionId,
        actionConfig: formData.actionConfig,
        reactionConfig: formData.reactionConfig,
      })

      // Reset form
      setFormData({
        actionServiceId: null,
        actionId: null,
        reactionServiceId: null,
        reactionId: null,
        actionConfig: {},
        reactionConfig: {},
      })

      onSubmit()
    } catch (err) {
      console.error("Erreur lors de la création de l'area:", err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Impossible de créer l'area. Veuillez réessayer.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      actionServiceId: null,
      actionId: null,
      reactionServiceId: null,
      reactionId: null,
      actionConfig: {},
      reactionConfig: {},
    })
    setError(null)
    onClose()
  }

  // Generate options for dropdowns
  const serviceOptions = services.map(makeServiceOption)

  const actionOptions = selectedActionService?.actions.map(action => ({
    value: action.id.toString(),
    label: action.description || action.key
  })) || []

  const reactionServiceOptions = services.map(makeServiceOption)

  const reactionOptions = selectedReactionService?.reactions.map(reaction => ({
    value: reaction.id.toString(),
    label: reaction.description || reaction.key
  })) || []

  // Generate area name
  const generatedName = selectedActionService && selectedReactionService
    ? `${selectedActionService.name} → ${selectedReactionService.name}`
    : ""

  const generatedDescription = selectedAction && selectedReaction && selectedActionService && selectedReactionService
    ? `Quand "${selectedAction.description}" sur ${selectedActionService.name}, alors "${selectedReaction.description}" sur ${selectedReactionService.name}`
    : ""

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Créer une nouvelle Area</CardTitle>
              <CardDescription>
                Configurez votre automatisation
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-8">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground/70">Chargement des services...</p>
              </div>
            ) : (
              <>
                {servicesRequiringConnection.length > 0 && (
                  <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide">Connexion requise</p>
                      <p className="text-foreground/80">
                        {missingConnectionNames} {needsPlural ? "nécessitent" : "nécessite"} une connexion active.
                        Ouvrez la page Connexions pour lier {needsPlural ? "ces services" : "ce service"} avant de les utiliser.
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="sm:shrink-0">
                      <Link href="/connections" target="_blank" rel="noreferrer">
                        Gérer mes connexions
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {steps.map((step, index) => (
                      <div
                        key={step.label}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/60"
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors",
                            step.status === "done" &&
                              "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:border-emerald-400 dark:text-emerald-200",
                            step.status === "current" &&
                              "border-primary bg-primary/10 text-primary dark:border-primary/70",
                            step.status === "upcoming" && "border-border text-foreground/40"
                          )}
                        >
                          {index + 1}
                        </span>
                        <span
                          className={cn(
                            "text-sm",
                            step.status === "done" && "text-emerald-600 dark:text-emerald-200",
                            step.status === "current" && "text-primary",
                            step.status === "upcoming" && "text-foreground/60"
                          )}
                        >
                          {step.label}
                        </span>
                        {index < steps.length - 1 && (
                          <span className="mx-3 hidden h-px w-12 bg-border/60 sm:block" aria-hidden />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Déclencheur */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">🔔 Déclencheur (QUAND)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Service</label>
                      <SelectDropdown
                        options={serviceOptions}
                        value={formData.actionServiceId?.toString() || ""}
                        onValueChange={(value: string) => setFormData({
                          ...formData,
                          actionServiceId: parseInt(value),
                          actionId: null,
                          actionConfig: {}
                        })}
                        placeholder="Choisir un service..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Déclencheur</label>
                      <SelectDropdown
                        options={actionOptions}
                        value={formData.actionId?.toString() || ""}
                        onValueChange={(value: string) => setFormData({
                          ...formData,
                          actionId: parseInt(value),
                          actionConfig: {}
                        })}
                        placeholder="Choisir un déclencheur..."
                        disabled={!formData.actionServiceId}
                      />
                    </div>
                  </div>

                  {/* Configuration dynamique pour l'action */}
                  {selectedAction?.configSchema && (
                    <div className="space-y-3 mt-4 p-4 rounded-lg bg-muted/50">
                      <h4 className="text-sm font-semibold">Configuration</h4>
                      {renderConfigFields(selectedAction, formData.actionConfig, (config) => {
                        setFormData({ ...formData, actionConfig: config })
                      })}
                    </div>
                  )}
                </div>

                {/* Flèche */}
                <div className="flex justify-center">
                  <div className="text-4xl text-foreground/60 font-bold">↓</div>
                </div>

                {/* Section Réaction */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary">⚡ Action (ALORS)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Service</label>
                      <SelectDropdown
                        options={reactionServiceOptions}
                        value={formData.reactionServiceId?.toString() || ""}
                        onValueChange={(value: string) => setFormData({
                          ...formData,
                          reactionServiceId: parseInt(value),
                          reactionId: null,
                          reactionConfig: {}
                        })}
                        placeholder="Choisir un service..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Action</label>
                      <SelectDropdown
                        options={reactionOptions}
                        value={formData.reactionId?.toString() || ""}
                        onValueChange={(value: string) => setFormData({
                          ...formData,
                          reactionId: parseInt(value),
                          reactionConfig: {}
                        })}
                        placeholder="Choisir une action..."
                        disabled={!formData.reactionServiceId}
                      />
                    </div>
                  </div>

                  {/* Configuration dynamique pour la réaction */}
                  {selectedReaction?.configSchema && (
                    <div className="space-y-3 mt-4 p-4 rounded-lg bg-muted/50">
                      <h4 className="text-sm font-semibold">Configuration</h4>
                      {renderConfigFields(selectedReaction, formData.reactionConfig, (config) => {
                        setFormData({ ...formData, reactionConfig: config })
                      })}
                    </div>
                  )}
                </div>

                {/* Aperçu en temps réel */}
                {generatedName && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">📋 Aperçu</h3>
                    <Card className="border-2 border-dashed border-primary/30">
                      <CardHeader>
                        <CardTitle className="text-lg">{generatedName}</CardTitle>
                        <CardDescription>{generatedDescription}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                )}

                {/* Boutons */}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleClose} disabled={submitting}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.actionId || !formData.reactionId || submitting}
                  >
                    {submitting ? "Création..." : "Créer l'Area"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper function to render config fields based on JSON schema
function renderConfigFields(
  actionOrReaction: Action | Reaction,
  config: Record<string, unknown>,
  onChange: (config: Record<string, unknown>) => void
) {
  const schema = actionOrReaction.configSchema
  if (!schema || !schema.properties) return null

  return Object.entries(schema.properties).map(([key, prop]) => {
    const isRequired = schema.required?.includes(key) || false
    const value = config[key] || prop.default || ""

    if (prop.type === "string") {
      if (prop.enum) {
        // Dropdown for enum values
        return (
          <div key={key}>
            <Label htmlFor={key}>
              {prop.description || key} {isRequired && <span className="text-destructive">*</span>}
            </Label>
            <SelectDropdown
              options={prop.enum.map((v: string) => ({ value: v, label: v }))}
              value={String(value)}
              onValueChange={(val: string) => onChange({ ...config, [key]: val })}
              placeholder={`Choisir ${prop.description || key}...`}
            />
          </div>
        )
      }

      // Text input
      return (
        <div key={key}>
          <Label htmlFor={key}>
            {prop.description || key} {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={key}
            type={prop.format === "uri" ? "url" : "text"}
            placeholder={prop.description || key}
            value={String(value)}
            onChange={(e) => onChange({ ...config, [key]: e.target.value })}
            required={isRequired}
          />
        </div>
      )
    }

    if (prop.type === "number") {
      return (
        <div key={key}>
          <Label htmlFor={key}>
            {prop.description || key} {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={key}
            type="number"
            placeholder={prop.description || key}
            value={Number(value) || ""}
            onChange={(e) => onChange({ ...config, [key]: parseFloat(e.target.value) })}
            min={prop.minimum}
            max={prop.maximum}
            required={isRequired}
          />
        </div>
      )
    }

    if (prop.type === "boolean") {
      return (
        <div key={key} className="flex items-center gap-2">
          <Checkbox
            id={key}
            checked={Boolean(value)}
            onCheckedChange={(checked: boolean) => onChange({ ...config, [key]: Boolean(checked) })}
          />
          <Label htmlFor={key} className="cursor-pointer">
            {prop.description || key}
          </Label>
        </div>
      )
    }

    return null
  })
}
type StepStatus = "done" | "current" | "upcoming"
