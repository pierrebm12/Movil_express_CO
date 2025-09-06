import { executeQuery } from "@/lib/database";

export async function getConfirmedProducts() {
  const rows = await executeQuery(`SELECT * FROM productos_confirmados ORDER BY fecha_confirmacion DESC`);
  return rows.map((row: any) => ({
    ...row
  }));
}

export async function deleteConfirmedProduct(id: number) {
  await executeQuery(`DELETE FROM productos_confirmados WHERE id = ?`, [id]);
}
