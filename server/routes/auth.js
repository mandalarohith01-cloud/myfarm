import express from 'express';
import { 
  signup, 
  login, 
  getProfile, 
  refreshToken, 
  logout 
} from '../controllers/authController.js';
import { 
  validateSignup, 
  validateLogin, 
  sanitizeInput 
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (no authentication required)
router.post('/signup', authLimiter, sanitizeInput, validateSignup, signup);
router.post('/login', authLimiter, sanitizeInput, validateLogin, login);

// Protected routes (authentication required)
router.get('/profile', generalLimiter, authenticateToken, getProfile);
router.post('/refresh-token', generalLimiter, authenticateToken, refreshToken);
router.post('/logout', generalLimiter, authenticateToken, logout);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;