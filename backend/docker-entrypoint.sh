#!/bin/sh
set -e

echo "🔄 Esperando a que PostgreSQL esté listo..."

# Esperar a que la base de datos esté disponible
until node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ovp_database',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);
sequelize.authenticate().then(() => {
  console.log('✅ Conexión establecida');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
" 2>/dev/null; do
  echo "⏳ PostgreSQL no está listo aún... esperando"
  sleep 2
done

echo "✅ PostgreSQL está listo!"

# Ejecutar inicialización de base de datos solo en primera ejecución
if [ "$INIT_DB" = "true" ]; then
  echo "🔄 Inicializando base de datos..."
  npm run init-db
  echo "✅ Base de datos inicializada!"
fi

echo "🚀 Iniciando servidor..."
exec "$@"
