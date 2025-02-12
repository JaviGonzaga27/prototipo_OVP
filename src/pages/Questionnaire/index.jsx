// src/pages/Questionnaire/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import PropTypes from 'prop-types';

// Componente para la pregunta individual
const Question = ({ question, onAnswer, onNext, onPrevious, isLast, currentQuestion, totalQuestions }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full" 
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Pregunta {currentQuestion + 1} de {totalQuestions}
      </div>
    </div>

    <h2 className="text-xl font-bold mb-4">{question.text}</h2>

    <div className="space-y-4">
      {question.options.map((option, index) => (
        <label 
          key={index}
          className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name="answer"
            value={option}
            onChange={() => onAnswer(option)}
            className="h-4 w-4 text-indigo-600"
          />
          <span className="ml-3">{option}</span>
        </label>
      ))}
    </div>

    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className={`px-4 py-2 rounded ${
          currentQuestion === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        Anterior
      </button>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {isLast ? 'Finalizar' : 'Siguiente'}
      </button>
    </div>
  </div>
);

// Agregamos PropTypes para Question
Question.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired
};

const Questionnaire = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuestionnaire();
  const [currentAnswer, setCurrentAnswer] = useState('');

  const questions = [
    {
      text: "¿Te interesa resolver problemas matemáticos?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Disfrutas trabajando con computadoras y tecnología?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te gusta interactuar con personas y resolver sus problemas?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te interesan las ciencias naturales como biología o química?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Disfrutas de actividades creativas como diseño o arte?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te gusta investigar y analizar información en profundidad?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te sientes cómodo liderando grupos o proyectos?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te interesan los temas relacionados con el medio ambiente?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Disfrutas de la escritura y la comunicación?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    },
    {
      text: "¿Te gustan las actividades que involucran números y finanzas?",
      options: ["Muy poco", "Poco", "Neutral", "Bastante", "Mucho"]
    }
  ];

  const handleAnswer = (answer) => {
    setCurrentAnswer(answer);
  };

  const handleNext = () => {
    if (currentAnswer) {
      dispatch({
        type: 'SET_ANSWER',
        questionId: state.currentQuestion,
        answer: currentAnswer
      });

      if (state.currentQuestion === questions.length - 1) {
        // Navegar a resultados cuando se complete el cuestionario
        navigate('/results');
      } else {
        dispatch({
          type: 'SET_CURRENT_QUESTION',
          questionId: state.currentQuestion + 1
        });
        setCurrentAnswer('');
      }
    } else {
      // Opcional: mostrar mensaje de que debe seleccionar una respuesta
      alert('Por favor, selecciona una respuesta');
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      dispatch({
        type: 'SET_CURRENT_QUESTION',
        questionId: state.currentQuestion - 1
      });
      setCurrentAnswer(state.answers[state.currentQuestion - 1] || '');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Question
        question={questions[state.currentQuestion]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLast={state.currentQuestion === questions.length - 1}
        currentQuestion={state.currentQuestion}
        totalQuestions={questions.length}
      />
    </div>
  );
};

export default Questionnaire;