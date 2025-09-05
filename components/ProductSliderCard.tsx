import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

export interface ProductoSlider {
  id: string | number;
  nombre: string;
  descripcion?: string;
  precio_actual: number;
  precio_anterior?: number;
  imagen?: string;
  en_oferta?: boolean;
  destacado?: boolean;
  estado?: string;
  rating?: number;
  tags?: string[];
  ahorro?: number;
  porcentajeDescuento?: number;
  badges?: string[];
  tiempoEntrega?: string;
}

export function ProductSliderCard({ producto }: { producto: ProductoSlider }) {
  const tieneOferta = producto.en_oferta && producto.precio_anterior && producto.precio_anterior > producto.precio_actual;
  const porcentajeDescuento = tieneOferta
    ? Math.round(((producto.precio_anterior! - producto.precio_actual) / producto.precio_anterior!) * 100)
    : producto.porcentajeDescuento || 0;
  const ahorro = tieneOferta ? producto.precio_anterior! - producto.precio_actual : producto.ahorro || 0;

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden relative bg-white flex flex-col h-[480px] min-h-[480px] max-h-[480px]">
      <div className="relative w-full flex justify-center items-center h-56 min-h-56 max-h-56 bg-gray-100">
        <Image
          src={producto.imagen || "/assets/placeholder.png"}
          alt={producto.nombre}
          fill
          className="object-cover w-full h-full transition-all duration-300"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        {tieneOferta && porcentajeDescuento > 0 && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
            -{porcentajeDescuento}%
          </span>
        )}
        {producto.destacado && (
          <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
            <Star className="w-3 h-3 inline-block" /> Destacado
          </span>
        )}
        {/* Badge personalizado si existe */}
        {producto.badges && producto.badges.map((badge, idx) => (
          <span key={idx} className="absolute top-2 left-16 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow animate-bounce">
            {badge}
          </span>
        ))}
      </div>
  <CardContent className="p-4 flex flex-col items-start flex-1 overflow-hidden">
        <div className="flex items-center gap-1 mb-1">
          {/* Estrellas de calificación */}
          {Array.from({ length: Math.round(typeof producto.rating === "number" ? producto.rating : 5) }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 inline-block" />
          ))}
          <span className="text-xs text-gray-600 ml-1">({typeof producto.rating === "number" ? producto.rating.toFixed(1) : "5.0"})</span>
        </div>
        <h3 className="font-bold text-lg text-black mb-1 truncate w-full" title={producto.nombre}>{producto.nombre}</h3>
        <p className="text-sm text-gray-700 mb-2 line-clamp-2 w-full">{producto.descripcion || ""}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {producto.tags && producto.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {producto.estado && (
            <span className="text-xs text-gray-700 bg-gray-200 rounded px-2 py-0.5 font-semibold">{producto.estado}</span>
          )}
          {producto.tiempoEntrega && (
            <span className="text-xs text-gray-700 bg-gray-200 rounded px-2 py-0.5 font-semibold">{producto.tiempoEntrega}</span>
          )}
        </div>
        <div className="flex flex-col items-start mb-2 w-full">
          {tieneOferta && producto.precio_anterior && (
            <span className="text-gray-500 text-sm line-through">
              {producto.precio_anterior.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
            </span>
          )}
          <span className="text-primary-600 font-bold text-xl">
            {Number(producto.precio_actual).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}
          </span>
          {tieneOferta && ahorro > 0 && (
            <span className="text-green-600 text-xs font-semibold mt-1">
              ¡Ahorra {ahorro.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}!
            </span>
          )}
        </div>
        <div className="mt-auto w-full">
          <Link href={`/producto/${producto.id}`} className="w-full block">
            <Button className="w-full flex items-center justify-center gap-2">
              Ver detalles <ShoppingCart className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
