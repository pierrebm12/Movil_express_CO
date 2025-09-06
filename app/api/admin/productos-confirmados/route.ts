import { NextResponse } from "next/server";
import { getConfirmedProducts, deleteConfirmedProduct } from "@/lib/productos-confirmados-crud";

export async function GET() {
  try {
    const productos = await getConfirmedProducts();
    return NextResponse.json({ productos });
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener productos confirmados" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await deleteConfirmedProduct(Number(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar producto confirmado" }, { status: 500 });
  }
}
