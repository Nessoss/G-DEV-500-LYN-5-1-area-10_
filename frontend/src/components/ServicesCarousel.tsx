'use client'

import { useState, useRef } from "react"

const services = [
  { emoji: "📧", name: "Gmail" },
  { emoji: "📮", name: "Outlook" },
  { emoji: "🐙", name: "GitHub" },
  { emoji: "💬", name: "Discord" },
  { emoji: "💼", name: "Slack" },
  { emoji: "📝", name: "Notion" },
  { emoji: "⏱️", name: "Timer" },
  { emoji: "🕐", name: "Horloge" },
  { emoji: "🏃", name: "Strava" },
  { emoji: "🎬", name: "Letterboxd" },
  { emoji: "📦", name: "Dropbox" },
  { emoji: "☁️", name: "OneDrive" },
  { emoji: "🎵", name: "Spotify" },
  { emoji: "🌤️", name: "Météo" },
  { emoji: "📋", name: "Trello" },
]

export default function ServicesCarousel() {
  const [carouselSpeed, setCarouselSpeed] = useState(40)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return

    const rect = carouselRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const position = x / width // 0 à 1

    // Position à gauche = accélération vers la gauche (vitesse plus rapide)
    // Position à droite = accélération vers la droite (vitesse négative/inverse)
    // Centre = pause
    if (position < 0.4) {
      // Gauche: accélération (vitesse de 10s à 20s)
      setCarouselSpeed(10 + (position / 0.4) * 10)
    } else if (position > 0.6) {
      // Droite: ralentissement ou inversion
      const rightPos = (position - 0.6) / 0.4
      setCarouselSpeed(20 - rightPos * 40) // de 20s à -20s (inverse)
    } else {
      // Centre: pause
      setCarouselSpeed(10000) // Très lent = quasi-pause
    }
  }

  const handleMouseLeave = () => {
    setCarouselSpeed(40) // Vitesse normale
  }

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Services disponibles
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Déplacez la souris sur le carrousel pour contrôler la vitesse
          </p>
        </div>

        <div
          ref={carouselRef}
          className="relative cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex"
            style={{
              animation: `scroll-infinite ${Math.abs(carouselSpeed)}s linear infinite`,
              animationDirection: carouselSpeed < 0 ? 'reverse' : 'normal'
            }}
          >
            {/* Premier set de services */}
            <div className="flex gap-8 pr-8">
              {services.map((service, index) => (
                <div
                  key={`service-1-${index}`}
                  className="flex flex-col items-center justify-center min-w-[120px] p-6 rounded-xl bg-card border hover:border-primary/50 transition-all"
                >
                  <div className="text-4xl mb-2">{service.emoji}</div>
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
              ))}
            </div>

            {/* Duplication pour l'effet infini */}
            <div className="flex gap-8 pr-8">
              {services.map((service, index) => (
                <div
                  key={`service-2-${index}`}
                  className="flex flex-col items-center justify-center min-w-[120px] p-6 rounded-xl bg-card border hover:border-primary/50 transition-all"
                >
                  <div className="text-4xl mb-2">{service.emoji}</div>
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
