"use client";
import { useEffect, useState } from "react";
import type { ProductoTag } from "@/lib/tags-crud";

export default function TagSection() {
  const [tags, setTags] = useState<ProductoTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<Partial<ProductoTag>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Partial<ProductoTag>>({});

  async function fetchTags() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data.data || []);
    } catch (e) {
      setError("Error cargando tags");
    }
    setLoading(false);
  }

  useEffect(() => { fetchTags(); }, []);

  async function handleAdd() {
    if (!nuevo.producto_id || !nuevo.nombre) return;
    setLoading(true);
    await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setNuevo({});
    fetchTags();
  }

  async function handleEdit(id: number) {
    setLoading(true);
    await fetch("/api/admin/tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...edit, id }),
    });
    setEditId(null);
    setEdit({});
    fetchTags();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch("/api/admin/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTags();
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Tags de Producto</h2>
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Producto ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((c) => (
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
            <td><button onClick={handleAdd} className="text-green-600">Agregar</button></td>
          </tr>
        </tbody>
      </table>
      {loading && <div className="text-gray-500">Cargando...</div>}
    </section>
  );
}
