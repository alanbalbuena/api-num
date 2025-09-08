const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacaciones.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de vacaciones requieren autenticación
router.use(authenticateToken);

// Rutas para el historial de vacaciones
router.get('/', authorizeRoles('ADMINISTRACION'), vacacionesController.getAllVacaciones);
router.get('/usuario/:id', vacacionesController.getVacacionesByUsuarioId);

module.exports = router; 