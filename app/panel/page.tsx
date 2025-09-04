"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelPedidos() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado (puedes mejorar esto con tu lógica de auth)
    const token = localStorage.getItem("panel_token");
    if (!token) {
      router.replace("/panel/login");
      return;
    }
    fetch("/api/panel/ordenes")
      .then(res => res.json())
      .then(data => {
        setOrdenes(data.ordenes || []);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Órdenes registradas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Teléfono</th>
              <th className="border px-4 py-2">Dirección</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Productos</th>
              <th className="border px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td className="border px-2 py-1 text-center">{orden.id}</td>
                <td className="border px-2 py-1">{orden.nombre}</td>
                <td className="border px-2 py-1">{orden.email}</td>
                <td className="border px-2 py-1">{orden.telefono}</td>
                <td className="border px-2 py-1">{orden.direccion}</td>
                <td className="border px-2 py-1 text-right">${orden.total}</td>
                <td className="border px-2 py-1">
                  <ul className="list-disc pl-4">
                    {orden.productos?.map((prod: any, idx: number) => (
                      <li key={idx}>{prod.nombre} x{prod.cantidad}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1">{orden.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
