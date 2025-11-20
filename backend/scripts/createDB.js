import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  // Conectar a la base de datos 'postgres' por defecto
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Conectar a postgres para crear la BD
  });

  try {
    console.log('🔄 Conectando a PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    const dbName = process.env.DB_NAME || 'ovp_database';

    // Verificar si la base de datos ya existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length > 0) {
      console.log(`⚠️  La base de datos '${dbName}' ya existe.`);
    } else {
      // Crear la base de datos con codificación UTF-8
      console.log(`🔄 Creando base de datos '${dbName}' con codificación UTF-8...`);
      await client.query(`CREATE DATABASE ${dbName} WITH ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE = template0`);
      console.log(`✅ Base de datos '${dbName}' creada correctamente con UTF-8!`);
    }

    console.log('\n✨ Ahora puedes ejecutar: npm run init-db\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
