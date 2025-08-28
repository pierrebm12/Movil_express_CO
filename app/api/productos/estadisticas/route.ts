import { NextResponse } from "next/server"
import { ProductosService } from "@/lib/services/productos.service"

// GET /api/productos/estadisticas - Obtener estadísticas de productos
export async function GET() {
  try {
    const result = await ProductosService.obtenerEstadisticas()

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error("Error en GET /api/productos/estadisticas:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
