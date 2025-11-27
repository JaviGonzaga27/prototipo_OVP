import sequelize from '../config/database.js';
import Question from '../models/Question.js';

const questions = [
  // ============================================================================
  // SECCIÓN 1: RIASEC (30 preguntas = 6 dimensiones × 5 preguntas)
  // ============================================================================
  
  // R - REALISTA (5 preguntas)
  {
    text: '¿Te gusta reparar o arreglar cosas cuando se dañan?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'R',
    order: 1,
    isActive: true,
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      1: 'Nada (No me interesa en absoluto)',
      2: 'Poco (Me interesa ligeramente)',
      3: 'Moderado (Me interesa en nivel medio)',
      4: 'Mucho (Me interesa bastante)',
      5: 'Totalmente (Me apasiona)'
    }
  },
  {
    text: '¿Prefieres hacer proyectos prácticos como sembrar plantas o construir algo en tecnología?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'R',
    order: 2,
    isActive: true
  },
  {
    text: '¿Disfrutas las clases en laboratorios o talleres donde usas materiales y herramientas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'R',
    order: 3,
    isActive: true
  },
  {
    text: '¿Sientes satisfacción al ayudar en actividades físicas, como deportes o proyectos de limpieza en tu barrio?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'R',
    order: 4,
    isActive: true
  },
  {
    text: '¿Te interesaría trabajar en profesiones técnicas, agrícolas o mecánicas en el futuro?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'R',
    order: 5,
    isActive: true
  },

  // I - INVESTIGATIVO (5 preguntas)
  {
    text: '¿Te gusta investigar temas nuevos para tus tareas o proyectos escolares?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'I',
    order: 6,
    isActive: true
  },
  {
    text: '¿Disfrutas experimentar en clase de ciencias, buscando cómo y por qué ocurren cosas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'I',
    order: 7,
    isActive: true
  },
  {
    text: '¿Prefieres analizar y resolver problemas matemáticos o científicos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'I',
    order: 8,
    isActive: true
  },
  {
    text: '¿Te interesa ver documentales sobre ciencia, tecnología o descubrimientos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'I',
    order: 9,
    isActive: true
  },
  {
    text: '¿Te gustaría seguir carreras como medicina, ingeniería, informática o investigación científica?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'I',
    order: 10,
    isActive: true
  },

  // A - ARTÍSTICO (5 preguntas)
  {
    text: '¿Te gusta participar en obras de teatro, festivales musicales o concursos artísticos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'A',
    order: 11,
    isActive: true
  },
  {
    text: '¿Prefieres trabajos creativos, como diseñar carteles, pintar o inventar historias?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'A',
    order: 12,
    isActive: true
  },
  {
    text: '¿Te gusta crear tus propios proyectos artísticos, musicales o audiovisuales?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'A',
    order: 13,
    isActive: true
  },
  {
    text: '¿Disfrutas expresar tus ideas y emociones a través del arte, la música o la escritura?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'A',
    order: 14,
    isActive: true
  },
  {
    text: '¿Te interesaría estudiar diseño, arquitectura, música, actuación o literatura?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'A',
    order: 15,
    isActive: true
  },

  // S - SOCIAL (5 preguntas)
  {
    text: '¿Te gusta ayudar a tus compañeros, apoyar a quienes tienen dificultades, o participar en voluntariados escolares?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'S',
    order: 16,
    isActive: true
  },
  {
    text: '¿Disfrutas dar tutorías, explicar tareas o motivar a otros en tu grupo?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'S',
    order: 17,
    isActive: true
  },
  {
    text: '¿Prefieres actividades donde puedes colaborar y convivir con personas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'S',
    order: 18,
    isActive: true
  },
  {
    text: '¿Te gusta organizar campañas de ayuda social, convivencias o eventos en tu colegio?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'S',
    order: 19,
    isActive: true
  },
  {
    text: '¿Te interesan carreras como pedagogía, psicología, trabajo social o enfermería?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'S',
    order: 20,
    isActive: true
  },

  // E - EMPRENDEDOR (5 preguntas)
  {
    text: '¿Te inspiran a liderar proyectos estudiantiles, grupos de clase o actividades deportivas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'E',
    order: 21,
    isActive: true
  },
  {
    text: '¿Te gusta organizar ventas escolares, ferias, o campañas para recolectar fondos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'E',
    order: 22,
    isActive: true
  },
  {
    text: '¿Prefieres tomar decisiones rápidas y proponer ideas en reuniones estudiantiles?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'E',
    order: 23,
    isActive: true
  },
  {
    text: '¿Disfrutas negociar y convencer a otros cuando tienes una meta?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'E',
    order: 24,
    isActive: true
  },
  {
    text: '¿Visualizas tener un negocio, ser líder comunitario o trabajar en marketing en el futuro?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'E',
    order: 25,
    isActive: true
  },

  // C - CONVENCIONAL (5 preguntas)
  {
    text: '¿Te resulta fácil ordenar tus cuadernos, trabajos y materiales escolares?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'C',
    order: 26,
    isActive: true
  },
  {
    text: '¿Prefieres seguir instrucciones claras en tus clases o proyectos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'C',
    order: 27,
    isActive: true
  },
  {
    text: '¿Te motiva participar en actividades administrativas, como ser secretario en el consejo estudiantil?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'C',
    order: 28,
    isActive: true
  },
  {
    text: '¿Disfrutas tareas donde puedas organizar información, datos o documentos de manera precisa?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'C',
    order: 29,
    isActive: true
  },
  {
    text: '¿Te gustaría trabajar en oficinas, bancos, instituciones públicas o contabilidad?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'RIASEC',
    dimension: 'C',
    order: 30,
    isActive: true
  },

  // ============================================================================
  // SECCIÓN 2: GARDNER (32 preguntas = 8 inteligencias × 4 preguntas)
  // ============================================================================

  // LM - Lógico-Matemática (4 preguntas)
  {
    text: '¿Resuelves rápidamente ejercicios de matemáticas o acertijos en clase?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'LM',
    order: 31,
    isActive: true
  },
  {
    text: '¿Te gusta analizar problemas y buscar soluciones utilizando lógica?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'LM',
    order: 32,
    isActive: true
  },
  {
    text: '¿Te interesan actividades como concursos matemáticos, feria de ciencias o juegos de estrategia?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'LM',
    order: 33,
    isActive: true
  },
  {
    text: '¿Sientes curiosidad al ver noticias sobre tecnología, ciencias o inventos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'LM',
    order: 34,
    isActive: true
  },

  // L - Lingüística (4 preguntas)
  {
    text: '¿Te resulta fácil escribir cuentos, mensajes o reflexiones?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'L',
    order: 35,
    isActive: true
  },
  {
    text: '¿Disfrutas leer novelas, revistas o publicaciones?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'L',
    order: 36,
    isActive: true
  },
  {
    text: '¿Te gusta participar en debates, exposiciones o leer en voz alta en clase?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'L',
    order: 37,
    isActive: true
  },
  {
    text: '¿Te identificas expresando tus ideas con precisión al conversar con tus compañeros o familiares?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'L',
    order: 38,
    isActive: true
  },

  // ES - Espacial (4 preguntas)
  {
    text: '¿Disfrutas dibujar paisajes, mapas, planos o figuras geométricas visibles en tu entorno?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'ES',
    order: 39,
    isActive: true
  },
  {
    text: '¿Te motiva crear diseños para campañas escolares, redes sociales o instituciones del barrio?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'ES',
    order: 40,
    isActive: true
  },
  {
    text: '¿Imaginas cómo cambiaría un objeto si lo modificas o miras desde otro ángulo?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'ES',
    order: 41,
    isActive: true
  },
  {
    text: '¿Armas fácilmente rompecabezas o modelos tridimensionales?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'ES',
    order: 42,
    isActive: true
  },

  // M - Musical (4 preguntas)
  {
    text: '¿Te gusta cantar o participar en actividades musicales?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'M',
    order: 43,
    isActive: true
  },
  {
    text: '¿Identificas fácilmente ritmos y melodías en la música?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'M',
    order: 44,
    isActive: true
  },
  {
    text: '¿Te interesa tocar instrumentos o crear tu propia música?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'M',
    order: 45,
    isActive: true
  },
  {
    text: '¿Reconoces fácilmente diferentes géneros musicales?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'M',
    order: 46,
    isActive: true
  },

  // CK - Corporal-Kinestésica (4 preguntas)
  {
    text: '¿Te gustan los deportes, el baile o actividades físicas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'CK',
    order: 47,
    isActive: true
  },
  {
    text: '¿Aprendes mejor haciendo experimentos, manualidades o tareas prácticas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'CK',
    order: 48,
    isActive: true
  },
  {
    text: '¿Te gusta participar en actividades recreativas, deportes intercolegiales o campeonatos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'CK',
    order: 49,
    isActive: true
  },
  {
    text: '¿Tienes habilidad para expresar ideas mediante movimientos o gestos en presentaciones escolares?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'CK',
    order: 50,
    isActive: true
  },

  // IP - Interpersonal (4 preguntas)
  {
    text: '¿Colaboras activamente en grupo, creando buen ambiente entre compañeros y profesores?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IP',
    order: 51,
    isActive: true
  },
  {
    text: '¿Facilitas la solución de conflictos y apoyas a quienes se sienten solos en tu clase?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IP',
    order: 52,
    isActive: true
  },
  {
    text: '¿Te motiva ayudar a organizar eventos, fiestas escolares o proyectos comunitarios?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IP',
    order: 53,
    isActive: true
  },
  {
    text: '¿Comprendes bien las emociones y necesidades de las personas a tu alrededor?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IP',
    order: 54,
    isActive: true
  },

  // IA - Intrapersonal (4 preguntas)
  {
    text: '¿Reflexionas sobre tus metas personales y sueños para el futuro?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IA',
    order: 55,
    isActive: true
  },
  {
    text: '¿Analizas tus propias fortalezas y debilidades al decidir qué estudiar o en qué participar?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IA',
    order: 56,
    isActive: true
  },
  {
    text: '¿Prefieres a veces trabajar solo y tomarte tiempo para pensar en tus decisiones?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IA',
    order: 57,
    isActive: true
  },
  {
    text: '¿Buscas mejorar personalmente en actividades extracurriculares o académicas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'IA',
    order: 58,
    isActive: true
  },

  // N - Naturalista (4 preguntas)
  {
    text: '¿Te interesa conocer sobre la biodiversidad, animales y plantas?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'N',
    order: 59,
    isActive: true
  },
  {
    text: '¿Participas en proyectos de reciclaje, cuidado ambiental o excursiones?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'N',
    order: 60,
    isActive: true
  },
  {
    text: '¿Reconoces fácilmente tipos de flora y fauna?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'N',
    order: 61,
    isActive: true
  },
  {
    text: '¿Te preocupa el futuro del ambiente y promueves hábitos ecológicos entre tus amigos?',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Poco' },
      { value: 3, label: 'Moderado' },
      { value: 4, label: 'Mucho' },
      { value: 5, label: 'Totalmente' }
    ],
    category: 'Gardner',
    dimension: 'N',
    order: 62,
    isActive: true
  },

  // ============================================================================
  // SECCIÓN 3: RENDIMIENTO ACADÉMICO (3 preguntas)
  // ============================================================================

  {
    text: '¿Cómo calificarías tu desempeño global en todas las materias escolares este año?',
    options: [
      { value: 1, label: 'Muy bajo' },
      { value: 2, label: 'Bajo' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Bueno' },
      { value: 5, label: 'Excelente' }
    ],
    category: 'Rendimiento',
    dimension: 'General',
    order: 63,
    isActive: true
  },
  {
    text: '¿Cómo consideras tu rendimiento en Matemáticas, Física, Química o Biología durante el colegio?',
    options: [
      { value: 1, label: 'Muy bajo' },
      { value: 2, label: 'Bajo' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Bueno' },
      { value: 5, label: 'Excelente' }
    ],
    category: 'Rendimiento',
    dimension: 'STEM',
    order: 64,
    isActive: true
  },
  {
    text: '¿Cómo evaluarías tu rendimiento en Lengua, Literatura, Historia o Filosofía en tus clases?',
    options: [
      { value: 1, label: 'Muy bajo' },
      { value: 2, label: 'Bajo' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Bueno' },
      { value: 5, label: 'Excelente' }
    ],
    category: 'Rendimiento',
    dimension: 'Humanidades',
    order: 65,
    isActive: true
  }
];

async function populateQuestions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Sincronizar modelo
    await Question.sync();

    // Limpiar preguntas existentes
    console.log('🗑️  Eliminando preguntas existentes...');
    await Question.destroy({ where: {}, truncate: true });
    console.log('✅ Preguntas existentes eliminadas');

    console.log('📝 Insertando 65 preguntas del test vocacional (versión mejorada)...');
    await Question.bulkCreate(questions);
    console.log('✅ 65 preguntas insertadas correctamente');

    // Verificar inserción
    const count = await Question.count();
    console.log(`\n📊 Total de preguntas en la base de datos: ${count}`);

    // Mostrar resumen por categoría
    const riasecCount = await Question.count({ where: { category: 'RIASEC' } });
    const gardnerCount = await Question.count({ where: { category: 'Gardner' } });
    const rendimientoCount = await Question.count({ where: { category: 'Rendimiento' } });

    console.log('\n📈 RESUMEN POR CATEGORÍA:');
    console.log(`   RIASEC: ${riasecCount} preguntas (6 dimensiones × 5 preguntas)`);
    console.log(`   Gardner: ${gardnerCount} preguntas (8 inteligencias × 4 preguntas)`);
    console.log(`   Rendimiento: ${rendimientoCount} preguntas`);

    console.log('\n✨ Proceso completado exitosamente');
    console.log('\n📋 NOTA: Las preguntas han sido actualizadas con formulación mejorada');
    console.log('   orientada a estudiantes de bachillerato en contexto escolar.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar preguntas:', error);
    process.exit(1);
  }
}

populateQuestions();
