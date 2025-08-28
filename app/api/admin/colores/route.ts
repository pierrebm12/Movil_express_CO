import { NextRequest, NextResponse } from "next/server";
import { crearColor, listarColores, actualizarColor, eliminarColor } from '@/lib/colores-crud';

export async function GET(request: NextRequest) {
  try {
    const producto_id = request.nextUrl.searchParams.get('producto_id');
    const colores = await listarColores(producto_id ? Number(producto_id) : undefined);
    return NextResponse.json({ success: true, data: colores });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo colores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.producto_id || !data.nombre) {
      return NextResponse.json({ success: false, error: 'producto_id y nombre son requeridos' }, { status: 400 });
    }
    const result = await crearColor(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando color' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'ID de color requerido' }, { status: 400 });
    }
    const result = await actualizarColor(data.id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando color' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de color requerido' }, { status: 400 });
    }
    const result = await eliminarColor(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando color' }, { status: 500 });
  }
}
