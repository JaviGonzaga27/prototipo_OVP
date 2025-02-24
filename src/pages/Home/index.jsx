// src/pages/Home/index.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Necesitarás instalar framer-motion

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg text-white"
    >
      <div className="flex justify-center mb-4">
        <Icon className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-100">{description}</p>
    </motion.div>
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
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              ¡Descubre Tu Futuro! 🚀
            </h1>
            <p className="text-xl mb-8">
              ¿No sabes qué estudiar? ¡Tranquilo! Te ayudamos a encontrar tu camino ideal.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/questionnaire')}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              ¡Comenzar el Test! 🎯
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            ¿Cómo Funciona? 🤔
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={() => <span className="text-4xl">📝</span>}
              title="¡Responde el Test!"
              description="Un test super fácil y divertido para conocer tus gustos y talentos"
            />
            <FeatureCard
              icon={() => <span className="text-4xl">🎯</span>}
              title="¡Obtén tu Match!"
              description="Nuestro sistema encontrará las carreras que mejor van contigo"
            />
            <FeatureCard
              icon={() => <span className="text-4xl">🌟</span>}
              title="¡Explora tus Opciones!"
              description="Descubre todo sobre las carreras que te recomendamos"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            ¡Únete a miles de estudiantes que ya encontraron su camino! 🎓
          </h3>
          <div className="flex justify-center space-x-4">
            <div className="bg-purple-700 px-6 py-3 rounded-lg text-white">
              <span className="text-2xl font-bold">10k+</span>
              <p>Estudiantes</p>
            </div>
            <div className="bg-purple-700 px-6 py-3 rounded-lg text-white">
              <span className="text-2xl font-bold">95%</span>
              <p>Satisfacción</p>
            </div>
            <div className="bg-purple-700 px-6 py-3 rounded-lg text-white">
              <span className="text-2xl font-bold">50+</span>
              <p>Carreras</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Testimonios */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Lo que dicen otros estudiantes 💭
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="bg-gray-800 p-6 rounded-xl text-white"
              >
                <p className="text-lg mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-gray-400">{testimonial.career}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const testimonials = [
  {
    text: "¡El test me ayudó muchísimo! Ahora estoy super segura de lo que quiero estudiar 💪",
    name: "Ana García",
    career: "Futura Diseñadora",
    avatar: "👩"
  },
  {
    text: "Estaba super perdido, pero después del test todo se aclaró. ¡100% recomendado! 🙌",
    name: "Carlos López",
    career: "Futuro Ingeniero",
    avatar: "👨"
  },
  {
    text: "La mejor decisión que tomé fue hacer este test. ¡Me encantaron las recomendaciones! ⭐",
    name: "María Rodríguez",
    career: "Futura Psicóloga",
    avatar: "👩"
  }
];

export default Home;