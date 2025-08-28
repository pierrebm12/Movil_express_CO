"use client"

import { useState, useEffect } from "react"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import Image from "next/image"
import type { Producto } from "@/lib/store"
import type { ProductoCompleto } from "@/types/database"
import Link from "next/link"
import { ProductSliderCard } from "@/components/ProductSliderCard"

interface ProductSliderProps {
  productos: (Producto | ProductoCompleto)[];
  titulo: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoSlide?: boolean;
  slideInterval?: number;
  loop?: boolean;
  dragEnabled?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  centerMode?: boolean;
  lazyLoad?: boolean;
  verDetallesLink?: (producto: Producto | ProductoCompleto) => string;
}

export function ProductSlider({ productos, titulo, autoPlay = true, autoPlayInterval = 5000, verDetallesLink }: ProductSliderProps) {
  const { agregarAlCarrito } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  
  // Touch handling
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1) // iPhone XS y móviles pequeños
      } else if (window.innerWidth < 768) {
        setItemsPerView(2) // Tablets pequeñas
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3) // Tablets
      } else {
        setItemsPerView(4) // Desktop
      }
    }

    updateItemsPerView()
    window.addEventListener("resize", updateItemsPerView)
    return () => window.removeEventListener("resize", updateItemsPerView)
  }, [])

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || productos.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = productos.length - itemsPerView
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, autoPlayInterval, productos.length, itemsPerView])

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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
    setIsAutoPlaying(false) // Pausar autoplay durante el touch
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      // Swipe left - next slide
      const maxIndex = productos.length - itemsPerView
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }
    
    if (isRightSwipe) {
      // Swipe right - previous slide
      const maxIndex = productos.length - itemsPerView
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }
    
    // Reanudar autoplay después de 3 segundos
    setTimeout(() => {
      setIsAutoPlaying(autoPlay)
    }, 3000)
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
    setIsDragging(true)
    setIsAutoPlaying(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setTouchEnd(e.clientX)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      const maxIndex = productos.length - itemsPerView
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }
    
    if (isRightSwipe) {
      const maxIndex = productos.length - itemsPerView
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }
    
    setTimeout(() => {
      setIsAutoPlaying(autoPlay)
    }, 3000)
  }

  if (productos.length === 0) return null

  return (
    <div className="w-full">
      {/* HEADER SIN FLECHAS - Solo título */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-black">{titulo}</h3>
      </div>

      <div className="relative overflow-hidden">
        {/* SIN CONTROLES MÓVILES */}
        
        <div
          className={`flex transition-transform duration-300 ease-in-out select-none${productos.length < itemsPerView ? ' justify-center' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${100}%`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {productos.map((producto) => {
            // Normalizar el producto para compatibilidad
            let rating = (producto as any).rating;
            if (typeof rating !== "number") {
              rating = Number(rating);
              if (isNaN(rating)) rating = 4.5;
            }
            const productoNormalizado = {
              ...producto,
              rating,
              precio_anterior: producto.precio_anterior || undefined,
            }

            // Adaptar ProductoCompleto a Producto para ProductCard
            // Adaptar ProductoCompleto a ProductoSliderCard para mostrar todos los detalles visuales
            const cardData = {
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio_actual: producto.precio_actual,
              precio_anterior: typeof producto.precio_anterior === "number" ? producto.precio_anterior : undefined,
              imagen: producto.imagen_principal || (producto.imagenes?.[0]?.url_imagen) || "/assets/placeholder.png",
              en_oferta: producto.en_oferta,
              destacado: producto.destacado,
              estado: producto.estado,
              rating: producto.rating || 5,
              tags: producto.categorias?.map(cat => cat.nombre) || [],
              ahorro: producto.precio_anterior && producto.precio_actual ? producto.precio_anterior - producto.precio_actual : 0,
              porcentajeDescuento: producto.precio_anterior && producto.precio_actual ? Math.round(((producto.precio_anterior - producto.precio_actual) / producto.precio_anterior) * 100) : 0,
              badges: producto.stock <= 5 && producto.stock > 0 ? ["¡Últimas unidades!"] : [],
              // tiempoEntrega: producto.tiempo_entrega || undefined,
            };
            return (
              <div
                key={producto.id}
                className="flex-shrink-0 px-2 pointer-events-auto"
                style={{ width: `${100 / itemsPerView}%`, minHeight: '520px', maxHeight: '520px', height: '520px' }}
              >
                <ProductSliderCard producto={cardData} />
              </div>
            )
          })}
        </div>
      </div>

      {/* SIN INDICADORES DE PUNTOS */}
    </div>
  )
}