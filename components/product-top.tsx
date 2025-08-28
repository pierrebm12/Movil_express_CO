import React, { useEffect, useState } from "react";
// Update the import path below if your types file is located elsewhere, e.g. "../lib/types" or "./types"
import { ProductoCompleto, ApiResponse } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "@/components/product-slider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


interface ProductTopProps {
  productos: ProductoCompleto[];
}

function ProductTop({ productos }: ProductTopProps) {
  // Filtrar productos que NO tengan la categoría ECO
  const productosFiltrados = productos.filter(
    (p) => !(p.categorias && p.categorias.some((cat: any) => cat.nombre && cat.nombre.toLowerCase() === "eco"))
  );

  return (
    <section id="destacados" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
            ¡Los más vendidos, al mejor precio!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Potencia al alcance de tu bolsillo. Hazlo tuyo HOY – Unidades limitadas
          </p>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No hay productos destacados disponibles.</div>
        ) : (
          <ProductSlider
            productos={productosFiltrados}
            titulo=""
            autoPlay={true}
            autoPlayInterval={8000}
            verDetallesLink={(producto) => `/producto/${producto.id}`}
          />
        )}

        <div className="text-center mt-8 md:mt-12">
          {productosFiltrados.length > 0 ? (
            <Link href={`/catalogo`}>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-primary-800 hover:text-black px-8 md:px-12 py-3 md:py-4 rounded-2xl text-base md:text-lg font-bold"
              >
                Ver todo el catálogo
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 md:px-12 py-3 md:py-4 rounded-2xl text-base md:text-lg font-bold"
              disabled
            >
              Ver todo el catálogo
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductTop;

