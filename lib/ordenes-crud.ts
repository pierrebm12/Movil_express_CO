import { executeQuery, executeQuerySingle } from "@/lib/database";

// Obtener todas las órdenes
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

// Confirmar una orden: copiar productos a productos_confirmados y marcar como confirmada
export async function confirmarOrden(orderId: number) {
  const detalles = await executeQuery(`SELECT * FROM orden_detalles WHERE orden_id = ?`, [orderId]);
  for (const d of detalles) {
    await executeQuery(
      `INSERT INTO productos_confirmados (orden_id, producto_nombre, cantidad, precio_unitario, fecha_confirmacion) VALUES (?, ?, ?, ?, NOW())`,
      [orderId, d.producto_nombre, d.cantidad, d.precio_unitario]
    );
  }
  await executeQuery(`UPDATE orden_datos SET estado = 'confirmada' WHERE id = ?`, [orderId]);
}
