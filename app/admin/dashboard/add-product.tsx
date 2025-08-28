"use client";
import { useState } from "react";

export default function AddProductForm() {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    caracteristicas: "",
    tags: "",
    imagenes: [] as File[],
  });
  const [message, setMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, imagenes: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setHasSubmitted(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      // Usar FormData para enviar imágenes y campos
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("precioActual", form.precio); // nombre esperado por backend
      formData.append("descripcion", form.descripcion);
      formData.append("caracteristicas", form.caracteristicas);
      formData.append("tags", form.tags);
      // Puedes agregar más campos aquí según tu modelo (marca_id, capacidad, etc)
      form.imagenes.forEach((file) => {
        formData.append("imagenes", file);
      });
      const res = await fetch("/api/admin/productos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar producto");
      setMessage("Producto agregado correctamente");
      setForm({ nombre: "", precio: "", descripcion: "", caracteristicas: "", tags: "", imagenes: [] });
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agregar producto</h2>
      {hasSubmitted && message && <div className="mb-4 text-blue-600">{message}</div>}
      <input
        name="nombre"
        placeholder="Nombre"
        className="w-full mb-3 p-2 border rounded"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        name="precio"
        placeholder="Precio"
        type="number"
        className="w-full mb-3 p-2 border rounded"
        value={form.precio}
        onChange={handleChange}
        required
      />
      <textarea
        name="descripcion"
        placeholder="Descripción"
        className="w-full mb-3 p-2 border rounded"
        value={form.descripcion}
        onChange={handleChange}
        required
      />
      <textarea
        name="caracteristicas"
        placeholder="Características (separadas por salto de línea)"
        className="w-full mb-3 p-2 border rounded"
        value={form.caracteristicas}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (separados por coma)"
        className="w-full mb-3 p-2 border rounded"
        value={form.tags}
        onChange={handleChange}
      />
      <input
        name="imagenes"
        type="file"
        multiple
        className="w-full mb-3"
        onChange={handleFileChange}
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Agregar producto"}
      </button>
    </form>
  );
}
