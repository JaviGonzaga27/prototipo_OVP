import dotenv from 'dotenv';
import { sequelize, User, TestResult, Question } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
dotenv.config();

async function initDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos PostgreSQL...');
    
    // Probar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    console.log('\n🔄 Creando tablas en la base de datos...');
    
    // Sincronizar modelos con la base de datos (esto creará las tablas)
    // force: true elimina las tablas si existen y las vuelve a crear
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas correctamente.');

    console.log('\n🔄 Insertando usuario administrador...');
    
    // Crear usuario administrador
    const adminUser = await User.create({
      name: 'Administrador',
      email: 'admin@ovp.com',
      password: 'admin123', // La contraseña será hasheada automáticamente por el hook
      role: 'admin'
    });
    
    console.log('✅ Usuario administrador creado:');
    console.log('   Email: admin@ovp.com');
    console.log('   Password: admin123');

    console.log('\n💡 Para insertar las 65 preguntas del test vocacional, ejecuta:');
    console.log('   node scripts/populateQuestions.js\n');

    console.log('🔄 Creando usuario de prueba...');
    
    // Crear un usuario estudiante de prueba
    const testUser = await User.create({
      name: 'Estudiante Test',
      email: 'estudiante@test.com',
      password: 'test123',
      role: 'student'
    });
    
    console.log('✅ Usuario de prueba creado:');
    console.log('   Email: estudiante@test.com');
    console.log('   Password: test123');

    console.log('\n🔄 Creando resultado de test de ejemplo...');
    
    // Crear un resultado de test de ejemplo con respuestas simuladas
    const sampleAnswers = {};
    for (let i = 1; i <= 65; i++) {
      sampleAnswers[`q${i}`] = Math.floor(Math.random() * 5) + 1; // Respuesta aleatoria 1-5
    }

    const sampleResults = {
      topCareers: [
        { name: 'Ingeniería de Software', score: 85, description: 'Desarrollo de aplicaciones y sistemas' },
        { name: 'Ciencias de la Computación', score: 80, description: 'Investigación en tecnología' },
        { name: 'Ingeniería Electrónica', score: 75, description: 'Diseño de circuitos y sistemas' }
      ]
    };

    // Crear perfil RIASEC y Gardner de ejemplo
    const sampleProfile = {
      R: 3.5, I: 4.2, A: 2.8, S: 3.0, E: 3.5, C: 4.0,
      LM: 4.0, L: 3.5, ES: 3.0, M: 4.5, CK: 3.0, IP: 3.5, IA: 4.0, N: 3.0,
      Rendimiento_General: 4, Rendimiento_STEM: 5, Rendimiento_Humanidades: 3
    };

    const sampleTopCareers = [
      { carrera: 'Ingeniería de Software', probabilidad: 0.85, porcentaje: 85.0 },
      { carrera: 'Ciencias de la Computación', probabilidad: 0.80, porcentaje: 80.0 },
      { carrera: 'Ingeniería Electrónica', probabilidad: 0.75, porcentaje: 75.0 },
      { carrera: 'Ingeniería Industrial', probabilidad: 0.70, porcentaje: 70.0 },
      { carrera: 'Matemáticas Aplicadas', probabilidad: 0.65, porcentaje: 65.0 }
    ];

    await TestResult.create({
      userId: testUser.id,
      answers: sampleAnswers,
      results: sampleResults,
      predictedCareer: 'Ingeniería de Software',
      confidence: 85.0,
      topCareers: sampleTopCareers,
      profile: sampleProfile
    });

    console.log('✅ Resultado de test de ejemplo creado.');

    console.log('\n✨ Base de datos inicializada correctamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Usuarios: ${await User.count()}`);
    console.log(`   - Preguntas: ${await Question.count()}`);
    console.log(`   - Resultados: ${await TestResult.count()}`);
    console.log('\n🎯 Puedes iniciar sesión con:');
    console.log('   Admin: admin@ovp.com / admin123');
    console.log('   Estudiante: estudiante@test.com / test123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar la inicialización
initDatabase();
