import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class ProductoColor extends Model {}
ProductoColor.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'productos', key: 'id' } },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  codigo_hex: DataTypes.STRING(7),
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  precio_adicional: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'producto_color', tableName: 'producto_colores', timestamps: false });
