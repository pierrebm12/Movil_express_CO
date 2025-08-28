
"use client";
import CarritoClient from "./CarritoClient";


export default function CarritoPage() {
  const boldToken = process.env.NEXT_PUBLIC_BOLD_IDENTITY || "";
  return <CarritoClient boldToken={boldToken} />;
}
