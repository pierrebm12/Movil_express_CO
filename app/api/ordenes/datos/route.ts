import { NextRequest, NextResponse } from "next/server";


import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pedidoId, nombre, direccion, telefono, email, ciudad, notas } = body;
    if (!pedidoId || !nombre || !direccion || !telefono || !email || !ciudad) {
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

    await connection.execute(
      `INSERT INTO orden_datos (pedidoId, nombre, direccion, telefono, email, ciudad, notas) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pedidoId, nombre, direccion, telefono, email, ciudad, notas || null]
    );
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
