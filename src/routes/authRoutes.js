import express from 'express';
import { registerUser, verifyOTP, sendPasswordResetEmail, resetPassword, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Registration Route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/send-password-reset-email', sendPasswordResetEmail);
router.post('/reset-password', resetPassword);

export default router;
