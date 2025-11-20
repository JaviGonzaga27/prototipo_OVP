import sequelize from '../config/database.js';

/**
 * Script para verificar y configurar la codificación UTF-8 en PostgreSQL
 * Ejecutar: node scripts/checkDatabaseEncoding.js
 */

async function checkEncoding() {
  try {
    console.log('🔍 Verificando codificación de la base de datos...\n');
    
    // Verificar codificación de la base de datos
    const [dbEncoding] = await sequelize.query(`
      SELECT pg_encoding_to_char(encoding) as encoding 
      FROM pg_database 
      WHERE datname = current_database();
    `);
    
    console.log('Codificación de la base de datos:', dbEncoding[0].encoding);
    
    // Verificar codificación del cliente
    const [clientEncoding] = await sequelize.query(`SHOW client_encoding;`);
    console.log('Codificación del cliente:', clientEncoding[0]?.client_encoding || 'No disponible');
    
    // Verificar codificación de las columnas de texto
    const [columnInfo] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'TestResults' 
      AND data_type IN ('character varying', 'text');
    `);
    
    console.log('\nColumnas de texto en TestResults:');
    columnInfo.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Configurar codificación UTF-8 para la sesión
    await sequelize.query(`SET client_encoding = 'UTF8';`);
    console.log('\n✅ Codificación del cliente configurada a UTF-8');
    
    // Verificar que se guardó correctamente
    const [newEncoding] = await sequelize.query(`SHOW client_encoding;`);
    console.log('Nueva codificación del cliente:', newEncoding[0]?.client_encoding || 'UTF8 (por defecto)');
    
    console.log('\n✅ Verificación completada');
    console.log('\n💡 Si la codificación de la base de datos no es UTF8, considera recrear la base de datos con:');
    console.log('   CREATE DATABASE ovp_database WITH ENCODING = \'UTF8\' LC_COLLATE = \'es_ES.UTF-8\' LC_CTYPE = \'es_ES.UTF-8\';');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al verificar codificación:', error);
    process.exit(1);
  }
}

// Ejecutar verificación
checkEncoding();
