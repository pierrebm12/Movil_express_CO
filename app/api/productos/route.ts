import { type NextRequest, NextResponse } from "next/server"
import { ProductosService } from "@/lib/services/productos.service"
import { testConnection } from "@/lib/database"

// GET /api/productos - Obtener productos con filtros
export async function GET(request: NextRequest) {
  try {
    console.log("🚀 GET /api/productos - Starting request")

    // Verificar conexión a BD
    const isConnected = await testConnection()
    if (!isConnected) {
      console.error("❌ Database connection failed")
      return NextResponse.json({ success: false, error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    console.log("🔍 Search params:", searchParams.toString())

    // Parsear parámetros de consulta
    const filtros = {
      page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 12,
      sortBy: searchParams.get("sortBy") || "fecha_creacion",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      categoria: searchParams.get("categoria") || undefined,
      marca: searchParams.get("marca") || undefined,
      precio_min: searchParams.get("precio_min") ? Number.parseFloat(searchParams.get("precio_min")!) : undefined,
      precio_max: searchParams.get("precio_max") ? Number.parseFloat(searchParams.get("precio_max")!) : undefined,
      estado: searchParams.get("estado") || undefined,
      en_oferta: searchParams.get("en_oferta") ? searchParams.get("en_oferta") === "true" : undefined,
      busqueda: searchParams.get("busqueda") || undefined,
      destacado: searchParams.get("destacado") ? searchParams.get("destacado") === "true" : undefined,
    }

    console.log("📋 Parsed filters:", filtros)

    const result = await ProductosService.obtenerProductos(filtros)

    console.log("📦 Service result:", {
      success: result.success,
      dataLength: result.data?.length,
      error: result.error,
    })

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error("❌ Error en GET /api/productos:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor: " + (error as Error).message },
      { status: 500 },
    )
  }
}

// POST /api/productos - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    console.log("🚀 POST /api/productos - Creating new product")

    const body = await request.json()
    console.log("📝 Request body:", body)

    const result = await ProductosService.crearProducto(body)

    console.log("📦 Create result:", { success: result.success, error: result.error })

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    })
  } catch (error) {
    console.error("❌ Error en POST /api/productos:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor: " + (error as Error).message },
      { status: 500 },
    )
  }
}


