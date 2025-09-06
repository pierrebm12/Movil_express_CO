"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";

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
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#988443] tracking-wide drop-shadow-lg">Órdenes</h2>
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por número de factura (pedido)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] bg-white text-gray-800 shadow-md"
          />
        </div>
      </div>
      {loading && <div className="text-lg text-[#988443] font-semibold animate-pulse">Cargando...</div>}
      <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl p-6 mb-10 border border-[#988443] backdrop-blur-md">
        <table className="w-full text-center luxury-table">
          <thead>
            <tr className="bg-[#988443] text-white">
              <th className="py-3 px-2">ID</th>
              <th className="py-3 px-2">Factura</th>
              <th className="py-3 px-2">Cliente</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Teléfono</th>
              <th className="py-3 px-2">Dirección</th>
              <th className="py-3 px-2">Ciudad</th>
              <th className="py-3 px-2">Departamento</th>
              <th className="py-3 px-2">Código Postal</th>
              <th className="py-3 px-2">Notas</th>
              <th className="py-3 px-2">Total</th>
              <th className="py-3 px-2">Fecha</th>
              <th className="py-3 px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter(order =>
                !search || (order.numero_pedido || "").toLowerCase().includes(search.toLowerCase())
              )
              .map((order) => (
                <tr
                  key={order.id}
                  className={`transition-all duration-200 ${selectedOrder?.id === order.id ? "bg-[#f7f3e3]" : "hover:bg-[#f5e9c6]"}`}
                >
                  <td className="py-2 px-2 font-semibold">{order.id}</td>
                  <td className="py-2 px-2">{order.numero_pedido || <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2">{order.nombre}</td>
                  <td className="py-2 px-2">{order.email}</td>
                  <td className="py-2 px-2">{order.telefono}</td>
                  <td className="py-2 px-2">{order.direccion}</td>
                  <td className="py-2 px-2">{order.ciudad || <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2">{order.departamento || <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2">{order.codigoPostal || <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2">{order.notas || <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2 text-[#988443] font-bold">{order.total.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                  <td className="py-2 px-2">{order.fecha ? new Date(order.fecha).toLocaleString() : <span className="text-gray-400">-</span>}</td>
                  <td className="py-2 px-2 flex flex-wrap gap-2 justify-center items-center">
                    <button
                      className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="luxury-btn bg-yellow-500 text-white hover:bg-yellow-600 transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                      onClick={() => { setOrderToEdit(order); setShowEditModal(true); }}
                    >
                      Editar
                    </button>
                    <button
                      className="luxury-btn bg-red-600 text-white hover:bg-red-700 transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                      onClick={() => { setOrderToDelete(order); setShowDeleteModal(true); }}
                    >
                      Eliminar
                    </button>
                    <button
                      className="luxury-btn bg-green-600 text-white hover:bg-green-700 transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                      onClick={() => { setOrderToDone(order); setShowDoneModal(true); }}
                    >
                      Hecho
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-red-600 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-red-700">¿Eliminar orden #{orderToDelete?.id}?</h3>
            <p className="mb-6 text-gray-700 text-center">Esta acción no se puede deshacer.</p>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700" onClick={handleDelete}>Eliminar</button>
              <button className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showDoneModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-green-600 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-green-700">¿Marcar orden #{orderToDone?.id} como completada?</h3>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700" onClick={handleMarkAsDone}>Confirmar</button>
              <button className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400" onClick={() => setShowDoneModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-yellow-500 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-yellow-700">Funcionalidad de edición</h3>
            <p className="mb-6 text-gray-700 text-center">Próximamente podrás editar los datos de la orden.</p>
            <button className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600" onClick={() => setShowEditModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="mb-8 w-full max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-xl p-6 border border-[#988443]">
          <h3 className="text-2xl font-bold mb-4 text-[#988443] text-center">Detalles de la Orden #{selectedOrder.id}</h3>
          <table className="w-full text-center luxury-table">
            <thead>
              <tr className="bg-[#988443] text-white">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">Orden ID</th>
                <th className="py-2 px-2">Producto</th>
                <th className="py-2 px-2">Cantidad</th>
                <th className="py-2 px-2">Precio Unitario</th>
                <th className="py-2 px-2">Subtotal</th>
                <th className="py-2 px-2">Factura</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detalle) => (
                <tr key={detalle.id} className="hover:bg-[#f5e9c6] transition-all duration-200">
                  <td className="py-2 px-2">{detalle.id}</td>
                  <td className="py-2 px-2">{detalle.orden_id}</td>
                  <td className="py-2 px-2">{detalle.producto_nombre}</td>
                  <td className="py-2 px-2">{detalle.cantidad}</td>
                  <td className="py-2 px-2">{detalle.precio_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                  <td className="py-2 px-2 text-[#988443] font-bold">{(detalle.cantidad * detalle.precio_unitario).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                  <td className="py-2 px-2">{detalle.numero_pedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
