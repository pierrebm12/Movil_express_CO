import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

// GET: Obtener el estado (Nuevo/Usado) de los productos por ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const ids = searchParams.get("ids");
    if (!ids) return NextResponse.json({ error: "Faltan IDs" }, { status: 400 });
    const idArr = ids.split(",").map(Number).filter(Boolean);
    if (!idArr.length) return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    const productos = await executeQuery<any>(
      `SELECT id, nombre, estado FROM productos WHERE id IN (${idArr.map(() => "?").join(",")})`,
      idArr
    );
    return NextResponse.json({ productos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
