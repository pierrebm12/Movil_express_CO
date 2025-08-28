import { NextRequest, NextResponse } from "next/server";
import { boldRequest } from "@/lib/bold";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Aquí adaptamos el payload al formato que espera Bold
    const payload = {
      amount: body.total, // Monto total
      currency: "COP",
      items: body.items.map((item: any) => ({
        name: item.producto.nombre,
        quantity: item.cantidad,
        price: item.producto.precio_actual,
      })),
    };
    const data = await boldRequest("/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return NextResponse.json({ url: data.checkout_url || data.url, boldResponse: data });
  } catch (error: any) {
    // Logging detallado para depuración
    console.error("Error en /api/bold/checkout:", error);
    return NextResponse.json({ error: error.message, stack: error.stack, details: error.response?.data || null }, { status: 500 });
  }
}
