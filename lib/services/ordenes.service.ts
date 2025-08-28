import { executeQuery, executeTransaction } from "../database"
import { Pedido, PedidoDetalle } from "@/types/database"

export async function crearOrdenYDetalles(
  pedido: Omit<Pedido, "id" | "fecha_creacion" | "fecha_actualizacion">,
  detalles: Array<Omit<PedidoDetalle, "id">>
) {
  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ")
  const queries = []
  // Insertar pedido
  queries.push({
    query: `INSERT INTO pedidos (numero_pedido, cliente_id, estado, subtotal, descuento, impuestos, total, metodo_pago, estado_pago, notas, direccion_envio, fecha_creacion, fecha_actualizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    params: [
      pedido.numero_pedido,
      pedido.cliente_id,
      pedido.estado,
      pedido.subtotal,
      pedido.descuento,
      pedido.impuestos,
      pedido.total,
      pedido.metodo_pago,
      pedido.estado_pago,
      pedido.notas,
      pedido.direccion_envio,
      fecha,
      fecha
    ]
  })
  // Insertar detalles
  for (const detalle of detalles) {
    queries.push({
      query: `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal, color_seleccionado) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?)` ,
      params: [
        detalle.producto_id,
        detalle.cantidad,
        detalle.precio_unitario,
        detalle.subtotal,
        detalle.color_seleccionado || null
      ]
    })
  }
  return await executeTransaction(queries)
}
