-- Script para agregar columnas faltantes a la tabla productos
ALTER TABLE productos
  ADD COLUMN caracteristicas TEXT,
  ADD COLUMN capacidad VARCHAR(100),
  ADD COLUMN colores VARCHAR(255),
  ADD COLUMN categorias VARCHAR(255),
  ADD COLUMN peso VARCHAR(100),
  ADD COLUMN precio_anterior DECIMAL(15,2),
  ADD COLUMN eco BOOLEAN DEFAULT 0,
  ADD COLUMN destacado BOOLEAN DEFAULT 0,
  ADD COLUMN en_oferta BOOLEAN DEFAULT 0,
  ADD COLUMN especificaciones TEXT,
  ADD COLUMN estado VARCHAR(100);
-- Si alguna columna ya existe, ignora el error correspondiente.

-- Crear tabla de relación productos-categorias (N:M)
CREATE TABLE IF NOT EXISTS producto_categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  categoria_id INT NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  UNIQUE KEY unique_producto_categoria (producto_id, categoria_id)
);

-- Crear tabla de tags para productos
CREATE TABLE IF NOT EXISTS producto_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  tag VARCHAR(100) NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
