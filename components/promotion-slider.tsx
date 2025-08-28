"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Clock, Zap, FlameIcon as Fire, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import Image from "next/image"
import type { Promocion } from "@/lib/store"

interface PromotionSliderProps {
  autoPlay?: boolean
  autoPlayInterval?: number
  transitionSpeed?: number
}

export function PromotionSlider({
  autoPlay = true,
  autoPlayInterval = 3000,
  transitionSpeed = 500,
}: PromotionSliderProps) {
  const { obtenerPromocionesActivas } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Obtener promociones activas
  useEffect(() => {
    const promocionesActivas = obtenerPromocionesActivas()
    setPromociones(promocionesActivas)
  }, [obtenerPromocionesActivas])

  // Auto play mejorado
  useEffect(() => {
    if (!autoPlay || promociones.length <= 1) return

    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, autoPlayInterval)
    }

    const stopAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    startAutoPlay()

    // Pausar en hover
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("mouseenter", stopAutoPlay)
      slider.addEventListener("mouseleave", startAutoPlay)
    }

    return () => {
      stopAutoPlay()
      if (slider) {
        slider.removeEventListener("mouseenter", stopAutoPlay)
        slider.removeEventListener("mouseleave", startAutoPlay)
      }
    }
  }, [autoPlay, autoPlayInterval, promociones.length])

  const nextSlide = () => {
    if (isTransitioning || promociones.length <= 1) return

    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % promociones.length)

    setTimeout(() => setIsTransitioning(false), transitionSpeed)
  }

  const prevSlide = () => {
    if (isTransitioning || promociones.length <= 1) return

    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + promociones.length) % promociones.length)

    setTimeout(() => setIsTransitioning(false), transitionSpeed)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return

    setIsTransitioning(true)
    setCurrentIndex(index)

    setTimeout(() => setIsTransitioning(false), transitionSpeed)
  }

  const getPromoIcon = (tipo: string) => {
    switch (tipo) {
      case "descuento_porcentaje":
        return <Fire className="w-5 h-5 md:w-6 md:h-6" />
      case "descuento_fijo":
        return <Zap className="w-5 h-5 md:w-6 md:h-6" />
      case "oferta_especial":
        return <Target className="w-5 h-5 md:w-6 md:h-6" />
      case "liquidacion":
        return <Clock className="w-5 h-5 md:w-6 md:h-6" />
      default:
        return <Fire className="w-5 h-5 md:w-6 md:h-6" />
    }
  }

  const calcularTiempoRestante = (fechaFin: string) => {
    const ahora = new Date().getTime()
    const fin = new Date(fechaFin).getTime()
    const diferencia = fin - ahora

    if (diferencia <= 0) return null

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))

    if (dias > 0) return `${dias}d ${horas}h`
    if (horas > 0) return `${horas}h ${minutos}m`
    return `${minutos}m`
  }

  if (promociones.length === 0) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden" ref={sliderRef}>
      {/* Slider Container */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64">
        {promociones.map((promocion, index) => {
          const isActive = index === currentIndex
          const tiempoRestante = calcularTiempoRestante(promocion.fecha_fin)
          const stockRestante = promocion.limite_stock ? promocion.limite_stock - (promocion.stock_usado || 0) : null

          return (
            <div
              key={promocion.id}
              className={`absolute inset-0 transition-all duration-${transitionSpeed} ease-in-out ${
                isActive
                  ? "opacity-100 transform translate-x-0 scale-100"
                  : index < currentIndex
                    ? "opacity-0 transform -translate-x-full scale-95"
                    : "opacity-0 transform translate-x-full scale-95"
              }`}
              style={{
                background: `linear-gradient(135deg, ${promocion.color_fondo}dd, ${promocion.color_fondo}aa)`,
              }}
            >
              {/* Imagen de fondo si existe */}
              {promocion.imagen_banner && (
                <div className="absolute inset-0">
                  <Image
                    src={promocion.imagen_banner || "/placeholder.svg"}
                    alt={promocion.titulo}
                    fill
                    className="object-cover opacity-20"
                    priority={isActive}
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="relative h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
                {/* Lado izquierdo - Información */}
                <div className="flex-1 space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div
                      className="p-1.5 md:p-2 rounded-full"
                      style={{ backgroundColor: promocion.color_texto + "20" }}
                    >
                      {getPromoIcon(promocion.tipo)}
                    </div>
                    <Badge
                      className="text-xs md:text-sm font-bold px-2 md:px-3 py-1"
                      style={{
                        backgroundColor: promocion.color_texto + "20",
                        color: promocion.color_texto,
                        border: `1px solid ${promocion.color_texto}40`,
                      }}
                    >
                      {promocion.tipo === "descuento_porcentaje" && `${promocion.valor_descuento}% OFF`}
                      {promocion.tipo === "descuento_fijo" && `$${promocion.valor_descuento.toLocaleString()} OFF`}
                      {promocion.tipo === "oferta_especial" && "OFERTA ESPECIAL"}
                      {promocion.tipo === "liquidacion" && "LIQUIDACIÓN"}
                    </Badge>
                  </div>

                  <h3
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight"
                    style={{ color: promocion.color_texto }}
                  >
                    {promocion.titulo}
                  </h3>

                  <p
                    className="text-sm sm:text-base md:text-lg opacity-90 line-clamp-2"
                    style={{ color: promocion.color_texto }}
                  >
                    {promocion.descripcion}
                  </p>

                  {/* Información adicional */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                    {tiempoRestante && (
                      <div
                        className="flex items-center space-x-1 px-2 py-1 rounded-full"
                        style={{ backgroundColor: promocion.color_texto + "20" }}
                      >
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span style={{ color: promocion.color_texto }}>Termina en {tiempoRestante}</span>
                      </div>
                    )}

                    {stockRestante && stockRestante <= 20 && (
                      <div
                        className="flex items-center space-x-1 px-2 py-1 rounded-full animate-pulse"
                        style={{ backgroundColor: "#ff000020" }}
                      >
                        <Fire className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                        <span className="text-red-500 font-medium">Solo quedan {stockRestante}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lado derecho - CTA */}
                <div className="flex-shrink-0 ml-4 md:ml-6">
                  <Button
                    size="lg"
                    className="text-sm md:text-base font-bold px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    style={{
                      backgroundColor: promocion.color_texto,
                      color: promocion.color_fondo,
                    }}
                    onClick={() => {
                      // Aquí puedes agregar la lógica para ir a la página de la promoción
                      window.location.href = `/promociones/${promocion.id}`
                    }}
                  >
                    Ver Ofertas
                  </Button>
                </div>
              </div>

              {/* Efectos visuales */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className="w-full h-full rounded-full" style={{ backgroundColor: promocion.color_texto }} />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5">
                <div className="w-full h-full rounded-full" style={{ backgroundColor: promocion.color_texto }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Controles de navegación */}
      {promociones.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 p-0 rounded-full bg-white/90 border-white/50 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 p-0 rounded-full bg-white/90 border-white/50 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </>
      )}

      {/* Indicadores de puntos */}
      {promociones.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {promociones.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white scale-125 shadow-lg" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Barra de progreso */}
      {autoPlay && promociones.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div
            className="h-full bg-white/80 transition-all ease-linear"
            style={{
              width: `${((currentIndex + 1) / promociones.length) * 100}%`,
              transitionDuration: `${autoPlayInterval}ms`,
            }}
          />
        </div>
      )}
    </div>
  )
}
