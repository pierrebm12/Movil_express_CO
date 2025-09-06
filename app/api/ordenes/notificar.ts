import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/services/email.service";

export async function POST(req: NextRequest) {
  try {
    const { pedido, detalles } = await req.json();
    if (!pedido || !detalles) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    // Construir el cuerpo del correo
    const productos = detalles.map((d: any) => `- ${d.nombre || d.producto_nombre} x${d.cantidad}`).join("\n");
    const html = `<h2>¡Gracias por tu compra!</h2>
      <p>Hola ${pedido.nombre}, hemos recibido tu pedido.</p>
      <p><b>Datos de envío:</b><br>
      Nombre: ${pedido.nombre} ${pedido.apellido}<br>
      Email: ${pedido.email}<br>
      Teléfono: ${pedido.telefono}<br>
      Dirección: ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento}<br>
    Código Postal: ${pedido.codigo_postal || "-"}<br>
      Notas: ${pedido.notas || "-"}</p>
      <p><b>Productos:</b><br>${productos.replace(/\n/g, "<br>")}</p>
      <p>Total: <b>$${pedido.total || "-"}</b></p>`;
    await sendMail({
      to: pedido.email,
      subject: "Confirmación de compra - Movil Express",
      html
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error enviando correo" }, { status: 500 });
  }
}
