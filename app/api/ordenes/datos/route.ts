import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pedido, detalles } = body;
    // Validar pedido
    if (!pedido || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return NextResponse.json({ success: false, error: "Faltan datos de pedido o detalles" }, { status: 400 });
    }
    const {
      nombre,
      email,
      telefono,
      direccion,
      ciudad,
      total,
      numero_pedido,
      departamento = null,
      codigoPostal = null,
      notas = null
    } = pedido;
    if (!nombre || !email || !telefono || !direccion || !ciudad || total === undefined || !numero_pedido) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios en el pedido" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    // Insertar en orden_datos
    const [result]: any = await connection.execute(
      `INSERT INTO orden_datos (nombre, email, telefono, direccion, ciudad, departamento, codigoPostal, notas, total, numero_pedido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, telefono, direccion, ciudad, departamento, codigoPostal, notas, total, numero_pedido]
    );
    const ordenId = result.insertId;

    // Insertar detalles
    for (const item of detalles) {
      const { producto_nombre, cantidad, precio_unitario = 0 } = item;
      if (!producto_nombre || !cantidad) continue;
      await connection.execute(
        `INSERT INTO orden_detalles (orden_id, producto_nombre, cantidad, precio_unitario, numero_pedido) VALUES (?, ?, ?, ?, ?)`,
        [ordenId, producto_nombre, cantidad, precio_unitario, numero_pedido]
      );
    }

    await connection.end();
    return NextResponse.json({ success: true, id: ordenId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
