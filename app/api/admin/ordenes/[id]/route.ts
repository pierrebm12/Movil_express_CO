import { NextRequest, NextResponse } from "next/server";
import { deleteOrder } from "@/lib/ordenes-crud";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteOrder(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar orden" }, { status: 500 });
  }
}

// Puedes agregar PUT para editar la orden si lo necesitas
