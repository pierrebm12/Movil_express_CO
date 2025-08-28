import { z } from "zod"

// Validaciones para productos
export const ProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(200, "Nombre muy largo"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  precio_anterior: z.number().positive().optional(),
  precio_actual: z.number().positive("El precio debe ser mayor a 0"),
  estado: z.enum(["nuevo", "usado", "reacondicionado"]),
  capacidad: z.string().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  stock_minimo: z.number().int().min(0).default(5),
  en_oferta: z.boolean().default(false),
  porcentaje_descuento: z.number().int().min(0).max(100).default(0),
  imagen_principal: z.string().url().optional(),
  categoria_principal: z.string().optional(),
  garantia_meses: z.number().min(0).default(12),
  proveedor: z.string().optional(),
  costo_compra: z.number().min(0).optional(),
  margen_ganancia: z.number().min(0).max(100).optional(),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  categorias: z.array(z.number().int().positive()).min(1, "Debe seleccionar al menos una categoría"),
  imagenes: z
    .array(
      z.object({
        url_imagen: z.string().url(),
        alt_text: z.string().optional(),
        orden: z.number().int().min(0).default(0),
      }),
    )
    .optional(),
  caracteristicas: z
    .array(
      z.object({
        nombre: z.string().min(1),
        valor: z.string().min(1),
        orden: z.number().int().min(0).default(0),
      }),
    )
    .optional(),
  colores: z
    .array(
      z.object({
        nombre_color: z.string().min(1),
        codigo_hex: z
          .string()
          .regex(/^#[0-9A-F]{6}$/i)
          .optional(),
        stock_color: z.number().int().min(0).default(0),
      }),
    )
    .optional(),
})

export const ProductoUpdateSchema = ProductoSchema.partial().extend({
  id: z.number().int().positive(),
})

// Validaciones para usuarios
export const UsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido").max(150),
  telefono: z.string().max(20).optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["cliente", "admin"]).default("cliente"),
  direccion: z.string().optional(),
  ciudad: z.string().max(100).optional(),
  codigo_postal: z.string().max(10).optional(),
})

export const UsuarioLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export const UsuarioUpdateSchema = UsuarioSchema.partial().extend({
  id: z.number().int().positive(),
  password: z.string().min(6).optional(),
})

// Validaciones para pedidos
export const PedidoSchema = z.object({
  usuario_id: z.number().int().positive().optional(),
  metodo_pago: z.enum(["mercadopago", "transferencia", "efectivo"]),

  // Datos de envío (requeridos)
  nombre_envio: z.string().min(1, "Nombre de envío requerido").max(100),
  telefono_envio: z.string().min(1, "Teléfono de envío requerido").max(20),
  email_envio: z.string().email("Email de envío inválido").max(150),
  direccion_envio: z.string().min(1, "Dirección de envío requerida"),
  ciudad_envio: z.string().min(1, "Ciudad de envío requerida").max(100),
  codigo_postal_envio: z.string().max(10).optional(),

  // Datos de facturación (opcionales)
  nombre_facturacion: z.string().max(100).optional(),
  direccion_facturacion: z.string().optional(),
  ciudad_facturacion: z.string().max(100).optional(),
  codigo_postal_facturacion: z.string().max(10).optional(),

  notas_pedido: z.string().optional(),

  // Items del pedido
  items: z
    .array(
      z.object({
        producto_id: z.number().int().positive(),
        cantidad: z.number().int().positive(),
        color_seleccionado: z.string().optional(),
      }),
    )
    .min(1, "Debe incluir al menos un producto"),
})

export const PedidoUpdateSchema = z.object({
  id: z.number().int().positive(),
  estado: z.enum(["pendiente", "confirmado", "procesando", "enviado", "entregado", "cancelado"]).optional(),
  estado_pago: z.enum(["pendiente", "pagado", "fallido", "reembolsado"]).optional(),
  notas_pedido: z.string().optional(),
})

// Validaciones para carrito
export const CarritoItemSchema = z.object({
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().positive().max(99, "Cantidad máxima: 99"),
  color_seleccionado: z.string().optional(),
})

export const CarritoUpdateSchema = z.object({
  item_id: z.number().int().positive(),
  cantidad: z.number().int().positive().max(99, "Cantidad máxima: 99"),
})

// Validaciones para categorías
export const CategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  descripcion: z.string().optional(),
  icono: z.string().max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color inválido")
    .default("#3B82F6"),
  activa: z.boolean().default(true),
  orden: z.number().int().min(0).default(0),
})

export const CategoriaUpdateSchema = CategoriaSchema.partial().extend({
  id: z.number().int().positive(),
})

// Validaciones para configuración
export const ConfiguracionSchema = z.object({
  clave: z.string().min(1, "La clave es requerida").max(100),
  valor: z.string().optional(),
  tipo: z.enum(["string", "number", "boolean", "json"]).default("string"),
  descripcion: z.string().optional(),
  categoria: z.string().max(50).default("general"),
})

// Validaciones para ubicaciones
export const UbicacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  direccion: z.string().min(1, "La dirección es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida").max(100),
  telefono: z.string().max(20).optional(),
  email: z.string().email().max(150).optional(),
  horarios: z.any().optional(),
  latitud: z.number().min(-90).max(90).optional(),
  longitud: z.number().min(-180).max(180).optional(),
  activa: z.boolean().default(true),
  orden: z.number().int().min(0).default(0),
})

// Validaciones para reviews
export const ReviewSchema = z.object({
  producto_id: z.number().int().positive(),
  usuario_id: z.number().int().positive().optional(),
  nombre_reviewer: z.string().min(1, "El nombre es requerido").max(100),
  email_reviewer: z.string().email().max(150).optional(),
  rating: z.number().int().min(1, "Rating mínimo: 1").max(5, "Rating máximo: 5"),
  titulo: z.string().max(200).optional(),
  comentario: z.string().optional(),
})

// Validaciones para filtros y paginación
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const ProductoFiltrosSchema = PaginationSchema.extend({
  categoria: z.string().optional(),
  precio_min: z.number().positive().optional(),
  precio_max: z.number().positive().optional(),
  estado: z.enum(["nuevo", "usado", "reacondicionado"]).optional(),
  en_oferta: z.boolean().optional(),
  busqueda: z.string().optional(),
  destacado: z.boolean().optional(),
})

export const PedidoFiltrosSchema = PaginationSchema.extend({
  estado: z.enum(["pendiente", "confirmado", "procesando", "enviado", "entregado", "cancelado"]).optional(),
  estado_pago: z.enum(["pendiente", "pagado", "fallido", "reembolsado"]).optional(),
  fecha_desde: z.string().optional(),
  fecha_hasta: z.string().optional(),
  usuario_id: z.number().int().positive().optional(),
})

// Tipos inferidos
export type ProductoInput = z.infer<typeof ProductoSchema>
export type ProductoUpdateInput = z.infer<typeof ProductoUpdateSchema>
export type UsuarioInput = z.infer<typeof UsuarioSchema>
export type UsuarioLoginInput = z.infer<typeof UsuarioLoginSchema>
export type PedidoInput = z.infer<typeof PedidoSchema>
export type CarritoItemInput = z.infer<typeof CarritoItemSchema>
export type ProductoFiltrosInput = z.infer<typeof ProductoFiltrosSchema>
export type PedidoFiltrosInput = z.infer<typeof PedidoFiltrosSchema>
