"use client"

import { Zap, Shield, Workflow, Code2, Globe, Gauge } from "lucide-react"
import { Card } from "@/components/ui/card"

const capabilities = [
  {
    icon: Zap,
    title: "Intelligent automation",
    description: "Build complex workflows with our intuitive visual editor. Drag, drop, and connect every step.",
    color: "light-blue",
    features: ["Drag & drop builder", "Ready-made templates", "Integrated AI"],
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description: "Keep data safe with AES-256 encryption, OAuth 2.0, and end-to-end GDPR compliance.",
    color: "mint",
    features: ["End-to-end encryption", "Regular audits", "ISO 27001"],
  },
  {
    icon: Workflow,
    title: "Advanced logic",
    description: "Conditions, loops, filters, and data transforms—everything you need for tailored automation.",
    color: "soft-yellow",
    features: ["If/Then/Else", "For Each loops", "JSON filters"],
  },
  {
    icon: Code2,
    title: "APIs & webhooks",
    description: "Connect any service with custom webhooks and a fully documented SDK.",
    color: "light-blue",
    features: ["REST API", "Webhooks", "JavaScript SDK"],
  },
  {
    icon: Globe,
    title: "Multi-region",
    description: "Distributed global infrastructure keeps data in the region you choose.",
    color: "mint",
    features: ["EU, US, APAC", "Latency <50ms", "Global CDN"],
  },
  {
    icon: Gauge,
    title: "Extreme performance",
    description: "Instant execution, auto-scaling, and real-time monitoring for every workflow.",
    color: "soft-yellow",
    features: ["<1s execution", "Auto-scaling", "24/7 monitoring"],
  },
]

export function CapabilitiesShowcase() {
  return (
    <section className="bg-transparent px-4 py-24 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Everything you need,</span>
              <br />
              <span className="bg-gradient-to-r from-light-blue to-mint bg-clip-text text-transparent">
                and so much more
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform that grows alongside your ambitions
            </p>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-2 hover:border-light-blue/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-6"
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${capability.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-${capability.color}/10 mb-4`}>
                      <Icon className={`w-6 h-6 text-${capability.color}`} />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-foreground">{capability.title}</h3>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{capability.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {capability.features.map((feature, i) => (
                        <span
                          key={i}
                          className={`text-xs px-3 py-1 rounded-full bg-${capability.color}/10 text-foreground font-medium`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
