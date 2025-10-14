"use client"

import { Card } from "@/components/ui/card"
import { Server, Zap, Lock, Globe2, Clock, TrendingUp } from "lucide-react"

const specs = [
  {
    icon: Zap,
    title: "Performance",
    items: [
      { label: "Execution time", value: "<1 second" },
      { label: "Guaranteed uptime", value: "99.9%" },
      { label: "Requests per second", value: "10,000+" },
    ],
  },
  {
    icon: Server,
    title: "Infrastructure",
    items: [
      { label: "Regions", value: "Multi-region" },
      { label: "Auto-scaling", value: "Automatic" },
      { label: "CDN", value: "Global" },
    ],
  },
  {
    icon: Lock,
    title: "Security",
    items: [
      { label: "Encryption", value: "AES-256" },
      { label: "Compliance", value: "GDPR, ISO 27001" },
      { label: "Authentication", value: "OAuth 2.0" },
    ],
  },
  {
    icon: Globe2,
    title: "Availability",
    items: [
      { label: "Data centers", value: "EU, US, APAC" },
      { label: "Support", value: "24/7" },
      { label: "Languages", value: "15+" },
    ],
  },
  {
    icon: Clock,
    title: "Usage limits",
    items: [
      { label: "Workflows", value: "Unlimited" },
      { label: "Runs per month", value: "100,000+" },
      { label: "Integrations", value: "500+" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Monitoring",
    items: [
      { label: "Real-time logs", value: "Yes" },
      { label: "Analytics", value: "Advanced" },
      { label: "Alerts", value: "Customizable" },
    ],
  },
]

export function TechnicalSpecs() {
  return (
    <section className="bg-transparent px-4 py-24 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Technical </span>
              <span className="bg-gradient-to-r from-soft-yellow to-light-blue bg-clip-text text-transparent">
                specifications
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A resilient infrastructure built for mission-critical automations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((spec, index) => {
              const Icon = spec.icon
              return (
                <Card key={index} className="p-6 border-2 hover:border-light-blue/50 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-light-blue/10">
                      <Icon className="w-5 h-5 text-light-blue" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{spec.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {spec.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
            {["ISO 27001", "GDPR", "SOC 2", "HTTPS"].map((badge, i) => (
              <div key={i} className="px-6 py-3 rounded-lg bg-muted border-2 border-border">
                <span className="font-semibold text-foreground">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
