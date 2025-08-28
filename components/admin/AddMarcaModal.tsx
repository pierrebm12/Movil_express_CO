"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddMarcaModal({ onCreated }: { onCreated?: (marca: any) => void }) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      const res = await fetch("/api/admin/marcas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion, logo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear marca");
      if (onCreated) onCreated({ id: data.data.id, nombre, descripcion, logo });
      setOpen(false);
      setNombre("");
      setDescripcion("");
      setLogo("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-blue-700 text-white">+ Nueva Marca</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Marca</DialogTitle>
          <DialogDescription>Registra una nueva marca para tus productos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 rounded" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <input className="w-full p-2 rounded" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <input className="w-full p-2 rounded" placeholder="URL Logo" value={logo} onChange={e => setLogo(e.target.value)} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
