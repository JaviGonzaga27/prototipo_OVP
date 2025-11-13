import sequelize from '../config/database.js';
import User from './User.js';
import TestResult from './TestResult.js';
import Question from './Question.js';

// Exportar modelos y sequelize
export {
  sequelize,
  User,
  TestResult,
  Question
};

// Función para sincronizar la base de datos
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de datos sincronizada');
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    throw error;
  }
};

export default {
  sequelize,
  User,
  TestResult,
  Question,
  syncDatabase
};
