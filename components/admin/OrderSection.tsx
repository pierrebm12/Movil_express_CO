"use client";
import { useEffect, useState } from "react";


type Order = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
  departamento?: string;
  codigo_postal?: string;
  notas?: string;
  total: number;
  fecha?: string;
  numero_pedido?: string;
};

type OrderDetail = {
  id: number;
  orden_id: number;
  producto_id?: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  numero_pedido: string;
};

type ConfirmedProduct = {
  id: number;
  orden_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_confirmacion: string;
  numero_pedido?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  codigo_postal?: string;
};

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState<'ordenes' | 'confirmados'>('ordenes');
  // Órdenes
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderRefresh, setOrderRefresh] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  // Confirmados
  const [confirmed, setConfirmed] = useState<ConfirmedProduct[]>([]);
  const [confirmedSearch, setConfirmedSearch] = useState("");
  const [confirmedLoading, setConfirmedLoading] = useState(false);
  const [confirmedRefresh, setConfirmedRefresh] = useState(0);
  const [selectedConfirmed, setSelectedConfirmed] = useState<number | null>(null);

  // Limpiar selección de producto confirmado al refrescar lista o cambiar de pestaña
  useEffect(() => {
    setSelectedConfirmed(null);
  }, [confirmedRefresh, activeTab]);
  // Modals y acciones
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [orderToDone, setOrderToDone] = useState<Order | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  // Fetch all orders
  useEffect(() => {
    setOrderLoading(true);
    fetch("/api/admin/ordenes")
      .then((res) => res.json())
      .then((data) => {
        setOrders((data.ordenes as Order[]) || []);
        setOrderLoading(false);
      });
  }, [orderRefresh]);

  // Fetch order details when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      setOrderLoading(true);
      fetch(`/api/admin/ordenes/${selectedOrder.id}/detalles`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails((data.detalles as OrderDetail[]) || []);
          setOrderLoading(false);
        });
    }
  }, [selectedOrder]);

  // Fetch confirmed products
  useEffect(() => {
    setConfirmedLoading(true);
    fetch("/api/admin/productos-confirmados")
      .then(res => res.json())
      .then(data => {
        setConfirmed(data.productos || []);
        setConfirmedLoading(false);
      });
  }, [confirmedRefresh]);

  const handleDelete = async () => {
    if (!orderToDelete) return;
    setOrderLoading(true);
    await fetch(`/api/admin/ordenes/${orderToDelete.id}`, { method: "DELETE" });
    setSelectedOrder(null);
    setOrderRefresh((r) => r + 1);
    setOrderLoading(false);
    setShowDeleteModal(false);
    setOrderToDelete(null);
    alert("Orden eliminada correctamente.");
  };

  const handleMarkAsDone = async () => {
    if (!orderToDone) return;
    setOrderLoading(true);
    await fetch(`/api/admin/ordenes/${orderToDone.id}/confirmar`, { method: "POST" });
    setOrderRefresh((r) => r + 1);
    setConfirmedRefresh((r) => r + 1);
    setOrderLoading(false);
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
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Buscar por número de pedido..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] bg-white text-gray-800 shadow-md"
              />
            </div>
            <button
              className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-5 py-2 rounded-xl shadow-md font-semibold flex items-center gap-2"
              onClick={() => setOrderRefresh(r => r + 1)}
              title="Refrescar órdenes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5A9 9 0 1021 12m0 0v4.5m0-4.5h-4.5" />
              </svg>
              Refrescar
            </button>
          </div>
          {orderLoading && <div className="text-lg text-[#988443] font-semibold animate-pulse">Cargando...</div>}
          <div
            className="w-full bg-white/90 rounded-2xl shadow-2xl p-2 mb-10 border border-[#988443] backdrop-blur-md"
            style={{ minHeight: '110vh', maxHeight: '110vh', overflowX: 'auto', overflowY: 'auto' }}
          >
            <table className="min-w-[900px] w-full text-center luxury-table">
              <thead>
                <tr className="bg-[#988443] text-white">
                  <th className="py-3 px-2 whitespace-nowrap">ID</th>
                  <th className="py-3 px-2 whitespace-nowrap">Factura</th>
                  <th className="py-3 px-2 whitespace-nowrap">Cliente</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden sm:table-cell">Email</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden md:table-cell">Teléfono</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden md:table-cell">Dirección</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">Ciudad</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">Departamento</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden xl:table-cell">Código Postal</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden xl:table-cell">Notas</th>
                  <th className="py-3 px-2 whitespace-nowrap">Total</th>
                  <th className="py-3 px-2 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(order =>
                    !orderSearch || (order.numero_pedido || "").toLowerCase().includes(orderSearch.toLowerCase())
                  )
                  .map((order) => (
                    <tr
                      key={order.id}
                      className={`transition-all duration-200 ${selectedOrder?.id === order.id ? "bg-[#f7f3e3]" : "hover:bg-[#f5e9c6]"}`}
                    >
                      <td className="py-2 px-2 font-semibold whitespace-nowrap">{order.id}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{order.numero_pedido || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{order.nombre}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden sm:table-cell">{order.email}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden md:table-cell">{order.telefono}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden md:table-cell">{order.direccion}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden lg:table-cell">{order.ciudad || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden lg:table-cell">{order.departamento || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden xl:table-cell">{order.codigo_postal || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden xl:table-cell">{order.notas || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 text-[#988443] font-bold whitespace-nowrap">{"$" + order.total.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                      <td className="py-2 px-2 flex justify-center items-center whitespace-nowrap">
                        <button
                          className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-3 py-1 rounded-full shadow-md font-bold text-xl"
                          onClick={() => { setOrderToEdit(order); setShowEditModal(true); }}
                          title="Más acciones"
                        >
                          ...
                        </button>
                        {orderToEdit?.id === order.id && showEditModal && (
                          <div
                            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadein"
                            onClick={e => {
                              // Prevent closing when clicking the background
                              if (e.target === e.currentTarget) return;
                            }}
                          >
                            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-[#988443] flex flex-col items-center relative transform transition-all duration-300 scale-90 opacity-0 animate-modalpop">
                              <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                                onClick={() => setShowEditModal(false)}
                                aria-label="Cerrar"
                              >
                                ×
                              </button>
                              <h3 className="text-xl font-bold mb-4 text-[#988443]">Acciones para la orden #{order.id}</h3>
                              <div className="flex flex-col gap-4 w-full">
                                <button
                                  className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-4 py-2 rounded-lg shadow-md font-semibold w-full"
                                  onClick={() => { setSelectedOrder(selectedOrder?.id === order.id ? null : order); setShowEditModal(false); }}
                                >
                                  {selectedOrder?.id === order.id ? "Ocultar Detalles" : "Ver Detalles"}
                                </button>
                                <button
                                  className="luxury-btn bg-yellow-500 text-white hover:bg-yellow-600 transition-all px-4 py-2 rounded-lg shadow-md font-semibold w-full"
                                  onClick={() => { setOrderToEdit(order); setShowEditModal(false); setTimeout(() => setShowEditModal(true), 100); }}
                                >
                                  Editar
                                </button>
                                <button
                                  className="luxury-btn bg-red-600 text-white hover:bg-red-700 transition-all px-4 py-2 rounded-lg shadow-md font-semibold w-full"
                                  onClick={() => { setOrderToDelete(order); setShowEditModal(false); setShowDeleteModal(true); }}
                                >
                                  Eliminar
                                </button>
                                <button
                                  className="luxury-btn bg-green-600 text-white hover:bg-green-700 transition-all px-4 py-2 rounded-lg shadow-md font-semibold w-full"
                                  onClick={() => { setOrderToDone(order); setShowEditModal(false); setShowDoneModal(true); }}
                                >
                                  Hecho
                                </button>
                                <button
                                  className="luxury-btn bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all px-4 py-2 rounded-lg shadow-md font-semibold w-full"
                                  onClick={() => setShowEditModal(false)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                            <style jsx global>{`
                              @keyframes fadein {
                                from { opacity: 0; }
                                to { opacity: 1; }
                              }
                              .animate-fadein {
                                animation: fadein 0.2s ease;
                              }
                              @keyframes modalpop {
                                0% { transform: scale(0.7); opacity: 0; }
                                80% { transform: scale(1.05); opacity: 1; }
                                100% { transform: scale(1); opacity: 1; }
                              }
                              .animate-modalpop {
                                animation: modalpop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                              }
                            `}</style>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {selectedOrder && (
            <div className="mb-8 w-full max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-xl p-2 border border-[#988443] overflow-x-auto">
              <h3 className="text-2xl font-bold mb-4 text-[#988443] text-center">Detalles de la Orden #{selectedOrder.id}</h3>
              <table className="min-w-[700px] w-full text-center luxury-table">
                <thead>
                  <tr className="bg-[#988443] text-white">
                    <th className="py-2 px-2 whitespace-nowrap">ID</th>
                    <th className="py-2 px-2 whitespace-nowrap">Producto</th>
                    <th className="py-2 px-2 whitespace-nowrap">Cantidad</th>
                    <th className="py-2 px-2 whitespace-nowrap">Precio Unitario</th>
                    <th className="py-2 px-2 whitespace-nowrap">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((detalle) => (
                    <tr key={detalle.id} className="hover:bg-[#f5e9c6] transition-all duration-200">
                      <td className="py-2 px-2 whitespace-nowrap">{detalle.id}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{detalle.producto_nombre}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{detalle.cantidad}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{detalle.precio_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                      <td className="py-2 px-2 text-[#988443] font-bold whitespace-nowrap">{(detalle.cantidad * detalle.precio_unitario).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Buscar por número de pedido..."
                value={confirmedSearch}
                onChange={e => setConfirmedSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] bg-white text-gray-800 shadow-md"
              />
            </div>
            <button
              className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-5 py-2 rounded-xl shadow-md font-semibold flex items-center gap-2"
              onClick={() => setConfirmedRefresh(r => r + 1)}
              title="Refrescar productos confirmados"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5A9 9 0 1021 12m0 0v4.5m0-4.5h-4.5" />
              </svg>
              Refrescar
            </button>
          </div>
          {confirmedLoading && <div className="text-lg text-[#988443] font-semibold animate-pulse">Cargando...</div>}
          <div
            className="w-full bg-white/90 rounded-2xl shadow-2xl p-2 mb-10 border border-[#988443] backdrop-blur-md"
            style={{ minHeight: '110vh', maxHeight: '110vh', overflowX: 'auto', overflowY: 'auto' }}
          >
            <table className="min-w-[900px] w-full text-center luxury-table">
              <thead>
                <tr className="bg-[#988443] text-white">
                  <th className="py-3 px-2 whitespace-nowrap">ID</th>
                  <th className="py-3 px-2 whitespace-nowrap">Factura</th>
                  <th className="py-3 px-2 whitespace-nowrap">Cliente</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden sm:table-cell">Email</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden md:table-cell">Teléfono</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden md:table-cell">Dirección</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">Ciudad</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden lg:table-cell">Departamento</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden xl:table-cell">Código Postal</th>
                  <th className="py-3 px-2 whitespace-nowrap hidden xl:table-cell">Producto</th>
                  <th className="py-3 px-2 whitespace-nowrap">Cantidad</th>
                  <th className="py-3 px-2 whitespace-nowrap">Precio Unitario</th>
                  <th className="py-3 px-2 whitespace-nowrap">Subtotal</th>
                  <th className="py-3 px-2 whitespace-nowrap">Fecha Confirmación</th>
                  <th className="py-3 px-2 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {confirmed
                  .filter(p =>
                    !confirmedSearch || (p.numero_pedido || "").toLowerCase().includes(confirmedSearch.toLowerCase())
                  )
                  .map((p) => (
                    <tr key={p.id} className="transition-all duration-200 hover:bg-[#f5e9c6]">
                      <td className="py-2 px-2 font-semibold whitespace-nowrap">{p.id}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.numero_pedido || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.nombre || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden sm:table-cell">{p.email || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden md:table-cell">{p.telefono || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden md:table-cell">{p.direccion || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden lg:table-cell">{p.ciudad || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden lg:table-cell">{p.departamento || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden xl:table-cell">{p.codigo_postal || <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap hidden xl:table-cell">{p.producto_nombre}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.cantidad}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.precio_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.subtotal?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                      <td className="py-2 px-2 whitespace-nowrap">{p.fecha_confirmacion ? new Date(p.fecha_confirmacion).toLocaleString() : <span className="text-gray-400">-</span>}</td>
                      <td className="py-2 px-2 whitespace-nowrap flex gap-2 justify-center">
                        <button
                          className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                          onClick={() => setSelectedConfirmed(selectedConfirmed === p.id ? null : p.id)}
                        >
                          {selectedConfirmed === p.id ? "Ocultar" : "Ver Detalles"}
                        </button>
                        <button
                          className="luxury-btn bg-red-600 text-white hover:bg-red-700 transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                          onClick={async () => {
                            if (!window.confirm("¿Eliminar este producto confirmado?")) return;
                            setConfirmedLoading(true);
                            await fetch("/api/admin/productos-confirmados", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: p.id })
                            });
                            setConfirmedRefresh(r => r + 1);
                            setConfirmedLoading(false);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {selectedConfirmed !== null && (() => {
            const p = confirmed.find(c => c.id === selectedConfirmed);
            if (!p) return null;
            return (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadein" onClick={e => { if (e.target === e.currentTarget) setSelectedConfirmed(null); }}>
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border-2 border-[#988443] flex flex-col items-center relative animate-modalpop">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    onClick={() => setSelectedConfirmed(null)}
                    aria-label="Cerrar"
                  >×</button>
                  <h3 className="text-2xl font-bold mb-4 text-[#988443] text-center">Detalles del Producto Confirmado #{p.id}</h3>
                  <div className="w-full flex flex-col gap-2 text-base">
                    <div><span className="font-semibold text-[#988443]">Factura:</span> {p.numero_pedido || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Cliente:</span> {p.nombre || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Email:</span> {p.email || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Teléfono:</span> {p.telefono || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Dirección:</span> {p.direccion || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Ciudad:</span> {p.ciudad || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Departamento:</span> {p.departamento || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Código Postal:</span> {p.codigo_postal || <span className="text-gray-400">-</span>}</div>
                    <div><span className="font-semibold text-[#988443]">Producto:</span> {p.producto_nombre}</div>
                    <div><span className="font-semibold text-[#988443]">Cantidad:</span> {p.cantidad}</div>
                    <div><span className="font-semibold text-[#988443]">Precio Unitario:</span> {p.precio_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</div>
                    <div><span className="font-semibold text-[#988443]">Subtotal:</span> {p.subtotal?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</div>
                    <div><span className="font-semibold text-[#988443]">Fecha Confirmación:</span> {p.fecha_confirmacion ? new Date(p.fecha_confirmacion).toLocaleString() : <span className="text-gray-400">-</span>}</div>
                  </div>
                  <button className="mt-6 px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400" onClick={() => setSelectedConfirmed(null)}>Cerrar</button>
                </div>
                <style jsx global>{`
                  @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  .animate-fadein {
                    animation: fadein 0.2s ease;
                  }
                  @keyframes modalpop {
                    0% { transform: scale(0.7); opacity: 0; }
                    80% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  .animate-modalpop {
                    animation: modalpop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                  }
                `}</style>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
