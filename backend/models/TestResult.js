import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Respuestas del test (q1-q65 o promedios por dimensión)'
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Resultados calculados (legacy)'
  },
  predictedCareer: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Carrera recomendada por el modelo ML'
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Nivel de confianza de la predicción (0-1)'
  },
  topCareers: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Top 5 carreras con sus probabilidades'
  },
  profile: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Perfil del estudiante (promedios RIASEC, Gardner, Rendimiento)'
  }
}, {
  tableName: 'TestResults',
  timestamps: true,
  createdAt: 'completedAt',
  updatedAt: false
});

// Relación con User
TestResult.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(TestResult, { foreignKey: 'userId', as: 'testResults' });

export default TestResult;
