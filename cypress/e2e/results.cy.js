/**
 * E2E Tests - Resultados y ML
 * TC-009: Predicción de carrera
 * TC-010: Visualización de resultados
 * TC-011: Ver historial de tests
 */

describe('E2E - Resultados y Machine Learning', () => {
  const timestamp = Date.now();
  const testEmail = `results-${timestamp}@test.com`;

  beforeEach(() => {
    // Crear y autenticar usuario
    cy.createUser({
      name: 'Results Test User',
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

  describe('TC-009 & TC-010: Predicción y visualización de resultados', () => {
    it('debería mostrar carrera principal recomendada', () => {
      // Completar test
      cy.visit('/cuestionario');
      for (let i = 0; i < 65; i++) {
        cy.get('input[value="4"]').first().click();
        if (i < 64) {
          cy.contains('Siguiente').click();
        } else {
          cy.contains('Finalizar').click();
        }
      }
      cy.contains(/enviar/i).click();
      
      // Verificar resultados
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      cy.contains(/carrera.*recomendada|resultado/i, { timeout: 10000 }).should('be.visible');
      
      // Verificar que hay un nombre de carrera visible
      cy.get('[data-testid="recommended-career"]').should('be.visible');
    });

    it('debería mostrar nivel de confianza entre 0-100%', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar confianza
      cy.get('[data-testid="confidence"]').should('be.visible').then(($el) => {
        const text = $el.text();
        const confidence = parseFloat(text);
        expect(confidence).to.be.at.least(0);
        expect(confidence).to.be.at.most(100);
      });
    });

    it('debería mostrar top 5 carreras', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar lista de top 5
      cy.get('[data-testid="top-careers"]').should('be.visible');
      cy.get('[data-testid="career-item"]').should('have.length', 5);
      
      // Cada carrera debe tener nombre y porcentaje
      cy.get('[data-testid="career-item"]').each(($career) => {
        cy.wrap($career).find('[data-testid="career-name"]').should('not.be.empty');
        cy.wrap($career).find('[data-testid="career-percentage"]').should('not.be.empty');
      });
    });

    it('debería mostrar gráfico RIASEC', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar que existe gráfico RIASEC
      cy.get('[data-testid="riasec-chart"]', { timeout: 5000 }).should('be.visible');
      
      // Verificar las 6 dimensiones
      const dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];
      dimensions.forEach(dim => {
        cy.contains(new RegExp(dim, 'i')).should('be.visible');
      });
    });

    it('debería mostrar botones de descargar/compartir', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar botones
      cy.contains(/descargar|download/i).should('be.visible');
      cy.contains(/compartir|share/i).should('be.visible');
    });

    it('la predicción debería completarse en menos de 5 segundos', () => {
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
      
      const startTime = Date.now();
      cy.contains(/enviar/i).click();
      
      // Verificar que llegó a resultados
      cy.url({ timeout: 5000 }).should('include', '/resultados').then(() => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        expect(duration).to.be.lessThan(5);
      });
    });

    it('debería mostrar descripción de la carrera', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Verificar descripción
      cy.get('[data-testid="career-description"]').should('be.visible').and('not.be.empty');
    });

    it('debería permitir descargar resultados en PDF', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Click en descargar
      cy.contains(/descargar|pdf/i).click();
      
      // Verificar que se inició descarga (difícil de validar en Cypress)
      // Al menos verificar que no hay errores
      cy.contains(/error/i).should('not.exist');
    });
  });

  describe('TC-011: Ver historial de tests', () => {
    it('debería acceder al historial desde el menú', () => {
      cy.visit('/home');
      
      // Navegar a historial (ajustar selector según implementación)
      cy.contains(/historial|history/i).click();
      
      // Verificar URL
      cy.url().should('include', '/historial');
    });

    it('debería mostrar lista de tests completados', () => {
      // Completar un test primero
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Ir al historial
      cy.visit('/historial');
      
      // Verificar lista
      cy.get('[data-testid="test-history-item"]').should('have.length.at.least', 1);
    });

    it('cada test en historial debe mostrar fecha y carrera', () => {
      // Completar test
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Ver historial
      cy.visit('/historial');
      
      // Verificar información
      cy.get('[data-testid="test-history-item"]').first().within(() => {
        cy.get('[data-testid="test-date"]').should('be.visible');
        cy.get('[data-testid="test-career"]').should('be.visible');
      });
    });

    it('debería poder ver detalle de test anterior', () => {
      // Completar test
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Ir a historial
      cy.visit('/historial');
      
      // Click en "Ver detalle"
      cy.contains(/ver.*detalle|view/i).first().click();
      
      // Verificar que carga los resultados
      cy.url().should('match', /\/resultados\/\d+|\/test\/\d+/);
      cy.get('[data-testid="recommended-career"]').should('be.visible');
    });

    it('los tests deberían estar ordenados por fecha (más reciente primero)', () => {
      // Completar 2 tests
      for (let i = 0; i < 2; i++) {
        cy.visit('/cuestionario');
        cy.completeTest();
        cy.url({ timeout: 10000 }).should('include', '/resultados');
        cy.wait(1000); // Asegurar diferencia de tiempo
      }
      
      // Ver historial
      cy.visit('/historial');
      
      // Verificar orden
      cy.get('[data-testid="test-date"]').then(($dates) => {
        const dates = Array.from($dates).map(el => new Date(el.textContent));
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i].getTime()).to.be.at.least(dates[i + 1].getTime());
        }
      });
    });

    it('debería mostrar mensaje si no hay tests completados', () => {
      // Usuario nuevo sin tests
      const newEmail = `new-${Date.now()}@test.com`;
      cy.createUser({
        name: 'New User',
        email: newEmail,
        password: 'password123'
      }).then((response) => {
        cy.window().then((win) => {
          win.localStorage.setItem('token', response.body.token);
        });
      });
      
      cy.visit('/historial');
      
      // Verificar mensaje
      cy.contains(/no.*tests|ningún.*resultado|vacío/i).should('be.visible');
    });

    it('debería poder eliminar test del historial', () => {
      // Completar test
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Ir a historial
      cy.visit('/historial');
      
      const initialCount = cy.get('[data-testid="test-history-item"]').its('length');
      
      // Eliminar test
      cy.get('[data-testid="delete-test"]').first().click();
      cy.contains(/confirmar|eliminar/i).click();
      
      // Verificar que se eliminó
      cy.get('[data-testid="test-history-item"]').should('have.length.lessThan', initialCount);
    });
  });

  describe('Navegación entre resultados', () => {
    it('debería poder volver al inicio desde resultados', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Click en volver o inicio
      cy.contains(/inicio|home|volver/i).click();
      
      cy.url().should('match', /\/(home)?$/);
    });

    it('debería poder realizar nuevo test desde resultados', () => {
      cy.visit('/cuestionario');
      cy.completeTest();
      cy.url({ timeout: 10000 }).should('include', '/resultados');
      
      // Click en nuevo test
      cy.contains(/nuevo.*test|realizar.*nuevo/i).click();
      
      cy.url().should('include', '/cuestionario');
    });
  });
});
