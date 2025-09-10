const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Importar rutas de diferentes módulos
const usuarioRoutes = require('./usuario.routes');
const empresaRoutes = require('./empresa.routes');
const clienteRoutes = require('./cliente.routes');
const brokerRoutes = require('./broker.routes');
const operacionRoutes = require('./operacion.routes');
const vacacionesRoutes = require('./vacaciones.routes');
const bancoRoutes = require('./banco.routes');
const movimientoBancarioRoutes = require('./movimientoBancario.routes');
const facturaRoutes = require('./factura.routes');
const facturaMovimientoBancarioRoutes = require('./facturaMovimientoBancario.routes');
const retornoRoutes = require('./retorno.routes');
const aplicacionPagoRoutes = require('./aplicacionPago.routes');
const razonSocialRoutes = require('./razonSocial.routes');
const esquemaRoutes = require('./esquema.routes');
const conceptosFacturaRoutes = require('./conceptosFactura.routes');
const comisionBrokerRoutes = require('./comisionBroker.routes');

// Todas las rutas de la API requieren autenticación
router.use(authenticateToken);

// Montar las rutas de cada módulo
router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/clientes', clienteRoutes);
router.use('/brokers', brokerRoutes);
router.use('/operaciones', operacionRoutes);
router.use('/vacaciones', vacacionesRoutes);
router.use('/bancos', bancoRoutes);
router.use('/movimientos-bancarios', movimientoBancarioRoutes);
router.use('/facturas', facturaRoutes);
router.use('/factura-movimiento-bancario', facturaMovimientoBancarioRoutes);
router.use('/retornos', retornoRoutes);
router.use('/aplicacion-pagos', aplicacionPagoRoutes);
router.use('/razones-sociales', razonSocialRoutes);
router.use('/esquemas', esquemaRoutes);
router.use('/conceptos-factura', conceptosFacturaRoutes);
router.use('/comision-broker', comisionBrokerRoutes);

// Ejemplo de ruta GET
router.get('/status', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    user: req.user
  });
});

// Ejemplo de ruta POST
router.post('/echo', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "message" es requerido'
    });
  }

  res.json({
    echo: message,
    timestamp: new Date().toISOString(),
    user: req.user
  });
});

module.exports = router; 