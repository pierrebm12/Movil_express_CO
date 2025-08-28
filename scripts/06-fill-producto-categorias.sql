-- Poblar producto_categorias con la relación actual de productos y categorías principales
-- Esto asume que cada producto tiene un campo categoria_id que apunta a la tabla categorias

INSERT INTO producto_categorias (producto_id, categoria_id)
SELECT * FROM (
  SELECT id AS producto_id, categoria_principal AS categoria_id
  FROM productos
  WHERE categoria_principal IS NOT NULL
) AS new
ON DUPLICATE KEY UPDATE categoria_id = new.categoria_id;

-- Si tienes productos con más de una categoría, deberás poblar manualmente las relaciones adicionales.
