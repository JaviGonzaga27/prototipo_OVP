// src/pages/Home/index.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="flex justify-center mb-4">
        <Icon className="w-10 h-10 text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">
            Descubre Tu Vocación Profesional
          </h1>
          <p className="text-xl mb-8">
            Te ayudamos a encontrar el camino profesional que mejor se adapte a tus intereses y habilidades
          </p>
          <button 
            onClick={() => navigate('/questionnaire')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Comenzar Test Vocacional
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Cómo Funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={() => <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>}
            title="Completa el Cuestionario"
            description="Responde preguntas diseñadas para conocer tus intereses, habilidades y preferencias profesionales"
          />
          <FeatureCard
            icon={() => <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>}
            title="Análisis Personalizado"
            description="Nuestro sistema analiza tus respuestas utilizando algoritmos avanzados"
          />
          <FeatureCard
            icon={() => <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>}
            title="Recibe Recomendaciones"
            description="Obtén sugerencias de carreras y áreas profesionales que mejor se ajusten a tu perfil"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;