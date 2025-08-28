import { NextRequest, NextResponse } from 'next/server';
import { crearImagenProducto, listarImagenesProducto, eliminarImagenProducto, reordenarImagenesProducto } from '@/lib/imagenes-crud';

export async function GET(request: NextRequest) {
  try {
    const productoId = Number(request.nextUrl.searchParams.get('producto_id'));
    if (!productoId) return NextResponse.json({ success: false, error: 'producto_id requerido' }, { status: 400 });
    const imagenes = await listarImagenesProducto(productoId);
    return NextResponse.json({ success: true, data: imagenes });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo imágenes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { producto_id, url, alt_text = '', es_principal = false, orden = 0 } = await request.json();
    if (!producto_id || !url) return NextResponse.json({ success: false, error: 'producto_id y url son requeridos' }, { status: 400 });
    const result = await crearImagenProducto(producto_id, url, alt_text, es_principal, orden);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando imagen' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID es requerido' }, { status: 400 });
    const result = await eliminarImagenProducto(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando imagen' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ordenes } = await request.json();
    if (!Array.isArray(ordenes)) return NextResponse.json({ success: false, error: 'ordenes debe ser un array' }, { status: 400 });
    const result = await reordenarImagenesProducto(ordenes);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error reordenando imágenes' }, { status: 500 });
  }
}
