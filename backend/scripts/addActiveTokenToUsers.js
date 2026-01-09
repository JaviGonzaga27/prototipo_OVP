// scripts/addActiveTokenToUsers.js
// Script para agregar el campo activeToken a la tabla Users

import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const addActiveTokenColumn = async () => {
  try {
    console.log('🔄 Iniciando migración: Agregando columna activeToken a Users...');

    // Verificar si la columna ya existe (sintaxis PostgreSQL)
    const [columns] = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'Users' AND column_name = 'activeToken'`,
      { type: QueryTypes.SELECT }
    );

    if (columns) {
      console.log('✅ La columna activeToken ya existe');
      return;
    }

    // Agregar la columna activeToken (sintaxis PostgreSQL)
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN "activeToken" TEXT NULL
    `);

    console.log('Columna activeToken agregada exitosamente');
    console.log('Ahora el sistema solo permitirá una sesión activa por usuario');

  } catch (error) {
    console.error('Error en la migración:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

addActiveTokenColumn();
