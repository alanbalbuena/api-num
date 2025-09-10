const express = require('express');
const router = express.Router();
const comisionBrokerController = require('../controllers/comisionBroker.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de comisiones de broker requieren autenticación
router.use(authenticateToken);

// Rutas para comisiones de broker
router.get('/', comisionBrokerController.getAllComisionesBroker);
router.get('/estadisticas-generales', comisionBrokerController.getEstadisticasComisionesGenerales);
router.get('/estatus/:estatus', comisionBrokerController.getComisionesBrokerByEstatus);
router.get('/pendientes', comisionBrokerController.getComisionesBrokerPendientes);
router.get('/pagadas', comisionBrokerController.getComisionesBrokerPagadas);
router.get('/canceladas', comisionBrokerController.getComisionesBrokerCanceladas);
router.get('/broker/:idBroker', comisionBrokerController.getComisionesBrokerByBroker);
router.get('/broker/:idBroker/estadisticas', comisionBrokerController.getEstadisticasComisionesPorBroker);
router.get('/operacion/:idOperacion', comisionBrokerController.getComisionesBrokerByOperacion);
router.get('/rango-fechas', comisionBrokerController.getComisionesBrokerByRangoFechas);
router.get('/:id', comisionBrokerController.getComisionBrokerById);

// Rutas para crear y actualizar comisiones de broker
router.post('/', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  comisionBrokerController.createComisionBroker
);
router.put('/:id', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  comisionBrokerController.updateComisionBroker
);

// Rutas para eliminar comisiones de broker
router.delete('/:id', 
  authorizeRoles('ADMINISTRACION'), 
  comisionBrokerController.deleteComisionBroker
);
router.delete('/operacion/:idOperacion', 
  authorizeRoles('ADMINISTRACION'), 
  comisionBrokerController.deleteComisionesBrokerByOperacion
);

module.exports = router;
