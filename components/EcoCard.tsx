import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface EcoCardProps {
  id: string | number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  destacado?: boolean;
  tags?: string[];
  color?: string;
  stock?: number;
}

export function EcoCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  destacado,
  tags = [],
  color,
  stock,
}: EcoCardProps) {
  return (
    <div
      className="flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-100 h-full min-h-[340px] max-w-xs mx-auto w-full transition-transform hover:scale-[1.02]"
    >
      <div className="relative w-full flex justify-center items-center bg-gray-100"
        style={{ minHeight: 180, height: 180, maxHeight: 200 }}
      >
        <Image
          src={imagen || "/assets/placeholder.png"}
          alt={nombre}
          fill
          className="object-cover w-full h-full transition-all duration-300"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        {destacado && (
          <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
            <Star className="w-3 h-3 inline-block" /> Destacado
          </span>
        )}
        {stock !== undefined && stock <= 5 && stock > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow animate-bounce">
            ¡Últimas unidades!
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
          {color && (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200">
              <span className="inline-block w-3 h-3 rounded-full border border-gray-400" style={{ background: color }} />
              {color}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base sm:text-lg text-black mb-1 truncate w-full" title={nombre}>{nombre}</h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2 w-full">{descripcion}</p>
        <div className="mt-auto flex flex-col gap-1">
          <span className="text-primary-600 font-bold text-lg sm:text-xl">
            {`$ ${Number(precio).toLocaleString('es-CO', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`}
          </span>
          <Link href={`/producto/${id}`} className="w-full block mt-1">
            <Button className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
