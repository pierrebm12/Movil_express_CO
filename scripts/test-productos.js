const mysql = require("mysql2/promise")

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Poseidon",
  database: "movil_express_db",
}

async function testProductos() {
  let connection

  try {
    console.log("🔄 Conectando a la base de datos...")
    connection = await mysql.createConnection(dbConfig)

    console.log("✅ Conexión exitosa")

    // Verificar estructura de la tabla
    console.log("\n📋 Verificando estructura de la tabla productos:")
    const [structure] = await connection.execute("DESCRIBE productos")
    console.table(structure)

    // Contar productos
    console.log("\n📊 Contando productos:")
    const [countResult] = await connection.execute("SELECT COUNT(*) as total FROM productos WHERE activo = 1")
    console.log(`Total de productos activos: ${countResult[0].total}`)

    // Mostrar productos
  const [productos] = await connection.execute(`
  SELECT id, nombre, precio_actual, stock, activo 
  FROM productos 
  WHERE activo = 1 
  LIMIT 10
`);

    if (productos.length > 0) {
      console.table(productos)
    } else {
      console.log("❌ No se encontraron productos")
    }

    // Probar la consulta de la API
    console.log("\n🔍 Probando consulta de la API:")
    const [apiResult] = await connection.execute(`
      SELECT p.*
      FROM productos p
      WHERE p.activo = 1
      ORDER BY p.fecha_creacion desc
      LIMIT 10 OFFSET 0
    `)

    console.log(`Productos encontrados por la API: ${apiResult.length}`)
    if (apiResult.length > 0) {
      console.log("Primer producto:", {
        id: apiResult[0].id,
        nombre: apiResult[0].nombre,
        precio: apiResult[0].precio_actual,
        stock: apiResult[0].stock,
      })
    }
  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    if (connection) {
      await connection.end()
      console.log("\n🔌 Conexión cerrada")
    }
  }
}

testProductos()
