
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
  // Aquí se crea la llave order_purchase_detalles con los datos requeridos por la tabla orden_detalles
  const saveOrderData = () => {
    if (orderId !== undefined) {
      localStorage.setItem("ultimo_pedido_id", orderId);
    }
    // Extraer carrito desde movil-express-storage
    const storage = JSON.parse(localStorage.getItem("movil-express-storage") || "null");
    const carritoArr = storage?.state?.carrito || [];
    // Generar detalles para la tabla orden_detalles
    const detalles = carritoArr.map((item: any) => ({
      // id y orden_id se asignan en backend, aquí solo se preparan los datos
      producto_nombre: item.producto?.nombre || item.nombre,
      cantidad: item.cantidad,
      precio_unitario: Number(item.producto?.precio_actual || item.precio_actual || 0),
      numero_pedido: orderId
    }));
    localStorage.setItem("order_purchase_detalles", JSON.stringify(detalles));
    // Logs para depuración
    console.log("[BoldButton] Guardado en localStorage:", {
      ultimo_pedido_id: orderId,
      order_purchase_detalles: detalles
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
    // Extraer datos del cliente y productos
    const pedido = JSON.parse(localStorage.getItem("order_purchase_pedido") || "null");
    const detalles = JSON.parse(localStorage.getItem("order_purchase_detalles") || "null");
    // Construir customer y items para Bold
    const customer = pedido ? {
      name: pedido.nombre,
      email: pedido.email,
      phone: pedido.telefono,
      address: pedido.direccion,
      city: pedido.ciudad,
      state: pedido.departamento,
      zip: pedido.codigoPostal
    } : undefined;
    const items = Array.isArray(detalles) ? detalles.map((d: any) => ({
      name: d.producto_nombre,
      quantity: d.cantidad,
      price: d.precio_unitario
    })) : [];
    const script = document.createElement("script");
    script.setAttribute("data-bold-button", "dark-L");
    script.setAttribute("data-api-key", boldToken);
    script.setAttribute("data-amount", total.toString());
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-order-id", orderId);
    script.setAttribute("data-description", "Compra en Movil Express");
    script.setAttribute("data-redirection-url", "https://movilexpressco.up.railway.app/checkout/datos");
    script.setAttribute("data-integrity-signature", integritySignature);
  if (customer) script.setAttribute("data-customer", JSON.stringify(customer));
  if (items.length > 0) script.setAttribute("data-items", JSON.stringify(items));
  // Mensaje personalizado de agradecimiento
  script.setAttribute("data-message", "Gracias por comprar en Movil Express, en poco nuestros asesores te contactarán.");
  // Logo de Movil Express
  script.setAttribute("data-logo", "https://movilexpressco.up.railway.app/assets/logos/LogoBlanco.jpeg");
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
