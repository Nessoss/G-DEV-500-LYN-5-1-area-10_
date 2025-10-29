'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Settings } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  createdAt: string
  roles: string[]
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setError('Non connecté')
          setLoading(false)
          return
        }

        // Pour l'instant, on simule les données du profil
        // TODO: Remplacer par un vrai appel API quand l'endpoint sera disponible
        setProfile({
          id: '1',
          email: 'area51tek3@gmail.com',
          createdAt: new Date().toISOString(),
          roles: ['user']
        })
      } catch {
        setError('Erreur lors du chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error}</div>
            <div className="mt-4 text-center">
              <Button onClick={() => window.location.href = '/login'}>
                Se connecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">Profil non trouvé</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{profile.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Membre depuis</div>
                  <div className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Rôles</div>
                  <div className="flex gap-2 mt-1">
                    {profile.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/connections'}
              >
                Gérer mes connexions
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/areas'}
              >
                Mes automatisations
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/settings'}
              >
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Connexions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Automatisations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Exécutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Services</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
