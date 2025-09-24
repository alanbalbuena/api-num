const Retorno = require('../models/retorno.model');

// Obtener todos los retornos
exports.getAllRetornos = async (req, res) => {
  try {
    const retornos = await Retorno.findAll();
    res.json(retornos);
  } catch (error) {
    console.error('Error al obtener retornos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los retornos'
    });
  }
};

// Obtener un retorno por ID
exports.getRetornoById = async (req, res) => {
  try {
    const retorno = await Retorno.findById(req.params.id);
    if (!retorno) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Retorno no encontrado'
      });
    }
    res.json(retorno);
  } catch (error) {
    console.error('Error al obtener retorno:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el retorno'
    });
  }
};

// Obtener retornos por operación
exports.getRetornosByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const retornos = await Retorno.findByOperacion(idOperacion);
    res.json(retornos);
  } catch (error) {
    console.error('Error al obtener retornos por operación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los retornos de la operación'
    });
  }
};

// Crear un nuevo retorno
exports.createRetorno = async (req, res) => {
  try {
    const {
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia
    } = req.body;

    // Validación básica
    if (!id_operacion || !fecha_pago || !monto_pagado || !metodo_pago) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_operacion, fecha_pago, monto_pagado, metodo_pago'
      });
    }

    // Validar que monto_pagado sea positivo
    if (monto_pagado <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'monto_pagado debe ser mayor a 0'
      });
    }

    // Validar que metodo_pago sea válido
    const metodosPagoValidos = ['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'TARJETA', 'DEPOSITO'];
    if (!metodosPagoValidos.includes(metodo_pago)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'metodo_pago debe ser uno de: EFECTIVO, TRANSFERENCIA, CHEQUE, TARJETA, DEPOSITO'
      });
    }

    // Validar formato de fecha
    const fechaPago = new Date(fecha_pago);
    if (isNaN(fechaPago.getTime())) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'fecha_pago debe tener un formato válido (YYYY-MM-DD)'
      });
    }

    // Procesar imagen si se subió
    let comprobante_pago = null;
    if (req.file) {
      comprobante_pago = `/uploads/${req.file.filename}`;
    }

    const nuevoRetorno = await Retorno.create({
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia: referencia || null,
      comprobante_pago
    });

    res.status(201).json({
      message: 'Retorno creado exitosamente',
      retorno: nuevoRetorno
    });
  } catch (error) {
    console.error('Error al crear retorno:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el retorno'
    });
  }
};

// Actualizar un retorno
exports.updateRetorno = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia
    } = req.body;

    // Validación básica
    if (!id_operacion || !fecha_pago || !monto_pagado || !metodo_pago) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan campos obligatorios: id_operacion, fecha_pago, monto_pagado, metodo_pago'
      });
    }

    // Validar que monto_pagado sea positivo
    if (monto_pagado <= 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'monto_pagado debe ser mayor a 0'
      });
    }

    // Validar que metodo_pago sea válido
    const metodosPagoValidos = ['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'TARJETA', 'DEPOSITO'];
    if (!metodosPagoValidos.includes(metodo_pago)) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'metodo_pago debe ser uno de: EFECTIVO, TRANSFERENCIA, CHEQUE, TARJETA, DEPOSITO'
      });
    }

    // Procesar imagen si se subió
    let comprobante_pago = null;
    if (req.file) {
      comprobante_pago = `/uploads/${req.file.filename}`;
    }

    const actualizado = await Retorno.update(id, {
      id_operacion,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      referencia: referencia || null,
      comprobante_pago
    });

    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Retorno no encontrado'
      });
    }

    res.json({
      message: 'Retorno actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar retorno:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el retorno'
    });
  }
};

// Eliminar un retorno
exports.deleteRetorno = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Retorno.delete(id);

    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Retorno no encontrado'
      });
    }

    res.json({
      message: 'Retorno eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar retorno:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el retorno'
    });
  }
};

// Obtener estadísticas de retornos por operación
exports.getEstadisticasByOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;
    const estadisticas = await Retorno.getEstadisticasByOperacion(idOperacion);
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de retornos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas de retornos'
    });
  }
};

// Obtener retornos por rango de fechas
exports.getRetornosByDateRange = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Faltan parámetros: fechaInicio y fechaFin'
      });
    }

    const retornos = await Retorno.findByDateRange(fechaInicio, fechaFin);
    res.json(retornos);
  } catch (error) {
    console.error('Error al obtener retornos por rango de fechas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los retornos por rango de fechas'
    });
  }
};