import { Question } from '../models/index.js';
import sequelize from '../config/database.js';

// Opciones estándar para todas las preguntas (escala Likert 1-5)
export const standardOptions = [
  { value: 1, label: 'Para nada' },
  { value: 2, label: 'Poco' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Bastante' },
  { value: 5, label: 'Mucho' }
];

// Lista de 62 preguntas adaptadas para estudiantes de secundaria
export const questionTexts = [
  // RIASEC - Realista (R) - 5 preguntas
  { text: '¿Te gusta reparar o arreglar cosas cuando se dañan?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Prefieres hacer proyectos prácticos como sembrar plantas o construir algo en tecnología?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Disfrutas las clases en laboratorios o talleres donde usas materiales y herramientas?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Sientes satisfacción al ayudar en actividades físicas, como deportes o proyectos de limpieza en tu barrio?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Te interesaría trabajar en profesiones técnicas, agrícolas o mecánicas en el futuro?', category: 'RIASEC', dimension: 'R' },
  
  // RIASEC - Investigativo (I) - 5 preguntas
  { text: '¿Te gusta investigar temas nuevos para tus tareas o proyectos escolares?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Disfrutas experimentar en clase de ciencias, buscando cómo y por qué ocurren cosas?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Prefieres analizar y resolver problemas matemáticos o científicos?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Te interesa ver documentales sobre ciencia, tecnología o descubrimientos?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Te gustaría seguir carreras como medicina, ingeniería, informática o investigación científica?', category: 'RIASEC', dimension: 'I' },
  
  // RIASEC - Artístico (A) - 5 preguntas
  { text: '¿Te gusta participar en obras de teatro, festivales musicales o concursos artísticos?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Prefieres trabajos creativos, como diseñar carteles, pintar o inventar historias?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Te gusta crear tus propios proyectos artísticos, musicales o audiovisuales?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Disfrutas expresar tus ideas y emociones a través del arte, la música o la escritura?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Te interesaría estudiar diseño, arquitectura, música, actuación o literatura?', category: 'RIASEC', dimension: 'A' },
  
  // RIASEC - Social (S) - 5 preguntas
  { text: '¿Te gusta ayudar a tus compañeros, apoyar a quienes tienen dificultades, o participar en voluntariados escolares?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Disfrutas dar tutorías, explicar tareas o motivar a otros en tu grupo?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Prefieres actividades donde puedes colaborar y convivir con personas?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Te gusta organizar campañas de ayuda social, convivencias o eventos en tu colegio?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Te interesan carreras como pedagogía, psicología, trabajo social o enfermería?', category: 'RIASEC', dimension: 'S' },
  
  // RIASEC - Emprendedor (E) - 5 preguntas
  { text: '¿Te inspiran a liderar proyectos estudiantiles, grupos de clase o actividades deportivas?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Te gusta organizar ventas escolares, ferias, o campañas para recolectar fondos?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Prefieres tomar decisiones rápidas y proponer ideas en reuniones estudiantiles?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Disfrutas negociar y convencer a otros cuando tienes una meta?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Visualizas tener un negocio, ser líder comunitario o trabajar en marketing en el futuro?', category: 'RIASEC', dimension: 'E' },
  
  // RIASEC - Convencional (C) - 5 preguntas
  { text: '¿Te resulta fácil ordenar tus cuadernos, trabajos y materiales escolares?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Prefieres seguir instrucciones claras en tus clases o proyectos?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Te motiva participar en actividades administrativas, como ser secretario en el consejo estudiantil?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Disfrutas tareas donde puedas organizar información, datos o documentos de manera precisa?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Te gustaría trabajar en oficinas, bancos, instituciones públicas o contabilidad?', category: 'RIASEC', dimension: 'C' },
  
  // Gardner - Lingüística (L) - 4 preguntas
  { text: '¿Te resulta fácil escribir cuentos, mensajes o reflexiones?', category: 'Gardner', dimension: 'L' },
  { text: '¿Disfrutas leer novelas, revistas o publicaciones?', category: 'Gardner', dimension: 'L' },
  { text: '¿Te gusta participar en debates, exposiciones o leer en voz alta en clase?', category: 'Gardner', dimension: 'L' },
  { text: '¿Te identificas expresando tus ideas con precisión al conversar con tus compañeros o familiares?', category: 'Gardner', dimension: 'L' },
  
  // Gardner - Lógico-Matemática (LM) - 4 preguntas
  { text: '¿Resuelves rápidamente ejercicios de matemáticas o acertijos en clase?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Te gusta analizar problemas y buscar soluciones utilizando lógica?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Te interesan actividades como concursos matemáticos, feria de ciencias o juegos de estrategia?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Sientes curiosidad al ver noticias sobre tecnología, ciencias o inventos?', category: 'Gardner', dimension: 'LM' },
  
  // Gardner - Espacial (ES) - 4 preguntas
  { text: '¿Disfrutas dibujar paisajes, mapas, planos o figuras geométricas visibles en tu entorno?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Te motiva crear diseños para campañas escolares, redes sociales o instituciones del barrio?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Imaginas cómo cambiaría un objeto si lo modificas o miras desde otro ángulo?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Armas fácilmente rompecabezas o modelos tridimensionales?', category: 'Gardner', dimension: 'ES' },
  
  // Gardner - Musical (M) - 4 preguntas
  { text: '¿Te gusta cantar o participar en actividades musicales?', category: 'Gardner', dimension: 'M' },
  { text: '¿Identificas fácilmente ritmos y melodías en la música?', category: 'Gardner', dimension: 'M' },
  { text: '¿Te interesa tocar instrumentos o crear tu propia música?', category: 'Gardner', dimension: 'M' },
  { text: '¿Reconoces fácilmente diferentes géneros musicales?', category: 'Gardner', dimension: 'M' },
  
  // Gardner - Corporal-Kinestésica (CK) - 4 preguntas
  { text: '¿Te gustan los deportes, el baile o actividades físicas?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Aprendes mejor haciendo experimentos, manualidades o tareas prácticas?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Te gusta participar en actividades recreativas, deportes intercolegiales o campeonatos?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Tienes habilidad para expresar ideas mediante movimientos o gestos en presentaciones escolares?', category: 'Gardner', dimension: 'CK' },
  
  // Gardner - Interpersonal (IP) - 4 preguntas
  { text: '¿Colaboras activamente en grupo, creando buen ambiente entre compañeros y profesores?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Facilitas la solución de conflictos y apoyas a quienes se sienten solos en tu clase?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Te motiva ayudar a organizar eventos, fiestas escolares o proyectos comunitarios?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Comprendes bien las emociones y necesidades de las personas a tu alrededor?', category: 'Gardner', dimension: 'IP' },
  
  // Gardner - Intrapersonal (IA) - 4 preguntas
  { text: '¿Reflexionas sobre tus metas personales y sueños para el futuro?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Analizas tus propias fortalezas y debilidades al decidir qué estudiar o en qué participar?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Prefieres a veces trabajar solo y tomarte tiempo para pensar en tus decisiones?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Buscas mejorar personalmente en actividades extracurriculares o académicas?', category: 'Gardner', dimension: 'IA' },
  
  // Gardner - Naturalista (N) - 4 preguntas
  { text: '¿Te interesa conocer sobre la biodiversidad, animales y plantas?', category: 'Gardner', dimension: 'N' },
  { text: '¿Participas en proyectos de reciclaje, cuidado ambiental o excursiones?', category: 'Gardner', dimension: 'N' },
  { text: '¿Reconoces fácilmente tipos de flora y fauna?', category: 'Gardner', dimension: 'N' },
  { text: '¿Te preocupa el futuro del ambiente y promueves hábitos ecológicos entre tus amigos?', category: 'Gardner', dimension: 'N' }
];

// Función para insertar las 62 preguntas
export async function insert62Questions() {
  console.log('📝 Insertando 62 preguntas del test vocacional...');
  
  for (let i = 0; i < questionTexts.length; i++) {
    const questionData = questionTexts[i];
    await Question.create({
      text: questionData.text,
      category: questionData.category,
      dimension: questionData.dimension,
      options: standardOptions,
      order: i + 1,
      isActive: true
    });
  }
  
  console.log('✅ 62 preguntas insertadas correctamente');
}

async function updateQuestions() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Eliminar todas las preguntas existentes
    console.log('🗑️  Eliminando preguntas antiguas...');
    await Question.destroy({ where: {}, truncate: true });
    console.log('✅ Preguntas antiguas eliminadas');

    // Insertar nuevas preguntas usando la función exportada
    await insert62Questions();

    // Verificar conteo
    const total = await Question.count();
    const riasecCount = await Question.count({ where: { category: 'RIASEC' } });
    const gardnerCount = await Question.count({ where: { category: 'Gardner' } });

    console.log('\n📊 Resumen:');
    console.log(`   Total de preguntas: ${total}`);
    console.log(`   RIASEC (R,I,A,S,E,C): ${riasecCount} (6 dimensiones × 5 preguntas)`);
    console.log(`   Gardner (LM,L,ES,M,CK,IP,IA,N): ${gardnerCount} (8 dimensiones × 4 preguntas)`);

    // Verificar que no hay preguntas de Rendimiento
    const rendimientoCount = await Question.count({ where: { category: 'Rendimiento' } });
    if (rendimientoCount === 0) {
      console.log('✅ Confirmado: No hay preguntas de Rendimiento');
    } else {
      console.warn(`⚠️  Advertencia: Se encontraron ${rendimientoCount} preguntas de Rendimiento`);
    }

    console.log('\n✅ Actualización completada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al actualizar preguntas:', error);
    process.exit(1);
  }
}

updateQuestions();
