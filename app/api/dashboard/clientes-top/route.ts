import { NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard.service"

export async function GET() {
  try {
    const clientes = await DashboardService.obtenerClientesTop()

    return NextResponse.json({
      success: true,
      data: clientes,
    })
  } catch (error) {
    console.error("Error obteniendo clientes top:", error)
    return NextResponse.json({ success: false, error: "Error al obtener clientes top" }, { status: 500 })
  }
}
