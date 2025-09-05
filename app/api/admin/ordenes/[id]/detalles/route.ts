import { NextRequest, NextResponse } from "next/server";
import { getOrderDetails } from "@/lib/ordenes-crud";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const detalles = await getOrderDetails(Number(params.id));
    return NextResponse.json({ detalles });
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener detalles" }, { status: 500 });
  }
}
