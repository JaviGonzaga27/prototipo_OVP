// src/pages/Results/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../../context/QuestionnaireContext';

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
  const [topCareers, setTopCareers] = useState([]);
  const [statistics, setStatistics] = useState({
    tecnologia: 0,
    ciencias: 0,
    creatividad: 0,
    humanidades: 0
  });

  useEffect(() => {
    const calculateResults = () => {
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
    };

    calculateResults();
  }, [state.answers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Resultados de Tu Test Vocacional
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Top 3 Carreras Recomendadas</h2>
            {topCareers.map((career, index) => (
              <div 
                key={career.name} 
                className="mb-4 p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{index + 1}. {career.name}</span>
                  <span className="text-indigo-600 font-semibold">
                    {career.percentage}% Coincidencia
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{width: `${career.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
  
          <div>
            <h2 className="text-2xl font-semibold mb-4">Estadísticas de Intereses</h2>
            {Object.entries(statistics).map(([key, value]) => (
              <div key={key} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-capitalize">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="text-sm font-medium">{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{width: `${value}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ir a Mi Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;