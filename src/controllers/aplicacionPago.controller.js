const AplicacionPago = require('../models/aplicacionPago.model');

// Obtener todas las aplicaciones de pago
exports.getAllAplicacionesPago = async (req, res) => {
  try {
    const aplicaciones = await AplicacionPago.findAll();
    res.json(aplicaciones);
  } catch (error) {
    console.error('Error al obtener aplicaciones de pago:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las aplicaciones de pago'
    });
  }
};

// Obtener una aplicación de pago por ID
exports.getAplicacionPagoById = async (req, res) => {
  try {
    const aplicacion = await AplicacionPago.findById(req.params.id);
    if (!aplicacion) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Aplicación de pago no encontrada'
      });
    }
    res.json(aplicacion);
  } catch (error) {
    console.error('Error al obtener aplicación de pago:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la aplicación de pago'
    });
  }
};

// Obtener aplicaciones de pago por operación
exports.getAplicacionesByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const aplicaciones = await AplicacionPago.findByOperacion(idOperacion);
    res.json(aplicaciones);
  } catch (error) {
    console.error('Error al obtener aplicaciones por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las aplicaciones de la operación'
    });
  }
};

// Obtener aplicaciones de pago por movimiento bancario
exports.getAplicacionesByMovimiento = async (req, res) => {
  try {
    const { idMovimiento } = req.params;
    const aplicaciones = await AplicacionPago.findByMovimientoBancario(idMovimiento);
    res.json(aplicaciones);
  } catch (error) {
    console.error('Error al obtener aplicaciones por movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las aplicaciones del movimiento bancario'
    });
  }
};

// Crear una nueva aplicación de pago
exports.createAplicacionPago = async (req, res) => {
  try {
    const {
      id_operacion,
      id_deposito,
      monto_aplicado
    } = req.body;

    // Validación básica
    if (!id_operacion || !id_deposito || !monto_aplicado) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_operacion, id_deposito, monto_aplicado'
      });
    }

    // Validar que monto_aplicado sea positivo
    if (monto_aplicado <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'monto_aplicado debe ser mayor a 0'
      });
    }

    // Verificar si ya existe una aplicación para esta operación y movimiento
    const aplicacionesExistentes = await AplicacionPago.findByOperacion(id_operacion);
    const yaExiste = aplicacionesExistentes.some(ap => ap.id_deposito === id_deposito);
    
    if (yaExiste) {
      return res.status(400).json({
        error: 'Aplicación duplicada',
        message: 'Ya existe una aplicación de pago para esta operación y movimiento bancario'
      });
    }

    const nuevaAplicacion = await AplicacionPago.create({
      id_operacion,
      id_deposito,
      monto_aplicado
    });

    res.status(201).json({
      message: 'Aplicación de pago creada exitosamente',
      aplicacion: nuevaAplicacion
    });
  } catch (error) {
    console.error('Error al crear aplicación de pago:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la aplicación de pago'
    });
  }
};

// Actualizar una aplicación de pago
exports.updateAplicacionPago = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_operacion,
      id_deposito,
      monto_aplicado
    } = req.body;

    // Validación básica
    if (!id_operacion || !id_deposito || !monto_aplicado) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_operacion, id_deposito, monto_aplicado'
      });
    }

    // Validar que monto_aplicado sea positivo
    if (monto_aplicado <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'monto_aplicado debe ser mayor a 0'
      });
    }

    const actualizado = await AplicacionPago.update(id, {
      id_operacion,
      id_deposito,
      monto_aplicado
    });

    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Aplicación de pago no encontrada'
      });
    }

    res.json({
      message: 'Aplicación de pago actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar aplicación de pago:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la aplicación de pago'
    });
  }
};

// Eliminar una aplicación de pago
exports.deleteAplicacionPago = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await AplicacionPago.delete(id);

    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Aplicación de pago no encontrada'
      });
    }

    res.json({
      message: 'Aplicación de pago eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar aplicación de pago:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la aplicación de pago'
    });
  }
};

// Obtener estadísticas de aplicaciones por operación
exports.getEstadisticasByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const estadisticas = await AplicacionPago.getEstadisticasByOperacion(idOperacion);
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de aplicaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas de aplicaciones'
    });
  }
};

// Obtener aplicaciones por rango de fechas
exports.getAplicacionesByDateRange = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan parámetros: fechaInicio y fechaFin'
      });
    }

    const aplicaciones = await AplicacionPago.findByDateRange(fechaInicio, fechaFin);
    res.json(aplicaciones);
  } catch (error) {
    console.error('Error al obtener aplicaciones por rango de fechas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las aplicaciones por rango de fechas'
    });
  }
};

// Verificar estado de aplicación de un movimiento bancario
exports.checkMovimientoAplicado = async (req, res) => {
  try {
    const { idMovimiento } = req.params;
    const estado = await AplicacionPago.checkMovimientoAplicado(idMovimiento);
    res.json(estado);
  } catch (error) {
    console.error('Error al verificar estado del movimiento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo verificar el estado del movimiento bancario'
    });
  }
}; 