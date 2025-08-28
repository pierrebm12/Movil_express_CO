"use client";
import React, { useState } from "react";

interface CategoryEditModalProps {
  open: boolean;
  onClose: () => void;
  category: any;
  onSave: () => void;
}

export default function CategoryEditModal({ open, onClose, category, onSave }: CategoryEditModalProps) {
  const [form, setForm] = useState({
    nombre: category?.nombre || "",
    descripcion: category?.descripcion || "",
    imagen: category?.imagen || "",
    orden: category?.orden || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Actualiza el form si cambia la categoría
  React.useEffect(() => {
    setForm({
      nombre: category?.nombre || "",
      descripcion: category?.descripcion || "",
      imagen: category?.imagen || "",
      orden: category?.orden || 0,
    });
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/categorias", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: category.id, ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error al editar");
      onSave();
    } catch (err: any) {
      setError(err?.message || "Error al editar");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Editar categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Imagen (URL)</label>
            <input name="imagen" value={form.imagen} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Orden</label>
            <input name="orden" type="number" value={form.orden} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
