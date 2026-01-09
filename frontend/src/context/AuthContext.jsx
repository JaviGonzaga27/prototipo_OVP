// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/auth';
import { onSessionReplaced } from '../utils/apiInterceptor';

// Creamos y exportamos el contexto
export const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionReplacedMessage, setSessionReplacedMessage] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // Configurar callback para sesiones reemplazadas
  useEffect(() => {
    onSessionReplaced((message) => {
      setSessionReplacedMessage(message);
      logout();
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    });
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verificar que el token siga siendo válido
          const response = await getCurrentUser(storedToken);
          setUser(response.user);
          setToken(storedToken);
        } catch (error) {
          // Si el token no es válido, limpiar storage
          console.log('Token inválido o expirado:', error.message);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      setSessionReplacedMessage(null); // Limpiar mensaje si existe
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerUser(name, email, password);
      
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout: handleLogout, 
      loading,
      sessionReplacedMessage 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;