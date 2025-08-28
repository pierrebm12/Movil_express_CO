"use client";
import { useEffect, useState } from "react";
import type { ProductoColor } from "@/lib/colores-crud";

export default function ColorSection() {
  const [colores, setColores] = useState<ProductoColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<Partial<ProductoColor>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Partial<ProductoColor>>({});

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

  useEffect(() => { fetchColores(); }, []);

  async function handleAdd() {
    if (!nuevo.producto_id || !nuevo.nombre) return;
    setLoading(true);
    await fetch("/api/admin/colores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setNuevo({});
    fetchColores();
  }

  async function handleEdit(id: number) {
    setLoading(true);
    await fetch("/api/admin/colores", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...edit, id }),
    });
    setEditId(null);
    setEdit({});
    fetchColores();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch("/api/admin/colores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchColores();
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Colores de Producto</h2>
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Producto ID</th>
            <th>Nombre</th>
            <th>Hex</th>
            <th>Stock</th>
            <th>Precio Adic.</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colores.map((c) => (
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
                  <input value={edit.codigo_hex ?? ""} onChange={e => setEdit({ ...edit, codigo_hex: e.target.value })} />
                ) : c.codigo_hex}
              </td>
              <td>
                {editId === c.id ? (
                  <input type="number" value={edit.stock ?? c.stock ?? 0} onChange={e => setEdit({ ...edit, stock: Number(e.target.value) })} />
                ) : c.stock}
              </td>
              <td>
                {editId === c.id ? (
                  <input type="number" value={edit.precio_adicional ?? c.precio_adicional ?? 0} onChange={e => setEdit({ ...edit, precio_adicional: Number(e.target.value) })} />
                ) : c.precio_adicional}
              </td>
              <td>
                {editId === c.id ? (
                  <select value={edit.activo ?? c.activo ? "1" : "0"} onChange={e => setEdit({ ...edit, activo: e.target.value === "1" })}>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                ) : c.activo ? "Sí" : "No"}
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
            <td><input value={nuevo.codigo_hex ?? ""} onChange={e => setNuevo({ ...nuevo, codigo_hex: e.target.value })} /></td>
            <td><input type="number" value={nuevo.stock ?? 0} onChange={e => setNuevo({ ...nuevo, stock: Number(e.target.value) })} /></td>
            <td><input type="number" value={nuevo.precio_adicional ?? 0} onChange={e => setNuevo({ ...nuevo, precio_adicional: Number(e.target.value) })} /></td>
            <td>
              <select value={nuevo.activo === false ? "0" : "1"} onChange={e => setNuevo({ ...nuevo, activo: e.target.value === "1" })}>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </td>
            <td><button onClick={handleAdd} className="text-green-600">Agregar</button></td>
          </tr>
        </tbody>
      </table>
      {loading && <div className="text-gray-500">Cargando...</div>}
    </section>
  );
}
