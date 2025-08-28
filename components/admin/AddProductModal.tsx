"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddProductForm from "@/components/addProductForm";

export default function AddProductModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        const [catRes, marRes] = await Promise.all([
          fetch("/api/admin/categorias", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("/api/admin/marcas", { headers: { "Authorization": `Bearer ${token}` } })
        ]);
        const catData = await catRes.json();
        const marData = await marRes.json();
        setCategorias(catData.data || []);
        setMarcas(marData.data || []);
      } catch {
        setCategorias([]);
        setMarcas([]);
      }
      setLoading(false);
    };
    if (open) fetchData();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow">
          + Agregar producto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar nuevo producto</DialogTitle>
          <DialogDescription>Completa el formulario para registrar un nuevo producto en la tienda.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {loading ? (
            <div className="text-center text-gray-400">Cargando...</div>
          ) : (
            <AddProductForm categorias={categorias} marcas={marcas} onSubmit={() => { setOpen(false); if (onCreated) onCreated(); }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
