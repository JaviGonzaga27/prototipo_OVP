import sequelize from '../config/database.js';
import Question from '../models/Question.js';

const questions = [
  // ============================================================================
  // SECCIÓN 1: RIASEC (30 preguntas = 6 dimensiones × 5 preguntas)
  // ============================================================================
  
  // R - REALISTA (5 preguntas)
  {
    text: '¿Te gusta trabajar con herramientas, máquinas o equipos?',
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
    text: '¿Prefieres actividades al aire libre o trabajos físicos?',
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
    text: '¿Te interesa construir, reparar o ensamblar cosas?',
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
    text: '¿Disfrutas trabajando con materiales concretos?',
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
    text: '¿Prefieres resolver problemas de forma práctica?',
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
    text: '¿Te gusta analizar datos o problemas complejos?',
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
    text: '¿Disfrutas realizar experimentos científicos?',
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
    text: '¿Te interesa entender cómo funcionan las cosas?',
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
    text: '¿Prefieres trabajar con conceptos abstractos?',
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
    text: '¿Te motiva resolver problemas con lógica?',
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
    text: '¿Te gusta expresarte a través del arte o música?',
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
    text: '¿Disfrutas diseñar o crear cosas?',
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
    text: '¿Prefieres trabajos creativos y originales?',
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
    text: '¿Te interesa la estética y diseño?',
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
    text: '¿Te motiva trabajar en proyectos artísticos?',
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
    text: '¿Te gusta ayudar a otras personas?',
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
    text: '¿Disfrutas enseñar o capacitar a otros?',
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
    text: '¿Prefieres trabajar en equipo?',
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
    text: '¿Te interesa el bienestar de las personas?',
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
    text: '¿Te motiva el servicio comunitario?',
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
    text: '¿Te gusta liderar grupos o proyectos?',
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
    text: '¿Disfrutas persuadir a otras personas?',
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
    text: '¿Prefieres tomar decisiones y asumir riesgos?',
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
    text: '¿Te interesa iniciar tu propio negocio?',
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
    text: '¿Te motiva competir y alcanzar metas?',
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
    text: '¿Te gusta organizar información o documentos?',
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
    text: '¿Disfrutas seguir procedimientos establecidos?',
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
    text: '¿Prefieres trabajos que requieren precisión?',
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
    text: '¿Te interesa trabajar con números y datos?',
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
    text: '¿Te motiva mantener sistemas ordenados?',
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
  // SECCIÓN 2: GARDNER (32 preguntas = 8 dimensiones × 4 preguntas)
  // ============================================================================

  // LM - LÓGICO-MATEMÁTICA (4 preguntas)
  {
    text: '¿Entiendes fácilmente conceptos matemáticos?',
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
    text: '¿Te gusta resolver problemas de lógica?',
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
    text: '¿Eres bueno identificando patrones?',
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
    text: '¿Disfrutas trabajando con cálculos?',
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

  // L - LINGÜÍSTICA (4 preguntas)
  {
    text: '¿Se te facilita expresarte con palabras?',
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
    text: '¿Disfrutas leer, escribir o debatir?',
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
    text: '¿Tienes buen vocabulario?',
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
    text: '¿Te gusta contar historias?',
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

  // ES - ESPACIAL (4 preguntas)
  {
    text: '¿Visualizas fácilmente objetos en 3D?',
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
    text: '¿Te orientas bien en espacios?',
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
    text: '¿Eres bueno dibujando o diseñando?',
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
    text: '¿Disfrutas trabajar con imágenes?',
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

  // M - MUSICAL (4 preguntas)
  {
    text: '¿Tienes buen sentido del ritmo?',
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
    text: '¿Disfrutas la música?',
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
    text: '¿Reconoces fácilmente tonos musicales?',
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
    text: '¿Te expresas mejor con música?',
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

  // CK - CORPORAL-KINESTÉSICA (4 preguntas)
  {
    text: '¿Tienes buena coordinación corporal?',
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
    text: '¿Disfrutas actividades físicas?',
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
    text: '¿Aprendes mejor haciendo?',
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
    text: '¿Eres hábil con manualidades?',
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

  // IP - INTERPERSONAL (4 preguntas)
  {
    text: '¿Entiendes las emociones de otros?',
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
    text: '¿Disfrutas trabajar en equipo?',
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
    text: '¿Eres bueno resolviendo conflictos?',
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
    text: '¿Te adaptas a diferentes personalidades?',
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

  // IA - INTRAPERSONAL (4 preguntas)
  {
    text: '¿Conoces bien tus emociones?',
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
    text: '¿Prefieres trabajar independientemente?',
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
    text: '¿Reflexionas sobre tus metas?',
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
    text: '¿Eres autodisciplinado?',
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

  // N - NATURALISTA (4 preguntas)
  {
    text: '¿Te interesa la naturaleza?',
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
    text: '¿Disfrutas actividades al aire libre?',
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
    text: '¿Reconoces elementos naturales?',
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
    text: '¿Te preocupa el medio ambiente?',
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
    text: '¿Cómo calificarías tu rendimiento académico general?',
    options: [
      { value: 1, label: 'Deficiente' },
      { value: 2, label: 'Regular' },
      { value: 3, label: 'Bueno' },
      { value: 4, label: 'Muy Bueno' },
      { value: 5, label: 'Sobresaliente' }
    ],
    category: 'Rendimiento',
    dimension: 'General',
    order: 63,
    isActive: true,
    scaleLabels: {
      1: 'Deficiente',
      2: 'Regular',
      3: 'Bueno',
      4: 'Muy Bueno',
      5: 'Sobresaliente'
    }
  },
  {
    text: '¿Cómo es tu rendimiento en Matemáticas/Ciencias?',
    options: [
      { value: 1, label: 'Deficiente' },
      { value: 2, label: 'Regular' },
      { value: 3, label: 'Bueno' },
      { value: 4, label: 'Muy Bueno' },
      { value: 5, label: 'Sobresaliente' }
    ],
    category: 'Rendimiento',
    dimension: 'STEM',
    order: 64,
    isActive: true,
    scaleLabels: {
      1: 'Deficiente',
      2: 'Regular',
      3: 'Bueno',
      4: 'Muy Bueno',
      5: 'Sobresaliente'
    }
  },
  {
    text: '¿Cómo es tu rendimiento en Lengua/Historia/Filosofía?',
    options: [
      { value: 1, label: 'Deficiente' },
      { value: 2, label: 'Regular' },
      { value: 3, label: 'Bueno' },
      { value: 4, label: 'Muy Bueno' },
      { value: 5, label: 'Sobresaliente' }
    ],
    category: 'Rendimiento',
    dimension: 'Humanidades',
    order: 65,
    isActive: true,
    scaleLabels: {
      1: 'Deficiente',
      2: 'Regular',
      3: 'Bueno',
      4: 'Muy Bueno',
      5: 'Sobresaliente'
    }
  }
];

async function populateQuestions() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    console.log('🔄 Sincronizando modelo Question...');
    await Question.sync({ alter: true });
    console.log('✅ Modelo sincronizado');

    console.log('🗑️  Limpiando preguntas existentes...');
    await Question.destroy({ where: {}, truncate: true });
    console.log('✅ Preguntas existentes eliminadas');

    console.log('📝 Insertando 65 preguntas del test vocacional...');
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
    console.log(`   RIASEC: ${riasecCount} preguntas`);
    console.log(`   Gardner: ${gardnerCount} preguntas`);
    console.log(`   Rendimiento: ${rendimientoCount} preguntas`);

    console.log('\n✨ Proceso completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar preguntas:', error);
    process.exit(1);
  }
}

populateQuestions();
