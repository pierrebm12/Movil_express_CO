-- Verificar y corregir la estructura de la base de datos

-- Verificar si la tabla productos existe y tiene la estructura correcta
DESCRIBE productos;

-- Si hay problemas con la estructura, recrear la tabla
-- Eliminar tablas dependientes antes de 'productos'
-- Eliminar tablas que dependen de productos
-- Eliminar tablas que dependen de productos
DROP TABLE IF EXISTS pedido_detalles;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS producto_reviews;
DROP TABLE IF EXISTS producto_tags;
DROP TABLE IF EXISTS producto_categorias;
DROP TABLE IF EXISTS producto_colores;
DROP TABLE IF EXISTS producto_caracteristicas;
DROP TABLE IF EXISTS producto_imagenes;
DROP TABLE IF EXISTS productos;




-- Crear tabla productos con la estructura correcta
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_anterior DECIMAL(10,2) NULL,
    precio_actual DECIMAL(10,2) NOT NULL,
    estado ENUM('nuevo', 'usado', 'reacondicionado') DEFAULT 'nuevo',
    capacidad VARCHAR(50) NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    en_oferta BOOLEAN DEFAULT FALSE,
    porcentaje_descuento INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    imagen_principal TEXT NULL,
    marca_id INT NULL,
    categoria_principal VARCHAR(100) NULL,
    garantia_meses INT DEFAULT 12,
    proveedor VARCHAR(255) NULL,
    costo_compra DECIMAL(10,2) NULL,
    margen_ganancia DECIMAL(5,2) NULL,
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo),
    INDEX idx_categoria (categoria_principal),
    INDEX idx_estado (estado),
    INDEX idx_oferta (en_oferta),
    INDEX idx_destacado (destacado)
);

-- Crear tabla de imágenes de productos
CREATE TABLE producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    url_imagen TEXT NOT NULL,
    alt_text VARCHAR(255) NULL,
    orden INT DEFAULT 1,
    es_principal BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

-- Crear tabla de características de productos
CREATE TABLE producto_caracteristicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    valor TEXT NOT NULL,
    orden INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

-- Crear tabla de colores de productos
CREATE TABLE producto_colores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    nombre_color VARCHAR(50) NOT NULL,
    codigo_hex VARCHAR(7) NULL,
    stock_color INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

-- Insertar algunos productos de prueba
INSERT INTO productos (
    codigo_producto, nombre, descripcion, precio_anterior, precio_actual, 
    estado, capacidad, stock, stock_minimo, en_oferta, porcentaje_descuento,
    imagen_principal, categoria_principal, garantia_meses, destacado
) VALUES 
(
    'PROD-IP15-001', 
    'iPhone 15 Pro Max 256GB', 
    'El iPhone más avanzado con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR de 6.7 pulgadas.',
    5500000, 
    4800000, 
    'nuevo', 
    '256GB', 
    15, 
    5, 
    TRUE, 
    13,
    '/placeholder.svg?height=400&width=400',
    'Apple',
    12,
    TRUE
),
(
    'PROD-SAM-002', 
    'Samsung Galaxy S24 Ultra 512GB', 
    'Smartphone premium con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X.',
    4800000, 
    4200000, 
    'nuevo', 
    '512GB', 
    8, 
    3, 
    TRUE, 
    12,
    '/placeholder.svg?height=400&width=400',
    'Samsung',
    24,
    TRUE
),
(
    'PROD-XIA-003', 
    'Xiaomi 14 Ultra 256GB', 
    'Flagship con cámara Leica, procesador Snapdragon 8 Gen 3 y carga rápida de 90W.',
    3200000, 
    2800000, 
    'nuevo', 
    '256GB', 
    12, 
    5, 
    TRUE, 
    12,
    '/placeholder.svg?height=400&width=400',
    'Xiaomi',
    12,
    FALSE
),
(
    'PROD-APP-004', 
    'MacBook Air M3 256GB', 
    'Laptop ultradelgada con chip M3, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.',
    5800000, 
    5400000, 
    'nuevo', 
    '256GB SSD', 
    5, 
    2, 
    TRUE, 
    7,
    '/placeholder.svg?height=400&width=400',
    'Apple',
    12,
    TRUE
),
(
    'PROD-AIR-005', 
    'AirPods Pro 2da Gen', 
    'Auriculares inalámbricos con cancelación activa de ruido y audio espacial personalizado.',
    1200000, 
    980000, 
    'nuevo', 
    'N/A', 
    25, 
    10, 
    TRUE, 
    18,
    '/placeholder.svg?height=400&width=400',
    'Apple',
    12,
    FALSE
);

-- Insertar características para los productos
INSERT INTO producto_caracteristicas (producto_id, nombre, valor, orden) VALUES
(1, 'Procesador', 'Chip A17 Pro', 1),
(1, 'Pantalla', '6.7" Super Retina XDR', 2),
(1, 'Cámara', '48MP Principal + Ultra Gran Angular + Teleobjetivo', 3),
(1, 'Batería', 'Hasta 29 horas de video', 4),
(2, 'Procesador', 'Snapdragon 8 Gen 3', 1),
(2, 'Pantalla', '6.8" Dynamic AMOLED 2X', 2),
(2, 'Cámara', '200MP Principal + Ultra Gran Angular + Teleobjetivo', 3),
(2, 'S Pen', 'Incluido', 4),
(3, 'Procesador', 'Snapdragon 8 Gen 3', 1),
(3, 'Pantalla', '6.73" LTPO AMOLED', 2),
(3, 'Cámara', 'Leica 50MP Principal', 3),
(3, 'Carga', '90W HyperCharge', 4);

-- Insertar colores para los productos
INSERT INTO producto_colores (producto_id, nombre_color, stock_color) VALUES
(1, 'Titanio Natural', 5),
(1, 'Titanio Azul', 5),
(1, 'Titanio Blanco', 5),
(2, 'Titanio Gris', 3),
(2, 'Titanio Violeta', 3),
(2, 'Titanio Amarillo', 2),
(3, 'Negro', 6),
(3, 'Blanco', 6);

-- Verificar que los datos se insertaron correctamente
SELECT COUNT(*) as total_productos FROM productos WHERE activo = 1;
SELECT * FROM productos WHERE activo = 1 LIMIT 5;
