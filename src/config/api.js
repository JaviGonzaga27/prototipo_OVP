// src/config/api.js
// Configuración centralizada para la URL de la API

/**
 * URL base de la API del backend
 * Se obtiene de las variables de entorno (VITE_API_URL)
 * 
 * Ejemplos de configuración:
 * - Desarrollo local: http://localhost:3000/api
 * - Docker: http://localhost:3000/api (se conecta al contenedor backend)
 * - Producción con dominio: https://api.midominio.com/api
 * - Producción con IP: http://192.168.1.100:3000/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Exportar configuración adicional si es necesaria
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_BASE_URL;
