// src/components/questionnaire/QuestionCard.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';

const QuestionCard = ({ question, onAnswer, onNext, onPrevious, isLast, currentQuestion, totalQuestions }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    onAnswer(selectedValue);
    onNext();
    setSelectedValue('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Barra de Progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-500">
          Pregunta {currentQuestion + 1} de {totalQuestions}
        </div>

        <h2 className="text-xl font-bold">
          {question.text}
        </h2>

        <div className="space-y-4">
          {question.options.map((option) => (
            <label 
              key={option}
              className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="questionOption"
                value={option}
                checked={selectedValue === option}
                onChange = {() => onAnswer(option)}
                //onChange={(e) => setSelectedValue(e.target.value)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="ml-3">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-md ${
              currentQuestion === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Anterior
          </button>
          
          <button
            onClick={handleNext}
            disabled={!selectedValue}
            className={`px-6 py-2 rounded-md ${
              !selectedValue
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLast ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

QuestionCard.propTypes = {
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

export default QuestionCard;