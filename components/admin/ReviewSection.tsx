"use client";
import { useEffect, useState } from "react";
import type { ProductoReview } from "@/lib/reviews-crud";

export default function ReviewSection() {
  const [reviews, setReviews] = useState<ProductoReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<Partial<ProductoReview>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Partial<ProductoReview>>({});

  async function fetchReviews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.data || []);
    } catch (e) {
      setError("Error cargando reviews");
    }
    setLoading(false);
  }

  useEffect(() => { fetchReviews(); }, []);

  async function handleAdd() {
    if (!nuevo.producto_id || !nuevo.rating) return;
    setLoading(true);
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    setNuevo({});
    fetchReviews();
  }

  async function handleEdit(id: number) {
    setLoading(true);
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...edit, id }),
    });
    setEditId(null);
    setEdit({});
    fetchReviews();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchReviews();
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Reviews de Producto</h2>
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Producto ID</th>
            <th>Usuario ID</th>
            <th>Rating</th>
            <th>Comentario</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.producto_id}</td>
              <td>{c.usuario_id}</td>
              <td>
                {editId === c.id ? (
                  <input type="number" value={edit.rating ?? c.rating ?? 0} onChange={e => setEdit({ ...edit, rating: Number(e.target.value) })} />
                ) : c.rating}
              </td>
              <td>
                {editId === c.id ? (
                  <input value={edit.comentario ?? c.comentario ?? ""} onChange={e => setEdit({ ...edit, comentario: e.target.value })} />
                ) : c.comentario}
              </td>
              <td>{c.fecha}</td>
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
            <td><input value={nuevo.usuario_id ?? ""} onChange={e => setNuevo({ ...nuevo, usuario_id: Number(e.target.value) })} /></td>
            <td><input type="number" value={nuevo.rating ?? 0} onChange={e => setNuevo({ ...nuevo, rating: Number(e.target.value) })} /></td>
            <td><input value={nuevo.comentario ?? ""} onChange={e => setNuevo({ ...nuevo, comentario: e.target.value })} /></td>
            <td></td>
            <td><button onClick={handleAdd} className="text-green-600">Agregar</button></td>
          </tr>
        </tbody>
      </table>
      {loading && <div className="text-gray-500">Cargando...</div>}
    </section>
  );
}
