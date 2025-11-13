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
    defaultValue: []
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
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
