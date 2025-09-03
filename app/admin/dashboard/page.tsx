"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "./add-product";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Solo ejecutar en cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin/login");
        return;
      }
      setAdmin({ nombre: "Administrador" });
      setLoading(false);
    }
  }, [router]);

  if (!isClient || loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p>Bienvenido, {admin?.nombre}</p>
      <div className="mt-8">
        <AddProductForm />
      </div>
    </div>
  );
}
