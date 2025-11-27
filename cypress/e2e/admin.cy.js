/**
 * E2E Tests - Administración
 * TC-012: Acceso al panel administrativo
 * TC-013: Bloqueo de acceso a no-admins
 * TC-014: Gestionar usuarios
 * TC-015: Gestionar preguntas
 */

describe('E2E - Panel Administrativo', () => {
  const timestamp = Date.now();
  const adminEmail = `admin-${timestamp}@test.com`;
  const studentEmail = `student-${timestamp}@test.com`;
  let adminToken;
  let studentToken;

  before(() => {
    // Crear admin
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/register`,
      body: {
        name: 'Admin Test',
        email: adminEmail,
        password: 'admin123'
      }
    }).then((response) => {
      adminToken = response.body.token;
      // Cambiar rol a admin (requiere endpoint especial o BD)
      // Por ahora asumimos que el usuario se crea como admin
    });

    // Crear estudiante
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/register`,
      body: {
        name: 'Student Test',
        email: studentEmail,
        password: 'student123'
      }
    }).then((response) => {
      studentToken = response.body.token;
    });
  });

  describe('TC-012: Acceso al panel administrativo', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', adminToken);
      });
    });

    it('admin debería acceder al panel de administración', () => {
      cy.visit('/admin');
      
      // Verificar que carga el panel
      cy.contains(/administración|admin|panel/i, { timeout: 10000 }).should('be.visible');
      cy.url().should('include', '/admin');
    });

    it('debería mostrar estadísticas generales', () => {
      cy.visit('/admin');
      
      // Verificar estadísticas
      cy.get('[data-testid="total-users"]').should('be.visible');
      cy.get('[data-testid="total-tests"]').should('be.visible');
      cy.get('[data-testid="total-questions"]').should('be.visible');
    });

    it('debería mostrar lista de usuarios', () => {
      cy.visit('/admin');
      
      // Navegar a sección de usuarios
      cy.contains(/usuarios|users/i).click();
      
      // Verificar tabla/lista
      cy.get('[data-testid="user-list"]').should('be.visible');
      cy.get('[data-testid="user-item"]').should('have.length.at.least', 1);
    });

    it('debería mostrar gestión de preguntas', () => {
      cy.visit('/admin');
      
      // Navegar a preguntas
      cy.contains(/preguntas|questions/i).click();
      
      // Verificar lista
      cy.get('[data-testid="question-list"]').should('be.visible');
    });

    it('debería tener navegación entre secciones', () => {
      cy.visit('/admin');
      
      // Verificar tabs o menú lateral
      cy.contains(/usuarios/i).should('be.visible');
      cy.contains(/preguntas/i).should('be.visible');
      cy.contains(/estadísticas/i).should('be.visible');
    });
  });

  describe('TC-013: Bloqueo de acceso a no-admins', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', studentToken);
      });
    });

    it('estudiante no debería acceder al panel admin', () => {
      cy.visit('/admin');
      
      // Verificar mensaje de error o redirección
      cy.contains(/no autorizado|unauthorized|forbidden/i, { timeout: 5000 }).should('be.visible');
      
      // O verificar redirección
      cy.url({ timeout: 5000 }).should('not.include', '/admin');
    });

    it('debería redirigir a página principal', () => {
      cy.visit('/admin');
      
      cy.url({ timeout: 5000 }).should('match', /\/(home)?$/);
    });

    it('usuario sin autenticar no debería acceder', () => {
      cy.clearLocalStorage();
      cy.visit('/admin');
      
      // Debería redirigir a login
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('no debería mostrar opción de admin en menú para estudiantes', () => {
      cy.visit('/home');
      
      // Verificar que no existe enlace a admin
      cy.get('nav').within(() => {
        cy.contains(/admin|administración/i).should('not.exist');
      });
    });
  });

  describe('TC-014: Gestionar usuarios', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', adminToken);
      });
      cy.visit('/admin');
      cy.contains(/usuarios/i).click();
    });

    it('debería poder ver lista de todos los usuarios', () => {
      cy.get('[data-testid="user-list"]').should('be.visible');
      cy.get('[data-testid="user-item"]').should('have.length.at.least', 2);
    });

    it('debería mostrar información de cada usuario', () => {
      cy.get('[data-testid="user-item"]').first().within(() => {
        cy.get('[data-testid="user-name"]').should('not.be.empty');
        cy.get('[data-testid="user-email"]').should('not.be.empty');
        cy.get('[data-testid="user-role"]').should('not.be.empty');
      });
    });

    it('debería poder cambiar rol de usuario', () => {
      // Buscar usuario estudiante
      cy.contains(studentEmail).parents('[data-testid="user-item"]').within(() => {
        // Click en editar
        cy.get('[data-testid="edit-user"]').click();
      });
      
      // Cambiar rol
      cy.get('[data-testid="role-select"]').select('admin');
      cy.contains(/guardar|save/i).click();
      
      // Verificar cambio
      cy.contains(/actualizado|updated/i).should('be.visible');
    });

    it('debería poder ver detalles de un usuario', () => {
      cy.get('[data-testid="user-item"]').first().within(() => {
        cy.contains(/ver.*detalle|view/i).click();
      });
      
      // Verificar modal o página de detalles
      cy.get('[data-testid="user-details"]').should('be.visible');
      cy.contains(/nombre|name/i).should('be.visible');
      cy.contains(/email/i).should('be.visible');
      cy.contains(/tests.*completados/i).should('be.visible');
    });

    it('debería poder buscar usuarios', () => {
      cy.get('[data-testid="search-users"]').type(studentEmail);
      
      // Verificar filtrado
      cy.get('[data-testid="user-item"]').should('have.length', 1);
      cy.contains(studentEmail).should('be.visible');
    });

    it('debería poder filtrar por rol', () => {
      cy.get('[data-testid="filter-role"]').select('student');
      
      // Verificar que solo muestra estudiantes
      cy.get('[data-testid="user-role"]').each(($role) => {
        expect($role.text()).to.include('student');
      });
    });

    it('debería poder eliminar usuario', () => {
      // Crear usuario temporal
      const tempEmail = `temp-${Date.now()}@test.com`;
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/register`,
        body: {
          name: 'Temp User',
          email: tempEmail,
          password: 'temp123'
        }
      });
      
      cy.reload();
      
      // Buscar y eliminar
      cy.get('[data-testid="search-users"]').type(tempEmail);
      cy.get('[data-testid="delete-user"]').click();
      cy.contains(/confirmar|confirm/i).click();
      
      // Verificar eliminación
      cy.contains(tempEmail).should('not.exist');
    });
  });

  describe('TC-015: Gestionar preguntas', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', adminToken);
      });
      cy.visit('/admin');
      cy.contains(/preguntas/i).click();
    });

    it('debería mostrar lista de preguntas', () => {
      cy.get('[data-testid="question-list"]').should('be.visible');
      cy.get('[data-testid="question-item"]').should('have.length.at.least', 1);
    });

    it('cada pregunta debería mostrar texto y categoría', () => {
      cy.get('[data-testid="question-item"]').first().within(() => {
        cy.get('[data-testid="question-text"]').should('not.be.empty');
        cy.get('[data-testid="question-category"]').should('not.be.empty');
      });
    });

    it('debería poder editar texto de pregunta', () => {
      cy.get('[data-testid="question-item"]').first().within(() => {
        cy.get('[data-testid="edit-question"]').click();
      });
      
      // Editar texto
      const newText = `Texto editado ${Date.now()}`;
      cy.get('[data-testid="question-text-input"]').clear().type(newText);
      cy.contains(/guardar|save/i).click();
      
      // Verificar cambio
      cy.contains(newText).should('be.visible');
    });

    it('debería poder cambiar categoría de pregunta', () => {
      cy.get('[data-testid="question-item"]').first().within(() => {
        cy.get('[data-testid="edit-question"]').click();
      });
      
      // Cambiar categoría
      cy.get('[data-testid="category-select"]').select('I');
      cy.contains(/guardar|save/i).click();
      
      // Verificar cambio
      cy.contains(/actualizado|updated/i).should('be.visible');
    });

    it('debería poder crear nueva pregunta', () => {
      cy.contains(/nueva.*pregunta|add.*question/i).click();
      
      // Completar formulario
      cy.get('[data-testid="question-text-input"]').type('Nueva pregunta de prueba');
      cy.get('[data-testid="category-select"]').select('A');
      cy.get('[data-testid="subcategory-input"]').type('creatividad');
      cy.contains(/crear|create/i).click();
      
      // Verificar creación
      cy.contains('Nueva pregunta de prueba').should('be.visible');
    });

    it('debería validar campos al crear pregunta', () => {
      cy.contains(/nueva.*pregunta/i).click();
      
      // Intentar crear sin texto
      cy.contains(/crear|create/i).click();
      
      // Verificar error
      cy.contains(/requerido|required/i).should('be.visible');
    });

    it('debería poder eliminar pregunta', () => {
      // Primero crear una pregunta temporal
      cy.contains(/nueva.*pregunta/i).click();
      const tempText = `Pregunta temporal ${Date.now()}`;
      cy.get('[data-testid="question-text-input"]').type(tempText);
      cy.get('[data-testid="category-select"]').select('R');
      cy.contains(/crear/i).click();
      
      // Eliminar
      cy.contains(tempText).parents('[data-testid="question-item"]').within(() => {
        cy.get('[data-testid="delete-question"]').click();
      });
      cy.contains(/confirmar|confirm/i).click();
      
      // Verificar eliminación
      cy.contains(tempText).should('not.exist');
    });

    it('debería poder buscar preguntas', () => {
      cy.get('[data-testid="search-questions"]').type('matemáticas');
      
      // Verificar filtrado (si existe pregunta con esa palabra)
      cy.get('[data-testid="question-item"]').each(($item) => {
        cy.wrap($item).should('contain.text', 'matemáticas');
      });
    });

    it('debería poder filtrar por categoría', () => {
      cy.get('[data-testid="filter-category"]').select('R');
      
      // Verificar filtrado
      cy.get('[data-testid="question-category"]').each(($category) => {
        expect($category.text()).to.include('R');
      });
    });

    it('debería mostrar contador de preguntas total', () => {
      cy.get('[data-testid="total-questions-count"]').should('be.visible').then(($count) => {
        const count = parseInt($count.text());
        expect(count).to.be.at.least(65);
      });
    });
  });

  describe('Permisos de acciones administrativas', () => {
    it('estudiante no debería poder modificar usuarios via API', () => {
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/admin/users/1`,
        headers: {
          Authorization: `Bearer ${studentToken}`
        },
        body: { role: 'admin' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('estudiante no debería poder modificar preguntas via API', () => {
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/admin/questions/1`,
        headers: {
          Authorization: `Bearer ${studentToken}`
        },
        body: { text: 'Texto modificado' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  });
});
