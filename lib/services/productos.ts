
import { executeQuery } from '../database';

/**
 * Obtiene productos relacionados por categorías compartidas, excluyendo el producto actual.
 * Busca hasta 10 productos activos en las mismas categorías.
 */
export async function getRelatedProductsFromDB(productId: number) {
  // 1. Obtener las categorías del producto
  const categorias = await executeQuery<any>(
    'SELECT categoria_id FROM producto_categorias WHERE producto_id = ?',
    [productId]
  );
  if (!categorias || categorias.length === 0) return [];

  // 2. Construir lista de IDs de categoría
  const categoriaIds = categorias.map((c: any) => c.categoria_id);

  // 3. Buscar productos activos en esas categorías, excluyendo el actual
  //    Se usa DISTINCT para evitar duplicados si un producto pertenece a varias categorías
  const placeholders = categoriaIds.map(() => '?').join(',');
  const query = `
    SELECT DISTINCT p.id, p.nombre, p.precio_actual, p.imagen_principal
    FROM productos p
    JOIN producto_categorias pc ON p.id = pc.producto_id
    WHERE pc.categoria_id IN (${placeholders})
      AND p.id != ?
      AND p.activo = 1
    ORDER BY RAND()
    LIMIT 10
  `;
  const params = [...categoriaIds, productId];
  const relacionados = await executeQuery<any>(query, params);
  return relacionados;
}
