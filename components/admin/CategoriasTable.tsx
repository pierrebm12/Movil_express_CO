"use client";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CategoryEditModal from "./CategoryEditModal";
import Image from "next/image";


import { forwardRef, useImperativeHandle } from "react";

const CategoriasTable = forwardRef(function CategoriasTable(props: { refreshKey?: number }, ref) {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editCat, setEditCat] = useState<any|null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      const res = await fetch("/api/admin/categorias", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategorias(data.data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar categorías");
      setCategorias([]);
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({ refresh: fetchCategorias }));

  useEffect(() => {
    fetchCategorias();
    // Solo se actualiza cuando refreshKey cambia
  }, [props.refreshKey]);

  if (loading) return <div className="text-center text-gray-500">Cargando categorías...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Eliminar categoría
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/categorias", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deleteId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Error al eliminar");
      setDeleteId(null);
      fetchCategorias();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
    setDeleteLoading(false);
  };

  return (
    <div className="border rounded p-4 bg-white text-black">
      <h2 className="text-xl font-bold mb-4">Categorías</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Orden</th>
            <th>Total productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat: any) => (
            <tr key={cat.id} className="border-b">
              <td>{cat.id}</td>
              <td>{cat.nombre}</td>
              <td>{cat.descripcion}</td>
              <td>
                {cat.imagen ? (
                  <Image src={cat.imagen} alt={cat.nombre} width={40} height={40} className="object-contain bg-white rounded" />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </td>
              <td>{cat.orden}</td>
              <td>{cat.total_productos || 0}</td>
              <td className="flex gap-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600" onClick={() => setEditCat(cat)}>Editar</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600" onClick={() => setDeleteId(cat.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        text="¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
      <CategoryEditModal
        open={!!editCat}
        onClose={() => setEditCat(null)}
        category={editCat}
        onSave={() => {
          setEditCat(null);
          fetchCategorias();
        }}
      />
    </div>
  );
});

export default CategoriasTable;
