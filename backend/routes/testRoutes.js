import express from 'express';
import { 
  predictCareer,
  saveTestResults, 
  getMyResults, 
  getTestResultById 
} from '../controllers/testController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Ruta principal para predicción con ML
router.post('/predict', predictCareer);

// Rutas legacy
router.post('/results', saveTestResults);
router.get('/my-results', getMyResults);
router.get('/results/:id', getTestResultById);

export default router;
