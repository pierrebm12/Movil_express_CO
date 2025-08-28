import { executeQuery, executeQuerySingle } from "../database"

export interface DashboardStats {
  ventasHoy: number
  ventasMes: number
  ventasAnio: number
  pedidosPendientes: number
  productosStock: number
  clientesTotal: number
  ingresosMes: number
  crecimientoMes: number
  ticketPromedio: number
  conversionRate: number
  productosVendidosHoy: number
  nuevosClientesMes: number
}

export interface VentasDiarias {
  fecha: string
  ventas: number
  pedidos: number
  productos: number
}

export interface ProductoMasVendido {
  id: number
  nombre: string
  ventas: number
  ingresos: number
  stock: number
}

export interface ClienteTop {
  id: number
  nombre: string
  email: string
  totalCompras: number
  numeroPedidos: number
  ultimaCompra: string
}

export class DashboardService {
  // Obtener estadísticas principales del dashboard
  static async obtenerEstadisticas(): Promise<DashboardStats> {
    try {
      const hoy = new Date().toISOString().split("T")[0]
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
      const inicioAnio = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
      const mesAnterior = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split("T")[0]
      const finMesAnterior = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split("T")[0]

      // Ventas de hoy
      const ventasHoy = await executeQuerySingle<{ total: number }>(
        `
        SELECT COALESCE(SUM(total), 0) as total
        FROM pedidos 
        WHERE DATE(fecha_pedido) = ? AND estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [hoy],
      )

      // Ventas del mes
      const ventasMes = await executeQuerySingle<{ total: number }>(
        `
        SELECT COALESCE(SUM(total), 0) as total
        FROM pedidos 
        WHERE DATE(fecha_pedido) >= ? AND estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [inicioMes],
      )

      // Ventas del año
      const ventasAnio = await executeQuerySingle<{ total: number }>(
        `
        SELECT COALESCE(SUM(total), 0) as total
        FROM pedidos 
        WHERE DATE(fecha_pedido) >= ? AND estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [inicioAnio],
      )

      // Ventas del mes anterior para calcular crecimiento
      const ventasMesAnterior = await executeQuerySingle<{ total: number }>(
        `
        SELECT COALESCE(SUM(total), 0) as total
        FROM pedidos 
        WHERE DATE(fecha_pedido) >= ? AND DATE(fecha_pedido) <= ? AND estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [mesAnterior, finMesAnterior],
      )

      // Pedidos pendientes
      const pedidosPendientes = await executeQuerySingle<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM pedidos 
        WHERE estado = 'pendiente'
      `)

      // Total de productos en stock
      const productosStock = await executeQuerySingle<{ total: number }>(`
        SELECT COALESCE(SUM(stock), 0) as total
        FROM productos 
        WHERE activo = 1
      `)

      // Total de clientes
      const clientesTotal = await executeQuerySingle<{ count: number }>(`
        SELECT COUNT(*) as count
        FROM usuarios 
        WHERE rol = 'cliente' AND activo = 1
      `)

      // Ticket promedio del mes
      const ticketPromedio = await executeQuerySingle<{ promedio: number }>(
        `
        SELECT COALESCE(AVG(total), 0) as promedio
        FROM pedidos 
        WHERE DATE(fecha_pedido) >= ? AND estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [inicioMes],
      )

      // Productos vendidos hoy
      const productosVendidosHoy = await executeQuerySingle<{ total: number }>(
        `
        SELECT COALESCE(SUM(pi.cantidad), 0) as total
        FROM pedido_items pi
        JOIN pedidos p ON pi.pedido_id = p.id
        WHERE DATE(p.fecha_pedido) = ? AND p.estado IN ('entregado', 'confirmado', 'procesando')
      `,
        [hoy],
      )

      // Nuevos clientes del mes
      const nuevosClientesMes = await executeQuerySingle<{ count: number }>(
        `
        SELECT COUNT(*) as count
        FROM usuarios 
        WHERE rol = 'cliente' AND DATE(fecha_registro) >= ?
      `,
        [inicioMes],
      )

      // Calcular crecimiento
      const crecimiento =
        ventasMesAnterior?.total > 0
          ? (((ventasMes?.total || 0) - (ventasMesAnterior?.total || 0)) / (ventasMesAnterior?.total || 1)) * 100
          : 0

      return {
        ventasHoy: ventasHoy?.total || 0,
        ventasMes: ventasMes?.total || 0,
        ventasAnio: ventasAnio?.total || 0,
        pedidosPendientes: pedidosPendientes?.count || 0,
        productosStock: productosStock?.total || 0,
        clientesTotal: clientesTotal?.count || 0,
        ingresosMes: ventasMes?.total || 0,
        crecimientoMes: Number(crecimiento.toFixed(1)),
        ticketPromedio: ticketPromedio?.promedio || 0,
        conversionRate: 3.2, // Se puede calcular con datos de analytics
        productosVendidosHoy: productosVendidosHoy?.total || 0,
        nuevosClientesMes: nuevosClientesMes?.count || 0,
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      throw error
    }
  }

  // Obtener ventas diarias de los últimos 30 días
  static async obtenerVentasDiarias(): Promise<VentasDiarias[]> {
    try {
      const ventas = await executeQuery<any>(`
        SELECT 
          DATE(fecha_pedido) as fecha,
          COALESCE(SUM(total), 0) as ventas,
          COUNT(*) as pedidos,
          COALESCE(SUM((SELECT SUM(cantidad) FROM pedido_items WHERE pedido_id = p.id)), 0) as productos
        FROM pedidos p
        WHERE DATE(fecha_pedido) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          AND estado IN ('entregado', 'confirmado', 'procesando')
        GROUP BY DATE(fecha_pedido)
        ORDER BY fecha DESC
      `)

      return ventas.map((v) => ({
        fecha: v.fecha,
        ventas: Number(v.ventas),
        pedidos: Number(v.pedidos),
        productos: Number(v.productos),
      }))
    } catch (error) {
      console.error("Error obteniendo ventas diarias:", error)
      throw error
    }
  }

  // Obtener productos más vendidos
  static async obtenerProductosMasVendidos(): Promise<ProductoMasVendido[]> {
    try {
      const productos = await executeQuery<any>(`
        SELECT 
          p.id,
          p.nombre,
          COALESCE(SUM(pi.cantidad), 0) as ventas,
          COALESCE(SUM(pi.cantidad * pi.precio_unitario), 0) as ingresos,
          p.stock
        FROM productos p
        LEFT JOIN pedido_items pi ON p.id = pi.producto_id
        LEFT JOIN pedidos ped ON pi.pedido_id = ped.id
        WHERE p.activo = 1 
          AND (ped.estado IN ('entregado', 'confirmado', 'procesando') OR ped.id IS NULL)
          AND (ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR ped.id IS NULL)
        GROUP BY p.id, p.nombre, p.stock
        ORDER BY ventas DESC
        LIMIT 10
      `)

      return productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        ventas: Number(p.ventas),
        ingresos: Number(p.ingresos),
        stock: Number(p.stock),
      }))
    } catch (error) {
      console.error("Error obteniendo productos más vendidos:", error)
      throw error
    }
  }

  // Obtener clientes top
  static async obtenerClientesTop(): Promise<ClienteTop[]> {
    try {
      const clientes = await executeQuery<any>(`
        SELECT 
          u.id,
          u.nombre,
          u.email,
          u.total_compras as totalCompras,
          u.numero_pedidos as numeroPedidos,
          u.fecha_ultima_compra as ultimaCompra
        FROM usuarios u
        WHERE u.rol = 'cliente' AND u.activo = 1
        ORDER BY u.total_compras DESC
        LIMIT 10
      `)

      return clientes.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        email: c.email,
        totalCompras: Number(c.totalCompras),
        numeroPedidos: Number(c.numeroPedidos),
        ultimaCompra: c.ultimaCompra ? new Date(c.ultimaCompra).toLocaleDateString() : "Nunca",
      }))
    } catch (error) {
      console.error("Error obteniendo clientes top:", error)
      throw error
    }
  }

  // Obtener alertas del sistema
  static async obtenerAlertas() {
    try {
      // Productos con stock bajo
      const stockBajo = await executeQuery<any>(`
        SELECT COUNT(*) as count
        FROM productos 
        WHERE stock <= stock_minimo AND stock > 0 AND activo = 1
      `)

      // Productos agotados
      const agotados = await executeQuery<any>(`
        SELECT COUNT(*) as count
        FROM productos 
        WHERE stock = 0 AND activo = 1
      `)

      // Pedidos pendientes por más de 24 horas
      const pedidosAtrasados = await executeQuery<any>(`
        SELECT COUNT(*) as count
        FROM pedidos 
        WHERE estado = 'pendiente' 
          AND fecha_pedido < DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `)

      return {
        stockBajo: stockBajo[0]?.count || 0,
        agotados: agotados[0]?.count || 0,
        pedidosAtrasados: pedidosAtrasados[0]?.count || 0,
      }
    } catch (error) {
      console.error("Error obteniendo alertas:", error)
      throw error
    }
  }
}
