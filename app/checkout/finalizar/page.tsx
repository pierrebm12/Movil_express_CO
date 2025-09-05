"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

export default function FinalizarCompra() {
  const [status, setStatus] = useState<"enviando"|"ok"|"error">("enviando");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Extraer datos de pedido y de envío
    const pedido = JSON.parse(localStorage.getItem("order_purchase_pedido") || "null");
    let detalles = [];
    try {
      const zustandState = JSON.parse(localStorage.getItem("movil-express-storage") || "null");
      if (zustandState && Array.isArray(zustandState.state?.carrito)) {
        detalles = zustandState.state.carrito.map((item: any) => ({
          ...item.producto,
          cantidad: item.cantidad,
          color: item.color
        }));
      }
    } catch (e) {}
    // Extraer datos de envío si existen
    let datosEnvio = null;
    try {
      datosEnvio = JSON.parse(localStorage.getItem("checkout_datos_envio") || "null");
    } catch (e) {}
    if (!pedido || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      setStatus("error");
      setMsg("No hay datos de la compra.");
      return;
    }
    // Unificar todos los datos en un solo objeto pedidoFinal
    const pedidoFinal = { ...pedido, ...(datosEnvio || {}) };
    // 1. Guardar en la base de datos
    // Asegurar que email, ciudad y total estén presentes
    const email = pedidoFinal.email || pedidoFinal.correo || (datosEnvio && datosEnvio.email) || "";
    const ciudad = pedidoFinal.ciudad || pedidoFinal.localidad || (datosEnvio && datosEnvio.ciudad) || "";
    let total = pedidoFinal.total;
    if (!total && Array.isArray(detalles)) {
      total = detalles.reduce((acc, item) => acc + ((item.precio_actual || 0) * (item.cantidad || 1)), 0);
    }
    fetch("/api/ordenes/datos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedidoId: pedidoFinal.pedidoId || pedidoFinal.id || `ORD-${Date.now()}`,
        nombre: pedidoFinal.nombre,
        direccion: pedidoFinal.direccion,
        telefono: pedidoFinal.telefono,
        email,
        ciudad,
        notas: pedidoFinal.notas,
        total,
        detalles
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // 2. Notificar por correo/whatsapp
          fetch("/api/order_purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pedido: pedidoFinal, detalles })
          })
            .then(res2 => res2.json())
            .then(data2 => {
              if (data2.success) {
                setStatus("ok");
                localStorage.removeItem("order_purchase_pedido");
                localStorage.removeItem("order_purchase_detalles");
                setTimeout(() => {
                  window.location.href = "/checkout/datos";
                }, 1200);
              } else {
                setStatus("error");
                setMsg(data2.error || "Error al notificar la compra.");
              }
            })
            .catch(() => {
              setStatus("error");
              setMsg("Error al notificar la compra.");
            });
          
        } else {
          setStatus("error");
          setMsg(data.error || "Error al guardar la orden.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMsg("Error al guardar la orden.");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] px-4">
      <Card className="max-w-md w-full bg-opacity-90 backdrop-blur-md border-0 shadow-2xl">
        <CardContent className="p-8 flex flex-col items-center">
          {status === "enviando" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mb-4 animate-spin">
                <Loader2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">Procesando compra...</h2>
              <p className="text-gray-200 text-center mb-4">Por favor espera un momento.</p>
            </>
          )}
          {status === "ok" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">¡Compra confirmada!</h2>
              <p className="text-gray-200 text-center mb-4">Revisa tu correo. Pronto te contactaremos.</p>
              <Link href="/catalogo">
                <span className="mt-2 bg-[#988443] text-white hover:bg-[#8a7a3e] rounded-xl px-6 py-2 cursor-pointer inline-block">Volver al catálogo</span>
              </Link>
              <Link href={status === "ok" ? "/catalogo" : "#"} legacyBehavior>
                <span
                  className={`mt-4 bg-[#232526] text-white rounded-xl px-6 py-2 inline-block ${status !== "ok" ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-[#414345] cursor-pointer"}`}
                >
                  Seguir comprando
                </span>
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-bounce">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">Ocurrió un error</h2>
              <p className="text-gray-200 text-center mb-4">{msg}</p>
              <Link href="/catalogo">
                <span className="mt-2 bg-[#988443] text-white hover:bg-[#8a7a3e] rounded-xl px-6 py-2 cursor-pointer inline-block">Volver al catálogo</span>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
