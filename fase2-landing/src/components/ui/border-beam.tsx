"use client"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /** Clases CSS adicionales */
  className?: string
  /** Duración de la animación en segundos */
  duration?: number
  /** Grosor del borde */
  borderWidth?: number
  /** Color primario del gradiente */
  colorFrom?: string
  /** Color secundario del gradiente */
  colorTo?: string
}

/**
 * BorderBeam - Efecto de borde animado con glow que rota suavemente
 * Usa un gradiente cónico continuo que rota sin cortes visibles
 */
export const BorderBeam = ({
  className,
  duration = 8,
  borderWidth = 2,
  colorFrom = "#fbbf24",
  colorTo = "#f59e0b",
}: BorderBeamProps) => {
  return (
    <>
      {/* Glow background que rota - gradiente más suave y continuo */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-[inherit] z-0",
          className
        )}
        style={{
          background: `conic-gradient(
            from 0deg,
            ${colorFrom} 0deg,
            ${colorTo} 60deg,
            transparent 120deg,
            transparent 240deg,
            ${colorTo} 300deg,
            ${colorFrom} 360deg
          )`,
          animation: `spin-slow ${duration}s linear infinite`,
        }}
      />
      {/* Máscara interior para crear el efecto de borde */}
      <div 
        className="absolute inset-0 rounded-[inherit] bg-white z-0"
        style={{
          margin: `${borderWidth}px`,
        }}
      />
    </>
  )
}
