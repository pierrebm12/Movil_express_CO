import { NextRequest, NextResponse } from "next/server";


// INSTRUCCIONES:
// 1. En el panel de Bold, configura la URL del webhook así:
//    https://4cr2vgnr-3000.use2.devtunnels.ms/api/bold/webhook
// 2. Cuando Bold confirme un pago, enviará un POST a esa URL.
// 3. Aquí puedes guardar la orden en tu base de datos, enviar emails, etc.

async function procesarPagoBold(payload: any) {
  // Ejemplo: guardar en base de datos, enviar email, etc.
  // console.log("Pago recibido de Bold:", payload);
  // Aquí puedes hacer lo que necesites con los datos del pago
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // Puedes validar aquí la firma si Bold la envía (seguridad extra)
    if (payload.status === "approved" || payload.status === "success") {
      await procesarPagoBold(payload);
    }
    // Siempre responde 200 OK para que Bold no reintente
    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
