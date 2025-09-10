const ComisionBroker = require('../models/comisionBroker.model');

// Obtener todas las comisiones de broker
exports.getAllComisionesBroker = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findAll();
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones de broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones de broker'
    });
  }
};

// Obtener una comisión por ID
exports.getComisionBrokerById = async (req, res) => {
  try {
    const comision = await ComisionBroker.findById(req.params.id);
    if (!comision) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Comisión de broker no encontrada'
      });
    }
    res.json(comision);
  } catch (error) {
    console.error('Error al obtener comisión de broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la comisión de broker'
    });
  }
};

// Obtener comisiones por broker
exports.getComisionesBrokerByBroker = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findByBroker(req.params.idBroker);
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones por broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones del broker'
    });
  }
};

// Obtener comisiones por operación
exports.getComisionesBrokerByOperacion = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findByOperacion(req.params.idOperacion);
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones de la operación'
    });
  }
};

// Crear una nueva comisión de broker
exports.createComisionBroker = async (req, res) => {
  try {
    const {
      id_broker,
      id_operacion,
      comision,
      estatus,
      metodo_pago,
      fecha_pago
    } = req.body;

    // Validación básica
    if (!id_broker || !id_operacion || !comision) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_broker, id_operacion, comision'
      });
    }

    // Validar que comision sea un número positivo
    if (comision <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'comision debe ser un número positivo'
      });
    }

    // Validar estatus si se proporciona
    if (estatus && !['PENDIENTE', 'PAGADA', 'CANCELADA'].includes(estatus)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'estatus debe ser uno de: PENDIENTE, PAGADA, CANCELADA'
      });
    }

    // Validar metodo_pago si se proporciona
    if (metodo_pago && !['TRANSFERENCIA', 'EFECTIVO'].includes(metodo_pago)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'metodo_pago debe ser uno de: TRANSFERENCIA, EFECTIVO'
      });
    }

    // Validar fecha_pago si se proporciona
    if (fecha_pago) {
      const fecha = new Date(fecha_pago);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'fecha_pago debe tener un formato válido (YYYY-MM-DD)'
        });
      }
    }

    const nuevaComision = await ComisionBroker.create({
      id_broker,
      id_operacion,
      comision,
      estatus,
      metodo_pago,
      fecha_pago
    });

    res.status(201).json({
      message: 'Comisión de broker creada exitosamente',
      comision: nuevaComision
    });
  } catch (error) {
    console.error('Error al crear comisión de broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la comisión de broker'
    });
  }
};

// Actualizar una comisión de broker
exports.updateComisionBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar comision si se proporciona
    if (updateData.comision !== undefined && updateData.comision <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'comision debe ser un número positivo'
      });
    }

    // Validar estatus si se proporciona
    if (updateData.estatus && !['PENDIENTE', 'PAGADA', 'CANCELADA'].includes(updateData.estatus)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'estatus debe ser uno de: PENDIENTE, PAGADA, CANCELADA'
      });
    }

    // Validar metodo_pago si se proporciona
    if (updateData.metodo_pago && !['TRANSFERENCIA', 'EFECTIVO'].includes(updateData.metodo_pago)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'metodo_pago debe ser uno de: TRANSFERENCIA, EFECTIVO'
      });
    }

    // Validar fecha_pago si se proporciona
    if (updateData.fecha_pago) {
      const fecha = new Date(updateData.fecha_pago);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({
          error: 'Datos inválidos',
          message: 'fecha_pago debe tener un formato válido (YYYY-MM-DD)'
        });
      }
    }

    const actualizado = await ComisionBroker.update(id, updateData);
    
    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Comisión de broker no encontrada'
      });
    }

    // Obtener la comisión actualizada
    const comisionActualizada = await ComisionBroker.findById(id);
    
    res.json({
      message: 'Comisión de broker actualizada exitosamente',
      comision: comisionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar comisión de broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la comisión de broker'
    });
  }
};

// Eliminar una comisión de broker
exports.deleteComisionBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await ComisionBroker.delete(id);
    
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Comisión de broker no encontrada'
      });
    }

    res.json({
      message: 'Comisión de broker eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar comisión de broker:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la comisión de broker'
    });
  }
};

// Eliminar todas las comisiones de una operación
exports.deleteComisionesBrokerByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const eliminados = await ComisionBroker.deleteByOperacion(idOperacion);
    
    res.json({
      message: `${eliminados} comisiones de broker eliminadas exitosamente`,
      eliminados: eliminados
    });
  } catch (error) {
    console.error('Error al eliminar comisiones por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron eliminar las comisiones de broker'
    });
  }
};

// Obtener comisiones por estatus
exports.getComisionesBrokerByEstatus = async (req, res) => {
  try {
    const { estatus } = req.params;
    
    // Validar que el estatus sea válido
    if (!['PENDIENTE', 'PAGADA', 'CANCELADA'].includes(estatus)) {
      return res.status(400).json({
        error: 'Estatus inválido',
        message: 'El estatus debe ser uno de: PENDIENTE, PAGADA, CANCELADA'
      });
    }
    
    const comisiones = await ComisionBroker.findByEstatus(estatus);
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones por estatus:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones'
    });
  }
};

// Obtener comisiones pendientes
exports.getComisionesBrokerPendientes = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findPendientes();
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones pendientes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones pendientes'
    });
  }
};

// Obtener comisiones pagadas
exports.getComisionesBrokerPagadas = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findPagadas();
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones pagadas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones pagadas'
    });
  }
};

// Obtener comisiones canceladas
exports.getComisionesBrokerCanceladas = async (req, res) => {
  try {
    const comisiones = await ComisionBroker.findCanceladas();
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones canceladas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones canceladas'
    });
  }
};

// Obtener estadísticas de comisiones por broker
exports.getEstadisticasComisionesPorBroker = async (req, res) => {
  try {
    const { idBroker } = req.params;
    const estadisticas = await ComisionBroker.getEstadisticasPorBroker(idBroker);
    
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de comisiones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
};

// Obtener estadísticas generales de comisiones
exports.getEstadisticasComisionesGenerales = async (req, res) => {
  try {
    const estadisticas = await ComisionBroker.getEstadisticasGenerales();
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas generales'
    });
  }
};

// Obtener comisiones por rango de fechas
exports.getComisionesBrokerByRangoFechas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        message: 'Se requieren los parámetros fechaInicio y fechaFin'
      });
    }

    // Validar formato de fecha
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      return res.status(400).json({
        error: 'Formato de fecha inválido',
        message: 'Las fechas deben estar en formato YYYY-MM-DD'
      });
    }

    if (fechaInicioDate > fechaFinDate) {
      return res.status(400).json({
        error: 'Rango de fechas inválido',
        message: 'La fecha de inicio no puede ser mayor a la fecha de fin'
      });
    }

    const comisiones = await ComisionBroker.findByRangoFechas(fechaInicio, fechaFin);
    res.json(comisiones);
  } catch (error) {
    console.error('Error al obtener comisiones por rango de fechas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las comisiones'
    });
  }
};
