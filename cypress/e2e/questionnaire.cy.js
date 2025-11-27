/**
 * E2E Tests - Test Vocacional
 * TC-005: Cargar preguntas del test
 * TC-006: Navegar entre preguntas
 * TC-007: Guardar progreso en localStorage
 * TC-008: Completar test y enviar
 */

describe('E2E - Test Vocacional', () => {
  const timestamp = Date.now();
  const testEmail = `questionnaire-${timestamp}@test.com`;

  beforeEach(() => {
    // Crear y autenticar usuario
    cy.createUser({
      name: 'Test User',
      email: testEmail,
      password: 'password123'
    }).then((response) => {
      if (response.body.token) {
        cy.window().then((win) => {
          win.localStorage.setItem('token', response.body.token);
        });
      }
    });
  });

  describe('TC-005: Cargar preguntas del test', () => {
    it('debería cargar las preguntas al iniciar el test', () => {
      cy.visit('/cuestionario');
      
      // Verificar que se carga la primera pregunta
      cy.contains(/pregunta/i, { timeout: 10000 }).should('be.visible');
      
      // Verificar indicador de progreso
      cy.contains('1/65').should('be.visible');
    });

    it('debería mostrar las opciones de respuesta (1-5)', () => {
      cy.visit('/cuestionario');
      
      // Verificar que existen 5 opciones
      cy.get('input[type="radio"]').should('have.length.at.least', 5);
    });

    it('debería mostrar botón "Siguiente"', () => {
      cy.visit('/cuestionario');
      cy.contains('Siguiente').should('be.visible');
    });

    it('debería deshabilitar "Siguiente" si no hay respuesta', () => {
      cy.visit('/cuestionario');
      cy.contains('Siguiente').should('be.disabled');
    });
  });

  describe('TC-006: Navegar entre preguntas', () => {
    it('debería avanzar a la siguiente pregunta', () => {
      cy.visit('/cuestionario');
      
      // Responder primera pregunta
      cy.get('input[value="3"]').first().click();
      cy.contains('Siguiente').click();
      
      // Verificar cambio de progreso
      cy.contains('2/65').should('be.visible');
    });

    it('debería permitir retroceder a pregunta anterior', () => {
      cy.visit('/cuestionario');
      
      // Responder y avanzar
      cy.get('input[value="3"]').first().click();
      cy.contains('Siguiente').click();
      cy.get('input[value="4"]').first().click();
      cy.contains('Siguiente').click();
      
      // Retroceder
      cy.contains('Anterior').click();
      cy.contains('2/65').should('be.visible');
    });

    it('las respuestas deberían persistir al navegar', () => {
      cy.visit('/cuestionario');
      
      // Responder primera pregunta con valor 4
      cy.get('input[value="4"]').first().click();
      cy.contains('Siguiente').click();
      
      // Responder segunda pregunta
      cy.get('input[value="2"]').first().click();
      cy.contains('Siguiente').click();
      
      // Volver a primera pregunta
      cy.contains('Anterior').click();
      cy.contains('Anterior').click();
      
      // Verificar que la respuesta se mantuvo
      cy.get('input[value="4"]').first().should('be.checked');
    });

    it('debería actualizar barra de progreso', () => {
      cy.visit('/cuestionario');
      
      // Responder 10 preguntas
      for (let i = 0; i < 10; i++) {
        cy.get('input[value="3"]').first().click();
        cy.contains('Siguiente').click();
      }
      
      // Verificar progreso
      cy.contains('11/65').should('be.visible');
    });
  });

  describe('TC-007: Guardar progreso en localStorage', () => {
    it('debería guardar respuestas en localStorage', () => {
      cy.visit('/cuestionario');
      
      // Responder algunas preguntas
      for (let i = 0; i < 5; i++) {
        cy.get('input[value="3"]').first().click();
        cy.contains('Siguiente').click();
      }
      
      // Verificar localStorage
      cy.window().then((win) => {
        const savedData = win.localStorage.getItem('questionnaireProgress');
        expect(savedData).to.exist;
        
        const data = JSON.parse(savedData);
        expect(data.answers).to.have.length.at.least(5);
      });
    });

    it('debería recuperar progreso al recargar', () => {
      cy.visit('/cuestionario');
      
      // Responder 10 preguntas
      for (let i = 0; i < 10; i++) {
        cy.get('input[value="4"]').first().click();
        cy.contains('Siguiente').click();
      }
      
      // Recargar página
      cy.reload();
      
      // Verificar que continúa en pregunta 11
      cy.contains('11/65', { timeout: 10000 }).should('be.visible');
      
      // Verificar que puede ver pregunta anterior con respuesta guardada
      cy.contains('Anterior').click();
      cy.get('input[value="4"]').first().should('be.checked');
    });

    it('debería mostrar opción de continuar test previo', () => {
      cy.visit('/cuestionario');
      
      // Responder algunas preguntas
      for (let i = 0; i < 5; i++) {
        cy.get('input[value="3"]').first().click();
        cy.contains('Siguiente').click();
      }
      
      // Salir del test
      cy.visit('/home');
      
      // Volver al cuestionario
      cy.visit('/cuestionario');
      
      // Debería preguntar si quiere continuar (ajustar según implementación)
      cy.contains(/continuar|reanudar/i, { timeout: 5000 });
    });
  });

  describe('TC-008: Completar test y enviar', () => {
    it('debería mostrar resumen al llegar a la pregunta 65', () => {
      cy.visit('/cuestionario');
      
      // Responder todas las preguntas
      for (let i = 0; i < 65; i++) {
        cy.get('input[value="3"]').first().click();
        if (i < 64) {
          cy.contains('Siguiente').click();
        } else {
          cy.contains('Finalizar').click();
        }
      }
      
      // Verificar pantalla de resumen
      cy.contains(/resumen|finalizar|enviar/i, { timeout: 10000 }).should('be.visible');
    });

    it('debería enviar test completo', () => {
      cy.visit('/cuestionario');
      
      // Completar test
      for (let i = 0; i < 65; i++) {
        cy.get('input[value="3"]').first().click();
        if (i < 64) {
          cy.contains('Siguiente').click();
        } else {
          cy.contains('Finalizar').click();
        }
      }
      
      // Enviar
      cy.contains(/enviar|submit/i).click();
      
      // Verificar loading
      cy.get('[data-testid="loading"]', { timeout: 2000 }).should('be.visible');
      
      // Verificar redirección a resultados
      cy.url({ timeout: 10000 }).should('include', '/resultados');
    });

    it('debería limpiar localStorage después de enviar', () => {
      cy.visit('/cuestionario');
      
      // Completar y enviar test
      for (let i = 0; i < 65; i++) {
        cy.get('input[value="3"]').first().click();
        if (i < 64) {
          cy.contains('Siguiente').click();
        } else {
          cy.contains('Finalizar').click();
        }
      }
      
      cy.contains(/enviar/i).click();
      
      // Esperar redirección
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar que localStorage está limpio
      cy.window().then((win) => {
        const savedData = win.localStorage.getItem('questionnaireProgress');
        expect(savedData).to.be.null;
      });
    });

    it('no debería permitir enviar test incompleto', () => {
      cy.visit('/cuestionario');
      
      // Responder solo 30 preguntas
      for (let i = 0; i < 30; i++) {
        cy.get('input[value="3"]').first().click();
        cy.contains('Siguiente').click();
      }
      
      // No debería existir botón "Finalizar"
      cy.contains('Finalizar').should('not.exist');
      cy.contains('Siguiente').should('be.visible');
    });
  });

  describe('Validaciones adicionales', () => {
    it('debería requerir autenticación para acceder al test', () => {
      cy.clearLocalStorage();
      cy.visit('/cuestionario');
      
      // Debería redirigir a login
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('debería mostrar tiempo transcurrido', () => {
      cy.visit('/cuestionario');
      
      // Verificar que existe un timer (ajustar según implementación)
      cy.get('[data-testid="timer"]', { timeout: 5000 }).should('be.visible');
    });

    it('debería permitir cambiar respuesta antes de avanzar', () => {
      cy.visit('/cuestionario');
      
      // Seleccionar una respuesta
      cy.get('input[value="3"]').first().click();
      cy.get('input[value="3"]').first().should('be.checked');
      
      // Cambiar respuesta
      cy.get('input[value="5"]').first().click();
      cy.get('input[value="5"]').first().should('be.checked');
      cy.get('input[value="3"]').first().should('not.be.checked');
    });
  });
});
