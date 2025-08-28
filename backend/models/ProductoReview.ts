import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class ProductoReview extends Model {}
ProductoReview.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: true },
  nombre_usuario: { type: DataTypes.STRING(100), allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  titulo: DataTypes.STRING(200),
  comentario: DataTypes.TEXT,
  verificado: { type: DataTypes.BOOLEAN, defaultValue: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'producto_review', tableName: 'producto_reviews', timestamps: false });
