import { NextRequest, NextResponse } from "next/server";
import { boldRequest } from "@/lib/bold";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Aquí adaptamos el payload al formato que espera Bold
    // Ejemplo básico, ajusta según la documentación de Bold
    const payload = {
      amount: body.total, // Monto total
      currency: "COP",
      items: body.items.map((item: any) => ({
        name: item.producto.nombre,
        quantity: item.cantidad,
        price: item.producto.precio_actual,
        // Puedes agregar más campos según lo que requiera Bold
      })),
      // Puedes agregar customer info, return_url, etc.
    };
    const data = await boldRequest("/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // Suponiendo que la respuesta trae la url de checkout
    return NextResponse.json({ url: data.checkout_url || data.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
