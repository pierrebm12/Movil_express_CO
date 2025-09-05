"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PanelPedidos() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    productoId: "",
    facturaId: "",
    email: "",
    telefono: "",
    nombre: ""
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const fetchOrdenes = () => {
    fetch("/api/panel/ordenes")
      .then(res => res.json())
      .then(data => {
        setOrdenes(data.ordenes || []);
        setLoading(false);
      });
  };

  // Filtrar las órdenes según los campos
  const ordenesFiltradas = ordenes.filter((orden) => {
    const matchProducto = filtro.productoId
      ? orden.productos?.some((prod: any) => String(prod.id || "").includes(filtro.productoId))
      : true;
    const matchFactura = filtro.facturaId
      ? String(orden.id || "").includes(filtro.facturaId)
      : true;
    const matchEmail = filtro.email
      ? orden.email?.toLowerCase().includes(filtro.email.toLowerCase())
      : true;
    const matchTelefono = filtro.telefono
      ? orden.telefono?.includes(filtro.telefono)
      : true;
    const matchNombre = filtro.nombre
      ? orden.nombre?.toLowerCase().includes(filtro.nombre.toLowerCase())
      : true;
    return matchProducto && matchFactura && matchEmail && matchTelefono && matchNombre;
  });

  useEffect(() => {
    const token = localStorage.getItem("panel_token");
    const rol = localStorage.getItem("panel_rol");
    if (!token || rol !== "cliente") {
      router.replace("/panel/login");
      return;
    }
    fetchOrdenes();
    intervalRef.current = setInterval(fetchOrdenes, 10000); // Actualiza cada 10s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-[#232526] to-[#988443] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Control de Ventas y Logística</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="ID Producto"
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.productoId}
          onChange={e => setFiltro(f => ({ ...f, productoId: e.target.value }))}
        />
        <input
          type="text"
          placeholder="ID Factura"
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.facturaId}
          onChange={e => setFiltro(f => ({ ...f, facturaId: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Correo"
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.email}
          onChange={e => setFiltro(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.telefono}
          onChange={e => setFiltro(f => ({ ...f, telefono: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Nombre"
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.nombre}
          onChange={e => setFiltro(f => ({ ...f, nombre: e.target.value }))}
        />
        <button
          onClick={fetchOrdenes}
          className="px-6 py-2 bg-[#988443] text-white rounded-xl hover:bg-[#8a7a3e] shadow-lg"
        >
          Refrescar tabla
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full border border-[#988443]">
          <thead className="bg-[#232526] text-white">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Teléfono</th>
              <th className="border px-4 py-2">Dirección</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Productos</th>
              <th className="border px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map((orden) => (
              <tr key={orden.id} className="hover:bg-[#f6f3e7] transition">
                <td className="border px-2 py-1 text-center font-bold text-[#988443]">{orden.id}</td>
                <td className="border px-2 py-1">{orden.nombre}</td>
                <td className="border px-2 py-1">{orden.email}</td>
                <td className="border px-2 py-1">{orden.telefono}</td>
                <td className="border px-2 py-1">{orden.direccion}</td>
                <td className="border px-2 py-1 text-right text-green-700 font-bold">${orden.total}</td>
                <td className="border px-2 py-1">
                  <ul className="list-disc pl-4">
                    {orden.productos?.map((prod: any, idx: number) => (
                      <li key={idx} className="text-[#232526]">{prod.nombre} x{prod.cantidad}</li>
                    ))}
                  </ul>
                  {orden.estado !== "preparado" && (
                    <button
                      className="mt-2 px-4 py-1 bg-green-600 text-white rounded-xl hover:bg-green-700"
                      onClick={async () => {
                        await fetch("/api/panel/preparar", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orden_id: orden.id, productos: orden.productos })
                        });
                        fetchOrdenes();
                      }}
                    >
                      Hecho
                    </button>
                  )}
                  {orden.estado === "preparado" && (
                    <span className="mt-2 px-4 py-1 bg-[#988443] text-white rounded-xl inline-block">Preparado</span>
                  )}
                </td>
                <td className="border px-2 py-1">{orden.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
