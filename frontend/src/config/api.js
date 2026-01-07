// src/config/api.js
// Configuración centralizada para la URL de la API

/**
 * URL base de la API del backend
 * Prioridad de carga:
 * 1. window.ENV.VITE_API_URL (inyectado en runtime por Docker)
 * 2. import.meta.env.VITE_API_URL (desarrollo local)
 * 3. Fallback por defecto
 * 
 * Ejemplos de configuración:
 * - Desarrollo local: http://localhost:5000/api
 * - Docker: http://localhost:700/api
 * - Producción con dominio: https://api.midominio.com/api
 * - Producción con IP: http://192.168.1.100:700/api
 */
export const API_BASE_URL = 
  (typeof window !== 'undefined' && window.ENV?.VITE_API_URL) || 
  import.meta.env.VITE_API_URL || 
  'http://localhost:5000/api';

// Exportar configuración adicional si es necesaria
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};

// Log de configuración en desarrollo
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    apiUrl: API_BASE_URL,
    source: window.ENV?.VITE_API_URL ? 'Runtime (Docker)' : 'Build time (.env)'
  });
}

export default API_BASE_URL;
