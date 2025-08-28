"use client"

import { useState, useEffect } from "react"
import type { ProductoCompleto, ApiResponse, ProductoFiltros } from "../types/database"

export function useProductos(filtrosIniciales?: ProductoFiltros) {
  const [productos, setProductos] = useState<ProductoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  const fetchProductos = async (filtros?: ProductoFiltros) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      const filtrosFinales = { ...(filtrosIniciales || {}), ...(filtros || {}) }

      // Solo agregar parámetros que no sean undefined, null o string vacío
      Object.entries(filtrosFinales).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      console.log("🔄 Fetching productos with URL:", `/api/productos?${params.toString()}`)

      const response = await fetch(`/api/productos?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ApiResponse<ProductoCompleto[]> = await response.json()

      console.log("📦 API Response:", {
        success: data.success,
        dataLength: data.data?.length,
        pagination: data.pagination,
        error: data.error,
      })

      if (data.success && data.data) {
        setProductos(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
        console.log(`✅ Successfully loaded ${data.data.length} productos`)
      } else {
        const errorMsg = data.error || "Error desconocido al cargar productos"
        setError(errorMsg)
        console.error("❌ API Error:", errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error de conexión"
      setError(errorMsg)
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos(filtrosIniciales)
  }, [JSON.stringify(filtrosIniciales)])

  return {
    productos,
    loading,
    error,
    pagination,
    refetch: () => fetchProductos(filtrosIniciales),
    setFiltros: fetchProductos,
  }
}

export function useProducto(id: number) {
  const [producto, setProducto] = useState<ProductoCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/productos/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data: ApiResponse<ProductoCompleto> = await response.json()

        if (data.success && data.data) {
          setProducto(data.data)
        } else {
          setError(data.error || "Producto no encontrado")
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error de conexión"
        setError(errorMsg)
        console.error("Error fetching producto:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [id])

  return { producto, loading, error }
}

export function useProductosDestacados() {
  return useProductos({
    destacado: true,
    limit: 4,
    sortBy: "fecha_creacion",
    sortOrder: "desc",
  })
}

export function useProductosOferta() {
  return useProductos({
    en_oferta: true,
    limit: 8,
    sortBy: "porcentaje_descuento",
    sortOrder: "desc",
  })
}
