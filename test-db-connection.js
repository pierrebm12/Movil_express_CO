const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Poseidon',
      database: 'movil_express_db',
      port: 3306,
    });
    await connection.ping();
    await connection.end();
    console.log('✅ Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection();
