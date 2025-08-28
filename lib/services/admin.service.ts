
import { executeQuery, executeQuerySingle, executeCount, executeTransaction } from "@/lib/database";

export interface AdminStats {
  ventasHoy: number;
  pedidosHoy: number;
  clientesNuevos: number;
  productosVendidos: number;
  ventasAyer: number;
  pedidosAyer: number;
  clientesAyer: number;
  productosVendidosAyer: number;
}

export interface PedidoReciente {
  id: number
  numero_pedido: string
  usuario_nombre: string
  total: number
  estado: string
  fecha_pedido: string
  cantidad_productos: number
}

export interface ProductoMasVendido {
  id: number
  nombre: string
  total_vendido: number
  ventas: number
  imagen_principal?: string
}

export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono?: string
  total_pedidos: number
  total_gastado: number
  ultimo_pedido?: string
  fecha_registro: string
  activo: boolean
}

export interface ProductoAdmin {
  id: number
  nombre: string
  descripcion: string
  precio_anterior?: number
  precio_actual: number
  categoria_id?: number
  categoria_principal?: number
  categoria_name?: string
  codigo_producto?: string
  marca_id?: number
  marca_nombre?: string
  estado: string
  capacidad?: string
  stock: number
  stock_minimo: number
  en_oferta: boolean
  destacado: boolean
  activo: boolean
  rating: number
  total_reviews: number
  garantia_meses?: number
  imagen_principal?: string
  fecha_creacion: string
  imagenes?: ProductoImagen[]
  caracteristicas?: ProductoCaracteristica[]
  colores?: ProductoColor[]
}

export interface ProductoImagen {
  id: number
  url: string
  alt_text?: string
  es_principal: boolean
  orden: number
}

export interface ProductoCaracteristica {
  id: number
  nombre: string
  valor: string
  orden: number
}

export interface ProductoColor {
  id: number
  nombre: string
  codigo_hex?: string
  stock: number
  precio_adicional: number
  activo: boolean
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  imagen?: string
  activo: boolean
  orden: number
  total_productos?: number
}

export interface Marca {
  id: number
  nombre: string
  descripcion?: string
  logo?: string
  activo: boolean
  total_productos?: number
}

class AdminService {
  /**
   * Ejemplo de uso profesional para crear un producto y guardar imágenes:
   *
   * // 1. Crear el producto (la imagen principal va en producto.imagen_principal)
   * const productoId = await adminService.crearProducto({
   *   nombre: 'Nombre',
   *   descripcion: 'Desc',
   *   ...otrosCampos,
   *   imagen_principal: 'url_principal.jpg',
   * });
   *
   * // 2. Guardar galería (puede incluir la principal o solo las secundarias)
   * await adminService.guardarImagenesProducto(productoId, [
   *   { url: 'url_principal.jpg', alt_text: 'Principal', es_principal: true, orden: 0 },
   *   { url: 'url2.jpg', alt_text: 'Secundaria', es_principal: false, orden: 1 },
   *   ...
   * ]);
   *
   * // 3. (Opcional) Guardar características, colores, etc. usando métodos similares
   */
  /**
   * Guarda imágenes adicionales (galería) para un producto en la tabla producto_imagenes.
   * La imagen principal debe ir en la columna imagen_principal de productos.
   * @param productoId ID del producto
   * @param imagenes Array de objetos { url, alt_text, es_principal, orden }
   */
  async guardarImagenesProducto(
    productoId: number,
    imagenes: Array<Pick<ProductoImagen, 'url' | 'alt_text' | 'es_principal' | 'orden'>>
  ): Promise<void> {
    if (!imagenes || imagenes.length === 0) return;
    const values = imagenes.map(img => [
      productoId,
      img.url,
      img.alt_text || null,
      img.es_principal ? 1 : 0,
      img.orden || 0
    ]);
    const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();
    const query = `
      INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, es_principal, orden)
      VALUES ${placeholders}
    `;
    await executeQuery(query, flatValues);
  }

  /**
   * Flujo recomendado para imágenes:
   * 1. Al crear producto, guardar la imagen principal en imagen_principal (productos).
   * 2. Guardar la galería (incluyendo la principal si se desea) en producto_imagenes usando guardarImagenesProducto.
   */
  // ==================== DASHBOARD ====================
  
  async getStats(): Promise<AdminStats> {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Ventas de hoy
      const ventasHoy = await executeQuerySingle<{ total: number }>(
        `SELECT COALESCE(SUM(total), 0) as total 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = ? AND estado != 'cancelado'`,
        [hoy]
      )

      // Ventas de ayer
      const ventasAyer = await executeQuerySingle<{ total: number }>(
        `SELECT COALESCE(SUM(total), 0) as total 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = ? AND estado != 'cancelado'`,
        [ayer]
      )

      // Pedidos de hoy
      const pedidosHoy = await executeCount(
        `SELECT COUNT(*) as count 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = ?`,
        [hoy]
      )

      // Pedidos de ayer
      const pedidosAyer = await executeCount(
        `SELECT COUNT(*) as count 
         FROM pedidos 
         WHERE DATE(fecha_pedido) = ?`,
        [ayer]
      )

      // Clientes nuevos hoy
      const clientesHoy = await executeCount(
        `SELECT COUNT(*) as count 
         FROM usuarios 
         WHERE DATE(fecha_registro) = ? AND rol = 'cliente'`,
        [hoy]
      )

      // Clientes nuevos ayer
      const clientesAyer = await executeCount(
        `SELECT COUNT(*) as count 
         FROM usuarios 
         WHERE DATE(fecha_registro) = ? AND rol = 'cliente'`,
        [ayer]
      )

      // Productos vendidos hoy
      const productosHoy = await executeQuerySingle<{ total: number }>(
        `SELECT COALESCE(SUM(pd.cantidad), 0) as total 
         FROM pedido_detalles pd 
         JOIN pedidos p ON pd.pedido_id = p.id 
         WHERE DATE(p.fecha_pedido) = ? AND p.estado != 'cancelado'`,
        [hoy]
      )

      // Productos vendidos ayer
      const productosAyer = await executeQuerySingle<{ total: number }>(
        `SELECT COALESCE(SUM(pd.cantidad), 0) as total 
         FROM pedido_detalles pd 
         JOIN pedidos p ON pd.pedido_id = p.id 
         WHERE DATE(p.fecha_pedido) = ? AND p.estado != 'cancelado'`,
        [ayer]
      )

      return {
        ventasHoy: ventasHoy?.total || 0,
        pedidosHoy,
        clientesNuevos: clientesHoy,
        productosVendidos: productosHoy?.total || 0,
        ventasAyer: ventasAyer?.total || 0,
        pedidosAyer,
        clientesAyer,
        productosVendidosAyer: productosAyer?.total || 0,
      }

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  async getPedidosRecientes(limit: number = 10): Promise<PedidoReciente[]> {
    try {
      const query = `
        SELECT 
          p.id,
          p.numero_pedido,
          COALESCE(u.nombre, 'Cliente Invitado') as usuario_nombre,
          p.total,
          p.estado,
          p.fecha_pedido,
          COUNT(pd.id) as cantidad_productos
        FROM pedidos p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
        GROUP BY p.id
        ORDER BY p.fecha_pedido DESC
        LIMIT ?
      `
      
      return await executeQuery<PedidoReciente>(query, [limit])
    } catch (error) {
      console.error('Error obteniendo pedidos recientes:', error)
      throw error
    }
  }

  async getProductosMasVendidos(limit: number = 10): Promise<ProductoMasVendido[]> {
    try {
      const query = `
        SELECT 
          p.id,
          p.nombre,
          COALESCE(SUM(pd.cantidad), 0) as total_vendido,
          COALESCE(SUM(pd.subtotal), 0) as ventas,
          pi.url_imagen as imagen_principal
        FROM productos p
        LEFT JOIN pedido_detalles pd ON p.id = pd.producto_id
        LEFT JOIN pedidos pe ON pd.pedido_id = pe.id AND pe.estado != 'cancelado'
        LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id AND pi.es_principal = 1
        WHERE p.activo = 1
        GROUP BY p.id
        ORDER BY total_vendido DESC, ventas DESC
        LIMIT ?
      `
      
      return await executeQuery<ProductoMasVendido>(query, [limit])
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error)
      throw error
    }
  }

  // ==================== PRODUCTOS ====================

  async getProductos(page: number = 1, limit: number = 20, filtros?: any): Promise<{productos: ProductoAdmin[], total: number}> {
    try {
      const offset = (page - 1) * limit
      let whereClause = 'WHERE 1=1'
      let params: any[] = []

      if (filtros?.busqueda) {
        whereClause += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)'
        params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`)
      }

      if (filtros?.categoria_id) {
        whereClause += ' AND p.categoria_id = ?'
        params.push(filtros.categoria_id)
      }

      if (filtros?.marca_id) {
        whereClause += ' AND p.marca_id = ?'
        params.push(filtros.marca_id)
      }

      if (filtros?.estado) {
        whereClause += ' AND p.estado = ?'
        params.push(filtros.estado)
      }

      if (filtros?.activo !== undefined) {
        whereClause += ' AND p.activo = ?'
        params.push(filtros.activo)
      }

      const query =
        (whereClause === 'WHERE 1=1')
          ? `SELECT p.*, m.nombre as marca_nombre, pi.url_imagen as imagen_principal FROM productos p LEFT JOIN marcas m ON p.marca_id = m.id LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id AND pi.es_principal = 1 ORDER BY p.fecha_creacion DESC LIMIT ${limit} OFFSET ${offset}`
          : `SELECT p.*, m.nombre as marca_nombre, pi.url_imagen as imagen_principal FROM productos p LEFT JOIN marcas m ON p.marca_id = m.id LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id AND pi.es_principal = 1 ${whereClause} ORDER BY p.fecha_creacion DESC LIMIT ? OFFSET ?`;

      const countQuery = `
        SELECT COUNT(*) as count
        FROM productos p
        ${whereClause}
      `

      const productos = await executeQuery<ProductoAdmin>(
        (whereClause === 'WHERE 1=1') ? query : query,
        (whereClause === 'WHERE 1=1') ? [] : [...params, limit, offset]
      );
      const totalResult = await executeQuerySingle<{count: number}>(countQuery, params)
      
      return {
        productos,
        total: totalResult?.count || 0
      }
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw error
    }
  }

  async getProducto(id: number): Promise<ProductoAdmin | null> {
    try {
      const query = `
        SELECT 
          p.*,
          c.nombre as categoria_nombre,
          m.nombre as marca_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_principal = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.id = ?
      `

      const producto = await executeQuerySingle<ProductoAdmin>(query, [id])
      
      if (!producto) return null

      // Obtener imágenes
      const imagenes = await executeQuery<ProductoImagen>(
        'SELECT * FROM producto_imagenes WHERE producto_id = ? ORDER BY orden, id',
        [id]
      )

      // Obtener características
      const caracteristicas = await executeQuery<ProductoCaracteristica>(
        'SELECT * FROM producto_caracteristicas WHERE producto_id = ? ORDER BY orden, id',
        [id]
      )

      // Obtener colores
      const colores = await executeQuery<ProductoColor>(
        'SELECT * FROM producto_colores WHERE producto_id = ? ORDER BY id',
        [id]
      )

      return {
        ...producto,
        imagenes,
        caracteristicas,
        colores
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      throw error
    }
  }

  async crearProducto(producto: Partial<ProductoAdmin>): Promise<number> {
    try {
      const query = `
        INSERT INTO productos (
          nombre, descripcion, precio_anterior, precio_actual, categoria_principal, marca_id,
          estado, capacidad, stock, stock_minimo, en_oferta, destacado, activo,
          garantia_meses, imagen_principal, codigo_producto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Generar un código de producto simple si no se recibe
      let codigo = producto.codigo_producto ?? ("PRD-" + Date.now());

      const params = [
        producto.nombre ?? null,
        producto.descripcion ?? null,
        producto.precio_anterior ?? null,
        producto.precio_actual ?? null,
        producto.categoria_principal ?? producto.categoria_id ?? null,
        producto.marca_id ?? null,
        producto.estado ?? 'Nuevo',
        producto.capacidad ?? null,
        producto.stock ?? 0,
        producto.stock_minimo ?? 5,
        producto.en_oferta ?? false,
        producto.destacado ?? false,
        producto.activo ?? true,
        (typeof producto.garantia_meses === 'string' ? Number(producto.garantia_meses) : producto.garantia_meses) ?? null,
        producto.imagen_principal ?? null,
        codigo
      ];

      const result = await executeQuery(query, params);
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un producto y todas sus relaciones (imágenes, características, colores) de forma transaccional.
   * @param id ID del producto a actualizar
   * @param producto Objeto producto con relaciones
   */
  async actualizarProductoCompleto(id: number, producto: Partial<ProductoAdmin>): Promise<boolean> {
    // 1. Actualizar producto principal
    let codigo = producto.codigo_producto ?? ("PRD-" + Date.now());
    const queries: { query: string; params: any[] }[] = [];
    queries.push({
      query: `
        UPDATE productos SET
          nombre = ?, descripcion = ?, precio_anterior = ?, precio_actual = ?,
          categoria_principal = ?, marca_id = ?, estado = ?, capacidad = ?,
          stock = ?, stock_minimo = ?, en_oferta = ?, destacado = ?, activo = ?,
          garantia_meses = ?, imagen_principal = ?, codigo_producto = ?,
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      params: [
        producto.nombre ?? null,
        producto.descripcion ?? null,
        producto.precio_anterior ?? null,
        producto.precio_actual ?? null,
        producto.categoria_principal ?? producto.categoria_id ?? null,
        producto.marca_id ?? null,
        producto.estado ?? null,
        producto.capacidad ?? null,
        producto.stock ?? 0,
        producto.stock_minimo ?? 5,
        producto.en_oferta ?? false,
        producto.destacado ?? false,
        producto.activo ?? true,
        (typeof producto.garantia_meses === 'string' ? Number(producto.garantia_meses) : producto.garantia_meses) ?? null,
        producto.imagen_principal ?? null,
        codigo,
        id
      ]
    });

    // 2. Imágenes
    if (Array.isArray(producto.imagenes)) {
      queries.push({ query: 'DELETE FROM producto_imagenes WHERE producto_id = ?', params: [id] });
      if (producto.imagenes.length > 0) {
        const values = producto.imagenes.map(img => [
          id,
          img?.url ?? null,
          img?.alt_text ?? null,
          img?.es_principal ? 1 : 0,
          img?.orden ?? 0
        ]);
        // Validar que ningún valor sea undefined
        for (const row of values) {
          for (let i = 0; i < row.length; i++) {
            if (typeof row[i] === 'undefined') (row as any)[i] = null;
          }
        }
        const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        queries.push({
          query: `INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, es_principal, orden) VALUES ${placeholders}`,
          params: flatValues
        });
      }
    }

    // 3. Características
    if (Array.isArray(producto.caracteristicas)) {
      queries.push({ query: 'DELETE FROM producto_caracteristicas WHERE producto_id = ?', params: [id] });
      if (producto.caracteristicas.length > 0) {
        const values = producto.caracteristicas.map(car => [
          id,
          car?.nombre ?? null,
          car?.valor ?? null,
          car?.orden ?? 0
        ]);
        for (const row of values) {
          for (let i = 0; i < row.length; i++) {
            if (typeof row[i] === 'undefined') (row as any)[i] = null;
          }
        }
        const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        queries.push({
          query: `INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES ${placeholders}`,
          params: flatValues
        });
      }
    }

    // 4. Colores
    if (Array.isArray(producto.colores)) {
      queries.push({ query: 'DELETE FROM producto_colores WHERE producto_id = ?', params: [id] });
      if (producto.colores.length > 0) {
        const values = producto.colores.map(col => [
          id,
          col?.nombre ?? null,
          col?.codigo_hex ?? null,
          col?.stock ?? 0,
          col?.precio_adicional ?? 0,
          typeof col?.activo === 'boolean' ? col.activo : true
        ]);
        for (const row of values) {
          for (let i = 0; i < row.length; i++) {
            if (typeof row[i] === 'undefined') (row as any)[i] = null;
          }
        }
        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        queries.push({
          query: `INSERT INTO producto_colores (producto_id, nombre, codigo_hex, stock, precio_adicional, activo) VALUES ${placeholders}`,
          params: flatValues
        });
      }
    }

    // Ejecutar todo en una transacción
    await executeTransaction(queries);
    return true;
  }

  async eliminarProducto(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM productos WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error eliminando producto:', error)
      throw error
    }
  }

  // ==================== CATEGORÍAS ====================
  async eliminarCategoria(id: number): Promise<boolean> {
    try {
      await executeQuery('DELETE FROM categorias WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  }

  async getCategorias(): Promise<Categoria[]> {
    try {
      const query = `
        SELECT 
          c.*,
          COUNT(pc.producto_id) as total_productos
        FROM categorias c
        LEFT JOIN producto_categorias pc ON c.id = pc.categoria_id
        GROUP BY c.id
        ORDER BY c.orden, c.nombre
      `;
      return await executeQuery<Categoria>(query);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  async crearCategoria(categoria: Partial<Categoria>): Promise<number> {
    try {
      const query = `
        INSERT INTO categorias (nombre, descripcion, imagen, orden)
        VALUES (?, ?, ?, ?)
      `;
      const params = [
        categoria.nombre,
        categoria.descripcion || null,
        categoria.imagen || null,
        categoria.orden || 0
      ];
      const result = await executeQuery(query, params);
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  }

  async actualizarCategoria(id: number, categoria: Partial<Categoria>): Promise<boolean> {
    try {
      const query = `
        UPDATE categorias SET
          nombre = ?, descripcion = ?, imagen = ?, orden = ?
        WHERE id = ?
      `;
      const params = [
        categoria.nombre,
        categoria.descripcion || null,
        categoria.imagen || null,
        categoria.orden,
        id
      ];
      await executeQuery(query, params);
      return true;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  }

  // ==================== MARCAS ====================

  async getMarcas(): Promise<Marca[]> {
    try {
      const query = `
        SELECT 
          m.*,
          COUNT(p.id) as total_productos
        FROM marcas m
        LEFT JOIN productos p ON m.id = p.marca_id AND p.activo = 1
        GROUP BY m.id
        ORDER BY m.nombre
      `
      // No usamos WHERE activa = 1 porque la columna no existe
      return await executeQuery<Marca>(query)
    } catch (error) {
      console.error('Error obteniendo marcas:', error)
      throw error
    }
  }

  async crearMarca(marca: Partial<Marca>): Promise<number> {
    try {
      const query = `
        INSERT INTO marcas (nombre, descripcion, logo, activo)
        VALUES (?, ?, ?, ?)
      `

      const params = [
        marca.nombre,
        marca.descripcion || null,
        marca.logo || null,
        marca.activo !== false
      ]

      const result = await executeQuery(query, params)
      return (result as any).insertId
    } catch (error) {
      console.error('Error creando marca:', error)
      throw error
    }
  }

  // ==================== CLIENTES ====================

  async getClientes(page: number = 1, limit: number = 20): Promise<{clientes: Cliente[], total: number}> {
    try {
      const offset = (page - 1) * limit

      const query = `
        SELECT 
          u.id,
          u.nombre,
          u.email,
          u.telefono,
          u.fecha_registro,
          u.activo,
          COUNT(p.id) as total_pedidos,
          COALESCE(SUM(p.total), 0) as total_gastado,
          MAX(p.fecha_pedido) as ultimo_pedido
        FROM usuarios u
        LEFT JOIN pedidos p ON u.id = p.usuario_id AND p.estado != 'cancelado'
        WHERE u.rol = 'cliente'
        GROUP BY u.id
        ORDER BY u.fecha_registro DESC
        LIMIT ? OFFSET ?
      `

      const countQuery = `
        SELECT COUNT(*) as count
        FROM usuarios
        WHERE rol = 'cliente'
      `

      const clientes = await executeQuery<Cliente>(query, [limit, offset])
      const totalResult = await executeQuerySingle<{count: number}>(countQuery)
      
      return {
        clientes,
        total: totalResult?.count || 0
      }
    } catch (error) {
      console.error('Error obteniendo clientes:', error)
      throw error
    }
  }

// ==================== PEDIDOS ====================

  async getPedidos(page: number = 1, limit: number = 20, filtros?: any): Promise<{pedidos: any[], total: number}> {
    try {
      const offset = (page - 1) * limit
      let whereClause = 'WHERE 1=1'
      let params: any[] = []

      if (filtros?.estado) {
        whereClause += ' AND p.estado = ?'
        params.push(filtros.estado)
      }

      if (filtros?.fecha_desde) {
        whereClause += ' AND DATE(p.fecha_pedido) >= ?'
        params.push(filtros.fecha_desde)
      }

      if (filtros?.fecha_hasta) {
        whereClause += ' AND DATE(p.fecha_pedido) <= ?'
        params.push(filtros.fecha_hasta)
      }

      const query = `
        SELECT 
          p.*,
          COALESCE(u.nombre, 'Cliente Invitado') as usuario_nombre,
          u.email as usuario_email,
          COUNT(pd.id) as cantidad_productos
        FROM pedidos p
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.fecha_pedido DESC
        LIMIT ? OFFSET ?
      `

      const countQuery = `
        SELECT COUNT(*) as count
        FROM pedidos p
        ${whereClause}
      `

      const pedidos = await executeQuery(query, [...params, limit, offset])
      const totalResult = await executeQuerySingle<{count: number}>(countQuery, params)
      
      return {
        pedidos,
        total: totalResult?.count || 0
      }
    } catch (error) {
      console.error('Error obteniendo pedidos:', error)
      throw error
    }
  }

  async actualizarEstadoPedido(id: number, estado: string): Promise<boolean> {
    try {
      await executeQuery(
        'UPDATE pedidos SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
        [estado, id]
      )
      return true
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error)
      throw error
    }
  }
}
export const adminService = new AdminService();