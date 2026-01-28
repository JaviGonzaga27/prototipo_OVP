// src/services/auth.js
import API_BASE_URL from '../config/api';
import { fetchWithSessionCheck } from '../utils/apiInterceptor';

const API_URL = API_BASE_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la autenticación');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await fetchWithSessionCheck(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Propagar el código de error si existe
      const error = new Error(data.message || 'Error al obtener usuario');
      error.code = data.code;
      throw error;
    }

    return data;
  } catch (error) {
    // Preservar el código de error
    const err = new Error(error.message);
    err.code = error.code;
    throw err;
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cerrar sesión');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener preguntas del test
export const getQuestions = async (token) => {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener preguntas');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Obtener preguntas agrupadas por categoría
export const getQuestionsGrouped = async (token) => {
  try {
    const response = await fetch(`${API_URL}/questions/grouped`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener preguntas');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Realizar predicción con ML (NUEVO - Recomendado)
export const predictCareer = async (token, answers) => {
  try {
    const response = await fetch(`${API_URL}/test/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al realizar predicción');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Guardar resultados del test (Legacy - mantener por compatibilidad)
export const saveTestResults = async (token, answers, results) => {
  try {
    const response = await fetch(`${API_URL}/test/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers, results }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al guardar resultados');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMyTestResults = async (token) => {
  try {
    const response = await fetch(`${API_URL}/test/my-results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener resultados');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTestResultById = async (token, resultId) => {
  try {
    const response = await fetch(`${API_URL}/test/results/${resultId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener resultado');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};