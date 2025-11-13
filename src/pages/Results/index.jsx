// src/pages/Results/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { useAuth } from '../../context/AuthContext';
import { saveTestResults } from '../../services/auth';

import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/solid';

const careerGroups = [
  {
    name: "Tecnología",
    careers: [
      { name: "Ingeniería de Sistemas", percentage: 85 },
      { name: "Ciencias de la Computación", percentage: 80 },
      { name: "Desarrollo de Software", percentage: 75 }
    ]
  },
  {
    name: "Ciencias",
    careers: [
      { name: "Biología", percentage: 70 },
      { name: "Química", percentage: 65 },
      { name: "Medicina", percentage: 60 }
    ]
  },
  {
    name: "Creatividad",
    careers: [
      { name: "Diseño Gráfico", percentage: 75 },
      { name: "Arquitectura", percentage: 70 },
      { name: "Comunicación Visual", percentage: 65 }
    ]
  },
  {
    name: "Humanidades",
    careers: [
      { name: "Psicología", percentage: 80 },
      { name: "Derecho", percentage: 75 },
      { name: "Recursos Humanos", percentage: 70 }
    ]
  }
];

const Results = () => {
  const navigate = useNavigate();
  const { state } = useQuestionnaire();
  const { token } = useAuth();
  const [topCareers, setTopCareers] = useState([]);
  const [statistics, setStatistics] = useState({
    tecnologia: 0,
    ciencias: 0,
    creatividad: 0,
    humanidades: 0
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const calculateResults = async () => {
      const answers = state.answers;
      const scores = {
        tecnologia: 0,
        ciencias: 0,
        creatividad: 0,
        humanidades: 0
      };

      // Simulación de cálculo de resultados
      Object.values(answers).forEach(answer => {
        switch(answer) {
          case "Mucho": 
            scores.tecnologia += 10;
            scores.ciencias += 8;
            break;
          case "Bastante": 
            scores.creatividad += 6;
            scores.humanidades += 5;
            break;
          case "Neutral":
            Object.keys(scores).forEach(key => scores[key] += 3);
            break;
        }
      });

      // Ordenar carreras por puntuación
      const sortedCareers = careerGroups
        .flatMap(group => 
          group.careers.map(career => ({
            ...career,
            group: group.name,
            score: scores[group.name.toLowerCase()]
          }))
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setTopCareers(sortedCareers);
      setStatistics(scores);

      // Guardar resultados en la base de datos
      if (!saved && token) {
        try {
          const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            answer
          }));

          const resultsArray = sortedCareers.map(career => ({
            career: career.name,
            score: career.percentage,
            description: career.group
          }));

          await saveTestResults(token, answersArray, resultsArray);
          setSaved(true);
        } catch (error) {
          console.error('Error al guardar resultados:', error);
        }
      }
    };

    calculateResults();
  }, [state.answers, token, saved]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Resultados de Tu Test Vocacional</h1>
          <p className="text-xl text-indigo-100">Descubre tu camino profesional</p>
        </div>
  
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Carreras Recomendadas */}
          <div>
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Top 3 Carreras Recomendadas
              </h2>
            </div>
            {topCareers.map((career, index) => (
              <div 
                key={career.name} 
                className="mb-6 p-5 bg-gray-100 rounded-xl transform transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl font-bold text-indigo-600">
                      {index + 1}
                    </span>
                    <span className="font-bold text-gray-800">{career.name}</span>
                  </div>
                  <span className="text-indigo-600 font-semibold">
                    {career.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
                    style={{width: `${career.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Estadísticas de Intereses */}
          <div>
            <div className="flex items-center mb-6">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Estadísticas de Intereses
              </h2>
            </div>
            {Object.entries(statistics).map(([key, value]) => (
              <div key={key} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-medium text-gray-700 capitalize">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {value}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                    style={{width: `${value}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Sección de Recomendaciones */}
        <div className="bg-gray-50 p-8">
          <div className="flex items-center mb-6">
            <LightBulbIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Recomendaciones Personalizadas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Próximos Pasos
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Investigar programas universitarios</li>
                <li>• Contactar con profesionales del área</li>
                <li>• Realizar cursos introductorios</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Recursos Adicionales
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Guías vocacionales online</li>
                <li>• Ferias universitarias</li>
                <li>• Orientación profesional</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* Botones de Acción */}
        <div className="bg-white p-8 text-center">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Ir a Mi Perfil
            </button>
            <button
              onClick={() => {/* Acción de compartir */}}
              className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Compartir Resultados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;