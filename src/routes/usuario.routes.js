const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorizeRoles, authorizeUserOrAdmin } = require('../middleware/auth');

// Rutas protegidas para usuarios
router.get('/', authenticateToken, authorizeRoles('ADMINISTRACION'), usuarioController.getAllUsuarios);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, usuarioController.getUsuarioById);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRACION'), usuarioController.createUsuario);
router.put('/:id', authenticateToken, authorizeUserOrAdmin, usuarioController.updateUsuario);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRACION'), usuarioController.deleteUsuario);

module.exports = router; 