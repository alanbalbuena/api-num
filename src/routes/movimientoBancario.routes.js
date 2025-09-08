const express = require('express');
const router = express.Router();
const movimientoBancarioController = require('../controllers/movimientoBancario.controller');
const { movimientoBancarioValidation } = require('../controllers/movimientoBancario.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Todas las rutas de movimientos bancarios requieren autenticación
router.use(authenticateToken);

// Obtener todos los movimientos (con filtros opcionales por query params)
router.get('/', movimientoBancarioController.getAllMovimientos);

// Obtener estadísticas de movimientos
router.get('/stats', movimientoBancarioController.getMovimientosStats);

// Obtener resumen por banco
router.get('/resumen-banco', movimientoBancarioController.getResumenPorBanco);

// Obtener movimientos del día
router.get('/hoy', movimientoBancarioController.getMovimientosHoy);

// Obtener movimientos del mes actual
router.get('/mes-actual', movimientoBancarioController.getMovimientosMesActual);

// Obtener movimientos por banco
router.get('/banco/:bancoId', movimientoBancarioController.getMovimientosByBanco);

// Obtener movimientos por empresa
router.get('/empresa/:empresaId', movimientoBancarioController.getMovimientosByEmpresa);

// Obtener movimientos por fecha
router.get('/fecha/:fecha', movimientoBancarioController.getMovimientosByFecha);

// Obtener movimientos por rango de fechas
router.get('/rango/:fecha_desde/:fecha_hasta', movimientoBancarioController.getMovimientosByRangoFechas);

// Obtener movimientos por usuario
router.get('/usuario/:usuarioId', movimientoBancarioController.getMovimientosByUsuario);

// Obtener movimientos por factura
router.get('/factura/:facturaId', movimientoBancarioController.getMovimientosByFactura);

// Buscar movimientos por descripción
router.get('/search/:descripcion', movimientoBancarioController.searchMovimientosByDescripcion);

// Obtener un movimiento por ID
router.get('/:id', movimientoBancarioController.getMovimientoById);

// Crear un nuevo movimiento (solo ADMINISTRACIONes y contadores)
router.post('/', authorizeRoles('ADMINISTRACION', 'CONTADOR'), movimientoBancarioValidation, movimientoBancarioController.createMovimiento);

// Actualizar un movimiento (solo ADMINISTRACIONes y contadores)
router.put('/:id', authorizeRoles('ADMINISTRACION', 'CONTADOR'), movimientoBancarioValidation, movimientoBancarioController.updateMovimiento);

// Eliminar un movimiento (solo ADMINISTRACIONes)
router.delete('/:id', authorizeRoles('ADMINISTRACION'), movimientoBancarioController.deleteMovimiento);

module.exports = router; 