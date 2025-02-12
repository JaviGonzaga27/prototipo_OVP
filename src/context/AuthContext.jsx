// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MOCK_USERS } from '../constants/mockUsers';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Credenciales inválidas');
    }

    const { password: _, ...userWithoutPassword } = foundUser; // eslint-disable-line no-unused-vars
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      token: 'mock-jwt-token',
      user: userWithoutPassword
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;