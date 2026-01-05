import { calcularProgreso, calcularProgresoHaciaFecha, getProgreso100Completado } from './progress-calculator'
import type { ProgressResponse } from '@/types'

/**
 * Extrae los datos del docente directamente de los parámetros de la URL.
 * No hay llamada a API - los datos vienen codificados en el link.
 *
 * URLs soportadas:
 * - Normal: ?n=Nombre&f=2025-03-01 (12 meses desde fecha)
 * - Fecha fin: ?n=Nombre&end=2026-02-28 (progreso hacia fecha específica)
 * - 100%: ?n=Nombre&f=2025-03-01&c=1 (completado)
 * - 100% + fecha fin: ?n=Nombre&end=2026-02-28&c=1 (completado docentes 28 feb)
 */
export function getDocenteFromURL(searchParams: URLSearchParams): ProgressResponse | null {
  const nombre = searchParams.get('n')
  const fecha = searchParams.get('f')
  const fechaFin = searchParams.get('end')
  const completado = searchParams.get('c') === '1'

  // Validar: necesita nombre Y (fecha O fechaFin)
  if (!nombre || (!fecha && !fechaFin)) {
    return null
  }

  // Decodificar nombre (los espacios vienen como + o %20)
  const nombreDecodificado = decodeURIComponent(nombre.replace(/\+/g, ' '))

  let progress

  if (completado) {
    // Modo 100% completado - mostrar felicitaciones
    progress = getProgreso100Completado(fechaFin || undefined)
  } else if (fechaFin) {
    // Modo fecha fin específica (ej: 28 de febrero 2026)
    // Si hay fecha inicio (f), usarla; sino calcularProgresoHaciaFecha usa 12 meses antes
    progress = calcularProgresoHaciaFecha(fechaFin, fecha || undefined)
  } else {
    // Modo normal: 12 meses desde fecha de inicio
    progress = calcularProgreso(fecha!)
  }

  return {
    user: {
      dni: '',
      name: nombreDecodificado
    },
    progress,
    // Agregar flags para la UI
    isCompleted: completado,
    targetDate: fechaFin || undefined
  }
}

/**
 * Valida que los parámetros necesarios estén presentes
 */
export function hasValidParams(searchParams: URLSearchParams): boolean {
  const nombre = searchParams.get('n')
  const fecha = searchParams.get('f')
  const fechaFin = searchParams.get('end')
  // Necesita nombre Y (fecha O fechaFin)
  return !!(nombre && (fecha || fechaFin))
}
