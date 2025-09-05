import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

// GET: Listar todas las órdenes y productos preparados para el panel admin
export async function GET(req: NextRequest) {
  try {
    // Órdenes completas
    const ordenes = await executeQuery<any>(`
      SELECT od.id, od.nombre, od.email, od.telefono, od.direccion, od.ciudad, od.total, od.fecha, od.estado,
        JSON_ARRAYAGG(JSON_OBJECT('nombre', d.producto_nombre, 'cantidad', d.cantidad, 'id', d.producto_id)) as productos
      FROM orden_datos od
      LEFT JOIN orden_detalles d ON od.id = d.orden_id
      GROUP BY od.id
      ORDER BY od.fecha DESC
      LIMIT 200
    `);
    const ordenesParsed = ordenes.map((o: any) => ({
      ...o,
      productos: o.productos ? JSON.parse(o.productos) : []
    }));
    // Productos preparados
    const preparados = await executeQuery<any>(`
      SELECT pp.id, pp.orden_id, pp.producto_nombre, pp.cantidad, pp.fecha_preparado, od.nombre as cliente, od.email, od.telefono
      FROM productos_preparados pp
      LEFT JOIN orden_datos od ON pp.orden_id = od.id
      ORDER BY pp.fecha_preparado DESC
      LIMIT 200
    `);
    return NextResponse.json({ ordenes: ordenesParsed, preparados });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST, PUT, DELETE: Reutilizar lógica de ordenes.ts para CRUD completo
export { POST, PUT, DELETE } from "./ordenes";
