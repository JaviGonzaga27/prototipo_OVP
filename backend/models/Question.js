import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El texto de la pregunta es requerido'
      }
    }
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Las opciones deben ser un array no vacío');
        }
      }
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Questions',
  timestamps: true
});

export default Question;
