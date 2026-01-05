/**
 * API Endpoint: POST /api/retention/generate-token
 *
 * Genera tokens JWT para docentes. Usado por n8n para crear links personalizados.
 *
 * Body:
 *   { userId: number } - Genera token para un usuario específico
 *   { email: string }  - Genera token buscando por email
 *   { all: true }      - Genera tokens para todos los usuarios activos
 *
 * Headers:
 *   X-API-Key: <api_key> - Requerido para autenticación
 */

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getUserById, getUserByEmail, getActiveUsers } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'genera-retention-secret-2024'
const API_KEY = process.env.RETENTION_API_KEY || 'retention-api-key-2024'

// Token válido por 60 días
const TOKEN_EXPIRY = '60d'

interface GenerateTokenRequest {
  userId?: number
  email?: string
  all?: boolean
}

function generateToken(userId: number): string {
  return jwt.sign(
    { userId, type: 'retention' },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar API Key
    const apiKey = request.headers.get('x-api-key')

    if (apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'API Key inválida' },
        { status: 401 }
      )
    }

    // 2. Parsear body
    const body: GenerateTokenRequest = await request.json()

    // 3. Generar token(s) según el caso

    // Caso A: Generar para todos los usuarios activos
    if (body.all) {
      const users = await getActiveUsers()
      const tokens = users.map(user => ({
        userId: user.id,
        email: user.email,
        name: user.name || user.email,
        token: generateToken(user.id),
        createdAt: user.createdAt
      }))

      return NextResponse.json({
        count: tokens.length,
        tokens
      })
    }

    // Caso B: Generar por userId
    if (body.userId) {
      const user = await getUserById(body.userId)

      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        userId: user.id,
        email: user.email,
        name: user.name || user.email,
        token: generateToken(user.id)
      })
    }

    // Caso C: Generar por email
    if (body.email) {
      const user = await getUserByEmail(body.email)

      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        userId: user.id,
        email: user.email,
        name: user.name || user.email,
        token: generateToken(user.id)
      })
    }

    return NextResponse.json(
      { error: 'Debe proporcionar userId, email, o all: true' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error en /api/retention/generate-token:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
