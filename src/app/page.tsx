"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { GridBackground } from "@/components/ui/grid-background"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Component as AnimatedTestimonials } from "@/components/ui/testimonial"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { CartoonButton } from "@/components/ui/cartoon-button"
import { Certificate } from "@/components/ui/certificate"
import { Typewriter } from "@/components/ui/typewriter-text"
import { getDocenteFromURL, hasValidParams } from "@/lib/api-client"
import type { ProgressResponse } from "@/types"

// Datos de demo para desarrollo (cuando no hay parámetros)
const DEMO_DATA: ProgressResponse = {
  user: {
    dni: "",
    name: "María García Quispe"
  },
  progress: {
    fase: 2,
    mesesTotales: 6.5,
    diasTotales: 195,
    progresoDentroFase: 37.5,
    progresoTotal: 54.2,
    diasRestantes: 165,
    mesesRestantes: 5.5
  }
}

/**
 * Componente interno que renderiza la landing basado en los parámetros de URL
 */
function Fase2Inner({ searchParams }: { searchParams: URLSearchParams }) {
  const confettiRef = useRef<ConfettiRef>(null)

  // Obtener datos directamente de la URL (sin API)
  const docenteData = getDocenteFromURL(searchParams)
  const hasParams = hasValidParams(searchParams)

  // En desarrollo sin parámetros, usar demo
  const data = docenteData || (process.env.NODE_ENV === 'development' ? DEMO_DATA : null)

  // Disparar confetti al cargar
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 }
        })
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [data])

  // Sin parámetros válidos (producción)
  if (!data) {
    return (
      <div className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Enlace no válido
            </h1>
            <p className="text-gray-600">
              Este enlace no contiene los datos necesarios. Verifica el enlace que recibiste.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { user, progress, isCompleted, targetDate } = data

  // Determinar mensaje según el estado
  const is100Percent = isCompleted || progress.progresoTotal >= 100

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      {/* Confetti */}
      <Confetti
        ref={confettiRef}
        className="pointer-events-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999
        }}
        manualstart={true}
      />

      <div className="relative z-10 min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* Título principal */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-none tracking-tight text-gray-900">
              Tu certificación de la{' '}
              <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Universidad Nacional de San Marcos
              </span>
              , ya está en proceso, docente.
            </h1>
          </motion.div>

          {/* Certificado de San Marcos - Vista previa */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Certificate
              recipientName={user.name}
            />
          </motion.div>

          {/* Barra de progreso principal - DESTACADA */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ProgressBar
              progress={progress.progresoTotal}
              fase={progress.fase}
            />
          </motion.div>

          {/* Texto del progreso personalizado */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {is100Percent ? (
              <>
                <p className="text-2xl text-gray-800 font-bold">
                  🎉 ¡Felicidades, <span className="text-green-600">{user.name}</span>!
                </p>
                <p className="text-xl text-gray-600">
                  Lo lograste. Has completado el <span className="font-bold text-green-600">100%</span> de tu formación.
                </p>
                {progress.fechaEntrega && (
                  <p className="text-lg text-amber-600 font-semibold mt-3 bg-amber-50 rounded-lg py-3 px-4 inline-block">
                    📜 Tu diplomado llegará el <span className="font-bold">{progress.fechaEntrega}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xl text-gray-600">
                  <span className="font-semibold text-gray-900">{user.name}</span>, ya superaste la primera barrera. Llevas{' '}
                  <span className="font-bold text-green-600">{progress.progresoTotal.toFixed(0)}%</span> del camino.
                </p>
                {progress.fechaEntrega ? (
                  <p className="text-lg text-gray-500">
                    Tu certificado estará listo el <span className="font-semibold text-amber-600">{progress.fechaEntrega}</span>. ¡Ya falta poco!
                  </p>
                ) : (
                  <p className="text-lg text-gray-500">
                    Tu certificación de San Marcos está cada vez más cerca.
                  </p>
                )}
              </>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <CartoonButton
              label="Continuar mi progreso"
              color="bg-yellow-400"
              onClick={() => window.open('https://generaapp.com/', '_blank', 'noopener,noreferrer')}
            />
          </motion.div>

          {/* Header de Testimonios - Copy estilo Isra Bravo */}
          <motion.div
            className="text-center space-y-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              <Typewriter
                text={[
                  "Docentes que ya dominan la Inteligencia Artificial",
                  "Docentes que corrigen en minutos, no en horas",
                  "Docentes que sus colegas consultan como expertos",
                  "Docentes que consiguieron su certificado este mes",
                  "Docentes que dejaron de improvisar sus clases"
                ]}
                speed={60}
                deleteSpeed={30}
                delay={3000}
                loop={true}
                cursor="_"
              />
            </h2>
          </motion.div>

          {/* Testimonios animados */}
          <AnimatedTestimonials />

          {/* Footer */}
          <motion.footer
            className="text-center text-xs text-gray-400 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <p>
              Certificación en colaboración con la Universidad Nacional Mayor de San Marcos
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} Genera. Todos los derechos reservados.
            </p>
          </motion.footer>

        </div>
      </div>
    </div>
  )
}

/**
 * Contenido principal de la landing
 */
function Fase2Content() {
  const searchParams = useSearchParams()

  // Crear key basado en los parámetros para forzar re-render si cambian
  const paramsKey = `${searchParams.get('n')}-${searchParams.get('f')}-${searchParams.get('end')}-${searchParams.get('c')}`

  return <Fase2Inner key={paramsKey} searchParams={searchParams} />
}

/**
 * Página principal de la landing Fase 2
 */
export default function Fase2Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Fase2Content />
    </Suspense>
  )
}
