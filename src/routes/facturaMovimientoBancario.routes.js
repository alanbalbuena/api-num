const express = require('express');
const router = express.Router();
const facturaMovimientoBancarioController = require('../controllers/facturaMovimientoBancario.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Aplicar autenticación JWT a todas las rutas
router.use(authenticateToken);

// Rutas principales de asignaciones
// GET /api/factura-movimiento-bancario - Obtener todas las asignaciones con filtros y paginación
router.get('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.getAllAsignaciones);

// POST /api/factura-movimiento-bancario - Asignar un movimiento bancario a una factura
router.post('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.asignarMovimiento);

// GET /api/factura-movimiento-bancario/:id - Obtener asignación específica
router.get('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.getAsignacionById);

// PUT /api/factura-movimiento-bancario/:id - Actualizar monto asignado
router.put('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.updateMontoAsignado);

// DELETE /api/factura-movimiento-bancario/:id - Eliminar asignación
router.delete('/:id', authorizeRoles('ADMINISTRACION'), facturaMovimientoBancarioController.eliminarAsignacion);

// Rutas de relaciones
// GET /api/factura-movimiento-bancario/factura/:id_factura - Obtener movimientos bancarios de una factura
router.get('/factura/:id_factura', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.getMovimientosByFactura);

// GET /api/factura-movimiento-bancario/movimiento/:id_movimiento_bancario - Obtener facturas de un movimiento bancario
router.get('/movimiento/:id_movimiento_bancario', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaMovimientoBancarioController.getFacturasByMovimiento);

module.exports = router; 