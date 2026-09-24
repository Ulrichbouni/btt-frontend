import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Nettoyage automatique après chaque test
afterEach(() => {
  cleanup();
});

// Mock de l'API localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de l'API fetch globale
global.fetch = vi.fn();

// Mock des variables d'environnement Vite
vi.mock('import.meta', () => ({
  env: {
    VITE_API_URL: 'http://localhost:5000/api',
    DEV: true,
    PROD: false,
  },
}));

// Suppression des erreurs console en tests (optionnel)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// };
