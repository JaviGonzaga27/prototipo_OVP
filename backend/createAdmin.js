import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('⚠️  Ya existe un usuario administrador');
      process.exit(0);
    }

    // Crear admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@ovp.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@ovp.com');
    console.log('🔑 Contraseña: admin123');
    console.log('⚠️  Por favor, cambia la contraseña después del primer login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
