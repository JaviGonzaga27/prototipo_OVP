// src/pages/Questionnaire/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getQuestions, predictCareer } from '../../services/auth';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Cargar preguntas desde el backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions(token);
        
        if (data.success && data.questions) {
          setQuestions(data.questions);
        } else {
          setError('No se pudieron cargar las preguntas');
        }
      } catch (err) {
        console.error('Error al cargar preguntas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  const handleAnswer = (option) => {
    setCurrentAnswer(option.value);
  };

  const handleNext = async () => {
    if (currentAnswer === null) {
      alert('Por favor, selecciona una respuesta');
      return;
    }

    // Guardar respuesta actual (usando el id de la pregunta como key)
    const newAnswers = {
      ...answers,
      [`q${questions[currentQuestion].id}`]: currentAnswer
    };
    setAnswers(newAnswers);

    // Si es la última pregunta, validar que todas estén respondidas
    if (currentQuestion === questions.length - 1) {
      // Verificar que todas las preguntas tengan respuesta
      const unansweredQuestions = questions.filter(q => newAnswers[`q${q.id}`] === undefined);
      
      if (unansweredQuestions.length > 0) {
        setValidationError(`Aún tienes ${unansweredQuestions.length} pregunta(s) sin responder. Por favor, completa todas las preguntas antes de finalizar.`);
        setTimeout(() => setValidationError(null), 5000); // Ocultar después de 5 segundos
        return;
      }

      try {
        setSubmitting(true);
        
        // Realizar predicción con el modelo ML
        const predictionData = await predictCareer(token, newAnswers);
        
        if (predictionData.success) {
          // Navegar a resultados con la predicción
          navigate('/results', { 
            state: { 
              prediction: predictionData.prediction,
              testId: predictionData.prediction.id
            } 
          });
        } else {
          alert('Error al procesar el test: ' + predictionData.message);
        }
      } catch (err) {
        console.error('Error al realizar predicción:', err);
        alert('Error al procesar el test: ' + err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Avanzar a la siguiente pregunta
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restaurar respuesta anterior si existe
      const previousAnswer = answers[`q${questions[currentQuestion - 1].id}`];
      setCurrentAnswer(previousAnswer !== undefined ? previousAnswer : null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>No hay preguntas disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando tus respuestas...</p>
          <p className="text-sm text-gray-500">Generando predicción con IA...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  // Progreso basado en preguntas respondidas
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  // Función para ir a una pregunta específica
  const goToQuestion = (index) => {
    // Permitir navegar a cualquier pregunta
    setCurrentQuestion(index);
    setCurrentAnswer(answers[`q${questions[index].id}`] || null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Mensaje de validación */}
        {validationError && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
            <div className="bg-red-50 border-2 border-red-500 rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-shake">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">Preguntas pendientes</h3>
                <p className="text-sm text-red-700">{validationError}</p>
              </div>
              <button 
                onClick={() => setValidationError(null)}
                className="flex-shrink-0 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Panel de preguntas - Abajo en móvil, lateral en desktop */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow p-4 lg:pb-4 lg:sticky lg:top-4 fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto z-10 lg:z-auto overflow-hidden" style={{ maxHeight: 'min(300px, 40vh)' }}>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Progreso</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{answeredCount}/{questions.length} respondidas</p>
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Preguntas</h3>
              </div>
              
              <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-2 overflow-y-auto pb-2" style={{ maxHeight: 'calc(min(300px, 40vh) - 120px)' }}>
                {questions.map((q, index) => {
                  const isAnswered = answers[`q${q.id}`] !== undefined;
                  const isCurrent = index === currentQuestion;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-8 h-8 lg:w-10 lg:h-10 rounded flex items-center justify-center text-xs lg:text-sm font-medium transition-all
                        ${isCurrent 
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2' 
                          : isAnswered 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3 order-1 lg:order-2 pb-80 lg:pb-0">
            <div className="bg-white rounded-lg shadow p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {currentQuestionData.category}
                  </span>
                </div>
              </div>

              {/* Pregunta */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                  {currentQuestionData.text}
                </h2>
              </div>

              {/* Opciones */}
              <div className="space-y-3 mb-8">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${currentAnswer === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-800">{option.label}</span>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${currentAnswer === option.value
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                        }
                      `}>
                        {currentAnswer === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Botones de navegación */}
              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all
                    ${currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  Anterior
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentAnswer === null}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all
                    ${currentAnswer === null
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }
                  `}
                >
                  {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;