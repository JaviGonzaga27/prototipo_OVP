import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getAllTestResults,
  getUserTestResults,
  getStats
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y ser admin
router.use(protect, adminOnly);

// Rutas de usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Rutas de resultados
router.get('/results', getAllTestResults);
router.get('/results/:userId', getUserTestResults);

// Estadísticas
router.get('/stats', getStats);

export default router;
