import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { executeQuerySingle } from "./database"
import type { Usuario } from "../types/database"

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-muy-segura"

export interface JWTPayload {
  userId: number
  email: string
  rol: "cliente" | "admin"
  iat?: number
  exp?: number
}

// Generar token JWT
export function generateToken(user: Usuario): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Obtener usuario desde token de request
export async function getUserFromRequest(request: NextRequest): Promise<Usuario | null> {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return null
    }

    const user = await executeQuerySingle<Usuario>("SELECT * FROM usuarios WHERE id = ? AND activo = 1", [
      payload.userId,
    ])

    if (user) {
      // Actualizar último acceso
      await executeQuerySingle("UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?", [user.id])
    }

    return user
  } catch (error) {
    console.error("Error obteniendo usuario desde request:", error)
    return null
  }
}

// Verificar si el usuario es admin
export function isAdmin(user: Usuario | null): boolean {
  return user?.rol === "admin"
}

// Middleware para rutas protegidas
export async function requireAuth(request: NextRequest): Promise<Usuario | Response> {
  const user = await getUserFromRequest(request)

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return user
}

// Middleware para rutas de admin
export async function requireAdmin(request: NextRequest): Promise<Usuario | Response> {
  const user = await getUserFromRequest(request)

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!isAdmin(user)) {
    return new Response(
      JSON.stringify({ success: false, error: "Acceso denegado - Se requieren permisos de administrador" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    )
  }

  return user
}
