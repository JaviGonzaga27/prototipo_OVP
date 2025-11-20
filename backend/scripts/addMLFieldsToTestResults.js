import sequelize from '../config/database.js';

/**
 * Script para agregar las columnas de ML al modelo TestResult
 * Ejecutar: node scripts/addMLFieldsToTestResults.js
 */

async function addMLFields() {
  try {
    console.log('🔄 Agregando columnas de ML a TestResults...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Agregar columna predictedCareer
    try {
      await queryInterface.addColumn('TestResults', 'predictedCareer', {
        type: sequelize.Sequelize.STRING,
        allowNull: true
      });
      console.log('✅ Columna predictedCareer agregada');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        console.log('⚠️  Columna predictedCareer ya existe');
      } else {
        throw error;
      }
    }
    
    // Agregar columna confidence
    try {
      await queryInterface.addColumn('TestResults', 'confidence', {
        type: sequelize.Sequelize.FLOAT,
        allowNull: true
      });
      console.log('✅ Columna confidence agregada');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        console.log('⚠️  Columna confidence ya existe');
      } else {
        throw error;
      }
    }
    
    // Agregar columna topCareers
    try {
      await queryInterface.addColumn('TestResults', 'topCareers', {
        type: sequelize.Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      });
      console.log('✅ Columna topCareers agregada');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        console.log('⚠️  Columna topCareers ya existe');
      } else {
        throw error;
      }
    }
    
    // Agregar columna profile
    try {
      await queryInterface.addColumn('TestResults', 'profile', {
        type: sequelize.Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      });
      console.log('✅ Columna profile agregada');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        console.log('⚠️  Columna profile ya existe');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Migración completada exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
addMLFields();
