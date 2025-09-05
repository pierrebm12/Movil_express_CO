
"use client"
export const dynamic = "force-dynamic";
// Utilidad para formatear precios en COP
function formatearPrecio(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });
}

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, User, CreditCard, Truck, Shield, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
// importación de MercadoPago eliminada para integración con BOLD
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"


export default function CheckoutPage() {
  // Estados para el formulario y navegación
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
    notas: "",
    metodoPago: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
    nombreTarjeta: ""
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Leer carrito desde localStorage si existe
  const [carrito, setCarrito] = useState<any[]>([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [cantidadItems, setCantidadItems] = useState(0);

  useEffect(() => {
    // Intentar leer el carrito desde localStorage
    const carritoLS = localStorage.getItem("checkout_carrito");
    if (carritoLS) {
      try {
        const arr = JSON.parse(carritoLS);
        // Aquí puedes unificar la estructura si es necesario y setear el carrito, total y cantidad
        setCarrito(arr);
        setCantidadItems(arr.reduce((acc: number, item: any) => acc + (item.cantidad || 1), 0));
        setTotalCarrito(arr.reduce((acc: number, item: any) => acc + ((item.precio || item.producto?.precio_actual || 0) * (item.cantidad || 1)), 0));
      } catch (e) {
        setCarrito([]);
        setCantidadItems(0);
        setTotalCarrito(0);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    const nuevosErrores: Record<string, string> = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido";
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido";
    if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "Email inválido";
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido";
    if (!formData.direccion.trim()) nuevosErrores.direccion = "La dirección es requerida";
    if (!formData.ciudad.trim()) nuevosErrores.ciudad = "La ciudad es requerida";
    if (!formData.departamento.trim()) nuevosErrores.departamento = "El departamento es requerido";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setLoading(true);
    try {
      // Extraer carrito desde localStorage (movil-express-storage) si existe
      let carritoSource = carrito;
      if (!carritoSource || carritoSource.length === 0) {
        const storage = JSON.parse(localStorage.getItem("movil-express-storage") || "null");
        carritoSource = storage?.state?.carrito || [];
      }
      // Generar detalles en el formato correcto
      const detalles = carritoSource.map((item: any) => ({
        producto_nombre: item.producto?.nombre || item.nombre,
        cantidad: item.cantidad,
        precio_unitario: Number(item.producto?.precio_actual || item.precio_actual || 0)
      }));
      // Guardar detalles en localStorage para trazabilidad
      localStorage.setItem("order_purchase_detalles", JSON.stringify(detalles));
      const total = detalles.reduce((acc: number, p: any) => acc + (p.precio_unitario * p.cantidad), 0);
      const pedido = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        codigoPostal: formData.codigoPostal,
        notas: formData.notas,
        total,
        numero_pedido: `ORD-${Date.now()}`
      };
      // Guardar pedido en localStorage para trazabilidad
      localStorage.setItem("order_purchase_pedido", JSON.stringify(pedido));
      const res = await fetch("/api/ordenes/datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedido, detalles }),
      });
      setLoading(false);
      const data = await res.json();
      if (data.success) setSuccess(true);
      else alert(data.error || "Error procesando la orden");
    } catch (err) {
      setLoading(false);
      alert("Error procesando la orden");
    }
  };

  if (carrito.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Header />
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Agrega productos antes de continuar con el pago.</p>
          <Link href="/catalogo">
            <Button className="bg-[#988443] text-white hover:bg-[#8a7a3e] px-8 py-3 rounded-2xl font-semibold">
              Ir al Catálogo
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] px-4">
        <Card className="max-w-md w-full bg-opacity-90 backdrop-blur-md border-0 shadow-2xl">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">¡Datos enviados!</h2>
            <p className="text-gray-200 text-center mb-4">En poco tiempo te contactamos para coordinar el envío.</p>
            <Button className="mt-2 bg-[#988443] text-white hover:bg-[#8a7a3e] rounded-xl px-6 py-2" onClick={() => window.location.href = "/"}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formulario futurista de datos de envío y usuario
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] px-2 py-8">
      <Card className="w-full max-w-lg bg-opacity-90 backdrop-blur-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-tight">Datos de Envío</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.nombre && <span className="text-red-500 text-xs">{errores.nombre}</span>}
              <input name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Apellido" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.apellido && <span className="text-red-500 text-xs">{errores.apellido}</span>}
              <input name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.email && <span className="text-red-500 text-xs">{errores.email}</span>}
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="Teléfono" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.telefono && <span className="text-red-500 text-xs">{errores.telefono}</span>}
              <input name="direccion" value={formData.direccion} onChange={handleInputChange} required placeholder="Dirección" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.direccion && <span className="text-red-500 text-xs">{errores.direccion}</span>}
              <input name="ciudad" value={formData.ciudad} onChange={handleInputChange} required placeholder="Ciudad" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.ciudad && <span className="text-red-500 text-xs">{errores.ciudad}</span>}
              <input name="departamento" value={formData.departamento} onChange={handleInputChange} required placeholder="Departamento" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              {errores.departamento && <span className="text-red-500 text-xs">{errores.departamento}</span>}
              <input name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} placeholder="Código Postal (opcional)" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition" />
              <textarea name="notas" value={formData.notas} onChange={handleInputChange} placeholder="Notas para el pedido (opcional)" className="rounded-xl px-4 py-3 bg-[#232526] text-white placeholder-gray-400 border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] transition resize-none min-h-[60px]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#988443] text-white hover:bg-[#8a7a3e] py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all mt-4">
              {loading ? "Enviando..." : "Confirmar Datos"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
