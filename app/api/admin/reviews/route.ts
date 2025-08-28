import { NextRequest, NextResponse } from "next/server";
import { crearReview, listarReviews, actualizarReview, eliminarReview } from '@/lib/reviews-crud';

export async function GET(request: NextRequest) {
  try {
    const producto_id = request.nextUrl.searchParams.get('producto_id');
    const reviews = await listarReviews(producto_id ? Number(producto_id) : undefined);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error obteniendo reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.producto_id || !data.rating) {
      return NextResponse.json({ success: false, error: 'producto_id y rating son requeridos' }, { status: 400 });
    }
    const result = await crearReview(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creando review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'ID de review requerido' }, { status: 400 });
    }
    const result = await actualizarReview(data.id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error actualizando review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de review requerido' }, { status: 400 });
    }
    const result = await eliminarReview(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error eliminando review' }, { status: 500 });
  }
}
