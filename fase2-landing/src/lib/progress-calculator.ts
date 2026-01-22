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
  /** Porcentaje de progreso total REAL basado en tiempo (0-100) */
  progresoTotal: number
  /** Días restantes para completar el journey de 12 meses */
  diasRestantes: number
  /** Meses restantes para completar el journey (valor real) */
  mesesRestantes: number
  /** Fecha de entrega del diploma (si aplica) */
  fechaEntrega?: string
}

/**
 * NOTA: Se eliminó la "curva de retención psicológica" porque causaba confusión.
 * 
 * ANTES: Mostraba 12% incluso el día 0, inflando el progreso.
 * AHORA: Progreso REAL basado en tiempo transcurrido.
 * 
 * Si seleccionas 1 mes y hoy es el día 1:
 * - Progreso = (1/30) × 100 = 3%
 * 
 * Si seleccionas 1 mes y hoy es el día 15:
 * - Progreso = (15/30) × 100 = 50%
 * 
 * Esto es más transparente y la barra refleja exactamente el tiempo real.
 */

/**
 * Calcula el progreso del docente basado en su fecha de registro.
 *
 * Fases del Viaje del Héroe:
 * - Fase 1 (Diferenciación): Meses 1-4 → Establecer identidad
 * - Fase 2 (Resistencia): Meses 5-8 → Superar obstáculos (crítico)
 * - Fase 3 (Autoridad): Meses 9-12 → Consolidar expertise
 *
 * NOTA: El progreso es REAL basado en tiempo transcurrido.
 * No se aplica ninguna curva de retención artificial.
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

  // Progreso REAL (lineal) - sin curvas artificiales
  const progresoTotal = Math.min(100, (mesesTotales / 12) * 100)

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
  // Agregar T12:00:00 para evitar problemas de zona horaria
  const fechaObjetivo = new Date(fechaFin + 'T12:00:00')

  // Usar fecha de inicio proporcionada o calcular 12 meses antes
  let fechaInicio: Date
  if (fechaInicioStr) {
    fechaInicio = new Date(fechaInicioStr + 'T12:00:00')
  } else {
    fechaInicio = new Date(fechaObjetivo)
    fechaInicio.setMonth(fechaInicio.getMonth() - 12)
  }

  const diasTotalesPrograma = differenceInDays(fechaObjetivo, fechaInicio)
  const diasTranscurridos = differenceInDays(ahora, fechaInicio)
  const diasRestantes = Math.max(0, differenceInDays(fechaObjetivo, ahora))

  // Progreso REAL basado en tiempo transcurrido - sin curvas artificiales
  const progresoTotal = Math.min(100, Math.max(0, (diasTranscurridos / diasTotalesPrograma) * 100))

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
    // Agregar T12:00:00 para evitar problemas de zona horaria
    const fecha = new Date(fechaFin + 'T12:00:00')
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
