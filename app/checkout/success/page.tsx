

"use client"
export const dynamic = "force-dynamic";


import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const [enviando, setEnviando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    async function enviarOrden() {
      try {
        const pedido = JSON.parse(localStorage.getItem("checkout_pedido") || "null");
        const detalles = JSON.parse(localStorage.getItem("checkout_detalles") || "null");
        if (!pedido || !detalles) throw new Error("No hay datos de la orden");
        // Enviar orden a la API
        const res = await fetch("/api/ordenes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pedido, detalles })
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Error creando orden");
        // Enviar correo al usuario
        await fetch("/api/ordenes/notificar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pedido, detalles })
        });
        localStorage.removeItem("checkout_pedido");
        localStorage.removeItem("checkout_detalles");
        localStorage.removeItem("checkout_carrito");
        localStorage.removeItem("checkout_formData");
        setExito(true);
      } catch (err: any) {
        setError(err.message || "Error procesando la orden");
      } finally {
        setEnviando(false);
      }
    }
    enviarOrden();
  }, []);

  if (enviando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
        <CheckCircle className="w-20 h-20 text-primary-500 mb-6 animate-spin drop-shadow-xl" />
        <h1 className="text-3xl font-bold text-primary-700 mb-4">Procesando tu compra...</h1>
        <p className="text-gray-700 mb-6 text-center max-w-md">Por favor espera un momento.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-primary-50 px-4">
        <CheckCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-xl animate-bounce" />
        <h1 className="text-3xl font-bold text-red-700 mb-4">Ocurrió un error</h1>
        <p className="text-gray-700 mb-6 text-center max-w-md">{error}</p>
        <Link href="/catalogo">
          <span className="inline-block bg-primary-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary-600 transition-all shadow-lg">Volver al catálogo</span>
        </Link>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-primary-50 px-4">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6 drop-shadow-xl animate-bounce" />
        <h1 className="text-4xl font-bold text-primary-700 mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-700 mb-6 text-center max-w-md">
          Tu compra ha sido confirmada y procesada correctamente.<br />
          Pronto recibirás un correo con los detalles de tu pedido.
        </p>
        <Link href="/catalogo">
          <span className="inline-block bg-primary-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary-600 transition-all shadow-lg">Volver al catálogo</span>
        </Link>
      </div>
    );
  }

  return null;
}
