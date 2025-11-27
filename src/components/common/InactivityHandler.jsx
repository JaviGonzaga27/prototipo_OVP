// src/components/common/InactivityHandler.jsx
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import useInactivityTimer from '../../hooks/useInactivityTimer';
import InactivityWarning from './InactivityWarning';

/**
 * Componente wrapper que maneja el temporizador de inactividad
 * Solo se activa cuando el usuario está autenticado y no está en la página de login
 */
const InactivityHandler = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Solo activar el temporizador si el usuario está autenticado y no está en login
  const isActive = user && location.pathname !== '/login';

  const handleTimeout = () => {
    // NO eliminar el progreso del cuestionario - permitir que el usuario lo recupere
    // El progreso guardado en localStorage permanecerá disponible cuando vuelva a iniciar sesión
    
    // Cerrar sesión
    logout();
    
    // Redirigir a login con mensaje de timeout
    navigate('/login', { 
      state: { 
        message: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente. Tu progreso del cuestionario se ha guardado.' 
      } 
    });
  };

  const { showWarning, timeLeft, formatTime, extendSession } = useInactivityTimer({
    onTimeout: handleTimeout,
    isActive
  });

  return (
    <>
      {showWarning && isActive && (
        <InactivityWarning
          timeLeft={timeLeft}
          formatTime={formatTime}
          onExtend={extendSession}
        />
      )}
      {children}
    </>
  );
};

InactivityHandler.propTypes = {
  children: PropTypes.node.isRequired
};

export default InactivityHandler;
