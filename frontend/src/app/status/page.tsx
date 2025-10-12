import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Globe, Shield, Zap, RefreshCw, ExternalLink, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatusPage() {
  const overallStatus = {
    status: "Opérationnel",
    color: "green",
    message: "Tous les systèmes fonctionnent normalement",
    lastUpdate: "Il y a 2 minutes"
  };

  const services = [
    {
      name: "API AREA Core",
      description: "API principale et logique métier",
      status: "Opérationnel",
      uptime: "99.98%",
      responseTime: "45ms",
      color: "green",
      icon: Server,
      details: "Réponses rapides et stables sur tous les endpoints"
    },
    {
      name: "Dashboard Web",
      description: "Interface utilisateur et application web",
      status: "Opérationnel", 
      uptime: "99.95%",
      responseTime: "1.2s",
      color: "green",
      icon: Globe,
      details: "Chargement optimal des pages et fonctionnalités"
    },
    {
      name: "Base de données",
      description: "Stockage et récupération des données",
      status: "Opérationnel",
      uptime: "99.99%",
      responseTime: "12ms",
      color: "green",
      icon: Database,
      details: "Performances excellentes et sauvegarde automatique"
    },
    {
      name: "Système d&apos;authentification",
      description: "Connexion et gestion des comptes",
      status: "Opérationnel",
      uptime: "99.97%", 
      responseTime: "89ms",
      color: "green",
      icon: Shield,
      details: "OAuth et JWT fonctionnent parfaitement"
    },
    {
      name: "Moteur d&apos;exécution",
      description: "Traitement des automatisations",
      status: "Ralentissement mineur",
      uptime: "99.87%",
      responseTime: "234ms",
      color: "yellow",
      icon: Zap,
      details: "Léger ralentissement détecté, équipes informées"
    },
    {
      name: "Intégrations Gmail",
      description: "Connecteur Gmail et API Google",
      status: "Opérationnel",
      uptime: "99.92%",
      responseTime: "156ms", 
      color: "green",
      icon: Activity,
      details: "Synchronisation stable avec les serveurs Google"
    },
    {
      name: "Intégrations Slack",
      description: "Connecteur Slack et webhooks",
      status: "Opérationnel",
      uptime: "99.94%",
      responseTime: "98ms",
      color: "green", 
      icon: Activity,
      details: "Messages et notifications envoyés sans délai"
    },
    {
      name: "Webhooks externes",
      description: "API webhooks et intégrations tierces",
      status: "Opérationnel",
      uptime: "99.91%",
      responseTime: "187ms",
      color: "green",
      icon: ExternalLink,
      details: "Toutes les intégrations personnalisées actives"
    }
  ];

  const recentIncidents = [
    {
      id: 1,
      title: "Ralentissement du moteur d&apos;exécution",
      description: "Légère dégradation des performances sur le traitement des automatisations",
      status: "En cours d&apos;investigation",
      severity: "Mineur",
      startTime: "10 oct. 2025, 14:30",
      duration: "En cours (2h 15min)",
      affected: ["Moteur d&apos;exécution"],
      updates: [
        {
          time: "16:45",
          message: "Équipe technique mobilisée, identification de la cause en cours"
        },
        {
          time: "15:20", 
          message: "Ralentissement détecté et confirmé sur le moteur d&apos;exécution"
        },
        {
          time: "14:30",
          message: "Premières alertes reçues de nos systèmes de monitoring"
        }
      ]
    },
    {
      id: 2,
      title: "Maintenance programmée - Base de données",
      description: "Mise à jour de sécurité et optimisation des performances",
      status: "Terminé",
      severity: "Maintenance",
      startTime: "8 oct. 2025, 02:00", 
      duration: "2h 30min",
      affected: ["Base de données", "API AREA Core"],
      updates: [
        {
          time: "04:30",
          message: "✅ Maintenance terminée avec succès, tous les services restaurés"
        },
        {
          time: "03:15",
          message: "🔧 Mise à jour en cours, temps de réponse légèrement augmenté"
        },
        {
          time: "02:00",
          message: "🚀 Début de la fenêtre de maintenance programmée"
        }
      ]
    }
  ];

  const metrics = [
    {
      name: "Uptime global",
      value: "99.94%",
      period: "30 derniers jours",
      icon: CheckCircle,
      color: "green"
    },
    {
      name: "Temps de réponse moyen",
      value: "127ms", 
      period: "24 dernières heures",
      icon: Clock,
      color: "green"
    },
    {
      name: "Automatisations exécutées",
      value: "2.4M",
      period: "Cette semaine",
      icon: Zap,
      color: "blue"
    },
    {
      name: "Incidents résolus",
      value: "< 4h",
      period: "Temps moyen de résolution",
      icon: RefreshCw,
      color: "green"
    }
  ];

  const maintenanceSchedule = [
    {
      title: "Mise à jour sécuritaire des serveurs",
      description: "Application des derniers correctifs de sécurité sur nos serveurs de production",
      date: "15 octobre 2025",
      time: "02:00 - 04:00 CET", 
      impact: "Pas d&apos;interruption de service prévue",
      affected: ["API AREA Core", "Dashboard Web"]
    },
    {
      title: "Optimisation base de données",
      description: "Amélioration des performances et nettoyage des données obsolètes",
      date: "22 octobre 2025",
      time: "01:00 - 03:30 CET",
      impact: "Ralentissements possibles (< 2 minutes)",
      affected: ["Base de données", "Moteur d&apos;exécution"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'opérationnel':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'ralentissement mineur':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'panne partielle':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'panne majeure':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'opérationnel':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ralentissement mineur':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'panne partielle':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      case 'panne majeure':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fond gradient global uniforme */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 -z-10" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Statut des
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}services
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 max-w-3xl mx-auto text-foreground/80">
              Surveillance en temps réel de tous nos systèmes. 
              Transparence totale sur la disponibilité de nos services.
            </p>
          </div>
        </div>
      </section>

      {/* Overall Status */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card className={`border-2 ${overallStatus.color === 'green' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${overallStatus.color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {overallStatus.color === 'green' ? 
                      <CheckCircle className="h-8 w-8 text-green-600" /> :
                      <XCircle className="h-8 w-8 text-red-600" />
                    }
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{overallStatus.status}</h2>
                    <p className="text-lg text-foreground/80">{overallStatus.message}</p>
                    <p className="text-sm text-foreground/70 mt-1">Dernière vérification : {overallStatus.lastUpdate}</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-${metric.color === 'green' ? 'green' : metric.color === 'blue' ? 'blue' : 'gray'}-100 flex items-center justify-center mb-4`}>
                    <metric.icon className={`h-6 w-6 text-${metric.color === 'green' ? 'green' : metric.color === 'blue' ? 'blue' : 'gray'}-600`} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="text-sm text-foreground/70">{metric.name}</div>
                  <div className="text-xs text-foreground/50 mt-1">{metric.period}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              État des services
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Surveillance détaillée de chaque composant de notre infrastructure
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <p className="text-sm text-foreground/70">{service.description}</p>
                        <p className="text-xs text-foreground/60 mt-1">{service.details}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-foreground/70">Disponibilité</p>
                        <p className="font-bold text-foreground">{service.uptime}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-foreground/70">Temps réponse</p>
                        <p className="font-bold text-foreground">{service.responseTime}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="text-sm font-medium">{service.status}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Incidents récents
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Historique des incidents et maintenances des 7 derniers jours
            </p>
          </div>

          <div className="space-y-6">
            {recentIncidents.map((incident, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          incident.status === 'En cours d\'investigation' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {incident.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.severity === 'Maintenance' ? 'bg-blue-100 text-blue-800' :
                          incident.severity === 'Mineur' ? 'bg-yellow-100 text-yellow-800' :
                          incident.severity === 'Majeur' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <CardDescription className="text-base">{incident.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-foreground/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{incident.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{incident.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Services affectés:</h4>
                      <div className="flex flex-wrap gap-2">
                        {incident.affected.map((service, serviceIndex) => (
                          <span key={serviceIndex} className="text-xs bg-muted px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3">Mises à jour:</h4>
                      <div className="space-y-2">
                        {incident.updates.map((update, updateIndex) => (
                          <div key={updateIndex} className="flex gap-3 text-sm">
                            <span className="text-foreground/60 font-mono min-w-[45px]">{update.time}</span>
                            <span className="text-foreground/80">{update.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir l&apos;historique complet
            </Button>
          </div>
        </div>
      </section>

      {/* Scheduled Maintenance */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Maintenances programmées
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Interventions prévues sur notre infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maintenanceSchedule.map((maintenance, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{maintenance.title}</CardTitle>
                      <CardDescription>{maintenance.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Date :</span>
                      <span className="font-medium">{maintenance.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Heure :</span>
                      <span className="font-medium">{maintenance.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Impact :</span>
                      <span className="font-medium text-green-600">{maintenance.impact}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Services concernés :</h4>
                    <div className="flex flex-wrap gap-1">
                      {maintenance.affected.map((service, serviceIndex) => (
                        <span key={serviceIndex} className="text-xs bg-muted px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-24 sm:py-32 relative bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Restez informés
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Recevez les notifications d&apos;incidents et de maintenance par email ou SMS.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button size="lg" className="gap-2">
                S&apos;abonner aux alertes
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                API Status
              </Button>
            </div>
            <p className="mt-6 text-sm text-foreground/70">
              Vous pouvez également suivre ce status via notre API REST ou nos webhooks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t relative">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-foreground/70">
            © 2025 AREA. Tous droits réservés. • 
            <span className="mx-2">•</span>
            Page de statut mise à jour automatiquement toutes les minutes
          </p>
        </div>
      </footer>
    </div>
  );
}
