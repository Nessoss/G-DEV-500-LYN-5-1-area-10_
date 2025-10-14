import { Card } from "@/components/ui/card"
import { Zap, Shield, Code, Users, BarChart3, Sparkles } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Execute workflows in milliseconds with our optimized infrastructure.",
      color: "light-blue",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and advanced access controls.",
      color: "mint",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Full API access, webhooks, and custom code support for advanced use cases.",
      color: "soft-yellow",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share workflows, manage permissions, and collaborate in real-time.",
      color: "light-blue",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track performance, monitor errors, and optimize your automations.",
      color: "mint",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Smart suggestions and AI assistance to build workflows faster.",
      color: "soft-yellow",
    },
  ]

  return (
    <section id="features" className="bg-transparent px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-navy md:text-5xl dark:text-white">
            Everything you need to automate
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Powerful features designed for teams of all sizes. From startups to enterprises, we have the tools you need
            to succeed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="group border-2 border-border bg-card p-8 transition-all hover:border-light-blue hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-light-blue/10 transition-transform group-hover:scale-110 dark:bg-light-blue/20">
                  <Icon className="h-6 w-6 text-light-blue" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-navy dark:text-white">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
