import { beforeAll, afterAll } from '@jest/globals';

// Variables globales para tests
global.testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

global.testAdmin = {
  email: 'admin@test.com',
  password: 'admin123',
  name: 'Admin User'
};

// Limpieza antes de todos los tests
beforeAll(() => {
  // Configuración inicial
});

// Limpieza después de todos los tests
afterAll(() => {
  // Limpieza final
});
