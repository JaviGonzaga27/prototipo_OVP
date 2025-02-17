// src/pages/Results/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';

function ResultCategory({ category, score }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-blue-400 to-blue-600';
    if (score >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg capitalize mb-2">{category}</h3>
      <div className="flex items-center space-x-2">
        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)}`}
          />
        </div>
        <span className="font-semibold text-sm">{score}%</span>
      </div>
    </div>
  );
}

ResultCategory.propTypes = {
  category: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
};

function CareerCard({ career, index }) {
  const [showDetails, setShowDetails] = useState(false);

  const getMatchColor = (match) => {
    if (match >= 90) return 'from-green-400 to-green-600';
    if (match >= 70) return 'from-blue-400 to-blue-600';
    if (match >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{career.name}</h3>
          <span className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getMatchColor(career.match)}`}>
            {career.match}% Match
          </span>
        </div>

        <p className="text-gray-600 mb-4">{career.description}</p>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Compatibilidad</p>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${career.match}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${getMatchColor(career.match)}`}
              />
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors"
          >
            {showDetails ? 'Ver menos' : 'Ver más detalles'}
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Áreas de Estudio 📚</h4>
                <div className="flex flex-wrap gap-2">
                  {career.areas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Habilidades Clave 🎯</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Salidas Profesionales 💼</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {career.jobOpportunities.map((job, i) => (
                    <li key={i}>{job}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

CareerCard.propTypes = {
  career: PropTypes.shape({
    name: PropTypes.string.isRequired,
    match: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    areas: PropTypes.arrayOf(PropTypes.string).isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    jobOpportunities: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

function ShareButton({ platform, icon, color, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${color}`}
    >
      <span>{icon}</span>
      <span>Compartir en {platform}</span>
    </motion.button>
  );
}

ShareButton.propTypes = {
  platform: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

function Results() {
  const navigate = useNavigate();
  const { state } = useQuestionnaire();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.results) {
      navigate('/questionnaire');
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, state.results]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 text-lg">Analizando tus respuestas...</p>
        </div>
      </div>
    );
  }

  if (!state.results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ¡Tus Resultados Están Listos! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Basado en tus respuestas, estas son las carreras que mejor se ajustan a tu perfil
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <ShareButton
              platform="Instagram"
              icon="📸"
              color="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => {/* Implementar lógica de compartir */ }}
            />
            <ShareButton
              platform="Twitter"
              icon="🐦"
              color="bg-blue-500"
              onClick={() => {/* Implementar lógica de compartir */ }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(state.results.categoryScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([category, score]) => (
              <ResultCategory
                key={category}
                category={category}
                score={score}
              />
            ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Carreras Recomendadas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.results.careers.map((career, index) => (
            <CareerCard key={index} career={career} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Ver mi perfil completo 👤
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;