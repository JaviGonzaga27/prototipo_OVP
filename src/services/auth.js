// src/services/auth.js
const API_URL = 'tu-backend-url';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};