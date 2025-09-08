const express = require('express');
const router = express.Router();
const RazonSocialController = require('../controllers/razonSocial.controller');
const { authenticateToken } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Crear nueva razón social
router.post('/', RazonSocialController.create);

// Obtener todas las razones sociales
router.get('/', RazonSocialController.getAll);

// Obtener todas las razones sociales con sus esquemas
router.get('/con-esquemas', RazonSocialController.getAllWithEsquemas);

// Obtener razón social por ID
router.get('/:id', RazonSocialController.getById);

// Obtener razón social por ID con sus esquemas
router.get('/:id/esquemas', RazonSocialController.getByIdWithEsquemas);

// Obtener razones sociales por cliente
router.get('/cliente/:clienteId', RazonSocialController.getByClienteId);

// Buscar razón social por RFC
router.get('/rfc/:rfc', RazonSocialController.getByRfc);

// Actualizar razón social
router.put('/:id', RazonSocialController.update);

// Eliminar razón social
router.delete('/:id', RazonSocialController.delete);

module.exports = router;
