const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Aplicar autenticación JWT a todas las rutas
router.use(authenticateToken);

// Rutas principales de facturas
// GET /api/facturas - Obtener todas las facturas con filtros y paginación
router.get('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getAllFacturas);

// GET /api/facturas/stats - Obtener estadísticas de facturas
router.get('/stats', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getFacturasStats);

// POST /api/facturas - Crear nueva factura
router.post('/', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.createFactura);

// GET /api/facturas/:id - Obtener factura por ID
router.get('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getFacturaById);

// PUT /api/facturas/:id - Actualizar factura
router.put('/:id', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.updateFactura);

// DELETE /api/facturas/:id - Eliminar factura
router.delete('/:id', authorizeRoles('ADMINISTRACION'), facturaController.deleteFactura);

// Rutas especiales de búsqueda
// GET /api/facturas/uuid/:uuid - Obtener factura por UUID
router.get('/uuid/:uuid', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getFacturaByUuid);

// GET /api/facturas/folio/:folio - Obtener factura por folio
router.get('/folio/:folio', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getFacturaByFolio);

// Rutas de relaciones
// GET /api/facturas/empresa/:id_empresa - Obtener facturas por empresa
router.get('/empresa/:id_empresa', authorizeRoles('ADMINISTRACION', 'FACTURACION'), facturaController.getFacturasByEmpresa);



module.exports = router; 