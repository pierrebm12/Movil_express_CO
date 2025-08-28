-- Elimina todos los usuarios admin duplicados excepto el que quieres conservar
DELETE FROM usuarios WHERE email = 'admin@movilexpress.com' AND rol = 'admin';

-- Inserta el usuario admin correcto y activo (la contraseña será reemplazada por el hash bcrypt luego)
INSERT INTO usuarios (email, password, rol, activo, nombre) VALUES (
  'admin@movilexpress.com',
  '$2a$10$hashTemporal12345678901234567890123456789012345678901234567890',
  'admin',
  1,
  'Administrador'
);

-- Después de esto, ejecuta el script Node.js para poner el hash bcrypt real:
-- node scripts/update-admin-password.js "admin@movilexpress.com" "admin123"
