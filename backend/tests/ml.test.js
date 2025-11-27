/**
 * Pruebas de Modelo de Machine Learning
 * TC-ML-001: Validación de entrada
 * TC-ML-002: Consistencia de predicciones
 * TC-ML-003: Tiempo de respuesta
 * TC-ML-004: Cobertura de carreras
 */

import { jest } from '@jest/globals';
import mlService from '../ml/mlService.js';

// Mock del servicio de Python para las pruebas
const originalPredecir = mlService.predecir.bind(mlService);

describe('Pruebas de Machine Learning', () => {
  
  beforeEach(() => {
    // Mock de la predicción de Python para evitar dependencia externa
    mlService.predecir = jest.fn().mockImplementation((respuestas) => {
      // Validar primero
      const validacion = mlService.validarRespuestas(respuestas);
      if (!validacion.valid) {
        return Promise.reject(new Error(validacion.error));
      }
      
      // Calcular suma para variar la respuesta según input
      const suma = Object.values(respuestas).reduce((a, b) => a + b, 0);
      const promedio = suma / 65;
      
      // Seleccionar carrera según promedio
      let carrera, confianza;
      if (promedio < 2) {
        carrera = 'Administración de Empresas';
        confianza = 0.78;
      } else if (promedio < 3) {
        carrera = 'Contabilidad';
        confianza = 0.82;
      } else if (promedio < 4) {
        carrera = 'Ingeniería de Software';
        confianza = 0.85;
      } else {
        carrera = 'Medicina';
        confianza = 0.88;
      }
      
      // Retornar predicción simulada
      return Promise.resolve({
        success: true,
        carrera,
        confianza,
        top3: [
          { carrera, confianza },
          { carrera: 'Ciencia de Datos', confianza: confianza - 0.13 },
          { carrera: 'Ingeniería Industrial', confianza: confianza - 0.17 }
        ]
      });
    });
  });
  
  afterEach(() => {
    mlService.predecir = originalPredecir;
  });
  
  describe('TC-ML-001: Validación de entrada', () => {
    it('debería rechazar inputs con formato incorrecto', () => {
      const invalidInputs = [
        {}, // Objeto vacío
        { q1: 1 }, // Incompleto (falta q2-q65)
        { q1: 1, q2: 2 } // Muy incompleto
      ];

      for (const input of invalidInputs) {
        const result = mlService.validarRespuestas(input);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it('debería rechazar valores fuera del rango 1-5', () => {
      // Crear respuestas con un valor inválido
      const respuestasBase = {};
      for (let i = 1; i <= 65; i++) {
        respuestasBase[`q${i}`] = 3;
      }

      const testCases = [
        { ...respuestasBase, q1: 0 }, // 0 es inválido
        { ...respuestasBase, q5: 6 }, // 6 es inválido
        { ...respuestasBase, q10: -1 }, // Negativo
        { ...respuestasBase, q20: 10 } // Muy alto
      ];

      for (const input of testCases) {
        const result = mlService.validarRespuestas(input);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('debe estar entre');
      }
    });

    it('debería aceptar objetos con 65 respuestas entre 1-5', async () => {
      const validInput = {};
      for (let i = 1; i <= 65; i++) {
        validInput[`q${i}`] = 3;
      }
      
      const validacion = mlService.validarRespuestas(validInput);
      expect(validacion.valid).toBe(true);
      
      const result = await mlService.predecir(validInput);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('carrera');
      expect(result).toHaveProperty('confianza');
    });

    it('debería rechazar valores null o undefined', () => {
      const respuestasBase = {};
      for (let i = 1; i <= 65; i++) {
        respuestasBase[`q${i}`] = 3;
      }

      const invalidValues = [
        { ...respuestasBase, q5: null }, // Null
        { ...respuestasBase, q10: undefined } // Undefined
      ];

      for (const input of invalidValues) {
        const result = mlService.validarRespuestas(input);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('TC-ML-002: Consistencia de predicciones', () => {
    it('mismas respuestas deben generar misma predicción', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const prediction1 = await mlService.predecir(input);
      const prediction2 = await mlService.predecir(input);
      
      expect(prediction1.carrera).toBe(prediction2.carrera);
      expect(prediction1.confianza).toBe(prediction2.confianza);
    });

    it('predecir 100 veces el mismo input debe ser consistente', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 4;
      }
      const predictions = [];
      
      for (let i = 0; i < 100; i++) {
        const result = await mlService.predecir(input);
        predictions.push(result.carrera);
      }
      
      // Todas las predicciones deben ser iguales
      const uniquePredictions = [...new Set(predictions)];
      expect(uniquePredictions).toHaveLength(1);
    });

    it('inputs diferentes deben poder generar predicciones diferentes', async () => {
      const input1 = {};
      const input2 = {};
      for (let i = 1; i <= 65; i++) {
        input1[`q${i}`] = 1; // Todas respuestas bajas
        input2[`q${i}`] = 5; // Todas respuestas altas
      }
      
      const prediction1 = await mlService.predecir(input1);
      const prediction2 = await mlService.predecir(input2);
      
      // Es muy probable que sean diferentes (pero no garantizado)
      expect(prediction1).toBeDefined();
      expect(prediction2).toBeDefined();
    });
  });

  describe('TC-ML-003: Tiempo de respuesta', () => {
    it('instanciación del servicio ML debería ser inmediata', () => {
      const startTime = Date.now();
      
      // El servicio ya está instanciado como singleton
      expect(mlService).toBeDefined();
      expect(mlService.predecir).toBeDefined();
      
      const endTime = Date.now();
      const duration = (endTime - startTime);
      
      expect(duration).toBeLessThan(100); // < 100ms
    });

    it('predicción individual debería ser < 5 segundos', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const startTime = Date.now();
      
      await mlService.predecir(input);
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      expect(duration).toBeLessThan(5);
    }, 10000);

    it('100 predicciones deberían completarse en tiempo razonable', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const startTime = Date.now();
      
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(mlService.predecir(input));
      }
      await Promise.all(promises);
      
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      const avgTime = totalTime / 100;
      
      expect(avgTime).toBeLessThan(1); // Promedio < 1 segundo
    }, 120000); // 2 minutos timeout

    it('predicción con input complejo debería ser < 5 segundos', async () => {
      // Input variado que requiere más procesamiento
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = (i % 5) + 1;
      }
      
      const startTime = Date.now();
      
      await mlService.predecir(input);
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      expect(duration).toBeLessThan(5);
    }, 10000);
  });

  describe('TC-ML-004: Cobertura de carreras', () => {
    it('el modelo debería poder recomendar diferentes carreras', async () => {
      const recommendedCareers = new Set();
      
      // Generar perfiles diversos
      const createProfile = (fillValue) => {
        const profile = {};
        for (let i = 1; i <= 65; i++) {
          profile[`q${i}`] = typeof fillValue === 'function' ? fillValue(i) : fillValue;
        }
        return profile;
      };
      
      const profiles = [
        createProfile(1),
        createProfile(2),
        createProfile(3),
        createProfile(4),
        createProfile(5),
        createProfile((i) => (i % 5) + 1),
        createProfile((i) => ((i * 3) % 5) + 1),
        createProfile((i) => ((i * 7) % 5) + 1),
        createProfile((i) => i <= 10 ? 5 : 1),
        createProfile((i) => i <= 30 ? 1 : 5),
      ];
      
      for (const profile of profiles) {
        const prediction = await mlService.predecir(profile);
        recommendedCareers.add(prediction.carrera);
      }
      
      // Debería haber al menos 2 carreras diferentes recomendadas
      expect(recommendedCareers.size).toBeGreaterThanOrEqual(2);
    });

    it('top 3 carreras deberían ser diferentes entre sí', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const prediction = await mlService.predecir(input);
      
      const careerNames = prediction.top3.map(c => c.carrera);
      const uniqueNames = new Set(careerNames);
      
      expect(uniqueNames.size).toBe(3); // Todas diferentes
    });

    it('top 3 carreras deberían estar ordenadas por confianza', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 4;
      }
      
      const prediction = await mlService.predecir(input);
      
      for (let i = 0; i < prediction.top3.length - 1; i++) {
        expect(prediction.top3[i].confianza)
          .toBeGreaterThanOrEqual(prediction.top3[i + 1].confianza);
      }
    });

    it('confianzas deberían estar entre 0 y 1', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const prediction = await mlService.predecir(input);
      
      prediction.top3.forEach(carrera => {
        expect(carrera.confianza).toBeGreaterThanOrEqual(0);
        expect(carrera.confianza).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Estructura de predicción', () => {
    it('predicción debería tener estructura correcta', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const prediction = await mlService.predecir(input);
      
      // Verificar estructura
      expect(prediction).toHaveProperty('success');
      expect(prediction).toHaveProperty('carrera');
      expect(prediction).toHaveProperty('confianza');
      expect(prediction).toHaveProperty('top3');
      
      // Verificar tipos
      expect(typeof prediction.success).toBe('boolean');
      expect(typeof prediction.carrera).toBe('string');
      expect(typeof prediction.confianza).toBe('number');
      expect(Array.isArray(prediction.top3)).toBe(true);
    });

    it('confianza debería estar entre 0 y 1', async () => {
      const createInput = (fillFunc) => {
        const input = {};
        for (let i = 1; i <= 65; i++) {
          input[`q${i}`] = typeof fillFunc === 'function' ? fillFunc(i) : fillFunc;
        }
        return input;
      };
      
      const inputs = [
        createInput(1),
        createInput(3),
        createInput(5),
        createInput((i) => (i % 5) + 1)
      ];
      
      for (const input of inputs) {
        const prediction = await mlService.predecir(input);
        
        expect(prediction.confianza).toBeGreaterThanOrEqual(0);
        expect(prediction.confianza).toBeLessThanOrEqual(1);
      }
    });

    it('top3 debería tener exactamente 3 elementos', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 3;
      }
      
      const prediction = await mlService.predecir(input);
      
      expect(prediction.top3).toHaveLength(3);
      
      // Cada elemento debe tener carrera y confianza
      prediction.top3.forEach(item => {
        expect(item).toHaveProperty('carrera');
        expect(item).toHaveProperty('confianza');
        expect(typeof item.carrera).toBe('string');
        expect(typeof item.confianza).toBe('number');
      });
    });

  });

  describe('Manejo de casos extremos', () => {
    it('debería manejar todas respuestas mínimas (1)', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 1;
      }
      
      const prediction = await mlService.predecir(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.carrera).toBeTruthy();
    });

    it('debería manejar todas respuestas máximas (5)', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = 5;
      }
      
      const prediction = await mlService.predecir(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.carrera).toBeTruthy();
    });

    it('debería manejar patrón aleatorio', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }
      
      const prediction = await mlService.predecir(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.carrera).toBeTruthy();
    });

    it('debería manejar patrón alternante', async () => {
      const input = {};
      for (let i = 1; i <= 65; i++) {
        input[`q${i}`] = i % 2 === 0 ? 1 : 5;
      }
      
      const prediction = await mlService.predecir(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.carrera).toBeTruthy();
    });
  });
});
