/**
 * Pruebas de Integración - API REST
 * Verifican la correcta interacción entre módulos
 */

import request from 'supertest';
import app from '../server.js';
import { User, Question, TestResult } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Pruebas de Integración - API REST', () => {
  
  describe('Flujo completo de usuario', () => {
    let token;
    let userId;
    const userEmail = `integration-${Date.now()}@test.com`;

    it('flujo completo: registro -> login -> test -> resultados -> historial', async () => {
      // 1. Registro
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test User',
          email: userEmail,
          password: 'password123'
        })
        .expect(201);

      token = registerResponse.body.token;
      userId = registerResponse.body.user.id;
      expect(token).toBeTruthy();

      // 2. Verificar que puede obtener preguntas
      const questionsResponse = await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(questionsResponse.body.questions.length).toBeGreaterThan(0);

      // 3. Enviar test
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const submitResponse = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({ answers })
        .expect(201);

      const testId = submitResponse.body.prediction.id;
      expect(testId).toBeTruthy();
      expect(submitResponse.body.prediction).toBeTruthy();

      // 4. Obtener resultados específicos
      const resultResponse = await request(app)
        .get(`/api/test/results/${testId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resultResponse.body.result.id).toBe(testId);

      // 5. Verificar historial
      const historyResponse = await request(app)
        .get('/api/test/my-results')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(historyResponse.body.results.length).toBeGreaterThanOrEqual(1);
      expect(historyResponse.body.results.some(t => t.id === testId)).toBe(true);

      // Limpieza
      await TestResult.destroy({ where: { userId } });
      await User.destroy({ where: { id: userId } });
    });
  });

  describe('Integración con Base de Datos', () => {
    it('debería manejar transacciones correctamente', async () => {
      const email = `transaction-${Date.now()}@test.com`;
      
      // Crear usuario
      const user = await User.create({
        name: 'Transaction Test',
        email: email,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });

      // Verificar que se creó
      const foundUser = await User.findOne({ where: { email } });
      expect(foundUser).toBeTruthy();
      expect(foundUser.id).toBe(user.id);

      // Limpiar
      await User.destroy({ where: { id: user.id } });

      // Verificar que se eliminó
      const deletedUser = await User.findOne({ where: { email } });
      expect(deletedUser).toBeNull();
    });

    it('debería mantener integridad referencial', async () => {
      // Crear usuario
      const user = await User.create({
        name: 'Referential Test',
        email: `referential-${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });

      // Crear test result
      const testResult = await TestResult.create({
        userId: user.id,
        answers: Array.from({ length: 65 }, () => 3),
        predictions: {
          recommendedCareer: 'Test Career',
          confidence: 80,
          topCareers: [],
          riasecProfile: {}
        }
      });

      // Verificar relación
      const foundTest = await TestResult.findOne({
        where: { id: testResult.id },
        include: [{ model: User, as: 'user' }]
      });

      expect(foundTest.user.id).toBe(user.id);

      // Limpiar
      await TestResult.destroy({ where: { id: testResult.id } });
      await User.destroy({ where: { id: user.id } });
    });
  });

  describe('Integración con servicio ML', () => {
    let token;
    let userId;

    beforeAll(async () => {
      const user = await User.create({
        name: 'ML Integration Test',
        email: `ml-integration-${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });
      userId = user.id;

      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
    });

    afterAll(async () => {
      await TestResult.destroy({ where: { userId } });
      await User.destroy({ where: { id: userId } });
    });

    it('debería llamar al servicio ML al enviar test', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 4;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({ answers })
        .expect(201);

      // Verificar que se generó predicción
      expect(response.body.prediction).toBeTruthy();
      expect(response.body.prediction.carrera_recomendada).toBeTruthy();
    });

    it('debería guardar predicción ML en la base de datos', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 3;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({ answers })
        .expect(201);

      const testId = response.body.prediction.id;
      const testResult = await TestResult.findByPk(testId);

      expect(testResult).toBeTruthy();
      expect(testResult.predictedCareer).toBeTruthy();
      expect(testResult.confidence).toBeGreaterThan(0);
    });
  });

  describe('Manejo de errores en integración', () => {
    it('debería manejar errores de BD correctamente', async () => {
      // Intentar crear usuario con email inválido
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'pass123'
        })
        .expect(500);

      expect(response.body.message).toBeTruthy();
    });

    it('debería manejar token expirado', async () => {
      const expiredToken = jwt.sign(
        { id: 999, email: 'test@test.com', role: 'student' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '0s' } // Expira inmediatamente
      );

      // Esperar un momento para asegurar expiración
      await new Promise(resolve => setTimeout(resolve, 1000));

      await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Validación de datos entre capas', () => {
    let token;
    let userId;

    beforeAll(async () => {
      const user = await User.create({
        name: 'Validation Test',
        email: `validation-${Date.now()}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });
      userId = user.id;

      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
    });

    afterAll(async () => {
      await TestResult.destroy({ where: { userId } });
      await User.destroy({ where: { id: userId } });
    });

    it('debería validar formato de respuestas antes de enviar a ML', async () => {
      // Respuestas inválidas (string en lugar de número)
      const invalidAnswers = { q1: '1', q2: '2', q3: '3' };
      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({ answers: invalidAnswers })
        .expect(400);

      expect(response.body.message).toMatch(/falta.*respuesta/i);
    });

    it('debería validar longitud de respuestas', async () => {
      const shortAnswers = { q1: 1, q2: 2, q3: 3 }; // Solo 3 respuestas
      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({ answers: shortAnswers })
        .expect(400);

      expect(response.body.message).toMatch(/falta.*respuesta/i);
    });
  });
});
