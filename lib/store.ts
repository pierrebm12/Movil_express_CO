"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ProductoImagen {
  id?: number
  producto_id?: number
  url_imagen: string
  alt_text?: string
  orden?: number
  es_principal?: boolean
}

export interface ProductoCaracteristica {
  id?: number
  producto_id?: number
  nombre?: string
  valor: string
  orden?: number
}

export interface ProductoColor {
  id?: number
  producto_id?: number
  nombre_color: string
  stock_color?: number
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  activa?: boolean
}

export interface Producto {
  id: number
  codigo_producto: string
  nombre: string
  descripcion: string
  precio_anterior?: number | null
  precio_actual: number
  // Alias para compatibilidad con componentes existentes
  precioNuevo?: number
  precioAnterior?: number
  imagen?: string
  estado: string
  marca?: string
  modelo?: string
  capacidad?: string
  stock: number
  stock_minimo?: number
  en_oferta: boolean
  porcentaje_descuento: number
  rating: number
  imagen_principal?: string
  categoria_principal?: string
  garantia_meses: number
  activo: boolean
  destacado: boolean
  peso?: string
  dimensiones?: string
  color_principal?: string
  fecha_creacion?: string
  fecha_actualizacion?: string
  imagenes?: ProductoImagen[]
  caracteristicas?: string[]
  colores?: string[]
  categorias?: Categoria[]
}

// Nueva interfaz para promociones
export interface Promocion {
  id: number
  titulo: string
  descripcion: string
  tipo: "descuento_porcentaje" | "descuento_fijo" | "oferta_especial" | "liquidacion"
  valor_descuento: number
  fecha_inicio: string
  fecha_fin: string
  activa: boolean
  imagen_banner?: string
  color_fondo: string
  color_texto: string
  productos_incluidos: number[] // IDs de productos
  limite_stock?: number
  stock_usado?: number
  prioridad: number // Para ordenar las promociones
  mostrar_en_slider: boolean
  fecha_creacion: string
  fecha_actualizacion?: string
}

export interface Cliente {
  id?: number
  email: string
  nombre?: string
  telefono?: string
  fecha_registro?: string
  activo?: boolean
}

export interface User {
  id: number
  email: string
  nombre: string
  isAdmin: boolean
}
export interface Usuario {
  id: number
  email: string
  nombre: string
  isAdmin: boolean
}

interface AuthStore {
  usuario: User | null
  sessionId: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User, sessionId: string) => void
}


interface StoreState {
  // Menú móvil
  menuAbierto: boolean
  toggleMenu: () => void


  // Modal de ubicaciones
  modalUbicaciones: boolean

  // Carrito con persistencia
  carrito: Array<{
    producto: Producto
    cantidad: number
    color?: string
  }>

  // Filtros
  filtros: {
    busqueda: string
  }

  

  // Autenticación
  isAuthenticated: boolean
  usuario: Usuario | null
  isLoading: boolean

  

  // Clientes/Newsletter
  clientes: Cliente[]

  // Promociones
  promociones: Promocion[]
  promocionesActivas: Promocion[]

  // Acciones del modal
  toggleModalUbicaciones: () => void

  // Acciones del carrito
  agregarAlCarrito: (producto: Producto, cantidad?: number, color?: string) => void
  eliminarDelCarrito: (productoId: number, color?: string) => void
  actualizarCantidad: (productoId: number, nuevaCantidad: number, color?: string) => void
  vaciarCarrito: () => void

  // Acciones de filtros
  actualizarFiltros: (nuevoFiltro: Partial<{ busqueda: string }>) => void

  // Acciones de autenticación
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Acciones de clientes
  registrarCliente: (cliente: Omit<Cliente, "id" | "fecha_registro">) => Promise<boolean>

  // Acciones de promociones
  crearPromocion: (promocion: Omit<Promocion, "id" | "fecha_creacion">) => Promise<boolean>
  actualizarPromocion: (id: number, promocion: Partial<Promocion>) => Promise<boolean>
  eliminarPromocion: (id: number) => Promise<boolean>
  obtenerPromocionesActivas: () => Promocion[]
  aplicarPromocion: (promocionId: number, productoId: number) => number // Retorna precio con descuento

  // Selectores
  totalCarrito: () => number
  cantidadItems: () => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      usuario: null,
      sessionId: null,
      isAuthenticated: false,
      menuAbierto: false,
      modalUbicaciones: false,
      carrito: [],
      filtros: {
        busqueda: "",
      },
      isLoading: false,
      clientes: [],
      promociones: [
        // Promociones de ejemplo
        {
          id: 1,
          titulo: "🔥 MEGA OFERTA BLACK FRIDAY",
          descripcion: "Hasta 50% de descuento en smartphones seleccionados",
          tipo: "descuento_porcentaje",
          valor_descuento: 50,
          fecha_inicio: "2024-01-01T00:00:00Z",
          fecha_fin: "2024-12-31T23:59:59Z",
          activa: true,
          imagen_banner: "/assets/banners/black-friday.jpg",
          color_fondo: "#FF0000",
          color_texto: "#FFFFFF",
          productos_incluidos: [1, 2, 3, 4, 5],
          limite_stock: 100,
          stock_usado: 25,
          prioridad: 1,
          mostrar_en_slider: true,
          fecha_creacion: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          titulo: "⚡ FLASH SALE - Solo HOY",
          descripcion: "iPhone 15 Pro Max con $500.000 de descuento",
          tipo: "descuento_fijo",
          valor_descuento: 500000,
          fecha_inicio: "2024-01-01T00:00:00Z",
          fecha_fin: "2024-12-31T23:59:59Z",
          activa: true,
          imagen_banner: "assets/banners/flash-sale.jpg",
          color_fondo: "#FFD700",
          color_texto: "#000000",
          productos_incluidos: [1, 6, 7],
          limite_stock: 50,
          stock_usado: 12,
          prioridad: 2,
          mostrar_en_slider: true,
          fecha_creacion: "2024-01-01T00:00:00Z",
        },
        {
          id: 3,
          titulo: "🎯 LIQUIDACIÓN TOTAL",
          descripcion: "Últimas unidades con precios increíbles",
          tipo: "liquidacion",
          valor_descuento: 70,
          fecha_inicio: "2024-01-01T00:00:00Z",
          fecha_fin: "2024-12-31T23:59:59Z",
          activa: true,
          imagen_banner: "/assets/banners/liquidacion.jpg",
          color_fondo: "#8B0000",
          color_texto: "#FFFFFF",
          productos_incluidos: [8, 9, 10],
          limite_stock: 30,
          stock_usado: 8,
          prioridad: 3,
          mostrar_en_slider: true,
          fecha_creacion: "2024-01-01T00:00:00Z",
        },
      ],
      promocionesActivas: [],

      // Toggle para el menú móvil
      toggleMenu: () => set((state) => ({ menuAbierto: !state.menuAbierto })),

      // Acciones del modal de producto

      toggleModalUbicaciones: () => set((state) => ({ modalUbicaciones: !state.modalUbicaciones })),

      // Acciones del carrito con persistencia mejorada
      agregarAlCarrito: (producto: Producto, cantidad = 1, color?: string) => {
        const { carrito } = get()
        const productoExistente = carrito.find((item) => item.producto.id === producto.id && item.color === color)

        if (productoExistente) {
          set({
            carrito: carrito.map((item) =>
              item.producto.id === producto.id && item.color === color
                ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
                : item,
            ),
          })
        } else {
          set({
            carrito: [...carrito, { producto, cantidad: Math.min(cantidad, producto.stock), color }],
          })
        }

        console.log("🛒 Store: Producto agregado al carrito:", { producto: producto.nombre, cantidad, color })
      },

      eliminarDelCarrito: (productoId: number, color?: string) => {
        const { carrito } = get()
        set({
          carrito: carrito.filter((item) => !(item.producto.id === productoId && item.color === color)),
        })
      },

      actualizarCantidad: (productoId: number, nuevaCantidad: number, color?: string) => {
        const { carrito } = get()
        if (nuevaCantidad <= 0) {
          get().eliminarDelCarrito(productoId, color)
          return
        }

        set({
          carrito: carrito.map((item) =>
            item.producto.id === productoId && item.color === color
              ? { ...item, cantidad: Math.min(nuevaCantidad, item.producto.stock) }
              : item,
          ),
        })
      },

      vaciarCarrito: () => {
        set({ carrito: [] })
      },

      // Actualizar filtros
      actualizarFiltros: (nuevoFiltro) =>
        set((state) => ({
          filtros: {
            ...state.filtros,
            ...nuevoFiltro,
          },
        })),

      // Autenticación
      login: async (email: string, password: string) => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const usuarios = [
            { id: 1, email: "admin@movilexpress.com", password: "admin123", nombre: "Administrador", isAdmin: true },
            { id: 2, email: "superadmin@movilexpress.com", password: "super123", nombre: "Super Admin", isAdmin: true },
          ]

          const usuario = usuarios.find((u) => u.email === email && u.password === password)

          if (usuario) {
            set({
              isAuthenticated: true,
              usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, isAdmin: usuario.isAdmin },
              isLoading: false,
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          usuario: null,
        })
      },

      // Registro de clientes
      registrarCliente: async (cliente: Omit<Cliente, "id" | "fecha_registro">) => {
        try {
          const nuevoCliente: Cliente = {
            ...cliente,
            id: Date.now(),
            fecha_registro: new Date().toISOString(),
            activo: true,
          }

          set((state) => ({
            clientes: [...state.clientes, nuevoCliente],
          }))

          console.log("✅ Cliente registrado:", nuevoCliente)
          return true
        } catch (error) {
          console.error("❌ Error registrando cliente:", error)
          return false
        }
      },

      // Acciones de promociones
      crearPromocion: async (promocion: Omit<Promocion, "id" | "fecha_creacion">) => {
        try {
          const nuevaPromocion: Promocion = {
            ...promocion,
            id: Date.now(),
            fecha_creacion: new Date().toISOString(),
            stock_usado: 0,
          }

          set((state) => ({
            promociones: [...state.promociones, nuevaPromocion],
          }))

          console.log("✅ Promoción creada:", nuevaPromocion)
          return true
        } catch (error) {
          console.error("❌ Error creando promoción:", error)
          return false
        }
      },

      actualizarPromocion: async (id: number, promocionActualizada: Partial<Promocion>) => {
        try {
          set((state) => ({
            promociones: state.promociones.map((promo) =>
              promo.id === id
                ? { ...promo, ...promocionActualizada, fecha_actualizacion: new Date().toISOString() }
                : promo,
            ),
          }))

          console.log("✅ Promoción actualizada:", id)
          return true
        } catch (error) {
          console.error("❌ Error actualizando promoción:", error)
          return false
        }
      },

      eliminarPromocion: async (id: number) => {
        try {
          set((state) => ({
            promociones: state.promociones.filter((promo) => promo.id !== id),
          }))

          console.log("✅ Promoción eliminada:", id)
          return true
        } catch (error) {
          console.error("❌ Error eliminando promoción:", error)
          return false
        }
      },

      obtenerPromocionesActivas: () => {
        const { promociones } = get()
        const ahora = new Date()

        return promociones
          .filter((promo) => {
            const fechaInicio = new Date(promo.fecha_inicio)
            const fechaFin = new Date(promo.fecha_fin)

            return (
              promo.activa &&
              promo.mostrar_en_slider &&
              ahora >= fechaInicio &&
              ahora <= fechaFin &&
              (!promo.limite_stock || (promo.stock_usado || 0) < promo.limite_stock)
            )
          })
          .sort((a, b) => a.prioridad - b.prioridad)
      },

      aplicarPromocion: (promocionId: number, productoId: number) => {
        const { promociones } = get()
        const promocion = promociones.find((p) => p.id === promocionId)

        if (!promocion || !promocion.productos_incluidos.includes(productoId)) {
          return 0
        }

        return promocion.valor_descuento
      },

      // Selectores
      totalCarrito: () => {
        const { carrito } = get()
        return carrito.reduce((acc, item) => acc + item.producto.precio_actual * item.cantidad, 0)
      },

      cantidadItems: () => {
        const { carrito } = get()
        return carrito.reduce((acc, item) => acc + item.cantidad, 0)
      },
    }),
    {
      name: "movil-express-storage",
      partialize: (state) => ({
        carrito: state.carrito,
        clientes: state.clientes,
        promociones: state.promociones,
        isAuthenticated: state.isAuthenticated,
        usuario: state.usuario,
      }),
    },
  ),
)
