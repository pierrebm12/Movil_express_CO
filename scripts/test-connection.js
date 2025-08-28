const mysql = require("mysql2/promise")

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Poseidon",
  database: "movil_express_db",
}

async function testConnection() {
  let connection

  try {
    console.log("🔄 Intentando conectar a la base de datos...")
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`)
    console.log(`👤 Usuario: ${dbConfig.user}`)
    console.log(`🗄️  Base de datos: ${dbConfig.database}`)

    connection = await mysql.createConnection(dbConfig)

    console.log("✅ Conexión exitosa a MySQL!")

    // Probar una consulta simple
    const [rows] = await connection.execute("SELECT COUNT(*) as total FROM usuarios")
    console.log(`👥 Total de usuarios en la base de datos: ${rows[0].total}`)

    // Mostrar información de las tablas
    const [tables] = await connection.execute("SHOW TABLES")
    console.log(`📊 Tablas encontradas: ${tables.length}`)

    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${Object.values(table)[0]}`)
    })

    // Probar consulta de productos
    const [productos] = await connection.execute("SELECT COUNT(*) as total FROM productos WHERE activo = 1")
    console.log(`📱 Productos activos: ${productos[0].total}`)

    console.log("🎉 Todas las pruebas pasaron correctamente!")
  } catch (error) {
    console.error("❌ Error de conexión:", error.message)

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("🔐 Error de autenticación: Verifica usuario y contraseña")
    } else if (error.code === "ECONNREFUSED") {
      console.error("🔌 Error de conexión: Verifica que MySQL esté ejecutándose")
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("🗄️  Error de base de datos: La base de datos no existe")
    }

    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Conexión cerrada")
    }
  }
}

testConnection()
