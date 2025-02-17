// src/utils/calculateResults.js
import { careers } from '../constants/careers';

export function calculateResults(answers) {
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    console.error('No hay respuestas válidas para calcular');
    return {};
  }

  // Inicializar categorías
  const categoryScores = {
    tecnologia: 0,
    arte: 0,
    humanidades: 0,
    ciencias: 0,
    negocios: 0,
    comunicacion: 0,
    ingenieria: 0,
    salud: 0,
    educacion: 0,
    investigacion: 0,
    diseño: 0,
    administracion: 0
  };

  // Contador para cada categoría
  const categoryCount = {};
  Object.keys(categoryScores).forEach(category => {
    categoryCount[category] = 0;
  });

  // Calcular puntajes y contar apariciones de cada categoría
  answers.forEach(answer => {
    if (answer && answer.categories) {
      Object.entries(answer.categories).forEach(([category, score]) => {
        if (categoryScores.hasOwnProperty(category)) {
          categoryScores[category] += score;
          categoryCount[category]++;
        }
      });
    }
  });

  // Calcular porcentajes basados en el máximo posible para cada categoría
  Object.keys(categoryScores).forEach(category => {
    if (categoryCount[category] > 0) {
      // Cada pregunta tiene un máximo de 5 puntos
      const maxPossibleScore = categoryCount[category] * 5;
      const percentage = (categoryScores[category] / maxPossibleScore) * 100;
      categoryScores[category] = Math.round(percentage);
    }
  });

  return categoryScores;
}

export function getRecommendedCareers(categoryScores) {
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return [];
  }

  const recommendedCareers = [];

  Object.entries(careers).forEach(([category, careerList]) => {
    if (categoryScores[category] >= 50) {
      careerList.forEach(career => {
        if (categoryScores[category] >= career.minScore) {
          recommendedCareers.push({
            ...career,
            match: categoryScores[category]
          });
        }
      });
    }
  });

  return recommendedCareers.sort((a, b) => b.match - a.match);
}

// En el componente Questionnaire, modifica el handleFinishQuestionnaire:
const handleFinishQuestionnaire = () => {
  // Guardar la última respuesta
  if (currentAnswer) {
    dispatch({
      type: 'SET_ANSWER',
      questionId: state.currentQuestion,
      answer: currentAnswer
    });
  }

  // Convertir las respuestas del estado a un array de opciones con sus categorías
  const answersArray = questions.map((question, index) => {
    const answerText = state.answers[index];
    if (!answerText) return null;
    
    // Encontrar la opción seleccionada que contiene las categorías
    return question.options.find(opt => opt.text === answerText);
  }).filter(answer => answer !== null); // Eliminar respuestas nulas

  // Verificar que tengamos respuestas para procesar
  if (answersArray.length === 0) {
    console.error('No hay respuestas para procesar');
    return;
  }

  try {
    const categoryScores = calculateResults(answersArray);
    const recommendedCareers = getRecommendedCareers(categoryScores);

    console.log('Respuestas procesadas:', answersArray);
    console.log('Puntajes por categoría:', categoryScores);
    console.log('Carreras recomendadas:', recommendedCareers);

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
  } catch (error) {
    console.error('Error al calcular resultados:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};