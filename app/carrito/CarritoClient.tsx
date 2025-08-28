"use client"

import BoldButton from "./BoldButton"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CarritoClient({ boldToken }: { boldToken: string }) {
  const { carrito, eliminarDelCarrito, actualizarCantidad, usuario } = useStore()
  const total = useStore((state) => state.totalCarrito())
  const cantidad = useStore((state) => state.cantidadItems())
  const router = useRouter()

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const handleActualizarCantidad = (productoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return
    actualizarCantidad(productoId, nuevaCantidad)
  }


  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/catalogo" className="flex items-center space-x-2 text-gray-600 hover:text-black">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al catálogo</span>
              </Link>
              <h1 className="text-xl font-bold text-black">Mi Carrito</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        {/* Carrito vacío */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">¡Descubre nuestros increíbles productos y encuentra lo que necesitas!</p>
          <Link href="/catalogo">
            <Button className="bg-[#988443] text-white hover:bg-[#8a7a3e] px-8 py-3 rounded-2xl font-semibold">
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/catalogo" className="flex items-center space-x-2 text-gray-600 hover:text-black text-sm sm:text-base">
              <ArrowLeft className="w-5 h-5" />
              <span>Continuar comprando</span>
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-black">Mi Carrito ({cantidad})</h1>
            <div className="w-16 sm:w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((item) => (
              <Card key={`${item.producto.id}-${item.color || "default"}`} className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  {/* Mobile/Tablet: vertical, Desktop: horizontal */}
                  <div className="flex flex-col w-full gap-2 lg:flex-row lg:items-center lg:gap-0 lg:space-x-0">
                    {/* Imagen */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 mb-3 lg:mb-0 lg:mr-6 border border-gray-200">
                      <Image
                        src={item.producto.imagen_principal || "/placeholder.svg?height=100&width=100"}
                        alt={item.producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Info y controles en fila en desktop */}
                    <div className="flex flex-1 flex-col gap-2 w-full lg:flex-row lg:items-center lg:gap-0 lg:space-x-0 lg:bg-white lg:rounded-xl lg:shadow-none lg:border lg:border-gray-200 lg:py-2 lg:px-0">
                      {/* Info producto */}
                      <div className="flex flex-col items-start min-w-[120px] max-w-[220px] flex-1 justify-center px-2 lg:px-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-black leading-snug max-w-full truncate" title={item.producto.nombre}>
                          {item.producto.nombre}
                        </h3>
                        {item.color && (
                          <p className="text-[10px] sm:text-xs text-gray-600 max-w-full truncate" title={item.color}>
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                      {/* Precio unitario */}
                      <div className="flex flex-col items-center justify-center min-w-[80px] lg:min-w-[120px] border-t border-gray-100 pt-2 lg:border-t-0 lg:border-l lg:border-gray-200 lg:pt-0 lg:pl-4">
                        <span className="text-xs sm:text-base font-bold text-black">
                          {formatearPrecio(item.producto.precio_actual)}
                        </span>
                        <span className="text-[10px] text-gray-400 lg:hidden">c/u</span>
                      </div>
                      {/* Cantidad */}
                      <div className="flex flex-col items-center justify-center min-w-[90px] lg:min-w-[110px] border-t border-gray-100 pt-2 lg:border-t-0 lg:border-l lg:border-gray-200 lg:pt-0 lg:pl-4">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="w-7 h-7 p-0 border-gray-300"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-7 text-center font-semibold text-xs sm:text-base select-none">{item.cantidad}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.producto.stock}
                            className="w-7 h-7 p-0 border-gray-300"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Total por producto */}
                      <div className="flex flex-col items-center justify-center min-w-[90px] lg:min-w-[120px] border-t border-gray-100 pt-2 lg:border-t-0 lg:border-l lg:border-gray-200 lg:pt-0 lg:pl-4">
                        <span className="text-xs sm:text-base font-bold text-black">
                          {formatearPrecio(item.producto.precio_actual * item.cantidad)}
                        </span>
                        <span className="text-[10px] text-gray-400 lg:hidden">total</span>
                      </div>
                      {/* Eliminar */}
                      <div className="flex items-center justify-center lg:justify-end min-w-[60px] border-t border-gray-100 pt-2 lg:border-t-0 lg:border-l lg:border-gray-200 lg:pt-0 -pl-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarDelCarrito(item.producto.id, item.color)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg lg:sticky lg:top-24 mt-4 lg:mt-0">
              <CardContent className="p-3 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Resumen del Pedido</h3>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal ({cantidad} productos)</span>
                    <span className="font-semibold">{formatearPrecio(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold text-green-600">GRATIS</span>
                  </div>
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="font-bold text-black">Total</span>
                      <span className="font-bold text-black">{formatearPrecio(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de pago Bold (React compatible) */}
                <BoldButton boldToken={boldToken} total={total} />

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Envío gratis a todo el país</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Garantía oficial de 1 año</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Soporte técnico 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
