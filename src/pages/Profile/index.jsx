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
  DocumentChartBarIcon,
  TrophyIcon,
  CalendarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';
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
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 md:py-10 rounded-b-3xl shadow-lg">
      <div className="text-center px-4">
        <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
          <UserCircleIcon className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'Juan Pérez'}</h1>
        <p className="text-indigo-100 mt-2 text-sm md:text-base">{user?.email || 'juan.perez@ejemplo.com'}</p>
      </div>
    </div>
  );

  const renderStatistics = () => {
    const totalTests = results.length;
    const avgConfidence = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length)
      : 0;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
        <StatCard 
          icon={AcademicCapIcon} 
          label="Tests Completados" 
          value={totalTests} 
          color="text-green-500"
        />
        <StatCard 
          icon={CalendarIcon} 
          label="Último Test" 
          value={latestResult ? new Date(latestResult.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'N/A'} 
          color="text-blue-500"
        />
        <StatCard 
          icon={ArrowTrendingUpIcon}
          label="Confianza Promedio" 
          value={avgConfidence > 0 ? `${avgConfidence}%` : 'N/A'}
          color="text-purple-500"
        />
        <StatCard 
          icon={SparklesIcon}
          label="Total Respuestas" 
          value={results.reduce((sum, r) => sum + (r.answers?.length || 0), 0)}
          color="text-yellow-500"
        />
      </div>
    );
  };

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

    const topCareers = latestResult?.topCareers || latestResult?.results?.topCareers || [];
    const profile = latestResult?.profile || {};

    return (
      <div className="space-y-6">
        {/* Carrera Recomendada Principal */}
        {latestResult?.predictedCareer && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <TrophyIcon className="h-12 w-12" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">Tu Mejor Carrera</p>
                  <h2 className="text-2xl md:text-3xl font-bold">{latestResult.predictedCareer}</h2>
                  <p className="text-indigo-100 text-sm mt-2">
                    Realizado el {new Date(latestResult.completedAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {latestResult.confidence && (
                <div className="text-center bg-white/20 rounded-xl p-4">
                  <p className="text-indigo-100 text-sm mb-1">Confianza</p>
                  <p className="text-4xl font-bold">{latestResult.confidence}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Carreras */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Top 5 Carreras</h2>
              <button
                onClick={() => navigate('/test-history')}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Ver Historial
              </button>
            </div>

            {topCareers.length > 0 ? (
              <div className="space-y-3">
                {topCareers.slice(0, 5).map((career, index) => {
                  const careerName = career.carrera || career.name || career.career;
                  const careerScore = career.porcentaje || career.score || career.percentage;
                  return (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-7 h-7 bg-indigo-600 text-white rounded-full font-bold text-sm mr-3">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm">
                            {careerName}
                          </span>
                        </div>
                        <span className={`font-bold ${
                          careerScore >= 90 ? 'text-green-600' : 
                          careerScore >= 80 ? 'text-indigo-600' : 
                          'text-blue-600'
                        }`}>
                          {careerScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full"
                          style={{ width: `${careerScore}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">
                No hay datos de carreras disponibles
              </p>
            )}
          </div>

          {/* Perfil Vocacional RIASEC */}
          {profile && Object.keys(profile).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Perfil RIASEC</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { code: 'R', name: 'Realista' },
                  { code: 'I', name: 'Investigador' },
                  { code: 'A', name: 'Artístico' },
                  { code: 'S', name: 'Social' },
                  { code: 'E', name: 'Emprendedor' },
                  { code: 'C', name: 'Convencional' }
                ].map(dim => (
                  <div key={dim.code} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs md:text-sm font-bold text-gray-700">{dim.name}</span>
                      <span className="text-sm font-bold text-indigo-600">
                        {profile[dim.code] ? `${profile[dim.code].toFixed(1)}/5` : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${((profile[dim.code] || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inteligencias Múltiples y Rendimiento */}
        {profile && Object.keys(profile).length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Inteligencias Gardner */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Inteligencias Múltiples (Gardner)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { code: 'LM', name: 'Lógico-Matemática' },
                  { code: 'L', name: 'Lingüística' },
                  { code: 'ES', name: 'Espacial' },
                  { code: 'M', name: 'Musical' },
                  { code: 'CK', name: 'Corporal-Cinética' },
                  { code: 'IP', name: 'Interpersonal' },
                  { code: 'IA', name: 'Intrapersonal' },
                  { code: 'N', name: 'Naturalista' }
                ].map(dim => (
                  <div key={dim.code} className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs font-bold text-gray-700 mb-1">{dim.name}</p>
                    <p className="text-base md:text-lg font-bold text-green-600">
                      {profile[dim.code] ? `${profile[dim.code].toFixed(1)}/5` : 'N/A'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${((profile[dim.code] || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rendimiento Académico */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rendimiento</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {profile.Rendimiento_General || 'N/A'}/5
                  </p>
                  <p className="text-xs text-gray-600 mt-1">General</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {profile.Rendimiento_STEM || 'N/A'}/5
                  </p>
                  <p className="text-xs text-gray-600 mt-1">STEM</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {profile.Rendimiento_Humanidades || 'N/A'}/5
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Humanidades</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historial de Tests */}
        {results.length > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tests Anteriores</h2>
            <div className="space-y-3">
              {results.slice(1, 4).map((result, index) => (
                <div 
                  key={result.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/test-result/${result.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <DocumentChartBarIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {result.predictedCareer || 'Test #' + (index + 2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(result.completedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  {result.confidence && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      result.confidence >= 80 ? 'bg-green-100 text-green-800' :
                      result.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {result.confidence}%
                    </span>
                  )}
                </div>
              ))}
            </div>
            {results.length > 4 && (
              <button
                onClick={() => navigate('/test-history')}
                className="w-full mt-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
              >
                Ver todos los tests ({results.length})
              </button>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-4">
          {latestResult && (
            <button
              onClick={() => navigate(`/test-result/${latestResult.id}`)}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <EyeIcon className="h-5 w-5" />
              <span>Ver Detalles Completos</span>
            </button>
          )}
          <button
            onClick={() => navigate('/questionnaire')}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <DocumentChartBarIcon className="h-5 w-5" />
            <span>Realizar Nuevo Test</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {renderProfileHeader()}
      
      <div className="max-w-7xl mx-auto -mt-10 relative z-10 px-4">
        {renderStatistics()}
        
        <div className="mt-8">
          {renderResultSection()}
        </div>
      </div>
    </div>
  );
};

export default Profile;