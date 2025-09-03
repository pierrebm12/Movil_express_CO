// Tipos base de la base de datos
export interface Producto {
  id: number
  codigo_producto: string
  nombre: string
  descripcion: string
  precio_anterior?: number
  precio_actual: number
  estado: "nuevo" | "usado" | "reacondicionado"
  marca?: string
  modelo?: string
  capacidad?: string
  stock: number
  stock_minimo: number
  en_oferta: boolean
  porcentaje_descuento: number
  imagen_principal?: string
  garantia_meses: number
  peso?: number
  dimensiones?: string
  color_principal?: string
  activo: boolean
  destacado: boolean
  eco?: boolean // Indica si el producto es eco
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface ProductoImagen {
  id: number
  producto_id: number
  url_imagen: string
  alt_text?: string
  orden: number
  es_principal: boolean
  fecha_creacion: string
}

export interface ProductoCaracteristica {
  id: number
  producto_id: number
  nombre: string
  valor: string
  orden: number
}

export interface ProductoColor {
  id: number
  producto_id: number
  nombre_color: string
  codigo_hex?: string
  stock_color: number
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
  activa: boolean
  orden: number
  fecha_creacion: string
}

export interface Cliente {
  id: number
  codigo_cliente: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  departamento?: string
  codigo_postal?: string
  fecha_nacimiento?: string
  activo: boolean
  fecha_registro: string
  fecha_actualizacion: string
}

export interface Pedido {
  id: number
  numero_pedido: string
  cliente_id: number
  estado: "pendiente" | "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado"
  subtotal: number
  descuento: number
  impuestos: number
  total: number
  metodo_pago?: string
  estado_pago: "pendiente" | "pagado" | "fallido" | "reembolsado"
  notas?: string
  direccion_envio?: string
  fecha_estimada_entrega?: string
  fecha_entrega?: string
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface PedidoDetalle {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  color_seleccionado?: string
}

// Tipos compuestos
export interface ProductoCompleto extends Producto {
  imagenes: ProductoImagen[]
  caracteristicas: ProductoCaracteristica[]
  colores: ProductoColor[]
  categorias: Categoria[]
  image?: string // Para compatibilidad con componentes que usan 'image'
  name?: string // Para compatibilidad con componentes que usan 'name'
  rating: number // Para compatibilidad con Producto de store.ts
  eco?: boolean // Indica si el producto es eco
}

export interface PedidoCompleto extends Pedido {
  cliente: Cliente
  detalles: (PedidoDetalle & { producto: Producto })[]
}

// Tipos para filtros y paginación
export interface ProductoFiltros {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  categoria?: string
  marca?: string
  precio_min?: number
  precio_max?: number
  estado?: string
  en_oferta?: boolean
  destacado?: boolean
  busqueda?: string
}

export interface Paginacion {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: Paginacion
}

// Tipos para estadísticas
export interface EstadisticasProductos {
  total_productos: number
  stock_normal: number
  stock_bajo: number
  stock_agotado: number
  productos_oferta: number
  productos_destacados: number
  precio_promedio: number
  valor_inventario: number
}

export interface EstadisticasDashboard {
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

export interface AlertasSistema {
  stockBajo: number
  agotados: number
  pedidosAtrasados: number
}
