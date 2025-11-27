// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

// Comando personalizado para login
Cypress.Commands.add('login', (email = 'test@test.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Comando para registro
Cypress.Commands.add('register', (name, email, password) => {
  cy.visit('/login');
  cy.contains('Registrarse').click();
  cy.get('input[name="name"]').type(name);
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Comando para limpiar localStorage
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Comando para crear usuario de prueba via API
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: userData,
    failOnStatusCode: false
  });
});

// Comando para completar test rápidamente
Cypress.Commands.add('completeTest', () => {
  // Responder todas las preguntas con valor 3
  for (let i = 0; i < 65; i++) {
    cy.get('input[value="3"]').first().click();
    cy.contains('Siguiente').click();
  }
  cy.contains('Finalizar').click();
  cy.contains('Enviar').click();
});
