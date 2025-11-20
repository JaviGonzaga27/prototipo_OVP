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
    allowNull: true,
    comment: 'RIASEC, Gardner, o Rendimiento'
  },
  dimension: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'R, I, A, S, E, C para RIASEC; LM, L, ES, M, CK, IP, IA, N para Gardner; General, STEM, Humanidades para Rendimiento'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  scaleMin: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Valor mínimo de la escala (1-5)'
  },
  scaleMax: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    comment: 'Valor máximo de la escala (1-5)'
  },
  scaleLabels: {
    type: DataTypes.JSONB,
    defaultValue: {
      1: 'Nada',
      2: 'Poco',
      3: 'Moderado',
      4: 'Mucho',
      5: 'Totalmente'
    },
    comment: 'Etiquetas para cada valor de la escala'
  }
}, {
  tableName: 'Questions',
  timestamps: true
});

export default Question;
