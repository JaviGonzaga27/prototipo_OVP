// src/pages/Profile/index.jsx
import PropTypes from 'prop-types';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { useAuth } from '../../context/AuthContext';

const StatBox = ({ label, value }) => (
  <div className="p-4 border rounded-lg text-center w-full md:w-1/3">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

// Agregamos PropTypes para StatBox
StatBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const Profile = () => {
  const { state } = useQuestionnaire();
  const { user } = useAuth();

  const handleDownloadResults = () => {
    // Lógica para descargar resultados
    console.log('Descargando resultados...');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <div className="border-t border-b py-8 my-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <StatBox label="Tests Completados" value="1" />
          <StatBox label="Último Test" value="2024-02-11" />
        </div>
      </div>

      {state.results && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Últimos Resultados</h2>
          <div className="space-y-4">
            {state.results.careers.slice(0, 3).map(career => (
              <div key={career.id} className="flex justify-between items-center">
                <span className="font-medium">{career.name}</span>
                <span className="text-indigo-600">{career.match}% de compatibilidad</span>
              </div>
            ))}
            <button
              onClick={handleDownloadResults}
              className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Descargar Resultados Completos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;