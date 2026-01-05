/**
 * Conexión a la base de datos PostgreSQL de Genera (Railway)
 */
import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || ''

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
})

export interface DbUser {
  id: number
  name: string | null
  email: string
  createdAt: Date
  isActive: boolean
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(userId: number): Promise<DbUser | null> {
  const result = await pool.query(
    'SELECT id, name, email, "createdAt", "isActive" FROM "User" WHERE id = $1',
    [userId]
  )
  return result.rows[0] || null
}

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const result = await pool.query(
    'SELECT id, name, email, "createdAt", "isActive" FROM "User" WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

/**
 * Obtiene todos los usuarios activos (para generar tokens en batch)
 */
export async function getActiveUsers(): Promise<DbUser[]> {
  const result = await pool.query(
    'SELECT id, name, email, "createdAt", "isActive" FROM "User" WHERE "isActive" = true ORDER BY id'
  )
  return result.rows
}
