import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Simple session management without JWT
const sessions = new Map<string, { userId: number; email: string; rol: string; expires: number }>()

// Clean expired sessions
function cleanExpiredSessions() {
  const now = Date.now()
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expires < now) {
      sessions.delete(sessionId)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // For demo purposes, we'll use simple password comparison
    // In production, you should use proper password hashing
    const validCredentials = [
      { email: "admin@movilexpress.com", password: "admin123", name: "Administrador", rol: "admin" },
      { email: "superadmin@movilexpress.com", password: "super123", name: "Super Admin", rol: "admin" },
    ]

    const user = validCredentials.find((cred) => cred.email === email && cred.password === password)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Clean expired sessions
    cleanExpiredSessions()

    // Create session
    const sessionId = crypto.randomUUID()
    const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    sessions.set(sessionId, {
      userId: 1,
      email: user.email,
      rol: user.rol,
      expires,
    })

    // Prepare response
    const userResponse = {
      id: 1,
      nombre: user.name,
      email: user.email,
      rol: user.rol,
      isAdmin: user.rol === "admin",
    }

    const response = NextResponse.json({
      user: userResponse,
      sessionId,
    })

    // Set session cookie
    response.cookies.set("session-id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Export sessions for middleware
export { sessions }
