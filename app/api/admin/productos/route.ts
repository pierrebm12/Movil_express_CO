import { NextResponse } from "next/server";
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from '@/lib/productos-crud';
import { crearImagenProducto } from '@/lib/imagenes-crud';
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload || payload.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    const productos = await listarProductos({ search, page, limit });
    return NextResponse.json({ success: true, productos });
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload || payload.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const formData = await request.formData();
    // Extraer y validar campos principales
    const nombre = formData.get("nombre");
    const precio_actual = formData.get("precioActual");
    const descripcion = formData.get("descripcion");
    const marca_id = formData.get("marca_id");
    if (!nombre || !precio_actual || !descripcion || !marca_id) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    // Usar categoria_principal correctamente
    const categoria_principal = formData.get("categoria_principal") || formData.get("categoria_id") || null;
    const producto: any = {
      codigo_producto: formData.get("codigo_producto") || `PRD-${Date.now()}`,
      nombre,
      descripcion,
      precio_anterior: formData.get("precioAnterior") || null,
      precio_actual,
      categoria_principal,
      marca_id,
      estado: formData.get("estado") || 'Nuevo',
      capacidad: formData.get("capacidad") || null,
      stock: formData.get("stock") || 0,
      stock_minimo: 5,
      en_oferta: formData.get("en_oferta") === 'true',
      destacado: formData.get("destacado") === 'true',
      activo: true,
      garantia: formData.get("garantia") || null,
      imagen_principal: formData.get("imagen_principal") || null
    };
    // Crear producto principal
    const result = await crearProducto(producto);
    let productoId = null;
    if (result && typeof result === 'object') {
      if ('insertId' in result) {
        productoId = result.insertId;
      } else if (Array.isArray(result) && result[0] && 'insertId' in result[0]) {
        productoId = result[0].insertId;
      }
    }
    if (!productoId) {
      return NextResponse.json({ error: "No se pudo obtener el ID del producto creado" }, { status: 500 });
    }
    // Guardar relación en producto_categorias (soporte para varias categorías)
    let categorias: any[] = [];
    try {
      categorias = JSON.parse(formData.get("categorias") as string || '[]');
    } catch {}
    // Si se envía un array de categorías, guardar todas
    if (Array.isArray(categorias) && categorias.length > 0) {
      for (let i = 0; i < categorias.length; i++) {
        const catId = categorias[i]?.id || categorias[i];
        if (catId) {
          await require("@/lib/database").executeQuery(
            `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
            [productoId, catId]
          );
        }
      }
    } else if (categoria_principal) {
      // Si no hay array, guardar solo la principal
      await require("@/lib/database").executeQuery(
        `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
        [productoId, categoria_principal]
      );
    }
    // Guardar imágenes de la galería si existen (enviadas como JSON)
    let imagenesGaleria: any[] = [];
    try {
      imagenesGaleria = JSON.parse(formData.get("imagenes_galeria") as string || '[]');
    } catch {}
    if (Array.isArray(imagenesGaleria) && imagenesGaleria.length > 0) {
      for (let i = 0; i < imagenesGaleria.length; i++) {
        const img = imagenesGaleria[i];
        if (img && img.url_imagen) {
          await crearImagenProducto(
            productoId,
            img.url_imagen,
            img.alt_text || '',
            !!img.es_principal,
            img.orden || i + 1
          );
        }
      }
    }

    // Guardar colores si existen (enviados como JSON)
    let colores: any[] = [];
    try {
      colores = JSON.parse(formData.get("colores") as string || '[]');
    } catch {}
    if (Array.isArray(colores) && colores.length > 0) {
      for (let i = 0; i < colores.length; i++) {
        const col = colores[i];
        if (col && col.nombre_color) {
          await require("@/lib/database").executeQuery(
            `INSERT INTO producto_colores (id, producto_id, nombre_color, stock_color) VALUES (?, ?, ?, ?)`,
            [col.id || null, productoId, col.nombre_color, col.stock_color || 0]
          );
        }
      }
    }
    return NextResponse.json({ success: true, id: productoId });
  } catch (err: any) {
    return NextResponse.json({ error: "Error al guardar producto", details: err?.message || err?.toString() }, { status: 500 });
  }
}
    

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload || payload.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { id, ...producto } = body;
    if (!id) return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 });
    const result = await actualizarProducto(id, producto);
    // Actualizar relación en producto_categorias si hay categoria_principal
    if (producto.categoria_principal) {
      await require("@/lib/database").executeQuery(
        `INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE categoria_id = VALUES(categoria_id)`,
        [id, producto.categoria_principal]
      );
    }
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload || payload.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 });
    const result = await eliminarProducto(id);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
