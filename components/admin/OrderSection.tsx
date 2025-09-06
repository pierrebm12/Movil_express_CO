"use client";
import { useEffect, useState } from "react";
import ConfirmedProductsSection from "./ConfirmedProductsSection";

type Order = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
  departamento?: string;
  codigoPostal?: string;
  notas?: string;
  total: number;
  fecha?: string;
  numero_pedido?: string;
};

type OrderDetail = {
  id: number;
  orden_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  numero_pedido: string;
};

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState<'ordenes' | 'confirmados'>('ordenes');
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [orderToDone, setOrderToDone] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Fetch all orders
  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/ordenes")
      .then((res) => res.json())
      .then((data) => {
        setOrders((data.ordenes as Order[]) || []);
        setLoading(false);
      });
  }, [refresh]);

  // Fetch order details when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      setLoading(true);
      fetch(`/api/admin/ordenes/${selectedOrder.id}/detalles`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails((data.detalles as OrderDetail[]) || []);
          setLoading(false);
        });
    }
  }, [selectedOrder]);

  const handleDelete = async () => {
    if (!orderToDelete) return;
    setLoading(true);
    await fetch(`/api/admin/ordenes/${orderToDelete.id}`, { method: "DELETE" });
    setSelectedOrder(null);
    setRefresh((r) => r + 1);
    setLoading(false);
    setShowDeleteModal(false);
    setOrderToDelete(null);
    alert("Orden eliminada correctamente.");
  };

  const handleMarkAsDone = async () => {
    if (!orderToDone) return;
    setLoading(true);
    await fetch(`/api/admin/ordenes/${orderToDone.id}/confirmar`, { method: "POST" });
    setRefresh((r) => r + 1);
    setLoading(false);
    setShowDoneModal(false);
    setOrderToDone(null);
    alert("Orden marcada como completada.");
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#232526] to-[#414345] py-8 px-2">
      <div className="w-full max-w-6xl flex gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-t-xl font-bold text-lg shadow-md transition-all border-b-4 ${activeTab === 'ordenes' ? 'bg-white text-[#988443] border-[#988443]' : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300'}`}
          onClick={() => setActiveTab('ordenes')}
        >
          Órdenes
        </button>
        <button
          className={`px-6 py-3 rounded-t-xl font-bold text-lg shadow-md transition-all border-b-4 ${activeTab === 'confirmados' ? 'bg-white text-[#988443] border-[#988443]' : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300'}`}
          onClick={() => setActiveTab('confirmados')}
        >
          Productos Confirmados
        </button>
      </div>
      {activeTab === 'ordenes' ? (
        <>{/* ...existing code for orders table, modals, and details... */}
        {/* Coloca aquí el contenido de la sección de órdenes (lo que estaba antes en el return) */}
        </>
      ) : (
        <ConfirmedProductsSection />
      )}
    </section>
  );
}
