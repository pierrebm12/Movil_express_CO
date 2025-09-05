import { NextRequest, NextResponse } from "next/server";
import { getOrders, deleteOrder } from "@/lib/ordenes-crud";

export async function GET(req: NextRequest) {
  // Devuelve todas las órdenes
  try {
    const ordenes = await getOrders();
    return NextResponse.json({ ordenes });
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 });
  }
}

// Puedes agregar POST, PUT, DELETE si lo necesitas para crear/editar/eliminar órdenes desde el panel
