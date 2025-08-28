import { NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard.service"

export async function GET() {
  try {
    const ventasDiarias = await DashboardService.obtenerVentasDiarias()

    return NextResponse.json({
      success: true,
      data: ventasDiarias,
    })
  } catch (error) {
    console.error("Error obteniendo ventas diarias:", error)
    return NextResponse.json({ success: false, error: "Error al obtener ventas diarias" }, { status: 500 })
  }
}
