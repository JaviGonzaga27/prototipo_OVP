import { describe, it, expect } from 'vitest';

describe('Configuración de Tests', () => {
  it('debería ejecutar tests correctamente', () => {
    expect(true).toBe(true);
  });

  it('debería tener matemáticas funcionando', () => {
    expect(2 + 2).toBe(4);
  });
});
