
"use client"
export const dynamic = "force-dynamic";

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutDatosPage() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
    notas: "",
    total: "",
    numero_pedido: ""
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      // Leer detalles de productos
      const detalles = JSON.parse(localStorage.getItem("order_purchase_detalles") || "null");
      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        setError("Faltan datos del producto. Por favor, vuelve al carrito y repite el proceso.");
        setEnviando(false);
        return;
      }
      // Calcular total
      const total = detalles.reduce((acc: number, d: any) => acc + (d.precio_unitario * d.cantidad), 0);
      // Generar numero_pedido si no existe
      let numero_pedido = form.numero_pedido;
      if (!numero_pedido) {
        numero_pedido = detalles[0]?.numero_pedido || `ORD-${Date.now()}`;
      }
      // Construir objeto pedido con todos los campos requeridos
      const pedido = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        ciudad: form.ciudad,
        departamento: form.departamento,
        codigoPostal: form.codigoPostal,
        notas: form.notas,
        total,
        numero_pedido
      };
      // Guardar en localStorage para trazabilidad
      localStorage.setItem("order_purchase_pedido", JSON.stringify(pedido));
      const res = await fetch("/api/ordenes/datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedido, detalles }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Error guardando datos");

      setExito(true);
      alert("¡Formulario enviado correctamente! La compra ha sido finalizada.");
      setTimeout(() => router.replace("/catalogo"), 300);
    } catch (err: any) {
      setError(err.message || "Error enviando datos");
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-bold text-green-600 mb-4">¡Datos enviados!</h1>
        <p className="text-gray-700 mb-6 text-center max-w-md">
          Tus datos de envío han sido registrados correctamente.<br />
          Serás redirigido al catálogo en unos segundos.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl font-bold text-black mb-6">Datos para el envío</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={form.departamento}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          name="codigoPostal"
          placeholder="Código Postal"
          value={form.codigoPostal}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <textarea
          name="notas"
          placeholder="Notas adicionales (opcional)"
          value={form.notas}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#988443] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#8a7a3e] transition-all"
        >
          {enviando ? "Enviando..." : "Guardar datos de envío"}
        </button>
      </form>
    </div>
  );
}
