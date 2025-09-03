"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import EditProductModal from "@/components/admin/EditProductModal";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

// Permite que el padre controle el refresco de la tabla
const ProductTable = forwardRef(function ProductTable(props: { refreshKey?: number }, ref) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      const res = await fetch("/api/admin/productos", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (err) {
      setProductos([]);
      // Opcional: mostrar error en UI
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchProductos
  }));

  useEffect(() => {
    fetchProductos();
    // Solo se actualiza cuando refreshKey cambia
  }, [props.refreshKey]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Productos en la base de datos</h2>
      {loading ? <div className="text-white">Cargando...</div> : (
        <table className="w-full text-sm text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Marca</th>
              <th>Logo Marca</th>
              <th>Categoría</th>
              <th>Imagen Cat.</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-700">
                <td>{p.id}</td>
                <td>
                  {p.imagen_principal ? (
                    <Image src={p.imagen_principal} alt={p.nombre} width={48} height={48} className="object-contain rounded bg-white" />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td>{p.nombre}</td>
                <td>{p.precio_actual}</td>
                <td>{p.stock}</td>
                <td>{p.marca_nombre || p.marca_id}</td>
                <td>
                  {p.marca_logo ? (
                    <Image src={p.marca_logo} alt={p.marca_nombre || "Logo"} width={32} height={32} className="object-contain bg-white rounded" />
                  ) : (
                    <span className="text-gray-500">Sin logo</span>
                  )}
                </td>
                <td>
                  {Array.isArray(p.categorias) && p.categorias.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {p.categorias.map((cat: any) => (
                        <li key={cat.id}>{cat.nombre}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">Sin categoría</span>
                  )}
                </td>
                <td>
                  {Array.isArray(p.categorias) && p.categorias.length > 0 ? (
                    <div className="flex gap-1">
                      {p.categorias.map((cat: any) => (
                        cat.imagen ? (
                          <Image key={cat.id} src={cat.imagen} alt={cat.nombre} width={32} height={32} className="object-contain bg-white rounded" />
                        ) : (
                          <span key={cat.id} className="text-gray-500">Sin imagen</span>
                        )
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td>{p.destacado ? "Sí" : "No"}</td>
                <td className="flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setSelectedProduct(p);
                      setEditModalOpen(false);
                      setTimeout(() => setEditModalOpen(true), 0);
                    }}
                  >Editar</button>
                  <DeleteProductButton id={p.id} onDeleted={fetchProductos} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={fetchProductos} className="mt-4 bg-primary-500 text-black px-4 py-2 rounded">Actualizar</button>
      {editModalOpen && selectedProduct && (
        <EditProductModal
          key={selectedProduct.id}
          producto={selectedProduct}
          onUpdated={() => {
            setEditModalOpen(false);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
});

export default ProductTable;
