// src/utils/calculateResults.js
import { careers } from '../constants/careers';

export function calculateResults(answers) {
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
  
    // Calcular puntajes por categoría
    answers.forEach(answer => {
      Object.entries(answer.categories).forEach(([category, score]) => {
        categoryScores[category] += score;
      });
    });
  
    // Normalizar puntajes a porcentajes
    const maxPossibleScore = answers.length * 5; // 5 es el puntaje máximo por respuesta
    Object.keys(categoryScores).forEach(category => {
      categoryScores[category] = Math.round((categoryScores[category] / maxPossibleScore) * 100);
    });
  
    return categoryScores;
  }
  
  export function getRecommendedCareers(categoryScores) {
    const recommendedCareers = [];
  
    // Revisar cada categoría y sus carreras
    Object.entries(careers).forEach(([category, careerList]) => {
      if (categoryScores[category] >= 50) { // Solo considerar categorías con puntaje mayor a 50%
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
  
    // Ordenar por match descendente
    return recommendedCareers.sort((a, b) => b.match - a.match);
  }