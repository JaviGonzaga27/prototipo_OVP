import express from 'express';
import {
  getActiveQuestions,
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus
} from '../controllers/questionController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas para estudiantes (solo preguntas activas)
router.get('/', protect, getActiveQuestions);

// Rutas de administrador
router.get('/all', protect, adminOnly, getAllQuestions);
router.get('/:id', protect, adminOnly, getQuestionById);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);
router.patch('/:id/toggle', protect, adminOnly, toggleQuestionStatus);

export default router;
