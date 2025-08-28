import { executeQuery, executeQuerySingle, executeTransaction, executeCount } from "../database"
import type {
  Producto,
  ProductoCompleto,
  ProductoFiltros,
  ApiResponse,
  EstadisticasProductos,
  // ProductoImagen, // Eliminado: solo usar interfaces/tipos
  ProductoCaracteristica,
  ProductoColor,
  Categoria,
} from "../../types/database"

export class ProductosService {
  // Obtener productos con filtros y paginación
  static async obtenerProductos(filtros: ProductoFiltros = {}): Promise<ApiResponse<ProductoCompleto[]>> {
    try {
      const {
        page = 1,
        limit = 12,
        sortBy = "fecha_creacion",
        sortOrder = "desc",
        categoria,
        marca,
        precio_min,
        precio_max,
        estado,
        en_oferta,
        destacado,
        busqueda,
      } = filtros

      const offset = (page - 1) * limit

      // Construir WHERE clause y JOIN dinámico
      const whereConditions: string[] = ["p.activo = 1"]
      const params: any[] = []
      let joinCategorias = "";

      if (categoria) {
        // Buscar productos que tengan la categoría en producto_categorias
        joinCategorias = "JOIN producto_categorias pc ON p.id = pc.producto_id"
        whereConditions.push("pc.categoria_id = ?")
        params.push(categoria)
      }

      if (marca) {
        whereConditions.push("p.marca_id = ?")
        params.push(marca)
      }

      if (precio_min !== undefined) {
        whereConditions.push("p.precio_actual >= ?")
        params.push(precio_min)
      }

      if (precio_max !== undefined) {
        whereConditions.push("p.precio_actual <= ?")
        params.push(precio_max)
      }

      if (estado) {
        whereConditions.push("p.estado = ?")
        params.push(estado)
      }

      if (en_oferta !== undefined) {
        whereConditions.push("p.en_oferta = ?")
        params.push(en_oferta)
      }

      if (destacado !== undefined) {
        whereConditions.push("p.destacado = ?")
        params.push(destacado)
      }

      if (busqueda) {
        whereConditions.push(`(
          p.nombre LIKE ? OR
          p.descripcion LIKE ? OR
          p.codigo_producto LIKE ? OR
          m.nombre LIKE ?
        )`)
        const searchTerm = `%${busqueda}%`
        params.push(searchTerm, searchTerm, searchTerm, searchTerm)
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

      // Query principal
      const query = `
        SELECT p.*, m.nombre AS marca_nombre
        FROM productos p
        LEFT JOIN marcas m ON p.marca_id = m.id
        ${joinCategorias}
        ${whereClause}
        ORDER BY p.${sortBy} ${sortOrder}
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}
      `

      // Query de conteo (IMPORTANTE: también debe tener el JOIN si filtras por marca o por nombre de marca)
      const countQuery = `
        SELECT COUNT(*) as count
        FROM productos p
        LEFT JOIN marcas m ON p.marca_id = m.id
        ${joinCategorias}
        ${whereClause}
      `

      // Log para depuración

      console.log("🔍 Executing productos query:", query)
      console.log("📝 With params:", params)

      const productos = await executeQuery<Producto>(query, params)

      console.log(`📦 Found ${productos.length} productos`)


      // Obtener datos relacionados para cada producto
      const productosCompletos: ProductoCompleto[] = [];
      for (const producto of productos) {
        const productoCompleto = await this.obtenerProductoCompleto(producto.id);
        if (productoCompleto) {
          productosCompletos.push(productoCompleto);
        }
      }

      // Contar total para paginación
      const total = await executeCount(countQuery, params)
      const totalPages = Math.ceil(total / limit)

      console.log(`📊 Total productos: ${total}, Pages: ${totalPages}`)

      return {
        success: true,
        data: productosCompletos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      }
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error)
      return {
        success: false,
        error: "Error al obtener productos: " + (error as Error).message,
      }
    }
  }

  // Obtener producto completo por ID
  static async obtenerProductoCompleto(id: number): Promise<ProductoCompleto | null> {
    try {
      // Obtener producto base
      const producto = await executeQuerySingle<Producto>("SELECT * FROM productos WHERE id = ? AND activo = 1", [id])

      if (!producto) {
        console.log(`❌ Producto ${id} no encontrado`)
        return null
      }

      // Obtener imágenes
      const imagenes = await executeQuery(
        "SELECT * FROM producto_imagenes WHERE producto_id = ? ORDER BY orden ASC",
        [id],
      )

      // Obtener características
      const caracteristicas = await executeQuery<ProductoCaracteristica>(
        "SELECT * FROM producto_caracteristicas WHERE producto_id = ? ORDER BY orden ASC",
        [id],
      )

      // Obtener colores
      const colores = await executeQuery<ProductoColor>("SELECT * FROM producto_colores WHERE producto_id = ?", [id])

      // Obtener categorías N:M (manejar error si la tabla no existe)
      let categorias: any[] = [];
      try {
        categorias = await executeQuery(
          `SELECT c.* FROM categorias c
           JOIN producto_categorias pc ON c.id = pc.categoria_id
           WHERE pc.producto_id = ? AND c.activa = 1`,
          [producto.id],
        );
      } catch (catErr) {
        console.warn("⚠️ No se pudo obtener categorias N:M para producto:", producto.id, (catErr instanceof Error ? catErr.message : catErr));
        categorias = [];
      }

      // Obtener categoría principal (opcional, si existe)
      let categoria_principal = null;
      const categoriaPrincipalId = (producto as any).categoria_principal || (producto as any).categoria_id || (producto as any).categoria;
      if (categoriaPrincipalId) {
        const [catPrincipal] = await executeQuery(
          `SELECT * FROM categorias WHERE id = ? LIMIT 1`,
          [categoriaPrincipalId]
        );
        if (catPrincipal) categoria_principal = catPrincipal;
      }

      // Retornar el objeto extendido (con categorias N:M)
      return Object.assign({}, producto, {
        imagenes,
        caracteristicas,
        colores,
        categorias,
        categoria_principal,
      });
    } catch (error) {
      console.error("❌ Error obteniendo producto completo:", error)
      return null
    }
  }

  // Crear nuevo producto
  static async crearProducto(data: any): Promise<ApiResponse<ProductoCompleto>> {
    try {
      // Generar código de producto único
      const codigoProducto = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      // Insertar producto principal
      const productoQuery = `
        INSERT INTO productos (
          codigo_producto, nombre, descripcion, precio_anterior, precio_actual, estado, 
          marca, modelo, capacidad, stock, stock_minimo, en_oferta, porcentaje_descuento, 
          imagen_principal, garantia_meses, peso, dimensiones, color_principal, destacado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const params = [
        codigoProducto,
        data.nombre,
        data.descripcion,
        data.precio_anterior || null,
        data.precio_actual,
        data.estado || "nuevo",
        data.categoria_principal || data.marca || null,
        data.modelo || null,
        data.capacidad || null,
        data.stock || 0,
        data.stock_minimo || 5,
        data.en_oferta || false,
        data.porcentaje_descuento || 0,
        data.imagen_principal || null,
        data.garantia_meses || 12,
        data.peso || null,
        data.dimensiones || null,
        data.color_principal || null,
        data.destacado || false,
      ]

      const results = await executeTransaction([{ query: productoQuery, params }])
      const productoId = (results[0] as any).insertId

      console.log(`✅ Producto creado con ID: ${productoId}`)

      // Insertar relaciones
      await this.insertarRelacionesProducto(productoId, data)

      const productoCompleto = await this.obtenerProductoCompleto(productoId)

      return {
        success: true,
        data: productoCompleto!,
        message: "Producto creado exitosamente",
      }
    } catch (error) {
      console.error("❌ Error creando producto:", error)
      return {
        success: false,
        error: "Error al crear producto: " + (error as Error).message,
      }
    }
  }

  // Actualizar producto
  static async actualizarProducto(id: number, data: any): Promise<ApiResponse<ProductoCompleto>> {
    try {
      const { imagenes, caracteristicas, colores, ...productoData } = data

      // Construir query de actualización dinámicamente
      const campos = []
      const valores = []

      for (const [key, value] of Object.entries(productoData)) {
        if (key !== "id" && value !== undefined) {
          // Mapear campos del frontend a la BD
          let dbField = key
          if (key === "categoria_principal") dbField = "marca"

          campos.push(`${dbField} = ?`)
          valores.push(value)
        }
      }

      if (campos.length > 0) {
        const updateQuery = `UPDATE productos SET ${campos.join(", ")}, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?`
        valores.push(id)

        await executeQuery(updateQuery, valores)
        console.log(`✅ Producto ${id} actualizado`)
      }

      // Actualizar relaciones si se proporcionan
      if (imagenes || caracteristicas || colores) {
        await this.actualizarRelacionesProducto(id, { imagenes, caracteristicas, colores })
      }

      const productoCompleto = await this.obtenerProductoCompleto(id)

      return {
        success: true,
        data: productoCompleto!,
        message: "Producto actualizado exitosamente",
      }
    } catch (error) {
      console.error("❌ Error actualizando producto:", error)
      return {
        success: false,
        error: "Error al actualizar producto: " + (error as Error).message,
      }
    }
  }

  // Eliminar producto (soft delete)
  static async eliminarProducto(id: number): Promise<ApiResponse<void>> {
    try {
      await executeQuery("UPDATE productos SET activo = 0, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?", [id])

      console.log(`✅ Producto ${id} eliminado (soft delete)`)

      return {
        success: true,
        message: "Producto eliminado exitosamente",
      }
    } catch (error) {
      console.error("❌ Error eliminando producto:", error)
      return {
        success: false,
        error: "Error al eliminar producto",
      }
    }
  }

  // Obtener estadísticas de productos
  static async obtenerEstadisticas(): Promise<ApiResponse<EstadisticasProductos>> {
    try {
      const stats = await executeQuerySingle<EstadisticasProductos>(`
        SELECT 
          COUNT(*) as total_productos,
          COUNT(CASE WHEN stock > stock_minimo THEN 1 END) as stock_normal,
          COUNT(CASE WHEN stock <= stock_minimo AND stock > 0 THEN 1 END) as stock_bajo,
          COUNT(CASE WHEN stock = 0 THEN 1 END) as stock_agotado,
          COUNT(CASE WHEN en_oferta = 1 THEN 1 END) as productos_oferta,
          COUNT(CASE WHEN destacado = 1 THEN 1 END) as productos_destacados,
          COALESCE(AVG(precio_actual), 0) as precio_promedio,
          COALESCE(SUM(stock * precio_actual), 0) as valor_inventario
        FROM productos 
        WHERE activo = 1
      `)

      return {
        success: true,
        data: stats!,
      }
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas:", error)
      return {
        success: false,
        error: "Error al obtener estadísticas",
      }
    }
  }

  // Métodos auxiliares privados
  private static async insertarRelacionesProducto(productoId: number, data: any) {
      // Insertar categorías N:M
      if (data.categorias && Array.isArray(data.categorias) && data.categorias.length > 0) {
        for (const categoriaId of data.categorias) {
          await executeQuery(
            "INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?)",
            [productoId, categoriaId]
          );
        }
      }
    try {
      // Insertar imágenes
      if (data.imagenes && data.imagenes.length > 0) {
        for (let i = 0; i < data.imagenes.length; i++) {
          const imagen = data.imagenes[i]
          await executeQuery(
            "INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, orden, es_principal) VALUES (?, ?, ?, ?, ?)",
            [productoId, imagen.url_imagen || imagen, imagen.alt_text || "", i + 1, false],
          )
        }
      }

      // Insertar características
      if (data.caracteristicas && data.caracteristicas.length > 0) {
        for (let i = 0; i < data.caracteristicas.length; i++) {
          const caracteristica = data.caracteristicas[i]
          const nombre = typeof caracteristica === "string" ? "Característica" : caracteristica.nombre
          const valor = typeof caracteristica === "string" ? caracteristica : caracteristica.valor

          await executeQuery(
            "INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES (?, ?, ?, ?)",
            [productoId, nombre, valor, i + 1],
          )
        }
      }

      // Insertar colores
      if (data.colores && data.colores.length > 0) {
        for (const color of data.colores) {
          const nombreColor = typeof color === "string" ? color : color.nombre_color
          const stockColor = typeof color === "string" ? 0 : color.stock_color || 0

          await executeQuery("INSERT INTO producto_colores (producto_id, nombre_color, stock_color) VALUES (?, ?, ?)", [
            productoId,
            nombreColor,
            stockColor,
          ])
        }
      }

      // Ya no se insertan categorías N:M

      console.log(`✅ Relaciones insertadas para producto ${productoId}`)
    } catch (error) {
      console.error("❌ Error insertando relaciones:", error)
      throw error
    }
  }

  private static async actualizarRelacionesProducto(productoId: number, data: any) {
      // Actualizar categorías N:M
      if (data.categorias !== undefined) {
        await executeQuery("DELETE FROM producto_categorias WHERE producto_id = ?", [productoId]);
        if (Array.isArray(data.categorias) && data.categorias.length > 0) {
          for (const categoriaId of data.categorias) {
            await executeQuery(
              "INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?)",
              [productoId, categoriaId]
            );
          }
        }
      }
    try {
      // Actualizar imágenes
      if (data.imagenes !== undefined) {
        await executeQuery("DELETE FROM producto_imagenes WHERE producto_id = ?", [productoId])
        if (data.imagenes.length > 0) {
          await this.insertarRelacionesProducto(productoId, { imagenes: data.imagenes })
        }
      }

      // Actualizar características
      if (data.caracteristicas !== undefined) {
        await executeQuery("DELETE FROM producto_caracteristicas WHERE producto_id = ?", [productoId])
        if (data.caracteristicas.length > 0) {
          await this.insertarRelacionesProducto(productoId, { caracteristicas: data.caracteristicas })
        }
      }

      // Actualizar colores
      if (data.colores !== undefined) {
        await executeQuery("DELETE FROM producto_colores WHERE producto_id = ?", [productoId])
        if (data.colores.length > 0) {
          await this.insertarRelacionesProducto(productoId, { colores: data.colores })
        }
      }

      // Ya no se actualizan categorías N:M

      console.log(`✅ Relaciones actualizadas para producto ${productoId}`)
    } catch (error) {
      console.error("❌ Error actualizando relaciones:", error)
      throw error
    }
  }
}
