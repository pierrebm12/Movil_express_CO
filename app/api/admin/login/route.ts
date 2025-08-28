import { NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/auth";
import { executeQuerySingle } from "@/lib/database";
// No existe interfaz Usuario en types/database.ts, usar any

export async function POST(req: Request) {
  try {
    console.log("[LOGIN] ENTRANDO AL ENDPOINT LOGIN");
    const { email, password } = await req.json();
    console.log("[LOGIN] Email recibido:", email);
    console.log("[LOGIN] Password recibido:", password);
    if (!email || !password) {
      console.log("[LOGIN] Faltan email o password");
      return NextResponse.json({ error: "Email y contraseña requeridos." }, { status: 400 });
    }
    // Buscar usuario admin en la base de datos
    const admin = await executeQuerySingle<any>(
      "SELECT * FROM usuarios WHERE email = ? AND rol = 'admin' AND activo = 1",
      [email]
    );
    if (!admin) {
      console.log("[LOGIN] No se encontró usuario admin activo con ese email");
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }
    // Verificar contraseña
    console.log("[LOGIN] Hash en BD:", admin.password);
    const valid = await verifyPassword(password, admin.password);
    console.log("[LOGIN] Resultado verifyPassword:", valid);
    if (!valid) {
      console.log("[LOGIN] Contraseña incorrecta");
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    }
    // Generar JWT
    const token = generateToken(admin);
    console.log("[LOGIN] Login exitoso, token generado");
    return NextResponse.json({ token, admin: { id: admin.id, email: admin.email, nombre: admin.nombre } });
  } catch (err) {
    console.error("[LOGIN] Error interno:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
