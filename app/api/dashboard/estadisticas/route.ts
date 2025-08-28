import { NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard.service"

export async function GET() {
  try {
    const estadisticas = await DashboardService.obtenerEstadisticas()

    return NextResponse.json({
      success: true,
      data: estadisticas,
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
