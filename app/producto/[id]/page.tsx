"use client";
import React from "react";
import ProductPage from "@/components/product-page";
import { useParams } from "next/navigation";

export default function ProductoPage() {
  const params = useParams();
  // El parámetro puede ser 'id' o '[id]', depende de la estructura de la ruta
  const id = params?.id;
  return <ProductPage productId={id} />;
}
