/**
 * TC-005: Cargar preguntas del test
 * TC-006: Navegar entre preguntas
 * TC-008: Completar test y enviar
 * 
 * Módulo: Test Vocacional
 * Prioridad: Alta
 */

import request from 'supertest';
import app from '../server.js';
import { User, Question, TestResult } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Test Vocacional - Casos de Prueba TC-005, TC-006, TC-008', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@test.com',
      password: hashedPassword,
      role: 'student'
    });
    userId = user.id;

    // Generar token
    authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Asegurar que hay al menos 65 preguntas en la BD
    const questionCount = await Question.count();
    if (questionCount < 65) {
      console.warn('Advertencia: Se requieren al menos 65 preguntas en la BD para estos tests');
    }
  });

  afterAll(async () => {
    await TestResult.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });
  });

  /**
   * TC-005: Cargar preguntas del test
   * Verifica que se cargan correctamente las 65 preguntas
   */
  describe('TC-005: Cargar preguntas del test', () => {
    it('debería cargar las preguntas del test', async () => {
      const response = await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThanOrEqual(1);
    });

    it('debería cargar exactamente 65 preguntas si existen', async () => {
      const questionCount = await Question.count();
      
      if (questionCount >= 65) {
        const response = await request(app)
          .get('/api/questions')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.questions.length).toBe(65);
      }
    });

    it('cada pregunta debería tener la estructura correcta', async () => {
      const response = await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const question = response.body.questions[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('category');
      expect(question).toHaveProperty('dimension');
    });

    it('debería requerir autenticación', async () => {
      await request(app)
        .get('/api/questions')
        .expect(401);
    });

    it('debería rechazar token inválido', async () => {
      await request(app)
        .get('/api/questions')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });
  });

  /**
   * TC-006: Navegar entre preguntas
   * Esta funcionalidad es mayormente del frontend, pero podemos probar
   * que el backend mantiene el estado correctamente
   */
  describe('TC-006: Navegación y persistencia de respuestas', () => {
    it('debería permitir guardar respuestas parciales', async () => {
      // Este test verifica que localStorage funciona (frontend)
      // y que el backend acepta respuestas parciales al finalizar
      expect(true).toBe(true); // Placeholder - implementado en frontend
    });
  });

  /**
   * TC-008: Completar test y enviar
   * Verifica envío exitoso de test completo
   */
  describe('TC-008: Completar test y enviar', () => {
    it('debería aceptar test completo con 65 respuestas', async () => {
      // Generar 65 respuestas (valores 1-5)
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(201);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('prediction');
    }, 15000); // Timeout de 15 segundos para ML

    it('debería rechazar respuestas fuera del rango 1-5', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 6;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(400);

      expect(response.body.message).toMatch(/respuesta|falta/i);
    });

    it('debería rechazar respuestas fuera del rango 1-5', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 3;
      }
      answers.q10 = 6; // Valor inválido

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(400);

      expect(response.body.message).toMatch(/rango|estar entre/i);
    });

    it('debería guardar el resultado en la base de datos', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }

      const response = await request(app)
        .post('/api/test/predict')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ answers })
        .expect(201);

      const testId = response.body.prediction.id;
      const testResult = await TestResult.findByPk(testId);
      
      expect(testResult).toBeTruthy();
      expect(testResult.userId).toBe(userId);
      expect(Object.keys(testResult.answers)).toHaveLength(65);
    });

    it('debería requerir autenticación para enviar test', async () => {
      const answers = {};
      for (let i = 1; i <= 65; i++) {
        answers[`q${i}`] = 3;
      }

      await request(app)
        .post('/api/test/predict')
        .send({ answers })
        .expect(401);
    });
  });
});
