"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddCategoriaModal({ onCreated }: { onCreated?: (categoria: any) => void }) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [orden, setOrden] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Eliminar el campo 'activo' del fetch y del formulario
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      // Solo enviar los campos válidos según la tabla 'categorias'
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion, imagen, orden }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear categoría");
      if (onCreated) onCreated({ id: data.data.id, nombre, descripcion, imagen, orden });
      setOpen(false);
      setNombre("");
      setDescripcion("");
      setImagen("");
      setOrden(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-blue-700 text-white">+ Nueva Categoría</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Categoría</DialogTitle>
          <DialogDescription>Registra una nueva categoría para tus productos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 rounded" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <input className="w-full p-2 rounded" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <input className="w-full p-2 rounded" placeholder="URL Imagen" value={imagen} onChange={e => setImagen(e.target.value)} />
          <input className="w-full p-2 rounded" placeholder="Orden" type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} min={1} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
