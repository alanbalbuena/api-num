const express = require('express');
const router = express.Router();
const conceptosFacturaController = require('../controllers/conceptosFactura.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de conceptos de factura requieren autenticación
router.use(authenticateToken);

// Rutas para conceptos de factura
router.get('/', conceptosFacturaController.getAllConceptosFactura);
router.get('/por-clave-sat', conceptosFacturaController.getConceptosPorClaveSat);
router.get('/por-clave-unidad', conceptosFacturaController.getConceptosPorClaveUnidad);
router.get('/operacion/:idOperacion', conceptosFacturaController.getConceptosFacturaByOperacion);
router.get('/operacion/:idOperacion/estadisticas', conceptosFacturaController.getEstadisticasConceptosPorOperacion);
router.get('/:id', conceptosFacturaController.getConceptoFacturaById);

// Rutas para crear y actualizar conceptos de factura
router.post('/', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  conceptosFacturaController.createConceptoFactura
);
router.put('/:id', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  conceptosFacturaController.updateConceptoFactura
);

// Rutas para eliminar conceptos de factura
router.delete('/:id', 
  authorizeRoles('ADMINISTRACION'), 
  conceptosFacturaController.deleteConceptoFactura
);
router.delete('/operacion/:idOperacion', 
  authorizeRoles('ADMINISTRACION'), 
  conceptosFacturaController.deleteConceptosFacturaByOperacion
);

module.exports = router;
