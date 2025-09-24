const express = require('express');
const router = express.Router();
const operacionController = require('../controllers/operacion.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadSingleImage, handleUploadError } = require('../middleware/upload');

// Todas las rutas de operaciones requieren autenticación
router.use(authenticateToken);

// Rutas para operaciones
router.get('/', operacionController.getAllOperaciones);
router.get('/no-completamente-pagadas', operacionController.getOperacionesNoCompletamentePagadas);
router.get('/:id', operacionController.getOperacionById);

// Rutas para crear y actualizar operaciones (con soporte para imágenes)
router.post('/', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  uploadSingleImage, 
  handleUploadError, 
  operacionController.createOperacion
);
router.put('/:id', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  uploadSingleImage, 
  handleUploadError, 
  operacionController.updateOperacion
);

router.delete('/:id', authorizeRoles('ADMINISTRACION'), operacionController.deleteOperacion);

// Rutas específicas para manejo de imágenes (mantener compatibilidad)
router.post('/:id/imagen', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  uploadSingleImage, 
  handleUploadError, 
  operacionController.uploadImagen
);
router.delete('/:id/imagen', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  operacionController.deleteImagen
);

// Ruta para recalcular saldo de una operación
router.post('/:id/recalcular-saldo', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  operacionController.recalcularSaldo
);

// Ruta para recalcular comisiones de una operación
router.post('/:id/recalcular-comisiones', 
  authorizeRoles('ADMINISTRACION', 'FACTURACION'), 
  operacionController.recalcularComisiones
);

module.exports = router; 