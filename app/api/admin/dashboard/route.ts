import { NextRequest, NextResponse } from "next/server"
import { adminService } from "@/lib/services/admin.service"

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas del dashboard
    const stats = await adminService.getStats()
    
    // Obtener pedidos recientes
    const pedidosRecientes = await adminService.getPedidosRecientes(5)
    
    // Obtener productos más vendidos
    const productosMasVendidos = await adminService.getProductosMasVendidos(5)

    return NextResponse.json({
      success: true,
      data: {
        stats,
        pedidosRecientes,
        productosMasVendidos
      }
    })
  } catch (error) {
    console.error('Error en API dashboard:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
