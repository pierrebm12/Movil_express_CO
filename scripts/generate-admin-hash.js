// Script para generar el hash de la contraseña "admin123" con bcryptjs
const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Hash para "admin123":', hash);
});
