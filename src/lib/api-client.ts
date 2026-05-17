import { calcularProgreso, calcularProgresoHaciaFecha, getProgreso100Completado } from './progress-calculator'
import { decodeCertTokenUnsafe, applyVisualCurve } from './jwt-decoder'
import type { ProgressResponse } from '@/types'

/**
 * Lee ?t=<JWT> firmado por EPIC. Si el token es válido (issuer/audience/exp ok),
 * retorna el ProgressResponse con la curva visual aplicada al `progress` bruto.
 * No verifica firma client-side (CERT_JWT_SECRET vive solo en EPIC).
 * Para v1 esto es suficiente: el certificado físico se emite tras validación
 * server-side por el equipo Genera, no por lo que muestra la landing.
 */
export function getDocenteFromJWT(searchParams: URLSearchParams): ProgressResponse | null {
  const token = searchParams.get('t')
  if (!token) return null

  const claims = decodeCertTokenUnsafe(token)
  if (!claims || !claims.name) return null

  const visual = applyVisualCurve(claims.progress)
  const isCompleted = claims.progress >= 100
  const accessExpired = claims.active_until !== null && new Date(claims.active_until).getTime() <= Date.now()

  return {
    user: {
      dni: '',
      name: claims.name,
    },
    progress: {
      fase: claims.fase,
      mesesTotales: 0,
      diasTotales: 0,
      progresoDentroFase: 0,
      progresoTotal: Number(visual.toFixed(0)),
      diasRestantes: 0,
      mesesRestantes: 0,
    },
    isCompleted,
    targetDate: undefined,
    // Extensiones EPIC (no afectan render legacy):
    epicSource: true,
    accessExpired,
    rawProgress: claims.progress,
  } as ProgressResponse
}

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
