import { executeQuery } from './database';

export interface ProductoReview {
  id?: number;
  producto_id: number;
  usuario_id?: number;
  rating: number;
  comentario?: string;
  fecha?: string;
}

export async function crearReview(review: ProductoReview) {
  const query = `INSERT INTO producto_reviews (producto_id, usuario_id, rating, comentario, fecha)
    VALUES (?, ?, ?, ?, NOW())`;
  const params = [
    review.producto_id,
    review.usuario_id || null,
    review.rating,
    review.comentario || null
  ];
  return await executeQuery(query, params);
}

export async function listarReviews(producto_id?: number) {
  let query = `SELECT * FROM producto_reviews`;
  let params: any[] = [];
  if (producto_id) {
    query += ' WHERE producto_id = ?';
    params.push(producto_id);
  }
  return await executeQuery(query, params);
}

export async function actualizarReview(id: number, review: Partial<ProductoReview>) {
  const fields = [];
  const params: any[] = [];
  if (review.rating !== undefined) { fields.push('rating = ?'); params.push(review.rating); }
  if (review.comentario !== undefined) { fields.push('comentario = ?'); params.push(review.comentario); }
  if (fields.length === 0) return null;
  params.push(id);
  const query = `UPDATE producto_reviews SET ${fields.join(', ')} WHERE id = ?`;
  return await executeQuery(query, params);
}

export async function eliminarReview(id: number) {
  const query = `DELETE FROM producto_reviews WHERE id = ?`;
  return await executeQuery(query, [id]);
}
