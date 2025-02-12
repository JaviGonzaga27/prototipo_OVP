// src/components/common/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {user && (
            <>
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/')}
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-white mr-4">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;