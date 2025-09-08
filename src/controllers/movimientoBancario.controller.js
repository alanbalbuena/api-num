const { body, validationResult } = require('express-validator');
const MovimientoBancario = require('../models/movimientoBancario.model');

// Validaciones para crear/actualizar movimiento bancario
const movimientoBancarioValidation = [
  body('id_banco').notEmpty().withMessage('El ID de banco es requerido')
    .isInt({ min: 1 }).withMessage('El ID de banco debe ser un número entero positivo'),
  body('egreso').optional().isFloat({ min: 0 }).withMessage('El egreso debe ser un número positivo'),
  body('ingreso').optional().isFloat({ min: 0 }).withMessage('El ingreso debe ser un número positivo'),
  body('fecha').notEmpty().withMessage('La fecha es requerida')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida')
    .isLength({ min: 3, max: 255 }).withMessage('La descripción debe tener entre 3 y 255 caracteres'),
  body('referencia').optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 100 }).withMessage('La referencia no puede exceder 100 caracteres'),
  body('comentarios').optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 1000 }).withMessage('Los comentarios no pueden exceder 1000 caracteres'),
  body('id_factura').optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 }).withMessage('El ID de factura debe ser un número entero positivo'),
  body('id_usuario').notEmpty().withMessage('El ID de usuario es requerido')
    .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo')
];

// Obtener todos los movimientos
exports.getAllMovimientos = async (req, res) => {
  try {
    const filters = {
      id_banco: req.query.banco,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      id_usuario: req.query.usuario,
      tipo: req.query.tipo, // 'ingreso' o 'egreso'
      search: req.query.search || req.query.q
    };

    const movimientos = await MovimientoBancario.findAll(filters);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener un movimiento por ID
exports.getMovimientoById = async (req, res) => {
  try {
    const movimiento = await MovimientoBancario.findById(req.params.id);
    if (!movimiento) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Movimiento no encontrado'
      });
    }
    res.json(movimiento);
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el movimiento'
    });
  }
};

// Obtener movimientos por banco
exports.getMovimientosByBanco = async (req, res) => {
  try {
    const filters = {
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      tipo: req.query.tipo,
      search: req.query.search
    };

    const movimientos = await MovimientoBancario.findByBanco(req.params.bancoId, filters);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener movimientos por fecha
exports.getMovimientosByFecha = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.findByFecha(req.params.fecha);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por fecha:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener movimientos por rango de fechas
exports.getMovimientosByRangoFechas = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.params;
    const movimientos = await MovimientoBancario.findByRangoFechas(fecha_desde, fecha_hasta);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por rango de fechas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener movimientos por usuario
exports.getMovimientosByUsuario = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.findByUsuario(req.params.usuarioId);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener estadísticas de movimientos
exports.getMovimientosStats = async (req, res) => {
  try {
    const filters = {
      id_banco: req.query.banco,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };

    const stats = await MovimientoBancario.getStats(filters);
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
};

// Obtener resumen por banco
exports.getResumenPorBanco = async (req, res) => {
  try {
    const resumen = await MovimientoBancario.getResumenPorBanco();
    res.json(resumen);
  } catch (error) {
    console.error('Error al obtener resumen por banco:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el resumen'
    });
  }
};

// Obtener movimientos por factura
exports.getMovimientosByFactura = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.findByFactura(req.params.facturaId);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por factura:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Buscar movimientos por descripción
exports.searchMovimientosByDescripcion = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.searchByDescripcion(req.params.descripcion);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al buscar movimientos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron buscar los movimientos'
    });
  }
};

// Obtener movimientos del día
exports.getMovimientosHoy = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.getMovimientosHoy();
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos del día:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Obtener movimientos del mes actual
exports.getMovimientosMesActual = async (req, res) => {
  try {
    const movimientos = await MovimientoBancario.getMovimientosMesActual();
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos del mes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

// Crear un nuevo movimiento
exports.createMovimiento = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { 
      id_banco, 
      egreso, 
      ingreso, 
      fecha, 
      descripcion, 
      referencia, 
      comentarios, 
      id_factura, 
      id_usuario 
    } = req.body;

    // Validar que al menos uno de los dos (egreso o ingreso) tenga valor
    if ((!egreso || egreso === 0) && (!ingreso || ingreso === 0)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Debe especificar al menos un egreso o un ingreso'
      });
    }

    // Usar el ID del usuario autenticado si no se proporciona
    const usuarioId = id_usuario || req.user.id;

    const nuevoMovimiento = await MovimientoBancario.create({
      id_banco,
      egreso: egreso || 0,
      ingreso: ingreso || 0,
      fecha,
      descripcion,
      referencia,
      comentarios,
      id_factura,
      id_usuario: usuarioId
    });

    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el movimiento'
    });
  }
};

// Actualizar un movimiento
exports.updateMovimiento = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { 
      id_banco, 
      egreso, 
      ingreso, 
      fecha, 
      descripcion, 
      referencia, 
      comentarios, 
      id_factura, 
      id_usuario 
    } = req.body;
    const id = req.params.id;

    // Verificar si el movimiento existe
    const movimientoExistente = await MovimientoBancario.findById(id);
    if (!movimientoExistente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Movimiento no encontrado'
      });
    }

    // Validar que al menos uno de los dos (egreso o ingreso) tenga valor
    if ((!egreso || egreso === 0) && (!ingreso || ingreso === 0)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Debe especificar al menos un egreso o un ingreso'
      });
    }

    const actualizado = await MovimientoBancario.update(id, {
      id_banco,
      egreso: egreso || 0,
      ingreso: ingreso || 0,
      fecha,
      descripcion,
      referencia,
      comentarios,
      id_factura,
      id_usuario: id_usuario || req.user.id
    });

    if (!actualizado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el movimiento'
      });
    }

    // Obtener el movimiento actualizado
    const movimientoActualizado = await MovimientoBancario.findById(id);

    res.json({
      message: 'Movimiento actualizado exitosamente',
      movimiento: movimientoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el movimiento'
    });
  }
};

// Eliminar un movimiento
exports.deleteMovimiento = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar si el movimiento existe
    const movimientoExistente = await MovimientoBancario.findById(id);
    if (!movimientoExistente) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Movimiento no encontrado'
      });
    }

    const eliminado = await MovimientoBancario.delete(id);
    
    if (!eliminado) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el movimiento'
      });
    }

    res.json({
      message: 'Movimiento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el movimiento'
    });
  }
};

// Obtener movimientos por empresa
exports.getMovimientosByEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.empresaId;
    const filters = {
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      tipo: req.query.tipo,
      search: req.query.search
    };

    const movimientos = await MovimientoBancario.findByEmpresa(empresaId, filters);
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos por empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los movimientos'
    });
  }
};

module.exports = {
  getAllMovimientos: exports.getAllMovimientos,
  getMovimientoById: exports.getMovimientoById,
  getMovimientosByBanco: exports.getMovimientosByBanco,
  getMovimientosByEmpresa: exports.getMovimientosByEmpresa,
  getMovimientosByFecha: exports.getMovimientosByFecha,
  getMovimientosByRangoFechas: exports.getMovimientosByRangoFechas,
  getMovimientosByUsuario: exports.getMovimientosByUsuario,
  getMovimientosStats: exports.getMovimientosStats,
  getResumenPorBanco: exports.getResumenPorBanco,
  getMovimientosByFactura: exports.getMovimientosByFactura,
  searchMovimientosByDescripcion: exports.searchMovimientosByDescripcion,
  getMovimientosHoy: exports.getMovimientosHoy,
  getMovimientosMesActual: exports.getMovimientosMesActual,
  createMovimiento: exports.createMovimiento,
  updateMovimiento: exports.updateMovimiento,
  deleteMovimiento: exports.deleteMovimiento,
  movimientoBancarioValidation
}; 