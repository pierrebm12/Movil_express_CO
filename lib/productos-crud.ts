import { executeQuery, executeTransaction } from './database';

// Crear producto
export async function crearProducto(producto: any) {
  // ...
  const query = `INSERT INTO productos (codigo_producto, nombre, descripcion, precio_anterior, precio_actual, categoria_principal, marca_id, estado, capacidad, stock, stock_minimo, en_oferta, destacado, activo, garantia_meses, imagen_principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    producto.codigo_producto ?? null,
    producto.nombre ?? null,
    producto.descripcion ?? null,
    producto.precio_anterior ?? null,
    producto.precio_actual ?? null,
    producto.categoria_principal ?? null,
    producto.marca_id ?? null,
    producto.estado ?? null,
    producto.capacidad ?? null,
    producto.stock ?? null,
    producto.stock_minimo ?? null,
    producto.en_oferta ?? null,
    producto.destacado ?? null,
    producto.activo ?? null,
    (producto.garantia_meses !== undefined && producto.garantia_meses !== '' ? Number(producto.garantia_meses) : null),
    producto.imagen_principal ?? null
  ];
  const result = await executeQuery(query, params);
  // Insertar relación en producto_categorias si hay categoria_principal
  if (producto.categoria_principal) {
    await executeQuery(
      `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (LAST_INSERT_ID(), ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
      [producto.categoria_principal]
    );
  }

  // Obtener insertId del resultado
  const insertId = (result && typeof result === 'object' && 'insertId' in result) ? result.insertId : undefined;

  // Insertar colores si existen
  if (insertId && Array.isArray(producto.colores) && producto.colores.length > 0) {
    const values = producto.colores.map((col: any) => [insertId, col.nombre_color, col.stock_color || 0]);
    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_colores (producto_id, nombre_color, stock_color) VALUES ${placeholders}`,
      flatValues
    );
  }

  // Insertar características si existen
  if (insertId && Array.isArray(producto.caracteristicas) && producto.caracteristicas.length > 0) {
    const values = producto.caracteristicas.map((car: any) => [insertId, car.nombre, car.valor, car.orden || 0]);
    const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES ${placeholders}`,
      flatValues
    );
  }

  // Insertar tags si existen
  if (insertId && Array.isArray(producto.tags) && producto.tags.length > 0) {
    const values = producto.tags.map((tag: any) => [insertId, tag]);
    const placeholders = values.map(() => '(?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_tags (producto_id, tag) VALUES ${placeholders}`,
      flatValues
    );
  }
  return result;
}

// Obtener producto por ID
export async function obtenerProductoPorId(id: number) {
  const query = `SELECT * FROM productos WHERE id = ?`;
  const rows = await executeQuery(query, [id]);
  return rows[0] || null;
}

// Actualizar producto
export async function actualizarProducto(id: number, producto: any) {
  // Eliminar y volver a insertar colores
  await executeQuery('DELETE FROM producto_colores WHERE producto_id = ?', [id]);
  if (Array.isArray(producto.colores) && producto.colores.length > 0) {
    const values = producto.colores.map((col: any) => [id, col.nombre_color, col.stock_color || 0]);
    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_colores (producto_id, nombre_color, stock_color) VALUES ${placeholders}`,
      flatValues
    );
  }
  const query = `UPDATE productos SET nombre=?, descripcion=?, precio_anterior=?, precio_actual=?, categoria_principal=?, marca_id=?, estado=?, capacidad=?, stock=?, stock_minimo=?, en_oferta=?, destacado=?, activo=?, rating=?, total_reviews=?, peso=?, dimensiones=?, garantia_meses=?, imagen_principal=? WHERE id=?`;
  const params = [
    producto.nombre,
    producto.descripcion,
    producto.precio_anterior,
    producto.precio_actual,
    producto.categoria_principal,
    producto.marca_id,
    producto.estado,
    producto.capacidad,
    producto.stock,
    producto.stock_minimo,
    producto.en_oferta,
    producto.destacado,
    producto.activo,
    producto.rating,
    producto.total_reviews,
    producto.peso,
    producto.dimensiones,
    (producto.garantia_meses !== undefined && producto.garantia_meses !== '' ? Number(producto.garantia_meses) : null),
    producto.imagen_principal,
    id
  ];
  const result = await executeQuery(query, params);
  // Actualizar relación en producto_categorias si hay categoria_principal
  if (producto.categoria_principal) {
    await executeQuery(
      `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
      [id, producto.categoria_principal]
    );
  }

  // Eliminar y volver a insertar características
  await executeQuery('DELETE FROM producto_caracteristicas WHERE producto_id = ?', [id]);
  if (Array.isArray(producto.caracteristicas) && producto.caracteristicas.length > 0) {
    const values = producto.caracteristicas.map((car: any) => [id, car.nombre, car.valor, car.orden || 0]);
    const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES ${placeholders}`,
      flatValues
    );
  }

  // Eliminar y volver a insertar tags
  await executeQuery('DELETE FROM producto_tags WHERE producto_id = ?', [id]);
  if (Array.isArray(producto.tags) && producto.tags.length > 0) {
    const values = producto.tags.map((tag: any) => [id, tag]);
    const placeholders = values.map(() => '(?, ?)').join(', ');
    const flatValues = values.flat();
    await executeQuery(
      `INSERT INTO producto_tags (producto_id, tag) VALUES ${placeholders}`,
      flatValues
    );
  }
  return result;
}

// Eliminar producto
export async function eliminarProducto(id: number) {
  const query = `DELETE FROM productos WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result;
}

// Listar productos con filtros básicos
export async function listarProductos({ search = '', page = 1, limit = 20 } = {}) {
  const limitNum = parseInt(limit as any, 10) || 20;
  const pageNum = parseInt(page as any, 10) || 1;
  const offsetNum = (pageNum - 1) * limitNum;
  // Traer el nombre de la marca y las categorías asociadas
  const query = `
    SELECT p.*, m.nombre AS marca_nombre,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', c.id, 'nombre', c.nombre, 'imagen', c.imagen)) AS categorias_json
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.id
    LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
    LEFT JOIN categorias c ON pc.categoria_id = c.id
    WHERE p.nombre LIKE ?
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT ${limitNum} OFFSET ${offsetNum}
  `;
  const rows = await executeQuery(query, [`%${search}%`]);
  // Parsear las categorías JSON de forma robusta
  return rows.map((row: any) => {
    let categorias: any[] = [];
    if (row.categorias_json) {
      try {
        // Split por '},{' y parsear cada objeto
        categorias = row.categorias_json
          .split(/(?<=\})\s*,\s*(?=\{)/) // separa por coma entre objetos JSON
          .map((cat: string) => {
            try {
              return JSON.parse(cat);
            } catch {
              return null;
            }
          })
          .filter((cat: any) => cat && cat.id != null);
      } catch {}
    }
    return {
      ...row,
      categorias
    };
  });
}
