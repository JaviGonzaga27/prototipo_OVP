// src/pages/Profile/index.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

function StatBox({ label, value, icon }) {
 return (
   <motion.div 
     whileHover={{ scale: 1.05 }}
     className="p-6 bg-white rounded-xl shadow-lg text-center"
   >
     <span className="text-3xl mb-2 block">{icon}</span>
     <div className="text-2xl font-bold text-gray-800">{value}</div>
     <div className="text-gray-600 text-sm">{label}</div>
   </motion.div>
 );
}

function ResultCard({ career }) {
 return (
   <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
     <div className="flex justify-between items-center mb-4">
       <h3 className="text-xl font-bold text-gray-800">{career.name}</h3>
       <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
         {career.match}% Match
       </span>
     </div>
     <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
       <div 
         className="bg-purple-600 h-2 rounded-full"
         style={{ width: `${career.match}%` }}
       />
     </div>
     <p className="text-gray-600">{career.description}</p>
   </div>
 );
}

function Profile() {
 const { user } = useAuth();
 const [activeTab, setActiveTab] = useState('results');
 const [showConfirmDownload, setShowConfirmDownload] = useState(false);

 const mockUserStats = {
   testsCompleted: "3",
   lastTestDate: "14 Feb 2025",
   totalTime: "45 min"
 };

 const mockResults = {
   careers: [
     {
       name: "Ingeniería en Sistemas 💻",
       match: 95,
       description: "Perfecta para mentes analíticas que disfrutan resolviendo problemas tecnológicos."
     },
     {
       name: "Diseño Digital 🎨",
       match: 85,
       description: "Combina creatividad y tecnología para crear experiencias visuales."
     },
     {
       name: "Marketing Digital 📱",
       match: 80,
       description: "Para quienes disfrutan combinando creatividad con análisis de datos."
     }
   ]
 };

 const handleDownloadResults = () => {
   setShowConfirmDownload(true);
   // Lógica para descargar resultados
 };

 return (
   <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-10 px-4">
     <div className="max-w-4xl mx-auto">
       {/* Header */}
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center mb-12"
       >
         <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
           <span className="text-4xl text-white">{user?.name?.charAt(0) || 'U'}</span>
         </div>
         <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
         <p className="text-gray-600">{user?.email}</p>
       </motion.div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <StatBox 
           label="Tests Completados"
           value={mockUserStats.testsCompleted}
           icon="📝"
         />
         <StatBox 
           label="Último Test"
           value={mockUserStats.lastTestDate}
           icon="📅"
         />
         <StatBox 
           label="Tiempo Total"
           value={mockUserStats.totalTime}
           icon="⏱️"
         />
       </div>

       {/* Tabs */}
       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
         <div className="flex space-x-4 mb-6">
           <button
             onClick={() => setActiveTab('results')}
             className={`px-4 py-2 rounded-lg font-medium transition-colors
               ${activeTab === 'results' 
                 ? 'bg-purple-100 text-purple-600' 
                 : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Resultados 📊
           </button>
           <button
             onClick={() => setActiveTab('preferences')}
             className={`px-4 py-2 rounded-lg font-medium transition-colors
               ${activeTab === 'preferences' 
                 ? 'bg-purple-100 text-purple-600' 
                 : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Preferencias ⚙️
           </button>
         </div>

         <AnimatePresence mode='wait'>
           {activeTab === 'results' && (
             <motion.div
               key="results"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
             >
               <div className="space-y-4">
                 {mockResults.careers.map((career, index) => (
                   <ResultCard key={index} career={career} />
                 ))}
               </div>

               <button
                 onClick={handleDownloadResults}
                 className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
               >
                 Descargar Resultados Completos 📥
               </button>
             </motion.div>
           )}

           {activeTab === 'preferences' && (
             <motion.div
               key="preferences"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-6"
             >
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800">Personalización</h3>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                   <span>Modo Oscuro</span>
                   <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                     <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" />
                   </button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                   <span>Notificaciones</span>
                   <button className="w-12 h-6 bg-purple-600 rounded-full relative">
                     <span className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                   </button>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>

     {/* Modal de confirmación de descarga */}
     <AnimatePresence>
       {showConfirmDownload && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
         >
           <motion.div
             initial={{ scale: 0.9 }}
             animate={{ scale: 1 }}
             exit={{ scale: 0.9 }}
             className="bg-white rounded-xl p-6 max-w-md w-full"
           >
             <h3 className="text-xl font-bold mb-4">Descargar Resultados</h3>
             <p className="text-gray-600 mb-6">
               ¿Deseas descargar un PDF con tus resultados completos?
             </p>
             <div className="flex space-x-4">
               <button
                 onClick={() => setShowConfirmDownload(false)}
                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
               >
                 Cancelar
               </button>
               <button
                 onClick={() => {
                   // Lógica de descarga
                   setShowConfirmDownload(false);
                 }}
                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
               >
                 Descargar
               </button>
             </div>
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
   </div>
 );
}

// PropTypes
StatBox.propTypes = {
 label: PropTypes.string.isRequired,
 value: PropTypes.string.isRequired,
 icon: PropTypes.string.isRequired
};

ResultCard.propTypes = {
 career: PropTypes.shape({
   name: PropTypes.string.isRequired,
   match: PropTypes.number.isRequired,
   description: PropTypes.string.isRequired
 }).isRequired
};

export default Profile;