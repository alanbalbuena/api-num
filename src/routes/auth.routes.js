const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas públicas de autenticación
router.post('/login', authController.loginValidation, authController.login);
router.post('/register', authenticateToken, authorizeRoles('ADMINISTRACION'), authController.registerValidation, authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router; 