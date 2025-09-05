import { NextRequest, NextResponse } from "next/server";
import { confirmarOrden } from "@/lib/ordenes-crud";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await confirmarOrden(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al confirmar orden" }, { status: 500 });
  }
}
