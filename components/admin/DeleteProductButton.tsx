"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DeleteProductButton({ id, onDeleted }: { id: number, onDeleted?: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (onDeleted) onDeleted();
        alert("Producto eliminado correctamente");
      } else {
        alert(data.error || "Error al eliminar producto");
      }
    } catch {
      alert("Error al eliminar producto");
    }
    setLoading(false);
  };
  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? "Eliminando..." : "Eliminar"}
    </Button>
  );
}
