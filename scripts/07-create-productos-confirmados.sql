CREATE TABLE IF NOT EXISTS productos_confirmados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    producto_nombre VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    fecha_confirmacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    numero_pedido VARCHAR(100),
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
    -- Datos de envío
    nombre VARCHAR(150),
    email VARCHAR(150),
    telefono VARCHAR(30),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    departamento VARCHAR(100),
    codigo_postal VARCHAR(20),
