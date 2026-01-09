// scripts/addActiveTokenToUsers.js
// Script para agregar el campo activeToken a la tabla Users

import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const addActiveTokenColumn = async () => {
  try {
    console.log('🔄 Iniciando migración: Agregando columna activeToken a Users...');

    // Verificar si la columna ya existe
    const [columns] = await sequelize.query(
      `SHOW COLUMNS FROM Users LIKE 'activeToken'`,
      { type: QueryTypes.SELECT }
    );

    if (columns) {
      console.log('✅ La columna activeToken ya existe');
      return;
    }

    // Agregar la columna activeToken
    await sequelize.query(`
      ALTER TABLE Users 
      ADD COLUMN activeToken TEXT NULL 
      COMMENT 'Token activo de la sesión actual - solo se permite una sesión activa'
    `);

    console.log('✅ Columna activeToken agregada exitosamente');
    console.log('🔒 Ahora el sistema solo permitirá una sesión activa por usuario');

  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

addActiveTokenColumn();
