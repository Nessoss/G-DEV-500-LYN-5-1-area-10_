"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Slack, Database, CheckCircle2, ArrowRight } from "lucide-react"

const workflows = [
  {
    id: "email",
    name: "Email Marketing",
    trigger: { icon: Mail, label: "New contact", color: "light-blue" },
    actions: [
      { icon: Database, label: "Add to CRM", color: "mint" },
      { icon: Mail, label: "Send welcome email", color: "soft-yellow" },
      { icon: Slack, label: "Notify the team", color: "light-blue" },
    ],
  },
  {
    id: "support",
    name: "Customer Support",
    trigger: { icon: Mail, label: "Ticket received", color: "mint" },
    actions: [
      { icon: Slack, label: "Alert support squad", color: "light-blue" },
      { icon: Database, label: "Create helpdesk ticket", color: "soft-yellow" },
      { icon: Mail, label: "Send customer confirmation", color: "mint" },
    ],
  },
  {
    id: "sales",
    name: "Sales Handoff",
    trigger: { icon: Database, label: "New lead", color: "soft-yellow" },
    actions: [
      { icon: Mail, label: "Send automated email", color: "light-blue" },
      { icon: Database, label: "Score the lead", color: "mint" },
      { icon: Slack, label: "Notify account owner", color: "soft-yellow" },
    ],
  },
]

export function InteractiveDemo() {
  const [activeWorkflow, setActiveWorkflow] = useState(workflows[0])

  return (
    <section className="bg-transparent px-4 py-24 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">See the </span>
              <span className="bg-gradient-to-r from-mint to-soft-yellow bg-clip-text text-transparent">
                magic in action
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore how to build powerful automations in just a few clicks
            </p>
          </div>

          {/* Workflow selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {workflows.map((workflow) => (
              <Button
                key={workflow.id}
                variant={activeWorkflow.id === workflow.id ? "default" : "outline"}
                onClick={() => setActiveWorkflow(workflow)}
                className="transition-all"
              >
                {workflow.name}
              </Button>
            ))}
          </div>

          {/* Visual workflow */}
          <Card className="p-8 md:p-12 border-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Trigger */}
              <div className="flex flex-col items-center">
                <div
                  className={`p-6 rounded-2xl bg-${activeWorkflow.trigger.color}/10 border-2 border-${activeWorkflow.trigger.color}/30 mb-3`}
                >
                  <activeWorkflow.trigger.icon className={`w-8 h-8 text-${activeWorkflow.trigger.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{activeWorkflow.trigger.label}</span>
                <span className="text-xs text-muted-foreground mt-1">Trigger</span>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-6">
                {activeWorkflow.actions.map((action, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`p-5 rounded-xl bg-${action.color}/10 border-2 border-${action.color}/30 mb-3 relative`}
                    >
                      <action.icon className={`w-7 h-7 text-${action.color}`} />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-mint rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">Action {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This workflow runs automatically every time the trigger fires
              </p>
              <Button variant="outline" className="gap-2 bg-transparent">
                Create this workflow
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
