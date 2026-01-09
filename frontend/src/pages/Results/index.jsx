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
                  el {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Carrera recomendada */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded p-3 mb-3">
                <div className="text-center">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Carrera Recomendada</p>
                  <p className="text-base font-bold text-gray-900 mb-2">{prediction.carrera_recomendada}</p>
                  <div className="flex items-center justify-center space-x-3">
                    <div>
                      <p className="text-xs text-gray-600">Compatibilidad</p>
                      <p className="text-sm font-bold text-indigo-600">{prediction.confianza}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 5 Carreras */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">Top 5 Carreras Compatibles</h3>
                <div className="space-y-1.5">
                  {prediction.top_5_carreras.map((career, index) => (
                    <div key={index} className="flex items-center justify-between text-xs border-b border-gray-200 pb-1">
                      <div className="flex items-center flex-1 min-w-0 mr-2">
                        <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0">{index + 1}</span>
                        <span className="font-medium text-gray-900 truncate">{career.carrera}</span>
                      </div>
                      <span className="font-bold text-indigo-600 flex-shrink-0">{career.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfiles con gráficos de pastel */}
              {prediction.perfil && Object.keys(prediction.perfil).length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* RIASEC */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1 text-center">Perfil RIASEC</h3>
                    <p className="text-xs text-gray-600 mb-2 text-center" style={{fontSize: '7pt'}}>
                      Modelo de Holland que clasifica intereses vocacionales en seis tipos de personalidad laboral.
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Gráfico */}
                      <div className="flex-shrink-0">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          {(() => {
                            const dimensions = [
                              { code: 'R', name: 'Realista', color: '#3b82f6' },
                              { code: 'I', name: 'Investigador', color: '#8b5cf6' },
                              { code: 'A', name: 'Artístico', color: '#ec4899' },
                              { code: 'S', name: 'Social', color: '#10b981' },
                              { code: 'E', name: 'Emprendedor', color: '#f59e0b' },
                              { code: 'C', name: 'Convencional', color: '#6366f1' }
                            ];
                            const total = dimensions.reduce((sum, dim) => sum + (prediction.perfil[dim.code] || 0), 0);
                            let currentAngle = -90;
                            
                            return dimensions.map((dim, index) => {
                              const value = prediction.perfil[dim.code] || 0;
                              const percentage = total > 0 ? (value / total) * 100 : 0;
                              const angle = (percentage / 100) * 360;
                              const startAngle = currentAngle;
                              const endAngle = currentAngle + angle;
                              currentAngle = endAngle;
                              
                              const startRad = (startAngle * Math.PI) / 180;
                              const endRad = (endAngle * Math.PI) / 180;
                              const x1 = 60 + 55 * Math.cos(startRad);
                              const y1 = 60 + 55 * Math.sin(startRad);
                              const x2 = 60 + 55 * Math.cos(endRad);
                              const y2 = 60 + 55 * Math.sin(endRad);
                              const largeArc = angle > 180 ? 1 : 0;
                              
                              return (
                                <path
                                  key={dim.code}
                                  d={`M 60 60 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={dim.color}
                                  stroke="white"
                                  strokeWidth="1"
                                />
                              );
                            });
                          })()}
                        </svg>
                      </div>
                      {/* Leyenda */}
                      <div className="flex-1 space-y-1" style={{fontSize: '7pt'}}>
                        {[
                          { code: 'R', name: 'Realista', color: '#3b82f6' },
                          { code: 'I', name: 'Investigador', color: '#8b5cf6' },
                          { code: 'A', name: 'Artístico', color: '#ec4899' },
                          { code: 'S', name: 'Social', color: '#10b981' },
                          { code: 'E', name: 'Emprendedor', color: '#f59e0b' },
                          { code: 'C', name: 'Convencional', color: '#6366f1' }
                        ].map(dim => (
                          <div key={dim.code} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" style={{backgroundColor: dim.color}}></div>
                              <span className="text-gray-700">{dim.name}</span>
                            </div>
                            <span className="font-bold text-gray-900 ml-1">{prediction.perfil[dim.code]?.toFixed(1) || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gardner */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1 text-center">Inteligencias Múltiples</h3>
                    <p className="text-xs text-gray-600 mb-2 text-center" style={{fontSize: '7pt'}}>
                      Teoría de Gardner que identifica ocho tipos diferentes de inteligencias en el ser humano.
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Gráfico */}
                      <div className="flex-shrink-0">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          {(() => {
                            const dimensions = [
                              { code: 'LM', name: 'Lógico-Matemática', color: '#ef4444' },
                              { code: 'L', name: 'Lingüística', color: '#f97316' },
                              { code: 'ES', name: 'Espacial', color: '#eab308' },
                              { code: 'M', name: 'Musical', color: '#84cc16' },
                              { code: 'CK', name: 'Corporal-Cinética', color: '#22c55e' },
                              { code: 'IP', name: 'Interpersonal', color: '#14b8a6' },
                              { code: 'IA', name: 'Intrapersonal', color: '#06b6d4' },
                              { code: 'N', name: 'Naturalista', color: '#8b5cf6' }
                            ];
                            const total = dimensions.reduce((sum, dim) => sum + (prediction.perfil[dim.code] || 0), 0);
                            let currentAngle = -90;
                            
                            return dimensions.map((dim, index) => {
                              const value = prediction.perfil[dim.code] || 0;
                              const percentage = total > 0 ? (value / total) * 100 : 0;
                              const angle = (percentage / 100) * 360;
                              const startAngle = currentAngle;
                              const endAngle = currentAngle + angle;
                              currentAngle = endAngle;
                              
                              const startRad = (startAngle * Math.PI) / 180;
                              const endRad = (endAngle * Math.PI) / 180;
                              const x1 = 60 + 55 * Math.cos(startRad);
                              const y1 = 60 + 55 * Math.sin(startRad);
                              const x2 = 60 + 55 * Math.cos(endRad);
                              const y2 = 60 + 55 * Math.sin(endRad);
                              const largeArc = angle > 180 ? 1 : 0;
                              
                              return (
                                <path
                                  key={dim.code}
                                  d={`M 60 60 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={dim.color}
                                  stroke="white"
                                  strokeWidth="1"
                                />
                              );
                            });
                          })()}
                        </svg>
                      </div>
                      {/* Leyenda */}
                      <div className="flex-1 space-y-0.5" style={{fontSize: '6.5pt'}}>
                        {[
                          { code: 'LM', name: 'Lógico-Matemática', color: '#ef4444' },
                          { code: 'L', name: 'Lingüística', color: '#f97316' },
                          { code: 'ES', name: 'Espacial', color: '#eab308' },
                          { code: 'M', name: 'Musical', color: '#84cc16' },
                          { code: 'CK', name: 'Corporal-Cinética', color: '#22c55e' },
                          { code: 'IP', name: 'Interpersonal', color: '#14b8a6' },
                          { code: 'IA', name: 'Intrapersonal', color: '#06b6d4' },
                          { code: 'N', name: 'Naturalista', color: '#8b5cf6' }
                        ].map(dim => (
                          <div key={dim.code} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-1 flex-shrink-0" style={{backgroundColor: dim.color}}></div>
                              <span className="text-gray-700">{dim.name}</span>
                            </div>
                            <span className="font-bold text-gray-900 ml-1">{prediction.perfil[dim.code]?.toFixed(1) || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
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
                      <p className="font-semibold text-gray-900">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
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