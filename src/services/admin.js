// src/services/admin.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar usuario');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (token, userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllTestResults = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/results`, {
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

export const getUserTestResults = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/results/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener resultados del usuario');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener estadísticas');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
