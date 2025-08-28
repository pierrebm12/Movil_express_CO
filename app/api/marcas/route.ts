import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Solo marcas activas (columna correcta: activo)
    const marcas = await executeQuery(
      "SELECT id, nombre FROM marcas WHERE activo = 1 ORDER BY nombre ASC"
    )
    return NextResponse.json({ marcas })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener marcas" }, { status: 500 })
  }
}
