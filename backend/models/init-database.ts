import sequelize from "./db";

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");
    await sequelize.sync();
    console.log("✅ Tablas sincronizadas correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar la base de datos:", error);
    process.exit(1);
  }
}

initDatabase();
