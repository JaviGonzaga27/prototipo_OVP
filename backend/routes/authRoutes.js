import express from 'express';
import { register, login, logout, getMe, changePassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/update-profile', protect, updateProfile);

export default router;
