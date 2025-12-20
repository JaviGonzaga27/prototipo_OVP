import { Question } from '../models/index.js';
import sequelize from '../config/database.js';

// Lista simplificada de 62 preguntas (solo texto, categoría y dimensión)
const questionTexts = [
  // RIASEC - Realista (R) - 5 preguntas
  { text: '¿Te ves trabajando en obras de construcción, usando cascos y herramientas eléctricas?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Te atrae la idea de armar y mantener máquinas o sistemas mecánicos (autos, aires acondicionados, etc.)?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Te imaginas trabajando al aire libre, como en granjas, bosques o minas?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Disfrutas haciendo manualidades o trabajos con madera, metal o textiles?', category: 'RIASEC', dimension: 'R' },
  { text: '¿Preferirías un trabajo donde uses tu cuerpo y tus manos más que una oficina?', category: 'RIASEC', dimension: 'R' },
  
  // RIASEC - Investigativo (I) - 5 preguntas
  { text: '¿Te gusta investigar sobre cómo funcionan las cosas o resolver problemas científicos?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Te atrae la idea de trabajar en un laboratorio haciendo experimentos?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Te interesa analizar datos, estadísticas o resultados de investigaciones?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Disfrutas resolviendo problemas complejos que requieren pensamiento lógico?', category: 'RIASEC', dimension: 'I' },
  { text: '¿Te atrae la idea de desarrollar nuevas teorías o descubrir información desconocida?', category: 'RIASEC', dimension: 'I' },
  
  // RIASEC - Artístico (A) - 5 preguntas
  { text: '¿Te imaginas diseñando espacios, edificios o interiores (arquitectura, diseño de interiores)?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Te gusta crear contenido visual como ilustraciones, videos o diseño gráfico?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Te atrae la idea de trabajar en teatro, cine, música o artes escénicas?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Disfrutas escribiendo historias, poemas o artículos creativos?', category: 'RIASEC', dimension: 'A' },
  { text: '¿Preferirías trabajar en un ambiente donde puedas expresarte de forma creativa sin muchas reglas?', category: 'RIASEC', dimension: 'A' },
  
  // RIASEC - Social (S) - 5 preguntas
  { text: '¿Te ves trabajando como maestro, educando a niños o jóvenes?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Te atrae ayudar a personas con problemas emocionales o de salud (psicología, enfermería)?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Te gusta trabajar en proyectos comunitarios o ayudar a grupos vulnerables?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Disfrutas aconsejando o guiando a otras personas para resolver sus problemas?', category: 'RIASEC', dimension: 'S' },
  { text: '¿Preferirías un trabajo donde tu principal tarea sea ayudar o servir a otros?', category: 'RIASEC', dimension: 'S' },
  
  // RIASEC - Emprendedor (E) - 5 preguntas
  { text: '¿Te imaginas liderando un equipo de trabajo o dirigiendo un proyecto importante?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Te atrae la idea de crear tu propio negocio o ser emprendedor?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Te gusta persuadir a otros o hacer presentaciones para vender ideas o productos?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Disfrutas tomar decisiones importantes que afectan el rumbo de un proyecto u organización?', category: 'RIASEC', dimension: 'E' },
  { text: '¿Preferirías un ambiente competitivo donde puedas destacar y alcanzar metas ambiciosas?', category: 'RIASEC', dimension: 'E' },
  
  // RIASEC - Convencional (C) - 5 preguntas
  { text: '¿Te ves trabajando con números, registros financieros o contabilidad?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Te atrae organizar archivos, documentos o bases de datos de forma ordenada?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Te gusta seguir procedimientos establecidos y trabajar con reglas claras?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Disfrutas hacer tareas detalladas que requieren precisión y atención?', category: 'RIASEC', dimension: 'C' },
  { text: '¿Preferirías un trabajo estable con tareas predecibles y bien estructuradas?', category: 'RIASEC', dimension: 'C' },
  
  // Gardner - Lógico-Matemática (LM) - 4 preguntas
  { text: '¿Te gusta resolver problemas matemáticos complejos o trabajar con cálculos?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Te atrae entender fórmulas, algoritmos o sistemas lógicos?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Disfrutas encontrar patrones o relaciones en datos numéricos?', category: 'Gardner', dimension: 'LM' },
  { text: '¿Te consideras bueno/a en matemáticas y ciencias exactas?', category: 'Gardner', dimension: 'LM' },
  
  // Gardner - Lingüística (L) - 4 preguntas
  { text: '¿Te gusta leer libros, artículos o ensayos extensos?', category: 'Gardner', dimension: 'L' },
  { text: '¿Te atrae escribir textos, historias o comunicar ideas con palabras?', category: 'Gardner', dimension: 'L' },
  { text: '¿Disfrutas aprender nuevos idiomas o estudiar gramática y vocabulario?', category: 'Gardner', dimension: 'L' },
  { text: '¿Te consideras bueno/a para expresarte verbalmente y persuadir con palabras?', category: 'Gardner', dimension: 'L' },
  
  // Gardner - Espacial (ES) - 4 preguntas
  { text: '¿Te gusta visualizar cómo se vería un objeto en 3D o desde diferentes ángulos?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Te atrae diseñar planos, mapas o diagramas técnicos?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Disfrutas trabajando con diseño gráfico, modelado 3D o arquitectura?', category: 'Gardner', dimension: 'ES' },
  { text: '¿Te consideras bueno/a para imaginar espacios y formas en tu mente?', category: 'Gardner', dimension: 'ES' },
  
  // Gardner - Musical (M) - 4 preguntas
  { text: '¿Te gusta tocar instrumentos musicales o crear música?', category: 'Gardner', dimension: 'M' },
  { text: '¿Te atrae componer canciones, melodías o producir audio?', category: 'Gardner', dimension: 'M' },
  { text: '¿Disfrutas cantar o expresarte a través de la música?', category: 'Gardner', dimension: 'M' },
  { text: '¿Te consideras sensible a ritmos, tonos y armonías musicales?', category: 'Gardner', dimension: 'M' },
  
  // Gardner - Corporal-Kinestésica (CK) - 4 preguntas
  { text: '¿Te gusta practicar deportes o actividades físicas de forma regular?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Te atrae bailar, actuar o expresarte con movimientos corporales?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Disfrutas trabajando con tus manos en tareas que requieren coordinación?', category: 'Gardner', dimension: 'CK' },
  { text: '¿Te consideras ágil y coordinado/a en actividades físicas?', category: 'Gardner', dimension: 'CK' },
  
  // Gardner - Interpersonal (IP) - 4 preguntas
  { text: '¿Te gusta trabajar en equipo y colaborar con otras personas?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Te atrae entender las emociones y necesidades de los demás?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Disfrutas mediar en conflictos o ayudar a que las personas se entiendan?', category: 'Gardner', dimension: 'IP' },
  { text: '¿Te consideras bueno/a para conectar con personas y hacer amistades?', category: 'Gardner', dimension: 'IP' },
  
  // Gardner - Intrapersonal (IA) - 4 preguntas
  { text: '¿Te gusta reflexionar sobre tus propias emociones y pensamientos?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Te atrae conocerte mejor a ti mismo/a y entender tu propósito de vida?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Disfrutas estableciendo metas personales y trabajando en tu desarrollo?', category: 'Gardner', dimension: 'IA' },
  { text: '¿Te consideras consciente de tus fortalezas y debilidades?', category: 'Gardner', dimension: 'IA' },
  
  // Gardner - Naturalista (N) - 4 preguntas
  { text: '¿Te gusta observar la naturaleza, plantas o animales?', category: 'Gardner', dimension: 'N' },
  { text: '¿Te atrae estudiar biología, ecología o ciencias ambientales?', category: 'Gardner', dimension: 'N' },
  { text: '¿Disfrutas actividades al aire libre como camping, senderismo o jardinería?', category: 'Gardner', dimension: 'N' },
  { text: '¿Te consideras sensible al medio ambiente y a la conservación de la naturaleza?', category: 'Gardner', dimension: 'N' }
];

async function updateQuestions() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Opciones estándar para todas las preguntas (escala Likert 1-5)
    const standardOptions = [
      { value: 1, label: 'Para nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Bastante' },
      { value: 5, label: 'Mucho' }
    ];

    // Eliminar todas las preguntas existentes
    console.log('🗑️  Eliminando preguntas antiguas...');
    await Question.destroy({ where: {}, truncate: true });
    console.log('✅ Preguntas antiguas eliminadas');

    // Insertar nuevas preguntas
    console.log('📝 Insertando 62 nuevas preguntas...');
    for (let i = 0; i < questionTexts.length; i++) {
      const questionData = questionTexts[i];
      await Question.create({
        questionNumber: i + 1,
        text: questionData.text,
        category: questionData.category,
        dimension: questionData.dimension,
        options: standardOptions,
        order: i + 1,
        isActive: true
      });
    }
    console.log('✅ 62 preguntas insertadas correctamente');

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
