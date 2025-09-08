const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/broker.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de brokers requieren autenticación
router.use(authenticateToken);

// Obtener todos los brokers (con búsqueda opcional por query params)
router.get('/', brokerController.getAllBrokers);

// Obtener brokers por rango de porcentaje
router.get('/porcentaje-range', brokerController.getBrokersByPorcentajeRange);

// Obtener brokers por letra
router.get('/letter/:letter', brokerController.getBrokersByLetter);

// Obtener un broker por ID
router.get('/:id', brokerController.getBrokerById);

// Crear un nuevo broker (solo ADMINISTRACIONes)
router.post('/', authorizeRoles('ADMINISTRACION'), brokerController.createBroker);

// Actualizar un broker (solo ADMINISTRACIONes)
router.put('/:id', authorizeRoles('ADMINISTRACION'), brokerController.updateBroker);

// Eliminar un broker (solo ADMINISTRACIONes)
router.delete('/:id', authorizeRoles('ADMINISTRACION'), brokerController.deleteBroker);

module.exports = router; 