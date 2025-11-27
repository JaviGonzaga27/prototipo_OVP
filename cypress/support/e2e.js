// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
// ***********************************************************

import './commands';

// Configuración global
beforeEach(() => {
  // Limpiar cookies y localStorage antes de cada test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Manejar excepciones no capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Evitar que tests fallen por errores de terceros
  return false;
});
