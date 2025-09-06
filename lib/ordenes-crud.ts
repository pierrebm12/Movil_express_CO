import { executeQuery, executeQuerySingle } from "@/lib/database";

// Obtener todas las órdenes pendientes
export async function getOrders() {
  const query = `SELECT * FROM orden_datos ORDER BY id DESC`;
  return await executeQuery(query);
}

// Obtener detalles de una orden
export async function getOrderDetails(orderId: number) {
  const query = `SELECT * FROM orden_detalles WHERE orden_id = ?`;
  return await executeQuery(query, [orderId]);
}

// Eliminar una orden y sus detalles
export async function deleteOrder(orderId: number) {
  await executeQuery(`DELETE FROM orden_detalles WHERE orden_id = ?`, [orderId]);
  await executeQuery(`DELETE FROM orden_datos WHERE id = ?`, [orderId]);
}

// Confirmar una orden: copiar productos a productos_confirmados y eliminar la orden y sus detalles
export async function confirmarOrden(orderId: number) {
  // Obtener datos de la orden
  const orden = await executeQuerySingle(`SELECT * FROM orden_datos WHERE id = ?`, [orderId]);
  if (!orden) throw new Error("Orden no encontrada");
  const detalles = await executeQuery(`SELECT * FROM orden_detalles WHERE orden_id = ?`, [orderId]);
  for (const d of detalles) {
    await executeQuery(
      `INSERT INTO productos_confirmados (
        orden_id, producto_id, producto_nombre, cantidad, precio_unitario, subtotal, fecha_confirmacion, numero_pedido,
        nombre, email, telefono, direccion, ciudad, departamento, codigo_postal
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        d.producto_id || null,
        d.producto_nombre,
        d.cantidad,
        d.precio_unitario,
        d.cantidad * d.precio_unitario,
        orden.numero_pedido || null,
        orden.nombre || null,
        orden.email || null,
        orden.telefono || null,
        orden.direccion || null,
        orden.ciudad || null,
        orden.departamento || null,
        orden.codigo_postal || null
      ]
    );
  }
  // Eliminar la orden y sus detalles
  await executeQuery(`DELETE FROM orden_detalles WHERE orden_id = ?`, [orderId]);
  await executeQuery(`DELETE FROM orden_datos WHERE id = ?`, [orderId]);
}
