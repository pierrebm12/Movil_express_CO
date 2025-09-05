"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PanelAdmin() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [preparados, setPreparados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    productoId: "",
    facturaId: "",
    email: "",
    telefono: "",
    nombre: "",
    estadoProducto: ""
  });
  const [estadosProductos, setEstadosProductos] = useState<Record<number, string>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch all orders and prepared products
  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/panel/ordenes_admin");
    const data = await res.json();
    setOrdenes(data.ordenes || []);
    setPreparados(data.preparados || []);
    setLoading(false);
    // Fetch product states for all unique product IDs
    const allIds = [
      ...new Set([
        ...((data.ordenes || []).flatMap((o: any) => o.productos?.map((p: any) => p.id) || [])),
        ...((data.preparados || []).map((p: any) => p.producto_id || p.id))
      ].filter(Boolean))
    ];
    if (allIds.length) {
      const estadosRes = await fetch(`/api/panel/productos_estado?ids=${allIds.join(",")}`);
      const estadosData = await estadosRes.json();
      const estadosMap: Record<number, string> = {};
      (estadosData.productos || []).forEach((prod: any) => {
        estadosMap[prod.id] = prod.estado;
      });
      setEstadosProductos(estadosMap);
    }
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
    const matchEstado = filtro.estadoProducto
      ? orden.productos?.some((prod: any) => estadosProductos[prod.id] === filtro.estadoProducto)
      : true;
    return matchProducto && matchFactura && matchEmail && matchTelefono && matchNombre && matchEstado;
  });

  useEffect(() => {
    const token = localStorage.getItem("panel_token");
    const rol = localStorage.getItem("panel_rol");
    if (!token || rol !== "admin") {
      router.replace("/panel/login");
      return;
    }
    fetchData();
    intervalRef.current = setInterval(fetchData, 10000); // Actualiza cada 10s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-[#232526] to-[#988443] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Panel Administrativo - Pedidos y Logística</h1>
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
        <select
          className="px-4 py-2 rounded-xl border border-[#988443]"
          value={filtro.estadoProducto}
          onChange={e => setFiltro(f => ({ ...f, estadoProducto: e.target.value }))}
        >
          <option value="">Todos</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
          <option value="Reacondicionado">Reacondicionado</option>
        </select>
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-[#988443] text-white rounded-xl hover:bg-[#8a7a3e] shadow-lg"
        >
          Refrescar tabla
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white mb-8">
        <h2 className="text-xl font-bold p-4 text-[#232526]">Órdenes</h2>
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
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Acciones</th>
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
                      <li key={idx} className="text-[#232526]">
                        {prod.nombre} x{prod.cantidad} <span className="ml-2 text-xs text-gray-500">[{estadosProductos[prod.id] || "-"}]</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1">{orden.fecha}</td>
                <td className="border px-2 py-1">{orden.estado}</td>
                <td className="border px-2 py-1 flex flex-col gap-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      // Editar orden (puedes abrir modal aquí)
                    }}
                  >Editar</button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={async () => {
                      if (confirm("¿Seguro que deseas eliminar esta orden?")) {
                        await fetch("/api/panel/ordenes_admin", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: orden.id })
                        });
                        fetchData();
                      }
                    }}
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <h2 className="text-xl font-bold p-4 text-[#232526]">Productos Preparados</h2>
        <table className="min-w-full border border-[#988443]">
          <thead className="bg-[#232526] text-white">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Orden</th>
              <th className="border px-4 py-2">Producto</th>
              <th className="border px-4 py-2">Cantidad</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Teléfono</th>
              <th className="border px-4 py-2">Fecha preparado</th>
            </tr>
          </thead>
          <tbody>
            {preparados.map((prep: any) => (
              <tr key={prep.id} className="hover:bg-[#f6f3e7] transition">
                <td className="border px-2 py-1 text-center font-bold text-[#988443]">{prep.id}</td>
                <td className="border px-2 py-1">{prep.orden_id}</td>
                <td className="border px-2 py-1">{prep.producto_nombre}</td>
                <td className="border px-2 py-1">{prep.cantidad}</td>
                <td className="border px-2 py-1">{estadosProductos[prep.producto_id || prep.id] || "-"}</td>
                <td className="border px-2 py-1">{prep.cliente}</td>
                <td className="border px-2 py-1">{prep.email}</td>
                <td className="border px-2 py-1">{prep.telefono}</td>
                <td className="border px-2 py-1">{prep.fecha_preparado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
