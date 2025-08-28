"use client"

import { useState } from "react"
import { X, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Zap, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import Image from "next/image"

export function ModalProducto() {
  const { productoSeleccionado, modalProductoAbierto, cerrarModalProducto, agregarAlCarrito } = useStore()
  const [imagenActual, setImagenActual] = useState(0)
  const [colorSeleccionado, setColorSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState(1)

  if (!modalProductoAbierto || !productoSeleccionado) return null

  console.log("🔍 Modal: Producto seleccionado:", productoSeleccionado)

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const calcularDescuento = (anterior: number | null, nuevo: number) => {
    if (!anterior) return 0
    return Math.round(((anterior - nuevo) / anterior) * 100)
  }

  const imagenes =
    Array.isArray(productoSeleccionado.imagenes) && productoSeleccionado.imagenes.length > 0
      ? productoSeleccionado.imagenes.map((img) => img.url_imagen)
      : [productoSeleccionado.imagen_principal].filter(Boolean)

  const handleAgregarCarrito = () => {
    agregarAlCarrito(productoSeleccionado, cantidad, colorSeleccionado)
    cerrarModalProducto()
  }

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % imagenes.length)
  }

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent z-10"></div>

          <Button
            variant="outline"
            size="sm"
            onClick={cerrarModalProducto}
            className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
                <Image
                  src={imagenes[imagenActual] || "/placeholder.svg?height=600&width=600"}
                  alt={productoSeleccionado.nombre}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />

                {imagenes.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={anteriorImagen}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={siguienteImagen}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {imagenes.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setImagenActual(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === imagenActual ? "bg-yellow-600 w-6" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {imagenes.length > 1 && (
                <div className="flex space-x-3 mt-6 justify-center">
                  {imagenes.slice(0, 4).map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActual(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        index === imagenActual ? "border-yellow-600 shadow-lg" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={imagen || "/placeholder.svg?height=100&width=100"}
                        alt={`${productoSeleccionado.nombre} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12 overflow-y-auto max-h-[95vh]">
              <div className="flex items-center space-x-2 mb-4">
                {productoSeleccionado.en_oferta && (
                  <Badge className="bg-red-500 text-white font-bold animate-pulse">
                    -{calcularDescuento(productoSeleccionado.precio_anterior, productoSeleccionado.precio_actual)}% OFF
                  </Badge>
                )}
                <Badge variant="outline" className="border-green-500 text-green-700">
                  {productoSeleccionado.estado}
                </Badge>
                {productoSeleccionado.stock <= 5 && (
                  <Badge className="bg-orange-500 text-white">¡Últimas {productoSeleccionado.stock} unidades!</Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight">
                {productoSeleccionado.nombre}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < productoSeleccionado.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({productoSeleccionado.rating}.0)</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-black">
                    {formatearPrecio(productoSeleccionado.precio_actual)}
                  </span>
                  {productoSeleccionado.precio_anterior && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatearPrecio(productoSeleccionado.precio_anterior)}
                    </span>
                  )}
                </div>
                {productoSeleccionado.precio_anterior && (
                  <p className="text-green-600 font-medium text-lg">
                    ¡Ahorra {formatearPrecio(productoSeleccionado.precio_anterior - productoSeleccionado.precio_actual)}
                    !
                  </p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{productoSeleccionado.descripcion}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4">Características Principales</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(productoSeleccionado.caracteristicas) &&
                  productoSeleccionado.caracteristicas.length > 0 ? (
                    productoSeleccionado.caracteristicas.map((caracteristica, index) => (
                      <div
                        key={`caracteristica-${index}`}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-gray-700">{caracteristica}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-gray-700">Producto de alta calidad</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-gray-700">Garantía incluida</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-gray-700">Envío gratuito</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {Array.isArray(productoSeleccionado.colores) && productoSeleccionado.colores.length > 0 && (
                  <div>
                    <h4 className="font-bold text-black mb-3">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {productoSeleccionado.colores.map((color, index) => (
                        <Button
                          key={`color-${index}`}
                          variant={colorSeleccionado === color ? "default" : "outline"}
                          onClick={() => setColorSeleccionado(color)}
                          className={`${
                            colorSeleccionado === color
                              ? "bg-yellow-600 text-black border-yellow-600 hover:bg-yellow-700"
                              : "border-gray-300 hover:border-yellow-600 hover:bg-yellow-50"
                          }`}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-black mb-3">Cantidad</h4>
                  <Select value={cantidad.toString()} onValueChange={(value) => setCantidad(Number.parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(Math.min(productoSeleccionado.stock, 10))].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                <h4 className="font-bold text-black mb-4">Beneficios incluidos</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Garantía oficial de 1 año</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Envío gratis a todo el país</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Soporte técnico 24/7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAgregarCarrito}
                  disabled={productoSeleccionado.stock === 0}
                  className="w-full bg-yellow-600 text-black hover:bg-yellow-700 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {productoSeleccionado.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-black py-4 text-lg font-bold rounded-2xl bg-transparent"
                >
                  Comprar Ahora
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">SKU:</span> ME-{productoSeleccionado.id.toString().padStart(4, "0")}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {productoSeleccionado.stock} disponibles
                  </div>
                  <div>
                    <span className="font-medium">Capacidad:</span> {productoSeleccionado.capacidad}
                  </div>
                  <div>
                    <span className="font-medium">Categoría:</span>{" "}
                    {Array.isArray(productoSeleccionado.categorias) && productoSeleccionado.categorias.length > 0
                      ? productoSeleccionado.categorias
                          .map((cat) => {
                            if (
                              typeof cat === "object" &&
                              cat !== null &&
                              typeof cat.nombre === "string" &&
                              !Array.isArray(cat.nombre)
                            ) {
                              return cat.nombre
                            }
                            return null
                          })
                          .filter((nombre) => typeof nombre === "string" && nombre.length > 0)
                          .join(", ")
                      : "Tecnología"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
