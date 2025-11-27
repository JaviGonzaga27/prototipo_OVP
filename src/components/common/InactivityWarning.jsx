// src/components/common/InactivityWarning.jsx
import PropTypes from 'prop-types';

const InactivityWarning = ({ timeLeft, formatTime, onExtend }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex-shrink-0">
                <svg 
                  className="h-6 w-6 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  ⚠️ Sesión por expirar por inactividad
                </p>
                <p className="text-xs opacity-90">
                  Tu sesión se cerrará automáticamente en{' '}
                  <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
              <button
                onClick={onExtend}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-md flex items-center space-x-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span>Extender sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="h-1 bg-orange-200">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ 
            width: `${(timeLeft / 120) * 100}%` // 120 segundos = 2 minutos
          }}
        />
      </div>
    </div>
  );
};

InactivityWarning.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  onExtend: PropTypes.func.isRequired,
};

export default InactivityWarning;
