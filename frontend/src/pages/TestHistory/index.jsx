// src/pages/TestHistory/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyTestResults } from '../../services/auth';
import { 
  ClockIcon, 
  ChartBarIcon,
  EyeIcon,
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';

const TestHistory = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getMyTestResults(token);
        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResults();
    }
  }, [token]);

  const handleViewResult = (resultId) => {
    navigate(`/test-result/${resultId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Historial de Tests
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Revisa todos tus resultados de tests vocacionales
              </p>
            </div>
            <button
              onClick={() => navigate('/questionnaire')}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
            >
              <DocumentChartBarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Nuevo Test
            </button>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Tests Completados</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ClockIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Último Test</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(results[0].completedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DocumentChartBarIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Respuestas Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {results.reduce((sum, r) => sum + (r.answers?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Lista de Resultados */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DocumentChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes tests completados
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
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          Test #{results.length - index}
                        </span>
                        <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completado
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDate(result.completedAt)}
                      </div>

                      {/* Carrera Principal y Confianza */}
                      {result.predictedCareer && (
                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-indigo-600 font-medium mb-1">Carrera Recomendada</p>
                              <p className="text-sm font-bold text-gray-900">{result.predictedCareer}</p>
                            </div>
                            {result.confidence && (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                result.confidence >= 80 ? 'bg-green-100 text-green-800' :
                                result.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {result.confidence}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Top 3 Carreras */}
                      {result.topCareers && result.topCareers.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-600 mb-2">
                            Top 3 Alternativas:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.topCareers.slice(0, 3).map((career, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                              >
                                {idx + 1}. {career.carrera} ({career.porcentaje}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-6">
                      <button
                        onClick={() => handleViewResult(result.id)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón Volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Volver al Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestHistory;
