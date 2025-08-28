import { NextResponse } from "next/server"
import { DashboardService } from "@/lib/services/dashboard.service"

export async function GET() {
  try {
    const productos = await DashboardService.obtenerProductosMasVendidos()

    return NextResponse.json({
      success: true,
      data: productos,
    })
  } catch (error) {
    console.error("Error obteniendo productos más vendidos:", error)
    return NextResponse.json({ success: false, error: "Error al obtener productos más vendidos" }, { status: 500 })
  }
}
