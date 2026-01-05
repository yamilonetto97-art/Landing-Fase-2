"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  /** Porcentaje de progreso (0-100) */
  progress: number
  /** Fase actual del viaje del héroe */
  fase: 1 | 2 | 3
  /** Mostrar animación al cargar */
  animated?: boolean
}

/**
 * Barra de progreso animada premium que cambia de color según la fase actual.
 * - Fase 1: Azul (diferenciación)
 * - Fase 2: Amarillo/Dorado (resistencia - crítico)
 * - Fase 3: Verde (autoridad - logro)
 */
export function ProgressBar({ 
  progress, 
  fase, 
  animated = true 
}: ProgressBarProps) {
  const colors = {
    1: "from-blue-400 via-blue-500 to-blue-600",
    2: "from-yellow-400 via-amber-500 to-orange-500",
    3: "from-green-400 via-emerald-500 to-teal-600"
  }

  const glowColors = {
    1: "shadow-blue-400/50",
    2: "shadow-yellow-400/50",
    3: "shadow-green-400/50"
  }
  
  const progressClamped = Math.min(100, Math.max(0, progress))
  
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
        
        {/* Barra de progreso */}
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[fase]} rounded-full relative shadow-lg ${glowColors[fase]}`}
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
          
          {/* Indicador de posición actual */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-yellow-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: animated ? 1.5 : 0, duration: 0.3 }}
          />
        </motion.div>
        
        {/* Porcentaje dentro de la barra */}
        {progressClamped > 15 && (
          <motion.span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white"
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
      </div>
      
      {/* Indicador de meta */}
      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-400">Meta: 100%</span>
      </div>
    </div>
  )
}
