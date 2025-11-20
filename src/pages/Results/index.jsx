// src/pages/Results/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  TrophyIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PrinterIcon
} from '@heroicons/react/24/solid';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { prediction } = location.state || {};
  const [showDetails, setShowDetails] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (!prediction) {
      // Si no hay predicción, redirigir al cuestionario
      navigate('/questionnaire');
    }
  }, [prediction, navigate]);

  if (!prediction) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) return { text: 'Alta Confianza', color: 'bg-green-100 text-green-800' };
    if (confidence >= 60) return { text: 'Confianza Media', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Confianza Moderada', color: 'bg-orange-100 text-orange-800' };
  };

  const badge = getConfidenceBadge(prediction.confianza);

  return (
    <>
      {/* Estilos de impresión */}
      <style>{`
        @media print {
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
            padding: 40px;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
        {/* Header con animación */}
        <div className="text-center mb-8 no-print">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Test Completado!
          </h1>
          <p className="text-gray-600">
            Hemos analizado tus respuestas con nuestro modelo de IA
          </p>
          
          {/* Botón de impresión */}
          <button
            onClick={handlePrint}
            className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <PrinterIcon className="w-5 h-5 mr-2" />
            Imprimir Certificado
          </button>
        </div>

        {/* Certificado para impresión */}
        <div id="printable-certificate" className="hidden print:block">
          <div className="max-w-4xl mx-auto p-12 bg-white">
            {/* Encabezado del certificado */}
            <div className="border-8 border-double border-indigo-600 p-12 rounded-lg">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <AcademicCapIcon className="w-24 h-24 text-indigo-600" />
                </div>
                <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
                  CERTIFICADO
                </h1>
                <p className="text-xl text-gray-600">
                  de Orientación Vocacional
                </p>
                <div className="w-32 h-1 bg-indigo-600 mx-auto mt-4"></div>
              </div>

              {/* Información del estudiante */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-2">Se certifica que</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {user?.name || 'Estudiante'}
                </p>
                <p className="text-gray-600">
                  Ha completado exitosamente el Test de Orientación Vocacional
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  el {new Date().toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              {/* Resultado principal */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                    Carrera Recomendada
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {prediction.carrera_recomendada}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Compatibilidad</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {prediction.confianza}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 5 carreras */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Top 5 Carreras Compatibles
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {prediction.top_5_carreras.map((career, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{career.carrera}</span>
                      </div>
                      <span className="font-bold text-indigo-600">{career.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfil Vocacional RIASEC */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Perfil Vocacional (RIASEC)
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {['R', 'I', 'A', 'S', 'E', 'C'].map(dim => (
                    <div key={dim} className="text-center border border-gray-200 rounded p-2">
                      <p className="text-sm font-bold text-gray-700">{dim}</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {prediction.perfil[dim].toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inteligencias Múltiples */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Inteligencias Múltiples (Gardner)
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N'].map(dim => (
                    <div key={dim} className="text-center border border-gray-200 rounded p-2">
                      <p className="text-xs font-bold text-gray-700">{dim}</p>
                      <p className="text-sm font-bold text-green-600">
                        {prediction.perfil[dim].toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Firma y sello */}
              <div className="mt-12 pt-8 border-t-2 border-gray-300">
                <div className="flex justify-between items-end">
                  <div className="text-center flex-1">
                    <div className="border-t-2 border-gray-400 pt-2 mt-8 mx-12">
                      <p className="font-semibold text-gray-900">Sistema OVP</p>
                      <p className="text-sm text-gray-600">Orientación Vocacional</p>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-24 h-24 border-4 border-indigo-600 rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-bold text-indigo-600">SELLO</p>
                        <p className="text-xs text-indigo-600">OFICIAL</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="border-t-2 border-gray-400 pt-2 mt-8 mx-12">
                      <p className="font-semibold text-gray-900">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">Código de Verificación</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 text-xs text-gray-500">
                <p>Este certificado es generado automáticamente por el Sistema de Orientación Vocacional</p>
                <p>basado en el análisis de {Object.keys(prediction.perfil).length} dimensiones vocacionales con IA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carrera Recomendada Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-indigo-100 no-print">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <TrophyIcon className="w-10 h-10 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tu Carrera Recomendada</p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {prediction.carrera_recomendada}
                </h2>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.color}`}>
              {badge.text}
            </span>
          </div>

          {/* Barra de confianza */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Nivel de Compatibilidad</span>
              <span className={`text-2xl font-bold ${getConfidenceColor(prediction.confianza)}`}>
                {prediction.confianza}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  prediction.confianza >= 80 ? 'bg-green-600' :
                  prediction.confianza >= 60 ? 'bg-yellow-500' :
                  'bg-orange-500'
                }`}
                style={{ width: `${prediction.confianza}%` }}
              ></div>
            </div>
          </div>

          <p className="text-gray-600">
            Basado en tus intereses, habilidades y perfil vocacional, esta carrera tiene la mayor 
            compatibilidad con tu perfil. El modelo de IA ha analizado tus respuestas y las ha 
            comparado con miles de perfiles exitosos.
          </p>
        </div>

        {/* Top 5 Carreras */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 no-print">
          <div className="flex items-center mb-6">
            <ChartBarIcon className="w-8 h-8 text-indigo-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              Top 5 Carreras Compatibles
            </h3>
          </div>

          <div className="space-y-4">
            {prediction.top_5_carreras.map((career, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  index === 0 
                    ? 'border-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center flex-1">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold ${
                      index === 0 ? 'bg-indigo-600 text-white' :
                      index === 1 ? 'bg-indigo-400 text-white' :
                      index === 2 ? 'bg-indigo-300 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{career.carrera}</h4>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-indigo-600 ml-4">
                    {career.porcentaje}%
                  </span>
                </div>
                <div className="ml-11">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${career.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perfil Vocacional */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 no-print">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <AcademicCapIcon className="w-8 h-8 text-indigo-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                Tu Perfil Vocacional
              </h3>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-6">
              {/* RIASEC */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Intereses Vocacionales (RIASEC)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['R', 'I', 'A', 'S', 'E', 'C'].map(dim => (
                    <div key={dim} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{dim}</span>
                        <span className="text-sm font-bold text-indigo-600">
                          {prediction.perfil[dim].toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${(prediction.perfil[dim] / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gardner */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Inteligencias Múltiples (Gardner)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['LM', 'L', 'ES', 'M', 'CK', 'IP', 'IA', 'N'].map(dim => (
                    <div key={dim} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{dim}</span>
                        <span className="text-sm font-bold text-green-600">
                          {prediction.perfil[dim].toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${(prediction.perfil[dim] / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rendimiento */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Rendimiento Académico
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">General</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {prediction.perfil.Rendimiento_General}/5
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">STEM</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {prediction.perfil.Rendimiento_STEM}/5
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Humanidades</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {prediction.perfil.Rendimiento_Humanidades}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 no-print">
          <button
            onClick={() => navigate('/test-history')}
            className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Ver Historial de Tests
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={() => navigate('/questionnaire')}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Realizar Nuevo Test
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Results;