import { NextRequest, NextResponse } from "next/server"
import { crearOrdenYDetalles } from "@/lib/services/ordenes.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pedido, detalles } = body
    // Guardar orden y detalles en la base de datos
    const result = await crearOrdenYDetalles(pedido, detalles)
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error("Error creando orden:", error)
    return NextResponse.json({ success: false, error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Error interno" }, { status: 500 })
  }
}
