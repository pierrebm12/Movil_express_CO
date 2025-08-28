import { NextRequest, NextResponse } from "next/server"
import { adminService } from "@/lib/services/admin.service"
import { executeQuery } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de producto inválido' 
        },
        { status: 400 }
      )
    }

    const producto = await adminService.getProducto(id);
    if (!producto) {
      return NextResponse.json({ success: false, error: 'Producto no encontrado' }, { status: 404 });
    }

    // Obtener todas las categorías activas y marcar las asociadas al producto
    let categorias = [];
    try {
      // Todas las categorías activas
      const todas = await executeQuery(
        `SELECT * FROM categorias WHERE activa = 1`,
        []
      );
      // IDs de categorías asociadas al producto
      const asociadas = await executeQuery(
        `SELECT categoria_id FROM producto_categorias WHERE producto_id = ?`,
        [id]
      );
      const asociadasIds = new Set(asociadas.map((row: any) => row.categoria_id));
      // Marcar cada categoría con 'checked' si está asociada
      categorias = todas.map((cat: any) => ({ ...cat, checked: asociadasIds.has(cat.id) }));
    } catch (e) {
      categorias = [];
    }



    // Obtener tags reales desde la tabla producto_tags
    let tags: string[] = [];
    try {
      const tagsRows = await executeQuery(
        'SELECT tag FROM producto_tags WHERE producto_id = ?',
        [id]
      );
      tags = Array.isArray(tagsRows) ? tagsRows.map((row: any) => row.tag) : [];
    } catch (e) {
      tags = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        ...producto,
        categorias,
        tags
      }
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'ID de producto inválido' }, { status: 400 });
    }

    // Soportar FormData para edición
    let producto: any = {};
    let imagenesGaleria: any[] = [];
    let colores: any[] = [];
    let caracteristicas: any[] = [];
    let tags: any[] = [];
    let isFormData = false;
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('multipart/form-data')) {
        isFormData = true;
        const formData = await request.formData();
        producto.nombre = formData.get('nombre');
        producto.precio_actual = formData.get('precioActual');
        producto.precio_anterior = formData.get('precioAnterior');
        producto.descripcion = formData.get('descripcion');
        producto.marca_id = formData.get('marca_id');
        producto.capacidad = formData.get('capacidad');
        producto.stock = formData.get('stock');
        producto.estado = formData.get('estado');
        producto.en_oferta = formData.get('en_oferta') === 'true';
        producto.destacado = formData.get('destacado') === 'true';
        producto.garantia_meses = formData.get('garantia_meses');
        producto.imagen_principal = formData.get('imagen_principal');
        // Arrays
        try { imagenesGaleria = JSON.parse(formData.get('imagenes_galeria') as string || '[]'); } catch {}
        try { colores = JSON.parse(formData.get('colores') as string || '[]'); } catch {}
        try { caracteristicas = JSON.parse(formData.get('caracteristicas') as string || '[]'); } catch {}
        try { tags = JSON.parse(formData.get('tags') as string || '[]'); } catch {}
      } else {
        producto = await request.json();
        imagenesGaleria = producto.imagenes || [];
        colores = producto.colores || [];
        caracteristicas = producto.caracteristicas || [];
        tags = producto.tags || [];
      }
    } catch {}

    // Validaciones básicas
    if (!producto.nombre || !producto.precio_actual) {
      return NextResponse.json({ success: false, error: 'Nombre y precio son requeridos' }, { status: 400 });
    }

    // Filtrar y mapear imágenes para aceptar url_imagen o url
    const imagenesFiltradas = Array.isArray(imagenesGaleria)
      ? imagenesGaleria
          .filter(img => img && (typeof img.url_imagen === 'string' || typeof img.url === 'string'))
          .map((img, i) => ({
            url: img.url || img.url_imagen || '',
            alt_text: img.alt_text || '',
            es_principal: !!img.es_principal,
            orden: img.orden || i + 1
          }))
      : [];

    // Filtrar y mapear colores para aceptar ambos formatos
    const coloresFiltrados = Array.isArray(colores)
      ? colores
          .filter(col => col && (col.nombre || col.nombre_color))
          .map(col => ({
              nombre: col.nombre || col.nombre_color || '',
              codigo_hex: col.codigo_hex || null,
              stock: col.stock !== undefined ? col.stock : (col.stock_color !== undefined ? col.stock_color : 0),
              precio_adicional: col.precio_adicional || 0,
              activo: typeof col.activo === 'boolean' ? col.activo : true
            }))
      : [];

    // Filtrar características inválidas (sin nombre o valor)
    const caracteristicasFiltradas = Array.isArray(caracteristicas)
      ? caracteristicas.filter(car => car && (car.nombre || car.valor))
      : [];

    // Preparamos el objeto producto con todas las relaciones filtradas
    producto.imagenes = imagenesFiltradas;
    producto.colores = coloresFiltrados;
    producto.caracteristicas = caracteristicasFiltradas;

    // Actualizar producto y tags en una transacción
    const queries: { query: string; params: any[] }[] = [];

    // Actualizar producto y relaciones, incluyendo categoria_principal
    queries.push({
      query: `UPDATE productos SET nombre = ?, descripcion = ?, precio_anterior = ?, precio_actual = ?, marca_id = ?, capacidad = ?, stock = ?, estado = ?, en_oferta = ?, destacado = ?, garantia_meses = ?, imagen_principal = ?, categoria_principal = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?`,
      params: [
        producto.nombre ?? null,
        producto.descripcion ?? null,
        producto.precio_anterior ?? null,
        producto.precio_actual ?? null,
        producto.marca_id ?? null,
        producto.capacidad ?? null,
        producto.stock ?? 0,
        producto.estado ?? null,
        producto.en_oferta ?? false,
        producto.destacado ?? false,
        producto.garantia_meses ?? null,
        producto.imagen_principal ?? null,
        producto.categoria_principal ?? null,
        id
      ]
    });

    // Actualizar/inserta la relación en producto_categorias si hay categoria_principal
    if (producto.categoria_principal) {
      queries.push({
        query: `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
        params: [id, producto.categoria_principal]
      });
    }

    // Imágenes
    queries.push({ query: 'DELETE FROM producto_imagenes WHERE producto_id = ?', params: [id] });
    if (producto.imagenes && producto.imagenes.length > 0) {
      const values = (producto.imagenes as Array<any>).map((img: any) => [id, img.url, img.alt_text || null, img.es_principal ? 1 : 0, img.orden || 0]);
      const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();
      queries.push({
        query: `INSERT INTO producto_imagenes (producto_id, url_imagen, alt_text, es_principal, orden) VALUES ${placeholders}`,
        params: flatValues
      });
    }

    // Características
    queries.push({ query: 'DELETE FROM producto_caracteristicas WHERE producto_id = ?', params: [id] });
    if (producto.caracteristicas && producto.caracteristicas.length > 0) {
      const values = (producto.caracteristicas as Array<any>).map((car: any) => [id, car.nombre, car.valor, car.orden || 0]);
      const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();
      queries.push({
        query: `INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES ${placeholders}`,
        params: flatValues
      });
    }

    // Colores
    queries.push({ query: 'DELETE FROM producto_colores WHERE producto_id = ?', params: [id] });
    if (producto.colores && producto.colores.length > 0) {
      // Mapeo para compatibilidad con la estructura de la tabla
      const values = (producto.colores as Array<any>).map((col: any) => [id, col.nombre_color || col.nombre || '', col.stock_color !== undefined ? col.stock_color : (col.stock !== undefined ? col.stock : 0)]);
      const placeholders = values.map(() => '(?, ?, ?)').join(', ');
      const flatValues = values.flat();
      queries.push({
        query: `INSERT INTO producto_colores (producto_id, nombre_color, stock_color) VALUES ${placeholders}`,
        params: flatValues
      });
    }

    // TAGS: eliminar y volver a insertar
    queries.push({ query: 'DELETE FROM producto_tags WHERE producto_id = ?', params: [id] });
    if (tags && tags.length > 0) {
      const values = tags.map(tag => [id, tag]);
      const placeholders = values.map(() => '(?, ?)').join(', ');
      const flatValues = values.flat();
      queries.push({
        query: `INSERT INTO producto_tags (producto_id, tag) VALUES ${placeholders}`,
        params: flatValues
      });
    }

    // Ejecutar todo en una transacción usando el helper
    try {
      const { executeTransaction } = await import('@/lib/database');
      await executeTransaction(queries);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Error actualizando producto (transacción fallida)' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de producto inválido' 
        },
        { status: 400 }
      )
    }

    const success = await adminService.eliminarProducto(id)

    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error eliminando producto' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
