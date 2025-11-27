import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpieza después de cada test
afterEach(() => {
  cleanup();
});
