import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const { orden_id, productos } = await req.json();
    if (!orden_id || !Array.isArray(productos)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    for (const prod of productos) {
      await executeQuery<any>(
        `INSERT INTO productos_preparados (orden_id, producto_nombre, cantidad) VALUES (?, ?, ?)`,
        [orden_id, prod.nombre, prod.cantidad]
      );
    }
    await executeQuery<any>(
      `UPDATE orden_datos SET estado='preparado' WHERE id=?`,
      [orden_id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
