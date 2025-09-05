"use client";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  total: number;
};

type OrderDetail = {
  id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
};

export default function OrderSection() {
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

  const handleDelete = async (orderId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta orden?")) return;
    setLoading(true);
    await fetch(`/api/admin/ordenes/${orderId}`, { method: "DELETE" });
    setSelectedOrder(null);
    setRefresh((r) => r + 1);
    setLoading(false);
  };

  const handleMarkAsDone = async (orderId: number) => {
    setLoading(true);
    await fetch(`/api/admin/ordenes/${orderId}/confirmar`, { method: "POST" });
    setRefresh((r) => r + 1);
    setLoading(false);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Órdenes</h2>
      {loading && <div>Cargando...</div>}
      <table className="w-full mb-8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={selectedOrder?.id === order.id ? "bg-gray-200" : ""}>
              <td>{order.id}</td>
              <td>{order.nombre}</td>
              <td>{order.email}</td>
              <td>{order.telefono}</td>
              <td>{order.direccion}</td>
              <td>{order.total}</td>
              <td>
                <button className="mr-2 text-blue-600 underline" onClick={() => setSelectedOrder(order)}>
                  Ver Detalles
                </button>
                <button className="mr-2 text-yellow-600 underline" onClick={() => alert("Funcionalidad de edición pendiente")}>Editar</button>
                <button className="mr-2 text-red-600 underline" onClick={() => handleDelete(order.id)}>Eliminar</button>
                <button className="text-green-600 underline" onClick={() => handleMarkAsDone(order.id)}>Hecho</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Detalles de la Orden #{selectedOrder.id}</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detalle) => (
                <tr key={detalle.id}>
                  <td>{detalle.producto_nombre}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.precio_unitario}</td>
                  <td>{detalle.cantidad * detalle.precio_unitario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
