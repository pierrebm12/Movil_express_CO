import { NextResponse } from 'next/server';
import { getRelatedProductsFromDB } from '@/lib/services/productos';

interface Params {
  id: string;
}

export async function GET(
  req: Request,
  context: { params: Params }
): Promise<Response> {
  const { id } = await context.params;
  try {
    const related = await getRelatedProductsFromDB(Number(id));
    return NextResponse.json({ success: true, data: related });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al obtener productos similares' }, { status: 500 });
  }
}
