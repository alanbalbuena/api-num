const express = require('express');
const router = express.Router();
const aplicacionPagoController = require('../controllers/aplicacionPago.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de aplicaciones de pago requieren autenticación
router.use(authenticateToken);

// Rutas para aplicaciones de pago
router.get('/', aplicacionPagoController.getAllAplicacionesPago);
router.get('/:id', aplicacionPagoController.getAplicacionPagoById);
router.get('/operacion/:idOperacion', aplicacionPagoController.getAplicacionesByOperacion);
router.get('/movimiento/:idMovimiento', aplicacionPagoController.getAplicacionesByMovimiento);
router.get('/estadisticas/operacion/:idOperacion', aplicacionPagoController.getEstadisticasByOperacion);
router.get('/fechas/rango', aplicacionPagoController.getAplicacionesByDateRange);
router.get('/movimiento/:idMovimiento/estado', aplicacionPagoController.checkMovimientoAplicado);

// Rutas que requieren permisos específicos
router.post('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), aplicacionPagoController.createAplicacionPago);
router.put('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), aplicacionPagoController.updateAplicacionPago);
router.delete('/:id', authorizeRoles('ADMINISTRACION'), aplicacionPagoController.deleteAplicacionPago);

module.exports = router; 