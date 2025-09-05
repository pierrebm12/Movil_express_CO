import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const users = await executeQuery<any>(
      `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );
    if (!users.length) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }
  return NextResponse.json({ success: true, rol: user.rol });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
