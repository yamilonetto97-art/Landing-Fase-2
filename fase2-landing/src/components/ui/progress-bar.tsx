"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  /** Porcentaje de progreso (0-100) */
  progress: number
  /** Fase actual del viaje del héroe (ignorado - siempre amarillo) */
  fase?: 1 | 2 | 3
  /** Mostrar animación al cargar */
  animated?: boolean
}

/**
 * Barra de progreso animada premium - SIEMPRE AMARILLA
 * El porcentaje se muestra SIEMPRE visible en la barra.
 */
export function ProgressBar({
  progress,
  animated = true
}: ProgressBarProps) {
  // SIEMPRE amarillo/dorado - sin variaciones por fase
  const barColor = "from-yellow-400 via-amber-500 to-yellow-500"
  const glowColor = "shadow-yellow-400/50"

  const progressClamped = Math.min(100, Math.max(0, progress))

  // Determinar si el porcentaje cabe dentro de la barra o debe mostrarse afuera
  const showInsideBar = progressClamped >= 12

  return (
    <div className="relative">
      {/* Etiquetas de inicio y fin */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span className="font-medium">Inicio</span>
        <span className="font-medium text-yellow-600">🎓 Certificado</span>
      </div>

      {/* Contenedor de la barra */}
      <div className="relative w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner border border-gray-200">
        {/* Marcadores de progreso */}
        <div className="absolute inset-0 flex justify-between px-1 z-10 pointer-events-none">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="w-px h-full bg-gray-300/50"
              style={{ marginLeft: `${mark}%` }}
            />
          ))}
        </div>

        {/* Barra de progreso - SIEMPRE AMARILLA */}
        <motion.div
          className={`h-full bg-gradient-to-r ${barColor} rounded-full relative shadow-lg ${glowColor}`}
          initial={animated ? { width: 0 } : { width: `${progressClamped}%` }}
          animate={{ width: `${progressClamped}%` }}
          transition={{
            duration: animated ? 1.8 : 0,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Efecto de brillo animado */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
            style={{
              animation: "shimmer 2.5s infinite linear",
            }}
          />

          {/* Indicador de posición actual (bolita) */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-yellow-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: animated ? 1.5 : 0, duration: 0.3 }}
          />

          {/* Porcentaje DENTRO de la barra (si cabe) */}
          {showInsideBar && (
            <motion.span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white whitespace-nowrap"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animated ? 1 : 0 }}
            >
              {progressClamped.toFixed(0)}%
            </motion.span>
          )}
        </motion.div>

        {/* Porcentaje FUERA de la barra (si es muy pequeño) */}
        {!showInsideBar && (
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600 whitespace-nowrap"
            style={{
              left: `calc(${progressClamped}% + 1.5rem)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animated ? 1 : 0 }}
          >
            {progressClamped.toFixed(0)}%
          </motion.span>
        )}
      </div>

      {/* Indicador de meta */}
      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-400">Meta: 100%</span>
      </div>
    </div>
  )
}
