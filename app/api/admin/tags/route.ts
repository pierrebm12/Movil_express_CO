import { NextRequest, NextResponse } from "next/server";
import { crearTag, listarTags, actualizarTag, eliminarTag } from '@/lib/tags-crud';

export async function GET(request: NextRequest) {
  try {
    const producto_id = request.nextUrl.searchParams.get('producto_id');
    const tags = await listarTags(producto_id ? Number(producto_id) : undefined);
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.producto_id || !data.nombre) {
      return NextResponse.json({ success: false, error: 'producto_id y nombre son requeridos' }, { status: 400 });
    }
    const result = await crearTag(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando tag' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'ID de tag requerido' }, { status: 400 });
    }
    const result = await actualizarTag(data.id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando tag' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de tag requerido' }, { status: 400 });
    }
    const result = await eliminarTag(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando tag' }, { status: 500 });
  }
}
