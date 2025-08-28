export  async function fetchProductoById(id: number) {
  const res = await fetch(`/api/productos/${id}`)
  if (!res.ok) throw new Error("No se pudo obtener el producto")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "Error desconocido")
  return data.data
}

export async function fetchRelatedProducts(productId: number) {
  const res = await fetch(`/api/productos/${productId}/relacionados`);
  if (!res.ok) throw new Error("No se pudieron obtener los productos relacionados");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Error desconocido");
  return data.data;
}
