const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/reportes/facturacion
 * @desc Obtener reporte de facturación
 * @access Private
 * @queryParams
 * - fecha_desde: Fecha de inicio (YYYY-MM-DD)
 * - fecha_hasta: Fecha de fin (YYYY-MM-DD)
 * - id_empresa: ID de la empresa (opcional)
 * - estado: Estado de la factura (PAGADA, PENDIENTE, CANCELADA)
 * - tipo_comprobante: Tipo de comprobante
 */
router.get('/facturacion', reportesController.getReporteFacturacion);

/**
 * @route GET /api/reportes/comisiones-brokers
 * @desc Obtener reporte de comisiones de brokers
 * @access Private
 * @queryParams
 * - fecha_desde: Fecha de inicio (YYYY-MM-DD)
 * - fecha_hasta: Fecha de fin (YYYY-MM-DD)
 * - id_broker: ID del broker (opcional)
 * - estatus: Estatus de la comisión (PAGADA, PENDIENTE, CANCELADA)
 */
router.get('/comisiones-brokers', reportesController.getReporteComisionesBrokers);

/**
 * @route GET /api/reportes/pagos
 * @desc Obtener reporte de pagos aplicados a facturas
 * @access Private
 * @queryParams
 * - fecha_desde: Fecha de inicio (YYYY-MM-DD)
 * - fecha_hasta: Fecha de fin (YYYY-MM-DD)
 * - id_empresa: ID de la empresa (opcional)
 * - metodo_pago: Método de pago
 */
router.get('/pagos', reportesController.getReportePagos);

/**
 * @route GET /api/reportes/consolidado
 * @desc Obtener reporte consolidado con todos los datos
 * @access Private
 * @queryParams
 * - fecha_desde: Fecha de inicio (YYYY-MM-DD)
 * - fecha_hasta: Fecha de fin (YYYY-MM-DD)
 * - id_empresa: ID de la empresa (opcional)
 */
router.get('/consolidado', reportesController.getReporteConsolidado);

module.exports = router;
