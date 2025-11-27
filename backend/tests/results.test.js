/**
 * TC-009: Predicción de carrera
 * TC-010: Visualización de resultados
 * TC-011: Ver historial de tests
 * 
 * Módulo: Resultados y Machine Learning
 * Prioridad: Alta
 */

import request from 'supertest';
import app from '../server.js';
import { User, TestResult } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Resultados y ML - Casos de Prueba TC-009, TC-010, TC-011', () => {
  let authToken;
  let userId;
  let testResultId;

  beforeAll(async () => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'ML Test User',
      email: `mltest${Date.now()}@test.com`,
      password: hashedPassword,
      role: 'student'
    });
    userId = user.id;

    authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    await TestResult.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });
  });

  /**
   * TC-009: Predicción de carrera
   * Verifica que el modelo ML genera predicción válida
   */
  describe('TC-009: Predicción de carrera con ML', () => {
    it('debería generar predicción válida al enviar test', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(201);

      testResultId = response.body.prediction.id;

      // Verificar estructura de la predicción
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('prediction');
      expect(response.body.prediction).toHaveProperty('carrera_recomendada');
      expect(response.body.prediction).toHaveProperty('confianza');
      expect(response.body.prediction).toHaveProperty('top_5_carreras');
    });

    it('la confianza debería estar entre 0 y 100', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers });

      const confidence = response.body.prediction.confianza;
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(100);
    });

    it('debería retornar top 5 carreras', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers });

      const topCareers = response.body.prediction.top_5_carreras;
      expect(Array.isArray(topCareers)).toBe(true);
      expect(topCareers.length).toBe(5);
      
      // Cada carrera debe tener nombre y porcentaje
      topCareers.forEach(career => {
        expect(career).toHaveProperty('carrera');
        expect(career).toHaveProperty('porcentaje');
        expect(career.porcentaje).toBeGreaterThanOrEqual(0);
        expect(career.porcentaje).toBeLessThanOrEqual(100);
      });
    });

    it('debería incluir perfil RIASEC', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers });

      const perfil = response.body.prediction.perfil;
      // El perfil contiene dimensiones abreviadas del modelo ML
      expect(perfil).toHaveProperty('R'); // Realista
      expect(perfil).toHaveProperty('I'); // Investigador
      expect(perfil).toHaveProperty('A'); // Artístico
      expect(perfil).toHaveProperty('S'); // Social
      expect(perfil).toHaveProperty('E'); // Emprendedor
      expect(perfil).toHaveProperty('C'); // Convencional

      // Todos los valores deben estar entre 0 y 100
      Object.values(perfil).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });

    it('la predicción debería completarse en menos de 5 segundos', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const startTime = Date.now();
      
      await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(201);

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // en segundos

      expect(duration).toBeLessThan(5);
    }, 10000); // timeout de 10 segundos

    it('predicciones consistentes con mismas respuestas', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 3;
      }

      const response1 = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers });

      const response2 = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers });

      expect(response1.body.prediction.carrera_recomendada)
        .toBe(response2.body.prediction.carrera_recomendada);
    });
  });

  /**
   * TC-010: Visualización de resultados
   * Verifica que los resultados se obtienen correctamente
   */
  describe('TC-010: Visualización de resultados', () => {
    beforeAll(async () => {
      // Crear resultado de prueba si no existe
      if (!testResultId) {
        const answers = {};
        for (let i = 1; i <= 65; i++) {
          answers[`q${i}`] = 4;
        }
        const response = await request(app)
          .post('/api/test/predict')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ answers });
        testResultId = response.body.prediction.id;
      }
    });

    it('debería obtener resultado por ID', async () => {
      const response = await request(app)
        .get(`/api/test/results/${testResultId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.result).toHaveProperty('id', testResultId);
    });

    it('no debería permitir ver resultados de otros usuarios', async () => {
      // Crear otro usuario
      const otherUser = await User.create({
        name: 'Other User',
        email: `other${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });

      const otherToken = jwt.sign(
        { id: otherUser.id, email: otherUser.email, role: otherUser.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      await request(app)
        .get(`/api/test/results/${testResultId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      await User.destroy({ where: { id: otherUser.id } });
    });

    it('debería retornar 404 para ID inexistente', async () => {
      await request(app)
        .get('/api/test/results/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  /**
   * TC-011: Ver historial de tests
   * Verifica acceso a tests anteriores
   */
  describe('TC-011: Ver historial de tests', () => {
    beforeAll(async () => {
      // Crear múltiples resultados
      for (let i = 0; i < 3; i++) {
        const answers = {};
        for (let j = 1; j <= 65; j++) {
          answers[`q${j}`] = Math.floor(Math.random() * 5) + 1;
        }
        await request(app)
          .post('/api/test/predict')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ answers });
        // Pequeña pausa para asegurar orden temporal
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    });

    it('debería obtener historial de tests del usuario', async () => {
      const response = await request(app)
        .get('/api/test/my-results')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThanOrEqual(3);
    });

    it('cada test en el historial debe tener información básica', async () => {
      const response = await request(app)
        .get('/api/test/my-results')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const firstTest = response.body.results[0];
      expect(firstTest).toHaveProperty('id');
      expect(firstTest).toHaveProperty('completedAt');
      expect(firstTest).toHaveProperty('predictedCareer');
    });

    it('los tests deben estar ordenados por fecha (más reciente primero)', async () => {
      const response = await request(app)
        .get('/api/test/my-results')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.results.length >= 2) {
        const date1 = new Date(response.body.results[0].completedAt);
        const date2 = new Date(response.body.results[1].completedAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    it('solo debería mostrar tests del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/test/my-results')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.results.forEach(test => {
        expect(test.userId).toBe(userId);
      });
    });
  });
});
