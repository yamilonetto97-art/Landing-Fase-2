import { differenceInDays, format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Datos de progreso del docente en el Viaje del Héroe
 */
export interface ProgresoData {
  /** Fase actual (1: Diferenciación, 2: Resistencia, 3: Autoridad) */
  fase: 1 | 2 | 3
  /** Meses totales desde el registro (valor real) */
  mesesTotales: number
  /** Días totales desde el registro */
  diasTotales: number
  /** Porcentaje de progreso dentro de la fase actual (0-100) */
  progresoDentroFase: number
  /** Porcentaje de progreso total - MEJORADO con curva de retención (0-100) */
  progresoTotal: number
  /** Días restantes para completar el journey de 12 meses */
  diasRestantes: number
  /** Meses restantes para completar el journey (valor real) */
  mesesRestantes: number
  /** Fecha de entrega del diploma (si aplica) */
  fechaEntrega?: string
}

/**
 * Aplica curva de progreso psicológico para mejorar retención.
 *
 * TÉCNICA: "Efecto de Progreso Dotado" (Endowed Progress Effect)
 * Investigación: Nunes & Drèze (2006) - Las personas completan más tareas
 * cuando sienten que ya tienen un avance inicial.
 *
 * FÓRMULA: 12 + (88 × (progreso_real)^0.6)
 *
 * COMPONENTES:
 * - 12% bonus inicial: Sensación de "ya empezaste con ventaja"
 * - Exponente 0.6: Curva que acelera progreso percibido al inicio
 * - Factor 88: Asegura que llegue exactamente a 100% al final
 *
 * RESULTADOS:
 * ┌─────────┬──────────────┬─────────────────┐
 * │ Mes     │ Progreso Real│ Progreso Mostrado│
 * ├─────────┼──────────────┼─────────────────┤
 * │ 0       │ 0%           │ 12%             │
 * │ 1       │ 8%           │ 29%             │
 * │ 2       │ 17%          │ 39%             │
 * │ 3       │ 25%          │ 47%             │
 * │ 4       │ 33%          │ 54%             │
 * │ 5       │ 42%          │ 60%             │
 * │ 6       │ 50%          │ 67%             │
 * │ 9       │ 75%          │ 83%             │
 * │ 12      │ 100%         │ 100%            │
 * └─────────┴──────────────┴─────────────────┘
 *
 * @param progresoReal - Progreso lineal real (0-100)
 * @returns Progreso percibido mejorado (0-100)
 */
function aplicarCurvaRetencion(progresoReal: number): number {
  // Normalizar a fracción (0-1)
  const fraccion = Math.min(1, Math.max(0, progresoReal / 100))

  // Aplicar curva: bonus inicial + curva potencial
  const progresoMejorado = 12 + (88 * Math.pow(fraccion, 0.6))

  // Asegurar límites válidos
  return Math.min(100, Math.max(0, progresoMejorado))
}

/**
 * Calcula el progreso del docente basado en su fecha de registro.
 *
 * Fases del Viaje del Héroe:
 * - Fase 1 (Diferenciación): Meses 1-4 → Establecer identidad
 * - Fase 2 (Resistencia): Meses 5-8 → Superar obstáculos (crítico)
 * - Fase 3 (Autoridad): Meses 9-12 → Consolidar expertise
 *
 * NOTA: El progreso total usa curva psicológica para retención.
 * Los tiempos (meses invertidos/restantes) son valores reales.
 *
 * @param createdAt Fecha de registro del usuario
 * @returns Datos de progreso calculados (con curva de retención aplicada)
 */
export function calcularProgreso(createdAt: Date | string): ProgresoData {
  const fechaCreacion = typeof createdAt === 'string' ? new Date(createdAt) : createdAt
  const ahora = new Date()

  const diasTotales = differenceInDays(ahora, fechaCreacion)
  const mesesTotales = diasTotales / 30

  // Determinar fase actual
  let fase: 1 | 2 | 3
  let progresoDentroFase: number

  if (mesesTotales < 5) {
    // Fase 1: Meses 1-4 (índice 0-4.99)
    fase = 1
    progresoDentroFase = (mesesTotales / 5) * 100
  } else if (mesesTotales < 9) {
    // Fase 2: Meses 5-8 (índice 5-8.99)
    fase = 2
    progresoDentroFase = ((mesesTotales - 5) / 4) * 100
  } else {
    // Fase 3: Meses 9-12 (índice 9+)
    fase = 3
    progresoDentroFase = ((mesesTotales - 9) / 4) * 100
  }

  // Progreso real (lineal)
  const progresoReal = Math.min(100, (mesesTotales / 12) * 100)

  // Progreso mejorado con curva de retención psicológica
  const progresoTotal = aplicarCurvaRetencion(progresoReal)

  // Tiempos restantes (valores reales, no mejorados)
  const diasRestantes = Math.max(0, 360 - diasTotales)
  const mesesRestantes = Math.max(0, 12 - mesesTotales)

  return {
    fase,
    mesesTotales: Number(mesesTotales.toFixed(1)),
    diasTotales,
    progresoDentroFase: Math.min(100, Math.max(0, Number(progresoDentroFase.toFixed(0)))),
    progresoTotal: Number(progresoTotal.toFixed(0)),
    diasRestantes,
    mesesRestantes: Number(mesesRestantes.toFixed(1))
  }
}

/**
 * Calcula el progreso hacia una fecha específica de finalización.
 * Usado para "Docentes 28 de febrero" - fecha fija de entrega del diploma.
 *
 * @param fechaFin - Fecha de finalización (ej: "2026-02-28")
 * @param fechaInicioStr - Fecha de inicio opcional (si no se proporciona, usa 12 meses antes)
 * @returns Datos de progreso calculados hacia esa fecha
 */
export function calcularProgresoHaciaFecha(fechaFin: string, fechaInicioStr?: string): ProgresoData {
  const ahora = new Date()
  const fechaObjetivo = new Date(fechaFin)

  // Usar fecha de inicio proporcionada o calcular 12 meses antes
  let fechaInicio: Date
  if (fechaInicioStr) {
    fechaInicio = new Date(fechaInicioStr)
  } else {
    fechaInicio = new Date(fechaObjetivo)
    fechaInicio.setMonth(fechaInicio.getMonth() - 12)
  }

  const diasTotalesPrograma = differenceInDays(fechaObjetivo, fechaInicio)
  const diasTranscurridos = differenceInDays(ahora, fechaInicio)
  const diasRestantes = Math.max(0, differenceInDays(fechaObjetivo, ahora))

  // Progreso real basado en tiempo transcurrido
  const progresoReal = Math.min(100, Math.max(0, (diasTranscurridos / diasTotalesPrograma) * 100))

  // Aplicar curva de retención
  const progresoTotal = aplicarCurvaRetencion(progresoReal)

  const mesesTotales = diasTranscurridos / 30
  const mesesRestantes = diasRestantes / 30

  // Determinar fase - AJUSTADO para que 80% sea naranja (fase 2)
  // Fase 1 (azul): < 30%
  // Fase 2 (naranja): 30-90% <- Incluye el ~80% típico de docentes 28 feb
  // Fase 3 (verde): >= 90%
  let fase: 1 | 2 | 3 = 1
  let progresoDentroFase: number = 0

  if (progresoTotal < 30) {
    fase = 1
    progresoDentroFase = (progresoTotal / 30) * 100
  } else if (progresoTotal < 90) {
    fase = 2
    progresoDentroFase = ((progresoTotal - 30) / 60) * 100
  } else {
    fase = 3
    progresoDentroFase = ((progresoTotal - 90) / 10) * 100
  }

  // Formatear fecha de entrega
  const fechaEntrega = format(fechaObjetivo, "d 'de' MMMM 'de' yyyy", { locale: es })

  return {
    fase,
    mesesTotales: Number(mesesTotales.toFixed(1)),
    diasTotales: diasTranscurridos,
    progresoDentroFase: Math.min(100, Math.max(0, Number(progresoDentroFase.toFixed(0)))),
    progresoTotal: Number(progresoTotal.toFixed(0)),
    diasRestantes,
    mesesRestantes: Number(mesesRestantes.toFixed(1)),
    fechaEntrega
  }
}

/**
 * Retorna datos de progreso al 100% para docentes que completaron.
 * Usado cuando el parámetro &c=1 está presente.
 *
 * @param fechaFin - Fecha de entrega del diploma (opcional)
 * @returns Datos de progreso al 100%
 */
export function getProgreso100Completado(fechaFin?: string): ProgresoData {
  let fechaEntrega: string | undefined

  if (fechaFin) {
    const fecha = new Date(fechaFin)
    fechaEntrega = format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es })
  }

  return {
    fase: 3,
    mesesTotales: 12,
    diasTotales: 365,
    progresoDentroFase: 100,
    progresoTotal: 100,
    diasRestantes: 0,
    mesesRestantes: 0,
    fechaEntrega
  }
}
