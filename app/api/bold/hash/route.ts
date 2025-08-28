import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { orderId, amount, currency } = await req.json();
  const secret = process.env.BOLD_SECRET;
  if (!orderId || !amount || !currency || !secret) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }
  const cadena = `${orderId}${amount}${currency}${secret}`;
  const hash = crypto.createHash("sha256").update(cadena).digest("hex");
  return NextResponse.json({ hash });
}
