import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

// GET: Listar órdenes
export async function GET(req: NextRequest) {
  try {
    const ordenes = await executeQuery<any>(`
      SELECT od.id, od.nombre, od.email, od.telefono, od.direccion, od.ciudad, od.total, od.fecha,
        JSON_ARRAYAGG(JSON_OBJECT('nombre', d.producto_nombre, 'cantidad', d.cantidad)) as productos
      FROM orden_datos od
      LEFT JOIN orden_detalles d ON od.id = d.orden_id
      GROUP BY od.id
      ORDER BY od.fecha DESC
      LIMIT 100
    `);
    const ordenesParsed = ordenes.map((o: any) => ({
      ...o,
      productos: o.productos ? JSON.parse(o.productos) : []
    }));
    return NextResponse.json({ ordenes: ordenesParsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear nueva orden
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, direccion, ciudad, total, fecha, productos } = body;
    const result = await executeQuery<any>(
      `INSERT INTO orden_datos (nombre, email, telefono, direccion, ciudad, total, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, telefono, direccion, ciudad, total, fecha]
    );
    const ordenId = Array.isArray(result) && result.length > 0 && result[0].insertId ? result[0].insertId : null;
    if (Array.isArray(productos)) {
      for (const prod of productos) {
        await executeQuery<any>(
          `INSERT INTO orden_detalles (orden_id, producto_nombre, cantidad) VALUES (?, ?, ?)`,
          [ordenId, prod.nombre, prod.cantidad]
        );
      }
    }
    return NextResponse.json({ success: true, id: ordenId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar orden
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nombre, email, telefono, direccion, ciudad, total, fecha, productos } = body;
    await executeQuery<any>(
      `UPDATE orden_datos SET nombre=?, email=?, telefono=?, direccion=?, ciudad=?, total=?, fecha=? WHERE id=?`,
      [nombre, email, telefono, direccion, ciudad, total, fecha, id]
    );
    await executeQuery<any>(`DELETE FROM orden_detalles WHERE orden_id=?`, [id]);
    if (Array.isArray(productos)) {
      for (const prod of productos) {
        await executeQuery<any>(
          `INSERT INTO orden_detalles (orden_id, producto_nombre, cantidad) VALUES (?, ?, ?)`,
          [id, prod.nombre, prod.cantidad]
        );
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar orden
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await executeQuery<any>(`DELETE FROM orden_detalles WHERE orden_id=?`, [id]);
    await executeQuery<any>(`DELETE FROM orden_datos WHERE id=?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
