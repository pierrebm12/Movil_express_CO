import { executeQuery } from "@/lib/database";

export async function getConfirmedProducts() {
  return await executeQuery(`SELECT * FROM productos_confirmados ORDER BY fecha_confirmacion DESC`);
}

export async function deleteConfirmedProduct(id: number) {
  await executeQuery(`DELETE FROM productos_confirmados WHERE id = ?`, [id]);
}
