const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateChangePassword } = require('../validators/authValidator');
const { authenticate } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes (require authentication)
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validateChangePassword, authController.changePassword);

module.exports = router;