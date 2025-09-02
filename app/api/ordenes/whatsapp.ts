import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.TWILIO_WHATSAPP_TO;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pedido, detalles, datosEnvio } = body;
    if (!pedido || !detalles || !datosEnvio) {
      return NextResponse.json({ success: false, error: "Faltan datos para notificar por WhatsApp" }, { status: 400 });
    }

    if (!accountSid || !authToken || !whatsappFrom || !whatsappTo) {
      return NextResponse.json({ success: false, error: "Faltan variables de entorno de Twilio" }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    const mensaje = `✅ *Pago exitoso en Movil Express*\n\n*Datos del cliente:*\nNombre: ${datosEnvio.nombre}\nTeléfono: ${datosEnvio.telefono}\nEmail: ${datosEnvio.email}\nCiudad: ${datosEnvio.ciudad}\nDirección: ${datosEnvio.direccion}\nNotas: ${datosEnvio.notas || "-"}\n\n*Productos comprados:*\n${detalles.map((item: any) => `- ${item.cantidad} x ${item.producto.nombre} (${item.producto.precio_actual} c/u)`).join("\n")}\n\nTotal: ${pedido.total}\n\nProceder al envío del producto.`;

    await client.messages.create({
      from: `whatsapp:${whatsappFrom}`,
      to: `whatsapp:${whatsappTo}`,
      body: mensaje,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
