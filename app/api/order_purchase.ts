import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/services/email.service";
import { twilioClient } from "@/lib/twilio";

// Utilidad para formatear los datos del pedido para el correo y SMS
function formatOrderDetails(pedido: any, detalles: any[]) {
  const productos = detalles.map((d: any) => `- ${d.nombre || d.producto_nombre} x${d.cantidad}`).join("\n");
  return {
    emailHtml: `<h2>¡Gracias por tu compra!</h2>
      <p>Hola ${pedido.nombre}, hemos recibido tu pedido.</p>
      <p><b>Datos de envío:</b><br>
      Nombre: ${pedido.nombre} ${pedido.apellido}<br>
      Email: ${pedido.email}<br>
      Teléfono: ${pedido.telefono}<br>
      Dirección: ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento}<br>
      Código Postal: ${pedido.codigoPostal || "-"}<br>
      Notas: ${pedido.notas || "-"}</p>
      <p><b>Productos:</b><br>${productos.replace(/\n/g, "<br>")}</p>
      <p>Total: <b>$${pedido.total || "-"}</b></p>` ,
    smsText: `Nueva compra confirmada\nNombre: ${pedido.nombre} ${pedido.apellido}\nTel: ${pedido.telefono}\nEmail: ${pedido.email}\nDirección: ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento}\nCP: ${pedido.codigoPostal || "-"}\nNotas: ${pedido.notas || "-"}\nProductos:\n${productos}\nTotal: $${pedido.total || "-"}`
  };
}

export async function POST(req: NextRequest) {
  try {
    const { pedido, detalles } = await req.json();
    if (!pedido || !detalles) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    const { emailHtml, smsText } = formatOrderDetails(pedido, detalles);
    // Enviar correo al cliente
    await sendMail({
      to: pedido.email,
      subject: "Confirmación de compra - Movil Express",
      html: emailHtml
    });
    // Enviar SMS al número fijo
    await twilioClient.messages.create({
      body: smsText,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+573103003623"
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error enviando notificaciones" }, { status: 500 });
  }
}
