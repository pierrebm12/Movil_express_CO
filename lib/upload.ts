import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function saveUploadedFile(file: File, productId: number, index: number): Promise<string> {
  try {
    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), "public", "uploads", "products")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop()
    const fileName = `${productId}_${index}_${Date.now()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Convertir el archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    // Retornar la URL relativa
    return `/uploads/products/${fileName}`
  } catch (error) {
    console.error("Error saving file:", error)
    throw new Error("Failed to save file")
  }
}
