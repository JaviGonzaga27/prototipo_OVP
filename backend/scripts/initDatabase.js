import dotenv from 'dotenv';
import { sequelize, User, TestResult, Question } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
dotenv.config();

// Datos de preguntas del test vocacional
const questions = [
  {
    text: '¿Te gusta trabajar con números y resolver problemas matemáticos?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'ciencias',
    order: 1,
    isActive: true
  },
  {
    text: '¿Te interesa entender cómo funcionan las cosas y la tecnología?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'ingenieria',
    order: 2,
    isActive: true
  },
  {
    text: '¿Disfrutas ayudando a las personas y trabajando en equipo?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'social',
    order: 3,
    isActive: true
  },
  {
    text: '¿Te atrae crear contenido artístico o diseñar cosas nuevas?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'arte',
    order: 4,
    isActive: true
  },
  {
    text: '¿Te interesa el funcionamiento del cuerpo humano y la salud?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'salud',
    order: 5,
    isActive: true
  },
  {
    text: '¿Disfrutas organizando eventos, liderando proyectos o administrando recursos?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'administracion',
    order: 6,
    isActive: true
  },
  {
    text: '¿Te gusta investigar, experimentar y descubrir cosas nuevas?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'investigacion',
    order: 7,
    isActive: true
  },
  {
    text: '¿Te interesa defender los derechos de las personas y la justicia?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'derecho',
    order: 8,
    isActive: true
  },
  {
    text: '¿Disfrutas comunicando ideas, escribiendo o hablando en público?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'comunicacion',
    order: 9,
    isActive: true
  },
  {
    text: '¿Te atrae trabajar al aire libre o con el medio ambiente?',
    options: ['Muy poco', 'Poco', 'Neutral', 'Bastante', 'Mucho'],
    category: 'ambiental',
    order: 10,
    isActive: true
  }
];

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

    console.log('\n🔄 Insertando preguntas del test vocacional...');
    
    // Insertar preguntas
    for (const question of questions) {
      await Question.create(question);
    }
    
    console.log(`✅ ${questions.length} preguntas insertadas correctamente.`);

    console.log('\n🔄 Creando usuario de prueba...');
    
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
    
    // Crear un resultado de test de ejemplo
    const sampleAnswers = questions.map((q, index) => ({
      questionId: index + 1,
      answer: Math.floor(Math.random() * 5) // Respuesta aleatoria 0-4
    }));

    const sampleResults = {
      topCareers: [
        { name: 'Ingeniería de Software', score: 85, description: 'Desarrollo de aplicaciones y sistemas' },
        { name: 'Ciencias de la Computación', score: 80, description: 'Investigación en tecnología' },
        { name: 'Ingeniería Electrónica', score: 75, description: 'Diseño de circuitos y sistemas' }
      ]
    };

    await TestResult.create({
      userId: testUser.id,
      answers: sampleAnswers,
      results: sampleResults
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
