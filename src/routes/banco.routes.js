const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/banco.controller');
const { bancoValidation } = require('../controllers/banco.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de bancos requieren autenticación
router.use(authenticateToken);

// Obtener todos los bancos (con búsqueda opcional por query params)
router.get('/', bancoController.getAllBancos);

// Obtener estadísticas de bancos
router.get('/stats', bancoController.getBancoStats);

// Obtener bancos por empresa
router.get('/empresa/:empresaId', bancoController.getBancosByEmpresa);

// Buscar bancos por nombre
router.get('/search/:nombre', bancoController.searchBancosByNombre);

// Obtener un banco por CLABE
router.get('/clabe/:clabe', bancoController.getBancoByClabe);

// Obtener un banco por ID
router.get('/:id', bancoController.getBancoById);

// Crear un nuevo banco (solo ADMINISTRACIONes)
router.post('/', authorizeRoles('ADMINISTRACION'), bancoValidation, bancoController.createBanco);

// Actualizar un banco (solo ADMINISTRACIONes)
router.put('/:id', authorizeRoles('ADMINISTRACION'), bancoValidation, bancoController.updateBanco);

// Eliminar un banco (solo ADMINISTRACIONes)
router.delete('/:id', authorizeRoles('ADMINISTRACION'), bancoController.deleteBanco);

module.exports = router; 