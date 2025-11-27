/**
 * E2E Tests - Autenticación
 * TC-001: Registro de usuario exitoso
 * TC-002: Registro con email duplicado
 * TC-003: Login exitoso
 * TC-004: Login con credenciales incorrectas
 */

describe('E2E - Autenticación', () => {
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@test.com`;

  beforeEach(() => {
    cy.visit('/login');
  });

  describe('TC-001: Registro de usuario exitoso', () => {
    it('debería registrar un nuevo usuario correctamente', () => {
      // Navegar a registro
      cy.contains('Registrarse').click();
      cy.url().should('include', '/login');

      // Completar formulario
      cy.get('input[name="name"]').type('Juan Pérez');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type('password123');

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Verificar redirección
      cy.url().should('not.include', '/login');
      
      // Verificar que el usuario está autenticado
      cy.window().its('localStorage.token').should('exist');
    });

    it('debería mostrar mensaje de bienvenida después del registro', () => {
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[type="email"]').type(`welcome-${timestamp}@test.com`);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Verificar mensaje de bienvenida (ajustar según implementación)
      cy.contains(/bienvenido|welcome|hola/i, { timeout: 10000 });
    });
  });

  describe('TC-002: Registro con email duplicado', () => {
    beforeEach(() => {
      // Crear usuario primero
      cy.createUser({
        name: 'Usuario Existente',
        email: 'duplicado@test.com',
        password: 'password123'
      });
    });

    it('debería mostrar error al registrar email duplicado', () => {
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Otro Usuario');
      cy.get('input[type="email"]').type('duplicado@test.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Verificar mensaje de error
      cy.contains(/correo.*ya.*registrado|email.*existe/i, { timeout: 5000 });
    });

    it('debería validar formato de email', () => {
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[type="email"]').type('email-invalido');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // HTML5 validation o mensaje personalizado
      cy.get('input[type="email"]:invalid').should('exist');
    });

    it('debería validar longitud de contraseña', () => {
      cy.contains('Registrarse').click();
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[type="email"]').type(`short-${timestamp}@test.com`);
      cy.get('input[type="password"]').type('12');
      cy.get('button[type="submit"]').click();

      // Verificar mensaje de error
      cy.contains(/contraseña.*corta|mínimo|caracteres/i, { timeout: 5000 });
    });
  });

  describe('TC-003: Login exitoso', () => {
    beforeEach(() => {
      // Crear usuario de prueba
      cy.createUser({
        name: 'Login Test',
        email: `login-${timestamp}@test.com`,
        password: 'password123'
      });
    });

    it('debería iniciar sesión con credenciales correctas', () => {
      cy.get('input[type="email"]').type(`login-${timestamp}@test.com`);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Verificar redirección
      cy.url().should('not.include', '/login');
      
      // Verificar token guardado
      cy.window().its('localStorage.token').should('exist');
    });

    it('debería redirigir a página principal después del login', () => {
      cy.login(`login-${timestamp}@test.com`, 'password123');
      
      // Debería estar en home o dashboard
      cy.url().should('match', /\/(home|dashboard|cuestionario)?$/);
    });

    it('debería mantener sesión al recargar página', () => {
      cy.login(`login-${timestamp}@test.com`, 'password123');
      
      // Recargar página
      cy.reload();
      
      // Debería seguir autenticado
      cy.url().should('not.include', '/login');
    });
  });

  describe('TC-004: Login con credenciales incorrectas', () => {
    beforeEach(() => {
      cy.createUser({
        name: 'Wrong Pass Test',
        email: `wrongpass-${timestamp}@test.com`,
        password: 'correctpassword'
      });
    });

    it('debería mostrar error con contraseña incorrecta', () => {
      cy.get('input[type="email"]').type(`wrongpass-${timestamp}@test.com`);
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Verificar mensaje de error
      cy.contains(/correo.*contraseña.*incorrectos|credenciales.*inválidas/i, { timeout: 5000 });
      
      // Debería permanecer en login
      cy.url().should('include', '/login');
    });

    it('debería mostrar error con email inexistente', () => {
      cy.get('input[type="email"]').type('noexiste@test.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains(/correo.*contraseña.*incorrectos|usuario.*existe/i, { timeout: 5000 });
    });

    it('debería requerir ambos campos', () => {
      // Intentar sin email
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]:invalid').should('exist');

      // Limpiar y intentar sin contraseña
      cy.reload();
      cy.get('input[type="email"]').type('test@test.com');
      cy.get('button[type="submit"]').click();
      cy.get('input[type="password"]:invalid').should('exist');
    });
  });

  describe('Logout', () => {
    it('debería cerrar sesión correctamente', () => {
      cy.createUser({
        name: 'Logout Test',
        email: `logout-${timestamp}@test.com`,
        password: 'password123'
      });

      cy.login(`logout-${timestamp}@test.com`, 'password123');
      
      // Buscar botón de logout (ajustar selector según implementación)
      cy.get('[data-testid="logout"]').click();
      // o cy.contains('Cerrar Sesión').click();
      
      // Verificar redirección a login
      cy.url().should('include', '/login');
      
      // Verificar que token fue eliminado
      cy.window().its('localStorage.token').should('not.exist');
    });
  });
});
