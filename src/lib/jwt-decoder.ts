/**
 * Decodifica el JWT client-side SIN verificar firma.
 *
 * La verificación criptográfica se hace server-side (Server Component / API
 * route con `cert-jwt.ts`). Este helper solo es para leer claims en el
 * cliente, donde no podemos exponer CERT_JWT_SECRET.
 *
 * No confiar en los datos para decisiones de seguridad. Solo UI.
 */

export interface DecodedCertClaims {
  sub: string
  name: string
  progress: number
  fase: 1 | 2 | 3
  active_until: string | null
  iss?: string
  aud?: string
  exp?: number
  iat?: number
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return atob(padded + pad)
}

export function decodeCertTokenUnsafe(token: string): DecodedCertClaims | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const json = base64UrlDecode(parts[1])
    const payload = JSON.parse(decodeURIComponent(escape(json)))

    if (payload.iss !== 'epic-spa' || payload.aud !== 'landing-fase-2') return null
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return null

    return {
      sub: String(payload.sub ?? ''),
      name: String(payload.name ?? ''),
      progress: Number(payload.progress ?? 0),
      fase: (payload.fase ?? 1) as 1 | 2 | 3,
      active_until: payload.active_until ?? null,
      iss: payload.iss,
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
    }
  } catch {
    return null
  }
}

export function applyVisualCurve(raw: number): number {
  const x = Math.max(0, Math.min(100, raw)) / 100
  if (x === 0) return 0
  if (x >= 1) return 100
  return 12 + 88 * Math.pow(x, 0.6)
}
