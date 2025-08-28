// Script para actualizar la contraseña de un admin en la base de datos con un hash bcrypt
// Uso: node scripts/update-admin-password.js "admin@email.com" "nueva_contraseña"

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Uso: node scripts/update-admin-password.js "email" "nueva_contraseña"');
  process.exit(1);
}

async function main() {
  const hash = await bcrypt.hash(newPassword, 10);
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'movil_express_db' // Corregido para coincidir con .env.local
  });
  const [result] = await connection.execute(
    'UPDATE usuarios SET password = ? WHERE email = ? AND rol = "admin"',
    [hash, email]
  );
  await connection.end();
  if (result.affectedRows > 0) {
    console.log('Contraseña actualizada correctamente para', email);
  } else {
    console.log('No se encontró un admin con ese email.');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
