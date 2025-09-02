import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

export class OrdenDatos extends Model {}

OrdenDatos.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pedidoId: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  direccion: { type: DataTypes.TEXT, allowNull: false },
  telefono: { type: DataTypes.STRING(30), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  ciudad: { type: DataTypes.STRING(100), allowNull: false },
  notas: { type: DataTypes.TEXT },
}, {
  sequelize,
  modelName: 'orden_datos',
  tableName: 'orden_datos',
  timestamps: true,
});

export default OrdenDatos;
