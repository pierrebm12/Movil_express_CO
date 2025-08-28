export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...categoria } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de categoría requerido' },
        { status: 400 }
      );
    }
    await actualizarCategoria(id, categoria.nombre, categoria.descripcion, categoria.imagen, categoria.orden);
    return NextResponse.json({ success: true, message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de categoría requerido' },
        { status: 400 }
      );
    }
    await eliminarCategoria(id);
    return NextResponse.json({ success: true, message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server"
import { crearCategoria, listarCategorias, actualizarCategoria, eliminarCategoria } from '@/lib/categorias-crud';


export async function GET() {
  try {
    const categorias = await listarCategorias();
    return NextResponse.json({ success: true, data: categorias });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo categorías' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion = '', imagen = '', orden = 0 } = await request.json();
    if (!nombre) return NextResponse.json({ success: false, error: 'El nombre es requerido' }, { status: 400 });
    const result = await crearCategoria(nombre, descripcion, imagen, orden);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando categoría' }, { status: 500 });
  }
}
