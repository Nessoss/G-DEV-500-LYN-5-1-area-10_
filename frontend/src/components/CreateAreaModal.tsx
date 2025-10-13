"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectDropdown } from "@/components/ui/select"

interface CreateAreaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (area: {
    name: string
    description: string
    action: { service: string; trigger: string; config?: Record<string, any> }
    reaction: { service: string; action: string; config?: Record<string, any> }
    isActive: boolean
  }) => void
}

// Configuration des champs requis pour chaque service
const serviceConfigs = {
  Weather: {
    actionFields: {
      "Vérifier la météo": [
        { key: "city", label: "Ville", type: "text", placeholder: "Lyon" }
      ],
      "Il pleut": [
        { key: "city", label: "Ville", type: "text", placeholder: "Lyon" }
      ]
    },
    reactionFields: {}
  },
  Discord: {
    actionFields: {},
    reactionFields: {
      "Envoyer un message": [
        { key: "webhookUrl", label: "Webhook URL", type: "url", placeholder: "https://discord.com/api/webhooks/..." },
        { key: "message", label: "Message", type: "text", placeholder: "Message à envoyer" }
      ],
      "Envoyer une alerte météo": [
        { key: "webhookUrl", label: "Webhook URL", type: "url", placeholder: "https://discord.com/api/webhooks/..." }
      ]
    }
  }
}

// Services disponibles avec leurs déclencheurs et actions
const services = {
  Gmail: {
    triggers: ["Nouvel email reçu", "Email d&apos;un expéditeur spécifique", "Email avec un mot-clé"],
    actions: ["Envoyer un email", "Marquer comme lu", "Archiver"]
  },
  Weather: {
    triggers: ["Vérifier la météo", "Il pleut"],
    actions: []
  },
  Discord: {
    triggers: ["Nouveau message dans un channel", "Mention utilisateur", "Nouveau membre"],
    actions: ["Envoyer un message", "Envoyer une alerte météo", "Créer un channel", "Bannir un utilisateur"]
  },
  Spotify: {
    triggers: ["Nouvelle chanson", "Playlist modifiée", "Artiste aimé"],
    actions: ["Jouer une playlist", "Mettre en pause", "Changer de chanson"]
  },
  "Philips Hue": {
    triggers: ["Mouvement détecté", "Changement d&apos;intensité"],
    actions: ["Changer la couleur", "Allumer/Éteindre", "Modifier la luminosité"]
  },
  Slack: {
    triggers: ["Nouveau message", "Mention dans un channel", "Statut changé"],
    actions: ["Envoyer un message", "Changer le statut", "Créer un channel"]
  },
  YouTube: {
    triggers: ["Nouvelle vidéo d&apos;un channel", "Vidéo ajoutée aux favoris"],
    actions: ["Télécharger une vidéo", "Ajouter à une playlist"]
  }
}

// Fonction pour générer le nom automatiquement
const generateAreaName = (actionService: string, reactionService: string): string => {
  if (!actionService || !reactionService) return ""
  return `${actionService} → ${reactionService}`
}

// Fonction pour générer la description automatiquement
const generateAreaDescription = (actionService: string, actionTrigger: string, reactionService: string, reactionAction: string): string => {
  if (!actionService || !actionTrigger || !reactionService || !reactionAction) return ""
  return `Quand "${actionTrigger}" sur ${actionService}, alors "${reactionAction}" sur ${reactionService}`
}

export function CreateAreaModal({ isOpen, onClose, onSubmit }: CreateAreaModalProps) {
  const [formData, setFormData] = useState({
    action: { service: "", trigger: "", config: {} },
    reaction: { service: "", action: "", config: {} }
  })

  // Génération automatique du nom et de la description
  const generatedName = generateAreaName(
    formData.action.service, 
    formData.reaction.service
  )
  
  const generatedDescription = generateAreaDescription(
    formData.action.service, 
    formData.action.trigger, 
    formData.reaction.service, 
    formData.reaction.action
  )

  const handleSubmit = () => {
    if (formData.action.service && formData.action.trigger && formData.reaction.service && formData.reaction.action) {
      onSubmit({
        name: generatedName,
        description: generatedDescription,
        action: formData.action,
        reaction: formData.reaction,
        isActive: true
      })
      
      // Reset form
      setFormData({
        action: { service: "", trigger: "", config: {} },
        reaction: { service: "", action: "", config: {} }
      })
    }
  }

  const handleClose = () => {
    setFormData({
      action: { service: "", trigger: "", config: {} },
      reaction: { service: "", action: "", config: {} }
    })
    onClose()
  }

  // Options pour les dropdowns
  const serviceOptions = Object.keys(services).map(service => ({
    value: service,
    label: service
  }))
  
  // Debug: log services for troubleshooting
  console.log('Available services:', Object.keys(services))
  console.log('Service options:', serviceOptions)

  const triggerOptions = formData.action.service 
    ? services[formData.action.service as keyof typeof services].triggers.map(trigger => ({
        value: trigger,
        label: trigger
      }))
    : []

  const reactionServiceOptions = Object.keys(services).map(service => ({
    value: service,
    label: service
  }))

  const actionOptions = formData.reaction.service
    ? services[formData.reaction.service as keyof typeof services].actions.map(action => ({
        value: action,
        label: action
      }))
    : []

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
                Configurez votre automatisation avec des menus déroulants
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Section Déclencheur */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">🔔 Déclencheur (QUAND)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service</label>
                  <SelectDropdown
                    options={serviceOptions}
                    value={formData.action.service}
                    onValueChange={(value: string) => setFormData({
                      ...formData,
                      action: { service: value, trigger: "", config: {} }
                    })}
                    placeholder="Choisir un service..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Déclencheur</label>
                  <SelectDropdown
                    options={triggerOptions}
                    value={formData.action.trigger}
                    onValueChange={(value: string) => setFormData({
                      ...formData,
                      action: { ...formData.action, trigger: value }
                    })}
                    placeholder="Choisir un déclencheur..."
                    disabled={!formData.action.service}
                  />
                </div>
              </div>
              
              {/* Champs de configuration pour l'action */}
              {formData.action.service === "Weather" && formData.action.trigger && (
                <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-sm text-primary">Configuration</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ville</label>
                    <input
                      type="text"
                      placeholder="Lyon"
                      value={(formData.action.config as any).city || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        action: {
                          ...formData.action,
                          config: { ...formData.action.config, city: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    />
                  </div>
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
                    value={formData.reaction.service}
                    onValueChange={(value: string) => setFormData({
                      ...formData,
                      reaction: { service: value, action: "", config: {} }
                    })}
                    placeholder="Choisir un service..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Action</label>
                  <SelectDropdown
                    options={actionOptions}
                    value={formData.reaction.action}
                    onValueChange={(value: string) => setFormData({
                      ...formData,
                      reaction: { ...formData.reaction, action: value }
                    })}
                    placeholder="Choisir une action..."
                    disabled={!formData.reaction.service}
                  />
                </div>
              </div>
              
              {/* Champs de configuration pour la réaction Discord */}
              {formData.reaction.service === "Discord" && formData.reaction.action && (
                <div className="space-y-3 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <h4 className="font-medium text-sm text-secondary">Configuration Discord</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={(formData.reaction.config as any).webhookUrl || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        reaction: {
                          ...formData.reaction,
                          config: { ...formData.reaction.config, webhookUrl: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    />
                  </div>
                  {formData.reaction.action === "Envoyer un message" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        placeholder="Message à envoyer"
                        value={(formData.reaction.config as any).message || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          reaction: {
                            ...formData.reaction,
                            config: { ...formData.reaction.config, message: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        rows={3}
                      />
                    </div>
                  )}
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
              {/* Debug button - temporary */}
              <button 
                type="button" 
                onClick={() => alert(JSON.stringify(Object.keys(services)))}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Debug Services
              </button>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.action.service || !formData.action.trigger || !formData.reaction.service || !formData.reaction.action}
              >
                Créer l&apos;Area
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}