// src/pages/TestResultDetail/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTestResultById } from '../../services/auth';
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const TestResultDetail = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await getTestResultById(token, resultId);
        setResult(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && resultId) {
      fetchResult();
    }
  }, [token, resultId]);

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

  const getAnswerValue = (answer) => {
    const values = {
      'Muy poco': 1,
      'Poco': 2,
      'Neutral': 3,
      'Bastante': 4,
      'Mucho': 5
    };
    return values[answer] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando resultado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/test-history')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Volver al Historial
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Resultado no encontrado</p>
          <button
            onClick={() => navigate('/test-history')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Volver al Historial
          </button>
        </div>
      </div>
    );
  }

  const topCareers = result.results?.topCareers || result.results || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/test-history')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver al Historial
          </button>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Resultado del Test Vocacional
                </h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{formatDate(result.completedAt)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">ID del Test</p>
                <p className="text-lg font-semibold text-gray-900">#{result.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Carreras Recomendadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Carreras Recomendadas
              </h2>
            </div>

            {topCareers.length > 0 ? (
              <div className="space-y-4">
                {topCareers.map((career, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="font-bold text-gray-800">
                          {career.name || career.career}
                        </span>
                      </div>
                      <span className="text-indigo-600 font-semibold text-lg">
                        {career.percentage || career.score}%
                      </span>
                    </div>
                    
                    {career.description && (
                      <p className="text-sm text-gray-600 ml-11">
                        {career.description}
                      </p>
                    )}
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${career.percentage || career.score}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay datos de carreras disponibles
              </p>
            )}
          </div>

          {/* Respuestas del Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Tus Respuestas
              </h2>
            </div>

            {result.answers && result.answers.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {result.answers.map((answer, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Pregunta {answer.questionId || index + 1}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getAnswerValue(answer.answer) >= 4
                          ? 'bg-green-100 text-green-800'
                          : getAnswerValue(answer.answer) >= 3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {answer.answer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay respuestas disponibles
              </p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total de respuestas
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {result.answers?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis y Recomendaciones */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Análisis y Recomendaciones
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Próximos Pasos
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Investiga programas universitarios relacionados</li>
                <li>• Busca experiencias prácticas en el área</li>
                <li>• Contacta con profesionales del sector</li>
                <li>• Realiza cursos introductorios</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Recursos Útiles
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Portales de universidades</li>
                <li>• Ferias vocacionales</li>
                <li>• Plataformas de cursos online</li>
                <li>• Grupos de networking profesional</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Consejos
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sigue tus intereses genuinos</li>
                <li>• Considera el mercado laboral</li>
                <li>• Evalúa tus habilidades actuales</li>
                <li>• Mantén una mente abierta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/test-history')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ver Historial
          </button>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Realizar Nuevo Test
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ir a Mi Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultDetail;
