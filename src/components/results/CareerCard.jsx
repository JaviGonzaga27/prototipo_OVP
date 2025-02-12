// src/components/results/CareerCard.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';

const CareerCard = ({ title, description, matchPercentage, details }) => {
  const [showModal, setShowModal] = useState(false);

  const getColorClass = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:-translate-y-1 transition-transform duration-200">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold line-clamp-2">
              {title}
            </h3>
            <span className={`${getColorClass(matchPercentage)} text-sm font-medium px-3 py-1 rounded-full`}>
              {matchPercentage}% Match
            </span>
          </div>

          <p className="text-gray-600 line-clamp-3">
            {description}
          </p>

          <div>
            <p className="text-sm mb-1">Compatibilidad</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${matchPercentage >= 70 ? 'bg-indigo-600' : 'bg-yellow-500'}`}
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Ver más detalles
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600">{description}</p>
              </div>

              {details && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Campo Laboral</h3>
                    <p className="text-gray-600">{details.fieldWork}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Habilidades Requeridas</h3>
                    <div className="flex flex-wrap gap-2">
                      {details.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Duración Estimada</h3>
                    <p className="text-gray-600">{details.duration}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CareerCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  matchPercentage: PropTypes.number.isRequired,
  details: PropTypes.shape({
    fieldWork: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    duration: PropTypes.string
  })
};

export default CareerCard;