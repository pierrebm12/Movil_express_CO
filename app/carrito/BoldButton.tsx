
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
    // Puedes ajustar la estructura según tu flujo
    const detalles = carrito.map((item) => ({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      color: item.color,
      precio_actual: item.producto.precio_actual
    }));
    // Simula datos de envío (ajusta según tu flujo real)
    const pedido = JSON.parse(localStorage.getItem("checkout_formData") || "null") || {};
    pedido.total = total;
    localStorage.setItem("order_purchase_pedido", JSON.stringify(pedido));
    localStorage.setItem("order_purchase_detalles", JSON.stringify(detalles));
  };

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
    script.setAttribute("data-redirection-url", "https://movilexpressco.up.railway.app/checkout/finalizar");
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
