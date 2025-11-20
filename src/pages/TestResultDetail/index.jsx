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
  DocumentTextIcon,
  PrinterIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { DocumentTextIcon as DocumentTextIconSolid } from '@heroicons/react/24/solid';

const TestResultDetail = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar resultado del test
        const resultData = await getTestResultById(token, resultId);
        setResult(resultData.result);
        
        // Cargar preguntas
        const questionsResponse = await fetch('http://localhost:5000/api/questions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const questionsData = await questionsResponse.json();
        if (questionsData.success) {
          setQuestions(questionsData.questions);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && resultId) {
      fetchData();
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

  const topCareers = result.topCareers || result.results?.topCareers || result.results || [];
  const profile = result.profile || {};

  return (
    <>
      {/* Estilos de impresión */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0.5cm;
            font-size: 9pt;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 no-print">
          <button
            onClick={() => navigate('/test-history')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver al Historial
          </button>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Resultado del Test Vocacional
                </h1>
                <div className="flex items-center mt-2 text-gray-600 text-sm md:text-base">
                  <ClockIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  <span>{formatDate(result.completedAt)}</span>
                </div>
              </div>
              <div>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm md:text-base"
                >
                  <PrinterIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificado para impresión */}
        <div id="printable-certificate" className="hidden print:block">
          <div className="bg-white" style={{fontSize: '9pt', lineHeight: '1.2'}}>
            <div className="border-4 border-double border-indigo-600 p-4 rounded-lg">
              {/* Encabezado compacto */}
              <div className="text-center mb-3">
                <div className="flex justify-center mb-2">
                  <AcademicCapIcon className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">CERTIFICADO</h1>
                <p className="text-sm text-gray-600">de Orientación Vocacional</p>
                <div className="w-20 h-0.5 bg-indigo-600 mx-auto mt-2"></div>
              </div>

              {/* Información del estudiante */}
              <div className="text-center mb-3">
                <p className="text-xs text-gray-600 mb-1">Se certifica que</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{user?.name || 'Estudiante'}</p>
                <p className="text-xs text-gray-600">Ha completado exitosamente el Test de Orientación Vocacional</p>
                <p className="text-xs text-gray-500 mt-1">
                  el {new Date(result.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Carrera recomendada */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded p-3 mb-3">
                <div className="text-center">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Carrera Recomendada</p>
                  <p className="text-base font-bold text-gray-900 mb-2">{result.predictedCareer || 'N/A'}</p>
                  <div className="flex items-center justify-center space-x-3">
                    <div>
                      <p className="text-xs text-gray-600">Compatibilidad</p>
                      <p className="text-sm font-bold text-indigo-600">{result.confidence || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout de dos columnas para optimizar espacio */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Top 5 Carreras */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Top 5 Carreras</h3>
                  <div className="space-y-1.5">
                    {topCareers.slice(0, 5).map((career, index) => (
                      <div key={index} className="flex items-center justify-between text-xs border-b border-gray-200 pb-1">
                        <div className="flex items-center flex-1 min-w-0 mr-2">
                          <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0">{index + 1}</span>
                          <span className="font-medium text-gray-900 truncate">{career.carrera || career.name || career.career}</span>
                        </div>
                        <span className="font-bold text-indigo-600 flex-shrink-0">{career.porcentaje || career.percentage || career.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perfiles */}
                <div>
                  {profile && Object.keys(profile).length > 0 && (
                    <>
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">RIASEC</h3>
                        <div className="grid grid-cols-6 gap-1">
                          {['R', 'I', 'A', 'S', 'E', 'C'].map(dim => (
                            <div key={dim} className="text-center border border-gray-200 rounded p-1">
                              <p className="text-xs font-bold text-gray-700">{dim}</p>
                              <p className="text-xs font-bold text-indigo-600">{profile[dim]?.toFixed(1) || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Gardner</h3>
                        <div className="grid grid-cols-4 gap-1">
                          {['LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N'].map(dim => (
                            <div key={dim} className="text-center border border-gray-200 rounded p-1">
                              <p className="text-xs font-bold text-gray-700">{dim}</p>
                              <p className="text-xs font-bold text-green-600">{profile[dim]?.toFixed(1) || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Respuestas del Test - compacto */}
              {questions.length > 0 && result.answers && (
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Respuestas del Test</h3>
                  <div className="grid grid-cols-3 gap-1" style={{fontSize: '7pt'}}>
                    {questions.map((question, index) => {
                      const answer = result.answers[`q${question.id}`];
                      if (!answer) return null;
                      
                      return (
                        <div key={question.id} className="flex items-center justify-between border border-gray-200 rounded px-1 py-0.5">
                          <span className="text-gray-600 mr-1">P{index + 1}</span>
                          <span className={`font-bold ${
                            answer >= 4 ? 'text-green-600' :
                            answer >= 3 ? 'text-yellow-600' :
                            answer >= 2 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>{answer}/5</span>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-center" style={{fontSize: '8pt'}}>
                    <div className="bg-indigo-50 rounded p-1">
                      <p className="text-gray-600">Total: <span className="font-bold text-indigo-600">{questions.length}</span></p>
                    </div>
                    <div className="bg-purple-50 rounded p-1">
                      <p className="text-gray-600">Promedio: <span className="font-bold text-purple-600">
                        {(Object.values(result.answers).filter(v => typeof v === 'number').reduce((a, b) => a + b, 0) / 
                          Object.values(result.answers).filter(v => typeof v === 'number').length).toFixed(2)}/5
                      </span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recomendaciones compactas */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Recomendaciones</h3>
                <div className="grid grid-cols-3 gap-2" style={{fontSize: '7pt'}}>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-bold text-xs mb-1">Próximos Pasos</p>
                    <ul className="space-y-0.5 text-gray-600">
                      <li>• Investigar programas universitarios</li>
                      <li>• Buscar experiencias prácticas</li>
                      <li>• Contactar profesionales</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-bold text-xs mb-1">Recursos</p>
                    <ul className="space-y-0.5 text-gray-600">
                      <li>• Portales universitarios</li>
                      <li>• Ferias vocacionales</li>
                      <li>• Cursos online</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="font-bold text-xs mb-1">Consejos</p>
                    <ul className="space-y-0.5 text-gray-600">
                      <li>• Seguir tus intereses</li>
                      <li>• Evaluar habilidades</li>
                      <li>• Mente abierta</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pie de certificado */}
              <div className="mt-3 pt-2 border-t-2 border-gray-300">
                <div className="flex justify-between items-center" style={{fontSize: '8pt'}}>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-1 px-4">
                      <p className="font-semibold text-gray-900">Sistema OVP</p>
                      <p className="text-xs text-gray-600">Orientación Vocacional</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-2 border-indigo-600 rounded-full flex items-center justify-center">
                      <div className="text-center" style={{fontSize: '6pt'}}>
                        <p className="font-bold text-indigo-600">SELLO</p>
                        <p className="text-indigo-600">OFICIAL</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-1 px-4">
                      <p className="font-semibold text-gray-900">ID: {result.id}</p>
                      <p className="text-xs text-gray-600">Código Verificación</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-2" style={{fontSize: '6pt', lineHeight: '1.1'}}>
                <p className="text-gray-500">Este certificado es generado automáticamente por el Sistema de Orientación Vocacional</p>
                <p className="text-gray-500">basado en el análisis de múltiples dimensiones vocacionales con IA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado Principal */}
        {result.predictedCareer && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-4 md:p-8 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <TrophyIcon className="h-10 w-10 md:h-12 md:w-12 text-yellow-500 mr-3 md:mr-4" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Tu Carrera Recomendada</p>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900">{result.predictedCareer}</h2>
                </div>
              </div>
              {result.confidence && (
                <div className="text-left md:text-right">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Nivel de Confianza</p>
                  <span className={`text-2xl md:text-3xl font-bold ${
                    result.confidence >= 80 ? 'text-green-600' :
                    result.confidence >= 60 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {result.confidence}%
                  </span>
                </div>
              )}
            </div>
            {result.confidence && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      result.confidence >= 80 ? 'bg-green-600' :
                      result.confidence >= 60 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 no-print">
          {/* Carreras Recomendadas */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center mb-4 md:mb-6">
              <AcademicCapIcon className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 mr-2 md:mr-3" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Carreras Recomendadas
              </h2>
            </div>

            {topCareers.length > 0 ? (
              <div className="space-y-4">
                {topCareers.map((career, index) => {
                  const careerName = career.carrera || career.name || career.career;
                  const careerScore = career.porcentaje || career.percentage || career.score;
                  return (
                    <div 
                      key={index} 
                      className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center flex-1 min-w-0 mr-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-bold text-gray-800 text-sm md:text-base truncate">
                            {careerName}
                          </span>
                        </div>
                        <span className="text-indigo-600 font-semibold text-base md:text-lg flex-shrink-0">
                          {careerScore}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${Math.min(careerScore, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay datos de carreras disponibles
              </p>
            )}
          </div>

          {/* Respuestas del Test */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center mb-4 md:mb-6">
              <ChartBarIcon className="h-6 w-6 md:h-8 md:w-8 text-purple-600 mr-2 md:mr-3" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Tus Respuestas
              </h2>
            </div>

            {questions.length > 0 && result.answers ? (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {questions.map((question, index) => {
                  const answer = result.answers[`q${question.id}`];
                  if (!answer) return null;
                  
                  // Colores por categoría
                  const categoryColors = {
                    'RIASEC': 'bg-blue-100 text-blue-600',
                    'Gardner': 'bg-green-100 text-green-600',
                    'Rendimiento': 'bg-yellow-100 text-yellow-600',
                    'Otros': 'bg-purple-100 text-purple-600'
                  };
                  
                  const categoryColor = categoryColors[question.category] || categoryColors['Otros'];
                  
                  return (
                    <div 
                      key={question.id}
                      className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start space-x-2 md:space-x-3 flex-1">
                          <span className={`flex items-center justify-center min-w-6 h-6 md:min-w-8 md:h-8 rounded-full font-bold text-xs ${categoryColor}`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-900">{question.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {question.category}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold ml-2 md:ml-3 whitespace-nowrap ${
                          answer >= 4 ? 'bg-green-100 text-green-800' :
                          answer >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          answer >= 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {typeof answer === 'number' ? answer : answer}/5
                        </span>
                      </div>
                      <div className="ml-11">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full transition-all ${
                              answer >= 4 ? 'bg-green-600' :
                              answer >= 3 ? 'bg-yellow-500' :
                              answer >= 2 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(answer / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIconSolid className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No hay respuestas disponibles para este test
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Las respuestas detalladas se guardan automáticamente con cada test
                </p>
              </div>
            )}

            {questions.length > 0 && result.answers && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="text-center p-2 md:p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">Total Preguntas</p>
                    <p className="text-xl md:text-2xl font-bold text-indigo-600">
                      {questions.length}
                    </p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">Promedio</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-600">
                      {(Object.values(result.answers).filter(v => typeof v === 'number').reduce((a, b) => a + b, 0) / 
                        Object.values(result.answers).filter(v => typeof v === 'number').length).toFixed(2)}/5
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Perfil Vocacional Detallado */}
        {profile && Object.keys(profile).length > 0 && (
          <div className="mt-4 md:mt-6 bg-white rounded-lg shadow p-4 md:p-6 no-print">
            <div className="flex items-center mb-4 md:mb-6">
              <ChartBarIcon className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 mr-2 md:mr-3" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Perfil Vocacional</h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* RIASEC */}
              <div>
                <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800">RIASEC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
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
                        <span className="text-xs md:text-sm font-medium text-gray-700">{dim.name}</span>
                        <span className="text-base md:text-lg font-bold text-indigo-600">
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

              {/* Gardner */}
              <div>
                <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800">Inteligencias Múltiples (Gardner)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
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
                    <div key={dim.code} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs md:text-sm font-medium text-gray-700">{dim.name}</span>
                        <span className="text-sm md:text-base font-bold text-green-600">
                          {profile[dim.code] ? `${profile[dim.code].toFixed(1)}/5` : 'N/A'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${((profile[dim.code] || 0) / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rendimiento */}
              {(profile.Rendimiento_General || profile.Rendimiento_STEM || profile.Rendimiento_Humanidades) && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Rendimiento Académico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{profile.Rendimiento_General || 'N/A'}/5</p>
                      <p className="text-sm text-gray-700 mt-1">General</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{profile.Rendimiento_STEM || 'N/A'}/5</p>
                      <p className="text-sm text-gray-700 mt-1">STEM</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{profile.Rendimiento_Humanidades || 'N/A'}/5</p>
                      <p className="text-sm text-gray-700 mt-1">Humanidades</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Análisis y Recomendaciones */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 no-print">
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
        <div className="mt-6 flex justify-center space-x-4 no-print">
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
    </>
  );
};

export default TestResultDetail;
