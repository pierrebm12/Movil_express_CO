
"use client"


import { useState, useEffect } from "react"
import { Filter, Grid, List, Star, ShoppingCart, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ModalUbicaciones } from "@/components/modal-ubicaciones"
import { useStore } from "@/lib/store"
import { useProductos } from "@/hooks/use-productos"
import Image from "next/image"
import type { ProductoFiltros } from "@/types/database"
import Link from "next/link"


export default function CatalogoPage() {
  const { agregarAlCarrito, filtros: filtrosStore } = useStore()

  const [filtros, setFiltros] = useState<ProductoFiltros>({
    page: 1,
    limit: 12,
    sortBy: "fecha_creacion",
    sortOrder: "desc",
  })

  const [vistaGrid, setVistaGrid] = useState(true)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [busquedaLocal, setBusquedaLocal] = useState("")

  const { productos, loading, error, pagination, setFiltros: actualizarFiltros } = useProductos(filtros)

  useEffect(() => {
    if (filtrosStore.busqueda !== filtros.busqueda) {
      handleFiltroChange({ busqueda: filtrosStore.busqueda })
      setBusquedaLocal(filtrosStore.busqueda)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosStore.busqueda])

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const calcularDescuento = (anterior: number, nuevo: number) => {
    return Math.round(((anterior - nuevo) / anterior) * 100)
  }

  // Normaliza los tipos de los filtros antes de enviarlos al backend
  const handleFiltroChange = (nuevosFiltros: Partial<ProductoFiltros>) => {
    let filtrosActualizados = { ...filtros, ...nuevosFiltros, page: 1 }

    // Convertir marca a número si es string numérico
    if (filtrosActualizados.marca && typeof filtrosActualizados.marca === "string" && !isNaN(Number(filtrosActualizados.marca))) {
      filtrosActualizados.marca = Number(filtrosActualizados.marca) as any
    }

    // Convertir booleanos a string 'true'/'false' para el backend
    if (typeof filtrosActualizados.en_oferta === "boolean") {
      filtrosActualizados.en_oferta = filtrosActualizados.en_oferta ? "true" : "false" as any
    }
    if (typeof filtrosActualizados.destacado === "boolean") {
      filtrosActualizados.destacado = filtrosActualizados.destacado ? "true" : "false" as any
    }

    setFiltros(filtrosActualizados)
    actualizarFiltros(filtrosActualizados)
  }

  const handleBusqueda = () => {
    handleFiltroChange({ busqueda: busquedaLocal })
  }

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      page: 1,
      limit: 12,
      sortBy: "fecha_creacion",
      sortOrder: "desc" as const,
    }
    setFiltros(filtrosLimpios)
    setBusquedaLocal("")
    actualizarFiltros(filtrosLimpios)
  }

  const cambiarPagina = (nuevaPagina: number) => {
    const filtrosConPagina = { ...filtros, page: nuevaPagina }
    setFiltros(filtrosConPagina)
    actualizarFiltros(filtrosConPagina)
  }

  // Obtener todas las marcas activas desde el backend
  const [marcasDisponibles, setMarcasDisponibles] = useState<{ id: number, nombre: string }[]>([])
  useEffect(() => {
    fetch("/api/marcas")
      .then((res) => res.json())
      .then((data) => {
        const marcasArr = data.data || data.marcas || [];
        setMarcasDisponibles(marcasArr.map((m: any) => ({ id: m.id, nombre: m.nombre })));
      })
      .catch(() => setMarcasDisponibles([]))
  }, [])

  // Obtener todas las categorías activas desde el backend
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<{ id: number, nombre: string }[]>([])
  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((res) => res.json())
      .then((data) => {
        const categoriasArr = data.data || data.categorias || [];
        setCategoriasDisponibles(categoriasArr.map((c: any) => ({ id: c.id, nombre: c.nombre })));
      })
      .catch(() => setCategoriasDisponibles([]))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Catálogo Completo</h1>
          <p className="text-xl text-gray-600">
            Encuentra el dispositivo perfecto para ti. {pagination.total} productos disponibles.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Filtros</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <div className={`space-y-6 ${filtrosAbiertos ? "block" : "hidden lg:block"}`}>
                {/* Categoría */}
                <div>
                  <h4 className="font-bold text-black mb-3">Categoría</h4>
                  <Select
                    value={filtros.categoria || "all"}
                    onValueChange={(value) => handleFiltroChange({ categoria: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categoriasDisponibles.map((categoria) => (
                        <SelectItem key={categoria.id} value={String(categoria.id)}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Búsqueda */}
                <div>
                  <h4 className="font-bold text-black mb-3">Buscar</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar productos..."
                      value={busquedaLocal}
                      onChange={(e) => setBusquedaLocal(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleBusqueda()}
                    />
                    <Button onClick={handleBusqueda} size="sm" className="bg-primary-500 text-black hover:bg-primary-600">
                      Buscar
                    </Button>
                  </div>
                </div>

                {/* Marca */}
                <div>
                  <h4 className="font-bold text-black mb-3">Marca</h4>
                  <Select
                    value={filtros.marca || "all"}
                    onValueChange={(value) => handleFiltroChange({ marca: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las marcas</SelectItem>
                      {marcasDisponibles.map((marca) => (
                        <SelectItem key={marca.id} value={String(marca.id)}>
                          {marca.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Estado */}
                <div>
                  <h4 className="font-bold text-black mb-3">Estado</h4>
                  <Select
                    value={filtros.estado || "all"}
                    onValueChange={(value) => handleFiltroChange({ estado: value === "all" ? undefined : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="usado">Usado</SelectItem>
                      <SelectItem value="reacondicionado">Reacondicionado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rango de Precio */}
                <div>
                  <h4 className="font-bold text-black mb-3">Rango de Precio</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Precio mín"
                        value={filtros.precio_min || ""}
                        onChange={(e) => handleFiltroChange({ precio_min: Number(e.target.value) || undefined })}
                      />
                      <Input
                        type="number"
                        placeholder="Precio máx"
                        value={filtros.precio_max || ""}
                        onChange={(e) => handleFiltroChange({ precio_max: Number(e.target.value) || undefined })}
                      />
                    </div>
                  </div>
                </div>

                {/* Solo Ofertas */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ofertas"
                    checked={filtros.en_oferta || false}
                    onCheckedChange={(checked) => handleFiltroChange({ en_oferta: checked as boolean })}
                  />
                  <label htmlFor="ofertas" className="text-sm text-gray-700 cursor-pointer">
                    Solo productos en oferta
                  </label>
                </div>

                {/* Solo Destacados */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destacados"
                    checked={filtros.destacado || false}
                    onCheckedChange={(checked) => handleFiltroChange({ destacado: checked as boolean })}
                  />
                  <label htmlFor="destacados" className="text-sm text-gray-700 cursor-pointer">
                    Solo productos destacados
                  </label>
                </div>

                {/* Ordenar por */}
                <div>
                  <h4 className="font-bold text-black mb-3">Ordenar por</h4>
                  <Select
                    value={`${filtros.sortBy}-${filtros.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split("-")
                      handleFiltroChange({ sortBy, sortOrder: sortOrder as "asc" | "desc" })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fecha_creacion-desc">Más recientes</SelectItem>
                      <SelectItem value="fecha_creacion-asc">Más antiguos</SelectItem>
                      <SelectItem value="precio_actual-asc">Precio: menor a mayor</SelectItem>
                      <SelectItem value="precio_actual-desc">Precio: mayor a menor</SelectItem>
                      <SelectItem value="nombre-asc">Nombre: A-Z</SelectItem>
                      <SelectItem value="nombre-desc">Nombre: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Limpiar filtros */}
                <Button
                  variant="outline"
                  onClick={limpiarFiltros}
                  className="w-full border-primary-400 text-primary-600 hover:bg-primary-400 hover:text-black"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Controles de Vista */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {loading ? "Cargando..." : `${pagination.total} productos encontrados`}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={vistaGrid ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVistaGrid(true)}
                    className={vistaGrid ? "bg-primary-600 text-black" : ""}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={!vistaGrid ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVistaGrid(false)}
                    className={!vistaGrid ? "bg-primary-600 text-black" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            
            {/* Grid/Lista de Productos */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-600 mb-4">Error al cargar productos</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                  onClick={() => actualizarFiltros(filtros)}
                  className="bg-primary-600 text-black hover:bg-primary-400"
                >
                  Reintentar
                </Button>
              </div>
            ) : productos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No se encontraron productos</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar los filtros o realizar una búsqueda diferente.</p>
                <Button onClick={limpiarFiltros} className="bg-primary-500 text-black hover:bg-primary-600">
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <>
              
                <div className={vistaGrid ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                  {productos.map((producto) => (
                    <Card
                      key={producto.id}
                      className={`group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-0 shadow-lg cursor-pointer ${!vistaGrid ? "flex" : ""} h-[615px] flex flex-col`} // <-- altura fija y flex
                      onClick={() => {
                        const { imagenes, caracteristicas, colores, categorias, ...rest } = producto
                        const productoForStore = {
                          ...rest,
                          rating: 5,
                          peso: producto.peso !== undefined ? String(producto.peso) : undefined,
                        }
                        // abrirModalProducto(productoForStore)
                      }}
                    >
                      <div className={`relative w-full ${!vistaGrid ? "w-48 flex-shrink-0" : ""}`}>
                        <Image
                          src={producto.imagen_principal || "/placeholder.svg?height=300&width=300"}
                          alt={producto.nombre}
                          width={vistaGrid ? 300 : 200}
                          height={vistaGrid ? 300 : 200}
                          className={`object-cover w-full h-64`} // <-- tamaño fijo para imagen
                        />
                        {producto.en_oferta && producto.precio_anterior && (
                          <Badge className="absolute top-4 left-4 bg-black text-primary-500 font-bold">
                            -{calcularDescuento(producto.precio_anterior, producto.precio_actual)}%
                          </Badge>
                        )}
                        {producto.destacado && (
                          <Badge className="absolute top-4 right-4 bg-purple-500 text-white font-bold">
                            ⭐ Destacado
                          </Badge>
                        )}
                        {producto.stock <= 5 && producto.stock > 0 && (
                          <Badge className="absolute bottom-4 left-4 bg-orange-500 text-white font-bold animate-pulse">
                            ¡Últimas {producto.stock}!
                          </Badge>
                        )}
                        {producto.stock === 0 && (
                          <Badge className="absolute bottom-4 left-4 bg-red-500 text-white font-bold">Agotado</Badge>
                        )}
                      </div>
                      <CardContent className={`p-6 flex-1 flex flex-col justify-between`}> {/* <-- flex para contenido */}
                        <div className="flex items-center  mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < 5 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">(5.0)</span>
                        </div>

                        <h2 className="font-bold text-lg text-black mb-2 group-hover:text-primary-500 transition-colors">
                          {producto.nombre}
                        </h2>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.descripcion}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {producto.estado}
                          </Badge>
                          {producto.capacidad && (
                            <Badge variant="outline" className="text-xs">
                              {producto.capacidad}
                            </Badge>
                          )}
                          {producto.marca && (
                            <Badge variant="outline" className="text-xs">
                              {producto.marca}
                            </Badge>
                          )}
                        </div>

                        <div className="mb-4">
                          {producto.precio_anterior && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatearPrecio(producto.precio_anterior)}
                            </span>
                          )}
                          <div className="text-2xl font-bold text-black">{formatearPrecio(producto.precio_actual)}</div>
                          {producto.en_oferta && producto.precio_anterior && (
                            <p className="text-sm text-green-600 font-medium">
                              ¡Ahorra {formatearPrecio(producto.precio_anterior - producto.precio_actual)}!
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 w-full">
                          <Link href={`/producto/${producto.id}`} className="flex-1">
                            <Button
                              className="w-full bg-black text-primary-500 border-primary border-1 hover:bg-primary-500 hover:text-black rounded-xl font-bold"
                              onClick={(e) => {
                                e.stopPropagation()
                                //abrirModalProducto(producto) // Si quieres abrir el modal además de navegar, descomenta esto
                              }}
                            >
                              Ver detalles
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              const { imagenes, caracteristicas, colores, categorias, ...rest } = producto
                              const productoForStore = {
                                ...rest,
                                rating: 5,
                                peso: producto.peso !== undefined ? String(producto.peso) : undefined,
                              }
                              agregarAlCarrito(productoForStore)
                            }}
                            className="border-primary-400 text-primary-600 hover:bg-primary-400 hover:text-black"
                            disabled={producto.stock === 0}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => cambiarPagina(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Anterior
                    </Button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            onClick={() => cambiarPagina(pageNum)}
                            className={pageNum === pagination.page ? "bg-primary-500 text-black" : ""}
                          >
                            {pageNum}
                          </Button>
                        )
                      } else if (pageNum === pagination.page - 3 || pageNum === pagination.page + 3) {
                        return (
                          <span key={pageNum} className="px-2">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}

                    <Button
                      variant="outline"
                      onClick={() => cambiarPagina(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ModalUbicaciones />
    </div>
  )
}

const searchParams = new URLSearchParams({ /* tus filtros aquí */ })
console.log("🔄 Fetching productos with URL:", `/api/productos?${searchParams.toString()}`)
