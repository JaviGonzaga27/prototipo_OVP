// src/pages/Questionnaire/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { calculateResults, getRecommendedCareers } from '../../utils/calculateResults';
import confetti from 'canvas-confetti';
import { questions } from '../../constants/questions';

function QuestionCard({ 
  question, 
  onAnswer, 
  onNext, 
  onPrevious, 
  isLast, 
  currentQuestion, 
  totalQuestions,
  currentAnswer 
}) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const optionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-8">
        <div className="text-sm text-purple-600 font-medium mb-2">
          Pregunta {currentQuestion + 1} de {totalQuestions}
        </div>
        
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {question.text}
        </motion.h2>
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {question.options.map((option, index) => (
            <motion.label 
              key={option.text}
              custom={index}
              variants={optionVariants}
              initial="hidden"
              animate="visible"
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                ${currentAnswer === option.text 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'}`}
            >
              <input
                type="radio"
                name="questionOption"
                value={option.text}
                checked={currentAnswer === option.text}
                onChange={() => onAnswer(option)}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-4 text-lg">{option.text}</span>
            </motion.label>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-full text-lg font-medium transition-colors
            ${currentQuestion === 0
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          ← Anterior
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!currentAnswer}
          className={`px-6 py-3 rounded-full text-lg font-medium
            ${!currentAnswer
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90'}`}
        >
          {isLast ? '¡Finalizar! 🎉' : 'Siguiente →'}
        </motion.button>
      </div>
    </motion.div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      categories: PropTypes.object.isRequired
    })).isRequired
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  currentAnswer: PropTypes.string
};

QuestionCard.defaultProps = {
  currentAnswer: ''
};

function Questionnaire() {
  const navigate = useNavigate();
  const { state, dispatch } = useQuestionnaire();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showMotivation, setShowMotivation] = useState(false);

  const motivationalPhrases = [
    "¡Vas súper bien! 🌟",
    "¡Sigue así, crack! 💪",
    "¡Estás descubriendo tu camino! 🚀",
    "¡Cada respuesta te acerca a tu futuro! ✨"
  ];

  const handleAnswer = (answer) => {
    setCurrentAnswer(answer.text);
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 2000);
  };

  const handleFinishQuestionnaire = () => {
    // Guardar la última respuesta
    if (currentAnswer) {
      dispatch({
        type: 'SET_ANSWER',
        questionId: state.currentQuestion,
        answer: currentAnswer
      });
    }

    // Calcular resultados
    const categoryScores = calculateResults(Object.values(state.answers));
    const recommendedCareers = getRecommendedCareers(categoryScores);
    
    dispatch({
      type: 'SET_RESULTS',
      results: {
        categoryScores,
        careers: recommendedCareers
      }
    });

    // Efecto de confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    navigate('/results');
  };

  const handleNext = () => {
    if (currentAnswer) {
      dispatch({
        type: 'SET_ANSWER',
        questionId: state.currentQuestion,
        answer: currentAnswer
      });

      if (state.currentQuestion === questions.length - 1) {
        handleFinishQuestionnaire();
      } else {
        dispatch({
          type: 'SET_CURRENT_QUESTION',
          questionId: state.currentQuestion + 1
        });
        setCurrentAnswer('');
      }
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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence>
          {showMotivation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-6"
            >
              <p className="text-xl text-purple-600 font-bold">
                {motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <QuestionCard
          question={questions[state.currentQuestion]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLast={state.currentQuestion === questions.length - 1}
          currentQuestion={state.currentQuestion}
          totalQuestions={questions.length}
          currentAnswer={currentAnswer}
        />
      </div>
    </div>
  );
}

export default Questionnaire;