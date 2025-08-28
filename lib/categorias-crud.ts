import { executeQuery } from './database';

// Crear categoría
export async function crearCategoria(nombre: string, descripcion: string = '', imagen: string = '', orden: number = 0) {
  const query = `INSERT INTO categorias (nombre, descripcion, imagen, orden) VALUES (?, ?, ?, ?)`;
  const params = [nombre, descripcion, imagen, orden];
  const result = await executeQuery(query, params);
  return result;
}

// Listar categorías
export async function listarCategorias() {
  const query = `SELECT * FROM categorias ORDER BY orden ASC, nombre ASC`;
  const rows = await executeQuery(query);
  return rows;
}

// Actualizar categoría
export async function actualizarCategoria(id: number, nombre: string, descripcion: string = '', imagen: string = '', orden: number = 0) {
  const query = `UPDATE categorias SET nombre = ?, descripcion = ?, imagen = ?, orden = ? WHERE id = ?`;
  const params = [nombre, descripcion, imagen, orden, id];
  const result = await executeQuery(query, params);
  return result;
}

// Eliminar categoría
export async function eliminarCategoria(id: number) {
  const query = `DELETE FROM categorias WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result;
}
