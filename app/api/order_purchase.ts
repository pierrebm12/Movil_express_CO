import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/services/email.service";
import { twilioClient } from "@/lib/twilio";

function formatEmailHtml(pedido: any, detalles: any[]) {
  const productos = detalles.map((d: any) => `- ${d.nombre || d.producto_nombre} x${d.cantidad}`).join("<br>");
  return `
    <h2>¡Gracias por tu compra!</h2>
    <p>Hola ${pedido.nombre}, hemos recibido tu pedido.</p>
    <p><b>Datos de envío:</b><br>
    Nombre: ${pedido.nombre} ${pedido.apellido || ""}<br>
    Email: ${pedido.email}<br>
    Teléfono: ${pedido.telefono}<br>
    Dirección: ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento || "-"}<br>
    Código Postal: ${pedido.codigoPostal || "-"}<br>
    Notas: ${pedido.notas || "-"}</p>
    <p><b>Productos:</b><br>${productos}</p>
    <p>Total: <b>$${pedido.total || "-"}</b></p>
    <p>ID Pedido: <b>${pedido.id || pedido.pedidoId || "-"}</b></p>
  `;
}

function formatWhatsappMessage(pedido: any, detalles: any[]) {
  const productos = detalles.map((d: any) => `- ${d.nombre || d.producto_nombre} x${d.cantidad}`).join("\n");
  return (
    `✅ *Nueva compra en Movil Express*\n\n` +
    `*ID Pedido:* ${pedido.id || pedido.pedidoId || "-"}\n` +
    `*Nombre:* ${pedido.nombre} ${pedido.apellido || ""}\n` +
    `*Teléfono:* ${pedido.telefono}\n` +
    `*Email:* ${pedido.email}\n` +
    `*Dirección:* ${pedido.direccion}, ${pedido.ciudad}, ${pedido.departamento || "-"}\n` +
    `*Código Postal:* ${pedido.codigoPostal || "-"}\n` +
    `*Notas:* ${pedido.notas || "-"}\n\n` +
    `*Productos:*\n${productos}\n\n` +
    `*Total:* $${pedido.total || "-"}`
  );
}

export async function POST(req: NextRequest) {
  try {
    const { pedido, detalles } = await req.json();
    if (!pedido || !detalles) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

    // Enviar correo al cliente
    await sendMail({
      to: pedido.email,
      subject: "Confirmación de compra - Movil Express",
      html: formatEmailHtml(pedido, detalles)
    });

    // Enviar correo a Movil Express
    await sendMail({
      to: "movilexpressyopal1@gmail.com",
      subject: "Nueva compra recibida - Movil Express",
      html: formatEmailHtml(pedido, detalles)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error enviando notificaciones" }, { status: 500 });
  }
}
