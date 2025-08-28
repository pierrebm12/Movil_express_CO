import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class PedidoDetalle extends Model {}
PedidoDetalle.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: true },
  nombre_producto: { type: DataTypes.STRING(200), allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  color: DataTypes.STRING(50),
  subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, { sequelize, modelName: 'pedido_detalle', tableName: 'pedido_detalles', timestamps: false });
