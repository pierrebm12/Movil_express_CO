import { executeQuery } from './database';

// Crear imagen de producto
export async function crearImagenProducto(productoId: number, url: string, altText: string = '', esPrincipal: boolean = false, orden: number = 0) {
  const query = `INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, es_principal, orden) VALUES (?, ?, ?, ?, ?)`;
  const params = [productoId, url, altText, esPrincipal, orden];
  const result = await executeQuery(query, params);
  return result;
}

// Listar imágenes de un producto
export async function listarImagenesProducto(productoId: number) {
  const query = `SELECT * FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC, id ASC`;
  const rows = await executeQuery(query, [productoId]);
  return rows;
}

// Eliminar imagen de producto
export async function eliminarImagenProducto(imagenId: number) {
  const query = `DELETE FROM producto_imagenes WHERE id = ?`;
  const result = await executeQuery(query, [imagenId]);
  return result;
}

// Reordenar imágenes de producto
export async function reordenarImagenesProducto(ordenes: Array<{id: number, orden: number}>) {
  const queries = ordenes.map(({id, orden}) => ({
    query: 'UPDATE producto_imagenes SET orden = ? WHERE id = ?',
    params: [orden, id]
  }));
  // Ejecutar en transacción si es posible
  // @ts-ignore
  return await executeTransaction(queries);
}
