"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddProductForm from "@/components/addProductForm";

export default function EditProductModal({ producto, onUpdated }: { producto: any, onUpdated?: () => void }) {

  const [open, setOpen] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Al abrir el modal, obtener el producto completo y cat/marcas
  useEffect(() => {
    if (open) {
      const fetchAll = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("admin_token");
          // Obtener producto completo
          const prodRes = await fetch(`/api/admin/productos/${producto.id}`, { headers: { "Authorization": `Bearer ${token}` } });
          const prodData = await prodRes.json();
          setInitialData(prodData.data || producto);
          // Obtener categorías y marcas
          const [catRes, marRes] = await Promise.all([
            fetch("/api/admin/categorias", { headers: { "Authorization": `Bearer ${token}` } }),
            fetch("/api/admin/marcas", { headers: { "Authorization": `Bearer ${token}` } })
          ]);
          const catData = await catRes.json();
          const marData = await marRes.json();
          setCategorias(catData.data || []);
          setMarcas(marData.data || []);
        } catch {
          setInitialData(producto);
          setCategorias([]);
          setMarcas([]);
        }
        setLoading(false);
      };
      fetchAll();
    }
  }, [open, producto]);

  const handleSubmit = async (result: any) => {
    if (onUpdated) onUpdated();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Modifica los datos del producto y guarda los cambios.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {loading ? (
            <div className="text-center text-gray-400">Cargando...</div>
          ) : (
            initialData && <AddProductForm initialData={initialData} categorias={categorias} marcas={marcas} isEdit onSubmit={handleSubmit} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
