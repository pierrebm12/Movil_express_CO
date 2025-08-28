import { NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard.service"

export async function GET() {
  try {
    const alertas = await DashboardService.obtenerAlertas()

    return NextResponse.json({
      success: true,
      data: alertas,
    })
  } catch (error) {
    console.error("Error obteniendo alertas:", error)
    return NextResponse.json({ success: false, error: "Error al obtener alertas" }, { status: 500 })
  }
}
