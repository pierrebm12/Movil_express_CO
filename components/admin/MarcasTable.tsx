"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MarcasTable() {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarcas = async () => {
    setLoading(true);
    try {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      const res = await fetch("/api/admin/marcas", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener marcas");
      const data = await res.json();
      setMarcas(data.data || []);
    } catch (err) {
      setMarcas([]);
      // Opcional: mostrar error en UI
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Marcas registradas</h2>
      {loading ? <div className="text-white">Cargando...</div> : (
        <table className="w-full text-sm text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((m: any) => (
              <tr key={m.id} className="border-b border-gray-700">
                <td>{m.id}</td>
                <td>
                  {m.logo ? (
                    <Image src={m.logo} alt={m.nombre} width={48} height={48} className="object-contain bg-white rounded" />
                  ) : (
                    <span className="text-gray-500">Sin logo</span>
                  )}
                </td>
                <td>{m.nombre}</td>
                <td>{m.descripcion}</td>
                <td>{m.activo ? "Sí" : "No"}</td>
                <td>
                  {/* Aquí puedes agregar botones de editar/eliminar marca si lo deseas */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button onClick={fetchMarcas} className="mt-4 bg-primary-500 text-black px-4 py-2 rounded">Actualizar</Button>
    </div>
  );
}
