
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

type BoldButtonProps = {
  boldToken: string;
  total: number;
};

export default function BoldButton({ boldToken, total }: BoldButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [integritySignature, setIntegritySignature] = useState("");
  const [orderId, setOrderId] = useState("");
  const carrito = useStore((state) => state.carrito);

  // Guardar datos de compra en localStorage antes de redirigir a Bold
  const saveOrderData = () => {
    // Guardar siempre el pedido y el orderId, aunque orderId sea una cadena vacía (pero solo si ya fue generado)
    const pedido = JSON.parse(localStorage.getItem("checkout_formData") || "null") || {};
    pedido.total = total;
    localStorage.setItem("order_purchase_pedido", JSON.stringify(pedido));
    if (orderId !== undefined) {
      localStorage.setItem("ultimo_pedido_id", orderId);
    }
    // Logs para depuración
    console.log("[BoldButton] Guardado en localStorage:", {
      order_purchase_pedido: pedido,
      ultimo_pedido_id: orderId
    });
  };

  // Forzar el guardado de orderId y detalles en localStorage cada vez que cambien
  useEffect(() => {
    saveOrderData();
  }, [orderId, carrito, total]);

  useEffect(() => {
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    fetch("/api/bold/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: newOrderId, amount: total, currency: "COP" })
    })
      .then(res => res.json())
      .then(data => {
        if (data.hash) setIntegritySignature(data.hash);
      });
  }, [total, boldToken]);

  useEffect(() => {
    if (!buttonRef.current || !integritySignature || !orderId) return;
    buttonRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.setAttribute("data-bold-button", "dark-L");
    script.setAttribute("data-api-key", boldToken);
    script.setAttribute("data-amount", total.toString());
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-order-id", orderId);
    script.setAttribute("data-description", "Compra en Movil Express");
    script.setAttribute("data-redirection-url", "https://movilexpressco.up.railway.app/checkout/datos");
    script.setAttribute("data-integrity-signature", integritySignature);
    // Guardar datos antes de redirigir (cuando el usuario hace click en el botón de Bold)
    script.addEventListener("click", saveOrderData);
    script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
    buttonRef.current.appendChild(script);
  }, [integritySignature, orderId, boldToken, total, carrito]);

  return (
    <div
      ref={buttonRef}
      className="w-full flex justify-center items-center min-h-[56px]"
    />
  );
}
