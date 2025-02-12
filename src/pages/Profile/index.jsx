import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  UserCircleIcon 
} from '@heroicons/react/24/solid';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { useAuth } from '../../context/AuthContext';

// Datos simulados para pruebas
const mockResults = {
  careers: [
    { id: 1, name: "Ingeniería de Software", match: 95 },
    { id: 2, name: "Desarrollo de Videojuegos", match: 88 },
    { id: 3, name: "Ciencias de la Computación", match: 85 },
    { id: 4, name: "Diseño UX/UI", match: 82 },
    { id: 5, name: "Inteligencia Artificial", match: 80 }
  ],
  lastTestDate: "2024-02-12",
  testsCompleted: 1,
  downloadsCount: 2
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 transform transition-all hover:scale-105 hover:shadow-lg">
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string
};

const Profile = () => {
  const { user } = useAuth();

  const handleDownloadResults = () => {
    alert('Descargando resultados...');
  };

  const renderProfileHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 rounded-b-3xl shadow-lg">
      <div className="text-center">
        <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
          <UserCircleIcon className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-3xl font-bold">{user?.name || 'Juan Pérez'}</h1>
        <p className="text-indigo-100 mt-2">{user?.email || 'juan.perez@ejemplo.com'}</p>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      <StatCard 
        icon={AcademicCapIcon} 
        label="Tests Completados" 
        value={mockResults.testsCompleted} 
        color="text-green-500"
      />
      <StatCard 
        icon={ChartBarIcon} 
        label="Último Test" 
        value="12 Feb 2024" 
        color="text-blue-500"
      />
      <StatCard 
        icon={ArrowDownTrayIcon}
        label="Descargas" 
        value={mockResults.downloadsCount}
        color="text-purple-500"
      />
    </div>
  );

  const renderResultSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Test</h2>
      <div className="space-y-3">
        {mockResults.careers.map((career, index) => (
          <div 
            key={career.id} 
            className="bg-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200 transition"
          >
            <div>
              <span className="font-semibold text-gray-800">
                {index + 1}. {career.name}
              </span>
            </div>
            <span className={`font-bold ${
              career.match >= 90 ? 'text-green-600' : 
              career.match >= 80 ? 'text-indigo-600' : 
              'text-blue-600'
            }`}>
              {career.match}% Compatibilidad
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleDownloadResults}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 mt-6"
      >
        <ArrowDownTrayIcon className="h-6 w-6" />
        <span>Descargar Resultados Completos</span>
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderProfileHeader()}
      
      <div className="max-w-4xl mx-auto -mt-10 relative z-10 px-4">
        {renderStatistics()}
        
        <div className="mt-8">
          {renderResultSection()}
        </div>
      </div>
    </div>
  );
};

export default Profile;