// src/constants/questions.js

export const questions = [
  {
    // 1. Solventar problemas contables y financieros, controlar presupuestos y contabilidad.
    text: "Solventar problemas contables y financieros, controlar presupuestos y contabilidad.",
    options: [
      { text: "Me gusta",               categories: { negocios: 5, administracion: 4 } },
      { text: "Tengo dudas",           categories: { negocios: 3, administracion: 2 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0 } }
    ]
  },
  {
    // 2. Trabajar en un banco o caja postal.
    text: "Trabajar en un banco o caja postal.",
    options: [
      { text: "Me gusta",               categories: { negocios: 5, administracion: 4 } },
      { text: "Tengo dudas",           categories: { negocios: 3, administracion: 2 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0 } }
    ]
  },
  {
    // 3. Realizar programas de gestión empresarial.
    text: "Realizar programas de gestión empresarial.",
    options: [
      { text: "Me gusta",               categories: { negocios: 5, administracion: 5 } },
      { text: "Tengo dudas",           categories: { negocios: 3, administracion: 3 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0 } }
    ]
  },
  {
    // 4. Contratar pólizas de seguros. Entrevistarse con el cliente para averiguar la clase de seguro que necesita.
    text: "Contratar pólizas de seguros. Entrevistarse con el cliente para averiguar la clase de seguro que necesita.",
    options: [
      { text: "Me gusta",               categories: { negocios: 5, administracion: 4, comunicacion: 3 } },
      { text: "Tengo dudas",           categories: { negocios: 3, administracion: 2, comunicacion: 2 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0, comunicacion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0, comunicacion: 0 } }
    ]
  },
  {
    // 5. Trabajar ordenando, clasificando y archivando documentos.
    text: "Trabajar ordenando, clasificando y archivando documentos.",
    options: [
      { text: "Me gusta",               categories: { administracion: 5 } },
      { text: "Tengo dudas",           categories: { administracion: 3 } },
      { text: "No me gusta",           categories: { administracion: 0 } },
      { text: "No conozco esa actividad", categories: { administracion: 0 } }
    ]
  },
  {
    // 6. Ejercer de sociólogo.
    text: "Ejercer de sociólogo.",
    options: [
      { text: "Me gusta",               categories: { humanidades: 5, educacion: 4 } },
      { text: "Tengo dudas",           categories: { humanidades: 3, educacion: 2 } },
      { text: "No me gusta",           categories: { humanidades: 0, educacion: 0 } },
      { text: "No conozco esa actividad", categories: { humanidades: 0, educacion: 0 } }
    ]
  },
  {
    // 7. Trabajar como notario.
    text: "Trabajar como notario.",
    options: [
      { text: "Me gusta",               categories: { legal: 5, administracion: 3 } },
      { text: "Tengo dudas",           categories: { legal: 3, administracion: 2 } },
      { text: "No me gusta",           categories: { legal: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { legal: 0, administracion: 0 } }
    ]
  },
  {
    // 8. Trabajar como auditor.
    text: "Trabajar como auditor.",
    options: [
      { text: "Me gusta",               categories: { negocios: 5, administracion: 4 } },
      { text: "Tengo dudas",           categories: { negocios: 3, administracion: 2 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0 } }
    ]
  },
  {
    // 9. Organizar y controlar la recepción, almacenamiento y expedición de mercancías, anotando las entradas y las salidas.
    text: "Organizar y controlar la recepción, almacenamiento y expedición de mercancías, anotando las entradas y las salidas.",
    options: [
      { text: "Me gusta",               categories: { administracion: 5, negocios: 4 } },
      { text: "Tengo dudas",           categories: { administracion: 3, negocios: 2 } },
      { text: "No me gusta",           categories: { administracion: 0, negocios: 0 } },
      { text: "No conozco esa actividad", categories: { administracion: 0, negocios: 0 } }
    ]
  },
  {
    // 10. Realizar trabajos de oficina, manejando ordenadores, teléfonos, fotocopiadoras, etc.
    text: "Realizar trabajos de oficina, manejando ordenadores, teléfonos, fotocopiadoras, etc.",
    options: [
      { text: "Me gusta",               categories: { administracion: 5, tecnologia: 3 } },
      { text: "Tengo dudas",           categories: { administracion: 3, tecnologia: 2 } },
      { text: "No me gusta",           categories: { administracion: 0, tecnologia: 0 } },
      { text: "No conozco esa actividad", categories: { administracion: 0, tecnologia: 0 } }
    ]
  },
  {
    // 11. Diseñar prendas de vestir, complementos y/o joyas.
    text: "Diseñar prendas de vestir, complementos y/o joyas.",
    options: [
      { text: "Me gusta",               categories: { diseño: 5, arte: 4, comunicacion: 3 } },
      { text: "Tengo dudas",           categories: { diseño: 3, arte: 2, comunicacion: 2 } },
      { text: "No me gusta",           categories: { diseño: 0, arte: 0, comunicacion: 0 } },
      { text: "No conozco esa actividad", categories: { diseño: 0, arte: 0, comunicacion: 0 } }
    ]
  },
  {
    // 12. Trabajar de publicista.
    text: "Trabajar de publicista.",
    options: [
      { text: "Me gusta",               categories: { comunicacion: 5, negocios: 4 } },
      { text: "Tengo dudas",           categories: { comunicacion: 3, negocios: 2 } },
      { text: "No me gusta",           categories: { comunicacion: 0, negocios: 0 } },
      { text: "No conozco esa actividad", categories: { comunicacion: 0, negocios: 0 } }
    ]
  },
  {
    // 13. Ejercer como profesor de deporte.
    text: "Ejercer como profesor de deporte.",
    options: [
      { text: "Me gusta",               categories: { deporte: 5, educacion: 4 } },
      { text: "Tengo dudas",           categories: { deporte: 3, educacion: 2 } },
      { text: "No me gusta",           categories: { deporte: 0, educacion: 0 } },
      { text: "No conozco esa actividad", categories: { deporte: 0, educacion: 0 } }
    ]
  },
  {
    // 14. Estudiar la vida vegetal (árboles y plantas). Hacer experimentos con los cultivos.
    text: "Estudiar la vida vegetal (árboles y plantas). Hacer experimentos con los cultivos.",
    options: [
      { text: "Me gusta",               categories: { ciencias: 5, investigacion: 4 } },
      { text: "Tengo dudas",           categories: { ciencias: 3, investigacion: 2 } },
      { text: "No me gusta",           categories: { ciencias: 0, investigacion: 0 } },
      { text: "No conozco esa actividad", categories: { ciencias: 0, investigacion: 0 } }
    ]
  },
  {
    // 15. Elaborar programas para ordenador. Aplicar la informática para analizar necesidades y problemas.
    text: "Elaborar programas para ordenador. Aplicar la informática para analizar necesidades y problemas.",
    options: [
      { text: "Me gusta",               categories: { tecnologia: 5, ingenieria: 4, ciencias: 3 } },
      { text: "Tengo dudas",           categories: { tecnologia: 3, ingenieria: 2, ciencias: 2 } },
      { text: "No me gusta",           categories: { tecnologia: 0, ingenieria: 0, ciencias: 0 } },
      { text: "No conozco esa actividad", categories: { tecnologia: 0, ingenieria: 0, ciencias: 0 } }
    ]
  },
  {
    // 16. Trabajar de decorador.
    text: "Trabajar de decorador.",
    options: [
      { text: "Me gusta",               categories: { diseño: 5, arte: 4, comunicacion: 3 } },
      { text: "Tengo dudas",           categories: { diseño: 3, arte: 2, comunicacion: 2 } },
      { text: "No me gusta",           categories: { diseño: 0, arte: 0, comunicacion: 0 } },
      { text: "No conozco esa actividad", categories: { diseño: 0, arte: 0, comunicacion: 0 } }
    ]
  },
  {
    // 17. Ser actor profesional, realizando representaciones teatrales, rodajes de cine o televisión.
    text: "Ser actor profesional, realizando representaciones teatrales, rodajes de cine o televisión.",
    options: [
      { text: "Me gusta",               categories: { arte: 5, comunicacion: 4 } },
      { text: "Tengo dudas",           categories: { arte: 3, comunicacion: 2 } },
      { text: "No me gusta",           categories: { arte: 0, comunicacion: 0 } },
      { text: "No conozco esa actividad", categories: { arte: 0, comunicacion: 0 } }
    ]
  },
  {
    // 18. Ser bailarín.
    text: "Ser bailarín.",
    options: [
      { text: "Me gusta",               categories: { arte: 5, comunicacion: 4 } },
      { text: "Tengo dudas",           categories: { arte: 3, comunicacion: 2 } },
      { text: "No me gusta",           categories: { arte: 0, comunicacion: 0 } },
      { text: "No conozco esa actividad", categories: { arte: 0, comunicacion: 0 } }
    ]
  },
  {
    // 19. Trabajar como director de escuela.
    text: "Trabajar como director de escuela.",
    options: [
      { text: "Me gusta",               categories: { educacion: 5, liderazgo: 4, administracion: 3 } },
      { text: "Tengo dudas",           categories: { educacion: 3, liderazgo: 2, administracion: 2 } },
      { text: "No me gusta",           categories: { educacion: 0, liderazgo: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { educacion: 0, liderazgo: 0, administracion: 0 } }
    ]
  },
  {
    // 20. Prevenir o apagar incendios, proteger y salvar a las personas durante éstos.
    text: "Prevenir o apagar incendios, proteger y salvar a las personas durante éstos.",
    options: [
      { text: "Me gusta",               categories: { salud: 5, seguridad: 4 } },
      { text: "Tengo dudas",           categories: { salud: 3, seguridad: 2 } },
      { text: "No me gusta",           categories: { salud: 0, seguridad: 0 } },
      { text: "No conozco esa actividad", categories: { salud: 0, seguridad: 0 } }
    ]
  },
  {
    // 21. Trabajar como geólogo profesional.
    text: "Trabajar como geólogo profesional.",
    options: [
      { text: "Me gusta",               categories: { ciencias: 5, investigacion: 4 } },
      { text: "Tengo dudas",           categories: { ciencias: 3, investigacion: 2 } },
      { text: "No me gusta",           categories: { ciencias: 0, investigacion: 0 } },
    ]
  },
  {
    // 22. Trabajar a bordo de un barco o en un puerto.
    text: "Trabajar a bordo de un barco o en un puerto.",
    options: [
      { text: "Me gusta",               categories: { negocios: 4, administracion: 3 } },
      { text: "Tengo dudas",           categories: { negocios: 2, administracion: 2 } },
      { text: "No me gusta",           categories: { negocios: 0, administracion: 0 } },
      { text: "No conozco esa actividad", categories: { negocios: 0, administracion: 0 } }
    ]
  },
  {
    // 23. Aplicar los conocimientos de medicina para el tratamiento de las afecciones buco-dentales.
    text: "Aplicar los conocimientos de medicina para el tratamiento de las afecciones buco-dentales.",
    options: [
      { text: "Me gusta",               categories: { salud: 5 } },
      { text: "Tengo dudas",           categories: { salud: 3 } },
      { text: "No me gusta",           categories: { salud: 0 } },
      { text: "No conozco esa actividad", categories: { salud: 0 } }
    ]
  }
];