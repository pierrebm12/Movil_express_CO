"use client";
import { useEffect, useState } from "react";
import type { ProductoCaracteristica } from "@/lib/caracteristicas-crud";

export default function CaracteristicaSection() {
  const [caracteristicas, setCaracteristicas] = useState<ProductoCaracteristica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<Partial<ProductoCaracteristica>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Partial<ProductoCaracteristica>>({});

  async function fetchCaracteristicas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/caracteristicas");
      const data = await res.json();
      setCaracteristicas(data.data || []);
    } catch (e) {
      setError("Error cargando características");
    }
    setLoading(false);
  }

  useEffect(() => { fetchCaracteristicas(); }, []);

  async function handleAdd() {
    if (!nuevo.producto_id || !nuevo.nombre || !nuevo.valor) return;
    setLoading(true);
    await fetch("/api/admin/caracteristicas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setNuevo({});
    fetchCaracteristicas();
  }

  async function handleEdit(id: number) {
    setLoading(true);
    await fetch("/api/admin/caracteristicas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...edit, id }),
    });
    setEditId(null);
    setEdit({});
    fetchCaracteristicas();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch("/api/admin/caracteristicas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCaracteristicas();
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Características de Producto</h2>
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Producto ID</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th>Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {caracteristicas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.producto_id}</td>
              <td>
                {editId === c.id ? (
                  <input value={edit.nombre ?? ""} onChange={e => setEdit({ ...edit, nombre: e.target.value })} />
                ) : c.nombre}
              </td>
              <td>
                {editId === c.id ? (
                  <input value={edit.valor ?? ""} onChange={e => setEdit({ ...edit, valor: e.target.value })} />
                ) : c.valor}
              </td>
              <td>
                {editId === c.id ? (
                  <input type="number" value={edit.orden ?? c.orden ?? 0} onChange={e => setEdit({ ...edit, orden: Number(e.target.value) })} />
                ) : c.orden}
              </td>
              <td>
                {editId === c.id ? (
                  <>
                    <button onClick={() => handleEdit(c.id!)} className="text-green-600 mr-2">Guardar</button>
                    <button onClick={() => { setEditId(null); setEdit({}); }} className="text-gray-600">Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(c.id!); setEdit(c); }} className="text-blue-600 mr-2">Editar</button>
                    <button onClick={() => handleDelete(c.id!)} className="text-red-600">Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td><input value={nuevo.producto_id ?? ""} onChange={e => setNuevo({ ...nuevo, producto_id: Number(e.target.value) })} /></td>
            <td><input value={nuevo.nombre ?? ""} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} /></td>
            <td><input value={nuevo.valor ?? ""} onChange={e => setNuevo({ ...nuevo, valor: e.target.value })} /></td>
            <td><input type="number" value={nuevo.orden ?? 0} onChange={e => setNuevo({ ...nuevo, orden: Number(e.target.value) })} /></td>
            <td><button onClick={handleAdd} className="text-green-600">Agregar</button></td>
          </tr>
        </tbody>
      </table>
      {loading && <div className="text-gray-500">Cargando...</div>}
    </section>
  );
}
