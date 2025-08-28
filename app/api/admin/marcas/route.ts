import { NextRequest, NextResponse } from "next/server"
import { crearMarca, listarMarcas, actualizarMarca, eliminarMarca } from '@/lib/marcas-crud';


export async function GET() {
  try {
    const marcas = await listarMarcas();
    return NextResponse.json({ success: true, data: marcas });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo marcas' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion = '', logo = '' } = await request.json();
    if (!nombre) return NextResponse.json({ success: false, error: 'El nombre es requerido' }, { status: 400 });
    const result = await crearMarca(nombre, descripcion, logo);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando marca' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nombre, descripcion = '', logo = '' } = await request.json();
    if (!id || !nombre) return NextResponse.json({ success: false, error: 'ID y nombre son requeridos' }, { status: 400 });
    const result = await actualizarMarca(id, nombre, descripcion, logo);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando marca' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID es requerido' }, { status: 400 });
    const result = await eliminarMarca(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando marca' }, { status: 500 });
  }
}
