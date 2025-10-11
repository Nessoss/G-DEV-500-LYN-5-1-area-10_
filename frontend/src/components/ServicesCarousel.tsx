'use client'

import React, { useMemo, useState, useEffect } from "react"

const services = [
  { emoji: "📧", name: "Gmail" },
  { emoji: "📮", name: "Outlook" },
  { emoji: "🐙", name: "GitHub" },
  { emoji: "💬", name: "Discord" },
  { emoji: "💼", name: "Slack" },
  { emoji: "📝", name: "Notion" },
  { emoji: "🕐", name: "Horloge" },
  { emoji: "🏃", name: "Strava" },
  { emoji: "🎬", name: "Letterboxd" },
  { emoji: "📦", name: "Dropbox" },
  { emoji: "☁️", name: "OneDrive" },
  { emoji: "⏱️", name: "Timer" },
  { emoji: "🎵", name: "Spotify" },
  { emoji: "🌤️", name: "Météo" },
  { emoji: "📋", name: "Trello" },
]

const SERVICE_CARD_W = 140  // largeur fixe d'une carte
const SERVICE_CARD_H = 120  // hauteur fixe d'une carte
const GAP_PX = 16          // espacement horizontal
const SPEED = 50           // px/s (vitesse du défilement)

export default function ServicesCarousel() {
  const [mounted, setMounted] = useState(false)
  const [vw, setVw] = useState<number>(1200) // Valeur par défaut fixe

  useEffect(() => {
    setMounted(true)
    setVw(window.innerWidth)
    
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const base = useMemo(() => {
    // Utiliser une valeur fixe pour le SSR, puis la vraie valeur côté client
    const currentVw = mounted ? vw : 1200
    const unit = SERVICE_CARD_W + GAP_PX
    const minCount = Math.max(1, Math.ceil(currentVw / unit) + 2)
    const repeats = Math.ceil(minCount / services.length)
    return Array.from({ length: repeats }, () => services)
      .flat()
      .slice(0, minCount)
  }, [vw, mounted])

  const trackWidthPx = base.length * (SERVICE_CARD_W + GAP_PX)
  const durationSec = Math.max(8, Math.round(trackWidthPx / SPEED))

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Services disponibles
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Connectez vos services préférés avec AREA
          </p>
        </div>
      </div>

      <div className="services-marquee">
        <div className="services-marquee__viewport">
          {mounted ? (
            <>
              {/* Piste 1 */}
              <ul
                className="services-marquee__track"
                style={{
                  "--duration": `${durationSec}s`,
                  "--gap": `${GAP_PX}px`,
                  width: `${trackWidthPx}px`,
                } as React.CSSProperties}
              >
                {base.map((service, i) => (
                  <li key={`t1-${i}`} className="services-marquee__item">
                    <div className="service-card">
                      <div className="service-emoji">{service.emoji}</div>
                      <span className="service-name">{service.name}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Piste 2 (clone) */}
              <ul
                className="services-marquee__track services-marquee__track--clone"
                aria-hidden="true"
                style={{
                  "--duration": `${durationSec}s`,
                  "--gap": `${GAP_PX}px`,
                  width: `${trackWidthPx}px`,
                } as React.CSSProperties}
              >
                {base.map((service, i) => (
                  <li key={`t2-${i}`} className="services-marquee__item">
                    <div className="service-card">
                      <div className="service-emoji">{service.emoji}</div>
                      <span className="service-name">{service.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            /* Fallback pendant l'hydratation */
            <div className="flex justify-center items-center overflow-hidden" style={{ height: `${SERVICE_CARD_H + 40}px` }}>
              <div className="flex gap-4 overflow-hidden">
                {services.slice(0, 6).map((service, i) => (
                  <div key={i} className="service-card flex-shrink-0">
                    <div className="service-emoji">{service.emoji}</div>
                    <span className="service-name">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style>{`
          /* Protection globale contre le scroll horizontal */
          body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          
          .services-marquee {
            position: relative;
            width: 100%;
            max-width: 100%;
            padding: 1rem 0;
            overflow: hidden;
            box-sizing: border-box;
          }

          .services-marquee__viewport {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: ${SERVICE_CARD_H + 40}px;
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
          }

          .services-marquee__track {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: var(--gap);
            will-change: transform;
            animation: marquee var(--duration) linear infinite;
            padding: 0;
            margin: 0;
            list-style: none;
            white-space: nowrap;
            overflow: visible;
          }

          .services-marquee__track--clone {
            transform: translate(100%, -50%);
            animation-name: marqueeClone;
          }

          .services-marquee__item {
            flex: 0 0 ${SERVICE_CARD_W}px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .service-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: ${SERVICE_CARD_W}px;
            height: ${SERVICE_CARD_H}px;
            padding: 1rem;
            border-radius: 12px;
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            transition: all 0.3s ease;
            user-select: none;
          }

          .service-card:hover {
            border-color: hsl(var(--primary) / 0.5);
            transform: scale(1.05) rotate(2deg);
            box-shadow: 0 10px 25px -5px hsl(var(--primary) / 0.2);
          }

          .service-emoji {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            line-height: 1;
          }

          .service-name {
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
            color: hsl(var(--foreground));
            line-height: 1.2;
          }

          @keyframes marquee {
            from { transform: translate(0, -50%); }
            to   { transform: translate(-100%, -50%); }
          }

          @keyframes marqueeClone {
            from { transform: translate(100%, -50%); }
            to   { transform: translate(0%, -50%); }
          }

          @media (prefers-reduced-motion: reduce) {
            .services-marquee__track,
            .services-marquee__track--clone {
              animation: none;
              transform: translate(0, -50%);
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .service-card {
              width: 100px;
              height: 100px;
              padding: 0.75rem;
            }
            
            .service-emoji {
              font-size: 2rem;
            }
            
            .service-name {
              font-size: 0.75rem;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
