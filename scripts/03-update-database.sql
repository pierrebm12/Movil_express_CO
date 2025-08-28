USE movil_express_db;

-- Crear tabla para configuración de la landing page
CREATE TABLE IF NOT EXISTS configuracion_landing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  seccion VARCHAR(50) NOT NULL,
  clave VARCHAR(100) NOT NULL,
  valor TEXT,
  tipo ENUM('texto', 'imagen', 'color', 'numero', 'booleano', 'json') DEFAULT 'texto',
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_seccion_clave (seccion, clave)
);

-- Insertar configuración inicial
INSERT IGNORE INTO configuracion_landing (seccion, clave, valor, tipo, descripcion) VALUES
  -- General
  ('general', 'nombre_empresa', 'Movil Express', 'texto', 'Nombre de la empresa'),
  ('general', 'eslogan', 'Líderes en tecnología móvil', 'texto', 'Eslogan principal'),
  ('general', 'descripcion', 'Los mejores precios en tecnología móvil con garantía y calidad', 'texto', 'Descripción principal'),
  ('general', 'telefono', '+57 1 234-5678', 'texto', 'Teléfono de contacto'),
  ('general', 'email', 'info@movilexpress.com', 'texto', 'Email de contacto'),
  ('general', 'direccion', 'Cra. 7 #12-34, Bogotá', 'texto', 'Dirección principal'),

  -- Colores
  ('colores', 'primario', '#FCD34D', 'color', 'Color primario de la marca'),
  ('colores', 'secundario', '#000000', 'color', 'Color secundario'),
  ('colores', 'acento', '#3B82F6', 'color', 'Color de acento'),
  ('colores', 'fondo', '#FFFFFF', 'color', 'Color de fondo'),

  -- Hero
  ('hero', 'titulo', '¡Los Mejores Precios en Tecnología Móvil!', 'texto', 'Título del hero'),
  ('hero', 'subtitulo', 'Encuentra los últimos modelos de smartphones, tablets y accesorios con garantía oficial y envío gratis.', 'texto', 'Subtítulo del hero'),
  ('hero', 'imagen_fondo', '/placeholder.svg?height=600&width=1200', 'imagen', 'Imagen de fondo del hero'),
  ('hero', 'mostrar_video', 'false', 'booleano', 'Mostrar video en el hero'),

  -- Sobre Nosotros
  ('sobre_nosotros', 'mision', 'Ser la empresa líder en Colombia en la venta de tecnología móvil, ofreciendo productos de calidad a precios competitivos.', 'texto', 'Misión de la empresa'),
  ('sobre_nosotros', 'vision', 'Convertirnos en la primera opción de los colombianos para adquirir tecnología móvil, expandiendo nuestra presencia a nivel nacional.', 'texto', 'Visión de la empresa'),
  ('sobre_nosotros', 'valores', '["Calidad", "Confianza", "Innovación", "Servicio al Cliente", "Precios Justos"]', 'json', 'Valores de la empresa'),

  -- Contacto
  ('contacto', 'horarios', '{"lunes_viernes": "8:00 AM - 6:00 PM", "sabados": "9:00 AM - 5:00 PM", "domingos": "10:00 AM - 3:00 PM"}', 'json', 'Horarios de atención'),
  ('contacto', 'redes_sociales', '{"facebook": "https://facebook.com/movilexpress", "instagram": "https://instagram.com/movilexpress", "whatsapp": "+573001234567"}', 'json', 'Redes sociales'),

  -- SEO
  ('seo', 'meta_titulo', 'Movil Express - Los Mejores Precios en Tecnología Móvil', 'texto', 'Título SEO'),
  ('seo', 'meta_descripcion', 'Encuentra los mejores smartphones, tablets y accesorios móviles a precios increíbles. Garantía oficial y envío gratis en Colombia.', 'texto', 'Descripción SEO'),
  ('seo', 'palabras_clave', 'smartphones, celulares, tablets, tecnología móvil, iPhone, Samsung, Colombia', 'texto', 'Palabras clave SEO');

-- Agregar columnas a productos si no existen
ALTER TABLE productos
  ADD COLUMN codigo_producto VARCHAR(50) UNIQUE AFTER id,
  ADD COLUMN categoria_principal VARCHAR(100),
  ADD COLUMN garantia_meses INT DEFAULT 12,
  ADD COLUMN proveedor VARCHAR(100),
  ADD COLUMN costo_compra DECIMAL(12,2),
  ADD COLUMN margen_ganancia DECIMAL(5,2),
  ADD COLUMN fecha_vencimiento DATE,
  ADD COLUMN ubicacion_almacen VARCHAR(100),
  ADD COLUMN notas_internas TEXT;

-- Agregar columnas a usuarios si no existen
ALTER TABLE usuarios
  ADD COLUMN codigo_cliente VARCHAR(20) UNIQUE,
  ADD COLUMN fecha_ultima_compra TIMESTAMP NULL,
  ADD COLUMN total_compras DECIMAL(12,2) DEFAULT 0,
  ADD COLUMN numero_pedidos INT DEFAULT 0,
  ADD COLUMN descuento_cliente DECIMAL(5,2) DEFAULT 0;

-- Asignar códigos únicos
UPDATE usuarios 
SET codigo_cliente = CONCAT('CLI', LPAD(id, 6, '0'))
WHERE codigo_cliente IS NULL AND rol = 'cliente';

UPDATE productos 
SET codigo_producto = CONCAT('PROD', LPAD(id, 6, '0'))
WHERE codigo_producto IS NULL;

-- Crear tabla de banners/promociones
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  enlace VARCHAR(500),
  posicion ENUM('hero', 'superior', 'medio', 'inferior', 'lateral') DEFAULT 'hero',
  activo BOOLEAN DEFAULT TRUE,
  fecha_inicio DATE,
  fecha_fin DATE,
  orden INT DEFAULT 0,
  clicks INT DEFAULT 0,
  impresiones INT DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar banners de ejemplo
INSERT IGNORE INTO banners (titulo, descripcion, imagen_url, posicion, activo, fecha_inicio, fecha_fin, orden) VALUES
('¡Ofertas de Temporada!', 'Hasta 50% de descuento en smartphones seleccionados', '/placeholder.svg?height=300&width=800', 'hero', TRUE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1),
('Nuevos iPhone 15', 'Ya disponibles los nuevos iPhone 15 con entrega inmediata', '/placeholder.svg?height=200&width=600', 'superior', TRUE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 2),
('Samsung Galaxy S24', 'La nueva serie Galaxy S24 con tecnología IA', '/placeholder.svg?height=200&width=600', 'medio', TRUE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 3);

-- Crear tabla para estadísticas de ventas
CREATE TABLE IF NOT EXISTS estadisticas_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  ventas_dia DECIMAL(12,2) DEFAULT 0,
  numero_pedidos INT DEFAULT 0,
  productos_vendidos INT DEFAULT 0,
  nuevos_clientes INT DEFAULT 0,
  visitas_web INT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  ticket_promedio DECIMAL(10,2) DEFAULT 0,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar estadísticas ficticias para últimos 30 días
INSERT IGNORE INTO estadisticas_ventas (fecha, ventas_dia, numero_pedidos, productos_vendidos, nuevos_clientes, visitas_web, conversion_rate, ticket_promedio)
SELECT 
  DATE_SUB(CURDATE(), INTERVAL seq DAY),
  ROUND(RAND() * 5000000 + 1000000, 2),
  ROUND(RAND() * 20 + 5),
  ROUND(RAND() * 50 + 10),
  ROUND(RAND() * 10 + 2),
  ROUND(RAND() * 500 + 100),
  ROUND(RAND() * 5 + 2, 2),
  ROUND(RAND() * 500000 + 200000, 2)
FROM (
  SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
  SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL 
  SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL 
  SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL 
  SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL 
  SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29
) AS seq;

-- Actualizar métricas de clientes
UPDATE usuarios u
SET 
  total_compras = (
    SELECT COALESCE(SUM(p.total), 0) 
    FROM pedidos p 
    WHERE p.usuario_id = u.id AND p.estado IN ('entregado', 'confirmado')
  ),
  numero_pedidos = (
    SELECT COUNT(*) 
    FROM pedidos p 
    WHERE p.usuario_id = u.id
  ),
  fecha_ultima_compra = (
    SELECT MAX(p.fecha_pedido) 
    FROM pedidos p 
    WHERE p.usuario_id = u.id
  )
WHERE u.rol = 'cliente';
