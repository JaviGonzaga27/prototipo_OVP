// src/hooks/useInactivityTimer.js
import { useState, useEffect, useCallback, useRef } from 'react';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
const WARNING_TIME = 2 * 60 * 1000; // 2 minutos antes de cerrar sesión

export const useInactivityTimer = ({ onTimeout, isActive = true }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    setTimeLeft(WARNING_TIME / 1000); // Convertir a segundos
    
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setTimeLeft(0);

    // Configurar timeout de advertencia
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Configurar timeout de cierre de sesión
    timeoutRef.current = setTimeout(() => {
      clearAllTimers();
      if (onTimeout) {
        onTimeout();
      }
    }, INACTIVITY_TIMEOUT);
  }, [clearAllTimers, startCountdown, onTimeout]);

  const extendSession = useCallback(() => {
    console.log('⏰ Sesión extendida');
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Solo activar si isActive es true
    if (!isActive) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    // Eventos que reinician el timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    // Iniciar el timer al montar
    resetTimer();

    // Agregar listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Limpiar al desmontar
    return () => {
      clearAllTimers();
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isActive, showWarning, resetTimer, clearAllTimers]);

  // Formatear tiempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeLeft,
    formatTime,
    extendSession,
  };
};

export default useInactivityTimer;
