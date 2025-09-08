const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de clientes requieren autenticación
router.use(authenticateToken);

// Obtener todos los clientes (con búsqueda opcional por query params)
router.get('/', clienteController.getAllClientes);







// Obtener un cliente por ID
router.get('/:id', clienteController.getClienteById);

// Crear un nuevo cliente (solo ADMINISTRACIONes)
router.post('/', authorizeRoles('ADMINISTRACION'), clienteController.createCliente);

// Actualizar un cliente (solo ADMINISTRACIONes)
router.put('/:id', authorizeRoles('ADMINISTRACION'), clienteController.updateCliente);

// Eliminar un cliente (solo ADMINISTRACIONes)
router.delete('/:id', authorizeRoles('ADMINISTRACION'), clienteController.deleteCliente);

// Buscar clientes por letra
router.get('/letter/:letter', clienteController.getClientesByLetter);

module.exports = router; 