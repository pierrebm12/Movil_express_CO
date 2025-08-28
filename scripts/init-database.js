const mysql = require("mysql2/promise")

async function initDatabase() {
  // Conectar sin especificar la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Poseidon",
    multipleStatements: true,
  })

  try {
    console.log("🚀 Inicializando base de datos...")

    // 1. Crear la base de datos si no existe
    await connection.query("DROP DATABASE IF EXISTS movil_express_db")
    await connection.query("CREATE DATABASE movil_express_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    await connection.query("USE movil_express_db")

    // 2. Ejecutar el script principal de creación
    const fs = require("fs")
    const path = require("path")
  const createScript = fs.readFileSync(path.join(__dirname, "01-create-database.sql"), "utf8");
  await connection.query(createScript);

    // 3. Insertar datos iniciales, ejecutando cada sentencia por separado
    const seedScript = fs.readFileSync(path.join(__dirname, "02-seed-data.sql"), "utf8");
    // Separar por punto y coma, pero ignorar los que están dentro de strings
    const statements = seedScript
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let erroresSeed = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await connection.query(stmt);
      } catch (err) {
        erroresSeed++;
        console.error(`❌ Error en sentencia seed #${i + 1}:`);
        console.error(stmt);
        if (err.sqlMessage) {
          console.error("   SQL Error:", err.sqlMessage);
        } else {
          console.error("   Error:", err.message || err);
        }
      }
    }
    if (erroresSeed > 0) {
      console.warn(`⚠️  Se detectaron ${erroresSeed} errores al ejecutar el seed. Revisa los mensajes anteriores.`);
    }

    // 4. Aplicar actualizaciones
     const updateScript = fs.readFileSync(path.join(__dirname, "03-update-database.sql"), "utf8");
  await connection.query(updateScript);

  // 5. Aplicar correcciones de estructura
  const fixScript = fs.readFileSync(path.join(__dirname, "04-fix-database-structure.sql"), "utf8");
  await connection.query(fixScript);

    console.log("✅ Base de datos inicializada correctamente")

    // Verificar datos
    const [productos] = await connection.query("SELECT COUNT(*) as count FROM productos")
    console.log(`📦 Productos insertados: ${productos[0].count}`)

    const [categorias] = await connection.query("SELECT COUNT(*) as count FROM categorias")
    console.log(`🏷️ Categorías insertadas: ${categorias[0].count}`)

    const [usuarios] = await connection.query("SELECT COUNT(*) as count FROM usuarios")
    console.log(`👥 Usuarios insertados: ${usuarios[0].count}`)


     await connection.commit();
    console.log("✅ Base de datos inicializada correctamente");
  } catch (error) {
    await connection.rollback();
    // Mostrar mensaje SQL si existe, si no el mensaje general
    if (error.sqlMessage) {
      console.error("❌ Error inicializando base de datos (SQL):", error.sqlMessage);
    } else {
      console.error("❌ Error inicializando base de datos:", error.message || error);
    }
    // Mostrar el stack completo para debug
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end()
    console.log("🔌 Conexión cerrada")
  }
}

initDatabase()