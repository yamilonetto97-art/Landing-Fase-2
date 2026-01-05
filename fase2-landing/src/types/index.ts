export interface UserData {
  dni: string
  name: string
  cargo?: string
  ugel?: string
}

export interface ProgressData {
  fase: 1 | 2 | 3
  mesesTotales: number
  diasTotales: number
  progresoDentroFase: number
  progresoTotal: number
  diasRestantes: number
  mesesRestantes: number
  /** Fecha de entrega del diploma formateada (ej: "28 de febrero de 2026") */
  fechaEntrega?: string
}

export interface ProgressResponse {
  user: UserData
  progress: ProgressData
  /** Indica si el docente completó el 100% */
  isCompleted?: boolean
  /** Fecha objetivo de finalización (ej: "2026-02-28") */
  targetDate?: string
}

/**
 * Respuesta del webhook de n8n (o mock local)
 */
export interface DocenteResponse {
  success: boolean
  data?: {
    dni: string
    nombreCompleto: string
    cargo: string
    ugel: string
    fechaRegistro: string
  }
  error?: string
}
