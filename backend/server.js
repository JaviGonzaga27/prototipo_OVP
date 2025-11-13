import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import testRoutes from './routes/testRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    // Sincronizar modelos (crear tablas si no existen)
    return sequelize.sync({ alter: false }); // Cambiar a true solo en desarrollo
  })
  .then(() => console.log('✅ Tablas sincronizadas'))
  .catch((error) => console.error('❌ Error al conectar a PostgreSQL:', error));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes);
app.use('/api/questions', questionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Orientación Vocacional - Backend funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
