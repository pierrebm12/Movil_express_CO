import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductoCompleto } from "@/types/database";

interface ProductCardFullProps {
  producto: ProductoCompleto;
}

export const ProductCardFull: React.FC<ProductCardFullProps> = ({ producto }) => {
  const ahorro = producto.precio_anterior && producto.precio_actual
    ? producto.precio_anterior - producto.precio_actual
    : 0;
  const porcentaje = producto.precio_anterior && producto.precio_actual
    ? Math.round(((producto.precio_anterior - producto.precio_actual) / producto.precio_anterior) * 100)
    : 0;

  return (
    <Link href={`/producto/${producto.id}`} className="block h-full w-full">
      <Card
        className="group hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden border-0 shadow-2xl cursor-pointer h-full w-full flex flex-col justify-between bg-white hover:bg-primary-50 scale-100 hover:scale-105"
        style={{ height: '100%', minHeight: '520px', maxHeight: '520px' }}
      >
        <div className="relative w-full h-80 flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-white">
          <Image
            src={producto.imagen_principal || "/placeholder.svg?height=400&width=400"}
            alt={producto.nombre}
            width={400}
            height={400}
            className="object-contain h-72 w-full transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
          />
          {producto.en_oferta && producto.precio_anterior && (
            <Badge className="absolute top-2 left-2 bg-[#988443] text-black font-bold text-xs px-2 py-1 animate-bounce">
              -{porcentaje}%
            </Badge>
          )}
          {producto.stock <= 5 && producto.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold animate-pulse text-xs px-2 py-1">
              ¡Últimas {producto.stock}!
            </Badge>
          )}
        </div>
        <CardContent className="w-full px-6 py-4 flex flex-col items-center justify-center flex-1">
          <h4 className="text-lg font-bold text-black mb-2 text-center truncate w-full group-hover:text-primary-600 transition-colors duration-200" title={producto.nombre}>{producto.nombre}</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary-600 font-bold text-xl">{producto.precio_actual?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span>
            {producto.precio_anterior && (
              <span className="line-through text-gray-400 text-base">{producto.precio_anterior?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span>
            )}
          </div>
          {ahorro > 0 && (
            <div className="text-green-600 font-semibold text-sm mb-2 animate-fadeIn">Ahorras {ahorro.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</div>
          )}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {producto.categorias && producto.categorias.map((cat) => (
              <span key={cat.id} className="bg-primary-700/30 text-primary-600 px-2 py-1 rounded-full text-xs font-medium shadow-md">#{cat.nombre}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {producto.colores && producto.colores.length > 0 && (
              <span className="text-xs text-gray-500 font-medium">Colores:</span>
            )}
            {producto.colores && producto.colores.map((color, idx) => (
              <span key={idx} className="w-5 h-5 rounded-full border-2 border-gray-300 inline-block" style={{ backgroundColor: color.codigo_hex || '#eee' }} title={color.nombre_color}></span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {producto.caracteristicas && producto.caracteristicas.map((car, idx) => (
              <span key={idx} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium shadow">{car.nombre}: {car.valor}</span>
            ))}
          </div>
          {/* Tags si existen */}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {Array.isArray((producto as any).tags) && (producto as any).tags.map((tag: string, idx: number) => (
              <span key={idx} className="bg-primary-200 text-primary-700 px-2 py-1 rounded-full text-xs font-medium shadow">#{tag}</span>
            ))}
          </div>
        </CardContent>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/10 via-primary-500/10 to-primary-900/10 opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </Card>
    </Link>
  );
};
