const express = require('express');
const router = express.Router();
const esquemaController = require('../controllers/esquema.controller');
const { authenticateToken } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todos los esquemas
router.get('/', esquemaController.getAllEsquemas);

// Obtener esquemas por cliente
router.get('/cliente/:clienteId', esquemaController.getEsquemasByCliente);

// Obtener esquemas por razón social
router.get('/razon-social/:razonSocialId', esquemaController.getEsquemasByRazonSocial);

// Crear un nuevo esquema
router.post('/', esquemaController.createEsquema);

// Actualizar un esquema
router.put('/:id', esquemaController.updateEsquema);

// Eliminar un esquema
router.delete('/:id', esquemaController.deleteEsquema);

module.exports = router;
