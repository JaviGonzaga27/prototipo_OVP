import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  UserCircleIcon,
  ClockIcon,
  EyeIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/solid';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { useAuth } from '../../context/AuthContext';
import { getMyTestResults } from '../../services/auth';



const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 transform transition-all hover:scale-105 hover:shadow-lg">
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getMyTestResults(token);
        setResults(data.results || []);
        if (data.results && data.results.length > 0) {
          setLatestResult(data.results[0]);
        }
      } catch (err) {
        console.error('Error al cargar resultados:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResults();
    }
  }, [token]);

  const handleDownloadResults = () => {
    alert('Descargando resultados...');
  };

  const renderProfileHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 rounded-b-3xl shadow-lg">
      <div className="text-center">
        <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
          <UserCircleIcon className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-3xl font-bold">{user?.name || 'Juan Pérez'}</h1>
        <p className="text-indigo-100 mt-2">{user?.email || 'juan.perez@ejemplo.com'}</p>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      <StatCard 
        icon={AcademicCapIcon} 
        label="Tests Completados" 
        value={results.length} 
        color="text-green-500"
      />
      <StatCard 
        icon={ChartBarIcon} 
        label="Último Test" 
        value={latestResult ? new Date(latestResult.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} 
        color="text-blue-500"
      />
      <StatCard 
        icon={ClockIcon}
        label="Total Respuestas" 
        value={results.reduce((sum, r) => sum + (r.answers?.length || 0), 0)}
        color="text-purple-500"
      />
    </div>
  );

  const renderResultSection = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando resultados...</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <DocumentChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes resultados aún
          </h3>
          <p className="text-gray-600 mb-6">
            Realiza tu primer test vocacional para descubrir tu camino profesional
          </p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Realizar Test
          </button>
        </div>
      );
    }

    const topCareers = latestResult?.results?.topCareers || [];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Último Test Realizado</h2>
          <button
            onClick={() => navigate('/test-history')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <EyeIcon className="h-5 w-5 mr-1" />
            Ver Historial
          </button>
        </div>

        {topCareers.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Realizado el {new Date(latestResult.completedAt).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {topCareers.slice(0, 5).map((career, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {career.name || career.career}
                  </span>
                </div>
                <span className={`font-bold text-lg ${
                  (career.score || career.percentage) >= 90 ? 'text-green-600' : 
                  (career.score || career.percentage) >= 80 ? 'text-indigo-600' : 
                  'text-blue-600'
                }`}>
                  {career.score || career.percentage}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No hay datos de carreras disponibles en este resultado
          </p>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(`/test-result/${latestResult.id}`)}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
          >
            <EyeIcon className="h-5 w-5" />
            <span>Ver Detalles</span>
          </button>
          <button
            onClick={() => navigate('/questionnaire')}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2"
          >
            <DocumentChartBarIcon className="h-5 w-5" />
            <span>Nuevo Test</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderProfileHeader()}
      
      <div className="max-w-4xl mx-auto -mt-10 relative z-10 px-4">
        {renderStatistics()}
        
        <div className="mt-8">
          {renderResultSection()}
        </div>
      </div>
    </div>
  );
};

export default Profile;