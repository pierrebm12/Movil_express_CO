import { executeQuery } from './database';

export interface ProductoTag {
  id?: number;
  producto_id: number;
  nombre: string;
}

export async function crearTag(tag: ProductoTag) {
  const query = `INSERT INTO producto_tags (producto_id, nombre) VALUES (?, ?)`;
  const params = [tag.producto_id, tag.nombre];
  return await executeQuery(query, params);
}

export async function listarTags(producto_id?: number) {
  let query = `SELECT * FROM producto_tags`;
  let params: any[] = [];
  if (producto_id) {
    query += ' WHERE producto_id = ?';
    params.push(producto_id);
  }
  return await executeQuery(query, params);
}

export async function actualizarTag(id: number, tag: Partial<ProductoTag>) {
  const fields = [];
  const params: any[] = [];
  if (tag.nombre !== undefined) { fields.push('nombre = ?'); params.push(tag.nombre); }
  if (fields.length === 0) return null;
  params.push(id);
  const query = `UPDATE producto_tags SET ${fields.join(', ')} WHERE id = ?`;
  return await executeQuery(query, params);
}

export async function eliminarTag(id: number) {
  const query = `DELETE FROM producto_tags WHERE id = ?`;
  return await executeQuery(query, [id]);
}
