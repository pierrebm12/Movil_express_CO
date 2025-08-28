import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class Usuario extends Model {}
Usuario.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  telefono: DataTypes.STRING(20),
  direccion: DataTypes.TEXT,
  rol: { type: DataTypes.ENUM('cliente', 'admin'), defaultValue: 'cliente' },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ultimo_acceso: DataTypes.DATE,
}, { sequelize, modelName: 'usuario', tableName: 'usuarios', timestamps: false });
