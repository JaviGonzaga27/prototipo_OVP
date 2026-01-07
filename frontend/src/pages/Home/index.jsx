import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  ChartBarSquareIcon, 
  AcademicCapIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Icon className="w-8 h-8 text-indigo-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
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
    <main className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Descubre Tu Verdadero
              <span className="block text-indigo-200">Camino Profesional</span>
            </h1>
            <p className="text-xl mb-10 text-indigo-100 leading-relaxed">
              Explora tus talentos y encuentra la carrera perfecta con nuestro test vocacional 
              personalizado. Toma decisiones informadas sobre tu futuro profesional.
            </p>
            <button 
              onClick={() => navigate('/questionnaire')}
              className="group inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Comenzar Test Vocacional
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Proceso Simple, Resultados Poderosos
          </h2>
          <p className="text-lg text-gray-600">
            Nuestro proceso está diseñado para ayudarte a descubrir tu verdadera vocación
            de manera efectiva y personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={ClipboardDocumentListIcon}
            title="Completa el Cuestionario"
            description="Responde a preguntas cuidadosamente diseñadas para entender tus intereses, habilidades y aspiraciones profesionales."
          />
          <FeatureCard
            icon={ChartBarSquareIcon}
            title="Análisis Personalizado"
            description="Nuestro sistema analiza tus respuestas utilizando algoritmos avanzados para identificar tus áreas de mayor potencial."
          />
          <FeatureCard
            icon={AcademicCapIcon}
            title="Recibe Recomendaciones"
            description="Obtén recomendaciones detalladas de carreras y áreas profesionales que mejor se alineen con tu perfil único."
          />
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Listo para descubrir tu vocación?
          </h3>
          <button 
            onClick={() => navigate('/questionnaire')}
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Empezar Ahora
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;