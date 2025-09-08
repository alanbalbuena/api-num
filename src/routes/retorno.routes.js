const express = require('express');
const router = express.Router();
const retornoController = require('../controllers/retorno.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de retornos requieren autenticación
router.use(authenticateToken);

// Rutas para retornos
router.get('/', retornoController.getAllRetornos);
router.get('/:id', retornoController.getRetornoById);
router.get('/operacion/:idOperacion', retornoController.getRetornosByOperacion);
router.get('/estadisticas/operacion/:idOperacion', retornoController.getEstadisticasByOperacion);
router.get('/fechas/rango', retornoController.getRetornosByDateRange);

// Rutas que requieren permisos específicos
router.post('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), retornoController.createRetorno);
router.put('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), retornoController.updateRetorno);
router.delete('/:id', authorizeRoles('ADMINISTRACION'), retornoController.deleteRetorno);

module.exports = router; 