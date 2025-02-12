import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import PropTypes from 'prop-types';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <button 
        onClick={() => navigate(to)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-white/10 text-white' 
            : 'text-indigo-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{text}</span>
      </button>
    );
  };

  NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {user && (
            <>
              {/* Logo y nombre de la app */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                  <span className="text-white font-bold text-lg">VocaTest</span>
                </div>
                
                {/* Enlaces de navegación */}
                <div className="hidden md:flex items-center space-x-2">
                  <NavLink 
                    to="/" 
                    icon={HomeIcon} 
                    text="Inicio" 
                  />
                  <NavLink 
                    to="/questionnaire" 
                    icon={ClipboardDocumentListIcon} 
                    text="Test" 
                  />
                  <NavLink 
                    to="/profile" 
                    icon={UserCircleIcon} 
                    text="Perfil" 
                  />
                </div>
              </div>

              {/* Perfil y logout */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/10">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {user && (
        <div className="md:hidden border-t border-white/10">
          <div className="flex justify-around py-2">
            <NavLink 
              to="/" 
              icon={HomeIcon} 
              text="Inicio" 
            />
            <NavLink 
              to="/questionnaire" 
              icon={ClipboardDocumentListIcon} 
              text="Test" 
            />
            <NavLink 
              to="/profile" 
              icon={UserCircleIcon} 
              text="Perfil" 
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;