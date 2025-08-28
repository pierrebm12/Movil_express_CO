import { NextRequest, NextResponse } from "next/server";
import { crearCaracteristica, listarCaracteristicas, actualizarCaracteristica, eliminarCaracteristica } from '@/lib/caracteristicas-crud';

export async function GET(request: NextRequest) {
  try {
    const producto_id = request.nextUrl.searchParams.get('producto_id');
    const caracteristicas = await listarCaracteristicas(producto_id ? Number(producto_id) : undefined);
    return NextResponse.json({ success: true, data: caracteristicas });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo características' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.producto_id || !data.nombre || !data.valor) {
      return NextResponse.json({ success: false, error: 'producto_id, nombre y valor son requeridos' }, { status: 400 });
    }
    const result = await crearCaracteristica(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando característica' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'ID de característica requerido' }, { status: 400 });
    }
    const result = await actualizarCaracteristica(data.id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando característica' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de característica requerido' }, { status: 400 });
    }
    const result = await eliminarCaracteristica(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando característica' }, { status: 500 });
  }
}
