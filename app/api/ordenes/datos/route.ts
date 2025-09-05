import { NextRequest, NextResponse } from "next/server";


import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pedidoId, nombre, direccion, telefono, email, ciudad, notas, detalles, total } = body;
    if (!pedidoId || !nombre || !direccion || !telefono || !email || !ciudad || total === undefined) {
      return NextResponse.json({ success: false, error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // Conexión directa con mysql2
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    // Guardar datos del cliente/pedido usando numero_pedido
    await connection.execute(
      `INSERT INTO orden_datos (numero_pedido, nombre, direccion, telefono, email, ciudad, notas, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [pedidoId, nombre, direccion, telefono, email, ciudad, notas || null, total]
    );

    // Guardar productos comprados si existen
    if (Array.isArray(detalles)) {
      for (const item of detalles) {
        await connection.execute(
          `INSERT INTO orden_detalles (numero_pedido, producto_nombre, cantidad, color, precio_actual) VALUES (?, ?, ?, ?, ?)` ,
          [pedidoId, item.nombre || item.producto_nombre, item.cantidad, item.color || null, item.precio_actual]
        );
      }
    }

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
