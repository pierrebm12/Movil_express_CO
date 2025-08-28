import { executeQuery } from './database';

export interface ProductoColor {
  id?: number;
  producto_id: number;
  nombre: string;
  codigo_hex?: string;
  stock: number;
  precio_adicional?: number;
  activo?: boolean;
}

export async function crearColor(color: ProductoColor) {
  const query = `INSERT INTO producto_colores (producto_id, nombre, codigo_hex, stock, precio_adicional, activo)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    color.producto_id,
    color.nombre,
    color.codigo_hex || null,
    color.stock,
    color.precio_adicional || 0,
    color.activo ?? true
  ];
  return await executeQuery(query, params);
}

export async function listarColores(producto_id?: number) {
  let query = `SELECT * FROM producto_colores`;
  let params: any[] = [];
  if (producto_id) {
    query += ' WHERE producto_id = ?';
    params.push(producto_id);
  }
  return await executeQuery(query, params);
}

export async function actualizarColor(id: number, color: Partial<ProductoColor>) {
  const fields = [];
  const params: any[] = [];
  if (color.nombre !== undefined) { fields.push('nombre = ?'); params.push(color.nombre); }
  if (color.codigo_hex !== undefined) { fields.push('codigo_hex = ?'); params.push(color.codigo_hex); }
  if (color.stock !== undefined) { fields.push('stock = ?'); params.push(color.stock); }
  if (color.precio_adicional !== undefined) { fields.push('precio_adicional = ?'); params.push(color.precio_adicional); }
  if (color.activo !== undefined) { fields.push('activo = ?'); params.push(color.activo); }
  if (fields.length === 0) return null;
  params.push(id);
  const query = `UPDATE producto_colores SET ${fields.join(', ')} WHERE id = ?`;
  return await executeQuery(query, params);
}

export async function eliminarColor(id: number) {
  const query = `DELETE FROM producto_colores WHERE id = ?`;
  return await executeQuery(query, [id]);
}
