import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Producto } from "./store"

export interface Pedido {
  id: number
  cliente: {
    nombre: string
    email: string
    telefono: string
    direccion: string
  }
  productos: Array<{
    producto: Producto
    cantidad: number
    color?: string
  }>
  total: number
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado"
  metodoPago: string
  fechaPedido: Date
  fechaEntrega?: Date
}

export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion: string
  fechaRegistro: Date
  totalCompras: number
  pedidos: number[]
}

export interface Estadistica {
  ventasHoy: number
  ventasMes: number
  ventasAnio: number
  pedidosPendientes: number
  productosStock: number
  clientesTotal: number
  ingresosMes: number
  crecimientoMes: number
}

interface AdminStoreState {
  // Datos
  pedidos: Pedido[]
  clientes: Cliente[]
  estadisticas: Estadistica

  // UI State
  vistaActual: "dashboard" | "productos" | "pedidos" | "clientes" | "configuracion"
  productoEditando: Producto | null
  pedidoEditando: Pedido | null
  modalAbierto: boolean

  // Actions
  setVistaActual: (vista: AdminStoreState["vistaActual"]) => void

  // Productos
  agregarProducto: (producto: Omit<Producto, "id">) => void
  editarProducto: (id: number, producto: Partial<Producto>) => void
  eliminarProducto: (id: number) => void
  setProductoEditando: (producto: Producto | null) => void

  // Pedidos
  agregarPedido: (pedido: Omit<Pedido, "id">) => void
  actualizarEstadoPedido: (id: number, estado: Pedido["estado"]) => void
  setPedidoEditando: (pedido: Pedido | null) => void

  // Clientes
  agregarCliente: (cliente: Omit<Cliente, "id">) => void
  editarCliente: (id: number, cliente: Partial<Cliente>) => void

  // UI
  setModalAbierto: (abierto: boolean) => void

  // Estadísticas
  actualizarEstadisticas: () => void
}

// Datos iniciales
const pedidosIniciales: Pedido[] = [
  {
    id: 1,
    cliente: {
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "+57 300 123 4567",
      direccion: "Cra 15 #45-67, Bogotá",
    },
    productos: [
      {
        producto: {
          id: 1,
          nombre: "iPhone 15 Pro Max 256GB",
          descripcion: "El iPhone más avanzado",
          precioAnterior: 5500000,
          precioNuevo: 4200000,
          imagen: "/placeholder.svg?height=400&width=400",
          imagenes: [],
          estado: "Nuevo",
          capacidad: "256GB",
          colores: ["Titanio Natural"],
          stock: 3,
          oferta: true,
          rating: 5,
          tags: ["iPhone", "Apple"],
          caracteristicas: ["Chip A17 Pro"],
        },
        cantidad: 1,
        color: "Titanio Natural",
      },
    ],
    total: 4200000,
    estado: "procesando",
    metodoPago: "Tarjeta de crédito",
    fechaPedido: new Date("2024-01-15"),
    fechaEntrega: new Date("2024-01-18"),
  },
  {
    id: 2,
    cliente: {
      nombre: "María González",
      email: "maria@email.com",
      telefono: "+57 301 234 5678",
      direccion: "Cl 80 #12-34, Medellín",
    },
    productos: [
      {
        producto: {
          id: 3,
          nombre: "AirPods Pro 2da Generación",
          descripcion: "Auriculares premium",
          precioAnterior: 850000,
          precioNuevo: 650000,
          imagen: "/placeholder.svg?height=400&width=400",
          imagenes: [],
          estado: "Nuevo",
          capacidad: "N/A",
          colores: ["Blanco"],
          stock: 12,
          oferta: true,
          rating: 4,
          tags: ["Apple", "Auriculares"],
          caracteristicas: ["Cancelación de ruido"],
        },
        cantidad: 2,
      },
    ],
    total: 1300000,
    estado: "entregado",
    metodoPago: "Transferencia",
    fechaPedido: new Date("2024-01-10"),
    fechaEntrega: new Date("2024-01-13"),
  },
]

const clientesIniciales: Cliente[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@email.com",
    telefono: "+57 300 123 4567",
    direccion: "Cra 15 #45-67, Bogotá",
    fechaRegistro: new Date("2023-12-01"),
    totalCompras: 4200000,
    pedidos: [1],
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@email.com",
    telefono: "+57 301 234 5678",
    direccion: "Cl 80 #12-34, Medellín",
    fechaRegistro: new Date("2023-11-15"),
    totalCompras: 1300000,
    pedidos: [2],
  },
]

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      pedidos: pedidosIniciales,
      clientes: clientesIniciales,
      estadisticas: {
        ventasHoy: 2,
        ventasMes: 15,
        ventasAnio: 180,
        pedidosPendientes: 3,
        productosStock: 39,
        clientesTotal: 2,
        ingresosMes: 25000000,
        crecimientoMes: 15.5,
      },
      vistaActual: "dashboard",
      productoEditando: null,
      pedidoEditando: null,
      modalAbierto: false,

      // Actions
      setVistaActual: (vista) => set({ vistaActual: vista }),

      // Productos
      agregarProducto: (producto) => {
        const nuevoId = Math.max(...get().pedidos.map((p) => p.id), 0) + 1
        // Esta función se conectaría con el store principal de productos
        console.log("Agregar producto:", { ...producto, id: nuevoId })
      },

      editarProducto: (id, producto) => {
        console.log("Editar producto:", id, producto)
      },

      eliminarProducto: (id) => {
        console.log("Eliminar producto:", id)
      },

      setProductoEditando: (producto) => set({ productoEditando: producto }),

      // Pedidos
      agregarPedido: (pedido) => {
        const nuevoId = Math.max(...get().pedidos.map((p) => p.id), 0) + 1
        set((state) => ({
          pedidos: [...state.pedidos, { ...pedido, id: nuevoId }],
        }))
        get().actualizarEstadisticas()
      },

      actualizarEstadoPedido: (id, estado) => {
        set((state) => ({
          pedidos: state.pedidos.map((pedido) => (pedido.id === id ? { ...pedido, estado } : pedido)),
        }))
        get().actualizarEstadisticas()
      },

      setPedidoEditando: (pedido) => set({ pedidoEditando: pedido }),

      // Clientes
      agregarCliente: (cliente) => {
        const nuevoId = Math.max(...get().clientes.map((c) => c.id), 0) + 1
        set((state) => ({
          clientes: [...state.clientes, { ...cliente, id: nuevoId }],
        }))
        get().actualizarEstadisticas()
      },

      editarCliente: (id, cliente) => {
        set((state) => ({
          clientes: state.clientes.map((c) => (c.id === id ? { ...c, ...cliente } : c)),
        }))
      },

      // UI
      setModalAbierto: (abierto) => set({ modalAbierto: abierto }),

      // Estadísticas
      actualizarEstadisticas: () => {
        const { pedidos, clientes } = get()
        const hoy = new Date()
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        const inicioAnio = new Date(hoy.getFullYear(), 0, 1)

        const ventasHoy = pedidos.filter((p) => p.fechaPedido.toDateString() === hoy.toDateString()).length

        const ventasMes = pedidos.filter((p) => p.fechaPedido >= inicioMes).length

        const ventasAnio = pedidos.filter((p) => p.fechaPedido >= inicioAnio).length

        const ingresosMes = pedidos
          .filter((p) => p.fechaPedido >= inicioMes && p.estado !== "cancelado")
          .reduce((total, p) => total + p.total, 0)

        set({
          estadisticas: {
            ventasHoy,
            ventasMes,
            ventasAnio,
            pedidosPendientes: pedidos.filter((p) => p.estado === "pendiente").length,
            productosStock: 39, // Se conectaría con el store de productos
            clientesTotal: clientes.length,
            ingresosMes,
            crecimientoMes: 15.5, // Cálculo más complejo en producción
          },
        })
      },
    }),
    {
      name: "admin-store",
      partialize: (state) => ({
        pedidos: state.pedidos,
        clientes: state.clientes,
        estadisticas: state.estadisticas,
      }),
    },
  ),
)
