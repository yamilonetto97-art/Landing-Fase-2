"use client"

import { BorderBeam } from "@/components/ui/border-beam"

interface CertificateProps {
  /** Nombre del recipiente del certificado */
  recipientName: string
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Componente de vista previa del certificado real de San Marcos
 * Usa la imagen oficial del certificado con el nombre superpuesto
 */
export function Certificate({
  recipientName,
  className
}: CertificateProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-1 ${className || ''}`}>
      {/* Efecto de glow animado */}
      <BorderBeam
        duration={10}
        colorFrom="#fbbf24"
        colorTo="#f59e0b"
        borderWidth={4}
      />
      {/* Certificado con nombre superpuesto */}
      <div className="relative z-10 rounded-lg overflow-hidden">
        {/* Imagen del certificado real */}
        <img
          src="/certificado-unmsm.jpg"
          alt="Certificado de Especialización - Universidad Nacional Mayor de San Marcos"
          className="w-full rounded-lg"
        />

        {/* Nombre del docente superpuesto */}
        <span
          className="absolute font-bold text-gray-950 whitespace-nowrap"
          style={{
            top: '50%',
            left: '28%',
            fontSize: 'clamp(12px, 2.1vw, 24px)',
            fontFamily: 'serif',
            letterSpacing: '0.03em',
            textShadow: '0 0 1px rgba(0,0,0,0.1)'
          }}
        >
          {recipientName}
        </span>
      </div>
    </div>
  )
}

/**
 * Componente de demo para preview
 */
export function Component() {
  return (
    <div className="relative overflow-hidden rounded-xl p-1">
      <BorderBeam
        duration={10}
        colorFrom="#fbbf24"
        colorTo="#f59e0b"
        borderWidth={4}
      />
      <div className="relative z-10 rounded-lg overflow-hidden">
        <img
          src="/certificado-unmsm.jpg"
          alt="Certificado de Especialización - Universidad Nacional Mayor de San Marcos"
          className="w-full rounded-lg"
        />
        <span
          className="absolute font-bold text-gray-950 whitespace-nowrap"
          style={{
            top: '50%',
            left: '28%',
            fontSize: 'clamp(12px, 2.1vw, 24px)',
            fontFamily: 'serif',
            letterSpacing: '0.03em',
            textShadow: '0 0 1px rgba(0,0,0,0.1)'
          }}
        >
          María García Quispe
        </span>
      </div>
    </div>
  )
}
