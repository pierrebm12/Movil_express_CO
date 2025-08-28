import { executeQuery } from './database';

export interface ProductoCaracteristica {
  id?: number;
  producto_id: number;
  nombre: string;
  valor: string;
  orden?: number;
}

export async function crearCaracteristica(caracteristica: ProductoCaracteristica) {
  const query = `INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden)
    VALUES (?, ?, ?, ?)`;
  const params = [
    caracteristica.producto_id,
    caracteristica.nombre,
    caracteristica.valor,
    caracteristica.orden || 0
  ];
  return await executeQuery(query, params);
}

export async function listarCaracteristicas(producto_id?: number) {
  let query = `SELECT * FROM producto_caracteristicas`;
  let params: any[] = [];
  if (producto_id) {
    query += ' WHERE producto_id = ?';
    params.push(producto_id);
  }
  return await executeQuery(query, params);
}

export async function actualizarCaracteristica(id: number, caracteristica: Partial<ProductoCaracteristica>) {
  const fields = [];
  const params: any[] = [];
  if (caracteristica.nombre !== undefined) { fields.push('nombre = ?'); params.push(caracteristica.nombre); }
  if (caracteristica.valor !== undefined) { fields.push('valor = ?'); params.push(caracteristica.valor); }
  if (caracteristica.orden !== undefined) { fields.push('orden = ?'); params.push(caracteristica.orden); }
  if (fields.length === 0) return null;
  params.push(id);
  const query = `UPDATE producto_caracteristicas SET ${fields.join(', ')} WHERE id = ?`;
  return await executeQuery(query, params);
}

export async function eliminarCaracteristica(id: number) {
  const query = `DELETE FROM producto_caracteristicas WHERE id = ?`;
  return await executeQuery(query, [id]);
}
