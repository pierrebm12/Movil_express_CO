-- Usar la base de datos
USE movil_express_db;


-- En 02-seed-data.sql o 03-update-database.sql
INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT id, categoria_id FROM productos WHERE categoria_id IS NOT NULL;

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, imagen, orden) VALUES
('Smartphones', 'Teléfonos inteligentes de todas las marcas', '/images/categoria-smartphones.jpg', 1),
('Tablets', 'Tablets y dispositivos móviles', '/images/categoria-tablets.jpg', 2),
('Accesorios', 'Accesorios para dispositivos móviles', '/images/categoria-accesorios.jpg', 3),
('Audio', 'Auriculares, parlantes y audio', '/images/categoria-audio.jpg', 4),
('Smartwatches', 'Relojes inteligentes', '/images/categoria-smartwatches.jpg', 5);

-- Insertar marcas
INSERT INTO marcas (nombre, descripcion, logo) VALUES
('Apple', 'Productos Apple originales', '/images/marca-apple.png'),
('Samsung', 'Dispositivos Samsung', '/images/marca-samsung.png'),
('Xiaomi', 'Tecnología Xiaomi', '/images/marca-xiaomi.png'),
('Huawei', 'Productos Huawei', '/images/marca-huawei.png'),
('OnePlus', 'Smartphones OnePlus', '/images/marca-oneplus.png');

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol) VALUES
('Administrador Principal', 'admin@movilexpress.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', '+57 300 123 4567', 'Calle 123 #45-67, Bogotá', 'admin'),
('Super Administrador', 'superadmin@movilexpress.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+57 301 234 5678', 'Carrera 45 #12-34, Medellín', 'admin'),
('Juan Pérez', 'juan.perez@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', '+57 302 345 6789', 'Avenida 68 #23-45, Bogotá', 'cliente'),
('María García', 'maria.garcia@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', '+57 303 456 7890', 'Calle 85 #12-34, Cali', 'cliente');


INSERT INTO productos (nombre, descripcion, precio_anterior, precio_actual, categoria_id, marca_id, estado, capacidad, stock, oferta, destacado, rating, total_reviews, garantia) VALUES
('iPhone 15 Pro Max', 'El iPhone más avanzado...', 5500000, 4200000, 1, 1, 'Nuevo', '256GB', 8, TRUE, TRUE, 4.8, 156, '1 año'),
('iPhone 14 Pro', 'iPhone 14 Pro con Dynamic Island...', 4200000, 3500000, 1, 1, 'Nuevo', '128GB', 12, TRUE, TRUE, 4.7, 203, '1 año'),
('Samsung Galaxy S24 Ultra', 'El smartphone Android más potente...', 4800000, 3900000, 1, 2, 'Nuevo', '512GB', 6, TRUE, TRUE, 4.9, 89, '1 año'),
('Samsung Galaxy S23', 'Galaxy S23 con cámara de 50MP...', 3200000, 2800000, 1, 2, 'Nuevo', '256GB', 15, TRUE, FALSE, 4.6, 134, '1 año'),
('AirPods Pro 2da Gen', 'Auriculares inalámbricos premium...', 850000, 650000, 4, 1, 'Nuevo', NULL, 25, TRUE, TRUE, 4.5, 312, '1 año'),
('iPad Air 5ta Gen', 'iPad Air con chip M1...', 2800000, 2400000, 2, 1, 'Nuevo', '256GB', 10, TRUE, FALSE, 4.7, 78, '1 año'),
('Samsung Galaxy Tab S9', 'Tablet premium con S Pen incluido...', 3500000, 3100000, 2, 2, 'Nuevo', '256GB', 7, FALSE, TRUE, 4.6, 45, '1 año'),
('Apple Watch Series 9', 'Reloj inteligente con chip S9...', 1800000, 1500000, 5, 1, 'Nuevo', '45mm', 18, TRUE, FALSE, 4.4, 167, '1 año'),

-- 10 productos nuevos para pruebas y variedad
('Xiaomi Redmi Note 13', 'Smartphone gama media con gran batería y cámara cuádruple.', 1200000, 950000, 1, 3, 'Nuevo', '128GB', 20, TRUE, TRUE, 4.5, 98, '1 año'),
('Huawei P60 Pro', 'Fotografía profesional y diseño elegante.', 3500000, 2990000, 1, 4, 'Nuevo', '256GB', 9, TRUE, FALSE, 4.6, 67, '1 año'),
('OnePlus 12', 'Rendimiento flagship y carga ultra rápida.', 3200000, 2700000, 1, 5, 'Nuevo', '256GB', 11, TRUE, TRUE, 4.7, 54, '1 año'),
('Samsung Galaxy Buds2', 'Auriculares inalámbricos con cancelación de ruido.', 600000, 480000, 4, 2, 'Nuevo', NULL, 30, TRUE, FALSE, 4.4, 120, '1 año'),
('Apple iPad Mini 6', 'Tablet compacta con chip A15 Bionic.', 2200000, 1850000, 2, 1, 'Nuevo', '64GB', 8, TRUE, FALSE, 4.6, 39, '1 año'),
('Huawei Watch GT 4', 'Reloj inteligente con batería de larga duración.', 900000, 750000, 5, 4, 'Nuevo', '46mm', 14, TRUE, FALSE, 4.5, 28, '1 año'),
('Xiaomi Mi Smart Band 8', 'Pulsera inteligente para fitness y salud.', 250000, 180000, 5, 3, 'Nuevo', NULL, 40, TRUE, TRUE, 4.3, 210, '1 año'),
('OnePlus Buds Pro 2', 'Auriculares premium con Dolby Atmos.', 700000, 590000, 4, 5, 'Nuevo', NULL, 22, TRUE, FALSE, 4.5, 33, '1 año'),
('Samsung Galaxy Tab A9', 'Tablet asequible para toda la familia.', 900000, 750000, 2, 2, 'Nuevo', '64GB', 13, TRUE, FALSE, 4.2, 19, '1 año'),
('Apple AirTag', 'Localizador inteligente para tus objetos.', 180000, 150000, 4, 1, 'Nuevo', NULL, 50, TRUE, TRUE, 4.8, 400, '1 año');

-- Insertar relación producto-categoría (después de insertar productos)
INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT id, categoria_id FROM productos WHERE categoria_id IS NOT NULL;


-- Insertar imágenes de productos
INSERT INTO producto_imagenes (producto_id, url, alt_text, es_principal, orden) VALUES
-- iPhone 15 Pro Max
(1, '/placeholder.svg?height=600&width=600', 'iPhone 15 Pro Max frontal', TRUE, 1),
(1, '/placeholder.svg?height=600&width=600', 'iPhone 15 Pro Max trasero', FALSE, 2),
(1, '/placeholder.svg?height=600&width=600', 'iPhone 15 Pro Max lateral', FALSE, 3),
-- iPhone 14 Pro
(2, '/placeholder.svg?height=600&width=600', 'iPhone 14 Pro frontal', TRUE, 1),
(2, '/placeholder.svg?height=600&width=600', 'iPhone 14 Pro trasero', FALSE, 2),
-- Samsung Galaxy S24 Ultra
(3, '/placeholder.svg?height=600&width=600', 'Galaxy S24 Ultra frontal', TRUE, 1),
(3, '/placeholder.svg?height=600&width=600', 'Galaxy S24 Ultra con S Pen', FALSE, 2),
-- Samsung Galaxy S23
(4, '/placeholder.svg?height=600&width=600', 'Galaxy S23 frontal', TRUE, 1),
-- AirPods Pro
(5, '/placeholder.svg?height=600&width=600', 'AirPods Pro con estuche', TRUE, 1),
-- iPad Air
(6, '/placeholder.svg?height=600&width=600', 'iPad Air frontal', TRUE, 1),
-- Galaxy Tab S9
(7, '/placeholder.svg?height=600&width=600', 'Galaxy Tab S9 frontal', TRUE, 1),
-- Apple Watch
(8, '/placeholder.svg?height=600&width=600', 'Apple Watch Series 9', TRUE, 1);

-- Insertar colores de productos
INSERT INTO producto_colores (producto_id, nombre, codigo_hex, stock) VALUES
-- iPhone 15 Pro Max
(1, 'Titanio Natural', '#F5F5DC', 3),
(1, 'Titanio Azul', '#4169E1', 2),
(1, 'Titanio Blanco', '#FFFFFF', 2),
(1, 'Titanio Negro', '#000000', 1),
-- iPhone 14 Pro
(2, 'Morado Intenso', '#800080', 4),
(2, 'Oro', '#FFD700', 3),
(2, 'Plata', '#C0C0C0', 3),
(2, 'Negro Espacial', '#2C2C2C', 2),
-- Samsung Galaxy S24 Ultra
(3, 'Titanio Gris', '#808080', 2),
(3, 'Titanio Negro', '#000000', 2),
(3, 'Titanio Violeta', '#8A2BE2', 2),
-- AirPods Pro
(5, 'Blanco', '#FFFFFF', 25),
-- Apple Watch
(8, 'Medianoche', '#191970', 6),
(8, 'Luz de las Estrellas', '#F5F5DC', 6),
(8, 'Rojo', '#FF0000', 6);

-- Insertar características de productos
INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES
-- iPhone 15 Pro Max
(1, 'Procesador', 'Chip A17 Pro', 1),
(1, 'Pantalla', '6.7" Super Retina XDR', 2),
(1, 'Cámara Principal', '48MP con zoom óptico 5x', 3),
(1, 'Batería', 'Hasta 29 horas de video', 4),
(1, 'Material', 'Titanio de grado aeroespacial', 5),
-- Samsung Galaxy S24 Ultra
(3, 'Procesador', 'Snapdragon 8 Gen 3', 1),
(3, 'Pantalla', '6.8" Dynamic AMOLED 2X', 2),
(3, 'Cámara Principal', '200MP con IA', 3),
(3, 'S Pen', 'Incluido', 4),
(3, 'Batería', '5000mAh', 5),
-- AirPods Pro
(5, 'Chip', 'H2', 1),
(5, 'Cancelación de Ruido', 'Activa', 2),
(5, 'Audio Espacial', 'Personalizado', 3),
(5, 'Batería', 'Hasta 6 horas', 4),
(5, 'Estuche', 'Con MagSafe', 5);

-- Insertar tags de productos
INSERT INTO producto_tags (producto_id, tag) VALUES
(1, 'iPhone'), (1, 'Apple'), (1, 'Flagship'), (1, 'Premium'),
(2, 'iPhone'), (2, 'Apple'), (2, 'Pro'),
(3, 'Samsung'), (3, 'Galaxy'), (3, 'S Pen'), (3, 'Ultra'),
(4, 'Samsung'), (4, 'Galaxy'), (4, 'Compacto'),
(5, 'Apple'), (5, 'Auriculares'), (5, 'Bluetooth'), (5, 'Pro'),
(6, 'Apple'), (6, 'iPad'), (6, 'Tablet'), (6, 'M1'),
(7, 'Samsung'), (7, 'Tablet'), (7, 'S Pen'),
(8, 'Apple'), (8, 'Watch'), (8, 'Smartwatch'), (8, 'Salud');

-- Insertar configuración del sistema
INSERT INTO configuracion (clave, valor, descripcion, tipo) VALUES
('sitio_nombre', 'Movil Express', 'Nombre del sitio web', 'string'),
('sitio_descripcion', 'Tu tienda de confianza para dispositivos móviles', 'Descripción del sitio', 'string'),
('moneda', 'COP', 'Moneda del sitio', 'string'),
('iva_porcentaje', '19', 'Porcentaje de IVA', 'number'),
('envio_gratis_minimo', '200000', 'Monto mínimo para envío gratis', 'number'),
('costo_envio_base', '15000', 'Costo base de envío', 'number'),
('telefono_contacto', '+57 300 123 4567', 'Teléfono de contacto', 'string'),
('email_contacto', 'info@movilexpress.com', 'Email de contacto', 'string'),
('direccion_principal', 'Calle 123 #45-67, Bogotá, Colombia', 'Dirección principal', 'string'),
('horario_atencion', 'Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 4:00 PM', 'Horario de atención', 'string');

-- Insertar algunos pedidos de ejemplo
INSERT INTO pedidos (usuario_id, numero_pedido, estado, subtotal, impuestos, envio, total, metodo_pago, estado_pago, direccion_envio, telefono_contacto) VALUES
(3, 'ME-2024-001', 'entregado', 4200000, 798000, 0, 4998000, 'tarjeta', 'pagado', 'Avenida 68 #23-45, Bogotá', '+57 302 345 6789'),
(4, 'ME-2024-002', 'procesando', 650000, 123500, 15000, 788500, 'mercadopago', 'pagado', 'Calle 85 #12-34, Cali', '+57 303 456 7890'),
(3, 'ME-2024-003', 'pendiente', 3500000, 665000, 0, 4165000, 'transferencia', 'pendiente', 'Avenida 68 #23-45, Bogotá', '+57 302 345 6789');

-- Insertar detalles de pedidos
INSERT INTO pedido_detalles (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, color, subtotal) VALUES
(1, 1, 'iPhone 15 Pro Max', 4200000, 1, 'Titanio Natural', 4200000),
(2, 5, 'AirPods Pro 2da Gen', 650000, 1, 'Blanco', 650000),
(3, 2, 'iPhone 14 Pro', 3500000, 1, 'Morado Intenso', 3500000);

-- Insertar algunas reseñas
INSERT INTO producto_reviews (producto_id, usuario_id, nombre_usuario, rating, titulo, comentario, verificado) VALUES
(1, 3, 'Juan Pérez', 5, 'Excelente teléfono', 'La calidad es increíble, la cámara es espectacular y la batería dura todo el día.', TRUE),
(1, 4, 'María García', 5, 'Vale cada peso', 'Mejor que mi teléfono anterior, muy rápido y elegante.', TRUE),
(5, 3, 'Juan Pérez', 4, 'Buenos auriculares', 'La cancelación de ruido funciona muy bien, aunque el precio es alto.', TRUE);


-- Mostrar resumen de datos insertados
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM usuarios
UNION ALL
SELECT 'Categorías', COUNT(*) FROM categorias
UNION ALL
SELECT 'Marcas', COUNT(*) FROM marcas
UNION ALL
SELECT 'Productos', COUNT(*) FROM productos
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'Reviews', COUNT(*) FROM producto_reviews;
