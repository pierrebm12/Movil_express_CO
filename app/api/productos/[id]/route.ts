import { type NextRequest, NextResponse } from "next/server"
import { ProductosService } from "@/lib/services/productos.service"

// GET /api/productos/[id] - Obtener producto por ID
interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Params }
): Promise<Response> {
  try {
    const { id } = await context.params;
    const numId = Number.parseInt(id);

    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: "ID de producto inválido" }, { status: 400 });
    }

    const producto = await ProductosService.obtenerProductoCompleto(numId);

    if (!producto) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    console.error("Error en GET /api/productos/[id]:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT /api/productos/[id] - Actualizar producto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de producto inválido" }, { status: 400 })
    }

    const body = await request.json()
    const result = await ProductosService.actualizarProducto(id, body)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error("Error en PUT /api/productos/[id]:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE /api/productos/[id] - Eliminar producto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID de producto inválido" }, { status: 400 })
    }

    const result = await ProductosService.eliminarProducto(id)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error("Error en DELETE /api/productos/[id]:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
