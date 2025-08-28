"use client";
import { useEffect, useState } from "react";
import type { ProductoColor } from "@/lib/colores-crud";

export default function DashboardColores() {
  const [colores, setColores] = useState<ProductoColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColores() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/colores");
        const data = await res.json();
        setColores(data.data || []);
      } catch (e) {
        setError("Error cargando colores");
      }
      setLoading(false);
    }
    fetchColores();
  }, []);

  // Estadísticas simples
  const total = colores.length;
  const activos = colores.filter(c => c.activo).length;
  const stockTotal = colores.reduce((acc, c) => acc + (c.stock || 0), 0);
  const porProducto = colores.reduce((acc: Record<number, number>, c) => {
    acc[c.producto_id] = (acc[c.producto_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Dashboard de Colores</h2>
      {error && <div className="text-red-500">{error}</div>}
      {loading && <div className="text-gray-500">Cargando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-bold">Total de colores</div>
          <div className="text-3xl">{total}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-bold">Colores activos</div>
          <div className="text-3xl">{activos}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-bold">Stock total</div>
          <div className="text-3xl">{stockTotal}</div>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">Colores por producto</h3>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>Producto ID</th>
            <th>Cantidad de colores</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(porProducto).map(([pid, count]) => (
            <tr key={pid}>
              <td>{pid}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-xl font-bold mb-2">Tabla dinámica de colores</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Producto ID</th>
            <th>Nombre</th>
            <th>Hex</th>
            <th>Stock</th>
            <th>Precio Adic.</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {colores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.producto_id}</td>
              <td>{c.nombre}</td>
              <td>{c.codigo_hex}</td>
              <td>{c.stock}</td>
              <td>{c.precio_adicional}</td>
              <td>{c.activo ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
