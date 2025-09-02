import { NextRequest, NextResponse } from "next/server";

import OrdenDatos from "@/backend/models/OrdenDatos";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pedidoId, nombre, direccion, telefono, email, ciudad, notas } = body;
    if (!pedidoId || !nombre || !direccion || !telefono || !email || !ciudad) {
      return NextResponse.json({ success: false, error: "Faltan datos obligatorios" }, { status: 400 });
    }

  // Guarda los datos en la base de datos usando el modelo
  await OrdenDatos.create({ pedidoId, nombre, direccion, telefono, email, ciudad, notas });
  return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
