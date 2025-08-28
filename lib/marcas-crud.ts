import { executeQuery } from './database';

// Crear marca
export async function crearMarca(nombre: string, descripcion: string = '', logo: string = '') {
  const query = `INSERT INTO marcas (nombre, descripcion, logo) VALUES (?, ?, ?)`;
  const params = [nombre, descripcion, logo];
  const result = await executeQuery(query, params);
  return result;
}

// Listar marcas
export async function listarMarcas() {
  const query = `SELECT * FROM marcas ORDER BY nombre ASC`;
  const rows = await executeQuery(query);
  return rows;
}

// Actualizar marca
export async function actualizarMarca(id: number, nombre: string, descripcion: string = '', logo: string = '') {
  const query = `UPDATE marcas SET nombre = ?, descripcion = ?, logo = ? WHERE id = ?`;
  const params = [nombre, descripcion, logo, id];
  const result = await executeQuery(query, params);
  return result;
}

// Eliminar marca
export async function eliminarMarca(id: number) {
  const query = `DELETE FROM marcas WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result;
}
