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

    // Guardar respuesta actual (usando el order de la pregunta como key)
    const newAnswers = {
      ...answers,
      [`q${questions[currentQuestion].order}`]: currentAnswer
    };
    setAnswers(newAnswers);

    // Si es la última pregunta, enviar al backend para predicción
    if (currentQuestion === questions.length - 1) {
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
      const previousAnswer = answers[`q${questions[currentQuestion - 1].order}`];
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-2 flex justify-between">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
        </div>

        {/* Categoría y Dimensión */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {currentQuestionData.category} - {currentQuestionData.dimension}
          </span>
        </div>

        {/* Pregunta */}
        <h2 className="text-xl font-bold mb-6">{currentQuestionData.text}</h2>

        {/* Opciones */}
        <div className="space-y-3">
          {currentQuestionData.options.map((option, index) => (
            <label 
              key={index}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                currentAnswer === option.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option.value}
                checked={currentAnswer === option.value}
                onChange={() => handleAnswer(option)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="ml-3 flex-1">{option.label}</span>
              <span className="text-sm text-gray-500">({option.value})</span>
            </label>
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            ← Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={currentAnswer === null}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentAnswer === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar →' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;