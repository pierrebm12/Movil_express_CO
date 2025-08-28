-- Actualiza todos los productos que no tienen marca asignada (marca_id IS NULL)
-- y les asigna la marca con id=1 (puedes cambiar el id por el que corresponda)

UPDATE productos SET marca_id = 1 WHERE marca_id IS NULL OR marca_id = 0;

-- Verifica los productos y marcas
SELECT id, nombre, marca_id FROM productos;
SELECT * FROM marcas;
