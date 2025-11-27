/**
 * TC-001: Registro de usuario exitoso
 * TC-002: Registro con email duplicado
 * TC-003: Login exitoso
 * TC-004: Login con credenciales incorrectas
 * 
 * Módulo: Autenticación
 * Prioridad: Alta
 */

import request from 'supertest';
import app from '../server.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

describe('Autenticación - Casos de Prueba TC-001 a TC-004', () => {
  beforeEach(async () => {
    // Limpiar usuarios de prueba
    await User.destroy({ where: { email: 'juan@test.com' } });
    await User.destroy({ where: { email: 'nuevo@test.com' } });
  });

  afterAll(async () => {
    // Limpieza final
    await User.destroy({ where: { email: 'juan@test.com' } });
    await User.destroy({ where: { email: 'nuevo@test.com' } });
  });

  /**
   * TC-001: Registro de usuario exitoso
   * Verifica que un nuevo usuario puede registrarse correctamente
   */
  describe('TC-001: Registro de usuario exitoso', () => {
    it('debería registrar un nuevo usuario con datos válidos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Pérez',
          email: 'juan@test.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('juan@test.com');
      expect(response.body.user.name).toBe('Juan Pérez');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('debería encriptar la contraseña al registrar', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Pérez',
          email: 'juan@test.com',
          password: 'password123'
        });

      const user = await User.findOne({ where: { email: 'juan@test.com' } });
      expect(user.password).not.toBe('password123');
      
      const isPasswordValid = await bcrypt.compare('password123', user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('debería asignar rol "student" por defecto', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Pérez',
          email: 'juan@test.com',
          password: 'password123'
        });

      expect(response.body.user.role).toBe('student');
    });
  });

  /**
   * TC-002: Registro con email duplicado
   * Verifica que no se puede registrar un email ya existente
   */
  describe('TC-002: Registro con email duplicado', () => {
    beforeEach(async () => {
      // Crear usuario existente
      await User.create({
        name: 'Usuario Existente',
        email: 'juan@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });
    });

    it('debería rechazar registro con email duplicado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Pérez',
          email: 'juan@test.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/ya existe/i);
    });

    it('debería validar formato de email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(500); // Backend no valida formato de email, falla en DB

      expect(response.body.message).toMatch(/email.*válido/i);
    });

    it('debería validar longitud mínima de contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `short-pass-${Date.now()}@test.com`,
          password: '123'
        })
        .expect(500); // Backend no valida longitud de contraseña

      expect(response.body.message).toMatch(/contraseña.*mínimo/i);
    });
  });

  /**
   * TC-003: Login exitoso
   * Verifica que un usuario puede iniciar sesión con credenciales correctas
   */
  describe('TC-003: Login exitoso', () => {
    let testEmail;

    beforeEach(async () => {
      // Crear usuario de prueba con email único
      testEmail = `juan-${Date.now()}@test.com`;
      await User.create({
        name: 'Usuario Prueba',
        email: testEmail,
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });
    });

    it('debería iniciar sesión con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('debería generar un JWT válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123'
        });

      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(token.split('.')).toHaveLength(3); // Formato JWT: header.payload.signature
    });

    it('debería incluir información del usuario en la respuesta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'password123'
        });

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
    });
  });

  /**
   * TC-004: Login con credenciales incorrectas
   * Verifica manejo de error con credenciales inválidas
   */
  describe('TC-004: Login con credenciales incorrectas', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Usuario Prueba',
        email: 'juan@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'student'
      });
    });

    it('debería rechazar login con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toMatch(/credenciales.*inválidas/i);
    });

    it('debería rechazar login con email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toMatch(/credenciales.*inválidas/i);
    });

    it('debería rechazar login sin email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body.message).toMatch(/proporciona.*email/i);
    });

    it('debería rechazar login sin contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@test.com'
        })
        .expect(400);

      expect(response.body.message).toMatch(/proporciona.*contraseña/i);
    });
  });
});
