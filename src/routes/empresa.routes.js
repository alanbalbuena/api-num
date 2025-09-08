const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresa.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de empresas requieren autenticación
router.use(authenticateToken);

// Obtener todas las empresas (con búsqueda opcional por query params)
router.get('/', empresaController.getAllEmpresas);

// Obtener una empresa por ID
router.get('/:id', empresaController.getEmpresaById);

// Obtener una empresa por RFC
router.get('/rfc/:rfc', empresaController.getEmpresaByRfc);

// Crear una nueva empresa (solo ADMINISTRACIONes)
router.post('/', authorizeRoles('ADMINISTRACION'), empresaController.createEmpresa);

// Actualizar una empresa (solo ADMINISTRACIONes)
router.put('/:id', authorizeRoles('ADMINISTRACION'), empresaController.updateEmpresa);

// Eliminar una empresa (solo ADMINISTRACIONes)
router.delete('/:id', authorizeRoles('ADMINISTRACION'), empresaController.deleteEmpresa);

module.exports = router; 