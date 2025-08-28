import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class ProductoTag extends Model {}
ProductoTag.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'productos', key: 'id' } },
  tag: { type: DataTypes.STRING(50), allowNull: false },
}, { sequelize, modelName: 'producto_tag', tableName: 'producto_tags', timestamps: false });
